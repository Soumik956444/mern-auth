import { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  // Initialize isLoggedIn state; will be updated after verifying cookie token on mount
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // Initialize userData; null indicates no user loaded yet
  const [userData, setUserData] = useState(null)


// Function to fetch user data from server using cookie-based auth
const getUserData = async () => {

  try{

    // Ensure axios sends cookies with requests (important for auth middleware)
    axios.defaults.withCredentials = true
    const {data} = await axios.get(backendUrl + '/api/user/data')
    // If server returns success, update user data and mark as logged in
    if (data.success) {
      setUserData(data.userData)
      setIsLoggedIn(true)
    } else {
      // If not successful, clear user state. Avoid showing a toast for expected unauthenticated states.
      setUserData(null)
      setIsLoggedIn(false)
      if (data.message && data.message !== 'Not Authorized. Login Again') {
        toast.error(data.message)
      }
    }

  } catch (error) {
    // On error (e.g., network or token invalid), clear login state and show error unless the request was unauthorized.
    setUserData(null)
    setIsLoggedIn(false)
    const isUnauthorized = error.response?.status === 401 || error.response?.data?.message === 'Not Authorized. Login Again'
    if (!isUnauthorized) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
}

// Run once on initial mount to verify if the user is still logged in (preserve login across reloads)
useEffect(() => {
  // Call getUserData to rely on server cookie for auth and restore state
  getUserData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData
  }

  return (

  
    < AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}












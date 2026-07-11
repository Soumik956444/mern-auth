import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";

export const AppContext = createContext();

axios.defaults.withCredentials = true

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(false)


const getUserData = async () => {

  try{

    const {data} = await axios.get(backendUrl + '/api/user/data')
    data.success ? setUserData(data.userData) : toast.error(data.message)

  }catch (error) {

    toast.error(error.response?.data?.message || error.message)
  }
}

// Check auth state on load so a valid cookie keeps the user logged in after refresh
const getAuthState = async () => {
  try {
    const {data} = await axios.post(backendUrl + '/api/auth/is-auth')
    if (data.success) {
      setIsLoggedIn(true)
      getUserData()
    }
  } catch (error) {
    // not logged in — leave state as-is, don't toast on every load
  }
}

const logout = async () => {
  try {
    const {data} = await axios.post(backendUrl + '/api/auth/logout')
    if (data.success) {
      setIsLoggedIn(false)
      setUserData(false)
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message)
  }
}

useEffect(() => {
  getAuthState()
}, [])


  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    logout
  }

  return (

  
    < AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}












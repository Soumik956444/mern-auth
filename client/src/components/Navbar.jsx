import { useContext } from 'react'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'


const Navbar = () => {
  const navigate = useNavigate()
  const { backendUrl, isLoggedIn, setIsLoggedIn, setUserData } = useContext(AppContext)

  const handleLogout = async () => {
    try {
      await axios.post(backendUrl + '/api/auth/logout', {}, {
        withCredentials: true
      })
    } catch (error) {
      // We still clear the client-side auth state even if logout request fails
      console.error('Logout failed:', error)
    } finally {
      setIsLoggedIn(false)
      setUserData(null)
      navigate('/login')
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>

      <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className='w-28 sm:w-32 cursor-pointer'/>

      {isLoggedIn ? (
        <button onClick={handleLogout} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'> Logout <img src={assets.arrow_icon} alt="" /></button>
      ) : (
        <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'> Login <img src={assets.arrow_icon} alt="" /></button>
      )}
    </div>
  )
}

export default Navbar






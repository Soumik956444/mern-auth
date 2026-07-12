// client/src/components/Navbar.jsx — top navigation bar
// - shows login/logout button based on AppContext.isLoggedIn
// - provides quick navigation to login or home

import { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'


const Navbar = () => {
  const navigate = useNavigate()
  const {isLoggedIn, logout} = useContext(AppContext)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
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






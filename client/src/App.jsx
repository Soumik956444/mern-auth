import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import login from './components/Login'
import EmailVerify from './components/EmailVerify'
import ResetPPassword from './components/ResetPassword'

const App = () => {
  return (
    <div>
      <Routes>
        <Routes path='/' element={<Home/>}/>
        <Routes path='/login' element={<Login/>}/>
        <Routes path='/email-verify' element={<EmailVerify/>}/>
        <Routes path='/reset-password' element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App


// facing routing issue     Date: 4th June 2026
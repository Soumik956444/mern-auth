import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './components/Home.jsx'
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
// video will resumr at 2hours 41minutes and 7 seconds.
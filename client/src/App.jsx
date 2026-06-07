import React from "react"
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword"

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="./" element={<Home/>}/>
          <Route path="./login" element={<Login/>}/>
          <Route path="./email-verify" element={<EmailVerify/>}/>
          <Route path="./reset-password" element={<ResetPassword/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App









// // facing routing issue     Date: 4th June 2026
// // video will resume at 2 hours and 40 minutes in the video.








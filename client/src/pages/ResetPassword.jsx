// client/src/pages/ResetPassword.jsx — multi-step password reset UI
// Steps: send OTP to email -> enter OTP -> set new password
// Uses AppContext.backendUrl for API requests

import { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const ResetPassword = () => {
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext)

  const inputRefs = useRef([])
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInput = (e, index) => {
    const value = e.target.value.replace(/\D/g, '')
    e.target.value = value.slice(-1)
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    paste.split('').forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char
      }
    })
    const next = Math.min(paste.length, inputRefs.current.length - 1)
    inputRefs.current[next]?.focus()
  }

  // Step 1: send the reset OTP to the email
  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })

      if (data.success) {
        toast.success(data.message)
        setIsEmailSent(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: collect the OTP
  const onSubmitOtp = (e) => {
    e.preventDefault()
    const code = inputRefs.current.map((input) => input.value).join('')
    if (code.length !== 6) {
      return toast.error('Please enter the 6-digit OTP')
    }
    setOtp(code)
    setIsOtpSubmitted(true)
  }

  // Step 3: set the new password
  const onSubmitNewPassword = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      })

      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='Logo'
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {/* Step 1: email */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'
        >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            Reset password
          </h1>
          <p className='text-center mb-6 text-indigo-300'>
            Enter your registered email address.
          </p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-slate-800'>
            <img src={assets.mail_icon} alt='' className='w-3' />
            <input
              type='email'
              placeholder='Email'
              className='bg-transparent outline-none text-white w-full placeholder:text-indigo-400'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-60'
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {/* Step 2: OTP */}
      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOtp}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'
        >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            Enter OTP
          </h1>
          <p className='text-center mb-6 text-indigo-300'>
            Enter the 6-digit code sent to {email}.
          </p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type='text'
                  inputMode='numeric'
                  maxLength='1'
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className='w-12 h-12 bg-slate-800 text-white text-center text-xl rounded-md outline-none focus:ring-2 focus:ring-indigo-500'
                />
              ))}
          </div>

          <button
            type='submit'
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
          >
            Continue
          </button>
        </form>
      )}

      {/* Step 3: new password */}
      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'
        >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            New password
          </h1>
          <p className='text-center mb-6 text-indigo-300'>
            Enter your new password below.
          </p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-slate-800'>
            <img src={assets.lock_icon} alt='' className='w-3' />
            <input
              type='password'
              placeholder='New Password'
              className='bg-transparent outline-none text-white w-full placeholder:text-indigo-400'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-60'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ResetPassword

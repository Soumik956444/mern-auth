import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const EmailVerify = () => {
  const navigate = useNavigate()
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext)

  const inputRefs = useRef([])
  const [loading, setLoading] = useState(false)

  // If the account is already verified, there's nothing to do here.
  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate('/')
    }
  }, [isLoggedIn, userData, navigate])

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

  const resendOtp = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/resend-otp')
      data.success ? toast.success(data.message) : toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const otp = inputRefs.current.map((input) => input.value).join('')

      if (otp.length !== 6) {
        return toast.error('Please enter the 6-digit OTP')
      }

      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })

      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
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

      <form
        onSubmit={onSubmitHandler}
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'
      >
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>
          Verify your email
        </h1>
        <p className='text-center mb-6 text-indigo-300'>
          Enter the 6-digit code sent to your email.
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
          disabled={loading}
          className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-60'
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <p className='text-gray-400 text-center text-xs mt-4'>
          Didn't receive the code?{' '}
          <span onClick={resendOtp} className='text-blue-400 cursor-pointer underline'>
            Resend OTP
          </span>
        </p>
      </form>
    </div>
  )
}

export default EmailVerify

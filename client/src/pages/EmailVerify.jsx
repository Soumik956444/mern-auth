
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const EmailVerify = () => {
  const navigate = useNavigate()
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  // Send verification OTP using the registration token when the verification page loads
  useEffect(() => {
    const sendOtp = async () => {
      try {
        setSending(true)
        axios.defaults.withCredentials = true
        const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
        if (data.success) {
          setMessage('OTP has been sent to your email. Please enter it below to verify your account.')
          toast.success(data.message)
        } else {
          toast.error(data.message)
          if (data.message?.toLowerCase().includes('not authorized')) {
            navigate('/login')
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to send verification OTP')
        navigate('/login')
      } finally {
        setSending(false)
      }
    }

    sendOtp()
  }, [backendUrl, navigate])

  // Submit the OTP to verify the account and keep the user logged in if successful
  const handleVerify = async (e) => {
    e.preventDefault()

    if (!otp) {
      toast.error('Please enter the OTP')
      return
    }

    try {
      setLoading(true)
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })
      if (data.success) {
        setIsLoggedIn(true)
        await getUserData()
        toast.success(data.message)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  // Allow the user to request the OTP again if they did not receive it or it expired
  const handleResend = async () => {
    try {
      setSending(true)
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        toast.success('A new OTP has been sent to your email')
        setMessage('A new OTP has been sent. Check your email and enter it below.')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to resend OTP')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400'>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>Verify Your Account</h2>
        <p className='text-center text-sm mb-6'>{message || 'We have sent a verification OTP to your registered email.'}</p>

        <form onSubmit={handleVerify}>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-slate-800'>
            <img src='/otp_icon.svg' alt='OTP' className='w-5 h-5 opacity-70' />
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              className='bg-transparent outline-none text-white placeholder:text-indigo-400 w-full'
              type='text'
              placeholder='Enter OTP'
              required
              maxLength={6}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-60'
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <div className='mt-4 text-center'>
          <button
            type='button'
            onClick={handleResend}
            disabled={sending}
            className='text-sm text-indigo-300 underline disabled:opacity-60'
          >
            {sending ? 'Sending OTP...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailVerify

import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const Login = () => {


    const navigate = useNavigate()


    const { backendUrl, setIsLoggedIn } = useContext(AppContext)


    const [state, setState] = useState('Sign up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const onSubmitHandler = async (e)=>{
      try {
        e.preventDefault();

        axios.defaults.withCredentials = true;
        
        if(state === 'Sign up'){
          const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password})

          if(data.success){
            setIsLoggedIn(true)
            navigate('/')
          }else{
            alert(data.message)
          }
        }else{

        }
      }
    }

  return (
    // main container

    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400'>

      <img onClick={()=>navigate('/')} src={assets.logo} alt="Login"  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

      <div className=' bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign up' ? 'Create account' : 'Login'}</h2>

        <p className='text-center text-sm mb-6'>{state === 'Sign up' ? 'Create your account' : 'Login to your account!'}</p>



        <form onSubmit={onSubmitHandler}>
                    {/* name input field */}

          {state === 'Sign up' && (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-slate-800'>

            <img src={assets.person_icon} alt="image"/>

            <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none text-white placeholder:text-indigo-400' type="text" placeholder="Full Name" required/>

          </div>) }


          {/* email input field */}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-slate-800'>

            <img src={assets.mail_icon} alt="image"/>

            <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-white placeholder:text-indigo-400' type="email" placeholder="Email" required/>

          </div>

          {/* password input field */}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-slate-800'>

            <img src={assets.lock_icon} alt="image"/>

            <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none text-white placeholder:text-indigo-400' type="password" placeholder="Password" required/>

          </div>

          <p onClick={()=>navigate('/reset-password')} className=' mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>

        </form>


          {/* // toggle between login and signup */}

          {state === 'Sign up' ? (<p className='text-gray-400 text-center text-xs mt-4 '>Already have an account?{' '}
          <span onClick={()=> setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
        </p>)
        : (<p className='text-gray-400 text-center text-xs mt-4 '>Don't have an account{' '}
          <span onClick={()=> setState('Sign up')} className='text-blue-400 cursor-pointer underline'>Sign up</span>
        </p>) }
        

      </div>

    </div>

  )

}



export default Login






// 3hr 22min
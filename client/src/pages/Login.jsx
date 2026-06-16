import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'

const Login = () => {


    const [state, setState] = useState('Sign up')

  return (
     
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400'>

      <img src={assets.logo} alt="Login"  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

      <div className=' bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign up' ? 'Create account' : 'Login'}</h2>

        <p className='text-center text-sm mb-6'>{state === 'Sign up' ? 'Create your account' : 'Login to your account!'}</p>



        <form>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-state-900/50'>

            <img src={assets.person_icon} alt="image"/>

            <input className='bg-transparent outline-none text-white placeholder:text-indigo-400' type="text" placeholder="Full Name" required/>

          </div>

        </form>



      </div>

    </div>

  )

}



export default Login





// [#333A5C]
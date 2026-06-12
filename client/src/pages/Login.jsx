import React from 'react'
import { useState } from 'react'

const Login = () => {


    const [state, setState] = useState('Sign up')

  return (
    <div>
      <img src={assets.login_img} alt="Login"  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      <div>
        <h2>{state === 'Sign up' ? 'Create your account' : 'Login to your account!'}</h2>
        <p>{state === 'Sign up' ? 'Create your account' : 'Login to your account!'}</p>
      </div>
    </div>
  )
}


export default Login

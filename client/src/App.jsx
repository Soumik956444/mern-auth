import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './components/Home'

const App = () => {
  return (
    <div>
      <Routes>
        <Routes path='/' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App
// video will resumr at 2hours 41minutes and 7 seconds.
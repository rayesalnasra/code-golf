import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Profile from './Profile/Profile'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <Navbar />
      </div>
      <div>
      <Profile />
      </div>
      <div>
      <Footer />
      </div>
    </>
  )
}

export default App
// src/components/DarkModeToggle.jsx
import React, { useEffect, useState } from 'react'
import './DarkModeToggle.css'

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <button className='dark-toggle-button' onClick={handleToggle}>
      {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  )
}

export default DarkModeToggle

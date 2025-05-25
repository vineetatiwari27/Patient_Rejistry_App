// src/components/ValidationPrompt.jsx
import React, { useEffect, useState } from 'react'
import './ValidationPrompt.css'

const ValidationPrompt = ({ message, type = 'error', onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [message, onDismiss])

  if (!isVisible || !message) return null

  const promptClass = `validation-prompt ${type} ${isVisible ? 'visible' : ''}`

  return (
    <div className={promptClass}>
      <p>{message}</p>
      <button
        className='dismiss-button'
        onClick={() => {
          setIsVisible(false)
          onDismiss?.()
        }}
      >
        &times;
      </button>
    </div>
  )
}

export default ValidationPrompt

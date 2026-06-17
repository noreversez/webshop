'use client'

import { useEffect, useState } from 'react'

export default function LineFloatingButton() {
  const [isVisible, setIsVisible] = useState(false)
  const lineUrl = process.env.NEXT_PUBLIC_LINE_OA_URL || 'https://lin.ee/placeholder'

  // Delay the button appearance for a smooth effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <a
      href={lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60px',
        height: '60px',
        background: 'transparent',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 195, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
        opacity: isVisible ? 1 : 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 195, 0, 0.4), 0 12px 32px rgba(0, 0, 0, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 195, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.15)'
      }}
      aria-label="ติดต่อเราทาง LINE"
    >
      <svg
        viewBox="0 0 448 448"
        width="60"
        height="60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="#00c300" d="M400 32H48A48 48 0 0 0 0 80v288a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"/>
        <path fill="#fff" d="M344 196.4c0-43.5-43.3-78.8-96.5-78.8s-96.5 35.3-96.5 78.8c0 38.6 33.6 71.3 80 77.5 3.1.7 7.4 2.1 8.5 4.8 1 2.4.8 6.1.3 8.4l-1.3 8.2c-.4 2.3-1.9 9.1 8 4.9 10-4.2 53.8-31.8 73.7-54.4 15.2-17.4 22.8-33.3 22.8-49.4zm-119.1 20.1h-20.7c-2.6 0-4.7-2.1-4.7-4.7v-32.9c0-2.6 2.1-4.7 4.7-4.7 2.6 0 4.7 2.1 4.7 4.7v28h16c2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.9-4.7 4.9zm26.7-37.6v32.9c0 2.6-2.1 4.7-4.7 4.7-2.6 0-4.7-2.1-4.7-4.7v-32.9c0-2.6 2.1-4.7 4.7-4.7 2.6 0 4.7 2.1 4.7 4.7zm26.5 23.4l-13.1-22.6c-.5-.9-1.4-1.5-2.4-1.6-.3 0-.7 0-1 0-1.2.2-2.3 1-2.9 2.1-.2.3-.3.7-.3 1v32.9c0 2.6 2.1 4.7 4.7 4.7 2.6 0 4.7-2.1 4.7-4.7v-23.4l13.1 22.6c.5.9 1.4 1.5 2.4 1.6.3 0 .7 0 1 0 1.2-.2 2.3-1 2.9-2.1.2-.3.3-.7.3-1v-32.9c0-2.6-2.1-4.7-4.7-4.7-2.6 0-4.7 2.1-4.7 4.7v23.4zm40.3-23.4v32.9c0 2.6-2.1 4.7-4.7 4.7h-20.7c-2.6 0-4.7-2.1-4.7-4.7v-32.9c0-2.6 2.1-4.7 4.7-4.7h20.7c2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7h-16v6.9h16c2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7h-16v6.9h16c2.6 0 4.7 2.1 4.7 4.7z"/>
      </svg>
    </a>
  )
}

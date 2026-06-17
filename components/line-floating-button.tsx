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
        background: '#00B900', // LINE Green
        borderRadius: '50%',
        boxShadow: '0 4px 12px rgba(0, 185, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
        opacity: isVisible ? 1 : 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 185, 0, 0.4), 0 12px 32px rgba(0, 0, 0, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 185, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.15)'
      }}
      aria-label="ติดต่อเราทาง LINE"
    >
      <svg
        viewBox="0 0 495.9 512"
        width="34"
        height="34"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M165.9 222.5c-4.7 0-8.6 3.9-8.6 8.6v61.6c0 4.7 3.9 8.6 8.6 8.6h46.1c4.7 0 8.6-3.9 8.6-8.6v-16.9c0-4.7-3.9-8.6-8.6-8.6h-29.2v-44.7c0-4.7-3.9-8.6-8.6-8.6zM263.8 222.5c-4.7 0-8.6 3.9-8.6 8.6v61.6c0 4.7 3.9 8.6 8.6 8.6h16.9c4.7 0 8.6-3.9 8.6-8.6v-61.6c0-4.7-3.9-8.6-8.6-8.6h-16.9zm66.1 0c-4.7 0-8.6 3.9-8.6 8.6v42.9l-34.8-50.1c-.5-.7-1.1-1.3-1.9-1.8-.4-.2-.8-.4-1.2-.5-.4-.1-.8-.1-1.2-.1-1.1.1-2.2.6-3 1.3-.3.3-.6.6-.8 1v61.5c0 4.7 3.9 8.6 8.6 8.6h16.9c4.7 0 8.6-3.9 8.6-8.6v-42.9l34.8 50.1c.5.7 1.1 1.3 1.9 1.8.4.2.8.4 1.2.5.4.1.8.1 1.2.1 1.1-.1 2.2-.6 3-1.3.3-.3.6-.6.8-1v-61.5c0-4.7-3.9-8.6-8.6-8.6h-16.9zm114.4 0c-4.7 0-8.6 3.9-8.6 8.6v61.6c0 4.7 3.9 8.6 8.6 8.6h46.1c4.7 0 8.6-3.9 8.6-8.6v-16.9c0-4.7-3.9-8.6-8.6-8.6h-29.2v-10h29.2c4.7 0 8.6-3.9 8.6-8.6v-16.9c0-4.7-3.9-8.6-8.6-8.6h-29.2v-10h29.2c4.7 0 8.6-3.9 8.6-8.6v-16.9c0-4.7-3.9-8.6-8.6-8.6h-46.1zM247.9 8C111 8 0 98.6 0 210.4c0 100.2 78.5 183.7 185.3 199.9 8.5 1.8 20.1 5.5 23.2 12.6 2.8 6.4 2.2 16.4.8 22.8-1.5 6.7-9.8 38.6-11.9 47-.6 2.4-1.2 5.9-1.2 5.9s-1.8 11.2 9.5 5.2c11.3-6 60.9-33.1 83.1-49.2 28.5-20.7 59.5-35.8 89.2-56.7 66.8-46.9 117.9-115.8 117.9-187.5C495.9 98.6 384.8 8 247.9 8z"/>
      </svg>
    </a>
  )
}

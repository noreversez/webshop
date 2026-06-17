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
        viewBox="0 0 24 24"
        width="34"
        height="34"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.296.08.761.038 1.054l-.164 1.02c-.046.282-.234 1.134 1.011.605 1.246-.528 6.702-3.957 9.176-6.776 1.89-2.167 2.846-4.148 2.846-6.103zm-14.839 2.509h-2.585c-.328 0-.593-.265-.593-.592v-4.103c0-.327.265-.592.593-.592.327 0 .592.265.592.592v3.512h1.993c.328 0 .593.265.593.593 0 .327-.265.59-.593.59zm3.328-4.695v4.103c0 .327-.265.593-.592.593-.328 0-.593-.266-.593-.593v-4.103c0-.327.265-.592.593-.592.327 0 .592.265.592.592zm3.303 2.923l-1.636-2.825c-.066-.115-.178-.184-.303-.204-.041-.005-.084-.005-.125 0-.154.025-.286.118-.358.257-.021.04-.031.083-.031.127v4.103c0 .327.265.593.593.593.327 0 .592-.266.592-.593v-2.923l1.635 2.825c.066.115.178.184.303.204.041.005.084.005.125 0 .153-.025.286-.118.358-.257.021-.04.032-.083.032-.127v-4.103c0-.327-.265-.592-.592-.592-.328 0-.593.265-.593.592v2.923zm5.021-2.923v4.103c0 .327-.265.593-.593.593h-2.585c-.327 0-.592-.266-.592-.593v-4.103c0-.327.265-.592.592-.592h2.585c.328 0 .593.265.593.592 0 .327-.265.592-.593.592h-1.993v.857h1.993c.328 0 .593.265.593.592 0 .328-.265.593-.593.593h-1.993v.857h1.993c.328 0 .593.265.593.592z"/>
      </svg>
    </a>
  )
}

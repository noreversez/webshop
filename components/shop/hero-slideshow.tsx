'use client'

import { useState, useEffect } from 'react'

const slides = [
  {
    image: '/images/polo1.png',
    title: 'เสื้อโปโลสีกรมท่า Classic',
    subtitle: 'เรียบหรู ใส่ทำงานหรือวันชิลๆ ก็ดูดี',
  },
  {
    image: '/images/polo2.png',
    title: 'เสื้อโปโลสีขาว Essential',
    subtitle: 'เนื้อผ้าระบายอากาศได้ดี ตัดเย็บเนี้ยบ',
  },
  {
    image: '/images/polo3.png',
    title: 'เสื้อโปโลสีเขียว Olive',
    subtitle: 'สีสันคลาสสิก เข้าได้กับทุกลุค',
  },
]

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '16px' }}>
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              position: 'absolute', 
              zIndex: -1,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 6s ease-out, opacity 1s ease-in-out'
            }}
          />
          {/* Minimal overlay for text readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
            zIndex: 0
          }} />
          <div style={{ padding: '2.5rem', zIndex: 1, color: 'white' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{slide.title}</h2>
            <p style={{ fontSize: '1rem', opacity: 0.9 }}>{slide.subtitle}</p>
          </div>
        </div>
      ))}
      
      {/* Slide Indicators */}
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '2.5rem', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: idx === currentSlide ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: idx === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

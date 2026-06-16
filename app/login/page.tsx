'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLineLogin = async () => {
    setIsLoading(true)
    await signIn('line', { callbackUrl: '/shop' })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(232,160,160,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="fade-in" style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            FASHION
          </span>
          <br />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
            STORE
          </span>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
            เข้าสู่ระบบ
          </h1>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem' }}>
            เข้าสู่ระบบเพื่อเริ่มช็อปปิ้งและสะสมแต้ม
          </p>

          {/* LINE Login Button */}
          <button
            onClick={handleLineLogin}
            disabled={isLoading}
            style={{
              width: '100%',
              background: '#06C755',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-thai)',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 20px rgba(6,199,85,0.3)',
            }}
          >
            {isLoading ? (
              <span>กำลังเข้าสู่ระบบ...</span>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M19.365 9.89c.50 0 .907.41.907.91s-.408.91-.907.91h-2.728v1.818h2.728c.499 0 .907.41.907.91s-.408.91-.907.91h-3.636a.909.909 0 0 1-.909-.91V8.98c0-.5.408-.91.909-.91h3.636zm-9.091 3.636a.909.909 0 0 1-.909.91H6.546v-5.456c0-.5.408-.91.909-.91s.909.41.909.91v4.546h1.91c.5 0 .908.41.908.91zm2.727.91c-.5 0-.908-.41-.908-.91V8.98c0-.5.408-.91.908-.91.5 0 .909.41.909.91v4.546c0 .5-.409.91-.909.91zm-8.182 0a.909.909 0 0 1-.91-.91V8.98c0-.5.41-.91.91-.91.5 0 .908.41.908.91v1.818h2.728c.5 0 .908.41.908.91s-.409.91-.908.91H5.637v1.818c0 .5-.409.91-.909.91z"/>
                </svg>
                เข้าสู่ระบบด้วย LINE
              </>
            )}
          </button>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(6,199,85,0.05)', borderRadius: '10px', border: '1px solid rgba(6,199,85,0.15)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textAlign: 'center', lineHeight: 1.6 }}>
              🔒 ปลอดภัย 100% — เราใช้ LINE Login มาตรฐาน<br />ข้อมูลของคุณจะไม่ถูกแชร์กับบุคคลที่สาม
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--color-text-subtle)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          เป็นผู้ดูแลระบบ?{' '}
          <a href="/admin/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
            เข้าสู่ระบบแอดมิน
          </a>
        </p>
      </div>
    </div>
  )
}

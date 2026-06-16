'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('admin-credentials', {
      username,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      setLoading(false)
    }
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
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="fade-in" style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            background: 'rgba(96,165,250,0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(96,165,250,0.3)',
            marginBottom: '1rem',
            fontSize: '1.5rem',
          }}>🛡️</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>Admin Portal</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Fashion Store Management System
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="input-styled"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-styled"
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: '10px',
                color: 'var(--color-error)',
                fontSize: '0.875rem',
              }}>
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.875rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '0.5rem',
                fontFamily: 'var(--font-thai)',
                boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--color-text-subtle)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            ← กลับหน้าหลัก
          </a>
        </p>
      </div>
    </div>
  )
}

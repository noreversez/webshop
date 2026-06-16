'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin/dashboard', icon: '📊', label: 'แดชบอร์ด' },
  { href: '/admin/products', icon: '👗', label: 'สินค้า' },
  { href: '/admin/orders', icon: '📦', label: 'คำสั่งซื้อ' },
  { href: '/admin/customers', icon: '👥', label: 'ลูกค้า' },
  { href: '/admin/categories', icon: '🏷️', label: 'หมวดหมู่' },
]

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: 'var(--color-bg-elevated)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          FASHION
        </div>
        <div style={{ color: 'var(--color-text-subtle)', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
          ADMIN PORTAL
        </div>
      </div>

      {/* Admin info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        background: 'rgba(96,165,250,0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(96,165,250,0.2)',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', flexShrink: 0,
        }}>🛡️</div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{adminName}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-info)' }}>Administrator</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="sidebar-link"
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-error)',
            opacity: 0.7,
          }}
        >
          <span>🚪</span>
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  )
}

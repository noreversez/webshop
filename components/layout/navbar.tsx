'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, User } from 'lucide-react'
import CartDrawer from '@/components/shop/cart-drawer'

export default function Navbar({ session }: { session: any }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Listen for scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen for cart changes
  useEffect(() => {
    const updateCartCount = () => {
      const raw = localStorage.getItem('cart')
      if (raw) {
        const cart = JSON.parse(raw)
        setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0))
      } else {
        setCartCount(0)
      }
    }
    
    updateCartCount()
    window.addEventListener('cart-updated', updateCartCount)
    window.addEventListener('storage', updateCartCount)
    
    return () => {
      window.removeEventListener('cart-updated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 1)',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        <div className="container-custom" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: isScrolled ? '65px' : '80px',
          transition: 'height 0.3s ease'
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                rpcashop
              </span>
            </div>
          </Link>

          {/* Desktop Nav & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link href="/shop" style={{ 
              textDecoration: 'none', 
              fontSize: '0.95rem', 
              color: 'var(--color-text)', 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              สินค้า
            </Link>

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                transition: 'background 0.2s'
              }}
              className="hover:bg-gray-100"
            >
              <ShoppingBag size={20} color="var(--color-text)" strokeWidth={2} />
              {cartCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {cartCount}
                </div>
              )}
            </button>

            {/* User Profile / Login */}
            {session ? (
              <Link href="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                    <User size={18} />
                  </div>
                )}
              </Link>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 600 }}>
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Drawer Component */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  )
}

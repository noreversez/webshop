'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import CartDrawer from '@/components/shop/cart-drawer'

export default function CartFloatingButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Listen for scroll and delay appearance
  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down a bit so it doesn't conflict too much with navbar
      setIsVisible(window.scrollY > 100)
    }
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
      <button
        onClick={() => setIsCartOpen(true)}
        style={{
          position: 'fixed',
          bottom: '6.5rem', // Above the LINE button
          right: '2rem',
          zIndex: 49,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
          opacity: isVisible ? 1 : 0,
          color: 'var(--color-text)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        aria-label="ตะกร้าสินค้า"
      >
        <ShoppingBag size={24} strokeWidth={2} />
        {cartCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: 'var(--color-primary)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 700,
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            border: '2px solid var(--color-bg-card)'
          }}>
            {cartCount}
          </div>
        )}
      </button>

      {/* Cart Drawer Component */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  )
}

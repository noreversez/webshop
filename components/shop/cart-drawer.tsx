'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CartItem {
  variantId: string
  productId: string
  productName: string
  color: string
  size: string
  price: number
  quantity: number
  image: string | null
}

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    const loadCart = () => {
      const raw = localStorage.getItem('cart')
      if (raw) setCart(JSON.parse(raw))
    }
    
    loadCart()
    
    // Listen for updates from other components
    window.addEventListener('cart-updated', loadCart)
    return () => window.removeEventListener('cart-updated', loadCart)
  }, [isOpen])

  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const updateQty = (idx: number, qty: number) => {
    if (qty <= 0) {
      const newCart = cart.filter((_, i) => i !== idx)
      updateCart(newCart)
    } else {
      const newCart = [...cart]
      newCart[idx].quantity = qty
      updateCart(newCart)
    }
  }

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)

  if (!isMounted) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '400px',
        background: 'var(--color-bg)',
        zIndex: 101,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} />
            ตะกร้าสินค้า <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 400 }}>({itemCount})</span>
          </h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'var(--color-bg-hover)', 
              border: 'none', 
              width: 32, height: 32, 
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <ShoppingBag size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>ตะกร้าว่างเปล่า</p>
              <button 
                onClick={onClose}
                className="btn-secondary" 
                style={{ marginTop: '1.5rem' }}
              >
                เลือกซื้อสินค้าต่อ
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map((item, idx) => (
                <div key={item.variantId} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 80, height: 100, borderRadius: '8px', overflow: 'hidden', background: 'var(--color-bg-hover)', flexShrink: 0 }}>
                    {item.image ? (
                      <img src={item.image} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👗</div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.3 }}>{item.productName}</h3>
                      <button onClick={() => updateQty(idx, 0)} style={{ background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer', padding: '0.2rem' }}>
                        <Trash2 size={16} className="hover:text-red-500" />
                      </button>
                    </div>
                    
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      สี: {item.color} | ไซส์: {item.size}
                    </div>
                    
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
                        <button onClick={() => updateQty(idx, item.quantity - 1)} style={{ width: 28, height: 28, background: 'var(--color-bg-elevated)', border: 'none', cursor: 'pointer' }}>-</button>
                        <span style={{ width: 30, textAlign: 'center', fontSize: '0.85rem', fontWeight: 500 }}>{item.quantity}</span>
                        <button onClick={() => updateQty(idx, item.quantity + 1)} style={{ width: 28, height: 28, background: 'var(--color-bg-elevated)', border: 'none', cursor: 'pointer' }}>+</button>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        ฿{(item.price * item.quantity).toLocaleString('th-TH')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
              <span style={{ fontWeight: 500 }}>ยอดรวมสุทธิ</span>
              <span style={{ fontWeight: 700 }}>฿{total.toLocaleString('th-TH')}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              ดำเนินการชำระเงิน
            </button>
          </div>
        )}
      </div>
    </>
  )
}

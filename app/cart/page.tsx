'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem('cart')
    if (raw) setCart(JSON.parse(raw))
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
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

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>


      <div className="container-custom" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>🛒 ตะกร้าสินค้า</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>ตะกร้าว่างเปล่า</p>
            <Link href="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>เลือกสินค้า</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Cart Items */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cart.map((item, idx) => (
                  <div key={item.variantId} style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'var(--color-bg)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                    {item.image ? (
                      <img src={item.image} alt="" style={{ width: 70, height: 70, borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 70, height: 70, borderRadius: '10px', background: 'var(--color-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>👗</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.productName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>สี: {item.color} | ไซส์: {item.size}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                        ฿{item.price.toLocaleString('th-TH')} / ชิ้น
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => updateQty(idx, item.quantity - 1)} style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', color: 'var(--color-text)', cursor: 'pointer' }}>-</button>
                      <span style={{ fontWeight: 600, minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(idx, item.quantity + 1)} style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', color: 'var(--color-text)', cursor: 'pointer' }}>+</button>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', minWidth: '80px', textAlign: 'right' }}>
                      ฿{(item.price * item.quantity).toLocaleString('th-TH')}
                    </div>
                    <button onClick={() => updateQty(idx, 0)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)', fontSize: '1.25rem', padding: '0.25rem' }}>🗑</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>สรุปคำสั่งซื้อ</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                <span>สินค้า ({cart.reduce((s, i) => s + i.quantity, 0)} ชิ้น)</span>
                <span>฿{total.toLocaleString('th-TH')}</span>
              </div>
              <div className="divider" style={{ margin: '1rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>ยอดรวม</span>
                <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1.25rem' }}>฿{total.toLocaleString('th-TH')}</span>
              </div>
              <Link
                href="/checkout"
                className="btn-primary"
                style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none', fontSize: '1rem', padding: '1rem' }}
              >
                สั่งซื้อและชำระเงิน →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

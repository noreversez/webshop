'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'details' | 'slip'>('details')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [slipFile, setSlipFile] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  const [uploadingSlip, setUploadingSlip] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem('cart')
    if (raw) setCart(JSON.parse(raw))
  }, [])

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
          shippingName: name,
          shippingPhone: phone,
          shippingAddr: address,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        return
      }
      const order = await res.json()
      setOrderId(order.id)
      localStorage.removeItem('cart')
      setCart([])
      setStep('slip')
    } catch {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSlipFile(file)
    setSlipPreview(URL.createObjectURL(file))
  }

  const handleUploadSlip = async () => {
    if (!slipFile || !orderId) return
    setUploadingSlip(true)
    try {
      // Upload to Google Drive
      const formData = new FormData()
      formData.append('file', slipFile)
      formData.append('type', 'slip')

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const { fileId, url } = await uploadRes.json()

      // Update order with slip
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slipUrl: url, slipDriveId: fileId }),
      })

      setDone(true)
    } catch {
      alert('เกิดข้อผิดพลาดในการอัปโหลดสลิป')
    } finally {
      setUploadingSlip(false)
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div className="glass-card fade-in" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>สั่งซื้อสำเร็จ!</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.8 }}>
            ทีมงานได้รับออเดอร์และสลิปของคุณแล้ว<br />
            เราจะตรวจสอบและยืนยันการชำระเงินภายใน 1 ชั่วโมงครับ 🙏
          </p>
          <Link href="/profile" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            ดูสถานะออเดอร์
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <nav style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>FASHION STORE</span>
          </Link>
          <Link href="/cart" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← กลับตะกร้า</Link>
        </div>
      </nav>

      <div className="container-custom" style={{ padding: '2rem 1.5rem', maxWidth: '700px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>
          {step === 'details' ? '📋 ข้อมูลการจัดส่ง' : '💳 แนบหลักฐานการชำระเงิน'}
        </h1>

        {step === 'details' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Order Summary */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>สรุปรายการ</h2>
              {cart.map((item) => (
                <div key={item.variantId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.productName} ({item.color}/{item.size}) ×{item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>฿{(item.price * item.quantity).toLocaleString('th-TH')}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>ยอดรวม</span>
                <span className="gradient-text">฿{total.toLocaleString('th-TH')}</span>
              </div>
            </div>

            {/* Shipping Form */}
            <form onSubmit={handleOrder}>
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ที่อยู่จัดส่ง</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>ชื่อผู้รับ *</label>
                    <input className="input-styled" value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อ-นามสกุล" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>เบอร์โทร *</label>
                    <input className="input-styled" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08X-XXX-XXXX" required type="tel" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>ที่อยู่จัดส่ง *</label>
                    <textarea
                      className="input-styled"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                      required
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading || cart.length === 0} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                {loading ? 'กำลังสร้างออเดอร์...' : 'ยืนยันคำสั่งซื้อ →'}
              </button>
            </form>
          </div>
        )}

        {step === 'slip' && (
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>📢 วิธีชำระเงิน</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                กรุณาโอนเงินจำนวน <strong style={{ color: 'var(--color-primary)' }}>฿{total.toLocaleString('th-TH')}</strong><br />
                มายังบัญชีของเรา จากนั้นแนบสลิปด้านล่างนี้ครับ
              </p>
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--color-bg)', borderRadius: '8px', fontSize: '0.85rem' }}>
                🏦 ธนาคาร: กรุณาใส่บัญชีของร้านตรงนี้
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.75rem' }}>แนบสลิปการโอนเงิน</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSlipChange}
                style={{ display: 'none' }}
                id="slip-upload"
              />
              <label
                htmlFor="slip-upload"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  border: '2px dashed var(--color-border)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  gap: '0.5rem',
                }}
              >
                {slipPreview ? (
                  <img src={slipPreview} alt="Slip Preview" style={{ maxHeight: '300px', borderRadius: '12px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <span style={{ fontSize: '2.5rem' }}>📎</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>คลิกเพื่อเลือกรูปสลิป</span>
                    <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.8rem' }}>รองรับ JPG, PNG, HEIC</span>
                  </>
                )}
              </label>
            </div>

            <button
              onClick={handleUploadSlip}
              disabled={!slipFile || uploadingSlip}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', opacity: !slipFile ? 0.5 : 1 }}
            >
              {uploadingSlip ? 'กำลังส่งสลิป...' : '✅ ส่งสลิปยืนยันการชำระเงิน'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

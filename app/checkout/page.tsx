'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import generatePayload from 'promptpay-qr'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Form State
  const [shippingName, setShippingName] = useState('')
  const [shippingPhone, setShippingPhone] = useState('')
  const [shippingAddr, setShippingAddr] = useState('')
  const [slipFile, setSlipFile] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // TODO: Replace with real PromptPay ID (Phone number or National ID)
  const promptPayID = '0812345678'

  useEffect(() => {
    setIsClient(true)
    const raw = localStorage.getItem('cart')
    if (raw) {
      const parsedCart = JSON.parse(raw)
      setCart(parsedCart)
      if (parsedCart.length === 0) {
        router.push('/')
      }
      setTotal(parsedCart.reduce((s: number, i: any) => s + i.price * i.quantity, 0))
    } else {
      router.push('/')
    }
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSlipFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setSlipPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!shippingName || !shippingPhone || !shippingAddr) {
      toast.error('กรุณากรอกข้อมูลจัดส่งให้ครบถ้วน')
      return
    }
    if (!slipFile) {
      toast.error('กรุณาแนบสลิปโอนเงิน')
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading('กำลังบันทึกคำสั่งซื้อ...')

    try {
      // 1. Upload Slip
      const formData = new FormData()
      formData.append('file', slipFile)
      formData.append('type', 'slip')

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('อัปโหลดสลิปไม่สำเร็จ')
      const { fileId, url } = await uploadRes.json()

      // 2. Create Order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          shippingName,
          shippingPhone,
          shippingAddr,
          slipUrl: url,
          slipDriveId: fileId,
        }),
      })

      if (!orderRes.ok) {
        const error = await orderRes.json()
        throw new Error(error.error || 'สร้างคำสั่งซื้อไม่สำเร็จ')
      }

      const order = await orderRes.json()

      // 3. Clear Cart & Redirect
      localStorage.removeItem('cart')
      toast.success('สั่งซื้อสำเร็จ!', { id: toastId })
      router.push(`/checkout/success?orderNumber=${order.orderNumber}`)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่', { id: toastId })
      setIsSubmitting(false)
    }
  }

  if (!isClient) return null

  // Generate PromptPay Payload
  const qrPayload = generatePayload(promptPayID, { amount: total })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '4rem' }}>
      <div className="container-custom" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
          ชำระเงิน (Checkout)
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: Order Summary */}
          <section className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>สรุปยอดคำสั่งซื้อ</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.quantity}x {item.productName} ({item.size})</span>
                  <span>฿{(item.price * item.quantity).toLocaleString('th-TH')}</span>
                </div>
              ))}
            </div>
            <div className="divider" style={{ margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.25rem' }}>
              <span>ยอดที่ต้องชำระ</span>
              <span className="gradient-text">฿{total.toLocaleString('th-TH')}</span>
            </div>
          </section>

          {/* Section 2: Shipping Info */}
          <section className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>ที่อยู่จัดส่ง</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>ชื่อ-นามสกุล</label>
                <input 
                  type="text" 
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="input-styled" 
                  placeholder="เช่น สมชาย ใจดี" 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>เบอร์โทรศัพท์</label>
                <input 
                  type="tel" 
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className="input-styled" 
                  placeholder="เช่น 0812345678" 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>ที่อยู่จัดส่งแบบครบถ้วน</label>
                <textarea 
                  value={shippingAddr}
                  onChange={(e) => setShippingAddr(e.target.value)}
                  className="input-styled" 
                  placeholder="บ้านเลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์" 
                  rows={4} 
                  required 
                />
              </div>
            </div>
          </section>

          {/* Section 3: Payment & Slip */}
          <section className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>สแกน QR Code เพื่อชำระเงิน</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              ยอดเงินจะถูกระบุอัตโนมัติ รบกวนตรวจสอบยอดก่อนกดยืนยันการโอนครับ
            </p>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'inline-block', marginBottom: '2rem' }}>
              <QRCodeSVG value={qrPayload} size={200} />
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>อัปโหลดสลิปโอนเงิน</h3>
            
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '2px dashed var(--color-border)', borderRadius: '12px', padding: '2rem',
              background: 'var(--color-bg-hover)', cursor: 'pointer', transition: 'all 0.2s',
              marginBottom: '1rem'
            }}>
              {slipPreview ? (
                <img src={slipPreview} alt="Slip" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
              ) : (
                <>
                  <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>คลิกเพื่อเลือกไฟล์รูปภาพ</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>รองรับ JPG, PNG</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} required />
            </label>

          </section>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting || !slipFile}
            style={{ 
              width: '100%', padding: '1rem', fontSize: '1.1rem', 
              opacity: isSubmitting || !slipFile ? 0.6 : 1,
              cursor: isSubmitting || !slipFile ? 'not-allowed' : 'pointer' 
            }}
          >
            {isSubmitting ? 'กำลังดำเนินการ...' : 'แจ้งโอนเงินและสั่งซื้อ'}
          </button>
        </form>
      </div>
    </div>
  )
}

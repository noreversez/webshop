'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  status: string
  slipVerified: boolean
  trackingNum: string | null
  pointsEarned: number
}

export default function OrderActionButtons({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false)
  const [trackingNum, setTrackingNum] = useState(order.trackingNum || '')
  const router = useRouter()

  const updateStatus = async (status: string, extra?: object) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
      }
    } finally {
      setLoading(false)
    }
  }

  const approvePayment = () => {
    if (!confirm('ยืนยันว่าได้รับเงินแล้ว? ระบบจะเพิ่มแต้มให้ลูกค้าและอัปเดตสถานะเป็น "ยืนยันแล้ว"')) return
    updateStatus('CONFIRMED', { slipVerified: true, awardPoints: true })
  }

  const addTracking = () => {
    if (!trackingNum) return alert('กรุณากรอกเลขพัสดุ')
    updateStatus('SHIPPED', { trackingNum })
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        การดำเนินการ
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {order.status === 'PAYMENT_REVIEW' && (
          <>
            <button
              onClick={approvePayment}
              disabled={loading}
              className="btn-primary"
              style={{ textAlign: 'left' }}
            >
              ✅ อนุมัติการชำระเงิน + เพิ่มแต้มลูกค้า
            </button>
            <button
              onClick={() => { if(confirm('ยกเลิกออเดอร์นี้?')) updateStatus('CANCELLED') }}
              disabled={loading}
              style={{
                background: 'rgba(248,113,113,0.1)',
                color: 'var(--color-error)',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-thai)',
                fontSize: '0.95rem',
              }}
            >
              ❌ ปฏิเสธ / ยกเลิกออเดอร์
            </button>
          </>
        )}

        {order.status === 'CONFIRMED' && (
          <button
            onClick={() => updateStatus('PROCESSING')}
            disabled={loading}
            className="btn-primary"
          >
            📦 เริ่มแพ็คสินค้า
          </button>
        )}

        {order.status === 'PROCESSING' && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={trackingNum}
              onChange={(e) => setTrackingNum(e.target.value)}
              placeholder="เลขพัสดุ (เช่น TH123456789)"
              className="input-styled"
              style={{ flex: 1, minWidth: '200px' }}
            />
            <button
              onClick={addTracking}
              disabled={loading}
              className="btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              🚚 อัปเดตเลขพัสดุ + จัดส่ง
            </button>
          </div>
        )}

        {order.status === 'SHIPPED' && (
          <button
            onClick={() => updateStatus('DELIVERED')}
            disabled={loading}
            className="btn-primary"
          >
            📬 ยืนยันส่งถึงแล้ว
          </button>
        )}

        {['PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CONFIRMED'].includes(order.status) && order.status !== 'CANCELLED' && (
          <button
            onClick={() => { if(confirm('ยกเลิกออเดอร์นี้?')) updateStatus('CANCELLED') }}
            disabled={loading}
            style={{
              background: 'transparent',
              color: 'var(--color-text-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-thai)',
            }}
          >
            ยกเลิกออเดอร์
          </button>
        )}

        {loading && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>กำลังดำเนินการ...</p>}
      </div>
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import OrderActionButtons from '@/components/admin/order-action-buttons'

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: { select: { name: true } },
          variant: { select: { color: true, size: true, price: true } },
        },
      },
      pointTransactions: true,
    },
  })
}

const statusLabels: Record<string, { label: string; className: string }> = {
  PENDING_PAYMENT: { label: 'รอชำระเงิน', className: 'badge-warning' },
  PAYMENT_REVIEW: { label: 'ตรวจสอบสลิป', className: 'badge-info' },
  CONFIRMED: { label: 'ยืนยันแล้ว', className: 'badge-success' },
  PROCESSING: { label: 'กำลังแพ็ค', className: 'badge-primary' },
  SHIPPED: { label: 'จัดส่งแล้ว', className: 'badge-primary' },
  DELIVERED: { label: 'ส่งถึงแล้ว', className: 'badge-success' },
  CANCELLED: { label: 'ยกเลิก', className: 'badge-error' },
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)
  if (!order) notFound()

  const statusInfo = statusLabels[order.status] || { label: order.status, className: 'badge-info' }

  return (
    <div className="fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>ออเดอร์ #{order.orderNumber}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {new Date(order.createdAt).toLocaleDateString('th-TH', { dateStyle: 'full' })}
          </p>
        </div>
        <span className={`badge ${statusInfo.className}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
          {statusInfo.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Customer Info */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ข้อมูลลูกค้า
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            {order.user.image && <img src={order.user.image} alt="" style={{ width: 44, height: 44, borderRadius: '50%' }} />}
            <div>
              <div style={{ fontWeight: 600 }}>{order.user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.user.email || 'LINE User'}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <div>⭐ แต้มปัจจุบัน: <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{order.user.points} แต้ม</span></div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ที่อยู่จัดส่ง
          </h3>
          <div style={{ fontSize: '0.9rem', lineHeight: 2, color: 'var(--color-text)' }}>
            <div>👤 {order.shippingName}</div>
            <div>📞 {order.shippingPhone}</div>
            <div>📍 {order.shippingAddr}</div>
            {order.trackingNum && (
              <div>🚚 เลขพัสดุ: <span style={{ color: 'var(--color-info)', fontWeight: 600 }}>{order.trackingNum}</span></div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          รายการสินค้า
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {order.items.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              background: 'var(--color-bg)',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
            }}>
              <div>
                <div style={{ fontWeight: 500 }}>{item.product.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  สี: {item.variant.color} | ไซส์: {item.variant.size} | จำนวน: {item.quantity}
                </div>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                ฿{(Number(item.price) * item.quantity).toLocaleString('th-TH')}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          paddingTop: '1rem', marginTop: '0.5rem',
          borderTop: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            รวม: <span className="gradient-text">฿{Number(order.totalAmount).toLocaleString('th-TH')}</span>
          </div>
        </div>
      </div>

      {/* Payment Slip */}
      {order.slipUrl && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            หลักฐานการชำระเงิน
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <img
              src={order.slipUrl}
              alt="Payment Slip"
              style={{
                maxWidth: '300px',
                width: '100%',
                borderRadius: '12px',
                border: '2px solid var(--color-border)',
              }}
            />
            <div>
              <div style={{ marginBottom: '1rem' }}>
                {order.slipVerified ? (
                  <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>✅ ยืนยันสลิปแล้ว</div>
                ) : (
                  <div style={{ color: 'var(--color-warning)', fontWeight: 600 }}>⏳ รอการตรวจสอบ</div>
                )}
              </div>
              {order.slipDriveId && (
                <a
                  href={`https://drive.google.com/file/d/${order.slipDriveId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block' }}
                >
                  ดูบน Google Drive ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <OrderActionButtons order={order} />
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getOrders(status?: string) {
  return prisma.order.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, image: true, lineId: true } },
      items: {
        include: {
          product: { select: { name: true } },
          variant: { select: { color: true, size: true } },
        },
      },
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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const orders = await getOrders(searchParams.status)

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>คำสั่งซื้อ</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>จัดการและตรวจสอบคำสั่งซื้อทั้งหมด</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { value: '', label: 'ทั้งหมด' },
          { value: 'PAYMENT_REVIEW', label: '⏳ รอตรวจสลิป' },
          { value: 'CONFIRMED', label: '✅ ยืนยันแล้ว' },
          { value: 'SHIPPED', label: '🚚 จัดส่งแล้ว' },
          { value: 'CANCELLED', label: '❌ ยกเลิก' },
        ].map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '99px',
              fontSize: '0.85rem',
              textDecoration: 'none',
              border: '1px solid var(--color-border)',
              background: searchParams.status === tab.value || (!searchParams.status && !tab.value)
                ? 'var(--color-primary-glow)'
                : 'transparent',
              color: searchParams.status === tab.value || (!searchParams.status && !tab.value)
                ? 'var(--color-primary)'
                : 'var(--color-text-muted)',
              borderColor: searchParams.status === tab.value || (!searchParams.status && !tab.value)
                ? 'rgba(232,160,160,0.4)'
                : 'var(--color-border)',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Orders list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {orders.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            ไม่พบคำสั่งซื้อ
          </div>
        ) : (
          orders.map((order) => {
            const statusInfo = statusLabels[order.status] || { label: order.status, className: 'badge-info' }
            return (
              <div key={order.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {order.user?.image ? (
                      <img src={order.user.image} alt="" style={{ width: 44, height: 44, borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{order.user?.name || order.shippingName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        ออเดอร์ #{order.orderNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                        {new Date(order.createdAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        ฿{Number(order.totalAmount).toLocaleString('th-TH')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {order.items.length} รายการ
                      </div>
                    </div>
                    <span className={`badge ${statusInfo.className}`}>{statusInfo.label}</span>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="btn-secondary"
                      style={{ textDecoration: 'none', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                    >
                      รายละเอียด
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} style={{
                        padding: '0.3rem 0.75rem',
                        background: 'var(--color-bg)',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                        border: '1px solid var(--color-border)',
                      }}>
                        {item.product.name} ({item.variant.color}/{item.variant.size}) ×{item.quantity}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                        +{order.items.length - 3} รายการ
                      </div>
                    )}
                  </div>
                </div>

                {/* Slip indicator */}
                {order.slipUrl && (
                  <div style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    color: order.slipVerified ? 'var(--color-success)' : 'var(--color-warning)',
                  }}>
                    {order.slipVerified ? '✅' : '📎'} {order.slipVerified ? 'ยืนยันสลิปแล้ว' : 'มีสลิปแนบ — รอการตรวจสอบ'}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

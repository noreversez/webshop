import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getDashboardStats() {
  const [totalProducts, totalOrders, totalCustomers, pendingOrders, totalRevenue] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: 'PAYMENT_REVIEW' } }),
    prisma.order.aggregate({
      where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
      _sum: { totalAmount: true },
    }),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, image: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  })

  return { totalProducts, totalOrders, totalCustomers, pendingOrders, totalRevenue, recentOrders }
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

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    { icon: '👗', label: 'สินค้าทั้งหมด', value: stats.totalProducts.toLocaleString(), color: '#e8a0a0' },
    { icon: '📦', label: 'คำสั่งซื้อทั้งหมด', value: stats.totalOrders.toLocaleString(), color: '#60a5fa' },
    { icon: '👥', label: 'ลูกค้าทั้งหมด', value: stats.totalCustomers.toLocaleString(), color: '#4ade80' },
    { icon: '⏳', label: 'รอตรวจสลิป', value: stats.pendingOrders.toLocaleString(), color: '#fbbf24', urgent: stats.pendingOrders > 0 },
    { icon: '💰', label: 'รายได้รวม (บาท)', value: Number(stats.totalRevenue._sum.totalAmount || 0).toLocaleString('th-TH', { minimumFractionDigits: 0 }), color: '#a78bfa' },
  ]

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>แดชบอร์ด</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>ภาพรวมร้านค้าและคำสั่งซื้อ</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className="glass-card"
            style={{
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
              border: card.urgent ? `1px solid ${card.color}44` : undefined,
            }}
          >
            {card.urgent && (
              <div className="notification-dot" style={{ position: 'absolute', top: '1rem', right: '1rem' }} />
            )}
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{card.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>คำสั่งซื้อล่าสุด</h2>
          <Link href="/admin/orders" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ดูทั้งหมด →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            ยังไม่มีคำสั่งซื้อ
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.recentOrders.map((order) => {
              const statusInfo = statusLabels[order.status] || { label: order.status, className: 'badge-info' }
              return (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--color-bg)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {order.user.image ? (
                      <img src={order.user.image} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#{order.orderNumber}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        ฿{Number(order.totalAmount).toLocaleString('th-TH')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {order.items.length} รายการ
                      </div>
                    </div>
                    <span className={`badge ${statusInfo.className}`}>{statusInfo.label}</span>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      style={{ color: 'var(--color-info)', fontSize: '0.8rem', textDecoration: 'none' }}
                    >
                      ดูรายละเอียด →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

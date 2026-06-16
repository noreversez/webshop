import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          items: {
            include: {
              product: { select: { name: true } },
              variant: { select: { color: true, size: true } },
            },
          },
        },
      },
      pointTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })
  return user
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

export default async function ProfilePage() {
  const session = await auth()
  if (!session || !session.user?.id) redirect('/login')

  const user = await getUserData(session.user.id)
  if (!user) redirect('/login')

  const totalSpent = user.orders
    .filter(o => ['CONFIRMED','PROCESSING','SHIPPED','DELIVERED'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.totalAmount), 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>FASHION STORE</span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/shop" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>🛍️ ช็อปปิ้ง</Link>
            <Link href="/cart" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>🛒 ตะกร้า</Link>
          </div>
        </div>
      </nav>

      <div className="container-custom" style={{ padding: '2rem 1.5rem' }}>
        {/* Profile Header */}
        <div className="glass-card fade-in" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {user.image ? (
            <img src={user.image} alt="" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--color-primary)' }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👤</div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user.name}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              สมาชิกตั้งแต่ {new Date(user.createdAt).toLocaleDateString('th-TH', { dateStyle: 'long' })}
            </p>
          </div>

          {/* Points Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(232,160,160,0.15) 0%, rgba(201,120,120,0.1) 100%)',
            border: '1px solid rgba(232,160,160,0.3)',
            borderRadius: '16px',
            padding: '1.25rem 2rem',
            textAlign: 'center',
          }}>
            <div className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800 }}>{user.points.toLocaleString()}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>แต้มสะสม</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'คำสั่งซื้อทั้งหมด', value: user.orders.length, icon: '📦' },
            { label: 'ยอดซื้อรวม (บาท)', value: `฿${totalSpent.toLocaleString('th-TH')}`, icon: '💳' },
            { label: 'รอการจัดส่ง', value: user.orders.filter(o => o.status === 'SHIPPED').length, icon: '🚚' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Order History */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>ประวัติการสั่งซื้อ</h2>
          {user.orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              ยังไม่มีรายการสั่งซื้อ{' '}
              <Link href="/shop" style={{ color: 'var(--color-primary)' }}>เริ่มช็อปปิ้งเลย!</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {user.orders.map((order) => {
                const statusInfo = statusLabels[order.status] || { label: order.status, className: 'badge-info' }
                return (
                  <div key={order.id} style={{
                    padding: '1rem',
                    background: 'var(--color-bg)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>#{order.orderNumber}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {new Date(order.createdAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
                        </div>
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
                          {order.items.map(i => `${i.product.name} (${i.variant.color}/${i.variant.size})`).join(', ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>฿{Number(order.totalAmount).toLocaleString('th-TH')}</div>
                        <span className={`badge ${statusInfo.className}`} style={{ marginTop: '0.25rem', display: 'inline-block' }}>{statusInfo.label}</span>
                        {order.status === 'PENDING_PAYMENT' && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <Link href={`/orders/${order.id}/pay`} className="btn-primary" style={{ textDecoration: 'none', padding: '0.3rem 0.75rem', fontSize: '0.8rem', display: 'inline-block' }}>
                              แนบสลิป
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Point Transaction History */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>ประวัติแต้ม</h2>
          {user.pointTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              ยังไม่มีประวัติแต้ม
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {user.pointTransactions.map((tx) => (
                <div key={tx.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'var(--color-bg)',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem' }}>{tx.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(tx.createdAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: tx.type === 'EARNED' ? 'var(--color-success)' : 'var(--color-error)',
                  }}>
                    {tx.type === 'EARNED' ? '+' : '-'}{tx.points} แต้ม
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

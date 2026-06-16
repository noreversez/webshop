import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'

export default async function AdminCustomersPage() {
  const session = await auth()

  const customers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true } },
      orders: {
        where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        select: { totalAmount: true },
      },
    },
  })

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>ลูกค้า</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          จัดการข้อมูลลูกค้าและแต้มสะสม ({customers.length} คน)
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {customers.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            ยังไม่มีลูกค้า
          </div>
        ) : (
          customers.map((customer) => {
            const totalSpent = customer.orders.reduce((s, o) => s + Number(o.totalAmount), 0)
            return (
              <div key={customer.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {customer.image ? (
                  <img src={customer.image} alt="" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--color-border)', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>👤</div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{customer.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    สมาชิกตั้งแต่ {new Date(customer.createdAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{customer._count.orders}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>ออเดอร์</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600 }}>฿{totalSpent.toLocaleString('th-TH')}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>ยอดซื้อรวม</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-warning)' }}>⭐ {customer.points}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>แต้ม</div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

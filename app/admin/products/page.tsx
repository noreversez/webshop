import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: { where: { isActive: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>สินค้า</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>จัดการสินค้าและตัวเลือก (สี/ไซส์/สต็อก)</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
          + เพิ่มสินค้าใหม่
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {products.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            ยังไม่มีสินค้า — <Link href="/admin/products/new" style={{ color: 'var(--color-primary)' }}>เพิ่มสินค้าแรก</Link>
          </div>
        ) : (
          products.map((product) => {
            const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
            const minPrice = product.variants.length ? Math.min(...product.variants.map(v => Number(v.price))) : 0
            const maxPrice = product.variants.length ? Math.max(...product.variants.map(v => Number(v.price))) : 0

            return (
              <div key={product.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                {/* Image */}
                <div style={{ width: 64, height: 64, borderRadius: '10px', overflow: 'hidden', background: 'var(--color-bg-hover)', flexShrink: 0 }}>
                  {product.images[0] ? (
                    <img src={product.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👗</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{product.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {product.category?.name || 'ไม่มีหมวดหมู่'} · {product.variants.length} ตัวเลือก
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                      ฿{minPrice.toLocaleString('th-TH')}{minPrice !== maxPrice ? ` – ฿${maxPrice.toLocaleString('th-TH')}` : ''}
                    </span>
                    <span style={{ color: 'var(--color-text-subtle)', marginLeft: '0.75rem' }}>
                      สต็อก: <span style={{ color: totalStock <= 5 ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: 600 }}>{totalStock} ชิ้น</span>
                    </span>
                  </div>
                </div>

                {/* Active badge */}
                <span className={`badge ${product.isActive ? 'badge-success' : 'badge-error'}`}>
                  {product.isActive ? 'เปิดขาย' : 'ปิดขาย'}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="btn-secondary"
                    style={{ textDecoration: 'none', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                  >
                    แก้ไข
                  </Link>
                  <Link
                    href={`/shop/${product.id}`}
                    target="_blank"
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      textDecoration: 'none',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.85rem',
                    }}
                  >
                    ดู ↗
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'
import ShopProductCard from '@/components/shop/shop-product-card'

async function getProducts(search?: string, category?: string) {
  const where: any = { isActive: true }
  if (search) where.name = { contains: search, mode: 'insensitive' }
  if (category) where.category = { slug: category }

  return prisma.product.findMany({
    where,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: { where: { isActive: true }, select: { id: true, price: true, color: true, size: true, stock: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ search?: string, category?: string }> }) {
  const session = await auth()
  const params = await searchParams

  const [products, categories] = await Promise.all([
    getProducts(params.search, params.category),
    getCategories(),
  ])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '80px' }}>
      <div className="container-custom" style={{ padding: '1rem 1rem 4rem 1rem' }}>
        
        {/* Header + Search (Compact) */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <form method="GET" style={{ flex: 1, display: 'flex' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                name="search"
                defaultValue={params.search}
                placeholder="ค้นหาสินค้า..."
                style={{ 
                  width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', 
                  borderRadius: '99px', border: '1px solid var(--color-border)', 
                  background: 'var(--color-bg-card)', fontSize: '0.9rem' 
                }}
              />
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                🔍
              </span>
            </div>
          </form>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
            <Link
              href="/"
              style={{
                padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem',
                textDecoration: 'none', border: '1px solid var(--color-border)',
                background: !params.category ? 'var(--color-primary-glow)' : 'var(--color-bg-card)',
                color: !params.category ? 'var(--color-primary)' : 'var(--color-text)',
                borderColor: !params.category ? 'rgba(232,160,160,0.4)' : 'var(--color-border)',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              ทั้งหมด
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.slug}`}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem',
                  textDecoration: 'none', border: '1px solid var(--color-border)',
                  background: params.category === cat.slug ? 'var(--color-primary-glow)' : 'var(--color-bg-card)',
                  color: params.category === cat.slug ? 'var(--color-primary)' : 'var(--color-text)',
                  borderColor: params.category === cat.slug ? 'rgba(232,160,160,0.4)' : 'var(--color-border)',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', borderRadius: '12px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👕</div>
            <p>ไม่พบสินค้า</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}>
            {products.map((product) => (
              <ShopProductCard key={product.id} product={{
                ...product,
                variants: product.variants.map(v => ({ ...v, price: Number(v.price) }))
              }} />
            ))}
          </div>
        )}
      </div>

    </main>
  )
}

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/shop/product-card'

async function getProducts(search?: string, category?: string) {
  const where: any = { isActive: true }
  if (search) where.name = { contains: search, mode: 'insensitive' }
  if (category) where.category = { slug: category }

  return prisma.product.findMany({
    where,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: { where: { isActive: true }, select: { price: true, color: true, size: true, stock: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ search?: string, category?: string }> }) {
  const session = await auth()
  const params = await searchParams

  const [products, categories] = await Promise.all([
    getProducts(params.search, params.category),
    getCategories(),
  ])

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
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {session ? (
              <>
                <Link href="/cart" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>🛒 ตะกร้า</Link>
                <Link href="/profile">
                  {session.user?.image && <img src={session.user.image} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--color-primary)' }} />}
                </Link>
              </>
            ) : (
              <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>เข้าสู่ระบบ</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container-custom" style={{ padding: '2rem 1.5rem' }}>
        {/* Header + Search */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
            สินค้าทั้งหมด
          </h1>
          <form method="GET">
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                name="search"
                defaultValue={params.search}
                placeholder="ค้นหาสินค้า..."
                className="input-styled"
                style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                🔍 ค้นหา
              </button>
            </div>
          </form>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link
              href="/shop"
              style={{
                padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem',
                textDecoration: 'none', border: '1px solid var(--color-border)',
                background: !params.category ? 'var(--color-primary-glow)' : 'transparent',
                color: !params.category ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderColor: !params.category ? 'rgba(232,160,160,0.4)' : 'var(--color-border)',
                transition: 'all 0.2s ease',
              }}
            >
              ทั้งหมด
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem',
                  textDecoration: 'none', border: '1px solid var(--color-border)',
                  background: params.category === cat.slug ? 'var(--color-primary-glow)' : 'transparent',
                  color: params.category === cat.slug ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderColor: params.category === cat.slug ? 'rgba(232,160,160,0.4)' : 'var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👗</div>
            <p>ไม่พบสินค้า</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={{
                ...product,
                variants: product.variants.map(v => ({ ...v, price: Number(v.price) }))
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string | null
    images: { url: string; isPrimary: boolean }[]
    variants: { price: number | any; color: string; size: string; stock: number }[]
    category: { name: string; slug: string } | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0]
  const minPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => Number(v.price)))
    : 0
  const maxPrice = product.variants.length > 0
    ? Math.max(...product.variants.map((v) => Number(v.price)))
    : 0
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
  const colors = [...new Set(product.variants.map((v) => v.color))]
  const sizes = [...new Set(product.variants.map((v) => v.size))]

  return (
    <Link href={`/shop/${product.id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card">
        {/* Product Image */}
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'var(--color-bg-hover)' }}>
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--color-border)' }}>
              👗
            </div>
          )}

          {/* Stock badge */}
          {totalStock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(10,10,15,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-muted)',
            }}>
              หมดแล้ว
            </div>
          )}

          {product.category && (
            <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{product.category.name}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}>
            {product.name}
          </h3>

          {/* Colors preview */}
          {colors.length > 0 && (
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {colors.slice(0, 5).map((color) => (
                <span key={color} style={{
                  padding: '0.15rem 0.5rem',
                  background: 'var(--color-bg-hover)',
                  borderRadius: '99px',
                  fontSize: '0.7rem',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                }}>
                  {color}
                </span>
              ))}
              {colors.length > 5 && <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>+{colors.length - 5}</span>}
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {sizes.map((size) => (
                <span key={size} style={{
                  padding: '0.15rem 0.4rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  color: 'var(--color-text-muted)',
                }}>
                  {size}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {minPrice === maxPrice
                ? `฿${minPrice.toLocaleString('th-TH')}`
                : `฿${minPrice.toLocaleString('th-TH')} – ฿${maxPrice.toLocaleString('th-TH')}`}
            </div>
            {totalStock > 0 && totalStock <= 5 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--color-warning)' }}>เหลือ {totalStock} ชิ้น</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

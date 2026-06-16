'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Variant {
  id: string
  color: string
  size: string
  price: any
  stock: number
}

interface Product {
  id: string
  name: string
  description: string | null
  images: { id: string; url: string; isPrimary: boolean }[]
  variants: Variant[]
  category: { name: string; slug: string } | null
}

export default function ProductDetailClient({
  product,
  isLoggedIn,
}: {
  product: Product
  isLoggedIn: boolean
}) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const router = useRouter()

  const colors = [...new Set(product.variants.map((v) => v.color))]
  const sizes = selectedColor
    ? [...new Set(product.variants.filter((v) => v.color === selectedColor && v.stock > 0).map((v) => v.size))]
    : [...new Set(product.variants.map((v) => v.size))]

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  )

  const addToCart = () => {
    if (!selectedVariant) return
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    // Get cart from localStorage
    const cartRaw = localStorage.getItem('cart')
    const cart = cartRaw ? JSON.parse(cartRaw) : []

    const existingIdx = cart.findIndex((i: any) => i.variantId === selectedVariant.id)
    if (existingIdx >= 0) {
      cart[existingIdx].quantity += quantity
    } else {
      cart.push({
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        color: selectedVariant.color,
        size: selectedVariant.size,
        price: Number(selectedVariant.price),
        quantity,
        image: product.images[0]?.url || null,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>FASHION STORE</span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/shop" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← กลับ</Link>
            <Link href="/cart" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>🛒 ตะกร้า</Link>
          </div>
        </div>
      </nav>

      <div className="container-custom" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

          {/* Images */}
          <div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', background: 'var(--color-bg-card)', marginBottom: '1rem', aspectRatio: '3/4' }}>
              {product.images[activeImage] ? (
                <img src={product.images[activeImage].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', color: 'var(--color-border)' }}>👗</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.images.map((img, idx) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveImage(idx)}
                    style={{
                      width: 72, height: 72, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                      border: activeImage === idx ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {product.category && (
              <span className="badge badge-primary" style={{ width: 'fit-content' }}>{product.category.name}</span>
            )}

            <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 }}>{product.name}</h1>

            <div className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {selectedVariant
                ? `฿${Number(selectedVariant.price).toLocaleString('th-TH')}`
                : `฿${Math.min(...product.variants.map(v => Number(v.price))).toLocaleString('th-TH')}`}
            </div>

            {product.description && (
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {product.description}
              </p>
            )}

            <div className="divider" />

            {/* Color Selector */}
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-muted)' }}>
                สี: {selectedColor && <span style={{ color: 'var(--color-text)' }}>{selectedColor}</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setSelectedSize(null) }}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '99px',
                      border: selectedColor === color ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: selectedColor === color ? 'var(--color-primary-glow)' : 'transparent',
                      color: selectedColor === color ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--font-thai)',
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            {selectedColor && (
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-muted)' }}>
                  ไซส์: {selectedSize && <span style={{ color: 'var(--color-text)' }}>{selectedSize}</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].filter(s => sizes.includes(s)).map((size) => {
                    const v = product.variants.find(v => v.color === selectedColor && v.size === size)
                    const outOfStock = !v || v.stock === 0
                    return (
                      <button
                        key={size}
                        onClick={() => !outOfStock && setSelectedSize(size)}
                        disabled={outOfStock}
                        style={{
                          width: 48, height: 48,
                          borderRadius: '10px',
                          border: selectedSize === size ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                          background: selectedSize === size ? 'var(--color-primary-glow)' : outOfStock ? 'transparent' : 'var(--color-bg-card)',
                          color: outOfStock ? 'var(--color-text-subtle)' : selectedSize === size ? 'var(--color-primary)' : 'var(--color-text)',
                          cursor: outOfStock ? 'not-allowed' : 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          opacity: outOfStock ? 0.4 : 1,
                          transition: 'all 0.2s ease',
                          fontFamily: 'var(--font-thai)',
                          textDecoration: outOfStock ? 'line-through' : 'none',
                        }}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            {selectedVariant && (
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-muted)' }}>จำนวน</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ width: 40, height: 40, borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.25rem' }}
                  >-</button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, minWidth: '2rem', textAlign: 'center' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                    style={{ width: 40, height: 40, borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.25rem' }}
                  >+</button>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    (เหลือ {selectedVariant.stock} ชิ้น)
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={addToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="btn-primary"
              style={{
                width: '100%',
                fontSize: '1rem',
                padding: '1rem',
                opacity: !selectedVariant ? 0.5 : 1,
                cursor: !selectedVariant ? 'not-allowed' : 'pointer',
                background: addedToCart
                  ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                  : undefined,
              }}
            >
              {addedToCart ? '✅ เพิ่มลงตะกร้าแล้ว!' : !selectedVariant ? 'กรุณาเลือกสีและไซส์' : '🛒 เพิ่มลงตะกร้า'}
            </button>

            {addedToCart && (
              <Link href="/cart" className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center', fontSize: '0.95rem' }}>
                ไปที่ตะกร้าสินค้า →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

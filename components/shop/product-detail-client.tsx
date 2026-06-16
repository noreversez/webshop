'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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

const COLOR_MAP: Record<string, string> = {
  'ดำ': '#111111', 'black': '#111111',
  'ขาว': '#ffffff', 'white': '#ffffff',
  'ครีม': '#f5f5dc', 'cream': '#f5f5dc', 'เบจ': '#f5f5dc',
  'เทา': '#808080', 'gray': '#808080', 'grey': '#808080',
  'น้ำเงิน': '#0f172a', 'blue': '#0f172a', 'กรม': '#0f172a',
  'แดง': '#dc143c', 'red': '#dc143c',
  'เขียว': '#228b22', 'green': '#228b22', 'โอลีฟ': '#556b2f',
  'ชมพู': '#ffc0cb', 'pink': '#ffc0cb',
  'น้ำตาล': '#8b4513', 'brown': '#8b4513',
}

const getSwatchColor = (colorName: string) => {
  const normalized = colorName.toLowerCase().trim()
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (normalized.includes(key)) return val
  }
  return null
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
    window.dispatchEvent(new Event('cart-updated'))
    
    toast.success('เพิ่มสินค้าลงตะกร้าแล้ว', {
      description: `${product.name} (สี: ${selectedVariant.color}, ไซส์: ${selectedVariant.size})`,
      action: {
        label: 'ดูตะกร้า',
        onClick: () => {
          // You could open drawer here, but toast action triggers it indirectly if they click navbar icon
          // Or just let them click Navbar icon.
        }
      }
    })
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="container-custom" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

          {/* Images */}
          <div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', background: 'var(--color-bg-card)', marginBottom: '1rem', aspectRatio: '3/4' }}>
              {product.images[activeImage] ? (
                <img src={product.images[activeImage].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', color: 'var(--color-border)' }}>👕</div>
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
                {colors.map((color) => {
                  const swatchHex = getSwatchColor(color)
                  return (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setSelectedSize(null) }}
                    title={color}
                    style={{
                      width: swatchHex ? 40 : 'auto',
                      height: 40,
                      padding: swatchHex ? 0 : '0 1.25rem',
                      borderRadius: swatchHex ? '50%' : '99px',
                      border: selectedColor === color 
                        ? '2px solid var(--color-primary)' 
                        : '1px solid var(--color-border)',
                      background: swatchHex || (selectedColor === color ? 'var(--color-primary-glow)' : 'transparent'),
                      color: swatchHex ? 'transparent' : (selectedColor === color ? 'var(--color-primary)' : 'var(--color-text-muted)'),
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--font-thai)',
                      boxShadow: selectedColor === color ? '0 0 0 2px white inset' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {!swatchHex && color}
                  </button>
                )})}
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

            {/* Add to Cart Sticky mobile bar will be handled later, standard button here */}
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
                  ? 'var(--color-success)'
                  : undefined,
                color: addedToCart ? 'white' : undefined,
              }}
            >
              {addedToCart ? '✅ เพิ่มลงตะกร้าแล้ว!' : !selectedVariant ? 'กรุณาเลือกสีและไซส์' : 'เพิ่มลงตะกร้า'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add-to-Cart Bar */}
      <div className="mobile-sticky-cart">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>ยอดรวม</span>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {selectedVariant
                ? `฿${(Number(selectedVariant.price) * quantity).toLocaleString('th-TH')}`
                : `฿${Math.min(...product.variants.map(v => Number(v.price))).toLocaleString('th-TH')}`}
            </span>
          </div>
          <button
            onClick={addToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="btn-primary"
            style={{
              flex: 1,
              maxWidth: '200px',
              padding: '0.8rem',
              fontSize: '0.95rem',
              opacity: !selectedVariant ? 0.5 : 1,
              background: addedToCart ? 'var(--color-success)' : undefined,
              color: addedToCart ? 'white' : undefined,
            }}
          >
            {addedToCart ? '✅ เพิ่มแล้ว' : '🛒 ซื้อเลย'}
          </button>
        </div>
      </div>
    </div>
  )
}

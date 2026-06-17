'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  images: { url: string; isPrimary: boolean }[]
  variants: Variant[]
  category: { name: string; slug: string } | null
}

export default function ShopProductCard({ product }: { product: Product }) {
  // Aggregate sizes across all colors (assuming each product listing is a specific color/design)
  const sizes = [...new Set(product.variants.map((v) => v.size))]
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
  
  // Find the selected variant (pick first color available for this size)
  const selectedVariant = selectedSize 
    ? product.variants.find(v => v.size === selectedSize && v.stock > 0) || product.variants.find(v => v.size === selectedSize)
    : null

  const minPrice = product.variants.length > 0 ? Math.min(...product.variants.map((v) => Number(v.price))) : 0
  const maxPrice = product.variants.length > 0 ? Math.max(...product.variants.map((v) => Number(v.price))) : 0
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
  
  // Assuming 'HOT' if stock is low or just randomly for demo based on ID, but let's just use a condition.
  // For now, if ID ends in a specific way or just hardcode it to show based on stock.
  const isHot = totalStock > 0 && totalStock < 50

  const addToCart = () => {
    if (!selectedVariant) return

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
        image: primaryImage?.url || null,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    
    toast.success('เพิ่มสินค้าลงตะกร้าแล้ว', {
      description: `${product.name} (ไซส์: ${selectedVariant.size})`,
    })
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    
    // Reset quantity after adding
    setQuantity(1)
  }

  return (
    <div style={{
      background: 'var(--color-bg-card)',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      position: 'relative'
    }}>
      {/* Product Image Link */}
      <Link href={`/shop/${product.id}`} style={{ display: 'block', position: 'relative', aspectRatio: '1/1', background: 'var(--color-bg-hover)' }}>
        {primaryImage ? (
          <img src={primaryImage.url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👕</div>
        )}
        
        {/* Top Badges */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
          {isHot ? (
            <span style={{ background: '#ff4d4f', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              🔥 HOT
            </span>
          ) : <span />}
          
          <span style={{ background: 'rgba(255,255,255,0.8)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#333' }}>
            {product.name.split(' ')[0]} {/* Assume first word is code like R-014 */}
          </span>
        </div>
      </Link>

      {/* Product Info & Controls */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <Link href={`/shop/${product.id}`} style={{ textDecoration: 'none', color: 'var(--color-text)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </h3>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            ฿{minPrice.toLocaleString('th-TH')}
          </span>
          {/* Optional: if there was a discount, show crossed out price here */}
        </div>

        {/* Sizes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '1rem' }}>
          {sizes.map((size) => {
            // Find stock for this size
            const variantsOfSize = product.variants.filter(v => v.size === size)
            const sizeStock = variantsOfSize.reduce((acc, v) => acc + v.stock, 0)
            const outOfStock = sizeStock === 0

            return (
              <button
                key={size}
                onClick={() => !outOfStock && setSelectedSize(size)}
                disabled={outOfStock}
                style={{
                  padding: '0.4rem 0',
                  borderRadius: '4px',
                  border: selectedSize === size ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: selectedSize === size ? 'var(--color-primary-glow)' : 'transparent',
                  color: outOfStock ? 'var(--color-text-subtle)' : selectedSize === size ? 'var(--color-primary)' : 'var(--color-text)',
                  fontSize: '0.85rem',
                  fontWeight: selectedSize === size ? 600 : 400,
                  cursor: outOfStock ? 'not-allowed' : 'pointer',
                  opacity: outOfStock ? 0.4 : 1,
                  textDecoration: outOfStock ? 'line-through' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {size}
              </button>
            )
          })}
        </div>

        {/* Quantity Adjuster */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-primary)' }}
          >-</button>
          <span style={{ fontSize: '1rem', fontWeight: 600, minWidth: '1.5rem', textAlign: 'center' }}>{quantity}</span>
          <button
            onClick={() => {
              const maxStock = selectedVariant ? selectedVariant.stock : 99 // Fallback if no size selected
              setQuantity(Math.min(maxStock, quantity + 1))
            }}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-primary)' }}
          >+</button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          disabled={!selectedSize || Boolean(selectedVariant && selectedVariant.stock === 0)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '6px',
            border: 'none',
            background: addedToCart ? 'var(--color-success)' : 'var(--color-primary)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: (!selectedSize || (selectedVariant && selectedVariant.stock === 0)) ? 'not-allowed' : 'pointer',
            opacity: (!selectedSize || (selectedVariant && selectedVariant.stock === 0)) ? 0.5 : 1,
            transition: 'all 0.2s ease',
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {addedToCart ? '✅ เพิ่มแล้ว' : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              เพิ่มลงตะกร้า
            </>
          )}
        </button>
      </div>
    </div>
  )
}

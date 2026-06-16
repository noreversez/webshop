'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Variant {
  color: string
  size: string
  price: string
  stock: string
  sku: string
}

export default function NewProductPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [variants, setVariants] = useState<Variant[]>([{ color: '', size: 'M', price: '', stock: '0', sku: '' }])
  const [images, setImages] = useState<{ file: File; preview: string; url?: string; driveFileId?: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addVariant = () => {
    setVariants([...variants, { color: '', size: 'M', price: '', stock: '0', sku: '' }])
  }

  const updateVariant = (idx: number, key: keyof Variant, val: string) => {
    const updated = [...variants]
    updated[idx][key] = val
    setVariants(updated)
  }

  const removeVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setImages([...images, ...newImages])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload images first
      setUploading(true)
      const uploadedImages = []
      for (const img of images) {
        const formData = new FormData()
        formData.append('file', img.file)
        formData.append('type', 'product')
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        uploadedImages.push({ url: data.url, driveFileId: data.fileId })
      }
      setUploading(false)

      // Create product
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          images: uploadedImages,
          variants: variants.map(v => ({
            color: v.color,
            size: v.size,
            price: parseFloat(v.price),
            stock: parseInt(v.stock),
            sku: v.sku || undefined,
          })),
        }),
      })

      if (res.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const err = await res.json()
        alert(err.error || 'เกิดข้อผิดพลาด')
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'FREE SIZE']

  return (
    <div className="fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>เพิ่มสินค้าใหม่</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>กรอกข้อมูลสินค้าและตัวเลือกด้านล่าง</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Basic Info */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ข้อมูลสินค้า</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>ชื่อสินค้า *</label>
              <input className="input-styled" value={name} onChange={e => setName(e.target.value)} placeholder="เช่น เสื้อยืดลายดอก" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>รายละเอียด</label>
              <textarea className="input-styled" value={description} onChange={e => setDescription(e.target.value)} placeholder="รายละเอียดสินค้า, วัสดุ, วิธีดูแลรักษา..." rows={3} style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>รูปภาพ (เก็บบน Google Drive)</h2>
          <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} id="img-upload" />
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={img.preview} alt="" style={{ width: 80, height: 80, borderRadius: '10px', objectFit: 'cover', border: '2px solid var(--color-border)' }} />
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', background: 'var(--color-error)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            ))}
            <label htmlFor="img-upload" style={{ width: 80, height: 80, borderRadius: '10px', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--color-text-subtle)', flexShrink: 0 }}>+</label>
          </div>
          {images.length > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.5rem' }}>รูปแรกจะเป็นรูปหลักของสินค้า</p>}
        </div>

        {/* Variants */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ตัวเลือกสินค้า (สี/ไซส์/ราคา/สต็อก)</h2>
            <button type="button" onClick={addVariant} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>+ เพิ่ม</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {variants.map((v, idx) => (
              <div key={idx} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                gap: '0.75rem', alignItems: 'end',
                padding: '1rem', background: 'var(--color-bg)', borderRadius: '12px', border: '1px solid var(--color-border)',
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginBottom: '0.3rem' }}>สี *</label>
                  <input className="input-styled" value={v.color} onChange={e => updateVariant(idx, 'color', e.target.value)} placeholder="เช่น แดง" required style={{ padding: '0.5rem 0.75rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginBottom: '0.3rem' }}>ไซส์ *</label>
                  <select className="input-styled" value={v.size} onChange={e => updateVariant(idx, 'size', e.target.value)} style={{ padding: '0.5rem 0.75rem' }}>
                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginBottom: '0.3rem' }}>ราคา (บาท) *</label>
                  <input className="input-styled" type="number" value={v.price} onChange={e => updateVariant(idx, 'price', e.target.value)} placeholder="0" required min="0" style={{ padding: '0.5rem 0.75rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginBottom: '0.3rem' }}>สต็อก *</label>
                  <input className="input-styled" type="number" value={v.stock} onChange={e => updateVariant(idx, 'stock', e.target.value)} placeholder="0" required min="0" style={{ padding: '0.5rem 0.75rem' }} />
                </div>
                <button type="button" onClick={() => removeVariant(idx)} disabled={variants.length <= 1} style={{ width: 36, height: 36, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.9rem', opacity: variants.length <= 1 ? 0.3 : 1 }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="btn-primary"
          style={{ padding: '1rem', fontSize: '1rem', width: '100%' }}
        >
          {uploading ? 'กำลังอัปโหลดรูปภาพ...' : loading ? 'กำลังบันทึก...' : '💾 บันทึกสินค้า'}
        </button>
      </form>
    </div>
  )
}

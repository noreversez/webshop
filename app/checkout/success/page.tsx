'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-success)' }}>
          สั่งซื้อและแนบสลิปสำเร็จ!
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          ขอบคุณที่สั่งซื้อสินค้ากับเราครับ<br/>
          แอดมินได้รับข้อมูลการสั่งซื้อและสลิปโอนเงินของคุณเรียบร้อยแล้ว<br/>
          ทางเราจะทำการตรวจสอบและจัดส่งสินค้าให้โดยเร็วที่สุดครับ
        </p>
        
        {orderNumber && (
          <div style={{ background: 'var(--color-bg-hover)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>หมายเลขคำสั่งซื้อของคุณ</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '1px' }}>{orderNumber}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href={process.env.NEXT_PUBLIC_LINE_OA_URL || 'https://lin.ee/placeholder'} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none', background: '#00B900', color: 'white', borderColor: '#00B900' }}>
            💬 ติดต่อแอดมิน / แจ้งรับเลขพัสดุทาง LINE
          </a>
          <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            กลับสู่หน้าแรก
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem' }}>กำลังโหลด...</div>}>
      <SuccessContent />
    </Suspense>
  )
}

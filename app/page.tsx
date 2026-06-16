import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  const session = await auth()

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div>
              <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                FASHION
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem', letterSpacing: '0.1em' }}>
                STORE
              </span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {session ? (
              <>
                <Link href="/shop" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}>
                  สินค้า
                </Link>
                <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--color-primary)' }}
                    />
                  )}
                </Link>
              </>
            ) : (
              <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '0.5rem 1.5rem' }}>
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '4rem 1.5rem',
      }}>
        {/* Background glow orbs */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(232,160,160,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(150,100,200,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div className="container-custom fade-in" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="badge badge-primary" style={{ marginBottom: '1.5rem', fontSize: '0.8rem' }}>
            🌟 NEW COLLECTION 2026
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
          }}>
            <span className="gradient-text">แฟชั่นพรีเมียม</span>
            <br />
            <span style={{ color: 'var(--color-text)' }}>สไตล์คุณ สั่งง่าย</span>
            <br />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.6em' }}>ผ่าน LINE</span>
          </h1>
          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '1.1rem',
            maxWidth: '500px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.8,
          }}>
            เสื้อผ้าคุณภาพดี คัดสรรมาเพื่อคุณ พร้อมระบบสะสมแต้มและดีลพิเศษสำหรับสมาชิก
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {session ? (
              <Link href="/shop" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.9rem 2rem' }}>
                🛍️ เลือกซื้อสินค้า
              </Link>
            ) : (
              <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.9rem 2rem' }}>
                🟢 เข้าสู่ระบบด้วย LINE
              </Link>
            )}
            <Link href="/shop" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.9rem 2rem' }}>
              ดูสินค้าทั้งหมด
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            marginTop: '4rem',
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'สินค้าทั้งหมด', value: '200+' },
              { label: 'ลูกค้าที่ไว้ใจ', value: '5,000+' },
              { label: 'สั่งซื้อแล้ว', value: '12,000+' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card" style={{ padding: '1.25rem 2rem', textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stat.value}</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--color-bg-elevated)' }}>
        <div className="container-custom">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '3rem' }}>
            ทำไมต้องเลือก <span className="gradient-text">Fashion Store</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🟢', title: 'ล็อกอินง่ายผ่าน LINE', desc: 'เชื่อมต่อบัญชี LINE ในคลิกเดียว ไม่ต้องจำรหัสผ่าน' },
              { icon: '⭐', title: 'สะสมแต้มทุกคำสั่งซื้อ', desc: 'ซื้อสินค้าได้แต้ม นำไปแลกส่วนลดครั้งต่อไปได้เลย' },
              { icon: '📦', title: 'เลือกสี-ไซส์ได้ครบ', desc: 'สต็อกอัปเดต real-time ไม่มีปัญหาสินค้าหมดแล้วยังกดสั่งได้' },
              { icon: '💳', title: 'ชำระเงินง่าย', desc: 'โอนเงินแล้วแนบสลิป ทีมงานตรวจสอบและยืนยันภายใน 1 ชั่วโมง' },
            ].map((feature) => (
              <div key={feature.title} className="glass-card glass-card-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.85rem',
      }}>
        <p>© 2026 Fashion Store. All rights reserved.</p>
      </footer>
    </main>
  )
}

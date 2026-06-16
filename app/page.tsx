import { auth } from '@/auth'
import Link from 'next/link'
import HeroSlideshow from '@/components/shop/hero-slideshow'

export default async function HomePage() {
  const session = await auth()

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Navigation - Minimal */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                FASHION
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem', letterSpacing: '0.1em' }}>
                STORE
              </span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/shop" style={{ textDecoration: 'none', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              สินค้า
            </Link>
            {session ? (
              <Link href="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                )}
              </Link>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 500 }}>
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section style={{
        minHeight: 'calc(100vh - 65px)',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem 1.5rem',
      }}>
        <div className="container-custom" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem', 
          alignItems: 'center',
          height: '100%',
        }}>
          
          <div className="fade-in" style={{ paddingRight: '2rem' }}>
            <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontWeight: 500 }}>
              คอลเลกชันใหม่ 2026
            </p>
            <h1 style={{
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.04em',
            }}>
              ความเรียบง่าย <br />
              <span style={{ fontWeight: 600 }}>คือความดูดี</span> <br />
              ที่สุด.
            </h1>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '1rem',
              maxWidth: '400px',
              marginBottom: '2.5rem',
              lineHeight: 1.7,
            }}>
              ค้นพบเสื้อผ้าพรีเมียมที่เน้นความมินิมอล พร้อมประสบการณ์สั่งซื้อง่ายๆ ผ่าน LINE
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/shop" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.95rem', padding: '0.9rem 2.5rem' }}>
                เลือกซื้อสินค้า
              </Link>
              {!session && (
                <Link href="/login" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  textDecoration: 'none', 
                  fontSize: '0.95rem', 
                  padding: '0.8rem 1.5rem', 
                  background: '#00B900',
                  color: '#ffffff', 
                  fontWeight: 600, 
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(0, 185, 0, 0.2)',
                  transition: 'all 0.2s ease',
                }}
                className="hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 10.275c0-5.366-5.383-9.738-12-9.738-6.616 0-12 4.372-12 9.738 0 4.814 3.94 8.89 9.122 9.593.363.1.84.321.966.699.117.345.037.886 0 1.25l-.226 1.34c-.066.39-.325 1.593 1.391.87 1.716-.723 9.255-5.452 11.517-9.014C23.593 13.623 24 12.028 24 10.275zM19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .26-.148.479-.396.586a.632.632 0 0 1-.718-.126l-2.819-3.927v3.412c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.264.149-.485.405-.592.253-.109.549-.046.732.144l2.796 3.88V8.108c0-.345.282-.63.631-.63.345 0 .627.285.627.63v4.771zm-5.972 0c0 .344-.282.629-.631.629H6.524c-.345 0-.629-.285-.629-.629V8.108c0-.345.284-.63.629-.63.348 0 .63.285.63.63v4.141h1.754c.348 0 .63.285.63.631zM4.646 8.108v4.771c0 .344-.282.629-.63.629-.346 0-.629-.285-.629-.629V8.108c0-.345.283-.63.629-.63.348 0 .63.285.63.63z"/>
                  </svg>
                  เข้าสู่ระบบด้วย LINE
                </Link>
              )}
            </div>
          </div>

          {/* Right: Slideshow */}
          <div className="fade-in" style={{ height: '70vh', width: '100%', minHeight: '500px' }}>
            <HeroSlideshow />
          </div>

        </div>
      </section>

      {/* Minimal Features Section */}
      <section style={{ padding: '6rem 1.5rem', background: 'var(--color-bg)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '4rem' }}>
            {[
              { num: '01', title: 'ล็อกอินคลิกเดียว', desc: 'เชื่อมต่อบัญชี LINE ของคุณทันที ไม่ต้องจำรหัสผ่าน' },
              { num: '02', title: 'สะสมแต้มอัตโนมัติ', desc: 'รับแต้มสะสมทุกครั้งที่ออเดอร์ได้รับการยืนยัน' },
              { num: '03', title: 'สต็อก Real-time', desc: 'อัปเดตจำนวนสินค้าเรียลไทม์ หมดปัญหาสินค้าหมด' },
              { num: '04', title: 'จ่ายเงินง่าย', desc: 'รูปแบบการสั่งซื้อ 2 ขั้นตอน พร้อมแนบสลิปผ่านหน้าเว็บ' },
            ].map((feature) => (
              <div key={feature.title} style={{ paddingRight: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', marginBottom: '1rem', fontWeight: 500 }}>{feature.num} //</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{feature.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        color: 'var(--color-text-subtle)',
        fontSize: '0.8rem',
        background: 'var(--color-bg-elevated)'
      }}>
        <p>© 2026 Fashion Store. คัดสรรทุกรายละเอียดเพื่อคุณ</p>
      </footer>
    </main>
  )
}

import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="container-custom" style={{ padding: '1rem 1rem 4rem 1rem' }}>
        
        {/* Search Bar Skeleton */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Skeleton style={{ height: '44px', width: '100%', borderRadius: '99px' }} />
        </div>

        {/* Categories Skeleton */}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} style={{ height: '36px', width: '80px', borderRadius: '99px', flexShrink: 0 }} />
          ))}
        </div>

        {/* Product Grid Skeleton (Shopee style compact) */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '0.75rem',
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-bg-card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <Skeleton style={{ aspectRatio: '1/1', width: '100%' }} />
              <div style={{ padding: '1rem' }}>
                <Skeleton style={{ height: '20px', width: '80%', marginBottom: '0.5rem', margin: '0 auto' }} />
                <Skeleton style={{ height: '24px', width: '60%', marginBottom: '1rem', margin: '0 auto' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '1rem' }}>
                    <Skeleton style={{ height: '32px', borderRadius: '4px' }} />
                    <Skeleton style={{ height: '32px', borderRadius: '4px' }} />
                    <Skeleton style={{ height: '32px', borderRadius: '4px' }} />
                </div>
                <Skeleton style={{ height: '36px', width: '100%', borderRadius: '6px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

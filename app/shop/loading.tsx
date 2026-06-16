import { Skeleton } from '@/components/ui/skeleton'

export default function ShopLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="container-custom" style={{ padding: '2rem 1.5rem' }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <Skeleton style={{ height: '40px', width: '200px' }} />
          <Skeleton style={{ height: '48px', width: '100%', maxWidth: '400px', borderRadius: '99px' }} />
        </div>

        {/* Categories Skeleton */}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} style={{ height: '36px', width: '80px', borderRadius: '99px', flexShrink: 0 }} />
          ))}
        </div>

        {/* Product Grid Skeleton */}
        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Skeleton style={{ aspectRatio: '3/4', width: '100%', borderRadius: '16px' }} />
              <div style={{ padding: '0.5rem' }}>
                <Skeleton style={{ height: '20px', width: '80%', marginBottom: '0.5rem' }} />
                <Skeleton style={{ height: '16px', width: '40%', marginBottom: '1rem' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton style={{ height: '24px', width: '30%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

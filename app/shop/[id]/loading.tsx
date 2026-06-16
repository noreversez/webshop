import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="container-custom" style={{ padding: '2rem 1.5rem' }}>
        <div className="grid-split align-start">
          
          {/* Images Skeleton */}
          <div>
            <Skeleton style={{ aspectRatio: '3/4', width: '100%', borderRadius: '20px', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} style={{ width: '72px', height: '72px', borderRadius: '10px' }} />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Skeleton style={{ height: '24px', width: '80px', borderRadius: '99px' }} />
            <Skeleton style={{ height: '48px', width: '80%' }} />
            <Skeleton style={{ height: '36px', width: '40%' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Skeleton style={{ height: '16px', width: '100%' }} />
              <Skeleton style={{ height: '16px', width: '90%' }} />
              <Skeleton style={{ height: '16px', width: '60%' }} />
            </div>

            <div className="divider" style={{ margin: '1rem 0' }} />

            <div>
              <Skeleton style={{ height: '20px', width: '60px', marginBottom: '0.75rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                ))}
              </div>
            </div>

            <div>
              <Skeleton style={{ height: '20px', width: '60px', marginBottom: '0.75rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} style={{ width: '48px', height: '48px', borderRadius: '10px' }} />
                ))}
              </div>
            </div>

            <Skeleton style={{ height: '56px', width: '100%', borderRadius: '12px', marginTop: '1rem' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

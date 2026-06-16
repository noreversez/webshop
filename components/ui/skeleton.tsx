export function Skeleton({
  className = '',
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        background: 'var(--color-bg-hover)',
        borderRadius: '8px',
        ...style,
      }}
    />
  )
}

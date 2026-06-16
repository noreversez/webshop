import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import ProductDetailClient from '@/components/shop/product-detail-client'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true }, orderBy: [{ color: 'asc' }, { size: 'asc' }] },
      category: { select: { name: true, slug: true } },
    },
  })

  if (!product) notFound()

  return <ProductDetailClient product={{
    ...product,
    variants: product.variants.map(v => ({ ...v, price: Number(v.price) }))
  }} isLoggedIn={!!session} />
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET all products (public)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categorySlug = searchParams.get('category')
  const search = searchParams.get('search')
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 12)

  const where: any = { isActive: true }
  if (search) where.name = { contains: search, mode: 'insensitive' }
  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isActive: true }, select: { price: true, color: true, size: true, stock: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, limit })
}

// POST create product (admin only)
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, categoryId, images, variants } = body

  const product = await prisma.product.create({
    data: {
      name,
      description,
      categoryId: categoryId || null,
      images: images?.length ? {
        create: images.map((img: any, i: number) => ({
          url: img.url,
          driveFileId: img.driveFileId,
          isPrimary: i === 0,
          sortOrder: i,
        })),
      } : undefined,
      variants: variants?.length ? {
        create: variants.map((v: any) => ({
          color: v.color,
          size: v.size,
          price: v.price,
          stock: v.stock || 0,
          sku: v.sku || null,
        })),
      } : undefined,
    },
    include: {
      images: true,
      variants: true,
    },
  })

  return NextResponse.json(product, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { nanoid } from 'nanoid'

// POST create order (authenticated customer)
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { items, shippingName, shippingPhone, shippingAddr } = body

  if (!items?.length) {
    return NextResponse.json({ error: 'No items' }, { status: 400 })
  }

  // Fetch all variants to check stock and get prices
  const variantIds = items.map((i: any) => i.variantId)
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
  })

  const variantMap = Object.fromEntries(variants.map((v) => [v.id, v]))

  // Validate stock
  for (const item of items) {
    const variant = variantMap[item.variantId]
    if (!variant) return NextResponse.json({ error: `Variant not found: ${item.variantId}` }, { status: 400 })
    if (variant.stock < item.quantity) {
      return NextResponse.json({ error: `สินค้าหมด: ${variant.color}/${variant.size}` }, { status: 400 })
    }
  }

  // Calculate total
  const totalAmount = items.reduce((sum: number, item: any) => {
    return sum + Number(variantMap[item.variantId].price) * item.quantity
  }, 0)

  const orderNumber = `ORD-${Date.now()}-${nanoid(4).toUpperCase()}`

  // Create order and decrement stock in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: session.user.id!,
        orderNumber,
        totalAmount,
        shippingName,
        shippingPhone,
        shippingAddr,
        items: {
          create: items.map((item: any) => ({
            productId: variantMap[item.variantId].productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: variantMap[item.variantId].price,
          })),
        },
      },
    })

    // Decrement stock for each variant
    for (const item of items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return newOrder
  })

  return NextResponse.json(order, { status: 201 })
}

// GET customer's own orders
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
          variant: { select: { color: true, size: true } },
        },
      },
    },
  })

  return NextResponse.json(orders)
}

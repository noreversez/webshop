import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// PATCH: upload slip for an order
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { slipUrl, slipDriveId } = body

  const { id } = await params

  // Make sure this order belongs to the user
  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const updated = await prisma.order.update({
    where: { id },
    data: {
      slipUrl,
      slipDriveId,
      status: 'PAYMENT_REVIEW',
    },
  })

  return NextResponse.json(updated)
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { status, slipVerified, trackingNum, awardPoints } = body

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // Calculate points to award (1 point per 100 baht)
  const pointsPerHundred = Number(process.env.POINTS_PER_100_BAHT || 1)
  const pointsToAward = awardPoints
    ? Math.floor(Number(order.totalAmount) / 100) * pointsPerHundred
    : 0

  // Update order + optionally award points in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: {
        status,
        slipVerified: slipVerified ?? order.slipVerified,
        trackingNum: trackingNum ?? order.trackingNum,
        pointsEarned: awardPoints ? pointsToAward : order.pointsEarned,
      },
    })

    if (awardPoints && pointsToAward > 0 && order.userId) {
      // Add points to user
      await tx.user.update({
        where: { id: order.userId },
        data: { points: { increment: pointsToAward } },
      })

      // Record point transaction
      await tx.pointTransaction.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          type: 'EARNED',
          points: pointsToAward,
          description: `ซื้อสินค้า ออเดอร์ #${order.orderNumber}`,
        },
      })
    }
  })

  return NextResponse.json({ success: true, pointsAwarded: pointsToAward })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

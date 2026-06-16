import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

async function proxy(req: NextRequest) {
  const session = await auth()
  const { pathname } = req.nextUrl

  // Admin routes protection
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Customer routes protection
  if (
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/orders') ||
    pathname === '/profile'
  ) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export default proxy

export const config = {
  matcher: [
    '/admin/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile',
  ],
}

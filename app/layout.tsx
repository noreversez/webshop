import type { Metadata } from 'next'
import { Noto_Sans_Thai, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'
import NextTopLoader from 'nextjs-toploader'
import Navbar from '@/components/layout/navbar'
import LineFloatingButton from '@/components/line-floating-button'
import CartFloatingButton from '@/components/cart-floating-button'
import { auth } from '@/auth'

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-thai',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'rpcashop | ร้านเสื้อผ้าแฟชั่น',
  description: 'ร้านขายเสื้อผ้าแฟชั่น คุณภาพพรีเมียม สั่งซื้อง่ายผ่าน LINE',
  keywords: 'เสื้อผ้า, แฟชั่น, ร้านค้าออนไลน์',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${notoSansThai.variable} ${inter.variable} font-thai antialiased`}>
        <NextTopLoader
          color="var(--color-primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--color-primary),0 0 5px var(--color-primary)"
        />
        <Providers>
          <Navbar session={session} />
          <div style={{ paddingTop: '80px' }}>
            {children}
          </div>
          <LineFloatingButton />
          <CartFloatingButton />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}

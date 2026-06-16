import type { Metadata } from 'next'
import { Noto_Sans_Thai, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

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
  title: 'Fashion Store | ร้านเสื้อผ้าแฟชั่น',
  description: 'ร้านขายเสื้อผ้าแฟชั่น คุณภาพพรีเมียม สั่งซื้อง่ายผ่าน LINE',
  keywords: 'เสื้อผ้า, แฟชั่น, ร้านค้าออนไลน์',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${notoSansThai.variable} ${inter.variable} font-thai antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

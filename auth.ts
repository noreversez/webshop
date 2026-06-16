import NextAuth from 'next-auth'
import LineProvider from 'next-auth/providers/line'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username as string },
        })

        if (!admin) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          admin.password
        )

        if (!isValid) return null

        return {
          id: admin.id,
          name: admin.name,
          email: admin.username,
          role: 'ADMIN',
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'line') {
        const lineId = user.id
        if (!lineId) return false

        // Upsert user in database
        await prisma.user.upsert({
          where: { lineId },
          update: {
            name: user.name || 'LINE User',
            image: user.image,
          },
          create: {
            lineId,
            name: user.name || 'LINE User',
            image: user.image,
          },
        })
        return true
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'line' && user) {
        const dbUser = await prisma.user.findUnique({
          where: { lineId: user.id },
        })
        token.dbUserId = dbUser?.id
        token.role = 'CUSTOMER'
        token.lineId = user.id
      }
      if (account?.provider === 'admin-credentials' && user) {
        token.role = 'ADMIN'
        token.dbUserId = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.dbUserId as string
      session.user.role = token.role as string
      session.user.lineId = token.lineId as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})

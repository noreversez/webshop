import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/admin-sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <AdminSidebar adminName={session.user?.name || 'Admin'} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

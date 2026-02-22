import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProtectedNav from '@/components/ProtectedNav'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <ProtectedNav userId={user.id} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

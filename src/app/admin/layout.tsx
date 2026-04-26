import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = {
  title: {
    default: 'Admin — Souqly',
    template: '%s | Admin Souqly',
  },
  robots: { index: false, follow: false },
}

// ---------------------------------------------------------------------------
// Layout — Server Component
// ---------------------------------------------------------------------------

/**
 * Layout protégé de l'espace super-admin.
 *
 * - Vérifie l'authentification Supabase.
 * - Vérifie le rôle `super_admin` dans app_metadata.
 * - Rend AdminShell avec la sidebar d'administration.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  const isAdmin = user.app_metadata?.role === 'super_admin'
  if (!isAdmin) {
    redirect('/dashboard')
  }

  return <AdminShell>{children}</AdminShell>
}

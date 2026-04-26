import { redirect } from 'next/navigation'
import { Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { signOut } from '@/lib/actions/auth'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MerchantRow = {
  id: string
  name: string
  slug: string
  subscription_status: string
  status: string
}

// ---------------------------------------------------------------------------
// Layout — Server Component
// ---------------------------------------------------------------------------

/**
 * Layout protégé du dashboard marchand.
 *
 * - Vérifie l'authentification Supabase.
 * - Récupère le marchand associé à l'utilisateur.
 * - Affiche une page d'attente si le compte n'est pas encore validé.
 * - Sinon, rend le shell avec la sidebar.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  // 2. Récupérer le marchand
  const { data: merchant } = await supabase
    .from('merchants')
    .select('id, name, slug, subscription_status, status')
    .eq('user_id', user.id)
    .single<MerchantRow>()

  // 3. Pas encore de marchand → compte en attente de validation
  if (!merchant) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto">
            <Clock className="h-8 w-8 text-neutral-400" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-semibold text-white">
            Compte en attente de validation
          </h1>
          <p className="text-sm text-neutral-400">
            Votre demande est en cours d&apos;examen. Vous recevrez un email dès
            l&apos;activation.
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="mt-2 text-sm text-neutral-500 hover:text-neutral-300 underline underline-offset-4 transition-colors"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </main>
    )
  }

  // 4. Rendre le shell du dashboard
  return <DashboardShell merchant={merchant}>{children}</DashboardShell>
}

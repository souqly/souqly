import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { MerchantsTable } from '@/components/admin/MerchantsTable'
import type { MerchantRow } from '@/components/admin/MerchantsTable'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Marchands',
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

export default async function MarchandsPage() {
  const admin = createAdminClient()

  const { data: merchants } = await admin
    .from('merchants')
    .select('id, name, slug, status, subscription_status, created_at, stripe_customer_id')
    .order('created_at', { ascending: false })
    .returns<MerchantRow[]>()

  const merchantList = merchants ?? []

  // Compteurs par statut
  const activeCount = merchantList.filter((m) => m.status === 'active').length
  const inactiveCount = merchantList.filter((m) => m.status !== 'active').length

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Marchands</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Gérez les comptes marchands de la plateforme.
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total</p>
          <p className="mt-1 text-2xl font-bold text-white">{merchantList.length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Actifs</p>
          <p className="mt-1 text-2xl font-bold text-green-400">{activeCount}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4 col-span-2 sm:col-span-1">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Suspendus</p>
          <p className="mt-1 text-2xl font-bold text-red-400">{inactiveCount}</p>
        </div>
      </div>

      {/* Tableau */}
      <section aria-labelledby="merchants-heading">
        <h2 id="merchants-heading" className="sr-only">
          Liste des marchands
        </h2>
        <MerchantsTable merchants={merchantList} />
      </section>
    </div>
  )
}

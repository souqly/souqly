import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { ApplicationCard } from '@/components/admin/ApplicationCard'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Candidatures',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PendingApplication = {
  id: string
  applicant_name: string
  applicant_email: string
  company_name: string | null
  message: string | null
  created_at: string
  status: string
}

type RecentApplication = {
  id: string
  applicant_name: string
  applicant_email: string
  company_name: string | null
  status: string
  reviewed_at: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') {
    return (
      <span
        aria-label="Statut : approuvée"
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400"
      >
        Approuvée
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span
        aria-label="Statut : refusée"
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400"
      >
        Refusée
      </span>
    )
  }
  return (
    <span
      aria-label={`Statut : ${status}`}
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-700 text-neutral-400"
    >
      {status}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

export default async function CandidaturesPage() {
  const admin = createAdminClient()

  const [{ data: pending }, { data: recent }] = await Promise.all([
    admin
      .from('merchant_applications')
      .select('id, applicant_name, applicant_email, company_name, message, created_at, status')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .returns<PendingApplication[]>(),

    admin
      .from('merchant_applications')
      .select('id, applicant_name, applicant_email, company_name, status, reviewed_at, created_at')
      .neq('status', 'pending')
      .order('reviewed_at', { ascending: false })
      .limit(20)
      .returns<RecentApplication[]>(),
  ])

  const pendingList = pending ?? []
  const recentList = recent ?? []

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-10">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Candidatures marchands</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Examinez et traitez les demandes d&apos;accès à la plateforme.
        </p>
      </div>

      {/* Section : En attente */}
      <section aria-labelledby="pending-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="pending-heading" className="text-base font-semibold text-white">
            En attente
          </h2>
          {pendingList.length > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white">
              {pendingList.length}
            </span>
          )}
        </div>

        {pendingList.length === 0 ? (
          <p className="text-sm text-neutral-500 bg-neutral-900 border border-white/5 rounded-xl px-5 py-8 text-center">
            Aucune candidature en attente.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingList.map((app) => (
              <ApplicationCard
                key={app.id}
                id={app.id}
                applicant_name={app.applicant_name}
                applicant_email={app.applicant_email}
                company_name={app.company_name}
                message={app.message}
                created_at={app.created_at}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section : Traitées récemment */}
      {recentList.length > 0 && (
        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="text-base font-semibold text-white mb-4">
            Traitées récemment
          </h2>

          <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th
                    scope="col"
                    className="text-left text-xs font-medium text-neutral-500 px-5 py-3"
                  >
                    Candidat
                  </th>
                  <th
                    scope="col"
                    className="text-left text-xs font-medium text-neutral-500 px-5 py-3 hidden sm:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="text-left text-xs font-medium text-neutral-500 px-5 py-3"
                  >
                    Statut
                  </th>
                  <th
                    scope="col"
                    className="text-left text-xs font-medium text-neutral-500 px-5 py-3 hidden md:table-cell"
                  >
                    Traité le
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentList.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-white font-medium">
                      {app.applicant_name}
                      {app.company_name && (
                        <span className="block text-xs text-neutral-500 font-normal">
                          {app.company_name}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-neutral-400 hidden sm:table-cell">
                      {app.applicant_email}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-3 text-neutral-500 hidden md:table-cell">
                      {formatDate(app.reviewed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

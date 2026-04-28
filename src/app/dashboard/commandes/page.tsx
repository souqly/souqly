import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/format'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Commandes — Souqly',
  description: 'Historique de toutes vos commandes reçues.',
}

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const PAGE_SIZE = 20

type Period = 'today' | '7d' | '30d' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  today: "Aujourd'hui",
  '7d':  '7 jours',
  '30d': '30 jours',
  all:   'Tout',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CartSubmissionRow = {
  id: string
  total_cents: number
  created_at: string
  product_count: number | null
  channel: 'whatsapp' | 'telegram' | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formate une date ISO en français : "28 avr. 2026 à 14h32"
 */
function formatDateFr(iso: string): string {
  const date = new Date(iso)
  const datePart = new Intl.DateTimeFormat('fr-FR', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  }).format(date)

  const timePart = new Intl.DateTimeFormat('fr-FR', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
    .replace(':', 'h')

  return `${datePart} à ${timePart}`
}

function getPeriodStart(period: Period): string | null {
  const now = new Date()
  if (period === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return start.toISOString()
  }
  if (period === '7d') {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
  if (period === '30d') {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
  return null
}

function parsePeriod(raw: string | undefined): Period {
  if (raw === 'today' || raw === '7d' || raw === '30d' || raw === 'all') return raw
  return 'all'
}

function parsePage(raw: string | undefined): number {
  const n = parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

function channelLabel(channel: 'whatsapp' | 'telegram' | null): string {
  if (channel === 'whatsapp') return 'WhatsApp'
  if (channel === 'telegram') return 'Telegram'
  return '—'
}

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBag className="h-12 w-12 text-neutral-700 mb-4" />
      <p className="text-base font-medium text-neutral-400">Aucune commande pour l&apos;instant</p>
      <p className="text-sm text-neutral-600 mt-1">
        Partagez votre catalogue pour recevoir vos premières commandes.
      </p>
    </div>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4">
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-sm text-neutral-400 mt-0.5">{label}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{ period?: string; page?: string }>
}

export default async function CommandesPage({ searchParams }: PageProps) {
  const supabase = await createClient()

  // Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard/commandes')

  // Récupération du marchand
  const { data: merchant } = await supabase
    .from('merchants')
    .select('id, name')
    .eq('user_id', user.id)
    .single<{ id: string; name: string }>()

  if (!merchant) redirect('/login?redirect=/dashboard/commandes')

  // Parsing des searchParams
  const sp = await searchParams
  const period = parsePeriod(sp.period)
  const page   = parsePage(sp.page)
  const from   = (page - 1) * PAGE_SIZE
  const to     = from + PAGE_SIZE - 1

  const periodStart = getPeriodStart(period)

  // Requête principale — colonnes explicites, pas de select('*')
  let query = supabase
    .from('cart_submissions')
    .select('id, total_cents, created_at, product_count, channel', { count: 'exact' })
    .eq('merchant_id', merchant.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (periodStart) {
    query = query.gte('created_at', periodStart)
  }

  const { data: rawOrders, count: totalCount, error } = await query

  if (error) {
    console.error('[CommmandesPage] Erreur Supabase:', error.message)
  }

  const orders = (rawOrders ?? []) as CartSubmissionRow[]
  const total  = totalCount ?? 0

  // Stats pour la période sélectionnée (sans pagination)
  let statsQuery = supabase
    .from('cart_submissions')
    .select('total_cents')
    .eq('merchant_id', merchant.id)

  if (periodStart) {
    statsQuery = statsQuery.gte('created_at', periodStart)
  }

  const { data: statsRows } = await statsQuery.returns<{ total_cents: number }[]>()

  const statsData     = statsRows ?? []
  const caTotal       = statsData.reduce((s, r) => s + r.total_cents, 0)
  const panierMoyen   = statsData.length > 0 ? caTotal / statsData.length : 0

  // Pagination
  const totalPages = Math.ceil(total / PAGE_SIZE)

  function pageUrl(p: number) {
    const params = new URLSearchParams()
    if (period !== 'all') params.set('period', period)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/dashboard/commandes${qs ? `?${qs}` : ''}`
  }

  function periodUrl(p: Period) {
    const params = new URLSearchParams()
    if (p !== 'all') params.set('period', p)
    const qs = params.toString()
    return `/dashboard/commandes${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">

      {/* En-tête */}
      <header className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-white">Commandes</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 tabular-nums">
          {total}
        </span>
      </header>

      {/* Filtres rapides */}
      <nav className="flex flex-wrap gap-2" aria-label="Filtrer par période">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <Link
            key={p}
            href={periodUrl(p)}
            className={[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              period === p
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent',
            ].join(' ')}
          >
            {PERIOD_LABELS[p]}
          </Link>
        ))}
      </nav>

      {/* Cartes stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Statistiques">
        <StatCard label="Nombre de commandes" value={total} />
        <StatCard label="CA total"             value={formatPrice(caTotal)} />
        <StatCard label="Panier moyen"         value={formatPrice(panierMoyen)} />
      </section>

      {/* Tableau des commandes */}
      <section className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date / heure
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider hidden sm:table-cell">
                      Canal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5 text-neutral-300 whitespace-nowrap">
                        {formatDateFr(order.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-white tabular-nums whitespace-nowrap">
                        {formatPrice(order.total_cents)}
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        {order.channel ? (
                          <span
                            className={[
                              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                              order.channel === 'whatsapp'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
                            ].join(' ')}
                          >
                            {channelLabel(order.channel)}
                          </span>
                        ) : (
                          <span className="text-neutral-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 flex-wrap gap-3">
                <p className="text-xs text-neutral-500">
                  {from + 1}–{Math.min(to + 1, total)} sur {total} commandes
                </p>
                <div className="flex items-center gap-2">
                  {page > 1 ? (
                    <Link
                      href={pageUrl(page - 1)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
                    >
                      Précédent
                    </Link>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-700 border border-white/5 cursor-not-allowed">
                      Précédent
                    </span>
                  )}
                  <span className="text-xs text-neutral-500 tabular-nums">
                    {page} / {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link
                      href={pageUrl(page + 1)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
                    >
                      Suivant
                    </Link>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-700 border border-white/5 cursor-not-allowed">
                      Suivant
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

    </div>
  )
}

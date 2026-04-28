import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Users,
  Package,
  Eye,
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Vue d\'ensemble',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MerchantSummary = {
  id: string
  name: string
  slug: string
  status: string
  subscription_status: string
  created_at: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateFr(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; classes: string }> = {
    active: { label: 'Actif', classes: 'bg-green-500/10 text-green-400' },
    pending: { label: 'En attente', classes: 'bg-amber-500/10 text-amber-400' },
    suspended: { label: 'Suspendu', classes: 'bg-red-500/10 text-red-400' },
    rejected: { label: 'Refusé', classes: 'bg-neutral-700 text-neutral-400' },
    trial: { label: 'Essai', classes: 'bg-indigo-500/10 text-indigo-400' },
    past_due: { label: 'Impayé', classes: 'bg-amber-500/10 text-amber-400' },
    canceled: { label: 'Annulé', classes: 'bg-red-500/10 text-red-400' },
  }
  const entry = map[status] ?? { label: status, classes: 'bg-neutral-700 text-neutral-400' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${entry.classes}`}>
      {entry.label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page — Server Component pur
// ---------------------------------------------------------------------------

export default async function AdminOverviewPage() {
  const admin = createAdminClient()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: merchants },
    { count: pendingApplicationsCount },
    { count: productsCount },
    { count: visitsCount },
    { data: cartData },
    { data: recentMerchants },
  ] = await Promise.all([
    admin
      .from('merchants')
      .select('id, status')
      .returns<{ id: string; status: string }[]>(),

    admin
      .from('merchant_applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),

    admin
      .from('products')
      .select('id', { count: 'exact', head: true }),

    admin
      .from('catalog_visits')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo),

    admin
      .from('cart_submissions')
      .select('id, total_cents')
      .gte('created_at', thirtyDaysAgo)
      .returns<{ id: string; total_cents: number }[]>(),

    admin
      .from('merchants')
      .select('id, name, slug, status, subscription_status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
      .returns<MerchantSummary[]>(),
  ])

  // Calculs
  const merchantList = merchants ?? []
  const activeCount = merchantList.filter((m) => m.status === 'active').length
  const pendingCount = merchantList.filter((m) => m.status === 'pending').length
  const suspendedCount = merchantList.filter((m) => m.status === 'suspended').length
  const totalMerchants = merchantList.length

  const cartList = cartData ?? []
  const cartCount = cartList.length
  const revenueEstimateCents = cartList.reduce((sum, c) => sum + (c.total_cents ?? 0), 0)

  const dateAujourdhui = formatDateFr(new Date().toISOString())

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto space-y-10">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Vue d&apos;ensemble — Souqly</h1>
          <p className="mt-1 text-sm text-neutral-400 capitalize">{dateAujourdhui}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">Indicateurs clés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Marchands actifs */}
          <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Marchands actifs</p>
              <p className="mt-1 text-2xl font-bold text-green-400">{activeCount}</p>
              <p className="text-xs text-neutral-600 mt-0.5">{totalMerchants} au total</p>
            </div>
          </div>

          {/* Candidatures en attente */}
          <Link
            href="/admin/candidatures"
            className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-5 flex items-start gap-4 hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-colors group"
            aria-label={`${pendingApplicationsCount ?? 0} candidatures en attente — Voir les candidatures`}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Candidatures en attente</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{pendingApplicationsCount ?? 0}</p>
              <p className="text-xs text-neutral-600 mt-0.5 group-hover:text-amber-600 transition-colors">
                {pendingCount > 0 ? `${pendingCount} marchands en attente` : 'Aucune en attente'}
              </p>
            </div>
          </Link>

          {/* Marchands suspendus */}
          <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Marchands suspendus</p>
              <p className="mt-1 text-2xl font-bold text-red-400">{suspendedCount}</p>
              <p className="text-xs text-neutral-600 mt-0.5">Accès bloqué</p>
            </div>
          </div>

          {/* Produits catalogués */}
          <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Produits catalogués</p>
              <p className="mt-1 text-2xl font-bold text-indigo-400">{productsCount ?? 0}</p>
              <p className="text-xs text-neutral-600 mt-0.5">Toute la plateforme</p>
            </div>
          </div>

          {/* Visites 30j */}
          <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-sky-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Visites catalogue 30j</p>
              <p className="mt-1 text-2xl font-bold text-sky-400">{visitsCount ?? 0}</p>
              <p className="text-xs text-neutral-600 mt-0.5">Déverrouillages uniques</p>
            </div>
          </div>

          {/* CA estimé 30j */}
          <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">CA estimé 30j</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">
                {formatCurrency(revenueEstimateCents)}
              </p>
              <p className="text-xs text-neutral-600 mt-0.5">
                <ShoppingBag className="inline h-3 w-3 mr-0.5" aria-hidden="true" />
                {cartCount} panier{cartCount !== 1 ? 's' : ''} généré{cartCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Derniers marchands inscrits */}
      <section aria-labelledby="recent-merchants-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recent-merchants-heading" className="text-base font-semibold text-white">
            Derniers marchands inscrits
          </h2>
          <Link
            href="/admin/marchands"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Voir tous →
          </Link>
        </div>

        {!recentMerchants || recentMerchants.length === 0 ? (
          <p className="text-sm text-neutral-500 bg-neutral-900 border border-white/5 rounded-xl px-5 py-8 text-center">
            Aucun marchand enregistré.
          </p>
        ) : (
          <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th scope="col" className="text-left text-xs font-medium text-neutral-500 px-5 py-3">
                    Nom
                  </th>
                  <th scope="col" className="text-left text-xs font-medium text-neutral-500 px-5 py-3 hidden sm:table-cell">
                    Slug
                  </th>
                  <th scope="col" className="text-left text-xs font-medium text-neutral-500 px-5 py-3">
                    Abonnement
                  </th>
                  <th scope="col" className="text-left text-xs font-medium text-neutral-500 px-5 py-3 hidden md:table-cell">
                    Inscrit le
                  </th>
                  <th scope="col" className="text-right text-xs font-medium text-neutral-500 px-5 py-3">
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentMerchants.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-medium text-white">{m.name}</span>
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-5 py-3 text-neutral-400 hidden sm:table-cell font-mono text-xs">
                      /{m.slug}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={m.subscription_status} />
                    </td>
                    <td className="px-5 py-3 text-neutral-500 hidden md:table-cell">
                      {formatDateFr(m.created_at)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/marchands/${m.id}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
                      >
                        Voir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Accès rapides */}
      <section aria-labelledby="quick-access-heading">
        <h2 id="quick-access-heading" className="text-base font-semibold text-white mb-4">
          Accès rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/candidatures"
            className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4 flex items-center gap-3 hover:border-indigo-500/20 hover:bg-indigo-500/[0.03] transition-colors group"
          >
            <Clock className="h-5 w-5 text-neutral-500 group-hover:text-indigo-400 transition-colors" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-white">Candidatures</p>
              <p className="text-xs text-neutral-500">Valider ou refuser les demandes</p>
            </div>
          </Link>
          <Link
            href="/admin/marchands"
            className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4 flex items-center gap-3 hover:border-indigo-500/20 hover:bg-indigo-500/[0.03] transition-colors group"
          >
            <Users className="h-5 w-5 text-neutral-500 group-hover:text-indigo-400 transition-colors" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-white">Marchands</p>
              <p className="text-xs text-neutral-500">Gérer les comptes et accès</p>
            </div>
          </Link>
        </div>
      </section>

    </div>
  )
}

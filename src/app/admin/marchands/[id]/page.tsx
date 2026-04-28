import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Package, Tag, Eye, TrendingUp, ArrowLeft, ExternalLink } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { suspendMerchant, reactivateMerchant } from '@/lib/actions/admin'

// ---------------------------------------------------------------------------
// Metadata dynamique
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('merchants')
    .select('name')
    .eq('id', params.id)
    .single<{ name: string }>()

  return {
    title: data?.name ? `${data.name} — Détail marchand` : 'Détail marchand',
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MerchantDetail = {
  id: string
  name: string
  slug: string
  status: string
  subscription_status: string
  stripe_customer_id: string | null
  whatsapp_number: string | null
  telegram_username: string | null
  logo_url: string | null
  trial_ends_at: string | null
  created_at: string
}

type CartSubmissionRow = {
  id: string
  total_cents: number
  created_at: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateFr(iso: string | null, withTime = false): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
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

function MerchantStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; classes: string }> = {
    active: { label: 'Actif', classes: 'bg-green-500/10 text-green-400 border border-green-500/20' },
    pending: { label: 'En attente', classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    suspended: { label: 'Suspendu', classes: 'bg-red-500/10 text-red-400 border border-red-500/20' },
    rejected: { label: 'Refusé', classes: 'bg-neutral-700 text-neutral-400 border border-white/10' },
  }
  const entry = map[status] ?? { label: status, classes: 'bg-neutral-700 text-neutral-400 border border-white/10' }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${entry.classes}`}>
      {entry.label}
    </span>
  )
}

function SubscriptionBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; classes: string }> = {
    trial: { label: 'Essai', classes: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
    active: { label: 'Abonnement actif', classes: 'bg-green-500/10 text-green-400 border border-green-500/20' },
    past_due: { label: 'Impayé', classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    canceled: { label: 'Annulé', classes: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  }
  const entry = map[status] ?? { label: status, classes: 'bg-neutral-700 text-neutral-400 border border-white/10' }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${entry.classes}`}>
      {entry.label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page — Server Component pur
// ---------------------------------------------------------------------------

export default async function MerchantDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const admin = createAdminClient()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Données principales
  const { data: merchant } = await admin
    .from('merchants')
    .select(
      'id, name, slug, status, subscription_status, stripe_customer_id, whatsapp_number, telegram_username, logo_url, trial_ends_at, created_at',
    )
    .eq('id', params.id)
    .single<MerchantDetail>()

  if (!merchant) {
    notFound()
  }

  // Requêtes parallèles dépendantes du marchand
  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: visitsCount },
    { data: cartAggData },
    { data: recentCarts },
  ] = await Promise.all([
    admin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id),

    admin
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id),

    admin
      .from('catalog_visits')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id)
      .gte('created_at', thirtyDaysAgo),

    admin
      .from('cart_submissions')
      .select('id, total_cents')
      .eq('merchant_id', merchant.id)
      .gte('created_at', thirtyDaysAgo)
      .returns<CartSubmissionRow[]>(),

    admin
      .from('cart_submissions')
      .select('id, total_cents, created_at')
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .returns<CartSubmissionRow[]>(),
  ])

  const cartList = cartAggData ?? []
  const cartCount30d = cartList.length
  const revenue30dCents = cartList.reduce((sum, c) => sum + (c.total_cents ?? 0), 0)
  const recentCartList = recentCarts ?? []

  const isActive = merchant.status === 'active'
  const isSuspended = merchant.status === 'suspended'

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-8">

      {/* Bouton retour */}
      <div>
        <Link
          href="/admin/marchands"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour aux marchands
        </Link>
      </div>

      {/* Header marchand */}
      <div className="bg-neutral-900 border border-white/5 rounded-xl px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">

          {/* Avatar / Logo */}
          <div className="flex-shrink-0">
            {merchant.logo_url ? (
              <Image
                src={merchant.logo_url}
                alt={`Logo ${merchant.name}`}
                width={72}
                height={72}
                className="rounded-xl object-cover border border-white/10"
              />
            ) : (
              <div
                className="w-[72px] h-[72px] rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-2xl font-bold text-neutral-500 select-none"
                aria-hidden="true"
              >
                {merchant.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Infos principales */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-white tracking-tight truncate">
                {merchant.name}
              </h1>
              <MerchantStatusBadge status={merchant.status} />
              <SubscriptionBadge status={merchant.subscription_status} />
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-400 mb-4">
              <span>
                <span className="text-neutral-600">Slug : </span>
                <span className="font-mono text-xs text-neutral-300">/{merchant.slug}</span>
              </span>
              {merchant.whatsapp_number && (
                <span>
                  <span className="text-neutral-600">WhatsApp : </span>
                  {merchant.whatsapp_number}
                </span>
              )}
              {merchant.telegram_username && (
                <span>
                  <span className="text-neutral-600">Telegram : </span>
                  @{merchant.telegram_username}
                </span>
              )}
              <span>
                <span className="text-neutral-600">Inscrit le : </span>
                {formatDateFr(merchant.created_at)}
              </span>
              {merchant.trial_ends_at && (
                <span>
                  <span className="text-neutral-600">Essai jusqu&apos;au : </span>
                  {formatDateFr(merchant.trial_ends_at)}
                </span>
              )}
            </div>

            {/* Lien catalogue externe */}
            <a
              href={`/${merchant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Voir le catalogue
            </a>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <section aria-labelledby="merchant-kpi-heading">
        <h2 id="merchant-kpi-heading" className="sr-only">Indicateurs du marchand</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4 flex items-start gap-3">
            <Package className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Produits</p>
              <p className="mt-1 text-xl font-bold text-white">{productsCount ?? 0}</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4 flex items-start gap-3">
            <Tag className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Catégories</p>
              <p className="mt-1 text-xl font-bold text-white">{categoriesCount ?? 0}</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4 flex items-start gap-3">
            <Eye className="h-5 w-5 text-sky-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Visites 30j</p>
              <p className="mt-1 text-xl font-bold text-white">{visitsCount ?? 0}</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-white/5 rounded-xl px-5 py-4 flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">CA estimé 30j</p>
              <p className="mt-1 text-xl font-bold text-white">{formatCurrency(revenue30dCents)}</p>
              <p className="text-xs text-neutral-600">{cartCount30d} panier{cartCount30d !== 1 ? 's' : ''}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Actions admin */}
      {(isActive || isSuspended) && (
        <section aria-labelledby="admin-actions-heading">
          <h2 id="admin-actions-heading" className="text-base font-semibold text-white mb-4">
            Actions admin
          </h2>
          <div className="bg-neutral-900 border border-white/5 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-neutral-400">
              {isActive
                ? 'Suspendre ce marchand bloquera immédiatement l\'accès à son catalogue et à son dashboard.'
                : 'Réactiver ce marchand lui restituera l\'accès au dashboard et à son catalogue.'}
            </p>
            {isActive && (
              <form action={async (fd) => { await suspendMerchant(fd) }}>
                <input type="hidden" name="merchant_id" value={merchant.id} />
                <button
                  type="submit"
                  className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                >
                  Suspendre ce marchand
                </button>
              </form>
            )}
            {isSuspended && (
              <form action={async (fd) => { await reactivateMerchant(fd) }}>
                <input type="hidden" name="merchant_id" value={merchant.id} />
                <button
                  type="submit"
                  className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:text-green-300 transition-colors"
                >
                  Réactiver ce marchand
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Dernières commandes — timeline */}
      <section aria-labelledby="recent-orders-heading">
        <h2 id="recent-orders-heading" className="text-base font-semibold text-white mb-4">
          5 dernières commandes (paniers soumis)
        </h2>

        {recentCartList.length === 0 ? (
          <p className="text-sm text-neutral-500 bg-neutral-900 border border-white/5 rounded-xl px-5 py-8 text-center">
            Aucun panier soumis pour le moment.
          </p>
        ) : (
          <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
            <ol className="divide-y divide-white/5">
              {recentCartList.map((cart, index) => (
                <li key={cart.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Numéro de position */}
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium text-neutral-500"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 font-mono truncate">
                        #{cart.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        {formatDateFr(cart.created_at, true)}
                      </p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-sm font-semibold text-emerald-400">
                    {formatCurrency(cart.total_cents ?? 0)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

    </div>
  )
}

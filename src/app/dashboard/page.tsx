import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Package, Tag, Eye, ShoppingBag, AlertTriangle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard — Souqly',
  description: 'Vue d\'ensemble de votre boutique Souqly.',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MerchantRow = {
  id: string
  name: string
  slug: string
  subscription_status: string
  created_at: string
}

type StatCardProps = {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | string

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

function StatCard({ label, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="bg-neutral-900 border border-white/5 rounded-xl p-5 flex items-start gap-4">
      <div className="h-10 w-10 rounded-lg bg-indigo-600/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-indigo-400" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        <p className="text-sm font-medium text-neutral-300 mt-0.5">{label}</p>
        {description && (
          <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
}

function SubscriptionBadge({ status }: { status: SubscriptionStatus }) {
  const config: Record<string, { label: string; className: string }> = {
    trial: {
      label: 'Essai gratuit',
      className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    },
    active: {
      label: 'Actif',
      className: 'bg-green-500/10 text-green-400 border border-green-500/20',
    },
    past_due: {
      label: 'Paiement en retard',
      className: 'bg-red-500/10 text-red-400 border border-red-500/20',
    },
    canceled: {
      label: 'Annulé',
      className: 'bg-red-500/10 text-red-400 border border-red-500/20',
    },
  }

  const cfg = config[status] ?? {
    label: status,
    className: 'bg-neutral-800 text-neutral-400 border border-white/5',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard')

  const { data: merchant } = await supabase
    .from('merchants')
    .select('id, name, slug, subscription_status, created_at')
    .eq('user_id', user.id)
    .single<MerchantRow>()

  if (!merchant) redirect('/login?redirect=/dashboard')

  // eslint-disable-next-line react-hooks/purity -- Server Component: query window is computed per request.
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Requêtes en parallèle
  const [
    { count: productCount },
    { count: categoryCount },
    { count: visitCount },
    { count: orderCount },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id),
    supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id),
    supabase
      .from('catalog_visits')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id)
      .gte('created_at', thirtyDaysAgo),
    supabase
      .from('cart_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id)
      .gte('created_at', thirtyDaysAgo),
  ])

  const isSuspended =
    merchant.subscription_status === 'past_due' ||
    merchant.subscription_status === 'canceled'

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bonjour,{' '}
            <span className="text-indigo-400">{merchant.name}</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Voici un aperçu de votre boutique.
          </p>
        </div>
        <SubscriptionBadge status={merchant.subscription_status} />
      </div>

      {/* Bannière abonnement suspendu */}
      {isSuspended && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-300">
              Votre abonnement est suspendu.
            </p>
            <p className="text-sm text-red-400/70 mt-0.5">
              Votre catalogue n&apos;est plus accessible aux visiteurs.
            </p>
          </div>
          <Link
            href="/dashboard/abonnement"
            className="flex items-center gap-1 text-sm font-medium text-red-300 hover:text-red-200 transition-colors flex-shrink-0"
          >
            Gérer mon abonnement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Produits"
          value={productCount ?? 0}
          icon={Package}
        />
        <StatCard
          label="Catégories"
          value={categoryCount ?? 0}
          icon={Tag}
        />
        <StatCard
          label="Visites"
          value={visitCount ?? 0}
          icon={Eye}
          description="30 derniers jours"
        />
        <StatCard
          label="Commandes"
          value={orderCount ?? 0}
          icon={ShoppingBag}
          description="30 derniers jours"
        />
      </div>

      {/* Raccourcis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/produits"
          className="group bg-neutral-900 border border-white/5 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-neutral-900/80 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Gérer les produits</p>
              <p className="text-sm text-neutral-500 mt-1">
                Ajouter, modifier ou supprimer des produits.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-neutral-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link
          href="/dashboard/parametres"
          className="group bg-neutral-900 border border-white/5 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-neutral-900/80 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Paramètres boutique</p>
              <p className="text-sm text-neutral-500 mt-1">
                Code d&apos;accès, contacts, template de commande.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-neutral-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package, Tag, Eye, ShoppingBag, AlertTriangle,
  ArrowRight, Settings, CreditCard, CheckCircle2,
  Circle, Clock, TrendingUp, ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/format'
import CopyButton from './_components/CopyButton'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://souqly.fr'

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${Math.floor(hours / 24)}j`
}

function daysUntil(dateStr: string): number {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000))
}

export const metadata: Metadata = {
  title: 'Dashboard — Souqly',
  description: "Vue d'ensemble de votre boutique Souqly.",
}

type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled'

type MerchantRow = {
  id: string
  name: string
  slug: string
  subscription_status: SubscriptionStatus
  trial_ends_at: string | null
  whatsapp_number: string | null
  telegram_username: string | null
  logo_url: string | null
  created_at: string
}

type CartSubmissionRow = {
  id: string
  total_cents: number
  created_at: string
}

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

function MerchantAvatar({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={`Logo ${name}`}
        width={56}
        height={56}
        className="h-14 w-14 rounded-xl object-cover border border-white/10"
      />
    )
  }
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
  return (
    <div className="h-14 w-14 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
      <span className="text-lg font-bold text-indigo-400">{initials}</span>
    </div>
  )
}

function SubscriptionBadge({ status }: { status: SubscriptionStatus }) {
  const config: Record<SubscriptionStatus, { label: string; className: string }> = {
    trial:    { label: 'Essai gratuit',       className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    active:   { label: 'Actif',               className: 'bg-green-500/10 text-green-400 border border-green-500/20' },
    past_due: { label: 'Paiement en retard',  className: 'bg-red-500/10 text-red-400 border border-red-500/20' },
    canceled: { label: 'Annulé',              className: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  }
  const cfg = config[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

type StatCardProps = {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  description?: string
  iconColor?: string
  bgColor?: string
}

function StatCard({
  label, value, icon: Icon, description,
  iconColor = 'text-indigo-400', bgColor = 'bg-indigo-600/10',
}: StatCardProps) {
  return (
    <div className="bg-neutral-900 border border-white/5 rounded-xl p-5 flex items-start gap-4">
      <div className={`h-10 w-10 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-white tabular-nums truncate">{value}</p>
        <p className="text-sm font-medium text-neutral-300 mt-0.5">{label}</p>
        {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

function OnboardingChecklist({ items }: { items: Array<{ label: string; done: boolean }> }) {
  if (items.every((i) => i.done)) return null
  return (
    <section className="bg-neutral-900 border border-white/5 rounded-xl p-5 space-y-3">
      <h2 className="text-sm font-semibold text-white">Démarrage rapide</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            {item.done
              ? <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
              : <Circle className="h-4 w-4 text-neutral-600 flex-shrink-0" />}
            <span className={`text-sm ${item.done ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RecentOrders({ orders }: { orders: CartSubmissionRow[] }) {
  if (orders.length === 0) {
    return (
      <section className="bg-neutral-900 border border-white/5 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Activité récente</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ShoppingBag className="h-8 w-8 text-neutral-700 mb-3" />
          <p className="text-sm text-neutral-500">Aucune commande pour l&apos;instant.</p>
          <p className="text-xs text-neutral-600 mt-1">Partagez votre lien catalogue pour recevoir vos premières commandes.</p>
        </div>
      </section>
    )
  }
  return (
    <section className="bg-neutral-900 border border-white/5 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-white mb-4">Activité récente</h2>
      <ol className="relative border-l border-white/5 space-y-5 ml-2">
        {orders.map((order) => (
          <li key={order.id} className="pl-5 relative">
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 border-2 border-neutral-900" />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-neutral-400">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-xs">{formatRelativeTime(order.created_at)}</span>
              </div>
              <span className="text-sm font-semibold text-white tabular-nums">{formatPrice(order.total_cents)}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Page principale — Server Component
// ---------------------------------------------------------------------------

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard')

  const { data: merchant } = await supabase
    .from('merchants')
    .select('id, name, slug, subscription_status, trial_ends_at, whatsapp_number, telegram_username, logo_url, created_at')
    .eq('user_id', user.id)
    .single<MerchantRow>()

  if (!merchant) redirect('/login?redirect=/dashboard')

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    activeProductsRes, totalProductsRes, categoriesRes,
    visitsRes, ordersCountRes, recentOrdersRes, caRes,
  ] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('merchant_id', merchant.id).eq('is_available', true),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('merchant_id', merchant.id),
    supabase.from('categories').select('id', { count: 'exact', head: true }).eq('merchant_id', merchant.id),
    supabase.from('catalog_visits').select('id', { count: 'exact', head: true }).eq('merchant_id', merchant.id).gte('created_at', thirtyDaysAgo),
    supabase.from('cart_submissions').select('id', { count: 'exact', head: true }).eq('merchant_id', merchant.id).gte('created_at', thirtyDaysAgo),
    supabase.from('cart_submissions').select('id, total_cents, created_at').eq('merchant_id', merchant.id).order('created_at', { ascending: false }).limit(3).returns<CartSubmissionRow[]>(),
    supabase.from('cart_submissions').select('total_cents').eq('merchant_id', merchant.id).gte('created_at', thirtyDaysAgo).returns<{ total_cents: number }[]>(),
  ])

  const activeProductCount = activeProductsRes.count ?? 0
  const totalProductCount  = totalProductsRes.count  ?? 0
  const categoryCount      = categoriesRes.count     ?? 0
  const visitCount         = visitsRes.count         ?? 0
  const orderCount         = ordersCountRes.count    ?? 0
  const recentOrders       = recentOrdersRes.data    ?? []
  const caTotal            = (caRes.data ?? []).reduce((s, r) => s + r.total_cents, 0)

  const status            = merchant.subscription_status
  const isSuspended       = status === 'past_due' || status === 'canceled'
  const trialDaysLeft     = status === 'trial' && merchant.trial_ends_at ? daysUntil(merchant.trial_ends_at) : null
  const trialExpiringSoon = trialDaysLeft !== null && trialDaysLeft < 7
  const noContact         = status === 'active' && !merchant.whatsapp_number && !merchant.telegram_username
  const hasContact        = !!(merchant.whatsapp_number || merchant.telegram_username)

  const checklistItems = [
    { label: 'Compte créé',                           done: true },
    { label: 'Ajouter un produit',                    done: totalProductCount > 0 },
    { label: 'Configurer WhatsApp ou Telegram',       done: hasContact },
    { label: 'Partager votre lien catalogue',         done: false },
    { label: "Activer l'abonnement",                  done: status !== 'trial' },
  ]

  const catalogueUrl = `${SITE_URL}/${merchant.slug}`

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">

      {/* En-tête */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <MerchantAvatar name={merchant.name} logoUrl={merchant.logo_url} />
          <div>
            <h1 className="text-2xl font-bold text-white">{merchant.name}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <a
                href={`/${merchant.slug}/catalogue`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Voir mon catalogue <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <span className="text-neutral-700">·</span>
              <SubscriptionBadge status={status} />
              {trialDaysLeft !== null && (
                <span className="text-xs text-amber-400">
                  {trialDaysLeft} jour{trialDaysLeft !== 1 ? 's' : ''} restant{trialDaysLeft !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Alertes contextuelles */}
      {isSuspended && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-300">Catalogue hors ligne — réactivez votre abonnement</p>
            <p className="text-sm text-red-400/70 mt-0.5">Votre catalogue n&apos;est plus accessible aux visiteurs.</p>
          </div>
          <Link href="/dashboard/abonnement" className="inline-flex items-center gap-1 text-sm font-medium text-red-300 hover:text-red-200 transition-colors flex-shrink-0">
            Gérer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
      {!isSuspended && trialExpiringSoon && trialDaysLeft !== null && (
        <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-orange-300">
              Votre essai expire dans {trialDaysLeft} jour{trialDaysLeft !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-orange-400/70 mt-0.5">Activez votre abonnement pour continuer à recevoir des commandes.</p>
          </div>
          <Link href="/dashboard/abonnement" className="inline-flex items-center gap-1 text-sm font-medium text-orange-300 hover:text-orange-200 transition-colors flex-shrink-0">
            Activer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
      {noContact && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-yellow-300">Configurez un moyen de contact pour recevoir des commandes</p>
            <p className="text-sm text-yellow-400/70 mt-0.5">Ajoutez votre numéro WhatsApp ou identifiant Telegram dans les paramètres.</p>
          </div>
          <Link href="/dashboard/parametres" className="inline-flex items-center gap-1 text-sm font-medium text-yellow-300 hover:text-yellow-200 transition-colors flex-shrink-0">
            Configurer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* KPIs */}
      <section>
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-3">Statistiques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Produits actifs"  value={activeProductCount}   icon={Package}     description={`sur ${totalProductCount} au total`}  iconColor="text-indigo-400"  bgColor="bg-indigo-600/10" />
          <StatCard label="Catégories"       value={categoryCount}        icon={Tag}         iconColor="text-violet-400"  bgColor="bg-violet-600/10" />
          <StatCard label="Visites"          value={visitCount}           icon={Eye}         description="30 derniers jours" iconColor="text-sky-400"     bgColor="bg-sky-600/10" />
          <StatCard label="Paniers générés"  value={orderCount}           icon={ShoppingBag} description="30 derniers jours" iconColor="text-amber-400"   bgColor="bg-amber-600/10" />
          <StatCard label="CA estimé"        value={formatPrice(caTotal)} icon={TrendingUp}  description="30 derniers jours" iconColor="text-emerald-400" bgColor="bg-emerald-600/10" />
        </div>
      </section>

      {/* Activité + Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrders} />
        <OnboardingChecklist items={checklistItems} />
      </div>

      {/* Raccourcis rapides */}
      <section>
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-3">Raccourcis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Ajouter un produit',   desc: 'Créer et gérer vos articles.',    href: '/dashboard/produits',   Icon: Package,    ic: 'text-indigo-400',  bg: 'bg-indigo-600/10' },
            { label: 'Gérer les catégories', desc: 'Organiser votre catalogue.',      href: '/dashboard/categories', Icon: Tag,        ic: 'text-violet-400',  bg: 'bg-violet-600/10' },
            { label: 'Paramètres boutique',  desc: 'Code accès, contacts, template.', href: '/dashboard/parametres', Icon: Settings,   ic: 'text-slate-400',   bg: 'bg-slate-600/10' },
            { label: 'Mon abonnement',       desc: 'Facturation et plan actif.',      href: '/dashboard/abonnement', Icon: CreditCard, ic: 'text-emerald-400', bg: 'bg-emerald-600/10' },
          ].map(({ label, desc, href, Icon, ic, bg }) => (
            <Link
              key={href}
              href={href}
              className="group bg-neutral-900 border border-white/5 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-neutral-900/80 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-4 w-4 ${ic}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all mt-1" />
              </div>
              <p className="text-sm font-semibold text-white mt-3">{label}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Lien catalogue */}
      <section className="bg-neutral-900 border border-white/5 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-1">Votre lien catalogue</h2>
        <p className="text-xs text-neutral-500 mb-3">Partagez ce lien pour que vos clients accèdent à votre boutique.</p>
        <div className="flex items-center gap-3 flex-wrap">
          <code className="flex-1 min-w-0 text-sm text-indigo-400 bg-neutral-800 border border-white/5 rounded-lg px-3 py-2 truncate font-mono">
            {catalogueUrl}
          </code>
          <CopyButton text={catalogueUrl} />
        </div>
      </section>

    </div>
  )
}

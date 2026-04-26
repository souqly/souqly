import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BillingActions } from './_components/BillingActions'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Abonnement — Souqly',
  description: 'Gérez votre abonnement Souqly.',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled'

type MerchantBillingRow = {
  name: string
  subscription_status: SubscriptionStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  trial_ends_at: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; badgeClass: string }
> = {
  trial: {
    label: 'Essai gratuit',
    badgeClass:
      'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
  active: {
    label: 'Actif',
    badgeClass:
      'bg-green-500/10 text-green-400 border border-green-500/20',
  },
  past_due: {
    label: 'Paiement en retard',
    badgeClass:
      'bg-red-500/10 text-red-400 border border-red-500/20',
  },
  canceled: {
    label: 'Annulé',
    badgeClass:
      'bg-neutral-700/50 text-neutral-400 border border-white/5',
  },
}

function trialDaysLeft(trialEndsAt: string | null): number | null {
  if (!trialEndsAt) return null
  return Math.max(
    0,
    Math.ceil(
      (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  )
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const supabase = await createClient()
  const params = await searchParams

  // 1. Authentification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard/abonnement')
  }

  // 2. Récupérer les données de facturation du marchand
  const { data: merchant } = await supabase
    .from('merchants')
    .select(
      'name, subscription_status, stripe_customer_id, stripe_subscription_id, trial_ends_at'
    )
    .eq('user_id', user.id)
    .single<MerchantBillingRow>()

  if (!merchant) {
    redirect('/dashboard')
  }

  const status = merchant.subscription_status
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    badgeClass: 'bg-neutral-800 text-neutral-400 border border-white/5',
  }
  const daysLeft = trialDaysLeft(merchant.trial_ends_at)

  // Un abonnement "actif" au sens du portail = customer Stripe existant
  const hasActiveSubscription = !!merchant.stripe_customer_id

  // searchParams
  const checkoutSuccess = params.checkout === 'success'
  const errorCode =
    typeof params.error === 'string' ? params.error : undefined

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-white">Abonnement</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Gérez votre plan et votre moyen de paiement.
        </p>
      </div>

      {/* Bannière succès checkout */}
      {checkoutSuccess && (
        <div className="flex items-start gap-3 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3">
          <CheckCircle2
            className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm text-green-300">
            Votre abonnement a bien été activé. Merci !
          </p>
        </div>
      )}

      {/* Bannière erreur */}
      {errorCode && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <XCircle
            className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm text-red-300">
            {errorCode === 'no_subscription'
              ? "Aucun abonnement actif trouvé. Commencez par vous abonner."
              : errorCode === 'merchant_not_found'
              ? 'Compte marchand introuvable.'
              : `Une erreur est survenue (${errorCode}). Veuillez réessayer.`}
          </p>
        </div>
      )}

      {/* Avertissement past_due */}
      {status === 'past_due' && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <AlertTriangle
            className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-red-300">
              Votre paiement a échoué.
            </p>
            <p className="text-sm text-red-400/80 mt-0.5">
              Mettez à jour votre moyen de paiement pour rétablir l&apos;accès
              à votre catalogue.
            </p>
          </div>
        </div>
      )}

      {/* Info abonnement annulé */}
      {status === 'canceled' && (
        <div className="flex items-start gap-3 rounded-xl bg-neutral-800 border border-white/5 px-4 py-3">
          <XCircle
            className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm text-neutral-400">
            Votre abonnement est terminé. Votre catalogue n&apos;est plus
            accessible aux visiteurs.
          </p>
        </div>
      )}

      {/* Carte statut */}
      <div className="bg-neutral-900 border border-white/5 rounded-xl p-6 space-y-5">
        {/* Ligne statut */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Statut de l&apos;abonnement
            </p>
            <p className="text-lg font-semibold text-white mt-1">
              {merchant.name}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cfg.badgeClass}`}
          >
            {cfg.label}
          </span>
        </div>

        <hr className="border-white/5" />

        {/* Détails du plan */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Plan</span>
            <span className="text-white font-medium">Souqly Pro</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Tarif</span>
            <span className="text-white font-medium">29 €/mois</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Facturation</span>
            <span className="text-white font-medium">Mensuelle</span>
          </div>

          {/* Jours d'essai restants */}
          {status === 'trial' && daysLeft !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Essai gratuit</span>
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {daysLeft === 0
                  ? "Se termine aujourd'hui"
                  : `${daysLeft} jour${daysLeft > 1 ? 's' : ''} restant${daysLeft > 1 ? 's' : ''}`}
              </span>
            </div>
          )}
        </div>

        <hr className="border-white/5" />

        {/* Bouton d'action */}
        <BillingActions hasActiveSubscription={hasActiveSubscription} />
      </div>

      {/* Note portail */}
      {hasActiveSubscription && (
        <p className="text-xs text-neutral-500 text-center">
          Le portail Stripe vous permet de modifier votre carte bancaire,
          télécharger vos factures ou annuler votre abonnement.
        </p>
      )}
    </div>
  )
}

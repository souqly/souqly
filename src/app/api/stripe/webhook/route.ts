/**
 * POST /api/stripe/webhook
 *
 * Handler des webhooks Stripe. Lit le corps brut (text) AVANT toute
 * désérialisation JSON afin que la vérification de signature puisse
 * comparer le payload non modifié.
 *
 * Variables d'environnement requises :
 *   STRIPE_WEBHOOK_SECRET — whsec_... (depuis `stripe listen` en dev
 *                           ou depuis le Dashboard Stripe en prod)
 *
 * Événements gérés :
 *   customer.subscription.created  → active l'abonnement en DB
 *   customer.subscription.updated  → synchronise le statut
 *   customer.subscription.deleted  → passe à 'canceled'
 *   invoice.payment_succeeded      → repasse à 'active' si past_due
 *   invoice.payment_failed         → passe à 'past_due'
 *
 * Test local :
 *   stripe listen --forward-to localhost:3000/api/stripe/webhook
 *   stripe trigger customer.subscription.updated
 */

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getSiteUrl, getStripeWebhookSecret } from '@/lib/env'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  sendSubscriptionPastDueEmail,
  sendSubscriptionCanceledEmail,
} from '@/lib/emails/send'

// Désactiver le bodyParser de Next.js pour lire le body brut
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // 1. Lire le body brut (obligatoire pour la vérification de signature)
  const body = await req.text()

  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let webhookSecret: string
  try {
    webhookSecret = getStripeWebhookSecret()
  } catch {
    // Erreur de configuration serveur — ne pas exposer les détails
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // 2. Vérifier la signature — point de sécurité critique
  let event: Stripe.Event
  const stripe = getStripe()

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Stripe.errors.StripeSignatureVerificationError
      ? 'Invalid signature'
      : 'Webhook verification failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // 3. Client Supabase admin (service_role) — nécessaire pour bypasser RLS
  //    lors des mises à jour déclenchées par Stripe (pas de session utilisateur)
  const supabase = createAdminClient()

  // 4. Router les événements
  try {
    switch (event.type) {
      // -----------------------------------------------------------------------
      // Abonnement créé ou mis à jour
      // -----------------------------------------------------------------------
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription

        // merchant_id est stocké dans les métadonnées de la subscription
        const merchantId = sub.metadata?.merchant_id

        if (!merchantId) {
          // Subscription sans merchant_id : ignorée (peut venir d'un test manuel)
          break
        }

        // CRIT-2: cross-verify that sub.customer matches our stored stripe_customer_id
        // before trusting metadata.merchant_id (prevents privilege escalation via forged metadata)
        const { data: verifiedMerchant } = await supabase
          .from('merchants')
          .select('id, stripe_customer_id')
          .eq('id', merchantId)
          .single<{ id: string; stripe_customer_id: string | null }>()

        const stripeCustomer = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
        if (!verifiedMerchant || verifiedMerchant.stripe_customer_id !== stripeCustomer) {
          // Mismatch — possible forged metadata, ignore this event
          break
        }

        const status = mapStripeStatus(sub.status)

        await supabase
          .from('merchants')
          .update({
            stripe_subscription_id: sub.id,
            subscription_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', merchantId)

        break
      }

      // -----------------------------------------------------------------------
      // Abonnement supprimé / annulé
      // -----------------------------------------------------------------------
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const merchantId = sub.metadata?.merchant_id

        if (!merchantId) break

        // CRIT-2: cross-verify stripe_customer_id before trusting metadata
        const { data: deletedVerified } = await supabase
          .from('merchants')
          .select('id, stripe_customer_id')
          .eq('id', merchantId)
          .single<{ id: string; stripe_customer_id: string | null }>()

        const deletedStripeCustomer = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
        if (!deletedVerified || deletedVerified.stripe_customer_id !== deletedStripeCustomer) break

        await supabase
          .from('merchants')
          .update({
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', merchantId)

        // Email d'annulation — fire-and-forget
        const { data: canceledMerchant } = await supabase
          .from('merchants')
          .select('id, name, user_id')
          .eq('id', merchantId)
          .single<{ id: string; name: string; user_id: string }>()

        if (canceledMerchant) {
          const { data: { user: canceledUser } } = await supabase.auth.admin.getUserById(
            canceledMerchant.user_id,
          )
          if (canceledUser?.email) {
            sendSubscriptionCanceledEmail(canceledUser.email, canceledMerchant.name).catch(() => {})
          }
        }

        break
      }

      // -----------------------------------------------------------------------
      // Paiement de facture réussi
      // Remet le statut à 'active' uniquement si le marchand était 'past_due'.
      // On ne touche pas à 'canceled' ou 'trial'.
      // -----------------------------------------------------------------------
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id

        if (!customerId) break

        await supabase
          .from('merchants')
          .update({
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId)
          .eq('subscription_status', 'past_due')

        break
      }

      // -----------------------------------------------------------------------
      // Paiement de facture échoué → past_due
      // -----------------------------------------------------------------------
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id

        if (!customerId) break

        await supabase
          .from('merchants')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId)

        // Email paiement échoué — fire-and-forget
        const { data: pastDueMerchant } = await supabase
          .from('merchants')
          .select('id, name, user_id')
          .eq('stripe_customer_id', customerId)
          .single<{ id: string; name: string; user_id: string }>()

        if (pastDueMerchant) {
          const { data: { user: pastDueUser } } = await supabase.auth.admin.getUserById(
            pastDueMerchant.user_id,
          )
          if (pastDueUser?.email) {
            const portalUrl = `${getSiteUrl()}/dashboard/abonnement`
            sendSubscriptionPastDueEmail(pastDueUser.email, pastDueMerchant.name, portalUrl).catch(() => {})
          }
        }

        break
      }

      // Événements non gérés : on répond 200 pour que Stripe ne retente pas
      default:
        break
    }
  } catch {
    // Ne pas exposer les détails de l'erreur interne à Stripe
    return NextResponse.json(
      { error: 'Internal error processing webhook' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Mappe le statut Stripe Subscription vers le statut interne Souqly.
 * Stripe statuses : trialing, active, incomplete, incomplete_expired,
 *                   past_due, canceled, unpaid, paused
 */
function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): 'trial' | 'active' | 'past_due' | 'canceled' {
  switch (stripeStatus) {
    case 'trialing':
      return 'trial'
    case 'active':
      return 'active'
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
      return 'past_due'
    case 'canceled':
    case 'incomplete_expired':
    case 'paused':
      return 'canceled'
    default:
      return 'past_due'
  }
}

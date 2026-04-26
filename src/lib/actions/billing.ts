'use server'

/**
 * Server Actions — Facturation Stripe.
 *
 * Variables d'environnement requises :
 *   STRIPE_SECRET_KEY      — clé secrète Stripe (jamais exposée au client)
 *   STRIPE_PRICE_ID        — ID du Price mensuel Stripe (ex: price_1ABC...)
 *   NEXT_PUBLIC_APP_URL    — URL de base de l'app (ex: https://souqly.com)
 *
 * Ces actions utilisent redirect() et doivent être appelées depuis un
 * <form action={action}> — jamais depuis un composant client directement.
 */

import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { getSiteUrl, getStripePriceId } from '@/lib/env'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MerchantBillingRow = {
  id: string
  name: string
  stripe_customer_id: string | null
}

// ---------------------------------------------------------------------------
// createCheckoutSession
// ---------------------------------------------------------------------------

/**
 * Crée ou récupère un customer Stripe pour le marchand connecté,
 * puis ouvre une Checkout Session en mode subscription.
 *
 * Le trial de 14 jours est géré côté Supabase (trial_ends_at) lors de
 * l'approbation par l'admin. On ne passe pas trial_period_days ici afin
 * d'éviter un double trial si le marchand souscrit avant la fin de son essai.
 */
export async function createCheckoutSession(): Promise<never> {
  const supabase = await createClient()
  const stripe = getStripe()

  // 1. Authentification
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?redirect=/dashboard/abonnement')
  }

  // 2. Récupérer le marchand
  const { data: merchant, error: merchantError } = await supabase
    .from('merchants')
    .select('id, name, stripe_customer_id')
    .eq('user_id', user.id)
    .single<MerchantBillingRow>()

  if (merchantError || !merchant) {
    redirect('/dashboard/abonnement?error=merchant_not_found')
  }

  // 3. Créer ou réutiliser le customer Stripe
  let customerId = merchant.stripe_customer_id

  if (!customerId) {
    let customer: Stripe.Customer

    try {
      customer = await stripe.customers.create(
        {
          email: user.email,
          name: merchant.name,
          metadata: {
            merchant_id: merchant.id,
          },
        },
        {
          // Idempotency key : évite les doublons en cas de retry réseau
          idempotencyKey: `create-customer-${merchant.id}`,
        }
      )
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError) {
        redirect(`/dashboard/abonnement?error=stripe_${err.code ?? 'unknown'}`)
      }
      redirect('/dashboard/abonnement?error=stripe_error')
    }

    customerId = customer.id

    // Persister l'ID customer dans la DB
    const { error: updateError } = await supabase
      .from('merchants')
      .update({ stripe_customer_id: customerId })
      .eq('id', merchant.id)

    if (updateError) {
      redirect('/dashboard/abonnement?error=db_error')
    }
  }

  // 4. Créer la Checkout Session
  const appUrl = getSiteUrl()
  const priceId = getStripePriceId()

  let session: Stripe.Checkout.Session

  try {
    session = await stripe.checkout.sessions.create(
      {
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        // Le trial est déjà en cours côté Supabase ; on ne ré-ouvre pas
        // un trial Stripe pour éviter le double-essai.
        subscription_data: {
          metadata: {
            merchant_id: merchant.id,
          },
        },
        success_url: `${appUrl}/dashboard?checkout=success`,
        cancel_url: `${appUrl}/dashboard/abonnement`,
        metadata: {
          merchant_id: merchant.id,
        },
      },
      {
        idempotencyKey: `create-checkout-${merchant.id}-${Date.now()}`,
      }
    )
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      redirect(`/dashboard/abonnement?error=stripe_${err.code ?? 'unknown'}`)
    }
    redirect('/dashboard/abonnement?error=stripe_error')
  }

  if (!session.url) {
    redirect('/dashboard/abonnement?error=no_checkout_url')
  }

  redirect(session.url)
}

// ---------------------------------------------------------------------------
// createPortalSession
// ---------------------------------------------------------------------------

/**
 * Ouvre le Customer Portal Stripe pour que le marchand puisse gérer
 * sa carte bancaire, télécharger ses factures ou annuler son abonnement.
 *
 * Prérequis : activer le portail dans le Dashboard Stripe
 *   Settings → Billing → Customer portal → Activate
 */
export async function createPortalSession(): Promise<never> {
  const supabase = await createClient()
  const stripe = getStripe()

  // 1. Authentification
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?redirect=/dashboard/abonnement')
  }

  // 2. Récupérer le marchand avec son customer ID
  const { data: merchant, error: merchantError } = await supabase
    .from('merchants')
    .select('id, name, stripe_customer_id')
    .eq('user_id', user.id)
    .single<MerchantBillingRow>()

  if (merchantError || !merchant) {
    redirect('/dashboard/abonnement?error=merchant_not_found')
  }

  if (!merchant.stripe_customer_id) {
    redirect('/dashboard/abonnement?error=no_subscription')
  }

  const appUrl = getSiteUrl()

  // 3. Créer la session portail
  let portalSession: Stripe.BillingPortal.Session

  try {
    portalSession = await stripe.billingPortal.sessions.create(
      {
        customer: merchant.stripe_customer_id,
        return_url: `${appUrl}/dashboard/abonnement`,
      },
      {
        idempotencyKey: `portal-${merchant.id}-${Date.now()}`,
      }
    )
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      redirect(`/dashboard/abonnement?error=stripe_${err.code ?? 'unknown'}`)
    }
    redirect('/dashboard/abonnement?error=stripe_error')
  }

  redirect(portalSession.url)
}

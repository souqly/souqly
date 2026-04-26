/**
 * Client Stripe — côté serveur uniquement.
 *
 * Variables d'environnement requises :
 *   STRIPE_SECRET_KEY=sk_live_...          (ou sk_test_... en dev)
 *   STRIPE_WEBHOOK_SECRET=whsec_...        (depuis `stripe listen` ou le Dashboard)
 *   STRIPE_PRICE_ID=price_...              (ID du Price mensuel dans votre produit Stripe)
 *   NEXT_PUBLIC_APP_URL=https://souqly.com (sans slash final)
 *
 * Ne jamais importer ce fichier dans un composant client ('use client').
 * Côté navigateur, utiliser uniquement NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 * avec @stripe/stripe-js si nécessaire.
 */

import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe() {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }

  return stripeClient
}

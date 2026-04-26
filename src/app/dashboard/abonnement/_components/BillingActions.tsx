'use client'

/**
 * BillingActions — Client Component.
 *
 * Expose les boutons Checkout et Portal via des <form> standards.
 * Les Server Actions redirect() côté serveur : aucun fetch client n'est émis.
 */

import { createCheckoutSession, createPortalSession } from '@/lib/actions/billing'

type BillingActionsProps = {
  hasActiveSubscription: boolean
}

export function BillingActions({ hasActiveSubscription }: BillingActionsProps) {
  if (hasActiveSubscription) {
    return (
      <form action={createPortalSession}>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:opacity-50"
        >
          Gérer mon abonnement
        </button>
      </form>
    )
  }

  return (
    <form action={createCheckoutSession}>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:opacity-50"
      >
        S&apos;abonner — 29 €/mois
      </button>
    </form>
  )
}

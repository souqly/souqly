/**
 * Service d'envoi d'emails transactionnels — Server-side only.
 *
 * Toutes les fonctions sont fire-and-forget : appeler avec `.catch(() => {})`.
 * Ne jamais bloquer un flux utilisateur sur la livraison d'un email.
 *
 * WelcomeEmail — à appeler depuis l'action admin `approve_merchant`
 * (espace /admin, non encore construit). Exemple d'appel :
 *   sendWelcomeEmail(user.email, merchant.name, loginUrl).catch(() => {})
 */

import React from 'react'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import WelcomeEmail from './WelcomeEmail'
import ApplicationReceivedEmail from './ApplicationReceivedEmail'
import SubscriptionPastDueEmail from './SubscriptionPastDueEmail'
import SubscriptionCanceledEmail from './SubscriptionCanceledEmail'

type SendResult = { success: true } | { error: string }

// ---------------------------------------------------------------------------
// WelcomeEmail
// Appelé depuis : action admin approve_merchant (à implémenter dans /admin)
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(
  to: string,
  merchantName: string,
  loginUrl: string,
): Promise<SendResult> {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Bienvenue sur Souqly — votre catalogue est prêt',
    react: React.createElement(WelcomeEmail, { merchantName, loginUrl }),
  })
  return error ? { error: error.message } : { success: true }
}

// ---------------------------------------------------------------------------
// ApplicationReceivedEmail
// Appelé depuis : src/lib/actions/auth.ts → signUp (après RPC submit_merchant_application)
// ---------------------------------------------------------------------------

export async function sendApplicationReceivedEmail(
  to: string,
  applicantName: string,
): Promise<SendResult> {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Votre demande a bien été reçue — Souqly',
    react: React.createElement(ApplicationReceivedEmail, { applicantName }),
  })
  return error ? { error: error.message } : { success: true }
}

// ---------------------------------------------------------------------------
// SubscriptionPastDueEmail
// Appelé depuis : src/app/api/stripe/webhook/route.ts → invoice.payment_failed
// ---------------------------------------------------------------------------

export async function sendSubscriptionPastDueEmail(
  to: string,
  merchantName: string,
  portalUrl: string,
): Promise<SendResult> {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Action requise — Votre paiement Souqly a échoué',
    react: React.createElement(SubscriptionPastDueEmail, { merchantName, portalUrl }),
  })
  return error ? { error: error.message } : { success: true }
}

// ---------------------------------------------------------------------------
// SubscriptionCanceledEmail
// Appelé depuis : src/app/api/stripe/webhook/route.ts → customer.subscription.deleted
// ---------------------------------------------------------------------------

export async function sendSubscriptionCanceledEmail(
  to: string,
  merchantName: string,
): Promise<SendResult> {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Votre abonnement Souqly a été annulé',
    react: React.createElement(SubscriptionCanceledEmail, { merchantName }),
  })
  return error ? { error: error.message } : { success: true }
}

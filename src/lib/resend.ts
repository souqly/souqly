/**
 * Client Resend — uniquement côté serveur.
 * Ne jamais importer dans un composant client ou exposer au navigateur.
 *
 * Variables d'environnement requises :
 *   RESEND_API_KEY=re_...
 *   RESEND_FROM_EMAIL=noreply@souqly.com
 */

import { Resend } from 'resend'

let resendClient: Resend | null = null

export function getResend() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set')
    }
    resendClient = new Resend(apiKey)
  }

  return resendClient
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@souqly.com'

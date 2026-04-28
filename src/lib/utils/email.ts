/**
 * Utilitaires d'envoi d'emails transactionnels — Server-side uniquement.
 *
 * Templates HTML inline (pas de React Email) pour compatibilité maximale
 * avec les clients de messagerie.
 *
 * Toutes les fonctions sont fire-and-forget : elles ne doivent jamais
 * bloquer un flux métier. Appeler avec `.catch(() => {})` ou dans un
 * try/catch indépendant.
 *
 * Variables d'environnement requises :
 *   RESEND_API_KEY=re_...
 *   RESEND_FROM_EMAIL=noreply@souqly.com (optionnel — valeur par défaut fournie)
 */

import { getResend, FROM_EMAIL } from '@/lib/resend'

// ---------------------------------------------------------------------------
// Helpers HTML
// ---------------------------------------------------------------------------

function buildHtml(opts: {
  title: string
  preheader: string
  bodyContent: string
  ctaHref?: string
  ctaLabel?: string
}): string {
  const { title, preheader, bodyContent, ctaHref, ctaLabel } = opts

  const ctaBlock =
    ctaHref && ctaLabel
      ? `
      <tr>
        <td align="center" style="padding:32px 0 0;">
          <a href="${ctaHref}"
             style="display:inline-block;background-color:#4f46e5;color:#ffffff;
                    font-family:Arial,sans-serif;font-size:15px;font-weight:600;
                    text-decoration:none;padding:12px 28px;border-radius:6px;">
            ${ctaLabel}
          </a>
        </td>
      </tr>`
      : ''

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
  <!-- Preheader masqué -->
  <span style="display:none;font-size:1px;color:#f3f4f6;max-height:0;overflow:hidden;">
    ${preheader}
  </span>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background-color:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:560px;background-color:#ffffff;border-radius:8px;
                      overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

          <!-- En-tête -->
          <tr>
            <td style="background-color:#4f46e5;padding:24px 32px;">
              <span style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;
                           color:#ffffff;letter-spacing:-0.3px;">
                Souqly
              </span>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding:32px 32px 16px;font-family:Arial,sans-serif;
                       font-size:15px;line-height:1.6;color:#111827;">
              ${bodyContent}
            </td>
          </tr>

          ${ctaBlock}

          <!-- Séparateur -->
          <tr>
            <td style="padding:32px 32px 0;">
              <hr style="border:none;border-top:1px solid #e5e7eb;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 32px;font-family:Arial,sans-serif;
                       font-size:12px;color:#6b7280;line-height:1.5;">
              Souqly — Plateforme catalogue privé<br />
              Vous recevez cet email car vous avez soumis une demande sur souqly.fr.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// sendMerchantApprovedEmail
// Appelé depuis : src/lib/actions/admin.ts → approveApplication()
// ---------------------------------------------------------------------------

export async function sendMerchantApprovedEmail(opts: {
  to: string
  merchantName: string
  dashboardUrl: string
}): Promise<void> {
  const { to, merchantName, dashboardUrl } = opts

  const html = buildHtml({
    title: 'Votre catalogue Souqly est approuvé',
    preheader: `Félicitations ${merchantName} — votre boutique est maintenant active.`,
    bodyContent: `
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">
        Félicitations, ${merchantName}&nbsp;!
      </p>
      <p style="margin:0 0 12px;">
        Votre demande d'accès à Souqly a été <strong style="color:#16a34a;">approuvée</strong>.
        Votre catalogue est maintenant actif et prêt à être configuré.
      </p>
      <p style="margin:0;">
        Connectez-vous à votre tableau de bord pour ajouter vos produits,
        définir votre code d'accès et personnaliser votre boutique.
      </p>
    `,
    ctaHref: dashboardUrl,
    ctaLabel: 'Accéder à mon tableau de bord',
  })

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Votre boutique Souqly est approuvée — ${merchantName}`,
    html,
  })

  if (error) {
    console.warn('[sendMerchantApprovedEmail] Erreur Resend:', error.message)
  }
}

// ---------------------------------------------------------------------------
// sendMerchantRejectedEmail
// Appelé depuis : src/lib/actions/admin.ts → rejectApplication()
// ---------------------------------------------------------------------------

export async function sendMerchantRejectedEmail(opts: {
  to: string
  merchantName: string
  reason?: string
}): Promise<void> {
  const { to, merchantName, reason } = opts

  const reasonBlock = reason
    ? `<p style="margin:16px 0 0;padding:12px 16px;background-color:#fef2f2;
                 border-left:3px solid #ef4444;border-radius:4px;
                 font-size:14px;color:#7f1d1d;">
         <strong>Motif :</strong> ${reason}
       </p>`
    : ''

  const html = buildHtml({
    title: 'Votre demande Souqly n\'a pas été retenue',
    preheader: `Suite à votre demande d'inscription sur Souqly, ${merchantName}.`,
    bodyContent: `
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">
        Bonjour ${merchantName},
      </p>
      <p style="margin:0 0 12px;">
        Nous avons examiné votre demande d'accès à Souqly et nous ne sommes
        malheureusement pas en mesure de la valider à ce stade.
      </p>
      <p style="margin:0;">
        Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez soumettre
        une nouvelle demande, n'hésitez pas à nous contacter à
        <a href="mailto:contact@souqly.fr"
           style="color:#4f46e5;text-decoration:none;">contact@souqly.fr</a>.
      </p>
      ${reasonBlock}
    `,
  })

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Votre demande Souqly n\'a pas été retenue',
    html,
  })

  if (error) {
    console.warn('[sendMerchantRejectedEmail] Erreur Resend:', error.message)
  }
}

// ---------------------------------------------------------------------------
// sendTrialExpiringEmail
// Appelé depuis : job/webhook Stripe ou cron → à implémenter
// ---------------------------------------------------------------------------

export async function sendTrialExpiringEmail(opts: {
  to: string
  merchantName: string
  daysLeft: number
  billingUrl: string
}): Promise<void> {
  const { to, merchantName, daysLeft, billingUrl } = opts

  const urgencyColor = daysLeft <= 2 ? '#ef4444' : '#f59e0b'
  const dayLabel = daysLeft === 1 ? 'jour' : 'jours'

  const html = buildHtml({
    title: `Votre essai Souqly expire dans ${daysLeft} ${dayLabel}`,
    preheader: `Il vous reste ${daysLeft} ${dayLabel} d'essai gratuit, ${merchantName}.`,
    bodyContent: `
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">
        Bonjour ${merchantName},
      </p>
      <p style="margin:0 0 12px;">
        Votre période d'essai gratuit Souqly se termine dans
        <strong style="color:${urgencyColor};">${daysLeft} ${dayLabel}</strong>.
      </p>
      <p style="margin:0 0 12px;">
        Pour continuer à héberger votre catalogue et ne pas perdre l'accès
        à vos produits, abonnez-vous avant l'expiration.
      </p>
      <p style="margin:0;font-size:13px;color:#6b7280;">
        Sans abonnement actif, votre catalogue sera automatiquement suspendu
        à l'issue de la période d'essai.
      </p>
    `,
    ctaHref: billingUrl,
    ctaLabel: 'Activer mon abonnement',
  })

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Votre essai Souqly expire dans ${daysLeft} ${dayLabel} — ${merchantName}`,
    html,
  })

  if (error) {
    console.warn('[sendTrialExpiringEmail] Erreur Resend:', error.message)
  }
}

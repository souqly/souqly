/**
 * SubscriptionCanceledEmail — envoyé quand l'événement Stripe
 * `customer.subscription.deleted` est reçu par le webhook.
 *
 * Subject : "Votre abonnement Souqly a été annulé"
 *
 * Server-side only. Ne jamais importer dans un Client Component.
 */

import React from 'react'

interface SubscriptionCanceledEmailProps {
  merchantName: string
}

const container: React.CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
  backgroundColor: '#ffffff',
  color: '#111827',
}

const header: React.CSSProperties = {
  backgroundColor: '#4F46E5',
  padding: '24px',
  textAlign: 'center',
  borderRadius: '8px 8px 0 0',
}

const content: React.CSSProperties = {
  padding: '32px 24px',
  border: '1px solid #e5e7eb',
  borderTop: 'none',
  borderRadius: '0 0 8px 8px',
}

const footer: React.CSSProperties = {
  marginTop: '32px',
  textAlign: 'center',
  color: '#6b7280',
  fontSize: '12px',
}

export default function SubscriptionCanceledEmail({ merchantName }: SubscriptionCanceledEmailProps) {
  return (
    <div style={container}>
      <div style={header}>
        <h1 style={{ margin: 0, color: '#ffffff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Souqly
        </h1>
      </div>

      <div style={content}>
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginTop: 0 }}>
          Bonjour {merchantName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Votre abonnement Souqly a été annulé. Votre catalogue n&apos;est plus accessible aux visiteurs.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Si vous souhaitez réactiver votre compte, contactez-nous à{' '}
          <a href="mailto:support@souqly.com" style={{ color: '#4F46E5' }}>
            support@souqly.com
          </a>
        </p>

        <div style={footer}>
          <p style={{ margin: 0 }}>© 2025 Souqly. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}

/**
 * ApplicationReceivedEmail — envoyé immédiatement après soumission d'une
 * demande d'accès marchand (signUp → submit_merchant_application RPC).
 *
 * Subject : "Votre demande a bien été reçue — Souqly"
 *
 * Server-side only. Ne jamais importer dans un Client Component.
 */

import React from 'react'

interface ApplicationReceivedEmailProps {
  applicantName: string
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

export default function ApplicationReceivedEmail({ applicantName }: ApplicationReceivedEmailProps) {
  return (
    <div style={container}>
      <div style={header}>
        <h1 style={{ margin: 0, color: '#ffffff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Souqly
        </h1>
      </div>

      <div style={content}>
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginTop: 0 }}>
          Bonjour {applicantName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Nous avons bien reçu votre demande d&apos;accès à Souqly.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Notre équipe va examiner votre dossier sous 24-48h. Vous recevrez un email dès la validation.
        </p>

        <div style={footer}>
          <p style={{ margin: 0 }}>© 2025 Souqly. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}

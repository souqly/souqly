/**
 * WelcomeEmail — envoyé quand un admin approuve une demande marchand.
 * Appelé depuis l'action serveur `approve_merchant` (admin space).
 *
 * Subject : "Bienvenue sur Souqly — votre catalogue est prêt"
 *
 * Server-side only. Ne jamais importer dans un Client Component.
 */

import React from 'react'

interface WelcomeEmailProps {
  merchantName: string
  loginUrl: string
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

const button: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#4F46E5',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '600',
}

const footer: React.CSSProperties = {
  marginTop: '32px',
  textAlign: 'center',
  color: '#6b7280',
  fontSize: '12px',
}

export default function WelcomeEmail({ merchantName, loginUrl }: WelcomeEmailProps) {
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
          Votre compte marchand a été activé. Vous pouvez maintenant créer votre catalogue privé.
        </p>

        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <a href={loginUrl} style={button}>
            Accéder au tableau de bord
          </a>
        </div>

        <div style={footer}>
          <p style={{ margin: 0 }}>© 2025 Souqly. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}

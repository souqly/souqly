import type { Metadata } from 'next'
import Link from 'next/link'
import { ForgotPasswordForm } from './ForgotPasswordForm'

// ---------------------------------------------------------------------------
// Metadata — Server Component
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Mot de passe oublié — Souqly',
  description: 'Réinitialisez le mot de passe de votre compte Souqly.',
  robots: { index: false, follow: false },
}

// ---------------------------------------------------------------------------
// Page — Server Component (pas de 'use client')
// ---------------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* En-tête de marque */}
        <div className="text-center space-y-1">
          <Link
            href="/"
            className="inline-block text-3xl font-bold text-white tracking-tight hover:text-indigo-400 transition-colors"
          >
            Souqly
          </Link>
          <p className="text-neutral-400 text-sm">Récupération de compte</p>
        </div>

        {/* Carte */}
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-8 shadow-xl shadow-black/30">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-white">Mot de passe oublié ?</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Saisissez votre email et nous vous enverrons un lien de réinitialisation.
            </p>
          </div>

          {/* Formulaire Client Component */}
          <ForgotPasswordForm />

          {/* Lien retour */}
          <p className="mt-6 text-center text-sm text-neutral-500">
            <Link
              href="/login"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              ← Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

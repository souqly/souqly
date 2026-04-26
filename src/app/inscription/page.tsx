import type { Metadata } from 'next'
import Link from 'next/link'
import { SignUpForm } from './SignUpForm'

// ---------------------------------------------------------------------------
// Metadata — Server Component
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Créer un compte — Souqly',
  description:
    'Créez votre compte marchand Souqly et lancez votre catalogue privé en quelques minutes.',
  robots: { index: false, follow: false },
}

// ---------------------------------------------------------------------------
// Page — Server Component (pas de 'use client')
// ---------------------------------------------------------------------------

export default function InscriptionPage() {
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
          <p className="text-neutral-400 text-sm">Créez votre catalogue privé</p>
        </div>

        {/* Carte */}
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-8 shadow-xl shadow-black/30">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-white">Créer un compte</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Votre demande sera examinée et validée par notre équipe.
            </p>
          </div>

          {/* Formulaire Client Component */}
          <SignUpForm />

          {/* Lien vers connexion */}
          <p className="mt-6 text-center text-sm text-neutral-500">
            Déjà un compte ?{' '}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

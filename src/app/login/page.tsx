import type { Metadata } from 'next'
import Link from 'next/link'
import { SignInForm } from './SignInForm'

// ---------------------------------------------------------------------------
// Metadata — Server Component
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Connexion — Souqly',
  description: 'Connectez-vous à votre espace marchand Souqly.',
  robots: { index: false, follow: false },
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>
}

// ---------------------------------------------------------------------------
// Page — Server Component (pas de 'use client')
// ---------------------------------------------------------------------------

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectParam } = await searchParams

  // Sécurité anti open-redirect : n'accepter que les chemins relatifs (pas //)
  const safeRedirect =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : '/dashboard'

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
          <p className="text-neutral-400 text-sm">Votre espace marchand</p>
        </div>

        {/* Carte */}
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-8 shadow-xl shadow-black/30">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-white">Se connecter</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Accédez à votre tableau de bord.
            </p>
          </div>

          {/* Formulaire Client Component */}
          <SignInForm redirectTo={safeRedirect} />

          {/* Liens secondaires */}
          <div className="mt-6 flex flex-col gap-3 text-center text-sm text-neutral-500">
            <Link
              href="/forgot-password"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Mot de passe oublié ?
            </Link>
            <p>
              Pas encore de compte ?{' '}
              <Link
                href="/inscription"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

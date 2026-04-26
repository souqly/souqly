'use client'

import { useTransition, useState, useId } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { signIn, type ActionResult } from '@/lib/actions/auth'

// ---------------------------------------------------------------------------
// SignInForm — Client Component
// ---------------------------------------------------------------------------

interface SignInFormProps {
  redirectTo: string
}

export function SignInForm({ redirectTo }: SignInFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const emailId = useId()
  const passwordId = useId()
  const errorId = useId()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result: ActionResult = await signIn(formData)
      if ('error' in result) {
        setError(result.error)
        return
      }
      // Connexion réussie → redirection côté client
      router.push(redirectTo)
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor={emailId} className="block text-sm font-medium text-neutral-300">
          Adresse email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          placeholder="jean@exemple.fr"
          aria-describedby={error ? errorId : undefined}
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
      </div>

      {/* Mot de passe */}
      <div className="space-y-1.5">
        <label htmlFor={passwordId} className="block text-sm font-medium text-neutral-300">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            disabled={isPending}
            placeholder="Votre mot de passe"
            aria-describedby={error ? errorId : undefined}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 pr-11 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
        >
          {error}
        </p>
      )}

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
      >
        {isPending ? (
          <>
            <span
              className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
              aria-hidden="true"
            />
            Connexion en cours…
          </>
        ) : (
          'Se connecter'
        )}
      </button>
    </form>
  )
}

'use client'

import { useTransition, useState, useId } from 'react'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { signUp, type ActionResult } from '@/lib/actions/auth'

// ---------------------------------------------------------------------------
// SignUpForm — Client Component
// ---------------------------------------------------------------------------

export function SignUpForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const companyId = useId()
  const errorId = useId()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await signUp(formData)
      setResult(res)
    })
  }

  // Succès : afficher le message de confirmation
  if (result && 'success' in result) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center" role="status">
        <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-indigo-400" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-white">Inscription enregistrée</p>
          <p className="text-sm text-neutral-400">
            {result.message ?? 'Vérifiez votre email pour confirmer votre compte.'}
          </p>
        </div>
      </div>
    )
  }

  const errorMessage = result && 'error' in result ? result.error : null

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Nom complet */}
      <div className="space-y-1.5">
        <label htmlFor={nameId} className="block text-sm font-medium text-neutral-300">
          Nom complet <span aria-hidden="true" className="text-indigo-400">*</span>
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={isPending}
          placeholder="Jean Dupont"
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor={emailId} className="block text-sm font-medium text-neutral-300">
          Adresse email <span aria-hidden="true" className="text-indigo-400">*</span>
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          placeholder="jean@exemple.fr"
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
      </div>

      {/* Mot de passe */}
      <div className="space-y-1.5">
        <label htmlFor={passwordId} className="block text-sm font-medium text-neutral-300">
          Mot de passe <span aria-hidden="true" className="text-indigo-400">*</span>
        </label>
        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            disabled={isPending}
            placeholder="8 caractères minimum"
            aria-describedby={errorMessage ? errorId : undefined}
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

      {/* Nom de l'entreprise (optionnel) */}
      <div className="space-y-1.5">
        <label htmlFor={companyId} className="block text-sm font-medium text-neutral-300">
          Nom de l&apos;entreprise{' '}
          <span className="text-neutral-500 font-normal text-xs">(optionnel)</span>
        </label>
        <input
          id={companyId}
          name="company_name"
          type="text"
          autoComplete="organization"
          disabled={isPending}
          placeholder="Ma Boutique SAS"
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
        >
          {errorMessage}
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
            Création en cours…
          </>
        ) : (
          'Créer mon compte'
        )}
      </button>
    </form>
  )
}

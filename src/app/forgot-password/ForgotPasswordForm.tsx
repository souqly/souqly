'use client'

import { useTransition, useState, useId } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { resetPassword, type ActionResult } from '@/lib/actions/auth'

// ---------------------------------------------------------------------------
// ForgotPasswordForm — Client Component
// ---------------------------------------------------------------------------

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)

  const emailId = useId()
  const errorId = useId()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await resetPassword(formData)
      setResult(res)
    })
  }

  // Succès : formulaire désactivé, message affiché
  if (result && 'success' in result) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center" role="status">
        <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-indigo-400" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-white">Email envoyé</p>
          <p className="text-sm text-neutral-400">
            {result.message ?? 'Si ce compte existe, un email a été envoyé.'}
          </p>
        </div>
      </div>
    )
  }

  const errorMessage = result && 'error' in result ? result.error : null

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
          aria-describedby={errorMessage ? errorId : undefined}
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

      {/* Bouton */}
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
            Envoi en cours…
          </>
        ) : (
          'Envoyer le lien de réinitialisation'
        )}
      </button>
    </form>
  )
}

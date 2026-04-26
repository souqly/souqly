'use client'

import { useState, useTransition, useRef } from 'react'
import { Loader2, ShieldAlert } from 'lucide-react'
import { updateAccessCode } from '@/lib/actions/dashboard'

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function SettingsAccessCodeForm() {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFeedback(null)

    const formData = new FormData(e.currentTarget)
    const newCode = formData.get('new_code') as string
    const confirm = formData.get('confirm_code') as string

    if (newCode !== confirm) {
      setFeedback({ type: 'error', message: 'Les deux codes ne correspondent pas.' })
      return
    }

    startTransition(async () => {
      const result = await updateAccessCode(formData)
      if ('error' in result) {
        setFeedback({ type: 'error', message: result.error })
      } else {
        setFeedback({
          type: 'success',
          message: 'Code d\'accès mis à jour. Tous les visiteurs ont été déconnectés.',
        })
        formRef.current?.reset()
      }
    })
  }

  return (
    <section className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-base font-semibold text-white">Code d&apos;accès catalogue</h2>
        <p className="text-sm text-neutral-500 mt-0.5">
          Protège l&apos;accès à votre catalogue public.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        {/* Avertissement */}
        <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3">
          <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300/80">
            Changer le code déconnectera immédiatement tous les visiteurs actuellement connectés à votre catalogue.
          </p>
        </div>

        {/* Nouveau code */}
        <div>
          <label htmlFor="new-code" className="block text-xs font-medium text-neutral-400 mb-1.5">
            Nouveau code <span className="text-red-400">*</span>
          </label>
          <input
            id="new-code"
            name="new_code"
            type="text"
            required
            minLength={4}
            maxLength={20}
            pattern="[a-zA-Z0-9]+"
            autoComplete="off"
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono tracking-widest"
            placeholder="ex : BOUTIQUE2024"
          />
          <p className="text-xs text-neutral-600 mt-1">4 à 20 caractères alphanumériques.</p>
        </div>

        {/* Confirmation */}
        <div>
          <label htmlFor="confirm-code" className="block text-xs font-medium text-neutral-400 mb-1.5">
            Confirmer le code <span className="text-red-400">*</span>
          </label>
          <input
            id="confirm-code"
            name="confirm_code"
            type="text"
            required
            minLength={4}
            maxLength={20}
            pattern="[a-zA-Z0-9]+"
            autoComplete="off"
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono tracking-widest"
            placeholder="Répétez le code"
          />
        </div>

        {/* Feedback */}
        {feedback && (
          <p
            className={`text-sm rounded-lg px-3 py-2 ${
              feedback.type === 'success'
                ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                : 'text-red-400 bg-red-500/10 border border-red-500/20'
            }`}
          >
            {feedback.message}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Changer le code
          </button>
        </div>
      </form>
    </section>
  )
}

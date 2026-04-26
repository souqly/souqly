'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, ArrowRight } from 'lucide-react'
import { unlockCatalog } from '@/lib/actions/catalog'

interface CodeAccessFormProps {
  slug: string
  merchantName: string
}

export function CodeAccessForm({ slug, merchantName }: CodeAccessFormProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!code.trim()) {
      setError('Veuillez saisir le code d\'accès.')
      return
    }

    startTransition(async () => {
      const result = await unlockCatalog(slug, code.trim())

      if (result.success) {
        router.push(`/${slug}/catalogue`)
      } else {
        setError(result.error ?? 'Code invalide. Veuillez réessayer.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / identité marchand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 mb-4"
            aria-hidden="true"
          >
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50 font-heading">
            {merchantName}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Ce catalogue est protégé. Saisissez le code d&apos;accès pour continuer.
          </p>
        </div>

        {/* Card formulaire */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} noValidate aria-label="Formulaire de débloquage catalogue">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="access-code"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Code d&apos;accès
                </label>
                <input
                  id="access-code"
                  type="text"
                  inputMode="text"
                  autoComplete="one-time-code"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Ex. : BOUTIQUE2024"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    if (error) setError(null)
                  }}
                  disabled={isPending}
                  aria-describedby={error ? 'code-error' : undefined}
                  aria-invalid={error ? 'true' : 'false'}
                  className={[
                    'w-full px-4 py-3 rounded-lg text-base text-slate-50',
                    'bg-slate-900 border placeholder:text-slate-500',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800',
                    'transition-colors duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    error
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : 'border-slate-600 hover:border-slate-500',
                  ].join(' ')}
                />

                {error && (
                  <p
                    id="code-error"
                    role="alert"
                    className="mt-2 text-sm text-red-400 flex items-center gap-1.5"
                  >
                    <span aria-hidden="true">&#x26A0;</span>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending || !code.trim()}
                className={[
                  'w-full flex items-center justify-center gap-2',
                  'px-4 py-3 rounded-lg font-semibold text-white text-base',
                  'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800',
                  'transition-colors duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600',
                ].join(' ')}
                aria-busy={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Vérification…</span>
                  </>
                ) : (
                  <>
                    <span>Accéder au catalogue</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Vous n&apos;avez pas de code ? Contactez le marchand pour en obtenir un.
        </p>
      </div>
    </div>
  )
}

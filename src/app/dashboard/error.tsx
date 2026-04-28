'use client'

import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center gap-5">
      <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h2 className="text-base font-semibold text-white">Une erreur est survenue</h2>
        {error.message && (
          <p className="text-xs text-neutral-500 font-mono bg-neutral-900 border border-white/5 rounded-lg px-3 py-2 break-all">
            {error.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-white text-neutral-950 px-5 py-2.5 text-sm font-semibold hover:bg-neutral-100 transition-colors"
      >
        Réessayer
      </button>
    </div>
  )
}

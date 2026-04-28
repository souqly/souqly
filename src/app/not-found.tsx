// Server Component — affiché par Next.js automatiquement pour toute route inconnue

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 text-center gap-6">
      <span className="text-2xl font-bold text-indigo-400 tracking-tight">Souqly</span>

      <p className="text-8xl font-black text-neutral-800 leading-none select-none" aria-hidden="true">
        404
      </p>

      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-white">Page introuvable</h1>
        <p className="text-sm text-neutral-500">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-white text-neutral-950 px-5 py-2.5 text-sm font-semibold hover:bg-neutral-100 transition-colors"
      >
        ← Retour à l&apos;accueil
      </Link>
    </div>
  )
}

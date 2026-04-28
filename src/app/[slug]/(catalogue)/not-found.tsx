// Server Component — affiché quand notFound() est appelé dans la page produit

import Link from 'next/link'
import { Package } from 'lucide-react'

export default function CatalogueNotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 text-center gap-6">
      <Package className="h-12 w-12 text-neutral-700" aria-hidden="true" />

      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-white">Produit introuvable</h1>
        <p className="text-sm text-neutral-500">
          Ce produit n&apos;existe pas ou n&apos;est plus disponible.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 px-5 py-2.5 text-sm font-semibold hover:border-white/30 hover:text-white transition-colors"
      >
        ← Retour au catalogue
      </Link>
    </div>
  )
}

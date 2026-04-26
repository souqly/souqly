import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface EmptyCartProps {
  merchantSlug: string
}

export function EmptyCart({ merchantSlug }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Illustration SVG panier vide */}
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="mb-6 text-slate-600"
      >
        {/* Panier */}
        <path
          d="M16 20h8l10 36h32l8-24H32"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Roues */}
        <circle cx="42" cy="62" r="4" stroke="currentColor" strokeWidth="3" />
        <circle cx="58" cy="62" r="4" stroke="currentColor" strokeWidth="3" />
        {/* Croix "vide" */}
        <path
          d="M44 34l8 8m0-8l-8 8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Étoiles déco */}
        <circle cx="76" cy="20" r="2" fill="currentColor" opacity="0.4" />
        <circle cx="82" cy="30" r="1.5" fill="currentColor" opacity="0.3" />
        <circle cx="20" cy="48" r="1.5" fill="currentColor" opacity="0.3" />
      </svg>

      <h2 className="text-xl font-semibold text-slate-200 font-heading mb-2">
        Votre panier est vide
      </h2>
      <p className="text-sm text-slate-400 max-w-xs mb-8 leading-relaxed">
        Vous n&apos;avez pas encore ajouté d&apos;articles. Parcourez le catalogue pour découvrir
        nos produits.
      </p>

      <Link
        href={`/${merchantSlug}/catalogue`}
        className={[
          'inline-flex items-center gap-2',
          'px-5 py-2.5 rounded-lg font-medium text-sm text-white',
          'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        ].join(' ')}
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Retour au catalogue
      </Link>
    </div>
  )
}

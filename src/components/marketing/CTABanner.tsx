// Server Component
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CTABannerProps {
  headline?: string;
  subline?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function CTABanner({
  headline = 'Votre catalogue professionnel en 10 minutes.',
  subline = '14 jours d\'essai gratuit. Sans carte bancaire. Sans engagement.',
  ctaLabel = 'Commencer gratuitement',
  ctaHref = '/inscription',
}: CTABannerProps) {
  return (
    <section
      className="relative overflow-hidden border border-indigo-500/20 bg-gradient-to-b from-indigo-900/50 via-slate-900 to-slate-900 py-20 sm:py-28"
      aria-labelledby="cta-heading"
    >
      {/* Halo indigo — effet de profondeur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-start justify-center pt-0"
      >
        <div className="h-[320px] w-[900px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Grille de points décoratifs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(99,102,241,0.06)_1px,_transparent_1px)] [background-size:32px_32px]"
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        {/* Headline */}
        <h2
          id="cta-heading"
          className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          {headline}
        </h2>

        {/* Sous-titre */}
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
          {subline}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={ctaHref}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-7 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-colors duration-200 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <Link
            href="/tarifs"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-7 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Voir les tarifs
          </Link>
        </div>

        {/* Micro-texte de réassurance */}
        <p className="mt-5 text-xs text-slate-500">
          Aucune carte bancaire requise pour l&apos;essai. Résiliation possible à tout moment.
        </p>
      </div>
    </section>
  );
}

// Server Component — pas de 'use client' : animation déportée en CSS pur
// Gain LCP : suppression du opacity:0 initial qui retardait la visibilité du h1

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface HeroProps {
  headline: string;
  subtitle: string;
  badge?: string;
}

export default function Hero({ headline, subtitle, badge }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-slate-950 py-24 sm:py-32">
      {/* Halo de fond */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden"
      >
        <div className="h-[500px] w-[900px] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      {/* Animation CSS pure — opacity 0→1 + translateY 20px→0 en 700ms */}
      <div className="relative mx-auto max-w-4xl px-5 text-center animate-hero-fade">
        {/* Badge social proof */}
        {badge && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-300">
            <ShieldCheck className="h-4 w-4" />
            {badge}
          </div>
        )}

        {/* Headline — LCP element */}
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {headline}
        </h1>

        {/* Sous-titre */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/inscription"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Commencer — 14j gratuits
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/fonctionnalites"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Voir les fonctionnalités
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-10 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-sm text-slate-400">
            <strong className="text-white">4,9/5</strong> — 200+ marchands actifs
          </p>
          <span className="hidden text-slate-600 sm:inline">·</span>
          <p className="text-sm text-slate-400">
            <strong className="text-white">14 jours</strong> d&apos;essai sans CB
          </p>
        </div>
      </div>
    </section>
  );
}

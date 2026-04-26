'use client';

import { useState, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  initials: string;
  avatarClass: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Avant Souqly, j\'envoyais un PDF de 40 pages à chaque nouvelle cliente. La mise à jour prenait deux heures. Maintenant, j\'ajoute un produit en deux minutes et mes clientes ont toujours la version à jour. La première semaine, j\'ai reçu trois commandes WhatsApp bien formulées d\'un coup — je savais exactement quoi préparer. C\'est le premier outil qui fait vraiment ce que je veux.',
    author: 'Nadia B.',
    role: 'Boutique mode femme, Créteil',
    rating: 5,
    initials: 'NB',
    avatarClass: 'bg-indigo-600',
  },
  {
    quote:
      'Mon catalogue doit être aussi propre que les produits que je vends. Yupoo faisait cheap, les PDFs faisaient cheap. Souqly a un rendu que je n\'ai pas honte de montrer — le dark mode, les photos bien cadrées, la navigation rapide sur mobile. Mes clients sur Telegram commandent directement depuis le catalogue. Et quand un article est vendu, je le retire en dix secondes depuis mon téléphone.',
    author: 'Mehdi O.',
    role: 'Revendeur sneakers & streetwear, Lyon',
    rating: 5,
    initials: 'MO',
    avatarClass: 'bg-amber-500',
  },
  {
    quote:
      'Je fabriquais tout à la main et je gérais les commandes dans ma tête. J\'avais peur que faire un catalogue en ligne soit trop compliqué pour moi. En réalité, j\'ai mis mes douze produits en vingt minutes le soir après le travail. Maintenant mes clientes me demandent "c\'est quoi ton lien Souqly ?" au lieu de me poser dix questions sur WhatsApp. Je gagne du temps, elles sont contentes.',
    author: 'Khadija A.',
    role: 'Cosmétiques naturels artisanaux, Marrakech / diaspora France',
    rating: 5,
    initials: 'KA',
    avatarClass: 'bg-emerald-600',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;
  const trackRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  // Navigation clavier sur les contrôles
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  const t = TESTIMONIALS[current];

  return (
    <section className="bg-slate-900 py-20 sm:py-28" id="temoignages">
      <div className="mx-auto max-w-6xl px-5">
        {/* En-tête */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Témoignages
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
            Ce que disent les marchands qui l&apos;utilisent
          </h2>
        </div>

        {/* Desktop : grille 3 colonnes */}
        <div className="mt-14 hidden gap-6 lg:grid lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} />
          ))}
        </div>

        {/* Mobile / tablet : carousel scroll-snap */}
        <div className="mt-14 lg:hidden">
          {/* Piste scrollable */}
          <div
            ref={trackRef}
            role="region"
            aria-label="Carrousel témoignages"
            aria-live="polite"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            className="focus-visible:outline-none"
          >
            <TestimonialCard testimonial={t} />
          </div>

          {/* Contrôles */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Témoignage précédent"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-400 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Indicateurs */}
            <div className="flex gap-2" role="tablist" aria-label="Sélectionner un témoignage">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Témoignage ${i + 1} sur ${total}`}
                  onClick={() => setCurrent(i)}
                  className={[
                    'h-2 rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
                    i === current ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-600',
                  ].join(' ')}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Témoignage suivant"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-400 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-slate-800/60 p-8">
      {/* Étoiles */}
      <div className="mb-5 flex gap-1" aria-label={`Note : ${testimonial.rating} étoiles sur 5`}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
        ))}
      </div>

      {/* Citation */}
      <blockquote className="flex-1 text-base leading-7 text-slate-200">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Auteur */}
      <div className="mt-6 flex items-center gap-3">
        {/* Avatar initiales */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${testimonial.avatarClass}`}
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{testimonial.author}</p>
          <p className="text-xs text-slate-400">{testimonial.role}</p>
        </div>
      </div>
    </article>
  );
}

// Server Component
import Link from 'next/link';
import { Check } from 'lucide-react';

const FEATURES = [
  'Catalogue illimité (produits & catégories)',
  'Code d\'accès client configurable',
  'Commande WhatsApp & Telegram en 1 clic',
  'Galerie photos HD (jusqu\'à 10 photos/produit)',
  'Tableau de bord avec statistiques',
  'Lien personnalisé souqly.fr/votre-boutique',
  'Support francophone par email',
  '14 jours d\'essai gratuit, sans CB',
] as const;

export default function Pricing() {
  return (
    <section className="bg-slate-950 py-20 sm:py-28" id="tarifs">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Tarifs
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
            Un plan simple, sans surprise
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Tout est inclus. Pas de frais cachés, pas de commission sur vos ventes.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-md">
          <div className="relative rounded-2xl border border-indigo-500/40 bg-slate-900 p-8 shadow-xl shadow-indigo-900/20">
            {/* Badge populaire */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white">
                Accès complet
              </span>
            </div>

            {/* Prix */}
            <div className="text-center">
              <p className="font-heading text-5xl font-bold text-white">
                29€
                <span className="ml-1 text-xl font-normal text-slate-400">/mois</span>
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Puis 29€/mois — résiliable à tout moment
              </p>
            </div>

            {/* Features */}
            <ul className="mt-8 space-y-3.5">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <Check className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/inscription"
              className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Commencer — 14 jours gratuits
            </Link>

            <p className="mt-4 text-center text-xs text-slate-500">
              Aucune carte bancaire requise pour l&apos;essai
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Vous avez des questions ? Écrivez-nous à{' '}
          <a href="mailto:bonjour@souqly.fr" className="text-indigo-400 hover:text-indigo-300">
            bonjour@souqly.fr
          </a>
        </p>
      </div>
    </section>
  );
}

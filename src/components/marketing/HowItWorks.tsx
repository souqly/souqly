// Server Component
import { LayoutGrid, Share2, MessageCircle } from 'lucide-react';

const STEPS = [
  {
    icon: LayoutGrid,
    number: '01',
    title: 'Créez votre catalogue',
    description:
      'Ajoutez vos produits : une photo, un nom, un prix. Organisez-les par catégories à votre façon. Aucune compétence technique requise — si vous savez publier une Story Instagram, vous savez utiliser Souqly.',
  },
  {
    icon: Share2,
    number: '02',
    title: 'Partagez votre lien et votre code',
    description:
      'Vous obtenez un lien unique (souqly.fr/votre-boutique) et un code d\'accès que vous donnez à vos clientes. Vos prix restent invisibles de la concurrence. Vos clientes se sentent dans un espace réservé.',
  },
  {
    icon: MessageCircle,
    number: '03',
    title: 'Vos clientes commandent sur WhatsApp',
    description:
      'Elles parcourent le catalogue, ajoutent ce qu\'elles veulent au panier, et cliquent sur "Commander". Un message pré-rempli s\'ouvre sur WhatsApp ou Telegram avec les références, les quantités et le total. Vous recevez une commande claire. Zéro ambiguïté.',
  },
] as const;

export default function HowItWorks() {
  return (
    <section className="bg-slate-900 py-20 sm:py-28" id="comment-ca-marche">
      <div className="mx-auto max-w-6xl px-5">
        {/* En-tête de section */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Comment ça marche
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
            En 10 minutes, votre catalogue est en ligne.
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Pas besoin de compétences techniques. Pas de site à créer. Pas de plugin à installer.
            De l&apos;inscription à votre première commande WhatsApp, comptez moins d&apos;une heure.
          </p>
        </div>

        {/* Grille des 3 étapes */}
        <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Ligne de connexion desktop — centrée sur les cercles (top-10 = moitié du h-20) */}
          <div
            aria-hidden="true"
            className="absolute left-[16.67%] right-[16.67%] top-10 hidden border-t border-dashed border-slate-700 md:block"
          />

          {STEPS.map(({ icon: Icon, number, title, description }) => (
            <div key={number} className="relative flex flex-col items-center text-center">
              {/* Cercle numéro + icône */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-600/10 ring-1 ring-inset ring-white/5">
                <Icon className="h-8 w-8 text-indigo-400" aria-hidden="true" />
                <span
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-lg"
                  aria-label={`Étape ${number}`}
                >
                  {number}
                </span>
              </div>

              <h3 className="font-heading mt-6 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

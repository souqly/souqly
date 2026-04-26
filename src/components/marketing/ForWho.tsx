// Server Component

interface Persona {
  emoji: string;
  type: string;
  situation: string;
  benefit: string;
}

const PERSONAS: Persona[] = [
  {
    emoji: '👗',
    type: 'Mode & Prêt-à-porter',
    situation:
      'Vous revendez des vêtements achetés en gros — Turquie, Maroc, Dubaï. Vous partagez des PDFs lourds ou des photos WhatsApp en vrac.',
    benefit: 'Un catalogue navigable, toujours à jour.',
  },
  {
    emoji: '👟',
    type: 'Sneakers & Streetwear',
    situation:
      'L\'image compte autant que le produit dans votre marché. Un catalogue moche = produits perçus comme moins désirables.',
    benefit: 'Design dark mode soigné, commandes structurées, stock sous contrôle.',
  },
  {
    emoji: '💄',
    type: 'Cosmétique & Beauté',
    situation:
      'Yupoo marche jusqu\'au jour où ça ne marche plus. Interface en anglais, liens qui expirent, pas de support.',
    benefit: 'Alternative française fiable, avec panier intégré.',
  },
  {
    emoji: '📱',
    type: 'Électronique & High-Tech',
    situation:
      'Vos références sont nombreuses et vos prix changent souvent. Vos clients demandent les specs en message privé — vous répondez vingt fois la même chose.',
    benefit: 'Fiche produit complète. Mise à jour prix en quelques secondes.',
  },
  {
    emoji: '🍕',
    type: 'Alimentation & Traiteur',
    situation:
      'Vos clientes commandent par habitude sur WhatsApp. Votre menu change chaque semaine et le mettre à jour prend des heures.',
    benefit: 'Catalogue à parcourir librement. Mise à jour en 2 minutes.',
  },
  {
    emoji: '🏺',
    type: 'Artisanat & Décoration',
    situation:
      'Vous fabriquez vos produits à la main — savons, huiles, bijoux, poterie. Vos créations méritent mieux qu\'un album photo Facebook.',
    benefit: 'Galerie pro avec code d\'accès VIP. Commandes organisées.',
  },
] as const;

export default function ForWho() {
  return (
    <section className="bg-slate-900 py-20 sm:py-28" id="pour-qui">
      <div className="mx-auto max-w-6xl px-5">
        {/* En-tête de section */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            Pour qui ?
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
            Souqly est fait pour vous si&hellip;
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Que vous vendiez des vêtements, des sneakers ou des cosmétiques, Souqly répond à un
            besoin précis : un catalogue propre, privé, et des commandes WhatsApp claires.
          </p>
        </div>

        {/* Grille 3×2 desktop, 1 col mobile */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map(({ emoji, type, situation, benefit }) => (
            <article
              key={type}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-800/40 p-6 transition-colors duration-200 hover:border-amber-500/30 hover:bg-slate-800/60"
            >
              {/* Emoji + type */}
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none" role="img" aria-label={type}>
                  {emoji}
                </span>
                <h3 className="font-heading text-base font-semibold text-white">{type}</h3>
              </div>

              {/* Situation — le problème reconnu */}
              <p className="flex-1 text-sm leading-6 text-slate-400">{situation}</p>

              {/* Bénéfice Souqly */}
              <p className="inline-flex items-center gap-2 text-sm font-medium text-amber-400">
                <span aria-hidden="true" className="h-px flex-1 bg-amber-500/20" />
                {benefit}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

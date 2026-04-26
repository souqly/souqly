// Server Component
import {
  Lock,
  ShoppingCart,
  LayoutGrid,
  Images,
  FileText,
  BarChart2,
  Link,
  Sun,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Lock,
    title: 'Code d\'accès catalogue',
    description:
      'Votre catalogue n\'est pas indexé sur Google. Seules les personnes à qui vous donnez le code peuvent y accéder. Vous protégez vos prix, vos fournisseurs et votre fonds de commerce.',
  },
  {
    icon: ShoppingCart,
    title: 'Panier WhatsApp & Telegram',
    description:
      'Vos clientes ajoutent leurs produits au panier et cliquent "Commander". Un message pré-rempli s\'ouvre automatiquement avec les références, les quantités et le total. Fini les "c\'est quoi la ref déjà ?"',
  },
  {
    icon: LayoutGrid,
    title: 'Gestion multi-catégories',
    description:
      'Organisez vos produits en catégories et sous-catégories à votre façon — par type, par marque, par saison. Réorganisez l\'ordre par glisser-déposer. Vos clientes naviguent comme dans une vraie boutique.',
  },
  {
    icon: Images,
    title: 'Upload photos illimité',
    description:
      'Ajoutez jusqu\'à dix photos par produit. Glissez-déposez pour les réorganiser. Toutes les photos sont compressées automatiquement — votre catalogue reste rapide même sur connexion mobile.',
  },
  {
    icon: FileText,
    title: 'Template de message personnalisable',
    description:
      'Choisissez exactement ce que vos clientes écrivent quand elles commandent. Nom, références, quantités, total, remarques de livraison — vous décidez de la structure.',
  },
  {
    icon: BarChart2,
    title: 'Dashboard statistiques',
    description:
      'Voyez combien de personnes ont visité votre catalogue, combien ont entré le code, combien ont généré une commande WhatsApp. Des chiffres simples pour savoir ce qui marche.',
  },
  {
    icon: Link,
    title: 'Lien catalogue personnalisé',
    description:
      'Votre catalogue est accessible sur souqly.fr/votre-nom. Un lien propre à mettre dans votre bio Instagram, dans votre groupe WhatsApp ou sur votre carte de visite.',
  },
  {
    icon: Sun,
    title: 'Mode sombre / mode clair',
    description:
      'Le mode sombre par défaut donne un rendu premium aux photos produit. Le mode clair est disponible pour celles qui le préfèrent. Aucun réglage à faire de votre côté.',
  },
] as const;

export default function Features() {
  return (
    <section className="bg-slate-950 py-20 sm:py-28" id="fonctionnalites">
      <div className="mx-auto max-w-6xl px-5">
        {/* En-tête de section */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Fonctionnalités
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
            Tout ce qu&apos;il faut. Rien de superflu.
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Souqly est conçu spécifiquement pour les marchands qui vendent via WhatsApp et Telegram.
            Chaque fonctionnalité a une seule raison d&apos;exister : vous faire gagner du temps ou vous faire vendre plus.
          </p>
        </div>

        {/* Grille 2×4 desktop, 1 col mobile */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-200 hover:border-indigo-500/50 hover:bg-slate-800/80"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/15">
                <Icon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

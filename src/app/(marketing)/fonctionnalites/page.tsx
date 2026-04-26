// Server Component — Page Fonctionnalités
import type { Metadata } from 'next';
import {
  LockKeyhole,
  MessageCircle,
  LayoutGrid,
  ImageIcon,
  BarChart2,
  Smartphone,
  Zap,
  Shield,
} from 'lucide-react';
import CTABanner from '@/components/marketing/CTABanner';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Fonctionnalités — Catalogue en ligne protégé | Souqly',
  description:
    'Découvrez toutes les fonctionnalités du catalogue en ligne Souqly : code d\'accès, commande WhatsApp, galerie photos, statistiques et plus. Conçu pour les marchands indépendants.',
  keywords: [
    'fonctionnalités catalogue en ligne',
    'catalogue WhatsApp fonctionnalités',
    'code accès catalogue',
    'commande whatsapp automatique',
    'catalogue produit protégé',
  ],
  alternates: { canonical: 'https://souqly.fr/fonctionnalites' },
  robots: { index: true, follow: true },
  openGraph: {
    url: 'https://souqly.fr/fonctionnalites',
    title: 'Fonctionnalités — Catalogue en ligne protégé | Souqly',
    description:
      'Code d\'accès, commande WhatsApp en 1 clic, galerie HD, stats. Tout pour vendre via WhatsApp.',
    images: [{ url: 'https://souqly.fr/og?type=feature', width: 1200, height: 630 }],
  },
};

const FEATURES = [
  {
    icon: LockKeyhole,
    title: 'Code d\'accès client',
    description:
      'Définissez un code alphanumérique de 4 à 20 caractères. Seuls les clients qui ont le code accèdent à votre catalogue. Sessions sécurisées de 24h, révocables à tout moment.',
    details: ['Code personnalisable', 'Stockage bcrypt sécurisé', 'Révocation en 1 clic', 'Sessions 24h'],
  },
  {
    icon: MessageCircle,
    title: 'Commande WhatsApp & Telegram',
    description:
      'Vos clients sélectionnent leurs produits, cliquent "Commander" et un message structuré avec tous les détails est envoyé directement sur votre numéro. Zéro saisie manuelle.',
    details: ['Message pré-rempli automatique', 'WhatsApp et Telegram', 'Template personnalisable', 'Nom client optionnel'],
  },
  {
    icon: LayoutGrid,
    title: 'Catalogue organisé',
    description:
      'Structurez vos produits en catégories, réorganisez par glisser-déposer. Chaque produit a son nom, référence, prix et description.',
    details: ['Catégories illimitées', 'Produits illimités', 'Réorganisation drag & drop', 'Statut disponible/indispo'],
  },
  {
    icon: ImageIcon,
    title: 'Galerie photos HD',
    description:
      'Jusqu\'à 10 photos par produit. Galerie swipeable sur mobile, lightbox sur desktop. Photos compressées automatiquement pour des temps de chargement rapides.',
    details: ['10 photos max par produit', 'Swipe mobile natif', 'Compression automatique', 'Lightbox desktop'],
  },
  {
    icon: BarChart2,
    title: 'Statistiques & analytics',
    description:
      'Suivez vos visites, vos paniers générés et votre taux de conversion semaine après semaine. Comprenez ce qui fonctionne.',
    details: ['Visites par jour', 'Paniers générés', 'Taux de conversion', 'Canal WhatsApp / Telegram'],
  },
  {
    icon: Smartphone,
    title: 'Mobile-first',
    description:
      'Interface conçue avant tout pour les smartphones de vos clients. Navigation rapide, panier fluide, commande en 2 taps.',
    details: ['Optimisé iOS et Android', 'Panier persistant', 'Navigation par swipe', 'Chargement rapide'],
  },
  {
    icon: Zap,
    title: 'Mise en ligne rapide',
    description:
      'Onboarding guidé, interface intuitive. De l\'inscription à votre premier catalogue partagé, comptez moins d\'une heure.',
    details: ['Onboarding guidé', 'Import produits rapide', 'Lien prêt en 1h', 'Support inclus'],
  },
  {
    icon: Shield,
    title: 'Sécurité professionnelle',
    description:
      'Codes hashés en bcrypt, sessions signées, cookies httpOnly. Rate limiting anti-brute-force. Vos données et celles de vos clients sont protégées.',
    details: ['Chiffrement bcrypt', 'Rate limiting', 'Cookies sécurisés', 'Hébergement FR/EU'],
  },
] as const;

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://souqly.fr' },
    { '@type': 'ListItem', position: 2, name: 'Fonctionnalités', item: 'https://souqly.fr/fonctionnalites' },
  ],
};

export default function FonctionnalitesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Hero */}
      <section className="bg-slate-950 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <li><Link href="/" className="hover:text-slate-300">Accueil</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-400">Fonctionnalités</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Fonctionnalités
          </p>
          <h1 className="font-heading mt-3 text-4xl font-bold text-white sm:text-5xl">
            Tout ce dont un marchand WhatsApp a besoin
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Souqly rassemble dans une seule plateforme tout ce qu&apos;il faut pour présenter votre catalogue, gérer l&apos;accès client et recevoir des commandes structurées.
          </p>
        </div>
      </section>

      {/* Liste des fonctionnalités */}
      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, description, details }) => (
              <article
                key={title}
                className="rounded-xl border border-white/10 bg-slate-800/40 p-8"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/15">
                  <Icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
                <ul className="mt-5 grid grid-cols-2 gap-2">
                  {details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABanner headline="Prêt à tester toutes ces fonctionnalités ?" />
    </>
  );
}

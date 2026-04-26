// Server Component — Page À propos
import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Target, Zap } from 'lucide-react';
import CTABanner from '@/components/marketing/CTABanner';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'À propos — L\'équipe derrière Souqly',
  description:
    'Découvrez l\'histoire de Souqly, plateforme catalogue en ligne pour marchands WhatsApp. Notre mission : aider les marchands indépendants francophones à vendre mieux.',
  alternates: { canonical: 'https://souqly.fr/a-propos' },
  robots: { index: true, follow: true },
  openGraph: {
    url: 'https://souqly.fr/a-propos',
    title: 'À propos — L\'équipe derrière Souqly',
    description: 'Notre mission : aider les marchands WhatsApp francophones à vendre mieux.',
    images: [{ url: 'https://souqly.fr/og?type=home', width: 1200, height: 630 }],
  },
};

const VALUES = [
  {
    icon: Heart,
    title: 'Conçu pour les marchands',
    description:
      'Chaque fonctionnalité de Souqly naît d\'une vraie douleur marchande. Pas de fonctionnalités gadgets — uniquement ce qui aide à vendre mieux.',
  },
  {
    icon: Target,
    title: 'Simplicité radicale',
    description:
      'Un marchand qui vend des vêtements n\'a pas à apprendre le code. Notre interface est pensée pour être opérationnelle en moins d\'une heure.',
  },
  {
    icon: Zap,
    title: 'Francophone avant tout',
    description:
      'Interface, support, documentation — tout est en français. Nous construisons la solution que les marchands francophones attendaient.',
  },
] as const;

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://souqly.fr' },
        { '@type': 'ListItem', position: 2, name: 'À propos', item: 'https://souqly.fr/a-propos' },
      ],
    },
    {
      '@type': 'Organization',
      name: 'Souqly',
      url: 'https://souqly.fr',
      foundingDate: '2026',
      description:
        'Souqly est une plateforme SaaS française permettant aux marchands indépendants de créer des catalogues produits en ligne protégés et de recevoir des commandes via WhatsApp.',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'bonjour@souqly.fr',
        contactType: 'customer support',
        availableLanguage: 'French',
      },
    },
  ],
};

export default function AProposPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Hero */}
      <section className="bg-slate-950 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li><Link href="/" className="hover:text-slate-300">Accueil</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-400">À propos</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">À propos</p>
          <h1 className="font-heading mt-3 text-4xl font-bold text-white sm:text-5xl">
            Nous construisons l&apos;outil que les marchands méritent
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Souqly est né d&apos;un constat simple : des milliers de marchands francophones vendent via WhatsApp avec des outils bricolés — photos en vrac, prix dans les commentaires, commandes à la main. Il manquait une vraie solution.
          </p>
        </div>
      </section>

      {/* Histoire */}
      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-heading text-2xl font-bold text-white">Notre histoire</h2>
          <div className="mt-6 space-y-5 text-slate-400 leading-7">
            <p>
              Tout a commencé en observant des marchands de notre entourage gérer leurs ventes WhatsApp avec des captures d&apos;écran, des tableaux Excel et des messages vocaux. L&apos;expérience pour leurs clients était médiocre, et eux-mêmes perdaient un temps considérable à répondre aux mêmes questions.
            </p>
            <p>
              Yupoo, la plateforme chinoise de catalogues photos, était utilisée par beaucoup — mais avec ses limitations : interface en anglais, design daté, aucune intégration WhatsApp native, et des inquiétudes légitimes sur l&apos;hébergement des données en dehors de l&apos;Europe.
            </p>
            <p>
              Nous avons construit Souqly pour combler ce vide : une plateforme 100 % francophone, pensée pour le marché FR/BE/MA/TN, avec une vraie intégration WhatsApp et Telegram, et des données hébergées en Europe.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-slate-950 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-heading mb-12 text-center text-2xl font-bold text-white">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border border-white/10 bg-slate-900/60 p-7">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600/15">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-heading text-2xl font-bold text-white">Notre vision</h2>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            D&apos;ici 2027, nous voulons que chaque marchand francophone qui vend via WhatsApp ait accès à un catalogue professionnel en moins d&apos;une heure, pour un coût inférieur à un repas au restaurant. La professionnalisation du commerce informel francophone passe par des outils adaptés, accessibles et bien pensés.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Des questions ?{' '}
            <a href="mailto:bonjour@souqly.fr" className="text-indigo-400 hover:text-indigo-300">
              bonjour@souqly.fr
            </a>
          </p>
        </div>
      </section>

      <CTABanner headline="Rejoignez les marchands qui vendent mieux avec Souqly" />
    </>
  );
}

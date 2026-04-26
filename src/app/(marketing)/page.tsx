// Server Component — Homepage marketing
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Hero from '@/components/marketing/Hero';
import HowItWorks from '@/components/marketing/HowItWorks';
import ForWho from '@/components/marketing/ForWho';
import Features from '@/components/marketing/Features';
import Comparison from '@/components/marketing/Comparison';
import Pricing from '@/components/marketing/Pricing';
import CTABanner from '@/components/marketing/CTABanner';

// Testimonials : composant interactif (carousel), below-the-fold
// ssr: true pour conserver le HTML dans le rendu serveur (SEO + no CLS)
const Testimonials = dynamic(() => import('@/components/marketing/Testimonials'), {
  ssr: true,
  loading: () => (
    <section className="bg-slate-900 py-20 sm:py-28" aria-hidden="true">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto h-8 max-w-xs animate-pulse rounded-lg bg-slate-800" />
        <div className="mt-14 hidden gap-6 lg:grid lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-800/60" />
          ))}
        </div>
        <div className="mt-14 lg:hidden">
          <div className="h-72 animate-pulse rounded-2xl bg-slate-800/60" />
        </div>
      </div>
    </section>
  ),
});

// FAQ : composant interactif (accordion), below-the-fold
// ssr: true pour les données structurées (questions accessibles aux crawlers)
const FAQ = dynamic(() => import('@/components/marketing/FAQ'), {
  ssr: true,
  loading: () => (
    <section className="bg-slate-900 py-20 sm:py-28" aria-hidden="true">
      <div className="mx-auto max-w-3xl px-5 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-800/40" />
        ))}
      </div>
    </section>
  ),
});

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Souqly — Catalogue en ligne protégé pour marchands WhatsApp',
  description:
    'Créez votre catalogue produit privé, partagez-le à vos clients WhatsApp avec un code d\'accès et recevez des commandes structurées en un clic. 29€/mois, 14j gratuits.',
  keywords: [
    'catalogue en ligne',
    'catalogue WhatsApp',
    'catalogue produit',
    'vente WhatsApp',
    'catalogue privé code accès',
    'marchand WhatsApp',
    'boutique en ligne WhatsApp',
    'Souqly',
  ],
  alternates: {
    canonical: 'https://souqly.fr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  openGraph: {
    url: 'https://souqly.fr',
    title: 'Souqly — Catalogue en ligne protégé pour marchands WhatsApp',
    description:
      'Catalogue produit privé, code d\'accès, commande WhatsApp en 1 clic. 14 jours gratuits.',
    images: [
      {
        url: 'https://souqly.fr/og?type=home',
        width: 1200,
        height: 630,
        alt: 'Souqly — Catalogue en ligne pour marchands WhatsApp',
      },
    ],
  },
  twitter: {
    title: 'Souqly — Catalogue en ligne protégé pour marchands WhatsApp',
    description: 'Catalogue produit privé + commande WhatsApp en 1 clic. 14j gratuits.',
    images: ['https://souqly.fr/og?type=home'],
  },
};

const FAQ_ITEMS = [
  {
    question: 'Ai-je besoin de compétences techniques pour créer mon catalogue ?',
    answer:
      'Non. Souqly est conçu pour être utilisé sans aucune connaissance technique. Interface intuitive, onboarding guidé, catalogue en ligne en moins d\'une heure.',
  },
  {
    question: 'Mes clients ont-ils besoin d\'un compte pour accéder au catalogue ?',
    answer:
      'Non. Vos clients accèdent au catalogue en saisissant simplement le code d\'accès que vous leur communiquez. Aucune inscription, aucun mot de passe à retenir.',
  },
  {
    question: 'Comment mes clients passent-ils commande ?',
    answer:
      'Ils ajoutent les produits au panier, cliquent sur "Commander via WhatsApp" et un message pré-rempli avec tous les détails de leur commande est envoyé directement sur votre numéro WhatsApp.',
  },
  {
    question: 'Puis-je annuler à tout moment ?',
    answer:
      'Oui. Pas d\'engagement, pas de frais de résiliation. Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord ou en nous contactant.',
  },
  {
    question: 'Combien de produits puis-je ajouter ?',
    answer:
      'Le nombre de produits et de catégories est illimité. Ajoutez autant de produits que vous le souhaitez, avec jusqu\'à 10 photos chacun.',
  },
  {
    question: 'Le catalogue fonctionne-t-il aussi avec Telegram ?',
    answer:
      'Oui. Vous pouvez configurer votre numéro WhatsApp ET votre nom d\'utilisateur Telegram. Vos clients choisissent le canal qu\'ils préfèrent pour passer commande.',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Souqly',
      url: 'https://souqly.fr',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Plateforme SaaS pour créer un catalogue produit en ligne protégé par code d\'accès, avec commande directe via WhatsApp ou Telegram.',
      offers: {
        '@type': 'Offer',
        price: '29',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '29',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
      },
      featureList: [
        'Catalogue produit privé',
        'Code d\'accès client',
        'Commande WhatsApp en 1 clic',
        'Commande Telegram',
        'Statistiques marchand',
      ],
    },
    {
      '@type': 'Organization',
      name: 'Souqly',
      url: 'https://souqly.fr',
      logo: 'https://souqly.fr/logo.png',
      sameAs: [
        'https://instagram.com/souqly_fr',
        'https://twitter.com/souqly_fr',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'bonjour@souqly.fr',
        contactType: 'customer support',
        availableLanguage: 'French',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Hero
        headline="Le catalogue en ligne protégé pour marchands WhatsApp"
        subtitle="Créez votre catalogue produit privé, partagez un lien avec code d'accès, et recevez des commandes structurées directement sur WhatsApp ou Telegram."
        badge="200+ marchands actifs en France"
      />
      <HowItWorks />
      <ForWho />
      <Features />
      <Comparison />
      <Testimonials />
      <Pricing />
      <FAQ items={FAQ_ITEMS} />
      <CTABanner />
    </>
  );
}

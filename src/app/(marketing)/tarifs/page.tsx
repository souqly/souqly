// Server Component — Page Tarifs
import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import FAQ from '@/components/marketing/FAQ';
import CTABanner from '@/components/marketing/CTABanner';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Tarifs — Catalogue WhatsApp à 29€/mois | Souqly',
  description:
    'Souqly : catalogue en ligne protégé pour marchands WhatsApp à partir de 29€/mois. 14 jours d\'essai gratuit sans carte bancaire. Tout inclus, sans commission.',
  keywords: [
    'tarif catalogue WhatsApp',
    'prix catalogue en ligne',
    'abonnement catalogue marchand',
    'catalogue WhatsApp pas cher',
    '29 euros catalogue',
  ],
  alternates: { canonical: 'https://souqly.fr/tarifs' },
  robots: { index: true, follow: true },
  openGraph: {
    url: 'https://souqly.fr/tarifs',
    title: 'Tarifs — Catalogue WhatsApp à 29€/mois | Souqly',
    description: '29€/mois tout inclus, 14j gratuits. Catalogue produit privé + commande WhatsApp.',
    images: [{ url: 'https://souqly.fr/og?type=pricing', width: 1200, height: 630 }],
  },
};

const PLAN_FEATURES = [
  'Catalogue illimité (produits & catégories)',
  'Code d\'accès client configurable',
  'Commande WhatsApp & Telegram en 1 clic',
  'Galerie photos HD (jusqu\'à 10/produit)',
  'Template de message personnalisable',
  'Tableau de bord avec statistiques',
  'Lien personnalisé souqly.fr/votre-boutique',
  'Support francophone par email',
  '14 jours d\'essai gratuit, sans CB',
  'Résiliation à tout moment',
] as const;

const COMPARISON_ROWS = [
  { label: 'Produits', souqly: 'Illimité', shopify: 'Illimité', notion: 'Illimité' },
  { label: 'Code d\'accès', souqly: 'Oui', shopify: 'Non', notion: 'Non' },
  { label: 'Commande WhatsApp', souqly: 'Oui', shopify: 'Non', notion: 'Non' },
  { label: 'Commission vente', souqly: '0 %', shopify: '0,5–2 %', notion: '0 %' },
  { label: 'Prix mensuel', souqly: '29€', shopify: 'dès 29€', notion: 'Gratuit*' },
  { label: 'Support francophone', souqly: 'Oui', shopify: 'Partiel', notion: 'Non' },
] as const;

const FAQ_ITEMS = [
  {
    question: 'Que se passe-t-il après les 14 jours gratuits ?',
    answer:
      'À la fin de votre période d\'essai, vous recevez un email pour choisir de continuer avec l\'abonnement à 29€/mois. Si vous ne faites rien, votre compte passe en mode inactif et votre catalogue est suspendu (vos données sont conservées 30 jours).',
  },
  {
    question: 'Puis-je annuler à tout moment ?',
    answer:
      'Oui, sans engagement ni frais. Résiliez directement depuis votre tableau de bord ou écrivez-nous. L\'accès reste actif jusqu\'à la fin de la période facturée.',
  },
  {
    question: 'Y a-t-il des commissions sur mes ventes ?',
    answer:
      'Non. Souqly ne prend aucune commission sur vos ventes. Les commandes passent directement par WhatsApp ou Telegram — nous ne sommes pas intermédiaires dans la transaction.',
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer:
      'Carte bancaire (Visa, Mastercard, American Express) via Stripe. Les paiements sont sécurisés et chiffrés. Facture disponible chaque mois dans votre espace client.',
  },
  {
    question: 'Puis-je changer mon plan plus tard ?',
    answer:
      'Nous n\'avons actuellement qu\'un seul plan tout inclus. Si vous avez des besoins spécifiques (volume très élevé, domaine custom, etc.), contactez-nous pour une offre sur mesure.',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://souqly.fr' },
        { '@type': 'ListItem', position: 2, name: 'Tarifs', item: 'https://souqly.fr/tarifs' },
      ],
    },
    {
      '@type': 'Product',
      name: 'Souqly — Catalogue en ligne marchand',
      description: 'Abonnement mensuel pour créer un catalogue produit privé avec commande WhatsApp.',
      brand: { '@type': 'Brand', name: 'Souqly' },
      offers: {
        '@type': 'Offer',
        price: '29',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: 'https://souqly.fr/inscription',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

export default function TarifsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Hero tarifs */}
      <section className="bg-slate-950 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <li><Link href="/" className="hover:text-slate-300">Accueil</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-400">Tarifs</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Tarifs</p>
          <h1 className="font-heading mt-3 text-4xl font-bold text-white sm:text-5xl">
            29€/mois. Tout inclus.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Un seul plan, tout inclus, sans engagement. Commencez avec 14 jours gratuits — aucune carte bancaire requise.
          </p>
        </div>
      </section>

      {/* Card plan */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-lg px-5">
          <div className="relative rounded-2xl border border-indigo-500/40 bg-slate-800/60 p-8 shadow-xl shadow-indigo-900/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white">
                Accès complet
              </span>
            </div>
            <div className="text-center">
              <p className="font-heading text-5xl font-bold text-white">
                29€
                <span className="ml-1 text-xl font-normal text-slate-400">/mois</span>
              </p>
              <p className="mt-2 text-sm text-slate-400">Résiliable à tout moment · Sans engagement</p>
            </div>
            <ul className="mt-8 space-y-3.5">
              {PLAN_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-sm text-slate-300">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/inscription"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500"
            >
              Commencer — 14 jours gratuits
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-center text-xs text-slate-500">
              Aucune carte bancaire requise pour l&apos;essai
            </p>
          </div>
        </div>
      </section>

      {/* Tableau comparatif */}
      <section className="bg-slate-950 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-heading mb-10 text-center text-2xl font-bold text-white">
            Comparé aux alternatives
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="py-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Critère
                  </th>
                  <th className="bg-indigo-600/15 px-6 py-3 text-center text-sm font-bold text-indigo-300 ring-2 ring-inset ring-indigo-500/20">
                    Souqly
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Shopify
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Notion
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                    <td className="py-3 pr-6 text-slate-300">{row.label}</td>
                    <td className="bg-indigo-600/10 px-6 py-3 text-center font-medium text-white ring-2 ring-inset ring-indigo-500/20">
                      {row.souqly}
                    </td>
                    <td className="px-6 py-3 text-center text-slate-400">{row.shopify}</td>
                    <td className="px-6 py-3 text-center text-slate-400">{row.notion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-slate-600">
              * Notion gratuit sans code d&apos;accès ni panier intégré.
            </p>
          </div>
        </div>
      </section>

      <FAQ items={FAQ_ITEMS} title="Questions sur les tarifs" subtitle="Tout ce que vous devez savoir sur notre abonnement." />
      <CTABanner headline="Commencez votre essai gratuit aujourd'hui" subline="14 jours offerts. Aucune carte bancaire. Annulation facile." />
    </>
  );
}

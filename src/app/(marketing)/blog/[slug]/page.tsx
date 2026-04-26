// Server Component — Article de blog individuel
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  type BlogPost,
} from '@/lib/blog';
import BlogCard from '@/components/marketing/BlogCard';
import CTABanner from '@/components/marketing/CTABanner';

// ISR : regénération toutes les heures
export const revalidate = 3600;

// ---------------------------------------------------------------------------
// generateStaticParams
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Article introuvable | Souqly Blog' };
  }

  return {
    title: `${post.title} | Souqly Blog`,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `https://souqly.fr/blog/${post.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      url: `https://souqly.fr/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ['Souqly'],
      tags: post.tags,
      images: [
        {
          url: `https://souqly.fr/og?type=article&title=${encodeURIComponent(post.title)}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`https://souqly.fr/og?type=article&title=${encodeURIComponent(post.title)}`],
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Détecte si le contenu HTML contient une section FAQ.
 * Cherche un <h2> dont le texte contient "FAQ" ou "questions fréquentes".
 */
function hasFaqSection(content: string): boolean {
  return /<h2[^>]*>[^<]*(?:faq|questions?\s+fr[ée]quentes?)[^<]*<\/h2>/i.test(content);
}

/**
 * Extrait les paires question/réponse d'une section data-faq.
 * Format attendu : <dt data-faq>Question</dt><dd>Réponse</dd>
 * ou <h3 data-faq>Question</h3><p>Réponse</p>
 */
function extractFaqItems(
  content: string,
): Array<{ question: string; answer: string }> {
  const items: Array<{ question: string; answer: string }> = [];
  // Cherche les <dt data-faq="...">Q</dt><dd>A</dd>
  const dtRegex = /<dt[^>]*data-faq[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi;
  let match: RegExpExecArray | null;
  while ((match = dtRegex.exec(content)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, '').trim();
    const answer = match[2].replace(/<[^>]+>/g, '').trim();
    if (question && answer) items.push({ question, answer });
  }
  return items;
}

const CATEGORY_COLORS: Record<string, string> = {
  Guide: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Comparatif: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Fonctionnalité: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Marketing: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
};

// ---------------------------------------------------------------------------
// Composant JSON-LD
// ---------------------------------------------------------------------------
function ArticleJsonLd({ post }: { post: BlogPost }) {
  const faqItems = extractFaqItems(post.content);
  const hasFaq = faqItems.length > 0 || hasFaqSection(post.content);

  const graph: object[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://souqly.fr' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://souqly.fr/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://souqly.fr/blog/${post.slug}`,
        },
      ],
    },
    {
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Organization', name: 'Souqly', url: 'https://souqly.fr' },
      publisher: {
        '@type': 'Organization',
        name: 'Souqly',
        logo: {
          '@type': 'ImageObject',
          url: 'https://souqly.fr/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://souqly.fr/blog/${post.slug}`,
      },
      url: `https://souqly.fr/blog/${post.slug}`,
      keywords: post.tags.join(', '),
    },
  ];

  // Ajoute FAQPage seulement si des items structurés sont détectés
  if (hasFaq && faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqItems.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }

  const ld = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Composant table des matières
// ---------------------------------------------------------------------------
function TableOfContents({ content }: { content: string }) {
  // Extrait les H2 du contenu HTML
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const headings: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = h2Regex.exec(content)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text) headings.push(text);
  }

  if (headings.length === 0) return null;

  return (
    <aside className="mb-10 rounded-xl border border-white/10 bg-slate-800/40 p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Dans cet article
      </p>
      <ol className="space-y-1.5">
        {headings.map((heading, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
            <span className="mt-0.5 flex-shrink-0 text-xs font-medium text-indigo-500">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{heading}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, 3);
  const colorClass =
    CATEGORY_COLORS[post.category] ?? 'bg-slate-500/15 text-slate-300 border-slate-500/30';

  return (
    <>
      <ArticleJsonLd post={post} />

      {/* ------------------------------------------------------------------ */}
      {/* Header article */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-slate-950 pb-12 pt-16 sm:pt-20">
        <div className="mx-auto max-w-3xl px-5">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-slate-300">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-slate-300">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="max-w-[220px] truncate text-slate-400">{post.title}</li>
            </ol>
          </nav>

          {/* Badge catégorie + meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {post.readingTime} min de lecture
            </span>
            <time dateTime={post.date} className="text-xs text-slate-500">
              {formatDate(post.date)}
            </time>
          </div>

          {/* H1 */}
          <h1 className="font-heading mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
            {post.title}
          </h1>

          {/* Extrait chapeau */}
          <p className="mt-5 text-lg leading-8 text-slate-400">{post.excerpt}</p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Corps de l'article */}
      {/* ------------------------------------------------------------------ */}
      <article className="bg-slate-900 py-12">
        <div className="mx-auto max-w-3xl px-5">
          {/* Table des matières extraite des H2 */}
          <TableOfContents content={post.content} />

          {/* Contenu HTML — classes manuelles (sans plugin @tailwindcss/typography) */}
          <div
            className="
              [&_h2]:font-heading [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:leading-snug
              [&_h3]:font-heading [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white
              [&_p]:text-slate-400 [&_p]:leading-7 [&_p]:mb-4
              [&_ul]:mb-5 [&_ul]:space-y-2 [&_ul]:pl-0 [&_ul]:list-none
              [&_ul_li]:flex [&_ul_li]:items-start [&_ul_li]:gap-2 [&_ul_li]:text-slate-400 [&_ul_li]:leading-6
              [&_ul_li]:before:mt-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:w-1.5 [&_ul_li]:before:flex-shrink-0 [&_ul_li]:before:rounded-full [&_ul_li]:before:bg-indigo-500 [&_ul_li]:before:content-['']
              [&_ol]:mb-5 [&_ol]:pl-0 [&_ol]:space-y-2 [&_ol]:list-none [&_ol]:counter-reset-[item]
              [&_ol_li]:flex [&_ol_li]:items-start [&_ol_li]:gap-3 [&_ol_li]:text-slate-400 [&_ol_li]:leading-6
              [&_strong]:text-white [&_strong]:font-semibold
              [&_em]:italic [&_em]:text-slate-300
              [&_a]:text-indigo-400 [&_a]:underline-offset-2 hover:[&_a]:underline
              [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500/50 [&_blockquote]:pl-4 [&_blockquote]:my-6 [&_blockquote]:text-slate-400 [&_blockquote]:italic
              [&_table]:w-full [&_table]:mb-6 [&_table]:text-sm [&_table]:border-collapse
              [&_th]:border [&_th]:border-white/10 [&_th]:bg-slate-800 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-slate-300
              [&_td]:border [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-slate-400
              [&_tr:nth-child(even)_td]:bg-slate-800/30
              [&_.cta-inline]:my-8 [&_.cta-inline]:rounded-lg [&_.cta-inline]:border [&_.cta-inline]:border-indigo-500/30 [&_.cta-inline]:bg-indigo-600/10 [&_.cta-inline]:p-4 [&_.cta-inline]:text-sm [&_.cta-inline]:text-slate-300
              [&_.cta-inline_a]:font-semibold [&_.cta-inline_a]:text-indigo-400 [&_.cta-inline_a]:no-underline hover:[&_.cta-inline_a]:underline
              [&_.faq-section]:mt-10 [&_.faq-section]:border-t [&_.faq-section]:border-white/10 [&_.faq-section]:pt-8
              [&_dl]:space-y-6
              [&_dt]:font-semibold [&_dt]:text-white [&_dt]:mb-1
              [&_dd]:text-slate-400 [&_dd]:leading-7 [&_dd]:ml-0
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA intermédiaire */}
          <div className="my-12 rounded-xl border border-indigo-500/30 bg-indigo-600/10 p-8 text-center">
            <p className="font-heading text-xl font-bold text-white">
              Prêt à créer votre catalogue ?
            </p>
            <p className="mt-2 text-sm text-slate-400">
              14 jours gratuits, aucune carte bancaire requise.
            </p>
            <Link
              href="/inscription"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>

      {/* ------------------------------------------------------------------ */}
      {/* Articles suggérés */}
      {/* ------------------------------------------------------------------ */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-950 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-heading mb-10 text-2xl font-bold text-white">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <div key={related.slug} className="relative">
                  <BlogCard post={related} />
                  <Link
                    href={`/blog/${related.slug}`}
                    className="absolute inset-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label={`Lire : ${related.title}`}
                  />
                </div>
              ))}
            </div>

            {/* Retour au blog */}
            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au blog
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTABanner
        headline="Prêt à professionnaliser votre catalogue ?"
        subline="14 jours offerts, sans carte bancaire."
      />
    </>
  );
}

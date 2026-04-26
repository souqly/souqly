// Server Component — Liste articles de blog
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock } from 'lucide-react';
import { getAllPosts, type BlogPost } from '@/lib/blog';
import BlogCard from '@/components/marketing/BlogCard';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog Souqly — Guides et conseils pour marchands WhatsApp',
  description:
    'Guides, comparatifs et conseils pour les marchands qui vendent via WhatsApp et Telegram. Créer un catalogue, générer des commandes, protéger son catalogue.',
  keywords: [
    'blog catalogue whatsapp',
    'guide vente whatsapp',
    'conseils marchands',
    'catalogue en ligne blog',
  ],
  alternates: { canonical: 'https://souqly.fr/blog' },
  robots: { index: true, follow: true },
  openGraph: {
    url: 'https://souqly.fr/blog',
    title: 'Blog Souqly — Guides et conseils pour marchands WhatsApp',
    description: 'Guides et conseils pour vendre mieux via WhatsApp avec un catalogue professionnel.',
    images: [{ url: 'https://souqly.fr/og?type=blog', width: 1200, height: 630 }],
  },
};

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------
const CATEGORIES = ['Tous', 'Guide', 'Comparatif', 'Fonctionnalité', 'Marketing'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Guide: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Comparatif: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Fonctionnalité: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Marketing: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
};

// ---------------------------------------------------------------------------
// Hero Card (premier article)
// ---------------------------------------------------------------------------
function HeroCard({ post }: { post: BlogPost }) {
  const badgeClass =
    CATEGORY_COLORS[post.category] ?? 'bg-slate-500/15 text-slate-300 border-slate-500/30';

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 transition-all duration-200 hover:border-indigo-500/40 hover:bg-slate-900">
      {/* Image placeholder pleine largeur */}
      <div
        className="aspect-[21/9] w-full overflow-hidden bg-gradient-to-br from-slate-800 via-slate-800 to-indigo-950/40"
        aria-hidden="true"
      >
        <div className="flex h-full items-center justify-center">
          <BookOpen className="h-16 w-16 text-slate-600" aria-hidden="true" />
        </div>
      </div>

      <div className="p-8 sm:p-10">
        {/* Badge + temps de lecture */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
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

        {/* Titre */}
        <h2 className="font-heading mt-4 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-indigo-300 sm:text-3xl">
          <Link
            href={`/blog/${post.slug}`}
            className="focus-visible:outline-none"
          >
            <span
              className="absolute inset-0 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              aria-hidden="true"
            />
            {post.title}
          </Link>
        </h2>

        {/* Extrait complet */}
        <p className="mt-4 text-base leading-7 text-slate-400">{post.excerpt}</p>

        <span
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors group-hover:text-indigo-300"
          aria-hidden="true"
        >
          Lire l&apos;article &rarr;
        </span>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allPosts = getAllPosts();

  // Filtre côté serveur via searchParam ?category=
  const activeCategory = searchParams.category ?? 'Tous';
  const filteredPosts =
    activeCategory === 'Tous'
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  const heroPosts = filteredPosts.slice(0, 1);
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* ------------------------------------------------------------------ */}
      {/* Section titre */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-slate-950 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-slate-300">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-400">Blog</li>
            </ol>
          </nav>

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Blog Souqly
          </p>
          <h1 className="font-heading mt-3 text-4xl font-bold text-white sm:text-5xl">
            Guides, comparatifs et conseils
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Tout ce que vous devez savoir pour créer votre catalogue en ligne et générer plus de
            commandes via WhatsApp.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Filtres catégories (côté serveur) */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b border-white/10 bg-slate-900 py-6">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap gap-2" role="list" aria-label="Filtres par catégorie">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <Link
                  key={cat}
                  href={cat === 'Tous' ? '/blog' : `/blog?category=${cat}`}
                  role="listitem"
                  className={[
                    'rounded-full border px-4 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-medium'
                      : 'border-white/15 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:text-indigo-300',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Hero card — premier article */}
      {/* ------------------------------------------------------------------ */}
      {heroPosts.length > 0 && (
        <section className="pt-14 sm:pt-20">
          <div className="mx-auto max-w-6xl px-5">
            <HeroCard post={heroPosts[0]} />
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Grille articles (2e au 6e) */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-slate-500">
              Aucun article dans cette catégorie pour le moment.
            </p>
          ) : gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <div key={post.slug} className="relative">
                  <BlogCard post={post} />
                  <Link
                    href={`/blog/${post.slug}`}
                    className="absolute inset-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    aria-label={`Lire : ${post.title}`}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

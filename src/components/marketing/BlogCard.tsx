// Server Component
import Link from 'next/link';
import { BookOpen, Clock } from 'lucide-react';
import type { BlogPost, BlogCategory } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
}

const CATEGORY_STYLES: Record<BlogCategory, string> = {
  Guide: 'bg-indigo-500/15 text-indigo-300',
  Comparatif: 'bg-amber-500/15 text-amber-300',
  Fonctionnalité: 'bg-emerald-500/15 text-emerald-300',
  Marketing: 'bg-violet-500/15 text-violet-300',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogCard({ post }: BlogCardProps) {
  const badgeClass = CATEGORY_STYLES[post.category] ?? 'bg-slate-500/15 text-slate-300';

  return (
    <article className="group relative flex flex-col rounded-xl border border-white/10 bg-slate-900/60 transition-all duration-200 hover:border-indigo-500/40 hover:bg-slate-900">
      {/* Placeholder image 16:9 */}
      <div
        className="aspect-video w-full overflow-hidden rounded-t-xl bg-slate-800"
        aria-hidden="true"
      >
        <div className="flex h-full items-center justify-center">
          <BookOpen className="h-10 w-10 text-slate-600" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Badge catégorie + temps de lecture */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
          >
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{post.readingTime} min de lecture</span>
          </span>
        </div>

        {/* Titre H2 — 2 lignes max */}
        <h2 className="font-heading mt-3 line-clamp-2 text-base font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-indigo-300">
          {/*
           * Le lien couvre toute la carte via ::after absolu (pattern card clickable).
           * L'élément <a> doit avoir focus-visible pour l'accessibilité clavier.
           */}
          <Link
            href={`/blog/${post.slug}`}
            className="focus-visible:outline-none"
          >
            <span
              className="absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              aria-hidden="true"
            />
            {post.title}
          </Link>
        </h2>

        {/* Extrait — 2 lignes max */}
        <p className="mt-2 flex-1 line-clamp-2 text-sm leading-6 text-slate-400">
          {post.excerpt}
        </p>

        {/* Footer : date + lien explicite */}
        <div className="mt-4 flex items-center justify-between">
          <time
            dateTime={post.date}
            className="text-xs text-slate-500"
          >
            {formatDate(post.date)}
          </time>
          <span
            className="text-xs font-medium text-indigo-400 transition-colors duration-200 group-hover:text-indigo-300"
            aria-hidden="true"
          >
            Lire l&apos;article &rarr;
          </span>
        </div>
      </div>
    </article>
  );
}

import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/lib/types/catalog'

interface CategoryCardProps {
  category: Category
  merchantSlug: string
}

export function CategoryCard({ category, merchantSlug }: CategoryCardProps) {
  const initial = category.name.charAt(0).toUpperCase()

  return (
    <Link
      href={`/${merchantSlug}/catalogue?cat=${category.slug}`}
      className={[
        'group block bg-slate-800 rounded-lg overflow-hidden',
        'border border-slate-700 hover:border-slate-600',
        'hover:bg-slate-700 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
      ].join(' ')}
      aria-label={`Voir la catégorie ${category.name} (${category.product_count} article${category.product_count > 1 ? 's' : ''})`}
    >
      {/* Image cover 16:9 */}
      <div className="relative aspect-video overflow-hidden bg-slate-700">
        {category.cover_image_url ? (
          <Image
            src={category.cover_image_url}
            alt={`Couverture de la catégorie ${category.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        ) : (
          /* Fallback : dégradé slate avec initiale */
          <div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800"
            aria-hidden="true"
          >
            <span className="text-4xl font-bold text-slate-400 select-none font-heading">
              {initial}
            </span>
          </div>
        )}

        {/* Overlay subtle au hover */}
        <div
          className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-200"
          aria-hidden="true"
        />
      </div>

      {/* Informations catégorie */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-slate-50 leading-snug group-hover:text-indigo-300 transition-colors duration-200">
          {category.name}
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">
          {category.product_count === 0
            ? 'Aucun article'
            : `${category.product_count} article${category.product_count > 1 ? 's' : ''}`}
        </p>
      </div>
    </Link>
  )
}

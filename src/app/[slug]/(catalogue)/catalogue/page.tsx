import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { CatalogData, CatalogResult, Category, Product } from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

function storageUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ cat?: string }>
}

// ---------------------------------------------------------------------------
// Metadata dynamique
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('merchants')
    .select('name')
    .eq('slug', slug)
    .single<{ name: string }>()

  return {
    title: data ? `Catalogue — ${data.name}` : 'Catalogue',
    robots: { index: false, follow: false },
  }
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

/**
 * Page catalogue — Server Component.
 *
 * Les données sont déjà chargées par le layout parent (CatalogueLayout)
 * et injectées dans le CatalogProvider. Comme cette page est un Server Component,
 * elle ne peut pas utiliser le context directement.
 *
 * Stratégie : re-fetcher depuis les cookies + RPC (les données sont déjà en cache
 * Next.js grâce au fetch deduplication dans la même requête).
 *
 * Note architecture : dans App Router, les Server Components ne peuvent pas lire
 * un React Context. Le layout injecte CatalogProvider pour les Client Components
 * enfants. Pour ce Server Component, on récupère les données via la même RPC
 * (fetch dédupliqué automatiquement par Next.js dans la même request pipeline).
 */
export default async function CataloguePage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { cat: categoryFilter } = await searchParams

  // Récupération des données (dédupliquée avec l'appel du layout)
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(`catalog_session_${slug}`)?.value

  if (!sessionToken) {
    redirect(`/${slug}`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_catalog', {
    merchant_slug: slug,
    p_session_token: sessionToken,
  })

  if (error || !data || 'error' in (data as CatalogResult)) {
    redirect(`/${slug}`)
  }

  const { merchant, categories, products } = data as CatalogData

  // Filtre par catégorie si searchParam présent
  const filteredProducts = categoryFilter
    ? products.filter((p) => {
        const cat = categories.find((c) => c.slug === categoryFilter)
        return cat ? p.category_id === cat.id : true
      })
    : products

  // Produits disponibles uniquement
  const availableProducts = filteredProducts.filter((p) => p.is_available)

  // Enregistrement de la visite (fire and forget)
  void (async () => {
    await supabase
      .from('catalog_visits')
      .insert({ merchant_id: merchant.id, has_unlocked: true })
  })().catch(() => {})

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Header catalogue */}
      <div className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">{merchant.name}</h1>
          <a
            href={`/${slug}/panier`}
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Panier
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Filtres par catégorie */}
        {categories.length > 0 && (
          <Suspense fallback={<CategoryFilterSkeleton count={categories.length} />}>
            <CategoryFilters
              categories={categories}
              activeSlug={categoryFilter}
              merchantSlug={slug}
            />
          </Suspense>
        )}

        {/* Grille catégories (uniquement si pas de filtre actif) */}
        {!categoryFilter && categories.length > 0 && (
          <section aria-label="Catégories">
            <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
              Catégories
            </h2>
            <Suspense fallback={<GridSkeleton count={categories.length} />}>
              <CategoryGrid categories={categories} merchantSlug={slug} />
            </Suspense>
          </section>
        )}

        {/* Grille produits */}
        <section aria-label="Produits">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
              {categoryFilter
                ? categories.find((c) => c.slug === categoryFilter)?.name ?? 'Produits'
                : 'Tous les produits'}
            </h2>
            <span className="text-xs text-neutral-600">
              {availableProducts.length} article{availableProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {availableProducts.length === 0 ? (
            <EmptyState message="Aucun produit disponible dans cette catégorie." />
          ) : (
            <Suspense fallback={<GridSkeleton count={Math.min(availableProducts.length, 8)} />}>
              <ProductGrid products={availableProducts} merchantSlug={slug} />
            </Suspense>
          )}
        </section>
      </div>
    </main>
  )
}

// ---------------------------------------------------------------------------
// Sous-composants Server
// ---------------------------------------------------------------------------

function CategoryFilters({
  categories,
  activeSlug,
  merchantSlug,
}: {
  categories: Category[]
  activeSlug?: string
  merchantSlug: string
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <a
        href={`/${merchantSlug}/catalogue`}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          !activeSlug
            ? 'bg-white text-neutral-950'
            : 'bg-neutral-800 text-neutral-400 hover:text-white'
        }`}
      >
        Tous
      </a>
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`/${merchantSlug}/catalogue?cat=${cat.slug}`}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeSlug === cat.slug
              ? 'bg-white text-neutral-950'
              : 'bg-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          {cat.name}
          {cat.product_count > 0 && (
            <span className="ml-1 opacity-60">({cat.product_count})</span>
          )}
        </a>
      ))}
    </div>
  )
}

function CategoryGrid({
  categories,
  merchantSlug,
}: {
  categories: Category[]
  merchantSlug: string
}) {
  // Tente d'importer le composant ui-designer, sinon fallback inline
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`/${merchantSlug}/catalogue?cat=${cat.slug}`}
          className="group block rounded-xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-white/20 transition-colors"
        >
          <div className="aspect-square bg-neutral-800 relative overflow-hidden">
            {cat.cover_image_url ? (
              <Image
                src={cat.cover_image_url}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-3xl font-bold text-neutral-700">
                  {cat.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-white truncate">{cat.name}</p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {cat.product_count} produit{cat.product_count !== 1 ? 's' : ''}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}

function ProductGrid({
  products,
  merchantSlug,
}: {
  products: Product[]
  merchantSlug: string
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => {
        const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0]
        return (
          <a
            key={product.id}
            href={`/${merchantSlug}/produit/${product.id}`}
            className="group block rounded-xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-white/20 transition-colors"
          >
            <div className="aspect-square bg-neutral-800 relative overflow-hidden">
              {primaryImage ? (
                <Image
                  src={storageUrl(primaryImage.storage_path)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-neutral-700">?</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{product.name}</p>
              {product.reference && (
                <p className="text-xs text-neutral-600 mt-0.5 font-mono">{product.reference}</p>
              )}
              <p className="text-sm font-semibold text-white mt-1">
                {formatPrice(product.price_cents)}
              </p>
            </div>
          </a>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function GridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-neutral-900 border border-white/5 animate-pulse">
          <div className="aspect-square bg-neutral-800" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-neutral-800 rounded w-3/4" />
            <div className="h-3 bg-neutral-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CategoryFilterSkeleton({ count }: { count: number }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: count + 1 }).map((_, i) => (
        <div key={i} className="h-7 w-20 rounded-full bg-neutral-800 animate-pulse" />
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-neutral-500 text-sm">{message}</p>
    </div>
  )
}

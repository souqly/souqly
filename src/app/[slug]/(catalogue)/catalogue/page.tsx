import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type {
  CatalogData,
  CatalogResult,
  CatalogMerchant,
  Category,
  Product,
} from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'
import { CartBadge } from '../_components/CartBadge'
import { QuickAddButton } from '../_components/QuickAddButton'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

function storageUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
}

function truncate(str: string, n: number): string {
  return str.length > n ? `${str.slice(0, n).trimEnd()}…` : str
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('merchants')
    .select('name, description')
    .eq('slug', slug)
    .single<{ name: string; description: string | null }>()

  return {
    title: data ? `Catalogue — ${data.name}` : 'Catalogue',
    description: data?.description ?? undefined,
    robots: { index: false, follow: false },
  }
}

// ---------------------------------------------------------------------------
// Page principale (Server Component)
// ---------------------------------------------------------------------------

export default async function CataloguePage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { cat: categoryFilter } = await searchParams

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

  // Filtre catégorie
  const filteredProducts = categoryFilter
    ? products.filter((p) => {
        const cat = categories.find((c) => c.slug === categoryFilter)
        return cat ? p.category_id === cat.id : true
      })
    : products

  const availableProducts = filteredProducts.filter((p) => p.is_available)
  const totalAvailable = products.filter((p) => p.is_available).length

  // Visite (fire and forget)
  void (async () => {
    await supabase
      .from('catalog_visits')
      .insert({ merchant_id: merchant.id, has_unlocked: true })
  })().catch(() => {})

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* ================================================================
          Header marchand enrichi (sticky)
          ================================================================ */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="shrink-0">
            <MerchantAvatar merchant={merchant} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">
              {merchant.name}
            </p>
            {merchant.description && (
              <p className="text-xs text-neutral-400 leading-tight truncate">
                {truncate(merchant.description, 60)}
              </p>
            )}
          </div>
          <CartBadge merchantSlug={slug} />
        </div>
      </header>

      {/* ================================================================
          Hero / Banner marque
          ================================================================ */}
      <section
        className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-indigo-950/30 border-b border-white/5 py-10 px-4"
        aria-label={`Boutique ${merchant.name}`}
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-4">
          <MerchantAvatar merchant={merchant} size="lg" />

          <h1 className="text-2xl font-bold text-white">{merchant.name}</h1>

          {merchant.description && (
            <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
              {merchant.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            {merchant.whatsapp_number && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/30 text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
                WhatsApp disponible
              </span>
            )}
            {merchant.telegram_username && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-700/30 text-blue-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" aria-hidden="true" />
                Telegram disponible
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/80 border border-white/10 text-neutral-300 text-xs font-medium">
              {totalAvailable} article{totalAvailable !== 1 ? 's' : ''} disponible{totalAvailable !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================
          Contenu principal
          ================================================================ */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Filtres catégories */}
        {categories.length > 0 && (
          <Suspense fallback={<CategoryFilterSkeleton count={categories.length} />}>
            <CategoryFilters
              categories={categories}
              activeSlug={categoryFilter}
              merchantSlug={slug}
              totalAvailable={totalAvailable}
            />
          </Suspense>
        )}

        {/* Grille catégories (uniquement si aucun filtre actif) */}
        {!categoryFilter && categories.length > 0 && (
          <section aria-label="Catégories">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">
              Catégories
            </h2>
            <Suspense fallback={<GridSkeleton count={categories.length} aspect="square" />}>
              <CategoryGrid categories={categories} merchantSlug={slug} />
            </Suspense>
          </section>
        )}

        {/* Grille produits */}
        <section aria-label="Produits">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
              {categoryFilter
                ? (categories.find((c) => c.slug === categoryFilter)?.name ?? 'Produits')
                : 'Tous les produits'}
            </h2>
            <span className="text-xs text-neutral-600 tabular-nums">
              {availableProducts.length} article{availableProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {availableProducts.length === 0 ? (
            <EmptyState merchantSlug={slug} hasCategoryFilter={!!categoryFilter} />
          ) : (
            <Suspense
              fallback={<GridSkeleton count={Math.min(availableProducts.length, 8)} aspect="portrait" />}
            >
              <ProductGrid products={availableProducts} merchantSlug={slug} />
            </Suspense>
          )}
        </section>
      </div>

      {/* ================================================================
          Footer catalogue
          ================================================================ */}
      <footer className="py-8 text-center">
        <p className="text-xs text-neutral-700">Propulsé par Souqly</p>
      </footer>
    </main>
  )
}

// ---------------------------------------------------------------------------
// MerchantAvatar — Server Component
// ---------------------------------------------------------------------------

function MerchantAvatar({
  merchant,
  size,
}: {
  merchant: CatalogMerchant
  size: 'sm' | 'lg'
}) {
  const dimension = size === 'lg' ? 64 : 40
  const textClass = size === 'lg' ? 'text-xl font-bold' : 'text-sm font-semibold'
  const containerClass = size === 'lg' ? 'w-16 h-16 rounded-2xl' : 'w-10 h-10 rounded-xl'

  if (merchant.logo_url) {
    return (
      <div className={`relative overflow-hidden shrink-0 ${containerClass} border border-white/10`}>
        <Image
          src={merchant.logo_url}
          alt={`Logo ${merchant.name}`}
          width={dimension}
          height={dimension}
          className="object-cover w-full h-full"
          priority={size === 'lg'}
        />
      </div>
    )
  }

  return (
    <div
      className={`shrink-0 flex items-center justify-center bg-indigo-600 ${containerClass}`}
      aria-hidden="true"
    >
      <span className={`text-white ${textClass}`}>{initials(merchant.name)}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CategoryFilters — Server Component
// ---------------------------------------------------------------------------

function CategoryFilters({
  categories,
  activeSlug,
  merchantSlug,
  totalAvailable,
}: {
  categories: Category[]
  activeSlug?: string
  merchantSlug: string
  totalAvailable: number
}) {
  return (
    <nav
      aria-label="Filtrer par catégorie"
      className="overflow-x-auto scrollbar-hide -mx-4 px-4"
    >
      <div className="flex gap-2 flex-nowrap w-max">
        <a
          href={`/${merchantSlug}/catalogue`}
          aria-current={!activeSlug ? 'page' : undefined}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            !activeSlug
              ? 'bg-white text-neutral-950 font-semibold shadow-sm'
              : 'bg-neutral-800/60 border border-white/5 text-neutral-400 hover:text-white hover:border-indigo-500/30'
          }`}
        >
          Tous
          <span className="tabular-nums text-neutral-600">{totalAvailable}</span>
        </a>

        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/${merchantSlug}/catalogue?cat=${cat.slug}`}
            aria-current={activeSlug === cat.slug ? 'page' : undefined}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeSlug === cat.slug
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'bg-neutral-800/60 border border-white/5 text-neutral-400 hover:text-white hover:border-indigo-500/30'
            }`}
          >
            {cat.name}
            <span className="tabular-nums text-neutral-600">{cat.product_count}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// CategoryGrid — Server Component
// ---------------------------------------------------------------------------

function CategoryGrid({
  categories,
  merchantSlug,
}: {
  categories: Category[]
  merchantSlug: string
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`/${merchantSlug}/catalogue?cat=${cat.slug}`}
          className="group block rounded-xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-950/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-900/30 to-neutral-800">
            {cat.cover_image_url ? (
              <Image
                src={cat.cover_image_url}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-bold text-neutral-700" aria-hidden="true">
                  {cat.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Gradient overlay bas */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Nom en overlay */}
            <p className="absolute bottom-2 left-3 text-sm font-semibold text-white drop-shadow-sm leading-tight">
              {cat.name}
            </p>

            {/* Badge count */}
            <span
              className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-0.5 text-xs text-white tabular-nums"
              aria-label={`${cat.product_count} produit${cat.product_count !== 1 ? 's' : ''}`}
            >
              {cat.product_count}
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProductGrid — Server Component
// ---------------------------------------------------------------------------

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
        const primaryImage =
          product.images.find((img) => img.is_primary) ?? product.images[0]
        const imageUrl = primaryImage ? storageUrl(primaryImage.storage_path) : null
        return (
          <ProductCard
            key={product.id}
            product={product}
            merchantSlug={merchantSlug}
            imageUrl={imageUrl}
          />
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProductCard — Server Component avec QuickAddButton Client
// ---------------------------------------------------------------------------

function ProductCard({
  product,
  merchantSlug,
  imageUrl,
}: {
  product: Product
  merchantSlug: string
  imageUrl: string | null
}) {
  return (
    <article className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-950/20 transition-all duration-200">
      <a
        href={`/${merchantSlug}/produit/${product.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset"
        aria-label={`Voir le produit ${product.name}`}
      >
        {/* Image portrait 3:4 */}
        <div className="aspect-[3/4] relative overflow-hidden bg-neutral-800">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/20 to-neutral-800">
              <span className="text-4xl font-bold text-neutral-700" aria-hidden="true">?</span>
            </div>
          )}

          {/* Overlay hover */}
          <div
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            aria-hidden="true"
          >
            <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium">
              Voir le produit
            </span>
          </div>
        </div>
      </a>

      {/* Infos produit */}
      <div className="p-3 flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-medium text-white leading-snug line-clamp-2"
          >
            {product.name}
          </p>
          {product.reference && (
            <p className="text-xs font-mono text-neutral-600 mt-0.5 truncate">
              {product.reference}
            </p>
          )}
          <p className="text-base font-bold text-white mt-1 tabular-nums">
            {formatPrice(product.price_cents)}
          </p>
        </div>
        <QuickAddButton product={product} merchantSlug={merchantSlug} imageUrl={imageUrl} />
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

function EmptyState({
  merchantSlug,
  hasCategoryFilter,
}: {
  merchantSlug: string
  hasCategoryFilter: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <Package className="w-12 h-12 text-neutral-700" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm text-neutral-400 font-medium">
          {hasCategoryFilter
            ? 'Aucun produit disponible dans cette catégorie.'
            : 'Aucun produit disponible pour le moment.'}
        </p>
        <p className="text-xs text-neutral-600">
          Revenez prochainement ou explorez d&apos;autres catégories.
        </p>
      </div>
      {hasCategoryFilter && (
        <a
          href={`/${merchantSlug}/catalogue`}
          className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
        >
          Voir tous les produits
        </a>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function GridSkeleton({ count, aspect }: { count: number; aspect: 'square' | 'portrait' }) {
  const aspectClass = aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden bg-neutral-900 border border-white/5 animate-pulse"
          aria-hidden="true"
        >
          <div className={`${aspectClass} bg-neutral-800`} />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-neutral-800 rounded-full w-3/4" />
            <div className="h-3 bg-neutral-800 rounded-full w-1/2" />
            <div className="h-4 bg-neutral-800 rounded-full w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CategoryFilterSkeleton({ count }: { count: number }) {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: count + 1 }).map((_, i) => (
        <div
          key={i}
          className="h-7 w-20 shrink-0 rounded-full bg-neutral-800 animate-pulse"
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

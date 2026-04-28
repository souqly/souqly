import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { CatalogData, CatalogResult, Product } from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'
import { AddToCartButton } from './_components/AddToCartButton'
import { ImageGallery } from './_components/ImageGallery'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string; id: string }>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getCatalogData(slug: string, sessionToken: string): Promise<CatalogData | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_catalog', {
    merchant_slug: slug,
    p_session_token: sessionToken,
  })

  if (error || !data) return null
  const result = data as CatalogResult
  if ('error' in result) return null
  return result as CatalogData
}

// ---------------------------------------------------------------------------
// Metadata dynamique
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(`catalog_session_${slug}`)?.value

  if (!sessionToken) return { title: 'Produit — Souqly' }

  const catalogData = await getCatalogData(slug, sessionToken)
  if (!catalogData) return { title: 'Produit — Souqly' }

  const product = catalogData.products.find((p) => p.id === id)
  if (!product) return { title: 'Produit introuvable — Souqly' }

  return {
    title: `${product.name} — ${catalogData.merchant.name}`,
    description: product.description ?? `${product.name} — ${formatPrice(product.price_cents)}`,
    robots: { index: false, follow: false },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * Page détail produit — Server Component.
 *
 * Récupère le produit depuis CatalogData (via RPC, dédupliqué avec le layout).
 * Le bouton "Ajouter au panier" est un Client Component isolé.
 */
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, id } = await params

  // Récupération de la session
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(`catalog_session_${slug}`)?.value

  if (!sessionToken) {
    redirect(`/${slug}`)
  }

  const catalogData = await getCatalogData(slug, sessionToken)
  if (!catalogData) {
    redirect(`/${slug}`)
  }

  const product: Product | undefined = catalogData.products.find((p) => p.id === id)
  if (!product) {
    notFound()
  }

  // Images triées par position, la principale en premier
  const sortedImages = [...product.images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return a.position - b.position
  })

  const primaryImage = sortedImages[0]

  // Catégorie du produit
  const category = product.category_id
    ? catalogData.categories.find((c) => c.id === product.category_id)
    : null

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Breadcrumb */}
      <div className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-neutral-500">
          <a href={`/${slug}/catalogue`} className="hover:text-white transition-colors">
            Catalogue
          </a>
          {category && (
            <>
              <span>/</span>
              <a
                href={`/${slug}/catalogue?cat=${category.slug}`}
                className="hover:text-white transition-colors"
              >
                {category.name}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Galerie images — Client Component interactif */}
          <ImageGallery
            images={sortedImages}
            productName={product.name}
            storageBaseUrl={SUPABASE_URL}
          />

          {/* Infos produit */}
          <div className="flex flex-col gap-6">
            {/* En-tête */}
            <div>
              {category && (
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  {category.name}
                </span>
              )}
              <h1 className="mt-1 text-2xl font-bold text-white">{product.name}</h1>
              {product.reference && (
                <p className="mt-1 text-sm font-mono text-neutral-500">Réf. {product.reference}</p>
              )}
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {formatPrice(product.price_cents)}
              </span>
            </div>

            {/* Disponibilité */}
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  product.is_available ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                aria-hidden="true"
              />
              <span className="text-sm text-neutral-400">
                {product.is_available ? 'En stock' : 'Indisponible'}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm prose-invert max-w-none">
                <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Bouton Ajouter au panier (Client Component) */}
            {product.is_available && (
              <AddToCartButton
                product={product}
                merchantSlug={slug}
                primaryImageUrl={primaryImage?.storage_path ?? null}
              />
            )}

            {!product.is_available && (
              <div className="rounded-xl bg-neutral-900 border border-white/5 px-4 py-3 text-sm text-neutral-500">
                Ce produit est actuellement indisponible.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

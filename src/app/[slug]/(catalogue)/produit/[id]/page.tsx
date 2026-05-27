import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { CatalogData, CatalogResult, Product } from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'
import { AddToCartButton } from './_components/AddToCartButton'
import { ImageGallery } from './_components/ImageGallery'
import { DeliveryInfo } from './_components/DeliveryInfo'
import { RelatedProducts } from './_components/RelatedProducts'
import { StickyMobileCTA } from './_components/StickyMobileCTA'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

interface PageProps {
  params: Promise<{ slug: string; id: string }>
}

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

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, id } = await params

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(`catalog_session_${slug}`)?.value
  if (!sessionToken) redirect(`/${slug}`)

  const catalogData = await getCatalogData(slug, sessionToken)
  if (!catalogData) redirect(`/${slug}`)

  const product: Product | undefined = catalogData.products.find((p) => p.id === id)
  if (!product) notFound()

  const sortedImages = [...product.images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return a.position - b.position
  })

  const primaryImage = sortedImages[0]

  const category = product.category_id
    ? catalogData.categories.find((c) => c.id === product.category_id)
    : null

  const brand = product.brand_id
    ? catalogData.brands.find((b) => b.id === product.brand_id)
    : null

  // Produits similaires : même catégorie en priorité, sinon toute la liste
  const relatedPool = category
    ? catalogData.products.filter((p) => p.category_id === product.category_id)
    : catalogData.products

  return (
    <main className="min-h-screen bg-[var(--ct-bg)] text-[var(--ct-text)] pb-20 md:pb-0">
      {/* Breadcrumb sticky */}
      <div className="border-b border-[var(--ct-border)] backdrop-blur-sm sticky top-0 z-10" style={{ backgroundColor: 'color-mix(in srgb, var(--ct-surface) 80%, transparent)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[var(--ct-text-muted)]">
          <a href={`/${slug}/catalogue`} className="hover:text-[var(--ct-text)] transition-colors">
            Catalogue
          </a>
          {category && (
            <>
              <span>/</span>
              <a
                href={`/${slug}/catalogue?cat=${category.slug}`}
                className="hover:text-[var(--ct-text)] transition-colors"
              >
                {category.name}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-[var(--ct-text)] truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Galerie — lightbox + swipe inclus */}
          <ImageGallery
            images={sortedImages}
            productName={product.name}
            storageBaseUrl={SUPABASE_URL}
          />

          {/* Infos produit */}
          <div className="flex flex-col gap-5">
            {/* Badges catégorie + marque */}
            {(category || brand) && (
              <div className="flex items-center gap-2 flex-wrap">
                {category && (
                  <a
                    href={`/${slug}/catalogue?cat=${category.slug}`}
                    className="inline-flex items-center text-xs font-medium text-[var(--ct-text-muted)] bg-[var(--ct-surface)] hover:border-[var(--ct-primary)] border border-[var(--ct-border)] rounded-full px-3 py-1 transition-colors"
                  >
                    {category.name}
                  </a>
                )}
                {brand && (
                  <a
                    href={`/${slug}/catalogue?brand=${brand.slug}`}
                    className="inline-flex items-center text-xs font-medium text-[var(--ct-primary)] border border-[var(--ct-primary)] rounded-full px-3 py-1 transition-colors hover:opacity-80"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--ct-primary) 12%, transparent)' }}
                  >
                    {brand.name}
                  </a>
                )}
              </div>
            )}

            {/* Nom + référence */}
            <div>
              <h1 className="text-2xl font-bold text-[var(--ct-text)] leading-snug">{product.name}</h1>
              {product.reference && (
                <p className="mt-1 text-sm font-mono text-[var(--ct-text-muted)]">Réf. {product.reference}</p>
              )}
            </div>

            {/* Prix + disponibilité */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-[var(--ct-text)]">
                {formatPrice(product.price_cents)}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    product.is_available ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-sm text-[var(--ct-text-muted)]">
                  {product.is_available ? 'En stock' : 'Indisponible'}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm prose-invert max-w-none">
                <p className="text-[var(--ct-text-muted)] leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* CTA panier */}
            {product.is_available ? (
              <AddToCartButton
                product={product}
                merchantSlug={slug}
                primaryImageUrl={primaryImage?.storage_path ?? null}
              />
            ) : (
              <div className="rounded-xl bg-[var(--ct-surface)] border border-[var(--ct-border)] px-4 py-3 text-sm text-[var(--ct-text-muted)]">
                Ce produit est actuellement indisponible.
              </div>
            )}

            {/* Livraison + WhatsApp / Telegram */}
            <DeliveryInfo merchant={catalogData.merchant} product={product} />
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      <RelatedProducts
        products={relatedPool}
        currentProductId={product.id}
        merchantSlug={slug}
        categoryName={category?.name}
      />

      {/* Barre sticky mobile */}
      <StickyMobileCTA
        product={product}
        merchantSlug={slug}
        primaryStoragePath={primaryImage?.storage_path ?? null}
      />
    </main>
  )
}

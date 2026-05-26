import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/format'
import type { Product } from '@/lib/types/catalog'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

function storageUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
}

interface RelatedProductsProps {
  products: Product[]
  currentProductId: string
  merchantSlug: string
  categoryName?: string
}

export function RelatedProducts({
  products,
  currentProductId,
  merchantSlug,
  categoryName,
}: RelatedProductsProps) {
  const related = products
    .filter((p) => p.id !== currentProductId && p.is_available)
    .slice(0, 6)

  if (related.length === 0) return null

  return (
    <section className="border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-base font-semibold text-white mb-5">
          {categoryName ? `Autres articles — ${categoryName}` : 'Vous aimerez aussi'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {related.map((product) => {
            const primaryImage =
              product.images.find((img) => img.is_primary) ?? product.images[0]
            return (
              <Link
                key={product.id}
                href={`/${merchantSlug}/produit/${product.id}`}
                className="group flex flex-col gap-2"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/5 group-hover:border-white/20 transition-colors">
                  {primaryImage ? (
                    <Image
                      src={storageUrl(primaryImage.storage_path)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl text-neutral-700">?</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-white font-medium truncate">{product.name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {formatPrice(product.price_cents)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

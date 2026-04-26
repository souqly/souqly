import Link from 'next/link'
import Image from 'next/image'
import { Package } from 'lucide-react'
import type { Product } from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'

interface ProductCardProps {
  product: Product
  merchantSlug: string
}

export function ProductCard({ product, merchantSlug }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0] ?? null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const imageUrl = primaryImage
    ? `${supabaseUrl}/storage/v1/object/public/product-images/${primaryImage.storage_path}`
    : null

  return (
    <Link
      href={`/${merchantSlug}/produit/${product.id}`}
      className={[
        'group block bg-slate-800 rounded-lg overflow-hidden',
        'border border-slate-700 hover:border-slate-600',
        'hover:bg-slate-700 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
      ].join(' ')}
      aria-label={`Voir le produit ${product.name}`}
    >
      {/* Image 1:1 */}
      <div className="relative aspect-square bg-slate-700 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-10 h-10 text-slate-500" aria-hidden="true" />
          </div>
        )}

        {/* Badge Épuisé */}
        {!product.is_available && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/90 text-slate-900"
            aria-label="Produit épuisé"
          >
            Épuisé
          </div>
        )}
      </div>

      {/* Informations produit */}
      <div className="p-3 space-y-1">
        <h3
          className="text-sm font-medium text-slate-50 line-clamp-2 leading-snug"
          title={product.name}
        >
          {product.name}
        </h3>

        {product.reference && (
          <p className="text-xs text-slate-500 truncate">
            Réf. {product.reference}
          </p>
        )}

        <p
          className={[
            'text-sm font-semibold',
            product.is_available ? 'text-indigo-400' : 'text-slate-500 line-through',
          ].join(' ')}
          aria-label={`Prix : ${formatPrice(product.price_cents)}`}
        >
          {formatPrice(product.price_cents)}
        </p>
      </div>
    </Link>
  )
}

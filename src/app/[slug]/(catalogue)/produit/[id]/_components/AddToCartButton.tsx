'use client'

import { useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import type { Product } from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

/**
 * Construit l'URL complète Supabase Storage à partir d'un storage_path brut.
 * Retourne null si le chemin est null ou vide.
 */
function toStorageUrl(storagePath: string | null): string | null {
  if (!storagePath) return null
  // Si l'URL est déjà complète (ex: passée depuis QuickAddButton), la retourner telle quelle
  if (storagePath.startsWith('http')) return storagePath
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AddToCartButtonProps {
  product: Product
  merchantSlug: string
  primaryImageUrl: string | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

/**
 * AddToCartButton — Client Component.
 *
 * Gère la sélection de quantité et l'ajout au panier localStorage.
 * Affiche un feedback visuel temporaire après l'ajout.
 */
export function AddToCartButton({ product, merchantSlug, primaryImageUrl }: AddToCartButtonProps) {
  const { addToCart } = useCart(merchantSlug)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    addToCart({
      productId: product.id,
      name: product.name,
      reference: product.reference,
      price_cents: product.price_cents,
      quantity,
      image_url: toStorageUrl(primaryImageUrl),
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Sélecteur de quantité */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-400">Quantité</span>
        <div className="flex items-center gap-1 bg-neutral-900 border border-white/10 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="h-8 w-8 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Diminuer la quantité"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-8 w-8 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
      </div>

      {/* Sous-total */}
      <p className="text-xs text-neutral-500">
        Sous-total : {formatPrice(product.price_cents * quantity)}
      </p>

      {/* Bouton principal */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-neutral-950 hover:bg-neutral-200 active:scale-[0.98]'
          }`}
        >
          {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
        </button>

        <a
          href={`/${merchantSlug}/panier`}
          className="rounded-xl px-4 py-3 text-sm font-semibold bg-neutral-900 border border-white/10 text-neutral-300 hover:border-white/30 hover:text-white transition-colors"
        >
          Voir le panier
        </a>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import type { Product } from '@/lib/types/catalog'
import { useCart } from '@/hooks/useCart'

interface AddToCartButtonProps {
  product: Product
  merchantSlug: string
}

export function AddToCartButton({ product, merchantSlug }: AddToCartButtonProps) {
  const { addItem } = useCart(merchantSlug)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const isAvailable = product.is_available

  const imageUrl = (() => {
    const primary = product.images.find((img) => img.is_primary) ?? product.images[0] ?? null
    if (!primary) return null
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    return `${supabaseUrl}/storage/v1/object/public/product-images/${primary.storage_path}`
  })()

  const decrement = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1))
  }, [])

  const increment = useCallback(() => {
    setQuantity((q) => q + 1)
  }, [])

  const handleAddToCart = useCallback(() => {
    if (!isAvailable || added) return

    addItem(
      {
        productId: product.id,
        name: product.name,
        reference: product.reference,
        price_cents: product.price_cents,
        image_url: imageUrl,
      },
      quantity,
    )

    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }, [isAvailable, added, addItem, product, imageUrl, quantity])

  return (
    <div className="space-y-3">
      {/* Sélecteur de quantité */}
      <div className="flex items-center gap-0">
        <button
          type="button"
          onClick={decrement}
          disabled={!isAvailable || quantity <= 1}
          aria-label="Diminuer la quantité"
          className={[
            'flex items-center justify-center w-10 h-10 rounded-l-lg',
            'border border-slate-600 bg-slate-800',
            'text-slate-300 hover:bg-slate-700 hover:text-slate-50',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:z-10',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800',
          ].join(' ')}
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>

        <div
          className="flex items-center justify-center w-14 h-10 border-y border-slate-600 bg-slate-900 text-slate-50 text-sm font-semibold tabular-nums select-none"
          aria-live="polite"
          aria-label={`Quantité : ${quantity}`}
        >
          {quantity}
        </div>

        <button
          type="button"
          onClick={increment}
          disabled={!isAvailable}
          aria-label="Augmenter la quantité"
          className={[
            'flex items-center justify-center w-10 h-10 rounded-r-lg',
            'border border-slate-600 bg-slate-800',
            'text-slate-300 hover:bg-slate-700 hover:text-slate-50',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:z-10',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800',
          ].join(' ')}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Bouton principal */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!isAvailable}
        aria-label={
          !isAvailable
            ? 'Produit indisponible'
            : added
              ? 'Produit ajouté au panier'
              : `Ajouter ${quantity} ${quantity > 1 ? 'unités' : 'unité'} au panier`
        }
        aria-live="polite"
        className={[
          'w-full flex items-center justify-center gap-2',
          'px-4 py-3 rounded-lg font-semibold text-base',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
          !isAvailable
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed focus-visible:ring-slate-500'
            : added
              ? 'bg-green-600 text-white focus-visible:ring-green-500'
              : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white focus-visible:ring-indigo-400',
        ].join(' ')}
      >
        {!isAvailable ? (
          <span>Indisponible</span>
        ) : added ? (
          <>
            <Check className="w-5 h-5" aria-hidden="true" />
            <span>Ajouté !</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            <span>Ajouter au panier</span>
          </>
        )}
      </button>
    </div>
  )
}

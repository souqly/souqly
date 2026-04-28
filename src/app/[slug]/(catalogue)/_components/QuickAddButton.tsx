'use client'

import { Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import type { Product } from '@/lib/types/catalog'

interface QuickAddButtonProps {
  product: Product
  merchantSlug: string
  imageUrl: string | null
}

export function QuickAddButton({ product, merchantSlug, imageUrl }: QuickAddButtonProps) {
  const { addToCart } = useCart(merchantSlug)
  const [added, setAdded] = useState(false)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    addToCart({
      productId: product.id,
      name: product.name,
      reference: product.reference,
      price_cents: product.price_cents,
      quantity: 1,
      image_url: imageUrl,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={added ? `${product.name} ajouté au panier` : `Ajouter ${product.name} au panier`}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
        added
          ? 'bg-emerald-600 scale-95'
          : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
      }`}
    >
      {added ? (
        <Check className="w-4 h-4 text-white" aria-hidden="true" />
      ) : (
        <Plus className="w-4 h-4 text-white" aria-hidden="true" />
      )}
    </button>
  )
}

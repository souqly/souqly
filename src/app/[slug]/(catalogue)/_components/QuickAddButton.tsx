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

  // Ne pas afficher pour les produits avec variantes : la sélection est obligatoire
  if (product.variants.length > 0) return null

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    addToCart({
      productId: product.id,
      cartKey: product.id,
      name: product.name,
      reference: product.reference,
      price_cents: product.price_cents,
      quantity: 1,
      image_url: imageUrl,
      selectedVariants: [],
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={added ? `${product.name} ajouté au panier` : `Ajouter ${product.name} au panier`}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ct-primary)] ${
        added ? 'scale-95' : 'active:scale-95'
      }`}
      style={added ? { backgroundColor: '#16a34a' } : { backgroundColor: 'var(--ct-primary)', color: 'var(--ct-primary-fg)' }}
    >
      {added ? (
        <Check className="w-4 h-4 text-white" aria-hidden="true" />
      ) : (
        <Plus className="w-4 h-4 text-white" aria-hidden="true" />
      )}
    </button>
  )
}

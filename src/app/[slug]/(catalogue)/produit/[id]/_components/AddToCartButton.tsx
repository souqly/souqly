'use client'

import { useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import type { Product, SelectedVariant } from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

function toStorageUrl(storagePath: string | null): string | null {
  if (!storagePath) return null
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

export function AddToCartButton({ product, merchantSlug, primaryImageUrl }: AddToCartButtonProps) {
  const { addToCart } = useCart(merchantSlug)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  // typeId → optionId sélectionné
  const [selections, setSelections] = useState<Record<string, string>>({})

  const hasVariants = product.variants.length > 0
  const allSelected = !hasVariants || product.variants.every((vt) => selections[vt.id])

  function buildCartKey(): string {
    if (!hasVariants) return product.id
    const parts = product.variants
      .filter((vt) => selections[vt.id])
      .map((vt) => `${vt.id}:${selections[vt.id]}`)
    return `${product.id}::${parts.join('|')}`
  }

  function buildSelectedVariants(): SelectedVariant[] {
    return product.variants
      .filter((vt) => selections[vt.id])
      .map((vt) => {
        const option = vt.options.find((o) => o.id === selections[vt.id])
        return { typeName: vt.name, optionLabel: option?.label ?? '' }
      })
  }

  function handleAddToCart() {
    if (!allSelected) return
    addToCart({
      productId: product.id,
      cartKey: buildCartKey(),
      name: product.name,
      reference: product.reference,
      price_cents: product.price_cents,
      quantity,
      image_url: toStorageUrl(primaryImageUrl),
      selectedVariants: buildSelectedVariants(),
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Sélecteurs de variantes */}
      {product.variants.map((vt) => (
        <div key={vt.id}>
          <p className="text-sm font-medium text-[var(--ct-text)] mb-2">
            {vt.name}
            {!selections[vt.id] && (
              <span className="ml-1.5 text-xs font-normal text-[var(--ct-text-muted)]">
                (requis)
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {vt.options.map((opt) => {
              const isSelected = selections[vt.id] === opt.id
              const isUnavailable = !opt.is_available
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isUnavailable}
                  onClick={() => setSelections((prev) => ({ ...prev, [vt.id]: opt.id }))}
                  aria-pressed={isSelected}
                  className={[
                    'px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-150',
                    isUnavailable
                      ? 'border-[var(--ct-border)] text-[var(--ct-text-muted)] line-through cursor-not-allowed opacity-40'
                      : 'border-[var(--ct-border)] text-[var(--ct-text)] hover:border-[var(--ct-primary)]',
                  ].join(' ')}
                  style={
                    isSelected && !isUnavailable
                      ? { backgroundColor: 'var(--ct-primary)', color: 'var(--ct-primary-fg)', borderColor: 'var(--ct-primary)' }
                      : undefined
                  }
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Sélecteur de quantité */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--ct-text-muted)]">Quantité</span>
        <div className="flex items-center gap-1 bg-[var(--ct-surface)] border border-[var(--ct-border)] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="h-8 w-8 flex items-center justify-center rounded text-[var(--ct-text-muted)] hover:text-[var(--ct-text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Diminuer la quantité"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-[var(--ct-text)]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-8 w-8 flex items-center justify-center rounded text-[var(--ct-text-muted)] hover:text-[var(--ct-text)] transition-colors"
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
      </div>

      {/* Sous-total */}
      <p className="text-xs text-[var(--ct-text-muted)]">
        Sous-total : {formatPrice(product.price_cents * quantity)}
      </p>

      {/* Boutons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!allSelected}
          className="flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          style={
            added
              ? { backgroundColor: '#16a34a', color: '#fff' }
              : { backgroundColor: 'var(--ct-primary)', color: 'var(--ct-primary-fg)' }
          }
        >
          {added
            ? 'Ajouté au panier ✓'
            : !allSelected
            ? 'Sélectionnez vos options'
            : 'Ajouter au panier'}
        </button>

        <a
          href={`/${merchantSlug}/panier`}
          className="rounded-xl px-4 py-3 text-sm font-semibold bg-[var(--ct-surface)] border border-[var(--ct-border)] text-[var(--ct-text-muted)] hover:border-[var(--ct-primary)] hover:text-[var(--ct-text)] transition-colors"
        >
          Voir le panier
        </a>
      </div>
    </div>
  )
}

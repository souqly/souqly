'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import type { Product } from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

interface StickyMobileCTAProps {
  product: Product
  merchantSlug: string
  primaryStoragePath: string | null
}

function toStorageUrl(path: string | null): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
}

export function StickyMobileCTA({
  product,
  merchantSlug,
  primaryStoragePath,
}: StickyMobileCTAProps) {
  const { addToCart } = useCart(merchantSlug)
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 350)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!product.is_available) return null

  function handleAdd() {
    addToCart({
      productId: product.id,
      name: product.name,
      reference: product.reference,
      price_cents: product.price_cents,
      quantity: 1,
      image_url: toStorageUrl(primaryStoragePath),
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div
      className={[
        'md:hidden fixed bottom-0 left-0 right-0 z-40',
        'bg-neutral-950/95 backdrop-blur-md border-t border-white/10',
        'px-4 py-3 transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-neutral-400 truncate">{product.name}</p>
          <p className="text-base font-bold text-white">{formatPrice(product.price_cents)}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={[
            'shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200',
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-neutral-950 hover:bg-neutral-200 active:scale-[0.98]',
          ].join(' ')}
        >
          {added ? '✓ Ajouté' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  )
}

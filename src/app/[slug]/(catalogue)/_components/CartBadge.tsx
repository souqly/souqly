'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'

interface CartBadgeProps {
  merchantSlug: string
}

export function CartBadge({ merchantSlug }: CartBadgeProps) {
  const { itemCount } = useCart(merchantSlug)

  return (
    <a
      href={`/${merchantSlug}/panier`}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 border border-white/10 hover:border-indigo-500/40 hover:bg-neutral-700 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
      aria-label={`Voir le panier — ${itemCount} article${itemCount !== 1 ? 's' : ''}`}
    >
      <ShoppingBag className="w-4 h-4 text-neutral-300" aria-hidden="true" />
      {itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold leading-none tabular-nums"
          aria-hidden="true"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </a>
  )
}

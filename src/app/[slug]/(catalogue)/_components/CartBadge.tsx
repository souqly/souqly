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
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[var(--ct-surface)] border border-[var(--ct-border)] hover:border-[var(--ct-primary)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ct-primary)]"
      aria-label={`Voir le panier — ${itemCount} article${itemCount !== 1 ? 's' : ''}`}
    >
      <ShoppingBag className="w-4 h-4 text-[var(--ct-text-muted)]" aria-hidden="true" />
      {itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none tabular-nums"
          style={{ backgroundColor: 'var(--ct-primary)', color: 'var(--ct-primary-fg)' }}
          aria-hidden="true"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </a>
  )
}

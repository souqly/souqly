'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2, Package } from 'lucide-react'
import type { CartItem } from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'

interface CartItemRowProps {
  item: CartItem
  onUpdate: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

export function CartItemRow({ item, onUpdate, onRemove }: CartItemRowProps) {
  const subtotal = item.price_cents * item.quantity

  return (
    <div
      className="flex items-start gap-3 py-4 border-b border-slate-700 last:border-0"
      role="listitem"
    >
      {/* Miniature 64x64 */}
      <div className="relative flex-none w-16 h-16 rounded-md overflow-hidden bg-slate-700 shrink-0">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <Package className="w-6 h-6 text-slate-500" />
          </div>
        )}
      </div>

      {/* Infos + contrôles */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Nom + référence */}
        <div>
          <p className="text-sm font-medium text-slate-50 truncate" title={item.name}>
            {item.name}
          </p>
          {item.reference && (
            <p className="text-xs text-slate-500">Réf. {item.reference}</p>
          )}
        </div>

        {/* Prix unitaire + contrôle quantité */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-0">
            <button
              type="button"
              onClick={() => onUpdate(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Diminuer la quantité de ${item.name}`}
              className={[
                'flex items-center justify-center w-7 h-7 rounded-l-md',
                'border border-slate-600 bg-slate-800',
                'text-slate-400 hover:bg-slate-700 hover:text-slate-50',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              <Minus className="w-3 h-3" aria-hidden="true" />
            </button>

            <span
              className="flex items-center justify-center w-9 h-7 border-y border-slate-600 bg-slate-900 text-slate-50 text-xs font-semibold tabular-nums select-none"
              aria-label={`Quantité : ${item.quantity}`}
            >
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdate(item.productId, item.quantity + 1)}
              aria-label={`Augmenter la quantité de ${item.name}`}
              className={[
                'flex items-center justify-center w-7 h-7 rounded-r-md',
                'border border-slate-600 bg-slate-800',
                'text-slate-400 hover:bg-slate-700 hover:text-slate-50',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400',
              ].join(' ')}
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>

          {/* Sous-total aligné à droite */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500" aria-label={`Prix unitaire : ${formatPrice(item.price_cents)}`}>
              {formatPrice(item.price_cents)} × {item.quantity}
            </span>
            <span
              className="text-sm font-semibold text-slate-50 tabular-nums"
              aria-label={`Sous-total : ${formatPrice(subtotal)}`}
            >
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Bouton suppression */}
      <button
        type="button"
        onClick={() => onRemove(item.productId)}
        aria-label={`Supprimer ${item.name} du panier`}
        className={[
          'flex-none p-1.5 rounded-md',
          'text-red-400 hover:text-red-300 hover:bg-red-900/20',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        ].join(' ')}
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}

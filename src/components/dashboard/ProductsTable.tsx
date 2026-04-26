'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { toggleProductAvailability, deleteProduct } from '@/lib/actions/dashboard'
import { formatPrice } from '@/lib/utils/format'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProductImageRow = {
  id: string
  storage_path: string
  is_primary: boolean
  position: number
}

export type ProductRow = {
  id: string
  name: string
  description: string | null
  reference: string | null
  price_cents: number
  is_available: boolean
  position: number
  category_id: string | null
  product_images: ProductImageRow[]
}

export type CategoryOption = {
  id: string
  name: string
}

interface ProductsTableProps {
  products: ProductRow[]
  categories: CategoryOption[]
  merchantId: string
  onEdit: (product: ProductRow) => void
}

// ---------------------------------------------------------------------------
// Composant ligne
// ---------------------------------------------------------------------------

function ProductRow({
  product,
  categoryName,
  onEdit,
}: {
  product: ProductRow
  categoryName: string | null
  onEdit: (p: ProductRow) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [isAvailable, setIsAvailable] = useState(product.is_available)
  const [isDeleting, setIsDeleting] = useState(false)

  const primaryImage = product.product_images.find((img) => img.is_primary)
    ?? product.product_images[0]
    ?? null

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleProductAvailability(product.id)
      if ('success' in result) {
        setIsAvailable(result.is_available)
      }
    })
  }

  function handleDelete() {
    if (!window.confirm(`Supprimer "${product.name}" ? Cette action est irréversible.`)) {
      return
    }
    setIsDeleting(true)
    const formData = new FormData()
    formData.set('id', product.id)
    startTransition(async () => {
      await deleteProduct(formData)
      setIsDeleting(false)
    })
  }

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      {/* Image */}
      <td className="px-4 py-3 w-12">
        <div className="h-10 w-10 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0 relative">
          {primaryImage ? (
            <Image
              src={primaryImage.storage_path}
              alt={product.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-xs text-neutral-600">—</span>
            </div>
          )}
        </div>
      </td>

      {/* Nom + référence */}
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-white truncate max-w-[200px]">{product.name}</p>
        {product.reference && (
          <p className="text-xs text-neutral-500 mt-0.5">{product.reference}</p>
        )}
      </td>

      {/* Prix */}
      <td className="px-4 py-3 text-sm text-neutral-300 tabular-nums whitespace-nowrap">
        {formatPrice(product.price_cents)}
      </td>

      {/* Catégorie */}
      <td className="px-4 py-3 text-sm text-neutral-400 max-w-[120px] truncate">
        {categoryName ?? <span className="text-neutral-600">—</span>}
      </td>

      {/* Disponibilité */}
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className="flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50"
          aria-label={isAvailable ? 'Marquer comme indisponible' : 'Marquer comme disponible'}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
          ) : isAvailable ? (
            <ToggleRight className="h-5 w-5 text-green-400" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-neutral-500" />
          )}
          <span className={isAvailable ? 'text-green-400' : 'text-neutral-500'}>
            {isAvailable ? 'Dispo' : 'Indispo'}
          </span>
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-md text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-50"
            aria-label="Supprimer"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function ProductsTable({
  products,
  categories,
  onEdit,
}: ProductsTableProps) {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  if (products.length === 0) {
    return (
      <div className="bg-neutral-900 border border-white/5 rounded-xl px-6 py-12 text-center">
        <p className="text-neutral-400 text-sm">Aucun produit. Créez votre premier produit.</p>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-12">
                <span className="sr-only">Image</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                categoryName={product.category_id ? (categoryMap[product.category_id] ?? null) : null}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

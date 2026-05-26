'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, Loader2, Bookmark } from 'lucide-react'
import { deleteBrand } from '@/lib/actions/dashboard'
import { BrandFormModal } from './BrandFormModal'

export type BrandRow = {
  id: string
  name: string
  slug: string
  position: number
  product_count: number
}

interface BrandsClientProps {
  brands: BrandRow[]
}

function BrandItem({ brand, onEdit }: { brand: BrandRow; onEdit: (b: BrandRow) => void }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (
      !window.confirm(
        `Supprimer "${brand.name}" ? Les produits associés seront dissociés de cette marque.`,
      )
    ) return

    const formData = new FormData()
    formData.set('id', brand.id)
    startTransition(async () => {
      await deleteBrand(formData)
    })
  }

  return (
    <li className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
      <div className="h-9 w-9 rounded-lg bg-violet-600/10 flex items-center justify-center flex-shrink-0">
        <Bookmark className="h-4 w-4 text-violet-400" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{brand.name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          /{brand.slug} &middot;{' '}
          {brand.product_count} produit{brand.product_count !== 1 ? 's' : ''}
        </p>
      </div>

      <span className="text-xs text-neutral-600 tabular-nums flex-shrink-0">
        #{brand.position}
      </span>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => onEdit(brand)}
          className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Modifier"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="p-1.5 rounded-md text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-50"
          aria-label="Supprimer"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </li>
  )
}

export function BrandsClient({ brands }: BrandsClientProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editBrand, setEditBrand] = useState<BrandRow | null>(null)

  function handleEdit(brand: BrandRow) {
    setEditBrand(brand)
    setModalOpen(true)
  }

  function handleNew() {
    setEditBrand(null)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditBrand(null)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Marques</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {brands.length} marque{brands.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle marque
        </button>
      </div>

      {brands.length === 0 ? (
        <div className="bg-neutral-900 border border-white/5 rounded-xl px-6 py-12 text-center">
          <p className="text-neutral-400 text-sm">
            Aucune marque. Créez votre première marque pour permettre le filtrage par marque dans votre catalogue.
          </p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
          <ul role="list">
            {brands.map((brand) => (
              <BrandItem key={brand.id} brand={brand} onEdit={handleEdit} />
            ))}
          </ul>
        </div>
      )}

      <BrandFormModal open={modalOpen} onClose={handleClose} editBrand={editBrand} />
    </>
  )
}

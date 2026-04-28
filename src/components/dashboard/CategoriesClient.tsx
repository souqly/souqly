'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, Loader2, Tag } from 'lucide-react'
import { deleteCategory } from '@/lib/actions/dashboard'
import { CategoryFormModal } from './CategoryFormModal'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CategoryRow = {
  id: string
  name: string
  slug: string
  position: number
  cover_image_url: string | null
  product_count: number
}

interface CategoriesClientProps {
  categories: CategoryRow[]
  merchantId: string
}

interface CategoryItemProps {
  category: CategoryRow
  onEdit: (c: CategoryRow) => void
}

// ---------------------------------------------------------------------------
// Ligne catégorie
// ---------------------------------------------------------------------------

function CategoryItem({
  category,
  onEdit,
}: {
  category: CategoryRow
  onEdit: (c: CategoryRow) => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (
      !window.confirm(
        `Supprimer "${category.name}" ? Les produits associés seront dissociés de cette catégorie.`,
      )
    ) {
      return
    }
    const formData = new FormData()
    formData.set('id', category.id)
    startTransition(async () => {
      await deleteCategory(formData)
    })
  }

  return (
    <li className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
      {/* Icône */}
      <div className="h-9 w-9 rounded-lg bg-indigo-600/10 flex items-center justify-center flex-shrink-0">
        <Tag className="h-4 w-4 text-indigo-400" />
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{category.name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          /{category.slug} &middot;{' '}
          {category.product_count}{' '}
          produit{category.product_count !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Position */}
      <span className="text-xs text-neutral-600 tabular-nums flex-shrink-0">
        #{category.position}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => onEdit(category)}
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
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </li>
  )
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function CategoriesClient({
  categories,
  merchantId,
}: CategoriesClientProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryRow | null>(null)

  function handleEdit(category: CategoryRow) {
    setEditCategory(category)
    setModalOpen(true)
  }

  function handleNew() {
    setEditCategory(null)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditCategory(null)
  }

  return (
    <>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Catégories</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {categories.length} catégorie{categories.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle catégorie
        </button>
      </div>

      {/* Liste */}
      {categories.length === 0 ? (
        <div className="bg-neutral-900 border border-white/5 rounded-xl px-6 py-12 text-center">
          <p className="text-neutral-400 text-sm">
            Aucune catégorie. Créez votre première catégorie.
          </p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
          <ul role="list">
            {categories.map((cat) => (
              <CategoryItem key={cat.id} category={cat} onEdit={handleEdit} />
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      <CategoryFormModal
        open={modalOpen}
        onClose={handleClose}
        editCategory={editCategory}
        merchantId={merchantId}
      />
    </>
  )
}

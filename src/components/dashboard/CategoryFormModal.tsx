'use client'

import { useRef, useState, useTransition } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createCategory, updateCategory } from '@/lib/actions/dashboard'
import type { CategoryRow } from './CategoriesClient'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CategoryFormModalProps {
  open: boolean
  onClose: () => void
  editCategory?: CategoryRow | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function CategoryFormModal({
  open,
  onClose,
  editCategory,
}: CategoryFormModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const isEditing = Boolean(editCategory)

  if (!open) return null

  function handleClose() {
    setError(null)
    setSuccess(false)
    onClose()
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = isEditing
        ? await updateCategory(formData)
        : await createCategory(formData)

      if ('error' in result) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          handleClose()
        }, 600)
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/70"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 id="category-modal-title" className="text-base font-semibold text-white">
            {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Formulaire */}
        <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {editCategory && <input type="hidden" name="id" value={editCategory.id} />}

          {/* Nom */}
          <div>
            <label htmlFor="cat-name" className="block text-xs font-medium text-neutral-400 mb-1.5">
              Nom <span className="text-red-400">*</span>
            </label>
            <input
              id="cat-name"
              name="name"
              type="text"
              required
              maxLength={50}
              defaultValue={editCategory?.name ?? ''}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Ex : Chaussures"
            />
            {!isEditing && (
              <p className="text-xs text-neutral-600 mt-1">
                Le slug sera généré automatiquement depuis le nom.
              </p>
            )}
          </div>

          {/* Position */}
          <div>
            <label htmlFor="cat-position" className="block text-xs font-medium text-neutral-400 mb-1.5">
              Position
            </label>
            <input
              id="cat-position"
              name="position"
              type="number"
              min={0}
              step={1}
              defaultValue={editCategory?.position ?? 0}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Erreur / Succès */}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
              Enregistré avec succès.
            </p>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

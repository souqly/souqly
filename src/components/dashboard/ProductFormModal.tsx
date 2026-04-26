'use client'

import { useRef, useState, useTransition } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createProduct, updateProduct } from '@/lib/actions/dashboard'
import type { ProductRow, CategoryOption } from './ProductsTable'
import { ProductImageManager } from './ProductImageManager'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  categories: CategoryOption[]
  merchantId: string
  editProduct?: ProductRow | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function ProductFormModal({
  open,
  onClose,
  categories,
  merchantId,
  editProduct,
}: ProductFormModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const isEditing = Boolean(editProduct)

  // Réinitialiser l'état à l'ouverture
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
        ? await updateProduct(formData)
        : await createProduct(formData)

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
      aria-labelledby="product-modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panneau */}
      <div className="relative z-10 w-full max-w-xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 id="product-modal-title" className="text-base font-semibold text-white">
            {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
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

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Formulaire */}
          <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {editProduct && <input type="hidden" name="id" value={editProduct.id} />}

            {/* Nom */}
            <div>
              <label htmlFor="product-name" className="block text-xs font-medium text-neutral-400 mb-1.5">
                Nom <span className="text-red-400">*</span>
              </label>
              <input
                id="product-name"
                name="name"
                type="text"
                required
                maxLength={100}
                defaultValue={editProduct?.name ?? ''}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 transition-colors"
                placeholder="Ex : Sneakers Modèle X"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="product-description" className="block text-xs font-medium text-neutral-400 mb-1.5">
                Description
              </label>
              <textarea
                id="product-description"
                name="description"
                maxLength={2000}
                rows={3}
                defaultValue={editProduct?.description ?? ''}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 transition-colors resize-none"
                placeholder="Description optionnelle..."
              />
            </div>

            {/* Prix + Référence */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="product-price" className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Prix (centimes) <span className="text-red-400">*</span>
                </label>
                <input
                  id="product-price"
                  name="price_cents"
                  type="number"
                  required
                  min={1}
                  step={1}
                  defaultValue={editProduct?.price_cents ?? ''}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 transition-colors"
                  placeholder="Ex : 8500"
                />
                <p className="text-xs text-neutral-600 mt-1">1000 = 10,00 €</p>
              </div>
              <div>
                <label htmlFor="product-reference" className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Référence (SKU)
                </label>
                <input
                  id="product-reference"
                  name="reference"
                  type="text"
                  maxLength={50}
                  defaultValue={editProduct?.reference ?? ''}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 transition-colors"
                  placeholder="Ex : REF-001"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="product-category" className="block text-xs font-medium text-neutral-400 mb-1.5">
                Catégorie
              </label>
              <select
                id="product-category"
                name="category_id"
                defaultValue={editProduct?.category_id ?? ''}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 transition-colors"
              >
                <option value="">Sans catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Position + Disponibilité */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label htmlFor="product-position" className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Position
                </label>
                <input
                  id="product-position"
                  name="position"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={editProduct?.position ?? 0}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <input
                  id="product-available"
                  name="is_available"
                  type="checkbox"
                  defaultChecked={editProduct?.is_available ?? true}
                  value="true"
                  className="h-4 w-4 rounded border-white/20 bg-neutral-800 accent-indigo-600"
                />
                <label htmlFor="product-available" className="text-sm text-neutral-300 cursor-pointer">
                  Disponible
                </label>
              </div>
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
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </form>

          {/* Image manager — edition mode only */}
          {isEditing && editProduct?.id && (
            <div className="px-6 pb-6">
              <div className="border-t border-white/5 pt-5">
                <ProductImageManager
                  productId={editProduct.id}
                  merchantId={merchantId}
                  images={editProduct.product_images ?? []}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

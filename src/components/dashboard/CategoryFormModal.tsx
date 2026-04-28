'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { X, Loader2, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createCategory, updateCategory, updateCategoryImage } from '@/lib/actions/dashboard'
import { createClient } from '@/lib/supabase/client'
import type { CategoryRow } from './CategoriesClient'

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CategoryFormModalProps {
  open: boolean
  onClose: () => void
  merchantId: string
  editCategory?: CategoryRow | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function CategoryFormModal({
  open,
  onClose,
  merchantId,
  editCategory,
}: CategoryFormModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const isEditing = Boolean(editCategory)

  // --- Image couverture state ---
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    editCategory?.cover_image_url ?? null,
  )
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  if (!open) return null

  function handleClose() {
    setError(null)
    setSuccess(false)
    setImageError(null)
    setImagePreview(editCategory?.cover_image_url ?? null)
    setPendingFile(null)
    onClose()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError('Format non supporté. Utilisez JPG, PNG ou WebP.')
      e.target.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError('Fichier trop volumineux. Maximum 2 MB.')
      e.target.value = ''
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setImagePreview(objectUrl)
    setPendingFile(file)
  }

  async function uploadCoverImage(categoryId: string, file: File): Promise<string | null> {
    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${merchantId}/${categoryId}/${Date.now()}.${ext}`

    const { error: storageError } = await supabase.storage
      .from('category-covers')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (storageError) {
      setImageError('Erreur lors de l\'upload de l\'image.')
      return null
    }

    const { data: publicData } = supabase.storage
      .from('category-covers')
      .getPublicUrl(path)

    return publicData.publicUrl
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      // 1. Créer ou mettre à jour la catégorie (nom + position)
      const result = isEditing
        ? await updateCategory(formData)
        : await createCategory(formData)

      if ('error' in result) {
        setError(result.error)
        return
      }

      // 2. Si un fichier image est en attente, uploader après avoir l'ID
      if (pendingFile) {
        // Pour une édition on a déjà l'ID, pour une création il est dans result.id
        const categoryId = isEditing ? editCategory!.id : (result as { success: true; id: string }).id

        setIsUploading(true)
        const imageUrl = await uploadCoverImage(categoryId, pendingFile)
        setIsUploading(false)

        if (!imageUrl) {
          // L'upload a échoué — catégorie créée sans image, on reste sur la modale
          return
        }

        const imageResult = await updateCategoryImage(categoryId, imageUrl)
        if ('error' in imageResult) {
          setImageError(imageResult.error)
          return
        }
      }

      setSuccess(true)
      router.refresh()
      setTimeout(() => {
        handleClose()
      }, 600)
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
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Formulaire */}
        <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {editCategory && <input type="hidden" name="id" value={editCategory.id} />}

          {/* ---------------------------------------------------------------- */}
          {/* Image de couverture                                               */}
          {/* ---------------------------------------------------------------- */}
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-2">Image de couverture</p>

            <div className="flex items-center gap-4">
              {/* Aperçu 120×120 */}
              <div
                className="relative h-[120px] w-[120px] shrink-0 rounded-xl bg-neutral-800 border border-white/10 overflow-hidden flex items-center justify-center"
                aria-label="Aperçu de l'image de couverture"
              >
                {(isPending && pendingFile) || isUploading ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900/70">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                  </div>
                ) : null}
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Aperçu de la couverture"
                    fill
                    sizes="120px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-neutral-600" aria-hidden="true" />
                )}
              </div>

              {/* Bouton + légende */}
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  aria-label="Choisir une image de couverture"
                  onChange={handleFileChange}
                  tabIndex={-1}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-sm text-neutral-300 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  {imagePreview ? 'Changer l\'image' : 'Choisir une image'}
                </button>
                <p className="text-xs text-neutral-600">JPG, PNG ou WebP — max 2 MB</p>
              </div>
            </div>

            {imageError && (
              <p className="mt-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {imageError}
              </p>
            )}
          </div>

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
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
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
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Erreur / Succès */}
          {error && (
            <p
              role="alert"
              className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              role="status"
              className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2"
            >
              Enregistré avec succès.
            </p>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {(isPending || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

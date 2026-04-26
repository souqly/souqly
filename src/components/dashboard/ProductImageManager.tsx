'use client'

import {
  useCallback,
  useRef,
  useState,
  useTransition,
  type DragEvent,
  type ChangeEvent,
} from 'react'
import NextImage from 'next/image'
import { Star, Trash2, Upload, Loader2, X, ImageOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  addProductImage,
  deleteProductImage,
  setPrimaryImage,
} from '@/lib/actions/dashboard'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductImage {
  id: string
  storage_path: string
  is_primary: boolean
  position: number
}

interface Props {
  productId: string
  merchantId: string
  images: ProductImage[]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024   // 2 MB input gate
const MAX_COMPRESSED_BYTES = 200 * 1024        // 200 KB target
const MAX_DIMENSION = 1200                     // px
const COMPRESS_QUALITY = 0.8
const MAX_TOTAL_IMAGES = 10

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

function storageUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
}

// ---------------------------------------------------------------------------
// Canvas compression
// ---------------------------------------------------------------------------

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img

      // Scale down if either dimension exceeds MAX_DIMENSION
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width)
          width = MAX_DIMENSION
        } else {
          width = Math.round((width * MAX_DIMENSION) / height)
          height = MAX_DIMENSION
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context unavailable'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // First attempt at target quality
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression échouée.'))
            return
          }

          // If still over budget, try again at lower quality
          if (blob.size > MAX_COMPRESSED_BYTES) {
            const reducedQuality = COMPRESS_QUALITY * (MAX_COMPRESSED_BYTES / blob.size)
            canvas.toBlob(
              (blob2) => {
                if (!blob2) {
                  reject(new Error('Compression échouée.'))
                  return
                }
                resolve(blob2)
              },
              'image/jpeg',
              Math.max(0.3, reducedQuality),
            )
          } else {
            resolve(blob)
          }
        },
        'image/jpeg',
        COMPRESS_QUALITY,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Impossible de lire l\'image.'))
    }

    img.src = objectUrl
  })
}

// ---------------------------------------------------------------------------
// Upload state per file
// ---------------------------------------------------------------------------

type UploadStatus = 'compressing' | 'uploading' | 'done' | 'error'

interface UploadEntry {
  key: string       // local unique key
  previewUrl: string
  status: UploadStatus
  errorMsg?: string
  // once done, the server-assigned id
  imageId?: string
  storagePath?: string
}

// ---------------------------------------------------------------------------
// Thumbnail component
// ---------------------------------------------------------------------------

interface ThumbnailProps {
  image: ProductImage
  onSetPrimary: (id: string) => void
  onDelete: (id: string) => void
  isPendingAction: boolean
}

function Thumbnail({ image, onSetPrimary, onDelete, isPendingAction }: ThumbnailProps) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div
      className={[
        'relative group aspect-square rounded-lg overflow-hidden bg-neutral-800 border transition-all duration-200',
        image.is_primary
          ? 'border-indigo-500 ring-2 ring-indigo-500/40'
          : 'border-white/5',
        dragOver ? 'opacity-60 scale-95' : '',
      ].join(' ')}
      draggable
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={() => setDragOver(false)}
      aria-label={image.is_primary ? 'Image principale' : 'Image produit'}
    >
      {/* Image */}
      <NextImage
        src={storageUrl(image.storage_path)}
        alt="Image produit"
        fill
        sizes="(max-width: 640px) 33vw, 160px"
        className="object-cover"
      />

      {/* Primary badge */}
      {image.is_primary && (
        <div
          className="absolute top-1.5 left-1.5 bg-indigo-600 rounded-md p-1 shadow-lg"
          aria-label="Image principale"
        >
          <Star className="h-3 w-3 text-white fill-white" />
        </div>
      )}

      {/* Hover overlay with actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
        {!image.is_primary && (
          <button
            type="button"
            onClick={() => onSetPrimary(image.id)}
            disabled={isPendingAction}
            className="flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Définir comme image principale"
            title="Définir comme principale"
          >
            <Star className="h-3 w-3" />
            <span className="hidden sm:inline">Principale</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(image.id)}
          disabled={isPendingAction}
          className="p-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-md transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          aria-label="Supprimer cette image"
          title="Supprimer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Pending overlay */}
      {isPendingAction && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <Loader2 className="h-5 w-5 text-white animate-spin" />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Upload entry thumbnail (in-progress or error)
// ---------------------------------------------------------------------------

function UploadThumbnail({
  entry,
  onDismiss,
}: {
  entry: UploadEntry
  onDismiss: (key: string) => void
}) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-white/5">
      <NextImage
        src={entry.previewUrl}
        alt="Aperçu en cours d'upload"
        fill
        sizes="(max-width: 640px) 33vw, 160px"
        className="object-cover opacity-50"
        unoptimized
      />

      {/* Status overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50">
        {entry.status === 'error' ? (
          <>
            <div className="p-1.5 rounded-full bg-red-600/80">
              <X className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-[10px] leading-tight text-red-300 text-center px-1 max-w-full truncate">
              {entry.errorMsg ?? 'Erreur'}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(entry.key)}
              className="mt-0.5 text-[10px] text-neutral-400 hover:text-white underline focus-visible:outline-none"
              aria-label="Ignorer cette erreur"
            >
              Ignorer
            </button>
          </>
        ) : (
          <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProductImageManager({ productId, merchantId, images: initialImages }: Props) {
  const [images, setImages] = useState<ProductImage[]>(initialImages)
  const [uploads, setUploads] = useState<UploadEntry[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [pendingImageIds, setPendingImageIds] = useState<Set<string>>(new Set())

  const inputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  const totalCount = images.length + uploads.filter((u) => u.status !== 'error').length

  function markImagePending(id: string) {
    setPendingImageIds((prev) => new Set(prev).add(id))
  }

  function unmarkImagePending(id: string) {
    setPendingImageIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function updateUpload(key: string, patch: Partial<UploadEntry>) {
    setUploads((prev) => prev.map((u) => (u.key === key ? { ...u, ...patch } : u)))
  }

  function dismissUpload(key: string) {
    setUploads((prev) => {
      const entry = prev.find((u) => u.key === key)
      if (entry) URL.revokeObjectURL(entry.previewUrl)
      return prev.filter((u) => u.key !== key)
    })
  }

  // -------------------------------------------------------------------------
  // Set primary
  // -------------------------------------------------------------------------

  function handleSetPrimary(imageId: string) {
    markImagePending(imageId)
    startTransition(async () => {
      const result = await setPrimaryImage(imageId)
      unmarkImagePending(imageId)
      if ('error' in result) {
        setGlobalError(result.error)
        return
      }
      setImages((prev) =>
        prev.map((img) => ({ ...img, is_primary: img.id === imageId })),
      )
    })
  }

  // -------------------------------------------------------------------------
  // Delete
  // -------------------------------------------------------------------------

  function handleDelete(imageId: string) {
    if (!window.confirm('Supprimer cette image ? Cette action est irréversible.')) return

    markImagePending(imageId)
    startTransition(async () => {
      const result = await deleteProductImage(imageId)
      unmarkImagePending(imageId)
      if ('error' in result) {
        setGlobalError(result.error)
        return
      }
      setImages((prev) => {
        const next = prev.filter((img) => img.id !== imageId)
        // If we removed the primary and there are remaining images, promote first
        const hadPrimary = prev.find((img) => img.id === imageId)?.is_primary
        if (hadPrimary && next.length > 0) {
          return next.map((img, i) => ({ ...img, is_primary: i === 0 }))
        }
        return next
      })
    })
  }

  // -------------------------------------------------------------------------
  // Upload pipeline
  // -------------------------------------------------------------------------

  const processFiles = useCallback(
    async (files: File[]) => {
      setGlobalError(null)

      // Validate accepted types
      const validFiles = files.filter((f) => ACCEPTED_TYPES.includes(f.type))
      const invalidCount = files.length - validFiles.length
      if (invalidCount > 0) {
        setGlobalError(`${invalidCount} fichier(s) ignoré(s) — formats acceptés : JPG, PNG, WebP.`)
      }

      if (validFiles.length === 0) return

      // Check total cap
      const slots = MAX_TOTAL_IMAGES - totalCount
      if (slots <= 0) {
        setGlobalError(`Maximum ${MAX_TOTAL_IMAGES} images par produit.`)
        return
      }

      const filesToProcess = validFiles.slice(0, slots)
      if (validFiles.length > slots) {
        setGlobalError(
          `Maximum ${MAX_TOTAL_IMAGES} images. Seuls les ${slots} premiers fichiers seront traités.`,
        )
      }

      // Build upload entries and add optimistic previews immediately
      const entries: UploadEntry[] = filesToProcess.map((f) => ({
        key: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        previewUrl: URL.createObjectURL(f),
        status: 'compressing' as UploadStatus,
      }))

      setUploads((prev) => [...prev, ...entries])

      // Process each file
      await Promise.all(
        filesToProcess.map(async (file, idx) => {
          const entry = entries[idx]
          const { key } = entry

          // Size gate before compression
          if (file.size > MAX_FILE_SIZE_BYTES) {
            updateUpload(key, {
              status: 'error',
              errorMsg: `${file.name}: fichier trop volumineux (max 2 Mo).`,
            })
            return
          }

          // Compress
          let compressed: Blob
          try {
            compressed = await compressImage(file)
          } catch {
            updateUpload(key, {
              status: 'error',
              errorMsg: `${file.name}: compression échouée.`,
            })
            return
          }

          updateUpload(key, { status: 'uploading' })

          // Build storage path
          const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
          const storagePath = `${merchantId}/${productId}/${Date.now()}_${safeFilename}`

          // Upload to Supabase Storage
          const supabase = createClient()
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(storagePath, compressed, {
              contentType: 'image/jpeg',
              upsert: false,
            })

          if (uploadError) {
            updateUpload(key, {
              status: 'error',
              errorMsg: `${file.name}: échec de l'envoi — ${uploadError.message}`,
            })
            return
          }

          // Determine if this should be the primary image
          const isFirst = images.length === 0 && idx === 0

          // Register image in DB via server action
          const result = await addProductImage(productId, storagePath, isFirst)

          if ('error' in result) {
            updateUpload(key, {
              status: 'error',
              errorMsg: `${file.name}: ${result.error}`,
            })
            // Clean up orphaned storage file
            await supabase.storage.from('product-images').remove([storagePath])
            return
          }

          // Success — remove upload entry and add to images list
          setUploads((prev) => {
            const target = prev.find((u) => u.key === key)
            if (target) URL.revokeObjectURL(target.previewUrl)
            return prev.filter((u) => u.key !== key)
          })

          setImages((prev) => {
            const newImage: ProductImage = {
              id: result.id,
              storage_path: storagePath,
              is_primary: isFirst,
              position: prev.length,
            }
            // If first image, mark all existing non-primary (shouldn't happen but be safe)
            if (isFirst) {
              return [...prev.map((img) => ({ ...img, is_primary: false })), newImage]
            }
            return [...prev, newImage]
          })
        }),
      )
    },
    [productId, merchantId, totalCount, images.length],
  )

  // -------------------------------------------------------------------------
  // Drag-and-drop handlers on drop zone
  // -------------------------------------------------------------------------

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    // Only leave if actually exiting the zone (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    // Reset input so same file can be re-selected after dismissing an error
    e.target.value = ''
    processFiles(files)
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const hasContent = images.length > 0 || uploads.length > 0
  const atCap = totalCount >= MAX_TOTAL_IMAGES

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          Photos du produit
        </h3>
        <span className="text-xs text-neutral-500">
          {totalCount} / {MAX_TOTAL_IMAGES}
        </span>
      </div>

      {/* Global error */}
      {globalError && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
          <span className="text-sm text-red-400 flex-1">{globalError}</span>
          <button
            type="button"
            onClick={() => setGlobalError(null)}
            className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded"
            aria-label="Fermer l'erreur"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Image grid */}
      {hasContent && (
        <div
          className="grid grid-cols-3 sm:grid-cols-4 gap-2"
          role="list"
          aria-label="Images du produit"
        >
          {images.map((img) => (
            <div key={img.id} role="listitem">
              <Thumbnail
                image={img}
                onSetPrimary={handleSetPrimary}
                onDelete={handleDelete}
                isPendingAction={pendingImageIds.has(img.id)}
              />
            </div>
          ))}

          {uploads.map((entry) => (
            <div key={entry.key} role="listitem">
              <UploadThumbnail entry={entry} onDismiss={dismissUpload} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state inside grid area */}
      {!hasContent && (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <div className="p-3 rounded-xl bg-neutral-800 border border-white/5">
            <ImageOff className="h-6 w-6 text-neutral-500" />
          </div>
          <p className="text-sm text-neutral-500">Aucune photo pour ce produit.</p>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'relative rounded-xl border-2 border-dashed transition-all duration-200',
          atCap
            ? 'border-neutral-700 opacity-50 cursor-not-allowed'
            : isDragOver
              ? 'border-indigo-500 bg-indigo-500/5'
              : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02]',
        ].join(' ')}
        aria-disabled={atCap}
      >
        <label
          htmlFor="product-image-upload"
          className={[
            'flex flex-col items-center justify-center gap-3 px-6 py-8 cursor-pointer',
            atCap ? 'pointer-events-none' : '',
          ].join(' ')}
        >
          <div
            className={[
              'p-3 rounded-xl border transition-colors',
              isDragOver
                ? 'bg-indigo-600/20 border-indigo-500/30'
                : 'bg-neutral-800 border-white/5',
            ].join(' ')}
          >
            <Upload
              className={[
                'h-5 w-5 transition-colors',
                isDragOver ? 'text-indigo-400' : 'text-neutral-500',
              ].join(' ')}
            />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-neutral-300">
              {isDragOver
                ? 'Relâchez pour ajouter'
                : 'Glissez vos images ici ou cliquez pour sélectionner'}
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              JPG, PNG, WebP — max 2 Mo par fichier
            </p>
            {atCap && (
              <p className="text-xs text-amber-500 mt-1">
                Limite de {MAX_TOTAL_IMAGES} images atteinte.
              </p>
            )}
          </div>

          <input
            ref={inputRef}
            id="product-image-upload"
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            disabled={atCap}
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Sélectionner des images produit"
          />
        </label>
      </div>

      {/* Helper text */}
      {images.length > 0 && (
        <p className="text-xs text-neutral-600">
          L&apos;image avec l&apos;étoile est affichée en premier dans le catalogue.
          Survolez une image pour changer la principale ou la supprimer.
        </p>
      )}
    </div>
  )
}

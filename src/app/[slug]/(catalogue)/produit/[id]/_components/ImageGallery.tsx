'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProductImage {
  id: string
  storage_path: string
  is_primary: boolean
}

interface ImageGalleryProps {
  images: ProductImage[]
  productName: string
  storageBaseUrl: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function storageUrl(baseUrl: string, path: string): string {
  return `${baseUrl}/storage/v1/object/public/product-images/${path}`
}

// ---------------------------------------------------------------------------
// Composant — Client Component
// ---------------------------------------------------------------------------

/**
 * ImageGallery — Client Component.
 *
 * Affiche l'image principale + vignettes cliquables avec navigation clavier.
 * Initialise l'index actif sur l'image is_primary.
 */
export function ImageGallery({ images, productName, storageBaseUrl }: ImageGalleryProps) {
  const initialIndex = Math.max(
    0,
    images.findIndex((img) => img.is_primary),
  )

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const galleryRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex) return
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex(index)
        setIsTransitioning(false)
      }, 100)
    },
    [activeIndex],
  )

  const goToPrev = useCallback(() => {
    goTo(activeIndex === 0 ? images.length - 1 : activeIndex - 1)
  }, [activeIndex, images.length, goTo])

  const goToNext = useCallback(() => {
    goTo(activeIndex === images.length - 1 ? 0 : activeIndex + 1)
  }, [activeIndex, images.length, goTo])

  // Navigation clavier — ArrowLeft / ArrowRight
  useEffect(() => {
    if (images.length <= 1) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    const el = galleryRef.current
    if (el) {
      el.addEventListener('keydown', handleKeyDown)
      return () => el.removeEventListener('keydown', handleKeyDown)
    }
  }, [images.length, goToPrev, goToNext])

  const activeImage = images[activeIndex]

  if (!activeImage) {
    return (
      <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 flex items-center justify-center">
        <span className="text-6xl font-bold text-neutral-800" aria-label="Aucune image">
          ?
        </span>
      </div>
    )
  }

  return (
    <div
      ref={galleryRef}
      className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
      tabIndex={images.length > 1 ? 0 : -1}
      aria-label={`Galerie — ${productName}`}
      role="region"
    >
      {/* Image principale */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/5">
        <Image
          key={activeImage.id}
          src={storageUrl(storageBaseUrl, activeImage.storage_path)}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={[
            'object-cover transition-opacity duration-200',
            isTransitioning ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        />

        {/* Indicateur de position si plusieurs images */}
        {images.length > 1 && (
          <div
            className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Vignettes — uniquement si plusieurs images */}
      {images.length > 1 && (
        <div
          className="grid grid-cols-5 gap-2"
          role="listbox"
          aria-label="Sélectionner une image"
        >
          {images.map((img, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={img.id}
                type="button"
                role="option"
                aria-selected={isActive}
                aria-label={`Image ${index + 1}`}
                onClick={() => goTo(index)}
                className={[
                  'relative aspect-square rounded-lg overflow-hidden bg-neutral-900 border transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                  isActive
                    ? 'border-indigo-500 ring-2 ring-indigo-500'
                    : 'border-white/5 hover:opacity-80 hover:border-white/20',
                ].join(' ')}
              >
                <Image
                  src={storageUrl(storageBaseUrl, img.storage_path)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 20vw, 10vw"
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

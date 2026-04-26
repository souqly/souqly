'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import type { ProductImage } from '@/lib/types/catalog'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
  supabaseUrl: string
}

function buildUrl(supabaseUrl: string, storagePath: string): string {
  return `${supabaseUrl}/storage/v1/object/public/product-images/${storagePath}`
}

export function ProductGallery({ images, productName, supabaseUrl }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.position - b.position)
  const primaryIndex = sorted.findIndex((img) => img.is_primary)
  const initialIndex = primaryIndex >= 0 ? primaryIndex : 0

  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Touch swipe
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransitioning) return
      setIsTransitioning(true)
      setActiveIndex(index)
      setTimeout(() => setIsTransitioning(false), 200)
    },
    [activeIndex, isTransitioning],
  )

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + sorted.length) % sorted.length)
  }, [activeIndex, sorted.length, goTo])

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % sorted.length)
  }, [activeIndex, sorted.length, goTo])

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, goPrev, goNext])

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current

    // Ignorer si le scroll vertical est dominant
    if (Math.abs(deltaY) > Math.abs(deltaX)) return

    if (deltaX > 40) goPrev()
    else if (deltaX < -40) goNext()

    touchStartX.current = null
    touchStartY.current = null
  }

  if (sorted.length === 0) {
    return (
      <div className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center">
        <span className="text-slate-500 text-sm">Aucune image disponible</span>
      </div>
    )
  }

  const activeImage = sorted[activeIndex]
  const activeUrl = buildUrl(supabaseUrl, activeImage.storage_path)

  return (
    <>
      <div className="space-y-3">
        {/* Image principale */}
        <div
          className="relative aspect-square md:aspect-[4/5] bg-slate-800 rounded-lg overflow-hidden cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-label={`Agrandir l'image ${activeIndex + 1} de ${sorted.length} — ${productName}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setLightboxOpen(true)
            }
          }}
        >
          <Image
            key={activeImage.id}
            src={activeUrl}
            alt={`${productName} — vue ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={[
              'object-cover transition-opacity duration-200',
              isTransitioning ? 'opacity-0' : 'opacity-100',
            ].join(' ')}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            priority={activeIndex === 0}
          />

          {/* Icône zoom */}
          <div
            className="absolute bottom-2 right-2 p-1.5 rounded-full bg-slate-900/70 backdrop-blur-sm"
            aria-hidden="true"
          >
            <ZoomIn className="w-4 h-4 text-slate-300" />
          </div>

          {/* Flèches navigation (si > 1 image) */}
          {sorted.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                className={[
                  'absolute left-2 top-1/2 -translate-y-1/2',
                  'p-1.5 rounded-full bg-slate-900/70 backdrop-blur-sm',
                  'text-slate-300 hover:text-white hover:bg-slate-900/90',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                ].join(' ')}
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                className={[
                  'absolute right-2 top-1/2 -translate-y-1/2',
                  'p-1.5 rounded-full bg-slate-900/70 backdrop-blur-sm',
                  'text-slate-300 hover:text-white hover:bg-slate-900/90',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                ].join(' ')}
                aria-label="Image suivante"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails horizontaux scrollables (5 max visibles) */}
        {sorted.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
            role="tablist"
            aria-label="Miniatures du produit"
          >
            {sorted.map((img, index) => {
              const thumbUrl = buildUrl(supabaseUrl, img.storage_path)
              const isActive = index === activeIndex
              return (
                <button
                  key={img.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Image ${index + 1} de ${sorted.length}`}
                  onClick={() => goTo(index)}
                  className={[
                    'relative flex-none w-16 h-16 rounded-md overflow-hidden',
                    'border-2 transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
                    isActive
                      ? 'border-indigo-500 opacity-100'
                      : 'border-slate-600 opacity-60 hover:opacity-90 hover:border-slate-500',
                  ].join(' ')}
                >
                  <Image
                    src={thumbUrl}
                    alt={`${productName} — miniature ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Galerie — ${productName}`}
        >
          {/* Bouton fermer */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className={[
              'absolute top-4 right-4 z-60 p-2 rounded-full',
              'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
            ].join(' ')}
            aria-label="Fermer la galerie"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Image plein écran */}
          <div
            className="relative w-full h-full max-w-4xl max-h-screen p-8 md:p-16"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              key={`lb-${activeImage.id}`}
              src={activeUrl}
              alt={`${productName} — vue ${activeIndex + 1} (plein écran)`}
              fill
              sizes="100vw"
              className={[
                'object-contain transition-opacity duration-200',
                isTransitioning ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
          </div>

          {/* Navigation lightbox */}
          {sorted.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                className={[
                  'absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-60',
                  'p-3 rounded-full bg-slate-800/80 text-slate-300',
                  'hover:text-white hover:bg-slate-700 transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                ].join(' ')}
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                className={[
                  'absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-60',
                  'p-3 rounded-full bg-slate-800/80 text-slate-300',
                  'hover:text-white hover:bg-slate-700 transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                ].join(' ')}
                aria-label="Image suivante"
              >
                <ChevronRight className="w-6 h-6" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Compteur */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 text-sm">
            {activeIndex + 1} / {sorted.length}
          </div>
        </div>
      )}
    </>
  )
}

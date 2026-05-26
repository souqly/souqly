'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

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

function storageUrl(baseUrl: string, path: string): string {
  return `${baseUrl}/storage/v1/object/public/product-images/${path}`
}

export function ImageGallery({ images, productName, storageBaseUrl }: ImageGalleryProps) {
  const initialIndex = Math.max(0, images.findIndex((img) => img.is_primary))
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

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

  // Keyboard navigation + ESC for lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && lightboxOpen) {
        setLightboxOpen(false)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, goToPrev, goToNext])

  // Lock scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? goToNext() : goToPrev()
    touchStartX.current = null
  }

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
    <>
      <div
        className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
        tabIndex={images.length > 1 ? 0 : -1}
        aria-label={`Galerie — ${productName}`}
        role="region"
      >
        {/* Image principale */}
        <div
          className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 cursor-zoom-in group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightboxOpen(true)}
        >
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

          {/* Zoom hint */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded-full p-1.5">
            <ZoomIn className="h-4 w-4 text-white" />
          </div>

          {/* Position indicator */}
          {images.length > 1 && (
            <div
              className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full"
              aria-live="polite"
              aria-atomic="true"
            >
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {/* Mobile arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrev()
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-1.5 text-white md:hidden"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-1.5 text-white md:hidden"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Vignettes */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2" role="listbox" aria-label="Sélectionner une image">
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm tabular-nums">
              {activeIndex + 1} / {images.length}
            </p>
          )}

          {/* Image */}
          <div
            className="relative w-[90vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={storageUrl(storageBaseUrl, activeImage.storage_path)}
              alt={productName}
              fill
              priority
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrev()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white transition-colors"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white transition-colors"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Vignettes dans le lightbox */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goTo(index)
                  }}
                  className={[
                    'relative h-12 w-12 rounded-lg overflow-hidden border-2 transition-all',
                    index === activeIndex
                      ? 'border-white opacity-100'
                      : 'border-white/20 opacity-50 hover:opacity-75',
                  ].join(' ')}
                  aria-label={`Image ${index + 1}`}
                >
                  <Image
                    src={storageUrl(storageBaseUrl, img.storage_path)}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

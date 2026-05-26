'use client'

import { useState } from 'react'
import { X, Download, Share2, Link2, Check, Loader2 } from 'lucide-react'
import type { ProductRow } from './ProductsTable'
import { formatPrice } from '@/lib/utils/format'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProductShareModalProps {
  open: boolean
  onClose: () => void
  product: ProductRow
  merchantName: string
  merchantSlug: string
  merchantLogoUrl: string | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function ProductShareModal({
  open,
  onClose,
  product,
  merchantName,
  merchantSlug,
  merchantLogoUrl,
}: ProductShareModalProps) {
  const [sharing, setSharing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const primaryImage =
    product.product_images.find((img) => img.is_primary) ?? product.product_images[0]

  const shopUrl = `souqly.fr/${merchantSlug}/catalogue`
  const fullShopUrl = `https://${shopUrl}`

  const params = new URLSearchParams({ mn: merchantName, su: shopUrl })
  if (merchantLogoUrl) params.set('lu', merchantLogoUrl)
  if (product.name) params.set('pn', product.name)
  params.set('pp', formatPrice(product.price_cents))
  if (primaryImage?.storage_path) params.set('pi', primaryImage.storage_path)

  const storyImageUrl = `/api/share/story?${params.toString()}`
  const fileName = `${merchantSlug}-story.png`

  async function fetchImageFile(): Promise<File> {
    const resp = await fetch(storyImageUrl)
    const blob = await resp.blob()
    return new File([blob], fileName, { type: blob.type })
  }

  async function triggerDownload() {
    const resp = await fetch(storyImageUrl)
    const blob = await resp.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function handleShare() {
    setSharing(true)
    try {
      const file = await fetchImageFile()
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: merchantName,
          text: `Découvrez ${product.name} chez ${merchantName} 👀\n${fullShopUrl}`,
        })
      } else {
        await triggerDownload()
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') console.error(err)
    } finally {
      setSharing(false)
    }
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      await triggerDownload()
    } finally {
      setDownloading(false)
    }
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(fullShopUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden="true" />

      {/* Panneau */}
      <div className="relative z-10 w-full max-w-xs bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 id="share-modal-title" className="text-sm font-semibold text-white">
            Partager en Story
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Aperçu format téléphone (9:16) */}
        <div className="flex justify-center px-5 pt-5 pb-3">
          <div className="relative" style={{ width: 130, height: 231 }}>
            <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-white/15 bg-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storyImageUrl}
                alt="Aperçu story"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Badge Snapchat */}
            <div
              className="absolute bottom-2 right-2 bg-[#FFFC00] rounded-full w-6 h-6 flex items-center justify-center text-black text-[8px] font-black leading-none"
              title="Snapchat Stories"
            >
              SC
            </div>
          </div>
        </div>

        {/* Infos produit */}
        <div className="px-5 pb-1 text-center">
          <p className="text-xs font-medium text-white truncate">{product.name}</p>
          <p className="text-xs text-neutral-500 truncate">{shopUrl}</p>
        </div>

        {/* Conseil mobile */}
        <p className="mx-5 mt-3 text-center text-[11px] text-neutral-500 leading-relaxed">
          Appuyez sur{' '}
          <span className="text-yellow-400 font-medium">Partager</span> puis sélectionnez
          Snapchat ou Instagram depuis votre téléphone
        </p>

        {/* Boutons d'action */}
        <div className="px-5 py-4 space-y-2">
          {/* Partager via Web Share API (ouvre le panneau natif du téléphone) */}
          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FFFC00] hover:bg-yellow-300 text-black text-sm font-bold rounded-xl transition-colors disabled:opacity-60"
          >
            {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            Partager en Story
          </button>

          {/* Télécharger */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Télécharger l&apos;image
          </button>

          {/* Copier le lien */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-neutral-400 hover:text-white text-sm font-medium rounded-xl transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
            <span className={copied ? 'text-green-400' : ''}>
              {copied ? 'Lien copié !' : 'Copier le lien boutique'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

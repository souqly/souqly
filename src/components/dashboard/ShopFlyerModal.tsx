'use client'

import { useState, useEffect } from 'react'
import { X, Download, Share2, Link2, Check, Loader2, Lock } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShopFlyerModalProps {
  open: boolean
  onClose: () => void
  merchantName: string
  merchantSlug: string
  merchantLogoUrl: string | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function ShopFlyerModal({
  open,
  onClose,
  merchantName,
  merchantSlug,
  merchantLogoUrl,
}: ShopFlyerModalProps) {
  const [accessCode, setAccessCode] = useState('')
  const [previewCode, setPreviewCode] = useState('')
  const [sharing, setSharing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Debounce la mise à jour de l'aperçu (évite de recharger à chaque frappe)
  useEffect(() => {
    const timer = setTimeout(() => setPreviewCode(accessCode), 400)
    return () => clearTimeout(timer)
  }, [accessCode])

  if (!open) return null

  const shopUrl = `souqly.fr/${merchantSlug}/catalogue`
  const fullShopUrl = `https://${shopUrl}`

  const params = new URLSearchParams({ mn: merchantName, su: shopUrl })
  if (merchantLogoUrl) params.set('lu', merchantLogoUrl)
  if (previewCode) params.set('code', previewCode)

  const flyerImageUrl = `/api/share/flyer?${params.toString()}`
  const fileName = `${merchantSlug}-flyer.png`

  async function triggerDownload() {
    const resp = await fetch(flyerImageUrl)
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
      const resp = await fetch(flyerImageUrl)
      const blob = await resp.blob()
      const file = new File([blob], fileName, { type: blob.type })
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: merchantName,
          text: `Accédez à mon catalogue privé 🔐\nCode : ${accessCode || '…'}\n${fullShopUrl}`,
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
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flyer-modal-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden="true" />

      {/* Panneau */}
      <div className="relative z-10 w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 id="flyer-modal-title" className="text-sm font-semibold text-white flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-indigo-400" />
            Flyer catalogue
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

        {/* Saisie du code */}
        <div className="px-5 pt-5">
          <label htmlFor="flyer-code" className="block text-xs font-medium text-neutral-400 mb-1.5">
            Votre code d&apos;accès
          </label>
          <input
            id="flyer-code"
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            maxLength={20}
            autoComplete="off"
            spellCheck={false}
            placeholder="ex : BOUTIQUE2024"
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono tracking-widest placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 transition-colors"
          />
          <p className="text-[11px] text-neutral-600 mt-1">
            Le code que vous avez défini dans les Paramètres.
          </p>
        </div>

        {/* Aperçu du flyer */}
        <div className="flex justify-center px-5 pt-4 pb-2">
          <div
            className="relative overflow-hidden rounded-xl border-2 border-white/10 bg-neutral-800"
            style={{ width: '100%', aspectRatio: '1/1' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={flyerImageUrl}
              src={flyerImageUrl}
              alt="Aperçu flyer boutique"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Boutons */}
        <div className="px-5 py-4 space-y-2">
          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            Partager le flyer
          </button>

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

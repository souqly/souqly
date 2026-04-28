'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Loader2, Upload, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updateMerchantSettings, updateMerchantLogo } from '@/lib/actions/dashboard'
import { createClient } from '@/lib/supabase/client'

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SettingsShopFormProps {
  merchantId: string
  name: string
  description: string | null
  logo_url: string | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function SettingsShopForm({
  merchantId,
  name,
  description,
  logo_url,
}: SettingsShopFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null)

  // --- Logo upload state ---
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(logo_url)

  // Initiales pour l'avatar par défaut
  const initials = name.trim().charAt(0).toUpperCase()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setLogoError('Format non supporté. Utilisez JPG, PNG ou WebP.')
      e.target.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setLogoError('Fichier trop volumineux. Maximum 2 MB.')
      e.target.value = ''
      return
    }

    // Preview immédiat
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Upload
    handleUpload(file)
  }

  function handleUpload(file: File) {
    setIsUploading(true)
    setLogoError(null)

    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${merchantId}/${Date.now()}.${ext}`

    ;(async () => {
      const { error: storageError } = await supabase.storage
        .from('merchant-logos')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (storageError) {
        setLogoError('Erreur lors de l\'upload. Réessayez.')
        setPreviewUrl(null)
        setIsUploading(false)
        return
      }

      const { data: publicData } = supabase.storage
        .from('merchant-logos')
        .getPublicUrl(path)

      const publicUrl = publicData.publicUrl

      const result = await updateMerchantLogo(publicUrl)

      if ('error' in result) {
        setLogoError(result.error)
        setPreviewUrl(null)
        setIsUploading(false)
        return
      }

      setUploadedLogoUrl(publicUrl)
      setIsUploading(false)
      router.refresh()
    })()
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFeedback(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateMerchantSettings(formData)
      if ('error' in result) {
        setFeedback({ type: 'error', message: result.error })
      } else {
        setFeedback({ type: 'success', message: 'Informations mises à jour.' })
      }
    })
  }

  const displayedLogo = previewUrl ?? uploadedLogoUrl

  return (
    <section className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-base font-semibold text-white">Informations boutique</h2>
        <p className="text-sm text-neutral-500 mt-0.5">Nom et description affichés sur votre catalogue.</p>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* ------------------------------------------------------------------ */}
        {/* Section logo                                                         */}
        {/* ------------------------------------------------------------------ */}
        <div>
          <p className="text-xs font-medium text-neutral-400 mb-3">Logo de la boutique</p>

          <div className="flex items-center gap-4">
            {/* Aperçu */}
            <div
              className="relative h-20 w-20 shrink-0 rounded-xl bg-neutral-800 border border-white/10 overflow-hidden flex items-center justify-center"
              aria-label="Aperçu du logo"
            >
              {isUploading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900/70">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                </div>
              )}
              {displayedLogo ? (
                <Image
                  src={displayedLogo}
                  alt="Logo de la boutique"
                  fill
                  sizes="80px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
              ) : (
                <span
                  className="text-2xl font-bold text-indigo-400 select-none"
                  aria-hidden="true"
                >
                  {initials}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-label="Choisir un fichier logo"
                onChange={handleFileChange}
                tabIndex={-1}
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-sm text-neutral-300 font-medium rounded-lg transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Upload className="h-3.5 w-3.5" />
                {isUploading ? 'Upload en cours…' : 'Changer le logo'}
              </button>
              <p className="text-xs text-neutral-600">JPG, PNG ou WebP — max 2 MB</p>
            </div>
          </div>

          {/* Erreur logo */}
          {logoError && (
            <p className="mt-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {logoError}
            </p>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Formulaire nom + description                                         */}
        {/* ------------------------------------------------------------------ */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label htmlFor="settings-name" className="block text-xs font-medium text-neutral-400 mb-1.5">
              Nom de la boutique <span className="text-red-400">*</span>
            </label>
            <input
              id="settings-name"
              name="name"
              type="text"
              required
              maxLength={100}
              defaultValue={name}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="settings-description" className="block text-xs font-medium text-neutral-400 mb-1.5">
              Description
            </label>
            <textarea
              id="settings-description"
              name="description"
              maxLength={500}
              rows={3}
              defaultValue={description ?? ''}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors resize-none"
              placeholder="Courte description de votre boutique..."
            />
            <p className="text-xs text-neutral-600 mt-1">Maximum 500 caractères.</p>
          </div>

          {/* Feedback */}
          {feedback && (
            <p
              role="status"
              className={`text-sm rounded-lg px-3 py-2 ${
                feedback.type === 'success'
                  ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                  : 'text-red-400 bg-red-500/10 border border-red-500/20'
              }`}
            >
              {feedback.message}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

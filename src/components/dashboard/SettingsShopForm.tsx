'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { updateMerchantSettings } from '@/lib/actions/dashboard'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SettingsShopFormProps {
  name: string
  description: string | null
  logo_url: string | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function SettingsShopForm({
  name,
  description,
  logo_url,
}: SettingsShopFormProps) {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null)

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

  return (
    <section className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-base font-semibold text-white">Informations boutique</h2>
        <p className="text-sm text-neutral-500 mt-0.5">Nom et description affichés sur votre catalogue.</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        {/* Champs cachés pour les autres paramètres — ils ne sont pas dans ce form */}
        {/* Note: on envoie uniquement les champs de cette section. Le serveur gère chaque paramètre séparément. */}

        {/* Logo (affichage seulement, upload à implémenter) */}
        {logo_url && (
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-2">Logo actuel</p>
            <div className="h-16 w-16 rounded-xl bg-neutral-800 border border-white/5 overflow-hidden relative">
              <Image
                src={logo_url}
                alt="Logo boutique"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              L&apos;upload de logo sera disponible prochainement.
            </p>
          </div>
        )}

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
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
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
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            placeholder="Courte description de votre boutique..."
          />
          <p className="text-xs text-neutral-600 mt-1">Maximum 500 caractères.</p>
        </div>

        {/* Feedback */}
        {feedback && (
          <p
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
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Enregistrer
          </button>
        </div>
      </form>
    </section>
  )
}

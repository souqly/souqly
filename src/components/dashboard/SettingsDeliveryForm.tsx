'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { updateDeliverySettings } from '@/lib/actions/dashboard'
import { formatPrice } from '@/lib/utils/format'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DeliverySettings {
  click_and_collect_enabled: boolean
  self_delivery_enabled: boolean
  self_delivery_city: string | null
  self_delivery_price_cents: number | null
  colissimo_enabled: boolean
  colissimo_price_cents: number | null
}

interface SettingsDeliveryFormProps {
  settings: DeliverySettings
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function SettingsDeliveryForm({ settings }: SettingsDeliveryFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [clickCollect, setClickCollect] = useState(settings.click_and_collect_enabled)
  const [selfDelivery, setSelfDelivery] = useState(settings.self_delivery_enabled)
  const [colissimo, setColissimo] = useState(settings.colissimo_enabled)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateDeliverySettings(formData)
      if ('error' in result) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <section className="bg-neutral-900 border border-white/5 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-white">Options de livraison</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Activez les modes de livraison proposés à vos clients dans le panier.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ------------------------------------------------------------------ */}
        {/* Click & Collect                                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="click_and_collect_enabled"
              checked={clickCollect}
              onChange={(e) => setClickCollect(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-neutral-800 accent-indigo-600"
            />
            <div>
              <p className="text-sm font-medium text-white">Click &amp; Collect</p>
              <p className="text-xs text-neutral-500">Le client récupère sa commande en boutique. Gratuit.</p>
            </div>
          </label>
        </div>

        <div className="border-t border-white/5" />

        {/* ------------------------------------------------------------------ */}
        {/* Livraison par le marchand                                            */}
        {/* ------------------------------------------------------------------ */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="self_delivery_enabled"
              checked={selfDelivery}
              onChange={(e) => setSelfDelivery(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-neutral-800 accent-indigo-600"
            />
            <div>
              <p className="text-sm font-medium text-white">Livraison par mes soins</p>
              <p className="text-xs text-neutral-500">Vous livrez vous-même dans votre ville.</p>
            </div>
          </label>

          {selfDelivery && (
            <div className="ml-7 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="self-city" className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Ville de livraison
                </label>
                <input
                  id="self-city"
                  name="self_delivery_city"
                  type="text"
                  maxLength={100}
                  defaultValue={settings.self_delivery_city ?? ''}
                  placeholder="Ex : Lyon"
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="self-price" className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Frais (centimes, vide = gratuit)
                </label>
                <input
                  id="self-price"
                  name="self_delivery_price_cents"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={settings.self_delivery_price_cents ?? ''}
                  placeholder="Ex : 500 = 5,00 €"
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {settings.self_delivery_price_cents !== null && (
                  <p className="text-xs text-neutral-600 mt-1">
                    Actuellement : {formatPrice(settings.self_delivery_price_cents)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/5" />

        {/* ------------------------------------------------------------------ */}
        {/* Colissimo                                                            */}
        {/* ------------------------------------------------------------------ */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="colissimo_enabled"
              checked={colissimo}
              onChange={(e) => setColissimo(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-neutral-800 accent-indigo-600"
            />
            <div>
              <p className="text-sm font-medium text-white">Colissimo</p>
              <p className="text-xs text-neutral-500">Livraison postale. Vous gérez l&apos;étiquette.</p>
            </div>
          </label>

          {colissimo && (
            <div className="ml-7">
              <label htmlFor="colissimo-price" className="block text-xs font-medium text-neutral-400 mb-1.5">
                Frais (centimes, vide = à négocier)
              </label>
              <input
                id="colissimo-price"
                name="colissimo_price_cents"
                type="number"
                min={0}
                step={1}
                defaultValue={settings.colissimo_price_cents ?? ''}
                placeholder="Ex : 800 = 8,00 €"
                className="w-full max-w-[200px] bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {settings.colissimo_price_cents !== null && (
                <p className="text-xs text-neutral-600 mt-1">
                  Actuellement : {formatPrice(settings.colissimo_price_cents)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Feedback */}
        {error && (
          <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            Options de livraison enregistrées.
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

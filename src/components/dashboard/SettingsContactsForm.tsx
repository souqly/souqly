'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { updateMerchantSettings } from '@/lib/actions/dashboard'
import { DEFAULT_MESSAGE_TEMPLATE } from '@/lib/utils/format'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SettingsContactsFormProps {
  name: string
  description: string | null
  whatsapp_number: string | null
  telegram_username: string | null
  message_template: string | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function SettingsContactsForm({
  name,
  description,
  whatsapp_number,
  telegram_username,
  message_template,
}: SettingsContactsFormProps) {
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
        setFeedback({ type: 'success', message: 'Contacts mis à jour.' })
      }
    })
  }

  return (
    <section className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-base font-semibold text-white">Contacts et template</h2>
        <p className="text-sm text-neutral-500 mt-0.5">
          Canaux de commande et message envoyé par les clients.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        {/* Champs cachés pour conserver name et description */}
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="description" value={description ?? ''} />

        {/* WhatsApp */}
        <div>
          <label htmlFor="settings-whatsapp" className="block text-xs font-medium text-neutral-400 mb-1.5">
            Numéro WhatsApp
          </label>
          <input
            id="settings-whatsapp"
            name="whatsapp_number"
            type="tel"
            defaultValue={whatsapp_number ?? ''}
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="+33612345678"
          />
          <p className="text-xs text-neutral-600 mt-1">Format E.164 : +33612345678</p>
        </div>

        {/* Telegram */}
        <div>
          <label htmlFor="settings-telegram" className="block text-xs font-medium text-neutral-400 mb-1.5">
            Nom d&apos;utilisateur Telegram
          </label>
          <div className="flex items-center">
            <span className="flex-shrink-0 px-3 py-2 bg-neutral-800/50 border border-r-0 border-white/10 rounded-l-lg text-sm text-neutral-500">
              @
            </span>
            <input
              id="settings-telegram"
              name="telegram_username"
              type="text"
              maxLength={32}
              defaultValue={telegram_username ?? ''}
              className="flex-1 bg-neutral-800 border border-white/10 rounded-r-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="monpseudo"
            />
          </div>
          <p className="text-xs text-neutral-600 mt-1">Alphanumérique + underscore, max 32 caractères.</p>
        </div>

        {/* Template de message */}
        <div>
          <label htmlFor="settings-template" className="block text-xs font-medium text-neutral-400 mb-1.5">
            Template de message commande
          </label>
          <textarea
            id="settings-template"
            name="message_template"
            maxLength={2000}
            rows={7}
            defaultValue={message_template ?? ''}
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors resize-y font-mono text-xs"
            placeholder={DEFAULT_MESSAGE_TEMPLATE}
          />
          <div className="mt-2 space-y-1">
            <p className="text-xs text-neutral-500">Placeholders disponibles :</p>
            <div className="flex flex-wrap gap-1.5">
              {['{{products}}', '{{total}}', '{{client_name}}', '{{notes}}'].map((ph) => (
                <code
                  key={ph}
                  className="px-1.5 py-0.5 bg-neutral-800 border border-white/5 rounded text-xs text-indigo-400"
                >
                  {ph}
                </code>
              ))}
            </div>
          </div>
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

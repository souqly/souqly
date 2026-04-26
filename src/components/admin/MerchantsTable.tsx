'use client'

import { useTransition, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { suspendMerchant, reactivateMerchant } from '@/lib/actions/admin'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchantRow {
  id: string
  name: string
  slug: string
  status: string
  subscription_status: string
  created_at: string
  stripe_customer_id: string | null
}

interface MerchantsTableProps {
  merchants: MerchantRow[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active'
  return (
    <span
      aria-label={`Statut : ${isActive ? 'actif' : status}`}
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        isActive
          ? 'bg-green-500/10 text-green-400'
          : 'bg-neutral-700 text-neutral-400',
      ].join(' ')}
    >
      {isActive ? 'Actif' : status === 'inactive' ? 'Suspendu' : status}
    </span>
  )
}

function SubscriptionBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; classes: string }> = {
    trial: { label: 'Essai', classes: 'bg-indigo-500/10 text-indigo-400' },
    active: { label: 'Actif', classes: 'bg-green-500/10 text-green-400' },
    past_due: { label: 'Impayé', classes: 'bg-amber-500/10 text-amber-400' },
    canceled: { label: 'Annulé', classes: 'bg-red-500/10 text-red-400' },
  }

  const entry = map[status] ?? { label: status, classes: 'bg-neutral-700 text-neutral-400' }

  return (
    <span
      aria-label={`Abonnement : ${entry.label}`}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${entry.classes}`}
    >
      {entry.label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Row action button
// ---------------------------------------------------------------------------

interface ActionButtonProps {
  merchantId: string
  isActive: boolean
}

function MerchantActionButton({ merchantId, isActive }: ActionButtonProps) {
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  function handleAction(formData: FormData) {
    startTransition(async () => {
      const action = isActive ? suspendMerchant : reactivateMerchant
      const result = await action(formData)
      if ('error' in result) {
        setFeedback(result.error)
      } else {
        setFeedback(null)
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={handleAction}>
        <input type="hidden" name="merchant_id" value={merchantId} />
        <button
          type="submit"
          disabled={pending}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50',
            isActive
              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
              : 'text-green-400 hover:text-green-300 hover:bg-green-500/10',
          ].join(' ')}
        >
          {pending && (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
          )}
          {isActive ? 'Suspendre' : 'Réactiver'}
        </button>
      </form>
      {feedback && (
        <p role="alert" className="text-xs text-red-400">
          {feedback}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function MerchantsTable({ merchants }: MerchantsTableProps) {
  if (merchants.length === 0) {
    return (
      <p className="text-sm text-neutral-500 bg-neutral-900 border border-white/5 rounded-xl px-5 py-8 text-center">
        Aucun marchand enregistré.
      </p>
    )
  }

  return (
    <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th scope="col" className="text-left text-xs font-medium text-neutral-500 px-5 py-3">
              Marchand
            </th>
            <th scope="col" className="text-left text-xs font-medium text-neutral-500 px-5 py-3 hidden sm:table-cell">
              Slug
            </th>
            <th scope="col" className="text-left text-xs font-medium text-neutral-500 px-5 py-3">
              Statut
            </th>
            <th scope="col" className="text-left text-xs font-medium text-neutral-500 px-5 py-3 hidden md:table-cell">
              Abonnement
            </th>
            <th scope="col" className="text-left text-xs font-medium text-neutral-500 px-5 py-3 hidden lg:table-cell">
              Créé le
            </th>
            <th scope="col" className="text-right text-xs font-medium text-neutral-500 px-5 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {merchants.map((m) => (
            <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-3">
                <span className="font-medium text-white">{m.name}</span>
              </td>
              <td className="px-5 py-3 text-neutral-400 hidden sm:table-cell font-mono text-xs">
                /{m.slug}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={m.status} />
              </td>
              <td className="px-5 py-3 hidden md:table-cell">
                <SubscriptionBadge status={m.subscription_status} />
              </td>
              <td className="px-5 py-3 text-neutral-500 hidden lg:table-cell">
                {formatDate(m.created_at)}
              </td>
              <td className="px-5 py-3 text-right">
                <MerchantActionButton
                  merchantId={m.id}
                  isActive={m.status === 'active'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import { useState, useEffect, useTransition } from 'react'
import { Plus, Trash2, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  createVariantType,
  deleteVariantType,
  addVariantOption,
  toggleVariantOptionAvailability,
  deleteVariantOption,
} from '@/lib/actions/dashboard'

// ---------------------------------------------------------------------------
// Types locaux
// ---------------------------------------------------------------------------

type LocalVariantOption = {
  id: string
  label: string
  position: number
  is_available: boolean
}

type LocalVariantType = {
  id: string
  name: string
  position: number
  options: LocalVariantOption[]
}

interface ProductVariantManagerProps {
  productId: string
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function ProductVariantManager({ productId }: ProductVariantManagerProps) {
  const [variantTypes, setVariantTypes] = useState<LocalVariantType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTypeName, setNewTypeName] = useState('')
  const [newOptionLabels, setNewOptionLabels] = useState<Record<string, string>>({})
  const [, startTransition] = useTransition()
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    void loadVariants()
  }, [productId])

  async function loadVariants() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error: fetchError } = await supabase
      .from('product_variant_types')
      .select('id, name, position, product_variant_options(id, label, position, is_available)')
      .eq('product_id', productId)
      .order('position', { ascending: true })

    if (fetchError) {
      setError('Erreur lors du chargement des variantes.')
    } else {
      setVariantTypes(
        (data ?? []).map((vt) => ({
          id: vt.id,
          name: vt.name,
          position: vt.position,
          options: ((vt.product_variant_options as LocalVariantOption[]) ?? []).sort(
            (a, b) => a.position - b.position,
          ),
        })),
      )
    }
    setLoading(false)
  }

  function markPending(id: string) {
    setPendingIds((prev) => new Set(prev).add(id))
  }

  function unmarkPending(id: string) {
    setPendingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  // ---------------------------------------------------------------------------
  // Ajouter un type
  // ---------------------------------------------------------------------------

  function handleAddType() {
    const name = newTypeName.trim()
    if (!name) return
    const addKey = 'add-type'
    markPending(addKey)
    startTransition(async () => {
      const result = await createVariantType(productId, name, variantTypes.length)
      unmarkPending(addKey)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setVariantTypes((prev) => [
        ...prev,
        { id: result.id, name, position: prev.length, options: [] },
      ])
      setNewTypeName('')
    })
  }

  // ---------------------------------------------------------------------------
  // Supprimer un type
  // ---------------------------------------------------------------------------

  function handleDeleteType(typeId: string) {
    if (!window.confirm('Supprimer ce type de variante et toutes ses options ?')) return
    markPending(typeId)
    startTransition(async () => {
      const result = await deleteVariantType(typeId)
      unmarkPending(typeId)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setVariantTypes((prev) => prev.filter((vt) => vt.id !== typeId))
    })
  }

  // ---------------------------------------------------------------------------
  // Ajouter une option
  // ---------------------------------------------------------------------------

  function handleAddOption(typeId: string) {
    const label = (newOptionLabels[typeId] ?? '').trim()
    if (!label) return
    const type = variantTypes.find((vt) => vt.id === typeId)
    const position = type ? type.options.length : 0
    const addKey = `add-opt-${typeId}`
    markPending(addKey)
    startTransition(async () => {
      const result = await addVariantOption(typeId, label, position)
      unmarkPending(addKey)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setVariantTypes((prev) =>
        prev.map((vt) =>
          vt.id === typeId
            ? {
                ...vt,
                options: [
                  ...vt.options,
                  { id: result.id, label, position, is_available: true },
                ],
              }
            : vt,
        ),
      )
      setNewOptionLabels((prev) => ({ ...prev, [typeId]: '' }))
    })
  }

  // ---------------------------------------------------------------------------
  // Toggle disponibilité option
  // ---------------------------------------------------------------------------

  function handleToggleOption(typeId: string, optionId: string, currentAvailable: boolean) {
    markPending(optionId)
    startTransition(async () => {
      const result = await toggleVariantOptionAvailability(optionId)
      unmarkPending(optionId)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setVariantTypes((prev) =>
        prev.map((vt) =>
          vt.id === typeId
            ? {
                ...vt,
                options: vt.options.map((opt) =>
                  opt.id === optionId
                    ? { ...opt, is_available: !currentAvailable }
                    : opt,
                ),
              }
            : vt,
        ),
      )
    })
  }

  // ---------------------------------------------------------------------------
  // Supprimer une option
  // ---------------------------------------------------------------------------

  function handleDeleteOption(typeId: string, optionId: string) {
    markPending(optionId)
    startTransition(async () => {
      const result = await deleteVariantOption(optionId)
      unmarkPending(optionId)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setVariantTypes((prev) =>
        prev.map((vt) =>
          vt.id === typeId
            ? { ...vt, options: vt.options.filter((opt) => opt.id !== optionId) }
            : vt,
        ),
      )
    })
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Variantes</h3>
        <span className="text-xs text-neutral-500">
          {variantTypes.length} type{variantTypes.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
          <span className="text-sm text-red-400 flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Liste des types */}
      <div className="space-y-3">
        {variantTypes.map((vt) => (
          <div
            key={vt.id}
            className="bg-neutral-800 border border-white/5 rounded-xl p-4 space-y-3"
          >
            {/* Header du type */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{vt.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteType(vt.id)}
                disabled={pendingIds.has(vt.id)}
                className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-40 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
                aria-label={`Supprimer le type ${vt.name}`}
              >
                {pendingIds.has(vt.id) ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Options existantes */}
            {vt.options.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {vt.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={[
                      'group flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs transition-colors',
                      opt.is_available
                        ? 'border-white/15 bg-neutral-700 text-white'
                        : 'border-white/5 bg-neutral-900 text-neutral-500 line-through',
                    ].join(' ')}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleOption(vt.id, opt.id, opt.is_available)}
                      disabled={pendingIds.has(opt.id)}
                      className="hover:opacity-70 transition-opacity disabled:opacity-40 focus-visible:outline-none"
                      title={opt.is_available ? 'Marquer indisponible' : 'Marquer disponible'}
                    >
                      {pendingIds.has(opt.id) ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        opt.label
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(vt.id, opt.id)}
                      disabled={pendingIds.has(opt.id)}
                      className="text-neutral-600 hover:text-red-400 transition-colors disabled:opacity-40 opacity-0 group-hover:opacity-100 focus-visible:outline-none"
                      aria-label={`Supprimer l'option ${opt.label}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Ajouter une option */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newOptionLabels[vt.id] ?? ''}
                onChange={(e) =>
                  setNewOptionLabels((prev) => ({ ...prev, [vt.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddOption(vt.id)
                  }
                }}
                placeholder="Ex : S, M, L, Rouge…"
                maxLength={100}
                className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => handleAddOption(vt.id)}
                disabled={
                  !newOptionLabels[vt.id]?.trim() || pendingIds.has(`add-opt-${vt.id}`)
                }
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                {pendingIds.has(`add-opt-${vt.id}`) ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Nouveau type de variante */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddType()
            }
          }}
          placeholder="Nouveau type (ex : Taille, Couleur, Matière…)"
          maxLength={50}
          className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 transition-colors"
        />
        <button
          type="button"
          onClick={handleAddType}
          disabled={!newTypeName.trim() || pendingIds.has('add-type')}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg border border-white/10 transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          {pendingIds.has('add-type') ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Ajouter
        </button>
      </div>

      {variantTypes.length > 0 && (
        <p className="text-xs text-neutral-600">
          Cliquez sur une option pour basculer sa disponibilité. Les options barrées restent
          visibles côté client mais grisées.
        </p>
      )}
    </div>
  )
}

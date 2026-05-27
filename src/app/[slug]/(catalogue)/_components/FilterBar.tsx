'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Category, Brand } from '@/lib/types/catalog'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilterBarProps {
  categories: Category[]
  brands: Brand[]
  merchantSlug: string
  totalAvailable: number
  activeCategory?: string
  activeBrand?: string
  activeSort?: string
  activeQ?: string
  activeMin?: string
  activeMax?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildUrl(
  pathname: string,
  params: URLSearchParams,
  updates: Record<string, string | undefined>,
): string {
  const next = new URLSearchParams(params)
  for (const [key, value] of Object.entries(updates)) {
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
  }
  const qs = next.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function FilterBar({
  categories,
  brands,
  merchantSlug,
  totalAvailable,
  activeCategory,
  activeBrand,
  activeSort,
  activeQ,
  activeMin,
  activeMax,
}: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [localQ, setLocalQ] = useState(activeQ ?? '')
  const [localMin, setLocalMin] = useState(activeMin ?? '')
  const [localMax, setLocalMax] = useState(activeMax ?? '')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeFilterCount =
    (activeBrand ? 1 : 0) +
    (activeSort ? 1 : 0) +
    (activeMin || activeMax ? 1 : 0) +
    (activeQ ? 1 : 0)

  // Navigate with updated query params
  const navigate = useCallback(
    (updates: Record<string, string | undefined>) => {
      router.push(buildUrl(pathname, searchParams, updates))
    },
    [router, pathname, searchParams],
  )

  function handleSearchChange(value: string) {
    setLocalQ(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      navigate({ q: value || undefined })
    }, 400)
  }

  function handlePriceApply() {
    navigate({
      min: localMin || undefined,
      max: localMax || undefined,
    })
    setDrawerOpen(false)
  }

  function resetAll() {
    setLocalQ('')
    setLocalMin('')
    setLocalMax('')
    router.push(`/${merchantSlug}/catalogue`)
  }

  const catalogBase = `/${merchantSlug}/catalogue`

  return (
    <>
      {/* ------------------------------------------------------------------- */}
      {/* Barre principale                                                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="space-y-3">
        {/* Ligne 1 : recherche + bouton filtres */}
        <div className="flex items-center gap-2">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ct-text-muted)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={localQ}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full bg-[var(--ct-surface)] border border-[var(--ct-border)] rounded-xl pl-9 pr-4 py-2 text-sm text-[var(--ct-text)] placeholder:text-[var(--ct-text-muted)] focus:outline-none focus:border-[var(--ct-primary)] transition-colors"
              aria-label="Rechercher un produit"
            />
          </div>

          {/* Bouton filtres avancés */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={[
              'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors whitespace-nowrap',
              activeFilterCount > 0
                ? 'border-[var(--ct-primary)] text-[var(--ct-primary)]'
                : 'bg-[var(--ct-surface)] border-[var(--ct-border)] text-[var(--ct-text-muted)] hover:text-[var(--ct-text)]',
            ].join(' ')}
            aria-label="Filtres avancés"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {activeFilterCount > 0 && (
              <span className="ml-0.5 text-xs rounded-full h-4 w-4 flex items-center justify-center" style={{ backgroundColor: 'var(--ct-primary)', color: 'var(--ct-primary-fg)' }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Tri */}
          <select
            value={activeSort ?? ''}
            onChange={(e) => navigate({ sort: e.target.value || undefined })}
            className="bg-[var(--ct-surface)] border border-[var(--ct-border)] rounded-xl px-3 py-2 text-sm text-[var(--ct-text)] focus:outline-none focus:border-[var(--ct-primary)] transition-colors cursor-pointer"
            aria-label="Trier les produits"
          >
            <option value="">Tri par défaut</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="name_asc">Nom A→Z</option>
          </select>
        </div>

        {/* Ligne 2 : pills catégories */}
        {categories.length > 0 && (
          <nav
            aria-label="Filtrer par catégorie"
            className="overflow-x-auto scrollbar-hide -mx-4 px-4"
          >
            <div className="flex gap-2 flex-nowrap w-max">
              <a
                href={buildUrl(catalogBase, searchParams, { cat: undefined })}
                aria-current={!activeCategory ? 'page' : undefined}
                className={pill(!activeCategory)}
              >
                Tous
                <span className="tabular-nums text-[var(--ct-text-muted)] ml-1">{totalAvailable}</span>
              </a>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={buildUrl(catalogBase, searchParams, { cat: cat.slug })}
                  aria-current={activeCategory === cat.slug ? 'page' : undefined}
                  className={pill(activeCategory === cat.slug)}
                >
                  {cat.name}
                  <span className="tabular-nums text-[var(--ct-text-muted)] ml-1">{cat.product_count}</span>
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Ligne 3 : pills marques (si au moins une marque) */}
        {brands.length > 0 && (
          <nav
            aria-label="Filtrer par marque"
            className="overflow-x-auto scrollbar-hide -mx-4 px-4"
          >
            <div className="flex gap-2 flex-nowrap w-max">
              <a
                href={buildUrl(catalogBase, searchParams, { brand: undefined })}
                aria-current={!activeBrand ? 'page' : undefined}
                className={pill(!activeBrand)}
              >
                Toutes marques
              </a>
              {brands.map((b) => (
                <a
                  key={b.id}
                  href={buildUrl(catalogBase, searchParams, { brand: b.slug })}
                  aria-current={activeBrand === b.slug ? 'page' : undefined}
                  className={pill(activeBrand === b.slug)}
                >
                  {b.name}
                  <span className="tabular-nums text-[var(--ct-text-muted)] ml-1">{b.product_count}</span>
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Chips filtres actifs */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {activeQ && (
              <ActiveChip
                label={`"${activeQ}"`}
                onRemove={() => { setLocalQ(''); navigate({ q: undefined }) }}
              />
            )}
            {activeBrand && (
              <ActiveChip
                label={brands.find((b) => b.slug === activeBrand)?.name ?? activeBrand}
                onRemove={() => navigate({ brand: undefined })}
              />
            )}
            {(activeMin || activeMax) && (
              <ActiveChip
                label={`${activeMin ? activeMin + '€' : '0€'} – ${activeMax ? activeMax + '€' : '∞'}`}
                onRemove={() => { setLocalMin(''); setLocalMax(''); navigate({ min: undefined, max: undefined }) }}
              />
            )}
            {activeSort && (
              <ActiveChip
                label={{ price_asc: 'Prix ↑', price_desc: 'Prix ↓', name_asc: 'A→Z' }[activeSort] ?? activeSort}
                onRemove={() => navigate({ sort: undefined })}
              />
            )}
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-[var(--ct-text-muted)] hover:text-[var(--ct-text)] transition-colors underline underline-offset-2"
            >
              Tout effacer
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Drawer filtres avancés (mobile + desktop)                            */}
      {/* ------------------------------------------------------------------- */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="Filtres avancés">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md bg-[var(--ct-surface)] border border-[var(--ct-border)] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--ct-text)]">Filtres</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[var(--ct-text-muted)] hover:text-[var(--ct-text)] transition-colors"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Fourchette prix */}
            <div>
              <p className="text-xs font-medium text-[var(--ct-text-muted)] mb-3">Fourchette de prix</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label htmlFor="price-min" className="sr-only">Prix minimum (€)</label>
                  <input
                    id="price-min"
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Min €"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    className="w-full bg-[var(--ct-bg)] border border-[var(--ct-border)] rounded-lg px-3 py-2 text-sm text-[var(--ct-text)] placeholder:text-[var(--ct-text-muted)] focus:outline-none focus:border-[var(--ct-primary)] transition-colors"
                  />
                </div>
                <span className="text-[var(--ct-text-muted)]">–</span>
                <div className="flex-1">
                  <label htmlFor="price-max" className="sr-only">Prix maximum (€)</label>
                  <input
                    id="price-max"
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Max €"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    className="w-full bg-[var(--ct-bg)] border border-[var(--ct-border)] rounded-lg px-3 py-2 text-sm text-[var(--ct-text)] placeholder:text-[var(--ct-text-muted)] focus:outline-none focus:border-[var(--ct-primary)] transition-colors"
                  />
                </div>
              </div>
              <p className="text-xs text-[var(--ct-text-muted)] mt-2">Entrez des montants en euros (ex : 10, 50)</p>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[var(--ct-text-muted)] hover:text-[var(--ct-text)] transition-colors rounded-lg"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handlePriceApply}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: 'var(--ct-primary)', color: 'var(--ct-primary-fg)' }}
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Helpers UI
// ---------------------------------------------------------------------------

function pill(active: boolean): string {
  return [
    'inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ct-primary)]',
    active
      ? 'bg-[var(--ct-primary)] text-[var(--ct-primary-fg)] font-semibold shadow-sm'
      : 'bg-[var(--ct-surface)] border border-[var(--ct-border)] text-[var(--ct-text-muted)] hover:text-[var(--ct-text)] hover:border-[var(--ct-primary)]',
  ].join(' ')
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium text-[var(--ct-primary)]" style={{ borderColor: 'var(--ct-primary)', backgroundColor: 'color-mix(in srgb, var(--ct-primary) 12%, transparent)' }}>
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-[var(--ct-primary)] hover:opacity-60 transition-opacity"
        aria-label={`Retirer le filtre ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

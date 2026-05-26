'use client'

import { useState, useTransition } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { updateMerchantProfile } from '@/lib/actions/dashboard'
import {
  ACTIVITIES,
  ACTIVITY_GROUPS,
  THEMES,
  getRecommendedThemes,
  type Theme,
} from '@/lib/merchant-themes'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SettingsProfileFormProps {
  activity_type: string | null
  catalog_theme: string
}

// ---------------------------------------------------------------------------
// Sous-composant : carte de thème
// ---------------------------------------------------------------------------

function ThemeCard({
  theme,
  selected,
  onSelect,
}: {
  theme: Theme
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      title={theme.description}
      className={`relative group flex flex-col gap-2 p-3 rounded-xl border transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        selected
          ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
          : 'border-white/10 bg-neutral-800/60 hover:border-white/25 hover:bg-neutral-800'
      }`}
    >
      {/* Aperçu couleurs */}
      <div className="flex gap-1.5 items-center">
        <span
          className="h-5 w-5 rounded-full border border-white/10 shrink-0"
          style={{ background: theme.colors.bg }}
        />
        <span
          className="h-5 w-5 rounded-full border border-white/10 shrink-0"
          style={{ background: theme.colors.primary }}
        />
        <span
          className="h-5 flex-1 rounded border border-white/10"
          style={{ background: theme.colors.surface }}
        />
      </div>

      {/* Nom */}
      <span className="text-xs font-medium text-white leading-tight line-clamp-1">
        {theme.name}
      </span>

      {/* Indicateur sélection */}
      {selected && (
        <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center">
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function SettingsProfileForm({
  activity_type,
  catalog_theme,
}: SettingsProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const [selectedActivity, setSelectedActivity] = useState(activity_type ?? '')
  const [selectedTheme, setSelectedTheme] = useState(catalog_theme || 'indigo-pro')

  const orderedThemes = selectedActivity
    ? getRecommendedThemes(selectedActivity)
    : THEMES

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFeedback(null)
    const formData = new FormData(e.currentTarget)
    formData.set('activity_type', selectedActivity)
    formData.set('catalog_theme', selectedTheme)

    startTransition(async () => {
      const result = await updateMerchantProfile(formData)
      if ('error' in result) {
        setFeedback({ type: 'error', message: result.error })
      } else {
        setFeedback({ type: 'success', message: 'Profil mis à jour.' })
      }
    })
  }

  const currentThemeObj = THEMES.find((t) => t.id === selectedTheme)

  return (
    <section className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-base font-semibold text-white">Profil & Thème</h2>
        <p className="text-sm text-neutral-500 mt-0.5">
          Votre secteur d&apos;activité et l&apos;apparence de votre catalogue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
        {/* ------------------------------------------------------------------ */}
        {/* Activité principale                                                  */}
        {/* ------------------------------------------------------------------ */}
        <div>
          <label
            htmlFor="activity-select"
            className="block text-xs font-medium text-neutral-400 mb-1.5"
          >
            Secteur d&apos;activité
          </label>
          <select
            id="activity-select"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors appearance-none"
          >
            <option value="">— Choisir votre activité —</option>
            {ACTIVITY_GROUPS.map((group) => (
              <optgroup key={group} label={group}>
                {ACTIVITIES.filter((a) => a.group === group).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {selectedActivity && (
            <p className="text-xs text-indigo-400 mt-1">
              Les thèmes recommandés pour votre activité sont affichés en premier.
            </p>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Thème du catalogue                                                   */}
        {/* ------------------------------------------------------------------ */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-neutral-400">
              Thème du catalogue
            </p>
            {currentThemeObj && (
              <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 rounded-full border border-white/10"
                  style={{ background: currentThemeObj.colors.primary }}
                />
                {currentThemeObj.name}
                {currentThemeObj.isDark ? ' · sombre' : ' · clair'}
              </span>
            )}
          </div>

          {/* Grille 30 thèmes — 3 colonnes sur mobile, 5 sur desktop */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
            {orderedThemes.map((theme, idx) => {
              const isRecommended =
                selectedActivity && theme.recommended.includes(selectedActivity)
              return (
                <div key={theme.id} className="relative">
                  {isRecommended && idx === 0 && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10 text-[9px] font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                      ★ conseillé
                    </span>
                  )}
                  <ThemeCard
                    theme={theme}
                    selected={selectedTheme === theme.id}
                    onSelect={() => setSelectedTheme(theme.id)}
                  />
                </div>
              )
            })}
          </div>

          {/* Aperçu couleurs du thème sélectionné */}
          {currentThemeObj && (
            <div
              className="mt-3 rounded-lg border border-white/10 overflow-hidden"
              style={{ background: currentThemeObj.colors.bg }}
            >
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-full border border-white/20"
                    style={{ background: currentThemeObj.colors.surface }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: currentThemeObj.colors.text }}
                  >
                    {currentThemeObj.name}
                  </span>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-md"
                  style={{
                    background: currentThemeObj.colors.primary,
                    color: currentThemeObj.colors.primaryFg,
                  }}
                >
                  Commander
                </span>
              </div>
              <div
                className="px-4 py-2 border-t"
                style={{ borderColor: currentThemeObj.colors.border }}
              >
                <p className="text-xs" style={{ color: currentThemeObj.colors.textMuted }}>
                  {currentThemeObj.description}
                </p>
              </div>
            </div>
          )}
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
    </section>
  )
}

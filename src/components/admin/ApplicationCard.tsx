'use client'

import { useTransition, useState, useId } from 'react'
import { CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { approveApplication, rejectApplication } from '@/lib/actions/admin'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApplicationCardProps {
  id: string
  applicant_name: string
  applicant_email: string
  company_name: string | null
  message: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

function slugifyEmail(email: string): string {
  const prefix = email.split('@')[0] ?? ''
  return prefix
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function ApplicationCard({
  id,
  applicant_name,
  applicant_email,
  company_name,
  message,
  created_at,
}: ApplicationCardProps) {
  const uid = useId()
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [slug, setSlug] = useState(() => slugifyEmail(applicant_email))
  const [accessCode, setAccessCode] = useState(() => generateAccessCode())
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [approvePending, startApprove] = useTransition()
  const [rejectPending, startReject] = useTransition()

  const isPending = approvePending || rejectPending

  function handleApprove(formData: FormData) {
    startApprove(async () => {
      const result = await approveApplication(formData)
      if ('error' in result) {
        setFeedback({ type: 'error', message: result.error })
      } else {
        setFeedback({ type: 'success', message: 'Candidature approuvée. Email de bienvenue envoyé.' })
        setApproveOpen(false)
      }
    })
  }

  function handleReject(formData: FormData) {
    startReject(async () => {
      const result = await rejectApplication(formData)
      if ('error' in result) {
        setFeedback({ type: 'error', message: result.error })
      } else {
        setFeedback({ type: 'success', message: 'Candidature refusée.' })
        setRejectOpen(false)
      }
    })
  }

  return (
    <article
      className="bg-neutral-900 border border-white/5 rounded-xl p-5 space-y-4"
      aria-label={`Candidature de ${applicant_name}`}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{applicant_name}</p>
          <p className="text-xs text-neutral-400 truncate">{applicant_email}</p>
          {company_name && (
            <p className="text-xs text-neutral-500 mt-0.5 truncate">{company_name}</p>
          )}
        </div>
        <time
          dateTime={created_at}
          className="text-xs text-neutral-500 flex-shrink-0"
        >
          {formatDate(created_at)}
        </time>
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
          {message}
        </p>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          role="alert"
          className={[
            'flex items-center gap-2 text-sm rounded-lg px-3 py-2',
            feedback.type === 'success'
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400',
          ].join(' ')}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          ) : (
            <XCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Actions — seulement si pas de feedback succès */}
      {feedback?.type !== 'success' && (
        <div className="space-y-3">
          {/* Bouton Approuver */}
          <div>
            <button
              type="button"
              onClick={() => { setApproveOpen((v) => !v); setRejectOpen(false) }}
              disabled={isPending}
              aria-expanded={approveOpen}
              aria-controls={`${uid}-approve-form`}
              className="flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
              Approuver
              {approveOpen ? (
                <ChevronUp className="h-3 w-3" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              )}
            </button>

            {approveOpen && (
              <form
                id={`${uid}-approve-form`}
                action={handleApprove}
                className="mt-3 space-y-3 bg-neutral-800/60 rounded-lg p-4 border border-white/5"
              >
                <input type="hidden" name="application_id" value={id} />

                {/* Slug */}
                <div>
                  <label
                    htmlFor={`${uid}-slug`}
                    className="block text-xs font-medium text-neutral-300 mb-1"
                  >
                    Slug marchand
                    <span className="text-neutral-500 font-normal ml-1">(URL du catalogue)</span>
                  </label>
                  <input
                    id={`${uid}-slug`}
                    name="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    minLength={1}
                    maxLength={50}
                    pattern="[a-z0-9][a-z0-9\-]*[a-z0-9]|[a-z0-9]"
                    placeholder="ex: boutique-paris"
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Lettres minuscules, chiffres et tirets uniquement.
                  </p>
                </div>

                {/* Code d'accès */}
                <div>
                  <label
                    htmlFor={`${uid}-access-code`}
                    className="block text-xs font-medium text-neutral-300 mb-1"
                  >
                    Code d&apos;accès catalogue
                    <span className="text-neutral-500 font-normal ml-1">(partagé avec les clients)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={`${uid}-access-code`}
                      name="access_code"
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      required
                      minLength={4}
                      maxLength={20}
                      className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setAccessCode(generateAccessCode())}
                      className="px-3 py-2 text-xs text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-white/5 transition-colors"
                    >
                      Générer
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    4 à 20 caractères alphanumériques.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={approvePending}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {approvePending && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  Confirmer l&apos;approbation
                </button>
              </form>
            )}
          </div>

          {/* Bouton Refuser */}
          <div>
            <button
              type="button"
              onClick={() => { setRejectOpen((v) => !v); setApproveOpen(false) }}
              disabled={isPending}
              aria-expanded={rejectOpen}
              aria-controls={`${uid}-reject-form`}
              className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Refuser
              {rejectOpen ? (
                <ChevronUp className="h-3 w-3" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              )}
            </button>

            {rejectOpen && (
              <form
                id={`${uid}-reject-form`}
                action={handleReject}
                className="mt-3 space-y-3 bg-neutral-800/60 rounded-lg p-4 border border-white/5"
              >
                <input type="hidden" name="application_id" value={id} />

                {/* Motif (optionnel) */}
                <div>
                  <label
                    htmlFor={`${uid}-reason`}
                    className="block text-xs font-medium text-neutral-300 mb-1"
                  >
                    Motif du refus
                    <span className="text-neutral-500 font-normal ml-1">(optionnel, non envoyé au candidat)</span>
                  </label>
                  <textarea
                    id={`${uid}-reason`}
                    name="reason"
                    rows={3}
                    maxLength={500}
                    placeholder="Notes internes sur le refus..."
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rejectPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {rejectPending && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  Confirmer le refus
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

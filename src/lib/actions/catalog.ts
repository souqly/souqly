'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { UnlockResult } from '@/lib/types/catalog'

// ---------------------------------------------------------------------------
// Schémas de validation Zod
// ---------------------------------------------------------------------------

const unlockSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug requis')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug invalide'),
  code: z
    .string()
    .min(4, 'Le code doit comporter au moins 4 caractères')
    .max(20, 'Le code ne peut pas dépasser 20 caractères')
    .regex(/^[a-zA-Z0-9]+$/, 'Le code ne doit contenir que des caractères alphanumériques'),
})

const cartStatsSchema = z.object({
  merchantId: z.string().uuid(),
  productCount: z.number().int().min(1),
  totalCents: z.number().int().min(0),
  channel: z.enum(['whatsapp', 'telegram']),
})

// ---------------------------------------------------------------------------
// unlockCatalog
// ---------------------------------------------------------------------------

/**
 * Valide le code d'accès d'un catalogue marchand.
 *
 * - Appelle la RPC `unlock_catalog` côté Supabase (vérification bcrypt + création session)
 * - En cas de succès : pose un cookie httpOnly `catalog_session_[slug]`
 * - Retourne { success: true } ou { success: false, error: string }
 *
 * Note : le rate limiting est géré côté Supabase (RPC) ou à ajouter via
 * un middleware Upstash si nécessaire (coordination avec security-reviewer).
 */
export async function unlockCatalog(
  slug: string,
  code: string,
): Promise<{ success: boolean; error?: string }> {
  // 1. Validation des inputs
  const parsed = unlockSchema.safeParse({ slug, code })
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Données invalides'
    return { success: false, error: firstError }
  }

  // 2. Récupération de l'IP et du User-Agent depuis les headers Next.js
  //    (disponibles uniquement en contexte Server Action / Route Handler)
  let ipAddress = 'unknown'
  let userAgent = 'unknown'
  try {
    const { headers } = await import('next/headers')
    const headersList = await headers()
    ipAddress =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      headersList.get('x-real-ip') ??
      'unknown'
    userAgent = headersList.get('user-agent') ?? 'unknown'
  } catch {
    // En dehors d'un contexte de requête — fallback silencieux
  }

  // 3. Appel RPC Supabase
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('unlock_catalog', {
    merchant_slug: parsed.data.slug,
    code_attempt: parsed.data.code,
    p_ip: ipAddress,
    p_user_agent: userAgent,
  })

  if (error) {
    console.error('[unlockCatalog] RPC error:', error.message)
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  const result = data as UnlockResult

  if ('error' in result) {
    // Erreur métier retournée par la RPC (code invalide, catalogue inactif, etc.)
    return { success: false, error: 'Code invalide. Veuillez réessayer.' }
  }

  // 4. Calcul de la durée du cookie (calée sur expires_at RPC)
  const expiresAt = new Date(result.expires_at)
  const now = new Date()
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000))

  // 5. Pose du cookie httpOnly sécurisé
  const cookieStore = await cookies()
  cookieStore.set(`catalog_session_${parsed.data.slug}`, result.session_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
    expires: expiresAt,
  })

  return { success: true }
}

// ---------------------------------------------------------------------------
// submitCartStats
// ---------------------------------------------------------------------------

/**
 * Insère une ligne de stats dans `cart_submissions`.
 * Fire-and-forget : ne propage jamais d'erreur vers le client.
 */
export async function submitCartStats(
  merchantId: string,
  productCount: number,
  totalCents: number,
  channel: 'whatsapp' | 'telegram',
): Promise<void> {
  const parsed = cartStatsSchema.safeParse({ merchantId, productCount, totalCents, channel })
  if (!parsed.success) {
    // Données invalides — on log silencieusement
    console.warn('[submitCartStats] Données invalides:', parsed.error.issues)
    return
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('cart_submissions').insert({
      merchant_id: parsed.data.merchantId,
      product_count: parsed.data.productCount,
      total_cents: parsed.data.totalCents,
      channel: parsed.data.channel,
    })

    if (error) {
      console.warn('[submitCartStats] Erreur insertion:', error.message)
    }
  } catch (err) {
    // Fire and forget — jamais de throw
    console.warn('[submitCartStats] Exception:', err)
  }
}

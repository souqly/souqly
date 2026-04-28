'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSiteUrl } from '@/lib/env'
import {
  sendMerchantApprovedEmail,
  sendMerchantRejectedEmail,
} from '@/lib/utils/email'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AdminActionResult = { success: true } | { error: string }

// ---------------------------------------------------------------------------
// Helper — vérifie que l'utilisateur est super_admin
// ---------------------------------------------------------------------------

async function getAdminUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  const isAdmin = user.app_metadata?.role === 'super_admin'
  if (!isAdmin) {
    redirect('/dashboard')
  }

  return user
}

// ---------------------------------------------------------------------------
// Schémas Zod
// ---------------------------------------------------------------------------

const approveSchema = z.object({
  application_id: z.string().uuid('Identifiant de candidature invalide.'),
  slug: z
    .string()
    .min(1, 'Le slug est requis.')
    .max(50, 'Le slug ne doit pas dépasser 50 caractères.')
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/,
      'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets.',
    ),
  access_code: z
    .string()
    .min(4, 'Le code d\'accès doit contenir au moins 4 caractères.')
    .max(20, 'Le code d\'accès ne doit pas dépasser 20 caractères.')
    .regex(/^[a-zA-Z0-9]+$/, 'Le code d\'accès ne peut contenir que des lettres et chiffres.'),
})

const rejectSchema = z.object({
  application_id: z.string().uuid('Identifiant de candidature invalide.'),
  reason: z.string().max(500, 'La raison ne doit pas dépasser 500 caractères.').optional(),
})

const merchantIdSchema = z.object({
  merchant_id: z.string().uuid('Identifiant marchand invalide.'),
})

// ---------------------------------------------------------------------------
// RPC return type
// ---------------------------------------------------------------------------

type ApproveRPCSuccess = {
  merchant_id: string
  user_id: string
  email: string
  name: string
}

type ApproveRPCResult = ApproveRPCSuccess | { error: string }

// ---------------------------------------------------------------------------
// approveApplication
// ---------------------------------------------------------------------------

export async function approveApplication(
  formData: FormData,
): Promise<AdminActionResult> {
  await getAdminUser()

  const raw = {
    application_id: formData.get('application_id'),
    slug: formData.get('slug'),
    access_code: formData.get('access_code'),
  }

  const parsed = approveSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Données invalides.'
    return { error: firstError }
  }

  const { application_id, slug, access_code } = parsed.data

  const admin = createAdminClient()

  const { data: rpcData, error: rpcError } = await admin.rpc('approve_merchant', {
    p_application_id: application_id,
    p_slug: slug,
    p_access_code: access_code,
  })

  if (rpcError) {
    return { error: rpcError.message }
  }

  const result = rpcData as ApproveRPCResult

  if ('error' in result) {
    return { error: result.error }
  }

  // Envoi de l'email de bienvenue (fire-and-forget : ne pas bloquer en cas d'échec email)
  const loginUrl = `${getSiteUrl()}/login`
  sendWelcomeEmail(result.email, result.name, loginUrl).catch(() => {})

  revalidatePath('/admin/candidatures')

  return { success: true }
}

// ---------------------------------------------------------------------------
// rejectApplication
// ---------------------------------------------------------------------------

export async function rejectApplication(
  formData: FormData,
): Promise<AdminActionResult> {
  await getAdminUser()

  const raw = {
    application_id: formData.get('application_id'),
    reason: formData.get('reason') || undefined,
  }

  const parsed = rejectSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Données invalides.'
    return { error: firstError }
  }

  const { application_id, reason } = parsed.data

  const admin = createAdminClient()

  const { error } = await admin
    .from('merchant_applications')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      ...(reason !== undefined ? { rejection_reason: reason } : {}),
    })
    .eq('id', application_id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/candidatures')

  return { success: true }
}

// ---------------------------------------------------------------------------
// suspendMerchant
// ---------------------------------------------------------------------------

export async function suspendMerchant(
  formData: FormData,
): Promise<AdminActionResult> {
  await getAdminUser()

  const raw = { merchant_id: formData.get('merchant_id') }

  const parsed = merchantIdSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Données invalides.'
    return { error: firstError }
  }

  const { merchant_id } = parsed.data

  const admin = createAdminClient()

  const { error } = await admin
    .from('merchants')
    .update({ status: 'suspended' })
    .eq('id', merchant_id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/marchands')

  return { success: true }
}

// ---------------------------------------------------------------------------
// reactivateMerchant
// ---------------------------------------------------------------------------

export async function reactivateMerchant(
  formData: FormData,
): Promise<AdminActionResult> {
  await getAdminUser()

  const raw = { merchant_id: formData.get('merchant_id') }

  const parsed = merchantIdSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Données invalides.'
    return { error: firstError }
  }

  const { merchant_id } = parsed.data

  const admin = createAdminClient()

  const { error } = await admin
    .from('merchants')
    .update({ status: 'active' })
    .eq('id', merchant_id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/marchands')

  return { success: true }
}

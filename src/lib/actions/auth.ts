'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { sendApplicationReceivedEmail } from '@/lib/emails/send'
import { getSiteUrl } from '@/lib/env'

// ---------------------------------------------------------------------------
// Schémas Zod
// ---------------------------------------------------------------------------

const signUpSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.').max(100),
  email: z.string().email("L'adresse email est invalide."),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
    .max(128),
  company_name: z.string().max(200).optional(),
})

const signInSchema = z.object({
  email: z.string().email("L'adresse email est invalide."),
  password: z.string().min(1, 'Le mot de passe est requis.'),
})

const resetPasswordSchema = z.object({
  email: z.string().email("L'adresse email est invalide."),
})

// ---------------------------------------------------------------------------
// Types de retour
// ---------------------------------------------------------------------------

export type ActionResult =
  | { success: true; message?: string }
  | { error: string }

// ---------------------------------------------------------------------------
// signUp — inscription marchand
// ---------------------------------------------------------------------------

export async function signUp(formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    company_name: formData.get('company_name') || undefined,
  }

  const parsed = signUpSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Données invalides.'
    return { error: firstError }
  }

  const { name, email, password, company_name } = parsed.data

  const supabase = await createClient()

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        company_name: company_name ?? null,
      },
    },
  })

  if (authError) {
    // Ne pas exposer les messages d'erreur internes Supabase verbatim
    if (authError.message.toLowerCase().includes('already registered')) {
      return { error: 'Un compte existe déjà avec cet email.' }
    }
    // MED-5: ne pas exposer les messages d'erreur internes Supabase
    return { error: 'Une erreur est survenue lors de la création du compte.' }
  }

  // Soumettre la demande d'adhésion via RPC
  await supabase.rpc('submit_merchant_application', {
    applicant_email: email,
    applicant_name: name,
    company_name: company_name ?? null,
    message: null,
  })

  // Confirmation de réception — fire-and-forget, ne bloque pas l'inscription
  sendApplicationReceivedEmail(email, name).catch(() => {})

  return {
    success: true,
    message: 'Vérifiez votre email pour confirmer votre compte.',
  }
}

// ---------------------------------------------------------------------------
// signIn — connexion marchand
// ---------------------------------------------------------------------------

export async function signIn(formData: FormData): Promise<ActionResult> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = signInSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Email ou mot de passe incorrect.' }
  }

  const { email, password } = parsed.data

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email ou mot de passe incorrect.' }
  }

  return { success: true }
}

// ---------------------------------------------------------------------------
// signOut — déconnexion
// ---------------------------------------------------------------------------

export async function signOut(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// ---------------------------------------------------------------------------
// resetPassword — envoi du lien de réinitialisation
// ---------------------------------------------------------------------------

export async function resetPassword(formData: FormData): Promise<ActionResult> {
  const raw = { email: formData.get('email') }

  const parsed = resetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: "L'adresse email est invalide." }
  }

  const { email } = parsed.data

  const supabase = await createClient()

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
  })

  // Toujours retourner un succès : pas de fuite d'information sur l'existence du compte
  return {
    success: true,
    message: 'Si ce compte existe, un email a été envoyé.',
  }
}

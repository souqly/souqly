'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionResult = { success: true } | { error: string }
type ActionResultWithId = { success: true; id: string } | { error: string }
type ActionResultWithBool = { success: true; is_available: boolean } | { error: string }

type MerchantRow = {
  id: string
  user_id: string
}

// ---------------------------------------------------------------------------
// Helper — récupère le marchand du user authentifié
// ---------------------------------------------------------------------------

async function getMerchantForUser(userId: string): Promise<MerchantRow | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('merchants')
    .select('id, user_id')
    .eq('user_id', userId)
    .single<MerchantRow>()
  return data ?? null
}

async function getAuthenticatedMerchant(): Promise<
  { merchant: MerchantRow; userId: string } | { error: string }
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié.' }

  const merchant = await getMerchantForUser(user.id)
  if (!merchant) return { error: 'Marchand introuvable.' }

  return { merchant, userId: user.id }
}

// ---------------------------------------------------------------------------
// Utilitaire
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ---------------------------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------------------------

const createCategorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis.').max(50, 'Maximum 50 caractères.'),
  position: z.coerce.number().int().min(0).default(0),
})

export async function createCategory(
  formData: FormData,
): Promise<ActionResultWithId> {
  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const raw = {
    name: formData.get('name'),
    position: formData.get('position') ?? 0,
  }

  const parsed = createCategorySchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' }
  }

  const { name, position } = parsed.data
  const slug = slugify(name)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .insert({
      merchant_id: auth.merchant.id,
      name,
      slug,
      position,
    })
    .select('id')
    .single<{ id: string }>()

  if (error) {
    if (error.code === '23505') {
      return { error: 'Une catégorie avec ce nom existe déjà.' }
    }
    return { error: 'Erreur lors de la création de la catégorie.' }
  }

  revalidatePath('/dashboard/categories')
  return { success: true, id: data.id }
}

const updateCategorySchema = z.object({
  id: z.string().uuid('Identifiant invalide.'),
  name: z.string().min(1, 'Le nom est requis.').max(50, 'Maximum 50 caractères.'),
  position: z.coerce.number().int().min(0).default(0),
})

export async function updateCategory(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const raw = {
    id: formData.get('id'),
    name: formData.get('name'),
    position: formData.get('position') ?? 0,
  }

  const parsed = updateCategorySchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' }
  }

  const { id, name, position } = parsed.data

  const supabase = await createClient()

  // Vérifier l'appartenance
  const { data: existing } = await supabase
    .from('categories')
    .select('merchant_id')
    .eq('id', id)
    .single<{ merchant_id: string }>()

  if (!existing || existing.merchant_id !== auth.merchant.id) {
    return { error: 'Catégorie introuvable.' }
  }

  const { error } = await supabase
    .from('categories')
    .update({ name, position, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: 'Erreur lors de la mise à jour.' }

  revalidatePath('/dashboard/categories')
  return { success: true }
}

const deleteCategorySchema = z.object({
  id: z.string().uuid('Identifiant invalide.'),
})

export async function deleteCategory(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const raw = { id: formData.get('id') }
  const parsed = deleteCategorySchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' }
  }

  const { id } = parsed.data
  const supabase = await createClient()

  // Vérifier l'appartenance
  const { data: existing } = await supabase
    .from('categories')
    .select('merchant_id')
    .eq('id', id)
    .single<{ merchant_id: string }>()

  if (!existing || existing.merchant_id !== auth.merchant.id) {
    return { error: 'Catégorie introuvable.' }
  }

  // Dissocier les produits de cette catégorie
  await supabase
    .from('products')
    .update({ category_id: null })
    .eq('category_id', id)
    .eq('merchant_id', auth.merchant.id)

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) return { error: 'Erreur lors de la suppression.' }

  revalidatePath('/dashboard/categories')
  revalidatePath('/dashboard/produits')
  return { success: true }
}

// ---------------------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------------------

const createProductSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.').max(100, 'Maximum 100 caractères.'),
  description: z.string().max(2000, 'Maximum 2000 caractères.').optional(),
  price_cents: z.coerce
    .number()
    .int('Le prix doit être un entier.')
    .positive('Le prix doit être positif.'),
  reference: z.string().max(50, 'Maximum 50 caractères.').optional(),
  category_id: z.string().uuid().optional().nullable(),
  is_available: z.coerce.boolean().default(true),
  position: z.coerce.number().int().min(0).default(0),
})

export async function createProduct(
  formData: FormData,
): Promise<ActionResultWithId> {
  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const categoryIdRaw = formData.get('category_id')

  const raw = {
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    price_cents: formData.get('price_cents'),
    reference: formData.get('reference') || undefined,
    category_id: categoryIdRaw && categoryIdRaw !== '' ? categoryIdRaw : null,
    is_available: formData.get('is_available') ?? true,
    position: formData.get('position') ?? 0,
  }

  const parsed = createProductSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' }
  }

  const { name, description, price_cents, reference, category_id, is_available, position } =
    parsed.data

  // Si category_id fourni, vérifier qu'elle appartient au marchand
  if (category_id) {
    const supabase = await createClient()
    const { data: cat } = await supabase
      .from('categories')
      .select('merchant_id')
      .eq('id', category_id)
      .single<{ merchant_id: string }>()

    if (!cat || cat.merchant_id !== auth.merchant.id) {
      return { error: 'Catégorie invalide.' }
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .insert({
      merchant_id: auth.merchant.id,
      name,
      description: description ?? null,
      price_cents,
      reference: reference ?? null,
      category_id: category_id ?? null,
      is_available,
      position,
    })
    .select('id')
    .single<{ id: string }>()

  if (error) return { error: 'Erreur lors de la création du produit.' }

  revalidatePath('/dashboard/produits')
  return { success: true, id: data.id }
}

const updateProductSchema = z.object({
  id: z.string().uuid('Identifiant invalide.'),
  name: z.string().min(1, 'Le nom est requis.').max(100, 'Maximum 100 caractères.'),
  description: z.string().max(2000, 'Maximum 2000 caractères.').optional(),
  price_cents: z.coerce
    .number()
    .int('Le prix doit être un entier.')
    .positive('Le prix doit être positif.'),
  reference: z.string().max(50, 'Maximum 50 caractères.').optional(),
  category_id: z.string().uuid().optional().nullable(),
  is_available: z.coerce.boolean().default(true),
  position: z.coerce.number().int().min(0).default(0),
})

export async function updateProduct(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const categoryIdRaw = formData.get('category_id')

  const raw = {
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    price_cents: formData.get('price_cents'),
    reference: formData.get('reference') || undefined,
    category_id: categoryIdRaw && categoryIdRaw !== '' ? categoryIdRaw : null,
    is_available: formData.get('is_available') ?? true,
    position: formData.get('position') ?? 0,
  }

  const parsed = updateProductSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' }
  }

  const { id, name, description, price_cents, reference, category_id, is_available, position } =
    parsed.data

  const supabase = await createClient()

  // Vérifier l'appartenance
  const { data: existing } = await supabase
    .from('products')
    .select('merchant_id')
    .eq('id', id)
    .single<{ merchant_id: string }>()

  if (!existing || existing.merchant_id !== auth.merchant.id) {
    return { error: 'Produit introuvable.' }
  }

  // Si category_id fourni, vérifier l'appartenance
  if (category_id) {
    const { data: cat } = await supabase
      .from('categories')
      .select('merchant_id')
      .eq('id', category_id)
      .single<{ merchant_id: string }>()

    if (!cat || cat.merchant_id !== auth.merchant.id) {
      return { error: 'Catégorie invalide.' }
    }
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      description: description ?? null,
      price_cents,
      reference: reference ?? null,
      category_id: category_id ?? null,
      is_available,
      position,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: 'Erreur lors de la mise à jour du produit.' }

  revalidatePath('/dashboard/produits')
  return { success: true }
}

const deleteProductSchema = z.object({
  id: z.string().uuid('Identifiant invalide.'),
})

export async function deleteProduct(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const raw = { id: formData.get('id') }
  const parsed = deleteProductSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' }
  }

  const { id } = parsed.data
  const supabase = await createClient()

  // Vérifier l'appartenance
  const { data: existing } = await supabase
    .from('products')
    .select('merchant_id')
    .eq('id', id)
    .single<{ merchant_id: string }>()

  if (!existing || existing.merchant_id !== auth.merchant.id) {
    return { error: 'Produit introuvable.' }
  }

  // Supprimer les images (le CASCADE DB devrait gérer, mais on explicite)
  await supabase.from('product_images').delete().eq('product_id', id)

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: 'Erreur lors de la suppression du produit.' }

  revalidatePath('/dashboard/produits')
  return { success: true }
}

export async function toggleProductAvailability(
  id: string,
): Promise<ActionResultWithBool> {
  const idSchema = z.string().uuid('Identifiant invalide.')
  const parsed = idSchema.safeParse(id)
  if (!parsed.success) return { error: 'Identifiant invalide.' }

  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('products')
    .select('merchant_id, is_available')
    .eq('id', parsed.data)
    .single<{ merchant_id: string; is_available: boolean }>()

  if (!existing || existing.merchant_id !== auth.merchant.id) {
    return { error: 'Produit introuvable.' }
  }

  const newValue = !existing.is_available

  const { error } = await supabase
    .from('products')
    .update({ is_available: newValue, updated_at: new Date().toISOString() })
    .eq('id', parsed.data)

  if (error) return { error: 'Erreur lors de la mise à jour.' }

  revalidatePath('/dashboard/produits')
  return { success: true, is_available: newValue }
}

export async function reorderProducts(
  ids: string[],
): Promise<ActionResult> {
  const schema = z.array(z.string().uuid()).min(1)
  const parsed = schema.safeParse(ids)
  if (!parsed.success) return { error: 'Liste d\'identifiants invalide.' }

  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const supabase = await createClient()

  // Mettre à jour les positions en parallèle
  const updates = parsed.data.map((productId, index) =>
    supabase
      .from('products')
      .update({ position: index, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .eq('merchant_id', auth.merchant.id),
  )

  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed?.error) return { error: 'Erreur lors de la réorganisation.' }

  revalidatePath('/dashboard/produits')
  return { success: true }
}

// ---------------------------------------------------------------------------
// PRODUCT IMAGES
// ---------------------------------------------------------------------------

export async function addProductImage(
  productId: string,
  storagePath: string,
  isPrimary: boolean,
): Promise<ActionResultWithId> {
  const schema = z.object({
    productId: z.string().uuid(),
    storagePath: z.string().min(1),
    isPrimary: z.boolean(),
  })

  const parsed = schema.safeParse({ productId, storagePath, isPrimary })
  if (!parsed.success) return { error: 'Paramètres invalides.' }

  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const supabase = await createClient()

  // Vérifier que le produit appartient au marchand
  const { data: product } = await supabase
    .from('products')
    .select('merchant_id')
    .eq('id', parsed.data.productId)
    .single<{ merchant_id: string }>()

  if (!product || product.merchant_id !== auth.merchant.id) {
    return { error: 'Produit introuvable.' }
  }

  // Si primaire, réinitialiser les autres
  if (parsed.data.isPrimary) {
    await supabase
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', parsed.data.productId)
  }

  // Obtenir la position max
  const { data: maxPos } = await supabase
    .from('product_images')
    .select('position')
    .eq('product_id', parsed.data.productId)
    .order('position', { ascending: false })
    .limit(1)
    .single<{ position: number }>()

  const nextPosition = (maxPos?.position ?? -1) + 1

  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: parsed.data.productId,
      storage_path: parsed.data.storagePath,
      is_primary: parsed.data.isPrimary,
      position: nextPosition,
    })
    .select('id')
    .single<{ id: string }>()

  if (error) return { error: 'Erreur lors de l\'ajout de l\'image.' }

  revalidatePath('/dashboard/produits')
  return { success: true, id: data.id }
}

export async function deleteProductImage(
  imageId: string,
): Promise<ActionResult> {
  const schema = z.string().uuid()
  const parsed = schema.safeParse(imageId)
  if (!parsed.success) return { error: 'Identifiant invalide.' }

  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const supabase = await createClient()

  // Récupérer l'image avec son produit pour vérifier la propriété
  const { data: image } = await supabase
    .from('product_images')
    .select('id, product_id, is_primary, position, products(merchant_id)')
    .eq('id', parsed.data)
    .single<{
      id: string
      product_id: string
      is_primary: boolean
      position: number
      products: { merchant_id: string } | null
    }>()

  if (!image || image.products?.merchant_id !== auth.merchant.id) {
    return { error: 'Image introuvable.' }
  }

  const wasPrimary = image.is_primary
  const productId = image.product_id

  const { error } = await supabase.from('product_images').delete().eq('id', parsed.data)
  if (error) return { error: 'Erreur lors de la suppression de l\'image.' }

  // Si c'était l'image principale, promouvoir la suivante
  if (wasPrimary) {
    const { data: next } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', productId)
      .order('position', { ascending: true })
      .limit(1)
      .single<{ id: string }>()

    if (next) {
      await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', next.id)
    }
  }

  revalidatePath('/dashboard/produits')
  return { success: true }
}

export async function setPrimaryImage(
  imageId: string,
): Promise<ActionResult> {
  const schema = z.string().uuid()
  const parsed = schema.safeParse(imageId)
  if (!parsed.success) return { error: 'Identifiant invalide.' }

  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const supabase = await createClient()

  const { data: image } = await supabase
    .from('product_images')
    .select('id, product_id, products(merchant_id)')
    .eq('id', parsed.data)
    .single<{
      id: string
      product_id: string
      products: { merchant_id: string } | null
    }>()

  if (!image || image.products?.merchant_id !== auth.merchant.id) {
    return { error: 'Image introuvable.' }
  }

  // Réinitialiser toutes les images du produit
  await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', image.product_id)

  // Définir la nouvelle image principale
  const { error } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', parsed.data)

  if (error) return { error: 'Erreur lors de la mise à jour.' }

  revalidatePath('/dashboard/produits')
  return { success: true }
}

// ---------------------------------------------------------------------------
// SETTINGS
// ---------------------------------------------------------------------------

const updateMerchantSettingsSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.').max(100, 'Maximum 100 caractères.'),
  description: z.string().max(500, 'Maximum 500 caractères.').optional(),
  whatsapp_number: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Format E.164 requis (ex: +33612345678).')
    .optional()
    .or(z.literal('')),
  telegram_username: z
    .string()
    .regex(/^[a-zA-Z0-9_]{0,32}$/, 'Nom d\'utilisateur invalide (alphanumérique + underscore, max 32).')
    .optional()
    .or(z.literal('')),
  message_template: z.string().max(2000, 'Maximum 2000 caractères.').optional(),
})

export async function updateMerchantSettings(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const raw = {
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    whatsapp_number: formData.get('whatsapp_number') ?? '',
    telegram_username: formData.get('telegram_username') ?? '',
    message_template: formData.get('message_template') || undefined,
  }

  const parsed = updateMerchantSettingsSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' }
  }

  const { name, description, whatsapp_number, telegram_username, message_template } = parsed.data

  const supabase = await createClient()
  const { error } = await supabase
    .from('merchants')
    .update({
      name,
      description: description ?? null,
      whatsapp_number: whatsapp_number || null,
      telegram_username: telegram_username || null,
      message_template: message_template ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', auth.merchant.id)

  if (error) return { error: 'Erreur lors de la mise à jour des paramètres.' }

  revalidatePath('/dashboard/parametres')
  revalidatePath('/dashboard')
  return { success: true }
}

const updateAccessCodeSchema = z.object({
  new_code: z
    .string()
    .min(4, 'Le code doit contenir au moins 4 caractères.')
    .max(20, 'Le code ne peut pas dépasser 20 caractères.')
    .regex(/^[a-zA-Z0-9]+$/, 'Le code doit être alphanumérique uniquement.'),
})

export async function updateAccessCode(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getAuthenticatedMerchant()
  if ('error' in auth) return auth

  const raw = { new_code: formData.get('new_code') }
  const parsed = updateAccessCodeSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Code invalide.' }
  }

  const { new_code } = parsed.data
  const supabase = await createClient()

  // Appel RPC pour hasher et sauvegarder le code
  const { error: rpcError } = await supabase.rpc('set_access_code', {
    p_merchant_id: auth.merchant.id,
    p_new_code: new_code,
  })

  if (rpcError) return { error: 'Erreur lors de la mise à jour du code d\'accès.' }

  // Invalider toutes les sessions en cours des visiteurs
  await supabase.rpc('invalidate_all_sessions', {
    p_merchant_id: auth.merchant.id,
  })

  revalidatePath('/dashboard/parametres')
  return { success: true }
}

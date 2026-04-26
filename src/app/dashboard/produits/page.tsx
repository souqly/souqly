import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductsClient } from '@/components/dashboard/ProductsClient'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Produits — Dashboard Souqly',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProductImageRow = {
  id: string
  storage_path: string
  is_primary: boolean
  position: number
}

type ProductRow = {
  id: string
  name: string
  description: string | null
  reference: string | null
  price_cents: number
  is_available: boolean
  position: number
  category_id: string | null
  product_images: ProductImageRow[]
}

type CategoryOption = {
  id: string
  name: string
}

type MerchantRow = {
  id: string
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

export default async function ProduitsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard/produits')

  const { data: merchant } = await supabase
    .from('merchants')
    .select('id')
    .eq('user_id', user.id)
    .single<MerchantRow>()

  if (!merchant) redirect('/dashboard')

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select(
        'id, name, description, reference, price_cents, is_available, position, category_id, product_images(id, storage_path, is_primary, position)',
      )
      .eq('merchant_id', merchant.id)
      .order('position', { ascending: true }),
    supabase
      .from('categories')
      .select('id, name')
      .eq('merchant_id', merchant.id)
      .order('name', { ascending: true }),
  ])

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <ProductsClient
        products={(products as ProductRow[]) ?? []}
        categories={(categories as CategoryOption[]) ?? []}
        merchantId={merchant.id}
      />
    </div>
  )
}

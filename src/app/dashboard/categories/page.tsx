import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CategoriesClient } from '@/components/dashboard/CategoriesClient'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Catégories — Dashboard Souqly',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CategoryRow = {
  id: string
  name: string
  slug: string
  position: number
  cover_image_url: string | null
  product_count: number
}

type MerchantRow = {
  id: string
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

export default async function CategoriesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard/categories')

  const { data: merchant } = await supabase
    .from('merchants')
    .select('id')
    .eq('user_id', user.id)
    .single<MerchantRow>()

  if (!merchant) redirect('/dashboard')

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, position, cover_image_url, product_count')
    .eq('merchant_id', merchant.id)
    .order('position', { ascending: true })

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <CategoriesClient
        categories={(categories as CategoryRow[]) ?? []}
        merchantId={merchant.id}
      />
    </div>
  )
}

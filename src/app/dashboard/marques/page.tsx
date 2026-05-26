import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BrandsClient } from '@/components/dashboard/BrandsClient'

export const metadata: Metadata = {
  title: 'Marques — Dashboard Souqly',
}

type BrandRow = {
  id: string
  name: string
  slug: string
  position: number
  product_count: number
}

type MerchantRow = {
  id: string
}

export default async function MarquesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard/marques')

  const { data: merchant } = await supabase
    .from('merchants')
    .select('id')
    .eq('user_id', user.id)
    .single<MerchantRow>()

  if (!merchant) redirect('/dashboard')

  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug, position, product_count:products(count)')
    .eq('merchant_id', merchant.id)
    .order('position', { ascending: true })

  // Normalise le product_count renvoyé par Supabase (aggregation)
  const normalizedBrands: BrandRow[] = (brands ?? []).map((b) => ({
    id: b.id as string,
    name: b.name as string,
    slug: b.slug as string,
    position: b.position as number,
    product_count: Array.isArray(b.product_count)
      ? (b.product_count[0] as { count: number })?.count ?? 0
      : (b.product_count as number) ?? 0,
  }))

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <BrandsClient brands={normalizedBrands} />
    </div>
  )
}

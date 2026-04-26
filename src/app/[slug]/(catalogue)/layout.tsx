import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CatalogProvider } from '@/context/catalog-context'
import type { CatalogData, CatalogResult } from '@/lib/types/catalog'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

// ---------------------------------------------------------------------------
// Layout protégé
// ---------------------------------------------------------------------------

/**
 * Layout du groupe route (catalogue) — Server Component.
 *
 * Protège toutes les routes enfants :
 *   /[slug]/catalogue
 *   /[slug]/categorie/[cat-slug]
 *   /[slug]/produit/[id]
 *   /[slug]/panier
 *
 * Workflow :
 *   1. Lit le cookie catalog_session_[slug]
 *   2. Si absent → redirect /[slug]
 *   3. Appelle get_catalog RPC pour valider la session et récupérer les données
 *   4. Si session invalide/expirée → redirect /[slug]
 *   5. Si session valide → injecte CatalogData dans le CatalogProvider
 *
 * Coordination : la RPC get_catalog est définie côté supabase-expert.
 */
export default async function CatalogueLayout({ children, params }: LayoutProps) {
  const { slug } = await params

  // 1. Lecture du cookie de session
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(`catalog_session_${slug}`)?.value

  if (!sessionToken) {
    redirect(`/${slug}`)
  }

  // 2. Appel RPC pour valider la session et récupérer le catalogue complet
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_catalog', {
    merchant_slug: slug,
    p_session_token: sessionToken,
  })

  if (error) {
    console.error('[CatalogueLayout] RPC get_catalog error:', error.message)
    redirect(`/${slug}`)
  }

  const result = data as CatalogResult | null

  if (!result || 'error' in result) {
    // Session invalide, expirée ou marchand inactif
    redirect(`/${slug}`)
  }

  const catalogData = result as CatalogData

  // 3. Injection des données dans le Context via le Provider client
  return <CatalogProvider data={catalogData}>{children}</CatalogProvider>
}

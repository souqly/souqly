import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { CodeAccessForm } from '@/components/catalog/CodeAccessForm'
import type { CatalogResult } from '@/lib/types/catalog'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>
}

type MerchantRow = {
  name: string
  description: string | null
  logo_url: string | null
  status: string
  subscription_status: string
}

// ---------------------------------------------------------------------------
// Metadata dynamique
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('merchants')
    .select('name, description')
    .eq('slug', slug)
    .eq('status', 'active')
    .single<Pick<MerchantRow, 'name' | 'description'>>()

  if (!data) {
    return { title: 'Catalogue introuvable — Souqly' }
  }

  return {
    title: `${data.name} — Catalogue privé`,
    description: data.description ?? `Accédez au catalogue privé de ${data.name}`,
    robots: { index: false, follow: false }, // catalogues privés non indexables
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * Page d'accueil marchand — Server Component.
 *
 * Accessible SANS session (formulaire de saisie du code d'accès).
 * Si une session valide est déjà présente → redirect vers /[slug]/catalogue.
 */
export default async function MerchantHomePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Vérifier si une session catalogue valide existe déjà
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(`catalog_session_${slug}`)?.value

  if (sessionToken) {
    // Vérification légère : appel RPC pour confirmer la validité
    const { data: catalogData } = await supabase.rpc('get_catalog', {
      merchant_slug: slug,
      p_session_token: sessionToken,
    })

    const result = catalogData as CatalogResult | null
    if (result && !('error' in result)) {
      redirect(`/${slug}/catalogue`)
    }
    // Session invalide ou expirée — on continue vers le formulaire
  }

  // 2. Récupérer les données du marchand (colonnes explicites uniquement)
  const { data: merchant } = await supabase
    .from('merchants')
    .select('name, description, logo_url, status, subscription_status')
    .eq('slug', slug)
    .single<MerchantRow>()

  // 3. Vérifications de disponibilité du catalogue
  const allowedSubscriptions = ['trial', 'active']

  if (
    !merchant ||
    merchant.status !== 'active' ||
    !allowedSubscriptions.includes(merchant.subscription_status)
  ) {
    // Afficher une page 404 stylisée plutôt que le 404 Next.js par défaut
    return <CatalogUnavailablePage />
  }

  // 4. Affichage de la page d'accueil avec formulaire code d'accès
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* En-tête marchand */}
        <div className="flex flex-col items-center gap-4 text-center">
          {merchant.logo_url ? (
            <div className="relative h-24 w-24 rounded-2xl overflow-hidden ring-1 ring-white/10">
              <Image
                src={merchant.logo_url}
                alt={`Logo ${merchant.name}`}
                fill
                className="object-cover"
                priority
                sizes="96px"
              />
            </div>
          ) : (
            <div className="h-24 w-24 rounded-2xl bg-neutral-800 flex items-center justify-center ring-1 ring-white/10">
              <span className="text-3xl font-bold text-neutral-400">
                {merchant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-white">{merchant.name}</h1>
            {merchant.description && (
              <p className="mt-1 text-sm text-neutral-400 max-w-xs">{merchant.description}</p>
            )}
          </div>
        </div>

        {/* Formulaire code d'accès — Client Component */}
        <CodeAccessForm slug={slug} merchantName={merchant.name} />
      </div>
    </main>
  )
}

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

function CatalogUnavailablePage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="h-16 w-16 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-white">Catalogue indisponible</h1>
        <p className="text-sm text-neutral-400">
          Ce catalogue n&apos;est pas disponible pour le moment. Contactez le marchand pour plus d&apos;informations.
        </p>
      </div>
    </main>
  )
}

import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SettingsShopForm } from '@/components/dashboard/SettingsShopForm'
import { SettingsContactsForm } from '@/components/dashboard/SettingsContactsForm'
import { SettingsAccessCodeForm } from '@/components/dashboard/SettingsAccessCodeForm'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Paramètres — Dashboard Souqly',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MerchantSettings = {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  whatsapp_number: string | null
  telegram_username: string | null
  message_template: string | null
  subscription_status: string
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

export default async function ParametresPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard/parametres')

  const { data: settings } = await supabase
    .from('merchants')
    .select(
      'id, name, description, logo_url, whatsapp_number, telegram_username, message_template, subscription_status',
    )
    .eq('user_id', user.id)
    .single<MerchantSettings>()

  if (!settings) redirect('/dashboard')

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Configurez votre boutique, vos contacts et votre code d&apos;accès.
        </p>
      </div>

      {/* Section 1 : Infos boutique */}
      <SettingsShopForm
        merchantId={settings.id}
        name={settings.name}
        description={settings.description}
        logo_url={settings.logo_url}
      />

      {/* Section 2 : Contacts & Template */}
      <SettingsContactsForm
        name={settings.name}
        description={settings.description}
        whatsapp_number={settings.whatsapp_number}
        telegram_username={settings.telegram_username}
        message_template={settings.message_template}
      />

      {/* Section 3 : Code d'accès */}
      <SettingsAccessCodeForm />
    </div>
  )
}

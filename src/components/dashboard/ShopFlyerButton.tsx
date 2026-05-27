'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { ShopFlyerModal } from './ShopFlyerModal'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ShopFlyerButtonProps {
  merchantName: string
  merchantSlug: string
  merchantLogoUrl: string | null
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function ShopFlyerButton({ merchantName, merchantSlug, merchantLogoUrl }: ShopFlyerButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-sm font-medium rounded-lg transition-colors"
      >
        <ImageIcon className="h-4 w-4" />
        Créer un flyer
      </button>

      <ShopFlyerModal
        open={open}
        onClose={() => setOpen(false)}
        merchantName={merchantName}
        merchantSlug={merchantSlug}
        merchantLogoUrl={merchantLogoUrl}
      />
    </>
  )
}

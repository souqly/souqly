import Image from 'next/image'
import type { CatalogMerchant } from '@/lib/types/catalog'

interface MerchantHeaderProps {
  merchant: CatalogMerchant
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

// Génère une couleur de fond déterministe à partir du nom marchand
function getAvatarColor(name: string): string {
  const colors = [
    'bg-indigo-700',
    'bg-violet-700',
    'bg-cyan-700',
    'bg-teal-700',
    'bg-emerald-700',
    'bg-amber-700',
    'bg-rose-700',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return colors[Math.abs(hash) % colors.length]
}

export function MerchantHeader({ merchant }: MerchantHeaderProps) {
  const initials = getInitials(merchant.name)
  const avatarColor = getAvatarColor(merchant.name)

  return (
    <header
      className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800"
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo ou initiales */}
        <div className="flex-none" aria-hidden={merchant.logo_url ? 'false' : 'true'}>
          {merchant.logo_url ? (
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-slate-700">
              <Image
                src={merchant.logo_url}
                alt={`Logo de ${merchant.name}`}
                fill
                sizes="56px"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
            </div>
          ) : (
            <div
              className={[
                'flex items-center justify-center',
                'w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-slate-700',
                'text-white font-bold text-lg select-none',
                avatarColor,
              ].join(' ')}
              aria-label={`Initiales de ${merchant.name}`}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Nom + description */}
        <div className="flex-1 min-w-0">
          <h1 className="text-base md:text-lg font-semibold text-slate-50 truncate font-heading leading-tight">
            {merchant.name}
          </h1>
          {merchant.description && (
            <p className="text-xs md:text-sm text-slate-400 truncate mt-0.5 leading-snug">
              {merchant.description}
            </p>
          )}
        </div>
      </div>
    </header>
  )
}

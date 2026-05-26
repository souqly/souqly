import { Truck, Store, Package, MessageCircle, Send } from 'lucide-react'
import type { CatalogMerchant, Product } from '@/lib/types/catalog'
import { formatPrice } from '@/lib/utils/format'

interface DeliveryInfoProps {
  merchant: CatalogMerchant
  product: Product
}

function buildContactMessage(merchant: CatalogMerchant, product: Product): string {
  const price = formatPrice(product.price_cents)
  const ref = product.reference ? ` (Réf. ${product.reference})` : ''
  return `${merchant.message_template}\n\n🛍️ ${product.name}${ref} — ${price}`
}

export function DeliveryInfo({ merchant, product }: DeliveryInfoProps) {
  const hasDelivery =
    merchant.click_and_collect_enabled ||
    merchant.self_delivery_enabled ||
    merchant.colissimo_enabled
  const hasContact = merchant.whatsapp_number || merchant.telegram_username

  if (!hasDelivery && !hasContact) return null

  const message = buildContactMessage(merchant, product)
  const waNumber = merchant.whatsapp_number?.replace(/[^0-9]/g, '') ?? ''
  const tgUsername = merchant.telegram_username?.replace('@', '') ?? ''

  return (
    <div className="space-y-3 pt-2 border-t border-white/5">
      {hasDelivery && (
        <div className="rounded-xl bg-neutral-900 border border-white/5 divide-y divide-white/5">
          {merchant.click_and_collect_enabled && (
            <div className="flex items-center gap-3 px-4 py-3">
              <Store className="h-4 w-4 text-neutral-400 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium">Click &amp; Collect</p>
                <p className="text-xs text-neutral-500">Retrait en boutique — Gratuit</p>
              </div>
            </div>
          )}
          {merchant.self_delivery_enabled && (
            <div className="flex items-center gap-3 px-4 py-3">
              <Truck className="h-4 w-4 text-neutral-400 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium">
                  Livraison{merchant.self_delivery_city ? ` — ${merchant.self_delivery_city}` : ''}
                </p>
                <p className="text-xs text-neutral-500">
                  {merchant.self_delivery_price_cents
                    ? formatPrice(merchant.self_delivery_price_cents)
                    : 'Gratuit'}
                </p>
              </div>
            </div>
          )}
          {merchant.colissimo_enabled && (
            <div className="flex items-center gap-3 px-4 py-3">
              <Package className="h-4 w-4 text-neutral-400 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium">Colissimo</p>
                <p className="text-xs text-neutral-500">
                  {merchant.colissimo_price_cents
                    ? formatPrice(merchant.colissimo_price_cents)
                    : 'Gratuit'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {hasContact && (
        <div className="flex gap-2">
          {merchant.whatsapp_number && (
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5c] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              {merchant.telegram_username ? 'WhatsApp' : 'Commander via WhatsApp'}
            </a>
          )}
          {merchant.telegram_username && (
            <a
              href={`https://t.me/${tgUsername}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold bg-[#229ED9] text-white hover:bg-[#1a8fc3] transition-colors"
            >
              <Send className="h-4 w-4" />
              {merchant.whatsapp_number ? 'Telegram' : 'Commander via Telegram'}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

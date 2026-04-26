'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/lib/hooks/useCart'
import { useCatalog } from '@/context/catalog-context'
import { formatPrice, generateOrderMessage, DEFAULT_MESSAGE_TEMPLATE } from '@/lib/utils/format'
import { submitCartStats } from '@/lib/actions/catalog'
import type { CartItem } from '@/lib/types/catalog'

// ---------------------------------------------------------------------------
// Page panier — Client Component
//
// Lit le panier depuis localStorage via useCart.
// Récupère les infos merchant (whatsapp, telegram, template) via useCatalog.
// Génère le message de commande et ouvre WhatsApp/Telegram.
// ---------------------------------------------------------------------------

export default function PanierPage() {
  const params = useParams()
  const slug = params.slug as string

  const { merchant } = useCatalog()
  const { cart, totalCents, itemCount, removeFromCart, updateQuantity, clearCart } = useCart(slug)

  const [clientName, setClientName] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Évite l'hydration mismatch (localStorage non dispo côté serveur)
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  // -------------------------------------------------------------------------
  // Génération du message de commande
  // -------------------------------------------------------------------------

  function buildOrderMessage(): string {
    const template = merchant.message_template || DEFAULT_MESSAGE_TEMPLATE
    return generateOrderMessage(template, cart.items, totalCents, clientName, notes)
  }

  // -------------------------------------------------------------------------
  // Handler commande (WhatsApp / Telegram)
  // -------------------------------------------------------------------------

  async function handleOrder(channel: 'whatsapp' | 'telegram') {
    if (cart.items.length === 0) return
    setIsSubmitting(true)

    try {
      // 1. Enregistrement des stats (fire and forget)
      await submitCartStats(merchant.id, itemCount, totalCents, channel)
    } catch {
      // Ne pas bloquer la commande si les stats échouent
    }

    // 2. Génération de l'URL de commande
    const message = buildOrderMessage()
    const encodedMessage = encodeURIComponent(message)

    let url = ''
    if (channel === 'whatsapp' && merchant.whatsapp_number) {
      // Supprime les caractères non numériques du numéro E.164
      const number = merchant.whatsapp_number.replace(/\D/g, '')
      url = `https://wa.me/${number}?text=${encodedMessage}`
    } else if (channel === 'telegram' && merchant.telegram_username) {
      const username = merchant.telegram_username.replace(/^@/, '')
      url = `https://t.me/${username}?text=${encodedMessage}`
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }

    setIsSubmitting(false)
  }

  // -------------------------------------------------------------------------
  // Rendu
  // -------------------------------------------------------------------------

  if (!mounted) {
    // Skeleton pendant l'hydration
    return (
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-neutral-900 animate-pulse" />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <a
              href={`/${slug}/catalogue`}
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              ← Continuer les achats
            </a>
          </div>
          <h1 className="text-lg font-semibold">
            Mon panier
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-neutral-400">
                ({itemCount} article{itemCount !== 1 ? 's' : ''})
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Panier vide */}
        {cart.items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </div>
            <p className="text-neutral-400">Votre panier est vide.</p>
            <a
              href={`/${slug}/catalogue`}
              className="inline-block rounded-xl bg-white text-neutral-950 px-6 py-2.5 text-sm font-semibold hover:bg-neutral-200 transition-colors"
            >
              Voir le catalogue
            </a>
          </div>
        ) : (
          <>
            {/* Liste des articles */}
            <section aria-label="Articles du panier" className="space-y-3">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  merchantSlug={slug}
                />
              ))}
            </section>

            {/* Total */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-sm">Sous-total</span>
                <span className="text-white font-medium">{formatPrice(totalCents)}</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                <span className="text-white font-semibold">Total</span>
                <span className="text-xl font-bold text-white">{formatPrice(totalCents)}</span>
              </div>
            </div>

            {/* Informations client */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-neutral-300">Informations (optionnelles)</h2>

              <div className="space-y-3">
                <div>
                  <label htmlFor="client-name" className="block text-xs text-neutral-500 mb-1">
                    Votre nom
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex : Marie Dupont"
                    maxLength={100}
                    className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs text-neutral-500 mb-1">
                    Remarque (taille, couleur, instructions de livraison…)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex : Taille M pour le t-shirt, livraison en point relais"
                    maxLength={500}
                    rows={3}
                    className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Aperçu du message */}
            <details className="group">
              <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-300 transition-colors list-none flex items-center gap-2">
                <span className="group-open:hidden">▶</span>
                <span className="hidden group-open:inline">▼</span>
                Aperçu du message de commande
              </summary>
              <pre className="mt-3 text-xs text-neutral-400 bg-neutral-900/50 border border-white/5 rounded-xl p-4 whitespace-pre-wrap font-mono overflow-auto max-h-48">
                {buildOrderMessage()}
              </pre>
            </details>

            {/* Boutons de commande */}
            <div className="space-y-3 pt-2">
              {merchant.whatsapp_number && (
                <button
                  type="button"
                  onClick={() => handleOrder('whatsapp')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white px-6 py-4 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <WhatsAppIcon />
                  Commander via WhatsApp
                </button>
              )}

              {merchant.telegram_username && (
                <button
                  type="button"
                  onClick={() => handleOrder('telegram')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#229ED9] hover:bg-[#1a8fc0] text-white px-6 py-4 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <TelegramIcon />
                  Commander via Telegram
                </button>
              )}

              {!merchant.whatsapp_number && !merchant.telegram_username && (
                <p className="text-sm text-neutral-500 text-center py-4">
                  Le marchand n&apos;a pas encore configuré de canal de commande.
                </p>
              )}
            </div>

            {/* Vider le panier */}
            <div className="text-center">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

function CartItemRow({
  item,
  onRemove,
  onUpdateQuantity,
  merchantSlug,
}: {
  item: CartItem
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, qty: number) => void
  merchantSlug: string
}) {
  return (
    <div className="flex gap-3 bg-neutral-900 border border-white/5 rounded-xl p-3">
      {/* Image */}
      <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-xl font-bold text-neutral-700">?</span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <a
          href={`/${merchantSlug}/produit/${item.productId}`}
          className="text-sm font-medium text-white hover:underline truncate block"
        >
          {item.name}
        </a>
        {item.reference && (
          <p className="text-xs font-mono text-neutral-500 mt-0.5">Réf. {item.reference}</p>
        )}
        <p className="text-xs text-neutral-400 mt-0.5">{formatPrice(item.price_cents)}/u</p>
      </div>

      {/* Quantité + sous-total + suppression */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 bg-neutral-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-6 w-6 flex items-center justify-center rounded text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
            aria-label="Diminuer"
          >
            −
          </button>
          <span className="w-6 text-center text-xs font-medium text-white">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="h-6 w-6 flex items-center justify-center rounded text-neutral-400 hover:text-white text-xs transition-colors"
            aria-label="Augmenter"
          >
            +
          </button>
        </div>
        <p className="text-xs font-semibold text-white">
          {formatPrice(item.price_cents * item.quantity)}
        </p>
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="text-xs text-neutral-600 hover:text-red-400 transition-colors"
          aria-label={`Supprimer ${item.name}`}
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Icônes inline (évite une dépendance supplémentaire)
// ---------------------------------------------------------------------------

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.127 1.532 5.869L.057 23.5l5.765-1.513A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.371l-.359-.214-3.723.977.994-3.635-.235-.373A9.818 9.818 0 112 12 9.818 9.818 0 0112 21.818z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

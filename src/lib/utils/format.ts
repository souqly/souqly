import type { CartItem } from '@/lib/types/catalog'

/**
 * Formate un prix en centimes vers une chaîne lisible.
 * Exemple : 8500 → "85,00 €"
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

/**
 * Génère le message de commande à partir du template marchand.
 *
 * Placeholders supportés :
 *   {{products}}    → liste des articles
 *   {{total}}       → total formaté
 *   {{client_name}} → nom du client (optionnel)
 *   {{notes}}       → remarque client (optionnelle)
 */
export function generateOrderMessage(
  template: string,
  items: CartItem[],
  totalCents: number,
  clientName: string,
  notes: string,
): string {
  const productLines = items
    .map((item) => {
      const ref = item.reference ? ` (${item.reference})` : ''
      const unitPrice = formatPrice(item.price_cents)
      return `- ${item.quantity}x ${item.name}${ref} — ${unitPrice}/u`
    })
    .join('\n')

  const total = formatPrice(totalCents)

  return template
    .replace('{{products}}', productLines)
    .replace('{{total}}', total)
    .replace('{{client_name}}', clientName || '')
    .replace('{{notes}}', notes || '')
}

/**
 * Template de message par défaut utilisé si le marchand n'en a pas configuré.
 */
export const DEFAULT_MESSAGE_TEMPLATE = `Bonjour, je souhaite commander :

{{products}}

Total : {{total}}

Nom : {{client_name}}
Remarque : {{notes}}`

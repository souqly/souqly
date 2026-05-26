import { describe, it, expect } from 'vitest'
import type { CartItem } from '@/lib/types/catalog'
import {
  formatPrice,
  generateOrderMessage,
  DEFAULT_MESSAGE_TEMPLATE,
} from '@/lib/utils/format'

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function makeItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    productId: 'prod-1',
    name: 'Produit Test',
    reference: null,
    price_cents: 1000,
    quantity: 1,
    image_url: null,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// formatPrice
// ---------------------------------------------------------------------------

describe('formatPrice', () => {
  it('formate 0 centimes', () => {
    expect(formatPrice(0)).toMatch(/0,00/)
  })

  it('formate 8500 → 85,00 €', () => {
    expect(formatPrice(8500)).toMatch(/85,00/)
  })

  it('formate 100 → 1,00 €', () => {
    expect(formatPrice(100)).toMatch(/1,00/)
  })

  it('formate 99 → 0,99 €', () => {
    expect(formatPrice(99)).toMatch(/0,99/)
  })

  it('formate 10000 → 100,00 €', () => {
    expect(formatPrice(10000)).toMatch(/100,00/)
  })

  it('inclut le symbole €', () => {
    expect(formatPrice(5000)).toContain('€')
  })

  it('formate une valeur négative', () => {
    expect(formatPrice(-500)).toMatch(/-5,00/)
  })
})

// ---------------------------------------------------------------------------
// generateOrderMessage
// ---------------------------------------------------------------------------

const TEMPLATE = '{{products}}\nTotal : {{total}}\nNom : {{client_name}}\nRemarque : {{notes}}'

describe('generateOrderMessage', () => {
  it('remplace {{products}} avec un article sans référence', () => {
    const items = [makeItem({ name: 'Chemise', price_cents: 2500, quantity: 1 })]
    const result = generateOrderMessage(TEMPLATE, items, 2500, '', '')
    expect(result).toContain('- 1x Chemise')
    expect(result).not.toContain('(')
  })

  it('inclut la référence entre parenthèses', () => {
    const items = [makeItem({ name: 'Chemise', reference: 'REF-42', price_cents: 2500 })]
    const result = generateOrderMessage(TEMPLATE, items, 2500, '', '')
    expect(result).toContain('(REF-42)')
  })

  it('n\'affiche pas de parenthèse si reference est null', () => {
    const items = [makeItem({ reference: null })]
    const result = generateOrderMessage(TEMPLATE, items, 1000, '', '')
    const productLine = result.split('\n')[0]
    expect(productLine).not.toContain('(')
  })

  it('affiche la quantité correctement quand qty > 1', () => {
    const items = [makeItem({ name: 'Pantalon', quantity: 3, price_cents: 5000 })]
    const result = generateOrderMessage(TEMPLATE, items, 15000, '', '')
    expect(result).toContain('- 3x Pantalon')
  })

  it('affiche le prix unitaire avec /u', () => {
    const items = [makeItem({ name: 'T-shirt', price_cents: 3000, quantity: 2 })]
    const result = generateOrderMessage(TEMPLATE, items, 6000, '', '')
    expect(result).toContain('/u')
    expect(result).toContain('30,00')
  })

  it('remplace {{total}} avec le prix formaté', () => {
    const items = [makeItem({ price_cents: 1999 })]
    const result = generateOrderMessage(TEMPLATE, items, 1999, '', '')
    expect(result).toContain('19,99')
  })

  it('remplace {{client_name}} avec le nom fourni', () => {
    const result = generateOrderMessage(TEMPLATE, [makeItem()], 1000, 'Mohamed', '')
    expect(result).toContain('Nom : Mohamed')
  })

  it('remplace {{client_name}} par chaîne vide si absent', () => {
    const result = generateOrderMessage(TEMPLATE, [makeItem()], 1000, '', '')
    expect(result).toContain('Nom : ')
  })

  it('remplace {{notes}} avec la remarque fournie', () => {
    const result = generateOrderMessage(TEMPLATE, [makeItem()], 1000, '', 'Livraison rapide')
    expect(result).toContain('Remarque : Livraison rapide')
  })

  it('remplace {{notes}} par chaîne vide si absent', () => {
    const result = generateOrderMessage(TEMPLATE, [makeItem()], 1000, '', '')
    expect(result).toContain('Remarque : ')
  })

  it('gère plusieurs articles séparés par des sauts de ligne', () => {
    const items = [
      makeItem({ name: 'Article A', price_cents: 1000, quantity: 1 }),
      makeItem({ name: 'Article B', price_cents: 2000, quantity: 2 }),
    ]
    const result = generateOrderMessage(TEMPLATE, items, 5000, '', '')
    expect(result).toContain('Article A')
    expect(result).toContain('Article B')
  })

  it('remplace {{products}} par chaîne vide pour un panier vide', () => {
    const result = generateOrderMessage(TEMPLATE, [], 0, '', '')
    // La première ligne est vide (products → '')
    expect(result.startsWith('\n')).toBe(true)
  })

  it('fonctionne end-to-end avec DEFAULT_MESSAGE_TEMPLATE', () => {
    const items = [makeItem({ name: 'Robe', reference: 'R-01', price_cents: 7500, quantity: 1 })]
    const result = generateOrderMessage(DEFAULT_MESSAGE_TEMPLATE, items, 7500, 'Fatima', 'Taille M')
    expect(result).toContain('Bonjour, je souhaite commander')
    expect(result).toContain('- 1x Robe (R-01)')
    expect(result).toContain('75,00')
    expect(result).toContain('Fatima')
    expect(result).toContain('Taille M')
  })

  it('fonctionne avec un template personnalisé marchand', () => {
    const customTemplate =
      'Commande de {{client_name}} :\n{{products}}\nMontant : {{total}}\nNote : {{notes}}'
    const items = [makeItem({ name: 'Sac', price_cents: 12000, quantity: 1 })]
    const result = generateOrderMessage(customTemplate, items, 12000, 'Youssef', 'Couleur rouge')
    expect(result).toContain('Commande de Youssef')
    expect(result).toContain('- 1x Sac')
    expect(result).toContain('120,00')
    expect(result).toContain('Couleur rouge')
  })
})

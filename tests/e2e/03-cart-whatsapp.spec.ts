/**
 * Flow 03 — Cart and WhatsApp order
 *
 * Tests the full add-to-cart → panier → commander via WhatsApp flow.
 * The WhatsApp button is intercepted so window.open is never actually called.
 *
 * The cart is stored in localStorage under the key `souqly_cart_[slug]`.
 * We seed the cart directly via localStorage for tests that only care about
 * the /panier page, keeping tests independent of the product detail UI.
 *
 * Requires env vars:
 *   TEST_MERCHANT_SLUG     — active merchant slug
 *   TEST_ACCESS_CODE       — correct access code
 *   TEST_MERCHANT_WHATSAPP — whatsapp_number configured on the test merchant
 *                            (E.164 without +, e.g. "33612345678")
 */

import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import { unlockCatalog } from './helpers/auth'
import type { Cart, CartItem } from '../../src/lib/types/catalog'

const slug = process.env.TEST_MERCHANT_SLUG ?? ''
const code = process.env.TEST_ACCESS_CODE ?? ''
const whatsappNumber = process.env.TEST_MERCHANT_WHATSAPP ?? ''
const hasCredentials = !!slug && !!code

// ---------------------------------------------------------------------------
// Helper — seed a cart directly in localStorage (avoids relying on UI clicks)
// ---------------------------------------------------------------------------

async function seedCart(page: Page, merchantSlug: string, items: CartItem[]) {
  const cart: Cart = { merchantSlug, items }
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: `souqly_cart_${merchantSlug}`, value: cart },
  )
}

// ---------------------------------------------------------------------------
// Helper — intercept window.open and capture the URL
// ---------------------------------------------------------------------------

async function interceptWindowOpen(page: Page): Promise<() => string | null> {
  await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__lastOpenedUrl = null
    window.open = (url?: string | URL) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).__lastOpenedUrl = url ? url.toString() : null
      return null
    }
  })
  return async () =>
    page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (window as any).__lastOpenedUrl as string | null
    })
}

// Shared unlocked context
let sharedContext: BrowserContext
let sharedPage: Page

test.describe('Cart and WhatsApp order', () => {

  test.beforeAll(async ({ browser }) => {
    if (!hasCredentials) return
    sharedContext = await browser.newContext()
    sharedPage = await sharedContext.newPage()
    await unlockCatalog(sharedPage, slug, code)
  })

  test.afterAll(async () => {
    if (sharedContext) await sharedContext.close()
  })

  // ---------------------------------------------------------------------------
  // Add to cart from product detail
  // ---------------------------------------------------------------------------

  test('"Ajouter au panier" button adds item and shows feedback', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto(`/${slug}/catalogue`)

    const firstProductHref = await sharedPage
      .locator('section[aria-label="Produits"] a[href*="/produit/"]')
      .first()
      .getAttribute('href')

    if (!firstProductHref) {
      test.skip(true, 'No product available on catalogue page')
      return
    }

    await sharedPage.goto(firstProductHref)

    const addBtn = sharedPage.locator('button', { hasText: 'Ajouter au panier' })
    await expect(addBtn).toBeVisible()
    await addBtn.click()

    // After click, button transitions to "Ajouté !" for 1.5 s
    const feedback = sharedPage.locator('button', { hasText: 'Ajouté !' })
    await expect(feedback).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Panier page — seeded via localStorage
  // ---------------------------------------------------------------------------

  const sampleItems: CartItem[] = [
    {
      productId: 'test-product-001',
      name: 'Sneakers Modèle X',
      reference: 'REF-001',
      price_cents: 8000,
      quantity: 2,
      image_url: null,
    },
    {
      productId: 'test-product-002',
      name: 'Sac Modèle Y',
      reference: 'REF-042',
      price_cents: 4500,
      quantity: 1,
      image_url: null,
    },
  ]

  test('panier page displays seeded cart items', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto(`/${slug}/catalogue`)
    await seedCart(sharedPage, slug, sampleItems)

    await sharedPage.goto(`/${slug}/panier`)

    // Each item name should appear
    await expect(sharedPage.locator('text=Sneakers Modèle X')).toBeVisible()
    await expect(sharedPage.locator('text=Sac Modèle Y')).toBeVisible()
  })

  test('panier page shows item count in the header', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto(`/${slug}/catalogue`)
    // 2 items of product-001 + 1 of product-002 = 3 articles
    await seedCart(sharedPage, slug, sampleItems)

    await sharedPage.goto(`/${slug}/panier`)

    // Header shows "(3 articles)"
    await expect(sharedPage.locator('text=/3 articles?/')).toBeVisible()
  })

  test('increasing quantity from panier updates display', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto(`/${slug}/catalogue`)
    await seedCart(sharedPage, slug, [
      { ...sampleItems[0], quantity: 1 },
    ])
    await sharedPage.goto(`/${slug}/panier`)

    // Increase quantity
    const increaseBtn = sharedPage.locator('button[aria-label="Augmenter"]').first()
    await expect(increaseBtn).toBeVisible()
    await increaseBtn.click()

    // Quantity span should now read 2
    const quantitySpan = sharedPage.locator('span', { hasText: '2' }).first()
    await expect(quantitySpan).toBeVisible()
  })

  test('decreasing quantity to 1 disables the decrement button', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto(`/${slug}/catalogue`)
    await seedCart(sharedPage, slug, [{ ...sampleItems[0], quantity: 1 }])
    await sharedPage.goto(`/${slug}/panier`)

    const decreaseBtn = sharedPage.locator('button[aria-label="Diminuer"]').first()
    await expect(decreaseBtn).toBeDisabled()
  })

  test('removing item shows empty cart state when last item deleted', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto(`/${slug}/catalogue`)
    await seedCart(sharedPage, slug, [{ ...sampleItems[0], quantity: 1 }])
    await sharedPage.goto(`/${slug}/panier`)

    const removeBtn = sharedPage
      .locator(`button[aria-label="Supprimer ${sampleItems[0].name}"]`)
      .first()
    await expect(removeBtn).toBeVisible()
    await removeBtn.click()

    // Empty state text from PanierPage
    await expect(sharedPage.locator('text=Votre panier est vide.')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // WhatsApp URL generation
  // ---------------------------------------------------------------------------

  test('"Commander via WhatsApp" button is visible when cart is non-empty', async () => {
    test.skip(!hasCredentials, 'Credentials not set')
    test.skip(!whatsappNumber, 'TEST_MERCHANT_WHATSAPP not set — WhatsApp button may not render')

    await sharedPage.goto(`/${slug}/catalogue`)
    await seedCart(sharedPage, slug, sampleItems)
    await sharedPage.goto(`/${slug}/panier`)

    const whatsappBtn = sharedPage.locator('button', { hasText: 'Commander via WhatsApp' })
    await expect(whatsappBtn).toBeVisible()
  })

  test('WhatsApp URL is correctly formed (wa.me/number?text=...)', async () => {
    test.skip(!hasCredentials, 'Credentials not set')
    test.skip(!whatsappNumber, 'TEST_MERCHANT_WHATSAPP not set')

    await sharedPage.goto(`/${slug}/catalogue`)
    await seedCart(sharedPage, slug, sampleItems)
    await sharedPage.goto(`/${slug}/panier`)

    const getLastUrl = await interceptWindowOpen(sharedPage)

    const whatsappBtn = sharedPage.locator('button', { hasText: 'Commander via WhatsApp' })
    await expect(whatsappBtn).toBeVisible()
    await whatsappBtn.click()

    const openedUrl = await getLastUrl()
    expect(openedUrl).not.toBeNull()
    expect(openedUrl).toMatch(/^https:\/\/wa\.me\//)
    expect(openedUrl).toContain(whatsappNumber)
    expect(openedUrl).toContain('text=')
  })

  test('WhatsApp message contains product name and formatted price', async () => {
    test.skip(!hasCredentials, 'Credentials not set')
    test.skip(!whatsappNumber, 'TEST_MERCHANT_WHATSAPP not set')

    await sharedPage.goto(`/${slug}/catalogue`)
    await seedCart(sharedPage, slug, [sampleItems[0]])
    await sharedPage.goto(`/${slug}/panier`)

    const getLastUrl = await interceptWindowOpen(sharedPage)

    await sharedPage.locator('button', { hasText: 'Commander via WhatsApp' }).click()
    const openedUrl = await getLastUrl()

    expect(openedUrl).not.toBeNull()
    const decodedText = decodeURIComponent(openedUrl!.split('text=')[1] ?? '')

    // Product name must appear in the message
    expect(decodedText).toContain('Sneakers Modèle X')
    // Price 80,00 € must appear (formatPrice(8000) = "80,00 €")
    expect(decodedText).toContain('80')
  })

  // ---------------------------------------------------------------------------
  // Empty cart edge case
  // ---------------------------------------------------------------------------

  test('"Commander via WhatsApp" is not rendered when cart is empty', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto(`/${slug}/catalogue`)
    await seedCart(sharedPage, slug, [])
    await sharedPage.goto(`/${slug}/panier`)

    // Empty state is shown
    await expect(sharedPage.locator('text=Votre panier est vide.')).toBeVisible()

    // WhatsApp button must NOT exist
    const whatsappBtn = sharedPage.locator('button', { hasText: 'Commander via WhatsApp' })
    await expect(whatsappBtn).not.toBeVisible()
  })
})

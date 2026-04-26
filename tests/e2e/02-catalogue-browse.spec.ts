/**
 * Flow 02 — Browsing the catalogue
 *
 * Tests the product & category discovery UX once the catalogue is unlocked.
 * All tests share a single beforeAll that unlocks the catalogue so the cookie
 * is available for the whole describe block.
 *
 * Requires env vars:
 *   TEST_MERCHANT_SLUG  — a known active merchant slug
 *   TEST_ACCESS_CODE    — the correct access code for that merchant
 *
 * Optional:
 *   TEST_CATEGORY_SLUG  — a category slug that exists in the catalogue
 *                         (used to test the ?cat= filter)
 */

import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import { unlockCatalog } from './helpers/auth'

const slug = process.env.TEST_MERCHANT_SLUG ?? ''
const code = process.env.TEST_ACCESS_CODE ?? ''
const categorySlug = process.env.TEST_CATEGORY_SLUG ?? ''
const hasCredentials = !!slug && !!code

// Shared context — catalogue is unlocked once for all tests in this describe
let sharedContext: BrowserContext
let sharedPage: Page

test.describe('Catalogue browse', () => {

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
  // Catalogue page renders
  // ---------------------------------------------------------------------------

  test('catalogue page shows a product grid', async () => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    await sharedPage.goto(`/${slug}/catalogue`)

    // Products section is rendered with aria-label="Produits" (set in catalogue page)
    const productsSection = sharedPage.locator('section[aria-label="Produits"]')
    await expect(productsSection).toBeVisible()

    // At least one product card link should exist
    const productLinks = productsSection.locator('a[href*="/produit/"]')
    await expect(productLinks.first()).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Category filter pills
  // ---------------------------------------------------------------------------

  test('clicking a category filter pill adds ?cat= param and filters products', async () => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')
    test.skip(!categorySlug, 'TEST_CATEGORY_SLUG not set — skipping category filter test')

    await sharedPage.goto(`/${slug}/catalogue`)

    // Locate the filter pill by its href containing the category slug
    const pill = sharedPage.locator(`a[href*="cat=${categorySlug}"]`).first()
    await expect(pill).toBeVisible()

    await pill.click()
    await sharedPage.waitForURL(`/${slug}/catalogue?cat=${categorySlug}`)

    // The active pill (bg-white styling) should now point to that category
    const activePill = sharedPage.locator(`a[href*="cat=${categorySlug}"].bg-white`)
    await expect(activePill).toBeVisible()
  })

  test('"Tous" pill navigates back to unfiltered catalogue', async () => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')
    test.skip(!categorySlug, 'TEST_CATEGORY_SLUG not set')

    await sharedPage.goto(`/${slug}/catalogue?cat=${categorySlug}`)

    // The "Tous" link always points to /[slug]/catalogue with no params
    const allPill = sharedPage.locator(`a[href="/${slug}/catalogue"]`).first()
    await expect(allPill).toBeVisible()

    await allPill.click()
    await sharedPage.waitForURL(`/${slug}/catalogue`)
    expect(sharedPage.url()).not.toContain('cat=')
  })

  // ---------------------------------------------------------------------------
  // Product navigation
  // ---------------------------------------------------------------------------

  test('clicking a product card navigates to /produit/[id]', async () => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    await sharedPage.goto(`/${slug}/catalogue`)

    // Click the first product card
    const firstProduct = sharedPage
      .locator('section[aria-label="Produits"] a[href*="/produit/"]')
      .first()
    await expect(firstProduct).toBeVisible()

    await firstProduct.click()
    await sharedPage.waitForURL(/\/produit\//)
    expect(sharedPage.url()).toContain('/produit/')
  })

  test('product detail page shows name, price, and add-to-cart button', async () => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    await sharedPage.goto(`/${slug}/catalogue`)

    // Navigate to first product
    const firstProductHref = await sharedPage
      .locator('section[aria-label="Produits"] a[href*="/produit/"]')
      .first()
      .getAttribute('href')

    if (!firstProductHref) {
      test.skip(true, 'No product link found on catalogue page')
      return
    }

    await sharedPage.goto(firstProductHref)

    // Product name — rendered as a heading in the detail page
    const productName = sharedPage.locator('h1')
    await expect(productName).toBeVisible()

    // Price — formatPrice always renders "X,XX €" format
    const priceEl = sharedPage.locator('text=/\\d+,\\d{2}\\s*€/')
    await expect(priceEl.first()).toBeVisible()

    // Add-to-cart button from AddToCartButton.tsx
    const addBtn = sharedPage.locator('button', { hasText: 'Ajouter au panier' })
    await expect(addBtn).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Back-navigation from product detail
  // ---------------------------------------------------------------------------

  test('back link on product page navigates to catalogue', async () => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    await sharedPage.goto(`/${slug}/catalogue`)

    const firstProductHref = await sharedPage
      .locator('section[aria-label="Produits"] a[href*="/produit/"]')
      .first()
      .getAttribute('href')

    if (!firstProductHref) {
      test.skip(true, 'No product found to test back navigation')
      return
    }

    await sharedPage.goto(firstProductHref)

    // There should be a back link pointing to /[slug]/catalogue
    const backLink = sharedPage.locator(`a[href="/${slug}/catalogue"]`)
    await expect(backLink.first()).toBeVisible()

    await backLink.first().click()
    await sharedPage.waitForURL(`/${slug}/catalogue`)
    expect(sharedPage.url()).toContain(`/${slug}/catalogue`)
  })
})

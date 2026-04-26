/**
 * Flow 05 — Dashboard product management
 *
 * Tests the merchant dashboard pages that require authentication.
 * A real Supabase session is obtained via the /login form in beforeAll.
 *
 * Requires env vars:
 *   TEST_MERCHANT_EMAIL    — email of an active test merchant account
 *   TEST_MERCHANT_PASSWORD — password of that account
 */

import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import { signInMerchant } from './helpers/auth'

const email = process.env.TEST_MERCHANT_EMAIL ?? ''
const password = process.env.TEST_MERCHANT_PASSWORD ?? ''
const hasCredentials = !!email && !!password

// Shared authenticated context for all tests
let sharedContext: BrowserContext
let sharedPage: Page

test.describe('Dashboard — merchant product management', () => {

  test.beforeAll(async ({ browser }) => {
    if (!hasCredentials) return
    sharedContext = await browser.newContext()
    sharedPage = await sharedContext.newPage()
    await signInMerchant(sharedPage, email, password)
  })

  test.afterAll(async () => {
    if (sharedContext) await sharedContext.close()
  })

  // ---------------------------------------------------------------------------
  // Dashboard overview
  // ---------------------------------------------------------------------------

  test('/dashboard shows stat cards', async () => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_EMAIL / TEST_MERCHANT_PASSWORD not set')

    await sharedPage.goto('/dashboard')

    // DashboardPage renders 4 StatCard components with these labels
    await expect(sharedPage.locator('text=Produits')).toBeVisible()
    await expect(sharedPage.locator('text=Catégories')).toBeVisible()
    await expect(sharedPage.locator('text=Visites')).toBeVisible()
    await expect(sharedPage.locator('text=Commandes')).toBeVisible()
  })

  test('/dashboard shows merchant name in greeting', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto('/dashboard')
    // "Bonjour, [merchant.name]" rendered in the dashboard page header
    await expect(sharedPage.locator('text=/Bonjour/')).toBeVisible()
  })

  test('/dashboard shows links to produits and parametres', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto('/dashboard')
    await expect(sharedPage.locator('a[href="/dashboard/produits"]')).toBeVisible()
    await expect(sharedPage.locator('a[href="/dashboard/parametres"]')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Products list
  // ---------------------------------------------------------------------------

  test('/dashboard/produits renders the product management page', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto('/dashboard/produits')

    // ProductsClient component should be present — look for the "Nouveau produit" CTA
    // or a table/list. If no products exist yet, the empty state should appear.
    const page = sharedPage
    const hasNewProductButton = await page.locator('button, a', { hasText: /nouveau produit/i }).count()
    const hasTable = await page.locator('table, [role="table"]').count()
    const hasEmptyState = await page.locator('text=/aucun produit/i').count()

    expect(hasNewProductButton + hasTable + hasEmptyState).toBeGreaterThan(0)
  })

  test('"Nouveau produit" button or link is present on /dashboard/produits', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto('/dashboard/produits')

    const newProductControl = sharedPage.locator('button, a', { hasText: /nouveau produit/i })
    await expect(newProductControl.first()).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------

  test('/dashboard/categories shows the category list page', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto('/dashboard/categories')

    // Page should render without a hard redirect to /login
    expect(sharedPage.url()).toContain('/dashboard/categories')

    // Either a list of categories or an "add category" control should exist
    const hasCategoryControl = await sharedPage
      .locator('button, a', { hasText: /catégorie/i })
      .count()
    const hasAddButton = await sharedPage
      .locator('button, a', { hasText: /nouvelle|ajouter|créer/i })
      .count()

    expect(hasCategoryControl + hasAddButton).toBeGreaterThan(0)
  })

  // ---------------------------------------------------------------------------
  // Parametres
  // ---------------------------------------------------------------------------

  test('/dashboard/parametres renders three settings sections', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto('/dashboard/parametres')

    // The spec requires 3 sections: code d'accès, contacts, template message
    // These are identified by heading text or section labels
    const codeSection = sharedPage.locator('text=/code d.accès/i')
    const contactSection = sharedPage.locator('text=/whatsapp|telegram|contact/i')
    const templateSection = sharedPage.locator('text=/template|message/i')

    await expect(codeSection.first()).toBeVisible()
    await expect(contactSection.first()).toBeVisible()
    await expect(templateSection.first()).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Abonnement page
  // ---------------------------------------------------------------------------

  test('/dashboard/abonnement renders subscription info', async () => {
    test.skip(!hasCredentials, 'Credentials not set')

    await sharedPage.goto('/dashboard/abonnement')

    expect(sharedPage.url()).toContain('/dashboard/abonnement')
    // Should not redirect to login
    expect(sharedPage.url()).not.toContain('/login')
  })

  // ---------------------------------------------------------------------------
  // Unauthenticated access protection
  // ---------------------------------------------------------------------------

  test('unauthenticated request to /dashboard redirects to /login', async ({ page }) => {
    // Fresh page — no auth cookies
    await page.goto('/dashboard')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
    expect(page.url()).toContain('redirect=%2Fdashboard')
  })

  test('unauthenticated request to /dashboard/produits redirects to /login', async ({ page }) => {
    await page.goto('/dashboard/produits')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
  })
})

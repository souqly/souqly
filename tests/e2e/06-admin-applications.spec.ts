/**
 * Flow 06 — Admin application flow
 *
 * Tests the super-admin section (/admin/*).
 * Admin routes are protected by the middleware — unauthenticated users are
 * redirected to /login. Non-admin users (merchant accounts) should also be
 * unable to access /admin (enforced by the admin layout/page auth checks).
 *
 * Requires env vars:
 *   TEST_ADMIN_EMAIL       — email of a super-admin account
 *   TEST_ADMIN_PASSWORD    — password of that account
 *
 * Optional (for non-admin redirect test):
 *   TEST_MERCHANT_EMAIL    — a non-admin merchant account
 *   TEST_MERCHANT_PASSWORD — password for that merchant account
 */

import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import { signInMerchant } from './helpers/auth'

const adminEmail = process.env.TEST_ADMIN_EMAIL ?? ''
const adminPassword = process.env.TEST_ADMIN_PASSWORD ?? ''
const hasAdminCredentials = !!adminEmail && !!adminPassword

const merchantEmail = process.env.TEST_MERCHANT_EMAIL ?? ''
const merchantPassword = process.env.TEST_MERCHANT_PASSWORD ?? ''
const hasMerchantCredentials = !!merchantEmail && !!merchantPassword

// Shared admin context
let adminContext: BrowserContext
let adminPage: Page

test.describe('Admin — application flow', () => {

  test.beforeAll(async ({ browser }) => {
    if (!hasAdminCredentials) return
    adminContext = await browser.newContext()
    adminPage = await adminContext.newPage()
    await signInMerchant(adminPage, adminEmail, adminPassword)
  })

  test.afterAll(async () => {
    if (adminContext) await adminContext.close()
  })

  // ---------------------------------------------------------------------------
  // Route redirects
  // ---------------------------------------------------------------------------

  test('/admin redirects to /admin/candidatures', async () => {
    test.skip(!hasAdminCredentials, 'TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD not set')

    await adminPage.goto('/admin')

    // AdminPage does redirect('/admin/candidatures') server-side
    await adminPage.waitForURL('/admin/candidatures')
    expect(adminPage.url()).toContain('/admin/candidatures')
  })

  // ---------------------------------------------------------------------------
  // Candidatures
  // ---------------------------------------------------------------------------

  test('/admin/candidatures renders the pending applications section', async () => {
    test.skip(!hasAdminCredentials, 'Credentials not set')

    await adminPage.goto('/admin/candidatures')
    expect(adminPage.url()).toContain('/admin/candidatures')
    expect(adminPage.url()).not.toContain('/login')

    // Page should contain some indicator of applications (heading or empty state)
    const heading = adminPage.locator('h1, h2', { hasText: /candidature|demande|application/i })
    const emptyState = adminPage.locator('text=/aucune|no application|vide/i')
    const tableOrList = adminPage.locator('table, ul, [role="list"]')

    const anyVisible =
      (await heading.count()) + (await emptyState.count()) + (await tableOrList.count())
    expect(anyVisible).toBeGreaterThan(0)
  })

  test('/admin/candidatures has approve/reject controls when applications exist', async () => {
    test.skip(!hasAdminCredentials, 'Credentials not set')

    await adminPage.goto('/admin/candidatures')

    // These buttons may not exist if the queue is empty — guard with count check
    const approveBtn = adminPage.locator('button, a', { hasText: /approuver|valider|approve/i })
    const rejectBtn = adminPage.locator('button, a', { hasText: /refuser|rejeter|reject/i })

    // If there are no applications we just skip the assertion
    const appCount = await adminPage.locator('[data-application], [data-row]').count()
    if (appCount > 0) {
      await expect(approveBtn.first()).toBeVisible()
      await expect(rejectBtn.first()).toBeVisible()
    }
  })

  // ---------------------------------------------------------------------------
  // Marchands list
  // ---------------------------------------------------------------------------

  test('/admin/marchands renders the merchants table', async () => {
    test.skip(!hasAdminCredentials, 'Credentials not set')

    await adminPage.goto('/admin/marchands')
    expect(adminPage.url()).toContain('/admin/marchands')

    // Table, list, or empty state should be present
    const table = adminPage.locator('table, ul, [role="table"], [role="list"]')
    const emptyState = adminPage.locator('text=/aucun marchand|no merchant/i')

    const visible = (await table.count()) + (await emptyState.count())
    expect(visible).toBeGreaterThan(0)
  })

  // ---------------------------------------------------------------------------
  // Access control — unauthenticated
  // ---------------------------------------------------------------------------

  test('unauthenticated user accessing /admin is redirected to /login', async ({ page }) => {
    // Fresh page with no session cookies
    await page.goto('/admin')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
  })

  test('unauthenticated user accessing /admin/candidatures is redirected to /login', async ({ page }) => {
    await page.goto('/admin/candidatures')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
  })

  // ---------------------------------------------------------------------------
  // Access control — non-admin merchant
  // ---------------------------------------------------------------------------

  test('non-admin merchant accessing /admin is redirected away from admin', async ({ browser }) => {
    test.skip(
      !hasMerchantCredentials,
      'TEST_MERCHANT_EMAIL / TEST_MERCHANT_PASSWORD not set — skipping non-admin access test',
    )

    const merchantContext = await browser.newContext()
    const merchantPage = await merchantContext.newPage()

    await signInMerchant(merchantPage, merchantEmail, merchantPassword)

    // Now try to access /admin
    await merchantPage.goto('/admin')

    // Should NOT be on an admin page — should redirect to /dashboard or /login
    // (the admin layout/page performs the is_super_admin check)
    await merchantPage.waitForURL(/\/dashboard|\/login/, { timeout: 8_000 })
    expect(merchantPage.url()).not.toContain('/admin/candidatures')

    await merchantContext.close()
  })
})

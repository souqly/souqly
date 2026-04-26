/**
 * Flow 01 — Catalog access with code
 *
 * Tests the full gate flow on /[slug]:
 *   - Valid code unlocks the catalogue and redirects
 *   - Invalid code shows an error and stays on the same page
 *   - Session cookie is set after successful unlock
 *   - Direct access to /[slug]/catalogue without cookie redirects back
 *   - A page that already has a valid session redirects automatically
 *
 * Requires env vars:
 *   TEST_MERCHANT_SLUG  — a known active merchant slug
 *   TEST_ACCESS_CODE    — the correct access code for that merchant
 */

import { test, expect } from '@playwright/test'
import { unlockCatalog } from './helpers/auth'

const slug = process.env.TEST_MERCHANT_SLUG ?? ''
const code = process.env.TEST_ACCESS_CODE ?? ''
const hasCredentials = !!slug && !!code

test.describe('Catalog access — code gate', () => {

  // ---------------------------------------------------------------------------
  // Nominal — correct code
  // ---------------------------------------------------------------------------

  test('correct code redirects to /[slug]/catalogue', async ({ page }) => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    await page.goto(`/${slug}`)

    // The merchant home page must show the access-code form
    await expect(page.locator('#access-code')).toBeVisible()

    await page.fill('#access-code', code)
    await page.click('button[type="submit"]')

    // Should land on the catalogue
    await page.waitForURL(`/${slug}/catalogue`)
    expect(page.url()).toContain(`/${slug}/catalogue`)
  })

  test('session cookie catalog_session_[slug] is set after unlock', async ({ page, context }) => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    await unlockCatalog(page, slug, code)

    const cookies = await context.cookies()
    const sessionCookie = cookies.find((c) => c.name === `catalog_session_${slug}`)

    expect(sessionCookie).toBeDefined()
    expect(sessionCookie?.httpOnly).toBe(true)
    expect(sessionCookie?.sameSite).toBe('Lax')
  })

  test('existing valid session redirects straight to /[slug]/catalogue', async ({ page }) => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    // First visit to set the cookie
    await unlockCatalog(page, slug, code)

    // Second visit to /[slug] should skip the form and go straight to catalogue
    await page.goto(`/${slug}`)
    await page.waitForURL(`/${slug}/catalogue`)
    expect(page.url()).toContain(`/${slug}/catalogue`)
  })

  // ---------------------------------------------------------------------------
  // Error path — wrong code
  // ---------------------------------------------------------------------------

  test('incorrect code shows error message, stays on /[slug]', async ({ page }) => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    await page.goto(`/${slug}`)
    await page.fill('#access-code', 'WRONGCODE999')
    await page.click('button[type="submit"]')

    // Error alert should appear
    const errorAlert = page.locator('[role="alert"]')
    await expect(errorAlert).toBeVisible()

    // URL must NOT have changed to catalogue
    expect(page.url()).not.toContain('/catalogue')
  })

  test('empty submission is blocked before reaching the server', async ({ page }) => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    await page.goto(`/${slug}`)

    // The submit button is disabled when the input is empty (disabled={!code.trim()})
    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).toBeDisabled()
  })

  // ---------------------------------------------------------------------------
  // Direct access without session
  // ---------------------------------------------------------------------------

  test('direct access to /[slug]/catalogue without cookie redirects to /[slug]', async ({ page }) => {
    test.skip(!hasCredentials, 'TEST_MERCHANT_SLUG / TEST_ACCESS_CODE not set')

    // Navigate directly without any prior unlock (fresh browser context — no cookies)
    await page.goto(`/${slug}/catalogue`)

    // Should be redirected back to the code gate
    await page.waitForURL(`/${slug}`)
    expect(page.url()).toContain(`/${slug}`)
    await expect(page.locator('#access-code')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Unavailable merchant (unknown slug)
  // ---------------------------------------------------------------------------

  test('unknown slug shows "catalogue indisponible" message', async ({ page }) => {
    await page.goto('/slug-that-does-not-exist-xyz')

    // The CatalogUnavailablePage component renders this heading
    const heading = page.locator('h1', { hasText: 'Catalogue indisponible' })
    await expect(heading).toBeVisible()
  })
})

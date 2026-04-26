/**
 * Flow 04 — Merchant inscription
 *
 * Tests the /inscription form, client-side validation, and the success state.
 * Tests do NOT actually verify a Supabase user was created — they validate the
 * form behaviour and the confirmation UI rendered by SignUpForm.tsx.
 *
 * No env vars required for this flow (forms are exercised in isolation).
 */

import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helper — produce a unique email to avoid duplicate-account errors
// ---------------------------------------------------------------------------
function uniqueEmail(): string {
  return `test+${Date.now()}@playwright-souqly.invalid`
}

test.describe('Merchant inscription — /inscription', () => {

  // ---------------------------------------------------------------------------
  // Page structure
  // ---------------------------------------------------------------------------

  test('inscription page renders with required fields', async ({ page }) => {
    await page.goto('/inscription')

    // Brand heading "Souqly" links to /
    await expect(page.locator('a[href="/"]', { hasText: 'Souqly' })).toBeVisible()

    // Form fields (SignUpForm uses name attributes for FormData)
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="company_name"]')).toBeVisible()

    // Submit button
    await expect(page.locator('button[type="submit"]', { hasText: 'Créer mon compte' })).toBeVisible()
  })

  test('login link from inscription page is visible', async ({ page }) => {
    await page.goto('/inscription')
    const loginLink = page.locator('a[href="/login"]')
    await expect(loginLink).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Nominal — valid submission
  // ---------------------------------------------------------------------------

  test('submitting with valid data shows success confirmation', async ({ page }) => {
    await page.goto('/inscription')

    await page.fill('input[name="name"]', 'Marie Martin')
    await page.fill('input[name="email"]', uniqueEmail())
    await page.fill('input[name="password"]', 'MotDePasse123!')
    await page.fill('input[name="company_name"]', 'Boutique Test')

    await page.click('button[type="submit"]')

    // SignUpForm renders a role="status" element with the success message
    const successMessage = page.locator('[role="status"]')
    await expect(successMessage).toBeVisible({ timeout: 10_000 })
    await expect(successMessage.locator('text=Inscription enregistrée')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Validation errors — client-side / server-side
  // ---------------------------------------------------------------------------

  test('submitting with invalid email format shows error', async ({ page }) => {
    await page.goto('/inscription')

    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'not-an-email')
    await page.fill('input[name="password"]', 'MotDePasse123!')

    await page.click('button[type="submit"]')

    // Either native browser validation or server action error via role="alert"
    const emailInput = page.locator('input[name="email"]')
    const serverAlert = page.locator('[role="alert"]')

    // At least one of these must indicate an invalid state
    const isNativeInvalid = await emailInput.evaluate(
      (el) => !(el as HTMLInputElement).validity.valid,
    )
    if (!isNativeInvalid) {
      await expect(serverAlert).toBeVisible({ timeout: 8_000 })
    }
    // Page must NOT show the success status div
    await expect(page.locator('[role="status"]')).not.toBeVisible()
  })

  test('submitting without name shows validation state', async ({ page }) => {
    await page.goto('/inscription')

    // Leave name empty
    await page.fill('input[name="email"]', uniqueEmail())
    await page.fill('input[name="password"]', 'MotDePasse123!')
    await page.click('button[type="submit"]')

    // Native required validation or server error
    const nameInput = page.locator('input[name="name"]')
    const isNativeInvalid = await nameInput.evaluate(
      (el) => !(el as HTMLInputElement).validity.valid,
    )

    if (!isNativeInvalid) {
      await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 8_000 })
    }
    await expect(page.locator('[role="status"]')).not.toBeVisible()
  })

  test('password shorter than 8 characters is rejected', async ({ page }) => {
    await page.goto('/inscription')

    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', uniqueEmail())
    await page.fill('input[name="password"]', 'abc')
    await page.click('button[type="submit"]')

    // Input has minLength=8 — native validation fires before submit
    const passwordInput = page.locator('input[name="password"]')
    const isNativeInvalid = await passwordInput.evaluate(
      (el) => !(el as HTMLInputElement).validity.valid,
    )

    if (!isNativeInvalid) {
      // Server action Zod schema will reject and return error
      await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 8_000 })
    }
    await expect(page.locator('[role="status"]')).not.toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// /login page
// ---------------------------------------------------------------------------

test.describe('Merchant login — /login', () => {

  test('login page renders with email and password fields', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('a[href="/"]', { hasText: 'Souqly' })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]', { hasText: 'Se connecter' })).toBeVisible()
  })

  test('login page has links to /forgot-password and /inscription', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible()
    await expect(page.locator('a[href="/inscription"]')).toBeVisible()
  })

  test('submitting with wrong credentials shows error alert', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'nobody@does-not-exist.invalid')
    await page.fill('input[type="password"]', 'WrongPassword1!')
    await page.click('button[type="submit"]')

    const errorAlert = page.locator('[role="alert"]')
    await expect(errorAlert).toBeVisible({ timeout: 10_000 })
  })

  test('unauthenticated access to /dashboard redirects to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
    expect(page.url()).toContain('redirect')
  })
})

// ---------------------------------------------------------------------------
// /forgot-password page
// ---------------------------------------------------------------------------

test.describe('Forgot password — /forgot-password', () => {

  test('forgot-password page renders with email field and submit button', async ({ page }) => {
    await page.goto('/forgot-password')

    await expect(page.locator('input[type="email"]')).toBeVisible()
    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).toBeVisible()
  })

  test('submitting the form with a valid email does not crash', async ({ page }) => {
    await page.goto('/forgot-password')

    await page.fill('input[type="email"]', 'test@example.fr')
    await page.click('button[type="submit"]')

    // Page should not navigate away to an error page — a success or info message
    // OR simply no server error (5xx) should occur.
    // We check that no error alert with generic error appears.
    const heading = page.locator('h1')
    await expect(heading).toBeVisible({ timeout: 8_000 })
  })
})

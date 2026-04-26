import { type Page } from '@playwright/test'

/**
 * Unlocks a merchant catalogue by navigating to /[slug], filling the code
 * input and submitting. Waits for the redirect to /[slug]/catalogue.
 *
 * The input is targeted by its id ("access-code") which is the stable
 * identifier used in CodeAccessForm.tsx.
 */
export async function unlockCatalog(
  page: Page,
  slug: string,
  code: string,
): Promise<void> {
  await page.goto(`/${slug}`)
  await page.waitForSelector('#access-code')
  await page.fill('#access-code', code)
  await page.click('button[type="submit"]')
  await page.waitForURL(`/${slug}/catalogue`)
}

/**
 * Signs in a merchant via the /login page (SignInForm).
 * Waits for redirect to /dashboard after successful authentication.
 */
export async function signInMerchant(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto('/login')
  await page.waitForSelector('input[type="email"]')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
}

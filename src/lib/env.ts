type EnvName = keyof NodeJS.ProcessEnv

function readFirstEnv(names: EnvName[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]
    if (value && value.trim().length > 0) return value.trim()
  }
  return undefined
}

export function getRequiredEnv(names: EnvName[], label = names.join(' or ')): string {
  const value = readFirstEnv(names)
  if (!value) {
    throw new Error(`${label} is not set`)
  }
  return value
}

export function getSiteUrl(): string {
  return getRequiredEnv(['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_APP_URL'], 'NEXT_PUBLIC_SITE_URL')
    .replace(/\/+$/, '')
}

export function getStripePriceId(): string {
  return getRequiredEnv(
    ['NEXT_PUBLIC_STRIPE_PRICE_ID', 'STRIPE_PRICE_ID'],
    'NEXT_PUBLIC_STRIPE_PRICE_ID',
  )
}

export function getStripeWebhookSecret(): string {
  return getRequiredEnv(['STRIPE_WEBHOOK_SECRET'])
}

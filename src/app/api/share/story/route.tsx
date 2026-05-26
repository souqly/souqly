import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const W = 1080
const H = 1920

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams

  const merchantName = p.get('mn') ?? 'Ma Boutique'
  const shopUrl = p.get('su') ?? ''
  const logoUrl = p.get('lu') ?? ''
  const productName = p.get('pn') ?? ''
  const price = p.get('pp') ?? ''
  const productImg = p.get('pi') ?? ''

  const initial = merchantName.charAt(0).toUpperCase()

  const res = new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 55%, #0F172A 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '100px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top: Logo + Nom boutique */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              width={140}
              height={140}
              style={{ borderRadius: 32, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.12)' }}
            />
          ) : (
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 32,
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 68,
                fontWeight: 800,
              }}
            >
              {initial}
            </div>
          )}
          <span
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-1px',
              textAlign: 'center',
            }}
          >
            {merchantName}
          </span>
        </div>

        {/* Milieu: Image produit + nom + prix */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, width: '100%' }}>
          {productImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={productImg}
              width={840}
              height={840}
              style={{ borderRadius: 40, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.08)' }}
            />
          ) : (
            <div
              style={{
                width: 840,
                height: 840,
                borderRadius: 40,
                background: 'rgba(255,255,255,0.03)',
                border: '2px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 120 }}>✦</span>
            </div>
          )}

          {productName && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <span
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  letterSpacing: '-0.5px',
                }}
              >
                {productName}
              </span>
              {price && (
                <span
                  style={{
                    fontSize: 42,
                    fontWeight: 700,
                    color: '#A5B4FC',
                    background: 'rgba(79,70,229,0.25)',
                    border: '1.5px solid rgba(99,102,241,0.4)',
                    borderRadius: 999,
                    padding: '12px 36px',
                  }}
                >
                  {price}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bas: CTA + URL */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#4F46E5',
              borderRadius: 18,
              padding: '22px 56px',
            }}
          >
            <span style={{ color: 'white', fontSize: 34, fontWeight: 700 }}>Voir la boutique →</span>
          </div>
          {shopUrl && (
            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              {shopUrl}
            </span>
          )}
        </div>
      </div>
    ),
    { width: W, height: H },
  )

  res.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  return res
}

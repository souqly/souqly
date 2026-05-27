import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const W = 1080
const H = 1080

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams

  const merchantName = p.get('mn') ?? 'Ma Boutique'
  const shopUrl = p.get('su') ?? ''
  const logoUrl = p.get('lu') ?? ''
  const code = p.get('code') ?? ''

  const initial = merchantName.charAt(0).toUpperCase()
  const displayCode = code.toUpperCase() || '— — — —'

  const res = new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          background: 'linear-gradient(145deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px 100px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Halo de fond */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: '50%',
            width: 700,
            height: 700,
            marginLeft: -350,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Haut : Logo + Nom */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              width={110}
              height={110}
              style={{ borderRadius: 24, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.12)' }}
            />
          ) : (
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 24,
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 52,
                fontWeight: 800,
              }}
            >
              {initial}
            </div>
          )}
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-1px',
              textAlign: 'center',
            }}
          >
            {merchantName}
          </span>
        </div>

        {/* Milieu : tagline + code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, width: '100%' }}>
          {/* Tagline */}
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: 'rgba(165,180,252,0.9)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            ✦ Catalogue Privé ✦
          </span>

          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>
            Code d&apos;accès
          </span>

          {/* Code bien mis en valeur */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              background: 'rgba(79,70,229,0.15)',
              border: '2px solid rgba(99,102,241,0.45)',
              borderRadius: 20,
              padding: '28px 40px',
            }}
          >
            <span
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#E0E7FF',
                letterSpacing: '0.18em',
                fontFamily: 'monospace, system-ui',
              }}
            >
              {displayCode}
            </span>
          </div>
        </div>

        {/* Bas : URL */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {shopUrl && (
            <span
              style={{
                fontSize: 24,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.04em',
              }}
            >
              {shopUrl}
            </span>
          )}
          {/* Powered by Souqly */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              S
            </div>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
              Souqly
            </span>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  )

  res.headers.set('Cache-Control', 'no-store')
  return res
}

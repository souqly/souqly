// Route handler — OG Image dynamique
// ImageResponse est disponible depuis next/og (Next.js 13.3+)
// Pas besoin de @vercel/og séparé

import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const WIDTH = 1200;
const HEIGHT = 630;

type OGType = 'home' | 'feature' | 'article' | 'pricing';

const TYPE_CONFIG: Record<
  OGType,
  { badge: string; accentColor: string; bgGradient: string }
> = {
  home: {
    badge: 'Plateforme catalogue',
    accentColor: '#4F46E5',
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
  },
  feature: {
    badge: 'Fonctionnalité',
    accentColor: '#6366F1',
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
  },
  article: {
    badge: 'Article',
    accentColor: '#F59E0B',
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1C1917 100%)',
  },
  pricing: {
    badge: 'Tarifs',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #064E3B 100%)',
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const rawType = searchParams.get('type') ?? 'home';
  const type: OGType =
    rawType === 'home' ||
    rawType === 'feature' ||
    rawType === 'article' ||
    rawType === 'pricing'
      ? rawType
      : 'home';

  const title =
    searchParams.get('title') ??
    'Catalogue en ligne protégé pour marchands WhatsApp';

  const subtitle =
    searchParams.get('subtitle') ??
    'Code d\'accès · Commande WhatsApp en 1 clic · 14 jours gratuits';

  const config = TYPE_CONFIG[type];

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: config.bgGradient,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Halo de fond */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 800,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${config.accentColor}30 0%, transparent 70%)`,
          }}
        />

        {/* Header : Logo + Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo Souqly */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: config.accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              S
            </div>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#F8FAFC',
                letterSpacing: '-0.5px',
              }}
            >
              Souqly
            </span>
          </div>

          {/* Badge type */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: `${config.accentColor}20`,
              border: `1px solid ${config.accentColor}40`,
              borderRadius: 999,
              padding: '8px 20px',
              color: config.accentColor === '#F59E0B' ? '#FCD34D' : config.accentColor,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {config.badge}
          </div>
        </div>

        {/* Contenu central */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            maxWidth: 800,
          }}
        >
          <h1
            style={{
              fontSize: title.length > 60 ? 44 : 54,
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: '-1px',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 22,
              color: '#94A3B8',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p
            style={{
              fontSize: 16,
              color: '#475569',
              margin: 0,
            }}
          >
            souqly.fr
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: config.accentColor,
              borderRadius: 8,
              padding: '10px 24px',
              color: 'white',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Commencer — 14j gratuits
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    }
  );

  // Cache Edge : 24h côté CDN Vercel, revalidation silencieuse jusqu'à 7j
  // Réduit les invocations Edge Function lors des partages sociaux répétés
  imageResponse.headers.set(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800'
  );

  return imageResponse;
}

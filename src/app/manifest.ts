import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Souqly — Catalogue en ligne marchand',
    short_name: 'Souqly',
    description:
      'Créez votre catalogue produit privé et recevez des commandes WhatsApp en 1 clic.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#4F46E5',
    orientation: 'portrait-primary',
    lang: 'fr',
    categories: ['business', 'productivity', 'shopping'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/dashboard.png',
        sizes: '1280x720',
        type: 'image/png',
      },
    ],
  };
}

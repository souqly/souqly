import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/fonctionnalites',
          '/tarifs',
          '/a-propos',
          '/blog',
          '/blog/',
          '/inscription',
          '/legal/',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/auth/',
          '/forgot-password',
          '/og',
          '/_next/',
        ],
      },
      // Bloquer les crawlers agressifs
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://souqly.fr/sitemap.xml',
    host: 'https://souqly.fr',
  };
}

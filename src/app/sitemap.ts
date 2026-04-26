import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const BASE_URL = 'https://souqly.fr';

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Pages marketing statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/fonctionnalites`,
      lastModified: now,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tarifs`,
      lastModified: now,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/a-propos`,
      lastModified: now,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/inscription`,
      lastModified: now,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/legal/cgu`,
      lastModified: now,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/legal/confidentialite`,
      lastModified: now,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/legal/cookies`,
      lastModified: now,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.2,
    },
  ];

  // Pages blog dynamiques
  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}

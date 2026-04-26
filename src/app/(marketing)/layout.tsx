// Server Component — layout racine du groupe marketing
import type { Metadata } from 'next';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://souqly.fr'),
  applicationName: 'Souqly',
  authors: [{ name: 'Souqly', url: 'https://souqly.fr' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  openGraph: {
    siteName: 'Souqly',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@souqly_fr',
    creator: '@souqly_fr',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

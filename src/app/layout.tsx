import type { Metadata } from 'next'
import { Inter, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Poids 400 et 500 retirés : aucun titre (font-heading) ne les utilise.
// Seuls font-semibold (600), font-bold (700) et font-extrabold (800) sont actifs.
// Économie : ~15–20 KB de font data.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Souqly — Catalogues marchands',
  description: 'Découvrez et commandez depuis les catalogues de vos marchands préférés.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${bricolage.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-50">
        {children}
      </body>
    </html>
  )
}

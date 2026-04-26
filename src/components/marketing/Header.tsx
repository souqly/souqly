'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '/fonctionnalites' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'Blog', href: '/blog' },
  { label: 'À propos', href: '/a-propos' },
] as const;

// Server Component : Header — 'use client' requis pour scroll state + mobile menu
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Fermer le menu au changement de route
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full border-b transition-all duration-200',
        scrolled
          ? 'border-white/10 bg-slate-900/90 backdrop-blur-md'
          : 'border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Souqly — Accueil">
          <span className="sr-only">Souqly</span>
          <SouqlyLogo />
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Commencer gratuitement
          </Link>
        </div>

        {/* Bouton burger mobile */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col bg-slate-900 px-5 py-6 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/15 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Connexion marchand
            </Link>
            <Link
              href="/inscription"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Commencer gratuitement — 14j offerts
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function SouqlyLogo() {
  return (
    <svg
      width="110"
      height="28"
      viewBox="0 0 110 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Icône carré arrondi avec S */}
      <rect width="28" height="28" rx="7" fill="#4F46E5" />
      <path
        d="M8 11c0-1.657 1.343-3 3-3h6a3 3 0 0 1 0 6H11a3 3 0 0 0 0 6h6a3 3 0 0 0 3-3"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Texte "Souqly" */}
      <text
        x="36"
        y="20"
        fontFamily="'Bricolage Grotesque', 'Inter', system-ui, sans-serif"
        fontWeight="700"
        fontSize="15"
        fill="#F8FAFC"
        letterSpacing="-0.3"
      >
        Souqly
      </text>
    </svg>
  );
}

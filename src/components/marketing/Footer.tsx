// Server Component
import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Produit',
    links: [
      { label: 'Fonctionnalités', href: '/fonctionnalites' },
      { label: 'Tarifs', href: '/tarifs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Inscription', href: '/inscription' },
    ],
  },
  {
    heading: 'Ressources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Guide démarrage', href: '/docs/demarrage' },
      { label: 'Centre d\'aide', href: '/aide' },
    ],
  },
  {
    heading: 'Légal',
    links: [
      { label: 'Mentions légales', href: '/legal/mentions-legales' },
      { label: 'CGU', href: '/legal/cgu' },
      { label: 'Confidentialité', href: '/legal/confidentialite' },
      { label: 'Cookies', href: '/legal/cookies' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: 'bonjour@souqly.fr', href: 'mailto:bonjour@souqly.fr' },
      { label: 'Instagram', href: 'https://instagram.com/souqly_fr' },
      { label: 'Twitter / X', href: 'https://twitter.com/souqly_fr' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-14">
        {/* Grille principale : branding + 4 colonnes de nav */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          {/* Branding */}
          <div className="space-y-4">
            <Link href="/" aria-label="Souqly — Accueil">
              <SouqlyLogoFull />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-slate-400">
              Le catalogue pro pour marchands WhatsApp. Accès par code, commande en 1 clic,
              aucune commission.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://instagram.com/souqly_fr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Souqly sur Instagram"
                className="text-slate-500 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://twitter.com/souqly_fr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Souqly sur Twitter / X"
                className="text-slate-500 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <XIcon />
              </a>
            </div>
          </div>

          {/* Colonnes de navigation */}
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Barre de copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; 2026 Souqly. Fait avec &#10084;&#65039; en France.
          </p>
          <p className="text-xs text-slate-600">
            Plateforme indépendante — aucune commission sur vos ventes.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Logo SVG Souqly (identique au Header)
// ---------------------------------------------------------------------------

function SouqlyLogoFull() {
  return (
    <svg
      width="110"
      height="28"
      viewBox="0 0 110 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="7" fill="#4F46E5" />
      <path
        d="M8 11c0-1.657 1.343-3 3-3h6a3 3 0 0 1 0 6H11a3 3 0 0 0 0 6h6a3 3 0 0 0 3-3"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
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

// ---------------------------------------------------------------------------
// Icônes sociales inline (évite les packs tiers — uniquement lucide n'a pas
// d'icône Instagram/X officielle correspondant au design souhaité)
// ---------------------------------------------------------------------------

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

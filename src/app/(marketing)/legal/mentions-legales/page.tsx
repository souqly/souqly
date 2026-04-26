{/* AVERTISSEMENT : Ce document a été généré à titre indicatif. Il ne constitue pas un avis juridique. Faites valider par un avocat avant publication. */}

// Server Component — Mentions légales
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Mentions légales | Souqly',
  description: 'Mentions légales de Souqly — éditeur, directeur de la publication, hébergeurs, propriété intellectuelle et droit applicable.',
  alternates: { canonical: 'https://souqly.fr/legal/mentions-legales' },
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5">

        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-slate-500">
            <li><Link href="/" className="hover:text-slate-300">Accueil</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/legal/mentions-legales" className="hover:text-slate-300">Légal</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-400">Mentions légales</li>
          </ol>
        </nav>

        <h1 className="font-heading text-3xl font-bold text-white">Mentions légales</h1>
        <p className="mt-2 text-sm text-slate-500">Dernière mise à jour : 26 avril 2026</p>

        <div className="mt-10 space-y-10 text-slate-400 text-sm leading-7">

          {/* 1. Éditeur */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              1. Éditeur du site
            </h2>
            <p>
              Le site <strong className="text-slate-200">souqly.fr</strong> est édité par :
            </p>
            <ul className="mt-3 space-y-1 not-italic">
              <li><strong className="text-slate-300">Dénomination sociale :</strong> Souqly</li>
              <li><strong className="text-slate-300">Forme juridique :</strong> [à compléter — ex. SAS, SARL, auto-entrepreneur]</li>
              <li><strong className="text-slate-300">Capital social :</strong> [à compléter]</li>
              <li><strong className="text-slate-300">SIREN :</strong> [à compléter]</li>
              <li><strong className="text-slate-300">Siège social :</strong> [adresse complète à compléter]</li>
              <li>
                <strong className="text-slate-300">Email :</strong>{' '}
                <a href="mailto:bonjour@souqly.fr" className="text-indigo-400 hover:underline">
                  bonjour@souqly.fr
                </a>
              </li>
            </ul>
          </section>

          {/* 2. Directeur de la publication */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              2. Directeur de la publication
            </h2>
            <p>
              Le directeur de la publication est :{' '}
              <strong className="text-slate-300">[Nom et prénom du dirigeant à compléter]</strong>,
              en qualité de [fonction — ex. gérant, président].
            </p>
          </section>

          {/* 3. Hébergement */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              3. Hébergement
            </h2>
            <p className="font-medium text-slate-300">Hébergement frontend (site web) :</p>
            <p className="mt-1">
              <strong className="text-slate-200">Vercel Inc.</strong><br />
              340 Pine Street, Suite 1850<br />
              San Francisco, CA 94104 — États-Unis<br />
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                vercel.com
              </a>
            </p>
            <p className="mt-4 font-medium text-slate-300">Hébergement base de données :</p>
            <p className="mt-1">
              <strong className="text-slate-200">Supabase Inc.</strong><br />
              970 Toa Payoh North #07-04<br />
              Singapore 318992<br />
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                supabase.com
              </a>
            </p>
          </section>

          {/* 4. Propriété intellectuelle */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              4. Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des éléments constituant le site souqly.fr — textes, graphismes, logotypes, icônes,
              images, sons, logiciels — est protégé par le droit d&apos;auteur et, plus généralement, par les
              dispositions du Code de la propriété intellectuelle.
            </p>
            <p className="mt-3">
              Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout
              ou partie de ces éléments, par quelque moyen ou procédé que ce soit, sans autorisation écrite
              préalable de Souqly, est strictement interdite et constituerait une contrefaçon sanctionnée par
              les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
            </p>
          </section>

          {/* 5. Liens hypertextes */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              5. Liens hypertextes
            </h2>
            <p>
              Le site souqly.fr peut contenir des liens vers des sites tiers. Ces liens sont fournis à titre
              informatif uniquement. Souqly n&apos;exerce aucun contrôle sur ces sites et décline toute
              responsabilité quant à leur contenu, leurs pratiques en matière de confidentialité ou leur
              disponibilité.
            </p>
            <p className="mt-3">
              Tout site souhaitant établir un lien hypertexte vers souqly.fr doit obtenir l&apos;autorisation
              préalable écrite de Souqly. Les demandes sont à adresser à{' '}
              <a href="mailto:bonjour@souqly.fr" className="text-indigo-400 hover:underline">
                bonjour@souqly.fr
              </a>.
            </p>
          </section>

          {/* 6. Limitation de responsabilité */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              6. Limitation de responsabilité
            </h2>
            <p>
              Souqly s&apos;efforce de maintenir les informations publiées sur ce site aussi exactes et à jour
              que possible. Toutefois, Souqly ne peut garantir l&apos;exactitude, la complétude ni
              l&apos;actualité de ces informations et ne saurait être tenu responsable des erreurs ou omissions,
              ni de toute conséquence résultant de l&apos;utilisation des informations publiées.
            </p>
            <p className="mt-3">
              L&apos;accès au site peut être interrompu à tout moment pour des raisons de maintenance, de mise
              à jour ou de force majeure. Souqly ne saurait être tenu responsable de ces interruptions ni de
              leurs conséquences éventuelles.
            </p>
          </section>

          {/* 7. Droit applicable */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              7. Droit applicable et juridiction compétente
            </h2>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige relatif à
              l&apos;interprétation ou à l&apos;exécution des présentes, et à défaut d&apos;accord amiable,
              compétence exclusive est attribuée aux tribunaux français du ressort du siège social de Souqly.
            </p>
          </section>

          {/* 8. Contact */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              8. Contact
            </h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à
              l&apos;adresse :{' '}
              <a href="mailto:bonjour@souqly.fr" className="text-indigo-400 hover:underline">
                bonjour@souqly.fr
              </a>
            </p>
          </section>

        </div>

        {/* Navigation entre pages légales */}
        <nav aria-label="Autres pages légales" className="mt-16 border-t border-white/10 pt-8">
          <p className="mb-4 text-xs text-slate-500 uppercase tracking-wider">Autres pages légales</p>
          <ul className="flex flex-wrap gap-4 text-sm">
            <li>
              <Link href="/legal/cgu" className="text-indigo-400 hover:underline">
                Conditions d&apos;utilisation
              </Link>
            </li>
            <li>
              <Link href="/legal/confidentialite" className="text-indigo-400 hover:underline">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className="text-indigo-400 hover:underline">
                Politique de cookies
              </Link>
            </li>
          </ul>
        </nav>

      </div>
    </div>
  );
}

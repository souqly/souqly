{/* AVERTISSEMENT : Ce document a été généré à titre indicatif. Il ne constitue pas un avis juridique. Faites valider par un avocat avant publication. */}

// Server Component — Politique de cookies
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Politique de cookies | Souqly',
  description:
    "Politique de cookies de Souqly. Souqly n'utilise pas de cookies de tracking. Détail des cookies techniques et de la mesure d'audience anonymisée via Plausible.",
  alternates: { canonical: 'https://souqly.fr/legal/cookies' },
  robots: { index: false, follow: false },
};

const COOKIES_TECHNIQUES = [
  {
    nom: 'sb-[ref]-auth-token',
    type: 'Fonctionnel — authentification',
    emetteur: 'Supabase (Souqly)',
    duree: 'Durée de la session',
    finalite:
      "Maintien de la session d'authentification du marchand sur le tableau de bord. Cookie httpOnly, Secure, SameSite=Lax. Déposé uniquement si vous accédez à l'espace marchand.",
    consentement: 'Non requis (strictement nécessaire)',
  },
  {
    nom: 'access_[slug]',
    type: 'Fonctionnel — accès catalogue',
    emetteur: 'Souqly',
    duree: '24 heures',
    finalite:
      "Mémorise la validation du code d'accès pour un catalogue marchand donné. Cookie httpOnly, Secure. Déposé uniquement lors de l'accès à un catalogue protégé.",
    consentement: 'Non requis (strictement nécessaire)',
  },
] as const;

export default function CookiesPage() {
  return (
    <div className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5">

        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-slate-500">
            <li><Link href="/" className="hover:text-slate-300">Accueil</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/legal/cookies" className="hover:text-slate-300">Légal</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-400">Politique de cookies</li>
          </ol>
        </nav>

        <h1 className="font-heading text-3xl font-bold text-white">Politique de cookies</h1>
        <p className="mt-2 text-sm text-slate-500">Dernière mise à jour : 26 avril 2026</p>

        <div className="mt-10 space-y-10 text-slate-400 text-sm leading-7">

          {/* 1. Qu'est-ce qu'un cookie */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              1. Qu&apos;est-ce qu&apos;un cookie ?
            </h2>
            <p>
              Un cookie est un petit fichier texte enregistré sur votre navigateur lors de la visite d&apos;un
              site web. Il permet au site de mémoriser certaines informations entre deux visites (préférences,
              état de connexion, etc.).
            </p>
            <p className="mt-3">
              La réglementation applicable aux cookies est définie par la directive ePrivacy (2002/58/CE,
              modifiée par la directive 2009/136/CE) et les lignes directrices de la CNIL. Seuls les cookies
              strictement nécessaires au fonctionnement du service sont exonérés de consentement préalable
              (article 5.3 de la directive ePrivacy).
            </p>
          </section>

          {/* 2. Récapitulatif */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              2. Récapitulatif — ce que Souqly fait et ne fait pas
            </h2>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="py-3 px-4 text-left text-slate-300">Pratique</th>
                    <th className="py-3 px-4 text-left text-slate-300">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['Cookies publicitaires / remarketing', 'Aucun'],
                    ['Google Analytics / Meta Pixel / Hotjar', 'Aucun'],
                    ['Fingerprinting ou suivi cross-sites', 'Aucun'],
                    ['Cookies tiers de réseaux sociaux', 'Aucun'],
                    ['Mesure audience (Plausible — sans cookie)', 'Oui, anonymisé'],
                    ['Cookies de session marchand (httpOnly)', 'Oui, fonctionnel'],
                    ['Cookies d\'accès catalogue (httpOnly)', 'Oui, fonctionnel'],
                    ['Bandeau de consentement cookies requis', 'Non requis'],
                  ].map(([pratique, statut]) => (
                    <tr key={pratique}>
                      <td className="py-3 px-4">{pratique}</td>
                      <td className={`py-3 px-4 font-medium ${
                        statut === 'Aucun' ? 'text-green-400' :
                        statut === 'Non requis' ? 'text-slate-400' :
                        'text-indigo-300'
                      }`}>{statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Plausible */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              3. Mesure d&apos;audience — Plausible Analytics
            </h2>
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 mb-4">
              <p>
                <strong className="text-indigo-300">Aucun cookie n&apos;est déposé</strong> par Plausible
                Analytics. Aucun consentement préalable n&apos;est requis pour cette mesure d&apos;audience.
              </p>
            </div>
            <p>
              Souqly utilise <strong className="text-slate-300">Plausible Analytics</strong> pour mesurer
              l&apos;audience du site souqly.fr. Plausible est une solution d&apos;analyse d&apos;audience respectueuse de
              la vie privée, hébergée en Union européenne (Allemagne), qui fonctionne sans cookies et sans
              collecte de données personnelles identifiantes.
            </p>
            <p className="mt-3">Ce que Plausible mesure de façon agrégée et anonymisée :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Nombre de pages vues et de visites</li>
              <li>Page d&apos;entrée et de sortie</li>
              <li>Source de trafic (référent, UTM)</li>
              <li>Pays et type d&apos;appareil (agrégé)</li>
              <li>Navigateur et système d&apos;exploitation (agrégé)</li>
            </ul>
            <p className="mt-3">Ce que Plausible ne collecte <strong className="text-slate-300">jamais</strong> :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Adresse IP complète (tronquée et non stockée)</li>
              <li>Empreinte navigateur (fingerprinting)</li>
              <li>Identifiant utilisateur ou cookie de suivi</li>
              <li>Données entre plusieurs sites</li>
            </ul>
            <p className="mt-3">
              Base légale : intérêt légitime (article 6.1.f RGPD). Ce traitement ne nécessite pas de
              consentement au titre de la directive ePrivacy (article 5.3), aucun cookie ou traceur n&apos;étant
              déposé sur votre terminal.
            </p>
            <p className="mt-3">
              En savoir plus sur la politique de confidentialité de Plausible :{' '}
              <a
                href="https://plausible.io/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                plausible.io/privacy
              </a>
            </p>
          </section>

          {/* 4. Cookies techniques */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              4. Cookies strictement nécessaires
            </h2>
            <p>
              Les cookies suivants sont déposés uniquement lorsque vous utilisez des fonctionnalités
              spécifiques (connexion à l&apos;espace marchand ou accès à un catalogue protégé). Ils sont
              strictement nécessaires au fonctionnement du service et sont exemptés de consentement préalable
              au titre de l&apos;article 5.3 de la directive ePrivacy.
            </p>
            <p className="mt-3">
              <strong className="text-slate-300">Ces cookies ne sont pas déposés sur le site vitrine</strong>{' '}
              souqly.fr lors d&apos;une simple visite de navigation.
            </p>

            <div className="mt-4 space-y-4">
              {COOKIES_TECHNIQUES.map((c) => (
                <div
                  key={c.nom}
                  className="rounded-lg border border-white/10 bg-white/[0.02] p-4"
                >
                  <p className="font-mono text-xs text-indigo-300 mb-2">{c.nom}</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                    <dt className="text-slate-500">Type</dt>
                    <dd className="text-slate-400">{c.type}</dd>
                    <dt className="text-slate-500">Émetteur</dt>
                    <dd className="text-slate-400">{c.emetteur}</dd>
                    <dt className="text-slate-500">Durée</dt>
                    <dd className="text-slate-400">{c.duree}</dd>
                    <dt className="text-slate-500">Finalité</dt>
                    <dd className="text-slate-400">{c.finalite}</dd>
                    <dt className="text-slate-500">Consentement</dt>
                    <dd className="text-green-400">{c.consentement}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Bandeau */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              5. Bandeau de consentement
            </h2>
            <p>
              Souqly n&apos;affiche <strong className="text-slate-300">pas de bandeau de gestion des cookies</strong>{' '}
              sur le site souqly.fr pour les raisons suivantes :
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                Plausible Analytics ne dépose aucun cookie et ne collecte aucune donnée personnelle
                identifiante. Aucun consentement n&apos;est requis au titre de la directive ePrivacy.
              </li>
              <li>
                Les cookies techniques (session marchand, accès catalogue) sont strictement nécessaires au
                fonctionnement du service et sont exemptés de consentement.
              </li>
              <li>
                Aucun cookie publicitaire, de remarketing ou de suivi tiers n&apos;est déposé.
              </li>
            </ul>
            <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-amber-300">
              <strong>Note :</strong> cette exemption de bandeau est valide tant que la configuration de
              Plausible reste en mode sans cookie et que Souqly n&apos;intègre aucun cookie ou traceur tiers.
              Toute modification de cette configuration devra faire l&apos;objet d&apos;une mise à jour de la présente
              politique et d&apos;un audit de conformité ePrivacy.
            </p>
          </section>

          {/* 6. Gestion */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              6. Gérer les cookies dans votre navigateur
            </h2>
            <p>
              Vous pouvez à tout moment consulter et supprimer les cookies déposés sur votre navigateur via
              les paramètres de confidentialité :
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-slate-300">Google Chrome :</strong> Paramètres → Confidentialité et
                sécurité → Cookies et autres données des sites
              </li>
              <li>
                <strong className="text-slate-300">Mozilla Firefox :</strong> Paramètres → Vie privée et
                sécurité → Cookies et données de sites
              </li>
              <li>
                <strong className="text-slate-300">Apple Safari :</strong> Préférences → Confidentialité →
                Gérer les données des sites web
              </li>
              <li>
                <strong className="text-slate-300">Microsoft Edge :</strong> Paramètres → Cookies et
                autorisations de site
              </li>
            </ul>
            <p className="mt-3 text-slate-500">
              La suppression des cookies de session entraîne votre déconnexion automatique de l&apos;espace
              marchand et la perte de l&apos;accès validé aux catalogues protégés.
            </p>
          </section>

          {/* 7. Contact */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              7. Contact
            </h2>
            <p>
              Pour toute question relative à la présente politique de cookies ou à la protection de vos
              données personnelles :{' '}
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
              <Link href="/legal/mentions-legales" className="text-indigo-400 hover:underline">
                Mentions légales
              </Link>
            </li>
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
          </ul>
        </nav>

      </div>
    </div>
  );
}

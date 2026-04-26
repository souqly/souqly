{/* AVERTISSEMENT : Ce document a été généré à titre indicatif. Il ne constitue pas un avis juridique. Faites valider par un avocat avant publication. */}

// Server Component — Politique de confidentialité (visiteurs site marketing)
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Souqly',
  description:
    'Politique de confidentialité RGPD de Souqly. Données collectées sur le site souqly.fr, bases légales, durées de conservation et droits des visiteurs.',
  alternates: { canonical: 'https://souqly.fr/legal/confidentialite' },
  robots: { index: false, follow: false },
};

export default function ConfidentialitePage() {
  return (
    <div className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5">

        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-slate-500">
            <li><Link href="/" className="hover:text-slate-300">Accueil</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/legal/confidentialite" className="hover:text-slate-300">Légal</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-400">Confidentialité</li>
          </ol>
        </nav>

        <h1 className="font-heading text-3xl font-bold text-white">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Dernière mise à jour : 26 avril 2026 — Conforme au RGPD (Règlement UE 2016/679)
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Cette politique concerne uniquement les visiteurs du site marketing souqly.fr.
          Les traitements relatifs aux marchands abonnés sont décrits dans les conditions contractuelles SaaS.
        </p>

        <div className="mt-10 space-y-10 text-slate-400 text-sm leading-7">

          {/* 1. Responsable */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              1. Responsable du traitement
            </h2>
            <p>
              Le responsable du traitement des données à caractère personnel collectées sur le site souqly.fr est :
            </p>
            <ul className="mt-3 space-y-1">
              <li><strong className="text-slate-300">Souqly</strong></li>
              <li>[Forme juridique et SIREN à compléter — cf. mentions légales]</li>
              <li>
                Email :{' '}
                <a href="mailto:bonjour@souqly.fr" className="text-indigo-400 hover:underline">
                  bonjour@souqly.fr
                </a>
              </li>
            </ul>
            <p className="mt-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-slate-400">
              <strong className="text-slate-300">Délégué à la Protection des Données (DPO) :</strong> Souqly
              n&apos;est pas tenu de désigner un DPO (structure de moins de 250 personnes, traitement de données
              non systématique au sens de l&apos;article 37 du RGPD). Pour toute question relative à vos données,
              contactez :{' '}
              <a href="mailto:bonjour@souqly.fr" className="text-indigo-400 hover:underline">
                bonjour@souqly.fr
              </a>
            </p>
          </section>

          {/* 2. Données collectées */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              2. Données collectées sur le site marketing
            </h2>

            {/* Tableau traitements */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-4 text-left text-slate-300">Traitement</th>
                    <th className="py-3 pr-4 text-left text-slate-300">Données concernées</th>
                    <th className="py-3 pr-4 text-left text-slate-300">Base légale</th>
                    <th className="py-3 text-left text-slate-300">Conservation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-300">Mesure d&apos;audience</td>
                    <td className="py-3 pr-4">
                      URL visitée, référent, type de navigateur, pays (agrégé) — <em>aucune donnée personnelle identifiante</em>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      Intérêt légitime (art. 6.1.f RGPD) — mesure d&apos;audience anonymisée
                    </td>
                    <td className="py-3 text-slate-500">Données agrégées, pas de stockage individuel</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-300">Formulaire de contact / demande d&apos;accès marchand</td>
                    <td className="py-3 pr-4">Nom, adresse email, numéro de téléphone (optionnel), message</td>
                    <td className="py-3 pr-4 text-slate-500">
                      Exécution de mesures précontractuelles (art. 6.1.b RGPD)
                    </td>
                    <td className="py-3 text-slate-500">3 ans à compter de la demande</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
              <p>
                <strong className="text-indigo-300">Plausible Analytics :</strong> Souqly utilise Plausible
                Analytics pour mesurer l&apos;audience du site. Plausible est configuré en mode sans cookie : aucun
                cookie n&apos;est déposé sur votre navigateur et aucune donnée personnelle identifiante
                (adresse IP complète, empreinte navigateur) n&apos;est collectée ni stockée. La mesure est réalisée
                côté serveur à partir de données agrégées et anonymisées. Ce traitement ne nécessite pas votre
                consentement préalable au titre de la directive ePrivacy (article 5.3).
              </p>
            </div>
          </section>

          {/* 3. Finalités */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              3. Finalités des traitements
            </h2>
            <p>Les données collectées sur le site marketing sont utilisées aux fins suivantes :</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <strong className="text-slate-300">Mesure d&apos;audience anonymisée</strong> : comprendre comment
                les visiteurs naviguent sur le site afin d&apos;en améliorer l&apos;ergonomie et le contenu.
              </li>
              <li>
                <strong className="text-slate-300">Traitement des demandes de contact</strong> : répondre aux
                questions et demandes d&apos;information envoyées via le formulaire de contact.
              </li>
              <li>
                <strong className="text-slate-300">Traitement des demandes d&apos;inscription marchand</strong> :
                instruire et répondre aux demandes d&apos;accès à la plateforme SaaS Souqly.
              </li>
              <li>
                <strong className="text-slate-300">Envoi d&apos;emails transactionnels</strong> : accusé de réception,
                confirmation d&apos;inscription ou suivi de demande.
              </li>
            </ul>
            <p className="mt-3">
              Souqly ne réalise <strong className="text-slate-300">aucun profilage</strong> ni traitement
              automatisé produisant des effets juridiques à partir des données collectées sur le site marketing.
            </p>
          </section>

          {/* 4. Destinataires */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              4. Destinataires et sous-traitants
            </h2>
            <p>
              Souqly ne vend ni ne loue vos données à des tiers. Les données peuvent être transmises aux
              sous-traitants suivants, dans le strict cadre de l&apos;exécution du service :
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-4 text-left text-slate-300">Sous-traitant</th>
                    <th className="py-3 pr-4 text-left text-slate-300">Rôle</th>
                    <th className="py-3 pr-4 text-left text-slate-300">Localisation</th>
                    <th className="py-3 text-left text-slate-300">Garanties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-300">Vercel Inc.</td>
                    <td className="py-3 pr-4">Hébergement du site web (frontend)</td>
                    <td className="py-3 pr-4 text-slate-500">États-Unis (région EU disponible)</td>
                    <td className="py-3 text-slate-500">Clauses contractuelles types (SCCs) UE–USA</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-300">Supabase Inc.</td>
                    <td className="py-3 pr-4">Stockage des données de formulaires</td>
                    <td className="py-3 pr-4 text-slate-500">Singapour (région EU disponible)</td>
                    <td className="py-3 text-slate-500">Clauses contractuelles types (SCCs)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-300">Resend</td>
                    <td className="py-3 pr-4">Envoi d&apos;emails transactionnels</td>
                    <td className="py-3 pr-4 text-slate-500">États-Unis</td>
                    <td className="py-3 text-slate-500">Clauses contractuelles types (SCCs) UE–USA</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-300">Plausible Analytics</td>
                    <td className="py-3 pr-4">Mesure d&apos;audience anonymisée</td>
                    <td className="py-3 pr-4 text-slate-500">Union européenne (Allemagne)</td>
                    <td className="py-3 text-slate-500">Aucun transfert hors UE — données agrégées uniquement</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Concernant Vercel et Supabase : ces prestataires peuvent traiter des données en dehors de l&apos;Union
              européenne. Souqly s&apos;assure que ces transferts sont encadrés par des clauses contractuelles types
              (SCCs) approuvées par la Commission européenne, conformément au chapitre V du RGPD.
            </p>
          </section>

          {/* 5. Conservation */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              5. Durées de conservation
            </h2>
            <ul className="space-y-2">
              <li>
                <strong className="text-slate-300">Données d&apos;audience (Plausible) :</strong> aucune donnée
                personnelle identifiante n&apos;est stockée. Les statistiques agrégées sont conservées sans limite
                de durée.
              </li>
              <li>
                <strong className="text-slate-300">Demandes de contact et d&apos;inscription :</strong> 3 ans à
                compter de la date de la demande, puis suppression.
              </li>
              <li>
                <strong className="text-slate-300">Logs techniques serveur :</strong> 12 mois maximum
                (obligation de sécurité).
              </li>
            </ul>
          </section>

          {/* 6. Droits */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              6. Vos droits
            </h2>
            <p>
              Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants sur les données
              vous concernant :
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li><strong className="text-slate-300">Droit d&apos;accès</strong> : obtenir la confirmation que des données vous concernant sont traitées et en recevoir une copie.</li>
              <li><strong className="text-slate-300">Droit de rectification</strong> : corriger des données inexactes ou incomplètes.</li>
              <li><strong className="text-slate-300">Droit à l&apos;effacement</strong> : obtenir la suppression de vos données (sous réserve des obligations légales de conservation).</li>
              <li><strong className="text-slate-300">Droit à la limitation</strong> : demander la suspension temporaire du traitement.</li>
              <li><strong className="text-slate-300">Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible par machine.</li>
              <li><strong className="text-slate-300">Droit d&apos;opposition</strong> : vous opposer à un traitement fondé sur l&apos;intérêt légitime.</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, adressez votre demande par email à :{' '}
              <a href="mailto:bonjour@souqly.fr" className="text-indigo-400 hover:underline">
                bonjour@souqly.fr
              </a>.{' '}
              Souqly s&apos;engage à répondre dans un délai d&apos;un mois à compter de la réception de votre demande
              (article 12 RGPD).
            </p>
            <p className="mt-3">
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
              auprès de la Commission Nationale de l&apos;Informatique et des Libertés (CNIL) :{' '}
              <a
                href="https://www.cnil.fr/fr/plaintes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                cnil.fr/fr/plaintes
              </a>
            </p>
          </section>

          {/* 7. Sécurité */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              7. Sécurité des données
            </h2>
            <p>
              Souqly met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos
              données contre toute perte, destruction, altération, accès ou divulgation non autorisés,
              conformément à l&apos;article 32 du RGPD. Ces mesures comprennent notamment : chiffrement des
              communications (HTTPS/TLS), cookies httpOnly et Secure, contrôle d&apos;accès aux données, et
              sélection rigoureuse des sous-traitants.
            </p>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              8. Cookies
            </h2>
            <p>
              Pour toute information relative aux cookies déposés sur le site souqly.fr, consultez notre{' '}
              <Link href="/legal/cookies" className="text-indigo-400 hover:underline">
                politique de cookies
              </Link>.
            </p>
          </section>

          {/* 9. Modification */}
          <section>
            <h2 className="font-heading mb-4 text-xl font-semibold text-white">
              9. Modification de la politique
            </h2>
            <p>
              Souqly se réserve le droit de modifier la présente politique de confidentialité à tout moment.
              Toute modification sera publiée sur cette page avec une date de mise à jour. En cas de
              modification substantielle, une information sera communiquée aux personnes concernées par les
              moyens appropriés.
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

// Server Component
import { Check, X, Minus } from 'lucide-react';

type CellValue = true | false | 'partial' | string;

interface ComparisonRow {
  feature: string;
  souqly: CellValue;
  shopify: CellValue;
  instagram: CellValue;
  yupoo: CellValue;
}

const ROWS: ComparisonRow[] = [
  {
    feature: 'Prix mensuel',
    souqly: '29 €',
    shopify: 'dès 36 €',
    instagram: 'Gratuit',
    yupoo: 'Gratuit*',
  },
  {
    feature: 'Commission / vente',
    souqly: '0 %',
    shopify: '0,5–2 %',
    instagram: '0 %',
    yupoo: '0 %',
  },
  {
    feature: 'Code d\'accès privé',
    souqly: true,
    shopify: false,
    instagram: false,
    yupoo: false,
  },
  {
    feature: 'Panier WhatsApp natif',
    souqly: true,
    shopify: false,
    instagram: false,
    yupoo: false,
  },
  {
    feature: 'Support en français',
    souqly: true,
    shopify: 'partial',
    instagram: false,
    yupoo: false,
  },
  {
    feature: 'Prêt en moins d\'une heure',
    souqly: true,
    shopify: false,
    instagram: true,
    yupoo: 'partial',
  },
  {
    feature: 'Interface en français',
    souqly: true,
    shopify: 'partial',
    instagram: true,
    yupoo: false,
  },
  {
    feature: 'Commande structurée automatique',
    souqly: true,
    shopify: false,
    instagram: false,
    yupoo: false,
  },
] as const;

const COLUMNS = [
  { key: 'souqly' as const, label: 'Souqly', highlight: true },
  { key: 'shopify' as const, label: 'Shopify', highlight: false },
  { key: 'instagram' as const, label: 'Instagram', highlight: false },
  { key: 'yupoo' as const, label: 'Yupoo', highlight: false },
];

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <span className="flex justify-center" aria-label="Oui">
        <Check className="h-5 w-5 text-emerald-400" aria-hidden="true" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="flex justify-center" aria-label="Non">
        <X className="h-5 w-5 text-slate-600" aria-hidden="true" />
      </span>
    );
  }
  if (value === 'partial') {
    return (
      <span className="flex justify-center" aria-label="Partiel">
        <Minus className="h-5 w-5 text-amber-400" aria-hidden="true" />
      </span>
    );
  }
  return <span className="text-sm font-medium text-white">{value}</span>;
}

export default function Comparison() {
  return (
    <section className="bg-slate-950 py-20 sm:py-28" id="comparatif">
      <div className="mx-auto max-w-5xl px-5">
        {/* En-tête de section */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Comparatif
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
            Pourquoi pas un site e-commerce&nbsp;?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Shopify coûte cher. Instagram ne suffit pas. Yupoo n&apos;est pas fiable.
            Il y a une troisième voie : un catalogue professionnel conçu pour la vente via messagerie.
          </p>
        </div>

        {/* Tableau comparatif */}
        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm" role="table">
            <caption className="sr-only">
              Comparaison Souqly, Shopify, Instagram et Yupoo selon 8 critères
            </caption>
            <thead>
              <tr>
                {/* Colonne critère */}
                <th
                  scope="col"
                  className="pb-5 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Critère
                </th>

                {COLUMNS.map((col) =>
                  col.highlight ? (
                    <th
                      key={col.key}
                      scope="col"
                      className="relative rounded-t-xl bg-slate-800/60 px-6 pb-5 pt-8 text-center ring-2 ring-inset ring-indigo-500"
                    >
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white shadow">
                        Recommandé
                      </span>
                      <span className="font-heading text-base font-bold text-indigo-300">
                        {col.label}
                      </span>
                    </th>
                  ) : (
                    <th
                      key={col.key}
                      scope="col"
                      className="px-6 pb-5 pt-5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {col.label}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                  <td className="py-3.5 pr-6 text-left text-slate-300">{row.feature}</td>

                  {COLUMNS.map((col) =>
                    col.highlight ? (
                      <td
                        key={col.key}
                        className="bg-slate-800/60 px-6 py-3.5 text-center ring-2 ring-inset ring-indigo-500"
                      >
                        <Cell value={row[col.key]} />
                      </td>
                    ) : (
                      <td key={col.key} className="px-6 py-3.5 text-center">
                        <Cell value={row[col.key]} />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 text-xs text-slate-600">
            * Yupoo gratuit avec limitations importantes, interface en anglais, absence de support
            francophone, liens sujets à expiration.
          </p>
        </div>
      </div>
    </section>
  );
}

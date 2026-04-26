import Link from "next/link";
import {
  ArrowRight,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Store,
} from "lucide-react";

const previewProducts = [
  ["Sneakers", "REF-001", "89 EUR", "bg-amber-300"],
  ["Sac city", "REF-042", "65 EUR", "bg-sky-300"],
  ["Veste", "REF-118", "120 EUR", "bg-rose-300"],
  ["Casquette", "REF-211", "29 EUR", "bg-emerald-300"],
  ["Montre", "REF-310", "75 EUR", "bg-violet-300"],
  ["Polo", "REF-404", "39 EUR", "bg-orange-300"],
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="min-h-[88vh] border-b border-white/10">
        <div className="mx-auto grid min-h-[88vh] max-w-6xl grid-cols-1 items-center gap-10 px-5 py-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Onboarding marchand sur validation
            </div>

            <div className="space-y-5">
              <h1 className="font-[family-name:var(--font-bricolage)] text-5xl font-bold leading-tight text-white sm:text-6xl">
                Souqly
              </h1>
              <p className="max-w-xl text-lg leading-8 text-neutral-300">
                La plateforme catalogue privée pour marchands indépendants :
                accès par code, panier local, commande directe via WhatsApp ou
                Telegram.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inscription"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-100"
              >
                Demander un accès
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Connexion marchand
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-white/10 bg-neutral-900 p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-semibold text-white">boutique-paris</p>
                  <p className="text-xs text-neutral-500">Catalogue protégé</p>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-2 text-xs text-neutral-300">
                  <LockKeyhole className="h-3.5 w-3.5 text-amber-300" />
                  Code requis
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previewProducts.map(([name, ref, price, color]) => (
                  <div
                    key={ref}
                    className="rounded-md border border-white/10 bg-neutral-950 p-2"
                  >
                    <div className={`mb-3 aspect-square rounded ${color}`} />
                    <p className="truncate text-sm font-medium text-white">{name}</p>
                    <p className="text-xs font-mono text-neutral-500">{ref}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-md bg-neutral-800 p-3 text-sm text-neutral-300">
                  <Store className="h-4 w-4 text-sky-300" />
                  Catalogue
                </div>
                <div className="flex items-center gap-2 rounded-md bg-neutral-800 p-3 text-sm text-neutral-300">
                  <MessageCircle className="h-4 w-4 text-emerald-300" />
                  Commande
                </div>
                <div className="flex items-center gap-2 rounded-md bg-neutral-800 p-3 text-sm text-neutral-300">
                  <ShieldCheck className="h-4 w-4 text-amber-300" />
                  Accès privé
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

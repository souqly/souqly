// Server Component — skeleton affiché pendant le chargement du catalogue

export default function CatalogueLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white" aria-hidden="true">

      {/* Header placeholder */}
      <div className="h-14 bg-neutral-900 border-b border-white/10 animate-pulse" />

      {/* Hero placeholder */}
      <div className="h-32 bg-neutral-900 border-b border-white/5 animate-pulse" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* Pills catégories */}
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-20 shrink-0 rounded-full bg-neutral-800 animate-pulse"
            />
          ))}
        </div>

        {/* Grille produits — 8 cartes portrait */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-neutral-900 rounded-xl animate-pulse border border-white/5"
            />
          ))}
        </div>

      </div>
    </div>
  )
}

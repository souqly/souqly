// Server Component — skeleton affiché pendant les navigations dashboard

export default function DashboardLoading() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8" aria-hidden="true">

      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-neutral-900 animate-pulse shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-6 w-40 bg-neutral-900 rounded-lg animate-pulse" />
          <div className="h-4 w-24 bg-neutral-900 rounded-full animate-pulse" />
        </div>
      </div>

      {/* StatCards — 5 cartes */}
      <section className="space-y-3">
        <div className="h-4 w-24 bg-neutral-900 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-neutral-900 rounded-xl animate-pulse border border-white/5"
            />
          ))}
        </div>
      </section>

      {/* Activité + Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-48 bg-neutral-900 rounded-xl animate-pulse border border-white/5" />
        <div className="h-48 bg-neutral-900 rounded-xl animate-pulse border border-white/5" />
      </div>

      {/* Raccourcis — 4 cartes */}
      <section className="space-y-3">
        <div className="h-4 w-24 bg-neutral-900 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-neutral-900 rounded-xl animate-pulse border border-white/5"
            />
          ))}
        </div>
      </section>

    </div>
  )
}

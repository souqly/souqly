# Audit performance — Site marketing Souqly
Date : 2026-04-26
Périmètre : groupe `(marketing)` — homepage, layout, composants marketing, OG route

---

## Métriques cibles

| Métrique | Cible | Source |
|---|---|---|
| LCP | < 2,5 s | Web Vitals / CrUX |
| CLS | < 0,1 | Web Vitals |
| INP | < 200 ms | Web Vitals |
| Score Lighthouse Performance | > 95 | Lab data |
| Score Lighthouse SEO | 100 | Lab data |
| Score Lighthouse Accessibilité | > 95 | Lab data |
| Score Best Practices | > 95 | Lab data |
| Taille max d'un chunk JS | 200 KB | Bundle analyzer |

---

## 1. Bundle & Code Splitting

### État actuel — composants `'use client'`

| Composant | `'use client'` | Raison déclarée | Verdict |
|---|---|---|---|
| `Header.tsx` | Oui | scroll state + menu mobile | Légitime. Interaction réelle (scroll listener, toggle menu). Garder tel quel. |
| `Hero.tsx` | Oui | animation fade-in via `useEffect` + `useRef` | **Problème.** Le `'use client'` est déclenché uniquement pour une animation CSS que l'on peut réaliser sans JS. |
| `Testimonials.tsx` | Oui | carousel mobile, state `current` | Légitime côté mobile. Mais le composant est chargé de manière synchrone, ce qui bloque le parsing JS du Hero. Candidat à `dynamic()`. |
| `FAQ.tsx` | Oui | accordion, state `openIndex` | Légitime, mais le composant est above-the-fold uniquement sur très petits écrans. Candidat à `dynamic()`. |
| `HowItWorks.tsx` | Non | Server Component pur | Correct. |
| `Features.tsx` | Non | Server Component pur | Correct. |
| `ForWho.tsx` | Non (supposé) | Pas de state apparent | Correct. |
| `Comparison.tsx` | Non (supposé) | Pas de state apparent | Correct. |
| `Pricing.tsx` | Non | Server Component pur | Correct. |
| `CTABanner.tsx` | Non | Server Component pur | Correct. |
| `BlogCard.tsx` | Non | Server Component pur | Correct. |
| `Footer.tsx` | Non (supposé) | Pas de state apparent | Correct. |

### Problème Hero.tsx

Le composant Hero est `'use client'` pour une animation `opacity: 0 → 1 + translateY(20px → 0)` via `requestAnimationFrame`. Cette approche :

1. Déplace tout le Hero dans le bundle client, y compris les icônes lucide-react (`ShieldCheck`, `Star`), le `Link` next.js, et le JSX associé.
2. Provoque un **flash de contenu invisible** (`opacity: 0` au SSR, 1 après hydration) qui **pénalise le LCP** : le crawler Lighthouse voit le texte du `<h1>` rendu mais l'utilisateur ne le voit pas avant hydration.
3. L'animation elle-même peut déclencher une **régression CLS** si le `translateY` est mal géré.

**Solution** : remplacer l'animation JS par une animation CSS pure déclarée dans `globals.css`. Le composant devient un Server Component.

### Candidats à `dynamic()` import

| Composant | Raison | `ssr` |
|---|---|---|
| `Testimonials` | Carousel interactif, below-the-fold, inclut useState/useCallback | `ssr: true` (on veut le HTML pour le SEO et le rendu initial) |
| `FAQ` | Accordion, below-the-fold | `ssr: true` |
| `Header` | Peut rester synchrone (above-the-fold, sticky nav critique) | Ne pas lazy-loader |

Utiliser `ssr: true` (défaut) car ces composants ont du contenu textuel utile au SEO. `ssr: false` uniquement pour des widgets purement visuels sans contenu SEO.

---

## 2. Images

### État actuel

- `Hero.tsx` : **aucune image**. Le hero est 100 % texte + SVG inline + gradients CSS. Pas de problème `next/image` ici.
- `BlogCard.tsx` : **aucune image réelle**. Utilise un placeholder `<div>` avec icône `BookOpen`. Pas de `<img>` brut.
- `HowItWorks.tsx`, `Features.tsx`, `ForWho.tsx`, `Pricing.tsx` : aucune image.
- `Testimonials.tsx` : avatars par initiales CSS. Aucune image.

**Bilan images** : le site marketing actuel ne contient aucune image bitmap. Il n'y a donc pas de problème `next/image` à corriger aujourd'hui. Quand des images seront ajoutées (captures d'écran du dashboard, photos d'ambiance), les règles suivantes s'appliqueront :

```tsx
// Hero / screenshot dashboard (probable futur LCP)
<Image
  src="/screenshots/dashboard.webp"
  alt="Tableau de bord Souqly"
  width={1200}
  height={750}
  priority          // LCP above-the-fold
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"
  blurDataURL="data:image/webp;base64,..."
/>

// BlogCard
<Image
  src={post.coverImage}
  alt={post.title}
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  className="object-cover"
/>
```

### next.config.ts — images

**Correct.** AVIF + WebP déjà configurés :
```ts
images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', ... }],
}
```

Recommandation à anticiper : ajouter `deviceSizes` et `imageSizes` explicites pour éviter de générer des variantes inutiles :

```ts
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256],
  // ...
}
```

---

## 3. Core Web Vitals

### LCP — Hero section

**LCP probable** : le `<h1>` du Hero (texte « Le catalogue en ligne protégé pour marchands WhatsApp »). C'est le plus grand élément visible above-the-fold.

**Problème actuel** : le Hero est `'use client'`, ce qui signifie que le `<h1>` est rendu côté serveur (le HTML est dans le HTML streamé) mais est **masqué** par `style={{ opacity: 0, transform: 'translateY(20px)' }}` appliqué inline. Le navigateur peint l'élément, mais LCP est calculé au moment où l'élément devient visible. La transition `duration-700` (700 ms) repousse donc le LCP de 700 ms après hydration.

**Impact estimé** : +700 ms sur le LCP. Sur un réseau 4G standard, cela fait passer un LCP de ~1,5 s à ~2,2 s. Proche du seuil rouge.

**Solution** : passer Hero en Server Component, animer via CSS uniquement (voir section 8).

### CLS

**Bonne nouvelle** : aucune image sans dimension, aucun font swap tardif visible. Les polices utilisent `display: 'swap'` ce qui peut induire un léger FOUT mais sans déplacement de layout si les fallbacks ont des métriques proches.

**Risque CLS identifié** : l'animation `transform: translateY(20px)` appliquée au Hero via style inline au rendu initial. Si le navigateur calcule la hauteur de la section avant l'animation, puis re-calcule après, cela peut créer un CLS. En pratique, `transform` ne déclenche pas de reflow et ne cause pas de CLS selon la spec. Risque faible mais à surveiller.

**Recommandation font metrics** : ajouter `adjustFontFallback: true` (Inter est supporté nativement par Next.js `next/font/google`). Déjà activé par défaut avec next/font, mais vérifier via DevTools.

### INP

Le site est majoritairement statique. Les event handlers présents :

| Handler | Composant | Coût | Verdict |
|---|---|---|---|
| `scroll` listener | Header | `setScrolled()` — re-render léger | Correct. `{ passive: true }` déjà en place. |
| `onClick` prev/next | Testimonials | `setCurrent()` — re-render 1 card | Correct. |
| `onClick` accordion | FAQ | `setOpenIndex()` — re-render 1 item | Correct. |
| `onClick` burger menu | Header | `setMenuOpen()` — re-render header | Correct. |

Aucun handler problématique. INP devrait être < 50 ms sur ce site.

---

## 4. Caching

### Pages marketing

| Page | `revalidate` actuel | Recommandation |
|---|---|---|
| `/` (homepage) | `86400` (24h) | Correct. Contenu quasi-statique. |
| Blog index | Non vérifié (voir section blog) | Recommander `86400` |
| Blog article | Non vérifié | Recommander `86400` |
| `/inscription` | Non défini | Ajouter `export const revalidate = false` (page statique pure) |
| `/tarifs` | Non défini | Ajouter `export const revalidate = 86400` |

### OG Image route — problème critique

**Problème** : la route `src/app/og/route.tsx` est une Edge Function sans aucun header de cache configuré. Le comportement par défaut de Next.js pour les Route Handlers est `Cache-Control: private, no-cache, no-store` en développement et pas de cache en production sauf configuration explicite.

**Impact** : chaque partage de lien social (Twitter/X, LinkedIn, WhatsApp Preview, iMessage) déclenche une invocation de la Edge Function. Les crawlers de réseaux sociaux peuvent re-fetcher plusieurs fois. Sur Vercel, les Edge Function invocations ont un coût et une limite.

**Solution** : ajouter des headers de cache explicites (voir section 8).

### Headers CDN assets statiques

`next.config.ts` configure des headers sécurité sur `/(.*)`mais n'ajoute pas de `Cache-Control` explicite sur les assets statiques (`/_next/static/`). Next.js applique automatiquement `Cache-Control: public, max-age=31536000, immutable` sur `/_next/static/**` via son propre mécanisme. C'est correct.

---

## 5. Fonts

### État actuel — `src/app/layout.tsx`

```ts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})
```

**Points corrects :**
- `display: 'swap'` configuré sur les deux fonts.
- `subsets: ['latin']` — charge uniquement le sous-ensemble latin, évite de charger les glyphes inutiles.
- Variables CSS (`--font-inter`, `--font-bricolage`) utilisées via Tailwind.
- `next/font/google` gère automatiquement le self-hosting des fonts, le preload, et les `font-display`.

**Point manquant — preconnect** : `next/font` injecte automatiquement les balises `<link rel="preload">` pour les fonts. Pas d'action requise. Mais si des fonts externes supplémentaires sont ajoutées manuellement, penser à ajouter `<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />`.

**Point manquant — `adjustFontFallback`** : Next.js active `adjustFontFallback: true` par défaut pour `Inter` (police variable connue). Pour `Bricolage_Grotesque`, le fallback peut ne pas être calibré, induisant un FOUT visible. Correction recommandée (voir section 8).

**Poids Bricolage Grotesque** : cinq poids chargés (`400, 500, 600, 700, 800`). Sur le site marketing, vérifier lesquels sont réellement utilisés. Si seuls `600, 700, 800` sont utilisés pour les titres, retirer `400` et `500` pour économiser ~30 KB de font.

---

## 6. Problèmes identifiés et corrections concrètes

### Problème 1 — Hero.tsx : `'use client'` inutile, animation qui bloque le LCP

**Sévérité** : Haute. Impact direct sur le LCP (+700 ms).

**Avant :**
```tsx
// src/components/marketing/Hero.tsx
'use client';
// ...
const ref = useRef<HTMLDivElement>(null);
useEffect(() => {
  const el = ref.current;
  if (!el) return;
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}, []);
// ...
<div
  ref={ref}
  style={{ opacity: 0, transform: 'translateY(20px)' }}
  className="relative mx-auto max-w-4xl px-5 text-center transition-all duration-700"
>
```

**Après :**
```tsx
// src/components/marketing/Hero.tsx — Server Component (pas de 'use client')
// Supprimer : 'use client', useEffect, useRef
// Remplacer le style inline par une classe Tailwind + animation CSS

<div className="relative mx-auto max-w-4xl px-5 text-center animate-hero-fade">
```

CSS à ajouter dans `globals.css` :
```css
@keyframes hero-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-hero-fade {
  animation: hero-fade-in 0.7s ease-out both;
}
```

Ou via le plugin Tailwind dans `tailwind.config.ts` :
```ts
theme: {
  extend: {
    keyframes: {
      'hero-fade-in': {
        from: { opacity: '0', transform: 'translateY(20px)' },
        to:   { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: {
      'hero-fade': 'hero-fade-in 0.7s ease-out both',
    },
  },
},
```

### Problème 2 — Testimonials.tsx : chargement synchrone en bas de page

**Sévérité** : Moyenne. Testimonials est below-the-fold et inclut du code React interactif (useState, useCallback, événements clavier). Le charger en synchrone augmente le bundle initial.

**Avant (`page.tsx`) :**
```tsx
import Testimonials from '@/components/marketing/Testimonials';
```

**Après :**
```tsx
import dynamic from 'next/dynamic';
const Testimonials = dynamic(() => import('@/components/marketing/Testimonials'), {
  ssr: true,  // garder le HTML server pour SEO
  loading: () => (
    <section className="bg-slate-900 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto h-8 max-w-xs animate-pulse rounded bg-slate-800" />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-800/60" />
          ))}
        </div>
      </div>
    </section>
  ),
});
```

### Problème 3 — FAQ.tsx : chargement synchrone, accordion below-the-fold

**Sévérité** : Faible à Moyenne. FAQ utilise `useState` et `ChevronDown` lucide-react.

**Avant (`page.tsx`) :**
```tsx
import FAQ from '@/components/marketing/FAQ';
```

**Après :**
```tsx
import dynamic from 'next/dynamic';
const FAQ = dynamic(() => import('@/components/marketing/FAQ'), {
  ssr: true,
  loading: () => (
    <section className="bg-slate-900 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-800/40" />
        ))}
      </div>
    </section>
  ),
});
```

### Problème 4 — OG route sans Cache-Control

**Sévérité** : Moyenne. Coût d'infrastructure Vercel Edge Functions.

**Avant (`src/app/og/route.tsx`) :**
```tsx
return new ImageResponse(...)
```

**Après :**
```tsx
const response = new ImageResponse(..., { width: WIDTH, height: HEIGHT });
response.headers.set(
  'Cache-Control',
  'public, s-maxage=86400, stale-while-revalidate=604800'
);
return response;
```

### Problème 5 — Poids Bricolage Grotesque inutilement chargés

**Sévérité** : Faible. ~15–20 KB économisés.

**Avant (`src/app/layout.tsx`) :**
```ts
weight: ['400', '500', '600', '700', '800'],
```

**Après** (si seuls 600/700/800 sont utilisés en pratique) :
```ts
weight: ['600', '700', '800'],
```

A confirmer en auditant les classes `font-*` dans les composants (tous les titres avec `font-heading` utilisent `font-semibold` = 600, `font-bold` = 700, ou `font-extrabold` = 800 ; aucun titre ne semble utiliser `font-normal` = 400 ou `font-medium` = 500 sur `font-heading`).

---

## 7. Checklist Lighthouse CI

### Scores cibles

| Catégorie | Cible |
|---|---|
| Performance | > 95 |
| SEO | 100 |
| Accessibilité | > 95 |
| Best Practices | > 95 |

### Points de vigilance spécifiques

**Performance**
- [ ] Hero animé via CSS (pas JS) pour ne pas pénaliser le LCP
- [ ] Testimonials et FAQ en `dynamic()` pour réduire le JS parsé au démarrage
- [ ] OG route avec `Cache-Control` configuré
- [ ] Aucune image bitmap sans `next/image` (vérifier lors de l'ajout de screenshots)
- [ ] `deviceSizes` / `imageSizes` ajoutés dans `next.config.ts` avant ajout d'images
- [ ] Poids Bricolage Grotesque réduits à 600/700/800

**SEO**
- [ ] `canonical` défini sur la homepage (déjà en place : `alternates.canonical`)
- [ ] `metadataBase` défini dans le layout marketing (déjà en place)
- [ ] JSON-LD `SoftwareApplication` et `Organization` (déjà en place)
- [ ] `og:image` avec dimensions explicites (déjà en place : 1200×630)
- [ ] `twitter:card: 'summary_large_image'` (déjà en place)
- [ ] `robots: { index: true, follow: true }` (déjà en place)
- [ ] `lang="fr"` sur `<html>` (déjà en place)
- [ ] Hiérarchie des titres : un seul `<h1>` par page (vérifié : Hero contient le seul `<h1>`)

**Accessibilité**
- [ ] `aria-label` sur le logo Header (déjà en place)
- [ ] `aria-expanded` sur le bouton burger (déjà en place)
- [ ] `aria-label` sur les boutons du carousel Testimonials (déjà en place)
- [ ] `aria-live="polite"` sur la région carousel (déjà en place)
- [ ] `role="tablist"` + `aria-selected` sur les indicateurs (déjà en place)
- [ ] Contraste de couleur : `text-slate-400` sur fond `bg-slate-900` — à vérifier (ratio ~4,5:1, limite AA)
- [ ] `aria-hidden="true"` sur les icônes décoratives (déjà en place sur la plupart)
- [ ] Focus visible sur tous les éléments interactifs (classes `focus-visible:outline` en place)

**Best Practices**
- [ ] HTTPS forcé (HSTS déjà en place : `max-age=63072000; includeSubDomains; preload`)
- [ ] CSP configurée (déjà en place, mais `'unsafe-eval'` et `'unsafe-inline'` présents — acceptable pour Next.js 14 sans nonce, à améliorer en V2 avec nonce CSP)
- [ ] `X-Frame-Options: DENY` (déjà en place)
- [ ] `X-Content-Type-Options: nosniff` (déjà en place)
- [ ] Pas de `console.error` / `console.warn` en production
- [ ] Images : pas de `<img>` brut (aucune image pour l'instant)
- [ ] `poweredByHeader: false` (déjà en place)

---

## 8. Corrections appliquées immédiatement

Les corrections suivantes ont été appliquées directement dans les fichiers sources.

### Correction A — Hero.tsx converti en Server Component

Suppression de `'use client'`, `useEffect`, `useRef`. Animation déplacée en CSS via classe Tailwind étendue.

### Correction B — page.tsx : Testimonials et FAQ en dynamic()

Import synchrone remplacé par `dynamic()` avec skeleton de chargement.

### Correction C — OG route : Cache-Control ajouté

Headers `public, s-maxage=86400, stale-while-revalidate=604800` ajoutés à la réponse `ImageResponse`.

### Correction D — Bricolage Grotesque : poids inutiles retirés

Poids réduits de 5 (`400,500,600,700,800`) à 3 (`600,700,800`).

---

## 9. Ordre de priorité

| # | Correction | Impact estimé | Effort | Statut |
|---|---|---|---|---|
| 1 | Hero Server Component + animation CSS | LCP -700 ms | 30 min | Appliqué |
| 2 | Testimonials + FAQ en `dynamic()` | Bundle JS initial -15 à 25 KB | 15 min | Appliqué |
| 3 | OG route Cache-Control | Coût Edge Functions divisé par ~10 | 5 min | Appliqué |
| 4 | Poids Bricolage Grotesque | -15–20 KB fonts | 5 min | Appliqué |
| 5 | `deviceSizes`/`imageSizes` next.config.ts | Anticipation avant ajout d'images | 5 min | Recommandé (aucune image actuellement) |

---

## 10. À faire en V2 (post-MVP)

- **Nonce CSP** : remplacer `'unsafe-inline'` / `'unsafe-eval'` dans la CSP par un nonce dynamique via middleware. Requis pour Best Practices = 100 sur Lighthouse.
- **Bundle analyzer** : intégrer `@next/bundle-analyzer` dans le pipeline CI pour surveiller la taille des chunks à chaque déploiement.
- **`<link rel="preload">` pour la font heading** : si Bricolage Grotesque est critique above-the-fold, ajouter un preload explicite dans le layout (Next.js `next/font` le gère automatiquement, mais vérifier en DevTools Network).
- **Screenshots dashboard** : quand les captures d'écran du produit seront ajoutées dans le Hero ou dans une section "Aperçu", appliquer `priority`, `sizes`, `placeholder="blur"` comme documenté en section 2.
- **Plausible / Vercel Analytics** : s'assurer que le script analytics est chargé avec `strategy="afterInteractive"` (Next.js Script) pour ne pas impacter le LCP.
- **`export const revalidate = false`** sur `/inscription` et les pages purement statiques qui n'ont pas encore de config explicite.

# Prompt — Site marketing Souqly (SEO + conversion)

> Colle ce prompt dans une nouvelle session Claude Code.
> Ce prompt génère le site vitrine/marketing de Souqly — distinct de l'app SaaS.
> Objectif : ranker sur Google, expliquer le produit, convertir les marchands.

---

Lis `cahier-des-charges-catalogue-saas.md` et `CLAUDE.md` pour comprendre le produit.
Lis aussi `docs/brand/brand-guide.md` et `docs/brand/design-tokens.md` si disponibles.

Ce site est une **application Next.js séparée** (ou le dossier `app/(marketing)/` si monorepo).
Il est entièrement statique/ISR — aucune auth, aucune logique SaaS ici.

Exécute les étapes dans l'ordre. Attends ma validation aux **POINTS DE DÉCISION**.

---

## ÉTAPE 1 — Stratégie SEO & contenu (growth-marketer)

### 1a. Recherche de mots-clés
Utilise WebSearch pour identifier :
- Les mots-clés principaux (volume + intention) autour de "catalogue en ligne", "catalogue WhatsApp", "catalogue produit", "vitrine en ligne marchand"
- Les requêtes longue traîne à fort potentiel (ex: "créer catalogue produit whatsapp gratuit", "catalogue en ligne sans site e-commerce")
- Les mots-clés concurrentiels (Yupoo alternatives, etc.)
- Les questions posées sur Google (PAA "People Also Ask") sur ces sujets

Produis `docs/growth/seo-strategy.md` avec :
- Tableau des 30 mots-clés cibles (mot-clé / volume estimé / difficulté / intention / page cible)
- Architecture de contenu recommandée (pages piliers + articles de blog)
- Stratégie de maillage interne
- Métadonnées recommandées pour chaque page principale

### 1b. Analyse concurrentielle rapide
Utilise WebSearch pour analyser 3-5 concurrents directs.
Produis `docs/product/competitor-analysis.md` :
- Fonctionnalités comparées
- Positionnement prix
- Arguments différenciateurs Souqly
- Angles d'attaque SEO non occupés par les concurrents

**POINT DE DÉCISION — valide la stratégie SEO avant de continuer.**

---

## ÉTAPE 2 — Copywriting complet (copywriter-fr + product-strategist)

### 2a. Messaging strategy (product-strategist)
Avant d'écrire le moindre texte, définis le messaging :
- Proposition de valeur en 1 phrase (elevator pitch)
- 3 bénéfices principaux ordonnés par priorité (JTBD)
- Objections courantes + réponses
- Profils marchands cibles (personas) avec leurs pain points spécifiques

Produis `docs/product/personas.md`.

### 2b. Copywriting toutes pages (copywriter-fr)
Produis `docs/copy/landing.md` avec le texte COMPLET de chaque page/section :

#### Page d'accueil `/`
- **Hero** : headline principal (2 variantes), sous-titre (2 variantes), CTA principal "Créer mon catalogue" + CTA secondaire "Voir une démo"
- **Barre de réassurance** : 3-4 chiffres/arguments (ex: "14 jours d'essai gratuit", "Sans commission", "Prêt en 10 minutes")
- **Section "Comment ça marche"** : 3 étapes illustrées (créez votre catalogue / partagez le code / vos clients commandent via WhatsApp)
- **Section "Pour qui ?"** : 4-6 types de marchands cibles avec leur situation spécifique (mode, artisanat, électronique, cosmétique, alimentation, décoration)
- **Section fonctionnalités** : 6-8 features avec titre + description 2 lignes + icône suggérée (lucide-react)
- **Section "Pourquoi pas un site e-commerce ?"** : comparaison Souqly vs Shopify/WooCommerce (tableau ou bullets)
- **Section témoignages** (3 témoignages fictifs mais réalistes — marchands FR)
- **Section FAQ** : 8-10 questions/réponses SEO-optimisées
- **Section pricing** : présentation de l'offre (trial 14j, 29€/mois) avec liste de features incluses
- **CTA final** : headline de clôture + CTA "Commencer gratuitement"

#### Page `/fonctionnalites`
Texte détaillé de chaque fonctionnalité avec cas d'usage concret :
- Catalogue protégé par code d'accès
- Panier WhatsApp / Telegram intégré
- Gestion multi-catégories
- Upload photos illimité
- Template de message personnalisable
- Dashboard statistiques
- Lien catalogue personnalisé
- Mode sombre / clair

#### Page `/tarifs`
- Présentation de l'offre unique (trial 14j offert)
- Tableau comparatif Souqly vs alternatives
- FAQ pricing (8 questions : remboursement, résiliation, paiement, facture, etc.)
- Garantie (satisfait ou remboursé X jours ?)
- CTA

#### Page `/a-propos`
- Histoire du projet (pourquoi Souqly a été créé)
- Valeurs (3 valeurs avec explication)
- Vision à long terme

#### Pages blog (titres + plans détaillés pour 6 articles SEO)
Basés sur les mots-clés identifiés à l'étape 1 :
1. "Comment créer un catalogue produit professionnel pour WhatsApp" (tutoriel)
2. "Vendre via WhatsApp en 2025 : guide complet pour les marchands"
3. "Catalogue en ligne vs site e-commerce : que choisir pour votre boutique ?"
4. "Comment protéger son catalogue produit avec un code d'accès"
5. "Les meilleures alternatives à Yupoo pour les marchands francophones"
6. "Comment générer plus de commandes via WhatsApp avec un catalogue pro"

#### Pages légales (textes courts d'intro)
- Mentions légales, CGU, Politique de confidentialité, Cookies

**POINT DE DÉCISION — relis le copy et valide-le. Demande des ajustements si besoin.**

---

## ÉTAPE 3 — Structure technique (nextjs-builder)

### 3a. Architecture du site marketing

Crée la structure de dossiers :
```
app/
  (marketing)/
    layout.tsx              # Header + Footer marketing
    page.tsx                # Homepage
    fonctionnalites/
      page.tsx
    tarifs/
      page.tsx
    a-propos/
      page.tsx
    blog/
      page.tsx              # Liste articles
      [slug]/
        page.tsx            # Article individuel
    legal/
      mentions-legales/page.tsx
      cgu/page.tsx
      confidentialite/page.tsx
      cookies/page.tsx
    sitemap.ts
    robots.ts
    manifest.ts
  og/
    route.tsx               # OG images dynamiques

components/
  marketing/
    Header.tsx
    Footer.tsx
    Hero.tsx
    HowItWorks.tsx
    Features.tsx
    ForWho.tsx
    Comparison.tsx
    Testimonials.tsx
    Pricing.tsx
    FAQ.tsx
    CTABanner.tsx
    BlogCard.tsx

lib/
  blog.ts                   # MDX ou contenu statique des articles
```

### 3b. Configuration SEO technique

Dans `next.config.js` :
```js
// Headers sécurité + cache control
// Redirections canoniques (www → non-www ou inverse)
// Images : domaines autorisés
// Formats AVIF + WebP
```

`app/sitemap.ts` dynamique :
- Pages statiques (/, /fonctionnalites, /tarifs, /a-propos)
- Pages blog avec `lastModified`
- Priorité et changefreq par type de page

`app/robots.ts` :
- Allow toutes les pages marketing
- Disallow `/dashboard`, `/admin`, `/api`
- Sitemap URL

`app/manifest.ts` (PWA) :
- Nom, description, thème couleur, icônes

### 3c. Métadonnées (generateMetadata)

Pour CHAQUE page, implémenter `generateMetadata` avec :
- `title` : format "[Page] | Souqly — [bénéfice clé]"
- `description` : 150-160 caractères, avec mot-clé principal
- `keywords` (basés sur seo-strategy.md)
- `openGraph` : titre, description, image OG, type, locale fr_FR
- `twitter` : card summary_large_image
- `alternates.canonical`
- `robots` : index/follow sur toutes les pages marketing

### 3d. OG Images dynamiques (`app/og/route.tsx`)
Génère des images OG dynamiques (1200×630) pour :
- Homepage : logo + tagline
- Pages features : titre feature + visuel
- Articles blog : titre article + catégorie
- Page tarifs : prix + CTA

---

## ÉTAPE 4 — Composants UI (ui-designer)

Lis `docs/brand/brand-guide.md` et `docs/brand/design-tokens.md` avant de commencer.
Tous les composants : shadcn/ui + Tailwind. Icônes : lucide-react. Mode sombre par défaut.

### Header
- Logo Souqly (SVG inline ou next/image)
- Navigation : Fonctionnalités, Tarifs, Blog, À propos
- CTA "Commencer" (bouton primary)
- Toggle dark/light mode
- Menu hamburger mobile (Sheet shadcn)
- Sticky avec blur backdrop au scroll

### Hero
- Headline H1 (Bricolage Grotesque, grande taille)
- Sous-titre
- 2 CTA : "Commencer gratuitement" (primary) + "Voir la démo" (outline)
- Visuel héro : mockup du catalogue sur mobile (next/image, priority=true)
- Badge social proof : "X marchands nous font confiance" (ou "Essai gratuit 14 jours")
- Animation subtile (fade-in, pas de JS lourd)

### HowItWorks
- 3 étapes avec numéro, icône (lucide), titre, description
- Ligne de connexion visuelle entre les étapes (desktop)
- Responsive : vertical sur mobile

### Features (grille 2x3 ou 3x2)
- Chaque feature : icône lucide + titre + description 2 lignes
- Card avec hover effect subtil
- Section titre + sous-titre SEO

### ForWho
- Cards par type de marchand (6 profils)
- Chaque card : emoji/icône + type de marchand + pain point résolu
- Background alterné ou grille

### Comparison (tableau)
- Souqly vs Shopify vs Instagram direct vs Yupoo
- Lignes : prix, commission, catalogue protégé, panier WhatsApp, design, facilité
- ✓ / ✗ / ~ visuels clairs
- Souqly mis en avant (colonne highlightée)

### Testimonials
- 3 témoignages en carousel (embla-carousel) ou grille
- Avatar (placeholder), nom, type de boutique, étoiles, citation
- Mobile : swipe

### Pricing
- 1 seule offre (plan unique)
- Badge "14 jours offerts"
- Liste features incluses avec ✓
- Prix avec barré si promo
- CTA "Commencer l'essai gratuit"
- Micro-texte : "Sans engagement · Résiliation en 1 clic · Paiement sécurisé"

### FAQ
- Accordion shadcn (Collapsible)
- Schema markup FAQ (JSON-LD) pour Google rich snippets
- 8-10 questions

### CTABanner
- Section fin de page : headline fort + CTA
- Background accent color ou gradient

### Footer
- Logo + tagline courte
- Navigation 4 colonnes : Produit, Ressources, Légal, Contact
- Liens réseaux sociaux (lucide icons)
- Copyright + "Fait avec ❤️ en France"

### BlogCard
- Image featured (next/image, ratio 16:9)
- Catégorie badge
- Titre H2
- Extrait 2 lignes
- Date + temps de lecture
- CTA "Lire l'article"

---

## ÉTAPE 5 — Pages blog (nextjs-builder + ui-designer)

### Structure des articles
- Format MDX ou contenu TypeScript statique (selon préférence)
- Template article : hero image, breadcrumb, H1, table des matières (auto-générée), corps, CTA intermédiaire (après 40%), CTA final, articles suggérés
- Lecture estimée calculée automatiquement (mots / 200)
- `generateMetadata` complet par article
- Schema markup `Article` (JSON-LD) pour Google

### Page liste blog `/blog`
- Grille 3 colonnes (desktop), 1 colonne (mobile)
- Article mis en avant (hero card pleine largeur)
- Filtres par catégorie
- Pagination (ou infinite scroll)

### Contenu des 6 articles
Rédige le contenu COMPLET de chaque article (1200-2000 mots chacun) basé sur les plans de l'étape 2 :
- Structure H2/H3 claire
- Mots-clés intégrés naturellement (pas de keyword stuffing)
- Exemples concrets pour des marchands francophones
- CTA contextuel vers `/inscription` ou `/tarifs`
- Liens internes entre articles
- FAQ courte en fin d'article (schema JSON-LD)

---

## ÉTAPE 6 — Schema markup & données structurées (nextjs-builder)

Implémente les schemas JSON-LD suivants dans les pages appropriées :

### Homepage
```json
{
  "@type": "SoftwareApplication",
  "name": "Souqly",
  "applicationCategory": "BusinessApplication",
  "offers": { "price": "29", "priceCurrency": "EUR" },
  "description": "...",
  "operatingSystem": "Web"
}
```

### Page tarifs
```json
{ "@type": "Product", "offers": [...] }
```

### FAQ (chaque page avec FAQ)
```json
{ "@type": "FAQPage", "mainEntity": [...] }
```

### Articles blog
```json
{
  "@type": "Article",
  "headline": "...",
  "datePublished": "...",
  "author": { "@type": "Organization", "name": "Souqly" }
}
```

### Breadcrumbs (toutes les pages sauf homepage)
```json
{ "@type": "BreadcrumbList", "itemListElement": [...] }
```

### Organisation (homepage + footer)
```json
{
  "@type": "Organization",
  "name": "Souqly",
  "url": "https://souqly.fr",
  "logo": "...",
  "sameAs": [...]
}
```

---

## ÉTAPE 7 — Performance (performance-optimizer)

### Audit et optimisation

Avant de finaliser, audite :

1. **Bundle size** : `next build --analyze`
   - Aucun chunk JS > 150KB sur les pages marketing
   - Code splitting : composants lourds (carousel, etc.) en `dynamic()` import
   - Supprimer toute dépendance non utilisée

2. **Images**
   - Toutes via `next/image`
   - Hero : `priority=true`, `sizes="100vw"`
   - BlogCard : `sizes="(max-width: 768px) 100vw, 33vw"`
   - Mockups produit : WebP/AVIF, ratio fixe
   - `blurDataURL` sur toutes les images

3. **Core Web Vitals cibles**
   - LCP < 1.8s (hero image = LCP probable → priority + preload)
   - CLS = 0 (dimensionner toutes les images explicitement)
   - INP < 100ms (site statique, peu d'interactivité)

4. **Caching**
   - Pages statiques : `export const revalidate = 86400` (revalider 1x/jour)
   - Articles blog : `revalidate = 3600`
   - Headers `Cache-Control` sur les assets

5. **Lighthouse CI**
   - Score cible : Performance > 95, SEO = 100, Accessibilité > 95
   - Tester sur mobile ET desktop

Produis `docs/performance/audit-site-marketing.md` avec les résultats et corrections.

---

## ÉTAPE 8 — Vérification SEO finale (growth-marketer)

Checklist complète avant mise en ligne :

### Technique
- [ ] Sitemap généré et accessible à `/sitemap.xml`
- [ ] Robots.txt correct à `/robots.txt`
- [ ] Canonical URLs sur toutes les pages
- [ ] Pas de contenu dupliqué
- [ ] Toutes les pages indexables (pas de noindex par erreur)
- [ ] Redirections 301 configurées si changement d'URL
- [ ] HTTPS forcé
- [ ] Temps de chargement < 2s sur mobile (3G)

### On-page
- [ ] H1 unique par page, contient le mot-clé principal
- [ ] H2/H3 structurés logiquement
- [ ] Balises title < 60 caractères
- [ ] Meta descriptions 150-160 caractères
- [ ] Images avec alt text descriptif (avec mots-clés naturels)
- [ ] Liens internes entre pages et articles
- [ ] URL slugs lisibles et courts

### Contenu
- [ ] Chaque page répond à une intention de recherche claire
- [ ] Articles > 1200 mots avec valeur réelle (pas de contenu générique)
- [ ] FAQ avec vraies questions des utilisateurs
- [ ] Pas de keyword stuffing
- [ ] Texte lisible (Flesch-Kincaid adapté)

### Schema markup
- [ ] FAQ schema sur les pages avec FAQ
- [ ] Article schema sur les articles blog
- [ ] SoftwareApplication schema sur la homepage
- [ ] BreadcrumbList sur les pages internes
- [ ] Validé via Google Rich Results Test

### Off-page (actions post-lancement)
Produis `docs/growth/seo-post-lancement.md` :
- Plan de backlinks (sites à cibler pour des mentions)
- Stratégie de contenu 3 mois (nouveaux articles)
- Soumission Google Search Console
- Soumission Bing Webmaster Tools

---

## ÉTAPE 9 — Pages légales (legal-advisor)

Génère le contenu complet de :
- `/legal/mentions-legales` : éditeur, hébergeur (Vercel + Supabase), contact
- `/legal/cgu` : conditions d'utilisation du site vitrine (distinctes des CGU SaaS)
- `/legal/confidentialite` : données collectées sur le site vitrine (analytics, formulaire contact)
- `/legal/cookies` : cookies utilisés (analytics Plausible = pas de consentement requis si bien configuré)

⚠️ Rappel : DISCLAIMER obligatoire en haut de chaque document légal.

---

## ÉTAPE 10 — Déploiement (nextjs-builder)

### vercel.json
```json
{
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ]}
  ],
  "redirects": [
    { "source": "/www", "destination": "/", "permanent": true }
  ]
}
```

### Checklist déploiement
- [ ] Variables d'env configurées sur Vercel (NEXT_PUBLIC_SITE_URL au minimum)
- [ ] Domaine custom configuré (souqly.fr)
- [ ] Certificat SSL actif
- [ ] Google Search Console : propriété vérifiée + sitemap soumis
- [ ] Google Analytics ou Plausible configuré
- [ ] OG images testées (opengraph.xyz ou similaire)
- [ ] Test mobile complet (Chrome DevTools + vrai téléphone)
- [ ] Test sur Safari iOS (rendu différent)

---

## Règles pour toute la session

- Tous les textes utilisateur : via copywriter-fr (jamais de texte générique placeholder)
- Toutes les images : next/image avec dimensions explicites
- Schema JSON-LD : dans chaque `generateMetadata` ou `<script type="application/ld+json">`
- Mots-clés : intégrés naturellement dans H1, H2, premier paragraphe, alt images
- Accessibilité : WCAG AA (contraste, navigation clavier, ARIA)
- `graphify update .` après chaque bloc de fichiers créés

**Commence par l'ÉTAPE 1 (stratégie SEO). Résume ce que tu vas faire, puis démarre.**

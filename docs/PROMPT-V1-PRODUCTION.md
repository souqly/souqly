# Prompt — Build Souqly V1 de zéro à production

> Colle ce prompt dans une nouvelle session Claude Code à la racine du projet.
> Claude orchestrera les agents automatiquement. Tu n'as qu'à valider les points de décision.

---

Lis `cahier-des-charges-catalogue-saas.md` et `CLAUDE.md` pour comprendre le projet.
Puis exécute les 8 phases ci-dessous dans l'ordre. **Ne passe pas à la phase suivante avant que la précédente soit terminée et validée.**

À chaque fin de phase : résume ce qui a été créé + liste les fichiers modifiés + demande confirmation avant de continuer.

---

## PHASE 1 — Fondations projet

### 1a. Setup initial (nextjs-builder)
Initialise le projet Next.js 14 avec :
- TypeScript strict (`strict: true` dans tsconfig)
- Tailwind CSS + shadcn/ui (theme `dark` par défaut, next-themes pour le toggle)
- next/font : Inter (variable `--font-inter`) + Bricolage Grotesque (variable `--font-heading`)
- lucide-react
- Structure de dossiers : `app/`, `components/`, `lib/supabase/`, `lib/stripe/`, `lib/resend/`, `types/`, `hooks/`, `utils/`
- `.env.local.example` avec toutes les variables du cahier des charges section 10
- `next.config.js` avec headers sécurité (CSP, X-Frame-Options, X-Content-Type-Options) + formats images AVIF/WebP

### 1b. Setup Supabase (supabase-expert)
- Initialise Supabase CLI (`supabase init`)
- Crée les deux clients : `lib/supabase/server.ts` (SSR) et `lib/supabase/client.ts` (browser)
- Crée toutes les migrations SQL dans `supabase/migrations/` :
  - Tables : `merchants`, `categories`, `products`, `product_images`, `access_sessions`, `merchant_applications`, `catalog_visits`, `cart_submissions`
  - Extensions : `pgcrypto` (bcrypt), `uuid-ossp`
  - RLS activé + policies complètes sur chaque table (voir cahier des charges section 4)
  - Index : `merchants.slug`, `products.merchant_id`, `products.category_id`, `access_sessions.session_token`
  - 4 fonctions RPC : `unlock_catalog`, `get_catalog`, `submit_merchant_application`, `approve_merchant`
  - Bucket Storage `product-images` (privé)
- Seed `supabase/seed.sql` : 1 super-admin, 1 marchand actif "test-marchand", 3 catégories, 10 produits avec images placeholder

### 1c. Design tokens (brand-designer)
Génère `docs/brand/design-tokens.md` avec 3 directions de palette.
**POINT DE DÉCISION — attends ma réponse avant de continuer.**
Une fois la direction choisie, applique les tokens dans `tailwind.config.ts`.

---

## PHASE 2 — Auth & Inscription

### (nextjs-builder + ui-designer + copywriter-fr)

- `middleware.ts` : protection `/dashboard/*` (auth + merchant.status = 'active') et `/admin/*` (is_super_admin)
- Pages auth : `/login`, `/forgot-password`, `/reset-password`
- Page `/inscription` : formulaire (email, nom commerce, téléphone, description), honeypot anti-spam, rate limiting
- Page `/inscription/confirmation` : message d'attente
- RPC `submit_merchant_application` appelée via Server Action avec validation Zod
- Email admin notif (Resend) + email confirmation marchand
- Tous les textes via copywriter-fr : labels, erreurs, messages de succès, emails

---

## PHASE 3 — Espace super-admin

### (nextjs-builder + ui-designer + supabase-expert)

- Layout `/admin` avec sidebar (Applications, Marchands, Abonnements)
- `/admin/applications` : liste des demandes en attente, boutons Approuver/Rejeter
  - Approbation → RPC `approve_merchant` → crée user Supabase Auth + merchant + email d'activation (Resend)
  - Rejet → email de refus
- `/admin/marchands` : liste tous les marchands (filtres : statut), actions Suspendre/Réactiver
- `/admin/marchands/[id]` : détail + historique + actions admin
- `/admin/abonnements` : vue Stripe (MRR, marchands actifs, churn) — appels Stripe API côté serveur

---

## PHASE 4 — Dashboard marchand

### (nextjs-builder + ui-designer + supabase-expert)

- Layout `/dashboard` avec sidebar responsive (mobile : Sheet, desktop : sidebar fixe)
- `/dashboard` : stats rapides (nb produits, nb visites 30j, nb paniers 30j), statut abonnement, checklist onboarding
- `/dashboard/categories` :
  - Liste avec réorganisation drag & drop (`@dnd-kit/core`)
  - CRUD complet (nom, slug auto-généré, image de couverture)
- `/dashboard/produits` :
  - Liste avec recherche, tri, filtre catégorie, actions en masse
  - Édition inline du prix
- `/dashboard/produits/nouveau` et `/dashboard/produits/[id]` :
  - Formulaire complet (nom, description, référence, prix, catégorie, disponibilité)
  - Upload multiple images : drag & drop, compression côté client (browser-image-compression, cible 200KB), upload Supabase Storage, réorganisation drag & drop
  - Image principale = première de la liste
- `/dashboard/parametres` :
  - Code d'accès (input + bouton régénérer/invalider toutes les sessions)
  - Contacts WhatsApp (format E.164) + Telegram (username)
  - Template de message (éditeur avec aperçu des placeholders {{products}}, {{total}}, {{client_name}})
  - Slug (modifiable, unicité vérifiée)
- `/dashboard/stats` :
  - Graphiques visites/jour et paniers/jour sur 30 jours (Recharts ou similar)
  - Taux de conversion (visiteurs → paniers)

---

## PHASE 5 — Catalogue public

### (nextjs-builder + ui-designer + performance-optimizer)

- `/[slug]` :
  - Si marchand suspendu/inexistant : page d'erreur claire
  - Si actif : page avec logo marchand, nom, champ code d'accès
  - Server Action `unlockCatalog(slug, code)` → RPC → cookie httpOnly
  - Rate limiting : max 10 tentatives / 15 min / IP (Upstash Redis ou middleware custom)
- `/[slug]/catalogue` :
  - `generateStaticParams()` pour les slugs actifs, `revalidate: 3600`
  - Vérification cookie session (middleware ou layout Server Component)
  - Grille catégories (image + nom + nb produits)
  - Recherche globale (par nom + référence) — TanStack Query côté client
  - Filtres (catégorie, prix, disponibilité)
  - Log `catalog_visits` à l'accès
- `/[slug]/categorie/[cat-slug]` : grille produits, lazy loading images
- `/[slug]/produit/[id]` :
  - Galerie images (swipe mobile via `embla-carousel`, lightbox desktop)
  - Sélecteur quantité
  - Bouton "Ajouter au panier"
  - Preload image suivante

Performance (performance-optimizer) : valide les tags de cache, les `generateStaticParams`, les `sizes` d'images et la stratégie ISR sur ces routes avant de passer à la suite.

---

## PHASE 6 — Panier & commande

### (nextjs-builder + ui-designer + copywriter-fr)

- State panier : Zustand store persisté en localStorage (clé `cart_[merchant_slug]`), debounce writes 300ms
- `/[slug]/panier` :
  - Liste produits (image, nom, réf, quantité modifiable, sous-total)
  - Total général
  - Champ "Votre nom" (optionnel)
  - Champ "Remarque" (optionnel)
  - Boutons "Commander via WhatsApp" et "Commander via Telegram" (affichés selon config marchand)
  - Génération du message avec template marchand (fallback template par défaut)
  - Avant redirection : insertion `cart_submissions` + log analytics
  - URL WhatsApp : `https://wa.me/{number}?text={encodeURIComponent(message)}`
  - URL Telegram : `https://t.me/{username}?text={encodeURIComponent(message)}`
- Textes : via copywriter-fr (états vides, confirmations, erreurs panier)

---

## PHASE 7 — Stripe & Emails

### (stripe-billing + nextjs-builder + copywriter-fr)

- Setup Stripe : `lib/stripe/index.ts` (client serveur), `lib/stripe/client.ts` (client browser)
- Server Action `createCheckoutSession` : Checkout en mode subscription, prix depuis `NEXT_PUBLIC_STRIPE_PRICE_ID`, trial 14j, `stripe_customer_id` créé/récupéré
- `/dashboard/abonnement` :
  - Statut actuel (trial, actif, past_due, annulé + date)
  - Bouton "Gérer mon abonnement" → Customer Portal
  - Bouton "S'abonner" si pas encore abonné
  - Bandeau rouge si past_due avec nb de jours restants
- Webhook `/api/stripe/webhook` :
  - `checkout.session.completed` → activer abonnement
  - `customer.subscription.updated` → sync status
  - `customer.subscription.deleted` → canceled + désactiver catalogue
  - `invoice.payment_succeeded` → email confirmation (Resend)
  - `invoice.payment_failed` → past_due + email avertissement
- Désactivation automatique : cron ou webhook → si `past_due` > 7 jours → `merchants.status = 'suspended'`
- Tous les emails transactionnels (Resend) : textes via copywriter-fr

---

## PHASE 8 — Sécurité, tests, SEO & déploiement

### 8a. Audit sécurité (security-reviewer)
Audite l'intégralité du projet. Produis `docs/security/audit-v1.md`.
**POINT DE DÉCISION — corrige tous les CRITICAL et HIGH avant de continuer.**

### 8b. Tests (test-writer)
Écris les tests Playwright pour les 6 flows critiques :
1. Inscription marchand → confirmation
2. Admin approuve → marchand reçoit email + peut se connecter
3. Débloquage catalogue (code valide + code invalide + rate limit)
4. Ajout produits au panier + génération message WhatsApp
5. Abonnement Stripe (mode test)
6. Marchand suspendu → catalogue indisponible

Écris les tests Vitest : `generateCartMessage`, `slugify`, `formatPrice`, schemas Zod.

### 8c. SEO & meta (nextjs-builder)
- `generateMetadata` sur toutes les pages dynamiques
- OG images dynamiques (`app/og/route.tsx`) pour `/[slug]`
- `sitemap.ts` dynamique (slugs marchands actifs)
- `robots.ts`
- `manifest.ts` (PWA basique)

### 8d. Performance finale (performance-optimizer)
Analyse `next build --analyze`. Produis `docs/performance/audit-v1.md`.
Cible : LCP < 2.5s, aucun chunk > 200KB.

### 8e. Déploiement (nextjs-builder)
- `vercel.json` avec redirects et headers
- Variables d'env documentées pour Vercel
- Checklist pré-déploiement :
  - [ ] `.env.local` non commité
  - [ ] Webhook Stripe configuré avec l'URL de prod
  - [ ] Supabase URL rewriting configuré
  - [ ] `NEXT_PUBLIC_SITE_URL` = URL de prod
  - [ ] RLS testé sur la DB de prod
  - [ ] Seed supprimé (ou guard `NODE_ENV`)

---

## Règles pour toute la session

- Après chaque fichier créé ou modifié : `graphify update .` (pour maintenir le knowledge graph)
- Ne jamais skipper la validation Zod
- Ne jamais utiliser `.select('*')` avec Supabase
- Toujours utiliser `next/image`, jamais `<img>`
- RLS activé sans exception
- Si tu as un doute sur une décision d'architecture → STOP et demande avant d'implémenter

**Commence par la Phase 1. Résume ce que tu vas faire, puis démarre.**

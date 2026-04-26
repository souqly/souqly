# Cahier des charges — Plateforme catalogue multi-marchands (style Yupoo FR)

## 1. Vision produit

SaaS B2B permettant à des marchands d'héberger leur catalogue produit en ligne, protégé par un code d'accès, avec un système de panier qui génère un message de commande pré-rempli redirigeant le client vers WhatsApp ou Telegram.

**Inspiration :** Yupoo (plateforme chinoise de catalogues photo), adaptée au marché francophone avec un design unifié moderne.

**Modèle économique :** Abonnement mensuel par marchand. Onboarding sur validation manuelle de l'admin.

---

## 2. Acteurs

### 2.1 Super-Admin (toi)
- Valide / refuse les demandes d'inscription marchand
- Gère les abonnements (statut, échéances)
- Voit tous les marchands, peut suspendre / supprimer un compte
- Accès à des stats globales (nb marchands actifs, MRR, etc.)

### 2.2 Marchand
- S'inscrit (formulaire) → en attente de validation
- Une fois validé, accède au dashboard
- Gère son catalogue : catégories, produits, photos, prix, descriptions
- Configure son code d'accès, ses contacts WhatsApp/Telegram, son template de message
- Voit ses stats basiques (nb visites, paniers générés)

### 2.3 Client final (visiteur du catalogue)
- Arrive sur `monsite.com/[slug-marchand]`
- Entre le code d'accès → débloque le catalogue
- Navigue, ajoute au panier (localStorage, pas de compte)
- Clique "Commander" → redirigé vers WhatsApp/Telegram avec message pré-rempli

---

## 3. Stack technique

| Couche | Choix |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui + lucide-react |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Sécurité | Row Level Security (RLS) sur toutes les tables |
| Hébergement | Vercel (front) + Supabase (DB/Storage) |
| Paiements abonnement | Stripe (mode subscription) |
| Emails transactionnels | Resend (validation, suspension, etc.) |
| Analytics légères | Plausible ou Vercel Analytics |

---

## 4. Schéma de base de données

### Tables principales

```sql
-- Marchands (un par compte Supabase Auth)
merchants (
  id uuid PK,
  user_id uuid FK → auth.users,
  slug text UNIQUE NOT NULL,         -- ex: "boutique-paris"
  name text NOT NULL,
  description text,
  logo_url text,
  status text CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  access_code_hash text NOT NULL,    -- code d'accès hashé (bcrypt)
  whatsapp_number text,              -- format E.164
  telegram_username text,
  message_template text,             -- template avec {{products}}, {{total}}, {{client_name}}
  subscription_status text,          -- 'trial', 'active', 'past_due', 'canceled'
  stripe_customer_id text,
  stripe_subscription_id text,
  trial_ends_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)

-- Catégories (par marchand)
categories (
  id uuid PK,
  merchant_id uuid FK → merchants,
  name text NOT NULL,
  slug text NOT NULL,
  position int,                      -- pour réorganiser
  cover_image_url text,
  created_at timestamptz,
  UNIQUE (merchant_id, slug)
)

-- Produits
products (
  id uuid PK,
  merchant_id uuid FK → merchants,
  category_id uuid FK → categories,
  name text NOT NULL,
  description text,
  price_cents int,                   -- prix en centimes (EUR)
  reference text,                    -- SKU / réf interne
  is_available boolean DEFAULT true,
  position int,
  created_at timestamptz,
  updated_at timestamptz
)

-- Images produits (n par produit)
product_images (
  id uuid PK,
  product_id uuid FK → products ON DELETE CASCADE,
  storage_path text NOT NULL,        -- chemin dans Supabase Storage
  position int,
  is_primary boolean,
  created_at timestamptz
)

-- Sessions d'accès client (cookie de session après code validé)
access_sessions (
  id uuid PK,
  merchant_id uuid FK → merchants,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamptz,            -- ex: 24h
  created_at timestamptz
)

-- Demandes d'inscription en attente (avant validation)
merchant_applications (
  id uuid PK,
  email text NOT NULL,
  business_name text,
  phone text,
  message text,                      -- ce qu'ils vendent, pourquoi, etc.
  status text DEFAULT 'pending',
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz
)

-- Logs analytiques basiques
catalog_visits (
  id uuid PK,
  merchant_id uuid FK,
  visited_at timestamptz,
  has_unlocked boolean               -- a-t-il entré le bon code ?
)

cart_submissions (
  id uuid PK,
  merchant_id uuid FK,
  product_count int,
  total_cents int,
  channel text,                      -- 'whatsapp' | 'telegram'
  submitted_at timestamptz
)
```

### RLS — règles principales

- `merchants` : un marchand ne lit/modifie que sa propre ligne (`user_id = auth.uid()`). Super-admin = role `service_role`.
- `categories`, `products`, `product_images` : accès écriture uniquement si `merchant_id` appartient au user connecté.
- **Lecture publique conditionnelle** : les pages catalogues sont publiques mais le contenu n'est révélé qu'après validation du code → la lecture publique se fait via une **fonction RPC** `get_merchant_catalog(slug, access_token)` qui vérifie le token de session.
- `access_sessions` : insertion uniquement via une RPC `unlock_catalog(slug, code)` côté serveur qui hash et compare.
- `merchant_applications` : insertion publique anonyme, lecture/update uniquement service_role.

### Fonctions RPC critiques

```sql
-- Valide un code et crée une session
unlock_catalog(merchant_slug text, code text)
  → returns { session_token text, expires_at timestamptz }
  → vérifie le hash, crée une access_session, retourne le token

-- Récupère le catalogue si session valide
get_catalog(merchant_slug text, session_token text)
  → returns table (catégories + produits + images)

-- Inscription marchand (publique, anonyme)
submit_merchant_application(email, business_name, phone, message)
  → insert dans merchant_applications

-- Activation après validation (admin only)
approve_merchant(application_id uuid, initial_password text)
  → crée le user auth.users, le merchant, envoie email de bienvenue
```

---

## 5. Architecture des pages

### 5.1 Pages publiques

```
/                              → Landing page (présentation SaaS, pricing, CTA inscription)
/inscription                   → Formulaire de demande marchand
/inscription/confirmation      → "Demande reçue, on revient vers toi sous 48h"
/login                         → Login marchand
/forgot-password               → Reset password
/[slug]                        → Page d'accueil marchand (logo + champ code)
/[slug]/catalogue              → Catalogue débloqué (catégories + produits)
/[slug]/categorie/[cat-slug]   → Vue catégorie
/[slug]/produit/[product-id]   → Détail produit (galerie + bouton ajout panier)
/[slug]/panier                 → Récap panier + bouton "Commander via WhatsApp/Telegram"
```

### 5.2 Dashboard marchand

```
/dashboard                     → Vue d'ensemble (stats, abonnement, raccourcis)
/dashboard/produits            → Liste + recherche + ajout
/dashboard/produits/nouveau    → Formulaire création produit
/dashboard/produits/[id]       → Édition produit + gestion images (drag & drop)
/dashboard/categories          → CRUD catégories + réorganisation
/dashboard/parametres          → Code d'accès, contacts, template message, slug
/dashboard/abonnement          → Statut Stripe, factures, mise à jour CB
/dashboard/stats               → Visites, paniers, conversion
```

### 5.3 Espace super-admin

```
/admin                         → Dashboard global
/admin/applications            → Demandes en attente (approve / reject)
/admin/marchands               → Liste tous marchands (filtres statut)
/admin/marchands/[id]          → Détail marchand (suspendre, voir activité)
/admin/abonnements             → Vue Stripe (MRR, churn, etc.)
```

Auth admin : route protégée par un check `is_super_admin` sur le user (champ booléen ou claim JWT custom).

---

## 6. Spécifications fonctionnelles détaillées

### 6.1 Inscription marchand

- Formulaire : email, nom commerce, téléphone, description activité
- Honeypot anti-spam + rate limiting (Supabase ou Upstash)
- Email de confirmation envoyé au marchand ("on revient vers toi")
- Email de notification envoyé à l'admin
- Admin valide → génère un mot de passe temporaire → email envoyé au marchand avec lien de connexion + obligation de reset au premier login

### 6.2 Code d'accès catalogue

- Définissable par le marchand (4 à 20 caractères alphanumériques)
- Hashé en bcrypt côté serveur (RPC `set_access_code`)
- Validation : RPC `unlock_catalog` vérifie + crée une `access_session` (token aléatoire 32 bytes, durée 24h)
- Token stocké en cookie httpOnly, Secure, SameSite=Lax
- Possibilité côté marchand de **régénérer/invalider toutes les sessions** (utile en cas de fuite)
- Rate limiting par IP : max 10 tentatives / 15 min sur une même slug

### 6.3 Catalogue (côté client final)

- Page d'entrée : logo + nom + champ code + bouton "Accéder"
- Catalogue : grille de catégories (cover image + nom + nb produits)
- Vue catégorie : grille de produits (image principale + nom + prix + dispo)
- Détail produit : galerie d'images (swipe sur mobile, lightbox sur desktop), description, référence, prix, sélecteur quantité, bouton "Ajouter au panier"
- Recherche globale dans le catalogue (par nom + référence)
- Filtres : catégorie, fourchette de prix, disponibilité

### 6.4 Panier & commande

- Stocké en `localStorage` (clé : `cart_[merchant_slug]`)
- Affiche : image, nom, réf, qté (modifiable), prix unitaire, sous-total
- Total général
- Champ optionnel "votre nom" (pour personnaliser le message)
- Champ optionnel "remarque" (livraison, taille, etc.)
- Boutons "Commander via WhatsApp" et "Commander via Telegram" (uniquement ceux configurés par le marchand)

**Génération du message :**

Template par défaut configurable, avec placeholders :
```
Bonjour, je souhaite commander :

{{products}}

Total : {{total}} €

Nom : {{client_name}}
Remarque : {{notes}}
```

`{{products}}` est remplacé par une liste type :
```
- 2x Sneakers Modèle X (REF-001) — 80€/u
- 1x Sac Modèle Y (REF-042) — 45€
```

URL générée :
- WhatsApp : `https://wa.me/{{number}}?text={{encodeURIComponent(message)}}`
- Telegram : `https://t.me/{{username}}?text={{encodeURIComponent(message)}}`

Avant redirection : insertion d'une ligne dans `cart_submissions` pour les stats.

### 6.5 Dashboard marchand — gestion produits

- Liste avec recherche, tri, filtre par catégorie, action en masse (suppression, changement dispo)
- Création produit : formulaire + upload multiple images (drag & drop, jusqu'à 10 images, compression côté client avant upload pour optimiser le storage)
- Réorganisation des images par drag & drop (lib `@dnd-kit`)
- Image principale = première de la liste (modifiable)
- Édition inline du prix dans la liste

### 6.6 Abonnement Stripe

- Plan unique au lancement (ex: 29€/mois) — extensible plus tard
- Trial 14 jours offerts à l'activation par l'admin
- Webhook Stripe : maintien du statut `subscription_status` à jour
- Si `past_due` ou `canceled` → bandeau rouge dans le dashboard + au bout de 7 jours, désactivation du catalogue public (page `/[slug]` affiche "Catalogue temporairement indisponible")
- Portail client Stripe pour gestion CB et factures

---

## 7. Design system

**Palette unifiée pour tous les marchands** (pas de personnalisation par marchand) :
- Mode sombre par défaut (cohérent avec l'esthétique catalogues type Yupoo)
- Mode clair disponible (toggle)
- Accent : à définir — proposition `#FF6B35` (orange chaleureux) ou `#3B82F6` (bleu) — à valider visuellement
- Typo : Inter (UI) + Cal Sans / Bricolage Grotesque pour les titres
- Icônes : lucide-react
- Composants : shadcn/ui (Button, Card, Dialog, Input, Select, Tabs, Toast, Sheet)
- Photos produits : ratio 1:1 ou 4:5, lazy loading, blur placeholder Next.js Image

---

## 8. Sécurité — checklist

- [ ] RLS activé sur toutes les tables, policies testées
- [ ] Code d'accès bcrypt (jamais en clair en DB)
- [ ] Session token cryptographiquement aléatoire (`crypto.randomBytes(32)`)
- [ ] Cookies httpOnly + Secure + SameSite
- [ ] Rate limiting sur `unlock_catalog`, login, inscription
- [ ] CSRF protection sur les actions sensibles (Next.js Server Actions par défaut OK)
- [ ] Validation Zod sur tous les inputs (côté client ET RPC)
- [ ] Webhooks Stripe vérifiés via signature
- [ ] Storage Supabase : bucket `product-images` privé, accès via signed URLs ou via la RPC catalogue
- [ ] Pas de `service_role` exposé côté client
- [ ] Headers sécurité (CSP, X-Frame-Options) via `next.config.js`

---

## 9. Plan de développement (phases pour Claude Code)

### Phase 1 — Fondations (1 session)
- Init projet Next.js 14 + TS + Tailwind + shadcn/ui
- Setup Supabase local (CLI) + projet remote
- Migrations SQL : toutes les tables + RLS + RPC critiques
- Seed avec 1 marchand de test, 3 catégories, 10 produits
- Layout de base + thème sombre/clair

### Phase 2 — Auth & inscription
- Page `/inscription` + RPC `submit_merchant_application`
- Email de notif admin (Resend)
- `/login`, `/forgot-password`
- Middleware d'authent pour `/dashboard/*`

### Phase 3 — Espace super-admin
- Pages `/admin/applications` + flow approve/reject
- RPC `approve_merchant` (création user + merchant + email)
- Vue liste marchands + actions de suspension

### Phase 4 — Dashboard marchand (catalogue)
- CRUD catégories + réorganisation
- CRUD produits + upload images Supabase Storage
- Page paramètres (code accès, contacts, template message, slug)

### Phase 5 — Catalogue public
- Page `/[slug]` avec champ code
- RPC `unlock_catalog` + gestion cookie session
- Pages `/[slug]/catalogue`, `/categorie/[...]`, `/produit/[...]`
- Recherche & filtres

### Phase 6 — Panier & commande
- État panier (Zustand ou Context + localStorage)
- Page panier + génération message
- Liens WhatsApp/Telegram + log `cart_submissions`

### Phase 7 — Abonnements Stripe
- Setup Stripe Checkout + portail client
- Webhook handler `/api/stripe/webhook`
- Bandeau statut + désactivation auto si impayé

### Phase 8 — Stats & polish
- Dashboard stats marchand (visites, paniers, conversion)
- Dashboard stats admin (MRR, churn, marchands actifs)
- SEO meta + OG images dynamiques
- Tests E2E sur les flows critiques (Playwright)
- Déploiement Vercel + DNS

---

## 10. Variables d'environnement

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_ID=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
```

---

## 11. Aspects légaux à anticiper

- **CGU + CGV** marchand (engagement de ne pas vendre de produits illicites, contrefaçons, etc.) — clause de résiliation immédiate
- **Politique de confidentialité** RGPD (données marchand + données clients finaux limitées)
- **Mentions légales** + numéro SIREN à afficher
- **Vigilance contrefaçon** : Yupoo est très utilisé pour les reps. Tu devras décider si tu acceptes ce type d'usage (risque légal réel en France) ou si tu modères. À définir clairement dans les CGU.

---

## 12. Roadmap V2 (post-MVP)

- App mobile (Expo) pour les marchands
- Multi-langues catalogue (FR/EN/AR)
- Stats avancées (heatmaps produits, sources de trafic)
- Export catalogue PDF pour impression
- Domaine custom par marchand (`catalogue.maboutique.fr`)
- Système de favoris client (sans compte, juste localStorage)
- Notifications push marchand quand panier généré (PWA)

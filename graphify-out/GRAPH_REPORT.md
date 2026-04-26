# Graph Report - Souqly  (2026-04-26)

## Corpus Check
- 82 files · ~45,682 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 296 nodes · 349 edges · 15 communities detected
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 90 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 33 edges
2. `Souqly Platform` - 23 edges
3. `GET()` - 22 edges
4. `getAuthenticatedMerchant()` - 16 edges
5. `POST()` - 9 edges
6. `createAdminClient()` - 8 edges
7. `Souqly Project CLAUDE.md Context` - 8 edges
8. `generateMetadata()` - 7 edges
9. `getSiteUrl()` - 7 edges
10. `Souqly Brand Guide` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AdminLayout()` --calls--> `createClient()`  [INFERRED]
  src\app\admin\layout.tsx → src\lib\supabase\server.ts
- `MarchandsPage()` --calls--> `createAdminClient()`  [INFERRED]
  src\app\admin\marchands\page.tsx → src\lib\supabase\admin.ts
- `POST()` --calls--> `GET()`  [INFERRED]
  src\app\api\stripe\webhook\route.ts → src\app\auth\callback\route.ts
- `POST()` --calls--> `createAdminClient()`  [INFERRED]
  src\app\api\stripe\webhook\route.ts → src\lib\supabase\admin.ts
- `GET()` --calls--> `generateMetadata()`  [INFERRED]
  src\app\auth\callback\route.ts → src\app\[slug]\(catalogue)\produit\[id]\page.tsx

## Hyperedges (group relationships)
- **Souqly Core Technology Stack** — cahier_stack_nextjs, cahier_stack_supabase, cahier_stack_tailwind, cahier_stack_stripe, cahier_stack_resend, cahier_stack_vercel [EXTRACTED 1.00]
- **Souqly Platform Actors** — cahier_actor_superadmin, cahier_actor_merchant, cahier_actor_client [EXTRACTED 1.00]
- **Souqly Database Schema Tables** — cahier_db_merchants, cahier_db_categories, cahier_db_products, cahier_db_product_images, cahier_db_access_sessions, cahier_db_merchant_applications, cahier_db_catalog_visits, cahier_db_cart_submissions [EXTRACTED 1.00]
- **Souqly Critical RPC Functions** — cahier_rpc_unlock_catalog, cahier_rpc_get_catalog, cahier_rpc_submit_application, cahier_rpc_approve_merchant [EXTRACTED 1.00]
- **Souqly Merchant Personas** — personas_merchant_yasmine, personas_merchant_karim, personas_merchant_jordan [EXTRACTED 1.00]
- **Souqly Buyer Personas** — personas_buyer_nadia, personas_buyer_mehdi [EXTRACTED 1.00]
- **Souqly Brand Direction Candidates** — brand_direction1, brand_direction2, brand_direction3 [EXTRACTED 1.00]
- **Souqly Legal Framework (CGU)** — legal_hosting_status, legal_notice_takedown, legal_merchant_obligations, legal_subscription_terms, legal_liability_limitation, legal_gdpr, legal_suspension_termination [EXTRACTED 1.00]
- **Souqly Roadmap Phases** — roadmap_mvp, roadmap_growth, roadmap_scale [EXTRACTED 1.00]
- **Next.js Default Public Directory Icons** — file_svg_file_icon, globe_svg_globe_icon, next_svg_nextjs_logo, vercel_svg_vercel_logo, window_svg_window_icon [INFERRED 0.90]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (28): resetPassword(), signIn(), signOut(), signUp(), unlockCatalog(), addProductImage(), createCategory(), createProduct() (+20 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (33): Client Final (Visitor) Actor, Super-Admin Actor, DB Table: access_sessions, DB Table: catalog_visits, DB Table: categories, DB Table: merchant_applications, DB Table: merchants, DB Table: product_images (+25 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (15): createCheckoutSession(), createPortalSession(), getRequiredEnv(), getSiteUrl(), getStripePriceId(), getStripeWebhookSecret(), readFirstEnv(), getResend() (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.19
Nodes (8): submitCartStats(), formatPrice(), generateOrderMessage(), buildOrderMessage(), generateMetadata(), getCatalogData(), handleOrder(), storageUrl()

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (3): handleDelete(), handleSetPrimary(), markImagePending()

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (14): Merchant Actor, Legal Aspects (CGU, RGPD, contrefaçon), Roadmap V2 Features (post-MVP), CGU — Conditions Générales d'Utilisation, RGPD / Data Protection (CGU Art. 8), Hébergeur Status (LCEN/DSA), Liability Limitation (CGU Art. 10), Merchant Obligations (CGU Art. 6) (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (11): Brand Direction 1: Souk Digital, Brand Direction 2: Minimalisme Premium (Recommended), Brand Direction 3: Luxe Accessible (Rejected), Editorial Tone Guidelines, Souqly Brand Guide, Brand Palette: Indigo/Slate (dark mode), Rationale: Why Minimalisme Premium was chosen, Brand Typography: Bricolage Grotesque + Inter (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (11): DB Table: cart_submissions, Development Phases Plan (Phase 1-8), Shopping Cart (localStorage), Stripe Subscription Management, WhatsApp/Telegram Order Generation, Stripe Subscriptions, Agent: stripe-billing, Subscription & Payment Terms (CGU Art. 7) (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.36
Nodes (7): approveApplication(), createAdminClient(), getAdminUser(), reactivateMerchant(), rejectApplication(), suspendMerchant(), MarchandsPage()

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (7): getCartKey(), getStorageKey(), loadCart(), readCartFromStorage(), saveCart(), useCart(), writeCartToStorage()

### Community 10 - "Community 10"
Cohesion: 0.36
Nodes (8): Next.js Framework Brand, Vercel Hosting Platform Brand, File Icon SVG, Globe Icon SVG, Next.js Logo SVG, Public Static Assets Directory, Vercel Logo SVG, Window / Browser Icon SVG

### Community 66 - "Community 66"
Cohesion: 1.0
Nodes (1): Public Pages Architecture

### Community 67 - "Community 67"
Cohesion: 1.0
Nodes (1): Merchant Dashboard Pages

### Community 68 - "Community 68"
Cohesion: 1.0
Nodes (1): Super-Admin Pages

### Community 69 - "Community 69"
Cohesion: 1.0
Nodes (1): Explicitly Out of Scope Features

## Knowledge Gaps
- **29 isolated node(s):** `SaaS B2B Multi-Merchant Catalogue`, `Tailwind CSS + shadcn/ui + lucide-react`, `Resend Transactional Emails`, `Vercel Hosting`, `DB Table: catalog_visits` (+24 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 66`** (1 nodes): `Public Pages Architecture`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (1 nodes): `Merchant Dashboard Pages`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (1 nodes): `Super-Admin Pages`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (1 nodes): `Explicitly Out of Scope Features`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 0` to `Community 8`, `Community 2`, `Community 3`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `Souqly Platform` connect `Community 1` to `Community 5`, `Community 7`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `GET()` connect `Community 0` to `Community 8`, `Community 2`, `Community 3`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 32 inferred relationships involving `createClient()` (e.g. with `AdminLayout()` and `GET()`) actually correct?**
  _`createClient()` has 32 INFERRED edges - model-reasoned connections that need verification._
- **Are the 21 inferred relationships involving `GET()` (e.g. with `POST()` and `createClient()`) actually correct?**
  _`GET()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `POST()` (e.g. with `GET()` and `getStripeWebhookSecret()`) actually correct?**
  _`POST()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `SaaS B2B Multi-Merchant Catalogue`, `Tailwind CSS + shadcn/ui + lucide-react`, `Resend Transactional Emails` to the rest of the system?**
  _29 weakly-connected nodes found - possible documentation gaps or missing edges._
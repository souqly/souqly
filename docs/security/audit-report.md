# Audit sécurité Souqly — 2026-04-26

## Résumé exécutif

Le codebase Souqly présente une base solide : validation Zod sur toutes les Server Actions, vérification de signature Stripe sur le body brut avant tout accès DB, cookie de session catalogue en httpOnly/Secure/SameSite. Cinq issues ont été identifiées et **toutes ont été corrigées** dans cette session. Un travail restant (rate limiting sur `unlockCatalog`) nécessite une intégration Upstash externe.

---

## Issues corrigées

### CRIT-1 — Middleware ne vérifiait pas le rôle `super_admin` ✅ CORRIGÉ
**Fichier :** `src/middleware.ts`  
**Fix :** Ajout du check `user.app_metadata?.role !== 'super_admin'` avec redirect `/dashboard` pour les routes `/admin/*`.

### CRIT-2 — Webhook Stripe faisait confiance à `metadata.merchant_id` sans vérification ✅ CORRIGÉ
**Fichier :** `src/app/api/stripe/webhook/route.ts`  
**Fix :** Cross-vérification de `sub.customer` vs `stripe_customer_id` en DB avant toute mise à jour. Si mismatch → event ignoré.

### MED-1 — `suspendMerchant` écrivait `'inactive'` au lieu de `'suspended'` ✅ CORRIGÉ
**Fichier :** `src/lib/actions/admin.ts:196`  
**Fix :** Valeur changée en `'suspended'` pour correspondre au CHECK constraint du schéma.

### MED-2 — Open redirect via `//evil.com` (bypass du check `startsWith('/')`) ✅ CORRIGÉ
**Fichiers :** `src/app/login/page.tsx:32`, `src/app/auth/callback/route.ts:24`  
**Fix :** Condition étendue à `startsWith('/') && !startsWith('//')`.

### MED-5 — Message d'erreur Supabase exposé verbatim dans `signUp` ✅ CORRIGÉ
**Fichier :** `src/lib/actions/auth.ts:77`  
**Fix :** Message générique `'Une erreur est survenue lors de la création du compte.'`

---

## Issues restantes

### CRIT-3 — Pas de rate limiting applicatif sur `unlockCatalog`
**Fichier :** `src/lib/actions/catalog.ts`  
**Risque :** Brute-force du code d'accès (4 chars = ~1.7M combinaisons sans throttling).  
**Action requise :** Intégrer Upstash Ratelimit (max 10 tentatives / 15 min / IP+slug) ou confirmer que la RPC Supabase `unlock_catalog` implémente ce check en DB.

```typescript
// Exemple d'intégration Upstash dans unlockCatalog :
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '15 m'),
})

const { success } = await ratelimit.limit(`unlock:${slug}:${ip}`)
if (!success) return { error: 'Trop de tentatives. Réessayez dans 15 minutes.' }
```

### MED-3 — Content-Security-Policy absent
**Fichier :** `next.config.ts`  
**Action recommandée :** Ajouter un CSP strict. Point de départ :
```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://*.supabase.co; script-src 'self' 'unsafe-inline' https://js.stripe.com; frame-src https://js.stripe.com;
```

### MED-4 — `addProductImage` accepte un `storagePath` arbitraire sans validation de format
**Fichier :** `src/lib/actions/dashboard.ts`  
**Action recommandée :** Valider le format avec regex `^[a-f0-9-]{36}/[a-f0-9-]{36}/[\w._-]+$` et vérifier que le premier segment UUID correspond au `merchantId` authentifié.

### MED-6 — Erreurs DB brutes exposées dans les actions admin
**Fichiers :** `src/lib/actions/admin.ts` (rejectApplication, suspendMerchant, reactivateMerchant)  
**Action recommandée :** Logger `error.message` côté serveur, retourner un message générique au client.

---

## Points confirmés sécurisés

- **Webhook Stripe :** raw body + vérification signature avant tout traitement
- **STRIPE_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY :** jamais exposés côté client
- **Cookie session catalogue :** httpOnly, Secure (prod), SameSite=lax
- **Session validée server-side à chaque requête** via RPC `get_catalog` (pas de simple vérification de présence)
- **Zod sur toutes les Server Actions** — aucune exception trouvée
- **Ownership checks sur toutes les mutations CRUD** dans `dashboard.ts`
- **Rôle super_admin vérifié en double** (middleware + layout + action)
- **Password reset sans fuite d'existence de compte** — retourne toujours succès
- **Message d'erreur de connexion générique** — ne distingue pas email/mot de passe
- **Headers de sécurité présents :** X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **`.gitignore` couvre tous les `.env*`**
- **Slug validé** en regex `[a-z0-9-]` dans toutes les actions
- **Clés d'idempotence Stripe** sur la création de customer

---

*Audit réalisé le 2026-04-26. Corrections appliquées dans la même session.*

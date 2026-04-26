## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

---

# Souqly — Contexte projet

## Vue d'ensemble
Plateforme SaaS catalogue multi-marchands (style Yupoo FR). Les marchands hébergent leur catalogue protégé par code d'accès, les clients commandent via WhatsApp/Telegram.

## Stack
- Next.js 14 App Router + TypeScript strict
- Supabase (PostgreSQL + Auth + Storage + RLS)
- Tailwind CSS + shadcn/ui + lucide-react
- Stripe (abonnements) + Resend (emails)
- Vercel (hébergement)

## Fichier de référence
Toujours lire `cahier-des-charges-catalogue-saas.md` pour le contexte complet.

## Agents disponibles
- `supabase-expert` — DB, migrations, RLS, RPC
- `nextjs-builder` — pages, Server Components, Server Actions
- `ui-designer` — composants UI, design system
- `stripe-billing` — paiements, abonnements
- `security-reviewer` — audit sécurité (read-only)
- `test-writer` — Playwright + Vitest
- `performance-optimizer` — perf, caching, coûts
- `product-strategist` → docs/product/
- `brand-designer` → docs/brand/
- `copywriter-fr` → docs/copy/
- `growth-marketer` → docs/growth/
- `legal-advisor` → docs/legal/

## Règles globales
- RLS activé sur TOUTES les tables, sans exception
- Server Components par défaut, 'use client' minimal
- Validation Zod sur tous les inputs
- Cookies httpOnly + Secure + SameSite=Lax
- Jamais service_role côté client
- Images : next/image uniquement, compression avant upload (200KB max)
- Sélection explicite des colonnes Supabase (.select('*') interdit)

## Structure docs/
- docs/brand/ — décisions de design (lues par ui-designer)
- docs/product/ — stratégie produit
- docs/copy/ — textes utilisateurs
- docs/growth/ — stratégie croissance
- docs/legal/ — documents juridiques
- docs/performance/ — audits et notes perf

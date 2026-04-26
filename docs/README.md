# Documentation du projet

Ce dossier contient tous les livrables non-techniques produits par les agents IA spécialisés.

## Agents non-techniques

| Agent | Sous-dossier | Rôle |
|---|---|---|
| `brand-designer` | `docs/brand/` | Identité visuelle, palette, tokens design, brief logo |
| `product-strategist` | `docs/product/` | Roadmap, personas, analyse concurrentielle, priorisation |
| `copywriter-fr` | `docs/copy/` | Landing page, emails, microcopy, onboarding |
| `growth-marketer` | `docs/growth/` | Acquisition, SEO, pricing, rétention, parrainage |
| `legal-advisor` | `docs/legal/` | CGU, CGV, RGPD, mentions légales, modération |
| `performance-optimizer` | `docs/performance/` | Audits perf, benchmarks, recommandations caching |

## Sous-dossiers

### `docs/brand/`
Identité visuelle : brand guide, design tokens (synchro `tailwind.config.ts`), brief logo, moodboard.
> Utilisé par l'agent `ui-designer` pour appliquer les décisions de design.

### `docs/product/`
Stratégie produit : roadmap, personas marchands, analyse concurrentielle, backlog priorisé.

### `docs/copy/`
Contenus rédigés en français : landing page, emails transactionnels, microcopy, onboarding dashboard.

### `docs/growth/`
Stratégie de croissance : canaux d'acquisition, SEO, pricing, boucles de rétention, programme de parrainage.

### `docs/legal/`
Documents juridiques (⚠️ à valider par un avocat) : CGU, CGV, politique de confidentialité, mentions légales, politique de modération.

### `docs/performance/`
Audits de performance, notes d'optimisation, benchmarks Web Vitals.

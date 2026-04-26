# Souqly — Brand Guide

> Document de référence identité de marque. Dernière mise à jour : 2026-04-25.

---

## 3 Directions de marque

### Direction 1 — Souk Digital

**Positionnement :** La plateforme qui digitalise le souk traditionnel. Chaleur, authenticité, proximité culturelle. Ancrage Maghreb/France avec une touche de modernité artisanale.

**Ton :** Chaleureux, familier, communautaire. "Chez nous, on sait ce qu'on vend."

**Palette**
| Rôle | Hex | Nom |
|---|---|---|
| Primary | `#C2692A` | Terracotta |
| Secondary | `#8B5E3C` | Cuir |
| Accent | `#F5C842` | Safran |
| Neutral | `#3D2B1F` | Café |
| Background | `#FDF6EE` | Sable |
| Surface | `#FFFFFF` | Blanc |

**Typographie :** Headings → Fraunces (sérif organique) · Body → Plus Jakarta Sans

**Style visuel :** Flat chaleureux, textures légères, icônes arrondies, motifs géométriques discrets (zellige, arabesque simplifiée)

**Wording exemples :**
- "Votre catalogue, votre vitrine."
- "Commandez comme si vous étiez au marché."
- "Simple. Discret. Efficace."

**Attire :** Revendeurs mode Maghreb, grossistes textiles, marchands informels en voie de structuration. Moins adapté aux marchands premium qui veulent projeter une image haut de gamme.

---

### Direction 2 — Minimalisme Premium ✅ RECOMMANDÉE

**Positionnement :** L'outil professionnel sobre et puissant. Pour les marchands qui veulent être pris au sérieux sans se ruiner dans un site e-commerce. Dark mode par défaut, dense, efficace.

**Ton :** Direct, confiant, professionnel sans arrogance. "Vous êtes pro. Votre catalogue aussi."

**Palette**
| Rôle | Hex | Nom |
|---|---|---|
| Primary | `#4F46E5` | Indigo |
| Secondary | `#6366F1` | Violet clair |
| Accent | `#F59E0B` | Ambre |
| Neutral | `#64748B` | Slate |
| Background | `#0F172A` | Nuit (dark) / `#F8FAFC` (light) |
| Surface | `#1E293B` | Ardoise (dark) / `#FFFFFF` (light) |
| Error | `#EF4444` | Rouge |
| Success | `#10B981` | Émeraude |

**Typographie :** Headings → Bricolage Grotesque · Body → Inter

**Style visuel :** Dark mode par défaut, glassmorphism léger sur les cards, bordures fines, espacement généreux, micro-animations fluides (200ms ease-out)

**Wording exemples :**
- "Votre catalogue professionnel, en 5 minutes."
- "Partagez. Protégez. Vendez."
- "Le catalogue que vos clients méritent."

**Attire :** Revendeurs sneakers/streetwear, boutiques mode Lyon/Paris, marchands multi-catégories qui commandent via WhatsApp groupes, utilisateurs Yupoo en migration.

---

### Direction 3 — Luxe Accessible

**Positionnement :** L'élégance du luxe à portée des indépendants. Noir, or, sérif. Pour les marchands qui vendent du premium et veulent une image irréprochable.

**Ton :** Raffiné, exclusif, aspirationnel. "Votre catalogue parle avant vous."

**Palette**
| Rôle | Hex | Nom |
|---|---|---|
| Primary | `#1A1A1A` | Onyx |
| Secondary | `#2D2D2D` | Anthracite |
| Accent | `#C9A84C` | Or |
| Neutral | `#9CA3AF` | Gris perle |
| Background | `#FAFAFA` | Blanc cassé |
| Surface | `#FFFFFF` | Blanc pur |

**Typographie :** Headings → Cormorant Garamond · Body → DM Sans

**Style visuel :** Lignes fines, beaucoup de blanc, typographie grande et aérée, photos produit en plein écran, interactions discrètes

**Wording exemples :**
- "L'élégance, sans compromis."
- "Votre vitrine, à votre image."

**Attire :** Revendeurs sacs/accessoires haut de gamme, vintage luxe, bijouterie. **Problème :** incompatible avec la densité catalogue nécessaire pour Souqly (nombreux SKU, navigation rapide). Écartée.

---

## Recommandation : Direction 2 — Minimalisme Premium

**Pourquoi cette direction ?**

1. **Compatibilité densité catalogue** : les marchands Souqly ont souvent des centaines de produits. Le dark mode + typographie Inter dense + espacement calibré permettent d'afficher beaucoup d'information sans fatigue visuelle.

2. **Crédibilité face à Yupoo** : Yupoo est perçu comme "chinois et informel". Souqly doit projeter une image pro et française. L'indigo + Bricolage Grotesque ancrent la modernité tech sans l'arrogance du luxe.

3. **Cohérence shadcn/ui** : la stack utilise déjà shadcn/ui et Tailwind. Les tokens indigo/slate s'intègrent nativement sans surcharge CSS.

4. **Willingness to pay** : les marchands qui paient un SaaS attendent une interface qui les fait "monter en gamme". Le minimalisme premium valide leur choix d'investir.

5. **Polyvalence géographique** : neutre culturellement, fonctionne aussi bien pour Paris que Casablanca ou Tunis.

---

## Valeurs de marque (5 mots)

**Discret. Professionnel. Rapide. Fiable. Vôtre.**

---

## Ton éditorial

| Contexte | Ton | Exemple |
|---|---|---|
| Onboarding marchand | Encourageant, simple | "Votre premier catalogue est à 3 étapes." |
| Erreur | Direct, sans drama | "Code invalide. Vérifiez avec le marchand." |
| Empty state | Utile, action claire | "Aucun produit encore. Ajoutez votre première collection." |
| Email abonnement | Professionnel, chaleureux | "Votre plan Pro est actif. Voici ce qui change." |
| Marketing | Confiant, bénéfice d'abord | "Stoppez Yupoo. Votre catalogue vous appartient." |

---

## Règles logo

- Fond sombre : logo blanc + accent ambre
- Fond clair : logo indigo foncé (`#3730A3`)
- Zone d'exclusion : 1× hauteur du logo sur tous les côtés
- Taille minimum : 24px hauteur

## Anti-patterns

- Jamais de dégradés criards
- Jamais Comic Sans, Lobster, ou polices décoratives
- Jamais fond blanc pur (#FFFFFF) sur dark mode
- Jamais d'animations > 400ms
- Pas de stock photos génériques (personnes souriantes devant laptop)

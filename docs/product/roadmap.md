# Souqly — Roadmap Produit

> Dernière mise à jour : 2026-04-25
> North Star Metric : **Nombre de catalogues actifs ayant reçu au moins 1 commande WhatsApp dans les 30 derniers jours**

---

## Vision 12 mois

Souqly est la plateforme de référence pour les revendeurs mode informels en France et au Maghreb. Chaque marchand a un catalogue pro en ligne en moins de 10 minutes. Chaque cliente commande d'un tap. Les marchands paient parce que Souqly leur fait gagner du temps et de la crédibilité.

**OKR annuel**
- 500 marchands actifs payants
- NRR > 90%
- Churn mensuel < 5%
- 3 000 commandes WhatsApp/mois tracées

---

## MVP — M0 à M2 (Lancement)

**Objectif :** Premier marchand payant, premier catalogue partagé, première commande WhatsApp tracée.

### Fonctionnalités

| # | Feature | Priorité |
|---|---|---|
| 1 | Auth marchand (email + magic link Supabase) | P0 |
| 2 | Création catalogue (nom, description, code d'accès) | P0 |
| 3 | Upload produits (photo, nom, prix, taille/couleur, stock) | P0 |
| 4 | Page catalogue publique (accès par code) | P0 |
| 5 | Bouton "Commander via WhatsApp" par produit | P0 |
| 6 | Abonnement Stripe (Free / Pro 29€/mois) | P0 |
| 7 | Dashboard marchand (liste produits, stats vues basiques) | P1 |
| 8 | Compression image automatique (< 200KB) | P1 |
| 9 | Mobile-first responsive (catalogue visiteur) | P0 |
| 10 | Email de bienvenue marchand (Resend) | P1 |

### Limites Free
- 1 catalogue, 30 produits max, watermark Souqly

### Plan Pro (29 €/mois)
- Catalogues illimités, produits illimités, pas de watermark, stats vues

### Critères de succès MVP
- [ ] 10 marchands inscrits en beta
- [ ] 3 marchands convertis en Pro dans les 30 jours
- [ ] Time-to-first-catalogue < 10 min (mesuré en test utilisateur)
- [ ] 0 bug bloquant sur mobile iOS/Android

### Risques MVP
- Upload photos lent sur connexion mobile faible → compression côté client (browser-image-compression)
- Friction Stripe onboarding → simplifier au max, trial 14 jours sans CB

---

## Growth — M3 à M6

**Objectif :** Acquisition organique, rétention, expansion fonctionnelle.

### Fonctionnalités

| # | Feature | Impact | Effort |
|---|---|---|---|
| 1 | Stats marchands avancées (vues/produit, sources trafic) | Rétention | M |
| 2 | Guide onboarding interactif (checklist premiers pas) | Activation | S |
| 3 | Domaine personnalisé (catalogue.mondomaine.com) | Upgrade Pro+ | L |
| 4 | Multiples codes d'accès par catalogue (segmentation clients) | Rétention | M |
| 5 | Gestion stock (marquer "épuisé", quantité) | Core value | M |
| 6 | SEO landing pages marchands (optionnel, catalogue public) | Acquisition | L |
| 7 | Lien Telegram en plus de WhatsApp | Acquisition | S |
| 8 | Partage catalogue via QR code | Activation | S |
| 9 | Programme referral marchand (1 mois offert par marchand invité) | Acquisition | M |
| 10 | Notifications email aux marchands (nouvelles commandes) | Rétention | M |

### Métriques cibles M6
- 150 marchands actifs
- MRR 4 000 €
- Churn < 8%
- Activation rate (J7) > 60%

### Risques Growth
- Domaine personnalisé = complexité DNS/SSL → limiter au plan Pro+, bien documenter
- SEO catalogue public = tension avec la protection par code d'accès → catalogues "vitrine" optionnels

---

## Scale — M7 à M12

**Objectif :** Densifier la valeur, ouvrir de nouveaux marchés, préparer la croissance internationale.

### Fonctionnalités

| # | Feature | Segment cible |
|---|---|---|
| 1 | PWA / App mobile marchands (upload photo natif) | Marchands mobile-first |
| 2 | Multi-langues catalogue visiteur (FR/AR/EN) | Maghreb, diaspora |
| 3 | Collections / catégories dans un catalogue | Marchands volume (Karim) |
| 4 | API publique (export catalogue vers Instagram/TikTok) | Marchands avancés |
| 5 | Historique commandes WhatsApp (webhook parsing) | Tous marchands |
| 6 | Plan Business (49 €/mois) : multi-utilisateurs, branding off | Grossistes |
| 7 | Intégration Telegram Bot (commandes automatisées) | Jordan / sneakers |
| 8 | Analytics avancés (heatmap catalogue, best sellers) | Pro/Business |
| 9 | Marketplace Souqly (catalogue public découvrable) | Acquisition clients |
| 10 | Paiement intégré optionnel (Stripe Checkout) | Marchands pro |

### Métriques cibles M12
- 500 marchands actifs payants
- MRR 20 000 €
- NRR > 90%
- 3 marchés actifs (FR, MA, TN)

### Risques Scale
- Paiement intégré = obligations réglementaires supplémentaires (KYC, AML) → traiter comme feature séparée avec conseil juridique
- Marketplace publique = risque modération contenu → statut hébergeur LCEN, procédure notice-and-takedown documentée

---

## Ce qui est explicitement hors scope

- Logistique / livraison (Souqly ne touche pas à la livraison)
- Avis / notation produits (phase 1)
- Chat intégré (WhatsApp/Telegram restent externes)
- Application iOS/Android native (PWA suffit jusqu'à M12)
- Facturation automatique pour les clients finaux

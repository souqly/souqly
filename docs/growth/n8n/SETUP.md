# Souqly — Setup n8n Social Media Automation

## Ce que ces workflows font

| Workflow | Fichier | Fonction |
|---|---|---|
| Génération contenu | `workflow-01-content-generation.json` | Chaque lundi 8h → Claude génère 5 posts → publie sur IG + TikTok → log Google Sheets |
| DM Automation | `workflow-02-dm-automation.json` | DM Instagram reçu → Claude analyse + répond → score lead → notif Telegram si lead chaud |

---

## Pré-requis

- [n8n](https://n8n.io) (self-hosted via Docker, ou n8n Cloud)
- Compte Anthropic avec clé API (`claude-sonnet-4-6`)
- App Meta Developer avec Instagram Basic Display + Messenger API
- Compte TikTok for Business avec Content Posting API
- Bot Telegram pour les notifications
- Google Sheets pour le CRM leads

---

## Étape 1 — Installer n8n

### Option recommandée : Docker (gratuit, self-hosted)

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  docker.n8nio/n8n
```

Accéder à : `http://localhost:5678`

### Option alternative : n8n Cloud
S'inscrire sur [app.n8n.cloud](https://app.n8n.cloud) — 20€/mois, zéro maintenance.

---

## Étape 2 — Créer les credentials n8n

Dans n8n → Settings → Credentials → Add credential

### 2.1 Anthropic API Key
- Type : `Header Auth`
- Name : `Anthropic API Key`
- Header Name : `x-api-key`
- Header Value : `sk-ant-api03-...` (ta clé Anthropic)

### 2.2 Meta Graph API Token
- Type : `Header Auth`
- Name : `Meta Graph API Token`
- Header Name : `Authorization`
- Header Value : `Bearer EAA...` (ton token Meta long-lived)

Comment obtenir le token Meta long-lived :
1. Aller sur [developers.facebook.com](https://developers.facebook.com)
2. Créer une App → Type : Business
3. Ajouter le produit "Messenger"
4. Générer un token de page → le convertir en long-lived token (60 jours)
5. Mettre en place un refresh automatique (voir section Maintenance)

### 2.3 TikTok API Token
- Type : `Header Auth`
- Name : `TikTok API Token`
- Header Name : `Authorization`
- Header Value : `Bearer tt_...`

Obtenir via [developers.tiktok.com](https://developers.tiktok.com) → Content Posting API (beta).

### 2.4 Telegram Bot
- Type : `Telegram API`
- Name : `Telegram Bot Souqly`
- Bot Token : créer via @BotFather sur Telegram (`/newbot`)

### 2.5 Google Sheets OAuth
- Type : `Google Sheets OAuth2`
- Name : `Google Sheets OAuth`
- Suivre le flow OAuth n8n pour connecter ton compte Google

---

## Étape 3 — Configurer les variables globales

Dans n8n → Settings → Variables

| Variable | Valeur | Comment l'obtenir |
|---|---|---|
| `INSTAGRAM_USER_ID` | `17841400...` | Graph API Explorer → `GET /me?fields=id` |
| `INSTAGRAM_PAGE_ID` | `10615...` | Même appel que ci-dessus |
| `META_WEBHOOK_VERIFY_TOKEN` | Chaîne aléatoire (ex: `souqly-secret-2026`) | Tu le choisis, doit matcher avec la config webhook Meta |
| `TELEGRAM_CHAT_ID` | `-100...` | Envoie un msg à ton bot, puis `GET /getUpdates` |
| `GOOGLE_SHEET_ID` | `1BxiM...` | Dans l'URL de ta Google Sheet |
| `IG_PLACEHOLDER_IMAGE_URL` | URL publique image PNG | Image hébergée sur ton Supabase Storage |
| `TIKTOK_PLACEHOLDER_VIDEO_URL` | URL publique MP4 | Idem |

---

## Étape 4 — Importer les workflows

1. Dans n8n → Workflows → Import from file
2. Importer `workflow-01-content-generation.json`
3. Importer `workflow-02-dm-automation.json`
4. Sur chaque node HTTP Request, vérifier que les credentials sont bien sélectionnés

---

## Étape 5 — Configurer le webhook Instagram (Workflow 2)

### 5.1 Récupérer l'URL webhook n8n
Dans le workflow 2, cliquer sur le node "Webhook — DM Instagram entrant" → copier l'URL de production.

Format : `https://ton-n8n.com/webhook/instagram-webhook`

### 5.2 Configurer dans Meta Developer Console
1. [developers.facebook.com](https://developers.facebook.com) → ton App → Webhooks
2. Ajouter un abonnement Page :
   - URL de callback : l'URL copiée ci-dessus
   - Token de vérification : valeur de `META_WEBHOOK_VERIFY_TOKEN`
3. S'abonner au champ : `messages`
4. Activer le workflow 2 dans n8n AVANT de valider (Meta envoie une requête GET de vérification)

### 5.3 Tester
Envoyer un DM à ton compte Instagram. Dans n8n → Executions, vérifier que le workflow s'est déclenché.

---

## Étape 6 — Créer la Google Sheet CRM

Créer une Google Sheet avec deux onglets :

### Onglet "Leads DM"
Colonnes : `date | sender_id | message | reponse | score | persona | intention | statut`

### Onglet "Contenu"
Colonnes : `date | plateforme | persona | script_ou_caption | hashtags | heure | statut`

---

## Étape 7 — Activer les workflows

1. Workflow 1 (Contenu) → Toggle "Active" en haut à droite
2. Workflow 2 (DMs) → Toggle "Active"

---

## Architecture complète

```
LUNDI 8H
    Schedule Trigger
        └── Claude (génère 5 posts JSON)
            └── Split par post
                ├── [Instagram] → Meta Graph API → Log Sheets
                └── [TikTok] → TikTok API → Log Sheets
                    └── Notif Telegram récap

DM REÇU (temps réel)
    Webhook Meta
        └── Extraire message
            └── Claude (analyse + répond + score 0-10)
                └── [hors sujet] → Ignorer
                └── [pertinent] → Envoyer réponse DM via Meta API
                    ├── [score ≥ 7] → Notif Telegram "Lead chaud !"
                    └── Log Google Sheets
```

---

## Coûts estimés

| Service | Coût mensuel |
|---|---|
| n8n Cloud (starter) | ~20€ |
| n8n self-hosted (VPS 5€) | ~5€ |
| Claude API (sonnet-4-6) | ~3-8€ (selon volume DMs) |
| Meta Graph API | Gratuit |
| TikTok Content API | Gratuit (beta) |
| **Total** | **~25-30€/mois** |

---

## Limites importantes à respecter

### Instagram DMs (API officielle)
- Max 200 DMs automatiques / heure
- Fenêtre de réponse : 7 jours après le dernier message du contact
- Obligation d'avoir un bouton opt-out dans le premier message
- Pas de mass-DM à des gens qui ne t'ont pas écrit en premier

### TikTok
- Content Posting API en beta — instable, peut changer
- Les Reels/vidéos nécessitent une URL vidéo MP4 hébergée publiquement
- Solution : générer les scripts avec Claude, créer les vidéos avec CapCut/Canva, héberger sur Supabase Storage

### Snapchat
- Pas d'API DM → non automatisé
- Stratégie manuelle : poster les Snaps depuis l'app, rediriger vers Instagram dans le lien

---

## Maintenance

### Renouveler le token Meta (tous les 60 jours)
```bash
curl "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=TOKEN_60J"
```
Mettre à jour la credential `Meta Graph API Token` dans n8n.

### Surveiller les executions
n8n → Executions → filtrer par workflow → vérifier les erreurs

### Ajuster le prompt Claude
Si les réponses DM ne correspondent pas au ton souhaité, modifier le `system` prompt dans le node "Claude — Analyse et répond" du workflow 2.

---

## FAQ

**Q : Les vidéos TikTok sont-elles générées automatiquement ?**
Non. Claude génère le script et le texte. La création vidéo reste manuelle (CapCut, Canva, etc.). Le workflow poste automatiquement une fois la vidéo créée et uploadée.

**Q : Claude peut-il répondre aux commentaires Instagram ?**
Oui, avec un workflow similaire. S'abonner au champ `feed` dans le webhook Meta au lieu de `messages`.

**Q : Que se passe-t-il si Claude est indisponible ?**
n8n gère les retries automatiquement (3 tentatives par défaut). Si l'échec persiste, une notification d'erreur est envoyée (configurer un Error Workflow dans les settings).

**Q : Est-ce que ça risque de faire bannir le compte Instagram ?**
Non, si tu utilises l'API officielle Meta et respectes les limites. Contrairement à ManyChat qui peut parfois pousser les limites, ici tout passe par l'API officielle.

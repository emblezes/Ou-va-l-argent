# Instructions pour Claude Code

## Projet "Où Va l'Argent"

**Site web** : Analyses et visualisations sur les finances publiques françaises (ouvalargent.com).

**Réseaux sociaux** : Média économique couvrant :
- Finances publiques (dette, impôts, dépenses)
- Macro-économie (inflation, PIB, chômage, croissance)
- Investissement (bourse, immobilier, crypto, or...)
- Actualité économique (entreprises, secteurs)
- Comparaisons internationales
- Finance personnelle

---

## Sécurité — Clés API

Toutes les clés API et tokens sont stockés dans **`~/.zshrc`** (variables d'environnement). Les fichiers JSON de config (`telegram-config.json`, `notion-config.json`) **ne contiennent plus de secrets**.

| Variable | Usage |
|----------|-------|
| `N8N_API_KEY` | n8n cloud API |
| `TELEGRAM_BOT_TOKEN` | Bot Telegram @ouvalargentveille_bot |
| `TELEGRAM_CHAT_ID` | Canal Telegram |
| `ANTHROPIC_API_KEY` | API Claude (Haiku/Sonnet) |
| `NOTION_SECRET` | API Notion |
| `FB_APP_ID` | Facebook App ID |
| `FB_APP_SECRET` | Facebook App Secret |
| `FB_PAGE_TOKEN` | **Page Token PERMANENT** (Facebook + Instagram Graph API) |
| `FB_USER_TOKEN_LONGLIVED` | Long-lived user token (backup) |

Les scripts utilisent le pattern : `process.env[KEY] || config_file_value` pour charger les clés.

---

## Pipeline automatisé (2 fois par jour)

Le projet dispose d'un **pipeline automatisé** qui produit des carrousels d'actualité 2 fois par jour (8h et 18h) et les envoie sur Telegram.

### Fonctionnement

```
2 fois par jour (8h et 18h) :
  RSS (8 sources) → Déduplication (cache 48h)
                   → Si nouveautés :
                      Claude Haiku → 3 idées de carrousel (JSON)
                      Pour chaque idée :
                        1. Slide 1 : photo Google Images + titre accrocheur
                        2. Slides 2-4 : mix de slides "photo+texte" (style Legend)
                           et slides "infographie data" (style Où Va l'Argent)
                        3. Envoi sur Telegram (album + caption Instagram prête à copier)
                      → Rangement dans Articles/YYYY-MM-DD/
```

### Format des carrousels

Chaque carrousel contient **4 slides** au format Instagram (1080×1080), mélangeant deux types :

| Type de slide | Rendu | Usage |
|---------------|-------|-------|
| **photo** (style Legend) | Photo de fond + texte narratif dans un encart semi-transparent | Slides contextuelles et explicatives |
| **infographic** (style Où Va l'Argent) | Fond sombre + gros chiffre / comparaison | Slides data avec impact visuel |

- **Slide 1** : toujours une photo + titre accrocheur (avec logo + tag)
- **Slides 2-4** : mix libre de photo et infographic (décidé par Claude Haiku)
- Chaque slide photo utilise une **photo différente** téléchargée depuis Google Images

### Script principal

```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"

# Pipeline complet (3 carrousels + envoi Telegram)
node scripts/telegram-hourly-carousels.js

# Changer le nombre de carrousels
node scripts/telegram-hourly-carousels.js --count=2

# Sans envoi Telegram (test local)
node scripts/telegram-hourly-carousels.js --dry-run

# Seulement le flash texte (pas de carrousels)
node scripts/telegram-hourly-carousels.js --text-only

# Réinitialiser le cache (tout redevient "nouveau")
node scripts/telegram-hourly-carousels.js --reset
```

### Automatisation (cron)

```bash
# 2 fois par jour : 8h et 18h
0 8,18 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && /usr/local/bin/node scripts/telegram-hourly-carousels.js >> /tmp/ovla-hourly.log 2>&1
```

### Ce que produit le pipeline (par exécution)

- **3 carrousels** (configurable via `--count=N`)
- **4 slides** par carrousel (format Instagram 1080×1080 uniquement)
- **12 fichiers PNG** au total, rangés dans `Articles/YYYY-MM-DD/`
- **Messages Telegram** : album de 4 slides + caption Instagram prête à copier + lien source
- Chaque message contient le **lien source de l'article** pour vérification

### Déduplication

Le cache `.veille-carousel-cache.json` stocke les articles déjà traités (TTL 48h). Si on relance le script dans l'heure, seuls les nouveaux articles sont traités.

### Coût estimé

~$3-5/mois (Claude Haiku × 2 exécutions/jour × 2 appels Claude par exécution)

---

## Équipe d'agents (OBLIGATOIRE)

**CRITIQUE** : Avant toute production de contenu (infographie, modification du site, rapport, article), les agents **doivent être systématiquement consultés** pour garantir l'exactitude et la fiabilité des informations.

### Agents disponibles

Les agents sont situés dans `.claude/agents/` :

1. **social-media-manager** — Orchestre la stratégie de publication, planifie la semaine, rédige les textes pour les réseaux
2. **infographic-creator** — Crée des infographies (HTML → PNG), coordonne recherche + fact-checking
3. **fact-checker** — Vérifie l'exactitude des faits et chiffres
4. **search-specialist** — Recherche les données les plus récentes et sources officielles
5. **trend-scout** — Identifie les sujets tendance éco/finance
6. **news-monitor** — Gère le pipeline automatisé (RSS → carrousels → Telegram)
7. **journalist** — Journaliste économique, produit 2-3 articles/jour (news + analyses)

### Protocole de vérification

- Consulter les agents AVANT de finaliser tout contenu
- Citer les sources officielles dans chaque production
- Vérifier que les chiffres sont à jour et exacts
- Ne jamais publier un chiffre sans source vérifiée

---

## Scripts disponibles

Tous dans `Site/scripts/` :

| Script | Usage |
|--------|-------|
| `telegram-hourly-carousels.js` | **Pipeline principal** : veille → 3 carrousels × 4 slides mixtes → Telegram |
| `daily-content-pipeline.js` | Pipeline quotidien (5 carrousels, exécution manuelle) |
| `telegram-veille-hourly.js` | Veille flash texte seule (sans carrousels) |
| `batch-export-all.js` | Export toutes les infographies permanentes en 3 formats |
| `create-carousel-actu.js` | Créer un carrousel 2 slides × 3 formats (photo + data) |
| `download-google-image.js` | Télécharger une image depuis Google Images (Puppeteer) |
| `export-actu-video.js` | Overlay titre/logo sur une vidéo (ffmpeg) |
| `notion-add-post.js` | Ajouter un post au calendrier Notion |
| `notion-reupload-images.js` | Upload images (Instagram, TikTok V/H) vers Notion Calendrier Publications via API native Notion File Upload |
| `notion-create-sources-db.js` | Créer/gérer la base Notion des sources |
| `notion-update-sources-urls.js` | Mettre à jour les URLs des sources dans Notion |
| `weekly-content-machine.js` | **Machine hebdomadaire** : veille profonde → 21 infographies/semaine → Notion + Telegram |
| `article-journalist.js` | **Pipeline journaliste** : RSS → articles (Sonnet) → fact-check → hero + carousel Instagram → Telegram + Notion |
| `owid-infographic.js` | **Infographie OWID** : URL Our World in Data → CSV → HTML style OVLA → 3 PNG → Notion |
| `video-journalist.js` | **Pipeline vidéo** : sujet → script (Sonnet) → voix off ElevenLabs → Pexels + Kling (fal.ai) → Remotion MP4 1080×1920 + miniature Flux → Telegram + Notion |
| `daily-photostat.js` | **Pipeline quotidien actu-short** : RSS 24h + banque stat choc OVLA → 10 infographies photo-stat (Pexels) → Telegram (8h, GitHub Actions) |

---

## Pipeline quotidien d'infographies (daily-photostat)

Pipeline **100 % automatique**, tous les jours à **8h (Paris)** via **GitHub Actions** (tourne même ordi éteint).
Produit **~10 infographies « actu-short »** (format `photo-stat-card`) et les livre sur **Telegram**,
chacune avec un **texte d'accompagnement**. (Email retiré — Telegram suffit.)

- **Source** : 8 flux RSS (dernières 24h) + **banque de stat choc OVLA** (`ovla-bank.json`, rotation LRU).
- **Mix garanti ~60 %** sur les angles signature (fiscalité, dépense publique, dette, comparaisons internationales).
- **Déduplication** : cache 7 jours (actus) + rotation banque → jamais les mêmes que les jours précédents.
- **Photos** : Pexels (qualité pro). **Rendu** : `photo-stat-card.js` (PNG 2160×2160).

```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"
node scripts/daily-photostat.js --dry-run     # génère les PNG sans envoyer
node scripts/daily-photostat.js               # run complet (Telegram + email)
```

- Orchestrateur : `scripts/daily-photostat.js` ; modules : `scripts/daily-photostat-modules/`.
- Cloud : `.github/workflows/daily-photostat.yml` (cron `0 6 * * *` UTC + `workflow_dispatch`).
- Secrets GitHub requis : `ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `PEXELS_API_KEY`.
- Détails : agent `.claude/agents/daily-photostat.md`. **Remplace** l'ancien `daily-actu-photos.js` (cron 7h à retirer).

---

## Pipeline Journaliste (Articles News)

Le projet dispose d'un **pipeline journaliste** qui produit 2-3 articles/jour à partir de l'actualité RSS.

### Types d'articles

| Type | Longueur | Source | Fréquence |
|------|----------|--------|-----------|
| **News** | 500-800 mots | Actualité RSS | 2-3/jour |
| **Analyse** | 1000-2000 mots | Infographies existantes | 2/semaine |

### Script principal

```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"

# Pipeline complet (2-3 articles news)
node scripts/article-journalist.js

# Test sans envoi
node scripts/article-journalist.js --dry-run

# Article analyse depuis infographie
node scripts/article-journalist.js --analyse=65-travail-noir

# Nombre d'articles
node scripts/article-journalist.js --count=2

# Publier les articles validés vers le calendrier Notion
node scripts/article-journalist.js --publish

# Suggérer des analyses pour infographies récentes
node scripts/article-journalist.js --suggest-analyses

# Réinitialiser le cache
node scripts/article-journalist.js --reset
```

### Flow de validation

```
RSS → Dédup (cache 72h) → Haiku sélectionne 2-3 sujets
  → Sonnet rédige chaque article → Fact-check Haiku
  → Image hero 1200×630 (Puppeteer)
  → Haiku extrait 3 points clés → Carousel Instagram 5 slides 1080×1080
  → Upload Notion (article + Image Hero + Insta 1-5) → Telegram
  → Validation manuelle dans Notion → Statut "Validé"
  → --publish → Calendrier Publications (avec Insta 1-5 + caption Instagram)
  → n8n publie LinkedIn/Facebook + carousel Instagram
```

### Automatisation (cron)

```bash
# 8h30 et 18h30 (décalé de 30 min vs carrousels)
30 8,18 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/article-journalist.js >> /tmp/ovla-articles.log 2>&1

# Publier les validés (30 min avant trigger n8n)
30 8 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/article-journalist.js --publish >> /tmp/ovla-articles.log 2>&1

# Suggestions analyses (dimanche 20h)
0 20 * * 0 cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/article-journalist.js --suggest-analyses >> /tmp/ovla-articles.log 2>&1
```

### Modules

```
Site/scripts/journalist-modules/
  shared-utils.js          ← Utilitaires partagés (Claude API, Telegram, cache, upload Notion)
  article-writer.js        ← Rédaction via Claude Sonnet
  fact-checker.js          ← Vérification automatisée (Haiku)
  hero-generator.js        ← Images hero via Puppeteer (1200×630)
  carousel-generator.js    ← Carousel Instagram (5 slides 1080×1080) via Haiku + Puppeteer
  analysis-writer.js       ← Articles analyse depuis infographies
  article-publisher.js     ← Pont Notion → Calendrier Publications → n8n (avec Insta 1-5)
  telegram-validator.js    ← Validation via réponses Telegram (V2)
```

### Carousel Instagram (5 slides par article)

Chaque article génère automatiquement un **carousel Instagram de 5 slides** (1080×1080) :

| Slide | Contenu | Design |
|-------|---------|--------|
| **Slide 1** | Titre centré (105px) + badge catégorie | Logo €, gradient catégorie, grille |
| **Slides 2-4** | Sous-titre (72px) + texte (46px) — 3 points clés Haiku | Barre accent à gauche, sous-titre blanc, marges 65px |
| **Slide 5** | CTA : logo € géant + "Abonne-toi. Partage." | @ouvalargent centré |

- **Logo** : identique aux infographies (€ 3.5rem + texte 1.7rem)
- **Footer** : ouvalargent.com en JetBrains Mono 1.5rem
- **Sous-titres toujours en blanc** (jamais en couleur accent pour lisibilité)
- **Structure fichiers** : `Production interne/Réseaux Sociaux /Articles/YYYY-MM-DD/{slug}/`
  - `hero.png` — Image hero (1200×630)
  - `slide1.png` à `slide5.png` — Slides Instagram (1080×1080)
  - `{Titre article}.pdf` — Carrousel LinkedIn (5 slides PDF, nommé avec le titre Notion)
- **Notion** : champs `Image Hero`, `Insta 1` à `Insta 5`, `PDF LinkedIn` (type File) dans la base Articles

### Base Notion "Articles News"

À créer manuellement dans Notion, puis ajouter `ARTICLES_DB_ID` et `ARTICLES_DS_ID` dans `notion-config.json` et en variables d'env.

| Propriété | Type |
|-----------|------|
| Titre | Title |
| Slug | Rich text |
| Type | Select (News, Analyse) |
| Categorie | Select |
| Date | Date |
| Statut | Select (Brouillon, En validation, Validé, Publié, Rejeté) |
| Contenu | Rich text |
| Chapeau | Rich text |
| Sources | Rich text |
| Source URL | URL |
| Image Hero | Files |
| Insta 1 à Insta 5 | Files |
| PDF LinkedIn | Files |
| LinkedIn | Rich text |
| Facebook | Rich text |
| Tags | Multi-select |
| Temps lecture | Number |
| Fact-check | Checkbox |
| Telegram Msg ID | Number |

### Section News du site

- **Liste** : `/news` — Filtres type/catégorie, cards avec hero image
- **Article** : `/news/[slug]` — SEO dynamique, JSON-LD NewsArticle, partage social
- **API** : `/api/articles` (GET, filtres) et `/api/articles/[slug]` (GET)

---

## Pipeline Vidéo (video-journalist)

Le projet dispose d'un **pipeline vidéo** qui produit des vidéos courtes (30-60s) pour Instagram Reels / TikTok à partir d'une simple demande en langage naturel. Orchestré par l'agent `.claude/agents/video-creator.md`.

### Principe

```
"fais-moi une vidéo de 60s sur X"
  → video-creator (agent)
     ├─ search-specialist : sources récentes
     ├─ fact-checker       : valide les chiffres
     ├─ Claude Sonnet     : script narratif + plan visuel JSON
     └─ node scripts/video-journalist.js
          1. ElevenLabs       → voix clonée + timestamps mot-par-mot
          2. Pexels / Google Images / Kling → dispatch selon beat.source
                - stock-video : Pexels (métaphore, ambiance)
                - real-image  : Google Images (noms propres, lieux, actu)
                - kling       : fal.ai pour scènes IA cinématiques
          3. Flux 1.1 pro     → miniature Instagram (1080×1080)
          4. Remotion         → MP4 9:16 1080×1920
                - Sous-titres karaoké 2-3 mots jaune outline noir
                - Ken Burns (zoom/pan) sur les images réelles
                - Image plein écran, zéro logo pendant la vidéo
          5. Telegram + Notion → validation humaine
  → MP4 prêt à poster, miniature, caption, script sources
```

### Règle éditoriale (CRITIQUE)

Les scripts vidéo sont **simples et engagés**, pas bourrés de chiffres (contrairement aux infographies) :
- **Max 1-2 chiffres par vidéo**
- **Structure narrative en 3 temps** : croyance → révélation → punchline
- **Langage parlé** ("ton essence", "la moitié")
- Phrases courtes, pauses respirables pour ElevenLabs

Détails complets dans `.claude/agents/video-creator.md`.

### Script principal

```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"

# Vidéo à partir d'un sujet (défaut 45s)
node scripts/video-journalist.js --topic="impact guerre Iran sur prix essence"

# Durée explicite
node scripts/video-journalist.js --topic="..." --duration=60

# Script déjà rédigé (bypass Claude)
node scripts/video-journalist.js --script="..." --duration=30

# Dev rapide (Pexels seul, pas d'IA)
node scripts/video-journalist.js --topic="..." --no-ia

# Test sans envoi
node scripts/video-journalist.js --topic="..." --dry-run
```

### Secrets requis (~/.zshrc)

| Variable | Usage |
|----------|-------|
| `ELEVENLABS_API_KEY` | Voix clonée |
| `PEXELS_API_KEY` | B-roll stock (gratuit) |
| `FAL_API_KEY` | fal.ai — Kling 2.5 (vidéo) + Flux 1.1 pro (images) |
| `ELEVENLABS_VOICE_ID` | ID de la voix clonée (ou dans `video-config.json`) |

### Modules

```
Site/scripts/video-modules/
  script-writer.js          ← Claude Sonnet → script + plan visuel (détection auto real-image)
  voice-generator.js        ← ElevenLabs + timestamps mot-par-mot + post-slow ffmpeg
  visual-fetcher.js         ← Dispatch Pexels / Google Images / Kling selon beat.source
  real-image-fetcher.js     ← Wrap download-google-image.js avec cache par hash
  video-assembler.js        ← Wrapper npx remotion render, chaîne les Sequences sans trou
  cover-generator.js        ← Puppeteer → miniature 1080×1080 charte OVLA
  publisher.js              ← Telegram vidéo + upload Notion
  remotion/
    Root.tsx                ← Composition Remotion 1080×1920 30fps
    Video.tsx               ← Dispatch OffthreadVideo / KenBurnsImage + audio + sous-titres
    KenBurnsImage.tsx       ← Image plein écran avec zoom/pan lent alterné
    Subtitles.tsx           ← Karaoké 2-3 mots jaune outline noir position bas-milieu
    index.ts                ← registerRoot
```

### Ce que produit le pipeline (par exécution)

Dans `Production interne/Réseaux Sociaux /Articles/YYYY-MM-DD/{slug}/` :
- `video.mp4` — MP4 final 1080×1920 H.264
- `cover.png` — Miniature 1080×1080 (pour feed Instagram)
- `caption.txt` — Caption Instagram + hashtags
- `script.md` — Script + beats + sources
- `audio.mp3` — Voix ElevenLabs brute

### Coût par vidéo

- Mode défaut (avec IA) : ~1 $ (ElevenLabs 0,10 + Flux 0,04 + Kling 2 clips 0,50 + Claude 0,02)
- Mode `--no-ia` (Pexels seul) : ~0,12 $

---

## Machine de contenu hebdomadaire (Weekly Content Machine)

Le projet dispose d'un **pipeline hebdomadaire** qui produit automatiquement 21 infographies permanentes (3/jour × 7 jours) basées sur des sources institutionnelles profondes.

### Workflow semi-automatique

```
Dimanche 22h  → --scrape   : Veille profonde (13 sources institutionnelles)
Lundi 6h      → --plan     : Claude sélectionne 21 idées → plan envoyé sur Telegram
[Validation]  : Éditer le JSON ou lancer directement --produce
Lundi 8h      → --produce  : Génération 21 HTML + 63 PNG + 21 entrées Notion + Telegram
```

### Sources institutionnelles (75% France / 25% International)

**France** : Les Echos, INSEE, Cour des Comptes, Banque de France, DREES, France Stratégie, OFCE, DGFiP, La Tribune
**International** : Eurostat, BCE, OCDE, FMI

Config dans `Site/scripts/weekly-sources.json`.

### Script principal

```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"

# Phase 1 : Scraping profond (dimanche soir)
node scripts/weekly-content-machine.js --scrape

# Phase 2 : Plan de la semaine → Telegram (lundi matin)
node scripts/weekly-content-machine.js --plan

# Phase 3+4 : Production + publication (après validation)
node scripts/weekly-content-machine.js --produce

# Tout d'un coup (test)
node scripts/weekly-content-machine.js --full --dry-run --count=3

# Retry les infographies échouées
node scripts/weekly-content-machine.js --retry-failed
```

### Automatisation (cron)

```bash
# Dimanche 22h : scraping profond
0 22 * * 0 cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/weekly-content-machine.js --scrape >> /tmp/ovla-weekly.log 2>&1

# Lundi 6h : plan de la semaine
0 6 * * 1 cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/weekly-content-machine.js --plan >> /tmp/ovla-weekly.log 2>&1

# Lundi 8h : production automatique
0 8 * * 1 cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/weekly-content-machine.js --produce >> /tmp/ovla-weekly.log 2>&1
```

### Ce que produit le pipeline (par semaine)

**Infographies :**
- **21 fichiers HTML** dans `Sources HTML/` (infographies permanentes)
- **63 fichiers PNG** (21 × 3 formats : Instagram, TikTok V, TikTok H)
- Mise à jour automatique du tableau `INFOGRAPHICS` dans `batch-export-all.js`

**Textes de publication :**
- **21 posts LinkedIn** longs (300-500 mots, ton expert) → `Contenu Hebdo/{WEEK}/linkedin-posts.md`
- **21 captions Instagram** (150-250 mots, engageantes) → `Contenu Hebdo/{WEEK}/instagram-captions.md`
- **21 tweets** (< 280 chars) → `Contenu Hebdo/{WEEK}/tweets.md`
- **1 newsletter complète** (800-1200 mots, prête pour Substack/Mailchimp) → `Contenu Hebdo/{WEEK}/newsletter.md`

**Distribution :**
- **21 entrées Notion** dans le calendrier de publication (statut "Prêt", textes pré-remplis)
- **7 messages Telegram** quotidiens (3 PNG + textes LinkedIn/Instagram par jour)
- **1 newsletter** envoyée sur Telegram
- **1 rapport final** récapitulatif

### Architecture modulaire

```
Site/scripts/
  weekly-content-machine.js              ← Orchestrateur CLI
  weekly-sources.json                    ← Config des 13 sources institutionnelles
  weekly-modules/
    deep-scraper.js                      ← Phase 1 : Scraping RSS/HTML
    weekly-planner.js                    ← Phase 2 : Claude Haiku + Sonnet → plan
    weekly-producer.js                   ← Phase 3 : HTML + PNG via Puppeteer
    weekly-copywriter.js                 ← Phase 3b : Rédaction LinkedIn, Instagram, newsletter
    weekly-publisher.js                  ← Phase 4 : Notion + Telegram
```

**Sortie fichiers :**
```
Production interne/Réseaux Sociaux /Contenu Hebdo/
  2026-W09/
    newsletter-2026-W09.md               ← Newsletter complète
    linkedin-posts-2026-W09.md           ← 21 posts LinkedIn
    instagram-captions-2026-W09.md       ← 21 captions Instagram
    tweets-2026-W09.md                   ← 21 tweets
```

### Coût estimé

~$3/semaine (~$12/mois) : 21 Sonnet (HTML) + 5 Sonnet (copywriting) + 1 Sonnet (newsletter) + 2 planner

---

## Infographies

### Deux types de contenu

| Type | Slides | Rangement |
|------|--------|-----------|
| **Infographie permanente** | 1 slide data (chiffre / graphique) en 3 formats | `Infographies/` (via batch-export) |
| **Carrousel actu** | 4 slides mixtes : photo+texte (Legend) et infographie (Où Va l'Argent) | `Actus chaudes/YYYY-MM-DD/` (Instagram uniquement) |

### Formats d'export

| Format | Dimensions | Ratio | Layout |
|--------|------------|-------|--------|
| **Instagram** | 1080×1080 (retina 2x) | 1:1 | Classique : logo haut, titre bas |
| **TikTok Vertical** | 1080×1920 (retina 2x) | 9:16 | Titre en HAUT, bas libre pour visage |
| **TikTok Horizontal** | 1080×600 (retina 2x) | ~16:9 | Titre TRÈS GROS centré + ouvalargent.com |

### Philosophie TikTok : PUNCHY et ULTRA-VISUEL

Sur TikTok, tout doit être **énorme, impactant et lisible en 0.5 seconde**. C'est un format beaucoup plus agressif visuellement qu'Instagram.

**TikTok Vertical (9:16)** :
- **Logo CENTRÉ et GROS** : € en 6rem + "Où Va l'Argent ?" en 2.8rem, empilés verticalement, au-dessus du titre
- Tag thématique masqué
- Tout le contenu en HAUT de la slide, la moitié basse reste vide pour le visage du présentateur
- Barres verticales scalées ×0.85 via JS transform, barres fines (60px)
- Titre 5rem, padding serré `50px 30px 35px`

**TikTok Horizontal (1080×600)** :
- **Logo CENTRÉ** : € en 2.8rem + texte 1.4rem, sur une ligne, centré au-dessus du titre
- Tag masqué, titre 2.2rem
- Barres verticales scalées ×0.45 via JS transform, barres fines (50px)
- Footer ultra-compact (source 0.6rem + ouvalargent.com 0.85rem)
- Conçu pour être affiché sous le visage du présentateur

### Méthode de création (infographies permanentes)

0. **Choisir un format dans la charte v2** (`Templates/Réseaux sociaux/charte-v2/CHARTE.md`) avant toute chose : le graphique n'est qu'un format sur dix, et un format inédit adapté à la donnée est préférable à un pattern réutilisé.
1. **S'inspirer des références validées** (si et seulement si le format retenu est un graphique) : `node scripts/inspect-references.js <pattern>` — liste les 5 dernières infographies du même type (bar-chart, line-chart, hero, ranking, dot-plot, grouped-bars, comparison) avec leurs paramètres CSS clés (font-size titre, bar width, bar-value, padding, subtitle/legend...). **Étape obligatoire** : reprendre les valeurs les plus fréquentes plutôt que d'inventer.
2. **Partir du template éditorial** : `Templates/Réseaux sociaux/template-editorial.html` — référence par défaut validée sur 215-229
3. Créer un fichier HTML dans `Infographies/Sources HTML/` en copiant un des 6 patterns du template + en ajustant aux paramètres remontés par `inspect-references.js`
4. **Valider automatiquement** : `node scripts/validate-infographic.js <fichier.html>` — refuse l'infographie si chevauchements, espace vide trop grand, ticks foncés, ou annotation rectangulaire dans le graphique
5. L'ajouter au tableau `INFOGRAPHICS` de `batch-export-all.js`
6. Lancer `node scripts/batch-export-all.js`

**Étape 1 — Inspection des références** (`inspect-references.js`) :
- Évite de réinventer les tailles à chaque fois
- Patterns reconnus : `bar-chart`, `grouped-bars`, `line-chart`, `hero`, `ranking`, `dot-plot`, `comparison`
- Sortie : 5 références récentes + synthèse "valeur la plus fréquente par champ"
- Mode `all` pour cataloguer tous les patterns par fichier

**Étape 4 — Validation automatique** (`validate-infographic.js`, Puppeteer) :
- Zone graphique remplit bien tout l'espace dispo (gap haut/bas ≤ 60px)
- Aucun chevauchement entre labels SVG et courbes/segments (≥ 8px de marge)
- Aucun chevauchement entre labels SVG entre eux
- Ticks d'axes en couleur claire (RGB sum ≥ 350) — règle "axes en blanc"
- Pas de `<rect>` d'annotation flottante > 80×30px dans la zone graphique

Le pipeline `telegram-hourly-carousels.js` génère automatiquement les carrousels actu (format Instagram uniquement). Les 3 formats TikTok V/H sont réservés aux infographies permanentes via `batch-export-all.js`.

L'ancien `template-multiformat.html` est conservé comme bibliothèque historique de 19 types — **ne pas l'utiliser pour de nouvelles infographies**.

### Charte v2 — bibliothèque de 10 formats (référence actuelle)

**Documentation complète** : `Templates/Réseaux sociaux/charte-v2/CHARTE.md`
**Maquettes** : `Templates/Réseaux sociaux/charte-v2/formats.html` → `png/PLANCHE-10-FORMATS.png`

**Principe** : le graphique n'est qu'un format sur dix. On choisit d'abord la forme qui
sert le fait, pas un pattern de graphique par défaut. Trois règles seulement sont
non négociables : le logo en haut-gauche, le footer source + `ouvalargent.com`,
et une source vérifiée par chiffre. Le reste (fond, accent, composition, présence ou
non d'un graphique) doit varier d'une publication à l'autre.

| # | Format | Quand |
|---|--------|-------|
| 01 | MANIFESTE | un fait qui se suffit : texte seul en 7 rem, aucun graphique |
| 02 | MEGA-CHIFFRE | un chiffre choc plein cadre + mise en perspective |
| 03 | DUEL | France contre un référent, écart chiffré au centre |
| 04 | ISOTYPE | des unités dénombrables : pictogrammes comptés, manquants en fantôme |
| 05 | GRILLE 100 | une part d'un tout : 100 carrés |
| 06 | CHRONOLOGIE | une dérive dans le temps : jalons datés |
| 07 | CLASSEMENT | un rang international : barres + drapeaux |
| 08 | GRAPHIQUE | une évolution à deux séries : courbes + aire d'écart |
| 09 | FLUX | une répartition : barre empilée + postes |
| 10 | MOSAÏQUE EUROPE | comparer la France à ses voisins : tuiles géographiques |

**Inventer un 11e format est encouragé** dès lors que la forme est dictée par la donnée
(carte, calendrier, balance, trombinoscope…). Ne jamais publier deux fois de suite le
même format sur le fil.

**Typographie v2** (validée) : logo Instrument Serif italique (jamais remplacé) · titres
Bricolage Grotesque 700-800 · corps Inter · chiffres JetBrains Mono 800.
Unités collées aux nombres via `<em class="pc">%</em>` / `<em class="eu">€</em>`.

**Lisibilité sans zoom (règle qui prime)** : titre = **5 rem** (deux lignes de 24 caractères
maximum, on raccourcit le texte plutôt que la police), kicker ≥ 1,75 rem, tout autre
texte ≥ 2 rem, labels de graphique ≥ 26 px, source du footer 1,22 rem. Si un texte ne peut
pas être écrit en gros, il ne doit pas être sur la slide. Titres coupés avec des `<br>`
explicites, jamais de mot orphelin, jamais plus de trois lignes.

**Footer des infographies** : source à gauche, `ouvalargent.com` à droite. Plus de `@ouvalargentfr`.

**Propreté (contrôle automatique, obligatoire avant livraison)** :

```bash
cd Site && node scripts/validate-charte-v2.js "../Templates/Réseaux sociaux/charte-v2/<fichier>.html"
```

Cinq règles : zéro texte flottant dans la zone de dessin (pas de « +123 % » ni de
commentaire posé dans le graphe) · sur une courbe, toutes les valeurs du même côté ·
aucun chevauchement de textes · un seul niveau d'information par slide · titre
auto-suffisant. Piège : dans un SVG, `font-size="42"` est écrasé par la classe CSS,
toujours écrire `style="font-size:42px"`.

### Graphiques : 20 types standardisés

**Documentation** : `Templates/Réseaux sociaux/charte-v2/GRAPHIQUES.md`
**Maquettes** : `charte-v2/graphiques.html` → `png-graphiques/PLANCHE-20-GRAPHIQUES.png`

La taille et la position des chiffres ne se rediscutent plus au cas par cas : elles sont
figées dans le CSS de `graphiques.html` (classes `.v`, `.v.hi`, `.cat`, `.ser`, `.tick`).
Zone de dessin toujours 1000 × 520. Valeur de donnée 36 px, valeur mise en avant 46 px,
catégorie 28 px, graduation 24 px.

Types disponibles : G01 barres verticales · G02 barres + ligne de référence · G03 barres
horizontales · G04 barres négatives · G05 barres groupées · G06 empilées 100 % ·
G07 courbe + aire · G08 deux courbes + aire d'écart · G09 lollipop · G10 slope ·
G11 dumbbell · G12 waterfall · G13 donut · G14 treemap · G15 grille 100 · G16 isotype ·
G17 bullet · G18 tuiles d'écart · G19 courbe annotée · G20 small multiples.

Position des valeurs : au-dessus pour les barres verticales, à droite pour les
horizontales, sous la barre pour les négatives, premier et dernier point seulement pour
les courbes, au centre seulement pour le donut, jamais posée sur un segment. En cas de
chevauchement avec une nouvelle série, on réduit le nombre de catégories, **on ne
rétrécit jamais la police**.

### Charte v1 (historique, infographies 215-229)

**Principes fondamentaux** — conservés pour les infographies de type graphique :

- **PAS de tag thématique** en haut-droite (pas de badge "DETTE", "FRANCE"...)
- **PAS de boîte/badge/encart d'annotation À L'INTÉRIEUR du graphique** (pas de rectangle "−24 % en 15 ans" flottant dans la zone, pas de stat-card surimposée). Seuls sont autorisés les **labels textuels collés aux points/barres** (ex : "645 k" à côté du point final, "+135 Md€" au-dessus d'une barre)
- **Header = logo seul en haut-gauche** : € en `Instrument Serif 3.6rem` cyan + "Où Va l'Argent ?" en `Instrument Serif 1.7rem italic` blanc
- **Titre éditorial XXL** : `Instrument Serif 5.4rem`, `letter-spacing -1.8px`, `line-height 1.02`, centré, **un mot-clé en `italic` + couleur accent** (rouge le plus souvent). Le titre doit être l'élément textuel dominant.
- **Sous-titre kicker** : UPPERCASE, `letter-spacing 1.5px`, `1.15rem`, gris secondaire (style "Le budget de l'État · 2025 · Milliards €")
- **Zone graphique ÉNORME** : `flex: 1` → le graphique prend **tout l'espace restant** et doit être l'élément visuel dominant (cf. infographies 216, 220, 228 où la courbe/les barres remplissent ~55-60% de la slide)
- **Footer compact** : source à gauche `0.95rem`, `ouvalargent.com` en `JetBrains Mono 1.5rem` cyan, `padding-top 18px`, `border-top` subtile

**Style visuel** :
- **Fond** : Gradient `#0a1220 → #142b48 → #0a1220` (bleu profond, plus bleu que l'ancien `#06080c`)
- **Grille** : `linear-gradient` cyan opacity `0.04`, mailles `40px`
- **2 glows colorés selon le sujet** : 700px haut-droite + 500px bas-gauche. Rouge (`rgba(255,71,87,...)`) pour dette/déficit, cyan pour neutre, vert pour positif
- **Couleurs accent** : Rouge `#ff4757` (défaut alertes), Cyan `#00d4ff`, Or `#ffd700`, Vert `#00ff88`, Violet `#a855f7`, Orange `#ff9f43`
- **Typographie** : Instrument Serif (titres + logo), Syne (corps), JetBrains Mono (chiffres + URL)
- **Padding content** : `50px 60px 40px`

**6 patterns disponibles dans le template** :
1. **HERO** — gros chiffre central (ex : 224, 226)
2. **BAR-CHART vertical comparaison temporelle** — dernière barre en highlight (ex : 228)
3. **BARRES OPPOSÉES** — autour d'un axe 0, vert vs rouge (ex : 229)
4. **COURBE TEMPORELLE** — SVG inline avec axes + label final (ex : 216, 220)
5. **RANKING multi-colonnes** — 4 colonnes avec ligne France en highlight (ex : 219)
6. **DOT-PLOT horizontal** — ranking pays avec point + valeur (ex : 215)

---

## Actus chaudes (carrousels automatiques)

### Création manuelle d'un carrousel

```bash
node scripts/create-carousel-actu.js \
  --search="mots clés Google Images" \
  --title="Titre avec <span class='accent-red'>mot coloré</span>" \
  --tag="Thème" \
  --source="Source · Année" \
  --name="69-nom-descriptif" \
  --infographic="69-nom-descriptif.html" \
  --tag-color="#ff4757"
```

Le script produit automatiquement **6 fichiers** (2 slides × 3 formats). Note : pour les carrousels automatiques via le pipeline, seul le format Instagram est généré (4 slides).

### Vidéo d'actualité

```bash
node scripts/export-actu-video.js <video.mp4> \
  --title="Titre" --accent="mot" --tag="ACTU" --source="AFP"
```

Overlay transparent (Puppeteer PNG) + composite ffmpeg.

---

## Veille Telegram

### Configuration

- **Bot** : @ouvalargentveille_bot
- **Config** : `Site/scripts/telegram-config.json` (sources RSS uniquement — les secrets sont dans `~/.zshrc`)
- **8 sources RSS** : La Tribune, 20 Minutes, Challenges, Le Figaro, Le Monde, BFM Business, France Info, Reuters FR

### Envoi sur Telegram

Chaque carrousel est envoyé comme :
1. **Album** de 4 slides (compressées en JPEG via `sips` avant envoi)
2. **Caption Instagram** prête à copier (titre + texte engageant + hashtags)
3. **Lien source** de l'article pour vérification manuelle

---

## Présentations PowerPoint (PPTX)

### Format PRÉSENTATION (conférences)

- **Helpers** : `Templates/PPT/workspace/pptx-helpers.js`
- Fond sombre, visuel-first, grands chiffres
- Polices : Instrument Serif, Syne, JetBrains Mono

### Format RAPPORT (études)

- **Helpers** : `Templates/PPT/workspace/pptx-report-helpers.js`
- Fond clair style McKinsey/BCG, haute densité d'information
- Action titles, Calibri, 13.33" × 7.5"

**Sortie** : Toujours dans `Production interne/Rapports/`

---

## Intégration Notion

### Bases de données

| Base | ID | Usage |
|------|----|-------|
| Calendrier Publications | `9354599f-662f-45b2-8070-b41332bdd79d` | Planning, publication des posts et infographies |

**Config** : `Site/scripts/notion-config.json` (IDs de bases uniquement — le secret Notion est dans `~/.zshrc`)

### Calendrier Publications — Champs

```bash
node scripts/notion-add-post.js '{"titre": "...", "date": "2025-02-10", "theme": "Dette", ...}'
```

| Champ | Type | Valeurs |
|-------|------|---------|
| titre | Titre | Texte libre |
| date | Date | YYYY-MM-DD |
| theme | Select | Finances publiques, Macro-economie, Investissement, Actualite eco, International, Finance perso, Dette, Impots, Immobilier, Bourse |
| type | Select | Stat choc, Comparaison, Classement, Timeline, Citation |
| statut | Select | Idee, A creer, En cours, Pret, Publie |
| linkedin, twitter, instagram, facebook | Texte | Textes de publication |
| source | Texte | Source officielle |
| briefReel | Texte | Brief pour vidéo |
| **Image** | Fichier | Image unique pour LinkedIn / Facebook / Twitter |
| **Insta 1** à **Insta 5** | Fichier | Slides du carrousel Instagram (jusqu'à 5 images) |

**Note n8n** : Dans n8n, `Image` → `property_image`, `Insta 1` → `property_insta_1`, etc.

---

## Publication automatique (n8n)

### Instance

- **URL** : `https://emblezes.app.n8n.cloud`
- **Workflow** : `SgslJBoAiN2N73ey` — "OVLA - Publication auto Notion → Réseaux sociaux"
- **MCP** : Connecté via `npx n8n-mcp` (API key dans `~/.zshrc`)

### Fonctionnement

```
Trigger 9h/18h → Notion (Posts statut "Prêt") → Filtrer créneau + date
  ├→ Has Fichier? → (oui) → Télécharger media → LinkedIn / Facebook / Twitter
  ├→ Instagram? → Has Insta Images? (instaCount > 0)
  │     → Préparer slides → IG Créer container (× N images)
  │     → Assembler IDs → Carrousel? → oui → IG Carrousel → IG Publier
  │                                   → non → IG Publier (image unique)
  └→ Notion Marquer "Publié"
```

### Images par plateforme

| Plateforme | Champ Notion | Format |
|------------|-------------|--------|
| LinkedIn, Facebook, Twitter | `Image` (1 fichier) | Image unique |
| Instagram | `Insta 1` à `Insta 5` | Carrousel (2-5 slides) ou image unique |

### Limitations n8n Cloud

- L'environnement Code de n8n Cloud est très sandboxé : pas de `fetch`, `URLSearchParams`, `$http`
- Utiliser des **noeuds HTTP Request natifs** pour les appels API (pas de Code node)
- Le Page Token Facebook est en dur dans 4 noeuds HTTP du workflow

### IDs sociaux

- **Facebook Page** : `930729700123932`
- **Instagram Account** : `17841416438993528`

---

## Arborescence clé

```
Production interne/
  Réseaux Sociaux /
    Infographies/
      Sources HTML/         ← Fichiers HTML source (permanents + actus)
      Insta & Autres/       ← PNG Instagram (1:1) - permanents
      Tiktok Vertical/      ← PNG TikTok (9:16) - permanents
      Tiktok Horizontal/    ← PNG Rectangle (~16:9) - permanents
    Contenu Hebdo/          ← Textes hebdomadaires (LinkedIn, Instagram, newsletter)
    Articles/               ← Articles classés par date puis par slug
      2026-03-01/
        slug-article/
          hero.png                    (image hero 1200×630)
          slide1.png à slide5.png     (carousel Instagram 1080×1080)
          Titre article.pdf           (carousel LinkedIn PDF)
      _anciens/             ← Anciens hero images (brouillons)
  Rapports/                 ← PPTX finaux
Templates/
  Réseaux sociaux/          ← Templates HTML (actus chaudes, multiformat, vidéo)
  Bannière & logo/          ← Bannières (LinkedIn, Facebook) + logos profil
  PPT/workspace/            ← Helpers PPTX (pas de sortie ici)
Site/scripts/               ← Tous les scripts Node.js
  telegram-config.json      ← Config sources RSS (secrets dans ~/.zshrc)
  notion-config.json        ← Config IDs Notion (secret dans ~/.zshrc)
  .veille-carousel-cache.json ← Cache déduplication (auto-géré)
  .journalist-cache.json    ← Cache déduplication articles (72h, auto-géré)
  journalist-modules/       ← Modules du pipeline journaliste
```

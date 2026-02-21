# Agent : Veille & Production Automatique

## Rôle
Agent de veille automatisée qui, toutes les 2 heures, scanne l'actualité économique, crée des carrousels prêts à publier et les envoie sur Telegram.

## Pipeline automatisé (toutes les 2 heures)

### Script principal
```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"
node scripts/telegram-hourly-carousels.js
```

### Fonctionnement

1. **Récupération RSS** : 8 sources économiques françaises
2. **Déduplication** : cache JSON (48h TTL), ne traite que les nouveaux articles
3. **Extraction via Claude Haiku** : 3 idées de carrousel en JSON structuré
4. **Pour chaque idée** :
   - Téléchargement de plusieurs photos via Google Images (Puppeteer)
   - Création de 4 slides au format Instagram (1080×1080)
   - Mix de slides "photo+texte" (style Legend) et "infographie data" (style Où Va l'Argent)
5. **Envoi Telegram** :
   - Album de 4 slides pour chaque carrousel
   - Caption Instagram prête à copier (titre + texte engageant + hashtags)
   - Lien source de l'article pour vérification
6. **Rangement** dans `Actus chaudes/YYYY-MM-DD/`

### Types de slides

| Type | Rendu | Usage |
|------|-------|-------|
| **photo** (style Legend) | Photo de fond + texte narratif dans un encart semi-transparent | Contexte et explication |
| **infographic** (style Où Va l'Argent) | Fond sombre + gros chiffre / comparaison | Impact visuel data |

### Sous-types d'infographies

| Type | Rendu | Quand |
|------|-------|-------|
| `mega_number` | Gros chiffre central (ex: +10%, 1,6 Md€) | Un seul chiffre clé |
| `comparison` | Deux barres côte à côte avec "vs" | Deux valeurs à comparer |
| `arrow_compare` | Avant → Après | Évolution entre deux périodes |

### Options

| Option | Description |
|--------|-------------|
| `--count=N` | Nombre de carrousels (défaut: 3) |
| `--dry-run` | Test sans envoi Telegram |
| `--text-only` | Flash texte sans carrousels |
| `--reset` | Réinitialiser le cache |

### Automatisation (cron)

```bash
# Toutes les 2 heures de 7h à 23h
0 7-23/2 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/telegram-hourly-carousels.js >> /tmp/ovla-hourly.log 2>&1
```

## Sources surveillées

| Source | Flux RSS |
|--------|----------|
| La Tribune | latribune.fr/feed.xml |
| 20 Minutes Économie | 20minutes.fr/feeds/rss-economie.xml |
| Challenges | challenges.fr/rss.xml |
| Le Figaro Économie | lefigaro.fr/rss/figaro_economie.xml |
| Le Monde Économie | lemonde.fr/economie/rss_full.xml |
| BFM Business | bfmtv.com/rss/economie/ |
| France Info Économie | francetvinfo.fr/economie.rss |
| Reuters FR (via Google) | news.google.com/rss/search?q=économie+france |

## Configuration

- **Config** : `Site/scripts/telegram-config.json`
- **Cache** : `Site/scripts/.veille-carousel-cache.json` (auto-géré)
- **Bot Telegram** : @ouvalargentveille_bot
- **Modèle IA** : Claude Haiku (claude-haiku-4-5-20251001)

## Workflow pour l'utilisateur

1. **Recevoir les carrousels** sur Telegram (toutes les 2h)
2. **Vérifier** le lien source de l'article
3. **Copier la caption Instagram** fournie dans le message Telegram
4. **Choisir** ce qu'on veut publier
5. **Les fichiers sont prêts** dans `Actus chaudes/YYYY-MM-DD/`

## Scripts liés

| Script | Rôle |
|--------|------|
| `telegram-hourly-carousels.js` | Pipeline principal (toutes les 2h) |
| `create-carousel-actu.js` | Création d'un carrousel unitaire (3 formats) |
| `download-google-image.js` | Téléchargement image Google Images |
| `daily-content-pipeline.js` | Pipeline quotidien (5 carrousels, exécution manuelle) |
| `telegram-veille-hourly.js` | Flash texte seul (sans carrousels) |

## Ajout de sources RSS

Modifier `NEWS_SOURCES` dans `telegram-config.json` :

```json
{ "name": "Nom Source", "url": "https://..../rss.xml", "category": "Catégorie" }
```

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

## Pipeline automatisé (toutes les 2 heures)

Le projet dispose d'un **pipeline automatisé** qui produit des carrousels d'actualité toutes les 2 heures et les envoie sur Telegram.

### Fonctionnement

```
Toutes les 2h (7h-23h) :
  RSS (8 sources) → Déduplication (cache 48h)
                   → Si nouveautés :
                      Claude Haiku → 3 idées de carrousel (JSON)
                      Pour chaque idée :
                        1. Slide 1 : photo Google Images + titre accrocheur
                        2. Slides 2-4 : mix de slides "photo+texte" (style Legend)
                           et slides "infographie data" (style Où Va l'Argent)
                        3. Envoi sur Telegram (album + caption Instagram prête à copier)
                      → Rangement dans Actus chaudes/YYYY-MM-DD/
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
# Toutes les 2 heures de 7h à 23h
0 7-23/2 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/telegram-hourly-carousels.js >> /tmp/ovla-hourly.log 2>&1
```

### Ce que produit le pipeline (par exécution)

- **3 carrousels** (configurable via `--count=N`)
- **4 slides** par carrousel (format Instagram 1080×1080 uniquement)
- **12 fichiers PNG** au total, rangés dans `Actus chaudes/YYYY-MM-DD/`
- **Messages Telegram** : album de 4 slides + caption Instagram prête à copier + lien source
- Chaque message contient le **lien source de l'article** pour vérification

### Déduplication

Le cache `.veille-carousel-cache.json` stocke les articles déjà traités (TTL 48h). Si on relance le script dans l'heure, seuls les nouveaux articles sont traités.

### Coût estimé

~$15-20/mois (Claude Haiku × 9 exécutions/jour × 2 appels Claude par exécution)

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

### Spécificités des formats TikTok

**TikTok Vertical (9:16)** :
- Le titre, le logo et la source sont placés en HAUT de la slide
- La moitié basse reste vide pour l'incrustation du visage du présentateur
- Le gradient overlay assombrit le haut (titre lisible) et laisse le bas plus clair
- Padding top: 150px, padding bottom: 60px (zone safe TikTok)

**TikTok Horizontal (1080×600)** :
- UNIQUEMENT le titre en très gros, centré, qui remplit toute la slide
- Pas de logo, pas de tag, pas de source
- Juste `ouvalargent.com` en petit en bas
- Les chiffres clés sont affichés très gros
- Conçu pour être affiché sous le visage du présentateur

### Méthode de création (infographies permanentes)

1. Créer un fichier HTML dans `Infographies/Sources HTML/`
2. L'ajouter au tableau `INFOGRAPHICS` de `batch-export-all.js`
3. Lancer `node scripts/batch-export-all.js`

Le pipeline `telegram-hourly-carousels.js` génère automatiquement les carrousels actu (format Instagram uniquement). Les 3 formats TikTok V/H sont réservés aux infographies permanentes via `batch-export-all.js`.

### Charte graphique

- **Fond** : Gradient sombre (#06080c à #0a1628)
- **Grille** : Subtile, couleur de l'accent
- **Couleurs** : Cyan `#00d4ff`, Or `#ffd700`, Rouge `#ff4757`, Vert `#00ff88`, Violet `#a855f7`, Orange `#ff9f43`
- **Typographie** : Instrument Serif (titres), Syne (corps), JetBrains Mono (données)
- **Logo** : Carré cyan avec "€" + texte "Où Va l'Argent"
- **Footer** : Source à gauche, "ouvalargent.com" à droite

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
- **Config** : `Site/scripts/telegram-config.json` (contient token, chat ID, API key, sources RSS)
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

- **Base** : "Calendrier Publications" (`0b730033-5a9c-48fb-9395-41198de626cc`)
- **Config** : `Site/scripts/notion-config.json`

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
    Actus chaudes/
      2026-02-20/           ← Carrousels automatiques classés par date
        97-slug-slide1.png            (slide photo+titre)
        97-slug-slide2.png            (slide photo+texte ou infographie)
        97-slug-slide3.png            (slide photo+texte ou infographie)
        97-slug-slide4.png            (slide photo+texte ou infographie)
      2026-02-21/
      ...
  Rapports/                 ← PPTX finaux
Templates/
  Réseaux sociaux/          ← Templates HTML
  PPT/workspace/            ← Helpers PPTX (pas de sortie ici)
Site/scripts/               ← Tous les scripts Node.js
  telegram-config.json      ← Config bot + API keys (NE PAS COMMIT)
  .veille-carousel-cache.json ← Cache déduplication (auto-géré)
```

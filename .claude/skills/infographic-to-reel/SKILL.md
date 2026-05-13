---
name: infographic-to-reel
description: Transforme une infographie OVLA en Reel Instagram animé (1080×1920, 30 fps, 10 s) avec écran final "Abonne-toi". Adapte le layout vertical, anime la courbe (tracé progressif), pose des points d'étape on-chart avec valeurs lisibles, ajoute un CTA fullscreen, et assemble en MP4 via Puppeteer + ffmpeg. À utiliser quand l'utilisateur demande une vidéo Reel d'un graphique, l'animation d'une courbe pour Instagram, ou la conversion d'une infographie existante en format vidéo. Déclencheurs : "fais-moi un reel", "format reel", "transforme cette infographie en vidéo", "anime la courbe", "vidéo Instagram", "vidéo TikTok d'une courbe", "réel sur X", "graphique animé".
---

# infographic-to-reel

Pipeline pour convertir une infographie OVLA (courbe temporelle) en Reel Instagram animé verticalisé. Output : MP4 1080×1920 30 fps, **10 s** (8s viz + 2s CTA fullscreen "Abonne-toi"), ~0,6 Mo.

## Architecture

- **Générateur HTML** : `Site/scripts/reel-poc/reel-generator.js` — produit un HTML autonome animé à partir d'une config JS (courbe temporelle, viewBox 960×1380)
- **Configs reels** : `Site/scripts/reel-poc/batch-reels.js` — tableau `REELS` avec une entrée par vidéo
- **Renderer** : `Site/scripts/reel-poc/render.js` — Puppeteer frame-by-frame + ffmpeg (spawnSync pour éviter les soucis d'apostrophes dans le chemin)
- **Output final** : `Production interne/Réseaux Sociaux /Infographies/Insta & Autres/<infographicSource>-video.mp4`

## Convention de nommage

Chaque vidéo prend le **nom de fichier de l'infographie source** suivi du suffixe `-video.mp4`. Exemple :

| Infographie source                              | Vidéo générée                                      |
|--------------------------------------------------|---------------------------------------------------|
| `161-dette-x6-depuis-1980.html`                  | `161-dette-x6-depuis-1980-video.mp4`              |
| `129-depenses-sante-pib.html`                    | `129-depenses-sante-pib-video.mp4`                |
| `83-ratio-actifs-retraites.html`                 | `83-ratio-actifs-retraites-video.mp4`             |

Chaque entrée du tableau `REELS` dans `batch-reels.js` **doit** déclarer le champ `infographicSource` (filename sans `.html`), qui sera utilisé comme nom de sortie.

## Quand REPRENDRE l'infographie source / quand REPENSER

Beaucoup d'infographies OVLA en 1080×1080 ne sont **pas adaptées** à un Reel telles quelles. Le skill doit savoir trancher.

### Reprendre tel quel (rare)
- Une seule courbe principale
- Données : 1 point de départ + 4-5 étapes + 1 point final
- Chiffres clés identifiables

### Repenser pour le Reel (cas typique)
Refaire à partir des données brutes quand l'infographie source a :
- Bar-chart, dot-plot, ranking (le générateur actuel ne gère que la courbe)
- Multi-courbes (max 1 courbe par reel — sinon refaire en grouped-bar dans une infographie séparée)
- Layout déjà saturé
- Texte d'annotation surchargé

Dans ce cas : soit **créer une nouvelle config** dans `REELS` (batch-reels.js) en repartant des données brutes (si on peut faire passer en courbe temporelle), soit **créer un template HTML autonome** dans `Site/scripts/reel-poc/reel-<slug>.html`.

### Patterns custom validés (templates autonomes)

Pour les infographies non-courbe, on crée un template HTML autonome qui réutilise les mêmes conventions que le générateur (`?capture` mode, `window.setReelTime`, classes `.run`, `cta-screen` fullscreen). Patterns existants :

| Pattern | Template de référence | Animation clé |
|---------|----------------------|---------------|
| **Hero compteur temps réel** | `reel-463m-dette-par-jour.html` | Override `setReelTime` qui pilote un compteur numérique linéaire en JS (ex : 0 → 26 794 € en 5s) — concept "pendant X secondes, la dette a augmenté de…" |
| **Bar-chart 2 barres + bloc rouge** | `reel-dette-etat-augmentation-2025.html` | Animation `height: 0 → target` via `@keyframes`, barre rouge superposée pour l'écart, label flèche `+135 Md€` |
| **Bar-chart 3 barres comparatives** | `reel-charge-interets-vs-defense-education.html` | 3 barres animées en staggered, une en highlight rouge (la barre du milieu) |

Le rendu se fait directement via `node render.js --html=<file> --duration=<sec> --output=<mp4>`, sans passer par `batch-reels.js`.

### Durée et timing CTA selon le pattern
| Pattern | Durée vidéo | CTA à | Sustain avant CTA |
|---------|-------------|-------|-------------------|
| Courbe (générateur) | 10 s | 8 s | ~0,5 s (chiffre final à 7,5 s) |
| Hero compteur 5 s | 9 s | 7 s | 1,6 s |
| Bar-chart (2-4 barres) | 8 s | 6 s | ~2 s |

**Règle générale** : le sustain entre la fin des animations principales et le CTA ne doit **jamais dépasser 2 s** (sinon le scroll-stop est perdu).

## Règles éditoriales — hook Reel

CRITIQUE : sur Instagram, l'utilisateur scrolle après 1-2 s s'il ne voit rien d'intéressant.

### Hook fort à t=0
- **Titre + sous-titre + logo + footer présents dès t=0** (pas d'animation d'entrée)
- **Axes + grille déjà visibles** dès la première frame
- **Courbe commence à se tracer dès t=0** (animation `drawCurve` 6500 ms, delay 0)
- **Annotation du chiffre de départ** visible dès t=0 sur le graph (ex "21 %" en 1980)

### Pas de pills latérales
Tous les chiffres clés sont **on-chart**, directement à côté de leur point sur la courbe. Pas de pills déportées en haut/à droite/à côté.

### Titre punchy + centré
- **Format** : `{ line1: 'Phrase d\'accroche :', line2_accent: 'Chiffre choc', line3: 'Précision' }`
- `line2_accent` est rendu en **italic + couleur d'accent** (rouge par défaut)
- **Centré horizontalement** (`text-align: center`)
- **`font-size: 7.4rem` standard sur TOUS les reels** (courbes générées ET templates custom hero/bar-chart). Si un titre trop long déborde, **reformuler** plutôt que réduire la taille — la lisibilité smartphone prime.
- Exemples validés :
  - "L'envolée de la dette française : **×6 depuis 1980**"
  - "La dépense de santé **a doublé** en 50 ans"
  - "Retraites : **4 actifs pour 1 en 1960**, 1,7 aujourd'hui"

### Lexique éditorial — "dette publique" obligatoire
Sur tout reel relatif à la dette, **toujours utiliser "dette publique"** — jamais "dette de l'État" seul, jamais "dette" seul. S'applique au titre, au sous-titre et aux labels d'axes. Si le mot fait déborder le titre en 7.4rem, scinder en 3 lignes au lieu de 2.

Exemples conformes :
- ✅ "+135 milliards de **dette publique** en 2025"
- ✅ "En 5 secondes, **la dette publique** a augmenté de…"
- ✅ Sous-titre : "Dette publique · 2024 → 2025 · Milliards €"
- ❌ "+135 milliards de dette en un an"
- ❌ Sous-titre : "Dette de l'État · …"

Exception tolérée : dans le sous-titre, "Charge de la dette publique" peut se contracter en "Charge de la dette" si le titre explicite déjà "intérêts de la dette publique".

### Tailles minimales (lisibilité smartphone)
| Élément              | Taille                       |
|----------------------|------------------------------|
| Titre                | `font-size: 7.4rem`          |
| Sous-titre kicker    | `1.5rem` UPPERCASE           |
| Annotation départ    | 56 px (SVG)                  |
| Annotations étapes   | 44 px (SVG)                  |
| Annotation finale    | 74 px (couleur accent + glow)|
| Labels axes Y/X      | 28-30 px                     |
| URL footer           | 2.6rem                       |
| Handle footer        | 2.2rem                       |

### Charte OVLA — footer Reel
- **Double mention centrée** : `ouvalargent.com` (couleur accent JetBrains Mono 2.6rem) + `@ouvalargentfr` (blanc JetBrains Mono 2.2rem) — **empilées au centre** (flex-direction column align-items center)
- Source officielle en dessous, centrée et discrète (font 0.85rem) — INSEE, Banque de France, OCDE, Eurostat...
- Pas de tag thématique en haut-droite
- Pas de bloc "× N" / multiplicateur dramatique en post-courbe : le chiffre final on-chart suffit
- Fond gradient OVLA : `linear-gradient(160deg, #0a1220 0%, #1d2540 50%, #0a1220 100%)`
- Glow accent top-right + glow secondaire bottom-left
- Grille 50×50 px en `rgba(<accent-rgb>, 0.05)`

## Storyboard 10 secondes

| Temps        | Action                                                          |
|--------------|-----------------------------------------------------------------|
| 0 ms         | Header logo + titre + sous-titre + footer **visibles d'emblée** |
| 0 ms         | Axes + grille + annotation départ visibles                      |
| 0 ms         | Courbe commence à se tracer (animation 6 500 ms)                |
| 1500 ms      | Étape 1 pop (calée linéairement sur la courbe)                  |
| 3000 ms      | Étape 2 pop                                                     |
| 4500 ms      | Étape 3 pop                                                     |
| 6000 ms      | Étape 4 pop                                                     |
| 6500 ms      | Endpoint final apparaît (popIn)                                 |
| 6700 ms      | Annotation finale énorme pop avec glow                          |
| 7500 ms      | Tout est visible — courbe + tous les chiffres                   |
| 8000 ms      | **Écran CTA "Abonne-toi" fullscreen fade-in** (400 ms)          |
| 8000-8500 ms | Logo €, "Abonne-toi.", "PARTAGE.", URLs apparaissent en staggered|
| 8500-10000 ms| Écran CTA tenu (~1.5 s lecture)                                 |

**Durée totale : 10 s**. Le CTA arrive **1 seconde après** que le dernier chiffre soit pleinement visible (règle "1-2 s max après affichage du dernier chiffre").

### Calage des points d'étape sur le tracé
La courbe se trace linéairement entre `x_start` et `x_end` durant 6500 ms. Pour chaque point :
```
delay_ms = (point_x - x_start) / (x_end - x_start) * 6500
```

### Écran final "Abonne-toi"
Overlay fullscreen `.cta-screen { position: absolute; inset: 0; z-index: 10 }` activée à 8 s :

```
   € (Instrument Serif 18rem, couleur accent, glow 80px)
   Abonne-toi.   (Instrument Serif 9rem, blanc)
   PARTAGE.      (Syne 2.8rem UPPERCASE, blanc 70%)
   
   ouvalargent.com   (JetBrains Mono 4.2rem, accent)
   @ouvalargentfr    (JetBrains Mono 3.6rem, blanc)
```

Le background du CTA : `radial-gradient(ellipse at center, #142b48 0%, #0a1220 70%, #06080c 100%)`.

## Implémentation HTML (rappel structure)

Générée automatiquement par `reel-generator.js`. Structure :
```
.reel (1080×1920)
├── .bg-base (gradient sombre)
├── .bg-grid (mailles 50×50)
├── .bg-glow-1 (accent top-right) + .bg-glow-2 (secondary bottom-left)
├── .content (padding 50px 40px 40px, flex column)
│   ├── .header (logo €, opacity 1 dès t=0)
│   ├── .title-block (text-align center, margin-top 24px)
│   │   ├── .title (font-size 7.4rem)
│   │   └── .subtitle
│   ├── .chart-wrap (flex 1, align-items stretch)
│   │   └── svg viewBox="0 0 960 1380"  (portrait, aspect ~0.70 match container)
│   │       ├── axes + grille (axis-elem, opacity 1)
│   │       ├── path.curve stroke-width 9 (stroke-dasharray animé 6500ms)
│   │       ├── stage-dot r=14 + stage-label (popIn par étape)
│   │       └── endpoint r=22 + anchor-end (pop massif à la fin)
│   └── .footer (flex column align-items center, opacity 1)
│       ├── .cta (column gap 4px)
│       │   ├── .cta-url (ouvalargent.com, accent 2.6rem)
│       │   └── .cta-handle (@ouvalargentfr, blanc 2.2rem)
│       └── .source (centrée, 0.85rem discrète)
└── .cta-screen (overlay fullscreen, activée à 8s)
    ├── .cta-screen-logo (€)
    ├── .cta-screen-title (Abonne-toi.)
    ├── .cta-screen-tag (PARTAGE.)
    └── .cta-screen-urls (ouvalargent.com + @ouvalargentfr)
```

### ViewBox SVG : 960×1380

L'aspect ratio 960/1380 ≈ 0.70 **matche l'aspect du container `.chart-wrap`** une fois la slide en 1080×1920 avec header + title + footer. Conséquence : aucun letterboxing vertical, le graphe remplit toute la zone disponible sans espace vide en haut ni en bas.

Échelles utilisées :
- `xStart = 90, xEnd = 920` (largeur dessin = 830)
- `yTop = 30, yBottom = 1280` (hauteur dessin = 1250)
- X-labels à `y = 1330`
- Unit caption (italic) à `y = 55`

### Anti-chevauchement labels/courbe

Le générateur calcule la position verticale de chaque stage-label selon que la courbe monte ou descend de chaque côté du point :
- `OFFSET_ABOVE = -50` (label posé au-dessus)
- `OFFSET_BELOW = 64` (label posé en-dessous)

Une fonction `shouldShowLabel(i)` masque les stage-labels trop proches d'un endpoint (collision quand un point est très près du label final, ex 115% en 2020 vs 117% en 2024).

### Contrôle frame-by-frame (Puppeteer)
```js
window.setReelTime = (timeMs) => {
  document.getAnimations().forEach(a => {
    try { a.currentTime = timeMs; } catch (e) {}
  });
};
```

Le HTML expose `window.__reelReady = true` une fois les fonts chargées et les animations en pause. `render.js` attend ce signal puis itère.

## Commandes

### Ajouter une config reel
Éditer `Site/scripts/reel-poc/batch-reels.js`, tableau `REELS`. Champs obligatoires :

```js
{
  slug: 'dette-1980',                       // identifiant court (sans préfixe reel-)
  infographicSource: '161-dette-x6-depuis-1980',  // filename de l'infographie source (sans .html)
  title: { line1: '...', line2_accent: '...', line3: '' },  // line2 sera en italic accent
  subtitle: 'France · % du PIB · 1980 → 2024',
  unit: ' %',                               // suffixe affiché à côté des valeurs
  unitCaption: '% PIB',                     // caption italic en haut de l'axe Y
  yMin: 0, yMax: 130, yGrid: [25, 50, 75, 100, 125],
  xLabels: [1980, 1990, 2000, 2010, 2020, 2024],
  data: [                                   // 6 points typiquement (1 départ + 4 étapes + 1 fin)
    { year: 1980, value: 21 },
    { year: 1990, value: 35 },
    { year: 2000, value: 59 },
    { year: 2010, value: 85 },
    { year: 2020, value: 115 },
    { year: 2024, value: 117 },
  ],
  color: 'red',                             // red | cyan | gold | green | violet | orange
  source: 'INSEE · Banque de France · Comptes nationaux · 2024',
}
```

### Générer une vidéo
```bash
# Tout le batch
node Site/scripts/reel-poc/batch-reels.js

# Un seul reel (test, validation, itération)
node Site/scripts/reel-poc/batch-reels.js --only=dette-1980

# Durée personnalisée (par défaut 10s)
node Site/scripts/reel-poc/batch-reels.js --only=dette-1980 --duration=12
```

## Workflow recommandé pour Claude Code

Quand l'utilisateur demande un reel sur un sujet ou la transformation d'une infographie en vidéo :

1. **Identifier l'infographie source** :
   - Chercher dans `Production interne/Réseaux Sociaux /Infographies/Sources HTML/`
   - Le nom du fichier source détermine le nom de la vidéo finale (`<infographicSource>-video.mp4`)
   - Si pas d'infographie existante → créer d'abord l'infographie statique, puis le reel

2. **Vérifier que c'est une courbe temporelle** (le générateur ne gère que ce cas)
   - 1 série, 4-6 points dans le temps
   - Sinon : adapter les données pour un graphe courbe ou créer une nouvelle infographie source

3. **Extraire les données** de l'infographie source (year + value) et la source officielle (INSEE, Banque de France, OCDE, Eurostat, DREES...)

4. **Ajouter une config dans `batch-reels.js`** (tableau `REELS`)
   - `slug` court
   - `infographicSource` = filename de l'infographie sans `.html`
   - Titre punchy (line1 + line2_accent + line3 optionnel)
   - Couleur cohérente avec l'infographie source

5. **Vérifier les chiffres** (fact-checker agent si doute) — JAMAIS de chiffre inventé

6. **Render** :
   ```bash
   node Site/scripts/reel-poc/batch-reels.js --only=<slug>
   ```

7. **Vérifier visuellement** au moins 3 frames clés avec `ffmpeg -ss <t> -i <video.mp4> -frames:v 1 ...` :
   - t=0s (hook : titre visible, axes vides, point de départ visible)
   - t=7s (graphique complet, label final lisible)
   - t=9s (écran "Abonne-toi" déployé)

8. **Itérer si nécessaire** sur :
   - Position des labels (chevauchement avec la courbe ou entre eux)
   - Punchiness du titre
   - Timing du CTA (doit arriver 1-2 s max après le dernier chiffre)

## Erreurs fréquentes à éviter

- ❌ Hook trop tardif : la courbe ne commence pas à t=0
- ❌ Titre/footer animés avec délai → tout doit être visible dès t=0 sauf la courbe et le CTA
- ❌ Pills latérales pour départ/arrivée → préférer annotations on-chart
- ❌ Chiffres en font ≤ 30 dans le SVG → illisibles sur smartphone
- ❌ Plus de 6 points d'étape → surcharge visuelle, max 4-5 stages + 2 endpoints
- ❌ Multiplicateur "× N" dramatique en post-courbe → redondant avec le chiffre final, à éviter
- ❌ Path SVG mal calculé → la courbe ne passe pas par les valeurs annoncées dans les étapes
- ❌ Labels qui se chevauchent (ex 2020 et 2024 trop proches verticalement) → utiliser `shouldShowLabel()` ou augmenter `OFFSET_ABOVE/BELOW`
- ❌ Source manquante en footer → systématiquement INSEE/Banque de France/OCDE/Eurostat avec année et unité
- ❌ Apostrophe dans le chemin de sortie qui casse ffmpeg → `render.js` utilise `spawnSync` avec args array (pas `execSync` avec chaîne shell)
- ❌ Naming générique `video.mp4` → toujours nommer `<infographicSource>-video.mp4`
- ❌ Sortie dans `Articles/<date>/<slug>/` → maintenant la vidéo finale va dans `Infographies/Insta & Autres/`
- ❌ CTA "Abonne-toi" qui arrive trop tard (>2 s après le dernier chiffre) → ajuster `ctaFadeIn` delay (actuellement 8000 ms pour vidéo 10 s)

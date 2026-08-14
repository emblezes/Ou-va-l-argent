---
name: photo-stat-card
description: Produit des visuels "photo-stat" autonomes au format Instagram 1080×1080 (style BasicOptimism adapté OVLA) — photo réelle plein cadre + énoncé en serif blanc + punchline chiffrée en or + logo OVLA et ouvalargent.com en bas à gauche. Chaque visuel est INDÉPENDANT (pas de carrousel), publiable un par un. À utiliser pour un bilan chiffré d'une personnalité/pays/secteur en plusieurs images séparées, une série de "chiffres choc" sur photo, ou la reprise du style "photo + texte blanc/jaune". Déclencheurs : "fais des visuels sur photo", "format BasicOptimism", "photo + chiffre", "images indépendantes sur le bilan de X", "carte photo-stat", "visuel photo avec citation/chiffre", "série de visuels photo".
---

# photo-stat-card

Génère des visuels **autonomes** (un par fichier) combinant une **photo réelle plein cadre** et un texte en deux temps :
1. **Énoncé** en serif **blanc** (le contexte, le « avant »).
2. **Punchline chiffrée** en serif **or** `#ffcf33` (la révélation, le chiffre choc).

Logo OVLA (€ Où Va l'Argent ?) + `ouvalargent.com` en **bas à gauche**. Format **1080×1080**, exporté en PNG **2160×2160** (retina 2×).

Inspiration : carrousels « BasicOptimism » (photo + titre blanc + corps jaune). Différence clé OVLA : **images indépendantes**, pas de carrousel narratif, pas de numérotation « 1/5 », pas de « swipe ». Chacune doit tenir seule.

## Quand l'utiliser / quand NON

**Utiliser** quand le sujet = un **bilan / une trajectoire chiffrée** racontable en N faits autonomes (bilan d'un dirigeant, d'un pays, d'un secteur ; série « chiffres choc » illustrés par une photo de la personne/du lieu).

**NE PAS utiliser** pour :
- un **graphique** (courbe, barres, ranking) → `Infographies` / `batch-export-all.js`
- un **carrousel narratif** 4 slides qui s'enchaînent → `create-carousel-actu.js` / pipeline `telegram-hourly-carousels.js`
- une **vidéo** → `video-journalist` / `infographic-to-reel`

## Pipeline en 4 étapes

### 1. Fact-check AVANT toute production (OBLIGATOIRE)
Règle projet : aucun chiffre sans source primaire vérifiée. Lancer l'agent `fact-checker` (ou `search-specialist`) pour obtenir, par fait :
- l'affirmation exacte en une phrase,
- le ou les chiffres précis **avec dates** (avant → après),
- la **source primaire** (organisme + période),
- une note de fiabilité (✅ / ⚠️).

Privilégier les **données les plus récentes**. Ancrer les années dans le texte pour éviter toute ambiguïté de calcul (ex. « En 2024 puis 2025 » plutôt que « 16 ans » seul).

### 2. Récupérer les photos soi-même
Le scraper Google (`download-google-image.js`) est **souvent en panne** (0 résultat). Source fiable et libre de droits : **Wikimedia Commons**.

```bash
# Lister les fichiers d'une catégorie Commons (ex : une personnalité)
curl -s "https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:NOM_CATEGORIE&gcmtype=file&gcmlimit=40&prop=imageinfo&iiprop=url|mime|size&format=json" \
  -H "User-Agent: OVLA-bot/1.0 (e.blezes@gmail.com)"

# Recherche par mots-clés (namespace 6 = fichiers)
curl -s "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=MOTS%20CLES&srnamespace=6&srlimit=15&format=json" \
  -H "User-Agent: OVLA-bot/1.0 (e.blezes@gmail.com)"

# Télécharger un fichier (URL upload.wikimedia.org renvoyée par imageinfo)
curl -s -H "User-Agent: OVLA-bot/1.0 (e.blezes@gmail.com)" "<URL>" -o photos/inflation.jpg
```

Critères de sélection (les **regarder** avec l'outil Read avant de choisir) :
- **Portrait solo** de préférence (éviter les photos de groupe où le sujet n'est pas clair).
- **Visage dans le tiers supérieur** : le bas est mangé par le voile sombre + le texte.
- Résolution ≥ 1000 px sur le petit côté (sinon flou à l'agrandissement).
- Une photo **différente et pertinente** par visuel (varier les angles ; pour un thème « pauvreté » une photo de terrain peut être plus parlante qu'un portrait).

Placer les fichiers dans `<dossier de sortie>/photos/`.

### 3. Écrire la config et générer le HTML (preview AVANT PNG)
Créer un `config.json` (voir schéma plus bas), puis **toujours montrer le HTML d'abord** :

```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"
node scripts/photo-stat-card.js <config.json> --html-only
```

Ouvrir le HTML (`open <fichier>.html`) ou screenshoter chaque `.slide` pour validation. **Ne pas exporter les PNG tant que l'utilisateur n'a pas validé** textes + photos + cadrage.

### 4. Exporter les PNG (après validation)
```bash
node scripts/photo-stat-card.js <config.json>
```
→ écrit `<name>.png` (2160×2160) pour chaque carte dans le dossier de sortie.

## Schéma de config

```json
{
  "date": "2026-06-18",
  "batchSlug": "milei-bilan",
  "cards": [
    {
      "name": "milei-inflation",
      "photo": "photos/inflation.jpg",
      "photoPos": "center 18%",
      "headline": "Quand Milei est arrivé, l'inflation atteignait 211 % par an.",
      "reveal": "Fin 2025, elle est tombée à <big>31,5 %</big> — la plus basse depuis 8 ans.",
      "source": "INDEC"
    }
  ]
}
```

- **Sortie** : `Production interne/Réseaux Sociaux /Actus chaudes/<date>-<batchSlug>/`
- **`name`** = nom du PNG final (slug descriptif, sans extension).
- **`photoPos`** = `background-position` ; règle le cadrage vertical pour garder le visage net au-dessus du texte (`center 15%` à `center 30%` selon la photo).
- **`<big>…</big>`** dans `headline`/`reveal` → chiffre en gros (62 px). Mettre le **chiffre choc** de la punchline en `<big>`.
- HTML inline autorisé dans les textes (apostrophe typographique `'` ou droite `'`).

## Règles éditoriales

### Ligne éditoriale OVLA = pro-business, libérale (CRITIQUE)
L'angle de chaque carte doit être cohérent avec le parti pris libéral d'OVLA. Les chiffres restent exacts et sourcés — c'est l'ANGLE qui est orienté, pas la donnée.
- **Réformes pro-marché = succès** (Milei, Bukele, Grèce post-austérité, baisses d'impôts, excédents).
- **Critiquer l'excès d'État** : trop d'impôts/prélèvements, dépense publique, dette, déficit, retraites insoutenables.
- **Inflation = impôt invisible** : la perte de pouvoir d'achat vient de l'inflation / création monétaire / politique publique, jamais de la « cupidité » des entreprises.
- **Entreprises & patrons = création de valeur** : célébrer la réussite (Musk, Nvidia/Huang, Arnault/LVMH « fleuron français », TotalEnergies « champion mondial »). Profits, dividendes et rachats profitent aux épargnants/fonds/CAC 40 → positif.
- **Débunker les mythes anti-business** au lieu de les relayer (ex. « Total ne paie pas d'impôt » → ~25 Md$/an dans le monde ; activités France déficitaires = mécanisme légal).
- **Bannir** : framing « inégalités », « profits indécents », « juste part », opposition actionnaires/transition.
Voir mémoire `feedback_ligne_editoriale_pro_business`.

### Structure
- **Énoncé blanc = le « avant » / le contexte**, **révélation or = le chiffre / le « après »**. Deux phrases courtes maximum chacune.
- **Un seul chiffre dominant par visuel** (celui en `<big>`). Pas de slide bourrée de chiffres (ce n'est pas une infographie).
- **Ancrer les dates** dans le texte pour que le calcul soit limpide (ex. excédent « en 2024 puis 2025 », pas « depuis 16 ans » sans année).
- **Indépendance** : chaque visuel se comprend seul. Aucune référence à « la slide suivante », pas de « 1/4 ».
- **Factuel, pas militant** : énoncer le fait sourcé. Le ton OVLA reste journalistique.
- **Source** consignée dans la config (`source`) pour la traçabilité et la caption ; elle n'est pas affichée sur le visuel.

## Spécification visuelle (verrouillée — validée 18/06/2026)

| Élément | Valeur |
|---|---|
| Canvas | 1080×1080, export 2× = 2160×2160 |
| Police texte | **Lora** 700 (serif bold) |
| Police logo | **Instrument Serif** (€ cyan + « Où Va l'Argent ? » italic blanc) |
| Police URL | **JetBrains Mono** 600 |
| Énoncé | blanc `#ffffff`, 54 px, `line-height 1.22`, `text-wrap: balance` |
| Révélation | or `#ffcf33`, 54 px, `margin-top 30px` |
| Chiffre `<big>` | 62 px |
| Voile | gradient bas→haut noir (0.94 en bas → 0.10 en haut) pour garder le visage net |
| Contenu | ancré en bas, `padding 70px 70px 175px` (le bas dégage le logo) |
| Logo | bas-**gauche**, `left 70px / bottom 56px` ; € 60 px, nom 34 px, URL 20 px |

Le générateur `Site/scripts/photo-stat-card.js` porte cette spec. **Ne pas dupliquer le CSS ailleurs** : modifier le générateur si la charte évolue.

## Distribution (optionnel)
Après export, possibilité de pousser vers **Notion** (Calendrier Publications, champs `Insta 1`…`Insta 5` ou `Image`) et **Telegram** comme les autres formats. Comme les visuels sont indépendants, ils peuvent être programmés à des dates différentes plutôt qu'en un seul carrousel.

## Erreurs fréquentes à éviter
- ❌ Exporter les PNG avant validation du HTML par l'utilisateur.
- ❌ Photo de groupe où le sujet n'est pas identifiable (vérifier visuellement avant de choisir).
- ❌ Visage masqué par le texte → ajuster `photoPos` pour le remonter.
- ❌ Logo qui chevauche la dernière ligne → ne pas réduire `padding-bottom` sous 175 px.
- ❌ Chiffre non daté → ambiguïté de calcul (toujours ancrer l'année).
- ❌ Numérotation / « swipe » / renvoi entre visuels → ils sont indépendants.
- ❌ Chiffre non sourcé → fact-check obligatoire avant production.
- ❌ Trop de chiffres sur un même visuel → un seul `<big>` dominant.

## Référence
Premier batch produit : `Actus chaudes/2026-06-18-milei-bilan/` (bilan Milei : inflation, excédent budgétaire, pauvreté, risque pays) — `config.json` réutilisable comme modèle.

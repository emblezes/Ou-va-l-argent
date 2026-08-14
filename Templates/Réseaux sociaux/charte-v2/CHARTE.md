# Charte OVLA v2 — bibliothèque de formats

Fichier maquette : `formats.html` (10 slides 1080×1080, exportables via Puppeteer)
Rendus : `png/` + planche de contact `png/PLANCHE-10-FORMATS.png`

## Principe directeur

**Le graphique n'est qu'un format parmi dix.** La v1 imposait 6 patterns de graphiques ;
en pratique, cela produisait toujours la même slide. La v2 pose l'inverse : on choisit
d'abord **la forme qui sert le mieux le fait**, et le format « graphique » n'est retenu
que quand une évolution ou une comparaison fine l'exige.

Quatre règles seulement sont non négociables :

1. **Le logo** (€ cyan 4,2 rem + « Où Va l'Argent ? » en Instrument Serif italique 2 rem) en haut à gauche.
2. **Le footer** : source à gauche, `ouvalargent.com` à droite. **Pas de @ouvalargentfr sur les infographies.**
3. **Une source vérifiée** pour chaque chiffre affiché.
4. **Tout doit être lisible sans zoomer** (voir ci-dessous).

Tout le reste (fond, couleur d'accent, composition, présence ou non d'un graphique)
est libre et doit varier d'une publication à l'autre.

## Propreté : contrôle automatique avant livraison

Les cinq règles de propreté (zéro texte flottant, valeurs du même côté d'une courbe,
aération, un seul niveau d'information, titre auto-suffisant) sont détaillées dans
`GRAPHIQUES.md` et vérifiées par `Site/scripts/validate-charte-v2.js`. Aucune
infographie n'est livrée sans que ce script rende « Tout est conforme ».

## Lisibilité : la règle qui prime sur tout

Une slide se lit à bout de bras, dans un fil, sans zoomer. D'où :

| Élément | Taille plancher |
|---------|-----------------|
| Titre | **5 rem, plancher absolu** (7 rem sur le format manifeste) |
| Sous-titre / kicker | 1,75 rem |
| Tout autre texte de la slide | 2 rem |
| Labels et axes d'un graphique | 26-28 px |
| Source du footer | 1,22 rem (seule exception basse, mention légale) |

**Corollaire : on coupe.** Si un texte ne peut pas être écrit en gros, c'est qu'il ne
devrait pas être là. Une slide = un titre, éventuellement un sous-titre, le visuel, rien
d'autre. Pas de phrase d'explication, pas de note de lecture, pas de commentaire par
jalon, pas de double chiffrage du même fait (le titre annonce, le visuel montre).

À 5 rem, un titre tient en **deux lignes de 24 caractères maximum**. C'est la contrainte
qui commande l'écriture : on raccourcit le titre, on ne réduit jamais la taille.
Coupure par `<br>` explicite, jamais de mot orphelin, jamais trois lignes.

## Typographie

| Rôle | Police | Usage |
|------|--------|-------|
| Logo | **Instrument Serif** italique | signature de marque, jamais remplacée |
| Titres / textes géants | **Bricolage Grotesque** 700-800 | impact, lisibilité mobile |
| Corps, labels | **Inter** 500-700 | légendes, notes |
| Chiffres | **JetBrains Mono** 800 | tous les nombres, sans exception |

**Direction validée** (juillet 2026) : la typo de la slide 01 MANIFESTE fait référence.
Variantes écartées : voir `../tests-typo/png/PLANCHE-COMPARATIVE.png`
(A Instrument Serif, B Bricolage, C Playfair, D Anton, E Fraunces).

**Unités collées** : les nombres en mono laissent un espace trop large avant `%` ou `€`.
Toujours utiliser `<em class="pc">%</em>` ou `<em class="eu">€</em>`.

## Les 10 formats

| # | Format | Quand l'utiliser | Signature visuelle |
|---|--------|------------------|--------------------|
| 01 | **MANIFESTE** | un fait qui se suffit à lui-même | texte 7 rem, fond noir, barre rouge à gauche, aucun graphique |
| 02 | **MEGA-CHIFFRE** | un chiffre choc | chiffre 19 rem centré + unité, rien d'autre |
| 03 | **DUEL** | France contre un référent | deux colonnes, deux chiffres géants |
| 04 | **ISOTYPE** | des unités dénombrables (avions, hôpitaux, élus) | pictogrammes comptés, manquants en fantôme |
| 05 | **GRILLE 100** | une part d'un tout | 100 carrés dont N colorés + le chiffre en gros |
| 06 | **CHRONOLOGIE** | une dérive dans le temps | jalons datés, dernier jalon deux fois plus gros |
| 07 | **CLASSEMENT** | un rang international | barres + drapeaux, France en rouge |
| 08 | **GRAPHIQUE** | une évolution à deux séries | courbes + aire de l'écart remplie + labels de fin |
| 09 | **FLUX** | une répartition | barre empilée + liste des postes |
| 10 | **MOSAÏQUE EUROPE** | comparer la France à ses voisins | tuiles disposées géographiquement, France en tuile double |

## Ambiances de fond

- `deep` (défaut) : gradient bleu `#0a1220 → #142b48`, glow rouge haut-droite
- `ink` : quasi noir `#05080f → #0d1622`, pour les formats texte
- `gold-mood` / `cyan-mood` : change la couleur du glow selon le sujet

## Ce qui est interdit

- Réutiliser deux fois de suite le même format sur le fil.
- Un encart rectangulaire flottant **à l'intérieur** d'une zone graphique.
- Une phrase narrative posée dans un graphique (les formats 01 et 02 sont là pour ça).
- Un chiffre sans source.

## Inventer un 11e format

C'est encouragé. Un nouveau format est recevable s'il respecte les quatre règles non
négociables, s'il tient en 1080×1080, et si sa forme est dictée par la donnée
(une carte pour du géographique, un calendrier pour du saisonnier, un trombinoscope
pour des personnes, une balance pour un arbitrage budgétaire…).
Le rajouter ensuite dans `formats.html` et dans ce tableau.

## Export

```bash
cd "Site" && SEL=".slide" NODE_PATH="$PWD/node_modules" \
  node <script-puppeteer> "../Templates/Réseaux sociaux/charte-v2/formats.html" \
  "../Templates/Réseaux sociaux/charte-v2/png" 1
```

## Réserve sur les données des maquettes

Les chiffres des maquettes proviennent d'infographies OVLA déjà publiées
(OCDE Études économiques France 2026, Sénat PLF 2025, INSEE) sauf deux :
la répartition COFOG du format 09 et le comptage Canadair du format 04
(sources presse spécialisée et Wikipedia, à re-vérifier avant toute publication).
Le format 10 s'appuie sur Eurostat via Fipeco (dépenses publiques 2024).

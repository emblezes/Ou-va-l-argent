# Bibliothèque de graphiques OVLA — 20 types standardisés

Maquettes : `graphiques.html` · Rendus : `png-graphiques/` · Planche : `png-graphiques/PLANCHE-20-GRAPHIQUES.png`

But de ce document : **ne plus jamais discuter au cas par cas de la taille ni de la position
d'un chiffre.** Tout est figé ici et codé dans `graphiques.html`. On choisit un type, on
remplace les données, c'est fini.

## 0. Les cinq règles absolues (vérifiées automatiquement)

Ces règles priment sur tout le reste. Les trois premières sont contrôlées par
`Site/scripts/validate-charte-v2.js`, à passer **avant toute livraison** :

```bash
cd Site && node scripts/validate-charte-v2.js "../Templates/Réseaux sociaux/charte-v2/<fichier>.html"
```

1. **Zéro texte flottant dans la zone de dessin.** Un texte n'est admis que s'il est
   ancré à moins de 40 px de sa marque, aligné dans une colonne de valeurs, ou s'il
   s'agit d'une graduation d'axe, d'un nom de catégorie ou d'un chiffre-héros. Sont
   proscrits les commentaires posés dans le graphe (« +123 % », « −93 % », « déficit »).
2. **Sur une courbe, toutes les valeurs du même côté**, au-dessus. Jamais d'alternance.
   En cas de collision, on retire des points étiquetés.
3. **Aération** : deux textes ne se chevauchent jamais. 96 px minimum entre deux
   étiquettes de fin de série.
4. **Un seul niveau d'information par slide** : des montants ou des évolutions, pas les deux.
5. **Titre auto-suffisant** : il dit de qui on parle et ce qu'il faut retenir.

> Piège technique : dans un SVG, l'attribut `font-size="42"` est **écrasé** par une
> classe CSS (`.v`, `.cat`…). Toujours écrire `style="font-size:42px"`, sinon la taille
> voulue ne s'applique pas.

## 0 bis. Titre de la slide


**5 rem (80 px), graisse 800, deux lignes de 24 caractères maximum.** Si le titre ne tient
pas, on réécrit le titre, jamais on ne réduit la taille.

## 1. Taille des textes dans un graphique (jamais modifiée au cas par cas)

La zone de dessin fait toujours **1000 × 520 unités**, affichées à l'identique en pixels
dans une slide 1080×1080. Les tailles ci-dessous sont donc des pixels réels.

| Classe CSS | Rôle | Taille | Graisse | Couleur |
|-----------|------|--------|---------|---------|
| `.v` | valeur de donnée | **36 px** | 800 mono | blanc `#f2f6fa` |
| `.v.hi` | valeur mise en avant (France, dernier point, total) | **46 px** | 800 mono | rouge `#ff4757` |
| `.v.dim` | valeur secondaire (point de départ, ancienne année) | 36 px | 800 mono | gris `#93b0c8` |
| `.cat` | nom de catégorie (pays, poste, année) | **28 px** | 700 Inter | `#c3d2df` |
| `.cat.hi` | catégorie mise en avant | 28 px | 800 Inter | rouge |
| `.ser` | nom de série (collé à la courbe) | 30 px | 800 Inter | couleur de la série |
| `.tick` | graduation d'axe | 24 px | 500 mono | `#8fa3b6` |
| `.unitxt` | unité, mention de lecture | 24 px | 600 Inter | `#8fa3b6` |

Trois exceptions assumées, déjà codées : chiffre central du donut 86 px, chiffre du
treemap 86 px, chiffre de la grille 100 en 150 px. Ce sont des chiffres-héros, pas des
labels de données.

## 2. Position des chiffres, par type de graphique

| Type | Où va la valeur | Règle complémentaire |
|------|-----------------|----------------------|
| Barres verticales | **au-dessus** de la barre, centrée, 18 px au-dessus du sommet | jamais à l'intérieur de la barre |
| Barres verticales + référence | idem, avec **garde-fou** : si la valeur tombe à moins de 36 px de la ligne de référence, elle remonte automatiquement au-dessus de celle-ci | le libellé de la référence sort de la zone des barres, à droite |
| Barres horizontales | **à droite** du bout de barre, 22 px après | nom de catégorie à gauche, colonne fixe de 280 px |
| Barres négatives | **sous** la barre (qui descend), centrée | nom de catégorie au-dessus de l'axe zéro |
| Barres groupées | au-dessus de chaque barre, **30 px** | maximum **3 catégories × 2 séries** : au-delà les valeurs se touchent |
| Empilées 100 % | **dans** le segment si le segment ≥ 9 %, en `#0a1220` sur le fond coloré ; sinon uniquement dans la liste sous la barre | la liste répète toutes les valeurs |
| Courbe simple | **premier point** en gris, **dernier point** en rouge 46 px | aucune valeur sur les points intermédiaires |
| Deux courbes | nom de série + valeur **au bout à droite**, empilés | jamais de légende séparée en haut |
| Lollipop | à droite du point, 34 px après | point 20 px de rayon si mis en avant, 14 px sinon |
| Slope | aux **deux extrémités**, à l'extérieur | nom de série au-dessus de la valeur de droite |
| Dumbbell | valeur de départ **au-dessus** du point gris, valeur d'arrivée **à droite** du point rouge | légende des deux dates en bas |
| Waterfall | au-dessus de chaque marche, `+` sauf sur le point de départ et le total | total en `.v.hi` |
| Donut | **au centre uniquement** | jamais de valeur posée sur un segment ; valeurs dans la légende |
| Treemap | dans la tuile, en `#0a1220` | libellés courts obligatoires (« État et dette », pas « Services généraux dont charge de la dette ») |
| Grille 100 | chiffre-héros à gauche, grille à droite | 1 carré = 1 unité, 10 × 10 |
| Isotype | **avant** les pictogrammes, entre le nom et la rangée | manquants à 15 % d'opacité |
| Bullet | à droite de la barre | repère de référence vertical en or, libellé sous l'axe |
| Tuiles d'écart | au centre de la tuile, 54 px | intensité de la couleur = intensité de la valeur |
| Courbe annotée | dernier point uniquement | repères d'événements en pointillé, libellé en haut |
| Small multiples | un seul chiffre clé par carte, en bas à droite | pas d'axes, pas de graduations |

## 2 bis. Trois règles apprises en production (juillet 2026)

- **Le titre doit se suffire à lui-même.** Il dit de qui on parle et ce qu'il faut retenir.
  « La moitié gagne moins de 2 190 € » ne veut rien dire : la moitié de qui ? Écrire
  « Ce que gagnent vraiment les salariés du privé ». Un lecteur qui ne lit que le titre et
  regarde le graphique deux secondes doit avoir compris.
- **Une valeur ne se place jamais à côté d'un point de courbe**, toujours au-dessus ou
  en dessous. Sinon elle mange la largeur disponible et la courbe est écrasée. La courbe
  occupe toute la largeur ; les étiquettes de fin de série sont espacées d'au moins 82 px
  entre elles, quitte à les décaler verticalement par rapport à leur point.
- **Barres divergentes** : le libellé d'une barre négative se met du côté vide (à droite
  de l'axe zéro) et sa valeur à l'extérieur de la barre, sinon la barre recouvre le texte.
- **Pas de ratio abstrait** comme « rapport interdécile 3,16 ». Toujours une grandeur
  concrète : des euros, des points de pourcentage, des années.

## 3. Règles transverses

- **Couleurs** : rouge `#ff4757` = la France, le fait qui alerte, le dernier point. Gris-bleu
  `#93b0c8` = les autres. Cyan `#00d4ff` = la série de contrepoint (recettes). Or `#ffd700`
  = les repères de référence. Vert `#00ff88` = le rare cas positif.
- **Épaisseur de courbe** : 5 px. **Rayon des points** : 7 px, 11 px sur le dernier.
- **Grille** : lignes horizontales à `rgba(255,255,255,.07)`, jamais de grille verticale.
- **Axe des ordonnées** : 3 à 4 graduations maximum. Jamais plus.
- **Jamais** d'encart rectangulaire flottant dans la zone de dessin.
- **Jamais** de valeur posée sur une autre valeur : chaque type ci-dessus a été vérifié
  sans collision sur les données de référence. Si une nouvelle série provoque un
  chevauchement, on réduit le nombre de catégories, on ne rétrécit pas la police.

## 4. Choisir son type

- Une évolution → **G07** (une série), **G08** (deux séries), **G19** (avec événements)
- Un classement → **G03** (barres), **G09** (lollipop, plus aéré)
- Une comparaison à une moyenne → **G02** ou **G17**
- Une structure → **G06** (barre empilée), **G13** (donut), **G14** (treemap)
- Un avant/après → **G10** (slope), **G11** (dumbbell)
- Une décomposition d'écart → **G12** (waterfall), **G18** (tuiles)
- Un dénombrement → **G16** (isotype), **G15** (grille 100)
- Un tableau de bord → **G20** (small multiples)

## 5. Données des maquettes

Toutes issues d'infographies OVLA déjà publiées ou vérifiées ce jour : OCDE Études
économiques France 2026, Eurostat via Fipeco (dépenses publiques 2024), INSEE/Eurostat
(dette Maastricht), Eurostat COFOG, flottes Canadair 2026.
Les données COFOG et Canadair restent à re-vérifier avant publication.

# Sources publiques exploitables — salaires, pouvoir d'achat, logement

Inventaire établi le 27 juillet 2026 en explorant le catalogue data.gouv.fr et les API
INSEE, pas en reprenant des articles de presse. Chaque source ci-dessous a été téléchargée
et testée : les chiffres qui suivent sont recalculés à la source.

## 1. INSEE — Séries longues de salaires du privé, 1951-2024

- data.gouv : `67f85d14377ef83a019ac740` · API : `https://api.insee.fr/melodi/file/DS_DERA_PRIVE_SERIES_LONGUES/DS_DERA_PRIVE_SERIES_LONGUES_CSV_FR`
- Format : ZIP contenant un CSV `;` (14 768 lignes), **déjà en euros constants**
- Dimensions croisables : centiles **10, 25, 50, 75, 90, 95, 99** · âge (moins de 26, 26-30,
  31-40, 41-50, 51-60, plus de 60) · sexe · CSP · secteur d'activité · taille d'entreprise
- Couverture : **74 années, 1951 à 2024**

**Ce que ça donne (salaire net mensuel médian, euros constants) :**
606 € en 1951 · 1 349 € en 1970 · 1 950 € en 1990 · 2 135 € en 2010 · 2 191 € en 2024.
Soit **+122 % entre 1951 et 1970**, et **+12 % entre 1990 et 2024**. Le centile 99 a même
reculé, de 10 071 € en 2010 à 9 798 € en 2024.

## 2. IGEDD (Jacques Friggit) — 46 séries annuelles, 1800-2020

- data.gouv : `536c51f8a3a72933d8d1b3bb` · fichier XLS unique, feuille `Series`
- Contient pour la France : IPC, PIB, revenu disponible des ménages, population, nombre de
  ménages, taux d'intérêt court et long, **valeur d'un placement en actions / obligations /
  monétaire / or**, indice du prix des logements France (1936-) et **Paris (1840-)**, indice
  des loyers, coût de la construction, nombre et montant des transactions, dette immobilière
  des ménages, **durée des prêts**. Plus les mêmes séries pour les États-Unis et le Royaume-Uni.
- Permet de **recalculer soi-même** la courbe de Friggit au lieu de la lire sur un graphique.

**Ce que ça donne :**
- Prix des logements rapporté au revenu par ménage (base 2000 = 1) : 0,95 en 1965 · 0,90 en
  1970 · 0,99 en 1980 · 1,01 en 1990 · **1,00 en 2000** · 1,68 en 2008 · **1,73 en 2020**.
- Prix en euros constants (base 2000 = 1) : Paris passe de 0,56 en 1965 à **2,84 en 2020**.
- Durée moyenne d'un prêt : **12,9 ans en 1970 → 21,9 ans en 2020**.
- 1 000 € placés en 1900, valeur en 2020 en euros constants : **actions 32 659 €**,
  logement Paris 5 763 €, or 3 383 €, obligations 360 €, **monétaire 66 €**.

## 3. DGFiP — Demandes de valeurs foncières (DVF)

- data.gouv : `5c4ae55a634f4117716d5656` (brut) · `5cc1b94a634f4165e96436c1` (géolocalisé)
  · `64998de5926530ebcecc7b15` (statistiques agrégées)
- Toutes les transactions immobilières réelles, à la parcelle, avec prix et surface.

## 4. INSEE — Salaires localisés et par métier

- Salaires du privé **au niveau communal** par sexe et CSP : `68082f318080d9dd71622e36`
- Salaires par **CSP détaillée**, privé : `67f85d13377ef83a019ac73f` · fonction publique : `693766ccda0a99f141cb6a2d`
- IRCOM (DGFiP), revenus fiscaux par commune : `536998cba3a729239d20505e`

**Croisement inédit** : salaires communaux INSEE × prix réels DVF sur la même commune
= nombre d'années de salaire local pour un logement local, ville par ville. Personne ne
le publie sous cette forme.

## 5. INSEE — Prix et inflation

- IPC, jeu principal : `6983dff81f90da358ccf74d8` · indices catégoriels : `6983dff71f90da358ccf74d6`
- **Prix moyens de vente de détail** (prix des produits en euros) : `6983dff71f90da358ccf74d7`
- Séries salaires et coût du travail : `53699f97a3a729239d206178`

## Méthode

1. `mcp__datagouv__search_datasets` pour repérer le jeu, `list_dataset_resources` pour l'URL.
2. Télécharger le fichier (curl) et l'ouvrir avec pandas dans le venv du scratchpad
   (`venv/bin/python`, xlrd installé pour les .xls anciens).
3. Recalculer les ratios soi-même et ne publier que des chiffres issus de ce calcul.
4. Citer la source primaire et l'année de la donnée, jamais l'article intermédiaire.

# Mapping V2 (5 parties) → V4 (3 parties)

**Source V2** : `Livre/Capitalisons - v2.docx` (28 mai 2026) → converti en `_import-v2/capitalisons-v2-brut.md` (4818 lignes, 76 297 mots, 361 footnotes)

**Cible V4** : structure 3 parties demandée (P1 = la capi répond aux problèmes du système / P2 = la capi permet d'avoir des fonds de pension / P3 = inspiration internationale).

---

## Volumétrie

| Bloc V2 | Mots (hors footnotes) | Pages estimées |
|---------|-----------------------|----------------|
| Avant-propos « Paradoxe Doliprane » | 2 234 | ~7 |
| Introduction | 4 546 | ~14 |
| P1 V2 « Nous n'aurons pas de retraite » | 7 153 | ~22 |
| P2 V2 « Comprendre la capitalisation » | 7 344 | ~22 |
| P3 V2 « La France a besoin de fonds de pension » | 11 064 | ~33 |
| P4 V2 « Suède, Australie, Singapour, Chili » | 9 381 | ~28 |
| P5 V2 « Vers la capitalisation » | 6 400 | ~19 |
| Conclusion « Choisir, enfin » | 636 | ~2 |
| Appendice « Cinq mensonges » | ~5 000 | ~15 |
| **Total** | **~53 800 mots** | **~160 p.** |
| Footnotes (361 notes) | ~20 000 | (en bas de page) |

Cible 120 p. → la V4 sera dense mais cohérente avec quelques resserrements pendant le fact-check.

---

## Mapping section par section

Légende statut : **C** = copier tel quel · **F** = fusionner avec section adjacente · **R** = réécrire · **S** = supprimer · **D** = doublon à trancher · **N** = nouveau contenu à créer

### `00-avant-propos.md` (cible V4)

| L. V2 | Section V2 | Statut | Notes |
|-------|------------|--------|-------|
| 450-554 | Avant-propos · « Le paradoxe Doliprane » | **C** | 119 surlignages jaunes concentrés ici → passages déjà validés à conserver tels quels. Accepter les track-changes mineurs (Sanofi/Opella/CDR). |

### `01-introduction.md` (cible V4 — À RÉÉCRIRE)

| L. V2 | Section V2 | Statut | Notes |
|-------|------------|--------|-------|
| 555-779 | Introduction (Trois chiffres + La grande illusion + L'objectif du livre + Plan de l'ouvrage) | **R** | Conserver les 3 chiffres-pivots, le ton et les footnotes. **Réécrire le « Plan de l'ouvrage »** pour annoncer la nouvelle structure 3 parties. Agent `capitalisons-writer` invoqué à l'étape C. |

### `02-partie1-capi-repond.md` (cible V4 — fusion ex-P1 + ex-P2 V2)

| L. V2 | Section V2 | Statut V4 | Notes |
|-------|------------|-----------|-------|
| 780 | H1 Partie 1 « Nous n'aurons pas de retraite » (V2) | **R titre** | Devient H1 V4 : **« La capitalisation répond aux problèmes du système de retraite »** |
| 782-787 | « La retraite qui n'existera pas » (sous-titre) | **C** | Conserver comme accroche de partie |
| 788-887 | Anatomie d'un système / 1.1 Le grand vieillissement | **C** | Section diagnostic démographique |
| 888-961 | 1.2 Le déficit caché | **C** | |
| 962-995 | 1.3 Comment on en est arrivé là | **C** | |
| 996-1037 | 1.4 Ces réformes qui n'en sont pas | **C** | |
| 1038-1099 | 1.5 C'est Nicolas qui paie | **C** | Clôt la section « problème » |
| 1100 | H1 Partie 2 « Comprendre la capitalisation » (V2) | **S titre** | Devient simple **H2** dans P1 V4 : *« Comprendre la capitalisation : quand l'argent travaille dans le temps »* |
| 1134-1211 | Anatomie d'un euro cotisé | **C** | Section pivot : passage du diagnostic à la solution |
| 1212-1237 | Ce que la capitalisation n'est pas | **C** | |
| 1238-1271 | Trois familles dans le monde (P2 V2) | **D** | **Doublon** avec l.1464 (P3 V2). Décision : **garder ici** (présentation conceptuelle) et **supprimer** l.1464 (qui réintroduit la même typologie). À confirmer. |
| 1272-1340 | Cotiser moins pour gagner plus | **C** | Démonstration arithmétique |
| 1341-1350 | H1 « Et pour le système, qu'est-ce que ça change ? » | **S H1** | Reste comme H2 conclusif de P1 V4 |
| 1351-1454 | La dépense publique de retraite décroît / Les cotisations sociales peuvent baisser / Les recettes fiscales augmentent / Le PIB croît / Trois bénéfices, un seul mécanisme | **C** | Conclusion macro de P1 V4. **Risque de redite avec l.1864-1908** (P3 V2 « Alléger les dépenses publiques ») → à vérifier en fact-check, possible fusion finale. |

**Volume cible P1 V4** : ~14 500 mots (~43 p.)

### `03-partie2-fonds-pension.md` (cible V4 — ex-P3 V2)

| L. V2 | Section V2 | Statut V4 | Notes |
|-------|------------|-----------|-------|
| 1456 | H1 Partie 3 « La France a besoin de fonds de pension » (V2) | **R titre** | Devient H1 V4 : **« La capitalisation permet d'avoir des fonds de pension »** (titre quasi inchangé, en cohérence avec le souhait de l'auteur) |
| 1458-1463 | « Le capital qui nous échappe » (sous-titre) | **C** | Accroche partie |
| 1464-1501 | Trois familles dans le monde (P3 V2) | **D / S** | **Doublon** avec l.1238 → **à supprimer** (déjà traité en P1 V4) |
| 1502-1535 | Six mille milliards inutiles → qui dorment | **D** | Doublon de titre avec l.1536 (3.1) → **fusionner les deux** en une seule section « Six mille milliards qui dorment ». À vérifier que les contenus se complètent (pas de duplication textuelle). |
| 1536-1589 | 3.1 [Six mille milliards qui dorment] | **F** avec ci-dessus | |
| 1590-1654 | 3.2 240 000 entreprises sans repreneur français | **C** | |
| 1655-1741 | Le hold-up silencieux | **C** | Cœur de l'argument souveraineté |
| 1742-1863 | Si la France avait des fonds de pension (3.5) | **C** | Démonstration projective |
| 1864-1908 | Alléger les dépenses publiques de retraite (+ recettes fiscales + PIB) | **D** | **Possible redite** avec P1 V4 conclusion (l.1351-1454). À trancher : **garder ici** comme conclusion P2 V4, **supprimer** version P1 V4 ; OU inverse. Recommandation : garder en P2 V4 (effets agrégés des fonds de pension) et **alléger** la version P1 V4 (effets sur le système de retraite stricto sensu). |

**Volume cible P2 V4** : ~10 000 mots (~30 p.) après nettoyage des doublons

### `04-partie3-feuille-route.md` (cible V4 — fusion ex-P4 + ex-P5 V2)

| L. V2 | Section V2 | Statut V4 | Notes |
|-------|------------|-----------|-------|
| 1910 | H1 Partie 4 « Suède, Australie, Singapour, Chili : 4 expériences comparées » | **R titre** | Devient H1 V4 : **« Comment on y arrive : ce que les autres pays nous apprennent »** (à valider) |
| 1936-2012 | 4.1 Suède : la preuve par neuf | **C** | |
| 2013-2065 | 4.2 Australie : l'auto-enrolment patronal | **C** | |
| 2066-2115 | 4.3 Singapour : le modèle asiatique mature | **C** | |
| 2116-2300 | 4.4 Chili : l'expérience unique du tout-capitalisation | **C** | Section longue (180 lignes) |
| 2301-2341 | Leçons pour la France | **C** | Pivot vers la feuille de route française |
| 2342-2343 | H1 « Partie III » (reliquat track-changes) | **S** | Vestige à supprimer |
| 2344-2349 | H1 « Refonder / Partie 5 - Vers la capitalisation » | **S H1** | Devient H2 de transition : **« Vingt-cinq ans pour basculer »** |
| 2350-2367 | Les enjeux à lever | **C** | |
| 2368-2487 | Section A — Les grands enjeux structurels | **C** | À renommer en sous-section thématique (sans « Section A ») |
| 2488-2579 | Section B — La méthode politique | **C** | À renommer (sans « Section B ») |
| 2580-2734 | Section C — L'agenda 2027-2052 en quatre phases | **C** | À renommer (sans « Section C ») |
| 2735-2788 | Conclusion « Choisir, enfin » | **C** | **Décision à trancher** : conserver comme conclusion de P3 V4, OU en faire un chapitre séparé `05-conclusion.md` ? Recommandation : **chapitre séparé** (pour cohérence livre). |

**Volume cible P3 V4** : ~15 800 mots (~47 p.)

### `05-conclusion.md` (à confirmer si chapitre séparé)

| L. V2 | Section V2 | Statut V4 | Notes |
|-------|------------|-----------|-------|
| 2735-2788 | Conclusion « Choisir, enfin » | **C** | Si chapitre séparé. Sinon intégrer en queue de P3 V4. |

### `07-appendice-cinq-mensonges.md` (cible V4)

| L. V2 | Section V2 | Statut V4 | Notes |
|-------|------------|-----------|-------|
| 2789-2814 | H1 Appendice + chapeau | **C** | |
| 2815-2836 | Q.1 « La bourse, c'est le casino » | **C** | |
| 2837-2862 | Q.2 « Et Enron, Madoff, Detroit ? » | **C** | |
| 2863-2884 | Q.3 « C'est anti-social » | **C** | |
| 2885-2938 | Q.4 « Le double paiement est insurmontable » | **C** | |
| 2939-2960 | Q.5 « On a déjà essayé : le PER » | **C** | |
| 2961-2982 | Q.6 « La France n'a pas la culture financière » | **C** | |
| 2983-3032 | Conclusion : la fenêtre est ouverte | **C** | Conclut l'appendice. |

### `99-footnotes.md`

| L. V2 | Section V2 | Statut V4 | Notes |
|-------|------------|-----------|-------|
| 3033-4818 | 361 footnotes `[^N]:` | **C + renuméroter** | Renumérotation automatique via Pandoc en fin de parcours. |

---

## Décisions tranchées (29 mai 2026)

| Question | Arbitrage |
|----------|-----------|
| Doublon « Trois familles dans le monde » | **Garder en P2 V4** (fonds de pension). Supprimer la version P1 V4 (l.1238). |
| Doublon « Six mille milliards » | **Fusion confirmée** en une seule section P2 V4. |
| Section conclusive macro (dépenses publiques + recettes + PIB) | **P1 V4 = version allégée** (effet système retraite seul) · **P2 V4 = version complète** (effets macro consolidés des fonds de pension). |
| Conclusion « Choisir, enfin » | **Chapitre séparé `05-conclusion.md`** entre P3 V4 et appendice. |
| Numérotation des sous-sections | **Numérotation 1.1 / 1.2 / 2.1 / 3.1...** propre à chaque nouvelle partie V4 (renumérotation depuis le départ : P1 V4 = 1.1 → 1.X / P2 V4 = 2.1 → 2.X / P3 V4 = 3.1 → 3.X). |
| Titre H1 P3 V4 | Provisoire : « Comment on y arrive : ce que les autres pays nous apprennent ». À confirmer au moment du découpage. |

## Plan numérotation V4 résultant

**Introduction (réécrite par capitalisons-writer)**
- 0.1 « Les Français sont prêts » — **NOUVEAU**, sondages d'opinion récents (Indeed/AG2R/Elabe 2024-2025) en amorce
- 0.2 Trois chiffres (50 % CAC 40 étranger / 240 k entreprises sans actionnariat salarié / 70 % vs 96 %)
- 0.3 La grande illusion
- 0.4 L'objectif du livre
- 0.5 Plan de l'ouvrage en **3 parties** (et non 5)

**P1 V4 — La capitalisation répond aux problèmes du système de retraite**
- 1.1 Le grand vieillissement : quand la pyramide s'inverse
- 1.2 Le déficit caché
- 1.3 Comment on en est arrivé là
- 1.4 Ces réformes qui n'en sont pas
- 1.5 C'est Nicolas qui paie
- 1.6 Anatomie d'un euro cotisé
- 1.7 Ce que la capitalisation n'est pas
- 1.8 Cotiser moins pour gagner plus
- 1.9 **Le RAFP : la capitalisation existe déjà chez nous** — **NOUVEAU**, à écrire (matière agent researcher en background)
- 1.10 Et pour le système, qu'est-ce que ça change ? (version allégée)

**P2 V4 — La capitalisation permet d'avoir des fonds de pension**
- 2.1 Le capital qui nous échappe
- 2.2 Trois familles dans le monde (déplacé ici depuis P1)
- 2.3 Six mille milliards qui dorment (fusion des doublons)
- 2.4 240 000 entreprises sans repreneur français
- 2.5 Le hold-up silencieux
- 2.6 Si la France avait des fonds de pension
- 2.7 **Le cercle vertueux de la capitalisation** — **NOUVEAU**, ~600 mots (cotisations → actifs productifs → croissance → richesse → cotisations)
- 2.8 Alléger les dépenses publiques de retraite (version complète : recettes fiscales + PIB)

**P3 V4 — Comment on y arrive : ce que les autres pays nous apprennent**
- 3.1 Suède : la preuve par neuf
- 3.2 Australie : l'auto-enrolment patronal
- 3.3 Singapour : le modèle asiatique mature
- 3.4 Chili : l'expérience unique du tout-capitalisation
- 3.5 Leçons pour la France
- 3.6 Vingt-cinq ans pour basculer (intro + enjeux à lever)
- 3.7 Les grands enjeux structurels (ex-Section A)
- 3.8 **La méthode politique — « pourquoi pas la France ? »** (ex-Section B) — à enrichir des 4 raisons (héritage Vichy / méfiance culturelle / poids syndicats / paramétriques)
- 3.9 L'agenda 2027-2052 en quatre phases (ex-Section C) — à enrichir du **fonds de transition modèle suédois** (FRR montée en charge pour absorber la double cotisation)

## Règle absolue : aucun chiffre IAP repris tel quel

La présentation IAP du 29 janvier 2025 sert d'inspiration sur le **déroulé argumentaire et les angles**, jamais sur les chiffres. Tous les chiffres du livre V4 seront actualisés via :
- RAFP : rapport annuel 2024 (mai 2025), pas 2023
- COR : rapport juin 2025, pas juin 2024
- OCDE *Pensions at a Glance* : édition 2025, pas 2023
- INSEE / DREES : dernières publications 2025
- Sondages d'opinion : éditions les plus récentes

**Conclusion** (chapitre `05-conclusion.md`) — « Choisir, enfin »

**Appendice** (chapitre `07-appendice-cinq-mensonges.md`) — Q.1 à Q.6

---

## Volume cible V4

| Fichier | Mots cible | Pages |
|---------|-----------|-------|
| 00-avant-propos.md | 2 234 | 7 |
| 01-introduction.md (réécrite) | ~3 500 | 11 |
| 02-partie1-capi-repond.md | ~14 000 | 42 |
| 03-partie2-fonds-pension.md | ~10 000 | 30 |
| 04-partie3-feuille-route.md | ~15 500 | 46 |
| 05-conclusion.md | 636 | 2 |
| 07-appendice-cinq-mensonges.md | ~5 000 | 15 |
| **Total contenu** | **~50 800** | **~153 p.** |
| 99-footnotes.md | ~20 000 | (notes bas de page) |

Cible 120 p. : légèrement au-dessus, ajustable au fact-check par resserrement des passages les plus redondants.

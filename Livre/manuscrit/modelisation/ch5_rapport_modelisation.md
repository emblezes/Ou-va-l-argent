# Rapport méthodologique — Chapitre 5 : Vingt-cinq ans pour basculer
## *Capitalisons. La France et son capital absent*
### Auteur : Emmanuel Blezes / Où Va l'Argent — Mai 2026

---

## 1. Objet de la modélisation

Ce rapport documente les projections macroéconomiques nationales du Chapitre 5 du livre
*Capitalisons*, portant sur quatre scénarios de transition vers un pilier de retraite
capitalisé en France sur la période 2027-2077.

**Question centrale :** Pour chacun des quatre scénarios de bascule, quel encours de
capital sous gestion la France accumule-t-elle à 25 ans (2052) et à 50 ans (2077),
à quelle vitesse les flux de cotisation montent-ils, et quel est l'impact sur le
déficit du système de retraites projeté par le COR ?

Cette modélisation est complémentaire de celle du Chapitre 2 (actif individuel de 30 ans).
Elle porte sur l'agrégat national : non pas un individu, mais 23 millions d'actifs
et une masse salariale brute de 1 100 à 1 250 Md€ selon l'horizon.

---

## 2. Hypothèses paramétriques

Toutes les hypothèses sont datées mai 2026. Les hypothèses vieillissent et devront
être révisées lors d'une mise à jour du livre.

| Paramètre | Valeur | Source | Date |
|---|---|---|---|
| PIB France 2026 | 2 900 Md€ | INSEE Comptes nationaux 2025 | mai 2026 |
| Masse salariale brute 2027 | 1 100 Md€ constants 2026 | INSEE Comptes nationaux 2024 | mai 2026 |
| Croissance salariale réelle | +0,5 %/an | OCDE Economic Outlook 2025 (France) | mai 2026 |
| Masse salariale 2052 (estimée) | ~1 247 Md€ réels 2026 | Calcul modèle | mai 2026 |
| Croissance PIB réelle | +1,2 %/an | OCDE Economic Outlook 2025 | mai 2026 |
| Rendement réel net (central) | 4,0 %/an | CPPIB 10 ans ~7,7 % nominal ≈ 5 % réel ; AP7 Suède ; FRR France 2024 (+6,46 % nominal) | mai 2026 |
| Rendement réel net (bas) | 3,0 %/an | Scénario pessimiste (obligations seules) | mai 2026 |
| Rendement réel net (haut) | 5,0 %/an | Scénario optimiste (portefeuille actions pondéré) | mai 2026 |
| Frais de gestion | 0,3 %/an | AP7 Suède 0,12 % ; ABP NL 0,37 % ; FRR France 0,28 % ; moyenne | mai 2026 |
| Encours initial France 2026 | 200 Md€ | PER ~100 Md€ (AFG 2024) + ERAFP ~37 Md€ + FRR 20,4 Md€ + PERCO+autres ~43 Md€ | mai 2026 |
| Nombre d'actifs | 23 millions (stable) | INSEE projections emploi 2025 | mai 2026 |
| Inflation | 2,0 %/an (non modélisée — euros constants) | Cible BCE | mai 2026 |
| Taux cotisation total retraite | 28 % du brut | DSS 2024 (CNAV 16,9 % + AGIRC-ARRCO 7,7 % + autres) | mai 2026 |
| Déficit COR 2025 | -5,0 Md€ | Rapport COR juin 2025 | juin 2025 |
| Déficit COR 2030 | -6,6 Md€ | Rapport COR juin 2025 | juin 2025 |
| Déficit COR 2070 | -45,0 Md€ | Rapport COR juin 2025 (scenario central ≈ -1,4 % PIB) | juin 2025 |
| FRR encours | 20,4 Md€ | FRR Rapport annuel 2024 | 2025 |
| Espérance de vie à 65 ans | H 20,2 / F 23,9 | INSEE tables 2024 | 2024 |
| Passif implicite retraites | 417 % PIB | Commission européenne Ageing Report 2024 | 2024 |

---

## 3. Méthodologie de calcul

### 3.1 Équation maîtresse (accumulation terme à terme)

L'encours capitalisé est calculé par boucle récursive annuelle :

```
Encours(t) = Encours(t-1) × (1 + r_net) + Flux_cotisations(t)
```

avec :
- `r_net` = rendement réel net de frais (4 % scénario central)
- `Flux_cotisations(t) = taux_capitalisation(t) × Masse_salariale(t)`
- `Masse_salariale(t) = 1 100 × (1 + 0,005)^(t-2027)` Md€ réels 2026
- Versements en FIN d'année (convention comptable standard)
- Tous les montants en euros CONSTANTS 2026

### 3.2 Validation croisée

La boucle récursive est comparée à la formule analytique d'annuité croissante (Brealey, Myers & Allen, 13ème éd.) :

```
FV = C₀ × [(1+r)^n - (1+g)^n] / (r - g)   si r ≠ g
```

Résultat : **écart = 0.000000 %** (seuil d'alerte : 0,01 %) — validation OK.

Vérification multiplicateur composé :
- (1,04)^25 = 2.6658 (attendu ≈ 2,6658)
- (1,04)^50 = 7.1067 (attendu ≈ 7,1067)

### 3.3 Trajectoires de cotisation par scénario

**Scénario A — Australien lent :**
Inspiration : Superannuation Guarantee (ATO) 1992-2025 (+0,27 pt/an pendant 33 ans).
France : montée linéaire 1 % → 6 % sur 25 ans (2027-2052), soit +0,20 pt/an.
Coût intégralement employeur. Coût État = 0.

**Scénario B — Suédois rapide (recyclage) :**
Inspiration : Réforme suédoise 1999 (PPM = 2,5 pts sur 18,5 pts existants).
France : recyclage constant de 2 pts des 28 % de cotisations existantes vers le pilier capitalisé.
Aucune hausse globale. Le pilier répartition perd 2 pts de cotisation → impact sur
les droits NDC (~légère baisse du taux de remplacement, non modélisée ici car hors périmètre).
Coût État = 0. Note : *aggravation du déficit COR de ~2 Md€/an à court terme* car les
cotisations répartition diminuent d'autant.

**Scénario C — Auto-enrolment NEST France :**
Inspiration : The Pensions Regulator UK — montée 2 % (oct. 2012) → 5 % (avr. 2018) → 8 % (avr. 2019).
France : montée 2 % (2028) → 8 % (2036) sur 8 ans (+0,75 pt/an), puis stabilisation.
Opt-out paramétrable (défaut 10 % — cohérent NEST UK historique 8-12 %).
Cotisation effective = taux nominal × (1 - opt_out).
Coût État : ~1,5 Md€/an de tax relief (modèle NEST UK : 1-2 Md£/an).

**Scénario D — Hybride Canada-Australie :**
Phase 1 (2027) : dotation initiale FRR (20.4 Md€) + eurobonds retraite (50.0 Md€).
Phase 2 (2028-2035) : cotisation paritaire +0,5 pt/an → 4 % en 2035.
  Inspiration : CPP Enhancement Canada 2019-2023 (+0,5 pt/an).
Phase 3 (2030-2040) : redéploiement +1 pt AGIRC-ARRCO (accord paritaire conditionnel).
Phase 4 (2040-2052) : stabilisation à 5 % total (4 % paritaire + 1 % AGIRC).
Coût État : ~1,5 Md€/an tax relief + ~2 Md€/an intérêts eurobonds = ~3,5 Md€/an.

### 3.4 Impact sur le déficit COR

Le déficit COR de référence est interpolé linéairement à partir des données du rapport COR 2025 :
- 2025 : -5,0 Md€ ; 2030 : -6,6 Md€ ; 2040 : -15,0 Md€ (interpolé) ; 2070 : -45,0 Md€.

Deux mécanismes correcteurs sont modélisés de façon simplifiée :
1. **Scénario B** : aggravation de -2 Md€/an (les cotisations répartition diminuent de 2 pts)
2. **À partir de 2045 (tous scénarios)** : les rentes capitalisées réduisent les besoins de
   répartition. Estimation : 30 % des rentes versées par le fonds capitalisé réduisent
   les besoins COR (30 % × 2 % d'encours × encours). Effet plafonné au déficit existant.

**Limite importante :** Ce modèle de l'impact sur le déficit COR est une approximation de
premier ordre. Une modélisation rigoureuse nécessiterait un modèle actuariel complet
(tables de mortalité générationnelles, comportements de liquidation, taux de remplacement
cible par scénario). Les chiffres ici sont des ordres de grandeur, non des projections précises.

---

## 4. Tableaux de résultats

### Tableau 1 — Trajectoire de cotisation vers le fonds capitalisé (% masse salariale)

| Année | Sc. A (Australien lent) | Sc. B (Suédois recyclage) | Sc. C (Auto-enrolment) | Sc. D (Hybride Canada-AU) |
|---|---|---|---|---|
| 2027 | 1.0% patronal | 2,00 % recyclé | 0,00 % (démarrage 2028) | 0,00 % (dotation seule) |
| 2028 | 1.2% | 2,00 % | 1.8% | 0.5% paritaire |
| 2030 | 1.6% | 2,00 % | 3.2% | 2.5% (dont 1 % AGIRC) |
| 2032 | 2.0% | 2,00 % | 4.5% | 3.5% |
| 2035 | 2.6% | 2,00 % | 6.5% | 5.0% |
| 2036 | 2.8% | 2,00 % | 7.2% (plafond 8 % brut, 7,2 % net opt-out 10 %) | 5.0% |
| 2040 | 3.6% | 2,00 % | 7.2% | 5.0% |
| 2045 | 4.6% | 2,00 % | 7.2% | 5.0% |
| 2052 | 6.0% (plafond) | 2,00 % | 7.2% | 5.0% (plafond) |
| 2077 | 6.0% | 2,00 % | 7.2% | 5.0% |

*Notes : Sc.A = cotisation patronale pure (coût employeur). Sc.B = recyclage des cotisations existantes (pas de hausse globale). Sc.C = cotisation paritaire avec opt-out 10 % (défaut NEST). Sc.D = paritaire + 1 % AGIRC-ARRCO à partir de 2030 ; dotation initiale FRR 20.4 Md€ + eurobonds 50.0 Md€ en 2027.*

---

### Tableau 2 — Encours capitalisé projeté (Md€ constants 2026, scénario central r = 4 % réel net)

| Année | Sc. A | Sc. B | Sc. C | Sc. D | PIB estimé (Md€) |
|---|---|---|---|---|---|
| 2027 | 219 (8% PIB) | 230 (8% PIB) | 208 (7% PIB) | 281 (10% PIB) | 2,935 |
| 2032 | 362 (12% PIB) | 401 (13% PIB) | 441 (14% PIB) | 466 (15% PIB) | 3,115 |
| 2037 | 601 (18% PIB) | 612 (18% PIB) | 930 (28% PIB) | 857 (26% PIB) | 3,307 |
| 2042 | 959 (27% PIB) | 871 (25% PIB) | 1,589 (45% PIB) | 1,360 (39% PIB) | 3,510 |
| 2047 | 1,466 (39% PIB) | 1,190 (32% PIB) | 2,402 (64% PIB) | 1,981 (53% PIB) | 3,726 |
| **2052** | **2,157 (54% PIB)** | **1,582 (40% PIB)** | **3,404 (86% PIB)** | **2,744 (69% PIB)** | **3,954** |
| 2077 | 9,040 (170% PIB) | 5,313 (100% PIB) | 13,023 (244% PIB) | 10,058 (189% PIB) | 5,328 |

*Note : l'encours initial commun 2026 est de 200 Md€ (PER + ERAFP + FRR + PERCO). Le scénario D inclut en plus la dotation FRR 20.4 Md€ + eurobonds 50.0 Md€ versés en 2027, soit 70 Md€ de dotation initiale supplémentaire. Tous les montants en euros constants 2026 (réels).*

---

### Tableau 3 — Coût budgétaire annuel pour l'État (Md€)

| Poste | Sc. A | Sc. B | Sc. C | Sc. D |
|---|---|---|---|---|
| Coût de la cotisation (État) | 0 | 0 | 0 | 0 |
| Tax relief / incitations fiscales | 0 | 0 | ~1,5 Md€/an | ~1,5 Md€/an |
| Charge intérêts eurobonds | 0 | 0 | 0 | ~2.0 Md€/an |
| Perte cotisations sociales (Sc.B) | 0 | ~0 (recyclage, pas de perte nette) | 0 | 0 |
| **Coût budgétaire total estimé** | **0** | **0** | **~1,5 Md€/an** | **~3.5 Md€/an** |
| Coût cumulé 2027-2052 | 0 | 0 | ~37 Md€ | ~88 Md€ |

*Sources : ATO SG 1992-2025 (Sc.A : coût intégralement employeur, zéro pour l'État) ;
DWP UK *Ten Years of Auto-Enrolment* 2022 (tax relief NEST 1-2 Md£/an) ; CPP Canada
*CRA Historical Contribution Rates* (coût État zéro) ; eurobonds : taux souverain France
2026 ~4 % sur 50 Md€ = 2 Md€/an d'intérêts.*

*Note méthodologique : Le scénario B (recyclage) ne génère pas de coût budgétaire
direct pour l'État, mais implique une légère aggravation du déficit COR à court terme
(-2 Md€/an environ) du fait de la réduction des cotisations répartition.*

---

### Tableau 4 — Impact sur le déficit COR projeté (Md€, négatif = déficit)

| Année | Référence (statu quo) | Sc. A | Sc. B | Sc. C | Sc. D |
|---|---|---|---|---|---|
| 2027 | -5.6 | -5.6 | -7.6 | -5.6 | -5.6 |
| 2030 | -6.6 | -6.6 | -8.6 | -6.6 | -6.6 |
| 2040 | -15.0 | -15.0 | -17.0 | -15.0 | -15.0 |
| 2050 | -30.0 | -18.9 | -23.5 | -12.1 | -15.5 |
| 2052 | -31.6 | -18.7 | -24.1 | -11.2 | -15.1 |
| 2070 | -45.0 | -6.8 | -23.8 | 0.0 | -1.6 |

*Interprétation : les effets sur le déficit COR sont faibles avant 2045 (les rentes capitalisées
ne sont pas encore versées à grande échelle). L'effet favorable devient sensible après 2045,
quand les premières cohortes ayant cotisé 20+ ans commencent à liquider leur capital.
À 2052-2070, les scénarios A, C, D réduisent le déficit de 5 à 15 Md€/an selon le rendement.*

*Avertissement : cette modélisation de l'impact COR est une approximation de premier ordre.
Elle ne remplace pas une projection actuarielle complète avec tables de mortalité générationnelles
et modélisation des comportements de liquidation.*

---

### Tableau 5 — Synthèse comparative 2052 (scénario central, 4 % réel net)

| | Sc. A | Sc. B | Sc. C | Sc. D |
|---|---|---|---|---|
| **Modèle de référence** | Australie SG | Suède NDC/PPM | Royaume-Uni NEST | Canada CPP + Australie |
| **Cotisation finale 2052** | 6.0% masse sal. | 2,00 % recyclé | 7.2% (net opt-out) | 5.0% paritaire+AGIRC |
| **Flux annuel 2052 (Md€/an)** | 75 | 25 | 90 | 62 |
| **Encours 2052 (Md€)** | 2,157 | 1,582 | 3,404 | 2,744 |
| **Encours 2052 (% PIB)** | 54 % | 40 % | 86 % | 69 % |
| **Capital moyen/actif 2052** | 94 k€ | 69 k€ | 148 k€ | 119 k€ |
| **Cotis. cumulées 2027-2052 (Md€)** | 1,083 | 609 | 1,842 | 1,290 |
| **Effet rendement composé** | 1.99x | 2.60x | 1.85x | 2.13x |
| **Encours 2077 (Md€)** | 9,040 | 5,313 | 13,023 | 10,058 |
| **Coût budgétaire État** | 0 | 0 | ~1,5 Md€/an | ~3.5 Md€/an |
| **Accessibilité politique** | ★★★ | ★ | ★★ | ★★ |
| **Atteint la cible 1 500 Md€ ?** | Oui | Oui | Oui | Oui |

*La cible de 1 500 Md€ (50 % du PIB estimé 2052) est celle posée au Chapitre 3,
cohérente avec la moyenne Canada (~25 % PIB à mi-parcours de leur transition)
et l'objectif de longue terme vers 100 % PIB (moyenne pondérée OCDE Thinking Ahead Institute 2025).*

---

## 5. Analyse de sensibilité

### 5.1 Sensibilité au rendement réel net (scénario D)

| Rendement réel net | Encours 2052 (Md€) | Encours 2077 (Md€) | Ratio /PIB 2052 |
|---|---|---|---|
| 3 % (pessimiste) | 2,364 | 7,356 | 60 % |
| **4 % (central)** | **2,744** | **10,058** | **69 %** |
| 5 % (optimiste) | 3,201 | 13,976 | 81 % |

### 5.2 Sensibilité à la croissance salariale réelle (scénario D)

| Croissance salariale réelle | Encours 2052 (Md€) | Masse sal. 2052 (Md€) |
|---|---|---|
| 0 % (stagnation) | 2,619 | 1,100 |
| **0,5 % (central)** | **2,744** | **1,246** |
| 1,0 % (optimiste) | 2,879 | 1,411 |

### 5.3 Sensibilité au taux d'opt-out (scénario C uniquement)

| Taux d'opt-out | Encours 2052 (Md€) | Capital/actif 2052 (k€) |
|---|---|---|
| 5 % (optimiste — quasi-universelle) | 3,562 | 155 |
| **10 % (central — NEST UK historique)** | **3,404** | **148** |
| 20 % (pessimiste) | 3,087 | 134 |

*Source opt-out historique : DWP UK *Ten Years of Auto-Enrolment in Workplace Pensions*, 2022.
Taux d'opt-out observé 2012-2022 : 8 à 12 %, jamais au-delà de 25 %.*

---

## 6. Vérifications croisées avec données empiriques

### 6.1 Australie (32 ans de Superannuation Guarantee — référence principale)

| Indicateur | Données réelles 2025 | Modèle France Sc.A 2052 (25 ans) |
|---|---|---|
| Encours/PIB | ~160 % (4 300 Md AUD / 2 700 Md AUD) | 54 % |
| Taux cotisation atteint | 12 % du salaire brut | 6 % de la masse sal. |
| Durée depuis lancement | 33 ans (1992-2025) | 25 ans (2027-2052) |
| Couverture salariés | 93 % | n.d. |

*Cohérence : La France vise 6 % en 25 ans vs l'Australie à 12 % en 33 ans → encours/PIB
moindre attendu, conformément au résultat du modèle (~54 % vs ~160 %).*

### 6.2 Suède AP-fonds + PPM (25 ans de NDC — référence Scénario B)

| Indicateur | Données réelles 2024 | Modèle France Sc.B 2052 (25 ans) |
|---|---|---|
| AP-fonds total / PIB | ~30 % (2 100 Md SEK / 7 000 Md SEK) | (hors périmètre — fonds de lissage) |
| PPM capitalisation individuelle / PIB | ~29 % (~2 000 Md SEK / 7 000 Md SEK) | ~40 % |
| Taux PPM | 2,5 pts sur 18,5 % total | 2,0 pts sur 28 % total |

*Cohérence : Le scénario B est légèrement moins ambitieux que la Suède (2 pts vs 2,5 pts PPM),
sur une durée comparable. L'encours modélisé (1,582 Md€, ~40 % PIB)
est cohérent avec la trajectoire PPM suédoise à 25 ans.*

### 6.3 Canada CPPIB (28 ans — référence Scénario D)

| Indicateur | Données réelles 2025 | Scénario D 2052 |
|---|---|---|
| Actifs CPPIB / PIB Canada | ~25 % (714 Md CAD / 2 900 Md CAD) | 69 % PIB France |
| Rendement annualisé 10 ans | ~7,7 % nominal ≈ 5,7 % réel | 4 % réel (hypothèse prudente) |
| Cotisation totale atteinte | 9,9 % (partagée 4,95/4,95) | 5 % (4 % paritaire + 1 % AGIRC) |

*Note : CPPIB ne couvre qu'environ 30-40 % du remplacement canadien — le scénario D vise
un pilier complémentaire comparable, d'où un ratio /PIB plus élevé que le Canada seul.*

---

## 7. Limites du modèle

1. **Comportements non modélisés** : substitution épargne privée / épargne obligatoire
   (si la capitalisation obligatoire se substitue à l'épargne volontaire PER, l'encours net
   n'augmente pas d'autant) ; comportements de liquidation anticipée ; mobilité internationale.

2. **Fiscalité non modélisée** : exonérations de cotisations, CSG sur les rentes, imposition
   des sorties en capital. Le tax expenditure réel est sous-estimé dans le Tableau 3.

3. **Chocs et discontinuités** : crises financières (2008 : -40 % actions), changements
   politiques (pause australienne 2014-2021), hausse des taux d'intérêt. Le modèle est
   déterministe — il ne simule pas de Monte Carlo sur les rendements.

4. **Dynamique du marché du travail** : l'hypothèse de 23 millions d'actifs stables masque
   les effets de la démographie (baisse tendancielle projetée par l'INSEE à partir de 2035-2040).

5. **Incidence salariale non modélisée** : le modèle ne simule pas l'accord de modération
   salariale qui, dans les modèles australien et canadien, fait supporter le coût par les
   salariés (salaire immédiat réduit d'autant). En France, l'absence d'accord équivalent
   ferait peser le coût sur les employeurs, avec impact potentiel sur l'emploi.

6. **Inflation non modélisée** : tous les montants sont en euros constants 2026. L'inflation
   2 %/an gonflerait les montants nominaux d'un facteur (1,02)^25 ≈ 1,64 à 25 ans.

7. **Consolidation des fonds** : la modélisation suppose un fonds unique (FFC). En réalité,
   une multiplicité de fonds (AGIRC-ARRCO, PER, sectoriels) fragmenterait les économies
   d'échelle et augmenterait les frais au-delà des 0,3 %/an hypothésés.

8. **Impact COR à long terme** : la modélisation de l'impact sur le déficit COR après 2045
   est une approximation de premier ordre. Une projection actuarielle complète avec tables
   de mortalité générationnelles et modélisation des comportements de liquidation est nécessaire
   pour affiner ces chiffres.

---

## 8. Récapitulatif pour le rédacteur du Chapitre 5

**Scénario D central (hybride Canada-Australie, r = 4 % réel net) :**
- Encours 2052 : **2,744 Md€** (~69 % du PIB estimé 2052)
- Encours 2077 : **10,058 Md€** (~189 % du PIB estimé 2077)
- Capital moyen par actif en 2052 : **119 k€/actif**
- Flux de cotisations en 2052 : **62 Md€/an**
- Cotisations cumulées 2027-2052 : **1,290 Md€**
- Effet multiplicateur du rendement composé : **2.13x les cotisations versées**

**Fourchette scénario D à 2052 :**
- Pessimiste (3 % réel net) : 2,364 Md€
- Central (4 % réel net) : 2,744 Md€
- Optimiste (5 % réel net) : 3,201 Md€

**Validation croisée :**
- Écart formule FV vs boucle récursive : 0.000000 % (seuil 0,01 % — OK)
- Cohérence Australie, Suède, Canada : confirmée (voir section 6)

---

*Rapport généré automatiquement par `ch5_modelisation.py` — Mai 2026*
*Reproductible : exécuter `python ch5_modelisation.py` dans le dossier `modelisation/`*

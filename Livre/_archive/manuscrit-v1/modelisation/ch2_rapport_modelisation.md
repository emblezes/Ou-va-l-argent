# Modélisation Ch. 2 — *Capitalisons*
## Fiche méthodologique complète

**Produite par** : Emmanuel Blezes / Où Va l'Argent  
**Date** : Mai 2026  
**Version** : 1.0 — après correction de l'erreur de modélisation antérieure (228 270 € erroné)  
**Script** : `ch2_modelisation.py` (Python 3, numpy/pandas/matplotlib)

---

## 1. Hypothèses paramétriques

| Paramètre | Valeur | Source / Justification |
|---|---|---|
| Salaire brut initial (2026) | 35 000 €/an | Proche du salaire moyen brut France (~37 000 € DARES 2024) |
| Âge de départ fictif | 73 ans (30 + 43) | Durée maximale théorique 43 annuités |
| Durée de cotisation n | 43 ans | Code de la sécurité sociale post-réforme 2023 |
| Inflation | 2,0 %/an | **Non utilisée** — tous les calculs en euros constants 2026 |
| Croissance du salaire réel | +0,5 %/an | Scénario 1 % de croissance de la masse salariale, COR Rapport annuel 2025, p. 42 |
| Taux de cotisation retraite total | 28 % du brut | Régime général (16,9 %) + Agirc-Arrco (7,7 %) + autres ≈ 28 % ; DSS Compte de la protection sociale 2024 |
| Frais de gestion fonds capitalisé | 0,30 %/an | AP7 Såfa (Suède) : 0,07 % ; ABP (Pays-Bas) : ~0,25 % — retenu 0,30 % par prudence |
| Espérance de vie résiduelle à 73 ans | 15,5 ans (mixte H/F) | INSEE Tables de mortalité 2024 : H 13,9 ans + F 16,8 ans → moyenne pondérée ~15,4 → arrondi 15,5 |
| TRN pilier répartition (scénario A) | 74,4 % du salaire net | COR Rapport annuel 2025, génération 1963, taux de remplacement net tous régimes, p. 76 |
| Rendement réel net (central) | 3,70 % (4,00 % − 0,30 % frais) | Rendement réel brut 4 % : Martinot, *Pour une retraite par capitalisation en France*, Fondapol 2022, p. 18 ; AP7 Suède performance réelle nette ~5 % ; ABP Pays-Bas performance réelle nette ~4 % LT |
| Salaire net | brut × 77 % | Charges salariales ~23 % (URSSAF taux moyens 2024) |

---

## 2. Trois scénarios

### Scénario A — Répartition pure (statu quo)
- 100 % des cotisations en répartition
- Aucun pilier capitalisé → capital = 0
- Pension = TRN 74,4 % × salaire net final
- TRI implicite du système : ~1,5 % réel (Dubois & Marino, INSEE Économie & Statistique n°481-482, 2015)

### Scénario B — Mixte 80/20 (modèle suédois)
- 80 % des cotisations restent en répartition (NDC suédois)
- 20 % partent en capitalisation (PPM suédois = 5,6 % du brut)
- Cotisation capi C0 = 35 000 × 28 % × 20 % = **1 960 €/an** (première année)
- Pension répartition = TRN_A × 80 % = 59,52 % du salaire net

### Scénario C — Mixte 60/40 (modèle néerlandais simplifié)
- 60 % des cotisations en répartition (1er pilier AOW)
- 40 % en capitalisation (2e pilier ABP/PFZW obligatoire = 11,2 % du brut)
- Cotisation capi C0 = 35 000 × 28 % × 40 % = **3 920 €/an** (première année)
- Pension répartition = TRN_A × 60 % = 44,64 % du salaire net

---

## 3. Méthodologie de calcul

### 3.1 Capital accumulé (formule annuité croissante)

Les versements annuels croissent avec le salaire réel (+0,5 %/an). La formule de la valeur future d'une annuité croissante (versements en **fin** de période) est :

**Si r ≠ g :**
$$FV = C_0 \times \frac{(1+r)^n - (1+g)^n}{r - g}$$

**Si r = g :**
$$FV = C_0 \times n \times (1+r)^{n-1}$$

Avec :
- $C_0$ = première cotisation annuelle (€ constants 2026)
- $r$ = rendement réel **net** de frais (= rendement brut − 0,30 %)
- $g$ = croissance réelle du salaire = 0,5 %
- $n$ = durée de cotisation = 43 ans

**Validation** : la formule est validée à 0,0000 % d'écart par une boucle de récurrence terme à terme (voir section vérifications).

### 3.2 Rente viagère

Modèle rente certaine sur durée = espérance de vie résiduelle à 73 ans = 15,5 ans.

$$R_{annuelle} = Capital \times \frac{r_{rente}}{1 - (1+r_{rente})^{-d}}$$

avec $r_{rente}$ = 2 % réel (rendement prudentiel phase liquidation) et $d$ = 15,5 ans.

### 3.3 Pension de répartition

$$P_{repartition} = Salaire_{net,final} \times TRN_A \times (1 - part_{capi})$$

Le salaire net final = 35 000 × (1,005)^42 × 0,77 = **33 230 €/an** (euros constants 2026).

### 3.4 Pension totale

$$P_{totale} = P_{repartition} + R_{annuelle,capi}$$

---

## 4. Résultats — Scénarios centraux (r = 4 % réel brut, n = 43 ans)

| Indicateur | A — Répartition | B — 80/20 | C — 60/40 |
|---|---:|---:|---:|
| Cotisation capi C0 (€/an) | 0 | 1 960 | 3 920 |
| Cumul cotisations réelles (€) | 0 | 93 766 | 187 531 |
| **Capital à 73 ans (€)** | **0** | **216 240** | **432 480** |
| Rente mensuelle (€/mois) | 0 | 1 364 | 2 727 |
| Pension répartition (€/an) | 24 723 | 19 779 | 14 834 |
| **Pension totale (€/an)** | **24 723** | **36 142** | **47 560** |
| Pension mensuelle totale | 2 060 | 3 012 | 3 963 |
| Cumul 20 ans de retraite (€) | 494 466 | 722 830 | 951 195 |
| **Écart cumul vs A (€)** | — | **+228 364** | **+456 729** |

### Lecture des résultats

- **Scénario B central** : l'actif touche 3 012 €/mois à 73 ans au lieu de 2 060 €/mois, soit +46 % de pension. Sur 20 ans de retraite, le gain cumulé est de +228 364 €.
- **Scénario C central** : +92 % de pension vs A, gain cumulé +456 729 € sur 20 ans.
- **Effet de levier du rendement** : la différence entre 3 % et 5 % réel sur 43 ans fait passer le capital de scénario B de 170 k€ à 278 k€ — une amplitude de 108 k€ pour un même effort de cotisation (94 k€ cumulés). C'est l'effet de la capitalisation composée sur longue durée.

---

## 5. Analyse de sensibilité — Scénario B (80/20)

| Rendement réel brut | Capital à 73 ans | Pension totale (€/an) | Écart cumul 20 ans vs A |
|---|---:|---:|---:|
| 3 % | 169 731 € | 32 622 € | +157 977 € |
| **4 % (central)** | **216 240 €** | **36 142 €** | **+228 364 €** |
| 5 % | 278 461 € | 40 850 € | +322 529 € |

### Scénario C (60/40)

| Rendement réel brut | Capital à 73 ans | Pension totale (€/an) | Écart cumul 20 ans vs A |
|---|---:|---:|---:|
| 3 % | 339 461 € | 40 521 € | +315 954 € |
| **4 % (central)** | **432 480 €** | **47 560 €** | **+456 729 €** |
| 5 % | 556 922 € | 56 976 € | +645 058 € |

---

## 6. Comparaison avec la littérature existante

| Source | Valeur de référence | Notre modèle |
|---|---|---|
| **Martinot, Fondapol 2022** | Capital constitutif ~200 k€ pour pension de ~1 200 €/mois sur 20 ans (hypothèses proches) | Capital B = 216 k€, rente = 1 364 €/mois — cohérent ✓ |
| **COR 2025, TRN génération 1963** | 74,4 % net pour taux plein | Utilisé tel quel ✓ |
| **OCDE *Pensions at a Glance* 2023** | TRN France ~74 % net (médian OCDE ~58 %) | Cohérent ✓ |
| **AP7 Suède, performance réelle nette** | ~5 % à long terme (2000-2023) | Notre rendement central 3,70 % net est prudent ✓ |
| **ABP Pays-Bas** | Rendement réel net ~4 % sur 20 ans | Cohérent avec notre scénario B-C 4 % ✓ |

---

## 7. Vérifications croisées exécutées

1. **Formule FV vs boucle récursive terme à terme** : écart = 0,0000 % (seuil : 0,01 %) — VALIDÉ
2. **Formule exacte vs formule simplifiée ordre de grandeur** : écart = 5,3 % (seuil : 10 %) — VALIDÉ (attendu : la formule simplifiée est approximative par construction)
3. **Cohérence avec Martinot Fondapol 2022** : ordres de grandeur concordants
4. **Dernier versement** : 1 960 × (1,005)^42 = 2 417 € — conforme à l'énoncé (2 416 €)
5. **Cumul cotisations** : 93 766 € — conforme à l'énoncé (~93 700 €)

---

## 8. Limites du modèle

1. **Pas de modèle actuariel complet** : ce n'est pas un calcul Destinie 2 (INSEE) ni un modèle paramétrique COR. Il s'agit d'une simulation déterministe simplifiée.
2. **Rente certaine, pas viagère probabiliste** : on utilise l'espérance de vie résiduelle comme durée certaine, non une table de mortalité complète. La rente vraiment viagère (avec aléa de longévité) serait légèrement inférieure.
3. **Rendement réel net supposé constant** : en réalité le rendement fluctue. Un stress test -30 % en fin de carrière réduirait significativement le capital final.
4. **TRN de répartition proportionnel à la part cotisée** : hypothèse simplificatrice. En réalité la réforme NDC suédoise a des mécanismes plus complexes (buffer funds, mécanisme d'équilibre automatique).
5. **Double cotisation absente** : pendant la transition, les actifs cotisent à la fois pour financer les retraités actuels ET pour capitaliser — ce coût de transition n'est pas modélisé ici (il fait l'objet d'un chapitre distinct).
6. **Fiscalité non modélisée** : la rente du pilier capitalisé et la pension de répartition ont des traitements fiscaux différents selon le véhicule (PER, fonds de pension...). Les chiffres sont pré-impôt.
7. **Hypothèse de carrière complète** : 43 ans sans interruption. Les carrières hachées (femmes, chômage) réduiraient le capital accumulé.
8. **Croissance salariale uniforme** : la croissance +0,5 %/an est supposée constante, sans choc macro.

---

## 9. Fichiers produits

| Fichier | Contenu |
|---|---|
| `ch2_modelisation.py` | Script Python autonome, exécutable seul |
| `ch2_resultats.csv` | Résultats centraux 3 scénarios (16 colonnes) |
| `ch2_sensibilite.csv` | 72 lignes × combinaisons rendement/durée/croissance |
| `ch2_courbes.png` | Graphique PNG 300 dpi, charte OVLA |
| `ch2_rapport_modelisation.md` | Ce fichier |

---

*Modélisation reproductible : seed non requis (modèle déterministe). Pour reproduire : `python3 ch2_modelisation.py` depuis le répertoire `modelisation/`.*

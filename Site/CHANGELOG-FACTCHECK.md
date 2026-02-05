# Changelog - Vérification Factuelle du Site

Ce fichier documente toutes les corrections apportées suite aux vérifications de l'équipe Deep Research.

---

## 2025-02-03 - Revue Page d'Accueil

### Fichiers modifiés
- `lib/constants/budget.ts`
- `components/sections/FAQ.tsx`
- `components/sections/Hero.tsx`
- `components/sections/BudgetGrid.tsx`

### Corrections apportées

#### 1. BUDGET_2025 (budget.ts)

| Champ | Ancienne valeur | Nouvelle valeur |
|-------|-----------------|-----------------|
| `detteTotale` | 3150 Md€ | **3482 Md€** |
| `dettePIB` | 110.6% | **117.4%** |
| `detteParHabitant` | 46200€ | **50800€** |
| `totalDepenses` | 1607 Md€ | **1670 Md€** |
| `deficit` | -179 Md€ | **-169 Md€** |

#### 2. MINISTRIES - Protection Sociale (budget.ts)

| Champ | Ancienne valeur | Nouvelle valeur |
|-------|-----------------|-----------------|
| `amount` (sante) | 815 Md€ | **932 Md€** |
| `percent` (sante) | 50.7% | **55.8%** |

#### 3. FAQ - Erreur critique IR (FAQ.tsx)

| Ancienne formulation | Nouvelle formulation |
|---------------------|----------------------|
| "44% des Français ne paient pas d'IR" | **"56% des Français ne paient pas d'IR"** |

#### 4. FAQ - Détenteurs de la dette (FAQ.tsx)

| Ancienne formulation | Nouvelle formulation |
|---------------------|----------------------|
| "48% par des investisseurs étrangers" | **"55% par des investisseurs étrangers"** |
| "27% par des investisseurs français" | **"25% par des investisseurs français"** |
| "25% par la BCE" | **"20% par la BCE/Eurosystème"** |

#### 5. Hero - Compteur dette (Hero.tsx)

| Champ | Ancienne valeur | Nouvelle valeur |
|-------|-----------------|-----------------|
| `debtPerSecond` | 1800 €/s | **5350 €/s** |

### Sources officielles utilisées

| Source | URL | Données utilisées |
|--------|-----|-------------------|
| INSEE - Dette T3 2025 | https://www.insee.fr/fr/statistiques/8686951 | Dette 3482 Md€, ratio 117.4% |
| INSEE - Déficit 2024 | https://www.insee.fr/fr/statistiques/8540375 | Déficit -168.6 Md€ |
| INSEE - Dépenses APU | https://www.insee.fr/fr/statistiques/8574705 | Dépenses 1670 Md€ |
| DREES - Protection sociale | https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/panoramas-de-la-drees/251217-protection-sociale-france-europe-2024 | 932.5 Md€ |
| DGFiP - IR 2024 | https://www.impots.gouv.fr/dgfip-statistiques-limpot-sur-le-revenu-2024-ete-plus-dynamique-que-les-revenus | 44% imposables, 56% non imposables |
| IFRAP - Détenteurs dette | https://www.ifrap.org/budget-et-fiscalite/analyse-des-47-de-la-dette-publique-francaise-detenue-par-des-etrangers | 55% non-résidents |

---

## 2025-02-03 - Revue Page Dépenses

### Fichiers modifiés
- `app/depenses/page.tsx`

### Corrections apportées

#### 1. YEARS_DATA - Données annuelles (INSEE base 2020)

| Année | Ancien total | Nouveau total | Ancien déficit | Nouveau déficit |
|-------|--------------|---------------|----------------|-----------------|
| 2025 | 1 607 Md€ | **1 695 Md€** | -179 Md€ | **-155 Md€** |
| 2024 | 1 577 Md€ | **1 670 Md€** | -176 Md€ | **-169 Md€** |
| 2023 | 1 537 Md€ | **1 607 Md€** | -157 Md€ | **-152 Md€** |
| 2022 | 1 489 Md€ | **1 549 Md€** | -144 Md€ | **-126 Md€** |

#### 2. Dépenses par seconde

| Champ | Ancienne valeur | Nouvelle valeur |
|-------|-----------------|-----------------|
| €/seconde | 50 963 € | **52 960 €** |

### Sources officielles utilisées

| Source | URL | Données utilisées |
|--------|-----|-------------------|
| INSEE - Comptes APU 2024 | https://www.insee.fr/fr/statistiques/8574492 | Dépenses/recettes historiques |
| INSEE - Dépenses détaillées | https://www.insee.fr/fr/statistiques/8574705?sommaire=8574832 | 1670.2 Md€ en 2024 |
| PLF 2025 | https://www.budget.gouv.fr/budget-etat | Prévisions 2025 |

---

## 2025-02-03 - Revue Page Dettes

### Fichiers modifiés
- `app/dettes/page.tsx`

### Corrections apportées

#### 1. KPI Cards (INSEE T3 2025)

| Champ | Ancienne valeur | Nouvelle valeur |
|-------|-----------------|-----------------|
| Dette totale | 3 150 Md€ | **3 482 Md€** |
| Dette/PIB | 110.6% | **117.4%** |
| Par habitant | 46 200 € | **50 800 €** |
| Charge d'intérêts | 52 Md€/an | **54 Md€/an** |
| €/seconde | +1 800 €/s | **+5 350 €/s** |

#### 2. DEBT_HOLDERS - Détenteurs de la dette

| Détenteur | Ancienne valeur | Nouvelle valeur |
|-----------|-----------------|-----------------|
| Investisseurs étrangers | 48% | **55%** |
| Investisseurs français | 27% | **25%** |
| BCE/Eurosystème | 25% | **20%** |

#### 3. CRISIS_TIMELINE - Impact des crises

| Crise | Ancienne valeur | Nouvelle valeur |
|-------|-----------------|-----------------|
| 2008 Subprimes | +320 Md€ | **+280 Md€** |
| 2010 Euro | +280 Md€ | **+230 Md€** |
| 2020 COVID | +420 Md€ | **+300 Md€** |
| 2022 Énergie | +85 Md€ | **+90 Md€** |

### Sources officielles utilisées

| Source | URL | Données utilisées |
|--------|-----|-------------------|
| INSEE - Dette T3 2025 | https://www.insee.fr/fr/statistiques/8686951 | 3482 Md€, 117.4% PIB |
| IFRAP - Détenteurs | https://www.ifrap.org/budget-et-fiscalite/analyse-des-47-de-la-dette-publique-francaise-detenue-par-des-etrangers | Répartition détenteurs |
| Vie Publique - Dette 2025 | https://www.vie-publique.fr/en-bref/299569-la-dette-francaise-en-2025-les-principaux-chiffres | Charge 54-55 Md€ |
| OFCE - Crises | https://www.ofce.sciences-po.fr/blog2024/fr/2024/20240524_RSMPXR/ | Impact crises sur dette |
| AFT | https://www.aft.gouv.fr/en/debt-key-figures | Maturité dette |

---

## 2025-02-03 - Revue Page Impôts

### Fichiers modifiés
- `app/impots/page.tsx`

### Corrections apportées

#### 1. TAX_CARDS - Montants des impôts

| Impôt | Ancienne valeur | Nouvelle valeur |
|-------|-----------------|-----------------|
| TVA | 212 Md€ | **204 Md€** |
| IR | 102 Md€ | **92 Md€** |
| IS | 68 Md€ | **57 Md€** |
| CSG/CRDS | 145 Md€ | **163 Md€** |
| Taxes foncières | 52 Md€ | **55 Md€** |
| TICPE | 33 Md€ | **30 Md€** |

#### 2. KPI Cards - Recettes par administration

| Administration | Ancienne valeur | Nouvelle valeur |
|----------------|-----------------|-----------------|
| Recettes État | 423 Md€ | **548 Md€** |
| Recettes Sécu | 636 Md€ | **640 Md€** |
| Recettes locales | 312 Md€ | **313 Md€** |
| **Contribution UE** | 57 Md€ | **21 Md€** |

#### 3. Bannière - Totaux

| Champ | Ancienne valeur | Nouvelle valeur |
|-------|-----------------|-----------------|
| Taux prélèvements | 45.4% | **45.3%** |
| Total recettes | 1 428 Md€ | **1 502 Md€** |

#### 4. EU_TAX_COMPARISON - Comparaison européenne

| Pays | Ancienne valeur | Nouvelle valeur |
|------|-----------------|-----------------|
| Danemark | 46.9% | **45.8%** |
| France | 45.4% | **45.3%** |
| Belgique | 44.2% | **45.1%** |
| Allemagne | 41.8% | **40.9%** |

### Sources officielles utilisées

| Source | URL | Données utilisées |
|--------|-----|-------------------|
| DGFiP - TVA 2024 | https://www.impots.gouv.fr/dgfip-statistiques-estimation-de-la-tva-2024-une-augmentation-en-deca-de-la-croissance-du-pib | TVA 204 Md€ |
| DGFiP - IR 2024 | https://www.impots.gouv.fr/dgfip-statistiques-limpot-sur-le-revenu-2024-ete-plus-dynamique-que-les-revenus | IR 92 Md€ |
| DGFiP - Taxe foncière | https://www.impots.gouv.fr/dgfip-statistiques-une-hausse-de-la-taxe-fonciere-en-2024-entrainee-par-lindexation-sur-linflation | TF 55.3 Md€ |
| INSEE - Recettes APU | https://www.insee.fr/fr/statistiques/8574705 | Recettes locales 313 Md€ |
| Commission UE | https://france.representation.ec.europa.eu/informations/combien-nous-coute-leurope-2025-11-17_fr | Contribution 21 Md€ |
| Eurostat | https://www.budget.gouv.fr/panorama-finances-publique/comparaison-europeenne | Comparaison européenne |
| INSEE - Prélèvements | https://www.insee.fr/fr/statistiques/2381412 | Taux 45.3% |

---

## Pages restantes à vérifier

- [x] ~~Page d'accueil (page.tsx)~~ ✅ Corrigée le 2025-02-03
- [x] ~~Page Dépenses (depenses/page.tsx)~~ ✅ Corrigée le 2025-02-03
- [x] ~~Page Dettes (dettes/page.tsx)~~ ✅ Corrigée le 2025-02-03
- [x] ~~Page Impôts (impots/page.tsx)~~ ✅ Corrigée le 2025-02-03
- [x] ~~Page Simulateur~~ ✅ Déjà vérifiée
- [ ] Page Propositions (propositions/page.tsx)
- [ ] Page WTF (wtf/page.tsx)
- [ ] Pages secondaires (blog, news, dashboard, infographies)

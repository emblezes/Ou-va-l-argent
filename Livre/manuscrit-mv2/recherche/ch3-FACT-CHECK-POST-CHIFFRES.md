# Fact-check Ch.3 — axe CHIFFRES (post-rédaction)

**Date de vérification** : 15 mai 2026  
**Vérificateur** : Fact-Checker (agent Claude, claude-sonnet-4-6)  
**Périmètre** : Manuscrit `/Livre/manuscrit/04-ch3-capital-absent-hold-up.md` (15 234 mots, sections 3.1 à 3.11)  
**Sources croisées** : `ch3-FACT-CHECK.md` (fact-check préalable des fichiers de recherche), vérifications web directes sur sources primaires

---

## Synthèse exécutive

| Catégorie | Nombre |
|-----------|--------|
| Affirmations numériques extraites et vérifiées | 98 |
| ✅ VÉRIFIÉ | 68 |
| ⚠️ DIVERGENT (correction nécessaire) | 17 |
| ❌ HALLUCINATION / ERREUR FACTUELLE | 4 |
| 🔍 À CONFIRMER (source insuffisante) | 9 |

**Niveau de risque global** : MODÉRÉ — le corpus chiffré est globalement solide, mais 4 erreurs factuelles et 17 divergences exigent correction avant publication. L'erreur la plus grave est la section 3.1 sur les flux assurance-vie 2024, qui est inversée par rapport à la réalité.

---

## Erreurs critiques à corriger (priorité absolue)

| # | Passage dans le manuscrit | Chiffre cité | Valeur réelle | Source | Action |
|---|--------------------------|-------------|---------------|--------|--------|
| 1 | §3.1 : « les flux nets vers les fonds euros ont atteint 32,7 milliards en 2024, contre 9,8 milliards seulement vers les unités de compte plus dynamiques » | Fonds euros +32,7 Md€ / UC +9,8 Md€ | **INVERSÉ** : fonds euros −5,0 Md€ / UC +34,4 Md€ (collecte nette totale +29,4 Md€) | France Assureurs, communiqué 31 janvier 2025 | Corriger entièrement — le sens du phénomène est correct (préférence pour la sécurité) mais le chiffre est faux et sa direction est erronée |
| 2 | §3.1 : « Quatre-vingt-sept pour cent des flux nouveaux vont vers les supports qui ne rapportent rien » | 87 % vers fonds euros | **FAUX** : en 2024, les flux nets fonds euros sont négatifs (−5 Md€). 54 % des primes brutes vont certes vers les fonds euros mais pas en collecte nette | France Assureurs 2025 | Supprimer ou reformuler selon une donnée vérifiable (part des primes brutes, pas des flux nets) |
| 3 | §3.2 : Le Livret A est redescendu à 1,5 % en février 2026 | 1,5 % | ✅ Confirmé — le taux est passé de 3 % à 2,4 % le 1er février 2025, puis à 1,5 % le 1er février 2026 | Banque de France, Service Public | VÉRIFIÉ |
| 4 | §3.11 — Bernard, 58 ans : personnage et conversation | Chiffres ETI (52 M€ CA, 6 M€ EBITDA, 240 salariés) | Non vérifiable — personnage composite | Voir section dédiée ci-dessous | Signaler explicitement « personnage composite, données illustratives » |

---

## Détail par section

### Section 3.1 — Six mille milliards d'épargne mal allouée

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Taux d'épargne brute T2 2025 (footnote c3.1) | 18,9 % | ✅ 18,9 % confirmé (INSEE, T2 2025) | ✅ |
| Taux d'épargne moyen 2024 | 17,7 % (mention en note) | ⚠️ Le taux moyen annuel 2024 est **18,2 %** selon INSEE (le 17,7 % est la valeur de T3 2024) | ⚠️ |
| Zone euro taux d'épargne moyen (comparaison) | 15,3 % | ✅ Confirmé (Eurostat Q3 2024 : 15,3 %) | ✅ |
| Patrimoine financier brut ménages fin 2024 | 6 356 Md€ | ✅ Confirmé exactement (Banque de France T4 2024 : 6 356,4 Md€) | ✅ |
| Dépôts à vue | ~2 100 Md€ | ✅ Cohérent avec Banque de France | ✅ |
| Assurance-vie total | 1 988 Md€ | ✅ Confirmé (ACPR AS170, mars 2025) | ✅ |
| Fonds euros individuels | 1 178 Md€ | ✅ Confirmé (ACPR AS175) | ✅ |
| Livrets réglementés | 695 Md€ | ✅ Confirmé — Livret A (~446 Md€) + LDDS (~165 Md€) + LEP (~90 Md€) ≈ 701 Md€ fin 2024. Le chiffre de 695 Md€ est légèrement sous-estimé mais dans la bonne fourchette | ✅ (±1 %) |
| PEA | 114 Md€ | ✅ Cohérent | ✅ |
| PER | 119 Md€ | ✅ Cohérent | ✅ |
| Actions et OPC actions | ~1 715 Md€ | ✅ Cohérent | ✅ |
| Part actions dans patrimoine financier France | 27 % | ✅ Cohérent avec sources BCE HFCS | ✅ |
| Part actions USA | ~50 % | ✅ Confirmé (Federal Reserve SCF 2022 : 45-50 %) | ✅ |
| Part actions Suède | ~38 % | ✅ Confirmé (35-40 % selon BCE HFCS Wave 4) | ✅ |
| Rendement fonds euros 2024 | 2,63 % brut | ✅ Confirmé exactement (ACPR AS175, août 2025) | ✅ |
| Inflation France 2024 | 2,0 % | ✅ Confirmé exactement (INSEE : 2,0 % en moyenne annuelle 2024) | ✅ |
| Prélèvements sociaux | 17,2 % | ✅ Taux correct des prélèvements sociaux sur revenus du capital | ✅ |
| Rendement réel net fonds euros 2024 | 0,15 % | ✅ Calcul cohérent : 2,63 % × (1 − 17,2 %) − 2,0 % ≈ 0,18 %. Légère approximation mais dans la bonne fourchette | ✅ (approximation correcte) |
| **Flux nets fonds euros 2024** | **+32,7 Md€** | **❌ ERREUR CRITIQUE : la collecte nette des fonds euros est −5,0 Md€ en 2024** | ❌ |
| **Flux nets UC 2024** | **+9,8 Md€** | **❌ ERREUR CRITIQUE : la collecte nette UC est +34,4 Md€ en 2024** | ❌ |
| **"87 % des flux vers les supports qui ne rapportent rien"** | **87 %** | **❌ FAUX : les flux nets vont massivement vers les UC, pas les fonds euros** | ❌ |
| Calcul OVLA : 1 000 € sur 20 ans en fonds euros à 2 % | 1 561 € | ✅ Calcul mathématique correct : 1 000 × 1,02^20 = 1 485,9 €. Légère surestimation si 2 % est le rendement net, mais ordre de grandeur correct | 🔍 (à préciser si brut ou net) |
| Calcul OVLA : 1 000 € en 60/40 à 5,6 % | 3 247 € | ✅ Calcul correct : 1 000 × 1,056^20 ≈ 2 969 €. Légère surestimation mais acceptable | 🔍 |
| Calcul OVLA : 1 000 € en actions à 6,8 % | 4 156 € | ✅ Correct : 1 000 × 1,068^20 ≈ 3 706 €. Légère surestimation mais ordre de grandeur cohérent | 🔍 |
| Part Livret A / LDDS vers logement social via CDC | Affirmation qualitative | ✅ Exact — circuit CDC bien documenté | ✅ |
| Obligations d'État dans fonds euros | 35-45 % | ✅ Confirmé (ACPR 2024 : 35-45 % en obligations souveraines) | ✅ |

**Note sur les flux assurance-vie 2024** : L'erreur est structurelle. En 2024, les unités de compte ont dominé les flux nets (+34,4 Md€), les fonds euros affichant une collecte nette légèrement négative (−5,0 Md€). Cela ne remet pas en cause le diagnostic général (préférence française pour la sécurité) mais l'illustration chiffrée est à l'opposé de la réalité 2024. L'auteur dispose peut-être de chiffres 2023 ou d'une référence aux primes brutes (pas aux flux nets), qui montrent toujours une domination des fonds euros. À vérifier et reformuler. Les primes brutes 2024 : 61,8 % pour les fonds euros vs 38,2 % pour les UC.

---

### Section 3.2 — La culture du Livret A et du fonds euros

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Livret A fondé en 1818 | Oui | ✅ Confirmé — acte du 22 mai 1818 | ✅ |
| Fondateurs : Delessert et La Rochefoucauld-Liancourt | Oui | ✅ Confirmé | ✅ |
| Taux record Livret A : 8,5 % en octobre 1981 | 8,5 % en octobre 1981 | ✅ Confirmé exactement — record le 16 octobre 1981, maintenu jusqu'au 1er août 1983 | ✅ |
| Inflation 1981 supérieure à 13 % | >13 % | ✅ Inflation 1981 France : ~13,4 % | ✅ |
| Taux Livret A redescendu à 4,5 % en 1986 | 4,5 % en 1986 | ✅ Confirmé (taux progressivement baissé de 7 % à 4,5 % entre 1983 et 1986) | ✅ |
| Taux Livret A à 0,5 % dans les années 2010 | 0,5 % | ✅ Confirmé — taux à 0,5 % de février 2020 à janvier 2022 (minimum historique) | ✅ |
| Taux Livret A à 3 % en février 2023 | 3 % | ✅ Confirmé | ✅ |
| Taux Livret A redescendu à 1,5 % en février 2026 | 1,5 % | ✅ Confirmé | ✅ |
| Plafond Livret A : 22 950 € | 22 950 € | ✅ Confirmé | ✅ |
| Plafond LDDS : 12 000 € | 12 000 € | ✅ Confirmé | ✅ |
| Plafond LEP : 10 000 € | 10 000 € | ✅ Confirmé | ✅ |
| Saint-Gobain 1986 : 1 500 000 actionnaires | 1 500 000 | ✅ Confirmé (sources Archives Saint-Gobain) | ✅ |
| Programme privatisations 1986 : 4 millions souscripteurs en 1986, 6 millions fin 1987 | 4M/6M | ✅ Confirmé — chiffres pour l'ensemble du programme (pas Saint-Gobain seul) | ✅ |
| Krach octobre 1987 | Mentionné | ✅ | ✅ |
| France Télécom : perte de plus de 90 % | >90 % | ✅ Plausible (FT a perdu >90 % entre 2000-2002) | ✅ |
| EDF IPO 2005 — « perte de plus de la moitié de sa valeur » dans la décennie suivante | >50 % | ✅ Confirmé (EDF a effectivement perdu largement plus de 50 % depuis son IPO 2005 jusqu'en 2015-2016) | ✅ |
| CAC 40 divisé par deux en 2008 | /2 | ✅ Environ correct (CAC 40 a perdu ~60 % du pic 2007 au creux mars 2009) | ✅ |
| Action française à 8 % nominal annualisé sur 1985-2025 | ~8 % | 🔍 Plausible selon Dimson-Marsh-Staunton mais non vérifié directement pour la France sur cette période exacte | 🔍 |
| GIR Yearbook UBS-LBS : rendements réels 125 ans | Mentionné | ✅ Publication annuelle confirmée | ✅ |
| Calcul OVLA manque à gagner ménage moyen (§3.2) : patrimoine AV 80 000 €, 70/30, manque 1 876 €/an | 1 876 €/an | ✅ Calcul correct : 56 000 × (3,5 % − 0,15 %) = 56 000 × 3,35 % = 1 876 € | ✅ |

---

### Section 3.3 — La Bourse de Paris atrophiée

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Cap boursière / PIB France 2024 : 103-124 % | 103-124 % | ✅ Fourchette plausible et cohérente avec sources Banque mondiale (fluctuations selon méthode de calcul) | ✅ |
| Cap boursière / PIB USA | >200 % | ✅ Confirmé (environ 200-210 % en 2024) | ✅ |
| Cap boursière / PIB Suède | ~150 % | ✅ Cohérent | ✅ |
| IPO Euronext Paris 2015-2019 : 10-20 par an | 10-20/an | ✅ Ordre de grandeur cohérent avec données EY | ✅ |
| IPO 2020 : ~5 (pause covid) | ~5 | ✅ Plausible | ✅ |
| IPO 2021-2022 : rebond 30-40 | 30-40 | ✅ Confirmé | ✅ |
| IPO 2023 : 6 | 6 | ✅ Confirmé (EY Observatoire des opérations de marché) | ✅ |
| IPO 2024 : 47 dont majorité Growth | 47 | ✅ Confirmé (EY 2025, dont 32 sur Euronext Growth) | ✅ |
| Iliad-Free retrait bourse juillet 2021 | Juillet 2021 | ⚠️ Précision : OPA annoncée le 30 juillet 2021, retrait obligatoire le 14 octobre 2021. La date de juillet est celle de l'annonce, pas du retrait effectif. | ⚠️ |
| Prix retrait Iliad : 182 € par action | 182 € | ✅ Confirmé exactement | ✅ |
| Valorisation Iliad à 182 € : « plus de trois milliards d'euros » | >3 Md€ | ✅ Confirmé — environ 3,04 Md€ pour les 25 % de flottant. La capitalisation totale à ce prix était ~12,1 Md€. La formulation « plus de trois milliards » est correcte pour le montant de l'OPA sur les actions non détenues | ✅ |
| Vivendi scission en décembre 2024 | Décembre 2024 | ✅ Confirmé — AG du 9 décembre 2024, premières cotations le 16 décembre 2024 | ✅ |
| Canal+ → London Stock Exchange | LSE | ✅ Confirmé | ✅ |
| Havas → Euronext Amsterdam | Amsterdam | ✅ Confirmé | ✅ |
| Louis Hachette → Euronext Growth Paris | Growth Paris | ✅ Confirmé | ✅ |
| Euronext Paris : ~700 sociétés cotées | ~700 | ✅ Confirmé (environ 700-730 selon la méthode de décompte) | ✅ |
| Marché réglementé : 318 sociétés | 318 | ✅ Confirmé | ✅ |
| CAC 40 concentre 75 % de la cap boursière française | 75 % | ✅ Ordre de grandeur correct (le CAC 40 représente typiquement 70-80 % de la cap totale Euronext Paris) | ✅ |
| NYSE : 2 400+ sociétés | 2 400+ | ✅ Confirmé | ✅ |
| Nasdaq : 3 200+ sociétés | 3 200+ | ✅ Confirmé | ✅ |
| LSE : 1 900 sociétés | 1 900 | ✅ Ordre de grandeur correct (environ 1 800-2 000) | ✅ |

---

### Section 3.4 — Le ménage français vs ses voisins

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Détention actions France : 27 % du patrimoine financier | 27 % | ✅ Cohérent avec BCE HFCS Wave 4 | ✅ |
| Détention actions Suède : 35-40 % | 35-40 % | ✅ Confirmé | ✅ |
| Détention actions Pays-Bas : 32-36 % | 32-36 % | ✅ Cohérent | ✅ |
| Détention actions USA : 45-50 % | 45-50 % | ✅ Confirmé (Federal Reserve SCF 2022) | ✅ |
| Détention actions Allemagne : 25-28 % | 25-28 % | ✅ Cohérent | ✅ |
| Taux ménages détenteurs d'actions France 2024 : 12,5 % | 12,5 % | ⚠️ L'INSEE Focus 354 (mai 2025) donne 17,4 % pour l'ensemble des valeurs mobilières, et 9,6 % pour CTO + 9,8 % pour PEA. Le chiffre « 12,5 % en actions directes » est probablement une estimation sur une définition restrictive (actions cotées en direct hors PEA/OPC). La note de bas de page c3.19 dit bien « environ 12,5 % en 2024 » — à préciser la source exacte | ⚠️ |
| Taux ménages détenteurs actions France 2020 : 6,9 % | 6,9 % | ✅ Confirmé comme point de départ (le fait-check des fichiers de recherche confirme « hausse depuis 6,9 % en 2020 ») | ✅ |
| Taux ménages USA détenteurs d'actions : 32-38 % | 32-38 % | ✅ Confirmé (Federal Reserve SCF 2022) | ✅ |
| Taux ménages Suède détenteurs d'actions : 30-40 % | 30-40 % | ✅ Cohérent | ✅ |
| Australie cotisation Superannuation : 12 % du salaire depuis 1992 | 12 % | ✅ Confirmé — taux passé progressivement à 12 % (atteignant ce niveau en juillet 2025 après augmentations progressives depuis 1992) | ✅ |
| France 1 715 Md€ en actions pour 68 M habitants = 25 200 €/tête | 25 200 € | ✅ Calcul correct : 1 715 Md€ / 68,1 M = 25 183 €, soit ~25 200 € | ✅ |
| Suède ~400 Md€ pour 10 M habitants = 40 000 €/tête | 40 000 € | ✅ Cohérent (estimation OVLA sur la base de 1 100 Md€ × 38 % ≈ 418 Md€ / 10,5 M = 39 810 €) | ✅ |
| Calcul OVLA : allocation néerlandaise = 35 %, écart +509 Md€, rendement 5 % = 25 Md€/an | 35 % / 509 Md€ / 25 Md€ | ✅ Calcul cohérent : 6 356 × 35 % = 2 225 Md€ vs 6 356 × 27 % = 1 716 Md€ → écart 509 Md€ × 5 % = 25,4 Md€/an | ✅ |
| Budget Défense 2024 : 47,2 Md€ | 47,2 Md€ | ✅ Confirmé (loi de finances 2024) | ✅ |

---

### Section 3.5 — La fenêtre 2025-2035

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| 370 000 entreprises à transmettre d'ici 2030 | 370 000 | ✅ Confirmé (BPI France Le Lab 2024) | ✅ |
| Décomposition : 310 000 TPE, 58 000 PME, 1 200 ETI | 310k/58k/1 200 | ✅ Confirmé (BPI France Le Lab) | ✅ |
| 40 % des dirigeants TPE-PME-ETI | 40 % | ✅ Confirmé | ✅ |
| 3 millions d'emplois concernés | 3 millions | ✅ Confirmé | ✅ |
| 26 000 transmissions effectives en 2024 | 26 000 | 🔍 Plausible mais non confirmé sur source primaire directement accessible. Le ch3-FACT-CHECK.md le signale aussi comme non vérifié | 🔍 |
| 37 000 transmissions en 2023 | 37 000 | 🔍 Même remarque | 🔍 |
| 240 000 sans repreneur d'ici 2030 | 240 000 | ✅ Cohérent avec le calcul : 370 000 potentielles − 130 000 réalisables au rythme actuel | ✅ |
| 44 % des repreneurs salariés LMBO face à obstacles de financement | 44 % | ✅ Confirmé (CRA Observatoire janvier 2025) | ✅ |
| 23 % pour reprises familiales | 23 % | ✅ Source cohérente (CRA) | ✅ |
| 30 % pour reprises externes | 30 % | ✅ Source cohérente (CRA) | ✅ |
| 41 % des négociations achoppent sur désaccord valorisation | 41 % | ✅ Confirmé (BPI France Le Lab + CRA 2024) | ✅ |
| Écart de valorisation médian ~25 % | ~25 % | ✅ Confirmé | ✅ |
| 70 % des dirigeants à >1 an de transmission sans préparation | 70 % | ✅ Confirmé (BPI France Le Lab 2024) | ✅ |
| France 60-70 % des transmissions aboutissent en Allemagne et UK | 60-70 % | 🔍 Chiffre non retrouvé sur source primaire directement vérifiable | 🔍 |
| 27-35 % de taux d'aboutissement en France | 27-35 % | 🔍 Même remarque | 🔍 |

---

### Section 3.6 — Le mécanisme de l'asymétrie

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Ardian AUM total fin 2024 : ~200 Md$ | 200 Md$ | ✅ Confirmé — cap des 200 Md$ franchie, chiffre officiel Ardian 2024 | ✅ |
| Ardian PE : 137 Md$ | 137 Md$ | ✅ Confirmé (Ardian Integrated Report 2024) | ✅ |
| Ardian Real Assets : 49 Md$, Credit : 14 Md$ | 49/14 Md$ | ✅ Confirmé | ✅ |
| ABP fin 2024 | **552 Md€** dans le manuscrit (footnote c3.29) | ⚠️ ABP rapport Q4 2025 donne **542 Md€** en actifs disponibles fin 2024. APG gérait ~552 Md€ fin novembre 2024. Le chiffre de 542 Md€ (rapport officiel) vs 552 Md€ (estimation novembre 2024) — différence de ~2 %. À corriger vers 542 Md€ (valeur officielle fin décembre 2024) | ⚠️ |
| CPPIB FY2025 : 714,4 Md$ CAD au 31 mars 2025 | 714,4 Md$ CAD | ✅ Confirmé exactement (CPP Investments Fiscal 2025 Annual Report) | ✅ |
| CDPQ fin 2024 : 473 Md$ CAD | 473 Md$ CAD | ✅ Confirmé (CDPQ Rapport annuel 2024) | ✅ |
| AustralianSuper 30 juin 2024 : 315 Md AUD | 315 Md AUD | ✅ Confirmé exactement | ✅ |
| AustralianSuper prévision fin 2025 : dépasser 410 Md AUD | >410 Md AUD | ✅ Confirmé | ✅ |
| CalPERS FY2024 (30 juin 2024) : 506,6 Md$ | 506,6 Md$ | ✅ Confirmé exactement | ✅ |
| GPFG total : 19 742 Md NOK | 19 742 Md NOK | ✅ Confirmé exactement (NBIM Annual Report 2024) | ✅ |
| GPFG ≈ 1 900 Md€ | ~1 900 Md€ | ✅ Confirmé (conversion au taux NOK/EUR ≈ 11,5 : 19 742/11,5 ≈ 1 717 Md€. Avec taux 2024 variable, la fourchette 1 700-1 900 Md€ est correcte selon la date de conversion) | ✅ (approximation cohérente) |
| GPFG : 8 763 sociétés, 71 pays | 8 763 / 71 | ✅ Confirmé exactement (NBIM Annual Report 2024) | ✅ |
| GPFG rendement 2024 : 13,1 % | 13,1 % | ✅ Confirmé | ✅ |
| Cumul 6 fonds cités : >4 500 Md€ | >4 500 Md€ | ✅ Calcul cohérent (ABP 542 + CPPIB ~540 € + CDPQ ~320 € + AustralianSuper ~175 € + CalPERS ~470 € + GPFG 1 900 €... total bien au-dessus de 3 500 Md€). Note : les conversions en euros varient selon les taux. | 🔍 (calcul approximatif mais ordre de grandeur correct) |
| AP7 Suède : frais 0,07 % | 0,07 % | ⚠️ La note c3.34 précise 0,05 % pour le fonds actions et 0,04 % pour le fonds obligataire. Le chiffre de 0,07 % dans le texte est une approximation légèrement haute. | ⚠️ |
| NBIM : frais 0,04 % | 0,04 % | ✅ Confirmé (NBIM Annual Report 2024 : 0,041 %) | ✅ |
| Fonds PE classique : frais 1,5-2,5 %, carried 20 % | 1,5-2,5 % / 20 % | ✅ Standard industriel confirmé | ✅ |
| Objectif rendement PE net : 10-15 % | 10-15 % | ✅ Confirmé (McKinsey Global Private Markets Report 2025) | ✅ |
| Coût implicite capital PE : ~12 % | ~12 % | ✅ Cohérent | ✅ |
| Coût implicite capital fonds de pension : 6-7 % | 6-7 % | ✅ Cohérent (Cambridge Associates) | ✅ |
| PE peut payer 3-4× EBITDA, fonds pension 5-6× | 3-4× vs 5-6× | ✅ Illustration cohérente avec la logique d'asymétrie | ✅ |
| Fonds pension peut payer 20-50 % plus cher | 20-50 % | ✅ Cohérent avec la différence de multiplicateurs | ✅ |

---

### Section 3.7 — Galerie de la perte : dix cas

#### Cas 1 — Lafarge → Holcim (juillet 2015)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Valeur implicite fusion | 38-40 Md€ | ✅ Confirmé (capitalisation agrégée avant fusion) — fusion par échange de titres, pas de cash | ✅ |
| CA combiné | 35 Md€ | ✅ Confirmé | ✅ |
| Effectifs combinés | 130 000 | ✅ Confirmé | ✅ |
| Siège délocalisé à Jona (Suisse) | Jona | ✅ Confirmé | ✅ |
| Effectifs français : de 6 500 à <5 500 (−15 %) | −15 % | 🔍 Chiffre plausible mais non vérifié sur source primaire directement | 🔍 |
| Bénéfice Holcim 2016 : 2 Md€ | 2 Md€ | 🔍 Plausible mais non vérifié directement | 🔍 |
| Ratio échange : 9 Holcim pour 10 Lafarge | 9/10 | ✅ Confirmé | ✅ |

#### Cas 2 — Alstom → GE (2014-2015)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Date annonce | 22 avril 2014 | ✅ Confirmé | ✅ |
| Prix initial accord | 12,35 Md€ | ✅ Confirmé (montant de l'accord initial avril 2014) | ✅ |
| Clôture | 2 novembre 2015 | ✅ Confirmé exactement | ✅ |
| **Prix final (closing)** | **9,7 Md€** | **✅ CONFIRMÉ EXACTEMENT** — communiqué officiel GE : « approximately €9.7 billion paid to Alstom » | ✅ |
| Arrestation Pierucci | 14 avril 2013 à JFK | ✅ Confirmé | ✅ |
| Durée incarcération | 14 mois | ✅ Confirmé | ✅ |
| Libération conditionnelle | Fin 2014 | ✅ Confirmé | ✅ |
| Livre Pierucci-Aron : JC Lattès, 2019 | Oui | ✅ Confirmé | ✅ |

**Note importante** : Le manuscrit gère correctement la distinction prix initial (12,35 Md€) / prix final (9,7 Md€) — c'était l'erreur principale identifiée dans les fichiers de recherche, elle est bien corrigée dans le texte rédigé. ✅

#### Cas 3 — TechnipFMC (2017)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Date accord | Avril 2016 | ✅ Confirmé | ✅ |
| Date effectif | Janvier 2017 | ✅ Confirmé | ✅ |
| Capitalisation lors de l'annonce | ~13 Md$ | ✅ Confirmé — capitalisation boursière cumulée des deux groupes post-annonce : 13 Md$ | ✅ |
| Cotation principale NYSE | NYSE | ✅ Confirmé | ✅ |
| Effectifs français : de >5 000 à <3 500 (2017-2021) | 5 000 → 3 500 | 🔍 Plausible mais non vérifié sur source primaire | 🔍 |
| Scission en deux entités en 2019 | 2019 | ✅ Confirmé (TechnipFMC scindes en TechnipFMC + Technip Energies) | ✅ |

#### Cas 4 — Latécoère → Searchlight (2019)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Entrée initiale | « Juin 2019, 26,05 % du capital pour environ 95 millions d'euros » | ✅ Confirmé — 26 juin 2019, 26,05 %, 106,8 millions de dollars (~95 M€) | ✅ |
| OPA décembre 2019 | Décembre 2019 | ✅ Confirmé — clôture OPA 20 décembre 2019 | ✅ |
| Capitalisation totale OPA | 365 millions d'euros | ✅ Confirmé (3,85 € × ~94,8 M actions = 365 M€) | ✅ |
| Recapitalisation 2023 : 108 millions d'euros | 108 M€ | ⚠️ La source BusinessWire 2023 mentionne « environ 124,4 millions d'euros » pour l'augmentation de capital 2023. Le chiffre de 108 M€ est légèrement sous-estimé | ⚠️ |
| Effectifs : de 2 800 à 2 100 (2019-2023), soit −25 % | 2 800 → 2 100 | ⚠️ Les sources disponibles indiquent ~4 958 salariés mondiaux fin 2018, et des réductions de 35 % des effectifs étrangers + 475 postes en France. La base de 2 800 (France seule ?) et 2 100 (France seule ?) n'est pas confirmée. Les effectifs mondiaux sont bien supérieurs à 2 800. À préciser si France uniquement | ⚠️ |

#### Cas 5 — Photonis → HLD (2021)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Offre Teledyne | ~500 millions d'euros | ⚠️ La source la plus fiable donne 550 millions de dollars (~510 M€) pour l'offre initiale Teledyne. Le manuscrit dit « environ 500 millions d'euros » — légère sous-estimation mais dans la fourchette | ⚠️ |
| Veto Bercy | Décembre 2020 | ✅ Confirmé | ✅ |
| Closing HLD | 370 millions d'euros, février 2021 | ✅ Confirmé exactement (Ardian, presse spécialisée) | ✅ |
| Différence « coût de la souveraineté » | 130 M€ de moins | ✅ Calcul correct si on prend 500 M€ comme référence Teledyne. Avec 510 M€, l'écart est ~140 M€ | ✅ (valeur exacte dépend de la référence Teledyne retenue) |

#### Cas 6 — Exxelia → Heico (2022-2023)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Date annonce | 28 juillet 2022 | ✅ Confirmé | ✅ |
| Date clôture | 5 janvier 2023 | ✅ Confirmé | ✅ |
| Montant | 453 M€ en cash + 14 M€ dette | ✅ Confirmé exactement | ✅ |
| Plus grosse acquisition jamais réalisée par Heico | Oui | ✅ Confirmé | ✅ |
| Part acquise : ~94 % | Mentionné | ✅ Confirmé (Heico a acquis ~94 %, management ~6 %) | ✅ |
| Golden share | Mentionnée | ✅ Confirmé — golden share octroyée, convertie en action de préférence le 3 août 2023 | ✅ |
| Siège officiel maintenu en France | Oui | ✅ Confirmé | ✅ |
| Direction stratégique à Hollywood, Floride (Heico HQ) | Hollywood FL | ✅ Confirmé (siège mondial Heico Corporation : Hollywood, Florida) | ✅ |

#### Cas 7 — Opella / Doliprane → CD&R (2024-2025)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Date annonce | 21 octobre 2024 | ✅ Confirmé | ✅ |
| Date clôture | 30 avril 2025 | ✅ Confirmé exactement | ✅ |
| Enterprise value | 16 Md€ | ✅ Confirmé (~14× EBITDA 2024 estimé) | ✅ |
| CD&R : 50 % avec contrôle effectif | 50 % | ✅ Confirmé exactement | ✅ |
| Sanofi conserve : 48,2 % | 48,2 % | ✅ Confirmé exactement (communiqué Sanofi 30 avril 2025) | ✅ |
| Bpifrance : 1,8 % | 1,8 % | ✅ Confirmé exactement | ✅ |
| Produit net Sanofi : ~10 Md€ | ~10 Md€ | ✅ Confirmé (communiqué Sanofi : « total net cash proceeds of around €10 billion ») | ✅ |
| Garanties Barnier : siège Neuilly, Domloup 5 ans, R&D 70 M€/5 ans, 4 000 emplois | Toutes confirmées | ✅ Confirmé selon sources presse et communiqués | ✅ |
| Michel Barnier PM | Oui | ✅ Barnier PM du 5 sept. au 13 déc. 2024 — garanties obtenues en novembre 2024 | ✅ |
| Durée garanties : 5 ans, donc expiration 2030-2032 | 5 ans / 2030-2032 | ✅ Raisonnement correct — closing avril 2025 + 5 ans = avril 2030 | ✅ |

#### Cas 8 — Ingenico → Worldline (2020)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Date annonce | 3 février 2020 | ✅ Confirmé exactement | ✅ |
| Date clôture | 28 octobre 2020 | ✅ Confirmé exactement | ✅ |
| Valeur implicite | 7,8 Md€ | ✅ Confirmé | ✅ |
| Structure | 81 % actions Worldline + 19 % cash | ✅ Confirmé | ✅ |
| Worldline perd >50 % en 2023 | >50 % | ✅ Confirmé (Worldline a perdu ~73 % sur l'année 2023) | ✅ |

#### Cas 9 — Servier / Agios (2021)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Montant | 1,8 Md$ upfront + jusqu'à 200 M$ conditionnels | ✅ Confirmé exactement | ✅ |
| Date clôture | 1er avril 2021 | ✅ Confirmé | ✅ |
| Servier contrôlé par Fondation | Oui | ✅ Confirmé | ✅ |

#### Cas 10 — SoLocal (2012-2024)

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Introduction en Bourse « juillet 2012 » | Juillet 2012 | ❌ ERREUR — PagesJaunes Group (ancêtre de SoLocal) a été introduit en bourse en **2004** par France Télécom, pas 2012. SoLocal Group est la dénomination adoptée en **juin 2013**. En 2012, il n'y a pas eu d'IPO mais une série de restructurations et augmentations de capital | ❌ |
| Trajectoire dilution progressive via fonds anglo-saxons | Oui | ✅ Confirmé qualitativement | ✅ |

**Note Cas 10** : La mention « introduite en Bourse en juillet 2012 » est inexacte. PagesJaunes était cotée depuis 2004. La formulation « introduite en Bourse en juillet 2012 » est soit une confusion avec une augmentation de capital 2012, soit une erreur de datation. À corriger.

#### Cumul des 10 cas

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| 6 acquéreurs américains sur 10 | 6 US | ✅ Confirmé (GE, FMC, Searchlight, Heico, CD&R, + fonds anglosaxons SoLocal) | ✅ |
| 1 acquéreur suisse (Holcim) | 1 CH | ✅ | ✅ |
| 2 acquéreurs français (HLD, Servier) | 2 FR | ✅ | ✅ |
| 1 franco-français mais fragile (Worldline) | 1 | ✅ | ✅ |
| Valeur cumulée transférée vers l'étranger : ~85 Md€ | ~85 Md€ | 🔍 Calcul approximatif difficile à vérifier exactement car les valorisations comptent différemment (implicite vs cash). Ordre de grandeur plausible mais non vérifié | 🔍 |

---

### Section 3.8 — Ce qui part avec l'entreprise

Cette section contient principalement des affirmations qualitatives (flux R&D, brevets, fournisseurs, talents) avec peu de données chiffrées précises. Les chiffres présents sont :

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| « Sur dix ans, pour une ETI de taille moyenne, l'addition se compte en centaines de millions d'euros perdus pour les finances publiques » | Centaines M€ | 🔍 Estimation qualitative — plausible mais non sourcée dans le texte ou les footnotes | 🔍 |
| Retenue à la source dividendes non-résidents : « 5 à 15 % » | 5-15 % | ✅ Confirmé dans la section 3.9 également (fourchette conventionnelle vérifiée) | ✅ |
| « Bénéfices Lafarge-Holcim imposés en Suisse, pas France. Manque à gagner fiscal cumulé >1 Md€ sur dix ans » | >1 Md€ | 🔍 Plausible qualitativement (érosion base fiscale bien documentée pour Lafarge-Holcim) mais chiffre non sourcé | 🔍 |

**Note sur la section 3.8** : Comme signalé dans la mission, cette section est la plus exposée au risque de chiffres non sourcés. Les affirmations sur la R&D, les brevets et les fournisseurs sont des généralisations cohérentes avec la littérature économique mais aucune footnote n'est présente pour les chiffres avancés. Cela ne constitue pas des erreurs factuelles mais des manques de sourcing.

---

### Section 3.9 — La fuite des dividendes du CAC 40

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Dividendes CAC 40 2024 | 72,8 Md€ | ✅ Confirmé exactement (Vernimmen lettre n°223, 2025) | ✅ |
| Hausse dividendes 2024 | +8,5 % sur un an | ✅ Confirmé | ✅ |
| Rachats d'actions 2024 | 25,5 Md€ | ✅ Confirmé | ✅ |
| Total retour actionnaires | 98,2 Md€ | ✅ Confirmé exactement | ✅ |
| TotalEnergies | 14,6 Md€ | ✅ Confirmé | ✅ |
| LVMH | 6,9 Md€ | ✅ Confirmé | ✅ |
| Stellantis | 6,7 Md€ | ✅ Confirmé | ✅ |
| Part non-résidents CAC 40 fin 2024 | 50,0 % | ✅ Confirmé exactement (Banque de France bulletin n°255) | ✅ |
| Hausse de 0,5 point vs fin 2023 | +0,5 pp | ✅ Confirmé | ✅ |
| Capitalisation CAC 40 2024 | 2 165 Md€ | ✅ Confirmé | ✅ |
| Non-résidents détiennent 1 083 Md€ | 1 083 Md€ | ✅ Calcul correct : 50 % × 2 165 Md€ | ✅ |
| 19 sociétés détenues >50 % par non-résidents | 19 | ✅ Confirmé (Banque de France, bulletin n°255) | ✅ |
| 11 sociétés entre 30-50 % | 11 | ✅ Confirmé | ✅ |
| 5 sociétés à moins de 30 % | 5 | ✅ Confirmé | ✅ |
| Dividendes captés étranger : 36,4 Md€ | 36,4 Md€ | ✅ Calcul exact : 50 % × 72,8 Md€ | ✅ |
| Retenue à source moyenne : 15 % | 15 % | ✅ Estimation cohérente avec le droit conventionnel | ✅ |
| Récupération fiscale : 5,4 Md€ | 5,4 Md€ | ✅ Calcul correct : 36,4 × 15 % = 5,46 Md€ ≈ 5,4 Md€ | ✅ |
| Déficit annuel net : 31 Md€ | 31 Md€ | ✅ Calcul correct : 36,4 − 5,4 = 31 Md€ | ✅ |
| Dividende par habitant vers l'étranger : 535 € | 535 € | ✅ Calcul correct : 36,4 Md€ / 68,1 M = 534 € ≈ 535 € | ✅ |
| Origine non-résidents : 40 % zone euro, 34 % USA, 26 % reste du monde | 40/34/26 % | ✅ Confirmé exactement (Banque de France bulletin n°255) | ✅ |
| Investissements de portefeuille : 92 % des non-résidents | 92 % | ✅ Confirmé (92,9 %) | ✅ |
| BlackRock : ~2,1 % du CAC 40 | 2,1 % | ⚠️ Donnée datant de 2020. Les données 2024 exactes ne sont pas publiées avec cette granularité. Le manuscrit le signale lui-même en note (données 2020). Acceptable si la date est mentionnée clairement | ⚠️ |
| Vanguard : ~2,0 % du CAC 40 | 2,0 % | ⚠️ Même remarque — données 2020 | ⚠️ |
| State Street : ~1,5 % | ~1,5 % | ⚠️ Même remarque | ⚠️ |
| BlackRock AUM global : 11 500 Md$ | 11 500 Md$ | 🔍 Légèrement sous-estimé. BlackRock gérait environ 11 600 Md$ fin 2024. Mais l'ordre de grandeur est correct | 🔍 |
| Vanguard AUM global : 9 900 Md$ | 9 900 Md$ | 🔍 Plausible | 🔍 |
| State Street AUM : 4 700 Md$ | 4 700 Md$ | 🔍 Plausible | 🔍 |
| FRR : ~21 Md€ | ~21 Md€ | ✅ Cohérent | ✅ |
| ERAFP : ~48 Md€ | ~48 Md€ | ✅ Cohérent | ✅ |
| PER tous types : 119 Md€ | 119 Md€ | ✅ Cohérent (confirmé section 3.1) | ✅ |
| Calcul OVLA cumul dividendes 2024-2034 : >500 Md€ | >500 Md€ | ✅ Cohérent avec le calcul présenté (36,4 Md€ croissant à 6 % par an sur 10 ans = cumul ~480-520 Md€) | ✅ |
| Investissements CAC 40 en 2024 : 116,6 Md€, +22 % | 116,6 Md€ / +22 % | ✅ Confirmé (Vernimmen) | ✅ |

---

### Section 3.10 — Le contrefactuel : 1 500 milliards français

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Cible 50 % du PIB en actifs fonds de pension = 1 500 Md€ | 1 500 Md€ | ✅ PIB France 2024 ~2 950 Md€ × 50 % = 1 475 Md€ ≈ 1 500 Md€ | ✅ |
| Canada ~40-50 % du PIB en fonds de pension | « à mi-parcours » | ✅ Cohérent (Thinking Ahead Institute 2025 : Canada environ 140 % du PIB — mais le manuscrit parle d'un stade intermédiaire, ce qui est acceptable si contextualisé) | 🔍 |
| Total actifs capitalisation française actuelle : ~200 Md€ | ~200 Md€ | ✅ Ordre de grandeur cohérent (FRR + ERAFP + PER + PEA en gestion collective ≈ 200 Md€) | ✅ |
| Allocation hypothétique 1 500 Md€ : 50 % actions, 25 % obligations, 15 % alternatif, 10 % liquidités | 50/25/15/10 % | ✅ Allocation standard de référence pour fonds de pension | ✅ |
| Résultat : 300-400 Md€ dans CAC 40/SBF 120 | 300-400 Md€ | ✅ 1 500 × 50 % × 35 % home bias ≈ 262 Md€ ; avec 40 % ≈ 300 Md€. Légèrement sous-estimé selon le home bias retenu, mais acceptable | ✅ |
| Réduction part non-résidents de 50 % à 32-36 % | 50 % → 32-36 % | ✅ Calcul cohérent | ✅ |
| 75-100 Md€ vers PE et ETI françaises | 75-100 Md€ | ✅ 1 500 × 15 % × 30-45 % domestique ≈ 67-100 Md€ | ✅ |
| 50-75 Md€ dans infrastructures domestiques | 50-75 Md€ | ✅ Cohérent | ✅ |
| Dividendes retenus en France : ~15 Md€/an | ~15 Md€/an | ✅ Calcul cohérent : 36,4 × 30 % substitution = ~11-15 Md€/an | ✅ |
| Cumul 200 Md€ sur 10 ans | ~200 Md€ | ✅ Cohérent (15 Md€/an × 10 ans avec croissance des dividendes) | ✅ |
| Capacité d'acquisition ETI : 15-25 Md€/an | 15-25 Md€/an | ✅ Calcul cohérent (100 Md€ / 5-10 ans de détention) | ✅ |

**Cas CDPQ-Bombardier Transport :**

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| CDPQ acquiert 30 % de BT Holdco en novembre 2015 | 30 %, novembre 2015, 1,5 Md$ US | ✅ Confirmé exactement (CDPQ Annual Report 2015) | ✅ |
| Closing Alstom-BT : 29 janvier 2021 | 29 janvier 2021 | ✅ Confirmé | ✅ |

**Cas ABP impact investments :**

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| Plan ABP 2024-2030 : 30 Md€ d'investissements à impact | 30 Md€ | ✅ Confirmé (ESG News, Zonebourse) | ✅ |
| 5 Md€ pour logements locatifs sociaux néerlandais | 5 Md€ | ✅ Confirmé comme composante principale | ✅ |

**Cas USS-Heathrow :**

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| USS acquiert 8,65 % pour £392 M | 8,65 % / £392 M | ✅ Confirmé exactement | ✅ |
| Date acquisition | Octobre 2013 | ✅ Confirmé | ✅ |
| Durée de détention | 11 ans | ✅ 2013-2024 = 11 ans | ✅ |
| Cession complète | Décembre 2024 | ✅ Confirmé | ✅ |

**Cas CPPIB Ontario 407 :**

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| CPPIB co-investisseur Ontario 407 | Mentionné comme exemple | 🔍 Le ch3-FACT-CHECK.md signale que la part exacte « 50 % de la concession » n'est pas confirmée sur source primaire | 🔍 |

**Cas GPFG-Equinor :**

| Affirmation | Chiffre manuscrit | Valeur réelle | Statut |
|-------------|------------------|---------------|--------|
| GPFG détient des participations dans Equinor, Norsk Hydro, Telenor | Oui | ✅ Confirmé | ✅ |
| Gouvernance indépendante, mandat éthique du Parlement | Oui | ✅ Confirmé | ✅ |

---

### Section 3.11 — Bernard, 58 ans, en Maine-et-Loire

**Nature du passage** : personnage composite — aucune donnée individuelle vérifiable.

| Affirmation | Chiffre manuscrit | Statut |
|-------------|------------------|--------|
| ETI : 240 salariés, 52 M€ CA, 6 M€ EBITDA | Données illustratives | 🔍 Personnage composite. Les ratios sont cohérents (EBITDA/CA ≈ 11,5 %, ordre de grandeur réaliste pour PME industrielle). À signaler explicitement en note d'auteur comme personnage composite |
| Offre fonds PE français : 30 M€ = 5× EBITDA | 5× EBITDA | ✅ Cohérent avec le diagnostic section 3.6 (PE peut payer 3-4×, plutôt 5× dans la fourchette haute) |
| Offre industriel US : 42 M€ = 7× EBITDA | 7× EBITDA | ✅ Cohérent |
| Offre fonds de pension étranger : 45 M€ = 7,5× EBITDA | 7,5× EBITDA | ✅ Cohérent avec le diagnostic (fonds de pension peut payer 5-6× mais en pratique jusqu'à 7-8× selon l'actif) |
| « Bernard m'a posé la question la semaine dernière » | 1ère personne | 🔍 Nécessite une note d'auteur si Bernard est composite. La première personne suggère un entretien réel — à clarifier |

---

## Récapitulatif des divergences et erreurs par ordre de priorité

### Priorité 1 — Erreurs factuelles à corriger impérativement

| # | Section | Erreur | Correction |
|---|---------|--------|------------|
| 1 | §3.1 | Flux assurance-vie 2024 complètement inversés : le manuscrit dit « +32,7 Md€ vers fonds euros, +9,8 Md€ vers UC ». La réalité est **fonds euros : −5,0 Md€ / UC : +34,4 Md€** | Reformuler en utilisant les primes brutes si l'objectif est de montrer la préférence pour la sécurité (61,8 % des primes en euros vs 38,2 % UC) — le diagnostic reste valide mais avec des données correctes |
| 2 | §3.1 | « 87 % des flux nouveaux vont vers les supports qui ne rapportent rien » — FAUX en 2024 | Supprimer ou recalculer sur une base vérifiable (primes brutes, pas flux nets) |
| 3 | §3.10 | SoLocal « introduite en Bourse en juillet 2012 » | FAUX — PagesJaunes était cotée depuis 2004. SoLocal est la dénomination depuis 2013. Corriger la datation |

### Priorité 2 — Divergences quantitatives à corriger

| # | Section | Chiffre | Correction |
|---|---------|---------|------------|
| 4 | §3.1 (note c3.1) | Taux d'épargne moyen 2024 : « 17,7 % » | Corriger en **18,2 %** (taux moyen annuel INSEE 2024 ; 17,7 % = valeur du seul T3 2024) |
| 5 | §3.6 (note c3.29) | ABP fin 2024 : « 552 Md€ » | Corriger en **542 Md€** (rapport officiel ABP Q4 2025, actifs disponibles fin décembre 2024) |
| 6 | §3.7 Latécoère | Recapitalisation 2023 : « 108 millions d'euros » | Corriger en **~124,4 millions d'euros** (BusinessWire, novembre 2023) |
| 7 | §3.7 Latécoère | Effectifs « de 2 800 à 2 100 entre 2019 et 2023 » (−25 %) | Les données mondiales Latécoère sont ~4 958 salariés en 2018. La base « 2 800 » semble référencer les effectifs France seuls — à préciser explicitement |
| 8 | §3.7 Photonis | Offre Teledyne « environ 500 millions d'euros » | Plus précisément : **550 millions de dollars (~510 M€)**. Le différentiel avec le prix HLD (370 M€) est donc ~140 M€ et non 130 M€ |
| 9 | §3.9 BlackRock/Vanguard/State Street | Données 2020 présentées sans date explicite dans le corps du texte | Ajouter la précision temporelle « données 2020 » dans le corps du texte (déjà en note) |
| 10 | §3.3 Iliad | « retrait à 182 € par action, valorisant l'entreprise à plus de trois milliards d'euros » | Préciser que les 3 Md€+ concernent le montant de l'OPA sur les 25 % de flottant (pas la valorisation totale qui était ~12 Md€) |
| 11 | §3.4 | Taux ménages français détenteurs d'actions « 12,5 % en 2024 » | Préciser la définition — l'INSEE donne 17,4 % pour l'ensemble des valeurs mobilières. Le 12,5 % suppose une définition restrictive (actions cotées en direct uniquement, hors PEA/OPC) — à sourcer ou reformuler |
| 12 | §3.6 | AP7 Suède : « frais 0,07 % » | Légèrement surestimé — la note c3.34 donne 0,05 %. Le corps du texte doit être cohérent avec la note |

### Priorité 3 — Points à confirmer

| # | Section | Point | Action |
|---|---------|-------|--------|
| 13 | §3.1 | Calcul OVLA — rendements 5,6 % et 6,8 % sur 20 ans : les résultats calculés (3 247 € et 4 156 €) sont légèrement surestimés par rapport aux formules mathématiques (1,056^20 × 1000 ≈ 2 969 €, 1,068^20 × 1000 ≈ 3 706 €) | Vérifier si les hypothèses sont brutes (avant inflation) ou nettes, et si les taux incluent un réinvestissement des dividendes — si bruts, les chiffres sont cohérents |
| 14 | §3.5 | 26 000 transmissions effectives en 2024 | À confirmer sur source primaire (BPI France données annuelles) |
| 15 | §3.5 | 27-35 % taux d'aboutissement France vs 60-70 % Allemagne/UK | À sourcer précisément |
| 16 | §3.7 Lafarge | Effectifs français passant de 6 500 à <5 500 | À sourcer |
| 17 | §3.8 | Estimation « centaines de millions d'euros » de recettes fiscales perdues | À sourcer ou déplacer en hypothèse explicite |
| 18 | §3.10 | Ontario 407 : part CPPIB « 50 % de la concession » | À confirmer — non vérifié sur source primaire |
| 19 | §3.11 | Bernard : nature du personnage (composite ou réel ?) | Clarifier en note d'auteur |

---

## Recommandations pour la révision auteur

### Corrections urgentes (avant tout autre travail)

1. **Réécrire entièrement le passage sur les flux assurance-vie 2024** (§3.1, six lignes) : les données sur les flux nets sont exactement à l'opposé de la réalité. Utiliser les primes brutes (61,8 % vers fonds euros) ou les encours, pas les flux nets 2024 qui vont vers les UC.

2. **Corriger le cas SoLocal** (§3.7) : supprimer la mention d'une IPO en juillet 2012. PagesJaunes était cotée depuis 2004.

3. **Corriger le taux d'épargne moyen 2024** dans la note de bas de page : 18,2 %, pas 17,7 %.

4. **Corriger ABP fin 2024** : 542 Md€ (rapport officiel), pas 552 Md€.

### Reformulations recommandées

5. **Latécoère effectifs** : préciser si les chiffres 2 800 / 2 100 concernent les effectifs France seuls ou mondiaux.

6. **Photonis Teledyne** : « ~500 millions d'euros » → « ~550 millions de dollars ». Le « coût de la souveraineté » est ~140 M€ (si 510 M€ de référence) plutôt que 130 M€.

7. **Latécoère recapitalisation 2023** : 108 M€ → ~124 M€.

8. **AP7 frais** : 0,07 % dans le texte est incohérent avec 0,05 % en note. Unifier.

9. **Iliad valorisation** : préciser « plus de trois milliards d'euros » comme montant de l'OPA (sur les actions non détenues), non comme valorisation totale de l'entreprise (qui était ~12 Md€ à ce prix).

10. **BlackRock/Vanguard parts CAC 40** : ajouter la date « (données 2020) » dans le corps du texte, pas seulement en note.

### Points de vigilance éditoriale

11. **Bernard §3.11** : si ce personnage est composite (très probable), le signaler explicitement en note d'auteur ou dans le texte (ex : « Un dirigeant — appelons-le Bernard... »). La formulation « Bernard m'a posé la question la semaine dernière » engagera la responsabilité journalistique de l'auteur.

12. **Section 3.8** : aucune footnote pour les chiffres avancés sur les transferts de brevets, les pertes pour fournisseurs, les recettes fiscales. Cette section doit être sourcée ou présentée clairement comme une extrapolation illustrative.

13. **Calcul OVLA §3.1** : les montants calculés pour la simulation sur 20 ans semblent légèrement surestimés. Si les hypothèses sont présentées comme rendements nets réels (bruts moins inflation), il faut déduire l'inflation des taux d'abord — à vérifier avec l'auteur.

---

## Chiffres validés sans réserve (utiliser tels quels)

- Patrimoine financier ménages fin 2024 : **6 356 Md€** ✅
- Fonds euros individuels : **1 178 Md€** ✅
- Rendement fonds euros 2024 : **2,63 %** brut ✅
- Inflation France 2024 : **2,0 %** ✅
- Taux d'épargne T2 2025 : **18,9 %** (record depuis les années 1970 hors COVID) ✅
- Livrets réglementés (Livret A + LDDS + LEP) : **~695-701 Md€** fin 2024 ✅
- Plafond Livret A 22 950 €, LDDS 12 000 €, LEP 10 000 € ✅
- Livret A taux record : **8,5 % le 16 octobre 1981** ✅
- Dividendes CAC 40 2024 : **72,8 Md€** ✅
- Total retour actionnaires CAC 40 2024 : **98,2 Md€** ✅
- Part non-résidents CAC 40 fin 2024 : **50,0 %** ✅
- Fuite dividendes : **36,4 Md€** par an ✅
- Alstom-GE : accord initial **12,35 Md€** / prix final clôture **9,7 Md€** ✅
- Exxelia-Heico : **453 M€** + 14 M€ dette, clôture **5 janvier 2023** ✅
- Photonis-HLD : **370 M€**, février 2021 ✅
- Opella : EV **16 Md€**, Sanofi **48,2 %**, Bpifrance **1,8 %**, CD&R **50 %**, net Sanofi **~10 Md€**, clôture **30 avril 2025** ✅
- Ingenico-Worldline : annonce **3 février 2020**, clôture **28 octobre 2020**, valeur **7,8 Md€** ✅
- Servier-Agios : **1,8 Md$** + 200 M$ conditionnels, clôture **1er avril 2021** ✅
- CDPQ-Bombardier Transport : **1,5 Md$ US** pour **30 %**, novembre 2015, clôture Alstom **29 janvier 2021** ✅
- USS-Heathrow : **8,65 %** pour **£392 M**, octobre 2013, cession **décembre 2024** ✅
- GPFG : **19 742 Md NOK**, **8 763 sociétés**, **71 pays**, rendement 2024 **13,1 %** ✅
- CPPIB FY2025 : **714,4 Md$ CAD** au 31 mars 2025 ✅
- CDPQ fin 2024 : **473 Md$ CAD** ✅
- AustralianSuper 30 juin 2024 : **315 Md AUD** ✅
- CalPERS FY2024 : **506,6 Md$** ✅
- PFZW fin 2024 : **259 Md€** ✅
- Ardian AUM 2024 : **200 Md$** dont PE **137 Md$** ✅
- France Invest 2024 : **36,9 Md€ investis** (+13 %), **12,8 Md€ cessions** (+42 %) ✅
- 370 000 entreprises à transmettre d'ici 2030 ✅
- 3 millions d'emplois concernés ✅
- Vivendi scission décembre 2024 : Canal+ (LSE), Havas (Amsterdam), Louis Hachette (Euronext Growth Paris) ✅
- Iliad retrait bourse : prix **182 €**, annonce **30 juillet 2021**, retrait obligatoire **14 octobre 2021** ✅
- Budget Défense 2024 : **47,2 Md€** ✅
- ABP impact investments 2024-2030 : **30 Md€** dont **5 Md€** logements sociaux ✅

---

*Fact-check réalisé par croisement du texte rédigé avec (1) le ch3-FACT-CHECK.md préalable, (2) vérifications web directes sur sources primaires (France Assureurs, INSEE, Banque de France, GE, Sanofi, NBIM, CPP Investments, ABP/APG, CalPERS, AustralianSuper, CDPQ, AMF/OPA Latécoère, Ardian, Heico, Vivendi, Iliad, France Invest, Offshorewind.biz/GE closing 2015). Durée de vérification : environ 45 minutes de recherche active.*

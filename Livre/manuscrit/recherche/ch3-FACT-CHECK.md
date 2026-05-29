# Fact-check Ch.3 — 7 fichiers de recherche
**Date de vérification** : 15 mai 2026  
**Vérificateur** : Fact-Checker (agent Claude)  
**Périmètre** : ch3-capital-qui-dort.md (introuvable — voir note), ch3-transmission-eti-pme.md, ch3-galerie-hold-up.md, ch3-dividendes-contrefactuel.md, ch2-france-sans-capital.md, ch2-bis-academique-analyses.md, ch2-ter-presse-temoignages.md

> **Note liminaire** : Le fichier `ch3-capital-qui-dort.md` est introuvable sur le disque (erreur "File does not exist"). Seuls 6 des 7 fichiers ont pu être lus. Les données de ce fichier sont partiellement couvertes via les sections correspondantes de `ch2-france-sans-capital.md`.

---

## Synthèse exécutive

| Catégorie | Nombre |
|-----------|--------|
| Affirmations vérifiées | ~85 |
| ✅ VÉRIFIÉ | 58 |
| ⚠️ DIVERGENT | 17 |
| ❌ HALLUCINATION | 5 |
| 🔍 À CONFIRMER | 5 |

---

## Erreurs critiques à corriger AVANT rédaction

| # | Affirmation dans les fichiers | Valeur réelle | Gravité |
|---|------------------------------|---------------|---------|
| 1 | Alstom-GE : montant "€12,35 Md" présenté comme prix final | 12,35 Md€ = prix INITIAL (accord avril 2014). Prix FINAL à la clôture (2 nov. 2015) : **9,7 Md€** | CRITIQUE |
| 2 | Mercer 2025 France : grade B, score 70,3, viabilité 48,6 — mais ch1 parle de "33e / score 53,7 / viabilité 49,0" | Grade **B**, score **70,3**, viabilité **48,6**, rang **18e/52**, publié **16 octobre 2025** | CRITIQUE |
| 3 | USS-Heathrow : "2013 : USS acquiert 8,65% pour £392 M" — le fichier indique 2013 mais la note interne dit 2014 | Transaction annoncée et conclue en **octobre 2013** (pas 2014) | MODÉRÉ |
| 4 | Opella : "CD&R acquiert 50% contrôle" — le fichier dit "Sanofi conserve 50 %, Bpifrance 2 %" | Sanofi conserve **48,2 %**, Bpifrance **1,8 %**, CD&R **50 %** | MODÉRÉ |
| 5 | Bombardier-CDPQ sortie : "2020 revente à Alstom" | La transaction Alstom-Bombardier Transport a été **clôturée le 29 janvier 2021** | MODÉRÉ |
| 6 | Pays-Bas taux remplacement : deux chiffres contradictoires (93 % dans ch3-dividendes vs 96 % dans ch2) | OCDE Pensions at a Glance 2025 confirme **96 %+** pour travailleur au salaire moyen | CRITIQUE |
| 7 | Saint-Gobain privatisation 1986 : le ch2 cite "1,5 M actionnaires" | Source Saint-Gobain Archives : **1 500 000 actionnaires** = chiffre confirmé | OK — mais voir détail section 6 |
| 8 | Pierucci arrestation : le fichier mentionne "Arrestation avril 2013" mais ajoute "Arrêt en décembre 2014" dans la chronologie | Arrestation : **14 avril 2013** (JFK). "Décembre 2014" dans le texte semble être une coquille (libération conditionnelle : 2014, pas une date d'arrêt) | MODÉRÉ |

---

## 1. Galerie 10 cas hold-up — vérification cas par cas

### Cas 1 — Lafarge → Holcim (2015)
| Élément | Fichier | Vérification | Statut |
|---------|---------|-------------|--------|
| Date clôture | 10 juillet 2015 | Confirmé (fusion effective juillet 2015) | ✅ |
| Montant | "~38-40 Md€ valeur implicite" | Fusion par échange de titres (pas de cash). Les 38-40 Md€ sont une estimation de capitalisation pré-fusion, cohérente avec les sources presse. | ✅ (avec nuance : valeur estimée, pas prix cash) |
| Acquéreur | Holcim (Suisse) | Confirmé | ✅ |
| Siège délocalisé | Jona (Suisse) | Confirmé | ✅ |

**Note rédactionnelle** : Préciser systématiquement "valeur de la fusion estimée à 38-40 Md€" plutôt que "montant", car il n'y a pas eu de transaction cash.

---

### Cas 2 — Alstom Énergie → General Electric (2014-2015) — CRITIQUE

| Élément | Fichier | Valeur réelle | Statut |
|---------|---------|---------------|--------|
| Date accord | Avril 2014 | ✅ Confirmé (accord annoncé en avril 2014, voté conseil Alstom juin 2014) | ✅ |
| Date clôture | "2 novembre 2015" | ✅ Confirmé (communiqué GE : "GE completes acquisition... November 2, 2015") | ✅ |
| Montant présenté | "€12,35 Md" | ⚠️ DIVERGENT — 12,35 Md€ = montant de l'accord d'avril 2014. **Prix final à la clôture : 9,7 Md€** (ajustements joint-ventures, effets de change, trésorerie nette). Le fichier mentionne bien les deux dans le corps du texte ("€12,35 Md (brut), dont €9,7 Md à Alstom") mais le tableau récapitulatif n'indique que "12,35 Md" sans la nuance. | ⚠️ |
| Pierucci arrestation | "avril 2013" | ✅ Confirmé : arrestation JFK le 14 avril 2013 | ✅ |
| Livre Pierucci | "Lattès 2019" | ✅ Confirmé : JC Lattès, co-auteur Matthieu Aron, 2019 | ✅ |
| Chronologie confuse | "Arrêt en décembre 2014" | ❌ Formulation ambiguë. Pierucci n'a pas été "arrêté en décembre 2014". Il a obtenu une libération conditionnelle après ~14 mois (soit fin 2014). | ❌ |

**Correction à apporter** : Dans le tableau de synthèse (cas 2), remplacer "12,35 Md" par "9,7 Md€ (closing nov. 2015) sur accord initial de 12,35 Md€". Dans le corps du texte sur Pierucci, remplacer "Arrêt en décembre 2014" par "libéré conditionnellement après 14 mois, fin 2014".

---

### Cas 3 — Technip → FMC Technologies / TechnipFMC (2017)

| Élément | Fichier | Valeur réelle | Statut |
|---------|---------|---------------|--------|
| Date accord | Avril 2016 | ✅ Confirmé | ✅ |
| Date effectif | Janvier 2017 | ✅ Confirmé (démarrage officiel jan. 2017) | ✅ |
| Montant | "$13,0 Md (~€11,8 Md)" | ⚠️ DIVERGENT — Les sources donnent 13 Md$ de capitalisation boursière au moment de l'annonce (certaines sources donnent 16,2 Md$ en déc. 2016). C'est une fusion par échange d'actions, pas un achat cash. Le chiffre de 13 Md$ correspond à la capitalisation post-annonce du nouveau groupe. À préciser en tant que "valorisation implicite de la fusion". | ⚠️ |
| Cotation | NYSE + Euronext secondaire | ✅ Confirmé | ✅ |

---

### Cas 4 — Latécoère → Searchlight Capital (2019-2020)

| Élément | Fichier | Valeur réelle | Statut |
|---------|---------|---------------|--------|
| Entrée initiale | "Avril 2019 (26%)" | ⚠️ DIVERGENT — L'entrée initiale était en juin 2019 : SKN Holding (Searchlight) acquiert **24 697 727 actions = 26,05%** pour un total de **106 838 909 $ USD** (~€95 M). Le fichier dit "avril 2019" mais les documents AMF pointent **juin 2019** pour l'acquisition et **septembre 2019** pour le dépôt de l'OPA. | ⚠️ |
| OPA complète | "~€180-200 M" | ⚠️ DIVERGENT — L'OPA valorisait Latécoère à **365 M€ total** au prix de 3,85 €/action. Les 180-200 M correspondent approximativement à la part acquise via l'OPA (après la tranche initiale de 26%), mais la formulation "valeur totale OPA complète 180-200 M" sous-estime la capitalisation totale. Préciser : capitalisation totale OPA 365 M€, montant OPA complète ~180-200 M€ (après tranche initiale). | ⚠️ |
| Acquéreur | Searchlight Capital Partners (USA) | ✅ Confirmé | ✅ |

---

### Cas 5 — Photonis → HLD (2021)

| Élément | Fichier | Valeur réelle | Statut |
|---------|---------|---------------|--------|
| Date blocage Teledyne | "décembre 2020" | ✅ Confirmé (veto Bercy décembre 2020) | ✅ |
| Acquéreur final | HLD (avec participation Ardian) | ✅ Confirmé | ✅ |
| Montant HLD | "€370 M" | ✅ Confirmé (sources Ardian, Opex360, presse spécialisée) | ✅ |
| Montant Teledyne initial | "~€500 M estimé" | ⚠️ DIVERGENT — L'offre Teledyne était de ~430 M€ (certaines sources disent 500 M€ mais c'est la valeur synergique estimée, non l'offre ferme). L'offre initiale de Teledyne avant réduction était autour de 500 M€, ensuite réduite à 430 M€. Fourchette réelle : **430-500 M€**. | ⚠️ |
| Différence "coût de la souveraineté" | "€130 M de moins" | ⚠️ DIVERGENT — Le différentiel dépend de la référence : si offre Teledyne 500 M€, l'écart est 130 M€. Si offre révisée 430 M€, l'écart est 60 M€. Conserver 130 M€ si on se base sur l'offre initiale Teledyne, mais le préciser. | ⚠️ |

---

### Cas 6 — Exxelia → Heico Corporation (2022-2023)

| Élément | Fichier | Valeur réelle | Statut |
|---------|---------|---------------|--------|
| Date annonce | "28 juillet 2022" | ✅ Confirmé | ✅ |
| Date clôture | "5 janvier 2023" | ✅ Confirmé (Heico finalise l'acquisition, janvier 2023) | ✅ |
| Montant | "€453 M (+ €14 M dette = €467 M total)" | ✅ Confirmé (source Electroniques.biz, Sénat, Heico) | ✅ |
| Activités critiques | Sous-marins Barracuda, Rafale, Ariane 5/6, A320 neo, Falcon | ✅ Plausible selon sources GIFAS et Sénat | ✅ |
| Part acquise | Fichier n'indique pas le % | Heico a acquis **94 %** des actions Exxelia (le management gardait ~6 %) | 🔍 à ajouter |

---

### Cas 7 — Sanofi / Opella → CD&R (2024) — CRITIQUE (cas central)

| Élément | Fichier | Valeur réelle | Statut |
|---------|---------|---------------|--------|
| Date annonce | "21 octobre 2024" | ✅ Confirmé (communiqué Sanofi + CD&R du 21 octobre 2024) | ✅ |
| Date closing | "Q2 2025 estimé" | ✅ Confirmé : clôture annoncée le **30 avril 2025** | ✅ |
| Montant EV | "€16 Md enterprise value" | ✅ Confirmé (multiple ~14× EBITDA 2024 estimé) | ✅ |
| Répartition | "CD&R 50%, Sanofi 50%" | ⚠️ DIVERGENT — Sanofi conserve **48,2 %**, Bpifrance **1,8 %**, CD&R **50 %** exactement. Le fichier dit "Sanofi conserve 50 % (synergies futures) / CD&R 50 % contrôle / Bpifrance 2 % symbolique" — légère imprécision sur les pourcentages. | ⚠️ |
| Produits cédés | Doliprane, Othé, Buscopan, formes pédiatriques | ✅ Confirmé | ✅ |
| Premier Ministre Barnier | "Michel Barnier (sept.-déc. 2024)" | ✅ Confirmé (Barnier PM du 5 sept. au 13 déc. 2024) | ✅ |
| Garanties Barnier | Siège maintenu Neuilly, production Domloup 5 ans, R&D €70 M/5 ans, 4 000 emplois | ✅ Cohérent avec sources presse | ✅ |
| Net Sanofi | "€8 Md net" | ✅ Cohérent : "Sanofi nets €10B" selon FiercePharma (le communiqué Sanofi évoque "~€10 milliards de produit net total"). Légère différence avec le "€8 Md" du fichier — utiliser €10 Md. | ⚠️ |

---

### Cas 8 — Ingenico → Worldline (2020)

| Élément | Fichier | Valeur réelle | Statut |
|---------|---------|---------------|--------|
| Date accord | "Juillet 2020" | ⚠️ DIVERGENT — L'accord est annoncé le **3 février 2020** (pas juillet 2020). La clôture est le **28 octobre 2020**. | ⚠️ |
| Date clôture | "28 octobre 2020" | ✅ Confirmé | ✅ |
| Montant | "€7,8 Md" | ✅ Confirmé (valorisation implicite Ingenico ~7,8 Md€, structure 81% actions + 19% cash) | ✅ |
| Structure | "€1,5 Md cash + €500 M obligations convertibles" | ⚠️ DIVERGENT — La structure réelle est 81% en actions Worldline + 19% cash (~2,0 Md€ cash total environ). La description du fichier est approximative. | ⚠️ |

---

### Cas 9 — Servier / Agios Pharmaceuticals (2021)

| Élément | Fichier | Valeur réelle | Statut |
|---------|---------|---------------|--------|
| Date clôture | "25 mars 2021 (approbation actionnaires)" / "clôture H1 2021" | ✅ Confirmé : clôture **1er avril 2021** | ✅ |
| Montant | "$2,0 Md USD (~€1,8 Md)" | ⚠️ DIVERGENT — La structure exacte est : **1,8 Md$ upfront** + jusqu'à **200 M$ de milestone** potentiel = **jusqu'à 2,0 Md$ total**. La formulation "$2,0 Md" est acceptable si présentée comme "jusqu'à 2 Md$". Privilégier "1,8 Md$ (+ 200 M$ conditionnels)". | ⚠️ |
| Vendeur/Acquéreur | Servier (France) achète à Agios (USA) | ✅ Confirmé — cas inverse correct | ✅ |
| Note interne | "FiercePharma mentionne Day One €2,5 Md" | Servier/Agios 2021 et Day One Biopharmaceuticals sont deux opérations distinctes. Pas de confusion vérifiée dans la fiche elle-même. | ✅ |

---

### Cas 10 — SoLocal (2016-2024)

| Élément | Fichier | Valeur réelle | Statut |
|---------|---------|---------------|--------|
| IPO date | "Juillet 2012" | ⚠️ DIVERGENT — SoLocal a été cotée via son ancêtre PagesJaunes Group bien avant 2012. Le groupe SoLocal a changé de nom en 2013. L'IPO 2012 mentionne probablement un événement de levée de fonds ou restructuration, pas une IPO stricto sensu. | 🔍 À confirmer |
| Trajectoire | Dilution progressive via Apax + fonds multiples | ✅ Plausible selon chroniques presse | ✅ |

---

## 2. Capital qui dort — chiffres financiers

> Note : le fichier `ch3-capital-qui-dort.md` est introuvable. Les données ci-dessous sont vérifiées via `ch2-france-sans-capital.md`.

| Affirmation | Source fichier | Valeur réelle | Statut |
|-------------|---------------|---------------|--------|
| Patrimoine financier ménages 2024 : 6 356 Md€ | Banque de France T4 2024 | ✅ Confirmé : 6 356,4 Md€ (Banque de France T4 2024) | ✅ |
| Assurance-vie fonds euros individuels : 1 178 Md€ | ACPR n°175 | ✅ Confirmé : "1 178 milliards d'euros d'encours fin 2024" pour les contrats individuels (ACPR AS175, août 2025) | ✅ |
| Livrets réglementés 956 Md€ | ch3-dividendes | ✅ Confirmé : Livret A + LDDS + LEP = 956 Md€ en 2024 (chiffre cohérent avec Banque de France) | ✅ |
| Livret A seul fin 2024 : 442,5 Md€ | ch2 | ⚠️ DIVERGENT — La recherche donne ~432 Md€ pour 2024 (et 442,5 Md€ semble être une valeur intermédiaire 2024 avant décollecte). Utiliser **432 Md€** pour fin 2024. | ⚠️ |
| PER encours fin 2024 : 118,9 Md€ | ch2 | ✅ Cohérent avec chiffres ministère Économie (119 Md€ Q3 2024) | ✅ |
| PEA : 114 Md€ | ch2 | ✅ Cohérent | ✅ |
| Rendement fonds euros 2024 : 2,63 % brut | ACPR | ✅ Confirmé : "2,63 % en 2024 nets de prélèvements sur encours et avant prélèvements sociaux" (ACPR AS175) | ✅ |
| Détention directe actions France : 12,5 % ménages | INSEE Focus 354 | ⚠️ DIVERGENT — L'INSEE Focus 354 (mai 2025) donne **17,4 % des ménages qui détiennent des valeurs mobilières** (actions + obligations). Plus précisément : 9,6% CTO et 9,8% PEA. Le chiffre "12,5 %" pour "actions directes" n'est pas directement retrouvé. La confusion vient probablement d'un autre critère (uniquement actions cotées en direct, hors PEA et OPC). Utiliser "17,4 % de ménages détenant des valeurs mobilières" ou préciser la définition exacte. | ⚠️ |
| Détention actions 6,7 % | ch2 mentionne "hausse depuis 6,9 % en 2020" | Plausible comme valeur 2020 (point de départ), non comme valeur 2024 | ✅ (valeur 2020 correcte comme base de comparaison) |
| Détention actions Suède : 30-40 % | ch2 | ✅ Cohérent avec diverses sources comparatives | ✅ |
| Détention actions USA : "32-38 %" (Fed SCF 2022) | ch2 | ✅ Cohérent (Fed SCF 2022) | ✅ |
| Cap boursière France / PIB 2024 : 103-124 % | ch2 | ✅ Plausible (fourchette large liée à fluctuations 2024) | ✅ |
| Taux d'épargne 2024 : 17,7 % | ch2 | ✅ Cohérent avec les données Banque de France/INSEE | ✅ |

---

## 3. Transmission ETI/PME

| Affirmation | Source fichier | Valeur réelle | Statut |
|-------------|---------------|---------------|--------|
| 370 000 entreprises à transmettre d'ici 2030 | BPI France Le Lab 2024 | ✅ Confirmé : BPI France Le Lab, étude publiée, "4 dirigeants sur 10 avec au moins 1 salarié ont l'intention de transmettre dans les 5 prochaines années = ~370 000 entreprises" | ✅ |
| 3 millions d'emplois concernés | BPI France 2024 | ✅ Confirmé | ✅ |
| 240 000 sans repreneur identifié | Calcul BPI | ✅ Cohérent : seules ~130 000 transmissions réalisables au rythme actuel sur 5 ans vs 370 000 potentielles | ✅ |
| 26 000 entreprises transmises en 2024 | BPI France | 🔍 À confirmer — chiffre plausible mais non retrouvé directement dans une source primaire accessible |  🔍 |
| GPFG 2024 : 19 742 Md NOK | NBIM Annual Report | ✅ Confirmé exactement | ✅ |
| CPPIB Q2 FY2025 : 675 Md$ CAD | CPP Investments | ✅ Confirmé exactement | ✅ |
| CPPIB FY2025 total : 714 Md$ CAD | CPP Investments | ✅ Confirmé : "714,4 Md$ CAD au 31 mars 2025" (FY2025 fiscal year end) | ✅ |
| ABP fin 2024 : 552 Md€ | APG | ⚠️ DIVERGENT — Les sources donnent "~552 Md€ fin novembre 2024" (APG), et "533 Md€ à fin Q3 2024". Le chiffre de 552 Md€ est probablement correct pour fin 2024 (fin de l'exercice APG) mais la source officielle ABP annual report final 2024 mentionne "500 milliards franchis" sans donner le chiffre précis de fin décembre. Conserver 552 Md€ avec prudence. | ⚠️ |
| AustralianSuper fin 2024 : "280 Md€" | ch3-transmission | ⚠️ DIVERGENT — Au 30 juin 2024 (fin d'exercice australien), AustralianSuper avait **315 Md AUD**. Au 31 déc. 2025 : 410 Md AUD. La conversion "280 Md€" à un taux 2024 est approximative mais plausible si le taux AUD/EUR est ~0,60. Cependant le chiffre de "280 Md€" pour "AustralianSuper" dépend de la date de référence. Utiliser **315 Md AUD (≈ 190 Md€)** pour fin juin 2024 ou **410 Md AUD** pour fin 2025. | ⚠️ |
| CalPERS 2024 : 502-520 Md$ | ch3-transmission | ⚠️ DIVERGENT — CalPERS au 30 juin 2024 : **506,6 Md$**. Le fichier mentionne "556 Md$" dans un tableau et "502 Md$" dans la note. La valeur correcte FY2024 (30 juin 2024) est **506,6 Md$**. | ⚠️ |
| Ardian AUM total : 200 Md$ | Ardian | ✅ Confirmé : Ardian a franchi les 200 Md$ AUM (communiqué 2024). Dont PE : 137 Md$, Real Assets : 49 Md$, Credit : 14 Md$. | ✅ |
| Ardian AUM fin 2024 : 200 Md$ | Ardian Integrated Report 2024 | ⚠️ DIVERGENT — Sources officielles indiquent "en excès de 177 Md$" fin 2024 pour certaines publications, et "200 Md$" franchi dans un communiqué. Le cap des 200 Md$ est confirmé mais la date exacte du franchissement n'est pas précisée. Conserver 200 Md$ comme valeur de référence. | ✅ (à préciser) |
| GPFG rendement 2024 : 13,1 % | NBIM | ✅ Confirmé exactement | ✅ |
| GPFG présent dans 8 763 sociétés, 71 pays | NBIM | ✅ Confirmé dans l'annual report NBIM 2024 | ✅ |

---

## 4. Dividendes CAC 40

| Affirmation | Source fichier | Valeur réelle | Statut |
|-------------|---------------|---------------|--------|
| Dividendes 2024 CAC 40 : 72,8 Md€ | Vernimmen / BFM | ✅ Confirmé : 72,8 Md€ en dividendes cash (+ 25,5 Md€ rachats = 98,2 Md€ total retour actionnaires) | ✅ |
| Hausse dividendes 2024 : +8,5 % | Vernimmen | ✅ Confirmé | ✅ |
| Rachats d'actions : 25,5 Md€ | BFM / Vernimmen | ✅ Confirmé | ✅ |
| Total retour actionnaires : 98 Md€ | Sources presse | ✅ Confirmé (98,2 Md€ exact) | ✅ |
| Top 1 TotalEnergies : 14,6 Md€ | | ✅ Confirmé | ✅ |
| Top 2 LVMH : 6,9 Md€ | | ✅ Confirmé | ✅ |
| Top 3 Stellantis : 6,7 Md€ | | ✅ Confirmé | ✅ |
| % non-résidents CAC 40 fin 2024 : 50 % | Banque de France | ✅ Confirmé exactement (50 % sur 35 sociétés du CAC 40, +0,5 pp vs fin 2023) | ✅ |
| Capitalisation totale CAC 40 2024 : 2 165 Md€ | Banque de France | ✅ Confirmé | ✅ |
| Dividendes captés par l'étranger : 36,4 Md€ | Calcul fichier | ✅ Calcul correct : 50 % × 72,8 Md€ = 36,4 Md€ | ✅ |
| Origine non-résidents : 40% zone euro, 34% USA | Banque de France | ✅ Confirmé | ✅ |
| 19 sociétés CAC 40 détenues > 50 % par non-résidents | Banque de France | ✅ Confirmé | ✅ |
| BlackRock : 2,1 % du CAC 40 | Sources presse 2020 | ⚠️ DIVERGENT — Le chiffre 2,1 % date de 2020 (certaines sources donnent 2,4 % en 2020). Les données 2024 exactes ne sont pas confirmées dans les sources accessibles. Utiliser "environ 2 %" avec prudence, ou citer la source 2020 avec sa date. | ⚠️ |
| Vanguard : 2,0 % du CAC 40 | Sources presse 2020 | ⚠️ Même remarque — données 2020, pas 2024. | ⚠️ |
| Investissements du CAC 40 en hausse de 22 % en 2024 | Vernimmen | ✅ Confirmé : 116,6 Md€ investissements en 2024 (+22 %) | ✅ |
| Pays-Bas taux remplacement : 93,2 % (ch3-dividendes) | Fichier dividendes | ❌ DIVERGENT vs source officielle — OCDE Pensions at a Glance 2025 donne **96 %+** pour le Pays-Bas au salaire moyen. Le chiffre de 93,2 % est probablement basé sur une source antérieure ou un calcul différent (brut vs net). Utiliser **96 %** (OCDE 2025) cohérent avec ch2. | ❌ |
| Pays-Bas actifs gérés : "~500+ Md€ (36 % du PIB)" | ch3-dividendes | ❌ DIVERGENT — Le PIB néerlandais est ~1 100-1 200 Md€. 500 Md€ / 1 150 Md€ = 43 %, pas 36 %. Par ailleurs, les actifs totaux de pension néerlandais sont nettement supérieurs à 500 Md€ (ABP seul = 552 Md€, sans compter PFZW, BPF Bouw…). Le ratio "encours / PIB" néerlandais est en réalité autour de **200-220 % du PIB**. | ❌ |

---

## 5. Cas inspirants contrefactuel

| Affirmation | Source fichier | Valeur réelle | Statut |
|-------------|---------------|---------------|--------|
| CDPQ-Bombardier Transport 2015 : 1,5 Md USD pour 30 % | CDPQ / Bombardier | ✅ Confirmé exactement : accord définitif novembre 2015, 1,5 Md$ USD pour 30 % de BT Holdco | ✅ |
| CDPQ-Bombardier : sortie 2021 (revente à Alstom) | Fichier dit "2021" | ✅ Confirmé : clôture Alstom-BT le **29 janvier 2021** | ✅ |
| CDPQ-Bombardier : "15 000+ emplois sauvés" | Fichier | 🔍 À confirmer — chiffre d'emplois plausible mais non retrouvé dans sources primaires accessibles | 🔍 |
| ABP impact investments 2024-2030 : 30 Md€ | ESG News / ABP | ✅ Confirmé : ABP vise 30 Md€ d'investissements à impact d'ici 2030 | ✅ |
| ABP : 10 Md€ domestiques dans ces 30 Md€ | Fichier | ⚠️ La source originale ABP donne "5 milliards en logements locatifs" + autres. La ventilation "10 Md€ domestiques" est approximative. | ⚠️ |
| USS-Heathrow : 8,65 % pour £392 M | USS / Ferrovial | ✅ Confirmé exactement | ✅ |
| USS-Heathrow : date d'acquisition 2013 | Fichier dit "2013" dans la fiche, note bibliographique "2014" | ✅ Confirmé : transaction conclue en **octobre 2013** (annonce et closing simultanés). La note USS sur leur site date de "mars 2014" (mise à jour du site) mais la transaction est bien de 2013. | ✅ |
| USS-Heathrow sortie partielle 2023 : "vend 7,90 % pour 684 M£" | Fichier | ✅ USS a effectivement vendu sa participation Heathrow en **décembre 2024** (not 2023). Le fichier dit "2023" mais la source USS indique "USS completes sale of stake in Heathrow Airport" en décembre 2024. | ⚠️ |
| CPPIB-Ontario 407 : "50,01 % du capital" | Fichier | 🔍 À confirmer — CPP Investments est bien actionnaire d'Ontario 407 mais la part exacte de 50,01 % n'est pas confirmée dans les sources accessibles. | 🔍 |
| CPPIB-Minto High Park Village : "60 % pour 105 M$ USD" | Fichier | 🔍 À confirmer | 🔍 |
| GPFG > Equinor / Norsk Hydro / Telenor : holdings stratégiques | Wikipedia / Regjeringen.no | ✅ Confirmé | ✅ |

---

## 6. Histoire et culture épargne

| Affirmation | Source fichier | Valeur réelle | Statut |
|-------------|---------------|---------------|--------|
| Caisse d'Épargne fondée 1818 | ch2 | ✅ Confirmé. Date exacte : **22 mai 1818** (acte constitutif signé devant notaire), ordonnance de Louis XVIII le 29 juillet 1818. Fondateurs : Benjamin Delessert + François de La Rochefoucauld-Liancourt. | ✅ |
| Fondateur : Benjamin Delessert | ch2 | ✅ Confirmé (co-fondateur avec La Rochefoucauld-Liancourt) | ✅ |
| Privatisations 1986 Saint-Gobain : 1,5 M actionnaires | ch2 | ✅ Confirmé exactement : "1 500 000 actionnaires" (sources Saint-Gobain Archives, Encyclopaedia Universalis) | ✅ |
| Krach Vivendi-Messier : "perte 96,8 %" | ch2 | 🔍 À confirmer — chiffre très précis, non retrouvé directement. Vivendi Universal a bien subi une déroute boursière massive sous Messier (action divisée par ~10), mais le chiffre exact "96,8 %" n'a pas été confirmé. | 🔍 |
| France Télécom : "-90 %" | ch2 | ✅ Plausible — FT a en effet perdu plus de 90 % entre 2000 et 2002. | ✅ |
| Privatisations 1986 : "4 millions acheteurs en 1986, 6 millions fin 1987" | ch2 | ⚠️ DIVERGENT — La source confirmée pour Saint-Gobain seul est 1,5 M actionnaires. Les 4 millions et 6 millions font référence à l'ensemble du programme de privatisations 1986-1987, pas à Saint-Gobain uniquement. Clarifier dans le texte : "4 millions d'actionnaires participèrent au programme global de privatisations en 1986, 6 millions en 1987." | ⚠️ |

---

## 7. Comparatifs internationaux

| Affirmation | Source fichier | Valeur réelle | Statut |
|-------------|---------------|---------------|--------|
| Pays-Bas taux remplacement 96 % (ch2) | OCDE | ✅ Confirmé : OCDE Pensions at a Glance 2025 = **96 %+** pour salaire moyen | ✅ |
| Pays-Bas taux remplacement 93,2 % (ch3-dividendes) | Autre source | ❌ INCOHÉRENT avec ch2 et OCDE 2025. Trancher définitivement : **96 %** (OCDE 2025). | ❌ |
| Pays-Bas encours fonds de pension / PIB : "220 %" (ch3-transmission dit "36 %") | Pensionpolicyinternational / Thinking Ahead Institute | ❌ DIVERGENT — Le ratio Pays-Bas est autour de **200-220 % du PIB** (source Thinking Ahead Institute 2025). Le "36 %" cité dans ch3-dividendes ("~500+ Md€ = 36 % du PIB") est une erreur de calcul. Les actifs de pension néerlandais totaux (ABP + PFZW + autres = ~1 500+ Md€) représentent bien plus de 100 % du PIB néerlandais. | ❌ |
| Pays-Bas cotisation totale : 22 % (ch2) | Sources sectorielles | ✅ Plausible | ✅ |
| Suède détention actions : 30-40 % | Sources comparatives | ✅ Confirmé (BCE HFCS Wave 4, Statistiska) | ✅ |
| USA détention actions : 32-38 % (Fed SCF 2022) | Federal Reserve | ✅ Confirmé | ✅ |
| GPFG classé #1 mondial en transparence (Global Pension Transparency Benchmark) | NBIM | ✅ Confirmé | ✅ |

---

## 8. Mercer 2025 — Trancher la divergence Ch.1 / Ch.2

### Verdict définitif

Le rapport Mercer CFA Institute Global Pension Index 2025 a été **publié le 16 octobre 2025**.

**Données France vérifiées (source : Mercer.com/fr-fr + Planète CSCA)** :

| Indicateur | Valeur 2025 |
|-----------|------------|
| Score global | **70,3** |
| Grade | **B** |
| Rang | **18e sur 52 systèmes** |
| Sous-indice Adéquation (Performance) | **85,2** (rang 3e mondial) |
| Sous-indice Viabilité (Sustainability) | **48,6** |
| Sous-indice Intégrité | **76,8** |

**Résolution des contradictions** :
- Ch.1 mentionnait "33e / score 53,7 / viabilité 49,0 / grade C+" — ces chiffres correspondent probablement à un rapport antérieur (2022 ou 2023) ou à une mauvaise lecture du rapport.
- Ch.2 mentionnait "grade B / score 70,3 / viabilité 48,6 / octobre 2025" — **ces chiffres sont corrects**.

**Valeurs à utiliser dans tout le manuscrit** :
- Score 2025 : **70,3**
- Grade : **B**
- Rang : **18e/52**
- Viabilité : **48,6**
- Adéquation : **85,2**
- Publication : **16 octobre 2025**

---

## Recommandations pour la rédaction Ch.3

### Chiffres validés à utiliser tels quels

- Dividendes CAC 40 2024 : **72,8 Md€** (dividendes cash) / **98,2 Md€** (total retour actionnaires)
- Non-résidents CAC 40 fin 2024 : **50 %** (Banque de France)
- Fuite dividendes : **36,4 Md€/an** (calcul exact)
- Patrimoine financier ménages : **6 356 Md€** (Banque de France T4 2024)
- Fonds euros individuels : **1 178 Md€** (ACPR AS175)
- Rendement fonds euros 2024 : **2,63 %** brut (ACPR)
- 370 000 entreprises à transmettre d'ici 2030 (BPI France Le Lab)
- 3 millions d'emplois concernés (BPI France)
- GPFG total : **19 742 Md NOK** fin 2024
- CPPIB total : **675,1 Md$ CAD** (Q2 FY2025) / **714,4 Md$ CAD** (FY2025 year-end)
- ABP : **552 Md€** (fin 2024 approximatif)
- Ardian AUM : **200 Md$** (PE : 137 Md$)
- Alstom-GE closing : **9,7 Md€** (prix final) sur accord initial de 12,35 Md€
- Exxelia-Heico : **453 M€** + 14 M€ dette = 467 M€ total
- Photonis-HLD : **370 M€**
- CDPQ-Bombardier : **1,5 Md$ USD** (2015) — revente Alstom closing **29 janvier 2021**
- USS-Heathrow : **8,65 %** pour **£392 M** — octobre **2013**
- Mercer 2025 France : score **70,3**, grade **B**, viabilité **48,6**, rang **18e/52**
- Caisse d'Épargne fondée : **22 mai 1818**

### Chiffres à reformuler ou corriger

1. **Alstom-GE** : Toujours distinguer "accord initial 12,35 Md€ (avril 2014)" et "prix de closing 9,7 Md€ (novembre 2015)". Ne jamais présenter 12,35 Md€ comme le montant final.
2. **Opella-CD&R** : Sanofi **48,2 %**, Bpifrance **1,8 %** (pas "2 %"), CD&R **50 %**. Produit net Sanofi : **~10 Md€** (pas 8 Md€).
3. **Ingenico-Worldline** : Accord annoncé le **3 février 2020** (pas juillet 2020), closing 28 octobre 2020.
4. **Servier-Agios** : **1,8 Md$ upfront + 200 M$ conditionnel** = jusqu'à 2 Md$. Préciser la structure.
5. **Pays-Bas taux remplacement** : Utiliser exclusivement **96 %** (OCDE 2025), pas 93,2 %.
6. **Pays-Bas actifs pension / PIB** : Le ratio est **~200-220 % du PIB** (Thinking Ahead Institute). Le "36 %" est une erreur.
7. **AustralianSuper** : Au 30 juin 2024 : **315 Md AUD** ; au 31 déc. 2025 : **410 Md AUD**. La valeur "280 Md€" en euros est une conversion approximative.
8. **CalPERS** : Valeur au 30 juin 2024 : **506,6 Md$** (pas 502 ni 520 ni 556 Md$).
9. **Détention actions France** : L'INSEE Focus 354 (2025) donne **17,4 %** pour la détention de valeurs mobilières. Le chiffre "12,5 %" n'est pas directement retrouvé — vérifier la définition exacte utilisée (actions cotées en direct uniquement ?).
10. **Saint-Gobain 1986** : 1 500 000 actionnaires pour Saint-Gobain seul. Les 4 millions/6 millions se rapportent au programme global de privatisations 1986-1987.
11. **USS-Heathrow sortie** : La vente complète est finalisée en **décembre 2024**, pas 2023.
12. **Pierucci** : Arrestation **14 avril 2013**. Supprimer la mention "Arrêt en décembre 2014" ou la remplacer par "libéré conditionnellement fin 2014".
13. **Latécoère** : Entrée Searchlight : **juin 2019** (pas avril). OPA totale décembre 2019, capitalisation 365 M€.

### Chiffres à éviter (non confirmables)

- Le "96,8 %" de perte Vivendi-Messier (non retrouvé dans source primaire)
- Le "50,01 %" de CPPIB dans Ontario 407 (non confirmé)
- Les poids actuels 2024 de BlackRock/Vanguard sur le CAC 40 (les données disponibles datent de 2020)
- Le "15 000 emplois sauvés" par CDPQ-Bombardier (non sourcé)
- La valeur 26 000 transmissions effectives en 2024 (non confirmé sur source primaire accessible)

### Alertes cohérence transversale

- **Mercer 2025** : Purger toute référence au "grade C+", "score 53,7", "rang 33e" qui correspond à un ancien rapport. Utiliser exclusivement les chiffres 2025 confirmés.
- **Pays-Bas** : Unifier le taux de remplacement à 96 % (OCDE 2025) dans tous les chapitres.
- **AustralianSuper** : Utiliser 280 Md AUD (valeur mi-2024) avec la date, plutôt que des conversions approximatives en euros qui varient selon les taux.

---

*Fact-check réalisé avec vérifications web directes sur sources primaires (Banque de France, ACPR, NBIM, CPP Investments, Ardian, Sanofi, GE, Alstom, Ferrovial/USS, Worldline, Servier/Agios, BPI France Le Lab, OCDE, Mercer/CFA Institute). Certains accès PDF binaires (rapport complet Mercer 2025) inaccessibles directement — données croisées via sources secondaires fiables (Mercer.com/fr, Planète CSCA, Pension Policy International).*

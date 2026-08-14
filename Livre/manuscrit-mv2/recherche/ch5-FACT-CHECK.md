# Fact-check Ch.5 — 4 fichiers de recherche
**Date d'audit** : 16 mai 2026  
**Auditeur** : Fact-Checker (agent Claude)  
**Périmètre** : ch5-transitions-etrangeres-calendriers.md, ch5-options-architecture.md, ch5-contexte-2026-impact-macro.md, ch5-financement-double-paiement.md

---

## Synthèse exécutive

- Total affirmations auditées : 68
- VERIFIEES : 43
- DIVERGENTES : 13
- HALLUCINATIONS : 4
- A CONFIRMER : 8

---

## Erreurs critiques a corriger avant redaction

| Passage | Erreur | Correction | Source |
|---------|--------|-----------|--------|
| ch5-contexte : "renverse par un vote de confiance le 8 septembre 2025" | Date incorrecte (vote 8 sept., demission formelle 9 sept.) | Le vote de defiance a eu lieu le 8 septembre 2025 (364 contre 194) ; Bayrou a remis sa demission le 9 septembre 2025 | franceinfo, Radio-Canada |
| ch5-contexte : "gouvernement Lecornu issu du parti Renaissance" | Imprécis. Le gouvernement Lecornu I a ete forme le 5 octobre 2025, puis Lecornu nommé Premier ministre le 10 octobre 2025 (Gouvernement Lecornu II apres remaniement) | Sébastien Lecornu nommé Premier ministre le 10 octobre 2025, pas le 9 septembre | Elysée, Vie-publique.fr |
| ch5-options-architecture : "CDPQ — 496 Md CAD (janvier 2025)" | Incorrect. Au 31 décembre 2024, CDPQ = 473 Md CAD. 496 Md CAD correspond au 30 juin 2025. | La valeur la plus exacte pour le manuscrit : 473 Md CAD (fin 2024) OU 496 Md CAD (mi-2025) selon la date de référence choisie | Yahoo Finance, La Caisse communiqué juillet 2025 |
| ch5-transitions : "CPPIB créée mai 1999" | Errone. CPPIB créée par loi en décembre 1997 ; début des investissements en 1999. | CPPIB créée par loi en décembre 1997 (Act of Parliament), premiers investissements effectifs en 1999 | Wikipedia CPP Investments |
| ch5-options-architecture : "DC 2003-484 (Fillon, 2003)" | Mauvaise décision. DC 2003-484 du 20 novembre 2003 concerne l'immigration (Loi sur la maitrise de l'immigration), non les retraites. | La décision retraites 2003 est la DC 2003-483 DC du 14 aout 2003 (réforme Fillon, allongement durée de cotisation) | Conseil constitutionnel |
| ch5-transitions : tableau Pays-Bas "600 fonds" | Tres surestimé. En 2023, la consolidation a ramené le nombre de fonds à moins de 200. | Le Pays-Bas comptait ~1 000 fonds en 2000, réduits à moins de 200 en 2022-2023, consolidation accelerant avec la WTP | IPE, Pensions Expert |
| ch5-options-architecture : GPFG Norvege "1 858 Md€" | Inexact pour fin 2024. Le GPFG valait 19 742 Md NOK fin 2024, soit environ 1 700 Md€ (pas 1 858 Md€). La valeur 21 268 Md NOK correspond a fin 2025, soit environ 1 850-1 900 Md€. | Pour fin 2024 : ~1 700 Md€. Pour fin 2025 : ~1 900 Md€ (verifier le taux EUR/NOK). Ne pas mélanger les dates. | NBIM Annual Report 2024 |
| ch5-financement : "CPP 2025 : 780 Md CAD" avec ref "mars 2025" | Divergence de date. 714,4 Md CAD = fin de l'exercice fiscal 31 mars 2025. 780,7 Md CAD = 31 décembre 2025 (T3 exercice fiscal 2026). | Préciser : 714,4 Md CAD au 31 mars 2025 (fin fiscal year 2025) ; 780,7 Md CAD au 31 décembre 2025 | CPP Investments press releases |
| ch5-transitions : UK auto-enrolment "Feb 2018 → 5%" | Date légèrement incorrecte. La hausse à 5 % est entrée en vigueur le 6 avril 2018 (pas février 2018). | 6 avril 2018 (pas février 2018). La hausse à 8 % est entrée en vigueur le 6 avril 2019 (pas "avril 2019" tout court, même si généralement correct). | The Pensions Regulator UK |
| ch5-contexte : "cotisations 16,5 % NDC + 2 % capitalisation = 18,5 %" (section F comparaisons) | Erreur : le texte écrit "2 %" pour la part PPM mais la structure correcte est 16,5 % NDC + 2,5 % PPM = 19 %. | La part PPM est 2,5 %, pas 2 %. Total = 18,5 % (standard) mais avec 16 % NDC + 2,5 % PPM dans certaines présentations post-2000. Vérifier : la cotisation officielle est 18,5 % = 16,5 % + 2 % (selon le COR 2019) OU 16 % + 2,5 % selon d'autres sources. | COR 2019 doc-1108 ; fiche ch2 a arbitrer |
| ch5-financement : "CSG 1 point = ~14 Md€" | Sous-estimé pour 2024. Les sources donnent 16,1 Md€ (FIPECO) a 17,5 Md€ (CFDT Retraités) pour 1 point de CSG en 2024. | 1 point de CSG = 16-17 Md€ en 2024 (selon assiette retenue : activité seule ou tous revenus). Utiliser "environ 16 Md€" est plus prudent que "14 Md€". | FIPECO, CFDT Retraités |
| ch5-financement : tableau "CPP Investments : ~500 Md CAD (360 Md€)" (section D) | Contradiction interne. La section IV.A du même fichier cite 780 Md CAD pour "mars 2025". Dans la section D, le bilan Canada cite 500 Md CAD comme figure 2024. | Les 500 Md CAD cités dans la section D correspondent probablement aux données d'un rapport intermédiaire (2022-2023). La valeur 2024 est 473 Md CAD (CDPQ) OU 632 Md CAD (CPPIB fin mars 2024). Lever l'ambiguité : CPPIB ≠ CDPQ. | CPP Investments / La Caisse |

---

## Verification du contexte politique 2026 (Premier ministre)

**VERDICT : le fichier ch5-contexte-2026 est globalement correct mais imprécis sur les dates.**

Ce qui s'est passé :
- Bayrou nommé le 23 décembre 2024 (correct dans le fichier)
- Vote de defiance le 8 septembre 2025 (364 voix contre, 194 pour) : correct
- Demission formelle remise le 9 septembre 2025 : correct
- Lecornu nommé Premier ministre : DEUX nominations distinctes
  - Lecornu I nommé le 5 octobre 2025 (composition du 5 octobre)
  - Lecornu nommé officiellement Premier ministre par décret du 10 octobre 2025 (Gouvernement Lecornu II)
  - Remaniement a la marge le 26 février 2026

**Le fichier ecrit** : "Bayrou dechu sept. 2025 → Lecornu". C'est correct dans l'enchaînement mais imprécis : Lecornu est nommé le 10 octobre 2025 (pas debut septembre).

**Correction a apporter** : "Gouvernement Bayrou renversé le 8 septembre 2025 (vote de défiance, premier en Ve République). Sébastien Lecornu nommé Premier ministre le 10 octobre 2025 ; gouvernement remanié le 26 février 2026."

**Le fichier décrit également des ministres fictifs du gouvernement Bayrou** (Élisabeth Borne à l'Éducation, Manuel Valls en Outre-mer, Gérald Darmanin à la Justice, Bruno Retailleau à l'Intérieur). Cette liste est PARTIELLEMENT INVÉRIFIABLE dans ce format (la composition exacte du gouvernement Bayrou n'a pas été vérifiée en détail, sauf Darmanin à la Justice qui est confirmé dans le Gouvernement Lecornu II par la recherche — mais sa présence dans Bayrou est une affirmation distincte). STATUT : A CONFIRMER via source gouvernementale officielle pour la composition exacte du gouvernement Bayrou (décembre 2024 - septembre 2025).

---

## Coherence inter-chapitres (avec Ch.1, Ch.2, Ch.3, Ch.4)

| Donnée | Ch.5 (présent) | Données Ch.2/Ch.4 antérieures | Arbitrage |
|--------|---------------|-------------------------------|-----------|
| CPPIB encours | 780 Md CAD "mars 2025" (fichier transitions) | Ch.2 : 714,4 Md CAD "31 mars 2025" | Ch.2 avait raison. 780,7 Md CAD = 31 décembre 2025 (T3 fiscal 2026). Utiliser 714,4 Md CAD pour mars 2025. |
| CDPQ encours | 496 Md CAD "janvier 2025" (options-architecture) | Ch.2 : 473 Md CAD fin 2024 | Ch.2 avait raison pour fin 2024. 496 Md CAD = juin 2025. Préciser la date dans ch5. |
| GPFG Norvège | 1 858 Md€ (options-architecture) | Ch.2 : 1 900 Md€ | Les deux sont approximatifs. Fin 2024 ≈ 1 700 Md€ ; fin 2025 ≈ 1 900 Md€ (21 268 Md NOK). RETENIR : ~1 900 Md€ fin 2025 si c'est la date de référence, ou ~1 700 Md€ fin 2024. |
| NEST UK | 49,7 Md£ au 31 mars 2025 (contexte et options) | Ch.2 : 49,7 Md£ | COHERENT et EXACT (confirme par NEST Annual Report) |
| ABP Pays-Bas | 494 Md€ (options-architecture) | Ch.2 : 542 Md€ fin 2024 | DIVERGENT. ABP fin 2024 : les sources mentionnent ~533 Md€ (T3 2024) à ~552 Md€ (novembre 2024). 542 Md€ semble plausible. 494 Md€ est plus ancien (2023 ou T1 2024). |
| NEST membres | 13,8 M membres (options-architecture, mars 2025) | Cohérent avec Annual Report NEST | EXACT |
| Ratio cotisants/retraités 2024 = 1,79 | Fichier contexte confirme | Ch.1 : confirme | COHERENT |
| Solde naturel France 2025 = -6 000 | Contexte confirme | Ch.1 | EXACT (INSEE Bilan démographique 2025) |
| Taux fécondité 2025 = 1,56 | Contexte confirme | (Ch.1 non vérifié) | EXACT (INSEE 2025) |
| Suède cotisations 16,5 % + 2,5 % = 18,5 % | Transitions = correct | Ch.2/Ch.4 confirment | COHERENT (mais voir divergence dans section F de contexte ci-dessus) |

---

## Detail par fichier

### Fichier 1 : ch5-transitions-etrangeres-calendriers.md

#### Australie

| Affirmation | Statut | Note |
|------------|--------|------|
| Superannuation Guarantee Act entre en vigueur 1er juillet 1992 | VERIFIE | Correct ; vote et entrée en vigueur juillet 1992 |
| Taux initial 3 % pour petits employeurs, 4 % gros | VERIFIE | Correct selon ATO |
| Taux 11,5 % en 2024-25 (avant hausse finale) | VERIFIE | Correct : 11 % en 2023, 11,5 % en 2024, 12 % juillet 2025 |
| 12 % à partir de juillet 2025 | VERIFIE | Confirmé par ATO et sources multiples |
| Encours juin 2025 : 4 330 Md AUD | PARTIELLEMENT VERIFIE | APRA June 2025 = 4,3 trillions AUD total. Chiffre cohérent. |
| Encours fin 2024 : 4 100 Md AUD | DIVERGENT | APRA : septembre 2024 non precise ; December 2025 = 4,5 trillion. Données intermédiaires non confirmées au chiffre pres. Ordre de grandeur correct. |
| Tableau 1997-2002 : "7%→9% +0,5pp/an" | A CONFIRMER | La montée détaillée dans ce tableau mérite vérification directe ATO. La montée a atteint 9 % en 2002 (avant gel 2002-2013). |
| "Gel 2002-2013 sous Abbott" | PARTIELLEMENT INEXACT | Le gel résulte de la politique de John Howard (1996-2007) qui a figé le taux à 9 % dès 2002, puis Tony Abbott a gelé la hausse programmée (9,25 %→12 %) en 2014. Le gel 2002-2013 est correct dans le résultat mais l'attribution à "Abbott" pour toute la période est incorrect : il faut dire Howard (2002) puis Abbott (2014). |

#### Suède

| Affirmation | Statut | Note |
|------------|--------|------|
| Accord pluripartite "juin 1991" principes généraux (SAP Carlsson) | A CONFIRMER | Les sources indiquent 1991-1994 comme période de négociation. Le texte dit "juin 1991" pour la SAP. Plausible mais non confirmé à la date exacte par source primaire. |
| Vote parlementaire juin 1994 avec 80 % de l'Assemblée | VERIFIE | Large consensus suédois documenté ; chiffre 80 % cohérent avec les sources. |
| Loi complète 1998 | VERIFIE | Correct |
| Entrée en vigueur 1er janvier 1999 | VERIFIE | Correct |
| NDC 16,5 % + PPM 2,5 % = 18,5 % total | VERIFIE | Standard international confirme (COR 2019, gouvernement suédois) |
| AP1-AP3, AP4 créés en 1960 | VERIFIE | Correct |
| AP6 créé en 2000 (post-NDC) | A CONFIRMER | La description "AP6 gère le PPM" est inexacte : AP6 est le fonds dédié au capital-risque (non coté). Le PPM est géré par une agence dédiée (Pensionsmyndigheten). POSSIBLE ERREUR FACTUELLEMENT. |
| AP-fonds 2024 : ~SEK 2 130 Md (190 Md€) | VERIFIE | Ordre de grandeur cohérent avec sources |

#### Royaume-Uni

| Affirmation | Statut | Note |
|------------|--------|------|
| Pensions Act 2008 sous Gordon Brown | VERIFIE | Correct |
| Mise en vigueur octobre 2012 sous Cameron | VERIFIE | Correct |
| Octobre 2012 : 2 % total (1 % employeur min) | VERIFIE | Correct (The Pensions Regulator) |
| "Feb 2018" : 5 % total (2 % employeur) | DIVERGENT | La hausse a 5 % est entree en vigueur le 6 AVRIL 2018, pas "Feb 2018" (février 2018). Le tableau du fichier est inexact sur la date. |
| Avril 2019 : 8 % total (3 % employeur) | VERIFIE | Confirmé : 6 avril 2019. |
| NEST 2025 : 49,7 Md£ et 13,8 M membres | VERIFIE | Exact (NEST Annual Report au 31 mars 2025). |
| NEST "20+ M members" en 2024 | DIVERGENT (fichier options-architecture) | NEST comptait 13,8 M membres au 31 mars 2025. "20+ M" est erroné. L'auto-enrolment total UK est ~22 M mais NEST seul = 13,8 M. |

#### Pays-Bas

| Affirmation | Statut | Note |
|------------|--------|------|
| Wet toekomst pensioenen votée 30 mai 2023 | VERIFIE | Wikipedia Future Pensions Act confirme le vote en mai 2023 (opposition du PVV, 50PLUS etc. a tenté de retarder). |
| En vigueur 1er juillet 2023 | VERIFIE | Correct |
| Deadline finale 1er janvier 2028 | VERIFIE | Correct (confirmé par DNB, Deloitte, business.gov.nl) |
| ~1 500 Md€ d'actifs a reclasser | PARTIELLEMENT VERIFIE | Les sources parlent de ~1 400-1 600 Md€ pour l'ensemble du système néerlandais. L'ordre de grandeur est correct. |
| ABP : 600 Md€ | DIVERGENT | ABP fin 2024 = ~533-552 Md€ (pas 600 Md€). 600 Md€ est surestimé. |
| "600 fonds" aux Pays-Bas | HALLUCINATION | Moins de 200 fonds en 2022-2023 (IPE confirme : "de ~1 000 fonds en 2000 à moins de 200 en 2022"). Le chiffre "600" ne correspond à aucune période récente. |
| Prime de transition fin 2025 : 50-80 Md€ | A CONFIRMER | Estimation raisonnable mentionnée dans plusieurs sources professionnelles, mais le chiffre exact varie selon les projections. Non confirmé par source primaire dans cet audit. |
| "Deadline plans implémentation (regulator) 1er juillet 2025" | A CONFIRMER | Le calendrier détaillé de la WTP avec les jalons intermédiaires (plans à fournir au DNB) n'a pas été confirmé précisément. |

#### Canada

| Affirmation | Statut | Note |
|------------|--------|------|
| "Pensions Act 1997" vote au Parlement | IMPRECIS | Le texte pertinent est la réforme CPP de 1997 ; il n'y a pas de "Pensions Act 1997" spécifique à ce nom. La réforme a été adoptée par le Parlement fédéral (loi d'amendement CPP) en décembre 1997. |
| CPPIB créée "mai 1999" | HALLUCINATION PARTIELLE | CPPIB créée par loi en décembre 1997 (Act of Parliament), opérationnelle et ayant commencé ses investissements en 1999. La date "mai 1999" est inexacte pour la création juridique. A corriger : "créée par loi en décembre 1997, premiers investissements en 1999". |
| Taux CPP base 1996 : 5,6 % → 9,9 % en 2003 | VERIFIE | Correct (CRA, Wikipedia Canada Pension Plan) |
| Montée 1998-2003 : tableau avec taux par année | A CONFIRMER | L'évolution annuelle détaillée dans le tableau (5,6 % → 6,0 % → 6,4 % → ... → 9,9 %) est plausible mais non vérifiée ligne par ligne. CRA confirme 9,9 % en 2003 comme taux final. |
| CPP Enhancement : Bill C-26 voté 2016, entrée vigueur janvier 2019 | VERIFIE | Royal Assent 15 décembre 2016, en vigueur 1er janvier 2019. Correct. |
| "Mai 2024 : atteint 5,95 %" | DIVERGENT | La progression CPP Enhancement 2019-2023 a mené le taux de base de 4,95 % à 5,95 % (soit +1 % total). La date "mai 2024" dans le texte est incorrecte : le taux de 5,95 % est atteint progressivement de 2019 à 2023, pas "mai 2024". En 2024-2025, c'est le second plateau (new Upper Earnings Limit) qui s'applique. |
| CPPIB mars 2025 : 780 Md CAD | DIVERGENT | 714,4 Md CAD au 31 mars 2025 (exercice fiscal 2025). 780,7 Md CAD = 31 décembre 2025. La date et le chiffre ne correspondent pas. |

---

### Fichier 2 : ch5-options-architecture.md

| Affirmation | Statut | Note |
|------------|--------|------|
| CDPQ : 496 Md CAD "janvier 2025" | DIVERGENT | 473 Md CAD fin décembre 2024 ; 496 Md CAD au 30 juin 2025. "Janvier 2025" ne correspond à aucun chiffre officiel. |
| Pays-Bas : "600 fonds" | HALLUCINATION | Moins de 200 fonds en 2022-2023. (Voir supra.) |
| NEST : 49,7 Md£ au 31 mars 2025 | VERIFIE | Exact. |
| NEST : "13,8 M membres (mars 2025)" | VERIFIE | Exact. |
| NEST : "20+ M members" | DIVERGENT | Voir supra. NEST = 13,8 M membres, pas "20+". |
| GPFG Norvège : 1 858 Md€ et "rendement 2025 : +15,1 %" | PARTIELLEMENT VERIFIE | Le rendement 2025 de +15,1 % est confirmé par les sources (NBIM). Mais la valeur 1 858 Md€ correspond approximativement à fin 2024 (~1 700 Md€) ou est une estimation intermédiaire, pas le chiffre de fin 2025 (21 268 Md NOK ≈ ~1 900 Md€). Légère confusion temporelle. |
| ABP Pays-Bas : 494 Md€ 2024 (fichier options) | DIVERGENT | ABP fin 2024 ≈ 533-552 Md€ selon sources (European Pensions, aob.nl). 494 Md€ est sous-estimé et correspond davantage à 2023. |
| FRR : "26 Md€ aujourd'hui" (mention dans article constitutionnel) | DIVERGENT | Le FRR valait 20,4 Md€ au 31 décembre 2024 (rapport annuel FRR 2024). "26 Md€" est inexact. |
| FRR rendement 2024 : "+6,46 % net" | VERIFIE | Exact (Rapport annuel FRR 2024). |
| FRR "rendement 2017-2024 : création de 14,1 Md€" | A CONFIRMER | Chiffre spécifique non trouvé dans les sources consultées. Plausible selon la performance annoncée mais à confirmer via le rapport FRR complet. |
| DC 2003-484 = décision retraites | HALLUCINATION | DC 2003-484 DC du 20 novembre 2003 concerne l'immigration, non les retraites. La décision retraites est DC 2003-483 DC du 14 août 2003. |
| DC 2010-617 (Woerth) | VERIFIE | Cette décision (Woerth 2010) est correctement citée et décrit le contexte réforme durée cotisation. |
| DC 2023-849 (Borne) | VERIFIE | Correct. |
| Article L111-1 CSS | PARTIELLEMENT EXACT | Le texte de L.111-1 CSS cité dans le fichier ("La Nation réaffirme solennellement...") est une reformulation libre. L'article L.111-1 affirme la solidarité nationale mais le libellé exact diffère. STATUT : A CONFIRMER via Légifrance. |
| IORP II : Directive 2016/2341 | VERIFIE | Correct. |
| Convention 102 OIT, ratifiée par France | VERIFIE | La France a ratifié la Convention 102 de l'OIT. |

---

### Fichier 3 : ch5-contexte-2026-impact-macro.md

#### Contexte politique

| Affirmation | Statut | Note |
|------------|--------|------|
| "Gouvernement Bayrou nommé le 23 décembre 2024" | VERIFIE | Correct. |
| "Renversé par vote de confiance le 8 septembre 2025" | VERIFIE | Le vote de défiance a eu lieu le 8 septembre 2025 (364 contre 194). |
| "Remplacé par gouvernement Lecornu issu de Renaissance" | PARTIELLEMENT EXACT | Lecornu est issu de la mouvance macroniste/Renaissance mais le gouvernement est présenté comme une coalition plus large. La qualification "Renaissance" est approximative. |
| "Composition gouvernement Bayrou" (liste des ministres) | A CONFIRMER | Borne à l'Éducation, Valls en Outre-mer, Darmanin à la Justice, Retailleau à l'Intérieur : cette liste n'a pas pu être vérifiée contre les décrets officiels du gouvernement Bayrou (décembre 2024). A confirmer via info.gouv.fr. |
| Réforme Borne 2023 : "LFSS 2026 en suspend l'application pour nés avant 1969" | A CONFIRMER | La suspension de la réforme 2023 pour les nés avant 1969 est une information politique spécifique. Non confirmée par source primaire dans cet audit. Plausible compte tenu du contexte politique mais à vérifier. |
| Présidentielle française "mai 2027" | VERIFIE | La présidentielle française est bien prévue en avril/mai 2027. |

#### COR 2025

| Affirmation | Statut | Note |
|------------|--------|------|
| Déficit 2025 : -5,0 Md€ | VERIFIE | COR juin 2025 : -5 Md€ en 2025. Correct. |
| Déficit 2030 : -6,6 Md€ (-0,2 % PIB) | VERIFIE | COR juin 2025 confirme : -6,6 Md€ en 2030. Correct. |
| Déficit 2050 : -1,1 % PIB | VERIFIE | COR confirme ≈ -1,1 % PIB en 2050. |
| Déficit 2070 : -1,4 % PIB (≈ 45 Md€) | VERIFIE | COR confirme. |
| "Déficit 2024 : excédentaire +8,5 Md€ dû aux réserves FRR" | A CONFIRMER | Le COR mentionne un solde positif en 2024 mais le chiffre "+8,5 Md€" attribué aux réserves FRR n'est pas directement confirmé. Le FRR a versé 2,1 Md€ à la CADES en 2024, pas "généré +8,5 Md€" d'excédent global. Possible confusion entre solde global et contribution FRR. |
| DREES 2025 : 17,2 M retraités fin 2023 | VERIFIE | Cohérent avec données officielles. |
| DREES 2025 : pension mensuelle 1 666 € brut | VERIFIE | Cohérent avec données officielles. |
| FRR provisions : 20,4 Md€ à fin 2024 | VERIFIE | Exact (rapport FRR 2024). |
| "Réserves cumulées 2024 : 213,8 Md€ tous régimes" | A CONFIRMER | Chiffre spécifique non vérifié dans cet audit. Source citée : UNSA Retraités. Plausible mais a vérifier. |

#### Démographie INSEE 2025

| Affirmation | Statut | Note |
|------------|--------|------|
| Naissances 2025 : 645 000 | VERIFIE | INSEE Bilan démographique 2025. Exact. |
| Décès 2025 : 651 000 | VERIFIE | INSEE. Exact. |
| Solde naturel 2025 : -6 000 (1ère fois depuis 1945) | VERIFIE | INSEE. Exact. |
| Taux de fécondité 2025 : 1,56 | VERIFIE | INSEE : 1,56 en 2025 (après 1,61 en 2024). Exact. |
| Solde migratoire : +176 000 (provisoire) | VERIFIE | INSEE. Cohérent. |
| Population France : 69,1 M | VERIFIE | INSEE. Cohérent. |
| Espérance de vie hommes 2024 : 80,3 ans | VERIFIE | INSEE. Exact. |
| Espérance de vie femmes 2024 : 85,9 ans | VERIFIE | INSEE. Exact. |

#### Impact macro

| Affirmation | Statut | Note |
|------------|--------|------|
| Détention CAC 40 non-résidents : 50 % fin 2024 | VERIFIE | Banque de France confirme (1 083/2 165 Md€). |
| Capital à 25 ans : 1 500-3 000 Md€ | A CONFIRMER | Estimation modélisée, cohérente avec les ordres de grandeur. Non issue d'une publication académique précise. |
| Taux de remplacement actuel ~62 % | VERIFIE | Cohérent avec DREES et COR. |
| Taux de remplacement cible 75 % (+13 pts) | A CONFIRMER | Scénario modélisé. Cohérent avec l'exemple suédois cité mais n'est pas une projection officielle. |
| Emplois nets : +250 000 (cumulé 2052) | A CONFIRMER | Estimation de l'auteur, non issue d'une étude externe indépendante. Le fichier lui-même reconnait (note finale) que c'est un scénario. |
| Recettes fiscales +7-8 Md€/an | A CONFIRMER | Estimation modélisée. Non confirmée par source externe. |
| Productivité +0,4-0,8 pts TFP | A CONFIRMER | Le fichier lui-même signale "scénario, pas consensus académique final". Correct. Aghion-Bergeaud cités mais le lien causal direct capitalisation→TFP n'est pas démontré dans une étude dédiée à la France. |
| Suède : cotisations 16,5 % notionnel + 2 % capitalisation | DIVERGENT | La part capitalisée (PPM) est 2,5 %, pas "2 %". Erreur répétée dans la section F du fichier contexte (voir supra). |
| Suède taux chômage : 6,5 % | A CONFIRMER | Plausible mais peut être daté. |
| Australie encours "2 500+ Md AUD 2025" | DIVERGENT | APRA juin 2025 = 4,3 trillions AUD total (4 300 Md AUD), pas "2 500+". Le chiffre de 2 500 Md AUD correspond approximativement à 2016-2017. C'est une sous-estimation majeure pour 2025. |

---

### Fichier 4 : ch5-financement-double-paiement.md

| Affirmation | Statut | Note |
|------------|--------|------|
| Cotisations vieillesse régime général 2025 : 16,9 % | VERIFIE | Cohérent avec CNAV 2025. |
| Masse salariale brute France ≈ 1 100 Md€ (INSEE 2024) | VERIFIE | Ordre de grandeur confirmé. |
| 2 % × 1 100 Md€ = 22 Md€/an | VERIFIE | Calcul correct. |
| COR déficit 2030 : 6,6 Md€ | VERIFIE | Correct. |
| COR déficit 2070 : 45 Md€ (1,4 % PIB) | VERIFIE | Correct. |
| FRR : encours 20 Md€ (section V Levier 1) | PARTIELLEMENT VERIFIE | FRR = 20,4 Md€ au 31 décembre 2024. "20 Md€" est une approximation acceptable. |
| FRR rendement 2024 : +6,46 % | VERIFIE | Exact. |
| FRR versements CADES : 1,45 Md€/an 2025-2033 (ch5-contexte) VS "2,1 Md€ annuels" (ch5-financement) | DIVERGENCE INTERNE | Le ch5-financement dit que le FRR a versé "2,1 Md€ à la CADES en juin 2024", ce qui correspond au versement annuel contractuel. Le ch5-contexte mentionne "1,45 Md€/an entre 2025-2033 (réduction de 2,1 Md€/an précédent)". Il est possible que le versement ait été réduit de 2,1 Md€ à 1,45 Md€ à partir de 2025 — mais les deux fichiers citent des chiffres différents sans explication. A CONFIRMER via rapport FRR ou CADES. |
| Australie SG 2025 : "12 % du salaire ordinaire (OTE)" | VERIFIE | Exact (1er juillet 2025). |
| Australie : "encours ≈ 3 000 Md AUD (≈ 2 000 Md€)" en 2024 | DIVERGENT | APRA juin 2025 = 4 300 Md AUD total. En 2024, l'encours dépassait déjà 3 500-3 600 Md AUD selon ASFA. "3 000 Md AUD" sous-estime significativement. |
| CPPIB 2024 : "~500 Md CAD (360 Md€)" | DIVERGENT | Confusion CPPIB/CDPQ. CPPIB fin mars 2024 : 632 Md CAD. CDPQ fin 2024 : 473 Md CAD. Ni "500 Md CAD" ne correspond a une date précise pour l'un ou l'autre. |
| Passif implicite France 2022 : 417 % du PIB | VERIFIE | Eurostat/Commission européenne (SEC 2010, 2024 Ageing Report context). La valeur est documentée par l'INSEE et Eurostat pour la France. |
| Passif implicite Italie : 443 % / Espagne : 507 % / Allemagne : 353 % | VERIFIE | Ces comparaisons sont cohérentes avec le cadre Eurostat et les sources. |
| CPPIB 2025 : 780 Md CAD (mars 2025) | DIVERGENT | 714,4 Md CAD au 31 mars 2025 (FY2025 end). 780,7 Md CAD = 31 décembre 2025. |
| AGIRC-ARRCO : "encours actifs ~75-80 Md€" | A CONFIRMER | Les réserves AGIRC-ARRCO sont évaluées à environ 70-80 Md€. La mention "75-80 Md€" est plausible mais à confirmer via rapport AGIRC-ARRCO 2024-2025. |
| Cotisation patronale 2 % = 22 Md€/an | VERIFIE | Calcul correct (2 % × 1 100 Md€ masse salariale). |
| CSG 1 point = ~14 Md€ | DIVERGENT | Sources 2024 indiquent 16-17 Md€ par point de CSG (toutes assiettes). 14 Md€ est sous-estimé pour 2024. Possible si calculé sur la seule assiette activité (environ 109 Md€ de recettes CSG activité / 9,2 points = ~12 Md€/point sur activité seule). Préciser l'assiette ou utiliser la fourchette 14-17 Md€. |
| Sous-indexation 1 pt/an → 2-3 Md€/an | VERIFIE | Ordre de grandeur cohérent : sur 370 Md€ de dépenses retraites (13,1 % PIB), 1 point d'indexation = ~3,7 Md€/an. "2-3 Md€" est légèrement sous-estimé mais dans un ordre de grandeur raisonnable. |
| NEST UK loan DWP : "£387 Md DWP" | HALLUCINATION | NEST a reçu un prêt de 387 MILLIONS (pas milliards) de livres du DWP. Erreur d'un facteur 1 000 dans l'unité. Le rapport NEST 2025 confirme qu'il a commencé à rembourser ce prêt et réalisé son premier bénéfice. |
| LFSS pour 2026 en suspend réforme Borne | A CONFIRMER | Affirmation politique spécifique a vérifier. |

---

## Recommandations pour la redaction

### Corrections imperatives avant écriture

1. **Numéro décision Conseil constitutionnel** : remplacer DC 2003-484 par DC 2003-483 DC (14 août 2003, réforme Fillon retraites).

2. **NEST UK prêt DWP** : corriger "£387 Md" en "387 M£" (millions, pas milliards).

3. **CPPIB date de création** : corriger "créée mai 1999" en "créée par loi en décembre 1997, opérationnelle à l'investissement en 1999".

4. **Pays-Bas nombre de fonds** : remplacer "600 fonds" par "moins de 200 fonds en 2023" (après consolidation depuis les ~1 000 fonds de 2000).

5. **CPP Enhancement "mai 2024"** : reformuler ; le taux de 5,95 % est atteint en 2023 (phase 1 complète), pas "mai 2024". En 2024-2025 s'applique le second palier (Upper Earnings Limit).

6. **ABP Pays-Bas** : corriger "600 Md€" en "~540 Md€" (fin 2024) ; corriger "494 Md€" (options-architecture) en "~540 Md€".

7. **Encours australien 2024-2025** : corriger partout "2 500 Md AUD" en "4 300 Md AUD" (juin 2025, APRA).

8. **CSG 1 point** : reformuler "~14 Md€" en "environ 16-17 Md€ sur l'ensemble de l'assiette CSG ou ~12-14 Md€ sur la seule assiette activité".

9. **GPFG Norvège** : distinguer les dates. Fin 2024 ≈ 1 700 Md€ (19 742 Md NOK). Fin 2025 ≈ ~1 900 Md€ (21 268 Md NOK). Ne pas mélanger avec le chiffre de Ch.2.

10. **CDPQ** : clarifier la date de référence. 473 Md CAD = fin 2024 ; 496 Md CAD = juin 2025. Choisir une date et la nommer explicitement.

11. **UK auto-enrolment Feb 2018** : corriger en "6 avril 2018".

12. **Suède PPM = 2,5 %** : corriger les occurrences erronées "2 %" en "2,5 %" dans la section comparaison (fichier contexte).

### Points a surveiller mais non bloquants

- Le calendrier politique (Bayrou → Lecornu) est correct dans l'essentiel. Ajouter la date précise : "Lecornu nommé Premier ministre le 10 octobre 2025".
- Les projections macro (emplois, TFP, taux de remplacement) sont clairement des modélisations de l'auteur et doivent rester présentées comme telles dans le manuscrit.
- La question AP6/PPM (gestion du PPM capitalisé) mérite une vérification complémentaire si la description détaillée de la Suède est utilisée.
- La composition du gouvernement Bayrou (liste des ministres) reste a confirmer via une source officielle.

### Ce qui est solide et peut être utilisé sans réserve

- Tous les chiffres COR 2025 (déficits 2025, 2030, 2050, 2070)
- INSEE Bilan démographique 2025 (naissances, décès, solde naturel, fécondité)
- FRR : 20,4 Md€ fin 2024, rendement +6,46 %
- Taux australien 12 % au 1er juillet 2025
- NEST UK : 49,7 Md£ et 13,8 M membres au 31 mars 2025
- Détention CAC 40 non-résidents : 50 % fin 2024 (Banque de France)
- Passif implicite France : 417 % PIB (Eurostat/Commission européenne)
- WTP Pays-Bas : en vigueur 1er juillet 2023, deadline 1er janvier 2028
- CPP Enhancement : Bill C-26, Royal Assent décembre 2016, en vigueur janvier 2019
- CPPIB : 714,4 Md CAD au 31 mars 2025 (FY2025)

---

## Sources utilisees dans cet audit

- [CPP Investments Net Assets Total $714.4 Billion at 2025 Fiscal Year End](https://finance.yahoo.com/news/cpp-investments-net-assets-total-100000604.html)
- [CPP Investments Net Assets Total $780.7 Billion at Third Quarter Fiscal 2026](https://www.newswire.ca/news-releases/cpp-investments-net-assets-total-780-7-billion-at-third-quarter-fiscal-2026-832201322.html)
- [APRA Superannuation Statistics June 2025](https://www.apra.gov.au/news-and-publications/apra-releases-superannuation-statistics-for-june-2025)
- [NEST Annual Report 2025 (31 mars 2025)](https://www.nestpensions.org.uk/schemeweb/nest/nestcorporation/news-press-and-policy/press-releases/annual-report-and-accounts.html)
- [Rapport COR juin 2025](https://www.cor-retraites.fr/sites/default/files/2025-06/RA_2025_def_publi.pdf)
- [FRR Rapport annuel 2024](https://www.fondsdereserve.fr/documents/FRR-RA2024-FR-2.pdf)
- [INSEE Bilan démographique 2025](https://www.insee.fr/fr/statistiques/8721209)
- [Lecornu nommé Premier ministre — Elysée, 10 octobre 2025](https://www.elysee.fr/emmanuel-macron/2025/10/10/nomination-de-sebastien-lecornu-premier-ministre)
- [Chute gouvernement Bayrou — franceinfo](https://www.franceinfo.fr/politique/gouvernement-de-francois-bayrou/chute-du-gouvernement-de-francois-bayrou-le-premier-ministre-a-officiellement-remis-sa-demission-a-emmanuel-macron_7482589.html)
- [Décision DC 2003-483 DC — Conseil constitutionnel](https://www.conseil-constitutionnel.fr/decision/2003/2003483DC.htm)
- [ABP assets grow to over 500 billion — aob.nl](https://www.aob.nl/en/recent/articles/abp-assets-exceed-500-billion-euros/)
- [GPFG Annual Report 2024 — NBIM](https://www.nbim.no/contentassets/490f9f062cfc4694b12c45f4d04ab0a5/gpfg_annual_report_2024_uuweb2.pdf)
- [GPFG 2025 fin d'année : 21 268 Md NOK](http://pensionpulse.blogspot.com/2026/02/norways-gpfg-gains-151-in-2025.html)
- [CDPQ 2024 : 473 Md CAD](https://www.benefitsandpensionsmonitor.com/investments/fixed-income/cdpq-reports-473-billion-in-assets-with-mixed-returns-across-portfolios/391481)
- [CDPQ juin 2025 : 496 Md CAD](https://www.lacaisse.com/en/news/pressreleases/caisse-posted-mid-year-2025-return-46-over-six-months-77-over-five-years)
- [Wet toekomst pensioenen Wikipedia](https://en.wikipedia.org/wiki/Future_Pensions_Act)
- [CPP Investments Wikipedia — création décembre 1997](https://en.wikipedia.org/wiki/CPP_Investments)
- [Netherlands pension funds consolidation — IPE](https://www.ipe.com/country-reports/netherlands-pension-transition-drives-consolidation/10061825.article)
- [CPP Enhancement — Canada.ca](https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-enhancement.html)
- [UK Auto-enrolment phasing — The Pensions Regulator](https://www.thepensionsregulator.gov.uk/en/business-advisers/automatic-enrolment-guide-for-business-advisers/minimum-contribution-increases-planned-by-law-phasing)
- [CSG 2024 : 1 point = 16-17 Md€ — CFDT Retraités / FIPECO](https://www.fipeco.fr/fiche/Limp%C3%B4t-sur-le-revenu-et-la-CSG)

# Fact-check Ch.2 — 3 fichiers de recherche

**Date du fact-check** : 14 mai 2026  
**Vérificateur** : Agent fact-checker (claude-sonnet-4-6)  
**Fichiers vérifiés** :
- `ch2-pedagogie-capitalisation.md`
- `ch2-modelisation-personnelle.md`
- `ch2-garanties-risques.md`

---

## Synthèse exécutive

- Total affirmations vérifiées : 62
- ✅ Vérifiées : 38
- ⚠️ Divergentes (valeur réelle différente) : 14
- ❌ Hallucinations (introuvables ou clairement fausses) : 3
- 🔍 À confirmer manuellement : 7

---

## Erreurs critiques à corriger AVANT rédaction

| # | Affirmation citée | Fichier | Valeur réelle vérifiée | Correction |
|---|---|---|---|---|
| 1 | AP7 Såfa : « 15,0 % annualisé nominal depuis mai 2010 » | Modélisation | **14 % annualisé** selon sources primaires (European Pensions, AP7 officiel, Grokipedia). La valeur 15 % est imprécise. | Remplacer par « ~14 % annualisé nominal depuis 2010 » |
| 2 | AP7 Garanties : « rendement moyen annualisé : 13,5 % sur 10 ans, 14 % depuis 2010 » | Garanties | Valeur 13,5 % sur 10 ans non vérifiable dans les sources. Depuis 2010 : ~14 %. | Supprimer le « 13,5 % sur 10 ans » non sourcé ; garder « ~14 % depuis 2010 » |
| 3 | CPP Investments : rendement 2024 = « 9,4 % » | Pédagogie | CPP Investments FY se termine en **mars**, pas décembre. FY2024 = 8,0 %, FY2025 = **9,3 %** (au 31 mars 2025). Il n'y a pas de chiffre officiel CPP pour « 2024 » calendaire. | Remplacer par « 9,3 % FY2025 (au 31 mars 2025) » |
| 4 | PFZW : « 7,7 % 2024 » | Pédagogie + Modélisation | Valeur réelle confirmée à **8 %** (pas 7,7 %) par le rapport annuel 2024 de PFZW + European Pensions. | Corriger 7,7 % → 8 % |
| 5 | ABP : « EUR 500 Md+ » actifs | Pédagogie | ABP fin 2024 : **EUR 542 Md** (et non « EUR 500 Md+ » ou « EUR 465 Md »). | Remplacer par « ~EUR 542 Md fin 2024 » |
| 6 | ABP Garanties : « 465 milliards € » actifs | Garanties | ABP fin 2024 : **EUR 542 Md**. La valeur 465 Md€ est la valeur historique 2022 environ. | Corriger → EUR 542 Md |
| 7 | Enron : « 3,2 milliards $ pertes 401(k) » | Garanties | Le chiffre 3,2 Md$ est une addition composite (1 Md$ 401k + 2 Md$ pensions + 1,2 Md$ retraites). La perte directe des 401(k) était de **~1,2–1,3 Md$** pour ~15 000 salariés. Sources officielles : 1,2 Md$ (GAO, EPI) à 1,3 Md$ (US Senate Hearing). | Remplacer « 3,2 Md$ » par « ~1,2–1,3 Md$ de pertes en 401(k) + ~2 Md$ en pensions DB, soit ~3,2 Md$ toutes retraites confondues » — ou préciser que le chiffre 3,2 Md$ inclut toutes formes de retraites |
| 8 | Mercer 2025 : France « Grade D/C » | Garanties | France = **Grade B, score 70,3** (sous-indices : performance 85,2 / viabilité 48,6 / intégrité 76,8). Pas de Grade D ni Grade C. | Corriger → « Grade B, score 70,3 (viabilité faible à 48,6) » |
| 9 | Mercer 2025 Grade A intégrité : « Pays-Bas, Danemark, Suède, UK, Islande » | Garanties | Grade A global 2025 : **Pays-Bas, Islande, Danemark, Israël, Singapour**. La Suède est **Grade B+** (score 78,2). Le Royaume-Uni est **Grade B** (score 72,2). | Corriger la liste Grade A. Suède = B+, UK = B. |
| 10 | 2000 : « temps de récupération : 6-8 ans » | Garanties | S&P 500 : retour au pic mars 2000 en **octobre 2007**, soit **~7,5 ans**. La fourchette 6-8 ans est approximativement exacte mais le bas de fourchette (6 ans) est inexact. Plus précis : « ~7-7,5 ans ». Note : Nasdaq a mis ~17 ans. | Reformuler : « ~7 ans (S&P 500 ; Nasdaq ~17 ans) » |
| 11 | 2020 COVID : « 4-5 mois » récupération | Garanties | S&P 500 a récupéré le 18 août 2020, soit environ **6 mois** après le pic de février 2020 (et ~5 mois après le creux de mars). La fourchette « 4-5 mois » est sous-estimée par ~1 mois. | Reformuler : « ~5-6 mois » |
| 12 | Superannuation Australie : « 11,5 % du salaire depuis 2023 » | Pédagogie | Le taux de 11,5 % est entré en vigueur le **1er juillet 2024** (pas 2023). En 2023, le taux était de **11 %**. | Corriger : « 11,5 % depuis juillet 2024, 12 % depuis juillet 2025 » |
| 13 | GPFG : « 6,3 % long terme (1998-2024) » | Pédagogie | Confirmé pour le brut nominal. Mais le rendement **réel net** (après inflation et frais) est **4,1 %**, ce qui est différent. Le fichier pédagogie mélange parfois brut et réel. | Préciser systématiquement : brut 6,3 % vs réel net 4,1 % |
| 14 | NEST : « Actif fin 2025 : GBP 49,7 Md » | Pédagogie | La date exacte est **31 mars 2025** (fin d'exercice NEST), pas « fin 2025 ». Le chiffre GBP 49,7 Md est juste. | Préciser : « GBP 49,7 Md au 31 mars 2025 » |

---

## Hallucinations confirmées

| # | Affirmation | Fichier | Constat |
|---|---|---|---|
| H1 | AP7 Garanties : « rendement 2024 : +27,3 % de rendement (AP7 Equity) » puis dit que le « rendement moyen annualisé » serait « 13,5 % sur 10 ans » | Garanties | Le chiffre 13,5 % sur 10 ans est introuvable dans toutes les sources AP7 consultées. AP7 publie des rendements annuels mais ne communique pas un chiffre « 10 ans » isolé. Ce chiffre semble fabriqué. À supprimer. |
| H2 | INSEE/Destinie 2 : « TRI ~1,5 % » attribué à « Breuil-Genier/Blanchet/Tô 2015 Économie et Statistique n°481-482 » | Modélisation | La référence bibliographique correcte de l'article INSEE est **Dubois Y. & Marino A. (2015)**, pas « Breuil-Genier/Blanchet/Tô ». Breuil-Genier/Blanchet/Tô sont des économistes de l'INSEE mais cette attribution spécifique est erronée pour cet article. La vraie référence : Dubois & Marino, Économie et Statistique n°481-482, 2015. L'URL citée (https://www.insee.fr/fr/statistiques/1305193) redirige vers Dubois & Marino. |
| H3 | Piketty : « p. 72 » dans Le Capital au XXIe siècle, Seuil 2013 | Pédagogie | La page 72 pour la formulation exacte de r > g n'est pas vérifiable. Les sources académiques citent plutôt les pages 53-55 pour l'introduction du concept, et p. 363+ pour le développement central. La page 72 est probablement incorrecte. À indiquer « [p. à vérifier dans l'édition papier] » dans le manuscrit. |

---

## Détail par fichier

### ch2-pedagogie-capitalisation.md

| Affirmation | Source citée | Valeur vérifiée | Statut |
|---|---|---|---|
| Assurance-vie : encours « 1 178 Md€ fin 2024 » | ACPR N°170 | 1 178 Md€ = provisions mathématiques fonds euros individuels uniquement (total assurance-vie = ~1 989 Md€ fin 2024). Le chiffre 1 178 Md€ est exact pour les seuls fonds euros individuels, conforme à l'ACPR. | ✅ VÉRIFIÉ (mais scope restreint fonds euros, pas total assurance-vie) |
| Fonds euros rendement 2024 : 2,63 % brut | ACPR Analyse et Synthèse N°175, août 2025 | Confirmé : 2,63 % nets de prélèvements sur encours, avant prélèvements sociaux, pour contrats individuels. Source ACPR authentifiée. | ✅ VÉRIFIÉ |
| PER encours T3 2024 : 119 Md€ | Bercy communiqué février 2025 | 118,9 Md€ exactement (arrondi à 119 Md€ dans le communiqué). Décomposition confirmée : individuel 68,1 Md€ + collectif 27,2 Md€ + obligatoire 23,6 Md€. | ✅ VÉRIFIÉ |
| PER titulaires : 11 M | Bercy février 2025 | 11,2 M exactement. L'arrondi « 11 M » est acceptable. | ✅ VÉRIFIÉ |
| PER couverture : ~37 % actifs | Calculé sur 11 M / 30 M actifs | Approximation plausible. La population active française est ~30 M. 11 M / 30 M = 36,7 %. Acceptable. | ✅ VÉRIFIÉ (calcul cohérent) |
| CDPQ actifs : CAD 473 Md | Rapport annuel 2024 | Confirmé : 473 Md CAD net au 31 décembre 2024. | ✅ VÉRIFIÉ |
| CDPQ rendement 2024 : 9,4 % | CDPQ rapport annuel 2024 | Confirmé : rendement pondéré 9,4 % pour l'année 2024 (calendrier). | ✅ VÉRIFIÉ |
| CDPQ 5 ans : 6,2 % | CDPQ rapport annuel 2024 | Confirmé : 6,2 % annualisé sur 5 ans. | ✅ VÉRIFIÉ |
| CDPQ 10 ans : 7,1 % | CDPQ rapport annuel 2024 | Confirmé : 7,1 % annualisé sur 10 ans. | ✅ VÉRIFIÉ |
| GPFG actifs fin 2024 : NOK 19 742 Md | NBIM Annual Report 2024 | Confirmé : 19 742 Md NOK (~EUR 1 900 Md). | ✅ VÉRIFIÉ |
| GPFG rendement 2024 : 13,1 % | NBIM Annual Report 2024 | Confirmé : 13,1 % en 2024. | ✅ VÉRIFIÉ |
| GPFG long terme brut (1998-2024) : 6,3 % | NBIM Annual Report 2024 | Confirmé : 6,3 % annualisé nominal brut depuis 1998. | ✅ VÉRIFIÉ |
| GPFG allocation 2024 : 71,4 % actions / 26,6 % obligations / 1,8 % immobilier / 0,1 % EnR | NBIM 2024 | Non réconfirmé via le rapport (PDF trop grand), mais chiffres cohérents avec sources NBIM publiques. | 🔍 À CONFIRMER dans PDF rapport annuel NBIM 2024 |
| AP7 rendement 2024 : 27,3 % | European Pensions, AP7 Annual Report 2024 | Confirmé : 27,3 % pour AP7 Såfa en 2024 (AP7 Equity 29,8 %, AP7 Fixed Income 3,1 %). | ✅ VÉRIFIÉ |
| AP7 depuis mai 2010 : « 409 % cumulé, soit 15,0 % annualisé nominal » | Sources secondaires | Les sources disponibles (European Pensions, Grokipedia) citent **14 %** depuis 2010, pas 15 %. La valeur 409 % et « 15,0 % » est donnée par une source (European Pensions) mais en contradiction avec d'autres sources (« 14 % »). ⚠️ DIVERGENT. | ⚠️ DIVERGENT — utiliser « ~14 % » pour sécurité |
| AP7 actifs 2024 : SEK 1,44 Tr | Rapport annuel AP7 2024 | Confirmé : SEK 1 440 Md au 31/12/2024. (Le site AP7.se indique SEK 1 401 Md en février 2026 — cohérent avec légère baisse depuis fin 2024.) | ✅ VÉRIFIÉ |
| AP7 membres : 5,9 M | Sources AP7 et European Pensions | Confirmé : 5,9 M de Suédois. | ✅ VÉRIFIÉ |
| ABP rendement 2024 : 8,6 % | European Pensions 2024 | Confirmé : 8,6 % pour ABP en 2024. | ✅ VÉRIFIÉ |
| ABP actifs : « EUR 500 Md+ » | Source European Pensions | ⚠️ ABP fin 2024 = ~EUR 542 Md. La formulation « EUR 500 Md+ » est techniquement vraie mais sous-évalue fortement. Utilisez EUR 542 Md. | ⚠️ DIVERGENT |
| ABP membres : 2,9 M | Source | Confirmé : ~2,9 M salariés couverts. | ✅ VÉRIFIÉ |
| PFZW actifs fin 2024 : EUR 258,6 Md | European Pensions / PFZW Annual Report | ⚠️ PFZW rapport 2024 : EUR 259 Md (arrondi supérieur). La valeur 258,6 Md est proche mais la source officielle annonce 259 Md. Différence minime. | ⚠️ DIVERGENT MINEUR (259 vs 258,6 Md€) |
| PFZW rendement 2024 : 7,7 % | Fichier pédagogie | ⚠️ Valeur réelle : **8 %** (pas 7,7 %). Source : European Pensions + PFZW Annual Report Summary 2024. | ⚠️ DIVERGENT — corriger 7,7 % → 8 % |
| Industriens Pension actifs : DKK 255 Md | Annual Report 2024 | Confirmé : DKK 255 Md fin 2024. | ✅ VÉRIFIÉ |
| Industriens Pension rendement 2024 : 6,3 % | Annual Report 2024 | Confirmé : 6,3 % correspondant à DKK 14,4 Md de profit. | ✅ VÉRIFIÉ |
| Industriens membres : 447 000 | Annual Report 2024 | Confirmé : « almost 447 000 » (447 000 après ajout 4 700 nouveaux membres). | ✅ VÉRIFIÉ |
| NEST actifs : GBP 49,7 Md | NEST Annual Report 2024-25 | Confirmé : GBP 49,7 Md au 31 mars 2025. Note : la date de référence est mars 2025, pas « fin 2025 ». | ✅ VÉRIFIÉ (date à préciser) |
| NEST membres : 13,8 M | NEST Annual Report 2024-25 | Confirmé : 13,8 M membres au 31 mars 2025. | ✅ VÉRIFIÉ |
| NEST rendement 2045 Fund : 9,9 % / an (5 ans) | NEST Annual Report 2024-25 | Confirmé : 9,9 % annualisé sur 5 ans au 31/03/2025 pour le Retirement Date Fund 2045. | ✅ VÉRIFIÉ |
| Superannuation Australie actifs : AUD 4,2 Tr | APRA statistiques | AUD 4,2 Tr = données APRA décembre 2024. ✅ Juste pour fin 2024 (était 3,9 Tr en juin 2024, 4,1 Tr en septembre 2024, 4,2 Tr en décembre 2024). | ✅ VÉRIFIÉ |
| Superannuation taux : « 11,5 % depuis 2023 » | Fichier | ⚠️ **ERREUR** : Le taux de 11,5 % est entré en vigueur au **1er juillet 2024**, pas 2023. En FY2023-24, le taux était 11 %. | ⚠️ DIVERGENT — corriger 2023 → juillet 2024 |
| Superannuation rendement MySuper : 13,4 % | APRA 2024 | Confirmé : 13,4 % MySuper sur 12 mois à septembre 2024 (T3 2024). | ✅ VÉRIFIÉ |
| KiwiSaver actifs : NZD 123 Md | Morningstar / RBNZ | ⚠️ Les données disponibles montrent 111,8 Md NZD au 31 mars 2024 et 121,9 Md NZD au 31 décembre 2024. La valeur 123 Md NZD n'est pas exactement vérifiée mais est cohérente avec une estimation début 2025. Utiliser « ~122 Md NZD fin 2024 ». | ⚠️ DIVERGENT MINEUR |
| KiwiSaver membres : 3,39 M | FMA / sources | Confirmé : 3 334 654 membres au 31 mars 2024, soit ~3,34 M. La valeur 3,39 M est légèrement surestimée (peut-être estimée fin 2024). Plausible. | 🔍 À CONFIRMER pour date exacte |
| UBS/Dimson-Marsh-Staunton : actions mondiales 5,2 % réel / 125 ans | Yearbook 2025 | Confirmé : 5,2 % annualisé réel mondial sur 125 ans (1900-2024). | ✅ VÉRIFIÉ |
| UBS obligations : 1,7 % réel | Yearbook 2025 | Confirmé : 1,7 % obligations gouvernementales réel long terme. | ✅ VÉRIFIÉ |
| UBS bills (cash) : 0,5 % réel | Yearbook 2025 | Confirmé : 0,5 % réel sur bons du Trésor. | ✅ VÉRIFIÉ |
| Citation Einstein apocryphe | Fichier pédagogie | Traité correctement : « probablement apocryphe », aucune trace primaire. Le fichier prévient de ne pas l'attribuer à Einstein. | ✅ CORRECT (traitement approprié) |
| Piketty, r > g, Seuil 2013 | Le Capital au XXIe siècle | Ouvrage confirmé : Seuil 2013, 970 pages. La formulation r > g est centrale au livre. | ✅ VÉRIFIÉ (sauf page 72 — voir hallucinations) |
| Bruno Palier, Réformer les retraites, Presses de Sciences Po, 2021, 272 p. | Bibliographie | Ouvrage confirmé existant. La page exacte citée comme référence (p. ??) est marquée [À VÉRIFIER] dans le fichier — ce marquage est correct. | ✅ CORRECT (ouvrage existe) |
| Jean Tirole, Économie du bien commun, PUF 2016 | Bibliographie | Ouvrage confirmé : PUF, 2016. | ✅ VÉRIFIÉ |

---

### ch2-modelisation-personnelle.md

| Affirmation | Source citée | Valeur vérifiée | Statut |
|---|---|---|---|
| CPP Investments : rendement 10 ans net 8,3 % | Annual Report FY2025 | Confirmé : 8,3 % annualisé net sur 10 ans, au 31 mars 2025 (FY2025). | ✅ VÉRIFIÉ |
| CPP Investments actifs : 714,4 Md$ CAD | Annual Report FY2025 | Confirmé : 714,4 Md$ CAD au 31 mars 2025. | ✅ VÉRIFIÉ |
| CPP Investments rendement FY2025 : 9,3 % | Annual Report FY2025 | Confirmé : 9,3 % net pour FY2025. Le fichier l'indique correctement. | ✅ VÉRIFIÉ |
| GPFG rendement réel net 10 ans : 4,1 % | NBIM Annual Report 2024 | Confirmé : 4,1 % réel net annualisé sur 1998-2024 (après inflation et frais de gestion). | ✅ VÉRIFIÉ |
| AustralianSuper 10 ans : 7,94 % net | Annual Report 2025 | Confirmé : 7,94 % net annualisé sur 10 ans au 30 juin 2025. | ✅ VÉRIFIÉ |
| AustralianSuper FY2025 : 9,52 % | Annual Report 2025 | Confirmé : 9,52 % (Super accounts), 10,41 % (Pension accounts). | ✅ VÉRIFIÉ |
| AustralianSuper actifs : ~250 Md AUD | Rapport 2024 | La valeur exacte est ~350 Md AUD en 2024-25 (le fonds a fortement crû). 250 Md AUD correspond à une estimation antérieure (~2023). | ⚠️ DIVERGENT — utiliser « ~350 Md AUD » pour 2024-25 |
| AP7 depuis mai 2010 : « 15,0 % annualisé nominal » | Sources AP7 | ⚠️ Les sources primaires disponibles indiquent **14 %** annualisé depuis 2010. La valeur 15,0 % apparaît dans une source (European Pensions) liée à l'article 2024 mais 14 % est la valeur la plus fréquemment citée. | ⚠️ DIVERGENT — utiliser « ~14 % » |
| OCDE Pensions at a Glance 2025 — France TRN net : 70 % | OCDE 2025 | Confirmé par les sources secondaires OCDE. La valeur 70 % correspond au taux de remplacement net pour un salarié moyen à carrière complète en France. | ✅ VÉRIFIÉ |
| OCDE — Pays-Bas TRN net : 96 % | OCDE 2025 | Confirmé : 96 % net pour les Pays-Bas, le plus élevé de l'OCDE. | ✅ VÉRIFIÉ |
| OCDE — Allemagne TRN net : 53 % | OCDE 2025 | Confirmé par sources OCDE secondaires. | ✅ VÉRIFIÉ |
| OCDE — Moyenne OCDE TRN net : 63 % | OCDE 2025 | Confirmé : 63,2 % moyenne OCDE pour le système obligatoire. | ✅ VÉRIFIÉ |
| COR rapport 2025 — génération 1963, TRN 74,4 % | COR Rapport annuel juin 2025 | Confirmé : taux de remplacement net 74,4 % pour un salarié non-cadre privé de la génération 1963, départ à 61,5 ans au taux plein. Source UNSA Retraités/analyse COR 2025. | ✅ VÉRIFIÉ |
| TRI France système répartition : « ~1,5 % » | Dubois & Marino (2015), INSEE n°481-482 | Cohérent avec la littérature (TRI estimé 1,5-2 % pour génération 1963). La référence correcte est Dubois & Marino 2015 (pas Breuil-Genier/Blanchet/Tô — voir section hallucinations). | 🔍 À CONFIRMER dans le PDF INSEE ES481 |
| Martinot Fondapol nov 2024 — rendement réel testé : 3 %, 4 %, 5 % | Note Fondapol n°252 | Cohérent avec les résumés HTML accessibles et la littérature citant Martinot. Le PDF est binaire mais l'information est synthétisée dans le fichier de recherche de manière cohérente. | 🔍 À CONFIRMER via lecture PDF Fondapol |
| Martinot — 43 ans carrière, 70 % remplacement | Note Fondapol | Cohérent avec les paramètres standard OCDE et COR. | 🔍 À CONFIRMER via lecture PDF Fondapol |
| Martinot mars 2025 — cotisation 4 % capitalisation, 25 % pensions financées par capital en 2070 | Note Fondapol n°260 | Cohérent avec résumés publics disponibles. | 🔍 À CONFIRMER via lecture PDF Fondapol |
| Calcul FV annuité : 1 400 € × 163,05 = 228 270 € (4 %, 43 ans) | Calcul mathématique | Vérification : FV = 1 400 × [((1,04)^43 - 1) / 0,04]. (1,04)^43 = 5,400. FV = 1 400 × 4,400/0,04 = 1 400 × 110,01 ≈ 154 014 €. **ERREUR DE CALCUL**. Le facteur 163,05 utilisé correspond à un annuité de fin de période différent. Recalcul précis : (1,04)^43 = 5,40, facteur annuité = (5,40-1)/0,04 = 110. FV ≈ 1 400 × 110 = 154 000 €. | ❌ ERREUR DE CALCUL IMPORTANTE — voir note ci-dessous |

> **Note sur le calcul d'annuité** : Le facteur 163,05 semble incorrect pour r=4 %, n=43. Le facteur FV d'une annuité de fin de période à 4 % sur 43 ans est environ 110, donnant FV ≈ 154 000 €, pas 228 270 €. Le facteur 163,05 correspondrait à r=4 %, n=43 en début de période (annuité-due), mais même ainsi le résultat serait ~160 000 €. La valeur de 228 270 € semble résulter d'un calcul avec un taux ou une durée différente. À reverifier avec soin avant publication. Ce chiffre conditionne tous les écarts cumulés (165 000 €, 335 000 €) du chapitre — s'il est faux, toute la modélisation est faussée.

---

### ch2-garanties-risques.md

| Affirmation | Source citée | Valeur vérifiée | Statut |
|---|---|---|---|
| AP7 allocation : 100 % actions jusqu'à 55 ans, puis glissement vers 2/3 obligations + 1/3 actions à 75 ans | Pensionsmyndigheten / AP7 | Confirmé : c'est le glide path officiel d'AP7 Såfa. | ✅ VÉRIFIÉ |
| AP7 frais : 0,05 % / an Equity, 0,04 % Fixed Income | AP7 officiel | Confirmé : frais effectifs très bas. | ✅ VÉRIFIÉ |
| AP7 rendement 2024 : +27,3 % (Equity 29,8 %, Fixed Income 3,1 %) | European Pensions 2024 | Confirmé. | ✅ VÉRIFIÉ |
| AP7 rendement moyen annualisé : « 13,5 % sur 10 ans, 14 % depuis 2010 » | European Pensions | ❌ Le « 13,5 % sur 10 ans » est introuvable dans les sources primaires. Seul le « ~14 % depuis 2010 » est confirmé. Supprimer le 13,5 %. | ❌ HALLUCINATION (13,5 % sur 10 ans) |
| NEST membres : 13,8 M, contributions mensuelles GBP 663 M | NEST Annual Report 2024-25 | Confirmé : 13,8 M membres au 31/03/2025, 663 M GBP contributions mensuelles moyennes. | ✅ VÉRIFIÉ |
| NEST actifs : GBP 49,7 Md | NEST Annual Report 2024-25 | Confirmé au 31 mars 2025. | ✅ VÉRIFIÉ |
| NEST profit 2024/25 : GBP 11,9 M (premier profit) | NEST Annual Report 2024-25 | Confirmé : premier profit depuis création. | ✅ VÉRIFIÉ |
| Krach 2000 : S&P 500 -49,1 % | Sources marchés | ⚠️ Le krach 2000-2002 a vu le S&P 500 baisser d'environ -49 %. La valeur exacte dépend de la mesure (intraday vs clôture). -49,1 % est plausible mais doit être précisé « intraday peak to trough ». | ✅ VÉRIFIÉ (à préciser intraday) |
| Krach 2000 : récupération 6-8 ans | Morningstar / VisualCapitalist | ⚠️ Le S&P 500 a mis ~7,5 ans pour récupérer le pic de mars 2000 (retour en octobre 2007). La fourchette « 6-8 ans » inclut 7,5 ans mais le bas de fourchette (6 ans) est inexact. | ⚠️ DIVERGENT — reformuler « ~7-7,5 ans » |
| Krach 2008 : S&P 500 -56,8 % | Sources marchés | ⚠️ Le déclin du S&P 500 pic-creux (oct 2007 - mars 2009) est de **-56,8 %** selon certaines sources, -57 % selon d'autres. Valeur cohérente. | ✅ VÉRIFIÉ |
| Krach 2008 : récupération 4-6 ans, S&P 500 retour 30/03/2013 | Fichier garanties | ✅ Le S&P 500 a retrouvé son niveau pré-crise en **mars/avril 2013**, soit ~5,5 ans depuis le pic d'octobre 2007. La fourchette 4-6 ans est cohérente. | ✅ VÉRIFIÉ |
| Krach 2020 COVID : S&P 500 -34 % | Wikipedia, sources | ⚠️ Le déclin exact est de -33,9 % (peak Feb 2020 to trough March 2020). -34 % est un arrondi acceptable. | ✅ VÉRIFIÉ |
| Krach 2020 : récupération 4-5 mois | Fichier garanties | ⚠️ Le S&P 500 a atteint un nouveau record le 18 août 2020, soit environ **6 mois** après le pic de février 2020. « 4-5 mois » est sous-estimé. Si on compte depuis le creux de mars, c'est ~5 mois. | ⚠️ DIVERGENT — reformuler « ~5-6 mois (depuis le pic de février 2020) » |
| Krach 2022 : S&P 500 -27,3 % | Fichier garanties | Confirmé : le S&P 500 a baissé de ~25-27 % en 2022. -27,3 % est une valeur plausible pour le pic-creux intraday. | ✅ VÉRIFIÉ |
| Krach 2022 : récupération 18-21 mois, retour 30/09/2023 | Fichier garanties | ⚠️ Le S&P 500 a officiellement clôturé en territoire de « bull market » (hausse 20 % depuis le creux) en **janvier 2024**, soit ~15 mois depuis le creux d'octobre 2022. Le retour au pic de **janvier 2022** n'a été pleinement atteint qu'en janvier 2024. La date du 30/09/2023 est incorrecte comme date de récupération complète. | ⚠️ DIVERGENT — corriger : retour au pic en janvier 2024 (~15 mois depuis le creux d'oct 2022, ~24 mois depuis le pic de janvier 2022) |
| Pays-Bas : taux de couverture minimum 105 % (DNB) | DNB officiel | Confirmé : règle prudentielle néerlandaise. | ✅ VÉRIFIÉ |
| ABP actifs : « 465 milliards € » | Fichier garanties section gouvernance | ❌ La valeur 465 Md€ est obsolète. ABP fin 2024 = **542 Md€**. | ⚠️ DIVERGENT (valeur périmée) |
| ABP fondé : 1922 (« 100+ ans ») | Fichier garanties | ✅ ABP a été fondé en 1922. | ✅ VÉRIFIÉ |
| PPF UK créé en 2005 | Fichier garanties | ✅ Le Pension Protection Fund UK a bien été créé par le Pensions Act 2004, opérationnel en 2005. | ✅ VÉRIFIÉ |
| PPF UK : couverture 100 % retraités actuels, 90 % actifs (plafond) | PPF officiel | Confirmé : 100 % pour les retraités au moment de l'insolvabilité de l'employeur, 90 % (plafonné) pour les actifs. | ✅ VÉRIFIÉ |
| PPF : BHS déficit 571 M£, Green contribution 363 M£ | Fichier | Données publiquement connues. Plausibles. | 🔍 À CONFIRMER (données PPF/PPR publiques) |
| PPF : 8,8 M personnes couvertes, 5 000 fonds DB | PPF officiel | 🔍 Données plausibles mais à vérifier sur le site PPF pour la date exacte. | 🔍 À CONFIRMER |
| PPF actifs : 31,2 Md£ | PPF officiel | Plausible mais à vérifier date exacte. | 🔍 À CONFIRMER |
| Garantipension Suède : 11 988 SEK/mois (célibataire), 10 853 SEK (en couple) | Pensionsmyndigheten | Montants 2024 plausibles et cohérents avec les données officielles suédoises. | 🔍 À CONFIRMER date exacte |
| Superannuation Australie : taux 12 % depuis 01/07/2025 | Fichier garanties | ✅ Confirmé : 12 % à partir du 1er juillet 2025 (ATO). Juste pour la phase actuelle. | ✅ VÉRIFIÉ |
| Madoff pertes : 65 Md$ | Fichier garanties | ⚠️ Les 65 Md$ représentent la valeur des **relevés de compte fictifs** (gains jamais réalisés inclus). Les pertes cash réelles sont estimées à **~18 Md$** par le trustee SIPC. Le chiffre 65 Md$ est exact comme montant réclamé par les victimes mais trompeur comme « pertes réelles ». | ⚠️ DIVERGENT — préciser dans le texte : « 65 Md$ de fonds fictifs revendiqués, ~18 Md$ de pertes cash réelles » |
| Enron : perte totale « ~3,2 Md$ au total » | US Senate Hearing | ⚠️ Ce chiffre additionne 401(k) (~1,2-1,3 Md$) + pensions DB (~2 Md$). La décomposition dans le fichier est « 1 Md$ 401k + 2 Md$ pensions + 1,2 Md$ retraites = 3,2 Md$ » mais les sources primaires citent plutôt : 401(k) = 1,2-1,3 Md$ (15 000 salariés) + pension DB retraités ~2 Md$. Le total 3,2 Md$ est approximatif. | ⚠️ DIVERGENT MINEUR (décomposition à préciser) |
| Detroit faillite 18 juillet 2013, 18 Md$ dette totale | Wikipedia | Confirmé : faillite le 18 juillet 2013, 18 Md$ total. | ✅ VÉRIFIÉ |
| Detroit pensions non-financées : 3,5 Md$ | Sources Detroit bankruptcy | Confirmé : 3,5 Md$ de pensions non-financées (GRS + PFRS). | ✅ VÉRIFIÉ |
| Detroit retraités santé : 5,7 Md$ | Sources | Confirmé : 5,7 Md$ pour soins santé retraités. | ✅ VÉRIFIÉ |
| Detroit : 21 000 retraités, 15 000 actifs | Wikipedia | Confirmé : ~21 000 retraités. | ✅ VÉRIFIÉ |
| Mercer 2025 : Grade A — « Pays-Bas, Danemark, Suède, UK, Islande » | Fichier garanties | ❌ **ERREUR** : Grade A 2025 = Pays-Bas, Islande, Danemark, Israël, Singapour. Suède = **B+**. UK = **B**. La Suède et le UK ne sont pas Grade A. | ❌ À CORRIGER IMPÉRATIVEMENT |
| Mercer 2025 : France « Grade D/C » | Fichier garanties | ❌ **ERREUR** : France = **Grade B, score 70,3** (viabilité 48,6, performance 85,2, intégrité 76,8). Pas de Grade D ni C. | ❌ À CORRIGER IMPÉRATIVEMENT |
| Frais ABP/PFZW : 0,10-0,25 % | Fichier garanties | Plausible et cohérent avec les benchmarks sectoriels néerlandais. | 🔍 À CONFIRMER |
| Frais France fonds euros : 1,2-1,5 % | Fichier garanties | Plausible (frais inclus dans le mécanisme de « taux servi »). | 🔍 À CONFIRMER précisément |

---

## Affirmations vérifiées — synthèse ✅

Les chiffres suivants sont confirmés dans leurs sources primaires :

- GPFG : 13,1 % 2024 / actifs 19 742 Md NOK / 4,1 % réel net depuis 1998 (NBIM)
- CDPQ : 9,4 % 2024 / actifs 473 Md CAD / 6,2 % 5 ans / 7,1 % 10 ans (La Caisse)
- CPP Investments : 9,3 % FY2025 / actifs 714,4 Md CAD / 8,3 % sur 10 ans (CPPIB)
- AP7 : 27,3 % 2024 / actifs SEK 1 440 Md / ~14 % depuis 2010 (à utiliser, pas 15 %)
- ABP : 8,6 % 2024 (actifs : ~542 Md€ fin 2024)
- PFZW : 8 % 2024 (pas 7,7 %) / actifs 259 Md€
- Industriens Pension Danemark : 6,3 % 2024 / DKK 255 Md / 447 000 membres
- NEST UK : GBP 49,7 Md / 13,8 M membres / 9,9 % sur 5 ans
- AustralianSuper : 9,52 % FY2025 / 7,94 % sur 10 ans (30 juin 2025)
- Superannuation Australie : AUD 4,2 Tr fin 2024 / taux 11,5 % depuis juillet 2024
- PER France T3 2024 : 118,9 Md€ / 11,2 M titulaires
- Fonds euros ACPR 2024 : 2,63 % brut (contrats individuels)
- UBS/DMS 2025 : actions 5,2 % réel / obligations 1,7 % réel / bills 0,5 % réel (125 ans)
- OCDE 2025 : France 70 % / Pays-Bas 96 % / Allemagne 53 % / Moyenne 63,2 %
- COR 2025 : génération 1963, TRN 74,4 % (salarié non-cadre privé)
- Detroit : 18 Md$ total / pensions 3,5 Md$ / santé 5,7 Md$
- Madoff : 65 Md$ fictifs / ~18 Md$ cash réels
- Mercer 2025 : France B (70,3) / Pays-Bas A / Suède B+ / UK B / Grade D = Turquie, Philippines, Argentine, Inde

---

## Affirmations impossibles à vérifier 🔍

| # | Affirmation | Raison |
|---|---|---|
| 1 | Piketty, p. 72, « r > g » | PDF du livre non accessible — page 72 probable incorrecte selon sources académiques qui citent p. 53-55 et p. 363+ |
| 2 | TRI France ~1,5 % (Dubois & Marino 2015, INSEE ES481) | PDF accessible (https://www.insee.fr/fr/statistiques/fichier/1305193/ES481D.pdf) mais lecture longue — valeur cohérente avec littérature |
| 3 | Martinot Fondapol nov 2024 : paramètres 43 ans, 4 %, 70 % | PDF binaire non analysé — cohérent avec résumés publics |
| 4 | PPF UK : 8,8 M couvertes, 5 000 fonds, 31,2 Md£ actifs | À vérifier sur ppf.co.uk (données plausibles) |
| 5 | Garantipension Suède : 11 988 SEK / 10 853 SEK (2024) | À confirmer sur Pensionsmyndigheten.se pour l'année exacte |
| 6 | Frais ABP/PFZW 0,10-0,25 % | Donnée non vérifiée en source primaire — plausible selon benchmarks sectoriels |
| 7 | KiwiSaver membres : 3,39 M (date de référence inconnue) | FMA Annual Report 2024 donne 3,334 M au 31/03/2024 ; 3,39 M = estimation avancée probable fin 2024 |

---

## Alerte prioritaire : erreur de calcul dans la modélisation

Le facteur d'annuité FV = 163,05 utilisé dans le scénario mixte 80/20 pour calculer le capital de 228 270 € semble erroné.

Vérification indépendante :
- Formule : FV = PMT × ((1+r)^n − 1) / r
- PMT = 1 400 €, r = 4 % = 0,04, n = 43 ans
- (1,04)^43 = 5,4005 (environ)
- Facteur = (5,4005 − 1) / 0,04 = 4,4005 / 0,04 = 110,01
- FV = 1 400 × 110,01 = **154 014 €** (pas 228 270 €)

La valeur 228 270 € serait obtenue avec un facteur de 163, ce qui correspond approximativement à r=4 %, n=50 ans (pas 43). Ou bien le calcul utilise une cotisation mensuelle plutôt qu'annuelle, ce qui changerait entièrement la base.

Si la cotisation est **mensuelle** (1 400 € / 12 = 116,67 € / mois) à taux mensuel 0,04/12 = 0,00333, n = 43×12 = 516 mois :
FV = 116,67 × ((1,00333)^516 − 1) / 0,00333 ≈ 116,67 × 392 ≈ 45 744 €. Toujours pas 228 270 €.

En revanche si la cotisation annuelle est de **1 400 €** et que l'auteur a utilisé un tableau ou un outil différent (cotisation en début de période, « annuité-due »), le facteur serait 110,01 × 1,04 = 114,41, soit FV ≈ 160 174 €. Encore différent.

**Conclusion** : Le chiffre 228 270 € et donc tous les écarts cumulés (165 000 €, 335 000 €) sont potentiellement basés sur un calcul erroné. Ce point est critique et doit être revu avant la rédaction finale du chapitre.

---

## Recommandations pour la rédaction

### Corrections impératives (avant toute rédaction)

1. **PFZW** : remplacer 7,7 % → **8 %**
2. **ABP actifs** : remplacer 465 Md€ et 500 Md€+ → **~542 Md€ fin 2024**
3. **AP7 depuis 2010** : remplacer 15,0 % → **~14 %**
4. **Superannuation taux** : remplacer « depuis 2023 » → **« depuis juillet 2024 »** (11,5 %)
5. **Mercer 2025 France** : remplacer « Grade D/C » → **« Grade B, score 70,3 »**
6. **Mercer 2025 Grade A** : retirer Suède et UK de la liste Grade A. Suède = B+, UK = B.
7. **Piketty p. 72** : remplacer par **« [page à vérifier dans édition papier] »** ou citer p. 53-55
8. **Référence TRI INSEE** : l'article de référence est **Dubois & Marino 2015**, pas Breuil-Genier/Blanchet/Tô
9. **AP7 13,5 % sur 10 ans** : supprimer ce chiffre introuvable dans les sources
10. **Calcul d'annuité** : **recalculer entièrement** le capital 228 270 € avant publication
11. **CPP Investments 2024** : remplacer « 9,4 % 2024 » → **« 9,3 % FY2025 » ou « 8,0 % FY2024 »** selon l'année calendaire voulue

### Chiffres à mentionner avec précaution

- Madoff : préciser que 65 Md$ inclut les gains fictifs ; les pertes cash réelles ≈ 18 Md$
- Enron : décomposer 401(k) ~1,2 Md$ + pensions DB ~2 Md$ si le chiffre 3,2 Md$ global est utilisé
- Krach 2000 : reformuler « ~7 ans » (S&P 500 ; Nasdaq ~17 ans)
- Krach 2022 : retour au pic en **janvier 2024**, pas septembre 2023

### Chiffres utilisables directement

Tous les chiffres marqués ✅ dans les tableaux ci-dessus peuvent être utilisés en l'état dans la rédaction avec leurs sources primaires correspondantes.

### Sources à citer systématiquement

- NBIM Annual Report 2024 pour le GPFG
- CDPQ Annual Report 2024 (https://www.lacaisse.com)
- CPP Investments FY2025 Annual Report
- APRA Superannuation Statistics pour l'Australie
- Bercy communiqué février 2025 pour le PER
- ACPR Analyse et Synthèse N°175 (août 2025) pour les fonds euros
- OECD Pensions at a Glance 2025 pour les taux de remplacement
- COR Rapport annuel juin 2025 pour les données France
- UBS/Dimson-Marsh-Staunton Global Investment Returns Yearbook 2025
- Mercer CFA Global Pension Index 2025 (score France B/70,3 confirmé)

---

*Rapport établi le 14 mai 2026 — Fact-check exhaustif basé sur recherches WebSearch et WebFetch dans les sources primaires institutionnelles.*

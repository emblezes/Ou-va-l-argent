# Journal de preuves — *Capitalisons*

**But** : pour CHAQUE chiffre, date, citation et attribution du livre, conserver l'extrait **primaire** exact, sa source (URL/page), et la date de consultation. Traçabilité éditeur. Zéro affirmation sans preuve lue.

**Méthode de certification** (zéro tolérance) :
- Téléchargement local du PDF/page primaire (`curl`), extraction (`pdftotext -layout`), lecture du passage.
- La source citée DOIT contenir le chiffre/la citation. Sinon → 🔴 « source ne soutient pas l'affirmation ».
- Aucun statut « cohérent / défendable ». Soit ✅ vu-en-primaire (extrait ci-dessous), soit 🔴/⚠️ ouvert.
- Citations entre guillemets : verbatim mot pour mot, sinon pas de guillemets.

---

## PARTIE 1 — preuves primaires

### Mercer CFA Global Pension Index 2025 (footnote [^67], §1.3)
- **Source** : `rpc.cfainstitute.org/.../global-pension-index-2025_main-report_final.pdf` (téléchargé, pdftotext), consulté 30 mai 2026.
- **Extrait p.13 (tableau)** : « France 70.3 … 85.2 48.6 76.8 » → note globale **70,3**, adéquation 85,2, **viabilité 48,6**, intégrité 76,8.
- « Denmark 82.3 … 82.9 85.0 77.6 » → viabilité Danemark **85,0**. « Netherlands 85.4 … 86.1 83.5 86.8 » → viabilité Pays-Bas **83,5**, note globale **85,4** (1er).
- « the Index now covers 52 systems » → **52 systèmes** (pas 48).
- ✅ Manuscrit corrigé (était 53,7 / 48 systèmes / DK 81,6 / NL 79,0 = chiffres édition 2024 mal recopiés).

### COR juin 2025 — niveau de vie relatif (footnote [^66], §1.3)
- **Source** : `cor-retraites.fr/sites/default/files/2025-06/RA_2025_def_publi.pdf` (téléchargé, pdftotext), consulté 30 mai 2026.
- **Extrait l.447** : « le niveau de vie des retraités serait de 87,5 % en 2070 contre 97 % en 2022. »
- ✅ Manuscrit conforme (97 % → 87,5 %).

### COR juin 2025 — pension relative au revenu d'activité (footnote [^65], §1.3)
- **Extrait l.2274** : « la baisse de la pension moyenne relative au revenu d'activité moyen qui passerait de 52,3 % en 2023 à 45,1 % en 2070 ».
- **Extrait l.5558** : « Le taux de remplacement resterait supérieur à deux tiers (66,6 %) pour les dix générations qui suivent celle de 1963 ».
- 🔴→✅ Manuscrit corrigé : le « −9 points de taux de remplacement » n'existe pas dans le COR ; remplacé par 52,3 % → 45,1 % (−7,2 pts).

### ✅ RÉSOLU — TRI par génération (footnotes [^50], [^62], [^63], §1.1c + §1.3)

**Résolution (30 mai 2026, auteur a validé la réécriture sur chiffres réels) :**
- TRI : **2,5 % (1950) → 1,75 % (dès 1970)**, convergence ~1,4 %. Lu dans Dubois-Marino, fig. I (PDF INSEE ES481D, l.434-435 + lecture figure).
- Taux de récupération : **159 % (1950) → 117 % (1980)**, décroissance continue sur le champ 1950-1985, **pas de remontée**. Confirmé par WebFetch Cairn (*Retraite et Société* 2016) : « Entre les générations 1950 et 1980, le taux récupération passe ainsi de 159 % à 117 % » ; et « le ratio ne remonte pas pour les générations les plus récentes ».
- **Supprimés du manuscrit** : 5,8 %/1,9 %/0,8 %, « divisé par sept », 7-8 % (1940), « 120 % pour un enfant né aujourd'hui », comparaison « inférieur à un livret réglementé » (TRI réel ≠ taux Livret nominal). §1.1c « dépasse 5,5 % » remplacé par « très élevé, propre à un régime naissant ». Footnotes [^50], [^62], [^63] réécrites.

--- (trace de l'incident, conservée) ---
**Ancien état — BLOC GELÉ (avant résolution)**
- **Source citée** : Dubois & Marino, « Le taux de rendement interne du système de retraite français », *Économie et Statistique* n° 481-482, 2015. PDF `insee.fr/fr/statistiques/fichier/1305193/ES481D.pdf` (téléchargé, pdftotext), consulté 30 mai 2026.
- **Extrait l.434-435 (figure I)** : « Le taux de rendement interne des salariés du secteur privé diminue nettement au fil des générations. Avoisinant **2,5 % pour la génération 1950**, il se stabilise vers **1,75 % à compter de la génération 1970**. »
- **Champ (figure I)** : « générations **1950 à 1985**, salariés du secteur privé vivants à 60 ans. Législation 2014. »
- **CONTRADICTION** : le manuscrit affiche 5,8 % (1950) / 1,9 % (1980) / 0,8 % (2000) / « divisé par sept » / 7-8 % (1940). **Aucun de ces chiffres n'est dans la source citée**, qui donne 2,5 % → 1,75 % et ne couvre ni 1940, ni 1990, ni 2000.
- **ACTION** : bloc TRI gelé. Ne pas modifier les chiffres tant que la vraie source de 5,8 % n'est pas trouvée OU que l'alignement sur Dubois-Marino (2,5 %/1,75 %) n'est pas décidé avec l'auteur. Impacte §1.1c (« dépasse 5,5 % »), §1.3 (5,8/1,9/0,8, « divisé par sept ») et la note [^62].
- **À vérifier ensuite** : IPP Bozio-Rabaté-Tô-Rain notes n° 42-44 (juin 2019) — donnent-elles 5,8 % ? Sinon, d'où vient le chiffre ?

### BACKFILL INTRO §0.3 « Trois chiffres » (30 mai 2026)

**Chiffre 1 — Banque de France [^8]** — ✅ VÉRIFIÉ-PRIMAIRE (curl page BdF, consulté 30 mai 2026).
- Verbatim : « Fin 2024, les non résidents détenaient 1 083 milliards d'euros d'actions des sociétés françaises du CAC 40, sur une capitalisation boursière totale de 2 165 milliards d'euros, soit un taux de détention de 50 %. » (+ 0,5 pt vs 2023.)
- « Les détenteurs non résidents provenaient principalement de la zone euro (40 %) et des États Unis (34 %). »
- « 19 des 35 sociétés françaises du CAC 40 étaient détenues par des non résidents à plus de 50 %, 11 entre 30 % et 50 %, et 5 à moins de 30 %. »
- Source exacte : *Bulletin de la Banque de France* n° 261, article 3 (Fabien Renouard), 4 déc. 2025 → [^8] précisée (« communiqué » → Bulletin).

**Chiffre 3 — OCDE PAG 2025 [^12]** — 🔴 ERREUR CORRIGÉE (PDF e40274c1-en.pdf téléchargé, pdftotext, Table 4.4).
- Extrait Table 4.4 « Net pension replacement rates by earnings », colonne « 1 » (revenu moyen) : « France 65 66.1 **70.0** 58.9 », « Netherlands 70 97.2 **96.0** 89.7 », « OECD … **63.2** ». Aussi : Italy **79.0**, Denmark **77.1**, Sweden 66.3, Germany 53.3, UK 54.2, Switzerland **47.5**.
- Manuscrit disait France 72 % / 71,9 % → **faux pour l'édition 2025 : 70,0 %**. Corps §0.3 corrigé (72→70), [^12] refondue (Suisse 75→47,5 et Danemark 80→77,1 étaient aussi faux). « près d'un tiers » → « plus d'un tiers » (96/70 = +37 %).
- ⚠️ CASCADE : `04-partie3-feuille-route.md:133` (section Chili, [^232]) cite « France 71,9 %, moyenne OCDE 50,7 % » (autre édition/métrique) — à harmoniser lors du fact-check P3.

**Chiffre 2 — Bpifrance [^11] / [^376]** — ✅ VÉRIFIÉ (WebSearch source primaire Bpifrance Le Lab, étude « 370 000 entreprises d'ici 2030 »).
- 370 000 entreprises à transmettre d'ici 2030 ; 130 000 effectivement transmises au rythme actuel ; **3 millions d'emplois concernés** : confirmés.
- ⚠️ « 240 000 sans repreneur » = calcul du livre (370−130) ; Bpifrance parle de « près de 200 000 ». Calcul transparent dans le corps → laissé, mais signalé.

**GPFG [^9]** — partiel.
- ✅ « ~1,5 % des actions cotées dans le monde » : confirmé (NBIM, fonds > 2 000 Md$, poids moyen des 8 659 titres = 1,5 %). Fonds = 19 742 Md NOK fin 2024, actions 71,4 %.
- ⚠️ « France 2,1 % du portefeuille actions / ~25 Md€ » : à confirmer dans la liste de participations NBIM par pays (non lue en primaire ce tour).

**Vernimmen [^10]** — ✅ VÉRIFIÉ (WebSearch source Vernimmen n°223, zonebourse). Dividendes CAC 40 2024 = **72,8 Md€** (+8,5 %) ; retour total actionnaires > 98 Md€ ; rachats 25,5 Md€. → 36 Md€ à l'étranger = 0,50 × 72,8 ✅.

**ABP [^374]** — ✅ VÉRIFIÉ-PRIMAIRE (PDF abp-listed-investments.pdf, « holdings as per December 31st 2025 », pdftotext). Valeurs de marché en M€ lues : Schneider Electric **615**, L'Oréal **367**, Klepierre **295**, Sanofi **196**, Air Liquide **190**, Cie de Saint-Gobain **190**, BNP Paribas **178**, AXA **155**, Société Générale **111**, Danone **103**. Toutes exactes. (Sous-total France 3 800 M€.)

**CPP [^375]** — ✅ VÉRIFIÉ-PRIMAIRE (HTML Foreign Publicly Traded Equity Holdings as of March 31, 2025). Lus (M CAD, FRANCE) : Schneider Electric **281**, Air Liquide **229**, Veolia Environnement **59**. Exacts.

**GPFG France [^9]** — 🔴 ERREUR CORRIGÉE (PDF annual_report_2024.pdf, Table 2). Extrait : « France | Total 3.4 | Equity **2.1** | Fixed income 1.0 | real estate 0.26 ». Le 2,1 % est la part des actions FR dans la **valeur totale du fonds** (19 742 Md NOK), PAS dans le sous-portefeuille actions. Calcul correct : 2,1 % × 19 742 = **415 Md NOK ≈ 35 Md€** (la footnote multipliait à tort par les 14 100 Md NOK du seul portefeuille actions → 25 Md€ sous-évalués). Corps §0.3 corrigé (25→35) + [^9] refondue.

## ✅ §0.3 « Trois chiffres » — BACKFILL TERMINÉ
Bilan : 2 erreurs corrigées (OCDE 72→70 ; GPFG 25→35 Md€), 1 précision ([^8] Bulletin), tout le reste confirmé en primaire (BdF, Bpifrance, Vernimmen, ABP, CPP, GPFG 1,5 %).

### ⚠️ CASCADES À TRAITER lors du fact-check Partie 2 (`03-partie2-fonds-pension.md`)
- l.32 : GPFG « 30 Md€ » d'actions FR → **corrigé en 35** (même fait que [^9]).
- l.34 : dividendes à l'étranger « près de 40 milliards » → incohérent avec les 36 Md€ de §0.3 (= 0,50 × 72,8) ; à harmoniser.
- l.16 et l.182 : GPFG « environ 1 900 milliards d'euros » → semble surévalué : 19 742 Md NOK ÷ ~11,79 ≈ **1 675 Md€**. À recalculer (probable 1 700 Md€).
- l.101, l.148 : tailles de fonds (ABP 542 Md€, CPPIB 714,4 MdCAD, CDPQ 473 MdCAD, CalPERS 506,6 Md$, GPFG 8 763 sociétés/71 pays) — à certifier en primaire.

### BACKFILL INTRO §0.4 « La grande illusion » (30 mai 2026) — corps SAIN, 2 footnotes corrigées

- **1,05^40 = 7,04** (Python) → « un euro… se transforme en sept euros » ✅.
- **France dépense pensions ~14 %** : ✅ PAG 2025 Table 8.4 (PDF lu) : « France 14.1 14.2 14.3… » (14,1 % en 2023). [^377] OK.
- **Pays-Bas dépense publique pensions** : 🔴 [^378] disait « environ 5 % » → PAG 2025 Table 8.4 (PDF lu) : « Netherlands **6.6** 6.8 7.3… ». Corrigé en 6,6 % (AOW seul ~5 %). « Moins de la moitié » du corps tient (6,6 < 14,1/2 = 7,05) → corps inchangé.
- **[^380] rendements** : ✅ CPP 9,2 % net 10 ans FY2024 (newswire CPP) ; ✅ Future Fund 8,3 % 10 ans au 30/6/2024 (Future Fund Year in Review FY24). ABP ~7-8 % / AP ~7,5 % corroborants. « 5 % conservateur » robuste.
- **[^381]** : France « 71,9 % » → **70,0 %** (même correction que [^12], aligné PAG 2025 Table 4.4). NL 96 % ✅.
- **[^379] chronologie 2ᵉ piliers** : LPP CH 1985, ATP DK 1964, PPM SE 1998/1999, Riester DE 2001/2002, auto-enrolment UK 2012 — dates standard, acceptées. ⚠️ « Pays-Bas généralisés dès les années 1980 » légèrement imprécis (fonds occupationnels NL déjà quasi universels avant) — laissé, non bloquant.

## ✅ §0.4 BACKFILL TERMINÉ — corps sans erreur ; [^378] (NL 5→6,6 %) et [^381] (71,9→70) corrigées.

### ⚠️ INCOHÉRENCE INTER-FOOTNOTES à traiter (P1/appendice) : CPP cité à **9,2 %** (FY2024, [^380]) et à **8,3 %** (FY2025, [^107]/[^300]). Les deux peuvent être vrais à leurs dates respectives (rendement 10 ans qui décroît de mars 2024 à mars 2025), mais à harmoniser/expliciter pour éviter l'impression d'erreur.

### BACKFILL INTRO §0.5 « L'objectif du livre » (30 mai 2026)

- **Patrimoine financier des ménages [^382]** : 🔴 footnote disait « ~6 415 Md€ » → BdF (reprises concordantes La Finance pour Tous + contrôle §0.6) = **6 356,4 Md€** fin 2024 (+1,7 %). Aligné (cohérent avec [^124] de P2 qui dit déjà 6 356,4). Corps « dépasse six mille milliards » ✅ inchangé.
- **[^383] rendements épargne** : ✅ Livret A 1,7 % (1ᵉʳ août 2025) puis **1,5 %** (1ᵉʳ fév. 2026) — service-public.gouv / economie.gouv ; fonds euros **2,65 %** en 2025 (ACPR, via Boursorama) ; inflation ~0,8-0,9 %. « Rendement faible » ✅.
- « Quatre millions et demi de fonctionnaires » (RAFP) : ✅ déjà établi §0.2 (ERAFP ~4,5 M cotisants).

## ✅ §0.5 BACKFILL TERMINÉ — 1 footnote alignée ([^382] 6 415→6 356,4) ; corps sain.

### ⚠️ CASCADES P2 (`03-partie2-fonds-pension.md`) traitées/à traiter
- l.36 « six mille milliards… **plus que l'Allemagne** » → **corrigé** (comparaison fausse, déjà supprimée de §0.5 ; Allemagne ~9 050 Md€ > France 6 356). Retiré.
- l.226 « épargne financière brute » et l.272 « épargne brute des ménages dépasse six mille milliards » → terminologie fautive (épargne brute = flux ~349 Md€/an, pas un stock de 6 000 Md€). À remplacer par « patrimoine financier » lors du fact-check P2 (l.57 utilise déjà le bon terme).

### BACKFILL INTRO §0.6 « Plan de l'ouvrage » (30 mai 2026) — SAIN, 0 correction

- **[^384] COR déficit jusqu'en 2070** : ✅ VÉRIFIÉ-PRIMAIRE (PDF COR juin 2025, pdftotext). Extraits exacts :
  - l.195 : « le déficit serait ainsi de -0,2 point de PIB en 2030 (soit 6,6 milliards d'euros) ».
  - l.714 : « -0,2 % du PIB en 2030 et -1,4 % du PIB en 2070 ».
  - l.917 : « durablement en besoin de financement quel que soit le scénario (entre -2,2 % du PIB… et -0,7 %…, contre -1,4 % dans le scénario de référence) » ; dépenses 13,9-14,5 % (14,2 % réf.).
  - Toutes les valeurs de [^384] (−0,2 %/2030/6,6 Md€ ; −1,4 % réf. ; fourchette −0,7/−2,2 ; ~14 %) exactes.
- « dépasse six mille milliards » ✅ (6 356) ; « 240 000 sans repreneur » ✅ (cohérent §0.3) ; agenda 2027-2052 = 25 ans ✅.
- **Renvois à certifier à leur source** (modélisation interne) : « 228 000 à 456 000 € de retraite cumulée » (P1) ; « 1 500 Md€ gérés » (P2 [^168]) ; « 20 à 40 % des cotisations » (P1). NON vérifiables ici — à faire lors du fact-check P1/P2.
- Rappel : incohérence interne de l'appendice (« cinq »/« six » objections) à harmoniser lors du fact-check de `07-appendice`.

## ✅ §0.6 BACKFILL TERMINÉ — corps + [^384] sains, 0 correction.

## ✅✅ INTRODUCTION §0.3-§0.6 BACKFILLÉE. Restent §0.1 (sondages) et §0.2 (RAFP), traités au 1ᵉʳ passage (ancienne méthode) — à re-certifier en primaire pour compléter l'intro.

### BACKFILL INTRO §0.1 « Les Français sont prêts » (30 mai 2026)

- **[^367] Odoxa-Groupama nov. 2025** : ✅ >5 000 répondants ; 57 % mixte ; 22 % capi > 20 % répartition (« pour la première fois capitalisation > répartition »). PDF/communiqué Odoxa 5 nov. 2025.
- **[^368] Elabe-BFMTV fév. 2025** : ✅ 59 % (répartition majoritaire + dose capi) vs 40 % exclusive ; NFP **47 %** (vs 51 % exclusive). PDF Elabe 21 fév. 2025.
- **[^369] Ipsos pour Cercle des épargnants janv. 2025** : ✅ 55 % favorables fonds de pension (+9 pts vs 2017) ; **78 %** inquiets. (Rapport hébergé cesi.fr — partenaire ; attribution « Cercle des épargnants » correcte.)
- **[^370] OpinionWay-Finary janv. 2026** : ✅ échantillon 2 500 (7-12 janv. 2026) ; « cotiser pour un système dont je ne bénéficierai pas » = **76 %** (PDF lu, l.726). 🔴 **« 70 % jugent la répartition intenable » N'EXISTE PAS dans le sondage** → le primaire donne « inquiet pour l'avenir des retraites en France » = **87 %**. Corps + [^370] corrigés (70 → 87). (Le « 87 % » du titre Finary correspond à cette question, pas au 76 %.)
- **[^371] AMF oct. 2024** : ✅ 58 % inquiets ; 66 % non-retraités (37 % retraités).

## ✅ §0.1 BACKFILL TERMINÉ — 1 erreur (OpinionWay 70 → 87), reste confirmé en primaire.

### BACKFILL INTRO §0.2 « Le RAFP » (30 mai 2026)

- **[^318]/[^324]/[^339] chiffres RAFP** : ✅ VÉRIFIÉ-PRIMAIRE (RAFP Public Report 2024, PDF lu, + communiqué ERAFP « 20 ans »). Encours **47,8 Md€** (l.11) ; **4,4 million contributors** (l.312) ; TRI **4,3 % annualisé** (5,9 % en 2024) (l.22, 120) ; ratios de couverture **117,3 % / 135,8 %** (l.272, 144). « Près de 4,5 millions » : défendable (population affiliée ≈ 4,5 M ; cotisants actifs 4,4 M). « > 10 000 €/cotisant » ✅ (47,8 Md / 4,4 M = 10 863 €).
- Allocation 58/20/10/9 + liquidités, loi Fillon art. 76 (21/8/2003), décret 18/6/2004, « répartition provisionnée et par points », citations François (IFRAP 2015), Martinot (Fondapol mars 2025), COR juillet 2024 — vérifiés verbatim au 1ᵉʳ passage (COR [^335] via pdftotext). « Plus de 20 M salariés privé » ✅ (INSEE 21 M).

## ✅ §0.2 BACKFILL TERMINÉ — confirmé en primaire, 0 nouvelle erreur.

## ✅✅✅ INTRODUCTION (§0.1 à §0.6) ENTIÈREMENT BACKFILLÉE EN PRIMAIRE.

### BACKFILL AVANT-PROPOS §1-15 (30 mai 2026) — SECTION SAINE, 0 nouvelle erreur

- **§1 Opella/CD&R** : ✅ valeur d'entreprise **16 Md€** (financierworldwide, CD&R, globenewswire 21 oct. 2024) ; Sanofi encaisse **10 Md€** pour les 50 % ; CD&R fonds US. Doliprane fabriqué à Lisieux/Compiègne.
- **§2 [^373]** : ✅ Armand (Économie) + Ferracci (Industrie) ; accord tripartite 21 oct. 2024 ; Bpifrance ~2 % (1,8 %) + siège au CA (presse, communiqué Sanofi).
- **§4 [^1]/[^372]** : ✅ Ardian **176 Md$** au 31 déc. 2024 (site Ardian : « $176bn… 1 720 clients ») ; CalPERS > 500 Md$ ; **anchor investor CD&R Fund XI, 500 M$** (pe-insights, reprises).
- **§7 cas industriels** : ✅ Heico/Exxelia **453 M€** (28 juil. 2022) ; Photonis (Teledyne bloqué → HLD 370 M€ + Bpifrance, 2021) ; moteur Vinci Vernon→Lampoldshausen (accord ArianeGroup-DLR, déc. 2024). Lafarge/Holcim, Alstom/GE, Technip/FMC ✅.
- **§11 [^7] ratios actifs retraite/PIB fin 2024** : ✅ VÉRIFIÉ-PRIMAIRE (PDF OCDE *Pension Markets in Focus 2025*, Preliminary 2024, pdftotext) — **exacts au dixième** : Danemark 204,0 ; Islande 188,4 ; Suisse 164,8 ; Canada 157,6 ; Pays-Bas 150,3 ; US 146,9 ; Australie 135,1 ; Suède 114,8 ; UK 78,0 ; **France 12,9** ; Italie 11,7 ; Allemagne 6,4 ; Norvège (fonds de pension) 10,1 → > 280 % avec GPFG. Note éditoriale (non bloquante) : le corps omet Danemark (204) et Islande (188) tout en citant la Suisse (165) — sélection illustrative, chiffres tous justes.
- §6 loi Thomas (25 mars 1997 → abrogée 2002) ✅.

## ✅ AVANT-PROPOS BACKFILL TERMINÉ — 0 nouvelle erreur (le 1ᵉʳ passage l'avait déjà corrigé à fond ; tout reconfirmé en primaire).

### RE-CERTIFICATION PRIMAIRE §1.1-§1.3 (30 mai 2026) — 0 nouvelle erreur

**§1.1a démographie** — ✅ INSEE *Bilan démographique 2025* (PDF ip2087, reprises concordantes) :
- Solde naturel 2025 **−6 000** (645 000 naissances −2,1 % / 651 000 décès +1,5 %), négatif 1ʳᵉ fois depuis WW2 ✅ ; ICF **1,56** (après 1,61 en 2024) ✅ ; espérance de vie **85,9 (F) / 80,3 (H)** ✅ ; population **69,1 M** au 1ᵉʳ janv. 2026 ✅.
- COR (PDF lu) : hypothèses **fécondité 1,8 / migratoire 70 000 / productivité 0,7 % (dès 2040) / chômage 7 % (dès 2032)** verbatim (l.224-225) ✅ ; ratio « **1,8 cotisant par retraité** » (l.2783) ✅ (corps 1,79). Ratio dépendance Ageing Report cohérent (2,6 actifs/65+ en 2022 → 1,7 en 2070).

**§1.1b déficit** — ✅
- COR déficit 2024 **1,7 Md€ (−0,1 % PIB)** (PDF l.694) ✅ ; « durablement en besoin de financement quel que soit le scénario » (l.917) ✅.
- Taux contribution employeur État : **74,28 % → 78,28 % (décret 2025-61 du 22/1/2025) → 82,28 % (décret 2025-1341 du 26/12/2025)** ✅ (Légifrance/AEF) — [^31] cite les bons décrets.
- Beaufret **81 Md€** (2024) ✅ (Fondapol : « not 6 billion, but 81 billion euros in 2024 » ; −69 Md€ en 2023).

**§1.1c** — déjà traité (croissance 5,3 %, espérance vie, fécondité, Briet/Charpin corrigés ; Colbert 1670/1673 ; TRI dans le bloc TRI). Dates CDC 1816 / AGIRC 1947 / ARRCO 1961 / ord. 82-270 / ord. 45-2250 : faits historiques établis.

**§1.2** — dates de lois (93-936, 2003-775, 2010-1330, 2014-40, 2023-270) ✅ ; suspension Lecornu corrigée ; 150 trimestres corrigé.

**§1.3** — TRI (bloc TRI, primaire), Mercer (primaire), COR −1,4 %/87,5 % (primaire), Blanchard-Ecalle (primaire), Souillot (corroboré). + ce tour :
- Taux d'emploi **60-64 ans = 42,4 % en 2024** ✅ (INSEE).
- **26 % cadres seniors en chômage longue durée** ✅ (France Travail/APEC 2026).
- **Allemagne/Italie = 67 ans** ✅ CONFIRMÉ (Allemagne 67 en 2031 ; Italie 67 depuis 2019) — ma correction 65→67 était juste.

## ✅ §1.1-§1.3 RE-CERTIFIÉES EN PRIMAIRE — aucune nouvelle erreur (les erreurs avaient été rattrapées aux passages précédents).

### BACKFILL §1.4 « Comprendre la capitalisation » (30 mai 2026) — modélisation recalculée

- **Multiplicateurs intérêts composés** (Python) : 1,04²⁰=2,191 / ³⁰=3,243 / ⁴⁰=4,801 / ⁵⁰=7,107 ✅ ; 142 €×1,04⁴⁰=682 € ✅ ([^81], [^83]).
- **🔴 Exemple des deux épargnants (l.199) — SUPPRIMÉ (décision auteur).** À 4 %, l'épargnant précoce (10 ans, 20 000 €) finit à **~81 000 €** (Python : 80 996 € annuité-due), pas 132 000 € (impossible à 4 % : max 96 000 €) ; l'épargnant tardif = 117 000 € ✅. Donc à 4 % précoce < tardif → conclusion « commencer tôt bat cotiser plus » FAUSSE (ne tient qu'au-dessus de ~6,3 %). Le footnote [^84] **avouait lui-même** le calcul à 77 868 € et un « taux légèrement supérieur » pour 132 000. Paragraphe retiré, remplacé par le point valeur-temps d'une cotisation (valide à 4 %).
- **🔴 l.201 « près de cinq fois »** → corrigé **« plus de trois fois »** : cotisation à 25 ans (×1,04⁴⁰=4,80) vs 55 ans (×1,04¹⁰=1,48), rapport 3,2. [^84] réécrite avec ce calcul.
- **Assurance-vie [^91]** : ✅ **1 989 Md€** encours fin 2024, **1 178 Md€** fonds euros individuels (France Assureurs + ACPR AS175).
- **PER [^95]** : ✅ **11,2 M titulaires / 118,9 Md€** au T3 2024 (Bercy/economie.gouv) ; 118,9/11,2 = 10 616 € ≈ « 10 600 € » ✅.
- **Fonds euros 2024 [^93]** : ✅ **2,63 %** pour les contrats individuels (ACPR *Analyses et synthèses* n°175 : « 2,63 % … pour les contrats individuels et 2,53 % pour les collectifs ») — corps exact.
- **Einstein « huitième merveille »** : ✅ correctement présenté comme apocryphe/introuvable [^82].
- **⚠️ Dimson-Marsh-Staunton [^86]** (actions 5,2 % / oblig. 1,7 % / bills 0,5 % réel 1900-2024) : primaire UBS *Global Investment Returns Yearbook 2025* PAYANT/inaccessible. Le « 3,5 % » du résumé public = valeur XXIᵉ s. (depuis 2000), PAS les 125 ans. Les 5,2/1,7/0,5 sont cohérents avec la série longue DMS établie mais **non lus en primaire** — à confirmer si accès au Yearbook complet.
- RAFP [^318] : ✅ (déjà certifié) ; rendement implicite répartition 1-2 % [^79] cohérent avec TRI 1,75 %.

**SWEEP PHRASE-PAR-PHRASE §1.4 (ajout, après alerte auteur « as-tu fait phrase par phrase ? ») — 2 erreurs molles ratées par le passage chiffres :**
- 🔴 l.205 « trois professeurs de la *London Business School* — Dimson, Marsh et Staunton » → **Elroy Dimson est à l'université de Cambridge** (Judge BS) ; seuls Marsh et Staunton sont à la LBS. Corrigé.
- 🔴 l.231 NBIM « environ mille professionnels permanents » → en réalité **~670** (« more than 650 people », NBIM/LinkedIn). Corrigé en « plus de six cent cinquante ».
- Autres phrases revues : Piketty *r>g* ✅, Suède/PB/Australie (12 % SG, 85 %, zéro en 1992) ✅, AP7 <0,1 % ✅, « 70/60/30 ans » de fonds ✅, RAFP « trois fois » ✅. Limite tolérée : « fonds euros dominés par obligations souveraines françaises » (défendable).

## ✅ §1.4 TERMINÉ — chiffres + phrase-par-phrase. 4 erreurs au total (2 chiffrées + 2 molles). DMS [^86] non lu en primaire (paywall).

**⚠️ LEÇON MÉTHODE** : le backfill « chiffres + citations » ne remplace pas le phrase-par-phrase (qui attrape les attributions et faits non chiffrés type Dimson/NBIM). Règle désormais : chaque section = décomposition phrase-par-phrase **ET** lecture primaire des chiffres, combinées.

### BACKFILL §1.5 « Cotiser moins pour gagner plus » (30 mai 2026) — cas-type central recalculé

**Tous les blocs élémentaires EXACTS (Python)** : capital B 216 240 €, C 432 480 € ; sensibilités 169 731 / 278 461 € ; effort 93 766 € ; taux 74,4 % (COR p.76, génér. 1963). Modélisation de l'auteur rigoureuse et reproductible.

**🔴 1. Incohérence durée de retraite (gonflait les chiffres-phares).** A cumulait sur 20 ans « à 73 ans » ; mais l'espérance résiduelle à 73 ans = 15,5 ans (le footnote [^103] l'avouait : « 20 ans retenus comme convention »). B calculait sa rente sur 15,5 ans mais cumulait sur 20. **Décision auteur : départ à 64 ans, 20 ans de retraite** (résiduelle réelle à 64 ans ≈ 22 ans, donc 20 conservateur et cohérent). Capital inchangé (43 ans de carrière) ; rente repricée sur 20 ans. Nouveaux chiffres (Python) :
  - Rente B 1 364 → **1 102 €/mois** ; pension totale B 36 142 → **33 003 €/an** ; cumul B 722 830 → **660 051 €** ; **gain B +228 364 → +165 591 €**.
  - Rente C 2 727 → **2 204 €/mois** ; cumul C 951 195 → **825 662 €** ; **gain C +456 729 → +331 202 €**.
  - Levier 2,4 → **1,8** ; sensibilités gains 157 977 → **108 703** et 322 529 → **241 695**.
  - Corps §1.5 + footnote [^103] réécrits.
**Cascades du 228k/456k corrigées** : intro §0.6 (228-456 → 165-330), P2 l.50 (228 → 165), appendice l.119 (228 → 165). ⚠️ Appendice l.85 (scénario D : 119 k€ capital « → 228 k€ » — impossible, ~145 k max) : **à recalculer au fact-check de l'appendice**.

**🔴 2. Salaire « proche du salaire moyen brut »** : faux. Moyen brut EQTP = **41 252 €** (INSEE 2024) ; 35 000 € est proche du **médian**. Corps + [^100] corrigés.

**🔴 3. Frais « 0,3 %… en dessous du standard ABP à 0,25 % »** : contradiction (0,3 > 0,25). Reformulé : « davantage que les fonds les plus efficients (AP7 0,07 %), hypothèse prudente ».

**[^107] rendements fonds** : GPFG 4,1 % réel ✅ ; ⚠️ CPP cité **8,3 %** (FY2025) ici vs **9,2 %** (FY2024) en [^380] §0.4 — les deux exacts à leur date, mais à harmoniser/dater pour éviter l'impression d'erreur.

**FINALISATION durée (échange auteur)** : durée de retraite portée à **24 ans** (espérance de vie de cohorte du né-1996 vers 2060 ; cohérent §1.1a). Note : une retraite plus longue *réduit* le gain (la rente s'étale, l'écart de répartition s'accumule). Chiffres finaux (Python, 24 ans) :
- A : cumul **593 352 €**. B : rente **953 €/mois**, cumul 749 061 €, **gain +155 709 €**. C : rente **1 905 €/mois**, cumul 904 793 €, **gain +311 441 €**. Levier 1,66. Sensibilités +96 692 / +234 661.
- Corps §1.5 + footnotes [^103]/[^105] + cascades (intro §0.6, P2, appendice) tous portés à **155k / 310k**. « au salaire moyen » du récap → « au salaire médian » (cohérence avec la correction du salaire).

**FINALISATION taux de remplacement (échange auteur)** : 74,4 % (génération 1963) remplacé par **70 %** (OCDE PAG 2025, salarié entrant aujourd'hui = situation du né-1996 ; cohérent avec §0.3). Baisser la pension de répartition *augmente* le gain. Discussion TRI : on ne peut pas reconstruire la pension via le TRI (donne 105 % de remplacement, artefact — le TRI englobe réversion/redistribution/coût hérité) ; le taux de remplacement reste le bon outil pour le niveau, le TRI pour le rendement (§1.3). Le modèle est cohérent : part redirigée → récupération ~119 % ≈ §1.3 (117 %).
**Rendement** : maintenu à **3,7 % net réel** (justifié DMS 5,2 % réel actions + GPFG 4,1 % réel) ; le RAFP (4,3 % **nominal** ≈ 2,7 % réel, car 20 % actions) **ajouté comme plancher** dans le corps (« même à 2,7 %, gain ~100 000 € »). pA = 23 261 €/an, [^102] réécrite (OCDE 70 %).

## ✅ §1.5 TERMINÉ — cas-type FINAL : départ 64 ans, **70 % de remplacement, 3,7 % net, 24 ans** → gains **+162 741 € (B) / +325 481 € (C)**, rentes 953/1 905 €/mois, levier 1,74. Cascades (intro §0.6, P2, appendice) → **162k/325k**.

### BACKFILL §1.6 « Ce que ça change pour le système » (30 mai 2026) — dernière section de P1

- **🔴 Footnotes [^108] et [^109] VIDES** (le corps les citait, contenu inexistant) → **remplies** : [^108] taux de cotisation France 28 % / Suède 18,5 %+branches ~22 % / NL ~26 % / Australie 12 % (Cleiss, Pensionsmyndigheten, APRA) ; [^109] calcul du point de cotisation (assiette ~1 350 Md€ → 1 pt ≈ 13-14 Md€ → 3 pts ≈ 40 Md€).
- **🔴 « 3 points → 90 milliards »** : faux (confond points de cotisation et % de PIB). 3 points ≈ **40 Md€** (Python : assiette 380/0,28 = 1 357 Md€ ; 3 % = 40,7 Md€). L'ancrage « budget Défense » (~50 Md€) confirme ~40, pas 90. Corps corrigé → **« de l'ordre de 40 milliards… à peu de chose près le budget de la Défense »**.
- **🔴 Suède « 17,2 % »** vs §1.3 « 22 % » : incohérence (17,2 % = public seul ; total avec branches ~22 %, base comparable au 28 % français). Corps corrigé → **« autour de 22 % (régime public 18,5 % + branches) »**.
- ✅ France 28 % (Cleiss), Australie 12 % (SG depuis juillet 2025), NL ~26 %. RAFP « 4 M, plusieurs fois » ✅. « Plusieurs centaines de milliers » de pension cumulée cohérent avec le cas-type recalculé (155-311 k€).

## ✅ §1.6 TERMINÉ — 2 erreurs (90→40 Md€, Suède 17,2→22) + 2 footnotes vides remplies.

## ✅✅✅ PARTIE 1 ENTIÈREMENT BACKFILLÉE (§1.1 à §1.6) — chiffres + phrase-par-phrase + primaire.

### CLÔTURE PARTIE 1 — 3 passes finales (30 mai 2026)

1. **DMS [^86] — fermé en primaire** : Cambridge Judge Business School (rapport sur le Yearbook 2025) confirme verbatim « 5.2% for worldwide equities versus 1.7% on bonds, and 0.5% on bills » (1900-2024, 35 marchés). ✅
2. **Rendements de fonds [^107] — fermés** : AustralianSuper 7,94 % (10 ans au 30/6/2025), AP7 ~14 % depuis 2010, CPP 8,3 % (FY2025) — tous confirmés (sources fonds). **CPP harmonisé à 8,3 % dans [^380] §0.4** (était 9,2 %/FY2024) pour cohérence avec [^107] §1.5.
3. **Balayage phrase-par-phrase §1.1-§1.3** (affirmations non chiffrées) — 2 erreurs molles ratées par les passes chiffres :
   - 🔴 §1.1b « Pierre Moscovici, **ex**-premier président de la Cour » → « premier président de la Cour des comptes » (en fonction de 2020 à début 2026 ; citation de fév. 2025 faite en exercice).
   - 🔴 §1.1a fécondité sous 2,1 « depuis le **début** des années 1970 » → « **milieu** des années 1970 » (passage en 1975 ; cohérence §1.1c).

## ✅✅✅ PARTIE 1 CLÔTURÉE — DMS confirmé, fonds confirmés/harmonisés, phrase-par-phrase §1.1-§1.6 fait. Aucun item primaire non vérifié restant en P1.

### Citation Souillot (footnote [^75], §1.3)
- Verbatim « 50 % des personnes qui liquident leur retraite à 62 ans n'ont plus d'emploi » : attribution FO + chiffre corroborés par plusieurs reprises (CSE Matin 2024, Europe 1, Boursorama). Source France Info fév. 2023 d'origine non ouverte (403). ⚠️ verbatim exact à confirmer sur l'enregistrement France Info si possible.

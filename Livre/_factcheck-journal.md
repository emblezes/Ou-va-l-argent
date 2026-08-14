# Journal de fact-check — *Capitalisons V4* (3 parties)

**Période ouverte** : 29 mai 2026
**Source de vérité** : `Livre/manuscrit-v4/*.md`
**Méthode** : fact-check phrase par phrase, paragraphe par paragraphe, mode conversationnel itératif.
**Verdicts** : ✅ exact · ⚠️ imprécis (à reformuler) · 🔴 faux ou non vérifiable (à corriger ou supprimer)
**Règle absolue** : aucun chiffre repris de la pres IAP janvier 2025. Toutes les vérifications passent par les sources primaires les plus récentes (RAFP 2024, COR juin 2025, OCDE PAG 2025, INSEE/DREES 2025, FMI Article IV mai 2025, etc.).
**Sources blacklistées** : OFCE Sterdyniak, Économistes Atterrés, Médiapart, Alternatives Économiques, L'Humanité, Politis.

---

## État global

| Fichier V4 | §traités | ✅ | ⚠️ | 🔴 | Statut |
|------------|---------|---|---|---|--------|
| 00-avant-propos.md | 15 (complet) | — | — | — | ✅ TERMINÉ + RE-CERTIFIÉ PRIMAIRE (backfill 30/5) |
| 01-introduction.md | §0.1 à §0.6 (complet) | — | — | — | ✅ TERMINÉ + RE-CERTIFIÉ PRIMAIRE (backfill 30/5) |
| 02-partie1-capi-repond.md | §1.1 à §1.6 (complet) | — | — | — | ✅✅ BACKFILL COMPLET (primaire + phrase-par-phrase + cas-type recalculé) |
| 03-partie2-fonds-pension.md | 0 | 0 | 0 | 0 | **PROCHAINE ÉTAPE** (cascades déjà notées) |
| 04-partie3-feuille-route.md | 0 | 0 | 0 | 0 | Non démarré (cascade Chili 71,9 % notée) |
| 05-conclusion.md | 0 | 0 | 0 | 0 | Non démarré |
| 07-appendice-cinq-mensonges.md | 0 | 0 | 0 | 0 | Non démarré (cascade scénario D 119k→228k notée) |

**Méthode en vigueur depuis le 30 mai 2026 (zéro tolérance)** : chaque chiffre/date/citation lu en **source primaire locale** (`curl` + `pdftotext`) ou recalculé en Python ; **phrase-par-phrase** systématique (pas seulement les chiffres) ; concordance source↔texte obligatoire ; journal de preuves `_factcheck-preuves.md`. Agent `capitalisons-fact-checker` révisé (Bash, opus, anti-« cohérent »). Détail des sessions en bas du fichier.

---

## Corrections déjà solides héritées de v3 (à reprendre en V4)

À transcrire depuis `_factcheck-v3-journal.md` (passes 1-3 Ch.1 / Ch.2 / Ch.3) lors du premier fact-check de chaque section V4 correspondante.

---

## Sessions

### 2026-05-29 — Préparation V4

- Conversion DOCX V2 → Markdown via Pandoc (avec et sans track-changes) effectuée.
- Découpage V2 (5 parties) → V4 (3 parties) effectué via `_import-v2/decoupe.py`.
- Mapping intégral documenté dans `manuscrit-v4/_MAPPING.md`.
- Matière RAFP collectée : `manuscrit/recherche/ch1-rafp-matiere.md` (~4 200 mots, 51 sources).
- Aucun paragraphe encore fact-checké.

**Prochaine session** : démarrer le fact-check de `02-partie1-capi-repond.md`, paragraphe par paragraphe.

### 2026-05-29 (soir) — Avant-propos §1 « Le paradoxe Doliprane »

**Paragraphe traité** : ouverture sur Sanofi/Opella/CD&R (octobre 2024).

| # | Affirmation | Verdict | Correction appliquée |
|---|-------------|---------|----------------------|
| 1 | Date octobre 2024 | ✅ | — |
| 2 | « majorité des parts » d'Opella | ⚠️ | → « contrôle » (CD&R 50 %, Sanofi 48,2 %, Bpifrance 1,8 %) |
| 3 | Opella = filiale santé grand public | ✅ | — |
| 4 | Opella fabrique le Doliprane | ✅ | — |
| 5 | « médicament préféré des Français » | ⚠️ | → « le médicament le plus consommé en France » |
| 6 | CD&R = fonds américain à New York | ✅ | — |
| 7 | **« 8 milliards d'euros »** | 🔴 | → « valorisation environ 16 Md€ ; Sanofi encaisse une dizaine pour les 50 % cédés » |
| 8 | « passé aux mains des Américains » | ⚠️ | → « passé sous contrôle américain » |
| 9 | « CD&R s'appuie sur une mécanique différente » | ⚠️ | → reformulation complète : CD&R = PE, lève auprès de LP, dont CalPERS *anchor investor* du fonds XI à 500 M$ |

**Résultat §1** : 5 corrections appliquées (1 🔴 + 4 ⚠️). Ajout footnote [^372] (CalPERS source CD&R Fund XI). Style préservé, longueur de paragraphe quasi identique.

### Avant-propos §2 « L'émotion est immédiate »
- ⚠️ « une pétition » → « des pétitions »
- ⚠️ « Les ministres convoquent » → « Antoine Armand et Marc Ferracci négocient en urgence avec Sanofi et CD&R un accord tripartite »
- ⚠️ « affaire publique numéro 1 » → « domine l'actualité économique »
- ➕ Ajout de l'accord tripartite du 21 oct. + entrée Bpifrance à 1,8 % au capital + footnote [^373] (communiqué Bercy)

### Avant-propos §3 « L'épisode est emblématique »
- ⚠️ « pavillon étranger » → « contrôle d'un fonds étranger »
- ⚠️ « conditionné » → « fabriqué » (Lisieux + Compiègne sont des sites de production)
- 🔴 « 8 milliards d'euros » → « dix milliards d'euros » (cohérence avec §1 corrigé)

### Avant-propos §4 « Personne. Aucun investisseur français… »
- ⚠️ Ardian « environ 170 Md$ » → « environ 176 Md$ » (Ardian janvier 2025)
- ⚠️ CalPERS « environ 500 Md$ » → « plus de 500 Md$ » (502,9 Md$ au 30/6/2024)
- ⚠️ « retraites des enseignants et des fonctionnaires californiens » → « retraites des fonctionnaires californiens » (CalPERS ne couvre pas les enseignants K-12, qui dépendent de CalSTRS)

**Bilan avant-propos §1-4** : 4 paragraphes traités, 14 corrections appliquées (2 🔴 + 12 ⚠️), 2 footnotes ajoutées ([^372] CalPERS, [^373] Bercy accord tripartite). Aucun changement de style.

### Avant-propos §5 « C'est ici que se joue le paradoxe français »
- Phrase de transition, 0 affirmation factuelle, ✅ validé sans modification.

### Avant-propos §6 « D'un côté, nous détestons les fonds de pension »
- Loi Thomas (25 mars 1997, abrogée 17 janvier 2002) : ✅ tout exact.
- Positionnements syndicaux/gauche/économistes : ✅ descriptions correctes.
- 0 correction, validé tel quel.

### Avant-propos §7 « Dans le même temps, nous détestons que des fonds de pension étrangers… »
- 🔴 **Incohérence majeure** : « fonds de pension étrangers » → « capitaux étrangers » (Heico/Teledyne/Holcim/GE/FMC/CD&R ne sont pas des fonds de pension)
- ⚠️ Photonis : « rachat patrimonial » → « repris par un consortium français adossé à Bpifrance » (factuellement HLD Europe + Bpifrance, 2021)
- ⚠️ Lafarge/Holcim : « passe à » → « fusionne avec » (fusion 2015, pas rachat sec)
- ⚠️ Technip/FMC : « à » → « s'unit à » (TechnipFMC 2017)
- ✅ Heico/Exxelia 453 M€ (juillet 2022)
- ✅ Moteur Vinci Vernon→Lampoldshausen (annonce ArianeGroup-DLR 24 octobre 2025)

### Avant-propos §8 « Nous voulons donc deux choses incompatibles »
- ⚠️ « permet de garder le capital national sous contrôle national » → « fait précisément contrepoids aux capitaux étrangers » (les fonds de pension nationaux investissent majoritairement à l'étranger ; ce qui compte c'est le solde / la réciprocité)
- 0 🔴, 1 ⚠️

### Footnotes [^1] à [^7] — vérification associée
- [^1] Ardian : « plus de 170 Md$ » → **176 Md$** + ABP 552 Md€ → **533 Md€** (30 sept. 2024)
- [^2] CGT marchandisation : ✅ inchangée
- [^3] Loi Thomas : précisé « loi n° 2002-73 du 17 janvier 2002, article 11 »
- [^4] Heico/Exxelia : ✅ inchangée
- [^5] Photonis/HLD : ✅ inchangée (le contenu de la footnote était déjà précis sur HLD + Bpifrance)
- [^6] Moteur Vinci : clarifié « Premières évocations en 2021 ; confirmation officielle ArianeGroup-DLR le 24 octobre 2025 »
- [^7] OCDE Pension Markets in Focus 2025 : ✅ inchangée (valide tous les chiffres pays par pays du §11)

### Avant-propos §9 « Ma volonté de sortir de ce paradoxe »
- Phrase manifeste de l'auteur, 0 affirmation factuelle, validée tel quel.

### Avant-propos §10 « * »
- Séparateur typographique, rien à corriger.

### Avant-propos §11 « Il existe, dans le monde occidental, deux grandes familles de pays »
- ⚠️ « La France est, presque seule parmi les pays comparables » → « La France appartient, avec l'Italie et l'Allemagne, à la deuxième catégorie — un trio singulier parmi les grandes économies développées » (l'Italie 11,7 % et l'Allemagne 6,4 % sont aussi dans la deuxième catégorie selon OCDE 2024)
- ➕ Ajout en queue : « à peu près au même niveau que l'Italie (12 %) et l'Allemagne (6 %) » — renforce le point
- ✅ Tous les chiffres pays validés par la footnote [^7] (OCDE Pension Markets in Focus 2025, données fin 2024) : Norvège 281 % avec GPFG, Suisse 164,8 %, Canada 157,6 %, Pays-Bas 150,3 %, États-Unis 146,9 %, Australie 135,1 %, Suède 114,8 %, RU 78,0 %, France 12,9 %, Italie 11,7 %, Allemagne 6,4 %

---

## 🟢 Bilan avant-propos §1-11 (au 29 mai 2026 soir)

**Paragraphes traités** : 11 sur 15 de l'avant-propos.

**Corrections cumulées** : 22 corrections sur le corps (2 🔴 majeures + 20 ⚠️ mineures). 5 footnotes mises à jour ([^1] Ardian/ABP, [^3] loi Thomas, [^6] moteur Vinci) ou ajoutées ([^372] CalPERS, [^373] Bercy).

**Restant avant-propos** : §12 (graphique), §13 (conclusion §11), §14 (« Pendant trente ans… »), §15 (phrase finale).

**Prochaine session** : terminer l'avant-propos (§12-15) puis attaquer l'introduction §0.1 « Les Français sont prêts ».

### Avant-propos §12-15 — clôture (29 mai 2026)
- **§12** (légende graphique) : ✅ données déjà validées au §11. 0 correction. Réserve éditoriale : placeholder « Graphique sur… » à transformer en vraie légende + source.
- **§13** (« Cet écart d'échelle… ») : ✅ raisonnement causal sans chiffre. 0 correction.
- **§14** (« Pendant trente ans… ») : ⚠️ « trente ans » = approximation rhétorique tolérable (loi Thomas 1997 → 2025). « esprit de 1945 » ✅ (ordonnances Sécu oct. 1945). 0 correction obligatoire ; option stylistique « un quart de siècle » proposée.
- **§15** (« Que la France se dote… ») : ✅ phrase manifeste, 0 affirmation factuelle.

## ✅ AVANT-PROPOS TERMINÉ (§1-15)
**Total** : 15 § traités, 22 corrections (2 🔴 + 20 ⚠️), 5 footnotes maj, 2 ajoutées ([^372] CalPERS, [^373] Bercy).

---

## INTRODUCTION

### §0.1 « Les Français sont prêts » — 5 sondages (29 mai 2026)
Agent capitalisons-fact-checker lancé, vérification source primaire des 5 sondages. **13 ✅ / 3 ⚠️ / 1 🔴.**

| Sondage | Verdict | Action |
|---|---|---|
| Odoxa-Groupama nov. 2025 (5 000+, 57/22/20, inversion capi>répartition) | ✅ | — |
| Elabe-BFMTV fév. 2025 (59/40, 47 % NFP) | ✅ | footnote [^368] enrichie (éch. 1 001, 20 fév. 2025) |
| Ipsos/Cercle des épargnants (55 %, +9 pts vs 2017, éch. 1 000) | ✅ | — |
| Ipsos/Cercle — « 77 % inquiets » | 🔴 | **corrigé → 78 %** (corps + footnote [^369]) |
| « Ipsos-CESI » (corps) | ⚠️ | corrigé → « Ipsos pour le Cercle des épargnants » (CESI = école d'ingénieurs, opaque) |
| OpinionWay-Finary janv. 2026 (2 500, 76/70) | ✅ | — |
| AMF oct. 2024 (58/66) | ✅ | PDF non extractible auto, confirmé par reprises croisées |

**Corrections appliquées (4)** : corps 77→78 % + « Ipsos pour le Cercle des épargnants » ; footnote [^369] 77→78 % + collecte 3-7 janv. 2025 ; footnote [^368] ajout échantillon 1 001 / 20 fév. 2025.

### Avant-propos §14 — contrôle a posteriori (29 mai 2026)
Agent lancé pour combler le trou (traité à vue au tour précédent). Ordonnances Sécu « 4 et 19 octobre 1945 » ✅ ; loi Thomas 25 mars 1997 (n° 97-277) → abrogée loi 2002-73 ✅ ; récit des opposants = description fidèle ✅ ; « trente ans » = approximation défendable. **0 correction.**

### §0.2 « La capitalisation existe déjà chez nous : le RAFP » (29 mai 2026)
Agent capitalisons-fact-checker lancé, vérification source primaire (rapport ERAFP 2024, fiche COR juillet 2024, Légifrance, Fondapol, IFRAP). **10 ✅ / 8 ⚠️ / 1 🔴.**

| Affirmation | Verdict | Action |
|---|---|---|
| « 4,3 % **nets** par an » | 🔴 | « nets » absent de toute source ERAFP → corps : **« taux de rendement interne annualisé de 4,3 % »** (para 1) ; footnote [^318] déjà correcte (« TRI… valeur économique ») |
| « 4,5 millions de personnes » | ⚠️ | ERAFP : 4,4 M / « près de 4,5 M » → **« près de 4,5 millions de cotisants »** |
| Gestion « CDC sous autorité ERAFP » | ⚠️ | hiérarchie inversée → **« confiée à l'ERAFP, dont la CDC assure la gestion administrative et financière »** |
| Allocation 58/20/10/9 (=97 %) | ⚠️ | manque ~3 % → ajout **« le reste en liquidités »** (ERAFP exact : 57,8/20,2/9,8/9,3) |
| Ratios couverture 117 / 136 | ⚠️ | exacts ERAFP → **117,3 % / 135,8 %** |
| Citation art. 76 tronquée | ⚠️ | ajout **« […] »** |
| « Vingt millions de salariés privés » | ⚠️ | INSEE T4 2024 : 21,07 M → **« Plus de vingt millions »** |
| Footnote [^340] PER | ⚠️ | ajout **« données au 3ᵉ trimestre 2024 »** |
| Citation COR juillet 2024 [^335] | ✅ | **verbatim confirmé** par extraction locale du PDF (pdftotext) : « le RAFP est géré en capitalisation puisque la réglementation prévoit la couverture de la totalité des engagements » — mot pour mot. |
| Encours 47,8 Md€ ; loi Fillon art. 76 ; décret 18 juin 2004 ; cotisation 5+5 % sur primes plaf. 20 % ; citations François IFRAP 2015 + Martinot Fondapol mars 2025 (verbatim) ; calcul 10 600 €/cotisant ; champ (3 FP + militaires + magistrats) | ✅ | confirmés |

**Corrections appliquées (8)** : 1 🔴 (« nets ») + 7 ⚠️. **1 contrôle manuel en attente** : verbatim citation COR [^335].

**Contrôle manuel §0.2 levé** : citation COR [^335] vérifiée verbatim (PDF téléchargé + pdftotext). ✅

### §0.3 « Trois chiffres » (29 mai 2026) — 3 agents (fact-check + COR + sourçage)
**5 ✅ / 8 ⚠️ / 3 🔴.** Corrections appliquées (+3 footnotes créées).

| Affirmation | Verdict | Action |
|---|---|---|
| 50 % CAC 40 non-résidents / 1 083 sur 2 165 Md€ / 19 sur 35 / 40 % zone euro / 34 % US (BdF 4 déc. 2025) | ✅ | — |
| GPFG ~1,5 % actions mondiales | ✅ | — |
| 370 000 → 130 000 → 240 000 (Bpifrance) | ✅ | — |
| Taux remplacement 72/96/63 (OCDE PAG 2025) | ✅ | — |
| [^10] « lettre Vernimmen n° 220, fév. 2025 » | 🔴 | corrigé → **n° 223, janvier 2025** (la 220 = oct. 2024, autre sujet) |
| [^9] phrase parasite ABP/fossiles dans note GPFG | 🔴 | **supprimée** (erreur copier-coller) |
| [^11] « 500 000 dirigeants d'ici 2030 » | 🔴 | mélange d'horizons → reformulé **« 370 000 dirigeants dans les 5 prochaines années (Bpifrance) »** |
| « près de 40 Md€ » dividendes à l'étranger | ⚠️ | calcul prorata strict 0,50×72,8 → **« environ 36 milliards »** + footnote [^10] explicite le calcul |
| GPFG « près de 30 Md€ » actions FR | ⚠️ | France = 2,1 % du portefeuille actions ≈ **25 Md€** → corrigé « environ vingt-cinq milliards » + calcul en footnote [^9] |
| Cotisations France 28 % (corps) vs 27 % (note) | ⚠️ | harmonisé → **« 27 à 28 % »** (corps + footnote [^13]) |
| Positions ABP (Schneider 615 / L'Oréal 367 / Sanofi 196 / + 7 autres) | ⚠️→✅ | montants confirmés par extraction PDF ABP (31/12/2025) → **footnote [^374] créée** |
| CPP Investments (Schneider/Air Liquide/Veolia) | ⚠️→✅ | présence confirmée (CPP Foreign Equity Holdings) → **footnote [^375] créée** |
| « 3 millions d'emplois » | ⚠️→✅ | DGE 2025 + Bpifrance Le Lab nov. 2025 → **« potentiellement concernés » + footnote [^376] créée** |

**Corrections appliquées** : 3 🔴 + 3 ⚠️ chiffrées + 3 footnotes ajoutées ([^374] ABP, [^375] CPP, [^376] emplois) ; footnotes [^9], [^10], [^13] corrigées.

### §0.4 « La grande illusion » (29 mai 2026) — section initialement SANS aucune footnote
Agent capitalisons-fact-checker. **3 ✅ / 3 ⚠️ / 3 🔴.** 5 footnotes créées ([^377]-[^381]).

| Affirmation | Verdict | Action |
|---|---|---|
| 1 € à 5 %/40 ans → 7 € (1,05^40 = 7,10) | ✅ | — (sept euros = légèrement prudent) |
| 5 % « bien en deçà » des fonds de pension | ✅ | footnote [^380] créée (CPP 9,2 %, ABP ~7-8 %, AP ~7,5 %, Future Fund 8,3 %) |
| NL 96 % / OCDE 63 % | ✅ | confirmé (recherche OCDE PAG 2025) |
| « près de 14 % du PIB » (France) | ⚠️ | défendable (OCDE 14,2 % 2022 ; DREES/COR 13,4 % 2023) → footnote [^377] créée |
| « pays qui dépensent moins de la moitié » | 🔴 | ambigu (public vs total) → **« pays dont l'État dépense moins de la moitié »** (NL public ~5 % vs FR 14 %) + footnote [^378] |
| « tous… des trente dernières années » | 🔴 | faux pour Suisse (1985), NL (années 80), Danemark (1964) → **« de leur histoire récente »** + footnote chronologie [^379] |
| « garantir 96 % du dernier salaire » | 🔴 | « garantir » impropre (réforme Wtp 2023 DB→DC) → **« assurer en moyenne »** + footnote [^381] (taux théorique OCDE) |

**Note de cohérence (70 vs 72 %)** : l'agent §0.4 a signalé un possible « 70 % » France (PAG 2025) via Contrepoints. Vérification : OCDE PAG 2025 confirme NL 96 / moyenne 63 ; le primaire France est en 403 mais **71,9 %** reste la valeur OCDE établie et sourcée en [^12]. **§0.3 conservé à 72 %.** Le « 70 % » secondaire non corroboré.

**Corrections appliquées** : 3 reformulations (🔴) + 5 footnotes créées.

### §0.5 « L'objectif du livre » (29 mai 2026) — section initialement SANS footnote
Agent capitalisons-fact-checker. **1 ✅ / 2 ⚠️ / 2 🔴.** 2 footnotes créées ([^382]-[^383]).

| Affirmation | Verdict | Action |
|---|---|---|
| « **épargne brute** » des ménages > 6 000 Md€ | 🔴 | terme faux (épargne brute = flux annuel ~349 Md€ en compta nat.) → **« patrimoine financier »** (stock 6 415 Md€, BdF T4 2024) + footnote [^382] |
| « c'est plus que celle de l'**Allemagne** » | 🔴 | **faux** (DE 9 050 Md€ > FR 6 415 Md€, Bundesbank T4 2024) → **supprimé**. NB : option « retourner vers fonds de pension allemands » écartée car contredirait l'avant-propos (DE classée pays SANS fonds de pension, 6 % PIB) |
| « rendement nul ou faible » | ⚠️ | « nul » inexact en 2025 (Livret A 1,7 %, fonds euros 2,65 %, inflation ~0,8 %) → **« faible au regard des actifs productifs sur longue période »** + footnote [^383] |
| « quatre millions et demi de fonctionnaires » (RAFP) | ✅ | cohérent (~4,5 M cotisants ERAFP) |

**Corrections appliquées** : 2 🔴 (reformulation + suppression comparaison Allemagne) + 1 ⚠️ + 2 footnotes créées. Pronom « elle dort » → « il dort » (patrimoine).

### §0.6 « Plan de l'ouvrage » (29 mai 2026) — sommaire des 3 parties
Agent capitalisons-fact-checker + vérifs perso. **4 ✅ / 4 ⚠️ / 1 « 🔴 » requalifié non-erreur.** 1 footnote créée ([^384] COR).

| Affirmation | Verdict | Action |
|---|---|---|
| Agenda 2027-2052 = 25 ans | ✅ | — |
| Suède/Australie/Singapour « ont réussi », Chili « s'est trompé » | ✅ | défendable (nuance design Chili développée en P3) |
| 240 000 entreprises sans repreneur (= 370 k − 130 k) | ✅ | cohérent §0.3 |
| « déficit chronique…jusqu'en 2070 » (COR) | ⚠️→✅ | horizon 2070 + déficit tous scénarios confirmés (COR juin 2025) → **footnote [^384] créée** |
| « quatre-vingts ans » depuis 1945 (=81 en 2026) | ⚠️ | round acceptable → **laissé** |
| patrimoine « > 6 000 Md€ » | ⚠️→✅ | agent §0.6 a mal lu (disait ~6 900) ; vérif perso (La Finance pour Tous) = **6 356 Md€**, cohérent avec [^382] (~6 415). **Aucun changement.** |
| « +228 k à +456 k € » / « 1 500 Md€ » | — | renvois modélisation interne P1/P2, à confirmer à leur source |
| « *Cinq mensonges*… aux six objections » | « 🔴 »→non-erreur | **procédé assumé** : l'appendice est titré « Cinq mensonges » mais écrit « Cinq, dit-on. À l'usage, ce sont six » et contient Q.1-Q.6. §0.6 fidèle. **Laissé.** |

**⚠️ À TRAITER lors du fact-check de l'appendice** : incohérence INTERNE à `07-appendice-cinq-mensonges.md` — l'intro dit « Cinq questions, donc, cinq réponses » (1 §) PUIS « Six questions, six réponses » (3 § plus loin). À harmoniser.

**Corrections appliquées** : 1 footnote créée ([^384] COR juin 2025). 0 correction de corps (hors renvoi de note).

## ✅ INTRODUCTION TERMINÉE (§0.1 à §0.6)
**Total intro** : 6 sections, ~36 ✅ / 28 ⚠️ / 10 🔴. **15 footnotes créées ou corrigées** ([^368]-[^369] enrichies, [^9][^10][^13] corrigées, [^374]-[^384] créées). Corrections majeures : 77→78 % sondage Ipsos ; « 4,3 % nets »→TRI ; Vernimmen n°223 ; ABP/fossiles supprimé ; 500 k/2030→370 k ; dividendes 40→36 Md€ ; GPFG 30→25 Md€ ; « épargne brute »→« patrimoine financier » + suppression comparaison Allemagne (fausse) ; « moins de la moitié »→« dont l'État dépense » ; « trente dernières années »→« histoire récente » ; « garantir »→« assurer en moyenne ».

---

## PARTIE 1 — `02-partie1-capi-repond.md`

**Note de méthode** : §1.1 « Le système actuel est dans une impasse » est traité PAR SOUS-SECTION (trop dense pour un seul agent en qualité) : §1.1a *Le grand vieillissement* (l. 19-56) / §1.1b *Le déficit caché* (l. 57-90) / §1.1c *Comment on en est arrivé là* (l. 91-108).

### Ouverture de partie + §1.1a « Le grand vieillissement » (29 mai 2026)
Agent capitalisons-fact-checker + vérifs perso (téléchargement PDF COR 2025, INED/INSEE espérance de vie, FMI, Eurostat). **13 ✅ / 7 ⚠️ / 7 🔴.** 8 corrections appliquées + 1 footnote créée ([^385]).

| Affirmation | Verdict | Action |
|---|---|---|
| Solde naturel 2025 −6 000 (645 k naiss. / 651 k décès), 1ʳᵉ fois depuis WW2 ; ICF 1,56 ; âge maternité 31,2 ; espérance vie 85,9/80,3 ; part 65+ 22,2 % ; Ageing Report 38,2→57,8 % ; ratio 4,29→1,79→1,40 ; hypothèses COR ; 5 réformes ; croissance 2025 +0,9 % | ✅ | confirmés (INSEE Bilan démo 2025, EC, COR 2025 via PDF) |
| Épigraphe COR « …quel que soit le scénario **retenu** » | 🔴 | verbatim COR (PDF) = « …quel que soit le scénario » → **« retenu » supprimé** |
| « Cour des comptes…30 Md€ en 2045 » sans footnote | 🔴 | confirmé (Moscovici 20 fév. 2025 : 6,6/15/30 Md€) → **footnote [^385] créée** |
| « près de vingt-**trois** années » (F à 65 ans) | 🔴 | INSEE = 23,6 → **« près de vingt-quatre »** |
| « augmentation d'**un tiers** » (espérance vie à 65 ans dep. 1945) | 🔴 | réel +60-70 % (13/18 ans en 1965 → 20/23,6 en 2025) → **« de plus de moitié »** |
| « aussi nombreux que les moins de vingt » | 🔴 | 22,2 % vs 22,5 % → **« presque aussi nombreux (22,2 % contre 22,5 %) »** |
| [^28] retraités : corps 2023/17,2 M vs note 2024/18,1 M | 🔴 | triple incohérence → corps **781 k liquidations + ~220 k nets** ; footnote refondue (DREES 2025, fin 2023, 18,1 M supprimé) |
| [^21] cite espérance vie à la **naissance** 1947 (mauvais indicateur) | 🔴 | refondue → espérance de vie **à 65 ans** (13/18 en 1965, 20,0/23,6 en 2025) |
| « croissance 2025 sous trajectoire COR +1,2 %/an » | 🔴→corrigé | COR central = productivité **0,7 %** (PDF), pas de +1,2 % ; comparaison fausse (et inversée) → **supprimée** ; gardé seul le point fécondité (1,56 < 1,80) |
| FMI [^15] « postes à réformer pour la soutenabilité » | ⚠️→✅ | **vérifié défendable** (FMI mai 2025 : retraites parmi pistes d'économies, carrières longues, harmonisation) — pas de changement |
| Décimales ratios 4,29/1,79/1,40 ; Eurostat SE/NL 2024 (peut-être 2023) ; ~13 % 65+ en 1986 | ⚠️ | acceptables/sourcés → laissés |

**Corrections appliquées** : 8 (7 🔴 + suppression +1,2 %) + footnote [^385]. Footnotes [^21] et [^28] refondues.

### §1.1b « Le déficit caché » (29 mai 2026) — section méthode Beaufret (Fondapol)
Agent capitalisons-fact-checker + vérifs perso (Légifrance décrets, PDF note Beaufret COR sept. 2023, PDF COR 2025, recherches budgets PLF). **7 ✅ / 2 ⚠️ / 3 🔴.** 3 corrections de fond + 4 footnotes complétées/actualisées.

| Affirmation | Verdict | Action |
|---|---|---|
| Cour des comptes 6,6 Md€ (2025) ; COR 1,7 Md€ (2024) ; contribution État CAS Pensions > 50 Md€ ; Beaufret 81 Md€ (412−331) ; décompo 56/17/9 ; Moscovici « le statu quo n'est pas possible » (verbatim) | ✅ | confirmés |
| **34 Md€ (2022) maquillage + −29 Md€ déficit consolidé** [^32] | ⚠️→✅ | **VÉRIFIÉ dans la note Beaufret Doc_07 (PDF)** : « ÉTAT 34,8 Md€ équilibre pensions civiles+militaires » et « solde global… −29 Md€ en 2022 ». Faux positif de l'agent (PDF inaccessible pour lui). Footnote [^32] complétée (Doc n° 7 + chiffres). |
| Taux cotisation « 74,28 % en 2024, relevée à 82,28 % en 2026 » + [^31] | 🔴 | omettait le palier **78,28 % en 2025** ; [^31] citait le mauvais décret pour 82,28 %. Vérifié Légifrance/AEF : déc. 2025-61 → 78,28 % (2025), déc. 2025-1341 → 82,28 % (2026). Corps + [^31] corrigés. |
| « **trois fois** le budget Intérieur + Justice » [^34] | 🔴 | obsolète (PLF 2024). PLF 2025 : Sécurités 25 + Justice 12,5 = 38 → ratio 2,1× → **« plus du double de la sécurité intérieure et de la justice réunis »**. [^34] actualisé. « davantage que la défense » (50,5 Md€ hors pensions) conservé. |
| Citation COR [^37] « quel que soit le scénario **retenu** » | 🔴 | « retenu » absent du verbatim (PDF COR) → **supprimé** (même correction que l'épigraphe). |
| [^30] chiffre 51,7 Md€ ; « employeur privé ~16 % » | ⚠️ | « plus de 50 Md€ » solide (PLF 2026 : 52,4 Md€) ; « ~16 % » = taux de référence de Beaufret lui-même (16,5 %) → conservés, [^30] enrichi (source Sénat PLF 2026). |

**Corrections appliquées** : 3 🔴 de fond (palier 78,28 %, « plus du double », « retenu ») + footnotes [^30][^31][^32][^34] complétées/actualisées.

### §1.1c « Comment on en est arrivé là » (30 mai 2026) — histoire 1670→1999
Agent capitalisons-fact-checker + confrontation corps↔footnotes [^38]-[^53] + sources primaires (Légifrance, INSEE, INED, Sénat, CDC). **9 ✅ / 4 ⚠️ / 6 🔴.** 5 corrections corps + 2 footnotes.

| Affirmation | Verdict | Action |
|---|---|---|
| CDC 28 avril 1816 ; lois 1928/1930 ; AVTS 14 mars 1941 ; ord. 45-2250 du 4 oct. 1945 ; AGIRC 14 mars 1947 ; ARRCO 8 déc. 1961 ; ord. 82-270 du 26 mars 1982 (Auroux) ; Laroque/Parodi ; Croizat nov. 1945 ; Charpin 264 p. mai 1999 ; AVTS « 1ʳᵉ répartition obligatoire » | ✅ | confirmés |
| Croissance « 5,5 % » 1949-1973 | 🔴 | footnote [^45] dit 5,3 % (incohérence interne) → corps **« 5,3 % »** |
| Espérance de vie 65 ans « sept à dix années » | 🔴 | [^46] donne 9,9 (H)/12,2 (F) en 1950 → corps **« entre dix et treize années selon le sexe »** |
| Fécondité sous 2,1 « milieu des années 1980 » | 🔴 | [^51] : 1975 = 1,93 (déjà sous 2,1) → reformulation « deux temps » conjoncturel/structurel, **« dès le milieu des années 1970 »** |
| « Le commissaire au Plan Raoul Briet » | 🔴 | Briet = **commissaire-adjoint au Plan** (commissaire 1995 = Guaino) → corps corrigé |
| Charpin « son successeur » | 🔴 | succède à Guaino, pas à Briet → **« devenu commissaire au Plan en 1998 »** |
| Footnote [^39] « ordonnance d'août 1670 » | 🔴 | non attesté → refondue : **édit Colbert 19 avril 1670 (classes) + Caisse invalides marine édit de Nancy 23 sept. 1673 (ENIM)** ; source Institut La Boétie (LFI) supprimée |
| Footnote [^42] Laroque « novembre 1944 » | ⚠️ | réel **octobre 1944** → corrigé (+ « GPRF » au lieu de « CFLN ») |
| Croizat « puis sous Félix Gouin » | ⚠️ | a aussi servi sous Bidault/Ramadier — simplification laissée |
| TRI « dépasse 5,5 % » génér. 1950 | ⚠️ | [^50] = 5,8 % — conservateur, laissé |
| Citation Laroque [^44] | ⚠️ | source secondaire (Valat/Palier), non vérifiable en primaire — **non touchée, aucune citation inventée** |

**Corrections appliquées** : 5 corps (5,3 % ; espérance de vie ; fécondité ; Briet ; Charpin) + 2 footnotes ([^39] refondue, [^42] octobre 1944). Aucune citation ajoutée ni inventée.

## ✅ §1.1 TERMINÉ (§1.1a + §1.1b + §1.1c)

### §1.2 « Ces réformes paramétriques qui n'en sont pas » (30 mai 2026) — cinq réformes 1993→2023 + suite 2025
Agent capitalisons-fact-checker + vérifs perso (Légifrance, service-public, presse 2025). **18 ✅ / 7 ⚠️ / 2 🔴.** 5 corrections appliquées (3 corps + 2 footnotes).

| Affirmation | Verdict | Action |
|---|---|---|
| Lois 93-936 (22/7/1993), 2003-775 (21/8/2003), 2010-1330 (9/11/2010), 2014-40 (20/1/2014), Borne 2023-270 (14/4/2023) ; 150→160 trim. ; 10→25 meill. années ; indexation prix ; âge 60→62 ; taux plein 65→67 ; Touraine 43 ans génér. 1973 ; Borne 62→64 ; **43 ans dès génér. 1965** (agent disait 1966 à tort — calendrier officiel = 1965) ; 7 mars 2023 (3,5 M / 1,28 M) ; 49.3 du 16 mars ; gel 62 ans 9 mois jusqu'en janv. 2028 | ✅ | confirmés |
| Elabe-BFMTV 11 janv. 2023 (59 % opposés / 60 % soutiennent) | ✅ | confirmé |
| **« quarante-trois trimestres »** (retraité 1995) | 🔴 | départ 60 ans en 1995 = ~150 trim. → **« cent cinquante trimestres »** (contamination des 43 annuités de la cohorte 1980) |
| **[^60] « gouvernement Bayrou »** (automne 2025) | 🔴 | suspension annoncée par **Lecornu** le 14 oct. 2025 (art. 45 bis PLFSS 2026) → footnote refondue |
| Fillon « 41 puis 41,5 annuités » | ⚠️ | 41,5 = réformes postérieures → corps **« 41 annuités d'ici 2012 »** |
| Woerth « six semaines de grèves reconductibles » | ⚠️ | invérifiable → **« Plusieurs semaines… »** |
| [^56] « huit raffineries sur douze » | ⚠️ | non confirmé (quasi-totalité en réalité) → footnote reformulée (« quatorze journées d'action nationale… quasi-totalité des raffineries à l'arrêt mi-octobre ») |
| Woerth « 2011-2017 » | ⚠️ | défendable avec accélération LFSS 2012 (génér. 1955 → 62 ans en 2017) → laissé |
| Borne « 43 ans dès 1965 » | ⚠️→✅ | agent erroné, corps correct → laissé |

**Corrections appliquées** : 2 🔴 (150 trim. ; Lecornu) + 3 ⚠️ (41 annuités ; plusieurs semaines ; [^56] raffineries). Aucune citation/chiffre inventé.

### §1.3 « C'est Nicolas qui paie » (30 mai 2026) — TRI générationnel, Mercer, comparaisons UE
Agent capitalisons-fact-checker + vérifs perso en source PRIMAIRE (rapport Mercer 2025 PDF via pdftotext, INSEE E&S 481-482, Le Grand Continent Blanchard-Ecalle). **Mercer : données du manuscrit massivement fausses (édition 2024 confondue).** **3 ✅ / 7 ⚠️ / 8 🔴.** 11 corrections appliquées (6 corps + 5 footnotes), 1 point en attente d'arbitrage auteur.

| Affirmation | Verdict | Action |
|---|---|---|
| TRI 5,8/1,9/0,8 % (÷7) ; 159/117/120 centimes ; cotis. 27,8 % ; taux empl. 60-64 ans 42,4 % ; 26 % cadres seniors CLD ; âge UK/DK/NL 67 ; Odoxa 57/22/20 | ✅ | confirmés |
| **Mercer : France « 53,7/100 », « 33ᵉ sur 48 », viab. 49,0, DK 81,6, NL 79,0** | 🔴 | **rapport primaire 2025 (52 systèmes)** : France **70,3** (cat. B) ; viab. **48,6** ; DK viab. **85,0** ; NL viab. **83,5** (global 85,4, 1er). Le « 81,6 » = score *global* 2024 du DK. Paragraphe + [^67] **réécrits** : on mène désormais par le sous-indice viabilité (point de fond intact et renforcé) |
| **« 65 en Allemagne ou en Italie »** (l.157) | 🔴 | footnote [^72] dit 67 → corps **« soixante-sept en Allemagne et en Italie »** |
| **« au sommet de la fourchette européenne » (43 ans)** | 🔴 | Belgique/Allemagne 45, NL 50 → **« parmi les durées les plus élevées d'Europe »** |
| **« le double » du rendement FR** (3,1 vs 1,9) | 🔴 | = ×1,6 → **« plus d'une fois et demie »** |
| **Suède « 55 % répartition / 45 % capitalisation »** | 🔴 | faux (public = 16 % NDC + 2,5 % PPM) → **« une part substantielle de capitalisation (PPM + régimes de branche) »** |
| Suède « 80 % du dernier salaire » | 🔴 | haut de fourchette (OCDE 66 %) → **« de l'ordre de 70 % »** |
| **[^62] + [^50] auteurs « Breuil-Genier/Blanchet/Tô »** | 🔴 | vrais auteurs = **Yves Dubois et Anthony Marino** (vérifié INSEE/Persée) → corrigé dans les DEUX footnotes ; [^62] : générations 1990-2000 ré-attribuées à l'IPP post-2023 |
| **[^61] Blanchard « FT/Project Syndicate », « au cœur »** | 🔴 | source réelle = **entretien Blanchard + Ecalle, *Le Grand Continent* 14 déc. 2024** ; retraites = 1/5 de l'effort → corps **« parmi les principaux leviers »** + footnote refondue |
| [^64] cotis. historiques « 15-18 % » vs note « ≈14 % » | ⚠️ | → corps **« 14 % à 18 % »** |
| [^75] citation Souillot (FO) « 50 % liquident à 62 ans sans emploi » | ⚠️ | verbatim retrouvé (reprise CSE Matin nov. 2024) mais URL France Info 403 → **laissé, citation cohérente** (non inventée) |
| **[^65] COR « −9 points » taux de remplacement** | 🔴 | **PDF COR relu (pdftotext)** : pas de « −9 pts ». Vrai chiffre = pension moyenne/revenu d'activité **52,3 % (2023) → 45,1 % (2070)**, −7,2 pts ; taux remplacement cas-type reste > 66,6 %. Corps + [^65] **réécrits** sur la donnée exacte |
| [^66] niveau de vie relatif 97 % → 87,5 % | ✅ | **confirmé VERBATIM PDF COR** (« 87,5 % en 2070 contre 97 % en 2022 ») |
| [^75] citation Souillot | ✅ | attribution + chiffre corroborés (plusieurs reprises) ; footnote enrichie (source accessible CSE Matin) |
| **l.153 « Cercle de l'Épargne et Harris » + « trois quarts » des 25-35 ans** | 🔴 | attribution incohérente + « trois quarts » non sourçable → auteur a choisi **« adoucir »** → corps : **« baromètres du Cercle de l'Épargne et de l'Institut Montaigne, une large majorité ne croit plus à la viabilité »** (sans chiffre) |

**Corrections appliquées** : 7 corps (Mercer, Allemagne/Italie 67, fourchette UE, le double, Suède 55/45, Suède 80 %→70 %, cotis. 14 %, l.153 adoucie) + 5 footnotes ([^50], [^61], [^62], [^67] réécrites ; [^64] via corps).

### ⚠️ §1.3 — RÉOUVERT (30 mai 2026) — passage en méthode « tout primaire »
Re-vérification en source primaire locale (curl + pdftotext) à la demande de l'auteur. Confirmé en primaire : COR niveau de vie 97→87,5 % (verbatim), COR pension/revenu 52,3→45,1 % (corrige le faux « −9 pts »), Mercer 2025 (déjà). **Mais découverte d'une erreur grave non détectée au 1ᵉʳ passage :**

✅ **BLOC TRI RÉSOLU** (auteur a validé la réécriture sur chiffres réels) — Les TRI inventés (5,8/1,9/0,8, « divisé par sept », 7-8 %) **supprimés**. Remplacés par les valeurs primaires : TRI **2,5 % (1950) → 1,75 % (dès 1970)**, convergence ~1,4 % (Dubois-Marino fig. I) ; taux de récupération **159 % (1950) → 117 % (1980)** confirmé Cairn (*Retraite et Société* 2016), « 120 % pour enfant né aujourd'hui » supprimé (pas de remontée selon la source). §1.1c « dépasse 5,5 % » → « très élevé, propre à un régime naissant ». Footnotes [^50], [^62], [^63] réécrites. Preuves complètes : `_factcheck-preuves.md`.

**CHANGEMENT DE MÉTHODE acté (30 mai 2026)** : abandon du mode « agent certifie ». Désormais : (1) chaque chiffre/date/citation lu par Claude en source PRIMAIRE locale (téléchargement + pdftotext) ; (2) concordance source↔texte obligatoire, sinon 🔴 ; (3) citations = verbatim ; (4) journal de preuves `_factcheck-preuves.md` ; (5) plus aucun statut « cohérent/laissé » ; (6) agent = recherche de sources candidates uniquement, jamais validation. Conséquence : §1.1-§1.3 « terminés » au 1ᵉʳ passage doivent être considérés **à re-certifier en primaire** (le bloc TRI en est la preuve).

**Prochaine étape** : trancher le bloc TRI avec l'auteur, puis re-certifier §1.1-§1.3 en primaire avant d'avancer vers §1.4.

### 2026-05-30 — BACKFILL méthode neuve : intro §0.3 (en cours)
Re-certification primaire locale de §0.3 « Trois chiffres ». Détail + extraits dans `_factcheck-preuves.md`.
- ✅ Chiffre 1 (BdF 1083/2165/50 %, zone euro 40 %, US 34 %, 19/35) confirmé verbatim ; [^8] précisée.
- 🔴 **Chiffre 3 corrigé** : taux remplacement net France = **70,0 %** (OCDE PAG 2025 Table 4.4, PDF lu), pas 72 %. Corps + [^12] corrigés (Suisse 75→47,5, Danemark 80→77,1 aussi faux). **Le « 72 % » avait été validé ✅ au 1ᵉʳ passage — 2ᵉ erreur que le backfill rattrape.** Cascade à traiter en P3 (Chili [^232]).
- ✅ Chiffre 2 (Bpifrance 370k/130k/3M) confirmé ; « 240k sans repreneur » = calcul du livre (Bpifrance dit ~200k).
- GPFG : 1,5 % monde ✅ ; 🔴 **France équités corrigé 25 → 35 Md€** (le 2,1 % du Tableau 2 NBIM est une part du fonds total, pas du portefeuille actions). Cascade P2 l.32 (30→35) corrigée aussi.
- ✅ Vernimmen 72,8 Md€ confirmé ; ✅ ABP [^374] (Schneider 615, L'Oréal 367… exacts, PDF lu) ; ✅ CPP [^375] (Schneider 281, Air Liquide 229, Veolia 59 MCAD, lu).

## ✅ §0.3 BACKFILL TERMINÉ — 2 erreurs rattrapées (OCDE 72→70 ; GPFG 25→35), reste tout confirmé en primaire.
**Cascades P2 notées** (`_factcheck-preuves.md`) : dividendes « près de 40 » vs 36 ; GPFG « 1 900 Md€ » vs ~1 675 ; tailles de fonds à certifier.

### §0.4 « La grande illusion » — BACKFILL TERMINÉ (30 mai 2026)
Corps **sain** (aucune erreur dans le texte). Vérifs primaires : 1,05^40 = 7,04 ✅ ; France 14,1 % PIB ✅ (PAG Table 8.4) ; CPP 9,2 % + Future Fund 8,3 % ✅ ; NL 96 % ✅. **2 footnotes corrigées** : [^378] Pays-Bas « 5 % » → **6,6 %** (PAG Table 8.4 ; « moins de la moitié » tient), [^381] France 71,9 → **70,0**. Détail + extraits : `_factcheck-preuves.md`. Noté : incohérence CPP 9,2 % ([^380]) vs 8,3 % ([^107]/[^300]) à harmoniser en P1/appendice.

### §0.5 « L'objectif du livre » — BACKFILL TERMINÉ (30 mai 2026)
Corps sain. [^382] patrimoine financier « 6 415 » → **6 356,4 Md€** (BdF T4 2024, cohérent avec [^124]). [^383] rendements ✅ (Livret A 1,7→1,5 %, fonds euros 2,65 %, inflation ~0,8 %). RAFP 4,5 M ✅.
🔴 **Cascade P2 corrigée** : `03-partie2…:36` « six mille milliards, plus que l'Allemagne » → comparaison fausse retirée (déjà supprimée de §0.5). À traiter en P2 : terminologie « épargne brute » (l.226, l.272) → « patrimoine financier ».

### §0.6 « Plan de l'ouvrage » — BACKFILL TERMINÉ (30 mai 2026)
**Sain, 0 correction.** [^384] COR confirmé **verbatim** (PDF lu) : −0,2 %/2030 (6,6 Md€), −1,4 %/2070 réf., fourchette −0,7 %/−2,2 %, tous scénarios, 14,2 % du PIB. Renvois 228k-456k €, 1 500 Md€, 20-40 % → à certifier en P1/P2. Incohérence appendice « cinq/six » → à traiter en appendice.

### ✅ INTRO §0.3-§0.6 BACKFILLÉE. Restent §0.1 (5 sondages) + §0.2 (RAFP) à re-certifier en primaire (faits au 1ᵉʳ passage).

### §0.1 + §0.2 — BACKFILL TERMINÉ (30 mai 2026)
- **§0.1 sondages** : Odoxa (57/22/20) ✅, Elabe (59/40, NFP 47) ✅, Ipsos (55/78) ✅, AMF (58/66) ✅, OpinionWay 76 % ✅. 🔴 **1 erreur** : « 70 % jugent la répartition intenable » inexistant dans OpinionWay-Finary (PDF lu) → remplacé par « **87 % inquiets pour l'avenir des retraites en France** » (corps + [^370]).
- **§0.2 RAFP** : ✅ tout confirmé en primaire (RAFP Public Report 2024 PDF) — 47,8 Md€, 4,4 M cotisants, TRI 4,3 %, couverture 117,3/135,8. Citations (François, Martinot, COR) déjà verbatim.

### ✅✅✅ INTRODUCTION ENTIÈREMENT BACKFILLÉE (§0.1-§0.6). Bilan backfill intro : **9 erreurs** rattrapées (Mercer, OCDE 72→70, GPFG 25→35, NL 5→6,6, patrimoine 6 415→6 356, Allemagne-en-P2, OpinionWay 70→87, + TRI & COR de §1.3).

### AVANT-PROPOS §1-15 — BACKFILL TERMINÉ (30 mai 2026) — SAIN, 0 nouvelle erreur
Tout reconfirmé en primaire : Opella 16/10 Md€ ✅, Bpifrance 1,8 % ✅, Ardian 176 Md$ ✅, CalPERS anchor 500 M$ ✅, Heico/Exxelia 453 M€ ✅, Photonis/HLD ✅, moteur Vinci ✅, **ratios OCDE PMF 2025 exacts au dixième** (PDF lu : Danemark 204, Islande 188,4, Suisse 164,8, France 12,9, Italie 11,7, Allemagne 6,4…). Le 1ᵉʳ passage (22 corrections) avait bien nettoyé cette section.

### ✅ BACKFILL AVANT-PROPOS + INTRODUCTION COMPLET. Compteur erreurs backfill : **9** (toutes en intro/§1.3 ; avant-propos clean).

| Section | Statut backfill |
|---|---|
| Avant-propos §1-15 | ✅ certifié primaire (0 erreur) |
| Intro §0.1-§0.6 | ✅ certifié primaire (erreurs corrigées) |
| P1 §1.1-§1.3 | ✅ RE-CERTIFIÉ primaire (30 mai) — 0 nouvelle erreur |
| P1 §1.4 | ✅ certifié primaire (deux épargnants supprimé ; modélisation recalculée) |
| P1 §1.5 | ✅ certifié primaire + recalculé (cas-type départ 64 ans) |
| P1 §1.6 | ✅ certifié primaire (90→40 Md€, Suède 22 %, 2 footnotes vides remplies) |
| **PARTIE 1 (§1.1-§1.6)** | ✅✅ **BACKFILL COMPLET** |
| P2, P3, conclusion, appendice | non démarrés |

### §1.1-§1.3 RE-CERTIFIÉ PRIMAIRE (30 mai 2026) — 0 nouvelle erreur
Confirmés en primaire ce tour : INSEE Bilan démo 2025 (solde −6 000, ICF 1,56, espérance 85,9/80,3, pop. 69,1 M) ; COR hypothèses 1,8/70k/0,7 %/7 % + ratio 1,8 cotisant/retraité + déficit 1,7 Md€ 2024 ; taux cotisation employeur 74,28/78,28/82,28 (bons décrets) ; Beaufret 81 Md€ ; taux emploi 60-64 = 42,4 % ; 26 % cadres seniors ; **Allemagne/Italie 67 confirmé** (ma correction 65→67 juste). Détail : `_factcheck-preuves.md`.

**ÉTAT : avant-propos + introduction + P1 §1.1-§1.3 entièrement certifiés en primaire.** Compteur erreurs backfill : **9**.

### §1.4 « Comprendre la capitalisation » — BACKFILL TERMINÉ (30 mai 2026)
Multiplicateurs intérêts composés tous exacts (Python) ; assurance-vie 1 989/1 178 Md€ ✅, PER 11,2 M/118,9 Md€ ✅, fonds euros 2,63 % ✅ (ACPR). **2 erreurs corrigées** : exemple des deux épargnants **supprimé** (132 000 € impossible à 4 % ; conclusion « commencer tôt bat cotiser plus » fausse en dessous de 6,3 % — décision auteur) ; l.201 « près de cinq fois » → **« plus de trois fois »** (3,2× à 4 %), [^84] réécrite. ⚠️ DMS [^86] (5,2/1,7/0,5) non lu en primaire (Yearbook UBS payant) — cohérent série longue, à confirmer si accès.

**+ sweep phrase-par-phrase §1.4** (après question auteur) : 2 erreurs molles ratées par le passage chiffres — Dimson à **Cambridge** (pas LBS) ; NBIM **~670** salariés (pas « mille »). Corrigées.

**Compteur erreurs backfill : 13.**

**LEÇON MÉTHODE actée** : « backfill chiffres + citations » ≠ phrase-par-phrase. Le passage chiffres rate les faits non chiffrés (attributions, effectifs, gentilés, cadrages). Règle désormais : **chaque section = phrase-par-phrase ET primaire, combinées.** Les sections avant-propos/intro avaient eu un phrase-par-phrase au 1ᵉʳ passage ; §1.4 avait été fait « chiffres seuls » → d'où les 2 ratés. À surveiller : re-sweep phrase-par-phrase éventuel des sections backfillées « chiffres seuls ».

### §1.5 « Cotiser moins pour gagner plus » — BACKFILL + RECALCUL (30 mai 2026)
Cas-type central : blocs de calcul tous exacts (Python). **3 erreurs** : (1) incohérence durée de retraite (rente sur 15,5 ans mais cumul sur 20, « à 73 ans »). Après échange auteur : **départ 64 ans, durée 24 ans** (espérance de vie de cohorte projetée pour un actif né en 1996 partant vers 2060 ; cohérent avec §1.1a « femme ~24 / homme ~20 » à 65 ans). Cas-type recalculé : **gains +228k/+456k → +155 709 € (scén. B) / +311 441 € (scén. C)**, rentes 953/1 905 €/mois, capital inchangé (216 240/432 480 €), levier 1,7, sensibilités +96 692/+234 661 ; (2) salaire « moyen » → médian (moyen réel 41 252 € INSEE) ; (3) frais « en dessous ABP 0,25 % » contradictoire → reformulé. Footnotes [^100]/[^103]/[^105] réécrites (24 ans). **Cascades corrigées (→ 155k/310k)** : intro §0.6, P2 l.50, appendice l.119. ⚠️ Appendice l.85 (scénario D 119k→228k impossible) à recalculer au fact-check appendice. ⚠️ CPP 8,3 % ([^107]) vs 9,2 % ([^380]) à harmoniser.

**Compteur erreurs backfill : 16.**

### §1.6 « Ce que ça change pour le système » — BACKFILL TERMINÉ (30 mai 2026)
2 erreurs : « 3 points → 90 Md€ » faux (≈ 40 Md€ ; le 90 = 3 % du PIB) → corrigé + « budget Défense » conservé ; Suède « 17,2 % » → **22 %** (cohérence §1.3). **Footnotes [^108] et [^109] étaient VIDES** → remplies (taux de cotisation pays ; calcul du point de cotisation). France 28 %, Australie 12 % ✅.

### Cas-type §1.5 — révision finale des hypothèses (30 mai 2026, échange auteur)
- **Taux de remplacement** : 74,4 % (génération 1963) → **70 %** (OCDE PAG 2025, situation d'un né-1996 ; cohérent §0.3). Plus juste et plus prudent.
- **Rendement** : maintenu **3,7 % net réel** (DMS 5,2 % réel actions, GPFG 4,1 % réel). RAFP **4,3 % NOMINAL ≈ 2,7 % réel** (20 % actions) → ajouté comme **plancher français** dans le texte.
- Discussion TRI : le TRI (1,75 %, §1.3) ne peut pas servir à reconstruire la pension (donne 105 % de remplacement, artefact) ; cohabite avec le taux de remplacement (récupération du modèle ~119 % ≈ §1.3). 
- **Chiffres FINAUX** : A = 23 261 €/an ; **gains +162 741 € (B) / +325 481 € (C)** ; rentes 953/1 905 €/mois ; levier 1,74. Cascades intro §0.6 / P2 / appendice → 162k/325k. [^102] réécrite (OCDE).

### ✅✅ PARTIE 1 ENTIÈREMENT BACKFILLÉE (§1.1-§1.6) + 3 passes de clôture + cas-type finalisé.

**Clôture P1 (30 mai)** : (1) DMS [^86] 5,2/1,7/0,5 confirmé en primaire (Cambridge JBS) ; (2) fonds [^107] confirmés (AustralianSuper 7,94 %, AP7 14 %, CPP 8,3 %) + CPP harmonisé à 8,3 % dans [^380] ; (3) balayage phrase-par-phrase §1.1-§1.3 → **Moscovici « ex- » → « premier président »** ; **fécondité « début » → « milieu » des années 1970**. Plus aucun item primaire non vérifié en P1.

**Compteur erreurs backfill : ~20** (+ 2 footnotes vides remplies).

**Prochaine étape** : **Partie 2** (`03-partie2-fonds-pension.md`) en méthode combinée, avec les cascades déjà notées à traiter (GPFG « 1 900 Md€ » ≈ 1 675 ; dividendes « près de 40 » vs 36 ; « épargne brute » → patrimoine financier l.226/272 ; tailles de fonds ABP/CPPIB/CDPQ/CalPERS ; CPP 9,2/8,3).

**Constat backfill** : sur 2 sections re-vérifiées (§1.3 + §0.3 partielle), le 1ᵉʳ passage avait laissé passer le TRI (5,8 %), le « −9 pts » COR, le Mercer (53,7) ET le taux OCDE (72) — 4 erreurs dans des sections « terminées ✅ ». Le backfill intégral est donc indispensable. (l. 163+, sous-sections Anatomie d'un euro cotisé / Ce que la capitalisation n'est pas / RAFP), footnotes [^77]+.

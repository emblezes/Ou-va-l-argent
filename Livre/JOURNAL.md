# Journal de bord — *Capitalisons*

**Format** : document de pilotage à jour à chaque fin de session. Permet à Claude (ou à toi) de reprendre le projet sans relire toutes les conversations passées.

**Pour reprendre une session** : ouvre ce fichier, dis à Claude « on reprend le projet *Capitalisons*, lis `Livre/JOURNAL.md` ». Claude charge ce fichier + `PLAN-REVISE.md` + `CHARTE-STYLE.md` + `METHODE.md` et reprend.

---

## État actuel — 29 mai 2026 (V4, restructuration en 3 parties + fact-check préparé)

**Phase** : restructuration V2 → V4 (3 parties) **terminée** (étape A-B-Découpage). Prêt pour réécriture intro + fact-check phrase par phrase.

**Décisions structurelles 29 mai 2026** :
- Passage de **5 parties → 3 parties** plus orientées plaidoyer :
  - **P1 V4** — La capitalisation répond aux problèmes du système de retraite (fusion ex-P1 + ex-P2 V2)
  - **P2 V4** — La capitalisation permet d'avoir des fonds de pension (= ex-P3 V2)
  - **P3 V4** — Comment on y arrive : ce que les autres pays nous apprennent (fusion ex-P4 + ex-P5 V2)
- Intro **réécrite** pour annoncer les 3 parties, avec amorce « Les Français sont prêts » (sondages 2024-2025)
- Avant-propos et Appendice conservés tels quels
- Conclusion « Choisir, enfin » → chapitre séparé `05-conclusion.md`
- Numérotation 1.X / 2.X / 3.X par nouvelle partie
- **3 sections NOUVELLES à écrire** :
  - **P1 V4 §1.9** « Le RAFP : la capitalisation existe déjà chez nous » (4,5 M fonctionnaires, ~48 Md€, depuis 2003 — argument anti-objection majeur, absent de la V2)
  - **P2 V4 §2.7** « Le cercle vertueux de la capitalisation » (boucle cotisations → actifs productifs → croissance → cotisations)
  - **Intro §0.1** « Les Français sont prêts » (sondages opinion récents)
- **2 sections à enrichir** :
  - **P3 V4 §3.8** ajouter les 4 raisons « pourquoi pas la France ? » (Vichy / méfiance / syndicats / paramétriques)
  - **P3 V4 §3.9** développer le fonds de transition modèle suédois (FRR montée en charge)

**Inspiration externe utilisée** : pres IAP « Vers la retraite par capitalisation » du 29 janvier 2025 (75 slides). **Uniquement pour les angles, jamais pour les chiffres** (datés, à actualiser sources primaires).

**Statut des fichiers V4** (`Livre/manuscrit-v4/`) — total ~40 100 mots, ~121 p. :

| Fichier | Mots | État |
|---------|------|------|
| `00-avant-propos.md` | 890 | Copié V2, prêt fact-check |
| `01-introduction.md` | 1 321 | **À RÉÉCRIRE** (placeholder TODO) |
| `02-partie1-capi-repond.md` | 9 340 | Fusion V2 OK, **TODO §1.9 RAFP** |
| `03-partie2-fonds-pension.md` | 10 035 | Copié V2, **TODO §2.7 cercle vertueux** |
| `04-partie3-feuille-route.md` | 14 162 | Fusion V2 OK, **TODO §3.8 + §3.9** |
| `05-conclusion.md` | 521 | Copié V2 |
| `07-appendice-cinq-mensonges.md` | 3 717 | Copié V2 |
| `99-footnotes.md` | 15 292 | 316 footnotes (à renuméroter en fin) |

**Outils en place** :
- `manuscrit-v4/_import-v2/` : MD brut + MD accepté + annotations + script Python de découpage
- `manuscrit-v4/_MAPPING.md` : trace V2 → V4 section par section
- `manuscrit-v4/compile.sh` : compilation Pandoc → `Livre/docx/Capitalisons-V4.docx` (testé OK, 160 Ko)
- `_factcheck-v4-journal.md` (à créer) : journal du fact-check phrase par phrase

**Fact-check phrase par phrase — démarré 29 mai 2026 soir** :

- **11 paragraphes traités** sur 15 dans l'avant-propos (§1 Doliprane → §11 chiffres pays par pays)
- **22 corrections appliquées** au corps : 2 🔴 majeures (chiffre 8 → 16/10 Md€ Doliprane ; « fonds de pension étrangers » → « capitaux étrangers ») + 20 ⚠️ mineures (précisions sources, dates, formulations)
- **5 footnotes mises à jour** : [^1] Ardian 170→176 Md$ + ABP 552→533 Md€ ; [^3] précisions loi 2002-73 ; [^6] clarification dates Vinci 2021/2025
- **2 footnotes ajoutées** : [^372] CalPERS *anchor investor* CD&R Fund XI ; [^373] Bercy accord tripartite Sanofi-CD&R-État 21 oct. 2024
- **Style préservé**, longueur des paragraphes quasi identique. Aucune réécriture stylistique.

**Détail des corrections** : voir `_factcheck-journal.md`.

**Méthode validée** : 1 paragraphe par tour de conversation, tableau verdict ✅/⚠️/🔴 + source primaire + reformulation pour 🔴 et ⚠️ critiques, validation explicite avant passage au suivant. Footnotes associées vérifiées en parallèle (à la demande de l'auteur, 29 mai 2026).

**À reprendre dans une nouvelle session** :
1. **Avant-propos §12-15** restants : §12 graphique (rien à fact-checker), §13 conclusion §11, §14 « Pendant trente ans… », §15 phrase finale
2. **Puis introduction** : §0.1 « Les Français sont prêts » (5 sondages d'opinion cités, footnotes [^367]-[^371] à vérifier), §0.2 RAFP (12 footnotes [^318]-[^341] à vérifier en finesse), §0.3 « Trois chiffres », §0.4 « La grande illusion », §0.5 « L'objectif du livre », §0.6 « Plan de l'ouvrage »
3. **Puis P1 → P2 → P3** dans l'ordre prévu
4. **Conclusion** (4 verrous + dynamique « cette fois c'est différent »)
5. **Appendice** (Q.1 à Q.6, à fact-checker fin de parcours)

**Estimation restant** : ~15-20 sessions interactives au rythme actuel (1 paragraphe par tour, validation utilisateur entre chaque).

**Mot d'ordre de reprise nouvelle conv** : « On reprend le fact-check de *Capitalisons*. Lis `Livre/JOURNAL.md` et `Livre/_factcheck-journal.md`. On enchaîne sur §12 de l'avant-propos. »

---

**Nettoyage versioning — 29 mai 2026 soir** :

Toutes les anciennes versions ont été archivées dans `Livre/_archive/`. La nouvelle structure est plate et claire :

```
Livre/
├── Capitalisons - v2.docx          (DOCX source d'Emmanuel, 498 Ko, inchangé)
├── JOURNAL.md                       (pilotage actif — ce fichier)
├── _factcheck-journal.md            (suivi fact-check phrase par phrase)
├── manuscrit/                       (SOURCE DE VÉRITÉ MD — l'unique version active)
│   ├── 00-avant-propos.md
│   ├── 01-introduction.md
│   ├── 02-partie1-capi-repond.md
│   ├── 03-partie2-fonds-pension.md
│   ├── 04-partie3-feuille-route.md
│   ├── 05-conclusion.md
│   ├── 07-appendice-cinq-mensonges.md
│   ├── 99-footnotes.md
│   ├── _MAPPING.md                  (traçabilité V2 → architecture actuelle)
│   ├── _import-v2/                  (artefacts de conversion DOCX V2, gardés en référence)
│   ├── compile.sh                   (Pandoc → Capitalisons.docx)
│   ├── metadata.yaml
│   └── recherche/                   (74 fichiers de matière sourcée par les agents)
├── docx/
│   ├── Capitalisons.docx            (compilation actuelle, 187 Ko)
│   └── _archive-backups-emmanuel/   (backups antérieurs d'Emmanuel, intacts)
└── _archive/                        (tout l'ancien, rollback toujours possible)
    ├── manuscrit-v1/                (ancienne V1 mai 2026)
    ├── manuscrit-v3/                (ancienne V3 mai 2026)
    ├── docx-anciens/                (13 DOCX antérieurs)
    ├── _diagnostic-redites-v2.md
    ├── _revue-critique-v2.md
    └── _factcheck-v3-journal.md
```

**Avant le nettoyage** : 3 manuscrits MD (v1, v3, v4) + 14 DOCX + journaux v3/v4 + fichiers diagnostic épars. **Après** : 1 manuscrit, 1 DOCX, 2 journaux. 2,5 Mo de `_xml-raw` (décompression DOCX) supprimés. Tout le reste archivé sans perte.

**Convention** : « manuscrit/ » est la source de vérité unique. Toute modification du livre passe par les .md de ce dossier. Le DOCX est régénéré via `./compile.sh`.

Commit de référence avant nettoyage : `d03b405`.

---

**Restructuration architecturale V5 — TERMINÉE 29 mai 2026 nuit** :

Architecture finale équilibrée selon dynamique « individu → collectif → action » + RAFP en intro pour désamorcer l'opposition + verrous historiques en conclusion :

- **Introduction (6 sous-sections, 3 007 mots)** : Doliprane / Français prêts / **RAFP** (déplacé depuis P1 §1.9) / Trois chiffres / Grande illusion / Objectif / Plan
- **P1 — La capitalisation répond aux problèmes du système (6 sous-sections, 9 451 mots)** : Le système actuel est dans une impasse (fusion vieillissement + déficit + comment on en est arrivé là) / Ces réformes paramétriques qui n'en sont pas / C'est Nicolas qui paie / Comprendre la capitalisation (+ rappel RAFP) / Cotiser moins pour gagner plus / Ce que ça change pour le système
- **P2 — La capitalisation permet d'avoir des fonds de pension (4 sous-sections, 11 644 mots)** : Qu'est-ce qu'un fonds de pension ? À quoi ça sert ? Les trois familles (pédagogie en tête + rappel RAFP) / Le capital qui nous échappe (fusion Norvège/ABP/CPPIB + 6 000 Md€) / La vague des cessions silencieuses (fusion 240 k entreprises + hold-up silencieux) / Si la France avait des fonds de pension (fusion modélisation + alléger dépenses + cercle vertueux)
- **P3 — Comment on y arrive (4 sous-sections, 15 548 mots)** : Quatre trajectoires Suède/Australie/Singapour/Chili (+ leçons par pays) / Les enjeux à arbitrer / La méthode politique (incluant agenda 2027-2052) / La transition (fonds de transition modèle suédois)
- **Conclusion enrichie (2 306 mots)** : 4 verrous historiques (extraits de P3) + Pourquoi cette fois c'est différent + 3 bénéfices + Choisir, enfin

**Stats V5** : 46 565 mots corps + 17 736 mots footnotes (371 footnotes au total). **~140 pages avec footnotes en pied de page**. Légèrement sous cible 150 p. — enrichissements possibles en avant-propos (890→1 500) et autres sections sous-dotées.

**Architecture équilibrée** : 6/6/4/4 sous-sections sur Intro/P1/P2/P3. Dynamique narrative : individu (P1) → collectif (P2) → action (P3) → bilan des verrous + choix (conclusion).

Commit git de référence V4 enrichie (avant restructuration) : `acb9dd1`.

---

**Phase 1 (rédaction des sections nouvelles) — TERMINÉE le 29 mai 2026 soirée** :

- ✅ **§1.9 RAFP** rédigé (~1 800 mots, 24 footnotes [^318]-[^341]) — matière `manuscrit/recherche/ch1-rafp-matiere.md`
- ✅ **§2.7 cercle vertueux** rédigé (~600 mots, 3 footnotes [^342]-[^344])
- ✅ **§3.8 enrichi — 4 verrous historiques** rédigé (~1 100 mots, 12 footnotes [^345]-[^356]) — matière `manuscrit/recherche/ch3-sondages-4raisons.md`
- ✅ **§3.9 enrichi — fonds de transition modèle suédois** rédigé (~1 400 mots, 10 footnotes [^357]-[^366]) — matière `manuscrit/recherche/ch3-fonds-transition-suede-frr.md`
- ✅ **Introduction réécrite** avec §0.1 « Les Français sont prêts » + plan d'ouvrage 3 parties (5 footnotes [^367]-[^371])
- ✅ DOCX `Capitalisons-V4.docx` recompilé (186 Ko)

**Stats V4 au 29 mai soir** :

| Fichier | Mots V4 | Variation |
|---------|---------|-----------|
| 00-avant-propos | 890 | inchangé |
| 01-introduction | 2 186 | +865 (réécriture) |
| 02-partie1-capi-repond | 10 852 | +1 512 (§1.9 RAFP) |
| 03-partie2-fonds-pension | 10 762 | +727 (§2.7 cercle vertueux) |
| 04-partie3-feuille-route | 16 658 | +2 496 (§3.8 + §3.9) |
| 05-conclusion | 521 | inchangé |
| 07-appendice | 3 719 | inchangé |
| **Total contenu** | **45 588** | **+5 488 mots** |
| 99-footnotes | 17 736 | +54 footnotes (371 au total) |

Volume = **~137 pages** (dans la fourchette cible 120-150 p.).

**À reprendre au prochain démarrage** (priorité 1) :
1. **Validation utilisateur** des 5 sections rédigées en Phase 1 (lire DOCX dans Word ou MD source)
2. **Phase 2 — Audit et actualisation des chiffres** (autonome) : extraction de tous les chiffres-pivots, confrontation aux sources primaires 2024-2025, mise à jour ciblée
3. **Phase 3 — Fact-check phrase par phrase** (interactif, 15-24 sessions) : ordre P1 → P2 → P3 → intro → avant-propos → appendice → conclusion. Mode 1 paragraphe / tour, validation utilisateur entre chaque.

**Mot d'ordre de reprise** : « On reprend *Capitalisons V4*. Lis `Livre/JOURNAL.md` et `Livre/manuscrit-v4/_MAPPING.md`. »

---

## État précédent — 16 mai 2026 (fin de session, pause utilisateur)

**Phase** : Ch.1, Ch.2, Ch.3 rédigés et validés (DOCX prêts). Recherche Ch.4 complète. Fact-check préalable Ch.4 interrompu par la pause.

**Statut des chapitres rédigés** :
- **Ch.1** — DOCX validé `02-ch1-systeme-bout-de-souffle.docx` (11 014 mots, version E modifiée par auteur 14/05 + commentaires Word)
- **Ch.2** — DOCX restructuré `03-ch2-comprendre-capitalisation.docx` (5 sections, ~7 000 mots, 3 commentaires Word préservés dans backup `-AVANT-RESTRUCTURE-avec-commentaires.docx`)
- **Ch.3** — DOCX restructuré `04-ch3-capital-absent-hold-up.docx` (6 sections finales, 10 723 mots, 41 Ko). Titre : « De la nécessité de fonds de pension français ». Backup auteur : `-AVANT-CONDENSATION-avec-markups-emmanuel.docx`

**Décisions architecturales du 16 mai** :
- Livre passé de 7 chapitres à **6 chapitres + manifeste**
- Ex-Ch.4 (Mirage solitude) + Ex-Ch.5 (Suède) **fusionnés** en nouveau Ch.4 « Quatre modèles, une boussole »
- Ex-Ch.6 (Cinq mensonges Q/R) devient Ch.5
- Ex-Ch.7 (Vingt-cinq ans) devient Ch.6
- Ch.4 retient **4 pays** : Suède + Australie + Singapour + Chili (contre-exemple), pas de panorama exhaustif
- Chaque cas doit inclure un **contexte historico-politique** (acteurs, opposition vaincue, pacte transpartisan)

**Recherche Ch.4 (54 300 mots, complète)** :
- Suède : 3 fichiers préexistants `ch5-*.md` (15 561 mots)
- Australie : 3 fichiers `ch4-australie-*.md` (institutionnel + académique + presse, ~11 000 mots)
- Singapour : 3 fichiers `ch4-singapour-*.md` (13 438 mots)
- Chili : 3 fichiers `ch4-chili-*.md` (14 302 mots)

**À reprendre au prochain démarrage** (priorité 1) :
1. **Relancer le fact-check préalable Ch.4** (interrompu) — il devait produire `ch4-FACT-CHECK.md`. Le brief est dans le PLAN-REVISE et dans la session précédente, à reformuler.
2. Lancer la rédaction Ch.4 avec brief contexte historico-politique fort
3. Fact-check post-rédaction croisé (chiffres + sources)
4. Compilation DOCX
5. Validation utilisateur

**Cible Ch.4** : ~5 000 mots final (≈ 18 pages), 5 sections (4.1 Suède / 4.2 Australie / 4.3 Singapour / 4.4 Chili / 4.5 Quatre leçons pour la France).

**Mot d'ordre de reprise** : « On reprend *Capitalisons*. Lis `Livre/JOURNAL.md`. »

---

## État précédent — 15 mai 2026

**Phase** : Ch.1 et Ch.2 finalisés en version 1 (validation auteur en cours). Prochaine étape : Ch.3 « Le capital absent et le hold-up silencieux » (20 p., fusion ex-Ch.2 + ex-Ch.4).

**Statut des chapitres rédigés** :
- **Ch.1** — Version E retenue (modifiée par Emmanuel dans Word le 14 mai vers 22:42, contient 3 commentaires Word). Le DOCX `Livre/docx/02-ch1-systeme-bout-de-souffle.docx` est la **source de vérité** ; le MD `manuscrit/02-ch1-systeme-bout-de-souffle.md` est régénéré depuis le DOCX (8 516 mots, 104 footnotes au format `[^N]` réindexé par Pandoc — pas `[^c1.X]`). Versions A/B/C/D + test-ton supprimées (MD et DOCX).
- **Ch.2** — Rédigé par agent le 14 mai (10 807 mots, 63 notes `[^c2.X]`). Relu et modifié par Emmanuel dans Word le 15 mai matin (3 commentaires Word ajoutés, placeholders graphiques insérés, anecdote HEC). MD régénéré depuis le DOCX modifié, puis **restructuré le 15 mai** :
  - Fusion §5 « Rendement composé pour les nuls » dans §2 « Anatomie d'un euro cotisé »
  - Suppression complète des §7 (marchés/krachs) et §8 (Enron/Madoff) — déportés vers Ch.6 en format Q/R
  - Résultat final : **5 sections, ~7 000 mots, 44 footnotes** (`[^1]` à `[^44]` après Pandoc reindex)
  - DOCX original `03-ch2-comprendre-capitalisation.docx` **non régénéré** pour préserver les 3 commentaires Word d'Emmanuel.

**Décisions du 15 mai** :
- Plan Ch.6 reformulé en **format Q/R** explicite (6 Q/R, dont nouvelle Q.2 sur Enron/Madoff/Detroit déportée du Ch.2). Voir PLAN-REVISE.md à jour.
- DOCX = source de vérité pour Ch.1 et Ch.2 ; les MD sont régénérés à partir des DOCX modifiés. Conséquence : `compile.sh` ne reconstruira pas le livre intégralement à partir des MD — il faudra revisiter le pipeline plus tard.

**3 commentaires Word à traiter ultérieurement (Ch.2)** :
1. Cotisations URSSAF (passage « 100 €/42 € ») : chiffres irréalistes, recalculer (≈ 750-800 €/mois total pour salaire 35 k€/an).
2. « dizaines » → « centaines de milliers d'euros » pour comptes ABP/AustralianSuper à mi-carrière (à vérifier).
3. Phrase « Livret A 2,5 % + inflation 2 % = on perd en termes réels » → erreur logique de l'agent, à reformuler.

**En cours en arrière-plan** : agent d'audit éditorial d'ensemble (sortie attendue : `manuscrit/AUDIT-COHERENCE.md`).

**Matière générationnelle disponible** dans `manuscrit/recherche/` :
- `gen-rendement-cohortes.md` (5 347 mots) — taux de rendement implicite par cohorte
- `gen-patrimoine-generations.md` (5 735 mots) — patrimoine, accession propriété, dette publique léguée
- `gen-pensions-projection-cohortes.md` (4 590 mots) — projections pension par cohorte
- `gen-recit-perception-jeunes.md` (3 771 mots) — sondages, citations, témoignages, anecdotes

---

## Fondamentaux validés

### Projet
- **Titre** : *Capitalisons. La France et son capital absent*
- **Format** : essai économique grand public, 120 pages, sourçage absolu (Pandoc footnotes)
- **Thèse** : la France doit instaurer une culture de l'investissement et adjoindre un pilier capitalisé à la répartition (pas remplacer)
- **Fil rouge principal** : culture de l'investissement
- **Fil transversal complémentaire** : inégalité intergénérationnelle (les jeunes paieront plus, toucheront moins)

### Structure (validée — v3 après restructuration mai 2026)
7 chapitres + avant-propos + introduction + manifeste (voir `manuscrit/PLAN-REVISE.md`) :
1. Avant-propos — Le paradoxe Doliprane (10 p., écrit)
2. Introduction — L'angle mort (10 p., écrit)
3. **Ch.1** — Anatomie d'un système à bout de souffle (15 p., en cours — drafts A-E + corrections auteur)
4. **Ch.2** — Comprendre la capitalisation (13 p., NOUVEAU — pédagogie + modélisation personnelle)
5. **Ch.3** — Le capital absent et le hold-up silencieux (20 p., FUSION ex-Ch.2 + ex-Ch.4 — argument souveraineté)
6. **Ch.4** — Le mirage de la solitude française (10 p., panorama international)
7. **Ch.5** — La Suède : la preuve par neuf (8 p.)
8. **Ch.6** — Cinq mensonges qui ont coûté trente ans (16 p.)
9. **Ch.7** — Vingt-cinq ans pour basculer (11 p., inclut synthèse impact macro)
10. Manifeste — Douze propositions (3 p.)

**Total : 116 pages** (cible 120, marge 4 p.).

**Logique narrative** : pourquoi ça ne tient plus → voici l'alternative et ce qu'elle vous rapporte → pourquoi c'est urgent au-delà des retraites (souveraineté) → et tous les autres l'ont fait → la preuve par la Suède → démontage des cinq mensonges → feuille de route et bénéfices macro → manifeste.

### Méthode de recherche (validée, voir `manuscrit/METHODE.md`)
Pour chaque chapitre :
- 6-10 agents en parallèle sur 8 angles (officiel, académique, experts haute FP, think tanks, presse, international, histoire, chiffres concurrents)
- Cahier des controverses (`ch[N]-controverses.md`) produit avant rédaction
- Sources primaires vérifiées via WebFetch
- Rédaction par Claude principal (pas par agent)
- Fact-checker en aval (agent dédié, `ch[N]-factcheck.md`)
- Corrections appliquées, validation utilisateur

### Charte stylistique (validée, voir `manuscrit/CHARTE-STYLE.md`)
- Ton essai engagé, pas synthèse de rapport
- Parti pris dès la première ligne
- Raisonnement orienté (récit officiel → démolition → conclusion)
- Phrases moyennes-longues par défaut, courtes pour pivots (1-2 par section max)
- Fil capitalisation tissé en continu, pas en conclusion plaquée
- Anti-tics : pas d'anaphore mécanique « Voilà ce que… », pas d'adresse fréquente au lecteur (« Traduisons »), pas de phrases nominales saccadées, pas de punchlines symétriques trop équilibrées
- Chiffres importants en lettres, tirets pour précisions, « nous » inclusif

---

## État chapitre par chapitre

| Chapitre | Recherche | Cahier controverses | Draft | Fact-check | Validation |
|----------|-----------|---------------------|-------|------------|------------|
| Avant-propos | — | — | ✓ écrit par l'auteur | — | ✓ |
| Introduction | — | — | ✓ écrit par l'auteur | — | ✓ |
| Ch.1 — Système à bout de souffle | ✓ 19 fichiers (~120k mots) | ✓ `ch1-controverses.md` | ✓ Version E modifiée par auteur (DOCX 14/05 22:42 + 3 commentaires Word) | ✓ `ch1-factcheck.md` (sur C) | En cours (audit cohérence 15/05) |
| Ch.2 — Comprendre la capitalisation | ✓ 3 fichiers Ch.2 + modélisation Python validée | — | ✓ Rédigé 14/05 + restructuré 15/05 (5 sections, 7k mots, 3 commentaires Word) | ✓ `ch2-FACT-CHECK.md` (62 affirmations vérifiées, corrections appliquées) | En cours (audit cohérence 15/05) |
| Ch.3 — Capital absent + hold-up silencieux (fusion) | ✓ 6 fichiers (~28k mots) | À produire | À venir | À venir | — |
| Ch.4 — Mirage solitude française | ✓ 3 fichiers (~14k mots) | À produire | À venir | À venir | — |
| Ch.5 — Suède | ✓ 3 fichiers (~15k mots) | À produire | À venir | À venir | — |
| Ch.6 — Cinq mensonges (Q/R) | À lancer | À produire | À venir (format Q/R, 6 objections incluant Enron/Madoff/Detroit déportés du Ch.2) | À venir | — |
| Ch.7 — Vingt-cinq ans pour basculer | À lancer | À produire | À venir | À venir | — |
| Manifeste | À lancer | — | À venir | — | — |
| Angle générationnel transversal | ✓ 4 fichiers (~19k mots) | — | Présent dans Ch.1 ; à tisser dans Ch.3-Ch.7 | — | — |

---

## Fichiers de référence à connaître

Dans `Livre/manuscrit/` :
- `PLAN-REVISE.md` — plan détaillé 8 chapitres + sections
- `CHARTE-STYLE.md` — règles stylistiques (12 règles non négociables)
- `METHODE.md` — méthode de recherche multi-agents
- `STYLE.md` — conventions de rédaction (Pandoc, footnotes, etc.)
- `bibliographie.md` — bibliographie centralisée
- `metadata.yaml` — métadonnées Pandoc
- `compile.sh` — script de compilation Pandoc → DOCX

Drafts écrits :
- `00-avant-propos.md` — Doliprane (validé)
- `01-introduction.md` — L'angle mort (validé)
- **`02-ch1-systeme-bout-de-souffle.md`** — Version E retenue, MD régénéré depuis DOCX modifié par Emmanuel (8 516 mots, 104 footnotes). Versions A/B/C/D + test-ton supprimées.
- **`03-ch2-comprendre-capitalisation.md`** — Restructuré 15/05 (5 sections, ~7 000 mots, 44 footnotes). DOCX source : `Livre/docx/03-ch2-comprendre-capitalisation.docx` avec 3 commentaires Word.

DOCX (source de vérité pour Ch.1-Ch.2) :
- `Livre/docx/00-avant-propos.docx`
- `Livre/docx/01-introduction.docx`
- `Livre/docx/02-ch1-systeme-bout-de-souffle.docx` (14/05 22:42 + commentaires Word)
- `Livre/docx/03-ch2-comprendre-capitalisation.docx` (15/05 12:06 + 3 commentaires Word préservés)

Modélisation Python validée (Ch.2) :
- `Livre/manuscrit/modelisation/ch2_modelisation.py` — script reproductible (formule annuité croissante vérifiée à 0,0000 %)
- `Livre/manuscrit/modelisation/ch2_resultats.csv` — 3 scénarios centraux
- `Livre/manuscrit/modelisation/ch2_sensibilite.csv` — 72 lignes de variantes
- `Livre/manuscrit/modelisation/ch2_courbes.png` — graphique 300 dpi charte OVLA
- `Livre/manuscrit/modelisation/ch2_rapport_modelisation.md` — fiche méthodo complète

Recherche déposée dans `manuscrit/recherche/` :
- Ch.1 : 8 fichiers angles + factcheck + controverses
- Ch.2 : 3 fichiers
- Ch.3 : 3 fichiers
- Ch.5 : 3 fichiers
- Style : 4 fichiers d'analyse
- Génération : 4 fichiers (en cours)

---

## Décisions clés à se rappeler

1. **Ton** : engagé, parti pris dès la première ligne, raisonnement orienté. Référence = avant-propos Doliprane de l'auteur. Pas Marguerite Duras (pas de phrases nominales saccadées). Pas de rapport de synthèse non plus.

2. **Plan** : 8 chapitres, 120 pages, fil rouge culture investissement + fil transversal générationnel.

3. **Méthode** : multi-agents, cahier des controverses, sources primaires WebFetch, fact-checker en aval. Toutes les étapes obligatoires.

4. **Validation** : chapitre par chapitre. Pas d'anticipation. On valide Ch.1 D avant d'attaquer Ch.2.

5. **Sources primaires** : tu insistes sur la vérification réelle, pas la synthèse de synthèse. Si on doit lire un PDF du COR, on télécharge le PDF. Si on doit lire Beaufret, on lit Beaufret. Pas d'agent qui résume sans lire.

6. **Anti-modèles** :
   - Rapport de synthèse impartial qui aligne les positions adverses
   - Phrases nominales saccadées « Cinq experts. Cinq chiffres. »
   - Anaphores mécaniques « Voilà ce que… Voilà ce que… »
   - Adresses au lecteur appuyées « Traduisons », « Il faut s'arrêter ici »
   - Punchlines symétriques trop équilibrées
   - Conclusion qui plaque la capitalisation sans la tisser dans le raisonnement
   - Oubli de l'angle générationnel
   - Construction stéréotypée « Pour un pays de X habitants, c'est Y »
   - « C'est, dans les mots mêmes de X » / « Pour qui sait le lire » / « À la lettre »
   - Re-formulation post-chiffre « Ce que cela signifie est simple : … »
   - Adjectifs ternaires mécaniques

7. **Sources à éviter** (parce qu'elles défendent la répartition pure et ne porteront pas le plaidoyer) :
   - OFCE Sterdyniak, Périvier, Le Garrec, Coquet (hétérodoxie keynésienne)
   - Économistes Atterrés (Lordon, Chavagneux)
   - Presse de gauche : *Mediapart*, *Alternatives Économiques*, *Le Monde diplomatique*, *L'Humanité*, *Politis*
   - Sociologues anti-capitalisation systématiques

8. **Sources à privilégier** :
   - **International** : OCDE *Pensions at a Glance* et *Pension Markets in Focus*, FMI *Article IV France*, BCE *Ageing Working Group*, Mercer CFA *Global Pension Index*, Allianz *Global Pension Report*, Thinking Ahead Institute *Global Pension Assets Study*, IFS (Royaume-Uni), Brookings, Wharton Pension Research Council, Boston College CRR, CEPR, Bruegel, CESifo
   - **Économistes techniques français** : Antoine Bozio (IPP), Pierre Cahuc, Christian Saint-Étienne, Patrick Artus, Jean Pisani-Ferry, Jean-Hervé Lorenzi, Élie Cohen, Thomas Philippon
   - **Think tanks pro-réforme** : Fondapol (Martinot, Beaufret), IFRAP (Verdier-Molinié), Institut Montaigne, Institut Sapiens, Cercle de l'Épargne, Cercle des économistes
   - **Travaux historiques** : Pierre-Cyrille Hautcœur (PSE), Bruno Palier (Sciences Po), Bertrand Valat (COR)
   - **Presse économique** : *Les Échos*, *Le Figaro Économie*, *Capital*, *Challenges*, *L'Express*, *Le Point*, *Investir*, *Le Revenu* — *The Economist*, *FT*, *WSJ*, *Bloomberg*, *Reuters*
   - **Sources pays comparés** : Pensionsmyndigheten + AP-fonderna (Suède), ABP/PFZW (NL), NEST/Pensions Regulator (UK), CPPIB/CDPQ (Canada), APRA (Australie), BMAS (Allemagne)

---

## Protocole de reprise (à suivre à chaque nouvelle session)

1. Tu dis à Claude : « On reprend *Capitalisons*. Lis `Livre/JOURNAL.md`. »
2. Claude lit ce fichier + `PLAN-REVISE.md` + `CHARTE-STYLE.md` + `METHODE.md`.
3. Claude récapitule l'état actuel (chapitre en cours, prochaine étape).
4. Tu valides ou tu rediriges.
5. À la fin de la session, **Claude met à jour ce fichier** avec :
   - Nouveau « État actuel » (la date, l'étape en cours)
   - Nouveau « En cours en arrière-plan » si pertinent
   - Tableau « État chapitre par chapitre » à jour
   - Décisions nouvelles à se rappeler

---

## Historique des décisions importantes

### 14 mai 2026 — Session 1
- Plan révisé v2 validé (8 chapitres + manifeste, ajout d'un chapitre dédié Suède)
- Méthode multi-agents formalisée après diagnostic d'erreurs factuelles dans drafts A et B
- 8 vagues d'agents lancées pour Ch.1 et chapitres suivants (~54k mots collectés sur Ch.1, ~14k sur Ch.2, Ch.3, Ch.5)
- Controverse Beaufret identifiée comme angle mort des agents → ajoutée en force dans le draft C
- Plan v3 validé (fusion ex-Ch.2 + ex-Ch.4 en Ch.3 hold-up, ajout Ch.2 pédagogie+modélisation)
- Ch.2 rédigé par agent : 10 807 mots, 63 notes `[^c2.X]`, modélisation Python validée à 0,0000 %
- Emmanuel modifie le Ch.1 (version E) puis le Ch.2 dans Word (~21:00 puis matin 15/05)

### 15 mai 2026 — Session 2
- **Tri des versions** : Ch.1 versions A/B/C/D + test-ton supprimées (MD + DOCX). Version E renommée canonique. DOCX = source de vérité (commentaires Word préservés).
- **Récupération modifications Word** : DOCX Ch.1 → MD régénéré (104 notes Pandoc-reindexées). DOCX Ch.2 → MD régénéré avec extraction des 3 commentaires Word (cotisations URSSAF irréalistes, dizaines→centaines, formulation Livret A logiquement fausse).
- **Restructuration Ch.2** : §5 Rendement composé fusionné dans §2 Anatomie d'un euro cotisé. §7 Marchés/krachs + §8 Enron/Madoff entièrement supprimés et déportés vers Ch.6. Résultat : 5 sections, ~7 000 mots, 44 footnotes.
- **Plan Ch.6 reformulé en format Q/R** : 6 questions/réponses (objections), avec ajout d'une Q « Enron/Madoff/Detroit » récupérée du Ch.2 déporté. PLAN-REVISE.md mis à jour.
- **Audit cohérence d'ensemble** lancé en arrière-plan (sortie : `manuscrit/AUDIT-COHERENCE.md`).
- Décision architecture : DOCX = source de vérité pour Ch.1-Ch.2, MD = miroir régénéré. Pipeline `compile.sh` à revisiter avant compilation finale du livre.
- Fact-checker dédié validé comme étape obligatoire après chaque draft
- Ton « synthèse de rapport » du draft C rejeté → charte stylistique formalisée à partir de 30 essais analysés (sans accès au texte intégral pour la plupart) puis recalibrée sur l'avant-propos Doliprane de l'auteur
- Test 1.2 « parti pris engagé » validé (« Le déficit qu'on n'a pas le droit de dire »)
- Angle générationnel transversal validé comme fil complémentaire → 4 agents lancés

---

## Prochaine étape (à exécuter à la prochaine session)

1. Vérifier l'arrivée des 4 fichiers `gen-*.md` (angle générationnel)
2. Lire les fichiers, consolider en un mini-cahier
3. Rédiger le **draft D du Ch.1** en appliquant :
   - Ton du test 1.2 validé (parti pris engagé)
   - Charte stylistique
   - Fil transversal générationnel intégré (pas section dédiée)
   - Sourçage strict
4. Lancer le fact-checker
5. Corriger les divergences
6. Compiler en DOCX
7. Validation par l'utilisateur
8. Passer au Ch.2

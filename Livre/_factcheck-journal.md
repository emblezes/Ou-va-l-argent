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
| 00-avant-propos.md | 0 | 0 | 0 | 0 | Non démarré |
| 01-introduction.md | 0 | 0 | 0 | 0 | En attente réécriture |
| 02-partie1-capi-repond.md | 0 | 0 | 0 | 0 | Non démarré (priorité 1) |
| 03-partie2-fonds-pension.md | 0 | 0 | 0 | 0 | Non démarré |
| 04-partie3-feuille-route.md | 0 | 0 | 0 | 0 | Non démarré |
| 05-conclusion.md | 0 | 0 | 0 | 0 | Non démarré |
| 07-appendice-cinq-mensonges.md | 0 | 0 | 0 | 0 | Non démarré |

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

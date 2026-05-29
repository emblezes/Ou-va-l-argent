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

**Résultat** : 5 corrections appliquées (1 🔴 + 4 ⚠️). Ajout footnote [^372] (CalPERS source CD&R Fund XI). Style préservé, longueur de paragraphe quasi identique.

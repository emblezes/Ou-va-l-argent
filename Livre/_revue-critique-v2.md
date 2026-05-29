# Revue critique — *Capitalisons*, version 2

**Date** : 24 mai 2026
**Périmètre** : `Capitalisons - v2.docx` lu intégralement (≈ 55 000 mots).
**Posture** : lecture par-dessus l'épaule d'un éditeur. Du plus grave au plus mineur.

---

## A. Problèmes structurels (à régler en priorité)

### A.1. La Partie 5 est cassée : numérotation incohérente et architecture parallèle qui se télescope

C'est le bric-à-brac le plus visible.

- Le titre « Partie 5 - » apparaît seul, sans énoncé, puis « Vers la capitalisation : la réforme qui n'a jamais été faite » est un Heading 1 distinct dessous. Visuellement, on a deux titres successifs.
- Sous « Les enjeux à lever », on trouve **5.1, 5.2, 5.3, 5.4, 5.5** énoncés en texte courant (pas en Heading) — ce sont des sous-sections invisibles à la TOC.
- Vient ensuite **« Section B - La méthode politique »** qui contient **5.6, 5.7, 5.8** — alors que la Section A n'a jamais été nommée.
- Puis **« Section C - L'agenda 2027-2052 en quatre phases »** contient les propositions 1 à 12, regroupées en quatre phases dont seule la « Phase 4 - Maturation » est en Heading 3, les phases 1, 2, 3 étant en paragraphes.

**Conséquences** :
1. Le lecteur perd le fil hiérarchique.
2. La TOC fait coexister « Les enjeux à lever », « Section B », « Section C », « Phase 4 », « Ce que le système atteint en 2052 » au même rang — illisible.
3. La numérotation 5.x continue après la fin de la Section A, ce qui est bancal logiquement.

**Recommandation** :
Refondre la Partie 5 en **trois chapitres distincts** avec hiérarchie homogène :

```
Partie 5 — Vers la capitalisation : la réforme qui n'a jamais été faite
  Chapitre 5.1 — Les cinq enjeux à arbitrer
     5.1.1 Temporalité
     5.1.2 Double paiement
     5.1.3 Segmentation
     5.1.4 Acceptabilité sociale
     5.1.5 Juridique et constitutionnel
  Chapitre 5.2 — La méthode politique : deux voies viables
     5.2.1 Voie A — La concertation longue
     5.2.2 Voie B — La rapidité négociée
     5.2.3 La voie à éviter — Le précédent chilien
     5.2.4 La gouvernance institutionnelle
     5.2.5 Les conditions de réussite politique
  Chapitre 5.3 — L'agenda 2027-2052 en quatre phases
     Phase 1 — Préparation (Propositions 1 à 3)
     Phase 2 — Lancement (Propositions 4 à 7)
     Phase 3 — Déploiement (Propositions 8 à 10)
     Phase 4 — Maturation (Propositions 11 à 12)
```

Et **supprimer toute mention de « Section A / B / C »** : c'est un vestige de l'ancienne structure.

---

### A.2. La numérotation des Parties est inconsistante

- « Partie I » (chiffres romains)
- « Partie 2 », « Partie 3 », « Partie 4 », « Partie 5 » (chiffres arabes)

Choisir l'un ou l'autre. Recommandation : **arabes partout** (« Partie 1, 2, 3, 4, 5 »), aligné sur l'usage essai grand public.

---

### A.3. Le « Manifeste » est annoncé mais absent

L'avant-propos parle d'**un** manifeste, l'appendice s'ouvre par *« Le Manifeste qui précède pose un programme »*, la conclusion finale dit *« C'est ce qu'a posé le Manifeste »* — mais **aucune section du livre ne porte ce nom**. L'« agenda 2027-2052 en quatre phases » fait office de manifeste de fait, mais il n'est jamais nommé ainsi.

**Recommandation** : soit renommer la Section C de la Partie 5 en **« Manifeste — Douze propositions »** (cohérent avec le plan révisé du `JOURNAL.md` du 16 mai qui prévoyait explicitement *« Manifeste : Douze propositions, 3 p. »*), soit corriger toutes les références au Manifeste par « les douze propositions » ou « l'agenda ». Le premier choix est plus fort éditorialement.

---

### A.4. Deux conclusions à deux endroits différents

- **Première conclusion** : « Conclusion - Choisir, enfin » à la fin de la Partie 5 (lignes 4100-4168).
- **Deuxième conclusion** : « Conclusion : la fenêtre est ouverte » à la fin de l'Appendice (lignes 4515-4599).

Les deux récapitulent à peu près la même chose (trois bénéfices, six mensonges désamorcés, « la fenêtre est ouverte »).

**Recommandation** : une seule conclusion, **après l'appendice**, qui fait office de chute du livre. Renommer la fin de la Partie 5 en **« Synthèse de la feuille de route »** ou **transition vers l'appendice** (3-4 paragraphes au lieu de 4 pages). Garder la conclusion finale comme épilogue éditorial du livre entier.

---

### A.5. Cinq mensonges qui en sont six : l'appendice se contredit lui-même

L'appendice s'intitule **« Cinq mensonges qui ont coûté trente ans »**.

Son texte d'ouverture cite quatre objections puis dit *« Cinq questions, donc, cinq réponses chiffrées »* — puis, deux paragraphes plus loin : *« Cinq, dit-on. À l'usage, ce sont six, et le sixième - Enron, Madoff, Detroit - vaut d'être traité à part ».*

Le contenu est bien composé de **six** Q/R (Q.1 à Q.6).

**Recommandation** :
- Soit titrer **« Six mensonges »** et supprimer toute la pirouette « cinq, dit-on, à l'usage six ».
- Soit fusionner Q.2 (Enron/Madoff/Detroit) dans Q.1 (« La bourse, c'est le casino ») pour ne garder que cinq Q/R. C'est faisable : les trois cas servent essentiellement à étayer l'objection « la bourse est risquée ».

La première option est plus simple et plus honnête.

---

### A.6. « L'objectif du livre » apparaît deux fois et annonce un plan en trois parties qui n'existe plus

Dans l'introduction, la section **« L'objectif du livre »** est dupliquée (titre H2 ligne 359 et 361, deux occurrences consécutives).

Le texte qui suit annonce un livre en **trois parties** :
- Partie 1 = Ch.1 (système à bout de souffle) + Ch.2 (comprendre la capitalisation)
- Partie 2 = Ch.3 (épargne mal allouée) + Ch.4 (cessions)
- Partie 3 = Ch.5 (international) + Ch.6 (feuille de route)

Or le livre v2 est en **cinq Parties** numérotées + appendice. L'annonce ne correspond plus au sommaire.

**Recommandation** :
1. Supprimer le doublon de titre.
2. Réécrire la section « L'objectif du livre » pour qu'elle annonce les **cinq parties** réelles. Par exemple :

   > **Partie 1.** Pourquoi le système actuel ne tient plus.
   > **Partie 2.** Ce qu'est, techniquement, la capitalisation, et ce qu'elle change pour un actif.
   > **Partie 3.** Pourquoi la France a besoin de fonds de pension (souveraineté, ETI, dividendes).
   > **Partie 4.** Ce que d'autres ont fait — Suède, Australie, Singapour, et l'erreur chilienne.
   > **Partie 5.** La feuille de route française : enjeux, méthode, agenda 2027-2052.
   > **Appendice.** Cinq (ou six) mensonges qui ont coûté trente ans.

---

## B. Doublons de contenu (à arbitrer)

### B.1. Doublons MAJEURS (déjà signalés dans `_diagnostic-redites-v2.md` + ceux que je remonte en plus)

| # | Contenu doublé | Localisation A | Localisation B | Sévérité | Recommandation |
|---|---|---|---|---|---|
| 1 | **« Trois familles dans le monde »** (GPFG, CDPQ, AP-fonds, CPPIB, ABP, PFZW, NEST, AustralianSuper) | Partie 3, §1 (lignes 1440-1538) | Partie 4 études de cas Suède + Australie + Singapour | 🔴 Majeure | Couper le §1 « Trois familles » de Partie 3 et ne garder qu'un paragraphe pivot (5-8 lignes) qui annonce la Partie 4 |
| 2 | **Les 6 leviers du double paiement** (FRR, eurobonds, CSG, AGIRC-ARRCO, cotisation patronale, sous-indexation) — **avec le même tableau** | Partie 5, 5.2 (3516-3526) | Appendice Q.4 (4379-4400) | 🔴 Majeure | Garder le développement Partie 5 (méthodique). Réduire Q.4 à 6 lignes qui renvoient au chapitre 5.2 |
| 3 | **PER 118,9 Md€ / 11,2 M titulaires / 10 600 €** | Partie 2 « Ce que la capitalisation n'est pas » (1207-1222) | Appendice Q.5 (4441-4448) | ⚠️ Moyenne | Acceptable : Partie 2 = définition, Q.5 = objection désamorcée. Couper les chiffres dans Q.5 et renvoyer |
| 4 | **5,2 % rendement réel actions sur 125 ans (Dimson Marsh Staunton)** | Partie 2 (1119-1129) | Appendice Q.1 (4213-4220) | ⚠️ Moyenne | Idem : garder Partie 2, alléger Q.1 |
| 5 | **Modélisation cas-type +228 k€/+457 k€** | Partie 2 (1314-1324) | Partie 3 ouverture (1576-1581) | ⚠️ Moyenne | Acceptable, c'est le pivot — mais s'assurer que la Partie 3 ne re-déroule pas le calcul, seulement la rappelle |
| 6 | **Sondage Odoxa 57 %** | Partie 1, fin §1.5 (922) | Partie 5, 5.4 (3596) + Appendice Q.3 (4343) | ⚠️ Moyenne | Trois mentions : c'est trop. Garder en Partie 1 (révélation) et en Partie 5 (acceptabilité). Couper de Q.3 |
| 7 | **AP7 / NEST / MySuper en chœur** | Partie 2 (1247), Partie 3 (1509), Partie 4 (Suède + Australie), Partie 5 (5.7), Appendice Q.1 et Q.5 | — | ⚠️ Moyenne | Effet de matraquage. À chaque mention, ne reprendre que le chiffre utile au point. Pas de re-définition à chaque fois |
| 8 | **50 % du CAC 40 aux non-résidents / 36 Md€ de dividendes** | Avant-propos, Intro (273), Partie 3 (2078-2088) | — | ⚠️ Moyenne | Avant-propos = teaser, Intro = chiffre central, Partie 3 = développement avec calcul. Garder la trinité mais alléger l'intro (8 lignes au lieu de 30) |
| 9 | **Description complète de l'épargne française mal allouée (fonds euros, livret A, dépôts à vue)** | Partie 2 (1188-1233 « Ce que la capitalisation n'est pas ») | Partie 3 (1614-1727 « Six mille milliards qui dorment ») | 🔴 Majeure | Couper la version Partie 2 (qui sert juste à dire « le PER n'est pas un fonds de pension », pas à raconter toute l'allocation française) et concentrer en Partie 3 |
| 10 | **Loi Thomas 1997 abrogée Jospin** | Avant-propos | Partie 5 5.4 (3617), 5.5 (3684-3686), Section C prop 2 (3895) | ⚠️ Moyenne | 4 mentions. Garder l'avant-propos (récit) et une mention en Partie 5 (méthodologique). Couper les deux autres |
| 11 | **Modélisation IAP 175 Md€ recettes / 700 Md€ PIB / 470 000 emplois** | Partie 3 fin (2473-2509) | — | ⚠️ Source à vérifier | « Institut pour l'Audace Politique » — vérifier que cette modélisation existe et qu'elle a été publiée. Si c'est l'institut auquel l'auteur appartient (cf. site OVLA), à signaler en footnote sans ambiguïté |
| 12 | **« 240 000 entreprises sans repreneur »** | Intro (282), Partie 3 (1795-1834), Partie 5 (3821), Conclusion | — | ✅ Acceptable | Fil rouge légitime |
| 13 | **Doliprane** | Avant-propos, Intro, Partie 3 (hold-up silencieux, premier cas développé) | — | ✅ Acceptable | Fil rouge fort, OK |
| 14 | **Mercer CFA Index** | Partie 1 (893), Partie 2 (1500), Partie 4 Singapour (2926), Appendice Q.2 (4294-4299) | — | ⚠️ Moyenne | Cohérence à vérifier : Partie 1 dit « 33e mondiale » et « grade B 70,3 » + « viabilité 49,0 » ; Appendice dit « grade B 70,3 » et « viabilité 48,6 ». **Divergence chiffrée** : 49,0 vs 48,6. À trancher |

### B.2. Conclusion à tirer

**Volume estimé à économiser sur les doublons** : 6-8 pages, sans rien perdre de la démonstration.

---

## C. Lourdeur et longueur

### C.1. La Partie 3 est obèse (≈ 33 % du livre)

Décomposition approximative :
- Partie 1 : ~580 lignes (15 %)
- Partie 2 : ~460 lignes (12 %)
- **Partie 3 : ~1 080 lignes (29 %)** ← problème
- Partie 4 : ~920 lignes (25 %)
- Partie 5 : ~670 lignes (18 %)

Pour un essai grand public, la Partie 3 est trop dense. Elle contient :
1. « Trois familles dans le monde » (à couper, cf. B.1.1)
2. « Six mille milliards qui dorment »
3. « 240 000 entreprises sans repreneur français »
4. « Le hold-up silencieux » (la galerie des cessions : Doliprane, Alstom, Photonis, Latécoère, Exxelia, Lafarge, Technip, Servier, Ingenico, SoLocal)
5. « Si la France avait des fonds de pension » (projection 1500 Md€)
6. Trois sous-sections macro : « Alléger les dépenses publiques », « Les recettes fiscales augmentent », « Le PIB croît »
7. Le cas-type Bernard (90 lignes)
8. Une « Décision politique, pas une fatalité » (conclusion)

**Problème éditorial** : le lecteur lit 30 pages d'affilée sur le même sujet (le capital absent). La Partie 3 est plus longue que les Parties 1 et 2 réunies.

**Recommandation** :
- **Couper « Trois familles dans le monde »** (B.1.1) — ~3 pages gagnées.
- **Déplacer les sous-sections macro « Alléger les dépenses / recettes fiscales / PIB croît » en fin de Partie 5** (ou en Conclusion). Elles décrivent les bénéfices systémiques d'un pilier capitalisé à maturité — leur place naturelle est avec la feuille de route, pas avec le diagnostic du capital absent. ~5 pages déplacées.
- **Resserrer la galerie des cessions** : 10 cas en Partie 3 « hold-up silencieux », c'est beaucoup. Garder 4-5 cas développés (Doliprane, Alstom Énergie, Photonis, Latécoère, Exxelia) et reléguer les autres en footnote-liste. Pour le rythme de lecture.
- **Cas-type Bernard** : excellent, mais arrive trop tard (après tout l'argumentaire). Le faire **monter au début de la Partie 3** pour incarner le problème avant de le quantifier.

**Gain visé** : Partie 3 ramenée à ~700 lignes (19 % du livre, équilibrée).

### C.2. La Partie 2 est trop courte au regard de son rôle pivot

3 sections seulement (Anatomie d'un euro / Ce que la capitalisation n'est pas / Cotiser moins pour gagner plus). Elle porte l'argument **central** du livre (la modélisation cas-type +228 k€). Mais on n'y reste pas assez longtemps.

**Recommandation** : ne pas allonger pour allonger, mais **ne pas couper davantage**. Au contraire, intégrer dans la Partie 2 la sous-section « Les cotisations sociales peuvent baisser » (qui flotte actuellement à la fin sans titre clair, lignes 1371-1400). Lui donner un H2 explicite : **« 2.4 — Cotiser moins, pour gagner plus à l'échelle nationale »**.

### C.3. Sections sans titre, sans contenu (fragments fantômes)

Lignes 1262, 1404-1412 : 4 à 5 occurrences de Headings vides (`##`, `###`, `###`, `###`, `###`). Probable artefact de copier-coller depuis les versions précédentes (anciennes sous-sections du Ch.2 supprimées mais dont les ancres sont restées).

**Recommandation** : nettoyer dans le DOCX (sélectionner les Headings vides, supprimer).

---

## D. Cohérence chiffrée à trancher

### D.1. Mercer CFA Index

- Partie 1 (ligne 893-900) : « 33e position mondiale… viabilité 49,0 »
- Appendice Q.2 (4294-4299) : « grade B, score global 70,3… adéquation 85,2 et viabilité 48,6 »

**Divergence** : 49,0 vs 48,6 sur le sous-indice viabilité. Aligner.

### D.2. Cotisation vieillesse France

- Partie 1 : 27,8 % (875)
- Partie 2 modélisation : 28 % (1281)
- Partie 2 « Cotiser moins » : 28 % (1373)
- Partie 5 5.2 (3505) : implicite, « 27 % en France » (cité dans intro)
- Appendice : non cité

**Recommandation** : aligner sur **27,8 %** (qui est la valeur audit-COR), et neutraliser dans la modélisation par une note de bas de page (« arrondi à 28 % pour lisibilité, écart négligeable »).

### D.3. Encours capitalisé France actuel

- Partie 3 (1600) : « à peine 200 milliards d'euros »
- Partie 3 (2103) : « FRR gère 21 milliards. L'ERAFP 48. Le PER tous types confondus 119 » → 188 Md€ total
- Partie 5 prop 3 (3911) : « FRR 20,4 Md€ »

**Recommandation** : trancher sur ~190 Md€ (FRR 20,4 + ERAFP 48 + PER 119 + résidu). Aligner.

### D.4. Le titre « Six mille milliards qui dorment »

- Partie 3 §2 : titre = « Six mille milliards qui dorment »
- Texte de la section (1614) : **6 356 milliards d'euros**

OK, l'arrondi tient. Mais en parallèle, dans la Partie 3 introduction (ligne 1554), on lit *« six mille milliards d'euros qui dorment sur des livrets et des fonds en euros »* — or 6 356 Md€ couvre **tout** le patrimoine financier (dépôts à vue + assurance-vie + livrets + actions + PEA + PER), pas que les livrets et fonds en euros (qui font ~3 000 Md€).

**Recommandation** : préciser dans le texte que les 6 000 Md€ est le patrimoine financier total, dont **3 000 Md€ effectivement immobilisés** dans des supports non productifs. Sinon, le chiffre est techniquement faux dans son usage rhétorique.

---

## E. Style et registre

### E.1. Tics résiduels signalés dans la Charte mais encore présents

- **« Voilà »** : lignes 1000 (« Voilà. Il n'y a pas de mystère »), 1267 (« Voilà ce que coûte »), 3420 (« Voilà ce que coûte, année après année »).
- **« À la lettre »** : ligne 437 (« et il sort dans une indifférence quasi totale »), ligne 4599 (« en pleine conscience »). OK.
- **Adressage au lecteur « Imaginez : »** : ligne 1031 (« Imaginez : nous sommes en juin 2026 »), ligne 1089 (« Imaginez deux salariés »), ligne 2135 (« Imaginons, pour finir, ce qui se passerait »). Trois occurrences — à arbitrer.
- **Construction « Pour un pays / Pour un actif / Pour [machin], c'est [truc] »** : présente mais pas envahissante.
- **« C'est, dans tous les pays comparables »** : ligne 333, 1014-1016, 4309-4313. Verrou rhétorique répété — à varier.

### E.2. Reformulation post-chiffre

Plusieurs occurrences de « Autrement dit » suivie d'une reformulation. À auditer chapitre par chapitre, mais l'ordre de grandeur est tolérable (≤ une fois par section).

### E.3. Phrases nominales saccadées

J'en ai compté peu (~3-4 occurrences identifiables), notamment ligne 4204 (« Format Q/R, donc. Six questions, six réponses serrées »). Acceptable.

### E.4. Le style « parti pris dès la première ligne »

**Bien tenu** dans l'avant-propos (« Octobre 2024. Sanofi annonce… ») et dans la Partie 1 (« Le déficit qu'on n'a pas le droit de dire »).

**Tombe** en Partie 5, qui glisse vers un ton de note de synthèse / rapport technique (énumération de leviers, tableau des six leviers, propositions 1 à 12 formatées à la verticale). C'est partiellement inévitable (c'est la partie « feuille de route »), mais le ton détonne avec le reste.

**Recommandation** : injecter un ou deux moments « engagés » dans la Partie 5 — par exemple en ouverture de chaque chapitre (5.1, 5.2, 5.3), une page-pivot qui rappelle pourquoi cette section compte. Aujourd'hui, on rentre directement dans le manuel d'instructions.

---

## F. Forme / mise en page (à régler à la compilation finale)

### F.1. Tableaux cassés
- Lignes 1662-1673 : encadré « Calcul. Le manque à gagner d'une épargne mal allouée » au format ASCII art. Pandoc l'a mal converti depuis le DOCX.
- Lignes 1898-1915 : tableau « Critère / Fonds de PE / Fonds de pension étranger » dans la même configuration.
- Lignes 573-591 : encadré « 82,28% de cotisation » : encadré ASCII.

**Recommandation** : passer en vrais tableaux Word (Insert > Table) avant compile finale, plus jolis et plus solides aux conversions ultérieures.

### F.2. Placeholders graphiques
12 placeholders identifiés : `[GRAPHIQUE NAISSANCES / DECES]`, `[COURBE CISEAUX FECONDITE…]`, `[COURBE RATIO COTISANTS / RETRAITES]`, `[GRAPHE INTERETS COMPOSES]`, `[GRAPHES : QUE DEVIENNENT DES COTISATIONS…]`, `[GRAPHIQUE — Taux de cotisation retraite…]`, `[GRAPHIQUE — Impact cumulé annuel…]`, et le seul vrai graphique de l'introduction sur les actifs de retraite OCDE % PIB.

**Recommandation** : faire la liste exhaustive, produire les graphiques OVLA (`matplotlib charte OVLA` via le sous-agent `scientific-modeler`), insérer en place finale.

### F.3. Surlignages jaunes
Beaucoup de passages encore en `{.mark}` (jaune en Word), traces du travail de relecture de l'auteur. À nettoyer à la compile.

### F.4. Numérotation des sections de Partie 3
Le sommaire affiche les sections de Partie 3 comme **« 1. Trois familles dans le monde / 2. Six mille milliards qui dorment / 3. 240 000 entreprises… / 4. Le hold-up silencieux / 5. Si la France avait des fonds de pension »**, puis **« Alléger les dépenses publiques… »** sans numéro, **« Les recettes fiscales augmentent »** sans numéro, **« Le PIB croît »** sans numéro. Ces trois dernières sont en Heading 3 (sous-sections de la 5) et apparaissent comme du même rang dans la TOC.

**Recommandation** : si on garde ces trois sous-sections, les sous-numéroter **5.1, 5.2, 5.3** dans Partie 3. Mais cf. C.1, mieux vaut les déplacer en Partie 5 ou Conclusion.

---

## G. Annonces / promesses non tenues

### G.1. Avant-propos annonce des personnages : Sylvie, Alex, Margaux, Bernard
Cf. AUDIT-COHERENCE.md du 15 mai. État dans la v2 :
- **Bernard** : présent en Partie 3 (lignes 2281-2347). ✓
- **Sylvie, Alex, Margaux** : toujours absents.

**Recommandation** : soit faire revenir Sylvie en Partie 1 (incarner « C'est Nicolas qui paie », ligne 835+) et Alex en Partie 2 (cas-type « actif de 30 ans » → lui donner un prénom et un visage), soit **retirer leurs noms de l'avant-propos**.

### G.2. Plan annoncé en intro ne correspond plus
Cf. A.6.

---

## H. Suggestions éditoriales d'ensemble (sortir de la critique, ouvrir des pistes)

### H.1. Renforcer la transition Partie 3 → Partie 4
Le dernier paragraphe de la Partie 3 (ligne 2415) annonce : *« La suite est dans ce qu'ont fait les autres. Avant nous. Et qu'il nous faut maintenant regarder en face. »*

Pis : il est suivi par les trois sous-sections macro (« Alléger les dépenses… ») qui cassent ce momentum. Le lecteur lit la phrase de transition, puis bascule encore sur 5 pages de Partie 3, puis enfin la Partie 4. Le rythme s'effondre.

**Recommandation** : déplacer les 3 sous-sections macro (cf. C.1), pour que la Partie 3 finisse vraiment sur sa phrase-pont vers la Partie 4.

### H.2. Réflexion sur le poids du Chili
La section Chili occupe ~340 lignes (plus longue que la Suède : ~270 lignes), alors que c'est un **contre-exemple**. C'est délibéré dans le `JOURNAL.md` (« Chili comme cas-limite scientifique »), mais en l'état le Chili devient le morceau le plus développé de la Partie 4.

**Recommandation** : garder l'épaisseur du Chili (le récit Pinochet / Piñera / Chicago Boys / Mesina / Boric est très réussi narrativement), mais **resserrer la section « Quarante-cinq ans plus tard, les chiffres »** (lignes 3084-3149) de moitié. Les chiffres sont précieux, mais ils s'accumulent.

### H.3. Le préambule de Partie 4 est faible
*« Comment évacuer un débat sans même l'avoir commencé ? »* — bonne attaque.
Mais le paragraphe suivant (*« Pourtant, la France n'est pas une île »*) est plat, et la liste des quatre pays se déroule sans suspense (« Trois pays sociaux-démocrates, libéraux ou autoritaires ; et un pays passé par la dictature militaire »).

**Recommandation** : retravailler une page d'entrée plus tendue. Possiblement par une anecdote (le voyage de Friedman à Santiago en 1975 ? l'accord Hawke-Kelty signé en 1985 sur un coin de table ?) pour incarner le « ce qu'ils ont fait » avant la galerie.

---

## I. Plan d'action recommandé (par ordre)

1. **Refondre la Partie 5** (A.1) — restructurer en 3 chapitres, numérotation propre, supprimer « Section A/B/C ». ⏱ 1 demi-journée.
2. **Trancher le Manifeste** (A.3) — décider s'il est nommé ou pas. Réécrire toutes les références. ⏱ 30 min.
3. **Fusionner les deux conclusions** (A.4). ⏱ 1 h.
4. **Trancher 5 ou 6 mensonges** (A.5). ⏱ 30 min.
5. **Couper « Trois familles dans le monde » de Partie 3** (B.1.1) — gain ~3 pages. ⏱ 30 min.
6. **Déplacer les 3 sous-sections macro de Partie 3 vers Partie 5** (C.1) — gain ~5 pages dans Partie 3. ⏱ 1 h.
7. **Resserrer l'appendice** (couper les chiffres déjà donnés en chapitres et renvoyer) (B.1.2, B.1.3, B.1.4). ⏱ 2 h.
8. **Réécrire « L'objectif du livre »** (A.6) pour qu'il annonce les 5 parties. ⏱ 30 min.
9. **Aligner les chiffres divergents** (D.1, D.2, D.3, D.4). ⏱ 1 h.
10. **Nettoyer les fragments de Headings vides** (C.3). ⏱ 15 min.
11. **Décider du sort de Sylvie / Alex / Margaux** (G.1). ⏱ 30 min.
12. **Renforcer Partie 5 (style engagé)** (E.4). ⏱ 1 demi-journée.

**Charge totale estimée pour passer en v3** : environ 2-3 jours pleins.

---

## J. Verdict général

**La v2 tient debout.** Les cinq parties forment un raisonnement complet (diagnostic → outil → souveraineté → exemples internationaux → feuille de route). Le ton est globalement à hauteur du projet, sauf en Partie 5 qui glisse vers le rapport technique. Les chiffres sont denses et bien sourcés. La modélisation cas-type est le pivot narratif réussi du livre.

**Mais la v2 est encore en chantier de structure.** La Partie 5 est cassée, les conclusions doublonnent, le Manifeste fantôme, la numérotation incohérente. Ce sont des décisions éditoriales à prendre, pas un travail de rédaction supplémentaire.

**Charge restante avant un manuscrit envoyable à un éditeur** : 3-5 jours de re-structuration et de coupes, sans réécriture majeure.

Une fois la v3 propre, restera le **fact-check global** (en utilisant le skill `capitalisons-fact-check` paragraphe par paragraphe) et la **production des 12 graphiques placeholders**.

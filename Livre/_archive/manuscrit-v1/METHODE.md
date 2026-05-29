# Méthode de recherche & rédaction — *Capitalisons*

## Constat initial (mai 2026)

La méthode "2-3 agents par chapitre + synthèse" appliquée au Ch.1 a produit un draft contenant :
- une erreur factuelle critique (espérance de vie à 65 ans : 21,8 ans alors que c'est 27,8 ans, soit 6 ans de moins),
- des imprécisions multiples (manifestation 7 mars 2023, écart H/F pensions, fécondité historique),
- des données majeures absentes (solde naturel 2024, dette cumulée projetée 2045),
- et surtout **aucune trace de la controverse comptable Beaufret**, alors qu'elle est centrale et documentée depuis 2023.

Le diagnostic : nos agents *search-specialist*, briefés sur les angles classiques (officiel / académique / presse), restent à la surface des controverses. Ils ne lisent pas les notes techniques d'experts patentés, ne croisent pas les positions adverses, ne hiérarchisent pas les débats actifs.

## Principe directeur

**Pour qu'un argument figure dans le livre, il doit avoir résisté à la confrontation avec les positions adverses.** Pas d'argument unilatéral. Pas de chiffre sans vérification de l'écart avec les chiffres concurrents. Pas de citation sans son contre-feu.

## Architecture de recherche par chapitre

Pour chaque chapitre, on lance entre **6 et 10 agents en parallèle**, sur des angles précis et complémentaires. Plus l'on multiplie les angles, plus on réduit l'angle mort.

### Les huit angles standard

1. **Officiel** — Rapports institutionnels seuls (COR, INSEE, DREES, BdF, OCDE, FMI, Cour des comptes, France Stratégie). Chiffres bruts, méthodologies, projections.

2. **Académique** — Papiers d'économistes patentés (IPP, OFCE, CAE, PSE, Sciences Po, LSE, MIT). Identifier les **désaccords explicites** entre auteurs.

3. **Expertise haute fonction publique** — Notes, rapports, tribunes de hauts fonctionnaires en exercice ou retraités (style Beaufret, Charpin, Pisani-Ferry, Faugère, Sterdyniak). Souvent les controverses techniques les plus pointues.

4. **Think tanks** — Fondapol, Institut Montaigne, IFRAP, Terra Nova, Institut Sapiens, Cercle de l'Épargne, Cercle des économistes, Atterrés. Cartographier les positions, identifier les écoles.

5. **Presse spécialisée et grands quotidiens** — *Le Monde*, *Les Échos*, *La Tribune*, *Alternatives économiques*, *Mediapart*, *L'Express*, *Le Point*. Citations ministres, syndicats, patronat, économistes médiatiques.

6. **International comparatif** — OCDE, FMI, BCE, *Pension Markets in Focus*, *Mercer CFA Index*, papiers académiques étrangers sur le même sujet. Voir comment d'autres pays traitent la question.

7. **Histoire longue et concepts fondateurs** — Travaux historiques sur le sujet (Pierre-Cyrille Hautcoeur, Patrick Verley, Pierre Rosanvallon, Bruno Palier). Origine des choix français, dépendance au sentier.

8. **Chiffres concurrents** — Pour chaque chiffre critique du chapitre, identifier toutes les sources qui le donnent et **signaler les écarts**. Un déficit annoncé par le COR à 6,6 Md€ et par Beaufret à 81 Md€ doit être traité comme un débat — pas comme une simple statistique.

### Angles optionnels selon le chapitre

9. **Témoignages humains** — Reportages presse, podcasts, documentaires. Anecdotes pour amorces narratives.

10. **Données primaires brutes** — Données chiffrées non interprétées (séries longues INSEE, bases OCDE, Banque de France). Permet de recalculer et de tester les arguments.

## Workflow rédactionnel

```
1. PLAN VALIDÉ
   ↓
2. RECHERCHE EXHAUSTIVE (6-10 agents en parallèle)
   ↓
3. CAHIER DES CONTROVERSES (étape critique nouvelle)
   - Pour chaque section du chapitre, lister les controverses identifiées
   - Pour chaque controverse : auteurs des camps adverses, chiffres concurrents, sources primaires
   - Hiérarchiser : qu'est-ce qui est consensus, qu'est-ce qui est débat ?
   ↓
4. SOURCES PRIMAIRES SUR CONTROVERSES
   - WebFetch / téléchargement direct des sources primaires pour les chiffres et citations critiques
   - Pour les PDF longs : téléchargement local puis lecture avec Read
   ↓
5. RÉDACTION
   - Le draft intègre explicitement les controverses (pas seulement la thèse dominante)
   - Quand un chiffre est contesté, on l'écrit
   - Quand une convention comptable est débattue, on présente les positions
   - Footnotes systématiques avec URL + page + date de consultation
   ↓
6. FACT-CHECK
   - Agent fact-checker dédié relit le draft contre les sources primaires
   - Signale chaque divergence, chaque imprécision, chaque chiffre non confirmé
   ↓
7. RÉVISION AVANT VALIDATION
   - Je corrige les points levés par le fact-checker
   - Je relis le tout
   - Je présente à l'utilisateur
   ↓
8. VALIDATION UTILISATEUR
   - L'utilisateur lit, signale ses désaccords ou demandes
   - On itère
   - Quand validé : chapitre clos, on passe au suivant
```

## Format du cahier des controverses (nouveau)

Avant la rédaction de chaque chapitre, je produis un fichier `manuscrit/recherche/ch[N]-controverses.md` contenant :

```
# Cahier des controverses — Ch.[N]

## Controverse 1 : [titre court]
**Question :** [reformulation en une phrase]

**Camp A : [thèse 1]**
- Auteurs : [noms + affiliations]
- Chiffres : [chiffres clés]
- Sources primaires : [URL + dates]
- Citation : [extrait court significatif]

**Camp B : [thèse 2]**
- Auteurs : ...
- Chiffres : ...
- ...

**État du débat (mai 2026) :** [consensus émergent / débat ouvert / position dominante / minoritaire]

**Implication pour le chapitre :** [comment intégrer]

## Controverse 2 : ...
```

## Nombre d'agents par chapitre

| Chapitre | Angles à couvrir | Nombre d'agents |
|----------|-----------------|------------------|
| 1 — Système à bout de souffle | officiel + académique + experts FP + think tanks + presse + données | 6 |
| 2 — France sans capital | officiel + académique + experts FP + think tanks + presse + international + histoire | 7 |
| 3 — Mirage solitude | officiel + académique + international (×3) + think tanks + presse | 6 |
| 4 — Hold-up silencieux | officiel + presse industrielle + experts + cas par cas + international | 6 |
| 5 — Suède profondeur | officiel SE + académique SE + presse SE + entrepreneurs + comparaison FR | 5 |
| 6 — Cinq mensonges | controverses (un agent par objection × 5) + données + presse | 7 |
| 7 — Feuille de route | officiel + experts FP + comparaisons internationales + think tanks + scénarios | 5 |

## Fact-check systématique

Après chaque draft, un agent **fact-checker** dédié relit le chapitre contre les sources primaires. Brief type :
- Lire le draft ligne par ligne
- Pour chaque footnote, ouvrir la source primaire (WebFetch ou Read si PDF local)
- Vérifier que le chiffre cité figure bien dans la source
- Vérifier que la citation est textuelle ou paraphrase fidèle
- Signaler chaque divergence
- Sortie : tableau divergence par divergence avec correctif suggéré

## Évolution depuis le Ch.1 (drafts A, B, futur C)

- **Draft A** : méthode synthèse de synthèse. Erreurs factuelles, omissions majeures (Beaufret).
- **Draft B** : méthode WebFetch sources primaires + WebSearch. Corrige les erreurs factuelles de A mais rate toujours la controverse Beaufret.
- **Draft C (à produire)** : méthode complète selon la présente. Doit intégrer Beaufret + autres controverses identifiées par les agents en parallèle.

Le draft C devient la version de référence du Ch.1, en attendant la validation de l'utilisateur.

# Chapitre 5 — Vingt-cinq ans pour basculer
## Synthèse opérationnelle pour la rédaction v2

**Date** : 17 mai 2026
**Statut** : mémo de travail interne — agrège 7 dossiers de recherche (~56 000 mots), la modélisation Python validée (5 tableaux) et 2 fact-checks (6 corrections critiques)
**Cible du chapitre** : ~10 000-11 000 mots, lectorat double (décideurs publics + grand public engagé)
**Lien Ch.4** : ce chapitre exploite les *Quatre leçons pour la France* du §4.5 (Australie, Chili, Singapour, contre-exemple chilien) et les traduit en feuille de route française.

---

## En-tête : pourquoi ce chapitre, et ce qu'il doit livrer

Le Ch.4 a démontré, à travers quatre cas réels, que la capitalisation est techniquement, juridiquement et socialement faisable lorsqu'elle est correctement architecturée. Le Ch.5 répond à la question logique suivante : **« comment passer du diagnostic à l'exécution, sans reproduire les échecs français de 1997 et 2019 ? »** Le titre — *Vingt-cinq ans pour basculer* — fixe la temporalité réaliste de la transition (horizon 2052), calée sur les fenêtres étrangères (Australie 33 ans, Suède 8 ans politiques + 16 ans cohortes, UK 6 ans staging, Pays-Bas 5 ans légaux, Canada 5 ans paramétriques).

Structure narrative arbitrée :
- **Partie A — 7 grands défis** : les arbitrages à poser **avant** toute solution. Pas de chiffres-promesse.
- **Partie B — 4 scénarios chiffrés** issus de la modélisation Python validée + recommandation finale.

Ton : neutre, factuel, opérationnel. Pas de prosélytisme. Le livre s'adresse autant à un cabinet ministériel qu'à un lecteur ordinaire engagé.

---

# PARTIE A — LES 7 GRANDS DÉFIS À METTRE SUR LA TABLE

## Défi 1 — La temporalité : combien d'années pour basculer ?

Le débat français oscille entre deux mirages symétriques : « tout, tout de suite » (impossible) et « ce sera trop long, donc inutile » (faux). Les transitions étrangères donnent une fourchette claire.

| Pays | Durée politique (accord → loi) | Durée exécution (loi → stabilité) | Durée totale |
|---|---|---|---|
| Pays-Bas | 4 ans (2019 Pensioenakkoord → 2023 WTP) | 5 ans (2023 → 2028) | 9 ans |
| Suède | 3 ans (1991-1994 vote de principe) | 5 ans (1994 → 1999 entrée en vigueur) puis 16 ans cohortes (1938-1954) | 8 ans légaux + 20 ans démographiques |
| Canada | 1 an (1996 accord fédéral-provinces) | 5 ans (1998 → 2003, taux 5,6 % → 9,9 %) | 6 ans |
| Royaume-Uni | 6 ans (Pensions Commission 2002-2008) | 6 ans 6 mois (oct. 2012 → avril 2019 : 2 % → 8 %) | 13 ans |
| Australie | accord Hawke-ACTU 1985 → loi 1992 (SG Act) | 33 ans pour atteindre 12 % (gel Howard 2002-2013 inclus) | 33-40 ans |

**Question qui doit structurer le chapitre** : quel rythme pour la France entre 2027 (fenêtre présidentielle) et 2052 (horizon de génération entière de nouveaux cotisants) ?

Calage proposé :
- **Phase consensus** 2026-2027 (commission indépendante type Turner, accord pré-électoral)
- **Phase loi** 2027-2028 (loi cadre votée dans la foulée des législatives)
- **Phase déploiement** 2028-2035 (montée des cotisations type UK staging)
- **Phase maturité** 2035-2052 (stabilisation, premières rentes capitalisées versées vers 2045-2050)

La leçon transverse : **encoder dans la loi des hausses automatiques** pour éviter le gel politique (cas australien Howard 2002 puis Abbott 2014). UK, Canada et Pays-Bas ont tous neutralisé ce risque par la programmation légale stricte.

---

## Défi 2 — Le double paiement : qui paie quoi pendant la transition ?

**Concept universel.** Dans tout passage répartition → mixte, les actifs financent **simultanément** les retraités d'aujourd'hui (cotisations PAYG inchangées) et une fraction de leur propre retraite future (cotisation capitalisée nouvelle). Cette double charge est inévitable. Le débat porte uniquement sur **qui** l'absorbe.

**Ce que les pays étrangers ont **réellement** fait** :

| Pays | Mécanisme | Absorption par | Coût pour l'État |
|---|---|---|---|
| Australie | Superannuation Guarantee patronal 3 % → 12 % | Employeurs (incidence salariale via modération) | 0 |
| Suède | Recyclage 2,5 pts des 18,5 % existants vers PPM | Bénéficiaires futurs (moindre droit NDC) | 0 (AP-fonds existants amortissent) |
| Royaume-Uni | Auto-enrolment 2 % → 8 % | Mix salarié (5 %) + employeur (3 %) + tax relief État | ~1-2 Md£/an (tax relief NEST) |
| Pays-Bas | Conversion DB→DC + prime transition | Pension funds eux-mêmes (réserves) | 0 |
| Canada | Hausse paritaire 5,6 % → 9,9 % | Salariés + employeurs (paritaire 50/50) | 0 |
| Chili (contre-exemple) | Bonos de reconocimiento État | État (7 % du PIB sur 30 ans) | ~30 % de PIB cumulé. **À éviter absolument.** |

**Leçon clé** : aucun pays OCDE n'a financé la transition par l'impôt général. La France doit choisir parmi 6 leviers, ou les combiner.

### Les six leviers chiffrés pour la France

| Levier | Montant mobilisable | Faisabilité politique | Risques |
|---|---|---|---|
| **FRR (20,4 Md€ fin 2024)** | dotation initiale unique | ★★★ | modeste, dépend des marchés |
| **Eurobonds retraite 50-150 Md€** | dotation immédiate, ~2 Md€/an d'intérêts | ★★ | dette publique +1,7 pts PIB, contraintes Maastricht |
| **Bascule CSG (0,5 pt = 8 Md€/an, 1 pt = 16-17 Md€/an)** | flux pérenne | ★ | conflit avec santé, CFDT/FO mobilisées |
| **Redéploiement AGIRC-ARRCO (1 pt = 8-10 Md€/an)** | flux pérenne | ★ | tabou paritaire, atteinte droits acquis |
| **Sous-indexation pensions (-1 pt = ~1,4 Md€/an)** | économie sur dépenses | ★ | toxique politiquement, rejet 2023 |
| **Cotisation patronale nouvelle (1 % = ~11 Md€/an, 2 % = ~22 Md€/an)** | flux pérenne | ★★ | coût travail, compétitivité PME |

**Ordre de grandeur de référence** : 2 pts de cotisation sur 1 100 Md€ de masse salariale = **22 Md€/an** — à comparer au déficit COR projeté (-5 Md€ en 2025, -6,6 Md€ en 2030, -45 Md€ en 2070, COR juin 2025).

**Verdict réaliste** : aucun levier n'est suffisant seul. La combinaison crédible est : FRR (dotation initiale) + eurobonds (amorçage) + cotisation patronale progressive (flux long). Le scénario D de la modélisation traduit ce mix.

---

## Défi 3 — La segmentation : tous, ou par étapes ?

Six pistes documentées internationalement, chacune avec un tier juridique propre.

| Piste | Modèle étranger | Tier juridique CC/CEDH | Avantage | Risque |
|---|---|---|---|---|
| **Cohorte d'âge** (jeunes d'abord) | Suède 1938-1954, Pologne post-1969 | ★★ (CEDH article 14 si rupture brutale ; **DC 2023-849 admet traitements générationnels** si justifiés viabilité) | acceptation jeunes, longue accumulation | risque QPC + CEDH si écart trop fort |
| **Taille d'entreprise** (UK staging) | Pensions Act 2008 : >50k 2012 → tous 2018 | ★ (jurisprudence française large sur seuils) | déploiement gradué, PME ménagées | délai 6 ans avant couverture totale |
| **Branche professionnelle** | Pays-Bas, Suisse 2e pilier | ★★ (dépend accord paritaire AGIRC-ARRCO) | légitimité paritaire | négociation 18-24 mois |
| **Opt-in volontaire** (Riester) | Riester DE 2002 : ~9,7 M actifs / pic 16 M contrats | ★ (zéro risque) | aucune contrainte | échec démontré : 25-30 % d'adoption, rendement faible |
| **Hybride NZ-like** (auto-enrolment + opt-out) | KiwiSaver, NEST UK | ★ | adoption rapide (90 %+) | besoin fonds par défaut public |
| **Pilote régional ou sectoriel** | (peu d'antécédents OCDE) | ★ | apprentissage | risque rupture d'égalité |

**Risques juridiques par scénario** : la **cohorte d'âge** est le levier le plus puissant techniquement (vraies cohortes captant tout le rendement composé) mais le plus exposé à la CEDH (article 14, jurisprudence Stec 2006). Mitigation : transition progressive (2 pts par an de cotisation capitalisée selon l'année de naissance) plutôt que rupture brutale, plus minimum garanti État (rendement plancher). La cohorte intermédiaire 1980-1999 est le maillon faible juridique : si rendement capita < promesse répartition, contestation QPC quasi-certaine.

**Recommandation factuelle issue de la recherche** : combinaison taille d'entreprise (staging UK pendant phase 1) + cohorte d'âge progressive (phase 2 à partir de 2030). Pas de cohorte radicale, pas d'opt-in seul.

---

## Défi 4 — Le cadre constitutionnel et juridique : ce qui est possible, ce qui est interdit

**Bonne nouvelle factuelle** : **aucune révision constitutionnelle n'est nécessaire** pour une transition vers un système mixte avec capitalisation < 30 % des cotisations. C'est le verrou théorique le plus surestimé du débat français.

### Le bloc de constitutionnalité

- **Préambule 1946, alinéa 11** : la Nation garantit aux vieux travailleurs « la sécurité matérielle ». Crée une obligation de solidarité, pas un système. La Constitution **n'impose pas la répartition**.
- **Article 34 Constitution** : la loi détermine les principes fondamentaux de la sécurité sociale. **Loi ordinaire suffit** pour créer un pilier capitalisé.
- **Article L.111-1 CSS** : affirme la solidarité nationale. N'interdit pas un pilier capitalisé complémentaire.

### Les quatre décisions du Conseil constitutionnel qui structurent l'espace possible

| Décision | Date exacte | Ce qu'elle valide | Implication capitalisation |
|---|---|---|---|
| **DC 2003-483** (Fillon) | **14 août 2003** | Allongement durée cotisation 41 → 42 ans | Droits acquis = trimestres validés, pas formule. Législateur libre des paramètres. |
| **DC 2010-617** (Woerth) | 9 novembre 2010 | Recul âge 60 → 62 ans | Modifications paramétriques profondes admises si équité préservée. |
| **DC 2014-698** (Touraine) | **6 août 2014** | Convergence régimes, censure article 1 LFRSS pour rupture d'égalité | Égalité = écueil. Transition générationnelle doit être progressive et justifiée. |
| **DC 2023-849** (Borne) | 14 avril 2023 | Recul 62 → 64, 30 articles sur 36 validés, **6 groupes de dispositions censurés comme cavaliers** (articles 2, 3, 6, 27 et dispositions partielles 10, 17) | Le Conseil tolère des réformes **asymétriques par génération** si justifiées par viabilité. Précédent crucial pour cohorte d'âge. |

**Note importante** : la DC 2003-**483** concerne les retraites Fillon. À ne pas confondre avec la DC 2003-**484** (immigration). Erreur très répandue à corriger.

### CEDH : ce qu'elle protège, ce qu'elle laisse au législateur

- **Apostolakis c. Grèce (22 octobre 2009)** : fonctionnaire condamné pénalement dont **tous les droits à pension ET la couverture sociale** ont été supprimés. Violation Art. 1 Protocole 1. **NB : pas un simple « fonctionnaire révoqué »**, contrairement à une formulation répandue.
- **Béláné Nagy c. Hongrie (Grande Chambre, 13 décembre 2016)** : extension de la notion d'**« expectative légitime »**. Une pension versée depuis plusieurs années crée un droit établi. Implication France : on ne touche pas aux pensions des retraités actuels.
- **Stec et autres c. Royaume-Uni (Grande Chambre, 12 avril 2006)** : différences de traitement par âge admises si **objectivement justifiées**. Ouvre la porte aux cohortes en transition douce.

### Doctrine des droits acquis

La jurisprudence française distingue clairement :
- **Droit acquis** = cotisations versées et validées par l'autorité compétente → protégé.
- **Droit virtuel / expectance** = pension future selon formule actuelle → modifiable par le législateur.

**Conséquence pratique pour la rédaction** : la **substitution AGIRC-ARRCO** (réduire 12,8 % à 2,8 % et basculer 10 pts au FFC) est juridiquement à très haut risque. La **superposition** (créer une cotisation nouvelle au-dessus d'AGIRC-ARRCO) est juridiquement nette. La loi Thomas (n° 97-277 du 25 mars 1997) montre que le concept est constitutionnellement validé : le Conseil n'a jamais saisi pour la juger.

### Les bombes à éviter (synthèse des fact-checks juridiques)

1. **Substitution AGIRC-ARRCO sans accord paritaire** : QPC quasi-certaine (article L923-1 CSS, autonomie partenaires sociaux).
2. **Suppression de la répartition** : exige révision constitutionnelle, politiquement impensable.
3. **Opt-in volontaire seul** : juridiquement parfait, mais démontré inefficace (Riester DE : ~9,7 M actifs en 2024 sur potentiel 35 M ; PER France : 11 M contrats mais encours moyen 3 400 €).
4. **Sous-indexation des pensions** : politiquement toxique, rejetée en 2023.
5. **Cohorte d'âge avec rupture radicale** (100 % capita pour les nés ≥ 2000 et 0 % pour les nés ≤ 1979) : risque CEDH article 14.

---

## Défi 5 — L'acceptabilité politique et sociale : où est le rapport de forces ?

### L'opinion : un basculement net depuis 2024

- **Odoxa-Groupama, novembre 2025** : **57 % des Français favorables à un système mixte** mélangeant répartition et capitalisation. 22 % pour capitalisation seule contre 20 % pour répartition seule (renversement historique). **9 sur 10** jugent utile de construire une épargne retraite individuelle.
- **Cercle de l'Épargne / Amphitéa (1 000 répondants, 25-26 mars 2025)** : 72 % des non-retraités jugent les pensions futures insuffisantes ; **62 % considèrent qu'il faut commencer à épargner avant 35 ans**. Chez les 18-24 ans, **48 % avant 30 ans**.
- **AMF Baromètre octobre 2024 (2 044 répondants)** : 58 % des Français inquiets pour leur retraite (66 % chez les non-retraités).

### Le rapport de force syndical

| Syndicat | Position | Négociabilité |
|---|---|---|
| CGT | Refus absolu de principe | ✗ |
| FO | Refus catégorique | ✗ |
| UNSA | Refus | ✗ |
| CFDT | Ouverture prudente (Marylise Léon) si garanties d'équité et de généralisation | ★★ |
| CFE-CGC (Christelle Thieffine) | Favorable explicite, conditionne à préservation du socle | ★★★ |

Le patronat (MEDEF, CPME, U2P) est globalement favorable. Le blocage syndical est **partiel** : un accord CFDT + CFE-CGC + MEDEF est arithmétiquement possible, en excluant CGT/FO.

### L'histoire des trois blocages français

1. **Loi Thomas (1997)** — Loi n° 97-277 du 25 mars 1997, portée par **Jean-Pierre Thomas (RPR)** sous le gouvernement Juppé. Crée les plans d'épargne-retraite obligatoires. **Jospin, nommé Premier ministre le 4 juin 1997 après la dissolution Chirac**, refuse de signer les décrets d'application. Abrogée par la loi n° 2002-73 du 17 janvier 2002. **Leçon** : sans consensus pré-vote, l'alternance abroge.

2. **Delevoye 2019** — Système universel à points. Grèves RATP-SNCF décembre 2019 - janvier 2020 (4 semaines). COVID enterre la réforme.

3. **Borne 2023** — Recul 64 ans validé via 49.3. Coût politique massif : gouvernement Borne démissionne (renversement Bayrou par défiance le 8 septembre 2025, premier en Ve République). **LFSS 2026** suspend l'application aux générations nées avant 1969.

### Les modèles de consensus réussis à l'étranger

- **Suède 1991-1994** : 5 partis sur 7 (sociaux-démocrates + 4 partis « bourgeois », ~85 % du Riksdag). Vote de principe **8 juin 1994**. Accord écrit signé. Tous changements futurs unanimes.
- **Australie 1985** : Prices and Incomes Accord Mark II (Hawke + Kelty/ACTU). +3 % super contre modération salariale.
- **Royaume-Uni 2002-2008** : Commission Turner (Adair Turner + John Hills + Jeannie Drake) indépendante, diagnostic consensuel, Pensions Act 2008 voté avec soutien multipartite ~85 %.
- **Pays-Bas 2019-2023** : Pensioenakkoord tripartite (gouvernement + VNO-NCW + FNV/CNV/MHP). Vote Tweede Kamer 22 décembre 2022 (93-48), Eerste Kamer 30 mai 2023 (46-27).

### Le score de faisabilité

**Évaluation synthétique** : 6/10 — **faisable mais fragile**.

| Dimension | Score |
|---|---|
| Opinion publique | 7/10 |
| Patronat | 8/10 |
| Modèles internationaux | 8/10 |
| Syndicats (CFDT + CFE-CGC vs CGT/FO) | 6/10 |
| Stabilité long-terme | 5/10 |
| Consensus politique (droite + centre, gauche bloque avant 2027) | 5/10 |

Conditions sine qua non : (1) droits acquis retraités préservés, (2) cotisation patronale dominante, (3) socle répartition inviolable, (4) fonds par défaut public et transparent type AP7 ou NEST, (5) consensus politique pré-implémentation, (6) communication massive sur 18-24 mois.

---

## Défi 6 — L'architecture institutionnelle : qui gère, comment ?

Cinq modèles compatibles avec la démocratie paritaire française.

| Option | Modèle | Forces | Faiblesses |
|---|---|---|---|
| **1. Fonds public unique** | CDPQ Québec (473 Md CAD fin 2024) | économies d'échelle, transparence | risque capture politique |
| **2. Sectoriels paritaires** | Pays-Bas (< 200 fonds en 2023, après consolidation) ; ABP ~540 Md€ fin 2024 | légitimité paritaire, modèle AGIRC-ARRCO étendu | fragmentation, supervision |
| **3. Auto-enrolment + fonds par défaut** | NEST UK (49,7 Md£, 13 M membres mars 2025, ~80 % couverture éligibles) ; Australie (4 300 Md AUD juin 2025) | adoption rapide, choix individuel | régulation lourde |
| **4. Fonds souverain** | NBIM Norvège GPFG (~1 700 Md€ fin 2024 / ~1 900 Md€ fin 2025) | indépendance, taille critique | France n'a pas de rente naturelle |
| **5. Hybride 3 étages** | Suède (NDC + PPM + tjänstepension) | combine forces | complexité extrême |

**Régulation prudentielle** : Directive **IORP II (2016/2341)** s'applique automatiquement. Trois options pour la France : délégation ACPR, AAI nouvelle type Pensions Regulator UK, ou coordination ACPR + AMF. Recommandation issue de la recherche : AAI dédiée pour crédibilité long-terme.

**Gouvernance** : modèle FRR existant (Conseil de surveillance 20 membres + Directoire 3 administrateurs) testé, transposable. AGIRC-ARRCO offre déjà un modèle paritaire 27 M cotisants pour les sectoriels.

**Recommandation factuelle** : **hybride socle public (CDPQ-like, 2 %) + sectoriels paritaires AGIRC-ARRCO étendus (3 %)**, avec PER amélioré en pilier 3 volontaire. C'est l'architecture la plus défendable politiquement (paritarisme préservé) et juridiquement (création par accord collectif étendu, pas substitution forcée).

---

## Défi 7 — Le consensus transpartisan préalable : la condition cachée

La leçon transverse des 5 cas étrangers, presque jamais formulée explicitement en France : **aucune transition retraite n'a tenu 25 ans sans un accord politique formalisé conclu avant le vote.**

| Pays | Forme du consensus pré-vote | Durabilité |
|---|---|---|
| Suède | 5 partis signent en juin 1994 ; modifications futures unanimes | 30 ans, jamais remis en cause |
| Australie | Hawke + ACTU 1985 ; bipartisan Liberal-Labor sur le super | 33 ans (un seul gel Howard 2002, repris) |
| Royaume-Uni | Commission Turner 2002-2008, Pensions Act 2008 voté à ~85 % | 13 ans, jamais remis en cause |
| Pays-Bas | Pensioenakkoord 2019 tripartite | 5 ans, exécution en cours |
| France 1997 | **Aucun.** Loi Thomas votée par majorité Juppé sans accord opposition | Abrogée en 5 ans |
| France 2019 | **Aucun.** Delevoye non négocié avec syndicats | Enterré en 6 mois |
| France 2023 | **Aucun.** 49.3, sans accord syndical | Suspendue (LFSS 2026 pour générations < 1969) |

**Conséquence opérationnelle pour le chapitre** : la séquence française réaliste est commission indépendante 2026 → diagnostic public → accord pré-électoral 2027 → vote 2027-2028 → exécution 2028+. Sauter l'étape consensus pré-vote = répéter Thomas/Delevoye/Borne.

---

# PARTIE B — QUATRE SCÉNARIOS CHIFFRÉS

Quatre scénarios crédibles ont survécu aux filtres juridique, politique et financier de la Partie A. Tous sont **modélisés** sur 2027-2077, en euros constants 2026, rendement réel net central 4 %/an, masse salariale 1 100 Md€ en 2027 croissant à 1 247 Md€ en 2052 (source : modélisation Python `ch5_modelisation.py`, écart formule analytique vs récurrence = 0.000000 %).

## Hypothèses paramétriques communes

| Paramètre | Valeur | Source |
|---|---|---|
| PIB France 2026 | 2 900 Md€ | INSEE Comptes nationaux 2025 |
| Masse salariale brute 2027 | 1 100 Md€ constants 2026 | INSEE |
| Croissance salariale réelle | +0,5 %/an | OCDE Economic Outlook 2025 |
| Croissance PIB réelle | +1,2 %/an | OCDE |
| Rendement réel net central | 4,0 %/an | CPPIB 10 ans ~5 % réel ; AP7 ; FRR +6,46 % nominal 2024 |
| Frais de gestion | 0,3 %/an | AP7 0,12 % ; ABP 0,37 % ; FRR 0,28 % |
| Encours initial France 2026 | 200 Md€ | PER ~100 Md€ + ERAFP ~37 Md€ + FRR 20,4 Md€ + PERCO ~43 Md€ |
| Nombre d'actifs | 23 M (stable) | INSEE |
| Taux cotisation retraite total existant | 28 % du brut | DSS (CNAV 16,9 % + AGIRC-ARRCO 7,7 % + autres) |
| Déficit COR 2025 / 2030 / 2070 | -5 / -6,6 / -45 Md€ | Rapport COR juin 2025 |

## Tableau 1 — Trajectoire de cotisation vers le fonds capitalisé (% masse salariale)

| Année | Sc. A (Australien lent) | Sc. B (Suédois recyclage) | Sc. C (Auto-enrolment) | Sc. D (Hybride Canada-AU) |
|---|---|---|---|---|
| 2027 | 1.0% patronal | 2,00 % recyclé | 0,00 % (démarrage 2028) | 0,00 % (dotation seule) |
| 2028 | 1.2% | 2,00 % | 1.8% | 0.5% paritaire |
| 2030 | 1.6% | 2,00 % | 3.2% | 2.5% (dont 1 % AGIRC) |
| 2032 | 2.0% | 2,00 % | 4.5% | 3.5% |
| 2035 | 2.6% | 2,00 % | 6.5% | 5.0% |
| 2036 | 2.8% | 2,00 % | 7.2% (plafond 8 % brut, 7,2 % net opt-out 10 %) | 5.0% |
| 2040 | 3.6% | 2,00 % | 7.2% | 5.0% |
| 2045 | 4.6% | 2,00 % | 7.2% | 5.0% |
| 2052 | 6.0% (plafond) | 2,00 % | 7.2% | 5.0% (plafond) |
| 2077 | 6.0% | 2,00 % | 7.2% | 5.0% |

*Sc.A = cotisation patronale pure (modèle Superannuation Guarantee). Sc.B = recyclage de 2 pts sur les 28 % existants vers PPM. Sc.C = paritaire avec opt-out 10 % (référence NEST UK 8-12 %). Sc.D = paritaire + 1 % AGIRC-ARRCO à partir de 2030 + dotation initiale FRR 20,4 Md€ + eurobonds 50 Md€ en 2027.*

## Tableau 2 — Encours capitalisé projeté (Md€ constants 2026, r = 4 % réel net)

| Année | Sc. A | Sc. B | Sc. C | Sc. D | PIB estimé (Md€) |
|---|---|---|---|---|---|
| 2027 | 219 (8% PIB) | 230 (8% PIB) | 208 (7% PIB) | 281 (10% PIB) | 2 935 |
| 2032 | 362 (12% PIB) | 401 (13% PIB) | 441 (14% PIB) | 466 (15% PIB) | 3 115 |
| 2037 | 601 (18% PIB) | 612 (18% PIB) | 930 (28% PIB) | 857 (26% PIB) | 3 307 |
| 2042 | 959 (27% PIB) | 871 (25% PIB) | 1 589 (45% PIB) | 1 360 (39% PIB) | 3 510 |
| 2047 | 1 466 (39% PIB) | 1 190 (32% PIB) | 2 402 (64% PIB) | 1 981 (53% PIB) | 3 726 |
| **2052** | **2 157 (54% PIB)** | **1 582 (40% PIB)** | **3 404 (86% PIB)** | **2 744 (69% PIB)** | **3 954** |
| 2077 | 9 040 (170% PIB) | 5 313 (100% PIB) | 13 023 (244% PIB) | 10 058 (189% PIB) | 5 328 |

*Encours initial commun 2026 : 200 Md€. Scénario D inclut dotation FRR 20,4 Md€ + eurobonds 50 Md€ en 2027 (= 70 Md€ supplémentaires). Euros constants 2026.*

## Tableau 3 — Coût budgétaire annuel pour l'État (Md€)

| Poste | Sc. A | Sc. B | Sc. C | Sc. D |
|---|---|---|---|---|
| Coût de la cotisation (État) | 0 | 0 | 0 | 0 |
| Tax relief / incitations fiscales | 0 | 0 | ~1,5 Md€/an | ~1,5 Md€/an |
| Charge intérêts eurobonds | 0 | 0 | 0 | ~2 Md€/an |
| Perte cotisations sociales (Sc.B) | 0 | ~0 (recyclage) | 0 | 0 |
| **Coût budgétaire total** | **0** | **0** | **~1,5 Md€/an** | **~3,5 Md€/an** |
| Coût cumulé 2027-2052 | 0 | 0 | ~37 Md€ | ~88 Md€ |

*Sources : ATO SG 1992-2025 (coût État 0) ; DWP UK 2022 (tax relief NEST 1-2 Md£/an) ; CRA Canada (coût État 0) ; eurobonds : taux souverain France 2026 ~4 % sur 50 Md€ = 2 Md€/an. Sc.B aggrave néanmoins le déficit COR de ~2 Md€/an à court terme car les cotisations répartition diminuent d'autant.*

## Tableau 4 — Impact sur le déficit COR (Md€, négatif = déficit)

| Année | Référence (statu quo) | Sc. A | Sc. B | Sc. C | Sc. D |
|---|---|---|---|---|---|
| 2027 | -5,6 | -5,6 | -7,6 | -5,6 | -5,6 |
| 2030 | -6,6 | -6,6 | -8,6 | -6,6 | -6,6 |
| 2040 | -15,0 | -15,0 | -17,0 | -15,0 | -15,0 |
| 2050 | -30,0 | -18,9 | -23,5 | -12,1 | -15,5 |
| 2052 | -31,6 | -18,7 | -24,1 | -11,2 | -15,1 |
| 2070 | -45,0 | -6,8 | -23,8 | 0,0 | -1,6 |

*Effets sur le déficit COR faibles avant 2045 (rentes capitalisées pas encore versées à grande échelle). Sc.A, C, D réduisent le déficit de 5 à 15 Md€/an dans la décennie 2050. Sc.C et D ramènent le déficit à zéro en 2070. **Approximation de premier ordre** — une projection actuarielle complète avec tables de mortalité générationnelles serait nécessaire pour affiner.*

## Tableau 5 — Synthèse comparative 2052 (scénario central, 4 % réel net)

|  | Sc. A | Sc. B | Sc. C | Sc. D |
|---|---|---|---|---|
| **Modèle de référence** | Australie SG | Suède NDC/PPM | Royaume-Uni NEST | Canada CPP + Australie |
| **Cotisation finale 2052** | 6,0 % masse sal. | 2,0 % recyclé | 7,2 % (net opt-out) | 5,0 % paritaire + AGIRC |
| **Flux annuel 2052 (Md€)** | 75 | 25 | 90 | 62 |
| **Encours 2052 (Md€)** | 2 157 | 1 582 | 3 404 | 2 744 |
| **Encours 2052 (% PIB)** | 54 % | 40 % | 86 % | 69 % |
| **Capital moyen/actif 2052** | 94 k€ | 69 k€ | 148 k€ | 119 k€ |
| **Cotisations cumulées 2027-2052** | 1 083 Md€ | 609 Md€ | 1 842 Md€ | 1 290 Md€ |
| **Effet rendement composé** | 1,99× | 2,60× | 1,85× | 2,13× |
| **Encours 2077 (Md€)** | 9 040 | 5 313 | 13 023 | 10 058 |
| **Coût budgétaire État** | 0 | 0 | ~1,5 Md€/an | ~3,5 Md€/an |
| **Accessibilité politique (★)** | ★★★ | ★ | ★★ | ★★ |
| **Cible 1 500 Md€ atteinte** | Oui | Oui | Oui | Oui |

*La cible de 1 500 Md€ (≈ 38 % du PIB estimé 2052) est cohérente avec la moyenne Canada à mi-parcours (~25 % PIB) et l'objectif long terme ~100 % PIB (moyenne pondérée OCDE Thinking Ahead Institute 2025).*

## Analyse de sensibilité (scénario D)

| Rendement réel net | Encours 2052 (Md€) | Encours 2077 (Md€) | Ratio /PIB 2052 |
|---|---|---|---|
| 3 % (pessimiste) | 2 364 | 7 356 | 60 % |
| **4 % (central)** | **2 744** | **10 058** | **69 %** |
| 5 % (optimiste) | 3 201 | 13 976 | 81 % |

| Opt-out (scénario C uniquement) | Encours 2052 (Md€) | Capital/actif (k€) |
|---|---|---|
| 5 % (quasi-universelle) | 3 562 | 155 |
| **10 % (central — NEST UK)** | **3 404** | **148** |
| 20 % (pessimiste) | 3 087 | 134 |

*Source opt-out : DWP UK Ten Years of Auto-Enrolment 2022 (observé 8-12 %, jamais > 25 %).*

## Vérifications croisées avec les pays de référence

| Indicateur | Réel | Modèle France Sc. correspondant |
|---|---|---|
| Australie 2025 : Encours/PIB | ~160 % (4 300 Md AUD / 2 700 Md AUD) en 33 ans | Sc.A 2052 = 54 % en 25 ans (cohérent : taux 6 % vs 12 %) |
| Suède PPM 2024 / PIB | ~29 % en 25 ans | Sc.B 2052 = 40 % (légèrement plus ambitieux car cotisation 2 % vs 2,5 % mais base plus large) |
| Canada CPPIB / PIB Canada | ~25 % (714,4 Md CAD au 31 mars 2025) en 28 ans | Sc.D 2052 = 69 % (Sc.D = pilier complémentaire plus large) |

## Évaluation comparée des 4 scénarios

### Scénario A — Australien lent (patronal pur progressif)

- **Mécanique** : cotisation patronale 1 % en 2027 montant à 6 % en 2052 (+0,2 pt/an).
- **Tier juridique** : ★ très faible (cotisation patronale classique, jurisprudence DC large).
- **Tier politique** : ★★★ — **le plus acceptable**. Aucun choc salarial perceptif. CFE-CGC et CFDT (sous garanties) plausibles. MEDEF inquiet du coût travail mais transition lente atténue.
- **Encours 2052** : 2 157 Md€ (54 % PIB). **2077** : 9 040 Md€.
- **Coût État** : 0.
- **Limite** : 33 ans pour rattraper l'Australie. Lent.

### Scénario B — Suédois recyclage

- **Mécanique** : 2 pts des 28 % existants basculent vers PPM. Pas de hausse globale.
- **Tier juridique** : ★★ moyen-élevé. Risque CEDH droits acquis si rendement capita < attendu en répartition. DC 2003-483 et 2010-617 admettent convergence si compensation.
- **Tier politique** : ★ — le plus risqué socialement. CGT/FO l'assimileront à une « privatisation », mobilisation prévisible.
- **Encours 2052** : 1 582 Md€ (40 % PIB). **2077** : 5 313 Md€.
- **Coût État** : 0 nominal, mais **-2 Md€/an aggravation déficit COR** à court terme.
- **Limite** : faible mobilisation politique en France.

### Scénario C — Auto-enrolment NEST France

- **Mécanique** : montée 2 % (2028) → 8 % (2036), opt-out 10 % par défaut.
- **Tier juridique** : ★ très faible. Modèle UK éprouvé sans contentieux.
- **Tier politique** : ★★ — opt-out préserve la liberté individuelle (acceptabilité), mais auto-enrolment est culturellement nouveau en France.
- **Encours 2052** : **3 404 Md€ (86 % PIB) — le plus élevé**. **2077** : 13 023 Md€.
- **Coût État** : ~1,5 Md€/an (tax relief).
- **Limite** : exige création d'une AAI type Pensions Regulator (~30-50 M€/an) et d'un fonds par défaut public type NEST.

### Scénario D — Hybride Canada-Australie (RECOMMANDÉ)

- **Mécanique** : phase 1 (2027) dotation FRR 20,4 Md€ + eurobonds 50 Md€. Phase 2 (2028-2035) cotisation paritaire +0,5 pt/an → 4 % en 2035. Phase 3 (2030-2040) redéploiement +1 pt AGIRC-ARRCO (accord paritaire). Phase 4 stabilisation à 5 %.
- **Tier juridique** : ★★ moyen, conditionné à l'accord AGIRC-ARRCO. Si imposé sans accord, ★★★ élevé.
- **Tier politique** : ★★ — paritarisme préservé, légitimité CFDT possible. MEDEF favorable au principe paritaire. Eurobonds politiquement contentieux mais étalés.
- **Encours 2052** : 2 744 Md€ (69 % PIB). **2077** : 10 058 Md€.
- **Capital moyen/actif 2052** : 119 k€.
- **Coût État** : ~3,5 Md€/an (1,5 tax relief + 2 intérêts eurobonds).
- **Atout narratif** : combine les 5 leviers de financement (FRR + eurobonds + cotisation patronale + recyclage AGIRC partiel + tax relief). Le plus défendable politiquement parce qu'il **n'épuise aucun seul levier**.

## Recommandation finale issue de la recherche

Le scénario **D hybride** est le plus solide à l'intersection des **4 filtres** :

1. **Juridique** : compatible loi ordinaire (pas de révision constitutionnelle), respecte droits acquis AGIRC si redéploiement négocié, conforme IORP II et CEDH.
2. **Politique** : paritarisme préservé (légitimité CFDT/CFE-CGC), modèle CDPQ familier dans le débat français depuis 2023, mobilise FRR (capital national déjà constitué).
3. **Financier** : 2 744 Md€ en 2052 (~70 % PIB), suffisant pour la cible 1 500 Md€ posée au Ch.3 ; capital moyen 119 k€/actif ; effet composé 2,13×.
4. **Narratif** : combine les leçons des 4 cas Ch.4 (Australie SG + Singapour CPF logique de fonds public + Canada CPPIB gouvernance professionnelle + évitement du piège chilien par maintien intégral de la répartition).

**Le scénario C (NEST France)** est l'alternative la plus performante chiffrée (3 404 Md€) si la France accepte le saut culturel de l'auto-enrolment et la création d'une AAI. C'est l'option à conserver en plan B si l'accord paritaire AGIRC-ARRCO échoue (Phase 3 du scénario D).

---

# SECTION FINALE — VALEURS DÉFINITIVES À UTILISER DANS LA RÉDACTION

Consolidation des deux fact-checks (vague 1 sur 4 fichiers, vague 2 sur 3 fichiers). Ces valeurs s'imposent à toute la rédaction Ch.5 v2.

| Sujet | Valeur retenue | Source |
|---|---|---|
| **DC retraites 2003 (Fillon)** | DC **2003-483** du **14 août 2003** (PAS 2003-484 qui concerne l'immigration) | Conseil constitutionnel |
| **DC retraites 2010 (Woerth)** | DC **2010-617** du **9 novembre 2010** | Conseil constitutionnel |
| **DC retraites 2014 (Touraine)** | DC **2014-698** du **6 août 2014** (PAS 5 décembre 2014) | Conseil constitutionnel |
| **DC retraites 2023 (Borne)** | DC **2023-849** du **14 avril 2023** ; **6 groupes de dispositions censurés** (articles 2, 3, 6, 27 et dispositions partielles 10, 17) — PAS « 4 cavaliers » | Conseil constitutionnel |
| **Loi Thomas 1997** | Loi n° **97-277 du 25 mars 1997**, Jean-Pierre Thomas **RPR** (pas UDF) ; **Jospin** refuse les décrets (pas Juppé, qui n'en a pas eu le temps avant la dissolution juin 1997) ; abrogée par **loi n° 2002-73 du 17 janvier 2002** | Légifrance |
| **Riester DE** | **~9,7 millions d'actifs en 2024** (pic ~16 millions de contrats cumulés) | BMAS, COR Allemagne 2024 |
| **Fonds Pays-Bas** | **< 200 fonds en 2023** (consolidation de ~1 000 en 2000) — PAS 600 | DNB, IPE |
| **CPPIB création** | Créée par **loi en décembre 1997**, premiers investissements en 1999 — PAS « créée en mai 1999 » | OSFI, Wikipedia CPP Investments |
| **NEST UK** | **387 M£ prêt DWP au démarrage** ; **13 M membres** au 31 mars 2025 ; couverture ~**80 % des éligibles** (PAS 99 %) | NEST Annual Report 2025 |
| **Pologne OFE** | Obligatoire pour les nés **après 1969** (PAS avant) | OIT, Banque mondiale |
| **CDPQ** | **473 Md CAD** (dollars canadiens, PAS €) fin 2024 ; 496 Md CAD au 30 juin 2025 | CDPQ communiqué |
| **CPPIB mars 2025** | **714,4 Md CAD** (FY2025, exercice 31 mars 2025) ; 780,7 Md CAD au 31 décembre 2025 (T3 FY2026) | CPP Investments |
| **ABP Pays-Bas fin 2024** | ~**540 Md€** (PAS 494 Md€ qui est ancien) | ABP |
| **Encours Super Australie** | **4 300 Md AUD** au 30 juin 2025 (PAS 4 100) | APRA |
| **CSG 1 point** | **16-17 Md€** en 2024 (PAS 14 Md€) | FIPECO, DG Trésor |
| **GPFG Norvège** | **~1 700 Md€ fin 2024** / **~1 900 Md€ fin 2025** (21 268 Md NOK) — préciser la date | NBIM Annual Report |
| **FRR** | **20,4 Md€** fin 2024 (PAS 26 Md€) ; rendement 2024 **+6,46 %** net | FRR Rapport annuel 2024 |
| **Déficit COR** | **-5 Md€ (2025)**, **-6,6 Md€ (2030)**, **-45 Md€ (2070)** ≈ -1,4 % PIB | COR Rapport juin 2025 |
| **Fécondité France 2025** | **1,56** (plus bas depuis 1915) | INSEE Bilan démographique 2025 |
| **Solde naturel France 2025** | **-6 000** (négatif pour la première fois depuis 1945) | INSEE |
| **Passif implicite retraites France** | ~**417 % du PIB** (2021, taux d'actualisation 1 %) | Commission européenne Ageing Report 2024 |
| **Suède PPM** | **2,5 %** sur 18,5 % total (16 % NDC + 2,5 % PPM ou 16,5 % + 2 % selon présentations — utiliser **2,5 % PPM**) | Pensionsmyndigheten |
| **AMF Baromètre 2024** | **2 044 répondants** (PAS 2 120) | AMF |
| **Sondage Odoxa-Groupama novembre 2025** | **57 % favorables au système mixte** ; 22 % capitalisation vs 20 % répartition ; 9/10 jugent utile l'épargne individuelle | Odoxa |
| **Cercle de l'Épargne / Amphitéa mars 2025** | **1 000 répondants**, 25-26 mars 2025 | Cercle de l'Épargne |
| **Vote Pensioenakkoord NL** | Tweede Kamer **22 décembre 2022 (93-48)** ; Eerste Kamer **30 mai 2023 (46-27)** ; entrée en vigueur **1er juillet 2023** ; deadline **1er janvier 2028** | Tweede Kamer, DNB |
| **Vote de principe suédois** | **8 juin 1994** (5 partis sur 7, ~85 % du Riksdag) ; vote final **8 juin 1998** | Pensionsmyndigheten |
| **Renversement Bayrou** | Vote de défiance **8 septembre 2025** (364 contre 194), démission **9 septembre 2025** ; Lecornu nommé Premier ministre le **10 octobre 2025** | franceinfo, Élysée |
| **CEDH Apostolakis c. Grèce** | **22 octobre 2009**, fonctionnaire **condamné pénalement** dont tous droits à pension supprimés (PAS « révoqué dont pension annulée ») | HUDOC |
| **CEDH Béláné Nagy c. Hongrie** | **Grande Chambre, 13 décembre 2016**, requête n° 53080/13, violation Article 1 Protocole 1 | HUDOC |
| **CEDH Stec et autres c. Royaume-Uni** | **Grande Chambre, 12 avril 2006**, requêtes 65731/01 et 65900/01 | HUDOC |
| **UK auto-enrolment hausses** | 2 % au 1er octobre 2012 ; **5 % au 6 avril 2018** (PAS février 2018) ; **8 % au 6 avril 2019** | The Pensions Regulator |
| **Australie SG gel** | Gel **Howard 2002** (9 %) puis **Abbott 2014** (9,25 % → 12 % reporté). Ne pas attribuer toute la période à Abbott. | ATO, Treasury Australia |
| **Loi PACTE / PER** | Loi **n° 2019-486 du 22 mai 2019** | Légifrance |

---

## Notes de cohérence finales

- **Sources à toujours créditer brièvement dans le texte** : COR juin 2025, INSEE Bilan démographique 2025, Cour des comptes février 2025, Conseil constitutionnel (date de la décision), HUDOC (arrêt + date), Légifrance (numéro de loi + date), ATO/APRA/CPP Investments/CDPQ/NBIM/Pensionsmyndigheten/DNB/NEST pour les comparaisons internationales.
- **Précautions méthodologiques à mentionner** : l'impact COR à long terme (2045+) est une approximation de premier ordre ; les rendements sont en euros constants 2026 ; la modélisation ne capte pas les chocs de marché ni la substitution épargne privée ↔ obligatoire.
- **Pièges narratifs à éviter** : confondre DC 2003-483/484 ; attribuer le blocage Thomas à Juppé ; sur-utiliser DC 2014-698 comme jurisprudence sur les cohortes (elle porte avant tout sur l'égalité) ; présenter la capitalisation comme une « privatisation » (CGT/FO en feront le procès) ; sous-estimer le coût travail dans le Sc. A.

---

*Synthèse compilée le 17 mai 2026 à partir de 7 fichiers de recherche (ch5-transitions-etrangeres-calendriers, ch5-options-architecture, ch5-contexte-2026-impact-macro, ch5-financement-double-paiement, ch5-cadre-constitutionnel-droits-acquis, ch5-acceptabilite-sociale-politique, ch5-faisabilite-reglementaire-scenarios), de la modélisation Python validée (ch5_modelisation.py, ch5_rapport_modelisation.md) et des deux fact-checks (ch5-FACT-CHECK.md, ch5-vague2-FACT-CHECK.md).*

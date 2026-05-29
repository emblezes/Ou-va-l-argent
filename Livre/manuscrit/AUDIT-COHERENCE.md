# Audit de cohérence — *Capitalisons*

**Date** : 15 mai 2026
**Périmètre** : avant-propos + introduction + Ch.1 + Ch.2 + plan complet + bibliographie
**Auditeur** : Claude (lecture critique, sans modification du manuscrit)

---

## Verdict synthétique

Les quatre premiers segments rédigés (avant-propos, introduction, Ch.1, Ch.2) **tiennent l'ensemble** : la thèse circule, le fil rouge est porté, les chiffres-piliers convergent à 90 %. Mais le Ch.2 récemment rédigé porte trois alertes lourdes : (1) **une divergence chiffrée sur le Mercer CFA Global Pension Index 2025** entre Ch.1 et Ch.2 (la France n'a pas le même score, pas le même rang, pas la même note de viabilité, et le rapport n'a pas la même date de publication) ; (2) **une note de bas de page manquante** (`[^32]` saute) ; (3) **une attribution erronée** d'un article INSEE 2015 à des auteurs qui ne l'ont pas signé. À cela s'ajoutent des tics AI-slop résiduels au Ch.2 (« Voilà », « À la lettre »), des placeholders graphiques `[GRAPHE...]` qui doivent encore être produits, et une **incohérence Charte vs Ch.1** sur l'ouverture (Charte affirme « solde naturel 2024 = 17 000 », Ch.1 ouvre sur « 2025 = −6 000 » : OK l'auteur a mis à jour, mais la Charte n'a pas suivi).

**Recommandation prioritaire** : trancher le Mercer 2025 (une seule source, un seul jeu de chiffres) avant tout autre passage rédactionnel.

**Nombre d'alertes recensées** : 22 (dont 4 majeures, 9 moyennes, 9 mineures).

---

## 1. Fil rouge & narration

### 1.1. Le fil rouge « culture de l'investissement » est-il porté ?

**Oui, dans avant-propos + intro + Ch.2.** L'avant-propos l'installe avec puissance (« Nous voulons donc deux choses incompatibles […] nous reprochons aux fonds étrangers de faire ce que nous nous interdisons de faire »). L'introduction le reprend chiffré (3 chiffres : 50 % CAC 40 aux non-résidents, 240 000 PME sans repreneur, 70 % vs 96 %). Le Ch.2 le porte conceptuellement (la capitalisation comme infrastructure collective, pas comme produit personnel) et le matérialise par la modélisation chiffrée +228 k€/+457 k€.

**Mais au Ch.1, le fil rouge se brouille.** Le chapitre reste dans le diagnostic de la répartition (démographie, déficit, réformes). La capitalisation n'y apparaît qu'à deux moments tardifs :
- 1.5, §6 : la comparaison France/Suède (« le système suédois fait travailler le capital pendant que la jeune cotise »)
- 1.5, §7 : le baromètre Odoxa-Groupama (57 % des Français favorables au mixte)

Sur 145 lignes, le fil rouge « culture de l'investissement » n'apparaît pas dans les sections 1.1, 1.2, 1.3, 1.4. Le diagnostic reste autonome — ce qui est défendable (« d'abord le diagnostic, ensuite la solution »), mais l'avant-propos avait préparé le lecteur à voir tisser le fil dès le Ch.1.

**Recommandation** : ajouter au Ch.1, dans 1.2 (déficit) ou 1.4 (réformes paramétriques), une ou deux phrases-pivot qui pointent vers la capitalisation comme issue — sans la développer (on la garde pour le Ch.2). Cela renforcerait la transition 1.5 → 2.1.

### 1.2. Fil transversal générationnel

**Bien porté au Ch.1**, notamment dans 1.5 (taux de rendement interne 5,8 % → 0,8 % en deux générations, ratio 159 % → 117 % → 120 %, « les jeunes paieront pour les autres davantage qu'on ne paiera pour eux »). C'est exactement ce qu'annonce le JOURNAL.md (« angle générationnel transversal validé »).

**Au Ch.2, le fil générationnel disparaît presque totalement.** Le cas-type chiffré est un actif de 30 ans en 2026 — donc né en 1996 —, ce qui est cohérent, mais la dimension « ce que les Boomers ont eu et que les Millennials n'auront pas » n'est jamais formulée explicitement. Une phrase serait facile à insérer dans la section « Combien ça vaut, concrètement ? » pour relier le gain à la perte sèche subie par les générations actuelles.

### 1.3. Incarnation (personnages)

Le plan annonce quatre personnages : **Sylvie** (infirmière, 47 ans), **Alex** (ingénieur Mistral, 31 ans), **Margaux** (consultante indépendante), **Bernard** (dirigeant ETI). Statut actuel :

| Personnage | Avant-propos | Intro | Ch.1 | Ch.2 | Statut |
|------------|--------------|-------|------|------|--------|
| Sylvie | — | — | annoncée 1.5 du plan | — | **Absente** (Ch.1 utilise « cas-type » impersonnel) |
| Alex | — | — | — | annoncé 2.5 du plan | **Absent** (Ch.2 utilise « actif de 30 ans ») |
| Margaux | — | — | — | — | Jamais apparue |
| Bernard | — | — | — | — | Jamais apparue (prévue Ch.3) |

**Alerte** : l'incarnation annoncée dans l'avant-propos (« Sylvie, Alex, Margaux, Bernard ») a complètement disparu de la rédaction. Soit on abandonne ces personnages (et il faut alors retirer leur mention de l'avant-propos), soit on les fait revenir dans Ch.1.5 (Sylvie) et Ch.2.5 (Alex) — ce que prévoit explicitement le plan.

### 1.4. Transitions inter-chapitres

- **Avant-propos → Intro** : fluide, l'intro reprend le cas Doliprane (« Le Doliprane n'est pas un cas isolé »). Bon.
- **Intro → Ch.1** : pas de transition explicite. L'intro s'achève sur « Et qu'elle se referme » (la fenêtre des transmissions) ; Ch.1 ouvre sur le mécanisme de la répartition. La jonction est sèche.
- **Ch.1 → Ch.2** : le Ch.1 se termine sur « chaque année qui passe ajoute à la facture ». Ch.2 ouvre sur « Capitalisation. Ce simple mot suffit à déployer tout un ensemble de caricatures ». La transition existe en creux (Ch.1 montre l'impasse, Ch.2 propose l'alternative) mais elle n'est pas portée par la dernière phrase de Ch.1 ni par la première de Ch.2. La Charte (règle 9) exige un « pont vers le chapitre suivant » en conclusion. **Cette phrase de pont manque au Ch.1.**
- **Ch.2 → Ch.3** : la phrase de pont existe et fonctionne (« C'est pour le réduire — pas pour le remplacer — qu'il faut maintenant regarder ce que coûte, pour la France et pour ses entreprises, l'absence d'un pilier capitalisé. C'est l'objet du chapitre suivant »).

---

## 2. Cohérence des chiffres

### 2.1. Tableau des principaux chiffres-piliers

| Chiffre | Avant-propos | Intro | Ch.1 | Ch.2 | PLAN | Verdict |
|---------|--------------|-------|------|------|------|---------|
| GPFG (Norvège) — taille fin 2024 | **1 950 Md USD** | **1 950 Md USD** | — | **1 900 Md EUR** (19 742 Md NOK) | 1 950 Md USD | Cohérent (l'un en USD, l'autre en EUR — il faudrait juste vérifier que la conversion 19 742 NOK ≈ 1 900 EUR ≈ 1 950 USD tient ; à 11,2 NOK/USD en 2024, on a bien ≈ 1 762 Md USD ≈ 1 700 Md EUR. **L'avant-propos et l'intro affichent 1 950 Md USD, qui est probablement nominal sur-arrondi**). À aligner. |
| Cotisation vieillesse totale France | — | **27,8 %** | **27,8 %** | **28 %** (note 38 : « approximée à 28 % ») | 27,8 % | **Légère divergence** : Ch.2 utilise 28 % pour la modélisation, Ch.1+Intro utilisent 27,8 %. Différence numérique mineure mais visible. |
| Ratio cotisants/retraités 2024 | — | — | **1,79** | — | 1,79 | Cohérent. |
| Ratio cotisants/retraités 2070 | — | — | **1,40** | — | 1,41 | **Mini-divergence** : Ch.1 dit 1,40 ; PLAN dit 1,41. À aligner. |
| ICF 2024 France | — | — | **1,61** | — | 1,68 (donnée 2024) | **Divergence** : PLAN dit 1,68 ; Ch.1 dit 1,61. La donnée INSEE 2024 a été révisée à la baisse (1,62 puis 1,61 selon les vagues). **Le PLAN n'est pas à jour**, Ch.1 a la donnée la plus récente. |
| Naissances/décès 2024 ou 2025 ? | — | — | Solde 2025 = −6 000 ; 2024 = +17 000 | — | — | OK Ch.1, **MAIS Charte-style donne en exemple « solde 2024 = 17 000 » → la Charte n'est pas à jour** |
| Espérance de vie naissance 2025 F/H | — | — | **85,9 / 80,3** | — | — | OK |
| Espérance vie résiduelle à 65 ans | — | — | F 23,9 / H 20,2 | — | — | OK |
| Pop 65+ au 1er janvier 2026 | — | — | **22,2 %** | — | — | OK |
| Déficit COR tendanciel 2070 | — | **−1,4 pt PIB**, ≈ 45 Md€/an | **−1,4 pt PIB**, 45 Md€/an | — | −1,4 pt PIB / 45 Md€ | Cohérent. |
| Déficit COR 2030 | — | **−0,2 pt PIB** | **−0,2 pt PIB** | — | −0,2 pt PIB | Cohérent. |
| Déficit Beaufret | — | — | **81 Md€/an** | — | 81 Md€ (implicite via PLAN Ch.6) | Cohérent. |
| Encours PER fin Q3 2024 | — | **119 Md€**, **11 M** titulaires | — | **118,9 Md€**, **11,2 M** titulaires (~10 600 €/personne) | 118,9 Md€ / 11,2 M / 10 600 € | **Mini-divergence** : Intro arrondit à 119 et 11 M ; Ch.2 utilise 118,9 et 11,2 M. **Recommandation** : harmoniser à 118,9 Md€ / 11,2 M titulaires (chiffres exacts du communiqué Bercy fév. 2025). |
| Encours total fonds de pension/ PIB France | — | **2,5 %** | — | — | 2,5 % | OK (mais évidemment à actualiser, c'est 2,5 % de 2 800 Md€ ≈ 70 Md€, alors que Ch.1 cite 210 Md€ — divergence interne à l'Intro `[^i15]` qui dit 210 Md€ → ratio ≈ 7,5 % et non 2,5 %). **Voir 2.3 ci-dessous.** |
| Taux de remplacement net France OCDE | — | **70 % (cas type)**, **71,9 %** (en note `[^i9]`) | — | **74,4 %** (génération 1963, COR) | 70 % vs 96 % NL | **Divergence importante** : Intro cite 70-71,9 % OCDE ; Ch.2 cite 74,4 % COR. Ce sont deux mesures différentes (OCDE = standard international ; COR = cas-type français spécifique). **Le lecteur doit pouvoir s'y retrouver** — recommandation : Ch.2 ajoute une phrase qui dit explicitement « selon le COR cas-type français » par opposition à l'OCDE. |
| Taux de remplacement Pays-Bas | — | **96 %**, **93,2 %** (en note) | — | — | 96 % | **Petite divergence interne à l'Intro** : 96 % dans le texte, 93,2 % dans la note. À harmoniser (probablement le texte arrondit). |
| Cotisation vieillesse Pays-Bas | — | **22 %** | — | **22-23,5 %** (Suède, ITP-SAF-LO compris dans Ch.1) | 22 % NL / 27,8 % FR | Petite imprécision Ch.2 sur Suède : 18,5 % + 4 à 5 % = 22-23,5 %. Cohérent globalement. |
| TRI génération 1950 | — | — | **5,8 %** | — | — | OK |
| TRI génération 1980 | — | — | **1,9 %** | — | — | OK |
| TRI génération 2000 | — | — | **0,8 %** | — | — | OK |
| TRI « cotisation actuelle » | — | — | — | **1-2 %/an** | — | Cohérent avec Ch.1 (zone 0,8-1,9 % pour les cohortes actives). |
| Performance 10 ans CalPERS | — | **7,6 %** (note `[^i14]`) | — | — | 7,6 % | OK |
| Performance 10 ans CPPIB | — | **8,3 %** | — | **8,3 %** | 8,3 % | OK |
| Performance 10 ans AP3 / AP-fonds | — | **7,6 %** (AP3) | — | **7,6 %** (AP1-AP4) | 7,6 % | OK |
| Performance ABP 2024 | — | **6,2 % réel** (note `[^i14]`) | — | **8,6 % nominal** | 8,6 % | **Divergence apparente** : Intro cite 6,2 % réel sur 10 ans ; Ch.2 cite 8,6 % nominal 2024. Les deux mesures sont compatibles mais le lecteur peut s'y perdre. **Recommandation** : qualifier explicitement (« 6,2 % réel sur 10 ans » vs « 8,6 % nominal sur la seule année 2024 »). |
| Performance AustralianSuper 10 ans | — | — | — | **7,94 %** | 7,94 % | OK |
| Performance GPFG long terme | — | — | — | **6,3 % nominal**, **4,1 % réel net** depuis 1998 | 6,3 % / 4,1 % | OK |
| Encours ABP | — | — | — | **542 Md€** | 542 Md€ | OK |
| Encours PFZW | — | — | — | **259 Md€** | 259 Md€ | OK |
| Cas-type Ch.2 — pension scénario A | — | — | — | **24 723 €/an**, cumul 20 ans 494 466 € | 24 723 € / 494 466 € | OK (cohérence avec modélisation Python validée à 0,0000 %) |
| Cas-type Ch.2 — gain scénario B | — | — | — | **+228 364 €** (capital 216 240 €) | +228 364 € | OK |
| Cas-type Ch.2 — gain scénario C | — | — | — | **+456 729 €** (capital 432 480 €) | +456 729 € | OK |
| 50 % CAC 40 aux non-résidents | — | **50 %** (1 083 Md€ sur 2 165) | — | — | 50 % | OK |
| 36,5 Md€ dividendes captés | — | **36,5 Md€** (calcul OVLA détaillé) | — | — | 36,5 Md€ | OK |
| 240 000 PME sans repreneur | — | **240 000** d'ici 2030 | — | — | 240 000 | OK |

### 2.2. Divergence majeure — Mercer CFA Global Pension Index 2025

**Le même rapport est cité avec deux jeux de chiffres incompatibles :**

| Élément | Ch.1 (note `[^56]`) | Ch.2 (note `[^25]`) | Vérité probable* |
|---------|---------------------|---------------------|------------------|
| Date publication | **novembre 2025** | **octobre 2025** | Octobre 2025 (date traditionnelle Mercer) |
| Pays-Bas rang | 1er, **84,8/100** | Grade A | OK |
| France score global | **53,7/100** | **70,3/100** | **Incompatible — divergence de 16,6 points** |
| France classement | **33e mondial sur 48** | « Grade B » (sans rang) | Le 33e rang serait incohérent avec un grade B (le grade B exige typiquement un score 65-75). |
| France viabilité | **49,0/100** | **48,6/100** | Convergent (différence négligeable) |
| France adéquation | — | **85,2/100** | — |
| France intégrité | — | **76,8/100** | — |
| Comparaison Danemark/Pays-Bas viabilité | Danemark 81,6 ; NL 79,0 | — | — |

> *« Vérité probable » : sans accès au rapport, je ne peux pas trancher définitivement. La rédaction la plus crédible est celle du Ch.2 (score 70,3 / grade B / viabilité 48,6) car cohérente avec les classements habituels de la France (B/B+ depuis plusieurs éditions) et conforme à la base PLAN-REVISE.

**Action prioritaire #1** : ouvrir le rapport Mercer CFA 2025, fixer un seul jeu de valeurs, l'appliquer à Ch.1 + Ch.2 + bibliographie en une seule passe.

### 2.3. Divergence interne à l'introduction sur l'encours retraite/PIB

Intro `[^i15]` :
> « Composition des actifs d'épargne retraite capitalisée en France à fin 2024 : […] Total : 200-210 Md€, **soit 2,5 % du PIB français (~ 2 800 Md€)**. »

210 / 2 800 = 7,5 %, pas 2,5 %.

**Action prioritaire #2** : corriger la note `[^i15]`. Soit le total est 70 Md€ (= 2,5 % de 2 800), soit le pourcentage est 7,5 %. Probablement le bon chiffre est « 2,5 % du PIB » selon Thinking Ahead (qui ne compte que les vrais fonds de pension structurels, pas ERAFP+FRR+PER), donc le total à retenir est plutôt de l'ordre de 70 Md€ et il faut **distinguer** les 210 Md€ d'« épargne retraite tous dispositifs » des 70 Md€ « vrais fonds de pension » comparables aux références internationales.

### 2.4. Croissance Trente Glorieuses — incohérence interne Ch.1

- Ch.1 §81 (texte) : « La France des Trente Glorieuses connaît une croissance moyenne de **5,5 % par an** entre 1949 et 1973 »
- Ch.1 note `[^34]` : « Croissance moyenne annuelle du PIB en France sur la période 1949-1973 : environ **5,3 %**. »

Action : trancher 5,3 % (consensus historique INSEE) et harmoniser.

---

## 3. Cohérence des sources

### 3.1. Attribution erronée de l'article INSEE 2015 sur le TRI

C'est une **alerte majeure**.

- Ch.1 note `[^39]` et `[^51]` : « INSEE, **Breuil-Genier P., Blanchet D., Tô M.**, *Le taux de rendement interne du système de retraite français…*, *Économie et Statistique* n° 481-482, 2015. »
- Ch.2 note `[^3]` : « Estimation issue de **Yves Dubois et Anthony Marino**, *Le taux de rendement interne du système de retraite français…*, INSEE, *Économie et Statistique* n°481-482, 2015. »

**Le même titre, dans la même revue, le même numéro, la même année — mais avec deux jeux d'auteurs différents.** La vérité (URL identique : `https://www.insee.fr/fr/statistiques/1305193`) est que l'article est signé **Yves Dubois et Anthony Marino**. Breuil-Genier, Blanchet, Tô sont les auteurs du modèle **Destinie 2** (qui est l'outil utilisé dans l'article), pas de l'article TRI lui-même.

**Action prioritaire #3** : corriger Ch.1 notes `[^39]` et `[^51]` en remplaçant les auteurs par Dubois & Marino, en conservant la mention du modèle Destinie 2 comme outil.

### 3.2. Divergence sur les valeurs de TRI par génération entre Ch.1 et Ch.2

Les deux chapitres citent le même article INSEE 2015 mais avec des valeurs différentes :

| Génération | Ch.1 `[^51]` | Ch.2 `[^3]` |
|------------|--------------|-------------|
| 1940 | 7-8 % | — |
| 1946 | — | « 2-3 % » |
| 1950 | 5,8 % | — |
| 1960 | 3,8 % | — |
| 1963 | — | « ≈ 1,5 % » |
| 1970 | 2,8 % | — |
| 1975+ | — | « 1-1,5 % » |
| 1980 | 1,9 % | — |
| 1990 | 1,5 % | — |
| 2000 | 0,8 % | — |

**Les deux chapitres mobilisent la même source mais avec des courbes radicalement différentes.** Ch.1 donne 5,8 % pour la cohorte 1950 ; Ch.2 donne 2-3 % pour la cohorte 1946. Sur quatre ans d'écart, le TRI ne peut pas passer de 2-3 % à 5,8 %.

Hypothèse : Ch.1 utilise les valeurs Dubois-Marino actualisées par le salaire moyen par tête (SMPT) ; Ch.2 utilise probablement les mêmes valeurs actualisées différemment (par exemple par l'inflation, ou actualisées post-réforme 2023). **Mais cette différence n'est pas explicitée**.

**Action prioritaire #4** : harmoniser les valeurs ou expliciter la différence d'actualisation entre les deux chapitres.

### 3.3. Référence UBS vs Credit Suisse

- PLAN-REVISE : « **Credit Suisse** *Global Investment Returns Yearbook* (Dimson-Marsh-Staunton) »
- Ch.2 : correctement « **UBS** *Global Investment Returns Yearbook 2025* » (Credit Suisse a été racheté par UBS en mars 2023 ; depuis 2024 le Yearbook est édité par UBS).

**Action** : mettre à jour le PLAN-REVISE.

### 3.4. Bibliographie — décalage notable avec le manuscrit réel

`bibliographie.md` mentionne :
- **mercer-pension-index-2024** (Mercer 2024) → les chapitres citent en réalité **Mercer 2025**, à actualiser.
- **insee-pyramide-2024** : « *Bilan démographique 2024*, janvier 2025 » → mais Ch.1 cite « *Bilan démographique 2025*, janvier 2026 » (INSEE Première n° 2087). **À mettre à jour**.
- **gpfg-2024** : seul le rapport annuel 2024 listé, mais avec URL générique → à compléter avec l'URL précise du rapport.
- **Manquent en bibliographie** (sources réellement citées) :
  - Dubois & Marino INSEE 2015
  - Beaufret Fondapol 2025
  - Cour des comptes février 2025 (situation financière retraites)
  - INSEE *Bilan démographique 2025*
  - OCDE *Longevity gains and the IRR of PAYG plans* (revue *Journal of the Economics of Ageing* 2025)
  - Commission européenne *2024 Ageing Report*
  - Cleiss 2024
  - Pensionsmyndigheten 2024
  - AP-fonderna 2024-2025
  - ABP/PFZW 2024
  - NEST UK *Annual Report 2024-25*
  - APRA 2024-2025
  - Industriens Pension 2024
  - AustralianSuper 2025
  - CDPQ 2024
  - ACPR n°170 et n°175
  - AFG 2024
  - Bercy PER Q3 2024
  - Vernimmen dividendes CAC 40 2025
  - Banque de France détention CAC 40 par non-résidents 2024
  - Norges Bank Investment Management *Annual Report 2024*
  - Direction sécurité sociale *Compte protection sociale 2024*
  - Sondage Odoxa-Groupama novembre 2025
  - Tirole 2016, Malkiel 2019, Ellis 2021

**Action prioritaire #5** : mise à jour complète de la bibliographie. C'est un chantier de 1 à 2 heures qui devrait suivre la prochaine validation Ch.2.

### 3.5. Précision « Credit Suisse Yearbook »

Note Ch.2 `[^36]` cite « Credit Suisse / UBS ». La référence correcte 2025 est purement UBS. Le passage texte du Ch.2 dit bien « UBS et trois professeurs de la London Business School » — cohérent. La bibliographie centralisée n'a pas l'entrée.

### 3.6. Référence « OCDE Longevity gains » (Ch.1 note `[^57]`)

Ch.1 cite « OCDE, *Longevity gains and the internal rate of return of PAYG pension plans […]*, *Journal of the Economics of Ageing*, 2025 ». **Attention** : un article publié dans une revue scientifique privée (Elsevier *Journal of the Economics of Ageing*) n'est pas une publication OCDE, même si certains auteurs sont rattachés à l'OCDE. À reformuler : « Article académique paru dans le *Journal of the Economics of Ageing*, 2025 » ou « OCDE Working Paper… ». À vérifier.

---

## 4. Structure & non-redites — vérification du Ch.2 restructuré

### 4.1. Suppression des objections (§7 et §8 déportées au Ch.6)

J'ai cherché toutes les mentions « Enron », « Madoff », « Detroit », « 2008 », « subprimes », « krach » dans le Ch.2. Résultat :

- Ligne 5 : « les *subprimes* de 2008, le « capitalisme financier », **Enron, Madoff**... quasiment la fin du monde » → mention **rapide en ouverture**, sans développement. **Conforme** à la restructuration (mention pour signaler le tabou, sans traiter l'objection). Bon point.
- Aucune autre occurrence de Enron / Madoff / Detroit dans le corps du Ch.2.

**La suppression est propre.** Les objections sont bien sorties.

**Manque cependant la mention de renvoi explicite vers Ch.6** : la phrase d'ouverture aurait pu se conclure par « — toutes ces objections seront traitées frontalement au chapitre 6 ». Cela tisserait le fil et préviendrait le lecteur. À ajouter en une demi-phrase.

### 4.2. Alignement avec le PLAN-REVISE Ch.6

Le PLAN-REVISE Ch.6 est **bien mis à jour** : il intègre :
- Q.1 « La bourse, c'est le casino : et si tout s'effondre ? » (avec krachs 2000/2008/2020/2022, glide path AP7-NEST-TSP, garanties DNB-PPF-Garantipension, performances GPFG-CPPIB-AustralianSuper-AP7)
- Q.2 « Et Enron, Madoff, Detroit ? » (déportée du Ch.2)
- Le contenu chiffré est conforme à ce qui était dans la version `.bak-pre-suppression-objections` du Ch.2.

**Action de vérification** : ouvrir le fichier `.bak-pre-suppression-objections` (73 ko vs 47 ko actuel) et confirmer que tous les chiffres et arguments ont bien été repris dans le PLAN Ch.6 sans perte. (Hors périmètre de cet audit, mais à prévoir.)

### 4.3. Redites internes au Ch.2 après fusion §5 dans §2

Section 2.2 « Anatomie d'un euro cotisé » contient maintenant l'intégralité du discours sur le rendement composé. Vérifications :

- L'argument « le temps ne se rattrape pas / les dix premières années valent plus que les trente suivantes » est dans 2.2 (§37). Pas de répétition ailleurs.
- L'argument « 4 % réel sur 40 ans → ×4,8 » est dans 2.2 (§35) et dans la note `[^33]`. Cohérent.
- L'argument *r > g* (Piketty) est dans 2.2 (§41). Pas répété.
- Le *Yearbook* UBS 5,2 % est dans 2.2 (§43). Pas répété.

**Bilan : fusion propre.** Pas de redites résiduelles repérées.

### 4.4. Redite Ch.1 ↔ Ch.2 sur le diagnostic

Vérifications :

| Élément | Ch.1 | Ch.2 |
|---------|------|------|
| Mécanisme répartition (« tuyau ») | §9 « Le système fonctionne comme un tuyau » | §13 « Le système agit comme un tuyau et non comme un coffre » |
| Métaphore « coffre vs tuyau » | — | §15 + §51 « passer une nuit dans un hôtel et y être propriétaire d'une chambre » |
| 1945 architecture | §75-79 détaillée | §15 « depuis 1945, l'ossature unique du système français » |
| TRI bas | §117-121 (1,9 / 0,8 / etc.) | §25 « entre 1 % et 2 % par an » |

**Pas de doublon véritable**. Le Ch.2 réutilise la métaphore « tuyau » pour appeler son contraste « coffre » (justifié pédagogiquement), et il actualise le TRI à la valeur courante (1-2 %) en référence à la fourchette des cohortes actives — cohérent avec Ch.1 §119.

**Frontière nette** entre les deux chapitres :
- Ch.1 = diagnostic répartition
- Ch.2 = pédagogie capitalisation + modélisation

**OK.** La restructuration tient.

### 4.5. Note `[^32]` manquante dans Ch.2

Recherche des notes dans Ch.2 : la séquence saute de `[^31]` (Einstein apocryphe) à `[^33]` (table des puissances 1,04^n). **Il n'y a pas de note `[^32]`.**

Action : soit renuméroter, soit ajouter la note `[^32]` manquante (à voir si elle a sauté lors de la fusion §5→§2).

### 4.6. Note `[^33]` mal positionnée ?

`[^33]` est ancrée dans la phrase « sur quarante --- la durée d'une carrière ---, il est multiplié par 4,8 ; sur cinquante ans, par 7,1 ». Cohérent.

---

## 5. Ton & AI-slop résiduel

### 5.1. Avant-propos & introduction

Ton homogène, voix d'auteur claire, anti-AI-slop : **pas d'alerte.**

### 5.2. Ch.1 (régénéré du DOCX modifié par l'auteur)

Le ton est globalement engagé, conforme à la Charte. Quelques points :

- **Ligne 9** : faute de frappe / tic de relecture : « Ce mécanisme a peut **a priori** présenter deux qualités » → « peut a priori présenter ». À corriger.
- **Ligne 17 (titre)** : « Le grand **viellissement** » → « vieillissement » (orthographe).
- **Ligne 19** : « C'est l'un des documents les plus **important** » → « importants ».
- **Ligne 41** : double placeholder mal scellé `[COURBE RATIO COTISANTS / RETRAITES]{.mark} [JUSQUEN 2070 SOURCE COR]{.mark}` — l'un complète l'autre, à fusionner en une seule légende.
- **Ligne 67** : « Pierre Moscovici, ex-£premier président » → caractère parasite « £ ».
- **Ligne 75-95** : intéressant — *style légèrement « notice historique »*, avec énumération de dates (1816, 1670, 1928, 1941, 1945, 1947, 1961, 1982), risque de plomber le lecteur. La règle 4 de la Charte exige des chiffres incarnés ; ici, c'est de l'histoire, donc différente exigence — mais on peut alléger.
- **Ligne 139** : « il est, **à la lettre**, sans issue dans le cadre actuel » — la Charte (JOURNAL.md « anti-modèles ») cite « à la lettre » comme tic à éviter. À reformuler (« il est sans issue dans le cadre actuel »).
- **Ligne 111** : « Quelle injustice ! » — exclamation de commentateur, registre un cran trop oral pour le reste. La Charte autorise l'engagement, mais préférer « C'est, simplement, une injustice. » ou supprimer.
- **Tics positifs** : « Le système agit comme un tuyau » (métaphore filée, conforme à la règle 10), « Cinq pansements sur la même jambe » (ligne 105, conforme), « C'est de l'arithmétique appliquée à du temps long » — bonne voix d'auteur.

**Bilan Ch.1** : ton bon mais 4-5 micro-corrections de surface à faire.

### 5.3. Ch.2 (rédigé par agent)

Plusieurs résidus AI-slop ou maladresses :

- **Ligne 7** : « Ce chapitre vise à **rationnaliser lees** termes du débat » → « rationaliser les ». Double faute de frappe.
- **Ligne 9** : « **Voilà**. Il n'y a pas de mystère. C'est de l'arithmétique appliquée à du temps long. » → « Voilà » seul en phrase isolée est un tic AI-slop ; la formule « C'est de l'arithmétique appliquée à du temps long » est exactement la même qu'au Ch.2 introduction et est répétée. À reformuler.
- **Ligne 27** : « (comme en Suède, aux Pays-Bas, en Australie ---, le voyage » → parenthèse mal fermée (« ( » sans « ) »), virgule sans antécédent.
- **Ligne 33** : « Mille milliards de petits articles » — registre familier (« mille milliards de petits articles ») qui détonne. À reformuler : « Une littérature abondante de chroniques financières ».
- **Ligne 41** : « C'est, mathématiquement, le départ entre capitalisation et répartition. » — « le départ entre » est mal construit. Probablement « la différence » ou « la séparation ».
- **Ligne 99** : « Voilà ce qu'on touchera, à comportement et législation inchangés. » — « Voilà » répété (deuxième occurrence comme tic). La Charte et le JOURNAL listent « Voilà ce que… » comme anti-modèle explicite.
- **Ligne 111** : « Voilà, en chiffres, ce que coûte… » — **troisième** occurrence de « Voilà » au Ch.2. À varier.
- **Ligne 35** : « L'intérêt composé, c'est l'intérêt qui produit lui-même de l'intérêt. » — phrase pédagogique correcte, mais immédiatement suivie de « Sur dix ans, à 4 %, l'écart avec un intérêt simple reste discret » — bonne mise en mouvement.
- **Ligne 75** : « il faut donc lui rendre service en la distinguant de ce avec quoi on la confond » → tournure maladroite (« ce avec quoi on la confond » est tolérable mais lourd).
- **Ligne 35** : « Allongez l'horizon, et les ordres de grandeur changent » — bon.
- **Ligne 73** : « pas par manque d'idée. **Par refus.** » → bonne pause-paradoxe (technique D de la Charte). Conserver.
- **Ligne 89** : « Aucun pays parmi les trente-huit membres de l'OCDE qui a institué un pilier de capitalisation structurel ne l'a démantelé ensuite […]. La capitalisation, une fois en place, devient consensuelle. » — bonne formule.
- **Ligne 105** : « À ce stade-là, on ne parle plus de pourcentages, on parle d'achats immobiliers complets ou de plusieurs années supplémentaires de vie. » — incarnation forte (règle 4 Charte). Conserver.
- **Ligne 111** : « C'est un siècle de patrimoine. » — chute. Très bonne.

**Bilan Ch.2** : ton globalement OK, mais 3 occurrences de « Voilà », « à la lettre » à supprimer, 4-5 fautes de frappe, 2 phrases à reformuler. Quinze minutes de relecture devraient suffire.

### 5.4. Anaphores et constructions stéréotypées repérées

Recherches ciblées :
- « Voici ce que » : 0 occurrence dans Ch.1, 0 dans Ch.2. **Bon.**
- « Pour qui sait » : 0 / 0. **Bon.**
- « Loin d'être » : 0 / 0. **Bon.**
- « Force est de constater » : 0 / 0. **Bon.**
- « C'est, dans les mots mêmes de » : 0 / 0. **Bon.**
- « À la lettre » : 1 occurrence Ch.1 (ligne 139) — **à corriger.** 0 Ch.2.
- « Voilà » en début de phrase : 0 Ch.1, **3 occurrences Ch.2** — à varier.

---

## 6. Charte stylistique — conformité aux 12 règles

| Règle | Avant-propos | Intro | Ch.1 | Ch.2 |
|-------|--------------|-------|------|------|
| 1. Ouverture ≤ 3 phrases | OK (1 phrase pivot Octobre 2024) | OK (1 phrase « Le Doliprane n'est pas un cas isolé ») | OK (en réalité 1 phrase d'ouverture, suivie d'explication) | **À surveiller** (1 paragraphe sur la définition « Capitalisation » + raclage de gorge avant l'attaque) |
| 2. Phrases 18-22 mots / aucune > 50 | Globalement OK | OK | OK | **Une phrase de 52 mots ligne 99 (cas-type scénario A)** — à découper |
| 3. « Je » parcimonieux | « je » 0 fois (paradoxe assumé via « nous ») | « nous » 1 fois (« ce que nous appelons le hold-up silencieux ») | « je » 0 fois | « je » 2 fois (« je crois qu'on ne peut discuter… » §7 ; « à mes yeux » §93) — OK ≤ 3/page |
| 4. Chiffres incarnés | Excellent (16 Md€, 225 % vs 2,5 %, etc.) | Excellent (36,5 Md€ = budget Éduc nationale) | OK (équivalences budget Intérieur+Justice, budget défense) | **Faible** : la modélisation chiffrée est dense mais peu incarnée. Les 228 k€ deviennent « achats immobiliers complets » seulement à la toute fin (§105). À renforcer plus tôt. |
| 5. Anecdotes preuves | Excellent (Doliprane détaillé, Exxelia, Photonis, Ariane 6) | Excellent (galerie Lafarge-Alstom-Technip-Latécoère-Photonis-Exxelia-Ariane-Doliprane) | OK (cinq actes des réformes) | **Aucune anecdote incarnée** — pas de Sylvie, pas d'Alex, pas de cas réel. Faiblesse. |
| 6. Engagement progressif | OK | OK | OK | OK |
| 7. Argument adverse | OK (« argument est honnête. Il l'est resté longtemps » ligne 79 Ch.1) | OK | OK (CGT, Beaufret traités frontalement) | **Léger** : Ch.2 n'expose pas la « peur » avant de la démonter sur la capitalisation. Les 4 malentendus (§59-71) sont des démontages, pas des objections présentées dans leur meilleure version. Pas grave puisque le Ch.6 est dédié — mais la Charte (règle 7) le demanderait. |
| 8. Transitions invisibles ou questionnantes | OK | OK | **Une transition mécanique** : « Cinq actes, sur trente ans, autour des mêmes trois paramètres » — fonctionne. | OK (« Voilà, en chiffres, ce que coûte… » mais « Voilà » à éviter) |
| 9. Conclusion triple ≤ 150 mots | N/A | OK (« Reprenons. Octobre 2024 […]. Parce que la fenêtre, comme on va le voir, n'est pas grande. Et qu'elle se referme. ») | **Manque conclusion type triple récap-implication-pont.** Ch.1 se termine sur « chaque année qui passe ajoute à la facture » — c'est un constat, pas une triple. | **Conclusion correcte** (« C'est pour le réduire — pas pour le remplacer — qu'il faut maintenant regarder… »). |
| 10. Métaphores structurantes | Mécanique présente (mâchoire implicite, schizophrénie) | Mécanique présente (« architecture », « monopilier vs multipilier ») | Mécanique forte (« tuyau », « pansement », « facture ») | Mécanique forte (« coffre », « tuyau », « infrastructure ») |
| 11. Vocabulaire soutenu mais oral | OK | OK | OK | **Quelques familiarités** : « bête comme chou » §39, « Mille milliards de petits articles » §43, « C'est de l'arithmétique appliquée à du temps long » répété → à modérer |
| 12. Sourçage 2-4 notes/page | OK | Excellent (12 notes / 10 p.) | Excellent (65 notes / 15 p.) | **Très excellent** (44 notes / 10 p. = 4,4/p., dans la fourchette haute mais OK) |

---

## 7. Plan vs réalité

### 7.1. Volumes (pages cibles vs longueur réelle estimée)

Estimation à 350 mots par page manuscrit :

| Bloc | Cible plan | Mots réels | Pages réelles | Écart |
|------|------------|------------|---------------|-------|
| Avant-propos | 10 p. / 2 800 mots | ≈ 2 100 | 6 | **−4 p.** |
| Introduction | 10 p. / 2 800 mots | ≈ 3 600 | 10 | OK |
| Ch.1 | 15 p. / 4 200 mots | ≈ 8 100 (avec notes) / ≈ 5 800 (sans notes) | 16-18 | **OK, légèrement long** |
| Ch.2 | 13 p. / 3 640 mots | ≈ 5 500 (sans notes) | 15 | **+2 p.** |

**Sur les 4 blocs rédigés** : ≈ 38 p. réelles contre 48 p. annoncées. Différence modérée, l'avant-propos étant plutôt court.

### 7.2. Cohérence du PLAN-REVISE

- Ch.2 du plan **est à jour** (mention « RÉDIGÉ — restructuré le 15/05/2026 », sections 5 alignées avec ce qui a été écrit, sources clés mises à jour).
- Ch.6 du plan **est à jour** (mention « FORMAT Q/R », Q.2 Enron-Madoff-Detroit explicite, contenu chiffré conforme à la version pré-suppression du Ch.2).
- Ch.1 du plan **est légèrement obsolète** : il prévoit « 1.5 Encart Sylvie » mais Ch.1 rédigé n'inclut pas l'encart. Soit le plan suit (retirer Sylvie), soit le Ch.1 ajoute l'encart.
- Plan global : structure 7 chapitres + manifeste cohérente avec ce qui est écrit ; JOURNAL.md liste toujours « 8 chapitres » en quelques endroits → à harmoniser.

### 7.3. Découpage en pages annoncé (113 p. = 10+10+15+13+20+10+8+16+11+3) → cible 120

Marge confortable (~7 p.). Plan tient.

### 7.4. Personnages annoncés au plan mais non rédigés

Voir §1.3 ci-dessus : Sylvie, Alex, Margaux, Bernard. À acter dans la rédaction prochaine.

### 7.5. JOURNAL.md à mettre à jour

JOURNAL.md daté « 14 mai 2026 » alors qu'on est au 15 mai. Il indique « Ch.1 — draft E à venir » alors que la version régénérée du Ch.1 est en place. **Action** : mettre à jour le journal à la fin de cette session.

---

## 8. Bibliographie & prospective pour Ch.3 à 7

### 8.1. État actuel

`bibliographie.md` couvre une partie des sources mais est **largement obsolète** (voir §3.4). Elle date d'une phase antérieure (avant les drafts D-E du Ch.1 et la rédaction Ch.2). À refondre.

### 8.2. Sources critiques non encore mobilisées pour les chapitres à venir

**Ch.3 — Le capital absent et le hold-up silencieux** (le plus chargé en sources nouvelles)
- AFG *L'épargne financière des ménages T4 2024*
- ACPR *Le marché de l'assurance-vie en 2024* (n°170)
- BCE *Household Finance and Consumption Survey 2023*
- Fed *Survey of Consumer Finances 2022* (pour la comparaison patrimoine actions)
- Euronext *Annual Statistics 2024-2025*
- EY *Baromètre IPO France 2024*
- Banque de France *Patrimoine financier des ménages 2024-2025*
- Frédéric Pierucci *Le Piège américain* (déjà cité avant-propos, à formaliser)
- CDPQ *Rapport annuel 2024* (cas Bombardier)
- BPI France *Plan Transmission PME-ETI* (déjà en biblio)
- Ardian *Annual Report 2024* (déjà cité avant-propos)
- AMF *Cartographie des risques et tendances 2025*
- Vernimmen *Dividendes du CAC 40 2025* (déjà cité intro)
- Six Financial Information (calcul détention non-résidents)

**Ch.4 — Le mirage de la solitude française**
- Thinking Ahead Institute *Global Pension Assets Study 2025*
- Mercer CFA *Global Pension Index 2025* (à régler après §2.2 ci-dessus)
- APRA (Australie) *Quarterly superannuation performance statistics 2025*
- DWP UK *Workplace pensions: participation and savings trends 2024*
- *Pensioenwet* néerlandais (réforme 2023)
- BMAS Allemagne (Riester-Rente)
- COR fiches pays Suède / Allemagne / Royaume-Uni

**Ch.5 — La Suède**
- Pensionsmyndigheten *Rapports 2024-2025*
- AP-fonderna (AP1-AP7) *Annual Reports 2024*
- Collectum / Alecta *Données 2024-2025*
- Atomico *State of European Tech 2024* (pour Spotify-Klarna-Northvolt)
- Dealroom Sweden Report 2024
- COR *Le système de retraite en Suède 2019* + mises à jour

**Ch.6 — Cinq mensonges (Q/R)**
- Cahuc-Zylberberg *Le négationnisme économique* (déjà en biblio)
- IPP *Les inégalités de patrimoine en France 2024-2025*
- DARES *La culture financière des Français 2024*
- AMF *Baromètre épargne 2024-2025*
- DGTrésor *Modélisations transition 2026*
- Pension Protection Fund UK (couverture 8,8 M personnes)
- DNB Pays-Bas (funding ratio 105 %)

**Ch.7 — Vingt-cinq ans pour basculer**
- DG Trésor *Modélisations transition 2026*
- France Stratégie *Rapport souveraineté économique 2025-2026*
- Institut Montaigne *Rapports retraite/capitalisation 2024-2026*
- Sénat *Rapports d'information épargne longue*
- Australian Government *Superannuation Guarantee historique 1992-2025*

**Sources transversales à intégrer dès Ch.3** :
- Thomas Philippon *The Great Reversal* (référence anglo-saxonne sur la financiarisation et la productivité)
- Patrick Artus tribunes 2024-2026
- Élie Cohen / Pisani-Ferry / Saint-Étienne sur l'investissement long terme français

### 8.3. Sources à éviter (rappel JOURNAL.md)

- OFCE Sterdyniak, Périvier, Le Garrec, Coquet
- Économistes Atterrés (Lordon, Chavagneux)
- *Mediapart*, *Alternatives Économiques*, *Le Monde diplomatique*, *L'Humanité*, *Politis*

À tenir.

---

## Top 10 actions prioritaires (du plus urgent au moins urgent)

1. **Trancher le Mercer CFA Global Pension Index 2025**. Ouvrir le rapport ; fixer un seul jeu (score global France, sous-indice viabilité, rang mondial, date de publication) ; corriger Ch.1 `[^56]`, Ch.2 `[^25]`, biblio. **C'est l'alerte chiffrée majeure.**
2. **Corriger l'attribution Dubois & Marino vs Breuil-Genier-Blanchet-Tô**. Les auteurs réels de l'article INSEE 2015 sont Dubois & Marino. Corriger Ch.1 notes `[^39]` et `[^51]`. Réconcilier les valeurs de TRI par cohorte entre Ch.1 et Ch.2 (ou expliciter la différence d'actualisation).
3. **Corriger la note `[^i15]` de l'introduction** : « Total : 200-210 Md€, soit 2,5 % du PIB » est arithmétiquement faux (210/2 800 = 7,5 %). Distinguer « épargne retraite tous dispositifs » (210 Md€) et « fonds de pension structurels au sens TAI/OCDE » (≈ 70 Md€ = 2,5 % du PIB).
4. **Ajouter la note `[^32]` manquante au Ch.2** (séquence 31 → 33 sans `[^32]`). Soit insérer, soit renuméroter.
5. **Harmoniser cotisation vieillesse totale : 27,8 % vs 28 %**. Le standard est 27,8 % (Intro `[^i10]`, Ch.1 `[^53]`). Ch.2 §95 cite « 28 % » — à corriger ou à expliciter (« arrondi à 28 % pour faciliter la modélisation »).
6. **Nettoyer le ton du Ch.2** : 3 « Voilà » à varier, 2 fautes de frappe (« rationnaliser lees », parenthèse non fermée §27), 1 expression « Mille milliards de petits articles » à reformuler, 1 expression « bête comme chou » à atténuer.
7. **Nettoyer les coquilles du Ch.1** : « viellissement », « peut a priori présenter », « ex-£premier », doublé `[COURBE...][JUSQUEN...]`, « à la lettre » §139.
8. **Trancher le sort des personnages incarnés** (Sylvie, Alex, Margaux, Bernard). Soit on les introduit Ch.1.5, Ch.2.5, Ch.3.11 conformément au plan ; soit on les retire de l'avant-propos. Décision binaire à prendre avant d'attaquer Ch.3.
9. **Ajouter une phrase de pont en fin de Ch.1** vers Ch.2 (Charte règle 9, triple récap-implication-pont) : aujourd'hui Ch.1 se conclut sec sur « chaque année qui passe ajoute à la facture ».
10. **Mettre à jour la bibliographie** (`bibliographie.md`) : ajouter les ~20 sources réellement citées dans Ch.1-Ch.2 et absentes du fichier ; mettre à jour Mercer 2024→2025 ; mettre à jour INSEE Bilan démographique 2024→2025.

---

## Annexes — vérifications rapides supplémentaires

- **Métadonnées Pandoc** (`metadata.yaml`) : non audité dans cette passe, à vérifier que `lang: fr-FR` est bien défini et que la version pandoc-citeproc tournera correctement avec les footnotes.
- **Bibliographie centralisée** : structure OK mais contenu obsolète (cf. §3.4).
- **`METHODE.md`** : non audité dans cette passe.
- **`STYLE.md` vs `CHARTE-STYLE.md`** : deux fichiers de style coexistent. À vérifier qu'ils ne se contredisent pas (hors périmètre de cet audit).
- **`compile.sh`** : non audité.

---

*Fin du rapport d'audit. Rédigé sans modification du manuscrit. Recommandations à valider par l'auteur avant application.*

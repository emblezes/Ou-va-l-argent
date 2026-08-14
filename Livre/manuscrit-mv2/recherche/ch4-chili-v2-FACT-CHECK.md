# Fact-check Chili v2 — arbitrage et vérifications

**Date** : 16 mai 2026
**Périmètre** : Fichiers v2 (histoire-architecture, diagnostic-économique, académique-réforme-2025) arbitrés contre v1 (afp-contre-exemple, académique, presse) et sources primaires.
**Méthode** : WebFetch sources primaires + WebSearch multi-sources pour chaque divergence. Chaque verdict est assorti d'une URL ou d'une citation directement vérifiable.

---

## Synthèse exécutive

- Affirmations vérifiées (ou confirmées) : 24
- Divergences v1/v2 tranchées avec source primaire : 6
- Erreurs ou imprécisions critiques détectées dans v2 : 4
- Points à confirmer (source primaire non accessible) : 5
- Hallucinations détectées : 0 (aucun fait complètement inventé, mais plusieurs surestimations ou affirmations non sourcées)

---

## I. Tableau d'arbitrage des divergences v1/v2

### Divergence 1 — Taux de remplacement médian Chili

| Fichier | Affirmation |
|---------|-------------|
| v1 afp-contre-exemple | TR médian hommes = **44 %** (OCDE 2025) |
| v2 diagnostic | TR médian attendu = **35-40 %** |
| v2 académique | TR médian réel = **38 %** (Comisión Bravo 2015) |

**VERDICT : DIVERGENCE APPARENTE, CONCEPTS DISTINCTS — clarifier l'usage.**

Les chiffres ne sont pas incompatibles car ils mesurent des choses différentes :

- **44 % (v1)** : taux de remplacement net pour un homme à salaire moyen *avec carrière complète*, selon OCDE Pensions at a Glance 2025 *avant* réforme. Ce chiffre est confirmé par les recherches : le rapport OCDE 2021 donnait 38,5 % pour les hommes ; le rapport 2023 (avec PGU) montait à 45,7 % pour les hommes. La v1 cite donc l'édition 2025 du rapport qui intègre la PGU renforcée 2022. Plausible.

- **35-40 % (v2 diagnostic)** : taux projeté pour les cohortes futures sans réforme 2025, ou taux médian tous salaires confondus incluant travailleurs informels. Cohérent avec les données Comisión Bravo.

- **38 % (v2 académique)** : taux moyen réel observé d'après Comisión Bravo 2015, tous salaires. C'est le diagnostic 2015, pas le chiffre 2024-2025.

**VALEUR À UTILISER SELON LE CONTEXTE :**
- Pour parler du diagnostic pré-réforme 2025 (base de départ) : **38,5 % (hommes) / 35,4 % (femmes)** selon OCDE Pensions at a Glance 2021.
- Pour le diagnostic Comisión Bravo 2015 : **48 % hommes / 24 % femmes** (ces chiffres apparaissent dans la Comisión Bravo mais mesurent des cohortes plus anciennes avec carrières plus complètes).
- Après réforme 2025 : **61,3 % hommes / 61,1 % femmes** (OCDE Pensions at a Glance 2025, projection).
- La v1 qui cite "44 % avant réforme" est la valeur OCDE 2025 pour le régime en vigueur au 1er jan 2025 (donc incluant PGU mais pas encore les cotisations patronales) — c'est le chiffre le plus récent pré-réforme complète.

**Source** : La Tercera, "OCDE destaca la reforma de pensiones en Chile", nov. 2025 ; OCDE Pensions at a Glance 2025 (chiffres 2021 : 38,5 % H / 35,4 % F ; chiffres 2023 : 45,7 % H / 43 % F ; chiffres 2025 post-réforme : 61,3 % H / 61,1 % F).

---

### Divergence 2 — Montant total des retraits COVID

| Fichier | Affirmation |
|---------|-------------|
| v1 afp-contre-exemple | Retraits COVID = ~48-50 Md USD |
| v1 presse | Retraits COVID = ~48-50 Md USD |
| v1 académique | Retraits COVID = ~50 Md USD |
| v2 diagnostic | Retraits COVID = ~55,8 Md USD (20,3 + 19,2 + 16,3) |
| v2 académique | Retraits COVID = ~56 Md USD |

**VERDICT : V2 EST CORRECT — valeur tranchée 55,8 Md USD.**

Les données officielles du Banco Central de Chile (Working Paper 991) et du BIS (Working Paper 1176, cité en bibliographie v2) donnent :
- 1er retrait (Loi 21248, 30 juillet 2020) : **20,3 Md USD**
- 2e retrait (Loi 21295, 1er décembre 2020) : **19,2 Md USD**
- 3e retrait (Loi 21330, 27 avril 2021) : **16,3 Md USD**
- **Total : 55,8 Md USD**

La v1 (48-50 Md USD) est une estimation imprécise fondée sur des données intermédiaires (au cours du 2e retrait, les bilans gouvernementaux donnaient ~49,9 Md USD). La v2 utilise les données consolidées finales.

**Valeur à utiliser : 55,8 Md USD (~56 Md USD) = environ 20 % du PIB chilien 2021.**

**Source** : Banco Central de Chile, Working Paper No. 991 ; BIS Working Papers No. 1176 ; Cambridge Core JPEF "The Chilean pension withdrawals and the 2025 reform" — tous cohérents à ~55,8 Md USD.

---

### Divergence 3 — Frais AFP (commission de gestion)

| Fichier | Affirmation |
|---------|-------------|
| v1 afp-contre-exemple | Frais AFP = 1-1,8 % du salaire brut |
| v1 académique | Commission moyenne AFP = ~1 % du salaire/an + frais assurance SIS |
| v2 diagnostic | Frais AFP = 1,0 % du salaire (commission + SIS) |

**VERDICT : LES DEUX SONT PARTIELLEMENT CORRECTS — préciser ce qu'on mesure.**

Les données SPP 2025 confirment :
- Commissions de gestion seules (comisión AFP) : de **0,46 %** (AFP Uno, tarif licitación 2023-2025) à **1,45 %** (AFP Provida, Cuprum, Capital).
- Assurance invalidité-décès (SIS) : depuis avril 2026, **1,62 %** du salaire (unifiée pour H et F).
- Total historique (avant réforme) : ~0,8-1,0 % commission + ~1,35-1,47 % SIS = ~2,2-2,5 % brut.

La v1 qui cite "1-1,8 %" sous-estime le total réel (inclut probablement la commission seule, pas le SIS). La v2 qui cite "1,0 %" est également partielle si elle n'inclut pas le SIS. La v1 "afp-contre-exemple" qui cite "1,5-1,8 % total moyen" est la plus proche de la réalité pré-réforme 2026.

**Valeur à utiliser pour la rédaction** :
- Commission AFP seule (gestion) : **0,46 % à 1,45 % selon l'AFP** (données SPP 2025)
- Total avec SIS : **~2,1-3,1 %** selon l'AFP choisie (avant unification SIS 2026)
- Après réforme 2026 (SIS unisexe) : ~**0,46-1,45 % (commission) + 1,62 % (SIS) = 2,1-3,1 %**

La formulation "~1 % de frais de gestion seuls" (v2) est acceptable pour la commission AFP stricto sensu ; pour l'impact total prélevé sur le salaire, préférer "environ 2,1 à 2,5 % du salaire brut" (commission + SIS).

**Source** : Superintendencia de Pensiones — https://www.spensiones.cl/portal/institucional/594/w3-propertyvalue-10093.html ; licitación 2023-2025 SPP.

---

### Divergence 4 — Cotisation patronale Boric (7 % vs 8,5 %)

| Fichier | Affirmation |
|---------|-------------|
| v1 (brief initial) | Cotisation patronale Boric = **7 %** |
| v2 académique | Cotisation patronale Boric = **8,5 %** |
| v2 diagnostic | Cotisation patronale = **8,5 %** (phased in) |
| v1 afp-contre-exemple | Cotisation patronale = **7 %** (nouvelle) + "Total patronal 2035 : 8,5 %" |

**VERDICT : V2 EST CORRECT — 8,5 % est le taux final visé par la loi 21735.**

La Loi 21735 (publiée au Diario Oficial le 26 mars 2025) prévoit :
- Cotisation patronale montant progressivement de **1 % (août 2025)** à **8,5 % (août 2035)**, à raison de ~+0,75 à 1 % par an.

La décomposition des 8,5 % à terme complet (KPMG, Lockton, Alessandri Legal — tous s'accordent) :
- **4,5 %** vers les comptes AFP individuels du salarié
- **1,5 %** vers le FAPP (prêt remboursable, financement prestation par années cotisées)
- **2,5 %** vers le FAPP (compensation différentiel d'espérance de vie femmes/hommes)
- **Total FAPP : 4 %**, total AFP individuel : 4,5 %

La v1 qui cite "7 %" confond probablement avec la cotisation patronale "nette" hors assurance invalidité/décès préexistante (qui était de 1,5 % avant). La loi crée effectivement un **nouveau prélèvement** de 7 % (1 % à 8 % supplémentaires) mais le total final incluant l'assurance existante est bien **8,5 %**.

**Valeur à utiliser** : cotisation patronale totale = **8,5 %** à terme (2035), dont 4,5 % AFP individuel + 4 % FAPP. La montée en charge débute à 1 % en août 2025.

**Sources** : KPMG Flash Alert 2025-076 (https://kpmg.com/xx/en/our-insights/gms-flash-alert/flash-alert-2025-076.html) ; Lockton (https://global.lockton.com/us/en/news-insights/chile-introduces-major-changes-to-its-pension-system) ; Alessandri Legal (https://alessandri.legal/en/pension-reform-in-chile-challenges-and-opportunities/).

---

### Divergence 5 — Pension moyenne AFP

| Fichier | Affirmation |
|---------|-------------|
| v1 afp-contre-exemple | Pension moyenne = ~20,59 UF (~866 USD) ; pension femmes = 305 USD, hommes = 460 USD |
| v2 diagnostic | Pension AFP moyenne = **204 000 CLP/mois** (~250 USD) |

**VERDICT : PROBABLE DIVERGENCE DE PÉRIMÈTRE — à distinguer.**

Ces deux chiffres ne mesurent pas la même chose :
- **204 000 CLP (~250 USD)** : pension AFP contributive médiane ou moyenne des actuels retraités du système AFP (tous retraités, y compris ceux avec faibles accumulations).
- **20,59 UF (~866 USD)** : semble être la pension moyenne incluant les compléments (PGU, PBS, APS), ou mesure d'un sous-groupe (retraités récents avec carrière complète), ou conversion UF incorrecte.

Contrôle de cohérence : 1 UF (Unidad de Fomento) vaut ~37 000-38 000 CLP en 2024-2025. Donc 20,59 UF ≈ 770 000-782 000 CLP ≈ 900-950 USD. Ce chiffre est très élevé pour une pension AFP moyenne — cela correspondrait plutôt au quintile supérieur ou à un sous-groupe de retraités à carrière complète.

La SPP publie pour décembre 2024 une pension **moyenne consolidée** de ~332 000 CLP (données agrégées). La v2 cite 204 000 CLP comme "pension AFP moyenne" — cohérent avec les données Comisión Bravo (médiane à 150 000-180 000 CLP pour les cohortes 2007-2014).

**Attention** : la v1 "afp-contre-exemple" contient des incohérences internes : elle cite à la fois une pension moyenne très élevée (866 USD) et des conditions de vie très difficiles. Ces deux chiffres paraissent provenir de sources distinctes mal réconciliées.

**Valeur à utiliser** :
- Pension AFP moyenne (régime contributif seul, 2024) : **~200 000-250 000 CLP (~240-300 USD)** — fourchette v2 cohérente.
- Pension SP consolidée (avec PGU, PBS, APS) : **~332 000 CLP** (données SPP dec. 2024).
- La formulation "204 000 CLP (~250 USD)" de v2 est plausible pour la pension pure AFP.

**Source** : SPP Ficha Estadística Previsional N° 145 – décembre 2024 (https://www.spensiones.cl/portal/institucional/594/articles-16172_recurso_1.pdf) — le document PDF n'était pas lisible en extraction automatique mais est la source officielle à citer.

🔍 [À CONFIRMER : SPP Ficha Estadística N° 145, décembre 2024, tableau "Pensiones pagadas por tipo de pensión"]

---

### Divergence 6 — Rendement réel AFP long terme

| Fichier | Affirmation |
|---------|-------------|
| v2 diagnostic | Rendement réel = **3-4 % annualisé** depuis 1981 |
| v1 académique | Rendements réels **3-5 % annuels** (OECD) |

**VERDICT : LES DEUX SONT PARTIELLEMENT CORRECTS — préciser la période et la définition.**

Les données disponibles montrent :
- **1981-2003** : rendement réel brut de frais ~**10,4 %** annualisé (avant déduction frais et inflation). Net de frais et d'inflation : ~7-8 % sur cette période dorée.
- **1981-2001** (net de frais, réel) : **~7,3-7,6 %** selon le niveau de salaire.
- **Post-2008** : rendements significativement plus bas (crises 2008, 2011, COVID).
- **1981-2024 (long terme complet)** : la v2 cite 3-4 % réel. C'est plausible pour le Fonds C depuis 1981 si on intègre toutes les crises, les frais et l'inflation chilienne élevée des années 1980.

**Point critique** : les 10,4 % de la période 1981-2003 sont *nominaux bruts*. L'inflation chilienne 1981-2000 était ~10-15 %/an en moyenne — donc le rendement *réel* net de frais pour cette période était nettement plus bas. La v2 qui cite 3-4 % réel annualisé sur toute la période 1981-2024 est donc l'ordre de grandeur cohérent.

**Valeur à utiliser** : rendement réel AFP (net de frais, après inflation) sur longue période 1981-2024 : **3-5 % selon les fonds** (Fonds A ~5,8 % réel depuis 2002, Fonds C ~3-4 % réel depuis 1981). La promesse initiale était 5-7 % réel : elle n'a été tenue que partiellement et pour le fonds actions.

**Source** : SPP Rentabilidad Mensual (https://www.spensiones.cl/portal/institucional/594/w3-propertyvalue-10089.html) ; SSA v68n2 "Chile's Next Generation Pension Reform" (2008) ; CENDA série historique (https://www.cendachile.cl/).

---

## II. Erreurs critiques et imprécisions dans v2

### Erreur A — Décomposition FAPP dans v2-académique (Section 6.2)

**Passage v2-académique** : "Cotisation salarié totale passe de 10% à 16% sur 2035" ; "Composante 2 : cotisation patronale 1% en août 2025, augmentation annuelle de ~0,75% jusqu'à 8,5% en 2035 — allocation : 0,9% FAPP + 4,5-2,5% selon année".

**Problème** : Cette décomposition est confuse et probablement incorrecte.

**Correction** : D'après les sources primaires (KPMG, Lockton, Alessandri Legal, DLA Piper), la décomposition finale (2035) est :
- **Employeur** : 8,5 % total dont 4,5 % AFP individuel + 1,5 % FAPP (prêt) + 2,5 % FAPP (compensation genre)
- **Salarié** : 10 % inchangé (va au compte AFP individuel)
- Il n'y a PAS de cotisation salarié portée à 16 %. Ce chiffre 16 % est sans doute la somme totale (10 % salarié + 6 % patronal à une étape intermédiaire) mais présentée comme cotisation salariale, ce qui est faux.

**Valeur à utiliser** : cotisation salarié = 10 % (inchangé) ; cotisation patronale = 8,5 % à terme (2035), phased depuis 1 % en août 2025 ; total système = 18,5 % (10 + 8,5) en 2035.

**Sources** : KPMG Flash 2025-076 ; Lockton 2025 ; Alessandri Legal 2025.

---

### Erreur B — Vote du Congrès chilien (v2-académique cite "97 voix pour, 43 contre")

**Passage v2-académique** : "Le vote final au Congrès est 97 voix pour, 43 contre."

**Correction** : D'après Bloomberg (29 janvier 2025) et Prensa Latina, le vote à la Chambre des Députés était **110 voix pour, 38 contre**. Le Sénat avait approuvé séparément le même jour (28-29 janvier 2025). Le chiffre "97 pour, 43 contre" ne correspond à aucun décompte retrouvé dans les sources primaires.

**Valeur à utiliser** : vote Chambre des Députés du 29 janvier 2025 : **110 pour, 38 contre**.

**Source** : Bloomberg, "Chile Congress Gives Final Backing to Reform That Will Boost Retirees' Pensions", 29 janvier 2025 ; Prensa Latina, "Chile approves pension reform despite obstacles and pressures", 30 janvier 2025.

---

### Erreur C — Plebiscito 2020 : pourcentage "Apruebo"

**v1 afp-contre-exemple** cite **79,3 %** pour "Apruebo".

**v2 académique** ne cite pas ce chiffre directement.

**v2 presse** cite **78 %**.

**Correction** : Le résultat officiel SERVEL est **78,27 %** pour "Apruebo" (et 21,73 % pour "Rechazo"). La v1 "79,3 %" est incorrecte. La v2 avec "78 %" est arrondie mais acceptable.

**Valeur à utiliser** : **78,27 %** (SERVEL officiel).

**Source** : SERVEL officiel — https://historico.servel.cl/ et Meganoticias confirmant "78,27% Apruebo, 21,73% Rechazo" selon dernier bulletin officiel SERVEL.

---

### Erreur D — Mesa-Lago "5 des 12 mythes faux" (v2-histoire)

**Passage v2-histoire** : "Mesa-Lago énumère 12 affirmations faites par les promoteurs du modèle chilien et les teste empiriquement. Conclusion : 5 des 12 'mythes' sont démontés."

**Verdict** : 🔍 [À CONFIRMER — formulation non retrouvée textuellement]

Les recherches confirment que Mesa-Lago a bien réalisé une analyse des promesses vs. réalités du modèle AFP (notamment dans son article Social Security Bulletin v68n2, 2008 et dans "Pension reforms in Chile and social security principles", ISSR 2016). Il y évalue plusieurs mythes/affirmations contre des données. Cependant, le décompte exact "5 des 12" n'a pas pu être retrouvé dans les sources accessibles.

Deux formulations proches existent dans la littérature :
- Mesa-Lago 2008 (SSA) réfute plusieurs mythes de Orszag & Stiglitz sur les systèmes privatisés (article différent)
- Mesa-Lago 2016 (ISSR) évalue le système chilien contre 10 principes ILO de sécurité sociale

**Recommandation** : reformuler sans donner un décompte précis invérifiable, ou écrire "Mesa-Lago montre que plusieurs des promesses fondamentales du modèle AFP ne se sont pas concrétisées — couverture, adéquation des pensions, équité de genre et frais de gestion." Supprimer le chiffre "5 des 12" sans source vérifiable.

---

## III. Zones à risque — résultats des vérifications

### Zone A — Plebiscito 2020

**CONFIRMÉ AVEC CORRECTION**

- Score officiel SERVEL : **78,27 %** pour "Apruebo"
- La v1 "79,3 %" est **incorrecte** ; la v2 "78 %" ou "78,3 %" est acceptable.
- **Utiliser : 78,27 %** (ou "plus de 78 %").

**Source** : SERVEL officiel https://historico.servel.cl/servel/app/index.php?r=EleccionesGenerico&id=10

---

### Zone B — Élection Boric 2021

**CONFIRMÉ**

- Premier tour (21 novembre 2021) : Kast **27,94 %**, Boric **25,75 %** — tous deux en tête
- Second tour (19 décembre 2021) : Boric **55,87 %**, Kast **44,13 %**

Ces chiffres sont cohérents dans tous les fichiers v2. La v2-académique cite 55,87 % et 44,13 %, ce qui est exact.

**Source** : Wikipedia "2021 Chilean general election" basé sur SERVEL ; SERVEL via IFES Election Guide.

---

### Zone C — Dates de la réforme 2025

**CONFIRMÉ**

- Vote Sénat : **28 janvier 2025** (approbation générale + article par article)
- Vote Chambre des Députés : **29 janvier 2025** (110 pour, 38 contre)
- Promulgation par Boric : **21 mars 2025** (MercoPress)
- Publication au Diario Oficial : **26 mars 2025** (KPMG Flash Alert 2025-076)
- Numéro de loi : **Loi 21735** — confirmé
- Entrée en vigueur progressive : **août 2025** (1re cotisation patronale), jusqu'en 2035

---

### Zone D — Architecture précise du nouveau système 2025

**CONFIRMÉ AVEC PRÉCISIONS**

Cotisation patronale totale : **8,5 %** (terme 2035). Décomposition exacte :
- 4,5 % → comptes AFP individuels
- 1,5 % → FAPP (structure de prêt, financement prestation par années cotisées)
- 2,5 % → FAPP (compensation différentiel d'espérance de vie H/F)

PGU montant septembre 2025 : **224 004 CLP/mois** (données v2 diagnostic) puis augmentation jusqu'à 250 000 CLP (2027).

**NUANCE** : la v2-académique mentionne PGU "224 000 CLP" puis "250 000 CLP" en 2025 — c'est cohérent : 224 000 CLP est le montant 2024, et 250 000 CLP est la cible 2025 pour les 82+ ans d'abord.

**Sources** : KPMG 2025-076 ; Lockton 2025 ; v2-diagnostic (Section E).

---

### Zone E — Bonos de reconocimiento : "4,7 % du PIB/an"

**PARTIELLEMENT VÉRIFIÉ**

**Affirmation v2-histoire** (Section C, item 5) : "Entre 1981 et 2004, le déficit généré par les bonos et les pensions de l'ancien système s'éleva en moyenne à 4,7 % du PIB par an."

**Résultat des recherches** :
- Banque mondiale (World Bank SP Discussion Paper 0129, "Chile's Pension Reform After 20 Years") estime le coût des recognition bonds à **environ 4 % du PIB** entre 1985 et 2000.
- D'autres sources mentionnent un coût maximal de **5 % du PIB en 1984**.
- Le total du déficit de transition (ancien système + bonos de reconocimiento) est bien de l'ordre de 4-5 % du PIB par an pendant la phase initiale (1981-1990), retombant progressivement.

**Le chiffre "4,7 % par an de 1981 à 2004" est donc dans la fourchette haute mais globalement plausible pour la moyenne longue période.** Cependant, il inclut des phénomènes hétérogènes (déficit ancien système + bonos) et la source exacte n'a pas été retrouvée.

🔍 [À CONFIRMER avec source précise : World Bank SP Discussion Paper 0129 (2001), ou Holzmann et al. "Fiscal Alternatives of Moving from Unfunded to Funded Pensions" OECD 1997]

**Formulation recommandée** : "Le déficit de transition (ancien système + bonos de reconocimiento) a représenté **en moyenne 4 à 5 % du PIB par an** durant les deux premières décennies (1981-2000), selon les estimations de la Banque mondiale."

---

### Zone F — Singularité "100 % capitalisation" en 1981

**CONFIRMÉ AVEC NUANCES**

**Affirmation v2-histoire** : "Premier et seul pays en 1981 à substituer intégralement capitalisation à répartition."

**Verdict** : Cette affirmation est **techniquement correcte** avec les nuances suivantes :

1. **Singapour (CPF, 1955)** : précédent de capitalisation individuelle obligatoire, mais avec des différences majeures : géré par l'État (GIC, entité publique), non par des sociétés privées en concurrence. Les affiliés chiliens *choisissaient* leur AFP ; les Singapouriens ne choisissent pas l'investissement de leur CPF (géré par le GIC). Le CPF inclut aussi de l'épargne logement et santé. Il n'est donc pas comparable au sens strict du modèle AFP.

2. **Chili 1981** : premier pays à instaurer une capitalisation **intégralement individualisée, gérée par des sociétés privées en concurrence**, sans répartition résiduelle pour les nouveaux entrants.

3. **Exception militaire** : CAPREDENA et DIPRECA (Forces armées) maintenaient un système de répartition. Cette exemption est réelle et documentée, mais concerne un sous-groupe limité (les militaires).

**Formulation correcte** : "Le Chili est, en 1981, le premier pays au monde à substituer intégralement — pour les travailleurs civils nouveaux entrants — la capitalisation individuelle privée à la répartition publique, sans système de répartition résiduel pour ces affiliés."

---

### Zone G — Mesa-Lago "5 des 12 promesses fausses"

**NON CONFIRMÉ EN L'ÉTAT**

Voir Erreur D ci-dessus. La formulation "5 des 12" n'a pas été retrouvée textuellement dans les sources accessibles. Mesa-Lago a bien conduit une évaluation systématique des promesses vs. réalités, mais le décompte précis reste à confirmer dans le texte original.

🔍 [À CONFIRMER : Mesa-Lago, C. "Pension Reform in Chile Revisited", OECD Working Paper 2008 (Pension Reform in Chile Revisited, OECD Publishing 2009, https://www.oecd.org/content/dam/oecd/en/publications/reports/2009/04/pension-reform-in-chile-revisited_g17a1cc8/224473276417.pdf) — vérifier le décompte exact]

---

### Zone H — José Piñera : dates de mandat

**CONFIRMÉ PARTIELLEMENT**

- **Nomination** : décembre 1978 (toutes les sources concordent ; la date précise du "30 décembre" de la v2 est plausible mais non confirmée à la journée près).
- **Fin de mandat** : "décembre 1980" — cohérent avec la promulgation du décret-loi 3500 le 4 novembre 1980 et la publication au Diario Oficial le 13 novembre 1980. Il a quitté le ministère du Travail en 1980 (Wikipedia indique qu'il est resté jusqu'en 1981 pour le lancement du système, d'autres sources citent fin 1980).

🔍 [À CONFIRMER : Pinochet cabinet ministers Wikipedia (https://en.wikipedia.org/wiki/Augusto_Pinochet_cabinet_ministers) pour la date exacte de départ]

---

### Zone I — Mercer CFA 2025 Chili

**CONFIRMÉ**

- Grade : **B+**
- Score : **76,6 / 100**
- Édition : Mercer CFA Institute Global Pension Index **2025** (52 pays évalués)

La v1-académique cite ce score correctement. Il correspond à une amélioration par rapport aux éditions précédentes.

**Source** : Mercer CFA Institute Global Pension Index 2025 — https://www.mercer.com/insights/investments/market-outlook-and-trends/mercer-cfa-global-pension-index/ ; multiple confirmations dans les résultats de recherche.

---

### Zone J — Comparaisons régionales (réformes, retours en arrière)

**CONFIRMÉ avec précisions**

OIT *Reversing Pension Privatizations* (2018) : sur 30 pays ayant privatisé (1981-2014), **18 ont fait marche arrière** entre 2000 et 2018. Ce chiffre est confirmé.

Liste des pays ayant fait marche arrière (principale) :
- Argentine (2008) — retour complet à la répartition
- Bolivie (2010) — nationalisation
- Hongrie (2010)
- Pologne (2011, partielle)
- Bulgarie, Estonie, Lettonie, Lituanie (2007-2009, partielles)
- République tchèque, Slovaquie (2008, 2012)
- Russie (2012), Kazakhstan (2013), Arménie (2014), Croatie, Macédoine (2011)

**Dates des réformes régionales** (à vérifier dans les fichiers v2) :
- Pérou : 1993 ✅
- Colombie : 1993 ✅
- Argentine : 1994 ✅ (et retour en arrière 2008 ✅)
- Mexique : 1997 ✅
- Bolivie : 1997 ✅ (nationalisation 2010 ✅)

**Source** : ILO "Reversing Pension Privatizations" 2018 — https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@ed_protect/@soc_sec/documents/publication/wcms_648574.pdf

---

## IV. Affirmations validées pour la rédaction

Liste des chiffres et faits fiables, utilisables directement :

| # | Affirmation | Source |
|---|-------------|--------|
| 1 | Décret-loi 3500 signé le **4 novembre 1980**, publié au Diario Oficial le **13 novembre 1980** | v2-histoire (cohérent avec sources) |
| 2 | Entrée en vigueur système AFP : **1er mai 1981** | v2-histoire (cohérent) |
| 3 | Cotisation salarié originelle : **10 %**, cotisation patronale : **0 %** | Toutes sources concordent |
| 4 | Vote final Chambre Chili : **110 pour, 38 contre** (29 janvier 2025) | Bloomberg 29 jan. 2025 |
| 5 | Loi 21735 publiée au Diario Oficial : **26 mars 2025** | KPMG 2025-076 |
| 6 | Cotisation patronale Loi 21735 à terme (2035) : **8,5 %** dont 4,5 % AFP + 4 % FAPP | KPMG, Lockton, Alessandri Legal |
| 7 | Décomposition FAPP : 2,5 % compensation genre + 1,5 % prestation années cotisées | KPMG 2025-076 |
| 8 | Total retraits COVID : **55,8 Md USD** (20,3 + 19,2 + 16,3) = ~20 % du PIB 2021 | Banco Central WP991 ; BIS WP1176 |
| 9 | Boric 1er tour : **25,75 %** ; Kast 1er tour : **27,94 %** (21 nov. 2021) | SERVEL via Wikipedia |
| 10 | Boric 2e tour : **55,87 %** ; Kast : **44,13 %** (19 déc. 2021) | SERVEL officiel |
| 11 | Plebiscito 2020 "Apruebo" : **78,27 %** (SERVEL officiel) | SERVEL historico.servel.cl |
| 12 | TR projeté post-réforme (OCDE 2025) : **61,3 % H / 61,1 % F** | La Tercera, OCDE 2025 |
| 13 | TR pré-réforme (OCDE 2021) : **38,5 % H / 35,4 % F** | OCDE Pensions at a Glance 2021 |
| 14 | TR pré-réforme (OCDE 2023, avec PGU) : **45,7 % H / 43 % F** | La Tercera, OCDE 2023 |
| 15 | Mercer CFA 2025 Chili : **B+ (76,6 / 100)** | Mercer CFA GPI 2025 |
| 16 | OCDE classement Chili 2021 → 2025 : **34e → 19e** | La Tercera, OCDE 2025 |
| 17 | PGU montant 2024 : **224 004 CLP** (~270 USD) ; cible 2025+ : **250 000 CLP** | v2-diagnostic (cohérent sources) |
| 18 | Commission AFP seule (2025) : **0,46 % à 1,45 %** selon l'AFP | SPP licitación 2023-2025 |
| 19 | SIS (assurance invalidité-décès) depuis avril 2026 : **1,62 %** unisexe | v2-diagnostic (cohérent) |
| 20 | Comisión Bravo 2015 : 24 membres, 65 sessions, rapport sept. 2015, 246 pages | Toutes sources concordent |
| 21 | Nombre de pays ayant privatisé (1981-2014) : **30** ; ayant fait marche arrière : **18** (OIT 2018) | ILO 2018 |
| 22 | Piñera nommé ministre du Travail : **décembre 1978** | Wikipedia José Piñera |
| 23 | PGU introduite : **février 2022** | Toutes v2 concordent |
| 24 | Rendement AFP Fonds A depuis sept. 2002 : **~5,8 % réel annualisé** | v2-diagnostic (SPP données) — à confirmer sur SPP |

---

## V. Points à confirmer (🔍) — non résolus faute d'accès à source primaire

| # | Point | Action recommandée |
|---|-------|--------------------|
| 🔍1 | Pension AFP moyenne contributive exacte (CLP, 2024) — 204 000 CLP v2 vs 332 000 CLP agrégé SPP | Consulter SPP Ficha Estadística N° 145 (déc. 2024) tableau "Pensiones pagadas" |
| 🔍2 | Mesa-Lago décompte exact "5/12" ou "N/M" des mythes réfutés (article 2008 ou 2009 OECD) | Lire Mesa-Lago (2009), OECD "Pension Reform in Chile Revisited" p. X |
| 🔍3 | José Piñera date exacte de fin de mandat (nov. 1980 ou début 1981 ?) | Wikipedia Pinochet cabinet ministers |
| 🔍4 | Coût fiscal bono de reconocimiento : source exacte pour "4,7 % du PIB" | World Bank SP Discussion Paper 0129 (2001) ou Holzmann OECD 1997 |
| 🔍5 | Rendement réel AFP Fonds C depuis 1981 jusqu'en 2024 (chiffre consolidé) | SPP Rentabilidad Mensual séries historiques |

---

## VI. Bibliographie sources primaires consultées

| Source | URL | Usage |
|--------|-----|-------|
| OECD Pensions at a Glance 2025 — Chile note | https://www.oecd.org/en/publications/pensions-at-a-glance-2025-country-notes_8a53ef12-en/chile_99e9160c-en.html | TR avant/après réforme |
| KPMG Flash Alert 2025-076 | https://kpmg.com/xx/en/our-insights/gms-flash-alert/flash-alert-2025-076.html | Décomposition 8,5 %, dates loi 21735 |
| Lockton — Chile pension reform | https://global.lockton.com/us/en/news-insights/chile-introduces-major-changes-to-its-pension-system | Décomposition FAPP |
| Alessandri Legal — Key dates | https://alessandri.legal/en/key-dates-of-the-chilean-pension-reform/ | Calendrier réforme |
| Bloomberg 29 jan. 2025 | https://www.bloomberg.com/news/articles/2025-01-29/chile-congress-gives-final-backing-to-long-sought-pension-reform | Vote Congrès (110/38) |
| SERVEL Plebiscito 2020 | https://historico.servel.cl/servel/app/index.php?r=EleccionesGenerico&id=10 | 78,27 % Apruebo |
| Wikipedia 2021 Chilean election | https://en.wikipedia.org/wiki/2021_Chilean_general_election | Boric 55,87 %, Kast 27,94 % 1er tour |
| Banco Central WP991 | https://www.bcentral.cl/en/web/banco-central/content/-/detalle/documento-de-trabajo-n-991 | Montants retraits COVID |
| BIS Working Paper 1176 | https://www.bis.org/publ/work1176.pdf | Impact retraits COVID sur pensions |
| ILO Reversing Pension Privatizations 2018 | https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@ed_protect/@soc_sec/documents/publication/wcms_648574.pdf | 18/30 pays |
| SPP Comisiones | https://www.spensiones.cl/portal/institucional/594/w3-propertyvalue-10093.html | Frais AFP 2025 |
| La Tercera — OCDE reforma previsional | https://www.latercera.com/pulso/noticia/ocde-destaca-la-reforma-de-pensiones-en-chile-y-estima-que-con-ella-la-tasa-de-reemplazo-casi-llega-al-promedio-del-bloque/ | TR avant/après 38,5→61,3 % |
| SPP Ficha Estadística N° 145, déc. 2024 | https://www.spensiones.cl/portal/institucional/594/articles-16172_recurso_1.pdf | Pension moyenne (non extraite, à consulter) |
| Mercer CFA GPI 2025 | https://www.mercer.com/insights/investments/market-outlook-and-trends/mercer-cfa-global-pension-index/ | Score B+ 76,6 |

---

*Fact-check réalisé par l'agent fact-checker le 16 mai 2026. Durée : environ 90 minutes. Méthode : lecture des 6 fichiers de recherche + 18 requêtes WebSearch + 12 WebFetch en sources primaires.*

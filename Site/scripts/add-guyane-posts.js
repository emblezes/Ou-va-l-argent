/**
 * Batch ajout des 13 infographies Guyane au calendrier Notion
 * Usage: cd Site && node scripts/add-guyane-posts.js
 */

const { execSync } = require('child_process');
const path = require('path');

const posts = [
  {
    titre: '#33 — Guyane : 98% du territoire inexploré minièrement',
    date: '2026-02-17',
    theme: 'International',
    type: 'Stat choc',
    statut: 'Pret',
    reel: false,
    source: 'BRGM — Inventaire minier de la Guyane',
    linkedin: `🇫🇷 La Guyane française possède l'un des sous-sols les plus riches au monde — et pourtant, 98% de son territoire n'a jamais fait l'objet d'une prospection minière moderne.

Le craton guyanais, un bouclier géologique vieux de 2 milliards d'années, est la même formation qui a fait la fortune du Guyana voisin (+62% de PIB en 2022) et du Suriname.

Or, tantale, bauxite, terres rares, diamants… Les indices sont partout. Mais seuls 2% du territoire ont été cartographiés par le BRGM.

En 2025, un programme de 53 M€ sur 5 ans vient d'être lancé pour enfin dresser l'inventaire complet. Pendant ce temps, l'orpaillage illégal prospère — 6 tonnes d'or volées chaque année, 13 tonnes de mercure déversées dans les rivières.

La vraie question : combien de temps encore la France va-t-elle ignorer ce trésor stratégique, alors que l'UE dépend à 98% de la Chine pour ses terres rares ?

Source : BRGM, Commission européenne`,
    twitter: `🇫🇷 98% du territoire guyanais n'a JAMAIS été prospecté pour ses minerais.

Le craton guyanais : 2 Md d'années, or, tantale, terres rares...

Même géologie que le Guyana (+62% PIB en 2022).

La France dort sur un trésor stratégique. 🧵

#Guyane #MinesEnFrance`,
    instagram: `🇫🇷 98% DU TERRITOIRE INEXPLORÉ

La Guyane française possède l'un des sous-sols les plus riches au monde.

Or, tantale, bauxite, terres rares, diamants… Seuls 2% ont été cartographiés.

Même géologie que le Guyana voisin qui a connu +62% de croissance en 2022.

Pendant ce temps : 6t d'or volées/an par l'orpaillage illégal.

La France dort sur un trésor stratégique.

#Guyane #MinesEnFrance #TerresRares #Géopolitique #OùVaLArgent #FinancesPubliques #OrIllégal #Stratégie #UE #ChineVsEurope`,
    facebook: `🇫🇷 Saviez-vous que 98% du territoire guyanais n'a JAMAIS été prospecté pour ses minerais ?

Le craton guyanais, vieux de 2 milliards d'années, est l'une des formations géologiques les plus riches au monde. Or, tantale, bauxite, terres rares, diamants…

Le Guyana voisin, assis sur la même géologie, a connu +62% de croissance en 2022 en exploitant ses ressources.

La France, elle, a rejeté le projet Montagne d'Or (80 tonnes d'or) et laisse l'orpaillage illégal prospérer : 6 tonnes d'or volées chaque année.

Un programme BRGM de 53 M€ vient d'être lancé pour enfin cartographier ce trésor. Il était temps.`,
  },
  {
    titre: '#34 — Or illégal en Guyane : 6t/an, 8 000 garimpeiros, ~500 sites',
    date: '2026-02-17',
    theme: 'Finances publiques',
    type: 'Stat choc',
    statut: 'Pret',
    reel: false,
    source: 'WWF, Forces armées en Guyane, Sénat 2023',
    linkedin: `⚠️ L'orpaillage illégal en Guyane : un fléau qui coûte plus de 500 M€/an à la France.

Les chiffres sont vertigineux :
• 6 tonnes d'or extraites illégalement chaque année (4x la production légale)
• 8 000 garimpeiros (chercheurs d'or brésiliens) opèrent en forêt amazonienne
• ~500 sites illégaux actifs, en hausse de +35% depuis 2020
• 13 tonnes de mercure déversées dans les rivières chaque année

L'opération Harpie, mobilisant 2 500 militaires, coûte 80 M€/an — mais les garimpeiros reconstruisent un site en 48h après sa destruction.

Le paradoxe : on a rejeté Montagne d'Or (mine légale, 750 emplois, normes environnementales strictes) mais on laisse l'orpaillage illégal prospérer sans aucune norme.

La vraie question n'est pas "mine ou pas mine" — c'est "mine légale ou mine illégale". Aujourd'hui, c'est l'illégal qui gagne.

Source : WWF, Forces armées en Guyane, rapport du Sénat 2023`,
    twitter: `⚠️ Orpaillage illégal en Guyane :

• 6 tonnes d'or/an (4x le légal)
• 8 000 garimpeiros
• ~500 sites actifs
• 13t de mercure/an

Coût pour la France : > 500 M€/an

On a rejeté une mine légale (Montagne d'Or) mais on tolère ce désastre. 🤯

#Guyane #OrIllégal`,
    instagram: `⚠️ ORPAILLAGE ILLÉGAL EN GUYANE

6 tonnes d'or volées chaque année
8 000 garimpeiros brésiliens
~500 sites illégaux actifs (+35%)

Coût total : plus de 500 M€/an pour la France

13 tonnes de mercure empoisonnent les rivières.

Le paradoxe : on a rejeté la mine légale (Montagne d'Or) mais on laisse l'illégal prospérer.

#Guyane #OrIllégal #FinancesPubliques #Environnement #OùVaLArgent #France #Amazonie #Mercure #Garimpeiros`,
    facebook: `⚠️ L'orpaillage illégal en Guyane française, c'est :

→ 6 tonnes d'or extraites par an (4x la production légale)
→ 8 000 garimpeiros qui opèrent en forêt
→ ~500 sites illégaux actifs
→ 13 tonnes de mercure déversées dans les rivières
→ Plus de 500 M€/an de coût pour la France

L'opération militaire Harpie coûte 80 M€/an, mais les sites sont reconstruits en 48h.

Le comble ? On a rejeté Montagne d'Or (mine légale avec normes environnementales) mais on tolère ce désastre écologique et économique.`,
  },
  {
    titre: '#35 — L\'UE dépend à 98% de la Chine pour ses terres rares',
    date: '2026-02-18',
    theme: 'International',
    type: 'Classement',
    statut: 'Pret',
    reel: false,
    source: 'Commission européenne — CRM Act 2024',
    linkedin: `🇪🇺🇨🇳 L'Europe importe 98% de ses terres rares de Chine. Une dépendance stratégique critique.

Le détail est inquiétant :
• Terres rares : 98% de Chine
• Magnésium : 93%
• Lithium traité : 79%
• Cobalt raffiné : 68%

Le Critical Raw Materials Act (2024) fixe des objectifs ambitieux : 10% d'extraction domestique, 40% de transformation en UE, 25% de recyclage d'ici 2030.

Le plan ReSourceEU mobilise 3 Md€.

Et la Guyane française ? Seul territoire européen sur un craton archéen riche en métaux critiques. Tantale, terres rares, or, bauxite… Le potentiel est là.

Encore faut-il le développer.

Source : Commission européenne, CRM Act 2024`,
    twitter: `🇪🇺🇨🇳 Dépendance UE à la Chine :

• Terres rares : 98%
• Magnésium : 93%
• Lithium : 79%
• Cobalt : 68%

La solution ? La Guyane française — seul territoire UE sur un craton archéen riche en métaux critiques.

Encore faut-il l'exploiter. 🧲

#TerresRares #UE`,
    instagram: `🇪🇺🇨🇳 DÉPENDANCE CRITIQUE

L'UE importe de Chine :
→ 98% de ses terres rares
→ 93% de son magnésium
→ 79% de son lithium traité
→ 68% de son cobalt raffiné

Le CRM Act (2024) fixe un objectif : 10% d'extraction en UE d'ici 2030.

La Guyane française est le seul territoire européen sur un craton riche en métaux critiques.

#TerresRares #Chine #UE #Géopolitique #OùVaLArgent #MétauxCritiques #CRMAct #Guyane`,
    facebook: `🇪🇺 L'Union européenne dépend à 98% de la Chine pour ses terres rares.

C'est comme si toute notre transition énergétique (éoliennes, voitures électriques, batteries) reposait sur un seul fournisseur.

Le CRM Act européen et le plan ReSourceEU (3 Md€) veulent changer ça.

La bonne nouvelle ? La Guyane française possède un potentiel en terres rares, tantale, et autres métaux critiques. C'est le seul territoire européen situé sur un craton archéen riche en minerais.

La mauvaise nouvelle ? 98% de son sous-sol reste inexploré.`,
  },
  {
    titre: '#36 — Guyana vs Guyane : même géologie, destins opposés',
    date: '2026-02-18',
    theme: 'International',
    type: 'Comparaison',
    statut: 'Pret',
    reel: true,
    source: 'Banque mondiale, FMI, INSEE, BRGM',
    linkedin: `🇬🇾 vs 🇫🇷 Guyana et Guyane française : même bouclier géologique, destins radicalement opposés.

GUYANA 🇬🇾
• Croissance 2022 : +62% (record mondial)
• PIB/habitant : 25 000 $
• Production or : 18 t/an
• Secteur minier : 28% du PIB

GUYANE FRANÇAISE 🇫🇷
• Croissance 2022 : +1,8%
• PIB/habitant : 16 800 €
• Production or légale : 1,5 t/an
• Secteur minier : < 1% du PIB

Le Guyana a dépassé la Guyane française en PIB par habitant en 2023. Les deux territoires partagent le même craton géologique vieux de 2 milliards d'années.

La différence ? Le Guyana a ouvert ses ressources aux investisseurs. La France a choisi le moratoire.

Source : Banque mondiale, FMI, INSEE`,
    twitter: `🇬🇾 Guyana vs 🇫🇷 Guyane :
Même géologie. Destins opposés.

Guyana : +62% PIB, 18t or/an, 28% PIB minier
Guyane : +1,8%, 1,5t légale, < 1%

Le Guyana a dépassé la Guyane fr. en PIB/hab.

Différence : un pays ouvre ses ressources, l'autre les bloque.

#Guyana #Guyane`,
    instagram: `🇬🇾 vs 🇫🇷 MÊME GÉOLOGIE, DESTINS OPPOSÉS

GUYANA :
→ +62% de PIB en 2022
→ PIB/hab : 25 000 $
→ 18 t d'or/an
→ Mine = 28% du PIB

GUYANE FRANÇAISE :
→ +1,8% de croissance
→ PIB/hab : 16 800 €
→ 1,5 t d'or légal/an
→ Mine = < 1% du PIB

Même sous-sol. Même potentiel. Des choix différents.

#Guyana #Guyane #Comparaison #Géopolitique #OùVaLArgent #Or #MinesEnFrance #Croissance`,
    facebook: `🇬🇾 vs 🇫🇷 Guyana et Guyane française partagent exactement la même géologie — le bouclier guyanais, vieux de 2 milliards d'années.

Le Guyana a choisi d'exploiter ses ressources : +62% de PIB en 2022, 18 tonnes d'or par an, un secteur minier qui pèse 28% du PIB.

La Guyane française, elle, a rejeté le projet Montagne d'Or et maintient un moratoire de fait : 1,5 tonne d'or légal par an, moins de 1% du PIB dans le minier.

Résultat : le Guyana a dépassé la Guyane française en PIB par habitant en 2023.

Même sous-sol, même potentiel, des choix radicalement différents.`,
    briefReel: 'Comparaison visuelle Guyana vs Guyane fr. Montrer les chiffres côte à côte. Conclure sur le contraste : même géologie, destins opposés.',
  },
  {
    titre: '#37 — Montagne d\'Or : 80t d\'or, projet rejeté',
    date: '2026-02-19',
    theme: 'Finances publiques',
    type: 'Timeline',
    statut: 'Pret',
    reel: true,
    source: 'NordGold, Conseil d\'État, rapports parlementaires',
    linkedin: `🏔️ Montagne d'Or : chronique du plus grand fiasco minier français.

2004 : Découverte d'un gisement de 80+ tonnes d'or en Guyane
2015 : Étude de faisabilité positive (1 Md€ d'investissement, 750 emplois)
2017 : Macron qualifie le projet de "pas compatible" avec l'environnement
2019 : Le Conseil d'État refuse les concessions
2024 : Rejet définitif par la Cour d'appel de Bordeaux (nov.)
2025 : NordGold réclame 4,5 Md$ de dommages à la France via arbitrage international

Le résultat ?
• 0 emploi créé
• 0€ de recettes fiscales
• L'orpaillage illégal continue (6t/an)
• La France risque de payer 4,5 Md$ de dommages

Le paradoxe : on a bloqué une mine légale avec normes environnementales, et on n'a pas empêché les 8 000 garimpeiros qui détruisent la forêt sans aucune norme.

Source : NordGold, Conseil d'État, CAA Bordeaux`,
    twitter: `🏔️ Montagne d'Or — chronique d'un fiasco :

2004 : 80t d'or découvertes
2015 : Faisabilité positive
2017 : Macron bloque
2024 : Rejet définitif
2025 : NordGold réclame 4,5 Md$

Bilan : 0 emploi, 0 recette, orpaillage illégal en hausse, 4,5 Md$ de dommages possibles. 🤦

#MontagneOr`,
    instagram: `🏔️ MONTAGNE D'OR : 80 TONNES D'OR, PROJET REJETÉ

La timeline du plus grand fiasco minier français :

2004 → Découverte du gisement
2015 → Faisabilité positive
2017 → Macron : "pas compatible"
2019 → Refus Conseil d'État
2024 → Rejet définitif
2025 → NordGold réclame 4,5 Md$

Bilan : 0 emploi, 0 recette, l'illégal continue.

#MontagneOr #Guyane #FinancesPubliques #Or #OùVaLArgent #France #Mines #Arbitrage`,
    facebook: `🏔️ Montagne d'Or, c'est l'histoire du plus grand projet minier jamais proposé en France — et de son rejet.

80 tonnes d'or identifiées en Guyane. 1 milliard d'euros d'investissement prévu. 750 emplois directs. 12 ans d'exploitation.

Après 20 ans de procédures, le projet a été définitivement rejeté en novembre 2024.

Maintenant, NordGold réclame 4,5 milliards de dollars de dommages à la France.

Pendant ce temps, 8 000 garimpeiros extraient 6 tonnes d'or par an illégalement — sans aucune norme environnementale.`,
    briefReel: 'Timeline animée de Montagne d\'Or. De la découverte au rejet, puis à l\'arbitrage de 4,5 Md$. Conclure sur le paradoxe mine légale rejetée vs illégal toléré.',
  },
  {
    titre: '#38 — Orpaillage illégal : le vrai coût (520 M€/an)',
    date: '2026-02-19',
    theme: 'Finances publiques',
    type: 'Stat choc',
    statut: 'Pret',
    reel: false,
    source: 'Min. Armées, INSEE, ARS, rapports parlementaires',
    linkedin: `💰 L'orpaillage illégal en Guyane coûte plus de 520 millions d'euros par an à la France. Décomposition :

80 M€ → Opérations militaires (Harpie, 2 500 soldats)
200 M€ → Manque à gagner fiscal (taxes/redevances sur 6t d'or)
150 M€ → Dégâts environnementaux (déforestation, mercure)
50 M€ → Coûts de santé publique (contamination au mercure)
40 M€ → Perte économique locale

= 520 M€/an minimum

C'est 10x le budget de l'opération Harpie. Et le phénomène s'aggrave : +35% de sites illégaux depuis 2020.

L'ironie ? Montagne d'Or, le projet minier légal rejeté, aurait rapporté ~300 M€/an en recettes fiscales et emplois.

Source : Ministère des Armées, INSEE, ARS Guyane`,
    twitter: `💰 Coût de l'orpaillage illégal en Guyane :

80 M€ — Militaire
200 M€ — Manque fiscal
150 M€ — Environnement
50 M€ — Santé
40 M€ — Éco locale

= 520 M€/AN

L'ironie ? La mine légale rejetée (Montagne d'Or) aurait rapporté ~300 M€/an. 🤦

#Guyane #OrIllégal`,
    instagram: `💰 LE VRAI COÛT DE L'ORPAILLAGE ILLÉGAL

80 M€ → Opérations militaires
200 M€ → Manque à gagner fiscal
150 M€ → Dégâts environnementaux
50 M€ → Santé publique
40 M€ → Perte économique locale

= 520 M€/AN pour la France

+35% de sites illégaux depuis 2020.
L'opération Harpie coûte cher, mais ne suffit pas.

#Guyane #OrIllégal #FinancesPubliques #Coût #OùVaLArgent #France #Amazonie #Budget`,
    facebook: `💰 520 millions d'euros par an.

C'est ce que coûte l'orpaillage illégal en Guyane à la France.

Le détail :
• 80 M€ en opérations militaires
• 200 M€ de manque à gagner fiscal
• 150 M€ de dégâts environnementaux
• 50 M€ de coûts de santé publique
• 40 M€ de perte économique locale

Et le phénomène s'aggrave : +35% de sites illégaux depuis 2020.

L'ironie ? La mine légale qu'on a rejetée (Montagne d'Or) aurait rapporté ~300 M€/an.`,
  },
  {
    titre: '#39 — Richesses du sous-sol guyanais : l\'inventaire complet',
    date: '2026-02-20',
    theme: 'International',
    type: 'Classement',
    statut: 'Pret',
    reel: false,
    source: 'BRGM — Inventaire minier de la Guyane',
    linkedin: `⛏️ Le sous-sol de la Guyane française : un inventaire qui donne le vertige.

🥇 Or : 100+ tonnes identifiées (47 gisements)
⚡ Tantale/Coltan : stratégique (30 gisements)
🏗️ Bauxite : 20+ millions de tonnes (12 gisements)
🏺 Kaolin : 5+ millions de tonnes (8 gisements)
💎 Diamants : non quantifié (6 gisements)
🧲 Terres rares : à confirmer (4 indices)
🔋 Niobium : à confirmer (3 indices)

Tout ça sur seulement 2% du territoire prospecté.

Le BRGM vient de lancer un programme de 53 M€ sur 5 ans pour cartographier l'ensemble du sous-sol. Les résultats pourraient révéler un potentiel bien supérieur.

Source : BRGM — Inventaire minier de la Guyane`,
    twitter: `⛏️ Sous-sol guyanais — l'inventaire :

🥇 Or : 100+ tonnes (47 gisements)
⚡ Tantale : stratégique (30 gisements)
🏗️ Bauxite : 20+ Mt (12 gisements)
💎 Diamants : 6 gisements
🧲 Terres rares : 4 indices

Et seulement 2% du territoire prospecté.

#Guyane #Mines #TerresRares`,
    instagram: `⛏️ LES RICHESSES DU SOUS-SOL GUYANAIS

🥇 Or — 100+ t (47 gisements)
⚡ Tantale — Stratégique (30 gisements)
🏗️ Bauxite — 20+ Mt (12 gisements)
🏺 Kaolin — 5+ Mt (8 gisements)
💎 Diamants — 6 gisements
🧲 Terres rares — 4 indices
🔋 Niobium — 3 indices

Et seulement 2% du territoire a été prospecté !

#Guyane #Mines #SousSol #Or #TerresRares #OùVaLArgent #Richesses #BRGM #France`,
    facebook: `⛏️ Savez-vous ce que recèle le sous-sol de la Guyane française ?

Or : plus de 100 tonnes identifiées dans 47 gisements
Tantale/Coltan : 30 gisements d'un métal stratégique (batteries, électronique)
Bauxite : plus de 20 millions de tonnes
Kaolin, diamants, terres rares, niobium…

Le tout sur seulement 2% du territoire prospecté.

Le BRGM vient de lancer un programme de 53 M€ pour enfin cartographier l'ensemble. Les résultats pourraient être spectaculaires.`,
  },
  {
    titre: '#40 — Chômage Guyane 17% vs Métropole 7,5%',
    date: '2026-02-20',
    theme: 'Macro-economie',
    type: 'Comparaison',
    statut: 'Pret',
    reel: false,
    source: 'INSEE — T3 2025',
    linkedin: `🇫🇷 Guyane : le chômage est 2 fois supérieur à la métropole.

GUYANE : 17% de chômage
• PIB/habitant : 16 800 € (vs 42 000 € métropole)
• 53% de la population sous le seuil de pauvreté
• Transferts publics = 60% du PIB
• Croissance démographique : +2,4%/an

MÉTROPOLE : 7,5% de chômage
• PIB/habitant : 42 000 €
• 14% sous le seuil de pauvreté

La Guyane a besoin d'un moteur économique. Ses voisins l'ont trouvé dans le secteur minier (28% du PIB au Guyana). La France, elle, maintient un moratoire de fait depuis 2017.

Source : INSEE T3 2025`,
    twitter: `🇫🇷 Chômage en Guyane : 17%
🇫🇷 Chômage en Métropole : 7,5%

PIB/hab Guyane : 16 800 €
PIB/hab Métropole : 42 000 €

53% sous le seuil de pauvreté.

Le Guyana voisin a trouvé un moteur : le minier (28% du PIB). La France bloque tout.

#Guyane #Chômage`,
    instagram: `🇫🇷 CHÔMAGE : GUYANE vs MÉTROPOLE

GUYANE → 17%
PIB/hab : 16 800 €
53% sous le seuil de pauvreté

MÉTROPOLE → 7,5%
PIB/hab : 42 000 €
14% sous le seuil de pauvreté

La Guyane a besoin d'un moteur économique.

#Guyane #Chômage #Économie #France #OùVaLArgent #Inégalités #DOM #Pauvreté`,
    facebook: `🇫🇷 17% de chômage en Guyane, contre 7,5% en métropole.

Le PIB par habitant guyanais (16 800 €) est 2,5x inférieur à celui de la métropole (42 000 €). Plus de la moitié de la population vit sous le seuil de pauvreté.

Et la Guyane est le DOM le plus fragile économiquement : 60% du PIB provient des transferts publics.

Le Guyana voisin a trouvé son moteur de croissance dans l'exploitation de ses ressources naturelles (28% du PIB). La Guyane française, elle, attend toujours.`,
  },
  {
    titre: '#41 — Délais permis miniers : France 10 ans vs Australie 2 ans',
    date: '2026-02-21',
    theme: 'International',
    type: 'Classement',
    statut: 'Pret',
    reel: false,
    source: 'Banque mondiale, Fraser Institute 2024',
    linkedin: `⏰ Obtenir un permis minier en France : 10 à 15 ans. En Australie : 2 à 4 ans. Au Guyana : moins d'un an.

Classement des délais (exploration → production) :
🇫🇷 France : 10-15 ans
🇨🇦 Canada : 3-5 ans
🇦🇺 Australie : 2-4 ans
🇬🇭 Ghana : 1-2 ans
🇬🇾 Guyana : < 1 an

Le Code minier français, le SDOM (Schéma d'orientation minière) et le moratoire de fait depuis 2017 créent un millefeuille administratif qui paralyse tout développement.

Résultat : la France se classe parmi les pires juridictions minières au monde selon le Fraser Institute. Aucun investisseur sérieux ne vient.

Les Australiens ont un guichet unique. Nous avons un labyrinthe.

Source : Banque mondiale, Fraser Institute 2024`,
    twitter: `⏰ Délai pour un permis minier :

🇫🇷 France : 10-15 ans
🇨🇦 Canada : 3-5 ans
🇦🇺 Australie : 2-4 ans
🇬🇭 Ghana : 1-2 ans
🇬🇾 Guyana : < 1 an

La France 5x plus lente que l'Australie. Aucun investisseur sérieux ne vient.

Les Australiens ont un guichet unique. Nous avons un labyrinthe. 🏛️

#Mines`,
    instagram: `⏰ DÉLAIS POUR UN PERMIS MINIER

🇫🇷 France → 10-15 ans
🇨🇦 Canada → 3-5 ans
🇦🇺 Australie → 2-4 ans
🇬🇭 Ghana → 1-2 ans
🇬🇾 Guyana → < 1 an

La France est 5x plus lente que l'Australie.

Aucun investisseur minier sérieux ne vient en France.

#PermisMinier #France #Australie #Mines #OùVaLArgent #Bureaucratie #International #Guyane`,
    facebook: `⏰ En France, il faut 10 à 15 ans pour obtenir un permis minier. En Australie, 2 à 4 ans. Au Guyana, moins d'un an.

Le Code minier français, le SDOM et le moratoire de fait depuis 2017 forment un labyrinthe administratif que tout investisseur raisonnable évite.

L'Australie a mis en place un guichet unique pour les permis miniers. Résultat : son secteur minier pèse 35% du PIB de l'Australie-Occidentale.

La France ? Moins de 0,5% du PIB. Et la Guyane, assise sur un trésor, stagne à moins de 1%.`,
  },
  {
    titre: '#42 — Combien vaut le sous-sol guyanais ? 10+ Md€',
    date: '2026-02-21',
    theme: 'Finances publiques',
    type: 'Stat choc',
    statut: 'Pret',
    reel: false,
    source: 'BRGM, estimations cours 2025',
    linkedin: `💰 Le sous-sol de la Guyane française vaut au minimum 10 milliards d'euros.

Décomposition :
• Or : ~8 Md€ (100+ tonnes aux cours actuels)
• Tantale : ~1 Md€ (30 gisements)
• Bauxite : ~0,5 Md€ (20+ Mt)
• Kaolin + autres : ~0,7 Md€

Et tout ça sur seulement 2% du territoire prospecté.

Si on extrapole à l'ensemble du craton guyanais, le potentiel total pourrait dépasser 50 milliards d'euros.

Une exploitation raisonnée créerait :
• 5 000+ emplois directs
• 15 000+ emplois indirects
• ~300 M€/an de recettes fiscales
• Réduction du chômage de 17% à ~12%

Le sous-sol guyanais est un actif stratégique endormi. Il est temps de le réveiller — intelligemment.

Source : BRGM, estimations aux cours 2025`,
    twitter: `💰 Le sous-sol guyanais vaut au minimum 10 Md€ :

• Or : ~8 Md€
• Tantale : ~1 Md€
• Bauxite : ~0,5 Md€
• Autres : ~0,7 Md€

Sur seulement 2% du territoire prospecté.

Potentiel total : 50+ Md€. 🤯

#Guyane #SousSol #Richesses`,
    instagram: `💰 COMBIEN VAUT LE SOUS-SOL GUYANAIS ?

AU MINIMUM : 10+ milliards d'euros

Or → ~8 Md€
Tantale → ~1 Md€
Bauxite → ~0,5 Md€
Autres → ~0,7 Md€

Et seulement 2% du territoire a été prospecté.
Potentiel total : 50+ milliards d'euros.

#Guyane #SousSol #Richesses #Or #OùVaLArgent #FinancesPubliques #Mines #France #Stratégie`,
    facebook: `💰 10 milliards d'euros minimum.

C'est la valeur estimée des réserves identifiées dans le sous-sol de la Guyane française.

• Or : ~8 milliards (100+ tonnes)
• Tantale : ~1 milliard (30 gisements)
• Bauxite, kaolin et autres : ~1,2 milliard

Le plus fou ? Seuls 2% du territoire ont été prospectés. Le potentiel total pourrait dépasser 50 milliards d'euros.

Une exploitation raisonnée créerait 5 000+ emplois directs et rapporterait ~300 M€/an en recettes fiscales.`,
  },
  {
    titre: '#43 — 13 tonnes de mercure déversées chaque année en Guyane',
    date: '2026-02-22',
    theme: 'Finances publiques',
    type: 'Stat choc',
    statut: 'Pret',
    reel: false,
    source: 'ARS Guyane, WWF, PAG',
    linkedin: `☠️ 13 tonnes de mercure déversées chaque année en Guyane par l'orpaillage illégal.

L'impact est catastrophique :
• 5 840 km de cours d'eau contaminés (sur 15 000 km)
• 10 000+ personnes exposées (communautés autochtones)
• ~29 000 ha de forêt détruits
• Contamination irréversible de la chaîne alimentaire

Le mercure provoque des troubles neurologiques, des malformations congénitales et des cancers. Les enfants des communautés amérindiennes présentent des taux de mercure 3 à 4 fois supérieurs aux seuils de sécurité.

Le paradoxe absolu : on a rejeté Montagne d'Or (qui n'utilise pas de mercure — procédés modernes) au nom de l'environnement. Et on tolère un désastre environnemental 1 000 fois pire.

Source : ARS Guyane, WWF, Parc amazonien de Guyane`,
    twitter: `☠️ Chaque année, 13t de mercure sont déversées en Guyane par l'orpaillage illégal.

→ 5 840 km de rivières contaminées
→ 10 000+ personnes exposées
→ ~29 000 ha de forêt détruits

On a rejeté Montagne d'Or (0 mercure) pour "protéger l'environnement".

L'ironie est insoutenable.

#Guyane`,
    instagram: `☠️ 13 TONNES DE MERCURE PAR AN

L'orpaillage illégal en Guyane déverse chaque année :

→ 13t de mercure dans les rivières
→ 5 840 km de cours d'eau contaminés
→ 10 000+ personnes exposées
→ ~29 000 ha de forêt détruits

Troubles neurologiques, cancers, malformations… Les communautés autochtones sont les premières victimes.

#Mercure #Guyane #Environnement #OrIllégal #OùVaLArgent #Amazonie #Pollution #SantéPublique`,
    facebook: `☠️ 13 tonnes de mercure par an.

C'est ce que l'orpaillage illégal déverse dans les rivières de Guyane française. 5 840 km de cours d'eau contaminés. Plus de 10 000 personnes exposées.

Le mercure s'accumule dans la chaîne alimentaire : les poissons, puis les habitants. Les enfants des communautés amérindiennes présentent des taux de mercure 3 à 4 fois supérieurs aux seuils de sécurité.

Le paradoxe ? On a rejeté Montagne d'Or (mine légale sans mercure) pour "protéger l'environnement". Et on tolère ce désastre.`,
  },
  {
    titre: '#44 — Guyana : +62% de PIB en 2022',
    date: '2026-02-22',
    theme: 'International',
    type: 'Stat choc',
    statut: 'Pret',
    reel: false,
    source: 'Banque mondiale, FMI — WEO 2025',
    linkedin: `🇬🇾 +62% de PIB en une seule année. Le Guyana a connu en 2022 la croissance la plus forte du monde.

PIB/habitant passé de 5 000 $ (2019) à 25 000 $ (2025). Un quintuplement en 6 ans.

Le moteur ? L'exploitation de ses ressources naturelles :
• Pétrole : 650 000 barils/jour (champ Stabroek avec ExxonMobil)
• Or : 18 tonnes/an
• Secteur minier : 28% du PIB

Le Guyana partage exactement le même bouclier géologique que la Guyane française. La même formation rocheuse vieille de 2 milliards d'années.

La différence ? Le Guyana a choisi d'ouvrir ses ressources. La France a choisi de bloquer.

En 2023, le Guyana a dépassé la Guyane française en PIB par habitant. Un pays autrefois considéré comme l'un des plus pauvres d'Amérique du Sud.

Source : Banque mondiale, FMI WEO`,
    twitter: `🇬🇾 Guyana : +62% de PIB en 2022. Record mondial.

PIB/hab : 5 000 $ (2019) → 25 000 $ (2025)

Moteur : pétrole + or + mines

Même géologie que la Guyane française.

Le Guyana a dépassé la Guyane fr. en PIB/hab en 2023. 🤯

Un ancien pays parmi les plus pauvres d'Am. du Sud.

#Guyana`,
    instagram: `🇬🇾 +62% DE PIB EN 2022

Le Guyana a connu la plus forte croissance au MONDE en 2022.

PIB/hab : 5 000 $ → 25 000 $ en 6 ans

Grâce à ses ressources naturelles.
Même géologie que la Guyane française.

Le Guyana a dépassé la Guyane fr. en 2023.

#Guyana #Croissance #PIB #RecordMondial #OùVaLArgent #International #Pétrole #Or #Économie`,
    facebook: `🇬🇾 +62% de croissance en une seule année.

En 2022, le Guyana a enregistré la plus forte croissance du PIB au monde. Son PIB par habitant est passé de 5 000 $ en 2019 à 25 000 $ en 2025.

Le secret ? L'exploitation massive de ses ressources naturelles : pétrole (ExxonMobil), or (18 tonnes/an), mines (28% du PIB).

Ce qui rend cette histoire fascinante : le Guyana partage exactement le même socle géologique que la Guyane française. Le craton guyanais, vieux de 2 milliards d'années.

En 2023, le Guyana a dépassé la Guyane française en PIB par habitant. Un pays autrefois parmi les plus pauvres d'Amérique du Sud.`,
  },
  {
    titre: '#45 — NordGold réclame 4,5 Md$ à la France (arbitrage)',
    date: '2026-02-23',
    theme: 'Finances publiques',
    type: 'Stat choc',
    statut: 'Pret',
    reel: true,
    source: 'NordGold, tribunal arbitral',
    linkedin: `⚖️ 4,5 milliards de dollars. C'est ce que NordGold réclame à la France.

Après le rejet du projet Montagne d'Or en Guyane (80 tonnes d'or), le groupe minier russo-britannique a lancé un arbitrage international sous le traité bilatéral d'investissement France-Russie.

Montant réclamé : 4,56 milliards de dollars (soit ~4,2 milliards d'euros)

C'est la plus grande demande d'arbitrage jamais déposée contre la France au titre d'un BIT.

Chronologie :
• 2021 : NordGold dépose la demande
• 2022 : Arbitrage suspendu (conflit Ukraine)
• 2024 : Reprise de l'arbitrage
• 2025 : Procédure en cours

Si la France perd, le contribuable devra payer plusieurs milliards pour un projet qu'on a refusé — sans avoir empêché l'orpaillage illégal qui extrait autant d'or (6t/an) sans aucune norme.

Double peine : ni les emplois de Montagne d'Or, ni la protection de l'environnement, et potentiellement 4,5 Md$ d'amende.

Source : NordGold, tribunal arbitral`,
    twitter: `⚖️ NordGold réclame 4,5 Md$ à la France.

Montagne d'Or (80t d'or) rejeté → arbitrage international.

Plus grande demande d'arbitrage contre la France.

Si on perd : le contribuable paie des milliards… pour un projet refusé… sans avoir empêché l'illégal.

Double peine. 🤦

#MontagneOr`,
    instagram: `⚖️ 4,5 MILLIARDS DE DOLLARS

NordGold réclame 4,5 Md$ à la France.

Après le rejet de Montagne d'Or (80t d'or en Guyane), le groupe minier a lancé un arbitrage international.

Si la France perd, le contribuable paie des milliards — sans avoir ni les emplois, ni protégé l'environnement.

#NordGold #MontagneOr #Arbitrage #4Milliards #OùVaLArgent #Guyane #France #Justice #FinancesPubliques`,
    facebook: `⚖️ 4,5 milliards de dollars.

C'est la somme que NordGold réclame à la France après le rejet du projet Montagne d'Or en Guyane.

80 tonnes d'or, 750 emplois, 1 milliard d'investissement. Tout bloqué après 20 ans de procédures. Et maintenant, l'entreprise demande des dommages via un arbitrage international.

Si la France perd :
• Le contribuable paie des milliards
• Pas d'emplois créés
• L'orpaillage illégal continue (6t/an)
• L'environnement n'est pas protégé

C'est la définition de la double peine.`,
    briefReel: 'Montrer le chiffre 4,5 Md$ en gros. Expliquer : rejet de Montagne d\'Or, arbitrage, et le paradoxe mine légale rejetée vs illégal toléré.',
  },
];

// Add each post to Notion — adapted to actual DB schema:
// Titre (title), Date (date), Statut (select), Thème (select),
// Plateforme (multi_select), Texte (rich_text), Image (files), Infographie (relation)

const fs = require('fs');
const configPath = path.join(__dirname, 'notion-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const DB_ID = config.PUBLICATIONS_DB_ID;
const NOTION_SECRET = config.NOTION_SECRET;

function notionCreate(payload) {
  const cmd = `curl -s -X POST "https://api.notion.com/v1/pages" \
    -H "Authorization: Bearer ${NOTION_SECRET}" \
    -H "Content-Type: application/json" \
    -H "Notion-Version: 2022-06-28" \
    -d '${JSON.stringify(payload).replace(/'/g, "'\\''")}'`;
  return JSON.parse(execSync(cmd, { maxBuffer: 10 * 1024 * 1024 }).toString());
}

let success = 0;
let errors = 0;

for (const post of posts) {
  // Compose full text with all platforms
  const textParts = [];
  if (post.linkedin) textParts.push(`📘 LINKEDIN\n${post.linkedin}`);
  if (post.twitter) textParts.push(`🐦 TWITTER\n${post.twitter}`);
  if (post.instagram) textParts.push(`📸 INSTAGRAM\n${post.instagram}`);
  if (post.facebook) textParts.push(`📘 FACEBOOK\n${post.facebook}`);
  if (post.briefReel) textParts.push(`🎬 BRIEF RÉEL\n${post.briefReel}`);
  if (post.source) textParts.push(`📎 SOURCE : ${post.source}`);
  const fullText = textParts.join('\n\n---\n\n');

  // Map theme to Notion
  const themeMap = {
    'International': 'International',
    'Finances publiques': 'Finances publiques',
    'Macro-economie': 'Macro-économie',
  };

  const platforms = ['LinkedIn', 'Twitter', 'Instagram', 'Facebook'];
  if (post.reel) platforms.push('TikTok');

  const payload = {
    parent: { database_id: DB_ID },
    properties: {
      'Titre': { title: [{ text: { content: post.titre } }] },
      'Date': { date: { start: post.date } },
      'Statut': { select: { name: post.statut || 'Pret' } },
      'Thème': { select: { name: themeMap[post.theme] || post.theme } },
      'Plateforme': { multi_select: platforms.map(p => ({ name: p })) },
      'Texte': { rich_text: [{ text: { content: fullText.substring(0, 2000) } }] },
    },
  };

  try {
    const result = notionCreate(payload);
    if (result.object === 'error') {
      console.error(`❌ ${post.titre}: ${result.message}`);
      errors++;
    } else {
      console.log(`✅ ${post.titre}`);
      success++;
    }
  } catch (err) {
    console.error(`❌ ${post.titre}: ${err.message}`);
    errors++;
  }
}

console.log(`\n✅ ${success} publications ajoutées, ${errors} erreurs`);

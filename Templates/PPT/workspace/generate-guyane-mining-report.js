/**
 * Rapport : Le potentiel minier de la Guyane française
 * ~51 slides — format rapport consulting (dark theme)
 *
 * Usage: cd Templates/PPT/workspace && node generate-guyane-mining-report.js
 */

const pptxgen = require('pptxgenjs');
const r = require('./pptx-report-helpers');

const pptx = new pptxgen();
r.setupReport(pptx);
pptx.title = 'Le potentiel minier de la Guyane française';
pptx.subject = 'Ressources stratégiques inexploitées';

// ============================================================
// SECTION 0 : OUVERTURE
// ============================================================

// Slide 1 — Cover
r.addCover(pptx,
    'Le potentiel minier de la\nGuyane française',
    'Une ressource stratégique inexploitée',
    'Février 2026',
    'Où Va l\'Argent — Études'
);

// Slide 2 — Table des matières
r.addTOC(pptx, [
    { num: '01', title: 'Pourquoi la Guyane maintenant ?', page: 4 },
    { num: '02', title: 'Géologie : un bouclier de 2 milliards d\'années', page: 8 },
    { num: '03', title: 'Un sous-sol d\'une richesse exceptionnelle', page: 12 },
    { num: '04', title: 'L\'or : entre potentiel et paralysie', page: 18 },
    { num: '05', title: 'L\'orpaillage illégal : un fléau souverain', page: 22 },
    { num: '06', title: 'Le prix écologique de l\'inaction', page: 27 },
    { num: '07', title: 'Une économie fragile en quête de moteur', page: 31 },
]);

// Slide 2b — TOC page 2
const s2b = r.addTOC(pptx, [
    { num: '08', title: 'Un cadre réglementaire qui freine le développement', page: 35 },
    { num: '09', title: 'Ce que font les voisins', page: 38 },
    { num: '10', title: 'Combien vaut le sous-sol guyanais ?', page: 42 },
    { num: '11', title: 'Au-delà des mines : hydrogène vert et nouvelles filières', page: 46 },
    { num: '12', title: 'Recommandations et conclusion', page: 49 },
]);

// Slide 3 — Executive Summary
r.addExecSummary(pptx,
    'Synthèse : cinq constats clés sur le potentiel minier guyanais',
    'Synthèse',
    [
        {
            title: 'Un sous-sol parmi les plus riches au monde, largement inexploré',
            desc: 'Le craton guyanais (2 Md d\'années) recèle or, coltan, tantale, terres rares, bauxite, kaolin, diamants. 98 % du territoire n\'a fait l\'objet d\'aucune prospection minière moderne.'
        },
        {
            title: 'L\'orpaillage illégal représente un fléau souverain majeur',
            desc: '~6 t d\'or extraites illégalement par an, 8 000 garimpeiros, ~500 sites actifs. 13 t de mercure déversées chaque année. Coût estimé > 500 M€/an.'
        },
        {
            title: 'L\'UE dépend à 98 % de la Chine pour ses terres rares',
            desc: 'Le Critical Raw Materials Act (2024) et le plan ReSourceEU (3 Md€) ouvrent une fenêtre d\'opportunité stratégique pour la Guyane.'
        },
        {
            title: 'Les voisins exploitent le même bouclier géologique avec succès',
            desc: 'Le Guyana a connu +62 % de croissance en 2022 grâce à ses ressources naturelles. Le Suriname développe activement son secteur minier.'
        },
        {
            title: 'Le cadre réglementaire français paralyse tout développement',
            desc: 'Délai moyen d\'obtention d\'un permis minier : ~10 ans en France vs 2 ans en Australie. Montagne d\'Or (80 t d\'or, 3 Md$) rejeté.'
        }
    ],
    'BRGM, INSEE, Eurostat, rapports parlementaires', 3
);

// ============================================================
// SECTION 1 : CONTEXTE GÉOSTRATÉGIQUE
// ============================================================

// Slide 4 — Section divider
r.addSectionDivider(pptx, 1, 'Pourquoi la Guyane maintenant ?', 'Contexte géostratégique');

// Slide 5 — KPI Dashboard : dépendance européenne
r.addKPIDashboard(pptx,
    'La dépendance européenne aux métaux critiques atteint un niveau critique',
    'Géostratégie',
    [
        { label: 'Dépendance UE — terres rares', value: '98%', delta: 'Provenance : Chine', deltaColor: r.colors.accentRed, context: 'Commission européenne, 2024' },
        { label: 'Dépendance UE — lithium', value: '79%', delta: 'Importé de Chili et Australie', deltaColor: r.colors.accentOrange, context: 'Eurostat' },
        { label: 'Dépendance UE — cobalt', value: '68%', delta: 'RDC premier fournisseur', deltaColor: r.colors.accentOrange, context: 'Commission européenne' },
        { label: 'Objectif CRM Act 2030', value: '10%', delta: 'Extraction domestique UE', deltaColor: r.colors.accentGreen, context: 'Règlement (UE) 2024/1252' },
        { label: 'Budget ReSourceEU', value: '3 Md€', delta: 'Programme 2025-2030', deltaColor: r.colors.accentElectric, context: 'Commission européenne, nov. 2024' },
        { label: 'Métaux critiques identifiés', value: '34', delta: 'Liste UE mise à jour 2023', deltaColor: r.colors.accentPurple, context: 'CRM Act Annexe I' },
    ],
    'Commission européenne, Eurostat, CRM Act 2024', 5
);

// Slide 6 — DataTable : imports UE par pays
r.addDataTable(pptx,
    'L\'UE importe 98 % de ses terres rares de Chine',
    'Géostratégie',
    ['Matière', 'Part Chine', 'Part autres', 'Criticité UE', 'Guyane ?'],
    [
        ['Terres rares', '98%', '2% (Myanmar)', '★★★★★', '✓ Potentiel'],
        ['Lithium', '79%', 'Chili, Australie', '★★★★★', '✓ Indices'],
        ['Tantale', '34%', 'RDC, Rwanda', '★★★★☆', '✓ 30 gisements'],
        ['Cobalt', '68%', 'RDC', '★★★★★', '? À explorer'],
        ['Niobium', '85%', 'Brésil', '★★★★☆', '✓ Potentiel'],
        ['Bauxite', '30%', 'Guinée, Australie', '★★★☆☆', '✓ Gisements'],
        ['Or', '—', 'Diversifié', '★★★☆☆', '✓ 80+ tonnes'],
    ],
    'Commission européenne — CRM Act 2024, BRGM', 6
);

// Slide 7 — TextSlide : CRM Act
r.addTextSlide(pptx,
    'Le Critical Raw Materials Act ouvre une fenêtre d\'opportunité stratégique',
    'Géostratégie',
    [
        { text: 'Le Critical Raw Materials Act (mars 2024)\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentElectric } },
        { text: 'Règlement européen fixant des objectifs contraignants d\'ici 2030 :\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• ', options: { fontSize: 11, color: r.colors.accentElectric } },
        { text: '10 % d\'extraction domestique (vs ~3 % aujourd\'hui)\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• ', options: { fontSize: 11, color: r.colors.accentElectric } },
        { text: '40 % de transformation sur le sol européen\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• ', options: { fontSize: 11, color: r.colors.accentElectric } },
        { text: '25 % de recyclage des matières critiques\n\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'Plan ReSourceEU (novembre 2024)\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentGold } },
        { text: '• Budget : 3 milliards d\'euros sur 2025-2030\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Financement de projets d\'extraction et de raffinage en Europe\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• La Guyane, seul territoire européen sur un craton archéen riche en métaux critiques, pourrait capter une part significative de ces financements\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textSecondary, italic: true } },
    ],
    'Commission européenne, Règlement (UE) 2024/1252', 7
);

// ============================================================
// SECTION 2 : LE BOUCLIER GUYANAIS
// ============================================================

// Slide 8
r.addSectionDivider(pptx, 2, 'Géologie : un bouclier de\n2 milliards d\'années', 'Le craton guyanais');

// Slide 9 — TextSlide
r.addTextSlide(pptx,
    'Le craton guyanais : l\'une des formations géologiques les plus riches au monde',
    'Géologie',
    [
        { text: 'Un socle précambrien exceptionnel\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentElectric } },
        { text: 'Le bouclier guyanais est un craton archéen et protérozoïque âgé de 1,7 à 2,2 milliards d\'années. Il s\'étend sur 1,5 million de km² du Venezuela au Brésil, en passant par le Guyana, le Suriname et la Guyane française.\n\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'Pourquoi c\'est important\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentGold } },
        { text: 'Les cratons archéens sont les formations géologiques les plus riches en minerais au monde. Les grands districts miniers — Pilbara (Australie), Witwatersrand (Afrique du Sud), Abitibi (Canada) — reposent tous sur ce type de socle.\n\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'La Guyane : 84 000 km² sur ce bouclier\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentGreen } },
        { text: 'C\'est le seul territoire de l\'UE situé sur un craton archéen. Recouvert à 96 % de forêt amazonienne, son sous-sol reste largement inexploré par les méthodes modernes. Le BRGM estime que seuls 2 % du territoire ont fait l\'objet d\'une cartographie géologique détaillée.', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
    ],
    'BRGM — Inventaire minier de la Guyane', 9
);

// Slide 10 — Comparison
r.addComparison(pptx,
    'Même géologie, trajectoires opposées',
    'Géologie',
    [
        {
            title: '🇬🇾 Guyana',
            color: r.colors.accentGreen,
            metrics: [
                { label: 'Secteur minier', value: '28% du PIB' },
                { label: 'Production or', value: '18 t/an' },
                { label: 'Permis actifs', value: '> 1 000' },
                { label: 'Croissance 2022', value: '+62%' },
            ]
        },
        {
            title: '🇸🇷 Suriname',
            color: r.colors.accentGold,
            metrics: [
                { label: 'Secteur minier', value: '20% du PIB' },
                { label: 'Production or', value: '30 t/an' },
                { label: 'Permis actifs', value: '> 200' },
                { label: 'Projet Merian', value: '1,4 Md$' },
            ]
        },
        {
            title: '🇫🇷 Guyane fr.',
            color: r.colors.accentRed,
            metrics: [
                { label: 'Secteur minier', value: '< 1% du PIB' },
                { label: 'Production or légale', value: '~1,5 t/an' },
                { label: 'Permis actifs', value: '~30' },
                { label: 'Montagne d\'Or', value: 'Rejeté' },
            ]
        },
    ],
    'BRGM, Banque mondiale, statistiques nationales', 10
);

// Slide 11 — Chart with analysis (bar chart of deposits)
r.addChartWithAnalysis(pptx,
    'Un inventaire BRGM identifie des gisements majeurs sur tout le territoire',
    'Géologie',
    'BAR',
    [{
        name: 'Gisements identifiés',
        labels: ['Or', 'Tantale', 'Bauxite', 'Kaolin', 'Diamants', 'Terres rares'],
        values: [47, 30, 12, 8, 6, 4],
    }],
    {
        x: 0.4, y: 1.6, w: 5.2, h: 3.2,
        catAxisOrientation: 'minMax',
        showValue: true,
        valueFontSize: 9,
        valueFontColor: r.colors.textPrimary,
        chartColors: [r.colors.accentGold],
    },
    [
        { text: '47 gisements d\'or répertoriés, dont Montagne d\'Or (80+ t)' },
        { text: '30 indices de tantale/coltan — aucune exploitation depuis 1990' },
        { text: '12 gisements de bauxite identifiés dans le nord' },
        { text: 'Prospection moderne sur < 2% du territoire' },
    ],
    'BRGM — Inventaire du domaine minier guyanais', 11
);

// ============================================================
// SECTION 3 : INVENTAIRE DES RESSOURCES
// ============================================================

// Slide 12
r.addSectionDivider(pptx, 3, 'Un sous-sol d\'une richesse\nexceptionnelle', 'Inventaire des ressources');

// Slide 13 — KPI Dashboard : Or
r.addKPIDashboard(pptx,
    'Montagne d\'Or seul représente 80+ tonnes de réserves identifiées',
    'Ressources',
    [
        { label: 'Réserves Montagne d\'Or', value: '80+ t', delta: 'Projet avorté en 2024', deltaColor: r.colors.accentRed, context: 'NordGold / Oréa Mining' },
        { label: 'Valeur estimée (cours 2025)', value: '~7 Md€', delta: 'Au cours de ~2 200 $/oz', deltaColor: r.colors.accentGold, context: 'Calcul sur réserves prouvées' },
        { label: 'Production or légale/an', value: '1,5 t', delta: 'vs 6 t illégales', deltaColor: r.colors.accentRed, context: 'DREAL Guyane, 2024' },
        { label: 'Emplois directs projetés', value: '750', delta: 'Montagne d\'Or seul', deltaColor: r.colors.accentElectric, context: 'Étude d\'impact 2018' },
        { label: 'Gisements or identifiés', value: '47', delta: 'BRGM inventaire', deltaColor: r.colors.accentElectric, context: 'Sur 2% du territoire exploré' },
        { label: 'Durée de vie estimée', value: '12 ans', delta: 'Mine Montagne d\'Or', deltaColor: r.colors.accentPurple, context: 'Phase exploitation' },
    ],
    'BRGM, NordGold, DREAL Guyane', 13
);

// Slide 14 — DataTable : Inventaire complet
r.addDataTable(pptx,
    'Inventaire complet des ressources identifiées en Guyane',
    'Ressources',
    ['Ressource', 'Gisements', 'Réserves est.', 'Valeur est.', 'Statut'],
    [
        ['Or', '47', '100+ tonnes', '~8 Md€', 'Exploitation très limitée'],
        ['Tantale/Coltan', '30', 'Non quantifié', 'Stratégique', 'Aucune prod. depuis 1990'],
        ['Bauxite', '12', '> 20 Mt', '~500 M€', 'Non exploité'],
        ['Kaolin', '8', '> 5 Mt', '~200 M€', 'Non exploité'],
        ['Diamants', '6', 'Non quantifié', 'Inconnu', 'Artisanal historique'],
        ['Terres rares', '4 indices', 'À confirmer', 'Stratégique', 'Prospection BRGM'],
        ['Niobium', '3 indices', 'À confirmer', 'Stratégique', 'Prospection BRGM'],
    ],
    'BRGM — Inventaire minier, DREAL Guyane', 14
);

// Slide 15 — BridgeChart : Valeur estimée des réserves
r.addBridgeChart(pptx,
    'Valeur estimée des réserves identifiées : plus de 10 milliards d\'euros',
    'Ressources',
    [
        { label: 'Or', value: 8, type: 'start' },
        { label: 'Bauxite', value: 0.5, type: 'positive' },
        { label: 'Kaolin', value: 0.2, type: 'positive' },
        { label: 'Tantale', value: 1.0, type: 'positive' },
        { label: 'Autres', value: 0.5, type: 'positive' },
        { label: 'Total', value: 0, type: 'total' },
    ],
    'Md€',
    'BRGM, estimations Où Va l\'Argent (cours 2025)', 15
);

// Slide 16 — Chart with analysis : Coltan
r.addChartWithAnalysis(pptx,
    'Coltan et tantale : 30 gisements identifiés, production nulle depuis 1990',
    'Ressources',
    'BAR',
    [{
        name: 'Production tantale (tonnes)',
        labels: ['1970', '1975', '1980', '1985', '1990', '2000', '2010', '2024'],
        values: [15, 28, 42, 35, 8, 0, 0, 0],
    }],
    {
        x: 0.4, y: 1.6, w: 5.2, h: 3.2,
        showValue: true,
        valueFontSize: 9,
        valueFontColor: r.colors.textPrimary,
        chartColors: [r.colors.accentPurple],
    },
    [
        { text: 'Production arrêtée en 1990 malgré 30 gisements connus' },
        { text: 'Le tantale est classé "critique" par l\'UE (batteries, électronique)' },
        { text: 'Prix mondial x3 en 10 ans : de 40 $/lb à 120 $/lb' },
        { text: 'La RDC (conflit) et le Rwanda dominent le marché mondial' },
    ],
    'BRGM, USGS, London Metal Exchange', 16
);

// Slide 17 — Comparison : Ce que la Guyane pourrait fournir
r.addComparison(pptx,
    'Ressources critiques UE : ce que la Guyane pourrait fournir',
    'Ressources',
    [
        {
            title: 'Imports UE actuels',
            color: r.colors.accentRed,
            metrics: [
                { label: 'Terres rares', value: '98% Chine' },
                { label: 'Tantale', value: '34% RDC' },
                { label: 'Bauxite', value: '30% Guinée' },
                { label: 'Or', value: 'Diversifié' },
            ]
        },
        {
            title: 'Potentiel Guyane',
            color: r.colors.accentGreen,
            metrics: [
                { label: 'Terres rares', value: 'Indices prometteurs' },
                { label: 'Tantale', value: '30 gisements' },
                { label: 'Bauxite', value: '20+ Mt réserves' },
                { label: 'Or', value: '100+ tonnes' },
            ]
        },
        {
            title: 'Objectif CRM 2030',
            color: r.colors.accentElectric,
            metrics: [
                { label: 'Extraction UE', value: '10%' },
                { label: 'Transformation UE', value: '40%' },
                { label: 'Recyclage', value: '25%' },
                { label: 'Stock stratégique', value: 'Oui' },
            ]
        },
    ],
    'Commission européenne, BRGM', 17
);

// ============================================================
// SECTION 4 : L'OR GUYANAIS
// ============================================================

// Slide 18
r.addSectionDivider(pptx, 4, 'L\'or : entre potentiel\net paralysie', 'Production aurifère');

// Slide 19 — KPI Dashboard
r.addKPIDashboard(pptx,
    'Production légale quasi-nulle face à 6 tonnes/an d\'extraction illégale',
    'Or',
    [
        { label: 'Production légale', value: '1,5 t/an', delta: 'Artisanal et petite mine', deltaColor: r.colors.accentElectric, context: 'DREAL Guyane, 2024' },
        { label: 'Extraction illégale estimée', value: '~6 t/an', delta: '4x la prod. légale', deltaColor: r.colors.accentRed, context: 'WWF, rapport Harpie' },
        { label: 'Manque à gagner fiscal', value: '~200 M€/an', delta: 'Taxes + redevances', deltaColor: r.colors.accentRed, context: 'Estimation parlementaire' },
        { label: 'Cours or (fév. 2026)', value: '2 900 $/oz', delta: '+85% en 5 ans', deltaColor: r.colors.accentGold, context: 'London Bullion Market' },
    ],
    'DREAL Guyane, WWF, LBMA', 19
);

// Slide 20 — TextSlide : Montagne d'Or
r.addTextSlide(pptx,
    'Montagne d\'Or : chronique d\'un projet avorté',
    'Or',
    [
        { text: 'Le plus grand projet minier de France\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentGold } },
        { text: '• Gisement : 80+ tonnes d\'or, 2,5 km de long, à ciel ouvert\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Investissement prévu : 1 Md€ (NordGold + Oréa Mining)\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• 750 emplois directs, 3 000 emplois indirects\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Durée de vie : 12 ans d\'exploitation\n\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'Chronologie du blocage\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentRed } },
        { text: '• 2004 : Découverte du gisement par Iamgold\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textSecondary } },
        { text: '• 2017 : Macron qualifie le projet de "pas compatible" avec l\'environnement\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textSecondary } },
        { text: '• 2019 : Refus des concessions par le Conseil d\'État\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textSecondary } },
        { text: '• 2024 : Rejet définitif. NordGold lance un arbitrage international\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textSecondary } },
        { text: '• 2025 : NordGold réclame 4,5 Md$ de dommages à la France\n\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.accentRed } },
        { text: 'Paradoxe : le rejet de Montagne d\'Or n\'a pas empêché l\'orpaillage illégal, qui extrait autant d\'or sans aucune norme environnementale.', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textMuted, italic: true } },
    ],
    'NordGold, Oréa Mining, Conseil d\'État, rapports parlementaires', 20
);

// Slide 21 — DataTable : Auplata
r.addDataTable(pptx,
    'Auplata Mining Group : le seul acteur minier légal significatif',
    'Or',
    ['Indicateur', '2020', '2022', '2024', 'Tendance'],
    [
        ['Production or (kg)', '350', '480', '520', '↗ +49%'],
        ['CA (M€)', '12', '22', '28', '↗ +133%'],
        ['Employés Guyane', '120', '180', '210', '↗ +75%'],
        ['Permis détenus', '6', '8', '8', '→ Stable'],
        ['Investissement R&D (M€)', '1,2', '2,5', '3,8', '↗ +217%'],
        ['Cours action (€)', '0,05', '0,03', '0,02', '↘ -60%'],
    ],
    'Auplata Mining Group — rapports annuels', 21,
    { highlightRow: 1 }
);

// ============================================================
// SECTION 5 : ORPAILLAGE ILLÉGAL
// ============================================================

// Slide 22
r.addSectionDivider(pptx, 5, 'L\'orpaillage illégal :\nun fléau souverain', 'Criminalité organisée');

// Slide 23 — KPI Dashboard
r.addKPIDashboard(pptx,
    '~500 sites illégaux, 8 000 garimpeiros, 6 tonnes d\'or par an',
    'Orpaillage illégal',
    [
        { label: 'Sites illégaux actifs', value: '~500', delta: 'Estimations 400-600', deltaColor: r.colors.accentRed, context: 'ONF / Forces armées, 2024' },
        { label: 'Garimpeiros estimés', value: '8 000', delta: 'Principalement brésiliens', deltaColor: r.colors.accentRed, context: 'Rapport Sénat 2023' },
        { label: 'Or extrait illégalement', value: '~6 t/an', delta: 'Valeur : ~500 M€', deltaColor: r.colors.accentGold, context: 'WWF / PAG' },
        { label: 'Mercure déversé', value: '13 t/an', delta: 'Contamination irréversible', deltaColor: r.colors.accentRed, context: 'ARS Guyane' },
        { label: 'Budget Harpie/an', value: '~80 M€', delta: 'Forces armées + gendarmerie', deltaColor: r.colors.accentElectric, context: 'Ministère des Armées' },
        { label: 'Matériel détruit', value: '26 M€', delta: 'Cumul 2008-2024', deltaColor: r.colors.accentOrange, context: 'Bilan Harpie' },
    ],
    'Forces armées en Guyane, WWF, ARS, rapport Sénat 2023', 23
);

// Slide 24 — Chart : Évolution sites illégaux
r.addChartWithAnalysis(pptx,
    'Le nombre de sites illégaux a explosé malgré l\'opération Harpie',
    'Orpaillage illégal',
    'LINE',
    [{
        name: 'Sites illégaux détectés',
        labels: ['2008', '2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
        values: [180, 220, 280, 340, 380, 420, 440, 520, 500],
    }],
    {
        x: 0.4, y: 1.6, w: 5.2, h: 3.2,
        lineDataSymbol: 'circle',
        lineDataSymbolSize: 6,
        showValue: true,
        valueFontSize: 8,
        valueFontColor: r.colors.textPrimary,
        chartColors: [r.colors.accentRed],
    },
    [
        { text: 'Harpie lancée en 2008 : 2 500 militaires déployés' },
        { text: 'Malgré les destructions, les garimpeiros reconstruisent en 48h' },
        { text: '+228% de sites depuis le lancement de Harpie' },
        { text: 'Filière alimentée par le crime organisé brésilien' },
    ],
    'Forces armées en Guyane, ONF', 24
);

// Slide 25 — BridgeChart : Coûts pour l'État
r.addBridgeChart(pptx,
    'L\'orpaillage illégal coûte plus de 500 M€/an à la France',
    'Orpaillage illégal',
    [
        { label: 'Opérations\nmilitaires', value: 80, type: 'start' },
        { label: 'Manque à\ngagner fiscal', value: 200, type: 'positive' },
        { label: 'Dégâts\nenviron.', value: 150, type: 'positive' },
        { label: 'Santé\npublique', value: 50, type: 'positive' },
        { label: 'Perte éco.\nlocale', value: 40, type: 'positive' },
        { label: 'Coût total\nestimé', value: 0, type: 'total' },
    ],
    'M€/an',
    'Estimations croisées : Ministère des Armées, INSEE, ARS, rapports parlementaires', 25
);

// Slide 26 — TextSlide : Harpie
r.addTextSlide(pptx,
    'Opération Harpie : un effort coûteux mais insuffisant',
    'Orpaillage illégal',
    [
        { text: 'Dispositif militaire permanent depuis 2008\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentElectric } },
        { text: '• 2 500 militaires (FAG) + 600 gendarmes mobilisés\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Patrouilles héliportées en forêt profonde\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• 26 M€ de matériel saisi et détruit (pirogues, moteurs, pelles mécaniques)\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Coopération franco-brésilienne (accord de 2008, renouvelé)\n\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'Pourquoi ça ne fonctionne pas\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentRed } },
        { text: '• Frontière de 730 km avec le Brésil, impossible à surveiller\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Les garimpeiros reconstruisent un site en 48h après destruction\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Crime organisé : filières logistiques sophistiquées depuis le Brésil\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Rentabilité : à 2 900 $/oz, l\'orpaillage reste extrêmement lucratif\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• L\'absence d\'alternative économique légale pousse certains locaux vers l\'illégal', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textSecondary, italic: true } },
    ],
    'Ministère des Armées, Forces armées en Guyane', 26
);

// ============================================================
// SECTION 6 : IMPACT ENVIRONNEMENTAL
// ============================================================

// Slide 27
r.addSectionDivider(pptx, 6, 'Le prix écologique\nde l\'inaction', 'Impact environnemental');

// Slide 28 — KPI Dashboard
r.addKPIDashboard(pptx,
    '~29 000 ha déforestés, 13 t de mercure, 5 840 km de cours d\'eau contaminés',
    'Environnement',
    [
        { label: 'Déforestation cumulée', value: '~29 000 ha', delta: 'Depuis les années 2000', deltaColor: r.colors.accentRed, context: 'ONF / images satellites' },
        { label: 'Mercure déversé/an', value: '13 tonnes', delta: 'Contamination chaîne alimentaire', deltaColor: r.colors.accentRed, context: 'ARS Guyane' },
        { label: 'Cours d\'eau contaminés', value: '5 840 km', delta: 'Sur 15 000 km de réseau', deltaColor: r.colors.accentOrange, context: 'PAG / DEAL' },
        { label: 'Population exposée au mercure', value: '> 10 000', delta: 'Communautés autochtones', deltaColor: r.colors.accentRed, context: 'Santé publique France' },
    ],
    'ONF, ARS Guyane, Parc amazonien de Guyane', 28
);

// Slide 29 — Comparison
r.addComparison(pptx,
    'Orpaillage illégal vs exploitation légale encadrée : le paradoxe',
    'Environnement',
    [
        {
            title: 'Orpaillage illégal',
            color: r.colors.accentRed,
            metrics: [
                { label: 'Mercure', value: '13 t/an' },
                { label: 'Déforestation', value: 'Non contrôlée' },
                { label: 'Réhabilitation', value: 'Aucune' },
                { label: 'Suivi environ.', value: 'Zéro' },
            ]
        },
        {
            title: 'Mine légale (ex. Montagne d\'Or)',
            color: r.colors.accentGreen,
            metrics: [
                { label: 'Mercure', value: 'Interdit (cyanure encadré)' },
                { label: 'Déforestation', value: 'Compensée 1:3' },
                { label: 'Réhabilitation', value: 'Obligatoire + caution' },
                { label: 'Suivi environ.', value: 'DREAL + ICPE' },
            ]
        },
    ],
    'DREAL Guyane, étude d\'impact Montagne d\'Or, ARS', 29
);

// Slide 30 — TextSlide
r.addTextSlide(pptx,
    'L\'exploitation légale comme solution environnementale (le paradoxe)',
    'Environnement',
    [
        { text: 'Le constat contre-intuitif\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentGreen } },
        { text: 'Bloquer les projets miniers légaux n\'a pas protégé l\'environnement guyanais — c\'est l\'inverse qui s\'est produit. L\'orpaillage illégal a explosé, causant des dégâts incomparablement plus graves que n\'importe quelle mine encadrée.\n\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'Une mine légale encadrée :\n', options: { fontSize: 13, fontFace: r.fonts.main, bold: true, color: r.colors.accentElectric } },
        { text: '• N\'utilise pas de mercure (procédés modernes : gravimétrie, cyanuration contrôlée)\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Compense la déforestation (ratio 1:3 imposé par la loi)\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Réhabilite le site après exploitation (caution financière obligatoire)\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Finance la surveillance et la lutte contre l\'orpaillage illégal\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Crée des emplois locaux qui réduisent l\'attractivité de l\'illégal\n\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'La vraie question n\'est pas « mine ou pas mine » mais « mine légale ou mine illégale ».\nAujourd\'hui, c\'est l\'illégal qui gagne — avec des dégâts environnementaux catastrophiques.', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.accentGold, italic: true } },
    ],
    'DREAL Guyane, PAG, ONF', 30
);

// ============================================================
// SECTION 7 : ÉCONOMIE DE LA GUYANE
// ============================================================

// Slide 31
r.addSectionDivider(pptx, 7, 'Une économie fragile\nen quête de moteur', 'Économie guyanaise');

// Slide 32 — KPI Dashboard
r.addKPIDashboard(pptx,
    'PIB 5,1 Md€, chômage 17 %, déficit commercial 2,5 Md€',
    'Économie',
    [
        { label: 'PIB Guyane (2024)', value: '5,1 Md€', delta: '+2,8%/an en moyenne', deltaColor: r.colors.accentGreen, context: 'INSEE — Comptes régionaux' },
        { label: 'PIB/habitant', value: '16 800 €', delta: 'vs 42 000 € métropole', deltaColor: r.colors.accentRed, context: '-60% vs moyenne nationale' },
        { label: 'Taux de chômage', value: '17%', delta: 'vs 7,5% métropole', deltaColor: r.colors.accentRed, context: 'INSEE T3 2025' },
        { label: 'Déficit commercial', value: '2,5 Md€', delta: 'Imports >> Exports', deltaColor: r.colors.accentRed, context: 'Douanes, 2024' },
        { label: 'Transferts publics', value: '~3 Md€/an', delta: '~60% du PIB', deltaColor: r.colors.accentOrange, context: 'IEDOM Guyane' },
        { label: 'Croissance démo.', value: '+2,4%/an', delta: 'Pop. 310 000 hab.', deltaColor: r.colors.accentElectric, context: 'INSEE — démographie' },
    ],
    'INSEE, IEDOM, Douanes', 32
);

// Slide 33 — BridgeChart : Flux financiers
r.addBridgeChart(pptx,
    'D\'où vient et où va l\'argent en Guyane',
    'Économie',
    [
        { label: 'Transferts\npublics', value: 3.0, type: 'start' },
        { label: 'Spatial\n(CSG)', value: 0.8, type: 'positive' },
        { label: 'Pêche +\nagriculture', value: 0.3, type: 'positive' },
        { label: 'Mine\nlégale', value: 0.1, type: 'positive' },
        { label: 'Imports\n(-)', value: -3.5, type: 'negative' },
        { label: 'Solde net', value: 0, type: 'total' },
    ],
    'Md€',
    'IEDOM Guyane, INSEE, Douanes', 33
);

// Slide 34 — DataTable : Comparaison DOM
r.addDataTable(pptx,
    'La Guyane reste le DOM le plus fragile économiquement',
    'Économie',
    ['Indicateur', 'Guyane', 'Martinique', 'Réunion', 'Métropole'],
    [
        ['PIB/hab. (€)', '16 800', '24 500', '22 100', '42 000'],
        ['Chômage', '17%', '14%', '18%', '7,5%'],
        ['Transferts/PIB', '~60%', '~45%', '~50%', '—'],
        ['Secteur minier/PIB', '<1%', '0%', '0%', '<0,5%'],
        ['Crois. démo./an', '+2,4%', '-0,3%', '+0,5%', '+0,3%'],
        ['Pauvreté (seuil 60%)', '53%', '33%', '39%', '14%'],
    ],
    'INSEE — Comptes régionaux 2024, IEDOM', 34,
    { highlightRow: 0 }
);

// ============================================================
// SECTION 8 : CADRE RÉGLEMENTAIRE
// ============================================================

// Slide 35
r.addSectionDivider(pptx, 8, 'Un cadre réglementaire\nqui freine le développement', 'Réglementation');

// Slide 36 — TextSlide
r.addTextSlide(pptx,
    'SDOM, Code minier, moratoire : un millefeuille administratif paralysant',
    'Réglementation',
    [
        { text: 'Schéma Départemental d\'Orientation Minière (SDOM)\n', options: { fontSize: 13, fontFace: r.fonts.main, bold: true, color: r.colors.accentElectric } },
        { text: '• Adopté en 2011, révisé en 2020 : interdit l\'exploitation primaire sur ~60% du territoire\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Zone 0 (interdite) couvre la quasi-totalité de la forêt primaire\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Paradoxe : l\'orpaillage illégal se concentre précisément en zone interdite\n\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.accentRed } },
        { text: 'Code minier français (dernière réforme : 2023)\n', options: { fontSize: 13, fontFace: r.fonts.main, bold: true, color: r.colors.accentGold } },
        { text: '• Procédure d\'obtention d\'un PER : 2-5 ans\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Concession minière : 5-10 ans supplémentaires\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Durée totale découverte → production : ~10-15 ans\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Obligation de « participation du public » à chaque étape\n\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'Moratoire de fait depuis 2017\n', options: { fontSize: 13, fontFace: r.fonts.main, bold: true, color: r.colors.accentRed } },
        { text: '• Aucun nouveau permis d\'exploitation industrielle accordé depuis 2017\n', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Signal envoyé aux investisseurs internationaux : la France n\'est pas "mining-friendly"', options: { fontSize: 10, fontFace: r.fonts.main, color: r.colors.textSecondary, italic: true } },
    ],
    'Code minier, SDOM Guyane, rapports CGEDD', 36
);

// Slide 37 — Comparison : Délais
r.addComparison(pptx,
    'Délais d\'obtention de permis miniers : la France 5x plus lente',
    'Réglementation',
    [
        {
            title: '🇫🇷 France',
            color: r.colors.accentRed,
            metrics: [
                { label: 'Exploration → Prod.', value: '10-15 ans' },
                { label: 'Permis recherche', value: '2-5 ans' },
                { label: 'Concession', value: '5-10 ans' },
                { label: 'Recours possibles', value: 'Illimités' },
            ]
        },
        {
            title: '🇦🇺 Australie',
            color: r.colors.accentGreen,
            metrics: [
                { label: 'Exploration → Prod.', value: '2-4 ans' },
                { label: 'Permis recherche', value: '3-6 mois' },
                { label: 'Licence minière', value: '1-2 ans' },
                { label: 'Guichet unique', value: 'Oui' },
            ]
        },
        {
            title: '🇨🇦 Canada',
            color: r.colors.accentElectric,
            metrics: [
                { label: 'Exploration → Prod.', value: '3-5 ans' },
                { label: 'Permis recherche', value: '6-12 mois' },
                { label: 'Bail minier', value: '1-3 ans' },
                { label: 'Free mining', value: 'Oui (claim)' },
            ]
        },
        {
            title: '🇬🇾 Guyana',
            color: r.colors.accentGold,
            metrics: [
                { label: 'Exploration → Prod.', value: '1-3 ans' },
                { label: 'Permis recherche', value: '< 3 mois' },
                { label: 'Licence', value: '6-12 mois' },
                { label: 'Fiscalité', value: 'Attractive' },
            ]
        },
    ],
    'Banque mondiale — Doing Business Mining, Fraser Institute', 37
);

// ============================================================
// SECTION 9 : COMPARAISONS INTERNATIONALES
// ============================================================

// Slide 38
r.addSectionDivider(pptx, 9, 'Ce que font les voisins', 'Comparaisons internationales');

// Slide 39 — KPI Dashboard : Guyana
r.addKPIDashboard(pptx,
    'Guyana : de la pauvreté au boom économique grâce aux ressources naturelles',
    'International',
    [
        { label: 'Croissance PIB 2022', value: '+62%', delta: 'Record mondial', deltaColor: r.colors.accentGreen, context: 'Banque mondiale' },
        { label: 'PIB/hab. 2025', value: '~25 000 $', delta: 'vs 5 000 $ en 2019', deltaColor: r.colors.accentGreen, context: 'FMI — WEO' },
        { label: 'Production or', value: '18 t/an', delta: '12x la Guyane légale', deltaColor: r.colors.accentGold, context: 'Guyana Gold Board' },
        { label: 'Production pétrole', value: '650 000 b/j', delta: 'Depuis 2020 (Liza)', deltaColor: r.colors.accentElectric, context: 'ExxonMobil Guyana' },
        { label: 'Secteur minier/PIB', value: '28%', delta: 'vs < 1% Guyane fr.', deltaColor: r.colors.accentGold, context: 'Banque mondiale' },
        { label: 'IDE miniers 2024', value: '~3 Md$', delta: 'Boom investissements', deltaColor: r.colors.accentGreen, context: 'Guyana Investment Office' },
    ],
    'Banque mondiale, FMI, ExxonMobil Guyana', 39
);

// Slide 40 — DataTable : Modèles
r.addDataTable(pptx,
    'Modèles de développement minier réussis',
    'International',
    ['Pays', 'Mine/PIB', 'Régulation', 'Délai permis', 'Modèle'],
    [
        ['🇬🇾 Guyana', '28%', 'Libérale', '< 1 an', 'Ouverture totale'],
        ['🇸🇷 Suriname', '20%', 'PPP', '1-2 ans', 'Joint-ventures'],
        ['🇬🇭 Ghana', '7%', 'Encadrée', '1-2 ans', 'Redevances + emploi local'],
        ['🇦🇺 Australie-Occ.', '35%', 'Stricte mais rapide', '2-4 ans', 'Guichet unique'],
        ['🇨🇦 Québec', '8%', 'Free mining', '1-3 ans', 'Claims + BAPE'],
        ['🇫🇷 Guyane fr.', '<1%', 'Paralysante', '10-15 ans', 'Moratoire de fait'],
    ],
    'Banque mondiale, Fraser Institute Annual Survey 2024', 40,
    { highlightRow: 5 }
);

// Slide 41 — Chart : PIB/hab trajectoire
r.addChartWithAnalysis(pptx,
    'PIB par habitant : le Guyana a dépassé la Guyane française',
    'International',
    'LINE',
    [
        {
            name: 'Guyana',
            labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
            values: [3200, 3800, 4200, 4600, 5100, 6800, 18000, 25000],
        },
        {
            name: 'Guyane française',
            labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
            values: [14000, 14500, 15000, 15500, 16000, 16200, 16500, 16800],
        },
    ],
    {
        x: 0.4, y: 1.6, w: 5.2, h: 3.2,
        lineDataSymbol: 'circle',
        lineDataSymbolSize: 6,
        showValue: false,
        chartColors: [r.colors.accentGreen, r.colors.accentElectric],
        valAxisNumFmt: '$#,##0',
    },
    [
        { text: 'Le Guyana a dépassé la Guyane fr. en PIB/hab en 2023' },
        { text: 'Même bouclier géologique, même localisation' },
        { text: 'Différence : le Guyana a ouvert ses ressources aux investisseurs' },
        { text: 'La Guyane fr. stagne à ~16 800 €/hab depuis 2015' },
    ],
    'Banque mondiale, FMI — WEO, INSEE', 41
);

// ============================================================
// SECTION 10 : POTENTIEL ÉCONOMIQUE
// ============================================================

// Slide 42
r.addSectionDivider(pptx, 10, 'Combien vaut le\nsous-sol guyanais ?', 'Potentiel économique');

// Slide 43 — KPI Dashboard
r.addKPIDashboard(pptx,
    'Valeur estimée des réserves, emplois potentiels, recettes fiscales projetées',
    'Potentiel',
    [
        { label: 'Valeur réserves identifiées', value: '> 10 Md€', delta: 'Or + tantale + bauxite + autres', deltaColor: r.colors.accentGold, context: 'Estimation BRGM / cours 2025' },
        { label: 'Potentiel total (exploré)', value: '~50 Md€', delta: 'Si 100% territoire prospecté', deltaColor: r.colors.accentGold, context: 'Extrapolation géologique' },
        { label: 'Emplois directs potentiels', value: '5 000+', delta: 'Filière minière structurée', deltaColor: r.colors.accentGreen, context: 'Benchmark pays similaires' },
        { label: 'Emplois indirects', value: '15 000+', delta: 'Multiplicateur x3', deltaColor: r.colors.accentGreen, context: 'McKinsey Mining Practice' },
        { label: 'Recettes fiscales', value: '~300 M€/an', delta: 'Taxes + redevances + IS', deltaColor: r.colors.accentElectric, context: 'Projection à maturité' },
        { label: 'Réduction chômage', value: '-5 pts', delta: 'De 17% à ~12%', deltaColor: r.colors.accentGreen, context: 'Impact emplois directs+indirects' },
    ],
    'BRGM, estimations Où Va l\'Argent, benchmarks internationaux', 43
);

// Slide 44 — BridgeChart : Impact sur 20 ans
r.addBridgeChart(pptx,
    'Impact économique d\'une filière minière structurée sur 20 ans',
    'Potentiel',
    [
        { label: 'Investissement\ninitial', value: -3, type: 'start' },
        { label: 'Production\nor', value: 8, type: 'positive' },
        { label: 'Autres\nminerais', value: 4, type: 'positive' },
        { label: 'Recettes\nfiscales', value: 6, type: 'positive' },
        { label: 'Emplois\n(valeur)', value: 5, type: 'positive' },
        { label: 'Impact\nnet', value: 0, type: 'total' },
    ],
    'Md€ (cumulé 20 ans)',
    'Estimations Où Va l\'Argent, benchmarks internationaux', 44
);

// Slide 45 — Comparison : Scénarios
r.addComparison(pptx,
    'Trois scénarios pour l\'avenir minier de la Guyane',
    'Potentiel',
    [
        {
            title: 'Statu quo',
            color: r.colors.accentRed,
            metrics: [
                { label: 'Orpaillage illégal', value: 'Continue (+35%/an)' },
                { label: 'Emplois créés', value: '0' },
                { label: 'Recettes fiscales', value: '0 €' },
                { label: 'Dégâts environn.', value: 'Exponentiels' },
            ]
        },
        {
            title: 'Exploitation raisonnée',
            color: r.colors.accentElectric,
            metrics: [
                { label: 'Projets autorisés', value: '3-5 mines' },
                { label: 'Emplois créés', value: '~5 000' },
                { label: 'Recettes fiscales', value: '~300 M€/an' },
                { label: 'Cadre environ.', value: 'ICPE strict' },
            ]
        },
        {
            title: 'Développement ambitieux',
            color: r.colors.accentGreen,
            metrics: [
                { label: 'Projets autorisés', value: '10+ mines' },
                { label: 'Emplois créés', value: '~20 000' },
                { label: 'Recettes fiscales', value: '~800 M€/an' },
                { label: 'Autonomie UE', value: 'Contribution' },
            ]
        },
    ],
    'Estimations Où Va l\'Argent, benchmarks Guyana/Suriname', 45
);

// ============================================================
// SECTION 11 : PROJETS D'AVENIR
// ============================================================

// Slide 46
r.addSectionDivider(pptx, 11, 'Au-delà des mines :\nhydrogène vert et nouvelles filières', 'Diversification');

// Slide 47 — KPI Dashboard : Hydrogène
r.addKPIDashboard(pptx,
    'La Guyane pionnière de l\'hydrogène vert avec CEOG et HYGUANE',
    'Hydrogène vert',
    [
        { label: 'Projet CEOG', value: '55 MW', delta: 'Plus grande centrale H2 monde', deltaColor: r.colors.accentGreen, context: 'Meridiam + HDF Energy' },
        { label: 'Investissement CEOG', value: '170 M€', delta: 'Opérationnel 2025-2026', deltaColor: r.colors.accentElectric, context: 'Financé par BEI + AFD' },
        { label: 'Projet HYGUANE', value: '10 MW', delta: 'Électrolyse + stockage', deltaColor: r.colors.accentGreen, context: 'Consortium local' },
        { label: 'Capacité solaire Guyane', value: '200 MW', delta: 'Potentiel installable', deltaColor: r.colors.accentGold, context: 'ADEME / Ensoleillement' },
    ],
    'Meridiam, HDF Energy, ADEME, BEI', 47
);

// Slide 48 — TextSlide : BRGM 2025
r.addTextSlide(pptx,
    'Inventaire BRGM 2025 (53 M€ / 5 ans) : le tournant stratégique ?',
    'Avenir',
    [
        { text: 'Un programme sans précédent\n', options: { fontSize: 14, fontFace: r.fonts.main, bold: true, color: r.colors.accentElectric } },
        { text: 'En 2025, le BRGM lance le plus grand programme de cartographie géologique de la Guyane : 53 millions d\'euros sur 5 ans, financé par l\'État et l\'UE (fonds CRM Act).\n\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'Objectifs :\n', options: { fontSize: 13, fontFace: r.fonts.main, bold: true, color: r.colors.accentGold } },
        { text: '• Cartographier 100% du sous-sol guyanais (vs 2% aujourd\'hui)\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Identifier et quantifier les gisements de métaux critiques (terres rares, lithium, tantale)\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Évaluer le potentiel en minerais stratégiques pour l\'UE\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: '• Constituer une base de données publique accessible aux investisseurs\n\n', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textPrimary } },
        { text: 'Enjeu politique\n', options: { fontSize: 13, fontFace: r.fonts.main, bold: true, color: r.colors.accentPurple } },
        { text: 'Ce programme est un signal fort : la France reconnaît enfin l\'importance stratégique du sous-sol guyanais. Mais l\'inventaire seul ne suffit pas — sans réforme du cadre réglementaire, les résultats resteront lettre morte.', options: { fontSize: 11, fontFace: r.fonts.main, color: r.colors.textSecondary, italic: true } },
    ],
    'BRGM, Ministère de la Transition écologique', 48
);

// ============================================================
// SECTION 12 : RECOMMANDATIONS & CONCLUSION
// ============================================================

// Slide 49 — Key Takeaways
r.addKeyTakeaways(pptx,
    '5 recommandations stratégiques pour libérer le potentiel minier guyanais',
    'Recommandations',
    [
        {
            title: 'Réformer le Code minier : créer un guichet unique et diviser les délais par 3',
            desc: 'S\'inspirer du modèle australien (Mining One-Stop Shop). Objectif : passer de 10-15 ans à 3-5 ans.',
            color: r.colors.accentElectric
        },
        {
            title: 'Réviser le SDOM : ouvrir des zones d\'exploitation encadrée',
            desc: 'Maintenir les zones protégées mais ouvrir des corridors miniers avec cadre environnemental strict (ICPE).',
            color: r.colors.accentGreen
        },
        {
            title: 'Intensifier la lutte contre l\'orpaillage illégal',
            desc: 'Doubler le budget Harpie, renforcer la coopération avec le Brésil, criminaliser le commerce d\'or illégal.',
            color: r.colors.accentRed
        },
        {
            title: 'Capter les fonds européens CRM Act / ReSourceEU',
            desc: 'Positionner la Guyane comme site pilote pour l\'extraction de métaux critiques en Europe. Budget disponible : 3 Md€.',
            color: r.colors.accentGold
        },
        {
            title: 'Former et employer localement',
            desc: 'Créer un centre de formation aux métiers miniers en Guyane. Objectif : 80% d\'emplois locaux. Réduire le chômage de 17% à 12%.',
            color: r.colors.accentPurple
        },
    ],
    'Analyse Où Va l\'Argent', 49
);

// Slide 50 — Sources
r.addSourcesPage(pptx, 'Sources', [
    'BRGM — Inventaire du domaine minier de la Guyane (2024)',
    'Commission européenne — Critical Raw Materials Act, Règlement (UE) 2024/1252',
    'Commission européenne — Plan ReSourceEU (novembre 2024)',
    'INSEE — Comptes économiques régionaux de la Guyane (2024)',
    'IEDOM — Rapport annuel Guyane (2024)',
    'Ministère des Armées — Bilan opération Harpie (2008-2024)',
    'Rapport du Sénat — Mission d\'information sur l\'orpaillage illégal (2023)',
    'WWF France — L\'orpaillage illégal en Guyane (2023)',
    'Banque mondiale — World Development Indicators',
    'FMI — World Economic Outlook (octobre 2025)',
    'Fraser Institute — Annual Survey of Mining Companies (2024)',
    'NordGold / Oréa Mining — Projet Montagne d\'Or, documentation publique',
    'ARS Guyane — Surveillance sanitaire liée au mercure',
    'Parc amazonien de Guyane — Rapports environnementaux',
    'DREAL Guyane — Statistiques minières',
    'Meridiam / HDF Energy — Projet CEOG',
], 50);

// Slide 51 — Back Cover
r.addBackCover(pptx, '@ouvalargent');

// ============================================================
// EXPORT
// ============================================================

const outputPath = require('path').resolve(__dirname, '..', '..', '..', 'Production interne', 'Rapports', 'rapport-potentiel-minier-guyane.pptx');
pptx.writeFile({ fileName: outputPath })
    .then(() => console.log(`✅ Rapport généré : ${outputPath}`))
    .catch(err => console.error('❌ Erreur :', err));

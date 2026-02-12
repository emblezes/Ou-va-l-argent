#!/usr/bin/env node
/**
 * Génère un template de rapport PPTX style consulting (McKinsey / BCG)
 * avec des slides d'exemple pour chaque type.
 *
 * Usage: node create-report-template.js
 * Output: ../Rapport/template-rapport.pptx
 */

const pptxgen = require('pptxgenjs');
const path = require('path');
const r = require('./pptx-report-helpers');

const pptx = new pptxgen();
r.setupReport(pptx);

// ============================================================
// 1. COUVERTURE
// ============================================================
r.addCover(pptx,
    'La dette publique française :\nAnalyse, trajectoire et perspectives',
    'Étude approfondie des finances publiques 2020-2026',
    'Février 2026',
    'Où Va l\'Argent — Études'
);

// ============================================================
// 2. TABLE DES MATIÈRES
// ============================================================
r.addTOC(pptx, [
    { num: '01', title: 'Résumé exécutif', page: 3 },
    { num: '02', title: 'Contexte macroéconomique', page: 5 },
    { num: '03', title: 'Analyse de la dette publique', page: 8 },
    { num: '04', title: 'Comparaisons internationales', page: 12 },
    { num: '05', title: 'Scénarios et projections', page: 15 },
    { num: '06', title: 'Recommandations', page: 18 },
    { num: '07', title: 'Sources & Méthodologie', page: 20 },
]);

// ============================================================
// 3. EXECUTIVE SUMMARY
// ============================================================
r.addExecSummary(pptx,
    'La dette publique atteint 117,4% du PIB, un niveau sans précédent qui menace la soutenabilité budgétaire',
    'Résumé exécutif',
    [
        { title: 'La dette publique a franchi 3 480 Md€ fin 2025', desc: 'Soit 117,4% du PIB, en hausse de 15 points depuis le Covid. La France est désormais le 3e pays le plus endetté de la zone euro.' },
        { title: 'La charge d\'intérêts dépasse 70 Md€ en 2026', desc: 'Premier poste budgétaire devant l\'Éducation nationale. Chaque hausse de 1% des taux coûte 40 Md€ supplémentaires.' },
        { title: 'Le déficit structurel reste élevé à 4,5% du PIB', desc: 'Malgré les efforts affichés, le déficit corrigé du cycle reste bien au-dessus de la moyenne européenne (2,8%).' },
        { title: 'La trajectoire actuelle n\'est pas soutenable sans réformes', desc: 'Sans ajustement, la dette dépasserait 130% du PIB en 2030 selon nos projections. Le ratio dette/PIB ne se stabilise dans aucun scénario passif.' },
    ],
    'INSEE, Banque de France, Eurostat, Cour des comptes',
    3
);

// ============================================================
// 4. SECTION DIVIDER
// ============================================================
r.addSectionDivider(pptx, 1, 'Contexte macroéconomique', 'Croissance, inflation et emploi : l\'environnement économique français');

// ============================================================
// 5. KPI DASHBOARD
// ============================================================
r.addKPIDashboard(pptx,
    'L\'économie française ralentit sur tous les indicateurs clés en 2025',
    'Contexte macro',
    [
        { label: 'Croissance PIB 2025', value: '+0,9%', delta: '▼ vs +1,1% en 2024', deltaColor: 'DC3545', context: 'Plus faible croissance depuis 2020' },
        { label: 'Inflation (janv. 2026)', value: '0,3%', delta: '▼ vs 4,9% en 2023', deltaColor: '28A745', context: 'Objectif BCE atteint' },
        { label: 'Taux de chômage Q4 2025', value: '7,9%', delta: '▲ +0,6 pts sur un an', deltaColor: 'DC3545', context: 'Plus haut depuis 2021' },
        { label: 'Chômage jeunes (15-24 ans)', value: '21,5%', delta: '▲ +2,8 pts sur un an', deltaColor: 'DC3545', context: 'Situation critique' },
        { label: 'Taux directeur BCE', value: '2,15%', delta: '— Inchangé depuis juin 2025', deltaColor: '6B7280', context: 'Pause monétaire prolongée' },
        { label: 'Déficit public 2025', value: '-5,4%', delta: '▼ vs -5,5% en 2024', deltaColor: 'DC3545', context: 'Objectif 5,0% en 2026' },
    ],
    'INSEE, BCE, Banque de France — Données au 10/02/2026',
    5
);

// ============================================================
// 6. CHART + ANALYSE
// ============================================================
r.addChartWithAnalysis(pptx,
    'La dette publique a connu une accélération sans précédent depuis 2007',
    'Analyse de la dette',
    'LINE',
    [{
        name: 'Dette (% PIB)',
        labels: ['2000', '2005', '2007', '2010', '2015', '2019', '2020', '2023', '2025'],
        values: [58.9, 67.4, 64.5, 83.0, 95.6, 97.6, 115.0, 110.6, 117.4]
    }],
    {
        chartColors: [r.colors.accentElectric],
        lineSize: 3,
        showMarker: true,
        markerSize: 8,
    },
    [
        { text: 'Trois phases distinctes : progression lente (2000-2007), accélération post-crise financière (2008-2012), et explosion Covid (2020).' },
        { text: 'Le ratio dette/PIB n\'a jamais diminué de plus de 5 points après un choc. Le "cliquet" de la dette est structurel.' },
        { text: 'La charge d\'intérêts (70 Md€) annule tout gain budgétaire. Chaque trimestre de taux élevés alourdit la facture.' },
        { text: 'Comparaison : l\'Allemagne est revenue à 63% du PIB. L\'écart France-Allemagne est passé de 5 pts (2007) à 55 pts (2025).' },
    ],
    'INSEE, comptes nationaux trimestriels',
    8
);

// ============================================================
// 7. DATA TABLE
// ============================================================
r.addDataTable(pptx,
    'La France se classe 3e parmi les pays les plus endettés de la zone euro',
    'Comparaisons internationales',
    ['Pays', 'Dette/PIB', 'Déficit/PIB', 'Charge intérêts', 'Taux 10 ans', 'Rating'],
    [
        ['Grèce', '153,6%', '-1,6%', '6,8 Md€', '3,45%', 'BBB-'],
        ['Italie', '135,3%', '-3,4%', '83,2 Md€', '3,52%', 'BBB'],
        ['France', '117,4%', '-5,4%', '70,0 Md€', '3,15%', 'AA-'],
        ['Belgique', '104,7%', '-4,5%', '12,8 Md€', '3,02%', 'AA-'],
        ['Espagne', '101,8%', '-3,2%', '35,4 Md€', '3,18%', 'A'],
        ['Zone euro (moy.)', '87,4%', '-3,1%', '—', '—', '—'],
        ['Allemagne', '62,5%', '-1,5%', '28,3 Md€', '2,38%', 'AAA'],
        ['Pays-Bas', '47,8%', '-0,8%', '8,2 Md€', '2,55%', 'AAA'],
    ],
    'Eurostat, Q4 2024 — S&P Global Ratings',
    12,
    { highlightRow: 2 }
);

// ============================================================
// 8. MATRICE 2x2
// ============================================================
r.addMatrix2x2(pptx,
    'Quatre profils budgétaires se distinguent en zone euro',
    'Analyse stratégique',
    'Déficit (faible → élevé)', 'Dette (faible → élevée)',
    [
        { quadrant: 0, label: 'Pays-Bas', desc: 'Dette faible, déficit faible. Modèle de rigueur budgétaire.', color: r.colors.accentGreen },
        { quadrant: 0, label: 'Allemagne', desc: 'AAA stable. Frein à l\'endettement constitutionnel.', color: r.colors.accentGreen },
        { quadrant: 1, label: 'Espagne', desc: 'Déficit élevé mais dette en baisse. Croissance dynamique.', color: r.colors.accentOrange },
        { quadrant: 2, label: 'Italie', desc: 'Dette très élevée mais déficit maîtrisé. Risque structurel.', color: r.colors.accentGold },
        { quadrant: 3, label: 'France', desc: 'Dette ET déficit élevés. Seul pays du cadran critique.', color: r.colors.accentRed },
        { quadrant: 3, label: 'Grèce', desc: 'Dette record mais excédent primaire retrouvé.', color: r.colors.accentPurple },
    ],
    ['Vertueux', 'Dynamiques', 'Structurels', 'Critiques'],
    'Eurostat, analyse Où Va l\'Argent',
    13
);

// ============================================================
// 9. BRIDGE CHART (Waterfall consulting)
// ============================================================
r.addBridgeChart(pptx,
    'Le déficit 2025 s\'explique par un dérapage des dépenses sociales (+18 Md€)',
    'Décomposition du déficit',
    [
        { label: 'Recettes\nfiscales', value: 1420, type: 'start' },
        { label: 'Cotisations\nsociales', value: 520, type: 'positive' },
        { label: 'Autres\nrecettes', value: 85, type: 'positive' },
        { label: 'Dépenses\nÉtat', value: -580, type: 'negative' },
        { label: 'Protection\nsociale', value: -870, type: 'negative' },
        { label: 'Collectivités\nlocales', value: -290, type: 'negative' },
        { label: 'Charge\ndette', value: -70, type: 'negative' },
        { label: 'Autres', value: -67, type: 'negative' },
        { label: 'SOLDE\n2025', value: 0, type: 'total' },
    ],
    'Md€',
    'Loi de règlement 2025, Direction du Budget',
    15
);

// ============================================================
// 10. COMPARAISON
// ============================================================
r.addComparison(pptx,
    'Trois scénarios pour la trajectoire de la dette publique à horizon 2030',
    'Scénarios & Projections',
    [
        {
            title: 'Scénario optimiste',
            color: r.colors.accentGreen,
            metrics: [
                { label: 'Croissance moyenne', value: '1,5%' },
                { label: 'Déficit 2030', value: '-2,8%' },
                { label: 'Dette 2030', value: '115% PIB' },
                { label: 'Charge intérêts', value: '65 Md€' },
                { label: 'Hypothèse', value: 'Réformes structurelles' },
            ]
        },
        {
            title: 'Scénario central',
            color: r.colors.accentElectric,
            metrics: [
                { label: 'Croissance moyenne', value: '1,0%' },
                { label: 'Déficit 2030', value: '-4,2%' },
                { label: 'Dette 2030', value: '125% PIB' },
                { label: 'Charge intérêts', value: '85 Md€' },
                { label: 'Hypothèse', value: 'Tendance actuelle' },
            ]
        },
        {
            title: 'Scénario pessimiste',
            color: r.colors.accentRed,
            metrics: [
                { label: 'Croissance moyenne', value: '0,5%' },
                { label: 'Déficit 2030', value: '-6,0%' },
                { label: 'Dette 2030', value: '140% PIB' },
                { label: 'Charge intérêts', value: '110 Md€' },
                { label: 'Hypothèse', value: 'Choc externe + inaction' },
            ]
        }
    ],
    'Projections Où Va l\'Argent basées sur données INSEE, Banque de France',
    16
);

// ============================================================
// 11. KEY TAKEAWAYS
// ============================================================
r.addKeyTakeaways(pptx,
    'Quatre leviers d\'action pour restaurer la soutenabilité budgétaire',
    'Recommandations',
    [
        { title: 'Plafonner la dépense publique à +1% par an en volume', desc: 'Alignement sur la règle allemande du frein à l\'endettement. Économie estimée : 15-20 Md€/an d\'ici 2030.', color: r.colors.accentElectric },
        { title: 'Réformer les retraites pour stabiliser les dépenses sociales', desc: 'Les pensions représentent 14% du PIB (vs 10% en Allemagne). Un alignement partiel économiserait 25 Md€/an.', color: r.colors.accentGold },
        { title: 'Élargir l\'assiette fiscale plutôt qu\'augmenter les taux', desc: 'La France a déjà le taux de prélèvement le plus élevé de l\'OCDE (46,1%). Priorité : lutter contre les niches fiscales.', color: r.colors.accentGreen },
        { title: 'Investir dans la croissance pour améliorer le dénominateur', desc: 'La compétitivité française se dégrade. Priorités : formation, innovation, simplification administrative. Chaque +0,5% de croissance réduit le ratio de 2 pts.', color: r.colors.accentPurple },
    ],
    null,
    18
);

// ============================================================
// 12. SOURCES
// ============================================================
r.addSourcesPage(pptx, 'Annexes', [
    'INSEE — Comptes nationaux trimestriels, T4 2025 (publiés le 30/01/2026)',
    'Eurostat — Government finance statistics, Q4 2024',
    'Banque de France — Bulletin mensuel, janvier 2026',
    'Cour des comptes — Rapport sur la situation et les perspectives des finances publiques, juin 2025',
    'Direction du Budget — Projet de loi de finances 2026',
    'Agence France Trésor — Programme d\'émissions 2026',
    'S&P Global Ratings — Sovereign rating France, décembre 2025',
    'OCDE — Études économiques France, novembre 2025',
    'FMI — Article IV Consultation France, octobre 2025',
    'Haut Conseil des finances publiques — Avis sur le PLF 2026, septembre 2025',
], 20);

// ============================================================
// 13. BACK COVER
// ============================================================
r.addBackCover(pptx, 'contact@ouvalargent.fr');

// ============================================================
// EXPORT
// ============================================================
const outputPath = path.join(__dirname, '..', 'Rapport', 'template-rapport.pptx');
pptx.writeFile({ fileName: outputPath })
    .then(() => console.log('✅ Rapport généré : ' + outputPath))
    .catch(err => console.error('❌ Erreur :', err));

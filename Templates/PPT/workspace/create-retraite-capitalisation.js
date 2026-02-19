const pptxgen = require('pptxgenjs');
const path = require('path');
const h = require('../../Templates/PPT/workspace/pptx-helpers');
const { colors, fonts, addBackground, addHeader, addFooter } = h;

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Où Va l\'Argent';
pptx.title = 'La Retraite par Capitalisation — Une nécessité pour la France';
pptx.subject = 'Présentation conférence';

// Helpers from shared library — pass pptx as first argument
const addTransition = (num, title, subtitle, circleColor) => h.addTransition(pptx, num, title, subtitle, circleColor);
const addChiffreCle = (tag, label, bigNum, bigSize, bigColor, unit, context, source) => h.addChiffreCle(pptx, tag, label, bigNum, bigSize, bigColor, unit, context, source);
const addPointsCles = (tag, titleParts, points, source) => h.addPointsCles(pptx, tag, titleParts, points, source);
const addBars = (tag, title, bars, bottomText, source) => h.addBars(pptx, tag, title, bars, bottomText, source);
const addFocus2Col = (tag, titleParts, leftTitle, leftBig, leftBigColor, leftSub, leftBullets, rightTitle, rightRows, source) => h.addFocus2Col(pptx, tag, titleParts, leftTitle, leftBig, leftBigColor, leftSub, leftBullets, rightTitle, rightRows, source);
const addProjections = (tag, title, tableTitle, items, bottomText, source) => h.addProjections(pptx, tag, title, tableTitle, items, bottomText, source);
const addCards2x2 = (tag, title, cards, source) => h.addCards2x2(pptx, tag, title, cards, source);
const addCitation = (tag, quote, author, source) => h.addCitation(pptx, tag, quote, author, source);
const addTimeline = (tag, title, items, source) => h.addTimeline(pptx, tag, title, items, source);
const addScenarios = (tag, title, items, source) => h.addScenarios(pptx, tag, title, items, source);

// ============================================================
// SLIDE 1: TITRE
// ============================================================
const slide1 = pptx.addSlide();
addBackground(pptx, slide1);
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.4, y: 0.8, w: 0.8, h: 0.8, fill: { color: colors.accentElectric }, rectRadius: 0.12, shadow: { type: 'outer', blur: 10, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.5 } });
slide1.addText('€', { x: 4.4, y: 0.8, w: 0.8, h: 0.8, fontSize: 36, fontFace: fonts.mono, bold: true, color: colors.bgDeep, align: 'center', valign: 'middle' });
slide1.addText('Où Va l\'Argent', { x: 5.3, y: 0.9, w: 2.5, h: 0.6, fontSize: 20, fontFace: fonts.main, bold: true, color: colors.textPrimary, valign: 'middle' });
slide1.addText('La Retraite par Capitalisation', { x: 0.5, y: 1.9, w: 9, h: 0.8, fontSize: 44, fontFace: fonts.main, bold: true, color: colors.textPrimary, align: 'center', valign: 'middle' });
slide1.addText('Une nécessité pour la France', { x: 0.5, y: 2.65, w: 9, h: 0.6, fontSize: 32, fontFace: fonts.serif, italic: true, color: colors.accentElectric, align: 'center', valign: 'middle' });
slide1.addText('346 Md€ | 17M retraités | 28% cotisations', { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 14, fontFace: fonts.main, color: colors.textSecondary, align: 'center', valign: 'middle' });
const tags1 = ['Retraites', 'Capitalisation', 'Démographie', 'International'];
tags1.forEach((tag, i) => {
    const x = 2 + i * 1.6;
    slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x, y: 4.1, w: 1.5, h: 0.4, fill: { color: colors.accentElectric, transparency: 85 }, line: { color: colors.accentElectric, width: 1, transparency: 70 }, rectRadius: 0.2 });
    slide1.addText(tag, { x: x, y: 4.1, w: 1.5, h: 0.4, fontSize: 9, fontFace: fonts.main, bold: true, color: colors.accentElectric, align: 'center', valign: 'middle' });
});
slide1.addText('Conférence 2025', { x: 0.4, y: 5.2, w: 3, h: 0.3, fontSize: 11, fontFace: fonts.main, color: colors.textMuted, valign: 'middle' });
slide1.addText('ouvalargent.com', { x: 7.5, y: 5.2, w: 2.1, h: 0.3, fontSize: 11, fontFace: fonts.mono, bold: true, color: colors.accentElectric, align: 'right', valign: 'middle' });

// ============================================================
// SLIDE 2: SOMMAIRE
// ============================================================
const slide2 = pptx.addSlide();
addBackground(pptx, slide2);
addHeader(pptx, slide2, 'Sommaire');
slide2.addText('Plan de la présentation', { x: 0.5, y: 0.9, w: 9, h: 0.5, fontSize: 28, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });
const sommaire = [
    { num: '01', title: 'Le constat', desc: 'Le système français à bout de souffle' },
    { num: '02', title: 'Le piège démographique', desc: 'Fécondité, vieillissement, dépendance' },
    { num: '03', title: 'Les modèles qui marchent', desc: 'Pays-Bas, Suisse, Australie, Suède...' },
    { num: '04', title: 'La puissance des marchés', desc: 'Intérêts composés et rendements' },
    { num: '05', title: 'La transition', desc: 'Quel modèle pour la France ?' }
];
sommaire.forEach((item, i) => {
    const x = 0.25 + i * 1.95;
    slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x, y: 1.6, w: 1.8, h: 3.2, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: colors.glassBorder, width: 1 }, rectRadius: 0.15, shadow: { type: 'outer', blur: 8, offset: 3, angle: 45, color: '000000', opacity: 0.3 } });
    slide2.addShape(pptx.shapes.OVAL, { x: x + 0.15, y: 1.8, w: 0.5, h: 0.5, fill: { color: colors.accentElectric }, shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.4 } });
    slide2.addText(item.num, { x: x + 0.15, y: 1.8, w: 0.5, h: 0.5, fontSize: 14, fontFace: fonts.mono, bold: true, color: colors.bgDeep, align: 'center', valign: 'middle' });
    slide2.addText(item.title, { x: x + 0.1, y: 2.45, w: 1.6, h: 0.5, fontSize: 13, fontFace: fonts.main, bold: true, color: colors.textPrimary, valign: 'top' });
    slide2.addText(item.desc, { x: x + 0.1, y: 3.0, w: 1.6, h: 1.5, fontSize: 10, fontFace: fonts.main, color: colors.textSecondary, valign: 'top' });
});
addFooter(pptx, slide2);

// ============================================================
// PARTIE 1 — LE CONSTAT (Slides 3-12)
// ============================================================

// Slide 3: Transition
addTransition('01', 'Le constat', 'Le système français à bout de souffle', colors.accentRed);

// Slide 4: Chiffre clé 346 Md€
addChiffreCle('Retraites', 'PENSIONS DE RETRAITE VERSÉES PAR AN', '346', 150, colors.accentRed, 'milliards d\'euros', [
    { text: 'Soit ', options: { color: colors.textSecondary } },
    { text: '14,4% du PIB', options: { color: colors.accentGold, bold: true } },
    { text: ' — Plus que le budget de l\'État', options: { color: colors.textSecondary } }
], 'DREES, COR 2024');

// Slide 5: Barres cotisations
addBars('Cotisations', 'Où passent vos cotisations ?', [
    { label: 'Retraite', value: '28%', width: 93, color: colors.accentRed },
    { label: 'Maladie', value: '13%', width: 43, color: colors.accentGold },
    { label: 'CSG-CRDS', value: '9,7%', width: 32, color: colors.accentOrange },
    { label: 'Chômage', value: '4,05%', width: 13, color: colors.accentGreen },
    { label: 'Famille', value: '3,45%', width: 12, color: colors.accentPurple },
    { label: 'Autres', value: '5%', width: 17, color: colors.accentElectric }
], 'Les cotisations retraite représentent 28% du salaire brut', 'URSSAF 2024');

// Slide 6: Points clés système
addPointsCles('Constat', [
    { text: 'Un système à ', options: { color: colors.textPrimary } },
    { text: 'bout de souffle', options: { color: colors.accentRed, italic: true } }
], [
    { icon: '⚠️', text: '97% du système repose sur la répartition pure' },
    { icon: '🏛️', text: '42 régimes différents, une complexité unique au monde' },
    { icon: '💰', text: 'Aucun véritable fonds de réserve (FRR < 30 Md€)' },
    { icon: '📉', text: 'Taux de remplacement en chute : 84% (1990) → 55% (2040)' }
], 'COR, OCDE 2024');

// Slide 7: Chiffre clé 1,7
addChiffreCle('Démographie', 'RATIO COTISANTS PAR RETRAITÉ', '1,7', 150, colors.accentOrange, 'actifs par retraité', [
    { text: 'Contre ', options: { color: colors.textSecondary } },
    { text: '4,7 en 1960', options: { color: colors.accentGold, bold: true } },
    { text: ' — Projeté à ', options: { color: colors.textSecondary } },
    { text: '1,3 en 2070', options: { color: colors.accentRed, bold: true } }
], 'COR, INSEE 2024');

// Slide 8: Focus 2 col déficit
addFocus2Col('Déficit', [
    { text: 'Déficit : de ', options: { color: colors.textPrimary } },
    { text: 'mal', options: { color: colors.accentOrange, italic: true } },
    { text: ' en ', options: { color: colors.textPrimary } },
    { text: 'pire', options: { color: colors.accentRed, italic: true } }
], 'Déficit 2024', '-5,8 Md€', colors.accentOrange, 'déficit retraites 2024', ['Avant même la réforme 2023', 'Malgré report à 64 ans'],
'Projections', [
    { label: '2024', value: '-5,8 Md€' },
    { label: '2028', value: '-11 Md€' },
    { label: '2030', value: '-15 Md€' },
    { label: '2035', value: '-20 Md€' }
], 'COR 2025');

// Slide 9: Projections déficit
addProjections('Projections', 'Déficit projeté du système de retraites', 'Solde du système de retraites (% du PIB)', [
    { year: '2024', solde: '-0,2%', montant: '-5,8 Md€' },
    { year: '2030', solde: '-0,5%', montant: '-15 Md€' },
    { year: '2040', solde: '-0,8%', montant: '-25 Md€' },
    { year: '2050', solde: '-1,2%', montant: '-40 Md€' }
], 'Le système est structurellement déficitaire, quelle que soit la croissance', 'COR 2025');

// Slide 10: Barres taux de remplacement
addBars('Remplacement', 'Le taux de remplacement s\'effondre', [
    { label: '1990', value: '84%', width: 93, color: colors.accentGreen },
    { label: '2000', value: '78%', width: 87, color: colors.accentGreen },
    { label: '2010', value: '72%', width: 80, color: colors.accentGold },
    { label: '2020', value: '66%', width: 73, color: colors.accentOrange },
    { label: '2030', value: '60%', width: 67, color: colors.accentOrange },
    { label: '2040', value: '55%', width: 61, color: colors.accentRed }
], 'Un salarié au SMIC reçoit 55% de son dernier salaire en 2040 vs 84% en 1990', 'COR, DREES 2024');

// Slide 11: Cartes 3 leviers épuisés
addCards2x2('Leviers', 'Les 3 leviers sont épuisés', [
    { icon: '📅', title: 'Âge de départ', stat: '62→64 ans', desc: 'Déjà repoussé, socialement explosif', color: colors.accentRed },
    { icon: '💶', title: 'Cotisations', stat: '28% brut', desc: 'Parmi les plus élevées au monde', color: colors.accentOrange },
    { icon: '📉', title: 'Pensions', stat: '-30% en 30 ans', desc: 'Taux de remplacement en chute', color: colors.accentGold },
    { icon: '✅', title: '4e levier', stat: 'Capitalisation', desc: 'Le seul levier non exploité en France', color: colors.accentGreen }
], 'COR, OCDE 2024');

// Slide 12: Citation
addCitation('Analyse', 'La question n\'est plus de savoir si la France doit introduire la capitalisation, mais quand et comment.', '— Analyse Où Va l\'Argent', 'Synthèse OVA');

// ============================================================
// PARTIE 2 — DÉMOGRAPHIE (Slides 13-20)
// ============================================================

// Slide 13: Transition
addTransition('02', 'Le piège démographique', 'Fécondité, vieillissement, baby-boomers', colors.accentOrange);

// Slide 14: Chiffre clé 1,68
addChiffreCle('Démographie', 'TAUX DE FÉCONDITÉ EN FRANCE (2024)', '1,68', 150, colors.accentOrange, 'enfant par femme', [
    { text: 'Seuil de renouvellement = ', options: { color: colors.textSecondary } },
    { text: '2,1', options: { color: colors.accentRed, bold: true } },
    { text: ' — Plus bas historique', options: { color: colors.textSecondary } }
], 'INSEE 2024');

// Slide 15: Timeline ratio
addTimeline('Ratio', 'L\'effondrement du ratio cotisants/retraités', [
    { year: '1960', value: '4,7', event: 'Baby-boom', highlight: false },
    { year: '1980', value: '3,2', event: '', highlight: false },
    { year: '2000', value: '2,1', event: 'Passage sous 2,5', highlight: false },
    { year: '2024', value: '1,7', event: 'Niveau actuel', highlight: true },
    { year: '2070', value: '1,3', event: 'Projection COR', highlight: true }
], 'COR, INSEE');

// Slide 16: Chiffre clé 27 ans
addChiffreCle('Longévité', 'ESPÉRANCE DE VIE À 60 ANS (FEMMES)', '27', 150, colors.accentPurple, 'années', [
    { text: '23 ans pour les hommes', options: { color: colors.textSecondary } },
    { text: ' — Contre 20 ans en 1980', options: { color: colors.textSecondary } }
], 'INSEE 2024');

// Slide 17: Barres ratio de dépendance
addBars('Dépendance', 'Ratio de dépendance vieillesse', [
    { label: 'Japon', value: '51%', width: 100, color: colors.accentRed },
    { label: 'Italie', value: '39%', width: 76, color: colors.accentOrange },
    { label: 'France', value: '37%', width: 73, color: colors.accentElectric },
    { label: 'Allemagne', value: '36%', width: 71, color: colors.accentGold },
    { label: 'Moyenne OCDE', value: '30%', width: 59, color: colors.accentPurple },
    { label: 'États-Unis', value: '27%', width: 53, color: colors.accentGreen }
], 'Population 65+ / Population 15-64 — Projeté à 50%+ pour la France en 2050', 'Eurostat, OCDE 2024');

// Slide 18: Focus 2 col vieillissement
addFocus2Col('Vieillissement', [
    { text: 'Le vieillissement ', options: { color: colors.textPrimary } },
    { text: 'accélère', options: { color: colors.accentOrange, italic: true } }
], 'France', '22% → 30%', colors.accentOrange, 'de 65+ d\'ici 2050', ['Baby-boomers en retraite', '+5M de retraités d\'ici 2040'],
'Monde', [
    { label: 'Japon', value: '29,1%' },
    { label: 'Italie', value: '24,1%' },
    { label: 'France', value: '21,7%' },
    { label: 'Monde', value: '10,5%' }
], 'ONU, Eurostat 2024');

// Slide 19: Cartes triple choc (3×1)
const slide19 = pptx.addSlide();
addBackground(pptx, slide19);
addHeader(pptx, slide19, 'Triple choc');
slide19.addText('Le triple choc démographique', { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
const tripleChoc = [
    { icon: '👶', title: 'Fécondité', stat: '1,68', desc: 'Plus bas historique, bien sous le seuil de 2,1', color: colors.accentRed },
    { icon: '👴', title: 'Longévité', stat: '+7 ans', desc: 'Espérance de vie à 60 ans en hausse depuis 1980', color: colors.accentOrange },
    { icon: '👥', title: 'Baby-boomers', stat: '800K/an', desc: 'Départs en retraite massifs jusqu\'en 2035', color: colors.accentGold }
];
tripleChoc.forEach((item, i) => {
    const x = 0.3 + i * 3.2;
    slide19.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x, y: 1.5, w: 3.0, h: 3.3, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: item.color, width: 2 }, rectRadius: 0.15, shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: item.color, opacity: 0.25 } });
    slide19.addText(item.icon, { x: x, y: 1.7, w: 3.0, h: 0.7, fontSize: 36, align: 'center', valign: 'middle' });
    slide19.addText(item.title, { x: x + 0.15, y: 2.5, w: 2.7, h: 0.4, fontSize: 16, fontFace: fonts.main, bold: true, color: colors.textPrimary, align: 'center' });
    slide19.addText(item.stat, { x: x + 0.15, y: 3.0, w: 2.7, h: 0.6, fontSize: 32, fontFace: fonts.mono, bold: true, color: item.color, align: 'center', valign: 'middle' });
    slide19.addText(item.desc, { x: x + 0.15, y: 3.7, w: 2.7, h: 0.8, fontSize: 11, fontFace: fonts.main, color: colors.textSecondary, align: 'center' });
});
addFooter(pptx, slide19, 'INSEE, COR');

// Slide 20: Points clés impossible
addPointsCles('Synthèse', [
    { text: 'L\'équation est ', options: { color: colors.textPrimary } },
    { text: 'impossible', options: { color: colors.accentRed, italic: true } }
], [
    { icon: '❌', text: 'Moins de naissances = moins de futurs cotisants' },
    { icon: '❌', text: 'Plus de retraités vivant plus longtemps = plus de pensions' },
    { icon: '❌', text: 'Ratio cotisants/retraités en chute libre (1,7 → 1,3)' },
    { icon: '✅', text: 'Seule solution : diversifier avec la capitalisation' }
], 'Synthèse OVA');

// ============================================================
// PARTIE 3 — INTERNATIONAL (Slides 21-31)
// ============================================================

// Slide 21: Transition
addTransition('03', 'Les modèles qui marchent', 'Pays-Bas, Suisse, Australie, Suède, Norvège...', colors.accentGreen);

// Slide 22: Classement Mercer
addBars('Classement', 'Classement Mercer des retraites (2025)', [
    { label: 'Pays-Bas', value: '85,4', width: 100, color: colors.accentGreen },
    { label: 'Islande', value: '84,7', width: 99, color: colors.accentElectric },
    { label: 'Danemark', value: '83,5', width: 98, color: colors.accentElectric },
    { label: 'Suisse', value: '75,2', width: 88, color: colors.accentGold },
    { label: 'Australie', value: '74,2', width: 87, color: colors.accentGold },
    { label: 'Suède', value: '73,6', width: 86, color: colors.accentPurple },
    { label: 'France', value: '~60', width: 70, color: colors.accentRed }
], 'Les systèmes les mieux notés intègrent tous une part de capitalisation', 'Mercer Global Pension Index 2025');

// Slide 23: Cartes Pays-Bas champion
addCards2x2('Pays-Bas', [
    { text: 'Pays-Bas : le ', options: { color: colors.textPrimary } },
    { text: 'champion', options: { color: colors.accentGreen, italic: true } }
], [
    { icon: '🏆', title: 'Score Mercer', stat: '85,4/100', desc: '#1 mondial depuis 2019', color: colors.accentGreen },
    { icon: '💰', title: 'Actifs pension', stat: '213% PIB', desc: '1 900 Md€ de fonds', color: colors.accentElectric },
    { icon: '📈', title: 'Taux remplacement', stat: '93,2%', desc: 'Quasi-intégralité du salaire', color: colors.accentGold },
    { icon: '🏗️', title: 'Modèle', stat: '3 piliers', desc: 'AOW + fonds pro + épargne', color: colors.accentPurple }
], 'Mercer, OCDE 2024');

// Slide 24: Focus Suisse 3 piliers
addFocus2Col('Suisse', [
    { text: 'Suisse : les ', options: { color: colors.textPrimary } },
    { text: '3 piliers', options: { color: colors.accentGreen, italic: true } }
], 'Le modèle', '3 piliers', colors.accentGreen, 'système de retraite', ['1er pilier : AVS (public)', '2e pilier : LPP (obligatoire)', '3e pilier : épargne libre'],
'Résultats', [
    { label: 'Pension médiane', value: '3 200€/m' },
    { label: 'Taux remplacement', value: '68%' },
    { label: 'Score Mercer', value: '75,2' }
], 'OFAS Suisse 2024');

// Slide 25: Chiffre clé Australie 3 500
addChiffreCle('Australie', 'SUPERANNUATION — FONDS DE PENSION AUSTRALIENS', '3 500', 120, colors.accentGreen, 'milliards AUD', [
    { text: '12% du salaire obligatoirement investi', options: { color: colors.textSecondary } },
    { text: ' — Objectif : 15%', options: { color: colors.accentGold, bold: true } }
], 'APRA 2024');

// Slide 26: Focus Suède modèle mixte
addFocus2Col('Suède', [
    { text: 'Suède : le modèle ', options: { color: colors.textPrimary } },
    { text: 'mixte', options: { color: colors.accentGreen, italic: true } }
], 'Répartition', 'Comptes notionnels', colors.accentElectric, '16% du salaire', ['Ajustement automatique', 'Lié à la croissance du PIB'],
'Capitalisation', [
    { label: 'Premium Pension', value: '2,5%' },
    { label: 'Choix fonds', value: '800+' },
    { label: 'Défaut', value: 'AP7' }
], 'Swedish Pension Agency 2024');

// Slide 27: Chiffre clé Norvège 1 800
addChiffreCle('Norvège', 'FONDS SOUVERAIN DE NORVÈGE (NBIM)', '1 800', 120, colors.accentGold, 'milliards USD', [
    { text: 'Le plus grand fonds souverain au monde — ', options: { color: colors.textSecondary } },
    { text: '340 000$ par habitant', options: { color: colors.accentElectric, bold: true } }
], 'NBIM 2024');

// Slide 28: Barres actifs fonds pension
addBars('Fonds pension', 'Actifs des fonds de pension (% PIB)', [
    { label: 'Pays-Bas', value: '213%', width: 100, color: colors.accentGreen },
    { label: 'Islande', value: '182%', width: 85, color: colors.accentElectric },
    { label: 'Suisse', value: '155%', width: 73, color: colors.accentElectric },
    { label: 'Australie', value: '130%', width: 61, color: colors.accentGold },
    { label: 'Royaume-Uni', value: '100%', width: 47, color: colors.accentGold },
    { label: 'États-Unis', value: '95%', width: 45, color: colors.accentPurple },
    { label: 'France', value: '~10%', width: 5, color: colors.accentRed }
], 'La France est très loin derrière tous les pays développés', 'OCDE 2024');

// Slide 29: Chiffre clé 69,8 trillions
addChiffreCle('Monde', 'ACTIFS MONDIAUX DES FONDS DE PENSION', '69,8', 120, colors.accentElectric, 'trillions USD', [
    { text: '+7,2% en 2024', options: { color: colors.accentGreen, bold: true } },
    { text: ' — Record historique absolu', options: { color: colors.textSecondary } }
], 'WTW Global Pension Assets 2024');

// Slide 30: Cartes Canada + Chili (2×1)
const slide30 = pptx.addSlide();
addBackground(pptx, slide30);
addHeader(pptx, slide30, 'Modèles');
slide30.addText([
    { text: 'D\'autres modèles ', options: { color: colors.textPrimary } },
    { text: 'inspirants', options: { color: colors.accentGreen, italic: true } }
], { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, valign: 'middle' });
const modeles = [
    { icon: '🇨🇦', title: 'Canada — CPPIB', stat: '600 Md$ CAD', desc: 'Fonds public géré professionnellement, rendement ~10%/an', color: colors.accentElectric, y: 1.5 },
    { icon: '🇨🇱', title: 'Chili — AFP', stat: 'Pionnier (1981)', desc: 'Premier système de capitalisation obligatoire, modèle exporté', color: colors.accentGold, y: 3.2 }
];
modeles.forEach((item) => {
    slide30.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: item.y, w: 9.2, h: 1.55, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: item.color, width: 1 }, rectRadius: 0.12 });
    slide30.addText(item.icon, { x: 0.6, y: item.y + 0.2, w: 1, h: 0.8, fontSize: 40, align: 'center', valign: 'middle' });
    slide30.addText(item.title, { x: 1.7, y: item.y + 0.2, w: 3, h: 0.5, fontSize: 16, fontFace: fonts.main, bold: true, color: colors.textPrimary });
    slide30.addText(item.stat, { x: 6.5, y: item.y + 0.2, w: 2.8, h: 0.5, fontSize: 18, fontFace: fonts.mono, bold: true, color: item.color, align: 'right' });
    slide30.addText(item.desc, { x: 1.7, y: item.y + 0.8, w: 7.5, h: 0.5, fontSize: 12, fontFace: fonts.main, color: colors.textSecondary });
});
addFooter(pptx, slide30, 'CPPIB, Superintendencia Chile');

// Slide 31: Points clés point commun
addPointsCles('Synthèse', 'Point commun des meilleurs systèmes', [
    { icon: '✅', text: 'Tous intègrent une part significative de capitalisation' },
    { icon: '✅', text: 'Tous offrent un taux de remplacement supérieur à la France' },
    { icon: '✅', text: 'Tous ont des fonds de pension > 50% du PIB (France : ~10%)' },
    { icon: '✅', text: 'Tous combinent répartition ET capitalisation (pas l\'un ou l\'autre)' }
], 'Mercer, OCDE 2024');

// ============================================================
// PARTIE 4 — MARCHÉS (Slides 32-40)
// ============================================================

// Slide 32: Transition
addTransition('04', 'La puissance des marchés', 'Rendements, intérêts composés, horizons longs', colors.accentGold);

// Slide 33: Barres rendements
addBars('Rendements', 'Rendements annuels moyens (long terme)', [
    { label: 'S&P 500', value: '10,5%/an', width: 100, color: colors.accentGreen },
    { label: 'MSCI World', value: '8,3%/an', width: 79, color: colors.accentElectric },
    { label: 'Immobilier', value: '5%/an', width: 48, color: colors.accentGold },
    { label: 'Obligations', value: '3%/an', width: 29, color: colors.accentPurple },
    { label: 'Inflation', value: '2%/an', width: 19, color: colors.accentOrange },
    { label: 'Répartition', value: '1,5%/an', width: 14, color: colors.accentRed }
], 'Le S&P 500 a rapporté 10,5%/an en moyenne sur 100 ans (1926-2024)', 'NYU Stern, MSCI, COR');

// Slide 34: Focus Capitalisation vs Répartition
addFocus2Col('Comparaison', [
    { text: 'Capitalisation ', options: { color: colors.accentGreen } },
    { text: '7%', options: { color: colors.accentGreen, bold: true } },
    { text: ' vs Répartition ', options: { color: colors.textPrimary } },
    { text: '1,5%', options: { color: colors.accentRed, bold: true } }
], 'Capitalisation', '~7%', colors.accentGreen, 'rendement réel moyen', ['Marchés actions long terme', 'Intérêts composés', 'Ajusté de l\'inflation'],
'Répartition', [
    { label: 'Rendement', value: '~1,5%' },
    { label: 'Dépend de', value: 'PIB' },
    { label: 'Tendance', value: 'Baisse' }
], 'COR, NYU Stern');

// Slide 35: Chiffre clé 980 000€
addChiffreCle('Simulation', 'SIMULATION : 300€/MOIS PENDANT 42 ANS À 7%', '980K', 120, colors.accentGreen, 'euros', [
    { text: 'Capital investi : ', options: { color: colors.textSecondary } },
    { text: '151 200€', options: { color: colors.accentElectric, bold: true } },
    { text: ' — Gains : ', options: { color: colors.textSecondary } },
    { text: '828 800€ (×6,5)', options: { color: colors.accentGold, bold: true } }
], 'Simulation OVA');

// Slide 36: Projections intérêts composés
addProjections('Composés', 'La magie des intérêts composés', 'Valeur de 300€/mois investis pendant 42 ans', [
    { year: '2%', solde: '230K€', soldeColor: colors.accentElectric, montant: 'Livret A' },
    { year: '5%', solde: '530K€', soldeColor: colors.accentGold, montant: 'Obligations' },
    { year: '7%', solde: '980K€', soldeColor: colors.accentGreen, montant: 'Actions monde' },
    { year: '10%', solde: '2,1M€', soldeColor: colors.accentGreen, montant: 'S&P 500' }
], 'À 7%, vos 151 200€ investis deviennent 980 000€ (+548%)', 'Calculs OVA');

// Slide 37: Points clés risque = mythe
addPointsCles('Risque', [
    { text: 'Le risque est un ', options: { color: colors.textPrimary } },
    { text: 'mythe', options: { color: colors.accentGreen, italic: true } }
], [
    { icon: '✅', text: '0% de probabilité de perte sur un horizon de 20 ans (S&P 500)' },
    { icon: '✅', text: 'Après chaque crise, le marché récupère en 2-3 ans maximum' },
    { icon: '✅', text: 'Le S&P 500 a été positif dans 95% des périodes de 10 ans' },
    { icon: '✅', text: 'Le vrai risque, c\'est de ne PAS investir (inflation = -50% en 30 ans)' }
], 'NYU Stern 1926-2024');

// Slide 38: Focus probabilité de perte
addFocus2Col('Horizons', [
    { text: 'Probabilité de perte par ', options: { color: colors.textPrimary } },
    { text: 'horizon', options: { color: colors.accentGreen, italic: true } }
], 'Court terme', '27%', colors.accentRed, 'probabilité de perte sur 1 an', ['Volatilité naturelle', 'Crises temporaires'],
'Long terme', [
    { label: 'Sur 10 ans', value: '5%' },
    { label: 'Sur 15 ans', value: '~1%' },
    { label: 'Sur 20 ans', value: '0%' }
], 'NYU Stern 1926-2024');

// Slide 39: Chiffre clé 1,5%
addChiffreCle('Répartition', 'RENDEMENT IMPLICITE DE LA RÉPARTITION', '1,5', 150, colors.accentRed, '% par an', [
    { text: 'Contre ', options: { color: colors.textSecondary } },
    { text: '7% en capitalisation', options: { color: colors.accentGreen, bold: true } },
    { text: ' — Soit 4,7× moins performant', options: { color: colors.textSecondary } }
], 'COR, INSEE');

// Slide 40: Cartes synthèse marchés (3×1)
const slide40 = pptx.addSlide();
addBackground(pptx, slide40);
addHeader(pptx, slide40, 'Synthèse');
slide40.addText('Capitalisation : les chiffres parlent', { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
const synthMarches = [
    { num: '×6,5', title: 'Multiplicateur', stat: '300€→980K€', desc: '42 ans à 7%/an', color: colors.accentGreen },
    { num: '0%', title: 'Perte sur 20 ans', stat: 'Aucune perte', desc: 'S&P 500 depuis 1926', color: colors.accentElectric },
    { num: '69,8T$', title: 'Actifs mondiaux', stat: 'Record 2024', desc: 'Fonds de pension monde', color: colors.accentGold }
];
synthMarches.forEach((item, i) => {
    const x = 0.3 + i * 3.2;
    slide40.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x, y: 1.5, w: 3.0, h: 3.3, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: item.color, width: 2 }, rectRadius: 0.15, shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: item.color, opacity: 0.25 } });
    slide40.addShape(pptx.shapes.OVAL, { x: x + 0.7, y: 1.7, w: 1.6, h: 1.0, fill: { color: item.color }, shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: item.color, opacity: 0.4 } });
    slide40.addText(item.num, { x: x + 0.7, y: 1.7, w: 1.6, h: 1.0, fontSize: 22, fontFace: fonts.mono, bold: true, color: colors.bgDeep, align: 'center', valign: 'middle' });
    slide40.addText(item.title, { x: x + 0.15, y: 2.9, w: 2.7, h: 0.4, fontSize: 15, fontFace: fonts.main, bold: true, color: colors.textPrimary, align: 'center' });
    slide40.addText(item.stat, { x: x + 0.15, y: 3.4, w: 2.7, h: 0.5, fontSize: 20, fontFace: fonts.mono, bold: true, color: item.color, align: 'center', valign: 'middle' });
    slide40.addText(item.desc, { x: x + 0.15, y: 4.0, w: 2.7, h: 0.5, fontSize: 11, fontFace: fonts.main, color: colors.textSecondary, align: 'center' });
});
addFooter(pptx, slide40, 'Synthèse OVA');

// ============================================================
// PARTIE 5 — TRANSITION (Slides 41-48)
// ============================================================

// Slide 41: Transition
addTransition('05', 'La transition', 'Quel modèle pour la France ?', colors.accentPurple);

// Slide 42: Scénarios
addScenarios('Scénarios', 'Trois voies possibles', [
    { num: 'A', title: 'Modèle suédois', desc: 'Comptes notionnels + 2-5% en capitalisation obligatoire', color: colors.accentElectric },
    { num: 'B', title: 'Modèle suisse', desc: '3 piliers : base + capitalisation obligatoire + libre', color: colors.accentGreen },
    { num: 'C', title: 'Modèle australien', desc: 'Superannuation : 10-12% du salaire en capitalisation', color: colors.accentGold }
], 'OCDE, rapports nationaux');

// Slide 43: Timeline transition
addTimeline('Planning', 'Plan de transition progressive', [
    { year: '2026', value: '2%', event: 'Lancement du pilier capitalisation', highlight: false },
    { year: '2030', value: '4%', event: 'Montée en charge', highlight: false },
    { year: '2035', value: '6%', event: 'Milieu de parcours', highlight: false },
    { year: '2040', value: '8%', event: 'Résultats visibles', highlight: true },
    { year: '2046', value: '10%', event: 'Régime de croisière', highlight: true }
], 'Modélisation OVA');

// Slide 44: Points clés objections
addPointsCles('Objections', [
    { text: 'Répondre aux ', options: { color: colors.textPrimary } },
    { text: 'objections', options: { color: colors.accentPurple, italic: true } }
], [
    { icon: '❓', text: '"C\'est trop risqué" → 0% de perte sur 20 ans, gains moyens ×6' },
    { icon: '❓', text: '"Ça coûte trop cher" → 2% de cotisation, pas de hausse globale' },
    { icon: '❓', text: '"C\'est inégalitaire" → Tous les salariés cotisent, pas les riches uniquement' },
    { icon: '❓', text: '"Et les crises ?" → Diversification + horizon long = protection naturelle' }
], 'OCDE, données historiques');

// Slide 45: Focus coûts statu quo vs réforme
addFocus2Col('Coûts', [
    { text: 'Le coût du ', options: { color: colors.textPrimary } },
    { text: 'statu quo', options: { color: colors.accentRed, italic: true } },
    { text: ' vs la ', options: { color: colors.textPrimary } },
    { text: 'réforme', options: { color: colors.accentGreen, italic: true } }
], 'Statu quo', '~200 Md€', colors.accentRed, 'déficit cumulé d\'ici 2040', ['Pensions en baisse', 'Cotisations en hausse', 'Système non viable'],
'Réforme', [
    { label: 'Coût/an', value: '~15 Md€' },
    { label: 'Retour', value: '>500 Md€' },
    { label: 'Retraites', value: '+200-400€' }
], 'COR, OCDE');

// Slide 46: Cartes Qui y gagne?
addCards2x2('Bénéficiaires', 'Qui y gagne ?', [
    { icon: '👨‍🎓', title: 'Les jeunes', stat: '+200-400€/m', desc: 'Retraite plus élevée que la répartition seule', color: colors.accentGreen },
    { icon: '🏢', title: 'Entreprises', stat: 'Attractivité', desc: 'Avantage salarial pour attirer les talents', color: colors.accentElectric },
    { icon: '📈', title: 'L\'économie', stat: '+500 Md€', desc: 'Épargne investie dans l\'économie productive', color: colors.accentGold },
    { icon: '👴', title: 'Retraités actuels', stat: 'Protégés', desc: 'La répartition est maintenue pour eux', color: colors.accentPurple }
], 'Modélisation OVA');

// Slide 47: Projections impact 20 ans
addProjections('Impact', 'Impact projeté à 20 ans', 'Actifs cumulés et impact sur les pensions', [
    { year: '2030', solde: '50 Md€', soldeColor: colors.accentElectric, montant: 'Fonds naissant' },
    { year: '2035', solde: '150 Md€', soldeColor: colors.accentGold, montant: '+100-200€/mois' },
    { year: '2040', solde: '300 Md€', soldeColor: colors.accentGreen, montant: '+200-400€/mois' },
    { year: '2046', solde: '500 Md€', soldeColor: colors.accentGreen, montant: 'Croisière' }
], 'Avec 10% du salaire investi, la France rejoint les standards internationaux', 'Modélisation OVA');

// Slide 48: Citation arbre
addCitation('Sagesse', 'Le meilleur moment pour planter un arbre, c\'était il y a 30 ans. Le deuxième meilleur moment, c\'est maintenant.', '— Proverbe chinois', '');

// ============================================================
// CONCLUSION (Slides 49-50)
// ============================================================

// Slide 49: 5 raisons d'agir
addPointsCles('Conclusion', [
    { text: '5 raisons d\'agir ', options: { color: colors.textPrimary } },
    { text: 'maintenant', options: { color: colors.accentElectric, italic: true } }
], [
    { icon: '1️⃣', text: 'Le système actuel est structurellement déficitaire (-15 Md€/an dès 2030)' },
    { icon: '2️⃣', text: 'La démographie rend la répartition pure non viable (1,3 cotisant/retraité)' },
    { icon: '3️⃣', text: 'Tous les meilleurs systèmes mondiaux intègrent la capitalisation' },
    { icon: '4️⃣', text: 'Les marchés offrent 7%/an vs 1,5% pour la répartition (+4,7× plus)' },
    { icon: '5️⃣', text: 'Chaque année perdue = des milliards de rendements composés en moins' }
], 'Synthèse OVA');

// Slide 50: Conclusion Merci
const slide50 = pptx.addSlide();
addBackground(pptx, slide50);
slide50.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.4, y: 1.0, w: 0.8, h: 0.8, fill: { color: colors.accentElectric }, rectRadius: 0.12, shadow: { type: 'outer', blur: 10, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.5 } });
slide50.addText('€', { x: 4.4, y: 1.0, w: 0.8, h: 0.8, fontSize: 36, fontFace: fonts.mono, bold: true, color: colors.bgDeep, align: 'center', valign: 'middle' });
slide50.addText('Où Va l\'Argent', { x: 5.3, y: 1.1, w: 2.5, h: 0.6, fontSize: 20, fontFace: fonts.main, bold: true, color: colors.textPrimary, valign: 'middle' });
slide50.addText('Merci !', { x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 48, fontFace: fonts.serif, italic: true, color: colors.textPrimary, align: 'center', valign: 'middle', shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.3 } });
slide50.addText('Des questions ?', { x: 0.5, y: 2.9, w: 9, h: 0.4, fontSize: 18, fontFace: fonts.main, color: colors.textSecondary, align: 'center', valign: 'middle' });
slide50.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2.5, y: 3.5, w: 5, h: 1.2, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: colors.glassBorder, width: 1 }, rectRadius: 0.1, shadow: { type: 'outer', blur: 8, offset: 3, angle: 45, color: '000000', opacity: 0.25 } });
slide50.addText([
    { text: 'ouvalargent.com', options: { color: colors.accentElectric, bold: true, fontSize: 16 } },
    { text: '\n@ouvalargent', options: { color: colors.textSecondary, fontSize: 12 } },
    { text: '\n\nSources : COR, DREES, INSEE, OCDE, Mercer, NYU Stern', options: { color: colors.textMuted, fontSize: 9 } }
], { x: 2.5, y: 3.5, w: 5, h: 1.2, fontFace: fonts.mono, align: 'center', valign: 'middle' });
slide50.addText('ouvalargent.com', { x: 7.5, y: 5.2, w: 2.1, h: 0.3, fontSize: 11, fontFace: fonts.mono, bold: true, color: colors.accentElectric, align: 'right', valign: 'middle' });

// ============================================================
// SAUVEGARDE
// ============================================================
const outputPath = path.join(__dirname, 'retraite-capitalisation-france.pptx');

pptx.writeFile({ fileName: outputPath })
    .then(() => console.log(`Présentation créée : ${outputPath}`))
    .catch(err => console.error('Erreur:', err));

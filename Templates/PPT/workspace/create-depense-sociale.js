const pptxgen = require('pptxgenjs');
const path = require('path');

// Palette de couleurs du template
const colors = {
    bgDeep: '06080c',
    bgSurface: '0a0e14',
    bgElevated: '111820',
    textPrimary: 'f0f4f8',
    textSecondary: '8899a8',
    textMuted: '4a5a6a',
    accentElectric: '00d4ff',
    accentGold: 'ffd700',
    accentRed: 'ff4757',
    accentGreen: '00ff88',
    accentPurple: 'a855f7',
    accentOrange: 'ff9f43',
    glassBorder: '1a2430'
};

const fonts = {
    main: 'Syne',
    serif: 'Instrument Serif',
    mono: 'JetBrains Mono'
};

const glowImagePath = path.join(__dirname, '../../Templates/PPT/workspace/glow-combined.png');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Où Va l\'Argent';
pptx.title = 'La Dépense Sociale en France';
pptx.subject = 'Présentation conférence';

// === FONCTIONS UTILITAIRES ===

function addBackground(slide) {
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: { color: colors.bgDeep }
    });
    slide.addImage({ path: glowImagePath, x: 0, y: 0, w: 10, h: 5.625 });
    for (let i = 1; i < 10; i++) {
        slide.addShape(pptx.shapes.LINE, {
            x: i, y: 0, w: 0, h: 5.625,
            line: { color: colors.accentElectric, width: 0.3, transparency: 96 }
        });
    }
    for (let i = 1; i < 6; i++) {
        slide.addShape(pptx.shapes.LINE, {
            x: 0, y: i * 0.9, w: 10, h: 0,
            line: { color: colors.accentElectric, width: 0.3, transparency: 96 }
        });
    }
}

function addHeader(slide, tag = 'Section') {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.4, y: 0.3, w: 0.55, h: 0.55,
        fill: { color: colors.accentElectric },
        rectRadius: 0.08
    });
    slide.addText('€', {
        x: 0.4, y: 0.3, w: 0.55, h: 0.55,
        fontSize: 24, fontFace: fonts.mono, bold: true,
        color: colors.bgDeep, align: 'center', valign: 'middle'
    });
    slide.addText('Où Va l\'Argent', {
        x: 1.05, y: 0.35, w: 2, h: 0.45,
        fontSize: 16, fontFace: fonts.main, bold: true,
        color: colors.textPrimary, valign: 'middle'
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 8.0, y: 0.32, w: 1.6, h: 0.45,
        fill: { color: colors.accentElectric, transparency: 85 },
        line: { color: colors.accentElectric, width: 1, transparency: 70 },
        rectRadius: 0.25
    });
    slide.addText(tag.toUpperCase(), {
        x: 8.0, y: 0.32, w: 1.6, h: 0.45,
        fontSize: 9, fontFace: fonts.main, bold: true,
        color: colors.accentElectric, align: 'center', valign: 'middle'
    });
}

function addFooter(slide, source = '') {
    slide.addShape(pptx.shapes.LINE, {
        x: 0.4, y: 5.1, w: 9.2, h: 0,
        line: { color: colors.glassBorder, width: 1 }
    });
    if (source) {
        slide.addText([
            { text: 'Source : ', options: { color: colors.textMuted } },
            { text: source, options: { color: colors.textSecondary } }
        ], {
            x: 0.4, y: 5.2, w: 6, h: 0.3,
            fontSize: 9, fontFace: fonts.main, valign: 'middle'
        });
    }
    slide.addText('ouvalargent.com', {
        x: 7.5, y: 5.2, w: 2.1, h: 0.3,
        fontSize: 11, fontFace: fonts.mono, bold: true,
        color: colors.accentElectric, align: 'right', valign: 'middle'
    });
}

// === SLIDE 1: TITRE ===
const slide1 = pptx.addSlide();
addBackground(slide1);

slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.4, y: 0.8, w: 0.8, h: 0.8,
    fill: { color: colors.accentElectric },
    rectRadius: 0.12,
    shadow: { type: 'outer', blur: 10, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.5 }
});
slide1.addText('€', {
    x: 4.4, y: 0.8, w: 0.8, h: 0.8,
    fontSize: 36, fontFace: fonts.mono, bold: true,
    color: colors.bgDeep, align: 'center', valign: 'middle'
});
slide1.addText('Où Va l\'Argent', {
    x: 5.3, y: 0.9, w: 2.5, h: 0.6,
    fontSize: 20, fontFace: fonts.main, bold: true,
    color: colors.textPrimary, valign: 'middle'
});

slide1.addText('La Dépense Sociale', {
    x: 0.5, y: 1.9, w: 9, h: 0.8,
    fontSize: 48, fontFace: fonts.main, bold: true,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});
slide1.addText('en France', {
    x: 0.5, y: 2.65, w: 9, h: 0.6,
    fontSize: 36, fontFace: fonts.serif, italic: true,
    color: colors.accentElectric, align: 'center', valign: 'middle'
});

slide1.addText('932 milliards d\'euros | 31,9% du PIB | 1er rang européen', {
    x: 0.5, y: 3.5, w: 9, h: 0.4,
    fontSize: 14, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center', valign: 'middle'
});

// Tags
const tags1 = ['Protection sociale', 'Retraites', 'Santé', 'Solidarité'];
tags1.forEach((tag, i) => {
    const x = 2 + i * 1.6;
    slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: 4.1, w: 1.5, h: 0.4,
        fill: { color: colors.accentElectric, transparency: 85 },
        line: { color: colors.accentElectric, width: 1, transparency: 70 },
        rectRadius: 0.2
    });
    slide1.addText(tag, {
        x: x, y: 4.1, w: 1.5, h: 0.4,
        fontSize: 9, fontFace: fonts.main, bold: true,
        color: colors.accentElectric, align: 'center', valign: 'middle'
    });
});

slide1.addText('Conférence 2025', {
    x: 0.4, y: 5.2, w: 3, h: 0.3,
    fontSize: 11, fontFace: fonts.main,
    color: colors.textMuted, valign: 'middle'
});
slide1.addText('ouvalargent.com', {
    x: 7.5, y: 5.2, w: 2.1, h: 0.3,
    fontSize: 11, fontFace: fonts.mono, bold: true,
    color: colors.accentElectric, align: 'right', valign: 'middle'
});

// === SLIDE 2: SOMMAIRE ===
const slide2 = pptx.addSlide();
addBackground(slide2);
addHeader(slide2, 'Sommaire');

slide2.addText('Plan de la présentation', {
    x: 0.5, y: 0.9, w: 9, h: 0.5,
    fontSize: 28, fontFace: fonts.serif,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});

const sommaire = [
    { num: '01', title: 'État des lieux', desc: 'Chiffres clés et répartition' },
    { num: '02', title: 'Comparaisons', desc: 'Europe et évolution historique' },
    { num: '03', title: 'Financement', desc: 'Ressources et déficits' },
    { num: '04', title: 'Débats & Enjeux', desc: 'Fraude, non-recours, réformes' }
];

sommaire.forEach((item, i) => {
    const x = 0.5 + i * 2.35;
    slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: 1.6, w: 2.2, h: 3.2,
        fill: { color: colors.bgElevated, transparency: 15 },
        line: { color: colors.glassBorder, width: 1 },
        rectRadius: 0.15,
        shadow: { type: 'outer', blur: 8, offset: 3, angle: 45, color: '000000', opacity: 0.3 }
    });
    slide2.addShape(pptx.shapes.OVAL, {
        x: x + 0.15, y: 1.8, w: 0.5, h: 0.5,
        fill: { color: colors.accentElectric },
        shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.4 }
    });
    slide2.addText(item.num, {
        x: x + 0.15, y: 1.8, w: 0.5, h: 0.5,
        fontSize: 14, fontFace: fonts.mono, bold: true,
        color: colors.bgDeep, align: 'center', valign: 'middle'
    });
    slide2.addText(item.title, {
        x: x + 0.15, y: 2.45, w: 1.9, h: 0.4,
        fontSize: 15, fontFace: fonts.main, bold: true,
        color: colors.textPrimary, valign: 'top'
    });
    slide2.addText(item.desc, {
        x: x + 0.15, y: 2.9, w: 1.9, h: 1.5,
        fontSize: 11, fontFace: fonts.main,
        color: colors.textSecondary, valign: 'top'
    });
});

addFooter(slide2);

// === SLIDE 3: CONTEXTE ===
const slide3 = pptx.addSlide();
addBackground(slide3);
addHeader(slide3, 'Contexte');

slide3.addText([
    { text: 'La France, ', options: { color: colors.textPrimary } },
    { text: 'championne d\'Europe', options: { color: colors.accentElectric, italic: true } }
], {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 28, fontFace: fonts.serif, valign: 'middle'
});

slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.55, w: 9.2, h: 3.35,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.glassBorder, width: 1 },
    rectRadius: 0.15,
    shadow: { type: 'outer', blur: 10, offset: 4, angle: 45, color: '000000', opacity: 0.25 }
});

const contextePoints = [
    { icon: '🏆', text: '1er pays européen en dépenses sociales (% PIB) depuis 2016' },
    { icon: '💶', text: '932,5 milliards d\'euros de prestations en 2024' },
    { icon: '📊', text: '31,9% du PIB contre 27,3% en moyenne UE (+4,6 pts)' },
    { icon: '👥', text: '13 650€ de dépenses par habitant par an' }
];

contextePoints.forEach((point, i) => {
    const y = 1.75 + i * 0.75;
    slide3.addText(point.icon, {
        x: 0.6, y: y, w: 0.5, h: 0.6,
        fontSize: 24, align: 'center', valign: 'middle'
    });
    slide3.addText(point.text, {
        x: 1.2, y: y, w: 8, h: 0.6,
        fontSize: 15, fontFace: fonts.main,
        color: colors.textPrimary, valign: 'middle'
    });
});

addFooter(slide3, 'DREES, 2025');

// === SLIDE 4: CHIFFRE CLÉ ===
const slide4 = pptx.addSlide();
addBackground(slide4);
addHeader(slide4, 'Chiffre clé');

slide4.addText('PRESTATIONS SOCIALES EN 2024', {
    x: 0.5, y: 1.2, w: 9, h: 0.4,
    fontSize: 13, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center', valign: 'middle',
    charSpacing: 3
});

slide4.addText('932', {
    x: 0.5, y: 1.5, w: 9, h: 1.8,
    fontSize: 150, fontFace: fonts.mono, bold: true,
    color: colors.accentElectric, align: 'center', valign: 'middle',
    shadow: { type: 'outer', blur: 15, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.5 }
});

slide4.addText('milliards d\'euros', {
    x: 0.5, y: 3.2, w: 9, h: 0.5,
    fontSize: 32, fontFace: fonts.serif, italic: true,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});

slide4.addText([
    { text: 'Soit ', options: { color: colors.textSecondary } },
    { text: '31,9% du PIB', options: { color: colors.accentGold, bold: true } },
    { text: ' — En hausse de ', options: { color: colors.textSecondary } },
    { text: '+4,8%', options: { color: colors.accentGreen, bold: true } },
    { text: ' vs 2023', options: { color: colors.textSecondary } }
], {
    x: 1, y: 3.9, w: 8, h: 0.8,
    fontSize: 14, fontFace: fonts.main, align: 'center', valign: 'top'
});

addFooter(slide4, 'DREES - Comptes de la protection sociale 2024');

// === SLIDE 5: RÉPARTITION ===
const slide5 = pptx.addSlide();
addBackground(slide5);
addHeader(slide5, 'Répartition');

slide5.addText('Où va l\'argent ?', {
    x: 0.5, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});

const repartition = [
    { label: 'Vieillesse-Survie', value: '400,7 Md€', pct: '45%', width: 90, color: colors.accentElectric },
    { label: 'Santé-Maladie', value: '325,7 Md€', pct: '37%', width: 73, color: colors.accentGold },
    { label: 'Famille-Enfants', value: '62,9 Md€', pct: '7%', width: 14, color: colors.accentPurple },
    { label: 'Emploi-Chômage', value: '49,3 Md€', pct: '6%', width: 12, color: colors.accentGreen },
    { label: 'Pauvreté-Exclusion', value: '35,2 Md€', pct: '4%', width: 8, color: colors.accentOrange },
    { label: 'Logement', value: '15,8 Md€', pct: '2%', width: 4, color: colors.accentRed }
];

repartition.forEach((bar, i) => {
    const y = 1.5 + i * 0.58;
    slide5.addText(bar.label, {
        x: 0.3, y: y, w: 2.3, h: 0.5,
        fontSize: 11, fontFace: fonts.main,
        color: colors.textSecondary, align: 'right', valign: 'middle'
    });
    slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 2.7, y: y + 0.08, w: 5.8, h: 0.38,
        fill: { color: colors.bgElevated },
        rectRadius: 0.06
    });
    const fillWidth = (bar.width / 100) * 5.8;
    slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 2.7, y: y + 0.08, w: fillWidth, h: 0.38,
        fill: { color: bar.color },
        rectRadius: 0.06,
        shadow: { type: 'outer', blur: 5, offset: 0, angle: 0, color: bar.color, opacity: 0.4 }
    });
    slide5.addText(bar.value, {
        x: 2.7, y: y + 0.08, w: fillWidth > 1 ? fillWidth - 0.1 : 1.2, h: 0.38,
        fontSize: 10, fontFace: fonts.mono, bold: true,
        color: fillWidth > 1 ? colors.bgDeep : colors.textPrimary,
        align: fillWidth > 1 ? 'right' : 'left', valign: 'middle'
    });
    slide5.addText(bar.pct, {
        x: 8.6, y: y, w: 1, h: 0.5,
        fontSize: 12, fontFace: fonts.mono, bold: true,
        color: bar.color, align: 'left', valign: 'middle'
    });
});

addFooter(slide5, 'INSEE, DREES - 2023');

// === SLIDE 6: FOCUS RETRAITES ===
const slide6 = pptx.addSlide();
addBackground(slide6);
addHeader(slide6, 'Retraites');

slide6.addText([
    { text: 'Les retraites : ', options: { color: colors.textPrimary } },
    { text: '45%', options: { color: colors.accentElectric, bold: true } },
    { text: ' des dépenses', options: { color: colors.textPrimary } }
], {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif, valign: 'middle'
});

// Deux colonnes
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.55, w: 4.4, h: 3.35,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.glassBorder, width: 1 },
    rectRadius: 0.15
});

slide6.addText('400,7 Md€', {
    x: 0.4, y: 1.7, w: 4.4, h: 0.8,
    fontSize: 40, fontFace: fonts.mono, bold: true,
    color: colors.accentElectric, align: 'center', valign: 'middle',
    shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.4 }
});
slide6.addText('soit 14,2% du PIB', {
    x: 0.4, y: 2.5, w: 4.4, h: 0.4,
    fontSize: 14, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center'
});

const retraiteStats = [
    '17 millions de retraités',
    '1 629€ de pension moyenne',
    'Âge légal : 64 ans (2030)'
];
retraiteStats.forEach((stat, i) => {
    slide6.addText('• ' + stat, {
        x: 0.7, y: 3.1 + i * 0.45, w: 4, h: 0.4,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textPrimary
    });
});

slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.0, y: 1.55, w: 4.6, h: 3.35,
    fill: { color: colors.accentElectric, transparency: 92 },
    line: { color: colors.accentElectric, width: 1, transparency: 50 },
    rectRadius: 0.15
});
slide6.addShape(pptx.shapes.RECTANGLE, {
    x: 5.0, y: 1.55, w: 4.6, h: 0.05,
    fill: { color: colors.accentElectric }
});

slide6.addText('Comparaison UE', {
    x: 5.0, y: 1.7, w: 4.6, h: 0.4,
    fontSize: 14, fontFace: fonts.main, bold: true,
    color: colors.textPrimary, align: 'center'
});

const comparaisonRetraites = [
    { pays: 'France', pct: '14,2%' },
    { pays: 'Italie', pct: '13,7%' },
    { pays: 'Allemagne', pct: '10,2%' },
    { pays: 'Moyenne UE', pct: '11,9%' }
];
comparaisonRetraites.forEach((item, i) => {
    slide6.addText(item.pays, {
        x: 5.3, y: 2.2 + i * 0.55, w: 2, h: 0.45,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textSecondary
    });
    slide6.addText(item.pct, {
        x: 7.5, y: 2.2 + i * 0.55, w: 1.8, h: 0.45,
        fontSize: 14, fontFace: fonts.mono, bold: true,
        color: i === 0 ? colors.accentElectric : colors.textPrimary, align: 'right'
    });
});

addFooter(slide6, 'COR, DREES 2024');

// === SLIDE 7: FOCUS SANTÉ ===
const slide7 = pptx.addSlide();
addBackground(slide7);
addHeader(slide7, 'Santé');

slide7.addText([
    { text: 'La santé : ', options: { color: colors.textPrimary } },
    { text: '37%', options: { color: colors.accentGold, bold: true } },
    { text: ' des dépenses', options: { color: colors.textPrimary } }
], {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif, valign: 'middle'
});

slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.55, w: 9.2, h: 3.35,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.glassBorder, width: 1 },
    rectRadius: 0.15
});

slide7.addText('325,7 Md€', {
    x: 0.4, y: 1.8, w: 9.2, h: 0.8,
    fontSize: 48, fontFace: fonts.mono, bold: true,
    color: colors.accentGold, align: 'center', valign: 'middle',
    shadow: { type: 'outer', blur: 10, offset: 0, angle: 0, color: colors.accentGold, opacity: 0.4 }
});
slide7.addText('soit 10% du PIB — le plus élevé d\'Europe', {
    x: 0.4, y: 2.6, w: 9.2, h: 0.4,
    fontSize: 14, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center'
});

const santeItems = [
    { label: 'ONDAM 2025', value: '265 Md€', color: colors.accentElectric },
    { label: 'Hôpital', value: '45%', color: colors.accentPurple },
    { label: 'Soins de ville', value: '28%', color: colors.accentGreen },
    { label: 'Médicaments', value: '15%', color: colors.accentOrange }
];

santeItems.forEach((item, i) => {
    const x = 0.7 + i * 2.3;
    slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: 3.2, w: 2.1, h: 1.4,
        fill: { color: item.color, transparency: 85 },
        line: { color: item.color, width: 1, transparency: 50 },
        rectRadius: 0.1
    });
    slide7.addText(item.value, {
        x: x, y: 3.3, w: 2.1, h: 0.6,
        fontSize: 20, fontFace: fonts.mono, bold: true,
        color: item.color, align: 'center', valign: 'middle'
    });
    slide7.addText(item.label, {
        x: x, y: 3.95, w: 2.1, h: 0.5,
        fontSize: 10, fontFace: fonts.main,
        color: colors.textSecondary, align: 'center'
    });
});

addFooter(slide7, 'Assurance Maladie, PLFSS 2025');

// === SLIDE 8: AUTRES RISQUES ===
const slide8 = pptx.addSlide();
addBackground(slide8);
addHeader(slide8, 'Autres risques');

slide8.addText('Les 18% restants', {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, valign: 'middle'
});

const autresRisques = [
    { icon: '👨‍👩‍👧‍👦', title: 'Famille', montant: '62,9 Md€', desc: 'Allocations familiales, PAJE, ASF', color: colors.accentPurple },
    { icon: '💼', title: 'Chômage', montant: '49,3 Md€', desc: 'ARE, ASS, formation', color: colors.accentGreen },
    { icon: '🏠', title: 'Logement', montant: '15,8 Md€', desc: 'APL, ALF, ALS', color: colors.accentOrange },
    { icon: '🤝', title: 'Pauvreté', montant: '35,2 Md€', desc: 'RSA, AAH, ASPA, prime activité', color: colors.accentRed }
];

autresRisques.forEach((item, i) => {
    const x = 0.4 + (i % 2) * 4.7;
    const y = 1.5 + Math.floor(i / 2) * 1.85;

    slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: y, w: 4.5, h: 1.7,
        fill: { color: colors.bgElevated, transparency: 15 },
        line: { color: item.color, width: 1, transparency: 50 },
        rectRadius: 0.12
    });
    slide8.addText(item.icon, {
        x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.6,
        fontSize: 28
    });
    slide8.addText(item.title, {
        x: x + 0.9, y: y + 0.25, w: 2, h: 0.4,
        fontSize: 16, fontFace: fonts.main, bold: true,
        color: colors.textPrimary
    });
    slide8.addText(item.montant, {
        x: x + 2.8, y: y + 0.25, w: 1.5, h: 0.4,
        fontSize: 16, fontFace: fonts.mono, bold: true,
        color: item.color, align: 'right'
    });
    slide8.addText(item.desc, {
        x: x + 0.2, y: y + 0.9, w: 4.1, h: 0.6,
        fontSize: 11, fontFace: fonts.main,
        color: colors.textSecondary
    });
});

addFooter(slide8, 'DREES 2023');

// === SLIDE 9: COMPARAISON EUROPÉENNE ===
const slide9 = pptx.addSlide();
addBackground(slide9);
addHeader(slide9, 'Europe');

slide9.addText('La France face à ses voisins', {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, valign: 'middle'
});

const paysData = [
    { pays: 'France', pct: 31.9, color: colors.accentElectric },
    { pays: 'Allemagne', pct: 28.9, color: colors.textSecondary },
    { pays: 'Italie', pct: 28.1, color: colors.textSecondary },
    { pays: 'Moyenne UE', pct: 27.3, color: colors.accentGold },
    { pays: 'Espagne', pct: 25.1, color: colors.textSecondary },
    { pays: 'Royaume-Uni', pct: 21.0, color: colors.textSecondary }
];

paysData.forEach((item, i) => {
    const y = 1.55 + i * 0.58;
    slide9.addText(item.pays, {
        x: 0.4, y: y, w: 2.2, h: 0.5,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textSecondary, align: 'right', valign: 'middle'
    });
    slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 2.7, y: y + 0.08, w: 5.5, h: 0.38,
        fill: { color: colors.bgElevated },
        rectRadius: 0.06
    });
    const barWidth = (item.pct / 35) * 5.5;
    slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 2.7, y: y + 0.08, w: barWidth, h: 0.38,
        fill: { color: item.color },
        rectRadius: 0.06,
        shadow: item.pays === 'France' ? { type: 'outer', blur: 6, offset: 0, angle: 0, color: item.color, opacity: 0.5 } : undefined
    });
    slide9.addText(item.pct + '% PIB', {
        x: 8.3, y: y, w: 1.3, h: 0.5,
        fontSize: 12, fontFace: fonts.mono, bold: true,
        color: item.color, align: 'left', valign: 'middle'
    });
});

slide9.addText('La France dépense 4,6 points de PIB de plus que la moyenne UE', {
    x: 0.5, y: 4.65, w: 9, h: 0.35,
    fontSize: 12, fontFace: fonts.main, italic: true,
    color: colors.textMuted, align: 'center'
});

addFooter(slide9, 'Eurostat 2023');

// === SLIDE 10: ÉVOLUTION ===
const slide10 = pptx.addSlide();
addBackground(slide10);
addHeader(slide10, 'Évolution');

slide10.addText('10 ans de dépenses sociales', {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, valign: 'middle'
});

// Timeline verticale
const timeline = [
    { year: '2014', value: '700 Md€', pct: '31,9%', event: '' },
    { year: '2019', value: '762 Md€', pct: '31,2%', event: 'Pré-COVID' },
    { year: '2020', value: '822 Md€', pct: '35,4%', event: 'Pic COVID', highlight: true },
    { year: '2024', value: '932 Md€', pct: '31,9%', event: '+233 Md€ en 10 ans', highlight: true }
];

slide10.addShape(pptx.shapes.LINE, {
    x: 2, y: 1.7, w: 0, h: 3.1,
    line: { color: colors.accentElectric, width: 3 }
});

timeline.forEach((item, i) => {
    const y = 1.7 + i * 0.95;

    slide10.addShape(pptx.shapes.OVAL, {
        x: 1.85, y: y - 0.1, w: 0.3, h: 0.3,
        fill: { color: item.highlight ? colors.accentElectric : colors.bgElevated },
        line: { color: colors.accentElectric, width: 2 }
    });

    slide10.addText(item.year, {
        x: 0.4, y: y - 0.15, w: 1.3, h: 0.4,
        fontSize: 14, fontFace: fonts.mono, bold: true,
        color: colors.accentElectric, align: 'right', valign: 'middle'
    });

    slide10.addText(item.value, {
        x: 2.4, y: y - 0.15, w: 2, h: 0.4,
        fontSize: 18, fontFace: fonts.mono, bold: true,
        color: item.highlight ? colors.accentGold : colors.textPrimary, valign: 'middle'
    });

    slide10.addText(item.pct + ' du PIB', {
        x: 4.5, y: y - 0.15, w: 1.8, h: 0.4,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textSecondary, valign: 'middle'
    });

    if (item.event) {
        slide10.addText(item.event, {
            x: 6.5, y: y - 0.15, w: 3, h: 0.4,
            fontSize: 11, fontFace: fonts.main, italic: true,
            color: item.highlight ? colors.accentElectric : colors.textMuted, valign: 'middle'
        });
    }
});

addFooter(slide10, 'DREES, INSEE');

// === SLIDE 11: FINANCEMENT ===
const slide11 = pptx.addSlide();
addBackground(slide11);
addHeader(slide11, 'Financement');

slide11.addText('D\'où vient l\'argent ?', {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, valign: 'middle'
});

const financement = [
    { source: 'Cotisations sociales', montant: '428 Md€', pct: '59%', color: colors.accentElectric },
    { source: 'CSG', montant: '154 Md€', pct: '21%', color: colors.accentGold },
    { source: 'Impôts & taxes', montant: '80 Md€', pct: '11%', color: colors.accentPurple },
    { source: 'Contributions État', montant: '65 Md€', pct: '9%', color: colors.accentGreen }
];

financement.forEach((item, i) => {
    const x = 0.5 + (i % 2) * 4.7;
    const y = 1.5 + Math.floor(i / 2) * 1.75;

    slide11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: y, w: 4.4, h: 1.6,
        fill: { color: colors.bgElevated, transparency: 15 },
        line: { color: item.color, width: 2 },
        rectRadius: 0.12,
        shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: item.color, opacity: 0.3 }
    });

    slide11.addText(item.pct, {
        x: x + 0.2, y: y + 0.15, w: 1.2, h: 0.8,
        fontSize: 32, fontFace: fonts.mono, bold: true,
        color: item.color, valign: 'middle'
    });

    slide11.addText(item.source, {
        x: x + 1.5, y: y + 0.2, w: 2.7, h: 0.4,
        fontSize: 14, fontFace: fonts.main, bold: true,
        color: colors.textPrimary
    });

    slide11.addText(item.montant, {
        x: x + 1.5, y: y + 0.65, w: 2.7, h: 0.4,
        fontSize: 16, fontFace: fonts.mono,
        color: colors.textSecondary
    });
});

slide11.addText('1 point de CSG = 17,5 Md€ de recettes', {
    x: 0.5, y: 4.65, w: 9, h: 0.35,
    fontSize: 12, fontFace: fonts.main, italic: true,
    color: colors.textMuted, align: 'center'
});

addFooter(slide11, 'DREES, La finance pour tous');

// === SLIDE 12: DÉFICIT ===
const slide12 = pptx.addSlide();
addBackground(slide12);
addHeader(slide12, 'Déficit');

slide12.addText([
    { text: 'Situation ', options: { color: colors.textPrimary } },
    { text: 'alarmante', options: { color: colors.accentRed, italic: true } }
], {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif, valign: 'middle'
});

// Chiffre central
slide12.addText('-22,1', {
    x: 0.5, y: 1.5, w: 9, h: 1.2,
    fontSize: 90, fontFace: fonts.mono, bold: true,
    color: colors.accentRed, align: 'center', valign: 'middle',
    shadow: { type: 'outer', blur: 12, offset: 0, angle: 0, color: colors.accentRed, opacity: 0.4 }
});
slide12.addText('milliards € de déficit Sécu prévu en 2025', {
    x: 0.5, y: 2.65, w: 9, h: 0.4,
    fontSize: 16, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center'
});

// Évolution du déficit
const deficits = [
    { year: '2023', value: '-10,8 Md€' },
    { year: '2024', value: '-15,3 Md€' },
    { year: '2025', value: '-22,1 Md€' },
    { year: '2028', value: '-24,1 Md€' }
];

deficits.forEach((item, i) => {
    const x = 1.3 + i * 2;
    slide12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: 3.3, w: 1.8, h: 1.3,
        fill: { color: colors.bgElevated, transparency: 15 },
        line: { color: colors.accentRed, width: 1, transparency: 50 },
        rectRadius: 0.1
    });
    slide12.addText(item.year, {
        x: x, y: 3.4, w: 1.8, h: 0.4,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textMuted, align: 'center'
    });
    slide12.addText(item.value, {
        x: x, y: 3.85, w: 1.8, h: 0.55,
        fontSize: 14, fontFace: fonts.mono, bold: true,
        color: colors.accentRed, align: 'center', valign: 'middle'
    });
});

addFooter(slide12, 'Cour des comptes, 2025');

// === SLIDE 13: PROJECTIONS ===
const slide13 = pptx.addSlide();
addBackground(slide13);
addHeader(slide13, 'Projections');

slide13.addText('Trajectoire des retraites', {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, valign: 'middle'
});

slide13.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.5, w: 9.2, h: 3.4,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.glassBorder, width: 1 },
    rectRadius: 0.15
});

slide13.addText('Solde du système de retraites (% du PIB)', {
    x: 0.5, y: 1.65, w: 9, h: 0.4,
    fontSize: 13, fontFace: fonts.main, bold: true,
    color: colors.textSecondary, align: 'center'
});

const projections = [
    { year: '2030', solde: '-0,2%', montant: '-6,6 Md€' },
    { year: '2040', solde: '-0,7%', montant: '~-20 Md€' },
    { year: '2050', solde: '-1,1%', montant: '~-35 Md€' },
    { year: '2070', solde: '-1,4%', montant: '~-50 Md€' }
];

projections.forEach((item, i) => {
    const x = 0.8 + i * 2.3;
    slide13.addText(item.year, {
        x: x, y: 2.2, w: 2, h: 0.4,
        fontSize: 14, fontFace: fonts.mono, bold: true,
        color: colors.accentElectric, align: 'center'
    });
    slide13.addText(item.solde, {
        x: x, y: 2.7, w: 2, h: 0.6,
        fontSize: 28, fontFace: fonts.mono, bold: true,
        color: colors.accentRed, align: 'center', valign: 'middle'
    });
    slide13.addText(item.montant, {
        x: x, y: 3.4, w: 2, h: 0.4,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textSecondary, align: 'center'
    });
});

slide13.addText('Malgré la réforme de 2023, le système reste structurellement déficitaire', {
    x: 0.5, y: 4.1, w: 9, h: 0.5,
    fontSize: 12, fontFace: fonts.main, italic: true,
    color: colors.textMuted, align: 'center'
});

addFooter(slide13, 'COR - Rapport annuel 2025');

// === SLIDE 14: RÉFORMES ===
const slide14 = pptx.addSlide();
addBackground(slide14);
addHeader(slide14, 'Réformes');

slide14.addText('Les réformes récentes', {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, valign: 'middle'
});

const reformes = [
    {
        title: 'Retraites 2023',
        mesure: 'Âge légal : 62 → 64 ans',
        impact: 'Économie : 0,2 pt PIB en 2030',
        color: colors.accentElectric
    },
    {
        title: 'Chômage 2025',
        mesure: 'Durée max : 24 → 18 mois (<55 ans)',
        impact: 'Économie : 3,6 Md€/an',
        color: colors.accentGold
    },
    {
        title: 'RSA conditionnel',
        mesure: '15-20h d\'activité obligatoires',
        impact: 'Entrée en vigueur : janvier 2025',
        color: colors.accentPurple
    }
];

reformes.forEach((item, i) => {
    const y = 1.5 + i * 1.15;

    slide14.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.4, y: y, w: 9.2, h: 1.0,
        fill: { color: colors.bgElevated, transparency: 15 },
        line: { color: item.color, width: 1, transparency: 50 },
        rectRadius: 0.1
    });

    slide14.addShape(pptx.shapes.RECTANGLE, {
        x: 0.4, y: y, w: 0.08, h: 1.0,
        fill: { color: item.color }
    });

    slide14.addText(item.title, {
        x: 0.7, y: y + 0.1, w: 2.5, h: 0.4,
        fontSize: 14, fontFace: fonts.main, bold: true,
        color: item.color
    });

    slide14.addText(item.mesure, {
        x: 0.7, y: y + 0.5, w: 4, h: 0.4,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textPrimary
    });

    slide14.addText(item.impact, {
        x: 5.5, y: y + 0.3, w: 4, h: 0.4,
        fontSize: 11, fontFace: fonts.mono,
        color: colors.textSecondary, align: 'right'
    });
});

addFooter(slide14, 'Vie publique, Unédic, Service-public.fr');

// === SLIDE 15: FRAUDE ===
const slide15 = pptx.addSlide();
addBackground(slide15);
addHeader(slide15, 'Fact-check');

slide15.addText([
    { text: 'Fraude sociale vs ', options: { color: colors.textPrimary } },
    { text: 'fraude fiscale', options: { color: colors.accentRed, italic: true } }
], {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif, valign: 'middle'
});

// Comparaison visuelle
slide15.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.55, w: 4.4, h: 2.5,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.accentOrange, width: 1 },
    rectRadius: 0.12
});
slide15.addText('Fraude sociale', {
    x: 0.5, y: 1.7, w: 4.4, h: 0.4,
    fontSize: 14, fontFace: fonts.main, bold: true,
    color: colors.accentOrange, align: 'center'
});
slide15.addText('13-14 Md€', {
    x: 0.5, y: 2.2, w: 4.4, h: 0.7,
    fontSize: 32, fontFace: fonts.mono, bold: true,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});
slide15.addText('dont 56% = entreprises\n(travail dissimulé)', {
    x: 0.5, y: 3.0, w: 4.4, h: 0.8,
    fontSize: 11, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center'
});

slide15.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.1, y: 1.55, w: 4.4, h: 2.5,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.accentRed, width: 2 },
    rectRadius: 0.12,
    shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: colors.accentRed, opacity: 0.3 }
});
slide15.addText('Fraude fiscale', {
    x: 5.1, y: 1.7, w: 4.4, h: 0.4,
    fontSize: 14, fontFace: fonts.main, bold: true,
    color: colors.accentRed, align: 'center'
});
slide15.addText('80-120 Md€', {
    x: 5.1, y: 2.2, w: 4.4, h: 0.7,
    fontSize: 32, fontFace: fonts.mono, bold: true,
    color: colors.accentRed, align: 'center', valign: 'middle'
});
slide15.addText('6 à 10 fois supérieure\nà la fraude sociale', {
    x: 5.1, y: 3.0, w: 4.4, h: 0.8,
    fontSize: 11, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center'
});

slide15.addText('La fraude des allocataires (RSA, etc.) ne représente qu\'une fraction de la fraude sociale totale', {
    x: 0.5, y: 4.3, w: 9, h: 0.6,
    fontSize: 12, fontFace: fonts.main, italic: true,
    color: colors.textMuted, align: 'center'
});

addFooter(slide15, 'HCFiPS, Solidaires Finances Publiques');

// === SLIDE 16: NON-RECOURS ===
const slide16 = pptx.addSlide();
addBackground(slide16);
addHeader(slide16, 'Non-recours');

slide16.addText([
    { text: 'Le paradoxe du ', options: { color: colors.textPrimary } },
    { text: 'non-recours', options: { color: colors.accentPurple, italic: true } }
], {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif, valign: 'middle'
});

slide16.addText('Des milliards d\'euros d\'aides non réclamées chaque année', {
    x: 0.5, y: 1.45, w: 9, h: 0.35,
    fontSize: 13, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center'
});

const nonRecours = [
    { aide: 'Minimum vieillesse (ASPA)', taux: '50%', color: colors.accentRed },
    { aide: 'Complémentaire santé (CSS)', taux: '44%', color: colors.accentOrange },
    { aide: 'Prime d\'activité', taux: '39%', color: colors.accentGold },
    { aide: 'RSA', taux: '34%', color: colors.accentPurple },
    { aide: 'Assurance chômage', taux: '25-42%', color: colors.accentGreen }
];

nonRecours.forEach((item, i) => {
    const y = 1.9 + i * 0.6;

    slide16.addText(item.aide, {
        x: 0.5, y: y, w: 4, h: 0.5,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textSecondary, align: 'right', valign: 'middle'
    });

    slide16.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 4.7, y: y + 0.08, w: 3.5, h: 0.38,
        fill: { color: colors.bgElevated },
        rectRadius: 0.06
    });

    const pctValue = parseInt(item.taux);
    const barWidth = (pctValue / 55) * 3.5;
    slide16.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 4.7, y: y + 0.08, w: barWidth, h: 0.38,
        fill: { color: item.color },
        rectRadius: 0.06
    });

    slide16.addText(item.taux, {
        x: 8.3, y: y, w: 1.2, h: 0.5,
        fontSize: 14, fontFace: fonts.mono, bold: true,
        color: item.color, valign: 'middle'
    });
});

slide16.addText('Non-recours au RSA seul : 3 à 5 milliards €/an non versés', {
    x: 0.5, y: 4.65, w: 9, h: 0.35,
    fontSize: 11, fontFace: fonts.main, italic: true,
    color: colors.textMuted, align: 'center'
});

addFooter(slide16, 'DREES, ODENORE');

// === SLIDE 17: EFFICACITÉ ===
const slide17 = pptx.addSlide();
addBackground(slide17);
addHeader(slide17, 'Impact');

slide17.addText('Effet sur la pauvreté', {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, valign: 'middle'
});

// Comparaison avant/après
slide17.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.5, w: 4.4, h: 2.0,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.glassBorder, width: 1 },
    rectRadius: 0.12
});
slide17.addText('Avant redistribution', {
    x: 0.5, y: 1.65, w: 4.4, h: 0.35,
    fontSize: 12, fontFace: fonts.main,
    color: colors.textMuted, align: 'center'
});
slide17.addText('21,7%', {
    x: 0.5, y: 2.1, w: 4.4, h: 0.8,
    fontSize: 48, fontFace: fonts.mono, bold: true,
    color: colors.textSecondary, align: 'center', valign: 'middle'
});
slide17.addText('de taux de pauvreté', {
    x: 0.5, y: 2.9, w: 4.4, h: 0.35,
    fontSize: 11, fontFace: fonts.main,
    color: colors.textMuted, align: 'center'
});

slide17.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.1, y: 1.5, w: 4.4, h: 2.0,
    fill: { color: colors.accentGreen, transparency: 90 },
    line: { color: colors.accentGreen, width: 2 },
    rectRadius: 0.12,
    shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: colors.accentGreen, opacity: 0.3 }
});
slide17.addText('Après redistribution', {
    x: 5.1, y: 1.65, w: 4.4, h: 0.35,
    fontSize: 12, fontFace: fonts.main,
    color: colors.textMuted, align: 'center'
});
slide17.addText('15,4%', {
    x: 5.1, y: 2.1, w: 4.4, h: 0.8,
    fontSize: 48, fontFace: fonts.mono, bold: true,
    color: colors.accentGreen, align: 'center', valign: 'middle'
});
slide17.addText('-6,3 points', {
    x: 5.1, y: 2.9, w: 4.4, h: 0.35,
    fontSize: 11, fontFace: fonts.main, bold: true,
    color: colors.accentGreen, align: 'center'
});

// Flèche
slide17.addText('→', {
    x: 4.5, y: 2.0, w: 1, h: 0.8,
    fontSize: 36, color: colors.accentElectric, align: 'center', valign: 'middle'
});

slide17.addText('Le taux de pauvreté des enfants est divisé par 2 grâce aux prestations (34% → 17%)', {
    x: 0.5, y: 3.7, w: 9, h: 0.4,
    fontSize: 12, fontFace: fonts.main, italic: true,
    color: colors.textSecondary, align: 'center'
});

slide17.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 2.5, y: 4.2, w: 5, h: 0.65,
    fill: { color: colors.accentRed, transparency: 85 },
    line: { color: colors.accentRed, width: 1 },
    rectRadius: 0.1
});
slide17.addText('⚠️ Alerte : effet en baisse (7,7 pts en 2013 → 6,1 pts en 2023)', {
    x: 2.5, y: 4.2, w: 5, h: 0.65,
    fontSize: 10, fontFace: fonts.main,
    color: colors.accentRed, align: 'center', valign: 'middle'
});

addFooter(slide17, 'INSEE, DREES');

// === SLIDE 18: ENJEUX ===
const slide18 = pptx.addSlide();
addBackground(slide18);
addHeader(slide18, 'Enjeux');

slide18.addText('Les défis à venir', {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, valign: 'middle'
});

const enjeux = [
    {
        icon: '👴',
        title: 'Vieillissement',
        stat: '+65 ans : 22% → 30%',
        desc: 'd\'ici 2070',
        color: colors.accentElectric
    },
    {
        icon: '📉',
        title: 'Dette sociale',
        stat: '~200 Md€',
        desc: 'projetée en 2030',
        color: colors.accentRed
    },
    {
        icon: '⚖️',
        title: 'Ratio actifs/retraités',
        stat: '1,7 → 1,3',
        desc: 'd\'ici 2070',
        color: colors.accentGold
    },
    {
        icon: '🏥',
        title: 'Dépendance',
        stat: '2 → 2,8 M',
        desc: 'personnes en 2050',
        color: colors.accentPurple
    }
];

enjeux.forEach((item, i) => {
    const x = 0.5 + (i % 2) * 4.7;
    const y = 1.5 + Math.floor(i / 2) * 1.75;

    slide18.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: y, w: 4.4, h: 1.6,
        fill: { color: colors.bgElevated, transparency: 15 },
        line: { color: item.color, width: 1, transparency: 50 },
        rectRadius: 0.12
    });

    slide18.addText(item.icon, {
        x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.6,
        fontSize: 28
    });

    slide18.addText(item.title, {
        x: x + 0.9, y: y + 0.2, w: 3.3, h: 0.4,
        fontSize: 14, fontFace: fonts.main, bold: true,
        color: colors.textPrimary
    });

    slide18.addText(item.stat, {
        x: x + 0.9, y: y + 0.65, w: 3.3, h: 0.5,
        fontSize: 20, fontFace: fonts.mono, bold: true,
        color: item.color
    });

    slide18.addText(item.desc, {
        x: x + 0.9, y: y + 1.15, w: 3.3, h: 0.3,
        fontSize: 11, fontFace: fonts.main,
        color: colors.textSecondary
    });
});

addFooter(slide18, 'INSEE, COR, Cour des comptes');

// === SLIDE 19: PERSPECTIVES ===
const slide19 = pptx.addSlide();
addBackground(slide19);
addHeader(slide19, 'Perspectives');

slide19.addText('Trois scénarios possibles', {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, valign: 'middle'
});

const scenarios = [
    {
        num: '1',
        title: 'Statu quo',
        desc: 'Déficits chroniques, dette croissante, risque de crise',
        color: colors.accentRed
    },
    {
        num: '2',
        title: 'Ajustements',
        desc: 'Nouvelles réformes, hausse CSG, contrôle ONDAM',
        color: colors.accentGold
    },
    {
        num: '3',
        title: 'Refonte',
        desc: 'Simplification, universalisation, nouveau financement',
        color: colors.accentGreen
    }
];

scenarios.forEach((item, i) => {
    const x = 0.5 + i * 3.1;

    slide19.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: 1.5, w: 2.9, h: 3.3,
        fill: { color: colors.bgElevated, transparency: 15 },
        line: { color: item.color, width: 2 },
        rectRadius: 0.15,
        shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: item.color, opacity: 0.25 }
    });

    slide19.addShape(pptx.shapes.OVAL, {
        x: x + 1.05, y: 1.7, w: 0.8, h: 0.8,
        fill: { color: item.color },
        shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: item.color, opacity: 0.4 }
    });
    slide19.addText(item.num, {
        x: x + 1.05, y: 1.7, w: 0.8, h: 0.8,
        fontSize: 24, fontFace: fonts.mono, bold: true,
        color: colors.bgDeep, align: 'center', valign: 'middle'
    });

    slide19.addText(item.title, {
        x: x + 0.15, y: 2.7, w: 2.6, h: 0.5,
        fontSize: 16, fontFace: fonts.main, bold: true,
        color: colors.textPrimary, align: 'center'
    });

    slide19.addText(item.desc, {
        x: x + 0.15, y: 3.3, w: 2.6, h: 1.3,
        fontSize: 11, fontFace: fonts.main,
        color: colors.textSecondary, align: 'center'
    });
});

addFooter(slide19, 'Cour des comptes, COR');

// === SLIDE 20: CONCLUSION ===
const slide20 = pptx.addSlide();
addBackground(slide20);

slide20.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.4, y: 1.0, w: 0.8, h: 0.8,
    fill: { color: colors.accentElectric },
    rectRadius: 0.12,
    shadow: { type: 'outer', blur: 10, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.5 }
});
slide20.addText('€', {
    x: 4.4, y: 1.0, w: 0.8, h: 0.8,
    fontSize: 36, fontFace: fonts.mono, bold: true,
    color: colors.bgDeep, align: 'center', valign: 'middle'
});
slide20.addText('Où Va l\'Argent', {
    x: 5.3, y: 1.1, w: 2.5, h: 0.6,
    fontSize: 20, fontFace: fonts.main, bold: true,
    color: colors.textPrimary, valign: 'middle'
});

slide20.addText('Merci !', {
    x: 0.5, y: 2.0, w: 9, h: 0.8,
    fontSize: 48, fontFace: fonts.serif, italic: true,
    color: colors.textPrimary, align: 'center', valign: 'middle',
    shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.3 }
});

slide20.addText('Des questions ?', {
    x: 0.5, y: 2.9, w: 9, h: 0.4,
    fontSize: 18, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center', valign: 'middle'
});

slide20.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 2.5, y: 3.5, w: 5, h: 1.2,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.glassBorder, width: 1 },
    rectRadius: 0.1,
    shadow: { type: 'outer', blur: 8, offset: 3, angle: 45, color: '000000', opacity: 0.25 }
});
slide20.addText([
    { text: 'ouvalargent.com', options: { color: colors.accentElectric, bold: true, fontSize: 16 } },
    { text: '\n@ouvalargent', options: { color: colors.textSecondary, fontSize: 12 } },
    { text: '\n\nSources : DREES, INSEE, Eurostat, COR, Cour des comptes', options: { color: colors.textMuted, fontSize: 9 } }
], {
    x: 2.5, y: 3.5, w: 5, h: 1.2,
    fontFace: fonts.mono, align: 'center', valign: 'middle'
});

slide20.addText('ouvalargent.com', {
    x: 7.5, y: 5.2, w: 2.1, h: 0.3,
    fontSize: 11, fontFace: fonts.mono, bold: true,
    color: colors.accentElectric, align: 'right', valign: 'middle'
});

// === SAUVEGARDE ===
const outputPath = process.argv[2] || 'depense-sociale-france.pptx';
pptx.writeFile({ fileName: outputPath })
    .then(() => console.log(`Présentation créée : ${outputPath}`))
    .catch(err => console.error('Erreur:', err));

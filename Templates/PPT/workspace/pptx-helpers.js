/**
 * Bibliothèque partagée de helpers pour la création de présentations PPTX
 * Projet "Où Va l'Argent"
 *
 * Usage:
 *   const pptxgen = require('pptxgenjs');
 *   const h = require('./pptx-helpers');
 *   const pptx = new pptxgen();
 *   h.addChiffreCle(pptx, 'Tag', 'Label', '42', 150, h.colors.accentRed, 'unité', 'contexte', 'Source');
 */

const path = require('path');

// ============================================================
// CONSTANTES
// ============================================================

const colors = {
    bgDeep: '06080c', bgSurface: '0a0e14', bgElevated: '111820',
    textPrimary: 'f0f4f8', textSecondary: '8899a8', textMuted: '4a5a6a',
    accentElectric: '00d4ff', accentGold: 'ffd700', accentRed: 'ff4757',
    accentGreen: '00ff88', accentPurple: 'a855f7', accentOrange: 'ff9f43',
    glassBorder: '1a2430'
};

const fonts = { main: 'Syne', serif: 'Instrument Serif', mono: 'JetBrains Mono' };

const glowImagePath = path.join(__dirname, 'glow-combined.png');

// Palette ordonnée pour charts natifs
const chartPalette = [
    colors.accentElectric, colors.accentGold, colors.accentRed,
    colors.accentGreen, colors.accentPurple, colors.accentOrange
];

// Options communes pour les charts natifs (dark theme)
function chartBaseOpts(overrides) {
    return Object.assign({
        x: 0.5, y: 1.6, w: 9, h: 3.3,
        showLegend: true,
        legendPos: 'b',
        legendFontSize: 10,
        legendColor: colors.textSecondary,
        legendFontFace: fonts.main,
        plotArea: { fill: { color: colors.bgDeep } },
        catAxisLabelColor: colors.textSecondary,
        catAxisLabelFontFace: fonts.main,
        catAxisLabelFontSize: 10,
        valAxisLabelColor: colors.textSecondary,
        valAxisLabelFontFace: fonts.mono,
        valAxisLabelFontSize: 9,
        catAxisLineShow: false,
        valAxisLineShow: false,
        catGridLine: { color: colors.glassBorder, size: 1 },
        valGridLine: { color: colors.glassBorder, size: 1 },
    }, overrides);
}

// ============================================================
// FONCTIONS UTILITAIRES (Background, Header, Footer)
// ============================================================

function addBackground(pptx, slide) {
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.bgDeep } });
    try { slide.addImage({ path: glowImagePath, x: 0, y: 0, w: 10, h: 5.625 }); } catch (e) { /* glow image optional */ }
    for (let i = 1; i < 10; i++) {
        slide.addShape(pptx.shapes.LINE, { x: i, y: 0, w: 0, h: 5.625, line: { color: colors.accentElectric, width: 0.3, transparency: 96 } });
    }
    for (let i = 1; i < 6; i++) {
        slide.addShape(pptx.shapes.LINE, { x: 0, y: i * 0.9, w: 10, h: 0, line: { color: colors.accentElectric, width: 0.3, transparency: 96 } });
    }
}

function addHeader(pptx, slide, tag) {
    tag = tag || 'Section';
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 0.3, w: 0.55, h: 0.55, fill: { color: colors.accentElectric }, rectRadius: 0.08 });
    slide.addText('€', { x: 0.4, y: 0.3, w: 0.55, h: 0.55, fontSize: 24, fontFace: fonts.mono, bold: true, color: colors.bgDeep, align: 'center', valign: 'middle' });
    slide.addText('Où Va l\'Argent', { x: 1.05, y: 0.35, w: 2, h: 0.45, fontSize: 16, fontFace: fonts.main, bold: true, color: colors.textPrimary, valign: 'middle' });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.0, y: 0.32, w: 1.6, h: 0.45, fill: { color: colors.accentElectric, transparency: 85 }, line: { color: colors.accentElectric, width: 1, transparency: 70 }, rectRadius: 0.25 });
    slide.addText(tag.toUpperCase(), { x: 8.0, y: 0.32, w: 1.6, h: 0.45, fontSize: 9, fontFace: fonts.main, bold: true, color: colors.accentElectric, align: 'center', valign: 'middle' });
}

function addFooter(pptx, slide, source) {
    slide.addShape(pptx.shapes.LINE, { x: 0.4, y: 5.1, w: 9.2, h: 0, line: { color: colors.glassBorder, width: 1 } });
    if (source) {
        slide.addText([
            { text: 'Source : ', options: { color: colors.textMuted } },
            { text: source, options: { color: colors.textSecondary } }
        ], { x: 0.4, y: 5.2, w: 6, h: 0.3, fontSize: 9, fontFace: fonts.main, valign: 'middle' });
    }
    slide.addText('ouvalargent.fr', { x: 7.5, y: 5.2, w: 2.1, h: 0.3, fontSize: 11, fontFace: fonts.mono, bold: true, color: colors.accentElectric, align: 'right', valign: 'middle' });
}

// ============================================================
// HELPERS EXISTANTS (extraits de create-retraite-capitalisation.js)
// ============================================================

function addTransition(pptx, num, title, subtitle, circleColor) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    s.addShape(pptx.shapes.OVAL, { x: 4.1, y: 1.4, w: 1.8, h: 1.8, fill: { color: circleColor }, shadow: { type: 'outer', blur: 12, offset: 0, angle: 0, color: circleColor, opacity: 0.5 } });
    s.addText(num, { x: 4.1, y: 1.4, w: 1.8, h: 1.8, fontSize: 48, fontFace: fonts.mono, bold: true, color: colors.bgDeep, align: 'center', valign: 'middle' });
    s.addText(title, { x: 0.5, y: 3.5, w: 9, h: 0.6, fontSize: 28, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });
    s.addText(subtitle, { x: 1, y: 4.15, w: 8, h: 0.4, fontSize: 14, fontFace: fonts.main, color: colors.textSecondary, align: 'center', valign: 'middle' });
    return s;
}

function addChiffreCle(pptx, tag, label, bigNum, bigSize, bigColor, unit, context, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(label, { x: 0.5, y: 1.2, w: 9, h: 0.4, fontSize: 13, fontFace: fonts.main, color: colors.textSecondary, align: 'center', valign: 'middle', charSpacing: 3 });
    s.addText(bigNum, { x: 0.5, y: 1.5, w: 9, h: 1.8, fontSize: bigSize, fontFace: fonts.mono, bold: true, color: bigColor, align: 'center', valign: 'middle', shadow: { type: 'outer', blur: 15, offset: 0, angle: 0, color: bigColor, opacity: 0.5 } });
    s.addText(unit, { x: 0.5, y: 3.2, w: 9, h: 0.5, fontSize: 32, fontFace: fonts.serif, italic: true, color: colors.textPrimary, align: 'center', valign: 'middle' });
    if (Array.isArray(context)) {
        s.addText(context, { x: 1, y: 3.9, w: 8, h: 0.8, fontSize: 14, fontFace: fonts.main, align: 'center', valign: 'top' });
    } else {
        s.addText(context, { x: 1, y: 3.9, w: 8, h: 0.8, fontSize: 14, fontFace: fonts.main, color: colors.textSecondary, align: 'center', valign: 'top' });
    }
    addFooter(pptx, s, source);
    return s;
}

function addPointsCles(pptx, tag, titleParts, points, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    if (Array.isArray(titleParts)) {
        s.addText(titleParts, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 28, fontFace: fonts.serif, valign: 'middle' });
    } else {
        s.addText(titleParts, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 28, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
    }
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 1.55, w: 9.2, h: 3.35, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: colors.glassBorder, width: 1 }, rectRadius: 0.15, shadow: { type: 'outer', blur: 10, offset: 4, angle: 45, color: '000000', opacity: 0.25 } });
    const spacing = points.length <= 4 ? 0.75 : 0.6;
    points.forEach((p, i) => {
        const y = 1.75 + i * spacing;
        s.addText(p.icon, { x: 0.6, y: y, w: 0.5, h: 0.5, fontSize: 22, align: 'center', valign: 'middle' });
        s.addText(p.text, { x: 1.2, y: y, w: 8, h: 0.5, fontSize: 14, fontFace: fonts.main, color: colors.textPrimary, valign: 'middle' });
    });
    addFooter(pptx, s, source);
    return s;
}

function addBars(pptx, tag, title, bars, bottomText, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.5, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });
    bars.forEach((bar, i) => {
        const y = 1.5 + i * 0.52;
        s.addText(bar.label, { x: 0.2, y: y, w: 2.4, h: 0.44, fontSize: 11, fontFace: fonts.main, color: colors.textSecondary, align: 'right', valign: 'middle' });
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2.7, y: y + 0.05, w: 5.8, h: 0.36, fill: { color: colors.bgElevated }, rectRadius: 0.06 });
        const fillW = (bar.width / 100) * 5.8;
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2.7, y: y + 0.05, w: fillW, h: 0.36, fill: { color: bar.color }, rectRadius: 0.06, shadow: { type: 'outer', blur: 5, offset: 0, angle: 0, color: bar.color, opacity: 0.4 } });
        s.addText(bar.value, { x: 8.6, y: y, w: 1.2, h: 0.44, fontSize: 12, fontFace: fonts.mono, bold: true, color: bar.color, align: 'left', valign: 'middle' });
    });
    if (bottomText) {
        s.addText(bottomText, { x: 0.5, y: 4.65, w: 9, h: 0.35, fontSize: 11, fontFace: fonts.main, italic: true, color: colors.textMuted, align: 'center' });
    }
    addFooter(pptx, s, source);
    return s;
}

function addFocus2Col(pptx, tag, titleParts, leftTitle, leftBig, leftBigColor, leftSub, leftBullets, rightTitle, rightRows, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    if (Array.isArray(titleParts)) {
        s.addText(titleParts, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, valign: 'middle' });
    } else {
        s.addText(titleParts, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
    }
    // Left card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 1.55, w: 4.4, h: 3.35, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: colors.glassBorder, width: 1 }, rectRadius: 0.15 });
    s.addText(leftBig, { x: 0.4, y: 1.7, w: 4.4, h: 0.8, fontSize: 40, fontFace: fonts.mono, bold: true, color: leftBigColor, align: 'center', valign: 'middle', shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: leftBigColor, opacity: 0.4 } });
    s.addText(leftSub, { x: 0.4, y: 2.5, w: 4.4, h: 0.4, fontSize: 14, fontFace: fonts.main, color: colors.textSecondary, align: 'center' });
    leftBullets.forEach((b, i) => {
        s.addText('• ' + b, { x: 0.7, y: 3.05 + i * 0.4, w: 4, h: 0.35, fontSize: 11, fontFace: fonts.main, color: colors.textPrimary });
    });
    // Right card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.0, y: 1.55, w: 4.6, h: 3.35, fill: { color: colors.accentElectric, transparency: 92 }, line: { color: colors.accentElectric, width: 1, transparency: 50 }, rectRadius: 0.15 });
    s.addShape(pptx.shapes.RECTANGLE, { x: 5.0, y: 1.55, w: 4.6, h: 0.05, fill: { color: colors.accentElectric } });
    s.addText(rightTitle, { x: 5.0, y: 1.7, w: 4.6, h: 0.4, fontSize: 14, fontFace: fonts.main, bold: true, color: colors.textPrimary, align: 'center' });
    rightRows.forEach((item, i) => {
        s.addText(item.label, { x: 5.3, y: 2.2 + i * 0.55, w: 2, h: 0.45, fontSize: 12, fontFace: fonts.main, color: colors.textSecondary });
        s.addText(item.value, { x: 7.5, y: 2.2 + i * 0.55, w: 1.8, h: 0.45, fontSize: 14, fontFace: fonts.mono, bold: true, color: i === 0 ? colors.accentElectric : colors.textPrimary, align: 'right' });
    });
    addFooter(pptx, s, source);
    return s;
}

function addProjections(pptx, tag, title, tableTitle, items, bottomText, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 1.5, w: 9.2, h: 3.4, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: colors.glassBorder, width: 1 }, rectRadius: 0.15 });
    s.addText(tableTitle, { x: 0.5, y: 1.65, w: 9, h: 0.4, fontSize: 13, fontFace: fonts.main, bold: true, color: colors.textSecondary, align: 'center' });
    items.forEach((item, i) => {
        const x = 0.8 + i * 2.3;
        s.addText(item.year, { x: x, y: 2.2, w: 2, h: 0.4, fontSize: 14, fontFace: fonts.mono, bold: true, color: colors.accentElectric, align: 'center' });
        s.addText(item.solde, { x: x, y: 2.7, w: 2, h: 0.6, fontSize: 28, fontFace: fonts.mono, bold: true, color: item.soldeColor || colors.accentRed, align: 'center', valign: 'middle' });
        s.addText(item.montant, { x: x, y: 3.4, w: 2, h: 0.4, fontSize: 12, fontFace: fonts.main, color: colors.textSecondary, align: 'center' });
    });
    if (bottomText) {
        s.addText(bottomText, { x: 0.5, y: 4.1, w: 9, h: 0.5, fontSize: 12, fontFace: fonts.main, italic: true, color: colors.textMuted, align: 'center' });
    }
    addFooter(pptx, s, source);
    return s;
}

function addCards2x2(pptx, tag, title, cards, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    if (Array.isArray(title)) {
        s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, valign: 'middle' });
    } else {
        s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
    }
    cards.forEach((item, i) => {
        const x = 0.4 + (i % 2) * 4.7;
        const y = 1.5 + Math.floor(i / 2) * 1.85;
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: 4.5, h: 1.7, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: item.color, width: 1, transparency: 50 }, rectRadius: 0.12 });
        s.addText(item.icon, { x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.6, fontSize: 28 });
        s.addText(item.title, { x: x + 0.9, y: y + 0.25, w: 2, h: 0.4, fontSize: 16, fontFace: fonts.main, bold: true, color: colors.textPrimary });
        s.addText(item.stat, { x: x + 2.8, y: y + 0.25, w: 1.5, h: 0.4, fontSize: 16, fontFace: fonts.mono, bold: true, color: item.color, align: 'right' });
        s.addText(item.desc, { x: x + 0.2, y: y + 0.9, w: 4.1, h: 0.6, fontSize: 11, fontFace: fonts.main, color: colors.textSecondary });
    });
    addFooter(pptx, s, source);
    return s;
}

function addCitation(pptx, tag, quote, author, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.5, w: 8.4, h: 2.5, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: colors.glassBorder, width: 1 }, rectRadius: 0.2, shadow: { type: 'outer', blur: 10, offset: 4, angle: 45, color: '000000', opacity: 0.25 } });
    s.addText('\u201C', { x: 1.0, y: 1.5, w: 1, h: 0.8, fontSize: 72, fontFace: fonts.serif, color: colors.accentElectric, valign: 'top' });
    s.addText(quote, { x: 1.2, y: 2.0, w: 7.6, h: 1.2, fontSize: 20, fontFace: fonts.serif, italic: true, color: colors.textPrimary, align: 'center', valign: 'middle' });
    s.addText(author, { x: 1.2, y: 3.3, w: 7.6, h: 0.4, fontSize: 13, fontFace: fonts.main, color: colors.accentElectric, align: 'center' });
    addFooter(pptx, s, source);
    return s;
}

function addTimeline(pptx, tag, title, items, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
    s.addShape(pptx.shapes.LINE, { x: 2, y: 1.6, w: 0, h: 3.2, line: { color: colors.accentElectric, width: 3 } });
    const spacing = items.length <= 4 ? 0.95 : 0.72;
    items.forEach((item, i) => {
        const y = 1.6 + i * spacing;
        s.addShape(pptx.shapes.OVAL, { x: 1.85, y: y - 0.1, w: 0.3, h: 0.3, fill: { color: item.highlight ? colors.accentElectric : colors.bgElevated }, line: { color: colors.accentElectric, width: 2 } });
        s.addText(item.year, { x: 0.3, y: y - 0.15, w: 1.4, h: 0.4, fontSize: 14, fontFace: fonts.mono, bold: true, color: colors.accentElectric, align: 'right', valign: 'middle' });
        s.addText(item.value, { x: 2.4, y: y - 0.15, w: 2, h: 0.4, fontSize: 18, fontFace: fonts.mono, bold: true, color: item.highlight ? colors.accentGold : colors.textPrimary, valign: 'middle' });
        s.addText(item.event || '', { x: 5, y: y - 0.15, w: 4.5, h: 0.4, fontSize: 11, fontFace: fonts.main, italic: true, color: item.highlight ? colors.accentElectric : colors.textMuted, valign: 'middle' });
    });
    addFooter(pptx, s, source);
    return s;
}

function addScenarios(pptx, tag, title, items, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
    items.forEach((item, i) => {
        const x = 0.5 + i * 3.1;
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x, y: 1.5, w: 2.9, h: 3.3, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: item.color, width: 2 }, rectRadius: 0.15, shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: item.color, opacity: 0.25 } });
        s.addShape(pptx.shapes.OVAL, { x: x + 1.05, y: 1.7, w: 0.8, h: 0.8, fill: { color: item.color }, shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: item.color, opacity: 0.4 } });
        s.addText(item.num, { x: x + 1.05, y: 1.7, w: 0.8, h: 0.8, fontSize: 24, fontFace: fonts.mono, bold: true, color: colors.bgDeep, align: 'center', valign: 'middle' });
        s.addText(item.title, { x: x + 0.15, y: 2.7, w: 2.6, h: 0.5, fontSize: 16, fontFace: fonts.main, bold: true, color: colors.textPrimary, align: 'center' });
        s.addText(item.desc, { x: x + 0.15, y: 3.3, w: 2.6, h: 1.3, fontSize: 11, fontFace: fonts.main, color: colors.textSecondary, align: 'center' });
    });
    addFooter(pptx, s, source);
    return s;
}

// ============================================================
// NOUVEAUX HELPERS — Charts natifs pptxgenjs
// ============================================================

/**
 * Camembert (Pie chart natif)
 * @param {object} pptx - instance pptxgenjs
 * @param {string} tag - tag thématique
 * @param {string} title - titre de la slide
 * @param {Array<{label: string, value: number, color: string}>} slices
 * @param {string} source
 */
function addPieChart(pptx, tag, title, slices, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });

    const data = [{
        name: 'Data',
        labels: slices.map(sl => sl.label),
        values: slices.map(sl => sl.value)
    }];

    s.addChart(pptx.charts.PIE, data, chartBaseOpts({
        x: 1.5, y: 1.6, w: 7, h: 3.3,
        showLegend: true,
        legendPos: 'b',
        showPercent: true,
        showValue: false,
        dataLabelColor: colors.textPrimary,
        dataLabelFontFace: fonts.mono,
        dataLabelFontSize: 11,
        chartColors: slices.map(sl => sl.color.replace('#', '')),
        catGridLine: undefined,
        valGridLine: undefined,
        catAxisLineShow: undefined,
        valAxisLineShow: undefined,
    }));

    addFooter(pptx, s, source);
    return s;
}

/**
 * Donut avec stat centrale
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {Array<{label: string, value: number, color: string}>} slices
 * @param {string} centerValue - valeur affichée au centre
 * @param {string} centerLabel - label sous la valeur
 * @param {string} source
 */
function addDonutChart(pptx, tag, title, slices, centerValue, centerLabel, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });

    const data = [{
        name: 'Data',
        labels: slices.map(sl => sl.label),
        values: slices.map(sl => sl.value)
    }];

    s.addChart(pptx.charts.DOUGHNUT, data, chartBaseOpts({
        x: 0.5, y: 1.5, w: 5, h: 3.5,
        holeSize: 65,
        showLegend: false,
        showPercent: true,
        dataLabelColor: colors.textPrimary,
        dataLabelFontFace: fonts.mono,
        dataLabelFontSize: 10,
        chartColors: slices.map(sl => sl.color.replace('#', '')),
        catGridLine: undefined,
        valGridLine: undefined,
    }));

    // Center value overlay
    s.addText(centerValue, { x: 1.5, y: 2.7, w: 3, h: 0.8, fontSize: 36, fontFace: fonts.mono, bold: true, color: colors.textPrimary, align: 'center', valign: 'middle' });
    s.addText(centerLabel, { x: 1.5, y: 3.4, w: 3, h: 0.4, fontSize: 12, fontFace: fonts.main, color: colors.textSecondary, align: 'center' });

    // Legend on the right
    slices.forEach((sl, i) => {
        const y = 1.7 + i * 0.55;
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.8, y: y, w: 3.8, h: 0.45, fill: { color: colors.bgElevated, transparency: 15 }, line: { color: colors.glassBorder, width: 1 }, rectRadius: 0.08 });
        s.addShape(pptx.shapes.RECTANGLE, { x: 5.95, y: y + 0.12, w: 0.22, h: 0.22, fill: { color: sl.color.replace('#', '') } });
        s.addText(sl.label, { x: 6.3, y: y, w: 2, h: 0.45, fontSize: 11, fontFace: fonts.main, color: colors.textPrimary, valign: 'middle' });
        s.addText(sl.value + '%', { x: 8.4, y: y, w: 1, h: 0.45, fontSize: 12, fontFace: fonts.mono, bold: true, color: sl.color.replace('#', ''), align: 'right', valign: 'middle' });
    });

    addFooter(pptx, s, source);
    return s;
}

/**
 * Courbes temporelles (Line chart natif)
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {string} subtitle
 * @param {Array<{name: string, values: number[], color: string}>} series
 * @param {string[]} categories - labels axe X
 * @param {string} source
 */
function addLineChart(pptx, tag, title, subtitle, series, categories, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
    if (subtitle) {
        s.addText(subtitle, { x: 0.4, y: 1.4, w: 9, h: 0.3, fontSize: 12, fontFace: fonts.main, color: colors.textSecondary, valign: 'middle' });
    }

    const data = series.map(sr => ({
        name: sr.name,
        labels: categories,
        values: sr.values
    }));

    s.addChart(pptx.charts.LINE, data, chartBaseOpts({
        y: subtitle ? 1.8 : 1.6,
        lineSize: 3,
        lineSmooth: true,
        showMarker: true,
        markerSize: 8,
        chartColors: series.map(sr => sr.color.replace('#', '')),
    }));

    addFooter(pptx, s, source);
    return s;
}

/**
 * Surface remplie (Area chart natif)
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {string} subtitle
 * @param {Array<{name: string, values: number[], color: string}>} series
 * @param {string[]} categories
 * @param {string} source
 */
function addAreaChart(pptx, tag, title, subtitle, series, categories, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
    if (subtitle) {
        s.addText(subtitle, { x: 0.4, y: 1.4, w: 9, h: 0.3, fontSize: 12, fontFace: fonts.main, color: colors.textSecondary, valign: 'middle' });
    }

    const data = series.map(sr => ({
        name: sr.name,
        labels: categories,
        values: sr.values
    }));

    s.addChart(pptx.charts.AREA, data, chartBaseOpts({
        y: subtitle ? 1.8 : 1.6,
        opacity: 50,
        chartColors: series.map(sr => sr.color.replace('#', '')),
    }));

    addFooter(pptx, s, source);
    return s;
}

/**
 * Nuage de points (Scatter chart natif)
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {string} subtitle
 * @param {Array<{name: string, values: Array<{x: number, y: number}>, color: string}>} series
 * @param {string} source
 */
function addScatterChart(pptx, tag, title, subtitle, series, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, valign: 'middle' });
    if (subtitle) {
        s.addText(subtitle, { x: 0.4, y: 1.4, w: 9, h: 0.3, fontSize: 12, fontFace: fonts.main, color: colors.textSecondary, valign: 'middle' });
    }

    // pptxgenjs scatter format: first element = X-axis, subsequent = Y-series
    const data = [];
    // Use first series X values as shared X axis
    if (series.length > 0) {
        data.push({ name: 'X', values: series[0].values.map(v => v.x) });
        series.forEach(sr => {
            data.push({ name: sr.name, values: sr.values.map(v => v.y) });
        });
    }

    s.addChart(pptx.charts.SCATTER, data, chartBaseOpts({
        y: subtitle ? 1.8 : 1.6,
        showMarker: true,
        markerSize: 10,
        lineSize: 0,
        chartColors: series.map(sr => sr.color.replace('#', '')),
    }));

    addFooter(pptx, s, source);
    return s;
}

/**
 * Radar / araignée (Radar chart natif)
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {string[]} axes - labels des axes
 * @param {Array<{name: string, values: number[], color: string}>} series
 * @param {string} source
 */
function addRadarChart(pptx, tag, title, axes, series, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });

    const data = series.map(sr => ({
        name: sr.name,
        labels: axes,
        values: sr.values
    }));

    s.addChart(pptx.charts.RADAR, data, chartBaseOpts({
        x: 1, y: 1.5, w: 8, h: 3.5,
        radarStyle: 'filled',
        chartColors: series.map(sr => sr.color.replace('#', '')),
        opacity: 40,
        catGridLine: undefined,
        valGridLine: undefined,
    }));

    addFooter(pptx, s, source);
    return s;
}

// ============================================================
// NOUVEAUX HELPERS — Charts manuels (shapes)
// ============================================================

/**
 * Barres empilées verticales
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {string[]} categories - labels axe X
 * @param {Array<{name: string, values: number[], color: string}>} series
 * @param {string} source
 */
function addStackedBars(pptx, tag, title, categories, series, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });

    const chartX = 1.2, chartY = 1.6, chartW = 7.5, chartH = 2.8;
    const barW = Math.min(0.9, (chartW / categories.length) * 0.7);
    const gap = (chartW - barW * categories.length) / (categories.length + 1);

    // Compute totals for scaling
    const totals = categories.map((_, ci) => series.reduce((sum, sr) => sum + sr.values[ci], 0));
    const maxTotal = Math.max(...totals);

    categories.forEach((cat, ci) => {
        const barX = chartX + gap + ci * (barW + gap);
        let cumY = 0;

        series.forEach((sr) => {
            const segH = (sr.values[ci] / maxTotal) * chartH;
            const yPos = chartY + chartH - cumY - segH;

            s.addShape(pptx.shapes.RECTANGLE, {
                x: barX, y: yPos, w: barW, h: segH,
                fill: { color: sr.color.replace('#', '') }
            });

            // Value label inside segment if tall enough
            if (segH > 0.25) {
                s.addText(String(sr.values[ci]), {
                    x: barX, y: yPos, w: barW, h: segH,
                    fontSize: 9, fontFace: fonts.mono, bold: true,
                    color: colors.bgDeep, align: 'center', valign: 'middle'
                });
            }

            cumY += segH;
        });

        // Category label below
        s.addText(cat, {
            x: barX - 0.1, y: chartY + chartH + 0.08, w: barW + 0.2, h: 0.35,
            fontSize: 10, fontFace: fonts.main, color: colors.textSecondary, align: 'center'
        });
    });

    // Legend
    const legendY = 4.65;
    series.forEach((sr, i) => {
        const lx = 1.5 + i * 2.5;
        s.addShape(pptx.shapes.RECTANGLE, { x: lx, y: legendY, w: 0.2, h: 0.2, fill: { color: sr.color.replace('#', '') } });
        s.addText(sr.name, { x: lx + 0.3, y: legendY - 0.03, w: 2, h: 0.25, fontSize: 10, fontFace: fonts.main, color: colors.textSecondary, valign: 'middle' });
    });

    addFooter(pptx, s, source);
    return s;
}

/**
 * Barres groupées verticales
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {string[]} categories
 * @param {Array<{name: string, values: number[], color: string}>} series
 * @param {string} source
 */
function addGroupedBars(pptx, tag, title, categories, series, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });

    const chartX = 1.2, chartY = 1.6, chartW = 7.5, chartH = 2.8;
    const nSeries = series.length;
    const singleBarW = Math.min(0.5, (chartW / categories.length) * 0.6 / nSeries);
    const groupW = singleBarW * nSeries + 0.05 * (nSeries - 1);
    const gap = (chartW - groupW * categories.length) / (categories.length + 1);

    const allVals = series.flatMap(sr => sr.values);
    const maxVal = Math.max(...allVals);

    categories.forEach((cat, ci) => {
        const groupX = chartX + gap + ci * (groupW + gap);

        series.forEach((sr, si) => {
            const barX = groupX + si * (singleBarW + 0.05);
            const barH = (sr.values[ci] / maxVal) * chartH;
            const yPos = chartY + chartH - barH;

            s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
                x: barX, y: yPos, w: singleBarW, h: barH,
                fill: { color: sr.color.replace('#', '') },
                rectRadius: 0.04,
                shadow: { type: 'outer', blur: 3, offset: 0, angle: 0, color: sr.color.replace('#', ''), opacity: 0.3 }
            });

            // Value above bar
            s.addText(String(sr.values[ci]), {
                x: barX - 0.1, y: yPos - 0.3, w: singleBarW + 0.2, h: 0.25,
                fontSize: 9, fontFace: fonts.mono, bold: true, color: sr.color.replace('#', ''), align: 'center'
            });
        });

        // Category label
        s.addText(cat, {
            x: groupX - 0.1, y: chartY + chartH + 0.08, w: groupW + 0.2, h: 0.35,
            fontSize: 10, fontFace: fonts.main, color: colors.textSecondary, align: 'center'
        });
    });

    // Legend
    const legendY = 4.65;
    series.forEach((sr, i) => {
        const lx = 1.5 + i * 2.5;
        s.addShape(pptx.shapes.RECTANGLE, { x: lx, y: legendY, w: 0.2, h: 0.2, fill: { color: sr.color.replace('#', '') } });
        s.addText(sr.name, { x: lx + 0.3, y: legendY - 0.03, w: 2, h: 0.25, fontSize: 10, fontFace: fonts.main, color: colors.textSecondary, valign: 'middle' });
    });

    addFooter(pptx, s, source);
    return s;
}

/**
 * Waterfall / Cascade
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {Array<{label: string, value: number, type: 'positive'|'negative'|'total'}>} items
 * @param {string} source
 */
function addWaterfall(pptx, tag, title, items, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });

    const chartX = 0.8, chartY = 1.6, chartW = 8.4, chartH = 2.8;
    const barW = Math.min(0.9, (chartW / items.length) * 0.7);
    const gap = (chartW - barW * items.length) / (items.length + 1);

    // Compute running total and find range
    let running = 0;
    const positions = items.map(item => {
        if (item.type === 'total') {
            const pos = { start: 0, end: running, value: running };
            return pos;
        }
        const start = running;
        running += item.value;
        return { start, end: running, value: item.value };
    });

    const allValues = positions.flatMap(p => [p.start, p.end]);
    const minVal = Math.min(0, ...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;

    function valToY(v) {
        return chartY + chartH - ((v - minVal) / range) * chartH;
    }

    items.forEach((item, i) => {
        const x = chartX + gap + i * (barW + gap);
        const pos = positions[i];

        let topVal, botVal, barColor;
        if (item.type === 'total') {
            topVal = Math.max(0, pos.end);
            botVal = Math.min(0, pos.end);
            barColor = colors.accentElectric;
        } else if (item.type === 'positive' || item.value >= 0) {
            topVal = pos.end;
            botVal = pos.start;
            barColor = colors.accentGreen;
        } else {
            topVal = pos.start;
            botVal = pos.end;
            barColor = colors.accentRed;
        }

        const yTop = valToY(topVal);
        const yBot = valToY(botVal);
        const barH = Math.max(yBot - yTop, 0.05);

        s.addShape(pptx.shapes.RECTANGLE, {
            x, y: yTop, w: barW, h: barH,
            fill: { color: barColor },
            shadow: { type: 'outer', blur: 4, offset: 0, angle: 0, color: barColor, opacity: 0.3 }
        });

        // Value above/below bar
        const valueText = (item.type === 'total' ? '' : item.value > 0 ? '+' : '') + String(item.value);
        s.addText(valueText, {
            x: x - 0.15, y: yTop - 0.3, w: barW + 0.3, h: 0.25,
            fontSize: 10, fontFace: fonts.mono, bold: true, color: barColor, align: 'center'
        });

        // Connector line to next bar
        if (i < items.length - 1 && items[i + 1].type !== 'total') {
            const nextX = chartX + gap + (i + 1) * (barW + gap);
            s.addShape(pptx.shapes.LINE, {
                x: x + barW, y: valToY(pos.end), w: nextX - x - barW, h: 0,
                line: { color: colors.textMuted, width: 1, dashType: 'dash' }
            });
        }

        // Label below
        s.addText(item.label, {
            x: x - 0.2, y: chartY + chartH + 0.08, w: barW + 0.4, h: 0.4,
            fontSize: 9, fontFace: fonts.main, color: colors.textSecondary, align: 'center'
        });
    });

    // Zero line
    if (minVal < 0) {
        const zeroY = valToY(0);
        s.addShape(pptx.shapes.LINE, {
            x: chartX, y: zeroY, w: chartW, h: 0,
            line: { color: colors.textMuted, width: 1 }
        });
    }

    addFooter(pptx, s, source);
    return s;
}

/**
 * Jauge semi-circulaire
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {number} value
 * @param {number} maxValue
 * @param {number} threshold - seuil d'alerte (optionnel)
 * @param {string} thresholdLabel
 * @param {string} color - couleur de la jauge (hex sans #)
 * @param {string} source
 */
function addGauge(pptx, tag, title, value, maxValue, threshold, thresholdLabel, color, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });

    const cleanColor = color.replace('#', '');

    // Semi-circular gauge using DOUGHNUT chart
    const pct = Math.min(value / maxValue, 1) * 50; // 50% of circle = top semi
    const empty = 50 - pct;
    const data = [{
        name: 'Gauge',
        labels: ['Valeur', 'Vide', ' '],
        values: [pct, empty, 50]
    }];

    s.addChart(pptx.charts.DOUGHNUT, data, {
        x: 1.5, y: 1.3, w: 7, h: 3.5,
        holeSize: 65,
        chartColors: [cleanColor, colors.bgElevated, colors.bgDeep],
        showLegend: false,
        showPercent: false,
        showValue: false,
        dataLabelPosition: 'none',
        firstSliceAng: 270,
        plotArea: { fill: { color: colors.bgDeep } },
    });

    // Value text overlay in center of gauge
    s.addText(String(value), {
        x: 3, y: 2.4, w: 4, h: 1.0,
        fontSize: 56, fontFace: fonts.mono, bold: true, color: cleanColor,
        align: 'center', valign: 'middle',
        shadow: { type: 'outer', blur: 10, offset: 0, angle: 0, color: cleanColor, opacity: 0.4 }
    });
    s.addText('/ ' + maxValue, {
        x: 3, y: 3.3, w: 4, h: 0.4,
        fontSize: 16, fontFace: fonts.main, color: colors.textSecondary, align: 'center'
    });

    // Threshold indicator
    if (threshold) {
        s.addText((thresholdLabel || 'Seuil : ' + threshold), {
            x: 3, y: 3.8, w: 4, h: 0.3,
            fontSize: 11, fontFace: fonts.main, italic: true,
            color: colors.accentRed, align: 'center'
        });
    }

    addFooter(pptx, s, source);
    return s;
}

/**
 * Slope chart (pente avant/après)
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {string} leftLabel - label colonne gauche
 * @param {string} rightLabel - label colonne droite
 * @param {Array<{name: string, leftValue: number, rightValue: number, color: string}>} items
 * @param {string} source
 */
function addSlopeChart(pptx, tag, title, leftLabel, rightLabel, items, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });

    const leftX = 2.0, rightX = 8.0;
    const topY = 1.9, chartH = 2.6;

    // Column headers
    s.addText(leftLabel, { x: leftX - 1, y: 1.55, w: 2, h: 0.3, fontSize: 13, fontFace: fonts.main, bold: true, color: colors.accentElectric, align: 'center' });
    s.addText(rightLabel, { x: rightX - 1, y: 1.55, w: 2, h: 0.3, fontSize: 13, fontFace: fonts.main, bold: true, color: colors.accentElectric, align: 'center' });

    // Vertical axis lines
    s.addShape(pptx.shapes.LINE, { x: leftX, y: topY, w: 0, h: chartH, line: { color: colors.glassBorder, width: 2 } });
    s.addShape(pptx.shapes.LINE, { x: rightX, y: topY, w: 0, h: chartH, line: { color: colors.glassBorder, width: 2 } });

    // Scale
    const allVals = items.flatMap(it => [it.leftValue, it.rightValue]);
    const minVal = Math.min(...allVals);
    const maxVal = Math.max(...allVals);
    const range = maxVal - minVal || 1;

    function valToY(v) {
        return topY + chartH - ((v - minVal) / range) * chartH;
    }

    items.forEach((item) => {
        const cleanColor = item.color.replace('#', '');
        const ly = valToY(item.leftValue);
        const ry = valToY(item.rightValue);

        // Dots
        s.addShape(pptx.shapes.OVAL, { x: leftX - 0.1, y: ly - 0.1, w: 0.2, h: 0.2, fill: { color: cleanColor } });
        s.addShape(pptx.shapes.OVAL, { x: rightX - 0.1, y: ry - 0.1, w: 0.2, h: 0.2, fill: { color: cleanColor } });

        // Connecting line
        s.addShape(pptx.shapes.LINE, {
            x: leftX + 0.1, y: ly, w: rightX - leftX - 0.2, h: ry - ly,
            line: { color: cleanColor, width: 2 }
        });

        // Labels
        s.addText(item.name + ' ' + item.leftValue, {
            x: leftX - 2, y: ly - 0.15, w: 1.8, h: 0.3,
            fontSize: 10, fontFace: fonts.mono, color: cleanColor, align: 'right', valign: 'middle'
        });
        s.addText(item.rightValue + ' ' + item.name, {
            x: rightX + 0.2, y: ry - 0.15, w: 1.8, h: 0.3,
            fontSize: 10, fontFace: fonts.mono, color: cleanColor, align: 'left', valign: 'middle'
        });
    });

    addFooter(pptx, s, source);
    return s;
}

/**
 * Treemap proportionnel
 * @param {object} pptx
 * @param {string} tag
 * @param {string} title
 * @param {Array<{label: string, value: number, color: string}>} items
 * @param {string} source
 */
function addTreemap(pptx, tag, title, items, source) {
    const s = pptx.addSlide();
    addBackground(pptx, s);
    addHeader(pptx, s, tag);
    s.addText(title, { x: 0.4, y: 0.95, w: 9, h: 0.5, fontSize: 26, fontFace: fonts.serif, color: colors.textPrimary, align: 'center', valign: 'middle' });

    const mapX = 0.5, mapY = 1.6, mapW = 9, mapH = 3.2;
    const total = items.reduce((sum, it) => sum + it.value, 0);

    // Simple strip treemap layout: split into rows
    const sorted = [...items].sort((a, b) => b.value - a.value);
    let currentY = mapY;
    let remaining = [...sorted];

    while (remaining.length > 0) {
        // Determine how many items fit in this row
        const rowItems = [];
        let rowTotal = 0;
        const targetRowH = mapH * (remaining.reduce((s, r) => s + r.value, 0) / total);

        // Take items until row is roughly square-ish
        let cumPct = 0;
        for (let i = 0; i < remaining.length; i++) {
            rowItems.push(remaining[i]);
            cumPct += remaining[i].value / total;
            // Stop when we have enough items for ~1 row height
            if (cumPct >= 0.3 || rowItems.length >= 4) break;
        }
        remaining = remaining.slice(rowItems.length);

        const rowPct = rowItems.reduce((s, r) => s + r.value, 0) / total;
        const rowH = mapH * rowPct;

        let currentX = mapX;
        const rowTotal2 = rowItems.reduce((s, r) => s + r.value, 0);

        rowItems.forEach((item) => {
            const cellW = mapW * (item.value / rowTotal2);
            const cleanColor = item.color.replace('#', '');

            s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
                x: currentX + 0.02, y: currentY + 0.02,
                w: cellW - 0.04, h: rowH - 0.04,
                fill: { color: cleanColor, transparency: 20 },
                line: { color: cleanColor, width: 1 },
                rectRadius: 0.08
            });

            // Label and value
            const labelSize = cellW > 2 ? 12 : 10;
            const valSize = cellW > 2 ? 16 : 12;
            s.addText(item.label, {
                x: currentX + 0.1, y: currentY + 0.1, w: cellW - 0.2, h: rowH * 0.45,
                fontSize: labelSize, fontFace: fonts.main, bold: true,
                color: colors.textPrimary, valign: 'bottom'
            });
            s.addText(String(item.value), {
                x: currentX + 0.1, y: currentY + rowH * 0.45, w: cellW - 0.2, h: rowH * 0.45,
                fontSize: valSize, fontFace: fonts.mono, bold: true,
                color: cleanColor, valign: 'top'
            });

            currentX += cellW;
        });

        currentY += rowH;
    }

    addFooter(pptx, s, source);
    return s;
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    colors,
    fonts,
    chartPalette,
    // Utilitaires
    addBackground,
    addHeader,
    addFooter,
    // Helpers existants
    addTransition,
    addChiffreCle,
    addPointsCles,
    addBars,
    addFocus2Col,
    addProjections,
    addCards2x2,
    addCitation,
    addTimeline,
    addScenarios,
    // Nouveaux — natifs
    addPieChart,
    addDonutChart,
    addLineChart,
    addAreaChart,
    addScatterChart,
    addRadarChart,
    // Nouveaux — manuels
    addStackedBars,
    addGroupedBars,
    addWaterfall,
    addGauge,
    addSlopeChart,
    addTreemap,
};

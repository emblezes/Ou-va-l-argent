/**
 * Helpers rapport consulting — Style "Où Va l'Argent" (dark theme)
 * Builds on pptx-helpers.js for consistent design language.
 *
 * DIFFÉRENCE avec pptx-helpers.js :
 * - pptx-helpers.js = FORMAT PRÉSENTATION (conférence, visuel, peu de texte)
 * - pptx-report-helpers.js = FORMAT RAPPORT (étude, dense, données + analyses)
 * Les DEUX utilisent le même dark theme et la même charte graphique.
 *
 * Usage:
 *   const pptxgen = require('pptxgenjs');
 *   const r = require('./pptx-report-helpers');
 *   const pptx = new pptxgen();
 *   r.setupReport(pptx);
 *   r.addCover(pptx, 'Titre du rapport', 'Sous-titre', 'Février 2026');
 */

const h = require('./pptx-helpers');
const { colors, fonts } = h;

// ============================================================
// SETUP
// ============================================================

function setupReport(pptx) {
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Où Va l\'Argent — Études';
    pptx.title = 'Rapport';
    pptx.subject = 'Rapport d\'étude';
}

// ============================================================
// UTILITAIRES INTERNES
// ============================================================

/** Slide de contenu complète : bg + header + footer + page number */
function setupContentSlide(pptx, tag, source, pageNum) {
    const s = pptx.addSlide();
    h.addBackground(pptx, s);
    h.addHeader(pptx, s, tag);
    h.addFooter(pptx, s, source);
    if (pageNum) {
        s.addText(String(pageNum), {
            x: 4.5, y: 5.2, w: 1, h: 0.3,
            fontSize: 9, fontFace: fonts.mono,
            color: colors.textMuted, align: 'center', valign: 'middle'
        });
    }
    return s;
}

/** Glass card (glassmorphism container) */
function addGlassCard(pptx, slide, x, y, w, cardH, opts) {
    opts = opts || {};
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x, y, w, h: cardH,
        fill: { color: opts.fill || colors.bgElevated, transparency: opts.transparency || 15 },
        line: { color: opts.border || colors.glassBorder, width: opts.borderWidth || 1, transparency: opts.borderTransparency || 0 },
        rectRadius: opts.radius || 0.12,
        shadow: opts.shadow !== false ? { type: 'outer', blur: 8, offset: 3, angle: 45, color: '000000', opacity: 0.25 } : undefined
    });
}

/** Action title (consulting: the takeaway IS the slide title) */
function addActionTitle(slide, text, y) {
    y = y || 0.95;
    slide.addText(text, {
        x: 0.4, y, w: 9, h: 0.5,
        fontSize: 22, fontFace: fonts.serif,
        color: colors.textPrimary, valign: 'middle'
    });
}

/** Chart base options for dark theme */
function chartBaseOpts(overrides) {
    return Object.assign({
        x: 0.4, y: 1.5, w: 5.5, h: 3.4,
        showLegend: true,
        legendPos: 'b',
        legendFontSize: 9,
        legendColor: colors.textSecondary,
        legendFontFace: fonts.main,
        plotArea: { fill: { color: colors.bgDeep } },
        catAxisLabelColor: colors.textSecondary,
        catAxisLabelFontFace: fonts.main,
        catAxisLabelFontSize: 9,
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
// SLIDES STRUCTURELLES
// ============================================================

/**
 * Couverture du rapport
 */
function addCover(pptx, title, subtitle, date, author) {
    const s = pptx.addSlide();
    h.addBackground(pptx, s);

    // Logo (top left, large)
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.6, y: 0.5, w: 0.65, h: 0.65,
        fill: { color: colors.accentElectric },
        rectRadius: 0.1,
        shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.4 }
    });
    s.addText('€', {
        x: 0.6, y: 0.5, w: 0.65, h: 0.65,
        fontSize: 30, fontFace: fonts.mono, bold: true,
        color: colors.bgDeep, align: 'center', valign: 'middle'
    });
    s.addText('Où Va l\'Argent', {
        x: 1.4, y: 0.55, w: 2.5, h: 0.55,
        fontSize: 18, fontFace: fonts.main, bold: true,
        color: colors.textPrimary, valign: 'middle'
    });

    // ÉTUDES tag
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 4.1, y: 0.57, w: 1.2, h: 0.4,
        fill: { color: colors.accentElectric, transparency: 85 },
        line: { color: colors.accentElectric, width: 1, transparency: 70 },
        rectRadius: 0.2
    });
    s.addText('ÉTUDES', {
        x: 4.1, y: 0.57, w: 1.2, h: 0.4,
        fontSize: 9, fontFace: fonts.main, bold: true,
        color: colors.accentElectric, align: 'center', valign: 'middle'
    });

    // Title (left-aligned, serif)
    s.addText(title, {
        x: 0.6, y: 1.8, w: 8.8, h: 1.5,
        fontSize: 34, fontFace: fonts.serif,
        color: colors.textPrimary, valign: 'middle'
    });

    // Cyan accent line under title
    s.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6, y: 3.4, w: 1.5, h: 0.05,
        fill: { color: colors.accentElectric },
        shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.5 }
    });

    // Subtitle
    if (subtitle) {
        s.addText(subtitle, {
            x: 0.6, y: 3.6, w: 8.8, h: 0.6,
            fontSize: 16, fontFace: fonts.main,
            color: colors.accentElectric, valign: 'middle'
        });
    }

    // Date + author
    const meta = [date, author].filter(Boolean).join(' — ');
    s.addText(meta, {
        x: 0.6, y: 4.8, w: 8.8, h: 0.4,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textSecondary, valign: 'middle'
    });

    // ouvalargent.fr
    s.addText('ouvalargent.fr', {
        x: 7.5, y: 5.0, w: 2.1, h: 0.3,
        fontSize: 11, fontFace: fonts.mono, bold: true,
        color: colors.accentElectric, align: 'right', valign: 'middle'
    });

    return s;
}

/**
 * Table des matières
 * @param {Array<{num: string, title: string, page?: number}>} items
 */
function addTOC(pptx, items) {
    const s = setupContentSlide(pptx, 'Sommaire', null, null);

    s.addText('Sommaire', {
        x: 0.4, y: 0.95, w: 9, h: 0.5,
        fontSize: 28, fontFace: fonts.serif,
        color: colors.textPrimary, valign: 'middle'
    });

    // Glass card container
    addGlassCard(pptx, s, 0.5, 1.55, 9, 3.3);

    items.forEach((item, i) => {
        const y = 1.7 + i * 0.42;

        // Number (cyan mono)
        s.addText(item.num, {
            x: 0.7, y, w: 0.6, h: 0.35,
            fontSize: 14, fontFace: fonts.mono, bold: true,
            color: colors.accentElectric, valign: 'middle'
        });

        // Title
        s.addText(item.title, {
            x: 1.4, y, w: 6.5, h: 0.35,
            fontSize: 13, fontFace: fonts.main,
            color: colors.textPrimary, valign: 'middle'
        });

        // Dotted separator
        s.addShape(pptx.shapes.LINE, {
            x: 1.4, y: y + 0.35, w: 7.3, h: 0,
            line: { color: colors.glassBorder, width: 0.5, dashType: 'dot' }
        });

        // Page number
        if (item.page) {
            s.addText(String(item.page), {
                x: 8.5, y, w: 0.8, h: 0.35,
                fontSize: 12, fontFace: fonts.mono,
                color: colors.textMuted, align: 'right', valign: 'middle'
            });
        }
    });

    return s;
}

/**
 * Divider de section (grand numéro + titre)
 * Réutilise addTransition de pptx-helpers
 */
function addSectionDivider(pptx, num, title, subtitle) {
    return h.addTransition(pptx, String(num).padStart(2, '0'), title, subtitle || '', colors.accentElectric);
}

/**
 * Back cover (dernière page)
 */
function addBackCover(pptx, contactInfo) {
    const s = pptx.addSlide();
    h.addBackground(pptx, s);

    // Logo centered with glow
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 4.4, y: 1.5, w: 0.8, h: 0.8,
        fill: { color: colors.accentElectric },
        rectRadius: 0.12,
        shadow: { type: 'outer', blur: 10, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.5 }
    });
    s.addText('€', {
        x: 4.4, y: 1.5, w: 0.8, h: 0.8,
        fontSize: 36, fontFace: fonts.mono, bold: true,
        color: colors.bgDeep, align: 'center', valign: 'middle'
    });
    s.addText('Où Va l\'Argent', {
        x: 5.3, y: 1.6, w: 2.5, h: 0.6,
        fontSize: 22, fontFace: fonts.main, bold: true,
        color: colors.textPrimary, valign: 'middle'
    });

    // "Merci !" with glow
    s.addText('Merci !', {
        x: 0.5, y: 2.6, w: 9, h: 0.8,
        fontSize: 48, fontFace: fonts.serif, italic: true,
        color: colors.textPrimary, align: 'center', valign: 'middle',
        shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.3 }
    });

    s.addText('Des questions ?', {
        x: 0.5, y: 3.5, w: 9, h: 0.4,
        fontSize: 18, fontFace: fonts.main,
        color: colors.textSecondary, align: 'center', valign: 'middle'
    });

    // Contact card
    addGlassCard(pptx, s, 3, 4.1, 4, 0.8);
    s.addText([
        { text: 'ouvalargent.fr', options: { color: colors.accentElectric, bold: true } },
        { text: '\n' + (contactInfo || '@ouvalargent'), options: { color: colors.textSecondary } }
    ], {
        x: 3, y: 4.1, w: 4, h: 0.8,
        fontSize: 14, fontFace: fonts.mono, align: 'center', valign: 'middle'
    });

    return s;
}

// ============================================================
// SLIDES DE CONTENU (haute densité)
// ============================================================

/**
 * Executive Summary — insight principal + 3-5 points clés
 * @param {string} actionTitle - le takeaway principal (titre de la slide)
 * @param {Array<{title: string, desc: string}>} points
 */
function addExecSummary(pptx, actionTitle, tag, points, source, pageNum) {
    const s = setupContentSlide(pptx, tag, source, pageNum);
    addActionTitle(s, actionTitle);

    const spacing = points.length <= 3 ? 1.0 : 0.78;

    points.forEach((p, i) => {
        const y = 1.6 + i * spacing;
        const barColors = [colors.accentElectric, colors.accentGold, colors.accentGreen, colors.accentPurple];

        // Glass card row
        addGlassCard(pptx, s, 0.5, y, 9, spacing - 0.1, { shadow: false });

        // Colored left border with glow
        s.addShape(pptx.shapes.RECTANGLE, {
            x: 0.5, y, w: 0.06, h: spacing - 0.1,
            fill: { color: barColors[i % 4] },
            shadow: { type: 'outer', blur: 4, offset: 0, angle: 0, color: barColors[i % 4], opacity: 0.4 }
        });

        // Title (bold, white)
        s.addText(p.title, {
            x: 0.75, y: y + 0.05, w: 8.5, h: 0.35,
            fontSize: 13, fontFace: fonts.main, bold: true,
            color: colors.textPrimary, valign: 'middle'
        });

        // Description (secondary)
        s.addText(p.desc, {
            x: 0.75, y: y + 0.38, w: 8.5, h: 0.32,
            fontSize: 10, fontFace: fonts.main,
            color: colors.textSecondary, valign: 'top'
        });
    });

    return s;
}

/**
 * KPI Dashboard — 4 à 6 métriques clés en grille
 * @param {Array<{label: string, value: string, delta?: string, deltaColor?: string, context?: string}>} kpis
 */
function addKPIDashboard(pptx, actionTitle, tag, kpis, source, pageNum) {
    const s = setupContentSlide(pptx, tag, source, pageNum);
    addActionTitle(s, actionTitle);

    const cols = Math.min(kpis.length, 3);
    const rowCount = Math.ceil(kpis.length / cols);
    const cardW = (9 - 0.3 * (cols - 1)) / cols;
    const cardH = rowCount === 1 ? 3.0 : 1.45;

    kpis.forEach((kpi, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 0.5 + col * (cardW + 0.3);
        const y = 1.6 + row * (cardH + 0.25);

        // Glass card
        addGlassCard(pptx, s, x, y, cardW, cardH);

        // Cyan top accent with glow
        s.addShape(pptx.shapes.RECTANGLE, {
            x, y, w: cardW, h: 0.04,
            fill: { color: colors.accentElectric },
            shadow: { type: 'outer', blur: 4, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.3 }
        });

        // Label
        s.addText(kpi.label, {
            x: x + 0.15, y: y + 0.12, w: cardW - 0.3, h: 0.25,
            fontSize: 9, fontFace: fonts.main,
            color: colors.textSecondary, valign: 'middle'
        });

        // Big value (mono, bold)
        s.addText(kpi.value, {
            x: x + 0.15, y: y + 0.35, w: cardW - 0.3, h: 0.55,
            fontSize: 24, fontFace: fonts.mono, bold: true,
            color: colors.textPrimary, valign: 'middle',
            shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.15 }
        });

        // Delta (variation)
        if (kpi.delta) {
            const deltaColor = (kpi.deltaColor || colors.accentGreen).replace('#', '');
            s.addText(kpi.delta, {
                x: x + 0.15, y: y + 0.9, w: cardW - 0.3, h: 0.22,
                fontSize: 9, fontFace: fonts.mono, bold: true,
                color: deltaColor, valign: 'middle'
            });
        }

        // Context
        if (kpi.context) {
            s.addText(kpi.context, {
                x: x + 0.15, y: y + cardH - 0.3, w: cardW - 0.3, h: 0.22,
                fontSize: 8, fontFace: fonts.main, italic: true,
                color: colors.textMuted, valign: 'middle'
            });
        }
    });

    return s;
}

/**
 * Data Table — tableau de données complet
 * @param {string[]} headers
 * @param {string[][]} rows
 * @param {object} opts - { highlightRow?: number }
 */
function addDataTable(pptx, actionTitle, tag, headers, rows, source, pageNum, opts) {
    opts = opts || {};
    const s = setupContentSlide(pptx, tag, source, pageNum);
    addActionTitle(s, actionTitle);

    // Build table rows
    const tableRows = [];

    // Header row (cyan background, dark text)
    tableRows.push(headers.map(hdr => ({
        text: hdr,
        options: {
            fill: { color: colors.accentElectric },
            color: colors.bgDeep,
            fontSize: 10, fontFace: fonts.main, bold: true,
            align: 'center', valign: 'middle',
            border: { type: 'solid', pt: 0.5, color: colors.glassBorder }
        }
    })));

    // Data rows (alternating dark backgrounds)
    rows.forEach((row, ri) => {
        const isHighlight = opts.highlightRow === ri;
        const bgColor = isHighlight ? '0d2040' : (ri % 2 === 0 ? '0d1420' : colors.bgSurface);

        tableRows.push(row.map((cell, ci) => ({
            text: String(cell),
            options: {
                fill: { color: bgColor },
                color: isHighlight ? colors.accentElectric : colors.textPrimary,
                fontSize: 10, fontFace: ci === 0 ? fonts.main : fonts.mono,
                bold: isHighlight,
                align: ci === 0 ? 'left' : 'center',
                valign: 'middle',
                border: { type: 'solid', pt: 0.5, color: colors.glassBorder }
            }
        })));
    });

    const colW = 9 / headers.length;
    s.addTable(tableRows, {
        x: 0.5, y: 1.6,
        w: 9,
        colW: headers.map(() => colW),
        rowH: 0.35
    });

    return s;
}

/**
 * Matrice 2×2 (type BCG / McKinsey)
 * Quadrants: 0=bottom-left (vertueux), 1=bottom-right, 2=top-left, 3=top-right (critiques)
 * @param {Array<{quadrant: 0|1|2|3, label: string, desc: string, color: string}>} items
 * @param {string[]} quadrantLabels - [Q0, Q1, Q2, Q3]
 */
function addMatrix2x2(pptx, actionTitle, tag, axisX, axisY, items, quadrantLabels, source, pageNum) {
    const s = setupContentSlide(pptx, tag, source, pageNum);
    addActionTitle(s, actionTitle);

    // Matrix area (centered)
    const mx = 2.0, my = 1.7, mw = 6.0, mh = 2.8;
    const halfW = mw / 2, halfH = mh / 2;

    // Quadrant positions: Q0=bottom-left, Q1=bottom-right, Q2=top-left, Q3=top-right
    const qPositions = [
        { x: mx, y: my + halfH },
        { x: mx + halfW, y: my + halfH },
        { x: mx, y: my },
        { x: mx + halfW, y: my },
    ];

    // Quadrant background tints (subtle glass)
    const qColors = [colors.accentGreen, colors.accentOrange, colors.accentGold, colors.accentRed];

    for (let q = 0; q < 4; q++) {
        const qp = qPositions[q];
        s.addShape(pptx.shapes.RECTANGLE, {
            x: qp.x + 0.02, y: qp.y + 0.02, w: halfW - 0.04, h: halfH - 0.04,
            fill: { color: qColors[q], transparency: 92 },
            line: { color: colors.glassBorder, width: 0.5 }
        });

        // Quadrant label (top-left corner)
        if (quadrantLabels && quadrantLabels[q]) {
            s.addText(quadrantLabels[q].toUpperCase(), {
                x: qp.x + 0.1, y: qp.y + 0.05, w: halfW - 0.2, h: 0.22,
                fontSize: 8, fontFace: fonts.main, bold: true,
                color: colors.textMuted, valign: 'middle', charSpacing: 1
            });
        }
    }

    // Axes
    s.addShape(pptx.shapes.LINE, {
        x: mx, y: my + halfH, w: mw, h: 0,
        line: { color: colors.textMuted, width: 1.5 }
    });
    s.addShape(pptx.shapes.LINE, {
        x: mx + halfW, y: my, w: 0, h: mh,
        line: { color: colors.textMuted, width: 1.5 }
    });

    // Axis labels
    s.addText(axisX + ' →', {
        x: mx, y: my + mh + 0.1, w: mw, h: 0.25,
        fontSize: 9, fontFace: fonts.main, bold: true,
        color: colors.textSecondary, align: 'center'
    });
    s.addText(axisY + ' →', {
        x: mx - 1.5, y: my, w: 1.2, h: mh,
        fontSize: 9, fontFace: fonts.main, bold: true,
        color: colors.textSecondary, align: 'center', valign: 'middle',
        rotate: 270
    });

    // Items inside quadrants
    items.forEach((item) => {
        const qp = qPositions[item.quadrant];
        const cleanColor = (item.color || colors.accentElectric).replace('#', '');

        const sameQ = items.filter(it => it.quadrant === item.quadrant);
        const idx = sameQ.indexOf(item);

        const ix = qp.x + 0.15 + (idx % 2) * (halfW / 2);
        const iy = qp.y + 0.3 + Math.floor(idx / 2) * 0.85;
        const iw = halfW / 2 - 0.25;

        // Item card
        addGlassCard(pptx, s, ix, iy, iw, 0.7, { border: cleanColor, borderWidth: 1.5, shadow: false });

        s.addText(item.label, {
            x: ix + 0.08, y: iy + 0.04, w: iw - 0.16, h: 0.22,
            fontSize: 10, fontFace: fonts.main, bold: true,
            color: colors.textPrimary, valign: 'middle'
        });

        s.addText(item.desc, {
            x: ix + 0.08, y: iy + 0.28, w: iw - 0.16, h: 0.35,
            fontSize: 7, fontFace: fonts.main,
            color: colors.textSecondary, valign: 'top'
        });
    });

    return s;
}

/**
 * Chart + texte d'analyse (graphique natif à gauche, bullets à droite)
 * @param {string} chartType - 'LINE', 'BAR', 'AREA', 'PIE', 'DOUGHNUT'
 * @param {Array} chartData - données au format pptxgenjs
 * @param {object} chartOpts - options chart pptxgenjs (merged avec dark defaults)
 * @param {Array<{text: string}>} analysis - bullet points d'analyse
 */
function addChartWithAnalysis(pptx, actionTitle, tag, chartType, chartData, chartOpts, analysis, source, pageNum) {
    const s = setupContentSlide(pptx, tag, source, pageNum);
    addActionTitle(s, actionTitle);

    // Chart (left ~60%)
    const mergedOpts = chartBaseOpts(chartOpts || {});
    s.addChart(pptx.charts[chartType], chartData, mergedOpts);

    // Analysis panel (right ~35%)
    if (analysis && analysis.length > 0) {
        addGlassCard(pptx, s, 6.1, 1.5, 3.5, 3.4);

        s.addText('ANALYSE', {
            x: 6.25, y: 1.6, w: 3.2, h: 0.3,
            fontSize: 9, fontFace: fonts.main, bold: true,
            color: colors.accentElectric, valign: 'middle',
            charSpacing: 2
        });

        s.addShape(pptx.shapes.LINE, {
            x: 6.25, y: 1.92, w: 3.0, h: 0,
            line: { color: colors.glassBorder, width: 1 }
        });

        const bulletSpacing = Math.min(0.65, 2.8 / analysis.length);
        analysis.forEach((item, i) => {
            const y = 2.05 + i * bulletSpacing;

            // Colored accent bar
            s.addShape(pptx.shapes.RECTANGLE, {
                x: 6.25, y: y + 0.03, w: 0.05, h: bulletSpacing - 0.1,
                fill: { color: colors.accentElectric }
            });

            s.addText(item.text, {
                x: 6.45, y, w: 2.95, h: bulletSpacing - 0.05,
                fontSize: 9, fontFace: fonts.main,
                color: colors.textPrimary, valign: 'top'
            });
        });
    }

    return s;
}

/**
 * Bridge Chart / Waterfall consulting
 * @param {Array<{label: string, value: number, type: 'start'|'positive'|'negative'|'total'}>} items
 * @param {string} unit - unité (ex: 'Md€')
 */
function addBridgeChart(pptx, actionTitle, tag, items, unit, source, pageNum) {
    const s = setupContentSlide(pptx, tag, source, pageNum);
    addActionTitle(s, actionTitle);

    const chartX = 0.5, chartY = 1.7, chartW = 9, chartH = 2.5;
    const barW = Math.min(0.9, (chartW / items.length) * 0.65);
    const gap = (chartW - barW * items.length) / (items.length + 1);

    // Compute running total
    let running = 0;
    const positions = items.map(item => {
        if (item.type === 'start') {
            running = item.value;
            return { start: 0, end: item.value, value: item.value };
        }
        if (item.type === 'total') {
            return { start: 0, end: running, value: running };
        }
        const start = running;
        running += item.value;
        return { start, end: running, value: item.value };
    });

    const allValues = positions.flatMap(p => [p.start, p.end, 0]);
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;

    function valToY(v) {
        return chartY + chartH - ((v - minVal) / range) * chartH;
    }

    // Unit label
    if (unit) {
        s.addText(unit, {
            x: 0.4, y: 1.5, w: 1, h: 0.22,
            fontSize: 9, fontFace: fonts.main, italic: true,
            color: colors.textMuted
        });
    }

    items.forEach((item, i) => {
        const x = chartX + gap + i * (barW + gap);
        const pos = positions[i];

        let topVal, botVal, barColor;
        if (item.type === 'start' || item.type === 'total') {
            topVal = Math.max(0, pos.end);
            botVal = 0;
            barColor = colors.accentElectric;
        } else if (item.value >= 0) {
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

        // Bar with glow
        s.addShape(pptx.shapes.RECTANGLE, {
            x, y: yTop, w: barW, h: barH,
            fill: { color: barColor },
            shadow: { type: 'outer', blur: 4, offset: 0, angle: 0, color: barColor, opacity: 0.3 }
        });

        // Value above bar
        const prefix = item.type === 'start' || item.type === 'total' ? '' : (item.value > 0 ? '+' : '');
        s.addText(prefix + String(item.value), {
            x: x - 0.15, y: yTop - 0.28, w: barW + 0.3, h: 0.25,
            fontSize: 9, fontFace: fonts.mono, bold: true,
            color: barColor, align: 'center'
        });

        // Connector to next bar
        if (i < items.length - 1 && items[i + 1].type !== 'total' && items[i + 1].type !== 'start') {
            const nextX = chartX + gap + (i + 1) * (barW + gap);
            s.addShape(pptx.shapes.LINE, {
                x: x + barW, y: valToY(pos.end), w: nextX - x - barW, h: 0,
                line: { color: colors.textMuted, width: 1, dashType: 'dash' }
            });
        }

        // Label below
        s.addText(item.label, {
            x: x - 0.2, y: chartY + chartH + 0.08, w: barW + 0.4, h: 0.4,
            fontSize: 8, fontFace: fonts.main,
            color: colors.textSecondary, align: 'center'
        });
    });

    // Zero line
    const zeroY = valToY(0);
    s.addShape(pptx.shapes.LINE, {
        x: chartX, y: zeroY, w: chartW, h: 0,
        line: { color: colors.textMuted, width: 0.5 }
    });

    return s;
}

/**
 * Comparaison multi-colonnes (2-4 scénarios côte à côte)
 * @param {Array<{title: string, color: string, metrics: Array<{label: string, value: string}>}>} columns
 */
function addComparison(pptx, actionTitle, tag, columns, source, pageNum) {
    const s = setupContentSlide(pptx, tag, source, pageNum);
    addActionTitle(s, actionTitle);

    const colW = (9 - 0.3 * (columns.length - 1)) / columns.length;

    columns.forEach((col, i) => {
        const x = 0.5 + i * (colW + 0.3);
        const cleanColor = (col.color || colors.accentElectric).replace('#', '');

        // Glass card
        addGlassCard(pptx, s, x, 1.55, colW, 3.3, { border: cleanColor, borderWidth: 1.5 });

        // Colored top bar with glow
        s.addShape(pptx.shapes.RECTANGLE, {
            x, y: 1.55, w: colW, h: 0.05,
            fill: { color: cleanColor },
            shadow: { type: 'outer', blur: 4, offset: 0, angle: 0, color: cleanColor, opacity: 0.4 }
        });

        // Column title
        s.addText(col.title, {
            x: x + 0.1, y: 1.7, w: colW - 0.2, h: 0.4,
            fontSize: 14, fontFace: fonts.main, bold: true,
            color: colors.textPrimary, align: 'center', valign: 'middle'
        });

        // Separator
        s.addShape(pptx.shapes.LINE, {
            x: x + 0.2, y: 2.15, w: colW - 0.4, h: 0,
            line: { color: colors.glassBorder, width: 1 }
        });

        // Metrics
        col.metrics.forEach((m, mi) => {
            const my = 2.3 + mi * 0.5;

            s.addText(m.label, {
                x: x + 0.15, y: my, w: colW - 0.3, h: 0.2,
                fontSize: 9, fontFace: fonts.main,
                color: colors.textMuted, valign: 'middle'
            });

            s.addText(m.value, {
                x: x + 0.15, y: my + 0.2, w: colW - 0.3, h: 0.25,
                fontSize: 13, fontFace: fonts.mono, bold: true,
                color: colors.textPrimary, valign: 'middle'
            });
        });
    });

    return s;
}

/**
 * Key Takeaways / Recommandations
 * @param {Array<{title: string, desc?: string, color?: string}>} takeaways
 */
function addKeyTakeaways(pptx, actionTitle, tag, takeaways, source, pageNum) {
    const s = setupContentSlide(pptx, tag, source, pageNum);
    addActionTitle(s, actionTitle);

    const spacing = takeaways.length <= 3 ? 1.0 : 0.78;

    takeaways.forEach((t, i) => {
        const y = 1.6 + i * spacing;
        const cleanColor = (t.color || colors.accentElectric).replace('#', '');

        // Glass card
        addGlassCard(pptx, s, 0.5, y, 9, spacing - 0.1, { shadow: false });

        // Colored left border with glow
        s.addShape(pptx.shapes.RECTANGLE, {
            x: 0.5, y, w: 0.06, h: spacing - 0.1,
            fill: { color: cleanColor },
            shadow: { type: 'outer', blur: 4, offset: 0, angle: 0, color: cleanColor, opacity: 0.4 }
        });

        // Number
        s.addText(String(i + 1), {
            x: 0.7, y, w: 0.5, h: spacing - 0.1,
            fontSize: 18, fontFace: fonts.mono, bold: true,
            color: cleanColor, align: 'center', valign: 'middle'
        });

        // Title
        s.addText(t.title, {
            x: 1.3, y: y + 0.05, w: 8, h: 0.35,
            fontSize: 12, fontFace: fonts.main, bold: true,
            color: colors.textPrimary, valign: 'middle'
        });

        // Description
        if (t.desc) {
            s.addText(t.desc, {
                x: 1.3, y: y + 0.38, w: 8, h: 0.3,
                fontSize: 9, fontFace: fonts.main,
                color: colors.textSecondary, valign: 'top'
            });
        }
    });

    return s;
}

/**
 * Slide texte libre (action title + paragraphe structuré dans glass card)
 */
function addTextSlide(pptx, actionTitle, tag, bodyText, source, pageNum) {
    const s = setupContentSlide(pptx, tag, source, pageNum);
    addActionTitle(s, actionTitle);

    // Glass card container
    addGlassCard(pptx, s, 0.4, 1.6, 9.2, 3.3);

    if (typeof bodyText === 'string') {
        s.addText(bodyText, {
            x: 0.6, y: 1.75, w: 8.8, h: 3.0,
            fontSize: 12, fontFace: fonts.main,
            color: colors.textPrimary, valign: 'top',
            lineSpacingMultiple: 1.3
        });
    } else {
        s.addText(bodyText, {
            x: 0.6, y: 1.75, w: 8.8, h: 3.0,
            valign: 'top', lineSpacingMultiple: 1.3
        });
    }

    return s;
}

/**
 * Page de sources / bibliographie
 */
function addSourcesPage(pptx, tag, sources, pageNum) {
    const s = setupContentSlide(pptx, tag || 'Sources', null, pageNum);

    s.addText('Sources & Méthodologie', {
        x: 0.4, y: 0.95, w: 9, h: 0.5,
        fontSize: 24, fontFace: fonts.serif,
        color: colors.textPrimary, valign: 'middle'
    });

    // Glass card container
    addGlassCard(pptx, s, 0.4, 1.5, 9.2, 3.5);

    const spacing = Math.min(0.32, 3.3 / sources.length);

    sources.forEach((src, i) => {
        const y = 1.65 + i * spacing;

        s.addText('[' + (i + 1) + ']', {
            x: 0.6, y, w: 0.4, h: spacing - 0.02,
            fontSize: 9, fontFace: fonts.mono, bold: true,
            color: colors.accentElectric, valign: 'middle'
        });

        s.addText(src, {
            x: 1.05, y, w: 8.3, h: spacing - 0.02,
            fontSize: 9, fontFace: fonts.main,
            color: colors.textPrimary, valign: 'middle'
        });
    });

    return s;
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    colors,
    fonts,
    chartPalette: h.chartPalette,
    // Setup
    setupReport,
    // Structure (rapport)
    addCover,
    addTOC,
    addSectionDivider,
    addBackCover,
    // Contenu haute densité (rapport)
    addExecSummary,
    addKPIDashboard,
    addDataTable,
    addMatrix2x2,
    addChartWithAnalysis,
    addBridgeChart,
    addComparison,
    addKeyTakeaways,
    addTextSlide,
    addSourcesPage,
    // Utilitaires (ré-exportés de pptx-helpers)
    addBackground: h.addBackground,
    addHeader: h.addHeader,
    addFooter: h.addFooter,
    // Graphiques présentation (ré-exportés de pptx-helpers)
    addTransition: h.addTransition,
    addChiffreCle: h.addChiffreCle,
    addPointsCles: h.addPointsCles,
    addBars: h.addBars,
    addFocus2Col: h.addFocus2Col,
    addProjections: h.addProjections,
    addCards2x2: h.addCards2x2,
    addCitation: h.addCitation,
    addTimeline: h.addTimeline,
    addScenarios: h.addScenarios,
    // Graphiques natifs (ré-exportés de pptx-helpers)
    addPieChart: h.addPieChart,
    addDonutChart: h.addDonutChart,
    addLineChart: h.addLineChart,
    addAreaChart: h.addAreaChart,
    addScatterChart: h.addScatterChart,
    addRadarChart: h.addRadarChart,
    // Graphiques manuels (ré-exportés de pptx-helpers)
    addStackedBars: h.addStackedBars,
    addGroupedBars: h.addGroupedBars,
    addWaterfall: h.addWaterfall,
    addGauge: h.addGauge,
    addSlopeChart: h.addSlopeChart,
    addTreemap: h.addTreemap,
};

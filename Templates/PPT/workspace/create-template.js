const pptxgen = require('pptxgenjs');
const path = require('path');

// Palette de couleurs du template Instagram
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

// Polices
const fonts = {
    main: 'Syne',
    serif: 'Instrument Serif',
    mono: 'JetBrains Mono'
};

// Chemin vers l'image de glow
const glowImagePath = path.join(__dirname, 'glow-combined.png');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Où Va l\'Argent';
pptx.title = 'Template Présentation';
pptx.subject = 'Template basé sur le design Instagram';

// Fonction pour ajouter les éléments de fond communs avec effets de lumière
function addBackground(slide) {
    // Fond principal sombre
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: { color: colors.bgDeep }
    });

    // Image de glow (effets de lumière cyan et or)
    slide.addImage({
        path: glowImagePath,
        x: 0, y: 0, w: 10, h: 5.625
    });

    // Grille subtile (lignes verticales)
    for (let i = 1; i < 10; i++) {
        slide.addShape(pptx.shapes.LINE, {
            x: i, y: 0, w: 0, h: 5.625,
            line: { color: colors.accentElectric, width: 0.3, transparency: 96 }
        });
    }
    // Grille subtile (lignes horizontales)
    for (let i = 1; i < 6; i++) {
        slide.addShape(pptx.shapes.LINE, {
            x: 0, y: i * 0.9, w: 10, h: 0,
            line: { color: colors.accentElectric, width: 0.3, transparency: 96 }
        });
    }
}

// Fonction pour ajouter le header avec logo
function addHeader(slide, tag = 'Section') {
    // Logo icon
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

    // Logo text
    slide.addText('Où Va l\'Argent', {
        x: 1.05, y: 0.35, w: 2, h: 0.45,
        fontSize: 16, fontFace: fonts.main, bold: true,
        color: colors.textPrimary, valign: 'middle'
    });

    // Tag
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 8.2, y: 0.32, w: 1.4, h: 0.45,
        fill: { color: colors.accentElectric, transparency: 85 },
        line: { color: colors.accentElectric, width: 1, transparency: 70 },
        rectRadius: 0.25
    });
    slide.addText(tag.toUpperCase(), {
        x: 8.2, y: 0.32, w: 1.4, h: 0.45,
        fontSize: 10, fontFace: fonts.main, bold: true,
        color: colors.accentElectric, align: 'center', valign: 'middle'
    });
}

// Fonction pour ajouter le footer
function addFooter(slide, source = 'Votre source') {
    // Ligne de séparation
    slide.addShape(pptx.shapes.LINE, {
        x: 0.4, y: 5.1, w: 9.2, h: 0,
        line: { color: colors.glassBorder, width: 1 }
    });

    // Source
    slide.addText([
        { text: 'Source : ', options: { color: colors.textMuted } },
        { text: source, options: { color: colors.textSecondary } }
    ], {
        x: 0.4, y: 5.2, w: 5, h: 0.3,
        fontSize: 10, fontFace: fonts.main, valign: 'middle'
    });

    // Website
    slide.addText('ouvalargent.fr', {
        x: 7.5, y: 5.2, w: 2.1, h: 0.3,
        fontSize: 11, fontFace: fonts.mono, bold: true,
        color: colors.accentElectric, align: 'right', valign: 'middle'
    });
}

// ========== SLIDE 1: TITRE ==========
const slide1 = pptx.addSlide();
addBackground(slide1);

// Logo centré
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.4, y: 1.2, w: 0.8, h: 0.8,
    fill: { color: colors.accentElectric },
    rectRadius: 0.12
});
slide1.addText('€', {
    x: 4.4, y: 1.2, w: 0.8, h: 0.8,
    fontSize: 36, fontFace: fonts.mono, bold: true,
    color: colors.bgDeep, align: 'center', valign: 'middle'
});
slide1.addText('Où Va l\'Argent', {
    x: 5.3, y: 1.3, w: 2.5, h: 0.6,
    fontSize: 22, fontFace: fonts.main, bold: true,
    color: colors.textPrimary, valign: 'middle'
});

// Titre principal
slide1.addText('Titre de la présentation', {
    x: 0.5, y: 2.3, w: 9, h: 0.9,
    fontSize: 42, fontFace: fonts.main, bold: true,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});

// Sous-titre
slide1.addText('Sous-titre ou description courte', {
    x: 0.5, y: 3.2, w: 9, h: 0.5,
    fontSize: 18, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center', valign: 'middle'
});

// Tags
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.5, y: 3.9, w: 1.3, h: 0.45,
    fill: { color: colors.accentElectric, transparency: 85 },
    line: { color: colors.accentElectric, width: 1, transparency: 70 },
    rectRadius: 0.25
});
slide1.addText('THÈME 1', {
    x: 3.5, y: 3.9, w: 1.3, h: 0.45,
    fontSize: 10, fontFace: fonts.main, bold: true,
    color: colors.accentElectric, align: 'center', valign: 'middle'
});
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.0, y: 3.9, w: 1.3, h: 0.45,
    fill: { color: colors.accentElectric, transparency: 85 },
    line: { color: colors.accentElectric, width: 1, transparency: 70 },
    rectRadius: 0.25
});
slide1.addText('THÈME 2', {
    x: 5.0, y: 3.9, w: 1.3, h: 0.45,
    fontSize: 10, fontFace: fonts.main, bold: true,
    color: colors.accentElectric, align: 'center', valign: 'middle'
});

// Footer titre
slide1.addText('Votre nom | Date', {
    x: 0.4, y: 5.2, w: 3, h: 0.3,
    fontSize: 11, fontFace: fonts.main,
    color: colors.textMuted, valign: 'middle'
});
slide1.addText('ouvalargent.fr', {
    x: 7.5, y: 5.2, w: 2.1, h: 0.3,
    fontSize: 11, fontFace: fonts.mono, bold: true,
    color: colors.accentElectric, align: 'right', valign: 'middle'
});

// ========== SLIDE 2: AGENDA ==========
const slide2 = pptx.addSlide();
addBackground(slide2);
addHeader(slide2, 'Agenda');

// Titre Sommaire
slide2.addText('Sommaire', {
    x: 0.5, y: 0.9, w: 9, h: 0.6,
    fontSize: 32, fontFace: fonts.serif,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});

// 4 cartes d'agenda
const agendaItems = [
    { num: '01', title: 'Contexte', desc: 'Description de la première partie' },
    { num: '02', title: 'Analyse', desc: 'Description de la deuxième partie' },
    { num: '03', title: 'Propositions', desc: 'Description de la troisième partie' },
    { num: '04', title: 'Conclusion', desc: 'Description de la dernière partie' }
];

agendaItems.forEach((item, i) => {
    const x = 0.4 + i * 2.35;
    // Carte avec effet glass
    slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: 1.7, w: 2.2, h: 3.1,
        fill: { color: colors.bgElevated, transparency: 15 },
        line: { color: colors.glassBorder, width: 1 },
        rectRadius: 0.15,
        shadow: { type: 'outer', blur: 8, offset: 3, angle: 45, color: '000000', opacity: 0.3 }
    });
    // Numéro avec gradient simulé
    slide2.addShape(pptx.shapes.OVAL, {
        x: x + 0.15, y: 1.9, w: 0.5, h: 0.5,
        fill: { color: colors.accentElectric },
        shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.4 }
    });
    slide2.addText(item.num, {
        x: x + 0.15, y: 1.9, w: 0.5, h: 0.5,
        fontSize: 14, fontFace: fonts.mono, bold: true,
        color: colors.bgDeep, align: 'center', valign: 'middle'
    });
    // Titre
    slide2.addText(item.title, {
        x: x + 0.15, y: 2.55, w: 1.9, h: 0.4,
        fontSize: 15, fontFace: fonts.main, bold: true,
        color: colors.textPrimary, valign: 'top'
    });
    // Description
    slide2.addText(item.desc, {
        x: x + 0.15, y: 2.95, w: 1.9, h: 1.5,
        fontSize: 11, fontFace: fonts.main,
        color: colors.textSecondary, valign: 'top'
    });
});

addFooter(slide2, 'Votre source');

// ========== SLIDE 3: CONTENU ==========
const slide3 = pptx.addSlide();
addBackground(slide3);
addHeader(slide3, 'Section');

// Titre section
slide3.addText([
    { text: 'Titre de la ', options: { color: colors.textPrimary } },
    { text: 'section', options: { color: colors.accentElectric, italic: true } }
], {
    x: 0.4, y: 0.95, w: 9, h: 0.5,
    fontSize: 28, fontFace: fonts.serif, valign: 'middle'
});

// Boîte de contenu avec effet glass
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.6, w: 9.2, h: 3.3,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.glassBorder, width: 1 },
    rectRadius: 0.15,
    shadow: { type: 'outer', blur: 10, offset: 4, angle: 45, color: '000000', opacity: 0.25 }
});

// Points avec bordures colorées
const points = [
    { color: colors.accentElectric, text: 'Premier point important à développer' },
    { color: colors.accentGold, text: 'Deuxième point avec des détails complémentaires' },
    { color: colors.accentPurple, text: 'Troisième point pour conclure cette section' },
    { color: colors.accentGreen, text: 'Quatrième point optionnel si nécessaire' }
];

points.forEach((point, i) => {
    const y = 1.85 + i * 0.75;
    // Barre colorée avec glow
    slide3.addShape(pptx.shapes.RECTANGLE, {
        x: 0.65, y: y, w: 0.06, h: 0.5,
        fill: { color: point.color },
        shadow: { type: 'outer', blur: 4, offset: 0, angle: 0, color: point.color, opacity: 0.5 }
    });
    // Texte
    slide3.addText(point.text, {
        x: 0.85, y: y, w: 8.5, h: 0.5,
        fontSize: 15, fontFace: fonts.main,
        color: colors.textPrimary, valign: 'middle'
    });
});

addFooter(slide3, 'Votre source');

// ========== SLIDE 4: STAT CHOC ==========
const slide4 = pptx.addSlide();
addBackground(slide4);
addHeader(slide4, 'Chiffre clé');

// Label
slide4.addText('EN FRANCE, EN 2024', {
    x: 0.5, y: 1.3, w: 9, h: 0.4,
    fontSize: 14, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center', valign: 'middle',
    charSpacing: 3
});

// Gros chiffre avec effet glow
slide4.addText('4.2', {
    x: 0.5, y: 1.6, w: 9, h: 1.8,
    fontSize: 140, fontFace: fonts.mono, bold: true,
    color: colors.accentElectric, align: 'center', valign: 'middle',
    shadow: { type: 'outer', blur: 15, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.5 }
});

// Unité
slide4.addText('millions de mal-logés', {
    x: 0.5, y: 3.3, w: 9, h: 0.6,
    fontSize: 32, fontFace: fonts.serif, italic: true,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});

// Contexte
slide4.addText([
    { text: 'Soit ', options: { color: colors.textSecondary } },
    { text: '1 Français sur 16', options: { color: colors.accentElectric, bold: true } },
    { text: ' en situation de mal-logement :\nsans-abri, hébergement précaire, surpeuplement ou habitat indigne.', options: { color: colors.textSecondary } }
], {
    x: 1, y: 4, w: 8, h: 0.9,
    fontSize: 14, fontFace: fonts.main, align: 'center', valign: 'top'
});

addFooter(slide4, 'Fondation Abbé Pierre, Rapport 2024');

// ========== SLIDE 5: COMPARAISON ==========
const slide5 = pptx.addSlide();
addBackground(slide5);
addHeader(slide5, 'Comparaison');

// Titre
slide5.addText([
    { text: 'Construction de logements :\nl\'', options: { color: colors.textPrimary } },
    { text: 'effondrement', options: { color: colors.accentElectric, italic: true } }
], {
    x: 0.5, y: 0.9, w: 9, h: 0.9,
    fontSize: 26, fontFace: fonts.serif, align: 'center', valign: 'middle'
});

// Carte gauche avec shadow
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 2, w: 4.2, h: 2.8,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.glassBorder, width: 1 },
    rectRadius: 0.15,
    shadow: { type: 'outer', blur: 8, offset: 3, angle: 45, color: '000000', opacity: 0.25 }
});
slide5.addText('EN 2017', {
    x: 0.6, y: 2.2, w: 4.2, h: 0.4,
    fontSize: 12, fontFace: fonts.main,
    color: colors.textMuted, align: 'center', charSpacing: 2
});
slide5.addText('437 000', {
    x: 0.6, y: 2.7, w: 4.2, h: 1,
    fontSize: 48, fontFace: fonts.mono, bold: true,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});
slide5.addText('logements construits', {
    x: 0.6, y: 3.8, w: 4.2, h: 0.4,
    fontSize: 14, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center'
});

// Carte droite (highlight) avec glow
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 2, w: 4.2, h: 2.8,
    fill: { color: colors.accentElectric, transparency: 92 },
    line: { color: colors.accentElectric, width: 1, transparency: 50 },
    rectRadius: 0.15,
    shadow: { type: 'outer', blur: 12, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.3 }
});
// Barre highlight en haut
slide5.addShape(pptx.shapes.RECTANGLE, {
    x: 5.2, y: 2, w: 4.2, h: 0.06,
    fill: { color: colors.accentElectric },
    shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.6 }
});
slide5.addText('EN 2024', {
    x: 5.2, y: 2.2, w: 4.2, h: 0.4,
    fontSize: 12, fontFace: fonts.main,
    color: colors.textMuted, align: 'center', charSpacing: 2
});
slide5.addText('287 000', {
    x: 5.2, y: 2.7, w: 4.2, h: 1,
    fontSize: 48, fontFace: fonts.mono, bold: true,
    color: colors.accentElectric, align: 'center', valign: 'middle',
    shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.4 }
});
slide5.addText('logements construits', {
    x: 5.2, y: 3.8, w: 4.2, h: 0.4,
    fontSize: 14, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center'
});

// Badge VS avec glow
slide5.addShape(pptx.shapes.OVAL, {
    x: 4.5, y: 3, w: 1, h: 1,
    fill: { color: colors.bgElevated },
    line: { color: colors.glassBorder, width: 2 },
    shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: '000000', opacity: 0.4 }
});
slide5.addText('-34%', {
    x: 4.5, y: 3, w: 1, h: 1,
    fontSize: 14, fontFace: fonts.mono, bold: true,
    color: colors.accentRed, align: 'center', valign: 'middle'
});

addFooter(slide5, 'Ministère de la Transition écologique');

// ========== SLIDE 6: GRAPHIQUE ==========
const slide6 = pptx.addSlide();
addBackground(slide6);
addHeader(slide6, 'Données');

// Titre
slide6.addText('Où va l\'argent du logement ?', {
    x: 0.5, y: 0.95, w: 9, h: 0.5,
    fontSize: 26, fontFace: fonts.serif,
    color: colors.textPrimary, align: 'center', valign: 'middle'
});

// Barres de données avec glow
const barData = [
    { label: 'APL & aides perso', value: '15.8 Md€', width: 85, color: colors.accentElectric },
    { label: 'Dépenses fiscales', value: '13.2 Md€', width: 70, color: colors.accentGold },
    { label: 'Logement social', value: '9.4 Md€', width: 50, color: colors.accentPurple },
    { label: 'Rénovation (ANAH)', value: '5.6 Md€', width: 30, color: colors.accentGreen },
    { label: 'Hébergement urgence', value: '3.4 Md€', width: 18, color: colors.accentOrange }
];

barData.forEach((bar, i) => {
    const y = 1.6 + i * 0.65;
    // Label
    slide6.addText(bar.label, {
        x: 0.4, y: y, w: 2.5, h: 0.55,
        fontSize: 12, fontFace: fonts.main,
        color: colors.textSecondary, align: 'right', valign: 'middle'
    });
    // Track
    slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 3, y: y + 0.05, w: 6.5, h: 0.45,
        fill: { color: colors.bgElevated },
        rectRadius: 0.08
    });
    // Fill avec glow
    const fillWidth = (bar.width / 100) * 6.5;
    slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 3, y: y + 0.05, w: fillWidth, h: 0.45,
        fill: { color: bar.color },
        rectRadius: 0.08,
        shadow: { type: 'outer', blur: 6, offset: 0, angle: 0, color: bar.color, opacity: 0.4 }
    });
    // Value
    slide6.addText(bar.value, {
        x: 3, y: y + 0.05, w: fillWidth - 0.1, h: 0.45,
        fontSize: 12, fontFace: fonts.mono, bold: true,
        color: colors.bgDeep, align: 'right', valign: 'middle'
    });
});

addFooter(slide6, 'PLF 2024, Cour des comptes');

// ========== SLIDE 7: CITATION ==========
const slide7 = pptx.addSlide();
addBackground(slide7);
addHeader(slide7, 'Focus');

// Icône
slide7.addText('🏠', {
    x: 0.5, y: 1.2, w: 9, h: 0.8,
    fontSize: 48, align: 'center', valign: 'middle'
});

// Citation avec effets
slide7.addText([
    { text: 'En France, ', options: { color: colors.textPrimary } },
    { text: '2.4 millions de ménages', options: { color: colors.accentElectric, bold: true } },
    { text: '\nattendent un logement social.\n\n', options: { color: colors.textPrimary } },
    { text: 'Délai moyen d\'attente : ', options: { color: colors.textPrimary } },
    { text: '3 ans', options: { color: colors.accentGold, bold: true } }
], {
    x: 0.8, y: 2, w: 8.4, h: 2.2,
    fontSize: 26, fontFace: fonts.serif, align: 'center', valign: 'middle'
});

// Sous-texte
slide7.addText('Dans les zones tendues, ce délai peut dépasser 10 ans.', {
    x: 0.5, y: 4.3, w: 9, h: 0.5,
    fontSize: 14, fontFace: fonts.main,
    color: colors.textMuted, align: 'center', valign: 'middle'
});

addFooter(slide7, 'USH, Rapport 2024');

// ========== SLIDE 8: CONCLUSION ==========
const slide8 = pptx.addSlide();
addBackground(slide8);

// Logo centré avec glow
slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.4, y: 1.5, w: 0.8, h: 0.8,
    fill: { color: colors.accentElectric },
    rectRadius: 0.12,
    shadow: { type: 'outer', blur: 10, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.5 }
});
slide8.addText('€', {
    x: 4.4, y: 1.5, w: 0.8, h: 0.8,
    fontSize: 36, fontFace: fonts.mono, bold: true,
    color: colors.bgDeep, align: 'center', valign: 'middle'
});
slide8.addText('Où Va l\'Argent', {
    x: 5.3, y: 1.6, w: 2.5, h: 0.6,
    fontSize: 22, fontFace: fonts.main, bold: true,
    color: colors.textPrimary, valign: 'middle'
});

// Merci avec glow
slide8.addText('Merci !', {
    x: 0.5, y: 2.6, w: 9, h: 0.8,
    fontSize: 48, fontFace: fonts.serif, italic: true,
    color: colors.textPrimary, align: 'center', valign: 'middle',
    shadow: { type: 'outer', blur: 8, offset: 0, angle: 0, color: colors.accentElectric, opacity: 0.3 }
});

// Contact
slide8.addText('Des questions ?', {
    x: 0.5, y: 3.5, w: 9, h: 0.4,
    fontSize: 18, fontFace: fonts.main,
    color: colors.textSecondary, align: 'center', valign: 'middle'
});

// Infos de contact avec effet glass
slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3, y: 4.1, w: 4, h: 0.8,
    fill: { color: colors.bgElevated, transparency: 15 },
    line: { color: colors.glassBorder, width: 1 },
    rectRadius: 0.1,
    shadow: { type: 'outer', blur: 8, offset: 3, angle: 45, color: '000000', opacity: 0.25 }
});
slide8.addText([
    { text: 'ouvalargent.fr', options: { color: colors.accentElectric, bold: true } },
    { text: '\n@ouvalargent', options: { color: colors.textSecondary } }
], {
    x: 3, y: 4.1, w: 4, h: 0.8,
    fontSize: 14, fontFace: fonts.mono, align: 'center', valign: 'middle'
});

// Sauvegarder
const outputPath = process.argv[2] || 'template-presentation.pptx';
pptx.writeFile({ fileName: outputPath })
    .then(() => console.log(`Présentation créée : ${outputPath}`))
    .catch(err => console.error('Erreur:', err));

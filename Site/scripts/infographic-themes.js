/**
 * Palette de thèmes pour les infographies "Où Va l'Argent"
 *
 * Usage:
 *   const { THEMES, getThemeCSS } = require('./infographic-themes');
 *
 *   // Thème par défaut (bleu)
 *   const css = getThemeCSS();
 *
 *   // Thème spécifique
 *   const css = getThemeCSS('rouge');
 *
 * Le bleu foncé reste le thème par DÉFAUT pour toutes les infographies.
 * Les autres couleurs permettent de varier ponctuellement selon le sujet.
 */

const THEMES = {
  bleu: {
    name: 'Bleu (défaut)',
    usage: 'Majorité des infographies',
    bgStart: '#06080c',
    bgMid: '#0a1628',
    bgEnd: '#06080c',
    accent: '#00d4ff',
    gridColor: 'rgba(255,71,87,0.03)',
    glowColor: 'rgba(255,71,87,0.12)',
    subtitleColor: '#8899a8',
    footerDim: '#4a5a6a',
    footerLight: '#8899a8',
    urlColor: '#00d4ff',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  vert: {
    name: 'Vert émeraude',
    usage: 'Investissement, croissance, écologie',
    bgStart: '#081510',
    bgMid: '#0d3528',
    bgEnd: '#081510',
    accent: '#00d488',
    gridColor: 'rgba(0,212,136,0.03)',
    glowColor: 'rgba(0,212,136,0.1)',
    subtitleColor: '#7aaa98',
    footerDim: '#3a5a4a',
    footerLight: '#7aaa98',
    urlColor: '#00d488',
    borderColor: 'rgba(0,212,136,0.15)',
  },
  violet: {
    name: 'Violet',
    usage: 'Tech, innovation, crypto, IA',
    bgStart: '#120c20',
    bgMid: '#2a1555',
    bgEnd: '#120c20',
    accent: '#a855f7',
    gridColor: 'rgba(168,85,247,0.03)',
    glowColor: 'rgba(168,85,247,0.12)',
    subtitleColor: '#9988aa',
    footerDim: '#5a4a6a',
    footerLight: '#9988aa',
    urlColor: '#a855f7',
    borderColor: 'rgba(168,85,247,0.15)',
  },
  or: {
    name: 'Or / Ambre',
    usage: 'Finance, bourse, patrimoine, or',
    bgStart: '#18120a',
    bgMid: '#3d2a0a',
    bgEnd: '#18120a',
    accent: '#ffd700',
    gridColor: 'rgba(255,215,0,0.03)',
    glowColor: 'rgba(255,215,0,0.1)',
    subtitleColor: '#aa9878',
    footerDim: '#6a5a3a',
    footerLight: '#aa9878',
    urlColor: '#ffd700',
    borderColor: 'rgba(255,215,0,0.15)',
  },
  rouge: {
    name: 'Rouge bordeaux',
    usage: 'Dette, déficit, alertes, urgence',
    bgStart: '#180a0c',
    bgMid: '#451218',
    bgEnd: '#180a0c',
    accent: '#ff4757',
    gridColor: 'rgba(255,71,87,0.03)',
    glowColor: 'rgba(255,71,87,0.1)',
    subtitleColor: '#aa8088',
    footerDim: '#6a3a3a',
    footerLight: '#aa8088',
    urlColor: '#ff4757',
    borderColor: 'rgba(255,71,87,0.15)',
  },
  cyan: {
    name: 'Cyan / Teal',
    usage: 'International, comparaisons, données',
    bgStart: '#081518',
    bgMid: '#0a3540',
    bgEnd: '#081518',
    accent: '#00d4ff',
    gridColor: 'rgba(0,212,255,0.03)',
    glowColor: 'rgba(0,212,255,0.1)',
    subtitleColor: '#78a8aa',
    footerDim: '#3a5a5a',
    footerLight: '#78a8aa',
    urlColor: '#00d4ff',
    borderColor: 'rgba(0,212,255,0.15)',
  },
};

/**
 * Génère le CSS du fond (bg + grid + glow) pour un thème donné.
 * @param {string} themeName - Nom du thème (défaut: 'bleu')
 * @returns {object} { bg, grid, glow, theme } - CSS inline pour chaque couche + objet thème complet
 */
function getThemeCSS(themeName = 'bleu') {
  const t = THEMES[themeName] || THEMES.bleu;
  return {
    bg: `background: linear-gradient(145deg, ${t.bgStart} 0%, ${t.bgMid} 50%, ${t.bgEnd} 100%);`,
    grid: `background-image: linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px); background-size: 40px 40px;`,
    glow: `background: radial-gradient(circle, ${t.glowColor} 0%, transparent 70%);`,
    theme: t,
  };
}

/**
 * Liste les thèmes disponibles.
 * @returns {string[]}
 */
function listThemes() {
  return Object.keys(THEMES);
}

module.exports = { THEMES, getThemeCSS, listThemes };

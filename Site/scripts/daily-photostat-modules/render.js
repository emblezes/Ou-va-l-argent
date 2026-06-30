/**
 * render.js — construit le HTML photo-stat et exporte les PNG 2160×2160.
 * Réutilise buildHTML/exportPNGs de photo-stat-card.js.
 */
const fs = require('fs');
const path = require('path');
const { buildHTML, exportPNGs } = require('../photo-stat-card');

// cards: [{ slug, headline, reveal, source, photo_rel, ... }] — photo_rel relatif à outDir
async function renderCards(cards, outDir) {
  fs.mkdirSync(path.join(outDir, 'photos'), { recursive: true });
  const cfgCards = cards.map(c => ({
    name: c.slug,
    photo: c.photo_rel || '',
    photoPos: 'center 30%',
    headline: c.headline,
    reveal: c.reveal,
    source: c.source
  }));
  const html = buildHTML(cfgCards);
  const htmlPath = path.join(outDir, 'actus-jour.html');
  fs.writeFileSync(htmlPath, html);
  await exportPNGs(outDir, htmlPath);
  return cards.map(c => ({ ...c, png: path.join(outDir, `${c.slug}.png`) }));
}

module.exports = { renderCards };

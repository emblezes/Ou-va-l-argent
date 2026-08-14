/**
 * Générateur d'images hero pour les articles
 *
 * News : fond sombre OVLA + titre/logo (1200×630, format OG)
 * Analyse : réutilise l'image infographie existante
 */

const fs = require('fs');
const path = require('path');
const { BASE } = require('./shared-utils');

const HERO_WIDTH = 1200;
const HERO_HEIGHT = 630;

function generateHeroHTML(title, tag) {
  const colors = {
    'Finances publiques': '#00d4ff',
    'Macro-éco': '#ffd700',
    'Investissement': '#00ff88',
    'Actu éco': '#ff9f43',
    'International': '#a855f7',
    'Finance perso': '#ff4757',
    'Écologie': '#22c55e',
    'Culture': '#f472b6',
    'Impôts': '#ef4444',
    'Emploi': '#06b6d4',
    'Immobilier': '#d97706',
    'Santé': '#10b981',
    'Éducation': '#8b5cf6',
    'Défense': '#64748b',
    'Retraites': '#f59e0b',
    'Social': '#ec4899',
  };
  const backgrounds = {
    'Finances publiques': 'linear-gradient(135deg, #06080c 0%, #0a1628 50%, #06080c 100%)',
    'Macro-éco': 'linear-gradient(135deg, #0c0a00 0%, #1a1400 50%, #0c0a00 100%)',
    'Investissement': 'linear-gradient(135deg, #040c06 0%, #0a2814 50%, #040c06 100%)',
    'Actu éco': 'linear-gradient(135deg, #0c0800 0%, #1a1000 50%, #0c0800 100%)',
    'International': 'linear-gradient(135deg, #08040c 0%, #140a28 50%, #08040c 100%)',
    'Finance perso': 'linear-gradient(135deg, #0c0406 0%, #28050a 50%, #0c0406 100%)',
    'Écologie': 'linear-gradient(135deg, #030c04 0%, #0a280e 50%, #030c04 100%)',
    'Culture': 'linear-gradient(135deg, #0c040a 0%, #28081e 50%, #0c040a 100%)',
    'Impôts': 'linear-gradient(135deg, #0c0404 0%, #280808 50%, #0c0404 100%)',
    'Emploi': 'linear-gradient(135deg, #040a0c 0%, #081a28 50%, #040a0c 100%)',
    'Immobilier': 'linear-gradient(135deg, #0c0804 0%, #281a08 50%, #0c0804 100%)',
    'Santé': 'linear-gradient(135deg, #040c08 0%, #082818 50%, #040c08 100%)',
    'Éducation': 'linear-gradient(135deg, #06040c 0%, #120a28 50%, #06040c 100%)',
    'Défense': 'linear-gradient(135deg, #080a0c 0%, #141a28 50%, #080a0c 100%)',
    'Retraites': 'linear-gradient(135deg, #0c0a04 0%, #281e08 50%, #0c0a04 100%)',
    'Social': 'linear-gradient(135deg, #0c040a 0%, #280a1e 50%, #0c040a 100%)',
  };
  const accent = colors[tag] || '#00d4ff';
  const bg = backgrounds[tag] || backgrounds['Finances publiques'];

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${HERO_WIDTH}px;
    height: ${HERO_HEIGHT}px;
    overflow: hidden;
    font-family: 'Syne', sans-serif;
  }
  .hero {
    width: 100%;
    height: 100%;
    background: ${bg};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 50px 70px;
    position: relative;
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 50%, ${accent}35 0%, transparent 60%);
  }
  .grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(${accent}15 1px, transparent 1px),
      linear-gradient(90deg, ${accent}15 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .top { position: relative; z-index: 1; }
  .logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .logo-icon {
    font-family: 'Instrument Serif', serif;
    font-size: 3.5rem;
    color: ${accent};
    line-height: 1;
  }
  .logo-text {
    font-family: 'Instrument Serif', serif;
    font-size: 1.6rem;
    font-style: italic;
    color: #ffffff;
    line-height: 1;
  }
  .middle {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 0;
  }
  .tag {
    display: inline-block;
    padding: 6px 16px;
    background: ${accent}20;
    color: ${accent};
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 18px;
    width: fit-content;
  }
  .title {
    font-family: 'Instrument Serif', serif;
    font-size: 52px;
    color: #ffffff;
    line-height: 1.12;
    max-width: 950px;
  }
  .footer {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .source {
    color: #ffffff50;
    font-size: 13px;
  }
  .url {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    line-height: 1.1;
  }
  .url-value {
    color: ${accent};
    font-weight: 600;
    font-size: 16px;
  }
  .url-handle {
    color: rgba(255,255,255,0.55);
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.3px;
  }
</style>
</head>
<body>
  <div class="hero">
    <div class="grid"></div>
    <div class="top">
      <div class="logo">
        <div class="logo-icon">\u20AC</div>
        <span class="logo-text">O\u00F9 Va l'Argent ?</span>
      </div>
    </div>
    <div class="middle">
      <div class="tag">${tag}</div>
      <h1 class="title">${title}</h1>
    </div>
    <div class="footer">
      <span class="source"></span>
      <span class="url"><span class="url-value">ouvalargent.com</span><span class="url-handle">@ouvalargentfr</span></span>
    </div>
  </div>
</body>
</html>`;
}

async function generateHeroImage(article, outputPath) {
  const htmlPath = outputPath.replace('.png', '.html');

  const html = generateHeroHTML(
    article.titre,
    article.categorie || 'Actu éco'
  );
  fs.writeFileSync(htmlPath, html);

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: HERO_WIDTH,
      height: HERO_HEIGHT,
      deviceScaleFactor: 2
    });
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.screenshot({ path: outputPath, type: 'png' });
  } finally {
    await browser.close();
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
  }

  return outputPath;
}

function getInfographieHero(slug) {
  const instaDir = path.join(BASE, 'Production interne/Réseaux Sociaux /Infographies/Insta & Autres');
  if (fs.existsSync(instaDir)) {
    const files = fs.readdirSync(instaDir);
    const match = files.find(f => f.startsWith(slug) && f.endsWith('.png'));
    if (match) return path.join(instaDir, match);
  }
  return null;
}

module.exports = { generateHeroImage, getInfographieHero };

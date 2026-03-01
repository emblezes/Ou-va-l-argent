/**
 * Générateur de carousels Instagram pour les articles
 *
 * Produit 5 slides (1080×1080) par article :
 * - Slide 1 : Titre (style hero OVLA carré)
 * - Slides 2-5 : Points clés extraits via Claude Haiku
 *
 * Utilise les mêmes couleurs/backgrounds que hero-generator.js
 */

const fs = require('fs');
const path = require('path');
const { BASE, askClaude } = require('./shared-utils');

const SLIDE_SIZE = 1080;

// ── Couleurs par catégorie (identiques à hero-generator) ──

const CATEGORY_COLORS = {
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

const CATEGORY_BACKGROUNDS = {
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

// ── Extraction des points clés via Haiku ──

async function extractKeyPoints(contenu, titre) {
  const prompt = `Tu es un éditeur de contenu pour un média économique français ("Où Va l'Argent").

À partir de cet article, extrais exactement 4 points clés pour un carousel Instagram.

ARTICLE : "${titre}"
${contenu.substring(0, 3000)}

Chaque point doit :
- Avoir un sous-titre accrocheur (5-8 mots max, percutant)
- Contenir 2-3 phrases synthétiques (40-60 mots), impactantes et standalone
- Inclure au moins 1 chiffre ou fait concret quand possible
- Être compréhensible sans lire l'article complet

Réponds UNIQUEMENT en JSON (exactement 3 points) :
[
  { "title": "Sous-titre accrocheur", "text": "2-3 phrases synthétiques." },
  { "title": "...", "text": "..." },
  { "title": "...", "text": "..." }
]`;

  const raw = await askClaude(prompt, 'claude-haiku-4-5-20251001', 1500);
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('Haiku n\'a pas retourné de JSON valide pour les points clés');

  const points = JSON.parse(match[0]);
  if (points.length < 3) throw new Error(`Seulement ${points.length} points clés extraits (3 attendus)`);
  return points.slice(0, 3);
}

// ── Génération HTML ──

function baseStyles(accent, bg) {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${SLIDE_SIZE}px;
    height: ${SLIDE_SIZE}px;
    overflow: hidden;
    font-family: 'Syne', sans-serif;
  }
  .slide {
    width: 100%;
    height: 100%;
    background: ${bg};
    display: flex;
    flex-direction: column;
    padding: 35px 40px 30px;
    position: relative;
  }
  .slide::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 50%, ${accent}30 0%, transparent 60%);
  }
  .grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(${accent}12 1px, transparent 1px),
      linear-gradient(90deg, ${accent}12 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .top {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .logo-icon {
    font-family: 'Instrument Serif', serif;
    font-size: 3.5rem;
    color: ${accent};
    line-height: 1;
  }
  .logo-text {
    font-family: 'Instrument Serif', serif;
    font-size: 1.7rem;
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
    justify-content: flex-end;
    padding: 0 0 15px;
  }
  .footer {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
  .url {
    font-family: 'JetBrains Mono', monospace;
    color: ${accent};
    font-weight: 600;
    font-size: 1.5rem;
  }`;
}

function generateSlide1HTML(title, tag, accent, bg) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${baseStyles(accent, bg)}
  .slide { padding: 30px 35px; }
  .middle {
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0;
  }
  .tag {
    display: inline-block;
    padding: 8px 22px;
    background: ${accent}25;
    color: #ffffff;
    border: 1px solid ${accent}50;
    border-radius: 24px;
    font-size: 18px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 25px;
  }
  .title {
    font-family: 'Instrument Serif', serif;
    font-size: 105px;
    color: #ffffff;
    line-height: 1.02;
  }
</style>
</head>
<body>
  <div class="slide">
    <div class="grid"></div>
    <div class="top">
      <div class="logo">
        <div class="logo-icon">\u20AC</div>
        <span class="logo-text">O\u00F9 Va l'Argent ?</span>
      </div>
    </div>
    <div class="middle">
      <div class="tag">${escapeHtml(tag)}</div>
      <h1 class="title">${escapeHtml(title)}</h1>
    </div>
    <div class="footer">
      <span class="url">ouvalargent.com</span>
    </div>
  </div>
</body>
</html>`;
}

function generateSlideNHTML(slideNum, subtitle, text, accent, bg) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${baseStyles(accent, bg)}
  .slide { padding: 30px 65px; }
  .middle { justify-content: center; padding: 0; }
  .subtitle {
    font-family: 'Instrument Serif', serif;
    font-size: 72px;
    color: #ffffff;
    line-height: 1.08;
    margin-bottom: 35px;
    border-left: 6px solid ${accent};
    padding-left: 30px;
  }
  .text {
    font-family: 'Syne', sans-serif;
    font-size: 46px;
    color: #ffffffdd;
    line-height: 1.38;
  }
</style>
</head>
<body>
  <div class="slide">
    <div class="grid"></div>
    <div class="top">
      <div class="logo">
        <div class="logo-icon">\u20AC</div>
        <span class="logo-text">O\u00F9 Va l'Argent ?</span>
      </div>
    </div>
    <div class="middle">
      <h2 class="subtitle">${escapeHtml(subtitle)}</h2>
      <p class="text">${escapeHtml(text)}</p>
    </div>
    <div class="footer">
      <span class="url">ouvalargent.com</span>
    </div>
  </div>
</body>
</html>`;
}

function generateSlideCTAHTML(accent, bg) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${baseStyles(accent, bg)}
  .slide { padding: 30px 35px; }
  .middle {
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0;
  }
  .cta-icon {
    font-family: 'Instrument Serif', serif;
    font-size: 220px;
    color: ${accent};
    line-height: 1;
    margin-bottom: 40px;
  }
  .cta-actions {
    font-family: 'Instrument Serif', serif;
    font-size: 80px;
    color: #ffffff;
    line-height: 1.15;
    margin-bottom: 50px;
  }
  .cta-handle {
    font-family: 'Syne', sans-serif;
    font-size: 38px;
    color: #ffffffbb;
    line-height: 1.4;
  }
  .cta-handle strong {
    color: #ffffff;
    font-weight: 700;
  }
</style>
</head>
<body>
  <div class="slide">
    <div class="grid"></div>
    <div class="top"></div>
    <div class="middle">
      <div class="cta-icon">\u20AC</div>
      <div class="cta-actions">Abonne-toi. Partage.</div>
      <div class="cta-handle"><strong>O\u00F9 Va l'Argent ?</strong><br>@ouvalargent</div>
    </div>
    <div class="footer">
      <span class="url">ouvalargent.com</span>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Rendu Puppeteer ──

async function renderSlides(htmlSlides, outputDir) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const paths = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: SLIDE_SIZE,
      height: SLIDE_SIZE,
      deviceScaleFactor: 2
    });

    for (let i = 0; i < htmlSlides.length; i++) {
      const htmlPath = path.join(outputDir, `slide${i + 1}.html`);
      const pngPath = path.join(outputDir, `slide${i + 1}.png`);

      fs.writeFileSync(htmlPath, htmlSlides[i]);
      await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0', timeout: 15000 });
      await page.screenshot({ path: pngPath, type: 'png' });

      // Cleanup HTML
      fs.unlinkSync(htmlPath);
      paths.push(pngPath);
    }
  } finally {
    await browser.close();
  }

  return paths;
}

// ── Point d'entrée principal ──

async function generateArticleCarousel(article, outputDir) {
  const tag = article.categorie || 'Actu éco';
  const accent = CATEGORY_COLORS[tag] || '#00d4ff';
  const bg = CATEGORY_BACKGROUNDS[tag] || CATEGORY_BACKGROUNDS['Finances publiques'];

  // 1. Extraire 3 points clés via Haiku
  const keyPoints = await extractKeyPoints(article.contenu, article.titre);

  // 2. Générer le HTML des 5 slides (titre + 3 points clés + CTA)
  const htmlSlides = [
    generateSlide1HTML(article.titre, tag, accent, bg),
    ...keyPoints.map((pt, i) => generateSlideNHTML(i + 2, pt.title, pt.text, accent, bg)),
    generateSlideCTAHTML(accent, bg)
  ];

  // 3. Rendu Puppeteer → 5 PNG
  const paths = await renderSlides(htmlSlides, outputDir);

  return paths;
}

// ── Génération PDF (LinkedIn carousel) ──

async function generateCarouselPDF(slidePaths, outputPath) {
  const puppeteer = require('puppeteer');
  const os = require('os');
  const { execSync } = require('child_process');

  // Convert PNGs to compressed JPEGs (keeps PDF under 5MB for Notion)
  const jpegPaths = [];
  for (let i = 0; i < slidePaths.length; i++) {
    const jpegPath = path.join(os.tmpdir(), `ovla-pdf-slide-${Date.now()}-${i}.jpg`);
    execSync(`sips -s format jpeg -s formatOptions 70 "${slidePaths[i]}" --out "${jpegPath}" 2>/dev/null`);
    jpegPaths.push(jpegPath);
  }

  // Build an HTML page with each slide as a full page
  const imgTags = jpegPaths.map(p => {
    const data = fs.readFileSync(p).toString('base64');
    return `<div class="page"><img src="data:image/jpeg;base64,${data}"></div>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; }
  @page { size: 1080px 1080px; margin: 0; }
  .page { width: 1080px; height: 1080px; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  img { width: 100%; height: 100%; display: block; }
</style>
</head><body>${imgTags}</body></html>`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000)); // Let images render
    await page.pdf({
      path: outputPath,
      width: '1080px',
      height: '1080px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
  } finally {
    await browser.close();
    // Cleanup temp JPEGs
    for (const jp of jpegPaths) {
      if (fs.existsSync(jp)) fs.unlinkSync(jp);
    }
  }

  return outputPath;
}

module.exports = { generateArticleCarousel, generateCarouselPDF };

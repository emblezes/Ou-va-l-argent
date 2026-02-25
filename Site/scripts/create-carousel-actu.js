/**
 * Crée un carrousel 2 slides pour une actualité :
 *   Slide 1 : Photo + titre (format actu chaude)
 *   Slide 2 : Infographie data (déjà créée en Sources HTML)
 *
 * Usage:
 *   node create-carousel-actu.js --search="train OUIGO gare France" \
 *     --title="OUIGO n'a plus rien de <span class='accent-red'>low cost</span>" \
 *     --tag="Transport" \
 *     --source="FNAUT · FranceInfo · 2026" \
 *     --name="64-ouigo-prix-75pct" \
 *     --infographic="64-ouigo-prix-75pct.html"
 *
 * Options:
 *   --search=<query>         Recherche Google Images
 *   --photo=<chemin>         OU chemin direct vers une photo (skip la recherche)
 *   --title=<html>           Titre HTML (supporte .accent, .accent-red, .accent-gold)
 *   --tag=<tag>              Tag en haut à droite (défaut: ACTU)
 *   --source=<source>        Source en bas à gauche
 *   --name=<nom>             Nom de base pour les fichiers (ex: 64-ouigo-prix-75pct)
 *   --infographic=<fichier>  Fichier HTML de l'infographie data (dans Sources HTML/)
 *   --tag-color=<couleur>    Couleur du tag (défaut: #ff4757)
 *   --image-index=<n>        Index de l'image Google à prendre (défaut: 0)
 *   --theme=<nom>            Thème de fond : bleu (défaut), vert, violet, or, rouge, cyan
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const ACTUS_DIR = path.join(BASE, 'Actus chaudes');
const INSTA_DIR = path.join(BASE, 'Infographies', 'Insta & Autres');
const HTML_DIR = path.join(BASE, 'Infographies', 'Sources HTML');
const SCRIPTS_DIR = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Site/scripts';

function parseArgs(argv) {
  const args = {};
  argv.slice(2).forEach(arg => {
    const match = arg.match(/^--(\w[\w-]*)=(.+)$/);
    if (match) args[match[1]] = match[2];
  });
  return args;
}

function generateActuHTML(opts) {
  const { title, tag, source, name, tagColor } = opts;
  const bgColor = tagColor || '#ff4757';
  // Photo injectée via JS dans exportSlide, pas dans le CSS (pour éviter les problèmes d'apostrophe dans le chemin)

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${tag} - ${name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Syne', sans-serif; background: #1a1a2e; padding: 2rem; display: flex; justify-content: center; }
        .infographic { width: 1080px; height: 1080px; position: relative; overflow: hidden; }
        .bg-photo { position: absolute; inset: 0; background-size: cover; background-position: center; }
        .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6, 8, 12, 0.95) 0%, rgba(6, 8, 12, 0.85) 20%, rgba(6, 8, 12, 0.4) 45%, rgba(6, 8, 12, 0.15) 60%, rgba(6, 8, 12, 0.3) 100%); }
        .content { position: relative; z-index: 1; height: 100%; padding: 40px 50px; display: flex; flex-direction: column; justify-content: space-between; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; }
        .logo { display: flex; align-items: center; gap: 10px; background: rgba(6, 8, 12, 0.6); backdrop-filter: blur(8px); padding: 8px 16px; border-radius: 10px; }
        .logo-icon { font-family: 'Instrument Serif', serif; font-size: 4rem; color: #00d4ff; line-height: 1; }
        .logo-text { font-family: 'Instrument Serif', serif; font-size: 1.8rem; font-style: italic; color: #ffffff; line-height: 1; }
        .title-area { display: flex; flex-direction: column; gap: 20px; }
        .news-title { font-family: 'Instrument Serif', serif; font-size: 4.8rem; color: #f0f4f8; line-height: 1.15; text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5); }
        .news-title .accent { color: #00d4ff; font-style: italic; }
        .news-title .accent-gold { color: #ffd700; font-style: italic; }
        .news-title .accent-red { color: #ff4757; font-style: italic; }
        .footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.15); }
        .source { font-size: 0.95rem; color: rgba(255, 255, 255, 0.5); }
        .source span { color: rgba(255, 255, 255, 0.7); }
        .website { font-family: 'JetBrains Mono', monospace; font-size: 1.15rem; font-weight: 500; color: #00d4ff; }
    </style>
</head>
<body>
    <div class="infographic" data-name="${name}-actu">
        <div class="bg-photo"></div>
        <div class="overlay"></div>
        <div class="content">
            <div class="header">
                <div class="logo">
                    <span class="logo-icon">\u20AC</span>
                    <span class="logo-text">O\u00F9 Va l'Argent ?</span>
                </div>
            </div>
            <div class="title-area">
                <h1 class="news-title">${title}</h1>
                <div class="footer">
                    <div class="source">Source : <span>${source}</span></div>
                    <div class="website">ouvalargent.com</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

async function exportSlide(browser, htmlPath, outputPath, width = 1080, height = 1080, photoPath = null, format = 'instagram', themeName = null) {
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');

  // Injecter le thème de fond si spécifié (remplace bg/grid/glow)
  if (themeName && themeName !== 'bleu') {
    const { getThemeCSS } = require('./infographic-themes');
    const { bg, grid, glow, theme } = getThemeCSS(themeName);
    await page.evaluate(({ bg, grid, glow, urlColor, borderColor }) => {
      // Remplacer le fond (premier div absolu avec gradient)
      const bgEl = document.querySelector('.bg') || document.querySelector('[style*="linear-gradient(145deg"]');
      if (bgEl) bgEl.style.cssText = bgEl.style.cssText.replace(/background:[^;]+;/, bg);
      // Remplacer la grille
      const gridEl = document.querySelector('.grid') || document.querySelectorAll('[style*="background-image"]')[0];
      if (gridEl && gridEl !== bgEl) gridEl.style.cssText = gridEl.style.cssText.replace(/background-image:[^;]+;/, grid);
      // Remplacer le glow
      const glowEl = document.querySelector('.glow') || document.querySelector('[style*="radial-gradient"]');
      if (glowEl) glowEl.style.cssText = glowEl.style.cssText.replace(/background:[^;]+;/, 'background: ' + glow.replace('background: ', ''));
      // Mettre à jour la couleur du lien ouvalargent.com
      const urlEl = document.querySelector('.url') || document.querySelector('.website') || document.querySelector('[style*="ouvalargent"]');
      if (urlEl) urlEl.style.color = urlColor;
      // Mettre à jour le border-top du footer
      const footer = document.querySelector('.footer') || document.querySelector('[style*="border-top"]');
      if (footer) footer.style.borderTopColor = borderColor;
    }, { bg, grid, glow, urlColor: theme.urlColor, borderColor: theme.borderColor });
  }

  // Injecter la photo de fond en base64 (évite les problèmes d'apostrophe/espaces dans le chemin)
  if (photoPath) {
    const absPhoto = path.resolve(photoPath);
    const imgBuffer = fs.readFileSync(absPhoto);
    const ext = path.extname(absPhoto).toLowerCase().replace('.', '');
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    const base64 = imgBuffer.toString('base64');
    const dataUri = `data:${mime};base64,${base64}`;
    await page.evaluate((uri) => {
      const bgPhoto = document.querySelector('.bg-photo');
      if (bgPhoto) {
        bgPhoto.style.backgroundImage = `url("${uri}")`;
      }
    }, dataUri);
    await new Promise(r => setTimeout(r, 800));
  }

  // Adapter les dimensions et paddings selon le format
  if (format === 'tiktok-v') {
    await page.evaluate(() => {
      const infographic = document.querySelector('.infographic');
      if (infographic) {
        infographic.style.width = '1080px';
        infographic.style.height = '1920px';
      }
      // TikTok Vertical : tout le contenu en HAUT, bas libre pour l'incrustation visage
      const content = document.querySelector('.content');
      if (content) {
        content.style.padding = '120px 55px 60px';
        content.style.justifyContent = 'flex-start';
        content.style.gap = '30px';
      }
      // Le gradient overlay : assombrir le haut (titre lisible) et garder le bas plus visible (visage)
      const overlay = document.querySelector('.overlay');
      if (overlay) {
        overlay.style.background = 'linear-gradient(to bottom, rgba(6, 8, 12, 0.92) 0%, rgba(6, 8, 12, 0.75) 35%, rgba(6, 8, 12, 0.3) 55%, rgba(6, 8, 12, 0.1) 100%)';
      }
      // Pour les infographies data (pas de .overlay mais .bg-glow-1)
      const bgGlow = document.querySelector('.bg-glow-1');
      if (bgGlow) {
        bgGlow.style.top = '-50px';
      }
      // Agrandir le titre pour le format vertical
      const title = document.querySelector('.news-title') || document.querySelector('.chart-title');
      if (title) {
        const currentSize = parseFloat(window.getComputedStyle(title).fontSize);
        title.style.fontSize = Math.round(currentSize * 1.3) + 'px';
      }
      // Agrandir les méga-numbers
      const megaNum = document.querySelector('.mega-number');
      if (megaNum) {
        const currentSize = parseFloat(window.getComputedStyle(megaNum).fontSize);
        megaNum.style.fontSize = Math.round(currentSize * 1.4) + 'px';
      }
      // Remonter le footer juste sous le contenu (pas tout en bas)
      const footer = document.querySelector('.footer');
      if (footer) {
        footer.style.marginTop = '20px';
      }
      // Pour les .title-area (slides actu photo), s'assurer qu'il n'y a pas de flex-end
      const titleArea = document.querySelector('.title-area');
      if (titleArea) {
        titleArea.style.marginTop = '20px';
      }
    });
    width = 1080;
    height = 1920;
  } else if (format === 'tiktok-h') {
    await page.evaluate(() => {
      const infographic = document.querySelector('.infographic');
      if (infographic) {
        infographic.style.width = '1080px';
        infographic.style.height = '600px';
      }
      // TikTok Horizontal : JUSTE le titre en TRÈS GROS + chiffres, rien de petit
      const content = document.querySelector('.content');
      if (content) {
        content.style.padding = '30px 50px';
        content.style.justifyContent = 'center';
        content.style.alignItems = 'center';
        content.style.gap = '15px';
      }
      // Overlay plein pour lisibilité max
      const overlay = document.querySelector('.overlay');
      if (overlay) {
        overlay.style.background = 'rgba(6, 8, 12, 0.85)';
      }
      // Titre : TRÈS GROS, centré, remplit la slide
      const newsTitle = document.querySelector('.news-title');
      if (newsTitle) {
        newsTitle.style.fontSize = '4.2rem';
        newsTitle.style.textAlign = 'center';
        newsTitle.style.lineHeight = '1.1';
      }
      const chartTitle = document.querySelector('.chart-title');
      if (chartTitle) {
        chartTitle.style.fontSize = '3.8rem';
        chartTitle.style.textAlign = 'center';
      }
      // Méga-numbers : gros et centré
      const megaNum = document.querySelector('.mega-number');
      if (megaNum) {
        megaNum.style.fontSize = '8rem';
      }
      const megaUnit = document.querySelector('.mega-unit');
      if (megaUnit) {
        megaUnit.style.fontSize = '2.5rem';
      }
      const megaSub = document.querySelector('.mega-sub');
      if (megaSub) {
        megaSub.style.fontSize = '1.3rem';
      }
      // Comparaisons : adapter les barres
      const compareWrappers = document.querySelectorAll('.compare-bar-wrapper');
      compareWrappers.forEach(w => { w.style.height = '280px'; w.style.width = '180px'; });
      const compareVals = document.querySelectorAll('.compare-val');
      compareVals.forEach(v => { v.style.fontSize = '2.5rem'; });
      const compareLabels = document.querySelectorAll('.compare-label');
      compareLabels.forEach(l => { l.style.fontSize = '1.3rem'; });
      // Arrow compare : adapter
      const timeVals = document.querySelectorAll('.time-val');
      timeVals.forEach(v => {
        const size = parseFloat(v.style.fontSize || '7rem');
        v.style.fontSize = Math.round(size * 0.7) + 'px';
      });
      // Masquer le header (logo/tag) — juste le titre et les données
      const header = document.querySelector('.header');
      if (header) header.style.display = 'none';
      // Footer : garder seulement ouvalargent.com, centré en bas
      const footer = document.querySelector('.footer');
      if (footer) {
        footer.style.borderTop = 'none';
        footer.style.justifyContent = 'center';
        footer.style.position = 'absolute';
        footer.style.bottom = '15px';
        footer.style.left = '0';
        footer.style.right = '0';
        footer.style.paddingTop = '0';
      }
      const source = document.querySelector('.source');
      if (source) source.style.display = 'none';
      const website = document.querySelector('.website');
      if (website) {
        website.style.fontSize = '1.1rem';
        website.style.opacity = '0.7';
      }
      // title-area : centrer
      const titleArea = document.querySelector('.title-area');
      if (titleArea) {
        titleArea.style.alignItems = 'center';
        titleArea.style.textAlign = 'center';
      }
    });
    width = 1080;
    height = 600;
  }

  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 500));

  const el = await page.$('.infographic');
  await el.screenshot({ path: outputPath, type: 'png' });
  await page.close();
  return outputPath;
}

async function main() {
  const opts = parseArgs(process.argv);

  if (!opts.name || !opts.title) {
    console.log(`
Usage: node create-carousel-actu.js
  --search="recherche Google Images"
  --title="Titre HTML avec <span class='accent'>mots</span>"
  --tag="ACTU"
  --source="AFP · Fév. 2026"
  --name="64-ouigo-prix-75pct"
  --infographic="64-ouigo-prix-75pct.html"
  [--photo=chemin.jpg]
  [--tag-color=#ff4757]
  [--image-index=0]
`);
    process.exit(1);
  }

  const name = opts.name;
  const title = opts.title;
  const tag = opts.tag || 'ACTU';
  const source = opts.source || '';
  const tagColor = opts['tag-color'] || '#ff4757';
  const infographicFile = opts.infographic;
  const imageIndex = opts['image-index'] || '0';
  const themeName = opts.theme || 'bleu';

  console.log('\n🎠 Création carrousel actualité');
  console.log(`   Nom : ${name}`);
  console.log(`   Tag : ${tag}`);
  if (themeName !== 'bleu') console.log(`   Thème : ${themeName}`);

  // Étape 1 : Obtenir la photo
  let photoPath = opts.photo;
  if (!photoPath && opts.search) {
    console.log(`\n📷 Étape 1 : Recherche image Google...`);
    const tmpPhoto = path.join(ACTUS_DIR, `${name}-photo.jpg`);
    try {
      const result = execSync(
        `node "${path.join(SCRIPTS_DIR, 'download-google-image.js')}" "${opts.search}" --output="${tmpPhoto}" --index=${imageIndex}`,
        { encoding: 'utf-8', timeout: 60000, cwd: SCRIPTS_DIR }
      );
      console.log(result);
      // Trouver le chemin réel (peut avoir changé d'extension)
      const pathMatch = result.match(/PATH=(.+)/);
      photoPath = pathMatch ? pathMatch[1].trim() : tmpPhoto;
      // Vérifier que le fichier existe (peut avoir une extension différente)
      if (!fs.existsSync(photoPath)) {
        // Chercher avec d'autres extensions
        for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
          const alt = tmpPhoto.replace(/\.\w+$/, ext);
          if (fs.existsSync(alt)) { photoPath = alt; break; }
        }
      }
    } catch (err) {
      console.error(`   ⚠ Recherche échouée : ${err.message}`);
      console.log('   → Continuera sans photo (fond noir)');
    }
  }

  if (photoPath && fs.existsSync(photoPath)) {
    console.log(`   ✓ Photo : ${path.basename(photoPath)}`);
  } else {
    console.log('   ⚠ Pas de photo, le fond sera noir');
    photoPath = null;
  }

  // Étape 2 : Générer le HTML de la slide actu
  console.log(`\n📝 Étape 2 : Génération HTML actu...`);
  const actuHtmlPath = path.join(ACTUS_DIR, `${name}-actu.html`);
  const htmlContent = generateActuHTML({ title, tag, source, name, tagColor, photoPath });
  fs.writeFileSync(actuHtmlPath, htmlContent);
  console.log(`   ✓ ${path.basename(actuHtmlPath)}`);

  // Étape 3 : Exporter les slides
  console.log(`\n🖼️  Étape 3 : Export PNG...`);
  const browser = await puppeteer.launch({ headless: true });

  // ── Format Instagram (1080×1080) ──
  console.log(`   📸 Instagram :`);

  // Slide 1 : Photo + titre
  const slide1Path = path.join(ACTUS_DIR, `${name}-slide1-actu-instagram.png`);
  await exportSlide(browser, actuHtmlPath, slide1Path, 1080, 1080, photoPath, 'instagram');
  console.log(`     ✓ Slide 1 (photo) : ${path.basename(slide1Path)}`);

  // Slide 2 : Infographie data (si fournie)
  if (infographicFile) {
    const infographicPath = path.join(HTML_DIR, infographicFile);
    if (fs.existsSync(infographicPath)) {
      const slide2Path = path.join(ACTUS_DIR, `${name}-slide2-data-instagram.png`);
      await exportSlide(browser, infographicPath, slide2Path, 1080, 1080, null, 'instagram', themeName);
      console.log(`     ✓ Slide 2 (data)  : ${path.basename(slide2Path)}`);
    } else {
      console.log(`     ⚠ Infographie non trouvée : ${infographicFile}`);
      const instaFile = path.join(INSTA_DIR, `${name}-instagram.png`);
      if (fs.existsSync(instaFile)) {
        const slide2Path = path.join(ACTUS_DIR, `${name}-slide2-data-instagram.png`);
        fs.copyFileSync(instaFile, slide2Path);
        console.log(`     ✓ Slide 2 (data)  : copié depuis Insta & Autres`);
      }
    }
  }

  // ── Format TikTok Vertical (1080×1920) ──
  console.log(`   📱 TikTok Vertical :`);

  // Slide 1 TikTok : Photo + titre (format 9:16)
  const slide1TiktokPath = path.join(ACTUS_DIR, `${name}-slide1-actu-tiktok-v.png`);
  await exportSlide(browser, actuHtmlPath, slide1TiktokPath, 1080, 1920, photoPath, 'tiktok-v');
  console.log(`     ✓ Slide 1 (photo) : ${path.basename(slide1TiktokPath)}`);

  // Slide 2 TikTok Vertical : Infographie data (format 9:16)
  if (infographicFile) {
    const infographicPath = path.join(HTML_DIR, infographicFile);
    if (fs.existsSync(infographicPath)) {
      const slide2TiktokPath = path.join(ACTUS_DIR, `${name}-slide2-data-tiktok-v.png`);
      await exportSlide(browser, infographicPath, slide2TiktokPath, 1080, 1920, null, 'tiktok-v', themeName);
      console.log(`     ✓ Slide 2 (data)  : ${path.basename(slide2TiktokPath)}`);
    }
  }

  // ── Format TikTok Horizontal (1080×600) ──
  console.log(`   🖥️  TikTok Horizontal :`);

  // Slide 1 TikTok H : Photo + titre (format ~16:9)
  const slide1TiktokHPath = path.join(ACTUS_DIR, `${name}-slide1-actu-tiktok-h.png`);
  await exportSlide(browser, actuHtmlPath, slide1TiktokHPath, 1080, 600, photoPath, 'tiktok-h');
  console.log(`     ✓ Slide 1 (photo) : ${path.basename(slide1TiktokHPath)}`);

  // Slide 2 TikTok H : Infographie data (format ~16:9)
  if (infographicFile) {
    const infographicPath = path.join(HTML_DIR, infographicFile);
    if (fs.existsSync(infographicPath)) {
      const slide2TiktokHPath = path.join(ACTUS_DIR, `${name}-slide2-data-tiktok-h.png`);
      await exportSlide(browser, infographicPath, slide2TiktokHPath, 1080, 600, null, 'tiktok-h', themeName);
      console.log(`     ✓ Slide 2 (data)  : ${path.basename(slide2TiktokHPath)}`);
    }
  }

  await browser.close();

  console.log(`\n✅ Carrousel prêt dans : Actus chaudes/`);
  console.log(`   📸 Instagram   : ${name}-slide1-actu-instagram.png + slide2`);
  console.log(`   📱 TikTok V    : ${name}-slide1-actu-tiktok-v.png + slide2`);
  console.log(`   🖥️  TikTok H    : ${name}-slide1-actu-tiktok-h.png + slide2`);
  console.log('');
}

main().catch(err => {
  console.error('Erreur:', err.message);
  process.exit(1);
});

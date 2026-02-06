/**
 * Script d'export multi-format pour les infographies
 *
 * Génère 3 formats pour chaque infographie :
 * - Instagram : 1080x1080 (carré)
 * - TikTok Background : 1080x1920 (9:16 portrait)
 * - Rectangle : 1080x600 (pour commenter au-dessus)
 *
 * Usage :
 *   node html-to-png-multiformat.js <fichier.html> [dossier-sortie] [--format=all|instagram|tiktok|rectangle]
 *
 * Exemples :
 *   node html-to-png-multiformat.js ../mon-infographie.html
 *   node html-to-png-multiformat.js ../mon-infographie.html ./output --format=tiktok
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuration des formats
const FORMATS = {
  instagram: {
    width: 1080,
    height: 1080,
    suffix: '-instagram',
    cssClass: 'format-instagram',
    description: 'Instagram/LinkedIn (1080×1080)'
  },
  tiktok: {
    width: 1080,
    height: 1920,
    suffix: '-tiktok',
    cssClass: 'format-tiktok',
    description: 'TikTok Background (1080×1920)'
  },
  rectangle: {
    width: 1080,
    height: 600,
    suffix: '-rectangle',
    cssClass: 'format-rectangle',
    description: 'Rectangle commentaire (1080×600)'
  }
};

async function exportInfographic(page, element, outputPath, format) {
  // Get dimensions for this format
  const { width, height } = FORMATS[format];

  // Set viewport for this format
  await page.setViewport({
    width: width,
    height: height,
    deviceScaleFactor: 2, // 2x for retina quality
  });

  // Screenshot the element
  await element.screenshot({
    path: outputPath,
    type: 'png',
  });

  console.log(`  ✓ ${FORMATS[format].description} → ${path.basename(outputPath)}`);
}

async function convertHtmlToPng(htmlPath, outputDir, formatFilter = 'all') {
  console.log('\n📐 Export multi-format des infographies\n');
  console.log(`Fichier source : ${htmlPath}`);
  console.log(`Dossier sortie : ${outputDir}`);
  console.log(`Format(s) : ${formatFilter}\n`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Load the HTML file
  const absolutePath = path.resolve(htmlPath);
  await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0' });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  // Determine which formats to export
  const formatsToExport = formatFilter === 'all'
    ? Object.keys(FORMATS)
    : [formatFilter];

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find all infographics by format class
  for (const format of formatsToExport) {
    const cssClass = FORMATS[format].cssClass;
    const infographics = await page.$$(`.${cssClass}`);

    if (infographics.length === 0) {
      console.log(`⚠️  Aucune infographie trouvée avec la classe .${cssClass}`);
      continue;
    }

    console.log(`\n📦 Format ${format.toUpperCase()} (${infographics.length} infographie(s))`);

    for (let i = 0; i < infographics.length; i++) {
      const element = infographics[i];

      // Get custom name from data-name attribute if available
      const dataName = await element.evaluate(el => el.getAttribute('data-name'));
      const baseName = dataName || `infographie-${i + 1}`;
      const fileName = `${baseName}${FORMATS[format].suffix}.png`;
      const outputPath = path.join(outputDir, fileName);

      await exportInfographic(page, element, outputPath, format);
    }
  }

  await browser.close();
  console.log('\n✅ Export terminé !\n');
}

// Alternative: Export a single infographic in all 3 formats from a simple template
async function convertSingleInfographic(htmlPath, outputDir, baseName) {
  console.log('\n📐 Export multi-format d\'une infographie unique\n');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const absolutePath = path.resolve(htmlPath);
  await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find the single infographic (should have class .infographic)
  const infographic = await page.$('.infographic');

  if (!infographic) {
    console.log('❌ Aucune infographie trouvée (classe .infographic requise)');
    await browser.close();
    return;
  }

  // Export in each format by modifying the element's class
  for (const [formatName, format] of Object.entries(FORMATS)) {
    // Update the infographic's class to match the format
    await page.evaluate((cssClass, width, height) => {
      const el = document.querySelector('.infographic');
      // Remove all format classes
      el.classList.remove('format-instagram', 'format-tiktok', 'format-rectangle');
      // Add the target format class
      el.classList.add(cssClass);
      // Update dimensions
      el.style.width = width + 'px';
      el.style.height = height + 'px';
    }, format.cssClass, format.width, format.height);

    // Wait for layout to settle
    await page.waitForTimeout(100);

    // Set viewport
    await page.setViewport({
      width: format.width,
      height: format.height,
      deviceScaleFactor: 2,
    });

    const outputPath = path.join(outputDir, `${baseName}${format.suffix}.png`);

    // Re-select the element after DOM changes
    const element = await page.$('.infographic');
    await element.screenshot({
      path: outputPath,
      type: 'png',
    });

    console.log(`✓ ${format.description} → ${baseName}${format.suffix}.png`);
  }

  await browser.close();
  console.log('\n✅ Export terminé !\n');
}

// Parse command line arguments
const args = process.argv.slice(2);
let htmlFile = args[0] || '../Templates/Réseaux sociaux/template-multiformat.html';
let outputDir = args[1] || '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
let formatFilter = 'all';
let singleMode = false;
let baseName = 'infographie';

for (const arg of args) {
  if (arg.startsWith('--format=')) {
    formatFilter = arg.split('=')[1];
  }
  if (arg.startsWith('--single')) {
    singleMode = true;
  }
  if (arg.startsWith('--name=')) {
    baseName = arg.split('=')[1];
  }
}

// Validate format
if (formatFilter !== 'all' && !FORMATS[formatFilter]) {
  console.error(`❌ Format invalide : ${formatFilter}`);
  console.error(`Formats disponibles : all, ${Object.keys(FORMATS).join(', ')}`);
  process.exit(1);
}

// Run the conversion
if (singleMode) {
  convertSingleInfographic(htmlFile, outputDir, baseName).catch(console.error);
} else {
  convertHtmlToPng(htmlFile, outputDir, formatFilter).catch(console.error);
}

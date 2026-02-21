/**
 * Script d'export pour les infographies d'actualité avec photo de fond
 *
 * Usage:
 *   node export-actu-photo.js <fichier.html> [--photo=chemin/vers/photo.jpg]
 *
 * Le script :
 * 1. Ouvre le fichier HTML
 * 2. Si --photo est fourni, injecte l'image en fond
 * 3. Exporte en PNG Instagram (2160x2160 retina)
 *
 * Exemples:
 *   node export-actu-photo.js "../Production interne/Réseaux Sociaux /Actus chaudes/63-actu-exemple.html"
 *   node export-actu-photo.js "../Production interne/Réseaux Sociaux /Actus chaudes/63-actu-exemple.html" --photo="../chemin/photo.jpg"
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const ACTUS_DIR = path.join(BASE, 'Actus chaudes');

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node export-actu-photo.js <fichier.html> [--photo=chemin/photo.jpg]');
    process.exit(1);
  }

  const htmlFile = args[0];
  const photoArg = args.find(a => a.startsWith('--photo='));
  const photoPath = photoArg ? photoArg.replace('--photo=', '') : null;

  const htmlPath = path.resolve(htmlFile);
  if (!fs.existsSync(htmlPath)) {
    console.error(`Fichier introuvable : ${htmlPath}`);
    process.exit(1);
  }

  console.log(`\n📸 Export actualité photo\n`);
  console.log(`  HTML  : ${path.basename(htmlPath)}`);
  if (photoPath) console.log(`  Photo : ${path.basename(photoPath)}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Injecter la photo si fournie
  if (photoPath) {
    const absPhotoPath = path.resolve(photoPath);
    if (!fs.existsSync(absPhotoPath)) {
      console.error(`Photo introuvable : ${absPhotoPath}`);
      await browser.close();
      process.exit(1);
    }
    await page.evaluate((p) => {
      const bgPhoto = document.querySelector('.bg-photo');
      if (bgPhoto) {
        bgPhoto.style.backgroundImage = `url('file://${p}')`;
      }
    }, absPhotoPath);
    await new Promise(r => setTimeout(r, 500)); // Attendre le chargement de l'image
  }

  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 300));

  const infographic = await page.$('.infographic');
  const dataName = await page.evaluate(el => el.getAttribute('data-name'), infographic);
  const outputPath = path.join(ACTUS_DIR, `${dataName}-instagram.png`);

  await infographic.screenshot({ path: outputPath, type: 'png' });
  console.log(`\n  ✓ ${outputPath}`);

  await browser.close();
  console.log('\n✅ Export terminé !\n');
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});

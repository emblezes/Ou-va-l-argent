/**
 * Export des visuels du rapport "Où va l'argent public versé aux associations ?"
 * Format custom 1200×700 (16:9), palette OVLA sombre.
 *
 * Usage :
 *   node scripts/export-rapport-visuels.js                  # tous les visuels présents
 *   node scripts/export-rapport-visuels.js --only=R1,R2     # cible uniquement R1 et R2
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = "/Users/emmanuelblezes/Documents/08_Où va l'argent /Production interne/Rapports/visuels";
const PNG_DIR = path.join(BASE, 'png');

const WIDTH = 1200;
const HEIGHT = 700;

async function main() {
    if (!fs.existsSync(PNG_DIR)) fs.mkdirSync(PNG_DIR, { recursive: true });

    const onlyArg = process.argv.find(a => a.startsWith('--only='));
    const onlyPrefixes = onlyArg ? onlyArg.split('=')[1].split(',').map(s => s.toLowerCase()) : null;

    const files = fs.readdirSync(BASE)
        .filter(f => f.endsWith('.html'))
        .filter(f => !onlyPrefixes || onlyPrefixes.some(p => f.toLowerCase().startsWith(p.toLowerCase() + '-')));

    if (files.length === 0) {
        console.log('Aucun visuel à exporter.');
        return;
    }

    console.log(`\n📐 Export des visuels du rapport — ${files.length} fichier(s)\n`);

    const browser = await puppeteer.launch({ headless: true });

    for (const file of files) {
        const htmlPath = path.join(BASE, file);
        const baseName = file.replace(/\.html$/, '');

        const page = await browser.newPage();
        await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
        await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
        await page.evaluateHandle('document.fonts.ready');
        await new Promise(r => setTimeout(r, 300));

        const element = await page.$('.infographic');
        if (!element) {
            console.log(`  ✗ ${file} — élément .infographic introuvable`);
            await page.close();
            continue;
        }

        const outputPath = path.join(PNG_DIR, `${baseName}.png`);
        await element.screenshot({ path: outputPath, type: 'png' });
        console.log(`  ✓ ${baseName}.png`);

        await page.close();
    }

    await browser.close();
    console.log('\n✅ Export terminé.\n');
}

main().catch(err => {
    console.error('Erreur :', err);
    process.exit(1);
});

const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // LinkedIn banner : 1584x396, export 2x retina
    const WIDTH = 1584;
    const HEIGHT = 396;
    const SCALE = 2;

    await page.setViewport({ width: WIDTH + 200, height: 3000, deviceScaleFactor: SCALE });

    const htmlPath = path.resolve(__dirname, 'couvertures-linkedin.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

    // Attendre le chargement des polices
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 2000));

    const covers = await page.$$('.cover');
    const names = await page.$$eval('.cover', els => els.map(el => el.dataset.name));

    console.log(`Found ${covers.length} covers to export...`);

    const outputDir = __dirname;

    for (let i = 0; i < covers.length; i++) {
        const name = names[i];
        const outputPath = path.join(outputDir, `${name}.png`);

        await covers[i].screenshot({
            path: outputPath,
            type: 'png',
            omitBackground: false
        });

        console.log(`Exported: ${name}.png (${WIDTH * SCALE}x${HEIGHT * SCALE})`);
    }

    await browser.close();
    console.log('\nDone! All covers exported.');
})();

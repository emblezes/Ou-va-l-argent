const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const SCALE = 2;

    await page.setViewport({ width: 1800, height: 3000, deviceScaleFactor: SCALE });

    const htmlPath = path.resolve(__dirname, 'couverture-linkedin-final.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

    // Attendre le chargement des polices
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 2000));

    const outputDir = __dirname;

    // Export couverture LinkedIn
    const cover = await page.$('.cover');
    await cover.screenshot({
        path: path.join(outputDir, 'couverture-linkedin.png'),
        type: 'png',
        omitBackground: false
    });
    console.log('Exported: couverture-linkedin.png (3168x792 retina)');

    // Export logo rond
    const logoRond = await page.$('.logo-profile');
    await logoRond.screenshot({
        path: path.join(outputDir, 'logo-profil-rond.png'),
        type: 'png',
        omitBackground: true
    });
    console.log('Exported: logo-profil-rond.png (1600x1600 retina)');

    // Export logo carré arrondi
    const logoCarre = await page.$('.logo-profile-square');
    await logoCarre.screenshot({
        path: path.join(outputDir, 'logo-profil-carre.png'),
        type: 'png',
        omitBackground: true
    });
    console.log('Exported: logo-profil-carre.png (1600x1600 retina)');

    await browser.close();
    console.log('\nDone!');
})();

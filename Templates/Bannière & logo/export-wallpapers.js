const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const outputDir = __dirname;
    const htmlPath = path.resolve(__dirname, 'wallpaper-source.html');

    // Export desktop 4K — viewport adapté
    const page1 = await browser.newPage();
    await page1.setViewport({ width: 3840, height: 8000, deviceScaleFactor: 1 });
    await page1.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page1.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 2000));

    const desktop = await page1.$('.wallpaper-4k');
    await desktop.screenshot({
        path: path.join(outputDir, 'wallpaper-ouvalargent-4k.png'),
        type: 'png',
        omitBackground: false
    });
    console.log('Exported: wallpaper-ouvalargent-4k.png (3840x2160)');
    await page1.close();

    // Export phone — viewport adapté
    const page2 = await browser.newPage();
    await page2.setViewport({ width: 1170, height: 3000, deviceScaleFactor: 1 });
    await page2.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page2.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 2000));

    const phone = await page2.$('.wallpaper-phone');
    await phone.screenshot({
        path: path.join(outputDir, 'wallpaper-ouvalargent-phone.png'),
        type: 'png',
        omitBackground: false
    });
    console.log('Exported: wallpaper-ouvalargent-phone.png (1170x2532)');
    await page2.close();

    await browser.close();
    console.log('\nDone!');
})();

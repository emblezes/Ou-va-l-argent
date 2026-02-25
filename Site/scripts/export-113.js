const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  const srcDir = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Sources HTML';
  const outDir = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Insta & Autres';

  const slides = [
    { html: '113-dette-naissance-bebe.html', png: '113-dette-naissance-bebe-instagram.png' },
    { html: '113bis-dette-naissance-bebe.html', png: '113bis-dette-naissance-bebe-instagram.png' },
    { html: '113ter-dette-naissance-bebe.html', png: '113ter-dette-naissance-bebe-instagram.png' },
    { html: '113quater-dette-naissance-bebe.html', png: '113quater-dette-naissance-bebe-instagram.png' },
  ];

  for (const s of slides) {
    const filePath = path.join(srcDir, s.html);
    await page.goto('file://' + filePath, { waitUntil: 'networkidle0', timeout: 15000 });
    const el = await page.$('.infographic');
    await el.screenshot({ path: path.join(outDir, s.png) });
    console.log('OK:', s.png);
  }

  await browser.close();
  console.log('Done!');
})();

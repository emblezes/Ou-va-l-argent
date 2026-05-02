const puppeteer = require('puppeteer');
const path = require('path');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const HTML_DIR = path.join(BASE, 'Infographies', 'Sources HTML');
const OUT_DIR = path.join(BASE, 'Infographies', 'Insta & Autres');

const FILES = [
  '226-dette-etat-augmentation-2025',
  '227-charge-interets-vs-defense-education',
  '228-charge-interets-doublee-2020-2025',
  '229-economies-vs-impots-cdc-2025',
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  for (const name of FILES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
    await page.goto('file://' + path.join(HTML_DIR, name + '.html'), { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 400));
    const el = await page.$('.infographic');
    const out = path.join(OUT_DIR, name + '-instagram.png');
    await el.screenshot({ path: out, type: 'png' });
    console.log('✓', out);
    await page.close();
  }
  await browser.close();
})();

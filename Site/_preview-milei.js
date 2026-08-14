const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const htmlPath = "/Users/emmanuelblezes/Documents/08_Où va l'argent /Production interne/Réseaux Sociaux /Actus chaudes/2026-06-18-milei-bilan/milei-bilan.html";
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.setViewport({ width: 1160, height: 1200, deviceScaleFactor: 1 });
  await new Promise(r => setTimeout(r, 500));
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    const name = await page.evaluate(el => el.getAttribute('data-name'), slides[i]);
    await slides[i].screenshot({ path: `/tmp/preview-${i+1}-${name}.png` });
    console.log('OK', name);
  }
  await browser.close();
})();

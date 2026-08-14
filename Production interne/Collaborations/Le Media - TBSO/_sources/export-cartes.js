#!/usr/bin/env node
// Export les 3 cartes VIF en PNG 1080x1080 retina (deviceScaleFactor 2)

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const HERE = __dirname;
const OUT  = path.resolve(HERE, '..');

const CARTES = [
  { html: 'carte-vif-salaire.html', png: 'carte-VIF-01-salaire-france-suisse.png' },
  { html: 'carte-vif-impots.html',  png: 'carte-VIF-02-impots-france-suisse.png'  },
  { html: 'carte-vif-pib.html',     png: 'carte-VIF-03-pib-france-suisse.png'     },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  for (const { html, png } of CARTES) {
    const file = path.join(HERE, html);
    if (!fs.existsSync(file)) { console.error(`MISS ${file}`); continue; }
    const url = 'file://' + file.replace(/ /g, '%20').replace(/'/g, '%27');
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 300));
    const out = path.join(OUT, png);
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    const sz = (fs.statSync(out).size / 1024).toFixed(0);
    console.log(`OK  ${png}  (${sz} Ko)`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

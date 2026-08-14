const puppeteer = require('puppeteer');
const path = require('path');
const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const HTML = path.join(BASE, 'Infographies', 'Sources HTML', '262-droits-succession-ocde.html');
const OUT = path.join(BASE, 'Infographies', 'Insta & Autres', '262-droits-succession-ocde-instagram.png');
(async () => {
  const browser = await puppeteer.launch({ defaultViewport: { width: 1080, height: 1080, deviceScaleFactor: 2 } });
  const page = await browser.newPage();
  await page.goto('file://' + HTML, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  const el = await page.$('.infographic');
  await el.screenshot({ path: OUT, type: 'png' });
  await browser.close();
  console.log('OK', OUT);
})();

const puppeteer = require('puppeteer');
const path = require('path');

const HTML_FILE = path.join(
  '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Sources HTML',
  '50-pib-habitant-evolution-5-pays.html'
);
const OUTPUT = path.join(
  '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Insta & Autres',
  '50-pib-habitant-evolution-5-pays.png'
);

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await page.goto('file://' + HTML_FILE, { waitUntil: 'networkidle0', timeout: 15000 });

  const el = await page.$('.infographic');
  await el.screenshot({ path: OUTPUT, type: 'png' });

  console.log('Exported:', OUTPUT);
  await browser.close();
})();

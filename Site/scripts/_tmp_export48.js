const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  const htmlPath = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Sources HTML/48-cout-total-salarie-europe.html';
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  const el = await page.$('.infographic');
  await el.screenshot({ path: '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Insta & Autres/48-cout-total-salarie-europe-instagram.png' });
  console.log('Done');
  await browser.close();
})();

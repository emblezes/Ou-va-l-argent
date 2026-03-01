const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 2 });

  const htmlPath = path.resolve(__dirname, 'banniere-linkedin-neutre.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });

  const el = await page.$('#banner');
  await el.screenshot({
    path: path.resolve(__dirname, 'banniere-linkedin-neutre.png'),
    type: 'png'
  });

  console.log('OK: banniere-linkedin-neutre.png exportée (1584x396 @2x)');
  await browser.close();
})();

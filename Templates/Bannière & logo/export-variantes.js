const puppeteer = require('puppeteer');
const path = require('path');

const variants = [
  { id: 'v1', name: 'banniere-linkedin-v1-cyan-clair' },
  { id: 'v2', name: 'banniere-linkedin-v2-cyan-or' },
  { id: 'v3', name: 'banniere-linkedin-v3-violet-cyan' },
  { id: 'v4', name: 'banniere-linkedin-v4-multi-couleurs' },
  { id: 'v5', name: 'banniere-linkedin-v5-bleu-doux' },
  { id: 'v6', name: 'banniere-linkedin-v6-aurore-boreale' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1584, height: 2600, deviceScaleFactor: 2 });

  const htmlPath = path.resolve(__dirname, 'banniere-linkedin-variantes.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });

  for (const v of variants) {
    const el = await page.$('#' + v.id);
    const outPath = path.resolve(__dirname, v.name + '.png');
    await el.screenshot({ path: outPath, type: 'png' });
    console.log('OK:', v.name + '.png');
  }

  await browser.close();
  console.log('\n6 variantes exportées !');
})();

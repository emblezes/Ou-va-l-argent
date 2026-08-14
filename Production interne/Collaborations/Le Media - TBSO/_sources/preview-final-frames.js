#!/usr/bin/env node
// Preview la frame finale (t=10000ms) de chaque template vidéo pour valider le layout.
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const HERE = __dirname;
const TEMPLATES = ['video-vif-salaire.html', 'video-vif-impots.html', 'video-vif-pib.html'];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  for (const tpl of TEMPLATES) {
    const file = path.join(HERE, tpl);
    const url = 'file://' + file.replace(/ /g, '%20').replace(/'/g, '%27') + '?capture';
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => window.__reelReady === true, { timeout: 10000 });
    await page.evaluate(() => window.setReelTime(9000));
    await new Promise(r => setTimeout(r, 200));
    const out = path.join(HERE, '_preview-' + tpl.replace('.html', '.png'));
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    console.log('OK preview ' + path.basename(out));
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

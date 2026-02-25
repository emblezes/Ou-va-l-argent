const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const HTML_DIR = path.join(BASE, 'Infographies', 'Sources HTML');
const INSTA_DIR = path.join(BASE, 'Infographies', 'Insta & Autres');
const TIKTOK_V_DIR = path.join(BASE, 'Infographies', 'Tiktok Vertical');
const TIKTOK_H_DIR = path.join(BASE, 'Infographies', 'Tiktok Horizontal');

const file = '06-depenses-vs-recettes-france.html';
const slug = '06-depenses-vs-recettes-france';

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const htmlPath = 'file://' + path.join(HTML_DIR, file);

  const script = fs.readFileSync(path.join(__dirname, 'batch-export-all.js'), 'utf8');
  const tiktokMatch = script.match(/const TIKTOK_CSS = `([\s\S]*?)`;/);
  const rectMatch = script.match(/const RECTANGLE_CSS = `([\s\S]*?)`;/);
  const TIKTOK_CSS = tiktokMatch[1];
  const RECTANGLE_CSS = rectMatch[1];

  // Instagram
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await page1.goto(htmlPath, { waitUntil: 'networkidle0' });
  const el1 = await page1.$('.infographic');
  await el1.screenshot({ path: path.join(INSTA_DIR, slug + '-instagram.png') });
  console.log('Instagram OK');
  await page1.close();

  // TikTok V
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
  await page2.goto(htmlPath, { waitUntil: 'networkidle0' });
  await page2.addStyleTag({ content: TIKTOK_CSS });
  await wait(500);
  const el2 = await page2.$('.infographic');
  await el2.screenshot({ path: path.join(TIKTOK_V_DIR, slug + '-tiktok-v.png') });
  console.log('TikTok V OK');
  await page2.close();

  // TikTok H
  const page3 = await browser.newPage();
  await page3.setViewport({ width: 1080, height: 600, deviceScaleFactor: 2 });
  await page3.goto(htmlPath, { waitUntil: 'networkidle0' });
  // Pour TikTok H : page custom avec juste le titre
  await page3.setContent(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Syne', sans-serif; background: #1a1a2e; padding: 0; display: flex; justify-content: center; }
        .infographic {
          width: 1080px; height: 600px; position: relative; overflow: hidden;
        }
        .bg-base {
          position: absolute; inset: 0;
          background: linear-gradient(145deg, #06080c 0%, #0a1628 50%, #06080c 100%);
        }
        .bg-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,71,87,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,71,87,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .bg-glow {
          position: absolute; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,71,87,0.1) 0%, transparent 70%);
          top: -200px; right: -100px; pointer-events: none;
        }
        .content {
          position: relative; z-index: 1; height: 100%;
          padding: 20px 50px 20px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .logo {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
        }
        .logo-icon { font-family: 'Instrument Serif', serif; font-size: 3.2rem; color: #00d4ff; line-height: 1; }
        .logo-text { font-family: 'Instrument Serif', serif; font-size: 1.6rem; font-style: italic; color: #fff; line-height: 1; }
        .title {
          font-family: 'Instrument Serif', serif;
          font-size: 5.5rem;
          color: #f0f4f8;
          text-align: center;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .website {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.8rem; font-weight: 600; color: #00d4ff;
        }
      </style>
    </head>
    <body>
      <div class="infographic">
        <div class="bg-base"></div>
        <div class="bg-grid"></div>
        <div class="bg-glow"></div>
        <div class="content">
          <div class="logo">
            <span class="logo-icon">€</span>
            <span class="logo-text">Où Va l'Argent ?</span>
          </div>
          <div class="title">L'État ne sait pas<br>gérer son argent</div>
          <div class="website">ouvalargent.com</div>
        </div>
      </div>
    </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });
  await wait(2000); // wait for fonts
  await wait(500);
  const el3 = await page3.$('.infographic');
  await el3.screenshot({ path: path.join(TIKTOK_H_DIR, slug + '-tiktok-h.png') });
  console.log('TikTok H OK');
  await page3.close();

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);

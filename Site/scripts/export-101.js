const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const HTML_DIR = path.join(BASE, 'Infographies', 'Sources HTML');
const INSTA_DIR = path.join(BASE, 'Infographies', 'Insta & Autres');
const TIKTOK_V_DIR = path.join(BASE, 'Infographies', 'Tiktok Vertical');
const TIKTOK_H_DIR = path.join(BASE, 'Infographies', 'Tiktok Horizontal');

const file = '101-etat-gaspille-votre-argent.html';
const slug = '101-etat-gaspille-votre-argent';

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const htmlPath = 'file://' + path.join(HTML_DIR, file);

  // Instagram (1080x1080)
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await page1.goto(htmlPath, { waitUntil: 'networkidle0' });
  const el1 = await page1.$('.infographic');
  await el1.screenshot({ path: path.join(INSTA_DIR, slug + '-instagram.png') });
  console.log('Instagram OK');
  await page1.close();

  // TikTok V (1080x1920) - titre en haut
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
  await page2.goto(htmlPath, { waitUntil: 'networkidle0' });
  await page2.addStyleTag({ content: `
    .infographic { height: 1920px !important; }
    .content { justify-content: flex-start !important; padding-top: 100px !important; }
    .title-wrapper { flex: 0 !important; margin-top: 80px !important; }
    .logo-icon { font-size: 6rem !important; }
    .logo-text { font-size: 3rem !important; }
    .title { font-size: 10rem !important; }
    .website { font-size: 2.4rem !important; margin-top: 60px !important; }
  `});
  await wait(500);
  const el2 = await page2.$('.infographic');
  await el2.screenshot({ path: path.join(TIKTOK_V_DIR, slug + '-tiktok-v.png') });
  console.log('TikTok V OK');
  await page2.close();

  // TikTok H (1080x600) - titre centré compact
  const page3 = await browser.newPage();
  await page3.setViewport({ width: 1080, height: 600, deviceScaleFactor: 2 });
  await page3.goto(htmlPath, { waitUntil: 'networkidle0' });
  await page3.addStyleTag({ content: `
    .infographic { height: 600px !important; }
    .content { padding: 15px 50px !important; }
    .logo-icon { font-size: 2.8rem !important; }
    .logo-text { font-size: 1.4rem !important; }
    .title { font-size: 5.5rem !important; }
    .website { font-size: 1.6rem !important; }
  `});
  await wait(500);
  const el3 = await page3.$('.infographic');
  await el3.screenshot({ path: path.join(TIKTOK_H_DIR, slug + '-tiktok-h.png') });
  console.log('TikTok H OK');
  await page3.close();

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);

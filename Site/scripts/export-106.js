const puppeteer = require('puppeteer');
const path = require('path');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const HTML_DIR = path.join(BASE, 'Infographies', 'Sources HTML');
const INSTA_DIR = path.join(BASE, 'Infographies', 'Insta & Autres');
const TIKTOK_V_DIR = path.join(BASE, 'Infographies', 'Tiktok Vertical');
const TIKTOK_H_DIR = path.join(BASE, 'Infographies', 'Tiktok Horizontal');

const file = '106-ou-va-largent.html';
const slug = '106-ou-va-largent';

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const htmlPath = 'file://' + path.join(HTML_DIR, file);

  // Instagram
  const p1 = await browser.newPage();
  await p1.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await p1.goto(htmlPath, { waitUntil: 'networkidle0' });
  await (await p1.$('.infographic')).screenshot({ path: path.join(INSTA_DIR, slug + '-instagram.png') });
  console.log('Instagram OK');
  await p1.close();

  // TikTok V
  const p2 = await browser.newPage();
  await p2.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
  await p2.goto(htmlPath, { waitUntil: 'networkidle0' });
  await p2.addStyleTag({ content: `
    .infographic { height: 1920px !important; }
    .content { align-items: flex-start !important; padding-top: 350px !important; justify-content: flex-start !important; }
    .title { font-size: 12rem !important; }
  `});
  await wait(500);
  await (await p2.$('.infographic')).screenshot({ path: path.join(TIKTOK_V_DIR, slug + '-tiktok-v.png') });
  console.log('TikTok V OK');
  await p2.close();

  // TikTok H
  const p3 = await browser.newPage();
  await p3.setViewport({ width: 1080, height: 600, deviceScaleFactor: 2 });
  await p3.goto(htmlPath, { waitUntil: 'networkidle0' });
  await p3.addStyleTag({ content: `
    .infographic { height: 600px !important; }
    .title { font-size: 6.5rem !important; }
  `});
  await wait(500);
  await (await p3.$('.infographic')).screenshot({ path: path.join(TIKTOK_H_DIR, slug + '-tiktok-h.png') });
  console.log('TikTok H OK');
  await p3.close();

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);

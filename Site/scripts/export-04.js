const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const HTML_DIR = path.join(BASE, 'Infographies', 'Sources HTML');
const INSTA_DIR = path.join(BASE, 'Infographies', 'Insta & Autres');
const TIKTOK_V_DIR = path.join(BASE, 'Infographies', 'Tiktok Vertical');
const TIKTOK_H_DIR = path.join(BASE, 'Infographies', 'Tiktok Horizontal');

const file = '04-deficit-historique-france.html';
const slug = '04-deficit-historique-france';

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
  await page3.addStyleTag({ content: RECTANGLE_CSS });
  await wait(500);
  const el3 = await page3.$('.infographic');
  await el3.screenshot({ path: path.join(TIKTOK_H_DIR, slug + '-tiktok-h.png') });
  console.log('TikTok H OK');
  await page3.close();

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);

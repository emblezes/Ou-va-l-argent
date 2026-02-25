const puppeteer = require('puppeteer');
const path = require('path');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const HTML_DIR = path.join(BASE, 'Infographies', 'Sources HTML');
const INSTA_DIR = path.join(BASE, 'Infographies', 'Insta & Autres');

const SLIDES = [
  { file: '113-dette-naissance-bebe.html', slug: '113-dette-naissance-bebe' },
  { file: '113bis-dette-naissance-bebe.html', slug: '113bis-dette-naissance-bebe' },
  { file: '113ter-dette-naissance-bebe.html', slug: '113ter-dette-naissance-bebe' },
];

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const { file, slug } of SLIDES) {
    const p = await browser.newPage();
    await p.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(HTML_DIR, file), { waitUntil: 'networkidle0' });
    await (await p.$('.infographic')).screenshot({ path: path.join(INSTA_DIR, slug + '-instagram.png') });
    console.log(`${slug} OK`);
    await p.close();
  }

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);

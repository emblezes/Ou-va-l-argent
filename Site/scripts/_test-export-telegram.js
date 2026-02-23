#!/usr/bin/env node
/**
 * Test : exporte 4 infographies sans tag et les envoie sur Telegram
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

const HTML_DIR = path.join(__dirname, '../../Production interne/Réseaux Sociaux /Infographies/Sources HTML');
const TMP_DIR = '/tmp/ovla-test-notag';

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'telegram-config.json'), 'utf-8'));
const BOT_TOKEN = config.TELEGRAM_BOT_TOKEN;
const CHAT_ID = config.TELEGRAM_CHAT_ID;

// 4 infographies variées pour tester
const TEST_FILES = [
  '01-france-pologne-pib.html',
  '14-explosion-dette-france.html',
  '48-explosion-dette-publique-pib.html',
  '50-pib-habitant-evolution-5-pays.html'
];

async function exportPNG(browser, htmlFile) {
  const page = await browser.newPage();
  const htmlPath = path.join(HTML_DIR, htmlFile);
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });

  const el = await page.$('.infographic');
  if (!el) {
    console.log(`  ⚠ No .infographic element in ${htmlFile}`);
    await page.close();
    return null;
  }

  const outFile = path.join(TMP_DIR, htmlFile.replace('.html', '.png'));
  await el.screenshot({ path: outFile, type: 'png' });
  await page.close();
  return outFile;
}

function sendPhoto(filePath, caption) {
  return new Promise((resolve, reject) => {
    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
    const fileData = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    let body = '';
    body += `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${CHAT_ID}\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`;
    const footer = `\r\n--${boundary}--\r\n`;

    const bodyBuffer = Buffer.concat([
      Buffer.from(body, 'utf-8'),
      fileData,
      Buffer.from(footer, 'utf-8')
    ]);

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendPhoto`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bodyBuffer.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.ok) resolve(parsed);
        else reject(new Error(data));
      });
    });
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

(async () => {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

  console.log('Lancement du navigateur...');
  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1200, height: 1200, deviceScaleFactor: 1 } });

  const exported = [];
  for (const file of TEST_FILES) {
    console.log(`Exportation de ${file}...`);
    const png = await exportPNG(browser, file);
    if (png) exported.push({ file, png });
  }

  await browser.close();
  console.log(`\n${exported.length} infographies exportées.\n`);

  // Envoi sur Telegram
  for (const { file, png } of exported) {
    const name = file.replace('.html', '');
    console.log(`Envoi sur Telegram : ${name}...`);
    await sendPhoto(png, `🧪 Test sans tag — ${name}`);
    console.log(`  ✓ Envoyé !`);
  }

  console.log('\n✅ Terminé ! Vérifiez Telegram.');
})();

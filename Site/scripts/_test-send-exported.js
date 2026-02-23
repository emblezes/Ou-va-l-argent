#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const https = require('https');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies';
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'telegram-config.json'), 'utf-8'));

const files = [
  path.join(BASE, 'Insta & Autres', '01-france-pologne-comparaison-instagram.png'),
  path.join(BASE, 'Insta & Autres', '14-explosion-dette-france-instagram.png'),
  path.join(BASE, 'Insta & Autres', '48-cout-total-salarie-europe-instagram.png'),
];

function sendPhoto(filePath, caption) {
  return new Promise((resolve, reject) => {
    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
    const fileData = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    let body = `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${config.TELEGRAM_CHAT_ID}\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`;
    const bodyBuffer = Buffer.concat([Buffer.from(body), fileData, Buffer.from(`\r\n--${boundary}--\r\n`)]);
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${config.TELEGRAM_BOT_TOKEN}/sendPhoto`,
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': bodyBuffer.length }
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { const p = JSON.parse(d); p.ok ? resolve() : reject(d); }); });
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

(async () => {
  for (const f of files) {
    const name = path.basename(f);
    console.log(`Envoi : ${name}...`);
    await sendPhoto(f, `Nouveau logo — ${name}`);
    console.log(`  ✓ Envoyé !`);
  }
  console.log('\nTerminé !');
})();

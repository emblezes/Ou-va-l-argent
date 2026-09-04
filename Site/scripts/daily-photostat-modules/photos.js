/**
 * photos.js — télécharge une photo d'illustration depuis Pexels (photos pro, libres d'usage).
 */
const fs = require('fs');
const https = require('https');
const { secret } = require('./util');

const PROXY_URL = process.env.HTTPS_PROXY || process.env.https_proxy || '';
const proxyAgent = PROXY_URL ? new (require('https-proxy-agent').HttpsProxyAgent)(PROXY_URL) : undefined;
const REQUEST_TIMEOUT_MS = 15000;

// Attache un timeout à une requête https.get en cours : évite un hang indéfini
// si la connexion (ou le proxy) ne répond jamais.
function withTimeout(req, resolve, fallback) {
  req.setTimeout(REQUEST_TIMEOUT_MS, () => { req.destroy(); resolve(fallback); });
}

function pexelsSearch(query) {
  return new Promise((resolve) => {
    const u = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
    const req = https.get(u, { headers: { Authorization: secret('PEXELS_API_KEY') }, agent: proxyAgent }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => {
        try { const j = JSON.parse(d); resolve((j.photos || [])[0]?.src?.large2x || ''); }
        catch { resolve(''); }
      });
    }).on('error', () => resolve(''));
    withTimeout(req, resolve, '');
  });
}

function download(url, out) {
  return new Promise((resolve) => {
    const req = https.get(url, { agent: proxyAgent }, r => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        return download(r.headers.location, out).then(resolve);
      }
      const chunks = []; r.on('data', c => chunks.push(c));
      r.on('end', () => { try { fs.writeFileSync(out, Buffer.concat(chunks)); resolve(true); } catch { resolve(false); } });
    }).on('error', () => resolve(false));
    withTimeout(req, resolve, false);
  });
}

// Essaie la requête, puis un repli générique. Renvoie true si une image a été écrite.
async function fetchPhoto(query, outPath) {
  for (const q of [query, 'finance money business', 'euro money']) {
    const url = await pexelsSearch(q);
    if (url && await download(url, outPath)) return true;
  }
  return false;
}

module.exports = { fetchPhoto };

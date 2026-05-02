/**
 * Real image fetcher — Google Custom Search JSON API.
 *
 * Ancien : scraping Google Images via Puppeteer → bloqué par reCAPTCHA.
 * Nouveau : API officielle `googleapis.com/customsearch/v1?searchType=image`.
 *
 * Config requise (~/.zshrc) :
 *   GOOGLE_CSE_KEY — clé API Google Cloud (format "AIzaSy...")
 *   GOOGLE_CSE_CX  — Custom Search Engine ID (format "xxxxxxx:yyyyyyy")
 *
 * Quota gratuit : 100 requêtes/jour. Au-delà : 5 $/1000 requêtes.
 *
 * Retourne une LISTE de candidats (jusqu'à 10 par call). Le validateur
 * Claude vision (dans visual-fetcher) choisira le premier pertinent.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const IA_CACHE_DIR = path.join(__dirname, '..', '.video-ia-cache');
const CSE_ENDPOINT = 'https://www.googleapis.com/customsearch/v1';

function hashQuery(query) {
  return crypto.createHash('sha1').update('gimg:' + query).digest('hex').slice(0, 16);
}

/**
 * Appelle Google Custom Search pour trouver jusqu'à `limit` images.
 * @param {string} query — mots-clés (FR ou EN)
 * @param {number} limit — max 10 par appel API (on reste à 10)
 * @returns {Array<{ url, source, width, height }>}
 */
async function fetchGoogleCSECandidates({ query, limit = 10 }) {
  const key = process.env.GOOGLE_CSE_KEY;
  const cx = process.env.GOOGLE_CSE_CX;

  if (!key || !cx) {
    // graceful degradation : pas de clé = 0 candidat, le pipeline tentera
    // Wikimedia ensuite
    return [];
  }

  const params = new URLSearchParams({
    key,
    cx,
    q: query,
    searchType: 'image',
    num: String(Math.min(10, limit)),
    imgSize: 'large',
    safe: 'active',
    hl: 'fr',
  });

  try {
    const res = await fetch(`${CSE_ENDPOINT}?${params.toString()}`);
    if (!res.ok) {
      const body = await res.text();
      console.error(`  ⚠ Google CSE ${res.status}: ${body.slice(0, 200)}`);
      return [];
    }
    const data = await res.json();
    const items = data.items || [];
    return items.map((it) => ({
      url: it.link,
      source: 'google-cse',
      width: it.image?.width,
      height: it.image?.height,
      thumbnailUrl: it.image?.thumbnailLink,
    }));
  } catch (e) {
    console.error(`  ⚠ Google CSE error: ${e.message.slice(0, 100)}`);
    return [];
  }
}

async function downloadToFile(url, outPath) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  return outPath;
}

function ensureJpg(srcPath, destPath) {
  if (/\.jpe?g$/i.test(srcPath)) {
    if (srcPath !== destPath) fs.renameSync(srcPath, destPath);
    return destPath;
  }
  try {
    execSync(`ffmpeg -y -loglevel error -i "${srcPath}" -q:v 3 "${destPath}"`, { stdio: 'ignore' });
    if (fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
    return destPath;
  } catch {
    return srcPath;
  }
}

/**
 * Télécharge un candidat CSE dans le cache, renvoie son localPath.
 */
async function downloadCSECandidate({ url, queryHash, index = 0 }) {
  if (!fs.existsSync(IA_CACHE_DIR)) fs.mkdirSync(IA_CACHE_DIR, { recursive: true });
  const cacheBase = path.join(IA_CACHE_DIR, `gimg-${queryHash}-${index}`);
  const cachedJpg = cacheBase + '.jpg';
  if (fs.existsSync(cachedJpg) && fs.statSync(cachedJpg).size > 5000) {
    return cachedJpg;
  }

  // Détermine l'extension depuis l'URL
  const extMatch = url.match(/\.(jpg|jpeg|png|webp|avif|gif)(?:\?|$)/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const rawPath = cacheBase + '.' + ext;

  try {
    await downloadToFile(url, rawPath);
  } catch {
    return null;
  }

  if (!fs.existsSync(rawPath) || fs.statSync(rawPath).size < 5000) {
    return null;
  }

  const finalPath = ensureJpg(rawPath, cachedJpg);
  return fs.existsSync(finalPath) ? finalPath : null;
}

/**
 * Compat — usage sans validation, prend juste le 1er candidat.
 * Gardé pour rétrocompat éventuelle.
 */
async function fetchRealImage({ query, index = 0 }) {
  const candidates = await fetchGoogleCSECandidates({ query, limit: 1 });
  if (candidates.length === 0) return null;
  const qHash = hashQuery(query);
  const localPath = await downloadCSECandidate({ url: candidates[0].url, queryHash: qHash, index });
  if (!localPath) return null;
  return { localPath, source: 'google-cse' };
}

module.exports = {
  fetchRealImage,
  fetchGoogleCSECandidates,
  downloadCSECandidate,
  hashQuery,
};

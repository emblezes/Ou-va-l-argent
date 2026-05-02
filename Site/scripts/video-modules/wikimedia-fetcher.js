/**
 * Wikimedia Commons + Wikipedia FR image fetcher.
 *
 * Stratégie :
 *   1. Tentative Wikipedia FR : si la query ressemble à un titre d'article
 *      (nom propre, lieu, institution), on récupère le pageimage (= image
 *      principale de l'article, typiquement portrait officiel ou logo).
 *   2. Fallback Commons search : recherche plein texte dans les fichiers
 *      multimédia du projet Wikimedia.
 *
 * Renvoie : { localPath, source } ou null si rien trouvé.
 * Cache local dans .video-ia-cache/wiki-<hash>.jpg (partagé avec real-image-fetcher).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const IA_CACHE_DIR = path.join(__dirname, '..', '.video-ia-cache');

function hashQuery(query) {
  return crypto.createHash('sha1').update('wiki:' + query).digest('hex').slice(0, 16);
}

function userAgent() {
  return 'OVLA-Video-Pipeline/1.0 (contact: ouvalargent.com) https://ouvalargent.com';
}

// Capitalise un titre pour Wikipedia : "emmanuel macron" → "Emmanuel_Macron"
function toWikiTitle(query) {
  return query
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('_');
}

// 1. Wikipedia FR pageimage — pour les noms propres / titres d'articles.
// Prend les 1-4 premiers mots de la query comme titre probable.
async function fetchWikipediaPageImage(query) {
  // On essaie plusieurs titres candidats (mots 1-4, puis 1-2, puis 1 seul)
  const words = query.trim().split(/\s+/);
  const candidates = [];
  for (let n = Math.min(4, words.length); n >= 1; n--) {
    candidates.push(words.slice(0, n).join(' '));
  }

  for (const candidate of candidates) {
    const title = toWikiTitle(candidate);
    const url = `https://fr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1600&redirects=1&origin=*`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': userAgent() } });
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data.query?.pages || {};
      for (const p of Object.values(pages)) {
        if (p.pageid && p.thumbnail?.source) {
          return { url: p.thumbnail.source, title: p.title, matched: candidate };
        }
      }
    } catch (_) { /* next candidate */ }
  }
  return null;
}

// 2. Commons search — fallback plein texte sur les fichiers multimédia Wikimedia.
// Renvoie jusqu'à N candidats (ordre de pertinence Wikimedia).
async function fetchCommonsSearchCandidates(query, limit = 8) {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${limit}` +
    `&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1600&format=json&origin=*`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': userAgent() } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data.query?.pages || {};

    // Wikimedia renvoie les pages dans un dict; on trie par "index" pour
    // préserver l'ordre de pertinence.
    const sorted = Object.values(pages).sort((a, b) => (a.index || 0) - (b.index || 0));

    return sorted
      .map((p) => p.imageinfo?.[0])
      .filter((i) => i && (i.mime === 'image/jpeg' || i.mime === 'image/png'))
      .filter((i) => (i.width || 0) >= 400 && (i.height || 0) >= 400)
      .map((i) => ({ url: i.thumburl || i.url, source: 'wiki-commons' }));
  } catch (_) {
    return [];
  }
}

async function downloadToFile(url, outPath) {
  const res = await fetch(url, { headers: { 'User-Agent': userAgent() } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  return outPath;
}

// Normalise vers JPG pour Remotion/Img (évite WebP/SVG/autres exotiques)
function ensureJpg(srcPath) {
  if (/\.jpe?g$/i.test(srcPath)) return srcPath;
  const dest = srcPath.replace(/\.[^.]+$/, '.jpg');
  try {
    execSync(`ffmpeg -y -loglevel error -i "${srcPath}" -q:v 3 "${dest}"`, { stdio: 'ignore' });
    if (srcPath !== dest && fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
    return dest;
  } catch {
    return srcPath;
  }
}

/**
 * Retourne une LISTE de candidats d'image pour une query donnée.
 * Wikipedia FR pageimage + Commons search, jusqu'à ~6 candidats.
 */
async function fetchWikimediaCandidates({ query, limit = 6 }) {
  const candidates = [];

  const wikiHit = await fetchWikipediaPageImage(query);
  if (wikiHit) candidates.push({ url: wikiHit.url, source: 'wiki-page', title: wikiHit.title });

  const commonsHits = await fetchCommonsSearchCandidates(query, limit);
  for (const h of commonsHits) candidates.push(h);

  return candidates.slice(0, limit);
}

/**
 * Télécharge un candidat (URL) dans le cache, renvoie son localPath.
 * L'index permet de différencier les candidats d'une même query dans le cache.
 */
async function downloadWikimediaCandidate({ url, queryHash, index = 0 }) {
  if (!fs.existsSync(IA_CACHE_DIR)) fs.mkdirSync(IA_CACHE_DIR, { recursive: true });
  const cacheBase = path.join(IA_CACHE_DIR, `wiki-${queryHash}-${index}`);
  const cachedJpg = cacheBase + '.jpg';

  if (fs.existsSync(cachedJpg) && fs.statSync(cachedJpg).size > 5000) {
    return cachedJpg;
  }

  const extMatch = url.match(/\.(jpg|jpeg|png|webp|svg|gif)(?:\?|$)/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const rawPath = cacheBase + '.' + ext;

  try {
    await downloadToFile(url, rawPath);
  } catch {
    return null;
  }

  const finalPath = /\.jpe?g$/i.test(rawPath) ? rawPath : ensureJpg(rawPath);
  if (!fs.existsSync(finalPath) || fs.statSync(finalPath).size < 5000) return null;

  if (finalPath !== cachedJpg && fs.existsSync(finalPath)) {
    try { fs.renameSync(finalPath, cachedJpg); } catch {}
  }
  return fs.existsSync(cachedJpg) ? cachedJpg : finalPath;
}

/**
 * Compat — usage sans validation, prend juste le 1er candidat.
 * Gardé pour rétrocompat (fallback sans validator).
 */
async function fetchWikimediaImage({ query }) {
  const candidates = await fetchWikimediaCandidates({ query, limit: 1 });
  if (candidates.length === 0) return null;
  const qHash = hashQuery(query);
  const localPath = await downloadWikimediaCandidate({ url: candidates[0].url, queryHash: qHash, index: 0 });
  if (!localPath) return null;
  return { localPath, source: candidates[0].source };
}

module.exports = {
  fetchWikimediaImage,
  fetchWikimediaCandidates,
  downloadWikimediaCandidate,
  hashQuery,
};

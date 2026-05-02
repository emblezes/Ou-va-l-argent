/**
 * RSS image fetcher — images de presse FR fraîches (< 48h).
 *
 * Réutilise les 8 flux RSS déjà configurés dans telegram-config.json
 * (Le Monde, Le Figaro, BFM Business, Reuters FR, France Info, La Tribune,
 * 20 Minutes, Challenges).
 *
 * Pour chaque beat real-image, matche les mots-clés du texte contre les
 * articles des dernières 48h et retourne les candidats d'images de presse
 * (validées ensuite par Claude vision).
 *
 * Zéro dépendance API externe, zéro clé supplémentaire.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { loadConfig } = require('../journalist-modules/shared-utils');

const IA_CACHE_DIR = path.join(__dirname, '..', '.video-ia-cache');
const RSS_CACHE_FILE = path.join(__dirname, '..', '.rss-articles-cache.json');

// TTL 30 jours : on garde les articles indexés pendant 30 jours, même s'ils
// ne sont plus dans les flux RSS en cours. Permet de remonter à des articles
// plus anciens qui ont une image plus pertinente.
const CACHE_TTL_DAYS = 30;

// Cache in-memory pour le run courant
let articlesCache = null;
let articlesCacheTime = 0;

// Cache persistant sur disque — accumule les articles au fil des runs
function loadPersistentCache() {
  if (!fs.existsSync(RSS_CACHE_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(RSS_CACHE_FILE, 'utf-8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function savePersistentCache(articles) {
  const cutoff = Date.now() - CACHE_TTL_DAYS * 24 * 3600 * 1000;
  const kept = articles.filter((a) => a.pubTime >= cutoff);
  try {
    fs.writeFileSync(RSS_CACHE_FILE, JSON.stringify(kept, null, 2));
  } catch {}
}

// Déduplique par URL d'image (évite doublons quand un article est relayé)
function dedupArticles(list) {
  const seen = new Set();
  const out = [];
  for (const a of list) {
    const key = a.imageUrl;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(a);
  }
  return out;
}

function hashUrl(url) {
  return crypto.createHash('sha1').update('rss:' + url).digest('hex').slice(0, 16);
}

function userAgent() {
  return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
}

// ── Parsing RSS / Atom ──────────────────────────────────────

// Extrait l'URL d'une image depuis un bloc <item> ou <entry>
// Priorité : media:content > media:thumbnail > enclosure > img dans description
function extractImageUrl(block) {
  // 1. <media:content url="..." medium="image" />
  let m = block.match(/<media:content[^>]+url="([^"]+)"[^>]*(?:medium="image"|type="image\/[^"]*")/i);
  if (!m) m = block.match(/<media:content[^>]+(?:medium="image"|type="image\/[^"]*")[^>]*url="([^"]+)"/i);
  if (m) return m[1];

  // 2. <media:thumbnail url="..." />
  m = block.match(/<media:thumbnail[^>]+url="([^"]+)"/i);
  if (m) return m[1];

  // 3. <enclosure url="..." type="image/..." />
  m = block.match(/<enclosure[^>]+url="([^"]+)"[^>]+type="image\//i);
  if (!m) m = block.match(/<enclosure[^>]+type="image\/[^"]+"[^>]+url="([^"]+)"/i);
  if (m) return m[1];

  // 4. <img src="..."> dans le <description> ou <content>
  const desc = block.match(/<(?:description|content(?::encoded)?)[^>]*>([\s\S]*?)<\/(?:description|content(?::encoded)?)>/i);
  if (desc) {
    const inner = desc[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1');
    const imgMatch = inner.match(/<img[^>]+src="([^"]+)"/i);
    if (imgMatch) return imgMatch[1];
  }

  return null;
}

function parseTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]*>/g, '').trim() : '';
}

// ── Fetch et parse tous les flux RSS ────────────────────────

async function fetchAllArticlesWithImages({ maxAgeDays = CACHE_TTL_DAYS } = {}) {
  // Cache mémoire : si fetch < 10 min, on réutilise tel quel
  if (articlesCache && Date.now() - articlesCacheTime < 10 * 60 * 1000) {
    return articlesCache;
  }

  // 1. Charge le cache persistant (articles accumulés sur les runs précédents)
  const persistent = loadPersistentCache();

  // 2. Fetch les RSS courants pour récupérer les nouveautés
  const config = loadConfig();
  const sources = config.NEWS_SOURCES || [];
  const fresh = [];

  if (sources.length > 0) {
    await Promise.all(
      sources.map(async (source) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          const res = await fetch(source.url, {
            signal: controller.signal,
            headers: { 'User-Agent': userAgent() },
          });
          clearTimeout(timeout);
          if (!res.ok) return;
          const xml = await res.text();

          const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
          const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];

          for (const block of [...items, ...entries]) {
            const title = parseTag(block, 'title');
            const description = parseTag(block, 'description') || parseTag(block, 'summary');
            const pubDate =
              parseTag(block, 'pubDate') ||
              parseTag(block, 'published') ||
              parseTag(block, 'updated') ||
              parseTag(block, 'dc:date');
            const imageUrl = extractImageUrl(block);

            if (!title || !imageUrl) continue;
            const pubTime = pubDate ? new Date(pubDate).getTime() : NaN;

            fresh.push({
              title,
              description,
              imageUrl,
              source: source.name,
              pubDate,
              pubTime: isNaN(pubTime) ? Date.now() : pubTime,
            });
          }
        } catch {
          // silencieux — un flux RSS down ne doit pas casser le pipeline
        }
      })
    );
  }

  // 3. Merge persistant + frais, dédup par URL d'image, tri récent→ancien
  const cutoff = Date.now() - maxAgeDays * 24 * 3600 * 1000;
  const merged = dedupArticles([...fresh, ...persistent])
    .filter((a) => a.pubTime >= cutoff)
    .sort((a, b) => b.pubTime - a.pubTime);

  // 4. Persiste le cache enrichi (purge les > 30 jours)
  savePersistentCache(merged);

  articlesCache = merged;
  articlesCacheTime = Date.now();
  return merged;
}

// ── Matching mots-clés ──────────────────────────────────────

const STOPWORDS = new Set([
  'le','la','les','un','une','des','de','du','et','ou','à','a','au','aux','en','dans','sur','sous','par','pour','avec','sans','ce','cette','ces','son','sa','ses','mon','ma','mes','ton','ta','tes','notre','nos','votre','vos','leur','leurs','je','tu','il','elle','on','nous','vous','ils','elles','qui','que','quoi','dont','où','ou','si','non','pas','plus','moins','aussi','alors','donc','mais','car','ni','tout','tous','toute','toutes','même','meme','autre','autres','comme','sauf','c','est','ce','se','lui','t','d','l','n','s','m','j','qu','chez','très','tres','bien','déjà','deja','encore','peu','trop','avant','après','apres','depuis','pendant','vraiment','vraie','vrai'
]);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .match(/[a-z0-9]{3,}/g) || [];
}

function extractKeywords(text) {
  const tokens = tokenize(text).filter((t) => !STOPWORDS.has(t) && t.length >= 4);
  // Privilégie les mots de 6+ caractères (plus spécifiques)
  return [...new Set(tokens)].sort((a, b) => b.length - a.length);
}

// Score d'un article par rapport à une query
// Renforcé : bonus massif sur noms propres / termes techniques
function scoreArticle(article, beatKeywords, beatProperNouns) {
  const haystack = `${article.title} ${article.description}`.toLowerCase();

  let score = 0;

  // Noms propres — MATCH EXCEPTIONNEL (prime la pertinence topique)
  for (const noun of beatProperNouns) {
    if (haystack.includes(noun.toLowerCase())) score += 5;
  }

  // Mots significatifs du beat
  for (const kw of beatKeywords) {
    if (haystack.includes(kw)) score += 1;
  }

  // Bonus récence dégressif : actualité fraîche bonus, sinon neutre
  const ageHours = (Date.now() - article.pubTime) / (3600 * 1000);
  if (ageHours < 12) score += 2;
  else if (ageHours < 24) score += 1;
  else if (ageHours < 72) score += 0.5;
  // Pas de malus au-delà : un bon article d'il y a 2 semaines sur le bon
  // sujet bat un article du jour sans rapport.

  return score;
}

// ── Download ────────────────────────────────────────────────

async function downloadToFile(url, outPath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': userAgent() },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (!ct.startsWith('image/')) throw new Error(`not image: ${ct}`);
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
    const { execSync } = require('child_process');
    execSync(`ffmpeg -y -loglevel error -i "${srcPath}" -q:v 3 "${destPath}"`, { stdio: 'ignore' });
    if (fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
    return destPath;
  } catch {
    return srcPath;
  }
}

// ── API publique ────────────────────────────────────────────

/**
 * Retourne les N candidats RSS les plus pertinents pour un texte de beat donné.
 * @returns Array<{ url, title, source, pubDate }>
 */
async function fetchRssCandidates({ beatText, beatQuery, limit = 5 }) {
  const articles = await fetchAllArticlesWithImages();
  if (articles.length === 0) return [];

  const combined = `${beatText || ''} ${beatQuery || ''}`;
  const keywords = extractKeywords(combined);
  // Noms propres : mots commençant par majuscule dans le texte original
  const properNouns = (combined.match(/\b[A-ZÀÂÉÈÊËÎÏÔÙÛÜŸÇ][a-zàâéèêëîïôùûüÿç]{2,}(?:\s+[A-ZÀÂÉÈÊËÎÏÔÙÛÜŸÇ][a-zàâéèêëîïôùûüÿç]+)*/g) || [])
    .filter((n) => !STOPWORDS.has(n.toLowerCase()));

  const scored = articles
    .map((a) => ({ article: a, score: scoreArticle(a, keywords, properNouns) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ article, score }) => ({
    url: article.imageUrl,
    title: article.title,
    source: `rss-${article.source}`,
    pubDate: article.pubDate,
    score,
  }));
}

/**
 * Télécharge un candidat RSS dans le cache, renvoie son localPath.
 */
async function downloadRssCandidate({ url, beatQuery, index = 0 }) {
  if (!fs.existsSync(IA_CACHE_DIR)) fs.mkdirSync(IA_CACHE_DIR, { recursive: true });
  const cacheBase = path.join(IA_CACHE_DIR, `rss-${hashUrl(url)}-${index}`);
  const cachedJpg = cacheBase + '.jpg';
  if (fs.existsSync(cachedJpg) && fs.statSync(cachedJpg).size > 5000) return cachedJpg;

  const extMatch = url.match(/\.(jpg|jpeg|png|webp|avif|gif)(?:\?|$)/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const rawPath = cacheBase + '.' + ext;

  try {
    await downloadToFile(url, rawPath);
  } catch {
    return null;
  }

  if (!fs.existsSync(rawPath) || fs.statSync(rawPath).size < 5000) return null;

  const finalPath = ensureJpg(rawPath, cachedJpg);
  return fs.existsSync(finalPath) ? finalPath : null;
}

module.exports = {
  fetchRssCandidates,
  downloadRssCandidate,
  fetchAllArticlesWithImages,
};

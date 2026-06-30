/**
 * collect.js — récupère l'actu éco des dernières 24h (RSS) + déduplication 7 jours.
 */
const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

const SOURCES = require('./news-sources.json').NEWS_SOURCES;
const CACHE_PATH = path.join(__dirname, '..', '.daily-photostat-cache.json');
const TTL_DAYS = 7;

function loadCache() {
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    const cutoff = Date.now() - TTL_DAYS * 86400 * 1000;
    const cleaned = {};
    for (const [k, ts] of Object.entries(data)) if (ts > cutoff) cleaned[k] = ts;
    return cleaned;
  } catch { return {}; }
}
function saveCache(cache) { fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2)); }
function articleKey(a) { return (a.title || '').toLowerCase().replace(/[^a-zàâéèêëïîôùûüÿç0-9]/g, '').slice(0, 60); }

async function fetchAllRSS() {
  const all = [];
  for (const source of SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(source.url, { signal: controller.signal, headers: { 'User-Agent': 'OuVaLArgent-Bot/1.0' } });
      clearTimeout(timeout);
      const xml = await res.text();
      const parsed = await parseStringPromise(xml, { explicitArray: false });
      let items = [];
      if (parsed.rss?.channel?.item) items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
      else if (parsed.feed?.entry) items = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
      all.push(...items.slice(0, 10).map(item => ({
        title: item.title?._ || item.title || '',
        link: item.link?.$?.href || item.link || '',
        description: (item.description || item.summary?._ || item.summary || '').replace(/<[^>]*>/g, '').slice(0, 300),
        pubDate: item.pubDate || item.published || '',
        source: source.name
      })));
    } catch { /* silencieux */ }
  }
  return all;
}

async function collectFresh() {
  const cache = loadCache();
  const all = await fetchAllRSS();
  const fresh = all.filter(a => a.title && !cache[articleKey(a)]);
  return { all, fresh, cache };
}

module.exports = { collectFresh, loadCache, saveCache, articleKey, CACHE_PATH };

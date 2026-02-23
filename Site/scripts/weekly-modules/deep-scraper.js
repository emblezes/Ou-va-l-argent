/**
 * Phase 1 : Deep Scraper — Veille institutionnelle profonde
 *
 * Scrape les sources institutionnelles (INSEE, Cour des Comptes, Eurostat, etc.)
 * et produit un pool de 30-50 articles avec data points extraits.
 *
 * Cache 7 jours pour éviter de re-suggérer les mêmes sujets.
 */

const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

const SCRIPTS_DIR = path.join(__dirname, '..');
const SOURCES_PATH = path.join(SCRIPTS_DIR, 'weekly-sources.json');
const CACHE_PATH = path.join(SCRIPTS_DIR, '.weekly-deep-scrape-cache.json');

const CACHE_TTL = 7 * 24 * 3600 * 1000; // 7 jours

// ── Cache ────────────────────────────────────────────

function loadCache() {
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    const cutoff = Date.now() - CACHE_TTL;
    const cleaned = {};
    for (const [key, ts] of Object.entries(data)) {
      if (ts > cutoff) cleaned[key] = ts;
    }
    return cleaned;
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function articleKey(title) {
  return (title || '').toLowerCase().replace(/[^a-zàâéèêëïîôùûüÿç0-9]/g, '').slice(0, 80);
}

// ── RSS Fetcher ──────────────────────────────────────

async function fetchRSS(source) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'OuVaLArgent-WeeklyBot/1.0' }
    });
    clearTimeout(timeout);

    let xml = await res.text();
    // Clean common XML issues (unencoded &, invalid chars)
    xml = xml.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\da-fA-F]+);)/g, '&amp;');
    // Remove invalid XML characters
    xml = xml.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
    const parsed = await parseStringPromise(xml, { explicitArray: false });

    let items = [];
    if (parsed.rss?.channel?.item) {
      items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
    } else if (parsed.feed?.entry) {
      items = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
    }

    return items.slice(0, 15).map(item => ({
      title: (item.title?._ || item.title || '').trim(),
      link: item.link?.$?.href || item.link || '',
      description: (item.description || item.summary?._ || item.summary || item['content:encoded'] || '')
        .replace(/<[^>]*>/g, '').trim().slice(0, 500),
      pubDate: item.pubDate || item.published || item.updated || '',
      source: source.name,
      category: source.category,
      tags: source.tags || [],
      priority: source.priority || 2
    }));
  } catch (err) {
    console.log(`  ⚠ ${source.name}: ${err.message}`);
    return [];
  }
}

// ── Main Scraper ─────────────────────────────────────

async function deepScrape() {
  const sources = JSON.parse(fs.readFileSync(SOURCES_PATH, 'utf-8')).DEEP_SOURCES;
  const cache = loadCache();

  console.log(`\n🔍 Deep Scrape — ${sources.length} sources institutionnelles\n`);

  let allArticles = [];
  let stats = { total: 0, new: 0, cached: 0, errors: 0 };

  // Fetch all RSS sources in parallel (batches of 4)
  const BATCH_SIZE = 4;
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(s => fetchRSS(s)));

    for (let j = 0; j < batch.length; j++) {
      const articles = results[j];
      const source = batch[j];
      if (articles.length === 0) {
        stats.errors++;
        continue;
      }
      console.log(`  ✓ ${source.name}: ${articles.length} articles`);
      allArticles.push(...articles);
      stats.total += articles.length;
    }
  }

  // Filter out already seen articles
  const newArticles = allArticles.filter(a => {
    if (!a.title) return false;
    const key = articleKey(a.title);
    if (cache[key]) {
      stats.cached++;
      return false;
    }
    return true;
  });

  stats.new = newArticles.length;

  // Mark as seen
  for (const a of newArticles) {
    cache[articleKey(a.title)] = Date.now();
  }
  saveCache(cache);

  // Sort: priority 1 first, then by relevance (has numbers = more data-rich)
  newArticles.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    const aHasNumbers = /\d+[\s,.]?\d*\s*(%|€|milliard|million|Md|M€|point)/i.test(a.title + ' ' + a.description);
    const bHasNumbers = /\d+[\s,.]?\d*\s*(%|€|milliard|million|Md|M€|point)/i.test(b.title + ' ' + b.description);
    if (aHasNumbers && !bHasNumbers) return -1;
    if (!aHasNumbers && bHasNumbers) return 1;
    return 0;
  });

  console.log(`\n  📊 Total: ${stats.total} | Nouveaux: ${stats.new} | Cache: ${stats.cached} | Erreurs: ${stats.errors}`);

  return { articles: newArticles, stats };
}

// ── Save scrape results ──────────────────────────────

function getWeekNumber(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return {
    year: d.getFullYear(),
    week: Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7) + 1
  };
}

function saveScrapeResults(articles, stats) {
  const { year, week } = getWeekNumber();
  const weekStr = `${year}-W${String(week).padStart(2, '0')}`;
  const outputPath = path.join(SCRIPTS_DIR, `.weekly-scrape-${weekStr}.json`);

  const output = {
    week: weekStr,
    scraped_at: new Date().toISOString(),
    stats,
    articles
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`  💾 Sauvé: ${path.basename(outputPath)} (${articles.length} articles)\n`);

  return outputPath;
}

module.exports = { deepScrape, saveScrapeResults, getWeekNumber, loadCache, articleKey };

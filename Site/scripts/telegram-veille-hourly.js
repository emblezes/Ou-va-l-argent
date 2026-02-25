/**
 * Veille horaire — "Où va l'argent"
 *
 * Version allégée qui tourne toutes les heures :
 *   - Ne montre que les NOUVELLES actus (déduplication via cache JSON)
 *   - Format flash (court, 5 actus max)
 *   - Pas de création de carrousel (ça c'est le pipeline daily)
 *
 * Usage:
 *   node telegram-veille-hourly.js            # Veille flash horaire
 *   node telegram-veille-hourly.js --reset     # Réinitialiser le cache (tout redevient "nouveau")
 *   node telegram-veille-hourly.js --dry-run   # Test sans envoi Telegram
 *
 * Cron (toutes les heures de 7h à 23h) :
 *   0 7-23 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/telegram-veille-hourly.js
 */

const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

// ── Config ──────────────────────────────────────────
const SCRIPTS_DIR = __dirname;
const CONFIG_PATH = path.join(SCRIPTS_DIR, 'telegram-config.json');
const CACHE_PATH = path.join(SCRIPTS_DIR, '.veille-cache.json');
const _fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NEWS_SOURCES, ANTHROPIC_API_KEY } = config;

// ── Cache des articles déjà vus ─────────────────────
function loadCache() {
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    // Nettoyer les entrées de plus de 48h
    const cutoff = Date.now() - 48 * 3600 * 1000;
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

function articleKey(article) {
  return article.title.toLowerCase().replace(/[^a-zàâéèêëïîôùûüÿç0-9]/g, '').slice(0, 60);
}

// ── Telegram ────────────────────────────────────────
async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    const data = await res.json();
    return data.ok;
  } catch (e) {
    console.error('  ⚠ Telegram:', e.message);
    return false;
  }
}

// ── RSS ─────────────────────────────────────────────
async function fetchAllRSS() {
  let allArticles = [];
  for (const source of NEWS_SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(source.url, { signal: controller.signal, headers: { 'User-Agent': 'OuVaLArgent-Bot/1.0' } });
      clearTimeout(timeout);
      const xml = await res.text();
      const parsed = await parseStringPromise(xml, { explicitArray: false });
      let items = [];
      if (parsed.rss?.channel?.item) {
        items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
      } else if (parsed.feed?.entry) {
        items = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
      }
      const mapped = items.slice(0, 10).map(item => ({
        title: item.title?._ || item.title || '',
        link: item.link?.$?.href || item.link || '',
        description: (item.description || item.summary?._ || item.summary || '').replace(/<[^>]*>/g, '').slice(0, 200),
        pubDate: item.pubDate || item.published || '',
        source: source.name
      }));
      allArticles.push(...mapped);
    } catch (err) {
      // Silencieux en mode horaire
    }
  }
  return allArticles;
}

// ── Claude API (synthèse flash) ─────────────────────
async function askClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await res.json();
  if (data.error) {
    console.error('  ❌ Claude:', JSON.stringify(data.error));
    return '';
  }
  return data.content?.[0]?.text || '';
}

// ── MAIN ────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const reset = args.includes('--reset');

  if (reset) {
    if (fs.existsSync(CACHE_PATH)) fs.unlinkSync(CACHE_PATH);
    console.log('🗑️ Cache réinitialisé');
    process.exit(0);
  }

  const now = new Date();
  const hour = now.getHours();
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  // Charger le cache
  const cache = loadCache();
  const cacheSize = Object.keys(cache).length;

  // Récupérer les articles
  const allArticles = await fetchAllRSS();

  // Filtrer : seulement les nouveaux (pas dans le cache)
  const newArticles = allArticles.filter(a => {
    const key = articleKey(a);
    return !cache[key];
  });

  console.log(`[${timeStr}] ${allArticles.length} articles, ${newArticles.length} nouveaux (cache: ${cacheSize})`);

  if (newArticles.length === 0) {
    console.log('  Rien de nouveau, pas d\'envoi.');
    saveCache(cache); // Sauvegarde le cache nettoyé
    process.exit(0);
  }

  // Marquer comme vus
  for (const a of newArticles) {
    cache[articleKey(a)] = Date.now();
  }
  saveCache(cache);

  // Si moins de 3 nouvelles actus, envoyer en format simple (sans Claude)
  if (newArticles.length < 3) {
    const msg = `⚡ <b>Flash éco — ${timeStr}</b>\n\n` +
      newArticles.map(a => `• <b>${a.title}</b>\n<i>${a.source}</i>\n${a.link}`).join('\n\n');

    if (!dryRun) {
      await sendTelegram(msg);
      console.log('  ✓ Flash envoyé (sans Claude, peu d\'actus)');
    } else {
      console.log('  [DRY RUN] Flash :', msg.slice(0, 200) + '...');
    }
    process.exit(0);
  }

  // Synthèse Claude (format flash)
  const articlesText = newArticles.slice(0, 20).map((a, i) =>
    `[${i + 1}] ${a.source} | ${a.title}\n${a.description}\n${a.link}`
  ).join('\n\n');

  const prompt = `Tu es un analyste économique pour "Où va l'argent" (ouvalargent.com).

Voici les NOUVELLES actualités économiques (pas encore envoyées) :

${articlesText}

Sélectionne les 3-5 plus importantes et donne pour chacune :
- Un titre reformulé percutant (1 ligne)
- Un résumé en 1-2 phrases
- Le lien source

Format STRICT (texte brut, pas de markdown) :

⚡ FLASH ÉCO — ${timeStr}

1. [TITRE]
[Résumé court]
🔗 [lien]

2. [TITRE]
...

Sois concis. Maximum 5 actus.`;

  const synthesis = await askClaude(prompt);

  if (!synthesis) {
    console.log('  ❌ Synthèse vide');
    process.exit(1);
  }

  if (!dryRun) {
    // Découper si trop long
    const fullMsg = `💰 <b>Où va l'argent</b>\n\n${synthesis}`;
    if (fullMsg.length <= 4096) {
      await sendTelegram(fullMsg);
    } else {
      await sendTelegram(fullMsg.slice(0, 4090) + '...');
    }
    console.log(`  ✓ Flash envoyé (${synthesis.length} car.)`);
  } else {
    console.log(`  [DRY RUN] ${synthesis.length} car.`);
    console.log(synthesis.slice(0, 300) + '...');
  }
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});

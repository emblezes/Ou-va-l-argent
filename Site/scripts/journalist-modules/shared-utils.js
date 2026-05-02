/**
 * Utilitaires partagés pour le pipeline journaliste
 *
 * Centralise les patterns déjà utilisés dans les autres scripts :
 * - askClaude() — API Claude (Haiku/Sonnet)
 * - sendTelegram(), sendTelegramPhoto() — Bot Telegram
 * - loadConfig() — Chargement config avec env vars
 * - loadCache(), saveCache() — Cache JSON avec TTL
 * - slugify() — Conversion texte → slug
 */

const fs = require('fs');
const path = require('path');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent ';
const SCRIPTS_DIR = path.join(BASE, 'Site/scripts');
const CONFIG_PATH = path.join(SCRIPTS_DIR, 'telegram-config.json');
const NOTION_CONFIG_PATH = path.join(SCRIPTS_DIR, 'notion-config.json');

// ── Config ──────────────────────────────────────────

function loadConfig() {
  const telegramConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const notionConfig = JSON.parse(fs.readFileSync(NOTION_CONFIG_PATH, 'utf-8'));
  const merged = { ...telegramConfig, ...notionConfig };
  return Object.fromEntries(
    Object.entries(merged).map(([k, v]) => [k, process.env[k] || v])
  );
}

// ── Claude API ──────────────────────────────────────

async function askClaude(prompt, model = 'claude-haiku-4-5-20251001', maxTokens = 4000) {
  const config = loadConfig();
  const apiKey = process.env.ANTHROPIC_API_KEY || config.ANTHROPIC_API_KEY;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Claude API error: ${data.error.message}`);
  }
  return data.content?.[0]?.text || '';
}

// ── Telegram ────────────────────────────────────────

function getTelegramConfig() {
  const config = loadConfig();
  return {
    token: config.TELEGRAM_BOT_TOKEN,
    chatId: config.TELEGRAM_CHAT_ID
  };
}

async function sendTelegram(text) {
  const { token, chatId } = getTelegramConfig();
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('  ⚠ Telegram:', e.message);
    return { ok: false };
  }
}

async function sendTelegramPhoto(photoPath, caption = '') {
  const { token, chatId } = getTelegramConfig();
  const url = `https://api.telegram.org/bot${token}/sendPhoto`;
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const photoData = fs.readFileSync(photoPath);
  const fileName = path.basename(photoPath);

  const parts = [];
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`));
  if (caption) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`));
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n`));
  }
  const mime = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${fileName}"\r\nContent-Type: ${mime}\r\n\r\n`));
  parts.push(photoData);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body: Buffer.concat(parts)
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('  ⚠ Telegram photo:', e.message);
    return { ok: false };
  }
}

async function sendTelegramVideo(videoPath, caption = '') {
  const { token, chatId } = getTelegramConfig();
  const url = `https://api.telegram.org/bot${token}/sendVideo`;
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const videoData = fs.readFileSync(videoPath);
  const fileName = path.basename(videoPath);

  const parts = [];
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`));
  if (caption) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`));
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n`));
  }
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="supports_streaming"\r\n\r\ntrue\r\n`));
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="video"; filename="${fileName}"\r\nContent-Type: video/mp4\r\n\r\n`));
  parts.push(videoData);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body: Buffer.concat(parts)
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('  ⚠ Telegram video:', e.message);
    return { ok: false };
  }
}

// ── Cache ───────────────────────────────────────────

function loadCache(cachePath, ttlHours = 72) {
  if (!fs.existsSync(cachePath)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    const cutoff = Date.now() - ttlHours * 3600 * 1000;
    const cleaned = {};
    for (const [key, ts] of Object.entries(data)) {
      if (ts > cutoff) cleaned[key] = ts;
    }
    return cleaned;
  } catch {
    return {};
  }
}

function saveCache(cachePath, cache) {
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
}

function articleKey(title) {
  return title.toLowerCase()
    .replace(/[^a-zàâéèêëïîôùûüÿç0-9]/g, '')
    .slice(0, 60);
}

// ── Slugify ─────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// ── RSS ─────────────────────────────────────────────

async function fetchAllRSS() {
  const config = loadConfig();
  const sources = config.NEWS_SOURCES || [];
  const allArticles = [];

  for (const source of sources) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(source.url, { signal: controller.signal });
      clearTimeout(timeout);
      const xml = await res.text();

      // Parse RSS items
      const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
      // Parse Atom entries
      const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];

      const parseTag = (block, tag) => {
        const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
      };

      for (const item of [...items, ...entries]) {
        const title = parseTag(item, 'title');
        let link = parseTag(item, 'link');
        if (!link) {
          const hrefMatch = item.match(/<link[^>]+href="([^"]+)"/);
          if (hrefMatch) link = hrefMatch[1];
        }
        const description = parseTag(item, 'description').replace(/<[^>]*>/g, '').slice(0, 300);
        const pubDate = parseTag(item, 'pubDate') || parseTag(item, 'published') || parseTag(item, 'updated');

        if (title && link) {
          allArticles.push({
            title,
            link,
            description,
            pubDate,
            source: source.name
          });
        }
      }
    } catch (e) {
      console.error(`  ⚠ RSS ${source.name}: ${e.message}`);
    }
  }

  return allArticles;
}

// ── Notion File Upload ──────────────────────────────

async function uploadFileToNotion(filePath) {
  const { execSync } = require('child_process');
  const os = require('os');
  const filename = path.basename(filePath);
  const notionSecret = process.env.NOTION_SECRET || loadConfig().NOTION_SECRET;

  // Copy to temp dir to avoid path issues (apostrophes, spaces)
  const safePath = path.join(os.tmpdir(), `ovla-upload-${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
  const fsSU = require('fs');
  fsSU.copyFileSync(filePath, safePath);

  try {
    // Step 1: Create upload
    const createRes = JSON.parse(execSync(
      `curl -s -X POST "https://api.notion.com/v1/file_uploads" ` +
      `-H "Authorization: Bearer ${notionSecret}" ` +
      `-H "Content-Type: application/json" ` +
      `-H "Notion-Version: 2022-06-28" ` +
      `-d '{"mode":"single_part","filename":"${filename.replace(/'/g, '')}","content_type":"image/png"}'`,
      { encoding: 'utf8', timeout: 15000 }
    ));

    if (createRes.object === 'error') {
      throw new Error(`Notion upload create failed: ${createRes.message}`);
    }

    // Step 2: Send file
    const sendRes = JSON.parse(execSync(
      `curl -s -X POST "https://api.notion.com/v1/file_uploads/${createRes.id}/send" ` +
      `-H "Authorization: Bearer ${notionSecret}" ` +
      `-H "Notion-Version: 2022-06-28" ` +
      `-F "file=@${safePath};type=image/png"`,
      { encoding: 'utf8', timeout: 60000 }
    ));

    if (sendRes.status !== 'uploaded') {
      throw new Error(`Notion upload send failed: ${sendRes.message || sendRes.status}`);
    }

    return createRes.id;
  } finally {
    if (fsSU.existsSync(safePath)) fsSU.unlinkSync(safePath);
  }
}

// ── Exports ─────────────────────────────────────────

module.exports = {
  BASE,
  SCRIPTS_DIR,
  loadConfig,
  askClaude,
  sendTelegram,
  sendTelegramPhoto,
  sendTelegramVideo,
  getTelegramConfig,
  loadCache,
  saveCache,
  articleKey,
  slugify,
  fetchAllRSS,
  uploadFileToNotion
};

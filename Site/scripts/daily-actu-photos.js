/**
 * Pipeline quotidien — Illustrations d'actualité "photo + texte" (style pièce jointe)
 * "Où va l'argent"
 *
 * Tous les matins (7h) :
 *   1. Récupère les articles RSS (déduplication via cache 48h)
 *   2. Claude Haiku sélectionne 3 actus et rédige :
 *        - un TITRE chiffré et percutant (incrusté sur la photo)
 *        - un TEXTE d'accompagnement pédagogique, chiffré, ton affirmé et direct
 *        - une requête Google Images pour la photo de fond
 *   3. Pour chaque actu : télécharge la photo + génère 1 illustration PNG
 *        (1080×1350, photo plein cadre + gros titre blanc + logo & site en bas à droite)
 *   4. Envoie sur Telegram : image + texte d'accompagnement prêt à copier + lien source
 *   5. Range dans Actus chaudes/YYYY-MM-DD/
 *
 * Usage :
 *   node daily-actu-photos.js                 # Pipeline complet (3 illustrations + Telegram)
 *   node daily-actu-photos.js --count=3       # Nombre d'illustrations
 *   node daily-actu-photos.js --dry-run       # Génère les images sans envoyer sur Telegram
 *   node daily-actu-photos.js --reset         # Réinitialise le cache de déduplication
 *
 * Cron (tous les jours à 7h) :
 *   0 7 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && /usr/local/bin/node scripts/daily-actu-photos.js >> /tmp/ovla-daily-photos.log 2>&1
 *
 * Coût estimé : ~$1/mois (Haiku × 1 exécution/jour × 1 appel Claude)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseStringPromise } = require('xml2js');
const puppeteer = require('puppeteer');

// ── Chemins ──────────────────────────────────────────
const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent ';
const SCRIPTS_DIR = __dirname;
const RS_BASE = path.join(BASE, 'Production interne/Réseaux Sociaux ');
const ACTUS_DIR = path.join(RS_BASE, 'Actus chaudes');

// ── Config (secrets via ~/.zshrc, fallback fichier) ──
const CONFIG_PATH = path.join(SCRIPTS_DIR, 'telegram-config.json');
const CACHE_PATH = path.join(SCRIPTS_DIR, '.daily-photos-cache.json');
const _fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NEWS_SOURCES, ANTHROPIC_API_KEY } = config;

// ── Args ─────────────────────────────────────────────
const ARGS = process.argv.slice(2);
const DRY_RUN = ARGS.includes('--dry-run');
const RESET = ARGS.includes('--reset');
const COUNT = (() => {
  const a = ARGS.find(x => x.startsWith('--count='));
  return a ? Math.max(1, parseInt(a.replace('--count=', ''), 10) || 3) : 3;
})();

// ── Date ─────────────────────────────────────────────
const NOW = new Date();
const DATE_STR = NOW.toISOString().slice(0, 10);
const TIME_STR = NOW.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const DAY_DIR = path.join(ACTUS_DIR, DATE_STR);

const NODE_BIN = process.execPath;

// ── Cache déduplication ──────────────────────────────
function loadCache() {
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    const cutoff = Date.now() - 48 * 3600 * 1000;
    const cleaned = {};
    for (const [k, ts] of Object.entries(data)) if (ts > cutoff) cleaned[k] = ts;
    return cleaned;
  } catch { return {}; }
}
function saveCache(cache) { fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2)); }
function articleKey(a) { return a.title.toLowerCase().replace(/[^a-zàâéèêëïîôùûüÿç0-9]/g, '').slice(0, 60); }

// ── Nettoyage ────────────────────────────────────────
function cleanForTelegram(t) { return (t || '').replace(/<span[^>]*>/g, '').replace(/<\/span>/g, ''); }
function cleanMarkdown(t) {
  return (t || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1');
}
function escapeHtml(t) {
  return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Compression PNG → JPEG pour Telegram (sips macOS) ─
function compressForTelegram(pngPath) {
  const jpgPath = pngPath.replace(/\.png$/, '-tg.jpg');
  try {
    execSync(`sips -s format jpeg -s formatOptions 80 "${pngPath}" --out "${jpgPath}" 2>/dev/null`, { timeout: 10000 });
    return fs.existsSync(jpgPath) ? jpgPath : pngPath;
  } catch { return pngPath; }
}
function cleanupTelegramJpgs(dir) {
  try { fs.readdirSync(dir).filter(f => f.endsWith('-tg.jpg')).forEach(f => fs.unlinkSync(path.join(dir, f))); } catch {}
}

// ── Telegram ─────────────────────────────────────────
async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    return (await res.json()).ok;
  } catch (e) { console.error('  ⚠ Telegram:', e.message); return false; }
}

async function sendTelegramPhoto(photoPath, caption = '') {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const parts = [];
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}\r\n`));
  if (caption) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`));
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n`));
  }
  const fileBuf = fs.readFileSync(photoPath);
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${path.basename(photoPath)}"\r\nContent-Type: image/jpeg\r\n\r\n`));
  parts.push(fileBuf);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));
  const body = Buffer.concat(parts);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` }, body });
    const data = await res.json();
    if (!data.ok) console.error('  ⚠ Telegram photo:', data.description);
    return data.ok;
  } catch (e) { console.error('  ⚠ Telegram photo:', e.message); return false; }
}

// ── RSS ──────────────────────────────────────────────
async function fetchAllRSS() {
  let all = [];
  for (const source of NEWS_SOURCES) {
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

// ── Claude Haiku ─────────────────────────────────────
async function askClaude(prompt, maxTokens = 4000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await res.json();
  if (data.error) { console.error('  ❌ Claude:', JSON.stringify(data.error)); return ''; }
  return data.content?.[0]?.text || '';
}

// ── Sélection des 3 actus → titre + texte + photo ────
async function extractIdeas(articles, count = 3) {
  const articlesText = articles.slice(0, 25).map((a, i) => `[${i + 1}] ${a.source} | ${a.title}\n${a.description}\n${a.link}`).join('\n\n');

  const prompt = `Tu es analyste économique pour "Où va l'argent" (ouvalargent.com), un média éco/finance pédagogique au ton direct.

Voici les actualités économiques récentes :

${articlesText}

Sélectionne les ${count} actualités les plus FORTES (un chiffre marquant, un fait concret, un enjeu compris par tous) et transforme chacune en UNE illustration : une photo de fond + un gros titre incrusté + un texte d'accompagnement.

Pour chaque actu, retourne :
- "title" : le titre incrusté sur la photo. Court (max 10 mots), PERCUTANT, et CONTENANT UN OU DEUX CHIFFRES. Style : "L'inflation argentine est passée de 117% à 32%", "La France emprunte 50 milliards de plus qu'en 2023". PAS de markdown, PAS de point final.
- "accent_word" : 1 mot ou groupe (souvent le chiffre clé) à mettre en couleur dans le titre, OU "" si tout doit rester blanc.
- "search_query" : mots clés Google Images pour une PHOTO réaliste et concrète (personne connue, lieu, objet, scène). Évite les graphiques ou dessins.
- "telegram_text" : le TEXTE D'ACCOMPAGNEMENT prêt à copier-coller. 3 à 5 phrases. OBLIGATOIREMENT :
    * au moins 2 chiffres précis,
    * pédagogique (explique le mécanisme, le "pourquoi ça compte"),
    * ton affirmé et direct (phrases courtes, voix active, pas de langue de bois),
    * finit par 3-5 hashtags pertinents.
- "tag" : thème (Inflation, Dette, Impôts, Logement, Emploi, Énergie, Bourse, International, Pouvoir d'achat...).
- "accent_color" : couleur du chiffre/accent — "#ff4757" (alerte/dette), "#00d4ff" (neutre), "#ffd700" (or/finance), "#00ff88" (positif), "#ff9f43" (orange), "#a855f7" (international). Choisis selon le ton de l'actu.
- "source" : "Nom source · 2026".
- "source_url" : URL de l'article.

Retourne UNIQUEMENT un JSON strict (rien d'autre) :
[
  {
    "slug": "mot-cle-kebab-case",
    "title": "...",
    "accent_word": "...",
    "search_query": "...",
    "telegram_text": "...",
    "tag": "...",
    "accent_color": "#ff4757",
    "source": "...",
    "source_url": "..."
  }
]

Seulement ${count} idées. Réponds avec le JSON uniquement.`;

  const result = await askClaude(prompt);
  try {
    const m = result.match(/\[[\s\S]*\]/);
    if (!m) throw new Error('Pas de JSON');
    return JSON.parse(m[0]).slice(0, count);
  } catch (e) {
    console.error(`  ❌ Erreur JSON: ${e.message}`);
    console.log('  Réponse:', result.slice(0, 300));
    return [];
  }
}

// ── Téléchargement photo Google Images ───────────────
function downloadPhoto(searchQuery, outputPath, index = 1) {
  try {
    const out = execSync(
      `"${NODE_BIN}" "${path.join(SCRIPTS_DIR, 'download-google-image.js')}" "${searchQuery}" --output="${outputPath}" --index=${index}`,
      { encoding: 'utf-8', timeout: 45000, cwd: SCRIPTS_DIR }
    );
    const m = out.match(/PATH=(.+)/);
    const real = m ? m[1].trim() : outputPath;
    if (fs.existsSync(real)) return real;
  } catch (e) { console.error(`    ⚠ Photo échouée: ${e.message.split('\n')[0]}`); }
  return null;
}

// ── Template HTML illustration (photo + titre + logo/site bas-droite) ──
function generateIllustrationHTML(idea) {
  const accentColor = idea.accent_color || '#00d4ff';
  let title = escapeHtml(cleanMarkdown(idea.title || ''));
  const accent = cleanMarkdown(idea.accent_word || '').trim();
  if (accent) {
    const safe = escapeHtml(accent).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    title = title.replace(new RegExp(`(${safe})`, 'gi'), `<span class="accent">$1</span>`);
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Syne',sans-serif; background:#0a1220; display:flex; justify-content:center; }
  .illu { width:1080px; height:1350px; position:relative; overflow:hidden; }
  .bg-photo { position:absolute; inset:0; background-size:cover; background-position:center; background-color:#0a1220; }
  /* Assombrissement progressif pour lisibilité du titre et du logo (bas) */
  .overlay { position:absolute; inset:0; background:
      linear-gradient(to top, rgba(8,14,26,0.92) 0%, rgba(8,14,26,0.78) 22%, rgba(8,14,26,0.30) 48%, rgba(8,14,26,0.12) 70%, rgba(8,14,26,0.20) 100%); }
  .content { position:absolute; inset:0; z-index:2; display:flex; flex-direction:column; justify-content:flex-end; padding:70px 70px 150px; }
  .title { font-family:'Syne',sans-serif; font-weight:800; color:#ffffff; font-size:5rem; line-height:1.12;
           letter-spacing:-1px; text-align:center; text-shadow:0 4px 30px rgba(0,0,0,0.55); }
  .title .accent { color:${accentColor}; }
  /* Logo + site, en bas à droite */
  .brand { position:absolute; right:60px; bottom:55px; z-index:3; text-align:right; }
  .brand-logo { display:flex; align-items:center; justify-content:flex-end; gap:12px; }
  .brand-euro { font-family:'Instrument Serif',serif; font-size:2.6rem; color:${accentColor}; line-height:1; }
  .brand-name { font-family:'Instrument Serif',serif; font-style:italic; font-size:2.2rem; color:#ffffff; line-height:1;
                text-shadow:0 2px 12px rgba(0,0,0,0.6); }
  .brand-site { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:1.35rem; color:${accentColor};
                margin-top:8px; letter-spacing:0.5px; }
</style>
</head>
<body>
  <div class="illu">
    <div class="bg-photo"></div>
    <div class="overlay"></div>
    <div class="content">
      <div class="title">${title}</div>
    </div>
    <div class="brand">
      <div class="brand-logo">
        <span class="brand-euro">€</span>
        <span class="brand-name">Où Va l'Argent ?</span>
      </div>
      <div class="brand-site">ouvalargent.com</div>
    </div>
  </div>
</body>
</html>`;
}

// ── Génère 1 illustration PNG ────────────────────────
async function renderIllustration(browser, idea, name) {
  const htmlPath = path.join(DAY_DIR, `${name}.html`);
  const pngPath = path.join(DAY_DIR, `${name}.png`);
  fs.writeFileSync(htmlPath, generateIllustrationHTML(idea));

  const tmpPhoto = path.join(DAY_DIR, `${name}-photo.jpg`);
  console.log(`    📷 Photo: "${idea.search_query}"`);
  const photoPath = downloadPhoto(idea.search_query, tmpPhoto, 1);
  console.log(`    📷 ${photoPath ? 'OK' : 'ÉCHOUÉE'}`);

  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');

  if (photoPath) {
    const buf = fs.readFileSync(photoPath);
    const ext = path.extname(photoPath).toLowerCase().replace('.', '');
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    const uri = `data:${mime};base64,${buf.toString('base64')}`;
    await page.evaluate((u) => { const el = document.querySelector('.bg-photo'); if (el) el.style.backgroundImage = `url("${u}")`; }, uri);
    await new Promise(r => setTimeout(r, 800));
  }

  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 500));
  const el = await page.$('.illu');
  await el.screenshot({ path: pngPath, type: 'png' });
  await page.close();

  // Nettoyage temporaires
  for (const f of [htmlPath, photoPath]) { if (f && fs.existsSync(f)) fs.unlinkSync(f); }
  return pngPath;
}

// ── Prochain numéro d'illustration ───────────────────
function getNextNumber() {
  let max = 200;
  try {
    for (const dir of fs.readdirSync(ACTUS_DIR)) {
      const p = path.join(ACTUS_DIR, dir);
      if (!fs.statSync(p).isDirectory()) continue;
      for (const f of fs.readdirSync(p)) {
        const m = f.match(/^(\d+)-/);
        if (m) max = Math.max(max, parseInt(m[1], 10));
      }
    }
  } catch {}
  return max + 1;
}

// ── Main ─────────────────────────────────────────────
async function main() {
  console.log(`\n📸 Illustrations d'actu — ${DATE_STR} ${TIME_STR}\n`);

  if (RESET) { try { fs.unlinkSync(CACHE_PATH); } catch {} console.log('  ♻ Cache réinitialisé'); }

  if (!TELEGRAM_BOT_TOKEN || !ANTHROPIC_API_KEY) {
    console.error('  ❌ Secrets manquants (TELEGRAM_BOT_TOKEN / ANTHROPIC_API_KEY). Vérifie ~/.zshrc.');
    process.exit(1);
  }

  // 1. RSS + dédup
  console.log('  📰 Récupération RSS...');
  const articles = await fetchAllRSS();
  const cache = loadCache();
  const fresh = articles.filter(a => a.title && !cache[articleKey(a)]);
  console.log(`  ✓ ${articles.length} articles, ${fresh.length} nouveaux`);

  if (fresh.length === 0) {
    console.log('  ⏹ Rien de nouveau, on s\'arrête.');
    process.exit(0);
  }

  // 2. Sélection + rédaction via Haiku
  console.log('  🤖 Sélection + rédaction (Haiku)...');
  const ideas = await extractIdeas(fresh, COUNT);
  if (ideas.length === 0) { console.log('  ❌ Aucune idée'); process.exit(1); }
  console.log(`  ✓ ${ideas.length} idées`);

  // Marquer comme vus
  for (const a of fresh) cache[articleKey(a)] = Date.now();
  saveCache(cache);

  // 3. Dossier du jour
  if (!fs.existsSync(DAY_DIR)) fs.mkdirSync(DAY_DIR, { recursive: true });

  // 4. Rendu des illustrations
  const browser = await puppeteer.launch({ headless: true });
  let next = getNextNumber();
  const results = [];
  for (let i = 0; i < ideas.length; i++) {
    const idea = ideas[i];
    const name = `${next + i}-${idea.slug || 'actu'}`;
    console.log(`\n  🖼 [${i + 1}/${ideas.length}] ${name}`);
    try {
      const png = await renderIllustration(browser, idea, name);
      results.push({ idea, png, status: 'ok' });
      console.log(`    ✅ ${path.basename(png)}`);
    } catch (e) {
      console.error(`    ❌ ${e.message.split('\n')[0]}`);
      results.push({ idea, status: 'error' });
    }
  }
  await browser.close();

  const ok = results.filter(r => r.status === 'ok');
  console.log(`\n  📦 ${ok.length}/${ideas.length} illustrations créées`);

  // 5. Envoi Telegram
  if (DRY_RUN) { console.log('  [DRY RUN] Pas d\'envoi Telegram\n'); process.exit(0); }

  // Intro
  await sendTelegram(`☀️ <b>Idées illustrations du jour — ${DATE_STR}</b>\nVoici ${ok.length} propositions prêtes à publier.`);

  for (const r of ok) {
    const jpg = compressForTelegram(r.png);
    const caption = `🖼 <b>${escapeHtml(cleanForTelegram(r.idea.title || ''))}</b>\n🏷 ${escapeHtml(r.idea.tag || '')} · ${escapeHtml(r.idea.source || '')}`;
    const sent = await sendTelegramPhoto(jpg, caption);
    if (!sent) await sendTelegramPhoto(r.png, caption);
    await new Promise(rs => setTimeout(rs, 800));

    // Texte d'accompagnement prêt à copier + lien source
    const txt = `✏️ <b>Texte d'accompagnement :</b>\n\n${escapeHtml(cleanMarkdown(r.idea.telegram_text || ''))}` +
                (r.idea.source_url ? `\n\n🔗 ${escapeHtml(r.idea.source_url)}` : '');
    await sendTelegram(txt);
    await new Promise(rs => setTimeout(rs, 1200));
  }

  cleanupTelegramJpgs(DAY_DIR);
  console.log(`\n✅ [${TIME_STR}] ${ok.length} illustrations envoyées sur Telegram\n`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });

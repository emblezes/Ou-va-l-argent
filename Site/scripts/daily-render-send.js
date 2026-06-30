/**
 * daily-render-send.js — RENDU + ENVOI (zéro LLM, zéro coût API).
 * Prend le fichier de specs produit par la session Claude Code (abonnement) et :
 *   - actu-short : photo Pexels + rendu photo-stat (PNG 2160²)
 *   - graphiques + micro-dépense : rendu via graphic-render (courbe/barres/dot/hero)
 *   - envoi Telegram (photo + caption + texte) de tout
 *   - met à jour le journal anti-répétition (sent-log.json)
 *
 * Usage :
 *   node scripts/daily-render-send.js <today-specs.json> [--no-send]
 *
 * today-specs.json :
 * {
 *   "actuShort": [{ "slug","photo"(requête Pexels EN),"headline","reveal","source","caption","theme" }],
 *   "graphics":  [{ "id","type","title","metric","source","accent","unit","points|bars|dots","caption" }],
 *   "micro":     [{ "id","headline","figure","detail","source","accent","caption" }]
 * }
 */
const fs = require('fs');
const path = require('path');
const { buildHTML, exportPNGs } = require('./photo-stat-card');
const { renderGraphics } = require('./daily-photostat-modules/graphic-render');
const { fetchPhoto } = require('./daily-photostat-modules/photos');
const { sendTelegram, sendTelegramPhoto } = require('./daily-photostat-modules/deliver');
const { fixTypography, ensureFinalPeriod, escapeHtml, cleanMarkdown, stripBig } = require('./daily-photostat-modules/util');

const ARGS = process.argv.slice(2);
const NO_SEND = ARGS.includes('--no-send');
const specsPath = ARGS.find(a => !a.startsWith('--'));
if (!specsPath) { console.error('Usage: node scripts/daily-render-send.js <today-specs.json> [--no-send]'); process.exit(1); }

const DATE_STR = new Date().toISOString().slice(0, 10);
const OUT_DIR = path.join(__dirname, '.daily-output', DATE_STR);
const SENT_LOG = path.join(__dirname, 'daily-photostat-modules', 'sent-log.json');
const stripEm = s => (s || '').replace(/<\/?em>/g, '');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function renderActuShort(cards) {
  if (!cards.length) return [];
  fs.mkdirSync(path.join(OUT_DIR, 'photos'), { recursive: true });
  const cfg = [];
  for (const c of cards) {
    const rel = `photos/${c.slug}.jpg`;
    const ok = await fetchPhoto(c.photo || c.theme || 'finance money', path.join(OUT_DIR, rel));
    cfg.push({
      name: c.slug, photo: ok ? rel : '', photoPos: c.photoPos || 'center 30%',
      headline: ensureFinalPeriod(fixTypography((c.headline || '').trim())),
      reveal: ensureFinalPeriod(fixTypography((c.reveal || '').trim())),
      source: c.source || ''
    });
  }
  const htmlPath = path.join(OUT_DIR, 'actus-jour.html');
  fs.writeFileSync(htmlPath, buildHTML(cfg));
  await exportPNGs(OUT_DIR, htmlPath);
  return cards.map(c => ({ ...c, png: path.join(OUT_DIR, `${c.slug}.png`), kind: 'actu' }));
}

function microToSpec(m) {
  return {
    id: m.id, name: m.id, type: 'hero', title: ensureFinalPeriod(fixTypography((m.headline || '').trim())),
    figure: m.figure, detail: m.detail, source: m.source, accent: m.accent || '#ff4757', caption: m.caption
  };
}

async function deliverAll(items) {
  if (NO_SEND) { console.log('  [--no-send] rendu seul, pas d\'envoi.'); return; }
  await sendTelegram(`☀️ <b>Infographies du jour — ${DATE_STR}</b>\n${items.length} visuels prêts à publier.`);
  for (const g of items) {
    if (!g.png || !fs.existsSync(g.png)) continue;
    const title = stripBig(stripEm(g.title || g.headline || ''));
    const meta = g.kind === 'actu' ? `${g.theme || ''} · ${g.source || ''}` : `${(g.metric ? g.metric + ' · ' : '')}${g.source || ''}`;
    try {
      await sendTelegramPhoto(g.png, `📊 <b>${escapeHtml(title)}</b>\n🔖 ${escapeHtml(meta)}`);
      await sleep(700);
      if (g.caption) { await sendTelegram(`✏️ ${escapeHtml(cleanMarkdown(g.caption))}`); await sleep(1000); }
    } catch (e) { console.error('  ⚠ Telegram:', e.message); }
  }
}

function updateJournal(ids) {
  let log = []; try { log = JSON.parse(fs.readFileSync(SENT_LOG, 'utf8')); } catch {}
  fs.writeFileSync(SENT_LOG, JSON.stringify([...log, ...ids].slice(-500), null, 2));
}

(async () => {
  const specs = JSON.parse(fs.readFileSync(path.resolve(specsPath), 'utf8'));
  const actu = specs.actuShort || [];
  const graphics = (specs.graphics || []).map(g => ({ ...g, name: g.id, title: ensureFinalPeriod(fixTypography(g.title || '')) }));
  const micro = (specs.micro || []).map(microToSpec);

  console.log(`\n🖼  Rendu — ${actu.length} actu-short, ${graphics.length} graphiques, ${micro.length} micro-dépense`);
  const actuOut = await renderActuShort(actu);
  const gOut = await renderGraphics([...graphics, ...micro], path.join(OUT_DIR, 'graphics'));
  const gItems = gOut.map(g => ({ ...g, kind: 'graphic' }));
  const all = [...actuOut, ...gItems];
  console.log(`  ✓ ${all.filter(x => x.png && fs.existsSync(x.png)).length} PNG dans ${OUT_DIR}`);

  await deliverAll(all);

  const ids = [
    ...actu.map(c => c.slug || c.headline),
    ...graphics.map(g => g.id || g.title),
    ...micro.map(m => m.id || m.title)
  ].filter(Boolean);
  if (!NO_SEND) updateJournal(ids);
  console.log(`\n✅ Terminé — ${DATE_STR}\n`);
})().catch(e => { console.error('❌', e.message); process.exit(1); });

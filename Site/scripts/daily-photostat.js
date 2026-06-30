/**
 * daily-photostat.js — Pipeline quotidien d'infographies "actu-short" (photo-stat).
 * "Où Va l'Argent"
 *
 * Chaque jour (8h via GitHub Actions) :
 *   1. Collecte l'actu éco des dernières 24h (8 flux RSS) + déduplication 7 jours.
 *   2. Claude Sonnet sélectionne ~4 actus fortes (priorité angle OVLA) et rédige les cartes.
 *   3. Complète à 10 avec ~6 stat choc OVLA piochées dans la banque (rotation LRU, jamais la veille).
 *   4. Télécharge 1 photo Pexels par carte, génère 10 PNG 2160×2160 (format photo-stat validé).
 *   5. Livre sur Telegram (photo + caption + texte) ET par email (images inline + textes).
 *   6. Persiste l'état de déduplication (cache + banque) pour ne pas répéter le lendemain.
 *
 * Usage :
 *   node scripts/daily-photostat.js              # pipeline complet (Telegram + email)
 *   node scripts/daily-photostat.js --dry-run    # génère les PNG sans envoyer ni marquer l'état
 *   node scripts/daily-photostat.js --count=10   # nombre total de cartes (défaut 10)
 *   node scripts/daily-photostat.js --actus=4    # nombre d'actus RSS (le reste vient de la banque)
 */
const fs = require('fs');
const path = require('path');
const { collectFresh, saveCache, articleKey } = require('./daily-photostat-modules/collect');
const { selectActus } = require('./daily-photostat-modules/select');
const { pickStats, markUsed } = require('./daily-photostat-modules/ovla-bank');
const { captionForStat } = require('./daily-photostat-modules/captions');
const { fetchPhoto } = require('./daily-photostat-modules/photos');
const { renderCards } = require('./daily-photostat-modules/render');
const { renderGraphics } = require('./daily-photostat-modules/graphic-render');
const { pick: pickBank, markUsed: markBank } = require('./daily-photostat-modules/rotating-bank');
const { deliverTelegram, sendTelegram, sendTelegramPhoto } = require('./daily-photostat-modules/deliver');
const { secret, escapeHtml, cleanMarkdown, stripBig } = require('./daily-photostat-modules/util');

const GRAPHIC_BANK = require('./daily-photostat-modules/graphic-angles.json').angles;
const MICRO_BANK = require('./daily-photostat-modules/microdepense.json').facts;
const GA_STATE = path.join(__dirname, 'daily-photostat-modules', 'graphic-angles-state.json');
const MD_STATE = path.join(__dirname, 'daily-photostat-modules', 'microdepense-state.json');
const stripEm = s => (s || '').replace(/<\/?em>/g, '');

const ARGS = process.argv.slice(2);
const DRY = ARGS.includes('--dry-run');
const numArg = (k, def) => { const a = ARGS.find(x => x.startsWith(`--${k}=`)); return a ? Math.max(0, parseInt(a.split('=')[1], 10) || def) : def; };
const TOTAL = numArg('count', 10);
const ACTU_TARGET = numArg('actus', 4);

const DATE_STR = new Date().toISOString().slice(0, 10);
const OUT_DIR = path.join(__dirname, '.daily-output', DATE_STR);

async function main() {
  console.log(`\n📸 daily-photostat — ${DATE_STR}${DRY ? ' (DRY-RUN)' : ''}\n`);

  if (!secret('ANTHROPIC_API_KEY')) { console.error('❌ ANTHROPIC_API_KEY manquant'); process.exit(1); }

  // 1. Collecte RSS + dédup
  console.log('  📰 Collecte RSS...');
  const { all, fresh, cache } = await collectFresh();
  console.log(`  ✓ ${all.length} articles, ${fresh.length} nouveaux (24h)`);

  // 2. Sélection des actus (Sonnet)
  let actuCards = [];
  const wantActus = Math.min(ACTU_TARGET, fresh.length);
  if (wantActus > 0) {
    console.log(`  🤖 Sélection + rédaction de ${wantActus} actus (Sonnet)...`);
    try { actuCards = await selectActus(fresh, wantActus); }
    catch (e) { console.error('  ⚠ select:', e.message); actuCards = []; }
    console.log(`  ✓ ${actuCards.length} cartes actu`);
  } else {
    console.log('  ⏹ Pas d\'actu nouvelle — batch 100 % banque OVLA.');
  }

  // 3. Complément banque OVLA (rotation LRU)
  const need = Math.max(0, TOTAL - actuCards.length);
  const bankCards = pickStats(need);
  console.log(`  🏦 ${bankCards.length} stat choc OVLA piochées : ${bankCards.map(b => b.slug).join(', ')}`);
  console.log('  ✍️  Captions banque (Haiku)...');
  for (const b of bankCards) b.caption = await captionForStat(b);

  const cards = [...actuCards, ...bankCards];
  if (!cards.length) { console.log('  ❌ Aucune carte à produire'); process.exit(0); }

  // 4. Photos Pexels
  console.log('  🖼  Photos Pexels...');
  fs.mkdirSync(path.join(OUT_DIR, 'photos'), { recursive: true });
  for (const c of cards) {
    const rel = `photos/${c.slug}.jpg`;
    const ok = await fetchPhoto(c.photo || c.theme || 'finance', path.join(OUT_DIR, rel));
    c.photo_rel = ok ? rel : '';
    if (!ok) console.warn(`    ⚠ photo absente: ${c.slug}`);
  }

  // 5. Rendu PNG
  console.log('  📸 Rendu PNG 2160×2160...');
  const rendered = await renderCards(cards, OUT_DIR);
  const ok = rendered.filter(c => fs.existsSync(c.png));
  console.log(`  ✓ ${ok.length}/${cards.length} PNG (${OUT_DIR})`);
  const ovlaShare = Math.round(100 * (bankCards.length + actuCards.filter(c => /Impôt|Dette|Dépense|International|Fiscal/i.test(c.theme)).length) / ok.length);
  console.log(`  📊 ~${ovlaShare}% angle OVLA`);

  // 5b. Brique graphiques (2) + micro-dépense (1), banques fact-checkées en rotation
  const gAngles = pickBank(GRAPHIC_BANK, GA_STATE, 2).map(a => ({ ...a, name: a.id }));
  const mFacts = pickBank(MICRO_BANK, MD_STATE, 1).map(m => ({
    type: 'hero', name: m.id, title: m.headline, figure: m.figure, detail: m.detail,
    source: m.source, accent: m.accent || '#ff4757', caption: m.caption
  }));
  const graphicSpecs = [...gAngles, ...mFacts];
  let graphicsOut = [];
  if (graphicSpecs.length) {
    console.log(`  📈 ${gAngles.length} graphiques + ${mFacts.length} micro-dépense...`);
    graphicsOut = await renderGraphics(graphicSpecs, path.join(OUT_DIR, 'graphics'));
  }

  if (DRY) { console.log(`\n  [DRY-RUN] Pas d'envoi. ${ok.length} cartes + ${graphicsOut.length} graphiques générés.\n`); return; }

  // 6. Persistance dédup (avant envoi pour éviter doublon en cas de retry)
  for (const a of fresh) cache[articleKey(a)] = Date.now();
  saveCache(cache);
  markUsed(bankCards.map(b => b.slug));
  markBank(GA_STATE, gAngles.map(a => a.id));
  markBank(MD_STATE, mFacts.map(m => m.id));

  // 7. Livraison Telegram
  console.log('  📤 Telegram (actu-short)...');
  try { await deliverTelegram(ok, DATE_STR); } catch (e) { console.error('  ⚠ Telegram:', e.message); }

  if (graphicsOut.length) {
    console.log('  📤 Telegram (graphiques + micro-dépense)...');
    await sendTelegram(`📈 <b>Infographies du jour</b>`);
    for (const g of graphicsOut) {
      if (!fs.existsSync(g.png)) continue;
      const meta = (g.metric ? g.metric + ' · ' : '') + (g.source || '');
      try {
        await sendTelegramPhoto(g.png, `📊 <b>${escapeHtml(stripBig(stripEm(g.title)))}</b>\n🔖 ${escapeHtml(meta)}`);
        await new Promise(r => setTimeout(r, 700));
        if (g.caption) { await sendTelegram(`✏️ ${escapeHtml(cleanMarkdown(g.caption))}`); await new Promise(r => setTimeout(r, 1000)); }
      } catch (e) { console.error('  ⚠ Telegram graphique:', e.message); }
    }
  }

  console.log(`\n✅ ${ok.length} cartes + ${graphicsOut.length} graphiques livrés sur Telegram — ${DATE_STR}\n`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });

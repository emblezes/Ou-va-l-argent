/**
 * photo-stat-card.js — Générateur de visuels "photo-stat" autonomes (style BasicOptimism / OVLA)
 *
 * Format : photo réelle plein cadre + énoncé serif blanc + punchline chiffrée en or
 *          + logo OVLA (€ Où Va l'Argent ?) + ouvalargent.com en bas à gauche.
 * Chaque carte est INDÉPENDANTE (pas de carrousel) : publiable une par une.
 *
 * Usage :
 *   node scripts/photo-stat-card.js <config.json>            # génère HTML + PNG 2160x2160
 *   node scripts/photo-stat-card.js <config.json> --html-only # n'écrit que le HTML (preview)
 *
 * Config JSON (voir Templates/Réseaux sociaux/photo-stat-card.config.example.json) :
 * {
 *   "date": "2026-06-18",
 *   "batchSlug": "milei-bilan",
 *   "cards": [
 *     {
 *       "name": "milei-inflation",
 *       "photo": "photos/inflation.jpg",     // relatif au dossier de sortie
 *       "photoPos": "center 18%",            // background-position (garde le visage net)
 *       "headline": "Quand Milei est arrivé, l'inflation atteignait 211 % par an.",
 *       "reveal": "Fin 2025, elle est tombée à <big>31,5 %</big> — la plus basse depuis 8 ans.",
 *       "source": "INDEC"
 *     }
 *   ]
 * }
 *
 * - <big>...</big> dans `reveal` (ou `headline`) → met le chiffre en gros (62px).
 * - Le HTML est généré dans le dossier de sortie ; les photos doivent déjà y être (sous-dossier photos/).
 */

const fs = require('fs');
const path = require('path');

const BASE = "/Users/emmanuelblezes/Documents/08_Où va l'argent /Production interne/Réseaux Sociaux /Actus chaudes";

function esc(s) { return s; } // le HTML inline est autorisé (gras, <big>)

function buildHTML(cards) {
  const slides = cards.map((c, i) => `
<!-- ${i + 1}. ${c.name} -->
<div class="label">${i + 1} / ${c.name}</div>
<div class="slide" data-name="${c.name}"${c.fontScale ? ` style="--txt:${Math.round(54 * c.fontScale)}px; --big:${Math.round(62 * c.fontScale)}px;"` : ''}>
  <div class="bg" style="background-image:url('${c.photo}'); background-position:${c.photoPos || 'center 20%'};"></div>
  <div class="veil"></div>
  <div class="content">
    <div class="headline">${esc(c.headline)}</div>
    <div class="reveal">${esc(c.reveal)}</div>
  </div>
  <div class="brand"><div class="lockup"><span class="euro">€</span><span class="name">Où Va l'Argent ?</span></div><span class="url">ouvalargent.com</span></div>
</div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Photo-stat cards OVLA</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Lora:ital,wght@0,500;0,600;0,700;1,600;1,700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0a0a0a; font-family:'Lora',serif; display:flex; flex-wrap:wrap; gap:40px; padding:40px; justify-content:center; }
  .label { width:1080px; color:#888; font-family:'JetBrains Mono',monospace; font-size:14px; margin-bottom:-20px; text-transform:uppercase; letter-spacing:1px; }
  .slide { width:1080px; height:1080px; position:relative; overflow:hidden; background:#000; }
  .slide .bg { position:absolute; inset:0; background-size:cover; background-repeat:no-repeat; }
  .slide .veil {
    position:absolute; inset:0;
    background:linear-gradient(to top,
      rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.90) 28%, rgba(0,0,0,0.55) 48%,
      rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.10) 100%);
  }
  .slide .content {
    position:absolute; inset:0; z-index:2; padding:70px 70px 175px;
    display:flex; flex-direction:column; justify-content:flex-end;
  }
  .headline {
    font-family:'Lora',serif; font-weight:700; color:#ffffff;
    font-size:var(--txt,54px); line-height:1.22; letter-spacing:-0.3px;
    text-shadow:0 2px 18px rgba(0,0,0,0.6); text-wrap:balance;
  }
  .reveal {
    font-family:'Lora',serif; font-weight:700; color:#ffcf33;
    font-size:var(--txt,54px); line-height:1.22; letter-spacing:-0.3px; margin-top:30px;
    text-shadow:0 2px 18px rgba(0,0,0,0.6); text-wrap:balance;
  }
  .headline big, .reveal big { font-size:var(--big,62px); font-weight:700; }
  .brand {
    position:absolute; left:70px; bottom:56px; z-index:3;
    display:flex; flex-direction:column; align-items:flex-start; gap:6px;
  }
  .brand .lockup { display:flex; align-items:center; gap:13px; }
  .brand .euro { font-family:'Instrument Serif',serif; font-size:60px; color:#00d4ff; line-height:1; text-shadow:0 2px 12px rgba(0,0,0,0.7); }
  .brand .name { font-family:'Instrument Serif',serif; font-style:italic; font-size:34px; color:#ffffff; line-height:1; text-shadow:0 2px 12px rgba(0,0,0,0.7); }
  .brand .url  { font-family:'JetBrains Mono',monospace; font-weight:600; font-size:20px; color:#00d4ff; letter-spacing:0.5px; text-shadow:0 2px 10px rgba(0,0,0,0.7); }
</style>
</head>
<body>
${slides}
</body>
</html>
`;
}

async function exportPNGs(outDir, htmlPath) {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.setViewport({ width: 1160, height: 1200, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 600));
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    const name = await page.evaluate(el => el.getAttribute('data-name'), slides[i]);
    const out = path.join(outDir, `${name}.png`);
    await slides[i].screenshot({ path: out, type: 'png' });
    console.log('  ✓', name + '.png');
  }
  await browser.close();
}

async function main() {
  const args = process.argv.slice(2);
  const configPath = args.find(a => !a.startsWith('--'));
  const htmlOnly = args.includes('--html-only');
  if (!configPath) {
    console.error('Usage: node scripts/photo-stat-card.js <config.json> [--html-only]');
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(path.resolve(configPath), 'utf8'));
  const outDir = path.join(BASE, `${cfg.date}-${cfg.batchSlug}`);
  fs.mkdirSync(path.join(outDir, 'photos'), { recursive: true });

  const html = buildHTML(cfg.cards);
  const htmlPath = path.join(outDir, `${cfg.batchSlug}.html`);
  fs.writeFileSync(htmlPath, html);
  console.log(`\n📄 HTML : ${htmlPath}`);
  console.log(`   (placez les photos dans ${outDir}/photos/ )`);

  if (htmlOnly) {
    console.log('\n→ --html-only : ouvrez le HTML pour valider, puis relancez sans --html-only pour exporter.\n');
    return;
  }
  console.log('\n📸 Export PNG 2160×2160 :');
  await exportPNGs(outDir, htmlPath);
  console.log(`\n✅ ${cfg.cards.length} visuels exportés dans ${outDir}\n`);
}

module.exports = { buildHTML, exportPNGs, main };

if (require.main === module) {
  main().catch(e => { console.error('Erreur:', e); process.exit(1); });
}

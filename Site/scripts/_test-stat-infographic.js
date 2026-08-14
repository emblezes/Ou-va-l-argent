/**
 * _test-stat-infographic.js — TEST (brique séparée, ne touche pas daily-photostat).
 * Aligné sur le TEMPLATE ÉDITORIAL OVLA : logo € haut-gauche, titre centré ~5.4rem
 * (mot-clé italic+accent), PAS de sur-titre, zone graphique énorme (chiffres GROS),
 * footer : MÉTRIQUE + source discrète à gauche, ouvalargent.com en bas-droite.
 *
 *   node scripts/_test-stat-infographic.js [--send]
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { sendTelegram, sendTelegramPhoto } = require('./daily-photostat-modules/deliver');

const SEND = process.argv.includes('--send');
const OUT = path.join(__dirname, '.test-stat');
fs.mkdirSync(OUT, { recursive: true });

const fmt = v => (Number.isInteger(v)
  ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  : String(v).replace('.', ','));

const SPECS = [
  {
    name: 'impots-production', type: 'bars', accent: '#ff4757',
    title: 'Les impôts de production <em>écrasent</em> nos usines.',
    metric: 'Impôts sur la production, % du PIB', source: 'Eurostat, 2024', unit: '%',
    bars: [{ label: 'France', value: 4.4, hi: true }, { label: 'Moyenne UE', value: 1.8 }, { label: 'Allemagne', value: 1.0 }],
    caption: "La France taxe la production de ses entreprises à hauteur de 4,4 % du PIB, contre 1,0 % en Allemagne. Un handicap de compétitivité unique en Europe. #impôts #industrie #compétitivité"
  },
  {
    name: 'chomage-jeunes', type: 'dot', accent: '#ff9f43',
    title: 'Le chômage des jeunes, <em>mal français</em>.',
    metric: 'Taux de chômage des -25 ans', source: 'Eurostat, 2025', unit: '%',
    dots: [{ label: 'France', value: 18.1, hi: true }, { label: 'Zone euro', value: 14.2 }, { label: 'Allemagne', value: 6.8 }],
    caption: "En France, près d'un jeune actif sur cinq est au chômage : 18,1 %, contre 6,8 % en Allemagne. L'un des pires taux d'Europe. #emploi #jeunes #France"
  },
  {
    name: 'defaillances-entreprises', type: 'line', accent: '#ff4757',
    title: 'Les faillites d\'entreprises <em>au plus haut</em> en 35 ans.',
    metric: 'Défaillances d\'entreprises par an', source: 'Banque de France, 2025', unit: '',
    points: [{ x: '2021', y: 28000 }, { x: '2023', y: 56000 }, { x: '2025', y: 66000 }],
    caption: "Après le creux du « quoi qu'il en coûte », les défaillances d'entreprises ont bondi : 66 000 en 2025, un record sur 35 ans. La facture des aides, c'est maintenant. #entreprises #faillites #économie"
  },
  {
    name: 'patrimoine-fr-us', type: 'bars', accent: '#ffd700',
    title: 'Le patrimoine médian français bat <em>l\'américain</em>.',
    metric: 'Patrimoine médian par adulte, $', source: 'UBS, 2026', unit: ' $',
    bars: [{ label: 'France', value: 121898, display: '121 898', hi: true }, { label: 'États-Unis', value: 68998, display: '68 998' }],
    caption: "Le patrimoine médian d'un adulte français atteint 121 898 dollars, près du double de l'Américain médian (68 998 $). La richesse y est bien moins concentrée. #patrimoine #France #ÉtatsUnis"
  }
];

function lineSVG(s) {
  const W = 940, H = 540, padL = 36, padB = 64, padT = 70, padR = 60;
  const ys = s.points.map(p => p.y), ymax = Math.ceil(Math.max(...ys) / 20) * 20;
  const xstep = (W - padL - padR) / (s.points.length - 1);
  const X = i => padL + i * xstep, Y = v => padT + (H - padT - padB) * (1 - v / ymax);
  let grid = '';
  for (let g = 0; g <= ymax; g += ymax / 4) grid += `<line x1="${padL}" y1="${Y(g)}" x2="${W - padR}" y2="${Y(g)}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
  const dPath = s.points.map((p, i) => `${i ? 'L' : 'M'}${X(i)},${Y(p.y)}`).join(' ');
  const area = `M${X(0)},${Y(0)} ` + s.points.map((p, i) => `L${X(i)},${Y(p.y)}`).join(' ') + ` L${X(s.points.length - 1)},${Y(0)} Z`;
  const dots = s.points.map((p, i) => {
    const anchor = i === 0 ? 'start' : i === s.points.length - 1 ? 'end' : 'middle';
    const lx = i === 0 ? X(i) - 2 : i === s.points.length - 1 ? X(i) + 2 : X(i);
    return `<circle cx="${X(i)}" cy="${Y(p.y)}" r="9" fill="${s.accent}" stroke="#0a1220" stroke-width="3"/>
      <text x="${lx}" y="${Y(p.y) - 26}" fill="#fff" font-size="40" font-weight="700" text-anchor="${anchor}" font-family="JetBrains Mono">${fmt(p.y)}${s.unit}</text>
      <text x="${X(i)}" y="${H - padB + 40}" fill="#9fb3c8" font-size="26" text-anchor="middle" font-family="JetBrains Mono">${p.x}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%"><defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${s.accent}" stop-opacity="0.30"/><stop offset="100%" stop-color="${s.accent}" stop-opacity="0"/></linearGradient></defs>
    ${grid}<path d="${area}" fill="url(#ar)"/><path d="${dPath}" fill="none" stroke="${s.accent}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg>`;
}

function barsSVG(s) {
  const W = 940, H = 540, padL = 30, padB = 76, padT = 76, padR = 30;
  const vmax = Math.max(...s.bars.map(b => b.value)) * 1.12;
  const n = s.bars.length, gap = 70, bw = (W - padL - padR - gap * (n - 1)) / n;
  const Y = v => padT + (H - padT - padB) * (1 - v / vmax);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">` + s.bars.map((b, i) => {
    const x = padL + i * (bw + gap), y = Y(b.value), h = (H - padT - padB) - (y - padT);
    const val = (b.display || fmt(b.value)) + s.unit;
    return `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="10" fill="${b.hi ? s.accent : '#3b5d7a'}"/>
      <text x="${x + bw / 2}" y="${y - 20}" fill="#fff" font-size="48" font-weight="700" text-anchor="middle" font-family="JetBrains Mono">${val}</text>
      <text x="${x + bw / 2}" y="${H - padB + 44}" fill="${b.hi ? '#fff' : '#9fb3c8'}" font-size="30" font-weight="${b.hi ? 700 : 500}" text-anchor="middle" font-family="Syne">${b.label}</text>`;
  }).join('') + `</svg>`;
}

function dotSVG(s) {
  const W = 940, H = 540, padT = 40, padB = 40, xStart = 280, xEnd = W - 150;
  const vmax = Math.max(...s.dots.map(d => d.value)) * 1.18;
  const X = v => xStart + (xEnd - xStart) * (v / vmax);
  const rows = s.dots.length, rowH = (H - padT - padB) / rows;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">` + s.dots.map((d, i) => {
    const y = padT + i * rowH + rowH / 2;
    return `<text x="250" y="${y + 11}" fill="${d.hi ? '#fff' : '#9fb3c8'}" font-size="32" font-weight="${d.hi ? 700 : 500}" text-anchor="end" font-family="Syne">${d.label}</text>
      <line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="rgba(255,255,255,0.09)" stroke-width="2"/>
      <circle cx="${X(d.value)}" cy="${y}" r="17" fill="${d.hi ? s.accent : '#3b5d7a'}"/>
      <text x="${X(d.value) + 36}" y="${y + 13}" fill="#fff" font-size="40" font-weight="700" font-family="JetBrains Mono">${fmt(d.value)}${s.unit}</text>`;
  }).join('') + `</svg>`;
}

function buildHTML(s) {
  const chart = s.type === 'line' ? lineSVG(s) : s.type === 'dot' ? dotSVG(s) : barsSVG(s);
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{display:flex;justify-content:center;background:#000}
  .card{width:1080px;height:1080px;position:relative;overflow:hidden;
    background:linear-gradient(135deg,#0a1220 0%,#142b48 52%,#0a1220 100%);
    font-family:'Syne',sans-serif;display:flex;flex-direction:column;padding:58px 64px 46px}
  .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px);background-size:40px 40px}
  .glow{position:absolute;width:700px;height:700px;border-radius:50%;filter:blur(120px);opacity:0.42}
  .g1{top:-240px;right:-170px;background:${s.accent}30}
  .g2{bottom:-280px;left:-190px;background:rgba(0,212,255,0.15)}
  .logo{position:relative;display:flex;align-items:center;gap:13px}
  .logo .euro{font-family:'Instrument Serif',serif;font-size:4rem;color:#00d4ff;line-height:1}
  .logo .name{font-family:'Instrument Serif',serif;font-style:italic;font-size:1.9rem;color:#fff;line-height:1}
  .title{position:relative;font-family:'Instrument Serif',serif;font-size:5.4rem;line-height:1.02;
    letter-spacing:-1.8px;color:#fff;text-align:center;margin-top:26px;text-wrap:balance}
  .title em{font-style:italic;color:${s.accent}}
  .chart{position:relative;flex:1;display:flex;align-items:center;justify-content:center;padding:6px 0}
  .footer{position:relative;display:flex;justify-content:space-between;align-items:center;
    padding-top:16px;border-top:1px solid rgba(255,255,255,0.10)}
  .source{font-family:'JetBrains Mono',monospace;font-size:0.92rem;color:#8aa0b5;max-width:72%}
  .url{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:1.35rem;color:#00d4ff;white-space:nowrap}
</style></head>
<body><div class="card">
  <div class="grid"></div><div class="glow g1"></div><div class="glow g2"></div>
  <div class="logo"><span class="euro">€</span><span class="name">Où Va l'Argent ?</span></div>
  <div class="title">${s.title}</div>
  <div class="chart">${chart}</div>
  <div class="footer"><div class="source">${s.metric} · ${s.source}</div><div class="url">ouvalargent.com</div></div>
</div></body></html>`;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  const made = [];
  for (const s of SPECS) {
    const html = path.join(OUT, `${s.name}.html`), png = path.join(OUT, `${s.name}.png`);
    fs.writeFileSync(html, buildHTML(s));
    await page.goto('file://' + html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 500));
    await (await page.$('.card')).screenshot({ path: png, type: 'png' });
    console.log('✓', png);
    made.push({ s, png });
  }
  await browser.close();
  if (SEND) {
    await sendTelegram('🧪 <b>Test v3 — 4 angles, détail du métrique dans la source</b>');
    for (const m of made) {
      await sendTelegramPhoto(m.png, `📊 <b>${m.s.title.replace(/<\/?em>/g, '')}</b>\n🔖 ${m.s.metric} · ${m.s.source}`);
      await new Promise(r => setTimeout(r, 700));
      await sendTelegram(`✏️ ${m.s.caption}`);
      await new Promise(r => setTimeout(r, 900));
    }
    console.log('📤 Envoyé sur Telegram');
  }
})();

/**
 * graphic-render.js — rend des infographies GRAPHIQUES (courbe / barres / dot-plot / hero)
 * au format éditorial OVLA : logo € haut-gauche, titre centré HAUT (~5.4rem) sans sur-titre,
 * zone graphique énorme (chiffres gros), footer = métrique + source à gauche, ouvalargent.com à droite.
 *
 * Spec : { type:'line'|'bars'|'dot'|'hero', title, metric, source, accent, unit,
 *          points|bars|dots | figure+detail (hero), name }
 */
const fs = require('fs');
const path = require('path');

// Formate une série : décimales cohérentes (si un sibling a une décimale, tous en ont 1),
// espace fine insécable comme séparateur de milliers, espace fine avant '%'.
function makeFormatter(values, unit) {
  const decimals = values.some(v => Math.round(v) !== v) ? 1 : 0;
  const u = unit === '%' ? ' %' : (unit || '');
  return v => {
    let s = Number(v).toFixed(decimals).replace('.', ',');
    s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return s + u;
  };
}

function lineSVG(s) {
  const W = 940, H = 540, padL = 36, padB = 64, padT = 70, padR = 64;
  const f = makeFormatter(s.points.map(p => p.y), s.unit);
  const ys = s.points.map(p => p.y), ymax = Math.max(...ys) * 1.05;
  const xstep = (W - padL - padR) / (s.points.length - 1);
  const X = i => padL + i * xstep, Y = v => padT + (H - padT - padB) * (1 - v / ymax);
  let grid = '';
  for (let g = 1; g <= 4; g++) { const yy = padT + (H - padT - padB) * (g / 4); grid += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`; }
  const dPath = s.points.map((p, i) => `${i ? 'L' : 'M'}${X(i)},${Y(p.y)}`).join(' ');
  const area = `M${X(0)},${Y(0)} ` + s.points.map((p, i) => `L${X(i)},${Y(p.y)}`).join(' ') + ` L${X(s.points.length - 1)},${Y(0)} Z`;
  const dots = s.points.map((p, i) => {
    const last = i === s.points.length - 1;
    const anchor = i === 0 ? 'start' : last ? 'end' : 'middle';
    const lx = i === 0 ? X(i) - 2 : last ? X(i) + 2 : X(i);
    return `<circle cx="${X(i)}" cy="${Y(p.y)}" r="9" fill="${s.accent}" stroke="#0a1220" stroke-width="3"/>
      <text x="${lx}" y="${Y(p.y) - 26}" fill="#fff" font-size="40" font-weight="700" text-anchor="${anchor}" font-family="JetBrains Mono">${f(p.y)}</text>
      <text x="${X(i)}" y="${H - padB + 40}" fill="#9fb3c8" font-size="26" text-anchor="middle" font-family="JetBrains Mono">${p.x}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%"><defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${s.accent}" stop-opacity="0.30"/><stop offset="100%" stop-color="${s.accent}" stop-opacity="0"/></linearGradient></defs>
    ${grid}<path d="${area}" fill="url(#ar)"/><path d="${dPath}" fill="none" stroke="${s.accent}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg>`;
}

function barsSVG(s) {
  const W = 940, H = 540, padL = 30, padB = 76, padT = 80, padR = 30;
  const f = makeFormatter(s.bars.map(b => b.value), s.unit);
  const vmax = Math.max(...s.bars.map(b => b.value)) * 1.12;
  const n = s.bars.length, gap = 70, bw = (W - padL - padR - gap * (n - 1)) / n;
  const Y = v => padT + (H - padT - padB) * (1 - v / vmax);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">` + s.bars.map((b, i) => {
    const x = padL + i * (bw + gap), y = Y(b.value), h = (H - padT - padB) - (y - padT);
    return `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="10" fill="${b.hi ? s.accent : '#3b5d7a'}"/>
      <text x="${x + bw / 2}" y="${y - 20}" fill="#fff" font-size="48" font-weight="700" text-anchor="middle" font-family="JetBrains Mono">${f(b.value)}</text>
      <text x="${x + bw / 2}" y="${H - padB + 44}" fill="${b.hi ? '#fff' : '#9fb3c8'}" font-size="30" font-weight="${b.hi ? 700 : 500}" text-anchor="middle" font-family="Syne">${b.label}</text>`;
  }).join('') + `</svg>`;
}

function dotSVG(s) {
  const W = 940, H = 540, padT = 40, padB = 40, xStart = 280, xEnd = W - 150;
  const f = makeFormatter(s.dots.map(d => d.value), s.unit);
  const vmax = Math.max(...s.dots.map(d => d.value)) * 1.18;
  const X = v => xStart + (xEnd - xStart) * (v / vmax);
  const rows = s.dots.length, rowH = (H - padT - padB) / rows;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">` + s.dots.map((d, i) => {
    const y = padT + i * rowH + rowH / 2;
    return `<text x="250" y="${y + 11}" fill="${d.hi ? '#fff' : '#9fb3c8'}" font-size="32" font-weight="${d.hi ? 700 : 500}" text-anchor="end" font-family="Syne">${d.label}</text>
      <line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="rgba(255,255,255,0.09)" stroke-width="2"/>
      <circle cx="${X(d.value)}" cy="${y}" r="17" fill="${d.hi ? s.accent : '#3b5d7a'}"/>
      <text x="${X(d.value) + 36}" y="${y + 13}" fill="#fff" font-size="40" font-weight="700" font-family="JetBrains Mono">${f(d.value)}</text>`;
  }).join('') + `</svg>`;
}

function heroInner(s) {
  return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;width:100%">
    <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:9rem;line-height:1;color:${s.accent};letter-spacing:-2px">${s.figure}</div>
    <div style="font-family:'Syne',sans-serif;font-weight:600;font-size:1.8rem;color:#c7d4e0;margin-top:26px;max-width:820px;line-height:1.3">${s.detail || ''}</div>
  </div>`;
}

function buildHTML(s) {
  const chart = s.type === 'line' ? lineSVG(s) : s.type === 'dot' ? dotSVG(s) : s.type === 'hero' ? heroInner(s) : barsSVG(s);
  const footL = (s.metric ? s.metric + ' · ' : '') + (s.source || '');
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{display:flex;justify-content:center;background:#000}
  .card{width:1080px;height:1080px;position:relative;overflow:hidden;
    background:linear-gradient(135deg,#0a1220 0%,#142b48 52%,#0a1220 100%);
    font-family:'Syne',sans-serif;display:flex;flex-direction:column;padding:52px 64px 46px}
  .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px);background-size:40px 40px}
  .glow{position:absolute;width:700px;height:700px;border-radius:50%;filter:blur(120px);opacity:0.42}
  .g1{top:-240px;right:-170px;background:${s.accent}30}
  .g2{bottom:-280px;left:-190px;background:rgba(0,212,255,0.15)}
  .logo{position:relative;display:flex;align-items:center;gap:13px}
  .logo .euro{font-family:'Instrument Serif',serif;font-size:4rem;color:#00d4ff;line-height:1}
  .logo .name{font-family:'Instrument Serif',serif;font-style:italic;font-size:1.9rem;color:#fff;line-height:1}
  .title{position:relative;font-family:'Instrument Serif',serif;font-size:5.4rem;line-height:1.02;
    letter-spacing:-1.8px;color:#fff;text-align:center;margin-top:12px;text-wrap:balance}
  .title em{font-style:italic;color:${s.accent}}
  .chart{position:relative;flex:1;display:flex;align-items:center;justify-content:center;padding:6px 0}
  .footer{position:relative;display:flex;justify-content:space-between;align-items:center;
    padding-top:16px;border-top:1px solid rgba(255,255,255,0.10)}
  .source{font-family:'JetBrains Mono',monospace;font-size:0.92rem;color:#8aa0b5;max-width:74%}
  .url{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:1.35rem;color:#00d4ff;white-space:nowrap}
</style></head>
<body><div class="card">
  <div class="grid"></div><div class="glow g1"></div><div class="glow g2"></div>
  <div class="logo"><span class="euro">€</span><span class="name">Où Va l'Argent ?</span></div>
  <div class="title">${s.title}</div>
  <div class="chart">${chart}</div>
  <div class="footer"><div class="source">${footL}</div><div class="url">ouvalargent.com</div></div>
</div></body></html>`;
}

async function renderGraphics(specs, outDir) {
  if (!specs.length) return [];
  const puppeteer = require('puppeteer');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  const out = [];
  for (const s of specs) {
    const htmlPath = path.join(outDir, `${s.name}.html`), png = path.join(outDir, `${s.name}.png`);
    fs.writeFileSync(htmlPath, buildHTML(s));
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 450));
    await (await page.$('.card')).screenshot({ path: png, type: 'png' });
    out.push({ ...s, png });
  }
  await browser.close();
  return out;
}

module.exports = { buildHTML, renderGraphics };

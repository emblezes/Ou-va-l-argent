#!/usr/bin/env node
/**
 * GIF animé : évolution de la dette publique française 1974-2025
 * Génère des frames PNG via Puppeteer puis assemble en GIF via ffmpeg
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Dette publique française (Md€, sens Maastricht)
// Sources : INSEE, FIPECO, Banque de France, Eurostat
const DEBT_DATA = [
  [1974,   30], [1975,   35], [1976,   40], [1977,   47],
  [1978,   73], [1979,   82], [1980,   92], [1981,  110],
  [1982,  135], [1983,  160], [1984,  185], [1985,  228],
  [1986,  249], [1987,  272], [1988,  289], [1989,  310],
  [1990,  364], [1991,  396], [1992,  440], [1993,  500],
  [1994,  560], [1995,  664], [1996,  700], [1997,  726],
  [1998,  757], [1999,  792], [2000,  827], [2001,  862],
  [2002,  914], [2003,  993], [2004, 1067], [2005, 1145],
  [2006, 1153], [2007, 1212], [2008, 1319], [2009, 1493],
  [2010, 1591], [2011, 1717], [2012, 1834], [2013, 1925],
  [2014, 2004], [2015, 2098], [2016, 2148], [2017, 2218],
  [2018, 2315], [2019, 2375], [2020, 2650], [2021, 2813],
  [2022, 2950], [2023, 3101], [2024, 3305], [2025, 3482],
];

const SIZE = 1080;
const FPS = 20;
const TOTAL_FRAMES = DEBT_DATA.length * 4 + 40; // ~4 frames per year + 40 pause at end
const FRAME_DIR = path.join(__dirname, '../.tmp-gif-frames');
const OUTPUT_DIR = path.resolve(__dirname, '../../Production interne/Réseaux Sociaux /Infographies/Insta & Autres');
const OUTPUT_GIF = path.join(OUTPUT_DIR, 'dette-evolution-1974-2025.gif');

function generateHTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0f1a2e; display: flex; justify-content: center; }
  .infographic {
    width: ${SIZE}px; height: ${SIZE}px;
    position: relative; overflow: hidden;
  }
  .bg-base {
    position: absolute; inset: 0;
    background: linear-gradient(145deg, #0f1a2e 0%, #162544 50%, #0f1a2e 100%);
  }
  .bg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255, 71, 87, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 71, 87, 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  canvas { position: relative; z-index: 2; }
</style>
</head>
<body>
<div class="infographic">
  <div class="bg-base"></div>
  <div class="bg-grid"></div>
  <canvas id="c" width="${SIZE}" height="${SIZE}"></canvas>
</div>
<script>
const DATA = ${JSON.stringify(DEBT_DATA)};
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

const CHART_LEFT = 230;
const CHART_RIGHT = 1020;
const CHART_TOP = 220;
const CHART_BOTTOM = 870;
const CHART_W = CHART_RIGHT - CHART_LEFT;
const CHART_H = CHART_BOTTOM - CHART_TOP;
const MAX_DEBT = 3700;
const MIN_YEAR = 1974;
const MAX_YEAR = 2025;

function xForYear(year) {
  return CHART_LEFT + ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * CHART_W;
}
function yForDebt(debt) {
  return CHART_BOTTOM - (debt / MAX_DEBT) * CHART_H;
}

function formatDebt(v) {
  if (v >= 1000) return (v / 1000).toFixed(2).replace('.', ',') + ' T';
  return Math.round(v) + ' Md';
}

window.drawFrame = function(progress) {
  ctx.clearRect(0, 0, ${SIZE}, ${SIZE});

  // -- Logo --
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff4757';
  ctx.font = "italic 56px 'Instrument Serif', serif";
  ctx.fillText('€', ${SIZE}/2 - 120, 62);
  ctx.fillStyle = '#ffffff';
  ctx.font = "italic 28px 'Instrument Serif', serif";
  ctx.fillText("Où Va l'Argent ?", ${SIZE}/2 + 10, 60);

  // -- Title --
  ctx.fillStyle = '#ffffff';
  ctx.font = "700 52px 'Syne', sans-serif";
  ctx.fillText("50 ans d'évolution de la", ${SIZE}/2, 120);
  ctx.fillText('dette publique de la France', ${SIZE}/2, 180);

  // -- Grid lines --
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  const gridValues = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500];
  for (const v of gridValues) {
    const y = yForDebt(v);
    ctx.beginPath();
    ctx.moveTo(CHART_LEFT, y);
    ctx.lineTo(CHART_RIGHT, y);
    ctx.stroke();
    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = "600 26px 'JetBrains Mono', monospace";
    ctx.textAlign = 'right';
    let label = '0 €';
    if (v > 0 && v < 1000) label = v + ' Md€';
    else if (v >= 1000) label = (v / 1000).toFixed(1).replace('.0', '').replace('.', ',') + ' T€';
    ctx.fillText(label, CHART_LEFT - 18, y + 9);
  }
  ctx.setLineDash([]);

  // -- Year labels --
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = "600 26px 'JetBrains Mono', monospace";
  for (let yr = 1980; yr <= 2025; yr += 10) {
    const x = xForYear(yr);
    ctx.fillText(yr, x, CHART_BOTTOM + 38);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, CHART_TOP);
    ctx.lineTo(x, CHART_BOTTOM);
    ctx.stroke();
  }

  // -- Axes --
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(CHART_LEFT, CHART_TOP);
  ctx.lineTo(CHART_LEFT, CHART_BOTTOM);
  ctx.lineTo(CHART_RIGHT, CHART_BOTTOM);
  ctx.stroke();

  // -- Data curve (animated) --
  const totalPoints = DATA.length;
  const pointProgress = progress * totalPoints;
  const visiblePoints = Math.min(Math.floor(pointProgress), totalPoints);
  const frac = pointProgress - visiblePoints;

  if (visiblePoints === 0) return;

  // Gradient fill under curve
  const grad = ctx.createLinearGradient(0, CHART_TOP, 0, CHART_BOTTOM);
  grad.addColorStop(0, 'rgba(255, 71, 87, 0.25)');
  grad.addColorStop(1, 'rgba(255, 71, 87, 0.02)');

  // Build path points
  const pts = [];
  for (let i = 0; i < visiblePoints; i++) {
    pts.push([xForYear(DATA[i][0]), yForDebt(DATA[i][1])]);
  }
  // Interpolate fractional point
  if (visiblePoints < totalPoints && frac > 0) {
    const curr = DATA[visiblePoints - 1];
    const next = DATA[visiblePoints];
    const ix = xForYear(curr[0] + (next[0] - curr[0]) * frac);
    const iy = yForDebt(curr[1] + (next[1] - curr[1]) * frac);
    pts.push([ix, iy]);
  }

  // Fill area
  ctx.beginPath();
  ctx.moveTo(pts[0][0], CHART_BOTTOM);
  for (const [x, y] of pts) ctx.lineTo(x, y);
  ctx.lineTo(pts[pts.length-1][0], CHART_BOTTOM);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw line
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = '#ff4757';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Glowing dot at end
  const lastPt = pts[pts.length - 1];
  ctx.beginPath();
  ctx.arc(lastPt[0], lastPt[1], 14, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 71, 87, 0.3)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(lastPt[0], lastPt[1], 7, 0, Math.PI * 2);
  ctx.fillStyle = '#ff4757';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(lastPt[0], lastPt[1], 3, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Current year + amount badge
  const lastIdx = Math.min(visiblePoints, totalPoints) - 1;
  const lastData = DATA[lastIdx];
  let displayYear = lastData[0];
  let displayDebt = lastData[1];
  if (visiblePoints < totalPoints && frac > 0) {
    const next = DATA[visiblePoints];
    displayDebt = lastData[1] + (next[1] - lastData[1]) * frac;
  }

  // Year badge (large, above dot)
  const badgeX = Math.min(lastPt[0], CHART_RIGHT - 80);
  const badgeY = Math.max(lastPt[1] - 55, CHART_TOP + 30);
  ctx.textAlign = 'center';

  // Amount
  ctx.fillStyle = '#ff4757';
  ctx.font = "700 34px 'JetBrains Mono', monospace";
  ctx.fillText(formatDebt(displayDebt) + ' €', badgeX, badgeY - 8);

  // Year
  ctx.fillStyle = '#ffffff';
  ctx.font = "italic 26px 'Instrument Serif', serif";
  ctx.fillText(displayYear, badgeX, badgeY + 22);

  // Footer
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = "14px 'JetBrains Mono', monospace";
  ctx.fillText('Source : INSEE, Banque de France', 50, ${SIZE} - 30);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ff4757';
  ctx.font = "600 20px 'JetBrains Mono', monospace";
  ctx.fillText('ouvalargent.com', ${SIZE} - 50, ${SIZE} - 28);
};
</script>
</body>
</html>`;
}

async function main() {
  console.log('\n🎬 Génération du GIF — Dette publique 1974→2025\n');

  // Clean/create frame directory
  if (fs.existsSync(FRAME_DIR)) fs.rmSync(FRAME_DIR, { recursive: true });
  fs.mkdirSync(FRAME_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });

  // Write HTML to temp file
  const htmlPath = path.join(FRAME_DIR, 'chart.html');
  fs.writeFileSync(htmlPath, generateHTML());
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 500));

  // Generate frames
  const dataFrames = DEBT_DATA.length * 4; // 4 frames per data point
  const pauseFrames = 40; // pause at end
  const total = dataFrames + pauseFrames;

  for (let f = 0; f < total; f++) {
    const progress = Math.min(f / dataFrames, 1.0);
    await page.evaluate((p) => window.drawFrame(p), progress);

    const framePath = path.join(FRAME_DIR, `frame-${String(f).padStart(4, '0')}.png`);
    const el = await page.$('.infographic');
    await el.screenshot({ path: framePath, type: 'png' });

    if (f % 20 === 0) process.stdout.write(`  Frame ${f}/${total}\r`);
  }

  console.log(`  ${total} frames capturées                `);
  await browser.close();

  // Assemble GIF with ffmpeg
  console.log('  Assemblage GIF avec ffmpeg...');
  const ffmpegCmd = [
    'ffmpeg -y',
    `-framerate ${FPS}`,
    `-i "${FRAME_DIR}/frame-%04d.png"`,
    '-vf "fps=15,scale=540:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3"',
    `"${OUTPUT_GIF}"`,
  ].join(' ');

  execSync(ffmpegCmd, { stdio: 'pipe' });

  const gifSize = (fs.statSync(OUTPUT_GIF).size / 1024 / 1024).toFixed(1);
  console.log(`\n  GIF : ${OUTPUT_GIF}`);
  console.log(`  Taille : ${gifSize} Mo`);
  console.log(`  Durée : ~${(total / FPS).toFixed(1)}s @ ${FPS}fps\n`);

  // Cleanup frames
  fs.rmSync(FRAME_DIR, { recursive: true });
  console.log('  Frames nettoyées.\n');
}

main().catch(e => { console.error(e); process.exit(1); });

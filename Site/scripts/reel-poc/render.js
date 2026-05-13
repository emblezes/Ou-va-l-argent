#!/usr/bin/env node
/**
 * POC — Conversion d'une infographie HTML en MP4 Reel Instagram (1080×1920, 30 fps).
 *
 * Stratégie :
 *   1. Puppeteer charge le HTML avec ?capture (animations en pause)
 *   2. On boucle frame par frame, pour chaque t = i / fps, on setReelTime(t*1000)
 *      puis on screenshot la page
 *   3. ffmpeg assemble les PNGs en MP4 H.264
 *
 * Usage :
 *   node scripts/reel-poc/render.js [--duration=15] [--fps=30] [--output=/tmp/reel-209.mp4]
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2).reduce((acc, a) => {
  const m = a.match(/^--([^=]+)=(.*)$/);
  if (m) acc[m[1]] = m[2];
  return acc;
}, {});

const DURATION_S = parseFloat(args.duration ?? '10');
const FPS        = parseInt(args.fps ?? '30', 10);
const TOTAL      = Math.round(DURATION_S * FPS);
const HTML_FILE  = path.resolve(args.html ?? path.join(__dirname, 'reel-209.html'));
const FRAMES_DIR = '/tmp/reel-frames-209';
const OUTPUT     = args.output ?? '/tmp/reel-209.mp4';

(async () => {
  if (!fs.existsSync(HTML_FILE)) {
    console.error(`HTML introuvable : ${HTML_FILE}`);
    process.exit(1);
  }

  if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  console.log(`📐 Reel ${DURATION_S}s @ ${FPS} fps → ${TOTAL} frames`);
  console.log(`   HTML  : ${HTML_FILE}`);
  console.log(`   Out   : ${OUTPUT}`);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  const fileURL = 'file://' + HTML_FILE.replace(/ /g, '%20').replace(/'/g, '%27') + '?capture';
  await page.goto(fileURL, { waitUntil: 'networkidle0' });

  // Attendre que le reel soit prêt (fonts chargées, animations en pause)
  await page.waitForFunction(() => window.__reelReady === true, { timeout: 10000 });
  await new Promise(r => setTimeout(r, 200)); // safety

  console.log('▶️  Capture en cours...');
  const t0 = Date.now();

  for (let i = 0; i < TOTAL; i++) {
    const tMs = (i / FPS) * 1000;
    await page.evaluate((t) => window.setReelTime(t), tMs);

    // Petit délai pour laisser le navigateur recomposer après changement de currentTime
    await new Promise(r => setTimeout(r, 12));

    const fname = path.join(FRAMES_DIR, `frame-${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: fname, clip: { x: 0, y: 0, width: 1080, height: 1920 } });

    if (i % 30 === 0 || i === TOTAL - 1) {
      const pct = ((i + 1) / TOTAL * 100).toFixed(0);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      process.stdout.write(`\r   frame ${i + 1}/${TOTAL} (${pct}%) — ${elapsed}s`);
    }
  }
  process.stdout.write('\n');

  await browser.close();

  console.log('🎞️  Assemblage ffmpeg...');
  const { spawnSync } = require('child_process');
  const ffmpegArgs = [
    '-y', '-framerate', String(FPS),
    '-i', `${FRAMES_DIR}/frame-%04d.png`,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    OUTPUT,
  ];
  const ff = spawnSync('ffmpeg', ffmpegArgs, { stdio: 'inherit' });
  if (ff.status !== 0) {
    throw new Error(`ffmpeg failed (code ${ff.status})`);
  }

  const sizeMB = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2);
  const totalS = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`✅ ${OUTPUT} (${sizeMB} Mo) en ${totalS}s`);
})().catch(err => {
  console.error('❌', err);
  process.exit(1);
});

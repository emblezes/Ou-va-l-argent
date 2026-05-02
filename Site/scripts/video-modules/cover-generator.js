/**
 * Cover generator v3 — miniature 1080×1080 avec présentateur détouré + fond IA.
 *
 * Évolution v3 :
 *   - Avant (v2) : Nano Banana génère visage + scène → visage stylisé, pas fidèle
 *   - Maintenant : présentateur détouré via BirefNet (vrai visage) + fond Flux généré
 *   - Compositing via Puppeteer → visage 100 % identique à la photo réelle
 *
 * Flux :
 *   1. Une fois : BirefNet détoure la photo principale → PNG transparent
 *   2. Claude Haiku → prompt Flux de scène thématique (pas de personnage)
 *   3. Flux génère le fond thématique seul
 *   4. Puppeteer compose : fond Flux + présentateur détouré centré-bas + titre + logo OVLA
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { loadConfig } = require('../journalist-modules/shared-utils');

const COVER_W = 1080;
const COVER_H = 1080;
const IA_CACHE_DIR = path.join(__dirname, '..', '.video-ia-cache');

const ACCENT_BY_CATEGORY = {
  'Finances publiques': '#00d4ff',
  'Macro-éco': '#ffd700',
  'Investissement': '#00ff88',
  'Actu éco': '#ff9f43',
  'International': '#a855f7',
  'Finance perso': '#ff4757',
  'Écologie': '#22c55e',
  'Impôts': '#ef4444',
  'Emploi': '#06b6d4',
  'Immobilier': '#d97706',
  'Santé': '#10b981',
  'Éducation': '#8b5cf6',
  'Défense': '#64748b',
  'Retraites': '#f59e0b',
  'Social': '#ec4899',
};

// ── Prompt Flux pour le fond thématique (sans personnage) ──

async function buildScenePromptBg({ topic, beatText = '' }) {
  const config = loadConfig();
  const apiKey = process.env.ANTHROPIC_API_KEY || config.ANTHROPIC_API_KEY;
  const fallback = `Editorial magazine cover style, cinematic poster, 1:1 square. Place the reference person as the central news anchor figure, waist-up shot, centered, facing camera with serious confident expression. Background illustrates: ${topic}. Dramatic red/orange lighting, muted dark colors, photorealistic editorial photography, leave empty space at top for title overlay.`;
  if (!apiKey) return fallback;

  const ask = `Tu es directeur artistique de miniatures Instagram style @ESTFAMA. Tu rédiges un prompt Nano Banana pour une miniature d'actualité économique.

Nano Banana reçoit : (1) des photos de référence du présentateur, (2) ton prompt. Il compose l'image finale en intégrant le présentateur dans la scène que tu décris.

Topic : "${topic}"
${beatText ? `Contexte : "${beatText}"` : ''}

Règles du prompt :
1. **Anglais**, 40-70 mots
2. **Commence** par : "Editorial magazine cover style, cinematic poster, 1:1 square ratio. Place the reference person as the central news anchor figure, waist-up shot, centered, facing camera directly, serious confident expression."
3. **Décris ensuite la scène thématique derrière** : éléments visuels forts (drapeau, objets symboliques, feu, graphiques géants, bâtiments, etc.)
4. **Tonalité** : dramatic red/orange/amber lighting OU deep blue/gold selon sujet, muted colors, photojournalism style
5. **Laisse de la place en haut pour le titre** : "empty space at top for title overlay"
6. **Pas de texte dans la scène** (le titre sera ajouté après)

Exemples :

Topic "Guerre Iran essence"
Prompt ✅ "Editorial magazine cover style, cinematic poster, 1:1 square ratio. Place the reference person as the central news anchor figure, waist-up shot, centered, facing camera directly, serious confident expression. Background shows burning oil refinery silhouettes at dusk, giant Iranian flag draped behind with smoke trails, oil pump jacks with dollar symbol flames on each side, dark stormy sky. Deep red and orange tones, muted colors, dramatic photorealistic editorial photography, empty dark space at top for title overlay."

Topic "Retraites réforme 2026"
Prompt ✅ "Editorial magazine cover style, cinematic poster, 1:1 square ratio. Place the reference person as the central news anchor figure, waist-up shot, centered, facing camera directly, serious expression. Background shows French National Assembly hemicycle at dusk, retirement documents and calendar pages flying, aged paperwork. Deep blue and gold tones, dramatic top lighting, photorealistic editorial, empty dark space at top for title overlay."

Réponds UNIQUEMENT avec le prompt final en anglais, sans commentaire.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: ask }],
      }),
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim().replace(/^["']|["']$/g, '') || fallback;
  } catch {
    return fallback;
  }
}

// ── Template HTML avec présentateur détouré superposé ─────

function toDataUrl(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return '';
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function coverHTMLComposite({ titre, categorie, accent, backgroundPath }) {
  const bgData = toDataUrl(backgroundPath);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${COVER_W}px; height: ${COVER_H}px; overflow: hidden; font-family: 'Syne', sans-serif; background: #000; }
  .cover {
    width: 100%; height: 100%;
    background-image: url('${bgData}');
    background-size: cover; background-position: center;
    position: relative;
  }
  /* Overlay léger : gradient haut + bas pour lisibilité titre/url */
  .cover::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(180deg,
      rgba(6,8,12,0.78) 0%, rgba(6,8,12,0.35) 22%,
      rgba(6,8,12,0) 55%,
      rgba(6,8,12,0.45) 85%, rgba(6,8,12,0.8) 100%);
    z-index: 1;
  }

  /* Logo OVLA — GROS au centre haut */
  .logo {
    position: absolute; top: 32px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 16px;
    z-index: 4;
    text-align: center;
  }
  .logo-icon {
    font-family: 'Instrument Serif', serif;
    font-size: 5.5rem; color: ${accent}; line-height: 1;
    text-shadow: 0 4px 18px rgba(0,0,0,0.9);
  }
  .logo-text {
    font-family: 'Instrument Serif', serif; font-style: italic;
    font-size: 2.2rem; color: #fff; line-height: 1; white-space: nowrap;
    text-shadow: 0 3px 14px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95);
  }

  /* Titre principal */
  .title-wrap {
    position: absolute; top: 160px; left: 40px; right: 40px;
    z-index: 4;
    text-align: center;
  }
  .title {
    font-family: 'Instrument Serif', serif;
    font-size: 78px; line-height: 1.02;
    color: #fff;
    text-shadow: 0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.95);
    letter-spacing: -0.01em;
  }

  /* URL site en bas centré */
  .url {
    position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
    z-index: 4;
    font-family: 'JetBrains Mono', monospace;
    font-size: 26px; font-weight: 600;
    color: ${accent};
    letter-spacing: 2px;
    text-shadow: 0 3px 14px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95);
  }
</style>
</head>
<body>
  <div class="cover">
    <div class="logo">
      <span class="logo-icon">&euro;</span>
      <span class="logo-text">Où Va l'Argent ?</span>
    </div>
    <div class="title-wrap">
      <h1 class="title">${titre}</h1>
    </div>
    <div class="url">ouvalargent.com</div>
  </div>
</body>
</html>`;
}

// ── API publique ────────────────────────────────────────────

// ── Upload fal.ai storage (pour photos de référence Nano Banana) ───

async function uploadToFalStorage(filePath) {
  const config = loadConfig();
  const apiKey = process.env.FAL_API_KEY || config.FAL_API_KEY;
  if (!apiKey) throw new Error('FAL_API_KEY manquant');

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase() || 'jpeg';
  const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

  const initRes = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
    method: 'POST',
    headers: { Authorization: `Key ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_name: fileName, content_type: contentType }),
  });
  if (!initRes.ok) throw new Error(`fal storage init ${initRes.status}`);
  const initData = await initRes.json();

  const putRes = await fetch(initData.upload_url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: fileBuffer,
  });
  if (!putRes.ok) throw new Error(`fal storage put ${putRes.status}`);
  return initData.file_url;
}

// ── Nano Banana composition (visage + scène) ───────────────

async function generateNanoBananaComposition({ presenterUrls, prompt }) {
  const config = loadConfig();
  const apiKey = process.env.FAL_API_KEY || config.FAL_API_KEY;
  if (!apiKey) throw new Error('FAL_API_KEY manquant');

  const cacheFile = path.join(IA_CACHE_DIR, `cover-${crypto.createHash('sha1').update(prompt).digest('hex').slice(0, 16)}.jpg`);
  if (fs.existsSync(cacheFile) && fs.statSync(cacheFile).size > 10000) return cacheFile;
  if (!fs.existsSync(IA_CACHE_DIR)) fs.mkdirSync(IA_CACHE_DIR, { recursive: true });

  const submitRes = await fetch('https://queue.fal.run/fal-ai/nano-banana/edit', {
    method: 'POST',
    headers: { Authorization: `Key ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      image_urls: presenterUrls,
      num_images: 1,
      output_format: 'jpeg',
    }),
  });
  if (!submitRes.ok) throw new Error(`nano-banana submit ${submitRes.status}: ${(await submitRes.text()).slice(0, 200)}`);
  const submit = await submitRes.json();

  const deadline = Date.now() + 90 * 1000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 3000));
    const stat = await fetch(submit.status_url, { headers: { Authorization: `Key ${apiKey}` } });
    if (!stat.ok) continue;
    const status = await stat.json();
    if (status.status === 'COMPLETED') break;
    if (status.status === 'FAILED') throw new Error(`nano-banana failed`);
  }
  const finalRes = await fetch(submit.response_url, { headers: { Authorization: `Key ${apiKey}` } });
  const final = await finalRes.json();
  const imgUrl = final.images?.[0]?.url || final.image?.url;
  if (!imgUrl) throw new Error('nano-banana: URL image manquante');

  const imgRes = await fetch(imgUrl);
  fs.writeFileSync(cacheFile, Buffer.from(await imgRes.arrayBuffer()));
  return cacheFile;
}

// ── API publique ────────────────────────────────────────────

async function generateCover({ titre, categorie, accent, topic, outputPath }) {
  const safeAccent = accent || ACCENT_BY_CATEGORY[categorie] || '#00d4ff';

  // 1. Upload photos présentateur sur fal.ai (1 fois, cache persistant)
  const presenterDir = path.join(__dirname, 'assets', 'presenter');
  const presenterFiles = fs.existsSync(presenterDir)
    ? fs.readdirSync(presenterDir).filter((f) => /\.(jpe?g|png)$/i.test(f))
    : [];

  let presenterUrls = [];
  if (presenterFiles.length > 0) {
    if (!fs.existsSync(IA_CACHE_DIR)) fs.mkdirSync(IA_CACHE_DIR, { recursive: true });
    const urlCacheFile = path.join(IA_CACHE_DIR, 'presenter-fal-urls.json');
    let urlCache = {};
    if (fs.existsSync(urlCacheFile)) {
      try { urlCache = JSON.parse(fs.readFileSync(urlCacheFile, 'utf-8')); } catch {}
    }
    for (const pf of presenterFiles.slice(0, 3)) {
      if (urlCache[pf]) { presenterUrls.push(urlCache[pf]); continue; }
      try {
        console.log(`  ↑ Upload photo présentateur ${pf} sur fal.ai...`);
        const url = await uploadToFalStorage(path.join(presenterDir, pf));
        urlCache[pf] = url;
        presenterUrls.push(url);
      } catch (e) {
        console.error(`  ⚠ upload ${pf}: ${e.message.slice(0, 100)}`);
      }
    }
    try { fs.writeFileSync(urlCacheFile, JSON.stringify(urlCache, null, 2)); } catch {}
  }

  // 2. Nano Banana compose présentateur + scène thématique
  let composedBg = null;
  if (presenterUrls.length > 0) {
    try {
      const scenePrompt = await buildScenePromptBg({ topic: topic || titre });
      console.log(`  🎨 Cover Nano Banana : ${scenePrompt.slice(0, 100)}...`);
      composedBg = await generateNanoBananaComposition({ presenterUrls, prompt: scenePrompt });
      console.log(`  → composition : ${path.basename(composedBg)}`);
    } catch (e) {
      console.error(`  ⚠ Nano Banana échec (${e.message.slice(0, 120)}) — fallback gradient`);
    }
  }

  // 3. Fallback gradient si Nano Banana a échoué
  if (!composedBg) {
    composedBg = await createFallbackGradient({ accent: safeAccent, outputDir: path.dirname(outputPath) });
  }

  // 4. Puppeteer overlay : titre + logo OVLA + ouvalargent.com
  const htmlPath = outputPath.replace(/\.png$/i, '.cover.html');
  fs.writeFileSync(
    htmlPath,
    coverHTMLComposite({
      titre,
      categorie: categorie || 'Actu éco',
      accent: safeAccent,
      backgroundPath: composedBg,
    })
  );

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: COVER_W, height: COVER_H, deviceScaleFactor: 2 });
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0', timeout: 20000 });
    await page.screenshot({ path: outputPath, type: 'png' });
  } finally {
    await browser.close();
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
  }

  return outputPath;
}

async function createFallbackGradient({ accent, outputDir }) {
  const bgPath = path.join(outputDir, '.cover-bg.png');
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body { margin: 0; width: ${COVER_W}px; height: ${COVER_H}px; overflow: hidden;
  background: radial-gradient(ellipse at 50% 60%, ${accent}30 0%, transparent 60%),
              linear-gradient(135deg, #06080c 0%, #0a1628 50%, #06080c 100%); }
</style></head><body></body></html>`;
  const htmlPath = bgPath.replace(/\.png$/, '.html');
  fs.writeFileSync(htmlPath, html);
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: COVER_W, height: COVER_H, deviceScaleFactor: 2 });
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: bgPath, type: 'png' });
  } finally {
    await browser.close();
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
  }
  return bgPath;
}

module.exports = { generateCover, ACCENT_BY_CATEGORY };

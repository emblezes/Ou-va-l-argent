/**
 * Visual fetcher — Pexels (stock) + fal.ai (Kling 2.5 pour vidéo IA, Flux 1.1 pro pour miniature)
 *
 * Règles :
 * - Par défaut : Pexels pour tous les beats
 * - Si beat.source === "kling" ET --no-ia n'est pas actif : Kling 2.5 via fal.ai
 * - Plafond Kling : FAL_KLING_MAX_CLIPS (2 par défaut) pour limiter le coût
 * - Cache local : même prompt → même vidéo (évite de repayer les appels IA)
 *
 * Les vidéos sont téléchargées dans {workDir}/clips/ avec un nom stable (hash).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { loadConfig } = require('../journalist-modules/shared-utils');
const {
  fetchGoogleCSECandidates,
  downloadCSECandidate,
  hashQuery: cseHashQuery,
} = require('./real-image-fetcher');
const {
  fetchWikimediaCandidates,
  downloadWikimediaCandidate,
  hashQuery: wikiHashQuery,
} = require('./wikimedia-fetcher');
const { fetchRssCandidates, downloadRssCandidate } = require('./rss-image-fetcher');
const { validateImageInContext } = require('./image-validator');
const { translatePromptForAI } = require('./prompt-translator');

// Extrait la 1re frame (à 0,5s pour éviter un écran noir d'intro) d'un MP4
// pour permettre à Claude vision de valider le contenu.
function extractFirstFrame(mp4Path) {
  if (!fs.existsSync(mp4Path)) return null;
  const jpg = mp4Path.replace(/\.mp4$/i, '.frame.jpg');
  try {
    execSync(`ffmpeg -y -loglevel error -ss 0.5 -i "${mp4Path}" -frames:v 1 -q:v 3 "${jpg}"`, {
      stdio: 'ignore',
    });
    return fs.existsSync(jpg) && fs.statSync(jpg).size > 1000 ? jpg : null;
  } catch {
    return null;
  }
}

const PEXELS_API = 'https://api.pexels.com/videos/search';
const FAL_QUEUE_API = 'https://queue.fal.run';

function loadVideoConfig() {
  const videoCfgPath = path.join(__dirname, '..', 'video-config.json');
  return JSON.parse(fs.readFileSync(videoCfgPath, 'utf-8'));
}

function getIaCacheDir() {
  const dir = path.join(__dirname, '..', '.video-ia-cache');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function hashPrompt(prompt) {
  return crypto.createHash('sha1').update(prompt).digest('hex').slice(0, 16);
}

// ── Pexels stock ─────────────────────────────────────

async function fetchPexelsClip({ query, durationMin = 2, durationMax = 15 }) {
  const config = loadConfig();
  const apiKey = process.env.PEXELS_API_KEY || config.PEXELS_API_KEY;
  if (!apiKey) throw new Error('PEXELS_API_KEY manquant (dans ~/.zshrc)');

  const url = `${PEXELS_API}?query=${encodeURIComponent(query)}&per_page=15&orientation=portrait&size=medium`;
  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const videos = data.videos || [];

  const filtered = videos.filter((v) => v.duration >= durationMin && v.duration <= durationMax);
  const pool = filtered.length > 0 ? filtered : videos;
  if (pool.length === 0) return null;

  const pick = pool[Math.floor(Math.random() * Math.min(pool.length, 5))];

  // Trouve le meilleur fichier (portrait 1080+ si possible)
  const files = (pick.video_files || []).filter((f) => f.file_type === 'video/mp4');
  const portrait = files.filter((f) => f.height > f.width);
  const candidates = portrait.length > 0 ? portrait : files;
  candidates.sort((a, b) => Math.abs((b.width || 0) - 1080) * -1 + Math.abs((a.width || 0) - 1080));
  const best = candidates.find((f) => (f.height || 0) >= 1080) || candidates[0];

  if (!best) return null;
  return { url: best.link, width: best.width, height: best.height, duration: pick.duration, source: 'pexels', id: pick.id };
}

// ── fal.ai — Kling 2.5 (text-to-video) ───────────────

async function generateKlingClip({ prompt, durationSec = 5 }) {
  const videoCfg = loadVideoConfig();
  const config = loadConfig();
  const apiKey = process.env.FAL_API_KEY || config.FAL_API_KEY;
  if (!apiKey) throw new Error('FAL_API_KEY manquant (dans ~/.zshrc)');

  const model = videoCfg.FAL_KLING_MODEL || 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video';
  const cacheFile = path.join(getIaCacheDir(), `kling-${hashPrompt(prompt + durationSec)}.mp4`);
  if (fs.existsSync(cacheFile)) {
    return { localPath: cacheFile, source: 'kling-cache' };
  }

  const submitRes = await fetch(`${FAL_QUEUE_API}/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      duration: String(Math.min(10, Math.max(5, durationSec))),
      aspect_ratio: '9:16',
    }),
  });

  if (!submitRes.ok) throw new Error(`fal.ai Kling submit ${submitRes.status}: ${await submitRes.text()}`);
  const submitData = await submitRes.json();
  const requestId = submitData.request_id;
  const statusUrl = submitData.status_url;
  const responseUrl = submitData.response_url;
  if (!requestId || !statusUrl || !responseUrl) {
    throw new Error(`fal.ai Kling: réponse inattendue ${JSON.stringify(submitData).slice(0, 200)}`);
  }

  // Poll jusqu'à 5 min max
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 5000));
    const statusRes = await fetch(statusUrl, {
      headers: { Authorization: `Key ${apiKey}` },
    });
    if (!statusRes.ok) continue;
    const status = await statusRes.json();
    if (status.status === 'COMPLETED') break;
    if (status.status === 'FAILED') throw new Error(`fal.ai Kling failed: ${JSON.stringify(status).slice(0, 200)}`);
  }

  const finalRes = await fetch(responseUrl, {
    headers: { Authorization: `Key ${apiKey}` },
  });
  if (!finalRes.ok) throw new Error(`fal.ai Kling fetch ${finalRes.status}`);
  const final = await finalRes.json();
  const videoUrl = final.video?.url || final.output?.video?.url || final.video_url;
  if (!videoUrl) throw new Error(`fal.ai Kling: URL vidéo manquante ${JSON.stringify(final).slice(0, 200)}`);

  // Télécharge dans le cache
  const mp4Res = await fetch(videoUrl);
  const buf = Buffer.from(await mp4Res.arrayBuffer());
  fs.writeFileSync(cacheFile, buf);

  return { localPath: cacheFile, source: 'kling' };
}

// ── fal.ai — Flux 1.1 pro (text-to-image) ────────────

async function generateFluxImage({ prompt, aspectRatio = '1:1' }) {
  const videoCfg = loadVideoConfig();
  const config = loadConfig();
  const apiKey = process.env.FAL_API_KEY || config.FAL_API_KEY;
  if (!apiKey) throw new Error('FAL_API_KEY manquant');

  const model = videoCfg.FAL_FLUX_MODEL || 'fal-ai/flux-pro/v1.1';
  const cacheFile = path.join(getIaCacheDir(), `flux-${hashPrompt(prompt + aspectRatio)}.png`);
  if (fs.existsSync(cacheFile)) return { localPath: cacheFile, source: 'flux-cache' };

  // Flux accepte image_size : square_hd, portrait_16_9, etc.
  const imageSize = aspectRatio === '1:1' ? 'square_hd' :
                    aspectRatio === '9:16' ? 'portrait_16_9' : 'portrait_16_9';

  const submitRes = await fetch(`${FAL_QUEUE_API}/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: imageSize,
      num_images: 1,
      enable_safety_checker: false,
    }),
  });
  if (!submitRes.ok) throw new Error(`fal.ai Flux submit ${submitRes.status}: ${await submitRes.text()}`);
  const submitData = await submitRes.json();
  const statusUrl = submitData.status_url;
  const responseUrl = submitData.response_url;

  const deadline = Date.now() + 60 * 1000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(statusUrl, {
      headers: { Authorization: `Key ${apiKey}` },
    });
    if (!statusRes.ok) continue;
    const status = await statusRes.json();
    if (status.status === 'COMPLETED') break;
    if (status.status === 'FAILED') throw new Error(`fal.ai Flux failed: ${JSON.stringify(status).slice(0, 200)}`);
  }
  const finalRes = await fetch(responseUrl, {
    headers: { Authorization: `Key ${apiKey}` },
  });
  const final = await finalRes.json();
  const imgUrl = final.images?.[0]?.url || final.image?.url;
  if (!imgUrl) throw new Error(`fal.ai Flux: URL image manquante`);

  const imgRes = await fetch(imgUrl);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  fs.writeFileSync(cacheFile, buf);
  return { localPath: cacheFile, source: 'flux' };
}

// ── Téléchargement helper ────────────────────────────

async function downloadToFile(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status} pour ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  return outPath;
}

/**
 * Cherche un candidat RSS (presse FR fraîche < 48h) validé par Claude vision.
 * Matche les mots-clés du beat contre les articles des 8 flux RSS configurés.
 */
async function fetchValidatedRssImage({ query, beatText, topic, maxTries = 4 }) {
  const candidates = await fetchRssCandidates({
    beatText,
    beatQuery: query,
    limit: maxTries + 2,
  });
  if (candidates.length === 0) return null;

  const tries = Math.min(candidates.length, maxTries);
  for (let i = 0; i < tries; i++) {
    const c = candidates[i];
    const localPath = await downloadRssCandidate({ url: c.url, beatQuery: query, index: i });
    if (!localPath) continue;

    const { valid, reason } = await validateImageInContext({ imagePath: localPath, beatText, topic });
    if (valid) {
      return { localPath, source: c.source, validated: true, reason, articleTitle: c.title };
    }
    console.log(`    ✗ img rejetée (${c.source}#${i}): ${reason.slice(0, 60)}`);
  }
  return null;
}

/**
 * Cherche un candidat Google CSE validé par Claude vision.
 * Essaie les 10 candidats CSE dans l'ordre de pertinence Google.
 */
async function fetchValidatedGoogleCSEImage({ query, beatText, topic, maxTries = 6 }) {
  const candidates = await fetchGoogleCSECandidates({ query, limit: 10 });
  if (candidates.length === 0) return null;

  const qHash = cseHashQuery(query);
  const tries = Math.min(candidates.length, maxTries);

  for (let i = 0; i < tries; i++) {
    const c = candidates[i];
    const localPath = await downloadCSECandidate({ url: c.url, queryHash: qHash, index: i });
    if (!localPath) continue;

    const { valid, reason } = await validateImageInContext({ imagePath: localPath, beatText, topic });
    if (valid) return { localPath, source: 'google-cse', validated: true, reason };

    console.log(`    ✗ img rejetée (google-cse#${i}): ${reason.slice(0, 60)}`);
  }
  return null;
}

/**
 * Cherche un candidat Wikimedia validé par Claude vision.
 */
async function fetchValidatedWikimediaImage({ query, beatText, topic, maxTries = 4 }) {
  const candidates = await fetchWikimediaCandidates({ query, limit: maxTries + 2 });
  if (candidates.length === 0) return null;

  const qHash = wikiHashQuery(query);
  const tries = Math.min(candidates.length, maxTries);

  for (let i = 0; i < tries; i++) {
    const c = candidates[i];
    const localPath = await downloadWikimediaCandidate({ url: c.url, queryHash: qHash, index: i });
    if (!localPath) continue;

    const { valid, reason } = await validateImageInContext({ imagePath: localPath, beatText, topic });
    if (valid) return { localPath, source: c.source, validated: true, reason };

    console.log(`    ✗ img rejetée (${c.source}#${i}): ${reason.slice(0, 60)}`);
  }
  return null;
}

/**
 * Cherche un clip Pexels validé par Claude vision (sur la 1re frame).
 * Télécharge plusieurs clips et garde le premier qui passe la validation.
 */
async function fetchValidatedPexelsClip({ query, beatText, topic, clipsDir, beatIndex, maxTries = 4 }) {
  const config = loadConfig();
  const apiKey = process.env.PEXELS_API_KEY || config.PEXELS_API_KEY;
  if (!apiKey) return null;

  const url = `${PEXELS_API}?query=${encodeURIComponent(query)}&per_page=${maxTries + 4}&orientation=portrait&size=medium`;
  let videos = [];
  try {
    const res = await fetch(url, { headers: { Authorization: apiKey } });
    if (!res.ok) return null;
    const data = await res.json();
    videos = data.videos || [];
  } catch {
    return null;
  }
  if (videos.length === 0) return null;

  const pool = videos
    .filter((v) => v.duration >= 2 && v.duration <= 15)
    .slice(0, maxTries + 2);
  if (pool.length === 0) return null;

  for (let i = 0; i < Math.min(pool.length, maxTries); i++) {
    const pick = pool[i];
    const files = (pick.video_files || []).filter((f) => f.file_type === 'video/mp4');
    const portrait = files.filter((f) => f.height > f.width);
    const candidates = portrait.length > 0 ? portrait : files;
    candidates.sort((a, b) => (b.height || 0) - (a.height || 0));
    const best = candidates.find((f) => (f.height || 0) >= 1080) || candidates[0];
    if (!best) continue;

    const localPath = path.join(clipsDir, `beat-${beatIndex}-pexels-${pick.id}.mp4`);
    if (!fs.existsSync(localPath)) {
      try { await downloadToFile(best.link, localPath); } catch { continue; }
    }

    // Extraction 1re frame pour validation Claude vision
    const framePath = extractFirstFrame(localPath);
    if (!framePath) {
      // Pas de frame extractible → on accepte par défaut (fail-open)
      return { clipPath: localPath, source: 'pexels', validated: false };
    }

    const { valid, reason } = await validateImageInContext({ imagePath: framePath, beatText, topic });
    try { fs.unlinkSync(framePath); } catch {}

    if (valid) {
      return { clipPath: localPath, source: 'pexels', validated: true, reason };
    }
    console.log(`    ✗ clip rejeté (pexels#${i}/${pick.id}): ${reason.slice(0, 60)}`);
  }
  return null;
}

/**
 * Enrichit chaque beat avec un clipPath ou imagePath local.
 *
 * Logique v24 — 100 % IA générative :
 *
 *   Si beat.source === "kling" :
 *     → Kling 2.5 vidéo (prompt IA → clip 5s cinématique)
 *
 *   Si beat.source === "flux-image" :
 *     → Flux 1.1 pro image (prompt IA → photo 9:16)
 *     → affichée avec effet Ken Burns dans Remotion
 *
 *   Fallback (si fal.ai échoue, quota, etc.) :
 *     → Flux si Kling a échoué (photo au lieu de vidéo)
 *     → Ou placeholder noir en dernier recours
 *
 * Plus de Pexels / RSS / Wikimedia / Google CSE.
 */
async function fetchVisualsForBeats({ beats, workDir, noIa = false, topic = '' }) {
  const enriched = [];

  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    let clipPath = null;
    let imagePath = null;
    let resolvedSource = null;

    // Source Claude : "kling" (vidéo) ou "flux-image" (photo)
    const wantsKling = beat.source === 'kling';

    // Traduit et nettoie le prompt Claude en prompt IA anglais propre
    // (Claude Sonnet produit parfois des descriptions de montage composites
    // en français — on les transforme ici avant envoi à Flux/Kling).
    const aiPrompt = await translatePromptForAI({
      rawPrompt: beat.visual,
      source: beat.source,
      beatText: beat.text,
      topic,
    });

    if (wantsKling) {
      try {
        console.log(`  🎬 Kling #${i + 1} : ${aiPrompt.slice(0, 80)}...`);
        const kling = await generateKlingClip({ prompt: aiPrompt, durationSec: 5 });
        clipPath = kling.localPath;
        resolvedSource = kling.source;
      } catch (e) {
        console.error(`  ⚠ Kling échec beat ${i + 1}: ${e.message.slice(0, 100)}`);
      }
    }

    // Flux par défaut OU fallback si Kling a échoué
    if (!clipPath && !imagePath) {
      try {
        console.log(`  🖼 Flux #${i + 1} : ${aiPrompt.slice(0, 80)}...`);
        const flux = await generateFluxImage({
          prompt: aiPrompt,
          aspectRatio: '9:16',
        });
        imagePath = flux.localPath;
        resolvedSource = flux.source;
      } catch (e) {
        console.error(`  ⚠ Flux échec beat ${i + 1}: ${e.message.slice(0, 100)}`);
      }
    }

    if (!clipPath && !imagePath) {
      console.error(`  ⚠ Aucun visuel IA pour beat ${i + 1}, placeholder noir`);
      resolvedSource = 'none';
    }

    enriched.push({ ...beat, clipPath, imagePath, source: resolvedSource });
  }

  return enriched;
}

module.exports = {
  fetchPexelsClip,
  generateKlingClip,
  generateFluxImage,
  fetchVisualsForBeats,
  downloadToFile,
};

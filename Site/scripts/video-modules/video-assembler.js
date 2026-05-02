/**
 * Video assembler — wrapper Remotion.
 *
 * Reçoit : beats enrichis (avec startSec/endSec + clipPath), audioPath, wordTimings.
 * Produit : MP4 final via `npx remotion render`.
 *
 * On utilise les mêmes timings ElevenLabs pour aligner les sous-titres mot-par-mot.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

// Crée un public dir dédié pour le render courant, rempli de copies
// des clips + audio (+ musique) + images réelles. Évite de copier
// Site/public/ (367 Mo) et résout les problèmes Remotion avec file:// URLs.
function preparePublicDir({ outDir, audioPath, beats, musicPath }) {
  const publicDir = path.join(outDir, '.remotion-public');
  if (fs.existsSync(publicDir)) fs.rmSync(publicDir, { recursive: true, force: true });
  fs.mkdirSync(publicDir, { recursive: true });

  const assetMap = {};

  if (audioPath && fs.existsSync(audioPath)) {
    const audioBase = 'audio' + path.extname(audioPath);
    fs.copyFileSync(audioPath, path.join(publicDir, audioBase));
    assetMap.audioRel = audioBase;
  }

  if (musicPath && fs.existsSync(musicPath)) {
    const musicBase = 'music' + path.extname(musicPath);
    fs.copyFileSync(musicPath, path.join(publicDir, musicBase));
    assetMap.musicRel = musicBase;
  }

  // Chaque beat : vidéo (clipPath) OU image (imagePath)
  const beatAssets = [];
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    let clipRel = null;
    let imageRel = null;

    if (b.imagePath && fs.existsSync(b.imagePath)) {
      const ext = path.extname(b.imagePath) || '.jpg';
      const safeName = `img-${i}${ext}`;
      const dest = path.join(publicDir, safeName);
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      fs.copyFileSync(b.imagePath, dest);
      imageRel = safeName;
    } else if (b.clipPath && fs.existsSync(b.clipPath)) {
      const safeName = `clip-${i}${path.extname(b.clipPath)}`;
      const dest = path.join(publicDir, safeName);
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      fs.copyFileSync(b.clipPath, dest);
      clipRel = safeName;
    }

    beatAssets.push({ clipRel, imageRel });
  }

  assetMap.beatAssets = beatAssets;
  assetMap.publicDir = publicDir;
  return assetMap;
}

function loadVideoConfig() {
  const videoCfgPath = path.join(__dirname, '..', 'video-config.json');
  return JSON.parse(fs.readFileSync(videoCfgPath, 'utf-8'));
}

function secToFrames(sec, fps) {
  return Math.max(0, Math.round(sec * fps));
}

// v5 : on ne génère plus de "captions" par beat — on envoie directement les
// wordTimings frame-alignés à Remotion, qui les regroupe côté Subtitles.tsx.
function buildWordsFromTimings(wordTimings, fps) {
  if (!wordTimings || wordTimings.length === 0) return [];
  return wordTimings.map((w) => ({
    text: w.word,
    startFrame: secToFrames(w.startSec, fps),
    endFrame: secToFrames(w.endSec, fps),
  }));
}

async function assembleVideo({ beats, audioPath, wordTimings, outputPath, accent, musicPath }) {
  const cfg = loadVideoConfig();
  const fps = cfg.REMOTION_FPS || 30;
  const width = cfg.REMOTION_WIDTH || 1080;
  const height = cfg.REMOTION_HEIGHT || 1920;

  const outDir = path.dirname(outputPath);
  const { publicDir, audioRel, beatAssets, musicRel } = preparePublicDir({ outDir, audioPath, beats, musicPath });

  // Durée cible = fin de l'audio (source de vérité)
  const audioEnd = wordTimings[wordTimings.length - 1]?.endSec || 45;
  const totalFrames = secToFrames(audioEnd, fps);

  // Construit les Sequences en les chaînant sans trou noir :
  // chaque beat s'étire jusqu'au début du suivant (ou totalFrames pour le dernier).
  // Premier beat commence à 0. Les beats sans asset valide sont ignorés
  // (leur temps est absorbé par le beat précédent).
  const withAsset = beats.map((b, i) => ({
    startSec: b.startSec,
    clipRel: beatAssets[i]?.clipRel || null,
    imageRel: beatAssets[i]?.imageRel || null,
    source: b.source || (beatAssets[i]?.imageRel ? 'real-image' : 'stock-video'),
  }));
  const framesBeats = [];
  for (let i = 0; i < withAsset.length; i++) {
    const a = withAsset[i];
    if (!a.clipRel && !a.imageRel) continue;
    const startFrame = framesBeats.length === 0 ? 0 : secToFrames(a.startSec, fps);
    let endFrame = totalFrames;
    for (let j = i + 1; j < withAsset.length; j++) {
      if (withAsset[j].clipRel || withAsset[j].imageRel) {
        endFrame = secToFrames(withAsset[j].startSec, fps);
        break;
      }
    }
    framesBeats.push({
      startFrame,
      endFrame,
      clipPath: a.clipRel || undefined,
      imagePath: a.imageRel || undefined,
      source: a.source,
    });
  }

  // Log de contrôle rythme (warning si un plan dure > 4s)
  framesBeats.forEach((b, idx) => {
    const dur = (b.endFrame - b.startFrame) / fps;
    if (dur > 4) {
      console.log(`  ⚠ Plan ${idx + 1} dure ${dur.toFixed(1)}s (cible 2-3s)`);
    }
  });

  const words = buildWordsFromTimings(wordTimings, fps);

  const props = {
    beats: framesBeats,
    audioPath: audioRel || '',
    musicPath: musicRel || '',
    musicVolume: cfg.BACKGROUND_MUSIC_VOLUME ?? 0.08,
    words,
    durationInFrames: totalFrames,
    fps,
    width,
    height,
    accent: accent || '#00d4ff',
  };

  const propsPath = path.join(outDir, 'remotion-props.json');
  fs.writeFileSync(propsPath, JSON.stringify(props, null, 2));

  const entry = path.join(__dirname, 'remotion', 'index.ts');
  const cmd = [
    'npx',
    'remotion',
    'render',
    `"${entry}"`,
    'OvlaVideo',
    `"${outputPath}"`,
    `--props="${propsPath}"`,
    `--public-dir="${publicDir}"`,
    '--codec=h264',
    `--frames=0-${totalFrames - 1}`,
    '--concurrency=1',
    '--log=info',
  ].join(' ');

  execSync(cmd, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', '..'), // Site/
  });

  return { outputPath, durationFrames: totalFrames, fps };
}

module.exports = { assembleVideo };

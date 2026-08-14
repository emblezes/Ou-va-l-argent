/**
 * video-photo-reel.js — Reel narré à partir de VRAIES photos (config-driven).
 *
 * Le pipeline video-journalist (v24+) génère 100 % des visuels en IA (Kling/Flux),
 * ce qui produit un FAUX visage pour une personne réelle. Pour un média factuel,
 * on veut les VRAIES photos. Ce script réutilise les modules voix (ElevenLabs) +
 * montage (Remotion) mais injecte des photos locales réelles, une par beat.
 *
 * Usage :
 *   node scripts/video-photo-reel.js <config.json>
 *
 * Config JSON :
 * {
 *   "date": "2026-06-18",
 *   "slug": "musk-empire-video",
 *   "accent": "#00d4ff",                 // couleur logo + highlight (hex)
 *   "photosDir": "../Production interne/.../photos",  // dossier des photos (relatif au cwd ou absolu)
 *   "beats": [
 *     { "text": "Phrase parlée du beat.", "photo": "wave.jpg" },
 *     ...
 *   ]
 * }
 *
 * Le scriptText (voix off) = concaténation des textes de beats → alignement parfait.
 * Règles : ~30 s (10-12 beats), une photo DISTINCTE par beat, jamais 2 fois la même
 * d'affilée, visage dans le tiers haut (le texte occupe le bas).
 */

const fs = require('fs');
const path = require('path');
const { generateVoice, alignBeatsToTimings } = require('./video-modules/voice-generator');
const { assembleVideo } = require('./video-modules/video-assembler');

const BASE = "/Users/emmanuelblezes/Documents/08_Où va l'argent /Production interne/Réseaux Sociaux ";
const ARTICLES_DIR = path.join(BASE, 'Articles');

function resolveMusic() {
  const dir = path.join(__dirname, 'video-modules', 'assets', 'music');
  if (!fs.existsSync(dir)) return null;
  const tracks = fs.readdirSync(dir).filter((f) => /\.(mp3|m4a|wav|aac)$/i.test(f));
  return tracks.length ? path.join(dir, tracks[0]) : null;
}

async function main() {
  const configPath = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (!configPath) {
    console.error('Usage : node scripts/video-photo-reel.js <config.json>');
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(path.resolve(configPath), 'utf8'));
  const photosDir = path.isAbsolute(cfg.photosDir)
    ? cfg.photosDir
    : path.resolve(process.cwd(), cfg.photosDir);

  const beats = cfg.beats.map((b) => {
    const imagePath = path.isAbsolute(b.photo) ? b.photo : path.join(photosDir, b.photo);
    if (!fs.existsSync(imagePath)) throw new Error('Photo manquante : ' + imagePath);
    return { text: b.text, imagePath, source: 'real-image' };
  });

  // Garde-fou : pas deux fois la même photo d'affilée
  for (let i = 1; i < beats.length; i++) {
    if (beats[i].imagePath === beats[i - 1].imagePath) {
      console.warn(`  ⚠ beats ${i} et ${i + 1} utilisent la même photo (à éviter)`);
    }
  }

  const scriptText = beats.map((b) => b.text).join(' ');
  const wordCount = scriptText.split(/\s+/).length;
  console.log(`📝 ${beats.length} beats, ${wordCount} mots (~${Math.round(wordCount / 3)}s de voix)`);

  const outDir = path.join(ARTICLES_DIR, cfg.date, cfg.slug);
  fs.mkdirSync(outDir, { recursive: true });

  console.log('🎙  Voix off ElevenLabs…');
  const audioPath = path.join(outDir, 'audio.mp3');
  const { wordTimings, durationSec } = await generateVoice({ scriptText, outputPath: audioPath });
  console.log(`  → ${durationSec?.toFixed(1)}s, ${wordTimings.length} mots`);

  const aligned = alignBeatsToTimings(beats, wordTimings);

  console.log('🎬 Montage Remotion (vraies photos + Ken Burns)…');
  const videoPath = path.join(outDir, 'video.mp4');
  await assembleVideo({
    beats: aligned,
    audioPath,
    wordTimings,
    outputPath: videoPath,
    accent: cfg.accent || '#00d4ff',
    musicPath: cfg.music ? resolveMusic() : null,  // sans musique par défaut
  });

  fs.writeFileSync(path.join(outDir, 'script.md'), `# ${cfg.slug}\n\n${scriptText}\n`);
  console.log(`\n✅ Vidéo : ${videoPath}`);
}

main().catch((e) => { console.error('💥', e.message); console.error(e.stack); process.exit(1); });

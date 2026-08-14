/**
 * Rendu vidéo Milei — driver dédié.
 *
 * Le pipeline video-journalist (v24+) génère 100 % des visuels en IA (Kling/Flux),
 * ce qui produirait un FAUX Milei. Pour un média factuel, on veut les VRAIES photos.
 * Ce driver réutilise les modules voix (ElevenLabs) + montage (Remotion) mais
 * injecte nos photos Milei réelles (Wikimedia) sur chaque beat.
 *
 * Usage : node scripts/video-milei-render.js
 */

const fs = require('fs');
const path = require('path');
const { generateVoice, alignBeatsToTimings } = require('./video-modules/voice-generator');
const { assembleVideo } = require('./video-modules/video-assembler');

const BASE = "/Users/emmanuelblezes/Documents/08_Où va l'argent /Production interne/Réseaux Sociaux ";
const PHOTOS = path.join(BASE, 'Actus chaudes/2026-06-18-milei-bilan/photos');
const SER = path.join(PHOTOS, 'inflation.jpg');   // portrait sérieux
const SASH = path.join(PHOTOS, 'excedent.png');   // portrait officiel écharpe
const KIDS = path.join(PHOTOS, 'pauvrete.jpg');   // Milei avec des enfants
const SUMMIT = path.join(PHOTOS, 'risque.jpg');   // sommet Mercosur
const CHAIN = path.join(PHOTOS, 'chainsaw.jpg');  // tronçonneuse
const CLOSE = path.join(PHOTOS, 'close.jpg');     // gros plan sourire
const CPAC = path.join(PHOTOS, 'cpac.jpg');       // sourire CPAC
const SPEAK = path.join(PHOTOS, 'speak.jpg');     // discours podium
const WAVE = path.join(PHOTOS, 'wave.jpg');       // salut drapeau (triomphal)

// ~30 s. (text, photo) — scriptText = concaténation des textes. Une photo distincte par beat.
const BEATS = [
  ["On vous promettait que Milei ruinerait l'Argentine.", WAVE],
  ["L'inflation : 211 % par an.", SER],
  ["Aujourd'hui, 31 %.", CPAC],
  ["À la tronçonneuse, il a équilibré le budget.", CHAIN],
  ["Premier excédent en seize ans.", SASH],
  ["La pauvreté : de 53 % à 28 %.", KIDS],
  ["Le risque pays s'effondre de 2 700 à 500 points.", SUMMIT],
  ["La méthode libérale a tout fait reculer d'un coup.", SPEAK],
  ["On peut détester l'homme.", CLOSE],
  ["Les chiffres sont là.", WAVE],
];

function resolveMusic() {
  const dir = path.join(__dirname, 'video-modules', 'assets', 'music');
  if (!fs.existsSync(dir)) return null;
  const tracks = fs.readdirSync(dir).filter((f) => /\.(mp3|m4a|wav|aac)$/i.test(f));
  return tracks.length ? path.join(dir, tracks[0]) : null;
}

async function main() {
  for (const [, img] of BEATS) {
    if (!fs.existsSync(img)) throw new Error('Photo manquante : ' + img);
  }
  const scriptText = BEATS.map(([t]) => t).join(' ');
  const outDir = path.join(BASE, 'Articles/2026-06-18/milei-bilan-video');
  fs.mkdirSync(outDir, { recursive: true });

  console.log('🎙  Voix off ElevenLabs…');
  const audioPath = path.join(outDir, 'audio.mp3');
  const { wordTimings, durationSec } = await generateVoice({ scriptText, outputPath: audioPath });
  console.log(`  → ${durationSec?.toFixed(1)}s, ${wordTimings.length} mots`);

  const beats = BEATS.map(([text, imagePath]) => ({ text, imagePath, source: 'real-image' }));
  const aligned = alignBeatsToTimings(beats, wordTimings);

  const accent = '#a855f7';

  console.log('🎬 Montage AVEC musique…');
  const withMusic = path.join(outDir, 'video-avec-musique.mp4');
  await assembleVideo({ beats: aligned, audioPath, wordTimings, outputPath: withMusic, accent, musicPath: resolveMusic() });

  console.log('🎬 Montage SANS musique…');
  const noMusic = path.join(outDir, 'video-sans-musique.mp4');
  await assembleVideo({ beats: aligned, audioPath, wordTimings, outputPath: noMusic, accent, musicPath: null });

  fs.writeFileSync(path.join(outDir, 'script.md'), `# Le bilan Milei (vidéo)\n\n${scriptText}\n`);
  console.log(`\n✅ Avec musique : ${withMusic}\n✅ Sans musique : ${noMusic}`);
}

main().catch((e) => { console.error('💥', e.message); console.error(e.stack); process.exit(1); });

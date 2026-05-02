#!/usr/bin/env node
/**
 * Pipeline Vidéo — Où Va l'Argent
 *
 * Produit une vidéo 30-60s pour Instagram Reels à partir d'une simple demande.
 *
 * Usage :
 *   node scripts/video-journalist.js --topic="impact de la guerre en Iran sur le prix de l'essence"
 *   node scripts/video-journalist.js --topic="..." --duration=60
 *   node scripts/video-journalist.js --script="texte déjà rédigé" --duration=30
 *   node scripts/video-journalist.js --topic="..." --no-ia     # Pexels seul (pas de Kling/Flux)
 *   node scripts/video-journalist.js --topic="..." --dry-run   # Pas d'envoi Telegram/Notion
 *   node scripts/video-journalist.js --reset                    # Vide le cache
 */

const fs = require('fs');
const path = require('path');

const {
  BASE,
  SCRIPTS_DIR,
  loadCache,
  saveCache,
  articleKey,
  slugify,
} = require('./journalist-modules/shared-utils');

const { writeScript } = require('./video-modules/script-writer');
const { generateVoice, alignBeatsToTimings } = require('./video-modules/voice-generator');
const { fetchVisualsForBeats, generateFluxImage } = require('./video-modules/visual-fetcher');
const { assembleVideo } = require('./video-modules/video-assembler');
const { generateCover } = require('./video-modules/cover-generator');
const { publishVideoToTelegram, publishVideoToNotion } = require('./video-modules/publisher');

const CACHE_PATH = path.join(SCRIPTS_DIR, '.video-cache.json');
const ARTICLES_DIR = path.join(BASE, 'Production interne/Réseaux Sociaux /Articles');

// ── CLI args ────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (prefix) => {
  const a = args.find((x) => x.startsWith(prefix));
  return a ? a.slice(prefix.length) : null;
};
const topic = getArg('--topic=');
const providedScript = getArg('--script=');
const durationArg = getArg('--duration=');
const duration = durationArg ? parseInt(durationArg, 10) : 45;
const dryRun = args.includes('--dry-run');
const noIa = args.includes('--no-ia');
const noLlm = args.includes('--no-llm');
const doReset = args.includes('--reset');
const musicArg = getArg('--music=');
const noMusic = args.includes('--no-music');

// Cherche une musique de fond :
// 1. Flag --music=path explicite
// 2. sinon un MP3 dans Site/scripts/video-modules/assets/music/ (pick aléatoire)
// 3. sinon aucune musique
function resolveMusicPath() {
  if (noMusic) return null;
  if (musicArg) {
    return path.isAbsolute(musicArg) ? musicArg : path.join(process.cwd(), musicArg);
  }
  const musicDir = path.join(SCRIPTS_DIR, 'video-modules', 'assets', 'music');
  if (!fs.existsSync(musicDir)) return null;
  const tracks = fs.readdirSync(musicDir).filter((f) => /\.(mp3|m4a|wav|aac)$/i.test(f));
  if (tracks.length === 0) return null;
  return path.join(musicDir, tracks[Math.floor(Math.random() * tracks.length)]);
}

// ── Main ────────────────────────────────────────────

async function main() {
  console.log('\n🎬 Pipeline Vidéo — Où Va l\'Argent');
  console.log('─'.repeat(50));

  if (doReset) {
    if (fs.existsSync(CACHE_PATH)) fs.unlinkSync(CACHE_PATH);
    console.log('  🗑  Cache réinitialisé');
    return;
  }

  if (!topic && !providedScript) {
    console.error('❌ Usage : --topic="sujet" ou --script="texte"');
    process.exit(1);
  }

  if (![15, 20, 25, 30, 45, 60, 75, 90].includes(duration)) {
    console.error('❌ --duration doit être 15, 20, 25, 30, 45, 60, 75 ou 90');
    process.exit(1);
  }

  const cache = loadCache(CACHE_PATH, 72);
  const cacheKey = articleKey(topic || providedScript.slice(0, 60));
  if (cache[cacheKey] && !providedScript) {
    console.log('  ℹ Sujet déjà traité dans les 72h. --reset pour forcer.');
    return;
  }

  // 1. Script + plan visuel
  console.log(`\n[1/7] ✍️  ${noLlm ? 'Découpage local (sans LLM)' : 'Rédaction script (Sonnet)'}…`);
  const script = await writeScript({
    topic: topic || 'Script personnalisé',
    duration,
    providedScript,
    noLlm,
  });
  console.log(`  → ${script.titre}`);
  console.log(`  → ${script.beats.length} beats, ~${script.scriptText.split(/\s+/).length} mots`);
  const chiffres = script.scriptText.match(/\b\d[\d\s.,]*(?:euros?|€|%|centimes?|milliards?|millions?|dollars?)\b/gi) || [];
  if (chiffres.length > 2) {
    console.log(`  ⚠ ${chiffres.length} chiffres détectés (règle : max 2). Vérifier le script.`);
  }

  // 2. Setup dossier de sortie
  const dateStr = new Date().toISOString().split('T')[0];
  const outDir = path.join(ARTICLES_DIR, dateStr, script.slug);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Sauvegarde script.md tout de suite (utile si les étapes suivantes échouent)
  fs.writeFileSync(
    path.join(outDir, 'script.md'),
    `# ${script.titre}\n\n**Catégorie** : ${script.categorie}\n**Durée** : ${duration}s\n**Topic** : ${script.topic}\n\n## Script voix off\n\n${script.scriptText}\n\n## Beats (plan visuel)\n\n\`\`\`json\n${JSON.stringify(script.beats, null, 2)}\n\`\`\`\n\n## Sources à fact-checker\n\n${(script.sources || []).map((s) => `- ${s.nom} (${s.annee || 'n.d.'}) ${s.url || ''}`).join('\n')}\n`
  );

  // 3. Voix off ElevenLabs
  console.log('\n[2/7] 🎙  Voix off (ElevenLabs)…');
  const audioPath = path.join(outDir, 'audio.mp3');
  const { wordTimings, durationSec } = await generateVoice({
    scriptText: script.scriptText,
    outputPath: audioPath,
  });
  console.log(`  → audio.mp3 (${durationSec?.toFixed(1) ?? '?'}s, ${wordTimings.length} mots)`);

  // 4. Alignement des beats sur les timings réels
  const alignedBeats = alignBeatsToTimings(script.beats, wordTimings);
  console.log(`  → beats alignés sur timings ElevenLabs`);

  // 5. Visuels (parallèle) — Pexels + Kling
  console.log('\n[3/7] 🎞  Récupération visuels (Pexels' + (noIa ? '' : ' + Kling via fal.ai') + ')…');
  const enrichedBeats = await fetchVisualsForBeats({
    beats: alignedBeats,
    workDir: outDir,
    noIa,
    topic: script.topic || topic,
  });
  const klingCount = enrichedBeats.filter((b) => b.source === 'kling' || b.source === 'kling-cache').length;
  const pexelsCount = enrichedBeats.filter((b) => b.source === 'pexels').length;
  console.log(`  → ${pexelsCount} Pexels, ${klingCount} Kling, ${enrichedBeats.filter((b) => b.source === 'none').length} placeholder`);

  // 6. Miniature Instagram — Nano Banana (présentateur dans scène IA)
  console.log('\n[4/7] 🖼  Miniature Instagram…');
  const coverPath = path.join(outDir, 'cover.png');
  await generateCover({
    titre: script.titre,
    categorie: script.categorie,
    accent: script.accent,
    topic: script.topic || topic,
    outputPath: coverPath,
  });
  console.log(`  → cover.png`);

  // 7. Assemblage Remotion
  console.log('\n[5/7] 🎬 Montage Remotion…');
  const videoPath = path.join(outDir, 'video.mp4');
  const musicPath = resolveMusicPath();
  if (musicPath) {
    console.log(`  → musique de fond : ${path.basename(musicPath)}`);
  } else {
    console.log(`  → pas de musique de fond (dépose un MP3 dans video-modules/assets/music/)`);
  }
  await assembleVideo({
    beats: enrichedBeats.filter((b) => b.clipPath || b.imagePath),
    audioPath,
    wordTimings,
    outputPath: videoPath,
    accent: script.accent,
    musicPath,
    topic: script.topic || topic,
  });
  console.log(`  → video.mp4`);

  // 8. Caption Instagram (hashtags)
  console.log('\n[6/7] 📝 Caption Instagram…');
  const caption = buildCaption(script);
  fs.writeFileSync(path.join(outDir, 'caption.txt'), caption);
  console.log(`  → caption.txt`);

  // 9. Publication (Telegram + Notion)
  if (!dryRun) {
    console.log('\n[7/7] 📤 Publication…');
    try {
      await publishVideoToTelegram({
        videoPath,
        coverPath,
        titre: script.titre,
        categorie: script.categorie,
        caption,
      });
      console.log(`  → Telegram envoyé`);
    } catch (e) {
      console.error(`  ⚠ Telegram: ${e.message}`);
    }
    try {
      const pageId = await publishVideoToNotion({ videoPath, coverPath, script });
      if (pageId) console.log(`  → Notion créé (${pageId.slice(0, 8)}…)`);
    } catch (e) {
      console.error(`  ⚠ Notion: ${e.message}`);
    }
  } else {
    console.log('\n[7/7] (dry-run — pas d\'envoi)');
  }

  cache[cacheKey] = Date.now();
  saveCache(CACHE_PATH, cache);

  console.log('\n' + '─'.repeat(50));
  console.log(`✨ Vidéo prête : ${outDir.replace(BASE, '.')}`);
  console.log(`   ├─ video.mp4`);
  console.log(`   ├─ cover.png`);
  console.log(`   ├─ caption.txt`);
  console.log(`   ├─ script.md`);
  console.log(`   └─ audio.mp3`);
}

function buildCaption(script) {
  const hashtags = [
    '#ouvalargent',
    '#économie',
    '#finance',
    `#${(script.categorie || '').toLowerCase().replace(/[^a-z]/g, '')}`,
    '#france',
  ]
    .filter(Boolean)
    .join(' ');

  const body = [
    `💬 ${script.titre}`,
    '',
    script.scriptText.replace(/\.\.\.+/g, '').slice(0, 1500),
    '',
    '👉 Plus de chiffres sur ouvalargent.com',
    '',
    hashtags,
  ].join('\n');

  return body;
}

main().catch((e) => {
  console.error('\n💥 Erreur fatale :', e.message);
  console.error(e.stack);
  process.exit(1);
});

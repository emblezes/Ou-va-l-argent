/**
 * Voice generator — ElevenLabs avec timestamps mot-par-mot
 *
 * Utilise l'endpoint /v1/text-to-speech/{voice_id}/with-timestamps
 * qui renvoie audio base64 + alignment caractère-par-caractère.
 *
 * On convertit l'alignment en timings mot-par-mot, puis on aligne
 * les beats du plan visuel sur les mots du script prononcé.
 *
 * Sortie :
 *   {
 *     audioPath,      // chemin MP3 local
 *     durationSec,    // durée audio réelle
 *     wordTimings: [  // [{ word, startSec, endSec }, ...]
 *   }
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { loadConfig } = require('../journalist-modules/shared-utils');

const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech';

function loadVideoConfig() {
  const videoCfgPath = path.join(__dirname, '..', 'video-config.json');
  return JSON.parse(fs.readFileSync(videoCfgPath, 'utf-8'));
}

// Normalise le texte pour éviter les hallucinations ElevenLabs :
// - Points de suspension typographiques (…) → 3 points (.)
// - Tirets cadratins (— – ‒) → tirets simples (-)
// - Apostrophes typographiques (' ') → apostrophe ASCII (')
// - Guillemets français (« » " ") → guillemets simples
// - Double espaces → espace simple
// - Retours à la ligne multiples → 1 point + espace
function normalizeForTTS(text) {
  return text
    .replace(/…/g, '.')
    .replace(/[—–‒]/g, '-')
    .replace(/['']/g, "'")
    .replace(/[«»""]/g, '"')
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .replace(/\.\s*\./g, '.')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim();
}

async function generateVoice({ scriptText, outputPath }) {
  const videoCfg = loadVideoConfig();
  const config = loadConfig();
  const apiKey = process.env.ELEVENLABS_API_KEY || config.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || videoCfg.ELEVENLABS_VOICE_ID || config.ELEVENLABS_VOICE_ID;

  if (!apiKey) throw new Error('ELEVENLABS_API_KEY manquant (dans ~/.zshrc)');
  if (!voiceId) throw new Error('ELEVENLABS_VOICE_ID manquant (video-config.json ou env)');

  const normalizedText = normalizeForTTS(scriptText);
  const url = `${ELEVENLABS_API}/${voiceId}/with-timestamps`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      text: normalizedText,
      model_id: videoCfg.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
      apply_text_normalization: 'on',
      voice_settings: {
        stability: videoCfg.ELEVENLABS_STABILITY ?? 0.75,
        similarity_boost: videoCfg.ELEVENLABS_SIMILARITY ?? 0.85,
        style: videoCfg.ELEVENLABS_STYLE ?? 0.0,
        use_speaker_boost: videoCfg.ELEVENLABS_USE_SPEAKER_BOOST ?? true,
        speed: videoCfg.ELEVENLABS_SPEED ?? 0.92,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs API ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const audioB64 = data.audio_base64 || data.audio;
  if (!audioB64) throw new Error('ElevenLabs: audio_base64 manquant');

  fs.writeFileSync(outputPath, Buffer.from(audioB64, 'base64'));

  const alignment = data.alignment || data.normalized_alignment;
  let wordTimings = alignmentToWords(alignment, scriptText);

  // Post-process ffmpeg atempo pour ralentir encore, sans toucher au pitch.
  // Scale les wordTimings en conséquence (atempo=0.95 → durées × 1/0.95).
  const slowFactor = videoCfg.POST_SLOW_FACTOR ?? 1.0;
  if (slowFactor > 0 && slowFactor < 1) {
    try {
      const slowPath = outputPath.replace(/\.mp3$/i, '.slow.mp3');
      execSync(
        `ffmpeg -y -loglevel error -i "${outputPath}" -filter:a "atempo=${slowFactor}" "${slowPath}"`,
        { stdio: 'ignore' }
      );
      fs.renameSync(slowPath, outputPath);
      const inv = 1 / slowFactor;
      wordTimings = wordTimings.map((w) => ({
        word: w.word,
        startSec: w.startSec * inv,
        endSec: w.endSec * inv,
      }));
    } catch (e) {
      console.error(`  ⚠ ffmpeg atempo indisponible (${e.message.slice(0, 80)}) — ralentissement ignoré`);
    }
  }

  const durationSec = wordTimings.length
    ? wordTimings[wordTimings.length - 1].endSec
    : null;

  return { audioPath: outputPath, durationSec, wordTimings };
}

function alignmentToWords(alignment, text) {
  if (!alignment || !alignment.characters) return [];
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;

  const words = [];
  let current = '';
  let wordStart = null;
  let wordEnd = null;

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (/\s/.test(c) || /[.,!?;:…]/.test(c)) {
      if (current.length > 0) {
        words.push({
          word: current,
          startSec: wordStart,
          endSec: wordEnd,
        });
        current = '';
        wordStart = null;
      }
      continue;
    }
    if (current.length === 0) wordStart = starts[i];
    current += c;
    wordEnd = ends[i];
  }
  if (current.length > 0 && wordStart != null) {
    words.push({ word: current, startSec: wordStart, endSec: wordEnd });
  }

  return words;
}

/**
 * Aligne les beats du plan visuel sur les timings mots.
 * Pour chaque beat, on cherche sa phrase dans le flux des mots et on calcule startSec/endSec.
 */
function alignBeatsToTimings(beats, wordTimings) {
  const allWords = wordTimings.map((w) => w.word.toLowerCase().replace(/[^a-zàâéèêëïîôùûüÿç0-9€]/gi, ''));
  let cursor = 0;

  return beats.map((beat, beatIdx) => {
    const beatWords = beat.text
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zàâéèêëïîôùûüÿç0-9€]/gi, ''))
      .filter(Boolean);

    if (beatWords.length === 0) {
      const last = wordTimings[wordTimings.length - 1];
      return { ...beat, startSec: last?.endSec ?? 0, endSec: last?.endSec ?? 0 };
    }

    const firstTarget = beatWords[0];
    let matchStart = -1;
    for (let i = cursor; i < allWords.length; i++) {
      if (allWords[i] === firstTarget || allWords[i].startsWith(firstTarget) || firstTarget.startsWith(allWords[i])) {
        matchStart = i;
        break;
      }
    }
    if (matchStart < 0) matchStart = cursor;

    const matchEnd = Math.min(matchStart + beatWords.length - 1, wordTimings.length - 1);
    const startSec = wordTimings[matchStart]?.startSec ?? 0;
    const endSec = wordTimings[matchEnd]?.endSec ?? startSec + 2;

    cursor = matchEnd + 1;

    return {
      ...beat,
      startSec,
      endSec: beatIdx === beats.length - 1 ? (wordTimings[wordTimings.length - 1]?.endSec ?? endSec) : endSec,
    };
  });
}

module.exports = { generateVoice, alignBeatsToTimings, normalizeForTTS };

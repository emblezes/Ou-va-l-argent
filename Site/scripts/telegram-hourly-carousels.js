/**
 * Pipeline horaire carrousels — "Où va l'argent"
 *
 * Toutes les heures :
 *   1. Récupère les articles RSS (déduplication via cache)
 *   2. Si nouveautés → Claude extrait 3 idées de carrousel
 *   3. Pour chaque idée : télécharge photo Google + crée carrousel 2 slides
 *   4. Envoie les carrousels sur Telegram (album de 2 photos chacun)
 *   5. Range dans Actus chaudes/YYYY-MM-DD/
 *
 * Usage:
 *   node telegram-hourly-carousels.js              # Pipeline complet
 *   node telegram-hourly-carousels.js --dry-run    # Test sans envoi Telegram
 *   node telegram-hourly-carousels.js --reset      # Réinitialiser le cache
 *   node telegram-hourly-carousels.js --text-only  # Seulement le flash texte (pas de carrousel)
 *
 * Cron (toutes les 2 heures de 7h à 23h) :
 *   0 7-23/2 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/telegram-hourly-carousels.js >> /tmp/ovla-hourly.log 2>&1
 *
 * Coût estimé : ~$15-20/mois (Haiku × 9 exécutions/jour × 2 appels Claude)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseStringPromise } = require('xml2js');

// ── Chemins ──────────────────────────────────────────
const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent ';
const SCRIPTS_DIR = __dirname;
const RS_BASE = path.join(BASE, 'Production interne/Réseaux Sociaux ');
const HTML_DIR = path.join(RS_BASE, 'Infographies/Sources HTML');
const ACTUS_DIR = path.join(RS_BASE, 'Actus chaudes');

// ── Config ───────────────────────────────────────────
const CONFIG_PATH = path.join(SCRIPTS_DIR, 'telegram-config.json');
const CACHE_PATH = path.join(SCRIPTS_DIR, '.veille-carousel-cache.json');
const _fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NEWS_SOURCES, ANTHROPIC_API_KEY } = config;

// ── Date ─────────────────────────────────────────────
const NOW = new Date();
const DATE_STR = NOW.toISOString().slice(0, 10);
const TIME_STR = NOW.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const DAY_DIR = path.join(ACTUS_DIR, DATE_STR);

// ── Cache des articles déjà traités ──────────────────
function loadCache() {
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    const cutoff = Date.now() - 48 * 3600 * 1000;
    const cleaned = {};
    for (const [key, ts] of Object.entries(data)) {
      if (ts > cutoff) cleaned[key] = ts;
    }
    return cleaned;
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function articleKey(article) {
  return article.title.toLowerCase().replace(/[^a-zàâéèêëïîôùûüÿç0-9]/g, '').slice(0, 60);
}

// ── Prochain numéro d'infographie ────────────────────
function getNextInfographicNumber() {
  const existingFiles = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));
  let maxNum = 0;
  existingFiles.forEach(f => {
    const match = f.match(/^(\d+)-/);
    if (match) maxNum = Math.max(maxNum, parseInt(match[1]));
  });
  return maxNum + 1;
}

// ── Compression PNG → JPEG pour Telegram ─────────────
function compressForTelegram(pngPath) {
  const jpgPath = pngPath.replace(/\.png$/, '-tg.jpg');
  try {
    // sips est natif macOS, convertit PNG → JPEG avec compression
    execSync(`sips -s format jpeg -s formatOptions 75 "${pngPath}" --out "${jpgPath}" 2>/dev/null`, { timeout: 10000 });
    return jpgPath;
  } catch {
    return pngPath; // Fallback : envoyer le PNG tel quel
  }
}

function cleanupTelegramJpgs(dir) {
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('-tg.jpg'));
    files.forEach(f => fs.unlinkSync(path.join(dir, f)));
  } catch {}
}

// ── Nettoyage HTML pour Telegram ─────────────────────
function cleanForTelegram(text) {
  // Telegram ne supporte que <b>, <i>, <u>, <s>, <code>, <pre>, <a>
  // Supprimer les <span ...>...</span> en gardant le contenu
  return (text || '').replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
}

// ── Nettoyage markdown résiduel de Claude ────────────
function cleanMarkdown(text) {
  return (text || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold** → bold
    .replace(/\*([^*]+)\*/g, '$1')       // *italic* → italic
    .replace(/__([^_]+)__/g, '$1');      // __underline__ → underline
}

// ── Telegram ─────────────────────────────────────────
async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    const data = await res.json();
    return data.ok;
  } catch (e) {
    console.error('  ⚠ Telegram:', e.message);
    return false;
  }
}

async function sendTelegramAlbum(photoPaths, caption = '') {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`;
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const buffers = [];

  const media = photoPaths.map((p, i) => ({
    type: 'photo',
    media: `attach://photo${i}`,
    ...(i === 0 && caption ? { caption, parse_mode: 'HTML' } : {})
  }));

  // chat_id
  buffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}\r\n`));
  // media JSON
  buffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="media"\r\n\r\n${JSON.stringify(media)}\r\n`));

  // photo files
  for (let i = 0; i < photoPaths.length; i++) {
    const photoData = fs.readFileSync(photoPaths[i]);
    const fileName = path.basename(photoPaths[i]);
    const mime = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
    buffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo${i}"; filename="${fileName}"\r\nContent-Type: ${mime}\r\n\r\n`));
    buffers.push(photoData);
    buffers.push(Buffer.from('\r\n'));
  }

  buffers.push(Buffer.from(`--${boundary}--\r\n`));
  const body = Buffer.concat(buffers);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body
    });
    const data = await res.json();
    if (!data.ok) console.error('  ⚠ Telegram album:', data.description);
    return data.ok;
  } catch (e) {
    console.error('  ⚠ Telegram album:', e.message);
    return false;
  }
}

async function sendTelegramPhoto(photoPath, caption = '') {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const photoData = fs.readFileSync(photoPath);
  const fileName = path.basename(photoPath);

  const parts = [];
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}\r\n`));
  if (caption) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`));
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n`));
  }
  const mime = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${fileName}"\r\nContent-Type: ${mime}\r\n\r\n`));
  parts.push(photoData);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  const body = Buffer.concat(parts);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body
    });
    const data = await res.json();
    if (!data.ok) console.error('  ⚠ Telegram photo:', data.description);
    return data.ok;
  } catch (e) {
    console.error('  ⚠ Telegram photo:', e.message);
    return false;
  }
}

// ── RSS ──────────────────────────────────────────────
async function fetchAllRSS() {
  let allArticles = [];
  for (const source of NEWS_SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(source.url, { signal: controller.signal, headers: { 'User-Agent': 'OuVaLArgent-Bot/1.0' } });
      clearTimeout(timeout);
      const xml = await res.text();
      const parsed = await parseStringPromise(xml, { explicitArray: false });
      let items = [];
      if (parsed.rss?.channel?.item) {
        items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
      } else if (parsed.feed?.entry) {
        items = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
      }
      const mapped = items.slice(0, 10).map(item => ({
        title: item.title?._ || item.title || '',
        link: item.link?.$?.href || item.link || '',
        description: (item.description || item.summary?._ || item.summary || '').replace(/<[^>]*>/g, '').slice(0, 300),
        pubDate: item.pubDate || item.published || '',
        source: source.name
      }));
      allArticles.push(...mapped);
    } catch {
      // Silencieux en mode horaire
    }
  }
  return allArticles;
}

// ── Claude API ───────────────────────────────────────
async function askClaude(prompt, maxTokens = 4000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await res.json();
  if (data.error) {
    console.error('  ❌ Claude:', JSON.stringify(data.error));
    return '';
  }
  return data.content?.[0]?.text || '';
}

// ── Extraction des 3 idées de carrousel ──────────────
async function extractCarouselIdeas(articles, count = 3) {
  const articlesText = articles.slice(0, 25).map((a, i) =>
    `[${i + 1}] ${a.source} | ${a.title}\n${a.description}\n${a.link}`
  ).join('\n\n');

  const prompt = `Tu es un analyste économique pour "Où va l'argent" (ouvalargent.com).

Voici les NOUVELLES actualités économiques de la dernière heure :

${articlesText}

Sélectionne les ${count} actualités les plus visuelles/percutantes et transforme-les en carrousels Instagram de 4 slides.

DEUX TYPES DE SLIDES possibles :
1. "photo" : Photo plein écran + texte narratif en gras en bas (comme un post Legend/Brut)
2. "infographic" : Infographie "Où Va l'Argent" sur fond sombre — données visuelles, PAS juste du texte

STRUCTURE idéale :
- Slide 1 : TOUJOURS type "photo" — titre accrocheur principal
- Slides 2-4 : Mix de "photo" et "infographic" pour varier. Au moins 1 infographic par carrousel.
  - Les slides photo = narration, contexte, histoire
  - Les slides infographic = données visuelles qui FRAPPENT (chiffre, liste, classement, comparaison)

PENSE COMME UN INFOGRAPHISTE : L'infographic doit transmettre son message en 2 secondes sur mobile. Le chiffre/donnée clé doit être ÉNORME et immédiatement lisible. Choisis le type d'infographic le mieux adapté au MESSAGE, pas toujours mega_number.

TYPES D'INFOGRAPHIC DISPONIBLES :
- "mega_number" : UN SEUL gros chiffre (11rem). Utilise quand l'info clé EST un chiffre unique. stat_key = le chiffre, stat_unit = ce qu'il représente.
- "comparison" : Deux barres verticales côte à côte avec "vs". stat_key = "valeur1 vs valeur2", stat_unit = "label1 vs label2".
- "arrow_compare" : Avant → Après. stat_key = "avant → après".
- "key_list" : 2-5 points clés affichés EN GROS avec icônes/numéros. UTILISE QUAND L'INFO CLÉ EST UNE LISTE (thèmes, mesures, secteurs, étapes). list_items = [{emoji:"🏗️", label:"BTP", value:"40%"}, ...].
- "ranking" : Mini classement avec barres horizontales (3-5 items). list_items = [{emoji:"🇫🇷", label:"France", value:"112%"}, ...].
- "percentage_bar" : Un pourcentage avec barre de progression. stat_key = "75%", stat_unit = "des Français concernés".
- "dual_stat" : Deux chiffres côte à côte séparés par un trait. stat_key = "valeur1 | valeur2", stat_unit = "label1 | label2".

GUIDE DE CHOIX :
- L'article parle d'UN chiffre marquant → mega_number
- L'article compare DEUX valeurs → comparison ou dual_stat
- L'article montre une évolution → arrow_compare
- L'article liste des mesures/secteurs/thèmes → key_list
- L'article fait un classement → ranking
- L'article donne un pourcentage clé → percentage_bar

Retourne un JSON STRICT (rien d'autre) :
[
  {
    "slug": "mot-cle-court-en-kebab-case",
    "slides": [
      {
        "type": "photo",
        "text": "Titre accrocheur principal (2-3 phrases max, PAS de markdown)",
        "search_query": "mots clés Google Images pour une PHOTO réaliste concrète",
        "accent_words": ["mot1", "mot2"]
      },
      {
        "type": "photo",
        "text": "Suite de l'histoire (PAS de markdown, PAS de **gras**)",
        "search_query": "mots clés Google Images DIFFÉRENTS et concrets",
        "accent_words": ["mot1"]
      },
      {
        "type": "infographic",
        "stat_key": "42%",
        "stat_unit": "de hausse en 2 ans",
        "stat_sub": "Détail optionnel",
        "infographic_type": "mega_number",
        "slide_title": "Titre court et différent de la slide 1",
        "list_items": []
      },
      {
        "type": "photo",
        "text": "Conclusion ou mise en perspective (texte brut)",
        "search_query": "mots clés Google Images DIFFÉRENTS",
        "accent_words": ["mot1"]
      }
    ],
    "tag": "Thème (Économie, Transport, Logement, Alerte, International, Emploi, Énergie, Finance...)",
    "tag_color": "#ff4757",
    "theme": "bleu",
    "source": "Nom source · année",
    "source_url": "URL de l'article source",
    "instagram_caption": "Texte prêt à copier-coller pour Instagram. 3-4 phrases percutantes. Emojis. Hashtags (5 max). Pas de lien.",
    "flash_summary": "Résumé en 1 phrase"
  }
]

Règles :
- tag_color : #ff4757 (rouge/alerte), #00d4ff (cyan/neutre), #ffd700 (or/argent), #ff9f43 (orange), #a855f7 (violet/international), #00ff88 (vert/positif)
- theme : bleu (défaut, majorité des sujets), vert (investissement, croissance, écologie), violet (tech, innovation, crypto, IA), or (finance, bourse, patrimoine), rouge (dette, déficit, alertes), cyan (international, comparaisons). Varier les thèmes pour diversifier visuellement.
- search_query (pour slides photo) : mots clés visuels pour des PHOTOS réalistes (pas de dessins ni illustrations), chaque slide doit avoir une photo DIFFÉRENTE. Utiliser des termes concrets : lieu, personne, objet, événement.
- accent_words (pour slides photo) : 1-2 mots clés dans le texte à colorer. NE PAS utiliser de markdown (**gras**, *italique*).
- infographic_type : mega_number, comparison, arrow_compare, key_list, ranking, percentage_bar, dual_stat (voir guide ci-dessus)
- list_items : OBLIGATOIRE pour key_list et ranking. Tableau d'objets {emoji, label, value}. 2-5 items.
- Le slide_title de l'infographic doit être un ANGLE DIFFÉRENT de la slide 1 (pas reformulation mais complément)
- Le stat_key de l'infographic doit être LE CHIFFRE LE PLUS PERCUTANT de l'article (pas un détail secondaire)
- Slide 1 = TOUJOURS photo + titre accrocheur
- Varier l'ordre des types dans les slides 2-4 (pas toujours photo-infographic-photo)
- Texte des slides : PAS de markdown, PAS de **gras**, PAS de *italique*. Texte brut uniquement.
- instagram_caption : engageant, informatif, avec emojis et hashtags
- Seulement ${count} idées

Retourne UNIQUEMENT le JSON.`;

  const result = await askClaude(prompt);
  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Pas de JSON trouvé');
    const ideas = JSON.parse(jsonMatch[0]);
    return ideas.slice(0, count);
  } catch (err) {
    console.error(`  ❌ Erreur JSON: ${err.message}`);
    console.log('  Réponse:', result.slice(0, 300));
    return [];
  }
}

// ── Générateur HTML slide photo + texte (style Legend) ──
function generateSlideHTML(slideText, accentWords, tagColor, tag, source, slideNum, totalSlides, mainTitle, isFirstSlide) {
  const bgColor = tagColor || '#ff4757';

  // Nettoyer le markdown résiduel puis coloriser les mots accentués
  let styledText = cleanMarkdown(slideText);
  for (const word of (accentWords || [])) {
    const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    styledText = styledText.replace(regex, `<span class="accent-color">$1</span>`);
  }

  // Titre de rappel tronqué pour les slides 2+ (max 60 chars)
  const shortMainTitle = cleanForTelegram(mainTitle).length > 60
    ? cleanForTelegram(mainTitle).slice(0, 57) + '...'
    : cleanForTelegram(mainTitle);

  // En-tête : slide 1 = logo + tag, slides 2+ = logo seul
  const headerContent = `<div class="header">
          <div class="logo"><div class="logo-icon">\u20AC</div><span class="logo-text">O\u00F9 Va l'Argent ?</span></div>
       </div>`;

  const indicator = ''; // Pas de numérotation de slide

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Syne', sans-serif; background: #1a1a2e; padding: 0; display: flex; justify-content: center; }
        .infographic { width: 1080px; height: 1080px; position: relative; overflow: hidden; }
        .bg-photo { position: absolute; inset: 0; background-size: cover; background-position: center; }
        .overlay { position: absolute; inset: 0; background: ${isFirstSlide
          ? 'linear-gradient(to top, rgba(6, 8, 12, 0.95) 0%, rgba(6, 8, 12, 0.85) 20%, rgba(6, 8, 12, 0.5) 40%, rgba(6, 8, 12, 0.15) 60%, rgba(6, 8, 12, 0.1) 100%)'
          : 'linear-gradient(to top, rgba(6, 8, 12, 0.95) 0%, rgba(6, 8, 12, 0.8) 25%, rgba(6, 8, 12, 0.3) 50%, rgba(6, 8, 12, 0.15) 65%, rgba(6, 8, 12, 0.25) 100%)'}; }
        .content { position: relative; z-index: 1; height: 100%; padding: 35px 45px; display: flex; flex-direction: column; justify-content: space-between; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; }
        .logo { display: flex; align-items: center; gap: 10px; background: rgba(6, 8, 12, 0.6); backdrop-filter: blur(8px); padding: 8px 16px; border-radius: 10px; }
        .logo-icon { font-family: 'Instrument Serif', serif; font-size: 4rem; color: #00d4ff; line-height: 1; }
        .logo-text { font-family: 'Instrument Serif', serif; font-size: 1.8rem; font-style: italic; color: #ffffff; line-height: 1; }
        .ref-title { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.7); max-width: 60%; line-height: 1.3; background: rgba(6, 8, 12, 0.6); backdrop-filter: blur(10px); padding: 8px 14px; border-radius: 8px; border-left: 3px solid ${bgColor}; }
        .slide-indicator { display: none; }
        .title-area { display: flex; flex-direction: column; gap: 12px; }
        .news-title { font-family: 'Syne', sans-serif; font-size: ${isFirstSlide ? '2.6rem' : '2.2rem'}; font-weight: 700; color: #f0f4f8; line-height: 1.25; ${isFirstSlide ? 'padding: 0;' : `background: rgba(6, 8, 12, 0.7); backdrop-filter: blur(8px); border-radius: 14px; padding: 25px 30px; border-left: 5px solid ${bgColor};`} }
        .news-title .accent-color { color: ${bgColor}; font-weight: 800; }
        .footer-line { font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); }
    </style>
</head>
<body>
    <div class="infographic">
        <div class="bg-photo"></div>
        <div class="overlay"></div>
        ${indicator}
        <div class="content">
            ${headerContent}
            <div class="title-area">
                <div class="news-title">${styledText}</div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// ── Chemin complet vers Node (nécessaire pour cron) ──
const NODE_BIN = process.execPath; // Utilise le même Node qui exécute ce script

// ── Télécharger une photo Google Images ──────────────
function downloadPhoto(searchQuery, outputPath, index = 1) {
  try {
    const dlResult = execSync(
      `"${NODE_BIN}" "${path.join(SCRIPTS_DIR, 'download-google-image.js')}" "${searchQuery}" --output="${outputPath}" --index=${index}`,
      { encoding: 'utf-8', timeout: 45000, cwd: SCRIPTS_DIR }
    );
    const pathMatch = dlResult.match(/PATH=(.+)/);
    const realPath = pathMatch ? pathMatch[1].trim() : outputPath;
    if (fs.existsSync(realPath)) return realPath;
  } catch (e) {
    console.error(`    ⚠ Photo échouée: ${e.message.split('\n')[0]}`);
  }
  return null;
}

// ── Générateur d'infographie data HTML (fond sombre + data visuelle) ──
function generateInfographicHTML(slide, tagColor, tag, source, slideNum, totalSlides, mainTitle, themeName) {
  const bgColor = tagColor || '#ff4757';
  const statKey = cleanMarkdown(slide.stat_key || '');
  const statUnit = cleanMarkdown(slide.stat_unit || '');
  const statSub = cleanMarkdown(slide.stat_sub || '');
  const slideTitle = cleanMarkdown(slide.slide_title || '');
  const infType = slide.infographic_type || 'mega_number';

  // Couleurs secondaires pour les listes et classements
  const accentColors = ['#00d4ff', '#ffd700', '#ff4757', '#00ff88', '#a855f7', '#ff9f43'];

  let centerContent = '';
  if (infType === 'comparison') {
    const parts = statKey.split(/\s+vs\s+/i);
    const labels = statUnit.split(/\s+vs\s+/i);
    centerContent = `
      <div style="flex:1;display:flex;justify-content:center;align-items:center;gap:50px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
          <div style="width:200px;height:380px;display:flex;flex-direction:column;justify-content:flex-end;">
            <div style="width:100%;height:100%;border-radius:14px 14px 0 0;background:linear-gradient(180deg,${bgColor},${bgColor}99);display:flex;align-items:flex-start;justify-content:center;padding-top:25px;">
              <span style="font-family:'JetBrains Mono',monospace;font-size:3rem;font-weight:700;color:#06080c;">${parts[0] || statKey}</span>
            </div>
          </div>
          <span style="font-size:1.4rem;font-weight:700;color:#f0f4f8;text-align:center;">${labels[0] || ''}</span>
        </div>
        <span style="font-family:'Instrument Serif',serif;font-size:3.5rem;color:#4a5a6a;font-style:italic;">vs</span>
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
          <div style="width:200px;height:380px;display:flex;flex-direction:column;justify-content:flex-end;">
            <div style="width:100%;height:60%;border-radius:14px 14px 0 0;background:linear-gradient(180deg,#00d4ff,#00d4ff99);display:flex;align-items:flex-start;justify-content:center;padding-top:25px;">
              <span style="font-family:'JetBrains Mono',monospace;font-size:3rem;font-weight:700;color:#06080c;">${parts[1] || ''}</span>
            </div>
          </div>
          <span style="font-size:1.4rem;font-weight:700;color:#f0f4f8;text-align:center;">${labels[1] || ''}</span>
        </div>
      </div>`;
  } else if (infType === 'arrow_compare') {
    const parts = statKey.split(/\s*[→>]\s*/);
    centerContent = `
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:25px;">
        <div style="display:flex;align-items:center;gap:40px;">
          <div style="text-align:center;"><div style="font-family:'JetBrains Mono',monospace;font-size:7rem;font-weight:700;color:#00ff88;line-height:1;">${parts[0] || ''}</div><div style="font-size:1.2rem;color:#8899a8;">Avant</div></div>
          <div style="font-size:5rem;color:${bgColor};">→</div>
          <div style="text-align:center;"><div style="font-family:'JetBrains Mono',monospace;font-size:9rem;font-weight:700;color:${bgColor};line-height:1;">${parts[1] || ''}</div><div style="font-size:1.2rem;color:#8899a8;">Aujourd'hui</div></div>
        </div>
        ${statSub ? `<div style="display:flex;align-items:center;gap:15px;background:${bgColor}1a;border:1px solid ${bgColor}33;border-radius:16px;padding:18px 35px;"><span style="font-family:'JetBrains Mono',monospace;font-size:2.8rem;font-weight:700;color:${bgColor};">${statSub.split(' ')[0]}</span><span style="font-size:1.3rem;color:#8899a8;">${statSub.split(' ').slice(1).join(' ')}</span></div>` : ''}
      </div>`;

  } else if (infType === 'key_list') {
    // ── Liste de points clés (2-5 items affichés en GROS) ──
    const items = (slide.list_items || []).slice(0, 5);
    const itemsHTML = items.map((item, i) => {
      const color = accentColors[i % accentColors.length];
      const emoji = item.emoji || '';
      const label = cleanMarkdown(item.label || '');
      const value = cleanMarkdown(item.value || '');
      return `
        <div style="display:flex;align-items:center;gap:20px;background:rgba(255,255,255,0.04);border-radius:16px;padding:20px 30px;border-left:5px solid ${color};">
          ${emoji ? `<span style="font-size:2.8rem;">${emoji}</span>` : `<span style="font-family:'JetBrains Mono',monospace;font-size:2.2rem;font-weight:800;color:${color};min-width:50px;">${i + 1}</span>`}
          <div style="flex:1;">
            <div style="font-family:'Syne',sans-serif;font-size:${items.length <= 3 ? '2.2rem' : '1.8rem'};font-weight:700;color:#f0f4f8;line-height:1.2;">${label}</div>
            ${value ? `<div style="font-family:'JetBrains Mono',monospace;font-size:${items.length <= 3 ? '1.8rem' : '1.4rem'};font-weight:600;color:${color};margin-top:6px;">${value}</div>` : ''}
          </div>
        </div>`;
    }).join('');
    centerContent = `
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:${items.length <= 3 ? '20px' : '14px'};padding:0 10px;">
        ${itemsHTML}
      </div>`;

  } else if (infType === 'ranking') {
    // ── Mini classement avec barres horizontales (3-5 items) ──
    const items = (slide.list_items || []).slice(0, 5);
    const maxVal = Math.max(...items.map(it => parseFloat(String(it.value || '0').replace(/[^0-9.,]/g, '').replace(',', '.')) || 0), 1);
    const itemsHTML = items.map((item, i) => {
      const color = i === 0 ? bgColor : (i === 1 ? '#00d4ff' : '#4a5a6a');
      const label = cleanMarkdown(item.label || '');
      const value = cleanMarkdown(item.value || '');
      const numVal = parseFloat(String(value).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
      const pct = Math.max(15, Math.round((numVal / maxVal) * 100));
      const emoji = item.emoji || '';
      return `
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:1.6rem;font-weight:800;color:${color};min-width:38px;text-align:right;">${i + 1}</span>
          <div style="flex:1;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
              <span style="font-family:'Syne',sans-serif;font-size:${items.length <= 3 ? '1.9rem' : '1.5rem'};font-weight:700;color:#f0f4f8;">${emoji ? emoji + ' ' : ''}${label}</span>
              <span style="font-family:'JetBrains Mono',monospace;font-size:${items.length <= 3 ? '1.9rem' : '1.5rem'};font-weight:700;color:${color};">${value}</span>
            </div>
            <div style="width:100%;height:${items.length <= 3 ? '14px' : '10px'};background:rgba(255,255,255,0.08);border-radius:7px;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${color},${color}99);border-radius:7px;"></div>
            </div>
          </div>
        </div>`;
    }).join('');
    centerContent = `
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:${items.length <= 3 ? '25px' : '18px'};padding:0 10px;">
        ${itemsHTML}
      </div>`;

  } else if (infType === 'percentage_bar') {
    // ── Pourcentage avec barre de progression ──
    const pctNum = parseInt(String(statKey).replace(/[^0-9]/g, '')) || 0;
    centerContent = `
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:20px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:12rem;font-weight:700;color:${bgColor};line-height:1;text-shadow:0 0 80px ${bgColor}4d;">${statKey}</div>
        <div style="width:80%;height:28px;background:rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;">
          <div style="width:${Math.min(pctNum, 100)}%;height:100%;background:linear-gradient(90deg,${bgColor},${bgColor}dd);border-radius:14px;transition:width 1s;"></div>
        </div>
        <div style="font-family:'Instrument Serif',serif;font-size:3rem;color:#f0f4f8;font-style:italic;margin-top:5px;text-align:center;">${statUnit}</div>
        ${statSub ? `<div style="font-size:1.4rem;color:#8899a8;text-align:center;">${statSub}</div>` : ''}
      </div>`;

  } else if (infType === 'dual_stat') {
    // ── Deux chiffres côte à côte (sans barres, juste les chiffres) ──
    const parts = statKey.split(/\s*[|\/]\s*/);
    const labels = statUnit.split(/\s*[|\/]\s*/);
    centerContent = `
      <div style="flex:1;display:flex;justify-content:center;align-items:center;gap:60px;">
        <div style="text-align:center;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:7rem;font-weight:700;color:${bgColor};line-height:1;">${parts[0] || ''}</div>
          <div style="font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:600;color:#8899a8;margin-top:12px;">${labels[0] || ''}</div>
        </div>
        <div style="width:2px;height:200px;background:rgba(255,255,255,0.1);"></div>
        <div style="text-align:center;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:7rem;font-weight:700;color:#00d4ff;line-height:1;">${parts[1] || ''}</div>
          <div style="font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:600;color:#8899a8;margin-top:12px;">${labels[1] || ''}</div>
        </div>
      </div>`;

  } else {
    // ── mega_number (défaut) : un seul gros chiffre central ──
    centerContent = `
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11rem;font-weight:700;color:${bgColor};line-height:1;text-shadow:0 0 80px ${bgColor}4d;">${statKey}</div>
        <div style="font-family:'Instrument Serif',serif;font-size:3.5rem;color:#f0f4f8;font-style:italic;margin-top:10px;">${statUnit}</div>
        ${statSub ? `<div style="font-size:1.4rem;color:#8899a8;margin-top:15px;text-align:center;">${statSub}</div>` : ''}
      </div>`;
  }

  // Résoudre le thème de fond
  const { getThemeCSS } = require('./infographic-themes');
  const { theme: t } = getThemeCSS(themeName || 'bleu');
  const gridColor = t.gridColor;
  const glowColor = t.glowColor;
  const bgGrad = `linear-gradient(145deg,${t.bgStart} 0%,${t.bgMid} 50%,${t.bgEnd} 100%)`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Syne', sans-serif; background: #1a1a2e; padding: 0; display: flex; justify-content: center; }
        .infographic { width: 1080px; height: 1080px; position: relative; overflow: hidden; }
    </style>
</head>
<body>
    <div class="infographic">
        <div style="position:absolute;inset:0;background:${bgGrad};"></div>
        <div style="position:absolute;inset:0;background-image:linear-gradient(${gridColor} 1px,transparent 1px),linear-gradient(90deg,${gridColor} 1px,transparent 1px);background-size:40px 40px;"></div>
        <div style="position:absolute;width:700px;height:700px;background:radial-gradient(circle,${glowColor} 0%,transparent 70%);top:-100px;left:50%;transform:translateX(-50%);"></div>
        <div style="position:relative;z-index:1;height:100%;padding:50px 55px 40px;display:flex;flex-direction:column;">
            <div style="display:flex;justify-content:flex-start;align-items:flex-start;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-family:'Instrument Serif',serif;font-size:4rem;color:#00d4ff;line-height:1;">\u20AC</span>
                    <span style="font-family:'Instrument Serif',serif;font-size:1.8rem;font-style:italic;color:#ffffff;line-height:1;">O\u00F9 Va l'Argent ?</span>
                </div>
            </div>
            <h2 style="font-family:'Instrument Serif',serif;font-size:3.2rem;text-align:center;color:#f0f4f8;line-height:1.1;margin-top:15px;">${slideTitle}</h2>
            ${centerContent}
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid ${t.borderColor};">
                <span style="font-size:1rem;color:${t.footerDim};">Sources : <span style="color:${t.footerLight};">${source}</span></span>
                <span style="font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:600;color:${t.urlColor};">ouvalargent.com</span>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// ── Création d'un carrousel (mix photo + infographic) ──
async function createOneCarousel(idea, name) {
  const slides = idea.slides || [];
  if (slides.length === 0) return null;

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true });

  const totalSlides = slides.length;
  const mainTitle = slides[0]?.text || '';
  const instaSlides = [];
  const tmpFiles = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const slideNum = i + 1;
    const isFirst = i === 0;
    const slideType = slide.type || 'photo';

    const pngPath = path.join(DAY_DIR, `${name}-slide${slideNum}.png`);

    if (slideType === 'infographic') {
      // ── Slide infographie "Où Va l'Argent" ──
      const infHtml = generateInfographicHTML(slide, idea.tag_color, idea.tag, idea.source, slideNum, totalSlides, mainTitle, idea.theme);
      const htmlPath = path.join(DAY_DIR, `${name}-slide${slideNum}.html`);
      fs.writeFileSync(htmlPath, infHtml);
      tmpFiles.push(htmlPath);

      const page = await browser.newPage();
      await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.evaluateHandle('document.fonts.ready');
      await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
      await new Promise(r => setTimeout(r, 500));
      const el = await page.$('.infographic');
      await el.screenshot({ path: pngPath, type: 'png' });
      await page.close();

      console.log(`    ✓ Slide ${slideNum}/${totalSlides} [infographic] ${slide.slide_title || ''}`);
    } else {
      // ── Slide photo + texte (style Legend) ──
      const slideHtml = generateSlideHTML(
        slide.text, slide.accent_words, idea.tag_color, idea.tag,
        idea.source, slideNum, totalSlides, mainTitle, isFirst
      );
      const htmlPath = path.join(DAY_DIR, `${name}-slide${slideNum}.html`);
      fs.writeFileSync(htmlPath, slideHtml);
      tmpFiles.push(htmlPath);

      // Télécharger la photo
      const tmpPhoto = path.join(DAY_DIR, `${name}-photo${slideNum}.jpg`);
      console.log(`    📷 Recherche photo: "${slide.search_query}" → index ${slideNum <= 2 ? 1 : slideNum}`);
      const photoPath = downloadPhoto(slide.search_query, tmpPhoto, slideNum <= 2 ? 1 : slideNum);
      console.log(`    📷 Photo: ${photoPath ? `OK (${path.basename(photoPath)})` : 'ÉCHOUÉE'}`);
      if (photoPath) tmpFiles.push(photoPath);

      const page = await browser.newPage();
      await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.evaluateHandle('document.fonts.ready');

      // Injecter la photo en base64
      if (photoPath) {
        const imgBuffer = fs.readFileSync(photoPath);
        const ext = path.extname(photoPath).toLowerCase().replace('.', '');
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
        const dataUri = `data:${mime};base64,${imgBuffer.toString('base64')}`;
        await page.evaluate((uri) => {
          const bgPhoto = document.querySelector('.bg-photo');
          if (bgPhoto) bgPhoto.style.backgroundImage = `url("${uri}")`;
        }, dataUri);
        await new Promise(r => setTimeout(r, 800));
      }

      await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
      await new Promise(r => setTimeout(r, 500));
      const el = await page.$('.infographic');
      await el.screenshot({ path: pngPath, type: 'png' });
      await page.close();

      console.log(`    ✓ Slide ${slideNum}/${totalSlides} [photo]`);
    }

    instaSlides.push(pngPath);
  }

  await browser.close();

  // Nettoyage temporaires (HTML et photos)
  for (const f of tmpFiles) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }

  return { instaSlides, name };
}

// ── MAIN ─────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const reset = args.includes('--reset');
  const textOnly = args.includes('--text-only');
  const countArg = args.find(a => a.startsWith('--count='));
  const maxCarousels = countArg ? parseInt(countArg.replace('--count=', '')) : 3;

  if (reset) {
    if (fs.existsSync(CACHE_PATH)) fs.unlinkSync(CACHE_PATH);
    console.log('🗑️ Cache carrousels réinitialisé');
    process.exit(0);
  }

  console.log(`\n⏰ [${TIME_STR}] Pipeline horaire carrousels`);

  // 1. Charger cache et récupérer articles
  const cache = loadCache();
  const allArticles = await fetchAllRSS();
  const newArticles = allArticles.filter(a => {
    const key = articleKey(a);
    return !cache[key];
  });

  console.log(`  📊 ${allArticles.length} articles, ${newArticles.length} nouveaux`);

  if (newArticles.length === 0) {
    console.log('  Rien de nouveau.');
    saveCache(cache);
    process.exit(0);
  }

  // Marquer comme vus
  for (const a of newArticles) {
    cache[articleKey(a)] = Date.now();
  }
  saveCache(cache);

  // Si moins de 3 articles, envoyer juste un flash texte
  if (newArticles.length < 3) {
    const msg = `⚡ <b>Flash éco — ${TIME_STR}</b>\n\n` +
      newArticles.map(a => `• <b>${a.title}</b>\n<i>${a.source}</i>\n${a.link}`).join('\n\n');
    if (!dryRun) await sendTelegram(msg);
    console.log(`  ✓ Flash texte envoyé (${newArticles.length} articles, trop peu pour carrousels)`);
    process.exit(0);
  }

  // 2. Extraire 3 idées de carrousel via Claude
  console.log('  🤖 Extraction idées carrousel...');
  const ideas = await extractCarouselIdeas(newArticles, maxCarousels);

  if (ideas.length === 0) {
    console.log('  ❌ Aucune idée extraite');
    process.exit(1);
  }
  console.log(`  ✓ ${ideas.length} idées`);

  // En mode text-only, envoyer juste les résumés
  if (textOnly) {
    const msg = `⚡ <b>Flash éco — ${TIME_STR}</b>\n\n` +
      ideas.map((idea, i) => `${i + 1}. <b>${cleanForTelegram(idea.slides?.[0]?.text || idea.slug)}</b>\n${idea.flash_summary || ''}\n🔗 ${idea.source_url || ''}`).join('\n\n');
    if (!dryRun) await sendTelegram(msg);
    console.log('  ✓ Flash texte envoyé (--text-only)');
    process.exit(0);
  }

  // 3. Créer le dossier du jour
  if (!fs.existsSync(DAY_DIR)) {
    fs.mkdirSync(DAY_DIR, { recursive: true });
  }

  // 4. Créer les carrousels
  let nextNum = getNextInfographicNumber();
  const results = [];

  for (let i = 0; i < ideas.length; i++) {
    const idea = ideas[i];
    const num = nextNum + i;
    const name = `${num}-${idea.slug}`;

    console.log(`\n  🎠 [${i + 1}/${ideas.length}] ${name}`);
    try {
      const result = await createOneCarousel(idea, name);
      results.push({ ...result, idea, status: 'ok' });
      console.log(`    ✅ OK`);
    } catch (err) {
      console.error(`    ❌ ${err.message.split('\n')[0]}`);
      results.push({ name, status: 'error' });
    }
  }

  const ok = results.filter(r => r.status === 'ok');
  console.log(`\n  📦 ${ok.length}/${ideas.length} carrousels créés`);

  // 5. Envoyer sur Telegram
  if (dryRun) {
    console.log('  [DRY RUN] Pas d\'envoi Telegram');
    process.exit(0);
  }

  if (ok.length > 0) {
    // Envoyer chaque carrousel
    for (const result of ok) {
      const firstSlideText = cleanForTelegram(result.idea.slides?.[0]?.text || '');

      // ── Album des slides (photo + texte) ──
      const instaExisting = (result.instaSlides || []).filter(p => fs.existsSync(p));
      if (instaExisting.length > 0) {
        const jpgs = instaExisting.map(p => compressForTelegram(p));
        const albumCaption = `📸 <b>${firstSlideText}</b>\n🏷 ${result.idea.tag} · ${result.idea.source}\n🔗 ${result.idea.source_url || ''}`;
        const albumOk = await sendTelegramAlbum(jpgs, albumCaption);
        if (!albumOk) {
          for (let j = 0; j < jpgs.length; j++) {
            await sendTelegramPhoto(jpgs[j], j === 0 ? albumCaption : '');
            await new Promise(r => setTimeout(r, 500));
          }
        }
      }
      await new Promise(r => setTimeout(r, 1000));

      // ── Texte prêt à copier-coller ──
      if (result.idea.instagram_caption) {
        const captionMsg = `✏️ <b>Description :</b>\n\n${result.idea.instagram_caption}`;
        await sendTelegram(captionMsg);
      }

      await new Promise(r => setTimeout(r, 1500));
    }

    // Nettoyer les JPEG temporaires Telegram
    cleanupTelegramJpgs(DAY_DIR);
    console.log('  ✓ Carrousels envoyés sur Telegram');
  }

  console.log(`\n✅ [${TIME_STR}] Pipeline horaire terminé — ${ok.length} carrousels\n`);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});

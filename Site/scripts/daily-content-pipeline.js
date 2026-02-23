/**
 * Pipeline quotidien automatique — "Où va l'argent"
 *
 * Enchaîne automatiquement :
 *   1. Veille RSS → Synthèse Claude → Envoi Telegram
 *   2. Extraction des 5 idées de carrousel (via Claude, format JSON)
 *   3. Pour chaque idée : fact-check, recherche image, création carrousel 2 slides
 *   4. Rangement par date dans Actus chaudes/YYYY-MM-DD/
 *   5. Nettoyage des fichiers temporaires
 *
 * Usage:
 *   node daily-content-pipeline.js                    # Pipeline complet
 *   node daily-content-pipeline.js --veille-only      # Seulement la veille Telegram
 *   node daily-content-pipeline.js --from-json=<file> # Reprendre depuis un JSON d'idées sauvé
 *   node daily-content-pipeline.js --skip-telegram     # Pas d'envoi Telegram (test)
 *
 * Automatisation (cron) :
 *   0 8 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/daily-content-pipeline.js >> /tmp/ovla-pipeline.log 2>&1
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseStringPromise } = require('xml2js');

// ── Chemins ───────────────────────────────────────────
const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent ';
const SCRIPTS_DIR = path.join(BASE, 'Site/scripts');
const RS_BASE = path.join(BASE, 'Production interne/Réseaux Sociaux ');
const HTML_DIR = path.join(RS_BASE, 'Infographies/Sources HTML');
const ACTUS_DIR = path.join(RS_BASE, 'Actus chaudes');

// ── Config ────────────────────────────────────────────
const CONFIG_PATH = path.join(SCRIPTS_DIR, 'telegram-config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NEWS_SOURCES, ANTHROPIC_API_KEY } = config;

// ── Date du jour ──────────────────────────────────────
const TODAY = new Date();
const DATE_STR = TODAY.toISOString().slice(0, 10); // YYYY-MM-DD
const DATE_FR = TODAY.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// ── Dossier du jour ───────────────────────────────────
const DAY_DIR = path.join(ACTUS_DIR, DATE_STR);

// ── Trouver le prochain numéro d'infographie ──────────
function getNextInfographicNumber() {
  const existingFiles = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));
  let maxNum = 0;
  existingFiles.forEach(f => {
    const match = f.match(/^(\d+)-/);
    if (match) maxNum = Math.max(maxNum, parseInt(match[1]));
  });
  return maxNum + 1;
}

// ── Telegram ──────────────────────────────────────────
async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: false })
    });
    const data = await res.json();
    return data.ok;
  } catch (e) {
    console.error('  ⚠ Telegram:', e.message);
    return false;
  }
}

// Envoyer un album de 2 photos (carrousel) sur Telegram
async function sendTelegramAlbum(photoPaths, caption = '') {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`;
  const FormData = (await import('node:buffer')).Buffer ? null : null; // Node 18+ has native fetch

  // Construire le multipart form data manuellement
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const parts = [];

  const media = photoPaths.map((p, i) => ({
    type: 'photo',
    media: `attach://photo${i}`,
    ...(i === 0 && caption ? { caption, parse_mode: 'HTML' } : {})
  }));

  // Ajouter le champ media (JSON)
  parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}`);
  parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="media"\r\n\r\n${JSON.stringify(media)}`);

  // Ajouter les fichiers photo
  for (let i = 0; i < photoPaths.length; i++) {
    const photoData = fs.readFileSync(photoPaths[i]);
    const fileName = path.basename(photoPaths[i]);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="photo${i}"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`);
    parts.push(photoData);
    parts.push('\r\n');
  }

  // Construire le body final
  const textParts = parts.map(p => typeof p === 'string' ? Buffer.from(p) : p);
  const ending = Buffer.from(`--${boundary}--\r\n`);
  const body = Buffer.concat([...textParts, ending]);

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

// Envoyer une seule photo sur Telegram
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
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`));
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

// ── RSS ───────────────────────────────────────────────
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
        link: item.link?.$ ?.href || item.link || '',
        description: (item.description || item.summary?._ || item.summary || '').replace(/<[^>]*>/g, '').slice(0, 300),
        pubDate: item.pubDate || item.published || '',
        source: source.name
      }));
      console.log(`  ✓ ${source.name}: ${mapped.length} articles`);
      allArticles.push(...mapped);
    } catch (err) {
      console.warn(`  ⚠ ${source.name}: ${err.message}`);
    }
  }
  // Dedup
  const seen = new Set();
  allArticles = allArticles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-zàâéèêëïîôùûüÿç0-9]/g, '').slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  // Filtrer dernières 36h
  allArticles = allArticles.filter(a => {
    if (!a.pubDate) return true;
    return (Date.now() - new Date(a.pubDate).getTime()) < 36 * 3600 * 1000;
  });
  return allArticles;
}

// ── Claude API ────────────────────────────────────────
async function askClaude(prompt, model = 'claude-haiku-4-5-20251001', maxTokens = 4000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await res.json();
  if (data.error) {
    console.error('  ❌ Claude:', JSON.stringify(data.error));
    return '';
  }
  return data.content?.[0]?.text || '';
}

// ── ÉTAPE 1 : Veille RSS + Telegram ──────────────────
async function step1_veille(articles, skipTelegram) {
  console.log('\n═══ ÉTAPE 1 : Veille + Telegram ═══\n');

  const articlesText = articles.slice(0, 40).map((a, i) =>
    `[${i + 1}] ${a.source} | ${a.title}\n${a.description}\n${a.link}`
  ).join('\n\n');

  const synthesisPrompt = `Tu es un analyste économique pour le média "Où va l'argent" (ouvalargent.com).

Voici les articles économiques du jour :

${articlesText}

TÂCHE 1 — BRIEFING DU JOUR :
Sélectionne les 8-10 actualités les plus importantes/intéressantes pour un public français intéressé par l'économie et les finances.
Pour chaque actu, donne :
- Un titre reformulé percutant (1 ligne)
- Un résumé de 2-3 phrases
- Le lien source
- Si possible, un angle "où va l'argent" (impact sur les finances publiques, le pouvoir d'achat, l'investissement...)

TÂCHE 2 — 5 IDÉES DE CARROUSEL :
Propose 5 sujets d'infographie/carrousel Instagram tirés de l'actualité du jour.
Pour chaque idée :
- Titre accrocheur
- Le chiffre ou la stat clé à mettre en avant
- Le format recommandé (chiffre seul, comparaison, classement, photo actu...)
- Pourquoi ça va marcher (angle viral/engageant)
- Le lien de l'article source dont est tirée l'idée

FORMAT DE RÉPONSE (texte brut, pas de markdown complexe) :

📰 BRIEFING ÉCO DU JOUR

1. [TITRE]
[Résumé]
🔗 [lien]

2. [TITRE]
...

---

🎨 5 IDÉES DE CARROUSEL

1. [Titre]
📊 Stat clé : ...
📐 Format : ...
💡 Angle : ...
🔗 [lien source]

...`;

  console.log('🤖 Synthèse avec Claude...');
  const synthesis = await askClaude(synthesisPrompt);
  if (!synthesis) {
    console.error('❌ Synthèse vide');
    return null;
  }
  console.log(`  ✓ ${synthesis.length} caractères`);

  // Envoyer sur Telegram
  if (!skipTelegram) {
    console.log('📤 Envoi Telegram...');
    const header = `💰 <b>Où va l'argent — Veille du ${DATE_FR}</b>\n\n`;
    const fullMsg = header + synthesis;
    if (fullMsg.length <= 4096) {
      await sendTelegram(fullMsg);
    } else {
      const parts = splitMessage(fullMsg, 4000);
      for (let i = 0; i < parts.length; i++) {
        const prefix = i === 0 ? '' : `(${i + 1}/${parts.length}) `;
        await sendTelegram(prefix + parts[i]);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    console.log('  ✓ Veille envoyée');
  }

  return synthesis;
}

// ── ÉTAPE 2 : Extraire les idées en JSON structuré ───
async function step2_extractIdeas(synthesis) {
  console.log('\n═══ ÉTAPE 2 : Extraction des idées de carrousel ═══\n');

  const extractPrompt = `Voici la synthèse de veille d'aujourd'hui :

${synthesis}

Extrais les 5 idées de carrousel mentionnées et retourne-les en JSON STRICT (rien d'autre que le JSON).

Format attendu :
[
  {
    "slug": "mot-cle-court-en-kebab-case",
    "title_actu": "Titre pour la slide photo (court, percutant, 1-2 lignes max)",
    "title_html": "Même titre mais avec <span class='accent-red'>mot clé</span> coloré en HTML",
    "tag": "Thème court (Économie, Transport, Logement, Alerte, International, Emploi...)",
    "tag_color": "#ff4757",
    "stat_key": "Le chiffre ou la stat principale",
    "stat_unit": "L'unité ou contexte du chiffre",
    "stat_sub": "Stat secondaire ou contexte additionnel (optionnel)",
    "source": "Nom de la source · année",
    "search_query": "Mots clés Google Images pour trouver une photo pertinente (en français)",
    "infographic_type": "mega_number | comparison | arrow_compare"
  }
]

Règles :
- tag_color : #ff4757 (rouge/alerte), #00d4ff (cyan/neutre), #ffd700 (or/argent), #ff9f43 (orange/fraude), #a855f7 (violet/international), #00ff88 (vert/positif)
- infographic_type :
  - "mega_number" : un gros chiffre central (ex: +10%, 1,6 Md€)
  - "comparison" : deux barres côte à côte (ex: OUIGO +75% vs Inoui +8%)
  - "arrow_compare" : avant → après (ex: 15j → 6 mois)
- search_query : termes visuels pour trouver une PHOTO (pas un graphique), adaptés au sujet
- title_html : utiliser accent (cyan), accent-red (rouge), accent-gold (or) pour colorer 1-2 mots clés

Retourne UNIQUEMENT le JSON, sans aucun texte autour.`;

  const result = await askClaude(extractPrompt);
  try {
    // Extraire le JSON (peut être entouré de ```json ... ```)
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Pas de JSON trouvé');
    const ideas = JSON.parse(jsonMatch[0]);
    console.log(`  ✓ ${ideas.length} idées extraites`);
    return ideas;
  } catch (err) {
    console.error(`  ❌ Erreur parsing JSON: ${err.message}`);
    console.log('  Réponse Claude:', result.slice(0, 500));
    return [];
  }
}

// ── ÉTAPE 3 : Créer les carrousels ──────────────────
async function step3_createCarousels(ideas) {
  console.log('\n═══ ÉTAPE 3 : Création des carrousels ═══\n');

  if (!fs.existsSync(DAY_DIR)) {
    fs.mkdirSync(DAY_DIR, { recursive: true });
    console.log(`📁 Dossier créé : ${DATE_STR}/`);
  }

  let nextNum = getNextInfographicNumber();
  const results = [];

  for (let i = 0; i < ideas.length; i++) {
    const idea = ideas[i];
    const num = nextNum + i;
    const name = `${num}-${idea.slug}`;

    console.log(`\n── Carrousel ${i + 1}/5 : ${name} ──`);

    try {
      // 3a. Créer le HTML de l'infographie data
      console.log('  📊 Création infographie data...');
      const dataHtml = generateDataInfographic(idea, name, num);
      const htmlPath = path.join(HTML_DIR, `${name}.html`);
      fs.writeFileSync(htmlPath, dataHtml);
      console.log(`  ✓ ${name}.html`);

      // 3b. Rechercher et télécharger l'image
      console.log(`  🔍 Recherche image : "${idea.search_query}"`);
      const photoPath = path.join(DAY_DIR, `${name}-photo.jpg`);
      let photoOk = false;
      try {
        const dlResult = execSync(
          `node "${path.join(SCRIPTS_DIR, 'download-google-image.js')}" "${idea.search_query}" --output="${photoPath}" --index=1`,
          { encoding: 'utf-8', timeout: 45000, cwd: SCRIPTS_DIR }
        );
        // Trouver le vrai chemin (extension peut varier)
        const pathMatch = dlResult.match(/PATH=(.+)/);
        const realPath = pathMatch ? pathMatch[1].trim() : photoPath;
        if (fs.existsSync(realPath)) {
          idea._photoPath = realPath;
          photoOk = true;
          console.log(`  ✓ Photo téléchargée`);
        }
      } catch (e) {
        console.log(`  ⚠ Échec téléchargement image: ${e.message.split('\n')[0]}`);
      }

      // 3c. Créer le carrousel (slide 1 photo + slide 2 data)
      console.log('  🎠 Création carrousel...');
      const carouselArgs = [
        `--title="${idea.title_html}"`,
        `--tag="${idea.tag}"`,
        `--source="${idea.source}"`,
        `--name="${name}"`,
        `--infographic="${name}.html"`,
        `--tag-color="${idea.tag_color || '#ff4757'}"`,
      ];
      if (photoOk) {
        carouselArgs.push(`--photo="${idea._photoPath}"`);
      }

      const carouselResult = execSync(
        `node "${path.join(SCRIPTS_DIR, 'create-carousel-actu.js')}" ${carouselArgs.join(' ')}`,
        { encoding: 'utf-8', timeout: 60000, cwd: SCRIPTS_DIR }
      );

      // 3d. Déplacer les slides dans le dossier du jour
      const slide1Src = path.join(ACTUS_DIR, `${name}-slide1-actu-instagram.png`);
      const slide2Src = path.join(ACTUS_DIR, `${name}-slide2-data-instagram.png`);
      const actuHtmlSrc = path.join(ACTUS_DIR, `${name}-actu.html`);

      if (fs.existsSync(slide1Src)) {
        fs.renameSync(slide1Src, path.join(DAY_DIR, `${name}-slide1-actu.png`));
      }
      if (fs.existsSync(slide2Src)) {
        fs.renameSync(slide2Src, path.join(DAY_DIR, `${name}-slide2-data.png`));
      }
      // Nettoyer les fichiers temporaires (HTML actu, photo)
      if (fs.existsSync(actuHtmlSrc)) fs.unlinkSync(actuHtmlSrc);
      if (photoOk && fs.existsSync(idea._photoPath)) fs.unlinkSync(idea._photoPath);

      results.push({ name, status: 'ok' });
      console.log(`  ✅ ${name} terminé`);

    } catch (err) {
      console.error(`  ❌ Erreur: ${err.message.split('\n')[0]}`);
      results.push({ name, status: 'error', error: err.message.split('\n')[0] });
    }
  }

  return results;
}

// ── Générateur d'infographie data HTML ───────────────
function generateDataInfographic(idea, name, num) {
  const colors = {
    '#ff4757': { grid: 'rgba(255, 71, 87, 0.03)', glow: 'rgba(255, 71, 87, 0.14)' },
    '#00d4ff': { grid: 'rgba(0, 212, 255, 0.03)', glow: 'rgba(0, 212, 255, 0.14)' },
    '#ffd700': { grid: 'rgba(255, 215, 0, 0.03)', glow: 'rgba(255, 215, 0, 0.14)' },
    '#ff9f43': { grid: 'rgba(255, 159, 67, 0.03)', glow: 'rgba(255, 159, 67, 0.14)' },
    '#a855f7': { grid: 'rgba(168, 85, 247, 0.03)', glow: 'rgba(168, 85, 247, 0.14)' },
    '#00ff88': { grid: 'rgba(0, 255, 136, 0.03)', glow: 'rgba(0, 255, 136, 0.14)' },
  };
  const tagColor = idea.tag_color || '#ff4757';
  const c = colors[tagColor] || colors['#ff4757'];

  // Générer le contenu central selon le type
  let centerContent = '';
  if (idea.infographic_type === 'mega_number') {
    centerContent = `
        <div class="center-area">
            <div class="mega-number">${idea.stat_key}</div>
            <div class="mega-unit">${idea.stat_unit || ''}</div>
            ${idea.stat_sub ? `<div class="mega-sub">${idea.stat_sub}</div>` : ''}
        </div>`;
  } else if (idea.infographic_type === 'comparison') {
    // Essayer de parser stat_key comme "A vs B"
    const parts = (idea.stat_key || '').split(/\s+vs\s+/i);
    const val1 = parts[0] || idea.stat_key;
    const val2 = parts[1] || '';
    const labels = (idea.stat_unit || '').split(/\s+vs\s+/i);
    centerContent = `
        <div class="compare-area">
            <div class="compare-col">
                <div class="compare-bar-wrapper">
                    <div class="compare-bar" style="height: 100%; background: linear-gradient(180deg, ${tagColor}, ${tagColor}99); box-shadow: 0 0 40px ${tagColor}33;">
                        <div class="compare-val">${val1}</div>
                    </div>
                </div>
                <div class="compare-label">${labels[0] || ''}</div>
            </div>
            <div class="vs">vs</div>
            <div class="compare-col">
                <div class="compare-bar-wrapper">
                    <div class="compare-bar" style="height: 60%; background: linear-gradient(180deg, #00d4ff, #00d4ff99); box-shadow: 0 0 40px #00d4ff33;">
                        <div class="compare-val">${val2}</div>
                    </div>
                </div>
                <div class="compare-label">${labels[1] || ''}</div>
            </div>
        </div>`;
  } else if (idea.infographic_type === 'arrow_compare') {
    const parts = (idea.stat_key || '').split(/\s*[→>]\s*/);
    centerContent = `
        <div class="center-area">
            <div class="arrow-compare">
                <div class="time-box">
                    <div class="time-val" style="font-size: 7rem; color: #00ff88;">${parts[0] || ''}</div>
                    <div class="time-label">Avant</div>
                </div>
                <div class="arrow">→</div>
                <div class="time-box">
                    <div class="time-val" style="font-size: 9rem; color: ${tagColor};">${parts[1] || ''}</div>
                    <div class="time-label">Aujourd'hui</div>
                </div>
            </div>
            ${idea.stat_sub ? `<div class="sub-stat"><div class="sub-stat-val">${idea.stat_sub.split(' ')[0] || ''}</div><div class="sub-stat-label">${idea.stat_sub.split(' ').slice(1).join(' ') || ''}</div></div>` : ''}
        </div>`;
  } else {
    // Fallback : mega_number
    centerContent = `
        <div class="center-area">
            <div class="mega-number">${idea.stat_key}</div>
            <div class="mega-unit">${idea.stat_unit || ''}</div>
        </div>`;
  }

  // Styles spécifiques au type
  const typeStyles = idea.infographic_type === 'comparison' ? `
        .compare-area { flex: 1; display: flex; justify-content: center; align-items: center; gap: 50px; }
        .compare-col { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .compare-bar-wrapper { width: 200px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 440px; }
        .compare-bar { width: 100%; border-radius: 14px 14px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 25px; }
        .compare-val { font-family: 'JetBrains Mono', monospace; font-size: 3rem; font-weight: 700; color: var(--bg-deep); }
        .compare-label { font-size: 1.4rem; font-weight: 700; color: var(--text-primary); text-align: center; }
        .vs { font-family: 'Instrument Serif', serif; font-size: 3.5rem; color: var(--text-muted); font-style: italic; }
  ` : idea.infographic_type === 'arrow_compare' ? `
        .center-area { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 25px; }
        .arrow-compare { display: flex; align-items: center; gap: 40px; }
        .time-box { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .time-val { font-family: 'JetBrains Mono', monospace; font-weight: 700; line-height: 1; }
        .time-label { font-size: 1.2rem; color: var(--text-secondary); }
        .arrow { font-size: 5rem; color: ${tagColor}; }
        .sub-stat { display: flex; align-items: center; gap: 15px; background: ${tagColor}1a; border: 1px solid ${tagColor}33; border-radius: 16px; padding: 18px 35px; }
        .sub-stat-val { font-family: 'JetBrains Mono', monospace; font-size: 2.8rem; font-weight: 700; color: ${tagColor}; }
        .sub-stat-label { font-size: 1.3rem; color: var(--text-secondary); line-height: 1.3; }
  ` : `
        .center-area { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .mega-number { font-family: 'JetBrains Mono', monospace; font-size: 11rem; font-weight: 700; color: ${tagColor}; line-height: 1; text-shadow: 0 0 80px ${tagColor}4d; }
        .mega-unit { font-family: 'Instrument Serif', serif; font-size: 3.5rem; color: var(--text-primary); font-style: italic; margin-top: 10px; }
        .mega-sub { font-size: 1.4rem; color: var(--text-secondary); margin-top: 15px; text-align: center; }
  `;

  // Construire le titre (utiliser title_actu, pas title_html)
  const titleText = idea.title_actu || idea.slug.replace(/-/g, ' ');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${titleText}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --bg-deep: #06080c; --text-primary: #f0f4f8; --text-secondary: #8899a8; --text-muted: #4a5a6a; --accent-electric: #00d4ff; --glass-border: rgba(255, 255, 255, 0.1); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Syne', sans-serif; background: #1a1a2e; padding: 2rem; display: flex; justify-content: center; }
        .infographic { width: 1080px; height: 1080px; position: relative; overflow: hidden; }
        .bg-base { position: absolute; inset: 0; background: linear-gradient(145deg, var(--bg-deep) 0%, #0a1628 50%, var(--bg-deep) 100%); }
        .bg-grid { position: absolute; inset: 0; background-image: linear-gradient(${c.grid} 1px, transparent 1px), linear-gradient(90deg, ${c.grid} 1px, transparent 1px); background-size: 40px 40px; }
        .bg-glow-1 { position: absolute; width: 700px; height: 700px; background: radial-gradient(circle, ${c.glow} 0%, transparent 70%); top: -100px; left: 50%; transform: translateX(-50%); }
        .content { position: relative; z-index: 1; height: 100%; padding: 50px 55px 40px; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; }
        .logo { display: flex; align-items: center; gap: 10px; background: rgba(6, 8, 12, 0.6); backdrop-filter: blur(8px); padding: 8px 16px; border-radius: 10px; }
        .logo-icon { font-family: 'Instrument Serif', serif; font-size: 4rem; color: #00d4ff; line-height: 1; }
        .logo-text { font-family: 'Instrument Serif', serif; font-size: 1.8rem; font-style: italic; color: #ffffff; line-height: 1; }
        .chart-title { font-family: 'Instrument Serif', serif; font-size: 3.8rem; text-align: center; color: var(--text-primary); line-height: 1.1; margin-top: 15px; }
        .chart-title .accent { color: var(--accent-electric); font-style: italic; }
        .chart-title .accent-red { color: #ff4757; font-style: italic; }
        .chart-title .accent-gold { color: #ffd700; font-style: italic; }
        ${typeStyles}
        .footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--glass-border); }
        .source { font-size: 1rem; color: var(--text-muted); }
        .source span { color: var(--text-secondary); }
        .website { font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; font-weight: 500; color: var(--accent-electric); }
    </style>
</head>
<body>
    <div class="infographic" data-name="${name}">
        <div class="bg-base"></div>
        <div class="bg-grid"></div>
        <div class="bg-glow-1"></div>
        <div class="content">
            <div class="header">
                <div class="logo"><span class="logo-icon">\u20AC</span><span class="logo-text">O\u00F9 Va l'Argent</span></div>
            </div>
            <h2 class="chart-title">${idea.title_html}</h2>
            ${centerContent}
            <div class="footer">
                <div class="source">Sources : <span>${idea.source}</span></div>
                <div class="website">ouvalargent.com</div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// ── ÉTAPE 4 : Rapport + envoi images sur Telegram ───
async function step4_report(results, skipTelegram, ideas) {
  console.log('\n═══ ÉTAPE 4 : Rapport + envoi images Telegram ═══\n');

  const ok = results.filter(r => r.status === 'ok');
  const err = results.filter(r => r.status === 'error');

  console.log(`  ✅ ${ok.length} carrousels créés`);
  if (err.length > 0) console.log(`  ❌ ${err.length} erreurs`);
  console.log(`  📁 Dossier : ${DATE_STR}/`);

  if (skipTelegram) return;

  // Notification résumé
  if (ok.length > 0) {
    const report = `🎨 <b>Production du jour — ${DATE_STR}</b>\n\n` +
      `✅ ${ok.length} carrousels prêts à publier :\n` +
      ok.map(r => `  • ${r.name}`).join('\n') +
      (err.length > 0 ? `\n\n❌ ${err.length} erreurs` : '') +
      `\n\n📸 Les images suivent ci-dessous ⬇️`;
    await sendTelegram(report);
    await new Promise(r => setTimeout(r, 1000));
  }

  // Envoyer chaque carrousel comme album de 2 photos
  for (const result of ok) {
    const slide1 = path.join(DAY_DIR, `${result.name}-slide1-actu.png`);
    const slide2 = path.join(DAY_DIR, `${result.name}-slide2-data.png`);

    // Trouver l'idée correspondante pour la caption
    const idea = ideas.find(i => result.name.includes(i.slug)) || {};
    const caption = `📸 <b>${idea.title_actu || result.name}</b>\n🏷 ${idea.tag || ''} · ${idea.source || ''}`;

    if (fs.existsSync(slide1) && fs.existsSync(slide2)) {
      console.log(`  📤 Envoi album : ${result.name}`);
      const albumOk = await sendTelegramAlbum([slide1, slide2], caption);
      if (!albumOk) {
        // Fallback : envoyer les photos séparément
        console.log('     Fallback : envoi séparé');
        await sendTelegramPhoto(slide1, caption);
        await new Promise(r => setTimeout(r, 500));
        await sendTelegramPhoto(slide2);
      }
    } else if (fs.existsSync(slide1)) {
      await sendTelegramPhoto(slide1, caption);
    }

    await new Promise(r => setTimeout(r, 1500)); // Éviter le rate limiting
  }

  console.log('  ✓ Images envoyées sur Telegram');
}

// ── Utilitaire ───────────────────────────────────────
function splitMessage(text, maxLen) {
  const parts = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) { parts.push(remaining); break; }
    let cutAt = remaining.lastIndexOf('\n', maxLen);
    if (cutAt === -1 || cutAt < maxLen * 0.5) cutAt = maxLen;
    parts.push(remaining.slice(0, cutAt));
    remaining = remaining.slice(cutAt).trim();
  }
  return parts;
}

// ── MAIN ─────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const veilleOnly = args.includes('--veille-only');
  const skipTelegram = args.includes('--skip-telegram');
  const fromJsonArg = args.find(a => a.startsWith('--from-json='));

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  💰 Pipeline quotidien — ${DATE_FR}`);
  console.log(`${'═'.repeat(50)}\n`);

  let ideas = [];

  if (fromJsonArg) {
    // Reprendre depuis un JSON existant
    const jsonPath = fromJsonArg.replace('--from-json=', '');
    ideas = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`📥 ${ideas.length} idées chargées depuis ${jsonPath}`);
  } else {
    // Veille complète
    console.log('📡 Récupération des flux RSS...');
    const articles = await fetchAllRSS();
    console.log(`\n📊 ${articles.length} articles uniques\n`);

    if (articles.length === 0) {
      console.log('❌ Aucun article, abandon.');
      process.exit(0);
    }

    const synthesis = await step1_veille(articles, skipTelegram);
    if (!synthesis) process.exit(1);

    if (veilleOnly) {
      console.log('\n✅ Veille terminée (--veille-only)\n');
      process.exit(0);
    }

    ideas = await step2_extractIdeas(synthesis);

    // Sauvegarder les idées en JSON (pour reprise si besoin)
    const ideasPath = path.join(DAY_DIR.replace(DATE_STR, ''), `${DATE_STR}-ideas.json`);
    if (!fs.existsSync(path.dirname(ideasPath))) fs.mkdirSync(path.dirname(ideasPath), { recursive: true });
    fs.writeFileSync(ideasPath, JSON.stringify(ideas, null, 2));
    console.log(`  💾 Idées sauvées : ${DATE_STR}-ideas.json`);
  }

  if (ideas.length === 0) {
    console.log('❌ Aucune idée extraite, abandon.');
    process.exit(1);
  }

  // Créer les carrousels
  const results = await step3_createCarousels(ideas);

  // Rapport final + envoi images Telegram
  await step4_report(results, skipTelegram, ideas);

  // Nettoyage du fichier JSON temporaire
  console.log('\n✅ Pipeline terminé !\n');
}

main().catch(err => {
  console.error('❌ Erreur pipeline:', err);
  process.exit(1);
});

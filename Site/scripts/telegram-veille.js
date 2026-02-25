/**
 * Bot de veille économique — "Où va l'argent"
 *
 * Récupère l'actualité économique française, synthétise avec Claude,
 * et envoie un briefing quotidien sur Telegram.
 *
 * Usage:
 *   node telegram-veille.js              # Veille complète (briefing + 5 idées carousel)
 *   node telegram-veille.js --test       # Test de connexion Telegram
 *   node telegram-veille.js --flash      # Juste les actus flash (sans carousel)
 *
 * Automatisation (cron) :
 *   0 8 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/telegram-veille.js
 */

const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

// ── Config ──────────────────────────────────────────────
const CONFIG_PATH = path.join(__dirname, 'telegram-config.json');
const _fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NEWS_SOURCES, ANTHROPIC_API_KEY } = config;

// ── Telegram API ────────────────────────────────────────
async function sendTelegram(text, parseMode = 'HTML') {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: false
    })
  });
  const data = await res.json();
  if (!data.ok) {
    console.error('Erreur Telegram:', data.description);
    return false;
  }
  return true;
}

// ── Récupération RSS ────────────────────────────────────
async function fetchRSS(source) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'OuVaLArgent-Bot/1.0' }
    });
    clearTimeout(timeout);

    const xml = await res.text();
    const parsed = await parseStringPromise(xml, { explicitArray: false });

    let items = [];
    if (parsed.rss?.channel?.item) {
      items = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item];
    } else if (parsed.feed?.entry) {
      items = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry];
    }

    return items.slice(0, 10).map(item => ({
      title: item.title?._  || item.title || '',
      link: item.link?.$ ?.href || item.link || '',
      description: (item.description || item.summary?._  || item.summary || '').replace(/<[^>]*>/g, '').slice(0, 300),
      pubDate: item.pubDate || item.published || item.updated || '',
      source: source.name,
      category: source.category,
      image: extractImage(item)
    }));
  } catch (err) {
    console.warn(`  ⚠ Erreur RSS ${source.name}: ${err.message}`);
    return [];
  }
}

function extractImage(item) {
  // Chercher l'image dans différents champs RSS
  if (item['media:content']?.$ ?.url) return item['media:content'].$.url;
  if (item['media:thumbnail']?.$ ?.url) return item['media:thumbnail'].$.url;
  if (item.enclosure?.$ ?.url && item.enclosure.$.type?.startsWith('image')) return item.enclosure.$.url;
  // Chercher dans la description HTML
  const imgMatch = (item.description || '').match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch) return imgMatch[1];
  return null;
}

// ── Claude API (synthèse) ───────────────────────────────
async function askClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  if (data.error) {
    console.error('  ❌ Erreur Claude API:', JSON.stringify(data.error));
    return '';
  }
  const text = data.content?.[0]?.text || '';
  console.log(`  ✓ Claude a répondu (${text.length} caractères)`);
  return text;
}

// ── Filtrage des dernières 24h ──────────────────────────
function isRecent(pubDate) {
  if (!pubDate) return true; // Inclure si pas de date
  const d = new Date(pubDate);
  const now = new Date();
  const diffH = (now - d) / (1000 * 60 * 60);
  return diffH < 36; // Dernières 36h pour couvrir les décalages
}

// ── Dédoublonner par titre similaire ────────────────────
function dedup(articles) {
  const seen = new Set();
  return articles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-zàâéèêëïîôùûüÿç0-9]/g, '').slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── MAIN ────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  // ─── Test de connexion ───
  if (args.includes('--test')) {
    console.log('🧪 Test de connexion Telegram...');
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('❌ Token ou Chat ID manquant dans telegram-config.json');
      process.exit(1);
    }
    const ok = await sendTelegram('✅ Bot "Où va l\'argent" connecté avec succès !');
    console.log(ok ? '✅ Message envoyé !' : '❌ Échec de l\'envoi');
    process.exit(0);
  }

  // Vérifier la config
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ Configurer TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID dans telegram-config.json');
    process.exit(1);
  }
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ Configurer ANTHROPIC_API_KEY dans telegram-config.json');
    process.exit(1);
  }

  const flashOnly = args.includes('--flash');
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  console.log(`\n📰 Veille économique — ${today}\n`);

  // ─── 1. Récupérer toutes les actus ───
  console.log('📡 Récupération des flux RSS...');
  let allArticles = [];
  for (const source of NEWS_SOURCES) {
    const articles = await fetchRSS(source);
    console.log(`  ✓ ${source.name}: ${articles.length} articles`);
    allArticles.push(...articles);
  }

  // Filtrer et dédoublonner
  allArticles = dedup(allArticles.filter(a => isRecent(a.pubDate)));
  console.log(`\n📊 ${allArticles.length} articles uniques des dernières 24h\n`);

  if (allArticles.length === 0) {
    await sendTelegram(`📰 <b>Veille du ${today}</b>\n\nAucun article récent trouvé. Vérifier les flux RSS.`);
    process.exit(0);
  }

  // ─── 2. Synthèse avec Claude ───
  console.log('🤖 Synthèse avec Claude...');

  const articlesText = allArticles.slice(0, 40).map((a, i) =>
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

  const synthesis = await askClaude(synthesisPrompt);

  // ─── 3. Envoyer sur Telegram ───
  console.log('📤 Envoi sur Telegram...');

  if (!synthesis || synthesis.length === 0) {
    console.error('  ❌ Synthèse vide, abandon de l\'envoi');
    await sendTelegram(`💰 <b>Où va l'argent — Veille du ${today}</b>\n\n❌ Erreur lors de la synthèse. Réessayer plus tard.`);
    process.exit(1);
  }

  // Message d'en-tête
  const header = `💰 <b>Où va l'argent — Veille du ${today}</b>\n\n`;

  // Découper si le message est trop long (Telegram max: 4096 chars)
  const fullMessage = header + synthesis;
  console.log(`  Message total: ${fullMessage.length} caractères`);

  if (fullMessage.length <= 4096) {
    const ok = await sendTelegram(fullMessage);
    console.log(ok ? '  ✓ Message envoyé' : '  ❌ Échec envoi');
  } else {
    // Découper en morceaux
    const parts = splitMessage(fullMessage, 4000);
    console.log(`  Découpage en ${parts.length} messages`);
    for (let i = 0; i < parts.length; i++) {
      const prefix = i === 0 ? '' : `(${i + 1}/${parts.length}) `;
      const ok = await sendTelegram(prefix + parts[i]);
      console.log(`  ${ok ? '✓' : '❌'} Message ${i + 1}/${parts.length} (${parts[i].length} car.)`);
      await new Promise(r => setTimeout(r, 1000)); // Éviter le rate limiting
    }
  }

  console.log('\n✅ Veille envoyée sur Telegram !\n');
}

function splitMessage(text, maxLen) {
  const parts = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      parts.push(remaining);
      break;
    }
    // Couper au dernier saut de ligne avant maxLen
    let cutAt = remaining.lastIndexOf('\n', maxLen);
    if (cutAt === -1 || cutAt < maxLen * 0.5) cutAt = maxLen;
    parts.push(remaining.slice(0, cutAt));
    remaining = remaining.slice(cutAt).trim();
  }
  return parts;
}

main().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});

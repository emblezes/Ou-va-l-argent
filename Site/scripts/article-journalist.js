#!/usr/bin/env node
/**
 * Pipeline Journaliste — Où Va l'Argent
 *
 * Produit 2-3 articles/jour à partir de l'actualité RSS,
 * les envoie sur Telegram pour validation,
 * et les publie via le workflow n8n existant.
 *
 * Usage :
 *   node scripts/article-journalist.js                    # Pipeline complet
 *   node scripts/article-journalist.js --dry-run          # Test sans envoi
 *   node scripts/article-journalist.js --analyse=<slug>   # Article analyse
 *   node scripts/article-journalist.js --count=2          # Nombre d'articles
 *   node scripts/article-journalist.js --publish          # Publier les validés
 *   node scripts/article-journalist.js --suggest-analyses # Suggérer des analyses
 *   node scripts/article-journalist.js --reset            # Reset cache
 */

const fs = require('fs');
const path = require('path');

const {
  BASE, SCRIPTS_DIR,
  loadConfig, askClaude,
  sendTelegram, sendTelegramPhoto,
  loadCache, saveCache, articleKey,
  fetchAllRSS
} = require('./journalist-modules/shared-utils');

const { writeArticle } = require('./journalist-modules/article-writer');
const { factCheck } = require('./journalist-modules/fact-checker');
const { generateHeroImage, getInfographieHero } = require('./journalist-modules/hero-generator');
const { writeAnalysis, listAvailableInfographies } = require('./journalist-modules/analysis-writer');
const { publishValidatedArticles } = require('./journalist-modules/article-publisher');

const CACHE_PATH = path.join(SCRIPTS_DIR, '.journalist-cache.json');
const HEROES_DIR = path.join(BASE, 'Production interne/Réseaux Sociaux /Articles');
const PUBLIC_HEROES_DIR = path.join(BASE, 'Site/public/news/heroes');

// ── CLI args ────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const countArg = args.find(a => a.startsWith('--count='));
const count = countArg ? parseInt(countArg.split('=')[1]) : 3;
const analyseArg = args.find(a => a.startsWith('--analyse='));
const doPublish = args.includes('--publish');
const doSuggest = args.includes('--suggest-analyses');
const doReset = args.includes('--reset');

// ── Main ────────────────────────────────────────────

async function main() {
  console.log('\n📰 Pipeline Journaliste — Où Va l\'Argent');
  console.log('─'.repeat(50));

  if (doReset) {
    if (fs.existsSync(CACHE_PATH)) fs.unlinkSync(CACHE_PATH);
    console.log('  🗑 Cache réinitialisé');
    return;
  }

  if (doPublish) {
    console.log('\n📤 Publication des articles validés...');
    const published = await publishValidatedArticles(dryRun);
    console.log(`\n✅ ${published.length} article(s) publié(s)`);
    return;
  }

  if (doSuggest) {
    await suggestAnalyses();
    return;
  }

  if (analyseArg) {
    const slug = analyseArg.split('=')[1];
    await generateAnalysis(slug);
    return;
  }

  // Default: news pipeline
  await newsPipeline();
}

// ── News Pipeline ───────────────────────────────────

async function newsPipeline() {
  // 1. Fetch RSS
  console.log('\n📡 Récupération RSS...');
  const articles = await fetchAllRSS();
  console.log(`  → ${articles.length} articles trouvés`);

  if (articles.length === 0) {
    console.log('  ⚠ Aucun article RSS récupéré');
    return;
  }

  // 2. Filter recent articles (less than 48h old) + dedup
  const now = Date.now();
  const recent = articles.filter(a => {
    if (!a.pubDate) return true; // Keep articles without date
    const pubTime = new Date(a.pubDate).getTime();
    return !isNaN(pubTime) && (now - pubTime) < 48 * 3600 * 1000;
  });
  console.log(`  → ${recent.length} articles récents (< 48h)`);

  const cache = loadCache(CACHE_PATH, 72);
  const fresh = recent.filter(a => !cache[articleKey(a.title)]);
  console.log(`  → ${fresh.length} nouveaux articles (cache 72h)`);

  if (fresh.length === 0) {
    console.log('  ℹ Pas de nouveaux articles. Relancez avec --reset pour réinitialiser.');
    return;
  }

  // 3. Claude Haiku selects best topics
  console.log('\n🤖 Sélection des sujets (Haiku)...');
  const topics = await selectTopics(fresh, count);
  console.log(`  → ${topics.length} sujet(s) sélectionné(s)`);

  // 4. Write articles
  const results = [];
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`\n✍️  Article ${i + 1}/${topics.length} : ${topic.title.slice(0, 60)}...`);

    try {
      // Write
      console.log('  📝 Rédaction (Sonnet)...');
      const article = await writeArticle(topic);

      // Fact-check
      console.log('  🔍 Fact-check (Haiku)...');
      const check = await factCheck(article, topic.description);
      article.factCheck = check;

      // Hero image
      console.log('  🖼 Génération image hero...');
      if (!fs.existsSync(HEROES_DIR)) fs.mkdirSync(HEROES_DIR, { recursive: true });
      const heroPath = path.join(HEROES_DIR, `${article.slug}.png`);
      await generateHeroImage(article, heroPath);
      article.heroPath = heroPath;

      // Copy to public for static serving
      if (!fs.existsSync(PUBLIC_HEROES_DIR)) fs.mkdirSync(PUBLIC_HEROES_DIR, { recursive: true });
      fs.copyFileSync(heroPath, path.join(PUBLIC_HEROES_DIR, `${article.slug}.png`));

      // Save to Notion
      console.log('  📋 Enregistrement Notion...');
      if (!dryRun) {
        const pageId = await saveToNotion(article);
        article.notionPageId = pageId;
      }

      // Send to Telegram
      console.log('  📱 Envoi Telegram...');
      if (!dryRun) {
        await sendArticleToTelegram(article);
      }

      // Update cache
      cache[articleKey(topic.title)] = Date.now();
      results.push(article);

      console.log(`  ✅ ${article.titre}`);
    } catch (e) {
      console.error(`  ❌ Erreur : ${e.message}`);
    }
  }

  // Save cache
  saveCache(CACHE_PATH, cache);

  // Summary
  console.log('\n' + '─'.repeat(50));
  console.log(`📊 Résultat : ${results.length}/${topics.length} articles générés`);
  if (dryRun) console.log('  (mode dry-run — rien n\'a été envoyé)');

  // Send summary to Telegram
  if (!dryRun && results.length > 0) {
    const titresList = results.map((a, i) => `${i + 1}. ${a.titre} (${a.categorie})`).join('\n');
    const summary = [
      `📋 <b>${results.length} nouveaux articles dans Notion</b>`,
      '',
      titresList,
      '',
      `→ À valider dans Notion`,
    ].join('\n');
    await sendTelegram(summary);
  }
}

// ── Topic Selection ─────────────────────────────────

async function selectTopics(articles, maxCount) {
  const articlesList = articles.slice(0, 30).map((a, i) =>
    `${i + 1}. [${a.source}] ${a.title}\n   ${a.description.slice(0, 150)}`
  ).join('\n\n');

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `Tu es un rédacteur en chef d'un média économique français libéral ("Où Va l'Argent").
Date du jour : ${today}

Sélectionne les ${maxCount} sujets les PLUS intéressants pour un article punchy et percutant.

Critères de sélection :
- ACTUALITÉ RÉCENTE (privilégie les sujets du jour ou de la veille, JAMAIS d'articles périmés)
- Impact sur les finances publiques, les impôts, ou le portefeuille des Français
- Présence de chiffres concrets et vérifiables
- Potentiel pédagogique (expliquer un mécanisme économique)
- Angle libéral possible (dépenses publiques, fiscalité, bureaucratie, liberté économique)
- Originalité (pas trop banal ou people)

ARTICLES DISPONIBLES :
${articlesList}

Réponds UNIQUEMENT en JSON (tableau) :
[
  { "index": 1, "reason": "Pourquoi ce sujet est intéressant (1 phrase)" },
  ...
]

Sélectionne EXACTEMENT ${maxCount} articles, pas plus.`;

  const raw = await askClaude(prompt, 'claude-haiku-4-5-20251001', 1000);
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return articles.slice(0, maxCount);

  try {
    const selections = JSON.parse(match[0]);
    return selections
      .map(s => articles[s.index - 1])
      .filter(Boolean)
      .slice(0, maxCount);
  } catch {
    return articles.slice(0, maxCount);
  }
}

// ── Markdown → Notion Blocks ────────────────────────

function markdownToNotionBlocks(md) {
  const blocks = [];
  const lines = md.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === '') continue;

    // Heading 2
    if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: parseInline(line.slice(3).trim()) }
      });
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { rich_text: parseInline(line.slice(4).trim()) }
      });
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: { rich_text: parseInline(line.slice(2).trim()) }
      });
      continue;
    }

    // Bullet list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: parseInline(line.slice(2).trim()) }
      });
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^\d+\.\s+/);
    if (numMatch) {
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: parseInline(line.slice(numMatch[0].length).trim()) }
      });
      continue;
    }

    // Regular paragraph
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: parseInline(line.trim()) }
    });
  }

  return blocks;
}

function parseInline(text) {
  // Split on bold markers and build rich_text array
  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before bold
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      if (before) parts.push({ type: 'text', text: { content: before } });
    }
    // Bold text
    parts.push({
      type: 'text',
      text: { content: match[1] },
      annotations: { bold: true }
    });
    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  const remaining = text.slice(lastIndex);
  if (remaining) parts.push({ type: 'text', text: { content: remaining } });

  // If nothing was parsed, return the whole text
  if (parts.length === 0) {
    parts.push({ type: 'text', text: { content: text } });
  }

  return parts;
}

// ── Notion ──────────────────────────────────────────

async function saveToNotion(article) {
  const config = loadConfig();
  const articlesDbId = config.ARTICLES_DB_ID;
  const notionSecret = process.env.NOTION_SECRET || config.NOTION_SECRET;

  if (!articlesDbId) {
    console.log('  ⚠ ARTICLES_DB_ID non configuré — article non sauvegardé dans Notion');
    return null;
  }

  const properties = {
    'Titre': { title: [{ text: { content: article.titre } }] },
    'Slug': { rich_text: [{ text: { content: article.slug } }] },
    'Type': { select: { name: article.type || 'News' } },
    'Categorie': { select: { name: article.categorie || 'Actu éco' } },
    'Date': { date: { start: new Date().toISOString().split('T')[0] } },
    'Statut': { select: { name: 'En validation' } },
    'Contenu': { rich_text: [{ text: { content: article.contenu.substring(0, 2000) } }] },
    'Chapeau': { rich_text: [{ text: { content: article.chapeau || '' } }] },
    'Sources': { rich_text: [{ text: { content: article.sources || '' } }] },
    'LinkedIn': { rich_text: [{ text: { content: (article.linkedin || '').substring(0, 2000) } }] },
    'Facebook': { rich_text: [{ text: { content: (article.facebook || '').substring(0, 2000) } }] },
    'Tags': { multi_select: (article.tags || []).map(t => ({ name: t })) },
    'Temps lecture': { number: article.temps_lecture || 3 },
    'Fact-check': { checkbox: article.factCheck?.verdict === 'PASS' }
  };

  if (article.source_url) {
    properties['Source URL'] = { url: article.source_url };
  }

  // Convert markdown content to Notion blocks (full article, no truncation)
  const children = markdownToNotionBlocks(article.contenu);

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notionSecret}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      parent: { database_id: articlesDbId },
      properties,
      children
    })
  });

  const data = await res.json();
  if (data.id) {
    return data.id;
  } else {
    console.error('  ⚠ Erreur Notion:', JSON.stringify(data).slice(0, 200));
    return null;
  }
}

// ── Telegram ────────────────────────────────────────

async function sendArticleToTelegram(article) {
  // Notification légère : juste le titre + catégorie + chapeau
  const caption = [
    `📰 <b>${article.titre}</b>`,
    `${article.categorie} · ${article.temps_lecture} min`,
    '',
    `<i>${article.chapeau}</i>`,
  ].join('\n');

  if (article.heroPath && fs.existsSync(article.heroPath)) {
    const result = await sendTelegramPhoto(article.heroPath, caption);
    if (result.ok && result.result?.message_id) {
      article.telegramMsgId = result.result.message_id;
    }
  } else {
    await sendTelegram(caption);
  }
}

function splitText(text, maxLen) {
  const chunks = [];
  let remaining = text;
  while (remaining.length > maxLen) {
    // Find last newline before maxLen
    let splitAt = remaining.lastIndexOf('\n', maxLen);
    if (splitAt < maxLen * 0.5) splitAt = maxLen; // fallback
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

// ── Analysis ────────────────────────────────────────

async function generateAnalysis(slug) {
  console.log(`\n📊 Génération d'une analyse pour : ${slug}`);

  try {
    const article = await writeAnalysis(slug);

    // Fact-check
    console.log('  🔍 Fact-check...');
    const check = await factCheck(article);
    article.factCheck = check;

    // Hero image (use infographie if available)
    const infraHero = getInfographieHero(slug);
    if (infraHero) {
      article.heroPath = infraHero;
      console.log('  🖼 Réutilisation image infographie');
    } else {
      if (!fs.existsSync(HEROES_DIR)) fs.mkdirSync(HEROES_DIR, { recursive: true });
      const heroPath = path.join(HEROES_DIR, `${article.slug}.png`);
      await generateHeroImage(article, heroPath);
      article.heroPath = heroPath;
      console.log('  🖼 Image hero générée');
    }

    // Copy to public for static serving
    if (article.heroPath && fs.existsSync(article.heroPath)) {
      if (!fs.existsSync(PUBLIC_HEROES_DIR)) fs.mkdirSync(PUBLIC_HEROES_DIR, { recursive: true });
      fs.copyFileSync(article.heroPath, path.join(PUBLIC_HEROES_DIR, `${article.slug}.png`));
    }

    // Save to Notion
    if (!dryRun) {
      await saveToNotion(article);
      console.log('  📋 Sauvegardé dans Notion');
    }

    // Send to Telegram
    if (!dryRun) {
      await sendArticleToTelegram(article);
      console.log('  📱 Envoyé sur Telegram');
    }

    console.log(`\n✅ Analyse générée : ${article.titre}`);
    console.log(`   ${article.temps_lecture} min de lecture`);
  } catch (e) {
    console.error(`  ❌ Erreur : ${e.message}`);
  }
}

// ── Suggest Analyses ────────────────────────────────

async function suggestAnalyses() {
  console.log('\n💡 Suggestion d\'analyses depuis les infographies...');

  const infographies = listAvailableInfographies();
  if (infographies.length === 0) {
    console.log('  ⚠ Aucune infographie trouvée');
    return;
  }

  // Check which already have articles (via cache)
  const cache = loadCache(CACHE_PATH, 720); // 30 days
  const withoutArticle = infographies.filter(slug => !cache[`analyse-${slug}`]);

  if (withoutArticle.length === 0) {
    console.log('  ℹ Toutes les infographies ont déjà un article');
    return;
  }

  // Ask Haiku to select the best 3
  const list = withoutArticle.slice(-20).map((s, i) => `${i + 1}. ${s}`).join('\n');
  const prompt = `Parmi ces infographies économiques, sélectionne les 3 plus pertinentes pour un article d'analyse approfondie :

${list}

Réponds en JSON : [{ "index": 1, "slug": "...", "reason": "..." }]`;

  const raw = await askClaude(prompt, 'claude-haiku-4-5-20251001', 500);
  const match = raw.match(/\[[\s\S]*\]/);

  if (match) {
    const suggestions = JSON.parse(match[0]);
    let msg = '💡 <b>Suggestions d\'analyses cette semaine</b>\n\n';
    for (const s of suggestions) {
      msg += `• <code>${s.slug}</code>\n  ${s.reason}\n\n`;
    }
    msg += 'Pour générer : <code>node scripts/article-journalist.js --analyse=SLUG</code>';

    if (!dryRun) await sendTelegram(msg);
    console.log(msg.replace(/<[^>]*>/g, ''));
  }
}

// ── Run ─────────────────────────────────────────────

main().catch(e => {
  console.error('\n💥 Erreur fatale:', e.message);
  process.exit(1);
});

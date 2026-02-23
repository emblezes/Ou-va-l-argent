/**
 * Phase 2 : Weekly Planner — Sélection et structuration de 21 idées
 *
 * 1. Claude Haiku sélectionne 21 sujets parmi les articles scrappés
 * 2. Claude Sonnet structure chaque idée en JSON détaillé
 * 3. Planifie sur 7 jours avec contraintes de variété
 * 4. Envoie le plan sur Telegram
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname, '..');
const CONFIG_PATH = path.join(SCRIPTS_DIR, 'telegram-config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ANTHROPIC_API_KEY } = config;

const { getWeekNumber } = require('./deep-scraper');

// ── Claude API ───────────────────────────────────────

async function askClaude(prompt, model = 'claude-haiku-4-5-20251001', maxTokens = 4000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 240000); // 4 min timeout
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (data.error) {
      console.error('  ❌ Claude:', JSON.stringify(data.error));
      return '';
    }
    return data.content?.[0]?.text || '';
  } catch (e) {
    clearTimeout(timeout);
    console.error('  ❌ Claude fetch:', e.message);
    return '';
  }
}

// ── Telegram ─────────────────────────────────────────

async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    return (await res.json()).ok;
  } catch (e) {
    console.error('  ⚠ Telegram:', e.message);
    return false;
  }
}

// ── Jours de la semaine ──────────────────────────────

function getWeekDates(startDate) {
  // startDate = prochain lundi
  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dates.push({
      day: days[i],
      date: d.toISOString().slice(0, 10),
      dayLabel: `${days[i].charAt(0).toUpperCase()}${days[i].slice(1)} ${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}`
    });
  }
  return dates;
}

function getNextMonday() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// ── Pass 1 : Sélection (Haiku) ──────────────────────

async function selectTopics(articles, count = 21) {
  const articlesText = articles.slice(0, 50).map((a, i) =>
    `[${i + 1}] ${a.source} (${a.category}) | ${a.title}\n${a.description}\nTags: ${a.tags.join(', ')}\nURL: ${a.link}`
  ).join('\n\n');

  const prompt = `Tu es le rédacteur en chef de "Où va l'argent" (ouvalargent.com), un média d'infographies sur l'économie et les finances publiques.

Voici ${articles.length} articles récents de sources institutionnelles et économiques :

${articlesText}

Sélectionne les ${count} MEILLEURS sujets pour des infographies permanentes (pas de l'actualité chaude, mais des données exploitables visuellement).

CRITÈRES DE SÉLECTION :
1. CHIFFRE CLÉ : L'article contient au moins un chiffre/donnée visualisable (%, €, classement, évolution)
2. IMPACT : Le sujet touche un grand public (impôts, retraites, emploi, pouvoir d'achat, dette)
3. ORIGINALITÉ : Pas un sujet déjà très couvert, ou un angle original sur un sujet connu
4. VISUALISABLE : Peut être résumé en UNE infographie lisible en 2 secondes

RÉPARTITION SOUHAITÉE :
- ~75% France (finances publiques, macro, impôts, social)
- ~25% International (comparaisons, Europe, monde)
- Variété de thèmes : dette, emploi, prix, retraites, entreprises, international, etc.

Pour chaque sujet sélectionné, indique :
- Le numéro de l'article source [N]
- Le thème principal
- Le type de visualisation recommandé
- Le chiffre/donnée clé à mettre en avant

Retourne un JSON STRICT :
[
  {
    "article_index": 1,
    "theme": "Finances publiques",
    "viz_type": "mega_number",
    "key_data": "3 305 Md€",
    "angle": "Description courte de l'angle choisi"
  }
]

Types de viz disponibles : mega_number, comparison, bar_chart, ranking, donut, line_chart, percentage_bar, dual_stat, timeline

IMPORTANT : Retourne UNIQUEMENT le JSON, rien d'autre.`;

  console.log('  🤖 Pass 1 : Sélection des sujets (Haiku)...');
  const response = await askClaude(prompt, 'claude-haiku-4-5-20251001', 6000);

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Pas de JSON trouvé');
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('  ❌ Parsing sélection:', e.message);
    return [];
  }
}

// ── Pass 2 : Structuration (Sonnet) ─────────────────

async function structureIdeas(selections, articles, weekDates, count = 21) {
  // Build context for each selection
  const selectionsWithContext = selections.slice(0, count).map((sel, i) => {
    const article = articles[sel.article_index - 1] || {};
    return {
      ...sel,
      title: article.title,
      description: article.description,
      source: article.source,
      link: article.link
    };
  });

  const daysSchedule = weekDates.map(d => `${d.dayLabel} (${d.date})`).join(', ');

  const prompt = `Tu es le directeur éditorial de "Où va l'argent" (ouvalargent.com).

Voici ${selectionsWithContext.length} sujets sélectionnés pour la semaine. Transforme-les en briefs d'infographies prêts à produire.

SUJETS :
${selectionsWithContext.map((s, i) => `[${i + 1}] ${s.title}
  Angle: ${s.angle}
  Donnée clé: ${s.key_data}
  Viz: ${s.viz_type}
  Theme: ${s.theme}
  Source: ${s.source}
  URL: ${s.link}
  Description: ${s.description}`).join('\n\n')}

JOURS DE LA SEMAINE : ${daysSchedule}

RÈGLES DE PLANIFICATION :
- 3 infographies par jour (${weekDates[0].date} → ${weekDates[6].date})
- PAS 2 fois le même thème dans la même journée
- Max 5 infographies d'un thème sur la semaine
- Varier les viz_type (pas 2x mega_number le même jour)
- Commencer la semaine par les sujets les plus forts

CHARTE GRAPHIQUE — couleurs de thème :
- "bleu" (défaut) : macro, divers
- "rouge" : dette, déficit, alertes, urgence
- "or" : finance, bourse, patrimoine
- "vert" : croissance, investissement, écologie
- "violet" : tech, innovation, IA
- "cyan" : international, comparaisons

TAGS DISPONIBLES (avec couleurs) :
- Finances publiques (#ff4757 rouge)
- Macro-économie (#00d4ff cyan)
- Emploi (#00ff88 vert)
- Investissement (#ffd700 or)
- International (#a855f7 violet)
- Immobilier (#ff9f43 orange)
- Retraites (#ff4757 rouge)
- Entreprises (#00d4ff cyan)
- Social (#00ff88 vert)
- Fiscalité (#ffd700 or)

TYPES DE VIZ :
- mega_number : 1 gros chiffre central (11rem). Pour UN chiffre unique marquant.
- comparison : 2 valeurs côte à côte. Pour confronter 2 données.
- bar_chart : Barres horizontales (3-7 items). Pour classements.
- ranking : Mini classement numéroté. Pour top 3-5.
- donut : Camembert. Pour répartition/distribution.
- line_chart : Courbe SVG. Pour évolution temporelle.
- percentage_bar : Barre de progression. Pour UN pourcentage.
- dual_stat : 2 chiffres côte à côte avec séparateur. Pour 2 données complémentaires.
- timeline : Barres verticales chronologiques. Pour évolution année par année.

Pour chaque infographie, retourne un JSON avec TOUTES les données nécessaires à la production.

IMPORTANT pour les données :
- stat_key = le chiffre/donnée PRINCIPAL affiché très gros
- stat_unit = ce que représente ce chiffre (en dessous)
- stat_sub = contexte additionnel (ligne en petit)
- Pour bar_chart/ranking : list_items = [{"label": "...", "value": "...", "width": 85}, ...] (width = largeur barre en %)
- Pour comparison : items = [{"label": "...", "value": "...", "color": "#..."}, {"label": "...", "value": "...", "color": "#..."}]
- Pour donut : segments = [{"label": "...", "value": "...", "percent": 45, "color": "#..."}, ...]
- Pour dual_stat : items = [{"value": "...", "label": "..."}, {"value": "...", "label": "..."}]

TEXTES DE PUBLICATION :
- instagram_caption : 150-200 mots, 3-5 hashtags, engageant, emoji
- linkedin_text : 300-400 mots, ton expert, chiffres sourcés
- twitter_text : < 280 chars, punchline + chiffre + lien

Retourne un JSON STRICT :
[
  {
    "id": 1,
    "day": "lundi",
    "date": "2026-02-23",
    "slug": "deficit-france-5pct-pib",
    "title_html": "Le déficit français dépasse<br><span class='accent'>5% du PIB</span>",
    "viz_type": "mega_number",
    "theme": "rouge",
    "tag": "Finances publiques",
    "tag_color": "#ff4757",
    "data": {
      "stat_key": "5,5%",
      "stat_unit": "du PIB en déficit",
      "stat_sub": "Pire que la moyenne européenne de 3,2%"
    },
    "source_text": "Eurostat · 2025",
    "source_url": "https://...",
    "instagram_caption": "...",
    "linkedin_text": "...",
    "twitter_text": "...",
    "notion_theme": "Finances publiques",
    "notion_type": "Stat choc",
    "status": "pending"
  }
]

IMPORTANT : Retourne UNIQUEMENT le JSON, rien d'autre.`;

  // Process in batches of 7 to avoid truncated JSON
  console.log('  🤖 Pass 2 : Structuration des idées par batch (Sonnet)...');
  const BATCH_SIZE = 7;
  const allIdeas = [];
  let globalId = 1;

  for (let b = 0; b < selectionsWithContext.length; b += BATCH_SIZE) {
    const batch = selectionsWithContext.slice(b, b + BATCH_SIZE);
    const batchNum = Math.floor(b / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(selectionsWithContext.length / BATCH_SIZE);
    console.log(`    Batch ${batchNum}/${totalBatches} (${batch.length} sujets)...`);

    // Determine which days this batch covers
    const startDay = Math.floor(b / 3);
    const batchDays = weekDates.slice(startDay, startDay + Math.ceil(batch.length / 3) + 1);

    const batchPrompt = prompt.replace(
      /SUJETS :[\s\S]*?JOURS DE LA SEMAINE/,
      `SUJETS :\n${batch.map((s, i) => `[${globalId + i}] ${s.title}
  Angle: ${s.angle}
  Donnée clé: ${s.key_data}
  Viz: ${s.viz_type}
  Theme: ${s.theme}
  Source: ${s.source}
  URL: ${s.link}
  Description: ${s.description}`).join('\n\n')}\n\nJOURS DE LA SEMAINE`
    ).replace(
      /Retourne un JSON STRICT/,
      `Les IDs commencent à ${globalId}. Retourne un JSON STRICT`
    );

    const response = await askClaude(batchPrompt, 'claude-sonnet-4-20250514', 8000);

    let parsed = [];
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Pas de JSON trouvé');
      let jsonStr = jsonMatch[0];
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        // Try to repair truncated JSON
        const lastComplete = jsonStr.lastIndexOf('}');
        if (lastComplete > 0) {
          jsonStr = jsonStr.slice(0, lastComplete + 1) + ']';
          parsed = JSON.parse(jsonStr);
          console.log(`    ⚠ JSON réparé (${parsed.length} idées)`);
        }
      }
    } catch (e) {
      console.error(`    ❌ Batch ${batchNum}:`, e.message);
    }

    allIdeas.push(...parsed);
    globalId += batch.length;

    // Rate limit between batches
    if (b + BATCH_SIZE < selectionsWithContext.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log(`  ✓ ${allIdeas.length} idées structurées au total`);
  return allIdeas;
}

// ── Telegram plan message ────────────────────────────

async function sendPlanToTelegram(plan, weekStr, dryRun = false) {
  const themeCount = {};
  plan.forEach(p => {
    themeCount[p.tag] = (themeCount[p.tag] || 0) + 1;
  });

  const vizEmojis = {
    mega_number: '🔢', comparison: '⚖️', bar_chart: '📊',
    ranking: '🏆', donut: '🍩', line_chart: '📈',
    percentage_bar: '📏', dual_stat: '🔀', timeline: '⏳'
  };

  // Group by day
  const byDay = {};
  plan.forEach(p => {
    if (!byDay[p.date]) byDay[p.date] = [];
    byDay[p.date].push(p);
  });

  let msg = `📋 <b>PLAN DE LA SEMAINE (${weekStr})</b>\n\n`;
  msg += `🔢 ${plan.length} infographies réparties :\n`;
  for (const [theme, count] of Object.entries(themeCount).sort((a, b) => b[1] - a[1])) {
    msg += `  • ${count}× ${theme}\n`;
  }
  msg += '\n';

  for (const [date, ideas] of Object.entries(byDay).sort()) {
    const dayLabel = ideas[0]?.day || date;
    const d = new Date(date);
    const dayNum = d.getDate();
    const monthNum = d.getMonth() + 1;
    msg += `📅 <b>${dayLabel.toUpperCase()} ${dayNum}/${String(monthNum).padStart(2, '0')}</b>\n`;
    for (const idea of ideas) {
      const emoji = vizEmojis[idea.viz_type] || '📌';
      msg += `  ${emoji} ${idea.title_html.replace(/<[^>]*>/g, '').replace(/<br\s*\/?>/g, ' ')} [${idea.viz_type}]\n`;
    }
    msg += '\n';
  }

  msg += `✅ Pour produire : <code>node weekly-content-machine.js --produce</code>\n`;
  msg += `✏️ Pour modifier : éditer <code>.weekly-plan-${weekStr}.json</code>\n`;

  if (dryRun) {
    console.log('\n[DRY RUN] Message Telegram :\n' + msg.replace(/<[^>]*>/g, ''));
    return true;
  }

  // Split if too long (Telegram max 4096 chars)
  if (msg.length > 4000) {
    const mid = msg.indexOf('\n📅', msg.indexOf('\n📅') + 1);
    if (mid > 0) {
      const part1 = msg.slice(0, mid);
      const part2 = msg.slice(mid);
      await sendTelegram(part1);
      await new Promise(r => setTimeout(r, 1000));
      return sendTelegram(part2);
    }
  }

  return sendTelegram(msg);
}

// ── Main Planner ─────────────────────────────────────

async function generateWeeklyPlan(scrapeResultsPath, count = 21, dryRun = false) {
  // Load scrape results
  let scrapeData;
  if (scrapeResultsPath && fs.existsSync(scrapeResultsPath)) {
    scrapeData = JSON.parse(fs.readFileSync(scrapeResultsPath, 'utf-8'));
  } else {
    // Find latest scrape file
    const { year, week } = getWeekNumber();
    const weekStr = `${year}-W${String(week).padStart(2, '0')}`;
    const autoPath = path.join(SCRIPTS_DIR, `.weekly-scrape-${weekStr}.json`);
    if (!fs.existsSync(autoPath)) {
      console.error('  ❌ Aucun fichier de scrape trouvé. Lancez --scrape d\'abord.');
      return null;
    }
    scrapeData = JSON.parse(fs.readFileSync(autoPath, 'utf-8'));
  }

  const articles = scrapeData.articles;
  console.log(`\n📝 Weekly Planner — ${articles.length} articles disponibles\n`);

  if (articles.length < 10) {
    console.error('  ❌ Pas assez d\'articles (<10). Ajoutez des sources ou relancez le scrape.');
    return null;
  }

  // Week dates
  const monday = getNextMonday();
  const weekDates = getWeekDates(monday);
  const { year, week } = getWeekNumber(monday);
  const weekStr = `${year}-W${String(week).padStart(2, '0')}`;

  // Pass 1: Select topics
  const selections = await selectTopics(articles, count);
  if (selections.length === 0) {
    console.error('  ❌ Aucun sujet sélectionné par Claude');
    return null;
  }
  console.log(`  ✓ ${selections.length} sujets sélectionnés`);

  // Pass 2: Structure ideas
  const plan = await structureIdeas(selections, articles, weekDates, count);
  if (plan.length === 0) {
    console.error('  ❌ Aucune idée structurée par Claude');
    return null;
  }
  console.log(`  ✓ ${plan.length} idées structurées`);

  // Save plan
  const planPath = path.join(SCRIPTS_DIR, `.weekly-plan-${weekStr}.json`);
  const planData = {
    week: weekStr,
    planned_at: new Date().toISOString(),
    monday: weekDates[0].date,
    sunday: weekDates[6].date,
    count: plan.length,
    ideas: plan
  };
  fs.writeFileSync(planPath, JSON.stringify(planData, null, 2));
  console.log(`  💾 Plan sauvé: ${path.basename(planPath)}`);

  // Send to Telegram
  await sendPlanToTelegram(plan, weekStr, dryRun);

  return planPath;
}

module.exports = { generateWeeklyPlan, askClaude, sendTelegram, getNextMonday, getWeekDates };

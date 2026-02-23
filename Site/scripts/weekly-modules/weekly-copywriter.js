/**
 * Phase 3b : Weekly Copywriter — Rédaction des textes de publication + newsletter
 *
 * Pour chaque infographie produite :
 * 1. Rédige un post LinkedIn long (300-500 mots, ton expert)
 * 2. Rédige une caption Instagram (150-250 mots, engageante)
 * 3. Rédige un tweet (< 280 chars)
 *
 * Pour la semaine :
 * 4. Rédige une newsletter complète reprenant les 21 infographies
 *
 * Les textes sont sauvés dans le plan JSON et dans un fichier séparé.
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname, '..');
const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent ';
const OUTPUT_DIR = path.join(BASE, 'Production interne/Réseaux Sociaux /Contenu Hebdo');

const CONFIG_PATH = path.join(SCRIPTS_DIR, 'telegram-config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const { ANTHROPIC_API_KEY } = config;

// ── Claude API ───────────────────────────────────────

async function askClaude(prompt, model = 'claude-sonnet-4-20250514', maxTokens = 8000) {
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
    })
  });
  const data = await res.json();
  if (data.error) {
    console.error('  ❌ Claude:', JSON.stringify(data.error));
    return '';
  }
  return data.content?.[0]?.text || '';
}

// ── LinkedIn + Instagram texts (batch of 3-5 ideas) ──

async function generateSocialTexts(ideas) {
  const ideasSummary = ideas.map((idea, i) => {
    const title = (idea.title_html || '').replace(/<[^>]*>/g, '').replace(/<br\s*\/?>/g, ' ');
    const data = idea.data || {};
    return `[${i + 1}] "${title}"
  Tag: ${idea.tag} | Type: ${idea.viz_type}
  Donnée clé: ${data.stat_key || ''} ${data.stat_unit || ''}
  Contexte: ${data.stat_sub || ''}
  Source: ${idea.source_text}
  URL: ${idea.source_url || ''}`;
  }).join('\n\n');

  const prompt = `Tu es le community manager de "Où va l'argent" (ouvalargent.com), un média d'infographies économiques.

Rédige les textes de publication pour ces ${ideas.length} infographies :

${ideasSummary}

Pour CHAQUE infographie, rédige :

═══ LINKEDIN (300-500 mots) ═══
Ton : Expert accessible, pédagogique mais pas condescendant.
Structure :
1. HOOK (1 phrase percutante qui donne envie de lire — chiffre choc ou question provocante)
2. CONTEXTE (2-3 phrases — d'où vient ce chiffre, pourquoi c'est important)
3. ANALYSE (3-5 phrases — ce que ça signifie concrètement, les implications)
4. MISE EN PERSPECTIVE (2-3 phrases — comparaison, évolution, ce que ça change)
5. OUVERTURE (1 question pour engager la discussion)
6. 3-5 hashtags pertinents

Règles LinkedIn :
- Commence par le chiffre clé ou une question forte (pas par "Saviez-vous que")
- Utilise des retours à la ligne fréquents (1 idée par paragraphe court)
- Mets les chiffres clés en gras avec des ** (markdown LinkedIn)
- Cite la source précise
- Ton professionnel mais engageant
- PAS de emoji dans le corps du texte (sauf 1-2 en fin)
- Termine par une question ouverte
- 300-500 mots MINIMUM

═══ INSTAGRAM (150-250 mots) ═══
Ton : Direct, punchy, accessible au grand public.
Structure :
1. HOOK (emoji + phrase d'accroche ultra courte)
2. LE CHIFFRE CLÉ (mis en valeur)
3. EXPLICATION simple (2-3 phrases, compréhensible par tous)
4. CONCLUSION / call-to-action ("Enregistre ce post", "Partage si...")
5. Ligne de hashtags (5-8 hashtags mixtes : populaires + niche)

Règles Instagram :
- Emoji au début de chaque bloc
- Langage simple, pas de jargon
- Ponctuation expressive (! mais pas ??)
- Hashtags sur une ligne séparée à la fin

═══ TWITTER (< 280 chars) ═══
- 1 punchline + 1 chiffre + lien
- 1-2 hashtags max

Retourne un JSON STRICT :
[
  {
    "id": 1,
    "linkedin": "texte linkedin complet...",
    "instagram": "texte instagram complet...",
    "twitter": "tweet < 280 chars"
  }
]

IMPORTANT : Retourne UNIQUEMENT le JSON, rien d'autre.`;

  const response = await askClaude(prompt, 'claude-sonnet-4-20250514', 12000);

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Pas de JSON trouvé');
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('  ❌ Parsing textes sociaux:', e.message);
    return [];
  }
}

// ── Newsletter ───────────────────────────────────────

async function generateNewsletter(ideas, weekStr, monday, sunday) {
  const ideasByDay = {};
  ideas.forEach(idea => {
    if (!ideasByDay[idea.date]) ideasByDay[idea.date] = [];
    ideasByDay[idea.date].push(idea);
  });

  const contentSummary = Object.entries(ideasByDay).sort(([a], [b]) => a.localeCompare(b)).map(([date, dayIdeas]) => {
    const dayLabel = dayIdeas[0]?.day || date;
    return `${dayLabel.toUpperCase()} ${date} :\n${dayIdeas.map(i => {
      const title = (i.title_html || '').replace(/<[^>]*>/g, '').replace(/<br\s*\/?>/g, ' ');
      const data = i.data || {};
      return `  - "${title}" (${i.tag}) — Chiffre clé: ${data.stat_key || ''} ${data.stat_unit || ''}`;
    }).join('\n')}`;
  }).join('\n\n');

  const prompt = `Tu es le rédacteur de la newsletter hebdomadaire de "Où va l'argent" (ouvalargent.com), un média d'infographies économiques suivi par un public curieux de comprendre les finances publiques et l'économie.

Voici les ${ideas.length} infographies de la semaine du ${monday} au ${sunday} :

${contentSummary}

Rédige une NEWSLETTER COMPLÈTE structurée comme suit :

═══ STRUCTURE ═══

1. OBJET DU MAIL (< 60 chars, accrocheur, avec 1 emoji)
   Ex: "📊 Dette, retraites, social : les chiffres de la semaine"

2. INTRODUCTION (3-4 phrases)
   - Phrase d'accroche liée à l'actualité de la semaine
   - Résumé des thèmes principaux couverts
   - Ton chaleureux et direct ("Cette semaine, on décrypte...")

3. LE CHIFFRE DE LA SEMAINE (1 infographie mise en avant)
   - Le chiffre le plus marquant parmi les 21
   - 100-150 mots d'analyse
   - Lien vers l'infographie

4. SECTION PAR SECTION (grouper les infographies par thème, pas par jour)
   Pour chaque thème (3-5 thèmes) :
   - Titre de section (emoji + thème)
   - Pour chaque infographie du thème :
     * Titre en gras
     * 2-3 phrases résumant le message clé
     * Le chiffre principal mis en valeur

5. LA PERSPECTIVE DE LA SEMAINE (150-200 mots)
   - Analyse transversale : quel fil rouge relie ces données ?
   - Ce que ça dit de l'état de l'économie française
   - Questions ouvertes pour la suite

6. CONCLUSION (2-3 phrases)
   - Encourager le partage
   - Renvoyer vers les réseaux sociaux
   - "À la semaine prochaine !"

═══ TON ═══
- Expert mais accessible
- Pédagogique sans être condescendant
- Factuel avec des opinions mesurées
- Phrases courtes, paragraphes aérés
- Pas d'excès d'emoji (1-2 par section max)

═══ FORMAT ═══
- Markdown (titres ##, gras **, listes -)
- 800-1200 mots au total
- Prêt à être envoyé tel quel via Substack/Mailchimp

Retourne le texte de la newsletter en markdown, rien d'autre.`;

  return askClaude(prompt, 'claude-sonnet-4-20250514', 8000);
}

// ── Save outputs ─────────────────────────────────────

function saveWeeklyTexts(planData, newsletter, weekStr) {
  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const weekDir = path.join(OUTPUT_DIR, weekStr);
  if (!fs.existsSync(weekDir)) {
    fs.mkdirSync(weekDir, { recursive: true });
  }

  // Save newsletter
  const newsletterPath = path.join(weekDir, `newsletter-${weekStr}.md`);
  fs.writeFileSync(newsletterPath, newsletter);
  console.log(`  💾 Newsletter: ${path.basename(newsletterPath)}`);

  // Save all LinkedIn texts in one file
  const linkedinAll = planData.ideas
    .filter(i => i.linkedin_long)
    .map(i => {
      const title = (i.title_html || '').replace(/<[^>]*>/g, '').replace(/<br\s*\/?>/g, ' ');
      return `═══════════════════════════════════════
📅 ${i.date} — ${i.tag}
${title}
═══════════════════════════════════════

${i.linkedin_long}

---
`;
    }).join('\n');
  const linkedinPath = path.join(weekDir, `linkedin-posts-${weekStr}.md`);
  fs.writeFileSync(linkedinPath, linkedinAll);
  console.log(`  💾 LinkedIn: ${path.basename(linkedinPath)}`);

  // Save all Instagram captions in one file
  const instaAll = planData.ideas
    .filter(i => i.instagram_long)
    .map(i => {
      const title = (i.title_html || '').replace(/<[^>]*>/g, '').replace(/<br\s*\/?>/g, ' ');
      return `═══════════════════════════════════════
📅 ${i.date} — ${i.tag}
${title}
═══════════════════════════════════════

${i.instagram_long}

---
`;
    }).join('\n');
  const instaPath = path.join(weekDir, `instagram-captions-${weekStr}.md`);
  fs.writeFileSync(instaPath, instaAll);
  console.log(`  💾 Instagram: ${path.basename(instaPath)}`);

  // Save all tweets in one file
  const tweetsAll = planData.ideas
    .filter(i => i.twitter_long)
    .map(i => {
      const title = (i.title_html || '').replace(/<[^>]*>/g, '').replace(/<br\s*\/?>/g, ' ');
      return `${i.date} | ${title}\n${i.twitter_long}\n`;
    }).join('\n');
  const tweetsPath = path.join(weekDir, `tweets-${weekStr}.md`);
  fs.writeFileSync(tweetsPath, tweetsAll);
  console.log(`  💾 Tweets: ${path.basename(tweetsPath)}`);

  return { newsletterPath, linkedinPath, instaPath, tweetsPath, weekDir };
}

// ── Main Copywriter ──────────────────────────────────

async function writeWeeklyContent(planPath) {
  const planData = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
  const ideas = planData.ideas.filter(i => i.status === 'exported');

  console.log(`\n✍️  Weekly Copywriter — ${ideas.length} infographies à rédiger\n`);

  if (ideas.length === 0) {
    console.log('  Rien à rédiger.');
    return null;
  }

  // Generate social texts in batches of 5 (to stay within token limits)
  const BATCH_SIZE = 5;
  let allTexts = [];

  for (let i = 0; i < ideas.length; i += BATCH_SIZE) {
    const batch = ideas.slice(i, i + BATCH_SIZE);
    console.log(`  📝 Rédaction batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ideas.length / BATCH_SIZE)} (${batch.length} posts)...`);

    const texts = await generateSocialTexts(batch);

    // Map texts back to ideas
    for (let j = 0; j < batch.length; j++) {
      const text = texts[j] || {};
      const ideaIndex = planData.ideas.findIndex(id => id.slug === batch[j].slug);
      if (ideaIndex >= 0) {
        planData.ideas[ideaIndex].linkedin_long = text.linkedin || planData.ideas[ideaIndex].linkedin_text || '';
        planData.ideas[ideaIndex].instagram_long = text.instagram || planData.ideas[ideaIndex].instagram_caption || '';
        planData.ideas[ideaIndex].twitter_long = text.twitter || planData.ideas[ideaIndex].twitter_text || '';
      }
    }

    allTexts.push(...texts);
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`  ✓ ${allTexts.length} sets de textes rédigés`);

  // Generate newsletter
  console.log(`  📰 Rédaction de la newsletter...`);
  const newsletter = await generateNewsletter(
    ideas,
    planData.week,
    planData.monday,
    planData.sunday
  );
  console.log(`  ✓ Newsletter rédigée (${newsletter.length} chars)`);

  // Save everything
  const savedFiles = saveWeeklyTexts(planData, newsletter, planData.week);

  // Update plan JSON with new texts
  fs.writeFileSync(planPath, JSON.stringify(planData, null, 2));
  console.log(`  ✓ Plan mis à jour avec les textes longs`);

  return savedFiles;
}

module.exports = { writeWeeklyContent };

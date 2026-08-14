#!/usr/bin/env node
/**
 * ============================================================================
 *  BRIEF MATINAL — 3 infographies inédites + textes, par mail chaque matin
 * ============================================================================
 *
 *  Chaque matin (cron 7h) :
 *    1. Scan des sources (13 sources institutionnelles + Google News RSS via
 *       weekly-sources.json, + flux actu de telegram-config.json)
 *    2. Lecture de la "mémoire" = toutes les infographies déjà produites
 *       (Sources HTML/) pour ne PAS retraiter un angle déjà couvert
 *    3. Claude Sonnet propose 3 angles INÉDITS, sourcés, avec données
 *    4. Fact-check de cohérence (Claude Haiku)
 *    5. Génération HTML (charte éditoriale) + PNG 1080×1080 (Puppeteer)
 *       → réutilise weekly-producer.js (mêmes patterns que tes infographies)
 *    6. Rédaction d'un texte LinkedIn par infographie
 *    7. Envoi du mail (3 PNG en pièce jointe + textes) via Gmail SMTP
 *
 *  Usage :
 *    node scripts/daily-brief-email.js              # run complet + envoi mail
 *    node scripts/daily-brief-email.js --dry-run    # tout sauf l'envoi mail
 *    node scripts/daily-brief-email.js --count=2    # nombre d'infographies
 *    node scripts/daily-brief-email.js --no-render  # planning seul (debug)
 *    node scripts/daily-brief-email.js --reset      # vide le cache anti-doublon
 *
 *  Secrets requis dans ~/.zshrc :
 *    ANTHROPIC_API_KEY, GMAIL_USER, GMAIL_APP_PASSWORD
 *    (optionnel) BRIEF_MAIL_TO
 *
 *  Cron suggéré :
 *    0 7 * * * cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && /usr/local/bin/node scripts/daily-brief-email.js >> /tmp/ovla-brief.log 2>&1
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const { askClaude, slugify, loadCache, saveCache, BASE } = require('./journalist-modules/shared-utils');
const { deepScrape } = require('./weekly-modules/deep-scraper');
const { produceWeeklyContent } = require('./weekly-modules/weekly-producer');
const { factCheck } = require('./journalist-modules/fact-checker');
const { sendBriefEmail } = require('./daily-brief-modules/email-sender');

const RS_BASE = path.join(BASE, 'Production interne/Réseaux Sociaux ');
const HTML_DIR = path.join(RS_BASE, 'Infographies/Sources HTML');
const INSTA_DIR = path.join(RS_BASE, 'Infographies/Insta & Autres');
const PLAN_PATH = path.join(__dirname, '.daily-brief-plan.json');
const CACHE_PATH = path.join(__dirname, '.daily-brief-cache.json');

// ── Flags ────────────────────────────────────────────
const ARGS = process.argv.slice(2);
const DRY = ARGS.includes('--dry-run');
const NO_RENDER = ARGS.includes('--no-render');
const RESET = ARGS.includes('--reset');
const COUNT = parseInt((ARGS.find(a => a.startsWith('--count=')) || '').split('=')[1], 10) || 3;
const MAIL_TO = process.env.BRIEF_MAIL_TO || process.env.GMAIL_USER || 'e.blezes@gmail.com';

const VIZ_TYPES = ['mega_number', 'comparison', 'bar_chart', 'ranking', 'line_chart', 'percentage_bar', 'dual_stat', 'timeline'];
const THEMES = ['bleu', 'vert', 'violet', 'or', 'rouge', 'cyan'];

// ── Mémoire : tout ce qui a déjà été traité ──────────
function coveredTopics() {
  if (!fs.existsSync(HTML_DIR)) return [];
  return fs.readdirSync(HTML_DIR)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace(/\.html$/, '').replace(/^[0-9]+-/, ''))
    .sort();
}

// ── Planning : Claude propose N angles inédits ───────
async function planAngles(articles, covered, recentCache, count) {
  const actu = articles.slice(0, 35)
    .map(a => `- ${a.title}${a.description ? ' — ' + a.description.slice(0, 120) : ''} [${a.source}]`)
    .join('\n') || '(aucune actu récente récupérée — appuie-toi sur des données structurelles solides)';

  const coveredList = covered.join(', ');
  const recentSlugs = Object.keys(recentCache).join(', ') || '(aucun)';

  const prompt = `Tu es le rédacteur en chef de "Où Va l'Argent" (ouvalargent.com), média de pédagogie économique français.
Ton job : proposer ${count} idées d'infographies INÉDITES pour le brief de ce matin.

DOMAINES À COUVRIR (varie d'un jour à l'autre) :
finances publiques (dette, déficit, impôts, dépenses), macro-économie (inflation, PIB, chômage, croissance),
investissement (bourse, immobilier, crypto, or), actualité éco (entreprises, secteurs), comparaisons internationales, finance personnelle.

ACTUALITÉ DES DERNIÈRES 24-48H (sources institutionnelles + presse éco) :
${actu}

SUJETS DÉJÀ TRAITÉS (NE PAS reproduire ni un angle trop proche) :
${coveredList}

ANGLES ENVOYÉS LES JOURS PRÉCÉDENTS (à éviter aussi) :
${recentSlugs}

RÈGLES ÉDITORIALES :
- 3 angles VARIÉS (pas 3 fois le même domaine, pas 2 fois le même viz_type).
- Chaque angle doit reposer sur un CHIFFRE marquant, RÉEL et SOURÇABLE. N'invente jamais de données.
  Si tu n'es pas sûr d'un chiffre précis et récent, choisis un angle structurel dont tu connais les ordres de grandeur fiables, et indique la source officielle (INSEE, Eurostat, Banque de France, Cour des comptes, OCDE, FMI, DREES, DGFiP...).
- Le titre doit ÉNONCER le fait marquant (pas juste nommer le sujet).
- Préfère un angle lié à l'actualité ci-dessus quand un chiffre fiable existe.

Pour CHAQUE idée, renvoie un objet JSON avec EXACTEMENT ces champs :
{
  "slug": "kebab-case-court-descriptif",
  "title_html": "Titre avec <span class='accent'>mot clé coloré</span> (utilise <br> pour 2 lignes)",
  "viz_type": "un de : ${VIZ_TYPES.join(', ')}",
  "theme": "un de : ${THEMES.join(', ')}",
  "tag": "Finances publiques | Macro | Investissement | Actualité éco | International | Finance perso",
  "tag_color": "#ff4757",
  "data": { /* selon viz_type — voir ci-dessous */ },
  "source_text": "Source officielle · année (ex: 'INSEE · 2025')",
  "linkedin": "Post LinkedIn prêt à publier, 120-180 mots, ton expert mais accessible, hook fort en 1re ligne, 1-2 chiffres, une question finale, 4-5 hashtags.",
  "confidence": "high | medium — ta confiance dans l'exactitude du/des chiffre(s)"
}

FORMAT DE "data" SELON viz_type :
- mega_number   : { "stat_key": "5,5 %", "stat_unit": "du PIB", "stat_sub": "contexte court" }
- comparison    : { "items": [ {"label":"Allemagne","value":"136 €","width":100}, ... ] }  (width = % de la barre)
- bar_chart / ranking : { "list_items": [ {"label":"...","value":"...","width":100}, ... ] }
- line_chart / timeline : { "points": [ {"label":"2017","value":"6,9","width":64}, ... ] }
- percentage_bar: { "stat_key": "42 %", "stat_unit": "ce que ça représente" }
- dual_stat     : { "items": [ {"label":"...","value":"...","width":100}, {"label":"...","value":"...","width":40} ] }

RENVOIE UNIQUEMENT un tableau JSON de ${count} objets, rien d'autre (pas de \`\`\`, pas de commentaire).`;

  let raw = await askClaude(prompt, 'claude-sonnet-4-20250514', 6000);
  raw = raw.replace(/^```json\s*/i, '').replace(/```$/g, '').trim();
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('Planning : JSON introuvable dans la réponse Claude');
  const ideas = JSON.parse(raw.slice(start, end + 1));

  // Normalise + garde-fous
  return ideas.slice(0, count).map(idea => {
    idea.slug = slugify(idea.slug || idea.title_html.replace(/<[^>]*>/g, ''));
    if (!VIZ_TYPES.includes(idea.viz_type)) idea.viz_type = 'mega_number';
    if (!THEMES.includes(idea.theme)) idea.theme = 'bleu';
    idea.tag_color = idea.tag_color || '#00d4ff';
    idea.status = 'planned';
    return idea;
  });
}

// ── Fact-check de cohérence ──────────────────────────
async function factCheckIdea(idea) {
  try {
    const article = {
      titre: idea.title_html.replace(/<[^>]*>/g, ''),
      contenu: `Données affichées : ${JSON.stringify(idea.data)}\nTexte : ${idea.linkedin || ''}`,
      sources: idea.source_text
    };
    const res = await factCheck(article, idea.source_text);
    return res && res.verdict ? res.verdict : 'UNKNOWN';
  } catch {
    return 'UNKNOWN';
  }
}

// ── Construction du corps HTML du mail ───────────────
function buildEmailHTML(items, dateStr) {
  const blocks = items.map((it, i) => {
    const title = it.idea.title_html.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '');
    const flag = it.factVerdict === 'NEEDS_REVIEW' || it.idea.confidence === 'medium'
      ? `<div style="color:#b25b00;font-size:13px;margin:6px 0;">⚠ Chiffre à recouper avant publication.</div>` : '';
    const linkedin = (it.idea.linkedin || '').replace(/\n/g, '<br>');
    return `
      <div style="margin:0 0 34px 0;padding:0 0 28px 0;border-bottom:1px solid #e6e6e6;">
        <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Infographie ${i + 1} · ${it.idea.tag || ''}</div>
        <h2 style="font-size:20px;margin:6px 0 4px;color:#10243e;">${title}</h2>
        <div style="font-size:13px;color:#888;margin-bottom:10px;">Source : ${it.idea.source_text || ''}</div>
        ${flag}
        ${it.pngCid ? `<img src="cid:${it.pngCid}" alt="infographie ${i + 1}" style="width:100%;max-width:520px;border-radius:10px;border:1px solid #e6e6e6;"/>` : '<div style="color:#c0263a;font-size:13px;">(rendu PNG indisponible)</div>'}
        <div style="margin-top:16px;">
          <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:6px;">Texte LinkedIn</div>
          <div style="font-size:14px;line-height:1.55;color:#222;background:#f7f9fc;border-radius:8px;padding:14px 16px;">${linkedin}</div>
        </div>
      </div>`;
  }).join('');

  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
    <div style="font-size:13px;color:#00a0c0;letter-spacing:1px;text-transform:uppercase;">Où Va l'Argent — Brief matinal</div>
    <h1 style="font-size:24px;margin:6px 0 2px;color:#10243e;">${items.length} infographies pour aujourd'hui</h1>
    <div style="font-size:14px;color:#888;margin-bottom:24px;">${dateStr}</div>
    ${blocks}
    <div style="font-size:12px;color:#aaa;margin-top:8px;">Généré automatiquement. Les PNG sont aussi rangés dans Infographies/Insta &amp; Autres/. Vérifie les chiffres avant publication.</div>
  </div>`;
}

// ── Main ─────────────────────────────────────────────
async function main() {
  console.log(`\n📨 BRIEF MATINAL — ${new Date().toLocaleString('fr-FR')}\n${DRY ? '   (dry-run : pas d\'envoi mail)\n' : ''}`);

  if (RESET && fs.existsSync(CACHE_PATH)) { fs.unlinkSync(CACHE_PATH); console.log('  ♻️ Cache anti-doublon réinitialisé'); }
  const cache = loadCache(CACHE_PATH, 24 * 30); // mémoire 30 jours des angles envoyés

  // 1. Scan sources
  let articles = [];
  try {
    const scrape = await deepScrape();
    articles = scrape.articles || [];
  } catch (e) {
    console.warn('  ⚠ Scan partiel :', e.message);
  }

  // 2. Mémoire des sujets traités
  const covered = coveredTopics();
  console.log(`  🧠 Mémoire : ${covered.length} infographies déjà produites`);

  // 3. Planning des angles inédits
  console.log(`  🧭 Planning de ${COUNT} angles inédits...`);
  const ideas = await planAngles(articles, covered, cache, COUNT);
  ideas.forEach((it, i) => console.log(`     [${i + 1}] ${it.viz_type.padEnd(14)} ${it.title_html.replace(/<[^>]*>/g, '')}`));

  // 4. Fact-check
  const verdicts = {};
  for (const idea of ideas) {
    verdicts[idea.slug] = await factCheckIdea(idea);
  }

  if (NO_RENDER) {
    console.log('\n  --no-render : planning terminé, pas de génération.');
    console.log(JSON.stringify(ideas, null, 2));
    return;
  }

  // 5. Génération HTML + PNG via le producteur existant
  fs.writeFileSync(PLAN_PATH, JSON.stringify({ ideas }, null, 2));
  const prod = await produceWeeklyContent(PLAN_PATH);

  // 6. Association PNG ↔ idée + pièces jointes
  const items = [];
  const attachments = [];
  for (let i = 0; i < prod.results.length; i++) {
    const r = prod.results[i];
    if (r.status !== 'ok') { console.warn(`  ⚠ Échec génération : ${r.baseName}`); continue; }
    const png = (r.exported || []).find(p => p.endsWith('-instagram.png'))
      || path.join(INSTA_DIR, `${r.baseName}-instagram.png`);
    const cid = `infographie${i + 1}@ouvalargent`;
    if (fs.existsSync(png)) attachments.push({ filename: `${r.baseName}.png`, path: png, cid });
    items.push({ idea: r.idea, pngCid: fs.existsSync(png) ? cid : null, factVerdict: verdicts[r.idea.slug] });
  }

  if (items.length === 0) { console.error('  ❌ Aucune infographie produite, pas de mail.'); process.exit(1); }

  // 7. Mail
  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const html = buildEmailHTML(items, dateStr);
  const subject = `☕ Brief Où Va l'Argent — ${items.length} infographies (${new Date().toLocaleDateString('fr-FR')})`;

  if (DRY) {
    const preview = path.join(__dirname, '.daily-brief-preview.html');
    fs.writeFileSync(preview, html);
    console.log(`\n  🟡 Dry-run : mail NON envoyé. Aperçu → ${preview}`);
  } else {
    const info = await sendBriefEmail({ to: MAIL_TO, subject, html, attachments });
    console.log(`\n  ✅ Mail envoyé à ${MAIL_TO} (${info.messageId})`);
  }

  // 8. Mémoire anti-doublon
  for (const it of items) cache[it.idea.slug] = Date.now();
  saveCache(CACHE_PATH, cache);

  console.log(`\n  📦 Terminé : ${items.length} infographies.\n`);
}

main().catch(e => { console.error('\n❌ Brief échoué :', e.message); process.exit(1); });

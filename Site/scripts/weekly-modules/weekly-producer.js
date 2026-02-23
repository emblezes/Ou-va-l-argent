/**
 * Phase 3 : Weekly Producer — Génération HTML + Export PNG
 *
 * Pour chaque idée validée :
 * 1. Génère le HTML via Claude Sonnet (avec template de référence)
 * 2. Sauvegarde dans Sources HTML/
 * 3. Exporte en 3 formats (Instagram, TikTok V, TikTok H) via Puppeteer
 * 4. Met à jour le tableau INFOGRAPHICS dans batch-export-all.js
 */

const fs = require('fs');
const path = require('path');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent ';
const SCRIPTS_DIR = path.join(__dirname, '..');
const RS_BASE = path.join(BASE, 'Production interne/Réseaux Sociaux ');
const HTML_DIR = path.join(RS_BASE, 'Infographies/Sources HTML');
const INSTA_DIR = path.join(RS_BASE, 'Infographies/Insta & Autres');
const TIKTOK_V_DIR = path.join(RS_BASE, 'Infographies/Tiktok Vertical');
const TIKTOK_H_DIR = path.join(RS_BASE, 'Infographies/Tiktok Horizontal');

const CONFIG_PATH = path.join(SCRIPTS_DIR, 'telegram-config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const { ANTHROPIC_API_KEY } = config;

const { THEMES, getThemeCSS } = require(path.join(SCRIPTS_DIR, 'infographic-themes'));

// ── Reference HTML for Claude prompts ────────────────

const REFERENCE_HTML_PATH = path.join(HTML_DIR, '65-travail-noir-1-6md.html');

function getReferenceHTML() {
  return fs.readFileSync(REFERENCE_HTML_PATH, 'utf-8');
}

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

// ── Numérotation ─────────────────────────────────────

function getNextInfographicNumber() {
  const existingFiles = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));
  let maxNum = 0;
  existingFiles.forEach(f => {
    const match = f.match(/^(\d+)-/);
    if (match) maxNum = Math.max(maxNum, parseInt(match[1]));
  });
  return maxNum + 1;
}

// ── Extract CSS from batch-export-all.js ─────────────

function extractCSSFromBatchExport() {
  const batchPath = path.join(SCRIPTS_DIR, 'batch-export-all.js');
  const content = fs.readFileSync(batchPath, 'utf-8');

  const tiktokMatch = content.match(/const TIKTOK_CSS = `([\s\S]*?)`;/);
  const rectMatch = content.match(/const RECTANGLE_CSS = `([\s\S]*?)`;/);

  return {
    TIKTOK_CSS: tiktokMatch ? tiktokMatch[1] : '',
    RECTANGLE_CSS: rectMatch ? rectMatch[1] : ''
  };
}

// ── HTML Generation via Claude ───────────────────────

function buildHTMLPrompt(idea, referenceHTML) {
  const theme = THEMES[idea.theme] || THEMES.bleu;
  const data = idea.data || {};

  let dataInstructions = '';
  switch (idea.viz_type) {
    case 'mega_number':
      dataInstructions = `
TYPE : Stat choc (mega_number)
- Un gros chiffre central en 11rem (JetBrains Mono, bold)
- stat_key: "${data.stat_key}" (le chiffre principal, très gros)
- stat_unit: "${data.stat_unit}" (en dessous, Instrument Serif italic, 3.5rem)
- stat_sub: "${data.stat_sub}" (contexte en petit, 1.4rem)
- Classe .mega-number pour le chiffre, .mega-unit pour l'unité, .mega-sub pour le contexte
- Le chiffre doit avoir un text-shadow glow de la couleur accent`;
      break;
    case 'comparison':
      dataInstructions = `
TYPE : Comparaison (comparison) — BARRES HORIZONTALES
- INTERDIT : format "VS" avec deux cartes côte à côte. Utilise TOUJOURS des barres horizontales.
- Données: ${JSON.stringify(data.items || data)}
- Liste de barres horizontales classées de la plus grande à la plus petite
- Chaque barre : label à gauche (pays/catégorie), valeur à droite dans la barre
- La première barre (la plus grande) fait 100% de largeur, les autres sont proportionnelles
- En bas, un encart avec l'écart entre la 1ère et la dernière valeur (ex: "+7,4 pts d'écart")
- Classe .bar-chart pour le conteneur, .bar-item pour chaque ligne`;
      break;
    case 'bar_chart':
    case 'ranking':
      dataInstructions = `
TYPE : Classement / Barres horizontales (${idea.viz_type})
- Liste de barres horizontales, chaque barre avec label à gauche et valeur à droite
- Données: ${JSON.stringify(data.list_items || data)}
- Classe .bar-chart pour le conteneur, .bar-item pour chaque ligne
- Barre de couleur accent derrière chaque item (width en %)
- La première barre est la plus large, les autres proportionnelles`;
      break;
    case 'donut':
      dataInstructions = `
TYPE : Donut / Camembert (donut)
- SVG donut au centre avec segments colorés
- Données: ${JSON.stringify(data.segments || data)}
- Légende en dessous ou à droite avec pastilles de couleur`;
      break;
    case 'line_chart':
      dataInstructions = `
TYPE : Évolution temporelle (line_chart) — BARRES HORIZONTALES
- INTERDIT : graphique avec courbe/points/SVG path. Utilise TOUJOURS des barres horizontales.
- Données: ${JSON.stringify(data)}
- Une barre par année/période, ordonnées chronologiquement de haut en bas
- Chaque barre : année à gauche (JetBrains Mono), valeur à droite dans la barre
- La barre la plus grande fait 100%, les autres sont proportionnelles
- La dernière barre (valeur la plus récente) a un glow/box-shadow pour l'accent
- En bas, un encart avec l'évolution (ex: "+49% en 4 ans")`;
      break;
    case 'percentage_bar':
      dataInstructions = `
TYPE : Barre de pourcentage (percentage_bar)
- Une grande barre horizontale remplie au pourcentage indiqué
- stat_key: "${data.stat_key}" (le pourcentage, très gros)
- stat_unit: "${data.stat_unit}" (ce que ça représente)
- Barre avec fond sombre et remplissage accent`;
      break;
    case 'dual_stat':
      dataInstructions = `
TYPE : Double statistique (dual_stat) — BARRES HORIZONTALES
- INTERDIT : format avec deux chiffres côte à côte séparés par un trait. Utilise TOUJOURS des barres.
- Données: ${JSON.stringify(data.items || data)}
- Deux barres horizontales empilées, chacune avec son label et sa valeur
- La plus grande barre fait 100%, l'autre est proportionnelle
- En bas, un encart avec l'écart ou l'évolution entre les deux valeurs`;
      break;
    case 'timeline':
      dataInstructions = `
TYPE : Timeline / Évolution (timeline)
- Barres verticales côte à côte, une par année/période
- Données: ${JSON.stringify(data)}
- Labels en bas (années), valeurs en haut des barres`;
      break;
    default:
      dataInstructions = `
TYPE : ${idea.viz_type}
Données: ${JSON.stringify(data)}`;
  }

  return `Tu es un développeur HTML/CSS expert qui crée des infographies pour "Où Va l'Argent" (ouvalargent.com).

Crée une infographie HTML COMPLÈTE et autonome (1080×1080px) pour le sujet suivant :

TITRE : ${idea.title_html.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '')}
TITRE HTML (avec accents colorés) : ${idea.title_html}
TAG : ${idea.tag}
SOURCE : ${idea.source_text}

${dataInstructions}

THÈME DE COULEUR : "${idea.theme}"
- Background: linear-gradient(145deg, ${theme.bgStart} 0%, ${theme.bgMid} 50%, ${theme.bgEnd} 100%)
- Accent: ${theme.accent}
- Grid: ${theme.gridColor}
- Glow: ${theme.glowColor}

VOICI un HTML de RÉFÉRENCE à suivre EXACTEMENT pour la structure, les classes CSS, les polices et le layout :

${referenceHTML}

RÈGLES STRICTES :
1. Le HTML doit être COMPLET (<!DOCTYPE html> → </html>)
2. Charger les 3 Google Fonts : Instrument Serif, Syne, JetBrains Mono
3. Dimensions : .infographic { width: 1080px; height: 1080px; }
4. Structure : .bg-base + .bg-grid + .bg-glow-1 + .bg-glow-2 + .content
5. .content contient : .header (logo €) + titre + contenu + .footer
6. Footer : source à gauche ("Sources : ..."), ouvalargent.com à droite
7. Le titre utilise la classe .chart-title (4rem, Instrument Serif)
8. Les .accent dans le titre sont colorés avec la couleur accent du thème
9. data-name="${idea.slug}" sur le div .infographic
10. Pas de librairie externe (pas de Chart.js, pas de D3)
11. SVG pour les graphiques si nécessaire
12. TOUT le CSS en inline dans <style> (pas de fichier externe)

RÈGLES DE DESIGN (TRÈS IMPORTANT) :
13. TOUJOURS indiquer l'UNITÉ clairement (ex: "en % du PIB", "en milliards d'euros", "en euros/mois"). Ajouter une ligne .chart-unit (Instrument Serif italic, 1.5rem, couleur secondaire) au-dessus des barres/graphiques.
14. JAMAIS de format "VS" avec deux cartes côte à côte et un cercle VS au milieu. C'est confus. Utiliser des BARRES HORIZONTALES à la place.
15. JAMAIS de graphique en points/courbe SVG. Utiliser des BARRES HORIZONTALES pour montrer une évolution temporelle (une barre par année).
16. JAMAIS de double stat avec un trait vertical au milieu. Utiliser des BARRES à la place.
17. Chaque chiffre doit être COMPRÉHENSIBLE seul : on doit comprendre immédiatement CE QUE le chiffre représente et son unité.
18. Pour les classements/comparaisons : barres horizontales avec label à gauche, valeur à droite dans la barre. Première barre = 100% de largeur, les autres proportionnelles.
19. TITRES DESCRIPTIFS : le titre doit DIRE quelque chose, pas juste nommer le sujet. Mauvais : "La France championne des dépenses sociales". Bon : "Un tiers du PIB français part en dépenses sociales". Mauvais : "Les PER dominent l'épargne retraite". Bon : "3 cotisations retraite sur 4 passent par un PER". Le titre doit contenir le fait marquant.
20. JAMAIS de tag/badge thématique en haut à droite (pas de div .tag avec "International", "Social", etc.). Le header ne contient QUE le logo € Où Va l'Argent, rien d'autre.
21. BARRES DE COULEURS DIFFÉRENTES : chaque barre d'un classement doit avoir une couleur distincte (cyan #00d4ff, orange #ff9f43, or #ffd700, vert #00ff88, violet #a855f7, rouge #ff4757). Ne JAMAIS mettre toutes les barres de la même couleur. Utiliser des linear-gradient(90deg, rgba(couleur,0.4) 0%, couleur 100%) pour chaque barre.

RETOURNE UNIQUEMENT le HTML complet, rien d'autre (pas de \`\`\`html, pas d'explication).`;
}

// ── HTML Validation ──────────────────────────────────

function validateHTML(html) {
  const errors = [];
  if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) errors.push('Missing DOCTYPE');
  if (!html.includes('.infographic')) errors.push('Missing .infographic class');
  if (!html.includes('.bg-base')) errors.push('Missing .bg-base');
  if (!html.includes('.content')) errors.push('Missing .content');
  if (!html.includes('.header')) errors.push('Missing .header');
  if (!html.includes('.footer')) errors.push('Missing .footer');
  if (!html.includes('Instrument Serif')) errors.push('Missing Instrument Serif font');
  if (!html.includes('ouvalargent.com')) errors.push('Missing ouvalargent.com');
  return errors;
}

// ── Puppeteer Export ─────────────────────────────────

async function exportInfographic(browser, htmlPath, baseName, cssOverrides) {
  const { TIKTOK_CSS, RECTANGLE_CSS } = cssOverrides;

  // JS transforms for TikTok (from batch-export-all.js)
  const tiktokVerticalJS = () => {
    document.querySelectorAll('.timeline-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 1.8) + 'px';
    });
    document.querySelectorAll('.waterfall-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 1.6) + 'px';
      const t = parseInt(bar.style.top);
      if (t) bar.style.top = Math.round(t * 1.6) + 'px';
    });
    document.querySelectorAll('.stacked-segment').forEach(seg => {
      const h = parseInt(seg.style.height);
      if (h) seg.style.height = Math.round(h * 1.6) + 'px';
    });
    document.querySelectorAll('.grouped-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 1.6) + 'px';
    });
  };

  const rectangleJS = () => {
    document.querySelectorAll('.timeline-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 0.55) + 'px';
    });
    document.querySelectorAll('.waterfall-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 0.5) + 'px';
      const t = parseInt(bar.style.top);
      if (t) bar.style.top = Math.round(t * 0.5) + 'px';
    });
    document.querySelectorAll('.stacked-segment').forEach(seg => {
      const h = parseInt(seg.style.height);
      if (h) seg.style.height = Math.round(h * 0.5) + 'px';
    });
    document.querySelectorAll('.grouped-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 0.5) + 'px';
    });
  };

  const formats = [
    { css: null, jsTransform: null, width: 1080, height: 1080, outputDir: INSTA_DIR, suffix: 'instagram', label: 'Instagram' },
    { css: TIKTOK_CSS, jsTransform: tiktokVerticalJS, width: 1080, height: 1920, outputDir: TIKTOK_V_DIR, suffix: 'tiktok-v', label: 'TikTok V' },
    { css: RECTANGLE_CSS, jsTransform: rectangleJS, width: 1080, height: 600, outputDir: TIKTOK_H_DIR, suffix: 'tiktok-h', label: 'TikTok H' }
  ];

  const exported = [];

  for (const format of formats) {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');

    if (format.css) await page.addStyleTag({ content: format.css });
    if (format.jsTransform) await page.evaluate(format.jsTransform);

    await page.setViewport({ width: format.width, height: format.height, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 400));

    const el = await page.$('.infographic');
    if (!el) {
      console.error(`    ⚠ .infographic not found for ${format.label}`);
      await page.close();
      continue;
    }

    const outputPath = path.join(format.outputDir, `${baseName}-${format.suffix}.png`);
    await el.screenshot({ path: outputPath, type: 'png' });
    exported.push(outputPath);

    await page.close();
  }

  return exported;
}

// ── Append to INFOGRAPHICS array ─────────────────────

function appendToInfographicsArray(newEntries) {
  const batchExportPath = path.join(SCRIPTS_DIR, 'batch-export-all.js');
  let content = fs.readFileSync(batchExportPath, 'utf-8');

  // Find the closing ]; of INFOGRAPHICS
  const marker = '];\n\nasync function exportFormat';
  const insertPoint = content.indexOf(marker);
  if (insertPoint === -1) {
    console.error('  ⚠ Impossible de trouver le point d\'insertion dans batch-export-all.js');
    return;
  }

  const newLines = newEntries.map(e =>
    `  ['${e.htmlFile}', 0, '${e.baseName}'],`
  ).join('\n');

  content = content.slice(0, insertPoint) + newLines + '\n' + content.slice(insertPoint);
  fs.writeFileSync(batchExportPath, content);
  console.log(`  ✓ ${newEntries.length} entrées ajoutées à INFOGRAPHICS`);
}

// ── Main Producer ────────────────────────────────────

async function produceWeeklyContent(planPath) {
  // Load plan
  const planData = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
  const ideas = planData.ideas.filter(i => i.status !== 'exported' && i.status !== 'skipped');

  console.log(`\n🏭 Weekly Producer — ${ideas.length} infographies à produire\n`);

  if (ideas.length === 0) {
    console.log('  Rien à produire.');
    return { produced: 0, failed: 0, exported: [] };
  }

  // Ensure output dirs exist
  [INSTA_DIR, TIKTOK_V_DIR, TIKTOK_H_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Load reference HTML and CSS
  const referenceHTML = getReferenceHTML();
  const cssOverrides = extractCSSFromBatchExport();

  // Get starting number
  const startNum = getNextInfographicNumber();
  console.log(`  📌 Numérotation : ${startNum} → ${startNum + ideas.length - 1}\n`);

  // Launch Puppeteer
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true });

  const results = [];
  const newInfographics = [];
  const startTime = Date.now();

  // Process in batches of 3 (concurrent HTML generation, sequential export)
  for (let i = 0; i < ideas.length; i++) {
    const idea = ideas[i];
    const num = startNum + i;
    const baseName = `${num}-${idea.slug}`;
    const htmlFileName = `${baseName}.html`;
    const htmlPath = path.join(HTML_DIR, htmlFileName);

    console.log(`  [${i + 1}/${ideas.length}] ${baseName}`);

    try {
      // Step 1: Generate HTML
      if (idea.status === 'html_generated' && fs.existsSync(htmlPath)) {
        console.log(`    ♻️ HTML existant, skip génération`);
      } else {
        const prompt = buildHTMLPrompt(idea, referenceHTML);
        let html = await askClaude(prompt, 'claude-sonnet-4-20250514', 8000);

        // Clean markdown fences if present
        html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();

        // Validate
        const errors = validateHTML(html);
        if (errors.length > 0) {
          console.log(`    ⚠ Validation: ${errors.join(', ')} — retry...`);
          html = await askClaude(
            prompt + `\n\nATTENTION : Le HTML précédent avait ces erreurs : ${errors.join(', ')}. Corrige-les.`,
            'claude-sonnet-4-20250514', 8000
          );
          html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();
          const errors2 = validateHTML(html);
          if (errors2.length > 0) {
            console.log(`    ❌ Validation retry échouée: ${errors2.join(', ')}`);
            idea.status = 'failed';
            results.push({ baseName, status: 'failed', error: errors2.join(', ') });
            continue;
          }
        }

        fs.writeFileSync(htmlPath, html);
        idea.status = 'html_generated';
        console.log(`    ✓ HTML généré`);
      }

      // Step 2: Export PNG (3 formats)
      const exported = await exportInfographic(browser, htmlPath, baseName, cssOverrides);
      idea.status = 'exported';
      console.log(`    ✓ ${exported.length} PNG exportés`);

      newInfographics.push({ htmlFile: htmlFileName, baseName });
      results.push({ baseName, status: 'ok', exported, idea });

      // Save progress after each infographic
      fs.writeFileSync(planPath, JSON.stringify(planData, null, 2));

    } catch (err) {
      console.error(`    ❌ ${err.message.split('\n')[0]}`);
      idea.status = 'failed';
      results.push({ baseName, status: 'failed', error: err.message });
      fs.writeFileSync(planPath, JSON.stringify(planData, null, 2));
    }

    // Rate limit Claude API
    if (i < ideas.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  await browser.close();

  // Append to INFOGRAPHICS array
  if (newInfographics.length > 0) {
    appendToInfographicsArray(newInfographics);
  }

  // Save final plan state
  fs.writeFileSync(planPath, JSON.stringify(planData, null, 2));

  const produced = results.filter(r => r.status === 'ok').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const duration = Math.round((Date.now() - startTime) / 1000 / 60);

  console.log(`\n  📦 Résultat : ${produced} OK / ${failed} échecs / ${duration} min`);

  return { produced, failed, duration, results, newInfographics };
}

module.exports = { produceWeeklyContent, getNextInfographicNumber };

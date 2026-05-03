#!/usr/bin/env node
/**
 * inspect-references.js
 *
 * Pour un type de visualisation donné (bar-chart, line-chart, hero,
 * ranking, dot-plot, grouped-bars), liste les infographies validées
 * récentes (>= 215) qui utilisent ce pattern et extrait leurs
 * paramètres CSS clés (font-size, bar width, padding, présence
 * subtitle/legend...).
 *
 * À utiliser SYSTÉMATIQUEMENT avant de créer une nouvelle infographie :
 * les valeurs choisies à la main divergent toujours du standard validé.
 *
 * Usage :
 *   node scripts/inspect-references.js <pattern>
 *   node scripts/inspect-references.js bar-chart
 *   node scripts/inspect-references.js grouped-bars
 *   node scripts/inspect-references.js line-chart
 *   node scripts/inspect-references.js hero
 *   node scripts/inspect-references.js ranking
 *   node scripts/inspect-references.js dot-plot
 *   node scripts/inspect-references.js all     ← liste tous patterns par fichier
 */

const fs = require('fs');
const path = require('path');

const SOURCES_DIR = path.resolve(
  __dirname,
  '../../Production interne/Réseaux Sociaux /Infographies/Sources HTML'
);

const MIN_ID = 165; // on ne regarde que les références validées >= 215

// Heuristiques de détection : pour chaque pattern, regex à matcher dans l'HTML
const PATTERNS = {
  // bar-chart : détecte HTML/CSS (.bar-fill, .bar-group) ET SVG (<rect>)
  'bar-chart':    { detect: /\bbar-fill\b|\bbar-group\b|<rect[^>]*\bx=/, hint: '.bar-fill ou rect SVG = barres verticales' },
  // grouped-bars : 2+ couleurs (cyan + rouge ou vert + rouge), 6+ barres
  'grouped-bars': { detect: /(gradBirth|gradDeath|legend-dot.*?(births|deaths))/, hint: '2 séries face à face (naissances vs décès, etc.)' },
  'line-chart':   { detect: /<polyline\b/, hint: 'polyline = courbe' },
  'hero':         { detect: /class="hero|hero-value/, hint: 'gros chiffre central' },
  'ranking':      { detect: /ranking-grid|ranking-col/, hint: 'colonnes de classement' },
  'dot-plot':     { detect: /dotplot|dotplot-row/, hint: 'ranking horizontal points' },
  'comparison':   { detect: /comparison-grid|comparison-item|bars-stack/, hint: '2 cards/barres face à face' },
};

// Champs CSS à extraire (regex avec 1 capture)
const CSS_FIELDS = [
  ['chart-title font-size',    /\.chart-title\s*\{[^}]*font-size:\s*([^;]+)/ ],
  ['chart-title letter-spacing',/\.chart-title\s*\{[^}]*letter-spacing:\s*([^;]+)/ ],
  ['subtitle présent ?',       /\.subtitle\s*\{/, 'present'],
  ['legend présent ?',         /\.legend\b\s*\{/, 'present'],
  ['content padding',          /\.content\s*\{[^}]*padding:\s*([^;]+)/ ],
  ['chart-area padding',       /\.chart-area\s*\{[^}]*padding:\s*([^;]+)/ ],
  ['bar-fill width',           /\.bar-fill[^{]*\{[^}]*width:\s*([^;]+)/ ],
  ['bar-value font-size',      /\.bar-value(?!\s*\.)[^{]*\{[^}]*font-size:\s*([^;]+)/ ],
  ['bar-value highlight font-size', /\.bar-value\.(?:end|highlight)[^{]*\{[^}]*font-size:\s*([^;]+)/ ],
  ['bar-label/year font-size', /\.bar-(?:year|label)[^{]*\{[^}]*font-size:\s*([^;]+)/ ],
  ['axis-label fill',          /\.axis-label[^{]*\{[^}]*fill:\s*([^;]+)/ ],
  ['tick fill',                /\.tick(?![\w-])[^{]*\{[^}]*fill:\s*([^;]+)/ ],
  ['hero-value font-size',     /\.hero-value[^{]*\{[^}]*font-size:\s*([^;]+)/ ],
];

function extractFields(html) {
  const out = {};
  for (const [label, rx, mode] of CSS_FIELDS) {
    const m = html.match(rx);
    if (mode === 'present') {
      out[label] = m ? 'oui' : 'non';
    } else if (m) {
      out[label] = m[1].trim();
    }
  }
  return out;
}

function fileId(name) {
  const m = name.match(/^(\d+)/);
  return m ? +m[1] : 0;
}

function listFiles() {
  if (!fs.existsSync(SOURCES_DIR)) {
    console.error(`Dossier introuvable : ${SOURCES_DIR}`);
    process.exit(2);
  }
  return fs.readdirSync(SOURCES_DIR)
    .filter(f => f.endsWith('.html') && fileId(f) >= MIN_ID)
    .sort((a, b) => fileId(b) - fileId(a)); // récent → ancien
}

function main() {
  const pattern = (process.argv[2] || '').toLowerCase();
  if (!pattern) {
    console.log('Usage : node scripts/inspect-references.js <pattern>');
    console.log('Patterns disponibles : ' + Object.keys(PATTERNS).join(', ') + ', all');
    process.exit(2);
  }

  if (pattern === 'all') {
    listAll();
    return;
  }

  if (!PATTERNS[pattern]) {
    console.error(`Pattern inconnu : "${pattern}"`);
    console.error('Patterns dispo : ' + Object.keys(PATTERNS).join(', '));
    process.exit(2);
  }

  const files = listFiles();
  const matches = [];
  for (const f of files) {
    const html = fs.readFileSync(path.join(SOURCES_DIR, f), 'utf8');
    const def = PATTERNS[pattern];
    if (def.detect.test(html) && (!def.exclude || !def.exclude.test(html))) {
      matches.push({ file: f, fields: extractFields(html) });
    }
    if (matches.length >= 5) break; // limit aux 5 plus récents
  }

  if (matches.length === 0) {
    console.log(`Aucune référence trouvée pour pattern "${pattern}".`);
    process.exit(0);
  }

  console.log(`\n=== Pattern "${pattern}" — ${matches.length} référence(s) ===`);
  console.log(`Indice : ${PATTERNS[pattern].hint}\n`);

  for (const m of matches) {
    console.log(`📄 ${m.file}`);
    for (const [label, value] of Object.entries(m.fields)) {
      console.log(`   ${label.padEnd(34)} ${value}`);
    }
    console.log('');
  }

  // Synthèse : valeurs les plus fréquentes
  console.log('--- Synthèse (valeur la + fréquente par champ) ---');
  const byField = {};
  for (const m of matches) {
    for (const [label, value] of Object.entries(m.fields)) {
      if (!byField[label]) byField[label] = {};
      byField[label][value] = (byField[label][value] || 0) + 1;
    }
  }
  for (const [label, counts] of Object.entries(byField)) {
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    console.log(`   ${label.padEnd(34)} ${top[0]}  (${top[1]}/${matches.length})`);
  }
  console.log('');
}

function listAll() {
  const files = listFiles().slice(0, 20);
  console.log(`\n=== Patterns détectés sur les ${files.length} infographies les plus récentes ===\n`);
  for (const f of files) {
    const html = fs.readFileSync(path.join(SOURCES_DIR, f), 'utf8');
    const found = [];
    for (const [name, def] of Object.entries(PATTERNS)) {
      if (def.detect.test(html) && (!def.exclude || !def.exclude.test(html))) {
        found.push(name);
      }
    }
    console.log(`${f.padEnd(60)} → ${found.join(', ') || '(aucun)'}`);
  }
  console.log('');
}

main();

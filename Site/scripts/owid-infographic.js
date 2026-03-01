#!/usr/bin/env node
/**
 * OWID Infographic Generator
 *
 * Génère des infographies OVLA à partir des données Our World in Data.
 *
 * Usage :
 *   node scripts/owid-infographic.js \
 *     --url="https://ourworldindata.org/grapher/government-debt" \
 *     --countries="FRA,USA,DEU,GBR,JPN" \
 *     --year=2023 \
 *     --name="200-dette-publique-monde" \
 *     --title="Dette publique dans le monde"
 *
 *   node scripts/owid-infographic.js \
 *     --url="https://ourworldindata.org/grapher/life-expectancy" \
 *     --countries="FRA,USA,JPN,NGA" \
 *     --name="201-esperance-vie" \
 *     --notion
 *
 * Options :
 *   --url          URL du graphique OWID (obligatoire)
 *   --countries    Codes ISO séparés par virgule (défaut: FRA,USA,DEU,GBR,JPN,CHN)
 *   --year         Année spécifique (défaut: dernière disponible)
 *   --name         Nom du fichier (ex: 200-dette-publique) (obligatoire)
 *   --title        Titre custom (sinon Claude génère)
 *   --color        Couleur accent: cyan, red, gold, green, orange, violet (défaut: cyan)
 *   --evolution    Mode évolution temporelle : 3-5 dates clés par pays (barres groupées)
 *   --years        Années spécifiques pour --evolution (ex: "2000,2010,2025")
 *   --notion       Uploader dans Notion après export
 *   --dry-run      Générer le HTML sans exporter les PNG
 *
 * Mode évolution :
 *   node scripts/owid-infographic.js \
 *     --url="https://ourworldindata.org/grapher/nuclear-energy-generation" \
 *     --countries="FRA,DEU" \
 *     --evolution \
 *     --years="2000,2010,2025" \
 *     --name="test-nucleaire" \
 *     --title="Production nucléaire : France vs Allemagne"
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { askClaude } = require('./journalist-modules/shared-utils');

// ===== PATHS =====
const BASE = path.join(__dirname, '..', '..', 'Production interne', 'Réseaux Sociaux ');
const HTML_DIR = path.join(BASE, 'Infographies', 'Sources HTML');
const INSTA_DIR = path.join(BASE, 'Infographies', 'Insta & Autres');
const TIKTOK_V_DIR = path.join(BASE, 'Infographies', 'Tiktok Vertical');
const TIKTOK_H_DIR = path.join(BASE, 'Infographies', 'Tiktok Horizontal');

// ===== COLORS =====
const ACCENT_COLORS = {
  cyan:   { accent: '#00d4ff', bg_deep: '#06080c', bg_mid: '#0a1628', grid: 'rgba(0, 212, 255, 0.03)', glow: 'rgba(0, 212, 255, 0.08)', text_sec: '#8899a8', text_muted: '#4a5a6a' },
  red:    { accent: '#ff4757', bg_deep: '#0c0608', bg_mid: '#1e0a14', grid: 'rgba(255, 71, 87, 0.03)', glow: 'rgba(255, 71, 87, 0.08)', text_sec: '#a88899', text_muted: '#6a4a5a' },
  gold:   { accent: '#ffd700', bg_deep: '#0c0a06', bg_mid: '#1e1a0a', grid: 'rgba(255, 215, 0, 0.03)', glow: 'rgba(255, 215, 0, 0.08)', text_sec: '#a8a088', text_muted: '#6a5a4a' },
  green:  { accent: '#00ff88', bg_deep: '#060c08', bg_mid: '#0a1e14', grid: 'rgba(0, 255, 136, 0.03)', glow: 'rgba(0, 255, 136, 0.08)', text_sec: '#88a898', text_muted: '#4a6a5a' },
  orange: { accent: '#ff9f43', bg_deep: '#0c0906', bg_mid: '#1e150a', grid: 'rgba(255, 159, 67, 0.03)', glow: 'rgba(255, 159, 67, 0.08)', text_sec: '#a89888', text_muted: '#6a5a4a' },
  violet: { accent: '#a855f7', bg_deep: '#08060c', bg_mid: '#140a1e', grid: 'rgba(168, 85, 247, 0.03)', glow: 'rgba(168, 85, 247, 0.08)', text_sec: '#9888a8', text_muted: '#5a4a6a' },
};

// Country flag emojis
const FLAGS = {
  FRA: '🇫🇷', USA: '🇺🇸', DEU: '🇩🇪', GBR: '🇬🇧', JPN: '🇯🇵', CHN: '🇨🇳',
  ITA: '🇮🇹', ESP: '🇪🇸', CAN: '🇨🇦', AUS: '🇦🇺', BRA: '🇧🇷', IND: '🇮🇳',
  RUS: '🇷🇺', KOR: '🇰🇷', MEX: '🇲🇽', IDN: '🇮🇩', TUR: '🇹🇷', NLD: '🇳🇱',
  CHE: '🇨🇭', SWE: '🇸🇪', NOR: '🇳🇴', DNK: '🇩🇰', FIN: '🇫🇮', BEL: '🇧🇪',
  AUT: '🇦🇹', PRT: '🇵🇹', GRC: '🇬🇷', POL: '🇵🇱', CZE: '🇨🇿', HUN: '🇭🇺',
  IRL: '🇮🇪', NZL: '🇳🇿', SGP: '🇸🇬', HKG: '🇭🇰', TWN: '🇹🇼', THA: '🇹🇭',
  ZAF: '🇿🇦', NGA: '🇳🇬', EGY: '🇪🇬', SAU: '🇸🇦', ARE: '🇦🇪', ISR: '🇮🇱',
  ARG: '🇦🇷', COL: '🇨🇴', CHL: '🇨🇱', PER: '🇵🇪', URY: '🇺🇾', VEN: '🇻🇪',
  UKR: '🇺🇦', ROU: '🇷🇴', PHL: '🇵🇭', VNM: '🇻🇳', MYS: '🇲🇾', PAK: '🇵🇰',
  BGD: '🇧🇩', ETH: '🇪🇹', KEN: '🇰🇪', GHA: '🇬🇭', MAR: '🇲🇦', DZA: '🇩🇿',
  LUX: '🇱🇺', ISL: '🇮🇸', SVN: '🇸🇮', SVK: '🇸🇰', LTU: '🇱🇹', LVA: '🇱🇻',
  EST: '🇪🇪', HRV: '🇭🇷', BGR: '🇧🇬', SRB: '🇷🇸', OWID_WRL: '🌍',
};

// Country names in French
const COUNTRY_NAMES_FR = {
  'France': 'France', 'United States': 'États-Unis', 'Germany': 'Allemagne',
  'United Kingdom': 'Roy.-Uni', 'Japan': 'Japon', 'China': 'Chine',
  'Italy': 'Italie', 'Spain': 'Espagne', 'Canada': 'Canada',
  'Australia': 'Australie', 'Brazil': 'Brésil', 'India': 'Inde',
  'Russia': 'Russie', 'South Korea': 'Corée du Sud', 'Mexico': 'Mexique',
  'Indonesia': 'Indonésie', 'Turkey': 'Turquie', 'Netherlands': 'Pays-Bas',
  'Switzerland': 'Suisse', 'Sweden': 'Suède', 'Norway': 'Norvège',
  'Denmark': 'Danemark', 'Finland': 'Finlande', 'Belgium': 'Belgique',
  'Austria': 'Autriche', 'Portugal': 'Portugal', 'Greece': 'Grèce',
  'Poland': 'Pologne', 'Czechia': 'Tchéquie', 'Hungary': 'Hongrie',
  'Ireland': 'Irlande', 'New Zealand': 'N.-Zélande', 'Singapore': 'Singapour',
  'Taiwan': 'Taïwan', 'Thailand': 'Thaïlande', 'South Africa': 'Afrique du Sud',
  'Nigeria': 'Nigéria', 'Egypt': 'Égypte', 'Saudi Arabia': 'Arabie Saoudite',
  'United Arab Emirates': 'Émirats', 'Israel': 'Israël',
  'Argentina': 'Argentine', 'Colombia': 'Colombie', 'Chile': 'Chili',
  'Peru': 'Pérou', 'Uruguay': 'Uruguay', 'Venezuela': 'Venezuela',
  'World': 'Monde', 'European Union (27)': 'UE-27',
};

// ISO3 to OWID entity name mapping
const ISO_TO_OWID = {
  FRA: 'France', USA: 'United States', DEU: 'Germany', GBR: 'United Kingdom',
  JPN: 'Japan', CHN: 'China', ITA: 'Italy', ESP: 'Spain', CAN: 'Canada',
  AUS: 'Australia', BRA: 'Brazil', IND: 'India', RUS: 'Russia',
  KOR: 'South Korea', MEX: 'Mexico', IDN: 'Indonesia', TUR: 'Turkey',
  NLD: 'Netherlands', CHE: 'Switzerland', SWE: 'Sweden', NOR: 'Norway',
  DNK: 'Denmark', FIN: 'Finland', BEL: 'Belgium', AUT: 'Austria',
  PRT: 'Portugal', GRC: 'Greece', POL: 'Poland', CZE: 'Czechia',
  HUN: 'Hungary', IRL: 'Ireland', NZL: 'New Zealand', SGP: 'Singapore',
  TWN: 'Taiwan', THA: 'Thailand', ZAF: 'South Africa', NGA: 'Nigeria',
  EGY: 'Egypt', SAU: 'Saudi Arabia', ARE: 'United Arab Emirates', ISR: 'Israel',
  ARG: 'Argentina', COL: 'Colombia', CHL: 'Chile', PER: 'Peru', URY: 'Uruguay',
  OWID_WRL: 'World',
};

// ===== PARSE CLI ARGS =====
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    const match = arg.match(/^--(\w[\w-]*)(?:=(.*))?$/);
    if (match) args[match[1]] = match[2] ?? true;
  });
  return args;
}

// ===== FETCH OWID DATA =====
async function fetchOWIDData(slug, countryCodes, year) {
  console.log(`\n📊 Téléchargement des données OWID : ${slug}`);

  // Fetch metadata
  const metaUrl = `https://ourworldindata.org/grapher/${slug}.metadata.json`;
  console.log(`  → Metadata : ${metaUrl}`);
  const metaRes = await fetch(metaUrl);
  if (!metaRes.ok) throw new Error(`Metadata HTTP ${metaRes.status} pour ${slug}`);
  const metadata = await metaRes.json();

  // Fetch CSV
  const owidNames = countryCodes.map(c => ISO_TO_OWID[c] || c);
  const csvUrl = `https://ourworldindata.org/grapher/${slug}.csv`;
  console.log(`  → CSV : ${csvUrl}`);
  const csvRes = await fetch(csvUrl);
  if (!csvRes.ok) throw new Error(`CSV HTTP ${csvRes.status} pour ${slug}`);
  const csvText = await csvRes.text();

  // Parse CSV
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  // Find the value column (last column that isn't Entity/Code/Year/Day)
  const skipCols = new Set(['entity', 'code', 'year', 'day']);
  const valueColIndex = headers.findIndex((h, i) => i >= 2 && !skipCols.has(h.toLowerCase()));
  const valueColName = headers[valueColIndex] || headers[headers.length - 1];
  const actualValueIndex = valueColIndex >= 0 ? valueColIndex : headers.length - 1;

  console.log(`  → Variable : "${valueColName}"`);

  // Parse rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Handle CSV with possible quoted fields
    const parts = parseCSVLine(lines[i]);
    if (parts.length < 3) continue;

    const entity = parts[0];
    const yr = parseInt(parts[1]) || parseInt(parts[2]); // Year or Day column
    const val = parseFloat(parts[actualValueIndex]);

    if (isNaN(val)) continue;
    if (!owidNames.includes(entity)) continue;

    rows.push({ entity, year: yr, value: val });
  }

  // Filter by year
  let filtered;
  if (year) {
    filtered = rows.filter(r => r.year === parseInt(year));
  } else {
    // Get latest year per country
    const latestByCountry = {};
    for (const r of rows) {
      if (!latestByCountry[r.entity] || r.year > latestByCountry[r.entity].year) {
        latestByCountry[r.entity] = r;
      }
    }
    filtered = Object.values(latestByCountry);
  }

  // Sort by value descending
  filtered.sort((a, b) => b.value - a.value);

  console.log(`  → ${filtered.length} pays trouvés`);
  filtered.forEach(r => {
    const fr = COUNTRY_NAMES_FR[r.entity] || r.entity;
    console.log(`    ${fr} (${r.year}): ${r.value}`);
  });

  return {
    data: filtered,
    variable: valueColName,
    title: metadata.chart?.title || slug.replace(/-/g, ' '),
    subtitle: metadata.chart?.subtitle || '',
    source: extractSource(metadata),
    slug,
  };
}

function parseCSVLine(line) {
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { parts.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  parts.push(current.trim());
  return parts;
}

function extractSource(metadata) {
  // Try to find source name from metadata
  if (metadata.chart?.sourceDesc) return metadata.chart.sourceDesc;
  const vars = Object.values(metadata.variables || {});
  if (vars.length > 0) {
    const v = vars[0];
    if (v.presentation?.attributionShort) return v.presentation.attributionShort;
    if (v.origins?.[0]?.producer) return v.origins[0].producer;
  }
  // Try columns (newer metadata format)
  const cols = Object.values(metadata.columns || {});
  if (cols.length > 0 && cols[0].origins?.[0]?.producer) {
    return cols[0].origins[0].producer;
  }
  return 'Our World in Data';
}

function extractUnit(metadata) {
  // Try columns (newer metadata format)
  const cols = Object.values(metadata.columns || {});
  if (cols.length > 0 && cols[0].shortUnit) return cols[0].shortUnit;
  if (cols.length > 0 && cols[0].unit) return cols[0].unit;
  // Try variables (older format)
  const vars = Object.values(metadata.variables || {});
  if (vars.length > 0 && vars[0].shortUnit) return vars[0].shortUnit;
  if (vars.length > 0 && vars[0].unit) return vars[0].unit;
  return '';
}

// ===== GENERATE TITLE VIA CLAUDE =====
async function generateTitle(owidData, userTitle) {
  if (userTitle) return userTitle;

  const prompt = `Tu es le média économique "Où Va l'Argent ?". Génère un titre court et percutant (max 8 mots) pour une infographie en barres verticales montrant ces données :

Variable : ${owidData.variable}
Données : ${owidData.data.map(d => `${COUNTRY_NAMES_FR[d.entity] || d.entity}: ${formatValue(d.value, owidData.variable)}`).join(', ')}

Le titre doit :
- Être en français
- Mettre en avant un fait frappant ou une comparaison
- Être adapté à Instagram (accrocheur)
- NE PAS inclure de balises HTML

Réponds UNIQUEMENT avec le titre, rien d'autre.`;

  const title = await askClaude(prompt, 'claude-haiku-4-5-20251001', 200);
  return title.trim().replace(/^["']|["']$/g, '');
}

// ===== FORMAT VALUE =====
function formatValue(value, variable) {
  const varLower = (variable || '').toLowerCase();

  if (varLower.includes('%') || varLower.includes('share') || varLower.includes('percent')) {
    return `${value.toFixed(1)}%`;
  }
  if (varLower.includes('usd') || varLower.includes('dollar') || varLower.includes('gdp per capita')) {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T$`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(0)}Md$`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M$`;
    if (value >= 1000) return `${Math.round(value).toLocaleString('fr-FR')}$`;
    return `${value.toFixed(0)}$`;
  }
  if (varLower.includes('year') || varLower.includes('expectancy') || varLower.includes('age')) {
    return `${value.toFixed(1)} ans`;
  }
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)} Md`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)} M`;
  if (value >= 1000) return Math.round(value).toLocaleString('fr-FR');
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(1);
}

// ===== DETECT UNIT =====
function detectUnit(variable) {
  const v = (variable || '').toLowerCase();
  if (v.includes('%') || v.includes('share') || v.includes('percent')) return '%';
  if (v.includes('usd') || v.includes('dollar')) return '$';
  if (v.includes('euro') || v.includes('eur')) return '€';
  if (v.includes('year') || v.includes('expectancy')) return 'ans';
  return '';
}

// ===== GENERATE HTML =====
function generateHTML(owidData, title, colorScheme) {
  const c = ACCENT_COLORS[colorScheme] || ACCENT_COLORS.cyan;
  const data = owidData.data;
  const maxVal = Math.max(...data.map(d => d.value));
  const yearStr = data.length > 0 ? data[0].year : '';
  const unit = detectUnit(owidData.variable);

  // Find France index for highlight
  const franceIndex = data.findIndex(d => d.entity === 'France');

  // Generate bar colors — gradient from accent to muted
  const barColors = data.map((d, i) => {
    if (d.entity === 'France') return { color: c.accent, bg: `linear-gradient(180deg, ${c.accent}, ${c.accent}99)`, shadow: `0 -4px 25px ${c.accent}40` };
    // Others get progressively more muted
    const opacity = 0.85 - (i * 0.06);
    return { color: `${c.text_sec}`, bg: `linear-gradient(180deg, ${c.text_sec}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, ${c.text_sec}66)`, shadow: 'none' };
  });
  // France gets the accent, highest bar also gets a stronger color
  if (franceIndex < 0 && barColors.length > 0) {
    barColors[0].color = c.accent;
    barColors[0].bg = `linear-gradient(180deg, ${c.accent}, ${c.accent}99)`;
    barColors[0].shadow = `0 -4px 25px ${c.accent}40`;
  }

  const barsHTML = data.map((d, i) => {
    const fr = COUNTRY_NAMES_FR[d.entity] || d.entity;
    const code = Object.entries(ISO_TO_OWID).find(([k, v]) => v === d.entity)?.[0] || '';
    const flag = FLAGS[code] || '🏳️';
    const pct = Math.max(8, (d.value / maxVal) * 85); // min 8% height
    const formattedVal = formatValue(d.value, owidData.variable);
    const isFrance = d.entity === 'France';
    const bc = barColors[i];

    return `
                    <div class="bar-col">
                        <div class="bar-value" style="color: ${bc.color};">${formattedVal}</div>
                        <div class="bar-up" style="height: ${pct.toFixed(1)}%; background: ${bc.bg}; box-shadow: ${bc.shadow};">
                            <div class="bar-flag">${flag}</div>
                        </div>
                        <div class="bar-name${isFrance ? ' highlight' : ''}">${fr}</div>
                    </div>`;
  }).join('\n');

  // Split title for accent word
  const accentTitle = title.replace(/(\d[\d\s,.%$€]*\S*)/g, '<span class="accent">$1</span>');

  const subtitleText = owidData.subtitle
    ? owidData.subtitle.replace(/<[^>]+>/g, '').substring(0, 80)
    : `${owidData.variable} (${yearStr})`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-deep: ${c.bg_deep};
            --text-primary: #f0f4f8;
            --text-secondary: ${c.text_sec};
            --text-muted: ${c.text_muted};
            --glass-border: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Syne', sans-serif;
            background: #1a1a2e;
            padding: 2rem;
            display: flex;
            justify-content: center;
        }

        .infographic {
            width: 1080px;
            height: 1080px;
            position: relative;
            overflow: hidden;
        }

        .bg-base {
            position: absolute;
            inset: 0;
            background: linear-gradient(145deg, ${c.bg_deep} 0%, ${c.bg_mid} 50%, ${c.bg_deep} 100%);
        }

        .bg-grid {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(${c.grid} 1px, transparent 1px),
                linear-gradient(90deg, ${c.grid} 1px, transparent 1px);
            background-size: 40px 40px;
        }

        .bg-glow-1 {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, ${c.glow} 0%, transparent 70%);
            top: -200px;
            right: -100px;
            pointer-events: none;
        }

        .content {
            position: relative;
            z-index: 1;
            height: 100%;
            padding: 50px 40px 40px;
            display: flex;
            flex-direction: column;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 6px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon { font-family: 'Instrument Serif', serif; font-size: 4rem; color: ${c.accent}; line-height: 1; }
        .logo-text { font-family: 'Instrument Serif', serif; font-size: 1.8rem; font-style: italic; color: #ffffff; line-height: 1; }

        .chart-title {
            font-family: 'Instrument Serif', serif;
            font-size: ${title.length > 40 ? '3.8rem' : title.length > 25 ? '4.2rem' : '5rem'};
            text-align: center;
            margin-bottom: 2px;
            color: var(--text-primary);
            line-height: 1.05;
        }

        .chart-title .accent {
            color: ${c.accent};
            font-style: italic;
        }

        .chart-subtitle {
            text-align: center;
            font-size: 1.1rem;
            color: var(--text-secondary);
        }

        .chart-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-top: 15px;
        }

        .bars-wrapper {
            flex: 1;
            display: flex;
            gap: 8px;
            align-items: flex-end;
            padding: 0 5px;
        }

        .bar-col {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            height: 100%;
        }

        .bar-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: ${data.length > 8 ? '1.2rem' : data.length > 6 ? '1.4rem' : '1.6rem'};
            font-weight: 700;
            white-space: nowrap;
            margin-bottom: 6px;
            flex-shrink: 0;
        }

        .bar-up {
            width: 88%;
            border-radius: 10px 10px 0 0;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: 6px;
        }

        .bar-flag {
            font-size: ${data.length > 8 ? '2.5rem' : '4rem'};
            line-height: 1;
            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
        }

        .bar-name {
            font-family: 'Syne', sans-serif;
            font-size: ${data.length > 8 ? '0.95rem' : '1.15rem'};
            font-weight: 700;
            color: #ffffff;
            line-height: 1.2;
            text-align: center;
            margin-top: 10px;
        }

        .bar-name.highlight {
            color: ${c.accent};
            font-weight: 800;
        }

        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            margin-top: 12px;
            border-top: 1px solid var(--glass-border);
        }

        .source { font-size: 1rem; color: var(--text-muted); }
        .source span { color: var(--text-secondary); }
        .website { font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; font-weight: 600; color: ${c.accent}; }
    </style>
</head>
<body>
    <div class="infographic">
        <div class="bg-base"></div>
        <div class="bg-grid"></div>
        <div class="bg-glow-1"></div>

        <div class="content">
            <div class="header">
                <div class="logo">
                    <span class="logo-icon">€</span>
                    <span class="logo-text">Où Va l'Argent ?</span>
                </div>
            </div>

            <h2 class="chart-title">${accentTitle}</h2>
            <div class="chart-subtitle">${subtitleText}</div>

            <div class="chart-area">
                <div class="bars-wrapper">
${barsHTML}
                </div>
            </div>

            <div class="footer">
                <div class="source">Source : <span>${owidData.source} · OWID · ${yearStr}</span></div>
                <div class="website">ouvalargent.com</div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// ===== MULTI-COUNTRY LINE COLORS =====
const LINE_COLORS = ['#ff4757', '#ffd700', '#00d4ff', '#00ff88', '#ff9f43', '#a855f7', '#ff6b9d', '#4ecdc4'];

// ===== FETCH OWID EVOLUTION DATA =====
async function fetchOWIDEvolution(slug, countryCodes, yearsFilter) {
  console.log(`\n📊 Téléchargement des données OWID (évolution) : ${slug}`);

  // Fetch metadata
  const metaUrl = `https://ourworldindata.org/grapher/${slug}.metadata.json`;
  console.log(`  → Metadata : ${metaUrl}`);
  const metaRes = await fetch(metaUrl);
  if (!metaRes.ok) throw new Error(`Metadata HTTP ${metaRes.status} pour ${slug}`);
  const metadata = await metaRes.json();

  // Fetch CSV
  const owidNames = countryCodes.map(c => ISO_TO_OWID[c] || c);
  const csvUrl = `https://ourworldindata.org/grapher/${slug}.csv`;
  console.log(`  → CSV : ${csvUrl}`);
  const csvRes = await fetch(csvUrl);
  if (!csvRes.ok) throw new Error(`CSV HTTP ${csvRes.status} pour ${slug}`);
  const csvText = await csvRes.text();

  // Parse CSV
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const skipCols = new Set(['entity', 'code', 'year', 'day']);
  const valueColIndex = headers.findIndex((h, i) => i >= 2 && !skipCols.has(h.toLowerCase()));
  const valueColName = headers[valueColIndex] || headers[headers.length - 1];
  const actualValueIndex = valueColIndex >= 0 ? valueColIndex : headers.length - 1;

  console.log(`  → Variable : "${valueColName}"`);

  // Parse ALL rows for selected countries
  const seriesMap = {}; // { entity: [{ year, value }] }
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    if (parts.length < 3) continue;

    const entity = parts[0];
    const yr = parseInt(parts[1]) || parseInt(parts[2]);
    const val = parseFloat(parts[actualValueIndex]);

    if (isNaN(val) || isNaN(yr)) continue;
    if (!owidNames.includes(entity)) continue;

    if (!seriesMap[entity]) seriesMap[entity] = [];
    seriesMap[entity].push({ year: yr, value: val });
  }

  // Sort each series by year
  for (const entity of Object.keys(seriesMap)) {
    seriesMap[entity].sort((a, b) => a.year - b.year);
  }

  // Filter by years if specified
  if (yearsFilter) {
    const [minY, maxY] = [Math.min(...yearsFilter), Math.max(...yearsFilter)];
    for (const entity of Object.keys(seriesMap)) {
      seriesMap[entity] = seriesMap[entity].filter(d => d.year >= minY && d.year <= maxY);
    }
  }

  // Log summary
  for (const [entity, series] of Object.entries(seriesMap)) {
    const fr = COUNTRY_NAMES_FR[entity] || entity;
    const first = series[0];
    const last = series[series.length - 1];
    console.log(`  → ${fr}: ${series.length} points (${first.year}-${last.year}), dernier: ${last.value}`);
  }

  return {
    series: seriesMap,
    variable: valueColName,
    unit: extractUnit(metadata),
    title: metadata.chart?.title || slug.replace(/-/g, ' '),
    subtitle: metadata.chart?.subtitle || '',
    source: extractSource(metadata),
    slug,
  };
}

// ===== GENERATE EVOLUTION HTML (SVG LINE CHART) =====
function generateEvolutionHTML(owidData, title, colorScheme, countryCodes) {
  const c = ACCENT_COLORS[colorScheme] || ACCENT_COLORS.cyan;
  const series = owidData.series;
  const entities = Object.keys(series);

  // Chart dimensions inside SVG
  const svgW = 920, svgH = 560;
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  const plotW = svgW - margin.left - margin.right;
  const plotH = svgH - margin.top - margin.bottom;

  // Find global min/max year and value
  let allYears = [], allValues = [];
  for (const s of Object.values(series)) {
    for (const d of s) {
      allYears.push(d.year);
      allValues.push(d.value);
    }
  }
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  // Nice padding on Y axis
  const yPadding = (rawMax - rawMin) * 0.08 || 1;
  const minVal = Math.max(0, rawMin - yPadding);
  const maxVal = rawMax + yPadding;

  // Scale functions
  const xScale = (yr) => margin.left + ((yr - minYear) / (maxYear - minYear || 1)) * plotW;
  const yScale = (val) => margin.top + plotH - ((val - minVal) / (maxVal - minVal || 1)) * plotH;

  // Generate Y-axis ticks (5-6 nice ticks)
  const yRange = maxVal - minVal;
  const rawStep = yRange / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceSteps = [1, 2, 5, 10];
  const step = magnitude * niceSteps.find(s => s * magnitude >= rawStep);
  const yTicks = [];
  let tick = Math.ceil(minVal / step) * step;
  while (tick <= maxVal) {
    yTicks.push(tick);
    tick += step;
  }

  // Generate X-axis ticks (every ~10 years or reasonable interval)
  const yearSpan = maxYear - minYear;
  const xStep = yearSpan <= 20 ? 5 : yearSpan <= 50 ? 10 : yearSpan <= 150 ? 25 : 50;
  const xTicks = [];
  let xTick = Math.ceil(minYear / xStep) * xStep;
  while (xTick <= maxYear) {
    xTicks.push(xTick);
    xTick += xStep;
  }

  // Assign colors to countries
  const entityColors = {};
  entities.forEach((entity, i) => {
    entityColors[entity] = LINE_COLORS[i % LINE_COLORS.length];
  });

  // Build SVG paths
  const pathsSVG = entities.map(entity => {
    const data = series[entity];
    const color = entityColors[entity];
    const points = data.map(d => `${xScale(d.year).toFixed(1)},${yScale(d.value).toFixed(1)}`);
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p}`).join(' ');

    // Area fill (gradient below the line)
    const firstX = xScale(data[0].year).toFixed(1);
    const lastX = xScale(data[data.length - 1].year).toFixed(1);
    const bottomY = (margin.top + plotH).toFixed(1);
    const areaD = `${pathD} L${lastX},${bottomY} L${firstX},${bottomY} Z`;

    const code = Object.entries(ISO_TO_OWID).find(([k, v]) => v === entity)?.[0] || '';

    // Milestone points: first, ~33%, ~66%, last
    const milestoneIndices = [
      0,
      Math.round(data.length * 0.33),
      Math.round(data.length * 0.66),
      data.length - 1
    ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

    const milestonesSVG = milestoneIndices.map((idx, mi) => {
      const d = data[idx];
      const cx = xScale(d.year).toFixed(1);
      const cy = yScale(d.value).toFixed(1);
      const val = formatValue(d.value, owidData.variable);
      const isLast = idx === data.length - 1;
      const fontSize = 24;
      const dotR = isLast ? 8 : 6;
      const fontWeight = '800';
      // Above the point — last point closer, others higher
      const labelY = isLast ? parseFloat(cy) - 28 : parseFloat(cy) - 45;

      return `
        <circle cx="${cx}" cy="${cy}" r="${dotR}" fill="${color}" stroke="${c.bg_deep}" stroke-width="2.5" />
        <text x="${cx}" y="${labelY}" fill="${color}" font-family="'JetBrains Mono', monospace" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="middle">${val}</text>`;
    }).join('');

    return `
        <!-- ${entity} -->
        <defs>
          <linearGradient id="grad-${code}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#grad-${code})" />
        <path d="${pathD}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        ${milestonesSVG}`;
  }).join('\n');

  // Y axis grid + labels
  const yAxisSVG = yTicks.map(t => {
    const y = yScale(t).toFixed(1);
    const label = formatValue(t, owidData.variable);
    return `
        <line x1="${margin.left}" y1="${y}" x2="${margin.left + plotW}" y2="${y}" stroke="${c.text_muted}" stroke-opacity="0.3" stroke-dasharray="4,4" />
        <text x="${margin.left - 12}" y="${parseFloat(y) + 4}" fill="${c.text_sec}" font-family="'JetBrains Mono', monospace" font-size="13" text-anchor="end">${label}</text>`;
  }).join('\n');

  // X axis labels
  const xAxisSVG = xTicks.map(yr => {
    const x = xScale(yr).toFixed(1);
    return `
        <text x="${x}" y="${margin.top + plotH + 30}" fill="${c.text_sec}" font-family="'JetBrains Mono', monospace" font-size="14" text-anchor="middle">${yr}</text>`;
  }).join('\n');

  // Legend
  const legendItems = entities.map((entity, i) => {
    const fr = COUNTRY_NAMES_FR[entity] || entity;
    const code = Object.entries(ISO_TO_OWID).find(([k, v]) => v === entity)?.[0] || '';
    const flag = FLAGS[code] || '';
    const color = entityColors[entity];
    return `<span style="display: inline-flex; align-items: center; gap: 10px; margin-right: 40px;">
              <span style="width: 35px; height: 5px; background: ${color}; border-radius: 3px; display: inline-block;"></span>
              <span style="font-size: 2.8rem;">${flag}</span>
              <span style="color: ${color}; font-weight: 700; font-size: 1.8rem;">${fr}</span>
            </span>`;
  }).join('\n              ');

  // Title sizing
  const titleSize = title.length > 45 ? '3.5rem' : title.length > 30 ? '4rem' : '4.5rem';

  const subtitleText = owidData.subtitle
    ? owidData.subtitle.replace(/<[^>]+>/g, '').substring(0, 80)
    : owidData.variable;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-deep: ${c.bg_deep};
            --text-primary: #f0f4f8;
            --text-secondary: ${c.text_sec};
            --text-muted: ${c.text_muted};
            --glass-border: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Syne', sans-serif;
            background: #1a1a2e;
            padding: 2rem;
            display: flex;
            justify-content: center;
        }

        .infographic {
            width: 1080px;
            height: 1080px;
            position: relative;
            overflow: hidden;
        }

        .bg-base {
            position: absolute;
            inset: 0;
            background: linear-gradient(145deg, ${c.bg_deep} 0%, ${c.bg_mid} 50%, ${c.bg_deep} 100%);
        }

        .bg-grid {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(${c.grid} 1px, transparent 1px),
                linear-gradient(90deg, ${c.grid} 1px, transparent 1px);
            background-size: 40px 40px;
        }

        .bg-glow-1 {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, ${c.glow} 0%, transparent 70%);
            top: -200px;
            right: -100px;
            pointer-events: none;
        }

        .bg-glow-2 {
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, ${c.glow} 0%, transparent 70%);
            bottom: -150px;
            left: -100px;
            pointer-events: none;
        }

        .content {
            position: relative;
            z-index: 1;
            height: 100%;
            padding: 45px 40px 35px;
            display: flex;
            flex-direction: column;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 6px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon { font-family: 'Instrument Serif', serif; font-size: 4rem; color: ${c.accent}; line-height: 1; }
        .logo-text { font-family: 'Instrument Serif', serif; font-size: 1.8rem; font-style: italic; color: #ffffff; line-height: 1; }

        .chart-title {
            font-family: 'Instrument Serif', serif;
            font-size: ${titleSize};
            text-align: center;
            margin-bottom: 2px;
            color: var(--text-primary);
            line-height: 1.05;
        }

        .chart-title .accent {
            color: ${c.accent};
            font-style: italic;
        }

        .chart-subtitle {
            text-align: center;
            font-size: 1.1rem;
            color: var(--text-secondary);
            margin-bottom: 8px;
        }

        .legend {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
        }

        .chart-area {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
        }

        svg { overflow: visible; }

        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            margin-top: auto;
            border-top: 1px solid var(--glass-border);
        }

        .source { font-size: 1rem; color: var(--text-muted); }
        .source span { color: var(--text-secondary); }
        .website { font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; font-weight: 600; color: ${c.accent}; }
    </style>
</head>
<body>
    <div class="infographic">
        <div class="bg-base"></div>
        <div class="bg-grid"></div>
        <div class="bg-glow-1"></div>
        <div class="bg-glow-2"></div>

        <div class="content">
            <div class="header">
                <div class="logo">
                    <span class="logo-icon">€</span>
                    <span class="logo-text">Où Va l'Argent ?</span>
                </div>
            </div>

            <h2 class="chart-title">${title}</h2>
            ${owidData.customSubtitle ? `<div class="chart-subtitle">${owidData.customSubtitle}</div>` : owidData.unit ? `<div class="chart-subtitle">En ${owidData.unit} · ${Object.values(series)[0]?.[0]?.year || ''}-${Object.values(series)[0]?.slice(-1)[0]?.year || ''}</div>` : ''}

            ${entities.length > 1 ? `<div class="legend">
              ${legendItems}
            </div>` : ''}

            <div class="chart-area">
                <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
                    <!-- Unit label on Y axis (top-left) -->
                    ${owidData.unit ? `<text x="${margin.left + 6}" y="${margin.top + 16}" fill="${c.text_sec}" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="600">${owidData.unit}</text>` : ''}
                    <!-- Axes -->
                    <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotH}" stroke="${c.text_muted}" stroke-opacity="0.5" stroke-width="1" />
                    <line x1="${margin.left}" y1="${margin.top + plotH}" x2="${margin.left + plotW}" y2="${margin.top + plotH}" stroke="${c.text_muted}" stroke-opacity="0.5" stroke-width="1" />
                    ${yAxisSVG}
                    ${xAxisSVG}
                    ${pathsSVG}
                </svg>
            </div>

            <div class="footer">
                <div class="source">Source : <span>${owidData.source} · OWID · ${minYear}-${maxYear}</span></div>
                <div class="website">ouvalargent.com</div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// ===== RENDER TO PNG =====
async function renderToPNG(htmlPath, name) {
  console.log(`\n🎨 Rendu Puppeteer...`);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  const formats = [
    { width: 1080, height: 1080, dir: INSTA_DIR, suffix: 'instagram', label: 'instagram' },
    { width: 1080, height: 1920, dir: TIKTOK_V_DIR, suffix: 'tiktok-v', label: 'tiktok vert' },
    { width: 1080, height: 600, dir: TIKTOK_H_DIR, suffix: 'tiktok-h', label: 'tiktok horiz' },
  ];

  for (const fmt of formats) {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 300));
    await page.setViewport({ width: fmt.width, height: fmt.height, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 200));

    const el = await page.$('.infographic');
    if (el) {
      // Resize the infographic to match format
      await page.evaluate((w, h) => {
        const el = document.querySelector('.infographic');
        el.style.width = w + 'px';
        el.style.height = h + 'px';
      }, fmt.width, fmt.height);
      await new Promise(r => setTimeout(r, 200));
    }

    const outputPath = path.join(fmt.dir, `${name}-${fmt.suffix}.png`);
    await page.screenshot({ path: outputPath, type: 'png' });
    console.log(`  ✓ ${fmt.label.padEnd(13)} → ${name}-${fmt.suffix}.png`);
    await page.close();
  }

  await browser.close();
}

// ===== MAIN =====
async function main() {
  const args = parseArgs();

  if (!args.url) {
    console.error('❌ --url est obligatoire (ex: --url="https://ourworldindata.org/grapher/government-debt")');
    process.exit(1);
  }
  if (!args.name) {
    console.error('❌ --name est obligatoire (ex: --name="200-dette-publique")');
    process.exit(1);
  }

  // Parse slug from URL
  const slugMatch = args.url.match(/grapher\/([a-z0-9-]+)/);
  if (!slugMatch) {
    console.error('❌ URL invalide. Format attendu : https://ourworldindata.org/grapher/SLUG');
    process.exit(1);
  }
  const slug = slugMatch[1];

  // Parse countries
  const countries = (args.countries || 'FRA,USA,DEU,GBR,JPN,CHN').split(',').map(c => c.trim().toUpperCase());
  const year = args.year ? parseInt(args.year) : null;
  const colorScheme = args.color || 'cyan';
  const name = args.name;

  const isEvolution = !!args.evolution;
  const yearsFilter = args.years ? args.years.split(',').map(y => parseInt(y.trim())) : null;

  console.log(`\n🌍 OWID Infographic Generator`);
  console.log(`  Slug     : ${slug}`);
  console.log(`  Pays     : ${countries.join(', ')}`);
  console.log(`  Mode     : ${isEvolution ? 'Évolution (courbes)' : 'Comparaison (barres)'}`);
  if (!isEvolution) console.log(`  Année    : ${year || 'dernière disponible'}`);
  if (yearsFilter) console.log(`  Période  : ${yearsFilter.join('-')}`);
  console.log(`  Couleur  : ${colorScheme}`);
  console.log(`  Fichier  : ${name}`);

  let html, title, owidData;

  if (isEvolution) {
    // === EVOLUTION MODE (line chart) ===
    owidData = await fetchOWIDEvolution(slug, countries, yearsFilter);
    if (args.subtitle) owidData.customSubtitle = args.subtitle;

    const entityCount = Object.keys(owidData.series).length;
    if (entityCount === 0) {
      console.error('\n❌ Aucune donnée trouvée pour ces pays.');
      console.log('   Vérifiez les codes pays et l\'URL OWID.');
      process.exit(1);
    }

    title = args.title || owidData.title;
    console.log(`\n📝 Titre : "${title}"`);

    html = generateEvolutionHTML(owidData, title, colorScheme, countries);
  } else {
    // === COMPARISON MODE (bar chart) ===
    owidData = await fetchOWIDData(slug, countries, year);

    if (owidData.data.length === 0) {
      console.error('\n❌ Aucune donnée trouvée pour ces pays/année.');
      console.log('   Vérifiez les codes pays et l\'URL OWID.');
      process.exit(1);
    }

    title = await generateTitle(owidData, args.title);
    console.log(`\n📝 Titre : "${title}"`);

    html = generateHTML(owidData, title, colorScheme);
  }

  const htmlPath = path.join(HTML_DIR, `${name}.html`);
  fs.writeFileSync(htmlPath, html);
  console.log(`\n✅ HTML créé : ${name}.html`);

  // 4. Export PNG (unless dry-run)
  if (!args['dry-run']) {
    await renderToPNG(htmlPath, name);
    console.log(`\n✅ 3 PNG exportées !`);

    // 5. Upload to Notion if requested
    if (args.notion) {
      console.log(`\n📤 Upload Notion...`);
      const { execSync } = require('child_process');
      const num = name.match(/^(\d+)/)?.[1];
      if (num) {
        execSync(`node scripts/notion-reupload-images.js --only=${num}`, {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit'
        });
      } else {
        console.log('  ⚠️  Pas de numéro dans --name, upload Notion ignoré');
      }
    }
  } else {
    console.log('\n🔹 Dry-run : pas d\'export PNG');
  }

  console.log('\n🎉 Terminé !');
}

main().catch(err => {
  console.error('\n❌ Erreur :', err.message);
  process.exit(1);
});

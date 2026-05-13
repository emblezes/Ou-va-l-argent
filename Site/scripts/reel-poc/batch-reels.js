#!/usr/bin/env node
/**
 * Batch — génère N reels HTML puis lance render.js pour chacun.
 * Stocke les MP4 finaux dans Production interne/Réseaux Sociaux /Infographies/Insta & Autres/reel-<slug>.mp4
 * (les HTML intermédiaires restent dans Site/scripts/reel-poc/)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { generateReelHTML } = require('./reel-generator');

const VIDEOS_OUTPUT_DIR = path.resolve(__dirname, '../../../Production interne/Réseaux Sociaux /Infographies/Insta & Autres');

// Chaque reel référence l'infographie source dont il dérive (filename sans .html dans Sources HTML/).
// Le MP4 final s'appellera {infographicSource}-video.mp4 dans Infographies/Insta & Autres/.
const REELS = [
  {
    slug: 'dette-1980',
    infographicSource: '161-dette-x6-depuis-1980',
    title: { line1: 'L\'envolée de la', line2_accent: 'dette publique :', line3: '×6 depuis 1980' },
    subtitle: 'France · Dette publique · % du PIB · 1980 → 2024',
    unit: ' %',
    unitCaption: '% PIB',
    yMin: 0, yMax: 130, yGrid: [25, 50, 75, 100, 125],
    xLabels: [1980, 1990, 2000, 2010, 2020, 2024],
    data: [
      { year: 1980, value: 21 },
      { year: 1990, value: 35 },
      { year: 2000, value: 59 },
      { year: 2010, value: 85 },
      { year: 2020, value: 115 },
      { year: 2024, value: 117 },
    ],
    color: 'red',
    source: 'INSEE · Banque de France · Comptes nationaux · 2024',
  },
  {
    slug: 'charge-interets-dette',
    infographicSource: '17-charge-interets-dette',
    title: { line1: 'La charge des intérêts', line2_accent: 'explose', line3: 'depuis 2020' },
    subtitle: 'France · Md€ / an · 2010 → 2025',
    unit: ' Md€',
    unitCaption: 'Md€ / an',
    yMin: 20, yMax: 70, yGrid: [30, 40, 50, 60],
    xLabels: [2010, 2015, 2020, 2025],
    data: [
      { year: 2010, value: 47 },
      { year: 2015, value: 42 },
      { year: 2020, value: 32 },
      { year: 2022, value: 38 },
      { year: 2024, value: 53 },
      { year: 2025, value: 58 },
    ],
    color: 'orange',
    source: 'Banque de France · Comptes des administrations publiques · 2024-2025',
  },
  {
    slug: 'depenses-sante-pib',
    infographicSource: '129-depenses-sante-pib',
    title: { line1: 'La dépense de santé', line2_accent: 'a doublé', line3: 'en 50 ans' },
    subtitle: 'France · Dépense courante de santé en % du PIB · 1970 → 2024',
    unit: ' %',
    unitCaption: '% PIB',
    yMin: 4, yMax: 14, yGrid: [6, 8, 10, 12],
    xLabels: [1970, 1980, 1990, 2000, 2010, 2024],
    data: [
      { year: 1970, value: 5.5 },
      { year: 1980, value: 7.1 },
      { year: 1990, value: 8.4 },
      { year: 2000, value: 9.5 },
      { year: 2010, value: 10.9 },
      { year: 2024, value: 12.1 },
    ],
    color: 'cyan',
    source: 'DREES · Comptes de la santé · 2024',
  },
  {
    slug: 'ratio-actifs-retraites',
    infographicSource: '83-ratio-actifs-retraites',
    title: { line1: 'Retraites :', line2_accent: '4 actifs pour 1 en 1960,', line3: '1,7 aujourd\'hui' },
    subtitle: 'France · Actifs cotisants par retraité · 1960 → 2024',
    unit: '',
    unitCaption: 'actifs / 1 retraité',
    yMin: 1, yMax: 4.5, yGrid: [1.5, 2, 2.5, 3, 3.5, 4],
    xLabels: [1960, 1980, 2000, 2024],
    data: [
      { year: 1960, value: 4.0 },
      { year: 1980, value: 2.7 },
      { year: 2000, value: 2.2 },
      { year: 2010, value: 1.8 },
      { year: 2024, value: 1.7 },
    ],
    color: 'orange',
    source: 'COR · Conseil d\'orientation des retraites · Rapport 2024',
  },
  {
    slug: 'taux-recuperation-retraite-generations',
    infographicSource: '198-taux-recuperation-retraite-generations',
    title: { line1: 'Les jeunes vont', line2_accent: 'récupérer 2 × moins', line3: 'à la retraite' },
    subtitle: 'France · Pensions reçues / cotisations versées · Selon année de naissance',
    unit: ' %',
    unitCaption: 'taux récupération',
    yMin: 100, yMax: 300, yGrid: [150, 200, 250],
    xLabels: [1940, 1955, 1970, 1985, 2000],
    data: [
      { year: 1940, value: 280 },
      { year: 1955, value: 220 },
      { year: 1970, value: 155 },
      { year: 1985, value: 122 },
      { year: 2000, value: 120 },
    ],
    color: 'orange',
    endpointAbove: true,
    source: 'France Stratégie · MELETE · Chojnicki, Navaux & Ragot · 2016',
  },
  {
    slug: 'charge-interets-doublee-2020-2025',
    infographicSource: '204-charge-interets-doublee-2020-2025',
    title: { line1: 'Intérêts de la', line2_accent: 'dette publique', line3: '× 2 en 5 ans' },
    subtitle: 'France · Charge de la dette publique · Md€ · 2020 → 2025',
    unit: ' Md€',
    unitCaption: 'Md€ / an',
    yMin: 20, yMax: 55, yGrid: [25, 30, 35, 40, 45, 50],
    xLabels: [2020, 2021, 2022, 2023, 2024, 2025],
    data: [
      { year: 2020, value: 25.6 },
      { year: 2021, value: 30.0 },
      { year: 2022, value: 39.5 },
      { year: 2023, value: 45.0 },
      { year: 2024, value: 50.1 },
      { year: 2025, value: 51.6 },
    ],
    color: 'red',
    source: 'Cour des comptes · Sénat · FIPECO · IFRAP · 2020-2025',
  },
  {
    slug: 'salaires-enseignants-declassement',
    infographicSource: '209-salaires-enseignants-declassement-1980-2024',
    title: { line1: 'Salaire des profs :', line2_accent: 'le grand', line3: 'déclassement' },
    subtitle: 'France · Salaire brut hors primes rapporté au SMIC · Fin de carrière · 1980-2024',
    unit: '× SMIC',
    unitCaption: '× SMIC',
    yMin: 1, yMax: 4.5, yGrid: [1.5, 2, 2.5, 3, 3.5, 4],
    xLabels: [1980, 1990, 2000, 2010, 2024],
    data: [
      { year: 1980, value: 4.1 },
      { year: 1990, value: 3.0 },
      { year: 2000, value: 2.6 },
      { year: 2010, value: 2.3 },
      { year: 2024, value: 1.9 },
    ],
    color: 'cyan',
    source: 'Lucas Chancel · lucaschancel.com/enseignants · 2024',
  },
  {
    slug: 'inflation-france-2020-2024',
    infographicSource: '186-inflation-prix-conso',
    title: { line1: 'Inflation : la flambée', line2_accent: '×10 en deux ans', line3: '' },
    subtitle: 'France · IPC, glissement annuel en % · 2020 → 2024',
    unit: ' %',
    unitCaption: 'inflation %',
    yMin: 0, yMax: 6, yGrid: [1, 2, 3, 4, 5],
    xLabels: [2020, 2021, 2022, 2023, 2024],
    data: [
      { year: 2020, value: 0.5 },
      { year: 2021, value: 1.6 },
      { year: 2022, value: 5.2 },
      { year: 2023, value: 4.9 },
      { year: 2024, value: 2.0 },
    ],
    color: 'gold',
    source: 'INSEE · Indice des prix à la consommation · 2024',
  },
];

// Flag --only=slug pour ne traiter qu'un seul reel (utile pour test).
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const onlySlug = onlyArg ? onlyArg.slice('--only='.length) : null;
const durationArg = process.argv.find((a) => a.startsWith('--duration='));
const durationSec = durationArg ? parseInt(durationArg.slice('--duration='.length), 10) : 10;

async function main() {
  if (!fs.existsSync(VIDEOS_OUTPUT_DIR)) fs.mkdirSync(VIDEOS_OUTPUT_DIR, { recursive: true });

  const reels = onlySlug ? REELS.filter((r) => r.slug === onlySlug) : REELS;
  if (onlySlug && reels.length === 0) {
    console.error(`✗ Aucun reel trouvé pour --only=${onlySlug}`);
    console.error(`  Slugs disponibles : ${REELS.map((r) => r.slug).join(', ')}`);
    process.exit(1);
  }

  for (const config of reels) {
    if (!config.infographicSource) {
      console.error(`✗ Config "${config.slug}" sans infographicSource — skip.`);
      continue;
    }
    console.log(`\n━━━ ${config.slug} → ${config.infographicSource}-video.mp4 (${config.color}) ━━━`);

    // 1. Generate HTML (overwrite l'HTML existant — il intègre maintenant le CTA fullscreen)
    const html = generateReelHTML(config);
    const htmlPath = path.join(__dirname, `reel-${config.slug}.html`);
    fs.writeFileSync(htmlPath, html);
    console.log(`✓ HTML : ${htmlPath}`);

    // 2. Prepare output path — nom basé sur l'infographie source
    const outFile = path.join(VIDEOS_OUTPUT_DIR, `${config.infographicSource}-video.mp4`);

    // 3. Render (15s par défaut, dont 12s viz + 3s CTA)
    const renderScript = path.join(__dirname, 'render.js');
    try {
      execSync(`node "${renderScript}" --html="${htmlPath}" --output="${outFile}" --duration=${durationSec}`, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '../..'),  // Site/
      });
    } catch (err) {
      console.error(`✗ Render failed for ${config.slug}: ${err.message}`);
      continue;
    }
  }

  console.log(`\n🎬 Batch terminé. ${reels.length} reel(s) dans ${VIDEOS_OUTPUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });

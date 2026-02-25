/**
 * Met à jour la base Notion "Sources — Rapport Potentiel Minier Guyane"
 * avec les URLs détaillées des sources
 *
 * Usage: cd Site && node scripts/notion-update-sources-urls.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'notion-config.json');
const _fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const NOTION_SECRET = config.NOTION_SECRET;
const DB_ID = '30994e12-0e7a-8191-8108-dd359f26879f';

// ============================================================
// Catalogue des sources avec URLs
// ============================================================

const SOURCES_CATALOG = {
  'BRGM': 'https://www.brgm.fr/en/regional-agency/french-guiana',
  'BRGM — Inventaire minier': 'https://www.brgm.fr/en/regional-agency/french-guiana',
  'BRGM — Inventaire minier de la Guyane': 'https://www.brgm.fr/en/regional-agency/french-guiana',
  'BRGM — Inventaire du domaine minier guyanais': 'https://www.brgm.fr/en/regional-agency/french-guiana',
  'BRGM inventaire 2025 (53M€)': 'https://www.brgm.fr/en/news/news/brgm-launches-update-mineral-resources-inventory-french-guiana',
  'BRGM — Coltan Guyane': 'https://www.brgm.fr/en/reference-completed-project/coltan-mining-french-guiana-outlook-south-american-market',
  'Commission européenne — CRM Act 2024': 'https://eur-lex.europa.eu/eli/reg/2024/1252/oj/eng',
  'Commission européenne — ReSourceEU': 'https://commission.europa.eu/news-and-media/news/new-measures-secure-raw-materials-and-strengthen-eus-economic-security-2025-12-03_en',
  'Commission européenne': 'https://eur-lex.europa.eu/eli/reg/2024/1252/oj/eng',
  'Eurostat': 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250409-1',
  'Règlement (UE) 2024/1252': 'https://eur-lex.europa.eu/eli/reg/2024/1252/oj/eng',
  'INSEE': 'https://www.data.gouv.fr/datasets/comptes-regionaux-annuels/',
  'INSEE — Comptes régionaux': 'https://www.data.gouv.fr/datasets/comptes-regionaux-annuels/',
  'IEDOM': 'https://www.iedom.fr/Rapport-annuel-economique-de-la-Guyane-2024',
  'IEDOM Guyane': 'https://www.iedom.fr/Rapport-annuel-economique-de-la-Guyane-2024',
  'Ministère des Armées': 'https://www.defense.gouv.fr/operations/forces-prepositionnees/forces-souverainete/forces-armees-guyane-fag',
  'Forces armées en Guyane': 'https://www.defense.gouv.fr/operations/forces-prepositionnees/forces-souverainete/forces-armees-guyane-fag',
  'Sénat 2023': 'https://www.senat.fr/questions/base/2023/qSEQ23030327G.html',
  'rapport Sénat 2023': 'https://www.senat.fr/questions/base/2023/qSEQ23030327G.html',
  'WWF': 'https://www.wwf.fr/espaces-prioritaires/guyane/orpaillage-illegal',
  'WWF France': 'https://www.wwf.fr/espaces-prioritaires/guyane/orpaillage-illegal',
  'WWF — Mercure Guyanes 2015': 'https://wwfeu.awsassets.panda.org/downloads/mercury_contamination_in_the_guianas__2015.pdf',
  'Banque mondiale': 'https://data.worldbank.org/country/guyana',
  'FMI — WEO': 'https://www.imf.org/en/countries/guy',
  'FMI': 'https://www.imf.org/en/countries/guy',
  'Fraser Institute': 'https://www.fraserinstitute.org/studies/annual-survey-mining-companies-2024',
  'NordGold': 'https://oreamining.com/properties/french-guiana/montagne-dor/',
  'Oréa Mining': 'https://oreamining.com/properties/french-guiana/montagne-dor/',
  'Montagne d\'Or — Feasibility Study 2017': 'https://oreamining.com/news/english/2017/columbus-gold-announces-positive-bankable-feasibility-study-montagne-d-or-project-french-guiana/',
  'ARS Guyane': 'https://www.guyane.ars.sante.fr/le-mercure',
  'PAG': 'https://www.parc-amazonien-guyane.fr/en',
  'Parc amazonien de Guyane': 'https://www.parc-amazonien-guyane.fr/en',
  'DREAL Guyane': 'https://www.guyane.developpement-durable.gouv.fr/code-minier-et-sdom-a1168.html',
  'Meridiam': 'https://www.ceog.fr/en/le-projet',
  'HDF Energy': 'https://www.ceog.fr/en/le-projet',
  'CEOG': 'https://www.ceog.fr/en/le-projet',
  'ESA — HYGUANE': 'https://www.esa.int/Enabling_Support/Space_Transportation/Europe_s_Spaceport/Launch_goes_green_with_Spaceport_hydrogen_plan',
  'CAA Bordeaux nov 2024': 'https://www.legifrance.gouv.fr/ceta/id/CETATEXT000050455956',
  'Auplata Mining Group': 'https://auplatamininggroup.com/',
  'Code minier 2023': 'https://www.ecologie.gouv.fr/sites/default/files/documents/Mardi_DGPR_18%20avril%202023_r%C3%A9forme%20code%20minier.pdf',
  'SDOM Guyane': 'https://www.guyane.developpement-durable.gouv.fr/schema-departemental-d-orientation-miniere-a1535.html',
  'ExxonMobil Guyana': 'https://corporate.exxonmobil.com/locations/guyana/operations/guyana-project-overview',
  'Guyana Gold Board': 'https://nre.gov.gy/guyana-gold-board/',
  'Parlement européen — orpaillage 2023': 'https://www.europarl.europa.eu/doceo/document/E-9-2023-001795_EN.html',
  'FRS — Gilded Shadows 2023': 'https://www.frstrategie.org/en/publications/recherches-et-documents/gilded-shadows-unveiling-role-chinese-trading-posts-and-transnational-networks-fueling-illegal-gold-mining-french-guiana-2023',
  'Santé publique France': 'https://www.santepubliquefrance.fr/',
  'ONF': 'https://www.onf.fr/',
  'ADEME': 'https://www.ademe.fr/',
  'BEI': 'https://www.eib.org/',
  'LBMA': 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices',
  'Douanes': 'https://lekiosque.finances.gouv.fr/',
  'USGS': 'https://www.usgs.gov/centers/national-minerals-information-center',
  'London Metal Exchange': 'https://www.lme.com/',
};

// ============================================================
// Sources détaillées par slide (avec URLs)
// ============================================================

const slideSourcesDetailed = [
  // Slide 4 — Exec Summary
  { slideNum: 4, sources: [
    { name: 'BRGM — Inventaire minier de la Guyane', url: 'https://www.brgm.fr/en/regional-agency/french-guiana' },
    { name: 'INSEE — Comptes régionaux', url: 'https://www.data.gouv.fr/datasets/comptes-regionaux-annuels/' },
    { name: 'Eurostat — Imports terres rares UE', url: 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250409-1' },
    { name: 'Rapport Sénat — Orpaillage illégal 2023', url: 'https://www.senat.fr/questions/base/2023/qSEQ23030327G.html' },
  ]},
  // Slide 6 — KPI Dépendance UE
  { slideNum: 6, sources: [
    { name: 'Commission européenne — CRM Act (Règlement UE 2024/1252)', url: 'https://eur-lex.europa.eu/eli/reg/2024/1252/oj/eng' },
    { name: 'Commission européenne — ReSourceEU (3 Md€, déc 2025)', url: 'https://commission.europa.eu/news-and-media/news/new-measures-secure-raw-materials-and-strengthen-eus-economic-security-2025-12-03_en' },
    { name: 'Eurostat — Imports matières premières critiques', url: 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250409-1' },
  ]},
  // Slide 7 — DataTable UE
  { slideNum: 7, sources: [
    { name: 'Commission européenne — CRM Act 2024', url: 'https://eur-lex.europa.eu/eli/reg/2024/1252/oj/eng' },
    { name: 'BRGM — Inventaire Guyane', url: 'https://www.brgm.fr/en/regional-agency/french-guiana' },
  ]},
  // Slide 8 — CRM Act text
  { slideNum: 8, sources: [
    { name: 'Règlement (UE) 2024/1252 — CRM Act', url: 'https://eur-lex.europa.eu/eli/reg/2024/1252/oj/eng' },
    { name: 'Commission européenne — ReSourceEU', url: 'https://commission.europa.eu/news-and-media/news/new-measures-secure-raw-materials-and-strengthen-eus-economic-security-2025-12-03_en' },
  ]},
  // Slide 10 — Craton guyanais
  { slideNum: 10, sources: [
    { name: 'BRGM — Inventaire minier de la Guyane', url: 'https://www.brgm.fr/en/regional-agency/french-guiana' },
    { name: 'BRGM — FAQ inventaire ressources minérales', url: 'https://www.brgm.fr/en/news/feature-article/mineral-resources-inventory-answers-questions-faq' },
  ]},
  // Slide 11 — Comparison Guyane vs Guyana
  { slideNum: 11, sources: [
    { name: 'BRGM — Inventaire Guyane', url: 'https://www.brgm.fr/en/regional-agency/french-guiana' },
    { name: 'Banque mondiale — Guyana indicators', url: 'https://data.worldbank.org/country/guyana' },
    { name: 'FMI — Article IV Guyana 2025', url: 'https://www.imf.org/en/countries/guy' },
  ]},
  // Slide 12 — Gisements BRGM
  { slideNum: 12, sources: [
    { name: 'BRGM — Inventaire du domaine minier guyanais', url: 'https://www.brgm.fr/en/regional-agency/french-guiana' },
  ]},
  // Slide 14 — Montagne d'Or KPI
  { slideNum: 14, sources: [
    { name: 'Oréa Mining — Montagne d\'Or project', url: 'https://oreamining.com/properties/french-guiana/montagne-dor/' },
    { name: 'Columbus Gold — Feasibility Study 2017', url: 'https://oreamining.com/news/english/2017/columbus-gold-announces-positive-bankable-feasibility-study-montagne-d-or-project-french-guiana/' },
    { name: 'DREAL Guyane — Statistiques minières', url: 'https://www.guyane.developpement-durable.gouv.fr/code-minier-et-sdom-a1168.html' },
  ]},
  // Slide 15 — DataTable inventaire
  { slideNum: 15, sources: [
    { name: 'BRGM — Inventaire minier', url: 'https://www.brgm.fr/en/regional-agency/french-guiana' },
    { name: 'DREAL Guyane', url: 'https://www.guyane.developpement-durable.gouv.fr/code-minier-et-sdom-a1168.html' },
  ]},
  // Slide 17 — Coltan chart
  { slideNum: 17, sources: [
    { name: 'BRGM — Coltan mining in French Guiana', url: 'https://www.brgm.fr/en/reference-completed-project/coltan-mining-french-guiana-outlook-south-american-market' },
    { name: 'USGS — Tantalum statistics', url: 'https://www.usgs.gov/centers/national-minerals-information-center' },
    { name: 'London Metal Exchange', url: 'https://www.lme.com/' },
  ]},
  // Slide 20 — Production or KPI
  { slideNum: 20, sources: [
    { name: 'DREAL Guyane — Statistiques minières', url: 'https://www.guyane.developpement-durable.gouv.fr/code-minier-et-sdom-a1168.html' },
    { name: 'WWF — Orpaillage illégal Guyane', url: 'https://www.wwf.fr/espaces-prioritaires/guyane/orpaillage-illegal' },
    { name: 'LBMA — Cours de l\'or', url: 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices' },
  ]},
  // Slide 21 — Montagne d'Or timeline
  { slideNum: 21, sources: [
    { name: 'Oréa Mining — Montagne d\'Or', url: 'https://oreamining.com/properties/french-guiana/montagne-dor/' },
    { name: 'CAA Bordeaux — Arrêt 26 nov. 2024', url: 'https://www.legifrance.gouv.fr/ceta/id/CETATEXT000050455956' },
    { name: 'NordGold — Arbitrage 4,56 Md$', url: 'https://oreamining.com/news/english/2023/orea-terminates-acquisition-of-additional-interest-in-montagne-dor-project/' },
  ]},
  // Slide 22 — Auplata
  { slideNum: 22, sources: [
    { name: 'Auplata Mining Group — Rapports annuels', url: 'https://auplatamininggroup.com/' },
  ]},
  // Slide 24 — Orpaillage KPI
  { slideNum: 24, sources: [
    { name: 'Forces armées en Guyane (FAG)', url: 'https://www.defense.gouv.fr/operations/forces-prepositionnees/forces-souverainete/forces-armees-guyane-fag' },
    { name: 'Rapport Sénat 2023 — Orpaillage illégal', url: 'https://www.senat.fr/questions/base/2023/qSEQ23030327G.html' },
    { name: 'WWF — Orpaillage illégal', url: 'https://www.wwf.fr/espaces-prioritaires/guyane/orpaillage-illegal' },
    { name: 'ARS Guyane — Mercure', url: 'https://www.guyane.ars.sante.fr/le-mercure' },
    { name: 'Parlement européen — Question E-001795/2023', url: 'https://www.europarl.europa.eu/doceo/document/E-9-2023-001795_EN.html' },
  ]},
  // Slide 25 — Sites illégaux chart
  { slideNum: 25, sources: [
    { name: 'Forces armées en Guyane', url: 'https://www.defense.gouv.fr/operations/forces-prepositionnees/forces-souverainete/forces-armees-guyane-fag' },
    { name: 'ONF Guyane', url: 'https://www.onf.fr/' },
  ]},
  // Slide 26 — Coûts waterfall
  { slideNum: 26, sources: [
    { name: 'Ministère des Armées — FAG', url: 'https://www.defense.gouv.fr/operations/forces-prepositionnees/forces-souverainete/forces-armees-guyane-fag' },
    { name: 'FRS — Gilded Shadows (coûts: 70M€/an Harpie, >500M€/an pertes)', url: 'https://www.frstrategie.org/en/publications/recherches-et-documents/gilded-shadows-unveiling-role-chinese-trading-posts-and-transnational-networks-fueling-illegal-gold-mining-french-guiana-2023' },
  ]},
  // Slide 27 — Harpie text
  { slideNum: 27, sources: [
    { name: 'Ministère des Armées — Forces armées en Guyane', url: 'https://www.defense.gouv.fr/operations/forces-prepositionnees/forces-souverainete/forces-armees-guyane-fag' },
    { name: 'FRS — Gilded Shadows 2023 (coûts détaillés)', url: 'https://www.frstrategie.org/sites/default/files/documents/publications/recherches-et-documents/2023/132023.pdf' },
  ]},
  // Slide 29 — Environnement KPI
  { slideNum: 29, sources: [
    { name: 'ARS Guyane — Mercure', url: 'https://www.guyane.ars.sante.fr/le-mercure' },
    { name: 'WWF — Mercury contamination in the Guianas (2015, PDF)', url: 'https://wwfeu.awsassets.panda.org/downloads/mercury_contamination_in_the_guianas__2015.pdf' },
    { name: 'Parc amazonien de Guyane', url: 'https://www.parc-amazonien-guyane.fr/en' },
    { name: 'BRGM — Déforestation et mercure en Guyane', url: 'https://www.brgm.fr/en/reference-completed-project/deforestation-through-agriculture-mining-french-guiana-impacts-mercury' },
  ]},
  // Slide 30 — Comparaison légal/illégal
  { slideNum: 30, sources: [
    { name: 'DREAL Guyane — Réglementation ICPE mines', url: 'https://www.guyane.developpement-durable.gouv.fr/code-minier-et-sdom-a1168.html' },
    { name: 'Étude d\'impact Montagne d\'Or (Oréa Mining)', url: 'https://oreamining.com/news/english/2020/orea-completes-montagne-dor-gold-project-modifications/' },
    { name: 'ARS Guyane', url: 'https://www.guyane.ars.sante.fr/le-mercure' },
  ]},
  // Slide 33 — Économie KPI
  { slideNum: 33, sources: [
    { name: 'INSEE — Comptes régionaux', url: 'https://www.data.gouv.fr/datasets/comptes-regionaux-annuels/' },
    { name: 'IEDOM — Rapport annuel Guyane 2024', url: 'https://www.iedom.fr/Rapport-annuel-economique-de-la-Guyane-2024' },
    { name: 'Douanes — Commerce extérieur', url: 'https://lekiosque.finances.gouv.fr/' },
  ]},
  // Slide 37 — Réglementation text
  { slideNum: 37, sources: [
    { name: 'Code minier — Réforme 2023', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/Mardi_DGPR_18%20avril%202023_r%C3%A9forme%20code%20minier.pdf' },
    { name: 'SDOM Guyane', url: 'https://www.guyane.developpement-durable.gouv.fr/schema-departemental-d-orientation-miniere-a1535.html' },
  ]},
  // Slide 38 — Délais comparison
  { slideNum: 38, sources: [
    { name: 'Fraser Institute — Annual Survey of Mining Companies 2024', url: 'https://www.fraserinstitute.org/studies/annual-survey-mining-companies-2024' },
    { name: 'Banque mondiale — Doing Business', url: 'https://data.worldbank.org/' },
  ]},
  // Slide 40 — Guyana KPI
  { slideNum: 40, sources: [
    { name: 'Banque mondiale — Guyana indicators', url: 'https://data.worldbank.org/country/guyana' },
    { name: 'FMI — Article IV Guyana 2025', url: 'https://www.imf.org/en/countries/guy' },
    { name: 'FMI — WEO Data Mapper (Guyana GDP growth)', url: 'https://www.imf.org/external/datamapper/NGDP_RPCH@WEO/OEMDC/ADVEC/WEOWORLD/GUY' },
    { name: 'ExxonMobil — Guyana operations', url: 'https://corporate.exxonmobil.com/locations/guyana/operations/guyana-project-overview' },
    { name: 'Guyana Gold Board', url: 'https://nre.gov.gy/guyana-gold-board/' },
  ]},
  // Slide 48 — Hydrogène KPI
  { slideNum: 48, sources: [
    { name: 'Projet CEOG — Site officiel', url: 'https://www.ceog.fr/en/le-projet' },
    { name: 'ESA — HYGUANE (hydrogène vert CSG)', url: 'https://www.esa.int/Enabling_Support/Space_Transportation/Europe_s_Spaceport/Launch_goes_green_with_Spaceport_hydrogen_plan' },
    { name: 'ADEME', url: 'https://www.ademe.fr/' },
  ]},
  // Slide 49 — BRGM 2025
  { slideNum: 49, sources: [
    { name: 'BRGM — Lancement inventaire Guyane (mars 2025)', url: 'https://www.brgm.fr/en/news/news/brgm-launches-update-mineral-resources-inventory-french-guiana' },
    { name: 'BRGM — FAQ inventaire', url: 'https://www.brgm.fr/en/news/feature-article/mineral-resources-inventory-answers-questions-faq' },
  ]},
];

// ============================================================
// Requêter les pages existantes et les mettre à jour
// ============================================================

function notionApi(endpoint, method, body) {
  const bodyStr = body ? JSON.stringify(body).replace(/'/g, "'\\''") : '';
  const cmd = `curl -s -X ${method} "https://api.notion.com/v1/${endpoint}" \
    -H "Authorization: Bearer ${NOTION_SECRET}" \
    -H "Content-Type: application/json" \
    -H "Notion-Version: 2022-06-28" \
    ${body ? `-d '${bodyStr}'` : ''}`;
  return JSON.parse(execSync(cmd, { maxBuffer: 10 * 1024 * 1024 }).toString());
}

// 1. Fetch all pages from the database
console.log('📊 Récupération des slides existantes...');
const queryResult = notionApi(`databases/${DB_ID}/query`, 'POST', {
  sorts: [{ property: 'N°', direction: 'ascending' }],
  page_size: 100,
});

if (queryResult.object === 'error') {
  console.error('❌', queryResult.message);
  process.exit(1);
}

const pages = queryResult.results;
console.log(`📄 ${pages.length} slides trouvées\n`);

// Build a map of slideNum -> pageId
const slidePageMap = {};
for (const page of pages) {
  const num = page.properties['N°']?.number;
  if (num) slidePageMap[num] = page.id;
}

// 2. Update each slide with detailed sources
let updated = 0;
let skipped = 0;

for (const slideData of slideSourcesDetailed) {
  const pageId = slidePageMap[slideData.slideNum];
  if (!pageId) {
    console.log(`⚠️  Slide ${slideData.slideNum} non trouvée dans Notion`);
    skipped++;
    continue;
  }

  // Format sources as rich text with URLs
  const sourcesText = slideData.sources.map(s => `• ${s.name}\n  ${s.url}`).join('\n\n');

  // Update the Sources property
  const updateResult = notionApi(`pages/${pageId}`, 'PATCH', {
    properties: {
      'Sources': {
        rich_text: [{ text: { content: sourcesText.substring(0, 2000) } }]
      },
    },
  });

  // Also add a block with clickable links in the page body
  const blocks = slideData.sources.map(s => ({
    object: 'block',
    type: 'bookmark',
    bookmark: { url: s.url, caption: [{ type: 'text', text: { content: s.name } }] },
  }));

  // Add a heading + bookmarks
  try {
    notionApi(`blocks/${pageId}/children`, 'PATCH', {
      children: [
        {
          object: 'block',
          type: 'heading_3',
          heading_3: { rich_text: [{ type: 'text', text: { content: 'Sources détaillées' } }] },
        },
        ...blocks,
      ],
    });
  } catch (e) {
    // Ignore block errors
  }

  if (updateResult.object === 'error') {
    console.error(`❌ Slide ${slideData.slideNum}: ${updateResult.message}`);
  } else {
    console.log(`✅ Slide ${slideData.slideNum} — ${slideData.sources.length} sources avec URLs`);
    updated++;
  }
}

console.log(`\n✅ ${updated} slides mises à jour avec URLs détaillées, ${skipped} ignorées`);

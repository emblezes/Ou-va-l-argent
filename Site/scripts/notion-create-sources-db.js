/**
 * Crée une base Notion avec les sources slide par slide
 * du rapport "Potentiel minier de la Guyane"
 *
 * Usage: cd Site && node scripts/notion-create-sources-db.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const configPath = path.join(__dirname, 'notion-config.json');
const _fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const NOTION_SECRET = config.NOTION_SECRET;

// Parent page — on crée la DB sous la page principale
const PARENT_PAGE_ID = config.PAGE_ID;

function notionApi(endpoint, method, body) {
  const cmd = `curl -s -X ${method} "https://api.notion.com/v1/${endpoint}" \
    -H "Authorization: Bearer ${NOTION_SECRET}" \
    -H "Content-Type: application/json" \
    -H "Notion-Version: 2022-06-28" \
    ${body ? `-d '${JSON.stringify(body).replace(/'/g, "'\\''")}'` : ''}`;
  const result = execSync(cmd, { maxBuffer: 10 * 1024 * 1024 }).toString();
  return JSON.parse(result);
}

// ============================================================
// Données slide par slide
// ============================================================

const slides = [
  { num: 1, section: '0 — Ouverture', titre: 'Couverture', type: 'Cover', sources: '—', donnees: '—', statut: 'OK' },
  { num: 2, section: '0 — Ouverture', titre: 'Table des matières (1/2)', type: 'TOC', sources: '—', donnees: '—', statut: 'OK' },
  { num: 3, section: '0 — Ouverture', titre: 'Table des matières (2/2)', type: 'TOC', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 4, section: '0 — Ouverture', titre: 'Synthèse : cinq constats clés',
    type: 'ExecSummary',
    sources: 'BRGM, INSEE, Eurostat, rapports parlementaires',
    donnees: '98% inexploré, ~500 sites illégaux, 8 000 garimpeiros, 13t mercure, 98% dépendance UE Chine, +62% PIB Guyana, ~10 ans permis FR vs 2 ans AU',
    statut: 'À vérifier',
  },
  { num: 5, section: '1 — Géostratégie', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 6, section: '1 — Géostratégie',
    titre: 'Dépendance européenne aux métaux critiques',
    type: 'KPIDashboard',
    sources: 'Commission européenne (2024), Eurostat, Règlement (UE) 2024/1252, CRM Act Annexe I',
    donnees: 'Terres rares 98% Chine, lithium 79%, cobalt 68%, objectif CRM Act 10%, budget ReSourceEU 3 Md€, 34 métaux critiques',
    statut: 'Vérifié — 98% concerne les aimants terres rares spécifiquement',
  },
  {
    num: 7, section: '1 — Géostratégie',
    titre: "L'UE importe 98% de ses terres rares de Chine",
    type: 'DataTable',
    sources: 'Commission européenne — CRM Act 2024, BRGM',
    donnees: 'Terres rares 98% Chine, lithium 79% Chili/AU, tantale 34% RDC, cobalt 68% RDC, niobium 85% Brésil, bauxite 30% Guinée',
    statut: 'Vérifié',
  },
  {
    num: 8, section: '1 — Géostratégie',
    titre: 'Critical Raw Materials Act + ReSourceEU',
    type: 'TextSlide',
    sources: 'Commission européenne, Règlement (UE) 2024/1252',
    donnees: 'CRM Act mars 2024 : 10% extraction, 40% transformation, 25% recyclage. ReSourceEU nov 2024 : 3 Md€ sur 2025-2030',
    statut: 'Vérifié',
  },
  { num: 9, section: '2 — Bouclier guyanais', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 10, section: '2 — Bouclier guyanais',
    titre: 'Le craton guyanais : formation géologique exceptionnelle',
    type: 'TextSlide',
    sources: 'BRGM — Inventaire minier de la Guyane',
    donnees: 'Craton 1,7-2,2 Md années, 1,5 M km², seul territoire UE sur craton archéen, 96% forêt, 2% cartographié',
    statut: 'Vérifié',
  },
  {
    num: 11, section: '2 — Bouclier guyanais',
    titre: 'Guyane vs Guyana vs Suriname : même géologie, trajectoires opposées',
    type: 'Comparison',
    sources: 'BRGM, Banque mondiale, statistiques nationales',
    donnees: 'Guyana : 28% PIB minier, 18t or/an, +62% croissance. Suriname : 20% PIB, 30t or/an. Guyane fr. : <1% PIB, 1,5t légal, Montagne d\'Or rejeté',
    statut: 'À vérifier — production or Suriname 30t/an ?',
  },
  {
    num: 12, section: '2 — Bouclier guyanais',
    titre: 'Inventaire BRGM : gisements identifiés',
    type: 'ChartWithAnalysis',
    sources: 'BRGM — Inventaire du domaine minier guyanais',
    donnees: '47 gisements or, 30 tantale, 12 bauxite, 8 kaolin, 6 diamants, 4 indices terres rares',
    statut: 'À vérifier — nombres exacts de gisements',
  },
  { num: 13, section: '3 — Inventaire ressources', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 14, section: '3 — Inventaire ressources',
    titre: 'Montagne d\'Or : 80+ tonnes de réserves',
    type: 'KPIDashboard',
    sources: 'NordGold / Oréa Mining, DREAL Guyane 2024, étude d\'impact 2018',
    donnees: '80+ t réserves (85t prouvées+probables), valeur ~7 Md€ à 2200$/oz, prod légale 1,5t/an vs 6t illégal, 750 emplois, 47 gisements, 12 ans durée',
    statut: 'Vérifié — 85,4t réserves prouvées+probables (Columbus Gold Feasibility Study)',
  },
  {
    num: 15, section: '3 — Inventaire ressources',
    titre: 'Inventaire complet des ressources',
    type: 'DataTable',
    sources: 'BRGM — Inventaire minier, DREAL Guyane',
    donnees: 'Or 47 gisements 100+t ~8Md€, Tantale 30 non quantifié, Bauxite 12 >20Mt ~500M€, Kaolin 8 >5Mt ~200M€, Diamants 6, Terres rares 4 indices, Niobium 3 indices',
    statut: 'À vérifier — Tantale "30 gisements" = occurrences BRGM, pas dépôts économiques confirmés',
  },
  {
    num: 16, section: '3 — Inventaire ressources',
    titre: 'Valeur estimée des réserves : > 10 Md€',
    type: 'BridgeChart',
    sources: 'BRGM, estimations Où Va l\'Argent (cours 2025)',
    donnees: 'Or 8 Md€ + Bauxite 0,5 + Kaolin 0,2 + Tantale 1,0 + Autres 0,5 = ~10,2 Md€',
    statut: 'Estimation interne — à préciser comme telle',
  },
  {
    num: 17, section: '3 — Inventaire ressources',
    titre: 'Coltan et tantale : 30 gisements, production nulle depuis 1990',
    type: 'ChartWithAnalysis',
    sources: 'BRGM, USGS, London Metal Exchange',
    donnees: 'Production tantale 1970-1990 puis zéro. Prix x3 en 10 ans. RDC et Rwanda dominent marché mondial',
    statut: 'À vérifier — "30 gisements" = occurrences. Prix tantale à confirmer',
  },
  {
    num: 18, section: '3 — Inventaire ressources',
    titre: 'Ressources critiques UE : ce que la Guyane pourrait fournir',
    type: 'Comparison',
    sources: 'Commission européenne, BRGM',
    donnees: 'Imports UE vs potentiel Guyane vs objectifs CRM 2030',
    statut: 'OK — synthèse des slides précédents',
  },
  { num: 19, section: '4 — Or guyanais', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 20, section: '4 — Or guyanais',
    titre: 'Production légale quasi-nulle face à 6t/an illégal',
    type: 'KPIDashboard',
    sources: 'DREAL Guyane 2024, WWF, rapport Harpie, LBMA',
    donnees: 'Prod légale 1,5t/an, illégal ~6t/an, manque fiscal ~200M€/an, cours or 2900$/oz (+85% en 5 ans)',
    statut: 'Vérifié — 6t dans fourchette 5-10t (forces armées)',
  },
  {
    num: 21, section: '4 — Or guyanais',
    titre: 'Montagne d\'Or : chronique d\'un projet avorté',
    type: 'TextSlide',
    sources: 'NordGold, Oréa Mining, Conseil d\'État, CAA Bordeaux, rapports parlementaires',
    donnees: '80+t or, 1Md€ investissement, 750 emplois, 12 ans. Timeline 2004→2025. Arbitrage 4,5 Md$',
    statut: 'Vérifié — rejet CAA Bordeaux 26 nov 2024, arbitrage 4,56 Md$',
  },
  {
    num: 22, section: '4 — Or guyanais',
    titre: 'Auplata Mining Group : seul acteur légal significatif',
    type: 'DataTable',
    sources: 'Auplata Mining Group — rapports annuels',
    donnees: 'Prod 350→520 kg, CA 12→28M€, 120→210 employés, 6→8 permis, cours 0,05→0,02€',
    statut: 'À vérifier — données Auplata à confirmer dans rapports annuels',
  },
  { num: 23, section: '5 — Orpaillage illégal', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 24, section: '5 — Orpaillage illégal',
    titre: '~500 sites illégaux, 8 000 garimpeiros, 6t or/an',
    type: 'KPIDashboard',
    sources: 'ONF / Forces armées 2024, rapport Sénat 2023, WWF/PAG, ARS Guyane, Min. Armées, bilan Harpie',
    donnees: '~500 sites (fourchette 400-600), 8000 garimpeiros, ~6t/an or, 13t mercure/an, ~80M€ Harpie, 26M€ matériel détruit',
    statut: 'Vérifié — garimpeiros 8000 (donnée 2021), sites = estimation',
  },
  {
    num: 25, section: '5 — Orpaillage illégal',
    titre: 'Nombre de sites illégaux : explosion malgré Harpie',
    type: 'ChartWithAnalysis',
    sources: 'Forces armées en Guyane, ONF',
    donnees: 'Courbe 2008-2024 : 180→500 sites. +228% depuis Harpie',
    statut: 'À vérifier — série temporelle des sites à sourcer précisément',
  },
  {
    num: 26, section: '5 — Orpaillage illégal',
    titre: 'Orpaillage illégal coûte > 500 M€/an',
    type: 'BridgeChart',
    sources: 'Min. Armées, INSEE, ARS, rapports parlementaires',
    donnees: 'Ops militaires 80M€ + fiscal 200M€ + enviro 150M€ + santé 50M€ + éco locale 40M€ = 520M€',
    statut: 'Estimation composite — décomposition à détailler en notes',
  },
  {
    num: 27, section: '5 — Orpaillage illégal',
    titre: 'Opération Harpie : effort coûteux mais insuffisant',
    type: 'TextSlide',
    sources: 'Ministère des Armées, Forces armées en Guyane',
    donnees: '2500 militaires + 600 gendarmes, 26M€ matériel détruit, 730km frontière, 48h reconstruction',
    statut: 'Vérifié — coût Harpie ~70M€/an (Parlement européen)',
  },
  { num: 28, section: '6 — Impact environnemental', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 29, section: '6 — Impact environnemental',
    titre: '~29 000 ha déforestés, 13t mercure, 5 840 km cours d\'eau',
    type: 'KPIDashboard',
    sources: 'ONF / images satellites, ARS Guyane, PAG / DEAL, Santé publique France',
    donnees: '~29 000 ha déforestation (depuis 2000), 13t mercure/an, 5 840 km cours d\'eau, >10 000 personnes exposées',
    statut: 'ATTENTION — 13t = Guyane spécifiquement. ~80t/an pour toutes les Guyanes (WWF 2015). Déforestation 29 000 ha (2003-2009, ONF)',
  },
  {
    num: 30, section: '6 — Impact environnemental',
    titre: 'Orpaillage illégal vs exploitation légale : le paradoxe',
    type: 'Comparison',
    sources: 'DREAL Guyane, étude d\'impact Montagne d\'Or, ARS',
    donnees: 'Illégal : 13t mercure, déforestation non contrôlée, 0 réhabilitation. Légal : 0 mercure, compensation 1:3, réhabilitation obligatoire',
    statut: 'Vérifié',
  },
  {
    num: 31, section: '6 — Impact environnemental',
    titre: 'Exploitation légale comme solution environnementale',
    type: 'TextSlide',
    sources: 'DREAL Guyane, PAG, ONF',
    donnees: 'Argument : mine légale = pas mercure, compensation déforestation, réhabilitation, emplois locaux',
    statut: 'OK — argumentaire éditorial basé sur données vérifiées',
  },
  { num: 32, section: '7 — Économie Guyane', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 33, section: '7 — Économie Guyane',
    titre: 'PIB 5,1 Md€, chômage 17%, déficit 2,5 Md€',
    type: 'KPIDashboard',
    sources: 'INSEE — Comptes régionaux, IEDOM Guyane, Douanes',
    donnees: 'PIB 5,1 Md€, PIB/hab 16 800€ (vs 42 000€ métropole), chômage 17% (vs 7,5%), déficit commercial 2,5 Md€, transferts ~3 Md€/an (~60% PIB), croissance démo +2,4%/an (310k hab)',
    statut: 'À VÉRIFIER — PIB 4,56 Md€ en 2022 (UNCTAD). 5,1 Md€ = projection ? Déficit 2,5 Md€ semble élevé (6% PIB ≈ 300M€ en 2024)',
  },
  {
    num: 34, section: '7 — Économie Guyane',
    titre: 'Flux financiers : d\'où vient et où va l\'argent',
    type: 'BridgeChart',
    sources: 'IEDOM Guyane, INSEE, Douanes',
    donnees: 'Transferts publics 3 Md€ + spatial 0,8 + pêche/agri 0,3 + mine 0,1 - imports 3,5 = solde',
    statut: 'Estimation interne — ordre de grandeur à confirmer avec IEDOM',
  },
  {
    num: 35, section: '7 — Économie Guyane',
    titre: 'Guyane = DOM le plus fragile économiquement',
    type: 'DataTable',
    sources: 'INSEE — Comptes régionaux 2024, IEDOM',
    donnees: 'Guyane vs Martinique vs Réunion vs Métropole : PIB/hab, chômage, transferts, pauvreté 53%',
    statut: 'À vérifier — pauvreté 53% à sourcer (INSEE)',
  },
  { num: 36, section: '8 — Réglementation', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 37, section: '8 — Réglementation',
    titre: 'SDOM, Code minier, moratoire : millefeuille administratif',
    type: 'TextSlide',
    sources: 'Code minier, SDOM Guyane, rapports CGEDD',
    donnees: 'SDOM 2011/2020 : ~60% territoire interdit. PER 2-5 ans. Concession 5-10 ans. Total 10-15 ans. Aucun nouveau permis depuis 2017',
    statut: 'À vérifier — "aucun permis depuis 2017" à confirmer',
  },
  {
    num: 38, section: '8 — Réglementation',
    titre: 'Délais permis : France 5x plus lente',
    type: 'Comparison',
    sources: 'Banque mondiale — Doing Business Mining, Fraser Institute',
    donnees: 'France 10-15 ans, Australie 2-4 ans, Canada 3-5 ans, Guyana 1-3 ans',
    statut: 'Non vérifié précisément — plausible mais pas de source officielle pour 10 ans France',
  },
  { num: 39, section: '9 — Comparaisons', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 40, section: '9 — Comparaisons',
    titre: 'Guyana : de la pauvreté au boom économique',
    type: 'KPIDashboard',
    sources: 'Banque mondiale, FMI — WEO, Guyana Gold Board, ExxonMobil Guyana, Guyana Investment Office',
    donnees: '+62% PIB 2022, PIB/hab 5 000$ (2019) → 25 000$ (2025), 18t or/an, 650 000 b/j pétrole, minier 28% PIB, IDE ~3 Md$',
    statut: 'Vérifié — +62,3% (IMF), pétrole production vérifiée EIA',
  },
  {
    num: 41, section: '9 — Comparaisons',
    titre: 'Modèles de développement minier réussis',
    type: 'DataTable',
    sources: 'Banque mondiale, Fraser Institute Annual Survey 2024',
    donnees: 'Guyana 28%PIB, Suriname 20%, Ghana 7%, Australie-Occ. 35%, Québec 8%, Guyane <1%',
    statut: 'À vérifier — parts PIB minier par pays',
  },
  {
    num: 42, section: '9 — Comparaisons',
    titre: 'PIB/hab : Guyana a dépassé la Guyane fr.',
    type: 'ChartWithAnalysis',
    sources: 'Banque mondiale, FMI — WEO, INSEE',
    donnees: 'Guyana 3200$ (2010) → 25 000$ (2024). Guyane 14 000€ → 16 800€. Croisement en 2023',
    statut: 'Vérifié',
  },
  { num: 43, section: '10 — Potentiel économique', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 44, section: '10 — Potentiel économique',
    titre: 'Valeur réserves, emplois potentiels, recettes fiscales',
    type: 'KPIDashboard',
    sources: 'BRGM, estimations Où Va l\'Argent, benchmarks internationaux',
    donnees: '>10 Md€ réserves, ~50 Md€ potentiel total, 5 000+ emplois directs, 15 000+ indirects, ~300 M€/an recettes, -5pts chômage',
    statut: 'Estimation interne — clairement étiqueté comme projection',
  },
  {
    num: 45, section: '10 — Potentiel économique',
    titre: 'Impact économique filière minière sur 20 ans',
    type: 'BridgeChart',
    sources: 'Estimations Où Va l\'Argent, benchmarks internationaux',
    donnees: 'Investissement initial -3 Md€ + production or 8 + autres 4 + fiscal 6 + emplois 5 = impact net',
    statut: 'Estimation interne — scénario optimiste',
  },
  {
    num: 46, section: '10 — Potentiel économique',
    titre: 'Trois scénarios : statu quo vs raisonné vs ambitieux',
    type: 'Comparison',
    sources: 'Estimations Où Va l\'Argent, benchmarks Guyana/Suriname',
    donnees: 'Statu quo : 0 emploi, illégal +35%. Raisonné : 3-5 mines, 5 000 emplois, 300M€/an. Ambitieux : 10+ mines, 20 000 emplois, 800M€/an',
    statut: 'Estimation interne — projections',
  },
  { num: 47, section: '11 — Projets avenir', titre: 'Section Divider', type: 'SectionDivider', sources: '—', donnees: '—', statut: 'OK' },
  {
    num: 48, section: '11 — Projets avenir',
    titre: 'Hydrogène vert : CEOG et HYGUANE',
    type: 'KPIDashboard',
    sources: 'Meridiam, HDF Energy, ADEME, BEI',
    donnees: 'CEOG 55 MW, 170M€. HYGUANE 10 MW. Potentiel solaire 200 MW',
    statut: 'Vérifié — CEOG 10MW baseload (55MW solaire + 128 MWh H2). HYGUANE 40,5M€ pour CSG',
  },
  {
    num: 49, section: '11 — Projets avenir',
    titre: 'BRGM 2025 : 53 M€ / 5 ans — le tournant stratégique',
    type: 'TextSlide',
    sources: 'BRGM, Ministère Transition écologique',
    donnees: '53 M€ sur 5 ans, lancé 20 mars 2025, cartographie 100% territoire, métaux critiques',
    statut: 'Vérifié',
  },
  {
    num: 50, section: '12 — Recommandations',
    titre: '5 recommandations stratégiques',
    type: 'KeyTakeaways',
    sources: 'Analyse Où Va l\'Argent',
    donnees: '1. Réformer Code minier (guichet unique). 2. Réviser SDOM. 3. Intensifier lutte illégal. 4. Capter fonds CRM/ReSourceEU. 5. Former localement',
    statut: 'OK — recommandations éditoriales',
  },
  {
    num: 51, section: '12 — Recommandations',
    titre: 'Sources et références',
    type: 'SourcesPage',
    sources: 'BRGM, Commission européenne, INSEE, IEDOM, Min. Armées, Sénat, WWF, Banque mondiale, FMI, Fraser Institute, NordGold, ARS Guyane, PAG, DREAL, Meridiam/HDF',
    donnees: '16 sources principales listées',
    statut: 'OK',
  },
  { num: 52, section: '12 — Recommandations', titre: 'Back Cover', type: 'BackCover', sources: '—', donnees: '—', statut: 'OK' },
];

// ============================================================
// Créer la base de données Notion
// ============================================================

console.log('📊 Création de la base de données Notion...');

const dbResponse = notionApi('databases', 'POST', {
  parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
  icon: { type: 'emoji', emoji: '📑' },
  title: [{ type: 'text', text: { content: 'Sources — Rapport Potentiel Minier Guyane' } }],
  properties: {
    'Slide': { title: {} },
    'N°': { number: {} },
    'Section': { select: {} },
    'Type': { select: {} },
    'Sources': { rich_text: {} },
    'Données clés': { rich_text: {} },
    'Statut vérification': {
      select: {
        options: [
          { name: 'Vérifié', color: 'green' },
          { name: 'À vérifier', color: 'yellow' },
          { name: 'Estimation interne', color: 'orange' },
          { name: 'Non vérifié', color: 'red' },
          { name: 'OK', color: 'gray' },
        ]
      }
    },
  }
});

if (dbResponse.object === 'error') {
  console.error('❌ Erreur création DB:', dbResponse.message);
  process.exit(1);
}

const DB_ID = dbResponse.id;
console.log(`✅ Base créée : ${DB_ID}`);

// ============================================================
// Ajouter chaque slide
// ============================================================

function getStatutName(statut) {
  if (statut.startsWith('Vérifié')) return 'Vérifié';
  if (statut.startsWith('À vérifier') || statut.startsWith('À VÉRIFIER') || statut.startsWith('ATTENTION')) return 'À vérifier';
  if (statut.startsWith('Estimation') || statut.includes('interne')) return 'Estimation interne';
  if (statut.startsWith('Non vérifié')) return 'Non vérifié';
  return 'OK';
}

let success = 0;
let errors = 0;

for (const slide of slides) {
  try {
    const page = notionApi('pages', 'POST', {
      parent: { database_id: DB_ID },
      properties: {
        'Slide': { title: [{ text: { content: slide.titre } }] },
        'N°': { number: slide.num },
        'Section': { select: { name: slide.section } },
        'Type': { select: { name: slide.type } },
        'Sources': { rich_text: [{ text: { content: slide.sources.substring(0, 2000) } }] },
        'Données clés': { rich_text: [{ text: { content: slide.donnees.substring(0, 2000) } }] },
        'Statut vérification': { select: { name: getStatutName(slide.statut) } },
      },
      children: slide.statut !== 'OK' && slide.statut !== '—' ? [
        {
          object: 'block',
          type: 'callout',
          callout: {
            icon: { type: 'emoji', emoji: slide.statut.startsWith('Vérifié') ? '✅' : slide.statut.startsWith('À vérifier') || slide.statut.startsWith('ATTENTION') ? '⚠️' : '📝' },
            rich_text: [{ type: 'text', text: { content: slide.statut } }],
          }
        }
      ] : [],
    });

    if (page.object === 'error') {
      console.error(`❌ Slide ${slide.num}: ${page.message}`);
      errors++;
    } else {
      success++;
    }
  } catch (err) {
    console.error(`❌ Slide ${slide.num}: ${err.message}`);
    errors++;
  }
}

console.log(`\n✅ ${success} slides ajoutées, ${errors} erreurs`);
console.log(`📊 Base Notion : https://www.notion.so/${DB_ID.replace(/-/g, '')}`);

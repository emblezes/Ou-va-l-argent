#!/usr/bin/env node

/**
 * Exemples pratiques d'utilisation de l'API Our World in Data (OWID)
 * Pour le projet "Où Va l'Argent"
 *
 * Usage:
 *   node owid-api-examples.js --chart=life-expectancy
 *   node owid-api-examples.js --search="government spending"
 *   node owid-api-examples.js --test
 */

const https = require('https');
const { URL } = require('url');

// ============================================================================
// 1. UTILITAIRES
// ============================================================================

/**
 * Fetch HTTP GET (simple, sans dépendances externes)
 */
async function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          // Si ce n'est pas du JSON, retourner le texte brut
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Parser CSV simple
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i];
    });
    return obj;
  });
}

// ============================================================================
// 2. API GRAPHER (Charts)
// ============================================================================

/**
 * Récupérer les données en CSV d'un graphique OWID
 */
async function getChartDataCSV(slug) {
  console.log(`\n📊 Récupération CSV: ${slug}`);
  const url = `https://ourworldindata.org/grapher/${slug}.csv`;

  try {
    const data = await fetch(url);
    console.log(`   ✓ ${data.split('\n').length} lignes`);
    return data;
  } catch (error) {
    console.error(`   ✗ Erreur: ${error.message}`);
    return null;
  }
}

/**
 * Récupérer la configuration JSON d'un graphique
 */
async function getChartConfig(slug) {
  console.log(`\n⚙️  Récupération config: ${slug}`);
  const url = `https://ourworldindata.org/grapher/${slug}.config.json`;

  try {
    const config = await fetch(url);
    console.log(`   ✓ Titre: ${config.title}`);
    console.log(`   ✓ Variables: ${config.dimensions?.length || 0}`);
    console.log(`   ✓ Entités sélectionnées: ${config.selectedEntityNames?.length || 0}`);
    return config;
  } catch (error) {
    console.error(`   ✗ Erreur: ${error.message}`);
    return null;
  }
}

/**
 * Récupérer les métadonnées d'un graphique
 */
async function getChartMetadata(slug) {
  console.log(`\n📝 Récupération métadonnées: ${slug}`);
  const url = `https://ourworldindata.org/grapher/${slug}.metadata.json`;

  try {
    const metadata = await fetch(url);
    console.log(`   ✓ Dimensions: ${metadata.dimensions?.length || 0}`);
    console.log(`   ✓ Sources: ${metadata.sources?.length || 0}`);
    return metadata;
  } catch (error) {
    console.error(`   ✗ Erreur: ${error.message}`);
    return null;
  }
}

// ============================================================================
// 3. API SEARCH (Indicators)
// ============================================================================

/**
 * Chercher des indicateurs par requête texte
 */
async function searchIndicators(query, limit = 5) {
  console.log(`\n🔍 Recherche: "${query}"`);
  const url = `https://search.owid.io/indicators?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    console.log(`   ✓ ${response.results?.length || 0} résultats`);

    // Afficher les premiers résultats
    response.results?.slice(0, limit).forEach((indicator, i) => {
      console.log(`   ${i + 1}. ${indicator.title}`);
      console.log(`      ID: ${indicator.indicator_id}`);
      console.log(`      Score: ${(indicator.score * 100).toFixed(1)}%`);
      if (indicator.metadata?.parquet_url) {
        console.log(`      Data: ${indicator.metadata.parquet_url}`);
      }
    });

    return response.results || [];
  } catch (error) {
    console.error(`   ✗ Erreur: ${error.message}`);
    return [];
  }
}

// ============================================================================
// 4. TRAITEMENT DES DONNÉES
// ============================================================================

/**
 * Extraire les données pour un pays spécifique
 */
function getCountryData(csvData, countryName) {
  const records = parseCSV(csvData);
  return records.filter(r => r.Entity === countryName);
}

/**
 * Extraire les données pour une année spécifique
 */
function getYearData(csvData, year) {
  const records = parseCSV(csvData);
  return records.filter(r => r.Year === year);
}

/**
 * Calculer des statistiques simples
 */
function calculateStats(csvData, valueColumn = 'Life expectancy') {
  const records = parseCSV(csvData);
  const values = records
    .map(r => parseFloat(r[valueColumn]))
    .filter(v => !isNaN(v));

  if (values.length === 0) return null;

  const sorted = values.sort((a, b) => a - b);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    median: sorted[Math.floor(sorted.length / 2)],
    count: values.length
  };
}

// ============================================================================
// 5. CAS D'USAGE - FINANCES PUBLIQUES
// ============================================================================

/**
 * Pipeline: Chercher une donnée sur les finances publiques
 */
async function financesPubliquesPipeline() {
  console.log('\n' + '='.repeat(70));
  console.log('📊 PIPELINE: Finances Publiques Françaises');
  console.log('='.repeat(70));

  // 1. Chercher les indicateurs pertinents
  console.log('\n[Étape 1] Chercher les indicateurs...');
  const queries = [
    'government expenditure',
    'public debt',
    'government revenue',
    'tax rate'
  ];

  for (const query of queries) {
    const results = await searchIndicators(query, 2);

    if (results.length > 0 && results[0].metadata?.parquet_url) {
      console.log(`   → ${query}: ${results[0].title}`);
      console.log(`     ${results[0].metadata.parquet_url}`);
    }
  }

  // 2. Chercher les graphiques OWID existants
  console.log('\n[Étape 2] Chercher les graphiques OWID existants...');
  const commonCharts = [
    'government-spending',
    'government-expenditure',
    'public-debt',
    'tax-revenue'
  ];

  for (const slug of commonCharts) {
    try {
      const url = `https://ourworldindata.org/grapher/${slug}.config.json`;
      const response = await fetch(url);
      console.log(`   ✓ ${slug}`);
    } catch (e) {
      console.log(`   ✗ ${slug} (non trouvé)`);
    }
  }

  // 3. Exemple: Récupérer les données de life expectancy comme exemple
  console.log('\n[Étape 3] Exemple avec "life-expectancy" (comme modèle)...');

  const csvData = await getChartDataCSV('life-expectancy');
  if (csvData) {
    const franceData = getCountryData(csvData, 'France');
    console.log(`   Espérance de vie en France (dernières 5 années):`);
    franceData.slice(-5).forEach(record => {
      console.log(`   ${record.Year}: ${record['Life expectancy']} ans`);
    });
  }

  // 4. Statistiques
  console.log('\n[Étape 4] Statistiques globales...');
  if (csvData) {
    const stats = calculateStats(csvData, 'Life expectancy');
    console.log(`   Min: ${stats.min.toFixed(1)}`);
    console.log(`   Max: ${stats.max.toFixed(1)}`);
    console.log(`   Moyenne: ${stats.mean.toFixed(1)}`);
    console.log(`   Données disponibles: ${stats.count}`);
  }
}

// ============================================================================
// 6. TESTS RAPIDES
// ============================================================================

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TESTS DES ENDPOINTS OWID');
  console.log('='.repeat(70));

  // Test 1: Graphique life-expectancy
  console.log('\n✓ Test 1: life-expectancy');
  const csv = await getChartDataCSV('life-expectancy');
  const config = await getChartConfig('life-expectancy');
  const metadata = await getChartMetadata('life-expectancy');

  // Test 2: Recherche
  console.log('\n✓ Test 2: Search - "inflation"');
  await searchIndicators('inflation', 3);

  console.log('\n✓ Test 3: Search - "unemployment"');
  await searchIndicators('unemployment', 3);

  console.log('\n✓ Test 4: Search - "debt"');
  await searchIndicators('debt', 3);

  // Test 3: Extraction pays
  if (csv) {
    console.log('\n✓ Test 5: Extraction - France');
    const franceData = getCountryData(csv, 'France');
    console.log(`   ${franceData.length} enregistrements pour la France`);
    console.log(`   Depuis ${franceData[0]?.Year} à ${franceData[franceData.length - 1]?.Year}`);
  }

  console.log('\n✓ Tous les tests sont terminés!');
}

// ============================================================================
// 7. CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Exemples d'utilisation de l'API Our World in Data

Usage:
  node owid-api-examples.js --chart=SLUG          Récupérer les données d'un graphique
  node owid-api-examples.js --search=QUERY        Chercher des indicateurs
  node owid-api-examples.js --finance             Pipeline finances publiques
  node owid-api-examples.js --test                Lancer les tests

Exemples:
  node owid-api-examples.js --chart=life-expectancy
  node owid-api-examples.js --search="government spending"
  node owid-api-examples.js --finance
  node owid-api-examples.js --test
    `);
    return;
  }

  const arg = args[0];

  if (arg.startsWith('--chart=')) {
    const slug = arg.split('=')[1];
    const csv = await getChartDataCSV(slug);
    const config = await getChartConfig(slug);
    const metadata = await getChartMetadata(slug);
  } else if (arg.startsWith('--search=')) {
    const query = arg.split('=')[1];
    await searchIndicators(query, 10);
  } else if (arg === '--finance') {
    await financesPubliquesPipeline();
  } else if (arg === '--test') {
    await runTests();
  } else {
    console.error(`Option inconnue: ${arg}`);
  }
}

main().catch(console.error);

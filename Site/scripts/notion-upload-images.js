#!/usr/bin/env node
/**
 * Upload toutes les images (Instagram, TikTok V, TikTok H) vers Notion "Liste des infographies"
 *
 * 1. Upload chaque PNG vers catbox.moe (hébergement gratuit permanent)
 * 2. Met à jour les propriétés "Instagram", "TikTok V", "TikTok H" dans Notion
 *
 * Usage: node scripts/notion-upload-images.js [--format=instagram|tiktok-v|tiktok-h|all]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── Config ──
const _fileConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'notion-config.json'), 'utf8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const NOTION_SECRET = config.NOTION_SECRET;
const DB_ID = '6cd320f7-9016-4fef-807d-9b87c2f76568'; // Liste des infographies

const BASE_DIR = path.join(__dirname, '../../Production interne/Réseaux Sociaux /Infographies');

const DIRS = {
  instagram: path.join(BASE_DIR, 'Insta & Autres'),
  'tiktok-v': path.join(BASE_DIR, 'Tiktok Vertical'),
  'tiktok-h': path.join(BASE_DIR, 'Tiktok Horizontal'),
};

const NOTION_PROPS = {
  instagram: 'Instagram',
  'tiktok-v': 'TikTok V',
  'tiktok-h': 'TikTok H',
};

// ── Mapping : base slug → numéro Notion ──
// Le slug est la partie commune (ex: "14-explosion-dette-france")
const SLUG_TO_NUM = {
  '14-explosion-dette-france': 1,
  '12-dette-publique-europe': 2,
  '13-deficit-zone-euro': 3,
  '51-dette-48800-par-habitant': 7,
  '22-charge-interets-dette': 8,
  '53-dette-58md-interets': 9,
  '21-detenteurs-dette-france': 10,
  '23-triple-degradation-notes': 11,
  '109-france-championne-depenses-sociales-europe': 19,
  '46-qui-nourrit-etat': 27,
  '16-retraites-explosion-2070': 28,
  '19-capitalisation-vs-repartition': 33,
  '17-vieillissement-mondial-2070': 37,
  '31-actifs-fonds-pension-monde': 38,
  '47-fiche-de-paie-decomposition': 51,
  '49-simulation-300k-brut-net': 55,
  '129-mix-energetique-france-2030': 61,
  '11-salaire-moyen-par-pays': 65,
  '43-mercure-guyane': 73,
  '01-france-pologne-comparaison': 75,
  '09-prix-cigarette-france': 80,
  '10-indice-big-mac': 81,
  '120-dette-france-interets-croissants': 8, // doublon thématique avec 22
  '02-pologne-rattrapage-courbes': 75, // même thème que 01
  // Hors liste originale (ajoutés en 90-100)
  '06-salaires-suisse': 90,
  '07-top5-pays-peuples': 91,
  '15-hotels-plus-chers-paris': 92,
  '35-ue-dependance-terres-rares': 93,
  '44-guyana-pib-62pct': 94,
  '47bis-fiche-de-paie-simple': 95,
  '48-cout-total-salarie-europe': 96,
  '48-dette-titre-couverture': 97,
  '49-dette-3305-milliards': 98,
  '66-dette-us-interets-vs-pentagone': 99,
  '115-classement-depenses-sociales-europe-top5': 100,
  '52-dette-53pct-etrangers': 10, // même thème que 21
};

// Suffixes par format pour reconstituer le nom de fichier
const SUFFIXES = {
  instagram: '-instagram.png',
  'tiktok-v': '-tiktok-v.png',
  'tiktok-h': '-tiktok-h.png',
};

// Exceptions : fichiers dont le nom ne suit pas le pattern standard
const FILENAME_OVERRIDES = {
  instagram: {
    '49-simulation-300k-brut-net': '49-simulation-300k-brut-net.png',
    '47bis-fiche-de-paie-simple': '47bis-fiche-de-paie-simple-insta.png',
  },
};

// ── Helpers ──
function uploadToCatbox(filePath) {
  try {
    const result = execSync(
      `curl -s -F "reqtype=fileupload" -F "fileToUpload=@${filePath}" https://catbox.moe/user/api.php`,
      { timeout: 30000 }
    ).toString().trim();
    if (result.startsWith('https://')) return result;
    console.error(`  ✗ Upload échoué: ${result}`);
    return null;
  } catch (e) {
    console.error(`  ✗ Upload erreur: ${e.message}`);
    return null;
  }
}

function getPageIdByNum(num) {
  try {
    const result = execSync(`curl -s -X POST "https://api.notion.com/v1/databases/${DB_ID}/query" \
      -H "Authorization: Bearer ${NOTION_SECRET}" \
      -H "Notion-Version: 2022-06-28" \
      -H "Content-Type: application/json" \
      -d '{"filter":{"property":"N°","number":{"equals":${num}}}}'`,
      { timeout: 10000 }
    ).toString();
    const data = JSON.parse(result);
    return data.results?.[0]?.id || null;
  } catch (e) {
    return null;
  }
}

function updateNotionImage(pageId, propName, fileName, imageUrl) {
  try {
    const payload = JSON.stringify({
      properties: {
        [propName]: {
          files: [{
            type: 'external',
            name: fileName,
            external: { url: imageUrl }
          }]
        }
      }
    });
    execSync(`curl -s -X PATCH "https://api.notion.com/v1/pages/${pageId}" \
      -H "Authorization: Bearer ${NOTION_SECRET}" \
      -H "Notion-Version: 2022-06-28" \
      -H "Content-Type: application/json" \
      -d '${payload.replace(/'/g, "'\\''")}'`,
      { timeout: 10000 }
    );
    return true;
  } catch (e) {
    console.error(`  ✗ Notion update erreur: ${e.message}`);
    return false;
  }
}

function getFileName(slug, format) {
  // Vérifier les exceptions d'abord
  if (FILENAME_OVERRIDES[format]?.[slug]) return FILENAME_OVERRIDES[format][slug];
  return slug + SUFFIXES[format];
}

// ── Main ──
async function main() {
  // Parse --format argument
  const formatArg = process.argv.find(a => a.startsWith('--format='));
  const requestedFormat = formatArg ? formatArg.split('=')[1] : 'all';
  const formats = requestedFormat === 'all'
    ? ['instagram', 'tiktok-v', 'tiktok-h']
    : [requestedFormat];

  for (const format of formats) {
    if (!DIRS[format]) {
      console.error(`Format inconnu: ${format}`);
      continue;
    }

    const dir = DIRS[format];
    const propName = NOTION_PROPS[format];
    const alreadyDone = new Set();
    const entries = Object.entries(SLUG_TO_NUM);
    let ok = 0, skip = 0, fail = 0;

    console.log(`\n📸 Upload ${format.toUpperCase()} → Notion "${propName}" (${entries.length} entrées)\n`);

    for (const [slug, num] of entries) {
      if (alreadyDone.has(num)) {
        skip++;
        continue;
      }

      const fileName = getFileName(slug, format);
      const filePath = path.join(dir, fileName);

      if (!fs.existsSync(filePath)) {
        // Essayer sans le suffixe standard (certains fichiers ont des noms légèrement différents)
        skip++;
        continue;
      }

      process.stdout.write(`[${ok + fail + 1}] #${num} ${fileName}...`);

      const pageId = getPageIdByNum(num);
      if (!pageId) {
        console.log(' ✗ page Notion introuvable');
        fail++;
        continue;
      }

      const imageUrl = uploadToCatbox(filePath);
      if (!imageUrl) { fail++; console.log(''); continue; }

      const success = updateNotionImage(pageId, propName, fileName, imageUrl);
      if (success) {
        console.log(` ✓`);
        ok++;
      } else {
        fail++;
      }

      alreadyDone.add(num);
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n✅ ${format.toUpperCase()} : ${ok} uploadées, ${skip} ignorées, ${fail} erreurs`);
  }
}

main();

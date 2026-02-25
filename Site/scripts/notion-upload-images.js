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
  instagram: 'Image Instagram',
  'tiktok-v': 'Image TikTok V',
  'tiktok-h': 'Image TikTok H',
};

// ── Mapping : slug fichier → numéro Notion ──
// Depuis la renumérotation, le N° Notion est directement le préfixe du fichier
// Pour les doublons (a/b), on prend le N° sans la lettre
const SLUG_TO_NUM = {
  '01-explosion-dette-france': 1,
  '02-dette-publique-europe': 2,
  '03-deficit-zone-euro': 3,
  '04-deficit-historique-france': 4,
  '05-depenses-publiques-pib-france': 5,
  '06-depenses-vs-recettes-france': 6,
  '07-dette-48800-par-habitant': 7,
  '08a-charge-interets-dette': 8,
  '08b-dette-france-interets-croissants': 8,
  '09-dette-58md-interets': 9,
  '10a-detenteurs-dette-france': 10,
  '10b-dette-53pct-etrangers': 10,
  '11-triple-degradation-notes': 11,
  '19-france-championne-depenses-sociales-europe': 19,
  '27-qui-nourrit-etat': 27,
  '28-retraites-explosion-2070': 28,
  '33-capitalisation-vs-repartition': 33,
  '37-vieillissement-mondial-2070': 37,
  '38-actifs-fonds-pension-monde': 38,
  '51-fiche-de-paie-decomposition': 51,
  '55-simulation-300k-brut-net': 55,
  '61-mix-energetique-france-2030': 61,
  '65-salaire-moyen-par-pays': 65,
  '73-mercure-guyane': 73,
  '75a-france-pologne-comparaison': 75,
  '75b-pologne-rattrapage-courbes': 75,
  '80-prix-cigarette-france': 80,
  '81-indice-big-mac': 81,
  '90-salaires-suisse': 90,
  '91-top5-pays-peuples': 91,
  '92-hotels-plus-chers-paris': 92,
  '93-ue-dependance-terres-rares': 93,
  '94-guyana-pib-62pct': 94,
  '95-fiche-de-paie-simple': 95,
  '96-cout-total-salarie-europe': 96,
  '97-dette-titre-couverture': 97,
  '98-dette-3305-milliards': 98,
  '99-dette-us-interets-vs-pentagone': 99,
  '100-classement-depenses-sociales-europe-top5': 100,
  '101-etat-gaspille-votre-argent': 101,
  '102-sortir-france-enfer-fiscal': 102,
  '103-france-enfer-fiscal-question': 103,
  '104-pas-de-retraite': 104,
  '105-etat-francais-faillite': 105,
  '106-ou-va-largent': 106,
  '107-ouvalargent-com': 107,
  '108-logo-euro': 108,
  '109-abonne-toi': 109,
  '110-partage-ami-socialiste': 110,
  '111-partage-ami-chiffres': 111,
  '112-article-15-ddhc': 112,
  '113-dette-naissance-bebe': 113,
  '114-dette-5350-par-seconde': 114,
  '115-dette-pile-billets-terre': 115,
  '116-cout-eleve-recul-maths': 116,
  '117-medicaments-36-milliards': 117,
  '118-subvention-sncf-300-euros': 118,
  '119-audiovisuel-public-4-milliards': 119,
  '120-communes-plus-que-ue': 120,
  '121-82-jours-travail-impots': 121,
  '122-salaire-suisse-double': 122,
  '123-ratio-actifs-retraites': 123,
  '124-taxe-fonciere-paris-52': 124,
  '125-48-boites-medicaments': 125,
  '126-code-travail-3500-pages': 126,
  '127-intermittents-2-milliards': 127,
  '128-1500-aides-sociales': 128,
  '129-singapour-france-1960': 129,
  '130-interets-58-milliards': 130,
  '131-taxes-essence-60-centimes': 131,
  '132-droits-succession-45-pourcent': 132,
  '133-fonctionnaires-5-8-millions': 133,
  '134-dernier-budget-equilibre-1974': 134,
  '135-france-2eme-plus-taxe': 135,
  '136-retraite-64-vs-67-allemagne': 136,
  '137-budget-culture-15-milliards': 137,
  '138-44-pourcent-pas-impot-revenu': 138,
  '139-lits-hopitaux-supprimes': 139,
  '140-impot-societes-france-irlande': 140,
  '141-400000-normes-france': 141,
  '142-deficit-169-milliards-2024': 142,
  '143-prefets-heritage-napoleonien': 143,
  '144-dette-multipliee-par-4': 144,
  '145-38-milliards-logement-loyers': 145,
  '146-9-milliards-dette-edf': 146,
  '147-60-pourcent-etudiants-echec': 147,
  '148-deputes-cumul-mandats': 148,
  '149-desert-medical-30-pourcent': 149,
  '150-attente-urgences-3-heures': 150,
  '151-dette-42-iphones': 151,
  '152-dette-55-pourcent-etrangers': 152,
  '153-industrie-moins-40-pourcent': 153,
  '154-463-millions-dette-par-jour': 154,
  '155-520000-elus-locaux-record': 155,
  '156-code-travail-chomage-correlation': 156,
  '157-fraude-100-milliards': 157,
  '158-tgv-retard-subventions': 158,
  '159-eleves-faibles-maths-budget': 159,
  '160-depenses-sante-3700-par-habitant': 160,
  '161-tva-cercueil-20-pourcent': 161,
  '162-dette-117-pib-double-limite': 162,
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
    '55-simulation-300k-brut-net': '55-simulation-300k-brut-net.png',
    '95-fiche-de-paie-simple': '95-fiche-de-paie-simple-insta.png',
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

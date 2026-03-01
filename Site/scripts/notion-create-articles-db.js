#!/usr/bin/env node
/**
 * Crée la base Notion "Articles News" pour le pipeline journaliste
 *
 * Usage: cd Site && node scripts/notion-create-articles-db.js
 *
 * Met à jour automatiquement notion-config.json avec les IDs.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const configPath = path.join(__dirname, 'notion-config.json');
const _fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const NOTION_SECRET = config.NOTION_SECRET;
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

console.log('📰 Création de la base Notion "Articles News"...\n');

const dbResponse = notionApi('databases', 'POST', {
  parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
  icon: { type: 'emoji', emoji: '📰' },
  title: [{ type: 'text', text: { content: 'Articles News' } }],
  properties: {
    'Titre': { title: {} },
    'Slug': { rich_text: {} },
    'Type': {
      select: {
        options: [
          { name: 'News', color: 'blue' },
          { name: 'Analyse', color: 'purple' },
        ]
      }
    },
    'Categorie': {
      select: {
        options: [
          { name: 'Finances publiques', color: 'blue' },
          { name: 'Macro-éco', color: 'yellow' },
          { name: 'Investissement', color: 'green' },
          { name: 'Actu éco', color: 'orange' },
          { name: 'International', color: 'purple' },
          { name: 'Finance perso', color: 'red' },
        ]
      }
    },
    'Date': { date: {} },
    'Statut': {
      select: {
        options: [
          { name: 'Brouillon', color: 'gray' },
          { name: 'En validation', color: 'yellow' },
          { name: 'Validé', color: 'green' },
          { name: 'Publié', color: 'blue' },
          { name: 'Rejeté', color: 'red' },
        ]
      }
    },
    'Contenu': { rich_text: {} },
    'Chapeau': { rich_text: {} },
    'Sources': { rich_text: {} },
    'Source URL': { url: {} },
    'Image Hero': { files: {} },
    'LinkedIn': { rich_text: {} },
    'Facebook': { rich_text: {} },
    'Tags': { multi_select: {} },
    'Temps lecture': { number: {} },
    'Fact-check': { checkbox: {} },
    'Telegram Msg ID': { number: {} },
  }
});

if (dbResponse.object === 'error') {
  console.error('❌ Erreur création DB:', dbResponse.message);
  process.exit(1);
}

const DB_ID = dbResponse.id;
console.log(`✅ Base créée : ${DB_ID}`);
console.log(`🔗 https://www.notion.so/${DB_ID.replace(/-/g, '')}`);

// Update notion-config.json
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
configData.ARTICLES_DB_ID = DB_ID;
fs.writeFileSync(configPath, JSON.stringify(configData, null, 2) + '\n');
console.log(`\n📝 notion-config.json mis à jour (ARTICLES_DB_ID = ${DB_ID})`);

// Now get the data source ID
console.log('\n🔍 Récupération du Data Source ID...');
const dsResponse = notionApi(`databases/${DB_ID}`, 'GET');
const dsId = dsResponse.data_source?.id;
if (dsId) {
  configData.ARTICLES_DS_ID = dsId;
  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2) + '\n');
  console.log(`✅ ARTICLES_DS_ID = ${dsId}`);
} else {
  console.log('⚠ Data Source ID non trouvé — à récupérer manuellement plus tard');
  console.log('  (Il faut parfois attendre quelques secondes après la création)');
}

console.log('\n🎉 Terminé ! La base "Articles News" est prête.');
console.log('   → Ajoutez ARTICLES_DB_ID et ARTICLES_DS_ID à vos variables d\'environnement (~/.zshrc)');

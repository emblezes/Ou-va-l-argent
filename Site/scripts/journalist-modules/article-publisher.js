/**
 * Module de publication d'articles
 *
 * Pont entre la base "Articles News" et le "Calendrier Publications" existant.
 * Quand un article passe en "Validé", crée une entrée dans le calendrier
 * pour que le workflow n8n publie sur LinkedIn/Facebook.
 */

const path = require('path');
const { loadConfig, SCRIPTS_DIR } = require('./shared-utils');

async function publishValidatedArticles(dryRun = false) {
  const config = loadConfig();
  const articlesDbId = config.ARTICLES_DB_ID;

  if (!articlesDbId) {
    console.error('  ⚠ ARTICLES_DB_ID non configuré dans notion-config.json');
    return [];
  }

  const notionSecret = process.env.NOTION_SECRET || config.NOTION_SECRET;

  // Fetch validated articles from Notion
  const res = await fetch(`https://api.notion.com/v1/databases/${articlesDbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notionSecret}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      filter: {
        property: 'Statut',
        select: { equals: 'Validé' }
      }
    })
  });

  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    console.log('  ℹ Aucun article validé à publier');
    return [];
  }

  const { addPost } = require(path.join(SCRIPTS_DIR, 'notion-add-post'));
  const published = [];

  for (const page of data.results) {
    const props = page.properties;
    const titre = props['Titre']?.title?.[0]?.plain_text || '';
    const slug = props['Slug']?.rich_text?.[0]?.plain_text || '';
    const type = props['Type']?.select?.name || 'News';
    const categorie = props['Categorie']?.select?.name || 'Actu éco';
    const linkedin = props['LinkedIn']?.rich_text?.[0]?.plain_text || '';
    const facebook = props['Facebook']?.rich_text?.[0]?.plain_text || '';
    const source = props['Sources']?.rich_text?.[0]?.plain_text || '';

    const articleUrl = `https://ouvalargent.com/news/${slug}`;

    // Add article URL to social posts
    const linkedinWithUrl = linkedin.includes('ouvalargent.com') ? linkedin : `${linkedin}\n\n${articleUrl}`;
    const facebookWithUrl = facebook.includes('ouvalargent.com') ? facebook : `${facebook}\n\n${articleUrl}`;

    console.log(`  📰 Publication : ${titre}`);

    if (!dryRun) {
      try {
        // Create entry in Publications calendar
        const result = addPost({
          titre: `[Article] ${titre}`,
          date: new Date().toISOString().split('T')[0],
          theme: mapCategorie(categorie),
          type: type === 'Analyse' ? 'Stat choc' : 'Stat choc',
          statut: 'Pret',
          linkedin: linkedinWithUrl.substring(0, 2000),
          facebook: facebookWithUrl.substring(0, 2000),
          source: source
        });

        // Update article status to "Publié"
        await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${notionSecret}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          },
          body: JSON.stringify({
            properties: {
              'Statut': { select: { name: 'Publié' } }
            }
          })
        });

        published.push(titre);
        await new Promise(r => setTimeout(r, 500)); // Rate limiting
      } catch (e) {
        console.error(`  ⚠ Erreur publication ${titre}:`, e.message);
      }
    } else {
      published.push(titre);
    }
  }

  return published;
}

function mapCategorie(cat) {
  const map = {
    'Finances publiques': 'Finances publiques',
    'Macro-éco': 'Macro-economie',
    'Investissement': 'Investissement',
    'Actu éco': 'Actualite eco',
    'International': 'International',
    'Finance perso': 'Finance perso'
  };
  return map[cat] || 'Actualite eco';
}

module.exports = { publishValidatedArticles };

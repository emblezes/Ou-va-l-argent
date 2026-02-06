const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Charger la configuration
const configPath = path.join(__dirname, 'notion-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

/**
 * Ajoute une publication au calendrier Notion
 * @param {Object} post - Les données de la publication
 */
function addPost(post) {
  const properties = {
    'Name': {
      title: [{ text: { content: post.titre || post.name || 'Sans titre' } }]
    }
  };

  if (post.date) {
    properties['Date'] = { date: { start: post.date } };
  }

  if (post.theme) {
    properties['Theme'] = { select: { name: post.theme } };
  }

  if (post.type) {
    properties['Type'] = { select: { name: post.type } };
  }

  if (post.statut) {
    properties['Statut'] = { select: { name: post.statut } };
  }

  if (post.reel !== undefined) {
    properties['Reel'] = { checkbox: post.reel };
  }

  if (post.linkedin) {
    properties['LinkedIn'] = {
      rich_text: [{ text: { content: post.linkedin.substring(0, 2000) } }]
    };
  }

  if (post.twitter) {
    properties['Twitter'] = {
      rich_text: [{ text: { content: post.twitter.substring(0, 280) } }]
    };
  }

  if (post.instagram) {
    properties['Instagram'] = {
      rich_text: [{ text: { content: post.instagram.substring(0, 2000) } }]
    };
  }

  if (post.facebook) {
    properties['Facebook'] = {
      rich_text: [{ text: { content: post.facebook.substring(0, 2000) } }]
    };
  }

  if (post.source) {
    properties['Source'] = {
      rich_text: [{ text: { content: post.source } }]
    };
  }

  if (post.briefReel) {
    properties['Brief_Reel'] = {
      rich_text: [{ text: { content: post.briefReel.substring(0, 2000) } }]
    };
  }

  const payload = {
    parent: { database_id: config.DATABASE_ID },
    properties: properties
  };

  const payloadJson = JSON.stringify(payload).replace(/'/g, "'\\''");

  try {
    const result = execSync(`curl -s -X POST "https://api.notion.com/v1/pages" \
      -H "Authorization: Bearer ${config.NOTION_SECRET}" \
      -H "Content-Type: application/json" \
      -H "Notion-Version: 2022-06-28" \
      -d '${payloadJson}'`, { encoding: 'utf8' });

    const response = JSON.parse(result);

    if (response.object === 'error') {
      console.error(`❌ Erreur: ${response.message}`);
      return null;
    }

    console.log(`✅ "${post.titre || post.name}" ajouté`);
    console.log(`   URL: ${response.url}`);
    return response;

  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    return null;
  }
}

/**
 * Ajoute plusieurs publications
 * @param {Array} posts - Liste des publications
 */
function addMultiplePosts(posts) {
  console.log(`\n📅 Ajout de ${posts.length} publications...\n`);

  const results = [];
  for (const post of posts) {
    const result = addPost(post);
    results.push(result);
  }

  const success = results.filter(r => r !== null).length;
  console.log(`\n✅ ${success}/${posts.length} publications ajoutées`);
  return results;
}

// Export pour utilisation dans d'autres scripts
module.exports = { addPost, addMultiplePosts, config };

// Si exécuté directement
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node notion-add-post.js --test');
    console.log('  node notion-add-post.js \'{"titre": "...", "date": "2025-02-10", ...}\'');
    process.exit(0);
  }

  if (args[0] === '--test') {
    addPost({
      titre: 'Test API - Inflation 2024',
      date: '2025-02-11',
      theme: 'Investissement',
      type: 'Stat choc',
      statut: 'Idee',
      reel: false,
      linkedin: 'L\'inflation en France a atteint X% en 2024...',
      twitter: '📈 Inflation France 2024: X%\n\nouvalargent.fr',
      instagram: '📈 Inflation 2024\n\n#inflation #france #economie',
      source: 'INSEE 2024'
    });
  } else {
    try {
      const post = JSON.parse(args[0]);
      addPost(post);
    } catch (e) {
      console.error('❌ JSON invalide:', e.message);
    }
  }
}

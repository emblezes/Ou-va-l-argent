/**
 * Module de rédaction d'articles Analyse
 *
 * Génère des articles longs (1000-2000 mots) à partir
 * d'infographies existantes. Enrichit avec contexte historique,
 * comparaisons internationales et implications citoyennes.
 */

const fs = require('fs');
const path = require('path');
const { askClaude, slugify, BASE } = require('./shared-utils');

const SONNET_MODEL = 'claude-sonnet-4-20250514';
const SOURCES_HTML_DIR = path.join(BASE, 'Production interne/Réseaux Sociaux /Infographies/Sources HTML');

async function writeAnalysis(infraSlug) {
  // Find the HTML source file
  const htmlPath = path.join(SOURCES_HTML_DIR, infraSlug + '.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Infographie non trouvée : ${htmlPath}`);
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  // Extract key info from HTML
  const titleMatch = htmlContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
                     htmlContent.match(/class="title[^"]*"[^>]*>([\s\S]*?)<\//i);
  const sourceMatch = htmlContent.match(/class="source[^"]*"[^>]*>([\s\S]*?)<\//i);

  const infraTitle = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : infraSlug;
  const infraSource = sourceMatch ? sourceMatch[1].replace(/<[^>]*>/g, '').trim() : '';

  const prompt = `Tu es un journaliste économique français expert, spécialisé en finances publiques. Tu écris pour le média "Où Va l'Argent" (ouvalargent.com).

INFOGRAPHIE À ANALYSER :
Titre : ${infraTitle}
Source : ${infraSource}
Slug : ${infraSlug}

CONTENU HTML DE L'INFOGRAPHIE (extrais les données clés) :
${htmlContent.slice(0, 6000)}

CONSIGNES :
1. Rédige un article LONG (1000-2000 mots) d'analyse approfondie
2. Va AU-DELÀ des données de l'infographie : contexte historique, comparaisons internationales
3. Explique les implications concrètes pour les citoyens français
4. Chaque affirmation doit être sourcée ou clairement présentée comme analyse

TONALITÉ ÉDITORIALE (TRÈS IMPORTANT) :
- Angle LIBÉRAL assumé : valorise la responsabilité individuelle, la maîtrise des dépenses publiques, la liberté économique
- Ton PUNCHY et percutant : phrases courtes, chiffres chocs, formulations qui interpellent
- N'hésite pas à pointer les absurdités bureaucratiques, les gabegies, le poids excessif de la fiscalité
- Utilise des comparaisons parlantes ("c'est X par Français", "assez pour financer Y")
- Humain et direct : parle comme à un ami intelligent, pas comme un technocrate
- Pose des questions rhétoriques qui font réfléchir le lecteur
- Reste factuel et sourcé — les chiffres parlent d'eux-mêmes

STRUCTURE :
1. Hook — Accroche percutante liée au chiffre clé de l'infographie
2. Contexte historique — Comment on en est arrivé là
3. Les chiffres — Données de l'infographie + données complémentaires
4. Comparaisons internationales — Où se situe la France
5. Implications — Ce que ça signifie pour les citoyens
6. Perspective — Tendances et projections
7. Sources

FORMAT : markdown (## pour sous-titres, **gras** pour chiffres clés)

Réponds UNIQUEMENT en JSON valide :
{
  "titre": "Titre accrocheur (60-80 chars)",
  "chapeau": "Phrase d'accroche (150-200 chars)",
  "contenu": "Contenu markdown complet (1000-2000 mots)",
  "sources": "Sources citées",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "meta_description": "Description SEO (150-160 chars)",
  "linkedin": "Post LinkedIn (300-500 mots, ton expert, avec lien article)",
  "facebook": "Post Facebook (200-300 mots, ton engageant, avec lien)",
  "categorie": "Une parmi : Finances publiques, Macro-éco, Investissement, Actu éco, International, Finance perso"
}`;

  const raw = await askClaude(prompt, SONNET_MODEL, 6000);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Claude n\'a pas retourné de JSON valide pour l\'analyse');
  }

  const article = JSON.parse(jsonMatch[0]);
  article.slug = slugify(article.titre);
  article.temps_lecture = Math.max(4, Math.ceil(article.contenu.split(/\s+/).length / 200));
  article.source_url = '';
  article.type = 'Analyse';
  article.infographie_slug = infraSlug;

  return article;
}

function listAvailableInfographies() {
  if (!fs.existsSync(SOURCES_HTML_DIR)) return [];
  return fs.readdirSync(SOURCES_HTML_DIR)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''))
    .sort();
}

module.exports = { writeAnalysis, listAvailableInfographies };

/**
 * Module de rédaction d'articles News
 *
 * Utilise Claude Sonnet pour rédiger des articles économiques
 * à partir d'un sujet RSS sélectionné par le pipeline.
 *
 * Sortie JSON : { titre, slug, chapeau, contenu, sources, tags,
 *                 linkedin, facebook, meta_description, temps_lecture }
 */

const { askClaude, slugify } = require('./shared-utils');

const SONNET_MODEL = 'claude-sonnet-4-20250514';

async function writeArticle(topic) {
  const { title, description, link, source } = topic;

  const prompt = `Tu es un journaliste économique français spécialisé en finances publiques et macro-économie. Tu écris pour le média "Où Va l'Argent" (ouvalargent.com).

SUJET À TRAITER :
- Titre source : ${title}
- Description : ${description}
- Source : ${source}
- URL source : ${link}

CONSIGNES STRICTES :
1. REFORMULE entièrement — ne copie JAMAIS le texte source
2. Chaque chiffre doit être sourcé
3. Ramène toujours à l'impact concret sur les Français

TONALITÉ ÉDITORIALE (TRÈS IMPORTANT) :
- Angle LIBÉRAL assumé : valorise l'initiative privée, la responsabilité individuelle, la maîtrise des dépenses publiques, la baisse de la pression fiscale
- Ton PUNCHY et percutant : phrases courtes, chiffres chocs, formulations qui interpellent
- Quand l'État dépense trop, dis-le clairement. Quand les impôts augmentent, montre l'impact réel sur le portefeuille des gens
- Reste factuel et sourcé, mais n'hésite pas à pointer les absurdités bureaucratiques ou les gabegies
- Utilise des comparaisons parlantes (ex: "c'est l'équivalent de X par Français", "assez pour financer Y")
- Humain et direct : parle comme à un ami intelligent, pas comme un technocrate
- Évite le jargon inutile, préfère les mots simples et percutants
- Pose des questions rhétoriques qui font réfléchir le lecteur

STRUCTURE DE L'ARTICLE (500-800 mots) :
1. Hook (1-2 phrases) — Accroche choc avec le chiffre clé
2. Contexte (1-2 paragraphes) — De quoi parle-t-on, pourquoi maintenant
3. Analyse (2-3 paragraphes) — Les données, comparaisons, évolutions
4. Perspective (1 paragraphe) — Ce que ça change concrètement
5. Sources — Citations des sources

FORMAT DU CONTENU :
- Utilise du markdown simple : ## pour les sous-titres, **gras** pour les chiffres clés, > pour les citations
- Pas de titre H1 (le titre est séparé)

Réponds UNIQUEMENT en JSON valide (pas de markdown autour) :
{
  "titre": "Titre accrocheur (60-80 chars)",
  "chapeau": "Phrase d'accroche résumant l'article (150-200 chars)",
  "contenu": "Le contenu markdown complet de l'article",
  "sources": "Source 1 · Source 2",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "meta_description": "Description SEO (150-160 chars)",
  "linkedin": "Le chapeau suivi du lien de l'article (texte identique au chapeau)",
  "facebook": "Le chapeau suivi du lien de l'article (texte identique au chapeau)",
  "categorie": "Une parmi : Finances publiques, Macro-éco, Investissement, Actu éco, International, Finance perso, Écologie, Culture, Impôts, Emploi, Immobilier, Santé, Éducation, Défense, Retraites, Social"
}`;

  const raw = await askClaude(prompt, SONNET_MODEL, 4000);

  // Extract JSON
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Claude n\'a pas retourné de JSON valide');
  }

  const article = JSON.parse(jsonMatch[0]);

  // Compute slug and reading time
  article.slug = slugify(article.titre);
  article.temps_lecture = Math.max(2, Math.ceil(article.contenu.split(/\s+/).length / 200));
  article.source_url = link;
  article.type = 'News';

  return article;
}

module.exports = { writeArticle };

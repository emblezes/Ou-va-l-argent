/**
 * captions.js — génère le texte d'accompagnement d'une stat choc OVLA (Haiku).
 */
const { askClaude, stripBig } = require('./util');

async function captionForStat(stat) {
  const prompt = `Média "Où Va l'Argent" (économie, pro-business, libéral).
Écris un texte d'accompagnement prêt à publier (réseaux sociaux) pour ce visuel :
- Énoncé : "${stat.headline}"
- Chiffre clé : "${stripBig(stat.reveal)}"
- Source : ${stat.source}

Contraintes : 3 à 5 phrases, pédagogique et direct, explique POURQUOI ça compte (angle libéral : excès d'État / d'impôt / de dépense, ou réussite entrepreneuriale), au moins un chiffre, finit par 3-4 hashtags pertinents. Pas de langue de bois.
Réponds par le texte seul (pas de guillemets, pas de titre).`;
  try {
    return (await askClaude(prompt, 'claude-haiku-4-5-20251001', 600)).trim();
  } catch {
    return `${stripBig(stat.headline)} ${stripBig(stat.reveal)} (${stat.source}).`;
  }
}

module.exports = { captionForStat };

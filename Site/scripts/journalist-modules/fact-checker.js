/**
 * Module de fact-checking automatisé
 *
 * Utilise Claude Haiku pour vérifier la cohérence
 * entre un article rédigé et sa source originale.
 *
 * Verdict : PASS ou NEEDS_REVIEW + points flaggés
 */

const { askClaude } = require('./shared-utils');

async function factCheck(article, sourceText) {
  const prompt = `Tu es un fact-checker rigoureux. Vérifie la cohérence entre cet article et sa source.

ARTICLE RÉDIGÉ :
Titre : ${article.titre}
${article.contenu}

SOURCE ORIGINALE :
${sourceText || article.sources || '(source non disponible — vérifie uniquement la cohérence interne)'}

VÉRIFIE :
1. Les chiffres cités dans l'article sont-ils cohérents avec la source ?
2. Y a-t-il des affirmations non étayées ?
3. Le contexte est-il fidèle à la source ?
4. Les ordres de grandeur sont-ils plausibles ?

Réponds UNIQUEMENT en JSON valide :
{
  "verdict": "PASS" ou "NEEDS_REVIEW",
  "score": 0-100,
  "claims": [
    {
      "claim": "Le chiffre ou l'affirmation vérifiée",
      "status": "OK" ou "WARNING" ou "ERROR",
      "note": "Explication courte"
    }
  ],
  "summary": "Résumé en 1-2 phrases du verdict"
}`;

  const raw = await askClaude(prompt, 'claude-haiku-4-5-20251001', 2000);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      verdict: 'NEEDS_REVIEW',
      score: 0,
      claims: [],
      summary: 'Impossible de vérifier automatiquement'
    };
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      verdict: 'NEEDS_REVIEW',
      score: 0,
      claims: [],
      summary: 'Erreur de parsing du fact-check'
    };
  }
}

module.exports = { factCheck };

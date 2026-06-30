/**
 * select.js — Claude Sonnet sélectionne N actus RSS et rédige les cartes actu-short.
 */
const { askClaude, fixTypography } = require('./util');

async function selectActus(articles, count) {
  if (!articles.length || count <= 0) return [];
  const list = articles.slice(0, 30)
    .map((a, i) => `[${i + 1}] ${a.source} | ${a.title}\n${(a.description || '').slice(0, 200)}\n${a.link}`)
    .join('\n\n');

  const prompt = `Tu es rédacteur pour "Où Va l'Argent" (OVLA), média éco français pro-business / libéral.
À partir des actualités économiques des dernières 24h ci-dessous, sélectionne les ${count} PLUS FORTES (un chiffre net, un fait concret).
PRIORISE nos angles : fiscalité, impôts, dépense publique, dette, déficit, pouvoir d'achat, réussite d'entreprises françaises, comparaisons internationales. Évite le pur cours de bourse répétitif.

Pour CHAQUE actu retenue, rédige une "carte" au format actu-short FACTUEL (style dépêche, JAMAIS militant) :
- "slug": identifiant court kebab-case (sans accents)
- "headline": l'énoncé du fait, en BLANC. Factuel et sobre, <= 58 caractères, SANS le chiffre dominant.
- "reveal": la punchline avec LE chiffre dominant entre <big>...</big>, <= 45 caractères. UN SEUL chiffre.
- "source": "Organisme ou Média, date courte"
- "caption": texte d'accompagnement prêt à publier, 3 à 5 phrases, pédagogique, chiffré, ton direct (pas de langue de bois), finit par 3-4 hashtags.
- "photo": 2-3 mots-clés ANGLAIS pour une photo Pexels d'illustration concrète (usine, bureau, argent, supermarché, port...). PAS de personne nommée, PAS de graphique.
- "theme": thème court (Impôts, Dette, Dépense publique, Pouvoir d'achat, Emploi, Bourse, International, Entreprises...)

RÈGLES STRICTES : headline et reveal tiennent chacun en 2 lignes max (donc courts). Un seul <big> par carte, dans reveal. Chiffres EXACTS repris de la source. Le ton du visuel reste factuel ; l'angle libéral est seulement dans le CHOIX du sujet.
Réponds UNIQUEMENT par un tableau JSON de ${count} objets, rien d'autre.

ACTUALITÉS :
${list}`;

  const raw = await askClaude(prompt, 'claude-haiku-4-5-20251001', 4000);
  const m = raw.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('select: aucun JSON dans la réponse Claude');
  let cards = JSON.parse(m[0]).slice(0, count);
  return cards.map(c => ({
    slug: (c.slug || 'actu').replace(/[^a-z0-9-]/gi, '-').toLowerCase().slice(0, 40),
    headline: fixTypography((c.headline || '').trim()),
    reveal: fixTypography((c.reveal || '').trim()),
    source: (c.source || '').trim(),
    caption: (c.caption || '').trim(),
    photo: (c.photo || 'finance money').trim(),
    theme: (c.theme || 'Économie').trim(),
    origin: 'actu'
  }));
}

module.exports = { selectActus };

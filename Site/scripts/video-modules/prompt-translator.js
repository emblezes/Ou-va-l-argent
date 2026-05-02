/**
 * Prompt translator — passe chaque prompt visuel via Claude Haiku pour le
 * transformer en prompt IA propre (anglais, photo concrète, pas de montage).
 *
 * Corrige systématiquement les descriptions composites en français comme
 * "Carte animée du Moyen-Orient, puis graphique camembert..." en un
 * prompt photo unique en anglais.
 *
 * Coût : ~0,002 $ par prompt (Haiku, 200 tokens).
 */

const { loadConfig } = require('../journalist-modules/shared-utils');

/**
 * @param {{ rawPrompt, source, beatText, topic }}
 * @returns {string} prompt IA propre en anglais
 */
async function translatePromptForAI({ rawPrompt, source, beatText = '', topic = '' }) {
  const config = loadConfig();
  const apiKey = process.env.ANTHROPIC_API_KEY || config.ANTHROPIC_API_KEY;
  if (!apiKey) return rawPrompt; // fail-open : garde le prompt brut

  // Type de rendu visuel (influence le style demandé)
  const isVideo = source === 'kling';
  const styleHint = isVideo
    ? 'cinematic video clip, 5 seconds, photorealistic, documentary style, camera movement suggested'
    : 'editorial photography, photorealistic, cinematic lighting, single clear subject, no text overlays';

  const prompt = `Tu es un expert en prompts pour IA générative d'images/vidéos (Flux, Kling). Ta tâche : transformer un brief éditorial FR en un **prompt IA PROPRE en ANGLAIS**.

Contexte éditorial du plan : "${beatText}"
Sujet global de la vidéo : "${topic}"
Brief visuel fourni par l'éditeur : "${rawPrompt}"
Type demandé : ${isVideo ? 'CLIP VIDÉO (Kling)' : 'PHOTO (Flux)'}

RÈGLES IMPÉRATIVES :
1. **Réponds en ANGLAIS uniquement**
2. **UN seul sujet** : ne combine pas plusieurs scènes. Si le brief mentionne "puis", "ou", "animation avec graphique", tu dois choisir UN sujet principal.
3. **Photographique concret** : décris ce que la caméra voit (personne, objet, lieu, action). Pas de texte en surimpression, pas d'animation de graphique, pas de split-screen.
4. **15-30 mots max**, dense et descriptif
5. **Style imposé** : ajoute à la fin "${styleHint}"
6. **Pas de ponctuation de montage** (":", "puis", "→"). Virgules OK pour enrichir la description.

EXEMPLES DE TRANSFORMATION :

Brief ❌ "Images d'archives d'explosions nocturnes au Moyen-Orient, puis graphique du Brent qui monte"
Prompt ✅ "Cinematic aerial view of night explosions on desert industrial facility, fiery orange glow, dramatic smoke pillars, editorial photography, photorealistic, cinematic lighting"

Brief ❌ "Carte du Moyen-Orient animée, l'Iran mis en surbrillance, camembert montrant la part mondiale"
Prompt ✅ "Satellite map view of Middle East showing Iran highlighted, editorial cartography style, subtle vintage tones, photorealistic, editorial photography"

Brief ❌ "Graphique en barres empilées animé décomposant les 85€"
Prompt ✅ "Close-up of French gasoline receipt on wooden counter, detailed paper texture, euro coins beside, editorial photography, photorealistic, cinematic lighting"

Brief ❌ "Animation : 85€ se scinde en trois parts, bascule vers Bercy"
Prompt ✅ "French ministry of finance Bercy building facade at dusk, Paris, modern architecture, warm golden hour lighting, editorial photography, photorealistic"

Réponds UNIQUEMENT avec le prompt final en anglais, sans commentaire ni guillemets.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) return rawPrompt;
    const data = await res.json();
    const text = (data.content?.[0]?.text || '').trim().replace(/^["']|["']$/g, '');
    return text || rawPrompt;
  } catch {
    return rawPrompt;
  }
}

module.exports = { translatePromptForAI };

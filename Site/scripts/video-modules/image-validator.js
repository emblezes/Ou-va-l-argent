/**
 * Image validator — Claude Haiku avec vision.
 *
 * Regarde une image (fichier local) et dit si elle illustre correctement
 * le texte parlé du beat. Usage : avant d'utiliser une image Wikimedia ou
 * Google Images comme visuel, on vérifie qu'elle correspond vraiment
 * au message.
 *
 * Coût : ~0,003 $ par appel (Haiku vision avec image 1080×1080 en base64).
 *
 * Fail-open : si l'API échoue ou n'est pas configurée, on considère l'image
 * comme valide pour ne pas bloquer le pipeline.
 */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../journalist-modules/shared-utils');

// Limite la taille d'image envoyée à Claude : sinon le payload base64
// explose. 1024 px sur la plus grande dimension suffit pour reconnaître.
// Si on a ffmpeg, on peut downscaler à la volée. Sinon on envoie tel quel.
const { execSync } = require('child_process');

function downscaleIfTooLarge(imagePath, maxSide = 1024) {
  try {
    const stat = fs.statSync(imagePath);
    // Si < 400 Ko, on ne touche pas
    if (stat.size < 400 * 1024) return imagePath;

    const ext = path.extname(imagePath);
    const scaled = imagePath.replace(ext, `.small${ext}`);
    execSync(
      `ffmpeg -y -loglevel error -i "${imagePath}" -vf "scale='if(gt(iw,ih),${maxSide},-2)':'if(gt(ih,iw),${maxSide},-2)'" -q:v 4 "${scaled}"`,
      { stdio: 'ignore' }
    );
    return fs.existsSync(scaled) ? scaled : imagePath;
  } catch {
    return imagePath;
  }
}

function guessMime(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

/**
 * @returns {{ valid: boolean, reason: string }}
 */
async function validateImageInContext({ imagePath, beatText, topic = '' }) {
  const config = loadConfig();
  const apiKey = process.env.ANTHROPIC_API_KEY || config.ANTHROPIC_API_KEY;

  if (!apiKey) return { valid: true, reason: 'no-api-key' };
  if (!imagePath || !fs.existsSync(imagePath)) return { valid: false, reason: 'file-missing' };

  // Downscale si l'image est grosse (réduit bande passante + coût)
  const pathForApi = downscaleIfTooLarge(imagePath);
  const buf = fs.readFileSync(pathForApi);
  const b64 = buf.toString('base64');
  const mediaType = guessMime(pathForApi);

  const prompt = `Tu es validateur visuel pour un média économique français ("Où Va l'Argent"). Tu décides si une image est utilisable comme plan de B-roll pour illustrer un texte parlé.

Contexte global de la vidéo : ${topic || 'actualité économique française'}
Texte prononcé sur ce plan : "${beatText}"

Regarde l'image. Est-ce qu'elle peut servir d'illustration thématique pour ce texte — même de manière symbolique ou générale ?

**Sois GÉNÉREUX sur l'acceptation.** Une image n'a pas besoin d'illustrer littéralement chaque mot ; elle doit juste être **dans le registre sémantique** du beat. Un plan de B-roll symbolique est utile.

ACCEPTE si l'image correspond à UNE des catégories suivantes (liste non exhaustive) :
- La bonne personne, le bon lieu, la bonne institution quand citée
- Le bon secteur/thème général (ex: "infrastructure pétrolière" pour un beat essence/pétrole → OK ✅)
- Une métaphore visuelle plausible (ex: Arc de Triomphe pour un beat Paris/France → OK ✅)
- Un plan d'ambiance générique mais cohérent (ex: mains qui comptent des billets pour un beat fiscalité → OK ✅)
- Un schéma, graphique ou infographie dans le bon domaine
- Une photo de presse éditoriale sur un sujet adjacent du même secteur

REJETTE UNIQUEMENT si :
- Contre-sens majeur (ex: pompe à vélo quand on parle de pompe à essence, soin cosmétique/maquillage quand on parle de finances)
- Sujet totalement étranger (ex: restaurant gastronomique, appli de rencontre, animal de compagnie quand on parle de Bercy)
- Personne nommée différente de celle citée (ex: un inconnu à la place de Macron)
- Image de pub commerciale flagrante avec logo marque concurrente en évidence
- Image illisible (texte flou, meme cassé, capture d'écran confuse)

Le risque est **plus grave** de refuser une image thématiquement OK (on se retrouve sans visuel) que d'accepter une image un peu générique. Dans le doute : ACCEPTE.

Réponds UNIQUEMENT en JSON compact : {"valid": true, "reason": "..."} ou {"valid": false, "reason": "..."}
(max 12 mots pour la raison)`;

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
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: b64 },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
    });

    if (!res.ok) return { valid: true, reason: `api-${res.status}-default-ok` };
    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { valid: true, reason: 'no-json-default-ok' };
    const parsed = JSON.parse(match[0]);
    return { valid: !!parsed.valid, reason: (parsed.reason || '').slice(0, 100) };
  } catch (e) {
    return { valid: true, reason: `error-${e.message.slice(0, 30)}` };
  } finally {
    // Nettoie le fichier .small créé temporairement
    if (pathForApi !== imagePath && fs.existsSync(pathForApi)) {
      try { fs.unlinkSync(pathForApi); } catch {}
    }
  }
}

module.exports = { validateImageInContext };

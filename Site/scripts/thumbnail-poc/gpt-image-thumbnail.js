/**
 * Miniature Reel Instagram OVLA — piste OpenAI gpt-image-1 (images.edit).
 *
 * Contrairement à images.generate (texte→image, invente un visage), on utilise
 * images.EDIT en passant TA photo + le logo OVLA comme images de référence,
 * pour garder ton vrai visage.
 *
 * Prérequis :
 *   - OPENAI_API_KEY dans l'environnement (export OPENAI_API_KEY=... dans ~/.zshrc)
 *   - Une photo de toi (--photo=/chemin/photo.jpg) — cadrage buste, visage net
 *
 * Usage :
 *   node gpt-image-thumbnail.js --photo=/chemin/moi.jpg --title="La dette explose"
 *   node gpt-image-thumbnail.js --photo=/chemin/moi.jpg --title="..." --size=1024x1536 --quality=high
 *
 * Formats gpt-image-1 : 1024x1024 | 1024x1536 (portrait, défaut) | 1536x1024
 * Le Reel voulant du 9:16, on recadrera/upscalera le 1024x1536 après coup si besoin.
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'out');
const DEFAULT_LOGO = path.join(__dirname, '..', '..', 'public', 'infographies', '48-logo-euro-instagram.png');

function arg(name, def = '') {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
}

function buildPrompt(title, subtitle, theme) {
  // Style "miniature YouTube lumineuse" (réf. fournie par l'auteur) : fond bleu clair,
  // bulle blanche titre multicolore, badge sous-titre, personne détourée contour blanc, icônes 3D.
  return `Vertical 2:3 portrait YouTube-style thumbnail, bright, clean and modern French social-media thumbnail.

BACKGROUND: light sky-blue background (#a9d3f7) decorated with smooth organic blob shapes in vivid blue (#2f6fed) and lighter blue, plus small halftone dot patterns in the corners. Flat modern vector style, bright and airy.

PERSON: use the person from the reference photo and keep their face EXACTLY identical — same features, same skin tone, same identity, do NOT alter or beautify. Cut them out as a sticker (head and shoulders) on the RIGHT side, with a clean thick WHITE outline stroke all around them. Black sweater, confident neutral expression, facing the camera.

TITLE CARD: on the LEFT, a large white rounded speech-bubble card containing bold CONDENSED UPPERCASE heavy sans-serif text (like Montserrat ExtraBold), tightly kerned, on up to 3 lines, reading "${title}". Alternate the line colors between dark navy (#0b1f44) and vivid blue (#2f6fed). The text must be huge and dominant.

SUBTITLE: just below the card, a vivid blue rounded pill badge with white uppercase text reading "${subtitle || "OÙ VA L'ARGENT ?"}".

DECOR: a few playful 3D glossy icons in blue tones related to ${theme || 'economy and finance'} (for example: a rising bar chart with an upward arrow, a coin or euro symbol, a target). Add small blue accent strokes and one dashed curved arrow.

STYLE: bright, high-contrast, clean flat vector plus 3D icons, professional YouTube/Instagram thumbnail, PERFECT French spelling with correct accents, no watermark, no extra text other than the title and the subtitle badge.`;
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  const photo = arg('photo', '');
  const title = arg('title', 'La dette explose');
  const subtitle = arg('subtitle', '');
  const theme = arg('theme', '');
  const size = arg('size', '1024x1536');
  const quality = arg('quality', 'high');
  const logo = arg('logo', DEFAULT_LOGO);
  const name = arg('name', 'miniature-gptimage');

  // Garde-fous clairs
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY manquante. Ajoute dans ~/.zshrc :  export OPENAI_API_KEY="sk-..."  puis  source ~/.zshrc');
    process.exit(1);
  }
  if (!photo || !fs.existsSync(photo)) {
    console.error('❌ Photo introuvable. Passe --photo=/chemin/vers/ta-photo.jpg (cadrage buste, visage net).');
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const form = new FormData();
  form.append('model', 'gpt-image-1');
  form.append('prompt', buildPrompt(title, subtitle, theme));
  form.append('size', size);
  form.append('quality', quality);

  // Images de référence : ta photo + le logo (gpt-image-1 accepte plusieurs images)
  const photoBuf = fs.readFileSync(photo);
  form.append('image[]', new Blob([photoBuf], { type: 'image/jpeg' }), path.basename(photo));
  if (logo && fs.existsSync(logo)) {
    const logoBuf = fs.readFileSync(logo);
    form.append('image[]', new Blob([logoBuf], { type: 'image/png' }), 'logo-ovla.png');
  }

  console.log('🎨 Appel gpt-image-1 (images.edit)…');
  console.log('   Titre  :', title, '| size', size, '| quality', quality);
  console.log('   Réf.   :', path.basename(photo), logo ? '+ logo OVLA' : '');

  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) {
    console.error(`❌ OpenAI ${res.status}: ${(await res.text()).slice(0, 400)}`);
    process.exit(1);
  }
  const data = await res.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) { console.error('❌ Pas d’image dans la réponse:', JSON.stringify(data).slice(0, 300)); process.exit(1); }

  const pngPath = path.join(OUT_DIR, `${name}.png`);
  fs.writeFileSync(pngPath, Buffer.from(b64, 'base64'));
  console.log('✅ Miniature gpt-image-1 générée :', pngPath);
  if (data.usage) console.log('   Tokens image:', JSON.stringify(data.usage));
}

main().catch((e) => { console.error(e); process.exit(1); });

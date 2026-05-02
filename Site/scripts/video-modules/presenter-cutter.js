/**
 * Presenter cutter — détoure la photo du présentateur via BirefNet (fal.ai).
 *
 * Prend une photo avec fond (plateau TV, studio, etc.), retourne un PNG avec
 * canal alpha ne gardant que le buste/tête. Résultat mis en cache :
 * tant qu'on ne change pas la photo source, le détourage n'est fait qu'une fois.
 *
 * Coût : ~0,001 $ par détourage (BirefNet est très rapide).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { loadConfig } = require('../journalist-modules/shared-utils');

const IA_CACHE_DIR = path.join(__dirname, '..', '.video-ia-cache');
const FAL_QUEUE_API = 'https://queue.fal.run';

function hashFile(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 16);
}

async function uploadToFalStorage(filePath) {
  const config = loadConfig();
  const apiKey = process.env.FAL_API_KEY || config.FAL_API_KEY;
  if (!apiKey) throw new Error('FAL_API_KEY manquant');

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase() || 'jpeg';
  const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

  const initRes = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file_name: fileName, content_type: contentType }),
  });
  if (!initRes.ok) throw new Error(`fal storage init ${initRes.status}`);
  const initData = await initRes.json();
  const uploadUrl = initData.upload_url;
  const fileUrl = initData.file_url;

  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: fileBuffer,
  });
  if (!putRes.ok) throw new Error(`fal storage put ${putRes.status}`);

  return fileUrl;
}

/**
 * Détoure une photo et retourne le path d'un PNG avec alpha.
 * @returns {string} localPath du PNG détouré
 */
async function cutoutPresenter({ sourcePath, forceRefresh = false }) {
  if (!fs.existsSync(sourcePath)) throw new Error(`Photo source introuvable: ${sourcePath}`);
  if (!fs.existsSync(IA_CACHE_DIR)) fs.mkdirSync(IA_CACHE_DIR, { recursive: true });

  const hash = hashFile(sourcePath);
  const cachePath = path.join(IA_CACHE_DIR, `presenter-cutout-${hash}.png`);
  if (!forceRefresh && fs.existsSync(cachePath) && fs.statSync(cachePath).size > 5000) {
    return cachePath;
  }

  const config = loadConfig();
  const apiKey = process.env.FAL_API_KEY || config.FAL_API_KEY;
  if (!apiKey) throw new Error('FAL_API_KEY manquant');

  // 1. Upload sur fal.ai storage
  console.log(`  ↑ Upload photo pour détourage : ${path.basename(sourcePath)}`);
  const imageUrl = await uploadToFalStorage(sourcePath);

  // 2. Appel BirefNet — détourage de fond
  console.log(`  ✂ Détourage BirefNet...`);
  const submitRes = await fetch(`${FAL_QUEUE_API}/fal-ai/birefnet`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!submitRes.ok) throw new Error(`birefnet submit ${submitRes.status}: ${await submitRes.text()}`);
  const submit = await submitRes.json();
  const statusUrl = submit.status_url;
  const responseUrl = submit.response_url;

  // 3. Poll
  const deadline = Date.now() + 60 * 1000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2000));
    const stat = await fetch(statusUrl, { headers: { Authorization: `Key ${apiKey}` } });
    if (!stat.ok) continue;
    const status = await stat.json();
    if (status.status === 'COMPLETED') break;
    if (status.status === 'FAILED') throw new Error(`birefnet failed: ${JSON.stringify(status).slice(0, 200)}`);
  }

  const finalRes = await fetch(responseUrl, { headers: { Authorization: `Key ${apiKey}` } });
  const final = await finalRes.json();
  const pngUrl = final.image?.url || final.images?.[0]?.url;
  if (!pngUrl) throw new Error('birefnet: URL PNG manquante');

  const imgRes = await fetch(pngUrl);
  fs.writeFileSync(cachePath, Buffer.from(await imgRes.arrayBuffer()));
  console.log(`  ✓ Détourage terminé : ${path.basename(cachePath)}`);
  return cachePath;
}

module.exports = { cutoutPresenter };

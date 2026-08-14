/**
 * Détourage de photo via BirefNet (fal.ai) → PNG fond transparent.
 * Usage : node detour-fal.js <photo-in.png> <photo-out.png>
 */
const fs = require('fs');
const path = require('path');

async function uploadToFalStorage(filePath, apiKey) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase() || 'png';
  const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
  const initRes = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
    method: 'POST',
    headers: { Authorization: `Key ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_name: fileName, content_type: contentType }),
  });
  if (!initRes.ok) throw new Error(`fal storage init ${initRes.status}`);
  const initData = await initRes.json();
  const putRes = await fetch(initData.upload_url, { method: 'PUT', headers: { 'Content-Type': contentType }, body: fileBuffer });
  if (!putRes.ok) throw new Error(`fal storage put ${putRes.status}`);
  return initData.file_url;
}

async function main() {
  const [, , inPath, outPath] = process.argv;
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) throw new Error('FAL_API_KEY manquant');
  if (!inPath || !outPath) throw new Error('Usage: node detour-fal.js <in> <out>');

  console.log('↑ Upload photo sur fal.ai…');
  const imageUrl = await uploadToFalStorage(inPath, apiKey);

  console.log('✂  BirefNet détourage…');
  const submitRes = await fetch('https://queue.fal.run/fal-ai/birefnet/v2', {
    method: 'POST',
    headers: { Authorization: `Key ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!submitRes.ok) throw new Error(`birefnet submit ${submitRes.status}: ${(await submitRes.text()).slice(0, 200)}`);
  const submit = await submitRes.json();

  const deadline = Date.now() + 90000;
  let imgUrl = null;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2500));
    const stat = await fetch(submit.status_url, { headers: { Authorization: `Key ${apiKey}` } });
    if (!stat.ok) continue;
    const status = await stat.json();
    if (status.status === 'COMPLETED') {
      const finalRes = await fetch(submit.response_url, { headers: { Authorization: `Key ${apiKey}` } });
      const final = await finalRes.json();
      imgUrl = final.image?.url || final.images?.[0]?.url;
      break;
    }
    if (status.status === 'FAILED') throw new Error('birefnet failed');
  }
  if (!imgUrl) throw new Error('birefnet: URL image manquante (timeout)');

  const imgRes = await fetch(imgUrl);
  fs.writeFileSync(outPath, Buffer.from(await imgRes.arrayBuffer()));
  console.log('✅ Détourage OK :', outPath);
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });

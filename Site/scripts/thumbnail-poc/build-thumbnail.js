/**
 * Miniature Reel OVLA — vraie photo (détourée, jamais refaite) + vrai logo + charte OVLA
 * + illustrations du thème. Format 1080×1920.
 *
 * Fixe : logo € cyan + « Où Va l'Argent ? », charte OVLA, ta photo à droite (contour blanc).
 * Variable : titre (mot en accent), illustrations du thème, couleur d'accent.
 *
 * Usage :
 *   node build-thumbnail.js --title="La dette explose en France" --accent-word="explose" \
 *        --photo=photo-emmanuel-2-detouree.png --icons="📈 💶 🎯" --accent=red
 */

const fs = require('fs');
const path = require('path');

const W = 1080, H = 1920;
const OUT_DIR = path.join(__dirname, 'out');
const ACCENTS = { red: '#ff4757', cyan: '#00d4ff', gold: '#ffd700', green: '#00ff88', violet: '#a855f7', orange: '#ff9f43' };

function arg(name, def = '') {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
}
function toDataUrl(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return '';
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}
function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function highlightTitle(title, word, accent) {
  if (!word) return escapeHtml(title);
  const re = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
  return escapeHtml(title).replace(re, `<span class="accent">$1</span>`);
}

const ICON_DIR = path.join(__dirname, 'assets-icons');

function buildHTML({ title, accentWord, accent, photoData, icons, glowRgb }) {
  const positions = [
    'top:270px; left:56px;',
    'top:1150px; left:66px;',
    'top:1470px; left:320px;',
  ];
  const iconEls = icons.map((nameOrEmoji, i) => {
    const file = path.join(ICON_DIR, `${nameOrEmoji}.png`);
    const data = toDataUrl(file);
    const inner = data ? `<img src="${data}" alt="">` : nameOrEmoji;
    return `<div class="theme-icon" style="${positions[i] || positions[0]}">${inner}</div>`;
  }).join('\n');

  const photoBlock = photoData
    ? `<img class="presenter" src="${photoData}" alt="">`
    : `<div class="presenter placeholder">TA PHOTO</div>`;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${W}px; height:${H}px; overflow:hidden; font-family:'Syne',sans-serif;
    background: linear-gradient(160deg,#0a1220 0%, #142b48 50%, #0a1220 100%); }
  .frame { position:relative; width:100%; height:100%; overflow:hidden; }

  /* Grille + glows charte OVLA */
  .grid { position:absolute; inset:0; z-index:1;
    background-image: linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px);
    background-size: 46px 46px; }
  .glow-a { position:absolute; top:-140px; right:-160px; width:820px; height:820px; border-radius:50%;
    background: radial-gradient(circle, rgba(${glowRgb},0.30) 0%, transparent 68%); z-index:1; }
  .glow-b { position:absolute; bottom:-180px; left:-160px; width:600px; height:600px; border-radius:50%;
    background: radial-gradient(circle, rgba(168,85,247,0.20) 0%, transparent 70%); z-index:1; }

  /* Présentateur détouré (VRAIE photo) — grand, à droite, coupé en bas, contour blanc */
  .presenter { position:absolute; bottom:0; right:-40px;
    height:1500px; width:auto; z-index:3; object-fit:contain; object-position:bottom center;
    filter:
      drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff)
      drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff)
      drop-shadow(4px 4px 0 #fff) drop-shadow(-4px 4px 0 #fff)
      drop-shadow(4px -4px 0 #fff) drop-shadow(-4px -4px 0 #fff)
      drop-shadow(0 24px 46px rgba(0,0,0,0.55)); }
  .presenter.placeholder { display:flex; align-items:flex-end; justify-content:center; padding-bottom:120px;
    font-family:'JetBrains Mono',monospace; color:rgba(255,255,255,0.4); font-size:28px; height:1200px; width:640px; }

  /* Logo GROS haut-gauche */
  .logo { position:absolute; top:64px; left:56px; display:flex; align-items:center; gap:24px; z-index:7; }
  .logo-icon { font-family:'Instrument Serif',serif; font-size:10rem; color:#00d4ff; line-height:0.8;
    text-shadow:0 6px 30px rgba(0,0,0,0.7); }
  .logo-text { font-family:'Instrument Serif',serif; font-style:italic; font-size:3.6rem; color:#fff; line-height:1;
    white-space:nowrap; text-shadow:0 4px 18px rgba(0,0,0,0.9); }

  /* Titre XXL à gauche */
  .title { position:absolute; top:520px; left:56px; width:660px; z-index:7; text-align:left;
    font-family:'Instrument Serif',serif; font-size:150px; line-height:0.96; letter-spacing:-3px;
    color:#fff; text-shadow:0 6px 30px rgba(0,0,0,0.85); }
  .title .accent { color:${accent}; font-style:italic; }

  /* Illustrations 3D du thème sur halo cyan */
  .theme-icon { position:absolute; z-index:6; width:230px; height:230px; }
  .theme-icon img { width:100%; height:100%; object-fit:contain;
    filter: drop-shadow(0 14px 30px rgba(0,0,0,0.55)); }
  .theme-icon::before { content:''; position:absolute; inset:-10px; z-index:-1; border-radius:50%;
    background: radial-gradient(circle, rgba(${glowRgb},0.40) 0%, transparent 68%); }
</style></head>
<body>
  <div class="frame">
    <div class="grid"></div>
    <div class="glow-a"></div>
    <div class="glow-b"></div>
    ${photoBlock}
    ${iconEls}
    <div class="logo"><span class="logo-icon">&euro;</span><span class="logo-text">Où Va l'Argent ?</span></div>
    <h1 class="title">${highlightTitle(title, accentWord, accent)}</h1>
  </div>
</body></html>`;
}

async function main() {
  const title = arg('title', 'La dette explose en France');
  const accentWord = arg('accent-word', '');
  const accentName = arg('accent', 'red');
  const accent = ACCENTS[accentName] || ACCENTS.red;
  const photoPath = arg('photo', '');
  const iconsRaw = arg('icons', '📈 💶 🎯');
  const icons = iconsRaw.split(/\s+/).filter(Boolean).slice(0, 3);
  const name = arg('name', 'miniature-test');

  const glowRgb = accentName === 'red' ? '255,71,87'
    : accentName === 'green' ? '0,255,136'
    : accentName === 'gold' ? '255,215,0'
    : accentName === 'orange' ? '255,159,67'
    : accentName === 'violet' ? '168,85,247'
    : '0,212,255';

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const html = buildHTML({ title, accentWord, accent, photoData: toDataUrl(photoPath), icons, glowRgb });

  const htmlPath = path.join(OUT_DIR, `${name}.html`);
  const pngPath = path.join(OUT_DIR, `${name}.png`);
  fs.writeFileSync(htmlPath, html);

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0', timeout: 20000 });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: pngPath, type: 'png' });
  } finally { await browser.close(); }

  console.log('✅ Miniature :', pngPath);
}
main().catch((e) => { console.error(e); process.exit(1); });

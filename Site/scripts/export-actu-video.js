/**
 * Script d'overlay branding sur vidéo d'actualité
 *
 * Usage:
 *   node export-actu-video.js <video> --title="Titre de l'actu" [options]
 *
 * Options:
 *   --title="..."       Titre de l'actualité (OBLIGATOIRE)
 *   --tag="ACTU"        Tag en haut à droite (défaut: ACTU)
 *   --source="AFP"      Source (défaut: vide)
 *   --name="nom-fichier" Nom du fichier de sortie (défaut: basé sur le titre)
 *   --format=square     Format de sortie: square (1080x1080), vertical (1080x1920), auto (défaut: auto = garder les dimensions de la vidéo)
 *   --accent="mot"      Mot(s) à mettre en cyan (séparés par |)
 *   --accent-red="mot"  Mot(s) à mettre en rouge (séparés par |)
 *   --accent-gold="mot" Mot(s) à mettre en or (séparés par |)
 *
 * Exemples:
 *   node export-actu-video.js video.mp4 --title="Les PDG d'OpenAI et Anthropic refusent de se serrer la main" --accent="OpenAI|Anthropic" --accent-red="refusent"
 *   node export-actu-video.js video.mp4 --title="Le CAC 40 franchit les 8000 points" --accent-gold="8000 points" --format=vertical
 *
 * Le script :
 * 1. Analyse les dimensions de la vidéo (ffprobe)
 * 2. Génère un overlay PNG transparent (Puppeteer) adapté aux dimensions
 * 3. Superpose l'overlay sur la vidéo (ffmpeg)
 * 4. Sauvegarde dans Actus chaudes/
 */

const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const ACTUS_DIR = path.join(BASE, 'Actus chaudes');
const TEMPLATE_PATH = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Templates/Réseaux sociaux/template-video-overlay.html';

// --- Helpers ---

function parseArgs(argv) {
  const args = { positional: [] };
  for (const a of argv) {
    const match = a.match(/^--(\w[\w-]*)=(.*)$/);
    if (match) {
      args[match[1]] = match[2];
    } else if (a.startsWith('--')) {
      args[a.slice(2)] = true;
    } else {
      args.positional.push(a);
    }
  }
  return args;
}

function getVideoDimensions(videoPath) {
  try {
    const result = execSync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=s=x:p=0 "${videoPath}"`,
      { encoding: 'utf-8' }
    ).trim();
    const parts = result.split('x');
    return {
      width: parseInt(parts[0]),
      height: parseInt(parts[1]),
      duration: parts[2] ? parseFloat(parts[2]) : null
    };
  } catch (err) {
    console.error('Erreur ffprobe:', err.message);
    process.exit(1);
  }
}

function getTargetDimensions(videoDims, format) {
  if (format === 'square') return { width: 1080, height: 1080 };
  if (format === 'vertical') return { width: 1080, height: 1920 };
  // auto: garder le ratio de la vidéo, base 1080 de large
  const ratio = videoDims.height / videoDims.width;
  return { width: 1080, height: Math.round(1080 * ratio) };
}

function applyAccents(title, accents, className) {
  if (!accents) return title;
  const words = accents.split('|');
  for (const word of words) {
    // Escape regex special chars
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    title = title.replace(new RegExp(escaped, 'gi'), `<span class="${className}">$&</span>`);
  }
  return title;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

// --- Main ---

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.positional.length === 0 || !args.title) {
    console.log(`
Usage: node export-actu-video.js <video> --title="Titre" [options]

Options:
  --title="..."         Titre de l'actualité (OBLIGATOIRE)
  --tag="ACTU"          Tag en haut à droite (défaut: ACTU)
  --source="AFP"        Source (défaut: vide)
  --name="nom"          Nom du fichier de sortie
  --format=square|vertical|auto  Format (défaut: auto)
  --accent="mot1|mot2"  Mots en cyan
  --accent-red="mot"    Mots en rouge
  --accent-gold="mot"   Mots en or
`);
    process.exit(1);
  }

  const videoPath = path.resolve(args.positional[0]);
  if (!fs.existsSync(videoPath)) {
    console.error(`Vidéo introuvable : ${videoPath}`);
    process.exit(1);
  }

  const title = args.title;
  const tag = args.tag || 'ACTU';
  const source = args.source || '';
  const format = args.format || 'auto';
  const outputName = args.name || slugify(title);

  console.log(`\n🎬 Export actualité vidéo\n`);
  console.log(`  Vidéo  : ${path.basename(videoPath)}`);
  console.log(`  Titre  : ${title}`);
  console.log(`  Format : ${format}`);

  // 1. Obtenir les dimensions de la vidéo
  const videoDims = getVideoDimensions(videoPath);
  console.log(`  Source : ${videoDims.width}x${videoDims.height}`);

  const target = getTargetDimensions(videoDims, format);
  console.log(`  Cible  : ${target.width}x${target.height}`);

  // 2. Générer l'overlay PNG transparent
  console.log(`\n  Génération de l'overlay...`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`file://${TEMPLATE_PATH}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Adapter les dimensions de l'overlay
  await page.evaluate((w, h) => {
    const frame = document.querySelector('.overlay-frame');
    frame.style.width = w + 'px';
    frame.style.height = h + 'px';
  }, target.width, target.height);

  // Adapter le titre avec les accents de couleur
  let htmlTitle = title.replace(/\n/g, '<br>');
  htmlTitle = applyAccents(htmlTitle, args['accent'], 'accent');
  htmlTitle = applyAccents(htmlTitle, args['accent-red'], 'accent-red');
  htmlTitle = applyAccents(htmlTitle, args['accent-gold'], 'accent-gold');

  // Injecter le contenu
  await page.evaluate((titleHtml, tagText, sourceText) => {
    document.querySelector('.news-title').innerHTML = titleHtml;
    document.querySelector('.tag').textContent = tagText;
    if (sourceText) {
      document.querySelector('.source').innerHTML = `Source : <span>${sourceText}</span>`;
    } else {
      document.querySelector('.source').style.display = 'none';
    }
  }, htmlTitle, tag, source);

  // Adapter la taille du titre si format vertical (plus d'espace)
  if (target.height > target.width) {
    await page.evaluate(() => {
      document.querySelector('.news-title').style.fontSize = '5.5rem';
    });
  }

  // deviceScaleFactor: 1 pour que le PNG corresponde exactement aux dimensions cibles
  await page.setViewport({ width: target.width, height: target.height, deviceScaleFactor: 1 });
  await new Promise(r => setTimeout(r, 500));

  // Exporter en PNG transparent
  const tmpOverlay = path.join(os.tmpdir(), `overlay-${Date.now()}.png`);
  const frame = await page.$('.overlay-frame');
  await frame.screenshot({ path: tmpOverlay, type: 'png', omitBackground: true });
  await browser.close();

  console.log(`  ✓ Overlay généré (${target.width}x${target.height})`);

  // 3. Superposer avec ffmpeg
  console.log(`\n  Composition vidéo...`);

  const outputPath = path.join(ACTUS_DIR, `${outputName}.mp4`);

  // Construire la commande ffmpeg :
  // - Redimensionner la vidéo aux dimensions cibles
  // - Superposer l'overlay PNG (même taille que la vidéo)
  // - Copier l'audio tel quel
  const ffmpegCmd = [
    'ffmpeg', '-y',
    '-i', `"${videoPath}"`,
    '-i', `"${tmpOverlay}"`,
    '-filter_complex',
    `"[0:v]scale=${target.width}:${target.height}:force_original_aspect_ratio=decrease,pad=${target.width}:${target.height}:(ow-iw)/2:(oh-ih)/2:color=black[vid];[vid][1:v]overlay=0:0:format=auto,format=yuv420p"`,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '18',
    '-c:a', 'copy',
    '-movflags', '+faststart',
    `"${outputPath}"`
  ].join(' ');

  try {
    execSync(ffmpegCmd, { stdio: 'inherit', timeout: 600000 });
  } catch (err) {
    // Si pas d'audio, relancer sans -c:a copy
    console.log('  Relance sans audio...');
    const ffmpegNoAudio = [
      'ffmpeg', '-y',
      '-i', `"${videoPath}"`,
      '-i', `"${tmpOverlay}"`,
      '-filter_complex',
      `"[0:v]scale=${target.width}:${target.height}:force_original_aspect_ratio=decrease,pad=${target.width}:${target.height}:(ow-iw)/2:(oh-ih)/2:color=black[vid];[vid][1:v]overlay=0:0:format=auto,format=yuv420p"`,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '18',
      '-an',
      '-movflags', '+faststart',
      `"${outputPath}"`
    ].join(' ');
    execSync(ffmpegNoAudio, { stdio: 'inherit', timeout: 600000 });
  }

  // Nettoyage
  fs.unlinkSync(tmpOverlay);

  console.log(`\n  ✓ ${outputPath}`);
  console.log(`\n✅ Vidéo exportée !\n`);
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});

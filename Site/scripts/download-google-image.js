/**
 * Télécharge une image depuis Google Images via Puppeteer
 *
 * Usage:
 *   node download-google-image.js "recherche google" --output=chemin/sortie.jpg
 *
 * Options:
 *   --output=<chemin>   Chemin de sortie (défaut: ./image-downloaded.jpg)
 *   --index=<n>         Prendre la n-ième image (défaut: 0 = première)
 *
 * Exemples:
 *   node download-google-image.js "train OUIGO France gare"
 *   node download-google-image.js "surendettement jeunes France" --output=photo.jpg
 *   node download-google-image.js "Pentagone Washington" --index=2
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.google.com/'
      },
      timeout: 15000
    }, (response) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('image')) {
        reject(new Error(`Not an image: ${contentType}`));
        return;
      }
      const file = fs.createWriteStream(outputPath);
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(outputPath); });
      file.on('error', reject);
    });
    request.on('error', reject);
    request.on('timeout', () => { request.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const query = args.find(a => !a.startsWith('--'));
  const outputArg = args.find(a => a.startsWith('--output='));
  const indexArg = args.find(a => a.startsWith('--index='));

  if (!query) {
    console.log('Usage: node download-google-image.js "recherche" [--output=chemin.jpg] [--index=0]');
    process.exit(1);
  }

  const outputPath = outputArg ? outputArg.replace('--output=', '') : './image-downloaded.jpg';
  const targetIndex = indexArg ? parseInt(indexArg.replace('--index=', '')) : 0;

  console.log(`\n🔍 Recherche Google Images : "${query}"`);
  console.log(`   Index cible : ${targetIndex}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Simuler un navigateur normal
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1400, height: 900 });

    // Aller sur Google Images
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&hl=fr`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Accepter les cookies si nécessaire
    try {
      const acceptBtn = await page.$('button[id="L2AGLb"]');
      if (acceptBtn) {
        await acceptBtn.click();
        await new Promise(r => setTimeout(r, 1000));
      }
    } catch (e) { /* pas de popup cookies */ }

    await new Promise(r => setTimeout(r, 2000));

    // Stratégie : cliquer sur une thumbnail pour obtenir l'URL haute résolution
    // Google Images affiche les images dans des éléments cliquables
    let finalUrl = null;

    // Trouver toutes les images de résultats (filtrer les petites icônes)
    const allResultImgs = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('img').forEach(img => {
        const rect = img.getBoundingClientRect();
        // Filtrer : doit être visible, dans la zone de résultats, pas trop petit
        if (rect.width > 80 && rect.height > 80 && rect.top > 100 && rect.top < 2000) {
          const src = img.src || img.getAttribute('data-src') || '';
          results.push({
            src,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            isEncoded: src.startsWith('data:') || src.includes('encrypted'),
          });
        }
      });
      return results;
    });

    console.log(`   ${allResultImgs.length} images de résultats détectées`);

    // Cliquer sur la thumbnail cible pour obtenir l'image haute résolution
    const targetImgIndex = targetIndex;
    const clickableImgs = await page.$$('img');
    const validImgs = [];

    for (const img of clickableImgs) {
      const box = await img.boundingBox();
      if (box && box.width > 80 && box.height > 80 && box.y > 100 && box.y < 2000) {
        validImgs.push(img);
      }
    }

    console.log(`   ${validImgs.length} images cliquables`);

    if (validImgs.length > targetImgIndex) {
      console.log(`   Clic sur l'image ${targetImgIndex}...`);
      try {
        await validImgs[targetImgIndex].click();
        await new Promise(r => setTimeout(r, 3000));

        // Chercher l'image en haute résolution dans le panel latéral
        finalUrl = await page.evaluate(() => {
          // Méthode 1 : images avec jsname spécifiques de Google
          const selectors = [
            'img[jsname="kn3ccd"]',
            'img[jsname="HiaYvf"]',
            'img[jsname="JuXqh"]',
            'a[jsname="sTFXNd"] img',
            'div[jsname="CGzTgf"] img',
            'div[jsname="figiqf"] img',
          ];
          for (const sel of selectors) {
            const imgs = document.querySelectorAll(sel);
            for (const img of imgs) {
              const src = img.src;
              if (src && src.startsWith('http') && !src.includes('google.com') && !src.includes('gstatic.com') && !src.startsWith('data:') && img.naturalWidth > 200) {
                return src;
              }
            }
          }

          // Méthode 2 : la plus grande image visible qui n'est pas de Google
          const allImgs = [...document.querySelectorAll('img')];
          const large = allImgs
            .filter(i => {
              const src = i.src;
              const rect = i.getBoundingClientRect();
              return src && src.startsWith('http')
                && !src.includes('google.com') && !src.includes('gstatic.com')
                && !src.startsWith('data:')
                && rect.width > 200;
            })
            .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);
          return large.length > 0 ? large[0].src : null;
        });

        if (finalUrl) {
          console.log(`   ✓ Image haute résolution trouvée`);
        }
      } catch (e) {
        console.log(`   ⚠ Clic échoué : ${e.message}`);
      }
    }

    // Fallback : chercher n'importe quelle image externe sur la page
    if (!finalUrl) {
      console.log('   Fallback : recherche d\'images externes...');
      finalUrl = await page.evaluate((idx) => {
        const allImgs = [...document.querySelectorAll('img')];
        const external = allImgs.filter(i => {
          const src = i.src;
          return src && src.startsWith('http')
            && !src.includes('google.com') && !src.includes('gstatic.com') && !src.includes('googleapis.com')
            && !src.startsWith('data:')
            && i.naturalWidth > 100;
        });
        return external.length > idx ? external[idx].src : (external.length > 0 ? external[0].src : null);
      }, targetIndex);
    }

    if (!finalUrl) {
      // Dernier recours : screenshot de debug
      const debugPath = path.join(path.dirname(outputPath), 'google-debug.png');
      await page.screenshot({ path: debugPath });
      console.error(`\n❌ Aucune image trouvée. Debug screenshot: ${debugPath}`);
      await browser.close();
      process.exit(1);
    }

    console.log(`   URL : ${finalUrl.substring(0, 100)}...`);
    console.log(`   Téléchargement...`);

    // Déterminer l'extension
    const ext = finalUrl.match(/\.(jpg|jpeg|png|webp|avif)/i);
    const finalOutput = ext ? outputPath.replace(/\.\w+$/, `.${ext[1].toLowerCase()}`) : outputPath;

    // Télécharger
    try {
      await downloadImage(finalUrl, path.resolve(finalOutput));
      const stats = fs.statSync(path.resolve(finalOutput));
      console.log(`\n   ✅ Image téléchargée : ${finalOutput} (${Math.round(stats.size / 1024)} Ko)`);
    } catch (dlErr) {
      console.log(`   ⚠ Téléchargement direct échoué (${dlErr.message}), tentative via Puppeteer...`);

      // Fallback : télécharger via Puppeteer (capture d'écran de l'image)
      const imgPage = await browser.newPage();
      try {
        const response = await imgPage.goto(finalUrl, { waitUntil: 'networkidle2', timeout: 15000 });
        const buffer = await response.buffer();
        fs.writeFileSync(path.resolve(finalOutput), buffer);
        const stats = fs.statSync(path.resolve(finalOutput));
        console.log(`\n   ✅ Image téléchargée (via Puppeteer) : ${finalOutput} (${Math.round(stats.size / 1024)} Ko)`);
      } catch (e2) {
        console.error(`\n❌ Impossible de télécharger l'image : ${e2.message}`);
        await browser.close();
        process.exit(1);
      }
      await imgPage.close();
    }

    // Afficher le chemin absolu pour chaînage
    console.log(`   PATH=${path.resolve(finalOutput)}`);

  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Erreur:', err.message);
  process.exit(1);
});

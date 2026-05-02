const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  const imageBuffer = fs.readFileSync(inputPath);
  const imageB64 = imageBuffer.toString('base64');

  await page.setContent(`
    <html><body style="margin:0">
      <canvas id="c"></canvas>
      <script>
        const img = new Image();
        img.onload = () => {
          const c = document.getElementById('c');
          c.width = img.width; c.height = img.height;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, c.width, c.height);
          const px = data.data;
          for (let i = 0; i < px.length; i += 4) {
            const r = px[i], g = px[i+1], b = px[i+2];
            // Détecte le damier gris/blanc (couleurs claires et grisâtres)
            const isLight = r > 180 && g > 180 && b > 180;
            const isGrey = Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && Math.abs(r - b) < 25 && r > 150;
            if (isLight || isGrey) px[i+3] = 0;
          }
          ctx.putImageData(data, 0, 0);
          window.__result = c.toDataURL('image/png');
        };
        img.src = 'data:image/png;base64,${imageB64}';
      </script>
    </body></html>
  `);
  await new Promise(r => setTimeout(r, 1000));
  const result = await page.evaluate(() => window.__result);
  const base64Data = result.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
  console.log('Saved:', outputPath);
  await browser.close();
})();

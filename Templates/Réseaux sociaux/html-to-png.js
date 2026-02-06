const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function convertHtmlToPng(htmlPath, outputDir) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set high DPI for crisp output (2x for retina quality)
  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 2, // 2x resolution = 2160x2160 actual pixels
  });

  // Load the HTML file
  const absolutePath = path.resolve(htmlPath);
  await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0' });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  // Find all infographics
  const infographics = await page.$$('.infographic');

  console.log(`Found ${infographics.length} infographics`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Screenshot each infographic
  for (let i = 0; i < infographics.length; i++) {
    const element = infographics[i];
    const outputPath = path.join(outputDir, `infographie-${i + 1}.png`);

    await element.screenshot({
      path: outputPath,
      type: 'png',
    });

    console.log(`Saved: ${outputPath}`);
  }

  await browser.close();
  console.log('\nDone! All infographics exported.');
}

// Run the conversion
const htmlFile = process.argv[2] || './template-instagram.html';
const outputDir = process.argv[3] || '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /PNG';

convertHtmlToPng(htmlFile, outputDir).catch(console.error);

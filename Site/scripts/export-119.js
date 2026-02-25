const puppeteer = require('puppeteer');
const path = require('path');

const SRC = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Sources HTML';
const INSTA = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Insta & Autres';
const TIKTOK_V = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Tiktok Vertical';
const TIKTOK_H = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Tiktok Horizontal';

const slides = [
  { file: '119-audiovisuel-public-4-milliards.html', out: '119-audiovisuel-public-4-milliards', tiktok: true },
  { file: '119bis-audiovisuel-public-4-milliards.html', out: '119bis-audiovisuel-public-4-milliards', tiktok: false },
  { file: '119ter-audiovisuel-public-4-milliards.html', out: '119ter-audiovisuel-public-4-milliards', tiktok: false },
  { file: '119quater-audiovisuel-public-4-milliards.html', out: '119quater-audiovisuel-public-4-milliards', tiktok: false },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--allow-file-access-from-files'] });

  for (const slide of slides) {
    const url = 'file://' + path.join(SRC, slide.file);

    // Instagram 1080x1080
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      const el = await page.$('.infographic');
      await el.screenshot({ path: path.join(INSTA, slide.out + '-instagram.png') });
      console.log('OK Instagram:', slide.out);
      await page.close();
    }

    if (slide.tiktok) {
      // TikTok Vertical 1080x1920
      {
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
        await page.addStyleTag({ content: `
          .infographic { width: 1080px !important; height: 1920px !important; }
          .content { padding: 50px 30px 35px !important; }
          .logo { flex-direction: column !important; gap: 6px !important; }
          .logo-icon { font-size: 6rem !important; }
          .logo-text { font-size: 2.8rem !important; }
          .floating-logo { display: none !important; }
          .hook { font-size: 5rem !important; }
          .stat { font-size: 10rem !important; }
          .context { font-size: 4.5rem !important; }
          .main { justify-content: flex-start !important; padding-top: 80px !important; }
          .footer { position: absolute !important; bottom: 960px !important; left: 0 !important; right: 0 !important; padding: 0 30px !important; }
        `});
        const el = await page.$('.infographic');
        await el.screenshot({ path: path.join(TIKTOK_V, slide.out + '-tiktok-v.png') });
        console.log('OK TikTok V:', slide.out);
        await page.close();
      }

      // TikTok Horizontal 1080x600
      {
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 600, deviceScaleFactor: 2 });
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
        await page.addStyleTag({ content: `
          .infographic { width: 1080px !important; height: 600px !important; }
          .content { padding: 10px 15px !important; gap: 0 !important; justify-content: center !important; }
          .logo { display: none !important; }
          .floating-logo { display: none !important; }
          .hook { font-size: 3.5rem !important; line-height: 1.05 !important; }
          .stat { font-size: 12rem !important; line-height: 0.95 !important; white-space: nowrap !important; }
          .context { font-size: 3.5rem !important; line-height: 1.05 !important; }
          .footer { display: none !important; }
        `});
        await page.evaluate(() => {
          const stat = document.querySelector('.stat');
          if (stat) {
            const container = 1080 - 30;
            let fs = 192;
            stat.style.fontSize = fs + 'px';
            while (stat.scrollWidth > container && fs > 60) {
              fs -= 4;
              stat.style.fontSize = fs + 'px';
            }
          }
        });
        const el = await page.$('.infographic');
        await el.screenshot({ path: path.join(TIKTOK_H, slide.out + '-tiktok-h.png') });
        console.log('OK TikTok H:', slide.out);
        await page.close();
      }
    }
  }

  await browser.close();
  console.log('\nDone! All #119 exports complete.');
})();

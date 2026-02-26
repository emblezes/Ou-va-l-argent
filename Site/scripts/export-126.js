const puppeteer = require('puppeteer');
const path = require('path');

const SRC = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Sources HTML';
const INSTA = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Insta & Autres';
const TIKTOK_V = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Tiktok Vertical';
const TIKTOK_H = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Tiktok Horizontal';

const slides = [
  { file: '126-code-travail-france-vs-suisse.html', out: '126-code-travail-france-vs-suisse', tiktok: true },
  { file: '126bis-code-travail-france-vs-suisse.html', out: '126bis-code-travail-france-vs-suisse', tiktok: false },
  { file: '126ter-code-travail-france-vs-suisse.html', out: '126ter-code-travail-france-vs-suisse', tiktok: false },
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
          .title { font-size: 4rem !important; }
          .bar-amount { font-size: 4rem !important; }
          .bar-label { font-size: 2.5rem !important; }
          .bars-zone { padding-bottom: 0 !important; }
          .book-stack-fr { height: 750px !important; }
          .book-stack-ch { height: 42px !important; }
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
          .content { padding: 10px 30px !important; gap: 0 !important; }
          .logo { display: none !important; }
          .title { font-size: 2.5rem !important; margin-bottom: 5px !important; }
          .bars-zone { gap: 80px !important; padding-bottom: 0 !important; }
          .bar-amount { font-size: 2.5rem !important; }
          .bar-label { font-size: 1.6rem !important; }
          .bar-flag { font-size: 2rem !important; }
          .book-stack { width: 140px !important; }
          .book-stack-fr { height: 350px !important; }
          .book-stack-ch { height: 20px !important; }
          .footer { display: none !important; }
        `});
        const el = await page.$('.infographic');
        await el.screenshot({ path: path.join(TIKTOK_H, slide.out + '-tiktok-h.png') });
        console.log('OK TikTok H:', slide.out);
        await page.close();
      }
    }
  }

  await browser.close();
  console.log('\nDone! All #126 exports complete.');
})();

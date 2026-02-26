const puppeteer = require('puppeteer');
const path = require('path');

const SRC = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Sources HTML';
const INSTA = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Insta & Autres';
const TIKTOK_V = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Tiktok Vertical';
const TIKTOK_H = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Tiktok Horizontal';

const slides = [
  { file: '163-classement-pisa-maths.html', out: '163-classement-pisa-maths', tiktok: true },
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
          .content { padding: 50px 40px 35px !important; }
          .logo-icon { font-size: 4rem !important; }
          .logo-text { font-size: 2rem !important; }
          .title { font-size: 4rem !important; }
          .subtitle { font-size: 1.1rem !important; }
          .row { height: 58px !important; }
          .flag-col { font-size: 2.2rem !important; width: 44px !important; }
          .name-col { font-size: 1.35rem !important; width: 150px !important; }
          .score-col { font-size: 1.35rem !important; }
          .bar-col { height: 32px !important; }
          .bar { height: 32px !important; }
          .footer { position: absolute !important; bottom: 960px !important; left: 0 !important; right: 0 !important; padding: 0 40px !important; }
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
          .content { padding: 8px 30px 8px !important; }
          .header { margin-bottom: 2px !important; }
          .logo-icon { font-size: 1.8rem !important; }
          .logo-text { font-size: 0.9rem !important; }
          .title { font-size: 1.8rem !important; }
          .subtitle { font-size: 0.65rem !important; margin-bottom: 2px !important; }
          .row { height: 30px !important; gap: 6px !important; }
          .flag-col { font-size: 1rem !important; width: 22px !important; }
          .name-col { font-size: 0.7rem !important; width: 85px !important; }
          .bar-col { height: 16px !important; }
          .bar { height: 16px !important; border-radius: 2px !important; }
          .score-col { font-size: 0.7rem !important; width: 35px !important; }
          .footer { margin-top: 2px !important; }
          .source { font-size: 0.55rem !important; }
          .website { font-size: 0.75rem !important; }
        `});
        const el = await page.$('.infographic');
        await el.screenshot({ path: path.join(TIKTOK_H, slide.out + '-tiktok-h.png') });
        console.log('OK TikTok H:', slide.out);
        await page.close();
      }
    }
  }

  await browser.close();
  console.log('\nDone! All #163 exports complete.');
})();

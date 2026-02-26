const puppeteer = require('puppeteer');
const path = require('path');

const SRC = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Sources HTML';
const INSTA = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Insta & Autres';
const TIKTOK_V = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Tiktok Vertical';
const TIKTOK_H = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Infographies/Tiktok Horizontal';

const slides = [
  { file: '116-cout-eleve-recul-maths.html', out: '116-cout-eleve-recul-maths', tiktok: true },
  { file: '116bis-cout-eleve-recul-maths.html', out: '116bis-cout-eleve-recul-maths', tiktok: false },
  { file: '116ter-cout-eleve-recul-maths.html', out: '116ter-cout-eleve-recul-maths', tiktok: false },
  { file: '116quater-cout-eleve-recul-maths.html', out: '116quater-cout-eleve-recul-maths', tiktok: false },
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
          .title { font-size: 5rem !important; }
          .rank { font-size: 12rem !important; }
          .flag { font-size: 6rem !important; }
          .country { font-size: 3.5rem !important; }
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
          .title { font-size: 2.5rem !important; }
          .rank { font-size: 6rem !important; }
          .flag { font-size: 3rem !important; }
          .country { font-size: 2rem !important; }
          .math { display: none !important; }
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
  console.log('\nDone! All #116 exports complete.');
})();

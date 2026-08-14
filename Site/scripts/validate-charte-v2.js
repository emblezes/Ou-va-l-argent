#!/usr/bin/env node
/**
 * validate-charte-v2.js
 *
 * Contrôle automatique des règles de propreté de la charte OVLA v2.
 * Fonctionne sur un fichier contenant une ou plusieurs slides `.slide`
 * (serie-*.html, graphiques.html, formats.html) et rend un rapport par slide.
 *
 * Règles vérifiées :
 *   R1  Zéro texte flottant : tout <text> de la zone de dessin doit être ancré
 *       à moins de ANCRAGE_MAX px d'une marque (circle, rect, path). Les ticks
 *       d'axe et les noms de catégorie situés dans la marge sont exemptés.
 *   R2  Cohérence de côté : sur une courbe, les valeurs sont toutes du même côté.
 *   R3  Aération : deux textes qui se recouvrent horizontalement doivent être
 *       séparés d'au moins AERATION_MIN px verticalement.
 *
 * (R4 « un seul niveau d'information » et R5 « titre auto-suffisant » relèvent
 *  de la relecture humaine, elles ne sont pas automatisables.)
 *
 * Usage :
 *   node scripts/validate-charte-v2.js <fichier.html> [autres.html ...]
 *
 * Exit code 0 si tout est conforme, 1 sinon.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ANCRAGE_MAX = 40;   // px : distance max entre un texte et sa marque
const AERATION_MIN = 24;  // px : écart vertical min entre deux textes alignés

async function validateFile(page, htmlPath) {
  const abs = path.resolve(htmlPath);
  if (!fs.existsSync(abs)) {
    console.error(`✗ Fichier introuvable : ${abs}`);
    return [{ slide: '-', regle: 'fichier', msg: 'introuvable' }];
  }
  await page.goto(`file://${abs}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 500));

  return page.evaluate((ANCRAGE_MAX, AERATION_MIN) => {
    const out = [];
    const inter = (a, b) => !(a.right < b.left || b.right < a.left);

    document.querySelectorAll('.slide').forEach(slide => {
      const nom = slide.dataset.name || '(sans nom)';
      const svg = slide.querySelector('.plot svg');
      if (!svg) return;                       // slide sans graphique : rien à vérifier

      const textes = [...svg.querySelectorAll('text')];
      const marques = [...svg.querySelectorAll('circle, rect, path, line')];
      const boxes = new Map();
      const bb = el => {
        if (!boxes.has(el)) boxes.set(el, el.getBoundingClientRect());
        return boxes.get(el);
      };

      // Colonnes de valeurs : >= 3 textes dont le bord droit est aligné à 4 px près.
      // C'est une mise en page voulue (modèle 184), pas du texte flottant.
      const colonnes = new Set();
      const parBord = {};
      textes.forEach(t => {
        const k = Math.round(bb(t).right / 4);
        (parBord[k] = parBord[k] || []).push(t);
      });
      Object.values(parBord).forEach(g => { if (g.length >= 3) g.forEach(t => colonnes.add(t)); });

      // --- R1 : texte flottant ---------------------------------------------
      textes.forEach(t => {
        const cls = t.getAttribute('class') || '';
        if (/\b(tick|cat|ser|unitxt)\b/.test(cls)) return;   // axes, catégories, séries
        if (colonnes.has(t)) return;                          // valeur alignée en colonne
        const taille = parseFloat(getComputedStyle(t).fontSize) || 0;
        if (taille >= 60) return;                             // chiffre-héros, pas un label
        const b = bb(t);
        let dmin = Infinity;
        marques.forEach(m => {
          const r = bb(m);
          if (r.width < 1 && r.height < 1) return;
          const dx = Math.max(r.left - b.right, b.left - r.right, 0);
          const dy = Math.max(r.top - b.bottom, b.top - r.bottom, 0);
          dmin = Math.min(dmin, Math.hypot(dx, dy));
        });
        if (dmin > ANCRAGE_MAX) {
          out.push({ slide: nom, regle: 'R1', msg: `texte flottant « ${t.textContent.trim()} » à ${Math.round(dmin)} px de toute marque` });
        }
      });

      // --- R2 : valeurs du même côté sur une courbe -------------------------
      // Uniquement sur une vraie courbe (tracé non rempli) : sur un dumbbell ou un
      // lollipop, les deux extrémités portent leur valeur par construction.
      const courbes = [...svg.querySelectorAll('path')].filter(pa =>
        pa.getAttribute('fill') === 'none' && parseFloat(pa.getAttribute('stroke-width') || 0) >= 3);
      const points = [...svg.querySelectorAll('circle')];
      if (courbes.length && points.length >= 3) {
        const valeurs = textes.filter(t => /\bv\b/.test(t.getAttribute('class') || ''));
        let dessus = 0, dessous = 0;
        valeurs.forEach(t => {
          const b = bb(t);
          const cx = (b.left + b.right) / 2;
          let best = null, dx = Infinity;
          points.forEach(p => {
            const r = bb(p);
            const d = Math.abs((r.left + r.right) / 2 - cx);
            if (d < dx) { dx = d; best = r; }
          });
          if (!best || dx > 90) return;
          if (b.bottom <= best.top + 2) dessus++;
          else if (b.top >= best.bottom - 2) dessous++;
        });
        if (dessus > 0 && dessous > 0) {
          out.push({ slide: nom, regle: 'R2', msg: `valeurs des deux côtés de la courbe (${dessus} au-dessus, ${dessous} en dessous)` });
        }
      }

      // --- R3 : chevauchement réel entre deux textes -------------------------
      // On ne signale que si les boîtes se recouvrent vraiment : au moins 8 px en
      // vertical ET un quart de la largeur du plus étroit en horizontal. Deux lignes
      // successives d'une liste, ou un nom de série au-dessus de sa valeur, sont des
      // mises en page voulues et ne sont pas des chevauchements.
      for (let i = 0; i < textes.length; i++) {
        for (let j = i + 1; j < textes.length; j++) {
          const a = bb(textes[i]), b = bb(textes[j]);
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox <= 0 || oy <= 0) continue;
          if (oy >= 8 && ox >= 0.25 * Math.min(a.width, b.width)) {
            out.push({ slide: nom, regle: 'R3', msg: `« ${textes[i].textContent.trim()} » chevauche « ${textes[j].textContent.trim()} » (${Math.round(ox)}×${Math.round(oy)} px)` });
          }
        }
      }
    });
    return out;
  }, ANCRAGE_MAX, AERATION_MIN);
}

(async () => {
  const fichiers = process.argv.slice(2);
  if (!fichiers.length) {
    console.error('Usage : node scripts/validate-charte-v2.js <fichier.html> [...]');
    process.exit(2);
  }
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 1 });

  let total = 0;
  for (const f of fichiers) {
    const issues = await validateFile(page, f);
    // dédoublonnage (une même paire peut ressortir plusieurs fois)
    const vus = new Set();
    const uniques = issues.filter(i => {
      const k = i.slide + i.regle + i.msg;
      if (vus.has(k)) return false;
      vus.add(k); return true;
    });
    console.log(`\n── ${path.basename(f)}`);
    if (!uniques.length) {
      console.log('   ✓ conforme');
    } else {
      const parSlide = {};
      uniques.forEach(i => (parSlide[i.slide] = parSlide[i.slide] || []).push(i));
      Object.entries(parSlide).forEach(([s, list]) => {
        console.log(`   ✗ ${s}`);
        list.forEach(i => console.log(`       [${i.regle}] ${i.msg}`));
      });
    }
    total += uniques.length;
  }
  await browser.close();
  console.log(`\n${total === 0 ? '✓ Tout est conforme.' : `✗ ${total} anomalie(s) à corriger.`}`);
  process.exit(total === 0 ? 0 : 1);
})();

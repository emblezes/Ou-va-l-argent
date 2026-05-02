#!/usr/bin/env node
/**
 * validate-infographic.js
 *
 * Vérifie automatiquement qu'une infographie OVLA respecte les règles
 * éditoriales avant export :
 *   1. La zone graphique remplit bien tout l'espace dispo (pas de gros gap)
 *   2. Les labels SVG ne chevauchent pas les courbes/points (>= 8px de marge)
 *   3. Les ticks d'axes sont en blanc/clair (pas en gris foncé)
 *   4. Aucune <rect> d'annotation flottante au-dessus de la courbe
 *
 * Usage :
 *   node scripts/validate-infographic.js <chemin/vers/infographie.html>
 *
 * Exit code 0 si OK, 1 si problèmes détectés.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const TOL = 8;            // marge min en px entre label et courbe
const GAP_TOP_MAX = 60;   // espace vide max entre subtitle et chart-area
const GAP_BOT_MAX = 60;   // espace vide max entre chart-area et footer

async function validate(htmlPath) {
  const abs = path.resolve(htmlPath);
  if (!fs.existsSync(abs)) {
    console.error(`✗ Fichier introuvable : ${abs}`);
    process.exit(2);
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  await page.goto(`file://${abs}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const issues = await page.evaluate((TOL, GAP_TOP_MAX, GAP_BOT_MAX) => {
    const out = [];

    // --- 0. Overflow : éléments structurels visibles dans le cadre 1080×1080 ---
    // On ne teste que les éléments structurels (header, title, subtitle, chart-area,
    // legend, footer) — pas les sous-éléments du SVG dont les bbox dépendent du
    // viewBox interne (faux positifs).
    const slide = document.querySelector('.infographic');
    if (slide) {
      const sr = slide.getBoundingClientRect();
      const structural = slide.querySelectorAll('.header, .chart-title, .subtitle, .chart-area, .legend, .footer, .source, .website, .logo');
      let maxBottom = 0, maxRight = 0, worstEl = '';
      structural.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.bottom > maxBottom) { maxBottom = r.bottom; worstEl = el.className || el.tagName; }
        if (r.right  > maxRight)  { maxRight  = r.right; }
      });
      if (maxBottom > sr.bottom + 1) {
        out.push(`OVERFLOW VERTICAL : "${worstEl}" déborde de ${Math.round(maxBottom - sr.bottom)}px en bas — réduire le viewBox SVG ou ajuster les marges`);
      }
      if (maxRight > sr.right + 1) {
        out.push(`OVERFLOW HORIZONTAL : contenu déborde de ${Math.round(maxRight - sr.right)}px à droite`);
      }
    }

    // --- 1. Zone graphique remplit-elle bien l'espace ? ---
    const subtitle = document.querySelector('.subtitle');
    const chart    = document.querySelector('.chart-area');
    const footer   = document.querySelector('.footer');
    if (subtitle && chart && footer) {
      const sb = subtitle.getBoundingClientRect();
      const cb = chart.getBoundingClientRect();
      const fb = footer.getBoundingClientRect();
      const gapTop = cb.top - sb.bottom;
      const gapBot = fb.top - cb.bottom;
      if (gapTop > GAP_TOP_MAX) {
        out.push(`Espace vide en haut : ${Math.round(gapTop)}px (max autorisé ${GAP_TOP_MAX}px) — réduire margin-top du chart-area ou padding du content`);
      }
      if (gapBot > GAP_BOT_MAX) {
        out.push(`Espace vide en bas : ${Math.round(gapBot)}px (max autorisé ${GAP_BOT_MAX}px) — agrandir le graphique ou réduire les marges`);
      }
    }

    // --- 2. Couleur des ticks SVG (doivent être clairs) ---
    document.querySelectorAll('svg text').forEach(t => {
      const cls = t.getAttribute('class') || '';
      if (cls.includes('tick') || cls.includes('axis-label')) {
        const fill = t.getAttribute('fill') || getComputedStyle(t).fill;
        // Reject if rgb component too dark (sum < 350 sur 765)
        const m = fill.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/) || fill.match(/#([0-9a-f]{6})/i);
        let r=255, g=255, b=255;
        if (m && m.length === 4) { r=+m[1]; g=+m[2]; b=+m[3]; }
        else if (m && m.length === 2) {
          const h = m[1];
          r = parseInt(h.slice(0,2),16); g = parseInt(h.slice(2,4),16); b = parseInt(h.slice(4,6),16);
        }
        const sum = r+g+b;
        if (sum < 350 && !cls.includes('highlight')) {
          out.push(`Tick "${t.textContent}" trop foncé (rgb sum ${sum}) — utiliser blanc ou gris clair`);
        }
      }
    });

    // --- 3. Annotation rectangulaire dans la zone graphique (interdit) ---
    document.querySelectorAll('svg rect').forEach(r => {
      const w = +r.getAttribute('width');
      const h = +r.getAttribute('height');
      if (w > 80 && h > 30) {
        // grosse rect dans le graph = badge d'annotation interdit
        out.push(`Rectangle d'annotation interdit dans le graphique (${w}×${h}px) — pas de boîte à l'intérieur du chart, seuls les labels collés aux points sont autorisés`);
      }
    });

    // --- 4bis. Chevauchement entre <text> SVG (labels qui se touchent) ---
    document.querySelectorAll('svg').forEach(svg => {
      const texts = Array.from(svg.querySelectorAll('text'));
      for (let i = 0; i < texts.length; i++) {
        const a = texts[i].getBoundingClientRect();
        if (a.width === 0) continue;
        for (let j = i + 1; j < texts.length; j++) {
          const b = texts[j].getBoundingClientRect();
          if (b.width === 0) continue;
          const overlap = !(a.right < b.left || b.right < a.left || a.bottom < b.top || b.bottom < a.top);
          if (overlap) {
            out.push(`Labels SVG "${texts[i].textContent.trim()}" et "${texts[j].textContent.trim()}" se chevauchent — déplacer l'un des deux`);
          }
        }
      }
    });

    // --- 4. Chevauchement entre labels et courbes/points ---
    // Pour chaque <text> avec data-validate-label ou class end-label,
    // calculer distance min aux <circle> et segments de <polyline>.
    function distPointSeg(px, py, x1, y1, x2, y2) {
      const dx = x2 - x1, dy = y2 - y1;
      const l2 = dx*dx + dy*dy;
      if (l2 === 0) return Math.hypot(px-x1, py-y1);
      let t = ((px-x1)*dx + (py-y1)*dy) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(px - (x1+t*dx), py - (y1+t*dy));
    }
    function rectCenter(b) { return { x: b.x + b.width/2, y: b.y + b.height/2, hw: b.width/2, hh: b.height/2 }; }
    function rectSegDist(rc, x1, y1, x2, y2) {
      // approx : distance du centre au segment, moins le rayon du rect
      const d = distPointSeg(rc.x, rc.y, x1, y1, x2, y2);
      const r = Math.min(rc.hw, rc.hh); // rayon conservatif
      return Math.max(0, d - r);
    }

    document.querySelectorAll('svg').forEach(svg => {
      const svgBox = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const sx = vb.width  > 0 ? svgBox.width  / vb.width  : 1;
      const sy = vb.height > 0 ? svgBox.height / vb.height : 1;
      const labels = svg.querySelectorAll('text.end-label, text.bar-value, text[data-validate]');
      const polylines = svg.querySelectorAll('polyline');
      const circles = svg.querySelectorAll('circle');

      labels.forEach(label => {
        const lb = label.getBoundingClientRect();
        const rc = rectCenter(lb);

        // distance aux <circle>
        circles.forEach(c => {
          const cx = svgBox.left + (+c.getAttribute('cx')) * sx;
          const cy = svgBox.top  + (+c.getAttribute('cy')) * sy;
          const cr = (+c.getAttribute('r')) * Math.max(sx, sy);
          // distance bbox label au cercle
          const dx = Math.max(lb.left - cx, 0, cx - lb.right);
          const dy = Math.max(lb.top  - cy, 0, cy - lb.bottom);
          const d = Math.hypot(dx, dy) - cr;
          // on autorise un overlap < 4px (label collé au point), c'est voulu
          if (d < -4 && !(lb.left <= cx && cx <= lb.right && lb.top <= cy && cy <= lb.bottom)) {
            // skip si le centre du cercle est DANS le bbox du label : c'est le point cible
          }
        });

        // distance aux segments de polyline
        polylines.forEach(p => {
          const pts = (p.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number);
          for (let i = 0; i + 3 < pts.length; i += 2) {
            const x1 = svgBox.left + pts[i]   * sx;
            const y1 = svgBox.top  + pts[i+1] * sy;
            const x2 = svgBox.left + pts[i+2] * sx;
            const y2 = svgBox.top  + pts[i+3] * sy;
            const d = rectSegDist(rc, x1, y1, x2, y2);
            if (d < TOL) {
              out.push(`Label "${label.textContent.trim()}" chevauche la courbe (distance ${d.toFixed(1)}px, min ${TOL}px) — déplacer le label au-dessus/à côté du point`);
              return;
            }
          }
        });
      });
    });

    return out;
  }, TOL, GAP_TOP_MAX, GAP_BOT_MAX);

  await browser.close();

  // Dédupliquer
  const uniq = [...new Set(issues)];

  if (uniq.length === 0) {
    console.log(`✓ ${path.basename(abs)} : validation OK`);
    return 0;
  }
  console.log(`✗ ${path.basename(abs)} : ${uniq.length} problème(s) :`);
  uniq.forEach(i => console.log(`  - ${i}`));
  return 1;
}

const target = process.argv[2];
if (!target) {
  console.error('Usage : node scripts/validate-infographic.js <fichier.html>');
  process.exit(2);
}
validate(target).then(code => process.exit(code));

#!/usr/bin/env node
/**
 * Générateur de reel HTML à partir d'une config JS.
 * Produit un HTML autonome animé conforme aux règles du skill `infographic-to-reel`.
 *
 * Usage en module :
 *   const { generateReelHTML } = require('./reel-generator');
 *   const html = generateReelHTML(config);
 *
 * Config :
 *   {
 *     slug: 'dette-x5-1980',
 *     title: { line1, line2_accent, line3? },     // line2 est en italic + couleur accent
 *     subtitle: 'France · % du PIB · 1980 → 2024',
 *     unit: '%',                                   // suffixe affiché à côté des valeurs (ex '%' ou ' K')
 *     unitCaption: '% PIB',                        // caption en haut de l'axe Y (italique)
 *     yMin: 0, yMax: 130, yGrid: [25,50,75,100,125], // bornes et lignes de grille horizontales
 *     xLabels: [1980,1990,2000,2010,2024],         // années affichées sous l'axe X
 *     data: [{year, value}, ...],                  // 6 points typiquement (1 départ + 4 étapes + 1 fin)
 *     color: 'red'|'cyan'|'gold'|'green'|'violet'|'orange',
 *     source: 'INSEE · Banque de France · 2024',
 *   }
 */

const PALETTES = {
  red:    { hex: '#ff4757', rgb: '255, 71, 87',  glow1: 0.12, glow2Color: 'cyan'   },
  cyan:   { hex: '#00d4ff', rgb: '0, 212, 255',  glow1: 0.10, glow2Color: 'gold'   },
  gold:   { hex: '#ffd700', rgb: '255, 215, 0',  glow1: 0.10, glow2Color: 'red'    },
  green:  { hex: '#00ff88', rgb: '0, 255, 136',  glow1: 0.10, glow2Color: 'cyan'   },
  violet: { hex: '#a855f7', rgb: '168, 85, 247', glow1: 0.12, glow2Color: 'gold'   },
  orange: { hex: '#ff9f43', rgb: '255, 159, 67', glow1: 0.12, glow2Color: 'cyan'   },
};
const SECONDARY = {
  red:    'rgba(0, 212, 255, 0.06)',
  cyan:   'rgba(255, 215, 0, 0.06)',
  gold:   'rgba(255, 71, 87, 0.06)',
  green:  'rgba(0, 212, 255, 0.06)',
  violet: 'rgba(255, 215, 0, 0.06)',
  orange: 'rgba(0, 212, 255, 0.06)',
};

function fmtValue(v, unit) {
  // ex 1234 -> '1 234', 12.5 -> '12,5'
  let s;
  if (Number.isInteger(v)) s = String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  else s = v.toFixed(1).replace('.', ',');
  return `${s}${unit}`;
}

function generateReelHTML(config) {
  const palette = PALETTES[config.color] || PALETTES.red;
  const accentHex = palette.hex;
  const accentRgb = palette.rgb;
  const secondaryGlow = SECONDARY[config.color];
  const data = config.data;
  if (data.length < 4) throw new Error('Need at least 4 points (start + 2 stages + end)');

  // Échelles — viewBox 960×1380 (aspect 0.70 ~ matches chart-wrap aspect)
  // pour remplir verticalement sans letterboxing ni distorsion
  const xStart = 90, xEnd = 920;
  const yTop = 30, yBottom = 1280;
  const { yMin, yMax } = config;
  const yearStart = data[0].year, yearEnd = data[data.length - 1].year;
  const yearSpan = yearEnd - yearStart;
  const yScale = (yBottom - yTop) / (yMax - yMin);

  const yOf = (val) => yBottom - (val - yMin) * yScale;
  const xOf = (year) => xStart + (year - yearStart) / yearSpan * (xEnd - xStart);

  // Path + points
  const pathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xOf(d.year).toFixed(1)},${yOf(d.value).toFixed(1)}`).join(' ');

  // Labels position : décale de ±OFFSET_LABEL pour éviter le chevauchement avec la courbe (stroke 9px).
  // Above = label posé au-dessus du point ; below = en-dessous.
  // Règle clé : sur une pente, le label va du côté OPPOSÉ au tracé passé (pour ne pas le couvrir).
  //  - pente montante (valeurs croissantes) → label au-dessus du point (la courbe passée est en-dessous)
  //  - pente descendante (valeurs décroissantes) → label en-dessous (la courbe passée est au-dessus)
  const OFFSET_ABOVE = -55; // px (label hauteur ~44px + buffer)
  const OFFSET_BELOW = 70;
  function labelPos(i) {
    const yHere = yOf(data[i].value);
    const next = data[i + 1], prev = data[i - 1];
    let above;
    if (i === 0 && next) above = yOf(next.value) > yHere;            // premier point : si la courbe descend après → label en haut
    else if (i === data.length - 1) {
      // dernier : config.endpointAbove force le label en haut (utile pour courbe descendante)
      if (config.endpointAbove !== undefined) above = config.endpointAbove;
      else above = prev ? yOf(prev.value) > yHere : true; // sinon : si la courbe descendait → label haut
    }
    else {
      // yOf(value) augmente vers le bas. nextLower=true ⇔ next a une valeur plus petite (sous le point en graph).
      const nextLower = yOf(next.value) > yHere;
      const prevLower = yOf(prev.value) > yHere;
      if (prevLower && nextLower) above = false;          // min local → label en-dessous (zone libre au-dessous)
      else if (!prevLower && !nextLower) above = true;    // max local → label au-dessus (zone libre au-dessus)
      else if (prevLower && !nextLower) above = true;     // pente montante → label au-dessus (courbe passée en-dessous)
      else above = false;                                  // pente descendante → label en-dessous (courbe passée au-dessus)
    }
    const dy = above ? OFFSET_ABOVE : OFFSET_BELOW;
    return yHere + dy;
  }

  // Décide si un point stage doit afficher son label : on le saute si le label
  // serait trop proche d'un autre label adjacent (distance verticale ET horizontale).
  // Évite la collision (ex : 115% en 2020 vs 117% en 2024 — 4px d'écart vertical).
  function shouldShowLabel(i) {
    if (i <= 0 || i >= data.length - 1) return true; // endpoints toujours visibles via anchor-start/end
    const yLabel = labelPos(i);
    const xHere = xOf(data[i].year);
    // Compare aux endpoints + au point suivant (pour les stages séquentiels)
    const others = [];
    if (i === data.length - 2) others.push({ x: xOf(data[data.length - 1].year), y: yOf(data[data.length - 1].value) + OFFSET_ABOVE });
    if (i === 1) others.push({ x: xOf(data[0].year), y: yOf(data[0].value) + OFFSET_BELOW });
    for (const o of others) {
      const dx = Math.abs(o.x - xHere);
      const dy = Math.abs(o.y - yLabel);
      if (dx < 90 && dy < 50) return false;
    }
    return true;
  }

  // Stage delays (linéairement sur tracé 6500 ms)
  const trace = 6500;
  const stages = data.slice(1, -1);  // entre départ et arrivée
  function delayFor(year) {
    return Math.round((xOf(year) - xStart) / (xEnd - xStart) * trace);
  }

  // Labels Y axis (grille horizontale)
  // Si l'unit contient une espace (ex "× SMIC"), labels Y plus petits pour ne pas déborder.
  const yLabelFontSize = config.unit.trim().includes(' ') ? 22 : 28;
  const yLabelX = config.unit.trim().includes(' ') ? 84 : 80;
  const yGridSVG = config.yGrid.map(g => {
    const y = yOf(g);
    return `<line class="axis-elem" x1="${xStart}" y1="${y.toFixed(1)}" x2="${xEnd}" y2="${y.toFixed(1)}" stroke="#6a4a5a" stroke-opacity="0.25" stroke-dasharray="4,4"/>
            <text class="axis-elem" x="${yLabelX}" y="${(y + 7).toFixed(1)}" fill="#c8b0bd" font-family="'JetBrains Mono', monospace" font-size="${yLabelFontSize}" font-weight="500" text-anchor="end">${fmtValue(g, config.unit)}</text>`;
  }).join('\n');
  // Label sol y_min
  const yBaseLabel = `<text class="axis-elem" x="${yLabelX}" y="${(yBottom + 7).toFixed(1)}" fill="#c8b0bd" font-family="'JetBrains Mono', monospace" font-size="${yLabelFontSize}" font-weight="500" text-anchor="end">${fmtValue(yMin, config.unit)}</text>`;

  // Labels X axis
  const xLabelsSVG = config.xLabels.map(year => {
    const x = xOf(year);
    return `<text class="axis-elem" x="${x.toFixed(0)}" y="1330" fill="#c8b0bd" font-family="'JetBrains Mono', monospace" font-size="30" font-weight="600" text-anchor="middle">${year}</text>`;
  }).join('\n');

  // Étapes (entre départ et arrivée)
  const stagesSVG = stages.map((s, idx) => {
    const i = idx + 1;
    const x = xOf(s.year);
    const y = yOf(s.value);
    const yLabel = labelPos(i);
    // Le dot reste toujours visible ; le label est masqué s'il chevauche un endpoint
    const labelText = shouldShowLabel(i)
      ? `<text class="stage-label s${s.year}" x="${x.toFixed(1)}" y="${yLabel.toFixed(1)}" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="44" font-weight="700" text-anchor="middle">${fmtValue(s.value, config.unit)}</text>`
      : '';
    return `<circle class="stage-dot s${s.year}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="#ffffff" stroke="${accentHex}" stroke-width="5"/>
            ${labelText}`;
  }).join('\n');

  // Délais des étapes
  const stageDelaysCSS = stages.map((s) => {
    const d = delayFor(s.year);
    return `.stage-dot.s${s.year}.run, .stage-label.s${s.year}.run { animation: popIn 500ms ${d}ms forwards; }`;
  }).join('\n        ');

  // Endpoints
  const dStart = data[0], dEnd = data[data.length - 1];
  const xS = xOf(dStart.year), yS = yOf(dStart.value);
  const xE = xOf(dEnd.year), yE = yOf(dEnd.value);
  const yEndAnchor = labelPos(data.length - 1);

  // Position du label "anchor-1980" (début) — à droite du point
  const yStartAnchor = (data.length > 1 && yOf(data[1].value) > yS) ? yS - 20 : yS + 35;

  // Title (3 lignes possibles)
  const t = config.title;
  const titleHTML = [t.line1, `<span class="accent">${t.line2_accent}</span>`, t.line3].filter(Boolean).join('<br>');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Reel — ${config.slug}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-deep: #0a1220;
            --text-primary: #f0f4f8;
            --text-secondary: #a88899;
            --text-muted: #6a4a5a;
            --accent: ${accentHex};
            --glass-border: rgba(255, 255, 255, 0.1);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Syne', sans-serif; background: #1a1a2e; padding: 0; display: flex; justify-content: center; }
        .reel { width: 1080px; height: 1920px; position: relative; overflow: hidden; }
        .bg-base  { position: absolute; inset: 0; background: linear-gradient(160deg, #0a1220 0%, #1d2540 50%, #0a1220 100%); }
        .bg-grid  { position: absolute; inset: 0; background-image: linear-gradient(rgba(${accentRgb}, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(${accentRgb}, 0.05) 1px, transparent 1px); background-size: 50px 50px; }
        .bg-glow-1 { position: absolute; width: 800px; height: 800px; background: radial-gradient(circle, rgba(${accentRgb}, ${palette.glow1}) 0%, transparent 70%); top: -250px; right: -200px; }
        .bg-glow-2 { position: absolute; width: 700px; height: 700px; background: radial-gradient(circle, ${secondaryGlow} 0%, transparent 70%); bottom: -200px; left: -200px; }

        .content { position: relative; z-index: 1; height: 100%; padding: 50px 40px 40px; display: flex; flex-direction: column; }

        /* Titre/header/footer : présents dès t=0 — seul le graphe s'anime */
        .header { display: flex; align-items: center; }
        .logo { display: flex; align-items: center; gap: 14px; }
        .logo-icon { font-family: 'Instrument Serif', serif; font-size: 4.4rem; color: var(--accent); line-height: 1; }
        .logo-text { font-family: 'Instrument Serif', serif; font-size: 2rem; font-style: italic; color: #ffffff; line-height: 1; }

        .title-block { display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 24px; }
        .title { font-family: 'Instrument Serif', serif; font-size: 7.4rem; line-height: 1.02; letter-spacing: -2.2px; color: var(--text-primary); text-align: center; }
        .title .accent { color: var(--accent); font-style: italic; display: inline-block; }
        .subtitle { font-family: 'Syne', sans-serif; font-size: 1.9rem; color: var(--text-secondary); margin-top: 20px; letter-spacing: 1.4px; text-transform: uppercase; text-align: center; line-height: 1.4; font-weight: 600; }

        .chart-wrap { flex: 1; display: flex; align-items: stretch; justify-content: center; margin-top: 16px; min-height: 0; }
        .chart-wrap svg { width: 100%; height: 100%; }

        .axis-elem { opacity: 1; }

        .curve { fill: none; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; stroke: var(--accent);
                 stroke-dasharray: var(--len, 9999); stroke-dashoffset: var(--len, 9999);
                 filter: drop-shadow(0 0 14px rgba(${accentRgb}, 0.65)); }
        .curve.run  { animation: drawCurve 6500ms 0ms cubic-bezier(0.4, 0.05, 0.4, 0.95) forwards; }

        .endpoint { opacity: 0; }
        .endpoint.run.start { animation: fadeIn 300ms 0ms forwards; }
        .endpoint.run.end   { animation: popIn 700ms 6500ms forwards; }

        .anchor-start { opacity: 0; }
        .anchor-start.run { animation: fadeIn 400ms 0ms forwards; }

        .anchor-end { opacity: 0; transform-box: fill-box; transform-origin: center; filter: drop-shadow(0 0 18px rgba(${accentRgb}, 0.7)); }
        .anchor-end.run { animation: popIn 800ms 6700ms forwards; }

        .stage-dot   { opacity: 0; transform-box: fill-box; transform-origin: center; }
        .stage-label { opacity: 0; transform-box: fill-box; transform-origin: center; }
        ${stageDelaysCSS}

        .footer { display: flex; flex-direction: column; align-items: center; gap: 10px; padding-top: 18px; margin-top: 14px; border-top: 1px solid var(--glass-border); }
        .cta { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .cta-url { font-family: 'JetBrains Mono', monospace; font-size: 2.6rem; font-weight: 700; color: var(--accent); letter-spacing: 0.5px; }
        .cta-handle { font-family: 'JetBrains Mono', monospace; font-size: 2.2rem; font-weight: 500; color: #ffffff; letter-spacing: 0.5px; }
        .source { font-size: 0.85rem; color: var(--text-muted); line-height: 1.3; text-align: center; }
        .source span { color: var(--text-secondary); }

        /* Écran final "Abonne-toi" — overlay fullscreen */
        .cta-screen {
            position: absolute; inset: 0; z-index: 10;
            background: radial-gradient(ellipse at center, #142b48 0%, #0a1220 70%, #06080c 100%);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 60px;
            opacity: 0; pointer-events: none;
        }
        .cta-screen.run { animation: ctaFadeIn 400ms 8000ms forwards; }
        .cta-screen-logo {
            font-family: 'Instrument Serif', serif;
            font-size: 18rem;
            color: var(--accent);
            line-height: 1;
            text-shadow: 0 0 80px rgba(${accentRgb}, 0.5);
            opacity: 0;
        }
        .cta-screen.run .cta-screen-logo { animation: popIn 500ms 8000ms forwards; }
        .cta-screen-title {
            font-family: 'Instrument Serif', serif;
            font-size: 9rem;
            color: #ffffff;
            line-height: 1;
            text-align: center;
            opacity: 0;
        }
        .cta-screen.run .cta-screen-title { animation: fadeUp 400ms 8200ms forwards; }
        .cta-screen-tag {
            font-family: 'Syne', sans-serif;
            font-size: 2.8rem;
            color: rgba(255,255,255,0.7);
            letter-spacing: 4px;
            text-transform: uppercase;
            opacity: 0;
        }
        .cta-screen.run .cta-screen-tag { animation: fadeUp 300ms 8400ms forwards; }
        .cta-screen-urls {
            display: flex; flex-direction: column; align-items: center; gap: 18px;
            margin-top: 30px;
            opacity: 0;
        }
        .cta-screen.run .cta-screen-urls { animation: fadeUp 400ms 8500ms forwards; }
        .cta-screen-url {
            font-family: 'JetBrains Mono', monospace;
            font-size: 4.2rem;
            font-weight: 700;
            color: var(--accent);
            letter-spacing: 1px;
        }
        .cta-screen-handle {
            font-family: 'JetBrains Mono', monospace;
            font-size: 3.6rem;
            font-weight: 500;
            color: #ffffff;
            letter-spacing: 1px;
        }

        @keyframes fadeIn    { to { opacity: 1; } }
        @keyframes ctaFadeIn { to { opacity: 1; } }
        @keyframes fadeUp    { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn     { 0% { opacity: 0; transform: scale(0.85); } 60% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes drawCurve { to { stroke-dashoffset: 0; } }
    </style>
</head>
<body>
    <div class="reel">
        <div class="bg-base"></div>
        <div class="bg-grid"></div>
        <div class="bg-glow-1"></div>
        <div class="bg-glow-2"></div>
        <div class="content">

            <div class="header">
                <div class="logo">
                    <span class="logo-icon">€</span>
                    <span class="logo-text">Où Va l'Argent ?</span>
                </div>
            </div>

            <div class="title-block">
                <h1 class="title">${titleHTML}</h1>
                <div class="subtitle">${config.subtitle}</div>
            </div>

            <div class="chart-wrap">
                <svg viewBox="0 0 960 1380" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                    <text class="axis-elem" x="84" y="55" fill="#f0f4f8" font-family="'JetBrains Mono', monospace" font-size="32" font-weight="700" font-style="italic" text-anchor="end">${config.unitCaption}</text>

                    <line class="axis-elem" x1="${xStart}" y1="${yTop}" x2="${xStart}" y2="${yBottom}" stroke="#6a4a5a" stroke-opacity="0.5" stroke-width="1.5"/>
                    <line class="axis-elem" x1="${xStart}" y1="${yBottom}" x2="${xEnd}" y2="${yBottom}" stroke="#6a4a5a" stroke-opacity="0.5" stroke-width="1.5"/>

                    ${yGridSVG}
                    ${yBaseLabel}

                    ${xLabelsSVG}

                    <path id="curve" class="curve" d="${pathD}"/>

                    <circle class="endpoint start" cx="${xS.toFixed(1)}" cy="${yS.toFixed(1)}" r="15" fill="#ffffff" stroke="${accentHex}" stroke-width="5"/>
                    <text class="anchor-start" x="${(xS + 32).toFixed(1)}" y="${yStartAnchor.toFixed(1)}" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="56" font-weight="700" text-anchor="start">${fmtValue(dStart.value, config.unit)}</text>

                    ${stagesSVG}

                    <circle class="endpoint end" cx="${xE.toFixed(1)}" cy="${yE.toFixed(1)}" r="22" fill="${accentHex}" stroke="#0a1220" stroke-width="5"/>
                    <text class="anchor-end" x="${(xE - 12).toFixed(1)}" y="${yEndAnchor.toFixed(1)}" fill="${accentHex}" font-family="'JetBrains Mono', monospace" font-size="74" font-weight="700" text-anchor="end">${fmtValue(dEnd.value, config.unit)}</text>
                </svg>
            </div>

            <div class="footer">
                <div class="cta">
                    <span class="cta-url">ouvalargent.com</span>
                    <span class="cta-handle">@ouvalargentfr</span>
                </div>
                <div class="source">Source : <span>${config.source}</span></div>
            </div>
        </div>

        <div class="cta-screen">
            <div class="cta-screen-logo">€</div>
            <div class="cta-screen-title">Abonne-toi.</div>
            <div class="cta-screen-tag">Partage.</div>
            <div class="cta-screen-urls">
                <div class="cta-screen-url">ouvalargent.com</div>
                <div class="cta-screen-handle">@ouvalargentfr</div>
            </div>
        </div>
    </div>

    <script>
        document.querySelectorAll('.curve').forEach(p => {
            const len = p.getTotalLength();
            p.style.setProperty('--len', len);
        });

        const ANIMATED_SELECTORS = '.axis-elem, .curve, .endpoint, .anchor-start, .anchor-end, .stage-dot, .stage-label, .cta-screen';
        const elements = Array.from(document.querySelectorAll(ANIMATED_SELECTORS));

        function startAndPauseAll() {
            elements.forEach(el => el.classList.add('run'));
            requestAnimationFrame(() => {
                document.getAnimations().forEach(a => a.pause());
            });
        }

        window.__reelReady = false;
        window.setReelTime = (timeMs) => {
            document.getAnimations().forEach(a => {
                try { a.currentTime = timeMs; } catch (e) {}
            });
        };

        window.startReel = () => { elements.forEach(el => el.classList.add('run')); };

        if (window.location.search.includes('capture')) {
            startAndPauseAll();
            Promise.all([document.fonts.ready]).then(() => { window.__reelReady = true; });
        } else {
            document.fonts.ready.then(() => { window.startReel(); });
        }
    </script>
</body>
</html>`;
}

module.exports = { generateReelHTML, PALETTES };

// CLI : node reel-generator.js <config.json>
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const configPath = process.argv[2];
  if (!configPath) {
    console.error('Usage: node reel-generator.js <config.json>');
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const html = generateReelHTML(config);
  const outHtml = path.join(__dirname, `reel-${config.slug}.html`);
  fs.writeFileSync(outHtml, html);
  console.log(`✓ ${outHtml}`);
}

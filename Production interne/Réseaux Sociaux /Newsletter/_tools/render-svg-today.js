const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const os = require('os');
const path = require('path');

const F = path.join(os.homedir(), '.fonts');
const fontFiles = [
  'InstrumentSerif-Regular.ttf','InstrumentSerif-Italic.ttf',
  'Syne-Regular.ttf','Syne-Bold.ttf',
  'JetBrainsMono-Regular.ttf','JetBrainsMono-Medium.ttf','JetBrainsMono-Bold.ttf'
].map(f => path.join(F, f));

const C = {
  bgDeep:'#0a1220', bgMid:'#142b48',
  textPrimary:'#f0f4f8', textSecondary:'#8899a8', textMuted:'#4a5a6a',
  red:'#ff4757', elec:'#00d4ff'
};

// shared defs: gradient bg, grid, glows
function defs(glow){
  const glowColor = glow === 'elec' ? '0,212,255' : '255,71,87';
  const glowOpacity = glow === 'elec' ? 0.12 : 0.10;
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1080" y2="1080" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${C.bgDeep}"/>
      <stop offset="50%" stop-color="${C.bgMid}"/>
      <stop offset="100%" stop-color="${C.bgDeep}"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="rgba(0,212,255,0.04)" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(${glowColor},${glowOpacity})"/>
      <stop offset="70%" stop-color="rgba(${glowColor},0)"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,212,255,0.06)"/>
      <stop offset="70%" stop-color="rgba(0,212,255,0)"/>
    </radialGradient>
    <linearGradient id="barNeutral" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4a6580"/><stop offset="100%" stop-color="#2d4060"/>
    </linearGradient>
    <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff4757"/><stop offset="100%" stop-color="#c0263a"/>
    </linearGradient>
  </defs>`;
}

function frame(glow){
  return `
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <rect width="1080" height="1080" fill="url(#grid)"/>
  <rect x="380" y="-250" width="700" height="700" fill="url(#glow1)"/>
  <rect x="-150" y="780" width="500" height="500" fill="url(#glow2)"/>`;
}

const IS = "Instrument Serif", SY = "Syne", JB = "JetBrains Mono";

function logo(){
  return `
  <text x="60" y="98" font-family="${IS}" font-size="58" fill="${C.elec}">€</text>
  <text x="108" y="92" font-family="${IS}" font-size="27" font-style="italic" fill="#ffffff">Où Va l'Argent ?</text>`;
}

function footer(src){
  return `
  <line x1="60" y1="1006" x2="1020" y2="1006" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="60" y="1042" font-family="${SY}" font-size="15" fill="${C.textMuted}">Source : <tspan fill="${C.textSecondary}">${src}</tspan></text>
  <text x="1020" y="1036" text-anchor="end" font-family="${JB}" font-size="22" font-weight="600" fill="${C.elec}">ouvalargent.com</text>
  <text x="1020" y="1060" text-anchor="end" font-family="${JB}" font-size="18" fill="${C.textSecondary}">@ouvalargentfr</text>`;
}

// title: array of lines; each line = array of {t, accent?, color?}
function title(lines, y0){
  const lh = 88;
  let out = '';
  lines.forEach((segs, i) => {
    const y = y0 + i*lh;
    out += `<text x="540" y="${y}" text-anchor="middle" font-family="${IS}" font-size="86" letter-spacing="-1.8" fill="${C.textPrimary}">`;
    segs.forEach(s => {
      if (s.accent) out += `<tspan font-style="italic" fill="${s.color}">${s.t}</tspan>`;
      else out += `<tspan>${s.t}</tspan>`;
    });
    out += `</text>`;
  });
  return out;
}

function subtitle(txt, y){
  // letter-spacing + uppercase
  return `<text x="540" y="${y}" text-anchor="middle" font-family="${SY}" font-size="18" font-weight="500" letter-spacing="1.5" fill="${C.textSecondary}">${txt.toUpperCase()}</text>`;
}

function heroSVG({titleLines, sub, value, valueColor, unit, context, src, glow}){
  const ctx = context; // array of lines
  let ctxT = '';
  ctx.forEach((l,i)=> ctxT += `<tspan x="540" dy="${i===0?0:32}">${l}</tspan>`);
  const shadowColor = valueColor === C.elec ? 'rgba(0,212,255,0.4)' : 'rgba(255,71,87,0.4)';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  ${defs(glow)}${frame(glow)}${logo()}
  ${title(titleLines, 248)}
  ${subtitle(sub, 398)}
  <text x="540" y="650" text-anchor="middle" font-family="${JB}" font-size="192" font-weight="700" letter-spacing="-3" fill="${valueColor}" style="filter:drop-shadow(0 0 60px ${shadowColor})">${value}</text>
  <text x="540" y="718" text-anchor="middle" font-family="${IS}" font-size="48" font-style="italic" fill="${C.textPrimary}">${unit}</text>
  <text x="540" y="800" text-anchor="middle" font-family="${SY}" font-size="22" fill="${C.textSecondary}">${ctxT}</text>
  ${footer(src)}
  </svg>`;
}

function barsSVG({titleLines, sub, bars, src, glow}){
  // bars: [{label,value,h,highlight}]
  const bw=180, gap=64, baseline=882;
  const total = bars.length*bw + (bars.length-1)*gap;
  let x = 540 - total/2;
  let b='';
  bars.forEach(bar=>{
    const top = baseline - bar.h;
    const fill = bar.highlight ? 'url(#barRed)' : 'url(#barNeutral)';
    const filt = bar.highlight ? ' style="filter:drop-shadow(0 0 40px rgba(255,71,87,0.55))"' : '';
    b += `<rect x="${x}" y="${top}" width="${bw}" height="${bar.h}" rx="10" fill="${fill}"${filt}/>`;
    const vColor = bar.highlight ? C.red : C.textSecondary;
    const vSize = bar.highlight ? 43 : 37;
    b += `<text x="${x+bw/2}" y="${top-20}" text-anchor="middle" font-family="${JB}" font-size="${vSize}" font-weight="700" fill="${vColor}">${bar.value}</text>`;
    const lColor = bar.highlight ? C.red : C.textSecondary;
    b += `<text x="${x+bw/2}" y="${baseline+38}" text-anchor="middle" font-family="${JB}" font-size="23" font-weight="600" fill="${lColor}">${bar.label}</text>`;
    x += bw+gap;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  ${defs(glow)}${frame(glow)}${logo()}
  ${title(titleLines, 248)}
  ${subtitle(sub, 398)}
  ${b}
  ${footer(src)}
  </svg>`;
}

const infographics = [
  { name:'info1-charge-dette', svg: barsSVG({
    titleLines:[[{t:'La dette nous coûte'}],[{t:'de plus en plus cher', accent:true, color:C.red}]],
    sub:"Charge d'intérêts de la dette de l'État · Milliards €",
    bars:[{label:'2024',value:'58',h:307},{label:'2025',value:'67',h:355},{label:'2026',value:'74',h:392,highlight:true}],
    src:'Cour des comptes · PLF 2026 · juin 2026', glow:'red' }) },
  { name:'info2-bce-inflation', svg: heroSVG({
    titleLines:[[{t:"L'inflation repart,"}],[{t:'la BCE '},{t:'contre-attaque', accent:true, color:C.elec}]],
    sub:'Zone euro · Inflation annuelle · Mai 2026',
    value:'3,2 %', valueColor:C.elec, unit:"d'inflation en zone euro",
    context:["Plus haut niveau depuis septembre 2023. La BCE devrait relever",
             "ses taux de 0,25 point le 11 juin — sa première hausse",
             "en près de trois ans."],
    src:'Eurostat · BCE · juin 2026', glow:'elec' }) },
  { name:'info3-chomage', svg: heroSVG({
    titleLines:[[{t:'Le chômage repasse'}],[{t:'au-dessus de '},{t:'8 %', accent:true, color:C.red}]],
    sub:'France · Taux de chômage au sens du BIT · T1 2026',
    value:'8,1 %', valueColor:C.red, unit:'de la population active',
    context:["Une première depuis 2021. Au même moment, le PIB recule",
             "de 0,1 % au premier trimestre : l'économie française cale."],
    src:'INSEE · mai 2026', glow:'red' }) },
];

for (const ig of infographics){
  fs.writeFileSync(ig.name+'.svg', ig.svg);
  const r = new Resvg(ig.svg, {
    fitTo:{ mode:'width', value:2160 },
    font:{ fontFiles, loadSystemFonts:false, defaultFontFamily:'Syne' }
  });
  const png = r.render().asPng();
  fs.writeFileSync(ig.name+'.png', png);
  console.log('rendered', ig.name+'.png', png.length, 'bytes');
}

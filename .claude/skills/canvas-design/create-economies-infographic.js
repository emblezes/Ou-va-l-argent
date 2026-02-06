const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register fonts
const fontsDir = path.join(__dirname, 'canvas-fonts');
try {
    registerFont(path.join(fontsDir, 'JetBrainsMono-Bold.ttf'), { family: 'JetBrains Mono', weight: 'bold' });
    registerFont(path.join(fontsDir, 'JetBrainsMono-Regular.ttf'), { family: 'JetBrains Mono', weight: 'normal' });
    registerFont(path.join(fontsDir, 'Outfit-Bold.ttf'), { family: 'Outfit', weight: 'bold' });
    registerFont(path.join(fontsDir, 'Outfit-Regular.ttf'), { family: 'Outfit', weight: 'normal' });
    registerFont(path.join(fontsDir, 'Lora-Regular.ttf'), { family: 'Lora', weight: 'normal' });
    registerFont(path.join(fontsDir, 'Lora-Italic.ttf'), { family: 'Lora', style: 'italic' });
} catch (e) {
    console.log('Font registration warning:', e.message);
}

// Canvas setup
const width = 1080;
const height = 1080;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Colors
const colors = {
    bgDeep: '#06080c',
    bgMid: '#0a1628',
    textPrimary: '#f0f4f8',
    textSecondary: '#8899a8',
    textMuted: '#4a5a6a',
    accentCyan: '#00d4ff',
    accentGold: '#ffd700',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    bgElevated: '#111820'
};

// Country data
const economies = [
    { rank: 1, country: 'Etats-Unis', gdp: 29.30, color: '#3b82f6', flag: '\u{1F1FA}\u{1F1F8}' },
    { rank: 2, country: 'Chine', gdp: 18.75, color: '#ef4444', flag: '\u{1F1E8}\u{1F1F3}' },
    { rank: 3, country: 'Allemagne', gdp: 4.68, color: '#fbbf24', flag: '\u{1F1E9}\u{1F1EA}' },
    { rank: 4, country: 'Japon', gdp: 4.02, color: '#f472b6', flag: '\u{1F1EF}\u{1F1F5}' },
    { rank: 5, country: 'Inde', gdp: 3.91, color: '#fb923c', flag: '\u{1F1EE}\u{1F1F3}' },
    { rank: 6, country: 'Royaume-Uni', gdp: 3.64, color: '#a855f7', flag: '\u{1F1EC}\u{1F1E7}' },
    { rank: 7, country: 'France', gdp: 3.16, color: '#00d4ff', flag: '\u{1F1EB}\u{1F1F7}', highlight: true },
    { rank: 8, country: 'Italie', gdp: 2.37, color: '#22c55e', flag: '\u{1F1EE}\u{1F1F9}' },
    { rank: 9, country: 'Canada', gdp: 2.24, color: '#f43f5e', flag: '\u{1F1E8}\u{1F1E6}' },
    { rank: 10, country: 'Bresil', gdp: 2.18, color: '#84cc16', flag: '\u{1F1E7}\u{1F1F7}' }
];

const maxGdp = economies[0].gdp;

// Background gradient
const bgGradient = ctx.createLinearGradient(0, 0, width * 0.5, height);
bgGradient.addColorStop(0, colors.bgDeep);
bgGradient.addColorStop(0.5, colors.bgMid);
bgGradient.addColorStop(1, colors.bgDeep);
ctx.fillStyle = bgGradient;
ctx.fillRect(0, 0, width, height);

// Subtle grid
ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
ctx.lineWidth = 1;
for (let x = 0; x <= width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
}
for (let y = 0; y <= height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
}

// Glow effects
// Top-right cyan glow
const glowGradient1 = ctx.createRadialGradient(width + 100, -100, 0, width + 100, -100, 500);
glowGradient1.addColorStop(0, 'rgba(0, 212, 255, 0.12)');
glowGradient1.addColorStop(1, 'transparent');
ctx.fillStyle = glowGradient1;
ctx.fillRect(0, 0, width, height);

// Bottom-left gold glow
const glowGradient2 = ctx.createRadialGradient(-100, height + 100, 0, -100, height + 100, 400);
glowGradient2.addColorStop(0, 'rgba(255, 215, 0, 0.06)');
glowGradient2.addColorStop(1, 'transparent');
ctx.fillStyle = glowGradient2;
ctx.fillRect(0, 0, width, height);

// Header - Logo
const logoSize = 48;
const logoX = 55;
const logoY = 50;

// Logo background
const logoGrad = ctx.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize);
logoGrad.addColorStop(0, colors.accentCyan);
logoGrad.addColorStop(1, '#0099cc');
ctx.fillStyle = logoGrad;
roundRect(ctx, logoX, logoY, logoSize, logoSize, 10);
ctx.fill();

// Euro symbol
ctx.font = 'bold 26px "JetBrains Mono"';
ctx.fillStyle = colors.bgDeep;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('\u20AC', logoX + logoSize/2, logoY + logoSize/2);

// Logo text
ctx.font = 'bold 22px "Outfit"';
ctx.fillStyle = colors.textPrimary;
ctx.textAlign = 'left';
ctx.fillText('Ou Va l\'Argent', logoX + logoSize + 14, logoY + logoSize/2 + 2);

// Tag
const tagText = 'ECONOMIE MONDIALE';
ctx.font = '600 14px "Outfit"';
const tagWidth = ctx.measureText(tagText).width + 48;
const tagX = width - 55 - tagWidth;
const tagY = logoY + 4;
const tagHeight = 40;

ctx.fillStyle = 'rgba(0, 212, 255, 0.12)';
ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
ctx.lineWidth = 1;
roundRect(ctx, tagX, tagY, tagWidth, tagHeight, 20);
ctx.fill();
ctx.stroke();

ctx.fillStyle = colors.accentCyan;
ctx.textAlign = 'center';
ctx.fillText(tagText, tagX + tagWidth/2, tagY + tagHeight/2 + 1);

// Title
const titleY = 145;
ctx.font = '52px "Lora"';
ctx.fillStyle = colors.textPrimary;
ctx.textAlign = 'center';
ctx.fillText('Top 10 des', width/2, titleY);

ctx.font = 'italic 52px "Lora"';
ctx.fillStyle = colors.accentCyan;
ctx.fillText('economies mondiales', width/2, titleY + 58);

// Subtitle
ctx.font = '18px "Outfit"';
ctx.fillStyle = colors.textSecondary;
ctx.fillText('PIB nominal 2024 en milliers de milliards USD', width/2, titleY + 100);

// Bar chart
const chartStartY = 280;
const barHeight = 52;
const barGap = 18;
const leftMargin = 55;
const rankWidth = 40;
const countryWidth = 135;
const barStartX = leftMargin + rankWidth + countryWidth + 20;
const barMaxWidth = width - barStartX - 55;

economies.forEach((eco, i) => {
    const y = chartStartY + i * (barHeight + barGap);
    const barWidth = (eco.gdp / maxGdp) * barMaxWidth;
    const isHighlight = eco.highlight;

    // Rank
    ctx.font = 'bold 18px "JetBrains Mono"';
    ctx.fillStyle = isHighlight ? colors.accentCyan : colors.textMuted;
    ctx.textAlign = 'center';
    ctx.fillText(eco.rank.toString(), leftMargin + rankWidth/2, y + barHeight/2 + 1);

    // Country name
    ctx.font = isHighlight ? 'bold 17px "Outfit"' : '17px "Outfit"';
    ctx.fillStyle = isHighlight ? colors.accentCyan : colors.textSecondary;
    ctx.textAlign = 'left';
    ctx.fillText(eco.country, leftMargin + rankWidth + 15, y + barHeight/2 + 1);

    // Bar track background
    ctx.fillStyle = colors.bgElevated;
    roundRect(ctx, barStartX, y, barMaxWidth, barHeight, 8);
    ctx.fill();

    // Highlight border for France
    if (isHighlight) {
        // Stronger glow background
        ctx.shadowColor = 'rgba(0, 212, 255, 0.6)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.strokeStyle = colors.accentCyan;
        ctx.lineWidth = 3;
        roundRect(ctx, barStartX - 1, y - 1, barMaxWidth + 2, barHeight + 2, 9);
        ctx.stroke();
    }

    // Bar fill
    const barGrad = ctx.createLinearGradient(barStartX, y, barStartX + barWidth, y);
    barGrad.addColorStop(0, eco.color);
    barGrad.addColorStop(1, adjustColor(eco.color, -20));
    ctx.fillStyle = barGrad;
    roundRect(ctx, barStartX, y, barWidth, barHeight, 8);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // GDP value inside bar (if bar is wide enough) or outside
    const gdpText = formatGdp(eco.gdp);
    ctx.font = 'bold 16px "JetBrains Mono"';
    const textWidth = ctx.measureText(gdpText).width;

    if (barWidth > textWidth + 30) {
        ctx.fillStyle = colors.bgDeep;
        ctx.textAlign = 'right';
        ctx.fillText(gdpText, barStartX + barWidth - 14, y + barHeight/2 + 1);
    } else {
        ctx.fillStyle = colors.textSecondary;
        ctx.textAlign = 'left';
        ctx.fillText(gdpText, barStartX + barWidth + 12, y + barHeight/2 + 1);
    }
});

// Footer
const footerY = height - 55;

// Footer line
ctx.strokeStyle = colors.glassBorder;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(55, footerY - 20);
ctx.lineTo(width - 55, footerY - 20);
ctx.stroke();

// Source
ctx.font = '15px "Outfit"';
ctx.fillStyle = colors.textMuted;
ctx.textAlign = 'left';
ctx.fillText('Source : ', 55, footerY);
ctx.fillStyle = colors.textSecondary;
ctx.fillText('FMI - World Economic Outlook, Oct. 2024', 55 + ctx.measureText('Source : ').width, footerY);

// Website
ctx.font = '18px "JetBrains Mono"';
ctx.fillStyle = colors.accentCyan;
ctx.textAlign = 'right';
ctx.fillText('ouvalargent.fr', width - 55, footerY);

// Helper functions
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function formatGdp(gdp) {
    if (gdp >= 10) {
        return gdp.toFixed(1).replace('.', ',') + ' T$';
    } else {
        return gdp.toFixed(2).replace('.', ',') + ' T$';
    }
}

function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// Save
const outputPath = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Comparaisons-Internationales/top-10-economies-mondiales-2024.png';
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);
console.log('Infographic saved to:', outputPath);

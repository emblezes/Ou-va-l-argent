const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register fonts
const fontsDir = path.join(__dirname, 'canvas-fonts');
registerFont(path.join(fontsDir, 'InstrumentSerif-Italic.ttf'), { family: 'InstrumentSerif', style: 'italic' });
registerFont(path.join(fontsDir, 'InstrumentSerif-Regular.ttf'), { family: 'InstrumentSerif', style: 'normal' });
registerFont(path.join(fontsDir, 'WorkSans-Bold.ttf'), { family: 'WorkSans', weight: 'bold' });
registerFont(path.join(fontsDir, 'WorkSans-Regular.ttf'), { family: 'WorkSans', weight: 'normal' });
registerFont(path.join(fontsDir, 'JetBrainsMono-Bold.ttf'), { family: 'JetBrainsMono', weight: 'bold' });
registerFont(path.join(fontsDir, 'JetBrainsMono-Regular.ttf'), { family: 'JetBrainsMono', weight: 'normal' });

// Canvas setup
const width = 1080;
const height = 1080;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Colors - using red for decline theme
const colors = {
  bgDeep: '#06080c',
  bgSurface: '#0a1628',
  textPrimary: '#f0f4f8',
  textSecondary: '#8899a8',
  textMuted: '#4a5a6a',
  accentCyan: '#00d4ff',
  accentGold: '#ffd700',
  accentRed: '#ff4757',
  accentRedDim: 'rgba(255, 71, 87, 0.15)',
  accentGreen: '#00ff88',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
};

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, colors.bgDeep);
gradient.addColorStop(0.5, colors.bgSurface);
gradient.addColorStop(1, colors.bgDeep);
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Subtle grid
ctx.strokeStyle = 'rgba(255, 71, 87, 0.03)';
ctx.lineWidth = 1;
const gridSize = 40;
for (let x = 0; x <= width; x += gridSize) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}
for (let y = 0; y <= height; y += gridSize) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

// Glow effects - red theme
const glowRed = ctx.createRadialGradient(880, 200, 0, 880, 200, 400);
glowRed.addColorStop(0, 'rgba(255, 71, 87, 0.12)');
glowRed.addColorStop(1, 'rgba(255, 71, 87, 0)');
ctx.fillStyle = glowRed;
ctx.fillRect(0, 0, width, height);

const glowGold = ctx.createRadialGradient(200, 880, 0, 200, 880, 400);
glowGold.addColorStop(0, 'rgba(255, 215, 0, 0.06)');
glowGold.addColorStop(1, 'rgba(255, 215, 0, 0)');
ctx.fillStyle = glowGold;
ctx.fillRect(0, 0, width, height);

// ===== HEADER =====

// Logo icon (euro square)
ctx.fillStyle = colors.accentCyan;
ctx.beginPath();
ctx.roundRect(60, 50, 50, 50, 10);
ctx.fill();

ctx.fillStyle = colors.bgDeep;
ctx.font = 'bold 30px JetBrainsMono';
ctx.textAlign = 'center';
ctx.fillText('€', 85, 85);

// Logo text
ctx.fillStyle = colors.textPrimary;
ctx.font = 'bold 20px WorkSans';
ctx.textAlign = 'left';
ctx.fillText("Ou Va l'Argent", 125, 82);

// Tag - red for decline
ctx.fillStyle = colors.accentRedDim;
ctx.beginPath();
ctx.roundRect(850, 55, 170, 40, 20);
ctx.fill();
ctx.strokeStyle = 'rgba(255, 71, 87, 0.4)';
ctx.lineWidth = 1;
ctx.stroke();

ctx.fillStyle = colors.accentRed;
ctx.font = 'bold 14px WorkSans';
ctx.textAlign = 'center';
ctx.fillText('INDUSTRIE', 935, 81);

// ===== TITLE =====
ctx.fillStyle = colors.textPrimary;
ctx.font = 'italic 52px InstrumentSerif';
ctx.textAlign = 'center';
ctx.fillText('Le declin de', 540, 170);

ctx.fillStyle = colors.accentRed;
ctx.font = 'italic 56px InstrumentSerif';
ctx.fillText("l'industrie francaise", 540, 235);

// Subtitle
ctx.fillStyle = colors.textSecondary;
ctx.font = '22px WorkSans';
ctx.fillText('Part de l\'industrie manufacturiere dans le PIB', 540, 285);

// ===== MAIN VISUALIZATION - Decline Chart =====

// Data points - Industry share of GDP (Manufacturing)
// Sources: INSEE, World Bank
const dataPoints = [
  { year: '1970', value: 22.3 },
  { year: '1980', value: 20.0 },
  { year: '1990', value: 18.0 },
  { year: '2000', value: 15.7 },
  { year: '2010', value: 11.0 },
  { year: '2024', value: 9.3 },
];

// Chart dimensions
const chartLeft = 120;
const chartRight = 1000;
const chartTop = 360;
const chartBottom = 720;
const chartWidth = chartRight - chartLeft;
const chartHeight = chartBottom - chartTop;
const maxValue = 25; // Max Y axis value

// Draw horizontal grid lines
ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
ctx.lineWidth = 1;
for (let v = 5; v <= 25; v += 5) {
  const y = chartBottom - (v / maxValue) * chartHeight;
  ctx.beginPath();
  ctx.moveTo(chartLeft, y);
  ctx.lineTo(chartRight, y);
  ctx.stroke();

  // Y axis labels
  ctx.fillStyle = colors.textMuted;
  ctx.font = '14px JetBrainsMono';
  ctx.textAlign = 'right';
  ctx.fillText(v + '%', chartLeft - 15, y + 5);
}

// Draw axis
ctx.strokeStyle = colors.glassBorder;
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(chartLeft, chartBottom);
ctx.lineTo(chartRight, chartBottom);
ctx.stroke();

// Calculate x positions
const xStep = chartWidth / (dataPoints.length - 1);
const points = dataPoints.map((d, i) => ({
  ...d,
  x: chartLeft + i * xStep,
  y: chartBottom - (d.value / maxValue) * chartHeight,
}));

// Draw gradient fill under line (red gradient for decline)
const fillGradient = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
fillGradient.addColorStop(0, 'rgba(255, 71, 87, 0.25)');
fillGradient.addColorStop(1, 'rgba(255, 71, 87, 0)');

ctx.beginPath();
ctx.moveTo(points[0].x, chartBottom);
points.forEach(p => ctx.lineTo(p.x, p.y));
ctx.lineTo(points[points.length - 1].x, chartBottom);
ctx.closePath();
ctx.fillStyle = fillGradient;
ctx.fill();

// Draw line with gradient (from gold to red showing decline)
const lineGradient = ctx.createLinearGradient(chartLeft, 0, chartRight, 0);
lineGradient.addColorStop(0, colors.accentGold);
lineGradient.addColorStop(0.5, colors.accentRed);
lineGradient.addColorStop(1, colors.accentRed);

ctx.strokeStyle = lineGradient;
ctx.lineWidth = 5;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.beginPath();
points.forEach((p, i) => {
  if (i === 0) ctx.moveTo(p.x, p.y);
  else ctx.lineTo(p.x, p.y);
});
ctx.stroke();

// Draw points and labels
points.forEach((p, i) => {
  // Calculate color based on position (gold to red)
  const t = i / (points.length - 1);
  const pointColor = i < 2 ? colors.accentGold : colors.accentRed;

  // Outer glow
  const pointGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 25);
  pointGlow.addColorStop(0, i < 2 ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 71, 87, 0.4)');
  pointGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = pointGlow;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
  ctx.fill();

  // Point
  ctx.fillStyle = pointColor;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // Inner dot
  ctx.fillStyle = colors.bgDeep;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
  ctx.fill();

  // Year label
  ctx.fillStyle = colors.textSecondary;
  ctx.font = 'bold 18px JetBrainsMono';
  ctx.textAlign = 'center';
  ctx.fillText(p.year, p.x, chartBottom + 35);

  // Value label (alternating position to avoid overlap)
  ctx.fillStyle = pointColor;
  ctx.font = 'bold 28px JetBrainsMono';
  const valueY = p.y - 30;
  ctx.fillText(p.value.toFixed(1) + '%', p.x, valueY);
});

// ===== DECLINE INDICATOR =====
const startY = points[0].y;
const endY = points[points.length - 1].y;
const arrowX = chartRight + 35;

// Vertical arrow showing decline
ctx.strokeStyle = colors.accentRed;
ctx.lineWidth = 3;
ctx.setLineDash([]);
ctx.beginPath();
ctx.moveTo(arrowX, startY);
ctx.lineTo(arrowX, endY);
ctx.stroke();

// Arrow head
ctx.fillStyle = colors.accentRed;
ctx.beginPath();
ctx.moveTo(arrowX - 8, endY - 12);
ctx.lineTo(arrowX + 8, endY - 12);
ctx.lineTo(arrowX, endY + 5);
ctx.closePath();
ctx.fill();

// Decline percentage
const declinePercent = ((22.3 - 9.3) / 22.3 * 100).toFixed(0);
ctx.fillStyle = colors.accentRed;
ctx.font = 'bold 24px JetBrainsMono';
ctx.textAlign = 'center';
ctx.save();
ctx.translate(arrowX + 45, (startY + endY) / 2);
ctx.rotate(-Math.PI / 2);
ctx.fillText('-' + declinePercent + '%', 0, 0);
ctx.restore();

// ===== KEY STATS ROW =====

const statsY = 830;
const stats = [
  { value: '22.3%', label: 'En 1970', sublabel: 'Part du PIB', color: colors.accentGold },
  { value: '9.3%', label: 'En 2024', sublabel: 'Part du PIB', color: colors.accentRed },
  { value: '2.5 M', label: 'Emplois perdus', sublabel: 'depuis 1974', color: colors.accentRed },
];

const statWidth = 280;
const statsStartX = (width - stats.length * statWidth) / 2;

stats.forEach((stat, i) => {
  const x = statsStartX + i * statWidth + statWidth / 2;

  // Value
  ctx.fillStyle = stat.color;
  ctx.font = 'bold 48px JetBrainsMono';
  ctx.textAlign = 'center';
  ctx.fillText(stat.value, x, statsY);

  // Label
  ctx.fillStyle = colors.textPrimary;
  ctx.font = 'bold 18px WorkSans';
  ctx.fillText(stat.label, x, statsY + 35);

  // Sublabel
  ctx.fillStyle = colors.textMuted;
  ctx.font = '15px WorkSans';
  ctx.fillText(stat.sublabel, x, statsY + 60);
});

// ===== FOOTER =====

// Divider line
ctx.strokeStyle = colors.glassBorder;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(60, 950);
ctx.lineTo(1020, 950);
ctx.stroke();

// Source
ctx.fillStyle = colors.textMuted;
ctx.font = '14px WorkSans';
ctx.textAlign = 'left';
ctx.fillText('Sources : INSEE, Banque Mondiale - Industrie manufacturiere', 60, 990);

// Website
ctx.fillStyle = colors.accentCyan;
ctx.font = 'bold 18px JetBrainsMono';
ctx.textAlign = 'right';
ctx.fillText('ouvalargent.fr', 1020, 990);

// ===== SAVE =====
const outputPath = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Industrie/declin-industrie-france-pib.png';
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);
console.log('Infographic saved to:', outputPath);

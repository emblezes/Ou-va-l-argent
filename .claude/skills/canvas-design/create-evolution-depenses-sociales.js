const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Using system fonts that work reliably with node-canvas

// Canvas setup
const width = 1080;
const height = 1080;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Colors (charte graphique)
const colors = {
  bgDeep: '#06080c',
  bgSurface: '#0a1628',
  textPrimary: '#f0f4f8',
  textSecondary: '#8899a8',
  textMuted: '#4a5a6a',
  accentCyan: '#00d4ff',
  accentGold: '#ffd700',
  accentRed: '#ff4757',
  accentOrange: '#ff9f43',
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
ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
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

// Glow effects - orange/red for "alarming" theme
const glowOrange = ctx.createRadialGradient(200, 200, 0, 200, 200, 400);
glowOrange.addColorStop(0, 'rgba(255, 159, 67, 0.12)');
glowOrange.addColorStop(1, 'rgba(255, 159, 67, 0)');
ctx.fillStyle = glowOrange;
ctx.fillRect(0, 0, width, height);

const glowRed = ctx.createRadialGradient(880, 880, 0, 880, 880, 400);
glowRed.addColorStop(0, 'rgba(255, 71, 87, 0.08)');
glowRed.addColorStop(1, 'rgba(255, 71, 87, 0)');
ctx.fillStyle = glowRed;
ctx.fillRect(0, 0, width, height);

// ===== HEADER =====

// Logo icon (euro square)
ctx.fillStyle = colors.accentCyan;
ctx.beginPath();
ctx.roundRect(60, 50, 50, 50, 10);
ctx.fill();

ctx.fillStyle = colors.bgDeep;
ctx.font = 'bold 30px Courier';
ctx.textAlign = 'center';
ctx.fillText('€', 85, 87);

// Logo text
ctx.fillStyle = colors.textPrimary;
ctx.font = 'bold 22px Arial';
ctx.textAlign = 'left';
ctx.fillText("Ou Va l'Argent", 125, 82);

// Tag
ctx.fillStyle = 'rgba(255, 159, 67, 0.15)';
ctx.beginPath();
ctx.roundRect(800, 55, 220, 40, 20);
ctx.fill();
ctx.strokeStyle = 'rgba(255, 159, 67, 0.5)';
ctx.lineWidth = 1;
ctx.stroke();

ctx.fillStyle = colors.accentOrange;
ctx.font = 'bold 14px Arial';
ctx.textAlign = 'center';
ctx.fillText('DEPENSES SOCIALES', 910, 81);

// ===== TITLE =====
ctx.fillStyle = colors.textPrimary;
ctx.font = 'italic 62px Georgia';
ctx.textAlign = 'center';
ctx.fillText('Protection sociale :', 540, 170);

ctx.fillStyle = colors.accentOrange;
ctx.font = 'italic 62px Georgia';
ctx.fillText("l'explosion", 540, 245);

// Subtitle
ctx.fillStyle = colors.textSecondary;
ctx.font = '22px Arial';
ctx.fillText('Depenses en % du PIB (1959-2024)', 540, 295);

// ===== MAIN VISUALIZATION - Timeline Chart =====

// Data points (fact-checked from DREES, FIPECO, INSEE)
const dataPoints = [
  { year: '1959', value: 14 },
  { year: '1975', value: 17.2 },
  { year: '1985', value: 26 },
  { year: '2000', value: 28 },
  { year: '2010', value: 30 },
  { year: '2020', value: 35.4, note: 'Pic Covid' },
  { year: '2024', value: 31.9 },
];

// Chart dimensions
const chartLeft = 100;
const chartRight = 1000;
const chartTop = 380;
const chartBottom = 720;
const chartWidth = chartRight - chartLeft;
const chartHeight = chartBottom - chartTop;

// Draw horizontal reference lines
const yLevels = [15, 20, 25, 30, 35];
ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
ctx.lineWidth = 1;
yLevels.forEach(level => {
  const y = chartBottom - ((level - 10) / 30) * chartHeight;
  ctx.beginPath();
  ctx.moveTo(chartLeft, y);
  ctx.lineTo(chartRight, y);
  ctx.stroke();

  // Y-axis labels
  ctx.fillStyle = colors.textMuted;
  ctx.font = '14px Courier';
  ctx.textAlign = 'right';
  ctx.fillText(level + '%', chartLeft - 15, y + 5);
});

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
  y: chartBottom - ((d.value - 10) / 30) * chartHeight,
}));

// Draw gradient fill under line (orange gradient for warning effect)
const fillGradient = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
fillGradient.addColorStop(0, 'rgba(255, 159, 67, 0.35)');
fillGradient.addColorStop(0.5, 'rgba(255, 71, 87, 0.2)');
fillGradient.addColorStop(1, 'rgba(255, 71, 87, 0)');

ctx.beginPath();
ctx.moveTo(points[0].x, chartBottom);
points.forEach(p => ctx.lineTo(p.x, p.y));
ctx.lineTo(points[points.length - 1].x, chartBottom);
ctx.closePath();
ctx.fillStyle = fillGradient;
ctx.fill();

// Draw line with gradient effect
const lineGradient = ctx.createLinearGradient(chartLeft, 0, chartRight, 0);
lineGradient.addColorStop(0, colors.accentOrange);
lineGradient.addColorStop(0.7, colors.accentRed);
lineGradient.addColorStop(1, colors.accentOrange);

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
  // Outer glow
  const pointGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 25);
  const glowColor = p.value >= 30 ? 'rgba(255, 71, 87, 0.5)' : 'rgba(255, 159, 67, 0.4)';
  pointGlow.addColorStop(0, glowColor);
  pointGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = pointGlow;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
  ctx.fill();

  // Point
  ctx.fillStyle = p.value >= 30 ? colors.accentRed : colors.accentOrange;
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
  ctx.font = '16px Courier';
  ctx.textAlign = 'center';
  ctx.fillText(p.year, p.x, chartBottom + 30);

  // Value label (alternating above/below to avoid overlap)
  const isAbove = i !== 5; // Put 2020 label below
  const valueY = isAbove ? p.y - 35 : p.y + 50;

  ctx.fillStyle = p.value >= 30 ? colors.accentRed : colors.accentOrange;
  ctx.font = 'bold 24px Courier';
  ctx.fillText(p.value.toFixed(1) + '%', p.x, valueY);

  // Note label if exists
  if (p.note) {
    ctx.fillStyle = colors.accentRed;
    ctx.font = '13px Arial';
    ctx.fillText(p.note, p.x, valueY - 22);
  }
});

// ===== KEY STAT HIGHLIGHT =====

// Big stat box
const statBoxY = 770;
ctx.fillStyle = 'rgba(255, 71, 87, 0.1)';
ctx.strokeStyle = 'rgba(255, 71, 87, 0.3)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.roundRect(140, statBoxY, 800, 90, 15);
ctx.fill();
ctx.stroke();

// Multiplication icon
ctx.fillStyle = colors.accentRed;
ctx.font = 'bold 46px Courier';
ctx.textAlign = 'center';
ctx.fillText('x2.3', 250, statBoxY + 58);

// Explanation text
ctx.fillStyle = colors.textPrimary;
ctx.font = '24px Arial';
ctx.textAlign = 'left';
ctx.fillText('En 65 ans, les depenses sociales', 360, statBoxY + 40);
ctx.fillStyle = colors.accentOrange;
ctx.fillText('ont plus que double', 360, statBoxY + 70);
ctx.fillStyle = colors.textSecondary;
ctx.font = '18px Arial';
ctx.fillText('en part du PIB', 620, statBoxY + 70);

// Arrow indicator
ctx.fillStyle = colors.accentRed;
ctx.font = 'bold 32px Courier';
ctx.textAlign = 'right';
ctx.fillText('+18 pts', 900, statBoxY + 58);

// ===== FOOTER =====

// Divider line
ctx.strokeStyle = colors.glassBorder;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(60, 920);
ctx.lineTo(1020, 920);
ctx.stroke();

// Source
ctx.fillStyle = colors.textMuted;
ctx.font = '15px Arial';
ctx.textAlign = 'left';
ctx.fillText('Sources : DREES, INSEE, FIPECO (2024)', 60, 960);

// Website
ctx.fillStyle = colors.accentCyan;
ctx.font = 'bold 18px Courier';
ctx.textAlign = 'right';
ctx.fillText('ouvalargent.fr', 1020, 960);

// ===== SAVE =====
const outputDir = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Dépenses-Sociales';
const outputPath = path.join(outputDir, 'evolution-depenses-sociales-france.png');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);
console.log('Infographic saved to:', outputPath);

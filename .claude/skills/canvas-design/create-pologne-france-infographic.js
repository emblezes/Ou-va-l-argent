const { createCanvas } = require('canvas');
const fs = require('fs');

// Canvas setup
const width = 1080;
const height = 1080;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Colors
const colors = {
  bgDeep: '#06080c',
  bgSurface: '#0a1628',
  textPrimary: '#f0f4f8',
  textSecondary: '#8899a8',
  textMuted: '#4a5a6a',
  accentCyan: '#00d4ff',
  accentGold: '#ffd700',
  accentRed: '#ff4757',
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

// Glow effects
const glowCyan = ctx.createRadialGradient(200, 200, 0, 200, 200, 400);
glowCyan.addColorStop(0, 'rgba(0, 212, 255, 0.12)');
glowCyan.addColorStop(1, 'rgba(0, 212, 255, 0)');
ctx.fillStyle = glowCyan;
ctx.fillRect(0, 0, width, height);

const glowGold = ctx.createRadialGradient(880, 880, 0, 880, 880, 400);
glowGold.addColorStop(0, 'rgba(255, 215, 0, 0.08)');
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
ctx.font = 'bold 30px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('\u20AC', 85, 75);

// Logo text
ctx.fillStyle = colors.textPrimary;
ctx.font = 'bold 20px Arial';
ctx.textAlign = 'left';
ctx.textBaseline = 'middle';
ctx.fillText("Ou Va l'Argent", 125, 75);

// Tag
ctx.fillStyle = 'rgba(0, 212, 255, 0.15)';
ctx.beginPath();
ctx.roundRect(780, 55, 240, 40, 20);
ctx.fill();
ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
ctx.lineWidth = 1;
ctx.stroke();

ctx.fillStyle = colors.accentCyan;
ctx.font = 'bold 13px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('COMPARAISON INTERNATIONALE', 900, 75);

// ===== TITLE =====
ctx.textBaseline = 'alphabetic';
ctx.fillStyle = colors.textPrimary;
ctx.font = 'italic 62px Georgia';
ctx.textAlign = 'center';
ctx.fillText('La Pologne rattrape', 540, 175);

ctx.fillStyle = colors.accentCyan;
ctx.font = 'italic 62px Georgia';
ctx.fillText('la France', 540, 250);

// Subtitle
ctx.fillStyle = colors.textSecondary;
ctx.font = '24px Arial';
ctx.fillText('PIB par habitant (PPA) - Part du niveau francais', 540, 300);

// ===== MAIN VISUALIZATION - Timeline Chart =====

// Data points (Poland as % of France)
const dataPoints = [
  { year: '1990', value: 33, label: '33%' },
  { year: '2004', value: 46, label: '46%', note: 'Adhesion UE' },
  { year: '2024', value: 80, label: '80%', note: "Aujourd'hui" },
  { year: '2034', value: 101, label: '101%', note: 'Projection', projected: true },
];

// Chart dimensions
const chartLeft = 120;
const chartRight = 960;
const chartTop = 380;
const chartBottom = 680;
const chartWidth = chartRight - chartLeft;
const chartHeight = chartBottom - chartTop;

// Draw 100% reference line
ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
ctx.lineWidth = 2;
ctx.setLineDash([10, 5]);
const y100 = chartBottom - (100 / 110) * chartHeight;
ctx.beginPath();
ctx.moveTo(chartLeft, y100);
ctx.lineTo(chartRight, y100);
ctx.stroke();
ctx.setLineDash([]);

// 100% label
ctx.fillStyle = colors.accentGold;
ctx.font = 'bold 18px Arial';
ctx.textAlign = 'right';
ctx.fillText('100% = France', chartRight, y100 - 12);

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
  y: chartBottom - (d.value / 110) * chartHeight,
}));

// Draw gradient fill under line
const fillGradient = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
fillGradient.addColorStop(0, 'rgba(0, 212, 255, 0.35)');
fillGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

ctx.beginPath();
ctx.moveTo(points[0].x, chartBottom);
points.forEach(p => ctx.lineTo(p.x, p.y));
ctx.lineTo(points[points.length - 1].x, chartBottom);
ctx.closePath();
ctx.fillStyle = fillGradient;
ctx.fill();

// Draw line
ctx.strokeStyle = colors.accentCyan;
ctx.lineWidth = 5;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.beginPath();
points.forEach((p, i) => {
  if (i === 0) ctx.moveTo(p.x, p.y);
  else ctx.lineTo(p.x, p.y);
});
ctx.stroke();

// Draw dashed line for projection
ctx.setLineDash([8, 4]);
ctx.strokeStyle = colors.accentGold;
ctx.lineWidth = 4;
ctx.beginPath();
ctx.moveTo(points[2].x, points[2].y);
ctx.lineTo(points[3].x, points[3].y);
ctx.stroke();
ctx.setLineDash([]);

// Draw points and labels
points.forEach((p, i) => {
  // Outer glow
  const pointGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 30);
  pointGlow.addColorStop(0, p.projected ? 'rgba(255, 215, 0, 0.5)' : 'rgba(0, 212, 255, 0.5)');
  pointGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = pointGlow;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 30, 0, Math.PI * 2);
  ctx.fill();

  // Point
  ctx.fillStyle = p.projected ? colors.accentGold : colors.accentCyan;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
  ctx.fill();

  // Inner white dot
  ctx.fillStyle = colors.bgDeep;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
  ctx.fill();

  // Year label
  ctx.fillStyle = colors.textSecondary;
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(p.year, p.x, chartBottom + 40);

  // Value label
  ctx.fillStyle = p.projected ? colors.accentGold : colors.accentCyan;
  ctx.font = 'bold 42px Arial';
  const valueY = p.y - 50;
  ctx.fillText(p.label, p.x, valueY);

  // Note label if exists
  if (p.note) {
    ctx.fillStyle = p.projected ? 'rgba(255, 215, 0, 0.8)' : colors.textMuted;
    ctx.font = '18px Arial';
    ctx.fillText(p.note, p.x, valueY - 32);
  }
});

// ===== KEY STATS ROW =====

const statsY = 810;
const stats = [
  { value: '+316%', label: 'Croissance PIB/hab', sublabel: 'Pologne (1995-2024)', color: colors.accentCyan },
  { value: '3.6%', label: 'Croissance 2025', sublabel: 'vs 1% en France', color: colors.accentGreen },
  { value: '2034', label: 'Depassement prevu', sublabel: 'Projection FMI', color: colors.accentGold },
];

const statWidth = 300;
const statsStartX = (width - stats.length * statWidth) / 2;

stats.forEach((stat, i) => {
  const x = statsStartX + i * statWidth + statWidth / 2;

  // Value
  ctx.fillStyle = stat.color;
  ctx.font = 'bold 52px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(stat.value, x, statsY);

  // Label
  ctx.fillStyle = colors.textPrimary;
  ctx.font = 'bold 20px Arial';
  ctx.fillText(stat.label, x, statsY + 40);

  // Sublabel
  ctx.fillStyle = colors.textMuted;
  ctx.font = '16px Arial';
  ctx.fillText(stat.sublabel, x, statsY + 65);
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
ctx.font = '16px Arial';
ctx.textAlign = 'left';
ctx.fillText('Sources : Eurostat, FMI, Direction du Tresor (2024)', 60, 990);

// Website
ctx.fillStyle = colors.accentCyan;
ctx.font = 'bold 20px Arial';
ctx.textAlign = 'right';
ctx.fillText('ouvalargent.fr', 1020, 990);

// ===== SAVE =====
const outputPath = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /Comparaisons-Internationales/pologne-rattrapage-france-pib.png';
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);
console.log('Infographic saved to:', outputPath);

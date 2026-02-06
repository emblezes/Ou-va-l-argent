const { createCanvas } = require('canvas');
const fs = require('fs');

// Canvas setup
const width = 1080;
const height = 1080;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, 0, height);
gradient.addColorStop(0, '#06080c');
gradient.addColorStop(1, '#0a1628');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Subtle grid
ctx.strokeStyle = 'rgba(0, 212, 255, 0.04)';
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

// Glow effect behind main number
const glowGradient = ctx.createRadialGradient(540, 480, 0, 540, 480, 300);
glowGradient.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
glowGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
ctx.fillStyle = glowGradient;
ctx.fillRect(0, 0, width, height);

// Top tag
ctx.fillStyle = 'rgba(0, 212, 255, 0.15)';
ctx.beginPath();
ctx.roundRect(390, 120, 300, 40, 20);
ctx.fill();
ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
ctx.lineWidth = 1;
ctx.stroke();

ctx.fillStyle = '#00d4ff';
ctx.font = 'bold 16px Arial';
ctx.textAlign = 'center';
ctx.fillText('DETTE PUBLIQUE', 540, 147);

// "Chaque seconde" - title
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 52px Arial';
ctx.textAlign = 'center';
ctx.fillText('Chaque seconde', 540, 280);

// Subtitle
ctx.fillStyle = '#8892a0';
ctx.font = '24px Arial';
ctx.fillText('la dette française augmente de', 540, 340);

// Main number - 5 350€
ctx.fillStyle = '#00d4ff';
ctx.font = 'bold 160px Arial';
ctx.textAlign = 'center';
ctx.fillText('5 350€', 540, 540);

// Per second indicator
ctx.fillStyle = '#ffffff';
ctx.font = '36px Arial';
ctx.fillText('par seconde', 540, 620);

// Stats row
const stats = [
  { value: '321 000€', label: 'par minute' },
  { value: '19,3M€', label: 'par heure' },
  { value: '463M€', label: 'par jour' },
];

const startX = 180;
const spacing = 260;
stats.forEach((stat, i) => {
  const x = startX + i * spacing;

  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(stat.value, x, 750);

  ctx.fillStyle = '#5a6a7a';
  ctx.font = '18px Arial';
  ctx.fillText(stat.label, x, 785);
});

// Divider line
ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(100, 850);
ctx.lineTo(980, 850);
ctx.stroke();

// Logo "Où Va l'Argent"
// Euro square
ctx.fillStyle = '#00d4ff';
ctx.beginPath();
ctx.roundRect(420, 890, 44, 44, 8);
ctx.fill();

ctx.fillStyle = '#06080c';
ctx.font = 'bold 28px Arial';
ctx.textAlign = 'center';
ctx.fillText('€', 442, 922);

// Brand name
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 22px Arial';
ctx.textAlign = 'left';
ctx.fillText('Où Va l\'Argent', 480, 920);

// Source
ctx.fillStyle = '#4a5a6a';
ctx.font = '14px Arial';
ctx.textAlign = 'center';
ctx.fillText('Source : INSEE, Déficit 2024 (169 Md€ / 31,5M secondes)', 540, 1000);

// ouvalargent.fr
ctx.fillStyle = '#5a6a7a';
ctx.font = '16px Arial';
ctx.fillText('ouvalargent.fr', 540, 1040);

// Save
const outputPath = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux /PNG/dette-5350-par-seconde.png';
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);
console.log('Infographic saved to:', outputPath);

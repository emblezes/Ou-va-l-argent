#!/usr/bin/env node
/**
 * Batch: € en bleu #00d4ff + tailles plus grandes (€ 4rem, texte 1.8rem)
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const INFOGRAPHICS_DIR = path.join(__dirname, '../../Production interne/Réseaux Sociaux /Infographies/Sources HTML');
const TEMPLATES_DIR = path.join(__dirname, '../../Templates/Réseaux sociaux');

const infographicFiles = glob.sync('*.html', { cwd: INFOGRAPHICS_DIR }).map(f => path.join(INFOGRAPHICS_DIR, f));
const templateFiles = glob.sync('template-*.html', { cwd: TEMPLATES_DIR }).map(f => path.join(TEMPLATES_DIR, f));
const allFiles = [...infographicFiles, ...templateFiles];

let modified = 0;

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  const name = path.basename(filePath);

  // Pattern 1: .logo-icon { ... color: #ffffff ... font-size: 3.2rem ... }
  const oldLogoIcon = /\.logo-icon\s*\{[^}]*\}/g;
  content = content.replace(oldLogoIcon, (match) => {
    let updated = match
      .replace(/color:\s*#fff(?:fff)?/g, 'color: #00d4ff')
      .replace(/font-size:\s*[\d.]+rem/g, 'font-size: 4rem');
    if (updated !== match) { changed = true; }
    return updated;
  });

  // Pattern 1: .logo-text { ... font-size: 1.4rem ... }
  const oldLogoText = /\.logo-text\s*\{[^}]*\}/g;
  content = content.replace(oldLogoText, (match) => {
    let updated = match
      .replace(/font-size:\s*[\d.]+rem/g, 'font-size: 1.8rem');
    if (updated !== match) { changed = true; }
    return updated;
  });

  // Pattern 2: .logo .euro { ... }
  const oldEuro = /\.logo\s+\.euro\s*\{[^}]*\}/g;
  content = content.replace(oldEuro, (match) => {
    let updated = match
      .replace(/color:\s*#fff(?:fff)?/g, 'color: #00d4ff')
      .replace(/font-size:\s*[\d.]+rem/g, 'font-size: 4rem');
    if (updated !== match) { changed = true; }
    return updated;
  });

  // Pattern 2: .logo .text { ... }
  const oldText = /\.logo\s+\.text\s*\{[^}]*\}/g;
  content = content.replace(oldText, (match) => {
    let updated = match
      .replace(/font-size:\s*[\d.]+rem/g, 'font-size: 1.8rem');
    if (updated !== match) { changed = true; }
    return updated;
  });

  // Inline styles in telegram-generated infographics (style="...font-size:3.2rem;color:#ffffff...")
  // for the € symbol
  content = content.replace(
    /font-size:3\.2rem;color:#ffffff/g,
    (match) => { changed = true; return 'font-size:4rem;color:#00d4ff'; }
  );

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    modified++;
    console.log(`✓ ${name}`);
  }
}

console.log(`\n${modified}/${allFiles.length} fichiers mis à jour.`);

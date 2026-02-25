#!/usr/bin/env node
/**
 * Met à jour le branding dans tous les fichiers HTML source :
 * 1. "Où Va l'Argent" → "Où Va l'Argent ?" (logo)
 * 2. Augmente la taille de "ouvalargent.com" (.website font-size)
 *
 * Usage: node scripts/_batch-update-branding.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const HTML_DIR = path.join(__dirname, '../../Production interne/Réseaux Sociaux /Infographies/Sources HTML');
const DRY_RUN = process.argv.includes('--dry-run');

const files = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));

console.log(`\n🔧 Mise à jour branding — ${files.length} fichiers HTML${DRY_RUN ? ' (DRY RUN)' : ''}\n`);

let updated = 0;

for (const file of files) {
  const filePath = path.join(HTML_DIR, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Logo : ajouter "?" (mais pas si déjà présent)
  // Gère les deux cas : class="logo-text" et style inline
  if (html.includes("Où Va l'Argent</") && !html.includes("Où Va l'Argent ?</")) {
    html = html.replace(/Où Va l'Argent<\//g, "Où Va l'Argent ?</");
    changed = true;
  }
  // Version avec Unicode escape
  if (html.includes("O\\u00F9 Va l'Argent</") && !html.includes("O\\u00F9 Va l'Argent ?</")) {
    html = html.replace(/O\\u00F9 Va l'Argent<\//g, "O\\u00F9 Va l'Argent ?</");
    changed = true;
  }

  // 2. Augmenter .website font-size
  // Cherche le pattern CSS .website { ... font-size: Xrem ... }
  const websiteRegex = /(\.website\s*\{[^}]*font-size:\s*)([\d.]+)(rem)/g;
  html = html.replace(websiteRegex, (match, before, size, unit) => {
    const oldSize = parseFloat(size);
    let newSize;
    if (oldSize <= 1.0) newSize = 1.3;
    else if (oldSize <= 1.2) newSize = 1.5;
    else if (oldSize <= 1.35) newSize = 1.6;
    else if (oldSize <= 1.5) newSize = 1.8;
    else newSize = oldSize; // déjà assez grand

    if (newSize !== oldSize) {
      changed = true;
      return `${before}${newSize}${unit}`;
    }
    return match;
  });

  // 2b. Aussi les font-size inline style pour ouvalargent.com
  const inlineRegex = /(font-size:\s*)([\d.]+)(rem[^>]*>ouvalargent\.com)/g;
  html = html.replace(inlineRegex, (match, before, size, after) => {
    const oldSize = parseFloat(size);
    let newSize;
    if (oldSize <= 1.0) newSize = 1.3;
    else if (oldSize <= 1.2) newSize = 1.5;
    else if (oldSize <= 1.35) newSize = 1.6;
    else if (oldSize <= 1.5) newSize = 1.8;
    else newSize = oldSize;

    if (newSize !== oldSize) {
      changed = true;
      return `${before}${newSize}${after}`;
    }
    return match;
  });

  // 3. Augmenter font-weight de .website à 600
  const weightRegex = /(\.website\s*\{[^}]*font-weight:\s*)(400|500)(\s*;)/g;
  html = html.replace(weightRegex, (match, before, weight, after) => {
    changed = true;
    return `${before}600${after}`;
  });

  if (changed) {
    if (!DRY_RUN) fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ ${file}`);
    updated++;
  } else {
    console.log(`– ${file} (déjà à jour)`);
  }
}

console.log(`\n✅ ${updated}/${files.length} fichiers mis à jour${DRY_RUN ? ' (simulation)' : ''}\n`);

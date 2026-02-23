#!/usr/bin/env node
/**
 * Batch script to:
 * 1. Remove the .tag element (thematic badge top-right) from all infographics and templates
 * 2. Ensure the logo uses Instrument Serif white (new logo format)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const INFOGRAPHICS_DIR = path.join(__dirname, '../../Production interne/Réseaux Sociaux /Infographies/Sources HTML');
const TEMPLATES_DIR = path.join(__dirname, '../../Templates/Réseaux sociaux');

// Collect all HTML files
const infographicFiles = glob.sync('*.html', { cwd: INFOGRAPHICS_DIR }).map(f => path.join(INFOGRAPHICS_DIR, f));
const templateFiles = glob.sync('template-*.html', { cwd: TEMPLATES_DIR }).map(f => path.join(TEMPLATES_DIR, f));
const allFiles = [...infographicFiles, ...templateFiles];

console.log(`Found ${infographicFiles.length} infographic files`);
console.log(`Found ${templateFiles.length} template files`);
console.log(`Total: ${allFiles.length} files to process\n`);

let modifiedCount = 0;
let tagRemovedCount = 0;
let logoUpdatedCount = 0;

for (const filePath of allFiles) {
    const fileName = path.basename(filePath);
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    const changes = [];

    // ===== 1. REMOVE TAG HTML =====
    // Pattern: <div class="tag...">...</div> (various formats)
    const tagHtmlRegex = /\s*<div class="tag[^"]*">[^<]*<\/div>\s*/g;
    if (tagHtmlRegex.test(content)) {
        content = content.replace(/\s*<div class="tag[^"]*">[^<]*<\/div>/g, '');
        modified = true;
        tagRemovedCount++;
        changes.push('removed tag HTML');
    }

    // ===== 2. REMOVE TAG CSS =====
    // Remove .tag { ... } blocks (single-line and multi-line)

    // Multi-line .tag CSS blocks
    // Match .tag { ... } with possible nested content
    const tagCssMultiline = /\s*\.tag\s*\{[^}]*\}/g;
    if (tagCssMultiline.test(content)) {
        content = content.replace(/\s*\.tag\s*\{[^}]*\}/g, '');
        modified = true;
        changes.push('removed .tag CSS');
    }

    // Color variant CSS: .tag.red, .tag.gold, .tag.green, .tag.purple, .tag.orange
    const tagVariantCss = /\s*\.tag\.\w+\s*\{[^}]*\}/g;
    if (tagVariantCss.test(content)) {
        content = content.replace(/\s*\.tag\.\w+\s*\{[^}]*\}/g, '');
        modified = true;
        changes.push('removed .tag variant CSS');
    }

    // Format-specific tag overrides: .format-tiktok .tag, .format-rectangle .tag
    const tagFormatCss = /\s*\.format-\w+\s+\.tag\s*\{[^}]*\}/g;
    if (tagFormatCss.test(content)) {
        content = content.replace(/\s*\.format-\w+\s+\.tag\s*\{[^}]*\}/g, '');
        modified = true;
        changes.push('removed format-specific .tag CSS');
    }

    // Remove /* Tag */ or /* --- Tag --- */ comments
    content = content.replace(/\s*\/\*\s*-*\s*Tag\s*-*\s*\*\//gi, '');

    // ===== 3. UPDATE LOGO =====
    // Check for old logo patterns and update to new Instrument Serif white

    // Pattern A: <div class="logo-icon">€</div> with gradient background CSS
    const hasOldLogoA = content.includes('logo-icon') &&
                        (content.includes('linear-gradient(135deg') && content.includes('logo-icon')) &&
                        content.includes("'JetBrains Mono'") && /logo-icon/.test(content);

    // Check if logo-icon has gradient background (old style)
    const logoIconCssMatch = content.match(/\.logo-icon\s*\{([^}]*)\}/);
    const hasGradientLogo = logoIconCssMatch && logoIconCssMatch[1].includes('linear-gradient');

    if (hasGradientLogo) {
        // Replace old logo-icon CSS with new Instrument Serif white style
        // Handle both multi-line and single-line CSS
        content = content.replace(
            /\.logo-icon\s*\{[^}]*\}/g,
            `.logo-icon { font-family: 'Instrument Serif', serif; font-size: 3.2rem; color: #ffffff; line-height: 1; }`
        );

        // Update logo-text to match new style
        content = content.replace(
            /\.logo-text\s*\{[^}]*\}/g,
            `.logo-text { font-family: 'Instrument Serif', serif; font-size: 1.4rem; font-style: italic; color: #ffffff; line-height: 1; }`
        );

        // Change <div class="logo-icon"> to <span class="logo-icon">
        content = content.replace(/<div class="logo-icon">€<\/div>/g, '<span class="logo-icon">€</span>');

        modified = true;
        logoUpdatedCount++;
        changes.push('updated logo to Instrument Serif white');
    }

    // Pattern B: <span class="euro">€</span><span class="text">
    if (content.includes('class="euro"') && content.includes('class="text"')) {
        // Check if already correct style
        const euroCss = content.match(/\.logo\s+\.euro\s*\{([^}]*)\}/);
        const euroInline = content.match(/\.euro\s*\{([^}]*)\}/);
        const cssToCheck = euroCss ? euroCss[1] : (euroInline ? euroInline[1] : '');

        if (!cssToCheck.includes("'Instrument Serif'") || !cssToCheck.includes('#fff')) {
            // Update CSS
            content = content.replace(
                /\.logo\s+\.euro\s*\{[^}]*\}/g,
                `.logo .euro { font-family: 'Instrument Serif', serif; font-size: 3.2rem; color: #ffffff; line-height: 1; }`
            );
            content = content.replace(
                /\.logo\s+\.text\s*\{[^}]*\}/g,
                `.logo .text { font-family: 'Instrument Serif', serif; font-size: 1.4rem; font-style: italic; color: #ffffff; line-height: 1; }`
            );
            modified = true;
            logoUpdatedCount++;
            changes.push('updated euro/text logo to Instrument Serif white');
        }
    }

    // ===== 4. CLEAN UP EMPTY HEADER LINES =====
    // After removing tag, header might have extra whitespace
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        modifiedCount++;
        console.log(`✓ ${fileName}: ${changes.join(', ')}`);
    } else {
        // Check if tag exists in some other form we didn't catch
        if (content.includes('class="tag')) {
            console.log(`⚠ ${fileName}: STILL HAS TAG (uncaught pattern)`);
        }
    }
}

console.log(`\n========== SUMMARY ==========`);
console.log(`Files processed: ${allFiles.length}`);
console.log(`Files modified: ${modifiedCount}`);
console.log(`Tags removed: ${tagRemovedCount}`);
console.log(`Logos updated: ${logoUpdatedCount}`);

// Verify no tags remain
let remaining = 0;
for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('class="tag')) {
        remaining++;
        console.log(`⚠ REMAINING TAG in: ${path.basename(filePath)}`);
    }
}
if (remaining === 0) {
    console.log('✓ All tags successfully removed!');
}

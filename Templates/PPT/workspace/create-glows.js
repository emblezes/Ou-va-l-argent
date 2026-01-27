const sharp = require('sharp');
const path = require('path');

// Dimensions du slide en pixels (pour une bonne qualité)
const WIDTH = 1920;
const HEIGHT = 1080;

async function createGlowCyan() {
    // Glow cyan en haut à droite
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <defs>
            <radialGradient id="glowCyan" cx="85%" cy="15%" r="45%" fx="85%" fy="15%">
                <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.18"/>
                <stop offset="40%" style="stop-color:#00d4ff;stop-opacity:0.08"/>
                <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:0"/>
            </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#glowCyan)"/>
    </svg>`;

    await sharp(Buffer.from(svg))
        .png()
        .toFile(path.join(__dirname, 'glow-cyan.png'));

    console.log('Created glow-cyan.png');
}

async function createGlowGold() {
    // Glow doré en bas à gauche
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <defs>
            <radialGradient id="glowGold" cx="15%" cy="85%" r="40%" fx="15%" fy="85%">
                <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.12"/>
                <stop offset="40%" style="stop-color:#ffd700;stop-opacity:0.05"/>
                <stop offset="100%" style="stop-color:#ffd700;stop-opacity:0"/>
            </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#glowGold)"/>
    </svg>`;

    await sharp(Buffer.from(svg))
        .png()
        .toFile(path.join(__dirname, 'glow-gold.png'));

    console.log('Created glow-gold.png');
}

async function createCombinedGlow() {
    // Les deux glows combinés
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <defs>
            <radialGradient id="glowCyan" cx="85%" cy="10%" r="50%" fx="85%" fy="10%">
                <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.20"/>
                <stop offset="35%" style="stop-color:#00d4ff;stop-opacity:0.10"/>
                <stop offset="70%" style="stop-color:#00d4ff;stop-opacity:0.03"/>
                <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:0"/>
            </radialGradient>
            <radialGradient id="glowGold" cx="10%" cy="90%" r="45%" fx="10%" fy="90%">
                <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.12"/>
                <stop offset="35%" style="stop-color:#ffd700;stop-opacity:0.06"/>
                <stop offset="70%" style="stop-color:#ffd700;stop-opacity:0.02"/>
                <stop offset="100%" style="stop-color:#ffd700;stop-opacity:0"/>
            </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#glowCyan)"/>
        <rect width="100%" height="100%" fill="url(#glowGold)"/>
    </svg>`;

    await sharp(Buffer.from(svg))
        .png()
        .toFile(path.join(__dirname, 'glow-combined.png'));

    console.log('Created glow-combined.png');
}

async function main() {
    try {
        await createGlowCyan();
        await createGlowGold();
        await createCombinedGlow();
        console.log('All glow images created successfully!');
    } catch (err) {
        console.error('Error:', err);
    }
}

main();

/**
 * Script batch pour exporter toutes les infographies HTML
 * en formats Instagram (1080x1080) et TikTok (1080x1920)
 * avec adaptation du contenu au format TikTok
 *
 * Usage: node batch-export-all.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Réseaux Sociaux ';
const HTML_DIR = path.join(BASE, 'Infographies', 'Sources HTML');
const INSTA_DIR = path.join(BASE, 'Infographies', 'Insta & Autres');
const TIKTOK_V_DIR = path.join(BASE, 'Infographies', 'Tiktok Vertical');
const TIKTOK_H_DIR = path.join(BASE, 'Infographies', 'Tiktok Horizontal');

// CSS overrides pour adapter le contenu au format TikTok (1080x1920)
const TIKTOK_CSS = `
/* ===== FORMAT TIKTOK (9:16) — Contenu en haut, espace libre en bas pour la tête ===== */

body { padding: 0 !important; margin: 0 !important; }

.infographic {
  width: 1080px !important;
  height: 1920px !important;
}

.content {
  padding: 50px 30px 35px !important;
  gap: 10px !important;
  justify-content: flex-start !important;
}

/* Empêcher le chart-container de centrer verticalement */
.chart-container {
  flex: 0 !important;
  justify-content: flex-start !important;
}

/* Le main-stat (ChatGPT) aussi en haut */
.main-stat {
  flex: 0 !important;
  justify-content: flex-start !important;
}

/* Le main-content (Singapour) aussi en haut */
.main-content {
  flex: 0 !important;
}

/* --- Header : logo CENTRÉ et GROS pour TikTok --- */
.header {
  margin-bottom: 10px !important;
  justify-content: center !important;
}

.logo {
  flex-direction: row !important;
  align-items: center !important;
  gap: 12px !important;
}

.tag { display: none !important; }

.logo-icon {
  font-family: 'Instrument Serif', serif !important;
  font-size: 5rem !important;
  color: #00d4ff !important;
  line-height: 1 !important;
  width: auto !important;
  height: auto !important;
  background: none !important;
  border-radius: 0 !important;
}

.logo-text {
  font-family: 'Instrument Serif', serif !important;
  font-size: 3rem !important;
  font-style: italic !important;
  color: #ffffff !important;
  white-space: nowrap !important;
}

/* --- Titres ÉNORMES pour TikTok — impact visuel maximum --- */
.section-title, .chart-title {
  font-size: 5rem !important;
  margin-bottom: 10px !important;
  line-height: 1.1 !important;
}

.main-title {
  margin-bottom: 30px !important;
}

.main-title h1 {
  font-size: 4.5rem !important;
}

.subtitle {
  font-size: 2.2rem !important;
  margin-bottom: 60px !important;
}

/* --- Stat choc --- */
.stat-label {
  font-size: 2.2rem !important;
  margin-bottom: 40px !important;
}

.stat-value {
  font-size: 280px !important;
  margin-bottom: 40px !important;
}

.stat-unit {
  font-size: 5.5rem !important;
  margin-bottom: 50px !important;
}

.stat-context {
  font-size: 2.6rem !important;
  line-height: 1.5 !important;
}

.chatgpt-icon {
  width: 160px !important;
  height: 160px !important;
  font-size: 5rem !important;
  margin-bottom: 50px !important;
  border-radius: 32px !important;
}

/* --- Comparaisons --- */
.comparison-grid {
  gap: 50px !important;
}

.comparison-item {
  padding: 70px 45px !important;
  border-radius: 30px !important;
}

.flag {
  font-size: 5.5rem !important;
  margin-bottom: 25px !important;
}

.comparison-label {
  font-size: 2.5rem !important;
  margin-bottom: 30px !important;
}

.comparison-value {
  font-size: 6rem !important;
  margin-bottom: 15px !important;
}

.comparison-desc {
  font-size: 1.8rem !important;
  margin-bottom: 35px !important;
}

.growth-badge {
  font-size: 1.9rem !important;
  padding: 16px 30px !important;
}

.vs-badge {
  width: 130px !important;
  height: 130px !important;
}

.vs-text {
  font-size: 1.6rem !important;
}

.vs-year {
  font-size: 1.4rem !important;
}

.prediction-box {
  padding: 40px 50px !important;
  margin-top: 50px !important;
  border-radius: 20px !important;
}

.prediction-text {
  font-size: 2.4rem !important;
  line-height: 1.5 !important;
}

/* --- Rankings / Bar charts (compact pour 7-9 items dans 1920px) --- */
.ranking {
  gap: 14px !important;
  margin-bottom: 10px !important;
}

.rank-item {
  padding: 16px 35px !important;
  gap: 22px !important;
  border-radius: 18px !important;
}

.rank-number {
  font-size: 2.4rem !important;
  width: 55px !important;
}

.rank-flag {
  font-size: 3rem !important;
}

.rank-country {
  font-size: 1.9rem !important;
  margin-bottom: 4px !important;
}

.rank-value {
  font-size: 2.4rem !important;
  min-width: 110px !important;
}

.rank-bar {
  height: 28px !important;
}

.separator {
  margin: 6px 0 !important;
}

/* --- Timeline / Cuivre --- */
.timeline-container {
  flex: 1 !important;
}

.timeline {
  height: 900px !important;
  padding: 0 50px !important;
}

.timeline::before {
  bottom: 100px !important;
}

.timeline-item {
  width: 210px !important;
}

.timeline-value {
  font-size: 2.5rem !important;
  margin-bottom: 20px !important;
}

.timeline-dot {
  width: 22px !important;
  height: 22px !important;
  border-width: 4px !important;
  margin-bottom: 20px !important;
}

.timeline-year {
  font-size: 1.7rem !important;
}

.multiplier {
  padding: 18px 35px !important;
  border-radius: 16px !important;
}

.multiplier-text {
  font-size: 2rem !important;
}

/* --- Suppression des conteneurs glass en TikTok --- */
/* Les graphiques et comparaisons occupent directement toute la slide */
.comparison-item {
  background: transparent !important;
  border: none !important;
  padding: 50px 30px !important;
}

.comparison-item.highlight::before,
.comparison-item.dim::before {
  height: 3px !important;
  border-radius: 0 !important;
}

/* --- Conteneurs graphiques SVG : fond transparent, taille naturelle --- */
.chart-wrapper {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 10px 0 !important;
  margin-bottom: 15px !important;
  flex-shrink: 0 !important;
}

.chart-area {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 10px 10px !important;
  flex-shrink: 0 !important;
}

.main-content {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

.line-chart,
.chart-svg {
  width: 100% !important;
  height: auto !important;
}

/* --- Key stats (Singapour) : remplit l'espace sous le graphique --- */
.key-stats {
  background: rgba(17, 24, 32, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 24px !important;
  padding: 60px 50px !important;
  gap: 60px !important;
  flex: 1 !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

.key-stat {
  gap: 30px !important;
  justify-content: center !important;
}

.key-stat-flag {
  font-size: 5.5rem !important;
}

.key-stat-label {
  font-size: 2.2rem !important;
  margin-bottom: 12px !important;
}

.key-stat-value {
  font-size: 6rem !important;
}

/* --- Prediction box (Pologne) : remplit l'espace sous le graphique --- */
.prediction-box {
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 50px 60px !important;
  margin-top: 30px !important;
  border-radius: 24px !important;
}

.prediction-text {
  font-size: 2.8rem !important;
  line-height: 1.6 !important;
}

/* --- Section subtitle --- */
.section-subtitle {
  font-size: 2.2rem !important;
  margin-bottom: 40px !important;
}

/* --- Footer (suit le contenu, ne colle pas au bas de la slide) --- */
.footer {
  padding-top: 25px !important;
  margin-top: 20px !important;
  margin-bottom: 0 !important;
  flex-shrink: 0 !important;
}

/* Annuler margin-top:auto qui pousse le footer en bas */
.footer[style], .content > .footer {
  margin-top: 20px !important;
}

.source {
  font-size: 1.5rem !important;
}

.website-url {
  font-size: 1.8rem !important;
}

.website-handle {
  font-size: 1.55rem !important;
}

/* --- Bar charts (salaires) : supprimer les barres, montrer les valeurs --- */
.bar-chart {
  gap: 35px !important;
}

.bar-item {
  gap: 30px !important;
  padding: 28px 35px !important;
}

.bar-label {
  font-size: 2.4rem !important;
  width: 350px !important;
}

.bar-track {
  background: transparent !important;
  height: auto !important;
  overflow: visible !important;
}

.bar-fill {
  background: transparent !important;
  background-image: none !important;
  width: auto !important;
  height: auto !important;
  padding: 0 !important;
  font-size: 3.5rem !important;
  justify-content: flex-start !important;
  border-radius: 0 !important;
}

.bar-fill.gold { color: var(--accent-gold) !important; }
.bar-fill.electric { color: var(--accent-electric) !important; }
.bar-fill.purple { color: var(--accent-purple) !important; }
.bar-fill.green { color: var(--accent-green) !important; }

/* --- Rank year (cigarettes) --- */
.rank-year {
  font-size: 1.8rem !important;
  min-width: 85px !important;
}

/* --- Multiplier badge --- */
.multiplier-badge {
  margin-bottom: 20px !important;
}

.multiplier-badge span {
  font-size: 1.6rem !important;
  padding: 10px 30px !important;
}

/* --- Barres verticales (dette Europe #02 etc.) — TikTok V --- */
.bars-wrapper {
  gap: 6px !important;
  padding: 0 5px !important;
}

.bars-wrapper .bar-col {
  gap: 4px !important;
  max-width: 105px !important;
}

/* bars-container type charts (#01, #08a) : no max-width, let flex fill */
.bars-container .bar-col {
  max-width: none !important;
}

.bars-wrapper .bar {
  width: 60px !important;
  border-radius: 6px 6px 3px 3px !important;
}

.bar-value {
  font-size: 1.7rem !important;
  font-weight: 700 !important;
}

.bar-flag {
  font-size: 2.8rem !important;
}

.bar-country {
  font-size: 1.15rem !important;
  font-weight: 700 !important;
}

.bar-label {
  margin-top: 8px !important;
  gap: 2px !important;
}

/* --- Section labels --- */
.section-label {
  font-size: 1.2rem !important;
  margin-bottom: 10px !important;
}

/* --- Replacement line (fertilité) --- */
.replacement-line {
  margin: 4px 0 !important;
}

.replacement-line .label {
  font-size: 1.1rem !important;
}

/* --- Threshold / average lines --- */
.threshold-line, .avg-line {
  margin: 4px 0 !important;
}

.threshold-line .label, .avg-line .label {
  font-size: 1.1rem !important;
}

/* --- Chart subtitle --- */
.chart-subtitle {
  font-size: 1.5rem !important;
  margin-bottom: 15px !important;
}

/* Salaires table */
.salary-table {
  gap: 24px !important;
}

.salary-row {
  padding: 28px 35px !important;
  border-radius: 20px !important;
  gap: 25px !important;
}

.salary-job {
  font-size: 1.9rem !important;
}

.salary-amount {
  font-size: 2.8rem !important;
}

.salary-flag {
  font-size: 3.5rem !important;
}

.salary-country {
  font-size: 1.8rem !important;
}

.highlight-box {
  padding: 35px 45px !important;
  margin-top: 40px !important;
  border-radius: 20px !important;
}

.highlight-text {
  font-size: 2.2rem !important;
  line-height: 1.5 !important;
}

/* --- Vertical bar chart (déficit) --- */
.chart-area {
  height: 700px !important;
  flex: 0 0 auto !important;
}

.bar-value {
  font-size: 1.8rem !important;
}

.bar-down .bar-value {
  bottom: -45px !important;
}

.bar-down.france .bar-value {
  font-size: 2.2rem !important;
}

.bar-up {
  width: 90% !important;
}

.bar-up .bar-value {
  top: -45px !important;
}

/* --- Year labels (bars-container type charts) : sync gap with bars --- */
.year-labels {
  gap: 10px !important;
  margin-top: 10px !important;
  padding: 0 10px !important;
}

.year-num {
  font-size: 1.3rem !important;
}

.bars-container {
  gap: 10px !important;
}

.bar-label-extra {
  font-size: 1rem !important;
  top: -55px !important;
}

.zero-label {
  display: none !important;
}

.country-labels {
  margin-top: 50px !important;
  padding: 0 10px !important;
}

.country-flag {
  font-size: 3.5rem !important;
}

.country-name {
  font-size: 1.8rem !important;
}

/* --- SVG line chart (retraites #16) : chiffres beaucoup plus gros en TikTok --- */
.chart-area svg .svg-value {
  font-size: 52px !important;
  transform: translateY(-20px);
}

.chart-area svg .svg-annotation {
  font-size: 30px !important;
  transform: translateY(-45px);
}

.chart-area svg .svg-projection {
  font-size: 28px !important;
}

.chart-area svg text[font-size="18"] {
  font-size: 30px !important;
}

.chart-area svg circle {
  r: 12;
}

/* ===== NOUVEAUX TYPES — TikTok Vertical ===== */

/* --- Pie Chart --- */
.pie-section {
  gap: 60px !important;
}

.pie-container {
  width: 500px !important;
  height: 500px !important;
}

.pie-legend {
  gap: 22px !important;
}

.pie-legend-item {
  padding: 18px 28px !important;
  border-radius: 18px !important;
  min-width: 420px !important;
}

.pie-legend-item .legend-label {
  font-size: 1.6rem !important;
}

.pie-legend-item .legend-pct {
  font-size: 2.2rem !important;
}

/* --- Donut Chart --- */
.donut-section {
  gap: 60px !important;
}

.donut-container {
  width: 500px !important;
  height: 500px !important;
}

.donut-center-value {
  font-size: 3.5rem !important;
}

.donut-center-label {
  font-size: 1.4rem !important;
}

.legend {
  gap: 22px !important;
}

.legend-item {
  padding: 18px 28px !important;
  border-radius: 18px !important;
  min-width: 420px !important;
  gap: 20px !important;
}

.legend-label {
  font-size: 1.5rem !important;
}

.legend-pct {
  font-size: 2rem !important;
}

.legend-amount {
  font-size: 1.2rem !important;
}

/* --- Line Chart --- */
.line-chart-section {
  flex: 1 !important;
}

.line-chart-svg {
  width: 100% !important;
  height: auto !important;
}

.line-chart-point {
  r: 10 !important;
}

.line-chart-label {
  font-size: 1.6rem !important;
}

.line-chart-legend {
  gap: 40px !important;
  font-size: 1.6rem !important;
  margin-top: 30px !important;
}

/* --- Area Chart --- */
.area-chart-section {
  flex: 1 !important;
}

.area-chart-svg {
  width: 100% !important;
  height: auto !important;
}

.area-chart-legend {
  font-size: 1.6rem !important;
  margin-top: 30px !important;
}

/* --- Stacked Bars --- */
.stacked-chart {
  gap: 30px !important;
  height: 900px !important;
}

.stacked-col {
  gap: 3px !important;
}

.stacked-label {
  font-size: 1.8rem !important;
  margin-top: 15px !important;
}

.stacked-value {
  font-size: 1.5rem !important;
}

.stacked-legend {
  gap: 30px !important;
  font-size: 1.4rem !important;
  margin-top: 30px !important;
}

.stacked-segment {
  font-size: 1.5rem !important;
}

/* --- Grouped Bars --- */
.grouped-chart {
  gap: 40px !important;
  height: 900px !important;
}

.grouped-group {
  gap: 10px !important;
}

.grouped-bar {
  width: 80px !important;
}

.grouped-label {
  font-size: 1.8rem !important;
  margin-top: 15px !important;
}

.grouped-value {
  font-size: 1.5rem !important;
}

.grouped-legend {
  gap: 30px !important;
  font-size: 1.4rem !important;
}

/* --- Waterfall --- */
.waterfall-chart {
  height: 850px !important;
  gap: 12px !important;
}

.waterfall-col {
  min-width: 100px !important;
}

.waterfall-label {
  font-size: 1.4rem !important;
}

.waterfall-value {
  font-size: 1.8rem !important;
}

.waterfall-connector {
  border-width: 2px !important;
}

/* --- Gauge --- */
.gauge-section {
  flex: 1 !important;
  justify-content: center !important;
}

.gauge-container {
  width: 700px !important;
  margin: 0 auto !important;
}

.gauge-svg {
  width: 100% !important;
  height: auto !important;
}

.gauge-value {
  font-size: 8rem !important;
}

.gauge-label {
  font-size: 2.2rem !important;
}

.gauge-threshold {
  font-size: 1.6rem !important;
}

.gauge-scale {
  font-size: 1.4rem !important;
}

/* --- Scatter --- */
.scatter-section {
  flex: 1 !important;
}

.scatter-svg {
  width: 100% !important;
  height: auto !important;
}

.scatter-point {
  r: 14 !important;
}

.scatter-label {
  font-size: 1.5rem !important;
}

.scatter-axis {
  font-size: 1.4rem !important;
}

.scatter-legend {
  gap: 30px !important;
  font-size: 1.4rem !important;
  margin-top: 20px !important;
}

/* --- Radar --- */
.radar-section {
  flex: 1 !important;
  align-items: center !important;
}

.radar-svg {
  width: 700px !important;
  height: 700px !important;
}

.radar-label {
  font-size: 1.6rem !important;
}

.radar-legend {
  gap: 40px !important;
  font-size: 1.6rem !important;
  margin-top: 30px !important;
}

/* --- Slope Chart --- */
.slope-chart {
  height: 900px !important;
}

.slope-axis {
  font-size: 2rem !important;
}

.slope-point {
  r: 10 !important;
}

.slope-label {
  font-size: 1.6rem !important;
}

.slope-value {
  font-size: 2.2rem !important;
}

.slope-line {
  stroke-width: 3px !important;
}

/* --- Treemap --- */
.treemap-section {
  flex: 1 !important;
}

.treemap-grid {
  flex: 1 !important;
  gap: 6px !important;
}

.treemap-cell {
  border-radius: 20px !important;
  padding: 25px !important;
}

.treemap-label {
  font-size: 1.8rem !important;
}

.treemap-value {
  font-size: 2.8rem !important;
}

/* --- Sankey / Fiche de paie (format TikTok Vertical) --- */
.sankey-wrapper {
  flex: 0 !important;
  justify-content: flex-start !important;
}

.title {
  font-size: 6rem !important;
  margin-bottom: 10px !important;
}

.bottom-bar {
  gap: 60px !important;
  padding-top: 30px !important;
  margin-top: 20px !important;
}

.bottom-bar .label {
  font-size: 1.5rem !important;
}

.bottom-bar .value {
  font-size: 2.4rem !important;
}

/* --- Compare bars (intérêts vs défense #09) — TikTok V --- */
.compare-area {
  gap: 40px !important;
  padding-bottom: 0 !important;
}
.compare-bar-wrapper {
  height: 380px !important;
}
.compare-val {
  font-size: 4rem !important;
}
.compare-label {
  font-size: 1.8rem !important;
}
.compare-sublabel {
  font-size: 1.2rem !important;
}
.chart-title {
  font-size: 3.5rem !important;
}
`;

// CSS overrides pour le format Rectangle horizontal (1080x600)
const RECTANGLE_CSS = `
/* ===== FORMAT RECTANGLE HORIZONTAL (1080×600) ===== */

body { padding: 0 !important; margin: 0 !important; }

.infographic {
  width: 1080px !important;
  height: 600px !important;
}

.content {
  padding: 10px 25px 8px !important;
  justify-content: flex-start !important;
  gap: 2px !important;
}

/* --- Header : logo CENTRÉ pour TikTok H --- */
.header {
  margin-bottom: 2px !important;
  justify-content: center !important;
}

.logo {
  flex-direction: row !important;
  align-items: center !important;
  gap: 8px !important;
}

.tag { display: none !important; }

.logo-icon {
  font-family: 'Instrument Serif', serif !important;
  font-size: 3.5rem !important;
  color: #00d4ff !important;
  line-height: 1 !important;
  width: auto !important;
  height: auto !important;
  background: none !important;
  border-radius: 0 !important;
}

.logo-text {
  font-family: 'Instrument Serif', serif !important;
  font-size: 2rem !important;
  font-style: italic !important;
  color: #ffffff !important;
  white-space: nowrap !important;
}

/* --- Titres ÉNORMES pour TikTok H — HOOK VISUEL MAXIMUM --- */
.section-title, .chart-title {
  font-size: 3.8rem !important;
  margin-bottom: 4px !important;
  line-height: 1.05 !important;
}

.main-title {
  margin-bottom: 6px !important;
}

.main-title h1 {
  font-size: 3.2rem !important;
}

.subtitle, .section-subtitle {
  font-size: 1.1rem !important;
  margin-bottom: 8px !important;
}

/* --- Stat choc — GROS CHIFFRES --- */
.stat-label {
  font-size: 1.4rem !important;
  margin-bottom: 6px !important;
}

.stat-value {
  font-size: 120px !important;
  margin-bottom: 6px !important;
}

.stat-unit {
  font-size: 2.8rem !important;
  margin-bottom: 8px !important;
}

.stat-context {
  font-size: 1.4rem !important;
}

.chatgpt-icon {
  width: 60px !important;
  height: 60px !important;
  font-size: 2rem !important;
  margin: 0 auto 12px !important;
  border-radius: 14px !important;
}

/* --- Comparaisons horizontales --- */
.comparison-grid {
  gap: 20px !important;
}

.comparison-item {
  padding: 20px 18px !important;
  border-radius: 14px !important;
}

.flag {
  font-size: 2.5rem !important;
  margin-bottom: 6px !important;
}

.comparison-label {
  font-size: 1.2rem !important;
  margin-bottom: 6px !important;
}

.comparison-value {
  font-size: 2.8rem !important;
  margin-bottom: 4px !important;
}

.comparison-desc {
  font-size: 0.9rem !important;
  margin-bottom: 8px !important;
}

.growth-badge {
  font-size: 0.9rem !important;
  padding: 5px 12px !important;
}

.vs-badge {
  width: 55px !important;
  height: 55px !important;
}

.vs-text {
  font-size: 0.8rem !important;
}

.vs-year {
  font-size: 0.7rem !important;
}

.prediction-box {
  padding: 10px 18px !important;
  margin-top: 10px !important;
  border-radius: 10px !important;
}

.prediction-text {
  font-size: 1.1rem !important;
  line-height: 1.3 !important;
}

/* --- Rankings compact (many items must fit in 600px) --- */
.ranking {
  gap: 3px !important;
  margin-bottom: 4px !important;
}

.rank-item {
  padding: 5px 12px !important;
  gap: 10px !important;
  border-radius: 8px !important;
}

.rank-number {
  font-size: 1.1rem !important;
  width: 28px !important;
}

.rank-flag {
  font-size: 1.3rem !important;
}

.rank-country {
  font-size: 0.8rem !important;
}

.rank-bar {
  height: 12px !important;
}

.rank-value {
  font-size: 1rem !important;
  min-width: 50px !important;
}

/* --- Barres verticales (dette Europe #02 etc.) — TikTok H --- */
.bars-wrapper {
  gap: 6px !important;
  padding: 0 5px !important;
  flex: 1 !important;
}

.bars-wrapper .bar-col {
  gap: 2px !important;
  max-width: 105px !important;
}

/* bars-container type charts (#01, #08a) : no max-width, let flex fill */
.bars-container .bar-col {
  max-width: none !important;
}

.bars-wrapper .bar {
  width: 45px !important;
  border-radius: 4px 4px 2px 2px !important;
}

.bar-value {
  font-size: 0.9rem !important;
  font-weight: 700 !important;
}

.bar-flag {
  font-size: 1.4rem !important;
}

.bar-country {
  font-size: 0.65rem !important;
  font-weight: 700 !important;
}

.bar-label {
  margin-top: 3px !important;
  gap: 1px !important;
}

.section-label {
  font-size: 0.6rem !important;
  margin-bottom: 2px !important;
  padding-left: 2px !important;
}

.separator {
  margin: 1px 0 !important;
}

.replacement-line {
  margin: 1px 0 !important;
}

.replacement-line .label {
  font-size: 0.55rem !important;
}

.chart-subtitle {
  font-size: 0.8rem !important;
  margin-bottom: 4px !important;
}

.multiplier-badge {
  margin-bottom: 6px !important;
}

.multiplier-badge span {
  font-size: 0.7rem !important;
  padding: 3px 10px !important;
}

.rank-year {
  font-size: 0.8rem !important;
  min-width: 40px !important;
}

/* --- Threshold / average lines --- */
.threshold-line, .avg-line {
  margin: 1px 0 !important;
}

.threshold-line .label, .avg-line .label {
  font-size: 0.55rem !important;
}

/* --- Timeline compact --- */
.timeline {
  height: 280px !important;
  padding: 0 20px !important;
}

.timeline::before {
  bottom: 50px !important;
}

.timeline-item {
  width: 120px !important;
}

.timeline-value {
  font-size: 1.2rem !important;
  margin-bottom: 6px !important;
}

.timeline-dot {
  width: 10px !important;
  height: 10px !important;
  margin-bottom: 8px !important;
}

.timeline-year {
  font-size: 0.85rem !important;
}

.multiplier {
  padding: 6px 14px !important;
}

.multiplier-text {
  font-size: 0.95rem !important;
}

/* --- Charts SVG --- */
.chart-wrapper {
  padding: 5px 0 !important;
  margin-bottom: 8px !important;
}

.chart-area {
  padding: 5px 5px !important;
}

.key-stats {
  padding: 12px 20px !important;
  gap: 40px !important;
}

.key-stat-flag {
  font-size: 1.8rem !important;
}

.key-stat-label {
  font-size: 0.8rem !important;
}

.key-stat-value {
  font-size: 2rem !important;
}

/* --- Bar chart (salaires) compact --- */
.bar-chart {
  gap: 10px !important;
}

.bar-label {
  width: 160px !important;
  font-size: 0.95rem !important;
}

.bar-track {
  height: 38px !important;
}

.bar-fill {
  font-size: 1rem !important;
  padding-right: 12px !important;
}

/* --- Vertical bar chart compact (déficit) --- */
.chart-area {
  height: 250px !important;
  flex: 0 0 auto !important;
}

.bars-container {
  gap: 8px !important;
}

.bar-value {
  font-size: 2.2rem !important;
}

.bar-down .bar-value {
  bottom: -40px !important;
}

.bar-down.france .bar-value {
  font-size: 2.6rem !important;
}

.bar-up {
  width: 85% !important;
}

.bar-up .bar-value {
  top: -40px !important;
}

/* --- Year labels (bars-container type charts) : sync gap with bars --- */
.year-labels {
  gap: 8px !important;
  margin-top: 5px !important;
  padding: 0 5px !important;
}

.year-num {
  font-size: 0.75rem !important;
}

.bar-label-extra {
  font-size: 0.5rem !important;
  top: -28px !important;
}

/* --- Highlight box compact --- */
.highlight-box {
  padding: 8px 15px !important;
  margin-top: 5px !important;
  border-radius: 8px !important;
}

.highlight-text {
  font-size: 0.7rem !important;
  line-height: 1.3 !important;
}

.zero-label {
  display: none !important;
}

.country-labels {
  margin-top: 30px !important;
  gap: 3px !important;
  padding: 0 5px !important;
}

.country-flag {
  font-size: 2.2rem !important;
}

.country-name {
  font-size: 1.1rem !important;
}

/* --- Footer compact --- */
.footer {
  padding-top: 3px !important;
  margin-top: 2px !important;
  border-top: none !important;
}

.source {
  font-size: 0.6rem !important;
}

.website-url {
  font-size: 0.85rem !important;
}

.website-handle {
  font-size: 0.72rem !important;
}

/* ===== NOUVEAUX TYPES — Rectangle Horizontal ===== */

/* --- Pie Chart --- */
.pie-section {
  gap: 20px !important;
}

.pie-container {
  width: 200px !important;
  height: 200px !important;
}

.pie-legend {
  gap: 4px !important;
}

.pie-legend-item {
  padding: 5px 10px !important;
  border-radius: 8px !important;
  min-width: 200px !important;
}

.pie-legend-item .legend-label {
  font-size: 0.75rem !important;
}

.pie-legend-item .legend-pct {
  font-size: 0.9rem !important;
}

/* --- Donut Chart --- */
.donut-section {
  gap: 20px !important;
}

.donut-container {
  width: 200px !important;
  height: 200px !important;
}

.donut-center-value {
  font-size: 1.4rem !important;
}

.donut-center-label {
  font-size: 0.6rem !important;
}

.legend {
  gap: 4px !important;
}

.legend-item {
  padding: 5px 10px !important;
  border-radius: 8px !important;
  min-width: 200px !important;
  gap: 8px !important;
}

.legend-label {
  font-size: 0.75rem !important;
}

.legend-pct {
  font-size: 0.85rem !important;
}

.legend-amount {
  font-size: 0.55rem !important;
}

.legend-color {
  width: 10px !important;
  height: 10px !important;
}

/* --- Line Chart --- */
.line-chart-section {
  flex: 1 !important;
}

.line-chart-label {
  font-size: 0.7rem !important;
}

.line-chart-legend {
  gap: 15px !important;
  font-size: 0.7rem !important;
  margin-top: 8px !important;
}

/* --- Area Chart --- */
.area-chart-section {
  flex: 1 !important;
}

.area-chart-legend {
  font-size: 0.7rem !important;
  margin-top: 8px !important;
}

/* --- Stacked Bars --- */
.stacked-chart {
  gap: 8px !important;
  height: 280px !important;
}

.stacked-label {
  font-size: 0.7rem !important;
  margin-top: 4px !important;
}

.stacked-value {
  font-size: 0.6rem !important;
}

.stacked-legend {
  gap: 10px !important;
  font-size: 0.6rem !important;
  margin-top: 6px !important;
}

.stacked-segment {
  font-size: 0.6rem !important;
}

/* --- Grouped Bars --- */
.grouped-chart {
  gap: 12px !important;
  height: 280px !important;
}

.grouped-bar {
  width: 30px !important;
}

.grouped-label {
  font-size: 0.7rem !important;
  margin-top: 4px !important;
}

.grouped-value {
  font-size: 0.6rem !important;
}

.grouped-legend {
  gap: 10px !important;
  font-size: 0.6rem !important;
}

/* --- Waterfall --- */
.waterfall-chart {
  height: 260px !important;
  gap: 3px !important;
}

.waterfall-col {
  min-width: 50px !important;
}

.waterfall-label {
  font-size: 0.6rem !important;
}

.waterfall-value {
  font-size: 0.7rem !important;
}

/* --- Gauge --- */
.gauge-container {
  width: 300px !important;
}

.gauge-value {
  font-size: 3.5rem !important;
}

.gauge-label {
  font-size: 0.9rem !important;
}

.gauge-threshold {
  font-size: 0.7rem !important;
}

.gauge-scale {
  font-size: 0.6rem !important;
}

/* --- Scatter --- */
.scatter-section {
  flex: 1 !important;
}

.scatter-point {
  r: 6 !important;
}

.scatter-label {
  font-size: 0.65rem !important;
}

.scatter-axis {
  font-size: 0.6rem !important;
}

.scatter-legend {
  gap: 10px !important;
  font-size: 0.6rem !important;
  margin-top: 6px !important;
}

/* --- Radar --- */
.radar-svg {
  width: 280px !important;
  height: 280px !important;
}

.radar-label {
  font-size: 0.7rem !important;
}

.radar-legend {
  gap: 15px !important;
  font-size: 0.7rem !important;
  margin-top: 8px !important;
}

/* --- Slope Chart --- */
.slope-chart {
  height: 300px !important;
}

.slope-axis {
  font-size: 0.85rem !important;
}

.slope-point {
  r: 5 !important;
}

.slope-label {
  font-size: 0.7rem !important;
}

.slope-value {
  font-size: 0.85rem !important;
}

/* --- Treemap --- */
.treemap-grid {
  gap: 3px !important;
}

.treemap-cell {
  border-radius: 8px !important;
  padding: 8px !important;
}

.treemap-label {
  font-size: 0.7rem !important;
}

.treemap-value {
  font-size: 1rem !important;
}

/* --- Sankey / Fiche de paie (format Rectangle Horizontal) --- */
.sankey-wrapper {
  flex: 1 !important;
  align-items: center !important;
  justify-content: center !important;
}

.sankey-wrapper svg {
  height: 370px !important;
  width: auto !important;
}

.title {
  font-size: 1.6rem !important;
  margin-bottom: 0px !important;
}

.bottom-bar {
  display: none !important;
}

.footer {
  padding-top: 4px !important;
  margin-top: 0px !important;
}

/* --- Compare bars (intérêts vs défense #09) — Rectangle H --- */
.compare-area {
  gap: 30px !important;
}
.compare-bar-wrapper {
  height: 280px !important;
  width: 140px !important;
}
.compare-val {
  font-size: 2rem !important;
  padding-top: 12px !important;
}
.compare-label {
  font-size: 1rem !important;
}
.compare-sublabel {
  font-size: 0.75rem !important;
}
.vs {
  font-size: 2rem !important;
}
.chart-title {
  font-size: 1.8rem !important;
  margin-top: 5px !important;
}
`;

// Define infographics: [htmlFile, infographicIndex, outputBaseName]
const INFOGRAPHICS = [
  ['1-detenteurs-dette-france.html', 0, '1-detenteurs-dette-france'],
  ['2-triple-degradation-notes.html', 0, '2-triple-degradation-notes'],
  ['3-france-2eme-plus-taxe-comparaison.html', 0, '3-france-2eme-plus-taxe-comparaison'],
  ['4-pression-fiscale-record-mondial.html', 0, '4-pression-fiscale-record-mondial'],
  ['5-actifs-fonds-pension-monde.html', 0, '5-actifs-fonds-pension-monde'],
  ['6-salaire-moyen-par-pays.html', 0, '6-salaire-moyen-par-pays'],
  ['7-prix-cigarette-france.html', 0, '7-prix-cigarette-france'],
  ['8-indice-big-mac.html', 0, '8-indice-big-mac'],
  ['9-salaires-suisse.html', 0, '9-salaires-suisse'],
  ['10-top5-pays-peuples.html', 0, '10-top5-pays-peuples'],
  ['11-hotels-plus-chers-paris.html', 0, '11-hotels-plus-chers-paris'],
  ['12-ue-dependance-terres-rares.html', 0, '12-ue-dependance-terres-rares'],
  ['13-explosion-dette-france.html', 0, '13-explosion-dette-france'],
  ['14-dette-publique-europe.html', 0, '14-dette-publique-europe'],
  ['15-deficit-zone-euro.html', 0, '15-deficit-zone-euro'],
  ['16-deficit-historique-france.html', 0, '16-deficit-historique-france'],
  ['17-charge-interets-dette.html', 0, '17-charge-interets-dette'],
  ['18-retraites-explosion-2070.html', 0, '18-retraites-explosion-2070'],
  ['19-capitalisation-vs-repartition.html', 0, '19-capitalisation-vs-repartition'],
  ['20-vieillissement-mondial-2070.html', 0, '20-vieillissement-mondial-2070'],
  ['21-qui-nourrit-etat.html', 0, '21-qui-nourrit-etat'],
  ['22-fiche-de-paie-decomposition.html', 0, '22-fiche-de-paie-decomposition'],
  ['23-guyana-pib-62pct.html', 0, '23-guyana-pib-62pct'],
  ['24-dette-48800-par-habitant.html', 0, '24-dette-48800-par-habitant'],
  ['25-dette-58md-interets.html', 0, '25-dette-58md-interets'],
  ['26-dette-53pct-etrangers.html', 0, '26-dette-53pct-etrangers'],
  ['27-dette-titre-couverture.html', 0, '27-dette-titre-couverture'],
  ['28-dette-3305-milliards.html', 0, '28-dette-3305-milliards'],
  ['29-dette-us-interets-vs-pentagone.html', 0, '29-dette-us-interets-vs-pentagone'],
  ['30-cout-total-salarie-europe.html', 0, '30-cout-total-salarie-europe'],
  ['31-dette-france-interets-croissants.html', 0, '31-dette-france-interets-croissants'],
  ['32-classement-depenses-sociales-europe-top5.html', 0, '32-classement-depenses-sociales-europe-top5'],
  ['33-france-championne-depenses-sociales-europe.html', 0, '33-france-championne-depenses-sociales-europe'],
  ['34-simulation-375k-brut-net.html', 0, '34-simulation-375k-brut-net'],
  ['35-mix-energetique-france-2030.html', 0, '35-mix-energetique-france-2030'],
  ['36-fiche-de-paie-simple.html', 0, '36-fiche-de-paie-simple'],
  ['39-depenses-publiques-pib-france.html', 0, '39-depenses-publiques-pib-france'],
  ['40-depenses-vs-recettes-france.html', 0, '40-depenses-vs-recettes-france'],
  ['41-etat-gaspille-votre-argent.html', 0, '41-etat-gaspille-votre-argent'],
  ['42-sortir-france-enfer-fiscal.html', 0, '42-sortir-france-enfer-fiscal'],
  ['43-france-enfer-fiscal-question.html', 0, '43-france-enfer-fiscal-question'],
  ['44-pas-de-retraite.html', 0, '44-pas-de-retraite'],
  ['45-etat-francais-faillite.html', 0, '45-etat-francais-faillite'],
  ['46-ou-va-largent.html', 0, '46-ou-va-largent'],
  ['47-ouvalargent-com.html', 0, '47-ouvalargent-com'],
  ['48-logo-euro.html', 0, '48-logo-euro'],
  ['49-abonne-toi.html', 0, '49-abonne-toi'],
  ['50-partage-ami-socialiste.html', 0, '50-partage-ami-socialiste'],
  ['51-partage-ami-chiffres.html', 0, '51-partage-ami-chiffres'],
  ['52-article-15-ddhc.html', 0, '52-article-15-ddhc'],
  ['53-dette-naissance-bebe.html', 0, '53-dette-naissance-bebe'],
  ['57-dette-5350-par-seconde.html', 0, '57-dette-5350-par-seconde'],
  ['61-dette-pile-billets-terre.html', 0, '61-dette-pile-billets-terre'],
  ['65-cout-eleve-recul-maths.html', 0, '65-cout-eleve-recul-maths'],
  ['66-cout-eleve-recul-maths.html', 0, '66-cout-eleve-recul-maths'],
  ['67-cout-eleve-recul-maths.html', 0, '67-cout-eleve-recul-maths'],
  ['68-medicaments-36-milliards.html', 0, '68-medicaments-36-milliards'],
  ['69-subvention-sncf-310-euros.html', 0, '69-subvention-sncf-310-euros'],
  ['70-subvention-sncf-310-euros.html', 0, '70-subvention-sncf-310-euros'],
  ['71-subvention-sncf-310-euros.html', 0, '71-subvention-sncf-310-euros'],
  ['72-subvention-sncf-310-euros.html', 0, '72-subvention-sncf-310-euros'],
  ['73-audiovisuel-public-4-milliards.html', 0, '73-audiovisuel-public-4-milliards'],
  ['74-audiovisuel-public-4-milliards.html', 0, '74-audiovisuel-public-4-milliards'],
  ['75-audiovisuel-public-4-milliards.html', 0, '75-audiovisuel-public-4-milliards'],
  ['76-audiovisuel-public-4-milliards.html', 0, '76-audiovisuel-public-4-milliards'],
  ['77-communes-france-34874.html', 0, '77-communes-france-34874'],
  ['78-communes-france-34874.html', 0, '78-communes-france-34874'],
  ['79-communes-france-34874.html', 0, '79-communes-france-34874'],
  ['80-communes-france-34874.html', 0, '80-communes-france-34874'],
  ['81-82-jours-travail-impots.html', 0, '81-82-jours-travail-impots'],
  ['82-salaire-suisse-double.html', 0, '82-salaire-suisse-double'],
  ['83-ratio-actifs-retraites.html', 0, '83-ratio-actifs-retraites'],
  ['84-taxe-fonciere-paris-52.html', 0, '84-taxe-fonciere-paris-52'],
  ['85-48-boites-medicaments.html', 0, '85-48-boites-medicaments'],
  ['86-code-travail-france-vs-suisse.html', 0, '86-code-travail-france-vs-suisse'],
  ['91-lits-hopitaux-supprimes.html', 0, '91-lits-hopitaux-supprimes'],
  ['92-evolution-depense-sociale.html', 0, '92-evolution-depense-sociale'],
  ['93-impot-societes-france-irlande.html', 0, '93-impot-societes-france-irlande'],
  ['94-deficit-169-milliards-2024.html', 0, '94-deficit-169-milliards-2024'],
  ['95-520000-elus-locaux-record.html', 0, '95-520000-elus-locaux-record'],
  ['97-depenses-sante-3700-par-habitant.html', 0, '97-depenses-sante-3700-par-habitant'],
  ['99-budget-defense-us-vs-france.html', 0, '99-budget-defense-us-vs-france'],
  ['100-3000-abonnes-twitter-green.html', 0, '100-3000-abonnes-twitter-green'],
  ['101-cta-abonne-toi.html', 0, '101-cta-abonne-toi'],
  ['102-fonctionnaires-paris-vs-europe.html', 0, '102-fonctionnaires-paris-vs-europe'],
  ['103-7000-abonnes.html', 0, '103-7000-abonnes'],
  ['104-0pct-is-benefices-reinvestis.html', 0, '104-0pct-is-benefices-reinvestis'],
  ['105-les-100-jours-couverture.html', 0, '105-les-100-jours-couverture'],
  ['106-cout-eleve-recul-maths.html', 0, '106-cout-eleve-recul-maths'],
  ['107-code-travail-france-vs-suisse.html', 0, '107-code-travail-france-vs-suisse'],
  ['108-code-travail-france-vs-suisse.html', 0, '108-code-travail-france-vs-suisse'],
  ['109-classement-pisa-maths.html', 0, '109-classement-pisa-maths'],
  ['110-simulation-375k-brut-net-en.html', 0, '110-simulation-375k-brut-net-en'],
  ['111-france-vs-dubai-fiscal-couverture.html', 0, '111-france-vs-dubai-fiscal-couverture'],
  ['112-france-vs-dubai-impot-revenu.html', 0, '112-france-vs-dubai-impot-revenu'],
  ['113-france-vs-dubai-impot-societes.html', 0, '113-france-vs-dubai-impot-societes'],
  ['114-france-vs-dubai-impot-capital.html', 0, '114-france-vs-dubai-impot-capital'],
  ['115-france-vs-dubai-tva.html', 0, '115-france-vs-dubai-tva'],
  ['116-esperance-vie-france.html', 0, '116-esperance-vie-france'],
  ['117-croissance-france.html', 0, '117-croissance-france'],
  ['118-depenses-sociales-vs-regalien.html', 0, '118-depenses-sociales-vs-regalien'],
  ['119-1000-euros-depenses-publiques.html', 0, '119-1000-euros-depenses-publiques'],
  ['120-droits-succession-comparaison.html', 0, '120-droits-succession-comparaison'],
  ['121-age-retraite-comparaison.html', 0, '121-age-retraite-comparaison'],
  ['122-depenses-pib-ocde.html', 0, '122-depenses-pib-ocde'],
  ['123-france-vs-chine-urss.html', 0, '123-france-vs-chine-urss'],
  ['124-depense-publique-vs-croissance.html', 0, '124-depense-publique-vs-croissance'],
  ['136-france-decroche-pib-habitant.html', 0, '136-france-decroche-pib-habitant'],
  ['137-croissance-francaise-panne.html', 0, '137-croissance-francaise-panne'],
  ['138-depenses-sociales-explosion-france.html', 0, '138-depenses-sociales-explosion-france'],
  ['139-france-plus-pauvre-europe-pib-ppa.html', 0, '139-france-plus-pauvre-europe-pib-ppa'],
  ['140-budget-justice-vs-retraites.html', 0, '140-budget-justice-vs-retraites'],
  ['141-nucleaire-chine-vs-allemagne.html', 0, '141-nucleaire-chine-vs-allemagne'],
  ['142-taux-pauvrete-monde.html', 0, '142-taux-pauvrete-monde'],
  ['143-production-nucleaire-france-chine-allemagne.html', 0, '143-production-nucleaire-france-chine-allemagne'],
  ['144-evolution-prix-m2-paris.html', 0, '144-evolution-prix-m2-paris'],
  ['145-prix-65m2-paris.html', 0, '145-prix-65m2-paris'],
  ['146-intermittents-carousel.html', 0, '146a-intermittents-titre'],
  ['146-intermittents-carousel.html', 1, '146b-intermittents-154600'],
  ['146-intermittents-carousel.html', 2, '146c-intermittents-10h-semaine'],
  ['146-intermittents-carousel.html', 3, '146d-intermittents-deficit'],
  ['146-intermittents-carousel.html', 4, '146e-intermittents-cta'],
  ['147-aides-sociales-carousel.html', 0, '147a-aides-sociales-titre'],
  ['147-aides-sociales-carousel.html', 1, '147b-aides-sociales-non-recours'],
  ['147-aides-sociales-carousel.html', 2, '147c-aides-sociales-850md'],
  ['147-aides-sociales-carousel.html', 3, '147d-aides-sociales-organismes'],
  ['147-aides-sociales-carousel.html', 4, '147e-aides-sociales-cta'],
  ['148-singapour-pib-habitant.html', 0, '148-singapour-pib-habitant'],
  ['149-interets-dette-carousel.html', 0, '149a-interets-dette-titre'],
  ['149-interets-dette-carousel.html', 1, '149b-interets-dette-sans-rembourser'],
  ['149-interets-dette-carousel.html', 2, '149c-interets-dette-comparaison'],
  ['149-interets-dette-carousel.html', 3, '149d-interets-dette-par-seconde'],
  ['149-interets-dette-carousel.html', 4, '149e-interets-dette-cta'],
  ['150-taxes-essence-carousel.html', 0, '150a-taxes-essence-titre'],
  ['150-taxes-essence-carousel.html', 1, '150b-taxes-essence-decomposition'],
  ['150-taxes-essence-carousel.html', 2, '150c-taxes-essence-plein'],
  ['150-taxes-essence-carousel.html', 3, '150d-taxes-essence-recettes'],
  ['150-taxes-essence-carousel.html', 4, '150e-taxes-essence-cta'],
  ['151-normes-france-carousel.html', 0, '151a-normes-france'],
  ['151-normes-france-carousel.html', 1, '151b-normes-france'],
  ['151-normes-france-carousel.html', 2, '151c-normes-france'],
  ['151-normes-france-carousel.html', 3, '151d-normes-france'],
  ['151-normes-france-carousel.html', 4, '151e-normes-france'],
  ['152-elus-locaux-carousel.html', 0, '152a-elus-locaux'],
  ['152-elus-locaux-carousel.html', 1, '152b-elus-locaux'],
  ['152-elus-locaux-carousel.html', 2, '152c-elus-locaux'],
  ['152-elus-locaux-carousel.html', 3, '152d-elus-locaux'],
  ['152-elus-locaux-carousel.html', 4, '152e-elus-locaux'],
  ['153-tgv-shinkansen-carousel.html', 0, '153a-tgv-shinkansen'],
  ['153-tgv-shinkansen-carousel.html', 1, '153b-tgv-shinkansen'],
  ['153-tgv-shinkansen-carousel.html', 2, '153c-tgv-shinkansen'],
  ['153-tgv-shinkansen-carousel.html', 3, '153d-tgv-shinkansen'],
  ['153-tgv-shinkansen-carousel.html', 4, '153e-tgv-shinkansen'],
  ['154-tva-cercueil-carousel.html', 0, '154a-tva-cercueil'],
  ['154-tva-cercueil-carousel.html', 1, '154b-tva-cercueil'],
  ['154-tva-cercueil-carousel.html', 2, '154c-tva-cercueil'],
  ['154-tva-cercueil-carousel.html', 3, '154d-tva-cercueil'],
  ['154-tva-cercueil-carousel.html', 4, '154e-tva-cercueil'],
  ['156-mercure-guyane-carousel.html', 0, '156a-mercure-guyane'],
  ['156-mercure-guyane-carousel.html', 1, '156b-mercure-guyane'],
  ['156-mercure-guyane-carousel.html', 2, '156c-mercure-guyane'],
  ['156-mercure-guyane-carousel.html', 3, '156d-mercure-guyane'],
  ['156-mercure-guyane-carousel.html', 4, '156e-mercure-guyane'],
  ['157-taux-emprunt-france-10ans.html', 0, '157-taux-emprunt-france-10ans'],
  ['170-retraite-reduit-pauvrete.html', 0, '170-retraite-reduit-pauvrete'],
  ['171-salaire-brut-net-impot.html', 0, '171-salaire-brut-net-impot'],
  ['172-plein-essence-taxes-vs-cout.html', 0, '172-plein-essence-taxes-vs-cout'],
  ['174-6000-abonnes.html', 0, '174-6000-abonnes'],
  ['175-elus-locaux-decompte-national.html', 0, '175-elus-locaux-decompte-national'],
  ['176-cta-elus-locaux.html', 0, '176-cta-elus-locaux'],
  ['177-ou-va-argent-livret-a.html', 0, '177-ou-va-argent-livret-a'],
  ['178-dette-paris-30ans.html', 0, '178-dette-paris-30ans'],
  ['179-population-paris-30ans.html', 0, '179-population-paris-30ans'],
  ['181-subventions-associations-top10.html', 0, '181-subventions-associations-top10'],
  ['182-retraites-vs-defense.html', 0, '182-retraites-vs-defense'],
  ['183-detroit-hormuz-flux-petrole.html', 0, '183-detroit-hormuz-flux-petrole'],
  ['184-pyramide-salaires-france.html', 0, '184-pyramide-salaires-france'],
  ['194-reformes-liberales-avant-apres.html', 0, '194-reformes-liberales-avant-apres'],
  ['195-chi-finanzia-stato-italia-it.html', 0, '195-chi-finanzia-stato-italia-it'],
  ['196-niveau-vie-retraites-vs-actifs.html', 0, '196-niveau-vie-retraites-vs-actifs'],
  ['197-cpf-1800-euros-par-francais.html', 0, '197-cpf-1800-euros-par-francais'],
  ['200-top-10-associations-subventionnees-etat.html', 0, '200-top-10-associations-subventionnees-etat'],
  ['201-ou-va-argent-etat-associations-postes.html', 0, '201-ou-va-argent-etat-associations-postes'],
  ['208-cout-travail-decomposition-1951-2024.html', 0, '208-cout-travail-decomposition-1951-2024'],
  ['209-salaires-enseignants-declassement-1980-2024.html', 0, '209-salaires-enseignants-declassement-1980-2024'],
  ['210-medecins-hospitaliers-declassement-1980-2024.html', 0, '210-medecins-hospitaliers-declassement-1980-2024'],
  ['211-dette-critere-vote-presidentielle-2027.html', 0, '211-dette-critere-vote-presidentielle-2027'],
  ['212-moyens-reves-devenir-riche-francais.html', 0, '212-moyens-reves-devenir-riche-francais'],
  ['213-salaires-soignants-vs-smic.html', 0, '213-salaires-soignants-vs-smic'],
  ['214-salaires-infirmieres-europe.html', 0, '214-salaires-infirmieres-europe'],
  ['215-salaires-profs-france-ocde.html', 0, '215-salaires-profs-france-ocde'],
  ['216-depenses-militaires-monde-sipri-2025.html', 0, '216-depenses-militaires-monde-sipri-2025'],
  ['217-bulletin-paie-mathilde-aide-soignante.html', 0, '217-bulletin-paie-mathilde-aide-soignante'],
  ['218-dette-france-grece-trimestriel-2023-2025.html', 0, '218-dette-france-grece-trimestriel-2023-2025'],
  ['219-rendement-norvege-vs-repartition-france.html', 0, '219-rendement-norvege-vs-repartition-france'],
  ['220-construction-effondrement-2022-2023.html', 0, '220-construction-effondrement-2022-2023'],
  ['221-poids-logement-budget-menages-1985-2020.html', 0, '221-poids-logement-budget-menages-1985-2020'],
  ['222-france-vs-ue-depense-logement-pib.html', 0, '222-france-vs-ue-depense-logement-pib'],
  ['223-prix-immo-vs-salaires-inflation-2001-2020.html', 0, '223-prix-immo-vs-salaires-inflation-2001-2020'],
  ['224-pib-hab-indice-italie-france-2014-2024.html', 0, '224-pib-hab-indice-italie-france-2014-2024'],
  ['225-pib-hab-spa-italie-france-2014-2024.html', 0, '225-pib-hab-spa-italie-france-2014-2024'],
  ['226-deficit-public-6-2-2027.html', 0, '226-deficit-public-6-2-2027'],
  ['227-budget-justice-par-habitant-europe.html', 0, '227-budget-justice-par-habitant-europe'],
  ['228-repartition-budget-justice-2025.html', 0, '228-repartition-budget-justice-2025'],
  ['229-evolution-budget-justice-2017-2027.html', 0, '229-evolution-budget-justice-2017-2027'],
  ['231-deficit-secu-double-2023-2025.html', 0, '231-deficit-secu-double-2023-2025'],
  ['232-deficit-secu-par-branche-2025.html', 0, '232-deficit-secu-par-branche-2025'],
  ['233-dette-secu-acoss-68-md-2026.html', 0, '233-dette-secu-acoss-68-md-2026'],
  ['234-reforme-retraites-2023-gain-net.html', 0, '234-reforme-retraites-2023-gain-net'],
  ['235-ondam-depenses-sante-265-md-2025.html', 0, '235-ondam-depenses-sante-265-md-2025'],
  ['236-hopital-30000-lits-inadequats.html', 0, '236-hopital-30000-lits-inadequats'],
  ['237-soins-dentaires-15-7-md-2024.html', 0, '237-soins-dentaires-15-7-md-2024'],
  ['238-transport-patients-6-md-2025.html', 0, '238-transport-patients-6-md-2025'],
  ['239-natalite-naissances-2014-2025.html', 0, '239-natalite-naissances-2014-2025'],
  ['240-pension-actifs-pib-tous-pays-ocde.html', 0, '240-pension-actifs-pib-tous-pays-ocde'],
  ['241-pension-actifs-pib-duel-france-paysbas.html', 0, '241-pension-actifs-pib-duel-france-paysbas'],
  ['242-pension-actifs-pib-trois-pays.html', 0, '242-pension-actifs-pib-trois-pays'],
  ['243-depense-publique-retraite-france-ocde.html', 0, '243-depense-publique-retraite-france-ocde'],
  ['244-emploi-public-evolution-1980-2023.html', 0, '244-emploi-public-evolution-1980-2023'],
  ['245-ciseau-social-regalien-pib.html', 0, '245-ciseau-social-regalien-pib'],

];

async function exportFormat(browser, htmlPath, items, { css, jsTransform, width, height, outputDir, suffix, label }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  if (css) await page.addStyleTag({ content: css });
  if (jsTransform) await page.evaluate(jsTransform);

  await new Promise(r => setTimeout(r, 300));

  const allInfographics = await page.$$('.infographic');

  for (const { idx, baseName } of items) {
    if (idx >= allInfographics.length) continue;
    const element = allInfographics[idx];

    const outputPath = path.join(outputDir, `${baseName}-${suffix}.png`);
    await element.screenshot({ path: outputPath, type: 'png' });
    console.log(`  ✓ ${label.padEnd(12)} → ${baseName}-${suffix}.png`);
  }

  await page.close();
}

async function main() {
  console.log('\n📐 Export batch — Instagram uniquement\n');

  [INSTA_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const browser = await puppeteer.launch({ headless: true });

  // Parse --only filter (e.g. --only=127,128,09)
  const onlyArg = process.argv.find(a => a.startsWith('--only='));
  const onlyPrefixes = onlyArg ? onlyArg.split('=')[1].split(',') : null;

  // Group by HTML file
  const byFile = {};
  for (const [htmlFile, idx, baseName] of INFOGRAPHICS) {
    if (onlyPrefixes && !onlyPrefixes.some(p => htmlFile.startsWith(p + '-') || htmlFile.startsWith(p + '.'))) continue;
    if (!byFile[htmlFile]) byFile[htmlFile] = [];
    byFile[htmlFile].push({ idx, baseName });
  }

  // JS transform for TikTok Vertical (scale timeline bars + new chart types)
  const tiktokVerticalJS = () => {
    // Timeline bars
    document.querySelectorAll('.timeline-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 1.8) + 'px';
    });
    // Vertical bars (dette Europe #02 etc.) — scale down to fit in top half
    document.querySelectorAll('.bars-wrapper .bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 0.85) + 'px';
    });
    // Waterfall bars — scale inline heights
    document.querySelectorAll('.waterfall-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 1.6) + 'px';
      const t = parseInt(bar.style.top);
      if (t) bar.style.top = Math.round(t * 1.6) + 'px';
    });
    // Stacked segments — scale inline heights
    document.querySelectorAll('.stacked-segment').forEach(seg => {
      const h = parseInt(seg.style.height);
      if (h) seg.style.height = Math.round(h * 1.6) + 'px';
    });
    // Grouped bars — scale inline heights
    document.querySelectorAll('.grouped-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 1.6) + 'px';
    });
    // Scatter points — scale inline positions
    document.querySelectorAll('.scatter-point').forEach(pt => {
      const l = parseInt(pt.style.left);
      const b = parseInt(pt.style.bottom);
      if (l) pt.style.left = Math.round(l * 1.0) + 'px';
      if (b) pt.style.bottom = Math.round(b * 1.6) + 'px';
    });
  };

  // JS transform for Rectangle (scale down timeline bars + new chart types)
  const rectangleJS = () => {
    // Timeline bars
    document.querySelectorAll('.timeline-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 0.55) + 'px';
    });
    // Vertical bars (dette Europe #02 etc.) — scale down for 600px
    document.querySelectorAll('.bars-wrapper .bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 0.45) + 'px';
    });
    // Waterfall bars — scale down
    document.querySelectorAll('.waterfall-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 0.5) + 'px';
      const t = parseInt(bar.style.top);
      if (t) bar.style.top = Math.round(t * 0.5) + 'px';
    });
    // Stacked segments — scale down
    document.querySelectorAll('.stacked-segment').forEach(seg => {
      const h = parseInt(seg.style.height);
      if (h) seg.style.height = Math.round(h * 0.5) + 'px';
    });
    // Grouped bars — scale down
    document.querySelectorAll('.grouped-bar').forEach(bar => {
      const h = parseInt(bar.style.height);
      if (h) bar.style.height = Math.round(h * 0.5) + 'px';
    });
  };

  const formats = [
    { css: null,           jsTransform: null,            width: 1080, height: 1080, outputDir: INSTA_DIR,    suffix: 'instagram',  label: 'instagram' },
  ];

  for (const [htmlFile, items] of Object.entries(byFile)) {
    const htmlPath = path.join(HTML_DIR, htmlFile);
    console.log(`\n📄 ${htmlFile}`);

    for (const format of formats) {
      await exportFormat(browser, htmlPath, items, format);
    }
  }

  await browser.close();
  console.log('\n✅ Export terminé !\n');
}

main().catch(console.error);

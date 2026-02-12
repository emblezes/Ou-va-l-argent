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
const HTML_DIR = path.join(BASE, 'Sources HTML');
const INSTA_DIR = path.join(BASE, 'Insta & Autres');
const TIKTOK_V_DIR = path.join(BASE, 'Tiktok Vertical');
const TIKTOK_H_DIR = path.join(BASE, 'Tiktok Horizontal');

// CSS overrides pour adapter le contenu au format TikTok (1080x1920)
const TIKTOK_CSS = `
/* ===== FORMAT TIKTOK (9:16) — Contenu en haut, espace libre en bas pour la tête ===== */

.infographic {
  width: 1080px !important;
  height: 1920px !important;
}

.content {
  padding: 60px 65px 40px !important;
  gap: 15px !important;
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

/* --- Header --- */
.header {
  margin-bottom: 30px !important;
}

.logo-icon {
  width: 72px !important;
  height: 72px !important;
  font-size: 2rem !important;
  border-radius: 16px !important;
}

.logo-text {
  font-size: 1.8rem !important;
}

.tag {
  padding: 18px 36px !important;
  font-size: 1.4rem !important;
}

/* --- Titres (gros pour TikTok mais pas trop pour laisser de la place au contenu) --- */
.section-title, .chart-title {
  font-size: 5rem !important;
  margin-bottom: 30px !important;
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
  padding: 10px 0 !important;
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

.website {
  font-size: 1.8rem !important;
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
  font-size: 1.8rem !important;
  margin-bottom: 25px !important;
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
  bottom: -35px !important;
}

.bar-down.france .bar-value {
  font-size: 2.2rem !important;
}

.bar-up .bar-value {
  top: -35px !important;
}

.zero-label {
  font-size: 1.4rem !important;
}

.country-labels {
  margin-top: 50px !important;
}

.country-flag {
  font-size: 3rem !important;
}

.country-name {
  font-size: 1.4rem !important;
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
`;

// CSS overrides pour le format Rectangle horizontal (1080x600)
const RECTANGLE_CSS = `
/* ===== FORMAT RECTANGLE HORIZONTAL (1080×600) ===== */

.infographic {
  width: 1080px !important;
  height: 600px !important;
}

.content {
  padding: 30px 40px !important;
}

/* --- Header compact --- */
.header {
  margin-bottom: 12px !important;
}

.logo-icon {
  width: 36px !important;
  height: 36px !important;
  font-size: 1rem !important;
  border-radius: 8px !important;
}

.logo-text {
  font-size: 1rem !important;
}

.tag {
  padding: 6px 14px !important;
  font-size: 0.7rem !important;
}

/* --- Titres compacts --- */
.section-title, .chart-title {
  font-size: 2rem !important;
  margin-bottom: 12px !important;
}

.main-title {
  margin-bottom: 10px !important;
}

.main-title h1 {
  font-size: 1.8rem !important;
}

.subtitle, .section-subtitle {
  font-size: 1rem !important;
  margin-bottom: 12px !important;
}

/* --- Stat choc compact --- */
.stat-label {
  font-size: 1rem !important;
  margin-bottom: 8px !important;
}

.stat-value {
  font-size: 100px !important;
  margin-bottom: 8px !important;
}

.stat-unit {
  font-size: 2.2rem !important;
  margin-bottom: 10px !important;
}

.stat-context {
  font-size: 1.2rem !important;
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
  font-size: 0.7rem !important;
  margin-bottom: 6px !important;
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
  padding: 5px 0 !important;
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
  gap: 3px !important;
}

.bar-value {
  font-size: 0.7rem !important;
}

.bar-down .bar-value {
  bottom: -16px !important;
}

.bar-down.france .bar-value {
  font-size: 0.85rem !important;
}

.bar-up .bar-value {
  top: -16px !important;
}

.zero-label {
  font-size: 0.6rem !important;
  left: -35px !important;
}

.country-labels {
  margin-top: 20px !important;
  gap: 3px !important;
  padding-left: 35px !important;
}

.country-flag {
  font-size: 1.1rem !important;
}

.country-name {
  font-size: 0.55rem !important;
}

/* --- Footer compact --- */
.footer {
  padding-top: 10px !important;
  margin-top: 8px !important;
}

.source {
  font-size: 0.8rem !important;
}

.website {
  font-size: 0.9rem !important;
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
`;

// Define infographics: [htmlFile, infographicIndex, outputBaseName]
const INFOGRAPHICS = [
  ['01-france-pologne-pib.html', 0, '01-france-pologne-comparaison'],
  ['01-france-pologne-pib.html', 1, '02-pologne-rattrapage-courbes'],
  ['03-singapour-argentine-pib.html', 0, '03-singapour-argentine-divergence'],
  ['04-chatgpt-utilisateurs.html', 0, '04-chatgpt-utilisateurs'],
  ['05-cuivre.html', 0, '05-cuivre'],
  ['06-salaires-suisse.html', 0, '06-salaires-suisse'],
  ['07-top5-pays-peuples.html', 0, '07-top5-pays-peuples'],
  ['08-fertilite-par-pays.html', 0, '08-fertilite-par-pays'],
  ['09-prix-cigarette-france.html', 0, '09-prix-cigarette-france'],
  ['10-indice-big-mac.html', 0, '10-indice-big-mac'],
  ['11-salaire-moyen-par-pays.html', 0, '11-salaire-moyen-par-pays'],
  ['12-dette-publique-europe.html', 0, '12-dette-publique-europe'],
  ['13-deficit-zone-euro.html', 0, '13-deficit-zone-euro'],
  ['14-explosion-dette-france.html', 0, '14-explosion-dette-france'],
  ['15-hotels-plus-chers-paris.html', 0, '15-hotels-plus-chers-paris'],
  ['16-retraites-explosion-2070.html', 0, '16-retraites-explosion-2070'],
  ['17-vieillissement-mondial-2070.html', 0, '17-vieillissement-mondial-2070'],
  ['18-pensions-retraite-europe.html', 0, '18-pensions-retraite-europe'],
  ['19-capitalisation-vs-repartition.html', 0, '19-capitalisation-vs-repartition'],
  ['20-retraites-capitalisation-plus-elevees.html', 0, '20-retraites-capitalisation-plus-elevees'],
  ['21-detenteurs-dette-france.html', 0, '21-detenteurs-dette-france'],
  ['22-charge-interets-dette.html', 0, '22-charge-interets-dette'],
  ['23-triple-degradation-notes.html', 0, '23-triple-degradation-notes'],
  ['24-simulation-capitalisation-980k.html', 0, '24-simulation-capitalisation-980k'],
  ['25-classement-mercer-retraites-2025.html', 0, '25-classement-mercer-retraites-2025'],
  ['26-pays-bas-fonds-pension-213-pib.html', 0, '26-pays-bas-fonds-pension-213-pib'],
  ['27-fecondite-france-plus-bas.html', 0, '27-fecondite-france-plus-bas'],
  ['28-rendement-capitalisation-vs-repartition.html', 0, '28-rendement-capitalisation-vs-repartition'],
  ['29-zero-perte-20-ans-actions.html', 0, '29-zero-perte-20-ans-actions'],
  ['30-fonds-souverain-norvege.html', 0, '30-fonds-souverain-norvege'],
  ['31-actifs-fonds-pension-monde.html', 0, '31-actifs-fonds-pension-monde'],
];

async function exportFormat(browser, htmlPath, items, { css, jsTransform, width, height, outputDir, suffix, label }) {
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  if (css) await page.addStyleTag({ content: css });
  if (jsTransform) await page.evaluate(jsTransform);

  await new Promise(r => setTimeout(r, 300));

  const allInfographics = await page.$$('.infographic');

  for (const { idx, baseName } of items) {
    if (idx >= allInfographics.length) continue;
    const element = allInfographics[idx];

    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 200));

    const outputPath = path.join(outputDir, `${baseName}-${suffix}.png`);
    await element.screenshot({ path: outputPath, type: 'png' });
    console.log(`  ✓ ${label.padEnd(12)} → ${baseName}-${suffix}.png`);
  }

  await page.close();
}

async function main() {
  console.log('\n📐 Export batch — Instagram + TikTok Vertical + TikTok Horizontal\n');

  [INSTA_DIR, TIKTOK_V_DIR, TIKTOK_H_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const browser = await puppeteer.launch({ headless: true });

  // Group by HTML file
  const byFile = {};
  for (const [htmlFile, idx, baseName] of INFOGRAPHICS) {
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
    { css: TIKTOK_CSS,     jsTransform: tiktokVerticalJS, width: 1080, height: 1920, outputDir: TIKTOK_V_DIR, suffix: 'tiktok-v',   label: 'tiktok vert' },
    { css: RECTANGLE_CSS,  jsTransform: rectangleJS,      width: 1080, height: 600,  outputDir: TIKTOK_H_DIR, suffix: 'tiktok-h',   label: 'tiktok horiz' },
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

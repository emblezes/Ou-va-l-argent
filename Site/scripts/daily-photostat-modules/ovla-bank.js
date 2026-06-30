/**
 * ovla-bank.js — pioche des stat choc OVLA dans la banque, rotation LRU (least-recently-used).
 * Garantit qu'on ne reprend pas les mêmes stats que les jours précédents tant que la banque
 * est plus grande que le nombre de stats/jour.
 */
const fs = require('fs');
const path = require('path');
const { fixTypography, ensureFinalPeriod } = require('./util');

const BANK = require('./ovla-bank.json').stats;
const STATE_PATH = path.join(__dirname, 'ovla-bank-state.json');

function loadState() { try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')); } catch { return {}; } }
function saveState(s) { fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 2)); }

// Renvoie les `count` stats les moins récemment utilisées.
function pickStats(count) {
  const state = loadState();
  const sorted = [...BANK].sort((a, b) => (state[a.id] || 0) - (state[b.id] || 0));
  return sorted.slice(0, count).map(s => ({
    slug: s.id,
    headline: ensureFinalPeriod(fixTypography(s.headline)),
    reveal: ensureFinalPeriod(fixTypography(s.reveal)),
    source: s.source,
    caption: '',
    photo: s.photo,
    theme: s.theme,
    origin: 'bank'
  }));
}

function markUsed(ids) {
  const s = loadState();
  const now = Date.now();
  for (const id of ids) s[id] = now;
  saveState(s);
}

module.exports = { pickStats, markUsed, loadState, saveState };

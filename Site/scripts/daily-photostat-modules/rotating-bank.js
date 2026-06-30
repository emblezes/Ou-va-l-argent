/**
 * rotating-bank.js — sélection LRU générique pour une banque {id,...} + fichier d'état.
 * Garantit qu'on ne reprend pas les mêmes entrées que les jours précédents tant que
 * la banque est plus grande que le nombre piochés/jour.
 */
const fs = require('fs');

function loadState(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return {}; } }
function saveState(p, o) { fs.writeFileSync(p, JSON.stringify(o, null, 2)); }

// Renvoie les `count` entrées les moins récemment utilisées.
function pick(bank, statePath, count) {
  const st = loadState(statePath);
  return [...bank].sort((a, b) => (st[a.id] || 0) - (st[b.id] || 0)).slice(0, count);
}

function markUsed(statePath, ids) {
  const st = loadState(statePath);
  const now = Date.now();
  for (const id of ids) st[id] = now;
  saveState(statePath, st);
}

module.exports = { pick, markUsed };

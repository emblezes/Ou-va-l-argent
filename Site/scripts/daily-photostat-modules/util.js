/**
 * util.js — helpers partagés du pipeline daily-photostat
 * Secrets : process.env d'abord (CI / ~/.zshrc), fallback telegram-config.json (local).
 */
const fs = require('fs');
const path = require('path');

let _fileCfg = {};
try { _fileCfg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'telegram-config.json'), 'utf8')); } catch {}

function secret(key) { return process.env[key] || _fileCfg[key] || ''; }

async function askClaude(prompt, model = 'claude-haiku-4-5-20251001', maxTokens = 4000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': secret('ANTHROPIC_API_KEY'), 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await res.json();
  if (data.error) throw new Error('Claude: ' + JSON.stringify(data.error));
  return data.content?.[0]?.text || '';
}

function escapeHtml(t) { return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function cleanMarkdown(t) {
  return (t || '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/__([^_]+)__/g, '$1');
}
function cleanForTelegram(t) { return (t || '').replace(/<span[^>]*>/g, '').replace(/<\/span>/g, ''); }
function stripBig(t) { return (t || '').replace(/<\/?big>/g, ''); }

const NBSP = ' ';
// Espaces insécables : chiffre+unité (4,4 % → 4,4 %) et séparateurs de milliers (68 998).
function fixTypography(s) {
  if (!s) return s;
  s = s.replace(/(\d)[  ]+(%|M€|Md€|€|\$)/g, (m, a, b) => a + NBSP + b);
  for (let i = 0; i < 2; i++) s = s.replace(/(\d)[  ](\d{3}\b)/g, (m, a, b) => a + NBSP + b);
  return s;
}

// Garantit une ponctuation finale (point) sur headline/reveal — gère un <big> de fin.
function ensureFinalPeriod(s) {
  if (!s) return s;
  const t = s.replace(/\s+$/, '');
  const visible = t.replace(/(<\/?[a-z]+>)+$/i, '').replace(/\s+$/, '');
  if (!visible) return t;
  if (/[.!?…»]$/.test(visible)) return t;
  return t + '.';
}

module.exports = { secret, askClaude, escapeHtml, cleanMarkdown, cleanForTelegram, stripBig, fixTypography, ensureFinalPeriod };

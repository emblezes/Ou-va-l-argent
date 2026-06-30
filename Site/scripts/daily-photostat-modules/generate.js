/**
 * generate.js — génération QUOTIDIENNE d'angles via l'API Claude + outil web_search.
 * Chaque matin : Claude cherche des données réelles, les vérifie, et rend des specs prêtes
 * à rendre (graphiques) ou des micro-faits (hero). Banque = filet de sécurité (fallback).
 * Anti-répétition : on passe la liste des sujets déjà traités (catalogue + journal).
 */
const fs = require('fs');
const path = require('path');
const { secret, fixTypography, ensureFinalPeriod } = require('./util');

const MODEL = 'claude-sonnet-4-6';
const SENT_LOG = path.join(__dirname, 'sent-log.json');
const DONE_TOPICS = require('./done-topics.json').topics;

function loadSent() { try { return JSON.parse(fs.readFileSync(SENT_LOG, 'utf8')); } catch { return []; } }
function appendSent(items) {
  const cur = loadSent();
  const next = [...cur, ...items].slice(-400); // borne
  fs.writeFileSync(SENT_LOG, JSON.stringify(next, null, 2));
}

async function claudeSearch(prompt, maxTokens = 5000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': secret('ANTHROPIC_API_KEY'), 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL, max_tokens: maxTokens,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 6 }],
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const j = await res.json();
  if (j.error) throw new Error('Claude: ' + JSON.stringify(j.error));
  return (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
}
function parseArray(txt) { const m = txt.match(/\[[\s\S]*\]/); if (!m) throw new Error('pas de JSON'); return JSON.parse(m[0]); }

function avoidString() {
  const recent = loadSent().slice(-120);
  return [...new Set([...DONE_TOPICS, ...recent])].join(' · ');
}

// Normalise une spec graphique (clés points/bars/dots selon le type) + typo + point final.
function normGraphic(a) {
  const out = {
    id: (a.id || a.title || 'angle').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50),
    type: ['line', 'bars', 'dot'].includes(a.type) ? a.type : 'bars',
    title: ensureFinalPeriod(fixTypography((a.title || '').trim())),
    metric: a.metric || '', source: a.source || '', accent: a.accent || '#ff4757',
    unit: a.unit != null ? a.unit : '', caption: a.caption || ''
  };
  const d = a.data || a.points || a.bars || a.dots || [];
  if (out.type === 'line') out.points = d.map(p => ({ x: String(p.x), y: Number(p.y) }));
  else out[out.type === 'dot' ? 'dots' : 'bars'] = d.map(b => ({ label: b.label, value: Number(b.value), hi: !!b.hi }));
  return out;
}

async function generateGraphics(n) {
  const prompt = `Tu es analyste pour le média "Où Va l'Argent" (OVLA), économie, pro-business / libéral.
Génère ${n} angles d'INFOGRAPHIE GRAPHIQUE ORIGINAUX sur les finances publiques / l'économie françaises, dans la ligne OVLA : excès d'État (impôt, dépense, dette, bureaucratie), comparaisons internationales défavorables à la France, OU réussites entrepreneuriales françaises.

INTERDIT — n'utilise AUCUN de ces sujets, déjà traités : ${avoidString()}.

Pour CHAQUE angle : utilise l'outil web_search pour trouver des DONNÉES RÉELLES, RÉCENTES et de SOURCE OFFICIELLE (Eurostat, OCDE, INSEE, Banque de France, DGFiP, Cour des comptes, France Stratégie, EY...). VÉRIFIE chaque chiffre par la recherche. N'invente jamais un chiffre.

Format de chaque objet :
{ "id": kebab-case, "type": "line"|"bars"|"dot", "title": titre éditorial factuel finissant par un point, avec UN mot-clé entre <em>...</em>, "metric": ce que mesure le chiffre (ex "Impôts de production, % du PIB"), "source": "Organisme, année", "accent": "#ff4757"(alerte)|"#ffd700"(or)|"#00d4ff"(cyan)|"#00ff88"(positif)|"#ff9f43"(orange), "unit": "%"|""|" $"|" Md€"|" h"..., "data": pour line [{x,y}...] (3-5 points), pour bars/dot [{label,value,hi:true pour la France}...] (2-5), "caption": 3-4 phrases pédagogiques + 3 hashtags }

Le titre tient en 2 lignes (court). Données exactes et sourcées (vérifiées par toi). Réponds UNIQUEMENT par le tableau JSON final de ${n} objets.`;
  const txt = await claudeSearch(prompt, 6000);
  return parseArray(txt).slice(0, n).map(normGraphic).filter(a => (a.points || a.bars || a.dots || []).length >= 2);
}

async function generateMicrodepense(n) {
  const prompt = `Tu es analyste pour "Où Va l'Argent" (OVLA), pro-business / libéral.
Génère ${n} fait(s) "MICRO-DÉPENSE PUBLIQUE" ORIGINAUX : un fait granulaire et concret (tel organisme coûte tant, tel dispositif inefficace, telle agence redondante, tel programme au résultat faible), tiré de RAPPORTS officiels (Cour des comptes, IGF, Sénat, France Stratégie, annexes du budget).

INTERDIT — pas ces sujets déjà traités : ${avoidString()}.

Utilise web_search pour trouver et VÉRIFIER le fait dans un rapport précis (chiffre exact + référence). N'invente jamais.

Format : { "id": kebab-case, "headline": le sujet/contexte SANS le chiffre, finit par un point, <em>mot</em> possible, "figure": LE chiffre dominant seul et COURT (ex "30 M€", "61 %", "8 agents"), "detail": une phrase de précision, "source": "Organisme, rapport, année", "accent": "#ff4757"|"#ff9f43", "caption": 3-4 phrases + 3 hashtags }
Réponds UNIQUEMENT par le tableau JSON de ${n} objet(s).`;
  const txt = await claudeSearch(prompt, 4000);
  return parseArray(txt).slice(0, n).map(m => ({
    id: (m.id || 'micro').toString().slice(0, 50),
    headline: ensureFinalPeriod(fixTypography((m.headline || '').trim())),
    figure: (m.figure || '').toString().trim(),
    detail: (m.detail || '').trim(), source: m.source || '', accent: m.accent || '#ff4757', caption: m.caption || ''
  })).filter(m => m.figure);
}

module.exports = { generateGraphics, generateMicrodepense, appendSent };

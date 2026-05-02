/**
 * Script writer — rédige le script voix off + plan visuel
 *
 * Règle éditoriale OBLIGATOIRE (cf. .claude/agents/video-creator.md) :
 *   - 1-2 chiffres max par vidéo
 *   - Structure narrative en 3 temps (croyance → révélation → punchline)
 *   - Langage parlé, phrases courtes, pauses respirables
 *   - Pas de pourcentages techniques, privilégier les fractions parlantes
 *
 * Sortie :
 *   {
 *     topic, titre, categorie, accent,
 *     scriptText,        // texte complet pour ElevenLabs
 *     beats: [           // plan visuel pour Remotion (2-3 s par beat)
 *       {
 *         text,           // texte parlé sur ce beat
 *         visual,         // requête Pexels OU query Google Images
 *         source,         // 'stock-video' | 'real-image' | 'kling'
 *         highlight: [],  // (legacy, la v5 utilise wordTimings directement)
 *       }
 *     ],
 *     sources: [],
 *   }
 */

const { askClaude, slugify } = require('../journalist-modules/shared-utils');

// v26 : format court saccadé (max 30s). Cadence ~3 mots/s.
const DURATION_TO_WORDS = {
  15: [40, 50],
  20: [55, 65],
  25: [70, 85],
  30: [85, 100],
  45: [125, 145],
  60: [170, 195],
  75: [215, 240],
  90: [260, 290],
};

function targetWords(duration) {
  const [min, max] = DURATION_TO_WORDS[duration] || DURATION_TO_WORDS[45];
  return Math.round((min + max) / 2);
}

// ── Découpage local sans LLM ────────────────────────

function extractHighlights(phrase) {
  const matches = phrase.match(/\b\d[\d\s.,]*(?:\s*(?:€|%|euros?|centimes?|milliards?|millions?|dollars?))?\b/gi) || [];
  const cleaned = matches.map((m) => m.trim().replace(/\s+/g, ' ').toUpperCase());
  return [...new Set(cleaned)].slice(0, 2);
}

function splitIntoPhrases(text) {
  const rawParts = text
    .replace(/\.\.\.+/g, '…')
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  const merged = [];
  let buffer = '';
  for (const part of rawParts) {
    const wordCount = part.split(/\s+/).length;
    if (wordCount < 3 && buffer === '') {
      buffer = part;
    } else if (buffer) {
      merged.push((buffer + ' ' + part).trim());
      buffer = '';
    } else {
      merged.push(part);
    }
  }
  if (buffer) merged.push(buffer);
  return merged;
}

// v5 : découpe une phrase longue (> 12 mots) en 2 sous-beats sur une virgule
// ou conjonction, pour garder un rythme de 2-3 s max par plan visuel.
const SPLIT_CONJUNCTIONS = /\b(mais|car|donc|pourtant|alors que|tandis que|sauf que|parce que)\b/i;

function subSplitIfTooLong(phrase) {
  const words = phrase.split(/\s+/);
  if (words.length <= 12) return [phrase];

  // Priorité 1 : coupure sur conjonction
  const conjMatch = phrase.match(SPLIT_CONJUNCTIONS);
  if (conjMatch && conjMatch.index && conjMatch.index > 15) {
    const left = phrase.slice(0, conjMatch.index).trim().replace(/[,\s]+$/, '');
    const right = phrase.slice(conjMatch.index).trim();
    if (left.split(/\s+/).length >= 3 && right.split(/\s+/).length >= 3) return [left, right];
  }

  // Priorité 2 : coupure sur virgule au milieu (40-60 % de la phrase)
  const midStart = Math.floor(phrase.length * 0.35);
  const midEnd = Math.floor(phrase.length * 0.7);
  let bestComma = -1;
  for (let i = midStart; i < midEnd; i++) {
    if (phrase[i] === ',') { bestComma = i; break; }
  }
  if (bestComma > 0) {
    const left = phrase.slice(0, bestComma).trim();
    const right = phrase.slice(bestComma + 1).trim();
    if (left.split(/\s+/).length >= 3 && right.split(/\s+/).length >= 3) return [left, right];
  }

  // Priorité 3 : split brut au milieu des mots (fallback)
  const mid = Math.floor(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function splitSentences(text) {
  const phrases = splitIntoPhrases(text);
  const beats = [];
  for (const phrase of phrases) {
    for (const sub of subSplitIfTooLong(phrase)) {
      beats.push(sub);
    }
  }
  return beats;
}

// ── Dictionnaire Pexels non-ambigu ──────────────────────────
//
// Règles pour chaque query :
//   1. Minimum 3 mots qui se précisent mutuellement.
//   2. Éviter les mots polysémiques seuls ("oil" → peut tomber sur huile de
//      cuisine/massage) — toujours qualifier avec "crude", "petroleum",
//      "industry", "refinery", etc.
//   3. Préférer les mots pexels à forte densité (photo/vidéo business,
//      close-up, industrial, office) qui évitent le stock lifestyle random.
//   4. Composition : [sujet] + [contexte] + [qualifier] (ex : "crude oil" +
//      "refinery" + "industrial").
//
// Priorité : premier match gagne.

const THEMATIC_LOOKUP = [
  // Essence, pétrole — "crude oil" et "gasoline" sont sans ambiguïté
  [/\b(pompe|pompes|passage à la pompe)\b/i, 'gasoline pump nozzle car refueling'],
  [/\b(essence|carburant|sp95|gazole|diesel|plein)\b/i, 'gasoline station pump refueling car'],
  [/\b(baril|barrel)\b/i, 'crude oil barrel drums industrial'],
  [/\b(pétrole|petrole)\b/i, 'crude oil refinery pipelines industry'],
  [/\b(raffinerie|refinery)\b/i, 'oil refinery industrial pipelines night'],
  [/\b(pétrolier|petrolier|tanker|cargo)\b/i, 'oil tanker cargo ship sea'],
  [/\b(frappes|bombardement|missile|air strike)\b/i, 'military missile launch explosion'],
  [/\b(soldat|soldats|militaire|armée|army|troupes)\b/i, 'soldiers military uniform marching'],

  // Argent et fiscalité — toujours "euro" ou "banknote" pour désambiguïser
  [/\b(taxe sur la taxe|empiler|stacking)\b/i, 'stack paperwork documents office desk'],
  [/\b(ticpe|tva|vat)\b/i, 'tax documents calculator receipt office'],
  [/\b(taxe|taxes|fisc|impôt|impot|impôts|impots)\b/i, 'tax calculator euro banknotes invoice'],
  [/\b(l'état|l'etat|l'état français|état français|etat francais|état|etat)\b/i, 'government hand taking euro banknotes'],
  [/\b(reçu|recu|ticket de caisse|ticket|facture)\b/i, 'receipt paper close up hand'],
  [/\b(moitié|moitie|half)\b/i, 'hand counting euro banknotes stack'],
  [/\b(fraction|petit morceau|un peu)\b/i, 'few euro coins close up hand'],
  [/\b(prend|prélève|preleve|vole|pique|steal)\b/i, 'hand taking euro banknotes pocket'],
  [/\b(facturer|facturez|payer|payez|paiement|payment)\b/i, 'paying credit card terminal contactless'],

  // Lieux / concepts France
  [/\b(paris|parisien)\b/i, 'paris haussmann aerial rooftops'],
  [/\b(france|français|francais|française|francaise)\b/i, 'french flag monument paris'],
  [/\b(chez vous|chez soi|maison|foyer|au quotidien)\b/i, 'french family home kitchen'],

  // Argent physique — contexte monétaire précis
  [/\b(euro|euros|monnaie|billets|pièces|pieces)\b/i, 'euro banknotes coins close up hand'],
  [/\b(centime|centimes)\b/i, 'euro coins macro close up'],
  [/\b(dollar|dollars|usd|\$)\b/i, 'us dollar banknotes stack'],
  [/\b(chèque|cheque)\b/i, 'bank check signing pen hand'],

  // Bourse, économie
  [/\b(bourse|trader|traders|marchés|marches|trading|cac 40|cac40|stock market)\b/i, 'stock market trader screens red candles'],
  [/\b(dette|debt)\b/i, 'debt calculator red pen documents'],
  [/\b(déficit|deficit)\b/i, 'red financial chart declining arrow'],
  [/\b(budget)\b/i, 'budget spreadsheet calculator office'],
  [/\b(emprunt|crédit|credit|pret|prêt)\b/i, 'loan contract signing bank paperwork'],
  [/\b(inflation|prix augmentent|hausse des prix|pouvoir d'achat)\b/i, 'supermarket receipt price tag hand'],
  [/\b(crise|récession|recession|krach|crash)\b/i, 'stock market crash red screen'],
  [/\b(économie|economie|économique|economique)\b/i, 'business news financial headlines'],

  // Secteurs
  [/\b(chômage|chomage|unemployment)\b/i, 'unemployed worker factory closed'],
  [/\b(emploi|salarié|salarie|travail|ouvrier|worker)\b/i, 'office worker laptop business'],
  [/\b(retraite|retraites|retraité|retraités|senior|pension)\b/i, 'elderly couple park bench smiling'],
  [/\b(santé|sante|hôpital|hopital|soin|soins|médecin|medecin|healthcare)\b/i, 'hospital corridor medical doctor'],
  [/\b(école|ecole|éducation|education|élève|eleve|prof|teacher)\b/i, 'classroom students writing teacher'],
  [/\b(immobilier|logement|loyer|location|real estate)\b/i, 'house keys real estate agent contract'],
  [/\b(entreprise|entreprises|pme|patron|startup|business)\b/i, 'business meeting office people'],
  [/\b(crypto|bitcoin|ether|ethereum|blockchain|nft)\b/i, 'bitcoin cryptocurrency chart screen'],

  // Temps / généralités
  [/\b(mois|semaine|jour|année|annee|chaque)\b/i, 'calendar pages time passing'],
  [/\b(vrai|véritable|veritable|réel|reel)\b/i, 'magnifying glass document paper'],
  [/\b(guerre|conflit|tension|war)\b/i, 'breaking news television studio'],

  // Pouvoir
  [/\b(politique|politician|gouvernement|government|ministre|minister|premier ministre)\b/i, 'politician podium press conference'],
  [/\b(parlement|assemblée|assemblee|hémicycle|hemicycle|députés|deputes|sénat|senat|parliament)\b/i, 'parliament chamber session politicians'],
  [/\b(élection|election|vote|scrutin|ballot)\b/i, 'voting ballot box democracy'],

  // International
  [/\b(union européenne|union europeenne|ue|bruxelles|commission européenne|eu)\b/i, 'european union flag brussels parliament'],
  [/\b(bce|banque centrale européenne|european central bank|ecb)\b/i, 'european central bank frankfurt building'],
  [/\b(états-unis|etats-unis|usa|amérique|amerique|us|washington)\b/i, 'american flag washington capitol'],
  [/\b(chine|chinois|pekin|pékin|china|beijing)\b/i, 'shanghai skyline china business'],
  [/\b(russie|russe|moscou|kremlin|russia|moscow)\b/i, 'moscow kremlin red square'],
  [/\b(ukraine|kiev|kyiv)\b/i, 'ukraine flag kyiv'],
  [/\b(israel|israël|palestine|gaza)\b/i, 'middle east conflict news'],
  [/\b(opep|opec)\b/i, 'oil meeting conference ministers'],
];

// Enrichit une query trop courte ou ambiguë avec un contexte neutre.
// Objectif : Pexels reçoit toujours 3+ mots qualifiés.
function enrichQuery(query, fallbackTopic) {
  const q = (query || '').trim();
  if (!q) return fallbackTopic || 'business news finance';
  const words = q.split(/\s+/);
  if (words.length >= 3) return q;

  // Ajoute un contexte neutre business/finance pour éviter les matches cuisine/lifestyle
  return (q + ' business close up').trim();
}

const STOPWORDS_FR = new Set([
  'le','la','les','un','une','des','de','du','et','ou','à','a','au','aux','en','dans','sur','sous','par','pour','avec','sans','ce','cette','ces','son','sa','ses','mon','ma','mes','ton','ta','tes','notre','nos','votre','vos','leur','leurs','je','tu','il','elle','on','nous','vous','ils','elles','qui','que','quoi','dont','où','ou','si','non','pas','plus','moins','aussi','alors','donc','mais','car','ni','tout','tous','toute','toutes','même','meme','autre','autres','comme','sauf','c','est','ce','se','lui','t','d','l','n','s','m','j','qu','chez','très','tres','bien','déjà','deja','encore','peu','trop','hier','demain','aujourd','hui','quand','avant','après','apres','depuis','pendant'
]);

function visualQueryForPhrase(phrase, fallbackTopic) {
  const text = phrase.toLowerCase();

  for (const [regex, query] of THEMATIC_LOOKUP) {
    if (regex.test(text)) return enrichQuery(query, fallbackTopic);
  }

  const proper = (phrase.match(/\b[A-ZÀÂÉÈÊËÎÏÔÙÛÜŸÇ][a-zàâéèêëîïôùûüÿç]{2,}/g) || [])
    .filter((w) => !STOPWORDS_FR.has(w.toLowerCase()))
    .slice(0, 2);
  if (proper.length > 0) return enrichQuery(proper.join(' '), fallbackTopic);

  const significant = (text.match(/[a-zàâéèêëîïôùûüÿç]{5,}/g) || [])
    .filter((w) => !STOPWORDS_FR.has(w))
    .slice(0, 2);
  if (significant.length > 0) return enrichQuery(significant.join(' '), fallbackTopic);

  return enrichQuery(fallbackTopic || 'business news finance', fallbackTopic);
}

// ── Détection "real-image" : noms propres / événements / marques ──

// Personnalités politiques & économiques (France et international, avril 2026)
const KNOWN_PROPER_NOUNS = [
  // France
  'Macron','Emmanuel Macron','Brigitte Macron','Bayrou','François Bayrou','Attal','Gabriel Attal',
  'Borne','Élisabeth Borne','Elisabeth Borne','Le Maire','Bruno Le Maire','Lemaire',
  'Lecornu','Sébastien Lecornu','Darmanin','Gérald Darmanin','Dussopt','Véran',
  'Mélenchon','Jean-Luc Mélenchon','Melenchon','Le Pen','Marine Le Pen','Bardella','Jordan Bardella',
  'Philippe','Édouard Philippe','Edouard Philippe','Hidalgo','Anne Hidalgo',
  'Glucksmann','Raphaël Glucksmann','Faure','Olivier Faure',
  'Villeroy de Galhau','De Galhau',
  // Institutions
  'Assemblée nationale','Assemblee nationale','Palais Bourbon','Bercy','Matignon','Élysée','Elysee',
  'Conseil constitutionnel','Sénat','Senat','Cour des comptes','Insee','INSEE',
  'Banque de France','Eurogroupe','Eurogroup',
  // International
  'Trump','Donald Trump','Biden','Joe Biden','Harris','Kamala Harris','Vance',
  'Poutine','Vladimir Poutine','Putin','Zelensky','Volodymyr Zelensky',
  'Xi Jinping','Xi','Modi','Netanyahou','Benjamin Netanyahou','Netanyahu',
  'Khamenei','Ali Khamenei','Raïssi','Raissi','Pezeshkian',
  'Erdogan','Meloni','Giorgia Meloni','Scholz','Olaf Scholz','Merz','Friedrich Merz',
  'Starmer','Keir Starmer','Ursula von der Leyen','Von der Leyen','Lagarde','Christine Lagarde',
  'Powell','Jerome Powell',
  // Lieux d'actualité
  'Téhéran','Teheran','Tehran','Ormuz','Gaza','Kiev','Kyiv','Moscou','Washington','Pékin','Pekin',
  'Bruxelles','Berlin','Rome','Madrid','Londres','London',
  // Marques / entreprises (France)
  'Total','TotalEnergies','EDF','SNCF','Carrefour','LVMH','Bernard Arnault','Elon Musk','Musk',
  'Stellantis','Renault','BNP Paribas','Société Générale','Axa','Orange','Air France',
  // Orgas internationales
  'FMI','IMF','OCDE','OECD','Banque mondiale','World Bank','ONU','Fed','BCE','ECB','OTAN','NATO',
];

const KNOWN_RE = new RegExp(
  '\\b(' +
    KNOWN_PROPER_NOUNS
      .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length) // longs d'abord pour prioriser "Emmanuel Macron" avant "Macron"
      .join('|') +
  ')\\b',
  'i'
);

// Détecte si le beat doit utiliser une vraie photo (Google Images).
// Renvoie { source, query } ou null.
function detectRealImage(phrase) {
  const match = phrase.match(KNOWN_RE);
  if (match) {
    return { source: 'real-image', query: match[1] };
  }

  // Heuristique : suite de 2+ mots capitalisés consécutifs = probable entité nommée
  const runsOfCaps = phrase.match(/\b[A-ZÀÂÉÈÊËÎÏÔÙÛÜŸÇ][a-zàâéèêëîïôùûüÿç]+(?:\s+[A-ZÀÂÉÈÊËÎÏÔÙÛÜŸÇ][a-zàâéèêëîïôùûüÿç]+){1,3}\b/g);
  if (runsOfCaps) {
    const candidate = runsOfCaps.find((r) => {
      const first = r.split(/\s+/)[0].toLowerCase();
      return !STOPWORDS_FR.has(first);
    });
    if (candidate) return { source: 'real-image', query: candidate };
  }

  return null;
}

// ── Plan local ──────────────────────────────────────

function localPlan({ topic, scriptText, categorie = 'Actu éco', accent = '#ff9f43' }) {
  const sentences = splitSentences(scriptText);
  if (sentences.length === 0) {
    throw new Error('script-writer (no-llm): aucune phrase détectée dans le script fourni');
  }

  const beats = sentences.map((text) => {
    const real = detectRealImage(text);
    if (real) {
      return {
        text,
        visual: real.query,
        source: 'real-image',
        highlight: extractHighlights(text),
      };
    }
    return {
      text,
      visual: visualQueryForPhrase(text, topic),
      source: 'stock-video',
      highlight: extractHighlights(text),
    };
  });

  const titre = (topic || sentences[0] || 'Vidéo OVLA')
    .replace(/\s+/g, ' ')
    .slice(0, 80)
    .trim();

  const result = {
    titre,
    categorie,
    accent,
    scriptText,
    beats,
    sources: [],
    topic,
  };

  result.slug = slugify(titre);
  return result;
}

// Détecte si une query Claude est une "description de montage" (avec virgules,
// mots scénographiques, etc.) plutôt qu'une vraie requête de recherche.
function isScenicDescription(raw) {
  if (!raw) return false;
  if (raw.length > 90) return true;
  if (/[:;→—–]/.test(raw)) return true;
  if (/\b(anim[éee]+|split[-\s]?screen|fondu|zoom ?animé|insert|surimpression|overlay|plan serr|plan large|apparait|apparaît|flèche animée)\b/i.test(raw)) return true;
  return false;
}

// Nettoie une description de montage pour extraire des mots-clés utilisables.
// Objectif : renvoyer 2-5 mots simples. Si on n'y arrive pas, on retourne
// null pour que l'appelant prenne un autre chemin (ex: query buildée depuis text).
function sanitizeVisualQuery(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let q = raw.replace(/['']/g, "'").trim();

  // Si c'est une description avec virgules, garde juste la 1ère proposition
  if (isScenicDescription(q)) {
    q = q.split(/[,:;.|→—–]/)[0].trim();
  }

  // Retire mots scénographiques
  const SCENIC_WORDS = /\b(animation|anim[ée]+|graphique\s+anim[ée]*|schématique|schematique|split[-\s]?screen|fondu|zoom\s+anim[ée]*|insert|surimpression|cut|plan\s+(?:serré|large|fixe)|cinématique|cinematique|stylisé|stylise|overlay|fond\s+(?:noir|sombre|clair))\b/gi;
  q = q.replace(SCENIC_WORDS, ' ');

  // Retire caractères parasites
  q = q.replace(/[€$%"'→—–]/g, ' ').replace(/\s+/g, ' ').trim();

  // Cap à 7 mots significatifs
  const words = q.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length === 0) return '';
  return words.slice(0, 7).join(' ');
}

// Table de mapping : chaque trigger → query Google Images désambiguée riche.
// Les queries sont pensées pour ramener des photos éditoriales pertinentes
// (portraits officiels, bâtiments, infographies de presse).
const REAL_IMAGE_MAPPINGS = [
  // Personnalités politiques FR — portraits officiels
  [/\bEmmanuel Macron\b/i, 'Emmanuel Macron président France portrait officiel'],
  [/\bMacron\b/i, 'Emmanuel Macron président France portrait'],
  [/\bFrançois Bayrou\b|\bBayrou\b/i, 'François Bayrou Premier ministre portrait'],
  [/\bGabriel Attal\b|\bAttal\b/i, 'Gabriel Attal portrait politique'],
  [/\bÉlisabeth Borne\b|\bElisabeth Borne\b|\bBorne\b/i, 'Élisabeth Borne portrait officiel'],
  [/\bBruno Le Maire\b|\bLe Maire\b|\bLemaire\b/i, 'Bruno Le Maire ministre économie'],
  [/\bSébastien Lecornu\b|\bLecornu\b/i, 'Sébastien Lecornu portrait officiel'],
  [/\bJean-Luc Mélenchon\b|\bMélenchon\b|\bMelenchon\b/i, 'Jean-Luc Mélenchon portrait'],
  [/\bMarine Le Pen\b|\bLe Pen\b/i, 'Marine Le Pen portrait officiel'],
  [/\bJordan Bardella\b|\bBardella\b/i, 'Jordan Bardella portrait officiel'],

  // International
  [/\bDonald Trump\b|\bTrump\b/i, 'Donald Trump président États-Unis'],
  [/\bJoe Biden\b|\bBiden\b/i, 'Joe Biden président portrait'],
  [/\bVladimir Poutine\b|\bPoutine\b|\bPutin\b/i, 'Vladimir Poutine président Russie'],
  [/\bVolodymyr Zelensky\b|\bZelensky\b/i, 'Volodymyr Zelensky président Ukraine'],
  [/\bBenjamin Netanyahou\b|\bNetanyahou\b|\bNetanyahu\b/i, 'Benjamin Netanyahou Premier ministre Israël'],
  [/\bAli Khamenei\b|\bKhamenei\b/i, 'Ali Khamenei guide suprême Iran'],
  [/\bXi Jinping\b/i, 'Xi Jinping président Chine'],
  [/\bErdogan\b/i, 'Recep Tayyip Erdogan Turquie'],
  [/\bChristine Lagarde\b|\bLagarde\b/i, 'Christine Lagarde BCE présidente'],
  [/\bJerome Powell\b|\bPowell\b/i, 'Jerome Powell Fed États-Unis'],

  // Institutions FR — bâtiments
  [/\bBercy\b/i, 'Bercy ministère économie finances façade Paris'],
  [/\bMatignon\b/i, 'Matignon hôtel Premier ministre Paris'],
  [/\bÉlysée\b|\bElysee\b/i, 'palais de l\'Élysée façade Paris'],
  [/\bAssemblée nationale\b|\bAssemblee nationale\b|\bHémicycle\b|\bHemicycle\b/i, 'Assemblée nationale hémicycle Paris séance'],
  [/\bSénat\b|\bSenat\b/i, 'Sénat Luxembourg Paris hémicycle'],
  [/\bConseil constitutionnel\b/i, 'Conseil constitutionnel France Palais Royal'],
  [/\bBanque de France\b/i, 'Banque de France Hôtel Toulouse Paris'],
  [/\bCour des comptes\b/i, 'Cour des comptes Palais Cambon Paris'],
  [/\bInsee\b|\bINSEE\b/i, 'INSEE Institut statistique France logo'],
  [/\bDGFiP\b/i, 'DGFiP direction générale finances publiques'],

  // Institutions internationales
  [/\bAIE\b|\bAgence internationale de l'énergie\b/i, 'Agence internationale de l\'énergie AIE Paris'],
  [/\bOPEP\b|\bOPEC\b/i, 'OPEP OPEC réunion ministres pétrole'],
  [/\bOCDE\b/i, 'OCDE siège Paris Château de la Muette'],
  [/\bFMI\b/i, 'FMI Fonds monétaire international Washington'],
  [/\bBCE\b|\bEuropean Central Bank\b/i, 'BCE Banque centrale européenne Francfort tour'],
  [/\bCommission européenne\b/i, 'Commission européenne Bruxelles Berlaymont'],

  // Lieux d'actualité
  [/\bdétroit d'Ormuz\b|\bdétroit Ormuz\b|\bOrmuz\b/i, 'détroit d\'Ormuz carte satellite pétroliers'],
  [/\bTéhéran\b|\bTeheran\b|\bTehran\b/i, 'Téhéran Iran capitale skyline'],
  [/\bGaza\b/i, 'Gaza bande ville'],
  [/\bKyiv\b|\bKiev\b/i, 'Kyiv Kiev Ukraine place capitale'],
  [/\bWall Street\b/i, 'Wall Street New York bourse façade'],

  // Termes pétrole / fiscalité
  [/\bTICPE\b/i, 'TICPE taxe carburant France ticket'],
  [/\bTVA\b/i, 'TVA taxe valeur ajoutée facture France'],
  [/\bSP95\b|\bSP98\b/i, 'pompe essence SP95 France station'],
  [/\bE85\b|\bE10\b/i, 'pompe essence E85 E10 France'],
  [/\bgazole\b|\bdiesel\b/i, 'pompe gazole diesel station France'],
  [/\bBrent\b/i, 'cours du Brent baril pétrole graphique'],
  [/\bWTI\b/i, 'WTI West Texas baril pétrole graphique'],
  [/\bbaril(?:s)?\b/i, 'baril pétrole brut industrie'],
  [/\bpétrolier(?:s)?\b|\bpetrolier(?:s)?\b|\btanker\b/i, 'pétrolier tanker mer'],
  [/\braffinerie\b/i, 'raffinerie pétrole industrielle cheminées'],
  [/\bpompe à essence\b|\bpompe essence\b/i, 'pompe essence station France gros plan'],
  [/\bticket de caisse\b/i, 'ticket de caisse essence France'],
  [/\bplein d'essence\b|\bplein d essence\b|\bplein de 50 litres\b/i, 'plein d\'essence facture station France'],
  [/\bstation[-\s]service\b/i, 'station service carburant France'],
  [/\binflation\b/i, 'inflation France ticket prix supermarché'],
  [/\bdette\b|\bdéficit\b|\bdeficit\b/i, 'dette publique France graphique chiffres'],
  [/\bbudget\b/i, 'budget France Bercy graphique'],
];

const REAL_IMAGE_TRIGGERS = REAL_IMAGE_MAPPINGS.map(([re]) => re);

function shouldBeRealImage(text) {
  if (!text) return false;
  return REAL_IMAGE_TRIGGERS.some((re) => re.test(text));
}

// Reconstruit une query real-image riche et désambiguée depuis le text du beat.
// Utilise la table de mapping : chaque match ramène une query pré-écrite pour
// maximiser la pertinence Google Images.
function buildRealImageQueryFromText(text) {
  if (!text) return null;
  for (const [re, query] of REAL_IMAGE_MAPPINGS) {
    if (re.test(text)) return query;
  }
  return null;
}

// Pipeline sanitize v24 — 100 % IA générative :
// - Les seules sources valides sont "kling" (vidéo IA) et "flux-image" (photo IA)
// - Rétrocompat : si Claude utilise encore "real-image" ou "stock-video",
//   on reroute vers "flux-image" (photo IA) par défaut
// - Le champ visual est désormais un prompt IA, pas une query de recherche
function sanitizeBeats(beats, topic = '') {
  return beats.map((b) => {
    const cleaned = { ...b };
    const rawVisual = (b.visual || '').trim();

    // Map toute source "ancienne" vers flux-image (par défaut)
    if (!cleaned.source || ['pexels', 'stock-video', 'real-image'].includes(cleaned.source)) {
      cleaned.source = 'flux-image';
    }
    // On ne garde que kling ou flux-image
    if (cleaned.source !== 'kling' && cleaned.source !== 'flux-image') {
      cleaned.source = 'flux-image';
    }

    // Si le prompt est vide, on fabrique un fallback depuis le text + topic
    if (!rawVisual || rawVisual.length < 5) {
      cleaned.visual = `Editorial photograph illustrating ${b.text || topic}, cinematic lighting, photojournalism style`;
    } else {
      cleaned.visual = rawVisual;
    }

    return cleaned;
  });
}

async function writeScript({ topic, duration = 45, providedScript = null, noLlm = false }) {
  if (noLlm) {
    if (!providedScript) {
      throw new Error('script-writer (--no-llm): --script=... est obligatoire en mode sans LLM');
    }
    return localPlan({ topic, scriptText: providedScript });
  }

  const words = targetWords(duration);

  const prompt = `Tu es rédacteur-en-chef vidéo pour "Où Va l'Argent", **média d'actualité économique français** au ton journalistique engagé, libéral assumé.

SUJET : ${topic}
DURÉE CIBLE : ${duration} secondes (environ ${words} mots de voix off)

RÈGLE ÉDITORIALE IMPÉRATIVE (c'est un média d'INFORMATION, pas un storyteller TikTok) :

1. **DENSITÉ FACTUELLE ÉLEVÉE** : ce n'est pas un script "punchy" mais un script INFORMATIF. Cible 8 à 15 chiffres concrets dans le script : dates, montants, pourcentages, volumes, dénominations fiscales précises (TICPE, TVA, CSG, etc.). Le spectateur doit APPRENDRE quelque chose de non trivial.

2. **MÉCANISMES EXPLIQUÉS** : ne pas se contenter de lister des faits. Explique les mécanismes : comment une hausse du baril se transmet à la pompe, comment une taxe en nourrit une autre, comment une mesure profite à qui. Objectif : quand la vidéo se termine, le spectateur comprend un mécanisme économique qu'il ignorait avant.

3. **RAPPORTER AU CONCRET DU QUOTIDIEN** : jamais de "le litre" ou "le kWh" seul — toujours convertir en grandeur que le spectateur vit : **le plein de 50 litres, la facture mensuelle, le budget annuel ménage, le coût par Français, l'équivalent en salaires**. Exemple : pas "4 centimes de plus au litre" mais "2 euros de plus par plein, 104 euros de plus sur l'année pour un plein par semaine".

4. **INSTITUTIONS CITÉES DANS LA VOIX** : cite les sources dans le corps du script ("selon l'AIE", "la Banque de France anticipe", "la Cour des comptes estime", "d'après l'Insee"…). Ça authentifie et structure.

5. **TON ENGAGÉ + FACTUEL** : tu as une position éditoriale (libérale, critique de l'excès fiscal, de la bureaucratie, de la dépense publique inefficace). Tu l'affirmes clairement, MAIS toujours adossée à des faits et des chiffres, jamais à la démagogie ou à la moralisation. Exemples acceptés : *"Plus l'essence flambe, plus le fisc encaisse. Mécaniquement."* — *"Une taxe sur la taxe : particularité française."* — *"La fiscalité française, elle, ponctionne chaque centime."* À proscrire : *"Partage ça !"*, *"Ils nous volent !"*, *"C'est honteux"*, etc.

6. **PAS DE "toi" / "tutoiement familier"** : on utilise "vous" journalistique. On s'adresse à un citoyen informé, pas à un copain au comptoir.

7. **STRUCTURE JOURNALISTIQUE** :
   - **ACCROCHE FACTUELLE** (date + chiffres bruts — pas une provocation)
   - **CONTEXTE** (pourquoi maintenant, que se passe-t-il)
   - **MÉCANISME / DÉCOMPOSITION** (le cœur pédagogique — expliquer le "comment")
   - **MISE EN PERSPECTIVE** (chiffres projetés, impact macro, sources citées)
   - **CHUTE ENGAGÉE** (une ou deux phrases de position, adossées à ce qui précède)

8. **Phrases moyennes à courtes**. Une idée par phrase. Quelques respirations marquées "..." aux bascules d'argumentation.

EXEMPLES DE CE QU'ON ATTEND (extraits de bon script) :

> "15 juin 2026. Les frappes américaines touchent l'Iran. En 48 heures, le baril de Brent passe de 68 à 130 dollars. À la pompe, votre plein de 50 litres de SP95 passe de 85 à 96 euros."
>
> "Décomposons votre plein à 85 euros. 37,50 euros de pétrole brut, raffinage et marge. 34 euros de TICPE. Et 14 euros de TVA — appliquée sur le prix total, y compris sur la TICPE. Une taxe sur la taxe."
>
> "Plus l'essence flambe, plus le fisc encaisse. Mécaniquement."

SOURCES OBLIGATOIRES dans la voix off :
Cite 1 à 3 institutions officielles directement dans le texte parlé. Références pertinentes selon sujet :
- Énergie / pétrole : AIE (Agence internationale de l'énergie), EIA (Energy Information Administration US), OPEP
- Finances publiques France : Cour des comptes, Insee, DGFiP, Bercy, Banque de France
- Europe : BCE, Commission européenne, Eurostat
- Travail/salaires : Insee, Dares, OCDE
- Fiscalité : Conseil des prélèvements obligatoires, OFCE, Institut Montaigne

PLAN VISUEL — 100 % IA GÉNÉRATIVE (fini les banques d'images).

Le pipeline utilise **uniquement deux sources IA** via fal.ai :
- **Kling 2.5** → génère des clips vidéo 5s à partir d'un prompt (pour scènes avec mouvement, action, cinématique)
- **Flux 1.1 pro** → génère une image photoréaliste à partir d'un prompt (pour statique, portraits, décor, concepts)

Le champ \`visual\` est désormais un **prompt IA descriptif riche** (15-40 mots en ANGLAIS), pas une recherche simple.

Pour chaque beat, choisis \`source\` parmi **seulement deux valeurs** :

**"kling"** — scènes avec MOUVEMENT ou ACTION (~30-40 % des beats) :
- Action cinématique (frappes militaires, navigation navire, pompe qui fonctionne, baril qui roule)
- Plans aériens/caméra en mouvement
- Foules, circulation, fluides
- Bourse, écrans en temps réel, traders s'agitant
- Exemples de prompts :
  - *"Cinematic aerial view of oil tanker navigating narrow strait at dusk, dramatic orange lighting, slow push-in camera movement, epic documentary style"*
  - *"Military fighter jets flying over desert industrial facility at night, dramatic flares and explosions in distance, wide shot, photorealistic"*
  - *"Gasoline pump close-up, digital counter rapidly incrementing numbers, hand gripping nozzle, shallow depth of field, documentary style"*
  - *"Bustling stock exchange floor, red screens flashing, traders panicking, dynamic handheld camera, cinematic"*

**"flux-image"** — scènes STATIQUES, portraits, bâtiments, objets, concepts (~60-70 % des beats) :
- Bâtiments institutionnels (Bercy, Matignon, Assemblée, BCE…)
- Portraits éditoriaux (Macron, Le Maire, Poutine…)
- Objets en plan serré (ticket de caisse, billet, calculatrice, document)
- Cartes, graphiques, concepts abstraits
- Photos type presse éditoriale
- L'image sera affichée avec un **effet Ken Burns** (léger zoom/pan) pour donner du mouvement
- Exemples de prompts :
  - *"Professional editorial portrait of Emmanuel Macron, French President, official setting, serious expression, high detail, cinematic lighting"*
  - *"Bercy ministry of economy and finance building façade in Paris, modern architecture, evening golden light, editorial photography"*
  - *"Close-up of a French gas station receipt showing TICPE and TVA taxes itemized, detailed paper texture, documentary style"*
  - *"Satellite map view of Strait of Hormuz showing oil tankers with labels, editorial cartography style, muted colors"*

CONVENTIONS DE PROMPT :
- **Toujours en ANGLAIS** (les modèles IA comprennent mieux)
- **Détaillé** : décris le sujet, l'angle caméra, l'éclairage, le style (ex: *"editorial photography"*, *"cinematic"*, *"documentary"*)
- **Personnalités nommées** : précise toujours *"official portrait of [Name], [Title], French/American/Iranian setting"*
- **Lieux** : précise le pays et l'époque si pertinent
- **Ratio** : les modèles génèrent en portrait 9:16 automatiquement (fait par le pipeline)

COUVERTURE OBLIGATOIRE v26 — RYTHME SACCADÉ : pour un script de ${duration}s, produis entre **${Math.round(duration * 0.5)} et ${Math.round(duration * 0.65)} beats** (soit un plan toutes les **1,5 à 2 secondes**). Chaque beat est ultra-court (3-6 mots parlés) pour créer un rythme nerveux type TikTok viral.

Beat court = phrase courte (**pas de phrase de 12 mots étirée**). Coupe les phrases en plusieurs beats si nécessaire. Exemples :
- AU LIEU DE : beat = "En 48 heures, le baril de Brent passe de 68 à 130 dollars."
- FAIRE : 3 beats = "En 48 heures." / "Le baril de Brent." / "De 68 à 130 dollars."

PAS DE VIRGULES DE DESCRIPTION DE MONTAGE ("puis zoom", "split-screen"…). Un prompt IA décrit **une scène unique cohérente**.

TITRE ET CATÉGORIE :
- \`titre\` : titre court percutant pour le classement
- \`categorie\` : Finances publiques, Macro-éco, Investissement, Actu éco, International, Finance perso, Écologie, Impôts, Emploi, Immobilier, Santé, Éducation, Défense, Retraites, Social
- \`accent\` : code hex par catégorie (Finances publiques: #00d4ff, Impôts: #ef4444, Actu éco: #ff9f43, International: #a855f7, Finance perso: #ff4757, Macro-éco: #ffd700, autre: #00d4ff)

SOURCES :
2-5 sources officielles récentes pour les chiffres cités.

Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de commentaires) :

{
  "titre": "...",
  "categorie": "...",
  "accent": "#...",
  "scriptText": "Le texte complet avec ponctuation et ... de respiration.",
  "beats": [
    { "text": "...", "visual": "...", "source": "stock-video", "highlight": [] }
  ],
  "sources": [
    { "nom": "...", "annee": 2026, "url": "..." }
  ]
}`;

  let raw;
  if (providedScript) {
    const beatPrompt = `Voici un script voix off déjà rédigé pour une vidéo de ${duration}s. Découpe-le en beats comme décrit ci-dessous et produis un titre + catégorie.

SCRIPT FOURNI :
"""
${providedScript}
"""

${prompt.split('Réponds UNIQUEMENT')[1] ? 'Réponds UNIQUEMENT' + prompt.split('Réponds UNIQUEMENT')[1] : ''}`;
    raw = await askClaude(beatPrompt, 'claude-sonnet-4-6', 4000);
  } else {
    raw = await askClaude(prompt, 'claude-sonnet-4-6', 4000);
  }

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('script-writer: JSON introuvable dans la réponse Claude');
  }

  const parsed = JSON.parse(match[0]);

  if (providedScript) {
    parsed.scriptText = providedScript;
  }
  if (!parsed.titre) throw new Error('script-writer: titre manquant');
  if (!parsed.beats || !Array.isArray(parsed.beats) || parsed.beats.length === 0) {
    throw new Error('script-writer: beats manquants ou vides');
  }

  // Normalise source + sanitize défensif des queries LLM.
  // Ce pass corrige les descriptions de montage et bascule vers real-image
  // tout beat dont le text contient un nom propre ou un terme éco/fiscal.
  parsed.beats = sanitizeBeats(parsed.beats, topic).map((b) => ({
    ...b,
    highlight: b.highlight || [],
  }));

  parsed.slug = slugify(parsed.titre);
  parsed.topic = topic;
  parsed.duration = duration;
  parsed.categorie = parsed.categorie || 'Actu éco';
  parsed.accent = parsed.accent || '#00d4ff';
  parsed.sources = parsed.sources || [];

  return parsed;
}

module.exports = { writeScript };

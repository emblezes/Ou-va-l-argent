#!/usr/bin/env node
/**
 * Renumérotation des infographies OVLA — script orchestrateur.
 *
 * Sous-commandes :
 *   --audit     Inventaire complet (lecture seule) → .renumber-audit.json
 *   --plan      Mapping ancien→nouveau interactif → renommages.json
 *   --dry-run   Simule renommage + maj refs sans toucher au disque
 *   --apply     Exécute renommage + maj Notion + maj refs
 *   --verify    Vérifie cohérence post-renommage
 *   --rollback  Inverse les renommages depuis renommages.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Client } = require('@notionhq/client');

// ─── Chemins ────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '../..');
const PROD_DIR = path.join(REPO_ROOT, 'Production interne', 'Réseaux Sociaux ', 'Infographies');
const SITE_DIR = path.join(REPO_ROOT, 'Site');

const DIRS = {
  html: path.join(PROD_DIR, 'Sources HTML'),
  insta: path.join(PROD_DIR, 'Insta & Autres'),
  tiktokV: path.join(PROD_DIR, 'Tiktok Vertical'),
  tiktokH: path.join(PROD_DIR, 'Tiktok Horizontal'),
  publicSite: path.join(SITE_DIR, 'public', 'infographies'),
};

const PNG_SUFFIX = {
  insta: '-instagram.png',
  tiktokV: '-tiktok-v.png',
  tiktokH: '-tiktok-h.png',
  publicSite: '-instagram.png',
};

const AUDIT_FILE = path.join(__dirname, '.renumber-audit.json');
const PLAN_FILE = path.join(__dirname, 'renommages.json');
const LOG_FILE = path.join(__dirname, '.renumber.log');

// ─── Config Notion ──────────────────────────────────────────────────────────

const _config = JSON.parse(fs.readFileSync(path.join(__dirname, 'notion-config.json'), 'utf8'));
const cfg = Object.fromEntries(Object.entries(_config).map(([k, v]) => [k, process.env[k] || v]));
const notion = new Client({ auth: cfg.NOTION_SECRET });

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg) {
  const stamped = `[${new Date().toISOString()}] ${msg}`;
  console.log(msg);
  fs.appendFileSync(LOG_FILE, stamped + '\n');
}

function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(ext) && !f.startsWith('.') && !f.startsWith('_'));
}

/**
 * Parse un nom d'infographie : "113bis-dette-naissance-bebe.html" →
 *   { num: 113, variant: 'bis', subletter: null, slug: 'dette-naissance-bebe', ext: '.html', lang: null }
 *
 * Patterns reconnus :
 *   123-foo.html                    → num=123, variant=null
 *   123bis-foo.html                 → num=123, variant='bis'
 *   123ter-foo.html                 → num=123, variant='ter'
 *   123quater-foo.html              → num=123, variant='quater'
 *   123a-foo.html / 123b-foo.html   → num=123, subletter='a' (carrousels exportés)
 *   123-foo-carousel.html           → num=123, variant='carousel'
 *   55-foo-bar-EN.html              → num=55, lang='en'
 */
function parseFilename(filename) {
  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);

  // Strip suffixes PNG (e.g. -instagram, -tiktok-v, -tiktok-h)
  let core = base;
  let pngSuffix = null;
  for (const [key, suf] of Object.entries(PNG_SUFFIX)) {
    const sufBase = suf.replace('.png', '');
    if (core.endsWith(sufBase)) {
      core = core.slice(0, -sufBase.length);
      pngSuffix = sufBase.slice(1); // 'instagram', 'tiktok-v', 'tiktok-h'
      break;
    }
  }

  // Match leading number + optional variant
  const m = core.match(/^(\d+)(bis|ter|quater|quinter|[a-e])?(?:-(.*))?$/);
  if (!m) {
    return { num: null, variant: null, subletter: null, slug: core, ext, lang: null, pngSuffix, raw: filename };
  }

  const num = parseInt(m[1], 10);
  const suffix = m[2] || null;
  let slug = m[3] || '';
  let lang = null;
  let variant = null;
  let subletter = null;

  if (suffix && /^(bis|ter|quater|quinter)$/.test(suffix)) variant = suffix;
  else if (suffix && /^[a-e]$/.test(suffix)) subletter = suffix;

  // Detect carousel
  if (slug.endsWith('-carousel')) {
    variant = 'carousel';
    slug = slug.slice(0, -'-carousel'.length);
  }

  // Detect language suffix (-EN, -FR, -DE, -IT, -ES)
  const langMatch = slug.match(/-(EN|FR|DE|IT|ES)$/i);
  if (langMatch) {
    lang = langMatch[1].toLowerCase();
    slug = slug.slice(0, -(langMatch[0].length));
  }
  // Italian content slugs (e.g. "chi-finanzia-stato-italia") — heuristic, flag for review
  if (!lang && /italia\b/i.test(slug)) lang = 'it';

  return { num, variant, subletter, slug, ext, lang, pngSuffix, raw: filename };
}

/** Date de création réelle d'un fichier via git log. Renvoie ISO string ou null. */
function gitCreatedAt(absPath) {
  try {
    const rel = path.relative(REPO_ROOT, absPath);
    const out = execSync(
      `git log --diff-filter=A --follow --format=%aI -- "${rel}"`,
      { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim();
    const lines = out.split('\n').filter(Boolean);
    return lines.length ? lines[lines.length - 1] : null;
  } catch {
    return null;
  }
}

/** Détecte la langue dans un fichier HTML (lang="xx" attribut). */
function detectHtmlLang(absPath) {
  try {
    const content = fs.readFileSync(absPath, 'utf8').slice(0, 1000);
    const m = content.match(/<html[^>]*\blang="([a-z]{2})"/i);
    return m ? m[1].toLowerCase() : null;
  } catch {
    return null;
  }
}

// ─── Audit ──────────────────────────────────────────────────────────────────

async function audit() {
  log('=== AUDIT ===');

  // 1. Inventaire HTML
  const htmlFiles = listFiles(DIRS.html, '.html');
  log(`HTML: ${htmlFiles.length} fichiers`);

  const records = [];
  for (const filename of htmlFiles) {
    const abs = path.join(DIRS.html, filename);
    const parsed = parseFilename(filename);
    const htmlLang = detectHtmlLang(abs);
    const createdAt = gitCreatedAt(abs);
    const stat = fs.statSync(abs);

    records.push({
      filename,
      ...parsed,
      htmlLang,
      langEffective: parsed.lang || htmlLang || 'fr',
      sizeBytes: stat.size,
      createdAt,
      mtimeIso: stat.mtime.toISOString(),
      png: {}, // rempli ci-dessous
    });
  }

  // 2. Inventaire PNG par dossier
  const pngByDir = {};
  for (const [key, dir] of Object.entries(DIRS)) {
    if (key === 'html') continue;
    pngByDir[key] = listFiles(dir, '.png');
    log(`${key}: ${pngByDir[key].length} fichiers`);
  }

  // 3. Match HTML → PNG
  // Pour un HTML "123-foo.html", on cherche les PNG qui matchent exactement
  // "123-foo-{suffix}.png" (en utilisant le baseName HTML pour préserver d'éventuels
  // zéros de tête comme "01"). Pour les carousels, on accepte aussi "123[a-e]-*".
  // Pour le matching d'un carousel, on extrait le préfixe num (avec zéros) du nom HTML.
  for (const rec of records) {
    if (rec.num === null) continue;
    const baseNoExt = rec.filename.slice(0, -rec.ext.length); // ex "01-explosion-dette-france"
    // Extrait le préfixe num tel qu'écrit dans le nom (préserve "01" vs "1")
    const numPrefixMatch = baseNoExt.match(/^(\d+)/);
    const numPrefix = numPrefixMatch ? numPrefixMatch[1] : String(rec.num);
    for (const [key, files] of Object.entries(pngByDir)) {
      const suffix = PNG_SUFFIX[key].replace('.png', '');
      const matched = files.filter(f => {
        const fbase = f.slice(0, -'.png'.length);
        if (!fbase.endsWith(suffix)) return false;
        const core = fbase.slice(0, -suffix.length);
        if (rec.variant === 'carousel') {
          // 123-foo-carousel → match "123[a-e]-*"
          return new RegExp(`^${numPrefix}[a-e]-`).test(core);
        }
        // Match exact baseNoExt (préserve "01" et autres zéros)
        return core === baseNoExt;
      });
      rec.png[key] = matched;
    }
  }

  // 4. Détection doublons numériques
  const byNum = {};
  for (const r of records) {
    if (r.num === null) continue;
    const key = `${r.num}${r.variant || ''}${r.subletter || ''}`;
    if (!byNum[key]) byNum[key] = [];
    byNum[key].push(r.filename);
  }
  const duplicates = Object.entries(byNum)
    .filter(([, files]) => files.length > 1)
    .map(([key, files]) => ({ key, files }));

  // 5. Orphelins HTML (sans aucun PNG dans Insta & Autres + publicSite)
  const orphans = records.filter(r => {
    if (r.num === null) return true; // pas de numéro = orphelin
    const insta = r.png.insta || [];
    const pub = r.png.publicSite || [];
    return insta.length === 0 && pub.length === 0;
  });

  // 6. PNG orphelins (sans HTML correspondant)
  const htmlBaseNames = new Set(records.map(r => r.filename.slice(0, -r.ext.length)));
  const carouselNumbers = new Set(records.filter(r => r.variant === 'carousel').map(r => r.num));
  const pngOrphans = {};
  for (const [key, files] of Object.entries(pngByDir)) {
    const suffix = PNG_SUFFIX[key].replace('.png', '');
    pngOrphans[key] = files.filter(f => {
      const core = f.slice(0, -'.png'.length).slice(0, -suffix.length);
      if (htmlBaseNames.has(core)) return false;
      // Vérifie si c'est un dérivé de carousel (123a-, 123b-, etc.)
      const m = core.match(/^(\d+)[a-e]-/);
      if (m && carouselNumbers.has(parseInt(m[1], 10))) return false;
      return true;
    });
  }

  // 7. Query Notion : pages avec propriété N°
  log('Query Notion calendrier Publications…');
  const notionPages = await queryNotionPages();
  log(`Notion: ${notionPages.length} pages avec N° non nul`);

  // 8. Sortie
  const audit = {
    generatedAt: new Date().toISOString(),
    totals: {
      html: records.length,
      insta: pngByDir.insta?.length || 0,
      tiktokV: pngByDir.tiktokV?.length || 0,
      tiktokH: pngByDir.tiktokH?.length || 0,
      publicSite: pngByDir.publicSite?.length || 0,
    },
    records,
    duplicates,
    orphans: orphans.map(r => r.filename),
    pngOrphans,
    notionPages,
  };

  fs.writeFileSync(AUDIT_FILE, JSON.stringify(audit, null, 2));
  log(`✓ Audit écrit → ${AUDIT_FILE}`);

  // Synthèse console
  console.log('\n═══ Synthèse ═══');
  console.log(`HTML actifs            : ${audit.totals.html}`);
  console.log(`PNG Insta & Autres     : ${audit.totals.insta}`);
  console.log(`PNG TikTok Vertical    : ${audit.totals.tiktokV}`);
  console.log(`PNG TikTok Horizontal  : ${audit.totals.tiktokH}`);
  console.log(`PNG Site/public        : ${audit.totals.publicSite}`);
  console.log(`Doublons numériques    : ${duplicates.length}`);
  console.log(`HTML orphelins (s/PNG) : ${orphans.length}`);
  console.log(`PNG orphelins insta    : ${pngOrphans.insta?.length || 0}`);
  console.log(`PNG orphelins tiktokV  : ${pngOrphans.tiktokV?.length || 0}`);
  console.log(`PNG orphelins tiktokH  : ${pngOrphans.tiktokH?.length || 0}`);
  console.log(`PNG orphelins public   : ${pngOrphans.publicSite?.length || 0}`);
  console.log(`Pages Notion avec N°   : ${notionPages.length}`);
  console.log('');

  // Détail doublons
  if (duplicates.length) {
    console.log('═══ Doublons numériques ═══');
    for (const d of duplicates) {
      console.log(`  N°${d.key}: ${d.files.join(', ')}`);
    }
    console.log('');
  }

  return audit;
}

// ─── Notion ─────────────────────────────────────────────────────────────────

async function queryNotionPages() {
  const dataSourceId = cfg.PUBLICATIONS_DATA_SOURCE_ID;
  if (!dataSourceId) {
    log('⚠ PUBLICATIONS_DATA_SOURCE_ID manquant, skip Notion');
    return [];
  }
  const pages = [];
  let cursor;
  do {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      start_cursor: cursor,
    });
    for (const p of res.results) {
      const numProp = p.properties?.['N°'];
      const num = numProp?.number;
      const titleProp = p.properties?.['Name'] || p.properties?.['Titre'];
      const title = titleProp?.title?.[0]?.plain_text || '(sans titre)';
      if (num != null) pages.push({ pageId: p.id, num, title });
    }
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return pages.sort((a, b) => a.num - b.num);
}

// ─── Plan ───────────────────────────────────────────────────────────────────

const BATCH_EXPORT_FILE = path.join(__dirname, 'batch-export-all.js');

/** Lit batch-export-all.js et extrait le tableau INFOGRAPHICS. */
function readBatchExportInfographics() {
  const src = fs.readFileSync(BATCH_EXPORT_FILE, 'utf8');
  const m = src.match(/const INFOGRAPHICS = \[([\s\S]*?)\n\];/);
  if (!m) throw new Error('Tableau INFOGRAPHICS introuvable dans batch-export-all.js');
  const entries = [];
  const re = /\['([^']+)',\s*(\d+),\s*'([^']+)'\]/g;
  let mm;
  while ((mm = re.exec(m[1])) !== null) {
    entries.push({ htmlFile: mm[1], idx: parseInt(mm[2], 10), baseName: mm[3] });
  }
  return entries;
}

/** Construit le mapping htmlFile → [baseNames] depuis INFOGRAPHICS. */
function buildBaseNamesMap(infographicsEntries) {
  const map = {};
  for (const e of infographicsEntries) {
    if (!map[e.htmlFile]) map[e.htmlFile] = [];
    map[e.htmlFile][e.idx] = e.baseName;
  }
  return map;
}

/**
 * Construit le slug du nouveau nom de fichier.
 * Règles :
 *  - bis/ter/quater : slug original (le user a choisi "garde slug identique")
 *  - lang -EN/-FR/-DE/-IT : suffixe -en/-fr/-de/-it
 *  - carousel : -carousel inchangé
 */
function buildNewSlug(record) {
  let slug = record.slug;
  if (record.lang) {
    slug = `${slug}-${record.lang}`;
  }
  if (record.variant === 'carousel') {
    slug = `${slug}-carousel`;
  }
  return slug;
}

function buildNewHtmlFilename(num, record) {
  const slug = buildNewSlug(record);
  return `${num}-${slug}.html`;
}

/**
 * Pour un HTML qui est un carrousel, calcule les nouveaux baseName a/b/c/d/e
 * en réutilisant les old baseNames de batch-export-all.js. Préserve les sous-slugs.
 *  Ex: 127-intermittents-carousel.html → ancien = ['127a-intermittents-titre', '127b-intermittents-154600', ...]
 *       Pour num=47 : new = ['47a-intermittents-titre', '47b-intermittents-154600', ...]
 */
function buildCarouselBaseNames(oldBaseNames, newNum) {
  return oldBaseNames.map(old => {
    // old format: "127a-intermittents-titre"
    const m = old.match(/^(\d+)([a-e])-(.+)$/);
    if (!m) return null;
    return { oldBase: old, newBase: `${newNum}${m[2]}-${m[3]}` };
  }).filter(Boolean);
}

async function plan() {
  log('=== PLAN ===');

  if (!fs.existsSync(AUDIT_FILE)) {
    console.error('✗ .renumber-audit.json manquant. Lance --audit d\'abord.');
    process.exit(2);
  }

  const auditData = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
  const infographicsEntries = readBatchExportInfographics();
  const baseNamesMap = buildBaseNamesMap(infographicsEntries);

  log(`Audit: ${auditData.records.length} records, batch-export: ${infographicsEntries.length} entrées`);

  // 1. Sépare actifs / orphelins
  const records = auditData.records;
  const orphans = [];
  const actives = [];
  for (const r of records) {
    if (r.num === null) {
      orphans.push({ ...r, reason: 'no_number' });
      continue;
    }
    const hasPng = ['insta', 'tiktokV', 'tiktokH', 'publicSite']
      .some(k => (r.png[k] || []).length > 0);
    if (!hasPng) {
      orphans.push({ ...r, reason: 'no_png' });
      continue;
    }
    actives.push(r);
  }
  log(`Actifs: ${actives.length} | À archiver: ${orphans.length}`);

  // 2. Tri chronologique git ASC. Fallback : mtime, puis nom.
  actives.sort((a, b) => {
    const da = a.createdAt || a.mtimeIso || '9999';
    const db = b.createdAt || b.mtimeIso || '9999';
    if (da !== db) return da.localeCompare(db);
    return a.filename.localeCompare(b.filename);
  });

  // 3. Assigne nouveaux numéros 1..N
  const renames = [];
  const nOldToNew = {}; // pour notion_updates ; clé = ancien num (si unique)
  const conflicts = [];

  for (let i = 0; i < actives.length; i++) {
    const newNum = i + 1;
    const r = actives[i];
    const oldBaseName = r.filename.slice(0, -r.ext.length); // ex: "113bis-dette-naissance-bebe"
    const newHtml = buildNewHtmlFilename(newNum, r);
    const newBase = newHtml.slice(0, -'.html'.length);

    // Détecte les bases multiples (carousel)
    const oldBases = baseNamesMap[r.filename];
    let baseRenames; // [{ oldBase, newBase }]

    if (r.variant === 'carousel' && oldBases && oldBases.length > 1) {
      baseRenames = buildCarouselBaseNames(oldBases.filter(Boolean), newNum);
      if (!baseRenames.length) {
        conflicts.push({ kind: 'carousel_no_derives', file: r.filename });
        baseRenames = [{ oldBase: oldBaseName, newBase }];
      }
    } else {
      baseRenames = [{ oldBase: oldBaseName, newBase }];
    }

    renames.push({
      type: 'rename',
      n_old: r.num,
      n_new: newNum,
      old_html: r.filename,
      new_html: newHtml,
      slug: buildNewSlug(r),
      variant: r.variant,
      subletter: r.subletter,
      lang: r.lang,
      created_at: r.createdAt,
      base_renames: baseRenames,
      png_counts: {
        insta: (r.png.insta || []).length,
        tiktokV: (r.png.tiktokV || []).length,
        tiktokH: (r.png.tiktokH || []).length,
        publicSite: (r.png.publicSite || []).length,
      },
    });

  }

  // 3b. Mapping Notion : pour chaque ancien N°, choisir le nouveau N°.
  //     Priorité : carousel > principal sans variant ni subletter ni lang > sub-slug 'a' > plus ancien.
  //     "Vrai conflit" = plusieurs principaux distincts (sans variant ni subletter ni lang).
  const candidatesByOldNum = {};
  for (const ren of renames) {
    if (!candidatesByOldNum[ren.n_old]) candidatesByOldNum[ren.n_old] = [];
    candidatesByOldNum[ren.n_old].push(ren);
  }
  const notionMappingChoices = []; // info détail
  for (const [oldNumStr, cands] of Object.entries(candidatesByOldNum)) {
    const oldNum = parseInt(oldNumStr, 10);
    const carousel = cands.find(c => c.variant === 'carousel');
    const principals = cands.filter(c => !c.variant && !c.lang && !c.subletter);
    const subA = cands.find(c => c.subletter === 'a');
    let winner;
    let reason;
    if (carousel) {
      winner = carousel;
      reason = 'carousel';
    } else if (principals.length === 1) {
      winner = principals[0];
      reason = 'principal_unique';
    } else if (principals.length > 1) {
      winner = principals[0]; // plus ancien
      reason = 'principal_oldest';
      // Vrai conflit : plusieurs fichiers FR sans variant ni subletter portent le même num
      for (const loser of principals.slice(1)) {
        conflicts.push({
          kind: 'duplicate_principal',
          n_old: oldNum,
          winner_file: winner.old_html,
          winner_n_new: winner.n_new,
          loser_file: loser.old_html,
          loser_n_new: loser.n_new,
          note: 'Plusieurs fichiers FR principaux pour ce N°. Notion pointera vers le plus ancien. Édite le JSON pour changer.',
        });
      }
    } else if (subA) {
      winner = subA;
      reason = 'subletter_a';
    } else {
      winner = cands[0];
      reason = 'oldest_only';
    }
    if (winner) {
      nOldToNew[oldNum] = winner.n_new;
      notionMappingChoices.push({
        n_old: oldNum,
        n_new: winner.n_new,
        winner_file: winner.old_html,
        candidates_count: cands.length,
        reason,
      });
    }
  }

  // 4. Notion updates
  const notionUpdates = [];
  for (const p of auditData.notionPages) {
    const newNum = nOldToNew[p.num];
    if (newNum == null) {
      notionUpdates.push({
        page_id: p.pageId,
        title: p.title,
        n_old: p.num,
        n_new: null,
        status: 'unmapped', // l'ancien num pointait sur un fichier orphelin/archivé/ambigu
      });
    } else if (newNum !== p.num) {
      notionUpdates.push({
        page_id: p.pageId,
        title: p.title,
        n_old: p.num,
        n_new: newNum,
        status: 'mapped',
      });
    } else {
      notionUpdates.push({
        page_id: p.pageId,
        title: p.title,
        n_old: p.num,
        n_new: newNum,
        status: 'unchanged',
      });
    }
  }

  // 5. Détection collisions de noms cibles
  const newHtmlSeen = {};
  for (const r of renames) {
    if (newHtmlSeen[r.new_html]) {
      conflicts.push({
        kind: 'collision_html',
        new_html: r.new_html,
        files: [newHtmlSeen[r.new_html], r.old_html],
      });
    }
    newHtmlSeen[r.new_html] = r.old_html;
  }
  const newBaseSeen = {};
  for (const r of renames) {
    for (const br of r.base_renames) {
      if (newBaseSeen[br.newBase]) {
        conflicts.push({
          kind: 'collision_base',
          new_base: br.newBase,
          existing: newBaseSeen[br.newBase],
          new: br.oldBase,
        });
      }
      newBaseSeen[br.newBase] = br.oldBase;
    }
  }

  // 6. Archives
  const archives = orphans.map(r => ({
    type: 'archive',
    old_html: r.filename,
    reason: r.reason,
    png_orphans: r.png || {},
  }));

  // 7. Sortie
  const planData = {
    generated_at: new Date().toISOString(),
    stats: {
      actives: actives.length,
      archives: archives.length,
      conflicts: conflicts.length,
      notion_updates_mapped: notionUpdates.filter(u => u.status === 'mapped').length,
      notion_updates_unchanged: notionUpdates.filter(u => u.status === 'unchanged').length,
      notion_updates_unmapped: notionUpdates.filter(u => u.status === 'unmapped').length,
      next_free_number: actives.length + 1,
    },
    rules: {
      sort: 'createdAt ASC (git log --diff-filter=A --follow)',
      bis_ter_quater: 'numéro plein, slug identique (résolu cas par cas review JSON)',
      lang_suffix: 'slug enrichi -fr/-en/-de/-it',
      carousel: 'HTML conserve -carousel, PNG dérivés gardent suffixe a/b/c/d/e',
      orphans: 'HTML sans aucun PNG → _archives/',
    },
    renames,
    archives,
    conflicts,
    notion_mapping_choices: notionMappingChoices,
    notion_updates: notionUpdates,
  };

  fs.writeFileSync(PLAN_FILE, JSON.stringify(planData, null, 2));
  log(`✓ Plan écrit → ${PLAN_FILE}`);

  // Synthèse
  console.log('\n═══ Synthèse plan ═══');
  console.log(`Renommages         : ${renames.length}`);
  console.log(`Archives           : ${archives.length}`);
  console.log(`Conflits détectés  : ${conflicts.length}`);
  console.log(`Notion mapped      : ${planData.stats.notion_updates_mapped}`);
  console.log(`Notion unchanged   : ${planData.stats.notion_updates_unchanged}`);
  console.log(`Notion unmapped    : ${planData.stats.notion_updates_unmapped}`);
  console.log(`Prochain N° libre  : ${planData.stats.next_free_number}`);

  if (conflicts.length) {
    console.log('\n═══ Conflits ═══');
    for (const c of conflicts.slice(0, 20)) {
      console.log(' ', JSON.stringify(c));
    }
  }

  return planData;
}

// ─── Dry-run / Apply ────────────────────────────────────────────────────────

const INFOGRAPHIES_PAGE = path.join(SITE_DIR, 'app', 'infographies', 'page.tsx');
const INSPECT_REFS_FILE = path.join(__dirname, 'inspect-references.js');
const NOTION_REUPLOAD_FILE = path.join(__dirname, 'notion-reupload-images.js');

function loadPlan() {
  if (!fs.existsSync(PLAN_FILE)) {
    console.error(`✗ ${PLAN_FILE} manquant. Lance --plan d'abord.`);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(PLAN_FILE, 'utf8'));
}

/**
 * Construit la liste exhaustive des paires (oldPath, newPath) pour HTML + PNG + archives.
 * Retourne { renames: [{old, new, kind}], archives: [{old, kind}] }.
 */
function buildOperations(planData) {
  const ops = []; // {kind: 'rename'|'archive', dir, old, new}

  for (const r of planData.renames) {
    // HTML
    ops.push({ kind: 'rename', dir: 'html', old: r.old_html, new: r.new_html });
    // PNG dans chaque dossier
    for (const br of r.base_renames) {
      for (const [dirKey, sufKey] of Object.entries(PNG_SUFFIX)) {
        if (dirKey === 'html') continue;
        const oldPng = `${br.oldBase}${sufKey}`;
        const newPng = `${br.newBase}${sufKey}`;
        const dirPath = DIRS[dirKey];
        if (fs.existsSync(path.join(dirPath, oldPng))) {
          ops.push({ kind: 'rename', dir: dirKey, old: oldPng, new: newPng });
        }
      }
    }
  }

  for (const ar of planData.archives) {
    // HTML
    ops.push({ kind: 'archive', dir: 'html', old: ar.old_html });
    // PNG associés (ar.png_orphans est un dict par dir)
    for (const [dirKey, files] of Object.entries(ar.png_orphans || {})) {
      for (const f of files || []) {
        ops.push({ kind: 'archive', dir: dirKey, old: f });
      }
    }
  }

  return ops;
}

function detectMissingFiles(ops) {
  const missing = [];
  for (const op of ops) {
    const src = path.join(DIRS[op.dir], op.old);
    if (!fs.existsSync(src)) missing.push({ ...op, src });
  }
  return missing;
}

function detectTargetCollisions(ops) {
  const collisions = [];
  const seen = new Set();
  for (const op of ops) {
    if (op.kind !== 'rename') continue;
    const target = path.join(DIRS[op.dir], op.new);
    if (seen.has(target)) {
      collisions.push({ kind: 'rename_collision', target });
    } else if (fs.existsSync(target)) {
      // Existe déjà sur disque ET n'est pas en cours d'être renommé sur lui-même
      const isSourceForOther = ops.find(o => o.kind === 'rename' && o.dir === op.dir && path.join(DIRS[o.dir], o.old) === target);
      if (!isSourceForOther) collisions.push({ kind: 'target_exists', target });
    }
    seen.add(target);
  }
  return collisions;
}

async function dryRun() {
  log('=== DRY-RUN ===');
  const planData = loadPlan();
  const ops = buildOperations(planData);

  const renames = ops.filter(o => o.kind === 'rename');
  const archives = ops.filter(o => o.kind === 'archive');
  const byDir = {};
  for (const o of ops) {
    byDir[o.dir] = (byDir[o.dir] || 0) + 1;
  }

  console.log('═══ Opérations ═══');
  console.log(`  Renommages   : ${renames.length}`);
  console.log(`  Archives     : ${archives.length}`);
  console.log(`  Par dossier  :`);
  for (const [d, n] of Object.entries(byDir)) console.log(`    ${d.padEnd(12)} : ${n}`);

  // Vérifie sources existantes
  const missing = detectMissingFiles(ops);
  console.log(`\n═══ Sources manquantes : ${missing.length} ═══`);
  for (const m of missing.slice(0, 10)) console.log(`  ${m.dir}: ${m.old}`);
  if (missing.length > 10) console.log(`  … et ${missing.length - 10} autres`);

  // Collisions cibles
  const collisions = detectTargetCollisions(ops);
  console.log(`\n═══ Collisions cibles : ${collisions.length} ═══`);
  for (const c of collisions.slice(0, 10)) console.log(`  ${c.kind}: ${c.target}`);

  // Notion
  console.log(`\n═══ Notion ═══`);
  console.log(`  Pages à mettre à jour : ${planData.notion_updates.filter(u => u.status === 'mapped').length}`);
  console.log(`  Pages unchanged      : ${planData.notion_updates.filter(u => u.status === 'unchanged').length}`);
  console.log(`  Pages unmapped       : ${planData.notion_updates.filter(u => u.status === 'unmapped').length} (intactes)`);

  // batch-export-all.js
  const beEntries = readBatchExportInfographics();
  const oldToNewBase = {};
  for (const r of planData.renames) {
    for (const br of r.base_renames) oldToNewBase[br.oldBase] = br.newBase;
  }
  const oldToNewHtml = {};
  for (const r of planData.renames) oldToNewHtml[r.old_html] = r.new_html;
  let beUpdates = 0;
  let beMissing = 0;
  for (const e of beEntries) {
    if (oldToNewHtml[e.htmlFile]) beUpdates++;
    else beMissing++;
  }
  console.log(`\n═══ batch-export-all.js ═══`);
  console.log(`  Entrées mappables   : ${beUpdates}`);
  console.log(`  Entrées sans cible  : ${beMissing} (HTML archivé ou non renommé)`);

  // infographies/page.tsx
  const pageSrc = fs.readFileSync(INFOGRAPHIES_PAGE, 'utf8');
  const pageEntries = [...pageSrc.matchAll(/filename:\s*'([^']+)'/g)].map(m => m[1]);
  const pageMappable = pageEntries.filter(f => {
    const base = f.replace(/-instagram\.png$/, '');
    return oldToNewBase[base];
  });
  console.log(`\n═══ infographies/page.tsx ═══`);
  console.log(`  Total entrées        : ${pageEntries.length}`);
  console.log(`  Mappables           : ${pageMappable.length}`);
  console.log(`  Non mappables       : ${pageEntries.length - pageMappable.length}`);

  return { ops, missing, collisions, planData };
}

async function apply() {
  log('=== APPLY ===');

  // 0. Pré-flight : git status propre
  const gitStatus = execSync('git status --porcelain', { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  if (gitStatus && !process.argv.includes('--force')) {
    console.error('✗ Working tree non propre. Commit ou stash, puis relance avec --force pour continuer.');
    console.error(gitStatus.slice(0, 1000));
    process.exit(2);
  }

  const planData = loadPlan();
  const ops = buildOperations(planData);

  const missing = detectMissingFiles(ops);
  if (missing.length) {
    log(`⚠ ${missing.length} sources manquantes — elles seront ignorées (pas d'erreur).`);
  }

  // Tag git pre-renumber
  const tagName = `pre-renumber-${new Date().toISOString().slice(0, 10)}`;
  try {
    execSync(`git tag -f ${tagName}`, { cwd: REPO_ROOT, stdio: 'pipe' });
    log(`✓ Tag git ${tagName}`);
  } catch (e) {
    log(`⚠ Tag git échoué: ${e.message}`);
  }

  // 1. Crée les dossiers _archives/ dans tous les dirs
  for (const [key, dir] of Object.entries(DIRS)) {
    const archDir = path.join(dir, '_archives');
    if (!fs.existsSync(archDir)) {
      fs.mkdirSync(archDir, { recursive: true });
      log(`✓ Créé ${archDir}`);
    }
  }

  // 2. Archives HTML + PNG associés
  let archivedCount = 0;
  for (const op of ops.filter(o => o.kind === 'archive')) {
    const src = path.join(DIRS[op.dir], op.old);
    if (!fs.existsSync(src)) continue;
    const dst = path.join(DIRS[op.dir], '_archives', op.old);
    try {
      execSync(`git mv "${src}" "${dst}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
    } catch {
      fs.renameSync(src, dst);
    }
    archivedCount++;
  }
  log(`✓ ${archivedCount} fichiers archivés`);

  // 3. Renommage en 2 passes (tmp puis final) pour éviter collisions de cibles
  const TMP_PREFIX = '__tmp_renumber_';
  const renameOps = ops.filter(o => o.kind === 'rename');

  // Passe 1 : old → __tmp_old (préfixe court pour traçabilité)
  let pass1 = 0;
  const tmpMap = []; // {dir, tmp, final}
  for (const op of renameOps) {
    const src = path.join(DIRS[op.dir], op.old);
    if (!fs.existsSync(src)) continue;
    const tmpName = TMP_PREFIX + op.old;
    const tmp = path.join(DIRS[op.dir], tmpName);
    try {
      execSync(`git mv "${src}" "${tmp}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
    } catch {
      fs.renameSync(src, tmp);
    }
    tmpMap.push({ dir: op.dir, tmpName, finalName: op.new });
    pass1++;
  }
  log(`✓ Pass 1 (→ tmp) : ${pass1} fichiers`);

  // Passe 2 : __tmp_old → new
  let pass2 = 0;
  for (const t of tmpMap) {
    const tmp = path.join(DIRS[t.dir], t.tmpName);
    const final = path.join(DIRS[t.dir], t.finalName);
    try {
      execSync(`git mv "${tmp}" "${final}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
    } catch {
      fs.renameSync(tmp, final);
    }
    pass2++;
  }
  log(`✓ Pass 2 (tmp → final) : ${pass2} fichiers`);

  // 4. MAJ batch-export-all.js
  await updateBatchExport(planData);

  // 5. MAJ Site/app/infographies/page.tsx
  await updateInfographiesPage(planData);

  // 6. MAJ Notion (best-effort, ne plante pas si erreur)
  try {
    await updateNotion(planData);
  } catch (e) {
    log(`⚠ Notion update partiellement échoué: ${e.message}`);
  }

  // 7. MAJ inspect-references.js (MIN_ID)
  await updateInspectReferences(planData);

  // 8. Cleanup notion-reupload-images.js (mappings hardcodés obsolètes)
  await cleanupNotionReupload();

  log('✓ Apply terminé.');
}

async function updateBatchExport(planData) {
  const src = fs.readFileSync(BATCH_EXPORT_FILE, 'utf8');
  const oldToNewHtml = {};
  for (const r of planData.renames) oldToNewHtml[r.old_html] = r.new_html;
  const oldToNewBase = {};
  for (const r of planData.renames) {
    for (const br of r.base_renames) oldToNewBase[br.oldBase] = br.newBase;
  }
  const archivedHtml = new Set(planData.archives.map(a => a.old_html));

  // Récupère toutes les entrées
  const m = src.match(/(const INFOGRAPHICS = \[)([\s\S]*?)(\n\];)/);
  if (!m) throw new Error('INFOGRAPHICS array introuvable');
  const inner = m[2];

  const entries = [];
  const re = /\['([^']+)',\s*(\d+),\s*'([^']+)'\],?/g;
  let mm;
  while ((mm = re.exec(inner)) !== null) {
    const htmlFile = mm[1];
    const idx = parseInt(mm[2], 10);
    const baseName = mm[3];

    if (archivedHtml.has(htmlFile)) {
      log(`  - removed (archived): ${htmlFile}`);
      continue;
    }
    const newHtml = oldToNewHtml[htmlFile];
    const newBase = oldToNewBase[baseName];
    if (newHtml && newBase) {
      entries.push(`  ['${newHtml}', ${idx}, '${newBase}'],`);
    } else if (newHtml) {
      entries.push(`  ['${newHtml}', ${idx}, '${baseName}'],`);
      log(`  ⚠ baseName non mappé: ${baseName}`);
    } else {
      // Garde tel quel si pas dans le mapping (sans risque)
      entries.push(`  ['${htmlFile}', ${idx}, '${baseName}'],`);
      log(`  ⚠ htmlFile non mappé: ${htmlFile}`);
    }
  }

  // Trie par num croissant pour propreté
  entries.sort((a, b) => {
    const na = parseInt(a.match(/'(\d+)/)?.[1] || '0', 10);
    const nb = parseInt(b.match(/'(\d+)/)?.[1] || '0', 10);
    if (na !== nb) return na - nb;
    return a.localeCompare(b);
  });

  const newInner = '\n' + entries.join('\n') + '\n';
  const newSrc = src.replace(m[0], `${m[1]}${newInner}${m[3]}`);
  fs.writeFileSync(BATCH_EXPORT_FILE, newSrc);
  log(`✓ batch-export-all.js: ${entries.length} entrées`);
}

async function updateInfographiesPage(planData) {
  const src = fs.readFileSync(INFOGRAPHIES_PAGE, 'utf8');
  const oldToNewBase = {};
  for (const r of planData.renames) {
    for (const br of r.base_renames) oldToNewBase[br.oldBase] = br.newBase;
  }

  // Pour chaque entrée { id, filename } :
  // filename = "{base}-instagram.png" → cherche oldToNewBase[base], remplace
  // id = num du fichier nouveau
  let updated = src;
  let count = 0;
  let removed = 0;

  // Parse toutes les entrées { id: '...', title: '...', category: '...', filename: '...-instagram.png' }
  const entryRe = /(\{\s*id:\s*'([^']+)',\s*title:\s*"[^"]*",\s*category:\s*'[^']*',\s*filename:\s*'([^']+)'\s*\},?)/g;
  const replacements = [];
  let mm;
  while ((mm = entryRe.exec(src)) !== null) {
    const fullMatch = mm[1];
    const id = mm[2];
    const filename = mm[3];
    const base = filename.replace(/-instagram\.png$/, '');
    const newBase = oldToNewBase[base];
    if (newBase) {
      const newFilename = `${newBase}-instagram.png`;
      const newNum = newBase.match(/^(\d+)/)?.[1] || id;
      let replacement = fullMatch
        .replace(`filename: '${filename}'`, `filename: '${newFilename}'`)
        .replace(`id: '${id}'`, `id: '${newNum}'`);
      replacements.push({ from: fullMatch, to: replacement });
      count++;
    } else {
      log(`  ⚠ infographies/page.tsx: pas de mapping pour ${filename}`);
    }
  }
  for (const { from, to } of replacements) {
    updated = updated.replace(from, to);
  }
  fs.writeFileSync(INFOGRAPHIES_PAGE, updated);
  log(`✓ infographies/page.tsx: ${count} entrées mises à jour`);
}

async function updateNotion(planData) {
  log('Notion update…');
  const updates = planData.notion_updates.filter(u => u.status === 'mapped');
  let ok = 0;
  let err = 0;
  for (const u of updates) {
    try {
      await notion.pages.update({
        page_id: u.page_id,
        properties: { 'N°': { number: u.n_new } },
      });
      ok++;
      // Rate-limit ~3 req/s
      await new Promise(r => setTimeout(r, 350));
    } catch (e) {
      err++;
      log(`  ⚠ Notion ${u.page_id} (N°${u.n_old}→${u.n_new}): ${e.message}`);
    }
  }
  log(`✓ Notion: ${ok} OK, ${err} erreurs`);
}

async function updateInspectReferences(planData) {
  if (!fs.existsSync(INSPECT_REFS_FILE)) return;
  const src = fs.readFileSync(INSPECT_REFS_FILE, 'utf8');
  // MIN_ID était à 215 (zone récente). On garde ratio : ~80% des actifs.
  const newMin = Math.max(1, Math.floor(planData.stats.actives * 0.8));
  const updated = src.replace(/const MIN_ID = \d+/, `const MIN_ID = ${newMin}`);
  if (updated !== src) {
    fs.writeFileSync(INSPECT_REFS_FILE, updated);
    log(`✓ inspect-references.js: MIN_ID = ${newMin}`);
  }
}

async function cleanupNotionReupload() {
  if (!fs.existsSync(NOTION_REUPLOAD_FILE)) return;
  const src = fs.readFileSync(NOTION_REUPLOAD_FILE, 'utf8');
  // Cherche un objet de mappings hardcodés du type "'118-...': 118," et le commente
  // Conservatif : on n'écrit pas si le pattern n'existe pas.
  const re = /'\d+\-[^']+':\s*\d+,?/g;
  const matches = src.match(re);
  if (!matches || matches.length === 0) return;
  log(`  notion-reupload-images.js: ${matches.length} mappings hardcodés détectés (laissés tels quels — à nettoyer manuellement)`);
}

// ─── Verify ─────────────────────────────────────────────────────────────────

async function verify() {
  log('=== VERIFY ===');
  const planData = loadPlan();
  let issues = 0;

  // 1. Pour chaque rename, le HTML cible existe
  for (const r of planData.renames) {
    const target = path.join(DIRS.html, r.new_html);
    if (!fs.existsSync(target)) {
      console.log(`  ✗ Manquant: ${r.new_html}`);
      issues++;
    }
  }
  console.log(`  HTML manquants : ${issues}`);

  // 2. batch-export-all.js : chaque htmlFile listé existe
  const beEntries = readBatchExportInfographics();
  let beMissing = 0;
  for (const e of beEntries) {
    if (!fs.existsSync(path.join(DIRS.html, e.htmlFile))) beMissing++;
  }
  console.log(`  batch-export-all.js entrées orphelines : ${beMissing}`);

  // 3. Notion : sample 5 pages mappées, vérifier que le PNG insta existe
  const mapped = planData.notion_updates.filter(u => u.status === 'mapped').slice(0, 5);
  console.log(`  Échantillon Notion (${mapped.length} pages) : check à faire manuellement`);

  return { issues, beMissing };
}

// ─── Rollback ───────────────────────────────────────────────────────────────

async function rollback() {
  log('=== ROLLBACK ===');
  const planData = loadPlan();
  const ops = buildOperations(planData);

  // Inverse les renommages : new → old
  // Inverse les archives : _archives/old → old
  let count = 0;
  for (const op of ops.filter(o => o.kind === 'rename').reverse()) {
    const src = path.join(DIRS[op.dir], op.new);
    const dst = path.join(DIRS[op.dir], op.old);
    if (!fs.existsSync(src)) continue;
    try {
      execSync(`git mv "${src}" "${dst}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
    } catch {
      fs.renameSync(src, dst);
    }
    count++;
  }
  log(`✓ Renommages inversés : ${count}`);

  // Désarchive
  let unarchived = 0;
  for (const op of ops.filter(o => o.kind === 'archive')) {
    const src = path.join(DIRS[op.dir], '_archives', op.old);
    const dst = path.join(DIRS[op.dir], op.old);
    if (!fs.existsSync(src)) continue;
    try {
      execSync(`git mv "${src}" "${dst}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
    } catch {
      fs.renameSync(src, dst);
    }
    unarchived++;
  }
  log(`✓ Archives restaurées : ${unarchived}`);

  // Restore batch-export-all.js et infographies/page.tsx via git
  try {
    execSync(`git checkout HEAD -- "${BATCH_EXPORT_FILE}" "${INFOGRAPHIES_PAGE}" "${INSPECT_REFS_FILE}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
    log(`✓ Fichiers texte restaurés via git`);
  } catch (e) {
    log(`⚠ git checkout échoué: ${e.message}`);
  }

  // Restore Notion (inversion des mises à jour mappées)
  log('Restauration Notion…');
  let ok = 0;
  for (const u of planData.notion_updates.filter(u => u.status === 'mapped')) {
    try {
      await notion.pages.update({
        page_id: u.page_id,
        properties: { 'N°': { number: u.n_old } },
      });
      ok++;
      await new Promise(r => setTimeout(r, 350));
    } catch (e) {
      log(`  ⚠ Notion rollback ${u.page_id}: ${e.message}`);
    }
  }
  log(`✓ Notion restauré: ${ok}`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const cmd = process.argv[2];
  switch (cmd) {
    case '--audit':
      await audit();
      break;
    case '--plan':
      await plan();
      break;
    case '--dry-run':
      await dryRun();
      break;
    case '--apply':
      await apply();
      break;
    case '--verify':
      await verify();
      break;
    case '--rollback':
      await rollback();
      break;
    default:
      console.error('Usage: node renumber-infographics.js [--audit|--plan|--dry-run|--apply|--verify|--rollback]');
      process.exit(1);
  }
}

main().catch(err => {
  console.error('✗ Erreur:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Synchronise le Calendrier Publications Notion avec les infographies permanentes locales.
 * Pour chaque N° manquant : upload du PNG (Image + Insta 1), création de l'entrée
 * (N°, titre depuis <title> du HTML, thème inféré, statut Publié).
 *
 * Usage :
 *   node notion-sync-missing-infographics.js "4 37 162 ..."   # liste de N° explicite
 *   node notion-sync-missing-infographics.js --dry-run "..."   # sans écrire dans Notion
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const glob = (dir, re) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => re.test(f)) : []);

const cfgFile = JSON.parse(fs.readFileSync(path.join(__dirname, "notion-config.json"), "utf8"));
const cfg = Object.fromEntries(Object.entries(cfgFile).map(([k, v]) => [k, process.env[k] || v]));
const SECRET = cfg.NOTION_SECRET;
const DB_ID = cfg.PUBLICATIONS_DB_ID;

const ROOT = path.join(__dirname, "..", "..", "Production interne", "Réseaux Sociaux ", "Infographies");
const IMGDIR = path.join(ROOT, "Insta & Autres");
const HTMLDIR = path.join(ROOT, "Sources HTML");

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const nums = args.filter((a) => /^\d+$/.test(a)).map(Number);
const listArg = args.find((a) => /^[\d ]+$/.test(a) && a.includes(" "));
const NUMBERS = nums.length ? nums : (listArg ? listArg.trim().split(/\s+/).map(Number) : []);
if (!NUMBERS.length) { console.error("Aucun N° fourni."); process.exit(1); }

// ── Inférence de thème par mots-clés (ordre = priorité) ──────────────────────
const THEME_RULES = [
  [/immobil|logement|loyer|foncier|hlm/i, "Immobilier"],
  [/bourse|cac ?40|s&p|nasdaq|dividende|\betf\b|action(s|nariat)?|capitalisation boursi/i, "Bourse"],
  [/impôt|impot|taxe|fiscal|fiscalit|prélèvement|prelevement|\btva\b|cotisation|enfer fiscal|niche/i, "Impots"],
  [/dette|déficit|deficit|intérêts|interets|emprunt|faillite|notation|s&p ?\/|moody/i, "Dette"],
  [/retraite|pension|capitalisation|répartition|repartition|cotisant/i, "Finances publiques"],
  [/dépense|depense|budget|fonctionnaire|état gaspille|etat gaspille|sécu|secu|hôpital|hopital|école|ecole|éducation|education|santé|sante|allocation|protection sociale|subvention|mairie|commune|collectivit/i, "Finances publiques"],
  [/investiss|épargne|epargne|fonds de pension|or\b|crypto/i, "Investissement"],
  [/\bpib\b|croissance|inflation|chômage|chomage|emploi|industri|salaire|productivit|fécondit|fecondit|espérance de vie|esperance de vie|démograph|demograph/i, "Macro-economie"],
  [/monde|pays|europe|ocde|comparaison|international|suisse|dubaï|dubai|londres|allemagne|chine|états-unis|etats-unis|singapour|argentine|guyana/i, "International"],
];
function inferTheme(title) {
  for (const [re, theme] of THEME_RULES) if (re.test(title)) return theme;
  return "Actualite eco";
}

function findImage(n) {
  const files = glob(IMGDIR, new RegExp(`^${n}-.*\\.png$`));
  if (!files.length) return null;
  const insta = files.find((f) => /instagram\.png$/.test(f));
  return path.join(IMGDIR, insta || files[0]);
}
function findTitle(n) {
  const files = glob(HTMLDIR, new RegExp(`^${n}-.*\\.html$`));
  if (!files.length) return null;
  const html = fs.readFileSync(path.join(HTMLDIR, files[0]), "utf8");
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  const raw = m ? m[1] : files[0].replace(/^\d+-/, "").replace(/\.html$/, "").replace(/-/g, " ");
  return raw
    .replace(/<[^>]+>/g, " ")            // supprime le markup HTML
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&euro;/g, "€")
    .replace(/\s+/g, " ").trim();
}

function uploadFile(filePath) {
  const filename = path.basename(filePath);
  const createRes = JSON.parse(execSync(
    `curl -s -X POST "https://api.notion.com/v1/file_uploads" ` +
    `-H "Authorization: Bearer ${SECRET}" -H "Content-Type: application/json" ` +
    `-H "Notion-Version: 2022-06-28" ` +
    `-d '{"mode":"single_part","filename":${JSON.stringify(filename)},"content_type":"image/png"}'`,
    { encoding: "utf8", timeout: 20000 }));
  if (createRes.object === "error") throw new Error(`create: ${createRes.message}`);
  const sendRes = JSON.parse(execSync(
    `curl -s -X POST "https://api.notion.com/v1/file_uploads/${createRes.id}/send" ` +
    `-H "Authorization: Bearer ${SECRET}" -H "Notion-Version: 2022-06-28" ` +
    `-F "file=@${filePath};type=image/png"`,
    { encoding: "utf8", timeout: 90000 }));
  if (sendRes.status !== "uploaded") throw new Error(`send: ${sendRes.message || sendRes.status}`);
  return createRes.id;
}

function createPage(meta, uploadId) {
  const entry = { type: "file_upload", file_upload: { id: uploadId }, name: path.basename(meta.image) };
  const props = {
    Name: { title: [{ text: { content: meta.titre.slice(0, 2000) } }] },
    "N°": { number: meta.numero },
    Statut: { select: { name: "Publie" } },
    Theme: { select: { name: meta.theme } },
    Image: { files: [entry] },
    "Insta 1": { files: [{ ...entry }] },
  };
  const body = JSON.stringify({ parent: { database_id: DB_ID }, properties: props });
  const payloadFile = path.join(require("os").tmpdir(), `notion-body-${meta.numero}.json`);
  fs.writeFileSync(payloadFile, body);
  const res = JSON.parse(execSync(
    `curl -s -X POST "https://api.notion.com/v1/pages" ` +
    `-H "Authorization: Bearer ${SECRET}" -H "Content-Type: application/json" ` +
    `-H "Notion-Version: 2022-06-28" -d @${payloadFile}`,
    { encoding: "utf8", timeout: 25000 }));
  fs.unlinkSync(payloadFile);
  if (res.object === "error") throw new Error(`page: ${res.message}`);
  return res;
}

const ok = [], skipped = [], failed = [];
for (const n of NUMBERS) {
  const image = findImage(n);
  const titre = findTitle(n);
  if (!image) { skipped.push([n, "pas de PNG"]); console.log(`⚠︎  ${n} : pas de PNG, ignoré`); continue; }
  const finalTitle = titre || `Infographie ${n}`;
  const theme = inferTheme(finalTitle);
  if (DRY) { console.log(`[dry] ${n} · ${theme} · ${finalTitle}`); ok.push(n); continue; }
  try {
    const uploadId = uploadFile(image);
    const page = createPage({ numero: n, titre: finalTitle, theme, image }, uploadId);
    ok.push(n);
    console.log(`✅ ${n} · ${theme} · ${finalTitle}`);
  } catch (e) {
    failed.push([n, e.message]);
    console.log(`❌ ${n} : ${e.message}`);
  }
}
console.log(`\n── Bilan : ${ok.length} ajoutées · ${skipped.length} ignorées · ${failed.length} échecs ──`);
if (failed.length) console.log("Échecs :", failed.map((f) => f[0]).join(" "));

#!/usr/bin/env node
/**
 * Génère le texte d'accompagnement LinkedIn (voix Emmanuel Blézès) pour des
 * infographies, à partir du contenu réel de leur HTML source, et l'écrit dans
 * le champ `LinkedIn` du Calendrier Publications Notion (matché par N°).
 *
 * Usage :
 *   node notion-generate-linkedin.js "157 158 162 ..."         # écrit dans Notion
 *   node notion-generate-linkedin.js --dry-run "162 216"        # affiche sans écrire
 *   node notion-generate-linkedin.js --force "162"              # regénère même si LinkedIn déjà rempli
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const cfgFile = JSON.parse(fs.readFileSync(path.join(__dirname, "notion-config.json"), "utf8"));
const cfg = Object.fromEntries(Object.entries(cfgFile).map(([k, v]) => [k, process.env[k] || v]));
const SECRET = cfg.NOTION_SECRET;
const DB_ID = cfg.PUBLICATIONS_DB_ID;
const API_KEY = process.env.ANTHROPIC_API_KEY || cfg.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-5";

const ROOT = path.join(__dirname, "..", "..", "Production interne", "Réseaux Sociaux ", "Infographies");
const HTMLDIR = path.join(ROOT, "Sources HTML");

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry-run");
const FORCE = argv.includes("--force");
const listArg = argv.filter((a) => !a.startsWith("--")).join(" ");
const NUMBERS = listArg.trim().split(/\s+/).filter(Boolean).map(Number);
if (!NUMBERS.length) { console.error("Aucun N° fourni."); process.exit(1); }

// Slides utilitaires à ne pas transformer en post
const SKIP_RE = /(^|\W)(CTA|Partage|Abonne|abonn[ée]s?|WTF|Logo|ouvalargent\.com|gross\b|Tax System|how much|Total cost of|finanzia lo Stato|100 jours)/i;

// ── Voix de référence (extraits réels LinkedIn d'Emmanuel) ───────────────────
const VOICE_EXAMPLES = `EXEMPLE 1 :
Lee Kuan Yew, dirigeant visionnaire, a transformé Singapour, petit port pauvre d'un pays sans ressources, en l'une des économies les plus prospères au monde.

En 1994, la richesse par habitant de la cité-État a dépassé celle de la France.

Et les Singapouriens sont désormais 2x plus riches que les Français.

Pourquoi cette réussite spectaculaire ?

- fiscalité attractive : IS à 17%, 0 impôt sur les plus-values ni sur les dividendes
- un port franc devenu le 2e hub maritime mondial
- une ouverture totale aux investissements étrangers et aux talents
- une administration efficace, méritocratique et peu bureaucratique.

Un exemple dont on devrait s'inspirer.

➡️ Où va l'argent ?

EXEMPLE 2 :
Le projet de budget prévoit près de 14 Md€ de hausses de prélèvements obligatoires. Et 28 Md€ de hausse des dépenses.

Je rappelle que la France est déjà un des pays les plus fiscalisés et socialisés au monde :
- imposition : 46% du PIB
- dépenses publiques : 57%.

On saluera l'ingéniosité fiscale, jusque dans ses moindres recoins :
- impôts sur les salaires étudiants
- taxe sur les petits colis.

➡️ Où va l'argent ?

EXEMPLE 3 :
Puisque la nouvelle idée à la mode est l'augmentation de la flat tax (de 30% à 36%), je rappelle deux choses :

- la flat tax française est déjà parmi les plus élevées : Italie 26%, Irlande 20%, Pays-Bas 15%, Singapour 0% ;
- un dividende est taxé une première fois par l'IS à 25%, puis une deuxième fois à 30% à la distribution.

Sur 100€ de bénéfice, l'État prend 47,5€ !

Quand arrête-t-on ce délire ?`;

function htmlContent(n) {
  const files = (fs.existsSync(HTMLDIR) ? fs.readdirSync(HTMLDIR) : []).filter((f) => new RegExp(`^${n}-.*\\.html$`).test(f));
  if (!files.length) return null;
  const raw = fs.readFileSync(path.join(HTMLDIR, files[0]), "utf8");
  const title = (raw.match(/<title>([\s\S]*?)<\/title>/i) || [, ""])[1];
  const text = raw
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&euro;/g, "€")
    .replace(/\s+/g, " ").trim();
  return { title: title.replace(/<[^>]+>/g, "").trim(), text: text.slice(0, 2500), file: files[0] };
}

async function askClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 1200, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return (data.content?.[0]?.text || "").trim();
}

function buildPrompt(info) {
  return `Tu écris un post LinkedIn dans la voix EXACTE d'Emmanuel Blézès, fondateur du média économique « Où va l'argent ? » (ligne éditoriale libérale, pro-business).

VOIX DE RÉFÉRENCE (imite le ton, la structure, la densité de chiffres) :
${VOICE_EXAMPLES}

RÈGLE ABSOLUE — ZÉRO CHIFFRE INVENTÉ :
- Tu n'as le DROIT d'utiliser QUE les chiffres, pays, années, pourcentages, montants et comparaisons qui figurent LITTÉRALEMENT dans le bloc « Contenu » ci-dessous.
- INTERDICTION formelle d'ajouter un chiffre, un pays, un exemple, une donnée « de culture générale » ou une comparaison qui n'est pas écrite dans ce contenu — même si tu penses la connaître.
- Si la matière est mince, fais un post COURT plutôt que d'inventer. Un post de 60 mots 100% exact vaut mieux qu'un post de 200 mots avec un chiffre faux.
- Tu peux reformuler, mettre en perspective et donner ton angle libéral, mais SANS jamais introduire de nouvelle donnée chiffrée.

AUTRES RÈGLES :
- Accroche courte qui pose le sujet avec le chiffre le plus fort de l'infographie.
- Corps aéré (une ligne vide entre chaque bloc), puces « - » avec les chiffres exacts de la slide.
- Utilise une section « ➡️ » pour un point-clé ou la mise en perspective. Termine par « ➡️ Où va l'argent ? ».
- Ton : diagnostic d'expert, engagé, libéral assumé (excès d'État/impôts), sans agressivité, sans morale générique.
- Cite la source si elle apparaît dans le contenu. Pas de hashtags, pas de titre. Renvoie UNIQUEMENT le texte du post.

INFOGRAPHIE :
Titre : ${info.title}
Contenu (texte brut de la slide, contient les chiffres, labels et source) :
${info.text}`;
}

// ── Notion : map N° -> page_id ───────────────────────────────────────────────
function fetchPageMap() {
  const map = {};
  let cursor = null;
  do {
    const body = JSON.stringify(cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 });
    const bf = path.join(os.tmpdir(), "notion-q.json");
    fs.writeFileSync(bf, body);
    const res = JSON.parse(execSync(
      `curl -s -X POST "https://api.notion.com/v1/databases/${DB_ID}/query" ` +
      `-H "Authorization: Bearer ${SECRET}" -H "Content-Type: application/json" ` +
      `-H "Notion-Version: 2022-06-28" -d @${bf}`,
      { encoding: "utf8", timeout: 30000 }));
    fs.unlinkSync(bf);
    if (res.object === "error") throw new Error(res.message);
    for (const p of res.results) {
      const num = p.properties?.["N°"]?.number;
      const li = p.properties?.LinkedIn?.rich_text?.map((t) => t.plain_text).join("") || "";
      if (num != null && !(num in map)) map[num] = { id: p.id, hasLinkedIn: li.trim().length > 0 };
    }
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return map;
}

function richText(txt) {
  const chunks = [];
  let s = String(txt);
  while (s.length > 1900) { let c = s.lastIndexOf("\n", 1900); if (c < 1000) c = 1900; chunks.push(s.slice(0, c)); s = s.slice(c); }
  if (s) chunks.push(s);
  return chunks.map((c) => ({ text: { content: c } }));
}

function setLinkedIn(pageId, text) {
  const body = JSON.stringify({ properties: { LinkedIn: { rich_text: richText(text) } } });
  const bf = path.join(os.tmpdir(), `notion-li-${pageId.slice(0, 8)}.json`);
  fs.writeFileSync(bf, body);
  const res = JSON.parse(execSync(
    `curl -s -X PATCH "https://api.notion.com/v1/pages/${pageId}" ` +
    `-H "Authorization: Bearer ${SECRET}" -H "Content-Type: application/json" ` +
    `-H "Notion-Version: 2022-06-28" -d @${bf}`,
    { encoding: "utf8", timeout: 25000 }));
  fs.unlinkSync(bf);
  if (res.object === "error") throw new Error(res.message);
}

(async () => {
  const pageMap = DRY ? {} : fetchPageMap();
  const ok = [], skipped = [], failed = [];
  for (const n of NUMBERS) {
    const info = htmlContent(n);
    if (!info) { skipped.push([n, "pas de HTML"]); console.log(`⚠︎  ${n} : pas de HTML`); continue; }
    if (SKIP_RE.test(info.title)) { skipped.push([n, "slide utilitaire"]); console.log(`⏭  ${n} : utilitaire (${info.title})`); continue; }
    const page = pageMap[n];
    if (!DRY && !page) { skipped.push([n, "pas dans Notion"]); console.log(`⚠︎  ${n} : introuvable dans Notion`); continue; }
    if (!DRY && page.hasLinkedIn && !FORCE) { skipped.push([n, "LinkedIn déjà rempli"]); console.log(`⏭  ${n} : LinkedIn déjà rempli`); continue; }
    try {
      const post = await askClaude(buildPrompt(info));
      if (DRY) { console.log(`\n===== ${n} · ${info.title} =====\n${post}\n`); ok.push(n); continue; }
      setLinkedIn(page.id, post);
      ok.push(n);
      console.log(`✅ ${n} · ${info.title}`);
    } catch (e) {
      failed.push([n, e.message]);
      console.log(`❌ ${n} : ${e.message}`);
    }
  }
  console.log(`\n── Bilan : ${ok.length} générés · ${skipped.length} ignorés · ${failed.length} échecs ──`);
  if (failed.length) console.log("Échecs :", failed.map((f) => f.join(":")).join(" | "));
})();

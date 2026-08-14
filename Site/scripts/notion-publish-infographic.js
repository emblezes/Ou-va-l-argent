#!/usr/bin/env node
/**
 * Publie une infographie dans le Calendrier Publications Notion :
 *   - crée l'entrée (titre, thème, type, statut, date, source, textes LinkedIn/Insta/Twitter/Facebook)
 *   - uploade le PNG dans les champs « Image » ET « Insta 1 » (API file_uploads native)
 *
 * Usage :
 *   node notion-publish-infographic.js meta.json
 * où meta.json = {
 *   "image": "/chemin/vers/infographie.png",
 *   "titre": "...", "theme": "Dette", "type": "Comparaison", "statut": "Pret",
 *   "date": null, "source": "...",
 *   "instagram": "...", "linkedin": "...", "twitter": "...", "facebook": "..."
 * }
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "notion-config.json");
const fileCfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
const cfg = Object.fromEntries(Object.entries(fileCfg).map(([k, v]) => [k, process.env[k] || v]));
const SECRET = cfg.NOTION_SECRET;
const DB_ID = cfg.PUBLICATIONS_DB_ID;

function uploadFile(filePath) {
  const filename = path.basename(filePath);
  const createRes = JSON.parse(execSync(
    `curl -s -X POST "https://api.notion.com/v1/file_uploads" ` +
    `-H "Authorization: Bearer ${SECRET}" -H "Content-Type: application/json" ` +
    `-H "Notion-Version: 2022-06-28" ` +
    `-d '{"mode":"single_part","filename":"${filename}","content_type":"image/png"}'`,
    { encoding: "utf8", timeout: 15000 }));
  if (createRes.object === "error") throw new Error(`create: ${createRes.message}`);

  const sendRes = JSON.parse(execSync(
    `curl -s -X POST "https://api.notion.com/v1/file_uploads/${createRes.id}/send" ` +
    `-H "Authorization: Bearer ${SECRET}" -H "Notion-Version: 2022-06-28" ` +
    `-F "file=@${filePath};type=image/png"`,
    { encoding: "utf8", timeout: 60000 }));
  if (sendRes.status !== "uploaded") throw new Error(`send: ${sendRes.message || sendRes.status}`);
  return createRes.id;
}

// Découpe un texte long en blocs rich_text de <= 1900 caractères (limite Notion : 2000/bloc)
function richText(txt) {
  const chunks = [];
  let s = String(txt);
  while (s.length > 1900) {
    let cut = s.lastIndexOf("\n", 1900);
    if (cut < 1000) cut = 1900;
    chunks.push(s.slice(0, cut));
    s = s.slice(cut);
  }
  if (s) chunks.push(s);
  return chunks.map((c) => ({ text: { content: c } }));
}

function buildProps(meta, uploadId) {
  const props = { Name: { title: [{ text: { content: meta.titre } }] } };
  if (meta.numero != null) props["N°"] = { number: meta.numero };
  if (meta.date) props.Date = { date: { start: meta.date } };
  if (meta.theme) props.Theme = { select: { name: meta.theme } };
  if (meta.statut) props.Statut = { select: { name: meta.statut } };
  if (meta.linkedin) props.LinkedIn = { rich_text: richText(meta.linkedin) };
  if (meta.twitter) props.Twitter = { rich_text: [{ text: { content: meta.twitter.slice(0, 280) } }] };
  if (meta.instagram) props.Instagram = { rich_text: richText(meta.instagram) };
  if (meta.facebook) props.Facebook = { rich_text: richText(meta.facebook) };
  if (uploadId) {
    const entry = { type: "file_upload", file_upload: { id: uploadId }, name: path.basename(meta.image) };
    props.Image = { files: [entry] };
    props["Insta 1"] = { files: [{ ...entry }] };
  }
  return props;
}

function createPage(meta, uploadId) {
  const props = buildProps(meta, uploadId);
  const isUpdate = !!meta.page_id;
  const url = isUpdate
    ? `https://api.notion.com/v1/pages/${meta.page_id}`
    : `https://api.notion.com/v1/pages`;
  const body = isUpdate ? { properties: props } : { parent: { database_id: DB_ID }, properties: props };
  const payload = JSON.stringify(body).replace(/'/g, "'\\''");
  const res = JSON.parse(execSync(
    `curl -s -X ${isUpdate ? "PATCH" : "POST"} "${url}" ` +
    `-H "Authorization: Bearer ${SECRET}" -H "Content-Type: application/json" ` +
    `-H "Notion-Version: 2022-06-28" -d '${payload}'`,
    { encoding: "utf8", timeout: 20000 }));
  if (res.object === "error") throw new Error(`page: ${res.message}`);
  return res;
}

function main() {
  const metaPath = process.argv[2];
  if (!metaPath) { console.error("Usage: node notion-publish-infographic.js meta.json"); process.exit(1); }
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  if (!meta.image || !fs.existsSync(meta.image)) { console.error("Image introuvable:", meta.image); process.exit(1); }

  console.log(`↑ Upload image : ${path.basename(meta.image)}`);
  const uploadId = uploadFile(meta.image);
  console.log(`✎ Création entrée : "${meta.titre}"`);
  const page = createPage(meta, uploadId);
  console.log(`✅ Publié dans Notion : ${page.url}`);
}
main();

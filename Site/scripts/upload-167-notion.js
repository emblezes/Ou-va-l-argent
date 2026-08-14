#!/usr/bin/env node
/**
 * Upload infographie 167 (Socialiste / Libéral — pyramide) vers Notion Calendrier Publications
 * Crée l'entrée + uploade le PNG dans Insta 1 et Image. Statut "Idee" (pas de publi auto).
 */
const { Client } = require("@notionhq/client");
const { execSync } = require("child_process");
const path = require("path");

const notion = new Client({ auth: process.env.NOTION_SECRET });
const DB_ID = "9354599f-662f-45b2-8070-b41332bdd79d";

const FILE = path.join(
  __dirname,
  "../../Production interne/Réseaux Sociaux /Infographies/Insta & Autres/167-socialiste-liberal-pyramide.png"
);

const CAPTION = `Socialiste ou libéral ? Place-toi sur l'échelle 👇

18 mesures vraiment défendues dans le débat français, du « revenu universel » à « l'État régalien ».
Tu t'arrêtes à quelle barre ? 🔴🔵 Dis-le en commentaire.

💶 @ouvalargent — où va vraiment ton argent.
#économie #politique #france #impôts #budget #socialisme #libéralisme`;

async function uploadFile(filePath) {
  const filename = path.basename(filePath);
  console.log(`  Uploading ${filename}...`);
  const createRes = JSON.parse(execSync(
    `curl -s -X POST "https://api.notion.com/v1/file_uploads" ` +
    `-H "Authorization: Bearer ${process.env.NOTION_SECRET}" ` +
    `-H "Content-Type: application/json" ` +
    `-H "Notion-Version: 2022-06-28" ` +
    `-d '{"mode":"single_part","filename":"${filename}","content_type":"image/png"}'`,
    { encoding: "utf8", timeout: 15000 }
  ));
  if (createRes.object === "error") throw new Error(`Create failed: ${createRes.message}`);

  const sendRes = JSON.parse(execSync(
    `curl -s -X POST "https://api.notion.com/v1/file_uploads/${createRes.id}/send" ` +
    `-H "Authorization: Bearer ${process.env.NOTION_SECRET}" ` +
    `-H "Notion-Version: 2022-06-28" ` +
    `-F "file=@${filePath};type=image/png"`,
    { encoding: "utf8", timeout: 60000 }
  ));
  if (sendRes.status !== "uploaded") throw new Error(`Send failed: ${sendRes.message || sendRes.status}`);
  return createRes.id;
}

function fileEntry(uploadId, filename) {
  return { type: "file_upload", file_upload: { id: uploadId }, name: filename };
}

async function main() {
  console.log("=== Upload 167 — Socialiste / Libéral ===\n");

  const page = await notion.pages.create({
    parent: { database_id: DB_ID },
    properties: {
      "Name": { title: [{ text: { content: "Socialiste ou libéral ? — pyramide des propositions" } }] },
      "Theme": { select: { name: "Finances publiques" } },
      "Statut": { select: { name: "Idee" } },
      "Instagram": { rich_text: [{ text: { content: CAPTION } }] },
    },
  });
  console.log(`Page créée : ${page.url}\n`);

  const id = await uploadFile(FILE);
  await notion.pages.update({
    page_id: page.id,
    properties: {
      "Image": { files: [fileEntry(id, path.basename(FILE))] },
      "Insta 1": { files: [fileEntry(id, path.basename(FILE))] },
    },
  });

  console.log("\n✅ Fait — image dans Image + Insta 1, caption Instagram remplie, statut « Idee ».");
  console.log(`   ${page.url}`);
}

main().catch(err => { console.error("Error:", err.message); process.exit(1); });

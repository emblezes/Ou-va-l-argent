#!/usr/bin/env node
/**
 * Upload carousel 127 (Intermittents) to Notion Calendrier Publications
 * - Insta 1-5: 5 slides Instagram
 * - Image: slide 1 Instagram (for LinkedIn/FB)
 * - Image TikTok V: slide 1 TikTok vertical
 * - Image TikTok H: slide 1 TikTok horizontal
 */

const { Client } = require("@notionhq/client");
const { execSync } = require("child_process");
const path = require("path");

const notion = new Client({ auth: process.env.NOTION_SECRET });
const DB_ID = "9354599f-662f-45b2-8070-b41332bdd79d";
const DS_ID = "683e26f0-f608-44f7-b0e7-fd296145f0f4";

const BASE = path.join(__dirname, "../../Production interne/Réseaux Sociaux /Infographies");
const INSTA_DIR = path.join(BASE, "Insta & Autres");
const TIKTOK_V_DIR = path.join(BASE, "Tiktok Vertical");
const TIKTOK_H_DIR = path.join(BASE, "Tiktok Horizontal");

const FILES = {
  insta1: path.join(INSTA_DIR, "127a-intermittents-titre-instagram.png"),
  insta2: path.join(INSTA_DIR, "127b-intermittents-154600-instagram.png"),
  insta3: path.join(INSTA_DIR, "127c-intermittents-10h-semaine-instagram.png"),
  insta4: path.join(INSTA_DIR, "127d-intermittents-deficit-instagram.png"),
  insta5: path.join(INSTA_DIR, "127e-intermittents-cta-instagram.png"),
  tiktokV: path.join(TIKTOK_V_DIR, "127a-intermittents-titre-tiktok-v.png"),
  tiktokH: path.join(TIKTOK_H_DIR, "127a-intermittents-titre-tiktok-h.png"),
};

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
  console.log("=== Upload Carousel 127 — Intermittents du spectacle ===\n");

  // Page already exists in Notion
  const pageId = "31594e12-0e7a-8143-864a-f09c0c6af879";
  console.log(`Using existing page: ${pageId}\n`);

  // 2. Upload all files
  const properties = {};

  // Insta 1 (also used as Image for LinkedIn/FB)
  const id1 = await uploadFile(FILES.insta1);
  properties["Image"] = { files: [fileEntry(id1, path.basename(FILES.insta1))] };
  properties["Insta 1"] = { files: [fileEntry(id1, path.basename(FILES.insta1))] };
  console.log("  ✓ Insta 1 + Image");

  // Insta 2
  const id2 = await uploadFile(FILES.insta2);
  properties["Insta 2"] = { files: [fileEntry(id2, path.basename(FILES.insta2))] };
  console.log("  ✓ Insta 2");

  // Insta 3
  const id3 = await uploadFile(FILES.insta3);
  properties["Insta 3"] = { files: [fileEntry(id3, path.basename(FILES.insta3))] };
  console.log("  ✓ Insta 3");

  // Insta 4
  const id4 = await uploadFile(FILES.insta4);
  properties["Insta 4"] = { files: [fileEntry(id4, path.basename(FILES.insta4))] };
  console.log("  ✓ Insta 4");

  // Insta 5
  const id5 = await uploadFile(FILES.insta5);
  properties["Insta 5"] = { files: [fileEntry(id5, path.basename(FILES.insta5))] };
  console.log("  ✓ Insta 5");

  // TikTok V (slide 1 only)
  const idTV = await uploadFile(FILES.tiktokV);
  properties["Image TikTok V"] = { files: [fileEntry(idTV, path.basename(FILES.tiktokV))] };
  console.log("  ✓ TikTok V");

  // TikTok H (slide 1 only)
  const idTH = await uploadFile(FILES.tiktokH);
  properties["Image TikTok H"] = { files: [fileEntry(idTH, path.basename(FILES.tiktokH))] };
  console.log("  ✓ TikTok H");

  // 3. Update the page with all images
  console.log("\nUpdating Notion page...");
  await notion.pages.update({
    page_id: pageId,
    properties
  });

  console.log("\n✅ Done! 7 images uploaded to Notion Calendrier Publications");
  console.log(`   Insta 1-5 : 5 slides carousel`);
  console.log(`   Image     : slide 1 (LinkedIn/FB)`);
  console.log(`   TikTok V  : slide 1`);
  console.log(`   TikTok H  : slide 1`);
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});

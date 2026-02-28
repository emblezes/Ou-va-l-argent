#!/usr/bin/env node
/**
 * Re-upload all infographic images to Notion using native File Upload API
 * Handles carousels (bis/ter/quater → Insta 2/3/4)
 *
 * Usage:
 *   node notion-reupload-images.js              # All infographies
 *   node notion-reupload-images.js --from=106    # Start from N°106
 *   node notion-reupload-images.js --only=113,114,115  # Only specific numbers
 */

const { Client } = require("@notionhq/client");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const notion = new Client({ auth: process.env.NOTION_SECRET });
const DS_ID = "c6650eb6-7c49-47b4-9bef-d322e02f5406";

const BASE = path.join(__dirname, "../../Production interne/Réseaux Sociaux /Infographies");
const DIRS = {
  instagram: path.join(BASE, "Insta & Autres"),
  tiktokV: path.join(BASE, "Tiktok Vertical"),
  tiktokH: path.join(BASE, "Tiktok Horizontal"),
};

// Parse CLI args
const args = process.argv.slice(2);
const fromArg = args.find(a => a.startsWith("--from="));
const onlyArg = args.find(a => a.startsWith("--only="));
const FROM = fromArg ? parseInt(fromArg.split("=")[1]) : 0;
const ONLY = onlyArg ? onlyArg.split("=")[1].split(",").map(Number) : null;

// Upload a file to Notion and return the upload ID
async function uploadFile(filePath) {
  const filename = path.basename(filePath);

  // Step 1: Create upload
  const createRes = JSON.parse(execSync(
    `curl -s -X POST "https://api.notion.com/v1/file_uploads" ` +
    `-H "Authorization: Bearer ${process.env.NOTION_SECRET}" ` +
    `-H "Content-Type: application/json" ` +
    `-H "Notion-Version: 2022-06-28" ` +
    `-d '{"mode":"single_part","filename":"${filename}","content_type":"image/png"}'`,
    { encoding: "utf8", timeout: 15000 }
  ));

  if (createRes.object === "error") {
    throw new Error(`Create failed: ${createRes.message}`);
  }

  // Step 2: Send file
  const sendRes = JSON.parse(execSync(
    `curl -s -X POST "https://api.notion.com/v1/file_uploads/${createRes.id}/send" ` +
    `-H "Authorization: Bearer ${process.env.NOTION_SECRET}" ` +
    `-H "Notion-Version: 2022-06-28" ` +
    `-F "file=@${filePath};type=image/png"`,
    { encoding: "utf8", timeout: 60000 }
  ));

  if (sendRes.status !== "uploaded") {
    throw new Error(`Send failed: ${sendRes.message || sendRes.status}`);
  }

  return createRes.id;
}

// Find ALL Instagram images for a given number (main + carousel slides)
// Handles two carousel patterns:
//   1. bis/ter/quater: 113-xxx.png, 113bis-xxx.png, 113ter-xxx.png, 113quater-xxx.png
//   2. a/b: 08a-xxx.png, 08b-xxx.png (a=slide1, b=slide2)
// Returns: { main: path, bis: path, ter: path, quater: path }
function findInstaImages(num, dir) {
  if (!fs.existsSync(dir)) return {};

  const files = fs.readdirSync(dir);
  const padded = String(num).padStart(2, "0");
  const numStr = String(num);

  const result = {};
  const suffix = "-instagram.png";

  for (const f of files) {
    // Pattern a/b: 08a-xxx-instagram.png → main, 08b-xxx-instagram.png → bis
    if ((f.startsWith(padded + "a-") || f.startsWith(numStr + "a-")) && f.endsWith(suffix)) {
      result.main = path.join(dir, f);
      continue;
    }
    if ((f.startsWith(padded + "b-") || f.startsWith(numStr + "b-")) && f.endsWith(suffix)) {
      result.bis = path.join(dir, f);
      continue;
    }

    // Standard main: 113-xxx-instagram.png (NOT bis/ter/quater/a/b)
    if ((f.startsWith(padded + "-") || f.startsWith(numStr + "-")) && f.endsWith(suffix)) {
      const base = f.replace(suffix, "");
      if (!base.match(/bis$|ter$|quater$/)) {
        result.main = path.join(dir, f);
      }
    }
    // bis/ter/quater patterns
    if ((f.startsWith(padded + "bis-") || f.startsWith(numStr + "bis-")) && f.endsWith(suffix)) {
      result.bis = path.join(dir, f);
    }
    if ((f.startsWith(padded + "ter-") || f.startsWith(numStr + "ter-")) && f.endsWith(suffix)) {
      result.ter = path.join(dir, f);
    }
    if ((f.startsWith(padded + "quater-") || f.startsWith(numStr + "quater-")) && f.endsWith(suffix)) {
      result.quater = path.join(dir, f);
    }
  }

  return result;
}

// Find a single image file for TikTok formats (main slide only)
// Handles both standard (08-xxx) and a/b (08a-xxx) patterns
function findImage(num, suffix, dir) {
  if (!fs.existsSync(dir)) return null;

  const padded = String(num).padStart(2, "0");
  const numStr = String(num);
  const files = fs.readdirSync(dir);
  const ending = `-${suffix}.png`;

  // Try a-pattern first (08a-xxx-tiktok-v.png)
  const aMatch = files.find(f =>
    f.endsWith(ending) &&
    (f.startsWith(padded + "a-") || f.startsWith(numStr + "a-"))
  );
  if (aMatch) return path.join(dir, aMatch);

  // Standard pattern (08-xxx-tiktok-v.png, not bis/ter/quater)
  const match = files.find(f => {
    if (!f.endsWith(ending)) return false;
    if (!f.startsWith(padded + "-") && !f.startsWith(numStr + "-")) return false;
    const base = f.replace(ending, "");
    return !base.match(/bis$|ter$|quater$/);
  });

  return match ? path.join(dir, match) : null;
}

// Find TikTok carousel images (bis/ter/quater)
function findTiktokCarouselImages(num, suffix, dir) {
  if (!fs.existsSync(dir)) return {};

  const padded = String(num).padStart(2, "0");
  const numStr = String(num);
  const files = fs.readdirSync(dir);
  const ending = `-${suffix}.png`;
  const result = {};

  for (const f of files) {
    if (!f.endsWith(ending)) continue;
    if (f.startsWith(padded + "bis-") || f.startsWith(numStr + "bis-")) result.bis = path.join(dir, f);
    if (f.startsWith(padded + "ter-") || f.startsWith(numStr + "ter-")) result.ter = path.join(dir, f);
    if (f.startsWith(padded + "quater-") || f.startsWith(numStr + "quater-")) result.quater = path.join(dir, f);
  }

  return result;
}

async function main() {
  // Get all pages
  let allPages = [];
  let cursor;
  do {
    const r = await notion.dataSources.query({
      data_source_id: DS_ID,
      start_cursor: cursor,
      page_size: 100
    });
    allPages.push(...r.results);
    cursor = r.has_more ? r.next_cursor : null;
  } while (cursor);

  // Filter to pages with a N°
  let infos = allPages
    .filter(p => p.properties["N°"]?.number != null)
    .sort((a, b) => a.properties["N°"].number - b.properties["N°"].number);

  // Apply --from filter
  if (FROM > 0) {
    infos = infos.filter(p => p.properties["N°"].number >= FROM);
    console.log(`Starting from N°${FROM}\n`);
  }

  // Apply --only filter
  if (ONLY) {
    infos = infos.filter(p => ONLY.includes(p.properties["N°"].number));
    console.log(`Only processing: ${ONLY.join(", ")}\n`);
  }

  console.log(`Found ${infos.length} infographies to process\n`);

  let success = 0, skipped = 0, errors = 0;

  for (const page of infos) {
    const num = page.properties["N°"].number;
    const name = page.properties["Name"]?.title?.map(t => t.plain_text).join("") || "???";

    // Find all Instagram images (main + carousel)
    const instaImages = findInstaImages(num, DIRS.instagram);
    const tiktokVFile = findImage(num, "tiktok-v", DIRS.tiktokV);
    const tiktokHFile = findImage(num, "tiktok-h", DIRS.tiktokH);
    const tiktokVCarousel = findTiktokCarouselImages(num, "tiktok-v", DIRS.tiktokV);
    const tiktokHCarousel = findTiktokCarouselImages(num, "tiktok-h", DIRS.tiktokH);

    const hasAnything = instaImages.main || tiktokVFile || tiktokHFile;
    if (!hasAnything) {
      console.log(`#${num} "${name}" — no image files found, skipping`);
      skipped++;
      continue;
    }

    const isCarousel = !!(instaImages.bis || instaImages.ter || instaImages.quater);
    console.log(`#${num} "${name}"${isCarousel ? " [CAROUSEL]" : ""}`);

    const properties = {};

    try {
      // Upload main Instagram image → Image + Insta 1
      if (instaImages.main) {
        const uploadId = await uploadFile(instaImages.main);
        const fileEntry = {
          type: "file_upload",
          file_upload: { id: uploadId },
          name: path.basename(instaImages.main)
        };
        properties["Image"] = { files: [fileEntry] };
        properties["Insta 1"] = { files: [{ ...fileEntry }] };
        console.log(`  ✓ Insta 1: ${path.basename(instaImages.main)}`);
      }

      // Upload carousel slide bis → Insta 2
      if (instaImages.bis) {
        const uploadId = await uploadFile(instaImages.bis);
        properties["Insta 2"] = {
          files: [{
            type: "file_upload",
            file_upload: { id: uploadId },
            name: path.basename(instaImages.bis)
          }]
        };
        console.log(`  ✓ Insta 2: ${path.basename(instaImages.bis)}`);
      }

      // Upload carousel slide ter → Insta 3
      if (instaImages.ter) {
        const uploadId = await uploadFile(instaImages.ter);
        properties["Insta 3"] = {
          files: [{
            type: "file_upload",
            file_upload: { id: uploadId },
            name: path.basename(instaImages.ter)
          }]
        };
        console.log(`  ✓ Insta 3: ${path.basename(instaImages.ter)}`);
      }

      // Upload carousel slide quater → Insta 4
      if (instaImages.quater) {
        const uploadId = await uploadFile(instaImages.quater);
        properties["Insta 4"] = {
          files: [{
            type: "file_upload",
            file_upload: { id: uploadId },
            name: path.basename(instaImages.quater)
          }]
        };
        console.log(`  ✓ Insta 4: ${path.basename(instaImages.quater)}`);
      }

      // Upload TikTok V (main only for Image TikTok V column)
      if (tiktokVFile) {
        const uploadId = await uploadFile(tiktokVFile);
        properties["Image TikTok V"] = {
          files: [{
            type: "file_upload",
            file_upload: { id: uploadId },
            name: path.basename(tiktokVFile)
          }]
        };
        console.log(`  ✓ TikTok V: ${path.basename(tiktokVFile)}`);
      }

      // Upload TikTok H (main only for Image TikTok H column)
      if (tiktokHFile) {
        const uploadId = await uploadFile(tiktokHFile);
        properties["Image TikTok H"] = {
          files: [{
            type: "file_upload",
            file_upload: { id: uploadId },
            name: path.basename(tiktokHFile)
          }]
        };
        console.log(`  ✓ TikTok H: ${path.basename(tiktokHFile)}`);
      }

      // Update page
      await notion.pages.update({
        page_id: page.id,
        properties
      });

      success++;
      const slideCount = [instaImages.main, instaImages.bis, instaImages.ter, instaImages.quater].filter(Boolean).length;
      console.log(`  → Page updated! (${slideCount} insta slide${slideCount > 1 ? "s" : ""})${tiktokVFile ? " + TikTok V" : ""}${tiktokHFile ? " + TikTok H" : ""}\n`);

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.error(`  ✗ Error: ${err.message}\n`);
      errors++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Success: ${success} | Skipped: ${skipped} | Errors: ${errors}`);
}

main().catch(console.error);

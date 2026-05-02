/**
 * Publisher — envoi Telegram (vidéo + cover) + upload Notion.
 *
 * Réutilise :
 *  - sendTelegramVideo() et sendTelegramPhoto() de shared-utils.js
 *  - uploadFileToNotion() pour attacher MP4 et cover dans Notion
 *
 * Crée une entrée dans la base Articles (statut "En validation"),
 * avec champs : Titre, Slug, Type = "Vidéo", Categorie, Contenu = script.
 */

const fs = require('fs');
const path = require('path');
const {
  loadConfig,
  sendTelegram,
  sendTelegramPhoto,
  sendTelegramVideo,
  uploadFileToNotion,
} = require('../journalist-modules/shared-utils');

async function publishVideoToTelegram({ videoPath, coverPath, titre, categorie, caption }) {
  const summaryCaption = [
    `🎬 <b>${titre}</b>`,
    `${categorie} · Vidéo`,
    '',
    caption ? `<i>${caption.split('\n')[0].slice(0, 200)}</i>` : '',
  ]
    .filter(Boolean)
    .join('\n');

  // Envoie d'abord la vidéo (principal), puis la miniature en second message
  let videoMsg = { ok: false };
  if (fs.existsSync(videoPath)) {
    videoMsg = await sendTelegramVideo(videoPath, summaryCaption);
  }

  if (fs.existsSync(coverPath)) {
    await sendTelegramPhoto(coverPath, `🖼 Miniature Instagram pour <b>${titre}</b>`);
  }

  return videoMsg;
}

async function publishVideoToNotion({ videoPath, coverPath, script }) {
  const config = loadConfig();
  const articlesDbId = config.ARTICLES_DB_ID;
  const notionSecret = process.env.NOTION_SECRET || config.NOTION_SECRET;
  if (!articlesDbId || !notionSecret) {
    console.log('  ⚠ ARTICLES_DB_ID ou NOTION_SECRET manquant — Notion skip');
    return null;
  }

  const properties = {
    Titre: { title: [{ text: { content: script.titre } }] },
    Slug: { rich_text: [{ text: { content: script.slug } }] },
    Type: { select: { name: 'Vidéo' } },
    Categorie: { select: { name: script.categorie || 'Actu éco' } },
    Date: { date: { start: new Date().toISOString().split('T')[0] } },
    Statut: { select: { name: 'En validation' } },
    Contenu: { rich_text: [{ text: { content: (script.scriptText || '').slice(0, 2000) } }] },
    Sources: { rich_text: [{ text: { content: JSON.stringify(script.sources || []).slice(0, 2000) } }] },
  };

  // Cover dans "Image Hero"
  if (coverPath && fs.existsSync(coverPath)) {
    try {
      const coverUploadId = await uploadFileToNotion(coverPath);
      properties['Image Hero'] = {
        files: [
          {
            type: 'file_upload',
            file_upload: { id: coverUploadId },
            name: path.basename(coverPath),
          },
        ],
      };
    } catch (e) {
      console.error(`  ⚠ Upload cover Notion: ${e.message}`);
    }
  }

  // MP4 dans "Video" (si le champ existe dans la DB Articles — sinon il sera ignoré par Notion)
  if (videoPath && fs.existsSync(videoPath)) {
    try {
      const videoUploadId = await uploadFileToNotion(videoPath);
      properties['Video'] = {
        files: [
          {
            type: 'file_upload',
            file_upload: { id: videoUploadId },
            name: path.basename(videoPath),
          },
        ],
      };
    } catch (e) {
      console.error(`  ⚠ Upload vidéo Notion (champ "Video" manquant ?): ${e.message}`);
    }
  }

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionSecret}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: articlesDbId },
      properties,
    }),
  });

  const data = await res.json();
  if (data.id) return data.id;
  console.error('  ⚠ Erreur Notion:', JSON.stringify(data).slice(0, 300));
  return null;
}

module.exports = { publishVideoToTelegram, publishVideoToNotion };

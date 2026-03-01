/**
 * Module de validation Telegram (V2)
 *
 * Poll getUpdates pour détecter les réponses aux messages
 * d'articles proposés. Permet :
 * - "ok" → publie l'article
 * - "non" → rejette
 * - "titre: Nouveau titre" → modifie le titre
 * - "edit: instruction" → Claude reformule
 */

const { getTelegramConfig, askClaude, loadConfig } = require('./shared-utils');

async function pollTelegramUpdates(lastUpdateId = 0) {
  const { token } = getTelegramConfig();
  const url = `https://api.telegram.org/bot${token}/getUpdates`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offset: lastUpdateId + 1,
        timeout: 5,
        allowed_updates: ['message']
      })
    });
    const data = await res.json();
    return data.ok ? data.result : [];
  } catch (e) {
    console.error('  ⚠ Telegram poll:', e.message);
    return [];
  }
}

async function processValidationReply(update, articlePageId) {
  const text = (update.message?.text || '').trim().toLowerCase();
  const replyToMsgId = update.message?.reply_to_message?.message_id;

  if (!text || !replyToMsgId) return null;

  const config = loadConfig();
  const notionSecret = process.env.NOTION_SECRET || config.NOTION_SECRET;

  if (text === 'ok' || text === 'oui' || text === 'valider') {
    // Mark as validated in Notion
    await updateArticleStatus(notionSecret, articlePageId, 'Validé');
    return { action: 'validated', message: 'Article validé !' };
  }

  if (text === 'non' || text === 'rejeter' || text === 'supprimer') {
    await updateArticleStatus(notionSecret, articlePageId, 'Rejeté');
    return { action: 'rejected', message: 'Article rejeté.' };
  }

  if (text.startsWith('titre:')) {
    const newTitle = update.message.text.trim().slice(6).trim();
    await updateArticleTitle(notionSecret, articlePageId, newTitle);
    return { action: 'title_updated', message: `Titre mis à jour : ${newTitle}` };
  }

  if (text.startsWith('edit:')) {
    const instruction = update.message.text.trim().slice(5).trim();
    return { action: 'edit_requested', instruction, message: `Instruction reçue : ${instruction}` };
  }

  return null;
}

async function updateArticleStatus(notionSecret, pageId, status) {
  await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${notionSecret}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      properties: {
        'Statut': { select: { name: status } }
      }
    })
  });
}

async function updateArticleTitle(notionSecret, pageId, title) {
  await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${notionSecret}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      properties: {
        'Titre': { title: [{ text: { content: title } }] }
      }
    })
  });
}

module.exports = { pollTelegramUpdates, processValidationReply };

/**
 * deliver.js — livraison Telegram (photo + caption + texte) et email (images inline CID).
 */
const fs = require('fs');
const path = require('path');
const { secret, escapeHtml, cleanMarkdown, cleanForTelegram, stripBig } = require('./util');

const API = () => `https://api.telegram.org/bot${secret('TELEGRAM_BOT_TOKEN')}`;
const CHAT = () => secret('TELEGRAM_CHAT_ID');

async function sendTelegram(text) {
  try {
    const res = await fetch(`${API()}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT(), text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    return (await res.json()).ok;
  } catch (e) { console.error('  ⚠ Telegram:', e.message); return false; }
}

async function sendTelegramPhoto(photoPath, caption = '') {
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const ext = path.extname(photoPath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  const parts = [];
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${CHAT()}\r\n`));
  if (caption) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`));
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n`));
  }
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${path.basename(photoPath)}"\r\nContent-Type: ${mime}\r\n\r\n`));
  parts.push(fs.readFileSync(photoPath));
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));
  try {
    const res = await fetch(`${API()}/sendPhoto`, {
      method: 'POST', headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` }, body: Buffer.concat(parts)
    });
    const data = await res.json();
    if (!data.ok) console.error('  ⚠ Telegram photo:', data.description);
    return data.ok;
  } catch (e) { console.error('  ⚠ Telegram photo:', e.message); return false; }
}

async function deliverTelegram(cards, dateStr) {
  await sendTelegram(`☀️ <b>Infographies du jour — ${dateStr}</b>\n${cards.length} actus prêtes à publier.`);
  for (const c of cards) {
    if (!fs.existsSync(c.png)) continue;
    const cap = `🖼 <b>${escapeHtml(stripBig(cleanForTelegram(c.headline)))}</b>\n🏷 ${escapeHtml(c.theme || '')} · ${escapeHtml(c.source || '')}`;
    const ok = await sendTelegramPhoto(c.png, cap);
    await new Promise(r => setTimeout(r, 700));
    if (c.caption) {
      await sendTelegram(`✏️ <b>Texte :</b>\n\n${escapeHtml(cleanMarkdown(c.caption))}`);
      await new Promise(r => setTimeout(r, 1000));
    }
    if (!ok) await new Promise(r => setTimeout(r, 1500)); // backoff si échec
  }
}

async function deliverEmail(cards, dateStr) {
  const { sendBriefEmail } = require('../daily-brief-modules/email-sender');
  const attachments = [];
  let body = '';
  cards.forEach((c, i) => {
    if (!fs.existsSync(c.png)) return;
    const cid = `card${i}@ouvalargent`;
    attachments.push({ filename: `${c.slug}.png`, path: c.png, cid });
    const txt = escapeHtml(cleanMarkdown(c.caption || '')).replace(/\n/g, '<br>');
    body += `<tr><td style="padding:0 0 36px">
      <img src="cid:${cid}" alt="${escapeHtml(stripBig(c.headline))}" style="width:100%;max-width:560px;border-radius:14px;display:block"/>
      <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a;margin:14px 0 4px">${txt}</p>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:0">${escapeHtml(c.theme || '')} · ${escapeHtml(c.source || '')}</p>
    </td></tr>`;
  });
  const html = `<div style="max-width:600px;margin:0 auto;padding:8px">
    <h2 style="font-family:Georgia,serif;color:#0a1220">☀️ Où Va l'Argent — ${cards.length} infographies du ${dateStr}</h2>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#555;margin:0 0 24px">Prêtes à publier (image + texte d'accompagnement).</p>
    <table cellpadding="0" cellspacing="0" style="width:100%">${body}</table>
  </div>`;
  const to = secret('BRIEF_MAIL_TO') || secret('GMAIL_USER');
  return sendBriefEmail({ to, subject: `☀️ OVLA — ${cards.length} infographies du ${dateStr}`, html, attachments });
}

module.exports = { deliverTelegram, deliverEmail, sendTelegram, sendTelegramPhoto };

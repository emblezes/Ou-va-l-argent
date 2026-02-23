/**
 * Phase 4 : Weekly Publisher — Notion + Telegram + Rapport
 *
 * 1. Crée 21 entrées Notion dans le calendrier de publication
 * 2. Envoie 7 résumés quotidiens sur Telegram (3 PNG + captions par jour)
 * 3. Envoie un rapport final récapitulatif
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE = '/Users/emmanuelblezes/Documents/08_Où va l\'argent ';
const SCRIPTS_DIR = path.join(__dirname, '..');
const RS_BASE = path.join(BASE, 'Production interne/Réseaux Sociaux ');
const INSTA_DIR = path.join(RS_BASE, 'Infographies/Insta & Autres');

const CONFIG_PATH = path.join(SCRIPTS_DIR, 'telegram-config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = config;

const { addPost } = require(path.join(SCRIPTS_DIR, 'notion-add-post'));

// ── Telegram ─────────────────────────────────────────

async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    return (await res.json()).ok;
  } catch (e) {
    console.error('  ⚠ Telegram:', e.message);
    return false;
  }
}

async function sendTelegramPhoto(photoPath, caption = '') {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const photoData = fs.readFileSync(photoPath);
  const fileName = path.basename(photoPath);

  const parts = [];
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}\r\n`));
  if (caption) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`));
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n`));
  }
  const mime = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${fileName}"\r\nContent-Type: ${mime}\r\n\r\n`));
  parts.push(photoData);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body: Buffer.concat(parts)
    });
    return (await res.json()).ok;
  } catch (e) {
    console.error('  ⚠ Telegram photo:', e.message);
    return false;
  }
}

async function sendTelegramAlbum(photoPaths, caption = '') {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`;
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const buffers = [];

  const media = photoPaths.map((p, i) => ({
    type: 'photo',
    media: `attach://photo${i}`,
    ...(i === 0 && caption ? { caption, parse_mode: 'HTML' } : {})
  }));

  buffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}\r\n`));
  buffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="media"\r\n\r\n${JSON.stringify(media)}\r\n`));

  for (let i = 0; i < photoPaths.length; i++) {
    const photoData = fs.readFileSync(photoPaths[i]);
    const fileName = path.basename(photoPaths[i]);
    const mime = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
    buffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo${i}"; filename="${fileName}"\r\nContent-Type: ${mime}\r\n\r\n`));
    buffers.push(photoData);
    buffers.push(Buffer.from('\r\n'));
  }

  buffers.push(Buffer.from(`--${boundary}--\r\n`));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body: Buffer.concat(buffers)
    });
    const data = await res.json();
    if (!data.ok) console.error('  ⚠ Telegram album:', data.description);
    return data.ok;
  } catch (e) {
    console.error('  ⚠ Telegram album:', e.message);
    return false;
  }
}

// ── PNG → JPEG compression for Telegram ──────────────

function compressForTelegram(pngPath) {
  const jpgPath = pngPath.replace(/\.png$/, '-tg.jpg');
  try {
    execSync(`sips -s format jpeg -s formatOptions 75 "${pngPath}" --out "${jpgPath}" 2>/dev/null`, { timeout: 10000 });
    return jpgPath;
  } catch {
    return pngPath;
  }
}

function cleanupTelegramJpgs(dir) {
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('-tg.jpg'));
    files.forEach(f => fs.unlinkSync(path.join(dir, f)));
  } catch {}
}

// ── Notion Publishing ────────────────────────────────

async function publishToNotion(ideas, dryRun = false) {
  console.log(`\n  📅 Notion — ${ideas.length} entrées à créer\n`);

  let success = 0;
  for (const idea of ideas) {
    if (dryRun) {
      console.log(`    [DRY] ${idea.date} · ${idea.tag} · ${idea.title_html?.replace(/<[^>]*>/g, '').slice(0, 50)}`);
      success++;
      continue;
    }

    const result = addPost({
      titre: (idea.title_html || '').replace(/<[^>]*>/g, '').replace(/<br\s*\/?>/g, ' '),
      date: idea.date,
      theme: idea.notion_theme || idea.tag || 'Actualite eco',
      type: idea.notion_type || 'Stat choc',
      statut: 'Pret',
      instagram: (idea.instagram_long || idea.instagram_caption || '').substring(0, 2000),
      linkedin: (idea.linkedin_long || idea.linkedin_text || '').substring(0, 2000),
      twitter: (idea.twitter_long || idea.twitter_text || '').substring(0, 280),
      source: idea.source_text || ''
    });

    if (result) success++;
    await new Promise(r => setTimeout(r, 500)); // Rate limit
  }

  console.log(`  ✓ ${success}/${ideas.length} entrées Notion créées`);
  return success;
}

// ── Telegram Publishing (grouped by day) ─────────────

async function publishToTelegram(ideas, producerResults, dryRun = false) {
  console.log(`\n  📱 Telegram — envoi par jour\n`);

  // Group by day
  const byDay = {};
  ideas.forEach(idea => {
    if (!byDay[idea.date]) byDay[idea.date] = [];
    byDay[idea.date].push(idea);
  });

  const days = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));

  for (const [date, dayIdeas] of days) {
    const dayLabel = dayIdeas[0]?.day || date;
    const d = new Date(date);
    const dayNum = d.getDate();
    const monthNum = d.getMonth() + 1;

    // Find the corresponding PNG files
    const pngPaths = [];
    for (const idea of dayIdeas) {
      // Find the result for this idea
      const result = producerResults.find(r => r.idea?.slug === idea.slug && r.status === 'ok');
      if (result) {
        const instaPath = (result.exported || []).find(p => p.includes('-instagram.png'));
        if (instaPath && fs.existsSync(instaPath)) {
          pngPaths.push({ path: instaPath, idea });
        }
      }
    }

    if (dryRun) {
      console.log(`    [DRY] ${dayLabel.toUpperCase()} ${dayNum}/${monthNum} — ${pngPaths.length} PNG`);
      continue;
    }

    // Send day header
    await sendTelegram(`📅 <b>${dayLabel.toUpperCase()} ${dayNum}/${String(monthNum).padStart(2, '0')}</b> — 3 infographies`);
    await new Promise(r => setTimeout(r, 500));

    // Send album of 3 photos if available
    if (pngPaths.length > 0) {
      const jpgs = pngPaths.map(p => compressForTelegram(p.path));
      const caption = pngPaths.map((p, i) =>
        `${i + 1}. ${p.idea.title_html?.replace(/<[^>]*>/g, '').replace(/<br\s*\/?>/g, ' ').slice(0, 60)}`
      ).join('\n');

      const albumOk = await sendTelegramAlbum(jpgs, caption);
      if (!albumOk) {
        // Fallback: send individually
        for (const p of pngPaths) {
          const jpg = compressForTelegram(p.path);
          await sendTelegramPhoto(jpg, p.idea.title_html?.replace(/<[^>]*>/g, '').slice(0, 80));
          await new Promise(r => setTimeout(r, 500));
        }
      }
      await new Promise(r => setTimeout(r, 1000));
    }

    // Send captions for each idea (prefer long versions from copywriter)
    for (const idea of dayIdeas) {
      // LinkedIn (long version)
      const linkedin = idea.linkedin_long || idea.linkedin_text || '';
      if (linkedin) {
        await sendTelegram(`💼 <b>LinkedIn — ${idea.tag}</b>\n\n${linkedin.slice(0, 3900)}`);
        await new Promise(r => setTimeout(r, 500));
      }

      // Instagram (long version)
      const instagram = idea.instagram_long || idea.instagram_caption || '';
      if (instagram) {
        await sendTelegram(`📸 <b>Instagram — ${idea.tag}</b>\n\n${instagram.slice(0, 3900)}`);
        await new Promise(r => setTimeout(r, 500));
      }
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  // Cleanup temp JPEGs
  cleanupTelegramJpgs(INSTA_DIR);
}

// ── Final Report ─────────────────────────────────────

async function sendFinalReport(planData, producerResult, notionCount, dryRun = false) {
  const { produced, failed, duration } = producerResult;
  const totalPNG = produced * 3;

  // Estimate cost
  const claudeCalls = produced + 2; // +2 for planner passes
  const estimatedCost = (claudeCalls * 0.07).toFixed(2); // ~$0.07 per Sonnet call

  const msg = `✅ <b>PRODUCTION HEBDOMADAIRE TERMINÉE</b>

📊 ${produced} infographies produites${failed > 0 ? ` (${failed} échecs)` : ''}
🖼 ${totalPNG} fichiers PNG exportés (3 formats)
📅 ${notionCount} entrées Notion créées
✍️ ${produced} posts LinkedIn + Instagram rédigés
📰 1 newsletter complète

📁 Semaine : ${planData.monday} → ${planData.sunday}
⏱ Durée : ~${duration || '?'} min
💰 Coût Claude estimé : ~$${estimatedCost}

📌 <b>Tout est prêt ! Review et publie selon le calendrier.</b>`;

  if (dryRun) {
    console.log('\n' + msg.replace(/<[^>]*>/g, ''));
    return;
  }

  await sendTelegram(msg);
}

// ── Main Publisher ───────────────────────────────────

async function publishWeeklyContent(planPath, producerResult, copyResult = null, dryRun = false) {
  const planData = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
  const exportedIdeas = planData.ideas.filter(i => i.status === 'exported');

  console.log(`\n📤 Weekly Publisher — ${exportedIdeas.length} infographies à publier\n`);

  if (exportedIdeas.length === 0) {
    console.log('  Rien à publier.');
    return;
  }

  // 1. Notion (update with long texts from copywriter)
  const notionIdeas = exportedIdeas.map(i => ({
    ...i,
    // Use long versions for Notion if available
    instagram: i.instagram_long || i.instagram_caption || '',
    linkedin: i.linkedin_long || i.linkedin_text || '',
    twitter: i.twitter_long || i.twitter_text || ''
  }));
  const notionCount = await publishToNotion(notionIdeas, dryRun);

  // 2. Telegram — daily posts with PNG + captions
  await publishToTelegram(exportedIdeas, producerResult.results || [], dryRun);

  // 3. Newsletter on Telegram
  if (copyResult?.newsletterPath && fs.existsSync(copyResult.newsletterPath)) {
    const newsletter = fs.readFileSync(copyResult.newsletterPath, 'utf-8');
    const nlPreview = newsletter.slice(0, 3900);
    if (dryRun) {
      console.log(`\n  [DRY] Newsletter (${newsletter.length} chars) → Telegram`);
    } else {
      await sendTelegram(`📰 <b>NEWSLETTER DE LA SEMAINE</b>\n\n${nlPreview}`);
      if (newsletter.length > 3900) {
        await new Promise(r => setTimeout(r, 500));
        await sendTelegram(newsletter.slice(3900, 7800));
      }
    }
    console.log(`  ✓ Newsletter envoyée sur Telegram`);
  }

  // 4. Content files location
  if (copyResult?.weekDir) {
    const msg = `📁 <b>Fichiers de contenu :</b>\n` +
      `📝 Newsletter : ${copyResult.newsletterPath ? path.basename(copyResult.newsletterPath) : 'N/A'}\n` +
      `💼 LinkedIn : ${copyResult.linkedinPath ? path.basename(copyResult.linkedinPath) : 'N/A'}\n` +
      `📸 Instagram : ${copyResult.instaPath ? path.basename(copyResult.instaPath) : 'N/A'}\n` +
      `🐦 Tweets : ${copyResult.tweetsPath ? path.basename(copyResult.tweetsPath) : 'N/A'}`;
    if (!dryRun) await sendTelegram(msg);
  }

  // 5. Final report
  await sendFinalReport(planData, producerResult, notionCount, dryRun);

  console.log('\n✅ Publication terminée !\n');
}

module.exports = { publishWeeklyContent };

/**
 * Email Sender — envoi du brief matinal via Gmail SMTP (nodemailer)
 *
 * Secrets attendus dans l'environnement (~/.zshrc) :
 *   GMAIL_USER          → ton adresse Gmail (ex: e.blezes@gmail.com)
 *   GMAIL_APP_PASSWORD  → "mot de passe d'application" Gmail (16 caractères, PAS ton mot de passe normal)
 *                         → https://myaccount.google.com/apppasswords
 *   BRIEF_MAIL_TO       → (optionnel) destinataire ; par défaut = GMAIL_USER
 *
 * Installation : npm install nodemailer
 */

async function sendBriefEmail({ to, subject, html, attachments = [] }) {
  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch {
    throw new Error("nodemailer non installé. Lance : cd Site && npm install nodemailer");
  }
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD manquants dans ~/.zshrc (voir en-tête du module).");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  const info = await transporter.sendMail({
    from: `"Où Va l'Argent — Brief matinal" <${user}>`,
    to: to || process.env.BRIEF_MAIL_TO || user,
    subject,
    html,
    attachments
  });

  return info;
}

module.exports = { sendBriefEmail };

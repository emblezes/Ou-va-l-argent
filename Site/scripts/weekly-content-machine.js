#!/usr/bin/env node

/**
 * Weekly Content Machine — "Où va l'argent"
 *
 * Produit automatiquement 21 infographies par semaine (3/jour × 7 jours)
 * à partir de sources institutionnelles (INSEE, Cour des Comptes, Eurostat, etc.)
 *
 * WORKFLOW SEMI-AUTOMATIQUE :
 *   Dimanche 22h : --scrape    → Veille profonde (13+ sources institutionnelles)
 *   Lundi 6h     : --plan      → Claude sélectionne 21 idées → Telegram
 *   [Validation manuelle : éditer le JSON ou lancer directement --produce]
 *   Lundi 8h     : --produce   → Génération HTML + 63 PNG + Notion + Telegram
 *
 * Usage:
 *   node weekly-content-machine.js --scrape          # Phase 1 : scraping profond
 *   node weekly-content-machine.js --plan            # Phase 2 : plan de la semaine
 *   node weekly-content-machine.js --produce         # Phase 3+4 : production + publication
 *   node weekly-content-machine.js --full            # Toutes les phases
 *   node weekly-content-machine.js --retry-failed    # Retry les infographies échouées
 *   node weekly-content-machine.js --dry-run         # Test sans Telegram/Notion
 *   node weekly-content-machine.js --count=14        # Override : 14 au lieu de 21
 *
 * Cron:
 *   0 22 * * 0 cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/weekly-content-machine.js --scrape >> /tmp/ovla-weekly.log 2>&1
 *   0 6  * * 1 cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/weekly-content-machine.js --plan >> /tmp/ovla-weekly.log 2>&1
 *   0 8  * * 1 cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" && node scripts/weekly-content-machine.js --produce >> /tmp/ovla-weekly.log 2>&1
 *
 * Coût estimé : ~$1.65/semaine (~$6.60/mois)
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = __dirname;

// ── Parse CLI args ───────────────────────────────────

const args = process.argv.slice(2);
const flags = {
  scrape: args.includes('--scrape'),
  plan: args.includes('--plan'),
  produce: args.includes('--produce'),
  full: args.includes('--full'),
  retryFailed: args.includes('--retry-failed'),
  dryRun: args.includes('--dry-run'),
};

const countArg = args.find(a => a.startsWith('--count='));
const count = countArg ? parseInt(countArg.replace('--count=', '')) : 21;

// If no flag specified, show help
if (!flags.scrape && !flags.plan && !flags.produce && !flags.full && !flags.retryFailed) {
  console.log(`
📦 Weekly Content Machine — Où va l'argent

Usage:
  node weekly-content-machine.js --scrape          Veille profonde (13 sources)
  node weekly-content-machine.js --plan            Plan de la semaine → Telegram
  node weekly-content-machine.js --produce         Production + publication
  node weekly-content-machine.js --full            Tout d'un coup
  node weekly-content-machine.js --retry-failed    Retry les échecs

Options:
  --dry-run     Pas d'envoi Telegram/Notion
  --count=N     Nombre d'infographies (défaut: 21)

Cron recommandé:
  Dim 22h  → --scrape
  Lun 6h   → --plan
  Lun 8h   → --produce
`);
  process.exit(0);
}

// ── Main ─────────────────────────────────────────────

async function main() {
  const startTime = Date.now();
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  📦 Weekly Content Machine               ║`);
  console.log(`║  ${new Date().toLocaleString('fr-FR')}              ║`);
  console.log(`╚══════════════════════════════════════════╝\n`);

  if (flags.dryRun) {
    console.log('  🧪 Mode DRY RUN — pas d\'envoi Telegram/Notion\n');
  }

  let scrapeResultsPath = null;
  let planPath = null;
  let producerResult = null;

  // ── Phase 1 : Scrape ──────────────────────────────
  if (flags.scrape || flags.full) {
    const { deepScrape, saveScrapeResults } = require('./weekly-modules/deep-scraper');
    const { articles, stats } = await deepScrape();
    scrapeResultsPath = saveScrapeResults(articles, stats);

    if (articles.length < 10) {
      console.log('  ⚠ Peu d\'articles trouvés. Vérifiez les sources RSS.');
    }
  }

  // ── Phase 2 : Plan ────────────────────────────────
  if (flags.plan || flags.full) {
    const { generateWeeklyPlan } = require('./weekly-modules/weekly-planner');
    planPath = await generateWeeklyPlan(scrapeResultsPath, count, flags.dryRun);

    if (!planPath) {
      console.error('\n❌ Échec de la planification');
      process.exit(1);
    }
  }

  // ── Phase 3+4 : Produce + Publish ─────────────────
  if (flags.produce || flags.retryFailed || flags.full) {
    // Find plan file
    if (!planPath) {
      const { getWeekNumber } = require('./weekly-modules/deep-scraper');
      // Try current week first, then next week
      const now = new Date();
      const { year, week } = getWeekNumber(now);
      const weekStr = `${year}-W${String(week).padStart(2, '0')}`;
      planPath = path.join(SCRIPTS_DIR, `.weekly-plan-${weekStr}.json`);

      if (!fs.existsSync(planPath)) {
        // Try next week
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nw = getWeekNumber(nextWeek);
        const nwStr = `${nw.year}-W${String(nw.week).padStart(2, '0')}`;
        planPath = path.join(SCRIPTS_DIR, `.weekly-plan-${nwStr}.json`);
      }

      if (!fs.existsSync(planPath)) {
        console.error('\n❌ Aucun plan trouvé. Lancez --plan d\'abord.');
        process.exit(1);
      }
    }

    console.log(`  📋 Plan: ${path.basename(planPath)}`);

    // Produce
    const { produceWeeklyContent } = require('./weekly-modules/weekly-producer');
    producerResult = await produceWeeklyContent(planPath);

    // Copywrite (LinkedIn long, Instagram, newsletter)
    if (producerResult.produced > 0) {
      const { writeWeeklyContent } = require('./weekly-modules/weekly-copywriter');
      const copyResult = await writeWeeklyContent(planPath);

      // Publish
      const { publishWeeklyContent } = require('./weekly-modules/weekly-publisher');
      await publishWeeklyContent(planPath, producerResult, copyResult, flags.dryRun);
    } else {
      console.log('\n  ⚠ Aucune infographie produite — rédaction et publication ignorées');
    }
  }

  // ── Fin ────────────────────────────────────────────
  const totalMin = Math.round((Date.now() - startTime) / 1000 / 60);
  console.log(`\n✅ Terminé en ~${totalMin} min\n`);
}

main().catch(err => {
  console.error('\n❌ Erreur fatale:', err.message);
  console.error(err.stack);
  process.exit(1);
});

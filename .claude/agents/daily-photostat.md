---
name: daily-photostat
description: Pipeline quotidien automatisé qui produit ~10 infographies actu-short (format photo-stat) à partir de l'actu éco des dernières 24h, avec un mix ~60% sur les angles OVLA (fiscalité, dépense publique, dette, comparaisons internationales), et les livre sur Telegram. Tourne chaque jour à 8h via GitHub Actions (cloud, ordi éteint). À consulter pour comprendre, faire tourner manuellement, ou faire évoluer ce pipeline.
tools: Read, Edit, Bash
---

# Agent — daily-photostat (pipeline quotidien d'infographies)

Pipeline qui industrialise la production d'infographies « actu-short » (photo plein cadre + énoncé
blanc + chiffre or, format `photo-stat-card`).

## Ce qu'il fait, chaque jour à 8h (Paris)
1. **Collecte** l'actu éco des dernières 24h via 8 flux RSS (dédup 7 jours).
2. **Sélectionne** ~4 actus fortes (Claude Haiku, priorité angle OVLA) et rédige les cartes
   (énoncé blanc ≤58, reveal ≤45 avec `<big>chiffre</big>`, 2 lignes max) + texte d'accompagnement.
3. **Complète à 10** avec ~6 **stat choc OVLA** piochées dans la banque (`ovla-bank.json`), rotation LRU
   (jamais les mêmes que la veille). → garantit ≥60% d'angles « Où va l'argent ».
4. **Photos Pexels** (1 par carte), **rendu PNG 2160×2160**.
5. **Livraison** : Telegram (photo + caption + texte) **et** email (images inline + textes) à e.blezes@gmail.com.
6. **Persiste** l'état de dédup (cache + banque) → pas de répétition le lendemain.

## Fichiers
- Orchestrateur : `Site/scripts/daily-photostat.js`
- Modules : `Site/scripts/daily-photostat-modules/` (collect, select, ovla-bank, captions, photos, render, deliver, util)
- Banque OVLA : `daily-photostat-modules/ovla-bank.json` (stats fact-checkées) + `ovla-bank-state.json` (rotation)
- Sources RSS : `daily-photostat-modules/news-sources.json`
- Cache dédup : `Site/scripts/.daily-photostat-cache.json`
- Cloud : `.github/workflows/daily-photostat.yml` (cron 8h + workflow_dispatch)

## Commandes
```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"
node scripts/daily-photostat.js --dry-run     # génère les PNG sans envoyer ni toucher l'état
node scripts/daily-photostat.js               # run complet (Telegram + email)
node scripts/daily-photostat.js --count=10 --actus=4
```

## Secrets requis (env / GitHub Secrets)
`ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `PEXELS_API_KEY`, `GMAIL_USER`,
`GMAIL_APP_PASSWORD` (+ `BRIEF_MAIL_TO` = e.blezes@gmail.com).

## Pour faire évoluer
- **Enrichir la banque OVLA** : ajouter des entrées dans `ovla-bank.json` (chaque stat DOIT être fact-checkée
  et sourcée ; headline ≤58, reveal ≤45 avec `<big>`, photo = requête Pexels anglaise). Plus la banque est
  grande, plus la rotation espace les répétitions.
- **Mix** : ajuster `--actus=N` (défaut 4) ; le reste vient de la banque.
- **Modèle** : la sélection/captions utilisent `claude-haiku-4-5-20251001` (rapide, peu cher).

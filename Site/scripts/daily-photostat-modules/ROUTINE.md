# Routine quotidienne OVLA — job de la session Claude Code (abonnement, zéro coût API)

> Ce texte est le **prompt** déclenché chaque matin par la routine planifiée. La session (= abonnement
> Claude Code) fait toute la réflexion + le fact-check ; le rendu/envoi est délégué à un script Node gratuit.

## Pré-requis dans l'environnement cloud
- Repo `emblezes/Ou-va-l-argent` clonable.
- Secrets **dans l'environnement** (variables d'env) : `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `PEXELS_API_KEY`.
  **PAS** d'`ANTHROPIC_API_KEY` (on n'utilise pas l'API — la session = abonnement).
- Node 22 + `npm install` (Puppeteer/Chromium).

## Job (étapes)
1. **Repo** : si absent, cloner léger puis installer :
   `git clone --depth 1 --filter=blob:none --sparse https://github.com/emblezes/Ou-va-l-argent.git ~/ovla`
   `cd ~/ovla && git sparse-checkout set Site/scripts && cd Site && npm install --legacy-peer-deps --no-audit --no-fund`
   Sinon : `cd ~/ovla/Site && git pull`.
2. **Anti-répétition** : lis `scripts/daily-photostat-modules/done-topics.json` (244 sujets déjà faits) et
   `scripts/daily-photostat-modules/sent-log.json` (déjà envoyés). **N'utilise AUCUN de ces sujets.**
3. **Actu RSS des dernières 24h** (le réseau doit être « Complet » ou autoriser les 8 hôtes RSS) :
   `node -e "require('./scripts/daily-photostat-modules/collect').collectFresh().then(r=>require('fs').writeFileSync('/tmp/rss.json',JSON.stringify(r.fresh.slice(0,30))))"`
   Chaque item a un `pubDate` : **ne garde que ceux publiés il y a MOINS DE 48h**. Les 4 actu-short DOIVENT
   venir de ce flux frais — **JAMAIS** d'une recherche web qui remonterait un article vieux de plusieurs mois.
   Si `/tmp/rss.json` est vide/échoue, réduis le nombre d'actu-short et complète par des angles OVLA structurels
   (ne fabrique pas de fausse « actu » avec un fait ancien).
4. **Génère `today-specs.json`** (toi-même, en **fact-checkant CHAQUE chiffre** via WebSearch/WebFetch ;
   sources : OCDE, Eurostat, INSEE, Banque de France, DGFiP, Cour des comptes, IGF, Sénat… ; écarte tout chiffre
   non confirmé ; cite la source exacte) :
   - `actuShort` (10) : **4** issues de `/tmp/rss.json` + **6** angles OVLA (fiscalité, dépense, dette,
     comparaisons internationales). Format carte :
     `{ "slug","photo"(requête Pexels EN),"headline"(énoncé blanc factuel, point final, SANS le chiffre),
        "reveal"("<big>chiffre</big> …", point final),"source","theme","caption"(3-5 phrases + 3 hashtags) }`
     → énoncé et reveal en **2 lignes max**, **un seul chiffre dominant**.
   - `graphics` (2) : angles **GRAPHIQUES ORIGINAUX** (≠ done-topics/sent-log).
     `{ "id","type"(line/bars/dot),"title"(<em>mot</em>, point final),"metric","source",
        "accent"(#ff4757/#ffd700/#00d4ff/#00ff88/#ff9f43),"unit","data"(line:[{x,y}]; bars/dot:[{label,value,hi}]),"caption" }`
   - `micro` (1) : **micro-dépense** d'un rapport précis.
     `{ "id","headline"(sujet, SANS le chiffre, point final),"figure"(le chiffre, court),"detail","source","accent","caption" }`
5. **Rendu + envoi** (gratuit) : `node scripts/daily-render-send.js today-specs.json`
6. **Journal** : le script a mis à jour `sent-log.json`. Commit + push :
   `git add scripts/daily-photostat-modules/sent-log.json && git commit -m "sent-log $(date +%F)" && git push`
7. **Compte-rendu** : liste les visuels envoyés (titre + source) et signale tout chiffre écarté au fact-check.

## Règles éditoriales
- Factuel (pas militant) ; l'angle libéral est dans le **choix du sujet**. ~60 % des actu-short sur les angles OVLA.
- Jamais un sujet de `done-topics`/`sent-log`. Privilégier le neuf et le concret.
- Pas de visuel sans chiffre vérifié + source.

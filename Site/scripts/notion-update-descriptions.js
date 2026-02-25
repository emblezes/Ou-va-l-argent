#!/usr/bin/env node
/**
 * Met à jour les descriptions Instagram, LinkedIn, Facebook X, TikTok
 * dans la base Notion "Liste des infographies"
 *
 * Usage: node scripts/notion-update-descriptions.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── Config ──
const _fileConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'notion-config.json'), 'utf8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const NOTION_SECRET = config.NOTION_SECRET;
const DB_ID = '6cd320f7-9016-4fef-807d-9b87c2f76568';

// ── Descriptions par infographie ──
const DESCRIPTIONS = {
  1: {
    instagram: `En 50 ans, la dette publique française est passée de 20% à 117% du PIB.

En 1974, la France était quasiment sans dette. Aujourd'hui, elle dépasse les 3 300 milliards d'euros.

Les étapes clés de cette explosion :
- 1974 : 20% du PIB
- 1992 : 40% — premières alertes
- 2007 : 64% — avant la crise financière
- 2010 : 83% — impact de la crise des subprimes
- 2019 : 98% — on frôle les 100%
- 2020 : 115% — le Covid fait exploser les compteurs
- 2025 : 117% — et ça ne s'arrête pas

Le problème : chaque année, la France emprunte pour rembourser ses anciens emprunts. C'est la spirale de la dette.

Qui va payer ? Nous, nos enfants, nos petits-enfants.

#dette #dettefrance #financespubliques #economie #budget #deficit #PIB #france #argent #ouvalargent`,

    linkedin: `La dette publique française : 50 ans d'explosion silencieuse

En 1974, la dette publique de la France représentait 20% du PIB. Aujourd'hui, elle atteint 117%.

Comment en est-on arrivé là ?

Les chiffres parlent d'eux-mêmes :

1974 — 20% du PIB
La France entre dans les Trente Glorieuses avec une dette quasi inexistante. L'État vit à peu près selon ses moyens.

1992 — 40% du PIB
Le tournant. Les premiers déficits chroniques s'installent. La dette double en moins de 20 ans.

2007 — 64% du PIB
Avant même la crise financière, la trajectoire est déjà préoccupante. Aucun gouvernement n'a inversé la tendance.

2010 — 83% du PIB
La crise des subprimes et le sauvetage bancaire accélèrent brutalement l'endettement.

2019 — 98% du PIB
On frôle la barre symbolique des 100%. La France emprunte chaque année pour rembourser ses emprunts précédents.

2020 — 115% du PIB
Le Covid-19 fait exploser les compteurs. Le "quoi qu'il en coûte" ajoute plus de 15 points de dette en un an.

2025 — 117% du PIB
La dette atteint 3 305 milliards d'euros. La charge des intérêts dépasse 50 milliards par an, soit plus que le budget de l'Éducation nationale.

Le constat est implacable : en 50 ans, aucune alternance politique n'a permis de réduire durablement la dette. Chaque crise ajoute une couche supplémentaire, sans que les périodes de croissance ne suffisent à absorber le choc.

La question n'est plus "comment réduire la dette" mais "qui va financer cette trajectoire insoutenable ?"

#dette #financespubliques #economiefrancaise #budget #deficit #PIB #france #politique #macroeconomie #ouvalargent`,

    facebookX: `En 50 ans, la dette publique française a été multipliée par 6 en proportion du PIB.

1974 : 20%
2025 : 117%

3 305 milliards d'euros. Plus de 48 000 euros par habitant.

Et chaque année, on emprunte pour rembourser les emprunts précédents.

Qui va payer ?

#dette #france #economie #financespubliques #argent #ouvalargent`,

    tiktok: `La dette française a EXPLOSÉ en 50 ans

1974 : 20% du PIB
2025 : 117% du PIB

3 305 milliards d'euros de dette. On emprunte pour rembourser nos emprunts.

#dette #france #economie #argent #ouvalargent #financespubliques`
  },

  2: {
    instagram: `La France a la 3e dette la plus élevée de la zone euro.

Avec 117,7% du PIB, seules la Grèce (149,7%) et l'Italie (137,8%) font pire.

Le classement complet :
- Grèce : 149,7%
- Italie : 137,8%
- France : 117,7%
- Belgique : 107,1%
- Espagne : 103,2%
- Moyenne zone euro : 88,5%
- Allemagne : 62,9%
- Pays-Bas : 44,3%
- Estonie : 22,9%

La France est 30 points au-dessus de la moyenne européenne et presque deux fois plus endettée que l'Allemagne.

La règle européenne fixe la limite à 60% du PIB. La France en est à près du double.

#dette #europe #france #economie #eurostat #comparaison #PIB #financespubliques #zoneeuro #ouvalargent`,

    linkedin: `La France, 3e pays le plus endetté de la zone euro

La dette publique française atteint 117,7% du PIB au troisième trimestre 2025, selon Eurostat. Un niveau qui la place sur le podium des pays les plus endettés de la zone euro, juste derrière la Grèce et l'Italie.

Le classement européen de la dette publique (en % du PIB) :

Grèce — 149,7%
Italie — 137,8%
France — 117,7%
Belgique — 107,1%
Espagne — 103,2%
Moyenne zone euro — 88,5%
Allemagne — 62,9%
Pays-Bas — 44,3%
Estonie — 22,9%

Trois constats s'imposent :

1. La France est 30 points au-dessus de la moyenne de la zone euro. Ce n'est pas un écart marginal, c'est un décrochage structurel.

2. L'écart avec l'Allemagne est abyssal. Berlin affiche 62,9% quand Paris dépasse les 117%. Presque le double. Deux modèles économiques radicalement différents au sein d'une même union monétaire.

3. La règle européenne du Pacte de stabilité fixe le plafond à 60% du PIB. La France en est à près du double. Elle figure parmi les pays faisant l'objet d'une procédure pour déficit excessif.

Les pays les plus vertueux — Pays-Bas (44,3%), Estonie (22,9%) — montrent qu'une gestion budgétaire rigoureuse est possible au sein de la zone euro, même avec un niveau de vie élevé.

La question centrale : comment la France peut-elle financer ses ambitions sociales et géopolitiques avec une dette qui dépasse celle de l'Espagne et se rapproche dangereusement de celle de l'Italie ?

#dette #europe #zoneeuro #france #allemagne #economie #eurostat #financespubliques #macroeconomie #ouvalargent`,

    facebookX: `La France a la 3e dette la plus élevée de la zone euro : 117,7% du PIB.

Seules la Grèce (149,7%) et l'Italie (137,8%) font pire.

L'Allemagne est à 62,9%. Presque deux fois moins.

La règle européenne fixe le plafond à 60%. La France en est au double.

#dette #europe #france #economie #zoneeuro #ouvalargent`,

    tiktok: `La France est sur le PODIUM des pays les plus endettés d'Europe

3e derrière la Grèce et l'Italie avec 117,7% du PIB

L'Allemagne ? 62,9%. Presque DEUX FOIS moins.

#dette #france #europe #economie #ouvalargent #argent`
  },

  3: {
    instagram: `La France a le déficit le plus élevé de toute la zone euro.

Avec -5,8% du PIB en 2024, aucun pays européen ne fait pire.

Le classement des soldes budgétaires :
- France : -5,8%
- Slovaquie : -5,3%
- Belgique : -4,5%
- Finlande : -4,4%
- Italie : -3,4%
- Allemagne : -2,8%
- Portugal : +0,7%
- Grèce : +1,3%
- Chypre : +4,3%

Pendant que la France creuse son déficit, d'anciens pays en difficulté comme la Grèce et le Portugal affichent des excédents budgétaires.

La règle européenne fixe la limite à 3% du PIB. La France est presque au double.

#deficit #france #zoneeuro #europe #economie #budget #financespubliques #PIB #eurostat #ouvalargent`,

    linkedin: `La France, championne du déficit en zone euro

En 2024, la France affiche un déficit budgétaire de -5,8% du PIB. C'est le plus élevé de toute la zone euro, devant la Slovaquie (-5,3%) et la Belgique (-4,5%).

Le classement complet des soldes budgétaires (en % du PIB) :

France — -5,8%
Slovaquie — -5,3%
Belgique — -4,5%
Finlande — -4,4%
Italie — -3,4%
Allemagne — -2,8%
Portugal — +0,7%
Grèce — +1,3%
Chypre — +4,3%

Trois enseignements majeurs :

1. La France dépense bien au-delà de ses moyens. Un déficit de -5,8%, c'est presque le double de la limite européenne fixée à 3% par le Pacte de stabilité. C'est aussi la raison pour laquelle la France fait l'objet d'une procédure pour déficit excessif.

2. Le retournement des pays du Sud est spectaculaire. La Grèce, symbole de la crise de la dette en 2010-2015, affiche désormais un excédent de +1,3%. Le Portugal, sous programme d'aide il y a dix ans, est à +0,7%. Les anciens "mauvais élèves" ont redressé leurs finances publiques.

3. L'Allemagne fait deux fois mieux que la France avec -2,8%, tout en restant sous le seuil des 3%. Un écart qui illustre deux philosophies budgétaires diamétralement opposées au sein de la même union monétaire.

La question : combien de temps les marchés financiers et les partenaires européens accepteront-ils cette trajectoire budgétaire française ?

#deficit #financespubliques #france #zoneeuro #europe #economie #budget #eurostat #macroeconomie #ouvalargent`,

    facebookX: `La France a le PIRE déficit de toute la zone euro : -5,8% du PIB en 2024.

Pendant ce temps, la Grèce affiche +1,3% d'excédent. Le Portugal +0,7%.

Les anciens "mauvais élèves" ont redressé leurs comptes. Pas la France.

#deficit #france #europe #economie #budget #ouvalargent`,

    tiktok: `La France a le PIRE déficit de la zone euro

-5,8% du PIB en 2024. AUCUN pays ne fait pire.

Et la Grèce ? Elle est en EXCÉDENT maintenant.

#deficit #france #europe #economie #ouvalargent #argent`
  },

  4: {
    instagram: `La France n'a pas eu un seul budget équilibré depuis 1974. 50 ans de déficit sans interruption.

En 1970, le solde budgétaire était encore positif : +0,9% du PIB. En 1974, dernier excédent : +0,1%.

Depuis, c'est la chute libre :
- 1980 : -0,4%
- 1985 : -2,9%
- 1990 : -2,1%
- 1995 : -5,1%
- 2000 : -1,3%
- 2005 : -3,4%
- 2010 : -6,9% (crise financière)
- 2015 : -3,6%
- 2020 : -9,0% (Covid)
- 2024 : -5,8%

Aucun gouvernement, de gauche comme de droite, n'a réussi à équilibrer les comptes depuis un demi-siècle. Le déficit est devenu la norme.

Résultat : 3 300 milliards d'euros de dette accumulée.

#deficit #france #budget #economie #financespubliques #dette #PIB #histoire #ouvalargent`,

    linkedin: `La France n'a pas eu un seul budget équilibré depuis 1974

C'est un fait que peu de Français connaissent : le dernier exercice budgétaire excédentaire en France remonte à 1974. Depuis exactement 50 ans, chaque année sans exception, l'État dépense plus qu'il ne perçoit.

L'évolution du solde budgétaire français (en % du PIB) :

1970 — +0,9%
Le budget est encore excédentaire. La France vit selon ses moyens.

1974 — +0,1%
Dernier excédent. Le premier choc pétrolier marque la bascule.

1980 — -0,4%
Premier déficit modéré. La spirale commence.

1995 — -5,1%
Le déficit franchit les 5%. La dette s'accumule.

2010 — -6,9%
La crise des subprimes fait exploser le déficit. Plans de relance massifs.

2020 — -9,0%
Record historique. Le "quoi qu'il en coûte" face au Covid pousse le déficit à un niveau jamais vu.

2024 — -5,8%
Quatre ans après le Covid, le déficit reste presque deux fois supérieur au plafond européen de 3%.

Le constat est vertigineux : en 50 ans, 14 présidents de la République, des dizaines de gouvernements de toutes couleurs politiques, et pas un seul n'a réussi à équilibrer les comptes publics.

Le déficit n'est plus un accident conjoncturel. C'est devenu un mode de fonctionnement structurel de l'État français. Et chaque année de déficit vient s'ajouter à la dette, qui dépasse désormais 3 300 milliards d'euros.

La question : est-il encore possible de sortir de cette spirale ?

#deficit #budget #financespubliques #france #dette #economie #histoire #macroeconomie #PIB #ouvalargent`,

    facebookX: `La France n'a pas eu un seul budget équilibré depuis 1974. 50 ans de déficit continu.

Dernier excédent : +0,1% du PIB en 1974.
Aujourd'hui : -5,8% du PIB en 2024.

Aucun gouvernement n'a inversé la tendance. Résultat : 3 300 milliards de dette.

#deficit #france #budget #economie #dette #ouvalargent`,

    tiktok: `50 ANS de déficit sans interruption en France

Dernier budget équilibré : 1974. Depuis ? JAMAIS.

2024 : -5,8% du PIB. Et 3 300 milliards de dette.

#deficit #france #budget #economie #ouvalargent #argent`
  }
};

// ── Helpers ──
function getPageIdByNum(num) {
  try {
    const result = execSync(`curl -s -X POST "https://api.notion.com/v1/databases/${DB_ID}/query" \
      -H "Authorization: Bearer ${NOTION_SECRET}" \
      -H "Notion-Version: 2022-06-28" \
      -H "Content-Type: application/json" \
      -d '{"filter":{"property":"N°","number":{"equals":${num}}}}'`,
      { timeout: 10000 }
    ).toString();
    const data = JSON.parse(result);
    return data.results?.[0]?.id || null;
  } catch (e) {
    return null;
  }
}

function updateNotionTexts(pageId, descriptions) {
  const payload = {
    properties: {
      'Instagram': {
        rich_text: [{ type: 'text', text: { content: descriptions.instagram.substring(0, 2000) } }]
      },
      'LinkedIn': {
        rich_text: [{ type: 'text', text: { content: descriptions.linkedin.substring(0, 2000) } }]
      },
      'Facebook X': {
        rich_text: [{ type: 'text', text: { content: descriptions.facebookX.substring(0, 2000) } }]
      },
      'TikTok': {
        rich_text: [{ type: 'text', text: { content: descriptions.tiktok.substring(0, 2000) } }]
      }
    }
  };

  const tmpFile = '/tmp/notion-desc-payload.json';
  fs.writeFileSync(tmpFile, JSON.stringify(payload));

  try {
    execSync(
      `curl -s -X PATCH "https://api.notion.com/v1/pages/${pageId}" \
        -H "Authorization: Bearer ${NOTION_SECRET}" \
        -H "Notion-Version: 2022-06-28" \
        -H "Content-Type: application/json" \
        -d @${tmpFile}`,
      { timeout: 10000 }
    );
    return true;
  } catch (e) {
    console.error(`  Erreur: ${e.message}`);
    return false;
  }
}

// ── Main ──
console.log('\n📝 Mise à jour des descriptions réseaux sociaux\n');

for (const [num, descriptions] of Object.entries(DESCRIPTIONS)) {
  process.stdout.write(`#${num}...`);
  const pageId = getPageIdByNum(parseInt(num));
  if (!pageId) {
    console.log(' page Notion introuvable');
    continue;
  }

  const success = updateNotionTexts(pageId, descriptions);
  if (success) {
    console.log(` OK (Instagram: ${descriptions.instagram.length} chars, LinkedIn: ${descriptions.linkedin.length} chars, Facebook X: ${descriptions.facebookX.length} chars, TikTok: ${descriptions.tiktok.length} chars)`);
  }
}

console.log('\nTerminé !');

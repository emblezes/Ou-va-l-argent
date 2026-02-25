#!/usr/bin/env node
/**
 * Génère les 50 carrousels WTF (#113-#162) : 3 slides chacun (Instagram only)
 *   - Slide 1 (N°) : Accroche + GROS CHIFFRE (choc)
 *   - Slide 2 (N°bis) : Texte d'explication
 *   - Slide 3 (N°ter) : Comparaison / équivalence
 *
 * Usage:
 *   node scripts/generate-wtf-infographics.js                    # Tout
 *   node scripts/generate-wtf-infographics.js --html-only
 *   node scripts/generate-wtf-infographics.js --export-only
 *   node scripts/generate-wtf-infographics.js --notion-only
 *   node scripts/generate-wtf-infographics.js --range=1-10
 *   node scripts/generate-wtf-infographics.js --dry-run
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

// ── Config ──
const _fileConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'notion-config.json'), 'utf8'));
const config = Object.fromEntries(Object.entries(_fileConfig).map(([k, v]) => [k, process.env[k] || v]));
const NOTION_SECRET = config.NOTION_SECRET;
const DB_ID = '6cd320f7-9016-4fef-807d-9b87c2f76568';

const BASE = path.join(__dirname, '../../Production interne/Réseaux Sociaux /Infographies');
const HTML_DIR = path.join(BASE, 'Sources HTML');
const INSTA_DIR = path.join(BASE, 'Insta & Autres');

const START_NUM = 113;

// ── Helper ──
function hexToRgb(hex) {
  return `${parseInt(hex.slice(1,3),16)}, ${parseInt(hex.slice(3,5),16)}, ${parseInt(hex.slice(5,7),16)}`;
}

// ── 50 WTF Facts ──
// Chaque fait = { hook, stat, context, explain, explainAccent, equiv, equivLabel, source, color, slug, category }
const WTF_FACTS = [
  {
    hook: "Un bébé français<br>naît avec",
    stat: "50 800 €",
    context: "de dette publique.",
    explain: "Chaque enfant qui naît en France hérite {immédiatement} de cette dette. Avant même son premier biberon.",
    equivLabel: "C'est l'équivalent de",
    equiv: "2,5 ans<br>de SMIC net",
    source: "INSEE · 2025", color: "#ff4757", slug: "dette-naissance-bebe", category: "1. Dette",
  },
  {
    hook: "La dette française<br>augmente de",
    stat: "5 390 €",
    context: "chaque seconde.",
    explain: "Pendant que vous lisez cette phrase, la dette a augmenté de {16 200 €}. 24h/24, 7j/7.",
    equivLabel: "En 1 minute",
    equiv: "323 400 €<br>de dette en plus",
    source: "Min. des Finances · 2025", color: "#ff9f43", slug: "dette-5350-par-seconde", category: "1. Dette",
  },
  {
    hook: "Empilée en billets de 5 €,<br>la dette ferait",
    stat: "79 200 km",
    context: "de haut.",
    explain: "C'est plus de {6 fois le diamètre de la Terre} (12 742 km).",
    equivLabel: "Soit presque",
    equiv: "2 fois le tour<br>de la Terre",
    source: "Calcul · ouvalargent.com", color: "#a855f7", slug: "dette-pile-billets-terre", category: "1. Dette",
  },
  {
    hook: "Un élève coûte<br>à l'État",
    stat: "12 250 €",
    context: "par an.",
    explain: "Pourtant la France est {26ème en maths} au classement PISA.",
    equivLabel: "La Corée du Sud dépense",
    equiv: "9 000 €/élève<br>et est dans le top 5",
    source: "OCDE · PISA 2023", color: "#00d4ff", slug: "cout-eleve-recul-maths", category: "4. Éducation",
  },
  {
    hook: "La France rembourse<br>chaque année",
    stat: "36 Md€",
    context: "de médicaments.",
    explain: "On est les {2èmes plus gros consommateurs} de médicaments d'Europe.",
    equivLabel: "Par Français",
    equiv: "540 €<br>de médocs par an",
    source: "Assurance Maladie · 2024", color: "#ff6b9d", slug: "medicaments-36-milliards", category: "5. Santé",
  },
  {
    hook: "Chaque Français paye",
    stat: "310 €/an",
    context: "pour la SNCF.",
    explain: "Qu'il prenne le train ou non, chaque Français {finance} la SNCF.",
    equivLabel: "Total",
    equiv: "20,8 milliards<br>de financement public/an",
    source: "FIPECO · 2024", color: "#45b7d1", slug: "subvention-sncf-310-euros", category: "6. Transport",
  },
  {
    hook: "L'audiovisuel public<br>coûte",
    stat: "4 Md€",
    context: "par an.",
    explain: "France Télévisions, Radio France, Arte, France 24. Soit {2,8×} le chiffre d'affaires de Netflix France.",
    equivLabel: "Comparaison",
    equiv: "4 Md€ subventions<br>vs 1,44 Md€ CA Netflix FR",
    source: "Sénat PLF 2024 · Greffe 2023", color: "#ffd700", slug: "audiovisuel-public-4-milliards", category: "3. Dépenses",
  },
  {
    hook: "La France a plus de<br>communes que",
    stat: "toute l'UE",
    context: "réunie.",
    explain: "{36 000} communes en France. L'Allemagne n'en a que 11 000.",
    equivLabel: "Ça représente",
    equiv: "36 000 maires<br>500 000 élus locaux",
    source: "DGCL · 2024", color: "#20e3b2", slug: "communes-plus-que-ue", category: "3. Dépenses",
  },
  {
    hook: "Un salarié français<br>travaille",
    stat: "82 jours",
    context: "par an pour l'État.",
    explain: "Du 1er janvier au {23 mars}, tout votre salaire part en impôts et cotisations.",
    equivLabel: "En Suisse",
    equiv: "55 jours<br>suffisent",
    source: "Institut Molinari · 2024", color: "#ff4757", slug: "82-jours-travail-impots", category: "2. Impôts",
  },
  {
    hook: "À travail égal,<br>un Suisse gagne",
    stat: "×2",
    context: "plus net qu'un Français.",
    explain: "Et il paye {moins d'impôts}.",
    equivLabel: "Infirmière",
    equiv: "2 100 € à Paris<br>5 500 € à Genève",
    source: "OCDE · 2024", color: "#a855f7", slug: "salaire-suisse-double", category: "2. Impôts",
  },
  {
    hook: "Il n'y a plus que",
    stat: "1,7 actif",
    context: "pour payer chaque retraité.",
    explain: "En 1960 c'était {4 pour 1}. En 2050 ce sera 1,3 pour 1.",
    equivLabel: "Autrement dit",
    equiv: "1 personne paye<br>60% d'une retraite",
    source: "COR · 2024", color: "#ff9f43", slug: "ratio-actifs-retraites", category: "7. Retraites",
  },
  {
    hook: "La taxe foncière<br>à Paris a bondi de",
    stat: "+52%",
    context: "en une seule année.",
    explain: "En {2023}, d'un coup, sans prévenir.",
    equivLabel: "Moyenne nationale",
    equiv: "+30%<br>en 10 ans",
    source: "Ville de Paris · 2023", color: "#ffd700", slug: "taxe-fonciere-paris-52", category: "2. Impôts",
  },
  {
    hook: "Chaque Français<br>consomme",
    stat: "48 boîtes",
    context: "de médicaments par an.",
    explain: "Presque {une boîte par semaine}. Champions d'Europe.",
    equivLabel: "L'Allemand moyen",
    equiv: "35 boîtes<br>par an",
    source: "Assurance Maladie · 2024", color: "#ff6b9d", slug: "48-boites-medicaments", category: "5. Santé",
  },
  {
    hook: "Le Code du travail<br>français fait",
    stat: "3 500",
    context: "pages.",
    explain: "Celui de la Suisse fait {60 pages}. L'Allemagne : 800.",
    equivLabel: "Le plus épais",
    equiv: "au monde",
    source: "Légifrance · 2024", color: "#00d4ff", slug: "code-travail-3500-pages", category: "3. Dépenses",
  },
  {
    hook: "276 000 intermittents<br>coûtent",
    stat: "2 Md€",
    context: "par an.",
    explain: "Ce régime est {unique au monde}. 7 250 € par intermittent en allocations.",
    equivLabel: "Ce régime",
    equiv: "n'existe<br>nulle part ailleurs",
    source: "Unédic · 2024", color: "#a855f7", slug: "intermittents-2-milliards", category: "3. Dépenses",
  },
  {
    hook: "Il existe en France",
    stat: "1 500",
    context: "aides sociales différentes.",
    explain: "Un mille-feuille {unique au monde}. Résultat :",
    equivLabel: "Taux de non-recours",
    equiv: "30% des ayants droit<br>ne demandent rien",
    source: "DREES · 2024", color: "#45b7d1", slug: "1500-aides-sociales", category: "3. Dépenses",
  },
  {
    hook: "En 1960, Singapour<br>et la France avaient",
    stat: "le même",
    context: "niveau de vie.",
    explain: "Aujourd'hui : Singapour {65 000 $} vs France 44 000 $.",
    equivLabel: "Singapour nous a dépassés",
    equiv: "de +48%<br>en 60 ans",
    source: "Banque Mondiale · 2024", color: "#20e3b2", slug: "singapour-france-1960", category: "8. International",
  },
  {
    hook: "On paye chaque année",
    stat: "58 Md€",
    context: "d'intérêts sur la dette.",
    explain: "Sans rembourser {1 € de capital}. C'est le budget de l'Éducation Nationale.",
    equivLabel: "Chaque seconde",
    equiv: "1 840 €<br>d'intérêts",
    source: "Agence France Trésor · 2025", color: "#ff4757", slug: "interets-58-milliards", category: "1. Dette",
  },
  {
    hook: "Sur 1 litre d'essence,<br>l'État prend",
    stat: "60 cts",
    context: "de taxes.",
    explain: "Un tiers du prix à la pompe part {directement} dans les caisses de l'État.",
    equivLabel: "Un plein de 50 L",
    equiv: "30 €<br>de taxes",
    source: "DGEC · 2025", color: "#ff9f43", slug: "taxes-essence-60-centimes", category: "2. Impôts",
  },
  {
    hook: "Les droits de succession<br>atteignent",
    stat: "45%",
    context: "en France.",
    explain: "Record mondial partagé avec la Corée du Sud. {Mourir coûte cher}.",
    equivLabel: "En Italie",
    equiv: "4%<br>maximum",
    source: "OCDE · 2024", color: "#ffd700", slug: "droits-succession-45-pourcent", category: "2. Impôts",
  },
  {
    hook: "La France compte",
    stat: "5,8 M",
    context: "de fonctionnaires.",
    explain: "L'Allemagne a {17 millions d'habitants de plus}, mais moins de fonctionnaires.",
    equivLabel: "Pour 1 000 habitants",
    equiv: "86 en France<br>58 en Allemagne",
    source: "DGAFP · 2024", color: "#00d4ff", slug: "fonctionnaires-5-8-millions", category: "3. Dépenses",
  },
  {
    hook: "Le dernier budget<br>équilibré date de",
    stat: "1974",
    context: "",
    explain: "{50 ans} de déficits consécutifs. Pas un seul budget à l'équilibre.",
    equivLabel: "Le président était",
    equiv: "Giscard<br>(1er mandat)",
    source: "Min. des Finances", color: "#a855f7", slug: "dernier-budget-equilibre-1974", category: "1. Dette",
  },
  {
    hook: "La France est le",
    stat: "2ème",
    context: "pays le plus taxé au monde.",
    explain: "Derrière le Danemark. {45,4%} du PIB part en prélèvements obligatoires.",
    equivLabel: "Les États-Unis",
    equiv: "27%<br>du PIB",
    source: "OCDE · 2024", color: "#ff6b9d", slug: "france-2eme-plus-taxe", category: "2. Impôts",
  },
  {
    hook: "Retraite à 64 ans<br>après des mois de manifs.<br>En Allemagne :",
    stat: "67 ans",
    context: "depuis 2012. Sans manifs.",
    explain: "L'Allemagne est passée à 67 ans {sans une seule manifestation}.",
    equivLabel: "Au Japon",
    equiv: "65 ans<br>bientôt 70",
    source: "OCDE · 2024", color: "#45b7d1", slug: "retraite-64-vs-67-allemagne", category: "7. Retraites",
  },
  {
    hook: "La France dépense<br>pour la culture",
    stat: "15 Md€",
    context: "par an. Record d'Europe.",
    explain: "Plus que {n'importe quel pays} européen.",
    equivLabel: "Le Royaume-Uni",
    equiv: "7 milliards<br>(2 fois moins)",
    source: "Min. de la Culture · 2024", color: "#20e3b2", slug: "budget-culture-15-milliards", category: "3. Dépenses",
  },
  {
    hook: "Des foyers français<br>ne paient aucun IR :",
    stat: "44%",
    context: "",
    explain: "Les {56% restants} financent tout. Les 10% les plus riches paient 70% du total.",
    equivLabel: "Les 10% les plus riches",
    equiv: "70% de l'IR<br>total",
    source: "DGFiP · 2024", color: "#ff4757", slug: "44-pourcent-pas-impot-revenu", category: "2. Impôts",
  },
  {
    hook: "En 30 ans, la France<br>a supprimé",
    stat: "150 000",
    context: "lits d'hôpitaux.",
    explain: "De 530 000 à 380 000. Le budget santé a pourtant {augmenté de 60%}.",
    equivLabel: "Plus de budget",
    equiv: "Moins de lits",
    source: "DREES · 2024", color: "#ff9f43", slug: "lits-hopitaux-supprimes", category: "5. Santé",
  },
  {
    hook: "Impôt sur les sociétés :<br>France",
    stat: "25%",
    context: "Irlande : 12,5%.",
    explain: "Résultat : Apple, Google et Meta sont {en Irlande}, pas en France.",
    equivLabel: "Recettes IS Irlande",
    equiv: "22 Md€<br>pour 14× moins d'hab.",
    source: "Eurostat · 2024", color: "#ffd700", slug: "impot-societes-france-irlande", category: "2. Impôts",
  },
  {
    hook: "La France croule sous",
    stat: "400 000",
    context: "normes et règlements.",
    explain: "Soit {23 millions de mots}. La Bible en fait 800 000.",
    equivLabel: "En comparaison",
    equiv: "29× la Bible",
    source: "Légifrance · 2024", color: "#a855f7", slug: "400000-normes-france", category: "3. Dépenses",
  },
  {
    hook: "Le déficit public<br>en 2024 :",
    stat: "169 Md€",
    context: "",
    explain: "Plus que les budgets {Défense + Éducation + Justice} combinés.",
    equivLabel: "Chaque jour",
    equiv: "463 M€ de plus<br>qu'on ne gagne",
    source: "INSEE · 2025", color: "#ff6b9d", slug: "deficit-169-milliards-2024", category: "1. Dette",
  },
  {
    hook: "La France a encore",
    stat: "101",
    context: "préfets et 73 sous-préfets.",
    explain: "Un maillage conçu par {Napoléon}, toujours en place 220 ans plus tard.",
    equivLabel: "Coût annuel",
    equiv: "800 M€",
    source: "Min. de l'Intérieur · 2024", color: "#00d4ff", slug: "prefets-heritage-napoleonien", category: "3. Dépenses",
  },
  {
    hook: "Depuis l'an 2000,<br>la dette a été multipliée par",
    stat: "×4",
    context: "",
    explain: "De {826 milliards} à 3 482 milliards en 25 ans.",
    equivLabel: "En moyenne",
    equiv: "+106 Md€<br>de dette/an",
    source: "INSEE · 2025", color: "#45b7d1", slug: "dette-multipliee-par-4", category: "1. Dette",
  },
  {
    hook: "L'État dépense pour<br>le logement",
    stat: "38 Md€",
    context: "par an.",
    explain: "APL, PTZ, Pinel... Et les loyers n'ont {jamais été aussi hauts}.",
    equivLabel: "Les APL seules",
    equiv: "16 Md€/an",
    source: "Cour des Comptes · 2024", color: "#20e3b2", slug: "38-milliards-logement-loyers", category: "3. Dépenses",
  },
  {
    hook: "Le contribuable a payé",
    stat: "9 Md€",
    context: "pour éponger la dette d'EDF.",
    explain: "Lors de la {nationalisation} en 2023.",
    equivLabel: "Dette totale EDF",
    equiv: "54 Md€",
    source: "Cour des Comptes · 2023", color: "#ff4757", slug: "9-milliards-dette-edf", category: "3. Dépenses",
  },
  {
    hook: "Des étudiants en fac<br>échouent ou abandonnent :",
    stat: "60%",
    context: "",
    explain: "Sur 1 million d'inscriptions, {600 000} n'iront pas au bout.",
    equivLabel: "Coût d'un étudiant",
    equiv: "11 500 €/an",
    source: "MESRI · 2024", color: "#ff9f43", slug: "60-pourcent-etudiants-echec", category: "4. Éducation",
  },
  {
    hook: "Députés qui cumulent<br>deux mandats :",
    stat: "348",
    context: "et deux indemnités.",
    explain: "Plus de la {moitié} des députés touchent une double rémunération.",
    equivLabel: "Indemnité député",
    equiv: "7 637 €<br>brut/mois",
    source: "Assemblée Nationale · 2024", color: "#ffd700", slug: "deputes-cumul-mandats", category: "3. Dépenses",
  },
  {
    hook: "Des Français vivent<br>dans un désert médical :",
    stat: "30%",
    context: "",
    explain: "{6 millions} de personnes n'ont pas de médecin traitant.",
    equivLabel: "Nombre de médecins",
    equiv: "226 000<br>(identique à 2010)",
    source: "DREES · 2024", color: "#a855f7", slug: "desert-medical-30-pourcent", category: "5. Santé",
  },
  {
    hook: "Temps d'attente moyen<br>aux urgences :",
    stat: "3h",
    context: "",
    explain: "C'était 1h30 en 2010. Le temps d'attente a {doublé} en 13 ans.",
    equivLabel: "Record",
    equiv: "14h d'attente<br>à Paris en 2023",
    source: "DREES · 2024", color: "#ff6b9d", slug: "attente-urgences-3-heures", category: "5. Santé",
  },
  {
    hook: "Votre part de dette<br>vaut",
    stat: "42",
    context: "iPhones Pro Max.",
    explain: "50 800 € par habitant. Ça fait aussi {847 pleins d'essence}.",
    equivLabel: "Ou encore",
    equiv: "25 ans<br>d'abonnement Netflix",
    source: "Calcul · ouvalargent.com", color: "#00d4ff", slug: "dette-42-iphones", category: "1. Dette",
  },
  {
    hook: "De la dette française<br>est détenue par",
    stat: "55%",
    context: "des investisseurs étrangers.",
    explain: "On dépend de leur {confiance}. Si elle s'effrite, les taux montent.",
    equivLabel: "Si les taux montent de 1%",
    equiv: "+35 Md€<br>d'intérêts/an",
    source: "Agence France Trésor · 2025", color: "#45b7d1", slug: "dette-55-pourcent-etrangers", category: "1. Dette",
  },
  {
    hook: "L'industrie française<br>a fondu de",
    stat: "-40%",
    context: "en 40 ans.",
    explain: "De 24% du PIB en 1980 à 13% aujourd'hui. {2 millions d'emplois} perdus.",
    equivLabel: "L'Allemagne",
    equiv: "est restée<br>à 23%",
    source: "INSEE · 2024", color: "#20e3b2", slug: "industrie-moins-40-pourcent", category: "8. International",
  },
  {
    hook: "La dette augmente de",
    stat: "463 M€",
    context: "chaque jour.",
    explain: "19 millions par heure. {321 000 €} par minute. La dette ne dort jamais.",
    equivLabel: "Depuis janvier 2025",
    equiv: "+40 Md€",
    source: "Min. des Finances · 2025", color: "#ff4757", slug: "463-millions-dette-par-jour", category: "1. Dette",
  },
  {
    hook: "Élus locaux<br>en France :",
    stat: "520 000",
    context: "Record mondial.",
    explain: "68 millions d'habitants, 520 000 élus. Un {record absolu}.",
    equivLabel: "L'Espagne",
    equiv: "65 000 élus<br>pour 47 M d'hab.",
    source: "DGCL · 2024", color: "#ff9f43", slug: "520000-elus-locaux-record", category: "3. Dépenses",
  },
  {
    hook: "Code du travail :<br>3 500 pages, chômage 7,5%.<br>Suisse :",
    stat: "60 pages",
    context: "Chômage : 2%.",
    explain: "Plus le Code du travail est épais, plus le chômage est élevé. {Coïncidence ?}",
    equivLabel: "À vous",
    equiv: "de juger.",
    source: "OCDE · 2024", color: "#ffd700", slug: "code-travail-chomage-correlation", category: "3. Dépenses",
  },
  {
    hook: "Fraude sociale et fiscale<br>estimée à",
    stat: "~100 Md€",
    context: "par an.",
    explain: "L'État en récupère {moins de 20%}.",
    equivLabel: "Contrôleurs URSSAF",
    equiv: "1 500<br>pour toute la France",
    source: "Cour des Comptes · 2024", color: "#a855f7", slug: "fraude-100-milliards", category: "2. Impôts",
  },
  {
    hook: "Des TGV arrivent<br>en retard :",
    stat: "15%",
    context: "",
    explain: "Malgré {14 Md€} de subventions directes par an.",
    equivLabel: "Au Japon",
    equiv: "99%<br>de ponctualité",
    source: "SNCF · 2024", color: "#ff6b9d", slug: "tgv-retard-subventions", category: "6. Transport",
  },
  {
    hook: "Élèves faibles en maths :<br>il y a 20 ans 20%.<br>Aujourd'hui :",
    stat: "30%",
    context: "",
    explain: "Pendant ce temps, le budget Éducation a {augmenté de 40%}.",
    equivLabel: "Plus on dépense",
    equiv: "moins ça<br>marche",
    source: "PISA · 2023", color: "#00d4ff", slug: "eleves-faibles-maths-budget", category: "4. Éducation",
  },
  {
    hook: "L'assurance maladie<br>dépense par Français",
    stat: "3 700 €",
    context: "chaque année.",
    explain: "Soit {10 € par jour} par personne.",
    equivLabel: "Par jour",
    equiv: "10 €<br>par personne",
    source: "Assurance Maladie · 2024", color: "#45b7d1", slug: "depenses-sante-3700-par-habitant", category: "5. Santé",
  },
  {
    hook: "Même mourir coûte cher :<br>TVA sur un cercueil",
    stat: "20%",
    context: "",
    explain: "Les obsèques coûtent {5 000 €} en moyenne. 20% partent en taxes.",
    equivLabel: "Taxé",
    equiv: "de la naissance<br>à la mort",
    source: "Légifrance · 2024", color: "#20e3b2", slug: "tva-cercueil-20-pourcent", category: "2. Impôts",
  },
  {
    hook: "La dette atteint",
    stat: "117%",
    context: "du PIB.",
    explain: "Le traité de Maastricht fixe la limite à {60%}. On est presque au double.",
    equivLabel: "Pour revenir à 60%",
    equiv: "Rembourser<br>1 700 Md€",
    source: "Eurostat · 2025", color: "#ff4757", slug: "dette-117-pib-double-limite", category: "1. Dette",
  },
];

// ── HTML Templates ──

function slideChoc(fact, num) {
  const rgb = hexToRgb(fact.color);
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WTF – ${num}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--bg-deep:#06080c;--bg-mid:#0a1628;--accent:${fact.color};--accent-electric:#00d4ff}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Syne',sans-serif;background:#1a1a2e;display:flex;justify-content:center}
.infographic{width:1080px;height:1080px;position:relative;overflow:hidden}
.bg-base{position:absolute;inset:0;background:linear-gradient(145deg,var(--bg-deep) 0%,var(--bg-mid) 50%,var(--bg-deep) 100%)}
.bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(${rgb},0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(${rgb},0.03) 1px,transparent 1px);background-size:40px 40px}
.bg-glow{position:absolute;width:800px;height:800px;background:radial-gradient(circle,rgba(${rgb},0.15) 0%,transparent 60%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
.content{position:relative;z-index:1;height:100%;padding:40px 60px;display:flex;flex-direction:column;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:12px}
.logo-icon{font-family:'Instrument Serif',serif;font-size:3.5rem;color:var(--accent-electric);line-height:1}
.logo-text{font-family:'Instrument Serif',serif;font-size:1.7rem;font-style:italic;color:#fff;line-height:1}
.center-block{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}
.hook{font-family:'Instrument Serif',serif;font-size:3.5rem;font-style:italic;color:rgba(240,244,248,0.7);text-align:center;line-height:1.2}
.stat{font-family:'JetBrains Mono',monospace;font-size:10rem;font-weight:700;color:var(--accent);line-height:1;text-shadow:0 0 60px rgba(${rgb},0.4)}
.context{font-family:'Instrument Serif',serif;font-size:3.5rem;font-style:italic;color:rgba(240,244,248,0.7);text-align:center;line-height:1.2}
.footer{width:100%;text-align:center}
.website{font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:600;color:#fff}
</style></head><body>
<div class="infographic"><div class="bg-base"></div><div class="bg-grid"></div><div class="bg-glow"></div>
<div class="content">
<div class="logo"><span class="logo-icon">€</span><span class="logo-text">Où Va l'Argent ?</span></div>
<div class="center-block">
<div class="hook">${fact.hook}</div>
<div class="stat">${fact.stat}</div>
<div class="context">${fact.context}</div>
</div>
<div class="footer"><div class="website">ouvalargent.com</div></div>
</div></div></body></html>`;
}

function slideExplain(fact, num) {
  const rgb = hexToRgb(fact.color);
  const text = fact.explain.replace(/\{([^}]+)\}/g, '<span class="accent">$1</span>');
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WTF – ${num}bis</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--bg-deep:#06080c;--bg-mid:#0a1628;--accent:${fact.color};--accent-electric:#00d4ff}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Syne',sans-serif;background:#1a1a2e;display:flex;justify-content:center}
.infographic{width:1080px;height:1080px;position:relative;overflow:hidden}
.bg-base{position:absolute;inset:0;background:linear-gradient(145deg,var(--bg-deep) 0%,var(--bg-mid) 50%,var(--bg-deep) 100%)}
.bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(${rgb},0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(${rgb},0.03) 1px,transparent 1px);background-size:40px 40px}
.bg-glow{position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(${rgb},0.08) 0%,transparent 60%);top:-200px;right:-100px;pointer-events:none}
.content{position:relative;z-index:1;height:100%;padding:40px 60px;display:flex;flex-direction:column;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:12px}
.logo-icon{font-family:'Instrument Serif',serif;font-size:3.5rem;color:var(--accent-electric);line-height:1}
.logo-text{font-family:'Instrument Serif',serif;font-size:1.7rem;font-style:italic;color:#fff;line-height:1}
.center-block{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 30px}
.explain{font-family:'Instrument Serif',serif;font-size:4.8rem;color:#f0f4f8;text-align:center;line-height:1.15}
.explain .accent{color:var(--accent);font-style:italic}
.footer{width:100%;text-align:center}
.website{font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:600;color:#fff}
</style></head><body>
<div class="infographic"><div class="bg-base"></div><div class="bg-grid"></div><div class="bg-glow"></div>
<div class="content">
<div class="logo"><span class="logo-icon">€</span><span class="logo-text">Où Va l'Argent ?</span></div>
<div class="center-block">
<div class="explain">${text}</div>
</div>
<div class="footer"><div class="website">ouvalargent.com</div></div>
</div></div></body></html>`;
}

function slideEquiv(fact, num) {
  const rgb = hexToRgb(fact.color);
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WTF – ${num}ter</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--bg-deep:#06080c;--bg-mid:#0a1628;--accent:${fact.color};--accent-electric:#00d4ff}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Syne',sans-serif;background:#1a1a2e;display:flex;justify-content:center}
.infographic{width:1080px;height:1080px;position:relative;overflow:hidden}
.bg-base{position:absolute;inset:0;background:linear-gradient(145deg,var(--bg-deep) 0%,var(--bg-mid) 50%,var(--bg-deep) 100%)}
.bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(${rgb},0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(${rgb},0.03) 1px,transparent 1px);background-size:40px 40px}
.bg-glow{position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(${rgb},0.08) 0%,transparent 60%);bottom:-200px;left:-100px;pointer-events:none}
.content{position:relative;z-index:1;height:100%;padding:40px 60px;display:flex;flex-direction:column;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:12px}
.logo-icon{font-family:'Instrument Serif',serif;font-size:3.5rem;color:var(--accent-electric);line-height:1}
.logo-text{font-family:'Instrument Serif',serif;font-size:1.7rem;font-style:italic;color:#fff;line-height:1}
.center-block{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}
.equiv-label{font-family:'Instrument Serif',serif;font-size:3.5rem;font-style:italic;color:rgba(240,244,248,0.7);text-align:center}
.equiv-value{font-family:'JetBrains Mono',monospace;font-size:6rem;font-weight:700;color:var(--accent);text-align:center;line-height:1.1;text-shadow:0 0 40px rgba(${rgb},0.3)}
.footer{width:100%;text-align:center}
.website{font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:600;color:#fff}
</style></head><body>
<div class="infographic"><div class="bg-base"></div><div class="bg-grid"></div><div class="bg-glow"></div>
<div class="content">
<div class="logo"><span class="logo-icon">€</span><span class="logo-text">Où Va l'Argent ?</span></div>
<div class="center-block">
<div class="equiv-label">${fact.equivLabel}</div>
<div class="equiv-value">${fact.equiv}</div>
</div>
<div class="footer"><div class="website">ouvalargent.com</div></div>
</div></div></body></html>`;
}

// ── Export ──
async function exportSlide(browser, htmlPath, outPath) {
  const p = await browser.newPage();
  await p.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await p.goto(htmlPath, { waitUntil: 'networkidle0' });
  await (await p.$('.infographic')).screenshot({ path: outPath });
  await p.close();
}

// ── Notion ──
function uploadToCatbox(filePath) {
  try {
    const r = execSync(`curl -s --max-time 30 -F "reqtype=fileupload" -F "fileToUpload=@${filePath}" https://catbox.moe/user/api.php`, { timeout: 35000 }).toString().trim();
    return r.startsWith('https://') ? r : null;
  } catch (e) { return null; }
}

function notionRequest(method, endpoint, body) {
  try {
    const r = execSync(`curl -s --max-time 15 -X ${method} "https://api.notion.com/v1/${endpoint}" -H "Authorization: Bearer ${NOTION_SECRET}" -H "Notion-Version: 2022-06-28" -H "Content-Type: application/json" -d '${JSON.stringify(body).replace(/'/g, "'\\''")}'`, { timeout: 20000 }).toString();
    return JSON.parse(r);
  } catch (e) { return null; }
}

// ── Main ──
async function main() {
  const args = process.argv.slice(2);
  const htmlOnly = args.includes('--html-only');
  const exportOnly = args.includes('--export-only');
  const notionOnly = args.includes('--notion-only');
  const dryRun = args.includes('--dry-run');

  const rangeArg = args.find(a => a.startsWith('--range='));
  let startIdx = 0, endIdx = WTF_FACTS.length;
  if (rangeArg) {
    const [s, e] = rangeArg.split('=')[1].split('-').map(Number);
    startIdx = s - 1; endIdx = e;
  }

  const facts = WTF_FACTS.slice(startIdx, endIdx);
  console.log(`\n🔥 WTF Carrousels — ${facts.length} carrousels × 3 slides (#${START_NUM + startIdx} → #${START_NUM + endIdx - 1})\n`);

  if (dryRun) {
    for (const fact of facts) {
      const num = START_NUM + WTF_FACTS.indexOf(fact);
      console.log(`#${num} / ${num}bis / ${num}ter | ${fact.stat} | ${fact.slug} | ${fact.color}`);
    }
    return;
  }

  // Phase 1: HTML
  if (!exportOnly && !notionOnly) {
    console.log('📝 Phase 1 : Génération HTML (3 slides × ' + facts.length + ')...');
    for (const fact of facts) {
      const num = START_NUM + WTF_FACTS.indexOf(fact);
      const slug = `${num}-${fact.slug}`;
      fs.writeFileSync(path.join(HTML_DIR, `${slug}.html`), slideChoc(fact, num));
      fs.writeFileSync(path.join(HTML_DIR, `${num}bis-${fact.slug}.html`), slideExplain(fact, num));
      fs.writeFileSync(path.join(HTML_DIR, `${num}ter-${fact.slug}.html`), slideEquiv(fact, num));
      process.stdout.write(`  ✓ ${slug} (3 slides)\n`);
    }
    console.log('');
  }

  // Phase 2: Export PNG (Instagram only)
  if (!htmlOnly && !notionOnly) {
    console.log('📸 Phase 2 : Export PNG Instagram...');
    const browser = await puppeteer.launch({ headless: 'new' });
    for (let i = 0; i < facts.length; i++) {
      const fact = facts[i];
      const num = START_NUM + WTF_FACTS.indexOf(fact);
      const slug = `${num}-${fact.slug}`;
      process.stdout.write(`  [${i+1}/${facts.length}] #${num}...`);

      await exportSlide(browser, 'file://' + path.join(HTML_DIR, `${slug}.html`), path.join(INSTA_DIR, `${slug}-instagram.png`));
      await exportSlide(browser, 'file://' + path.join(HTML_DIR, `${num}bis-${fact.slug}.html`), path.join(INSTA_DIR, `${num}bis-${fact.slug}-instagram.png`));
      await exportSlide(browser, 'file://' + path.join(HTML_DIR, `${num}ter-${fact.slug}.html`), path.join(INSTA_DIR, `${num}ter-${fact.slug}-instagram.png`));
      console.log(' ✓');
    }
    await browser.close();
    console.log('');
  }

  // Phase 3: Notion (1 page par slide = N°, N°bis, N°ter)
  if (!htmlOnly && !exportOnly) {
    console.log('📋 Phase 3 : Notion pages + images...');
    for (let i = 0; i < facts.length; i++) {
      const fact = facts[i];
      const num = START_NUM + WTF_FACTS.indexOf(fact);
      const slug = `${num}-${fact.slug}`;
      process.stdout.write(`  [${i+1}/${facts.length}] #${num}...`);

      const suffixes = ['', 'bis', 'ter'];
      const titles = [
        `WTF – ${fact.stat} (choc)`,
        `WTF – ${fact.stat} (explication)`,
        `WTF – ${fact.stat} (comparaison)`,
      ];

      for (let s = 0; s < 3; s++) {
        const suf = suffixes[s];
        const fileSlug = suf ? `${num}${suf}-${fact.slug}` : slug;
        const notionNum = suf ? parseFloat(`${num}.${s}`) : num;

        // Create page
        const page = notionRequest('POST', 'pages', {
          parent: { database_id: DB_ID },
          properties: {
            'Titre': { title: [{ text: { content: titles[s] } }] },
            'N°': { number: notionNum },
            'Catégorie': { select: { name: '12. WTF' } },
            'Statut': { select: { name: 'Publié' } },
          }
        });
        if (!page?.id) continue;

        // Upload image
        const imgPath = path.join(INSTA_DIR, `${fileSlug}-instagram.png`);
        if (fs.existsSync(imgPath)) {
          const url = uploadToCatbox(imgPath);
          if (url) {
            notionRequest('PATCH', `pages/${page.id}`, {
              properties: {
                'Image Instagram': { files: [{ type: 'external', name: `${fileSlug}-instagram.png`, external: { url } }] },
              }
            });
          }
        }
        await new Promise(r => setTimeout(r, 350));
      }
      console.log(' ✓');
    }
    console.log('');
  }

  console.log('✅ Terminé !');
}

main().catch(console.error);

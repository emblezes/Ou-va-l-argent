const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
        TableOfContents } = require('docx');

// Charte OVLA
const CYAN = "0099BB";
const DARK = "0A1628";
const GOLD = "B8860B";
const RED = "D63031";
const GREEN = "00A86B";
const GRAY = "6B7B8D";
const DARK_TEXT = "1A2332";
const LIGHT_BG = "E8F4F8";
const WHITE = "FFFFFF";

// Helpers
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 }, children: [new TextRun({ text: t, bold: true, font: "Georgia", size: 36, color: DARK })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 }, children: [new TextRun({ text: t, bold: true, font: "Georgia", size: 28, color: CYAN })] });
const h3 = (t) => new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: t, bold: true, font: "Arial", size: 24, color: DARK })] });
const p = (t) => new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: t, font: "Arial", size: 22, color: DARK_TEXT })] });
const B = (t) => new TextRun({ text: t, font: "Arial", size: 22, bold: true, color: DARK_TEXT });
const N = (t) => new TextRun({ text: t, font: "Arial", size: 22, color: DARK_TEXT });
const A = (t) => new TextRun({ text: t, font: "Arial", size: 22, bold: true, color: RED });
const G = (t) => new TextRun({ text: t, font: "Arial", size: 22, bold: true, color: GREEN });
const M = (c) => new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED, children: c });
const calc = (l, f, r) => M([new TextRun({ text: l+" : ", font: "Arial", size: 20, bold: true, color: DARK_TEXT }), new TextRun({ text: f, font: "Consolas", size: 18, color: GRAY }), new TextRun({ text: " = ", font: "Arial", size: 20 }), new TextRun({ text: r, font: "Consolas", size: 18, bold: true, color: RED })]);
const src = (t) => new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Source : "+t, font: "Arial", size: 18, italics: true, color: GRAY })] });
const pb = () => new Paragraph({ children: [new PageBreak()] });

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
const hCell = (t, w) => new TableCell({ borders: cellBorders, width: { size: w, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, bold: true, size: 20, color: WHITE, font: "Arial" })] })] });
const dCell = (t, w, shade) => new TableCell({ borders: cellBorders, width: { size: w, type: WidthType.DXA }, shading: shade ? { fill: LIGHT_BG, type: ShadingType.CLEAR } : undefined, children: [new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: t, font: "Arial", size: 20, color: DARK_TEXT })] })] });
const tbl = (headers, rows, widths) => new Table({ columnWidths: widths, rows: [
  new TableRow({ tableHeader: true, children: headers.map((h,i) => hCell(h, widths[i])) }),
  ...rows.map((r,ri) => new TableRow({ children: r.map((c,ci) => dCell(c, widths[ci], ri%2===0)) }))
]});

// Numbering
const numCfg = [];
for (let i=1; i<=60; i++) numCfg.push({ reference: `b${i}`, levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] });
const bullet = (ref, texts) => new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80 }, children: typeof texts === 'string' ? [N(texts)] : texts });

// ═══════════════════════════════════════════════════
// COVER
// ═══════════════════════════════════════════════════
const cover = [
  new Paragraph({ spacing: { before: 1500 }, alignment: AlignmentType.CENTER, children: [] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "\u20AC", font: "Georgia", size: 96, bold: true, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "Ou Va l'Argent ?", font: "Georgia", size: 36, bold: true, color: DARK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "____________________", font: "Georgia", size: 28, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "RETRAITES : REUSSIR LA TRANSITION", font: "Georgia", size: 56, bold: true, color: DARK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "De la repartition pure au systeme mixte", font: "Georgia", size: 32, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Mecanisme de transition, financement de la double charge,", font: "Arial", size: 24, color: GRAY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "scenarios chiffres et comparaisons internationales", font: "Arial", size: 24, color: GRAY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "____________________", font: "Georgia", size: 28, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 500 }, children: [new TextRun({ text: "ouvalargent.com", font: "Consolas", size: 22, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Mars 2026", font: "Arial", size: 22, color: GRAY })] }),
  pb(),
];

// ═══════════════════════════════════════════════════
// PARTIE 1 : POURQUOI
// ═══════════════════════════════════════════════════
const partie1 = [
  h1("Partie 1 : Pourquoi la repartition pure ne suffit plus"),

  h2("1.1 — Le mur demographique"),
  M([N("Le systeme par repartition repose sur un pacte intergenerationnel : les actifs d'aujourd'hui financent les retraites d'aujourd'hui. Ce systeme fonctionne quand il y a beaucoup d'actifs pour peu de retraites. Or la demographie francaise s'est retournee :")]),
  tbl(["Annee", "Cotisants", "Retraites", "Ratio"], [
    ["1960", "~12 millions", "~3 millions", "4,0 pour 1"],
    ["1990", "~25 millions", "~10 millions", "2,5 pour 1"],
    ["2023", "30,4 millions", "17,1 millions", "1,79 pour 1"],
    ["2040 (proj.)", "~30 millions", "~20 millions", "1,5 pour 1"],
    ["2070 (proj.)", "~30,5 millions", "~21,6 millions", "1,41 pour 1"],
  ], [2000, 2500, 2500, 2360]),
  src("COR — Rapport annuel juin 2025 ; INSEE projections demographiques"),
  new Paragraph({ spacing: { after: 80 }, children: [] }),
  M([N("En 60 ans, le ratio est passe de "), A("4 cotisants pour 1 retraite a 1,79"), N(". En 2070, il sera de 1,41. Autrement dit : chaque actif devra financer presque un retraite entier. C'est mathematiquement insoutenable sans hausse perpetuelle des cotisations ou baisse des pensions.")]),

  h2("1.2 — Un deficit structurel qui se creuse"),
  M([N("Le COR projette un deficit croissant du systeme de retraites :")]),
  tbl(["Annee", "Deficit (Md EUR)", "% du PIB"], [
    ["2024", "-1,7 (hors produits financiers)", "-0,06 %"],
    ["2030", "-15 a -20", "-0,5 %"],
    ["2045", "-25 a -30", "-0,8 %"],
    ["2070", "-42", "-1,4 %"],
  ], [3000, 3500, 2860]),
  src("COR Rapport annuel 2025 — Projections tous scenarios"),
  M([N("Ces projections supposent que les reformes actuelles (64 ans) sont maintenues. Sans reforme supplementaire, le deficit cumule 2025-2070 depasse "), A("1 000 milliards d'euros"), N(".")]),

  h2("1.3 — La France depense plus que tous ses voisins"),
  M([N("Les depenses de retraite francaises atteignent "), A("406,9 milliards d'euros en 2024"), N(" (13,9 % du PIB, source COR), ce qui place la France au 2e rang europeen apres l'Italie (16,2 %). A titre de comparaison :")]),
  tbl(["Pays", "Depenses retraite (% PIB)", "Part capitalisation"], [
    ["Italie", "16,2 %", "~10 %"],
    ["France", "13,9 %", "~0 %"],
    ["Allemagne", "10,3 %", "~15 %"],
    ["Suede", "7,4 %", "~35 %"],
    ["Pays-Bas", "5,5 %", "~70 %"],
    ["Australie", "2,3 %", "~90 %"],
  ], [3000, 3000, 3360]),
  src("OCDE — Pensions at a Glance 2025"),
  M([N("Les pays qui depensent le moins en repartition sont ceux qui ont "), B("developpe la capitalisation"), N(". Ce n'est pas un hasard : la capitalisation transfere une partie du financement vers les rendements de marche, delestant le budget public.")]),

  h2("1.4 — Le rendement implicite de la repartition s'effondre"),
  M([N("Le rendement de la repartition depend de la croissance de la masse salariale (= croissance des salaires + croissance de l'emploi). Or :")]),
  bullet("b1", [B("Rendement implicite de la repartition : ~1,5 % nominal"), N(" (croissance masse salariale tendancielle)")]),
  bullet("b1", [B("Rendement historique de la capitalisation : 5-8 % nominal"), N(" sur 20-30 ans (voir Partie 5)")]),
  M([N("Sur 40 ans de carriere, la difference est colossale :")]),
  calc("100 EUR/mois a 1,5% pendant 40 ans", "100 x ((1,00125^480-1)/0,00125)", "~73 000 EUR"),
  calc("100 EUR/mois a 6% pendant 40 ans", "100 x ((1,005^480-1)/0,005)", "~199 000 EUR"),
  M([N("A cotisation egale, la capitalisation genere "), A("2,7 fois plus de capital"), N(" que la repartition. C'est la puissance des interets composes.")]),
  src("Aaron (1966) — The Social Insurance Paradox ; Jordà et al. (2019) — Rate of Return on Everything"),
  pb(),
];

// ═══════════════════════════════════════════════════
// PARTIE 2 : LES MODELES
// ═══════════════════════════════════════════════════
const partie2 = [
  h1("Partie 2 : Ce que les autres pays ont fait"),

  h2("2.1 — Suede : le modele de reference (1994)"),
  h3("Le systeme"),
  bullet("b2", "Cotisation totale : 18,5 % du salaire brut"),
  bullet("b2", [B("16 % en repartition"), N(" (comptes notionnels individuels — NDC)")]),
  bullet("b2", [B("2,5 % en capitalisation"), N(" (fonds par defaut AP7 ou choix parmi ~800 fonds)")]),
  bullet("b2", "Mecanisme d'equilibrage automatique (ABM) : si le ratio actifs/passifs du systeme passe sous 1, les pensions sont automatiquement reduites. Aucune decision politique requise."),
  h3("La transition"),
  bullet("b3", "Cout de transition quasi-nul : la Suede disposait deja de fonds tampons (AP1-AP4) representant ~40 % du PIB (750 Md SEK)"),
  bullet("b3", "La part capitalisation (2,5 %) etait financee par redirection des cotisations existantes, pas par cotisation supplementaire"),
  bullet("b3", "Mise en oeuvre progressive : generation de transition (personnes nees entre 1938 et 1953) = systeme mixte ancien/nouveau"),
  h3("Les resultats (25 ans apres)"),
  bullet("b4", [B("Taux de remplacement : ~79 %"), N(" (repartition 86 % + capitalisation = complement)")]),
  bullet("b4", [B("Rendement AP7 : 13,5 % nominal sur 10 ans"), N(" (meilleur fonds par defaut au monde)")]),
  bullet("b4", "Zero crise politique : l'ABM s'est declenche 2 fois (2010, 2014) sans debat public majeur"),
  bullet("b4", "Taux de pauvrete des retraites : 11 % (similaire a la France)"),
  h3("Lecons pour la France"),
  bullet("b5", [G("A reproduire :"), N(" comptes notionnels, ABM automatique, fonds par defaut performant")]),
  bullet("b5", [A("Limite :"), N(" la Suede avait des reserves massives. La France n'en a quasiment pas (FRR = 20 Md EUR)")]),
  src("Swedish Pension Agency — Orange Report ; Finnish Centre for Pensions 2024"),

  h2("2.2 — Australie : la montee en charge sur 33 ans (1992)"),
  h3("Le systeme"),
  bullet("b6", "Superannuation : cotisation 100 % employeur, 0 % salarie"),
  bullet("b6", "Montee en charge tres progressive :"),
  tbl(["Periode", "Taux", "Hausse"], [
    ["1992-1993", "3 %", "Lancement"],
    ["1993-2002", "3 % a 9 %", "+0,5-1 %/an"],
    ["2002-2013", "9 %", "Gel (pression politique)"],
    ["2013-2025", "9 % a 12 %", "+0,5 %/an"],
  ], [3000, 3000, 3360]),
  h3("Les resultats"),
  bullet("b7", [B("3 600 milliards AUD accumules"), N(" en 30 ans (~2 400 Md USD)")]),
  bullet("b7", "Rendement moyen des super funds : 7-10 %/an sur 20 ans"),
  bullet("b7", "Taux de remplacement actuel : 35-40 % (monte a 50 % projete en 2050)"),
  bullet("b7", "Couverture : >98 % des salaries"),
  h3("Lecons pour la France"),
  bullet("b8", [G("A reproduire :"), N(" montee en charge TRES progressive (pas de choc), financement employeur")]),
  bullet("b8", [A("Limite :"), N(" taux de remplacement insuffisant seul (35 %), necessite une pension publique en complement")]),
  src("APRA — Annual Fund-level Superannuation Statistics ; Australian Treasury"),

  h2("2.3 — Chili : l'exemple a ne pas suivre (1981)"),
  bullet("b9", "Basculement total vers la capitalisation (0 % repartition)"),
  bullet("b9", [A("Cout de transition : 2,5 a 5,7 % du PIB/an pendant 30 ans"), N(" (~200-250 Md USD cumules)")]),
  bullet("b9", "'Bono de reconocimiento' : obligations d'Etat a 4 % pour compenser les droits acquis"),
  bullet("b9", "Commissions des fonds : 2-3 %/an = 10-15 % des actifs perdus sur 30 ans"),
  bullet("b9", [A("Pensions effectives : 30-40 % du dernier salaire"), N(" (totalement insuffisant)")]),
  bullet("b9", "Retraits d'urgence COVID 2020-21 : 14 % du PIB preleve sur les comptes"),
  bullet("b9", "Contre-reforme 2022 : retour partiel a la repartition"),
  M([A("Conclusion : ne JAMAIS faire de basculement total. Le modele mixte (Suede/Australie) est le seul viable.")]),
  src("Banco Central de Chile ; World Bank — Pension Reform Primer"),

  h2("2.4 — Les echecs : Pologne et Hongrie"),
  bullet("b10", [B("Pologne (1999-2014) :"), N(" systeme a 3 piliers (ZUS 12,22 % + OFE 7,3 %). Nationalise en 2014 apres crise budgetaire. Transfert force de 153 Md PLN (51,5 % des actifs) vers le regime public. Duree : 15 ans seulement.")]),
  bullet("b10", [B("Hongrie (1998-2010) :"), N(" 3 piliers similaires. Nationalise en 2010 par Viktor Orban pour combler le deficit. Duree : 12 ans. Moody's a degrade la note immediatement.")]),
  M([A("Lecon : sans consensus politique large (>80 %) et sans verrou constitutionnel, une reforme capitalisation peut etre annulee en une legislature.")]),
  pb(),
];

// ═══════════════════════════════════════════════════
// PARTIE 3 : MECANISME DE TRANSITION (COEUR)
// ═══════════════════════════════════════════════════
const partie3 = [
  h1("Partie 3 : Le mecanisme de transition pour la France"),
  M([B("Cette partie est le coeur du rapport."), N(" Elle detaille annee par annee comment passer d'un systeme 100 % repartition a un systeme mixte 85 %/15 %, avec trois scenarios chiffres.")]),

  h2("3.1 — Donnees de base"),
  tbl(["Parametre", "Valeur 2024", "Source"], [
    ["Masse salariale brute (tous secteurs)", "~1 400 Md EUR", "URSSAF/ACOSS"],
    ["Cotisations retraite collectees", "~392 Md EUR (28% du brut)", "COR 2025"],
    ["Depenses de retraite", "406,9 Md EUR", "COR 2025"],
    ["Deficit (hors produits financiers)", "-1,7 Md EUR", "COR 2025"],
    ["Reserves FRR", "20 Md EUR", "FRR 2024"],
    ["Reserves AGIRC-ARRCO", "85,6 Md EUR", "AGIRC-ARRCO 2024"],
    ["Nombre de cotisants", "30,4 millions", "COR 2025"],
    ["Nombre de retraites", "17,1 millions", "COR 2025"],
  ], [3500, 3000, 2860]),
  src("COR Rapport annuel juin 2025 ; URSSAF Open Data ; FRR ; AGIRC-ARRCO"),

  h2("3.2 — Le principe : ne pas creer de choc"),
  p("Le modele propose s'inspire de la Suede et de l'Australie. Les principes fondamentaux :"),
  bullet("b11", [B("Progressivite : "), N("montee en charge sur 10 ans, pas de basculement brutal")]),
  bullet("b11", [B("Systeme mixte : "), N("jamais plus de 15 % en capitalisation (le reste en repartition)")]),
  bullet("b11", [B("Garantie des droits acquis : "), N("aucun retraite actuel n'est touche. Seuls les actifs < 50 ans entrent dans le nouveau systeme")]),
  bullet("b11", [B("Mecanisme automatique : "), N("equilibrage suedois (ABM) pour eviter les crises politiques")]),
  bullet("b11", [B("Fonds par defaut public : "), N("gestion collective avec frais < 0,3 %/an (pas de fonds prives couteux)")]),

  h2("3.3 — Trois scenarios de montee en charge"),
  h3("Scenario A : Prudent (1 % du brut en 10 ans)"),
  tbl(["Annee", "Taux capitalisation", "Montant redirige/an", "Manque repartition/an"], [
    ["An 1 (2028)", "0,25 %", "3,5 Md EUR", "3,5 Md EUR"],
    ["An 2", "0,5 %", "7 Md EUR", "7 Md EUR"],
    ["An 5", "0,75 %", "10,5 Md EUR", "10,5 Md EUR"],
    ["An 10 (2037)", "1,0 %", "14 Md EUR", "14 Md EUR"],
    ["An 10+ (croisiere)", "1,0 %", "14 Md EUR", "14 Md EUR"],
  ], [2000, 2500, 2500, 2360]),
  calc("Cout de transition total (40 ans)", "14 Md x 40", "~560 Md EUR cumules"),
  calc("Capital accumule par salarie median (40 ans, 6%)", "21 EUR/mois x ((1,005^480-1)/0,005)", "~40 600 EUR = 135 EUR/mois de rente"),

  h3("Scenario B : Modere (2,5 % du brut en 10 ans) — RECOMMANDE"),
  tbl(["Annee", "Taux capitalisation", "Montant redirige/an", "Manque repartition/an"], [
    ["An 1 (2028)", "0,5 %", "7 Md EUR", "7 Md EUR"],
    ["An 2", "1,0 %", "14 Md EUR", "14 Md EUR"],
    ["An 3", "1,5 %", "21 Md EUR", "18 Md EUR*"],
    ["An 5", "2,0 %", "28 Md EUR", "15 Md EUR*"],
    ["An 7", "2,5 %", "35 Md EUR", "12 Md EUR*"],
    ["An 10 (2037)", "2,5 %", "35 Md EUR", "10 Md EUR*"],
    ["An 15 (2042)", "2,5 %", "37 Md EUR", "5 Md EUR*"],
    ["An 20 (2047)", "2,5 %", "38 Md EUR", "0 (autofinancement)"],
  ], [2000, 2500, 2500, 2360]),
  M([N("* Le manque a gagner pour la repartition diminue grace aux economies du recul de l'age (65 ans = +18 Md/an) et de l'alignement des regimes (+3-5 Md/an).")]),
  calc("Cout de transition cumule (20 ans)", "~200 Md EUR", "(decroissant : 130 Md les 10 premieres annees, 70 Md les 10 suivantes)"),
  calc("Capital accumule par salarie median (40 ans, 6%)", "52,50 EUR/mois x ((1,005^480-1)/0,005)", "~102 000 EUR = 340 EUR/mois de rente"),

  h3("Scenario C : Ambitieux (5 % du brut en 10 ans)"),
  tbl(["Annee", "Taux capitalisation", "Montant redirige/an", "Manque repartition/an"], [
    ["An 1 (2028)", "1 %", "14 Md EUR", "14 Md EUR"],
    ["An 3", "2 %", "28 Md EUR", "25 Md EUR"],
    ["An 5", "3,5 %", "49 Md EUR", "30 Md EUR"],
    ["An 10 (2037)", "5,0 %", "70 Md EUR", "35 Md EUR"],
  ], [2000, 2500, 2500, 2360]),
  calc("Cout de transition cumule (30 ans)", "~400 Md EUR", "(tres eleve)"),
  calc("Capital accumule par salarie median (40 ans, 6%)", "105 EUR/mois x ((1,005^480-1)/0,005)", "~204 000 EUR = 680 EUR/mois de rente"),
  M([A("Attention : "), N("ce scenario necessite 30-35 Md EUR/an de financement supplementaire, soit l'equivalent du budget de la Defense. Probablement irrealiste politiquement et budgetairement dans le contexte francais (deficit a 5,8 % du PIB).")]),

  h2("3.4 — Notre recommandation : le Scenario B"),
  M([N("Le scenario B (2,5 % en 10 ans) est le seul qui combine :")]),
  bullet("b12", [G("Realisme budgetaire :"), N(" cout de transition de 10-14 Md EUR/an, finan\u00e7able (voir Partie 4)")]),
  bullet("b12", [G("Impact significatif :"), N(" 340 EUR/mois de rente complementaire pour le salaire median")]),
  bullet("b12", [G("Precedent reussi :"), N(" c'est exactement le taux suedois (2,5 %), prouve sur 25 ans")]),
  bullet("b12", [G("Acceptabilite politique :"), N(" pas de baisse de pension pour les retraites actuels")]),
  pb(),

  h2("3.5 — Calendrier legislatif detaille"),
  tbl(["Echeance", "Action", "Vehicule legislatif"], [
    ["T1 2027", "Discours presidentiel : annonce de la reforme", "Communication"],
    ["T2 2027", "Convention citoyenne sur les retraites (3 mois)", "Decret"],
    ["T4 2027", "Projet de loi organique 'Retraite mixte'", "Loi organique"],
    ["T1 2028", "Vote au Parlement (majorite qualifiee souhaitee)", "49.3 en dernier recours"],
    ["T2 2028", "Creation du Fonds France Retraite (FFR)", "Decret + arrete"],
    ["T3 2028", "Premiere cotisation capitalisation (0,5%)", "Mise en oeuvre"],
    ["2028-2037", "Montee en charge progressive jusqu'a 2,5%", "Decrets annuels"],
    ["2032", "Premier bilan quinquennal + ajustements", "Rapport COR"],
    ["2042", "Point d'equilibrage : la transition s'autofinance", "—"],
  ], [2000, 4000, 3360]),
  pb(),
];

// ═══════════════════════════════════════════════════
// PARTIE 4 : FINANCEMENT DOUBLE CHARGE (COEUR)
// ═══════════════════════════════════════════════════
const partie4 = [
  h1("Partie 4 : Financer la double charge"),
  M([B("Le probleme central :"), N(" pendant la transition, les actifs doivent a la fois financer les pensions en cours (repartition) ET epargner pour leur propre retraite (capitalisation). C'est la 'double charge'.")]),
  M([N("Dans le scenario B recommande, le manque a gagner pour la repartition est de "), A("7 a 14 Md EUR/an les premieres annees"), N(", decroissant progressivement. Sur 20 ans, le cout cumule est de ~200 Md EUR.")]),
  M([B("Bonne nouvelle : ce montant est finan\u00e7able."), N(" Voici les 7 sources de financement identifiees, avec leur chiffrage precis.")]),

  h2("4.1 — Source 1 : Recul de l'age legal a 65 ans"),
  M([N("Comme detaille dans la Partie 3, le recul de l'age de depart de 64 a 65 ans genere des economies majeures :")]),
  calc("Economies par annee de recul", "~0,5 point de PIB", "~14 Md EUR"),
  calc("Impact de 64 a 65 ans", "~7 Md EUR/an (montee progressive)", "puis 14 Md EUR en croisiere"),
  M([N("C'est la source de financement la plus importante. Elle couvre a elle seule "), B("50 a 100 % du cout de transition"), N(" selon les annees.")]),
  tbl(["Annee", "Economies age 65", "Cout transition (Sc. B)", "Solde"], [
    ["An 1 (2028)", "2 Md EUR", "7 Md EUR", "-5 Md EUR"],
    ["An 3 (2030)", "6 Md EUR", "18 Md EUR", "-12 Md EUR"],
    ["An 5 (2032)", "12 Md EUR", "15 Md EUR", "-3 Md EUR"],
    ["An 7 (2034)", "16 Md EUR", "12 Md EUR", "+4 Md EUR"],
    ["An 10 (2037)", "18 Md EUR", "10 Md EUR", "+8 Md EUR"],
  ], [2000, 2500, 2500, 2360]),
  src("COR Rapport 2025 ; France Info — Estimations COR recul age"),
  M([G("A partir de l'annee 7, le recul de l'age finance integralement la transition ET genere un excedent.")]),

  h2("4.2 — Source 2 : Fonds de Reserve des Retraites (FRR)"),
  M([N("Le FRR a ete cree en 2001 precisement pour financer la transition demographique :")]),
  tbl(["Parametre", "Valeur", "Source"], [
    ["Actifs geres", "20 Md EUR (2024)", "FRR Rapport annuel"],
    ["Rendement depuis creation", "3,7 % nominal = 1,7 % reel", "FRR"],
    ["Allocation", "80 % performance / 20 % couverture", "FRR"],
    ["Ponctions CADES (2011-2024)", "-29,4 Md EUR (2,1 Md/an)", "CADES/FRR"],
    ["Versements CADES restants", "Jusqu'en 2033", "Loi organique"],
  ], [3500, 3000, 2860]),
  M([N("Le FRR verse actuellement 2,1 Md EUR/an a la CADES (remboursement dette sociale). Ces versements s'arretent en 2033. A partir de cette date, le FRR peut etre integralement fle\u0301che vers le financement de la transition.")]),
  calc("Utilisation FRR (2028-2033)", "Mobilisation partielle de 5 Md EUR", "soit 1 Md EUR/an"),
  calc("Utilisation FRR (2033-2042)", "Mobilisation totale : 20 Md + rendements", "~3 Md EUR/an"),
  src("Fonds de Reserve pour les Retraites — fondsdereserve.fr"),

  h2("4.3 — Source 3 : Suppression de l'abattement 10 % sur les pensions"),
  M([N("Les retraites beneficient d'un abattement forfaitaire de 10 % sur leurs pensions pour le calcul de l'impot sur le revenu, plafonne a ~4 321 EUR/an. C'est une niche fiscale qui coute cher :")]),
  calc("Cout pour l'Etat", "~4,5 Md EUR/an", "(DGFiP — Evaluation depenses fiscales)"),
  M([N("Supprimer cet abattement "), B("ne reduit pas les pensions"), N(" : les retraites percoivent le meme montant, mais paient un peu plus d'impot. C'est un effort de solidarite intergenerationnelle.")]),
  M([N("Variante : reduction de l'abattement de 10 % a 5 % = economie de ~2,2 Md EUR/an (plus acceptable politiquement).")]),
  src("DGFiP — Voies et Moyens Tome II ; Fondapol 2025"),

  h2("4.4 — Source 4 : Hausse ciblee de CSG"),
  M([N("La CSG est l'impot le plus juste (assiette large, tous revenus). Une hausse minime peut generer des recettes importantes :")]),
  calc("Rendement de 0,1 point de CSG", "~3 Md EUR/an", "(estimation DGFiP)"),
  M([N("Proposition : hausse de 0,2 point de CSG exclusivement flechee vers le Fonds France Retraite :")]),
  calc("Recette supplementaire", "3 Md x 2", "~6 Md EUR/an"),
  M([N("Cette hausse represente "), B("~4 EUR/mois pour un salaire median"), N(". En contrepartie, chaque cotisant recevra ~340 EUR/mois de rente a la retraite. Le ratio cout/benefice est de 1 pour 85.")]),
  src("DGFiP ; FIPECO — La CSG"),

  h2("4.5 — Source 5 : Alignement des regimes speciaux"),
  M([N("L'alignement de tous les regimes speciaux sur le regime general genere des economies estimees a :")]),
  calc("Economies alignement", "3 a 5 Md EUR/an", "(COR / Cour des Comptes)"),
  M([N("Cela concerne les regimes de la RATP, SNCF, EDF, fonctionnaires (taux employeur Etat a 74,3 % vs 16,5 % dans le prive), etc.")]),
  src("Cour des Comptes — Rapport Securite sociale ; COR"),

  h2("4.6 — Source 6 : Reserves AGIRC-ARRCO"),
  M([N("Le regime complementaire AGIRC-ARRCO dispose de reserves considerables :")]),
  calc("Reserves AGIRC-ARRCO", "85,6 Md EUR (2024)", ""),
  M([N("Ces reserves sont gerees par les partenaires sociaux et servent de 'coussin' en cas de crise. Une partie pourrait etre mobilisee pour amorcer la capitalisation :")]),
  calc("Mobilisation partielle (10 %)", "85,6 Md x 10%", "8,6 Md EUR (one-shot)"),
  M([N("Cette mobilisation est politiquement delicate (gouvernance paritaire) mais serait justifiee par la creation d'un nouveau pilier capitalisation qui beneficie aux memes assures.")]),
  src("AGIRC-ARRCO — Rapport financier 2024"),

  h2("4.7 — Source 7 : Cession d'actifs publics"),
  M([N("L'Etat detient des participations financieres considerables :")]),
  tbl(["Actif", "Valeur estimee", "Realiste a ceder"], [
    ["BPI France", "~35 Md EUR", "Non (strategique)"],
    ["Participations cotees (EDF, Engie...)", "~50 Md EUR", "10-15 Md EUR"],
    ["Immobilier de l'Etat (sous-utilise)", "~40 Md EUR", "5-10 Md EUR"],
    ["Total mobilisable", "~125 Md EUR", "15-25 Md EUR"],
  ], [3500, 3000, 2860]),
  M([N("Une cession progressive de 15-25 Md EUR sur 10 ans = 1,5-2,5 Md EUR/an.")]),
  src("APE — Agence des Participations de l'Etat ; Cour des Comptes"),

  h2("4.8 — SYNTHESE : le plan de financement consolide"),
  M([B("Scenario B (2,5 %) — Besoin de financement : 7 a 14 Md EUR/an (decroissant)")]),
  tbl(["Source de financement", "Montant annuel", "Type", "Horizon"], [
    ["1. Economies recul age 65 ans", "2 a 18 Md EUR", "Permanent", "2028-2037"],
    ["2. Fonds de Reserve (FRR)", "1 a 3 Md EUR", "Stock (epuisable)", "2028-2042"],
    ["3. Abattement 10% pensions (-5pts)", "2,2 Md EUR", "Permanent", "2028+"],
    ["4. CSG +0,2 point", "6 Md EUR", "Permanent", "2028+"],
    ["5. Alignement regimes speciaux", "3-5 Md EUR", "Permanent", "2029+"],
    ["6. Reserves AGIRC-ARRCO (10%)", "0,9 Md EUR/an (sur 10 ans)", "Stock", "2028-2037"],
    ["7. Cessions actifs publics", "1,5-2,5 Md EUR", "Stock", "2028-2037"],
    ["TOTAL DISPONIBLE", "16,6 a 37,6 Md EUR/an", "", ""],
    ["BESOIN (Scenario B)", "7 a 14 Md EUR/an", "", ""],
    ["MARGE DE SECURITE", "+2,6 a +23,6 Md EUR/an", "", ""],
  ], [3500, 2500, 1500, 1860]),
  new Paragraph({ spacing: { after: 80 }, children: [] }),
  M([G("Conclusion : le financement est non seulement possible, mais il degage une marge de securite significative."), N(" Meme dans le pire scenario (economies age 65 minimales + resistance politique sur CSG et abattement), au moins 3 des 7 sources suffisent a couvrir le besoin.")]),

  h2("4.9 — Matrice de combinaison : quels leviers activer selon le contexte politique ?"),
  tbl(["Scenario politique", "Leviers actives", "Financement/an"], [
    ["Consensuel (>60% majorite)", "1+2+3+4+5", "15-34 Md EUR"],
    ["Modere (majorite simple)", "1+2+4+5", "12-32 Md EUR"],
    ["Contraint (opposition forte)", "1+2+7", "4,5-23,5 Md EUR"],
    ["Minimum vital", "1 seul (recul age)", "2-18 Md EUR"],
  ], [3000, 3500, 2860]),
  M([N("Meme dans le scenario le plus contraint (recul de l'age seul), la transition est finan\u00e7able a partir de l'annee 7. Les 6 premieres annees necessitent un apport supplementaire de ~5 Md EUR/an, couvert par le FRR et les cessions d'actifs.")]),
  pb(),
];

// ═══════════════════════════════════════════════════
// PARTIE 5 : SIMULATIONS
// ═══════════════════════════════════════════════════
const partie5 = [
  h1("Partie 5 : Simulations individuelles"),
  M([N("Combien un salarie accumulerait-il avec le scenario B (2,5 % du brut en capitalisation) ? Voici les projections sur 40 ans de carriere, pour 3 profils et 3 hypotheses de rendement.")]),

  h2("5.1 — Hypotheses"),
  bullet("b13", [B("SMIC brut : "), N("1 767 EUR/mois = 21 204 EUR/an")]),
  bullet("b13", [B("Salaire median : "), N("2 100 EUR brut/mois = 25 200 EUR/an")]),
  bullet("b13", [B("Cadre : "), N("4 500 EUR brut/mois = 54 000 EUR/an")]),
  bullet("b13", "Cotisation : 2,5 % du brut"),
  bullet("b13", "Duree : 40 ans"),
  bullet("b13", "Taux de conversion rente : 4 % du capital (norme OCDE)"),
  bullet("b13", "Rendements testes : 4 % (prudent), 6 % (median), 8 % (optimiste)"),

  h2("5.2 — Capital accumule et rente mensuelle"),
  tbl(["Profil", "Cotisation/mois", "Capital a 4%", "Capital a 6%", "Capital a 8%"], [
    ["SMIC (1 767 EUR)", "44 EUR", "51 000 EUR", "86 000 EUR", "150 000 EUR"],
    ["Median (2 100 EUR)", "52,50 EUR", "61 000 EUR", "102 000 EUR", "178 000 EUR"],
    ["Cadre (4 500 EUR)", "112,50 EUR", "131 000 EUR", "219 000 EUR", "382 000 EUR"],
  ], [2200, 1800, 1800, 1800, 1760]),
  new Paragraph({ spacing: { after: 80 }, children: [] }),
  tbl(["Profil", "Rente a 4%/an", "Rente a 6%/an", "Rente a 8%/an"], [
    ["SMIC", "170 EUR/mois", "287 EUR/mois", "500 EUR/mois"],
    ["Median", "203 EUR/mois", "340 EUR/mois", "593 EUR/mois"],
    ["Cadre", "437 EUR/mois", "730 EUR/mois", "1 273 EUR/mois"],
  ], [2500, 2300, 2300, 2260]),
  src("Calcul : formule annuite constante C x ((1+r)^n - 1)/r. Taux mensualise. Rente = capital x 4% / 12."),
  new Paragraph({ spacing: { after: 80 }, children: [] }),
  M([N("Pour le salaire median, avec un rendement de 6 % (hypothese raisonnable sur 40 ans, inferieure au rendement historique de AP7 a 13,5 %) :")]),
  M([B("340 EUR/mois de rente complementaire"), N(", en plus de la pension de repartition (~1 200-1 400 EUR/mois). Le taux de remplacement total passerait de ~50 % (repartition seule) a "), G("~65-70 % (systeme mixte)"), N(".")]),

  h2("5.3 — Comparaison avec le FRR actuel"),
  M([N("Le FRR, cree en 2001, n'a rapporte que 3,7 % nominal (1,7 % reel) en 23 ans. Pourquoi le nouveau fonds ferait-il mieux ?")]),
  bullet("b14", [B("Allocation d'actifs :"), N(" le FRR est contraint par ses versements CADES (80% performance / 20% couverture). Un fonds retraite a 40 ans d'horizon peut etre investi a 90% en actions.")]),
  bullet("b14", [B("Horizon de temps :"), N(" le FRR verse 2,1 Md/an a la CADES = il doit rester liquide. Un fonds capitalisation a 40 ans d'horizon peut supporter la volatilite.")]),
  bullet("b14", [B("Benchmark :"), N(" AP7 Suede (90% actions) = 13,5% sur 10 ans. CPPIB Canada (65% actions) = 9,1% reel. CalPERS USA = 7,1% reel sur 20 ans.")]),
  M([N("La cle : un fonds par defaut investi massivement en actions mondiales (70-90 %), avec basculement progressif vers les obligations a l'approche de la retraite (cycle de vie).")]),
  pb(),
];

// ═══════════════════════════════════════════════════
// PARTIE 6 : GOUVERNANCE ET RISQUES
// ═══════════════════════════════════════════════════
const partie6 = [
  h1("Partie 6 : Gouvernance et gestion des risques"),

  h2("6.1 — Le Fonds France Retraite (FFR)"),
  p("Structure proposee :"),
  tbl(["Parametre", "Proposition"], [
    ["Statut juridique", "Etablissement public ad hoc (comme le FRR)"],
    ["Gouvernance", "Conseil tripartite : 1/3 Etat + 1/3 partenaires sociaux + 1/3 independants"],
    ["Frais de gestion", "Plafond legal : 0,3 %/an (vs 2-3% au Chili)"],
    ["Fonds par defaut", "Cycle de vie : 90% actions (jeunes) a 30% actions (pre-retraite)"],
    ["Choix individuel", "Option : 5-10 fonds agrees (concurrence encadree)"],
    ["Transparence", "Releve annuel individuel obligatoire (comme l'Orange Report suedois)"],
    ["Verrou constitutionnel", "Inscription dans la Constitution : les actifs capitalises sont incessibles et insaisissables"],
  ], [3000, 6360]),

  h2("6.2 — Les risques et les reponses"),
  h3("Risque 1 : Krach boursier"),
  bullet("b15", [N("Un krach de -40 % (type 2008) reduirait le capital de 102 000 EUR a 61 000 EUR pour le salarie median")]),
  bullet("b15", [B("Reponse :"), N(" (a) Horizon de 40 ans = le temps de recuperer (apres 2008, les marches ont retrouve leur niveau en 5 ans). (b) Fonds cycle de vie = les pre-retraites sont en obligations, non affectes. (c) Mecanisme de garantie plancher : l'Etat garantit au minimum le capital cotise (cout : ~1-2 Md/an)")]),

  h3("Risque 2 : Nationalisation (cas Pologne/Hongrie)"),
  bullet("b16", [B("Reponse :"), N(" verrou constitutionnel. Inscription dans l'article 34 de la Constitution : 'les droits acquis au titre de la capitalisation retraite sont des droits de propriete individuels, insaisissables et imprescriptibles'. Necessite une revision constitutionnelle = vote 3/5 du Congres.")]),

  h3("Risque 3 : Frais excessifs"),
  bullet("b17", [B("Reponse :"), N(" plafond legal de 0,3 %/an (vs 1,5 % en moyenne pour l'assurance-vie en France). Le fonds par defaut public est gere avec des frais de ~0,10 % (comme AP7 en Suede). Sur 40 ans, des frais de 0,3 % vs 1,5 % representent 20 % de capital en plus.")]),

  h3("Risque 4 : Inegalites hommes-femmes"),
  bullet("b18", [N("En Australie, les femmes ont 25,7 % de capital en moins que les hommes (carrieres interrompues)")]),
  bullet("b18", [B("Reponse :"), N(" (a) Credits de cotisation pour conge parental (l'Etat cotise a la place). (b) Partage 50/50 du capital en cas de divorce. (c) Plancher de rente garanti (= minimum vieillesse rehausse)")]),
  pb(),
];

// ═══════════════════════════════════════════════════
// CONCLUSION
// ═══════════════════════════════════════════════════
const conclusion = [
  h1("Conclusion : oser la transition"),
  M([N("La transition vers un systeme mixte n'est pas un saut dans l'inconnu. C'est une reforme testee, eprouvee et reussie dans les pays les plus developpes du monde.")]),
  p("Les chiffres sont clairs :"),
  bullet("b19", [B("Le systeme actuel est condamne"), N(" : ratio cotisants/retraites de 1,79 aujourd'hui, 1,41 en 2070. Deficit cumule de plus de 1 000 milliards d'euros d'ici 2070.")]),
  bullet("b19", [B("La capitalisation rapporte 3 a 5 fois plus"), N(" que la repartition sur 40 ans (6 % vs 1,5 % de rendement)")]),
  bullet("b19", [B("La transition est finan\u00e7able"), N(" : 7 sources identifiees couvrant 16 a 38 Md EUR/an, pour un besoin de 7 a 14 Md EUR/an")]),
  bullet("b19", [B("Le modele suedois fonctionne depuis 25 ans"), N(" avec exactement le meme taux (2,5 %)")]),
  new Paragraph({ spacing: { after: 200 }, children: [] }),
  M([N("Le vrai risque n'est pas de reformer. Le vrai risque, c'est de "), A("ne rien faire"), N(" et de laisser le systeme s'effondrer sous son propre poids.")]),
  new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "____________________", font: "Georgia", size: 28, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
    new TextRun({ text: "\u20AC ", font: "Georgia", size: 28, bold: true, color: CYAN }),
    new TextRun({ text: "Ou Va l'Argent ?", font: "Georgia", size: 24, bold: true, color: DARK }),
  ] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "ouvalargent.com", font: "Consolas", size: 20, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "Sources : COR, OCDE, Swedish Pension Agency, APRA, URSSAF, FRR, AGIRC-ARRCO, DGFiP, Fondapol, Institut Montaigne", font: "Arial", size: 18, color: GRAY, italics: true })] }),
];

// ═══════════════════════════════════════════════════
// DOCUMENT
// ═══════════════════════════════════════════════════
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", run: { size: 56, bold: true, color: DARK, font: "Georgia" }, paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 36, bold: true, color: DARK, font: "Georgia" }, paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, color: CYAN, font: "Georgia" }, paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
    ]
  },
  numbering: { config: numCfg },
  sections: [
    { properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children: cover },
    {
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
        new TextRun({ text: "\u20AC ", font: "Georgia", size: 20, bold: true, color: CYAN }),
        new TextRun({ text: "Ou Va l'Argent ? ", font: "Georgia", size: 18, bold: true, color: DARK }),
        new TextRun({ text: "| Transition Retraites", font: "Arial", size: 18, color: GRAY, italics: true })
      ] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "ouvalargent.com", font: "Consolas", size: 16, color: CYAN }),
        new TextRun({ text: "  |  Page ", font: "Arial", size: 16, color: GRAY }),
        new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: GRAY }),
        new TextRun({ text: " sur ", font: "Arial", size: 16, color: GRAY }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 16, color: GRAY })
      ] })] }) },
      children: [
        h1("Table des matieres"),
        new TableOfContents("Table des matieres", { hyperlink: true, headingStyleRange: "1-2" }),
        pb(),
        ...partie1, ...partie2, ...partie3, ...partie4, ...partie5, ...partie6, ...conclusion,
      ]
    }
  ]
});

const out = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/RETRAITES-Transition-Capitalisation.docx';
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(out, buf);
  console.log(`Document : ${out}`);
  console.log(`Taille : ${(buf.length/1024/1024).toFixed(2)} Mo`);
}).catch(e => console.error('Erreur:', e));

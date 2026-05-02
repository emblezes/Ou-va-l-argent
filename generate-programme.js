const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
        TableOfContents } = require('docx');

// Charte graphique "Ou Va l'Argent" (adaptee pour DOCX)
const CYAN = "0099BB";       // Cyan OVLA (assombri pour lisibilite sur blanc)
const DARK = "0A1628";       // Fond sombre OVLA (pour headers tables)
const GOLD = "B8860B";       // Or (assombri pour lisibilite)
const RED = "D63031";        // Rouge alertes
const GREEN = "00A86B";      // Vert positif
const GRAY = "6B7B8D";      // Gris
const DARK_TEXT = "1A2332";  // Texte sombre
const LIGHT_BG = "E8F4F8";  // Fond clair cyan (tables alternees)
const WHITE = "FFFFFF";
const BLUE = DARK;           // Alias

// Helpers
const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 }, children: [new TextRun({ text, bold: true, font: "Georgia", size: 36, color: DARK })] });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 }, children: [new TextRun({ text, bold: true, font: "Georgia", size: 28, color: CYAN })] });
const h3 = (text) => new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: DARK })] });
const p = (text, opts = {}) => new Paragraph({ spacing: { after: 120 }, alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED, children: [new TextRun({ text, font: "Arial", size: 22, color: opts.color || DARK_TEXT, ...opts })] });
const bold = (text) => new TextRun({ text, font: "Arial", size: 22, bold: true, color: DARK_TEXT });
const normal = (text) => new TextRun({ text, font: "Arial", size: 22, color: DARK_TEXT });
const accent = (text) => new TextRun({ text, font: "Arial", size: 22, bold: true, color: RED });
const pb = () => new Paragraph({ children: [new PageBreak()] });

const bullet = (ref, texts) => {
  if (typeof texts === 'string') {
    return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80 }, children: [normal(texts)] });
  }
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80 }, children: texts });
};

const mixP = (children) => new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED, children });

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const headerCell = (text, width) => new TableCell({
  borders: cellBorders, width: { size: width, type: WidthType.DXA },
  shading: { fill: DARK, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 20, color: WHITE, font: "Arial" })] })]
});

const dataCell = (children, width, opts = {}) => new TableCell({
  borders: cellBorders, width: { size: width, type: WidthType.DXA },
  shading: opts.shade ? { fill: LIGHT_BG, type: ShadingType.CLEAR } : undefined,
  children: Array.isArray(children) ? children : [new Paragraph({ spacing: { after: 40 }, children: typeof children === 'string' ? [new TextRun({ text: children, font: "Arial", size: 20, color: "333333" })] : [children] })]
});

const simpleTable = (headers, rows, widths) => new Table({
  columnWidths: widths,
  rows: [
    new TableRow({ tableHeader: true, children: headers.map((h, i) => headerCell(h, widths[i])) }),
    ...rows.map((row, ri) => new TableRow({
      children: row.map((cell, ci) => dataCell(cell, widths[ci], { shade: ri % 2 === 0 }))
    }))
  ]
});

// Numbering configs
const numberingConfigs = [];
for (let i = 1; i <= 40; i++) {
  numberingConfigs.push({ reference: `b${i}`, levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] });
}
for (let i = 1; i <= 15; i++) {
  numberingConfigs.push({ reference: `n${i}`, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] });
}

// ═══════════════════════════════════════════════════
// CONTENT - 10 THEMATIQUES
// ═══════════════════════════════════════════════════

const coverPage = [
  new Paragraph({ spacing: { before: 1500 }, alignment: AlignmentType.CENTER, children: [] }),
  // Logo OVLA
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [
    new TextRun({ text: "\u20AC", font: "Georgia", size: 96, bold: true, color: CYAN }),
  ] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
    new TextRun({ text: "Ou Va l'Argent ?", font: "Georgia", size: 36, bold: true, color: DARK }),
  ] }),
  // Separateur cyan
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "____________________", font: "Georgia", size: 28, color: CYAN })] }),
  // Titre
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "FRANCE 2027", font: "Georgia", size: 72, bold: true, color: DARK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "Programme economique liberal", font: "Georgia", size: 36, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "10 thematiques \u2014 80 propositions chiffrees", font: "Arial", size: 28, color: GRAY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "Un programme realiste et ambitieux pour la presidentielle", font: "Arial", size: 24, italics: true, color: GRAY })] }),
  // Separateur
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "____________________", font: "Georgia", size: 28, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 }, children: [new TextRun({ text: "ouvalargent.com", font: "Consolas", size: 22, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Mars 2026", font: "Arial", size: 22, color: GRAY })] }),
  pb(),
];

// PRÉAMBULE
const preambule = [
  h1("Preambule : Pourquoi ce programme ?"),
  mixP([normal("La France est a un tournant. Avec une "), accent("dette publique de 3 305 milliards d'euros"), normal(" (113 % du PIB), un "), accent("deficit de 5,8 % du PIB"), normal(" — le pire de l'Union europeenne — et des "), accent("depenses publiques a 57,1 % du PIB"), normal(" (2e rang mondial), notre modele est a bout de souffle.")]),
  mixP([normal("Les Francais travaillent dur, mais l'Etat capte "), accent("45,3 % de la richesse nationale"), normal(" en prelevements obligatoires — record europeen. Malgre cela, les services publics se degradent : deserts medicaux, ecoles en recul dans les classements internationaux, insecurite croissante.")]),
  mixP([normal("Ce programme propose une alternative : "), bold("liberer l'energie des Francais"), normal(" en reduisant le poids de l'Etat, en simplifiant radicalement la fiscalite, en attirant les talents et les investissements, tout en "), bold("renfor\u00e7ant les fonctions regalienne"), normal(" (defense, justice, securite) qui sont le coeur de mission de l'Etat.")]),
  mixP([normal("Chaque proposition est chiffree. L'objectif est clair : "), accent("retour a l'equilibre budgetaire en 5 ans"), normal(", tout en baissant les impots de "), accent("50 milliards d'euros"), normal(" net. C'est possible, a condition de s'attaquer aux depenses inutiles, aux doublons administratifs et aux rentes de situation.")]),
  p("Ce programme s'inspire des reformes qui ont fonctionne ailleurs : la flexisecurite danoise, la fiscalite irlandaise, la capitalisation suedoise, l'immigration selective canadienne, le nucleaire coreeen. La France peut faire mieux, a condition d'oser."),
  pb(),

  // Synthèse budgétaire
  h1("Synthese budgetaire du programme"),
  p("Vue d'ensemble de l'impact financier des 80 propositions :"),
  simpleTable(
    ["Poste", "Impact annuel (Md EUR)", "Horizon"],
    [
      ["Economies de depenses publiques", "+90 a +110 Md EUR", "5 ans"],
      ["Baisses d'impots (cout brut)", "-50 a -60 Md EUR", "5 ans"],
      ["Recettes supplementaires (croissance)", "+15 a +25 Md EUR", "3-5 ans"],
      ["Effet net sur le deficit", "+55 a +75 Md EUR", "5 ans"],
      ["Objectif deficit", "0 % du PIB", "2032"],
    ],
    [4000, 3000, 2360]
  ),
  new Paragraph({ spacing: { after: 80 }, children: [] }),
  mixP([normal("Avec un deficit 2024 de "), accent("~170 milliards d'euros"), normal(", l'objectif de retour a l'equilibre en 5 ans necessite un effort de ~34 Md EUR/an — ambitieux mais realiste au vu des economies identifiees.")]),
  pb(),
];

// ═══════════════ THÈME 1 : FINANCES PUBLIQUES ═══════════════
const theme1 = [
  h1("1. Finances publiques & reforme de l'Etat"),
  h2("Constat"),
  mixP([accent("3 305 milliards d'euros de dette publique"), normal(" fin 2024, soit 113 % du PIB (INSEE). La charge d'interets atteint "), accent("60,2 milliards d'euros en 2024"), normal(" (+14 % en un an) et devrait depasser 67 milliards en 2025. En cinq ans, les interets de la dette ont double.")]),
  mixP([normal("La France compte "), accent("5,9 millions d'agents publics"), normal(" (+32 800 en 2024), "), accent("34 935 communes"), normal(" (l'Allemagne en a 11 000), "), accent("567 222 elus locaux"), normal(" (1 elu pour 119 habitants, record mondial) et 1 254 intercommunalites + 8 629 syndicats sur 6 niveaux d'administration. Le mille-feuille administratif coute des milliards en doublons.")]),
  mixP([normal("Les depenses publiques representent "), accent("1 672 milliards d'euros"), normal(" (57,1 % du PIB), soit 14 points de plus que la moyenne OCDE. La France depense plus que tous ses voisins pour des resultats souvent inferieurs.")]),

  h2("Mesures proposees"),
  h3("1.1 — Reduction de 150 000 postes de fonctionnaires en 5 ans"),
  bullet("b1", [bold("Non-remplacement d'1 depart a la retraite sur 3"), normal(" dans la fonction publique d'Etat et territoriale (hors securite, justice, hopital)")]),
  bullet("b1", "La fonction publique perd ~80 000 agents/an par departs naturels. En ne remplacant qu'un tiers, on obtient ~30 000 postes/an = 150 000 en 5 ans"),
  bullet("b1", [bold("Economie estimee : 7,5 milliards EUR/an"), normal(" a terme (cout moyen chargee ~50 000 EUR/agent)")]),

  h3("1.2 — Fusion des communes : passer de 35 000 a 10 000"),
  bullet("b2", "Fusion obligatoire des communes de moins de 1 000 habitants avec leur intercommunalite"),
  bullet("b2", "Suppression de l'echelon departemental (transfert aux regions et intercommunalites)"),
  bullet("b2", [normal("Le Danemark est passe de 271 a 98 communes en 2007 — "), bold("economie de 1 milliard EUR/an"), normal(" pour un pays de 6 millions d'habitants")]),
  bullet("b2", [bold("Economie estimee : 5 a 8 milliards EUR/an"), normal(" (doublons administratifs, mutualisations)")]),

  h3("1.3 — Plafonnement constitutionnel de la depense publique"),
  bullet("b3", "Inscrire dans la Constitution une regle d'or : deficit structurel maximum de 0,5 % du PIB (comme l'Allemagne)"),
  bullet("b3", "Plafond de depenses publiques a 50 % du PIB a atteindre en 10 ans (vs 57 % aujourd'hui)"),
  bullet("b3", "Revue generale des depenses publiques annuelle, avec publication des resultats"),

  h3("1.4 — Suppression des agences et operateurs inutiles"),
  bullet("b4", "La France compte 438 operateurs de l'Etat (81 Md EUR de budget). Supprimer ou fusionner au moins 150"),
  bullet("b4", [bold("Economie estimee : 3 a 5 milliards EUR/an")]),

  h3("1.5 — Reduction du nombre de parlementaires"),
  bullet("b5", "Passer de 577 a 400 deputes et de 348 a 200 senateurs"),
  bullet("b5", "Introduire une dose de proportionnelle (25 %) pour la representativite"),
  bullet("b5", [bold("Economie symbolique mais signal fort : ~200 millions EUR/an")]),

  h2("Impact budgetaire total du theme"),
  simpleTable(["Mesure", "Economie annuelle"], [
    ["Non-remplacement fonctionnaires", "7,5 Md EUR"],
    ["Fusion communes + suppression departements", "5-8 Md EUR"],
    ["Suppression agences/operateurs", "3-5 Md EUR"],
    ["Reduction parlementaires", "0,2 Md EUR"],
    ["TOTAL", "16 a 21 Md EUR"],
  ], [5500, 3860]),
  pb(),
];

// ═══════════════ THÈME 2 : FISCALITÉ ═══════════════
const theme2 = [
  h1("2. Fiscalite : simplifier et baisser"),
  h2("Constat"),
  mixP([normal("La France detient le record europeen de prelevements obligatoires : "), accent("45,3 % du PIB"), normal(" (FIPECO 2024), contre 40,9 % en Allemagne et 37 % en moyenne OCDE. Le systeme fiscal comprend "), accent("483 taxes, impots et cotisations"), normal(" (IFRAP) et "), accent("467 niches fiscales"), normal(" representant 83,3 milliards d'euros de depenses fiscales (Cour des Comptes).")]),
  mixP([normal("Les impots de production pesent "), accent("105 milliards d'euros"), normal(" en France (4,4 % du PIB) contre 29 milliards en Allemagne (1,0 % du PIB) — un ecart de 3,4 points de PIB (Institut Montaigne 2024). La France est 1ere en Europe. L'ecart se decompose en : +51,5 Md EUR de taxes sur la masse salariale, +24,6 Md EUR d'impots fonciers. Aucun autre pays europeen n'impose autant ses entreprises avant meme qu'elles ne fassent de benefice.")]),

  h2("Mesures proposees"),
  h3("2.1 — Impot sur le revenu : 3 tranches au lieu de 5"),
  bullet("b6", "Barème simplifie : 0 % (jusqu'a 15 000 EUR), 15 % (15 000-75 000 EUR), 30 % (au-dela)"),
  bullet("b6", "Suppression de 300 niches fiscales sur 467 (ne conserver que celles evaluees comme efficaces)"),
  bullet("b6", [bold("Cout de la baisse : ~8 milliards EUR"), normal(", compense par la suppression de niches (~15 Md EUR d'economies)")]),

  h3("2.2 — Impot sur les societes a 20 %, puis 15 %"),
  bullet("b7", "IS a 20 % des 2028, puis 15 % en 2032 (vs 25 % aujourd'hui)"),
  bullet("b7", "L'Irlande a 12,5 % attire 20 % des IDE europeens. Avec 15 %, la France deviendrait la destination #1"),
  bullet("b7", [bold("Cout brut : ~10 milliards EUR"), normal(". Cout net apres afflux d'investissements : ~5 milliards EUR")]),

  h3("2.3 — Suppression progressive des impots de production"),
  bullet("b8", "Diviser par deux les impots de production en 5 ans (-60 milliards EUR de charge pour les entreprises)"),
  bullet("b8", "Suppression prioritaire : C3S, CVAE residuelle, taxes sur les salaires"),
  bullet("b8", [bold("Cout brut : 30 milliards EUR"), normal(". L'Allemagne les a quasiment supprimes : son taux de chomage est de 3,4 %")]),

  h3("2.4 — Flat tax elargie a tous les revenus du capital"),
  bullet("b9", "Maintenir le PFU a 30 % et l'etendre a l'ensemble des revenus du patrimoine"),
  bullet("b9", "Suppression de l'IFI (cout : ~2 milliards EUR) — signal fort pour les investisseurs et entrepreneurs"),

  h3("2.5 — Declaration pre-remplie et prelevement a la source unique"),
  bullet("b10", "Fusionner le recouvrement fiscal et social en une seule agence (URSSAF + DGFiP)"),
  bullet("b10", "Objectif : un seul prelevement sur la fiche de paie au lieu de 10 lignes"),
  bullet("b10", [bold("Economie administrative : 2 milliards EUR/an")]),

  h2("Impact budgetaire total du theme"),
  simpleTable(["Mesure", "Cout (-) / Economie (+)"], [
    ["Simplification IR + suppression niches", "+7 Md EUR net"],
    ["Baisse IS a 20% puis 15%", "-5 Md EUR net"],
    ["Suppression impots de production", "-30 Md EUR brut"],
    ["Suppression IFI", "-2 Md EUR"],
    ["Fusion recouvrement", "+2 Md EUR"],
    ["TOTAL (cout net des baisses)", "-28 Md EUR brut"],
  ], [5500, 3860]),
  mixP([normal("Note : les baisses de fiscalite sont financees par les economies de la theme 1 (16-21 Md EUR) et par le surcroit de croissance attendu (+0,5 a +1 point de PIB).")]),
  pb(),
];

// ═══════════════ THÈME 3 : EMPLOI ═══════════════
const theme3 = [
  h1("3. Emploi & marche du travail"),
  h2("Constat"),
  mixP([normal("Le taux de chomage francais reste a "), accent("7,4 %"), normal(" (2024, INSEE), contre 3,0 % en Allemagne et 4,2 % au Royaume-Uni. La France se classe 6e taux le plus eleve de l'UE. Le taux d'emploi des seniors (55-64 ans) est de 60,4 %, contre 75,2 % en Allemagne et 82 % en Suede (DARES/OCDE 2024).")]),
  mixP([normal("Le cout du travail est parmi les plus eleves d'Europe : pour verser "), accent("1 EUR net a un salarie, l'employeur debourse 1,82 EUR"), normal(" en moyenne. Le coin fiscal francais (difference entre cout employeur et salaire net) depasse 47 %, contre 38 % en moyenne OCDE.")]),
  mixP([normal("Le Code du travail compte "), accent("11 487 articles"), normal(" (+124 % en 20 ans, Legifrance), soit plus de 4 020 pages, contre 54 articles en Suisse. Le coin fiscal atteint "), accent("47,2 %"), normal(" (3e de l'OCDE apres la Belgique et l'Allemagne) : pour 1 EUR net, l'employeur debourse pres de 1,90 EUR.")]),

  h2("Mesures proposees"),
  h3("3.1 — Flexisecurite a la francaise"),
  bullet("b11", "Simplifier le licenciement economique : plafonnement definitif des indemnites prud'homales (bareme Macron sanctuarise)"),
  bullet("b11", "Contrat unique avec droits progressifs (anciennete) en remplacement du CDD/CDI"),
  bullet("b11", "En contrepartie : accompagnement intensif des demandeurs d'emploi (modele danois)"),
  bullet("b11", [normal("Au Danemark, la flexisecurite a reduit le chomage de 9,6 % (1993) a 4,3 % (2007). "), bold("Objectif France : passer sous 5 % en 5 ans")]),

  h3("3.2 — Allegement massif des charges sur les bas salaires"),
  bullet("b12", "Zero charges patronales pour les salaires entre le SMIC et 1,3 SMIC (vs allegements partiels aujourd'hui)"),
  bullet("b12", [bold("Cout : ~5 milliards EUR supplementaires"), normal(", compense par la reprise d'emploi et les economies d'allocations chomage")]),

  h3("3.3 — Liberalisation du temps de travail"),
  bullet("b13", "Passage aux 39h par defaut avec maintien des 35h pour ceux qui le souhaitent (heures sup detaxees)"),
  bullet("b13", "Suppression des seuils sociaux a 50 salaries (ou relèvement a 250)"),
  bullet("b13", [bold("Impact PIB : +0,3 a +0,5 point"), normal(" (estimation OFCE)")]),

  h3("3.4 — Reforme de l'assurance chomage"),
  bullet("b14", "Duree d'indemnisation maximale de 18 mois (vs 24 actuellement) sauf seniors"),
  bullet("b14", "Degressivite des allocations apres 6 mois (-25 %)"),
  bullet("b14", "Obligation de formation qualifiante pour les chomeurs de longue duree"),
  bullet("b14", [bold("Economie : 3 a 4 milliards EUR/an")]),

  h3("3.5 — Apprentissage et formation continue"),
  bullet("b15", "Doubler le nombre d'apprentis : objectif 1,5 million (vs ~800 000 aujourd'hui)"),
  bullet("b15", "Creer un 'compte competences' utilisable a tout age, adosse a la capitalisation retraite"),
  bullet("b15", [bold("Budget supplementaire : 2 milliards EUR/an"), normal(", finances par la reforme de la formation professionnelle (31 Md EUR de budget actuel, largement inefficace)")]),

  h2("Impact budgetaire total du theme"),
  simpleTable(["Mesure", "Cout (-) / Economie (+)"], [
    ["Zero charges < 1.3 SMIC", "-5 Md EUR"],
    ["Reforme assurance chomage", "+3-4 Md EUR"],
    ["Retour a l'emploi (moins d'allocations)", "+3-5 Md EUR"],
    ["Rationalisation formation pro", "+2-3 Md EUR"],
    ["TOTAL", "+3 a +7 Md EUR net"],
  ], [5500, 3860]),
  pb(),
];

// ═══════════════ THÈME 4 : RETRAITES ═══════════════
const theme4 = [
  h1("4. Retraites : sauver le systeme"),
  h2("Constat"),
  mixP([normal("La France consacre "), accent("13,9 % de son PIB aux retraites"), normal(" (406,9 milliards EUR bruts en 2024, source COR), un record absolu dans l'OCDE. L'age effectif de depart est de "), accent("63 ans"), normal(" en moyenne (OCDE : 64,5 ans), contre 64,4 ans en Allemagne, 65,2 ans en Suede et 67 ans au Danemark.")]),
  mixP([normal("Le ratio cotisants/retraites se degrade inexorablement : de 4 pour 1 en 1960 a "), accent("1,79 pour 1 en 2023"), normal(" (30,4 millions de cotisants pour 17,1 millions de retraites, COR 2025), et 1,41 pour 1 en 2070. Le systeme par repartition, concu pour une esperance de vie de 67 ans, doit fonctionner avec une esperance de 83 ans.")]),
  mixP([normal("Pendant ce temps, les fonds de pension des Pays-Bas gerent "), accent("200 % de leur PIB"), normal(" en actifs, ceux de la Suede 72 % du PIB, et la France... pratiquement zero. Les Francais sont prives du rendement long terme des marches financiers pour leur retraite.")]),

  h2("Mesures proposees"),
  h3("4.1 — Age legal a 65 ans en 2032"),
  bullet("b16", "Recul progressif : +4 mois par an a partir de 2028 pour atteindre 65 ans en 2032"),
  bullet("b16", "Maintien des departs anticipes pour carrières longues et penibilite averee"),
  bullet("b16", [bold("Economie : 15 a 20 milliards EUR/an a terme"), normal(" (chiffrage COR)")]),

  h3("4.2 — Creation d'un pilier capitalisation obligatoire"),
  bullet("b17", "5 % du salaire brut verse sur un compte individuel capitalise (inspire du modele suedois)"),
  bullet("b17", "Gestion par des fonds agrees en concurrence (avec option fonds public securise)"),
  bullet("b17", "Le rendement historique des marches actions est de ~7 %/an sur 30 ans, vs ~2 % pour la repartition"),
  bullet("b17", [bold("Sur 40 ans de carriere, 200 EUR/mois capitalises a 6 % = ~400 000 EUR a la retraite")]),
  bullet("b17", "Phase de transition : les cotisations repartition baissent de 5 points, compensees par le budget pendant 15 ans (~15 Md EUR/an de cout transitoire, degressif)"),

  h3("4.3 — Alignement public/prive"),
  bullet("b18", "Meme regime pour tous : fonctionnaires, salaries du prive, independants"),
  bullet("b18", "Suppression des regimes speciaux restants"),
  bullet("b18", [bold("Economie a terme : 3 a 5 milliards EUR/an")]),

  h3("4.4 — Incitation au cumul emploi-retraite"),
  bullet("b19", "Defiscalisation totale du cumul emploi-retraite pour les +65 ans"),
  bullet("b19", "Surcote de 10 % par annee travaillee au-dela de 65 ans"),
  bullet("b19", [bold("Recettes supplementaires : 2 a 3 milliards EUR/an"), normal(" (cotisations des actifs seniors)")]),

  h2("Impact budgetaire total du theme"),
  simpleTable(["Mesure", "Impact annuel (a terme)"], [
    ["Recul age legal a 65 ans", "+15-20 Md EUR"],
    ["Capitalisation (cout de transition)", "-15 Md EUR (degressif sur 15 ans)"],
    ["Alignement regimes", "+3-5 Md EUR"],
    ["Cumul emploi-retraite", "+2-3 Md EUR"],
    ["TOTAL (hors transition)", "+20-28 Md EUR"],
  ], [5500, 3860]),
  pb(),
];

// ═══════════════ THÈME 5 : SANTÉ ═══════════════
const theme5 = [
  h1("5. Sante : efficacite et acces aux soins"),
  h2("Constat"),
  mixP([normal("La depense courante de sante atteint "), accent("333 milliards d'euros"), normal(" (11,4 % du PIB, DREES 2025), en hausse de 3,6 % sur un an. Le deficit de la Securite sociale atteint "), accent("15,3 milliards d'euros en 2024"), normal(" (dont 13,8 Md EUR pour l'Assurance Maladie seule). Les ALD concernent 13,8 millions de personnes et coutent 123 milliards d'euros (60 % des depenses d'assurance maladie).")]),
  mixP([normal("La France compte 3,6 medecins pour 1 000 habitants en moyenne, mais les inegalites territoriales sont abyssales : de 49 a 290 medecins pour 100 000 habitants selon les departements. "), accent("6 millions de Francais n'ont pas de medecin traitant"), normal(".")]),
  mixP([normal("Les depenses de medicaments atteignent "), accent("34,5 milliards d'euros"), normal(". L'hopital absorbe 27 % des depenses avec des inefficiences majeures : duree d'hospitalisation elevee, retard en chirurgie ambulatoire.")]),

  h2("Mesures proposees"),
  h3("5.1 — Liberalisation de l'installation des medecins"),
  bullet("b20", "Fin du numerus clausus residuel : doubler les places en medecine en 5 ans"),
  bullet("b20", "Conventionnement selectif : dans les zones surdotees, pas de nouveau conventionnement sauf remplacement"),
  bullet("b20", "Prime d'installation de 50 000 EUR en zone sous-dotee (financement : redirection des aides existantes)"),

  h3("5.2 — Developpement massif de la chirurgie ambulatoire"),
  bullet("b21", "Objectif : 80 % des actes chirurgicaux en ambulatoire (vs ~60 % aujourd'hui, 85 % au Danemark)"),
  bullet("b21", "Fermeture des services hospitaliers sous-dimensionnes (<500 actes/an)"),
  bullet("b21", [bold("Economie : 5 a 8 milliards EUR/an"), normal(" (une journee d'hospitalisation coute ~2 000 EUR)")]),

  h3("5.3 — Numerisation et telesante"),
  bullet("b22", "Generaliser la teleconsultation : objectif 20 % des consultations (vs ~3 % aujourd'hui)"),
  bullet("b22", "Dossier medical unique interoperable obligatoire"),
  bullet("b22", "IA d'aide au diagnostic dans chaque cabinet (financement etatique)"),
  bullet("b22", [bold("Economie potentielle : 2 a 3 milliards EUR/an")]),

  h3("5.4 — Reforme du remboursement des medicaments"),
  bullet("b23", "Negociation europeenne groupee des prix des medicaments (modele BeNeLuxA)"),
  bullet("b23", "Developpement massif des generiques : objectif 80 % de prescriptions en DCI"),
  bullet("b23", [bold("Economie : 3 a 4 milliards EUR/an")]),

  h3("5.5 — Prevention plutot que guerison"),
  bullet("b24", "Budget prevention triple : de 2 % a 6 % des depenses de sante"),
  bullet("b24", "Bilan de sante obligatoire tous les 2 ans (pris en charge a 100 %)"),
  bullet("b24", [bold("Investissement : 3 milliards EUR/an"), normal(", rembourse par la reduction des maladies chroniques a 10 ans")]),

  h2("Impact budgetaire total du theme"),
  simpleTable(["Mesure", "Impact annuel"], [
    ["Chirurgie ambulatoire", "+5-8 Md EUR"],
    ["Numerisation/telesante", "+2-3 Md EUR"],
    ["Reforme medicaments", "+3-4 Md EUR"],
    ["Budget prevention (investissement)", "-3 Md EUR"],
    ["TOTAL", "+7 a +12 Md EUR"],
  ], [5500, 3860]),
  pb(),
];

// ═══════════════ THÈME 6 : ÉDUCATION ═══════════════
const theme6 = [
  h1("6. Education : autonomie, merite, resultats"),
  h2("Constat"),
  mixP([normal("La France depense "), accent("197 milliards d'euros pour l'education"), normal(" (6,8 % du PIB, dont 88,6 Md EUR pour le budget du ministere seul). Pourtant, les resultats reculent : au classement "), accent("PISA 2024, la France est 23e en maths, 28e en lecture"), normal(". A l'etude TIMSS 2023, "), accent("15 % des eleves de CM1 n'atteignent pas le niveau minimal en maths"), normal(" et l'ecart garcons-filles a explose (6 points en 2015, 23 points en 2023).")]),
  mixP([normal("Le taux de decrochage scolaire est de 7,6 % (sous l'objectif UE de 9 %). Mais l'ecart entre ecoles favorisees (523 points PIRLS) et defavorisees (466 points) — "), accent("57 points d'ecart"), normal(" — est l'un des plus eleves d'Europe, et se creuse malgre le cout des dedoublements. La France depense "), accent("11 % de moins par eleve en primaire"), normal(" que la moyenne OCDE.")]),
  mixP([normal("Les depenses administratives du ministere sont disproportionnees : la France a un taux d'encadrement administratif parmi les plus eleves de l'OCDE, au detriment du nombre d'enseignants devant les eleves.")]),

  h2("Mesures proposees"),
  h3("6.1 — Autonomie des etablissements"),
  bullet("b25", "Chaque college et lycee recrute ses enseignants et gere son budget (modele neerlandais)"),
  bullet("b25", "Publication obligatoire des resultats et de la valeur ajoutee de chaque etablissement"),
  bullet("b25", "Possibilite d'experimentation pedagogique (modele finlandais)"),
  bullet("b25", [bold("Cout zero"), normal(" — c'est une reforme organisationnelle, pas budgetaire")]),

  h3("6.2 — Revalorisation des enseignants liee aux resultats"),
  bullet("b26", "Salaire de base des enseignants debutants a 2 500 EUR net/mois (vs ~2 000 EUR aujourd'hui)"),
  bullet("b26", "Prime de performance pouvant atteindre 30 % du salaire, liee aux progres des eleves"),
  bullet("b26", [bold("Cout : 4 milliards EUR/an"), normal(", finance par la reduction des postes administratifs (-20 %)")]),

  h3("6.3 — Liberte scolaire renforcee"),
  bullet("b27", "Cheque education pour chaque famille, utilisable dans le public ou le prive"),
  bullet("b27", "Ouverture d'ecoles libres simplifiee (regime declaratif, controle a posteriori)"),
  bullet("b27", "La Suede a introduit le cheque education en 1992 : diversite de l'offre accrue, satisfaction parentale en hausse"),
  bullet("b27", [bold("Cout net : zero"), normal(" (redistribution du budget par eleve existant)")]),

  h3("6.4 — Priorite aux fondamentaux en primaire"),
  bullet("b28", "50 % du temps consacre au francais et aux mathematiques en primaire"),
  bullet("b28", "Redoublement reintroduit comme outil pedagogique"),
  bullet("b28", "Evaluation nationale standardisee chaque annee (CE1, CM1, 6e, 3e)"),

  h3("6.5 — Universite selective et professionnalisante"),
  bullet("b29", "Relever les frais d'inscription avec systeme de bourses genereux (modele anglo-saxon adapte)"),
  bullet("b29", "Droit de selection pour toutes les filieres universitaires"),
  bullet("b29", "50 % des licences avec stage obligatoire en entreprise"),
  bullet("b29", [bold("Recettes supplementaires : 1 a 2 milliards EUR/an"), normal(" (reinvestis integralement dans la qualite)")]),

  pb(),
];

// ═══════════════ THÈME 7 : ÉNERGIE ═══════════════
const theme7 = [
  h1("7. Energie : nucleaire et souverainete"),
  h2("Constat"),
  mixP([normal("La France emet "), accent("5,7 tonnes de CO2 par habitant"), normal(" (vs 8,1 en Allemagne et 6,3 en moyenne UE) grace au nucleaire. Pourtant, l'electricite francaise coute desormais "), accent("0,27 EUR/kWh pour les menages"), normal(" (hausse de 50 % en 3 ans) et la facture energetique des importations de petrole et gaz atteint "), accent("57,8 milliards EUR en 2024"), normal(" (-21 % vs 2023, mais encore un gouffre).")]),
  mixP([normal("Le parc nucleaire (56 reacteurs, 63 GW) assure encore ~65 % de la production electrique. Mais les subventions aux energies renouvelables intermittentes ont coute plus de "), accent("150 milliards d'euros cumules"), normal(" (CSPE + soutiens directs) pour une part de seulement ~15 % du mix electrique.")]),
  mixP([normal("L'EPR de Flamanville a coute "), accent("19,1 milliards d'euros"), normal(" avec 12 ans de retard. Mais la Coree du Sud construit des reacteurs similaires pour 5 milliards en 6 ans. Le probleme est organisationnel, pas technologique.")]),

  h2("Mesures proposees"),
  h3("7.1 — 14 nouveaux reacteurs nucleaires d'ici 2040"),
  bullet("b30", "6 EPR2 deja programmes + 8 reacteurs supplementaires (dont 4 SMR)"),
  bullet("b30", "Creation d'un 'commissariat au nucleaire' avec pouvoirs simplifies d'autorisation"),
  bullet("b30", "Objectif : 80 % d'electricite nucleaire en 2040"),
  bullet("b30", [bold("Investissement : 60-80 milliards EUR sur 15 ans"), normal(" (cout budgetaire annuel lisse : 4-5 Md EUR, finance par emprunt productif)")]),

  h3("7.2 — Fin des subventions aux renouvelables intermittents"),
  bullet("b31", "Arret de tout nouveau contrat de subvention eolien terrestre et solaire a grande echelle"),
  bullet("b31", "Les renouvelables doivent survivre au prix de marche"),
  bullet("b31", [bold("Economie : 5 a 7 milliards EUR/an"), normal(" (fin des obligations d'achat)")]),

  h3("7.3 — Prix de l'electricite aligne sur le cout de production"),
  bullet("b32", "Sortir du marche europeen de l'electricite (decouplage gaz-electricite)"),
  bullet("b32", "Objectif : retour a 0,15 EUR/kWh pour les menages et 0,06 EUR/kWh pour l'industrie"),
  bullet("b32", [bold("Gain de competitivite industrielle : 10 a 15 milliards EUR/an")]),

  h3("7.4 — Electrification de l'economie"),
  bullet("b33", "Objectif 50 % de vehicules electriques dans les ventes neuves d'ici 2030"),
  bullet("b33", "Pompes a chaleur : objectif 1 million d'installations/an (vs 300 000 aujourd'hui)"),
  bullet("b33", "Hydrogene vert par electrolyse nucleaire : 1 GW d'electrolyseurs d'ici 2030"),

  pb(),
];

// ═══════════════ THÈME 8 : IMMIGRATION ═══════════════
const theme8 = [
  h1("8. Immigration : selective et qualifiee"),
  h2("Constat"),
  mixP([normal("En 2025, la France a delivre "), accent("384 230 premiers titres de sejour"), normal(" (+11,2 % en un an). La repartition est revelante : 30,7 % d'etudiants, 23,7 % de motifs familiaux, "), accent("24,1 % de motifs humanitaires"), normal(" (+65 % en un an) et seulement ~13 % pour motifs economiques.")]),
  mixP([normal("A l'inverse, au Canada, "), accent("60 % de l'immigration est economique"), normal(" (systeme a points), et en Australie 70 %. La France attire peu de talents qualifies : moins de 30 000 'passeports talents' delivres par an.")]),
  mixP([normal("Le budget de la mission 'Immigration, asile et integration' atteint "), accent("2,16 milliards d'euros"), normal(" (dont 1,4 Md EUR pour le droit d'asile). Le cout total (AME : 1,2 Md EUR, hebergement d'urgence : ~1 Md EUR, education, sante, minima sociaux) est estime entre "), accent("20 et 30 milliards d'euros/an"), normal(". Les OQTF ne sont executees qu'a "), accent("14,3 %"), normal(" (~20 000 sur 140 000 prononcees en 2024).")]),

  h2("Mesures proposees"),
  h3("8.1 — Systeme a points (modele canadien adapte)"),
  bullet("b34", "Grille de points : diplome (30 pts max), maitrise du francais (25 pts), experience professionnelle (20 pts), age (15 pts), offre d'emploi en France (10 pts)"),
  bullet("b34", "Seuil d'admission : 67 points sur 100 (equivalent canadien)"),
  bullet("b34", "Quotas annuels par secteur deficitaire, fixes par le Parlement"),
  bullet("b34", [bold("Objectif : 50 % de l'immigration legale de nature economique"), normal(" (vs 13 % aujourd'hui)")]),

  h3("8.2 — Visa tech & startup"),
  bullet("b35", "Visa de 4 ans pour les ingenieurs, chercheurs, medecins et entrepreneurs etrangers"),
  bullet("b35", "Fiscalite attractive les 5 premieres annees (flat tax a 20 % sur les revenus)"),
  bullet("b35", "Reconnaissance automatique des diplomes des 50 meilleures universites mondiales"),
  bullet("b35", [bold("Objectif : attirer 50 000 talents/an"), normal(" (doublement du passeport talent)")]),

  h3("8.3 — Conditionnement de l'immigration familiale"),
  bullet("b36", "Regroupement familial conditionne a : emploi stable, logement adapte, niveau B1 en francais"),
  bullet("b36", "Delai d'eligibilite porte a 3 ans (vs 18 mois aujourd'hui)"),
  bullet("b36", [bold("Reduction estimee : -30 000 titres familiaux/an"), normal(" (economie ~1,5 Md EUR)")]),

  h3("8.4 — Execution effective des OQTF"),
  bullet("b37", "Creation de centres de retention supplementaires (5 000 places, vs ~1 800 aujourd'hui)"),
  bullet("b37", "Conditionnement de l'aide au developpement a la cooperation en matiere de retour"),
  bullet("b37", "Objectif : taux d'execution des OQTF a 50 % (vs 14 % aujourd'hui)"),
  bullet("b37", [bold("Investissement : 500 millions EUR/an"), normal(". Economie nette a terme : 2-3 Md EUR/an")]),

  h3("8.5 — Integration acceleree"),
  bullet("b38", "Parcours d'integration obligatoire de 400h (langue + valeurs + insertion professionnelle)"),
  bullet("b38", "Acces a la nationalite conditionne au niveau B2 en francais et a 5 ans d'emploi"),
  bullet("b38", [bold("Budget : 500 millions EUR/an"), normal(", retour positif par l'employabilite des immigres")]),

  h2("Impact budgetaire total du theme"),
  simpleTable(["Mesure", "Impact annuel"], [
    ["Reduction immigration familiale", "+1,5 Md EUR"],
    ["Execution OQTF (investissement)", "-0,5 Md EUR"],
    ["Execution OQTF (economies)", "+2-3 Md EUR"],
    ["Afflux de talents (recettes fiscales)", "+1-2 Md EUR"],
    ["Integration (investissement)", "-0,5 Md EUR"],
    ["TOTAL", "+3,5 a +5,5 Md EUR"],
  ], [5500, 3860]),
  pb(),
];

// ═══════════════ THÈME 9 : LOGEMENT ═══════════════
const theme9 = [
  h1("9. Logement : construire plus, reglementer moins"),
  h2("Constat"),
  mixP([normal("Le prix moyen au m2 en France atteint "), accent("3 142 EUR"), normal(" (appartements : 3 918 EUR/m2), ayant quasiment double en 20 ans. Pourtant, la France compte "), accent("3,1 millions de logements vacants"), normal(" (INSEE) et delivre de moins en moins de permis de construire : "), accent("330 400 en 2024"), normal(" (-12,3 %, plus bas depuis 10 ans), contre 450 000 en 2017.")]),
  mixP([normal("Les aides au logement (APL) coutent "), accent("~15 milliards EUR/an"), normal(" mais sont largement captees par la hausse des loyers. Le secteur HLM loge 10 millions de personnes et "), accent("2,77 millions de demandeurs sont en attente"), normal(" (record historique, delai moyen de 10 ans en Ile-de-France).")]),
  mixP([normal("Les normes de construction se sont empilees : "), accent("3 700 regles applicables"), normal(" a la construction neuve (accessibilite, thermique, sismique, acoustique, amiante...). Resultat : un surcout estime de 5 a 15 % sur chaque logement neuf. A Tokyo, ou le zonage est minimal, les prix immobiliers sont stables depuis 20 ans malgre la croissance demographique.")]),

  h2("Mesures proposees"),
  h3("9.1 — Choc de simplification normative"),
  bullet("b39", "Diviser par deux les normes de construction (de 4 000 a 2 000)"),
  bullet("b39", "Permis de construire tacite sous 2 mois (silence vaut accord)"),
  bullet("b39", "Moratoire de 3 ans sur toute nouvelle norme de construction"),
  bullet("b39", [bold("Impact : -15 % sur le cout de construction"), normal(", soit ~30 000 EUR d'economie sur un logement moyen")]),

  h3("9.2 — Liberalisation du foncier"),
  bullet("b40", "Densification obligatoire autour des gares et stations de transport"),
  bullet("b40", "Droit de surélévation automatique pour les immeubles en zone tendue"),
  bullet("b40", "Vente acceleree des terrains publics inutilises (objectif : 10 000 hectares en 5 ans)"),
  bullet("b40", [bold("Objectif : 500 000 mises en chantier/an"), normal(" (vs 350 000 aujourd'hui)")]),

  h3("9.3 — Reforme des aides au logement"),
  bullet("b41", "Suppression progressive des APL compensee par une hausse de la prime d'activite"),
  bullet("b41", "Transformation de l'aide a la pierre en pret a taux zero pour la primo-accession"),
  bullet("b41", [bold("Economie : 5 a 8 milliards EUR/an a terme"), normal(" (les APL alimentent l'inflation des loyers)")]),

  h3("9.4 — Mobilisation des logements vacants"),
  bullet("b42", "Taxe progressive sur les logements vacants depuis plus de 2 ans en zone tendue"),
  bullet("b42", "Bail mobilite generalise (location flexible 1-10 mois)"),
  bullet("b42", [bold("Objectif : remettre 500 000 logements vacants sur le marche en 5 ans")]),

  h3("9.5 — Fiscalite immobiliere simplifiee"),
  bullet("b43", "Suppression des droits de mutation a titre onereux (DMTO / 'frais de notaire') pour les primo-accedants"),
  bullet("b43", "Exoneration de plus-value immobiliere apres 10 ans (vs 22 ans aujourd'hui)"),
  bullet("b43", [bold("Cout : ~3 milliards EUR"), normal(", compense par la dynamisation du marche")]),

  pb(),
];

// ═══════════════ THÈME 10 : DÉFENSE & RÉGALIEN ═══════════════
const theme10 = [
  h1("10. Defense, securite & justice"),
  h2("Constat"),
  mixP([normal("Le budget de la defense atteint "), accent("54 milliards d'euros en 2024"), normal(" (2 % du PIB), un niveau historique mais encore insuffisant face aux menaces (guerre en Ukraine, tensions Indo-Pacifique, terrorisme, cyber). Les Etats-Unis consacrent 3,5 % de leur PIB a la defense, la Pologne 4,2 %.")]),
  mixP([normal("La justice francaise est la "), accent("grande oubliee du budget"), normal(" : 12 milliards d'euros (0,4 % du PIB), l'un des budgets les plus faibles d'Europe rapporte a la population. Un proces en premiere instance prend en moyenne 14 mois (vs 6 mois en Allemagne). La France ne compte que "), accent("11 juges pour 100 000 habitants"), normal(" (vs 25 en Allemagne).")]),
  mixP([normal("Cote securite interieure, les effectifs de police et gendarmerie (250 000 agents) sont absorbes par des taches administratives : un policier passe en moyenne "), accent("40 % de son temps en procedure"), normal(" plutot que sur le terrain. Le taux d'elucidation des cambriolages n'est que de 14 %.")]),

  h2("Mesures proposees"),
  h3("10.1 — Defense : vers 2,5 % du PIB"),
  bullet("b44", "Budget defense porte a 2,5 % du PIB d'ici 2032 (soit ~75 milliards EUR)"),
  bullet("b44", [bold("Investissement supplementaire : ~20 milliards EUR/an"), normal(" a terme")]),
  bullet("b44", "Priorites : dissuasion nucleaire modernisee, cyber-defense (tripler les effectifs), drones et IA militaire, marine renforcee (objectif 20 fregates)"),
  bullet("b44", "Fonds europeen de defense : mutualisation des achats d'equipements avec les partenaires UE"),

  h3("10.2 — Justice : doublement du budget en 10 ans"),
  bullet("b45", "Porter le budget de la justice a 24 milliards EUR (0,8 % du PIB) d'ici 2035"),
  bullet("b45", "Recrutement de 5 000 magistrats et 10 000 greffiers supplementaires"),
  bullet("b45", "Objectif : delai moyen de jugement divise par deux (7 mois au lieu de 14)"),
  bullet("b45", [bold("Investissement : +12 milliards EUR/an a terme")]),

  h3("10.3 — Construction de 20 000 places de prison"),
  bullet("b46", "La France manque de 15 000 a 20 000 places (taux d'occupation : 122 %)"),
  bullet("b46", "Programme de construction sur 7 ans (partenariat public-prive)"),
  bullet("b46", "Fin de l'amenagement automatique des peines courtes"),
  bullet("b46", [bold("Investissement : 6 milliards EUR sur 7 ans"), normal(" (soit ~850 millions EUR/an)")]),

  h3("10.4 — Police : 100 % terrain"),
  bullet("b47", "Transfert integral des taches administratives a des personnels civils (15 000 agents civils recrutes)"),
  bullet("b47", "Deploiement de la videosurveillance intelligente dans les 50 plus grandes villes"),
  bullet("b47", "Extension du recours aux drones pour la surveillance des frontieres"),
  bullet("b47", [bold("Cout : 2 milliards EUR/an"), normal(". Impact : +50 000 policiers effectivement sur le terrain")]),

  h3("10.5 — Souverainete numerique"),
  bullet("b48", "Cloud souverain obligatoire pour les administrations et les donnees de sante"),
  bullet("b48", "Agence nationale de cybersecurite renforcee (ANSSI) : budget triple a 1,5 milliard EUR"),
  bullet("b48", "Reserve operationnelle cyber : 10 000 reservistes formes"),
  bullet("b48", [bold("Investissement : 1,5 milliard EUR/an")]),

  h2("Impact budgetaire total du theme"),
  simpleTable(["Mesure", "Investissement annuel"], [
    ["Defense a 2,5 % du PIB", "+20 Md EUR (progressif)"],
    ["Justice doublee", "+12 Md EUR (progressif)"],
    ["Places de prison", "+0,85 Md EUR (sur 7 ans)"],
    ["Police terrain + civils", "+2 Md EUR"],
    ["Cybersecurite", "+1,5 Md EUR"],
    ["TOTAL", "+36 Md EUR a terme"],
  ], [5500, 3860]),
  mixP([normal("Note : ces investissements regaliens sont finances par les economies realisees sur les autres postes (reforme de l'Etat : 16-21 Md EUR, retraites : 20-28 Md EUR, sante : 7-12 Md EUR). "), bold("Reduire l'Etat la ou il est inutile pour le renforcer la ou il est indispensable.")]),
  pb(),
];

// ═══════════════ CONCLUSION ═══════════════
const conclusion = [
  h1("Conclusion : une vision pour 2032"),
  p("Ce programme propose un pacte clair avec les Francais :"),
  new Paragraph({ spacing: { after: 150 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Moins d'Etat partout ou il n'est pas utile.", font: "Georgia", size: 26, bold: true, color: DARK, italics: true })] }),
  new Paragraph({ spacing: { after: 150 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Plus d'Etat partout ou il est indispensable.", font: "Georgia", size: 26, bold: true, color: CYAN, italics: true })] }),
  new Paragraph({ spacing: { after: 300 }, children: [] }),

  h2("La France en 2032, si ce programme est applique :"),
  simpleTable(
    ["Indicateur", "2024 (aujourd'hui)", "2032 (objectif)"],
    [
      ["Dette publique (% PIB)", "113 %", "< 100 %"],
      ["Deficit public", "5,8 % du PIB", "0 %"],
      ["Depenses publiques (% PIB)", "57,1 %", "< 50 %"],
      ["Prelevements obligatoires", "45,3 %", "< 40 %"],
      ["Chomage", "7,4 %", "< 5 %"],
      ["Age legal retraite", "64 ans", "65 ans"],
      ["Nucleaire (part electricite)", "65 %", "80 %"],
      ["Budget defense (% PIB)", "2,0 %", "2,5 %"],
      ["Budget justice (Md EUR)", "12 Md EUR", "24 Md EUR"],
      ["Immigration economique (% total)", "13 %", "50 %"],
    ],
    [3120, 3120, 3120]
  ),
  new Paragraph({ spacing: { after: 200 }, children: [] }),
  mixP([normal("L'effort total represente "), accent("~100 milliards d'euros d'economies"), normal(" et "), accent("~50 milliards d'euros de baisses d'impots"), normal(" net, tout en investissant "), accent("~36 milliards supplementaires dans le regalien"), normal(". C'est ambitieux, mais c'est exactement ce qu'ont fait le Canada dans les annees 1990, la Suede apres sa crise bancaire, ou l'Allemagne avec les reformes Hartz.")]),
  p("La France a tous les atouts pour redevenir la premiere puissance europeenne. Il ne lui manque qu'une chose : le courage politique."),
  new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "____________________", font: "Georgia", size: 28, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
    new TextRun({ text: "\u20AC ", font: "Georgia", size: 28, bold: true, color: CYAN }),
    new TextRun({ text: "Ou Va l'Argent ?", font: "Georgia", size: 24, bold: true, color: DARK }),
  ] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "ouvalargent.com", font: "Consolas", size: 20, color: CYAN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "Sources : INSEE, Eurostat, OCDE, Cour des Comptes, FIPECO, IFRAP, COR, DREES, DGCL, IRDES", font: "Arial", size: 18, color: GRAY, italics: true })] }),
];

// ═══════════════ ANNEXE : CHIFFRAGE DÉTAILLÉ ═══════════════
const calc = (label, formula, result) => mixP([
  new TextRun({ text: label + " : ", font: "Arial", size: 20, bold: true, color: DARK_TEXT }),
  new TextRun({ text: formula, font: "Consolas", size: 18, color: GRAY }),
  new TextRun({ text: " = ", font: "Arial", size: 20, color: DARK_TEXT }),
  new TextRun({ text: result, font: "Consolas", size: 18, bold: true, color: RED }),
]);
const src = (text) => new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Source : " + text, font: "Arial", size: 18, italics: true, color: GRAY })] });
const note = (text) => new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, font: "Arial", size: 20, color: DARK_TEXT })] });

const annexe = [
  h1("Annexe : chiffrage detaille des mesures"),
  mixP([normal("Cette annexe presente la methodologie de calcul pour chaque mesure du programme. Les donnees sont issues de sources officielles (INSEE, DGAFP, DGFiP, COR, Unedic, DREES, Cour des Comptes). Les calculs sont transparents et reproductibles.")]),

  // ──── THEME 1 ────
  h2("A1. Finances publiques & reforme de l'Etat"),

  h3("1.1 — Reduction de 150 000 postes de fonctionnaires"),
  note("Donnees de base (DGAFP Rapport annuel 2025) :"),
  simpleTable(["Versant", "Effectifs", "Cout moyen charge/an", "Departs retraite/an"], [
    ["Etat (FPE)", "2,57 millions", "67 000 - 70 000 EUR", "47 000"],
    ["Territorial (FPT)", "1,99 millions", "42 000 - 43 000 EUR", "43 000"],
    ["Hospitalier (FPH)", "1,24 millions", "42 000 - 43 000 EUR", "19 800"],
    ["TOTAL", "5,9 millions", "~52 000 EUR (moyenne)", "109 800"],
  ], [2500, 2000, 2500, 2360]),
  new Paragraph({ spacing: { after: 80 }, children: [] }),
  note("Calcul :"),
  calc("Non-remplacement 1/3 des departs", "109 800 x 1/3", "36 600 postes/an"),
  calc("En 5 ans", "36 600 x 5", "183 000 postes supprimes"),
  calc("Perimetre restreint (hors securite, justice, hopital)", "183 000 x 82%", "~150 000 postes"),
  note("Economie annuelle a terme :"),
  calc("Hypothese basse", "150 000 x 42 000 EUR (territorial)", "6,3 Md EUR/an"),
  calc("Hypothese haute", "150 000 x 52 000 EUR (moyenne)", "7,8 Md EUR/an"),
  calc("Hypothese retenue", "(6,3 + 7,8) / 2", "~7 Md EUR/an"),
  src("DGAFP 2025 — Flux de personnels retraites ; Rapport annuel fonction publique 2024"),
  note("Montee en charge progressive : an 1 = 1,4 Md, an 2 = 2,8 Md, an 3 = 4,2 Md, an 4 = 5,6 Md, an 5 = 7 Md."),

  h3("1.2 — Fusion des communes (35 000 a 10 000)"),
  note("Donnees de base :"),
  bullet("b49", "34 935 communes, dont ~31 000 de moins de 3 500 habitants (DGCL 2024)"),
  bullet("b49", "567 222 elus locaux — cout total indemnites + fonctionnement ~3,5 Md EUR/an"),
  bullet("b49", "Budget de fonctionnement des communes < 1 000 hab : ~8 Md EUR/an"),
  note("Benchmark : Danemark 2007"),
  bullet("b50", "Passage de 271 a 98 communes (population : 5,8 millions)"),
  bullet("b50", "Economies realisees : ~1 Md EUR/an (source : Ministry of Interior Denmark, 2013)"),
  calc("Extrapolation France (67M hab)", "1 Md x (67/5,8) x 0,6 (correction taille)", "~7 Md EUR/an"),
  note("Hypothese prudente retenue : economies de 5 a 8 Md EUR/an (mutualisations, suppression doublons, reduction indemnites elus). Le chiffre de 5 Md est le plancher : economies sur les seuls services administratifs. Le chiffre de 8 Md inclut la rationalisation des achats publics et des equipements."),
  src("DGCL 2024 ; Cour des Comptes — Rapport collectivites ; Ministry of Interior Denmark 2013"),

  h3("1.4 — Suppression de 150 operateurs de l'Etat"),
  note("Donnees de base :"),
  bullet("b51", "438 operateurs de l'Etat — budget total : 73,3 Md EUR (PLF 2026)"),
  calc("Budget moyen par operateur", "73,3 Md / 438", "167 M EUR"),
  note("Les 5 plus gros operateurs absorbent 58 % du budget. Les 283 plus petits se partagent ~20 Md EUR."),
  calc("Suppression/fusion 150 petits operateurs", "150 x 30 M EUR moyen (petits) x 15% economies", "~675 M EUR/an"),
  note("Economies supplementaires par rationalisation des fonctions support des gros operateurs :"),
  calc("5% d'economies sur les 53 Md restants", "53 Md x 5%", "2,65 Md EUR/an"),
  calc("Total", "675 M + 2,65 Md", "~3,3 Md EUR/an"),
  src("Cour des Comptes — Budget de l'Etat 2024 ; Jaune budgetaire operateurs PLF 2026"),

  h3("1.5 — Reduction du nombre de parlementaires"),
  note("Donnees de base (Assemblee Nationale / Senat 2024) :"),
  simpleTable(["Poste", "Depute", "Senateur"], [
    ["Indemnite brute mensuelle", "7 637 EUR", "7 637 EUR"],
    ["Frais de mandat (AFM)", "5 950 EUR/mois", "6 600 EUR/mois"],
    ["Credit collaborateurs", "11 118 EUR/mois", "8 827 EUR/mois"],
    ["Cout total annuel", "~978 000 EUR", "~1 100 000 EUR"],
  ], [3500, 3000, 2860]),
  calc("Cout actuel total", "(577 x 978k) + (348 x 1,1M)", "~947 M EUR/an"),
  calc("Reduction a 400 deputes + 200 senateurs", "(400 x 978k) + (200 x 1,1M)", "~611 M EUR/an"),
  calc("Economie", "947 - 611", "~336 M EUR/an"),
  note("Arrondi prudent retenu : ~200 M EUR/an (reduction progressive, couts de transition)."),
  src("Assemblee Nationale — Situation materielle du depute ; Senat — Indemnite parlementaire 2024"),
  pb(),

  // ──── THEME 2 ────
  h2("A2. Fiscalite"),

  h3("2.1 — Simplification de l'IR (3 tranches)"),
  note("Donnees de base (DGFiP Statistiques n41, avril 2025) :"),
  bullet("b52", "41,5 millions de foyers fiscaux dont 19,6 millions imposables (47 %)"),
  bullet("b52", "Recettes IR brutes : ~88-92 Md EUR"),
  bullet("b52", "Les 10 % les plus aises paient 75 % de l'IR (impot moyen : 16 395 EUR)"),
  note("Bareme propose : 0 % (0-15k), 15 % (15-75k), 30 % (>75k)"),
  note("Impact simule : le nouveau bareme allege l'impot des classes moyennes (15 % au lieu de 30 % sur 26-28k) mais l'augmente pour la tranche 15-30k (15 % au lieu de 11 %). Effet net : baisse de ~5-8 Md EUR."),
  note("Compensation : suppression de 300 niches fiscales sur 467 :"),
  calc("467 niches = 83,3 Md EUR de depenses fiscales", "Supprimer 300 niches (les moins efficaces)", "~15-25 Md EUR d'economies"),
  note("Hypothese retenue : suppression des niches rapportant 15 Md EUR. Cout net de la reforme IR :"),
  calc("Cout net", "15 Md (niches recuperees) - 8 Md (baisse IR)", "+7 Md EUR net"),
  src("DGFiP 2025 ; Cour des Comptes — Depenses fiscales PLF 2024"),

  h3("2.2 — Baisse de l'IS a 20 % puis 15 %"),
  note("Donnees de base (DGFiP 2024) :"),
  bullet("b53", "IS net collecte : 59 Md EUR (IS brut : 69 Md EUR)"),
  bullet("b53", "Resultat fiscal des entreprises 2024 : 172 Md EUR"),
  calc("IS a 25 % (actuel)", "172 Md x 25%", "43 Md EUR (base theorique)"),
  calc("IS a 20 %", "172 Md x 20%", "34,4 Md EUR (soit -8,6 Md)"),
  calc("IS a 15 %", "172 Md x 15%", "25,8 Md EUR (soit -17,2 Md)"),
  note("Correction effet Laffer : une baisse de l'IS attire des investissements et elargit l'assiette. L'Irlande a 12,5 % collecte plus d'IS en % du PIB que la France a 25 %."),
  calc("Hypothese prudente IS a 20%", "Cout brut -8,6 Md x 0,6 (correction assiette)", "Cout net ~-5 Md EUR"),
  src("DGFiP — Impot sur le benefice 2024 des entreprises ; OCDE — Revenue Statistics"),

  h3("2.3 — Suppression des impots de production"),
  note("Donnees de base (Institut Montaigne 2024 / DGFiP) :"),
  simpleTable(["Impot", "Recettes 2024", "Equivalant allemand"], [
    ["CVAE", "3,9 Md EUR (suppression 2030)", "0"],
    ["C3S", "5,1 Md EUR", "0"],
    ["CFE", "~11 Md EUR", "~4 Md (Gewerbesteuer partiel)"],
    ["Taxe sur salaires", "~6 Md EUR", "0"],
    ["Autres impots de production", "~79 Md EUR", "~25 Md EUR"],
    ["TOTAL France", "~105 Md EUR (4,4% PIB)", "~29 Md EUR Allemagne (1% PIB)"],
  ], [3500, 2800, 3060]),
  calc("Objectif : diviser par 2 en 5 ans", "105 Md x 50%", "~52 Md EUR de charges en moins pour les entreprises"),
  note("Mais l'Etat ne finance pas la totalite : une partie est compense par les collectivites (CVAE compensee, CFE locale)."),
  calc("Cout net pour le budget de l'Etat", "~30 Md EUR (part Etat des impots de production)", "30 Md EUR brut"),
  note("Montee en charge : -6 Md/an pendant 5 ans. Le surcroit de competitivite genere de la croissance et des recettes fiscales additionnelles."),
  src("Institut Montaigne — Barometre europeen impots production 2024 ; FIPECO"),

  h3("2.4 — Suppression de l'IFI"),
  calc("Rendement IFI 2024", "186 000 foyers x 11 800 EUR moyen", "2,2 Md EUR"),
  note("Comparaison : l'ancien ISF rapportait 4,2 Md EUR mais pesait sur l'investissement. L'IFI genere ~200 M EUR/an de couts de gestion et de contentieux (DGFiP)."),
  calc("Cout net suppression IFI", "2,2 Md - 0,2 Md (couts evites)", "~2 Md EUR"),
  src("Public Senat — Budget 2026 et reforme IFI ; DGFiP"),
  pb(),

  // ──── THEME 3 ────
  h2("A3. Emploi & marche du travail"),

  h3("3.2 — Zero charges < 1,3 SMIC"),
  note("Donnees de base :"),
  bullet("b54", "Le SMIC brut mensuel est de ~1 767 EUR (2024). A 1,3 SMIC = 2 297 EUR."),
  bullet("b54", "~5 millions de salaries entre 1 et 1,3 SMIC"),
  bullet("b54", "Charges patronales residuelles apres allegements actuels : ~5 a 10 % du brut"),
  calc("Cout des charges restantes sur ce segment", "5M salaries x 2 000 EUR brut x 7% x 12 mois", "~8,4 Md EUR/an"),
  note("Les allegements Fillon couvrent deja ~70 % des charges. Le cout supplementaire pour passer a zero :"),
  calc("Surcout", "8,4 Md x 30% (part non couverte)", "~2,5 Md EUR/an"),
  note("Hypothese retenue elargie (incluant extension du perimetre) : ~5 Md EUR/an"),
  src("URSSAF/ACOSS 2024 ; DGFiP — Allegements generaux"),

  h3("3.4 — Reforme assurance chomage"),
  note("Donnees de base (Unedic novembre 2024) :"),
  bullet("b55", "Allocations chomage (ARE) : 37 Md EUR/an"),
  bullet("b55", "~2,5 millions d'allocataires, allocation moyenne ~1 480 EUR/mois"),
  bullet("b55", "Duree moyenne d'indemnisation : 8-10 mois"),
  note("Mesure 1 : Duree max 18 mois (vs 24)"),
  calc("Economies sur les allocataires > 18 mois", "~350 000 personnes x 1 480 EUR x 6 mois", "~3,1 Md EUR/an"),
  note("Mesure 2 : Degressivite -25 % apres 6 mois"),
  calc("Economies", "1,5M allocataires > 6 mois x 370 EUR/mois x 6 mois", "~3,3 Md EUR/an"),
  note("Effet net (une partie des economies est absorbee par l'accompagnement renforce) :"),
  calc("Hypothese retenue", "(3,1 + 3,3) x 60%", "~3,8 Md EUR/an"),
  src("Unedic — Indicateurs novembre 2024 ; France Travail"),
  pb(),

  // ──── THEME 4 ────
  h2("A4. Retraites"),

  h3("4.1 — Recul de l'age legal a 65 ans"),
  note("Donnees de base (COR Rapport 2025 / France Info) :"),
  bullet("b56", "La reforme 2023 (62 a 64 ans) genere +8 a 12 Md EUR d'economies d'ici 2027"),
  bullet("b56", "Chaque annee supplementaire de recul = ~0,5 point de PIB = ~14 Md EUR"),
  calc("Passage de 64 a 65 ans", "~14 Md EUR x 0,5 (un an seulement)", "~7 Md EUR/an supplementaires"),
  note("Montee en charge progressive (+4 mois/an a partir de 2028) :"),
  calc("Impact cumule a horizon 2032 (4 ans de recul effectif)", "7 Md x 4/3 (acceleration)", "~10 Md EUR/an en regime de croisiere"),
  note("En ajoutant les economies de la reforme 2023 deja en cours :"),
  calc("Total a terme (65 ans effectif)", "10 Md + 8 Md (reforme 2023)", "~18 Md EUR/an"),
  src("COR Rapport annuel 2025 ; France Info — Estimations COR"),

  h3("4.2 — Pilier capitalisation obligatoire"),
  note("MECANISME DE TRANSITION DETAILLE"),
  note("Phase 1 — Donnees de base :"),
  bullet("b57", "Masse salariale brute totale France : ~1 400 Md EUR/an (URSSAF/ACOSS 2024)"),
  bullet("b57", "Cotisations retraite actuelles : ~28% du brut = ~392 Md EUR/an"),
  note("Phase 2 — Montee en charge progressive (pas de choc) :"),
  simpleTable(["Annee", "Taux preleve vers capitalisation", "Montant redirige", "Cout de transition (budget Etat)"], [
    ["An 1 (2028)", "1,0 %", "14 Md EUR", "14 Md EUR"],
    ["An 2 (2029)", "1,5 %", "21 Md EUR", "18 Md EUR (economies retraites en parallele)"],
    ["An 3 (2030)", "2,0 %", "28 Md EUR", "15 Md EUR"],
    ["An 5 (2032)", "2,5 %", "35 Md EUR", "10 Md EUR (economies age 65 compensent)"],
    ["An 10 (2037)", "2,5 %", "37 Md EUR", "5 Md EUR"],
    ["An 15 (2042)", "2,5 %", "40 Md EUR", "0 (autofinancement)"],
  ], [1800, 2500, 2200, 2860]),
  note("Phase 3 — Financement de la transition :"),
  bullet("b58", [bold("Source 1 :"), normal(" Economies du recul a 65 ans = +18 Md EUR/an (voir 4.1)")]),
  bullet("b58", [bold("Source 2 :"), normal(" Alignement regimes speciaux = +3-5 Md EUR/an")]),
  bullet("b58", [bold("Source 3 :"), normal(" Budget Etat residuel = 5-10 Md EUR/an (degressif)")]),
  note("Phase 4 — Rendement a long terme :"),
  simpleTable(["Fonds (pays)", "Rendement annualise 2011-2020", "Actifs geres"], [
    ["CPPIB (Canada)", "9,1 % reel", "575 Md CAD"],
    ["AP7 (Suede — pilier capitalisation)", "~8,5 %", "850 Md SEK"],
    ["ABP (Pays-Bas)", "~6-7 %", "520 Md EUR"],
    ["Hypothese France (prudente)", "6,0 % nominal", "—"],
  ], [3500, 2800, 3060]),
  note("Simulation individuelle :"),
  calc("Salaire median brut", "2 100 EUR/mois", "25 200 EUR/an"),
  calc("Cotisation capitalisation (2,5%)", "25 200 x 2,5%", "630 EUR/an = 52,50 EUR/mois"),
  calc("Apres 40 ans a 6% nominal", "52,50 EUR/mois x ((1,005^480 - 1)/0,005)", "~102 000 EUR"),
  note("Avec montee en charge et hausse des salaires, le capital atteint ~150-200k EUR a la retraite, generant ~600-800 EUR/mois de complement. Ce n'est pas un remplacement de la repartition, c'est un complement."),
  src("Finnish Centre for Pensions — International Comparison 2024 ; Fondapol — Retraite mixte ; COR 2025"),
  pb(),

  // ──── THEME 5 ────
  h2("A5. Sante"),

  h3("5.2 — Chirurgie ambulatoire"),
  note("Donnees de base (HAS / CNAM 2024) :"),
  bullet("b59", "Taux ambulatoire actuel : 64 % (public : 48 %, prive : 74 %)"),
  bullet("b59", "Cout moyen acte ambulatoire : 300-600 EUR"),
  bullet("b59", "Cout moyen journee hospitalisation : 1 300 EUR (secteur public)"),
  bullet("b59", "Nombre d'actes chirurgicaux/an : ~7 millions"),
  calc("Actes en hospitalisation complete actuellement", "7M x 36%", "~2,5 millions d'actes"),
  calc("Objectif : passer de 64% a 80% ambulatoire", "7M x 16% = 1,12M actes transferes", ""),
  calc("Economie par acte transfere", "1 300 EUR (hospi) - 500 EUR (ambu) = 800 EUR", ""),
  calc("Economie totale", "1,12M x 800 EUR", "~900 M EUR/an"),
  note("En ajoutant la fermeture des services sous-dimensionnes et les economies de personnel :"),
  calc("Economies structurelles supplementaires", "+3 a 5 Md EUR (mutualisations)", ""),
  calc("Total retenu", "0,9 Md + 4 Md (median)", "~5 Md EUR/an"),
  src("HAS — Tarification chirurgie ambulatoire ; CNAM ; CerclH 2025"),

  h3("5.4 — Reforme des medicaments"),
  note("Donnees de base (DREES 2025 / Gemme) :"),
  bullet("b60", "Depenses totales medicaments : 34,5 Md EUR (2024)"),
  bullet("b60", "Part generiques en France : 42 % en volume (vs 80 % en Allemagne/UK)"),
  bullet("b60", "Economie par substitution : un generique coute 60-70 % de moins qu'un princeps"),
  calc("Si la France passe de 42% a 70% de generiques", "(70%-42%) x 34,5 Md x 0,65 (economie)", "~6,3 Md EUR"),
  note("Hypothese prudente (obstacles reglementaires, delais) : economie de 3-4 Md EUR/an."),
  src("DREES 2025 ; Gemme — Prix generiques France vs Europe"),
  pb(),

  // ──── THEME 7 ────
  h2("A7. Energie"),

  h3("7.1 — 14 nouveaux reacteurs"),
  note("Donnees de base (EDF / SFEN / CRE 2025) :"),
  bullet("b61", "Cout EPR2 (6 reacteurs, 9,9 GW) : 72,8 Md EUR (EDF dec. 2024)"),
  bullet("b61", "Cout par MW installe : 7,3 M EUR/MW"),
  bullet("b61", "Cout du MWh nucleaire nouveau : 60-70 EUR/MWh (CRE)"),
  bullet("b61", "Cout du MWh nucleaire existant (parc actuel) : 40-50 EUR/MWh"),
  calc("8 reacteurs supplementaires (dont 4 SMR)", "~40 Md EUR (economies serie)", ""),
  calc("Total programme 14 reacteurs", "72,8 Md + 40 Md", "~110-115 Md EUR sur 15 ans"),
  calc("Cout annuel lisse", "115 Md / 15 ans", "~7,5 Md EUR/an"),
  note("Financement : emprunt productif a 3 % sur 40 ans (la duree de vie d'un reacteur). Le nucleaire se rembourse par la vente d'electricite."),
  calc("Recettes annuelles (14 reacteurs a pleine capacite)", "14 x 1,2 GW x 7 500h x 65 EUR/MWh", "~11,4 Md EUR/an"),
  note("Le programme est autofinance apres mise en service (recettes > couts de remboursement)."),
  src("EDF — Cout EPR2 (dec 2024) ; CRE — Couts du nucleaire 2025 ; SFEN"),

  h3("7.2 — Fin des subventions renouvelables"),
  note("Donnees de base (CRE deliberation 2024-139) :"),
  bullet("b62", "CSPE totales 2025 : 8,9 Md EUR (dont 4,3 Md pour les EnR)"),
  bullet("b62", "CSPE 2026 prevues : 13 Md EUR (+46 %)"),
  bullet("b62", "Detail EnR 2025 : photovoltaique 2,9 Md + eolien 1,4 Md"),
  note("Mesure : arret des nouveaux contrats de subvention. Les contrats existants courent jusqu'a leur terme (15-20 ans)."),
  calc("Economie annee 1 (pas de nouveaux contrats)", "~500 M EUR", ""),
  calc("Economie annee 5 (premiere vague de contrats expires)", "~2-3 Md EUR", ""),
  calc("Economie annee 10", "~5-7 Md EUR", ""),
  src("CRE — Deliberation 2024-139 ; Senat PLF 2026"),
  pb(),

  // ──── THEME 8 ────
  h2("A8. Immigration"),

  h3("8.3 — Conditionnement immigration familiale"),
  note("Donnees de base (DGEF / Ministere Interieur 2025) :"),
  bullet("b63", "Premiers titres familiaux 2025 : 384 230 x 23,7% = ~91 000"),
  bullet("b63", "Cout moyen d'un immigre familial pour les finances publiques : ~15 000-20 000 EUR/an (estimations Senat)"),
  calc("Reduction de 30 000 titres familiaux/an", "30 000 x 17 500 EUR (moyen)", "~525 M EUR/an"),
  note("En ajoutant les economies sur les renouvellements (effet cumule sur 3-5 ans) :"),
  calc("Economies cumulees a 5 ans", "525 M + effets cumul", "~1,5 Md EUR/an en regime de croisiere"),

  h3("8.4 — Execution des OQTF"),
  note("Donnees de base (Ministere Interieur / IFRAP 2024) :"),
  bullet("b64", "OQTF prononcees 2024 : 140 000. Executees : ~20 000 (14,3 %)"),
  bullet("b64", "Cout d'un centre de retention : ~50 EUR/jour/place"),
  bullet("b64", "Cout d'un eloignement effectif : ~4 000-6 000 EUR (transport, escorte)"),
  calc("5 000 places supplementaires", "5 000 x 50 EUR x 365", "91 M EUR/an"),
  calc("Eloignements supplementaires (objectif +30 000)", "30 000 x 5 000 EUR", "150 M EUR/an"),
  calc("Cout total OQTF", "91 + 150 + logistique", "~350 M EUR/an"),
  note("Economies : chaque personne en situation irreguliere eloignee ne coute plus d'hebergement d'urgence (~20k EUR/an) ni d'AME (~2 400 EUR/an)."),
  calc("Economies a terme (30 000 eloignements/an)", "30 000 x 22 400 EUR", "~670 M EUR/an"),
  calc("Bilan net", "670 M - 350 M", "+320 M EUR/an (degressif dans le temps)"),
  src("OQTF : Ministere Interieur / CNEWS 2024 ; AME : Senat Rapport 2024 (1 387 M EUR, 466k beneficiaires)"),
  pb(),

  // ──── THEME 9 ────
  h2("A9. Logement"),

  h3("9.3 — Reforme des APL"),
  note("Donnees de base (PLF 2024 / CNAF) :"),
  bullet("b65", "Cout total APL : 13,9 Md EUR/an"),
  bullet("b65", "5,7 millions de menages beneficiaires, aide moyenne : 219 EUR/mois"),
  note("Effet inflationniste demontre (Fack 2006, Grislain-Letremy & Trevien 2014) :"),
  bullet("b66", "1 EUR d'APL supplementaire = ~0,8 a 1 EUR de hausse de loyer"),
  bullet("b66", "Les APL sont largement captees par les proprietaires via la hausse des loyers"),
  note("Reforme proposee : suppression progressive sur 5 ans, compensee par hausse de prime d'activite pour les actifs et maintien pour les retraites modestes."),
  calc("Economies annee 1 (gel + plafonnement)", "~1 Md EUR", ""),
  calc("Economies annee 3 (reduction 30%)", "13,9 Md x 30%", "~4,2 Md EUR"),
  calc("Economies annee 5 (reduction 50%)", "13,9 Md x 50%", "~7 Md EUR"),
  note("Cout de la compensation (hausse prime d'activite) : ~2-3 Md EUR/an"),
  calc("Economie nette a terme", "7 Md - 2,5 Md (compensation)", "~4,5 Md EUR/an"),
  src("PLF 2024 / CNAF ; IPP — Reformer aides logement (2015) ; Fack (2006)"),
  pb(),

  // ──── THEME 10 ────
  h2("A10. Defense, securite & justice"),

  h3("10.2 — Doublement du budget justice"),
  note("Donnees de base (Ministere Justice 2024) :"),
  bullet("b67", "Budget justice 2024 : 10,4 Md EUR (premiere fois > 10 Md)"),
  bullet("b67", "Dont administration penitentiaire : 3,9 Md EUR"),
  note("Montee en charge vers 24 Md EUR en 10 ans :"),
  simpleTable(["Annee", "Budget", "Hausse annuelle", "Recrutements"], [
    ["2024 (actuel)", "10,4 Md EUR", "—", "—"],
    ["2027", "13 Md EUR", "+0,9 Md/an", "+1 500 magistrats"],
    ["2030", "18 Md EUR", "+1,7 Md/an", "+3 000 greffiers"],
    ["2035", "24 Md EUR", "+1,2 Md/an", "+10 000 agents penitentiaires"],
  ], [2000, 2500, 2500, 2360]),

  h3("10.3 — 20 000 places de prison"),
  note("Donnees de base (OIP 2024) :"),
  bullet("b68", "Taux d'occupation prisons : 122 %"),
  bullet("b68", "Cout par place de prison (construction) : 150 000 - 190 000 EUR"),
  bullet("b68", "Cout de detention : 105 EUR/jour/detenu (~38 000 EUR/an)"),
  calc("Construction 20 000 places", "20 000 x 170 000 EUR (moyen)", "3,4 Md EUR"),
  calc("Etale sur 7 ans", "3,4 Md / 7", "~486 M EUR/an de construction"),
  calc("Cout de fonctionnement supplementaire", "20 000 x 38 000 EUR/an", "+760 M EUR/an a terme"),
  note("Budget supplementaire total (construction + fonctionnement) : ~1,2 Md EUR/an a plein regime."),
  src("OIP — Budget penitentiaire 2024 ; Ministere Justice"),

  h3("10.5 — Cybersecurite : ANSSI renforcee"),
  note("Comparaison internationale :"),
  simpleTable(["Agence", "Budget 2024", "Budget 2026"], [
    ["ANSSI (France)", "29,6 M EUR", "~50 M EUR (estim.)"],
    ["BSI (Allemagne)", "238 M EUR", "379 M EUR"],
    ["Ecart", "x8", "x7,5"],
  ], [3500, 3000, 2860]),
  calc("Objectif : tripler l'ANSSI", "30 M x 3", "~100 M EUR/an (encore 2,5x moins que l'Allemagne)"),
  note("Budget demande dans le programme : 1,5 Md EUR/an (incluant reserve operationnelle cyber, formation, infrastructure cloud souverain)."),
  src("ANSSI — Budget cyber.gouv.fr 2024 ; BSI — Behoerden Spiegel 2025"),
  pb(),

  // SYNTHÈSE FINALE
  h2("Synthese : bilan budgetaire consolide"),
  simpleTable(
    ["Theme", "Economies (+)", "Couts (-)", "Net"],
    [
      ["1. Reforme Etat", "+16 a 18 Md", "—", "+16-18 Md"],
      ["2. Fiscalite", "+7 Md (niches)", "-35 Md (baisses impots)", "-28 Md"],
      ["3. Emploi", "+3,8 Md (chomage)", "-5 Md (charges)", "-1,2 Md"],
      ["4. Retraites", "+18 Md (age 65)", "-14 Md (transition)", "+4 Md (puis +18)"],
      ["5. Sante", "+8 Md (ambu+medic)", "-3 Md (prevention)", "+5 Md"],
      ["6. Education", "+1 Md (reformes)", "-4 Md (revalorisation)", "-3 Md"],
      ["7. Energie", "+2 Md (renouv.)", "-7,5 Md (nucleaire)", "-5,5 Md"],
      ["8. Immigration", "+2 Md (economies)", "-0,9 Md (investiss.)", "+1,1 Md"],
      ["9. Logement", "+4,5 Md (APL)", "-3 Md (fiscalite)", "+1,5 Md"],
      ["10. Regalien", "—", "-36 Md (invest.)", "-36 Md"],
      ["TOTAL Annee 5", "+55 Md", "-103 Md", "-48 Md"],
      ["Recettes croissance (+0,5 pt PIB)", "+15-20 Md", "—", "+15-20 Md"],
      ["TOTAL NET Annee 5", "", "", "-28 a -33 Md"],
      ["TOTAL NET Annee 10 (capitalisation autofinancee)", "", "", "+5 a +15 Md"],
    ],
    [2500, 2200, 2200, 2460]
  ),
  new Paragraph({ spacing: { after: 100 }, children: [] }),
  note("Lecture : en annee 5, le deficit se reduit de ~140 Md EUR (deficit 2024 de ~170 Md) mais ne revient pas a zero a cause du cout de transition de la capitalisation et des investissements regaliens massifs. L'equilibre budgetaire est atteint en annee 8-10, quand :"),
  bullet("b69", "La capitalisation retraite s'autofinance (les economies d'age compensent)"),
  bullet("b69", "Les investissements nucleaires generent des recettes (vente d'electricite)"),
  bullet("b69", "La croissance supplementaire genere des recettes fiscales"),
  note("C'est un programme de redressement sur 10 ans, pas 5. L'honnetete commande de le dire."),
];

// ═══════════════ DOCUMENT ASSEMBLY ═══════════════
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: DARK, font: "Georgia" },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: DARK, font: "Georgia" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: CYAN, font: "Georgia" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
    ]
  },
  numbering: { config: numberingConfigs },
  sections: [
    // Cover
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: coverPage
    },
    // TOC
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
          new TextRun({ text: "\u20AC ", font: "Georgia", size: 20, bold: true, color: CYAN }),
          new TextRun({ text: "Ou Va l'Argent ? ", font: "Georgia", size: 18, bold: true, color: DARK }),
          new TextRun({ text: "| FRANCE 2027", font: "Arial", size: 18, color: GRAY, italics: true })
        ] })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "ouvalargent.com", font: "Consolas", size: 16, color: CYAN }),
          new TextRun({ text: "  |  Page ", font: "Arial", size: 16, color: GRAY }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: GRAY }),
          new TextRun({ text: " sur ", font: "Arial", size: 16, color: GRAY }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 16, color: GRAY })
        ] })] })
      },
      children: [
        h1("Table des matieres"),
        new TableOfContents("Table des matieres", { hyperlink: true, headingStyleRange: "1-2" }),
        pb(),
        ...preambule,
        ...theme1,
        ...theme2,
        ...theme3,
        ...theme4,
        ...theme5,
        ...theme6,
        ...theme7,
        ...theme8,
        ...theme9,
        ...theme10,
        ...conclusion,
        ...annexe,
        // Annexe 2 : Comparaisons internationales
        h1("Annexe 2 : reformes liberales reussies a l'etranger"),
        mixP([normal("Chaque proposition de ce programme s'appuie sur des reformes testees et validees dans d'autres pays. Voici les benchmarks internationaux detailles.")]),

        h2("B1. Fiscalite : les exemples qui marchent"),
        h3("Irlande — IS a 12,5 % (1999)"),
        bullet("b70", "Avant : IS a 38 %, PIB/habitant = 70 % de la moyenne UE"),
        bullet("b70", "Apres : IS a 12,5 %, afflux massif d'IDE (Apple, Google, Pfizer...)"),
        bullet("b70", "Resultat : PIB/habitant = 190 % de la moyenne UE en 2023 (2e mondial)"),
        bullet("b70", [bold("Recettes IS multipliees par 4"), normal(" malgre un taux divise par 3 (effet assiette)")]),
        src("OCDE Revenue Statistics ; Eurostat ; Tax Foundation"),

        h3("Estonie — Flat tax et e-residency (1994)"),
        bullet("b71", "Taux unique a 20 % sur les revenus + 0 % d'IS sur les benefices reinvestis"),
        bullet("b71", "Croissance moyenne 1995-2007 : +7 %/an"),
        bullet("b71", "E-residency : 100 000 entrepreneurs etrangers enregistres"),
        bullet("b71", "Ratio dette/PIB : 19 % (vs 113 % France)"),
        src("Ministry of Finance Estonia ; FMI — Country Report Estonia"),

        h2("B2. Emploi : flexisecurite"),
        h3("Danemark — Le triangle d'or (1990s)"),
        bullet("b72", "Avant : chomage a 9,6 % (1993)"),
        bullet("b72", [bold("Trois piliers :"), normal(" (1) Flexibilite du licenciement, (2) Indemnisation genereuse, (3) Accompagnement intensif obligatoire")]),
        bullet("b72", "Apres : chomage a 4,3 % (2007), puis stabilise a 5 %"),
        bullet("b72", "25 % des salaries changent d'emploi chaque annee (vs 10 % en France)"),
        src("OCDE — Employment Outlook Denmark ; IZA Discussion Papers"),

        h3("Allemagne — Reformes Hartz (2003-2005)"),
        bullet("b73", "Avant : chomage a 11,4 % (2005), 'homme malade de l'Europe'"),
        bullet("b73", "Mesures : fusion aide sociale/chomage (Hartz IV), mini-jobs, agences pour l'emploi renovees"),
        bullet("b73", "Apres : chomage a 5,5 % (2012), puis 3,0 % (2024)"),
        bullet("b73", [bold("+2,5 millions d'emplois crees en 7 ans")]),
        bullet("b73", "Bémol : 7,4 millions de mini-jobs (emplois precaires)"),
        src("IZA — Labour Market Reforms Germany ; Bundesagentur fur Arbeit"),

        h2("B3. Retraite par capitalisation"),
        h3("Suede — Comptes notionnels + capitalisation (1994)"),
        bullet("b74", "Systeme mixte : 16 % en repartition + 2,5 % en capitalisation (fonds AP7)"),
        bullet("b74", "Mecanisme d'equilibrage automatique (pas de reforme tous les 5 ans)"),
        bullet("b74", "Rendement du fonds AP7 : ~8,5 %/an sur 2011-2020"),
        bullet("b74", [bold("Zero deficit structurel depuis 2000")]),
        src("Finnish Centre for Pensions ; Swedish Pension Agency — Orange Report"),

        h3("Pays-Bas — Fonds de pension (depuis 1950s)"),
        bullet("b75", "Actifs des fonds : 200 % du PIB (1er mondial)"),
        bullet("b75", "Fonds ABP (fonctionnaires) : 520 Md EUR geres"),
        bullet("b75", "Pension moyenne : ~70 % du dernier salaire (vs ~50 % en France)"),
        bullet("b75", "Taux de pauvrete des retraites neerlandais : 3,1 % (vs 8,6 % France)"),
        src("OCDE Pensions at a Glance 2025 ; ABP Annual Report"),

        h2("B4. Reduction du nombre de communes"),
        h3("Danemark (2007) : de 271 a 98"),
        bullet("b76", "Fusion obligatoire par le Parlement (pas de referendum local)"),
        bullet("b76", "Taille minimale : 30 000 habitants"),
        bullet("b76", "Economies : ~1 Md EUR/an (pour 5,8M habitants)"),
        bullet("b76", "Satisfaction citoyenne : stable apres 3 ans d'adaptation"),
        src("Danish Ministry of Interior 2013 ; Local Government Denmark"),

        h3("Japon (1999-2010) : de 3 232 a 1 727"),
        bullet("b77", "Incitations financieres (pas de contrainte legale)"),
        bullet("b77", "Reduction de 47 % du nombre de communes en 11 ans"),
        bullet("b77", "Economies limitees (les services ont ete maintenus)"),
        src("Ministry of Internal Affairs Japan ; World Bank — Municipal Mergers"),

        h2("B5. Reduction de la depense publique"),
        h3("Canada (1994-1999) : le modele de reference"),
        bullet("b78", "Avant : deficit de 30 Md CAD (6 % du PIB), dette a 68 % du PIB"),
        bullet("b78", "Methode : revue complete de chaque programme (-20 % sur 3 ans)"),
        bullet("b78", "Apres : excedent de 14,3 Md CAD en 1998 (surplus pendant 12 ans consecutifs)"),
        bullet("b78", "Croissance : 3,3 %/an pendant la periode (supérieure aux G7)"),
        bullet("b78", [bold("-8 points de depenses publiques en % du PIB en 5 ans")]),
        src("Bank of Canada ; FMI — Canada Article IV ; Fraser Institute"),

        h2("B6. Immigration selective"),
        h3("Canada — Express Entry (depuis 1967, reforme 2015)"),
        bullet("b79", "Systeme a points : diplome (30 pts), langue (25), experience (20), age (15), offre emploi (10)"),
        bullet("b79", "60 % de l'immigration est economique (vs 13 % en France)"),
        bullet("b79", "Immigrants selectionnes : revenu median superieur a la moyenne nationale apres 5 ans"),
        bullet("b79", "4 000 invitations/mois (Q1 2026)"),
        src("IRCC Canada.ca ; VisaHQ — Express Entry 2026"),

        h3("Australie — SkillSelect"),
        bullet("b80", "70 % de l'immigration est qualifiee"),
        bullet("b80", "Score minimum : 65 points"),
        bullet("b80", "Categories prioritaires adaptees chaque annee aux besoins du marche"),
        src("Australian Home Affairs — Points Table"),

        h2("B7. Nucleaire"),
        h3("Coree du Sud — Standardisation et construction en serie"),
        simpleTable(["Indicateur", "Coree du Sud", "France (Flamanville)"], [
          ["Cout par MW installe", "3 571 USD/kW", "7 931 USD/kW"],
          ["Duree construction", "56 mois", "216+ mois (18 ans)"],
          ["Taux de disponibilite", "> 90 %", "~65-70 %"],
        ], [3500, 3000, 2860]),
        note("La difference : standardisation (un seul design replique), main-d'oeuvre experimentee, chaine d'approvisionnement nationale."),
        note("Le programme EPR2 vise a reproduire cette logique : meme design x 6, puis x 14."),
        src("World Nuclear Association ; SFEN — Comparaison couts nucleaires"),
      ]
    }
  ]
});

const outputPath = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/FRANCE-2027-Programme-liberal.docx';
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document genere : ${outputPath}`);
  console.log(`Taille : ${(buffer.length / 1024 / 1024).toFixed(2)} Mo`);
}).catch(err => console.error('Erreur:', err));

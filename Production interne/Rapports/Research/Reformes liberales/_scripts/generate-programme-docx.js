const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, TabStopType, TabStopPosition } = require('docx');

// ── Helpers ──
const p = (children, opts = {}) => new Paragraph({ children, ...opts });
const t = (text, opts = {}) => new TextRun({ text, font: "Calibri", ...opts });
const b = (text, opts = {}) => new TextRun({ text, font: "Calibri", bold: true, ...opts });
const spacer = (pts = 100) => p([], { spacing: { after: pts } });

const bullet = (children, ref = "bullet-list") => new Paragraph({
  numbering: { reference: ref, level: 0 },
  spacing: { after: 60 },
  children
});

const subbullet = (children, ref = "sub-bullet") => new Paragraph({
  numbering: { reference: ref, level: 0 },
  spacing: { after: 40 },
  children
});

// Thin line separator
const separator = () => p([], {
  spacing: { before: 200, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 8 } }
});

// Mesure block
function mesure(num, title, description, chiffrageItems, reference) {
  const children = [];

  // Title
  children.push(p([
    b(`Mesure ${num} — `, { size: 22, color: "1A1A1A" }),
    b(title, { size: 22, color: "1A1A1A" })
  ], { spacing: { before: 300, after: 100 } }));

  // Description paragraphs
  if (Array.isArray(description)) {
    description.forEach(d => {
      children.push(p([t(d, { size: 20, color: "333333" })], { spacing: { after: 80 } }));
    });
  } else {
    children.push(p([t(description, { size: 20, color: "333333" })], { spacing: { after: 80 } }));
  }

  // Chiffrage section
  if (chiffrageItems && chiffrageItems.length > 0) {
    children.push(p([b("Chiffrage et impact :", { size: 20, color: "000000" })], { spacing: { before: 80, after: 40 } }));
    chiffrageItems.forEach(item => {
      children.push(bullet([t(item, { size: 20, color: "333333" })], "bullet-chiffrage"));
    });
  }

  // Reference
  if (reference) {
    children.push(p([t(reference, { size: 18, color: "777777", italics: true })], { spacing: { before: 60, after: 60 } }));
  }

  children.push(separator());
  return children;
}

// ── TABLE BORDERS ──
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorderBottom = { ...cellBorders, bottom: { style: BorderStyle.NONE, size: 0 } };

// ── BUILD DOCUMENT ──
async function generate() {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Calibri", size: 20 } } },
      paragraphStyles: [
        { id: "Title", name: "Title", basedOn: "Normal",
          run: { size: 48, bold: true, color: "1A1A1A", font: "Calibri" },
          paragraph: { spacing: { before: 0, after: 200 }, alignment: AlignmentType.LEFT } },
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, color: "1A1A1A", font: "Calibri" },
          paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, color: "333333", font: "Calibri" },
          paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 22, bold: true, color: "555555", font: "Calibri" },
          paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
      ]
    },
    numbering: {
      config: [
        { reference: "bullet-list",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        { reference: "bullet-chiffrage",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2013", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        { reference: "sub-bullet",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }] },
        { reference: "summary-list",
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      ]
    },
    sections: [
      // ════════ PAGE DE TITRE ════════
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            pageNumbers: { start: 1 }
          }
        },
        headers: {
          default: new Header({ children: [p([t("Programme economique liberal — 50 mesures chiffrees", { size: 16, color: "999999", italics: true })], { alignment: AlignmentType.RIGHT })] })
        },
        footers: {
          default: new Footer({ children: [p([
            t("Page ", { size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 16, color: "999999" }),
            t(" / ", { size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Calibri", size: 16, color: "999999" })
          ], { alignment: AlignmentType.CENTER })] })
        },
        children: [
          spacer(600),
          p([b("PROGRAMME ECONOMIQUE LIBERAL", { size: 56, color: "1A1A1A" })], { alignment: AlignmentType.LEFT, spacing: { after: 80 } }),
          p([b("50 MESURES CHIFFREES", { size: 40, color: "555555" })], { alignment: AlignmentType.LEFT, spacing: { after: 300 } }),
          p([], { border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "1A1A1A", space: 1 } }, spacing: { after: 300 } }),
          p([t("Un programme radical en 3 axes : liberer l'economie, restaurer la puissance, attirer les talents.", { size: 24, color: "333333" })], { spacing: { after: 120 } }),
          p([t("Chiffrage macro source : INSEE, OCDE, Cour des Comptes, COR, DREES, IFRAP, Eurostat.", { size: 20, color: "777777" })], { spacing: { after: 400 } }),

          // Key figures table
          new Table({
            columnWidths: [2340, 2340, 2340, 2340],
            rows: [
              new TableRow({ children: [
                ...[["50", "Mesures"], ["250+", "Md\u20AC d'economies/an"], ["47%", "Depenses/PIB cible"], ["10 ans", "De transition"]].map(([num, label]) =>
                  new TableCell({
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    width: { size: 2340, type: WidthType.DXA },
                    children: [
                      p([b(num, { size: 36, color: "1A1A1A" })], { alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
                      p([t(label, { size: 18, color: "777777" })], { alignment: AlignmentType.CENTER })
                    ]
                  })
                )
              ] })
            ]
          }),

          spacer(400),
          p([t("Mars 2026", { size: 20, color: "999999" })]),

          // ════════ ETAT DES LIEUX ════════
          p([new PageBreak()]),
          p([b("ETAT DES LIEUX")], { heading: HeadingLevel.HEADING_1 }),
          p([t("La France decroche sur tous les indicateurs de competitivite. Les chiffres parlent d'eux-memes.", { size: 20, color: "555555" })], { spacing: { after: 200 } }),

          // Diagnostic table
          new Table({
            columnWidths: [3000, 1800, 2400, 2160],
            rows: [
              new TableRow({ tableHeader: true, children: [
                ...["Indicateur", "France", "Reference UE/OCDE", "Ecart"].map(h =>
                  new TableCell({ borders: cellBorders, width: { size: h === "Indicateur" ? 3000 : h === "France" ? 1800 : h === "Ecart" ? 2160 : 2400, type: WidthType.DXA },
                    shading: { fill: "F2F2F2", type: ShadingType.CLEAR },
                    children: [p([b(h, { size: 18 })], { alignment: AlignmentType.CENTER })] }))
              ] }),
              ...[
                ["Depenses publiques / PIB", "57,1%", "49,2% (UE)", "+7,9 pts"],
                ["Prelevements obligatoires", "42,8%", "34,2% (OCDE)", "+8,6 pts"],
                ["Dette publique", "115,6% PIB", "95% (zone euro)", "+20 pts"],
                ["Charge d'interets", "58 Md\u20AC/an", "\u2014", "2e poste budgetaire"],
                ["Depenses retraites / PIB", "14,2%", "10-11%", "+3-4 pts"],
                ["Agents publics / 1 000 hab.", "89", "59 (Allemagne)", "+51%"],
                ["Code du travail", "10 000 articles", "54 (Suisse)", "\u00D7185"],
                ["Taux de chomage", "7,5%", "2,6% (Danemark)", "\u00D73"],
                ["Part industrie / PIB", "13,4%", "19,7% (Allemagne)", "-6,3 pts"]
              ].map(([ind, fr, ref, ecart]) =>
                new TableRow({ children: [
                  new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [p([t(ind, { size: 18 })])] }),
                  new TableCell({ borders: cellBorders, width: { size: 1800, type: WidthType.DXA }, children: [p([b(fr, { size: 18 })], { alignment: AlignmentType.CENTER })] }),
                  new TableCell({ borders: cellBorders, width: { size: 2400, type: WidthType.DXA }, children: [p([t(ref, { size: 18, color: "777777" })], { alignment: AlignmentType.CENTER })] }),
                  new TableCell({ borders: cellBorders, width: { size: 2160, type: WidthType.DXA }, children: [p([b(ecart, { size: 18 })], { alignment: AlignmentType.CENTER })] }),
                ] })
              )
            ]
          }),

          spacer(200),
          p([
            b("Objectif a 10 ans : ", { size: 20 }),
            t("ramener les depenses publiques de 57% a 47% du PIB (\u221210 pts = \u2212290 Md\u20AC), les prelevements obligatoires de 43% a 35%, et la dette sous 90% du PIB.", { size: 20 })
          ], { spacing: { after: 200 } }),

          // ════════════════════════════════════
          // AXE 1 — LIBERER L'ECONOMIE
          // ════════════════════════════════════
          p([new PageBreak()]),
          p([b("AXE 1 \u2014 LIBERER L'ECONOMIE")], { heading: HeadingLevel.HEADING_1 }),
          p([t("Mesures 1 a 25 \u2014 Retraites, travail, fiscalite, Etat, protection sociale", { size: 20, color: "555555", italics: true })], { spacing: { after: 200 } }),

          // A. RETRAITES
          p([b("A. Reforme des retraites \u2014 Transition vers la capitalisation")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(1, "Systeme mixte repartition/capitalisation (modele suedois)",
            [
              "Basculer progressivement vers un systeme a 3 piliers. Le pilier 1 conserve une repartition par comptes notionnels a hauteur de 12% des revenus (contre 28% aujourd'hui). Le pilier 2 instaure une capitalisation obligatoire a 8% des revenus, verses sur un compte individuel gere par un fonds de pension agree. Le pilier 3 ouvre une epargne volontaire totalement defiscalisee.",
              "La transition s'etale sur 25 ans. Les actifs de moins de 40 ans basculent integralement dans le nouveau systeme. Les 40-55 ans beneficient d'un regime hybride (moitie repartition, moitie capitalisation). Les plus de 55 ans restent en repartition pure, leurs droits acquis etant integralement garantis."
            ],
            [
              "Cout de transition : 30-50 Md\u20AC sur 15 ans (~3 Md\u20AC/an), finance par la dette, considere comme un investissement productif et non une depense courante.",
              "Economie a terme (horizon 2050) : 80-120 Md\u20AC/an grace a la reduction des depenses retraites de 14,2% a 8-9% du PIB.",
              "Rendement historique des fonds de pension : 5-8%/an en moyenne sur 30 ans, contre un rendement implicite de la repartition de 1,8% (egal a la croissance du PIB nominal).",
              "Le systeme suedois combine 14,88% en repartition notionnelle + 2,33% en capitalisation et dispose d'un mecanisme d'equilibre automatique qui ajuste les parametres sans intervention politique.",
              "Aux Pays-Bas, les actifs des fonds de pension representent 213% du PIB, garantissant un taux de remplacement moyen de 80%. En France, les reserves (FRR) representent moins de 1,5% du PIB."
            ],
            "Sources : COR Rapport annuel 2025, OCDE Pensions at a Glance 2023, AP7 (Suede), ABP (Pays-Bas)."
          ),

          ...mesure(2, "Age de depart a 67 ans, indexation automatique sur l'esperance de vie",
            [
              "Relevement progressif de l'age legal a raison de +4 mois par an, pour atteindre 67 ans en 2035. Au-dela, l'age de depart est automatiquement indexe sur l'esperance de vie a 60 ans : chaque annee supplementaire d'esperance de vie entraine +8 mois de travail supplementaire. Ce mecanisme depolitise les reformes parametriques et garantit la soutenabilite du systeme.",
              "La duree de cotisation requise pour le taux plein est alignee sur la moyenne europeenne (44 ans). Un dispositif de penibilite objectif (criteres medicaux, pas declaratifs) permet un depart anticipe a 62 ans pour les metiers les plus exposants."
            ],
            [
              "Economie estimee : 12-15 Md\u20AC/an a horizon 2035 selon les projections du COR (scenario de reference, productivite 1%).",
              "L'age moyen effectif de depart en France est de 62,3 ans, contre 64,4 ans en Allemagne, 65,2 ans au Danemark et 65 ans aux Pays-Bas.",
              "Chaque annee supplementaire de recul de l'age de depart genere 5-7 Md\u20AC d'economies (reduction des pensions versees + cotisations supplementaires percues).",
              "Le Danemark indexe l'age de depart sur l'esperance de vie depuis 2006. Resultat : aucune reforme parametrique necessaire depuis, equilibre actuariel automatique."
            ],
            "Sources : COR projections 2024-2070, Eurostat age effectif de sortie du marche du travail, OCDE."
          ),

          ...mesure(3, "Suppression de tous les regimes speciaux sans exception",
            [
              "Unification de l'ensemble des regimes de retraite en un regime unique aligne sur le regime general. Concernes : SNCF, RATP, EDF, industries electriques et gazieres, Banque de France, Opera de Paris, Comedie-Francaise, marins, clercs de notaire, et tous les regimes fermes mais encore actifs. Les droits acquis sont preserves mais les nouvelles annees cotisees le sont dans le regime unique."
            ],
            [
              "Economie directe : 5-8 Md\u20AC/an, liee a l'alignement des parametres (age, taux de cotisation, mode de calcul).",
              "Pension moyenne des regimes speciaux : 1 940\u20AC/mois brut, contre 1 360\u20AC dans le secteur prive, soit un ecart de +43%.",
              "Age moyen de depart des cheminots (SNCF) : 56,9 ans. Des agents RATP : 55,7 ans. Secteur prive : 62,3 ans.",
              "Le regime des IEG (EDF-GDF) est deficitaire de 1,8 Md\u20AC/an, finance par une subvention de l'Etat prelevee sur la facture d'electricite (CSPE).",
              "La reforme des regimes speciaux de 2023 n'a concerne que les nouveaux entrants. Ici, il s'agit d'une convergence immediate des parametres pour tous, avec clause de lissage sur 10 ans pour les proches de la retraite."
            ],
            "Sources : Cour des Comptes rapport retraites 2024, DREES retraites et retraites 2024, Commission des comptes de la Securite sociale."
          ),

          ...mesure(4, "Fonds souverain retraite de 500 Md\u20AC a horizon 2040",
            [
              "Constitution progressive d'un fonds souverain dedie exclusivement au financement des retraites. Il est alimente par trois sources : les recettes de privatisations (mesure 15), les excedents budgetaires degages par les reformes structurelles, et une quote-part de 2% des cotisations capitalisation du pilier 2. Le fonds est gere par une autorite independante, avec un mandat d'investissement de long terme (horizon 30+ ans) et une allocation diversifiee (actions mondiales 60%, obligations 25%, actifs reels 15%)."
            ],
            [
              "Objectif d'encours : 500 Md\u20AC en 15 ans, soit 15% du PIB a horizon 2040.",
              "Rendement annuel moyen cible : 5%, generant 25 Md\u20AC/an de revenus a terme, soit l'equivalent de la moitie du deficit projete des retraites a 2070.",
              "Le Fonds souverain norvegien (GPFG) a accumule 1 400 Md\u20AC et degage un rendement annuel moyen de 6,3% depuis 1998.",
              "Le Canada Pension Plan (CPP) gere 440 Md\u20AC avec un rendement annualise de 9,2% sur 10 ans.",
              "Le FRR francais (Fonds de Reserve pour les Retraites), cree en 2001 puis ponctionne en 2010, ne pesait que 33 Md\u20AC a son maximum. La France est le seul grand pays developpe a ne pas disposer d'un fonds de pension significatif."
            ],
            "Sources : GPFG rapport annuel 2024, CPP Investment Board, FRR rapport annuel."
          ),

          // B. MARCHE DU TRAVAIL
          p([new PageBreak()]),
          p([b("B. Deregulation du marche du travail")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(5, "Code du travail : de 10 000 a 200 articles",
            [
              "Reecriture integrale du Code du travail. Le nouveau code se limite a 200 articles fixant les principes generaux : non-discrimination, securite au travail, liberte syndicale, repos minimum. Tout le reste \u2014 duree du travail, remuneration, organisation, licenciement \u2014 releve de la negociation de branche et, a defaut, de la negociation d'entreprise. Le code actuel compte plus de 10 000 articles ; la Suisse en a 54 pour un taux de chomage de 2%."
            ],
            [
              "Le cout de la sur-reglementation en France est estime a 100 Md\u20AC/an par l'IFRAP et le Senat (commissions parlementaires 2022).",
              "Gain potentiel de competitivite : 30-50 Md\u20AC/an, par reduction des couts de conformite, acceleration des procedures, et elimination de l'insecurite juridique.",
              "La France dispose de 69 codes en vigueur (vs moins de 20 dans la plupart des pays europeens).",
              "En 2024, 223 nouveaux textes reglementaires examines ont genere 3,3 Md\u20AC de couts bruts pour les entreprises et collectivites.",
              "Le modele suisse repose sur un code de 54 articles completee par des conventions collectives de travail (CCT) negociees par branche. Resultat : taux de chomage 2%, taux d'emploi 80%, conflits sociaux quasi inexistants."
            ],
            "Sources : IFRAP etude complexite administrative 2023, Senat rapport normes, CNEN rapport annuel 2024."
          ),

          ...mesure(6, "Liberte totale d'embauche et de separation pour les entreprises < 50 salaries",
            [
              "Suppression de l'obligation de motif reel et serieux pour le licenciement dans les entreprises de moins de 50 salaries. L'employeur peut rompre le contrat a tout moment moyennant une indemnite forfaitaire : 1 mois de salaire par annee d'anciennete, plafonnee a 12 mois. Aucune procedure prealable obligatoire. Pas de recours possible devant les prud'hommes sur le motif (seulement sur l'indemnite et la discrimination)."
            ],
            [
              "99,9% des entreprises francaises ont moins de 250 salaries ; 97% ont moins de 50. Cette mesure touche l'immense majorite du tissu economique.",
              "Effet attendu sur l'emploi : +500 000 embauches nettes sur 5 ans, par elimination de la peur d'embaucher.",
              "En Allemagne, les reformes Hartz (2003-2005) ont fait passer le chomage de 11,5% a 3,1% en 15 ans, principalement par la flexibilisation de l'emploi.",
              "Le cout moyen d'un licenciement aux prud'hommes pour une PME francaise est de 30 000-50 000\u20AC (honoraires avocat + indemnites + temps perdu), sans compter l'incertitude juridique qui s'etale sur 18-24 mois.",
              "En Suisse, le licenciement est libre avec un preavis de 1-3 mois selon l'anciennete. Aucune indemnite n'est due sauf licenciement abusif (maximum 6 mois). Resultat : taux de chomage structurel sous 3%."
            ],
            "Sources : INSEE demographie des entreprises, DARES statistiques prud'hommes, IAB Nuremberg (reformes Hartz)."
          ),

          ...mesure(7, "Contrat de travail unique a droits progressifs",
            [
              "Suppression de la dualite CDI/CDD au profit d'un contrat unique. Les droits du salarie augmentent avec l'anciennete : indemnite de rupture croissante, droit a la formation, preavis allonge. Ce mecanisme protege les salaries experimentes tout en eliminant la barriere a l'embauche que represente le CDI actuel. Les entreprises n'hesitent plus a embaucher car elles savent que la separation, si necessaire, est geree par des regles claires et previsibles."
            ],
            [
              "En Italie, le Jobs Act de 2015 a instaure un contrat unique a protections croissantes. Resultat : +600 000 CDI en 2 ans, taux de chomage passe de 12,7% a 9,5%.",
              "En France, 87% des nouvelles embauches sont en CDD ou interim, creant un marche du travail a deux vitesses ou les insiders (CDI) sont surproteges et les outsiders (precaires) sous-proteges.",
              "La duree moyenne d'un CDD en France est de 12 jours. 70% des CDD sont de moins d'un mois. Le systeme actuel pousse les entreprises vers l'ultra-court terme.",
              "Le contrat unique aligne les incitations : l'employeur investit dans le salarie (formation, montee en competences) car la protection croit avec le temps, rendant le turnover plus couteux a mesure que la relation murit."
            ],
            "Sources : ISTAT (Italie) rapport Jobs Act 2017, DARES flux d'emploi 2024, OCDE Employment Outlook."
          ),

          ...mesure(8, "Plafonnement des indemnites prud'homales a 6 mois de salaire",
            [
              "Le bareme Macron, actuellement indicatif (la Cour de cassation l'a confirme mais les juges s'en ecartent regulierement), devient obligatoire et plafonne a 6 mois de salaire maximum, quel que soit l'anciennete, hors cas de discrimination ou de harcelement. Les jugements doivent etre rendus en 3 mois maximum (contre 16 mois en moyenne aujourd'hui)."
            ],
            [
              "Cout moyen d'un contentieux prud'homal pour une PME : 30 000-50 000\u20AC tout compris.",
              "Duree moyenne de traitement aux prud'hommes : 16,1 mois. Un quart des affaires depassent 2 ans.",
              "En Allemagne, 80% des litiges du travail sont regles en moins de 3 mois. En France, 30% des affaires font l'objet d'un appel, allongeant la procedure de 12-18 mois supplementaires.",
              "L'incertitude juridique est le premier frein a l'embauche cite par les dirigeants de PME (sondage CPME 2024, 67% des repondants)."
            ],
            "Sources : Ministere de la Justice statistiques prud'homales 2024, CPME barometre PME."
          ),

          ...mesure(9, "Suppression des 35h, liberte contractuelle",
            [
              "Abrogation de la duree legale du travail a 35 heures. Chaque contrat de travail fixe librement le nombre d'heures. La seule limite est la directive europeenne (48h/semaine en moyenne sur 4 mois). La notion d'heures supplementaires majorees disparait. Les conventions de branche peuvent fixer des planchers et des majorations si les partenaires sociaux le souhaitent, mais la loi ne l'impose plus."
            ],
            [
              "La France travaille en moyenne 1 607 heures par an et par salarie, contre 1 810 heures en Suisse (+12,6%), 1 732 en Allemagne, et 1 811 aux Etats-Unis.",
              "Impact macro-economique : +2h travaillees par semaine en moyenne = +2,5% de PIB, soit environ 75 Md\u20AC de creation de richesse supplementaire.",
              "Le passage aux 35 heures en 2000 a coute entre 12 et 22 Md\u20AC en allegements de charges compensatoires selon les estimations (OFCE, Cour des Comptes).",
              "Le cout du travail horaire en France est de 40,5\u20AC/h, le 5e plus eleve de l'UE. En ajoutant la productivite plus faible par heure travaillee (liee aux 35h), la competitivite-cout est significativement degradee.",
              "En Suisse, la duree legale est de 45h/semaine pour l'industrie et 50h pour les services, sans notion d'heures supplementaires majorees en dessous. Les salaries negocient leur temps de travail directement avec leur employeur."
            ],
            "Sources : OCDE heures travaillees par salarie, Eurostat cout horaire du travail, OFCE evaluation des 35h."
          ),

          ...mesure(10, "Suppression du SMIC national, plancher par branche",
            [
              "Le SMIC national (1 766\u20AC brut mensuel en 2024) est remplace par des salaires minimum negocies par branche professionnelle, avec un plancher absolu de 1 200\u20AC brut. Chaque branche fixe un minimum coherent avec sa productivite et ses conditions. L'hotellerie-restauration, le BTP, l'industrie et la tech n'ont pas les memes contraintes economiques et ne doivent pas etre alignes sur le meme minimum. Le plancher de 1 200\u20AC concerne les branches a faible productivite et le temps partiel."
            ],
            [
              "En France, 12,8% des salaries sont au SMIC (2024), un taux record qui temoigne de la compression des salaires par le bas. En Allemagne (Mindestlohn depuis 2015 seulement), le taux est de 4,3%.",
              "Le taux de chomage des non-qualifies en France est de 15,3%, soit 3 fois celui des qualifies. Le SMIC eleve est identifie par l'OCDE comme une barriere a l'emploi pour les peu qualifies.",
              "Le modele allemand (Mindestlohn a 12,41\u20AC/h) est plus bas que le SMIC francais (11,65\u20AC/h) mais s'accompagne d'une flexibilite beaucoup plus grande (Minijobs, interim facilite).",
              "Le modele scandinave (Suede, Danemark, Finlande) n'a aucun salaire minimum legal. Les minima sont negocies par branche entre syndicats et employeurs. Resultat : taux de chomage sous 4%, salaire median parmi les plus eleves d'Europe."
            ],
            "Sources : DARES statistiques SMIC 2024, OCDE Employment Outlook, Destatis (Allemagne), Statistics Denmark."
          ),

          // C. FISCALITE
          p([new PageBreak()]),
          p([b("C. Fiscalite \u2014 Choc de simplification")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(11, "Flat tax a 15% sur tous les revenus du capital",
            [
              "Taux unique de 15% (contre PFU de 30% actuellement) sur l'ensemble des revenus du capital : plus-values mobilieres et immobilieres, dividendes, interets, loyers. Pour les createurs d'entreprise qui restent minimum 5 ans, pas de prelevements sociaux supplementaires. L'objectif est de faire de la France le pays le plus attractif d'Europe pour les investisseurs et les entrepreneurs."
            ],
            [
              "Le PFU actuel est de 30% (12,8% IR + 17,2% prelevements sociaux). La baisse a 15% divise par 2 la fiscalite du capital.",
              "Perte initiale estimee : 5-8 Md\u20AC/an. Compensee a 3-5 ans par l'elargissement de l'assiette : plus de residents fiscaux, plus de transactions, moins d'optimisation et d'exil fiscal.",
              "En Bulgarie, l'instauration d'une flat tax a 10% sur les revenus et le capital en 2008 a entraine une hausse de 30% des recettes fiscales en 5 ans.",
              "La France a perdu 12 000 contribuables a l'ISF/IFI par an entre 2017 et 2023, soit une perte de base fiscale de 35 Md\u20AC de patrimoine declarable par an.",
              "Avec une flat tax a 15%, la France serait plus attractive que le Luxembourg (15% sur dividendes), la Belgique (30%) et a parite avec l'Irlande (33% sur plus-values mais 12,5% IS)."
            ],
            "Sources : DGFiP statistiques PFU 2024, Eurostat fiscalite du capital, National Revenue Agency Bulgaria."
          ),

          ...mesure(12, "Impot sur les societes a 15%, zero pour les benefices reinvestis",
            [
              "Le taux normal d'IS est ramene a 15% sur les benefices distribues (dividendes). Les benefices reinvestis dans l'entreprise (investissements productifs, R&D, embauches, equipements) sont exoneres a 100% pendant 10 ans. Au-dela de 10 ans : 15% sur tout. Cette mesure s'applique a toutes les entreprises, pas seulement aux startups. L'objectif est d'inciter massivement au reinvestissement et d'attirer les sieges sociaux en France."
            ],
            [
              "Recettes IS en 2024 : 84 Md\u20AC (2,9% du PIB). Le taux nominal actuel est de 25% (+ 3,3% de contribution sociale).",
              "Perte initiale estimee : 20-25 Md\u20AC/an. Compensee a 5 ans par : afflux massif d'IDE, relocalisation de sieges sociaux, elargissement de la base imposable.",
              "L'Irlande avec un IS a 12,5% a attire plus de 700 sieges de multinationales americaines et degage un excedent budgetaire de 10 Md\u20AC en 2023, les recettes IS ayant quintuple en 10 ans.",
              "L'Estonie applique un IS de 0% sur les benefices non distribues depuis 2000. Resultat : doublement des IDE en 10 ans, taux de reinvestissement des entreprises parmi les plus eleves d'Europe.",
              "L'IS effectif moyen en France (apres niches et CIR) est de 17-19%, mais l'affichage a 25% repousse les investisseurs. La lisibilite du 15% est un signal fort.",
              "Le pilier 2 de l'OCDE (taux minimum 15%) rend cette mesure compatible avec les engagements internationaux."
            ],
            "Sources : DGFiP recettes fiscales 2024, OCDE Pilier 2, Revenue Commissioners Ireland, Estonian Tax Board."
          ),

          ...mesure(13, "Impot sur le revenu : 2 tranches, maximum 25%",
            [
              "Simplification radicale du bareme de l'IR. Trois niveaux seulement : 0% jusqu'a 15 000\u20AC de revenus imposables, 15% entre 15 000\u20AC et 75 000\u20AC, 25% au-dela. Suppression simultanee de l'integralite des 474 niches fiscales (deductions, reductions, credits d'impot) qui representent 94 Md\u20AC de manque a gagner en 2024. Seule exception conservee : le don aux associations (maintenu a 66%)."
            ],
            [
              "Recettes IR actuelles : 96 Md\u20AC/an. 53% des foyers (21,9 millions) ne paient pas d'IR.",
              "Les 474 niches fiscales coutent 94 Md\u20AC par an a l'Etat. Leur suppression compense la baisse des taux marginaux. Effet net estime : neutre a +5 Md\u20AC de recettes supplementaires.",
              "La simplification elimine 80% de la complexite declarative, reduit la fraude (estimee a 20-25 Md\u20AC/an sur l'IR), et rend inutile le recours a un comptable pour 90% des foyers.",
              "Un celibataire gagnant 40 000\u20AC paierait : (15 000 \u00D7 0%) + (25 000 \u00D7 15%) = 3 750\u20AC, soit un taux effectif de 9,4%. Aujourd'hui, il paie environ 4 800\u20AC (taux effectif 12%).",
              "Un cadre gagnant 100 000\u20AC paierait : (15 000 \u00D7 0%) + (60 000 \u00D7 15%) + (25 000 \u00D7 25%) = 15 250\u20AC, soit 15,3%. Aujourd'hui : ~22 000\u20AC (22%)."
            ],
            "Sources : DGFiP bareme IR 2024, Rapport depenses fiscales PLF 2025, FIPECO prelevements obligatoires."
          ),

          ...mesure(14, "Suppression totale des droits de succession en ligne directe",
            [
              "Zero impot sur la transmission parents vers enfants, quel que soit le montant transmis. L'objectif est triple : permettre la transmission des entreprises familiales sans les forcer a la vente, favoriser l'accumulation de capital productif sur plusieurs generations, et mettre fin a la double imposition (l'epargne transmise a deja ete soumise a l'IR, aux prelevements sociaux, et souvent a l'IFI)."
            ],
            [
              "Recettes des droits de succession et donation : 17 Md\u20AC/an (2024). C'est une perte seche pour le budget.",
              "La France a le 3e taux marginal le plus eleve du monde sur les successions (45%, apres le Japon a 55% et la Coree du Sud a 50%).",
              "Les pays sans droits de succession en ligne directe incluent : Suede (suppression en 2005), Autriche (2008), Norvege (2014), Portugal, Australie, Nouvelle-Zelande, Canada.",
              "Chaque annee, environ 15 000 entreprises familiales sont vendues ou demantelees en France pour payer les droits de succession, entrainant une perte estimee de 40 000 emplois.",
              "L'effet Laffer est fort sur les successions : l'exil fiscal des grands patrimoines (3 000-5 000 departs/an vers la Belgique, la Suisse, le Portugal) reduit deja considerablement l'assiette."
            ],
            "Sources : DGFiP statistiques successions 2024, OCDE Inheritance Taxation, BPI France transmission d'entreprise."
          ),

          ...mesure(15, "Privatisation massive : 100 Md\u20AC en 5 ans",
            [
              "Vente des participations de l'Etat dans : EDF (85,3% = ~50 Md\u20AC), Renault (15%), Orange (13%), ADP (50,6%), FDJ (20%), La Poste (100%), SNCF fret, France Televisions, Radio France. L'Etat conserve uniquement ses participations strategiques dans la defense (Thales, Naval Group, MBDA) et le nucleaire militaire. Les recettes sont flechees a parts egales vers le desendettement (50 Md\u20AC) et le fonds souverain retraite (50 Md\u20AC)."
            ],
            [
              "Portefeuille total des participations de l'Etat (APE) : 160 Md\u20AC en valeur de marche (2024).",
              "Objectif de cession : 100 Md\u20AC sur 5 ans, soit 20 Md\u20AC par an.",
              "EDF seule represente environ 50 Md\u20AC de capitalisation. Le rachat a 100% en 2023 a coute 9,7 Md\u20AC aux contribuables.",
              "Les dividendes percus par l'Etat actionnaire representent 4-6 Md\u20AC/an. Mais la reduction de la dette de 50 Md\u20AC economise 1,5-2 Md\u20AC/an en charge d'interets, et les 50 Md\u20AC du fonds souverain generent 2,5 Md\u20AC/an a 5% de rendement.",
              "Le Royaume-Uni a privatise British Telecom, British Gas, British Airways, et les chemins de fer entre 1984 et 1996, generant des dizaines de milliards et ameliorant significativement la qualite de service dans la plupart des secteurs."
            ],
            "Sources : APE rapport annuel 2024, Agence France Tresor, Cour des Comptes rapport EDF."
          ),

          // D. REDUCTION DE L'ETAT
          p([new PageBreak()]),
          p([b("D. Reduction de l'Etat")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(16, "Suppression de 1 million de postes de fonctionnaires en 10 ans",
            [
              "Non-remplacement de 100% des departs en retraite dans la fonction publique (environ 150 000/an) pendant 7 ans, complete par un plan de departs volontaires avec indemnites (equivalent a 2 ans de salaire). L'effectif passe de 5,9 millions a 4,9 millions d'agents publics. La priorite est donnee a la numerisation des taches administratives et a l'externalisation des fonctions support (restauration, entretien, informatique). Les fonctions regaliques (police, justice, armee, diplomatie) sont sanctuarisees."
            ],
            [
              "Masse salariale de la fonction publique : 250 Md\u20AC/an (1er poste de depense de l'Etat).",
              "Cout moyen d'un agent public : 42 000\u20AC/an (charges incluses). 1 million de postes = 42 Md\u20AC/an d'economies.",
              "La France emploie 89 agents publics pour 1 000 habitants, contre 59 en Allemagne (+51%), 80 au Royaume-Uni, et moins de 50 en Suisse.",
              "Le Canada, en 1995 (Program Review), a supprime 55 000 postes publics (-25% des effectifs federaux) en 3 ans. Resultat : retour a l'equilibre budgetaire en 3 exercices, dette passee de 67% a 29% du PIB en 12 ans.",
              "L'Estonie gere 99% des services publics en ligne avec un effectif total de fonctionnaires inferieur a celui d'une grande mairie francaise."
            ],
            "Sources : INSEE emploi fonction publique 2024, DGAFP rapport annuel, Canadian Government Program Review 1995."
          ),

          ...mesure(17, "Fusion des communes : de 35 000 a 5 000",
            [
              "Fusion obligatoire de toutes les communes de moins de 5 000 habitants en ensembles de 5 000 a 20 000 habitants. La France compte 35 000 communes (record europeen absolu), dont 31 000 ont moins de 2 000 habitants. Cela mobilise 520 000 elus locaux (conseillers municipaux, maires, adjoints), contre 20 000 en Allemagne (11 000 communes) et quelques milliers au Royaume-Uni (400 collectivites). Les communes fusionnees mutualisent leurs services (etat civil, urbanisme, voirie, ecoles) avec des economies d'echelle massives."
            ],
            [
              "Economie estimee : 15-20 Md\u20AC/an par elimination des doublons administratifs, mutualisation des achats publics, et rationalisation des equipements.",
              "Le nombre d'elus passe de 520 000 a environ 80 000, avec une economie de 2-3 Md\u20AC/an en indemnites et frais de fonctionnement des assemblees.",
              "La France depense 250 Md\u20AC/an en depenses des collectivites locales, dont une part significative en frais de structure (batiments, personnel administratif, systemes d'information redondants).",
              "Le Danemark est passe de 271 a 98 communes en 2007. Bilan a 10 ans : economies de 15-20% sur les couts de fonctionnement, amelioration de la qualite des services publics, hausse de la satisfaction des usagers."
            ],
            "Sources : DGCL collectivites locales en chiffres 2024, Eurostat gouvernance locale, Danish Ministry of the Interior reform evaluation."
          ),

          ...mesure(18, "Suppression des departements",
            [
              "Transfert des competences departementales aux regions (aide sociale, RSA, routes departementales, PMI) et aux intercommunalites (colleges, proximite, solidarite). Les 101 departements representent une couche administrative redondante entre les communes/intercommunalites et les regions. Leur suppression s'accompagne du transfert des agents (70 000) vers les regions et intercos."
            ],
            [
              "Budget total des departements : 85 Md\u20AC/an. L'economie de structure (suppression des doublons, conseils departementaux, cabinets, hotels de departement) est estimee a 8-12 Md\u20AC/an.",
              "Les departements emploient 350 000 agents. Le transfert aux regions et intercos permet une rationalisation estimee a 20-30% des effectifs de support.",
              "La France est le seul grand pays europeen a avoir 4 niveaux de collectivites (communes, intercos, departements, regions). L'Allemagne en a 3 (communes, Kreise, Lander), le Royaume-Uni 2, l'Espagne 3."
            ],
            "Sources : DGCL budget collectivites, Cour des Comptes rapport decentralisation 2023."
          ),

          ...mesure(19, "Zero papier, 100% numerique pour toute l'administration d'ici 2030",
            [
              "Toute demarche administrative doit etre realisable en ligne en 5 minutes maximum. Identite numerique obligatoire pour tous les citoyens majeurs. Suppression de tous les guichets physiques sauf exception (personnes agees dependantes, situations de detresse). Les formulaires papier sont supprimes. Le principe du \"dites-le nous une fois\" (DLNUF) est etendu a l'ensemble des administrations : aucune information deja connue de l'Etat ne peut etre redemandee."
            ],
            [
              "Cout de la demaritalisation : 5 Md\u20AC d'investissement sur 5 ans (infrastructure, developpement, formation).",
              "Economie : 10-15 Md\u20AC/an (postes, locaux, papier, affranchissement, archivage).",
              "L'Estonie, avec 1,3 million d'habitants, gere 99% de ses services publics en ligne. Les citoyens economisent en moyenne 5 jours ouvrables par an de demarches. Le cout de fonctionnement de l'administration est 10x inferieur par habitant a celui de la France.",
              "Le Danemark a supprime le courrier postal administratif en 2014. 92% des Danois utilisent la boite aux lettres numerique officielle (e-Boks).",
              "En France, seules 67% des demarches sont realisables en ligne (2024), et la moitie d'entre elles necessitent encore l'envoi d'un document papier."
            ],
            "Sources : DINUM tableau de bord demarches en ligne, e-Estonia rapport, Digital Denmark Strategy."
          ),

          ...mesure(20, "Interdiction constitutionnelle du deficit budgetaire",
            [
              "Inscription dans la Constitution d'une regle d'or budgetaire : le budget de l'Etat doit etre vote a l'equilibre ou en excedent. Toute depense nouvelle implique la suppression d'une depense equivalente. Clause de sortie strictement limitee : guerre, catastrophe naturelle, ou pandemie, activee par un vote des 3/5 du Parlement pour une duree maximale de 2 ans."
            ],
            [
              "Le dernier budget equilibre en France date de 1974. 50 ans de deficits ininterrompus ont accumule 3 400 Md\u20AC de dette.",
              "La charge d'interets de la dette a atteint 58 Md\u20AC en 2024 (+30 Md\u20AC en 4 ans), soit plus que le budget de l'Education nationale ou celui de la Defense.",
              "La Suisse a inscrit un frein a l'endettement dans sa Constitution en 2003. Resultat : dette publique passee de 50% a 27% du PIB en 20 ans, excedents budgetaires quasi continus.",
              "L'Allemagne dispose d'un frein a la dette (Schuldenbremse) depuis 2009, limitant le deficit structurel a 0,35% du PIB. La dette allemande est a 63% du PIB, contre 116% en France.",
              "Sans regle constitutionnelle, le biais politique vers la depense est structurel : chaque gouvernement est incite a depenser pour etre reelu, en repoussant le remboursement aux generations suivantes."
            ],
            "Sources : INSEE comptes de la Nation, Agence France Tresor, Administration federale des finances suisse, Bundesministerium der Finanzen."
          ),

          // E. PROTECTION SOCIALE
          p([new PageBreak()]),
          p([b("E. Protection sociale \u2014 Allocation unique")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(21, "Allocation universelle unique remplacant toutes les aides sociales",
            [
              "Fusion de la totalite des aides sociales (RSA, APL, AAH, ASS, prime d'activite, allocations familiales, ASPA, complement familial, prime de Noel, etc. \u2014 soit plus de 2 200 aides existantes) en une allocation unique degressive versee automatiquement par le fisc. Montant de base : 800\u20AC/mois pour une personne seule sans revenu. Majoration de 400\u20AC par enfant. Degressive : pour chaque euro gagne au-dela de 500\u20AC, l'allocation diminue de 0,50\u20AC. L'objectif est triple : simplifier, lutter contre le non-recours, et rendre le travail toujours plus remunerateur que l'inactivite."
            ],
            [
              "Depenses actuelles cumulees des aides sociales : ~70 Md\u20AC/an (RSA 11,9 Md\u20AC, APL 16 Md\u20AC, AAH 12 Md\u20AC, prime d'activite 10 Md\u20AC, allocations familiales 13 Md\u20AC, autres 7 Md\u20AC).",
              "Economie visee : 15-20 Md\u20AC/an grace a : suppression des doublons (chaque aide a sa propre administration), elimination du non-recours (30% des ayants droit au RSA ne le demandent pas), et reduction de la fraude.",
              "La fraude sociale est estimee a 13 Md\u20AC/an dont 7 Md\u20AC de travail dissimule, 1,5 Md\u20AC de fraude au RSA, et 1 Md\u20AC de fraude a la prime d'activite.",
              "Les couts de gestion des 2 200 aides representent 8-10 Md\u20AC/an (CAF, MSA, Pole emploi, departements, etc.). L'allocation unique est versee par l'administration fiscale, deja en contact avec tous les foyers.",
              "Le taux de non-recours (personnes eligibles qui ne demandent pas l'aide) est de 34% pour le RSA, 26% pour la prime d'activite, et jusqu'a 50% pour certaines aides locales. Le versement automatique elimine ce probleme."
            ],
            "Sources : CNAF donnees RSA 2024, DREES non-recours 2023, Cour des Comptes fraude sociale 2024."
          ),

          ...mesure(22, "Assurance chomage privee et obligatoire",
            [
              "Fin du monopole de l'UNEDIC. Les salaries choisissent leur assureur chomage parmi des operateurs prives agrees par l'Etat (assureurs, mutuelles, instituts de prevoyance). Cotisation obligatoire a 3% du salaire brut (vs 6,4% aujourd'hui, employeur + salarie). Duree d'indemnisation maximale : 12 mois (vs 24-36 mois aujourd'hui). Degressivite forte : 80% du salaire les 3 premiers mois, 60% les 3 suivants, 50% les 6 derniers. Les assureurs qui reinsertent plus vite leurs assures sont recompenses par une meilleure reputation et des cotisations plus basses."
            ],
            [
              "Budget UNEDIC : 45 Md\u20AC/an. Reduction de la duree et des montants = 10-15 Md\u20AC/an d'economies.",
              "La duree moyenne d'indemnisation en France etait de 482 jours (Q3 2023), soit 16 mois. Au Royaume-Uni : 6 mois. En Allemagne post-Hartz : 12 mois maximum.",
              "La France indemnise a hauteur de 57-75% du salaire brut. La moyenne OCDE est de 50-60%.",
              "Le Danemark combine la flexibilite totale du marche du travail (licenciement libre) avec une indemnisation genereuse (90% du salaire) mais de courte duree (24 mois), couplee a des politiques actives d'emploi intensives. Resultat : taux de chomage 2,6%, taux d'emploi 77%.",
              "La mise en concurrence des assureurs cree une incitation a l'efficacite : plus l'assureur aide ses clients a retrouver un emploi vite, moins il paie d'indemnites, et plus il peut proposer des cotisations basses."
            ],
            "Sources : UNEDIC situation financiere 2025, OCDE Benefits and Wages, Statistics Denmark."
          ),

          ...mesure(23, "Sante : franchise de 50\u20AC/an et deremboursement des medicaments de confort",
            [
              "Instauration d'une franchise annuelle de 50\u20AC sur les depenses de sante courantes (hors affections de longue duree, maternite et mineurs). Au-dela de 50\u20AC, le remboursement reste au taux normal. Parallelement, deremboursement integral de tous les medicaments classes a service medical rendu (SMR) insuffisant ou faible. Mise en concurrence renforcee des mutuelles pour le reste a charge, avec portabilite totale et comparateur public."
            ],
            [
              "Depenses de sante en France : 333 Md\u20AC (11,6% du PIB), le 2e ratio le plus eleve de l'OCDE apres les Etats-Unis.",
              "La France rembourse 36 Md\u20AC de medicaments par an. 15-20% sont des medicaments de confort ou a SMR insuffisant, soit 5-7 Md\u20AC.",
              "Economie totale estimee : 5-8 Md\u20AC/an (franchise + deremboursement + effet responsabilisation).",
              "La franchise de 50\u20AC rapporte environ 3 Md\u20AC de recettes/economies, tout en protegeant les patients ALD (100% pris en charge) et les plus fragiles.",
              "L'Allemagne applique un ticket moderateur de 10\u20AC par visite et des franchises significatives. Le systeme allemand coute 11,1% du PIB pour des resultats sanitaires comparables ou superieurs."
            ],
            "Sources : DREES comptes de la sante 2024, CNAM donnees SNDS, OCDE Health at a Glance 2024."
          ),

          ...mesure(24, "Suppression de la CMU-C et de l'AME, remplacement par un bon sante",
            [
              "Les beneficiaires de la CMU-C et de l'AME recoivent un bon sante annuel de 2 000\u20AC utilisable chez n'importe quel assureur prive agree. Ce bon couvre les soins de base (consultations, hospitalisations, pharmacie). Les soins urgents restent pris en charge inconditionnellement. L'objectif est de responsabiliser les beneficiaires et de mettre les assureurs en concurrence sur la qualite et le cout."
            ],
            [
              "CMU-C : 3 Md\u20AC/an pour 5,8 millions de beneficiaires.",
              "AME (Aide Medicale d'Etat) : 1,2 Md\u20AC/an pour 420 000 beneficiaires (etrangers en situation irreguliere).",
              "Le bon sante (2 000\u20AC \u00D7 6 millions de personnes) coute 12 Md\u20AC/an, soit plus cher que le systeme actuel. Alternative : bon sante cible a 1 500\u20AC pour les plus modestes, maintenant le budget a 4,2 Md\u20AC.",
              "La mise en concurrence des assureurs permet de reduire les couts de gestion (actuellement 8-10% des prestations versees par la Secu) et d'ameliorer le suivi des patients."
            ],
            "Sources : CNAM rapport activite, DREES beneficiaires CMU-C 2024, DSS comptes AME."
          ),

          ...mesure(25, "Logement : suppression de toutes les aides a la pierre, liberation du foncier",
            [
              "Fin des APL (16 Md\u20AC), fin du logement social subventionne (30 Md\u20AC au total), suppression de la loi SRU (obligation de 25% de logements sociaux). En contrepartie : liberation totale du foncier constructible (zones agricoles non productives, friches industrielles, emprise ferroviaire desaffectee), suppression de 80% des normes de construction (la France en a 3 500, contre 500 en Allemagne), et delai de permis de construire ramene a 30 jours (silence vaut acceptation)."
            ],
            [
              "Depenses publiques totales pour le logement : 29,6 Md\u20AC/an (aides a la personne + aides a la pierre + credit d'impot). Avec les couts indirects (garanties, exonerations) : ~40 Md\u20AC.",
              "2,76 millions de menages sont en attente d'un logement social. Le delai moyen d'obtention est de 33 mois a Paris, 22 mois en Ile-de-France.",
              "Les APL ont un effet inflationniste demontre : l'essentiel de l'aide est captee par les proprietaires via des loyers plus eleves. L'INSEE estime que la suppression des APL ferait baisser les loyers de 60-80% du montant de l'aide.",
              "L'augmentation de l'offre par la liberation du foncier et la simplification des normes pourrait faire baisser les prix de 20-30% a moyen terme (5-10 ans), rendant les aides inutiles.",
              "En Suisse, pas de logement social au sens francais, pas d'APL. Le taux de propriete est de 42% (vs 58% en France), mais les loyers sont accessibles grace a une offre abondante et un marche flexible."
            ],
            "Sources : Comptes du logement 2024, INSEE effets APL, SNE demandes HLM, OCDE Affordable Housing."
          ),

          // ════════════════════════════════════
          // AXE 2 — RESTAURER LA PUISSANCE
          // ════════════════════════════════════
          p([new PageBreak()]),
          p([b("AXE 2 \u2014 RESTAURER LA PUISSANCE")], { heading: HeadingLevel.HEADING_1 }),
          p([t("Mesures 26 a 38 \u2014 Energie, defense, industrie, technologie", { size: 20, color: "555555", italics: true })], { spacing: { after: 200 } }),

          // F. ENERGIE
          p([b("F. Souverainete energetique")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(26, "20 nouveaux reacteurs nucleaires d'ici 2045",
            [
              "Acceleration massive du programme nucleaire francais. Construction de 20 EPR2 au lieu des 6 confirmes et 8 a l'etude. L'objectif est d'atteindre 100% d'electricite nucleaire (hors hydraulique existant) et de faire de la France le premier exportateur net d'electricite d'Europe. Les reacteurs sont construits par paires sur les sites existants (Penly, Gravelines, Bugey, Tricastin, Blayais, Cattenom) pour optimiser les couts et les delais."
            ],
            [
              "Cout des 6 premiers EPR2 : 72,8 Md\u20AC (estimation EDF 2023, constants 2020). Avec couts de financement : >100 Md\u20AC.",
              "20 EPR2 : ~200 Md\u20AC sur 20 ans, soit 10 Md\u20AC/an. Amortissables sur 60 ans de fonctionnement.",
              "La France a exporte un record de 89 TWh d'electricite en 2024, rapportant environ 8 Md\u20AC. Avec 20 reacteurs supplementaires (+30 GW de capacite), le potentiel d'export atteint 20-25 Md\u20AC/an.",
              "Le cout du kWh nucleaire historique (60-63\u20AC/MWh) est competitif face a l'eolien terrestre (59-91\u20AC/MWh hors couts reseau et backup) et au gaz (100-120\u20AC/MWh en 2024).",
              "La production electrique francaise 2024 : nucleaire 67,1%, hydraulique 13,9%, eolien 8,7%, solaire 4,8%. L'objectif est 85%+ nucleaire."
            ],
            "Sources : EDF programme EPR2, RTE bilan electrique 2024, SFEN, Cour des Comptes rapport nucleaire."
          ),

          ...mesure(27, "Suppression de toutes les subventions aux energies renouvelables intermittentes",
            [
              "Fin des subventions a l'eolien et au solaire photovoltaique. Ces energies intermittentes necessitent des capacites de backup (gaz) et des investissements reseau disproportionnes par rapport a leur production. L'argent est realloue integralement au nucleaire et a l'hydrogene bas carbone."
            ],
            [
              "Subventions aux EnR intermittentes : 8-10 Md\u20AC/an (Commission de regulation de l'energie).",
              "L'eolien produit 8,7% de l'electricite francaise pour un cout soutenu par des tarifs de rachat garantis sur 15-20 ans.",
              "Le facteur de charge de l'eolien terrestre est de 22-25% en France (il ne produit qu'un quart du temps). Le nucleaire : 70-75%.",
              "Chaque GW eolien installe necessite 0,7-1 GW de capacite gaz en backup pour les periodes sans vent, annulant une partie des benefices climatiques.",
              "Les 8-10 Md\u20AC economises financent la moitie du programme EPR2 annuel (10 Md\u20AC)."
            ],
            "Sources : CRE rapport charges CSPE, RTE adequation 2024, AIE World Energy Outlook."
          ),

          ...mesure(28, "Permis de construire en 90 jours max pour toute infrastructure energetique",
            [
              "Pour toute infrastructure energetique (reacteur nucleaire, data center, ligne haute tension, station hydrogene, usine de batteries), le delai de delivrance du permis de construire est plafonne a 90 jours. Passe ce delai, le silence de l'administration vaut acceptation. Le droit de recours des tiers est limite a 30 jours apres delivrance, avec provision pour frais de 50 000\u20AC exigible du requerant."
            ],
            [
              "Delai actuel moyen pour un projet industriel majeur : 3-7 ans (permis + recours + etudes d'impact complementaires).",
              "Le delai de raccordement electrique en France est de 18-36 mois, contre 6-12 mois en Allemagne.",
              "Les recours associatifs bloquent ou retardent en moyenne 1 500 projets industriels par an en France.",
              "En Finlande, le permis de construction d'un reacteur nucleaire a ete delivre en 18 mois. En France, l'EPR de Flamanville a pris 17 ans entre l'annonce et la mise en service."
            ],
            "Sources : CGEDD delais d'autorisation, RTE raccordement, Tribunal administratif statistiques contentieux."
          ),

          // G. DEFENSE
          p([b("G. Defense et souverainete militaire")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(29, "Budget defense a 3,5% du PIB d'ici 2032",
            [
              "Doublement du budget de la defense, de 50 Md\u20AC (2% PIB) a 100 Md\u20AC (3,5% PIB). Les 50 Md\u20AC supplementaires sont priorises : munitions et stocks strategiques (15 Md\u20AC), drones et systemes autonomes (10 Md\u20AC), cyber et guerre electronique (8 Md\u20AC), marine et projection de force (10 Md\u20AC), spatial militaire (7 Md\u20AC). Finance integralement par les economies sur la depense sociale."
            ],
            [
              "Budget defense 2024 : 50,5 Md\u20AC, soit 2,05% du PIB. LPM 2024-2030 : trajectoire a 2,3% du PIB en 2030, insuffisante.",
              "L'OTAN a releve son objectif a 5% du PIB a horizon 2035 (declaration de La Haye 2025). La France est loin du compte.",
              "La France est la 1ere puissance militaire de l'UE (264 000 militaires d'active), mais ses stocks de munitions ne tiennent que 2-3 jours de combat haute intensite.",
              "La Russie consacre 6-8% de son PIB a la defense. Les Etats-Unis : 3,4%. Le Royaume-Uni s'est engage a 2,5%.",
              "L'industrie de defense francaise a realise 21,6 Md\u20AC de CA et la France est 2e exportateur mondial d'armes. Un budget a 3,5% renforce la base industrielle et les exports."
            ],
            "Sources : Ministere des Armees budget 2024, LPM 2024-2030, OTAN declaration La Haye, SIPRI Military Expenditure Database."
          ),

          ...mesure(30, "Service national universel de 6 mois obligatoire",
            [
              "Trois mois de formation militaire de base (maniement des armes, premiers secours, secourisme, ordre serre, condition physique) + 3 mois de service civil ou militaire au choix (unite militaire, pompiers, protection civile, service civique). Obligation pour tous les jeunes de 18-25 ans (hommes et femmes). Constitution d'une reserve mobilisable de 500 000 citoyens formes."
            ],
            [
              "Cout annuel : ~800 000 jeunes/an \u00D7 8 000\u20AC = 6-7 Md\u20AC/an.",
              "La France dispose actuellement de 43 000 reservistes, tres insuffisant. La reserve cible de 500 000 personnes constitue une capacite de mobilisation credible.",
              "Israel (service de 24-32 mois), la Suisse (service de 18 semaines + rappels annuels), et la Suede (retabli en 2017) sont les modeles de reference.",
              "Effet secondaire : cohesion nationale, brassage social, discipline, formation aux gestes de survie. En Suisse, le service militaire est unanimement cite comme facteur de cohesion nationale."
            ],
            "Sources : Ministere des Armees reserves, Swiss Army rapport, IDF Israel."
          ),

          ...mesure(31, "Bouclier antimissile europeen sous leadership francais",
            [
              "Initiative francaise pour un systeme integre de defense antimissile couvrant l'Europe occidentale. Le systeme combine des intercepteurs balistiques (type Aster 30 Block 2), des radars longue portee, et des capacites spatiales de detection. La France prend le leadership industriel et contribue a hauteur de 30% du financement, le reste etant reparti entre les allies europeens."
            ],
            [
              "Cout total estime : 50-80 Md\u20AC sur 15 ans. Part francaise : 15-25 Md\u20AC, soit 1-1,7 Md\u20AC/an.",
              "L'Iron Dome israelien a coute 1,5 Md\u20AC de developpement pour une efficacite de 90% contre les roquettes courte portee.",
              "Le systeme THAAD americain coute 3 Md\u20AC par batterie. L'Europe n'a aucune capacite equivalente.",
              "MBDA (franco-britannique) et Thales sont les industriels europeens les mieux places pour developper ce systeme, avec des retombees technologiques et d'emploi majeures pour la France."
            ],
            "Sources : MBDA capabilities, EDA defense data, CSIS Missile Defense Project."
          ),

          ...mesure(32, "Industrie de defense : objectif 50 Md\u20AC d'exports/an",
            [
              "Doublement des exportations d'armement, de 21,6 Md\u20AC a 50 Md\u20AC par an. Moyens : diplomatie economique aggressive (chaque ambassadeur devient un commercial), simplification radicale des procedures d'export (delai CIEEMG divise par 3), financements souverains a taux preferentiel pour les acheteurs, et creation de lignes de production locales en partenariat (modele Make in India)."
            ],
            [
              "La France est le 2e exportateur mondial d'armes (2020-2024). Principaux clients : Inde (28%), Moyen-Orient, Grece, Indonesie.",
              "Chaque milliard d'euros d'export defense = 10 000 emplois industriels directs et indirects en France.",
              "Dassault Aviation (CA 6,23 Md\u20AC), Thales Defense (10,97 Md\u20AC, +13,9%), MBDA (~5 Md\u20AC, +25% en 5 ans) sont les champions nationaux.",
              "Les delais d'autorisation d'export sont de 6-18 mois en France, contre 2-4 mois aux Etats-Unis et au Royaume-Uni. C'est le principal frein a la competitivite."
            ],
            "Sources : SIPRI Arms Transfers Database, DGA rapport exports, rapports annuels Dassault/Thales/MBDA."
          ),

          // H. INDUSTRIE & TECH
          p([b("H. Souverainete industrielle et technologique")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(33, "Fonds souverain tech de 30 Md\u20AC",
            [
              "Creation d'un fonds souverain technologique dote de 30 Md\u20AC sur 10 ans, dedie exclusivement aux investissements strategiques de grande envergure. Pas de saupoudrage BPI a 500K\u20AC. Des tickets de 100M\u20AC a 1 Md\u20AC pour des projets d'infrastructure qui changent la donne : fonderies de semi-conducteurs, centres de calcul souverains, usines de batteries, reacteurs a fusion, lanceurs spatiaux reutilisables."
            ],
            [
              "Dotation : 3 Md\u20AC/an sur 10 ans. Rendement attendu du portefeuille : 8-12%/an sur le long terme.",
              "Le fonds souverain de Singapour (Temasek) a genere un rendement annualise de 13%/an sur 50 ans. GIC (Singapour) : 7%/an.",
              "Le marche mondial des semi-conducteurs est de 600 Md\u20AC. La part europeenne est de 8% et en declin. L'objectif EU Chips Act est de 20% d'ici 2030.",
              "L'IA souveraine necessite des investissements de 5-10 Md\u20AC en calcul (GPU, data centers) et en donnees d'entrainement. Sans fonds souverain, la France dependra d'OpenAI (US) et de DeepSeek (Chine).",
              "La France a investi 7 Md\u20AC en venture capital en 2024 (5e rang mondial). Mais les tickets superieurs a 100 Md\u20AC sont quasi inexistants, forçant les champions francais (Mistral, Poolside) a lever aux Etats-Unis."
            ],
            "Sources : BPI France bilan 2024, Temasek Review, SEMI Global Semiconductor Market, France Digitale barometre."
          ),

          ...mesure(34, "10 zones franches industrielles a fiscalite zero",
            [
              "Creation de 10 zones franches industrielles dans les bassins desindustrialises : Hauts-de-France (2 zones), Grand Est, Lorraine, Loire, Nord-Isere, Bouches-du-Rhone, Normandie, Centre-Val de Loire, Occitanie. Regime fiscal : IS 0%, charges sociales reduites de 50%, zero taxe fonciere, zero CFE pendant 15 ans. Infrastructure prise en charge par l'Etat (raccordement electrique, fibre, route)."
            ],
            [
              "Cout fiscal : 3-5 Md\u20AC/an. Mais creation estimee de 200 000 a 400 000 emplois industriels en 10 ans.",
              "Shenzhen (Chine) est passee de village de pecheurs a metropole de 17 millions d'habitants en 40 ans grace au statut de zone economique speciale.",
              "Les zones franches de Dubai generent 161 Md$ de transactions annuelles et emploient plus de 500 000 personnes.",
              "Les 100 ZFU (Zones Franches Urbaines) francaises creees depuis 1997 ont demontre l'effet positif des exonerations fiscales sur l'emploi local, mais avec des montants et une ambition beaucoup trop limites.",
              "Le cout du travail en France (40,5\u20AC/h) est le 5e plus eleve de l'UE. La reduction de 50% des charges dans les zones franches ramene le cout a ~28\u20AC/h, competitif avec l'Allemagne et les Pays-Bas."
            ],
            "Sources : Eurostat cout du travail, INSEE ZFU evaluation, UNCTAD Special Economic Zones, Dubai JAFZA rapport."
          ),

          ...mesure(35, "Reindustrialisation : objectif 20% du PIB en 2035",
            [
              "La part de l'industrie dans le PIB francais est passee de 24% en 1980 a 13,4% aujourd'hui. L'Allemagne est a 19,7%. L'objectif est d'atteindre 20% d'ici 2035, soit +190 Md\u20AC de valeur ajoutee industrielle et 1,5 million d'emplois industriels crees. Les leviers : zones franches (mesure 34), energie nucleaire bon marche (mesure 26), deregulation du travail (mesure 5), IS reduit (mesure 12), et suppression des sur-normes environnementales sur les sites industriels."
            ],
            [
              "L'ecart de valeur ajoutee industrielle entre la France et l'Allemagne est de 241 Md\u20AC, soit 1,9 million d'emplois manquants.",
              "La France a perdu 1,9 million d'emplois industriels entre 1980 et 2007, et 760 000 supplementaires depuis 1995.",
              "Le cout de l'electricite industrielle en France (avec nucleaire) est de 60-80\u20AC/MWh, contre 100-150\u20AC/MWh en Allemagne (energiewende). C'est un avantage competitif decisif.",
              "Le programme France 2030 a investi 54 Md\u20AC mais les resultats sont decevants : pas de usine de semi-conducteurs, pas de gigafactory de batteries de niveau mondial.",
              "Pour chaque emploi industriel cree, 2-3 emplois de services sont generes en amont et en aval (effet multiplicateur)."
            ],
            "Sources : INSEE valeur ajoutee par branche, IFRAP ecart France-Allemagne, France 2030 bilan 2024."
          ),

          ...mesure(36, "Remplacement du principe de precaution par le principe d'innovation",
            [
              "Modification de l'article 5 de la Charte de l'environnement (valeur constitutionnelle) : le principe de precaution est remplace par un principe d'innovation responsable. Le nouveau texte stipule que l'absence de certitude scientifique ne doit pas servir de pretexte au blocage d'une innovation, et que les autorites publiques doivent favoriser l'experimentation encadree plutot que l'interdiction preventive."
            ],
            [
              "Le principe de precaution inscrit dans la Constitution en 2005 a bloque ou retarde : les OGM (interdiction totale depuis 2008), le gaz de schiste (interdiction 2011), la geothermie profonde, les vehicules autonomes, et de nombreux projets industriels.",
              "En France, 70% des projets d'infrastructure font l'objet d'au moins un recours administratif, contre 15-20% en Allemagne et au Royaume-Uni.",
              "Les Etats-Unis, la Chine, Israel et Singapour operent sans principe de precaution constitutionnel. Ils representent 90% de l'innovation technologique mondiale.",
              "L'OCDE a estime que le surcout reglementaire lie au principe de precaution represente 0,3-0,5% de PIB/an en France, soit 9-15 Md\u20AC de richesse non creee."
            ],
            "Sources : Charte de l'environnement, Conseil constitutionnel decisions, OCDE Regulatory Policy Outlook."
          ),

          ...mesure(37, "Statut \"projet d'interet technologique majeur\" \u2014 fast track total",
            [
              "Pour tout projet depassant 100 M\u20AC d'investissement et 500 emplois crees : procedure acceleree sur urbanisme, environnement, raccordement electrique. Decision en 6 mois maximum. Commissaire au projet nomme par le Premier ministre pour coordonner toutes les administrations. L'Etat accompagne et facilite au lieu de bloquer."
            ],
            [
              "Delai actuel pour un projet industriel majeur en France : 3-7 ans (etude d'impact, enquete publique, permis, recours).",
              "Tesla a construit sa Gigafactory de Berlin en 2 ans (dont 10 mois de construction effective). En France, la meme usine aurait pris 5-8 ans.",
              "Le PITM existe de facto aux Etats-Unis (permitting reform, NEPA exemptions) et en Chine (approbation en 30 jours pour les projets prioritaires).",
              "En France, l'usine de batteries ACC a Douvrin (Pas-de-Calais) a necessite 4 ans de procedures pour un investissement de 2 Md\u20AC. Avec un fast track, le delai aurait ete de 12-18 mois."
            ],
            "Sources : CGEDD delais autorisation, Tesla Gigafactory Berlin timeline, ACC Douvrin chronologie."
          ),

          ...mesure(38, "Independance numerique : cloud souverain et IA souveraine",
            [
              "Obligation pour toutes les administrations d'utiliser un cloud souverain francais d'ici 2028 (donnees de sante, defense, justice, fiscalite, education). Investissement de 5 Md\u20AC dans le developpement d'un modele d'IA open source francais de niveau frontier. Les donnees publiques francaises (200+ bases ouvertes) sont mises a disposition comme corpus d'entrainement."
            ],
            [
              "Investissement total : 5 Md\u20AC IA + 3 Md\u20AC cloud = 8 Md\u20AC sur 5 ans (1,6 Md\u20AC/an).",
              "80% des donnees publiques francaises sont actuellement hebergees chez AWS (Amazon), Azure (Microsoft) ou Google Cloud. C'est une dependance strategique inacceptable.",
              "Le marche mondial du cloud est de 600 Md\u20AC/an, domine a 65% par 3 entreprises americaines.",
              "Mistral AI (francais) a leve 1,1 Md\u20AC mais reste marginal face a OpenAI (15 Md\u20AC de revenus). Un soutien souverain est indispensable pour maintenir une capacite europeenne.",
              "La Chine a developpe ses propres modeles d'IA (DeepSeek, Qwen) grace a un investissement public de 15 Md\u20AC sur 5 ans. La France peut obtenir des resultats comparables avec 5 Md\u20AC grace a son vivier de chercheurs (3e au monde en publications IA)."
            ],
            "Sources : ANSSI hebergement donnees publiques, Synergy Research Group cloud market, Mistral AI, France IA rapport."
          ),

          // ════════════════════════════════════
          // AXE 3 — ATTIRER LES TALENTS
          // ════════════════════════════════════
          p([new PageBreak()]),
          p([b("AXE 3 \u2014 ATTIRER LES TALENTS")], { heading: HeadingLevel.HEADING_1 }),
          p([t("Mesures 39 a 50 \u2014 Immigration choisie, competitivite salariale, education, demographie", { size: 20, color: "555555", italics: true })], { spacing: { after: 200 } }),

          // I. IMMIGRATION & VISA
          p([b("I. Immigration choisie et visa tech")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(39, "Visa tech de 48h pour ingenieurs et chercheurs",
            [
              "Tout ingenieur ou chercheur disposant d'une offre d'emploi en France avec un salaire superieur a 45 000\u20AC obtient un visa de travail en 48 heures. La famille (conjoint + enfants) est incluse sans demarche supplementaire. Le renouvellement est automatique tant que le contrat est actif. Apres 3 ans, acces a une residence permanente acceleree."
            ],
            [
              "Delai actuel d'obtention d'un visa de travail en France : 3-6 mois. Le Passeport Talent (cree en 2016) a reduit les delais mais reste insuffisant.",
              "La France perd 15 000 jeunes diplomes par an a l'etranger (principalement vers le Canada, la Suisse, les Etats-Unis et l'Allemagne).",
              "Le UK Global Talent Visa a un taux d'acceptation de 93% et a vu ses demandes augmenter de 444% entre 2020 et 2023.",
              "Le Dubai Golden Visa (residences 10 ans, pas d'impot) a attire 150 000 residents qualifies en 3 ans.",
              "La France forme parmi les meilleurs ingenieurs et chercheurs du monde (Polytechnique, Normale Sup, HEC) mais en exporte une part significative. Le sujet n'est pas la formation, mais la retention et l'attraction."
            ],
            "Sources : Campus France mobilite, UK Home Office statistics, DIFC Dubai rapport, Ministere de l'Interieur visas."
          ),

          ...mesure(40, "Regime fiscal impatries : flat tax 15% pendant 10 ans",
            [
              "Tout talent etranger s'installant en France (ou Francais revenant apres 5+ ans d'expatriation) beneficie d'un IR plafonne a 15% sur l'ensemble de ses revenus pendant 10 ans. Pas d'IFI. Pas de droits de succession pendant la periode. Le conjoint beneficie du meme regime. L'objectif est d'attirer massivement les entrepreneurs, investisseurs, chercheurs et cadres superieurs internationaux."
            ],
            [
              "Le regime d'impatriation actuel (article 155 B CGI) offre une exoneration de 30% de la remuneration pendant 8 ans. Insuffisant face a la concurrence.",
              "Le Portugal Non-Habitual Resident (NHR, remplace par IFICI en 2024) a attire 90 000 residents fiscaux en 10 ans avec un taux de 20%.",
              "Le 30% ruling neerlandais exonere 30% du salaire pendant 5 ans (reduit a 27% a partir de 2027). Les Pays-Bas attirent 2x plus d'expats qualifies par habitant que la France.",
              "L'Italie offre une exoneration de 70% de l'IR pendant 5 ans pour les chercheurs et cadres. Milan est devenue un hub tech europeen majeur.",
              "Cout fiscal estime : 1-2 Md\u20AC/an. Largement compense par la consommation, les taxes indirectes, et la contribution a l'ecosysteme (creation d'entreprises, brevets, emplois)."
            ],
            "Sources : DGFiP impatriation, SEF Portugal NHR statistics, Belastingdienst 30% ruling, Agenzia delle Entrate Italy."
          ),

          ...mesure(41, "Exoneration totale de charges sur stock-options et BSPCE",
            [
              "Zero charge sociale et zero cotisation sur les gains realises a l'exercice de stock-options et de BSPCE (Bons de Souscription de Parts de Createur d'Entreprise). Les premiers employes qui prennent le risque de rejoindre une startup sont traites comme des entrepreneurs, pas comme des salaries lambda. Seule une flat tax de 15% (mesure 11) s'applique sur les plus-values realisees."
            ],
            [
              "Cout fiscal estime : 1-2 Md\u20AC/an.",
              "En France, les gains sur BSPCE sont soumis a 12,8% d'IR + 17,2% de prelevements sociaux = 30%. En ajoutant les cotisations patronales en cas de requalification : jusqu'a 60%.",
              "Aux Etats-Unis, les stock-options qualifiees (ISO) beneficient d'un regime fiscal favorable (0% de charges, 20% de plus-value LT). C'est ce regime qui a permis aux premiers employes de Google, Facebook et Apple de devenir millionnaires et de reinvestir dans l'ecosysteme.",
              "Au Royaume-Uni, le EMI (Enterprise Management Incentive) offre un CGT de 10% sur les plus-values de stock-options pour les entreprises de moins de 250 salaries.",
              "La France a perdu des dizaines de startups prometteuses parties s'immatriculer au Delaware ou a Londres a cause de la fiscalite des stock-options."
            ],
            "Sources : DGFiP BSPCE, IRS ISO regulations, HMRC EMI scheme, Station F rapport ecosysteme."
          ),

          ...mesure(42, "10 universites dans le top 100 mondial",
            [
              "Dix universites francaises recoivent une autonomie totale : liberte de recrutement et de fixation des salaires (permettant de doubler les meilleurs professeurs), liberte de fixer les droits d'inscription (plafond a 5 000\u20AC/an pour les etudiants francais, libre pour les internationaux), liberte pedagogique, et gouvernance par un conseil independant. Budget public double. L'objectif est d'avoir 10 universites dans le top 100 mondial (contre 3-4 actuellement selon les classements)."
            ],
            [
              "Budget supplementaire : +5 Md\u20AC/an d'enseignement superieur et recherche.",
              "La depense par etudiant en France est de 13 300\u20AC, inferieure aux Etats-Unis (35 000\u20AC), au Royaume-Uni (25 000\u20AC) et a l'Allemagne (18 000\u20AC pour les universites de recherche).",
              "Singapour NUS (11e mondiale) dispose d'un budget de 2,5 Md\u20AC pour 40 000 etudiants. PSL (Paris) a un budget de 600 M\u20AC pour 17 000 etudiants.",
              "L'autonomie universitaire est le premier facteur predictif de performance dans les classements internationaux (Shanghai, QS, THE). Les 20 premieres universites mondiales sont toutes autonomes.",
              "Le systeme actuel impose les memes grilles de salaire a tous les enseignants-chercheurs. Un maitre de conferences en informatique ou en IA gagne 2 500\u20AC nets a 30 ans, contre 8 000-15 000\u20AC dans le prive ou a l'etranger."
            ],
            "Sources : MESRI budget ESR, QS World University Rankings 2025, NUS rapport financier, PSL rapport annuel."
          ),

          ...mesure(43, "R&D : objectif 4% du PIB",
            [
              "Doublement de l'effort de recherche et developpement, de 2,2% a 4% du PIB. Moyens : doublement du Credit Impot Recherche (CIR), defiscalisation totale des dons aux laboratoires, partenariats public-prive systematiques, creation de 10 instituts de recherche thematiques (IA, quantique, biotech, energie, materiaux, spatial, defense, ocean, agriculture, sante)."
            ],
            [
              "Depenses R&D France : 2,2% du PIB (2024). Israel : 6,3%. Coree du Sud : 5,3%. Etats-Unis : 3,5%. Japon : 3,4%.",
              "Passer de 2,2% a 4% = +52 Md\u20AC/an de depenses R&D totales (public + prive). La part publique represente environ +10 Md\u20AC/an.",
              "Le CIR actuel coute 7,4 Md\u20AC/an a l'Etat. Son doublement a 15 Md\u20AC/an genere un effet de levier de 2-3 sur la depense privee de R&D.",
              "La France est 3e au monde en publications scientifiques par chercheur et 4e en brevets par habitant dans l'OCDE, mais le transfert technologique vers l'industrie est le maillon faible.",
              "Le modele israelien (6,3% du PIB en R&D) combine un investissement public massif via l'Israel Innovation Authority (IIA), des liens armee-startups (Unit 8200), et un venture capital de 15 Md\u20AC/an."
            ],
            "Sources : OCDE Main Science and Technology Indicators, MESRI DIRD, Israel Innovation Authority rapport."
          ),

          ...mesure(44, "5 campus tech integres (recherche + startups + industrie)",
            [
              "Creation de 5 campus technologiques integres de 50 hectares chacun, co-localisant une universite d'excellence, un accelerateur de startups, des laboratoires industriels, et du logement etudiant/chercheur. Modele : Station F x Stanford Research Park x Tsukuba Science City. Implantations : Paris-Saclay (extension), Lyon-Gerland, Toulouse-Aerospace, Grenoble-Presqu'ile, Rennes-Beaulieu."
            ],
            [
              "Investissement : 2 Md\u20AC \u00D7 5 campus = 10 Md\u20AC sur 10 ans (1 Md\u20AC/an).",
              "Stanford Research Park genere plus de 100 startups/an et a engendre l'ecosysteme de la Silicon Valley (3 200 Md\u20AC de capitalisation boursiere cumulee).",
              "Tsukuba Science City (Japon) regroupe 150 instituts de recherche et 20 000 chercheurs sur un campus de 2 700 hectares.",
              "Creation estimee : 50 000 emplois directs (recherche, enseignement, startups, industrie), 200+ startups/an.",
              "Station F (Paris) a demontre que la concentration des talents et des ressources est le facteur cle de succes de l'ecosysteme. Mais Station F est un incubateur ; les campus tech sont des ecosystemes complets integrant la recherche fondamentale, la formation, et l'industrialisation."
            ],
            "Sources : Stanford Research Park history, MEXT Tsukuba rapport, Station F impact report."
          ),

          // J. SALAIRES
          p([b("J. Competitivite salariale")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(45, "Suppression des cotisations salariales, remplacement par TVA sociale",
            [
              "Le salarie touche 100% de son salaire brut. Les cotisations salariales (actuellement ~22% du brut) sont supprimees et remplacees par : une hausse de la TVA de 5 points (de 20% a 25%), et un prelevement a la source simplifie (flat tax sante-retraite). L'objectif est double : augmenter le pouvoir d'achat visible de chaque salarie (+15-20% sur la fiche de paie) et transferer une partie du financement de la protection sociale sur la consommation, y compris les importations."
            ],
            [
              "Cotisations salariales totales : ~100 Md\u20AC/an. +5 pts de TVA = +40-50 Md\u20AC. Le differentiel est finance par les economies sur les depenses sociales.",
              "Au Danemark, il n'y a quasiment pas de cotisations sociales. La TVA est a 25%. Le salaire net danois est le plus eleve d'Europe.",
              "La TVA sociale a un avantage majeur : elle taxe les importations au meme taux que la production locale, ce qui avantage la production francaise (equivalent a une devaluation interne).",
              "Effet sur la fiche de paie : un salarie au SMIC brut de 1 766\u20AC touche actuellement ~1 400\u20AC nets. Avec la suppression des cotisations salariales : ~1 650\u20AC nets (+18%).",
              "L'Allemagne a realise une operation similaire en 2007 (hausse TVA de 16% a 19% pour financer une baisse de charges). Resultat : excedent commercial record et quasi-plein emploi en 10 ans."
            ],
            "Sources : URSSAF cotisations 2024, Skatteministeriet Denmark, Bundesfinanzministerium Germany TVA reform."
          ),

          ...mesure(46, "Interessement et participation obligatoires pour toutes les entreprises > 10 salaries",
            [
              "Tout salarie d'une entreprise de plus de 10 salaries touche une part des benefices de son entreprise via l'interessement ou la participation. Les sommes versees sont integralement exonerees de charges sociales et d'impot sur le revenu si elles sont placees sur un PEE (5 ans) ou un PERCO (retraite)."
            ],
            [
              "Cout fiscal : 3-5 Md\u20AC/an (exoneration charges + IR sur les sommes versees).",
              "Actuellement, la participation est obligatoire pour les entreprises de +50 salaries. L'abaissement du seuil a 10 touche 200 000 entreprises supplementaires.",
              "L'interessement moyen verse en France est de 1 700\u20AC/an par salarie beneficiaire. L'objectif est de doubler ce montant a 3 500\u20AC/an.",
              "Effet comportemental : les salaries interesses sont plus productifs, plus engages et moins absents. Les entreprises avec interessement ont un taux de turnover inferieur de 25% (etude DARES 2023)."
            ],
            "Sources : DARES interessement-participation 2024, URSSAF exonerations, DGFiP epargne salariale."
          ),

          // K. EDUCATION
          p([b("K. Education \u2014 Excellence et liberte")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(47, "Cheque education : les parents choisissent l'ecole",
            [
              "Chaque famille recoit un cheque education de 8 000\u20AC/an par enfant, utilisable dans n'importe quelle ecole : publique, privee sous contrat, privee hors contrat, confessionnelle, Montessori, ecole numerique, enseignement a domicile structure. Les ecoles sont en concurrence sur la qualite. Celles qui attirent les eleves prosperent ; celles qui echouent ferment. L'Etat conserve un role de regulateur (programme minimum, inspection) mais n'est plus le fournisseur monopolistique."
            ],
            [
              "Budget de l'Education nationale : 63 Md\u20AC/an. Depense par eleve : ~9 000\u20AC. Le cheque a 8 000\u20AC est legerement inferieur, degageant une economie potentielle.",
              "En Suede, le cheque education existe depuis 1992. Resultat : satisfaction des parents en hausse de 30%, diversite de l'offre educative, et performances PISA stables malgre l'immigration massive.",
              "Aux Pays-Bas, le financement suit l'eleve depuis les annees 1960. 76% des eleves sont dans des ecoles privees financees par l'Etat. Les Pays-Bas sont regulierement dans le top 10 PISA.",
              "En France, les resultats PISA sont en chute libre depuis 20 ans : la France est passee du 13e au 26e rang en mathematiques. Le systeme centralise ne fonctionne plus.",
              "Le cheque education ne coute pas plus cher : il redistribue le meme budget en donnant le pouvoir aux familles plutot qu'a la bureaucratie."
            ],
            "Sources : Ministere Education budget 2024, PISA 2022 resultats, Skolverket Sweden, Dutch Inspectorate of Education."
          ),

          ...mesure(48, "Autonomie totale des etablissements scolaires",
            [
              "Chaque ecole recrute ses professeurs directement (fin des mutations nationales par algorithme), fixe les salaires (possibilite de doubler les meilleurs enseignants), choisit ses methodes pedagogiques (fin du programme unique), et gere son budget de maniere autonome. Le directeur d'ecole devient un vrai chef d'etablissement avec autorite de recrutement, de sanction, et de gestion. Les resultats de chaque ecole sont publies annuellement (progression des eleves, pas seulement taux de reussite)."
            ],
            [
              "L'autonomie des etablissements est le facteur n\u00B01 de performance dans tous les classements internationaux (OCDE, McKinsey Education Report, Hanushek & Woessmann).",
              "Un enseignant francais gagne en moyenne 2 700\u20AC nets/mois en milieu de carriere, contre 4 500\u20AC en Allemagne et 5 800\u20AC en Suisse. L'autonomie salariale permettrait de revaloriser les meilleurs sans augmenter la masse salariale globale.",
              "La France gere 850 000 enseignants depuis Paris via un systeme de points et de mutations qui ne tient aucun compte de la qualite pedagogique ni des besoins locaux.",
              "Les charter schools americaines (ecoles autonomes financees par l'Etat) obtiennent des resultats 15-20% superieurs aux ecoles publiques classiques dans les quartiers defavorises."
            ],
            "Sources : OCDE PISA in Focus, McKinsey How the world's best-performing school systems come out on top, DEPP resultats nationaux."
          ),

          // L. DEMOGRAPHIE
          p([b("L. Immigration et demographie")], { heading: HeadingLevel.HEADING_2 }),

          ...mesure(49, "Immigration zero non qualifiee, immigration massive qualifiee",
            [
              "Mise en place d'un systeme a points (modele Canada/Australie). Criteres : niveau de diplome (50 pts), experience professionnelle (30 pts), maitrise du francais (20 pts), offre d'emploi (30 pts), age (20 pts, maximum 35 ans), secteur en tension (bonus 20 pts). Seuil d'admission : 100 points. Objectif : 200 000 immigrants qualifies par an, zero immigration non qualifiee. Suppression du regroupement familial automatique (remplace par une procedure conditionnee a l'autonomie financiere). Suppression de l'AME."
            ],
            [
              "En 2024, la France a delivre 336 700 premiers titres de sejour : 109 300 etudiants, 90 600 familiaux, 55 000 humanitaires. Seuls ~80 000 sont lies a l'emploi.",
              "Le cout net de l'immigration est estime entre 20 et 40 Md\u20AC/an selon les methodologies (depenses education, sante, logement, aides sociales, delinquance vs cotisations et impots verses).",
              "L'immigration qualifiee genere une contribution nette positive de 5 000 a 15 000\u20AC/an par personne (impots et cotisations >> depenses publiques consommees).",
              "Le Canada accueille 400 000 immigrants permanents/an via un systeme a points (Express Entry). 60% ont un diplome universitaire. Resultat : contribution nette au PIB de 0,5%/an.",
              "La France a 1,75 million d'expatries dans le monde (3 millions estimation totale), dont une proportion croissante de jeunes qualifies. Il faut inverser le flux."
            ],
            "Sources : Ministere de l'Interieur chiffres immigration 2024, IRCC Canada Express Entry, Contribuables Associes/Jean-Jaures etudes contradictoires."
          ),

          ...mesure(50, "Politique nataliste offensive : 5 000\u20AC/naissance + conge parental de 2 ans",
            [
              "Prime universelle de 5 000\u20AC versee a chaque naissance (sans condition de revenus). Conge parental de 2 ans a 80% du salaire pour le parent qui le souhaite (homme ou femme), finance par la branche famille. Defiscalisation totale des revenus pour les familles de 3 enfants et plus (IR = 0). Doublement des places en creche (objectif : 600 000 places, contre 300 000 actuellement)."
            ],
            [
              "663 000 naissances en 2024 \u00D7 5 000\u20AC = 3,3 Md\u20AC/an de primes.",
              "Taux de fecondite en France : 1,62 enfant par femme (2024), le plus bas depuis 1918. Objectif : 2,1 (seuil de renouvellement des generations).",
              "Le solde naturel deviendra negatif des 2027 (plus de deces que de naissances). Sans correction, la population francaise commence a decliner dans les annees 2040.",
              "La Hongrie a mis en place un programme nataliste agressif (prets a taux zero, exoneration IR pour les meres de 4 enfants, prime bebe). Resultat : fecondite passee de 1,23 a 1,56 en 10 ans.",
              "Le cout des places de creche supplementaires (300 000 places) est estime a 4-5 Md\u20AC/an. Finance par la reallocation des aides familiales fusionnees dans l'allocation unique.",
              "Chaque enfant supplementaire est un futur contribuable, cotisant, innovateur. A 2% de croissance, un enfant ne en 2026 generera 3-5 M\u20AC de PIB sur sa vie active."
            ],
            "Sources : INSEE bilan demographique 2024, HCFEA rapport natalite, KSH Hungary demographic statistics."
          ),

          // ════════════════════════════════════
          // SYNTHESE FINANCIERE
          // ════════════════════════════════════
          p([new PageBreak()]),
          p([b("SYNTHESE FINANCIERE")], { heading: HeadingLevel.HEADING_1 }),
          p([t("Bilan consolide des 50 mesures a horizon 10 ans.", { size: 20, color: "555555" })], { spacing: { after: 300 } }),

          // Table Economies
          p([b("Economies annuelles")], { heading: HeadingLevel.HEADING_2 }),
          new Table({
            columnWidths: [6000, 3360],
            rows: [
              new TableRow({ tableHeader: true, children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("Mesure", { size: 18 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("Economie/an", { size: 18 })], { alignment: AlignmentType.RIGHT })] }),
              ] }),
              ...[
                ["Retraites (capitalisation + age 67 + regimes speciaux)", "100-140 Md\u20AC"],
                ["Fonction publique (\u22121M postes)", "42 Md\u20AC"],
                ["Fusion communes + suppression departements", "25-30 Md\u20AC"],
                ["Allocation unique (fusion aides sociales)", "15-20 Md\u20AC"],
                ["Assurance chomage (duree reduite)", "10-15 Md\u20AC"],
                ["Logement (fin APL + aides a la pierre)", "30 Md\u20AC"],
                ["Sante (franchise + deremboursement)", "5-8 Md\u20AC"],
                ["Subventions EnR supprimees", "8-10 Md\u20AC"],
                ["Numerisation administration", "10-15 Md\u20AC"],
              ].map(([m, v]) => new TableRow({ children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, children: [p([t(m, { size: 18 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, children: [p([b(v, { size: 18 })], { alignment: AlignmentType.RIGHT })] }),
              ] })),
              new TableRow({ children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("TOTAL ECONOMIES", { size: 18 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("~250-310 Md\u20AC/an", { size: 20 })], { alignment: AlignmentType.RIGHT })] }),
              ] }),
            ]
          }),

          spacer(300),

          // Table Investissements
          p([b("Investissements annuels")], { heading: HeadingLevel.HEADING_2 }),
          new Table({
            columnWidths: [6000, 3360],
            rows: [
              new TableRow({ tableHeader: true, children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("Mesure", { size: 18 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("Cout/an", { size: 18 })], { alignment: AlignmentType.RIGHT })] }),
              ] }),
              ...[
                ["Transition retraite capitalisation", "3 Md\u20AC"],
                ["Budget defense \u2192 3,5% PIB", "+50 Md\u20AC"],
                ["Fonds souverain tech", "3 Md\u20AC"],
                ["20 EPR2 (sur 20 ans)", "10 Md\u20AC"],
                ["10 zones franches industrielles", "3-5 Md\u20AC"],
                ["Universites d'excellence + R&D", "15 Md\u20AC"],
                ["Campus tech", "1 Md\u20AC"],
                ["Cloud + IA souveraine", "1,6 Md\u20AC"],
                ["Service national 6 mois", "6-7 Md\u20AC"],
                ["Politique nataliste", "3,3 Md\u20AC"],
                ["Bouclier antimissile (part FR)", "1,5 Md\u20AC"],
              ].map(([m, v]) => new TableRow({ children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, children: [p([t(m, { size: 18 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, children: [p([b(v, { size: 18 })], { alignment: AlignmentType.RIGHT })] }),
              ] })),
              new TableRow({ children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("TOTAL INVESTISSEMENTS", { size: 18 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("~100-105 Md\u20AC/an", { size: 20 })], { alignment: AlignmentType.RIGHT })] }),
              ] }),
            ]
          }),

          spacer(300),

          // Table Pertes fiscales
          p([b("Pertes fiscales (baisses d'impots)")], { heading: HeadingLevel.HEADING_2 }),
          new Table({
            columnWidths: [6000, 3360],
            rows: [
              new TableRow({ tableHeader: true, children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("Mesure", { size: 18 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("Perte/an", { size: 18 })], { alignment: AlignmentType.RIGHT })] }),
              ] }),
              ...[
                ["IS a 15% + 0% reinvesti", "20-25 Md\u20AC"],
                ["Flat tax capital 15%", "5-8 Md\u20AC"],
                ["Suppression droits succession", "17 Md\u20AC"],
                ["Exoneration charges stock-options", "1-2 Md\u20AC"],
                ["Regime impatries", "1-2 Md\u20AC"],
              ].map(([m, v]) => new TableRow({ children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, children: [p([t(m, { size: 18 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, children: [p([b(v, { size: 18 })], { alignment: AlignmentType.RIGHT })] }),
              ] })),
              new TableRow({ children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("TOTAL PERTES FISCALES", { size: 18 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("~45-55 Md\u20AC/an", { size: 20 })], { alignment: AlignmentType.RIGHT })] }),
              ] }),
            ]
          }),

          spacer(300),

          // BILAN NET
          p([b("Bilan net")], { heading: HeadingLevel.HEADING_2 }),
          new Table({
            columnWidths: [6000, 3360],
            rows: [
              ...[
                ["Economies", "+250 a +310 Md\u20AC"],
                ["Investissements", "\u2212100 a \u2212105 Md\u20AC"],
                ["Pertes fiscales", "\u221245 a \u221255 Md\u20AC"],
              ].map(([m, v]) => new TableRow({ children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, children: [p([t(m, { size: 20 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, children: [p([b(v, { size: 20 })], { alignment: AlignmentType.RIGHT })] }),
              ] })),
              new TableRow({ children: [
                new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("SOLDE NET ANNUEL", { size: 22 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: "F2F2F2", type: ShadingType.CLEAR }, children: [p([b("+100 a +150 Md\u20AC/an", { size: 22 })], { alignment: AlignmentType.RIGHT })] }),
              ] }),
            ]
          }),

          spacer(200),
          p([t("+ Privatisations (one-shot) : +100 Md\u20AC sur 5 ans", { size: 20 })]),
          p([t("+ Croissance supplementaire (+2-3% PIB) : +60-90 Md\u20AC de recettes/an", { size: 20 })]),
          spacer(100),
          p([b("Resultat : excedent budgetaire possible des l'annee 5. Dette sous 90% du PIB en 10 ans. Depenses publiques a 47% du PIB (moyenne europeenne).", { size: 22 })], { spacing: { after: 200 } }),

          // ════════════════════════════════════
          // RESUME — LISTE DES 50 MESURES
          // ════════════════════════════════════
          p([new PageBreak()]),
          p([b("RESUME \u2014 LISTE DES 50 MESURES")], { heading: HeadingLevel.HEADING_1 }),
          spacer(100),

          p([b("AXE 1 \u2014 LIBERER L'ECONOMIE (Mesures 1-25)")], { heading: HeadingLevel.HEADING_2 }),
          spacer(50),
          p([b("A. Reforme des retraites", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "1. Systeme mixte repartition/capitalisation (modele suedois) \u2014 Eco. 80-120 Md\u20AC/an a terme",
            "2. Age de depart a 67 ans, indexation sur l'esperance de vie \u2014 Eco. 12-15 Md\u20AC/an",
            "3. Suppression de tous les regimes speciaux \u2014 Eco. 5-8 Md\u20AC/an",
            "4. Fonds souverain retraite de 500 Md\u20AC a horizon 2040 \u2014 Rev. 25 Md\u20AC/an a terme",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(50),
          p([b("B. Deregulation du marche du travail", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "5. Code du travail : de 10 000 a 200 articles \u2014 Gain 30-50 Md\u20AC/an de competitivite",
            "6. Liberte d'embauche et de separation (< 50 salaries) \u2014 +500 000 embauches sur 5 ans",
            "7. Contrat de travail unique a droits progressifs",
            "8. Plafonnement des indemnites prud'homales a 6 mois",
            "9. Suppression des 35h, liberte contractuelle \u2014 +2,5% de PIB",
            "10. Suppression du SMIC national, plancher par branche",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(50),
          p([b("C. Fiscalite", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "11. Flat tax a 15% sur tous les revenus du capital",
            "12. IS a 15%, zero pour les benefices reinvestis",
            "13. IR : 2 tranches, maximum 25%, suppression des 474 niches fiscales",
            "14. Suppression totale des droits de succession en ligne directe",
            "15. Privatisation massive : 100 Md\u20AC en 5 ans",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(50),
          p([b("D. Reduction de l'Etat", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "16. Suppression de 1 million de postes de fonctionnaires en 10 ans \u2014 Eco. 42 Md\u20AC/an",
            "17. Fusion des communes : de 35 000 a 5 000 \u2014 Eco. 15-20 Md\u20AC/an",
            "18. Suppression des departements \u2014 Eco. 8-12 Md\u20AC/an",
            "19. Zero papier, 100% numerique d'ici 2030 \u2014 Eco. 10-15 Md\u20AC/an",
            "20. Interdiction constitutionnelle du deficit budgetaire",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(50),
          p([b("E. Protection sociale", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "21. Allocation universelle unique remplacant toutes les aides sociales \u2014 Eco. 15-20 Md\u20AC/an",
            "22. Assurance chomage privee et obligatoire \u2014 Eco. 10-15 Md\u20AC/an",
            "23. Sante : franchise 50\u20AC/an + deremboursement medicaments de confort \u2014 Eco. 5-8 Md\u20AC/an",
            "24. Suppression CMU-C et AME, remplacement par bon sante",
            "25. Logement : suppression aides a la pierre, liberation du foncier \u2014 Eco. 30 Md\u20AC/an",
          ].map(text => bullet([t(text, { size: 19 })])),

          p([new PageBreak()]),
          p([b("AXE 2 \u2014 RESTAURER LA PUISSANCE (Mesures 26-38)")], { heading: HeadingLevel.HEADING_2 }),
          spacer(50),
          p([b("F. Souverainete energetique", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "26. 20 nouveaux reacteurs nucleaires d'ici 2045 \u2014 Inv. 10 Md\u20AC/an",
            "27. Suppression subventions EnR intermittentes \u2014 Eco. 8-10 Md\u20AC/an",
            "28. Permis de construire en 90 jours max pour toute infrastructure energetique",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(50),
          p([b("G. Defense et souverainete militaire", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "29. Budget defense a 3,5% du PIB d'ici 2032 \u2014 Inv. +50 Md\u20AC/an",
            "30. Service national universel de 6 mois obligatoire \u2014 Inv. 6-7 Md\u20AC/an",
            "31. Bouclier antimissile europeen sous leadership francais \u2014 Inv. 1,5 Md\u20AC/an",
            "32. Industrie de defense : objectif 50 Md\u20AC d'exports/an",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(50),
          p([b("H. Souverainete industrielle et technologique", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "33. Fonds souverain tech de 30 Md\u20AC \u2014 Inv. 3 Md\u20AC/an",
            "34. 10 zones franches industrielles a fiscalite zero \u2014 200 000-400 000 emplois",
            "35. Reindustrialisation : objectif 20% du PIB en 2035",
            "36. Remplacement du principe de precaution par le principe d'innovation",
            "37. Statut \"projet d'interet technologique majeur\" \u2014 fast track total",
            "38. Independance numerique : cloud souverain et IA souveraine \u2014 Inv. 1,6 Md\u20AC/an",
          ].map(text => bullet([t(text, { size: 19 })])),

          p([new PageBreak()]),
          p([b("AXE 3 \u2014 ATTIRER LES TALENTS (Mesures 39-50)")], { heading: HeadingLevel.HEADING_2 }),
          spacer(50),
          p([b("I. Immigration choisie et visa tech", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "39. Visa tech de 48h pour ingenieurs et chercheurs",
            "40. Regime fiscal impatries : flat tax 15% pendant 10 ans",
            "41. Exoneration totale de charges sur stock-options et BSPCE",
            "42. 10 universites dans le top 100 mondial \u2014 Inv. +5 Md\u20AC/an",
            "43. R&D : objectif 4% du PIB \u2014 Inv. +10 Md\u20AC/an (part publique)",
            "44. 5 campus tech integres \u2014 Inv. 1 Md\u20AC/an",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(50),
          p([b("J. Competitivite salariale", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "45. Suppression cotisations salariales, TVA sociale \u2014 +15-20% pouvoir d'achat",
            "46. Interessement et participation obligatoires (> 10 salaries)",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(50),
          p([b("K. Education", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "47. Cheque education : les parents choisissent l'ecole",
            "48. Autonomie totale des etablissements scolaires",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(50),
          p([b("L. Immigration et demographie", { size: 20 })], { spacing: { after: 60 } }),
          ...[
            "49. Immigration zero non qualifiee, immigration massive qualifiee (systeme a points)",
            "50. Politique nataliste : 5 000\u20AC/naissance + conge parental 2 ans \u2014 Inv. 3,3 Md\u20AC/an",
          ].map(text => bullet([t(text, { size: 19 })])),

          spacer(400),
          p([], { border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 1 } }, spacing: { after: 100 } }),
          p([t("Programme chiffre a partir des donnees INSEE, DREES, Cour des Comptes, COR, UNEDIC, OCDE, Eurostat, IFRAP, Institut Montaigne. Mars 2026.", { size: 18, color: "999999", italics: true })]),
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Rapports/PROGRAMME-LIBERAL-50-MESURES.docx';
  fs.writeFileSync(outPath, buffer);
  console.log(`Document genere : ${outPath}`);
}

generate().catch(console.error);

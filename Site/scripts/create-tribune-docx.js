const { Document, Packer, Paragraph, TextRun, AlignmentType, Footer, PageNumber, HeadingLevel } = require('docx');
const fs = require('fs');

const FONT = "Times New Roman";
const SIZE = 24; // 12pt
const LINE_SPACING = 360; // 1.5 line spacing (240 = single)

function p(texts, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: { after: 200, line: LINE_SPACING, ...(options.spacing || {}) },
    ...options.extra,
    children: texts.map(t => typeof t === 'string'
      ? new TextRun({ text: t, font: FONT, size: SIZE })
      : new TextRun({ font: FONT, size: SIZE, ...t })
    )
  });
}

function subtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 400, after: 200, line: LINE_SPACING },
    children: [new TextRun({ text, font: FONT, size: SIZE, bold: true })]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: SIZE } } }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      }
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ font: FONT, size: 18, children: [PageNumber.CURRENT] }),
            new TextRun({ font: FONT, size: 18, text: " / " }),
            new TextRun({ font: FONT, size: 18, children: [PageNumber.TOTAL_PAGES] })
          ]
        })]
      })
    },
    children: [
      // Titre
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300, line: LINE_SPACING },
        children: [new TextRun({ text: "Face à la crise énergétique, la France doit enfin changer de modèle", font: FONT, size: 36, bold: true })]
      }),

      // Chapeau
      p([{ text: "La guerre en Iran et le blocage du détroit d'Hormuz imposent un nouveau choc pétrolier. Au lieu d'y répondre par une vision de long terme, comme en 1974, la France distribue des chèques. Il est temps de réorienter la dépense publique et de relancer le nucléaire.", italics: true }], { spacing: { after: 400 } }),

      // Séparateur
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 300 },
        children: [new TextRun({ text: "***", font: FONT, size: SIZE })]
      }),

      // Corps
      p(["La guerre en Iran et le blocage du détroit d'Hormuz ont provoqué ce que les marchés redoutaient\u00a0: un renchérissement brutal du pétrole et un nouveau choc sur les prix de l'énergie. Le baril de Brent dépasse désormais les 119\u00a0dollars. Pour les automobilistes, les transporteurs et les industriels français, la facture est immédiate."]),

      p(["Pourtant, la France n'en est pas à son premier choc pétrolier. En 1973, puis en 1979, le pays avait déjà subi de plein fouet la flambée des cours. Le premier choc avait quadruplé le prix du brut en quelques mois. Le second, lié à la révolution iranienne, l'avait de nouveau multiplié par trois."]),

      p(["Même cause, mais à chaque époque, sa réponse."]),

      // --- Section 1 ---
      subtitle("Le réflexe des années 1970\u00a0: un plan national visionnaire"),

      p(["En 1974, la France réagit par un acte de souveraineté. Le plan Messmer, annoncé le 6\u00a0mars\u00a01974, tire les conséquences d'une dépendance pétrolière devenue insoutenable en lançant le programme nucléaire le plus ambitieux au monde. En l'espace d'une quinzaine d'années, 34\u00a0réacteurs de 900\u00a0MW sont construits et mis en service. Au total, 56\u00a0réacteurs seront raccordés au réseau entre 1977 et 2002. La France passe d'une dépendance quasi totale aux hydrocarbures pour sa production électrique à une indépendance nucléaire de 75\u00a0%. C'est un effort industriel et financier colossal, mais la Nation dispose alors de marges de manœuvre considérables\u00a0: la dépense publique représente 41\u00a0% du PIB et la dette publique tourne autour de 15 à 20\u00a0%."]),

      // --- Section 2 ---
      subtitle("Le réflexe de 2026\u00a0: la politique du chèque"),

      p(["Un demi-siècle plus tard, la réponse de l'État est d'une tout autre nature. Au lieu d'un plan structurel, on distribue des chèques\u00a0: chèque énergie pour les ménages modestes, aides ciblées pour certaines professions — au choix discrétionnaire de l'administration. Les auto-écoles, les petits commerces de proximité ou les artisans qui sillonnent les routes ne sont pas concernés. Pourquoi eux et pas d'autres\u00a0? Personne ne le sait. On colmate, au cas par cas, là où il faudrait repenser le modèle dans son ensemble."]),

      p(["Ce contraste entre les deux époques n'est pas anecdotique. Il est le symptôme d'un pays qui a perdu sa capacité à se projeter."]),

      // --- Section 3 ---
      subtitle("Un État qui n'a plus les moyens de sa politique"),

      p(["Car entre-temps, la France a dilapidé ses marges. La dépense publique atteint désormais 57\u00a0% du PIB, un record parmi les grandes économies mondiales. La dette publique dépasse 3\u00a0300\u00a0milliards d'euros, soit 112\u00a0% du PIB. Et surtout, les taux d'intérêt auxquels l'État emprunte ont atteint cette semaine 3,81\u00a0% sur les obligations à dix ans — un niveau inédit depuis juillet\u00a02009. La France devra emprunter 310\u00a0milliards d'euros cette année, un record absolu."]),

      p(["Conséquence directe\u00a0: la charge de la dette s'élève à 59\u00a0milliards d'euros en 2026. C'est davantage que l'ensemble du budget de la Défense nationale. Autrement dit, nous consacrons plus d'argent à rembourser nos créanciers qu'à protéger nos concitoyens. Et chaque obligation qui arrive à échéance — émise il y a dix ans à un taux de 1 ou 2\u00a0% — est remplacée par un nouvel emprunt à près de 4\u00a0%. L'engrenage est enclenché."]),

      // --- Section 4 ---
      subtitle("Première mutation\u00a0: réorienter la dépense publique"),

      p(["Cette crise doit servir d'électrochoc. La première transformation à engager est celle de la structure même de la dépense publique."]),

      p(["Les dépenses de protection sociale et de santé — retraites, assurance maladie, minima sociaux, allocations diverses — représentent à elles seules 57\u00a0% de la dépense publique totale, soit plus de 950\u00a0milliards d'euros par an. La France est championne mondiale des dépenses sociales rapportées au PIB, devant la Finlande, le Danemark et l'Autriche."]),

      p(["Dans le même temps, les dépenses de défense, de sécurité intérieure et de justice réunies pèsent environ neuf fois moins que l'ensemble des dépenses sociales et de santé. Et ce niveau de dépense sociale sans équivalent ne garantit pas pour autant un service public à la hauteur\u00a0: les urgences hospitalières débordent, les délais de justice s'allongent, les forces de l'ordre manquent d'effectifs sur le terrain. L'argent est dépensé, mais il n'arrive pas là où il est le plus nécessaire."]),

      p(["Il ne s'agit pas de démanteler la solidarité nationale. Il s'agit de la rendre soutenable, en engageant une trajectoire durable de maîtrise des dépenses de transfert, en rationalisant les strates administratives et en libérant la croissance — car c'est l'augmentation du PIB, donc de l'activité et de l'emploi, qui réduit mécaniquement le poids de la dépense publique."]),

      // --- Section 5 ---
      subtitle("Deuxième mutation\u00a0: en finir avec le renoncement nucléaire"),

      p(["Cette crise est aussi le moment de solder un quart de siècle de politique anti-nucléaire. En 1997, le gouvernement Jospin ferme Superphénix, réacteur de quatrième génération qui aurait pu placer la France à l'avant-garde technologique mondiale. En 2012, la promesse de fermer Fessenheim — la plus ancienne centrale du parc — est érigée en symbole par le candidat Hollande. Elle sera effective en 2020. En 2015, la loi de transition énergétique fixe un objectif de réduction de la part du nucléaire à 50\u00a0% du mix électrique. Ce signal politique a fait un mal considérable. Pendant une génération, la filière nucléaire française a cessé de recruter, de former, de construire. Les compétences se sont érodées. Les sous-traitants se sont reconvertis. Les retards et les surcoûts de l'EPR de Flamanville sont aussi le fruit de cette longue parenthèse."]),

      p(["Nous n'avons plus le luxe de l'idéologie énergétique. Le détroit d'Hormuz vient de rappeler au monde la fragilité des approvisionnements fossiles. La France, qui avait bâti une filière nucléaire d'exception, doit la relancer avec la même ambition que celle qui animait le plan Messmer."]),

      // --- Section 6 ---
      subtitle("Le réarmement\u00a0: une obligation, plus un choix"),

      p(["Le second impératif est celui du réarmement. Le parapluie américain, longtemps tenu pour acquis, ne nous protège plus avec la même assurance. Le monde se réarme — la Chine, la Russie, l'Iran — et l'Europe reste dangereusement en retrait. Comme l'a rappelé le chef d'état-major des armées lors d'auditions parlementaires, la France ne tiendrait que quelques jours dans un conflit de haute intensité. Ses stocks de munitions, ses capacités de projection et sa profondeur logistique sont calibrés pour des opérations extérieures limitées, pas pour une guerre conventionnelle majeure."]),

      p(["Réarmer la France, c'est réorienter la dépense publique vers ses fonctions premières\u00a0: protéger les citoyens et garantir la souveraineté. Cela suppose des arbitrages que la classe politique repousse depuis des décennies."]),

      // --- Section 7 ---
      subtitle("Sortir de la fuite en avant"),

      p(["Nicolas Baverez l'écrivait avec justesse\u00a0: la France danse sur un volcan. Le débat politique, à ce stade, semble bien éloigné de ces enjeux. On discute de mesures cosmétiques quand l'édifice se fissure. Les réflexes sont toujours les mêmes — une niche fiscale par-ci, un chèque par-là — et ils n'ont jamais fait la preuve de leur efficacité."]),

      p(["L'élection présidentielle approche. Si nous ne faisons pas ces choix nous-mêmes, dans un cadre démocratique et avec le consentement des citoyens, ils nous seront imposés de l'extérieur — par nos créanciers, par les agences de notation, par les marchés qui fixent chaque jour le prix de notre endettement. Nous avons un an pour en débattre. Il serait temps de commencer."]),
    ]
  }]
});

const outPath = '/Users/emmanuelblezes/Documents/08_Où va l\'argent /Production interne/Rapports/Tribune-crise-energetique-changement-modele.docx';
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Tribune exportée :', outPath);
});

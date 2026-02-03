// Règles Publicodes pour le simulateur de salaire
// Toutes les règles sont définies ici en TypeScript pour éviter les problèmes d'import YAML

const rules = {
  // ============================================
  // PARAMÈTRES DE BASE 2025
  // ============================================
  'salaire brut': {
    question: 'Quel est le salaire brut mensuel ?',
    'par défaut': '3500 €/mois',
    unité: '€/mois',
  },

  'plafond sécurité sociale': {
    valeur: '3864 €/mois',
    description: 'Plafond mensuel de la sécurité sociale (PMSS) 2025',
  },

  'salaire plafonné': {
    valeur: 'salaire brut',
    plafond: 'plafond sécurité sociale',
    description: 'Salaire limité au plafond de la sécurité sociale',
  },

  'assiette CSG': {
    valeur: 'salaire brut * 0.9825',
    description: 'Base de calcul de la CSG (98.25% du brut)',
  },

  'statut cadre': {
    'par défaut': 'non',
    description: 'Le salarié a-t-il le statut cadre ?',
  },

  'multiplicateur retraite complémentaire': {
    variations: [
      { si: 'statut cadre', alors: 1.3 },
      { sinon: 1 },
    ],
    description: 'Multiplicateur pour les cotisations retraite complémentaire des cadres',
  },

  // ============================================
  // COTISATIONS PATRONALES
  // ============================================
  'cotisations patronales': {
    somme: [
      'cotisations patronales . maladie',
      'cotisations patronales . vieillesse',
      'cotisations patronales . famille',
      'cotisations patronales . chômage',
      'cotisations patronales . accidents',
      'cotisations patronales . retraite complémentaire',
      'cotisations patronales . autres',
    ],
    description: 'Total des cotisations employeur',
  },

  'cotisations patronales . maladie': {
    valeur: 'salaire brut * 7%',
    description: 'Assurance maladie employeur',
  },

  'cotisations patronales . vieillesse': {
    somme: [
      'cotisations patronales . vieillesse . plafonnée',
      'cotisations patronales . vieillesse . déplafonnée',
    ],
    description: 'Assurance vieillesse employeur',
  },

  'cotisations patronales . vieillesse . plafonnée': {
    valeur: 'salaire plafonné * 8.55%',
    description: 'Assurance vieillesse plafonnée (sur salaire limité au PASS)',
  },

  'cotisations patronales . vieillesse . déplafonnée': {
    valeur: 'salaire brut * 1.90%',
    description: 'Assurance vieillesse déplafonnée (sur tout le salaire)',
  },

  'cotisations patronales . famille': {
    valeur: 'salaire brut * 3.45%',
    description: 'Allocations familiales (taux réduit)',
  },

  'cotisations patronales . chômage': {
    valeur: 'salaire brut * 4.05%',
    description: 'Assurance chômage employeur',
  },

  'cotisations patronales . accidents': {
    valeur: 'salaire brut * 2%',
    description: 'Accidents du travail / maladies professionnelles',
  },

  'cotisations patronales . retraite complémentaire': {
    valeur: 'salaire brut * 4.72% * multiplicateur retraite complémentaire',
    description: 'AGIRC-ARRCO part employeur',
  },

  'cotisations patronales . autres': {
    somme: [
      'cotisations patronales . fnal',
      'cotisations patronales . formation',
      'cotisations patronales . csa',
    ],
    description: 'FNAL + Formation + CSA',
  },

  'cotisations patronales . fnal': {
    valeur: 'salaire brut * 0.50%',
    description: 'Fonds national d\'aide au logement',
  },

  'cotisations patronales . formation': {
    valeur: 'salaire brut * 0.55%',
    description: 'Contribution à la formation professionnelle',
  },

  'cotisations patronales . csa': {
    valeur: 'salaire brut * 0.30%',
    description: 'Contribution solidarité autonomie',
  },

  // ============================================
  // COTISATIONS SALARIALES
  // ============================================
  'cotisations salariales': {
    somme: [
      'cotisations salariales . vieillesse',
      'cotisations salariales . retraite complémentaire',
      'cotisations salariales . csg crds',
    ],
    description: 'Total des cotisations salarié',
  },

  'cotisations salariales . vieillesse': {
    somme: [
      'cotisations salariales . vieillesse . plafonnée',
      'cotisations salariales . vieillesse . déplafonnée',
    ],
    description: 'Assurance vieillesse salarié',
  },

  'cotisations salariales . vieillesse . plafonnée': {
    valeur: 'salaire plafonné * 6.90%',
    description: 'Assurance vieillesse plafonnée (sur salaire limité au PASS)',
  },

  'cotisations salariales . vieillesse . déplafonnée': {
    valeur: 'salaire brut * 0.40%',
    description: 'Assurance vieillesse déplafonnée (sur tout le salaire)',
  },

  'cotisations salariales . retraite complémentaire': {
    valeur: 'salaire brut * 3.15% * multiplicateur retraite complémentaire',
    description: 'AGIRC-ARRCO part salarié',
  },

  'cotisations salariales . csg crds': {
    valeur: 'assiette CSG * 9.8%',
    description: 'CSG 9.2% + CRDS 0.5% (sur 98.25% du brut)',
  },

  // ============================================
  // IMPÔT SUR LE REVENU
  // ============================================
  'net avant impôt': {
    valeur: 'salaire brut - cotisations salariales',
    description: 'Salaire net avant prélèvement à la source',
  },

  'revenu net imposable annuel': {
    formule: {
      produit: ['net avant impôt', 12],
    },
    description: 'Revenu annuel net pour le calcul IR',
  },

  'impôt sur le revenu annuel': {
    barème: {
      assiette: 'revenu net imposable annuel',
      tranches: [
        { taux: '0%', plafond: 11294 },
        { taux: '11%', plafond: 28797 },
        { taux: '30%', plafond: 82341 },
        { taux: '41%', plafond: 177106 },
        { taux: '45%' },
      ],
    },
    description: 'Barème progressif IR 2025 (célibataire, 1 part)',
  },

  'impôt sur le revenu mensuel': {
    valeur: 'impôt sur le revenu annuel / 12',
    description: 'Prélèvement à la source mensuel',
  },

  'taux effectif IR': {
    variations: [
      { si: 'revenu net imposable annuel > 0', alors: 'impôt sur le revenu annuel / revenu net imposable annuel' },
      { sinon: 0 },
    ],
    description: 'Taux moyen d\'imposition',
  },

  // ============================================
  // RÉSULTATS FINAUX
  // ============================================
  'super brut': {
    valeur: 'salaire brut + cotisations patronales',
    description: 'Coût total employeur',
  },

  'net après impôt': {
    valeur: 'net avant impôt - impôt sur le revenu mensuel',
    description: 'Ce que le salarié reçoit sur son compte',
  },
}

export default rules

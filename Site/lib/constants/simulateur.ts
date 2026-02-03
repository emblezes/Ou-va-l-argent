// Taux de cotisations 2025
export const TAUX = {
  // Cotisations patronales
  patronales: {
    maladie: 0.07,           // 7%
    vieillesse_plafonnee: 0.0855,  // 8.55%
    vieillesse_deplafonnee: 0.019, // 1.90%
    allocations_familiales: 0.0345, // 3.45% (taux réduit)
    chomage: 0.0405,         // 4.05%
    accidents_travail: 0.02, // ~2% (variable)
    fnal: 0.005,             // 0.50%
    formation: 0.0055,       // 0.55%
    retraite_complementaire: 0.0472, // 4.72%
    csa: 0.003,              // 0.30%
  },
  // Cotisations salariales
  salariales: {
    maladie: 0,              // 0% (supprimé)
    vieillesse_plafonnee: 0.069,   // 6.90%
    vieillesse_deplafonnee: 0.004, // 0.40%
    retraite_complementaire: 0.0315, // 3.15%
    csg_crds: 0.098,         // 9.8% (sur 98.25% du brut)
  },
  // Impôt sur le revenu (taux moyen estimé)
  ir_taux_defaut: 0.075  // 7.5% taux neutre pour ~35k€/an
}

// Plafond de la sécurité sociale 2025
export const PASS_MENSUEL = 3864

// Barème IR 2025 (tranches)
export const TRANCHES_IR = [
  { min: 0, max: 11294, taux: 0 },
  { min: 11294, max: 28797, taux: 0.11 },
  { min: 28797, max: 82341, taux: 0.30 },
  { min: 82341, max: 177106, taux: 0.41 },
  { min: 177106, max: Infinity, taux: 0.45 },
]

// Distribution des cotisations avec couleurs et icons
export const COTISATION_CATEGORIES = [
  {
    id: 'retraite',
    icon: '👴',
    name: 'Retraite',
    description: 'Assurance vieillesse + complémentaire',
    color: '#a855f7',
  },
  {
    id: 'sante',
    icon: '🏥',
    name: 'Santé & Maladie',
    description: 'Assurance maladie, maternité, invalidité',
    color: '#ff6b6b',
  },
  {
    id: 'famille',
    icon: '👨‍👩‍👧‍👦',
    name: 'Allocations familiales',
    description: 'CAF, prestations familiales',
    color: '#4ecdc4',
  },
  {
    id: 'chomage',
    icon: '💼',
    name: 'Assurance chômage',
    description: 'Pôle Emploi, France Travail',
    color: '#45b7d1',
  },
  {
    id: 'csg',
    icon: '🏛️',
    name: 'CSG & CRDS',
    description: 'Contribution sociale généralisée',
    color: '#ffd700',
  },
  {
    id: 'ir',
    icon: '📋',
    name: 'Impôt sur le revenu',
    description: 'Prélèvement à la source',
    color: '#ff4757',
  },
  {
    id: 'accidents',
    icon: '🛡️',
    name: 'Accidents du travail',
    description: 'Prévention et indemnisation AT/MP',
    color: '#ff9f43',
  },
  {
    id: 'autres',
    icon: '📚',
    name: 'Formation & Autres',
    description: 'Formation pro, FNAL, CSA',
    color: '#8899a8',
  },
]

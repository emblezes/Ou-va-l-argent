// Budget data for 2025 (actualisé T3 2025 - Source: INSEE)
export const BUDGET_2025 = {
  totalDepenses: 1670, // Md€ (INSEE 2024)
  recettesFiscales: 1501, // Md€ (recettes totales APU)
  deficit: -169, // Md€ (INSEE 2024: -168.6 Md€)
  depensesPIB: 57, // %
  detteTotale: 3482, // Md€ (INSEE T3 2025)
  dettePIB: 117.4, // % (INSEE T3 2025)
  chargeInterets: 54, // Md€ (estimation 2025)
  habitants: 68.6, // millions (INSEE 01/2025)
  detteParHabitant: 50800, // € (3482 Md€ / 68.6M)
}

export const MINISTRIES = [
  {
    id: 'sante',
    name: 'Santé & Solidarités',
    shortName: 'Protection Sociale & Santé',
    icon: '🏥',
    amount: 932, // Md€ (DREES 2024: 932.5 Md€)
    percent: 55.8,
    evolution: 4.2,
    color: '#ff6b6b',
    description: 'Premier poste de dépenses',
  },
  {
    id: 'education',
    name: 'Éducation nationale',
    shortName: 'Éducation & Recherche',
    icon: '🎓',
    amount: 168, // Md€
    percent: 10.5,
    evolution: 2.1,
    color: '#4ecdc4',
    description: 'Investissement d\'avenir',
  },
  {
    id: 'defense',
    name: 'Armées',
    shortName: 'Défense & Sécurité',
    icon: '🛡️',
    amount: 65, // Md€
    percent: 4.0,
    evolution: 7.5,
    color: '#45b7d1',
    description: 'Sécurité nationale',
  },
  {
    id: 'ecologie',
    name: 'Transition écologique',
    shortName: 'Environnement & Énergie',
    icon: '🌱',
    amount: 58, // Md€
    percent: 3.6,
    evolution: 12.3,
    color: '#96ceb4',
    description: 'Transition écologique',
  },
  {
    id: 'administration',
    name: 'Administration Générale',
    shortName: 'Services publics',
    icon: '🏛️',
    amount: 85, // Md€
    percent: 5.3,
    evolution: 1.5,
    color: '#dda0dd',
    description: 'Services publics',
  },
  {
    id: 'dette',
    name: 'Charge de la dette',
    shortName: 'Intérêts de la Dette',
    icon: '💳',
    amount: 52, // Md€
    percent: 3.2,
    evolution: 8.0,
    color: '#ffd700',
    description: 'Charge de la dette',
  },
  {
    id: 'economie',
    name: 'Économie & Finances',
    shortName: 'Économie & Finances',
    icon: '💼',
    amount: 52, // Md€
    percent: 3.2,
    evolution: -1.2,
    color: '#ffd700',
    description: 'Économie',
  },
  {
    id: 'justice',
    name: 'Justice',
    shortName: 'Justice',
    icon: '⚖️',
    amount: 12.5, // Md€
    percent: 0.8,
    evolution: 5.8,
    color: '#a855f7',
    description: 'Justice',
  },
]

export const TIMELINE_EVENTS = [
  {
    year: '2020',
    title: 'Crise Covid-19',
    description: 'Le "quoi qu\'il en coûte" mobilise des ressources sans précédent pour soutenir l\'économie française.',
    stat: '+180 Md€ de dépenses exceptionnelles',
  },
  {
    year: '2022',
    title: 'Bouclier tarifaire',
    description: 'Face à la crise énergétique, l\'État déploie des aides massives pour protéger les ménages et les entreprises.',
    stat: '45 Md€ de soutien énergétique',
  },
  {
    year: '2024',
    title: 'Plan de redressement',
    description: 'Lancement d\'un programme ambitieux de réduction du déficit public avec objectif de 3% du PIB.',
    stat: 'Objectif: -20 Md€ d\'économies',
  },
  {
    year: '2025',
    title: 'France 2030',
    description: 'Investissements massifs dans l\'innovation, la transition écologique et la réindustrialisation.',
    stat: '54 Md€ d\'investissements stratégiques',
  },
]

export const STATS = [
  { value: '57%', label: 'Dépenses publiques / PIB' },
  { value: '3.5T€', label: 'Dette publique totale' },
  { value: '5.8M', label: 'Agents de la fonction publique' },
  { value: '117%', label: 'Ratio dette / PIB' },
]

// Historical debt data (Source: INSEE)
export const DEBT_HISTORY = [
  { year: '2000', debt: 826, ratio: 58 },
  { year: '2005', debt: 1147, ratio: 67 },
  { year: '2008', debt: 1319, ratio: 68 },
  { year: '2010', debt: 1595, ratio: 85 },
  { year: '2012', debt: 1841, ratio: 90 },
  { year: '2015', debt: 2101, ratio: 95 },
  { year: '2017', debt: 2254, ratio: 98 },
  { year: '2019', debt: 2380, ratio: 97 },
  { year: '2020', debt: 2650, ratio: 115 },
  { year: '2021', debt: 2813, ratio: 113 },
  { year: '2022', debt: 2950, ratio: 111 },
  { year: '2023', debt: 3088, ratio: 110 },
  { year: '2024', debt: 3305, ratio: 113.2 }, // INSEE T4 2024
  { year: '2025', debt: 3482, ratio: 117.4 }, // INSEE T3 2025
]

// European comparison
export const EU_COMPARISON_SPENDING = [
  { country: 'France', value: 57, highlight: true },
  { country: 'Italie', value: 56.7 },
  { country: 'Belgique', value: 54.1 },
  { country: 'Allemagne', value: 49.5 },
  { country: 'Espagne', value: 47.8 },
  { country: 'Pays-Bas', value: 44.5 },
  { country: 'UE Moyenne', value: 49.2, isAverage: true },
]

// Eurostat fin 2024
export const EU_COMPARISON_DEBT = [
  { country: 'Grèce', value: 153.6 },
  { country: 'Italie', value: 135.3 },
  { country: 'France', value: 117.4, highlight: true }, // T3 2025
  { country: 'Espagne', value: 107.7 },
  { country: 'Belgique', value: 105.2 },
  { country: 'Allemagne', value: 63.7 },
  { country: 'Pays-Bas', value: 46.5 },
  { country: 'UE moy.', value: 82.6, isAverage: true },
]

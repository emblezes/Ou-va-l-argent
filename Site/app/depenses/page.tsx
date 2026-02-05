'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { KpiCard } from '@/components/ui/KpiCard'
import { ChartWrapper, LineChart, BarChart } from '@/components/charts'

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted.current) {
            hasStarted.current = true
            let startTime: number | null = null

            const animate = (timestamp: number) => {
              if (!startTime) startTime = timestamp
              const progress = Math.min((timestamp - startTime) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 4)
              setCount(Math.floor(eased * end))

              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                setCount(end)
              }
            }

            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration])

  return { count, ref: countRef }
}

// Source: INSEE - Comptes des administrations publiques 2024
const FRANCE_DATA = {
  total: 1670,
  recettes: 1502,
  deficit: -169,
  ratio: 57.1, // Eurostat 2024
  population: 68, // millions
  perCapita: 24560, // €/habitant/an
}

// Source: INSEE 2024 - Répartition par administration publique (CONSOLIDÉ, ordre décroissant)
// Chiffres consolidés = sans double-comptage des transferts entre administrations
const REPARTITION_APU = [
  { name: 'Sécurité sociale', amount: 768, percent: 46, color: '#ff6b6b', description: 'Retraites, santé, famille, chômage' },
  { name: 'État', amount: 568, percent: 34, color: '#00d4ff', description: 'Ministères et administrations centrales' },
  { name: 'Collectivités locales', amount: 334, percent: 20, color: '#00ff88', description: 'Régions, départements, communes' },
]

// Source: INSEE, FIPECO - Évolution historique longue (vérifié 02/2026)
// Version enrichie avec les années clés pour afficher les annotations sur le graphique
const EVOLUTION_HISTORIQUE = {
  labels: ['1960', '1970', '1975', '1980', '1981', '1990', '2000', '2009', '2010', '2020', '2024'],
  ratio: [35.0, 38.5, 46.2, 48.0, 50.2, 49.8, 51.6, 56.0, 56.4, 61.7, 57.1],
  // Indices des années avec événements marquants (pour styliser les points)
  eventIndices: [2, 4, 7, 9], // 1975, 1981, 2009, 2020
  events: [
    { year: '1975', label: 'Choc pétrolier', value: 46.2, index: 2 },
    { year: '1981', label: 'Politiques Mitterrand', value: 50.2, index: 4 },
    { year: '2009', label: 'Crise financière', value: 56.0, index: 7 },
    { year: '2020', label: 'COVID-19', value: 61.7, index: 9 },
  ],
}

// Source: INSEE 2024 - Fonctionnement vs Investissement
const FONCTIONNEMENT_INVESTISSEMENT = {
  fonctionnement: { amount: 1544, percent: 92.4, label: 'Fonctionnement', color: '#ff9f43' },
  investissement: { amount: 126, percent: 7.6, label: 'Investissement', color: '#00d4ff' },
}

// Source: DGAFP 2024 - Fonction publique (effectifs au 31/12/2022)
const FONCTION_PUBLIQUE = {
  total: 5.7, // millions
  fpe: 2.54, // État
  fpt: 1.94, // Territoriale
  fph: 1.21, // Hospitalière
  masseSalariale: 245, // Md€
}

// Source: INSEE - Comptes des administrations publiques (base 2020)
const EVOLUTION_DATA = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  total: [1242, 1257, 1291, 1314, 1349, 1434, 1473, 1549, 1607, 1670],
  recettes: [1171, 1196, 1244, 1292, 1313, 1256, 1371, 1423, 1456, 1502],
}

// Source: INSEE, DREES, FIPECO - Évolution des dépenses par catégorie (% du PIB)
// Montre l'explosion des dépenses sociales sur 40 ans
const EVOLUTION_CATEGORIES = {
  labels: ['1980', '1990', '2000', '2010', '2020', '2024'],
  datasets: {
    protectionSociale: {
      label: 'Protection sociale',
      data: [21.5, 25.2, 27.8, 31.2, 35.1, 31.5],
      color: '#ff6b6b',
      description: 'Retraites, santé, famille, chômage',
    },
    education: {
      label: 'Éducation',
      data: [5.1, 5.4, 5.8, 5.6, 5.7, 5.5],
      color: '#4ecdc4',
      description: 'Stable depuis 40 ans',
    },
    defense: {
      label: 'Défense',
      data: [3.8, 3.4, 2.5, 2.3, 2.0, 2.1],
      color: '#45b7d1',
      description: 'En baisse constante',
    },
    servicesPublics: {
      label: 'Services généraux',
      data: [4.2, 4.5, 4.8, 5.2, 5.8, 5.5],
      color: '#dda0dd',
      description: 'Administration, dette',
    },
  },
}

// Répartition détaillée (source: COR 2024 pour retraites, INSEE pour le reste)
// Total dépenses publiques 2024 : 1 670 Md€
// Trié du plus grand au plus petit
const TOTAL_DEPENSES = 1670
const SPENDING_BREAKDOWN = [
  { id: 'retraites', name: 'Retraites', detail: 'tous régimes base + complémentaires', amount: 380, color: '#ff6b6b', icon: '👴' },
  { id: 'sante', name: 'Santé', amount: 230, color: '#a855f7', icon: '🏥' },
  { id: 'protection-sociale', name: 'Protection sociale hors retraites', detail: 'famille, chômage, invalidité, pauvreté', amount: 231, color: '#ff9f43', icon: '👨‍👩‍👧' },
  { id: 'politiques-sectorielles', name: 'Politiques sectorielles', detail: 'transports, agriculture, industrie, commerce', amount: 191, color: '#8899a8', icon: '🏗️' },
  { id: 'affaires-economiques', name: 'Affaires économiques', detail: 'emploi, entreprises, énergie', amount: 137, color: '#00d4ff', icon: '💼' },
  { id: 'services-publics', name: 'Services publics généraux', detail: 'administration, diplomatie', amount: 132, color: '#dda0dd', icon: '🏛️' },
  { id: 'education', name: 'Éducation', amount: 118, color: '#4ecdc4', icon: '🎓' },
  { id: 'defense', name: 'Défense', amount: 55, color: '#45b7d1', icon: '🛡️' },
  { id: 'dette', name: 'Charge de la dette', amount: 54, color: '#ffd700', icon: '💳' },
  { id: 'securite', name: 'Ordre & Sécurité', detail: 'police, justice, prisons', amount: 45, color: '#ff4757', icon: '👮' },
  { id: 'logement', name: 'Logement', amount: 38, color: '#96ceb4', icon: '🏠' },
  { id: 'culture', name: 'Culture & Loisirs', amount: 37, color: '#c4b5fd', icon: '🎭' },
  { id: 'environnement', name: 'Environnement', amount: 32, color: '#00ff88', icon: '🌱' },
]

// ============================================
// DONNÉES COMPARAISON INTERNATIONALE
// ============================================

// Source: Eurostat 2024 - Dépenses publiques en % du PIB
const EU_SPENDING_PIB = [
  { country: 'Finlande', value: 57.6 },
  { country: 'France', value: 57.1, highlight: true },
  { country: 'Belgique', value: 54.5 },
  { country: 'Italie', value: 53.7 },
  { country: 'Autriche', value: 52.3 },
  { country: 'Grèce', value: 51.8 },
  { country: 'Allemagne', value: 49.5 },
  { country: 'Espagne', value: 47.3 },
  { country: 'Pays-Bas', value: 44.5 },
  { country: 'Moy. UE', value: 49.2, isAverage: true },
]

// Source: OCDE 2024 - Dépenses publiques en % du PIB (trié du plus élevé au moins élevé)
const OECD_SPENDING_PIB = [
  { country: '🇫🇮 Finlande', value: 57.6 },
  { country: '🇫🇷 France', value: 57.1, highlight: true },
  { country: '🇧🇪 Belgique', value: 54.5 },
  { country: '🇮🇹 Italie', value: 53.7 },
  { country: '🇪🇺 Moy. UE', value: 49.2, isAverage: true },
  { country: '📊 Moy. OCDE', value: 46.0, isAverage: true },
  { country: '🇬🇧 Royaume-Uni', value: 44.8 },
  { country: '🇺🇸 États-Unis', value: 38.1 },
  { country: '🇨🇭 Suisse', value: 34.2 },
  { country: '🇰🇷 Corée du Sud', value: 28.3 },
]

// Écart France vs UE - Source: Eurostat, budget.gouv.fr 2024
const ECART_FRANCE_UE = {
  francePIB: 57.1,
  moyenneUE: 49.2,
  ecartPoints: 7.9,
  pibFrance: 2930, // Md€
  ecartMilliards: 231, // 7.9% de 2930 Md€
}

// Source: Eurostat 2024 - Dépenses de protection sociale en % du PIB
const EU_SOCIAL_SPENDING = [
  { country: 'France', value: 31.5, highlight: true },
  { country: 'Finlande', value: 29.8 },
  { country: 'Danemark', value: 28.9 },
  { country: 'Italie', value: 28.5 },
  { country: 'Belgique', value: 28.2 },
  { country: 'Allemagne', value: 27.1 },
  { country: 'Espagne', value: 24.3 },
  { country: 'Pays-Bas', value: 23.1 },
  { country: 'Irlande', value: 14.2 },
]

// Source: Eurostat 2024 - Dépenses d'éducation en % du PIB
const EU_EDUCATION_SPENDING = [
  { country: 'Suède', value: 6.9 },
  { country: 'Belgique', value: 6.4 },
  { country: 'Danemark', value: 6.1 },
  { country: 'Finlande', value: 5.9 },
  { country: 'France', value: 5.5, highlight: true },
  { country: 'Pays-Bas', value: 5.3 },
  { country: 'Allemagne', value: 4.7 },
  { country: 'Espagne', value: 4.6 },
  { country: 'Italie', value: 4.3 },
]

// Source: Eurostat, OCDE 2024 - Dépenses de santé en % du PIB
const HEALTH_SPENDING = [
  { country: 'États-Unis', value: 16.6 },
  { country: 'Allemagne', value: 12.7 },
  { country: 'France', value: 12.1, highlight: true },
  { country: 'Suisse', value: 11.8 },
  { country: 'Japon', value: 11.5 },
  { country: 'Belgique', value: 11.1 },
  { country: 'Pays-Bas', value: 10.9 },
  { country: 'Royaume-Uni', value: 10.3 },
  { country: 'Italie', value: 9.0 },
]

// Source: OTAN, Eurostat 2024 - Dépenses de défense en % du PIB
const DEFENSE_SPENDING = [
  { country: 'États-Unis', value: 3.4 },
  { country: 'Grèce', value: 3.0 },
  { country: 'Pologne', value: 2.4 },
  { country: 'Royaume-Uni', value: 2.3 },
  { country: 'France', value: 2.1, highlight: true },
  { country: 'Allemagne', value: 1.6 },
  { country: 'Italie', value: 1.5 },
  { country: 'Espagne', value: 1.3 },
  { country: 'Belgique', value: 1.2 },
]

// Évolution comparée des dépenses (2015-2024)
const EVOLUTION_COMPARISON = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  france: [56.8, 56.6, 56.5, 55.6, 55.4, 61.3, 59.0, 58.4, 57.3, 57.1],
  allemagne: [43.5, 43.9, 43.9, 43.9, 45.0, 50.9, 50.5, 49.4, 49.0, 49.5],
  italie: [50.3, 49.1, 48.7, 48.4, 48.5, 56.8, 56.0, 54.8, 54.2, 53.7],
  espagne: [43.8, 42.2, 41.0, 41.6, 42.1, 52.3, 50.6, 47.4, 46.8, 47.3],
}

// Source: OCDE, DGAFP 2024 - Fonctionnaires pour 1000 habitants
const FONCTIONNAIRES_COMPARISON = [
  { country: 'Norvège', value: 158, color: '#2a3a4a' },
  { country: 'Danemark', value: 144, color: '#2a3a4a' },
  { country: 'Suède', value: 140, color: '#2a3a4a' },
  { country: 'Finlande', value: 124, color: '#2a3a4a' },
  { country: 'Canada', value: 93, color: '#2a3a4a' },
  { country: 'France', value: 88, highlight: true, color: '#00d4ff' },
  { country: 'Royaume-Uni', value: 78, color: '#2a3a4a' },
  { country: 'Allemagne', value: 62, color: '#2a3a4a' },
  { country: 'Pays-Bas', value: 58, color: '#2a3a4a' },
]

// Source: OCDE PISA 2022, Eurostat - Efficacité éducation
const EFFICACITE_EDUCATION = [
  { country: 'Finlande', depense: 5.9, pisa: 507, efficiency: 86 },
  { country: 'Estonie', depense: 5.1, pisa: 510, efficiency: 100 },
  { country: 'Pays-Bas', depense: 5.3, pisa: 493, efficiency: 93 },
  { country: 'Allemagne', depense: 4.7, pisa: 475, efficiency: 101 },
  { country: 'France', depense: 5.5, pisa: 474, efficiency: 86, highlight: true },
  { country: 'Suède', depense: 6.9, pisa: 482, efficiency: 70 },
  { country: 'Italie', depense: 4.3, pisa: 471, efficiency: 110 },
  { country: 'États-Unis', depense: 6.1, pisa: 465, efficiency: 76 },
]

// Source: OCDE 2024 - Efficacité santé (espérance de vie vs dépenses)
const EFFICACITE_SANTE = [
  { country: 'Japon', depense: 11.5, esperance: 84.3, efficiency: 100 },
  { country: 'Espagne', depense: 9.5, esperance: 83.3, efficiency: 105 },
  { country: 'Italie', depense: 9.0, esperance: 83.1, efficiency: 108 },
  { country: 'France', depense: 12.1, esperance: 82.9, efficiency: 85, highlight: true },
  { country: 'Suède', depense: 10.7, esperance: 83.0, efficiency: 91 },
  { country: 'Allemagne', depense: 12.7, esperance: 81.2, efficiency: 74 },
  { country: 'Royaume-Uni', depense: 10.3, esperance: 81.4, efficiency: 85 },
  { country: 'États-Unis', depense: 16.6, esperance: 77.5, efficiency: 46 },
]

// ============================================
// NOUVEAUX ANGLES DE COMPARAISON AGRÉGÉS
// ============================================

// Source: Eurostat, OCDE 2024 - Divergence France-Allemagne
const DIVERGENCE_FR_DE = {
  labels: ['2000', '2005', '2010', '2015', '2020', '2024'],
  france: [51.6, 53.3, 56.4, 56.8, 61.3, 57.1],
  allemagne: [44.5, 46.2, 47.3, 43.5, 50.9, 49.5],
  ecart: [7.1, 7.1, 9.1, 13.3, 10.4, 7.7], // écart France - Allemagne
}

// Source: Eurostat COFOG 2024 - Structure des dépenses publiques par fonction (% du PIB)
// Permet de comparer les priorités budgétaires de chaque pays
const STRUCTURE_DEPENSES = {
  categories: [
    { id: 'protection', label: 'Protection sociale', color: '#ff6b6b' },
    { id: 'sante', label: 'Santé', color: '#a855f7' },
    { id: 'services', label: 'Services généraux', color: '#64748b' },
    { id: 'education', label: 'Éducation', color: '#4ecdc4' },
    { id: 'economie', label: 'Affaires économiques', color: '#00d4ff' },
    { id: 'defense', label: 'Défense', color: '#45b7d1' },
    { id: 'autres', label: 'Autres', color: '#94a3b8' },
  ],
  pays: [
    {
      country: '🇫🇷 France',
      total: 57.1,
      highlight: true,
      data: { protection: 24.0, sante: 8.5, services: 6.0, education: 5.5, economie: 6.5, defense: 2.1, autres: 4.5 },
    },
    {
      country: '🇧🇪 Belgique',
      total: 54.5,
      data: { protection: 21.0, sante: 8.0, services: 8.5, education: 6.4, economie: 5.8, defense: 1.2, autres: 3.6 },
    },
    {
      country: '🇮🇹 Italie',
      total: 53.7,
      data: { protection: 22.0, sante: 7.0, services: 8.5, education: 4.3, economie: 5.0, defense: 1.5, autres: 5.4 },
    },
    {
      country: '🇩🇪 Allemagne',
      total: 49.5,
      data: { protection: 21.5, sante: 8.0, services: 5.5, education: 4.7, economie: 4.2, defense: 1.6, autres: 4.0 },
    },
    {
      country: '🇪🇸 Espagne',
      total: 47.3,
      data: { protection: 18.5, sante: 6.5, services: 5.5, education: 4.6, economie: 5.5, defense: 1.3, autres: 5.4 },
    },
    {
      country: '🇳🇱 Pays-Bas',
      total: 44.5,
      data: { protection: 16.5, sante: 8.2, services: 5.0, education: 5.3, economie: 4.5, defense: 1.5, autres: 3.5 },
    },
  ],
}

// Décomposition de la protection sociale en France (Source: DREES 2024)
// Total protection sociale France: 932 Md€ de prestations
const PROTECTION_SOCIALE_FRANCE = {
  total: 932, // Md€
  categories: [
    { id: 'retraites', label: 'Retraites', amount: 380, percent: 40.8, color: '#ff9f43', description: 'Pensions vieillesse et survie' },
    { id: 'maladie', label: 'Maladie', amount: 230, percent: 24.7, color: '#ff6b6b', description: 'Soins, indemnités journalières' },
    { id: 'famille', label: 'Famille', amount: 55, percent: 5.9, color: '#a855f7', description: 'Allocations familiales, congé parental' },
    { id: 'chomage', label: 'Chômage', amount: 45, percent: 4.8, color: '#00d4ff', description: 'Assurance chômage, formation' },
    { id: 'logement', label: 'Logement', amount: 40, percent: 4.3, color: '#4ecdc4', description: 'APL, aides au logement' },
    { id: 'pauvrete', label: 'Pauvreté/Exclusion', amount: 30, percent: 3.2, color: '#64748b', description: 'RSA, minima sociaux' },
    { id: 'autres', label: 'Autres', amount: 152, percent: 16.3, color: '#94a3b8', description: 'Invalidité, accidents du travail, autres prestations' },
  ],
}

// Comparaison internationale : Part des retraites dans la protection sociale (Source: Eurostat 2024)
const RETRAITES_COMPARAISON = [
  { country: '🇮🇹 Italie', percent: 55.2, highlight: false },
  { country: '🇫🇷 France', percent: 47.5, highlight: true },
  { country: '🇪🇸 Espagne', percent: 44.8, highlight: false },
  { country: '🇩🇪 Allemagne', percent: 42.1, highlight: false },
  { country: '🇧🇪 Belgique', percent: 39.5, highlight: false },
  { country: '🇳🇱 Pays-Bas', percent: 36.2, highlight: false },
]

export default function DepensesPage() {
  const [activeTab, setActiveTab] = useState<'france' | 'comparaison'>('france')
  const [showRawData, setShowRawData] = useState(false)
  const { count: animatedTotal, ref: counterRef } = useAnimatedCounter(FRANCE_DATA.total, 2000)

  // Calcul pour 100€ d'argent public
  const getPer100 = (amount: number) => ((amount / TOTAL_DEPENSES) * 100).toFixed(1)

  return (
    <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
          Les <span className="italic text-accent-electric">dépenses</span> publiques
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          {activeTab === 'france'
            ? "Analyse complète des dépenses de l'État français et leur évolution"
            : 'Comparaison internationale des dépenses publiques'}
        </p>
      </header>

      {/* Tab Selector */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('france')}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'france'
              ? 'bg-accent-electric text-bg-deep'
              : 'bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-glass-border/50'
          }`}
        >
          <span className="text-lg">🇫🇷</span>
          France
        </button>
        <button
          onClick={() => setActiveTab('comparaison')}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'comparaison'
              ? 'bg-accent-electric text-bg-deep'
              : 'bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-glass-border/50'
          }`}
        >
          <span className="text-lg">🌍</span>
          Comparaison internationale
        </button>
      </div>

      {/* ============================================ */}
      {/* TAB FRANCE */}
      {/* ============================================ */}
      {activeTab === 'france' && (
        <>
          {/* Big Counter Banner */}
          <div className="bg-glass backdrop-blur-xl border border-glass-border rounded-2xl p-8 lg:p-12 mb-10 text-center max-w-2xl mx-auto">
            <p className="text-text-muted text-sm uppercase tracking-wider mb-4">
              Dépenses publiques 2024
            </p>
            <div
              ref={counterRef}
              className="font-mono text-[clamp(3rem,12vw,5.5rem)] font-medium text-accent-electric leading-none"
            >
              {animatedTotal.toLocaleString('fr-FR')} <span className="text-[0.5em]">Md€</span>
            </div>
            <p className="text-text-secondary text-lg mt-4">
              soit <span className="text-accent-gold font-mono">52 960 €</span> dépensés chaque seconde
            </p>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
              icon="💰"
              label="Dépenses totales"
              value={`${FRANCE_DATA.total} Md€`}
              subtext="Budget consolidé 2024"
              color="electric"
            />
            <KpiCard
              icon="👤"
              label="Par habitant"
              value={`${FRANCE_DATA.perCapita.toLocaleString('fr-FR')} €`}
              subtext="Par an et par Français"
              color="purple"
            />
            <KpiCard
              icon="📉"
              label="Déficit public"
              value={`${FRANCE_DATA.deficit} Md€`}
              subtext="Dépenses - Recettes"
              color="red"
            />
            <KpiCard
              icon="📈"
              label="Dépenses / PIB"
              value={`${FRANCE_DATA.ratio}%`}
              subtext="Ratio budgétaire"
              color="gold"
            />
          </div>

          {/* Graphiques côte à côte : Évolution récente + Évolution longue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Évolution des dépenses (2015-2024) */}
            <ChartWrapper
              title="Évolution des dépenses"
              subtitle="En milliards d'euros, 2015-2024"
              height="350px"
              source="INSEE - Comptes nationaux"
            >
              <LineChart
                labels={EVOLUTION_DATA.labels}
                datasets={[
                  {
                    label: 'Dépenses totales',
                    data: EVOLUTION_DATA.total,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    borderWidth: 3,
                  },
                  {
                    label: 'Recettes',
                    data: EVOLUTION_DATA.recettes,
                    borderColor: '#00ff88',
                    borderWidth: 2,
                  },
                ]}
                yMin={1000}
                yMax={1800}
                yCallback={(v) => `${v} Md€`}
              />
            </ChartWrapper>

            {/* Évolution historique longue (1960-2024) */}
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-5 flex flex-col">
              <div className="mb-3">
                <h3 className="text-lg font-semibold">60 ans d&apos;évolution</h3>
                <p className="text-sm text-text-muted mt-1">Dépenses publiques en % du PIB</p>
              </div>

              {/* Graphique avec annotations intégrées */}
              <div className="flex-1 relative" style={{ minHeight: '350px' }}>
                <ChartWrapper title="" subtitle="" height="350px" source="">
                  <LineChart
                    labels={EVOLUTION_HISTORIQUE.labels}
                    datasets={[
                      {
                        label: 'Dépenses / PIB',
                        data: EVOLUTION_HISTORIQUE.ratio,
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.15)',
                        fill: true,
                        borderWidth: 3,
                      },
                    ]}
                    yMin={30}
                    yMax={65}
                    yCallback={(v) => `${v}%`}
                  />
                </ChartWrapper>

                {/* Légende des événements clés */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-around px-4 pointer-events-none">
                  {EVOLUTION_HISTORIQUE.events.map((event) => (
                    <div key={event.year} className="text-center bg-bg-deep/80 backdrop-blur-sm px-2 py-1 rounded">
                      <div className="font-mono text-xs font-bold text-accent-gold">{event.year}</div>
                      <div className="text-[10px] text-text-secondary whitespace-nowrap">{event.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 p-2 bg-accent-gold/10 border border-accent-gold/20 rounded-lg">
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-accent-gold">+22 pts en 60 ans</span> — de 35% (1960) à 57% (2024)
                </p>
              </div>
              <p className="text-xs text-text-muted/60 mt-2 text-right">Source : INSEE, FIPECO</p>
            </div>
          </div>

          {/* Nouveau graphique : Évolution par catégorie - L'explosion sociale */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Graphique carré */}
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-5">
              <div className="mb-3">
                <h3 className="text-lg font-semibold">L&apos;explosion des dépenses sociales</h3>
                <p className="text-sm text-text-muted mt-1">Évolution par catégorie en % du PIB (1980-2024)</p>
              </div>
              <div style={{ height: '350px' }}>
                <LineChart
                  labels={EVOLUTION_CATEGORIES.labels}
                  datasets={[
                    {
                      label: EVOLUTION_CATEGORIES.datasets.protectionSociale.label,
                      data: EVOLUTION_CATEGORIES.datasets.protectionSociale.data,
                      borderColor: EVOLUTION_CATEGORIES.datasets.protectionSociale.color,
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      fill: true,
                      borderWidth: 3,
                    },
                    {
                      label: EVOLUTION_CATEGORIES.datasets.education.label,
                      data: EVOLUTION_CATEGORIES.datasets.education.data,
                      borderColor: EVOLUTION_CATEGORIES.datasets.education.color,
                      borderWidth: 2,
                    },
                    {
                      label: EVOLUTION_CATEGORIES.datasets.defense.label,
                      data: EVOLUTION_CATEGORIES.datasets.defense.data,
                      borderColor: EVOLUTION_CATEGORIES.datasets.defense.color,
                      borderWidth: 2,
                    },
                    {
                      label: EVOLUTION_CATEGORIES.datasets.servicesPublics.label,
                      data: EVOLUTION_CATEGORIES.datasets.servicesPublics.data,
                      borderColor: EVOLUTION_CATEGORIES.datasets.servicesPublics.color,
                      borderWidth: 2,
                    },
                  ]}
                  yMin={0}
                  yMax={40}
                  yCallback={(v) => `${v}%`}
                />
              </div>
              <p className="text-xs text-text-muted/60 mt-3 text-right">Source : INSEE, DREES, FIPECO</p>
            </div>

            {/* Insight à droite */}
            <div className="bg-gradient-to-br from-accent-red/10 to-accent-red/5 border border-accent-red/20 rounded-2xl p-6 flex flex-col justify-center">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">📈</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">La protection sociale : moteur de la hausse</h3>
                  <p className="text-text-secondary">
                    En 44 ans, les dépenses de protection sociale sont passées de <span className="font-mono text-accent-red font-semibold">21,5%</span> à <span className="font-mono text-accent-red font-semibold">31,5%</span> du PIB,
                    soit <span className="font-semibold">+10 points</span>. C&apos;est l&apos;essentiel de la hausse des dépenses publiques.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-surface/50 rounded-lg p-4 text-center">
                  <div className="font-mono text-2xl font-bold text-accent-red">+10 pts</div>
                  <div className="text-sm text-text-muted mt-1">Protection sociale</div>
                  <div className="text-xs text-text-muted/60">Retraites, santé, famille</div>
                </div>
                <div className="bg-bg-surface/50 rounded-lg p-4 text-center">
                  <div className="font-mono text-2xl font-bold text-accent-green">+0,4 pt</div>
                  <div className="text-sm text-text-muted mt-1">Éducation</div>
                  <div className="text-xs text-text-muted/60">Stable depuis 40 ans</div>
                </div>
                <div className="bg-bg-surface/50 rounded-lg p-4 text-center">
                  <div className="font-mono text-2xl font-bold text-accent-electric">-1,7 pt</div>
                  <div className="text-sm text-text-muted mt-1">Défense</div>
                  <div className="text-xs text-text-muted/60">Dividende de la paix</div>
                </div>
                <div className="bg-bg-surface/50 rounded-lg p-4 text-center">
                  <div className="font-mono text-2xl font-bold text-accent-purple">+1,3 pt</div>
                  <div className="text-sm text-text-muted mt-1">Services publics</div>
                  <div className="text-xs text-text-muted/60">Administration, dette</div>
                </div>
              </div>
            </div>
          </div>

          {/* Répartition des dépenses - Pleine largeur */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-5 mb-6">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-semibold">Répartition par poste</h3>
                <p className="text-sm text-text-muted mt-1">
                  {showRawData ? 'En milliards d\'euros (2024)' : 'Sur 100 € d\'argent public'}
                </p>
              </div>
              <button
                onClick={() => setShowRawData(!showRawData)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-glass-border bg-bg-elevated hover:bg-bg-deep transition-colors"
              >
                {showRawData ? '💶 Voir sur 100€' : '📊 Voir en Md€'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {SPENDING_BREAKDOWN.map((item, index) => {
                const per100 = getPer100(item.amount)
                const maxValue = SPENDING_BREAKDOWN[0].amount
                return (
                  <div key={item.name} className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <div className="min-w-0 flex-1">
                        <span className={`text-sm block truncate ${index === 0 ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <div className="h-7 bg-bg-deep rounded-lg overflow-hidden">
                      <div
                        className={`h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3 ${index === 0 ? 'bg-gradient-to-r from-accent-red/80 to-accent-red' : ''}`}
                        style={{
                          width: `${(item.amount / maxValue) * 100}%`,
                          backgroundColor: index === 0 ? undefined : item.color,
                          minWidth: '50px'
                        }}
                      >
                        <span className="text-sm font-mono font-bold text-white drop-shadow-sm">
                          {showRawData ? `${item.amount}` : `${per100}€`}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-text-muted/60 mt-4 text-right">
              Sources : DREES, INSEE 2024
            </p>
          </div>

          {/* Titre section analytique */}
          <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
            Analyse <span className="italic text-accent-electric">structurelle</span>
          </h2>

          {/* Répartition par administration */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Qui dépense ?</h3>
            <p className="text-sm text-text-muted mb-5">Répartition des 1 670 Md€ par administration publique</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colonne gauche : les 3 chiffres */}
              <div className="flex flex-col gap-4">
                {REPARTITION_APU.map((item) => (
                  <div key={item.name} className="bg-bg-elevated rounded-xl p-5 border border-glass-border/50">
                    <div className="mb-3">
                      <span className="text-3xl font-mono font-bold" style={{ color: item.color }}>
                        {item.amount} Md€
                      </span>
                      <span className="text-lg font-mono text-text-secondary ml-2">{item.percent}%</span>
                    </div>
                    <h4 className="font-semibold text-text-primary mb-1">{item.name}</h4>
                    <p className="text-xs text-text-muted">{item.description}</p>
                  </div>
                ))}
              </div>
              {/* Colonne droite : explication */}
              <div className="bg-accent-purple/10 border border-accent-purple/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">💡</span>
                  <h4 className="font-semibold text-text-primary text-lg">Sécurité sociale ≠ Protection sociale</h4>
                </div>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Le budget de la Sécurité sociale (<span className="font-mono font-semibold text-accent-red">768 Md€</span>) ne couvre pas l&apos;ensemble de la protection sociale française (<span className="font-mono font-semibold text-accent-purple">932 Md€</span>).
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Certaines prestations sociales sont versées par d&apos;autres administrations :
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3 p-3 bg-bg-surface/50 rounded-lg">
                    <span className="text-xl">🏛️</span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Versé par l&apos;État</p>
                      <p className="text-xs text-text-muted">Pensions des fonctionnaires (~90 Md€), allocations aux adultes handicapés (AAH), bourses étudiantes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-bg-surface/50 rounded-lg">
                    <span className="text-xl">🏘️</span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Versé par les collectivités</p>
                      <p className="text-xs text-text-muted">RSA (~15 Md€), allocation personnalisée d&apos;autonomie (APA), aide sociale à l&apos;enfance</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-bg-surface/30 rounded-lg border border-accent-purple/20">
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold">Exemple :</span> Un professeur retraité touche sa pension de l&apos;État (pas de la Sécu), mais c&apos;est bien une prestation de protection sociale.
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-accent-purple/20 flex justify-between items-center">
                  <span className="text-sm text-text-muted font-semibold">Total protection sociale</span>
                  <span className="font-mono text-xl font-bold text-accent-purple">932 Md€</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-muted/60 mt-4 text-right">Source : INSEE 2024</p>
          </div>

          {/* Fonctionnement vs Investissement */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Fonctionnement vs Investissement</h3>
            <p className="text-sm text-text-muted mb-5">Comment sont utilisés les 1 670 Md€ ?</p>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-bg-elevated rounded-xl p-5 border-l-4" style={{ borderColor: FONCTIONNEMENT_INVESTISSEMENT.fonctionnement.color }}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-mono font-bold" style={{ color: FONCTIONNEMENT_INVESTISSEMENT.fonctionnement.color }}>
                    {FONCTIONNEMENT_INVESTISSEMENT.fonctionnement.percent}%
                  </span>
                  <span className="text-text-secondary font-mono">{FONCTIONNEMENT_INVESTISSEMENT.fonctionnement.amount} Md€</span>
                </div>
                <h4 className="font-semibold mb-2">{FONCTIONNEMENT_INVESTISSEMENT.fonctionnement.label}</h4>
                <p className="text-sm text-text-muted">Salaires, prestations sociales, achats courants, intérêts de la dette</p>
              </div>
              <div className="flex-1 bg-bg-elevated rounded-xl p-5 border-l-4" style={{ borderColor: FONCTIONNEMENT_INVESTISSEMENT.investissement.color }}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-mono font-bold" style={{ color: FONCTIONNEMENT_INVESTISSEMENT.investissement.color }}>
                    {FONCTIONNEMENT_INVESTISSEMENT.investissement.percent}%
                  </span>
                  <span className="text-text-secondary font-mono">{FONCTIONNEMENT_INVESTISSEMENT.investissement.amount} Md€</span>
                </div>
                <h4 className="font-semibold mb-2">{FONCTIONNEMENT_INVESTISSEMENT.investissement.label}</h4>
                <p className="text-sm text-text-muted">Infrastructures, équipements, bâtiments publics, recherche</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-accent-gold/10 border border-accent-gold/20 rounded-lg">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-accent-gold">Note :</span> Seulement 7,6% des dépenses publiques sont des investissements productifs durables.
              </p>
            </div>
            <p className="text-xs text-text-muted/60 mt-4 text-right">Source : INSEE 2024</p>
          </div>

          {/* Fonction publique */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2">La fonction publique</h3>
            <p className="text-sm text-text-muted mb-5">5,7 millions d&apos;agents au service du public</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-bg-elevated rounded-xl">
                <div className="text-2xl font-mono font-bold text-accent-electric">{FONCTION_PUBLIQUE.total}M</div>
                <div className="text-xs text-text-muted mt-1">Agents totaux</div>
              </div>
              <div className="text-center p-4 bg-bg-elevated rounded-xl">
                <div className="text-2xl font-mono font-bold text-accent-purple">{FONCTION_PUBLIQUE.fpe}M</div>
                <div className="text-xs text-text-muted mt-1">État</div>
              </div>
              <div className="text-center p-4 bg-bg-elevated rounded-xl">
                <div className="text-2xl font-mono font-bold text-accent-green">{FONCTION_PUBLIQUE.fpt}M</div>
                <div className="text-xs text-text-muted mt-1">Territoriale</div>
              </div>
              <div className="text-center p-4 bg-bg-elevated rounded-xl">
                <div className="text-2xl font-mono font-bold text-accent-red">{FONCTION_PUBLIQUE.fph}M</div>
                <div className="text-xs text-text-muted mt-1">Hospitalière</div>
              </div>
              <div className="text-center p-4 bg-bg-elevated rounded-xl border-2 border-accent-gold/30">
                <div className="text-2xl font-mono font-bold text-accent-gold">{FONCTION_PUBLIQUE.masseSalariale} Md€</div>
                <div className="text-xs text-text-muted mt-1">Masse salariale</div>
              </div>
              <div className="text-center p-4 bg-bg-elevated rounded-xl border-2 border-accent-electric/30">
                <div className="text-2xl font-mono font-bold text-accent-electric">14,7%</div>
                <div className="text-xs text-text-muted mt-1">Part des dépenses</div>
              </div>
            </div>
            <p className="text-xs text-text-muted/60 mt-4 text-right">Source : DGAFP 2024</p>
          </div>
        </>
      )}

      {/* ============================================ */}
      {/* TAB COMPARAISON */}
      {/* ============================================ */}
      {activeTab === 'comparaison' && (
        <>
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-accent-electric/10 to-accent-gold/5 border border-accent-electric/20 rounded-2xl p-6 mb-8 flex flex-col lg:flex-row gap-6 items-center">
            <div className="text-5xl">📊</div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-xl font-semibold mb-2">La France, championne des dépenses publiques</h3>
              <p className="text-text-secondary">
                Avec 57,1% du PIB consacré aux dépenses publiques, la France se place en tête des pays développés.
                Ce niveau élevé finance notamment un système de protection sociale très développé.
              </p>
            </div>
            <div className="text-center">
              <div className="font-mono text-4xl font-medium text-accent-electric">57.1%</div>
              <div className="text-text-muted text-sm">du PIB (2024)</div>
            </div>
          </div>

          {/* Section 1: Dépenses totales */}
          <h2 className="font-serif text-2xl font-normal mb-6">
            La France, <span className="italic text-accent-electric">2ème</span> pays le plus dépensier de l&apos;OCDE
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <ChartWrapper
              title="Dépenses publiques en % du PIB"
              subtitle="Comparaison OCDE 2024"
              height="400px"
              source="OCDE 2024"
            >
              <BarChart
                labels={OECD_SPENDING_PIB.map((c) => c.country)}
                data={OECD_SPENDING_PIB.map((c) => c.value)}
                colors={(ctx) =>
                  OECD_SPENDING_PIB[ctx.dataIndex]?.highlight ? '#00d4ff' :
                  OECD_SPENDING_PIB[ctx.dataIndex]?.isAverage ? '#ffd700' : '#2a3a4a'
                }
                tooltipSuffix="% du PIB"
                yAxisSuffix="%"
                yMin={0}
                yMax={70}
                showValues
              />
            </ChartWrapper>

            {/* Écart France vs UE à droite */}
            <div className="bg-gradient-to-br from-accent-gold/10 to-accent-gold/5 border border-accent-gold/30 rounded-2xl p-6 flex flex-col justify-center">
              <div className="text-center mb-6">
                <p className="text-text-muted text-xl font-semibold mb-3">Écart France vs moyenne UE</p>
                <div className="font-mono text-8xl font-bold text-accent-gold">{ECART_FRANCE_UE.ecartPoints}</div>
                <p className="text-text-secondary text-2xl">points de PIB</p>
              </div>

              <div className="flex justify-center items-center gap-6 mb-6 p-5 bg-bg-surface/50 rounded-xl">
                <div className="text-center">
                  <p className="text-3xl mb-1">🇫🇷</p>
                  <p className="font-mono text-3xl font-bold text-accent-electric">{ECART_FRANCE_UE.francePIB}%</p>
                  <p className="text-sm text-text-muted">France</p>
                </div>
                <div className="text-4xl text-text-muted">vs</div>
                <div className="text-center">
                  <p className="text-3xl mb-1">🇪🇺</p>
                  <p className="font-mono text-3xl font-bold text-text-secondary">{ECART_FRANCE_UE.moyenneUE}%</p>
                  <p className="text-sm text-text-muted">Moyenne UE</p>
                </div>
              </div>

              <div className="text-center p-5 bg-bg-surface/30 rounded-xl border border-accent-gold/20">
                <p className="text-text-muted text-base mb-1">Cet écart représente</p>
                <p className="font-mono text-5xl font-bold text-accent-gold">{ECART_FRANCE_UE.ecartMilliards} Md€</p>
                <p className="text-text-secondary text-base mt-1">par an de dépenses supplémentaires</p>
              </div>
            </div>
          </div>

          {/* Section 2: Structure des dépenses comparée */}
          <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
            Comment chaque pays <span className="italic text-accent-purple">alloue</span> ses dépenses ?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Gauche : Barres verticales empilées */}
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Structure des dépenses par pays</h3>
              <p className="text-sm text-text-muted mb-4">Ventilation en % du PIB</p>

              {/* Légende */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {STRUCTURE_DEPENSES.categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-text-secondary">{cat.label}</span>
                  </div>
                ))}
              </div>

              {/* Barres verticales empilées */}
              <div className="flex justify-around items-end h-52 border-b border-glass-border pb-2">
                {STRUCTURE_DEPENSES.pays.map((pays) => {
                  const maxTotal = 60 // Max fixe pour échelle cohérente
                  const barHeight = (pays.total / maxTotal) * 200 // 200px max
                  return (
                    <div key={pays.country} className="flex flex-col items-center group relative">
                      {/* Barre empilée verticale */}
                      <div
                        className={`w-10 md:w-12 flex flex-col rounded-t overflow-hidden ${pays.highlight ? 'ring-2 ring-accent-electric' : ''}`}
                        style={{ height: `${barHeight}px` }}
                      >
                        {[...STRUCTURE_DEPENSES.categories].reverse().map((cat) => {
                          const value = pays.data[cat.id as keyof typeof pays.data]
                          const segmentHeight = (value / pays.total) * 100
                          return (
                            <div
                              key={cat.id}
                              className="w-full cursor-pointer transition-all hover:brightness-125 relative group/segment"
                              style={{
                                backgroundColor: cat.color,
                                height: `${segmentHeight}%`,
                                minHeight: value > 0 ? '4px' : '0',
                              }}
                            >
                              {/* Tooltip au survol - juste le chiffre */}
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover/segment:opacity-100 transition-opacity z-20 pointer-events-none">
                                <div className="bg-bg-elevated border border-glass-border rounded px-2 py-1 shadow-lg">
                                  <span className="text-sm font-mono font-bold text-white">{value}%</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Labels pays */}
              <div className="flex justify-around mt-2">
                {STRUCTURE_DEPENSES.pays.map((pays) => (
                  <div key={pays.country} className="flex flex-col items-center w-12">
                    <span className="font-mono text-xs font-semibold text-text-primary">{pays.total}%</span>
                    <span className={`text-[9px] text-center ${pays.highlight ? 'text-accent-electric font-semibold' : 'text-text-muted'}`}>
                      {pays.country.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-text-muted/60 mt-4 text-center">Source : Eurostat COFOG 2024</p>
            </div>

            {/* Droite : Focus Protection sociale (trié du + grand au + petit) */}
            {(() => {
              const paysSorted = [...STRUCTURE_DEPENSES.pays].sort((a, b) => b.data.protection - a.data.protection)
              return (
                <ChartWrapper
                  title="🛡️ Protection sociale en % du PIB"
                  subtitle="Premier poste de dépenses publiques"
                  source="Eurostat 2024"
                >
                  <BarChart
                    labels={paysSorted.map(p => p.country)}
                    data={paysSorted.map(p => p.data.protection)}
                    colors={(ctx) => {
                      const country = paysSorted[ctx.dataIndex]
                      return country.highlight ? '#ff6b6b' : '#64748b'
                    }}
                    tooltipSuffix="% du PIB"
                    yAxisSuffix="%"
                    yMin={0}
                    yMax={30}
                    showValues={true}
                  />
                </ChartWrapper>
              )
            })()}
          </div>

          {/* Section 5: Focus sur la protection sociale */}
          <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
            Qu&apos;est-ce que la <span className="italic text-accent-gold">protection sociale</span> ?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Gauche : Décomposition de la protection sociale en France */}
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Décomposition en France</h3>
              <p className="text-sm text-text-muted mb-4">{PROTECTION_SOCIALE_FRANCE.total} Md€ de prestations sociales</p>

              <div className="space-y-3">
                {PROTECTION_SOCIALE_FRANCE.categories.map((cat) => (
                  <div key={cat.id} className="group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-text-primary font-medium">{cat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold" style={{ color: cat.color }}>{cat.amount} Md€</span>
                        <span className="text-xs text-text-muted">({cat.percent}%)</span>
                      </div>
                    </div>
                    <div className="h-6 bg-bg-elevated rounded overflow-hidden relative">
                      <div
                        className="h-full rounded transition-all group-hover:brightness-110"
                        style={{
                          backgroundColor: cat.color,
                          width: `${cat.percent}%`,
                        }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">
                        {cat.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-text-muted/60 mt-4 text-center">Source : DREES 2024</p>
            </div>

            {/* Droite : Part des retraites dans la protection sociale */}
            <ChartWrapper
              title="👴 Part des retraites dans la protection sociale"
              subtitle="Les retraites représentent près de la moitié"
              source="Eurostat 2024"
            >
              <BarChart
                labels={RETRAITES_COMPARAISON.map(p => p.country)}
                data={RETRAITES_COMPARAISON.map(p => p.percent)}
                colors={(ctx) => {
                  const country = RETRAITES_COMPARAISON[ctx.dataIndex]
                  return country.highlight ? '#ff9f43' : '#64748b'
                }}
                tooltipSuffix="%"
                yAxisSuffix="%"
                yMin={0}
                yMax={60}
                showValues={true}
              />
            </ChartWrapper>
          </div>

        </>
      )}
    </main>
  )
}

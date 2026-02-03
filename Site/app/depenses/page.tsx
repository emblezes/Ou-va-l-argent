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
  ratio: 57.2,
  population: 68, // millions
  perCapita: 24560, // €/habitant/an
}

// Source: INSEE 2024 - Répartition par administration publique
const REPARTITION_APU = [
  { name: 'État (APUC)', amount: 740, percent: 44.3, color: '#00d4ff', description: 'Administrations publiques centrales' },
  { name: 'Sécurité sociale (ASSO)', amount: 601, percent: 36.0, color: '#ff6b6b', description: 'Régimes de protection sociale' },
  { name: 'Collectivités (APUL)', amount: 330, percent: 19.7, color: '#00ff88', description: 'Régions, départements, communes' },
]

// Source: INSEE, FIPECO - Évolution historique longue
const EVOLUTION_HISTORIQUE = {
  labels: ['1960', '1970', '1980', '1990', '2000', '2010', '2020', '2024'],
  ratio: [35.0, 38.5, 46.2, 49.5, 51.6, 56.4, 61.3, 57.2],
  events: [
    { year: '1975', label: 'Choc pétrolier', value: 46.2 },
    { year: '1984', label: 'Pic croissance', value: 54.2 },
    { year: '2009', label: 'Crise financière', value: 56.8 },
    { year: '2020', label: 'COVID-19', value: 61.3 },
  ],
}

// Source: INSEE 2024 - Fonctionnement vs Investissement
const FONCTIONNEMENT_INVESTISSEMENT = {
  fonctionnement: { amount: 1544, percent: 92.4, label: 'Fonctionnement', color: '#ff9f43' },
  investissement: { amount: 126, percent: 7.6, label: 'Investissement (FBCF)', color: '#00d4ff' },
}

// Source: INSEE, DGAFP 2024 - Fonction publique
const FONCTION_PUBLIQUE = {
  total: 5.75, // millions
  fpe: 2.35, // État
  fpt: 1.97, // Territoriale
  fph: 1.43, // Hospitalière
  masseSalariale: 245, // Md€
}

// Source: INSEE - Comptes des administrations publiques (base 2020)
const EVOLUTION_DATA = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  total: [1242, 1257, 1291, 1314, 1349, 1434, 1473, 1549, 1607, 1670],
  recettes: [1171, 1196, 1244, 1292, 1313, 1256, 1371, 1423, 1456, 1502],
}

// Répartition détaillée (source: COR 2024 pour retraites, INSEE COFOG pour le reste)
// Total dépenses APU 2024 : 1 670 Md€
// Trié du plus grand au plus petit
const TOTAL_DEPENSES = 1670
const SPENDING_BREAKDOWN = [
  { id: 'retraites', name: 'Retraites', detail: 'tous régimes base + complémentaires', amount: 380, color: '#ff6b6b', icon: '👴' },
  { id: 'sante', name: 'Santé', amount: 220, color: '#a855f7', icon: '🏥' },
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
  { country: 'France', value: 57.2, highlight: true },
  { country: 'Belgique', value: 54.6 },
  { country: 'Finlande', value: 54.2 },
  { country: 'Italie', value: 53.7 },
  { country: 'Autriche', value: 52.3 },
  { country: 'Grèce', value: 51.8 },
  { country: 'Allemagne', value: 49.5 },
  { country: 'Espagne', value: 47.3 },
  { country: 'Pays-Bas', value: 44.5 },
  { country: 'Irlande', value: 27.1 },
]

// Source: OCDE 2024 - Dépenses publiques en % du PIB
const OECD_SPENDING_PIB = [
  { country: 'France', value: 57.2, highlight: true },
  { country: 'Italie', value: 53.7 },
  { country: 'Japon', value: 44.3 },
  { country: 'Royaume-Uni', value: 44.8 },
  { country: 'Canada', value: 43.1 },
  { country: 'États-Unis', value: 38.1 },
  { country: 'Australie', value: 37.8 },
  { country: 'Suisse', value: 34.2 },
  { country: 'Corée du Sud', value: 28.3 },
]

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
  france: [56.8, 56.6, 56.5, 55.6, 55.4, 61.3, 59.0, 58.4, 57.3, 57.2],
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
  france: [51.6, 53.3, 56.4, 56.8, 61.3, 57.2],
  allemagne: [44.5, 46.2, 47.3, 43.5, 50.9, 49.5],
  ecart: [7.1, 7.1, 9.1, 13.3, 10.4, 7.7], // écart France - Allemagne
}

// Source: Eurostat 2024 - Déficits publics comparés (% PIB)
const DEFICIT_COMPARISON = [
  { country: 'Italie', value: -7.2, color: '#2a3a4a' },
  { country: 'France', value: -5.5, highlight: true, color: '#00d4ff' },
  { country: 'Belgique', value: -4.4, color: '#2a3a4a' },
  { country: 'Espagne', value: -3.6, color: '#2a3a4a' },
  { country: 'Pologne', value: -3.5, color: '#2a3a4a' },
  { country: 'Pays-Bas', value: -0.3, color: '#2a3a4a' },
  { country: 'Allemagne', value: -2.1, color: '#2a3a4a' },
  { country: 'Suède', value: +0.6, color: '#00ff88' },
  { country: 'Irlande', value: +1.7, color: '#00ff88' },
]

// Source: Eurostat, Eurobarometer 2024 - Paradoxe satisfaction
const SATISFACTION_DATA = [
  { country: 'Danemark', depense: 50.1, satisfaction: 7.5 },
  { country: 'Finlande', depense: 54.2, satisfaction: 7.4 },
  { country: 'Pays-Bas', depense: 44.5, satisfaction: 7.3 },
  { country: 'Suède', depense: 49.3, satisfaction: 7.2 },
  { country: 'Allemagne', depense: 49.5, satisfaction: 7.0 },
  { country: 'France', depense: 57.2, satisfaction: 6.4, highlight: true },
  { country: 'Espagne', depense: 47.3, satisfaction: 6.3 },
  { country: 'Italie', depense: 53.7, satisfaction: 6.0 },
]

// Source: FMI, OCDE 2024 - Dette publique comparée (% PIB)
const DETTE_COMPARISON = [
  { country: 'Japon', value: 255 },
  { country: 'Italie', value: 137 },
  { country: 'France', value: 112, highlight: true },
  { country: 'Espagne', value: 107 },
  { country: 'Belgique', value: 105 },
  { country: 'Royaume-Uni', value: 101 },
  { country: 'États-Unis', value: 123 },
  { country: 'Allemagne', value: 63 },
  { country: 'Pays-Bas', value: 46 },
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

      {/* Focus Retraite Link */}
      <div className="flex justify-center mb-10">
        <Link
          href="/depenses/retraites"
          className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 bg-gradient-to-r from-accent-red/20 to-accent-red/10 border border-accent-red/30 text-text-primary hover:border-accent-red/50 flex items-center gap-3"
        >
          <span className="text-2xl">👴</span>
          <div className="text-left">
            <div className="font-semibold">Focus Retraites</div>
            <div className="text-xs text-text-muted">380 Md€ • 1er poste de dépenses</div>
          </div>
          <span className="text-text-muted ml-2">→</span>
        </Link>
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

          {/* Répartition par administration */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2">Qui dépense ?</h3>
            <p className="text-sm text-text-muted mb-5">Répartition des 1 670 Md€ par administration publique</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REPARTITION_APU.map((item) => (
                <div key={item.name} className="bg-bg-elevated rounded-xl p-4 border border-glass-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-mono font-bold" style={{ color: item.color }}>
                      {item.percent}%
                    </span>
                    <span className="font-mono text-text-secondary">{item.amount} Md€</span>
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">{item.name}</h4>
                  <p className="text-xs text-text-muted">{item.description}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted/60 mt-4 text-right">Source : INSEE 2024</p>
          </div>

          {/* Fonctionnement vs Investissement */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
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
            <p className="text-xs text-text-muted/60 mt-4 text-right">Source : INSEE - FBCF des APU 2024</p>
          </div>

          {/* Fonction publique */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2">La fonction publique</h3>
            <p className="text-sm text-text-muted mb-5">5,75 millions d&apos;agents au service du public</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-4 bg-bg-elevated rounded-xl">
                <div className="text-2xl font-mono font-bold text-accent-electric">{FONCTION_PUBLIQUE.total}M</div>
                <div className="text-xs text-text-muted mt-1">Agents totaux</div>
              </div>
              <div className="text-center p-4 bg-bg-elevated rounded-xl">
                <div className="text-2xl font-mono font-bold text-accent-purple">{FONCTION_PUBLIQUE.fpe}M</div>
                <div className="text-xs text-text-muted mt-1">État (FPE)</div>
              </div>
              <div className="text-center p-4 bg-bg-elevated rounded-xl">
                <div className="text-2xl font-mono font-bold text-accent-green">{FONCTION_PUBLIQUE.fpt}M</div>
                <div className="text-xs text-text-muted mt-1">Territoriale (FPT)</div>
              </div>
              <div className="text-center p-4 bg-bg-elevated rounded-xl">
                <div className="text-2xl font-mono font-bold text-accent-red">{FONCTION_PUBLIQUE.fph}M</div>
                <div className="text-xs text-text-muted mt-1">Hospitalière (FPH)</div>
              </div>
            </div>
            <div className="p-3 bg-bg-elevated rounded-lg">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold">Masse salariale :</span> {FONCTION_PUBLIQUE.masseSalariale} Md€/an, soit <span className="font-mono text-accent-electric">14,7%</span> des dépenses publiques
              </p>
            </div>
            <p className="text-xs text-text-muted/60 mt-4 text-right">Source : DGAFP 2024</p>
          </div>

          {/* Graphiques côte à côte : Évolution récente + Évolution longue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Évolution des dépenses (2015-2024) */}
            <ChartWrapper
              title="Évolution des dépenses"
              subtitle="En milliards d'euros, 2015-2024"
              height="350px"
              source="INSEE - Comptes des APU"
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

              <div className="flex-1 min-h-[200px]">
                <ChartWrapper title="" subtitle="" height="200px" source="">
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
              </div>

              <div className="grid grid-cols-4 gap-2 mt-3">
                {EVOLUTION_HISTORIQUE.events.map((event) => (
                  <div key={event.year} className="bg-bg-elevated rounded-lg p-2 text-center">
                    <div className="text-[10px] text-text-muted">{event.year}</div>
                    <div className="font-mono text-sm font-bold text-accent-gold">{event.value}%</div>
                    <div className="text-[10px] text-text-secondary leading-tight">{event.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-2 bg-accent-gold/10 border border-accent-gold/20 rounded-lg">
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-accent-gold">+22 pts en 60 ans</span> — de 35% (1960) à 57% (2024)
                </p>
              </div>
              <p className="text-xs text-text-muted/60 mt-2 text-right">Source : INSEE, FIPECO</p>
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
              Sources : DREES (retraites), INSEE COFOG 2024
            </p>
          </div>

          {/* Sources */}
          <div className="text-center py-6 border-t border-glass-border">
            <p className="text-text-muted text-sm">
              Sources : INSEE - Comptes des administrations publiques, DREES, FIPECO, PLF 2025
            </p>
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
                Avec 57,2% du PIB consacré aux dépenses publiques, la France se place en tête des pays développés.
                Ce niveau élevé finance notamment un système de protection sociale très développé.
              </p>
            </div>
            <div className="text-center">
              <div className="font-mono text-4xl font-medium text-accent-electric">57.2%</div>
              <div className="text-text-muted text-sm">du PIB (2024)</div>
            </div>
          </div>

          {/* Section 1: Dépenses totales */}
          <h2 className="font-serif text-2xl font-normal mb-6">
            Dépenses publiques <span className="italic text-accent-electric">totales</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <ChartWrapper
              title="Union Européenne"
              subtitle="Dépenses publiques en % du PIB (2024)"
              height="350px"
              source="Eurostat 2024"
            >
              <BarChart
                labels={EU_SPENDING_PIB.map((c) => c.country)}
                data={EU_SPENDING_PIB.map((c) => c.value)}
                colors={(ctx) =>
                  EU_SPENDING_PIB[ctx.dataIndex]?.highlight ? '#00d4ff' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>

            <ChartWrapper
              title="OCDE"
              subtitle="Dépenses publiques en % du PIB (2024)"
              height="350px"
              source="OCDE 2024"
            >
              <BarChart
                labels={OECD_SPENDING_PIB.map((c) => c.country)}
                data={OECD_SPENDING_PIB.map((c) => c.value)}
                colors={(ctx) =>
                  OECD_SPENDING_PIB[ctx.dataIndex]?.highlight ? '#00d4ff' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>
          </div>

          {/* Section 2: Évolution comparée */}
          <ChartWrapper
            title="Évolution comparée des dépenses publiques"
            subtitle="En % du PIB, 2015-2024"
            height="350px"
            className="mb-10"
            source="Eurostat 2024"
          >
            <LineChart
              labels={EVOLUTION_COMPARISON.labels}
              datasets={[
                {
                  label: 'France',
                  data: EVOLUTION_COMPARISON.france,
                  borderColor: '#00d4ff',
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  fill: false,
                  borderWidth: 3,
                },
                {
                  label: 'Allemagne',
                  data: EVOLUTION_COMPARISON.allemagne,
                  borderColor: '#ffd700',
                  borderWidth: 2,
                },
                {
                  label: 'Italie',
                  data: EVOLUTION_COMPARISON.italie,
                  borderColor: '#00ff88',
                  borderWidth: 2,
                },
                {
                  label: 'Espagne',
                  data: EVOLUTION_COMPARISON.espagne,
                  borderColor: '#ff9f43',
                  borderWidth: 2,
                },
              ]}
              yMin={40}
              yMax={65}
              yCallback={(v) => `${v}%`}
            />
          </ChartWrapper>

          {/* Section 2b: Divergence France-Allemagne */}
          <h2 className="font-serif text-2xl font-normal mb-6">
            Le <span className="italic text-accent-gold">décrochage</span> France-Allemagne
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <ChartWrapper
              title="Écart des dépenses publiques"
              subtitle="France vs Allemagne (% PIB, 2000-2024)"
              height="350px"
              source="Eurostat, OCDE 2024"
            >
              <LineChart
                labels={DIVERGENCE_FR_DE.labels}
                datasets={[
                  {
                    label: 'France',
                    data: DIVERGENCE_FR_DE.france,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    borderWidth: 3,
                  },
                  {
                    label: 'Allemagne',
                    data: DIVERGENCE_FR_DE.allemagne,
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    fill: true,
                    borderWidth: 3,
                  },
                ]}
                yMin={40}
                yMax={65}
                yCallback={(v) => `${v}%`}
              />
            </ChartWrapper>

            <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Analyse de la divergence</h3>
              <div className="space-y-4">
                <div className="p-4 bg-bg-elevated rounded-lg border-l-4 border-accent-gold">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-mono font-bold text-accent-gold">+7,7 pts</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Écart actuel France-Allemagne. En 2015, l&apos;écart était de 13,3 pts après les réformes Schröder.
                  </p>
                </div>
                <div className="p-3 bg-bg-elevated rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong className="text-accent-electric">2003-2005 :</strong> L&apos;Allemagne lance l&apos;Agenda 2010 (réformes Hartz). La France maintient sa trajectoire.
                  </p>
                </div>
                <div className="p-3 bg-bg-elevated rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong className="text-accent-green">Résultat allemand :</strong> Excédents budgétaires de 2014 à 2019, dette réduite de 81% à 59% du PIB.
                  </p>
                </div>
                <div className="p-3 bg-bg-elevated rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong className="text-accent-red">Résultat français :</strong> Déficits continus depuis 1974 (50 ans), dette passée de 65% à 112% du PIB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2c: Déficits comparés */}
          <h2 className="font-serif text-2xl font-normal mb-6">
            Déficits <span className="italic text-accent-red">publics</span> en Europe
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <ChartWrapper
              title="Solde budgétaire 2024"
              subtitle="En % du PIB (négatif = déficit)"
              height="350px"
              source="Eurostat 2024"
            >
              <BarChart
                labels={DEFICIT_COMPARISON.map((c) => c.country)}
                data={DEFICIT_COMPARISON.map((c) => c.value)}
                colors={(ctx) =>
                  DEFICIT_COMPARISON[ctx.dataIndex]?.highlight ? '#00d4ff' :
                  DEFICIT_COMPARISON[ctx.dataIndex]?.value > 0 ? '#00ff88' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>

            <ChartWrapper
              title="Dette publique 2024"
              subtitle="En % du PIB"
              height="350px"
              source="FMI, OCDE 2024"
            >
              <BarChart
                labels={DETTE_COMPARISON.map((c) => c.country)}
                data={DETTE_COMPARISON.map((c) => c.value)}
                colors={(ctx) =>
                  DETTE_COMPARISON[ctx.dataIndex]?.highlight ? '#00d4ff' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>
          </div>

          {/* Alerte déficit */}
          <div className="bg-gradient-to-r from-accent-red/15 to-accent-red/5 border border-accent-red/30 rounded-2xl p-6 mb-10">
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent-red">Procédure de déficit excessif</h3>
                <p className="text-text-secondary mb-3">
                  La France est sous le coup d&apos;une procédure européenne pour déficit excessif depuis 2024.
                  Le déficit de 5,5% du PIB dépasse largement la limite de 3% du Pacte de stabilité.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                    <div className="font-mono text-xl font-bold text-accent-red">-169 Md€</div>
                    <div className="text-xs text-text-muted">Déficit 2024</div>
                  </div>
                  <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                    <div className="font-mono text-xl font-bold text-accent-gold">50 ans</div>
                    <div className="text-xs text-text-muted">Sans excédent</div>
                  </div>
                  <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                    <div className="font-mono text-xl font-bold text-accent-electric">112%</div>
                    <div className="text-xs text-text-muted">Dette / PIB</div>
                  </div>
                  <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                    <div className="font-mono text-xl font-bold text-accent-purple">54 Md€</div>
                    <div className="text-xs text-text-muted">Intérêts / an</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2d: Paradoxe satisfaction */}
          <h2 className="font-serif text-2xl font-normal mb-6">
            Le <span className="italic text-accent-purple">paradoxe</span> de la satisfaction
          </h2>

          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🤔</span>
              <div>
                <h3 className="text-lg font-semibold">Dépenser plus = plus satisfait ?</h3>
                <p className="text-sm text-text-muted">Satisfaction des services publics vs dépenses (Eurobarometer 2024)</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {SATISFACTION_DATA.map((item) => (
                <div key={item.country} className={`flex items-center gap-3 p-3 rounded-lg ${item.highlight ? 'bg-accent-purple/10 border border-accent-purple/30' : 'bg-bg-elevated'}`}>
                  <span className={`font-medium w-24 ${item.highlight ? 'text-accent-purple' : 'text-text-primary'}`}>
                    {item.country}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-muted">{item.depense}% PIB</span>
                      <span className="font-mono text-accent-gold">{item.satisfaction}/10</span>
                    </div>
                    <div className="h-2 bg-bg-deep rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.satisfaction / 10) * 100}%`,
                          backgroundColor: item.satisfaction >= 7.2 ? '#00ff88' : item.satisfaction >= 6.5 ? '#ffd700' : '#ff6b6b'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-accent-purple/10 border border-accent-purple/20 rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong className="text-accent-purple">Constat :</strong> La France dépense 57,2% du PIB (record) mais obtient seulement 6,4/10 en satisfaction.
                Le Danemark dépense 7 pts de moins (50,1%) et obtient 7,5/10. Le problème n&apos;est pas le niveau de dépense, mais l&apos;efficacité.
              </p>
            </div>
          </div>

          {/* Section 3: Par domaine */}
          <h2 className="font-serif text-2xl font-normal mb-6">
            Comparaison par <span className="italic text-accent-gold">domaine</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartWrapper
              title="Protection sociale"
              subtitle="Dépenses en % du PIB (2024)"
              height="300px"
              source="Eurostat 2024"
            >
              <BarChart
                labels={EU_SOCIAL_SPENDING.map((c) => c.country)}
                data={EU_SOCIAL_SPENDING.map((c) => c.value)}
                colors={(ctx) =>
                  EU_SOCIAL_SPENDING[ctx.dataIndex]?.highlight ? '#ff6b6b' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>

            <ChartWrapper
              title="Éducation"
              subtitle="Dépenses en % du PIB (2024)"
              height="300px"
              source="Eurostat 2024"
            >
              <BarChart
                labels={EU_EDUCATION_SPENDING.map((c) => c.country)}
                data={EU_EDUCATION_SPENDING.map((c) => c.value)}
                colors={(ctx) =>
                  EU_EDUCATION_SPENDING[ctx.dataIndex]?.highlight ? '#4ecdc4' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartWrapper
              title="Santé"
              subtitle="Dépenses totales en % du PIB (2024)"
              height="300px"
              source="OCDE, Eurostat 2024"
            >
              <BarChart
                labels={HEALTH_SPENDING.map((c) => c.country)}
                data={HEALTH_SPENDING.map((c) => c.value)}
                colors={(ctx) =>
                  HEALTH_SPENDING[ctx.dataIndex]?.highlight ? '#a855f7' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>

            <ChartWrapper
              title="Défense"
              subtitle="Dépenses en % du PIB (2024)"
              height="300px"
              source="OTAN, Eurostat 2024"
            >
              <BarChart
                labels={DEFENSE_SPENDING.map((c) => c.country)}
                data={DEFENSE_SPENDING.map((c) => c.value)}
                colors={(ctx) =>
                  DEFENSE_SPENDING[ctx.dataIndex]?.highlight ? '#45b7d1' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>
          </div>

          {/* Insights */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">📌 Points clés de la comparaison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3 items-start">
                <span className="text-accent-electric text-xl">1.</span>
                <p className="text-text-secondary text-sm">
                  <strong className="text-text-primary">Leader européen :</strong> La France dépense 7,7 points de PIB de plus que l&apos;Allemagne en dépenses publiques.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-accent-electric text-xl">2.</span>
                <p className="text-text-secondary text-sm">
                  <strong className="text-text-primary">Protection sociale :</strong> N°1 mondial avec 31,5% du PIB, contre 27% en Allemagne.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-accent-electric text-xl">3.</span>
                <p className="text-text-secondary text-sm">
                  <strong className="text-text-primary">Santé :</strong> 3ème rang mondial avec 12,1% du PIB, derrière les USA (16,6%) et l&apos;Allemagne (12,7%).
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-accent-electric text-xl">4.</span>
                <p className="text-text-secondary text-sm">
                  <strong className="text-text-primary">Défense :</strong> 2,1% du PIB, au-dessus du seuil OTAN de 2%, mais en dessous des USA (3,4%).
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Taille de la fonction publique */}
          <h2 className="font-serif text-2xl font-normal mb-6">
            Taille de la <span className="italic text-accent-purple">fonction publique</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartWrapper
              title="Fonctionnaires pour 1 000 habitants"
              subtitle="Emploi public comparé (2024)"
              height="350px"
              source="OCDE, DGAFP 2024"
            >
              <BarChart
                labels={FONCTIONNAIRES_COMPARISON.map((c) => c.country)}
                data={FONCTIONNAIRES_COMPARISON.map((c) => c.value)}
                colors={(ctx) =>
                  FONCTIONNAIRES_COMPARISON[ctx.dataIndex]?.highlight ? '#00d4ff' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix=" / 1000 hab."
              />
            </ChartWrapper>

            <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">💡 Ce que révèlent ces chiffres</h3>
              <div className="space-y-4">
                <div className="p-3 bg-bg-elevated rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong className="text-accent-electric">88 fonctionnaires / 1000 hab.</strong> — La France est loin d&apos;être le pays avec le plus de fonctionnaires. Les pays nordiques (Norvège, Danemark, Suède) ont presque 2x plus d&apos;agents publics.
                  </p>
                </div>
                <div className="p-3 bg-bg-elevated rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong className="text-accent-green">Baisse relative :</strong> Entre 2007 et 2021, la France a réduit son emploi public de 1,22 point (4ème plus forte réduction OCDE).
                  </p>
                </div>
                <div className="p-3 bg-bg-elevated rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong className="text-accent-gold">Modèle différent :</strong> Les pays nordiques ont plus de fonctionnaires mais moins de dépenses sociales directes (prestations). La France cumule les deux.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Efficacité des dépenses */}
          <h2 className="font-serif text-2xl font-normal mb-6">
            Efficacité des <span className="italic text-accent-green">dépenses</span>
          </h2>

          <p className="text-text-secondary mb-6 max-w-3xl">
            Dépenser plus ne signifie pas toujours obtenir de meilleurs résultats. Comparons les dépenses avec les résultats obtenus.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Efficacité Éducation */}
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎓</span>
                <div>
                  <h3 className="text-lg font-semibold">Éducation : dépenses vs PISA</h3>
                  <p className="text-sm text-text-muted">Score PISA math (2022) vs % PIB éducation</p>
                </div>
              </div>

              <div className="space-y-3">
                {EFFICACITE_EDUCATION.slice(0, 6).map((item) => (
                  <div key={item.country} className={`flex items-center gap-3 p-2 rounded-lg ${item.highlight ? 'bg-accent-electric/10 border border-accent-electric/30' : 'bg-bg-elevated'}`}>
                    <span className={`font-medium w-24 ${item.highlight ? 'text-accent-electric' : 'text-text-primary'}`}>
                      {item.country}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-muted">{item.depense}% PIB</span>
                        <span className="font-mono text-accent-gold">{item.pisa} pts</span>
                      </div>
                      <div className="h-2 bg-bg-deep rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.efficiency}%`,
                            backgroundColor: item.efficiency >= 95 ? '#00ff88' : item.efficiency >= 85 ? '#ffd700' : '#ff6b6b'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg">
                <p className="text-sm text-text-secondary">
                  <strong className="text-accent-red">Constat :</strong> La France dépense 5,5% du PIB mais obtient un score PISA de 474 (moyenne). L&apos;Estonie dépense moins (5,1%) et obtient 510 pts.
                </p>
              </div>
              <p className="text-xs text-text-muted/60 mt-3 text-right">Source : OCDE PISA 2022, Eurostat</p>
            </div>

            {/* Efficacité Santé */}
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏥</span>
                <div>
                  <h3 className="text-lg font-semibold">Santé : dépenses vs espérance de vie</h3>
                  <p className="text-sm text-text-muted">Espérance de vie (ans) vs % PIB santé</p>
                </div>
              </div>

              <div className="space-y-3">
                {EFFICACITE_SANTE.map((item) => (
                  <div key={item.country} className={`flex items-center gap-3 p-2 rounded-lg ${item.highlight ? 'bg-accent-purple/10 border border-accent-purple/30' : 'bg-bg-elevated'}`}>
                    <span className={`font-medium w-24 ${item.highlight ? 'text-accent-purple' : 'text-text-primary'}`}>
                      {item.country}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-muted">{item.depense}% PIB</span>
                        <span className="font-mono text-accent-green">{item.esperance} ans</span>
                      </div>
                      <div className="h-2 bg-bg-deep rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.efficiency}%`,
                            backgroundColor: item.efficiency >= 95 ? '#00ff88' : item.efficiency >= 80 ? '#ffd700' : '#ff6b6b'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-accent-green/10 border border-accent-green/20 rounded-lg">
                <p className="text-sm text-text-secondary">
                  <strong className="text-accent-green">Constat :</strong> La France obtient de bons résultats en santé (82,9 ans). Les USA dépensent 37% de plus (16,6% PIB) pour 5 ans d&apos;espérance de vie en moins.
                </p>
              </div>
              <p className="text-xs text-text-muted/60 mt-3 text-right">Source : OCDE 2024</p>
            </div>
          </div>

          {/* Synthèse efficacité */}
          <div className="bg-gradient-to-r from-accent-green/10 to-accent-red/10 border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">🎯 Synthèse : où la France est efficace ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-surface/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <h4 className="font-semibold text-accent-green">Efficace</h4>
                </div>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• <strong>Santé :</strong> Espérance de vie élevée, reste à charge faible</li>
                  <li>• <strong>Infrastructures :</strong> Réseau routier et ferroviaire de qualité</li>
                  <li>• <strong>Protection sociale :</strong> Faible taux de pauvreté</li>
                </ul>
              </div>
              <div className="bg-bg-surface/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚠️</span>
                  <h4 className="font-semibold text-accent-red">À améliorer</h4>
                </div>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• <strong>Éducation :</strong> Résultats PISA moyens malgré dépenses élevées</li>
                  <li>• <strong>Emploi :</strong> Chômage structurel plus élevé que voisins</li>
                  <li>• <strong>Administration :</strong> Complexité et délais</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="text-center py-6 border-t border-glass-border">
            <p className="text-text-muted text-sm">
              Sources : Eurostat, OCDE, OTAN, PISA, DGAFP, Banque mondiale (2024)
            </p>
          </div>
        </>
      )}
    </main>
  )
}

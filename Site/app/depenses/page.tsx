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
}

// Source: INSEE - Comptes des administrations publiques (base 2020)
const EVOLUTION_DATA = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  total: [1242, 1257, 1291, 1314, 1349, 1434, 1473, 1549, 1607, 1670],
  recettes: [1171, 1196, 1244, 1292, 1313, 1256, 1371, 1423, 1456, 1502],
}

// Répartition détaillée (source: DREES 2024 pour retraites, INSEE COFOG pour le reste)
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

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {SPENDING_BREAKDOWN.map((item) => (
          <Link
            key={item.id}
            href={`/depenses/${item.id}`}
            className="px-4 py-2 rounded-lg text-sm transition-all duration-200 bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-electric/50"
          >
            {item.name.split('(')[0].trim()}
          </Link>
        ))}
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
              icon="📊"
              label="Recettes fiscales"
              value={`${FRANCE_DATA.recettes} Md€`}
              subtext="Prélèvements obligatoires"
              color="green"
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

          {/* Graphiques côte à côte */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Évolution des dépenses */}
            <ChartWrapper
              title="Évolution des dépenses"
              subtitle="En milliards d'euros, 2015-2024"
              height="400px"
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

            {/* Répartition des dépenses - Graphique en barres */}
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-5">
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

              <div className="space-y-3">
                {SPENDING_BREAKDOWN.map((item, index) => {
                  const per100 = getPer100(item.amount)
                  const maxValue = SPENDING_BREAKDOWN[0].amount
                  return (
                    <div key={item.name} className="group">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <span className={`text-sm block truncate ${index === 0 ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                            {item.name}
                          </span>
                          {item.detail && (
                            <span className="text-xs text-text-muted block truncate">
                              ({item.detail})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-8 bg-bg-deep rounded-lg overflow-hidden">
                        <div
                          className={`h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3 ${index === 0 ? 'bg-gradient-to-r from-accent-red/80 to-accent-red' : ''}`}
                          style={{
                            width: `${(item.amount / maxValue) * 100}%`,
                            backgroundColor: index === 0 ? undefined : item.color,
                            minWidth: '55px'
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
          </div>

          {/* Sources */}
          <div className="text-center py-6 border-t border-glass-border">
            <p className="text-text-muted text-sm">
              Sources : INSEE - Comptes des administrations publiques, DREES, PLF 2025
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

          {/* Sources */}
          <div className="text-center py-6 border-t border-glass-border">
            <p className="text-text-muted text-sm">
              Sources : Eurostat, OCDE, OTAN, Banque mondiale (2024)
            </p>
          </div>
        </>
      )}
    </main>
  )
}

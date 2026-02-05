'use client'

import { useState, useEffect, useRef } from 'react'
import { KpiCard } from '@/components/ui/KpiCard'
import { ChartWrapper, LineChart, DoughnutChart, BarChart } from '@/components/charts'
import { MINISTRIES, EU_COMPARISON_SPENDING, DEBT_HISTORY, EU_COMPARISON_DEBT } from '@/lib/constants/budget'

type TabType = 'depenses' | 'dettes' | 'impots'

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    hasStarted.current = false
    setCount(0)

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

// ==================== DEPENSES DATA ====================
const YEARS_DATA = {
  2025: { total: 1607, recettes: 1428, deficit: -179, ratio: 57 },
  2024: { total: 1577, recettes: 1401, deficit: -176, ratio: 56.5 },
  2023: { total: 1537, recettes: 1380, deficit: -157, ratio: 55.8 },
  2022: { total: 1489, recettes: 1345, deficit: -144, ratio: 55.2 },
}

const EVOLUTION_DATA = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  total: [1302, 1345, 1428, 1451, 1489, 1537, 1577, 1607],
  recettes: [1221, 1283, 1180, 1295, 1345, 1380, 1401, 1428],
}

const SECTOR_DATA = {
  labels: ['Santé & Solidarités', 'Éducation', 'Défense', 'Écologie', 'Administration', 'Dette'],
  data: [50.7, 10.5, 4.0, 3.6, 5.3, 3.2],
  colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#dda0dd', '#ffd700'],
}

const MONTHLY_DATA = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  previsionnel: [134, 134, 134, 134, 134, 134, 134, 134, 134, 134, 134, 134],
  reel: [138, 129, 141, 132, 136, 130, 0, 0, 0, 0, 0, 0],
}

const ACTIVITY_FEED = [
  { date: '15 Jan', text: 'Actualisation du PLF 2025 : +12 Md€ de dépenses prévues' },
  { date: '10 Jan', text: 'Nouveau plan d\'économies : objectif -10 Md€ sur 2025' },
  { date: '5 Jan', text: 'Publication des comptes définitifs 2024' },
  { date: '28 Déc', text: 'Vote définitif du budget 2025 par le Parlement' },
]

// ==================== DETTES DATA ====================
const DEBT_EVOLUTION = {
  labels: DEBT_HISTORY.map((d) => d.year),
  dette: DEBT_HISTORY.map((d) => d.debt),
  ratio: DEBT_HISTORY.map((d) => d.ratio),
}

const DEBT_HOLDERS = {
  labels: ['Investisseurs français', 'Investisseurs étrangers', 'BCE / Eurosystème'],
  data: [27, 48, 25],
  colors: ['#00d4ff', '#ff4757', '#ffd700'],
}

const CRISIS_TIMELINE = [
  {
    year: '2008',
    title: 'Crise des subprimes',
    impact: '+320 Md€',
    description: 'Sauvetage des banques et relance économique suite à la crise financière mondiale.',
  },
  {
    year: '2010',
    title: 'Crise de l\'euro',
    impact: '+280 Md€',
    description: 'Plans d\'aide européens et mesures de stabilisation de la zone euro.',
  },
  {
    year: '2020',
    title: 'Covid-19',
    impact: '+420 Md€',
    description: '"Quoi qu\'il en coûte" : chômage partiel, aides aux entreprises, plan de relance.',
  },
  {
    year: '2022',
    title: 'Crise énergétique',
    impact: '+85 Md€',
    description: 'Bouclier tarifaire, aides au carburant, soutien aux ménages et entreprises.',
  },
]

const MATURITY_DATA = {
  labels: ['< 1 an', '1-3 ans', '3-7 ans', '7-15 ans', '> 15 ans'],
  data: [12, 18, 25, 30, 15],
  colors: ['#ff4757', '#ff9f43', '#ffd700', '#00d4ff', '#a855f7'],
}

// ==================== IMPOTS DATA ====================
const TAX_CARDS = [
  {
    icon: '🛒',
    name: 'TVA',
    fullName: 'Taxe sur la Valeur Ajoutée',
    amount: '206 Md€',
    percent: 13.7,
    barWidth: 100,
    color: '#ff6b6b',
    details: 'Taux normal 20%, réduit 10% ou 5.5%. Payée par tous les consommateurs.',
  },
  {
    icon: '👔',
    name: 'CSG/CRDS',
    fullName: 'Contributions sociales',
    amount: '163 Md€',
    percent: 10.9,
    barWidth: 79,
    color: '#00d4ff',
    details: '9.2% CSG + 0.5% CRDS sur les revenus. Finance la Sécu.',
  },
  {
    icon: '👤',
    name: 'IR',
    fullName: 'Impôt sur le Revenu',
    amount: '114 Md€',
    percent: 7.6,
    barWidth: 55,
    color: '#4ecdc4',
    details: 'Barème progressif de 0% à 45%. Seuls 44% des foyers sont imposables.',
  },
  {
    icon: '🏢',
    name: 'IS',
    fullName: 'Impôt sur les Sociétés',
    amount: '57 Md€',
    percent: 3.8,
    barWidth: 28,
    color: '#ffd700',
    details: 'Taux normal 25% sur les bénéfices des entreprises.',
  },
  {
    icon: '🏠',
    name: 'Taxes foncières',
    fullName: 'Taxe foncière & d\'habitation',
    amount: '55 Md€',
    percent: 3.7,
    barWidth: 27,
    color: '#a855f7',
    details: 'Financement des collectivités locales. TH supprimée pour les résidences principales.',
  },
  {
    icon: '⛽',
    name: 'TICPE',
    fullName: 'Taxe sur les carburants',
    amount: '30 Md€',
    percent: 2.0,
    barWidth: 15,
    color: '#ff9f43',
    details: '~60 cts/L d\'essence. Financement de la transition écologique.',
  },
]

const TAX_EVOLUTION_DATA = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  total: [1171, 1196, 1244, 1292, 1323, 1262, 1358, 1399, 1410, 1428, 1480],
  etat: [343, 355, 372, 388, 396, 362, 399, 412, 418, 423, 440],
}

const STRUCTURE_DATA = {
  labels: ['Cotisations sociales', 'TVA', 'CSG/CRDS', 'IR', 'IS', 'Taxes locales', 'Autres'],
  data: [38, 15, 10, 7, 5, 5, 20],
  colors: ['#ff6b6b', '#ffd700', '#00d4ff', '#4ecdc4', '#a855f7', '#ff9f43', '#4a5a6a'],
}

const EU_TAX_COMPARISON = [
  { country: 'Danemark', value: 46.9 },
  { country: 'France', value: 45.4, highlight: true },
  { country: 'Belgique', value: 44.2 },
  { country: 'Suède', value: 43.9 },
  { country: 'Italie', value: 42.5 },
  { country: 'Allemagne', value: 41.8 },
  { country: 'Espagne', value: 38.2 },
  { country: 'Pays-Bas', value: 38.1 },
  { country: 'UK', value: 35.3 },
  { country: 'Irlande', value: 22.7 },
]

// ==================== TAB CONFIGURATION ====================
const TABS: { id: TabType; label: string; icon: string; color: string }[] = [
  { id: 'depenses', label: 'Dépenses', icon: '💰', color: 'electric' },
  { id: 'dettes', label: 'Dettes', icon: '💳', color: 'red' },
  { id: 'impots', label: 'Impôts', icon: '🏛️', color: 'gold' },
]

// ==================== DEPENSES COMPONENT ====================
function DepensesContent() {
  const [selectedYear, setSelectedYear] = useState<2025 | 2024 | 2023 | 2022>(2025)
  const yearData = YEARS_DATA[selectedYear]
  const { count: animatedTotal, ref: counterRef } = useAnimatedCounter(yearData.total, 2000)

  return (
    <>
      {/* Big Counter Banner */}
      <div className="bg-glass backdrop-blur-xl border border-glass-border rounded-2xl p-8 lg:p-12 mb-10 text-center max-w-2xl mx-auto">
        <p className="text-text-muted text-sm uppercase tracking-wider mb-4">
          Dépenses publiques {selectedYear}
        </p>
        <div
          ref={counterRef}
          className="font-mono text-[clamp(3rem,12vw,5.5rem)] font-medium text-accent-electric leading-none"
        >
          {animatedTotal.toLocaleString('fr-FR')} <span className="text-[0.5em]">Md€</span>
        </div>
        <p className="text-text-secondary text-lg mt-4">
          soit <span className="text-accent-gold font-mono">50 963 €</span> dépensés chaque seconde
        </p>
      </div>

      {/* Year Selector */}
      <div className="flex justify-center gap-2 mb-10">
        {Object.keys(YEARS_DATA).reverse().map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(Number(year) as typeof selectedYear)}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
              selectedYear === Number(year)
                ? 'bg-accent-electric text-bg-deep'
                : 'bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-glass-border/50'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon="💰" label="Dépenses totales" value={`${yearData.total} Md€`} subtext="Budget consolidé" color="electric" />
        <KpiCard icon="📊" label="Recettes fiscales" value={`${yearData.recettes} Md€`} subtext="Prélèvements" color="green" />
        <KpiCard icon="📉" label="Déficit public" value={`${yearData.deficit} Md€`} subtext="Dépenses - Recettes" color="red" />
        <KpiCard icon="📈" label="Dépenses / PIB" value={`${yearData.ratio}%`} subtext="Ratio budgétaire" color="gold" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartWrapper title="Évolution des dépenses" subtitle="En milliards d'euros, 2018-2025" height="300px">
          <LineChart
            labels={EVOLUTION_DATA.labels}
            datasets={[
              { label: 'Dépenses totales', data: EVOLUTION_DATA.total, borderColor: '#00d4ff', backgroundColor: 'rgba(0, 212, 255, 0.1)', fill: true, borderWidth: 3 },
              { label: 'Recettes', data: EVOLUTION_DATA.recettes, borderColor: '#00ff88', borderWidth: 2 },
            ]}
            yMin={1000}
            yMax={1700}
            yCallback={(v) => `${v} Md€`}
          />
        </ChartWrapper>

        <ChartWrapper title="Répartition par secteur" subtitle="Part de chaque ministère" height="300px">
          <DoughnutChart labels={SECTOR_DATA.labels} data={SECTOR_DATA.data} colors={SECTOR_DATA.colors} tooltipSuffix="%" />
        </ChartWrapper>
      </div>

      {/* Ministry Table */}
      <div className="bg-bg-surface border border-glass-border rounded-2xl p-5 mb-6">
        <h3 className="text-base font-semibold mb-4">Budget par ministère</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Ministère</th>
                <th className="text-right py-3 px-4 font-medium text-text-secondary">Budget</th>
                <th className="text-right py-3 px-4 font-medium text-text-secondary">Part</th>
                <th className="text-right py-3 px-4 font-medium text-text-secondary">Évolution</th>
              </tr>
            </thead>
            <tbody>
              {MINISTRIES.slice(0, 6).map((ministry) => (
                <tr key={ministry.id} className="border-b border-glass-border/50 hover:bg-bg-elevated/50">
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{ministry.icon}</span>
                      <span>{ministry.shortName}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{ministry.amount} Md€</td>
                  <td className="py-3 px-4 text-right font-mono text-text-secondary">{ministry.percent}%</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-mono ${ministry.evolution >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                      {ministry.evolution >= 0 ? '+' : ''}{ministry.evolution}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartWrapper title="Comparaison européenne" subtitle="Dépenses publiques en % du PIB" height="300px">
          <BarChart
            labels={EU_COMPARISON_SPENDING.map((c) => c.country)}
            data={EU_COMPARISON_SPENDING.map((c) => c.value)}
            colors={(ctx) => EU_COMPARISON_SPENDING[ctx.dataIndex]?.highlight ? '#00d4ff' : '#2a3a4a'}
            horizontal
            tooltipSuffix="% du PIB"
            yMin={40}
            yMax={60}
          />
        </ChartWrapper>

        <ChartWrapper title="Exécution mensuelle 2025" subtitle="Prévisionnel vs Réel (Md€)" height="300px">
          <BarChart
            labels={MONTHLY_DATA.labels}
            data={MONTHLY_DATA.reel.map((r, i) => r || MONTHLY_DATA.previsionnel[i])}
            colors={MONTHLY_DATA.reel.map((r) => (r > 0 ? '#00d4ff' : '#4a5a6a'))}
            tooltipSuffix=" Md€"
          />
        </ChartWrapper>
      </div>

      {/* Activity Feed */}
      <div className="bg-bg-surface border border-glass-border rounded-2xl p-5">
        <h3 className="text-base font-semibold mb-4">Actualités budgétaires</h3>
        <div className="space-y-3">
          {ACTIVITY_FEED.map((item, index) => (
            <div key={index} className="flex gap-4 items-start py-2 border-b border-glass-border/50 last:border-0">
              <span className="font-mono text-xs text-text-muted whitespace-nowrap">{item.date}</span>
              <span className="text-sm text-text-secondary">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ==================== DETTES COMPONENT ====================
function DettesContent() {
  return (
    <>
      {/* KPI Grid - Source: INSEE T3 2025 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon="💳" label="Dette totale" value="3 482 Md€" subtext="Dette publique brute" color="red" />
        <KpiCard icon="📊" label="Dette / PIB" value="117.4%" subtext="Ratio de Maastricht" color="orange" />
        <KpiCard icon="👤" label="Par habitant" value="50 800 €" subtext="Part de chaque Français" color="gold" />
        <KpiCard icon="📈" label="Charge d'intérêts" value="58 Md€/an" subtext="Coût annuel de la dette" color="purple" />
      </div>

      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-accent-red/10 to-accent-orange/10 border border-accent-red/30 rounded-2xl p-6 mb-8 flex flex-col lg:flex-row gap-6 items-center">
        <div className="text-5xl">⚠️</div>
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-xl font-semibold mb-2">Seuil critique atteint</h3>
          <p className="text-text-secondary">
            La France dépasse les 117% de dette/PIB, près du double du seuil de 60% prévu par le traité de Maastricht.
            La charge d&apos;intérêts représente désormais le 4ème poste budgétaire.
          </p>
        </div>
        <div className="text-center">
          <div className="font-mono text-4xl font-medium text-accent-red">+5 350 €/s</div>
          <div className="text-text-muted text-sm">La dette augmente chaque seconde</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartWrapper title="Évolution de la dette" subtitle="En milliards d'euros, 2000-2025" height="350px">
          <LineChart
            labels={DEBT_EVOLUTION.labels}
            datasets={[
              { label: 'Dette publique', data: DEBT_EVOLUTION.dette, borderColor: '#ff4757', backgroundColor: 'rgba(255, 71, 87, 0.1)', fill: true, borderWidth: 3 },
            ]}
            yMin={500}
            yMax={3500}
            yCallback={(v) => `${v} Md€`}
          />
        </ChartWrapper>

        <ChartWrapper title="Ratio dette / PIB" subtitle="Évolution en pourcentage" height="350px">
          <LineChart
            labels={DEBT_EVOLUTION.labels}
            datasets={[
              { label: 'Dette / PIB', data: DEBT_EVOLUTION.ratio, borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.1)', fill: true, borderWidth: 3 },
              { label: 'Seuil Maastricht (60%)', data: Array(DEBT_EVOLUTION.labels.length).fill(60), borderColor: '#ff4757', borderWidth: 2, tension: 0 },
            ]}
            yMin={50}
            yMax={130}
            yCallback={(v) => `${v}%`}
          />
        </ChartWrapper>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartWrapper title="Qui détient la dette ?" subtitle="Répartition par type de détenteur" height="300px">
          <DoughnutChart labels={DEBT_HOLDERS.labels} data={DEBT_HOLDERS.data} colors={DEBT_HOLDERS.colors} tooltipSuffix="%" />
        </ChartWrapper>

        <ChartWrapper title="Comparaison européenne" subtitle="Dette publique en % du PIB" height="300px">
          <BarChart
            labels={EU_COMPARISON_DEBT.map((c) => c.country)}
            data={EU_COMPARISON_DEBT.map((c) => c.value)}
            colors={(ctx) => EU_COMPARISON_DEBT[ctx.dataIndex]?.highlight ? '#ff4757' : '#2a3a4a'}
            horizontal
            tooltipSuffix="%"
          />
        </ChartWrapper>
      </div>

      {/* Crisis Timeline */}
      <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 lg:p-8 mb-8">
        <h3 className="text-xl font-semibold mb-6 text-center">Les crises qui ont fait exploser la dette</h3>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-glass-border -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-0">
            {CRISIS_TIMELINE.map((crisis, index) => (
              <div
                key={crisis.year}
                className={`lg:flex lg:items-center lg:gap-12 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className="lg:flex-1 lg:mb-8">
                  <div className={`bg-bg-elevated border border-glass-border rounded-xl p-5 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <span className="font-mono text-accent-red text-sm">{crisis.year}</span>
                    <h4 className="text-lg font-semibold mt-1 mb-2">{crisis.title}</h4>
                    <p className="text-text-secondary text-sm mb-3">{crisis.description}</p>
                    <span className="inline-block px-3 py-1 bg-accent-red/10 border border-accent-red/30 rounded-full font-mono text-accent-red text-sm">
                      {crisis.impact}
                    </span>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col items-center relative">
                  <div className="w-4 h-4 bg-accent-red rounded-full z-10" />
                </div>

                <div className="hidden lg:block lg:flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maturity Chart */}
      <ChartWrapper title="Structure de la dette par maturité" subtitle="Répartition selon les échéances de remboursement" height="250px" className="mb-8">
        <DoughnutChart labels={MATURITY_DATA.labels} data={MATURITY_DATA.data} colors={MATURITY_DATA.colors} cutout="50%" legendPosition="bottom" tooltipSuffix="%" />
      </ChartWrapper>
    </>
  )
}

// ==================== IMPOTS COMPONENT ====================
function ImpotsContent() {
  return (
    <>
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-accent-gold/10 to-accent-electric/5 border border-accent-gold/20 rounded-2xl p-6 mb-8 flex flex-col lg:flex-row gap-6 items-center">
        <div className="text-5xl">💰</div>
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-xl font-semibold mb-2">Prélèvements obligatoires en France</h3>
          <p className="text-text-secondary">
            La France a l&apos;un des taux de prélèvements obligatoires les plus élevés au monde, mais finance aussi une protection sociale très développée.
          </p>
        </div>
        <div className="flex gap-8 lg:gap-12">
          <div className="text-center">
            <div className="font-mono text-4xl font-medium text-accent-gold">43.5%</div>
            <div className="text-text-muted text-sm">du PIB (OCDE 2024)</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-4xl font-medium text-accent-gold">1 428</div>
            <div className="text-text-muted text-sm">Md€ de recettes</div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon="🏛️" label="Recettes État" value="423 Md€" subtext="Budget général de l'État" color="gold" />
        <KpiCard icon="🏥" label="Recettes Sécu" value="636 Md€" subtext="Sécurité sociale" color="electric" />
        <KpiCard icon="🏘️" label="Recettes locales" value="312 Md€" subtext="Collectivités territoriales" color="purple" />
        <KpiCard icon="🇪🇺" label="Contribution UE" value="57 Md€" subtext="Budget européen" color="green" />
      </div>

      {/* Tax Cards */}
      <h2 className="font-serif text-2xl font-normal text-center mb-6">Les principaux impôts et taxes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TAX_CARDS.map((tax) => (
          <div
            key={tax.name}
            className="bg-bg-surface border border-glass-border rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            style={{ '--tax-color': tax.color } as React.CSSProperties}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: tax.color }} />

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: `${tax.color}20` }}>
                {tax.icon}
              </div>
              <div>
                <div className="font-semibold text-base">{tax.name}</div>
                <div className="text-xs text-text-muted">{tax.fullName}</div>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-4">
              <span className="font-mono text-2xl font-medium" style={{ color: tax.color }}>{tax.amount}</span>
              <span className="text-sm text-text-muted">{tax.percent}% des recettes</span>
            </div>

            <div className="h-1.5 bg-bg-deep rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${tax.barWidth}%`, background: tax.color }} />
            </div>

            <div className="text-sm text-text-secondary pt-4 border-t border-glass-border">{tax.details}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartWrapper title="Évolution des recettes fiscales" subtitle="En milliards d'euros, 2015-2025" height="350px">
          <LineChart
            labels={TAX_EVOLUTION_DATA.labels}
            datasets={[
              { label: 'Recettes totales', data: TAX_EVOLUTION_DATA.total, borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.1)', fill: true, borderWidth: 3 },
              { label: 'Impôts État', data: TAX_EVOLUTION_DATA.etat, borderColor: '#00d4ff', borderWidth: 2 },
            ]}
            yMin={300}
            yMax={1600}
            yCallback={(v) => `${v} Md€`}
          />
        </ChartWrapper>

        <ChartWrapper title="Répartition par type d'impôt" subtitle="Structure des prélèvements" height="350px">
          <DoughnutChart labels={STRUCTURE_DATA.labels} data={STRUCTURE_DATA.data} colors={STRUCTURE_DATA.colors} tooltipSuffix="%" />
        </ChartWrapper>
      </div>

      {/* EU Comparison */}
      <ChartWrapper title="Prélèvements obligatoires en Europe" subtitle="Comparaison du taux de prélèvements (impôts + cotisations) en % du PIB" height="300px" className="mb-8">
        <BarChart
          labels={EU_TAX_COMPARISON.map((c) => c.country)}
          data={EU_TAX_COMPARISON.map((c) => c.value)}
          colors={(ctx) => EU_TAX_COMPARISON[ctx.dataIndex]?.highlight ? '#ffd700' : '#2a3a4a'}
          yMin={0}
          yMax={50}
          tooltipSuffix="% du PIB"
        />
      </ChartWrapper>
    </>
  )
}

// ==================== MAIN DASHBOARD ====================
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('depenses')

  const getGradientStyle = () => {
    switch (activeTab) {
      case 'dettes':
        return 'radial-gradient(ellipse at 30% 20%, rgba(255, 71, 87, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)'
      case 'impots':
        return 'radial-gradient(ellipse at 30% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)'
      default:
        return 'radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 255, 136, 0.05) 0%, transparent 50%)'
    }
  }

  const getTitle = () => {
    switch (activeTab) {
      case 'dettes':
        return { text: 'La', highlight: 'dette', suffix: 'publique', color: 'text-accent-red' }
      case 'impots':
        return { text: 'Les', highlight: 'impôts', suffix: 'en France', color: 'text-accent-gold' }
      default:
        return { text: 'Les', highlight: 'dépenses', suffix: 'publiques', color: 'text-accent-electric' }
    }
  }

  const getSubtitle = () => {
    switch (activeTab) {
      case 'dettes':
        return "Comprendre l'endettement de la France : son évolution, ses détenteurs, et ses enjeux"
      case 'impots':
        return 'Comprendre les recettes fiscales, leur répartition et comment votre argent finance les services publics'
      default:
        return "Analyse complète des dépenses de l'État français et leur évolution"
    }
  }

  const title = getTitle()

  return (
    <div className="relative min-h-screen">
      {/* Dynamic gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-all duration-500" style={{ background: getGradientStyle() }} />

      <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
            {title.text} <span className={`italic ${title.color}`}>{title.highlight}</span> {title.suffix}
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">{getSubtitle()}</p>
        </header>

        {/* Tab Selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-bg-surface border border-glass-border rounded-xl p-1.5 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? tab.color === 'electric'
                      ? 'bg-accent-electric text-bg-deep'
                      : tab.color === 'red'
                      ? 'bg-accent-red text-white'
                      : 'bg-accent-gold text-bg-deep'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-opacity duration-300">
          {activeTab === 'depenses' && <DepensesContent />}
          {activeTab === 'dettes' && <DettesContent />}
          {activeTab === 'impots' && <ImpotsContent />}
        </div>

        {/* Sources */}
        <div className="text-center py-6 border-t border-glass-border mt-8">
          <p className="text-text-muted text-sm">
            Sources : INSEE, Direction générale des Finances publiques, Agence France Trésor, Eurostat (2024-2025)
          </p>
        </div>
      </main>
    </div>
  )
}

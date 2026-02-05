'use client'

import { KpiCard } from '@/components/ui/KpiCard'
import { ChartWrapper, BarChart } from '@/components/charts'

// Source: DGFiP 2024
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
    details: 'Barème progressif de 0% à 45%. 44% des foyers imposables, 56% non imposables.',
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

// Source: OCDE Revenue Statistics 2025
const OCDE_TAX_COMPARISON = [
  { country: 'Danemark', value: 45.2 },
  { country: 'France', value: 43.5, highlight: true },
  { country: 'Autriche', value: 43.4 },
  { country: 'Belgique', value: 45.1 },
  { country: 'Suède', value: 42.6 },
  { country: 'Finlande', value: 42.3 },
  { country: 'Italie', value: 42.8 },
  { country: 'Pays-Bas', value: 39.4 },
  { country: 'Allemagne', value: 38.0 },
  { country: 'Espagne', value: 37.0 },
  { country: 'UK', value: 35.3 },
  { country: 'USA', value: 25.2 },
  { country: 'Suisse', value: 26.9 },
  { country: 'Irlande', value: 21.7 },
]

// Source: Tax Foundation, OCDE, PwC 2025 - Flat tax sur dividendes (taux nominal personnel)
// Pays avec flat tax ≤ France (30%)
const FLAT_TAX_COMPARISON = [
  { country: 'France', value: 30.0, highlight: true },
  { country: 'Belgique', value: 30.0 },
  { country: 'Espagne (max)', value: 30.0 },
  { country: 'Portugal', value: 28.0 },
  { country: 'Autriche', value: 27.5 },
  { country: 'Allemagne', value: 26.4 },
  { country: 'Italie', value: 26.0 },
  { country: 'Singapour', value: 0, color: '#00ff88' },
  { country: 'Hong Kong', value: 0, color: '#00ff88' },
  { country: 'Dubaï', value: 0, color: '#00ff88' },
]

export default function ImpotsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Gold gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
            Les <span className="italic text-accent-gold">impôts</span> en France
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Comprendre les recettes fiscales, leur répartition et comment votre argent finance les services publics
          </p>
        </header>

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
              <div className="font-mono text-4xl font-medium text-accent-gold">1 502</div>
              <div className="text-text-muted text-sm">Md€ de recettes</div>
            </div>
          </div>
        </div>

        {/* KPI Grid - Source: INSEE 2024 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            icon="🏛️"
            label="Recettes État"
            value="548 Md€"
            subtext="Budget général de l'État"
            color="gold"
          />
          <KpiCard
            icon="🏥"
            label="Recettes Sécu"
            value="640 Md€"
            subtext="Sécurité sociale"
            color="electric"
          />
          <KpiCard
            icon="🏘️"
            label="Recettes locales"
            value="313 Md€"
            subtext="Collectivités territoriales"
            color="purple"
          />
          <KpiCard
            icon="🇪🇺"
            label="Contribution UE"
            value="21 Md€"
            subtext="Budget européen"
            color="green"
          />
        </div>

        {/* Tax Cards */}
        <h2 className="font-serif text-2xl font-normal text-center mb-6">
          Les principaux impôts et taxes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TAX_CARDS.map((tax) => (
            <div
              key={tax.name}
              className="bg-bg-surface border border-glass-border rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              style={{ '--tax-color': tax.color } as React.CSSProperties}
            >
              {/* Left border */}
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: tax.color }} />

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ background: `${tax.color}20` }}
                >
                  {tax.icon}
                </div>
                <div>
                  <div className="font-semibold text-base">{tax.name}</div>
                  <div className="text-xs text-text-muted">{tax.fullName}</div>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-4">
                <span className="font-mono text-2xl font-medium" style={{ color: tax.color }}>
                  {tax.amount}
                </span>
                <span className="text-sm text-text-muted">{tax.percent}% des recettes</span>
              </div>

              <div className="h-1.5 bg-bg-deep rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${tax.barWidth}%`, background: tax.color }}
                />
              </div>

              <div className="text-sm text-text-secondary pt-4 border-t border-glass-border">
                {tax.details}
              </div>
            </div>
          ))}
        </div>

        {/* Charts - Prélèvements OCDE et Flat Tax côte à côte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartWrapper
            title="Prélèvements obligatoires : France vs OCDE"
            subtitle="Taux de prélèvements en % du PIB - France 2ème mondiale"
            height="400px"
            source="OCDE Revenue Statistics 2025"
          >
            <BarChart
              labels={OCDE_TAX_COMPARISON.map((c) => c.country)}
              data={OCDE_TAX_COMPARISON.map((c) => c.value)}
              colors={(ctx) =>
                OCDE_TAX_COMPARISON[ctx.dataIndex]?.highlight ? '#ffd700' : '#2a3a4a'
              }
              yMin={0}
              yMax={50}
              tooltipSuffix="% du PIB"
              yAxisSuffix="%"
              showValues
            />
          </ChartWrapper>

          <ChartWrapper
            title="Flat Tax sur dividendes dans le monde"
            subtitle="Taux d'imposition des dividendes (niveau personnel, hors IS)"
            height="400px"
            source="Tax Foundation, OCDE, PwC 2025"
          >
            <BarChart
              labels={FLAT_TAX_COMPARISON.map((c) => c.country)}
              data={FLAT_TAX_COMPARISON.map((c) => c.value)}
              colors={(ctx) => {
                const item = FLAT_TAX_COMPARISON[ctx.dataIndex]
                if (item?.highlight) return '#ffd700'
                if (item?.color) return item.color
                return '#2a3a4a'
              }}
              yMin={0}
              yMax={35}
              tooltipSuffix="%"
              showValues
            />
          </ChartWrapper>
        </div>

        {/* Sources */}
        <div className="text-center py-6 border-t border-glass-border">
          <p className="text-text-muted text-sm">
            Sources : OCDE Revenue Statistics 2025, Tax Foundation Europe 2025, DGFiP (2024-2025)
          </p>
        </div>
      </main>
    </div>
  )
}

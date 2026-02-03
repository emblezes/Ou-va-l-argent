'use client'

import { KpiCard } from '@/components/ui/KpiCard'
import { ChartWrapper, LineChart, DoughnutChart, BarChart } from '@/components/charts'

// Source: DGFiP 2024
const TAX_CARDS = [
  {
    icon: '🛒',
    name: 'TVA',
    fullName: 'Taxe sur la Valeur Ajoutée',
    amount: '204 Md€',
    percent: 13.6,
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
    barWidth: 80,
    color: '#00d4ff',
    details: '9.2% CSG + 0.5% CRDS sur les revenus. Finance la Sécu.',
  },
  {
    icon: '👤',
    name: 'IR',
    fullName: 'Impôt sur le Revenu',
    amount: '92 Md€',
    percent: 6.1,
    barWidth: 45,
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

// Source: INSEE - Comptes nationaux
const EVOLUTION_DATA = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  total: [1171, 1196, 1244, 1292, 1243, 1256, 1371, 1423, 1456, 1502, 1540],
  etat: [343, 355, 372, 388, 396, 362, 399, 450, 480, 510, 548],
}

const STRUCTURE_DATA = {
  labels: ['Cotisations sociales', 'TVA', 'CSG/CRDS', 'IR', 'IS', 'Taxes locales', 'Autres'],
  data: [38, 15, 10, 7, 5, 5, 20],
  colors: ['#ff6b6b', '#ffd700', '#00d4ff', '#4ecdc4', '#a855f7', '#ff9f43', '#4a5a6a'],
}

// Source: Eurostat 2024
const EU_TAX_COMPARISON = [
  { country: 'Danemark', value: 45.8 },
  { country: 'France', value: 45.3, highlight: true },
  { country: 'Belgique', value: 45.1 },
  { country: 'Suède', value: 43.5 },
  { country: 'Italie', value: 42.5 },
  { country: 'Allemagne', value: 40.9 },
  { country: 'Espagne', value: 38.2 },
  { country: 'Pays-Bas', value: 38.1 },
  { country: 'UK', value: 35.3 },
  { country: 'Irlande', value: 22.7 },
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
              <div className="font-mono text-4xl font-medium text-accent-gold">45.3%</div>
              <div className="text-text-muted text-sm">du PIB (2024)</div>
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartWrapper title="Évolution des recettes fiscales" subtitle="En milliards d'euros, 2015-2025" height="350px" source="INSEE - Comptes nationaux">
            <LineChart
              labels={EVOLUTION_DATA.labels}
              datasets={[
                {
                  label: 'Recettes totales',
                  data: EVOLUTION_DATA.total,
                  borderColor: '#ffd700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  fill: true,
                  borderWidth: 3,
                },
                {
                  label: 'Impôts État',
                  data: EVOLUTION_DATA.etat,
                  borderColor: '#00d4ff',
                  borderWidth: 2,
                },
              ]}
              yMin={300}
              yMax={1600}
              yCallback={(v) => `${v} Md€`}
            />
          </ChartWrapper>

          <ChartWrapper title="Répartition par type d'impôt" subtitle="Structure des prélèvements" height="350px" source="DGFiP 2024">
            <DoughnutChart
              labels={STRUCTURE_DATA.labels}
              data={STRUCTURE_DATA.data}
              colors={STRUCTURE_DATA.colors}
              tooltipSuffix="%"
            />
          </ChartWrapper>
        </div>

        {/* EU Comparison */}
        <ChartWrapper
          title="Prélèvements obligatoires en Europe"
          subtitle="Comparaison du taux de prélèvements (impôts + cotisations) en % du PIB"
          height="300px"
          className="mb-8"
          source="Eurostat 2024"
        >
          <BarChart
            labels={EU_TAX_COMPARISON.map((c) => c.country)}
            data={EU_TAX_COMPARISON.map((c) => c.value)}
            colors={(ctx) =>
              EU_TAX_COMPARISON[ctx.dataIndex]?.highlight ? '#ffd700' : '#2a3a4a'
            }
            yMin={0}
            yMax={50}
            tooltipSuffix="% du PIB"
          />
        </ChartWrapper>

        {/* Sources */}
        <div className="text-center py-6 border-t border-glass-border">
          <p className="text-text-muted text-sm">
            Sources : Direction générale des Finances publiques, INSEE, Eurostat (2024-2025)
          </p>
        </div>
      </main>
    </div>
  )
}

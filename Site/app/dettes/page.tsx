'use client'

import { KpiCard } from '@/components/ui/KpiCard'
import { ChartWrapper, LineChart, DoughnutChart, BarChart } from '@/components/charts'
import { DEBT_HISTORY, EU_COMPARISON_DEBT } from '@/lib/constants/budget'

const DEBT_EVOLUTION = {
  labels: DEBT_HISTORY.map((d) => d.year),
  dette: DEBT_HISTORY.map((d) => d.debt),
  ratio: DEBT_HISTORY.map((d) => d.ratio),
}

// Source: IFRAP, Vie Publique - T1 2025
const DEBT_HOLDERS = {
  labels: ['Investisseurs français', 'Investisseurs étrangers', 'BCE / Eurosystème'],
  data: [25, 55, 20],
  colors: ['#00d4ff', '#ff4757', '#ffd700'],
}

// Source: INSEE, OFCE, Banque de France
const CRISIS_TIMELINE = [
  {
    year: '2008',
    title: 'Crise des subprimes',
    impact: '+280 Md€',
    description: 'Sauvetage des banques et relance économique suite à la crise financière mondiale.',
  },
  {
    year: '2010',
    title: 'Crise de l\'euro',
    impact: '+230 Md€',
    description: 'Plans d\'aide européens et mesures de stabilisation de la zone euro.',
  },
  {
    year: '2020',
    title: 'Covid-19',
    impact: '+300 Md€',
    description: '"Quoi qu\'il en coûte" : chômage partiel, aides aux entreprises, plan de relance.',
  },
  {
    year: '2022',
    title: 'Crise énergétique',
    impact: '+90 Md€',
    description: 'Bouclier tarifaire, aides au carburant, soutien aux ménages et entreprises.',
  },
]

// Source: AFT - Maturité moyenne ~8.2 ans
const MATURITY_DATA = {
  labels: ['< 1 an', '1-3 ans', '3-7 ans', '7-15 ans', '> 15 ans'],
  data: [8, 17, 25, 32, 18],
  colors: ['#ff4757', '#ff9f43', '#ffd700', '#00d4ff', '#a855f7'],
}

export default function DettesPage() {
  return (
    <div className="relative min-h-screen">
      {/* Red gradient background for debt page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255, 71, 87, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
            La <span className="italic text-accent-red">dette</span> publique
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Comprendre l&apos;endettement de la France : son évolution, ses détenteurs, et ses enjeux
          </p>
        </header>

        {/* KPI Grid */}
        {/* KPI Cards - Source: INSEE T3 2025 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            icon="💳"
            label="Dette totale"
            value="3 482 Md€"
            subtext="Dette publique brute"
            color="red"
          />
          <KpiCard
            icon="📊"
            label="Dette / PIB"
            value="117.4%"
            subtext="Ratio de Maastricht"
            color="orange"
          />
          <KpiCard
            icon="👤"
            label="Par habitant"
            value="50 800 €"
            subtext="Part de chaque Français"
            color="gold"
          />
          <KpiCard
            icon="📈"
            label="Charge d'intérêts"
            value="54 Md€/an"
            subtext="Coût annuel de la dette"
            color="purple"
          />
        </div>

        {/* Alert Banner */}
        <div className="bg-gradient-to-r from-accent-red/10 to-accent-orange/10 border border-accent-red/30 rounded-2xl p-6 mb-8 flex flex-col lg:flex-row gap-6 items-center">
          <div className="text-5xl">⚠️</div>
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-xl font-semibold mb-2">Seuil critique dépassé</h3>
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
          <ChartWrapper title="Évolution de la dette" subtitle="En milliards d'euros, 2000-2025" height="350px" source="INSEE - Comptes nationaux">
            <LineChart
              labels={DEBT_EVOLUTION.labels}
              datasets={[
                {
                  label: 'Dette publique',
                  data: DEBT_EVOLUTION.dette,
                  borderColor: '#ff4757',
                  backgroundColor: 'rgba(255, 71, 87, 0.1)',
                  fill: true,
                  borderWidth: 3,
                },
              ]}
              yMin={500}
              yMax={3500}
              yCallback={(v) => `${v} Md€`}
            />
          </ChartWrapper>

          <ChartWrapper title="Ratio dette / PIB" subtitle="Évolution en pourcentage" height="350px" source="INSEE T3 2025">
            <LineChart
              labels={DEBT_EVOLUTION.labels}
              datasets={[
                {
                  label: 'Dette / PIB',
                  data: DEBT_EVOLUTION.ratio,
                  borderColor: '#ffd700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  fill: true,
                  borderWidth: 3,
                },
                {
                  label: 'Seuil Maastricht (60%)',
                  data: Array(DEBT_EVOLUTION.labels.length).fill(60),
                  borderColor: '#ff4757',
                  borderWidth: 2,
                  tension: 0,
                },
              ]}
              yMin={50}
              yMax={130}
              yCallback={(v) => `${v}%`}
            />
          </ChartWrapper>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartWrapper title="Qui détient la dette ?" subtitle="Répartition par type de détenteur" height="300px" source="IFRAP, Banque de France T1 2025">
            <DoughnutChart
              labels={DEBT_HOLDERS.labels}
              data={DEBT_HOLDERS.data}
              colors={DEBT_HOLDERS.colors}
              tooltipSuffix="%"
            />
          </ChartWrapper>

          <ChartWrapper title="Comparaison européenne" subtitle="Dette publique en % du PIB" height="300px" source="Eurostat 2024">
            <BarChart
              labels={EU_COMPARISON_DEBT.map((c) => c.country)}
              data={EU_COMPARISON_DEBT.map((c) => c.value)}
              colors={(ctx) =>
                EU_COMPARISON_DEBT[ctx.dataIndex]?.highlight ? '#ff4757' : '#2a3a4a'
              }
              horizontal
              tooltipSuffix="%"
            />
          </ChartWrapper>
        </div>

        {/* Crisis Timeline */}
        <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 lg:p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-center">📅 Les crises qui ont fait exploser la dette</h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-glass-border -translate-x-1/2" />

            <div className="space-y-8 lg:space-y-0">
              {CRISIS_TIMELINE.map((crisis, index) => (
                <div
                  key={crisis.year}
                  className={`lg:flex lg:items-center lg:gap-12 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className="lg:flex-1 lg:mb-8">
                    <div
                      className={`bg-bg-elevated border border-glass-border rounded-xl p-5 ${
                        index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                      }`}
                    >
                      <span className="font-mono text-accent-red text-sm">{crisis.year}</span>
                      <h4 className="text-lg font-semibold mt-1 mb-2">{crisis.title}</h4>
                      <p className="text-text-secondary text-sm mb-3">{crisis.description}</p>
                      <span className="inline-block px-3 py-1 bg-accent-red/10 border border-accent-red/30 rounded-full font-mono text-accent-red text-sm">
                        {crisis.impact}
                      </span>
                    </div>
                  </div>

                  {/* Center dot */}
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
        <ChartWrapper
          title="Structure de la dette par maturité"
          subtitle="Répartition selon les échéances de remboursement"
          height="250px"
          className="mb-8"
          source="Agence France Trésor"
        >
          <DoughnutChart
            labels={MATURITY_DATA.labels}
            data={MATURITY_DATA.data}
            colors={MATURITY_DATA.colors}
            cutout="50%"
            legendPosition="bottom"
            tooltipSuffix="%"
          />
        </ChartWrapper>

        {/* Sources */}
        <div className="text-center py-6 border-t border-glass-border">
          <p className="text-text-muted text-sm">
            Sources : Agence France Trésor, INSEE, Banque de France, Eurostat (2024-2025)
          </p>
        </div>
      </main>
    </div>
  )
}

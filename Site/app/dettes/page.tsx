'use client'

import { KpiCard } from '@/components/ui/KpiCard'
import { ChartWrapper, LineChart, BarChart } from '@/components/charts'

// Source: INSEE, FIPECO - Ratio dette/PIB historique depuis 1970
const DEBT_RATIO_HISTORY = {
  labels: ['1970', '1974', '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2024', '2025'],
  ratio: [15, 20, 21, 31, 36, 56, 58, 67, 85, 96, 115, 113, 117],
}

// Source: INSEE, Vie Publique - Solde budgétaire de l'État (% PIB) depuis 1970
const SOLDE_BUDGETAIRE_HISTORY = {
  labels: ['1970', '1971', '1972', '1973', '1974', '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2024'],
  solde: [0.9, 0.7, 0.5, 0.5, 0.1, -0.4, -2.9, -2.1, -5.1, -1.3, -3.4, -6.9, -3.6, -9.0, -5.8],
}

// Source: Banque de France, IFRAP - T1 2025
// Note: La BCE/BdF est incluse dans les résidents français
const DEBT_HOLDERS = {
  labels: ['Résidents français', 'Non-résidents'],
  data: [45.3, 54.7],
  colors: ['#00d4ff', '#ff4757'],
}

// Source: Banque de France, IFRAP T1 2025 - Principaux détenteurs identifiables
// Note: Le détail des non-résidents n'est pas publié officiellement par l'AFT
// Dette négociable ~2 660 Md€ (sur 3 482 Md€ de dette totale)
const PRINCIPAUX_DETENTEURS = [
  { nom: 'BCE / Banque de France', montant: 665, percent: 25, type: 'France' },
  { nom: 'Assurances françaises', montant: 278, percent: 10.5, type: 'France' },
  { nom: 'Banques françaises', montant: 261, percent: 9.8, type: 'France' },
  { nom: 'Non-résidents (détail non publié)', montant: 1456, percent: 54.7, type: 'Étranger' },
]

// Source: PLF 2025, Cour des Comptes, Fipeco - Charge d'intérêts (Md€) + comparaison budget Défense
const CHARGE_INTERETS = {
  labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025 (p)', '2026 (p)', '2027 (p)', 'Défense'],
  data: [38, 35, 37, 46, 52, 58, 60, 65, 72, 57],
}

// Source: Banque de France - Taux OAT 10 ans (%)
const TAUX_OAT = {
  labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  data: [0.1, -0.3, 0.2, 2.4, 3.1, 3.0, 3.2],
}

// Source: Eurostat avril 2025 - Déficits publics zone euro 2024 (% PIB)
const DEFICIT_COMPARISON = [
  { country: '🇫🇷 France', value: -5.8, highlight: true },
  { country: '🇧🇪 Belgique', value: -4.4 },
  { country: '🇮🇹 Italie', value: -3.4 },
  { country: '🇪🇸 Espagne', value: -2.8 },
  { country: '🇪🇺 Moy. zone €', value: -3.1, isAverage: true },
  { country: '🇩🇪 Allemagne', value: -2.8 },
  { country: '🇳🇱 Pays-Bas', value: -0.3 },
  { country: '🇵🇹 Portugal', value: +0.5 },
  { country: '🇮🇪 Irlande', value: +4.0 },
]

// Source: Eurostat 2025 - Dette publique zone euro (% PIB)
const DETTE_COMPARISON = [
  { country: '🇬🇷 Grèce', value: 153 },
  { country: '🇮🇹 Italie', value: 137 },
  { country: '🇫🇷 France', value: 117, highlight: true },
  { country: '🇪🇸 Espagne', value: 102 },
  { country: '🇧🇪 Belgique', value: 105 },
  { country: '🇵🇹 Portugal', value: 96 },
  { country: '🇪🇺 Moy. zone €', value: 83, isAverage: true },
  { country: '🇩🇪 Allemagne', value: 64 },
  { country: '🇳🇱 Pays-Bas', value: 43 },
]

// Source: Eurostat 2025, calcul dette / population - Dette par habitant en €
const DETTE_PAR_HABITANT = [
  { country: '🇧🇪 Belgique', value: 52200 },
  { country: '🇫🇷 France', value: 50800, highlight: true },
  { country: '🇮🇹 Italie', value: 47500 },
  { country: '🇬🇷 Grèce', value: 37500 },
  { country: '🇪🇸 Espagne', value: 31900 },
  { country: '🇩🇪 Allemagne', value: 30700 },
  { country: '🇵🇹 Portugal', value: 26200 },
  { country: '🇳🇱 Pays-Bas', value: 25700 },
]

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
            Comprendre l&apos;endettement de la France.
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
            value="58 Md€/an"
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

        {/* Section 1: Évolution dette/PIB + Solde budgétaire */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartWrapper
            title="L'endettement a été multiplié par 6 en 50 ans"
            subtitle="Ratio dette/PIB de 1970 à 2025"
            height="350px"
            source="INSEE, FIPECO"
          >
            <LineChart
              labels={DEBT_RATIO_HISTORY.labels}
              datasets={[
                {
                  label: 'Dette / PIB',
                  data: DEBT_RATIO_HISTORY.ratio,
                  borderColor: '#ff4757',
                  backgroundColor: 'rgba(255, 71, 87, 0.15)',
                  fill: true,
                  borderWidth: 3,
                },
              ]}
              yMin={0}
              yMax={130}
              yCallback={(v) => `${v}%`}
              showLegend={false}
            />
          </ChartWrapper>

          <ChartWrapper
            title="Pas de budget équilibré depuis 1974"
            subtitle="Solde budgétaire en % du PIB"
            height="350px"
            source="INSEE, Vie Publique"
          >
            <BarChart
              labels={SOLDE_BUDGETAIRE_HISTORY.labels}
              data={SOLDE_BUDGETAIRE_HISTORY.solde}
              colors={(ctx) => {
                const value = SOLDE_BUDGETAIRE_HISTORY.solde[ctx.dataIndex]
                return value >= 0 ? '#00ff88' : '#ff4757'
              }}
              tooltipSuffix="% du PIB"
              yAxisSuffix="%"
              yMin={-10}
              yMax={2}
              showValues
            />
          </ChartWrapper>
        </div>

        {/* Section: Déficit comparé */}
        <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
          La France a le <span className="italic text-accent-red">pire déficit</span> de la zone euro
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <ChartWrapper
            title="Solde budgétaire 2024"
            subtitle="Déficit (↓) ou excédent (↑) en % du PIB"
            height="400px"
            source="Eurostat avril 2025"
          >
            <BarChart
              labels={DEFICIT_COMPARISON.map((c) => c.country)}
              data={DEFICIT_COMPARISON.map((c) => c.value)}
              colors={(ctx) =>
                DEFICIT_COMPARISON[ctx.dataIndex]?.highlight ? '#ff4757' :
                DEFICIT_COMPARISON[ctx.dataIndex]?.value > 0 ? '#00ff88' :
                DEFICIT_COMPARISON[ctx.dataIndex]?.isAverage ? '#ffd700' : '#64748b'
              }
              tooltipSuffix="% du PIB"
              yAxisSuffix="%"
              yMin={-8}
              yMax={6}
              showValues
            />
          </ChartWrapper>

          {/* Évolution du Portugal */}
          <ChartWrapper
            title="🇵🇹 Redressement des finances publiques du Portugal"
            subtitle="Solde budgétaire en % du PIB (2019-2024)"
            height="400px"
            source="Eurostat 2024"
          >
            <LineChart
              labels={['2019', '2020', '2021', '2022', '2023', '2024']}
              datasets={[
                {
                  label: '',
                  data: [0.1, -5.8, -2.9, -0.3, 1.2, 0.5],
                  borderColor: '#00ff88',
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  fill: true,
                  borderWidth: 3,
                },
              ]}
              yMin={-8}
              yMax={4}
              yCallback={(v) => `${Number(v) > 0 ? '+' : ''}${v}%`}
              showLegend={false}
            />
          </ChartWrapper>
        </div>

        {/* Section: Dette comparée */}
        <h2 className="font-serif text-2xl font-normal mb-6">
          La France, <span className="italic text-accent-red">3ème dette</span> de la zone euro
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <ChartWrapper
            title="Dette publique en zone euro"
            subtitle="En % du PIB (2025)"
            height="400px"
            source="Eurostat 2025"
          >
            <BarChart
              labels={DETTE_COMPARISON.map((c) => c.country)}
              data={DETTE_COMPARISON.map((c) => c.value)}
              colors={(ctx) =>
                DETTE_COMPARISON[ctx.dataIndex]?.highlight ? '#ff4757' :
                DETTE_COMPARISON[ctx.dataIndex]?.isAverage ? '#ffd700' : '#64748b'
              }
              tooltipSuffix="% du PIB"
              yAxisSuffix="%"
              yMin={0}
              yMax={180}
              showValues
            />
          </ChartWrapper>

          {/* Dette par habitant */}
          <ChartWrapper
            title="Dette publique par habitant"
            subtitle="En euros par habitant (2025)"
            height="400px"
            source="Eurostat 2025, calcul"
          >
            <BarChart
              labels={DETTE_PAR_HABITANT.map((c) => c.country)}
              data={DETTE_PAR_HABITANT.map((c) => c.value)}
              colors={(ctx) =>
                DETTE_PAR_HABITANT[ctx.dataIndex]?.highlight ? '#ff4757' : '#64748b'
              }
              tooltipSuffix=" €"
              yAxisSuffix=" €"
              yMin={0}
              yMax={60000}
              showValues
            />
          </ChartWrapper>
        </div>

        {/* Section: Charge d'intérêts */}
        <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
          Le <span className="italic text-accent-purple">coût</span> de la dette
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <ChartWrapper
            title="Intérêts bientôt supérieurs au budget de la Défense"
            subtitle="Charge d'intérêts de la dette (Md€)"
            height="400px"
            source="PLF 2025, Cour des Comptes"
          >
            <BarChart
              labels={CHARGE_INTERETS.labels}
              data={CHARGE_INTERETS.data}
              colors={(ctx) => {
                const label = CHARGE_INTERETS.labels[ctx.dataIndex]
                if (label === 'Défense') return '#ff4757'
                if (label?.includes('(p)')) return '#a855f7'
                return '#00d4ff'
              }}
              tooltipSuffix=" Md€"
              yAxisSuffix=" Md€"
              yMin={0}
              yMax={80}
              showValues
            />
          </ChartWrapper>

          <ChartWrapper
            title="Taux d'intérêt OAT 10 ans"
            subtitle="Coût d'emprunt de la France (%)"
            height="400px"
            source="Banque de France"
          >
            <LineChart
              labels={TAUX_OAT.labels}
              datasets={[
                {
                  label: 'Taux OAT 10 ans',
                  data: TAUX_OAT.data,
                  borderColor: '#ffd700',
                  backgroundColor: 'rgba(255, 215, 0, 0.15)',
                  fill: true,
                  borderWidth: 3,
                },
              ]}
              yMin={-1}
              yMax={4}
              yCallback={(v) => `${v}%`}
              showLegend={false}
            />
          </ChartWrapper>
        </div>

        {/* Info box charge d'intérêts */}
        <div className="bg-gradient-to-r from-accent-purple/10 to-accent-gold/10 border border-accent-purple/30 rounded-2xl p-6 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-mono text-3xl font-medium text-accent-purple">72 Md€</div>
              <div className="text-text-secondary text-sm mt-1">Charge prévue en 2027</div>
            </div>
            <div>
              <div className="font-mono text-3xl font-medium text-accent-gold">+90%</div>
              <div className="text-text-secondary text-sm mt-1">Hausse depuis 2020</div>
            </div>
            <div>
              <div className="font-mono text-3xl font-medium text-accent-red">4ème</div>
              <div className="text-text-secondary text-sm mt-1">Poste budgétaire</div>
            </div>
          </div>
        </div>

        {/* Section: Qui détient la dette */}
        <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
          Qui <span className="italic text-accent-electric">détient</span> la dette française ?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <ChartWrapper
            title="Répartition des détenteurs"
            subtitle="En % de la dette négociable (2 660 Md€)"
            height="400px"
            source="Banque de France, T1 2025"
          >
            <BarChart
              labels={DEBT_HOLDERS.labels}
              data={DEBT_HOLDERS.data}
              colors={DEBT_HOLDERS.colors}
              tooltipSuffix="%"
              yAxisSuffix="%"
              yMin={0}
              yMax={60}
              showValues
            />
          </ChartWrapper>

          {/* Principaux détenteurs identifiables */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Détail des détenteurs</h3>
            <p className="text-text-muted text-sm mb-6">Source : Banque de France, IFRAP T1 2025</p>
            <div className="space-y-4">
              {PRINCIPAUX_DETENTEURS.map((detenteur, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: detenteur.type === 'France' ? '#00d4ff' : '#ff4757'
                      }}
                    />
                    <span className="text-text-primary">{detenteur.nom}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-lg font-medium" style={{
                      color: detenteur.type === 'France' ? '#00d4ff' : '#ff4757'
                    }}>
                      {detenteur.montant} Md€
                    </span>
                    <span className="text-text-muted text-sm ml-2">({detenteur.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-glass-border">
              <div className="flex items-center gap-6 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent-electric" />
                  <span>Résidents français</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent-red" />
                  <span>Non-résidents</span>
                </div>
              </div>
              <p className="text-text-muted text-xs mt-3">
                Note : L&apos;AFT ne publie pas le détail des détenteurs non-résidents (fonds de pension, fonds souverains, etc.)
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

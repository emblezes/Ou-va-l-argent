'use client'

import { useState } from 'react'
import { useParams, redirect } from 'next/navigation'
import Link from 'next/link'
import { KpiCard } from '@/components/ui/KpiCard'
import { ChartWrapper, LineChart, BarChart, DoughnutChart } from '@/components/charts'
import { getCategoryById } from '@/lib/constants/depenses-categories'

// Total des dépenses pour calculer les pourcentages
const TOTAL_DEPENSES = 1670

// Seule la catégorie "retraites" est autorisée
const ALLOWED_CATEGORY = 'retraites'

// Données OCDE enrichies - Source: OCDE Pensions at a Glance 2025, COR 2024, DREES 2024
const OECD_DATA = {
  // Taux de remplacement net (pension/dernier salaire)
  replacementRates: [
    { country: 'Pays-Bas', value: 93.2, color: '#00ff88' },
    { country: 'Italie', value: 86.3, color: '#2a3a4a' },
    { country: 'Espagne', value: 84.7, color: '#2a3a4a' },
    { country: 'Autriche', value: 77.8, color: '#2a3a4a' },
    { country: 'France', value: 71.9, highlight: true, color: '#ff6b6b' },
    { country: 'OCDE moyenne', value: 63.2, color: '#ffd700' },
    { country: 'Allemagne', value: 52.0, color: '#2a3a4a' },
    { country: 'Royaume-Uni', value: 49.5, color: '#2a3a4a' },
    { country: 'États-Unis', value: 41.2, color: '#2a3a4a' },
  ],
  // Espérance de vie à 65 ans (années restantes)
  lifeExpectancy65: [
    { country: 'France (F)', value: 24.0, color: '#ff6b6b' },
    { country: 'Espagne (F)', value: 23.8, color: '#2a3a4a' },
    { country: 'Japon (F)', value: 23.7, color: '#2a3a4a' },
    { country: 'France (H)', value: 20.0, highlight: true, color: '#ff6b6b' },
    { country: 'OCDE (F)', value: 22.8, color: '#ffd700' },
    { country: 'OCDE (H)', value: 18.4, color: '#ffd700' },
  ],
  // Taux d'emploi des 55-64 ans
  seniorEmployment: [
    { country: 'Suède', value: 77.2, color: '#00ff88' },
    { country: 'Allemagne', value: 75.2, color: '#2a3a4a' },
    { country: 'Pays-Bas', value: 72.8, color: '#2a3a4a' },
    { country: 'Royaume-Uni', value: 67.4, color: '#2a3a4a' },
    { country: 'OCDE moyenne', value: 64.5, color: '#ffd700' },
    { country: 'France', value: 60.4, highlight: true, color: '#ff6b6b' },
    { country: 'Espagne', value: 57.8, color: '#2a3a4a' },
    { country: 'Italie', value: 55.4, color: '#2a3a4a' },
  ],
  // Projections démographiques COR
  projections: {
    retirees: [
      { year: '2024', value: 17.2 },
      { year: '2030', value: 18.5 },
      { year: '2040', value: 19.8 },
      { year: '2050', value: 20.5 },
      { year: '2070', value: 21.7 },
    ],
    ratio: [
      { year: '2024', value: 1.8 },
      { year: '2030', value: 1.6 },
      { year: '2040', value: 1.5 },
      { year: '2050', value: 1.4 },
      { year: '2070', value: 1.4 },
    ],
    deficit: [
      { year: '2024', value: -1.7 },
      { year: '2030', value: -6.6 },
      { year: '2040', value: -10.2 },
      { year: '2050', value: -8.5 },
      { year: '2070', value: -12.0 },
    ],
  },
  // Écart hommes-femmes
  genderGap: {
    ecartBrut: 38, // %
    ecartAvecReversion: 26, // %
    pensionMoyenneHommes: 2048, // €/mois
    pensionMoyenneFemmes: 1268, // €/mois
  },
}

export default function FocusRetraitePage() {
  const params = useParams()
  const categoryId = params.category as string

  // Redirection si ce n'est pas la page retraites
  if (categoryId !== ALLOWED_CATEGORY) {
    redirect('/depenses')
  }

  const category = getCategoryById(ALLOWED_CATEGORY)!
  const [activeTab, setActiveTab] = useState<'france' | 'comparaison'>('france')

  const per100 = ((category.amount / TOTAL_DEPENSES) * 100).toFixed(1)

  return (
    <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/depenses" className="hover:text-text-primary transition-colors">
          Dépenses
        </Link>
        <span>/</span>
        <span className="text-accent-red">Focus Retraite</span>
      </nav>

      {/* Header */}
      <header className="text-center mb-8">
        <div className="text-6xl mb-4">{category.icon}</div>
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
          Focus <span className="italic text-accent-red">Retraite</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Le 1er poste de dépenses publiques : {category.amount} milliards d&apos;euros par an.
          Analyse complète du système de retraites français.
        </p>
      </header>

      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-accent-red/15 to-accent-red/5 border border-accent-red/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-4xl">⚠️</span>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-accent-red">Le défi démographique</h3>
            <p className="text-text-secondary mb-3">
              Avec seulement 1,7 cotisant pour 1 retraité (contre 4 en 1960), le système par répartition
              est sous tension. L&apos;âge de départ français reste parmi les plus bas de l&apos;OCDE.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                <div className="font-mono text-xl font-bold text-accent-red">{category.amount} Md€</div>
                <div className="text-xs text-text-muted">Budget 2024</div>
              </div>
              <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                <div className="font-mono text-xl font-bold text-accent-gold">17M</div>
                <div className="text-xs text-text-muted">Retraités</div>
              </div>
              <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                <div className="font-mono text-xl font-bold text-accent-electric">62,4 ans</div>
                <div className="text-xs text-text-muted">Âge moyen départ</div>
              </div>
              <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                <div className="font-mono text-xl font-bold text-accent-purple">1,7</div>
                <div className="text-xs text-text-muted">Ratio cotisants/retraités</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex justify-center gap-2 mb-10">
        <button
          onClick={() => setActiveTab('france')}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'france'
              ? 'bg-accent-red text-white'
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
              ? 'bg-accent-red text-white'
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
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
              icon={category.icon}
              label="Budget total"
              value={`${category.amount} Md€`}
              subtext="Dépenses 2024"
              color="red"
            />
            <KpiCard
              icon="📊"
              label="Part du budget"
              value={`${per100}%`}
              subtext="1er poste de dépenses"
              color="gold"
            />
            <KpiCard
              icon="💶"
              label="Sur 100€ publics"
              value={`${per100}€`}
              subtext="Répartition citoyenne"
              color="green"
            />
            <KpiCard
              icon="📈"
              label="Évolution"
              value={`+${Math.round(((category.france.evolution[category.france.evolution.length - 1].value / category.france.evolution[0].value) - 1) * 100)}%`}
              subtext="Sur 10 ans"
              color="purple"
            />
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-accent-red/10 to-accent-red/5 border border-accent-red/20 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="text-5xl">{category.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">Les différents régimes de retraite</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-secondary">
                      <span className="text-accent-red">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Évolution */}
            <ChartWrapper
              title="Évolution des dépenses de retraites"
              subtitle="En milliards d'euros"
              height="350px"
              source="DREES 2024"
            >
              <LineChart
                labels={category.france.evolution.map(e => e.year)}
                datasets={[
                  {
                    label: 'Retraites',
                    data: category.france.evolution.map(e => e.value),
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    fill: true,
                    borderWidth: 3,
                  },
                ]}
                yMin={Math.min(...category.france.evolution.map(e => e.value)) * 0.9}
                yMax={Math.max(...category.france.evolution.map(e => e.value)) * 1.1}
                yCallback={(v) => `${v} Md€`}
              />
            </ChartWrapper>

            {/* Répartition par régime */}
            {category.france.breakdown && (
              <ChartWrapper
                title="Répartition par régime"
                subtitle="Part de chaque régime dans les dépenses"
                height="350px"
                source="DREES 2024"
              >
                <DoughnutChart
                  labels={category.france.breakdown.map(b => b.name)}
                  data={category.france.breakdown.map(b => b.percent)}
                  colors={[
                    '#ff6b6b', '#ff8787', '#ffa8a8', '#ffc9c9',
                    '#ffe3e3', '#fff5f5', '#e8e8e8'
                  ]}
                  tooltipSuffix="%"
                />
              </ChartWrapper>
            )}
          </div>

          {/* Key Facts */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">📌 Chiffres clés des retraites</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.france.keyFacts.map((fact, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-accent-red">
                    {i + 1}
                  </span>
                  <p className="text-text-secondary text-sm">{fact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown Table */}
          {category.france.breakdown && (
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-5 mb-8">
              <h3 className="text-base font-semibold mb-4">Détail par régime de retraite</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-glass-border">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">Régime</th>
                      <th className="text-right py-3 px-4 font-medium text-text-secondary">Montant</th>
                      <th className="text-right py-3 px-4 font-medium text-text-secondary">Part</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.france.breakdown.map((item, i) => (
                      <tr key={i} className="border-b border-glass-border/50 hover:bg-bg-elevated/50">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4 text-right font-mono">{item.amount} Md€</td>
                        <td className="py-3 px-4 text-right font-mono text-text-secondary">{item.percent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================ */}
      {/* TAB COMPARAISON */}
      {/* ============================================ */}
      {activeTab === 'comparaison' && (
        <>
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-accent-red/10 to-accent-red/5 border border-accent-red/20 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="text-5xl">🌍</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  Retraites : la France face au monde
                </h3>
                <p className="text-text-secondary">
                  La France consacre 14,5% de son PIB aux retraites, se plaçant au 3ème rang européen
                  derrière l&apos;Italie et la Grèce. Le système français est principalement par répartition,
                  contrairement à l&apos;Allemagne ou aux Pays-Bas qui misent sur la capitalisation.
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* EU Comparison */}
            <ChartWrapper
              title="Union Européenne"
              subtitle="Dépenses de retraites en % du PIB"
              height="400px"
              source="Eurostat 2024"
            >
              <BarChart
                labels={category.comparison.eu.map(c => c.country)}
                data={category.comparison.eu.map(c => c.value)}
                colors={(ctx) =>
                  category.comparison.eu[ctx.dataIndex]?.highlight ? '#ff6b6b' : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>

            {/* OECD Comparison */}
            {category.comparison.oecd && (
              <ChartWrapper
                title="OCDE"
                subtitle="Dépenses de retraites en % du PIB"
                height="400px"
                source="OCDE 2024"
              >
                <BarChart
                  labels={category.comparison.oecd.map(c => c.country)}
                  data={category.comparison.oecd.map(c => c.value)}
                  colors={(ctx) =>
                    category.comparison.oecd![ctx.dataIndex]?.highlight ? '#ff6b6b' : '#2a3a4a'
                  }
                  horizontal
                  tooltipSuffix="% du PIB"
                />
              </ChartWrapper>
            )}
          </div>

          {/* Âge de départ comparé */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">🎂 Âge de départ à la retraite</h3>
            <p className="text-text-secondary text-sm mb-4">
              Même après la réforme de 2023 (passage à 64 ans), l&apos;âge de départ français reste parmi les plus bas de l&apos;OCDE.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { country: '🇯🇵 Japon', age: 65 },
                { country: '🇩🇪 Allemagne', age: 67 },
                { country: '🇬🇧 Royaume-Uni', age: 66 },
                { country: '🇺🇸 États-Unis', age: 67 },
                { country: '🇮🇹 Italie', age: 67 },
                { country: '🇫🇷 France', age: 64, highlight: true },
              ].map((item) => (
                <div
                  key={item.country}
                  className={`p-3 rounded-lg text-center ${item.highlight ? 'bg-accent-red/10 border border-accent-red/30' : 'bg-bg-elevated'}`}
                >
                  <div className="text-sm mb-1">{item.country}</div>
                  <div className={`font-mono text-xl font-bold ${item.highlight ? 'text-accent-red' : 'text-text-primary'}`}>
                    {item.age} ans
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">📊 Points clés de la comparaison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.comparison.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-accent-red">
                    {i + 1}
                  </span>
                  <p className="text-text-secondary text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section OCDE : Taux de remplacement */}
          <h2 className="font-serif text-xl font-normal mb-4">
            Taux de <span className="italic text-accent-gold">remplacement</span> comparé
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartWrapper
              title="Pension / Dernier salaire (net)"
              subtitle="Taux de remplacement OCDE 2024"
              height="350px"
              source="OCDE Pensions at a Glance 2025"
            >
              <BarChart
                labels={OECD_DATA.replacementRates.map(c => c.country)}
                data={OECD_DATA.replacementRates.map(c => c.value)}
                colors={(ctx) =>
                  OECD_DATA.replacementRates[ctx.dataIndex]?.highlight ? '#ff6b6b' :
                  OECD_DATA.replacementRates[ctx.dataIndex]?.color
                }
                horizontal
                tooltipSuffix="%"
              />
            </ChartWrapper>

            <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Ce que révèlent ces chiffres</h3>
              <div className="space-y-3">
                <div className="p-3 bg-bg-elevated rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong className="text-accent-gold">71,9%</strong> — La France offre un taux de remplacement
                    supérieur à la moyenne OCDE (63,2%), mais loin des Pays-Bas (93%).
                  </p>
                </div>
                <div className="p-3 bg-bg-elevated rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong className="text-accent-electric">Paradoxe allemand :</strong> Malgré 11,3% du PIB consacré
                    aux retraites, le taux de remplacement n&apos;est que de 52%. Les Allemands doivent épargner en complément.
                  </p>
                </div>
                <div className="p-3 bg-bg-elevated rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong className="text-accent-green">Modèle néerlandais :</strong> 93% de taux grâce à la capitalisation
                    obligatoire. Les fonds de pension gèrent 63 000 Md$ d&apos;actifs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section : Taux d'emploi des seniors */}
          <h2 className="font-serif text-xl font-normal mb-4">
            Emploi des <span className="italic text-accent-purple">seniors</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartWrapper
              title="Taux d'emploi des 55-64 ans"
              subtitle="Population active senior (2024)"
              height="300px"
              source="OCDE 2024"
            >
              <BarChart
                labels={OECD_DATA.seniorEmployment.map(c => c.country)}
                data={OECD_DATA.seniorEmployment.map(c => c.value)}
                colors={(ctx) =>
                  OECD_DATA.seniorEmployment[ctx.dataIndex]?.highlight ? '#ff6b6b' :
                  OECD_DATA.seniorEmployment[ctx.dataIndex]?.color
                }
                horizontal
                tooltipSuffix="%"
              />
            </ChartWrapper>

            <div className="bg-gradient-to-r from-accent-purple/10 to-accent-purple/5 border border-accent-purple/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">🎯 Levier d&apos;économies majeur</h3>
              <p className="text-text-secondary text-sm mb-4">
                La France a un taux d&apos;emploi des seniors de 60,4%, contre 75,2% en Allemagne.
                Chaque point de taux d&apos;emploi supplémentaire = plus de cotisants et moins de retraités.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                  <div className="font-mono text-2xl font-bold text-accent-purple">+15 pts</div>
                  <div className="text-xs text-text-muted">Écart France-Allemagne</div>
                </div>
                <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                  <div className="font-mono text-2xl font-bold text-accent-green">+10 pts</div>
                  <div className="text-xs text-text-muted">Progression 2000-2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section : Écart hommes-femmes */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">👫 Écart de pension hommes-femmes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-bg-elevated rounded-xl p-4 text-center">
                <div className="font-mono text-3xl font-bold text-accent-red">-38%</div>
                <div className="text-sm text-text-secondary mt-1">Écart brut H/F</div>
                <div className="text-xs text-text-muted mt-1">Sans réversion</div>
              </div>
              <div className="bg-bg-elevated rounded-xl p-4 text-center">
                <div className="font-mono text-3xl font-bold text-accent-gold">-26%</div>
                <div className="text-sm text-text-secondary mt-1">Écart avec réversion</div>
                <div className="text-xs text-text-muted mt-1">Droits dérivés inclus</div>
              </div>
              <div className="bg-bg-elevated rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Hommes</span>
                  <span className="font-mono font-bold">{OECD_DATA.genderGap.pensionMoyenneHommes} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Femmes</span>
                  <span className="font-mono font-bold">{OECD_DATA.genderGap.pensionMoyenneFemmes} €</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-muted">
              Source : DREES 2024. L&apos;écart s&apos;explique par les carrières plus courtes et les salaires plus bas des femmes.
            </p>
          </div>

          {/* Modèle de financement */}
          <div className="bg-gradient-to-r from-accent-gold/10 to-accent-gold/5 border border-accent-gold/20 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">💡 Répartition vs Capitalisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-bg-surface/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🔄</span>
                  <h4 className="font-semibold">Répartition (France)</h4>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Les cotisations des actifs financent directement les pensions des retraités.
                  Sensible au ratio cotisants/retraités.
                </p>
                <div className="text-accent-red font-mono font-bold">~95% des retraites françaises</div>
              </div>
              <div className="bg-bg-surface/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-semibold">Capitalisation (Pays-Bas, USA)</h4>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Chaque actif épargne pour sa propre retraite via des fonds de pension.
                  Sensible aux marchés financiers.
                </p>
                <div className="text-accent-green font-mono font-bold">~60% aux Pays-Bas</div>
              </div>
            </div>
          </div>

          {/* Modèles internationaux */}
          <h2 className="font-serif text-xl font-normal mb-4">
            Modèles <span className="italic text-accent-electric">alternatifs</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🇸🇪</span>
                <h4 className="font-semibold">Suède</h4>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                <strong>Comptes notionnels</strong> : Chaque actif a un compte virtuel qui accumule
                ses cotisations + rendement PIB. Conversion en rente à la retraite.
              </p>
              <div className="text-xs bg-bg-elevated rounded-lg p-2">
                <strong>86%</strong> répartition + <strong>14%</strong> capitalisation obligatoire
              </div>
            </div>
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🇳🇱</span>
                <h4 className="font-semibold">Pays-Bas</h4>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                <strong>Capitalisation forte</strong> : Pension de base universelle + fonds de pension
                collectifs obligatoires (63 000 Md$ gérés).
              </p>
              <div className="text-xs bg-bg-elevated rounded-lg p-2">
                Taux de remplacement <strong>93%</strong> (record OCDE)
              </div>
            </div>
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🇮🇹</span>
                <h4 className="font-semibold">Italie</h4>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                <strong>Transition en cours</strong> : Passage progressif aux comptes notionnels depuis 1995.
                Ajustement automatique à l&apos;espérance de vie.
              </p>
              <div className="text-xs bg-bg-elevated rounded-lg p-2">
                Transition complète en <strong>2060</strong>
              </div>
            </div>
          </div>

          {/* Projections COR */}
          <div className="bg-gradient-to-r from-accent-red/15 to-accent-red/5 border border-accent-red/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">📉 Projections COR à 2070</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                <div className="text-sm text-text-muted mb-1">Retraités 2070</div>
                <div className="font-mono text-2xl font-bold text-accent-red">21,7M</div>
                <div className="text-xs text-text-muted">+4,5M vs 2024</div>
              </div>
              <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                <div className="text-sm text-text-muted mb-1">Ratio cotisants</div>
                <div className="font-mono text-2xl font-bold text-accent-gold">1,4</div>
                <div className="text-xs text-text-muted">vs 1,8 en 2024</div>
              </div>
              <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                <div className="text-sm text-text-muted mb-1">Déficit 2030</div>
                <div className="font-mono text-2xl font-bold text-accent-red">-6,6 Md€</div>
                <div className="text-xs text-text-muted">-0,2% du PIB</div>
              </div>
              <div className="bg-bg-surface/50 rounded-lg p-3 text-center">
                <div className="text-sm text-text-muted mb-1">Déficit 2070</div>
                <div className="font-mono text-2xl font-bold text-accent-red">-12 Md€</div>
                <div className="text-xs text-text-muted">-0,4% du PIB</div>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              <strong className="text-accent-red">Conclusion COR 2024 :</strong> Le système sera durablement déficitaire.
              La réforme 2023 n&apos;a pas suffi à rétablir l&apos;équilibre à long terme.
            </p>
          </div>
        </>
      )}

      {/* Retour */}
      <div className="border-t border-glass-border pt-8 text-center">
        <Link
          href="/depenses"
          className="inline-flex items-center gap-2 px-6 py-3 bg-bg-surface border border-glass-border rounded-xl hover:border-accent-electric/50 transition-colors"
        >
          <span>←</span>
          <span>Retour à la vue d&apos;ensemble des dépenses</span>
        </Link>
      </div>

      {/* Sources */}
      <div className="text-center py-6 mt-8 border-t border-glass-border">
        <p className="text-text-muted text-sm">
          Sources : DREES, INSEE, Eurostat, OCDE (2024)
        </p>
      </div>
    </main>
  )
}

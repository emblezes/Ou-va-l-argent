'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { KpiCard } from '@/components/ui/KpiCard'
import { ChartWrapper, LineChart, BarChart, DoughnutChart } from '@/components/charts'
import { getCategoryById, DEPENSES_CATEGORIES } from '@/lib/constants/depenses-categories'

// Total des dépenses pour calculer les pourcentages
const TOTAL_DEPENSES = 1670

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.category as string
  const category = getCategoryById(categoryId)

  const [activeTab, setActiveTab] = useState<'france' | 'comparaison'>('france')

  if (!category) {
    notFound()
  }

  const per100 = ((category.amount / TOTAL_DEPENSES) * 100).toFixed(1)

  return (
    <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/depenses" className="hover:text-text-primary transition-colors">
          Dépenses
        </Link>
        <span>/</span>
        <span className="text-text-primary">{category.name}</span>
      </nav>

      {/* Header */}
      <header className="text-center mb-8">
        <div className="text-5xl mb-4">{category.icon}</div>
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
          <span className="italic" style={{ color: category.color }}>{category.name}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {category.description}
        </p>
      </header>

      {/* Tab Selector */}
      <div className="flex justify-center gap-2 mb-10">
        <button
          onClick={() => setActiveTab('france')}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'france'
              ? 'text-bg-deep'
              : 'bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-glass-border/50'
          }`}
          style={{ backgroundColor: activeTab === 'france' ? category.color : undefined }}
        >
          <span className="text-lg">🇫🇷</span>
          France
        </button>
        <button
          onClick={() => setActiveTab('comparaison')}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'comparaison'
              ? 'text-bg-deep'
              : 'bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-glass-border/50'
          }`}
          style={{ backgroundColor: activeTab === 'comparaison' ? category.color : undefined }}
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
              color="electric"
            />
            <KpiCard
              icon="📊"
              label="Part du budget"
              value={`${per100}%`}
              subtext="Sur 100€ de dépenses"
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
              value={category.france.evolution.length > 1
                ? `+${Math.round(((category.france.evolution[category.france.evolution.length - 1].value / category.france.evolution[0].value) - 1) * 100)}%`
                : 'N/A'
              }
              subtext="Sur 10 ans"
              color="purple"
            />
          </div>

          {/* Info Banner */}
          <div
            className="rounded-2xl p-6 mb-8 flex flex-col lg:flex-row gap-6 items-center"
            style={{
              background: `linear-gradient(to right, ${category.color}15, ${category.color}05)`,
              border: `1px solid ${category.color}30`
            }}
          >
            <div className="text-5xl">{category.icon}</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-3">Ce que comprend ce poste</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-text-secondary">
                    <span style={{ color: category.color }}>•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Évolution */}
            <ChartWrapper
              title={`Évolution des dépenses de ${category.name.toLowerCase()}`}
              subtitle="En milliards d'euros"
              height="350px"
              source="INSEE, DREES"
            >
              <LineChart
                labels={category.france.evolution.map(e => e.year)}
                datasets={[
                  {
                    label: category.name,
                    data: category.france.evolution.map(e => e.value),
                    borderColor: category.color,
                    backgroundColor: `${category.color}20`,
                    fill: true,
                    borderWidth: 3,
                  },
                ]}
                yMin={Math.min(...category.france.evolution.map(e => e.value)) * 0.9}
                yMax={Math.max(...category.france.evolution.map(e => e.value)) * 1.1}
                yCallback={(v) => `${v} Md€`}
              />
            </ChartWrapper>

            {/* Répartition (si disponible) */}
            {category.france.breakdown && (
              <ChartWrapper
                title="Répartition détaillée"
                subtitle="Par sous-catégorie"
                height="350px"
                source="DREES 2024"
              >
                <DoughnutChart
                  labels={category.france.breakdown.map(b => b.name)}
                  data={category.france.breakdown.map(b => b.percent)}
                  colors={category.france.breakdown.map((_, i) =>
                    `hsl(${(i * 360) / category.france.breakdown!.length + 200}, 70%, 50%)`
                  )}
                  tooltipSuffix="%"
                />
              </ChartWrapper>
            )}
          </div>

          {/* Key Facts */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">📌 Chiffres clés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.france.keyFacts.map((fact, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-text-secondary text-sm">{fact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown Table (si disponible) */}
          {category.france.breakdown && (
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-5 mb-8">
              <h3 className="text-base font-semibold mb-4">Détail par sous-catégorie</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-glass-border">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">Catégorie</th>
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
          <div
            className="rounded-2xl p-6 mb-8 flex flex-col lg:flex-row gap-6 items-center"
            style={{
              background: `linear-gradient(to right, ${category.color}15, ${category.color}05)`,
              border: `1px solid ${category.color}30`
            }}
          >
            <div className="text-5xl">🌍</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {category.name} : la France face au monde
              </h3>
              <p className="text-text-secondary">
                Comparaison des dépenses de {category.name.toLowerCase()} entre la France et les autres pays développés (en % du PIB).
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* EU Comparison */}
            <ChartWrapper
              title="Union Européenne"
              subtitle={`Dépenses de ${category.name.toLowerCase()} en % du PIB`}
              height="400px"
              source="Eurostat 2024"
            >
              <BarChart
                labels={category.comparison.eu.map(c => c.country)}
                data={category.comparison.eu.map(c => c.value)}
                colors={(ctx) =>
                  category.comparison.eu[ctx.dataIndex]?.highlight ? category.color : '#2a3a4a'
                }
                horizontal
                tooltipSuffix="% du PIB"
              />
            </ChartWrapper>

            {/* OECD Comparison (si disponible) */}
            {category.comparison.oecd && (
              <ChartWrapper
                title="OCDE"
                subtitle={`Dépenses de ${category.name.toLowerCase()} en % du PIB`}
                height="400px"
                source="OCDE 2024"
              >
                <BarChart
                  labels={category.comparison.oecd.map(c => c.country)}
                  data={category.comparison.oecd.map(c => c.value)}
                  colors={(ctx) =>
                    category.comparison.oecd![ctx.dataIndex]?.highlight ? category.color : '#2a3a4a'
                  }
                  horizontal
                  tooltipSuffix="% du PIB"
                />
              </ChartWrapper>
            )}
          </div>

          {/* Insights */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">📊 Points clés de la comparaison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.comparison.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-text-secondary text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Navigation vers autres catégories */}
      <div className="border-t border-glass-border pt-8">
        <h3 className="text-lg font-semibold mb-4 text-center">Explorer d&apos;autres postes de dépenses</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {DEPENSES_CATEGORIES.filter(c => c.id !== categoryId).slice(0, 6).map(cat => (
            <Link
              key={cat.id}
              href={`/depenses/${cat.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-glass-border rounded-lg hover:border-accent-electric/50 transition-colors"
            >
              <span>{cat.icon}</span>
              <span className="text-sm text-text-secondary">{cat.name.split('(')[0].trim()}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="text-center py-6 mt-8 border-t border-glass-border">
        <p className="text-text-muted text-sm">
          Sources : INSEE, DREES, Eurostat, OCDE (2024)
        </p>
      </div>
    </main>
  )
}

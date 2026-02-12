'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { ChartWrapper, LineChart } from '@/components/charts'

// Presets de rendement
const PRESETS = [
  { label: 'Livret A', taux: 1.5, color: '#00ff88' },
  { label: 'Fonds €', taux: 2.5, color: '#8899a8' },
  { label: 'CAC 40', taux: 8.5, color: '#ff9f43' },
  { label: 'MSCI World', taux: 10.0, color: '#00d4ff' },
]

// ====== FAQ SIMULATEUR ======
const FAQ_ITEMS = [
  {
    question: 'Comment fonctionnent les intérêts composés ?',
    answer: "Les intérêts composés sont des intérêts calculés non seulement sur le capital initial, mais aussi sur les intérêts déjà accumulés. Autrement dit, vos intérêts génèrent eux-mêmes des intérêts. C'est ce qu'on appelle l'« effet boule de neige » : plus le temps passe, plus l'accélération est forte. Les intérêts composés sont souvent qualifiés de « huitième merveille du monde » par les investisseurs.",
    emoji: '🔄',
  },
  {
    question: 'Quelle est la formule des intérêts composés ?',
    answer: "La formule de base est : Capital final = Capital initial × (1 + taux)^durée. Avec des versements réguliers, on ajoute : Versement × [((1 + taux)^durée − 1) / taux]. Dans ce simulateur, le calcul est mensuel : le taux annuel est divisé par 12, et les versements sont ajoutés chaque mois avant le calcul des intérêts du mois suivant.",
    emoji: '🧮',
  },
  {
    question: 'Combien rapportent 200 € par mois pendant 20 ans ?',
    answer: "Avec un rendement de 7 % par an (moyenne historique bourse) : vous aurez versé 48 000 € au total, et votre capital atteindra environ 104 000 €. Les intérêts composés auront donc doublé votre mise ! À 10 % (MSCI World historique), le capital atteint environ 152 000 €. À 1,5 % (Livret A en 2026), environ 56 000 €. La différence de rendement, même faible, a un impact considérable sur le long terme.",
    emoji: '💶',
  },
]

function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export default function SimulateurContent() {
  const [capitalInitial, setCapitalInitial] = useState(10000)
  const [versementMensuel, setVersementMensuel] = useState(200)
  const [duree, setDuree] = useState(20)
  const [tauxRendement, setTauxRendement] = useState(7)
  const [inflation, setInflation] = useState(2)
  const [showTable, setShowTable] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const faqSchema = generateFAQSchema()

  // Calcul des intérêts composés
  const results = useMemo(() => {
    const tauxMensuel = tauxRendement / 100 / 12
    const yearlyData: { annee: number; totalVerse: number; capitalTotal: number; interets: number }[] = []

    let capital = capitalInitial
    let totalVerse = capitalInitial

    for (let annee = 1; annee <= duree; annee++) {
      for (let mois = 1; mois <= 12; mois++) {
        capital = capital * (1 + tauxMensuel) + versementMensuel
        totalVerse += versementMensuel
      }
      yearlyData.push({
        annee,
        totalVerse: Math.round(totalVerse),
        capitalTotal: Math.round(capital),
        interets: Math.round(capital - totalVerse),
      })
    }

    const capitalFinal = Math.round(capital)
    const totalVerseTotal = Math.round(totalVerse)
    const totalInterets = capitalFinal - totalVerseTotal
    const capitalReel = Math.round(capitalFinal / Math.pow(1 + inflation / 100, duree))

    return { capitalFinal, totalVerseTotal, totalInterets, capitalReel, yearlyData }
  }, [capitalInitial, versementMensuel, duree, tauxRendement, inflation])

  // Données du graphique
  const chartLabels = results.yearlyData.map((d) => `${d.annee}`)
  const chartDatasets = [
    {
      label: 'Total versé',
      data: results.yearlyData.map((d) => d.totalVerse),
      borderColor: '#64748b',
      backgroundColor: 'rgba(100, 116, 139, 0.2)',
      fill: true,
      borderWidth: 2,
      tension: 0.3,
    },
    {
      label: 'Capital total',
      data: results.yearlyData.map((d) => d.capitalTotal),
      borderColor: '#ff9f43',
      backgroundColor: 'rgba(255, 159, 67, 0.15)',
      fill: true,
      borderWidth: 3,
      tension: 0.3,
    },
  ]

  const formatMoney = (n: number) =>
    n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

  return (
    <div className="relative min-h-screen">
      {/* Orange gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255, 159, 67, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
            Construisez votre <span className="italic text-accent-orange">retraite par capitalisation</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            L&apos;État ne pourra pas financer votre retraite comme celle de vos parents.
            Les intérêts composés sont votre meilleur allié pour construire votre indépendance financière.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Inputs */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6">Paramètres</h2>

            {/* Capital initial */}
            <div className="mb-5">
              <label className="block text-text-muted text-sm mb-2">Capital initial</label>
              <div className="relative">
                <input
                  type="number"
                  value={capitalInitial}
                  onChange={(e) => setCapitalInitial(Math.max(0, Number(e.target.value)))}
                  step={1000}
                  min={0}
                  className="w-full px-4 py-3 pr-10 bg-bg-elevated border border-glass-border rounded-lg text-text-primary font-mono text-lg focus:outline-none focus:border-accent-orange transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">€</span>
              </div>
            </div>

            {/* Versement mensuel */}
            <div className="mb-5">
              <label className="block text-text-muted text-sm mb-2">Versement mensuel</label>
              <div className="relative">
                <input
                  type="number"
                  value={versementMensuel}
                  onChange={(e) => setVersementMensuel(Math.max(0, Number(e.target.value)))}
                  step={50}
                  min={0}
                  className="w-full px-4 py-3 pr-14 bg-bg-elevated border border-glass-border rounded-lg text-text-primary font-mono text-lg focus:outline-none focus:border-accent-orange transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">€/mois</span>
              </div>
            </div>

            {/* Durée */}
            <div className="mb-5">
              <label className="block text-text-muted text-sm mb-2">
                Durée : <span className="text-accent-orange font-mono">{duree} ans</span>
              </label>
              <input
                type="range"
                value={duree}
                onChange={(e) => setDuree(Number(e.target.value))}
                min={1}
                max={40}
                className="w-full h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />
              <div className="flex justify-between text-text-muted text-xs mt-1">
                <span>1 an</span>
                <span>40 ans</span>
              </div>
            </div>

            {/* Taux de rendement */}
            <div className="mb-5">
              <label className="block text-text-muted text-sm mb-2">
                Rendement annuel : <span className="text-accent-orange font-mono">{tauxRendement}%</span>
              </label>
              <input
                type="range"
                value={tauxRendement * 10}
                onChange={(e) => setTauxRendement(Number(e.target.value) / 10)}
                min={10}
                max={150}
                className="w-full h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />
              <div className="flex justify-between text-text-muted text-xs mt-1">
                <span>1%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Presets */}
            <div className="mb-5">
              <label className="block text-text-muted text-sm mb-2">Presets</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setTauxRendement(preset.taux)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      tauxRendement === preset.taux
                        ? 'border-accent-orange bg-accent-orange/20 text-accent-orange'
                        : 'border-glass-border bg-bg-elevated text-text-secondary hover:text-text-primary hover:border-glass-border/50'
                    }`}
                  >
                    {preset.label} ({preset.taux}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Inflation */}
            <div className="mb-2">
              <label className="block text-text-muted text-sm mb-2">
                Inflation : <span className="text-text-secondary font-mono">{inflation}%</span>
              </label>
              <input
                type="range"
                value={inflation * 10}
                onChange={(e) => setInflation(Number(e.target.value) / 10)}
                min={0}
                max={50}
                className="w-full h-1.5 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-text-muted"
              />
              <div className="flex justify-between text-text-muted text-xs mt-1">
                <span>0%</span>
                <span>5%</span>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            {/* Cards résultats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-bg-surface border border-glass-border rounded-xl p-5 text-center">
                <div className="text-text-muted text-xs uppercase tracking-wider mb-2">Capital final</div>
                <div className="font-mono text-2xl sm:text-3xl font-medium text-accent-orange">
                  {formatMoney(results.capitalFinal)}
                </div>
              </div>
              <div className="bg-bg-surface border border-glass-border rounded-xl p-5 text-center">
                <div className="text-text-muted text-xs uppercase tracking-wider mb-2">Total versé</div>
                <div className="font-mono text-2xl sm:text-3xl font-medium text-text-secondary">
                  {formatMoney(results.totalVerseTotal)}
                </div>
              </div>
              <div className="bg-bg-surface border border-glass-border rounded-xl p-5 text-center">
                <div className="text-text-muted text-xs uppercase tracking-wider mb-2">Intérêts gagnés</div>
                <div className="font-mono text-2xl sm:text-3xl font-medium text-accent-green">
                  {formatMoney(results.totalInterets)}
                </div>
              </div>
            </div>

            {/* Capital réel */}
            <div className="bg-bg-surface/50 border border-glass-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-text-muted text-sm">Capital réel </span>
                <span className="text-text-muted text-xs">(ajusté de l&apos;inflation à {inflation}%)</span>
              </div>
              <div className="font-mono text-xl font-medium text-accent-gold">
                {formatMoney(results.capitalReel)}
              </div>
            </div>

            {/* Multiplicateur */}
            <div className="bg-gradient-to-r from-accent-orange/10 to-accent-green/10 border border-accent-orange/30 rounded-xl p-4 text-center">
              <span className="text-text-secondary text-sm">Vos versements ont été multipliés par </span>
              <span className="font-mono text-2xl font-medium text-accent-orange">
                ×{(results.capitalFinal / results.totalVerseTotal).toFixed(1)}
              </span>
            </div>

            {/* Graphique */}
            <ChartWrapper
              title="Évolution de votre capital"
              subtitle="Versements cumulés vs capital total (intérêts composés)"
              height="300px"
              source=""
            >
              <LineChart
                labels={chartLabels}
                datasets={chartDatasets}
                yMin={0}
                yCallback={(v) => `${(Number(v) / 1000).toFixed(0)}k€`}
                showLegend={true}
              />
            </ChartWrapper>
          </div>
        </div>

        {/* Tableau année par année */}
        <div className="mb-10">
          <button
            onClick={() => setShowTable(!showTable)}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${showTable ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-sm font-medium">
              {showTable ? 'Masquer' : 'Afficher'} le détail année par année
            </span>
          </button>

          {showTable && (
            <div className="bg-bg-surface border border-glass-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-glass-border">
                      <th className="px-4 py-3 text-left text-text-muted font-medium">Année</th>
                      <th className="px-4 py-3 text-right text-text-muted font-medium">Total versé</th>
                      <th className="px-4 py-3 text-right text-text-muted font-medium">Intérêts</th>
                      <th className="px-4 py-3 text-right text-text-muted font-medium">Capital total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyData.map((row) => (
                      <tr key={row.annee} className="border-b border-glass-border/50 hover:bg-bg-elevated/50">
                        <td className="px-4 py-2.5 font-mono text-text-primary">{row.annee}</td>
                        <td className="px-4 py-2.5 font-mono text-right text-text-secondary">
                          {formatMoney(row.totalVerse)}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-right text-accent-green">
                          +{formatMoney(row.interets)}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-right text-accent-orange font-medium">
                          {formatMoney(row.capitalTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Lien retour */}
        <div className="text-center mb-10">
          <Link
            href="/investir"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-orange transition-colors no-underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Retour au dashboard Investir
          </Link>
        </div>

        {/* FAQ - Schema.org */}
        <section itemScope itemType="https://schema.org/FAQPage">
          <Script
            id="simulateur-faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />

          <h2 className="font-serif text-2xl font-normal mb-6">
            Comprendre les <span className="italic text-accent-orange">intérêts composés</span>
          </h2>

          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-bg-surface border border-glass-border rounded-xl overflow-hidden transition-all duration-300 hover:border-glass-border/80"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left cursor-pointer"
                  aria-expanded={openFaqIndex === index}
                  aria-controls={`sim-faq-${index}`}
                >
                  <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
                  <span className="flex-1 font-medium text-text-primary" itemProp="name">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-text-muted transition-transform duration-300 flex-shrink-0 ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  id={`sim-faq-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="px-5 pb-5 pt-0">
                    <div className="pl-10 border-l-2 border-accent-orange/30">
                      <p className="text-text-secondary leading-relaxed" itemProp="text">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

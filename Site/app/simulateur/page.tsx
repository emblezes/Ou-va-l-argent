'use client'

import { useState, useEffect, useCallback } from 'react'
import { calculerSalaire, type SalaryResult } from '@/lib/api/mon-entreprise'
import { COTISATION_CATEGORIES } from '@/lib/constants/simulateur'
import { formatMoney, formatPercent } from '@/lib/utils/formatters'
import { ChartWrapper, DoughnutChart } from '@/components/charts'

type Period = 'mensuel' | 'annuel'
type Status = 'cadre' | 'non-cadre'

// Valeurs par défaut pour l'affichage initial
const defaultCalc: SalaryResult = {
  brut: 3000,
  superBrut: 4290,
  netAvantIR: 2340,
  netApresIR: 2169,
  totalPatronales: 1290,
  totalSalariales: 660,
  impotRevenu: 171,
  tauxIR: 0.073,
  detail: {
    patronales: {
      maladie: 210,
      vieillesse: 280,
      famille: 104,
      chomage: 122,
      accidents: 60,
      retraite_comp: 142,
      autres: 42,
    },
    salariales: {
      vieillesse: 220,
      retraite_comp: 95,
      csg_crds: 289,
    },
  },
}

function getDistributionData(calc: SalaryResult, multiplier: number = 1) {
  return {
    retraite:
      (calc.detail.patronales.vieillesse +
        calc.detail.patronales.retraite_comp +
        calc.detail.salariales.vieillesse +
        calc.detail.salariales.retraite_comp) *
      multiplier,
    sante: calc.detail.patronales.maladie * multiplier,
    famille: calc.detail.patronales.famille * multiplier,
    chomage: calc.detail.patronales.chomage * multiplier,
    csg_crds: calc.detail.salariales.csg_crds * multiplier,
    ir: calc.impotRevenu * multiplier,
    accidents: calc.detail.patronales.accidents * multiplier,
    autres: calc.detail.patronales.autres * multiplier,
  }
}

// Arrow icon component
function ArrowDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  )
}

export default function SimulateurPage() {
  const [brutInput, setBrutInput] = useState(3000)
  const [period, setPeriod] = useState<Period>('mensuel')
  const [status, setStatus] = useState<Status>('non-cadre')
  const [calc, setCalc] = useState<SalaryResult>(defaultCalc)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Convert to monthly if annual
  const brutMensuel = period === 'annuel' ? brutInput / 12 : brutInput

  // Debounced API call
  const fetchData = useCallback(async (brut: number, statut: Status) => {
    if (brut <= 0) return

    setLoading(true)
    setError(null)

    try {
      const result = await calculerSalaire(brut, statut)
      setCalc(result)
    } catch (err) {
      console.error('API Error:', err)
      setError('Erreur lors du calcul. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data when inputs change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(brutMensuel, status)
    }, 300)

    return () => clearTimeout(timer)
  }, [brutMensuel, status, fetchData])

  // Multiplier for display (monthly or annual)
  const multiplier = period === 'annuel' ? 12 : 1

  // Distribution data for chart
  const distribution = getDistributionData(calc, multiplier)

  // Chart data
  const chartData = {
    labels: COTISATION_CATEGORIES.map((c) => c.name),
    data: [
      distribution.retraite,
      distribution.sante,
      distribution.famille,
      distribution.chomage,
      distribution.csg_crds,
      distribution.ir,
      distribution.accidents,
      distribution.autres,
    ],
    colors: COTISATION_CATEGORIES.map((c) => c.color),
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <main className="relative z-[1] max-w-[1400px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
            Comprendre votre <span className="italic text-accent-electric">salaire</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Découvrez la répartition entre ce que paie votre employeur, ce que vous percevez, et où vont vos cotisations.
          </p>
        </header>

        {/* Input Section */}
        <section className="bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Salary Input */}
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">Salaire brut</label>
              <div className="relative">
                <input
                  type="number"
                  value={brutInput}
                  onChange={(e) => setBrutInput(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 pr-12 bg-bg-elevated border-2 border-glass-border rounded-xl text-text-primary font-mono text-2xl font-medium focus:outline-none focus:border-accent-electric focus:ring-4 focus:ring-accent-electric/20 transition-all"
                  min={0}
                  step={100}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">€</span>
                {loading && (
                  <span className="absolute right-12 top-1/2 -translate-y-1/2">
                    <span className="inline-block w-4 h-4 border-2 border-accent-electric border-t-transparent rounded-full animate-spin" />
                  </span>
                )}
              </div>
            </div>

            {/* Period Toggle */}
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">Période</label>
              <div className="flex bg-bg-elevated rounded-xl p-1 border border-glass-border">
                <button
                  onClick={() => setPeriod('mensuel')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    period === 'mensuel'
                      ? 'bg-accent-electric text-bg-deep'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setPeriod('annuel')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    period === 'annuel'
                      ? 'bg-accent-electric text-bg-deep'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Annuel
                </button>
              </div>
            </div>

            {/* Status Toggle */}
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">Statut</label>
              <div className="flex flex-col gap-2">
                <label
                  className={`flex items-center gap-3 px-4 py-3 bg-bg-elevated border rounded-lg cursor-pointer transition-all ${
                    status === 'non-cadre'
                      ? 'border-accent-electric bg-accent-electric/10'
                      : 'border-glass-border hover:border-text-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'non-cadre'}
                    onChange={() => setStatus('non-cadre')}
                    className="hidden"
                  />
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      status === 'non-cadre' ? 'border-accent-electric' : 'border-text-muted'
                    }`}
                  >
                    {status === 'non-cadre' && <span className="w-2 h-2 rounded-full bg-accent-electric" />}
                  </span>
                  <span className="text-sm">Non-cadre</span>
                </label>
                <label
                  className={`flex items-center gap-3 px-4 py-3 bg-bg-elevated border rounded-lg cursor-pointer transition-all ${
                    status === 'cadre'
                      ? 'border-accent-electric bg-accent-electric/10'
                      : 'border-glass-border hover:border-text-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'cadre'}
                    onChange={() => setStatus('cadre')}
                    className="hidden"
                  />
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      status === 'cadre' ? 'border-accent-electric' : 'border-text-muted'
                    }`}
                  >
                    {status === 'cadre' && <span className="w-2 h-2 rounded-full bg-accent-electric" />}
                  </span>
                  <span className="text-sm">Cadre</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-accent-red/20 border border-accent-red/50 rounded-xl p-4 mb-8 text-center">
            <p className="text-accent-red">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <section className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-opacity ${loading ? 'opacity-50' : ''}`}>
          <div className="bg-bg-surface border border-glass-border rounded-xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent-purple" />
            <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Coût total employeur</div>
            <div className="font-mono text-3xl font-medium text-accent-purple mb-1">
              {formatMoney(calc.superBrut * multiplier)}
            </div>
            <div className="text-sm text-text-secondary">Super brut {period === 'annuel' ? 'annuel' : 'mensuel'}</div>
          </div>

          <div className="bg-bg-surface border border-glass-border rounded-xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent-orange" />
            <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Prélèvements totaux</div>
            <div className="font-mono text-3xl font-medium text-accent-orange mb-1">
              {formatMoney((calc.totalPatronales + calc.totalSalariales + calc.impotRevenu) * multiplier)}
            </div>
            <div className="text-sm text-text-secondary">Cotisations + IR</div>
          </div>

          <div className="bg-bg-surface border border-glass-border rounded-xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent-green" />
            <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Ce que vous recevez</div>
            <div className="font-mono text-3xl font-medium text-accent-green mb-1">
              {formatMoney(calc.netApresIR * multiplier)}
            </div>
            <div className="text-sm text-text-secondary">Net après impôt</div>
          </div>
        </section>

        {/* Results Section - Two columns */}
        <section className={`grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 mb-8 transition-opacity ${loading ? 'opacity-50' : ''}`}>
          {/* Left: Salary Breakdown Stack */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
            <div className="text-xs text-text-muted uppercase tracking-wider text-center mb-6">
              Décomposition de votre salaire
            </div>

            <div className="flex flex-col">
              {/* Super Brut */}
              <div className="p-4 border-l-4 border-accent-purple bg-gradient-to-r from-accent-purple/10 to-transparent relative hover:from-accent-purple/15 transition-all">
                <div className="text-xs text-text-secondary mb-1">Super brut (coût employeur)</div>
                <div className="font-mono text-xl font-medium">{formatMoney(calc.superBrut * multiplier)}</div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted bg-bg-elevated px-2 py-1 rounded">
                  {calc.brut > 0 ? Math.round((calc.superBrut / calc.brut) * 100) : 0}%
                </span>
              </div>

              {/* Arrow: Cotisations patronales */}
              <div className="flex items-center gap-2 pl-6 py-2 text-text-muted text-xs">
                <ArrowDown />
                <span>Cotisations patronales</span>
              </div>

              {/* Cotisations patronales */}
              <div className="p-4 border-l-4 border-accent-orange bg-gradient-to-r from-accent-orange/10 to-transparent ml-4 relative hover:from-accent-orange/15 transition-all">
                <div className="text-xs text-text-secondary mb-1">Charges patronales</div>
                <div className="font-mono text-xl font-medium">- {formatMoney(calc.totalPatronales * multiplier)}</div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted bg-bg-elevated px-2 py-1 rounded">
                  {calc.brut > 0 ? Math.round((calc.totalPatronales / calc.brut) * 100) : 0}%
                </span>
              </div>

              {/* Arrow: = */}
              <div className="flex items-center gap-2 pl-6 py-2 text-text-muted text-xs">
                <ArrowDown />
                <span>=</span>
              </div>

              {/* Brut */}
              <div className="p-4 border-l-4 border-accent-gold bg-gradient-to-r from-accent-gold/10 to-transparent relative hover:from-accent-gold/15 transition-all">
                <div className="text-xs text-text-secondary mb-1">Salaire brut</div>
                <div className="font-mono text-xl font-medium">{formatMoney(calc.brut * multiplier)}</div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted bg-bg-elevated px-2 py-1 rounded">
                  100%
                </span>
              </div>

              {/* Arrow: Cotisations salariales */}
              <div className="flex items-center gap-2 pl-6 py-2 text-text-muted text-xs">
                <ArrowDown />
                <span>Cotisations salariales</span>
              </div>

              {/* Cotisations salariales */}
              <div className="p-4 border-l-4 border-accent-pink bg-gradient-to-r from-accent-pink/10 to-transparent ml-4 relative hover:from-accent-pink/15 transition-all">
                <div className="text-xs text-text-secondary mb-1">Charges salariales</div>
                <div className="font-mono text-xl font-medium">- {formatMoney(calc.totalSalariales * multiplier)}</div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted bg-bg-elevated px-2 py-1 rounded">
                  {calc.brut > 0 ? Math.round((calc.totalSalariales / calc.brut) * 100) : 0}%
                </span>
              </div>

              {/* Arrow: = */}
              <div className="flex items-center gap-2 pl-6 py-2 text-text-muted text-xs">
                <ArrowDown />
                <span>=</span>
              </div>

              {/* Net avant IR */}
              <div className="p-4 border-l-4 border-accent-electric bg-gradient-to-r from-accent-electric/10 to-transparent relative hover:from-accent-electric/15 transition-all">
                <div className="text-xs text-text-secondary mb-1">Net avant impôt</div>
                <div className="font-mono text-xl font-medium">{formatMoney(calc.netAvantIR * multiplier)}</div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted bg-bg-elevated px-2 py-1 rounded">
                  {calc.brut > 0 ? Math.round((calc.netAvantIR / calc.brut) * 100) : 0}%
                </span>
              </div>

              {/* Arrow: Impôt sur le revenu */}
              <div className="flex items-center gap-2 pl-6 py-2 text-text-muted text-xs">
                <ArrowDown />
                <span>Impôt sur le revenu (PAS)</span>
              </div>

              {/* Impôt sur le revenu */}
              <div className="p-4 border-l-4 border-accent-red bg-gradient-to-r from-accent-red/10 to-transparent ml-4 relative hover:from-accent-red/15 transition-all">
                <div className="text-xs text-text-secondary mb-1">Prélèvement à la source</div>
                <div className="font-mono text-xl font-medium">- {formatMoney(calc.impotRevenu * multiplier)}</div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted bg-bg-elevated px-2 py-1 rounded">
                  {formatPercent(calc.tauxIR * 100, 1)}
                </span>
              </div>

              {/* Arrow: = */}
              <div className="flex items-center gap-2 pl-6 py-2 text-text-muted text-xs">
                <ArrowDown />
                <span>=</span>
              </div>

              {/* Net en poche */}
              <div className="p-4 border-l-4 border-accent-green bg-gradient-to-r from-accent-green/15 to-transparent relative hover:from-accent-green/20 transition-all">
                <div className="text-xs text-text-secondary mb-1">Net en poche</div>
                <div className="font-mono text-xl font-medium text-accent-green">{formatMoney(calc.netApresIR * multiplier)}</div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted bg-bg-elevated px-2 py-1 rounded">
                  {calc.brut > 0 ? Math.round((calc.netApresIR / calc.brut) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Right: Charts */}
          <div className="flex flex-col gap-6">
            {/* Doughnut Chart */}
            <ChartWrapper title="Répartition des prélèvements" subtitle="Où vont vos cotisations et impôts" height="280px">
              <DoughnutChart
                labels={chartData.labels}
                data={chartData.data.map((v) => Math.round(v))}
                colors={chartData.colors}
                cutout="60%"
                legendPosition="right"
                tooltipSuffix=" €"
              />
            </ChartWrapper>

            {/* Detail Table */}
            <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-4">📋 Détail des cotisations</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patronales */}
                <div>
                  <h4 className="text-xs text-text-muted uppercase tracking-wider mb-3">
                    Cotisations patronales
                  </h4>
                  <div className="space-y-1">
                    {[
                      { name: 'Maladie', value: calc.detail.patronales.maladie },
                      { name: 'Vieillesse', value: calc.detail.patronales.vieillesse },
                      { name: 'Allocations familiales', value: calc.detail.patronales.famille },
                      { name: 'Chômage', value: calc.detail.patronales.chomage },
                      { name: 'Accidents du travail', value: calc.detail.patronales.accidents },
                      { name: 'Retraite complémentaire', value: calc.detail.patronales.retraite_comp },
                      { name: 'Autres', value: calc.detail.patronales.autres },
                    ].map((item) => (
                      <div key={item.name} className="flex justify-between py-1.5 border-b border-glass-border/30 text-sm">
                        <span className="text-text-secondary">{item.name}</span>
                        <span className="font-mono text-accent-orange">
                          {formatMoney(item.value * multiplier)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 font-medium text-sm">
                      <span>Total</span>
                      <span className="font-mono text-accent-orange">
                        {formatMoney(calc.totalPatronales * multiplier)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Salariales */}
                <div>
                  <h4 className="text-xs text-text-muted uppercase tracking-wider mb-3">
                    Cotisations salariales + IR
                  </h4>
                  <div className="space-y-1">
                    {[
                      { name: 'Vieillesse', value: calc.detail.salariales.vieillesse },
                      { name: 'Retraite complémentaire', value: calc.detail.salariales.retraite_comp },
                      { name: 'CSG / CRDS', value: calc.detail.salariales.csg_crds },
                      { name: `Impôt sur le revenu (${formatPercent(calc.tauxIR * 100, 1)})`, value: calc.impotRevenu },
                    ].map((item) => (
                      <div key={item.name} className="flex justify-between py-1.5 border-b border-glass-border/30 text-sm">
                        <span className="text-text-secondary">{item.name}</span>
                        <span className="font-mono text-accent-red">
                          {formatMoney(item.value * multiplier)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 font-medium text-sm">
                      <span>Total</span>
                      <span className="font-mono text-accent-red">
                        {formatMoney((calc.totalSalariales + calc.impotRevenu) * multiplier)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Distribution Grid */}
        <section className={`bg-bg-surface border border-glass-border rounded-2xl p-6 mb-8 transition-opacity ${loading ? 'opacity-50' : ''}`}>
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl font-normal mb-2">Où vont vos cotisations ?</h2>
            <p className="text-text-secondary text-sm">Détail des contributions {period === 'annuel' ? 'annuelles' : 'mensuelles'} par organisme et protection</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COTISATION_CATEGORIES.map((cat, index) => {
              const values = [
                distribution.retraite,
                distribution.sante,
                distribution.famille,
                distribution.chomage,
                distribution.csg_crds,
                distribution.ir,
                distribution.accidents,
                distribution.autres,
              ]
              const value = values[index]
              const totalPrelevements = (calc.totalPatronales + calc.totalSalariales + calc.impotRevenu) * multiplier
              const barWidth = totalPrelevements > 0 ? (value / totalPrelevements) * 100 : 0

              return (
                <div
                  key={cat.id}
                  className="bg-bg-elevated border border-glass-border rounded-xl p-4 relative overflow-hidden hover:border-white/15 hover:-translate-y-0.5 transition-all"
                >
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cat.color }} />
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"
                    style={{ background: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </div>
                  <div className="font-medium text-sm mb-1">{cat.name}</div>
                  <div className="text-xs text-text-muted mb-3 line-clamp-1">{cat.description}</div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-mono text-lg" style={{ color: cat.color }}>
                      {formatMoney(value)}
                    </span>
                  </div>
                  <div className="h-1 bg-bg-deep rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{ width: `${barWidth}%`, background: cat.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-accent-electric/10 border border-accent-electric/30 rounded-xl p-4 flex gap-4 items-start">
            <svg className="w-6 h-6 text-accent-electric flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-accent-electric mb-1">Comment sont calculées ces cotisations ?</h4>
              <p className="text-xs text-text-secondary">
                Les calculs sont effectués avec le moteur officiel <strong>publicodes</strong> de l&apos;URSSAF.
                L&apos;impôt sur le revenu est calculé avec le <strong>taux neutre</strong> du prélèvement à la source.
                Votre situation personnelle (quotient familial, autres revenus) peut faire varier ces montants.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-6 border-t border-glass-border">
          <p className="text-text-muted text-sm">
            Calculs fournis par le moteur{' '}
            <a
              href="https://mon-entreprise.urssaf.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-electric hover:underline"
            >
              publicodes / modele-social
            </a>
            <br />
            Résultat indicatif pouvant varier selon votre situation personnelle.
          </p>
        </div>
      </main>
    </div>
  )
}

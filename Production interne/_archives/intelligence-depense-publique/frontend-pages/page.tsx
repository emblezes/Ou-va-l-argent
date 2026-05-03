'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_IDP_API || 'http://localhost:8001'

interface DepenseGlobale {
  year: number
  pillars: {
    etat: { total_eur: number; missions: number; top_missions: { mission: string; total: number }[] }
    securite_sociale: { total_eur: number; recettes_eur: number; solde_eur: number; branches: { branche: string; depenses: number; solde: number }[] }
    collectivites: { total_eur: number; communes: number }
  }
  cofog: { cofog_code: string; cofog_label: string; amount_eur: number; pct_gdp: number }[]
  history: { year: number; total_eur: number; pct_gdp: number }[]
}

interface Anomaly {
  id: number
  entity_type: string
  severity: string
  score: number
  description: string
}

function formatEur(val: number): string {
  if (!val) return '0€'
  if (val >= 1e12) return `${(val / 1e12).toFixed(1)} T€`
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)} Md€`
  if (val >= 1e6) return `${(val / 1e6).toFixed(1)} M€`
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)} k€`
  return `${val.toFixed(0)}€`
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

const PILLAR_COLORS = {
  etat: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', bar: 'bg-cyan-500' },
  secu: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', bar: 'bg-violet-500' },
  collectivites: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', bar: 'bg-green-500' },
  operateurs: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', bar: 'bg-orange-500' },
}

export default function IntelligencePage() {
  const [data, setData] = useState<DepenseGlobale | null>(null)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [chatQuery, setChatQuery] = useState('')
  const [chatResponse, setChatResponse] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(2023)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API_BASE}/api/intelligence/depense-globale?year=${year}`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/intelligence/anomalies?per_page=5`).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([d, a]) => {
      setData(d)
      setAnomalies(a?.data || [])
      setLoading(false)
    })
  }, [year])

  async function handleChat(e: React.FormEvent) {
    e.preventDefault()
    if (!chatQuery.trim()) return
    setChatLoading(true)
    setChatResponse('')
    try {
      const res = await fetch(`${API_BASE}/api/intelligence/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: chatQuery }),
      })
      const r = await res.json()
      setChatResponse(r.response)
    } catch {
      setChatResponse('Erreur de connexion au serveur IDP.')
    }
    setChatLoading(false)
  }

  // Compute total and percentages
  const etatTotal = data?.pillars.etat.total_eur || 0
  const secuTotal = data?.pillars.securite_sociale.total_eur || 0
  const collTotal = data?.pillars.collectivites.total_eur || 0
  const opTotal = 80e9 // Estimate for opérateurs
  const grandTotal = etatTotal + secuTotal + collTotal + opTotal
  const cofogTotal = data?.cofog?.find(c => c.cofog_code === 'TOTAL')
  const displayTotal = cofogTotal?.amount_eur || grandTotal
  const pctGdp = cofogTotal?.pct_gdp || 0

  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      {/* Header */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl font-bold">
            €
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl">
            Intelligence de la Depense Publique
          </h1>
        </div>
        <p className="text-lg text-white/60 max-w-3xl">
          Vue consolidee de l&apos;integralite de la depense publique francaise :
          Etat, Securite sociale, Collectivites locales et Operateurs.
        </p>
        <div className="flex gap-2 mt-4">
          {[2020, 2021, 2022, 2023].map(y => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-3 py-1 rounded-lg text-sm font-mono transition-colors ${
                year === y ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </section>

      {/* Grand Total KPI */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-6">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-white/10">
          <p className="text-sm text-white/50 uppercase tracking-wide mb-1">Depense publique totale ({year})</p>
          <div className="flex items-baseline gap-4">
            <p className={`text-6xl lg:text-7xl font-mono font-bold text-white ${loading ? 'animate-pulse' : ''}`}>
              {displayTotal > 0 ? formatEur(displayTotal) : '~1 600 Md€'}
            </p>
            {pctGdp > 0 && (
              <p className="text-2xl font-mono text-cyan-400">{pctGdp.toFixed(1)}% du PIB</p>
            )}
          </div>

          {/* Pillar breakdown bar */}
          <div className="mt-6">
            <div className="flex h-4 rounded-full overflow-hidden bg-white/5">
              {grandTotal > 0 && (
                <>
                  <div className={`${PILLAR_COLORS.secu.bar} transition-all`} style={{ width: `${(secuTotal / grandTotal) * 100}%` }} title="Securite sociale" />
                  <div className={`${PILLAR_COLORS.etat.bar} transition-all`} style={{ width: `${(etatTotal / grandTotal) * 100}%` }} title="Etat" />
                  <div className={`${PILLAR_COLORS.collectivites.bar} transition-all`} style={{ width: `${(collTotal / grandTotal) * 100}%` }} title="Collectivites" />
                  <div className={`${PILLAR_COLORS.operateurs.bar} transition-all`} style={{ width: `${(opTotal / grandTotal) * 100}%` }} title="Operateurs" />
                </>
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/40">
              <span>Secu {grandTotal > 0 ? `${((secuTotal / grandTotal) * 100).toFixed(0)}%` : '41%'}</span>
              <span>Etat {grandTotal > 0 ? `${((etatTotal / grandTotal) * 100).toFixed(0)}%` : '31%'}</span>
              <span>Collectivites {grandTotal > 0 ? `${((collTotal / grandTotal) * 100).toFixed(0)}%` : '19%'}</span>
              <span>Operateurs {grandTotal > 0 ? `${((opTotal / grandTotal) * 100).toFixed(0)}%` : '5%'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillar Cards */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PillarCard
            label="Etat (LOLF)"
            total={etatTotal}
            detail={`${data?.pillars.etat.missions || 0} missions`}
            colors={PILLAR_COLORS.etat}
            href="/intelligence/budget-etat"
            loading={loading}
          />
          <PillarCard
            label="Securite sociale"
            total={secuTotal}
            detail={`Solde: ${formatEur(data?.pillars.securite_sociale.solde_eur || 0)}`}
            colors={PILLAR_COLORS.secu}
            href="/intelligence/securite-sociale"
            loading={loading}
          />
          <PillarCard
            label="Collectivites locales"
            total={collTotal}
            detail={`${(data?.pillars.collectivites.communes || 0).toLocaleString('fr-FR')} communes`}
            colors={PILLAR_COLORS.collectivites}
            href="/intelligence/commune/75056"
            loading={loading}
          />
          <PillarCard
            label="Operateurs"
            total={opTotal}
            detail="~80 Md€ (estimé)"
            colors={PILLAR_COLORS.operateurs}
            loading={loading}
          />
        </div>
      </section>

      {/* COFOG Breakdown + Navigation */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-8">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* COFOG */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h2 className="font-semibold text-lg mb-4">Depenses par fonction (COFOG)</h2>
            <div className="space-y-3">
              {(data?.cofog || [])
                .filter(c => c.cofog_code !== 'TOTAL')
                .sort((a, b) => (b.pct_gdp || 0) - (a.pct_gdp || 0))
                .map(c => {
                  const maxPct = Math.max(...(data?.cofog || []).filter(x => x.cofog_code !== 'TOTAL').map(x => x.pct_gdp || 0))
                  return (
                    <div key={c.cofog_code}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{c.cofog_label}</span>
                        <span className="font-mono text-white/60">
                          {c.pct_gdp ? `${c.pct_gdp.toFixed(1)}%` : ''} {c.amount_eur ? `(${formatEur(c.amount_eur)})` : ''}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-cyan-500/60"
                          style={{ width: `${maxPct > 0 ? ((c.pct_gdp || 0) / maxPct) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              {(!data?.cofog || data.cofog.length === 0) && !loading && (
                <p className="text-white/40 text-sm py-4 text-center">
                  Lancez l&apos;ingestion COFOG pour voir la repartition par fonction.
                </p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <Link href="/intelligence/budget-etat" className="group block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
              <h3 className="font-semibold text-lg mb-1">Budget de l&apos;Etat (LOLF)</h3>
              <p className="text-sm text-white/50">Explorer les missions, programmes et actions. Ecarts LFI vs execution.</p>
            </Link>
            <Link href="/intelligence/securite-sociale" className="group block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all">
              <h3 className="font-semibold text-lg mb-1">Securite sociale</h3>
              <p className="text-sm text-white/50">Comptes par branche : maladie, vieillesse, famille, emploi.</p>
            </Link>
            <Link href="/intelligence/comparaison" className="group block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all">
              <h3 className="font-semibold text-lg mb-1">Comparaison internationale</h3>
              <p className="text-sm text-white/50">France vs UE/OCDE : depenses par fonction, radar COFOG.</p>
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/intelligence/anomalies" className="group block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all">
                <h3 className="font-semibold mb-1">Anomalies</h3>
                <p className="text-xs text-white/50">Detections IA</p>
              </Link>
              <Link href="/intelligence/graph" className="group block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                <h3 className="font-semibold mb-1">Graphe</h3>
                <p className="text-xs text-white/50">Relations</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chat with AI */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-8">
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-cyan-400">AI</span> Analyste IA — Posez une question sur les 1 600 Md€
          </h2>
          <form onSubmit={handleChat} className="flex gap-3 mb-4">
            <input
              type="text"
              value={chatQuery}
              onChange={e => setChatQuery(e.target.value)}
              placeholder="Ex: Quelle est la repartition de la depense publique en 2023 ?"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded-lg font-medium transition-colors"
            >
              {chatLoading ? 'Analyse...' : 'Analyser'}
            </button>
          </form>
          {chatResponse && (
            <div className="bg-white/5 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
              {chatResponse}
            </div>
          )}
        </div>
      </section>

      {/* Recent anomalies */}
      {anomalies.length > 0 && (
        <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-16">
          <h2 className="font-semibold text-lg mb-4">Dernieres anomalies detectees</h2>
          <div className="space-y-3">
            {anomalies.map(a => (
              <div key={a.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${SEVERITY_COLORS[a.severity] || SEVERITY_COLORS.low}`}>
                  {a.severity}
                </span>
                <div className="flex-1">
                  <p className="text-sm">{a.description}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {a.entity_type} · Score: {(a.score * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function PillarCard({ label, total, detail, colors, href, loading }: {
  label: string; total: number; detail: string
  colors: { bg: string; border: string; text: string }
  href?: string; loading: boolean
}) {
  const content = (
    <div className={`p-5 rounded-xl border ${colors.bg} ${colors.border} ${href ? 'hover:scale-[1.02] transition-transform cursor-pointer' : ''}`}>
      <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-mono font-bold ${colors.text} ${loading ? 'animate-pulse' : ''}`}>
        {total > 0 ? formatEur(total) : '—'}
      </p>
      <p className="text-xs text-white/40 mt-1">{detail}</p>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

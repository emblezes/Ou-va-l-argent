'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_IDP_API || 'http://localhost:8001'

interface BrancheSummary {
  branche: string
  total_depenses_eur: number
  total_recettes_eur: number
  total_solde_eur: number
}

interface SecuRow {
  id: number
  year: number
  branche: string
  regime: string
  poste: string
  recettes_eur: number
  depenses_eur: number
  solde_eur: number
}

function formatEur(val: number): string {
  if (!val) return '0€'
  const abs = Math.abs(val)
  const sign = val < 0 ? '-' : ''
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1)} Md€`
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)} M€`
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(0)} k€`
  return `${sign}${abs.toFixed(0)}€`
}

const BRANCHE_COLORS: Record<string, string> = {
  'SANTÉ': 'bg-red-500',
  'VIEILLESSE-SURVIE': 'bg-violet-500',
  'FAMILLE': 'bg-green-500',
  'EMPLOI': 'bg-yellow-500',
  'PAUVRETÉ-EXCLUSION SOCIALE': 'bg-pink-500',
  'LOGEMENT': 'bg-cyan-500',
}

const BRANCHE_LABELS: Record<string, string> = {
  'SANTÉ': 'Sante',
  'VIEILLESSE-SURVIE': 'Retraite & Survie',
  'FAMILLE': 'Famille',
  'EMPLOI': 'Emploi & Chomage',
  'PAUVRETÉ-EXCLUSION SOCIALE': 'Pauvrete & Exclusion',
  'LOGEMENT': 'Logement',
}

export default function SecuriteSocialePage() {
  const [summary, setSummary] = useState<BrancheSummary[]>([])
  const [rows, setRows] = useState<SecuRow[]>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(2022)
  const [selectedBranche, setSelectedBranche] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ year: year.toString(), per_page: '100' })
    if (selectedBranche) params.append('branche', selectedBranche)

    fetch(`${API_BASE}/api/intelligence/protection-sociale?${params}`)
      .then(r => r.json())
      .then(d => {
        setSummary(d.summary || [])
        setRows(d.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [year, selectedBranche])

  const totalDepenses = summary.reduce((s, b) => s + (b.total_depenses_eur || 0), 0)
  const totalRecettes = summary.reduce((s, b) => s + (b.total_recettes_eur || 0), 0)
  const totalSolde = summary.reduce((s, b) => s + (b.total_solde_eur || 0), 0)
  const maxBranche = Math.max(...summary.map(b => b.total_depenses_eur || 0), 1)

  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pt-12 pb-6">
        <Link href="/intelligence" className="text-violet-400 text-sm hover:underline mb-4 block">
          &larr; Retour au dashboard
        </Link>
        <h1 className="font-serif text-4xl lg:text-5xl mb-2">
          Securite sociale
        </h1>
        <p className="text-lg text-white/60">
          Comptes de la protection sociale par branche : maladie, vieillesse, famille, emploi.
        </p>

        <div className="flex gap-2 mt-4">
          {[2019, 2020, 2021, 2022].map(y => (
            <button
              key={y}
              onClick={() => { setYear(y); setSelectedBranche(null) }}
              className={`px-3 py-1 rounded-lg text-sm font-mono transition-colors ${
                year === y ? 'bg-violet-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </section>

      {/* KPIs */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-violet-500/10 border border-violet-500/30">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Depenses totales</p>
            <p className={`text-3xl font-mono font-bold text-violet-400 ${loading ? 'animate-pulse' : ''}`}>
              {totalDepenses > 0 ? formatEur(totalDepenses) : '—'}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Recettes totales</p>
            <p className={`text-3xl font-mono font-bold ${loading ? 'animate-pulse' : ''}`}>
              {totalRecettes > 0 ? formatEur(totalRecettes) : '—'}
            </p>
          </div>
          <div className={`p-5 rounded-xl border ${totalSolde >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Solde</p>
            <p className={`text-3xl font-mono font-bold ${totalSolde >= 0 ? 'text-green-400' : 'text-red-400'} ${loading ? 'animate-pulse' : ''}`}>
              {totalSolde !== 0 ? formatEur(totalSolde) : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-8">
        <h2 className="font-semibold text-lg mb-4">Repartition par branche</h2>
        {selectedBranche && (
          <button onClick={() => setSelectedBranche(null)} className="text-violet-400 text-sm hover:underline mb-4">
            Voir toutes les branches
          </button>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary
            .filter(b => !selectedBranche || b.branche === selectedBranche)
            .map(b => {
              const barColor = BRANCHE_COLORS[b.branche] || 'bg-white/30'
              return (
                <button
                  key={b.branche}
                  onClick={() => setSelectedBranche(b.branche)}
                  className="text-left p-5 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-semibold">{BRANCHE_LABELS[b.branche] || b.branche}</p>
                    <p className="text-xl font-mono font-bold text-violet-400">
                      {formatEur(b.total_depenses_eur || 0)}
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 mb-2">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all`}
                      style={{ width: `${(b.total_depenses_eur / maxBranche) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/40">
                    <span>Recettes: {formatEur(b.total_recettes_eur || 0)}</span>
                    <span className={b.total_solde_eur >= 0 ? 'text-green-400' : 'text-red-400'}>
                      Solde: {formatEur(b.total_solde_eur || 0)}
                    </span>
                  </div>
                </button>
              )
            })}
        </div>
      </section>

      {/* Detail table */}
      {selectedBranche && rows.length > 0 && (
        <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-16">
          <h2 className="font-semibold text-lg mb-4">Detail : {selectedBranche}</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-white/50 text-left">
                  <th className="px-4 py-3">Regime</th>
                  <th className="px-4 py-3">Poste</th>
                  <th className="px-4 py-3 text-right">Recettes</th>
                  <th className="px-4 py-3 text-right">Depenses</th>
                  <th className="px-4 py-3 text-right">Solde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-white/80">{r.regime}</td>
                    <td className="px-4 py-3 text-white/60">{r.poste}</td>
                    <td className="px-4 py-3 text-right font-mono text-white/60">{formatEur(r.recettes_eur || 0)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatEur(r.depenses_eur || 0)}</td>
                    <td className={`px-4 py-3 text-right font-mono ${(r.solde_eur || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatEur(r.solde_eur || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!loading && summary.length === 0 && (
        <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-16">
          <div className="text-center py-16 text-white/40">
            <p className="text-xl mb-2">Aucune donnee disponible</p>
            <p className="text-sm">
              Lancez l&apos;ingestion : <code className="bg-white/10 px-2 py-1 rounded">python intelligence/ingestion/securite_sociale.py --year={year}</code>
            </p>
          </div>
        </section>
      )}
    </main>
  )
}

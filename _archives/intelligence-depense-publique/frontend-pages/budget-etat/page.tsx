'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_IDP_API || 'http://localhost:8001'

interface BudgetRow {
  id: number
  year: number
  mission: string
  programme: string
  action: string
  budget_type: string
  lfi_eur: number
  execution_eur: number
  ecart_pct: number
}

interface MissionSummary {
  mission: string
  total_execution_eur: number
  total_lfi_eur: number
  nb_lignes: number
}

function formatEur(val: number): string {
  if (!val) return '0€'
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)} Md€`
  if (val >= 1e6) return `${(val / 1e6).toFixed(1)} M€`
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)} k€`
  return `${val.toFixed(0)}€`
}

export default function BudgetEtatPage() {
  const [summary, setSummary] = useState<MissionSummary[]>([])
  const [rows, setRows] = useState<BudgetRow[]>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(2023)
  const [selectedMission, setSelectedMission] = useState<string | null>(null)
  const [budgetType, setBudgetType] = useState<string>('CP')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      year: year.toString(),
      budget_type: budgetType,
      per_page: '100',
    })
    if (selectedMission) params.append('mission', selectedMission)

    fetch(`${API_BASE}/api/intelligence/budget-etat?${params}`)
      .then(r => r.json())
      .then(d => {
        setSummary(d.summary || [])
        setRows(d.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [year, selectedMission, budgetType])

  const totalExecution = summary.reduce((s, m) => s + (m.total_execution_eur || 0), 0)
  const totalLfi = summary.reduce((s, m) => s + (m.total_lfi_eur || 0), 0)
  const maxMission = Math.max(...summary.map(m => m.total_execution_eur || 0), 1)

  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pt-12 pb-6">
        <Link href="/intelligence" className="text-cyan-400 text-sm hover:underline mb-4 block">
          &larr; Retour au dashboard
        </Link>
        <h1 className="font-serif text-4xl lg:text-5xl mb-2">
          Budget de l&apos;Etat (LOLF)
        </h1>
        <p className="text-lg text-white/60">
          Execution budgetaire par mission et programme. Credits de paiement (CP) et autorisations d&apos;engagement (AE).
        </p>

        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="flex gap-2">
            {[2020, 2021, 2022, 2023].map(y => (
              <button
                key={y}
                onClick={() => { setYear(y); setSelectedMission(null) }}
                className={`px-3 py-1 rounded-lg text-sm font-mono transition-colors ${
                  year === y ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['CP', 'AE'].map(t => (
              <button
                key={t}
                onClick={() => setBudgetType(t)}
                className={`px-3 py-1 rounded-lg text-sm font-mono transition-colors ${
                  budgetType === t ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Execution totale ({budgetType})</p>
            <p className={`text-3xl font-mono font-bold text-cyan-400 ${loading ? 'animate-pulse' : ''}`}>
              {totalExecution > 0 ? formatEur(totalExecution) : '—'}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">LFI votee</p>
            <p className={`text-3xl font-mono font-bold ${loading ? 'animate-pulse' : ''}`}>
              {totalLfi > 0 ? formatEur(totalLfi) : '—'}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Missions</p>
            <p className={`text-3xl font-mono font-bold ${loading ? 'animate-pulse' : ''}`}>
              {summary.length || '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Treemap-like mission bars */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-8">
        <h2 className="font-semibold text-lg mb-4">
          {selectedMission ? `Mission : ${selectedMission}` : 'Repartition par mission'}
        </h2>
        {selectedMission && (
          <button onClick={() => setSelectedMission(null)} className="text-cyan-400 text-sm hover:underline mb-4">
            Voir toutes les missions
          </button>
        )}
        <div className="space-y-2">
          {(!selectedMission ? summary : summary.filter(m => m.mission === selectedMission)).map(m => {
            const ecart = m.total_lfi_eur ? ((m.total_execution_eur - m.total_lfi_eur) / m.total_lfi_eur * 100) : 0
            return (
              <button
                key={m.mission}
                onClick={() => setSelectedMission(m.mission)}
                className="w-full text-left group"
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80 group-hover:text-cyan-400 transition-colors truncate mr-4">
                    {m.mission}
                  </span>
                  <span className="font-mono text-white/60 shrink-0">
                    {formatEur(m.total_execution_eur)}
                    {ecart !== 0 && (
                      <span className={`ml-2 text-xs ${ecart > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {ecart > 0 ? '+' : ''}{ecart.toFixed(1)}%
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-cyan-500/60 transition-all"
                    style={{ width: `${(m.total_execution_eur / maxMission) * 100}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Detail table for selected mission */}
      {selectedMission && rows.length > 0 && (
        <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-16">
          <h2 className="font-semibold text-lg mb-4">Detail par programme/action</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-white/50 text-left">
                  <th className="px-4 py-3">Programme</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3 text-right">LFI</th>
                  <th className="px-4 py-3 text-right">Execution</th>
                  <th className="px-4 py-3 text-right">Ecart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-white/80">{r.programme}</td>
                    <td className="px-4 py-3 text-white/60 text-xs">{r.action}</td>
                    <td className="px-4 py-3 text-right font-mono text-white/60">{formatEur(r.lfi_eur || 0)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatEur(r.execution_eur || 0)}</td>
                    <td className={`px-4 py-3 text-right font-mono text-xs ${
                      (r.ecart_pct || 0) > 5 ? 'text-red-400' : (r.ecart_pct || 0) < -5 ? 'text-green-400' : 'text-white/40'
                    }`}>
                      {r.ecart_pct != null ? `${r.ecart_pct > 0 ? '+' : ''}${r.ecart_pct.toFixed(1)}%` : '—'}
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
              Lancez l&apos;ingestion : <code className="bg-white/10 px-2 py-1 rounded">python intelligence/ingestion/budget_etat.py --year={year}</code>
            </p>
          </div>
        </section>
      )}
    </main>
  )
}

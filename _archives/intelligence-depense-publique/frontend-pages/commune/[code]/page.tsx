'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_IDP_API || 'http://localhost:8001'

interface Commune {
  code_insee: string
  name: string
  department_code: string
  population: number
  strate: string
  epci_name: string
}

interface BudgetYear {
  year: number
  rev_eur: number
  exp_eur: number
  personnel_eur: number
  debt_eur: number
  debt_per_capita: number
  exp_per_capita: number
  savings_rate: number
  population: number
}

function formatEur(val: number | null): string {
  if (!val) return '—'
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)} Md€`
  if (val >= 1e6) return `${(val / 1e6).toFixed(1)} M€`
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)} k€`
  return `${val.toFixed(0)}€`
}

export default function CommunePage() {
  const params = useParams()
  const code = params.code as string
  const [commune, setCommune] = useState<Commune | null>(null)
  const [budgets, setBudgets] = useState<BudgetYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/api/intelligence/communes/${code}`)
      .then(r => {
        if (!r.ok) throw new Error('Commune non trouvée')
        return r.json()
      })
      .then(data => {
        setCommune(data.commune)
        setBudgets(data.budgets || [])
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [code])

  const latest = budgets.length > 0 ? budgets[budgets.length - 1] : null

  if (loading) {
    return (
      <main className="min-h-screen bg-[#06080c] text-white flex items-center justify-center">
        <p className="text-white/30 animate-pulse">Chargement...</p>
      </main>
    )
  }

  if (error || !commune) {
    return (
      <main className="min-h-screen bg-[#06080c] text-white flex items-center justify-center">
        <p className="text-red-400">{error || 'Commune non trouvée'}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pt-12 pb-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-white/40 mb-1">
            Département {commune.department_code} · {commune.epci_name || ''}
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl">{commune.name}</h1>
          <p className="text-lg text-white/50 mt-2">
            {commune.population?.toLocaleString('fr-FR')} habitants · Strate : {commune.strate || '—'}
          </p>
        </div>

        {/* Latest year KPIs */}
        {latest && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/50 uppercase">Dépenses ({latest.year})</p>
              <p className="text-2xl font-mono font-bold mt-1">{formatEur(latest.exp_eur)}</p>
              <p className="text-xs text-white/40">{latest.exp_per_capita?.toFixed(0)}€/hab</p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/50 uppercase">Recettes ({latest.year})</p>
              <p className="text-2xl font-mono font-bold mt-1">{formatEur(latest.rev_eur)}</p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/50 uppercase">Dette</p>
              <p className="text-2xl font-mono font-bold text-orange-400 mt-1">{formatEur(latest.debt_eur)}</p>
              <p className="text-xs text-white/40">{latest.debt_per_capita?.toFixed(0)}€/hab</p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/50 uppercase">Epargne brute</p>
              <p className="text-2xl font-mono font-bold text-green-400 mt-1">
                {latest.savings_rate ? `${latest.savings_rate.toFixed(1)}%` : '—'}
              </p>
            </div>
          </div>
        )}

        {/* Budget history table */}
        <h2 className="font-semibold text-lg mb-4">Historique budgétaire</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase border-b border-white/10">
                <th className="px-3 py-2 text-left">Année</th>
                <th className="px-3 py-2 text-right">Population</th>
                <th className="px-3 py-2 text-right">Recettes</th>
                <th className="px-3 py-2 text-right">Dépenses</th>
                <th className="px-3 py-2 text-right">Personnel</th>
                <th className="px-3 py-2 text-right">Dette</th>
                <th className="px-3 py-2 text-right">€/hab</th>
                <th className="px-3 py-2 text-right">Epargne</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map(b => (
                <tr key={b.year} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-3 py-2 font-mono">{b.year}</td>
                  <td className="px-3 py-2 text-right">{b.population?.toLocaleString('fr-FR')}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatEur(b.rev_eur)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatEur(b.exp_eur)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatEur(b.personnel_eur)}</td>
                  <td className="px-3 py-2 text-right font-mono text-orange-400">{formatEur(b.debt_eur)}</td>
                  <td className="px-3 py-2 text-right font-mono">{b.exp_per_capita?.toFixed(0) || '—'}</td>
                  <td className="px-3 py-2 text-right font-mono text-green-400">
                    {b.savings_rate ? `${b.savings_rate.toFixed(1)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {budgets.length === 0 && (
          <p className="text-white/30 text-center py-8">
            Aucune donnée budgétaire disponible pour cette commune.
          </p>
        )}
      </section>
    </main>
  )
}

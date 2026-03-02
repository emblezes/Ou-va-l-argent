'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_IDP_API || 'http://localhost:8001'

interface RankingRow {
  country_code: string
  cofog_label: string
  amount_eur: number
  pct_gdp: number
}

interface CofogDetail {
  cofog_code: string
  cofog_label: string
  amount_eur: number
  pct_gdp: number
}

const COUNTRY_NAMES: Record<string, string> = {
  FRA: 'France', DEU: 'Allemagne', ITA: 'Italie', ESP: 'Espagne',
  NLD: 'Pays-Bas', BEL: 'Belgique', AUT: 'Autriche', SWE: 'Suede',
  DNK: 'Danemark', FIN: 'Finlande', IRL: 'Irlande', PRT: 'Portugal',
  GRC: 'Grece', EU: 'UE-27',
}

const COUNTRY_FLAGS: Record<string, string> = {
  FRA: 'FR', DEU: 'DE', ITA: 'IT', ESP: 'ES',
  NLD: 'NL', BEL: 'BE', AUT: 'AT', SWE: 'SE',
  DNK: 'DK', FIN: 'FI', IRL: 'IE', PRT: 'PT',
  GRC: 'GR', EU: 'EU',
}

const COFOG_OPTIONS = [
  { code: 'TOTAL', label: 'Total depenses publiques' },
  { code: 'GF01', label: 'Services publics generaux' },
  { code: 'GF02', label: 'Defense' },
  { code: 'GF03', label: 'Ordre et securite' },
  { code: 'GF04', label: 'Affaires economiques' },
  { code: 'GF05', label: 'Environnement' },
  { code: 'GF06', label: 'Logement' },
  { code: 'GF07', label: 'Sante' },
  { code: 'GF08', label: 'Culture et loisirs' },
  { code: 'GF09', label: 'Enseignement' },
  { code: 'GF10', label: 'Protection sociale' },
]

function formatEur(val: number): string {
  if (!val) return '0€'
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)} Md€`
  if (val >= 1e6) return `${(val / 1e6).toFixed(1)} M€`
  return `${val.toFixed(0)}€`
}

export default function ComparaisonPage() {
  const [ranking, setRanking] = useState<RankingRow[]>([])
  const [franceDetail, setFranceDetail] = useState<CofogDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(2022)
  const [cofogCode, setCofogCode] = useState('TOTAL')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      year: year.toString(),
      cofog_code: cofogCode,
    })

    fetch(`${API_BASE}/api/intelligence/comparaison?${params}`)
      .then(r => r.json())
      .then(d => {
        setRanking(d.ranking || [])
        setFranceDetail(d.france_detail || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [year, cofogCode])

  const maxPct = Math.max(...ranking.map(r => r.pct_gdp || 0), 1)
  const franceRow = ranking.find(r => r.country_code === 'FRA')
  const cofogLabel = COFOG_OPTIONS.find(c => c.code === cofogCode)?.label || cofogCode

  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pt-12 pb-6">
        <Link href="/intelligence" className="text-yellow-400 text-sm hover:underline mb-4 block">
          &larr; Retour au dashboard
        </Link>
        <h1 className="font-serif text-4xl lg:text-5xl mb-2">
          Comparaison internationale
        </h1>
        <p className="text-lg text-white/60">
          Benchmarks de depense publique France vs UE par fonction (classification COFOG).
        </p>

        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="flex gap-2">
            {[2019, 2020, 2021, 2022].map(y => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-3 py-1 rounded-lg text-sm font-mono transition-colors ${
                  year === y ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <select
            value={cofogCode}
            onChange={e => setCofogCode(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
          >
            {COFOG_OPTIONS.map(c => (
              <option key={c.code} value={c.code} className="bg-[#0a1628]">{c.label}</option>
            ))}
          </select>
        </div>
      </section>

      {/* France highlight */}
      {franceRow && (
        <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-6">
          <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
            <p className="text-sm text-white/50 mb-1">France — {cofogLabel} ({year})</p>
            <div className="flex items-baseline gap-6">
              <p className="text-5xl font-mono font-bold text-yellow-400">
                {franceRow.pct_gdp?.toFixed(1)}% du PIB
              </p>
              {franceRow.amount_eur > 0 && (
                <p className="text-2xl font-mono text-white/60">
                  {formatEur(franceRow.amount_eur)}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Ranking */}
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bar chart */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Classement : {cofogLabel}</h2>
            <div className="space-y-3">
              {ranking.map((r, i) => {
                const isFrance = r.country_code === 'FRA'
                const name = COUNTRY_NAMES[r.country_code] || r.country_code
                const flag = COUNTRY_FLAGS[r.country_code]
                return (
                  <div key={r.country_code}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`${isFrance ? 'text-yellow-400 font-semibold' : 'text-white/80'}`}>
                        {i + 1}. {flag ? `${flag} ` : ''}{name}
                      </span>
                      <span className="font-mono text-white/60">
                        {r.pct_gdp?.toFixed(1)}%
                        {r.amount_eur > 0 ? ` (${formatEur(r.amount_eur)})` : ''}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full transition-all ${isFrance ? 'bg-yellow-500' : 'bg-white/20'}`}
                        style={{ width: `${maxPct > 0 ? ((r.pct_gdp || 0) / maxPct) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {ranking.length === 0 && !loading && (
                <p className="text-white/40 text-sm py-4 text-center">
                  Aucune donnee. Lancez l&apos;ingestion COFOG.
                </p>
              )}
            </div>
          </div>

          {/* France COFOG breakdown (radar-like list) */}
          <div>
            <h2 className="font-semibold text-lg mb-4">France : toutes les fonctions ({year})</h2>
            <div className="space-y-3">
              {franceDetail
                .filter(c => c.cofog_code !== 'TOTAL')
                .sort((a, b) => (b.pct_gdp || 0) - (a.pct_gdp || 0))
                .map(c => {
                  const maxDetail = Math.max(
                    ...franceDetail.filter(x => x.cofog_code !== 'TOTAL').map(x => x.pct_gdp || 0),
                    1
                  )
                  return (
                    <button
                      key={c.cofog_code}
                      onClick={() => setCofogCode(c.cofog_code)}
                      className="w-full text-left group"
                    >
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`group-hover:text-yellow-400 transition-colors ${
                          cofogCode === c.cofog_code ? 'text-yellow-400' : 'text-white/80'
                        }`}>
                          {c.cofog_label}
                        </span>
                        <span className="font-mono text-white/60">
                          {c.pct_gdp?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full transition-all ${
                            cofogCode === c.cofog_code ? 'bg-yellow-500' : 'bg-yellow-500/40'
                          }`}
                          style={{ width: `${(c.pct_gdp || 0) / maxDetail * 100}%` }}
                        />
                      </div>
                    </button>
                  )
                })}
              {franceDetail.length === 0 && !loading && (
                <p className="text-white/40 text-sm py-4 text-center">Aucune donnee.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {!loading && ranking.length === 0 && franceDetail.length === 0 && (
        <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pb-16">
          <div className="text-center py-16 text-white/40">
            <p className="text-xl mb-2">Aucune donnee de comparaison disponible</p>
            <p className="text-sm">
              Lancez l&apos;ingestion : <code className="bg-white/10 px-2 py-1 rounded">python intelligence/ingestion/comptes_nationaux.py</code>
            </p>
          </div>
        </section>
      )}
    </main>
  )
}

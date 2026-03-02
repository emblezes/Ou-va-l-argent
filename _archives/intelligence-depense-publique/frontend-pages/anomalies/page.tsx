'use client'

import { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_IDP_API || 'http://localhost:8001'

interface Anomaly {
  id: number
  entity_type: string
  detector: string
  anomaly_type: string
  score: number
  severity: string
  description: string
  details: Record<string, unknown>
  created_at: string
}

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low']
const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

const ENTITY_LABELS: Record<string, string> = {
  contract: 'Marché public',
  commune_budget: 'Budget commune',
  subvention: 'Subvention',
}

const DETECTOR_LABELS: Record<string, string> = {
  isolation_forest: 'Isolation Forest',
  prophet: 'Prophet (séries temporelles)',
  lstm: 'LSTM Autoencoder',
  graph: 'Analyse de graphe',
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    entity_type: '',
    severity: '',
    detector: '',
  })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), per_page: '20' })
    if (filters.entity_type) params.set('entity_type', filters.entity_type)
    if (filters.severity) params.set('severity', filters.severity)
    if (filters.detector) params.set('detector', filters.detector)

    fetch(`${API_BASE}/api/intelligence/anomalies?${params}`)
      .then(r => r.json())
      .then(data => {
        setAnomalies(data.data || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [filters, page])

  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pt-12 pb-8">
        <h1 className="font-serif text-3xl lg:text-4xl mb-2">Anomalies détectées</h1>
        <p className="text-white/50">
          {total} anomalies identifiées par les modèles de machine learning
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-6">
          <select
            value={filters.entity_type}
            onChange={e => { setFilters(f => ({ ...f, entity_type: e.target.value })); setPage(1) }}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Tous les types</option>
            <option value="contract">Marchés publics</option>
            <option value="commune_budget">Budgets communaux</option>
            <option value="subvention">Subventions</option>
          </select>

          <select
            value={filters.severity}
            onChange={e => { setFilters(f => ({ ...f, severity: e.target.value })); setPage(1) }}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Toutes sévérités</option>
            {SEVERITY_ORDER.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="text-white/30 text-center py-12 animate-pulse">Chargement...</div>
          ) : anomalies.length === 0 ? (
            <div className="text-white/30 text-center py-12">
              Aucune anomalie trouvée. Exécutez d&apos;abord le pipeline d&apos;ingestion et de détection.
            </div>
          ) : (
            anomalies.map(a => (
              <div key={a.id} className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${SEVERITY_COLORS[a.severity]}`}>
                      {a.severity}
                    </span>
                    <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                      {ENTITY_LABELS[a.entity_type] || a.entity_type}
                    </span>
                    <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                      {DETECTOR_LABELS[a.detector] || a.detector}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-cyan-400">
                    {(a.score * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="mt-3 text-sm">{a.description}</p>
                {a.details && (
                  <div className="mt-2 text-xs text-white/30 font-mono">
                    {typeof a.details === 'object' && Object.entries(a.details).map(([k, v]) => (
                      <span key={k} className="mr-4">{k}: {String(v)}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/5 rounded-lg disabled:opacity-30"
            >
              Précédent
            </button>
            <span className="px-4 py-2 text-white/50">
              Page {page} / {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 20 >= total}
              className="px-4 py-2 bg-white/5 rounded-lg disabled:opacity-30"
            >
              Suivant
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

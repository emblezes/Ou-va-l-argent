'use client'

import { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_IDP_API || 'http://localhost:8001'

interface Connection {
  relation_type: string
  is_outgoing: boolean
  other_name: string
  other_siren: string
  other_type: string
  amount_eur: number
  contracts: number
}

interface EntityNetwork {
  entity: { name: string; type: string; city: string; employees: number }
  connections: Connection[]
}

export default function GraphPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [network, setNetwork] = useState<EntityNetwork | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setLoading(true)
    setError('')
    setNetwork(null)

    try {
      // Search entity by name first
      const searchRes = await fetch(
        `${API_BASE}/api/intelligence/contracts?winner=${encodeURIComponent(searchQuery)}&per_page=1`
      )
      const searchData = await searchRes.json()

      if (searchData.data?.length > 0) {
        const siren = searchData.data[0].winner_siret?.substring(0, 9)
        if (siren) {
          const netRes = await fetch(`${API_BASE}/api/intelligence/graph/entity/${siren}`)
          const netData = await netRes.json()
          if (netData.error) {
            setError(netData.error)
          } else {
            setNetwork(netData)
          }
        }
      } else {
        setError('Aucune entité trouvée. Essayez un nom d\'entreprise ou un SIREN.')
      }
    } catch {
      setError('Erreur de connexion au serveur.')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <section className="max-w-[1800px] mx-auto px-4 lg:px-12 pt-12 pb-8">
        <h1 className="font-serif text-3xl lg:text-4xl mb-2">Graphe des Relations</h1>
        <p className="text-white/50 mb-6">
          Explorez le réseau de relations entre entreprises, marchés publics et subventions.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Nom d'entreprise ou SIREN..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Recherche...' : 'Explorer'}
          </button>
        </form>

        {error && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Network visualization */}
        {network && (
          <div>
            {/* Central entity */}
            <div className="text-center mb-8">
              <div className="inline-block p-6 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/30">
                <h2 className="text-xl font-semibold">{network.entity.name}</h2>
                <p className="text-sm text-white/50 mt-1">
                  {network.entity.type === 'public_org' ? 'Organisme public' :
                   network.entity.type === 'association' ? 'Association' : 'Entreprise'}
                  {network.entity.city && ` · ${network.entity.city}`}
                  {network.entity.employees && ` · ~${network.entity.employees} employés`}
                </p>
              </div>
            </div>

            {/* Connections */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Incoming (awarded contracts) */}
              <div>
                <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-3">
                  Marchés remportés ({network.connections.filter(c => !c.is_outgoing && c.relation_type === 'AWARDED_TO').length})
                </h3>
                <div className="space-y-2">
                  {network.connections
                    .filter(c => !c.is_outgoing && c.relation_type === 'AWARDED_TO')
                    .sort((a, b) => (b.amount_eur || 0) - (a.amount_eur || 0))
                    .map((c, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="text-sm">{c.other_name}</p>
                          <p className="text-xs text-white/40">{c.contracts} contrat(s)</p>
                        </div>
                        <span className="text-sm font-mono text-green-400">
                          {c.amount_eur ? `${(c.amount_eur).toLocaleString('fr-FR')}€` : '—'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Outgoing (awarded to others) */}
              <div>
                <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-3">
                  Marchés attribués ({network.connections.filter(c => c.is_outgoing && c.relation_type === 'AWARDED_TO').length})
                </h3>
                <div className="space-y-2">
                  {network.connections
                    .filter(c => c.is_outgoing && c.relation_type === 'AWARDED_TO')
                    .sort((a, b) => (b.amount_eur || 0) - (a.amount_eur || 0))
                    .map((c, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="text-sm">{c.other_name}</p>
                          <p className="text-xs text-white/40">{c.contracts} contrat(s)</p>
                        </div>
                        <span className="text-sm font-mono text-orange-400">
                          {c.amount_eur ? `${(c.amount_eur).toLocaleString('fr-FR')}€` : '—'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Subsidies */}
              {network.connections.some(c => c.relation_type === 'SUBSIDIZED') && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wide mb-3">
                    Subventions
                  </h3>
                  <div className="space-y-2">
                    {network.connections
                      .filter(c => c.relation_type === 'SUBSIDIZED')
                      .map((c, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                          <div>
                            <p className="text-sm">
                              {c.is_outgoing ? `→ ${c.other_name}` : `← ${c.other_name}`}
                            </p>
                          </div>
                          <span className="text-sm font-mono text-violet-400">
                            {c.amount_eur ? `${(c.amount_eur).toLocaleString('fr-FR')}€` : '—'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Placeholder when no search */}
        {!network && !loading && !error && (
          <div className="text-center py-16 text-white/30">
            <p className="text-6xl mb-4">🕸️</p>
            <p className="text-lg">Recherchez une entreprise pour explorer son réseau</p>
            <p className="text-sm mt-2">
              Visualisez les relations marchés publics ↔ entreprises ↔ subventions
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

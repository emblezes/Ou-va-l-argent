'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

interface Proposition {
  id: string
  titre: string
  description: string
  prenom: string
  categorie: string
  votes: number
  date: string
}

const CATEGORIES = [
  'Dépenses publiques', 'Impôts & taxes', 'Retraites', 'Santé',
  'Éducation', 'Défense', 'Collectivités', 'Institutions', 'Autre',
]

const CATEGORY_COLORS: Record<string, string> = {
  'Dépenses publiques': 'bg-accent-red/15 text-accent-red border-accent-red/30',
  'Impôts & taxes': 'bg-accent-orange/15 text-accent-orange border-accent-orange/30',
  'Retraites': 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
  'Santé': 'bg-accent-green/15 text-accent-green border-accent-green/30',
  'Éducation': 'bg-accent-electric/15 text-accent-electric border-accent-electric/30',
  'Défense': 'bg-accent-gold/15 text-accent-gold border-accent-gold/30',
  'Collectivités': 'bg-accent-pink/15 text-accent-pink border-accent-pink/30',
  'Institutions': 'bg-[#6366f1]/15 text-[#6366f1] border-[#6366f1]/30',
  'Autre': 'bg-text-muted/15 text-text-muted border-text-muted/30',
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `il y a ${minutes}min`
  if (hours < 24) return `il y a ${hours}h`
  if (days < 30) return `il y a ${days}j`
  return `il y a ${Math.floor(days / 30)} mois`
}

function trendingScore(votes: number, dateStr: string): number {
  const hours = (Date.now() - new Date(dateStr).getTime()) / 3600000
  return votes / Math.pow(hours + 2, 2)
}

export default function PropositionsContent() {
  const [propositions, setPropositions] = useState<Proposition[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [votingId, setVotingId] = useState<string | null>(null)
  const [voteEmail, setVoteEmail] = useState('')
  const [voteLoading, setVoteLoading] = useState(false)
  const [voteError, setVoteError] = useState('')
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prenom: '',
    nom: '',
    email: '',
    categorie: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('ovla-vote-email')
    if (saved) setVoteEmail(saved)
    const voted = localStorage.getItem('ovla-voted-ids')
    if (voted) {
      try { setVotedIds(new Set(JSON.parse(voted))) } catch { /* ignore */ }
    }
    fetchPropositions()
  }, [])

  const fetchPropositions = async () => {
    try {
      const res = await fetch('/api/propositions')
      const data = await res.json()
      if (data.propositions) setPropositions(data.propositions)
    } catch {
      console.error('Failed to fetch propositions')
    } finally {
      setLoading(false)
    }
  }

  const sorted = useMemo(() => {
    const filtered = activeCategory
      ? propositions.filter(p => p.categorie === activeCategory)
      : propositions
    return [...filtered].sort((a, b) => trendingScore(b.votes, b.date) - trendingScore(a.votes, a.date))
  }, [propositions, activeCategory])

  const handleVote = useCallback(async (propositionId: string) => {
    if (!voteEmail || !voteEmail.includes('@')) {
      setVoteError('Entrez un email valide')
      return
    }
    setVoteLoading(true)
    setVoteError('')
    try {
      const res = await fetch('/api/propositions/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propositionId, email: voteEmail }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('ovla-vote-email', voteEmail)
        const newVoted = new Set(votedIds)
        newVoted.add(propositionId)
        setVotedIds(newVoted)
        localStorage.setItem('ovla-voted-ids', JSON.stringify(Array.from(newVoted)))
        setPropositions(prev => prev.map(p =>
          p.id === propositionId ? { ...p, votes: data.votes } : p
        ))
        setVotingId(null)
      } else {
        setVoteError(data.error || 'Erreur lors du vote')
      }
    } catch {
      setVoteError('Erreur réseau')
    } finally {
      setVoteLoading(false)
    }
  }, [voteEmail, votedIds])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      const res = await fetch('/api/propositions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitStatus('success')
        setFormData({ titre: '', description: '', prenom: '', nom: '', email: '', categorie: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    propositions.forEach(p => {
      counts[p.categorie] = (counts[p.categorie] || 0) + 1
    })
    return counts
  }, [propositions])

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <main className="relative z-[1] max-w-[1800px] mx-auto px-[16px] lg:px-[48px] pt-[100px] pb-[60px]">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="font-serif text-[clamp(3rem,10vw,6rem)] font-normal mb-6">
            Je <span className="italic text-accent-purple">propose</span>
          </h1>
          <p className="text-text-secondary text-2xl lg:text-3xl max-w-3xl mx-auto">
            Votez pour les meilleures idées et partagez les vôtres
          </p>
        </header>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT: Feed */}
          <div className="flex-1 min-w-0">
            {/* Category filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-3">
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 ${
                  !activeCategory
                    ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/40'
                    : 'bg-transparent text-text-muted border-glass-border hover:border-text-muted'
                }`}
              >
                Toutes ({propositions.length})
              </button>
              {CATEGORIES.filter(c => categoryCounts[c]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`shrink-0 px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 ${
                    activeCategory === cat
                      ? CATEGORY_COLORS[cat]
                      : 'bg-transparent text-text-muted border-glass-border hover:border-text-muted'
                  }`}
                >
                  {cat} ({categoryCounts[cat]})
                </button>
              ))}
            </div>

            {/* Feed */}
            {loading ? (
              <div className="space-y-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-bg-surface border border-glass-border rounded-3xl p-8 animate-pulse">
                    <div className="flex gap-6">
                      <div className="w-20 h-24 bg-bg-elevated rounded-xl" />
                      <div className="flex-1 space-y-4">
                        <div className="h-6 bg-bg-elevated rounded w-1/4" />
                        <div className="h-8 bg-bg-elevated rounded w-3/4" />
                        <div className="h-5 bg-bg-elevated rounded w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-muted text-2xl lg:text-3xl mb-3">
                  {activeCategory ? 'Aucune proposition dans cette catégorie' : 'Aucune proposition pour le moment'}
                </p>
                <p className="text-text-muted text-xl lg:text-2xl">
                  Soyez le premier à proposer une idée !
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {sorted.map(prop => {
                  const hasVoted = votedIds.has(prop.id)
                  const isVoting = votingId === prop.id

                  return (
                    <div
                      key={prop.id}
                      className="bg-bg-surface border border-glass-border rounded-3xl p-8 transition-all duration-200 hover:border-glass-border/80"
                    >
                      <div className="flex gap-6">
                        {/* Upvote button */}
                        <div className="flex flex-col items-center shrink-0">
                          <button
                            onClick={() => {
                              if (hasVoted) return
                              setVotingId(isVoting ? null : prop.id)
                              setVoteError('')
                            }}
                            className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                              hasVoted
                                ? 'bg-accent-purple/20 text-accent-purple cursor-default'
                                : 'bg-bg-elevated hover:bg-accent-purple/15 hover:text-accent-purple text-text-muted cursor-pointer'
                            }`}
                            title={hasVoted ? 'Vous avez voté' : 'Voter pour cette proposition'}
                          >
                            <svg width="24" height="15" viewBox="0 0 16 10" fill="none" className="mb-1">
                              <path d="M8 0L15 9H1L8 0Z" fill="currentColor" />
                            </svg>
                            <span className="text-2xl font-mono font-bold">{prop.votes}</span>
                          </button>
                          <span className={`text-sm font-semibold mt-1 ${hasVoted ? 'text-accent-purple' : 'text-accent-green'}`}>
                            {hasVoted ? 'Voté !' : 'Je vote'}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className={`inline-block px-4 py-1 rounded-full text-base font-semibold border ${CATEGORY_COLORS[prop.categorie] || CATEGORY_COLORS['Autre']}`}>
                              {prop.categorie}
                            </span>
                            <span className="text-text-muted text-base">
                              par {prop.prenom} · {timeAgo(prop.date)}
                            </span>
                          </div>
                          <h3 className="text-2xl lg:text-3xl font-semibold text-text-primary mb-2 leading-snug">
                            {prop.titre}
                          </h3>
                          <p className="text-text-primary text-xl lg:text-2xl leading-relaxed line-clamp-2">
                            {prop.description}
                          </p>
                        </div>
                      </div>

                      {/* Vote modal inline */}
                      {isVoting && !hasVoted && (
                        <div className="mt-6 pt-6 border-t border-glass-border">
                          <div className="flex gap-3 items-start max-w-2xl">
                            <div className="flex-1">
                              <input
                                type="email"
                                className="form-input text-xl py-3 px-5"
                                placeholder="Votre email pour voter"
                                value={voteEmail}
                                onChange={(e) => setVoteEmail(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleVote(prop.id)
                                  }
                                }}
                              />
                              {voteError && (
                                <p className="text-accent-red text-base mt-2">{voteError}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleVote(prop.id)}
                              disabled={voteLoading}
                              className="px-6 py-3 bg-accent-purple text-white text-xl font-semibold rounded-xl hover:bg-purple-600 transition-all disabled:opacity-50 shrink-0"
                            >
                              {voteLoading ? '...' : 'Voter'}
                            </button>
                            <button
                              onClick={() => setVotingId(null)}
                              className="px-5 py-3 text-text-muted text-xl hover:text-text-primary transition-colors shrink-0"
                            >
                              Annuler
                            </button>
                          </div>
                          <p className="text-text-muted text-base mt-3">
                            Votre email sert uniquement à empêcher le double vote.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Form */}
          <div className="w-full lg:w-[560px] shrink-0">
            <div className="lg:sticky lg:top-[110px]">
              <section className="bg-bg-surface border border-glass-border rounded-3xl p-8 lg:p-10">
                <h2 className="text-2xl lg:text-3xl font-semibold mb-2">Soumettre une proposition</h2>
                <p className="text-text-muted text-xl lg:text-2xl mb-8">Votre voix compte pour améliorer la gestion publique</p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label className="block text-base text-text-muted uppercase tracking-wider mb-2">Titre</label>
                    <input
                      type="text"
                      className="form-input text-xl py-4 px-5"
                      placeholder="Ex: Réduire le nombre d'agences publiques..."
                      required
                      disabled={isSubmitting}
                      value={formData.titre}
                      onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-base text-text-muted uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      className="form-textarea text-xl py-4 px-5 min-h-[180px]"
                      placeholder="Décrivez votre proposition (min. 50 caractères)"
                      required
                      disabled={isSubmitting}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-base text-text-muted uppercase tracking-wider mb-2">Catégorie</label>
                    <select
                      className="form-input text-xl py-4 px-5"
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      disabled={isSubmitting}
                    >
                      <option value="">-- Choisir --</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-base text-text-muted uppercase tracking-wider mb-2">Prénom</label>
                      <input
                        type="text"
                        className="form-input text-xl py-4 px-5"
                        placeholder="Prénom"
                        required
                        disabled={isSubmitting}
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-base text-text-muted uppercase tracking-wider mb-2">Nom</label>
                      <input
                        type="text"
                        className="form-input text-xl py-4 px-5"
                        placeholder="Nom"
                        required
                        disabled={isSubmitting}
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-base text-text-muted uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      className="form-input text-xl py-4 px-5"
                      placeholder="votre.email@exemple.com"
                      required
                      disabled={isSubmitting}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-accent-purple text-white text-xl font-semibold rounded-xl transition-all duration-200 hover:bg-purple-600 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma proposition'}
                  </button>

                  {submitStatus === 'success' && (
                    <p className="text-accent-green text-xl mt-4 text-center">
                      Merci ! Votre proposition sera visible après modération.
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-accent-red text-xl mt-4 text-center">
                      Une erreur est survenue. Veuillez réessayer.
                    </p>
                  )}
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

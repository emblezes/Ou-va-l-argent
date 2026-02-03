'use client'

import { useState, useEffect } from 'react'

const SAMPLE_PROPOSALS = [
  {
    id: 1,
    author: 'Marie Dupont',
    avatar: '👩‍💼',
    date: 'Il y a 2 heures',
    title: 'Fusionner les 1 200 agences de l\'État en 200 structures',
    desc: 'La France compte plus de 1 200 agences, opérateurs et autorités administratives. Une rationalisation permettrait d\'économiser 3 à 5 milliards d\'euros par an.',
    votes: 892,
  },
  {
    id: 2,
    author: 'Thomas Martin',
    avatar: '👨‍🔬',
    date: 'Il y a 4 heures',
    title: 'Plafonner les indemnités des élus au salaire médian',
    desc: 'Les indemnités des parlementaires devraient être alignées sur le salaire médian français (1 850 € net) pour créer un alignement d\'intérêts avec les citoyens.',
    votes: 1247,
  },
  {
    id: 3,
    author: 'Sophie Bernard',
    avatar: '👩‍🏫',
    date: 'Il y a 6 heures',
    title: 'Numériser 100% des démarches administratives',
    desc: 'Rendre toutes les démarches accessibles en ligne d\'ici 2028 avec accompagnement pour les publics éloignés du numérique. Estimation : 2 milliards d\'économies.',
    votes: 567,
  },
  {
    id: 4,
    author: 'Pierre Lefebvre',
    avatar: '👨‍💻',
    date: 'Il y a 8 heures',
    title: 'Créer un fonds souverain pour rembourser la dette',
    desc: 'Affecter 1% du PIB chaque année à un fonds souverain investi en actifs productifs. Les revenus serviraient au remboursement de la dette sur 30 ans.',
    votes: 412,
  },
  {
    id: 5,
    author: 'Claire Moreau',
    avatar: '👩‍⚖️',
    date: 'Il y a 10 heures',
    title: 'Instaurer un impôt plancher pour les grandes entreprises',
    desc: 'Établir un impôt minimum effectif de 15% pour toutes les entreprises réalisant plus de 750M€ de CA en France, aligné sur l\'accord OCDE.',
    votes: 634,
  },
  {
    id: 6,
    author: 'Lucas Petit',
    avatar: '👨‍🎓',
    date: 'Il y a 12 heures',
    title: 'Supprimer les doublons entre ministères',
    desc: 'Identifier et éliminer les fonctions redondantes entre ministères. Certaines missions sont dupliquées dans 3 ou 4 administrations différentes.',
    votes: 389,
  },
]

interface ProposalCardProps {
  proposal: typeof SAMPLE_PROPOSALS[0]
  entering?: boolean
}

function ProposalCard({ proposal, entering }: ProposalCardProps) {
  return (
    <article
      className={`bg-bg-surface border border-glass-border rounded-xl p-5 transition-all duration-500 hover:border-accent-purple/40 hover:translate-x-2 ${
        entering ? 'animate-slide-in' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-purple/20 to-accent-electric/20 rounded-full flex items-center justify-center text-xl">
            {proposal.avatar}
          </div>
          <div>
            <span className="text-sm font-semibold">{proposal.author}</span>
            <span className="block text-xs text-text-muted">{proposal.date}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-lg font-semibold text-accent-green">+{proposal.votes}</span>
          <span className="block text-xs text-text-muted">votes</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2 leading-snug">{proposal.title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">{proposal.desc}</p>
    </article>
  )
}

export default function PropositionsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleProposals, setVisibleProposals] = useState(SAMPLE_PROPOSALS.slice(0, 4))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % SAMPLE_PROPOSALS.length
        const newVisible = []
        for (let i = 0; i < 4; i++) {
          newVisible.push(SAMPLE_PROPOSALS[(next + i) % SAMPLE_PROPOSALS.length])
        }
        setVisibleProposals(newVisible)
        return next
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Merci pour votre proposition ! Elle sera examinée par notre équipe.')
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <main className="relative z-[1] max-w-[1400px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
            Je <span className="italic text-accent-purple">propose</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Partagez vos idées pour améliorer la gestion des finances publiques
          </p>
        </header>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <section className="bg-bg-surface border border-glass-border rounded-3xl p-6 lg:p-8 lg:sticky lg:top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-accent-purple/15 rounded-xl flex items-center justify-center text-2xl">
                ✍️
              </div>
              <div>
                <h2 className="text-xl font-semibold">Soumettre une proposition</h2>
                <p className="text-text-muted text-sm">Votre voix compte pour améliorer la gestion publique</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                  Titre de votre proposition
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Réduire le nombre d'agences publiques..."
                  required
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                  Description détaillée
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Décrivez votre proposition en détail : le problème identifié, la solution proposée, les bénéfices attendus..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                    Prénom
                  </label>
                  <input type="text" className="form-input" placeholder="Votre prénom" required />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                    Nom
                  </label>
                  <input type="text" className="form-input" placeholder="Votre nom" required />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-accent-purple text-white font-semibold rounded-lg transition-all duration-200 hover:bg-purple-600 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(168,85,247,0.3)]"
              >
                Soumettre ma proposition
              </button>
            </form>
          </section>

          {/* Proposals List */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-lg font-semibold">
                <span className="w-2.5 h-2.5 bg-accent-green rounded-full animate-pulse" />
                Propositions récentes
              </div>
              <span className="font-mono text-sm text-text-muted px-3 py-1.5 bg-bg-surface rounded-lg">
                1 247 propositions
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {visibleProposals.map((proposal, index) => (
                <ProposalCard key={`${proposal.id}-${index}`} proposal={proposal} />
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {SAMPLE_PROPOSALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    const newVisible = []
                    for (let i = 0; i < 4; i++) {
                      newVisible.push(SAMPLE_PROPOSALS[(index + i) % SAMPLE_PROPOSALS.length])
                    }
                    setVisibleProposals(newVisible)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-accent-purple scale-125'
                      : 'bg-bg-elevated'
                  }`}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 p-5 bg-bg-surface border border-glass-border rounded-xl">
              <div className="text-center">
                <div className="font-mono text-2xl font-semibold text-accent-purple">1 247</div>
                <div className="text-xs text-text-muted mt-1">Propositions</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-semibold text-accent-purple">18 420</div>
                <div className="text-xs text-text-muted mt-1">Votes</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-semibold text-accent-purple">4 328</div>
                <div className="text-xs text-text-muted mt-1">Participants</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

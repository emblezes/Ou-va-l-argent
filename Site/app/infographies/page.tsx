'use client'

import { useState } from 'react'

// Mock infographies data - in production these would be real PNG files
const INFOGRAPHIES = [
  {
    id: 1,
    title: 'Dépense sociale : 932 milliards',
    category: 'Dépenses',
    filename: 'depense-sociale-932-milliards.png',
    date: '2025-01-15',
  },
  {
    id: 2,
    title: 'France vs Pologne : PIB comparé',
    category: 'Comparaison',
    filename: 'infographie-france-pologne-pib.png',
    date: '2025-01-12',
  },
  {
    id: 3,
    title: 'La retraite, un système Ponzi ?',
    category: 'Retraite',
    filename: 'infographie-retraite-ponzi.png',
    date: '2025-01-10',
  },
  {
    id: 4,
    title: 'Singapour vs Argentine',
    category: 'Comparaison',
    filename: 'infographie-singapour-argentine-pib.png',
    date: '2025-01-08',
  },
  {
    id: 5,
    title: 'Dette par habitant 2025',
    category: 'Dette',
    filename: 'dette-par-habitant-2025.png',
    date: '2025-01-05',
  },
  {
    id: 6,
    title: 'Répartition du budget 2025',
    category: 'Budget',
    filename: 'repartition-budget-2025.png',
    date: '2025-01-03',
  },
]

const CATEGORIES = ['Tous', 'Dépenses', 'Dette', 'Comparaison', 'Budget', 'Retraite']

export default function InfographiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedInfographie, setSelectedInfographie] = useState<typeof INFOGRAPHIES[0] | null>(null)

  const filteredInfographies = selectedCategory === 'Tous'
    ? INFOGRAPHIES
    : INFOGRAPHIES.filter((i) => i.category === selectedCategory)

  return (
    <main className="relative z-[1] max-w-[1400px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
          <span className="italic text-accent-gold">Infographies</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Les chiffres clés des finances publiques en images, prêts à partager sur les réseaux sociaux
        </p>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedCategory === category
                ? 'bg-accent-gold text-bg-deep'
                : 'bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-glass-border/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInfographies.map((infographie) => (
          <div
            key={infographie.id}
            onClick={() => setSelectedInfographie(infographie)}
            className="bg-bg-surface border border-glass-border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-accent-gold/50 group"
          >
            {/* Placeholder for image */}
            <div className="aspect-square bg-gradient-to-br from-bg-elevated to-bg-deep flex items-center justify-center relative">
              <div className="text-6xl opacity-30">📊</div>
              <div className="absolute inset-0 bg-accent-gold/0 group-hover:bg-accent-gold/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-accent-gold text-bg-deep px-4 py-2 rounded-lg font-medium text-sm">
                  Voir en grand
                </span>
              </div>
            </div>

            <div className="p-4">
              <span className="text-xs text-accent-gold uppercase tracking-wider">{infographie.category}</span>
              <h3 className="text-base font-semibold mt-1 mb-2">{infographie.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-muted">{infographie.date}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // In production: trigger download
                    alert(`Téléchargement de ${infographie.filename}`)
                  }}
                  className="text-xs text-accent-electric hover:underline"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedInfographie && (
        <div
          className="fixed inset-0 z-50 bg-bg-deep/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedInfographie(null)}
        >
          <div
            className="bg-bg-surface border border-glass-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image placeholder */}
            <div className="aspect-square bg-gradient-to-br from-bg-elevated to-bg-deep flex items-center justify-center">
              <div className="text-9xl opacity-30">📊</div>
            </div>

            {/* Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-accent-gold uppercase tracking-wider">
                    {selectedInfographie.category}
                  </span>
                  <h2 className="text-xl font-semibold mt-1">{selectedInfographie.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedInfographie(null)}
                  className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-accent-gold text-bg-deep font-semibold rounded-lg transition-all hover:bg-[#e6c200]">
                  Télécharger PNG
                </button>
                <button className="px-6 py-3 bg-bg-elevated border border-glass-border rounded-lg text-text-secondary transition-all hover:text-text-primary">
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-12 text-center">
        <p className="text-text-muted text-sm">
          Toutes les infographies sont au format 1080×1080 pixels, optimisées pour Instagram et les réseaux sociaux.
          <br />
          Libres de droit pour un usage non commercial avec mention de la source.
        </p>
      </div>
    </main>
  )
}

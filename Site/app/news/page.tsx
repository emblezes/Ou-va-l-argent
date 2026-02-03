'use client'

import { useState } from 'react'

// Infographies data - will be replaced with actual images from /public/infographies/
const INFOGRAPHIES = [
  {
    id: 1,
    title: 'Dépense sociale : 932 milliards',
    category: 'Dépenses',
    date: '28 jan. 2025',
    emoji: '🏥',
    color: '#ff6b6b',
    stats: '932 Md€',
    subtitle: 'Premier poste de dépenses publiques',
  },
  {
    id: 2,
    title: 'Dette française : 3 150 milliards',
    category: 'Dette',
    date: '25 jan. 2025',
    emoji: '💳',
    color: '#ff4757',
    stats: '3 150 Md€',
    subtitle: '110% du PIB',
  },
  {
    id: 3,
    title: 'France vs Pologne : PIB par habitant',
    category: 'Comparaison',
    date: '22 jan. 2025',
    emoji: '🇫🇷🇵🇱',
    color: '#00d4ff',
    stats: '44k vs 18k €',
    subtitle: 'Évolution sur 30 ans',
  },
  {
    id: 4,
    title: 'Retraite : système de Ponzi ?',
    category: 'Retraite',
    date: '20 jan. 2025',
    emoji: '👴',
    color: '#ffd700',
    stats: '1.7 actif',
    subtitle: 'pour 1 retraité',
  },
  {
    id: 5,
    title: 'Singapour vs Argentine : 50 ans d\'écart',
    category: 'Comparaison',
    date: '18 jan. 2025',
    emoji: '🇸🇬🇦🇷',
    color: '#00ff88',
    stats: '65k vs 13k $',
    subtitle: 'PIB par habitant',
  },
  {
    id: 6,
    title: 'TVA : 212 milliards collectés',
    category: 'Impôts',
    date: '15 jan. 2025',
    emoji: '🛒',
    color: '#a855f7',
    stats: '212 Md€',
    subtitle: 'Premier impôt de France',
  },
  {
    id: 7,
    title: 'Cotisations : 40% du salaire brut',
    category: 'Salaire',
    date: '12 jan. 2025',
    emoji: '👔',
    color: '#ff9f43',
    stats: '40%',
    subtitle: 'Charges patronales + salariales',
  },
  {
    id: 8,
    title: 'Éducation : 168 milliards',
    category: 'Dépenses',
    date: '10 jan. 2025',
    emoji: '🎓',
    color: '#4ecdc4',
    stats: '168 Md€',
    subtitle: '10.5% du budget',
  },
  {
    id: 9,
    title: 'Défense : 65 milliards',
    category: 'Dépenses',
    date: '8 jan. 2025',
    emoji: '🛡️',
    color: '#45b7d1',
    stats: '65 Md€',
    subtitle: '+7.5% en 2025',
  },
  {
    id: 10,
    title: 'Intérêts de la dette : 52 milliards',
    category: 'Dette',
    date: '5 jan. 2025',
    emoji: '📈',
    color: '#ff4757',
    stats: '52 Md€/an',
    subtitle: '4ème poste budgétaire',
  },
  {
    id: 11,
    title: 'France : 2ème pays le plus taxé',
    category: 'Impôts',
    date: '3 jan. 2025',
    emoji: '🏆',
    color: '#ffd700',
    stats: '45.4%',
    subtitle: 'Prélèvements / PIB',
  },
  {
    id: 12,
    title: 'Fonctionnaires : 5.8 millions',
    category: 'Administration',
    date: '1 jan. 2025',
    emoji: '🏛️',
    color: '#00d4ff',
    stats: '5.8M',
    subtitle: 'Agents publics en France',
  },
]

const CATEGORIES = ['Tous', 'Dépenses', 'Dette', 'Impôts', 'Comparaison', 'Salaire', 'Retraite', 'Administration']

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  const filteredInfographies = selectedCategory === 'Tous'
    ? INFOGRAPHIES
    : INFOGRAPHIES.filter(info => info.category === selectedCategory)

  return (
    <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
          Nos <span className="italic text-accent-electric">Infographies</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Les finances publiques françaises en images. Partagez, informez, comprenez.
        </p>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-accent-electric text-bg-deep'
                : 'bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-electric/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Infographies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredInfographies.map((info) => (
          <article
            key={info.id}
            className="group bg-bg-surface border border-glass-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-accent-electric/50 cursor-pointer"
          >
            {/* Infographic Preview */}
            <div
              className="aspect-square relative flex flex-col items-center justify-center p-6"
              style={{
                background: `linear-gradient(135deg, ${info.color}15 0%, ${info.color}05 100%)`,
              }}
            >
              {/* Category badge */}
              <span
                className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold uppercase"
                style={{ background: `${info.color}20`, color: info.color }}
              >
                {info.category}
              </span>

              {/* Emoji */}
              <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {info.emoji}
              </span>

              {/* Main stat */}
              <span
                className="font-mono text-4xl font-bold"
                style={{ color: info.color }}
              >
                {info.stats}
              </span>

              {/* Subtitle */}
              <span className="text-text-secondary text-sm mt-2 text-center">
                {info.subtitle}
              </span>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-bg-deep/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-3">
                  <button className="p-3 bg-accent-electric rounded-full text-bg-deep hover:bg-accent-electric/80 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-3 bg-bg-surface border border-glass-border rounded-full text-text-primary hover:bg-accent-electric hover:text-bg-deep hover:border-accent-electric transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button className="p-3 bg-bg-surface border border-glass-border rounded-full text-text-primary hover:bg-accent-electric hover:text-bg-deep hover:border-accent-electric transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-accent-electric transition-colors">
                {info.title}
              </h3>
              <span className="text-text-muted text-xs">{info.date}</span>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-accent-electric/10 to-accent-purple/10 border border-glass-border rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl mb-3">Suivez-nous sur Instagram</h2>
          <p className="text-text-secondary mb-6">
            Retrouvez toutes nos infographies en haute qualité et partagez-les avec votre communauté.
          </p>
          <a
            href="https://instagram.com/ouvalargent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold rounded-full transition-transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @ouvalargent
          </a>
        </div>
      </div>
    </main>
  )
}

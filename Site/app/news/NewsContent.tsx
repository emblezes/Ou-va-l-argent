'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  titre: string
  slug: string
  type: string
  categorie: string
  date: string
  chapeau: string
  tags: string[]
  temps_lecture: number
  hero_url: string | null
}

const CATEGORY_COLORS: Record<string, string> = {
  'Finances publiques': '#00d4ff',
  'Macro-éco': '#ffd700',
  'Investissement': '#00ff88',
  'Actu éco': '#ff9f43',
  'International': '#a855f7',
  'Finance perso': '#ff4757',
  'Écologie': '#22c55e',
  'Culture': '#f472b6',
  'Impôts': '#ef4444',
  'Emploi': '#06b6d4',
  'Immobilier': '#d97706',
  'Santé': '#10b981',
  'Éducation': '#8b5cf6',
  'Défense': '#64748b',
  'Retraites': '#f59e0b',
  'Social': '#ec4899',
}

const CATEGORY_BACKGROUNDS: Record<string, string> = {
  'Finances publiques': 'linear-gradient(135deg, #06080c 0%, #0a1628 50%, #06080c 100%)',
  'Macro-éco': 'linear-gradient(135deg, #0c0a00 0%, #1a1400 50%, #0c0a00 100%)',
  'Investissement': 'linear-gradient(135deg, #040c06 0%, #0a2814 50%, #040c06 100%)',
  'Actu éco': 'linear-gradient(135deg, #0c0800 0%, #1a1000 50%, #0c0800 100%)',
  'International': 'linear-gradient(135deg, #08040c 0%, #140a28 50%, #08040c 100%)',
  'Finance perso': 'linear-gradient(135deg, #0c0406 0%, #28050a 50%, #0c0406 100%)',
  'Écologie': 'linear-gradient(135deg, #030c04 0%, #0a280e 50%, #030c04 100%)',
  'Culture': 'linear-gradient(135deg, #0c040a 0%, #28081e 50%, #0c040a 100%)',
  'Impôts': 'linear-gradient(135deg, #0c0404 0%, #280808 50%, #0c0404 100%)',
  'Emploi': 'linear-gradient(135deg, #040a0c 0%, #081a28 50%, #040a0c 100%)',
  'Immobilier': 'linear-gradient(135deg, #0c0804 0%, #281a08 50%, #0c0804 100%)',
  'Santé': 'linear-gradient(135deg, #040c08 0%, #082818 50%, #040c08 100%)',
  'Éducation': 'linear-gradient(135deg, #06040c 0%, #120a28 50%, #06040c 100%)',
  'Défense': 'linear-gradient(135deg, #080a0c 0%, #141a28 50%, #080a0c 100%)',
  'Retraites': 'linear-gradient(135deg, #0c0a04 0%, #281e08 50%, #0c0a04 100%)',
  'Social': 'linear-gradient(135deg, #0c040a 0%, #280a1e 50%, #0c040a 100%)',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function HeroFallback({ titre, categorie }: { titre: string; categorie: string }) {
  const accentColor = CATEGORY_COLORS[categorie] || '#00d4ff'
  const bg = CATEGORY_BACKGROUNDS[categorie] || CATEGORY_BACKGROUNDS['Finances publiques']
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: bg }}
    >
      {/* Radial glow — plus intense */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${accentColor}25 0%, transparent 60%)`,
        }}
      />
      {/* Grille colorée */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${accentColor}18 1px, transparent 1px), linear-gradient(90deg, ${accentColor}18 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Content — reproduit hero-generator.js */}
      <div className="relative z-10 flex flex-col justify-between h-full p-[6%]">
        {/* Logo — gros */}
        <div className="flex items-center gap-2">
          <span
            className="font-serif text-[clamp(2rem,5vw,4rem)] leading-none"
            style={{ color: accentColor }}
          >
            €
          </span>
          <span className="font-serif italic text-white text-[clamp(0.9rem,2.2vw,2rem)] leading-none">
            Où Va l&apos;Argent ?
          </span>
        </div>
        {/* Titre ÉNORME — prend tout l'espace */}
        <div className="flex-1 flex flex-col justify-center">
          <h3
            className="font-serif text-white text-[clamp(1.4rem,4vw,3.2rem)] leading-[1.1] line-clamp-3"
          >
            {titre}
          </h3>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className="px-2 py-0.5 rounded-full text-[clamp(0.45rem,0.9vw,0.7rem)] font-semibold uppercase tracking-wider"
            style={{ background: `${accentColor}20`, color: accentColor }}
          >
            {categorie}
          </span>
          <span className="font-semibold text-[clamp(0.5rem,1.2vw,1rem)]" style={{ color: accentColor }}>
            ouvalargent.com
          </span>
        </div>
      </div>
    </div>
  )
}

export default function NewsContent() {
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  useEffect(() => {
    fetchAllArticles()
  }, [])

  async function fetchAllArticles() {
    setLoading(true)
    try {
      const res = await fetch('/api/articles')
      if (res.ok) {
        const data = await res.json()
        setAllArticles(data.articles || [])
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  // Catégories dynamiques — uniquement celles ayant des articles
  const availableCategories = ['Tous', ...Array.from(new Set(allArticles.map(a => a.categorie))).sort()]

  // Articles filtrés
  const articles = selectedCategory === 'Tous'
    ? allArticles
    : allArticles.filter(a => a.categorie === selectedCategory)

  return (
    <main className="relative z-[1] max-w-[1800px] mx-auto px-[16px] lg:px-[48px] pt-[120px] pb-[60px]">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="font-serif text-[clamp(3rem,10vw,6rem)] font-normal mb-3">
          Nos <span className="italic text-accent-electric">Articles</span>
        </h1>
      </header>

      {/* Category Filter — dynamique */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-full text-xl lg:text-2xl font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-accent-electric/20 text-accent-electric border border-accent-electric/50'
                : 'bg-bg-surface/50 border border-glass-border/50 text-text-muted hover:text-text-secondary hover:border-glass-border'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent-electric/30 border-t-accent-electric rounded-full animate-spin" />
        </div>
      )}

      {/* No results */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-muted text-xl">Aucun article pour le moment.</p>
          <p className="text-text-muted text-base mt-2">Les articles seront bientôt disponibles.</p>
        </div>
      )}

      {/* Articles Grid */}
      {!loading && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group block"
            >
              <article className="bg-bg-surface border border-glass-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent-electric/30 h-full flex flex-col">
                {/* Hero Image */}
                <div className="aspect-[1200/630] relative bg-bg-deep overflow-hidden">
                  {article.hero_url ? (
                    <img
                      src={article.hero_url}
                      alt={article.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <HeroFallback titre={article.titre} categorie={article.categorie} />
                  )}

                  {/* Type badge */}
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    article.type === 'Analyse'
                      ? 'bg-accent-purple/20 text-accent-purple'
                      : 'bg-accent-electric/20 text-accent-electric'
                  }`}>
                    {article.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  {/* Category + Date + Reading time */}
                  <div className="flex items-center gap-3 mb-3 text-base">
                    <span
                      className="px-2.5 py-1 rounded font-medium"
                      style={{
                        background: `${CATEGORY_COLORS[article.categorie] || '#00d4ff'}20`,
                        color: CATEGORY_COLORS[article.categorie] || '#00d4ff',
                      }}
                    >
                      {article.categorie}
                    </span>
                    <span className="text-text-muted">{formatDate(article.date)}</span>
                    <span className="text-text-muted">{article.temps_lecture} min</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-2xl lg:text-3xl font-normal mb-3 text-text-primary group-hover:text-accent-electric transition-colors line-clamp-2">
                    {article.titre}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-text-secondary text-lg lg:text-xl leading-relaxed line-clamp-3 flex-1">
                    {article.chapeau}
                  </p>

                  {/* Read more */}
                  <div className="mt-4 flex items-center gap-1 text-accent-electric text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Lire l&apos;article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-accent-electric/10 to-accent-purple/10 border border-glass-border rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl lg:text-5xl mb-3">Restez informé</h2>
          <p className="text-text-secondary text-lg mb-6">
            Retrouvez nos analyses et infographies sur les finances publiques.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://www.linkedin.com/company/ouvalargent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077B5] text-white font-semibold rounded-full transition-transform hover:scale-105 text-sm"
            >
              LinkedIn
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61573579498498"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white font-semibold rounded-full transition-transform hover:scale-105 text-sm"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

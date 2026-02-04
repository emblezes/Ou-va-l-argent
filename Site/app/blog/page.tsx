'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock articles data - in production this would come from Sanity
const ARTICLES = [
  {
    slug: 'budget-equilibre-50-ans',
    title: 'Pourquoi la France n\'a-t-elle pas eu de budget équilibré depuis 50 ans ?',
    excerpt: 'Depuis 1974, chaque gouvernement français vote un budget en déficit. Comment en est-on arrivé là ? Quels mécanismes économiques et politiques expliquent cette situation unique en Europe ?',
    category: 'Analyse',
    categoryColor: '#00d4ff',
    date: '15 janvier 2025',
    readTime: 8,
    featured: true,
    emoji: '📊',
  },
  {
    slug: 'qui-detient-dette',
    title: 'Qui détient vraiment la dette française ?',
    excerpt: '48% de la dette française est détenue par des investisseurs étrangers. Mais qui sont-ils exactement et quels risques cela représente-t-il ?',
    category: 'Dette',
    categoryColor: '#ff4757',
    date: '12 jan. 2025',
    readTime: 5,
    emoji: '💰',
  },
  {
    slug: 'ir-44-pourcent',
    title: 'Pourquoi 44% des Français ne paient pas d\'impôt sur le revenu ?',
    excerpt: 'L\'impôt sur le revenu est progressif et préserve les bas revenus. Mais est-ce vraiment équitable ? Analyse des chiffres et des alternatives.',
    category: 'Impôts',
    categoryColor: '#ffd700',
    date: '10 jan. 2025',
    readTime: 6,
    emoji: '🧾',
  },
  {
    slug: 'sante-815-milliards',
    title: 'Santé : où passent les 815 milliards ?',
    excerpt: 'Le budget Santé & Solidarités représente 50% des dépenses publiques. Décryptage de ce mastodonte budgétaire et de son efficacité.',
    category: 'Dépenses',
    categoryColor: '#00d4ff',
    date: '8 jan. 2025',
    readTime: 7,
    emoji: '🏥',
  },
  {
    slug: 'allemagne-pays-bas',
    title: 'Comment font l\'Allemagne et les Pays-Bas pour dépenser moins ?',
    excerpt: 'Avec 49% du PIB contre 57% pour la France, nos voisins dépensent moins. Quelles recettes et quels sacrifices ?',
    category: 'Europe',
    categoryColor: '#a855f7',
    date: '5 jan. 2025',
    readTime: 6,
    emoji: '🇪🇺',
  },
  {
    slug: 'cest-quoi-pib',
    title: 'C\'est quoi exactement le PIB ?',
    excerpt: 'On parle de ratio dette/PIB, dépenses/PIB... Mais qu\'est-ce que le PIB exactement et pourquoi est-il si important ?',
    category: 'Économie',
    categoryColor: '#00ff88',
    date: '3 jan. 2025',
    readTime: 4,
    emoji: '📈',
  },
  {
    slug: 'brut-net-difference',
    title: 'Brut vs Net : pourquoi une telle différence ?',
    excerpt: 'Entre le coût employeur et le net en poche, la différence peut dépasser 40%. Explication des cotisations et de leur destination.',
    category: 'Salaire',
    categoryColor: '#ff9f43',
    date: '1 jan. 2025',
    readTime: 5,
    emoji: '👔',
  },
]

const CATEGORIES = [
  { name: 'Dette publique', count: 24 },
  { name: 'Impôts', count: 31 },
  { name: 'Dépenses', count: 28 },
  { name: 'Europe', count: 15 },
  { name: 'Salaire', count: 12 },
]

const POPULAR = [
  { title: 'Pourquoi la France n\'a pas eu de budget équilibré depuis 1974', views: '18k' },
  { title: 'La dette française expliquée en 5 minutes', views: '14k' },
  { title: 'Où vont vraiment vos impôts ?', views: '12k' },
]

const TAGS = ['dette', 'impôts', 'TVA', 'déficit', 'PIB', 'cotisations', 'retraite', 'santé', 'éducation', 'Europe']

export default function BlogPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const featuredArticle = ARTICLES.find((a) => a.featured)
  const regularArticles = ARTICLES.filter((a) => !a.featured)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('https://formspree.io/f/mbdknqpb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setEmail('')
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative z-[1] max-w-[1400px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Header */}
        <header className="lg:col-span-2 text-center mb-8">
          <h1 className="font-serif text-[clamp(2rem,5vw,2.5rem)] font-normal mb-3">
            Le <span className="italic text-accent-electric">Blog</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Questions fréquentes, analyses et décryptages pour mieux comprendre les finances publiques
          </p>
        </header>

        {/* Featured Article */}
        {featuredArticle && (
          <article className="lg:col-span-2 bg-gradient-to-br from-bg-surface to-bg-elevated border border-glass-border rounded-2xl overflow-hidden grid md:grid-cols-2 mb-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent-electric">
            <div className="bg-gradient-to-br from-accent-electric/20 to-accent-purple/20 flex items-center justify-center text-8xl min-h-[250px]">
              {featuredArticle.emoji}
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-electric text-bg-deep rounded-full text-xs font-semibold uppercase w-fit mb-4">
                <span>⭐</span> Article à la une
              </div>
              <h2 className="font-serif text-2xl font-normal mb-4 leading-snug">
                {featuredArticle.title}
              </h2>
              <p className="text-text-secondary mb-6">{featuredArticle.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span>📅 {featuredArticle.date}</span>
                <span>⏱️ {featuredArticle.readTime} min de lecture</span>
              </div>
            </div>
          </article>
        )}

        {/* Articles List */}
        <div className="flex flex-col gap-4">
          {regularArticles.map((article) => (
            <article
              key={article.slug}
              className="bg-bg-surface border border-glass-border rounded-xl overflow-hidden grid md:grid-cols-[180px_1fr] transition-all duration-300 hover:translate-x-1 hover:border-accent-electric/30 group"
            >
              <div
                className="flex items-center justify-center text-5xl min-h-[120px]"
                style={{
                  background: `linear-gradient(135deg, ${article.categoryColor}20, ${article.categoryColor}10)`,
                }}
              >
                {article.emoji}
              </div>
              <div className="p-5">
                <span
                  className="inline-block px-2 py-1 rounded text-xs font-semibold uppercase mb-3"
                  style={{
                    background: `${article.categoryColor}20`,
                    color: article.categoryColor,
                  }}
                >
                  {article.category}
                </span>
                <h3 className="text-lg font-semibold mb-2 leading-snug group-hover:text-accent-electric transition-colors">
                  {article.title}
                </h3>
                <p className="text-text-secondary text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex gap-4 text-xs text-text-muted">
                  <span>{article.date}</span>
                  <span>{article.readTime} min</span>
                </div>
              </div>
            </article>
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-sm transition-all ${
                  page === 1
                    ? 'bg-accent-electric text-bg-deep'
                    : 'bg-bg-surface border border-glass-border text-text-secondary hover:bg-accent-electric hover:text-bg-deep'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="w-10 h-10 flex items-center justify-center bg-bg-surface border border-glass-border rounded-lg text-text-secondary hover:bg-accent-electric hover:text-bg-deep">
              →
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* Categories */}
          <div className="bg-bg-surface border border-glass-border rounded-xl p-5">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              📂 Catégories
            </h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href="#"
                  className="flex justify-between items-center px-3 py-2.5 bg-bg-elevated rounded-lg text-text-secondary text-sm no-underline transition-all hover:bg-accent-electric/10 hover:text-accent-electric"
                >
                  <span>{cat.name}</span>
                  <span className="font-mono text-xs px-2 py-0.5 bg-bg-deep rounded">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular */}
          <div className="bg-bg-surface border border-glass-border rounded-xl p-5">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              🔥 Les plus lus
            </h3>
            <div className="flex flex-col gap-4">
              {POPULAR.map((item, index) => (
                <Link key={index} href="#" className="flex gap-3 no-underline group">
                  <span className="font-mono text-2xl font-bold text-accent-electric/50">
                    0{index + 1}
                  </span>
                  <div>
                    <div className="text-sm font-medium leading-snug group-hover:text-accent-electric transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-text-muted mt-1">{item.views} lectures</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-bg-surface border border-glass-border rounded-xl p-5">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              🏷️ Tags populaires
            </h3>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <Link
                  key={tag}
                  href="#"
                  className="px-3 py-1.5 bg-bg-elevated border border-glass-border rounded-full text-sm text-text-secondary no-underline transition-all hover:border-accent-electric hover:text-accent-electric"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-bg-surface border border-glass-border rounded-xl p-5">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              📬 Newsletter
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Recevez nos analyses et décryptages chaque semaine.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Votre email"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 bg-accent-electric text-bg-deep font-semibold rounded-lg transition-all hover:bg-[#00b8e6] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Inscription...' : "S'abonner"}
              </button>
              {submitStatus === 'success' && (
                <p className="text-accent-green text-sm flex items-center gap-2">
                  <span>✓</span> Bienvenue !
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-accent-red text-sm flex items-center gap-2">
                  <span>✗</span> Erreur. Réessayez.
                </p>
              )}
            </form>
          </div>
        </aside>
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import ArticleRenderer from '@/components/ArticleRenderer'

interface Article {
  id: string
  titre: string
  slug: string
  type: string
  categorie: string
  date: string
  contenu: string
  chapeau: string
  sources: string
  source_url: string | null
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
    month: 'long',
    year: 'numeric',
  })
}

function HeroFallback({ titre, categorie }: { titre: string; categorie: string }) {
  const accentColor = CATEGORY_COLORS[categorie] || '#00d4ff'
  const bg = CATEGORY_BACKGROUNDS[categorie] || CATEGORY_BACKGROUNDS['Finances publiques']
  return (
    <div
      className="w-full h-full relative overflow-hidden rounded-2xl"
      style={{ background: bg }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${accentColor}25 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${accentColor}18 1px, transparent 1px), linear-gradient(90deg, ${accentColor}18 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Titre prend quasi tout l'espace */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-12">
        {/* Logo — gros */}
        <div className="flex items-center gap-4">
          <span className="font-serif text-6xl lg:text-7xl leading-none" style={{ color: accentColor }}>€</span>
          <span className="font-serif italic text-white text-2xl lg:text-3xl leading-none">Où Va l&apos;Argent ?</span>
        </div>
        {/* Titre ÉNORME centré */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-serif text-white text-[clamp(2.5rem,5vw,5rem)] leading-[1.1]">
            {titre}
          </h2>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className="px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider"
            style={{ background: `${accentColor}20`, color: accentColor }}
          >
            {categorie}
          </span>
          <span className="font-semibold text-lg" style={{ color: accentColor }}>ouvalargent.com</span>
        </div>
      </div>
    </div>
  )
}

export default function ArticleContent({ article }: { article: Article }) {
  const accentColor = CATEGORY_COLORS[article.categorie] || '#00d4ff'
  const articleUrl = `https://ouvalargent.com/news/${article.slug}`

  return (
    <main className="relative z-[1] pt-[80px] pb-[60px]">
      {/* Hero Image — pleine largeur */}
      <div className="w-full max-w-[1800px] mx-auto px-4 lg:px-12 mb-10">
        <div className="aspect-[1200/630] rounded-2xl overflow-hidden">
          {article.hero_url ? (
            <img
              src={article.hero_url}
              alt={article.titre}
              className="w-full h-full object-cover"
            />
          ) : (
            <HeroFallback titre={article.titre} categorie={article.categorie} />
          )}
        </div>
      </div>

      {/* Article — pleine largeur */}
      <div className="max-w-[1800px] mx-auto px-4 lg:px-12">
        {/* Meta + Share — même ligne */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="px-5 py-2 rounded-full text-xl font-semibold uppercase"
              style={{
                background: `${accentColor}20`,
                color: accentColor,
              }}
            >
              {article.categorie}
            </span>
            <span className={`px-5 py-2 rounded-full text-xl font-semibold ${
              article.type === 'Analyse'
                ? 'bg-accent-purple/20 text-accent-purple'
                : 'bg-accent-electric/20 text-accent-electric'
            }`}>
              {article.type}
            </span>
            <span className="text-text-muted text-xl">{formatDate(article.date)}</span>
            <span className="text-text-muted text-xl">{article.temps_lecture} min de lecture</span>
          </div>
          {/* Share buttons — gros et visibles */}
          <div className="flex items-center gap-4">
            <span className="text-text-muted text-xl font-medium">Partager sur</span>
            <div className="flex gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-[#0077B5]/15 text-[#0077B5] rounded-xl text-xl font-semibold hover:bg-[#0077B5]/25 transition-colors"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-[#1877F2]/15 text-[#1877F2] rounded-xl text-xl font-semibold hover:bg-[#1877F2]/25 transition-colors"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.titre)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-white/5 text-text-secondary rounded-xl text-xl font-semibold hover:bg-white/10 transition-colors"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </a>
            </div>
          </div>
        </div>

        {/* Title — énorme */}
        <h1 className="font-serif text-[clamp(3.5rem,7vw,6rem)] font-normal leading-tight mb-8 text-text-primary">
          {article.titre}
        </h1>

        {/* Chapeau */}
        <p className="text-text-secondary text-[2.5rem] lg:text-[3rem] leading-snug mb-12 border-l-4 pl-8" style={{ borderColor: accentColor }}>
          {article.chapeau}
        </p>

        {/* Divider */}
        <hr className="border-glass-border mb-12" />

        {/* Article Body */}
        <ArticleRenderer content={article.contenu} />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-5 py-2 bg-bg-surface border border-glass-border rounded-full text-lg text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-14 bg-gradient-to-r from-accent-electric/10 to-accent-purple/10 border border-glass-border rounded-2xl p-10 text-center">
          <h3 className="font-serif text-4xl mb-4">Restez informé</h3>
          <p className="text-text-secondary text-xl mb-6">
            Recevez nos analyses et décryptages directement dans votre boîte mail.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-electric text-bg-deep font-semibold rounded-full hover:bg-accent-electric/90 transition-colors text-lg"
          >
            S&apos;abonner à la newsletter
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-accent-electric text-lg hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux articles
          </Link>
        </div>
      </div>
    </main>
  )
}

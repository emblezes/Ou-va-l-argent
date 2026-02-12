'use client'

import { useState } from 'react'
import Image from 'next/image'

const INFOGRAPHIES = [
  { id: 31, filename: '31-actifs-fonds-pension-monde-instagram.png', title: 'Actifs des fonds de pension dans le monde', category: 'Retraite' },
  { id: 30, filename: '30-fonds-souverain-norvege-instagram.png', title: 'Le fonds souverain norvégien', category: 'Investissement' },
  { id: 29, filename: '29-zero-perte-20-ans-actions-instagram.png', title: 'Zéro perte sur 20 ans en actions', category: 'Investissement' },
  { id: 28, filename: '28-rendement-capitalisation-vs-repartition-instagram.png', title: 'Rendement : capitalisation vs répartition', category: 'Retraite' },
  { id: 27, filename: '27-fecondite-france-plus-bas-instagram.png', title: 'Fécondité en France au plus bas', category: 'Démographie' },
  { id: 26, filename: '26-pays-bas-fonds-pension-213-pib-instagram.png', title: 'Pays-Bas : fonds de pension = 213% du PIB', category: 'Retraite' },
  { id: 25, filename: '25-classement-mercer-retraites-2025-instagram.png', title: 'Classement Mercer des retraites 2025', category: 'Retraite' },
  { id: 24, filename: '24-simulation-capitalisation-980k-instagram.png', title: 'Simulation capitalisation : 980k€', category: 'Retraite' },
  { id: 23, filename: '23-triple-degradation-notes-instagram.png', title: 'Triple dégradation des notes', category: 'Dette' },
  { id: 22, filename: '22-charge-interets-dette-instagram.png', title: "Charge d'intérêts de la dette", category: 'Dette' },
  { id: 21, filename: '21-detenteurs-dette-france-instagram.png', title: 'Détenteurs de la dette française', category: 'Dette' },
  { id: 20, filename: '20-retraites-capitalisation-plus-elevees-instagram.png', title: 'Retraites par capitalisation plus élevées', category: 'Retraite' },
  { id: 19, filename: '19-capitalisation-vs-repartition-instagram.png', title: 'Capitalisation vs répartition', category: 'Retraite' },
  { id: 18, filename: '18-pensions-retraite-europe-instagram.png', title: 'Pensions de retraite en Europe', category: 'Retraite' },
  { id: 17, filename: '17-vieillissement-mondial-2070-instagram.png', title: 'Vieillissement mondial horizon 2070', category: 'Démographie' },
  { id: 16, filename: '16-retraites-explosion-2070-instagram.png', title: 'Retraites : explosion à horizon 2070', category: 'Retraite' },
  { id: 15, filename: '15-hotels-plus-chers-paris-instagram.png', title: 'Les hôtels les plus chers de Paris', category: 'Actualité' },
  { id: 14, filename: '14-explosion-dette-france-instagram.png', title: 'Explosion de la dette française', category: 'Dette' },
  { id: 13, filename: '13-deficit-zone-euro-instagram.png', title: 'Déficit en zone euro', category: 'Finances publiques' },
  { id: 12, filename: '12-dette-publique-europe-instagram.png', title: 'Dette publique en Europe', category: 'Dette' },
  { id: 11, filename: '11-salaire-moyen-par-pays-instagram.png', title: 'Salaire moyen par pays', category: 'International' },
  { id: 10, filename: '10-indice-big-mac-instagram.png', title: 'Indice Big Mac', category: 'International' },
  { id: 9, filename: '09-prix-cigarette-france-instagram.png', title: 'Prix de la cigarette en France', category: 'Actualité' },
  { id: 8, filename: '08-fertilite-par-pays-instagram.png', title: 'Fertilité par pays', category: 'Démographie' },
  { id: 7, filename: '07-top5-pays-peuples-instagram.png', title: 'Top 5 des pays les plus peuplés', category: 'International' },
  { id: 6, filename: '06-salaires-suisse-instagram.png', title: 'Les salaires en Suisse', category: 'International' },
  { id: 5, filename: '05-cuivre-instagram.png', title: 'Le marché du cuivre', category: 'Investissement' },
  { id: 4, filename: '04-chatgpt-utilisateurs-instagram.png', title: 'Utilisateurs de ChatGPT', category: 'Actualité' },
  { id: 3, filename: '03-singapour-argentine-divergence-instagram.png', title: 'Singapour vs Argentine : divergence', category: 'International' },
  { id: 2, filename: '02-pologne-rattrapage-courbes-instagram.png', title: 'Pologne : le rattrapage', category: 'International' },
  { id: 1, filename: '01-france-pologne-comparaison-instagram.png', title: 'France vs Pologne : comparaison', category: 'International' },
]

const CATEGORIES = Array.from(new Set(INFOGRAPHIES.map((i) => i.category))).sort()

export default function ActualitePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedInfographie, setSelectedInfographie] = useState<typeof INFOGRAPHIES[0] | null>(null)

  const filtered = selectedCategory
    ? INFOGRAPHIES.filter((i) => i.category === selectedCategory)
    : INFOGRAPHIES

  return (
    <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal mb-3">
          <span className="italic text-accent-electric">Actualités</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Toutes nos infographies économiques et financières, prêtes à partager
        </p>
        <p className="text-text-muted text-sm mt-2">
          {INFOGRAPHIES.length} infographies publiées
        </p>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            !selectedCategory
              ? 'bg-accent-electric text-bg-deep'
              : 'bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-electric/30'
          }`}
        >
          Tous ({INFOGRAPHIES.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = INFOGRAPHIES.filter((i) => i.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-accent-electric text-bg-deep'
                  : 'bg-bg-surface border border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-electric/30'
              }`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Wall of infographies */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {filtered.map((infographie) => (
          <div
            key={infographie.id}
            onClick={() => setSelectedInfographie(infographie)}
            className="group cursor-pointer rounded-xl overflow-hidden border border-glass-border hover:border-accent-electric/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,212,255,0.15)]"
          >
            <div className="relative aspect-square">
              <Image
                src={`/infographies/${infographie.filename}`}
                alt={infographie.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-text-primary text-xs font-medium leading-tight">
                  {infographie.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedInfographie && (
        <div
          className="fixed inset-0 z-[200] bg-bg-deep/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedInfographie(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedInfographie(null)}
              className="absolute -top-12 right-0 p-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation arrows */}
            <button
              onClick={() => {
                const currentIdx = INFOGRAPHIES.findIndex((i) => i.id === selectedInfographie.id)
                const prev = INFOGRAPHIES[currentIdx - 1]
                if (prev) setSelectedInfographie(prev)
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 p-2 text-text-muted hover:text-text-primary transition-colors hidden lg:block"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                const currentIdx = INFOGRAPHIES.findIndex((i) => i.id === selectedInfographie.id)
                const next = INFOGRAPHIES[currentIdx + 1]
                if (next) setSelectedInfographie(next)
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 p-2 text-text-muted hover:text-text-primary transition-colors hidden lg:block"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden border border-glass-border">
              <Image
                src={`/infographies/${selectedInfographie.filename}`}
                alt={selectedInfographie.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
                priority
              />
            </div>

            {/* Info bar */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-accent-electric text-xs uppercase tracking-wider font-medium">
                  {selectedInfographie.category}
                </span>
                <h2 className="text-lg font-semibold mt-0.5">{selectedInfographie.title}</h2>
              </div>
              <span className="text-text-muted text-sm font-mono">
                #{String(selectedInfographie.id).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

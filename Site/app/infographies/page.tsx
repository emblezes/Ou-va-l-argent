'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Infographic {
  id: string
  title: string
  category: string
  filename: string
}

// Infographies publi\u00e9es sur les r\u00e9seaux sociaux
const INFOGRAPHICS: Infographic[] = [
  { id: '17', title: "La France d\u00e9pense plus que l'URSS", category: 'D\u00e9penses', filename: '17-france-vs-chine-urss-instagram.png' },
  { id: '172', title: 'Plein d\u2019essence \u00e0 92 \u20ac : taxes vs co\u00fbt r\u00e9el', category: 'Fiscalit\u00e9', filename: '172-plein-essence-taxes-vs-cout-instagram.png' },
  { id: '175', title: '560 000 \u00e9lus locaux : d\u00e9compte national', category: 'France', filename: '175-elus-locaux-decompte-national-instagram.png' },
  { id: '129', title: 'Les Singapouriens deux fois plus riches que les Fran\u00e7ais', category: 'International', filename: '129-singapour-pib-habitant-instagram.png' },
  { id: '114', title: 'La dette augmente de 5 390 \u20ac par seconde', category: 'Dette', filename: '114-dette-5350-par-seconde-instagram.png' },
  { id: '82', title: '\u00c9volution du prix au m\u00b2 \u00e0 Paris', category: 'Immobilier', filename: '82-evolution-prix-m2-paris-instagram.png' },
  { id: '176', title: 'La France emprunte \u00e0 3,7 %, plus haut niveau depuis 15 ans', category: 'Dette', filename: '176-taux-emprunt-france-10ans-instagram.png' },
  { id: '177f', title: 'Fonctionnaires pour 1 000 habitants', category: 'France', filename: '177-fonctionnaires-paris-vs-europe-instagram.png' },
  { id: '181', title: 'La France d\u00e9pense 7\u00d7 plus pour les retraites que pour la d\u00e9fense', category: 'D\u00e9penses', filename: '181-retraites-vs-defense-instagram.png' },
  { id: '178', title: 'La dette de Paris multipli\u00e9e par 9 en 25 ans', category: 'Dette', filename: '178-dette-paris-30ans-instagram.png' },
  { id: '183', title: 'La pyramide des salaires en France', category: 'Salaires', filename: '183-pyramide-salaires-france-instagram.png' },
  { id: '182', title: 'D\u00e9troit d\u2019Hormuz : o\u00f9 va le p\u00e9trole ?', category: 'International', filename: '182-detroit-hormuz-flux-petrole-instagram.png' },
  { id: '95', title: 'Fiche de paie : 3 000 \u20ac brut, combien tu re\u00e7ois ?', category: 'Salaires', filename: '95-fiche-de-paie-simple-instagram.png' },
  { id: '27', title: 'Seul un tiers des Fran\u00e7ais financent l\u2019\u00c9tat', category: 'Fiscalit\u00e9', filename: '27-qui-nourrit-etat-instagram.png' },
  { id: '28', title: 'Retraites : pas assez de monde pour les payer', category: 'D\u00e9penses', filename: '28-retraites-explosion-2070-instagram.png' },
]

const CATEGORIES = ['Tous', 'D\u00e9penses', 'Dette', 'Fiscalit\u00e9', 'France', 'International', 'Immobilier', 'Salaires']

export default function InfographiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedInfographie, setSelectedInfographie] = useState<Infographic | null>(null)

  const filteredInfographies =
    selectedCategory === 'Tous'
      ? INFOGRAPHICS
      : INFOGRAPHICS.filter((i) => i.category === selectedCategory)

  return (
    <div className="page-overlay">
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 pt-[60px] lg:pt-[80px] pb-[60px]">
      {/* Header */}
      <header className="text-center mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-electric transition-colors text-sm mb-6 no-underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>
        <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal mb-3">
          Nos <span className="italic text-accent-gold">Infographies</span>
        </h1>
        <p className="text-text-secondary text-lg lg:text-xl max-w-2xl mx-auto">
          Pr{'\u00ea'}tes {'\u00e0'} partager sur les r{'\u00e9'}seaux sociaux
        </p>
      </header>

      <p className="text-text-muted text-xs text-center mb-6">
        Libre de droit pour un usage non commercial avec mention de la source.
      </p>

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
            {category !== 'Tous' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({INFOGRAPHICS.filter((i) => i.category === category).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {filteredInfographies.map((infographie) => (
          <div
            key={infographie.id}
            onClick={() => setSelectedInfographie(infographie)}
            className="bg-bg-surface border border-glass-border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/50 group"
          >
            <div className="relative aspect-square">
              <Image
                src={`/infographies/${infographie.filename}`}
                alt={infographie.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-accent-gold text-bg-deep px-3 py-1.5 rounded-lg font-medium text-sm">
                  Voir en grand
                </span>
              </div>
            </div>

            <div className="p-3">
              <span className="text-[10px] text-accent-gold uppercase tracking-wider font-medium">
                {infographie.category}
              </span>
              <h3 className="text-sm font-medium mt-0.5 leading-tight line-clamp-2">
                {infographie.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox - plein ecran */}
      {selectedInfographie && (
        <div
          className="fixed inset-0 z-[100] bg-bg-deep/95 backdrop-blur-xl flex items-center justify-center p-[2%]"
          onClick={() => setSelectedInfographie(null)}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setSelectedInfographie(null)}
            className="absolute top-[3%] right-[3%] z-10 p-2 bg-bg-surface/80 hover:bg-bg-elevated rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image : prend tout l'espace disponible */}
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`/infographies/${selectedInfographie.filename}`}
              alt={selectedInfographie.title}
              fill
              sizes="96vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

    </div>
    </div>
  )
}

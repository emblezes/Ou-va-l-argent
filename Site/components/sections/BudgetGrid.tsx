'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface CategoryData {
  id: string
  name: string
  shortName: string
  icon: string
  amount: number
  percent: number
  evolution: number
  color: string
  description: string
  href?: string
  isHighlight?: boolean
}

interface BudgetCardProps {
  ministry: CategoryData
  delay: number
}

function BudgetCard({ ministry, delay }: BudgetCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay * 100)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const CardContent = (
    <>
      {/* Color bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: ministry.color }}
      />

      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl">{ministry.icon}</span>
      </div>

      <h3 className="font-semibold text-lg mb-1">{ministry.shortName}</h3>
      <p className="text-text-muted text-sm mb-4">{ministry.description}</p>

      <div className="font-mono text-2xl font-medium" style={{ color: ministry.color }}>
        {ministry.amount} Md€
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            backgroundColor: ministry.color,
            width: isVisible ? `${ministry.percent}%` : '0%',
          }}
        />
      </div>
      <div className="text-text-secondary text-base font-semibold mt-2 text-right">{ministry.percent}% du budget</div>

      {ministry.href && (
        <div className="mt-3 text-xs text-accent-electric flex items-center gap-1">
          Voir le détail <span>→</span>
        </div>
      )}
    </>
  )

  const baseClasses = `bg-bg-surface border rounded-xl p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  } ${ministry.isHighlight ? 'border-accent-electric/50 hover:border-accent-electric' : 'border-glass-border hover:border-glass-border/30'}`

  if (ministry.href) {
    return (
      <Link href={ministry.href} ref={cardRef} className={`${baseClasses} block no-underline`}>
        {CardContent}
      </Link>
    )
  }

  return (
    <div ref={cardRef} className={baseClasses}>
      {CardContent}
    </div>
  )
}

// Catégories avec retraites et santé isolées
const HOMEPAGE_CATEGORIES: CategoryData[] = [
  {
    id: 'retraites',
    name: 'Retraites',
    shortName: 'Retraites',
    icon: '👴',
    amount: 380,
    percent: 22.8,
    evolution: 3.8,
    color: '#ff9f43',
    description: '1er poste de dépenses publiques',
    href: '/depenses/retraites',
    isHighlight: true,
  },
  {
    id: 'solidarites',
    name: 'Autres prestations sociales',
    shortName: 'Autres prestations sociales',
    icon: '🤝',
    amount: 282,
    percent: 16.9,
    evolution: 3.5,
    color: '#a855f7',
    description: 'Famille, chômage, logement, RSA',
  },
  {
    id: 'sante',
    name: 'Santé',
    shortName: 'Santé',
    icon: '🏥',
    amount: 270,
    percent: 16.2,
    evolution: 4.2,
    color: '#ff6b6b',
    description: 'Assurance maladie, hôpitaux',
  },
  {
    id: 'education',
    name: 'Éducation nationale',
    shortName: 'Éducation & Recherche',
    icon: '🎓',
    amount: 168,
    percent: 10.1,
    evolution: 2.1,
    color: '#4ecdc4',
    description: 'Investissement d\'avenir',
  },
  {
    id: 'defense',
    name: 'Armées',
    shortName: 'Défense & Sécurité',
    icon: '🛡️',
    amount: 65,
    percent: 3.9,
    evolution: 7.5,
    color: '#45b7d1',
    description: 'Sécurité nationale',
  },
  {
    id: 'autres',
    name: 'Autres dépenses',
    shortName: 'Autres',
    icon: '📊',
    amount: 505,
    percent: 30.2,
    evolution: 2.8,
    color: '#64748b',
    description: 'Administration, dette, écologie...',
  },
]

export function BudgetGrid() {
  return (
    <section className="py-16 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-4">
            Où <span className="italic text-accent-gold">dépense-t-on</span> ?
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Répartition des 1 670 milliards d&apos;euros de dépenses publiques par grands postes budgétaires
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {HOMEPAGE_CATEGORIES.map((category, index) => (
            <BudgetCard key={category.id} ministry={category} delay={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/depenses" className="btn-secondary no-underline inline-flex">
            Voir tous les détails
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MINISTRIES } from '@/lib/constants/budget'

interface BudgetCardProps {
  ministry: typeof MINISTRIES[0]
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

  return (
    <div
      ref={cardRef}
      className={`bg-bg-surface border border-glass-border rounded-xl p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-glass-border/30 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Color bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: ministry.color }}
      />

      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl">{ministry.icon}</span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            ministry.evolution >= 0
              ? 'bg-accent-green/10 text-accent-green'
              : 'bg-accent-red/10 text-accent-red'
          }`}
        >
          {ministry.evolution >= 0 ? '+' : ''}
          {ministry.evolution}%
        </span>
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
      <div className="text-text-muted text-xs mt-2 text-right">{ministry.percent}% du budget</div>
    </div>
  )
}

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
          {MINISTRIES.slice(0, 6).map((ministry, index) => (
            <BudgetCard key={ministry.id} ministry={ministry} delay={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/dashboard" className="btn-secondary no-underline inline-flex">
            Voir tous les détails
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

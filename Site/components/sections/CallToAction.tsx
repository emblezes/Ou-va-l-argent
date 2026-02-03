'use client'

import Link from 'next/link'

export function CallToAction() {
  return (
    <section className="py-16 lg:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-bg-surface to-bg-elevated border border-glass-border rounded-2xl lg:rounded-3xl p-8 lg:p-16 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-electric/5 to-accent-gold/5" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-4">
              Vous voulez <span className="italic text-accent-gold">agir</span> ?
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
              Partagez vos propositions pour améliorer la gestion des finances publiques françaises.
              Chaque voix compte.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/propositions" className="btn-gold no-underline">
                Je propose
              </Link>
              <Link href="/wtf" className="btn-secondary no-underline">
                <span>🤯</span>
                Chiffres choc
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const MOSAIC_IMAGES = [
  '01-explosion-dette-france-instagram.png',
  '03-deficit-zone-euro-instagram.png',
  '07-dette-48800-par-habitant-instagram.png',
  '09-dette-58md-interets-instagram.png',
  '10a-detenteurs-dette-france-instagram.png',
  '93-ue-dependance-terres-rares-instagram.png',
]

function formatCurrency(num: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function Hero() {
  const [debtCounter, setDebtCounter] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Calcul: déficit 170 Md€/an ÷ 31,536,000 secondes/an ≈ 5 390 €/s (Source: INSEE 2024)
  const debtPerSecond = 5390 // € par seconde

  useEffect(() => {
    let elapsed = 0
    const interval = setInterval(() => {
      elapsed += 0.1
      setDebtCounter(Math.floor(elapsed * debtPerSecond))
      // Mettre à jour le compteur de temps chaque seconde complète
      setElapsedSeconds(Math.floor(elapsed))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'Homepage' }),
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
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center overflow-hidden">
      {/* Mosaic Background */}
      <div className="absolute inset-0 z-0">
        <div className="mosaic-scroll grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-1.5 p-1.5 opacity-40">
          {[...MOSAIC_IMAGES, ...MOSAIC_IMAGES, ...MOSAIC_IMAGES, ...MOSAIC_IMAGES, ...MOSAIC_IMAGES, ...MOSAIC_IMAGES, ...MOSAIC_IMAGES, ...MOSAIC_IMAGES].map((img, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={`/infographies/${img}`}
                alt=""
                fill
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 14vw"
                className="object-cover"
                loading="eager"
              />
            </div>
          ))}
        </div>
        {/* Dark overlay - centre plus transparent pour voir la mosaïque */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/70 via-bg-deep/50 to-bg-deep/80" />
        {/* Vignette edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg-deep)_85%)]" />
      </div>

      {/* Floating Orbs */}
      <div className="floating-orb w-[600px] h-[600px] bg-accent-red/10 left-[-200px] top-[10%] animate-float" />
      <div className="floating-orb w-[400px] h-[400px] bg-accent-orange/10 right-[-100px] top-[60%] animate-float" style={{ animationDelay: '-7s' }} />
      <div className="floating-orb w-[300px] h-[300px] bg-accent-purple/10 left-[30%] bottom-[10%] animate-float" style={{ animationDelay: '-14s' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Credit */}
        <p className="text-text-muted/70 text-lg mb-4 flex items-center justify-center gap-2">
          Site créé et développé par{' '}
          <a
            href="https://www.linkedin.com/in/emmanuelblezes/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-accent-electric transition-colors"
          >
            Emmanuel Blézès
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </p>

        {/* Main Title */}
        <h1 className="font-serif text-[clamp(4rem,12vw,8rem)] font-normal leading-[1.1] mb-8">
          Où Va <span className="italic text-accent-electric">l&apos;Argent</span> ?
        </h1>

        {/* Subtitle */}
        <p className="text-3xl lg:text-4xl text-text-primary max-w-5xl mx-auto mb-10">
          L&apos;État français dépense 1 670 Md€ chaque année mais continue de s&apos;endetter.
          Il est temps de comprendre où va l&apos;argent.
        </p>

        {/* Live Debt Counter */}
        <div className="relative bg-gradient-to-br from-accent-red/30 to-accent-orange/20 border border-accent-red/50 rounded-2xl p-8 lg:p-14 mb-10 max-w-4xl mx-auto overflow-hidden backdrop-blur-md">
          {/* Loading bar animation */}
          <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-accent-red via-accent-orange to-accent-pink animate-loading" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-red rounded-full text-sm font-semibold uppercase mb-4">
            <span className="w-2 h-2 bg-white rounded-full animate-blink" />
            En direct
          </div>

          <p className="text-text-primary text-2xl lg:text-3xl mb-3">
            Depuis que vous avez ouvert cette page, la dette française a augmenté de
          </p>

          <div
            className="font-mono text-[clamp(4rem,15vw,8rem)] font-medium text-accent-red leading-none"
            style={{ textShadow: '0 0 30px rgba(255, 71, 87, 0.5)' }}
          >
            {formatCurrency(debtCounter)}
          </div>

          <p className="text-text-primary text-xl lg:text-2xl mt-4">
            soit environ <span className="text-accent-red font-mono font-medium">5 390 €</span> par seconde, 24h/24
          </p>

          {/* Compteur de temps */}
          <div className="mt-4 pt-4 border-t border-accent-red/20">
            <p className="text-text-muted text-lg">
              Temps écoulé : <span className="font-mono text-accent-orange font-medium">{formatTime(elapsedSeconds)}</span>
            </p>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-br from-accent-electric/10 to-accent-purple/10 border border-accent-electric/30 rounded-2xl p-10 lg:p-14 max-w-5xl mx-auto">
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-normal mb-4 text-center">
            Rejoignez la <span className="italic text-accent-electric">communauté</span>
          </h2>
          <p className="text-text-primary text-2xl lg:text-3xl mb-8 text-center max-w-3xl mx-auto">
            Recevez chaque semaine les chiffres clés et analyses des finances publiques.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
              className="flex-1 px-8 py-5 bg-bg-elevated border border-glass-border rounded-xl text-text-primary font-sans text-xl transition-all duration-200 focus:outline-none focus:border-accent-electric focus:ring-2 focus:ring-accent-electric/20"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-5 bg-accent-electric text-bg-deep text-xl font-semibold rounded-xl transition-all duration-200 hover:bg-[#00b8e6] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-electric/30 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? 'Inscription...' : "S'inscrire gratuitement"}
            </button>
          </form>

          {submitStatus === 'success' && (
            <p className="text-accent-green text-lg mt-4 flex items-center justify-center gap-2">
              <span>✓</span> Bienvenue dans la communauté !
            </p>
          )}
          {submitStatus === 'error' && (
            <p className="text-accent-red text-lg mt-4 flex items-center justify-center gap-2">
              <span>✗</span> Une erreur est survenue. Réessayez.
            </p>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-text-muted/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-text-muted mt-2 rounded-full animate-scroll-pulse" />
        </div>
      </div>
    </section>
  )
}

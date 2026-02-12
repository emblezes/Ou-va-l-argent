'use client'

import { useState, useEffect } from 'react'

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Ne pas afficher si déjà fermé ou inscrit dans cette session
    const dismissed = localStorage.getItem('newsletter-dismissed')
    if (dismissed) return

    const handleScroll = () => {
      // Déclencher après 40% de scroll de la page
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrollPercent > 0.15) {
        setVisible(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem('newsletter-dismissed', '1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')

    try {
      const response = await fetch('https://formspree.io/f/mbdknqpb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setStatus('success')
        sessionStorage.setItem('newsletter-dismissed', '1')
        setTimeout(() => setVisible(false), 3000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg-deep/70 backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-bg-surface border border-glass-border rounded-2xl overflow-hidden shadow-2xl shadow-accent-electric/10 animate-[slideUp_0.4s_ease]">
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-accent-electric via-accent-gold to-accent-electric" />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-elevated"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 pt-8 text-center">
          {status === 'success' ? (
            <>
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="font-serif text-2xl mb-2">
                Bienvenue dans la <span className="italic text-accent-electric">communauté</span> !
              </h3>
              <p className="text-text-secondary">Vous recevrez nos prochaines analyses.</p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-serif text-2xl mb-2">
                Restez <span className="italic text-accent-electric">informé</span>
              </h3>
              <p className="text-text-secondary text-sm mb-6">
                Chaque semaine, recevez nos analyses et infographies sur l&apos;économie et les finances publiques.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  className="w-full px-4 py-3.5 bg-bg-elevated border border-glass-border rounded-xl text-text-primary text-base transition-all duration-200 focus:outline-none focus:border-accent-electric focus:ring-2 focus:ring-accent-electric/20"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 bg-accent-electric text-bg-deep font-semibold rounded-xl transition-all duration-200 hover:bg-[#00b8e6] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-electric/30 disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Inscription...' : 'Rejoindre la newsletter'}
                </button>
              </form>

              {status === 'error' && (
                <p className="text-accent-red text-sm mt-3">Une erreur est survenue. Réessayez.</p>
              )}

              <button
                onClick={dismiss}
                className="mt-4 text-text-muted text-xs hover:text-text-secondary transition-colors"
              >
                Je suis déjà inscrit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

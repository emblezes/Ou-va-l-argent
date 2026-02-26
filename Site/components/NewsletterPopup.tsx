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
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Popup' }),
      })
      if (response.ok) {
        setStatus('success')
        localStorage.setItem('newsletter-dismissed', '1')
        localStorage.setItem('newsletter-subscribed', '1')
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
      <div className="relative w-full max-w-lg bg-bg-surface border border-glass-border rounded-2xl overflow-hidden shadow-2xl shadow-accent-electric/10 animate-[slideUp_0.4s_ease]">
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-accent-electric via-accent-gold to-accent-electric" />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 text-text-primary hover:text-accent-electric transition-colors rounded-lg hover:bg-bg-elevated"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pt-10 text-center">
          {status === 'success' ? (
            <>
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-serif text-3xl mb-3">
                Bienvenue !
              </h3>
              <p className="text-text-primary text-lg">Vous serez tenu informé.</p>
            </>
          ) : (
            <>
              <h3 className="font-serif text-3xl lg:text-4xl mb-6">
                Restez <span className="italic text-accent-electric">informé</span>
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  className="w-full px-5 py-4 bg-bg-elevated border border-glass-border rounded-xl text-text-primary text-lg transition-all duration-200 focus:outline-none focus:border-accent-electric focus:ring-2 focus:ring-accent-electric/20"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 bg-accent-electric text-bg-deep text-lg font-semibold rounded-xl transition-all duration-200 hover:bg-[#00b8e6] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-electric/30 disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Inscription...' : "S'abonner"}
                </button>
              </form>

              {status === 'error' && (
                <p className="text-accent-red text-base mt-3">Une erreur est survenue. Réessayez.</p>
              )}

              <button
                onClick={dismiss}
                className="mt-4 text-text-primary/60 text-base hover:text-text-primary transition-colors"
              >
                Fermer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

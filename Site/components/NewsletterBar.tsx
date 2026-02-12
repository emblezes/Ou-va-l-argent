'use client'

import { useState, useEffect } from 'react'

export function NewsletterBar() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  useEffect(() => {
    // Ne pas afficher si déjà inscrit
    if (localStorage.getItem('newsletter-subscribed')) return

    // Afficher après un court délai pour ne pas surcharger avec le popup
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

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
        localStorage.setItem('newsletter-subscribed', '1')
        localStorage.setItem('newsletter-dismissed', '1')
        setTimeout(() => setVisible(false), 3000)
      }
    } catch {
      // silently fail
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] border-t border-accent-electric/20 bg-bg-deep/90 backdrop-blur-xl animate-[slideUpBar_0.4s_ease]">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
        {status === 'success' ? (
          <p className="text-accent-green text-sm font-medium flex items-center gap-2">
            <span>&#10003;</span> Bienvenue dans la communauté !
          </p>
        ) : (
          <>
            <p className="text-text-secondary text-sm shrink-0">
              <span className="text-accent-electric font-semibold">&#9993;</span>{' '}
              Recevez nos analyses chaque semaine
            </p>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className="flex-1 sm:w-52 px-3 py-2 bg-bg-surface border border-glass-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-electric transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-4 py-2 bg-accent-electric text-bg-deep text-sm font-semibold rounded-lg hover:bg-[#00b8e6] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {status === 'submitting' ? '...' : "S'inscrire"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

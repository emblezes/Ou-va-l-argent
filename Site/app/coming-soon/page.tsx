'use client'

import { useState, useEffect } from 'react'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Cacher navbar et footer
  useEffect(() => {
    const navbar = document.querySelector('nav')
    const footer = document.querySelector('footer')
    if (navbar) navbar.style.display = 'none'
    if (footer) footer.style.display = 'none'

    return () => {
      if (navbar) navbar.style.display = ''
      if (footer) footer.style.display = ''
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('https://formspree.io/f/mbdknqpb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Titre */}
      <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-normal text-center mb-8">
        Où Va <span className="italic text-[#00d4ff]">l&apos;Argent</span> ?
      </h1>

      {/* Accroche */}
      <p className="text-xl sm:text-2xl text-[#8892a0] text-center max-w-lg mb-12">
        On va enfin comprendre comment est dépensé l&apos;argent de nos impôts.
      </p>

      {/* Formulaire email */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#5a6270] focus:outline-none focus:border-[#00d4ff]/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-6 py-3 bg-[#00d4ff] text-[#0a0e14] font-semibold rounded-lg hover:bg-[#00b8e0] transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : status === 'success' ? 'Inscrit !' : 'Me prévenir'}
        </button>
      </form>

      {status === 'success' && (
        <p className="text-green-400 text-sm mt-4">Vous serez informé du lancement.</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-4">Erreur. Réessayez.</p>
      )}
    </div>
  )
}

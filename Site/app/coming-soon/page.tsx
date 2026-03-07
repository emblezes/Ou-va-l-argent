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

const TOPICS = [
  'D\u00e9penses publiques',
  'Imp\u00f4ts',
  'Comparaisons internationales',
  'Gaspillage d\'argent public',
  'Pourquoi la France s\'endette ?',
]

const SOCIALS = [
  {
    name: 'X',
    href: 'https://x.com/ouvalargent',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61586175562373',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/ouvalargent',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/ouvalargent',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const navbar = document.querySelector('nav')
    const footer = document.querySelector('footer')
    const elementsToHide = [
      navbar,
      footer,
      ...Array.from(document.querySelectorAll('.fixed.bottom-0')),
      ...Array.from(document.querySelectorAll('[class*="newsletter"]')),
    ].filter(Boolean) as HTMLElement[]

    elementsToHide.forEach(el => el.style.display = 'none')

    return () => {
      elementsToHide.forEach(el => el.style.display = '')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Coming Soon' }),
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/80 via-bg-deep/60 to-bg-deep/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg-deep)_80%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-6">
        {/* Titre */}
        <h1 className="font-serif text-[clamp(3rem,10vw,8rem)] font-normal text-center mb-12 leading-[1.1] whitespace-nowrap">
          O&ugrave; Va <span className="italic text-[#00d4ff]">l&apos;Argent</span> ?
        </h1>

        {/* Tags thematiques */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-14">
          {TOPICS.map((topic) => (
            <span
              key={topic}
              className="px-6 py-3 text-lg sm:text-2xl font-medium text-white/90 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Formulaire email */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-5 w-full max-w-3xl mb-12">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-8 py-5 text-xl sm:text-2xl bg-white/5 border-2 border-white/15 rounded-2xl text-white placeholder-[#5a6270] focus:outline-none focus:border-[#00d4ff]/50 disabled:opacity-50 backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-10 py-5 text-xl sm:text-2xl bg-[#00d4ff] text-[#0a0e14] font-bold rounded-2xl hover:bg-[#00b8e0] hover:scale-105 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? '...' : status === 'success' ? 'Inscrit !' : "M\u2019abonner"}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-green-400 text-lg mb-8">Vous serez informe du lancement.</p>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-lg mb-8">Erreur. Reessayez.</p>
        )}

        {/* Reseaux sociaux */}
        <div className="flex items-center gap-6 mb-6">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-[#00d4ff] hover:border-[#00d4ff]/50 hover:scale-110 transition-all [&_svg]:w-7 [&_svg]:h-7"
              title={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Email contact */}
        <a
          href="mailto:contact@ouvalargent.com"
          className="text-lg text-white/50 hover:text-[#00d4ff] transition-colors"
        >
          contact@ouvalargent.com
        </a>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'

export function HomeMosaic({ images }: { images: string[] }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selected, setSelected] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Homepage' }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  // Un « bloc » = la grille complète des infographies. On l'affiche deux fois,
  // l'un sous l'autre, et on translate le tout de -50 % en boucle : le défilement
  // est donc infini et sans couture (quand le 2e bloc arrive en haut, il est
  // identique au 1er → retour au début imperceptible).
  const renderBlock = (copy: number) => (
    <div
      aria-hidden={copy === 1}
      className="grid grid-cols-3 gap-2 px-2 pb-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
    >
      {images.map((img, i) => (
        <button
          key={`${copy}-${img}`}
          onClick={() => setSelected(img)}
          className="group relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/60"
          aria-label="Voir l'infographie en grand"
        >
          <Image
            src={`/infographies/${img}`}
            alt=""
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading={copy === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/0" />
        </button>
      ))}
    </div>
  )

  return (
    // `zoom: 2` annule le `html { zoom: 0.5 }` global (cf. globals.css) pour un
    // rendu net 1×. `fixed inset-0` garantit que le fond remplit toujours le
    // vrai viewport, indépendamment de la hauteur du <body>.
    <div
      className="fixed inset-0 overflow-hidden bg-[var(--bg-deep)]"
      style={{ zoom: 2 }}
    >
      {/* Mur d'infographies en défilement infini */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="mosaic-scroll">
          {renderBlock(0)}
          {renderBlock(1)}
        </div>
      </div>

      {/* Voile pour lisibilité de l'overlay (laisse passer les clics) */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(6,10,18,0.88)_0%,rgba(6,10,18,0.55)_32%,rgba(6,10,18,0.05)_62%)]" />

      {/* Overlay centré : titre + email */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        <div className="pointer-events-auto flex w-full max-w-3xl flex-col items-center rounded-[2rem] bg-[rgba(6,10,18,0.5)] px-6 py-8 text-center backdrop-blur-md sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
          <h1 className="font-serif text-[clamp(3.25rem,13vw,11rem)] font-normal leading-[1.05] mb-8 drop-shadow-[0_2px_30px_rgba(0,0,0,0.85)] sm:mb-10 sm:whitespace-nowrap">
            O&ugrave; Va <span className="italic text-[#00d4ff]">l&apos;Argent</span>&nbsp;?
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 rounded-2xl border border-white/15 bg-black/50 p-3 backdrop-blur-md sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={status === 'loading' || status === 'success'}
              className="font-sans w-full flex-1 rounded-xl bg-white/5 px-6 py-4 text-lg text-white placeholder-[#5a6270] focus:border-[#00d4ff]/50 focus:outline-none disabled:opacity-50 sm:py-5 sm:text-2xl"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="font-sans w-full whitespace-nowrap rounded-xl bg-[#00d4ff] px-8 py-4 text-lg font-bold text-[#0a0e14] transition-all hover:bg-[#00b8e0] disabled:opacity-50 sm:w-auto sm:py-5 sm:text-2xl"
            >
              {status === 'loading' ? '...' : status === 'success' ? 'Inscrit !' : 'Rester informé'}
            </button>
          </form>

          {status === 'success' && (
            <p className="font-sans mt-4 text-lg text-green-400">Merci ! Vous serez informé du lancement.</p>
          )}
          {status === 'error' && (
            <p className="font-sans mt-4 text-lg text-red-400">Erreur. Réessayez.</p>
          )}

          <a
            href="mailto:contact@ouvalargent.com"
            className="mt-7 font-mono text-lg text-white/55 transition-colors hover:text-[#00d4ff] sm:text-2xl"
          >
            contact@ouvalargent.com
          </a>
        </div>
      </div>

      {/* Lightbox plein écran */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-deep/95 p-[2%] backdrop-blur-xl"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute right-[3%] top-[3%] z-10 rounded-full bg-bg-surface/80 p-2 transition-colors hover:bg-bg-elevated"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`/infographies/${selected}`}
              alt=""
              fill
              sizes="96vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Mention de réutilisation — mobile : en bas pleine largeur ;
              desktop : grande bande blanche à droite */}
          <p className="pointer-events-none absolute inset-x-4 bottom-4 z-10 text-center font-sans text-sm font-medium leading-snug text-white/90 sm:inset-x-auto sm:bottom-auto sm:right-[2.5%] sm:top-1/2 sm:max-w-[24vw] sm:-translate-y-1/2 sm:text-right sm:text-3xl sm:font-semibold sm:leading-snug sm:text-white lg:text-4xl">
            Infographie libre de réutilisation pour un usage non commercial,
            avec mention de la source&nbsp;: ouvalargent.com ou de la page «&nbsp;Où va l&apos;argent&nbsp;»
          </p>
        </div>
      )}

      {/* Mentions légales (discret) */}
      <a
        href="/mentions-legales"
        className="pointer-events-auto absolute bottom-3 left-1/2 z-30 -translate-x-1/2 font-sans text-[10px] text-white/25 no-underline transition-colors hover:text-white/50 sm:text-xs"
      >
        Mentions légales
      </a>
    </div>
  )
}

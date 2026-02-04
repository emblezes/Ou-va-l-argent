'use client'

import { useState } from 'react'

export default function PropositionsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prenom: '',
    nom: '',
    email: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('https://formspree.io/f/xnjjdrdy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ titre: '', description: '', prenom: '', nom: '', email: '' })
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
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <main className="relative z-[1] max-w-[1400px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
            Je <span className="italic text-accent-purple">propose</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Partagez vos idées pour améliorer la gestion des finances publiques
          </p>
        </header>

        {/* Formulaire centré */}
        <div className="max-w-xl mx-auto">
          <section className="bg-bg-surface border border-glass-border rounded-3xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-accent-purple/15 rounded-xl flex items-center justify-center text-2xl">
                ✍️
              </div>
              <div>
                <h2 className="text-xl font-semibold">Soumettre une proposition</h2>
                <p className="text-text-muted text-sm">Votre voix compte pour améliorer la gestion publique</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                  Titre de votre proposition
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Réduire le nombre d'agences publiques..."
                  required
                  disabled={isSubmitting}
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                  Description détaillée
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Décrivez votre proposition"
                  required
                  disabled={isSubmitting}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Votre prénom"
                    required
                    disabled={isSubmitting}
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Votre nom"
                    required
                    disabled={isSubmitting}
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="votre.email@exemple.com"
                  required
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-accent-purple text-white font-semibold rounded-lg transition-all duration-200 hover:bg-purple-600 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma proposition'}
              </button>

              {submitStatus === 'success' && (
                <p className="text-accent-green text-sm mt-4 flex items-center gap-2 justify-center">
                  <span>✓</span> Merci ! Votre proposition a bien été envoyée.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-accent-red text-sm mt-4 flex items-center gap-2 justify-center">
                  <span>✗</span> Une erreur est survenue. Veuillez réessayer.
                </p>
              )}
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}

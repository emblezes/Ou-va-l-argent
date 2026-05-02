import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions l\u00e9gales | O\u00f9 Va l\'Argent ?',
  description: 'Mentions l\u00e9gales et politique de confidentialit\u00e9.',
}

export default function MentionsLegales() {
  return (
    <div className="page-overlay">
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-16">
        <h1 className="font-serif text-3xl mb-10">
          Mentions l{'\u00e9'}gales
        </h1>

        <section className="mb-10">
          <h2 className="font-serif text-xl text-accent-electric mb-3">{'\u00c9'}diteur</h2>
          <div className="space-y-2 text-text-secondary text-base leading-relaxed">
            <p>O{'\u00f9'} Va l&apos;Argent ? &mdash; ouvalargent.com</p>
            <p>Contact : <a href="mailto:contact@ouvalargent.com" className="text-accent-electric hover:underline">contact@ouvalargent.com</a></p>
            <p>H{'\u00e9'}bergement : Vercel Inc.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-xl text-accent-electric mb-3">Donn{'\u00e9'}es personnelles</h2>
          <div className="space-y-3 text-text-secondary text-base leading-relaxed">
            <p>
              Seule votre adresse email est collect{'\u00e9'}e, uniquement lors de votre inscription
              volontaire {'\u00e0'} la newsletter. Elle sert exclusivement {'\u00e0'} vous envoyer nos
              analyses et actualit{'\u00e9'}s {'\u00e9'}conomiques.
            </p>
            <p>
              Base l{'\u00e9'}gale : votre consentement (art. 6.1.a RGPD). Aucun cookie publicitaire
              ni traceur tiers n&apos;est utilis{'\u00e9'}.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-xl text-accent-electric mb-3">Vos droits</h2>
          <div className="space-y-3 text-text-secondary text-base leading-relaxed">
            <p>
              Vous pouvez {'\u00e0'} tout moment demander l&apos;acc{'\u00e8'}s, la rectification ou
              la suppression de vos donn{'\u00e9'}es en {'\u00e9'}crivant {'\u00e0'} :{' '}
              <a href="mailto:contact@ouvalargent.com" className="text-accent-electric hover:underline">contact@ouvalargent.com</a>
            </p>
            <p>
              R{'\u00e9'}clamation : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent-electric hover:underline">www.cnil.fr</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

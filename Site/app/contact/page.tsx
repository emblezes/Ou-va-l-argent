import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="page-overlay">
      <div className="min-h-full flex flex-col items-center justify-center px-6 lg:px-12 py-10">
        {/* Header */}
        <header className="text-center mb-10 lg:mb-12 w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-accent-electric transition-colors text-sm mb-6 no-underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <h1 className="font-serif text-[clamp(3rem,10vw,6rem)] font-normal">
            Contact & <span className="italic text-accent-gold">Partenariats</span>
          </h1>
        </header>

        {/* Options de contact */}
        <div className="flex flex-col gap-8 lg:gap-10 w-full max-w-4xl mb-12">

          {/* Questions, remarques, propositions */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-8 lg:p-10">
            <div className="flex items-start gap-4 lg:gap-6">
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-accent-electric/10 border border-accent-electric/20">
                <svg className="w-7 h-7 text-accent-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-2xl lg:text-3xl font-normal mb-4">
                  Questions, remarques, propositions
                </h2>
                <p className="text-text-secondary text-lg lg:text-xl leading-loose">
                  Si vous avez des remarques ou des propositions, {'\u00e9'}crivez-nous. Nous lisons tout.
                </p>
              </div>
            </div>
          </div>

          {/* Partenariats & Création de contenu */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-8 lg:p-10">
            <div className="flex items-start gap-4 lg:gap-6">
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-accent-gold/10 border border-accent-gold/20">
                <svg className="w-7 h-7 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-2xl lg:text-3xl font-normal mb-4">
                  Partenariats & Cr{'\u00e9'}ation de contenu
                </h2>
                <p className="text-text-secondary text-lg lg:text-xl leading-loose">
                  Vous produisez des {'\u00e9'}tudes, des rapports ou des analyses {'\u00e9'}conomiques
                  et vous aimeriez les d{'\u00e9'}mocratiser et les rendre accessibles {'\u00e0'} un large public ?
                </p>
                <p className="text-text-secondary text-lg lg:text-xl leading-loose mt-4">
                  Nous transformons vos donn{'\u00e9'}es en infographies percutantes et en contenu
                  adapt{'\u00e9'} aux r{'\u00e9'}seaux sociaux.
                </p>
              </div>
            </div>
          </div>

          {/* Conférences & Interventions */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-8 lg:p-10">
            <div className="flex items-start gap-4 lg:gap-6">
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-accent-purple/10 border border-accent-purple/20">
                <svg className="w-7 h-7 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-2xl lg:text-3xl font-normal mb-4">
                  Conf{'\u00e9'}rences & Interventions
                </h2>
                <p className="text-text-secondary text-lg lg:text-xl leading-loose">
                  Nous intervenons lors d&apos;{'\u00e9'}v{'\u00e9'}nements, conf{'\u00e9'}rences ou interviews
                  sur les sujets {'\u00e9'}conomiques, de fiscalit{'\u00e9'} et d&apos;investissement
                  pour vulgariser les sujets complexes, avec des pr{'\u00e9'}sentations visuelles
                  et des donn{'\u00e9'}es percutantes.
                </p>
                <p className="text-text-secondary text-lg lg:text-xl leading-loose mt-4">
                  Interventions pour cr{'\u00e9'}ation de contenu sur les r{'\u00e9'}seaux sociaux,
                  format vid{'\u00e9'}o ou podcast.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email */}
        <a
          href="mailto:contact@ouvalargent.com"
          className="inline-block font-mono text-2xl lg:text-3xl text-accent-electric hover:text-accent-gold transition-colors"
        >
          contact@ouvalargent.com
        </a>
      </div>
    </div>
  )
}

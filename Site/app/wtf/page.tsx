'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'

const WTF_FACTS = [
  {
    id: 1,
    icon: '👶',
    stat: '50 800 €',
    title: 'Dette à la naissance',
    desc: 'Un bébé qui naît aujourd\'hui en France hérite immédiatement d\'une dette de 50 800 €. Avant même son premier biberon.',
    comparison: { label: 'C\'est l\'équivalent de', value: '3 ans de SMIC net' },
    color: '#ff4757',
  },
  {
    id: 2,
    icon: '⏱️',
    stat: '5 390 €',
    title: 'Chaque seconde',
    desc: 'Pendant que vous lisez cette phrase, la dette française a augmenté de 16 200 €. Soit 5 390 € par seconde (déficit 2024 : 170 Md€).',
    comparison: { label: 'En 1 minute', value: '323 400 € de dette en plus' },
    color: '#ff9f43',
  },
  {
    id: 3,
    icon: '🗼',
    stat: '79 200 km',
    title: 'La pile de billets',
    desc: 'Si on empilait la dette en billets de 5 €, la pile ferait 79 200 km de haut. Plus de 6 fois le diamètre de la Terre.',
    comparison: { label: 'Soit', value: 'Presque 2 fois le tour de la Terre' },
    color: '#a855f7',
  },
  {
    id: 4,
    icon: '🎓',
    stat: '10 920 €',
    title: 'Coût d\'un élève/an',
    desc: 'Un élève coûte 10 920 €/an en moyenne à l\'État (DEPP 2024). Pourtant la France n\'est que 23ème au classement PISA en maths (2022).',
    comparison: { label: 'La Corée du Sud dépense', value: '~17 500 €/élève et se classe 6ème' },
    color: '#00d4ff',
  },
  {
    id: 5,
    icon: '🏥',
    stat: '38 Md€',
    title: 'Médicaments remboursés',
    desc: 'La France rembourse 38 milliards d\'euros de médicaments par an. L\'un des plus gros consommateurs d\'Europe.',
    comparison: { label: 'C\'est', value: '550 € de médocs par Français/an' },
    color: '#ff6b9d',
  },
  {
    id: 6,
    icon: '🚄',
    stat: '310 €',
    title: 'Financement public SNCF/habitant',
    desc: 'Chaque Français, qu\'il prenne le train ou non, finance la SNCF à hauteur de 310 €/an.',
    comparison: { label: 'Total', value: '20,8 milliards de financement public/an' },
    color: '#45b7d1',
  },
  {
    id: 7,
    icon: '📺',
    stat: '4 Md€',
    title: 'Audiovisuel public',
    desc: 'France Télévisions + Radio France + Arte + France 24 : 4 Md€/an de subventions. Soit 2,8× le chiffre d\'affaires de Netflix France (1,44 Md€).',
    comparison: { label: 'Comparaison', value: '4 Md€ de subventions vs 1,44 Md€ de CA Netflix France' },
    color: '#ffd700',
  },
  {
    id: 8,
    icon: '🏛️',
    stat: '34 875',
    title: 'Communes françaises',
    desc: 'La France a plus de communes que n\'importe quel autre pays européen. L\'Allemagne en a 11 000.',
    comparison: { label: 'Ça fait', value: '34 875 maires, 520 000 élus locaux' },
    color: '#20e3b2',
  },
  {
    id: 9,
    icon: '👔',
    stat: '156 jours',
    title: 'Travail pour l\'État',
    desc: 'Un salarié français travaille 156 jours par an uniquement pour payer impôts et cotisations. Jour de libération fiscale : 6 juin.',
    comparison: { label: 'En Suisse', value: '99 jours suffisent (27% du PIB)' },
    color: '#ff4757',
  },
  {
    id: 10,
    icon: '🇨🇭',
    stat: '2x',
    title: 'Salaire suisse',
    desc: 'À travail égal, un Suisse gagne 2 fois plus net qu\'un Français. Et paye moins d\'impôts.',
    comparison: { label: 'Infirmière Paris vs Genève', value: '2 100 € vs 5 500 € net' },
    color: '#a855f7',
  },
  {
    id: 11,
    icon: '⚖️',
    stat: '1,7',
    title: 'Actifs par retraité',
    desc: 'Il y a 1,7 actif pour 1 retraité. En 1960 c\'était 4 pour 1. En 2050 ce sera 1,3 pour 1.',
    comparison: { label: 'C\'est comme si', value: '1 personne payait 60% d\'une retraite' },
    color: '#ff9f43',
  },
  {
    id: 12,
    icon: '🏠',
    stat: '+52%',
    title: 'Taxe foncière Paris',
    desc: 'Le taux de taxe foncière à Paris a bondi de 52% en 2023. Avec la revalorisation des bases, la facture réelle a grimpé de +65 à 70%.',
    comparison: { label: 'Moyenne nationale', value: '+30% en 10 ans' },
    color: '#ffd700',
  },
  {
    id: 13,
    icon: '💊',
    stat: '41 boîtes',
    title: 'Médicaments/Français/an',
    desc: 'Chaque Français consomme en moyenne 41 boîtes de médicaments par an. Parmi les plus gros consommateurs d\'Europe.',
    comparison: { label: 'C\'est presque', value: '1 boîte par semaine' },
    color: '#ff6b9d',
  },
  {
    id: 14,
    icon: '🗃️',
    stat: '3 600',
    title: 'Pages du Code du travail',
    desc: 'Le Code du travail français fait 3 600 pages. Celui de la Suisse : 200 pages. Soit 18 fois moins.',
    comparison: { label: 'Chômage France vs Suisse (BIT)', value: '7,3% vs 4,2%' },
    color: '#00d4ff',
  },
  {
    id: 15,
    icon: '🎭',
    stat: '1,3 Md€',
    title: 'Intermittents du spectacle',
    desc: '154 600 intermittents indemnisés touchent ~1,3 Md€ d\'allocations/an. Le déficit net du régime : ~1 Md€ (allocations - cotisations).',
    comparison: { label: 'Par intermittent', value: '~8 200 € d\'allocations/an' },
    color: '#a855f7',
  },
  {
    id: 16,
    icon: '📋',
    stat: '2 200',
    title: 'Aides sociales différentes',
    desc: 'Il existe plus de 2 200 dispositifs d\'aides sociales en France. Un mille-feuille unique au monde.',
    comparison: { label: 'Résultat', value: '30% des ayants droit ne les demandent pas' },
    color: '#45b7d1',
  },
  {
    id: 17,
    icon: '🇸🇬',
    stat: '85k$ vs 44k$',
    title: 'Singapour vs France',
    desc: 'En 1960, Singapour était 8 fois plus pauvre que la France. Aujourd\'hui, Singapour est 2 fois plus riche : 85 000 $ vs 44 000 $ par habitant.',
    comparison: { label: 'Convergence atteinte en', value: '1993' },
    color: '#20e3b2',
  },
  {
    id: 18,
    icon: '🏦',
    stat: '54 Md€',
    title: 'Intérêts de la dette',
    desc: 'On paye 54 Md€ d\'intérêts par an. Sans rembourser 1€ du capital. C\'est plus que le budget opérationnel de la Défense (50,5 Md€).',
    comparison: { label: 'Chaque seconde', value: '1 712 € d\'intérêts' },
    color: '#ff4757',
  },
  {
    id: 19,
    icon: '🚗',
    stat: '~1 €',
    title: 'Taxes par litre d\'essence',
    desc: 'Sur 1 litre d\'essence à 1,80 €, environ 1 € part en taxes (TICPE 68 cts + TVA ~30 cts). 55% du prix.',
    comparison: { label: 'Un plein de 50L', value: '~50 € de taxes' },
    color: '#ff9f43',
  },
  {
    id: 20,
    icon: '💀',
    stat: '45%',
    title: 'Droits de succession max',
    desc: 'Les droits de succession en ligne directe peuvent atteindre 45%. La France est 3ème dans l\'OCDE, derrière le Japon (55%) et la Corée du Sud (50%).',
    comparison: { label: 'En Italie', value: '4% maximum' },
    color: '#ffd700',
  },
  {
    id: 21,
    icon: '🏆',
    stat: '2ème',
    title: 'Rang OCDE impôts',
    desc: 'La France est le 2ème pays le plus taxé de l\'OCDE après le Danemark. 45,4% du PIB en prélèvements obligatoires.',
    comparison: { label: 'Les USA', value: '27% du PIB' },
    color: '#ff6b9d',
  },
  {
    id: 22,
    icon: '👴',
    stat: '64 ans',
    title: 'Retraite à 64 ans',
    desc: 'L\'âge légal de départ est passé à 64 ans après des mois de manifestations.',
    comparison: { label: 'En Allemagne', value: '66 ans en 2025, montée vers 67 ans en 2031' },
    color: '#45b7d1',
  },
  {
    id: 23,
    icon: '🛏️',
    stat: '100 000',
    title: 'Lits d\'hôpitaux supprimés',
    desc: 'La France a supprimé 100 000 lits d\'hôpitaux en 20 ans (2003-2023). De ~468 000 à 369 000 lits. Tout en doublant le budget santé.',
    comparison: { label: 'On est passé de', value: '468 000 à 369 000 lits (DREES)' },
    color: '#ff9f43',
  },
  {
    id: 24,
    icon: '🇮🇪',
    stat: '12,5%',
    title: 'IS en Irlande',
    desc: 'L\'impôt sur les sociétés est de 12,5% en Irlande (15% depuis 2024 pour les multinationales). En France : 25%. Résultat : Apple, Google, Meta sont là-bas.',
    comparison: { label: 'Recettes IS Irlande', value: '24 Md€ (vs 61 Md€ France pour 14× plus d\'habitants)' },
    color: '#ffd700',
  },
  {
    id: 25,
    icon: '💸',
    stat: '169 Md€',
    title: 'Déficit 2024',
    desc: 'Le déficit public de 2024 est de 169 milliards d\'euros. Plus que le budget de la Défense + Éducation + Justice.',
    comparison: { label: 'Par jour', value: 'On dépense 463 M€ de plus qu\'on ne gagne' },
    color: '#ff6b9d',
  },
  {
    id: 26,
    icon: '🏦',
    stat: '520 000',
    title: 'Élus locaux',
    desc: 'La France compte plus de 520 000 élus locaux pour 68 millions d\'habitants. Record européen.',
    comparison: { label: 'L\'Espagne', value: '67 000 élus pour 47 millions d\'habitants' },
    color: '#ff9f43',
  },
  {
    id: 27,
    icon: '🚆',
    stat: '15%',
    title: 'Trains en retard',
    desc: '15% des TGV arrivent en retard (AQST, 2023). La SNCF coûte pourtant 20,8 Md€/an au contribuable (FIPECO, 2024).',
    comparison: { label: 'Au Japon', value: '99% de ponctualité' },
    color: '#ff6b9d',
  },
  {
    id: 28,
    icon: '🏥',
    stat: '3 723 €',
    title: 'Santé par habitant',
    desc: 'Le système de santé dépense 3 723 €/an par Français (DREES, 2024). Financé à 79% par la Sécu.',
    comparison: { label: 'Ça fait', value: 'plus de 10 € par jour par personne' },
    color: '#45b7d1',
  },
  {
    id: 29,
    icon: '⚰️',
    stat: '4 750 €',
    title: 'Coût des obsèques',
    desc: 'Les obsèques coûtent 4 750 € en moyenne en France (2024). La TVA à 20% s\'applique sur le cercueil et toutes les prestations funéraires.',
    comparison: { label: 'TVA sur un cercueil', value: '20% (taux normal)' },
    color: '#20e3b2',
  },
  {
    id: 30,
    icon: '📈',
    stat: '117%',
    title: 'Dette/PIB',
    desc: 'La dette représente 117% du PIB. Le traité de Maastricht fixe la limite à 60%. On est presque au double.',
    comparison: { label: 'Pour revenir à 60%', value: 'il faudrait rembourser 1 700 Md€' },
    color: '#ff4757',
  },
]

function formatCurrency(num: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export default function WtfPage() {
  const [debtCounter, setDebtCounter] = useState(0)
  const debtPerSecond = 5390

  useEffect(() => {
    let elapsed = 0
    const interval = setInterval(() => {
      elapsed += 0.1
      setDebtCounter(Math.floor(elapsed * debtPerSecond))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(255, 71, 87, 0.15) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 80%, rgba(255, 159, 67, 0.1) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 60%)
            `,
            animationDuration: '8s',
          }}
        />
      </div>

      <main className="relative z-[1] max-w-[1800px] mx-auto px-[16px] lg:px-[48px] pt-[120px] pb-[60px]">
        {/* Hero */}
        <header className="text-center mb-16">
          <Badge variant="red" icon="🚨" className="animate-glow">
            30 chiffres qui font mal
          </Badge>
          <h1 className="font-serif text-[clamp(3rem,10vw,6rem)] font-normal leading-[1.1] mt-6 mb-6">
            <span className="italic bg-gradient-to-r from-accent-red via-accent-orange to-accent-pink bg-clip-text text-transparent">
              WTF?!
            </span>
          </h1>
          <p className="text-2xl lg:text-3xl text-text-primary max-w-2xl mx-auto">
            30 chiffres sur les finances publiques qui vont vous faire tomber de votre chaise
          </p>
        </header>

        {/* Live Counter */}
        <div className="relative bg-gradient-to-br from-accent-red/10 to-accent-orange/10 border border-accent-red/30 rounded-3xl p-8 lg:p-12 text-center mb-12 overflow-hidden">
          {/* Loading bar */}
          <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-accent-red via-accent-orange to-accent-pink animate-loading" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-red rounded-full text-base font-semibold uppercase mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-blink" />
            En direct
          </div>

          <p className="text-text-primary text-xl lg:text-2xl mb-3">
            Depuis que vous avez ouvert cette page, la dette française a augmenté de
          </p>

          <div className="font-mono text-[clamp(2.5rem,8vw,5rem)] font-medium text-accent-red" style={{ textShadow: '0 0 30px rgba(255, 71, 87, 0.5)' }}>
            {formatCurrency(debtCounter)}
          </div>

          <p className="text-text-primary text-lg lg:text-xl mt-3">
            soit environ 5 390 € par seconde, 24h/24, 7j/7
          </p>
        </div>

        {/* WTF Cards Grid - Format original avec grandes cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {WTF_FACTS.map((fact) => (
            <article
              key={fact.id}
              className="bg-bg-surface border border-glass-border rounded-2xl p-6 lg:p-8 relative overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] group"
              style={{
                '--card-accent': fact.color,
                '--card-glow': `${fact.color}50`,
              } as React.CSSProperties}
            >
              {/* Top border */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: fact.color }} />

              {/* Number badge */}
              <div className="absolute top-4 right-6 text-right">
                <div className="font-mono text-6xl font-bold opacity-15" style={{ color: fact.color }}>
                  #{fact.id}
                </div>
                <div className="font-mono text-xs text-gray-500 opacity-50">
                  ouvalargent.com
                </div>
              </div>

              <div className="text-5xl mb-5">{fact.icon}</div>

              <div className="font-mono text-5xl lg:text-6xl font-semibold mb-3 leading-tight" style={{ color: fact.color }}>
                {fact.stat}
              </div>

              <h3 className="text-2xl lg:text-3xl font-semibold mb-4">{fact.title}</h3>

              <p className="text-text-primary text-xl lg:text-2xl leading-relaxed mb-6">
                {fact.desc}
              </p>

              <div className="p-5 bg-white/[0.03] rounded-lg border-l-4" style={{ borderColor: fact.color }}>
                <div className="text-base text-text-primary uppercase tracking-wider mb-1">
                  {fact.comparison.label}
                </div>
                <div className="font-mono text-2xl font-semibold" style={{ color: fact.color }}>
                  {fact.comparison.value}
                </div>
              </div>

              {/* Hover glow effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
                style={{
                  boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${fact.color}30`,
                }}
              />
            </article>
          ))}
        </div>

        {/* Fact Banner */}
        <div className="bg-gradient-to-br from-bg-surface to-bg-elevated border border-glass-border rounded-3xl p-8 lg:p-12 text-center mb-12">
          <h2 className="font-serif text-4xl lg:text-5xl font-normal mb-6">Le saviez-vous ?</h2>
          <p className="text-text-primary text-xl lg:text-2xl max-w-3xl mx-auto">
            Si on empilait la dette française en billets de 5 €, la pile ferait{' '}
            <span className="text-accent-gold font-semibold">79 200 km de haut</span>. C&apos;est plus de 6 fois le diamètre de la Terre.
          </p>
          <div className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-accent-gold text-bg-deep rounded-full font-mono font-semibold">
            <span>💡</span>
            3 482 000 000 000 €
          </div>
        </div>

        {/* Sources */}
        <div className="text-center py-8 border-t border-glass-border">
          <p className="text-text-muted text-base">
            Sources : INSEE, Ministère des Finances, Banque de France, Eurostat, OCDE (2024-2025)
            <br />
            <a href="https://www.insee.fr" target="_blank" rel="noopener noreferrer" className="text-accent-electric no-underline hover:underline">
              insee.fr
            </a>
            {' · '}
            <a href="https://www.budget.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-accent-electric no-underline hover:underline">
              budget.gouv.fr
            </a>
            {' · '}
            <a href="https://ec.europa.eu/eurostat" target="_blank" rel="noopener noreferrer" className="text-accent-electric no-underline hover:underline">
              eurostat
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}

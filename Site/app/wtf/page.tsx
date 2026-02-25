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
    comparison: { label: 'C\'est l\'équivalent de', value: '2,5 ans de SMIC net' },
    color: '#ff4757',
  },
  {
    id: 2,
    icon: '⏱️',
    stat: '5 390 €',
    title: 'Chaque seconde',
    desc: 'Pendant que vous lisez cette phrase, la dette française a augmenté de 16 200 €. Chaque seconde = 5 390 €.',
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
    stat: '12 250 €',
    title: 'Coût d\'un élève/an',
    desc: 'Un élève coûte 12 250 €/an à l\'État. Pourtant la France recule au classement PISA (26ème en maths).',
    comparison: { label: 'La Corée du Sud dépense', value: '9 000 €/élève et est dans le top 5' },
    color: '#00d4ff',
  },
  {
    id: 5,
    icon: '🏥',
    stat: '36 Md€',
    title: 'Médicaments remboursés',
    desc: 'La France rembourse 36 milliards de médicaments par an. On est les 2èmes plus gros consommateurs d\'Europe.',
    comparison: { label: 'C\'est', value: '540 € de médocs par Français/an' },
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
    stat: '36 000',
    title: 'Communes françaises',
    desc: 'La France a plus de communes que tous les autres pays de l\'UE réunis. L\'Allemagne en a 11 000.',
    comparison: { label: 'Ça fait', value: '36 000 maires, 500 000 élus locaux' },
    color: '#20e3b2',
  },
  {
    id: 9,
    icon: '👔',
    stat: '82 jours',
    title: 'Travail pour l\'État',
    desc: 'Un salarié français travaille 82 jours par an (jusqu\'au 23 mars) uniquement pour payer impôts et cotisations.',
    comparison: { label: 'En Suisse', value: '55 jours suffisent' },
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
    desc: 'La taxe foncière à Paris a augmenté de 52% en 2023. En une seule année.',
    comparison: { label: 'Moyenne nationale', value: '+30% en 10 ans' },
    color: '#ffd700',
  },
  {
    id: 13,
    icon: '💊',
    stat: '48 boîtes',
    title: 'Médicaments/Français/an',
    desc: 'Chaque Français consomme en moyenne 48 boîtes de médicaments par an. Parmi les plus gros consommateurs d\'Europe.',
    comparison: { label: 'L\'Allemand moyen', value: '35 boîtes/an' },
    color: '#ff6b9d',
  },
  {
    id: 14,
    icon: '🗃️',
    stat: '3 500',
    title: 'Pages du Code du travail',
    desc: 'Le Code du travail français fait 3 500 pages. Celui de la Suisse fait 60 pages.',
    comparison: { label: 'L\'Allemagne', value: '800 pages' },
    color: '#00d4ff',
  },
  {
    id: 15,
    icon: '🎭',
    stat: '276 000',
    title: 'Intermittents du spectacle',
    desc: '276 000 intermittents touchent 2 Md€ d\'allocations/an. Soit 7 250 € par intermittent.',
    comparison: { label: 'Ce régime est unique', value: 'Il n\'existe nulle part ailleurs au monde' },
    color: '#a855f7',
  },
  {
    id: 16,
    icon: '📋',
    stat: '1 500',
    title: 'Aides sociales différentes',
    desc: 'Il existe plus de 1 500 aides sociales différentes en France. Un mille-feuille unique au monde.',
    comparison: { label: 'Résultat', value: '30% des ayants droit ne les demandent pas' },
    color: '#45b7d1',
  },
  {
    id: 17,
    icon: '🇸🇬',
    stat: '1960',
    title: 'Singapour = France',
    desc: 'En 1960, Singapour et la France avaient le même PIB/habitant. Aujourd\'hui : 65k$ vs 44k$.',
    comparison: { label: 'Singapour nous a dépassés', value: 'de +48% en 60 ans' },
    color: '#20e3b2',
  },
  {
    id: 18,
    icon: '🏦',
    stat: '58 Md€',
    title: 'Intérêts de la dette',
    desc: 'On paye 58 Md€ d\'intérêts par an. Sans rembourser 1€ du capital. C\'est le budget de l\'Éducation Nationale.',
    comparison: { label: 'Chaque seconde', value: '1 840 € d\'intérêts' },
    color: '#ff4757',
  },
  {
    id: 19,
    icon: '🚗',
    stat: '60 cts',
    title: 'Taxes par litre d\'essence',
    desc: 'Sur 1 litre d\'essence à 1,80€, 60 centimes partent en taxes. 33% du prix.',
    comparison: { label: 'Un plein de 50L', value: '30 € de taxes' },
    color: '#ff9f43',
  },
  {
    id: 20,
    icon: '💀',
    stat: '45%',
    title: 'Droits de succession max',
    desc: 'Les droits de succession en ligne directe peuvent atteindre 45%. Record mondial avec la Corée du Sud.',
    comparison: { label: 'En Italie', value: '4% maximum' },
    color: '#ffd700',
  },
  {
    id: 21,
    icon: '🏢',
    stat: '5,8 M',
    title: 'Fonctionnaires',
    desc: '5,8 millions d\'agents publics en France. Plus que l\'Allemagne qui a pourtant 17 millions d\'habitants de plus.',
    comparison: { label: 'Ratio', value: '86 fonctionnaires pour 1000 habitants (vs 58 en Allemagne)' },
    color: '#00d4ff',
  },
  {
    id: 22,
    icon: '📅',
    stat: '1974',
    title: 'Dernier budget équilibré',
    desc: 'La France n\'a pas voté un seul budget équilibré depuis 1974. 50 ans de déficits.',
    comparison: { label: 'Le président était', value: 'Valéry Giscard d\'Estaing (1er mandat)' },
    color: '#a855f7',
  },
  {
    id: 23,
    icon: '🏆',
    stat: '2ème',
    title: 'Rang mondial impôts',
    desc: 'La France est le 2ème pays le plus taxé au monde après le Danemark. 45,4% du PIB.',
    comparison: { label: 'Les USA', value: '27% du PIB' },
    color: '#ff6b9d',
  },
  {
    id: 24,
    icon: '👴',
    stat: '64 ans',
    title: 'Retraite à 64 ans',
    desc: 'L\'âge légal de départ est passé à 64 ans après des mois de manifestations.',
    comparison: { label: 'En Allemagne', value: '67 ans depuis 2012, sans manif' },
    color: '#45b7d1',
  },
  {
    id: 25,
    icon: '🎪',
    stat: '15 Md€',
    title: 'Budget culture',
    desc: 'La France dépense 15 milliards/an pour la culture. Plus que n\'importe quel pays d\'Europe.',
    comparison: { label: 'Le Royaume-Uni', value: '7 milliards' },
    color: '#20e3b2',
  },
  {
    id: 26,
    icon: '📉',
    stat: '44%',
    title: 'Ne paient pas l\'IR',
    desc: '44% des foyers français ne paient pas d\'impôt sur le revenu. Les 56% restants financent tout.',
    comparison: { label: 'Les 10% les plus riches', value: 'paient 70% de l\'IR total' },
    color: '#ff4757',
  },
  {
    id: 27,
    icon: '🛏️',
    stat: '150 000',
    title: 'Lits d\'hôpitaux supprimés',
    desc: 'La France a supprimé 150 000 lits d\'hôpitaux en 30 ans. Tout en augmentant le budget santé.',
    comparison: { label: 'On est passé de', value: '530 000 à 380 000 lits' },
    color: '#ff9f43',
  },
  {
    id: 28,
    icon: '🇮🇪',
    stat: '12,5%',
    title: 'IS en Irlande',
    desc: 'L\'impôt sur les sociétés est de 12,5% en Irlande. En France : 25%. Résultat : Apple, Google, Meta sont là-bas.',
    comparison: { label: 'Recettes IS Irlande', value: '22 Md€ (vs 70 Md€ France pour 14x plus d\'habitants)' },
    color: '#ffd700',
  },
  {
    id: 29,
    icon: '🤯',
    stat: '400 000',
    title: 'Normes et règlements',
    desc: 'La France compte 400 000 normes et règlements en vigueur. Le tout fait 23 millions de mots.',
    comparison: { label: 'La Bible', value: 'fait 800 000 mots' },
    color: '#a855f7',
  },
  {
    id: 30,
    icon: '💸',
    stat: '169 Md€',
    title: 'Déficit 2024',
    desc: 'Le déficit public de 2024 est de 169 milliards d\'euros. Plus que le budget de la Défense + Éducation + Justice.',
    comparison: { label: 'Par jour', value: 'On dépense 463 M€ de plus qu\'on ne gagne' },
    color: '#ff6b9d',
  },
  {
    id: 31,
    icon: '🚁',
    stat: '73',
    title: 'Préfets de région',
    desc: 'La France a 101 préfets et 73 sous-préfets. Un maillage territorial napoléonien.',
    comparison: { label: 'Coût annuel', value: '800 millions €' },
    color: '#00d4ff',
  },
  {
    id: 32,
    icon: '📊',
    stat: 'x4',
    title: 'Dette depuis 2000',
    desc: 'La dette a été multipliée par 4 depuis l\'an 2000. De 826 Md€ à 3 482 Md€.',
    comparison: { label: 'En moyenne', value: '+106 milliards de dette par an' },
    color: '#45b7d1',
  },
  {
    id: 33,
    icon: '🏘️',
    stat: '38 Md€',
    title: 'Aides au logement',
    desc: 'L\'État dépense 38 Md€/an pour le logement (APL, PTZ, Pinel...). Les loyers n\'ont jamais été aussi hauts.',
    comparison: { label: 'Les APL seules', value: '16 milliards/an' },
    color: '#20e3b2',
  },
  {
    id: 34,
    icon: '⚡',
    stat: '9 Md€',
    title: 'EDF dette réduite',
    desc: 'L\'État a réduit la dette d\'EDF de 9 Md€ lors de la nationalisation en 2023. Payé par le contribuable.',
    comparison: { label: 'Dette totale EDF', value: '54 milliards €' },
    color: '#ff4757',
  },
  {
    id: 35,
    icon: '🎓',
    stat: '1 M',
    title: 'Étudiants en échec',
    desc: 'Chaque année, 1 million d\'étudiants s\'inscrivent à la fac. 60% échouent ou abandonnent.',
    comparison: { label: 'Coût d\'un étudiant fac', value: '11 500 €/an' },
    color: '#ff9f43',
  },
  {
    id: 36,
    icon: '🏛️',
    stat: '348',
    title: 'Députés cumulards',
    desc: '348 députés cumulent leur mandat avec un autre mandat local. Ils touchent les deux indemnités.',
    comparison: { label: 'Indemnité député', value: '7 637 € brut/mois' },
    color: '#ffd700',
  },
  {
    id: 37,
    icon: '🩺',
    stat: '30%',
    title: 'Déserts médicaux',
    desc: '30% des Français vivent dans un désert médical. 6 millions n\'ont pas de médecin traitant.',
    comparison: { label: 'Nombre de médecins', value: '226 000 (le même qu\'en 2010)' },
    color: '#a855f7',
  },
  {
    id: 38,
    icon: '🚨',
    stat: '3h',
    title: 'Attente aux urgences',
    desc: 'Le temps d\'attente moyen aux urgences est de 3h. Il était d\'1h30 en 2010.',
    comparison: { label: 'Record', value: '14h d\'attente à Paris en 2023' },
    color: '#ff6b9d',
  },
  {
    id: 39,
    icon: '📱',
    stat: '42',
    title: 'iPhones de dette',
    desc: 'Votre part de dette (50 800€) équivaut à 42 iPhone Pro Max. Ou 847 pleins d\'essence.',
    comparison: { label: 'Ou encore', value: '25 ans d\'abonnement Netflix' },
    color: '#00d4ff',
  },
  {
    id: 40,
    icon: '🌍',
    stat: '55%',
    title: 'Dette détenue par l\'étranger',
    desc: '55% de notre dette est détenue par des investisseurs étrangers. On dépend de leur confiance.',
    comparison: { label: 'Si les taux montent de 1%', value: '+35 Md€ d\'intérêts/an' },
    color: '#45b7d1',
  },
  {
    id: 41,
    icon: '🏭',
    stat: '-40%',
    title: 'Industrie en 40 ans',
    desc: 'L\'industrie représentait 24% du PIB en 1980. Aujourd\'hui : 13%. On a perdu 2 millions d\'emplois industriels.',
    comparison: { label: 'L\'Allemagne', value: 'est restée à 23%' },
    color: '#20e3b2',
  },
  {
    id: 42,
    icon: '💳',
    stat: '463 M€',
    title: 'Dette par jour',
    desc: 'La dette française augmente de 463 millions d\'euros par jour. 19 millions par heure.',
    comparison: { label: 'Depuis janvier 2025', value: '+40 milliards' },
    color: '#ff4757',
  },
  {
    id: 43,
    icon: '🏦',
    stat: '520 000',
    title: 'Élus locaux',
    desc: 'La France compte 520 000 élus locaux pour 68 millions d\'habitants. Record mondial.',
    comparison: { label: 'L\'Espagne', value: '65 000 élus pour 47 millions d\'habitants' },
    color: '#ff9f43',
  },
  {
    id: 44,
    icon: '📄',
    stat: '60',
    title: 'Code du travail suisse',
    desc: 'Le Code du travail suisse fait 60 pages. Taux de chômage : 2%. Le nôtre fait 3 500 pages. Chômage : 7,5%.',
    comparison: { label: 'Corrélation ?', value: 'À vous de juger' },
    color: '#ffd700',
  },
  {
    id: 45,
    icon: '🎰',
    stat: '73 Md€',
    title: 'Fraude sociale estimée',
    desc: 'La fraude sociale + fiscale est estimée entre 50 et 100 milliards/an. L\'État en récupère moins de 20%.',
    comparison: { label: 'Contrôleurs URSSAF', value: '1 500 pour toute la France' },
    color: '#a855f7',
  },
  {
    id: 46,
    icon: '🚆',
    stat: '15%',
    title: 'Trains en retard',
    desc: '15% des TGV arrivent avec du retard significatif. La SNCF touche pourtant 14 Md€ de subventions directes.',
    comparison: { label: 'Au Japon', value: '99% de ponctualité' },
    color: '#ff6b9d',
  },
  {
    id: 47,
    icon: '🏫',
    stat: '30%',
    title: 'Élèves faibles en maths',
    desc: '30% des élèves français ont un niveau faible en maths (PISA). On était à 20% il y a 20 ans.',
    comparison: { label: 'Budget Éducation', value: 'a augmenté de +40% sur cette période' },
    color: '#00d4ff',
  },
  {
    id: 48,
    icon: '🏥',
    stat: '3 700 €',
    title: 'Santé par habitant',
    desc: 'L\'assurance maladie dépense 3 700 €/an par Français en moyenne.',
    comparison: { label: 'Ça fait', value: '10 € par jour par personne' },
    color: '#45b7d1',
  },
  {
    id: 49,
    icon: '⚰️',
    stat: '5 000 €',
    title: 'Coût des obsèques',
    desc: 'Les obsèques coûtent 5 000 € en moyenne en France (hors concession). Les taxes représentent 20% du prix.',
    comparison: { label: 'TVA sur un cercueil', value: '20%' },
    color: '#20e3b2',
  },
  {
    id: 50,
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

      <main className="relative z-[1] max-w-[1400px] mx-auto px-4 lg:px-8 py-24 lg:py-32">
        {/* Hero */}
        <header className="text-center mb-16">
          <Badge variant="red" icon="🚨" className="animate-glow">
            50 chiffres qui font mal
          </Badge>
          <h1 className="font-serif text-[clamp(3rem,10vw,6rem)] font-normal leading-[1.1] mt-6 mb-6">
            <span className="italic bg-gradient-to-r from-accent-red via-accent-orange to-accent-pink bg-clip-text text-transparent">
              WTF?!
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-xl mx-auto">
            50 chiffres sur les finances publiques qui vont vous faire tomber de votre chaise
          </p>
        </header>

        {/* Live Counter */}
        <div className="relative bg-gradient-to-br from-accent-red/10 to-accent-orange/10 border border-accent-red/30 rounded-3xl p-8 lg:p-12 text-center mb-12 overflow-hidden">
          {/* Loading bar */}
          <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-accent-red via-accent-orange to-accent-pink animate-loading" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-red rounded-full text-xs font-semibold uppercase mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-blink" />
            En direct
          </div>

          <p className="text-text-secondary text-lg mb-3">
            Depuis que vous avez ouvert cette page, la dette française a augmenté de
          </p>

          <div className="font-mono text-[clamp(2.5rem,8vw,5rem)] font-medium text-accent-red" style={{ textShadow: '0 0 30px rgba(255, 71, 87, 0.5)' }}>
            {formatCurrency(debtCounter)}
          </div>

          <p className="text-text-muted text-base mt-3">
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

              <div className="font-mono text-4xl font-semibold mb-2 leading-tight" style={{ color: fact.color }}>
                {fact.stat}
              </div>

              <h3 className="text-xl font-semibold mb-3">{fact.title}</h3>

              <p className="text-text-secondary text-base leading-relaxed mb-5">
                {fact.desc}
              </p>

              <div className="p-4 bg-white/[0.03] rounded-lg border-l-[3px]" style={{ borderColor: fact.color }}>
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  {fact.comparison.label}
                </div>
                <div className="font-mono text-lg" style={{ color: fact.color }}>
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
          <h2 className="font-serif text-3xl font-normal mb-4">Le saviez-vous ?</h2>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
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
          <p className="text-text-muted text-sm">
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

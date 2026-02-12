'use client'

import { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { KpiCard } from '@/components/ui/KpiCard'
import { ChartWrapper, LineChart, BarChart, DoughnutChart } from '@/components/charts'

// ====== RENDEMENTS HISTORIQUES BASE 100 (20 ans) ======
// Source : Euronext (CAC 40 GR), INSEE (immobilier résidentiel France),
// LBMA (or en €), Banque de France (OAT 10 ans), taux réglementés (Livret A)
// Base 100 en 2005, dividendes/loyers/coupons réinvestis
const RENDEMENTS_20ANS = {
  labels: ['2005', '2007', '2009', '2011', '2013', '2015', '2017', '2019', '2021', '2023', '2025'],
  datasets: [
    {
      label: 'Or (en €)',
      data: [100, 145, 225, 440, 350, 310, 340, 380, 480, 550, 770],
      borderColor: '#ffd700',
      backgroundColor: 'rgba(255, 215, 0, 0.05)',
      fill: false,
      borderWidth: 3,
    },
    {
      label: 'CAC 40 (div. réinvestis)',
      data: [100, 145, 78, 105, 128, 155, 192, 215, 290, 325, 390],
      borderColor: '#ff9f43',
      backgroundColor: 'rgba(255, 159, 67, 0.05)',
      fill: false,
      borderWidth: 3,
    },
    {
      label: 'Immobilier (loyers inclus)',
      data: [100, 118, 105, 118, 115, 117, 128, 138, 158, 152, 168],
      borderColor: '#a855f7',
      backgroundColor: 'rgba(168, 85, 247, 0.05)',
      fill: false,
      borderWidth: 2,
    },
    {
      label: 'Obligations (OAT)',
      data: [100, 102, 112, 125, 138, 152, 158, 168, 165, 155, 162],
      borderColor: '#00d4ff',
      backgroundColor: 'rgba(0, 212, 255, 0.05)',
      fill: false,
      borderWidth: 2,
    },
    {
      label: 'Livret A',
      data: [100, 106, 115, 120, 123, 125, 127, 128, 129, 133, 138],
      borderColor: '#00ff88',
      backgroundColor: 'rgba(0, 255, 136, 0.05)',
      fill: false,
      borderWidth: 2,
    },
  ],
}

// ====== RENDEMENT REEL APRES INFLATION ======
// Source : Calcul à partir des rendements nominaux annualisés 20 ans
// Inflation moyenne INSEE sur la période : ~2,0% par an
const RENDEMENT_REEL = [
  { label: 'Or (en €)', nominal: 10.5, reel: 8.5, color: '#ffd700' },
  { label: 'CAC 40', nominal: 8.5, reel: 6.5, color: '#ff9f43' },
  { label: 'Immobilier', nominal: 4.5, reel: 2.5, color: '#a855f7' },
  { label: 'Obligations', nominal: 3.0, reel: 1.0, color: '#00d4ff' },
  { label: 'Fonds €', nominal: 2.5, reel: 0.5, color: '#8899a8' },
  { label: 'Livret A', nominal: 1.8, reel: -0.2, color: '#00ff88' },
]

// ====== EPARGNE DES FRANCAIS ======
// Source : Banque de France Q2 2025, France Assureurs fin 2025, CDC, AFG
// Total patrimoine financier : 6 478 Md€
const EPARGNE_FRANCAIS = {
  labels: ['Assurance-vie', 'Dépôts bancaires', 'Livrets réglementés', 'Actions & OPCVM', 'Épargne salariale', 'Autres'],
  data: [2107, 1213, 685, 486, 221, 1766],
  colors: ['#ff9f43', '#00d4ff', '#00ff88', '#ff4757', '#a855f7', '#8899a8'],
}

// ====== FISCALITE DES PLACEMENTS ======
// Source : Code général des impôts 2025, BOFIP
const FISCALITE_PLACEMENTS = [
  {
    nom: 'PEA',
    fullName: "Plan d'Épargne en Actions",
    plafond: '150 000 €',
    fiscalite: '18,6% (PS seuls) après 5 ans',
    avantage: 'Exonération IR après 5 ans',
    icon: '📈',
    color: '#00ff88',
    supports: 'Actions européennes, ETF éligibles',
  },
  {
    nom: 'Assurance-Vie',
    fullName: "Contrat d'assurance-vie",
    plafond: 'Illimité',
    fiscalite: '24,7% après 8 ans (< 150 k€)',
    avantage: 'Abattement 4 600 €/an après 8 ans',
    icon: '🛡️',
    color: '#ff9f43',
    supports: 'Fonds €, UC, SCPI, ETF...',
  },
  {
    nom: 'CTO',
    fullName: 'Compte-Titres Ordinaire',
    plafond: 'Illimité',
    fiscalite: 'Flat tax 31,4% (dès 2026)',
    avantage: 'Aucune restriction de supports',
    icon: '💼',
    color: '#ff4757',
    supports: 'Actions monde, obligations, crypto...',
  },
  {
    nom: 'PER',
    fullName: "Plan d'Épargne Retraite",
    plafond: '10% revenus N-1',
    fiscalite: 'Déductible à l\'entrée, imposé à la sortie',
    avantage: 'Réduction d\'impôt immédiate',
    icon: '👴',
    color: '#a855f7',
    supports: 'Fonds €, UC, ETF...',
  },
]

// ====== COMPARAISON INTERNATIONALE EPARGNE ======
// Source : OCDE, Eurostat 2024 - Taux d'épargne brut des ménages (% du revenu disponible)
// Source : OCDE, Eurostat Q3 2024 — Taux d'épargne brut des ménages (% du revenu disponible)
const EPARGNE_INTERNATIONALE = [
  { country: '🇩🇪 Allemagne', value: 20.5 },
  { country: '🇫🇷 France', value: 17.6, highlight: true },
  { country: '🇪🇸 Espagne', value: 14.2 },
  { country: '🇮🇹 Italie', value: 12.0 },
  { country: '🇧🇪 Belgique', value: 12.0 },
  { country: '🇬🇧 Royaume-Uni', value: 10.0 },
  { country: '🇺🇸 États-Unis', value: 3.8 },
]

// ====== FAQ INVESTISSEMENT ======
// Questions fréquentes ciblant les requêtes SEO
const FAQ_ITEMS = [
  {
    question: 'Quel est le meilleur placement en 2026 ?',
    answer: "Il n'existe pas de « meilleur placement » universel : tout dépend de votre horizon de temps, de votre tolérance au risque et de votre fiscalité. Sur 20 ans, le CAC 40 dividendes réinvestis a rapporté environ 8,5 % par an. Le Livret A, sans risque, offre 1,5 % depuis février 2026. L'immobilier locatif rapporte 4 à 5 % brut. La stratégie la plus recommandée par les études académiques est la diversification via des ETF (fonds indiciels) à faibles frais. Source : Euronext, Banque de France.",
    emoji: '🏆',
  },
  {
    question: 'Quelle est la différence entre PEA et assurance-vie ?',
    answer: "Le PEA est réservé aux actions européennes avec un plafond de 150 000 €, mais offre une fiscalité avantageuse après 5 ans (18,6 % de prélèvements sociaux uniquement depuis 2026). L'assurance-vie est sans plafond et accepte tous types de supports (fonds euros, actions, immobilier), avec un avantage fiscal après 8 ans (24,7 %) et des atouts successoraux (abattement de 152 500 € par bénéficiaire). Pour investir en bourse, le PEA est plus avantageux fiscalement. Pour diversifier ou transmettre, l'assurance-vie est préférable. Source : Code général des impôts, LFSS 2026.",
    emoji: '⚖️',
  },
  {
    question: 'Combien rapporte le Livret A en 2026 ?',
    answer: "Le taux du Livret A est de 1,5 % net (exonéré d'impôts et de prélèvements sociaux) depuis le 1er février 2026. Avec une inflation autour de 0,8 %, le rendement réel est d'environ 0,7 %. Le plafond est de 22 950 €, soit un gain maximum d'environ 344 € par an. Le Livret A reste un placement de précaution, pas un outil d'enrichissement. Source : Banque de France, INSEE.",
    emoji: '🏦',
  },
  {
    question: 'Comment commencer à investir en bourse ?',
    answer: "Pour débuter en bourse : 1) Constituez d'abord une épargne de précaution (3 à 6 mois de dépenses sur Livret A). 2) Ouvrez un PEA chez un courtier en ligne à faibles frais. 3) Investissez régulièrement (chaque mois) dans un ETF diversifié (ex : MSCI World) pour lisser le risque. 4) N'investissez que de l'argent dont vous n'avez pas besoin à court terme (horizon minimum 5 ans). Les frais sont l'ennemi n°1 de la performance : privilégiez les ETF aux fonds actifs. Source : AMF, études Morningstar.",
    emoji: '🚀',
  },
  {
    question: 'Quel rendement espérer en bourse sur le long terme ?',
    answer: "Historiquement, les actions mondiales ont rapporté entre 7 % et 10 % par an sur le long terme (dividendes réinvestis). Le CAC 40 GR a rapporté environ 8,5 % annualisé sur 20 ans. Attention : ce rendement n'est pas garanti et suppose de supporter des baisses temporaires importantes (-40 % en 2008). Le rendement réel (après inflation) est d'environ 6 à 7 %. Plus votre horizon est long, plus la probabilité de gain est élevée : sur 15 ans, le CAC 40 n'a jamais été négatif. Source : Euronext, données historiques.",
    emoji: '📊',
  },
]

function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export default function InvestirContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const faqSchema = generateFAQSchema()

  return (
    <div className="relative min-h-screen">
      {/* Orange gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255, 159, 67, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <main className="relative z-[1] max-w-[1600px] mx-auto px-4 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal mb-3">
            Préparer sa <span className="italic text-accent-orange">liberté financière</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            La dette explose, les retraites sont menacées. Ne comptez pas sur l&apos;État pour
            assurer votre avenir. Comprenez les placements et prenez votre indépendance financière en main.
          </p>
        </header>

        {/* Alert Banner — Lien avec le tableau de bord */}
        <div className="bg-gradient-to-r from-accent-red/10 to-accent-orange/10 border border-accent-red/30 rounded-2xl p-6 mb-8 flex flex-col lg:flex-row gap-6 items-center">
          <div className="text-5xl">⚠️</div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl font-semibold mb-2">Pourquoi investir est devenu une nécessité</h2>
            <p className="text-text-secondary">
              <Link href="/dettes" className="text-accent-red hover:underline">3 482 Md€ de dette</Link>,{' '}
              <Link href="/depenses" className="text-accent-electric hover:underline">400 Md€ de retraites</Link> à financer
              avec de moins en moins d&apos;actifs par retraité. Le système par répartition ne suffira plus.
              Préparer sa retraite par capitalisation n&apos;est plus un choix, c&apos;est une nécessité.
            </p>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="font-mono text-3xl font-medium text-accent-red">1,7</div>
            <div className="text-text-muted text-sm">actif par retraité en 2040</div>
            <div className="text-text-muted text-xs mt-1">vs 4 en 1960</div>
          </div>
        </div>

        {/* KPI Grid */}
        {/* Source: Euronext, Banque de France, INSEE — 2024/2025 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            icon="📈"
            label="CAC 40 (20 ans)"
            value="+8,5%/an"
            subtext="Dividendes réinvestis"
            color="orange"
          />
          <KpiCard
            icon="🏦"
            label="Livret A"
            value="1,5%"
            subtext="Taux net depuis fév. 2026"
            color="green"
          />
          <KpiCard
            icon="📉"
            label="Inflation"
            value="0,8%"
            subtext="Glissement annuel déc. 2025"
            color="red"
          />
          <KpiCard
            icon="💰"
            label="Épargne des ménages"
            value="6 478 Md€"
            subtext="Patrimoine financier total"
            color="gold"
          />
        </div>

        {/* Section 1: Rendements historiques comparés */}
        <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
          <span className="italic text-accent-orange">Rendements</span> historiques comparés
        </h2>

        <div className="mb-10">
          <ChartWrapper
            title="100 € investis en 2005, combien aujourd'hui ?"
            subtitle="Évolution base 100, dividendes et revenus réinvestis"
            height="400px"
            source="Euronext, INSEE, LBMA, Banque de France"
          >
            <LineChart
              labels={RENDEMENTS_20ANS.labels}
              datasets={RENDEMENTS_20ANS.datasets}
              yMin={50}
              yMax={850}
              yCallback={(v) => `${v} €`}
              showLegend={true}
            />
          </ChartWrapper>
        </div>

        {/* Section 2: Rendement réel vs inflation */}
        <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
          Rendement <span className="italic text-accent-orange">réel</span> après inflation
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <ChartWrapper
            title="La bourse surperforme largement l'épargne sécurisée"
            subtitle="Rendement annualisé nominal sur 20 ans"
            height="350px"
            source="Euronext, Banque de France, INSEE"
          >
            <BarChart
              labels={RENDEMENT_REEL.map((r) => r.label)}
              data={RENDEMENT_REEL.map((r) => r.nominal)}
              colors={RENDEMENT_REEL.map((r) => r.color)}
              tooltipSuffix="%/an"
              yAxisSuffix="%"
              yMin={0}
              yMax={12}
              showValues
            />
          </ChartWrapper>

          <ChartWrapper
            title="Après inflation, le Livret A rapporte quasi rien"
            subtitle="Rendement réel annualisé (nominal − inflation)"
            height="350px"
            source="Calcul, inflation moyenne INSEE ~2%/an"
          >
            <BarChart
              labels={RENDEMENT_REEL.map((r) => r.label)}
              data={RENDEMENT_REEL.map((r) => r.reel)}
              colors={(ctx) => {
                const val = RENDEMENT_REEL[ctx.dataIndex]?.reel
                return val > 2 ? RENDEMENT_REEL[ctx.dataIndex].color : '#64748b'
              }}
              tooltipSuffix="%/an"
              yAxisSuffix="%"
              yMin={0}
              yMax={8}
              showValues
            />
          </ChartWrapper>
        </div>

        {/* Section 3: Comment épargnent les Français */}
        <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
          Comment <span className="italic text-accent-orange">épargnent</span> les Français
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <ChartWrapper
            title="L'assurance-vie domine l'épargne française"
            subtitle="Patrimoine financier des ménages (6 478 Md€)"
            height="350px"
            source="Banque de France Q2 2025, France Assureurs"
          >
            <DoughnutChart
              labels={EPARGNE_FRANCAIS.labels}
              data={EPARGNE_FRANCAIS.data}
              colors={EPARGNE_FRANCAIS.colors}
              tooltipSuffix=" Md€"
              legendPosition="bottom"
            />
          </ChartWrapper>

          {/* Détail de l'épargne */}
          <div className="bg-bg-surface border border-glass-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Répartition détaillée</h3>
            <p className="text-text-muted text-sm mb-6">Source : Banque de France Q2 2025, France Assureurs, CDC, AFG</p>
            <div className="space-y-4">
              {EPARGNE_FRANCAIS.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: EPARGNE_FRANCAIS.colors[index] }}
                    />
                    <span className="text-text-primary">{label}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className="font-mono text-lg font-medium"
                      style={{ color: EPARGNE_FRANCAIS.colors[index] }}
                    >
                      {EPARGNE_FRANCAIS.data[index].toLocaleString('fr-FR')} Md€
                    </span>
                    <span className="text-text-muted text-sm ml-2">
                      ({((EPARGNE_FRANCAIS.data[index] / 6478) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Fiscalité des placements */}
        <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
          <span className="italic text-accent-orange">Fiscalité</span> des placements : PEA, assurance-vie, CTO, PER
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {FISCALITE_PLACEMENTS.map((placement) => (
            <div
              key={placement.nom}
              className="bg-bg-surface border border-glass-border rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Top bar color */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: placement.color }}
              />
              <div className="text-3xl mb-3">{placement.icon}</div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: placement.color }}>
                {placement.nom}
              </h3>
              <p className="text-text-muted text-xs mb-3">{placement.fullName}</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-text-muted">Plafond : </span>
                  <span className="text-text-primary font-mono">{placement.plafond}</span>
                </div>
                <div>
                  <span className="text-text-muted">Fiscalité : </span>
                  <span className="text-text-primary">{placement.fiscalite}</span>
                </div>
                <div>
                  <span className="text-text-muted">Supports : </span>
                  <span className="text-text-secondary">{placement.supports}</span>
                </div>
              </div>
              <div
                className="mt-3 pt-3 border-t border-glass-border text-xs font-medium"
                style={{ color: placement.color }}
              >
                {placement.avantage}
              </div>
            </div>
          ))}
        </div>

        {/* Section 5: Comparaison internationale */}
        <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
          Les Français épargnent <span className="italic text-accent-orange">plus</span> que la moyenne
        </h2>

        <div className="mb-10">
          <ChartWrapper
            title="Taux d'épargne des ménages"
            subtitle="En % du revenu disponible brut (2024)"
            height="400px"
            source="OCDE, Eurostat 2024"
          >
            <BarChart
              labels={EPARGNE_INTERNATIONALE.map((c) => c.country)}
              data={EPARGNE_INTERNATIONALE.map((c) => c.value)}
              colors={(ctx) =>
                EPARGNE_INTERNATIONALE[ctx.dataIndex]?.highlight ? '#ff9f43' : '#64748b'
              }
              tooltipSuffix="%"
              yAxisSuffix="%"
              yMin={0}
              yMax={25}
              showValues
            />
          </ChartWrapper>
        </div>

        {/* CTA Simulateur */}
        <div className="bg-gradient-to-r from-accent-orange/10 to-accent-gold/10 border border-accent-orange/30 rounded-2xl p-8 mb-10 text-center">
          <div className="text-4xl mb-4">🧮</div>
          <h2 className="font-serif text-2xl font-normal mb-3">
            Construisez votre <span className="italic text-accent-orange">retraite par capitalisation</span>
          </h2>
          <p className="text-text-secondary mb-6 max-w-lg mx-auto">
            200 € par mois pendant 25 ans à 8 % = plus de 190 000 €.
            Simulez votre propre plan d&apos;indépendance financière.
          </p>
          <Link
            href="/investir/simulateur"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange text-bg-deep font-semibold rounded-xl hover:bg-accent-orange/90 transition-colors no-underline"
          >
            Lancer le simulateur
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* FAQ - Schema.org pour Google Rich Snippets */}
        <section itemScope itemType="https://schema.org/FAQPage">
          <Script
            id="investir-faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />

          <h2 className="font-serif text-2xl font-normal mb-6 mt-10">
            Questions <span className="italic text-accent-orange">fréquentes</span> sur l&apos;investissement
          </h2>

          <div className="max-w-4xl mx-auto flex flex-col gap-3 mb-10">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-bg-surface border border-glass-border rounded-xl overflow-hidden transition-all duration-300 hover:border-glass-border/80"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left cursor-pointer"
                  aria-expanded={openIndex === index}
                  aria-controls={`investir-faq-${index}`}
                >
                  <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
                  <span className="flex-1 font-medium text-text-primary" itemProp="name">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-text-muted transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  id={`investir-faq-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="px-5 pb-5 pt-0">
                    <div className="pl-10 border-l-2 border-accent-orange/30">
                      <p className="text-text-secondary leading-relaxed" itemProp="text">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

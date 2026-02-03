'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQ_ITEMS = [
  {
    question: 'Pourquoi la France n\'a-t-elle pas eu de budget équilibré depuis 50 ans ?',
    answer: 'Depuis 1974, chaque gouvernement français vote un budget en déficit. Cette situation unique en Europe s\'explique par des mécanismes économiques (croissance insuffisante, chômage élevé) et politiques (difficultés à réduire les dépenses, pression électorale).',
    emoji: '📊',
    category: 'Déficit',
    slug: 'budget-equilibre-50-ans',
  },
  {
    question: 'Qui détient vraiment la dette française ?',
    answer: '55% de la dette française est détenue par des investisseurs étrangers (fonds de pension, banques, assurances), 25% par des investisseurs français et 20% par la BCE/Eurosystème. Cette forte dépendance aux investisseurs étrangers expose la France aux variations des taux d\'intérêt mondiaux.',
    emoji: '💰',
    category: 'Dette',
    slug: 'qui-detient-dette',
  },
  {
    question: 'Pourquoi 56% des Français ne paient pas d\'impôt sur le revenu ?',
    answer: 'L\'impôt sur le revenu est progressif : les premiers euros gagnés ne sont pas taxés (quotient familial, abattements). Seuls 44% des foyers dépassent le seuil d\'imposition, ce qui signifie que 56% sont non imposables. Cependant, tout le monde paie la TVA (20%) et les cotisations sociales.',
    emoji: '🧾',
    category: 'Impôts',
    slug: 'ir-56-pourcent',
  },
  {
    question: 'Protection sociale : où passent les 932 milliards ?',
    answer: 'Le budget Protection Sociale (56% des dépenses) se répartit entre : les retraites (380 Md€), l\'assurance maladie (270 Md€), les allocations familiales (55 Md€), le chômage (45 Md€), et d\'autres prestations sociales (logement, RSA, etc.).',
    emoji: '🏥',
    category: 'Dépenses',
    slug: 'protection-sociale-932-milliards',
  },
  {
    question: 'Comment font l\'Allemagne et les Pays-Bas pour dépenser moins ?',
    answer: 'Avec 49% du PIB contre 57% pour la France, nos voisins ont fait des choix différents : retraites moins généreuses, système de santé mixte public/privé, moins de fonctionnaires, et une tradition de rigueur budgétaire.',
    emoji: '🇪🇺',
    category: 'Europe',
    slug: 'allemagne-pays-bas',
  },
  {
    question: 'C\'est quoi exactement le PIB ?',
    answer: 'Le PIB (Produit Intérieur Brut) mesure la richesse créée dans un pays en un an. En France, il est d\'environ 2 950 milliards d\'euros. C\'est la référence pour calculer les ratios dette/PIB (117%) ou dépenses/PIB (57%).',
    emoji: '📈',
    category: 'Économie',
    slug: 'cest-quoi-pib',
  },
  {
    question: 'Brut vs Net : pourquoi une telle différence ?',
    answer: 'Entre le coût employeur et le net en poche, la différence peut dépasser 40%. Les cotisations patronales (~25%) financent la Sécu et le chômage. Les cotisations salariales (~22%) financent la retraite et l\'assurance maladie.',
    emoji: '👔',
    category: 'Salaire',
    slug: 'brut-net-difference',
  },
  {
    question: 'Pourquoi la France est-elle le 2ème pays le plus taxé au monde ?',
    answer: 'Avec 45.4% du PIB en prélèvements obligatoires, la France finance une protection sociale très développée : santé quasi-gratuite, retraites généreuses, allocations nombreuses. C\'est un choix de société qui a un coût.',
    emoji: '🏆',
    category: 'Impôts',
    slug: 'france-plus-taxe',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 lg:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-normal mb-4">
            Questions <span className="italic text-accent-electric">fréquentes</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Les réponses aux questions que vous vous posez sur les finances publiques
          </p>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-bg-surface border border-glass-border rounded-xl overflow-hidden transition-all duration-300 hover:border-glass-border/80"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left cursor-pointer"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="flex-1 font-medium text-text-primary">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-text-muted transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-5 pt-0">
                  <div className="pl-10 border-l-2 border-accent-electric/30">
                    <p className="text-text-secondary leading-relaxed">{item.answer}</p>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="inline-flex items-center gap-1 mt-3 text-accent-electric text-sm font-medium no-underline hover:underline"
                    >
                      En savoir plus
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-electric transition-colors no-underline"
          >
            Voir toutes les questions
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

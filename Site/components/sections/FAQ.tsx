'use client'

import { useState } from 'react'
import Script from 'next/script'

// FAQ optimisée SEO - Données vérifiées par Fact-Checker (02/2026)
// Sources : INSEE, DGFIP, Eurostat, Banque de France
const FAQ_ITEMS = [
  {
    question: 'Pourquoi la France n\'a-t-elle pas eu de budget équilibré depuis 1974 ?',
    answer: 'Depuis 1974, chaque gouvernement français vote un budget en déficit, soit 51 années consécutives. Le dernier excédent date de 1974 (+0,3% du PIB). Cette situation s\'explique par des mécanismes économiques (croissance insuffisante, chômage élevé) et politiques (difficultés à réduire les dépenses, pression électorale). Source : INSEE, Vie-publique.fr.',
    emoji: '📊',
    category: 'Déficit',
    slug: 'budget-equilibre-50-ans',
  },
  {
    question: 'Qui détient la dette française en 2025 ?',
    answer: '54,7% de la dette française est détenue par des investisseurs étrangers (fonds de pension, banques, assurances), 25% par la BCE et la Banque de France, et 20,3% par des investisseurs français (assurances 9%, banques 9%). Cette dépendance aux non-résidents expose la France aux variations des taux d\'intérêt mondiaux. Source : Banque de France, T1 2025.',
    emoji: '💰',
    category: 'Dette',
    slug: 'qui-detient-dette',
  },
  {
    question: 'Pourquoi 53% des Français ne paient pas d\'impôt sur le revenu ?',
    answer: 'L\'impôt sur le revenu est progressif : les premiers euros gagnés ne sont pas taxés grâce au quotient familial et aux abattements. En 2025, 47% des foyers fiscaux (19,6 millions) paient l\'impôt sur le revenu, soit 53% de non-imposables. Cependant, tout le monde paie la TVA (20%) et les cotisations sociales. Source : DGFIP, novembre 2025.',
    emoji: '🧾',
    category: 'Impôts',
    slug: 'ir-53-pourcent',
  },
  {
    question: 'Protection sociale : où passent les 750 milliards de prestations ?',
    answer: 'Les prestations sociales représentent 750 Md€ soit 45% des dépenses publiques. Elles se répartissent entre : les retraites (380 Md€, 1er poste), l\'assurance maladie (274 Md€), les allocations familiales (55 Md€), le chômage (45 Md€), et d\'autres aides (logement, RSA, handicap). Source : INSEE, DREES 2024.',
    emoji: '🏥',
    category: 'Dépenses',
    slug: 'protection-sociale-750-milliards',
  },
  {
    question: 'Comment l\'Allemagne et les Pays-Bas dépensent-ils moins que la France ?',
    answer: 'L\'Allemagne dépense 49,5% du PIB, les Pays-Bas 47%, contre 57,2% pour la France (écart de 8 à 10 points). Nos voisins ont fait des choix différents : retraites moins généreuses, système de santé mixte public/privé, moins de fonctionnaires, et une tradition de rigueur budgétaire inscrite dans la constitution (Allemagne). Source : Eurostat 2024.',
    emoji: '🇪🇺',
    category: 'Europe',
    slug: 'allemagne-pays-bas',
  },
  {
    question: 'Qu\'est-ce que le PIB et combien vaut-il en France ?',
    answer: 'Le PIB (Produit Intérieur Brut) mesure la richesse créée dans un pays en un an. En France, il s\'élève à 2 920 milliards d\'euros en 2024 (INSEE). C\'est la référence pour calculer les ratios : dette/PIB (117,4%), dépenses/PIB (57,2%), prélèvements/PIB (45,3%).',
    emoji: '📈',
    category: 'Économie',
    slug: 'cest-quoi-pib',
  },
  {
    question: 'Salaire brut vs net : pourquoi 40% de différence ?',
    answer: 'Entre le coût employeur et le salaire net, la différence atteint 40% en moyenne. Les cotisations patronales (~25-30% du brut) financent la Sécurité sociale et le chômage. Les cotisations salariales (~20-23%) financent la retraite et l\'assurance maladie. Exemple : pour 100€ de coût employeur, le salarié touche environ 60€ net. Source : URSSAF 2025.',
    emoji: '👔',
    category: 'Salaire',
    slug: 'brut-net-difference',
  },
  {
    question: 'Pourquoi la France est-elle parmi les pays les plus taxés au monde ?',
    answer: 'Avec 45,3% du PIB en prélèvements obligatoires (2024), la France se classe 1ère ou 2ème mondiale avec le Danemark (45,8%). Ces prélèvements financent une protection sociale très développée : santé quasi-gratuite, retraites généreuses, allocations familiales. La moyenne européenne est de 40%, l\'OCDE de 34%. Source : Eurostat 2024.',
    emoji: '🏆',
    category: 'Impôts',
    slug: 'france-plus-taxe',
  },
  {
    question: 'Qui a créé le site Où Va l\'Argent ?',
    answer: 'Où Va l\'Argent a été créé et développé par Emmanuel Blézès, entrepreneur et expert en économie. L\'objectif est de rendre les finances publiques françaises accessibles et compréhensibles par tous les citoyens, et de démocratiser la compréhension de l\'économie.',
    emoji: '👨‍💻',
    category: 'À propos',
    slug: 'qui-a-cree-site',
  },
]

// Génère le JSON-LD Schema.org FAQPage pour le SEO
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

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqSchema = generateFAQSchema()

  return (
    <section className="py-16 lg:py-24 px-4" itemScope itemType="https://schema.org/FAQPage">
      {/* Schema.org FAQPage JSON-LD pour Google Rich Snippets */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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

        {/* FAQ List avec micro-données Schema.org */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-bg-surface border border-glass-border rounded-xl overflow-hidden transition-all duration-300 hover:border-glass-border/80"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left cursor-pointer"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
                <span className="flex-1 font-medium text-text-primary" itemProp="name">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-text-muted transition-transform duration-300 ${
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
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[500px]' : 'max-h-0'
                }`}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div className="px-5 pb-5 pt-0">
                  <div className="pl-10 border-l-2 border-accent-electric/30">
                    <p className="text-text-secondary leading-relaxed" itemProp="text">{item.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

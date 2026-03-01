import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import DettesContent from './DettesContent'

export const metadata: Metadata = {
  title: 'Dette publique française — 3 482 milliards décryptés',
  description: 'Analyse de la dette publique française : 3 482 milliards d\'euros, 117% du PIB. Évolution historique, détenteurs, charge d\'intérêts et comparaisons européennes.',
  keywords: [
    'dette publique France',
    'dette française 2025',
    'dette PIB France',
    'charge intérêts dette',
    'détenteurs dette France',
    'dette par habitant',
    'déficit public France',
    'comparaison dette Europe',
  ],
  openGraph: {
    title: 'Dette publique française — 3 482 milliards décryptés',
    description: '3 482 Md€ de dette, 117% du PIB. Évolution, détenteurs, charge d\'intérêts et comparaisons européennes.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.com/dettes',
    images: [
      {
        url: 'https://ouvalargent.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Dette publique française — Où Va l\'Argent ?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dette publique française — 3 482 milliards décryptés',
    description: '3 482 Md€ de dette, 117% du PIB. Analyse complète de l\'endettement français.',
    images: ['https://ouvalargent.com/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.com/dettes',
  },
}

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Dette publique' }]} />
      <DettesContent />
    </>
  )
}

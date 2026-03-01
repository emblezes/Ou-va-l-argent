import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import DepensesContent from './DepensesContent'

export const metadata: Metadata = {
  title: 'Dépenses publiques françaises — Analyse et décryptage',
  description: 'Analyse complète du budget de l\'État français : répartition des 1 670 milliards de dépenses publiques, évolution historique, comparaisons européennes et efficacité.',
  keywords: [
    'dépenses publiques France',
    'budget État français',
    'répartition dépenses publiques',
    'dépenses sociales France',
    'fonction publique France',
    'dépenses publiques PIB',
    'comparaison dépenses Europe',
  ],
  openGraph: {
    title: 'Dépenses publiques françaises — Analyse et décryptage',
    description: 'Analyse complète du budget de l\'État : répartition des 1 670 Md€ de dépenses, comparaisons européennes et efficacité.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.com/depenses',
    images: [
      {
        url: 'https://ouvalargent.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Dépenses publiques françaises — Où Va l\'Argent ?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dépenses publiques françaises — Analyse et décryptage',
    description: 'Analyse complète du budget de l\'État : répartition des 1 670 Md€ de dépenses publiques.',
    images: ['https://ouvalargent.com/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.com/depenses',
  },
}

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Dépenses publiques' }]} />
      <DepensesContent />
    </>
  )
}

import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import ImpotsContent from './ImpotsContent'

export const metadata: Metadata = {
  title: 'Impôts en France — Pression fiscale et comparaisons',
  description: 'Analyse des impôts en France : TVA, IR, IS, CSG. La France est le 2ème pays le plus taxé de l\'OCDE avec 43.5% du PIB en prélèvements obligatoires.',
  keywords: [
    'impôts France',
    'pression fiscale France',
    'prélèvements obligatoires',
    'TVA France',
    'impôt sur le revenu',
    'flat tax dividendes',
    'fiscalité France OCDE',
    'comparaison impôts Europe',
  ],
  openGraph: {
    title: 'Impôts en France — Pression fiscale et comparaisons',
    description: 'La France, 2ème pays le plus taxé de l\'OCDE. Analyse des principaux impôts et comparaisons internationales.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.com/impots',
    images: [
      {
        url: 'https://ouvalargent.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Impôts en France — Où Va l\'Argent ?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Impôts en France — Pression fiscale et comparaisons',
    description: 'La France, 2ème pays le plus taxé de l\'OCDE. Analyse complète de la fiscalité française.',
    images: ['https://ouvalargent.com/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.com/impots',
  },
}

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Impôts' }]} />
      <ImpotsContent />
    </>
  )
}

import { Metadata } from 'next'
import SimulateurContent from './SimulateurContent'

export const metadata: Metadata = {
  title: "Simulateur d'intérêts composés — Préparez votre retraite",
  description:
    "Préparez votre retraite par capitalisation grâce aux intérêts composés. Simulez votre futur capital : versements mensuels, durée, rendement. Construisez votre indépendance financière.",
  keywords: [
    'simulateur intérêts composés',
    'calcul intérêts composés',
    'simulateur épargne',
    'calculateur placement',
    'intérêts composés formule',
    'combien rapportent 200 euros par mois',
    'simulateur PEA',
  ],
  openGraph: {
    title: "Simulateur d'intérêts composés — Préparez votre retraite",
    description:
      'Préparez votre retraite par capitalisation. Simulez votre futur capital grâce aux intérêts composés.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.fr/investir/simulateur',
    images: [
      {
        url: 'https://ouvalargent.fr/og-default.png',
        width: 1200,
        height: 630,
        alt: "Simulateur d'intérêts composés — Où Va l'Argent ?",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Simulateur d'intérêts composés — Préparez votre retraite",
    description:
      'Préparez votre retraite par capitalisation. Simulez votre futur capital grâce aux intérêts composés.',
    images: ['https://ouvalargent.fr/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.fr/investir/simulateur',
  },
}

export default function Page() {
  return <SimulateurContent />
}

import { Metadata } from 'next'
import InvestirContent from './InvestirContent'

export const metadata: Metadata = {
  title: 'Investir son argent en 2026 — Préparer sa liberté financière',
  description: 'Retraites menacées, dette record : préparez votre indépendance financière. Rendements historiques, fiscalité PEA/assurance-vie/CTO, et données sourcées pour investir intelligemment.',
  keywords: [
    'investir son argent',
    'où placer son argent 2026',
    'meilleur placement 2026',
    'rendement CAC 40',
    'PEA vs assurance vie',
    'fiscalité placements',
    'intérêts composés',
    'épargne France',
  ],
  openGraph: {
    title: 'Investir son argent en 2026 — Préparer sa liberté financière',
    description: 'Retraites menacées, dette record : préparez votre indépendance financière avec des données sourcées.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.fr/investir',
    images: [
      {
        url: 'https://ouvalargent.fr/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Investir son argent — Où Va l\'Argent ?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investir son argent en 2026 — Préparer sa liberté financière',
    description: 'Retraites menacées, dette record : préparez votre indépendance financière avec des données sourcées.',
    images: ['https://ouvalargent.fr/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.fr/investir',
  },
}

export default function Page() {
  return <InvestirContent />
}

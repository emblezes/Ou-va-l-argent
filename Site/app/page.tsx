import { Metadata } from 'next'
import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = {
  title: 'Où Va l\'Argent ? — Comprendre les finances publiques françaises',
  description: 'Décryptage de la dette, des impôts et des dépenses publiques françaises. Données sourcées, infographies et analyses pour comprendre où va votre argent.',
  keywords: [
    'finances publiques françaises',
    'dépenses publiques France',
    'dette publique France',
    'impôts France',
    'budget de l\'État',
    'où va l\'argent public',
    'économie française',
  ],
  openGraph: {
    title: 'Où Va l\'Argent ? — Comprendre les finances publiques françaises',
    description: 'Décryptage de la dette, des impôts et des dépenses publiques françaises avec des données sourcées.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.com',
    images: [
      {
        url: 'https://ouvalargent.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Où Va l\'Argent ? — Finances publiques, économie et investissement',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Où Va l\'Argent ? — Comprendre les finances publiques françaises',
    description: 'Décryptage de la dette, des impôts et des dépenses publiques françaises avec des données sourcées.',
    images: ['https://ouvalargent.com/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.com',
  },
}

export default function Page() {
  return <ComingSoon />
}

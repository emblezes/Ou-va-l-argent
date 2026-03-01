import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import NewsContent from './NewsContent'

export const metadata: Metadata = {
  title: 'Infographies — Finances publiques en images',
  description: 'Toutes nos infographies sur les finances publiques françaises : dette, impôts, dépenses, comparaisons internationales. Partagez et informez.',
  keywords: [
    'infographies finances publiques',
    'infographies économie France',
    'données budget France',
    'graphiques dette publique',
    'visuels impôts France',
  ],
  openGraph: {
    title: 'Infographies — Finances publiques en images',
    description: 'Les finances publiques françaises en images. Infographies sourcées à partager.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.com/news',
    images: [
      {
        url: 'https://ouvalargent.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Infographies — Où Va l\'Argent ?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infographies — Finances publiques en images',
    description: 'Les finances publiques françaises en images. Infographies sourcées à partager.',
    images: ['https://ouvalargent.com/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.com/news',
  },
}

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Infographies' }]} />
      <NewsContent />
    </>
  )
}

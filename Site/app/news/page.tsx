import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import NewsContent from './NewsContent'

export const metadata: Metadata = {
  title: 'News — Actualité économique et finances publiques',
  description: 'Articles et analyses sur les finances publiques françaises, la macro-économie, l\'investissement et l\'actualité économique.',
  keywords: [
    'actualité économique France',
    'finances publiques',
    'analyses économiques',
    'dette publique France',
    'impôts France',
    'macro-économie',
  ],
  openGraph: {
    title: 'News — Actualité économique et finances publiques',
    description: 'Articles et analyses sur les finances publiques françaises, la macro-économie, l\'investissement et l\'actualité économique.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.com/news',
    images: [
      {
        url: 'https://ouvalargent.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'News — Où Va l\'Argent ?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News — Actualité économique et finances publiques',
    description: 'Articles et analyses sur les finances publiques françaises, la macro-économie, l\'investissement et l\'actualité économique.',
    images: ['https://ouvalargent.com/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.com/news',
  },
}

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'News' }]} />
      <NewsContent />
    </>
  )
}

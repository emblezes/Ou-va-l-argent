import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import WtfContent from './WtfContent'

export const metadata: Metadata = {
  title: 'WTF — 30 chiffres aberrants des finances publiques',
  description: '30 chiffres choquants sur les finances publiques françaises : dette à la naissance, gaspillages, comparaisons internationales. Les absurdités budgétaires décryptées.',
  keywords: [
    'gaspillage argent public',
    'chiffres finances publiques',
    'absurdités budget France',
    'dette par habitant',
    'dépenses publiques aberrantes',
    'gaspillage État français',
  ],
  openGraph: {
    title: 'WTF — 30 chiffres aberrants des finances publiques',
    description: '30 chiffres choquants sur les finances publiques françaises qui vont vous faire tomber de votre chaise.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.com/wtf',
    images: [
      {
        url: 'https://ouvalargent.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'WTF — Chiffres aberrants — Où Va l\'Argent ?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WTF — 30 chiffres aberrants des finances publiques',
    description: '30 chiffres choquants sur les finances publiques françaises.',
    images: ['https://ouvalargent.com/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.com/wtf',
  },
}

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'WTF' }]} />
      <WtfContent />
    </>
  )
}

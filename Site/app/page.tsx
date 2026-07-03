import { Metadata } from 'next'
import { HomeMosaic } from '@/components/HomeMosaic'
import { PUBLISHED_INFOGRAPHICS } from '@/lib/published-infographics'

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

// Affiche uniquement la sélection curée d'infographies réellement publiées
// (cf. lib/published-infographics.ts). On n'accède PAS au système de fichiers :
// sinon le traçage Next embarquerait tout public/infographies (~350 Mo) dans la
// fonction, dépassant la limite Vercel de 250 Mo.
export default function Page() {
  return <HomeMosaic images={PUBLISHED_INFOGRAPHICS} />
}

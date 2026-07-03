import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
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
// (cf. lib/published-infographics.ts), dans l'ordre défini, en ne gardant
// que les fichiers effectivement présents dans public/infographies.
function getInfographics(): string[] {
  const dir = path.join(process.cwd(), 'public', 'infographies')
  let files: Set<string>
  try {
    files = new Set(fs.readdirSync(dir))
  } catch {
    return PUBLISHED_INFOGRAPHICS
  }
  return PUBLISHED_INFOGRAPHICS.filter((f) => files.has(f))
}

export default function Page() {
  const images = getInfographics()
  return <HomeMosaic images={images} />
}

import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import PropositionsContent from './PropositionsContent'

export const metadata: Metadata = {
  title: 'Propositions citoyennes — Réformer les finances publiques',
  description: 'Proposez vos idées pour améliorer la gestion des finances publiques françaises. Votez pour les meilleures propositions de la communauté.',
  keywords: [
    'propositions citoyennes',
    'réforme finances publiques',
    'idées budget France',
    'participation citoyenne économie',
    'réduire dépenses publiques',
  ],
  openGraph: {
    title: 'Propositions citoyennes — Réformer les finances publiques',
    description: 'Proposez vos idées et votez pour les meilleures propositions de réforme des finances publiques.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.com/propositions',
    images: [
      {
        url: 'https://ouvalargent.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Propositions citoyennes — Où Va l\'Argent ?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Propositions citoyennes — Réformer les finances publiques',
    description: 'Proposez vos idées et votez pour les meilleures propositions de réforme.',
    images: ['https://ouvalargent.com/og-default.png'],
  },
  alternates: {
    canonical: 'https://ouvalargent.com/propositions',
  },
}

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Propositions' }]} />
      <PropositionsContent />
    </>
  )
}

import type { Metadata } from 'next'
import { Syne, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { NewsletterPopup } from '@/components/NewsletterPopup'
import { NewsletterBar } from '@/components/NewsletterBar'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Où va l\'argent ?',
    template: '%s | Où va l\'argent ?',
  },
  description: 'Explorez les finances publiques françaises avec une transparence totale. Chaque euro, chaque ministère, chaque décision budgétaire.',
  keywords: ['finances publiques', 'budget France', 'dépenses publiques', 'dette publique', 'impôts France'],
  authors: [{ name: 'Où va l\'argent' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.com',
    siteName: 'Où va l\'argent ?',
    title: 'Où va l\'argent ?',
    description: 'Explorez les finances publiques françaises avec une transparence totale.',
    images: [
      {
        url: 'https://ouvalargent.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Où va l\'argent ? — Finances publiques, économie et investissement',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Où va l\'argent ?',
    description: 'Explorez les finances publiques françaises avec une transparence totale.',
    images: ['https://ouvalargent.com/og-default.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://ouvalargent.com/#organization',
        name: 'Où Va l\'Argent ?',
        url: 'https://ouvalargent.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://ouvalargent.com/og-default.png',
          width: 1200,
          height: 630,
        },
        sameAs: [
          'https://www.instagram.com/ouvalargent',
          'https://www.tiktok.com/@ouvalargentfr',
          'https://www.linkedin.com/company/ouvalargent',
        ],
        description: 'Média indépendant de décryptage des finances publiques françaises. Données sourcées, infographies et analyses.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://ouvalargent.com/#website',
        url: 'https://ouvalargent.com',
        name: 'Où Va l\'Argent ?',
        publisher: { '@id': 'https://ouvalargent.com/#organization' },
        inLanguage: 'fr-FR',
      },
      {
        '@type': 'Person',
        '@id': 'https://ouvalargent.com/#person',
        name: 'Emmanuel Blézès',
        jobTitle: 'Fondateur & Analyste',
        description: 'Expert en finances publiques françaises. Fondateur de Où Va l\'Argent, média de décryptage économique.',
        url: 'https://ouvalargent.com',
        sameAs: [
          'https://www.linkedin.com/in/emmanuelblezes',
          'https://www.instagram.com/ouvalargent',
          'https://www.tiktok.com/@ouvalargentfr',
        ],
      },
    ],
  }

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${syne.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        {/* Background Elements */}
        <div className="bg-atmosphere" />
        <div className="bg-grid" />

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="relative z-[1]">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Newsletter */}
        <NewsletterPopup />
        <NewsletterBar />
      </body>
    </html>
  )
}

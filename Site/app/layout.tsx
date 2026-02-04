import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Où va l\'argent ? - par Emmanuel Blézès',
    template: '%s | Où va l\'argent ?',
  },
  description: 'Explorez les finances publiques françaises avec une transparence totale. Chaque euro, chaque ministère, chaque décision budgétaire.',
  keywords: ['finances publiques', 'budget France', 'dépenses publiques', 'dette publique', 'impôts France'],
  authors: [{ name: 'Emmanuel Blézès' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ouvalargent.fr',
    siteName: 'Où va l\'argent ?',
    title: 'Où va l\'argent ? - par Emmanuel Blézès',
    description: 'Explorez les finances publiques françaises avec une transparence totale.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Où va l\'argent ? - par Emmanuel Blézès',
    description: 'Explorez les finances publiques françaises avec une transparence totale.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
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
      </body>
    </html>
  )
}

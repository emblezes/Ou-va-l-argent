import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Où Va l\'Argent - Bientôt disponible',
  description: 'On va enfin comprendre comment est dépensé l\'argent de nos impôts.',
}

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Où Va l\'Argent ? Tout ce que l\'État fait de nos impôts',
  description: 'Tout ce que l\'État fait de nos impôts. Dépenses publiques, dette, gaspillage : on décrypte.',
}

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

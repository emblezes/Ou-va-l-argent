'use client'

import { redirect } from 'next/navigation'

// Cette page n'est plus utilisée - redirection vers la vue d'ensemble
export default function CategoryPage() {
  redirect('/depenses')
}

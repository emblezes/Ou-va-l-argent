'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-[1] px-4 lg:px-8 py-8 border-t border-glass-border">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-text-muted text-xs">
          <Link href="/mentions-legales" className="hover:text-accent-electric transition-colors">
            Mentions légales & Confidentialité
          </Link>
          <a href="mailto:contact@ouvalargent.com" className="hover:text-accent-electric transition-colors">
            Contact
          </a>
        </div>
        <div className="text-text-muted text-xs text-center">
          © {new Date().getFullYear()} Où Va l&apos;Argent ? — Emmanuel Blézès
        </div>
      </div>
    </footer>
  )
}

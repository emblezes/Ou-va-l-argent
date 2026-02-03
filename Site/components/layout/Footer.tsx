'use client'

import Link from 'next/link'
import { Logo } from './Logo'

const footerLinks = [
  { href: '/a-propos', label: 'À propos' },
  { href: '/methodologie', label: 'Méthodologie' },
  { href: '/sources', label: 'Sources' },
  { href: '/api', label: 'API' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="relative z-[1] px-4 lg:px-8 py-8 border-t border-glass-border">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
        <Logo />

        <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-muted no-underline text-sm transition-colors duration-300 hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="text-text-muted text-sm text-center lg:text-right">
          © 2025 Observatoire de la Dépense Publique
        </div>
      </div>
    </footer>
  )
}

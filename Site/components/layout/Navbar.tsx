'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'

// Sous-catégories de dépenses
const depensesCategories = [
  { href: '/depenses', label: 'Vue d\'ensemble', icon: '📊' },
  { href: '/depenses/retraites', label: 'Retraites', icon: '👴' },
  { href: '/depenses/sante', label: 'Santé', icon: '🏥' },
  { href: '/depenses/protection-sociale', label: 'Protection sociale', icon: '👨‍👩‍👧' },
  { href: '/depenses/politiques-sectorielles', label: 'Politiques sectorielles', icon: '🏗️' },
  { href: '/depenses/affaires-economiques', label: 'Affaires économiques', icon: '💼' },
  { href: '/depenses/services-publics', label: 'Services publics', icon: '🏛️' },
  { href: '/depenses/education', label: 'Éducation', icon: '🎓' },
  { href: '/depenses/defense', label: 'Défense', icon: '🛡️' },
  { href: '/depenses/dette', label: 'Charge de la dette', icon: '💳' },
  { href: '/depenses/securite', label: 'Ordre & Sécurité', icon: '👮' },
  { href: '/depenses/logement', label: 'Logement', icon: '🏠' },
  { href: '/depenses/culture', label: 'Culture & Loisirs', icon: '🎭' },
  { href: '/depenses/environnement', label: 'Environnement', icon: '🌱' },
]

const navLinks = [
  { href: '/depenses', label: 'Dépenses', hasDropdown: true },
  { href: '/dettes', label: 'Dette' },
  { href: '/impots', label: 'Impôts' },
  { href: '/simulateur', label: 'Simulateur Brut vs Net' },
  { href: '/wtf', label: 'WTF?!' },
  { href: '/propositions', label: 'Je propose' },
]

const socialLinks = [
  {
    name: 'X',
    href: 'https://x.com/ouvalargent',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/ouvalargent',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/ouvalargent',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/ouvalargent',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [depensesDropdownOpen, setDepensesDropdownOpen] = useState(false)
  const [mobileDepensesOpen, setMobileDepensesOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDepensesDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const isDepensesPage = pathname?.startsWith('/depenses')

  // Determine logo variant based on current page
  const getLogoVariant = () => {
    if (isDepensesPage) return 'electric'
    if (pathname === '/dettes') return 'red'
    if (pathname === '/impots') return 'gold'
    if (pathname === '/wtf') return 'red'
    if (pathname === '/propositions') return 'purple'
    return 'electric'
  }

  // Get logo icon based on page
  const getLogoIcon = () => {
    if (pathname === '/wtf') return '🤯'
    if (pathname === '/propositions') return '💡'
    return '€'
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] px-4 lg:px-8 py-3 flex justify-between items-center transition-all duration-400 ${
        scrolled || pathname !== '/'
          ? 'bg-glass backdrop-blur-xl border-b border-glass-border'
          : 'bg-gradient-to-b from-bg-deep to-transparent'
      }`}
    >
      <Logo variant={getLogoVariant()} icon={getLogoIcon()} />

      {/* Desktop Navigation */}
      <ul className="hidden lg:flex gap-6 list-none">
        {navLinks.map((link) => (
          <li key={link.href} className="relative">
            {link.hasDropdown ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDepensesDropdownOpen(!depensesDropdownOpen)}
                  className={`text-text-secondary no-underline text-sm font-medium transition-colors duration-200 relative hover:text-text-primary flex items-center gap-1 ${
                    isDepensesPage ? 'text-text-primary' : ''
                  }`}
                >
                  {link.label}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${depensesDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {isDepensesPage && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent-electric" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {depensesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-bg-surface border border-glass-border rounded-xl shadow-xl overflow-hidden">
                    <div className="py-2 max-h-[70vh] overflow-y-auto">
                      {depensesCategories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setDepensesDropdownOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-bg-elevated ${
                            pathname === cat.href
                              ? 'text-accent-electric bg-accent-electric/10'
                              : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <span className="text-lg">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={link.href}
                className={`text-text-secondary no-underline text-sm font-medium transition-colors duration-200 relative hover:text-text-primary ${
                  pathname === link.href ? 'text-text-primary' : ''
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent-electric" />
                )}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Newsletter + Social (desktop) */}
      <div className="hidden lg:flex items-center gap-4">
        <form onSubmit={handleSubscribe} className="flex items-center gap-2">
          {subscribed ? (
            <span className="text-accent-green text-sm font-medium px-3 py-1.5">
              Merci !
            </span>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="w-36 px-3 py-1.5 bg-bg-surface border border-glass-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-electric transition-colors"
                required
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-accent-electric text-bg-deep text-sm font-semibold rounded-lg hover:bg-accent-electric/90 transition-colors"
              >
                Rejoindre
              </button>
            </>
          )}
        </form>

        <div className="flex items-center gap-1 pl-3 border-l border-glass-border">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-text-muted hover:text-accent-electric transition-colors"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-2 text-text-primary"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-glass backdrop-blur-xl border-b border-glass-border max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            <ul className="flex flex-col gap-2 mb-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setMobileDepensesOpen(!mobileDepensesOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-text-secondary text-base font-medium transition-colors duration-200 hover:bg-bg-elevated hover:text-text-primary ${
                          isDepensesPage ? 'text-accent-electric bg-accent-electric/10' : ''
                        }`}
                      >
                        <span>{link.label}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${mobileDepensesOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {mobileDepensesOpen && (
                        <div className="ml-4 mt-1 border-l-2 border-glass-border pl-2">
                          {depensesCategories.map((cat) => (
                            <Link
                              key={cat.href}
                              href={cat.href}
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setMobileDepensesOpen(false)
                              }}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                                pathname === cat.href
                                  ? 'text-accent-electric bg-accent-electric/10'
                                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                              }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-text-secondary no-underline text-base font-medium transition-colors duration-200 hover:bg-bg-elevated hover:text-text-primary ${
                        pathname === link.href ? 'text-accent-electric bg-accent-electric/10' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="border-t border-glass-border pt-4 mb-4">
              <p className="text-text-muted text-sm mb-3">Rejoignez la communauté</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                {subscribed ? (
                  <span className="text-accent-green text-sm font-medium py-2">
                    Merci ! Vous êtes inscrit.
                  </span>
                ) : (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre email"
                      className="flex-1 px-4 py-2.5 bg-bg-surface border border-glass-border rounded-lg text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-electric transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-accent-electric text-bg-deep font-semibold rounded-lg hover:bg-accent-electric/90 transition-colors"
                    >
                      OK
                    </button>
                  </>
                )}
              </form>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2 border-t border-glass-border">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-text-muted hover:text-accent-electric transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

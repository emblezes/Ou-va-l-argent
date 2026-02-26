'use client'

import Link from 'next/link'

interface LogoProps {
  variant?: 'default' | 'electric' | 'gold' | 'red' | 'purple' | 'orange'
  icon?: string
  showText?: boolean
}

const variantColors = {
  default: 'text-accent-electric',
  electric: 'text-accent-electric',
  gold: 'text-accent-gold',
  red: 'text-accent-red',
  purple: 'text-accent-purple',
  orange: 'text-accent-orange',
}

export function Logo({ variant = 'default', icon = '€', showText = true }: LogoProps) {
  const isEmoji = icon !== '€'
  return (
    <Link href="/" className="flex items-center gap-[10px] no-underline text-text-primary">
      {isEmoji ? (
        <span className="text-[48px] leading-none">{icon}</span>
      ) : (
        <span className={`font-serif text-[72px] leading-none ${variantColors[variant]}`}>€</span>
      )}
      {showText && <span className="font-serif text-[36px] italic text-text-primary leading-none">Où Va l&apos;Argent ?</span>}
    </Link>
  )
}

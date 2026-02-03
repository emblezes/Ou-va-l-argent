'use client'

import Link from 'next/link'

interface LogoProps {
  variant?: 'default' | 'electric' | 'gold' | 'red' | 'purple'
  icon?: string
  showText?: boolean
}

const variantStyles = {
  default: 'bg-gradient-to-br from-accent-electric to-[#0099cc]',
  electric: 'bg-gradient-to-br from-accent-electric to-[#0099cc]',
  gold: 'bg-gradient-to-br from-accent-gold to-[#cc9900]',
  red: 'bg-gradient-to-br from-accent-red to-[#cc3344]',
  purple: 'bg-gradient-to-br from-accent-purple to-[#7c3aed]',
}

export function Logo({ variant = 'default', icon = '€', showText = true }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-3 font-bold text-lg tracking-tight no-underline text-text-primary">
      <div
        className={`w-9 h-9 ${variantStyles[variant]} rounded-lg flex items-center justify-center font-mono font-semibold text-sm`}
      >
        {icon}
      </div>
      {showText && <span>Où Va l&apos;Argent</span>}
    </Link>
  )
}

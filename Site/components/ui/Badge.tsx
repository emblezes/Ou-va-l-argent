'use client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'electric' | 'gold' | 'red' | 'green' | 'purple'
  icon?: string
  pulse?: boolean
  className?: string
}

const variantStyles = {
  default: 'bg-glass border-glass-border text-text-secondary',
  electric: 'bg-accent-electric/10 border-accent-electric/30 text-accent-electric',
  gold: 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold',
  red: 'bg-accent-red/10 border-accent-red/30 text-accent-red',
  green: 'bg-accent-green/10 border-accent-green/30 text-accent-green',
  purple: 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple',
}

export function Badge({ children, variant = 'default', icon, pulse, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${variantStyles[variant]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  )
}

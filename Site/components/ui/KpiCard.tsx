'use client'

interface KpiCardProps {
  icon: string
  label: string
  value: string
  subtext?: string
  color?: 'electric' | 'gold' | 'red' | 'green' | 'purple' | 'orange'
}

const colorStyles = {
  electric: 'text-accent-electric',
  gold: 'text-accent-gold',
  red: 'text-accent-red',
  green: 'text-accent-green',
  purple: 'text-accent-purple',
  orange: 'text-accent-orange',
}

const borderColors = {
  electric: 'before:bg-accent-electric',
  gold: 'before:bg-accent-gold',
  red: 'before:bg-accent-red',
  green: 'before:bg-accent-green',
  purple: 'before:bg-accent-purple',
  orange: 'before:bg-accent-orange',
}

export function KpiCard({ icon, label, value, subtext, color = 'electric' }: KpiCardProps) {
  return (
    <div
      className={`bg-bg-surface border border-glass-border rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-glass-border/30 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] ${borderColors[color]}`}
    >
      <div className="text-2xl mb-4">{icon}</div>
      <div className="text-xs text-text-muted uppercase tracking-wider mb-2">{label}</div>
      <div className={`font-mono text-3xl font-medium mb-1 ${colorStyles[color]}`}>{value}</div>
      {subtext && <div className="text-sm text-text-secondary">{subtext}</div>}
    </div>
  )
}

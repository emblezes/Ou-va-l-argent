'use client'

import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Set global defaults for Chart.js
ChartJS.defaults.color = '#8899a8'
ChartJS.defaults.font.family = "'Syne', sans-serif"
ChartJS.defaults.font.size = 14
ChartJS.defaults.devicePixelRatio = 2 // Force high-resolution rendering for Retina displays

interface ChartWrapperProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  source?: string
  className?: string
  height?: string
}

export function ChartWrapper({
  children,
  title,
  subtitle,
  source,
  className = '',
  height = '300px',
}: ChartWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className={`bg-bg-surface border border-glass-border rounded-2xl p-5 ${className}`}>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
        </div>
      </div>
      <div style={{ height }} className="relative">
        {isClient ? children : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-electric" />
          </div>
        )}
      </div>
      {source && (
        <p className="text-xs text-text-muted/60 mt-3 text-right">
          Source : {source}
        </p>
      )}
    </div>
  )
}

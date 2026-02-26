'use client'

import { STATS } from '@/lib/constants/budget'
import { Counter } from '@/components/ui/Counter'

export function StatsBar() {
  return (
    <section className="py-12 lg:py-16 px-4 border-y border-glass-border">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="text-center transition-transform duration-300 hover:scale-105"
            >
              <div className="font-mono text-5xl lg:text-6xl font-medium text-accent-electric mb-3">
                {stat.value}
              </div>
              <div className="text-text-primary text-xl lg:text-2xl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { TIMELINE_EVENTS } from '@/lib/constants/budget'

interface TimelineItemProps {
  event: typeof TIMELINE_EVENTS[0]
  index: number
  isLeft: boolean
}

function TimelineItem({ event, index, isLeft }: TimelineItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), index * 200)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (itemRef.current) {
      observer.observe(itemRef.current)
    }

    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={itemRef}
      className={`flex items-center gap-6 lg:gap-12 ${
        isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Content Card */}
      <div className="flex-1">
        <div
          className={`bg-bg-surface border border-glass-border rounded-xl p-4 ${
            isLeft ? 'lg:text-right' : 'lg:text-left'
          }`}
        >
          <span className="font-mono text-accent-electric text-lg lg:text-xl">{event.year}</span>
          <h3 className="font-semibold text-2xl lg:text-3xl mt-1 mb-2">{event.title}</h3>
          <p className="text-text-primary text-lg lg:text-xl mb-3">{event.description}</p>
          <span className="inline-block px-4 py-1.5 bg-accent-electric/10 border border-accent-electric/30 rounded-full font-mono text-accent-electric text-base">
            {event.stat}
          </span>
        </div>
      </div>

      {/* Center Dot */}
      <div className="relative hidden lg:flex flex-col items-center">
        <div className="w-4 h-4 bg-accent-electric rounded-full z-10" />
        <div className="w-0.5 h-full bg-glass-border absolute top-0" />
      </div>

      {/* Empty spacer for alignment */}
      <div className="flex-1 hidden lg:block" />
    </div>
  )
}

export function Timeline() {
  return (
    <section className="py-12 lg:py-16 px-4">
      <div className="max-w-[1800px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-[clamp(3rem,8vw,5rem)] font-normal mb-3">
            Comment en est-on <span className="italic text-accent-red">arrivé là</span> ?
          </h2>
          <p className="text-text-primary text-2xl lg:text-3xl max-w-4xl mx-auto">
            50 ans de déficits : de 15% à 117% du PIB
          </p>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col gap-6">
          {/* Center line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-glass-border -translate-x-1/2" />

          {TIMELINE_EVENTS.map((event, index) => (
            <TimelineItem
              key={event.year}
              event={event}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

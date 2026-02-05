import { Hero, BudgetGrid, StatsBar, Timeline, CallToAction, FAQ } from '@/components/sections'
import { ComingSoon } from '@/components/ComingSoon'

export default function HomePage() {
  const isComingSoon = process.env.COMING_SOON === 'true'

  if (isComingSoon) {
    return <ComingSoon />
  }

  return (
    <>
      <Hero />
      <StatsBar />
      <BudgetGrid />
      <Timeline />
      <CallToAction />
      <FAQ />
    </>
  )
}

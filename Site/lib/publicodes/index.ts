import Engine from 'publicodes'
import rules from './rules'

// Singleton pattern for Engine (expensive to instantiate)
let engineInstance: Engine | null = null

export function getEngine(): Engine {
  if (!engineInstance) {
    engineInstance = new Engine(rules)
  }
  return engineInstance
}

export function resetEngine(): void {
  engineInstance = null
}

export { rules }

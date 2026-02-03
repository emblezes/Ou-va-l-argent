'use client'

import Engine from 'publicodes'
import rules from './rules'
import type { SalaryCalculation } from './types'

// Create a new engine for each calculation to avoid state issues
function createEngine() {
  return new Engine(rules)
}

/**
 * Calculate all salary components using Publicodes
 */
export function calculerCotisations(
  brut: number,
  statut: 'cadre' | 'non-cadre'
): SalaryCalculation {
  const engine = createEngine()

  // Set the situation
  engine.setSituation({
    'salaire brut': brut,
    'statut cadre': statut === 'cadre' ? 'oui' : 'non',
  })

  // Helper to safely get numeric value
  const getValue = (rule: string): number => {
    const result = engine.evaluate(rule)
    return typeof result.nodeValue === 'number' ? result.nodeValue : 0
  }

  // Calculate all values
  const superBrut = getValue('super brut')
  const totalPatronales = getValue('cotisations patronales')
  const totalSalariales = getValue('cotisations salariales')
  const netAvantIR = getValue('net avant impôt')
  const impotRevenu = getValue('impôt sur le revenu mensuel')
  const tauxIR = getValue('taux effectif IR')
  const netApresIR = getValue('net après impôt')

  // Get detailed breakdown
  const detail = {
    patronales: {
      maladie: getValue('cotisations patronales . maladie'),
      vieillesse: getValue('cotisations patronales . vieillesse'),
      famille: getValue('cotisations patronales . famille'),
      chomage: getValue('cotisations patronales . chômage'),
      accidents: getValue('cotisations patronales . accidents'),
      autres: getValue('cotisations patronales . autres'),
      retraite_comp: getValue('cotisations patronales . retraite complémentaire'),
    },
    salariales: {
      vieillesse: getValue('cotisations salariales . vieillesse'),
      retraite_comp: getValue('cotisations salariales . retraite complémentaire'),
      csg_crds: getValue('cotisations salariales . csg crds'),
    },
  }

  return {
    brut,
    superBrut,
    totalPatronales,
    totalSalariales,
    netAvantIR,
    impotRevenu,
    tauxIR,
    netApresIR,
    detail,
  }
}

/**
 * Get distribution data for charts and cards
 */
export function getDistributionData(calc: SalaryCalculation, multiplier: number = 1) {
  return {
    retraite:
      (calc.detail.patronales.vieillesse +
        calc.detail.patronales.retraite_comp +
        calc.detail.salariales.vieillesse +
        calc.detail.salariales.retraite_comp) *
      multiplier,
    sante: calc.detail.patronales.maladie * multiplier,
    famille: calc.detail.patronales.famille * multiplier,
    chomage: calc.detail.patronales.chomage * multiplier,
    csg_crds: calc.detail.salariales.csg_crds * multiplier,
    ir: calc.impotRevenu * multiplier,
    accidents: calc.detail.patronales.accidents * multiplier,
    autres: calc.detail.patronales.autres * multiplier,
  }
}

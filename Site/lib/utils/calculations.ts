import { TAUX, PASS_MENSUEL } from '../constants/simulateur'

export interface SalaryCalculation {
  brut: number
  superBrut: number
  totalPatronales: number
  totalSalariales: number
  netAvantIR: number
  impotRevenu: number
  tauxIR: number
  netApresIR: number
  detail: {
    patronales: {
      maladie: number
      vieillesse: number
      famille: number
      chomage: number
      accidents: number
      autres: number
      retraite_comp: number
    }
    salariales: {
      vieillesse: number
      retraite_comp: number
      csg_crds: number
    }
  }
}

/**
 * Calculate all salary components from gross salary
 */
export function calculerCotisations(brut: number, statut: 'cadre' | 'non-cadre'): SalaryCalculation {
  const plafond = Math.min(brut, PASS_MENSUEL)

  // Cotisations patronales
  const patronales = {
    maladie: brut * TAUX.patronales.maladie,
    vieillesse: plafond * TAUX.patronales.vieillesse_plafonnee + brut * TAUX.patronales.vieillesse_deplafonnee,
    famille: brut * TAUX.patronales.allocations_familiales,
    chomage: brut * TAUX.patronales.chomage,
    accidents: brut * TAUX.patronales.accidents_travail,
    autres: brut * (TAUX.patronales.fnal + TAUX.patronales.formation + TAUX.patronales.csa),
    retraite_comp: brut * TAUX.patronales.retraite_complementaire * (statut === 'cadre' ? 1.3 : 1)
  }

  // Cotisations salariales
  const assiette_csg = brut * 0.9825
  const salariales = {
    vieillesse: plafond * TAUX.salariales.vieillesse_plafonnee + brut * TAUX.salariales.vieillesse_deplafonnee,
    retraite_comp: brut * TAUX.salariales.retraite_complementaire * (statut === 'cadre' ? 1.3 : 1),
    csg_crds: assiette_csg * TAUX.salariales.csg_crds
  }

  const totalPatronales = Object.values(patronales).reduce((a, b) => a + b, 0)
  const totalSalariales = Object.values(salariales).reduce((a, b) => a + b, 0)

  const netAvantIR = brut - totalSalariales

  // Calcul IR progressif (barème 2024 sur revenus 2023)
  const netImposableAnnuel = netAvantIR * 12 * 0.9 // Abattement 10% pour frais professionnels

  // Barème progressif par tranches
  const tranches = [
    { plafond: 11294, taux: 0 },
    { plafond: 28797, taux: 0.11 },
    { plafond: 82341, taux: 0.30 },
    { plafond: 177106, taux: 0.41 },
    { plafond: Infinity, taux: 0.45 }
  ]

  let impotAnnuel = 0
  let revenuRestant = netImposableAnnuel
  let plafondPrecedent = 0

  for (const tranche of tranches) {
    const montantDansTranche = Math.min(revenuRestant, tranche.plafond - plafondPrecedent)
    if (montantDansTranche > 0) {
      impotAnnuel += montantDansTranche * tranche.taux
      revenuRestant -= montantDansTranche
    }
    plafondPrecedent = tranche.plafond
    if (revenuRestant <= 0) break
  }

  const impotRevenu = impotAnnuel / 12
  const tauxIR = netAvantIR > 0 ? impotRevenu / netAvantIR : 0
  const netApresIR = netAvantIR - impotRevenu
  const superBrut = brut + totalPatronales

  return {
    brut,
    superBrut,
    totalPatronales,
    totalSalariales,
    netAvantIR,
    impotRevenu,
    tauxIR,
    netApresIR,
    detail: {
      patronales,
      salariales
    }
  }
}

/**
 * Get distribution data for charts and cards
 */
export function getDistributionData(calc: SalaryCalculation, multiplier: number = 1) {
  return {
    retraite: (calc.detail.patronales.vieillesse + calc.detail.patronales.retraite_comp +
               calc.detail.salariales.vieillesse + calc.detail.salariales.retraite_comp) * multiplier,
    sante: calc.detail.patronales.maladie * multiplier,
    famille: calc.detail.patronales.famille * multiplier,
    chomage: calc.detail.patronales.chomage * multiplier,
    csg_crds: calc.detail.salariales.csg_crds * multiplier,
    ir: calc.impotRevenu * multiplier,
    accidents: calc.detail.patronales.accidents * multiplier,
    autres: calc.detail.patronales.autres * multiplier,
  }
}

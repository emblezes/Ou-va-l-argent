/**
 * Client pour l'API de calcul des salaires
 * Appelle l'API route qui utilise publicodes côté serveur
 */

export interface SalaryResult {
  brut: number
  superBrut: number
  netAvantIR: number
  netApresIR: number
  totalPatronales: number
  totalSalariales: number
  impotRevenu: number
  tauxIR: number
  detail: {
    patronales: {
      maladie: number
      vieillesse: number
      famille: number
      chomage: number
      accidents: number
      retraite_comp: number
      autres: number
    }
    salariales: {
      vieillesse: number
      retraite_comp: number
      csg_crds: number
    }
  }
}

export async function calculerSalaire(
  brutMensuel: number,
  statut: 'cadre' | 'non-cadre'
): Promise<SalaryResult> {
  const response = await fetch(`/api/salaire?brut=${brutMensuel}&statut=${statut}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

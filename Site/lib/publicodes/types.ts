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

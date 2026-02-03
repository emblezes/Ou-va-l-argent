import { NextRequest, NextResponse } from 'next/server'
import Engine from 'publicodes'
import rules from 'modele-social'

// Instance du moteur publicodes (singleton pour performance)
let engine: Engine | null = null

function getEngine(): Engine {
  if (!engine) {
    engine = new Engine(rules)
  }
  return engine
}

function getValue(eng: Engine, rule: string): number {
  try {
    const result = eng.evaluate(rule)
    const value = result.nodeValue
    return typeof value === 'number' ? value : 0
  } catch {
    return 0
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const brut = parseFloat(searchParams.get('brut') || '3500')
  const statut = (searchParams.get('statut') || 'non-cadre') as 'cadre' | 'non-cadre'

  const eng = getEngine()

  // Configuration de la situation
  eng.setSituation({
    'dirigeant': 'non',
    'salarié . activité partielle': 'non',
    'salarié . contrat . statut cadre': statut === 'cadre' ? 'oui' : 'non',
    'salarié . contrat . salaire brut': `${brut} €/mois`,
    'impôt . méthode de calcul . par défaut': {
      'variations': [
        {
          'si': 'salarié . contrat . salaire brut <= 6000 €/mois',
          'alors': "'taux neutre'"
        },
        {
          'sinon': "'barème standard'"
        }
      ]
    }
  })

  // Récupérer les valeurs
  const netApresIR = getValue(eng, 'salarié . rémunération . net . payé après impôt')
  const superBrut = getValue(eng, 'salarié . coût total employeur')
  const netAvantIR = getValue(eng, 'salarié . rémunération . net . à payer avant impôt')
  const totalSalariales = getValue(eng, 'salarié . cotisations . salarié')
  const totalPatronales = getValue(eng, 'salarié . cotisations . employeur')

  const impotRevenu = netAvantIR - netApresIR
  const tauxIR = netAvantIR > 0 ? impotRevenu / netAvantIR : 0

  // Détails patronales (ordre inversé dans publicodes)
  const maladie = getValue(eng, 'salarié . cotisations . maladie . employeur')
  const vieillessePatronale = getValue(eng, 'salarié . cotisations . vieillesse . employeur')
  const famille = getValue(eng, 'salarié . cotisations . allocations familiales')
  const chomage = getValue(eng, 'salarié . cotisations . chômage')
  const accidents = getValue(eng, 'salarié . cotisations . ATMP')
  const retraiteCompPatronale = getValue(eng, 'salarié . cotisations . retraite complémentaire . employeur')

  // Détails salariales
  const vieillesse = getValue(eng, 'salarié . cotisations . vieillesse . salarié')
  const retraiteComp = getValue(eng, 'salarié . cotisations . retraite complémentaire . salarié')
  const csgCrds = getValue(eng, 'salarié . cotisations . CSG-CRDS')

  const autresPatronales = totalPatronales - maladie - vieillessePatronale - famille - chomage - accidents - retraiteCompPatronale

  return NextResponse.json({
    brut,
    superBrut,
    netAvantIR,
    netApresIR,
    totalPatronales,
    totalSalariales,
    impotRevenu,
    tauxIR,
    detail: {
      patronales: {
        maladie,
        vieillesse: vieillessePatronale,
        famille,
        chomage,
        accidents,
        retraite_comp: retraiteCompPatronale,
        autres: autresPatronales > 0 ? autresPatronales : 0,
      },
      salariales: {
        vieillesse,
        retraite_comp: retraiteComp,
        csg_crds: csgCrds,
      },
    },
  })
}

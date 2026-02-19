import { NextRequest, NextResponse } from 'next/server'

const URSSAF_API = 'https://mon-entreprise.urssaf.fr/api/v1/evaluate'

const EXPRESSIONS = [
  'salarié . coût total employeur',
  'salarié . rémunération . net . payé après impôt',
  'salarié . rémunération . net . à payer avant impôt',
  'salarié . cotisations . employeur',
  'salarié . cotisations . salarié',
  'salarié . cotisations . maladie . employeur',
  'salarié . cotisations . vieillesse . employeur',
  'salarié . cotisations . vieillesse . salarié',
  'salarié . cotisations . allocations familiales',
  'salarié . cotisations . chômage',
  'salarié . cotisations . ATMP',
  'salarié . cotisations . retraite complémentaire . employeur',
  'salarié . cotisations . retraite complémentaire . salarié',
  'salarié . cotisations . CSG-CRDS',
  'salarié . cotisations . exonérations',
]

async function callUrssafAPI(brut: number, statut: 'cadre' | 'non-cadre') {
  const body = {
    situation: {
      'salarié . contrat . salaire brut': `${brut} €/mois`,
      'salarié . contrat . statut cadre': statut === 'cadre' ? 'oui' : 'non',
      'dirigeant': 'non',
      'impôt . méthode de calcul': "'taux neutre'",
    },
    expressions: EXPRESSIONS,
  }

  const response = await fetch(URSSAF_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  })

  if (!response.ok) {
    throw new Error(`URSSAF API: ${response.status}`)
  }

  const data = await response.json()

  if (!data.evaluate || data.evaluate.length !== EXPRESSIONS.length) {
    throw new Error('URSSAF API: unexpected response format')
  }

  const val = (i: number): number => {
    const v = data.evaluate[i].nodeValue
    return typeof v === 'number' ? Math.round(v * 100) / 100 : 0
  }

  const superBrut = val(0)
  const netApresIR = val(1)
  const netAvantIR = val(2)
  const totalPatronales = val(3)
  const totalSalariales = val(4)
  const maladie = val(5)
  const vieillessePatronale = val(6)
  const vieillesse = val(7)
  const famille = val(8)
  const chomage = val(9)
  const accidents = val(10)
  const retraiteCompPatronale = val(11)
  const retraiteComp = val(12)
  const csgCrds = val(13)
  const exonerations = val(14)

  const impotRevenu = Math.round((netAvantIR - netApresIR) * 100) / 100
  const tauxIR = netAvantIR > 0 ? impotRevenu / netAvantIR : 0
  // Les items individuels sont aux taux pleins, le total est après exonération
  // "autres" = total - items connus (sera négatif si exonérations > autres cotisations mineures)
  const sumKnownPatronales = maladie + vieillessePatronale + famille + chomage + accidents + retraiteCompPatronale
  const autresPatronales = Math.max(0,
    Math.round((totalPatronales + exonerations - sumKnownPatronales) * 100) / 100
  )

  return {
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
        autres: autresPatronales,
        exonerations,
      },
      salariales: {
        vieillesse,
        retraite_comp: retraiteComp,
        csg_crds: csgCrds,
      },
    },
  }
}

// Fallback local avec modele-social (en cas d'indisponibilité de l'API URSSAF)
async function fallbackLocal(brut: number, statut: 'cadre' | 'non-cadre') {
  const Engine = (await import('publicodes')).default
  const rules = (await import('modele-social')).default

  const eng = new Engine(rules)

  eng.setSituation({
    'dirigeant': 'non',
    'salarié . contrat . statut cadre': statut === 'cadre' ? 'oui' : 'non',
    'salarié . contrat . salaire brut': `${brut} €/mois`,
    'impôt . méthode de calcul': "'taux neutre'",
  })

  const getValue = (rule: string): number => {
    try {
      const result = eng.evaluate(rule)
      const value = result.nodeValue
      return typeof value === 'number' ? Math.round(value * 100) / 100 : 0
    } catch {
      return 0
    }
  }

  const superBrut = getValue('salarié . coût total employeur')
  const netApresIR = getValue('salarié . rémunération . net . payé après impôt')
  const netAvantIR = getValue('salarié . rémunération . net . à payer avant impôt')
  const totalPatronales = getValue('salarié . cotisations . employeur')
  const totalSalariales = getValue('salarié . cotisations . salarié')
  const maladie = getValue('salarié . cotisations . maladie . employeur')
  const vieillessePatronale = getValue('salarié . cotisations . vieillesse . employeur')
  const famille = getValue('salarié . cotisations . allocations familiales')
  const chomage = getValue('salarié . cotisations . chômage')
  const accidents = getValue('salarié . cotisations . ATMP')
  const retraiteCompPatronale = getValue('salarié . cotisations . retraite complémentaire . employeur')
  const vieillesse = getValue('salarié . cotisations . vieillesse . salarié')
  const retraiteComp = getValue('salarié . cotisations . retraite complémentaire . salarié')
  const csgCrds = getValue('salarié . cotisations . CSG-CRDS')
  const exonerations = getValue('salarié . cotisations . exonérations')

  const impotRevenu = Math.round((netAvantIR - netApresIR) * 100) / 100
  const tauxIR = netAvantIR > 0 ? impotRevenu / netAvantIR : 0
  const sumKnownPatronales = maladie + vieillessePatronale + famille + chomage + accidents + retraiteCompPatronale
  const autresPatronales = Math.max(0,
    Math.round((totalPatronales + exonerations - sumKnownPatronales) * 100) / 100
  )

  return {
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
        autres: autresPatronales,
        exonerations,
      },
      salariales: {
        vieillesse,
        retraite_comp: retraiteComp,
        csg_crds: csgCrds,
      },
    },
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const brut = parseFloat(searchParams.get('brut') || '3500')
  const statut = (searchParams.get('statut') || 'non-cadre') as 'cadre' | 'non-cadre'

  try {
    const result = await callUrssafAPI(brut, statut)
    return NextResponse.json(result)
  } catch (error) {
    console.warn('URSSAF API indisponible, fallback local:', (error as Error).message)
    try {
      const result = await fallbackLocal(brut, statut)
      return NextResponse.json(result)
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Calcul impossible' },
        { status: 500 }
      )
    }
  }
}

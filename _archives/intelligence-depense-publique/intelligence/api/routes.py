"""FastAPI backend for the IDP dashboard.

Serves data to the Next.js frontend via REST API.
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import fetch_all, fetch_one

app = FastAPI(
    title="IDP — Intelligence de la Dépense Publique",
    description="API d'analyse de la dépense publique française",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://ouvalargent.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Dashboard — Overview stats
# ============================================================

@app.get("/api/intelligence/stats")
async def get_stats():
    """Global statistics for the dashboard."""
    contracts = fetch_one("SELECT COUNT(*) as count, SUM(amount)/100 as total FROM contracts")
    communes = fetch_one("SELECT COUNT(*) as count FROM communes")
    subventions = fetch_one("SELECT COUNT(*) as count, SUM(amount_granted)/100 as total FROM subventions")
    anomalies = fetch_one("SELECT COUNT(*) as count FROM anomalies")
    budget_etat = fetch_one("SELECT COUNT(*) as count, SUM(execution)/100 as total FROM budget_etat WHERE budget_type = 'CP'")
    protection_sociale = fetch_one("""
        SELECT COUNT(*) as count, SUM(depenses)/100 as total
        FROM protection_sociale
        WHERE regime = 'Total tous régimes'
          AND poste IN ('SANTÉ', 'VIEILLESSE-SURVIE', 'FAMILLE', 'EMPLOI',
                        'PAUVRETÉ-EXCLUSION SOCIALE', 'LOGEMENT')
    """)
    cofog = fetch_one("SELECT COUNT(*) as count FROM depense_publique_cofog")

    return {
        "contracts": {
            "count": contracts["count"] if contracts else 0,
            "total_eur": float(contracts["total"] or 0) if contracts else 0,
        },
        "communes": communes["count"] if communes else 0,
        "subventions": {
            "count": subventions["count"] if subventions else 0,
            "total_eur": float(subventions["total"] or 0) if subventions else 0,
        },
        "anomalies": anomalies["count"] if anomalies else 0,
        "budget_etat": {
            "count": budget_etat["count"] if budget_etat else 0,
            "total_eur": float(budget_etat["total"] or 0) if budget_etat else 0,
        },
        "protection_sociale": {
            "count": protection_sociale["count"] if protection_sociale else 0,
            "total_eur": float(protection_sociale["total"] or 0) if protection_sociale else 0,
        },
        "cofog_records": cofog["count"] if cofog else 0,
    }


# ============================================================
# Contracts — Marchés publics
# ============================================================

@app.get("/api/intelligence/contracts")
async def list_contracts(
    buyer: Optional[str] = None,
    winner: Optional[str] = None,
    cpv: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    year: Optional[int] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """List and filter public procurement contracts."""
    conditions = []
    params = []

    if buyer:
        conditions.append("(buyer_name ILIKE %s OR buyer_siret = %s)")
        params.extend([f"%{buyer}%", buyer])
    if winner:
        conditions.append("(winner_name ILIKE %s OR winner_siret = %s)")
        params.extend([f"%{winner}%", winner])
    if cpv:
        conditions.append("cpv_code LIKE %s")
        params.append(f"{cpv}%")
    if min_amount:
        conditions.append("amount >= %s")
        params.append(int(min_amount * 100))
    if max_amount:
        conditions.append("amount <= %s")
        params.append(int(max_amount * 100))
    if year:
        conditions.append("EXTRACT(YEAR FROM publication_date) = %s")
        params.append(year)

    where = " AND ".join(conditions) if conditions else "TRUE"
    offset = (page - 1) * per_page

    # Count
    count = fetch_one(f"SELECT COUNT(*) as total FROM contracts WHERE {where}", params)
    total = count["total"] if count else 0

    # Fetch page
    rows = fetch_all(
        f"""SELECT id, boamp_id, title, contract_type, cpv_code, cpv_label,
                   buyer_name, buyer_siret, winner_name, winner_siret,
                   amount/100.0 as amount_eur, duration_months,
                   publication_date, nb_offers
            FROM contracts WHERE {where}
            ORDER BY publication_date DESC NULLS LAST
            LIMIT %s OFFSET %s""",
        params + [per_page, offset]
    )

    return {
        "data": rows,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page if per_page else 0,
    }


# ============================================================
# Communes — Budget analysis
# ============================================================

@app.get("/api/intelligence/communes")
async def list_communes(
    name: Optional[str] = None,
    department: Optional[str] = None,
    min_population: Optional[int] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """List communes with their latest budget data."""
    conditions = []
    params = []

    if name:
        conditions.append("c.name ILIKE %s")
        params.append(f"%{name}%")
    if department:
        conditions.append("c.department_code = %s")
        params.append(department)
    if min_population:
        conditions.append("c.population >= %s")
        params.append(min_population)

    where = " AND ".join(conditions) if conditions else "TRUE"
    offset = (page - 1) * per_page

    count = fetch_one(f"SELECT COUNT(*) as total FROM communes c WHERE {where}", params)
    total = count["total"] if count else 0

    rows = fetch_all(
        f"""SELECT c.code_insee, c.name, c.department_code, c.population,
                   c.strate, c.epci_name,
                   cb.exp_total/100.0 as exp_eur,
                   cb.exp_per_capita, cb.debt_per_capita, cb.savings_rate
            FROM communes c
            LEFT JOIN commune_budgets cb ON cb.code_insee = c.code_insee
                AND cb.year = (SELECT MAX(year) FROM commune_budgets WHERE code_insee = c.code_insee)
            WHERE {where}
            ORDER BY c.population DESC NULLS LAST
            LIMIT %s OFFSET %s""",
        params + [per_page, offset]
    )

    return {"data": rows, "total": total, "page": page, "per_page": per_page}


@app.get("/api/intelligence/communes/{code_insee}")
async def get_commune(code_insee: str):
    """Get detailed commune data with budget history."""
    commune = fetch_one(
        "SELECT * FROM communes WHERE code_insee = %s", (code_insee,)
    )
    if not commune:
        raise HTTPException(status_code=404, detail="Commune non trouvée")

    budgets = fetch_all(
        """SELECT year, rev_total/100.0 as rev_eur, exp_total/100.0 as exp_eur,
                  exp_personnel/100.0 as personnel_eur,
                  debt_total/100.0 as debt_eur,
                  debt_per_capita, exp_per_capita, savings_rate, population
           FROM commune_budgets
           WHERE code_insee = %s ORDER BY year""",
        (code_insee,)
    )

    anomalies = fetch_all(
        """SELECT * FROM anomalies
           WHERE entity_type = 'commune_budget'
             AND entity_id IN (SELECT id FROM commune_budgets WHERE code_insee = %s)
           ORDER BY score DESC""",
        (code_insee,)
    )

    return {
        "commune": commune,
        "budgets": budgets,
        "anomalies": anomalies,
    }


# ============================================================
# Anomalies
# ============================================================

@app.get("/api/intelligence/anomalies")
async def list_anomalies(
    entity_type: Optional[str] = None,
    severity: Optional[str] = None,
    detector: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """List detected anomalies with filtering."""
    conditions = []
    params = []

    if entity_type:
        conditions.append("entity_type = %s")
        params.append(entity_type)
    if severity:
        conditions.append("severity = %s")
        params.append(severity)
    if detector:
        conditions.append("detector = %s")
        params.append(detector)

    where = " AND ".join(conditions) if conditions else "TRUE"
    offset = (page - 1) * per_page

    count = fetch_one(f"SELECT COUNT(*) as total FROM anomalies WHERE {where}", params)
    total = count["total"] if count else 0

    rows = fetch_all(
        f"""SELECT id, entity_type, entity_id, detector, anomaly_type,
                   score, severity, description, details, created_at
            FROM anomalies WHERE {where}
            ORDER BY score DESC
            LIMIT %s OFFSET %s""",
        params + [per_page, offset]
    )

    return {"data": rows, "total": total, "page": page, "per_page": per_page}


# ============================================================
# Budget de l'État (LOLF)
# ============================================================

@app.get("/api/intelligence/budget-etat")
async def list_budget_etat(
    year: Optional[int] = None,
    mission: Optional[str] = None,
    programme: Optional[str] = None,
    budget_type: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """Budget de l'État par mission/programme LOLF."""
    conditions = []
    params = []

    if year:
        conditions.append("year = %s")
        params.append(year)
    if mission:
        conditions.append("mission ILIKE %s")
        params.append(f"%{mission}%")
    if programme:
        conditions.append("programme ILIKE %s")
        params.append(f"%{programme}%")
    if budget_type:
        conditions.append("budget_type = %s")
        params.append(budget_type)

    where = " AND ".join(conditions) if conditions else "TRUE"
    offset = (page - 1) * per_page

    count = fetch_one(f"SELECT COUNT(*) as total FROM budget_etat WHERE {where}", params)
    total = count["total"] if count else 0

    rows = fetch_all(
        f"""SELECT id, year, mission, programme, action, budget_type,
                   lfi/100.0 as lfi_eur, execution/100.0 as execution_eur,
                   ecart_pct
            FROM budget_etat WHERE {where}
            ORDER BY execution DESC NULLS LAST
            LIMIT %s OFFSET %s""",
        params + [per_page, offset]
    )

    # Summary by mission
    summary = fetch_all(
        f"""SELECT mission,
                   SUM(execution)/100.0 as total_execution_eur,
                   SUM(lfi)/100.0 as total_lfi_eur,
                   COUNT(*) as nb_lignes
            FROM budget_etat WHERE {where}
            GROUP BY mission ORDER BY SUM(execution) DESC NULLS LAST""",
        params
    )

    return {
        "data": rows,
        "summary": summary,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


# ============================================================
# Protection sociale (DREES)
# ============================================================

@app.get("/api/intelligence/protection-sociale")
async def list_protection_sociale(
    year: Optional[int] = None,
    branche: Optional[str] = None,
    regime: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """Comptes de la protection sociale par branche."""
    conditions = []
    params = []

    if year:
        conditions.append("year = %s")
        params.append(year)
    if branche:
        conditions.append("branche ILIKE %s")
        params.append(f"%{branche}%")
    if regime:
        conditions.append("regime ILIKE %s")
        params.append(f"%{regime}%")

    where = " AND ".join(conditions) if conditions else "TRUE"
    offset = (page - 1) * per_page

    count = fetch_one(f"SELECT COUNT(*) as total FROM protection_sociale WHERE {where}", params)
    total = count["total"] if count else 0

    rows = fetch_all(
        f"""SELECT id, year, branche, regime, poste,
                   recettes/100.0 as recettes_eur,
                   depenses/100.0 as depenses_eur,
                   solde/100.0 as solde_eur
            FROM protection_sociale WHERE {where}
            ORDER BY depenses DESC NULLS LAST
            LIMIT %s OFFSET %s""",
        params + [per_page, offset]
    )

    # Summary by top-level risk category (avoid double-counting)
    # Use 'Total tous régimes' + the 6 top-level UPPERCASE postes
    TOP_POSTES = ('SANTÉ', 'VIEILLESSE-SURVIE', 'FAMILLE', 'EMPLOI',
                  'PAUVRETÉ-EXCLUSION SOCIALE', 'LOGEMENT')
    top_placeholders = ",".join(["%s"] * len(TOP_POSTES))
    summary = fetch_all(
        f"""SELECT poste as branche,
                   depenses/100.0 as total_depenses_eur,
                   recettes/100.0 as total_recettes_eur,
                   solde/100.0 as total_solde_eur
            FROM protection_sociale
            WHERE regime = 'Total tous régimes'
              AND poste IN ({top_placeholders})
              AND (year = %s OR %s IS NULL)
            ORDER BY depenses DESC NULLS LAST""",
        list(TOP_POSTES) + [year if year else None, year if year else None]
    )

    return {
        "data": rows,
        "summary": summary,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


# ============================================================
# Dépense publique globale (vue consolidée)
# ============================================================

@app.get("/api/intelligence/depense-globale")
async def depense_globale(year: int = Query(2023)):
    """Vue consolidée des 4 piliers de la dépense publique."""
    # Pilier 1: État
    etat = fetch_one(
        """SELECT SUM(execution)/100.0 as total, COUNT(DISTINCT mission) as missions
           FROM budget_etat WHERE year = %s AND budget_type = 'CP'""",
        (year,)
    )

    # Top missions
    etat_missions = fetch_all(
        """SELECT mission, SUM(execution)/100.0 as total
           FROM budget_etat WHERE year = %s AND budget_type = 'CP'
           GROUP BY mission ORDER BY SUM(execution) DESC LIMIT 10""",
        (year,)
    )

    # Pilier 2: Sécurité sociale (use top-level postes to avoid double-counting)
    TOP_POSTES = ('SANTÉ', 'VIEILLESSE-SURVIE', 'FAMILLE', 'EMPLOI',
                  'PAUVRETÉ-EXCLUSION SOCIALE', 'LOGEMENT')
    top_ph = ",".join(["%s"] * len(TOP_POSTES))
    secu = fetch_one(
        f"""SELECT SUM(depenses)/100.0 as total, SUM(recettes)/100.0 as recettes,
                  SUM(solde)/100.0 as solde
           FROM protection_sociale
           WHERE year = %s AND regime = 'Total tous régimes'
             AND poste IN ({top_ph})""",
        (year,) + TOP_POSTES
    )

    secu_branches = fetch_all(
        f"""SELECT poste as branche, depenses/100.0 as depenses, solde/100.0 as solde
           FROM protection_sociale
           WHERE year = %s AND regime = 'Total tous régimes'
             AND poste IN ({top_ph})
           ORDER BY depenses DESC""",
        (year,) + TOP_POSTES
    )

    # Pilier 3: Collectivités
    collectivites = fetch_one(
        """SELECT SUM(exp_total)/100.0 as total, COUNT(*) as communes
           FROM commune_budgets WHERE year = %s""",
        (year,)
    )

    # COFOG for reference + historical
    cofog_france = fetch_all(
        """SELECT cofog_code, cofog_label, amount/100.0 as amount_eur, pct_gdp
           FROM depense_publique_cofog
           WHERE country_code = 'FRA' AND year = %s
           ORDER BY cofog_code""",
        (year,)
    )

    cofog_history = fetch_all(
        """SELECT year, amount/100.0 as total_eur, pct_gdp
           FROM depense_publique_cofog
           WHERE country_code = 'FRA' AND cofog_code = 'TOTAL'
           ORDER BY year""",
    )

    return {
        "year": year,
        "pillars": {
            "etat": {
                "total_eur": float(etat["total"] or 0) if etat else 0,
                "missions": etat["missions"] if etat else 0,
                "top_missions": etat_missions,
            },
            "securite_sociale": {
                "total_eur": float(secu["total"] or 0) if secu else 0,
                "recettes_eur": float(secu["recettes"] or 0) if secu else 0,
                "solde_eur": float(secu["solde"] or 0) if secu else 0,
                "branches": secu_branches,
            },
            "collectivites": {
                "total_eur": float(collectivites["total"] or 0) if collectivites else 0,
                "communes": collectivites["communes"] if collectivites else 0,
            },
        },
        "cofog": cofog_france,
        "history": cofog_history,
    }


# ============================================================
# Comparaison internationale (COFOG)
# ============================================================

@app.get("/api/intelligence/comparaison")
async def comparaison_internationale(
    year: int = Query(2022),
    cofog_code: str = Query("TOTAL"),
    countries: Optional[str] = Query(None, description="Codes ISO3 séparés par virgules"),
):
    """Benchmarks internationaux de dépense publique."""
    country_list = countries.split(",") if countries else ["FRA", "DEU", "ITA", "ESP", "NLD", "BEL", "EU"]

    placeholders = ",".join(["%s"] * len(country_list))
    params = [year, cofog_code] + country_list

    rows = fetch_all(
        f"""SELECT country_code, cofog_code, cofog_label,
                   amount/100.0 as amount_eur, pct_gdp
            FROM depense_publique_cofog
            WHERE year = %s AND cofog_code = %s
              AND country_code IN ({placeholders})
            ORDER BY pct_gdp DESC NULLS LAST""",
        params
    )

    # Also get all COFOG categories for France to show breakdown
    france_detail = fetch_all(
        """SELECT cofog_code, cofog_label, amount/100.0 as amount_eur, pct_gdp
           FROM depense_publique_cofog
           WHERE year = %s AND country_code = 'FRA'
           ORDER BY cofog_code""",
        (year,)
    )

    return {
        "year": year,
        "cofog_code": cofog_code,
        "ranking": rows,
        "france_detail": france_detail,
    }


# ============================================================
# Search — Semantic search across documents
# ============================================================

class SearchQuery(BaseModel):
    query: str
    top_k: int = 5
    source_type: Optional[str] = None


@app.post("/api/intelligence/search")
async def semantic_search(body: SearchQuery):
    """Semantic search across indexed documents."""
    from embeddings.indexer import DocumentIndexer

    indexer = DocumentIndexer()
    results = indexer.search(body.query, top_k=body.top_k, source_type=body.source_type)
    return {"results": results}


# ============================================================
# Agent — Chat with the AI analyst
# ============================================================

class ChatQuery(BaseModel):
    query: str
    conversation_id: Optional[str] = None


@app.post("/api/intelligence/chat")
async def chat_with_agent(body: ChatQuery):
    """Chat with the IDP AI analyst."""
    from agents.orchestrator import chat

    response = chat(body.query)
    return {"response": response}


# ============================================================
# Ingestion status
# ============================================================

@app.get("/api/intelligence/ingestion")
async def ingestion_status():
    """Get latest ingestion status for all sources."""
    rows = fetch_all("""
        SELECT DISTINCT ON (source)
               source, started_at, finished_at, status,
               records_fetched, records_inserted, records_updated, error_message
        FROM ingestion_log
        ORDER BY source, started_at DESC
    """)
    return {"sources": rows}


# ============================================================
# Run server
# ============================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

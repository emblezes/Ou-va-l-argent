"""Orchestrator agent — Main Claude-powered agent for public spending analysis.

Routes user queries to specialized agents and synthesizes results.
"""

import os
import json
import argparse
from anthropic import Anthropic

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import fetch_all, fetch_one

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """Tu es l'IA d'analyse de la dépense publique française "Où Va l'Argent".
Tu couvres l'intégralité de la dépense publique (~1 600 Md€/an, 57% du PIB) répartie en 4 piliers :
1. État (budget LOLF) : ~500 Md€ — missions, programmes, actions
2. Sécurité sociale : ~650 Md€ — maladie, vieillesse, famille, emploi
3. Collectivités locales : ~300 Md€ — 37 000 communes (OFGL)
4. Opérateurs de l'État : ~80 Md€

Tu as accès à une base de données contenant :
- Le budget de l'État par mission/programme LOLF (AE et CP, LFI vs exécution)
- Les comptes de la protection sociale par branche (DREES)
- Les dépenses publiques par fonction COFOG (Eurostat) + comparaison UE
- Les marchés publics (BOAMP) : contrats, montants, acheteurs, attributaires
- Les comptes des 37 000 communes françaises (OFGL) : budgets, dettes, dépenses
- Les subventions de l'État : bénéficiaires, montants, programmes
- Le référentiel Sirene : 25M d'entreprises françaises
- Des séries économiques (Banque de France, Eurostat)

Outils disponibles :
1. query_contracts — Rechercher dans les marchés publics
2. query_budgets — Analyser les budgets communaux
3. query_subventions — Rechercher les subventions
4. query_anomalies — Consulter les anomalies détectées
5. query_entity — Rechercher une entreprise ou organisme
6. compare_communes — Comparer des communes entre elles
7. query_budget_etat — Interroger le budget de l'État (LOLF)
8. query_protection_sociale — Interroger les comptes sociaux
9. query_depense_cofog — Vue consolidée par fonction + comparaison internationale
10. vue_globale — Synthèse des 4 piliers pour une année
11. compare_international — Benchmark dépense publique entre pays
12. evolution_depense — Tendance historique d'un indicateur

Réponds toujours en français avec des chiffres précis et sourcés.
Quand tu identifies un montant anormal, explique pourquoi il est suspect.
"""

# Tool definitions for Claude
TOOLS = [
    {
        "name": "query_contracts",
        "description": "Recherche dans les marchés publics. Filtres: buyer (acheteur), winner (attributaire), cpv (catégorie), min_amount/max_amount (en euros), year.",
        "input_schema": {
            "type": "object",
            "properties": {
                "buyer": {"type": "string", "description": "Nom ou SIRET de l'acheteur"},
                "winner": {"type": "string", "description": "Nom ou SIRET de l'attributaire"},
                "cpv": {"type": "string", "description": "Code CPV ou préfixe"},
                "min_amount": {"type": "number", "description": "Montant minimum en euros"},
                "max_amount": {"type": "number", "description": "Montant maximum en euros"},
                "year": {"type": "integer", "description": "Année de publication"},
                "limit": {"type": "integer", "description": "Nombre max de résultats", "default": 20},
            },
        },
    },
    {
        "name": "query_budgets",
        "description": "Analyse le budget d'une commune par code INSEE ou nom.",
        "input_schema": {
            "type": "object",
            "properties": {
                "code_insee": {"type": "string"},
                "name": {"type": "string", "description": "Nom de la commune (recherche floue)"},
                "year": {"type": "integer", "default": 2023},
            },
        },
    },
    {
        "name": "query_subventions",
        "description": "Recherche les subventions par bénéficiaire, programme ou ministère.",
        "input_schema": {
            "type": "object",
            "properties": {
                "recipient": {"type": "string", "description": "Nom ou SIRET du bénéficiaire"},
                "program": {"type": "string", "description": "Programme LOLF"},
                "ministry": {"type": "string"},
                "min_amount": {"type": "number"},
                "year": {"type": "integer"},
                "limit": {"type": "integer", "default": 20},
            },
        },
    },
    {
        "name": "query_anomalies",
        "description": "Consulte les anomalies détectées par les modèles ML.",
        "input_schema": {
            "type": "object",
            "properties": {
                "entity_type": {"type": "string", "enum": ["contract", "commune_budget", "subvention"]},
                "severity": {"type": "string", "enum": ["low", "medium", "high", "critical"]},
                "limit": {"type": "integer", "default": 20},
            },
        },
    },
    {
        "name": "query_entity",
        "description": "Recherche une entreprise ou organisme par nom ou SIREN/SIRET.",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "siren": {"type": "string"},
                "siret": {"type": "string"},
            },
        },
    },
    {
        "name": "compare_communes",
        "description": "Compare 2+ communes sur leurs indicateurs budgétaires.",
        "input_schema": {
            "type": "object",
            "properties": {
                "codes_insee": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Liste de codes INSEE à comparer",
                },
                "year": {"type": "integer", "default": 2023},
            },
            "required": ["codes_insee"],
        },
    },
    {
        "name": "query_budget_etat",
        "description": "Interroge le budget de l'État (LOLF) par mission, programme, action. Montre LFI vs exécution.",
        "input_schema": {
            "type": "object",
            "properties": {
                "year": {"type": "integer", "description": "Année budgétaire"},
                "mission": {"type": "string", "description": "Nom de la mission (recherche floue)"},
                "programme": {"type": "string", "description": "Nom du programme"},
                "budget_type": {"type": "string", "enum": ["AE", "CP"], "description": "Type de crédits"},
                "limit": {"type": "integer", "default": 20},
            },
        },
    },
    {
        "name": "query_protection_sociale",
        "description": "Interroge les comptes de la protection sociale (maladie, vieillesse, famille, emploi).",
        "input_schema": {
            "type": "object",
            "properties": {
                "year": {"type": "integer", "description": "Année"},
                "branche": {"type": "string", "description": "Branche: maladie, vieillesse, famille, emploi, AT-MP"},
                "regime": {"type": "string", "description": "Régime: général, complémentaire, etc."},
                "limit": {"type": "integer", "default": 20},
            },
        },
    },
    {
        "name": "query_depense_cofog",
        "description": "Vue consolidée des dépenses publiques par fonction COFOG. Permet la comparaison internationale.",
        "input_schema": {
            "type": "object",
            "properties": {
                "year": {"type": "integer", "description": "Année"},
                "country_codes": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Codes pays ISO3 (FRA, DEU, ITA...)",
                },
                "cofog_code": {"type": "string", "description": "Code COFOG (GF01-GF10, TOTAL)"},
            },
        },
    },
    {
        "name": "vue_globale",
        "description": "Synthèse des 4 piliers de la dépense publique (État, Sécu, Collectivités, Opérateurs) pour une année.",
        "input_schema": {
            "type": "object",
            "properties": {
                "year": {"type": "integer", "description": "Année", "default": 2023},
            },
        },
    },
    {
        "name": "compare_international",
        "description": "Compare la dépense publique entre pays sur une métrique COFOG donnée.",
        "input_schema": {
            "type": "object",
            "properties": {
                "countries": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Codes pays ISO3 (FRA, DEU, ITA, ESP...)",
                },
                "metric": {"type": "string", "description": "Code COFOG ou 'TOTAL' pour le total"},
                "year": {"type": "integer", "default": 2022},
            },
            "required": ["countries"],
        },
    },
    {
        "name": "evolution_depense",
        "description": "Montre l'évolution historique d'un indicateur de dépense publique sur plusieurs années.",
        "input_schema": {
            "type": "object",
            "properties": {
                "metric": {"type": "string", "description": "Code COFOG, 'budget_etat', 'protection_sociale', ou 'total'"},
                "country_code": {"type": "string", "default": "FRA"},
                "year_start": {"type": "integer", "default": 2015},
                "year_end": {"type": "integer", "default": 2023},
            },
        },
    },
]


def handle_tool_call(name: str, input_data: dict) -> str:
    """Execute a tool call and return results as string."""
    try:
        if name == "query_contracts":
            return _query_contracts(input_data)
        elif name == "query_budgets":
            return _query_budgets(input_data)
        elif name == "query_subventions":
            return _query_subventions(input_data)
        elif name == "query_anomalies":
            return _query_anomalies(input_data)
        elif name == "query_entity":
            return _query_entity(input_data)
        elif name == "compare_communes":
            return _compare_communes(input_data)
        elif name == "query_budget_etat":
            return _query_budget_etat(input_data)
        elif name == "query_protection_sociale":
            return _query_protection_sociale(input_data)
        elif name == "query_depense_cofog":
            return _query_depense_cofog(input_data)
        elif name == "vue_globale":
            return _vue_globale(input_data)
        elif name == "compare_international":
            return _compare_international(input_data)
        elif name == "evolution_depense":
            return _evolution_depense(input_data)
        else:
            return f"Outil inconnu: {name}"
    except Exception as e:
        return f"Erreur: {str(e)}"


def _query_contracts(params: dict) -> str:
    """Query the contracts table."""
    conditions = []
    query_params = []

    if params.get("buyer"):
        conditions.append("(buyer_name ILIKE %s OR buyer_siret = %s)")
        query_params.extend([f"%{params['buyer']}%", params["buyer"]])
    if params.get("winner"):
        conditions.append("(winner_name ILIKE %s OR winner_siret = %s)")
        query_params.extend([f"%{params['winner']}%", params["winner"]])
    if params.get("cpv"):
        conditions.append("cpv_code LIKE %s")
        query_params.append(f"{params['cpv']}%")
    if params.get("min_amount"):
        conditions.append("amount >= %s")
        query_params.append(int(params["min_amount"] * 100))
    if params.get("max_amount"):
        conditions.append("amount <= %s")
        query_params.append(int(params["max_amount"] * 100))
    if params.get("year"):
        conditions.append("EXTRACT(YEAR FROM publication_date) = %s")
        query_params.append(params["year"])

    where = " AND ".join(conditions) if conditions else "TRUE"
    limit = min(params.get("limit", 20), 50)
    query_params.append(limit)

    rows = fetch_all(
        f"""SELECT boamp_id, title, buyer_name, winner_name,
                   amount/100.0 as amount_eur, cpv_label,
                   publication_date, nb_offers
            FROM contracts WHERE {where}
            ORDER BY amount DESC NULLS LAST LIMIT %s""",
        query_params
    )
    return json.dumps(rows, default=str, ensure_ascii=False)


def _query_budgets(params: dict) -> str:
    """Query commune budgets."""
    year = params.get("year", 2023)

    if params.get("code_insee"):
        rows = fetch_all(
            """SELECT cb.*, c.name, c.department_code, c.strate
               FROM commune_budgets cb
               JOIN communes c ON c.code_insee = cb.code_insee
               WHERE cb.code_insee = %s AND cb.year = %s""",
            (params["code_insee"], year)
        )
    elif params.get("name"):
        rows = fetch_all(
            """SELECT cb.*, c.name, c.department_code, c.strate
               FROM commune_budgets cb
               JOIN communes c ON c.code_insee = cb.code_insee
               WHERE c.name ILIKE %s AND cb.year = %s
               LIMIT 5""",
            (f"%{params['name']}%", year)
        )
    else:
        return "Veuillez fournir un code INSEE ou un nom de commune."

    # Convert amounts to euros for readability
    for row in rows:
        for key in ["rev_total", "exp_total", "exp_personnel", "debt_total",
                     "inv_expenditure", "rev_fiscal", "rev_dotations"]:
            if row.get(key):
                row[key] = row[key] / 100.0

    return json.dumps(rows, default=str, ensure_ascii=False)


def _query_subventions(params: dict) -> str:
    """Query subventions."""
    conditions = []
    query_params = []

    if params.get("recipient"):
        conditions.append("(recipient_name ILIKE %s OR recipient_siret = %s)")
        query_params.extend([f"%{params['recipient']}%", params["recipient"]])
    if params.get("program"):
        conditions.append("program ILIKE %s")
        query_params.append(f"%{params['program']}%")
    if params.get("ministry"):
        conditions.append("ministry ILIKE %s")
        query_params.append(f"%{params['ministry']}%")
    if params.get("min_amount"):
        conditions.append("amount_granted >= %s")
        query_params.append(int(params["min_amount"] * 100))
    if params.get("year"):
        conditions.append("year = %s")
        query_params.append(params["year"])

    where = " AND ".join(conditions) if conditions else "TRUE"
    limit = min(params.get("limit", 20), 50)
    query_params.append(limit)

    rows = fetch_all(
        f"""SELECT recipient_name, grantor_name, ministry, program,
                   amount_granted/100.0 as granted_eur,
                   amount_paid/100.0 as paid_eur,
                   year, purpose
            FROM subventions WHERE {where}
            ORDER BY amount_granted DESC NULLS LAST LIMIT %s""",
        query_params
    )
    return json.dumps(rows, default=str, ensure_ascii=False)


def _query_anomalies(params: dict) -> str:
    """Query detected anomalies."""
    conditions = []
    query_params = []

    if params.get("entity_type"):
        conditions.append("entity_type = %s")
        query_params.append(params["entity_type"])
    if params.get("severity"):
        conditions.append("severity = %s")
        query_params.append(params["severity"])

    where = " AND ".join(conditions) if conditions else "TRUE"
    limit = min(params.get("limit", 20), 50)
    query_params.append(limit)

    rows = fetch_all(
        f"""SELECT entity_type, detector, anomaly_type,
                   score, severity, description, details
            FROM anomalies WHERE {where}
            ORDER BY score DESC LIMIT %s""",
        query_params
    )
    return json.dumps(rows, default=str, ensure_ascii=False)


def _query_entity(params: dict) -> str:
    """Query entity reference."""
    if params.get("siren"):
        row = fetch_one("SELECT * FROM entities WHERE siren = %s", (params["siren"],))
    elif params.get("siret"):
        row = fetch_one("SELECT * FROM entities WHERE siret = %s", (params["siret"],))
    elif params.get("name"):
        rows = fetch_all(
            "SELECT * FROM entities WHERE name ILIKE %s LIMIT 5",
            (f"%{params['name']}%",)
        )
        return json.dumps(rows, default=str, ensure_ascii=False)
    else:
        return "Veuillez fournir un nom, SIREN ou SIRET."

    return json.dumps(row, default=str, ensure_ascii=False) if row else "Entité non trouvée."


def _compare_communes(params: dict) -> str:
    """Compare multiple communes."""
    codes = params["codes_insee"]
    year = params.get("year", 2023)

    placeholders = ",".join(["%s"] * len(codes))
    query_params = codes + [year]

    rows = fetch_all(
        f"""SELECT cb.code_insee, c.name, cb.population,
                   cb.exp_total/100.0 as exp_eur,
                   cb.exp_per_capita,
                   cb.exp_personnel/100.0 as personnel_eur,
                   cb.debt_total/100.0 as debt_eur,
                   cb.debt_per_capita,
                   cb.savings_rate,
                   cb.rev_fiscal/100.0 as fiscal_eur
            FROM commune_budgets cb
            JOIN communes c ON c.code_insee = cb.code_insee
            WHERE cb.code_insee IN ({placeholders}) AND cb.year = %s""",
        query_params
    )
    return json.dumps(rows, default=str, ensure_ascii=False)


def _query_budget_etat(params: dict) -> str:
    """Query state budget (LOLF)."""
    conditions = []
    query_params = []

    if params.get("year"):
        conditions.append("year = %s")
        query_params.append(params["year"])
    if params.get("mission"):
        conditions.append("mission ILIKE %s")
        query_params.append(f"%{params['mission']}%")
    if params.get("programme"):
        conditions.append("programme ILIKE %s")
        query_params.append(f"%{params['programme']}%")
    if params.get("budget_type"):
        conditions.append("budget_type = %s")
        query_params.append(params["budget_type"])

    where = " AND ".join(conditions) if conditions else "TRUE"
    limit = min(params.get("limit", 20), 50)
    query_params.append(limit)

    rows = fetch_all(
        f"""SELECT year, mission, programme, action, budget_type,
                   lfi/100.0 as lfi_eur, execution/100.0 as execution_eur,
                   ecart_pct
            FROM budget_etat WHERE {where}
            ORDER BY execution DESC NULLS LAST LIMIT %s""",
        query_params
    )
    return json.dumps(rows, default=str, ensure_ascii=False)


def _query_protection_sociale(params: dict) -> str:
    """Query social protection accounts."""
    conditions = []
    query_params = []

    if params.get("year"):
        conditions.append("year = %s")
        query_params.append(params["year"])
    if params.get("branche"):
        conditions.append("branche ILIKE %s")
        query_params.append(f"%{params['branche']}%")
    if params.get("regime"):
        conditions.append("regime ILIKE %s")
        query_params.append(f"%{params['regime']}%")

    where = " AND ".join(conditions) if conditions else "TRUE"
    limit = min(params.get("limit", 20), 50)
    query_params.append(limit)

    rows = fetch_all(
        f"""SELECT year, branche, regime, poste,
                   recettes/100.0 as recettes_eur,
                   depenses/100.0 as depenses_eur,
                   solde/100.0 as solde_eur
            FROM protection_sociale WHERE {where}
            ORDER BY depenses DESC NULLS LAST LIMIT %s""",
        query_params
    )
    return json.dumps(rows, default=str, ensure_ascii=False)


def _query_depense_cofog(params: dict) -> str:
    """Query consolidated COFOG spending."""
    conditions = []
    query_params = []

    if params.get("year"):
        conditions.append("year = %s")
        query_params.append(params["year"])
    if params.get("country_codes"):
        placeholders = ",".join(["%s"] * len(params["country_codes"]))
        conditions.append(f"country_code IN ({placeholders})")
        query_params.extend(params["country_codes"])
    if params.get("cofog_code"):
        conditions.append("cofog_code = %s")
        query_params.append(params["cofog_code"])

    where = " AND ".join(conditions) if conditions else "TRUE"

    rows = fetch_all(
        f"""SELECT year, country_code, cofog_code, cofog_label,
                   amount/100.0 as amount_eur,
                   pct_gdp
            FROM depense_publique_cofog WHERE {where}
            ORDER BY year DESC, country_code, cofog_code""",
        query_params
    )
    return json.dumps(rows, default=str, ensure_ascii=False)


def _vue_globale(params: dict) -> str:
    """Consolidated view of all 4 pillars."""
    year = params.get("year", 2023)

    # Pilier 1: État (LOLF)
    etat = fetch_one(
        """SELECT SUM(execution)/100.0 as total_eur, COUNT(DISTINCT mission) as nb_missions
           FROM budget_etat WHERE year = %s AND budget_type = 'CP'""",
        (year,)
    )

    # Pilier 2: Sécurité sociale
    secu = fetch_one(
        """SELECT SUM(depenses)/100.0 as total_eur, COUNT(DISTINCT branche) as nb_branches
           FROM protection_sociale WHERE year = %s""",
        (year,)
    )

    # Pilier 3: Collectivités locales
    collectivites = fetch_one(
        """SELECT SUM(exp_total)/100.0 as total_eur, COUNT(*) as nb_communes
           FROM commune_budgets WHERE year = %s""",
        (year,)
    )

    # COFOG total for reference
    cofog_total = fetch_one(
        """SELECT amount/100.0 as total_eur, pct_gdp
           FROM depense_publique_cofog
           WHERE year = %s AND country_code = 'FRA' AND cofog_code = 'TOTAL'""",
        (year,)
    )

    result = {
        "year": year,
        "etat": {
            "total_eur": float(etat["total_eur"] or 0) if etat else 0,
            "nb_missions": etat["nb_missions"] if etat else 0,
        },
        "securite_sociale": {
            "total_eur": float(secu["total_eur"] or 0) if secu else 0,
            "nb_branches": secu["nb_branches"] if secu else 0,
        },
        "collectivites": {
            "total_eur": float(collectivites["total_eur"] or 0) if collectivites else 0,
            "nb_communes": collectivites["nb_communes"] if collectivites else 0,
        },
        "cofog_total": {
            "total_eur": float(cofog_total["total_eur"] or 0) if cofog_total else 0,
            "pct_gdp": float(cofog_total["pct_gdp"] or 0) if cofog_total else 0,
        },
    }
    return json.dumps(result, default=str, ensure_ascii=False)


def _compare_international(params: dict) -> str:
    """Compare public spending across countries."""
    countries = params["countries"]
    metric = params.get("metric", "TOTAL")
    year = params.get("year", 2022)

    placeholders = ",".join(["%s"] * len(countries))
    query_params = [year, metric] + countries

    rows = fetch_all(
        f"""SELECT country_code, cofog_label, amount/100.0 as amount_eur, pct_gdp
            FROM depense_publique_cofog
            WHERE year = %s AND cofog_code = %s AND country_code IN ({placeholders})
            ORDER BY pct_gdp DESC NULLS LAST""",
        query_params
    )
    return json.dumps(rows, default=str, ensure_ascii=False)


def _evolution_depense(params: dict) -> str:
    """Historical evolution of a spending metric."""
    metric = params.get("metric", "TOTAL")
    country = params.get("country_code", "FRA")
    year_start = params.get("year_start", 2015)
    year_end = params.get("year_end", 2023)

    if metric in ("budget_etat",):
        rows = fetch_all(
            """SELECT year, SUM(execution)/100.0 as total_eur
               FROM budget_etat
               WHERE budget_type = 'CP' AND year BETWEEN %s AND %s
               GROUP BY year ORDER BY year""",
            (year_start, year_end)
        )
    elif metric in ("protection_sociale",):
        rows = fetch_all(
            """SELECT year, SUM(depenses)/100.0 as total_eur
               FROM protection_sociale
               WHERE year BETWEEN %s AND %s
               GROUP BY year ORDER BY year""",
            (year_start, year_end)
        )
    else:
        # COFOG code
        rows = fetch_all(
            """SELECT year, amount/100.0 as amount_eur, pct_gdp
               FROM depense_publique_cofog
               WHERE country_code = %s AND cofog_code = %s
                 AND year BETWEEN %s AND %s
               ORDER BY year""",
            (country, metric, year_start, year_end)
        )

    return json.dumps(rows, default=str, ensure_ascii=False)


def chat(query: str, conversation: list[dict] = None) -> str:
    """Send a query to the orchestrator and get a response.

    Args:
        query: User question in natural language.
        conversation: Optional conversation history.

    Returns:
        Agent's response as string.
    """
    messages = conversation or []
    messages.append({"role": "user", "content": query})

    # Agentic loop with tool use
    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        )

        # Check if the model wants to use tools
        if response.stop_reason == "tool_use":
            # Process tool calls
            assistant_content = response.content
            messages.append({"role": "assistant", "content": assistant_content})

            tool_results = []
            for block in assistant_content:
                if block.type == "tool_use":
                    result = handle_tool_call(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            messages.append({"role": "user", "content": tool_results})
        else:
            # Extract text response
            text = ""
            for block in response.content:
                if hasattr(block, "text"):
                    text += block.text
            return text


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="IDP Orchestrator Agent")
    parser.add_argument("query", nargs="?", help="Question to ask")
    parser.add_argument("--interactive", "-i", action="store_true",
                       help="Interactive mode")
    args = parser.parse_args()

    if args.interactive:
        print("=== Intelligence de la Dépense Publique ===")
        print("Posez vos questions sur la dépense publique française.")
        print("Tapez 'quit' pour quitter.\n")

        conversation = []
        while True:
            try:
                query = input("Vous > ").strip()
            except (EOFError, KeyboardInterrupt):
                break
            if query.lower() in ("quit", "exit", "q"):
                break
            if not query:
                continue

            print("\nAnalyse en cours...")
            response = chat(query, conversation)
            print(f"\nIDP > {response}\n")
            conversation.append({"role": "user", "content": query})
            conversation.append({"role": "assistant", "content": response})

    elif args.query:
        response = chat(args.query)
        print(response)
    else:
        print("Usage: python orchestrator.py 'votre question'")
        print("       python orchestrator.py -i  # mode interactif")

"""OFGL — Observatoire des Finances et de la Gestion publique Locale.

Ingests financial accounts of 37k+ French communes (2017-2024).
Source: https://data.ofgl.fr/
API: ODS v2.1 (Opendatasoft)

The dataset is "long" format: one row per (commune, year, agregat).
We pivot into one row per (commune, year) with budget columns.
"""

import json
import argparse
from collections import defaultdict

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

OFGL_BASE = "https://data.ofgl.fr/api/explore/v2.1/catalog/datasets"
DATASET_COMMUNES = "ofgl-base-communes-consolidee"

# Map agregat names to our budget columns
AGREGAT_MAP = {
    "Recettes de fonctionnement": "rev_total",
    "Impôts locaux": "rev_fiscal",
    "Dotation globale de fonctionnement": "rev_dotations",
    "Dépenses de fonctionnement": "exp_total",
    "Frais de personnel": "exp_personnel",
    "Achats et charges externes": "exp_purchases",
    "Charges financières": "exp_financial",
    "Subventions aux personnes de droit privé": "exp_grants",
    "Recettes d'investissement": "inv_revenue",
    "Dépenses d'investissement": "inv_expenditure",
    "Encours de dette": "debt_total",
    "Epargne brute": "savings_gross",
}


class OFGLIngester(BaseIngester):
    """Ingest commune financial data from OFGL."""

    source_name = "ofgl"

    def __init__(self, year: int = None, department: str = None,
                 max_records: int = None, **kwargs):
        super().__init__(**kwargs)
        self.year = year
        self.department = department
        self.max_records = max_records

    def ingest(self):
        """Fetch and store OFGL commune financial data.

        The OFGL API limits offset+limit to 10k, so we paginate
        by year (and optionally department) to stay within limits.
        """
        years = [self.year] if self.year else list(range(2024, 2016, -1))

        if self.department:
            departments = [self.department]
        else:
            # Must paginate by department (API limit: 10k records)
            departments = self._fetch_department_list()

        total_pivoted = 0
        for year in years:
            for dept in departments:
                try:
                    n = self._ingest_slice(year, dept)
                    total_pivoted += n
                    if self.max_records and total_pivoted >= self.max_records:
                        print(f"  Reached max_records ({self.max_records}), stopping.")
                        return
                except Exception as e:
                    print(f"  Error on year={year} dept={dept}: {e}")

        print(f"  Total: {total_pivoted} commune-year records imported")

    def _fetch_department_list(self) -> list[str]:
        """Fetch list of all department codes from OFGL."""
        url = f"{OFGL_BASE}/{DATASET_COMMUNES}/records"
        data = self.fetch_page(url, {
            "select": "dep_code",
            "group_by": "dep_code",
            "limit": 200,
        })
        depts = [r["dep_code"] for r in data.get("results", []) if r.get("dep_code")]
        print(f"  Found {len(depts)} departments")
        return sorted(depts)

    def _ingest_slice(self, year: int, department: str = None) -> int:
        """Fetch one year (optionally one department) of OFGL data."""
        url = f"{OFGL_BASE}/{DATASET_COMMUNES}/records"

        agregats = list(AGREGAT_MAP.keys())
        agregat_filter = " OR ".join([f'agregat = "{a}"' for a in agregats])

        params = {
            "select": "exer,dep_code,reg_code,insee,com_name,lbudg,ptot,"
                      "tranche_population,epci_code,epci_name,"
                      "agregat,montant,euros_par_habitant",
            "order_by": "insee ASC",
        }

        where_parts = [f"({agregat_filter})", f'exer = "{year}"']
        if department:
            where_parts.append(f'dep_code = "{department}"')

        params["where"] = " AND ".join(where_parts)

        # API limit: offset+limit <= 10000
        records = self.fetch_all_pages(url, params, limit=100, max_records=9900)

        if self.dry_run:
            label = f"year={year}" + (f" dept={department}" if department else "")
            print(f"[DRY RUN] {label}: {len(records)} rows")
            return 0

        pivoted = self._pivot_records(records)
        if pivoted:
            self._store_records(pivoted)
            print(f"  year={year}: {len(pivoted)} communes")
        return len(pivoted)

    def _pivot_records(self, records: list[dict]) -> list[dict]:
        """Pivot long-format into one dict per (commune, year)."""
        groups = defaultdict(lambda: {
            "meta": {},
            "budgets": {},
        })

        for rec in records:
            insee = rec.get("insee")
            year = rec.get("exer")
            if not insee or not year:
                continue

            # Extract year from date string if needed (e.g. "2023-01-01" → "2023")
            if isinstance(year, str) and len(year) >= 4:
                year = year[:4]
            year = str(year)

            key = (insee, year)
            g = groups[key]

            # Store commune metadata (from any row)
            if not g["meta"]:
                g["meta"] = {
                    "insee": insee,
                    "year": int(year),
                    "name": rec.get("com_name") or rec.get("lbudg"),
                    "dept": rec.get("dep_code"),
                    "reg": rec.get("reg_code"),
                    "pop": rec.get("ptot"),
                    "strate": rec.get("tranche_population"),
                    "epci_code": rec.get("epci_code"),
                    "epci_name": rec.get("epci_name"),
                }

            # Map agregat to budget column
            agregat = rec.get("agregat", "")
            col = AGREGAT_MAP.get(agregat)
            if col:
                g["budgets"][col] = rec.get("montant")
                # Also store per-capita for key metrics
                if col == "exp_total":
                    g["budgets"]["exp_per_capita"] = rec.get("euros_par_habitant")
                elif col == "debt_total":
                    g["budgets"]["debt_per_capita"] = rec.get("euros_par_habitant")

        return [
            {**g["meta"], **g["budgets"]}
            for g in groups.values()
            if g["meta"]
        ]

    def _store_records(self, records: list[dict]):
        """Upsert pivoted records into PostgreSQL."""
        with get_conn() as conn:
            with conn.cursor() as cur:
                for rec in records:
                    code_insee = rec.get("insee")
                    if not code_insee:
                        continue

                    try:
                        cur.execute("SAVEPOINT sp")

                        # Upsert commune
                        cur.execute("""
                            INSERT INTO communes (
                                code_insee, name, department_code, region_code,
                                population, strate, epci_code, epci_name
                            ) VALUES (%(code_insee)s, %(name)s, %(dept)s, %(reg)s,
                                      %(pop)s, %(strate)s, %(epci)s, %(epci_name)s)
                            ON CONFLICT (code_insee) DO UPDATE SET
                                name = EXCLUDED.name,
                                population = COALESCE(EXCLUDED.population, communes.population),
                                strate = EXCLUDED.strate,
                                epci_code = EXCLUDED.epci_code,
                                epci_name = EXCLUDED.epci_name
                        """, {
                            "code_insee": code_insee,
                            "name": rec.get("name"),
                            "dept": rec.get("dept"),
                            "reg": rec.get("reg"),
                            "pop": _safe_int(rec.get("pop")),
                            "strate": rec.get("strate"),
                            "epci": rec.get("epci_code"),
                            "epci_name": rec.get("epci_name"),
                        })

                        # Upsert budget
                        year = rec.get("year")
                        if not year:
                            cur.execute("RELEASE SAVEPOINT sp")
                            continue

                        # Compute savings_rate from gross savings and revenue
                        savings_rate = None
                        if rec.get("savings_gross") and rec.get("rev_total"):
                            try:
                                savings_rate = (rec["savings_gross"] / rec["rev_total"]) * 100
                            except (ZeroDivisionError, TypeError):
                                pass

                        cur.execute("""
                            INSERT INTO commune_budgets (
                                code_insee, year,
                                rev_total, rev_fiscal, rev_dotations,
                                exp_total, exp_personnel, exp_purchases,
                                exp_financial, exp_grants,
                                inv_revenue, inv_expenditure,
                                debt_total, debt_per_capita,
                                exp_per_capita, savings_rate,
                                population, source
                            ) VALUES (
                                %(insee)s, %(year)s,
                                %(rev_total)s, %(rev_fiscal)s, %(rev_dotations)s,
                                %(exp_total)s, %(exp_personnel)s, %(exp_purchases)s,
                                %(exp_financial)s, %(exp_grants)s,
                                %(inv_rev)s, %(inv_exp)s,
                                %(debt)s, %(debt_pc)s,
                                %(exp_pc)s, %(savings)s,
                                %(pop)s, 'ofgl'
                            )
                            ON CONFLICT (code_insee, year) DO UPDATE SET
                                rev_total = EXCLUDED.rev_total,
                                exp_total = EXCLUDED.exp_total,
                                exp_personnel = EXCLUDED.exp_personnel,
                                debt_total = EXCLUDED.debt_total,
                                debt_per_capita = EXCLUDED.debt_per_capita,
                                exp_per_capita = EXCLUDED.exp_per_capita,
                                savings_rate = EXCLUDED.savings_rate,
                                population = EXCLUDED.population
                        """, {
                            "insee": code_insee,
                            "year": int(year),
                            "rev_total": _to_cents(rec.get("rev_total")),
                            "rev_fiscal": _to_cents(rec.get("rev_fiscal")),
                            "rev_dotations": _to_cents(rec.get("rev_dotations")),
                            "exp_total": _to_cents(rec.get("exp_total")),
                            "exp_personnel": _to_cents(rec.get("exp_personnel")),
                            "exp_purchases": _to_cents(rec.get("exp_purchases")),
                            "exp_financial": _to_cents(rec.get("exp_financial")),
                            "exp_grants": _to_cents(rec.get("exp_grants")),
                            "inv_rev": _to_cents(rec.get("inv_revenue")),
                            "inv_exp": _to_cents(rec.get("inv_expenditure")),
                            "debt": _to_cents(rec.get("debt_total")),
                            "debt_pc": rec.get("debt_per_capita"),
                            "exp_pc": rec.get("exp_per_capita"),
                            "savings": savings_rate,
                            "pop": _safe_int(rec.get("pop")),
                        })
                        self.stats["inserted"] += 1
                        cur.execute("RELEASE SAVEPOINT sp")

                    except Exception as e:
                        cur.execute("ROLLBACK TO SAVEPOINT sp")
                        self.stats["errors"] += 1
                        if self.stats["errors"] <= 5:
                            print(f"  Error on {code_insee}/{rec.get('year')}: {e}")


def _to_cents(val) -> int | None:
    """Convert euros (float, in thousands from OFGL) to centimes."""
    if val is None:
        return None
    try:
        # OFGL montant is in euros (not thousands)
        return int(float(val) * 100)
    except (ValueError, TypeError):
        return None


def _safe_int(val) -> int | None:
    if val is None:
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest OFGL commune finances")
    parser.add_argument("--year", type=int, help="Filter by year (e.g. 2023)")
    parser.add_argument("--department", type=str, help="Filter by department (e.g. 75)")
    parser.add_argument("--max", type=int, default=50000, help="Max raw rows to fetch")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ingester = OFGLIngester(
        year=args.year, department=args.department,
        max_records=args.max, dry_run=args.dry_run
    )
    ingester.run()

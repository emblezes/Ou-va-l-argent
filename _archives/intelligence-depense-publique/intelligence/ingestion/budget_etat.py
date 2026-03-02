"""Budget de l'État — Credits votes LFI par mission/programme/action (LOLF).

Ingests state budget credits (AE and CP) from data.economie.gouv.fr.
Source: https://data.economie.gouv.fr
API: ODS v2.1 (Opendatasoft)

Each year has its own dataset with year-suffixed column names, e.g.:
  credits-ae-et-cp-votes-nomenclature-par-destination-et-nature-lfi-2023
  Fields: mission, libelle_programme, libelle_action, ae_t2_hors_t2_lfi_2023, cp_t2_hors_t2_lfi_2023
"""

import json
import re
import argparse

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

ECONOMIE_BASE = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets"

# Known dataset patterns — each year has a separate dataset
# We search dynamically but keep known ones as fallback
KNOWN_DATASETS = {
    2023: "credits-ae-et-cp-votes-nomenclature-par-destination-et-nature-lfi-2023",
    2022: "plf-2023-credits_destination_nature",  # PLF N+1 = exec N
}


class BudgetEtatIngester(BaseIngester):
    """Ingest state budget credits from data.economie.gouv.fr."""

    source_name = "budget_etat"

    def __init__(self, year: int = None, max_records: int = None, **kwargs):
        super().__init__(**kwargs)
        self.year = year
        self.max_records = max_records

    def ingest(self):
        """Fetch and store state budget data."""
        years = [self.year] if self.year else [2023, 2022, 2021, 2020]

        for year in years:
            try:
                dataset = self._find_dataset_for_year(year)
                if dataset:
                    self._ingest_year(year, dataset)
                else:
                    print(f"  No dataset found for year={year}")
            except Exception as e:
                self.stats["errors"] += 1
                print(f"  Error on year={year}: {e}")

    def _find_dataset_for_year(self, year: int) -> str | None:
        """Find the right dataset for a given year."""
        # Try known datasets first
        if year in KNOWN_DATASETS:
            ds = KNOWN_DATASETS[year]
            try:
                url = f"{ECONOMIE_BASE}/{ds}/records"
                data = self.fetch_page(url, {"limit": 1})
                if data.get("total_count", 0) > 0:
                    print(f"  year={year}: using known dataset {ds}")
                    return ds
            except Exception:
                pass

        # Search dynamically
        search_terms = [
            f"credits%20lfi%20{year}",
            f"lfi%20{year}%20ae%20cp",
            f"lfi-{year}",
        ]
        for term in search_terms:
            try:
                search_url = f"{ECONOMIE_BASE}?limit=5&where=default.title%20LIKE%20%22{term}%22"
                data = self.fetch_page(search_url)
                for r in data.get("results", []):
                    ds_id = r.get("dataset_id", "")
                    if r.get("has_records") and ("credit" in ds_id or "lfi" in ds_id):
                        # Verify it has mission field
                        check = self.fetch_page(f"{ECONOMIE_BASE}/{ds_id}/records", {"limit": 1})
                        if check.get("results") and "mission" in check["results"][0]:
                            print(f"  year={year}: discovered dataset {ds_id}")
                            return ds_id
            except Exception:
                continue

        return None

    def _ingest_year(self, year: int, dataset: str):
        """Fetch all records for a year and store them."""
        url = f"{ECONOMIE_BASE}/{dataset}/records"

        # Only BG (budget general), not CAS/CCF
        params = {"limit": 100}
        # Try filtering to BG only
        sample = self.fetch_page(url, {"limit": 1})
        if sample.get("results"):
            fields = list(sample["results"][0].keys())
            if "type_mission" in fields:
                params["where"] = 'type_mission = "BG"'

        records = self.fetch_all_pages(url, params, limit=100,
                                       max_records=self.max_records)

        if self.dry_run:
            print(f"[DRY RUN] year={year} dataset={dataset}: {len(records)} rows")
            if records:
                print(f"  Fields: {sorted(records[0].keys())}")
                # Show AE/CP field names
                ae_cp_fields = [f for f in records[0].keys() if 'ae' in f.lower() or 'cp' in f.lower()]
                print(f"  AE/CP fields: {ae_cp_fields}")
                # Aggregate by mission
                missions = {}
                for r in records:
                    m = r.get("mission", "?")
                    missions[m] = missions.get(m, 0) + 1
                print(f"  Missions ({len(missions)}): {dict(list(missions.items())[:10])}")
            return

        self._store_records(records, year)

    def _store_records(self, records: list[dict], year: int):
        """Parse and aggregate records by mission/programme/action, then store."""
        # The data is at action × categorie granularity, we need to aggregate
        # to mission/programme/action level
        aggregated: dict[tuple, dict] = {}

        for rec in records:
            mission = rec.get("mission")
            if not mission:
                continue

            programme = rec.get("libelle_programme") or str(rec.get("programme", ""))
            action_label = rec.get("libelle_action") or str(rec.get("action", ""))

            # Find AE and CP total fields (naming varies by year)
            # Note: in the LFI dataset, *_lfi_YYYY fields often contain flags (4.0),
            # not actual amounts. The *_plf_YYYY fields contain the real PLF amounts.
            # We also check *_hors_t2_* and *_t2_* for the T2/HT2 breakdown.
            ae_plf = self._find_amount(rec, "ae", "plf", year)
            cp_plf = self._find_amount(rec, "cp", "plf", year)

            # Try to get amendements (LFI = PLF + amendements)
            ae_amend = self._find_amount(rec, "ae", "amendements", year) or 0
            cp_amend = self._find_amount(rec, "cp", "amendements", year) or 0

            for budget_type, plf_val, amend_val in [("AE", ae_plf, ae_amend), ("CP", cp_plf, cp_amend)]:
                if plf_val is None:
                    continue
                key = (mission, programme, action_label, budget_type)
                if key not in aggregated:
                    aggregated[key] = {"plf": 0, "lfi": 0}
                aggregated[key]["plf"] += plf_val
                aggregated[key]["lfi"] += plf_val + amend_val  # LFI = PLF + amendements

        # Store aggregated records
        stored = 0
        with get_conn() as conn:
            with conn.cursor() as cur:
                for (mission, programme, action, budget_type), amounts in aggregated.items():
                    try:
                        cur.execute("SAVEPOINT sp")

                        # LFI = PLF + amendements (voted budget)
                        # PLF = initial government proposal
                        lfi_cents = int(amounts["lfi"] * 100) if amounts["lfi"] else None
                        plf_cents = int(amounts["plf"] * 100) if amounts["plf"] else None
                        ecart = _compute_ecart(plf_cents, lfi_cents)  # ecart = amendements impact

                        cur.execute("""
                            INSERT INTO budget_etat (
                                year, mission, programme, action,
                                budget_type, lfi, execution, ecart_pct,
                                source, raw_data
                            ) VALUES (
                                %(year)s, %(mission)s, %(programme)s, %(action)s,
                                %(bt)s, %(lfi)s, %(exec)s, %(ecart)s,
                                'data_economie', NULL
                            )
                            ON CONFLICT (year, mission, programme, action, budget_type) DO UPDATE SET
                                lfi = EXCLUDED.lfi,
                                execution = EXCLUDED.execution,
                                ecart_pct = EXCLUDED.ecart_pct
                        """, {
                            "year": year,
                            "mission": mission,
                            "programme": programme[:200] if programme else "",
                            "action": action[:200] if action else "",
                            "bt": budget_type,
                            "lfi": lfi_cents,
                            "exec": plf_cents,
                            "ecart": ecart,
                        })
                        stored += 1
                        self.stats["inserted"] += 1
                        cur.execute("RELEASE SAVEPOINT sp")

                    except Exception as e:
                        cur.execute("ROLLBACK TO SAVEPOINT sp")
                        self.stats["errors"] += 1
                        if self.stats["errors"] <= 5:
                            print(f"  Store error: {e}")

        print(f"  year={year}: {stored} aggregated records stored ({len(aggregated)} unique keys)")

    def _find_amount(self, rec: dict, ae_or_cp: str, lfi_or_plf: str, year: int) -> float | None:
        """Find the right amount field, handling year-suffixed names.

        Examples of field names:
          ae_t2_hors_t2_lfi_2023, cp_t2_hors_t2_lfi_2023
          ae_hors_t2_lfi_2023, cp_hors_t2_lfi_2023
        We want the total (t2 + hors_t2) = ae_t2_hors_t2_lfi_YYYY
        """
        # Priority: total (t2 + hors_t2) > hors_t2 alone > any matching field
        patterns = [
            f"{ae_or_cp}_t2_hors_t2_{lfi_or_plf}_{year}",
            f"{ae_or_cp}_t2_{lfi_or_plf}_{year}",
            f"{ae_or_cp}_hors_t2_{lfi_or_plf}_{year}",
            f"{ae_or_cp}_{lfi_or_plf}_{year}",
            f"{ae_or_cp}_{lfi_or_plf}",
        ]

        for pattern in patterns:
            val = rec.get(pattern)
            if val is not None:
                try:
                    return float(val)
                except (ValueError, TypeError):
                    continue

        # Fallback: search any field matching the pattern
        prefix = f"{ae_or_cp}_"
        suffix = f"_{lfi_or_plf}"
        for key, val in rec.items():
            if key.lower().startswith(prefix) and lfi_or_plf in key.lower():
                try:
                    return float(val)
                except (ValueError, TypeError):
                    continue

        return None


def _compute_ecart(lfi, execution) -> float | None:
    """Compute percentage deviation between LFI and execution.
    Capped at +/-99999999 to fit NUMERIC(10,2)."""
    if lfi and execution and lfi != 0:
        ecart = ((execution - lfi) / lfi) * 100
        # Cap extreme values
        ecart = max(-99999999, min(99999999, ecart))
        return round(ecart, 2)
    return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest state budget (LOLF)")
    parser.add_argument("--year", type=int, help="Filter by year (e.g. 2023)")
    parser.add_argument("--max", type=int, default=50000, help="Max records to fetch")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ingester = BudgetEtatIngester(
        year=args.year, max_records=args.max, dry_run=args.dry_run
    )
    ingester.run()

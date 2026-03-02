"""Sécurité sociale — Comptes de la protection sociale (DREES).

Ingests social protection accounts by branch (health, retirement, family, employment).
Source: https://data.drees.solidarites-sante.gouv.fr
API: ODS v2.1 (Opendatasoft)

Total: ~650 Md€/year across all branches.
"""

import json
import argparse

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

DREES_BASE = "https://data.drees.solidarites-sante.gouv.fr/api/explore/v2.1/catalog/datasets"
DATASET = "305_les-comptes-de-la-protection-sociale"

# Alternative datasets
FALLBACK_DATASETS = [
    "723_les-comptes-de-la-protection-sociale",
    "les-comptes-de-la-protection-sociale",
    "test-dyn-er-depenses-de-protection-sociale",
]

# Map branch names to our standard labels
BRANCHE_MAP = {
    "maladie": "maladie",
    "santé": "maladie",
    "sante": "maladie",
    "vieillesse": "vieillesse",
    "retraite": "vieillesse",
    "survie": "vieillesse",
    "famille": "famille",
    "maternité": "famille",
    "maternite": "famille",
    "emploi": "emploi",
    "chômage": "emploi",
    "chomage": "emploi",
    "insertion": "emploi",
    "accidents du travail": "AT-MP",
    "at-mp": "AT-MP",
    "logement": "logement",
    "pauvreté": "pauvrete",
    "exclusion": "pauvrete",
}


class SecuriteSocialeIngester(BaseIngester):
    """Ingest social protection accounts from DREES."""

    source_name = "drees"

    def __init__(self, year: int = None, max_records: int = None, **kwargs):
        super().__init__(**kwargs)
        self.year = year
        self.max_records = max_records
        self.dataset = DATASET

    def ingest(self):
        """Fetch and store DREES protection sociale data."""
        dataset = self._find_dataset()
        if not dataset:
            print("  Could not find a suitable DREES dataset. Try --dry-run to explore.")
            return

        self.dataset = dataset
        years = [self.year] if self.year else list(range(2023, 2014, -1))

        for year in years:
            try:
                self._ingest_year(year)
            except Exception as e:
                self.stats["errors"] += 1
                print(f"  Error on year={year}: {e}")

    def _find_dataset(self) -> str | None:
        """Try to find a working DREES dataset."""
        for ds in [DATASET] + FALLBACK_DATASETS:
            try:
                url = f"{DREES_BASE}/{ds}/records"
                data = self.fetch_page(url, {"limit": 1})
                total = data.get("total_count", 0)
                if total > 0:
                    print(f"  Using dataset: {ds} ({total} records)")
                    return ds
            except Exception:
                continue
        return None

    def _ingest_year(self, year: int):
        """Fetch protection sociale data for a single year."""
        url = f"{DREES_BASE}/{self.dataset}/records"

        # Discover fields from a sample
        sample = self.fetch_page(url, {"limit": 1})
        if not sample.get("results"):
            print(f"  No data for year={year}")
            return

        sample_rec = sample["results"][0]
        fields = list(sample_rec.keys())

        # Build year filter
        year_field = None
        for f in ["annee", "year", "exercice", "date"]:
            if f in fields:
                year_field = f
                break

        params = {"limit": 100}
        if year_field:
            params["where"] = f'{year_field} = "{year}"'

        records = self.fetch_all_pages(url, params, limit=100,
                                       max_records=self.max_records)

        if self.dry_run:
            print(f"[DRY RUN] year={year}: {len(records)} rows")
            if records:
                print(f"  Fields: {fields}")
                print(f"  Sample: {json.dumps(records[0], ensure_ascii=False, indent=2)[:500]}")
            return

        self._store_records(records, year)

    def _store_records(self, records: list[dict], default_year: int):
        """Parse and store protection sociale records."""
        stored = 0
        with get_conn() as conn:
            with conn.cursor() as cur:
                for rec in records:
                    try:
                        cur.execute("SAVEPOINT sp")

                        parsed = self._parse_record(rec, default_year)
                        if not parsed:
                            cur.execute("RELEASE SAVEPOINT sp")
                            continue

                        cur.execute("""
                            INSERT INTO protection_sociale (
                                year, branche, regime, poste,
                                recettes, depenses, solde,
                                source, raw_data
                            ) VALUES (
                                %(year)s, %(branche)s, %(regime)s, %(poste)s,
                                %(recettes)s, %(depenses)s, %(solde)s,
                                'drees', %(raw)s
                            )
                            ON CONFLICT (year, branche, regime, poste) DO UPDATE SET
                                recettes = EXCLUDED.recettes,
                                depenses = EXCLUDED.depenses,
                                solde = EXCLUDED.solde,
                                raw_data = EXCLUDED.raw_data
                        """, parsed)
                        self.stats["inserted"] += 1
                        stored += 1
                        cur.execute("RELEASE SAVEPOINT sp")

                    except Exception as e:
                        cur.execute("ROLLBACK TO SAVEPOINT sp")
                        self.stats["errors"] += 1
                        if self.stats["errors"] <= 5:
                            print(f"  Store error: {e}")

        print(f"  year={default_year}: {stored} records stored")

    def _parse_record(self, rec: dict, default_year: int) -> dict | None:
        """Parse a raw DREES record into protection_sociale fields.

        DREES 305 format:
          annee: 2022
          risque: "Maladie" or "PRESTATIONS DE PROTECTION SOCIALE" (level 0)
          nom_regime: "Régime général" etc.
          ps_lib: "PRESTATIONS DE PROTECTION SOCIALE" or sub-item
          ps_code: "E11-0" etc.
          ps_niveau: 0 (total), 1 (sub-category), 2 (detail)
          si_nom: "Régimes d'assurance sociale" etc.
          val: amount in millions EUR
        """
        # Branch from risque field
        branche_raw = (rec.get("risque") or rec.get("branche")
                       or rec.get("fonction") or rec.get("type_risque") or "")
        branche = self._normalize_branche(str(branche_raw).lower())
        if not branche:
            return None

        # Year
        year = default_year
        for f in ["annee", "year", "exercice"]:
            if f in rec and rec[f]:
                try:
                    year = int(str(rec[f])[:4])
                    break
                except (ValueError, TypeError):
                    pass

        # Regime
        regime = (rec.get("nom_regime") or rec.get("regime")
                  or rec.get("si_nom") or "tous")

        # Poste — use ps_lib (prestation label) or generic field
        poste = (rec.get("ps_lib") or rec.get("poste") or rec.get("nature")
                 or rec.get("categorie") or "total")

        # Amount — val is in millions EUR in the DREES dataset
        val = rec.get("val")
        if val is None:
            val = rec.get("montant") or rec.get("valeur") or rec.get("value")

        if val is None:
            return None

        try:
            val_millions = float(val)
        except (ValueError, TypeError):
            return None

        # Convert millions EUR → centimes
        depenses_cents = int(val_millions * 1_000_000 * 100)

        return {
            "year": year,
            "branche": branche[:50],
            "regime": str(regime)[:100] if regime else "tous",
            "poste": str(poste)[:200] if poste else "total",
            "recettes": None,  # DREES 305 only has expenditures
            "depenses": depenses_cents,
            "solde": None,
            "raw": json.dumps(rec, ensure_ascii=False, default=str),
        }

    def _normalize_branche(self, raw: str) -> str | None:
        """Normalize branch name to standard label."""
        for keyword, label in BRANCHE_MAP.items():
            if keyword in raw:
                return label
        # If no match but non-empty, return as-is (truncated)
        if raw.strip():
            return raw.strip()[:50]
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest DREES protection sociale data")
    parser.add_argument("--year", type=int, help="Filter by year (e.g. 2022)")
    parser.add_argument("--max", type=int, default=50000, help="Max records to fetch")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ingester = SecuriteSocialeIngester(
        year=args.year, max_records=args.max, dry_run=args.dry_run
    )
    ingester.run()

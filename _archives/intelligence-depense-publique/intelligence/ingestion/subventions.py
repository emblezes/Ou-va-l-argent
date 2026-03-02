"""Data.Subvention — Subventions État + paiements Chorus.

Source: https://api.datasubvention.beta.gouv.fr
100% des subventions État aux associations et entreprises.
"""

import os
import json
import argparse

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

API_BASE = "https://api.datasubvention.beta.gouv.fr"


class SubventionIngester(BaseIngester):
    """Ingest state subsidies from Data.Subvention API."""

    source_name = "data_subvention"

    def __init__(self, siret: str = None, year: int = None,
                 max_records: int = 5000, **kwargs):
        super().__init__(**kwargs)
        self.siret = siret
        self.year = year
        self.max_records = max_records

        api_key = os.getenv("DATA_SUBVENTION_API_KEY")
        if api_key:
            self.client.headers["x-access-token"] = api_key

    def ingest(self):
        """Fetch and store subvention records."""
        if self.siret:
            self._ingest_by_siret(self.siret)
        else:
            self._ingest_search()

    def _ingest_by_siret(self, siret: str):
        """Fetch subventions for a specific SIRET."""
        try:
            data = self.fetch_page(f"{API_BASE}/association/{siret}/subventions")
            subventions = data.get("subventions", [])
            self.stats["fetched"] += len(subventions)

            if self.dry_run:
                print(f"[DRY RUN] Found {len(subventions)} subventions for {siret}")
                return

            self._store_subventions(subventions)
        except Exception as e:
            print(f"  Error fetching subventions for {siret}: {e}")
            # Try alternative endpoint
            try:
                data = self.fetch_page(f"{API_BASE}/etablissement/{siret}/subventions")
                subventions = data.get("subventions", [])
                self.stats["fetched"] += len(subventions)
                if not self.dry_run:
                    self._store_subventions(subventions)
            except Exception as e2:
                self.stats["errors"] += 1
                print(f"  Also failed with etablissement endpoint: {e2}")

    def _ingest_search(self):
        """Search and fetch subventions."""
        # Data.Subvention API requires a SIRET — bulk export is via CSV dumps
        # For bulk ingestion, use the CSV export from data.gouv.fr
        print("Note: Data.Subvention API requires SIRET-based queries.")
        print("For bulk ingestion, download CSV from:")
        print("  https://www.data.gouv.fr/fr/datasets/subventions-associatives/")
        print("Use --siret=XXXXXXXXXXXXX for targeted queries.")

    def _store_subventions(self, subventions: list[dict]):
        """Upsert subventions into PostgreSQL."""
        with get_conn() as conn:
            with conn.cursor() as cur:
                for sub in subventions:
                    try:
                        # Extract from nested structure
                        service = sub.get("service_instructeur", {})
                        dispositif = sub.get("dispositif", {})
                        demande = sub.get("demande", {})
                        versements = sub.get("versements", [])

                        amount_granted = _extract_amount(demande.get("montant_accorde"))
                        amount_paid = sum(
                            _extract_amount(v.get("montant")) or 0
                            for v in versements
                        ) if versements else None

                        ext_id = sub.get("id") or f"{sub.get('siret')}_{sub.get('annee')}"

                        cur.execute("""
                            INSERT INTO subventions (
                                external_id, program, action, ministry,
                                grantor_name, recipient_siret,
                                amount_granted, amount_paid,
                                year, grant_date, purpose,
                                source, raw_data
                            ) VALUES (
                                %(ext_id)s, %(program)s, %(action)s, %(ministry)s,
                                %(grantor)s, %(siret)s,
                                %(granted)s, %(paid)s,
                                %(year)s, %(date)s, %(purpose)s,
                                'data_subvention', %(raw)s
                            )
                            ON CONFLICT (external_id) DO UPDATE SET
                                amount_paid = EXCLUDED.amount_paid,
                                raw_data = EXCLUDED.raw_data
                        """, {
                            "ext_id": ext_id,
                            "program": dispositif.get("code_programme"),
                            "action": dispositif.get("action"),
                            "ministry": service.get("ministere"),
                            "grantor": service.get("nom"),
                            "siret": sub.get("siret"),
                            "granted": amount_granted,
                            "paid": amount_paid if amount_paid else None,
                            "year": sub.get("annee"),
                            "date": demande.get("date_commission"),
                            "purpose": sub.get("intitule") or dispositif.get("intitule"),
                            "raw": json.dumps(sub, ensure_ascii=False),
                        })
                        self.stats["inserted"] += 1

                    except Exception as e:
                        self.stats["errors"] += 1
                        if self.stats["errors"] <= 5:
                            print(f"  Error storing subvention: {e}")


def _extract_amount(val) -> int | None:
    """Extract amount in centimes from various formats."""
    if val is None:
        return None
    try:
        return int(float(val) * 100)
    except (ValueError, TypeError):
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Data.Subvention")
    parser.add_argument("--siret", type=str, help="SIRET to query")
    parser.add_argument("--year", type=int, help="Filter by year")
    parser.add_argument("--max", type=int, default=5000)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ingester = SubventionIngester(
        siret=args.siret, year=args.year,
        max_records=args.max, dry_run=args.dry_run
    )
    ingester.run()

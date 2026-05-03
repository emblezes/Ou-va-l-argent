"""BOAMP — Marchés publics (Bulletin Officiel des Annonces de Marchés Publics).

Ingests public procurement contracts from the BOAMP open data API.
Source: https://www.boamp.fr/
API: ODS v2.1 (Opendatasoft)
"""

import json
import argparse

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

# BOAMP datasets on data.gouv.fr / ODS
BOAMP_BASE = "https://www.boamp.fr/api/explore/v2.1/catalog/datasets"
DATASET_ANNONCES = "boamp"  # Main dataset


class BOAMPIngester(BaseIngester):
    """Ingest marchés publics from BOAMP."""

    source_name = "boamp"

    def __init__(self, year: int = None, max_records: int = None, **kwargs):
        super().__init__(**kwargs)
        self.year = year
        self.max_records = max_records

    def ingest(self):
        """Fetch and store BOAMP records."""
        url = f"{BOAMP_BASE}/{DATASET_ANNONCES}/records"

        params = {
            "select": ",".join([
                "idweb", "nature", "nature_libelle", "type_marche",
                "type_procedure", "procedure_libelle",
                "objet", "nomacheteur", "code_departement",
                "titulaire", "descripteur_code", "descripteur_libelle",
                "dateparution", "datelimitereponse",
                "famille", "famille_libelle", "type_avis",
                "url_avis"
            ]),
            "order_by": "dateparution DESC",
        }

        if self.year:
            params["where"] = f"dateparution >= '{self.year}-01-01' AND dateparution <= '{self.year}-12-31'"

        records = self.fetch_all_pages(url, params, limit=100, max_records=self.max_records)

        if self.dry_run:
            print(f"[DRY RUN] Would insert {len(records)} BOAMP records")
            if records:
                print(f"Sample: {json.dumps(records[0], indent=2, ensure_ascii=False)[:500]}")
            return

        self._store_records(records)

    def _store_records(self, records: list[dict]):
        """Upsert BOAMP records into PostgreSQL."""
        with get_conn() as conn:
            with conn.cursor() as cur:
                for rec in records:
                    try:
                        cur.execute("SAVEPOINT sp")
                        cur.execute("""
                            INSERT INTO contracts (
                                boamp_id, announcement_type, contract_type,
                                procedure_type, cpv_code, cpv_label,
                                title, buyer_name,
                                winner_name,
                                publication_date, deadline_date,
                                source, raw_data
                            ) VALUES (
                                %(boamp_id)s, %(announcement_type)s, %(contract_type)s,
                                %(procedure_type)s, %(cpv_code)s, %(cpv_label)s,
                                %(title)s, %(buyer_name)s,
                                %(winner_name)s,
                                %(publication_date)s, %(deadline_date)s,
                                'boamp', %(raw_data)s
                            )
                            ON CONFLICT (boamp_id) DO UPDATE SET
                                winner_name = EXCLUDED.winner_name,
                                raw_data = EXCLUDED.raw_data,
                                created_at = NOW()
                        """, {
                            "boamp_id": rec.get("idweb"),
                            "announcement_type": rec.get("nature_libelle") or rec.get("nature"),
                            "contract_type": _first_or_str(rec.get("type_marche")),
                            "procedure_type": rec.get("procedure_libelle") or rec.get("type_procedure"),
                            "cpv_code": _first_or_str(rec.get("descripteur_code")),
                            "cpv_label": _first_or_str(rec.get("descripteur_libelle")),
                            "title": rec.get("objet"),
                            "buyer_name": rec.get("nomacheteur"),
                            "winner_name": rec.get("titulaire"),
                            "publication_date": rec.get("dateparution"),
                            "deadline_date": _safe_date(rec.get("datelimitereponse")),
                            "raw_data": json.dumps(rec, ensure_ascii=False),
                        })
                        self.stats["inserted"] += 1
                        cur.execute("RELEASE SAVEPOINT sp")
                    except Exception as e:
                        cur.execute("ROLLBACK TO SAVEPOINT sp")
                        self.stats["errors"] += 1
                        if self.stats["errors"] <= 5:
                            print(f"  Error on record {rec.get('idweb')}: {e}")


def _first_or_str(val) -> str | None:
    """Extract first element from list, or return string as-is."""
    if val is None:
        return None
    if isinstance(val, list):
        return str(val[0]) if val else None
    return str(val)


def _safe_date(val) -> str | None:
    """Extract date part from datetime string."""
    if not val:
        return None
    # Handle "2026-03-01T12:00:00+00:00" → "2026-03-01"
    return str(val)[:10] if len(str(val)) >= 10 else str(val)


def _clean_siret(val) -> str | None:
    """Clean and validate a SIRET number."""
    if not val:
        return None
    s = str(val).strip().replace(" ", "")
    if len(s) == 14 and s.isdigit():
        return s
    if len(s) == 9 and s.isdigit():  # SIREN → pad to SIRET
        return None  # Can't infer SIRET from SIREN alone
    return None


def _parse_amount(val) -> int | None:
    """Parse an amount to centimes (integer)."""
    if val is None:
        return None
    try:
        return int(float(val) * 100)
    except (ValueError, TypeError):
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest BOAMP marchés publics")
    parser.add_argument("--year", type=int, help="Filter by year")
    parser.add_argument("--max", type=int, default=1000, help="Max records to fetch")
    parser.add_argument("--dry-run", action="store_true", help="Don't write to DB")
    args = parser.parse_args()

    ingester = BOAMPIngester(year=args.year, max_records=args.max, dry_run=args.dry_run)
    ingester.run()

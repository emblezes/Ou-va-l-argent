"""INSEE Sirene — Référentiel des entreprises et établissements français.

Source: https://api.insee.fr/entreprises/sirene/V3.11
25M entreprises, 36M établissements.
Requires: INSEE_API_KEY (consumer key from api.insee.fr)
"""

import os
import json
import argparse

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

SIRENE_BASE = "https://api.insee.fr/entreprises/sirene/V3.11"


class SireneIngester(BaseIngester):
    """Ingest enterprise data from INSEE Sirene API."""

    source_name = "sirene"

    def __init__(self, sirets: list[str] = None, department: str = None,
                 naf: str = None, max_records: int = 1000, **kwargs):
        super().__init__(**kwargs)
        self.sirets = sirets
        self.department = department
        self.naf = naf
        self.max_records = max_records

        api_key = os.getenv("INSEE_API_KEY")
        if api_key:
            self.client.headers["Authorization"] = f"Bearer {api_key}"

    def ingest(self):
        """Fetch and store Sirene records."""
        if self.sirets:
            self._ingest_by_sirets(self.sirets)
        else:
            self._ingest_bulk()

    def _ingest_by_sirets(self, sirets: list[str]):
        """Fetch specific enterprises by SIRET."""
        for siret in sirets:
            try:
                data = self.fetch_page(f"{SIRENE_BASE}/siret/{siret}")
                etablissement = data.get("etablissement", {})
                self.stats["fetched"] += 1
                if not self.dry_run:
                    self._store_etablissement(etablissement)
            except Exception as e:
                self.stats["errors"] += 1
                print(f"  Error fetching SIRET {siret}: {e}")

    def _ingest_bulk(self):
        """Bulk fetch enterprises with filters."""
        # Build query parameters
        q_parts = []
        if self.department:
            q_parts.append(f"codePostalEtablissement:{self.department}*")
        if self.naf:
            q_parts.append(f"activitePrincipaleEtablissement:{self.naf}")

        params = {
            "nombre": min(self.max_records, 1000),
        }
        if q_parts:
            params["q"] = " AND ".join(q_parts)

        url = f"{SIRENE_BASE}/siret"
        cursor = "*"
        total_fetched = 0

        while total_fetched < self.max_records:
            if cursor:
                params["curseur"] = cursor

            try:
                data = self.fetch_page(url, params)
            except Exception as e:
                print(f"  Error fetching bulk: {e}")
                break

            etablissements = data.get("etablissements", [])
            header = data.get("header", {})
            cursor = header.get("curseurSuivant")

            if not etablissements:
                break

            self.stats["fetched"] += len(etablissements)
            total_fetched += len(etablissements)

            if self.dry_run:
                print(f"[DRY RUN] Fetched {total_fetched} Sirene records")
                if total_fetched <= len(etablissements):
                    print(f"Sample: {json.dumps(etablissements[0], indent=2, ensure_ascii=False)[:500]}")
            else:
                for etab in etablissements:
                    self._store_etablissement(etab)

            if not cursor or cursor == "":
                break

    def _store_etablissement(self, etab: dict):
        """Upsert a single établissement into the entities table."""
        unite = etab.get("uniteLegale", {})
        adresse = etab.get("adresseEtablissement", {})
        periodes = etab.get("periodesEtablissement", [])
        derniere = periodes[0] if periodes else {}

        siren = etab.get("siren")
        siret = etab.get("siret")
        if not siren:
            return

        # Build entity name
        denom = unite.get("denominationUniteLegale") or ""
        prenom = unite.get("prenomUsuelUniteLegale") or ""
        nom = unite.get("nomUsageUniteLegale") or unite.get("nomUniteLegale") or ""
        name = denom if denom else f"{prenom} {nom}".strip()

        with get_conn() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute("""
                        INSERT INTO entities (
                            siren, siret, name, legal_form, entity_type,
                            naf_code, address, postal_code, city,
                            department_code, creation_date,
                            employee_count, source, raw_data
                        ) VALUES (
                            %(siren)s, %(siret)s, %(name)s, %(legal)s, %(type)s,
                            %(naf)s, %(address)s, %(postal)s, %(city)s,
                            %(dept)s, %(creation)s,
                            %(employees)s, 'sirene', %(raw)s
                        )
                        ON CONFLICT (siren) DO UPDATE SET
                            siret = COALESCE(EXCLUDED.siret, entities.siret),
                            name = EXCLUDED.name,
                            naf_code = EXCLUDED.naf_code,
                            employee_count = EXCLUDED.employee_count,
                            raw_data = EXCLUDED.raw_data,
                            updated_at = NOW()
                    """, {
                        "siren": siren,
                        "siret": siret,
                        "name": name or "Inconnu",
                        "legal": unite.get("categorieJuridiqueUniteLegale"),
                        "type": _classify_entity(unite),
                        "naf": derniere.get("activitePrincipaleEtablissement"),
                        "address": _build_address(adresse),
                        "postal": adresse.get("codePostalEtablissement"),
                        "city": adresse.get("libelleCommuneEtablissement"),
                        "dept": (adresse.get("codePostalEtablissement") or "")[:2] or None,
                        "creation": unite.get("dateCreationUniteLegale"),
                        "employees": _parse_employee_range(
                            unite.get("trancheEffectifsUniteLegale")),
                        "raw": json.dumps(etab, ensure_ascii=False),
                    })
                    self.stats["inserted"] += 1
                except Exception as e:
                    self.stats["errors"] += 1


def _classify_entity(unite: dict) -> str:
    """Classify entity type from legal category."""
    cat = unite.get("categorieJuridiqueUniteLegale", "")
    if cat.startswith("7"):
        return "public_org"
    if cat.startswith("9"):
        return "association"
    return "company"


def _build_address(adresse: dict) -> str | None:
    """Build full address string."""
    parts = [
        adresse.get("numeroVoieEtablissement"),
        adresse.get("typeVoieEtablissement"),
        adresse.get("libelleVoieEtablissement"),
    ]
    addr = " ".join(p for p in parts if p)
    return addr if addr else None


# INSEE employee range codes → approximate counts
_EMPLOYEE_RANGES = {
    "00": 0, "01": 2, "02": 5, "03": 9, "11": 15, "12": 30,
    "21": 75, "22": 150, "31": 350, "32": 750, "41": 1500,
    "42": 3500, "51": 7500, "52": 9999,
}


def _parse_employee_range(code: str) -> int | None:
    if not code:
        return None
    return _EMPLOYEE_RANGES.get(code)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest INSEE Sirene enterprises")
    parser.add_argument("--sirets", nargs="+", help="Specific SIRETs to fetch")
    parser.add_argument("--department", type=str, help="Filter by department postal code prefix")
    parser.add_argument("--naf", type=str, help="Filter by NAF/APE code")
    parser.add_argument("--max", type=int, default=1000, help="Max records")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ingester = SireneIngester(
        sirets=args.sirets, department=args.department,
        naf=args.naf, max_records=args.max, dry_run=args.dry_run
    )
    ingester.run()

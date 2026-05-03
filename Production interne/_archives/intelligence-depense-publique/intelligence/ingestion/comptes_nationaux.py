"""Comptes nationaux — Dépense publique consolidée COFOG.

Ingests consolidated public spending by function (COFOG classification)
from Eurostat (gov_10a_exp dataset).

COFOG categories:
01 - Services généraux des administrations publiques
02 - Défense
03 - Ordre et sécurité publics
04 - Affaires économiques
05 - Protection de l'environnement
06 - Logement et équipements collectifs
07 - Santé
08 - Loisirs, culture et culte
09 - Enseignement
10 - Protection sociale
GF_TOTAL - Total
"""

import json
import argparse

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

EUROSTAT_JSON = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data"
DATASET = "gov_10a_exp"

# COFOG labels in French
COFOG_LABELS = {
    "GF01": "Services publics généraux",
    "GF02": "Défense",
    "GF03": "Ordre et sécurité publics",
    "GF04": "Affaires économiques",
    "GF05": "Protection de l'environnement",
    "GF06": "Logement et équipements collectifs",
    "GF07": "Santé",
    "GF08": "Loisirs, culture et culte",
    "GF09": "Enseignement",
    "GF10": "Protection sociale",
    "TOTAL": "Total dépenses publiques",
}

# Countries to track (ISO 2-letter)
COUNTRIES = ["FR", "DE", "IT", "ES", "NL", "BE", "AT", "SE", "DK", "FI",
             "IE", "PT", "EL", "EU27_2020"]

# Map ISO2 → ISO3 for our DB
ISO2_TO_ISO3 = {
    "FR": "FRA", "DE": "DEU", "IT": "ITA", "ES": "ESP",
    "NL": "NLD", "BE": "BEL", "AT": "AUT", "SE": "SWE",
    "DK": "DNK", "FI": "FIN", "IE": "IRL", "PT": "PRT",
    "EL": "GRC", "EU27_2020": "EU",
}


class ComptesNationauxIngester(BaseIngester):
    """Ingest COFOG public spending data from Eurostat."""

    source_name = "cofog"

    def __init__(self, countries: list[str] = None, **kwargs):
        super().__init__(**kwargs)
        self.countries = countries or COUNTRIES

    def ingest(self):
        """Fetch COFOG data from Eurostat JSON-stat API."""
        # Fetch % of GDP data
        self._ingest_unit("PC_GDP")
        # Fetch absolute amounts (million EUR)
        self._ingest_unit("MIO_EUR")

    def _ingest_unit(self, unit: str):
        """Fetch COFOG data for a specific unit.

        Eurostat's multi-value geo filter (FR+DE) doesn't work,
        so we query one country at a time.
        """
        all_observations = []

        for country in self.countries:
            url = (
                f"{EUROSTAT_JSON}/{DATASET}"
                f"?geo={country}"
                f"&unit={unit}"
                f"&sector=S13"  # General government
                f"&na_item=TE"  # Total expenditure
                f"&format=JSON&lang=FR"
            )

            try:
                data = self.fetch_page(url)
                observations = self._parse_jsonstat(data, unit)
                all_observations.extend(observations)
                print(f"  {country} ({unit}): {len(observations)} obs")
            except Exception as e:
                print(f"  Error fetching {country} ({unit}): {e}")

        self.stats["fetched"] += len(all_observations)

        if self.dry_run:
            print(f"[DRY RUN] COFOG ({unit}): {len(all_observations)} total observations")
            for obs in all_observations[:5]:
                print(f"  {obs['country']} {obs['year']} {obs['cofog']}: {obs['value']}")
            return

        self._store_observations(all_observations, unit)

    def _parse_jsonstat(self, data: dict, unit: str) -> list[dict]:
        """Parse Eurostat JSON-stat into flat observations."""
        observations = []

        dimension = data.get("dimension", {})
        values = data.get("value", {})
        sizes = data.get("size", [])
        dim_ids = data.get("id", [])

        if not values or not dim_ids:
            print(f"  No data returned for unit={unit}")
            return observations

        # Build dimension maps
        dim_maps = {}
        for dim_id in dim_ids:
            dim_data = dimension.get(dim_id, {})
            cat = dim_data.get("category", {})
            idx = cat.get("index", {})
            label = cat.get("label", {})
            rev = {v: k for k, v in idx.items()}
            dim_maps[dim_id] = {"reverse_index": rev, "labels": label}

        # Decode flat observations
        for flat_idx_str, value in values.items():
            flat_idx = int(flat_idx_str)

            indices = []
            remaining = flat_idx
            for i in range(len(sizes) - 1, -1, -1):
                indices.insert(0, remaining % sizes[i])
                remaining //= sizes[i]

            obs = {}
            for i, dim_id in enumerate(dim_ids):
                code = dim_maps[dim_id]["reverse_index"].get(indices[i], "")
                obs[dim_id] = code

            geo = obs.get("geo", "")
            time_str = obs.get("time", obs.get("TIME_PERIOD", ""))
            cofog = obs.get("cofog99", "")

            if not time_str or not geo or not cofog:
                continue

            try:
                year = int(str(time_str)[:4])
            except (ValueError, TypeError):
                continue

            # Only keep top-level COFOG codes (GF01-GF10, TOTAL)
            if cofog not in COFOG_LABELS:
                continue

            observations.append({
                "country": geo,
                "country_code": ISO2_TO_ISO3.get(geo, geo[:3]),
                "year": year,
                "cofog": cofog,
                "cofog_label": COFOG_LABELS.get(cofog, cofog),
                "value": value,
                "unit": unit,
            })

        return observations

    def _store_observations(self, observations: list[dict], unit: str):
        """Store COFOG observations in depense_publique_cofog."""
        # Group by (country, year, cofog) to merge PC_GDP and MIO_EUR
        with get_conn() as conn:
            with conn.cursor() as cur:
                for obs in observations:
                    try:
                        cur.execute("SAVEPOINT sp")

                        if unit == "PC_GDP":
                            cur.execute("""
                                INSERT INTO depense_publique_cofog (
                                    year, country_code, cofog_code, cofog_label,
                                    pct_gdp, source, raw_data
                                ) VALUES (
                                    %(year)s, %(cc)s, %(cofog)s, %(label)s,
                                    %(val)s, 'eurostat', %(raw)s
                                )
                                ON CONFLICT (year, country_code, cofog_code) DO UPDATE SET
                                    pct_gdp = EXCLUDED.pct_gdp,
                                    cofog_label = EXCLUDED.cofog_label
                            """, {
                                "year": obs["year"],
                                "cc": obs["country_code"],
                                "cofog": obs["cofog"],
                                "label": obs["cofog_label"],
                                "val": obs["value"],
                                "raw": json.dumps(obs, ensure_ascii=False),
                            })
                        elif unit == "MIO_EUR":
                            # Convert millions EUR to centimes
                            amount_cents = int(obs["value"] * 1_000_000 * 100) if obs["value"] else None
                            cur.execute("""
                                INSERT INTO depense_publique_cofog (
                                    year, country_code, cofog_code, cofog_label,
                                    amount, source, raw_data
                                ) VALUES (
                                    %(year)s, %(cc)s, %(cofog)s, %(label)s,
                                    %(amount)s, 'eurostat', %(raw)s
                                )
                                ON CONFLICT (year, country_code, cofog_code) DO UPDATE SET
                                    amount = EXCLUDED.amount,
                                    cofog_label = EXCLUDED.cofog_label
                            """, {
                                "year": obs["year"],
                                "cc": obs["country_code"],
                                "cofog": obs["cofog"],
                                "label": obs["cofog_label"],
                                "amount": amount_cents,
                                "raw": json.dumps(obs, ensure_ascii=False),
                            })

                        self.stats["inserted"] += 1
                        cur.execute("RELEASE SAVEPOINT sp")

                    except Exception as e:
                        cur.execute("ROLLBACK TO SAVEPOINT sp")
                        self.stats["errors"] += 1
                        if self.stats["errors"] <= 5:
                            print(f"  Store error: {e}")

        print(f"  COFOG ({unit}): {self.stats['inserted']} records stored")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest COFOG public spending (Eurostat)")
    parser.add_argument("--countries", nargs="+", help="Country codes (e.g. FR DE)")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ingester = ComptesNationauxIngester(
        countries=args.countries, dry_run=args.dry_run
    )
    ingester.run()

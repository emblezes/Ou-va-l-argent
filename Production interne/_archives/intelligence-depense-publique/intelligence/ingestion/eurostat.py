"""Eurostat — EU public spending data (COFOG classification).

Source: https://ec.europa.eu/eurostat
API: SDMX 2.1
Dépenses publiques par fonction, dette, déficit pour tous les pays UE.
"""

import json
import argparse

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

EUROSTAT_BASE = "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1"

# Key datasets for public spending analysis
KEY_DATASETS = {
    "gov_10a_exp": {
        "name": "Dépenses publiques par fonction (COFOG)",
        "description": "Government expenditure by function",
        "frequency": "annual",
        "unit": "PC_GDP",  # % of GDP
    },
    "gov_10dd_edpt1": {
        "name": "Dette publique UE (Maastricht)",
        "description": "Government debt, Maastricht criteria",
        "frequency": "annual",
        "unit": "PC_GDP",
    },
    "gov_10a_main": {
        "name": "Indicateurs principaux finances publiques",
        "description": "Main government indicators",
        "frequency": "annual",
        "unit": "PC_GDP",
    },
}

# Focus countries
COUNTRIES = ["FR", "DE", "IT", "ES", "NL", "BE", "AT", "PT", "IE", "EU27_2020"]


class EurostatIngester(BaseIngester):
    """Ingest EU public spending data from Eurostat."""

    source_name = "eurostat"

    def __init__(self, datasets: list[str] = None,
                 countries: list[str] = None, **kwargs):
        super().__init__(**kwargs)
        self.datasets = datasets or list(KEY_DATASETS.keys())
        self.countries = countries or COUNTRIES

    def ingest(self):
        """Fetch and store Eurostat data."""
        for dataset_id in self.datasets:
            try:
                self._ingest_dataset(dataset_id)
            except Exception as e:
                self.stats["errors"] += 1
                print(f"  Error on dataset {dataset_id}: {e}")

    def _ingest_dataset(self, dataset_id: str):
        """Fetch a single Eurostat dataset via JSON endpoint."""
        # Use the simpler JSON-stat endpoint
        geo_filter = "+".join(self.countries)
        url = (
            f"https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/"
            f"{dataset_id}?geo={geo_filter}&format=JSON&lang=FR"
        )

        data = self.fetch_page(url)
        observations = self._parse_jsonstat(data, dataset_id)
        self.stats["fetched"] += len(observations)

        info = KEY_DATASETS.get(dataset_id, {})
        if self.dry_run:
            print(f"[DRY RUN] {info.get('name', dataset_id)}: {len(observations)} obs")
            return

        self._store_observations(observations, dataset_id, info)

    def _parse_jsonstat(self, data: dict, dataset_id: str) -> list[dict]:
        """Parse Eurostat JSON-stat format."""
        observations = []

        try:
            dimension = data.get("dimension", {})
            values = data.get("value", {})
            sizes = data.get("size", [])
            dim_ids = data.get("id", [])

            if not values or not dim_ids:
                return observations

            # Build dimension value maps
            dim_maps = {}
            for dim_id in dim_ids:
                dim_data = dimension.get(dim_id, {})
                cat = dim_data.get("category", {})
                idx = cat.get("index", {})
                label = cat.get("label", {})
                # Reverse index: position → code
                rev = {v: k for k, v in idx.items()}
                dim_maps[dim_id] = {"reverse_index": rev, "labels": label}

            # Iterate through flat observation array
            for flat_idx_str, value in values.items():
                flat_idx = int(flat_idx_str)

                # Decompose flat index into dimension indices
                indices = []
                remaining = flat_idx
                for i in range(len(sizes) - 1, -1, -1):
                    indices.insert(0, remaining % sizes[i])
                    remaining //= sizes[i]

                # Build observation dict
                obs = {"value": value}
                for i, dim_id in enumerate(dim_ids):
                    code = dim_maps[dim_id]["reverse_index"].get(indices[i], "")
                    obs[dim_id] = code

                observations.append(obs)

        except (KeyError, IndexError, ValueError) as e:
            print(f"  Parse error for {dataset_id}: {e}")

        return observations

    def _store_observations(self, observations: list[dict],
                           dataset_id: str, info: dict):
        """Store Eurostat observations in economic_series."""
        with get_conn() as conn:
            with conn.cursor() as cur:
                for obs in observations:
                    try:
                        geo = obs.get("geo", "")
                        time_period = obs.get("time", obs.get("TIME_PERIOD", ""))
                        value = obs.get("value")

                        if value is None or not time_period:
                            continue

                        date = _period_to_date(time_period)
                        if not date:
                            continue

                        # Build a composite series key
                        cofog = obs.get("cofog99", "")
                        sector = obs.get("sector", "")
                        na_item = obs.get("na_item", "")
                        unit = obs.get("unit", info.get("unit", ""))

                        series_key = f"eurostat:{dataset_id}:{geo}"
                        if cofog:
                            series_key += f":{cofog}"
                        if na_item:
                            series_key += f":{na_item}"

                        name = info.get("name", dataset_id)
                        if cofog:
                            name += f" ({cofog})"

                        cur.execute("""
                            INSERT INTO economic_series (
                                series_key, source, name, unit,
                                frequency, country_code,
                                observation_date, value, raw_data
                            ) VALUES (
                                %(key)s, 'eurostat', %(name)s, %(unit)s,
                                %(freq)s, %(geo)s,
                                %(date)s, %(value)s, %(raw)s
                            )
                            ON CONFLICT (series_key, source, observation_date) DO UPDATE SET
                                value = EXCLUDED.value
                        """, {
                            "key": series_key,
                            "name": name,
                            "unit": unit,
                            "freq": info.get("frequency", "annual"),
                            "geo": geo[:3],
                            "date": date,
                            "value": value,
                            "raw": json.dumps(obs, ensure_ascii=False),
                        })
                        self.stats["inserted"] += 1

                    except Exception as e:
                        self.stats["errors"] += 1


def _period_to_date(period: str) -> str | None:
    """Convert Eurostat period to date."""
    try:
        if len(period) == 4:
            return f"{period}-01-01"
        if "Q" in period:
            parts = period.replace("Q", "-Q").split("-Q") if "-Q" not in period else period.split("-Q")
            year = parts[0]
            q = int(parts[1])
            month = (q - 1) * 3 + 1
            return f"{year}-{month:02d}-01"
        return None
    except (ValueError, IndexError):
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Eurostat public spending data")
    parser.add_argument("--datasets", nargs="+", help="Specific dataset IDs")
    parser.add_argument("--countries", nargs="+", help="Country codes (e.g. FR DE)")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ingester = EurostatIngester(
        datasets=args.datasets, countries=args.countries,
        dry_run=args.dry_run
    )
    ingester.run()

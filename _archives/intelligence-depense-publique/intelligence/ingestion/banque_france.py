"""Banque de France — Webstat economic series.

Source: https://www.banque-france.fr/statistiques
API: REST (Webstat)
40k+ economic time series (credit, inflation, GDP, etc.)
"""

import os
import json
import argparse
from datetime import datetime

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

BDF_BASE = "https://api.webstat.banque-france.fr/webstat-fr/v1"

# Key economic series for public finance analysis
KEY_SERIES = {
    # Inflation
    "FM.M.FR.EUR.4F.KR.DFR.CHG": {
        "name": "Inflation France (IPCH)",
        "unit": "%",
        "frequency": "monthly",
    },
    # Government debt
    "QSA.Q.N.FR.W2.S13.S1.D.F.L._T._Z.XDC._T.S.V.N._T": {
        "name": "Dette publique France",
        "unit": "EUR",
        "frequency": "quarterly",
    },
    # Interest rates
    "FM.M.FR.EUR.4F.KR.MLFR.CHG": {
        "name": "Taux directeur BCE",
        "unit": "%",
        "frequency": "monthly",
    },
}


class BanqueFranceIngester(BaseIngester):
    """Ingest economic series from Banque de France Webstat."""

    source_name = "banque_france"

    def __init__(self, series_keys: list[str] = None,
                 start_date: str = "2010-01-01", **kwargs):
        super().__init__(**kwargs)
        self.series_keys = series_keys or list(KEY_SERIES.keys())
        self.start_date = start_date

        api_key = os.getenv("BDF_API_KEY")
        if api_key:
            self.client.headers["Ocp-Apim-Subscription-Key"] = api_key

    def ingest(self):
        """Fetch and store economic series."""
        for key in self.series_keys:
            try:
                self._ingest_series(key)
            except Exception as e:
                self.stats["errors"] += 1
                print(f"  Error on series {key}: {e}")

    def _ingest_series(self, series_key: str):
        """Fetch a single series."""
        url = f"{BDF_BASE}/data/{series_key}"
        params = {
            "startPeriod": self.start_date,
            "format": "json",
        }

        data = self.fetch_page(url, params)
        observations = self._extract_observations(data, series_key)
        self.stats["fetched"] += len(observations)

        if self.dry_run:
            info = KEY_SERIES.get(series_key, {})
            print(f"[DRY RUN] {info.get('name', series_key)}: {len(observations)} observations")
            return

        self._store_observations(observations, series_key)

    def _extract_observations(self, data: dict, series_key: str) -> list[dict]:
        """Extract time series observations from SDMX-JSON response."""
        observations = []

        try:
            datasets = data.get("dataSets", [{}])
            if not datasets:
                return observations

            series = datasets[0].get("series", {})
            structure = data.get("structure", {})
            dimensions = structure.get("dimensions", {}).get("observation", [])

            # Find time dimension
            time_dim = None
            for dim in dimensions:
                if dim.get("id") == "TIME_PERIOD":
                    time_dim = dim
                    break

            if not time_dim:
                return observations

            time_values = time_dim.get("values", [])

            for series_key_str, series_data in series.items():
                obs = series_data.get("observations", {})
                for idx_str, values in obs.items():
                    idx = int(idx_str)
                    if idx < len(time_values):
                        period = time_values[idx].get("id", "")
                        value = values[0] if values else None
                        if value is not None:
                            observations.append({
                                "period": period,
                                "value": value,
                            })
        except (KeyError, IndexError) as e:
            print(f"  Parse error for {series_key}: {e}")

        return observations

    def _store_observations(self, observations: list[dict], series_key: str):
        """Store observations in economic_series table."""
        info = KEY_SERIES.get(series_key, {})

        with get_conn() as conn:
            with conn.cursor() as cur:
                for obs in observations:
                    try:
                        date = _parse_period(obs["period"])
                        if not date:
                            continue

                        cur.execute("""
                            INSERT INTO economic_series (
                                series_key, source, name, unit,
                                frequency, country_code,
                                observation_date, value
                            ) VALUES (
                                %(key)s, 'banque_france', %(name)s, %(unit)s,
                                %(freq)s, 'FRA',
                                %(date)s, %(value)s
                            )
                            ON CONFLICT (series_key, source, observation_date) DO UPDATE SET
                                value = EXCLUDED.value
                        """, {
                            "key": series_key,
                            "name": info.get("name", series_key),
                            "unit": info.get("unit"),
                            "freq": info.get("frequency"),
                            "date": date,
                            "value": obs["value"],
                        })
                        self.stats["inserted"] += 1
                    except Exception as e:
                        self.stats["errors"] += 1


def _parse_period(period: str) -> str | None:
    """Convert SDMX period to date string (YYYY-MM-DD)."""
    try:
        if len(period) == 4:  # Annual: 2023
            return f"{period}-01-01"
        if "Q" in period:  # Quarterly: 2023-Q1
            year, q = period.split("-Q")
            month = (int(q) - 1) * 3 + 1
            return f"{year}-{month:02d}-01"
        if len(period) == 7:  # Monthly: 2023-01
            return f"{period}-01"
        return period
    except (ValueError, IndexError):
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Banque de France series")
    parser.add_argument("--series", nargs="+", help="Specific series keys")
    parser.add_argument("--start", default="2010-01-01", help="Start date")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ingester = BanqueFranceIngester(
        series_keys=args.series, start_date=args.start,
        dry_run=args.dry_run
    )
    ingester.run()

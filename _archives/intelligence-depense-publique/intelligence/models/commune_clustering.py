"""Commune clustering — Group similar communes by budget profile.

Uses K-means to identify peer groups for meaningful comparisons.
"""

import argparse
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import fetch_all, get_conn


class CommuneClustering:
    """Cluster communes by financial profile for peer comparison."""

    def __init__(self, n_clusters: int = 8):
        self.n_clusters = n_clusters
        self.model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        self.scaler = StandardScaler()

    def fit(self, year: int = 2023, min_population: int = 500) -> pd.DataFrame:
        """Cluster communes for a given year.

        Returns DataFrame with commune data + cluster assignment.
        """
        query = """
            SELECT cb.code_insee, cb.year, cb.population,
                   cb.exp_total, cb.exp_personnel, cb.exp_purchases,
                   cb.exp_financial, cb.rev_total, cb.rev_fiscal,
                   cb.rev_dotations, cb.inv_expenditure,
                   cb.debt_total, cb.debt_per_capita,
                   cb.exp_per_capita, cb.savings_rate,
                   c.name, c.department_code, c.strate, c.epci_name
            FROM commune_budgets cb
            JOIN communes c ON c.code_insee = cb.code_insee
            WHERE cb.year = %s AND cb.population >= %s
              AND cb.exp_total IS NOT NULL AND cb.rev_total IS NOT NULL
        """
        rows = fetch_all(query, (year, min_population))
        if not rows:
            print(f"No data for year {year}")
            return pd.DataFrame()

        df = pd.DataFrame(rows)
        print(f"Clustering {len(df)} communes...")

        features = self._build_features(df)
        X = self.scaler.fit_transform(features)

        labels = self.model.fit_predict(X)
        df["cluster"] = labels

        # Name clusters by their dominant characteristic
        cluster_profiles = self._profile_clusters(df, features)
        df["cluster_name"] = df["cluster"].map(
            {k: v["name"] for k, v in cluster_profiles.items()}
        )

        print(f"\nCluster distribution:")
        for cluster_id, profile in sorted(cluster_profiles.items()):
            count = (df["cluster"] == cluster_id).sum()
            print(f"  Cluster {cluster_id} ({profile['name']}): {count} communes")

        return df

    def _build_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Build clustering features (ratios, not absolutes)."""
        features = pd.DataFrame(index=df.index)
        pop = df["population"].clip(lower=1).astype(float)
        exp = df["exp_total"].fillna(1).clip(lower=1).astype(float)
        rev = df["rev_total"].fillna(1).clip(lower=1).astype(float)

        features["log_population"] = np.log1p(pop)
        features["exp_per_capita"] = exp / pop
        features["personnel_ratio"] = df["exp_personnel"].fillna(0).astype(float) / exp
        features["purchases_ratio"] = df["exp_purchases"].fillna(0).astype(float) / exp
        features["financial_ratio"] = df["exp_financial"].fillna(0).astype(float) / exp
        features["fiscal_autonomy"] = df["rev_fiscal"].fillna(0).astype(float) / rev
        features["dotations_ratio"] = df["rev_dotations"].fillna(0).astype(float) / rev
        features["inv_intensity"] = df["inv_expenditure"].fillna(0).astype(float) / exp
        features["debt_per_capita"] = df["debt_total"].fillna(0).astype(float) / pop
        features["savings_rate"] = df["savings_rate"].fillna(0).astype(float)

        return features.fillna(0)

    def _profile_clusters(self, df: pd.DataFrame, features: pd.DataFrame) -> dict:
        """Generate descriptive names for each cluster."""
        profiles = {}

        for cluster_id in range(self.n_clusters):
            mask = df["cluster"] == cluster_id
            if not mask.any():
                continue

            cluster_data = df[mask]
            avg_pop = cluster_data["population"].mean()
            avg_exp = cluster_data["exp_per_capita"].mean() if "exp_per_capita" in cluster_data else 0
            avg_debt = cluster_data["debt_per_capita"].mean() if "debt_per_capita" in cluster_data else 0
            avg_savings = cluster_data["savings_rate"].mean() if "savings_rate" in cluster_data else 0

            # Generate name based on dominant characteristics
            name_parts = []
            if avg_pop > 50000:
                name_parts.append("Grandes villes")
            elif avg_pop > 10000:
                name_parts.append("Villes moyennes")
            elif avg_pop > 3000:
                name_parts.append("Petites villes")
            else:
                name_parts.append("Communes rurales")

            if avg_debt and avg_debt > df["debt_per_capita"].median() * 1.5:
                name_parts.append("endettées")
            elif avg_savings and avg_savings > 15:
                name_parts.append("épargnantes")

            name = " ".join(name_parts) if name_parts else f"Groupe {cluster_id}"
            profiles[cluster_id] = {
                "name": name,
                "count": int(mask.sum()),
                "avg_population": int(avg_pop),
                "avg_exp_per_capita": float(avg_exp) if avg_exp else 0,
                "avg_debt_per_capita": float(avg_debt) if avg_debt else 0,
            }

        return profiles

    def find_peers(self, code_insee: str, df: pd.DataFrame, n: int = 10) -> pd.DataFrame:
        """Find the N most similar communes to a given commune."""
        if code_insee not in df["code_insee"].values:
            print(f"Commune {code_insee} not found")
            return pd.DataFrame()

        target = df[df["code_insee"] == code_insee].iloc[0]
        cluster = target["cluster"]

        peers = df[
            (df["cluster"] == cluster) &
            (df["code_insee"] != code_insee)
        ].copy()

        # Rank by population proximity
        peers["pop_distance"] = abs(peers["population"] - target["population"])
        peers = peers.sort_values("pop_distance").head(n)

        return peers[["code_insee", "name", "population", "department_code",
                      "exp_per_capita", "debt_per_capita", "savings_rate", "cluster_name"]]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Cluster communes by budget profile")
    parser.add_argument("--year", type=int, default=2023)
    parser.add_argument("--clusters", type=int, default=8)
    parser.add_argument("--min-pop", type=int, default=500)
    parser.add_argument("--peers-of", type=str, help="Find peers of a commune (INSEE code)")
    args = parser.parse_args()

    clustering = CommuneClustering(n_clusters=args.clusters)
    df = clustering.fit(year=args.year, min_population=args.min_pop)

    if args.peers_of and not df.empty:
        print(f"\nPeers of {args.peers_of}:")
        peers = clustering.find_peers(args.peers_of, df)
        if not peers.empty:
            print(peers.to_string(index=False))

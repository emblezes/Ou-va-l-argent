"""Anomaly detection on public spending data.

Uses Isolation Forest for rapid outlier detection on contracts and budgets.
Detects: abnormal prices, suspicious patterns, budget drifts.
"""

import json
import argparse
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn, fetch_all


class ContractAnomalyDetector:
    """Detect anomalous public procurement contracts using Isolation Forest."""

    def __init__(self, contamination: float = 0.05):
        """
        Args:
            contamination: Expected proportion of anomalies (default 5%).
        """
        self.contamination = contamination
        self.model = IsolationForest(
            contamination=contamination,
            n_estimators=200,
            max_samples="auto",
            random_state=42,
            n_jobs=-1,
        )
        self.scaler = StandardScaler()

    def detect(self, min_amount: int = 100000, cpv_prefix: str = None) -> pd.DataFrame:
        """Run anomaly detection on contracts.

        Args:
            min_amount: Minimum contract amount in centimes (default 1000€).
            cpv_prefix: Filter by CPV code prefix (e.g. "45" for construction).

        Returns:
            DataFrame of anomalous contracts with scores.
        """
        # Fetch contracts from DB
        where_clauses = ["amount IS NOT NULL", f"amount >= {min_amount}"]
        if cpv_prefix:
            where_clauses.append(f"cpv_code LIKE '{cpv_prefix}%'")

        where = " AND ".join(where_clauses)
        query = f"""
            SELECT id, boamp_id, contract_type, cpv_code, cpv_label,
                   title, buyer_name, buyer_siret, winner_name, winner_siret,
                   amount, amount_min, amount_max, duration_months,
                   nb_offers, publication_date
            FROM contracts
            WHERE {where}
            ORDER BY publication_date DESC
        """

        rows = fetch_all(query)
        if not rows:
            print("No contracts found matching criteria")
            return pd.DataFrame()

        df = pd.DataFrame(rows)
        print(f"Analyzing {len(df)} contracts...")

        # Feature engineering
        features = self._build_features(df)
        if features.empty:
            return pd.DataFrame()

        # Scale features
        X = self.scaler.fit_transform(features)

        # Fit and predict
        self.model.fit(X)
        scores = self.model.decision_function(X)
        predictions = self.model.predict(X)

        # Add results to dataframe
        df["anomaly_score"] = -scores  # Higher = more anomalous
        df["is_anomaly"] = predictions == -1

        # Filter anomalies and sort by score
        anomalies = df[df["is_anomaly"]].sort_values("anomaly_score", ascending=False)
        print(f"Found {len(anomalies)} anomalies ({len(anomalies)/len(df)*100:.1f}%)")

        return anomalies

    def _build_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Build feature matrix for anomaly detection."""
        features = pd.DataFrame()

        # Amount features
        features["amount"] = df["amount"].astype(float)
        features["amount_log"] = np.log1p(df["amount"].astype(float))

        # Duration
        features["duration"] = df["duration_months"].fillna(12).astype(float)

        # Amount per month
        features["amount_per_month"] = features["amount"] / features["duration"].clip(lower=1)

        # Number of offers (competition level)
        features["nb_offers"] = df["nb_offers"].fillna(1).astype(float)

        # Amount range ratio (if both min and max exist)
        has_range = df["amount_min"].notna() & df["amount_max"].notna()
        features["range_ratio"] = np.where(
            has_range,
            df["amount_max"].fillna(0).astype(float) / df["amount_min"].fillna(1).clip(lower=1).astype(float),
            1.0
        )

        # CPV code group (first 2 digits → numeric)
        features["cpv_group"] = df["cpv_code"].apply(
            lambda x: int(str(x)[:2]) if pd.notna(x) and str(x)[:2].isdigit() else 0
        ).astype(float)

        # Amount vs CPV group average (z-score within group)
        group_stats = features.groupby("cpv_group")["amount"].transform
        features["amount_vs_group_mean"] = (
            (features["amount"] - group_stats("mean")) / group_stats("std").clip(lower=1)
        ).fillna(0)

        return features.fillna(0)

    def store_anomalies(self, anomalies: pd.DataFrame):
        """Store detected anomalies in the database."""
        if anomalies.empty:
            return

        with get_conn() as conn:
            with conn.cursor() as cur:
                for _, row in anomalies.iterrows():
                    severity = _score_to_severity(row["anomaly_score"])
                    cur.execute("""
                        INSERT INTO anomalies (
                            entity_type, entity_id, detector,
                            anomaly_type, score, severity,
                            description, details
                        ) VALUES (
                            'contract', %(id)s, 'isolation_forest',
                            'price_outlier', %(score)s, %(severity)s,
                            %(desc)s, %(details)s
                        )
                    """, {
                        "id": row["id"],
                        "score": min(row["anomaly_score"], 1.0),
                        "severity": severity,
                        "desc": _build_description(row),
                        "details": json.dumps({
                            "amount": int(row["amount"]),
                            "cpv_code": row.get("cpv_code"),
                            "nb_offers": int(row.get("nb_offers", 0)),
                            "buyer": row.get("buyer_name"),
                            "winner": row.get("winner_name"),
                        }),
                    })

        print(f"Stored {len(anomalies)} anomalies in database")


class BudgetAnomalyDetector:
    """Detect anomalous commune budgets by comparing to peers."""

    def __init__(self, contamination: float = 0.05):
        self.contamination = contamination
        self.model = IsolationForest(
            contamination=contamination,
            n_estimators=200,
            random_state=42,
            n_jobs=-1,
        )
        self.scaler = StandardScaler()

    def detect(self, year: int = 2023, min_population: int = 1000) -> pd.DataFrame:
        """Detect anomalous commune budgets for a given year."""
        query = """
            SELECT cb.*, c.name, c.department_code, c.strate
            FROM commune_budgets cb
            JOIN communes c ON c.code_insee = cb.code_insee
            WHERE cb.year = %s AND cb.population >= %s
              AND cb.exp_total IS NOT NULL
        """
        rows = fetch_all(query, (year, min_population))
        if not rows:
            print(f"No budget data for year {year}")
            return pd.DataFrame()

        df = pd.DataFrame(rows)
        print(f"Analyzing {len(df)} commune budgets for {year}...")

        features = self._build_features(df)
        X = self.scaler.fit_transform(features)

        self.model.fit(X)
        scores = self.model.decision_function(X)
        df["anomaly_score"] = -scores
        df["is_anomaly"] = self.model.predict(X) == -1

        anomalies = df[df["is_anomaly"]].sort_values("anomaly_score", ascending=False)
        print(f"Found {len(anomalies)} anomalous budgets")
        return anomalies

    def _build_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Build features from commune budget data."""
        features = pd.DataFrame()
        pop = df["population"].clip(lower=1).astype(float)

        # Per-capita spending ratios
        features["exp_per_capita"] = df["exp_total"].fillna(0).astype(float) / pop
        features["personnel_ratio"] = (
            df["exp_personnel"].fillna(0).astype(float) /
            df["exp_total"].fillna(1).clip(lower=1).astype(float)
        )
        features["debt_per_capita"] = df["debt_total"].fillna(0).astype(float) / pop
        features["savings_rate"] = df["savings_rate"].fillna(0).astype(float)

        # Investment intensity
        features["inv_ratio"] = (
            df["inv_expenditure"].fillna(0).astype(float) /
            df["exp_total"].fillna(1).clip(lower=1).astype(float)
        )

        # Revenue dependency
        features["fiscal_autonomy"] = (
            df["rev_fiscal"].fillna(0).astype(float) /
            df["rev_total"].fillna(1).clip(lower=1).astype(float)
        )

        # Financial charges ratio
        features["financial_burden"] = (
            df["exp_financial"].fillna(0).astype(float) /
            df["rev_total"].fillna(1).clip(lower=1).astype(float)
        )

        features["log_population"] = np.log1p(pop)

        return features.fillna(0)


def _score_to_severity(score: float) -> str:
    """Convert anomaly score to severity level."""
    if score > 0.8:
        return "critical"
    if score > 0.6:
        return "high"
    if score > 0.4:
        return "medium"
    return "low"


def _build_description(row) -> str:
    """Build human-readable anomaly description."""
    amount_eur = int(row["amount"]) / 100
    parts = [f"Marché de {amount_eur:,.0f}€"]
    if row.get("cpv_label"):
        parts.append(f"({row['cpv_label']})")
    if row.get("nb_offers") and int(row.get("nb_offers", 0)) <= 1:
        parts.append("— offre unique")
    return " ".join(parts)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Detect spending anomalies")
    parser.add_argument("--type", choices=["contracts", "budgets"], default="contracts")
    parser.add_argument("--year", type=int, default=2023)
    parser.add_argument("--cpv", type=str, help="CPV prefix filter")
    parser.add_argument("--min-amount", type=int, default=100000, help="Min amount (centimes)")
    parser.add_argument("--contamination", type=float, default=0.05)
    parser.add_argument("--store", action="store_true", help="Store results in DB")
    args = parser.parse_args()

    if args.type == "contracts":
        detector = ContractAnomalyDetector(contamination=args.contamination)
        anomalies = detector.detect(min_amount=args.min_amount, cpv_prefix=args.cpv)
        if args.store and not anomalies.empty:
            detector.store_anomalies(anomalies)
    else:
        detector = BudgetAnomalyDetector(contamination=args.contamination)
        anomalies = detector.detect(year=args.year)

    if not anomalies.empty:
        print("\nTop anomalies:")
        for _, row in anomalies.head(10).iterrows():
            if args.type == "contracts":
                print(f"  Score {row['anomaly_score']:.3f} | {int(row['amount'])/100:>12,.0f}€ | {row.get('title', '')[:60]}")
            else:
                print(f"  Score {row['anomaly_score']:.3f} | {row.get('name', '')} ({row.get('code_insee', '')})")

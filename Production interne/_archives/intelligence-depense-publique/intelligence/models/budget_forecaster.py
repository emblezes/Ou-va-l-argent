"""Budget forecasting using Prophet time series model.

Forecasts commune budgets and detects significant deviations
between predicted and actual spending.
"""

import argparse
import pandas as pd
import numpy as np

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import fetch_all, get_conn


class BudgetForecaster:
    """Forecast commune budgets and detect deviations using Prophet."""

    def __init__(self, forecast_years: int = 2):
        self.forecast_years = forecast_years

    def forecast_commune(self, code_insee: str,
                         metric: str = "exp_total") -> dict:
        """Forecast a specific metric for a commune.

        Args:
            code_insee: INSEE code of the commune.
            metric: Budget metric to forecast (exp_total, debt_total, etc.)

        Returns:
            Dict with forecast, actuals, and deviation info.
        """
        try:
            from prophet import Prophet
        except ImportError:
            print("Prophet not installed. Run: pip install prophet")
            return {}

        # Fetch historical data
        query = f"""
            SELECT year, {metric} as value, population
            FROM commune_budgets
            WHERE code_insee = %s AND {metric} IS NOT NULL
            ORDER BY year
        """
        rows = fetch_all(query, (code_insee,))
        if len(rows) < 4:
            return {"error": f"Not enough data points ({len(rows)}) for {code_insee}"}

        # Prepare Prophet format (ds, y)
        df = pd.DataFrame(rows)
        prophet_df = pd.DataFrame({
            "ds": pd.to_datetime(df["year"].astype(str) + "-01-01"),
            "y": df["value"].astype(float),
        })

        # Fit model
        model = Prophet(
            yearly_seasonality=False,
            weekly_seasonality=False,
            daily_seasonality=False,
            changepoint_prior_scale=0.1,
        )
        model.fit(prophet_df)

        # Create future dataframe
        future = model.make_future_dataframe(
            periods=self.forecast_years, freq="YS"
        )
        forecast = model.predict(future)

        # Calculate deviations for historical years
        merged = prophet_df.merge(
            forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]],
            on="ds", how="left"
        )
        merged["deviation"] = (merged["y"] - merged["yhat"]) / merged["yhat"] * 100
        merged["is_outlier"] = (
            (merged["y"] < merged["yhat_lower"]) |
            (merged["y"] > merged["yhat_upper"])
        )

        # Future predictions
        future_preds = forecast[forecast["ds"] > prophet_df["ds"].max()]

        return {
            "code_insee": code_insee,
            "metric": metric,
            "historical": merged.to_dict("records"),
            "forecast": future_preds[["ds", "yhat", "yhat_lower", "yhat_upper"]].to_dict("records"),
            "outlier_years": merged[merged["is_outlier"]]["ds"].dt.year.tolist(),
            "max_deviation_pct": float(merged["deviation"].abs().max()),
            "trend": "increasing" if forecast["trend"].iloc[-1] > forecast["trend"].iloc[0] else "decreasing",
        }

    def detect_budget_drifts(self, year: int = 2023,
                             min_population: int = 5000,
                             deviation_threshold: float = 20.0) -> list[dict]:
        """Find communes with budgets significantly deviating from forecast.

        Args:
            year: Year to check for deviations.
            deviation_threshold: Minimum deviation % to flag.

        Returns:
            List of communes with significant deviations.
        """
        # Get communes with enough history
        query = """
            SELECT DISTINCT code_insee
            FROM commune_budgets
            WHERE population >= %s
            GROUP BY code_insee
            HAVING COUNT(*) >= 4
        """
        communes = fetch_all(query, (min_population,))
        print(f"Analyzing {len(communes)} communes with 4+ years of data...")

        drifts = []
        for i, row in enumerate(communes):
            if (i + 1) % 100 == 0:
                print(f"  Progress: {i+1}/{len(communes)}")

            result = self.forecast_commune(row["code_insee"], "exp_total")
            if "error" in result:
                continue

            if result["max_deviation_pct"] >= deviation_threshold:
                drifts.append(result)

        drifts.sort(key=lambda x: x["max_deviation_pct"], reverse=True)
        print(f"\nFound {len(drifts)} communes with >{deviation_threshold}% budget deviation")
        return drifts


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Forecast commune budgets")
    parser.add_argument("--commune", type=str, help="Specific commune INSEE code")
    parser.add_argument("--metric", default="exp_total",
                       choices=["exp_total", "exp_personnel", "debt_total",
                                "rev_total", "inv_expenditure"])
    parser.add_argument("--detect-drifts", action="store_true",
                       help="Scan all communes for budget drifts")
    parser.add_argument("--year", type=int, default=2023)
    parser.add_argument("--min-pop", type=int, default=5000)
    parser.add_argument("--threshold", type=float, default=20.0,
                       help="Deviation threshold (%)")
    args = parser.parse_args()

    forecaster = BudgetForecaster()

    if args.commune:
        result = forecaster.forecast_commune(args.commune, args.metric)
        if "error" in result:
            print(result["error"])
        else:
            print(f"\nForecast for {args.commune} ({args.metric}):")
            print(f"  Trend: {result['trend']}")
            print(f"  Max deviation: {result['max_deviation_pct']:.1f}%")
            if result["outlier_years"]:
                print(f"  Outlier years: {result['outlier_years']}")
            print(f"\n  Future predictions:")
            for pred in result["forecast"]:
                print(f"    {pred['ds'].strftime('%Y')}: {pred['yhat']:,.0f} "
                      f"[{pred['yhat_lower']:,.0f} - {pred['yhat_upper']:,.0f}]")

    elif args.detect_drifts:
        drifts = forecaster.detect_budget_drifts(
            year=args.year,
            min_population=args.min_pop,
            deviation_threshold=args.threshold,
        )
        for d in drifts[:20]:
            print(f"  {d['code_insee']}: {d['max_deviation_pct']:.1f}% deviation "
                  f"(trend: {d['trend']}, outliers: {d['outlier_years']})")

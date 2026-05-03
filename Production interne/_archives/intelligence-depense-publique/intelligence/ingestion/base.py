"""Base class for data ingestion with shared utilities."""

import time
import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn, fetch_one

log = structlog.get_logger()

# Shared HTTP client config
DEFAULT_TIMEOUT = 30.0
DEFAULT_HEADERS = {
    "User-Agent": "IDP-OuVaLArgent/1.0 (intelligence@ouvalargent.com)"
}


class BaseIngester:
    """Base class for all data source ingesters."""

    source_name: str = "unknown"

    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.client = httpx.Client(
            timeout=DEFAULT_TIMEOUT,
            headers=DEFAULT_HEADERS,
            follow_redirects=True,
        )
        self.stats = {
            "fetched": 0,
            "inserted": 0,
            "updated": 0,
            "errors": 0,
        }
        self.log_id = None

    def start_log(self):
        """Record ingestion start in the log table."""
        if self.dry_run:
            return
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO ingestion_log (source, status)
                       VALUES (%s, 'running') RETURNING id""",
                    (self.source_name,),
                )
                row = cur.fetchone()
                self.log_id = row["id"]

    def finish_log(self, status: str = "success", error: str = None):
        """Record ingestion completion."""
        if self.dry_run or not self.log_id:
            return
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """UPDATE ingestion_log
                       SET finished_at = NOW(), status = %s,
                           records_fetched = %s, records_inserted = %s,
                           records_updated = %s, error_message = %s
                       WHERE id = %s""",
                    (status, self.stats["fetched"], self.stats["inserted"],
                     self.stats["updated"], error, self.log_id),
                )

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, max=10))
    def fetch_page(self, url: str, params: dict = None) -> dict:
        """Fetch a single page from an API with retry."""
        resp = self.client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()

    def fetch_all_pages(self, url: str, params: dict = None,
                        limit: int = 100, max_records: int = None) -> list[dict]:
        """Fetch all pages from an ODS v2.1 API."""
        params = dict(params or {})
        params.setdefault("limit", limit)
        offset = 0
        all_records = []

        while True:
            params["offset"] = offset
            data = self.fetch_page(url, params)
            results = data.get("results", [])
            total = data.get("total_count", 0)

            all_records.extend(results)
            self.stats["fetched"] += len(results)
            offset += limit

            log.info(f"[{self.source_name}] Fetched {len(all_records)}/{total}")

            if not results or offset >= total:
                break
            if max_records and len(all_records) >= max_records:
                break

            time.sleep(0.2)  # Rate limiting

        return all_records

    def run(self):
        """Execute the full ingestion pipeline."""
        log.info(f"Starting ingestion: {self.source_name}", dry_run=self.dry_run)
        self.start_log()
        try:
            self.ingest()
            self.finish_log("success")
            log.info(f"Ingestion complete: {self.source_name}", **self.stats)
        except Exception as e:
            self.finish_log("error", str(e))
            log.error(f"Ingestion failed: {self.source_name}", error=str(e))
            raise

    def ingest(self):
        """Override in subclasses to implement ingestion logic."""
        raise NotImplementedError

    def __del__(self):
        if hasattr(self, "client"):
            self.client.close()

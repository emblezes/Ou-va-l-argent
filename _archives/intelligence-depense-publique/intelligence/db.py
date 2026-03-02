"""Database connection and shared utilities for PostgreSQL + pgvector."""

import os
import json
from contextlib import contextmanager
from pathlib import Path

import psycopg
from psycopg.rows import dict_row

CONFIG_PATH = Path(__file__).parent / "config" / "database.json"


def _load_config() -> dict:
    with open(CONFIG_PATH) as f:
        config = json.load(f)
    pg = config["postgresql"]
    pg["password"] = os.getenv(pg.get("password_env", ""), "postgres")
    return pg


def get_dsn() -> str:
    pg = _load_config()
    password = pg.get('password', '')
    if password:
        return f"postgresql://{pg['user']}:{password}@{pg['host']}:{pg['port']}/{pg['database']}"
    return f"postgresql://{pg['user']}@{pg['host']}:{pg['port']}/{pg['database']}"


@contextmanager
def get_conn():
    """Get a PostgreSQL connection with dict rows."""
    dsn = get_dsn()
    conn = psycopg.connect(dsn, row_factory=dict_row)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


@contextmanager
def get_cursor():
    """Get a PostgreSQL cursor with dict rows."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            yield cur


def execute(sql: str, params=None):
    """Execute a single SQL statement."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)


def fetch_all(sql: str, params=None) -> list[dict]:
    """Execute and fetch all results."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchall()


def fetch_one(sql: str, params=None) -> dict | None:
    """Execute and fetch one result."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchone()


def init_db():
    """Initialize the database schema."""
    schema_path = Path(__file__).parent / "schema.sql"
    with open(schema_path) as f:
        sql = f.read()
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
    print("Database schema initialized successfully.")


if __name__ == "__main__":
    init_db()

"""Configuration module."""

import json
import os
from pathlib import Path

CONFIG_DIR = Path(__file__).parent


def load_sources() -> dict:
    with open(CONFIG_DIR / "sources.json") as f:
        return json.load(f)


def load_database() -> dict:
    with open(CONFIG_DIR / "database.json") as f:
        config = json.load(f)
    # Resolve passwords from env
    if "postgresql" in config:
        env_key = config["postgresql"].get("password_env", "")
        config["postgresql"]["password"] = os.getenv(env_key, "")
    if "neo4j" in config:
        env_key = config["neo4j"].get("password_env", "")
        config["neo4j"]["password"] = os.getenv(env_key, "")
    return config


def get_pg_dsn() -> str:
    db = load_database()["postgresql"]
    pw = db["password"]
    return f"postgresql://{db['user']}:{pw}@{db['host']}:{db['port']}/{db['database']}"

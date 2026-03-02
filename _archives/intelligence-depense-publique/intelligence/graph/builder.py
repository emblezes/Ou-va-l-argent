"""Neo4j graph builder — Constructs the relationship graph.

Nodes: Entities (companies, public orgs), Communes, Officials
Edges: AWARDED_TO, BUYER_OF, RECEIVED_SUBSIDY, ELECTED_IN, etc.
"""

import os
import json
import argparse
from neo4j import GraphDatabase

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import fetch_all
from config import load_database


class GraphBuilder:
    """Build and maintain the Neo4j relationship graph."""

    def __init__(self):
        config = load_database().get("neo4j", {})
        uri = config.get("uri", "bolt://localhost:7687")
        user = config.get("user", "neo4j")
        password = config.get("password", "")
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def build_all(self, dry_run: bool = False):
        """Build the complete graph from PostgreSQL data."""
        print("Building Neo4j graph...")

        if not dry_run:
            self._create_constraints()

        steps = [
            ("Entities (companies)", self._build_entities),
            ("Communes", self._build_communes),
            ("Contracts → relationships", self._build_contract_edges),
            ("Subventions → relationships", self._build_subvention_edges),
        ]

        for name, func in steps:
            print(f"\n  Building: {name}")
            try:
                count = func(dry_run)
                print(f"    → {count} nodes/edges")
            except Exception as e:
                print(f"    → Error: {e}")

    def _create_constraints(self):
        """Create Neo4j constraints and indexes."""
        constraints = [
            "CREATE CONSTRAINT IF NOT EXISTS FOR (e:Entity) REQUIRE e.siren IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (c:Commune) REQUIRE c.code_insee IS UNIQUE",
            "CREATE INDEX IF NOT EXISTS FOR (e:Entity) ON (e.name)",
            "CREATE INDEX IF NOT EXISTS FOR (c:Commune) ON (c.name)",
        ]
        with self.driver.session() as session:
            for cypher in constraints:
                session.run(cypher)

    def _build_entities(self, dry_run: bool) -> int:
        """Create Entity nodes from PostgreSQL entities table."""
        rows = fetch_all("""
            SELECT siren, name, entity_type, naf_code,
                   city, department_code, employee_count
            FROM entities
            WHERE siren IS NOT NULL
            LIMIT 100000
        """)

        if dry_run:
            return len(rows)

        batch_size = 500
        count = 0
        with self.driver.session() as session:
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i+batch_size]
                session.run("""
                    UNWIND $batch AS row
                    MERGE (e:Entity {siren: row.siren})
                    SET e.name = row.name,
                        e.type = row.entity_type,
                        e.naf = row.naf_code,
                        e.city = row.city,
                        e.department = row.department_code,
                        e.employees = row.employee_count
                """, batch=[dict(r) for r in batch])
                count += len(batch)

        return count

    def _build_communes(self, dry_run: bool) -> int:
        """Create Commune nodes."""
        rows = fetch_all("""
            SELECT c.code_insee, c.name, c.department_code,
                   c.population, c.epci_name,
                   cb.exp_total, cb.debt_total
            FROM communes c
            LEFT JOIN commune_budgets cb ON cb.code_insee = c.code_insee
                AND cb.year = (SELECT MAX(year) FROM commune_budgets WHERE code_insee = c.code_insee)
        """)

        if dry_run:
            return len(rows)

        batch_size = 500
        count = 0
        with self.driver.session() as session:
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i+batch_size]
                session.run("""
                    UNWIND $batch AS row
                    MERGE (c:Commune {code_insee: row.code_insee})
                    SET c.name = row.name,
                        c.department = row.department_code,
                        c.population = row.population,
                        c.epci = row.epci_name,
                        c.budget = row.exp_total,
                        c.debt = row.debt_total
                """, batch=[dict(r) for r in batch])
                count += len(batch)

        return count

    def _build_contract_edges(self, dry_run: bool) -> int:
        """Create AWARDED_TO and BUYER_OF edges from contracts."""
        rows = fetch_all("""
            SELECT c.id, c.boamp_id, c.amount, c.contract_type,
                   c.cpv_label, c.publication_date,
                   c.buyer_siret, c.buyer_name,
                   c.winner_siret, c.winner_name
            FROM contracts c
            WHERE c.buyer_siret IS NOT NULL
              AND c.winner_siret IS NOT NULL
              AND c.amount IS NOT NULL
            LIMIT 50000
        """)

        if dry_run:
            return len(rows) * 2  # 2 edges per contract

        count = 0
        batch_size = 200
        with self.driver.session() as session:
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i+batch_size]

                # Ensure buyer entities exist
                session.run("""
                    UNWIND $batch AS row
                    MERGE (b:Entity {siren: substring(row.buyer_siret, 0, 9)})
                    ON CREATE SET b.name = row.buyer_name, b.type = 'public_org'
                """, batch=[dict(r) for r in batch])

                # Ensure winner entities exist
                session.run("""
                    UNWIND $batch AS row
                    MERGE (w:Entity {siren: substring(row.winner_siret, 0, 9)})
                    ON CREATE SET w.name = row.winner_name
                """, batch=[dict(r) for r in batch])

                # Create AWARDED_TO edges
                session.run("""
                    UNWIND $batch AS row
                    MATCH (buyer:Entity {siren: substring(row.buyer_siret, 0, 9)})
                    MATCH (winner:Entity {siren: substring(row.winner_siret, 0, 9)})
                    MERGE (buyer)-[r:AWARDED_TO]->(winner)
                    ON CREATE SET r.total_amount = row.amount,
                                  r.contract_count = 1,
                                  r.first_date = row.publication_date
                    ON MATCH SET r.total_amount = r.total_amount + row.amount,
                                 r.contract_count = r.contract_count + 1,
                                 r.last_date = row.publication_date
                """, batch=[dict(r) for r in batch])

                count += len(batch)

        return count

    def _build_subvention_edges(self, dry_run: bool) -> int:
        """Create RECEIVED_SUBSIDY edges."""
        rows = fetch_all("""
            SELECT recipient_siret, grantor_siret,
                   SUM(amount_granted) as total,
                   COUNT(*) as count,
                   MIN(year) as first_year,
                   MAX(year) as last_year
            FROM subventions
            WHERE recipient_siret IS NOT NULL
              AND grantor_siret IS NOT NULL
            GROUP BY recipient_siret, grantor_siret
            LIMIT 50000
        """)

        if dry_run:
            return len(rows)

        count = 0
        batch_size = 200
        with self.driver.session() as session:
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i+batch_size]
                session.run("""
                    UNWIND $batch AS row
                    MERGE (g:Entity {siren: substring(row.grantor_siret, 0, 9)})
                    MERGE (r:Entity {siren: substring(row.recipient_siret, 0, 9)})
                    MERGE (g)-[rel:SUBSIDIZED]->(r)
                    SET rel.total_amount = row.total,
                        rel.count = row.count,
                        rel.first_year = row.first_year,
                        rel.last_year = row.last_year
                """, batch=[dict(r) for r in batch])
                count += len(batch)

        return count

    def get_stats(self) -> dict:
        """Get graph statistics."""
        with self.driver.session() as session:
            nodes = session.run("MATCH (n) RETURN count(n) as count").single()["count"]
            edges = session.run("MATCH ()-[r]->() RETURN count(r) as count").single()["count"]
            entities = session.run("MATCH (e:Entity) RETURN count(e) as count").single()["count"]
            communes = session.run("MATCH (c:Commune) RETURN count(c) as count").single()["count"]

        return {
            "total_nodes": nodes,
            "total_edges": edges,
            "entities": entities,
            "communes": communes,
        }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build Neo4j graph")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--stats", action="store_true", help="Show graph stats only")
    args = parser.parse_args()

    builder = GraphBuilder()

    if args.stats:
        stats = builder.get_stats()
        print("Graph statistics:")
        for k, v in stats.items():
            print(f"  {k}: {v:,}")
    else:
        builder.build_all(dry_run=args.dry_run)

    builder.close()

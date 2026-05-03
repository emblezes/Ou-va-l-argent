"""Pattern detection on the Neo4j graph.

Detects suspicious patterns: high centrality nodes, cliques,
repeated buyer-winner relationships, concentration anomalies.
"""

import argparse
from neo4j import GraphDatabase

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from config import load_database


class PatternDetector:
    """Detect suspicious patterns in the public spending graph."""

    def __init__(self):
        config = load_database().get("neo4j", {})
        uri = config.get("uri", "bolt://localhost:7687")
        user = config.get("user", "neo4j")
        password = config.get("password", "")
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def detect_all(self) -> dict:
        """Run all pattern detection algorithms."""
        results = {}

        detectors = [
            ("high_concentration", self.detect_concentration),
            ("repeat_winners", self.detect_repeat_winners),
            ("hub_entities", self.detect_hub_entities),
            ("circular_flows", self.detect_circular_flows),
        ]

        for name, func in detectors:
            try:
                results[name] = func()
                print(f"  {name}: {len(results[name])} patterns found")
            except Exception as e:
                print(f"  {name}: Error — {e}")
                results[name] = []

        return results

    def detect_concentration(self, min_contracts: int = 5,
                            min_ratio: float = 0.5) -> list[dict]:
        """Detect buyer-winner pairs with abnormal concentration.

        Finds cases where a buyer repeatedly awards contracts to the same winner.
        """
        with self.driver.session() as session:
            result = session.run("""
                MATCH (buyer:Entity)-[r:AWARDED_TO]->(winner:Entity)
                WHERE r.contract_count >= $min_contracts
                WITH buyer, winner, r,
                     r.contract_count AS contracts,
                     r.total_amount AS total
                // Get total contracts from this buyer
                OPTIONAL MATCH (buyer)-[all_r:AWARDED_TO]->()
                WITH buyer, winner, contracts, total,
                     sum(all_r.contract_count) AS buyer_total_contracts
                WHERE buyer_total_contracts > 0
                  AND toFloat(contracts) / buyer_total_contracts >= $min_ratio
                RETURN buyer.name AS buyer_name, buyer.siren AS buyer_siren,
                       winner.name AS winner_name, winner.siren AS winner_siren,
                       contracts, total / 100.0 AS total_eur,
                       toFloat(contracts) / buyer_total_contracts AS ratio
                ORDER BY ratio DESC, total DESC
                LIMIT 50
            """, min_contracts=min_contracts, min_ratio=min_ratio)

            return [dict(r) for r in result]

    def detect_repeat_winners(self, min_buyers: int = 10) -> list[dict]:
        """Find entities that win contracts from many different buyers.

        Could indicate legitimate large companies or suspicious influence.
        """
        with self.driver.session() as session:
            result = session.run("""
                MATCH (buyer:Entity)-[r:AWARDED_TO]->(winner:Entity)
                WITH winner,
                     count(DISTINCT buyer) AS nb_buyers,
                     sum(r.total_amount) AS total_amount,
                     sum(r.contract_count) AS total_contracts
                WHERE nb_buyers >= $min_buyers
                RETURN winner.name AS name, winner.siren AS siren,
                       nb_buyers, total_contracts,
                       total_amount / 100.0 AS total_eur
                ORDER BY nb_buyers DESC
                LIMIT 50
            """, min_buyers=min_buyers)

            return [dict(r) for r in result]

    def detect_hub_entities(self, top_n: int = 20) -> list[dict]:
        """Find entities with highest degree centrality (most connections).

        Hub entities may play outsized roles in the spending network.
        """
        with self.driver.session() as session:
            result = session.run("""
                MATCH (e:Entity)
                OPTIONAL MATCH (e)-[out]->()
                OPTIONAL MATCH (e)<-[inc]-()
                WITH e,
                     count(DISTINCT out) AS outgoing,
                     count(DISTINCT inc) AS incoming
                WHERE outgoing + incoming > 0
                RETURN e.name AS name, e.siren AS siren, e.type AS type,
                       outgoing, incoming,
                       outgoing + incoming AS total_connections
                ORDER BY total_connections DESC
                LIMIT $top_n
            """, top_n=top_n)

            return [dict(r) for r in result]

    def detect_circular_flows(self, max_hops: int = 3) -> list[dict]:
        """Detect circular money flows (A→B→C→A).

        This can indicate suspicious arrangements.
        """
        with self.driver.session() as session:
            result = session.run("""
                MATCH path = (a:Entity)-[:AWARDED_TO|SUBSIDIZED*2..3]->(a)
                WHERE ALL(r IN relationships(path) WHERE r.total_amount > 0)
                WITH a, path,
                     [n IN nodes(path) | n.name] AS entity_names,
                     reduce(s = 0, r IN relationships(path) | s + r.total_amount) AS total_flow
                RETURN a.name AS origin, a.siren AS origin_siren,
                       entity_names AS cycle_entities,
                       length(path) AS hops,
                       total_flow / 100.0 AS total_flow_eur
                ORDER BY total_flow DESC
                LIMIT 20
            """)

            return [dict(r) for r in result]

    def get_entity_network(self, siren: str, depth: int = 2) -> dict:
        """Get the network around a specific entity."""
        with self.driver.session() as session:
            # Get entity info
            entity = session.run("""
                MATCH (e:Entity {siren: $siren})
                RETURN e.name AS name, e.type AS type,
                       e.city AS city, e.employees AS employees
            """, siren=siren).single()

            if not entity:
                return {"error": f"Entity {siren} not found"}

            # Get connections
            connections = session.run("""
                MATCH (e:Entity {siren: $siren})-[r]-(other)
                RETURN type(r) AS relation_type,
                       startNode(r) = e AS is_outgoing,
                       other.name AS other_name,
                       other.siren AS other_siren,
                       labels(other)[0] AS other_type,
                       r.total_amount / 100.0 AS amount_eur,
                       r.contract_count AS contracts
                ORDER BY r.total_amount DESC
                LIMIT 50
            """, siren=siren)

            return {
                "entity": dict(entity),
                "connections": [dict(c) for c in connections],
            }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Detect patterns in spending graph")
    parser.add_argument("--detect", choices=["all", "concentration", "repeat_winners",
                                              "hubs", "circular"],
                       default="all")
    parser.add_argument("--entity", type=str, help="Get network of a specific SIREN")
    args = parser.parse_args()

    detector = PatternDetector()

    if args.entity:
        network = detector.get_entity_network(args.entity)
        if "error" in network:
            print(network["error"])
        else:
            print(f"\nNetwork of {network['entity']['name']}:")
            for conn in network["connections"]:
                direction = "→" if conn["is_outgoing"] else "←"
                print(f"  {direction} {conn['other_name']} ({conn['relation_type']}) "
                      f"— {conn.get('amount_eur', 0):,.0f}€ / {conn.get('contracts', 0)} contrats")
    else:
        if args.detect == "all":
            results = detector.detect_all()
        elif args.detect == "concentration":
            results = {"concentration": detector.detect_concentration()}
        elif args.detect == "repeat_winners":
            results = {"repeat_winners": detector.detect_repeat_winners()}
        elif args.detect == "hubs":
            results = {"hubs": detector.detect_hub_entities()}
        elif args.detect == "circular":
            results = {"circular": detector.detect_circular_flows()}

        for pattern_name, patterns in results.items():
            print(f"\n=== {pattern_name.upper()} ===")
            for p in patterns[:10]:
                print(f"  {p}")

    detector.close()

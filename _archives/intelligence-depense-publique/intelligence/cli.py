#!/usr/bin/env python3
"""IDP CLI — Intelligence de la Dépense Publique.

Entry point for all IDP operations: ingestion, analysis, serving.

Usage:
    python cli.py init           # Initialize database
    python cli.py ingest boamp   # Ingest BOAMP data
    python cli.py ingest ofgl    # Ingest OFGL data
    python cli.py ingest all     # Ingest all sources
    python cli.py detect         # Run anomaly detection
    python cli.py cluster        # Run commune clustering
    python cli.py graph          # Build Neo4j graph
    python cli.py embed          # Index document embeddings
    python cli.py chat           # Interactive AI analyst
    python cli.py serve          # Start FastAPI server
"""

import sys
import argparse


def cmd_init(args):
    """Initialize the database schema."""
    from db import init_db
    init_db()


def cmd_ingest(args):
    """Run data ingestion."""
    source = args.source
    dry_run = args.dry_run
    max_records = args.max

    if source in ("boamp", "all"):
        from ingestion.boamp import BOAMPIngester
        BOAMPIngester(year=args.year, max_records=max_records, dry_run=dry_run).run()

    if source in ("ofgl", "all"):
        from ingestion.ofgl import OFGLIngester
        OFGLIngester(year=args.year, max_records=max_records, dry_run=dry_run).run()

    if source in ("sirene", "all"):
        from ingestion.sirene import SireneIngester
        SireneIngester(max_records=max_records, dry_run=dry_run).run()

    if source in ("subventions", "all"):
        from ingestion.subventions import SubventionIngester
        SubventionIngester(dry_run=dry_run).run()

    if source in ("banque_france", "all"):
        from ingestion.banque_france import BanqueFranceIngester
        BanqueFranceIngester(dry_run=dry_run).run()

    if source in ("eurostat", "all"):
        from ingestion.eurostat import EurostatIngester
        EurostatIngester(dry_run=dry_run).run()

    if source == "cour_comptes":
        from ingestion.cour_comptes import CourDesComptesIngester
        CourDesComptesIngester(dry_run=dry_run).run()


def cmd_detect(args):
    """Run anomaly detection."""
    from models.anomaly_detector import ContractAnomalyDetector, BudgetAnomalyDetector

    if args.type in ("contracts", "all"):
        print("\n=== Contract Anomaly Detection ===")
        detector = ContractAnomalyDetector(contamination=args.contamination)
        anomalies = detector.detect(min_amount=args.min_amount)
        if args.store and not anomalies.empty:
            detector.store_anomalies(anomalies)

    if args.type in ("budgets", "all"):
        print("\n=== Budget Anomaly Detection ===")
        detector = BudgetAnomalyDetector(contamination=args.contamination)
        detector.detect(year=args.year)


def cmd_cluster(args):
    """Run commune clustering."""
    from models.commune_clustering import CommuneClustering
    clustering = CommuneClustering(n_clusters=args.clusters)
    df = clustering.fit(year=args.year, min_population=args.min_pop)

    if args.peers_of and not df.empty:
        peers = clustering.find_peers(args.peers_of, df)
        if not peers.empty:
            print(f"\nPeers of {args.peers_of}:")
            print(peers.to_string(index=False))


def cmd_graph(args):
    """Build or query Neo4j graph."""
    if args.action == "build":
        from graph.builder import GraphBuilder
        builder = GraphBuilder()
        builder.build_all(dry_run=args.dry_run)
        builder.close()
    elif args.action == "detect":
        from graph.patterns import PatternDetector
        detector = PatternDetector()
        detector.detect_all()
        detector.close()
    elif args.action == "stats":
        from graph.builder import GraphBuilder
        builder = GraphBuilder()
        stats = builder.get_stats()
        for k, v in stats.items():
            print(f"  {k}: {v:,}")
        builder.close()


def cmd_embed(args):
    """Index document embeddings."""
    from embeddings.indexer import DocumentIndexer
    indexer = DocumentIndexer()

    if args.action == "index":
        indexer.index_pending(batch_size=args.batch_size)
    elif args.action == "search":
        results = indexer.search(args.query, top_k=args.top_k)
        for r in results:
            sim = r.get("similarity", 0)
            print(f"  [{sim:.3f}] {r['title']} — {r['chunk_text'][:100]}...")
    elif args.action == "stats":
        stats = indexer.get_stats()
        for k, v in stats.items():
            print(f"  {k}: {v}")


def cmd_chat(args):
    """Interactive AI analyst."""
    from agents.orchestrator import chat
    if args.query:
        print(chat(args.query))
    else:
        # Interactive mode
        print("=== Intelligence de la Dépense Publique ===")
        print("Posez vos questions. Tapez 'quit' pour quitter.\n")
        conversation = []
        while True:
            try:
                q = input("Vous > ").strip()
            except (EOFError, KeyboardInterrupt):
                break
            if q.lower() in ("quit", "exit", "q"):
                break
            if not q:
                continue
            print("\nAnalyse...")
            response = chat(q, conversation)
            print(f"\nIDP > {response}\n")


def cmd_serve(args):
    """Start the FastAPI server."""
    import uvicorn
    print(f"Starting IDP API on http://0.0.0.0:{args.port}")
    uvicorn.run("api.routes:app", host="0.0.0.0", port=args.port, reload=args.reload)


def main():
    parser = argparse.ArgumentParser(
        description="IDP — Intelligence de la Dépense Publique",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # init
    subparsers.add_parser("init", help="Initialize database schema")

    # ingest
    p_ingest = subparsers.add_parser("ingest", help="Ingest data from sources")
    p_ingest.add_argument("source", choices=[
        "boamp", "ofgl", "sirene", "subventions",
        "banque_france", "eurostat", "cour_comptes", "all"
    ])
    p_ingest.add_argument("--dry-run", action="store_true")
    p_ingest.add_argument("--year", type=int)
    p_ingest.add_argument("--max", type=int, default=5000)

    # detect
    p_detect = subparsers.add_parser("detect", help="Run anomaly detection")
    p_detect.add_argument("--type", choices=["contracts", "budgets", "all"], default="all")
    p_detect.add_argument("--year", type=int, default=2023)
    p_detect.add_argument("--contamination", type=float, default=0.05)
    p_detect.add_argument("--min-amount", type=int, default=100000)
    p_detect.add_argument("--store", action="store_true")

    # cluster
    p_cluster = subparsers.add_parser("cluster", help="Cluster communes")
    p_cluster.add_argument("--year", type=int, default=2023)
    p_cluster.add_argument("--clusters", type=int, default=8)
    p_cluster.add_argument("--min-pop", type=int, default=500)
    p_cluster.add_argument("--peers-of", type=str)

    # graph
    p_graph = subparsers.add_parser("graph", help="Build/query Neo4j graph")
    p_graph.add_argument("action", choices=["build", "detect", "stats"])
    p_graph.add_argument("--dry-run", action="store_true")

    # embed
    p_embed = subparsers.add_parser("embed", help="Manage document embeddings")
    p_embed.add_argument("action", choices=["index", "search", "stats"])
    p_embed.add_argument("--query", type=str)
    p_embed.add_argument("--top-k", type=int, default=5)
    p_embed.add_argument("--batch-size", type=int, default=32)

    # chat
    p_chat = subparsers.add_parser("chat", help="Chat with AI analyst")
    p_chat.add_argument("query", nargs="?")

    # serve
    p_serve = subparsers.add_parser("serve", help="Start FastAPI server")
    p_serve.add_argument("--port", type=int, default=8001)
    p_serve.add_argument("--reload", action="store_true")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    commands = {
        "init": cmd_init,
        "ingest": cmd_ingest,
        "detect": cmd_detect,
        "cluster": cmd_cluster,
        "graph": cmd_graph,
        "embed": cmd_embed,
        "chat": cmd_chat,
        "serve": cmd_serve,
    }

    commands[args.command](args)


if __name__ == "__main__":
    main()

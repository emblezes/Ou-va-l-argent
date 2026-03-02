"""Document embedding pipeline for semantic search.

Indexes document chunks into pgvector for RAG (Retrieval-Augmented Generation).
Uses sentence-transformers with a French-optimized model.
"""

import argparse
import numpy as np

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn, fetch_all


class DocumentIndexer:
    """Index documents into pgvector for semantic search."""

    def __init__(self, model_name: str = "dangvantuan/french-document-embedding"):
        self.model_name = model_name
        self._model = None

    @property
    def model(self):
        """Lazy-load the embedding model."""
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            print(f"Loading model: {self.model_name}")
            self._model = SentenceTransformer(self.model_name)
        return self._model

    def index_pending(self, batch_size: int = 32):
        """Index all document chunks that don't have embeddings yet."""
        # Find un-embedded chunks
        rows = fetch_all("""
            SELECT id, chunk_text
            FROM document_embeddings
            WHERE embedding IS NULL
            ORDER BY id
        """)

        if not rows:
            print("No pending chunks to embed.")
            return

        print(f"Embedding {len(rows)} chunks...")

        for i in range(0, len(rows), batch_size):
            batch = rows[i:i+batch_size]
            texts = [r["chunk_text"] for r in batch]
            ids = [r["id"] for r in batch]

            # Generate embeddings
            embeddings = self.model.encode(texts, show_progress_bar=False)

            # Store in pgvector
            with get_conn() as conn:
                with conn.cursor() as cur:
                    for doc_id, embedding in zip(ids, embeddings):
                        # Convert numpy array to list for pgvector
                        vec = embedding.tolist()
                        cur.execute(
                            "UPDATE document_embeddings SET embedding = %s WHERE id = %s",
                            (vec, doc_id)
                        )

            print(f"  Embedded {min(i + batch_size, len(rows))}/{len(rows)}")

        print("Embedding complete.")

    def search(self, query: str, top_k: int = 5,
               source_type: str = None) -> list[dict]:
        """Semantic search across indexed documents.

        Args:
            query: Natural language search query.
            top_k: Number of results to return.
            source_type: Filter by source type (cour_comptes, etc.)

        Returns:
            List of relevant document chunks with similarity scores.
        """
        # Embed the query
        query_embedding = self.model.encode(query).tolist()

        # Search with pgvector cosine distance
        conditions = ["embedding IS NOT NULL"]
        params = [query_embedding, top_k]

        if source_type:
            conditions.append("source_type = %s")
            params.insert(1, source_type)

        where = " AND ".join(conditions)

        rows = fetch_all(f"""
            SELECT id, source_type, source_id, title,
                   chunk_index, chunk_text, metadata,
                   1 - (embedding <=> %s::vector) AS similarity
            FROM document_embeddings
            WHERE {where}
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, [query_embedding] + ([source_type] if source_type else []) + [query_embedding, top_k])

        return rows

    def get_stats(self) -> dict:
        """Get indexing statistics."""
        total = fetch_all("SELECT COUNT(*) as count FROM document_embeddings")[0]["count"]
        embedded = fetch_all(
            "SELECT COUNT(*) as count FROM document_embeddings WHERE embedding IS NOT NULL"
        )[0]["count"]
        by_source = fetch_all("""
            SELECT source_type, COUNT(*) as count
            FROM document_embeddings
            GROUP BY source_type
        """)

        return {
            "total_chunks": total,
            "embedded_chunks": embedded,
            "pending": total - embedded,
            "by_source": {r["source_type"]: r["count"] for r in by_source},
        }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Document embedding pipeline")
    parser.add_argument("--index", action="store_true", help="Index pending documents")
    parser.add_argument("--search", type=str, help="Search query")
    parser.add_argument("--top-k", type=int, default=5)
    parser.add_argument("--source", type=str, help="Filter by source type")
    parser.add_argument("--stats", action="store_true")
    parser.add_argument("--batch-size", type=int, default=32)
    args = parser.parse_args()

    indexer = DocumentIndexer()

    if args.stats:
        stats = indexer.get_stats()
        print("Embedding stats:")
        for k, v in stats.items():
            print(f"  {k}: {v}")

    elif args.index:
        indexer.index_pending(batch_size=args.batch_size)

    elif args.search:
        results = indexer.search(args.search, top_k=args.top_k, source_type=args.source)
        print(f"\nSearch results for: '{args.search}'\n")
        for r in results:
            sim = r.get("similarity", 0)
            print(f"  [{sim:.3f}] {r['title']} (chunk {r['chunk_index']})")
            print(f"          {r['chunk_text'][:150]}...")
            print()

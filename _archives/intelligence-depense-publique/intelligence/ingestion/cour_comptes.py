"""Cour des Comptes — Audit reports and CRC observations.

Parses PDF reports for the RAG/embedding pipeline.
Source: https://www.ccomptes.fr/fr/publications
"""

import re
import json
import argparse
from pathlib import Path

from base import BaseIngester

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))
from db import get_conn

CCOMPTES_BASE = "https://www.ccomptes.fr"
REPORTS_DIR = Path(__file__).parent.parent / "data" / "cour_comptes"


class CourDesComptesIngester(BaseIngester):
    """Ingest and parse Cour des Comptes reports."""

    source_name = "cour_comptes"

    def __init__(self, pdf_dir: str = None, **kwargs):
        super().__init__(**kwargs)
        self.pdf_dir = Path(pdf_dir) if pdf_dir else REPORTS_DIR

    def ingest(self):
        """Parse PDF reports and extract structured content."""
        self.pdf_dir.mkdir(parents=True, exist_ok=True)

        # Step 1: List available PDFs
        pdf_files = list(self.pdf_dir.glob("*.pdf"))
        if not pdf_files:
            print(f"No PDF files found in {self.pdf_dir}")
            print("Download reports from: https://www.ccomptes.fr/fr/publications")
            return

        print(f"Found {len(pdf_files)} PDF reports to process")

        for pdf_path in pdf_files:
            try:
                self._process_pdf(pdf_path)
            except Exception as e:
                self.stats["errors"] += 1
                print(f"  Error processing {pdf_path.name}: {e}")

    def _process_pdf(self, pdf_path: Path):
        """Extract text from a single PDF and chunk it."""
        try:
            import pdfplumber
        except ImportError:
            print("pdfplumber not installed. Run: pip install pdfplumber")
            return

        self.stats["fetched"] += 1
        chunks = []

        with pdfplumber.open(pdf_path) as pdf:
            title = pdf_path.stem.replace("-", " ").replace("_", " ")
            current_section = ""
            current_text = ""

            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                lines = text.split("\n")

                for line in lines:
                    line = line.strip()
                    if not line:
                        continue

                    # Detect section headers (heuristic: short lines in caps or bold-like)
                    if _is_section_header(line):
                        # Save previous section
                        if current_text.strip():
                            chunks.append({
                                "section": current_section,
                                "text": current_text.strip(),
                                "page": page_num + 1,
                            })
                        current_section = line
                        current_text = ""
                    else:
                        current_text += line + " "

                        # Split long chunks
                        if len(current_text) > 2000:
                            chunks.append({
                                "section": current_section,
                                "text": current_text.strip(),
                                "page": page_num + 1,
                            })
                            current_text = ""

            # Last chunk
            if current_text.strip():
                chunks.append({
                    "section": current_section,
                    "text": current_text.strip(),
                    "page": len(pdf.pages),
                })

        if self.dry_run:
            print(f"[DRY RUN] {pdf_path.name}: {len(chunks)} chunks")
            return

        self._store_chunks(chunks, pdf_path.stem, title)

    def _store_chunks(self, chunks: list[dict], source_id: str, title: str):
        """Store document chunks for later embedding."""
        with get_conn() as conn:
            with conn.cursor() as cur:
                for i, chunk in enumerate(chunks):
                    try:
                        cur.execute("""
                            INSERT INTO document_embeddings (
                                source_type, source_id, title,
                                chunk_index, chunk_text, metadata
                            ) VALUES (
                                'cour_comptes', %(source_id)s, %(title)s,
                                %(idx)s, %(text)s, %(meta)s
                            )
                        """, {
                            "source_id": source_id,
                            "title": title,
                            "idx": i,
                            "text": chunk["text"],
                            "meta": json.dumps({
                                "section": chunk["section"],
                                "page": chunk["page"],
                            }),
                        })
                        self.stats["inserted"] += 1
                    except Exception as e:
                        self.stats["errors"] += 1


def _is_section_header(line: str) -> bool:
    """Heuristic: detect section headers in PDF text."""
    if len(line) > 100:
        return False
    if len(line) < 3:
        return False
    # Numbered sections like "1. Introduction" or "I. Observations"
    if re.match(r'^[IVX]+\.\s', line) or re.match(r'^\d+\.\s', line):
        return True
    # ALL CAPS lines (common for headers)
    if line == line.upper() and len(line) > 5 and any(c.isalpha() for c in line):
        return True
    return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Cour des Comptes PDF reports")
    parser.add_argument("--dir", type=str, help="Directory containing PDF files")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ingester = CourDesComptesIngester(pdf_dir=args.dir, dry_run=args.dry_run)
    ingester.run()

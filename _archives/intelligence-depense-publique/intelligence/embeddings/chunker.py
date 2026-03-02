"""Document chunking strategies for different source types.

Structured data (CSV, JSON) → SQL direct, no embedding needed.
Unstructured data (PDF, HTML) → Semantic chunking for RAG.
"""

import re
from dataclasses import dataclass


@dataclass
class Chunk:
    """A document chunk ready for embedding."""
    text: str
    index: int
    metadata: dict


class SemanticChunker:
    """Chunk documents by semantic structure (sections, paragraphs)."""

    def __init__(self, max_chunk_size: int = 512, overlap: int = 50):
        self.max_chunk_size = max_chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str, title: str = "") -> list[Chunk]:
        """Split text into semantic chunks.

        Strategy:
        1. Split by section headers first
        2. Then by paragraphs
        3. Then by sentences if still too long
        """
        sections = self._split_by_sections(text)
        chunks = []

        for section_title, section_text in sections:
            paragraphs = self._split_by_paragraphs(section_text)

            current_chunk = ""
            for para in paragraphs:
                if len(current_chunk) + len(para) <= self.max_chunk_size:
                    current_chunk += para + "\n\n"
                else:
                    if current_chunk.strip():
                        chunks.append(Chunk(
                            text=current_chunk.strip(),
                            index=len(chunks),
                            metadata={"section": section_title, "title": title},
                        ))
                    # Handle paragraphs longer than max_chunk_size
                    if len(para) > self.max_chunk_size:
                        sentence_chunks = self._split_by_sentences(para)
                        for sc in sentence_chunks:
                            chunks.append(Chunk(
                                text=sc.strip(),
                                index=len(chunks),
                                metadata={"section": section_title, "title": title},
                            ))
                        current_chunk = ""
                    else:
                        current_chunk = para + "\n\n"

            if current_chunk.strip():
                chunks.append(Chunk(
                    text=current_chunk.strip(),
                    index=len(chunks),
                    metadata={"section": section_title, "title": title},
                ))

        return chunks

    def _split_by_sections(self, text: str) -> list[tuple[str, str]]:
        """Split text by section headers."""
        # Match numbered sections, roman numerals, or ALL CAPS headers
        pattern = r'(?=(?:^|\n)(?:(?:[IVX]+|[\d]+)\.\s+[A-ZÀ-Ÿ]|[A-ZÀ-Ÿ]{3,}[A-ZÀ-Ÿ\s]{2,}))'
        parts = re.split(pattern, text)

        if len(parts) <= 1:
            return [("", text)]

        sections = []
        for part in parts:
            part = part.strip()
            if not part:
                continue

            lines = part.split("\n", 1)
            if len(lines) == 2:
                sections.append((lines[0].strip(), lines[1].strip()))
            else:
                sections.append(("", part))

        return sections

    def _split_by_paragraphs(self, text: str) -> list[str]:
        """Split text by double newlines (paragraphs)."""
        paragraphs = re.split(r'\n\s*\n', text)
        return [p.strip() for p in paragraphs if p.strip()]

    def _split_by_sentences(self, text: str) -> list[str]:
        """Split long text into sentence-based chunks."""
        # Simple French sentence splitting
        sentences = re.split(r'(?<=[.!?])\s+', text)
        chunks = []
        current = ""

        for sentence in sentences:
            if len(current) + len(sentence) <= self.max_chunk_size:
                current += sentence + " "
            else:
                if current.strip():
                    chunks.append(current.strip())
                current = sentence + " "

        if current.strip():
            chunks.append(current.strip())

        return chunks


class TableChunker:
    """Chunk tabular data (from PDFs with tables)."""

    def chunk_table(self, headers: list[str], rows: list[list],
                    title: str = "") -> list[Chunk]:
        """Convert table rows into natural language chunks."""
        chunks = []
        batch_size = 10  # rows per chunk

        for i in range(0, len(rows), batch_size):
            batch = rows[i:i+batch_size]
            lines = []
            for row in batch:
                pairs = [f"{h}: {v}" for h, v in zip(headers, row) if v]
                lines.append("; ".join(pairs))

            text = f"Tableau: {title}\n" + "\n".join(lines)
            chunks.append(Chunk(
                text=text,
                index=len(chunks),
                metadata={"type": "table", "title": title, "row_range": f"{i}-{i+len(batch)}"},
            ))

        return chunks

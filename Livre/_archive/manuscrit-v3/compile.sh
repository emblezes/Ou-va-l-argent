#!/usr/bin/env bash
# Compile la V3 Markdown en DOCX via Pandoc.
# Usage : ./compile.sh [chapter.md] [chapter.md] ...
#   - Sans argument : compile l'ensemble du manuscrit V3
#   - Avec arguments : compile uniquement les fichiers .md spécifiés

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$(cd "$SCRIPT_DIR/../docx" && pwd)"

declare -a FILES_ARR

if [ "$#" -eq 0 ]; then
    while IFS= read -r -d '' file; do
        FILES_ARR+=("$file")
    done < <(find "$SCRIPT_DIR" -maxdepth 1 -name "[0-9][0-9]-*.md" -print0 | sort -z)
    OUTPUT="$OUT_DIR/Capitalisons-V3.docx"
    echo "→ Compilation V3 complète vers : $OUTPUT"
else
    for arg in "$@"; do
        f="$SCRIPT_DIR/$arg"
        [ ! -f "$f" ] && f="$SCRIPT_DIR/${arg}.md"
        if [ -f "$f" ]; then
            FILES_ARR+=("$f")
        else
            echo "⚠ Fichier non trouvé : $arg"
        fi
    done
    NAME=$(basename "${1%.md}")
    OUTPUT="$OUT_DIR/${NAME}.docx"
    echo "→ Compilation ciblée vers : $OUTPUT"
fi

if [ "${#FILES_ARR[@]}" -eq 0 ]; then
    echo "Aucun fichier à compiler."
    exit 1
fi

mkdir -p "$OUT_DIR"

pandoc \
    --metadata-file="$SCRIPT_DIR/metadata.yaml" \
    --from=markdown+footnotes+smart \
    --to=docx \
    --output="$OUTPUT" \
    --standalone \
    --wrap=preserve \
    "${FILES_ARR[@]}"

echo "✓ DOCX généré : $OUTPUT"
ls -lh "$OUTPUT"

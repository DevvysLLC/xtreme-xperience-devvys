#!/usr/bin/env bash
# Build a combined PDF from feature client docs.
# Uses md2pdf-mermaid (Python + Playwright) for Mermaid diagram rendering.
# Run from repo root.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DOCS_DIR="$REPO_ROOT/docs"
OUTPUT_DIR="${1:-$DOCS_DIR}"
COMBINED="$OUTPUT_DIR/features-combined.md"
PDF="$OUTPUT_DIR/features-documentation.pdf"

FEATURES=(
  trackfinder
  booking
  cart
  checkout
  analytics
  forms
)

echo "Combining feature docs..."

{
  echo "# Features Documentation"
  echo ""
  echo "Client-facing user journeys for each feature."
  echo ""
  echo "[TOC]"
  echo ""
  echo "---"
  echo ""

  for feature in "${FEATURES[@]}"; do
    readme="$DOCS_DIR/features/$feature/client/readme.md"
    if [[ -f "$readme" ]]; then
      echo ""
      echo "---"
      echo ""
      cat "$readme"
      echo ""
    else
      echo "Warning: $readme not found" >&2
    fi
  done
} > "$COMBINED"

echo "Converting to PDF with md2pdf-mermaid..."

if ! command -v md2pdf &>/dev/null; then
  echo "Error: md2pdf not found. Install with: pip install md2pdf-mermaid && playwright install chromium" >&2
  exit 1
fi

md2pdf "$COMBINED" \
  -o "$PDF" \
  --title "Features Documentation" \
  --page-size letter \
  --mermaid-scale 2

echo "Done: $PDF"

#!/usr/bin/env bash
# ==============================================================================
# scripts/list-stacks.sh — Daftar stack yang didukung framework
# ==============================================================================
# Sumber: config.env SUPPORTED_STACKS kalau di-set, kalau kosong auto-detect
# dari subdirektori templates/.
#
# Usage:
#   bash scripts/list-stacks.sh              # satu stack per baris
#   bash scripts/list-stacks.sh --csv        # output dipisah koma (untuk doc)
#   bash scripts/list-stacks.sh --count      # hanya jumlah stack
#
# Contoh output:
#   flutter
#   mobile-expo
#   nextjs
#   node-api
#   python
#   vue-nuxt
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Baca dari config.env dulu kalau ada override
STACKS=""
if [ -f "$ROOT_DIR/config.local.env" ]; then
    # shellcheck disable=SC1090,SC1091
    STACKS=$(set -a && source "$ROOT_DIR/config.local.env" && printf '%s' "${SUPPORTED_STACKS:-}")
fi
if [ -z "$STACKS" ] && [ -f "$ROOT_DIR/config.env" ]; then
    # shellcheck disable=SC1090,SC1091
    STACKS=$(set -a && source "$ROOT_DIR/config.env" && printf '%s' "${SUPPORTED_STACKS:-}")
fi

# Auto-detect dari templates/ kalau config tidak set
if [ -z "$STACKS" ]; then
    if [ -d "$ROOT_DIR/templates" ]; then
        for dir in "$ROOT_DIR/templates"/*/; do
            [ -d "$dir" ] || continue
            name=$(basename "$dir")
            # Skip direktori internal seperti _common
            case "$name" in
                _*) continue ;;
            esac
            STACKS="$STACKS $name"
        done
        # Trim leading space
        STACKS="${STACKS# }"
    fi
fi

# Format output sesuai flag
FORMAT="${1:-}"
case "$FORMAT" in
    --csv)
        # Ganti spasi dengan koma
        echo "$STACKS" | tr ' ' ','
        ;;
    --count)
        # Hitung kata
        echo "$STACKS" | wc -w
        ;;
    --json)
        # Output array JSON
        printf '['
        first=1
        for s in $STACKS; do
            if [ $first -eq 1 ]; then
                first=0
            else
                printf ','
            fi
            printf '"%s"' "$s"
        done
        printf ']\n'
        ;;
    ""|--list)
        # Default: satu per baris
        for s in $STACKS; do
            echo "$s"
        done
        ;;
    *)
        echo "Unknown format: $FORMAT" >&2
        echo "Usage: $0 [--csv|--count|--json|--list]" >&2
        exit 1
        ;;
esac

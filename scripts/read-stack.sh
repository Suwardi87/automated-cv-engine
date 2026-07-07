#!/usr/bin/env bash
# ==============================================================================
# read-stack.sh — Baca field dari stack.env manifest
# Usage: bash scripts/read-stack.sh <stack> <field>
# ==============================================================================

set -euo pipefail

STACK="${1:-}"
FIELD="${2:-}"
DEFAULT="${3:-}"

if [ -z "$STACK" ] || [ -z "$FIELD" ]; then
    echo "$DEFAULT"
    exit 0
fi

MANIFEST="templates/$STACK/stack.env"
if [ ! -f "$MANIFEST" ]; then
    echo "$DEFAULT"
    exit 0
fi

# shellcheck disable=SC1090,SC1091
set -a; source "$MANIFEST"; set +a
echo "${!FIELD:-$DEFAULT}"

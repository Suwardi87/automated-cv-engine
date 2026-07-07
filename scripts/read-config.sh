#!/usr/bin/env bash
# ==============================================================================
# scripts/read-config.sh — Membaca nilai dari config.env / config.local.env
# ==============================================================================
# Format: shell-sourceable, zero dependency (tidak butuh PyYAML/yq).
#
# Usage:
#   bash scripts/read-config.sh <KEY> [DEFAULT_VALUE]
#
# Prioritas sumber (yang pertama ketemu dipakai):
#   1. config.local.env  (override lokal, di-gitignore)
#   2. config.env        (default yang di-track)
#   3. argumen DEFAULT   (fallback kalau key tidak ada di mana-mana)
#
# Contoh:
#   bash scripts/read-config.sh PROJECT_NAME
#   bash scripts/read-config.sh HEALTH_ENDPOINT "http://localhost:8080/health"
#   PROTECTED=$(bash scripts/read-config.sh PROTECTED_BRANCHES "main master")
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source config files: config.env dulu (default), baru config.local.env (override)
# Urutan ini penting supaya local override menimpa tanpa hapus key lain.
# shellcheck disable=SC1090,SC1091
set -a
if [ -f "$ROOT_DIR/config.env" ]; then
    source "$ROOT_DIR/config.env"
fi
if [ -f "$ROOT_DIR/config.local.env" ]; then
    source "$ROOT_DIR/config.local.env"
fi
set +a

KEY="${1:-}"
DEFAULT="${2:-}"

if [ -z "$KEY" ]; then
    echo "Usage: $0 <KEY> [DEFAULT_VALUE]" >&2
    exit 1
fi

# Indirect expansion: ambil nilai variabel yang namanya ada di $KEY
# shellcheck disable=SC2086
VALUE="${!KEY:-$DEFAULT}"

# Print tanpa trailing newline supaya mudah di-capture
printf '%s' "$VALUE"

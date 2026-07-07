#!/usr/bin/env bash
# ==============================================================================
# scripts/backup.sh — Pre-deploy backup tarball
# ==============================================================================
# Dipanggil oleh ci.yml sebelum deploy untuk snapshot konfigurasi penting.
# Tidak mem-backup data aplikasi (DB dump terpisah), hanya konfigurasi deploy.
#
# Usage:
#   bash scripts/backup.sh           # full backup ke backups/
#   bash scripts/backup.sh quick     # backup cepat (hanya file config)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"
MODE="${1:-full}"

mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup-$TIMESTAMP.tar.gz"

cd "$ROOT_DIR"

# Kumpulkan file yang akan di-backup (hanya yang exist)
FILES_TO_BACKUP=()

# Always backup these if they exist
for f in docker-compose.yml docker-compose.prod.yml docker-compose.dev.yml \
         .env .env.production .env.production.example \
         nginx.conf config.env VERSION CHANGELOG.md; do
    [ -f "$f" ] && FILES_TO_BACKUP+=("$f")
done

# Full mode juga include scripts/ dan .github/
if [ "$MODE" != "quick" ]; then
    [ -d "scripts" ] && FILES_TO_BACKUP+=("scripts/")
    [ -d ".github" ] && FILES_TO_BACKUP+=(".github/")
fi

if [ ${#FILES_TO_BACKUP[@]} -eq 0 ]; then
    echo "⚠ Tidak ada file untuk di-backup"
    exit 0
fi

echo "→ Mode: $MODE"
echo "→ Files: ${FILES_TO_BACKUP[*]}"

tar -czf "$BACKUP_FILE" "${FILES_TO_BACKUP[@]}"

echo "✅ Backup created: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

# Cleanup backup lama (>30 hari)
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +30 -delete 2>/dev/null || true
echo "✓ Backup lama (>30 hari) di-cleanup"

# Rotasi: simpan maksimal 20 backup terakhir
ls -t "$BACKUP_DIR"/backup-*.tar.gz 2>/dev/null | tail -n +21 | xargs rm -f 2>/dev/null || true
echo "✓ Rotation: maksimal 20 backup"

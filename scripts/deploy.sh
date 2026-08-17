#!/usr/bin/env bash
# deploy.sh — CD pipeline: pull → build → restart → health check
# Dijalankan di server (129.226.203.7) otomatis via pre-push hook lokal.
# Aman dijalankan ulang: idempotent.

set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/apps/automated-cv-engine}"
COMPOSE_FILE="docker-compose.prod.yml"
PROFILE="omnisync"
HEALTH_URL="${HEALTH_URL:-https://suwardi.web.id/api/portfolio/suwardi87}"
DEPLOY_LOG="${DEPLOY_LOG:-/tmp/omnisync-deploy.log}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${YELLOW}[deploy]${NC} $*" | tee -a "$DEPLOY_LOG"; }
ok()   { echo -e "${GREEN}[deploy]${NC} $*" | tee -a "$DEPLOY_LOG"; }
fail() { echo -e "${RED}[deploy]${NC} $*" | tee -a "$DEPLOY_LOG"; }

if [ ! -d "$APP_DIR" ]; then
  fail "Direktori $APP_DIR tidak ditemukan. Jalankan dari server dengan APP_DIR yang benar."
  exit 1
fi

cd "$APP_DIR"

log "1/4 git pull origin main..."
if ! git pull --ff-only origin main >> "$DEPLOY_LOG" 2>&1; then
  fail "git pull gagal (mungkin file untracked bentrok). Coba bersihkan + retry..."
  git clean -f scripts/ >> "$DEPLOY_LOG" 2>&1 || true
  if ! git pull --ff-only origin main >> "$DEPLOY_LOG" 2>&1; then
    fail "git pull tetap gagal. Cek deploy key / koneksi GitHub."
    exit 1
  fi
fi
ok "git pull selesai."

log "2/4 docker compose build..."
if ! docker compose -f "$COMPOSE_FILE" --profile "$PROFILE" build >> "$DEPLOY_LOG" 2>&1; then
  fail "Build image gagal."
  exit 1
fi
ok "Build selesai."

log "3/4 docker compose up -d..."
if ! docker compose -f "$COMPOSE_FILE" --profile "$PROFILE" up -d >> "$DEPLOY_LOG" 2>&1; then
  fail "Container gagal start."
  exit 1
fi
ok "Container up."

log "4/4 health check $HEALTH_URL ..."
for i in $(seq 1 12); do
  if curl -sf --max-time 10 "$HEALTH_URL" > /dev/null 2>&1; then
    ok "Health check PASS ($i/12)."
    echo "DEPLOY_SUCCESS" | tee -a "$DEPLOY_LOG"
    exit 0
  fi
  sleep 10
done

fail "Health check GAGAL setelah 120 detik. Cek log container: docker compose logs."
exit 1
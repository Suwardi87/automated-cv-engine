#!/usr/bin/env bash
# pre-push.sh — CI/CD pipeline (dipanggil oleh .git/hooks/pre-push).
# Urutan: [CI] typecheck + build (sinkron) → push dilanjutkan →
#         [CD] background watcher tunggu SHA di origin → deploy ke server.

set -uo pipefail

REMOTE="${1:-}"
REPO_ROOT="$(git rev-parse --show-toplevel)"
DEPLOY_HOST="${DEPLOY_HOST:-129.226.203.7}"
DEPLOY_USER="${DEPLOY_USER:-ubuntu}"
HOOK_LOG="${HOOK_LOG:-/tmp/omnisync-hook.log}"

SHA_TO_PUSH=""
BRANCH=""
while read -r local_ref local_sha remote_ref remote_sha; do
  BRANCH="${remote_ref#refs/heads/}"
  SHA_TO_PUSH="$local_sha"
done

if [ "$REMOTE" != "origin" ] || [ "$BRANCH" != "main" ] || [ -z "$SHA_TO_PUSH" ]; then
  exit 0
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  [CI] pre-push pipeline (branch: $BRANCH)"
echo "════════════════════════════════════════════════════"

echo "[CI] typecheck frontend-public..."
if ! ( cd "$REPO_ROOT/frontend-public" && npx nuxi typecheck ) >> "$HOOK_LOG" 2>&1; then
  echo "[CI] ❌ typecheck frontend-public GAGAL — push dibatalkan. Log: $HOOK_LOG"
  exit 1
fi
echo "[CI] ✅ typecheck frontend-public lulus."

echo "[CI] build backend..."
if ! ( cd "$REPO_ROOT/backend" && npm run build ) >> "$HOOK_LOG" 2>&1; then
  echo "[CI] ❌ build backend GAGAL — push dibatalkan. Log: $HOOK_LOG"
  exit 1
fi
echo "[CI] ✅ build backend lulus."

echo "[CI] ✅ Semua check lulus. Push ke GitHub dilanjutkan..."
echo "[CD] Deploy otomatis akan berjalan setelah push terverifikasi di origin."

nohup bash -c "
  for i in \$(seq 1 45); do
    if [ \"\$(git ls-remote origin refs/heads/main 2>/dev/null | awk '{print \$1}')\" = \"$SHA_TO_PUSH\" ]; then
      echo '[CD] SHA terverifikasi di origin. Menjalankan deploy di server...' >> $HOOK_LOG
      ssh -o ConnectTimeout=10 ${DEPLOY_USER}@${DEPLOY_HOST} '~/apps/automated-cv-engine/scripts/deploy.sh' >> $HOOK_LOG 2>&1
      exit 0
    fi
    sleep 2
  done
  echo '[CD] ⚠️ Timeout menunggu push — deploy dilewati. Cek git push manual.' >> $HOOK_LOG
" > /dev/null 2>&1 &
disown

exit 0
#!/usr/bin/env bash
# install-hooks.sh — Pasang pre-push hook (CI + CD) ke .githooks/ (core.hooksPath)
# Menggabungkan: proteksi branch bawaan workflow + pipeline CI/CD.
# Jalankan: bash scripts/install-hooks.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="$REPO_ROOT/.githooks"
HOOK_FILE="$HOOKS_DIR/pre-push"
SRC_FILE="$REPO_ROOT/scripts/pre-push.sh"

if [ ! -d "$HOOKS_DIR" ]; then
  echo "[hooks] .githooks/ tidak ditemukan — pastikan core.hooksPath sudah di-set."
  exit 1
fi

if [ ! -f "$SRC_FILE" ]; then
  echo "[hooks] scripts/pre-push.sh tidak ditemukan."
  exit 1
fi

cat > "$HOOK_FILE" << 'EOF'
#!/usr/bin/env bash
# ==============================================================================
# pre-push hook — gabungan: PROTECT branch (bawaan wizard) + CI/CD pipeline
# Dihasilkan oleh scripts/install-hooks.sh — jangan edit manual.
# ==============================================================================

PROTECTED_BRANCHES="main master production"

if [ -f config.local.env ]; then
    VAL=$(bash -c "set -a; source config.local.env; set +a; printf '%s' \"\${PROTECTED_BRANCHES:-}\"" 2>/dev/null)
    [ -n "$VAL" ] && PROTECTED_BRANCHES="$VAL"
elif [ -f config.env ]; then
    VAL=$(bash -c "set -a; source config.env; set +a; printf '%s' \"\${PROTECTED_BRANCHES:-}\"" 2>/dev/null)
    [ -n "$VAL" ] && PROTECTED_BRANCHES="$VAL"
fi

ALLOWED_PUSH=true
REF_DATA=""
while read -r local_ref local_sha remote_ref remote_sha; do
    REF_DATA="$REF_DATA $local_ref $local_sha $remote_ref $remote_sha"
    branch=$(echo "$remote_ref" | sed 's|^refs/heads/||')
    for protected in $PROTECTED_BRANCHES; do
        if [ "$branch" = "$protected" ]; then
            if [ "${ALLOW_PROTECTED_PUSH:-}" = "1" ]; then
                echo -e "\033[0;32m✅ [pre-push] Push ke '$branch' diizinkan (ALLOW_PROTECTED_PUSH=1).\033[0m"
            else
                echo -e "\033[0;31m❌ [pre-push] Branch '$branch' dilindungi. Gunakan ALLOW_PROTECTED_PUSH=1\033[0m"
                ALLOWED_PUSH=false
            fi
        fi
    done
done

if [ "$ALLOWED_PUSH" = "false" ]; then
    exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
exec "$REPO_ROOT/scripts/pre-push.sh" "$@" <<< "$REF_DATA"
EOF

chmod +x "$HOOK_FILE"
echo "[hooks] pre-push terpasang: $HOOK_FILE"
echo "[hooks] Logika proteksi branch + pipeline CI/CD aktif."
echo "[hooks] Selesai. Setiap 'git push origin main' akan:"
echo "         1. Cek proteksi branch (ALLOW_PROTECTED_PUSH)"
echo "         2. typecheck + build (CI lokal) — gagal = push dibatalkan"
echo "         3. push ke GitHub"
echo "         4. deploy otomatis ke server (CD) setelah push terverifikasi"
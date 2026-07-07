#!/usr/bin/env bash
# ==============================================================================
# preflight-check.sh — Cek dependency sebelum wizard jalan
# ==============================================================================

set -euo pipefail

echo -e "\033[0;34m🔍 Pre-flight check...\033[0m"

HAS_ERROR=false

# Cek git
if ! command -v git &>/dev/null; then
    echo -e "\033[0;31m❌ git tidak terinstal\033[0m"
    HAS_ERROR=true
fi

# Cek Docker
if ! command -v docker &>/dev/null; then
    echo -e "\033[0;31m❌ Docker tidak terinstal\033[0m"
    HAS_ERROR=true
fi

# Cek node_modules frontend
if [ ! -d "frontend-cms/node_modules" ]; then
    echo -e "\033[0;33m⚠️  frontend-cms/node_modules tidak ada — jalankan npm install di frontend-cms/\033[0m"
fi
if [ ! -d "frontend-public/node_modules" ]; then
    echo -e "\033[0;33m⚠️  frontend-public/node_modules tidak ada — jalankan npm install di frontend-public/\033[0m"
fi

# Cek node_modules backend
if [ ! -d "backend/node_modules" ]; then
    echo -e "\033[0;33m⚠️  backend/node_modules tidak ada — jalankan npm install di backend/\033[0m"
fi

if [ "$HAS_ERROR" = "true" ]; then
    echo -e "\033[0;31m❌ Pre-flight check gagal.\033[0m"
    exit 1
fi

echo -e "\033[0;32m✅ Semua dependency tersedia.\033[0m"
exit 0

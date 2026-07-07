#!/usr/bin/env bash
# ==============================================================================
# detect-stack.sh — Auto-detect project stack berdasarkan file di root
# ==============================================================================

set -euo pipefail

# Prioritaskan stack yang cocok (first match wins)
# Monorepo: cek subfolder package.json
if [ -f "frontend-cms/package.json" ] && grep -q '"nuxt"' frontend-cms/package.json 2>/dev/null; then
    echo "vue-nuxt"
    exit 0
fi
if [ -f "frontend-public/package.json" ] && grep -q '"nuxt"' frontend-public/package.json 2>/dev/null; then
    echo "vue-nuxt"
    exit 0
fi
if [ -f "backend/package.json" ] && grep -q '"@nestjs/core"' backend/package.json 2>/dev/null; then
    echo "node-api"
    exit 0
fi

# Monorepo root or single project
if [ -f "package.json" ]; then
    if grep -q '"nuxt"' package.json 2>/dev/null; then
        echo "vue-nuxt"
        exit 0
    fi
    if grep -q '"@nestjs/core"' package.json 2>/dev/null; then
        echo "node-api"
        exit 0
    fi
    if grep -q '"next"' package.json 2>/dev/null; then
        echo "nextjs"
        exit 0
    fi
    echo "node-api"
    exit 0
fi

# Flutter
if [ -f "pubspec.yaml" ]; then
    echo "flutter"
    exit 0
fi

# Python
if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    echo "python"
    exit 0
fi

echo "unknown"

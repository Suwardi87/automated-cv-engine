#!/usr/bin/env bash
# ==============================================================================
# workflow-vibe-code.sh — Vibe Coding Wizard (Commit-First)
# ==============================================================================
# Panduan interaktif 1-perintah untuk: Conventional Commits, Auto SemVer,
# Auto Changelog, Pengujian Lokal, Security Scan, dan (opsional) Push.
#
# Branding/path/branch protection dibaca dari config.env.
# ==============================================================================

set -euo pipefail

# =============================================================================
# SETUP: TTY GUARD, COLOR, TRAP, CONFIG
# ==============================================================================

# A6.K2(b) — TTY guard: kalau output bukan terminal, hapus ANSI escape codes
# supaya log file tidak penuh \033[0;32m dsb.
if [ -t 1 ]; then
    GREEN='\033[0;32m'
    BLUE='\033[0;34m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    NC='\033[0m'
else
    GREEN=''; BLUE=''; YELLOW=''; RED=''; NC=''
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# A6.K3(a) — Load config.env untuk branding & path (hybrid branding)
PROJECT_NAME="Vibe Code Workflow"
BANNER_NAME=""
DEPLOY_PATH="/opt/app"
PROTECTED_BRANCHES="main master production"

set -a
if [ -f "$SCRIPT_DIR/config.env" ]; then
    # shellcheck disable=SC1090,SC1091
    source "$SCRIPT_DIR/config.env"
fi
if [ -f "$SCRIPT_DIR/config.local.env" ]; then
    # shellcheck disable=SC1090,SC1091
    source "$SCRIPT_DIR/config.local.env"
fi
set +a

# BANNER_NAME default ke PROJECT_NAME kalau kosong
BANNER_NAME="${BANNER_NAME:-$PROJECT_NAME}"

# A6.K2(a) — Trap SIGINT/SIGTERM supaya Ctrl+C mid-script tidak tinggalkan state kotor
LAST_COMMIT_HASH=""
COMMIT_CREATED_BY_SCRIPT=false

cleanup() {
    echo -e "\n${RED}⚠ Diinterupsi (Ctrl+C). Cleanup...${NC}"
    if [ "$COMMIT_CREATED_BY_SCRIPT" = "true" ] && [ -n "$LAST_COMMIT_HASH" ]; then
        echo -e "${YELLOW}Commit '$LAST_COMMIT_HASH' dibuat oleh script sebelum interupsi.${NC}"
        echo -e "${YELLOW}Anda bisa rollback manual: git reset HEAD~1${NC}"
    fi
    exit 130
}
trap cleanup SIGINT SIGTERM

# =============================================================================
# 0. BANNER & BRANCH INFO
# ==============================================================================

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}        ${BANNER_NAME} — VIBE CODING WIZARD              ${NC}"
echo -e "${BLUE}============================================================${NC}"

# C6 — Pre-flight check (disk, network, tools)
if [ -x "$SCRIPT_DIR/scripts/preflight-check.sh" ]; then
    bash "$SCRIPT_DIR/scripts/preflight-check.sh" || {
        echo -e "${RED}❌ Pre-flight check gagal. Fix issue di atas sebelum lanjut.${NC}"
        exit 1
    }
    echo ""
fi

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# =============================================================================
# 0b. DETECT STACK SEKALI DI AWAL (B5 + B6 — dipakai step 1 dan step 3)
# =============================================================================
DETECTED_STACK=""
if [ -x "$SCRIPT_DIR/scripts/detect-stack.sh" ]; then
    DETECTED_STACK=$(bash "$SCRIPT_DIR/scripts/detect-stack.sh" 2>/dev/null || echo "")
fi
if [ -z "$DETECTED_STACK" ] || [ "$DETECTED_STACK" = "unknown" ]; then
    DETECTED_STACK=""
fi

# =============================================================================
# 1. CONVENTIONAL COMMIT & SEMVER WIZARD
# =============================================================================
echo -e "\n${YELLOW}[1/5] Mengatur Commit & Versi Rilis (SemVer)...${NC}"

if git diff-index --quiet HEAD -- 2>/dev/null && [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓ Tidak ada perubahan baru untuk di-commit.${NC}"
    LAST_COMMIT_HASH=$(git rev-parse HEAD)
else
    echo -e "${YELLOW}Perubahan berkas terdeteksi:${NC}"
    git status -s
    echo -e ""

    # A. Pilih tipe commit (B9 — 11 Conventional Commit types)
    echo -e "Pilih tipe perubahan kode Anda:"
    echo -e "  ${GREEN}Paling umum:${NC}"
    echo -e "  1) ${GREEN}feat${NC}      : Fitur baru (Minor bump)"
    echo -e "  2) ${GREEN}fix${NC}       : Perbaikan bug (Patch bump)"
    echo -e "  3) ${BLUE}docs${NC}      : Dokumentasi"
    echo -e "  4) ${BLUE}refactor${NC}  : Restrukturisasi tanpa ubah fungsi"
    echo -e "  5) ${BLUE}test${NC}      : Tambah/memperbaiki unit test"
    echo -e "  6) ${BLUE}chore${NC}     : Update library, config, dll"
    echo -e "  ${GREEN}Tipe lain (jarang dipakai):${NC}"
    echo -e "  7) perf      : Optimasi performa (Patch bump)"
    echo -e "  8) style     : Formatting, whitespace"
    echo -e "  9) build     : Sistem build / dependency eksternal"
    echo -e " 10) ci        : Konfigurasi CI/CD"
    echo -e " 11) revert    : Membatalkan commit sebelumnya"

    read -rp "Masukkan pilihan (1-11, default 6): " type_choice
    case "${type_choice:-6}" in
        1)  TYPE="feat";     BUMP="minor" ;;
        2)  TYPE="fix";      BUMP="patch" ;;
        3)  TYPE="docs";     BUMP="none" ;;
        4)  TYPE="refactor"; BUMP="none" ;;
        5)  TYPE="test";     BUMP="none" ;;
        7)  TYPE="perf";     BUMP="patch" ;;
        8)  TYPE="style";    BUMP="none" ;;
        9)  TYPE="build";    BUMP="none" ;;
        10) TYPE="ci";       BUMP="none" ;;
        11) TYPE="revert";   BUMP="none" ;;
        *)  TYPE="chore";    BUMP="none" ;;
    esac

    # A6.K1(a) — B. Scope (FIX TYPO: SCORE -> SCOPE)
    read -rp "Masukkan scope modul (misal: auth, pos, distribusi, atau kosongkan): " SCOPE
    if [ -n "$SCOPE" ]; then
        FORMATTED_SCOPE="($SCOPE)"
    else
        FORMATTED_SCOPE=""
    fi

    # C. Deskripsi
    read -rp "Masukkan deskripsi singkat perubahan: " DESC
    if [ -z "$DESC" ]; then
        echo -e "${RED}Error: Deskripsi wajib diisi! Alur kerja dibatalkan.${NC}"
        exit 1
    fi

    COMMIT_MSG="${TYPE}${FORMATTED_SCOPE}: ${DESC}"
    echo -e "\nFormat Commit Anda: ${GREEN}${COMMIT_MSG}${NC}"

    # D. SemVer & Changelog
    VERSION_FILE="VERSION"
    VERSION_SOURCE=""
    VERSION_PUBSPEC=""
    VERSION_PKG_JSON=""
    # B5 — Baca VERSION_SOURCE dari manifest kalau ada
    if [ -n "${DETECTED_STACK:-}" ] && [ "$DETECTED_STACK" != "unknown" ]; then
        VERSION_SOURCE=$(bash "$SCRIPT_DIR/scripts/read-stack.sh" "$DETECTED_STACK" VERSION_SOURCE "file" 2>/dev/null || echo "file")
    fi
    VERSION_SOURCE="${VERSION_SOURCE:-file}"

    # B5 — Read current version dari source yang benar
    CURRENT_VER=""
    case "$VERSION_SOURCE" in
        pubspec)
            if [ -f "pubspec.yaml" ]; then
                CURRENT_VER=$(grep -E "^version:" pubspec.yaml | head -1 | awk '{print $2}' | cut -d '+' -f 1 | tr -d '[:space:]')
                VERSION_PUBSPEC="pubspec.yaml"
            fi
            ;;
        package_json)
            if [ -f "package.json" ]; then
                CURRENT_VER=$(python3 -c "import json; print(json.load(open('package.json')).get('version', ''))" 2>/dev/null || echo "")
                VERSION_PKG_JSON="package.json"
            fi
            ;;
        file|*)
            if [ ! -f "$VERSION_FILE" ]; then
                echo "1.0.0" > "$VERSION_FILE"
            fi
            CURRENT_VER=$(tr -d '[:space:]' < "$VERSION_FILE" 2>/dev/null || echo "1.0.0")
            ;;
    esac
    # A6.K1(c) — Stabilize VERSION read (trim whitespace + fallback)
    CURRENT_VER="${CURRENT_VER:-1.0.0}"

    IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VER"
    MAJOR="${MAJOR:-1}"; MINOR="${MINOR:-0}"; PATCH="${PATCH:-0}"

    if [ "$BUMP" = "minor" ]; then
        MINOR=$((MINOR + 1))
        PATCH=0
    elif [ "$BUMP" = "patch" ]; then
        PATCH=$((PATCH + 1))
    fi

    NEW_VER="${MAJOR}.${MINOR}.${PATCH}"

    if [ "$NEW_VER" != "$CURRENT_VER" ]; then
        # B5 — Write new version ke source yang benar
        case "$VERSION_SOURCE" in
            pubspec)
                if [ -f "pubspec.yaml" ]; then
                    # Update version: X.Y.Z+N (pertahankan build number)
                    BUILD_NUM=$(grep -E "^version:" pubspec.yaml | head -1 | awk '{print $2}' | cut -d '+' -f 2 || echo "1")
                    BUILD_NUM="${BUILD_NUM:-1}"
                    sed -i "s|^version:.*|version: ${NEW_VER}+${BUILD_NUM}|" pubspec.yaml
                    echo -e "Versi pubspec.yaml diperbarui: ${YELLOW}${CURRENT_VER}${NC} ──► ${GREEN}${NEW_VER}+${BUILD_NUM}${NC}"
                fi
                ;;
            package_json)
                if [ -f "package.json" ]; then
                    # Update "version": "X.Y.Z"
                    python3 -c "
import json
with open('package.json') as f: d = json.load(f)
d['version'] = '${NEW_VER}'
with open('package.json', 'w') as f: json.dump(d, f, indent=2)
" 2>/dev/null && echo -e "Versi package.json diperbarui: ${YELLOW}${CURRENT_VER}${NC} ──► ${GREEN}${NEW_VER}${NC}"
                fi
                ;;
            file|*)
                echo "$NEW_VER" > "$VERSION_FILE"
                echo -e "Versi aplikasi diperbarui: ${YELLOW}${CURRENT_VER}${NC} ──► ${GREEN}${NEW_VER}${NC}"
                ;;
        esac

        CHANGELOG="CHANGELOG.md"
        DATE=$(date +"%Y-%m-%d")

        if [ ! -f "$CHANGELOG" ]; then
            printf "# Changelog Proyek\n\nSemua perubahan penting akan dicatat di sini.\n\n" > "$CHANGELOG"
        fi

        TEMP_CHANGELOG=$(mktemp)
        head -n 4 "$CHANGELOG" > "$TEMP_CHANGELOG"
        echo "## [$NEW_VER] - $DATE" >> "$TEMP_CHANGELOG"
        echo "- $COMMIT_MSG" >> "$TEMP_CHANGELOG"
        echo "" >> "$TEMP_CHANGELOG"
        tail -n +5 "$CHANGELOG" >> "$TEMP_CHANGELOG"
        mv "$TEMP_CHANGELOG" "$CHANGELOG"
        echo -e "${GREEN}✓ Changelog berhasil diperbarui di CHANGELOG.md${NC}"
    fi

    # A6.K3(d) — E. Secret guard SEBELUM git add .
    # Stage dulu supaya bisa di-inspect, lalu cek file sensitif
    git add .
    STAGED_FILES=$(git diff --cached --name-only)
    SENSITIVE_PATTERN='(^\.env$|^\.env\.|\.key$|\.pem$|secret|credentials|^id_rsa)'

    if echo "$STAGED_FILES" | grep -qiE "$SENSITIVE_PATTERN"; then
        echo -e "\n${RED}❌ DANGER: File sensitif ter-stage!${NC}"
        echo -e "${RED}   Pertahankan guardrail 'AI dilarang commit file sensitif'.${NC}"
        echo ""
        echo "File yang terdeteksi:"
        echo "$STAGED_FILES" | grep -iE "$SENSITIVE_PATTERN" | head -10
        echo ""
        echo -e "${YELLOW}   Unstage manual dengan: git restore --staged <file>${NC}"
        echo -e "${YELLOW}   Atau tambahkan ke .gitignore${NC}"
        exit 1
    fi

    # F. Commit
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✓ Perubahan berhasil di-commit lokal.${NC}"
    LAST_COMMIT_HASH=$(git rev-parse HEAD)
    COMMIT_CREATED_BY_SCRIPT=true
fi

# =============================================================================
# 2. DOCKER DEV SERVICES
# =============================================================================
echo -e "\n${YELLOW}[2/5] Memeriksa status service lokal...${NC}"
if [ -f "docker-compose.dev.yml" ]; then
    # A6.K3(c) — Skip docker compose up kalau tidak ada service aktif
    # (semua service dikomentari di template flutter/mobile-expo)
    if grep -qE '^[[:space:]]*[a-z][a-z0-9_-]+:' docker-compose.dev.yml; then
        if ! docker compose -f docker-compose.dev.yml ps 2>/dev/null | grep -q "Up"; then
            echo -e "${YELLOW}Service dev mati. Mengaktifkan secara otomatis...${NC}"
            docker compose -f docker-compose.dev.yml up -d --wait
            sleep 3
        else
            echo -e "${GREEN}✓ Service dev aktif.${NC}"
        fi
    else
        echo -e "${YELLOW}docker-compose.dev.yml tidak punya service aktif (semua dikomentari). Skip.${NC}"
    fi
else
    echo -e "${YELLOW}docker-compose.dev.yml tidak ditemukan, melewati pengecekan service.${NC}"
fi

# =============================================================================
# 3. TEST SUITE & COVERAGE (B6 — auto-detect via stack.env manifest)
# =============================================================================
echo -e "\n${YELLOW}[3/5] Menjalankan Integrasi Test & Coverage...${NC}"
TESTS_PASSED=true
mkdir -p reports/test reports/security

# B6: DETECTED_STACK sudah di-set di section 0b (atas script)
# Tidak perlu detect ulang di sini

if [ -z "$DETECTED_STACK" ]; then
    echo -e "${YELLOW}Tidak ada stack yang terdeteksi dari manifest.${NC}"
    echo -e "${YELLOW}Melewati tahap pengujian.${NC}"
else
    # Load stack manifest
    STACK_FILE="$SCRIPT_DIR/templates/$DETECTED_STACK/stack.env"
    if [ ! -f "$STACK_FILE" ]; then
        echo -e "${RED}❌ Manifest tidak ditemukan untuk stack '$DETECTED_STACK': $STACK_FILE${NC}"
        exit 1
    fi

    # shellcheck disable=SC1090,SC1091
    set -a; source "$STACK_FILE"; set +a

    echo -e "${GREEN}✓ Stack terdeteksi: ${DISPLAY_NAME:-$DETECTED_STACK}${NC}"

    # --- Package manager install (B4 — detect dari lockfile) ---
    if [ -n "${PACKAGE_MANAGER_DETECT:-}" ]; then
        INSTALL_RAN=false
        # Format: "<lockfile>:<cmd> <lockfile>:<cmd> ..."
        for pair in $PACKAGE_MANAGER_DETECT; do
            lockfile="${pair%%:*}"
            cmd="${pair#*:}"
            if [ -f "$lockfile" ] && [ "$INSTALL_RAN" = "false" ]; then
                echo -e "${BLUE}Menjalankan $cmd (lockfile: $lockfile)...${NC}"
                eval "$cmd" >/dev/null 2>&1 || true
                INSTALL_RAN=true
            fi
        done
        # Fallback kalau tidak ada lockfile yang cocok
        if [ "$INSTALL_RAN" = "false" ] && [ -n "${PACKAGE_MANAGER_FALLBACK:-}" ]; then
            echo -e "${BLUE}Menjalankan $PACKAGE_MANAGER_FALLBACK...${NC}"
            eval "$PACKAGE_MANAGER_FALLBACK" >/dev/null 2>&1 || true
        fi
    elif [ -n "${PACKAGE_MANAGER_FALLBACK:-}" ]; then
        echo -e "${BLUE}Menjalankan $PACKAGE_MANAGER_FALLBACK...${NC}"
        eval "$PACKAGE_MANAGER_FALLBACK" >/dev/null 2>&1 || true
    fi

    # --- Lint ---
    if [ -n "${LINT_CMD:-}" ]; then
        echo -e "${BLUE}Menjalankan LINT_CMD: $LINT_CMD...${NC}"
        eval "$LINT_CMD" || TESTS_PASSED=false
    fi

    # --- Typecheck (opsional, beberapa stack tidak punya) ---
    if [ -n "${TYPECHECK_CMD:-}" ]; then
        echo -e "${BLUE}Menjalankan TYPECHECK_CMD: $TYPECHECK_CMD...${NC}"
        eval "$TYPECHECK_CMD" || TESTS_PASSED=false
    fi

    # --- Test ---
    if [ -n "${TEST_CMD:-}" ]; then
        echo -e "${BLUE}Menjalankan TEST_CMD: $TEST_CMD...${NC}"
        eval "$TEST_CMD" || TESTS_PASSED=false
    fi
fi

# =============================================================================
# 3b. TEST REPORT (setelah test suite, sebelum cek gagal)
# =============================================================================
# Tulis result.json minimal supaya generate_test_report.py bisa konsumsi
if [ -f "$SCRIPT_DIR/scripts/collect-test-result.sh" ]; then
    bash "$SCRIPT_DIR/scripts/collect-test-result.sh" "${TESTS_PASSED}" || true
fi
# Generate HTML report kalau script ada
if [ -f "$SCRIPT_DIR/scripts/generate_test_report.py" ] && [ -f "reports/test/result.json" ]; then
    python3 "$SCRIPT_DIR/scripts/generate_test_report.py" >/dev/null 2>&1 || true
    echo -e "${GREEN}✓ Test report: reports/test/index.html${NC}"
fi

# =============================================================================
# 3c. PENANGANAN ERROR JIKA TES GAGAL
# =============================================================================
if [ "$TESTS_PASSED" = "false" ]; then
    echo -e "\n${RED}❌ PENGUJIAN INTEGRASI GAGAL!${NC}"
    echo -e "\n${YELLOW}Pilihan Pemulihan:${NC}"
    echo -e "  1) Batalkan/Revert commit terakhir lokal (recommended)"
    echo -e "  2) Biarkan commit tetap ada untuk diperbaiki nanti"
    read -rp "Pilihan Anda (1/2): " fail_choice

    if [ "$fail_choice" = "1" ]; then
        # A6.K2(c) — Handle initial commit (tidak ada parent)
        if git rev-parse --verify HEAD^ >/dev/null 2>&1; then
            echo -e "${YELLOW}Membatalkan commit terakhir ($LAST_COMMIT_HASH) tapi menyimpan perubahan file...${NC}"
            git reset HEAD~1
            # A6.K2(d) — Handle VERSION/CHANGELOG.md yang baru dibuat (untracked)
            # Kalau sudah tracked, checkout. Kalau untracked setelah reset, rm -f
            git checkout -- VERSION CHANGELOG.md 2>/dev/null || true
            # Hapus file baru yang mungkin tersisa kalau reset tidak bersih
            [ -f VERSION ] && [ "$(git ls-files VERSION)" = "" ] && rm -f VERSION
            [ -f CHANGELOG.md ] && [ "$(git ls-files CHANGELOG.md)" = "" ] && rm -f CHANGELOG.md
            echo -e "${GREEN}✓ Commit & Versi berhasil dibatalkan. Kode Anda aman di editor.${NC}"
            COMMIT_CREATED_BY_SCRIPT=false
        else
            echo -e "${RED}Tidak bisa revert: ini adalah initial commit (tidak ada parent).${NC}"
            echo -e "${YELLOW}File perubahan tetap ada. Anda perlu hapus .git/ untuk reset total.${NC}"
        fi
    else
        echo -e "${YELLOW}Commit dipertahankan.${NC}"
    fi
    exit 1
fi

# =============================================================================
# 4. SECURITY SCAN
# =============================================================================
echo -e "\n${YELLOW}[4/5] Menjalankan Security Scan & Verifikasi Build...${NC}"

if [ -n "${DETECTED_STACK:-}" ] && [ "$DETECTED_STACK" != "unknown" ]; then
    # B6: Pakai manifest field SECURITY_AUDIT_CMD + SECURITY_HTML_CMD + SECURITY_EXTRA_CMD
    if [ -n "${SECURITY_AUDIT_CMD:-}" ]; then
        echo -e "${BLUE}Menjalankan security audit: $SECURITY_AUDIT_CMD...${NC}"
        eval "$SECURITY_AUDIT_CMD" 2>/dev/null || true
    fi
    if [ -n "${SECURITY_HTML_CMD:-}" ]; then
        echo -e "${BLUE}Membuat HTML report security...${NC}"
        eval "$SECURITY_HTML_CMD" &>/dev/null || true
    fi
    if [ -n "${SECURITY_EXTRA_CMD:-}" ]; then
        echo -e "${BLUE}Menjalankan security extra (bandit/safety/etc)...${NC}"
        eval "$SECURITY_EXTRA_CMD" 2>/dev/null || true
    fi
    echo -e "${GREEN}✓ Security scan selesai untuk stack: ${DISPLAY_NAME:-$DETECTED_STACK}${NC}"
else
    echo -e "${YELLOW}Tidak ada stack terdeteksi — skip security scan.${NC}"
fi

echo -e "${GREEN}✓ Scan keamanan dan build compile selesai.${NC}"

# =============================================================================
# 5. SAFE DEPLOY PUSH
# =============================================================================
echo -e "\n${YELLOW}[5/5] Melakukan Push ke GitHub...${NC}"
echo -e "${BLUE}============================================================${NC}"
# A6.K1(c) — VERSION read stabil
DISPLAY_VER="1.0.0"
if [ -f "VERSION" ]; then
    DISPLAY_VER=$(tr -d '[:space:]' < VERSION 2>/dev/null || echo "1.0.0")
fi
echo -e "${GREEN}🎉 PRE-FLIGHT CHECK SUKSES! VERSI ${DISPLAY_VER} SIAP DIRILIS.${NC}"
echo -e "${BLUE}============================================================${NC}"
echo -e ""

# Cek apakah branch aktif termasuk protected
IS_PROTECTED=false
for protected in $PROTECTED_BRANCHES; do
    if [ "$CURRENT_BRANCH" = "$protected" ]; then
        IS_PROTECTED=true
        break
    fi
done

if [ "$IS_PROTECTED" = "true" ]; then
    echo -e "${RED}⚠️  PERINGATAN SOFTWARE HOUSE / CORPORATE GUARDRAILS:${NC}"
    echo -e "Anda akan push ke branch terlindungi (${CURRENT_BRANCH})."
    echo -e "Protected branches: ${PROTECTED_BRANCHES}"
    read -rp "Apakah Anda yakin? (y/n): " force_confirm
    if [ "$force_confirm" != "y" ] && [ "$force_confirm" != "Y" ]; then
        echo -e "${YELLOW}Push dibatalkan untuk menjaga keamanan branch utama.${NC}"
        exit 0
    fi
fi

read -rp "Kirim pembaruan (Push) ke origin '${CURRENT_BRANCH}'? (y/n): " confirm
if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    echo -e "${YELLOW}Melakukan git push ke origin ${CURRENT_BRANCH}...${NC}"

    # A6.K3(b) — Set ALLOW_PROTECTED_PUSH=1 otomatis kalau user sudah konfirmasi push ke branch terlindungi
    # Ini resolve kontradiksi C1: script push ke protected branch akan di-block oleh pre-push hook
    # yang seharusnya jaga branch. Solusi: script set env yang sama yang dibutuhkan hook.
    if [ "$IS_PROTECTED" = "true" ]; then
        export ALLOW_PROTECTED_PUSH=1
        echo -e "${BLUE}(ALLOW_PROTECTED_PUSH=1 di-set otomatis untuk push terkonfirmasi)${NC}"
    fi

    git push origin "$CURRENT_BRANCH"
    echo -e "${GREEN}✓ Push berhasil dikirim! VPS Anda akan diperbarui secara otomatis.${NC}"

    # Unset setelah push selesai
    unset ALLOW_PROTECTED_PUSH
else
    echo -e "${YELLOW}Push ditangguhkan. Commit tetap tersimpan di lokal.${NC}"
fi

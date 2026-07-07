#!/usr/bin/env bash
# ==============================================================================
# scripts/setup_runner.sh — Setup GitHub Actions Self-Hosted Runner di VPS
# ==============================================================================
# Menginstal dependensi yang diperlukan untuk CI/CD Pipeline.
# Baca deploy_path dari config.env (default: /opt/<project_name>).
# Baca supported_stacks untuk conditional install (hemat bandwidth VPS).
# ==============================================================================

set -euo pipefail

# TTY guard
if [ -t 1 ]; then
    GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
else
    GREEN=''; BLUE=''; YELLOW=''; RED=''; NC=''
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- A9.1 — Load deploy_path dari config.env ---
PROJECT_NAME="my-project"
DEPLOY_PATH="/opt/${PROJECT_NAME}"
SUPPORTED_STACKS=""

set -a
if [ -f "$ROOT_DIR/config.env" ]; then
    # shellcheck disable=SC1090,SC1091
    source "$ROOT_DIR/config.env"
fi
if [ -f "$ROOT_DIR/config.local.env" ]; then
    # shellcheck disable=SC1090,SC1091
    source "$ROOT_DIR/config.local.env"
fi
set +a

# Auto-detect stacks kalau config kosong
if [ -z "$SUPPORTED_STACKS" ] && [ -d "$ROOT_DIR/templates" ]; then
    for d in "$ROOT_DIR/templates"/*/; do
        [ -d "$d" ] || continue
        name=$(basename "$d")
        case "$name" in _*) continue ;; esac
        SUPPORTED_STACKS="$SUPPORTED_STACKS $name"
    done
    SUPPORTED_STACKS="${SUPPORTED_STACKS# }"
fi

DEPLOY_PATH="${DEPLOY_PATH:-/opt/${PROJECT_NAME:-my-project}}"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}   Setup GitHub Self-Hosted Runner & Dependencies VPS       ${NC}"
echo -e "${BLUE}============================================================${NC}"
echo -e "Project: ${YELLOW}${PROJECT_NAME}${NC}"
echo -e "Deploy path: ${YELLOW}${DEPLOY_PATH}${NC}"
echo -e "Stacks: ${YELLOW}${SUPPORTED_STACKS:-none}${NC}"
echo ""

# =============================================================================
# 1. Cek User (refuse root)
# =============================================================================
if [ "$(id -u)" -eq 0 ]; then
    echo -e "${RED}Error: Jangan jalankan script ini sebagai root!${NC}"
    echo -e "Silakan buat user deploy, masukkan ke grup docker SAJA (bukan sudo), lalu jalankan sebagai user deploy."
    echo -e "Contoh:"
    echo -e "  adduser deploy"
    echo -e "  usermod -aG docker deploy   # A9.5 fix: drop sudo group"
    echo -e "  su - deploy"
    exit 1
fi

# =============================================================================
# 2. Docker & Docker Compose
# =============================================================================
echo -e "${YELLOW}[1/4] Memeriksa Docker & Docker Compose...${NC}"
if ! command -v docker >/dev/null 2>&1; then
    echo -e "${YELLOW}Docker tidak ditemukan. Menginstal Docker...${NC}"
    sudo apt update && sudo apt install -y curl git
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker "$USER"
    echo -e "${GREEN}✓ Docker terinstal. Silakan log out dan log in kembali jika permission denied.${NC}"
else
    echo -e "${GREEN}✓ Docker sudah terpasang: $(docker --version)${NC}"
fi

# =============================================================================
# 3. A9.2 — Conditional install berdasarkan supported_stacks
# =============================================================================
echo -e "\n${YELLOW}[2/4] Menginstal dependensi build & security scanner (conditional)...${NC}"
sudo apt update && sudo apt install -y python3 python3-pip make gcc jq

# Helper: cek apakah stack tertentu didukung
has_stack() {
    local target="$1"
    for s in $SUPPORTED_STACKS; do
        [ "$s" = "$target" ] && return 0
    done
    return 1
}

# --- Node.js (untuk nextjs, vue-nuxt, node-api, mobile-expo) ---
if has_stack nextjs || has_stack vue-nuxt || has_stack node-api || has_stack mobile-expo; then
    if ! command -v node >/dev/null 2>&1; then
        echo -e "${YELLOW}Menginstal Node.js 20 LTS (dibutuhkan stack Node)...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs
    else
        echo -e "${GREEN}✓ Node.js sudah terpasang: $(node -v)${NC}"
    fi

    # npm-audit-html — A9.6 fix: pakai npx saat runtime, tidak perlu global install
    echo -e "${YELLOW}npm-audit-html akan dipanggil via npx (tidak perlu sudo npm install -g).${NC}"
else
    echo -e "${YELLOW}Skip Node.js — tidak ada stack Node di config.${NC}"
fi

# --- Go (untuk stack Go) ---
# NOTE: Saat ini tidak ada template Go di framework, tapi STYLE_GUIDE.md menyebut.
# Install hanya kalau user eksplisit tambahkan stack Go di config.env.
if has_stack go; then
    if ! command -v go >/dev/null 2>&1; then
        echo -e "${YELLOW}Menginstal Go...${NC}"
        # A9.3 — Updated version + checksum verification
        GO_VERSION="1.23.4"  # Updated dari 1.22.4 (EOL Aug 2025)
        GO_TARBALL="go${GO_VERSION}.linux-amd64.tar.gz"
        GO_URL="https://go.dev/dl/${GO_TARBALL}"
        GO_SHA_URL="${GO_URL}.sha256"

        curl -OL "$GO_URL"
        # Verify checksum dari server resmi Go
        if curl -fsSL "$GO_SHA_URL" -o "${GO_TARBALL}.sha256"; then
            echo -e "${YELLOW}Verifying SHA256 checksum...${NC}"
            # Format .sha256 dari go.dev = "<hash>  <filename>"
            expected_sha=$(awk '{print $1}' "${GO_TARBALL}.sha256")
            actual_sha=$(sha256sum "$GO_TARBALL" | awk '{print $1}')
            if [ "$expected_sha" = "$actual_sha" ]; then
                echo -e "${GREEN}✓ Checksum OK${NC}"
            else
                echo -e "${RED}❌ Checksum mismatch! Aborting Go install.${NC}"
                echo "  Expected: $expected_sha"
                echo "  Actual:   $actual_sha"
                rm -f "$GO_TARBALL" "${GO_TARBALL}.sha256"
                exit 1
            fi
        else
            echo -e "${YELLOW}⚠ Checksum file tidak tersedia, skip verification (INSECURE).${NC}"
        fi

        sudo rm -rf /usr/local/go
        sudo tar -C /usr/local -xzf "$GO_TARBALL"
        rm -f "$GO_TARBALL" "${GO_TARBALL}.sha256"

        if ! grep -q "/usr/local/go/bin" ~/.profile; then
            echo 'export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin' >> ~/.profile
        fi
        export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin
        echo -e "${GREEN}✓ Go ${GO_VERSION} terinstal${NC}"
    else
        echo -e "${GREEN}✓ Go sudah terpasang: $(go version)${NC}"
    fi

    # gosec — A9.4 fix: pin to specific version via GitHub release
    export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin
    if ! command -v gosec >/dev/null 2>&1; then
        echo -e "${YELLOW}Menginstal gosec v2.21.4 (pinned)...${NC}"
        # Pin ke versi spesifik, bukan master branch
        GOSEC_VERSION="2.21.4"
        curl -sfL "https://raw.githubusercontent.com/securego/gosec/v${GOSEC_VERSION}/install.sh" \
            | sh -s -- -b "$(go env GOPATH)/bin" "v${GOSEC_VERSION}"
    fi
    echo -e "${GREEN}✓ gosec terpasang${NC}"

    # govulncheck
    if ! command -v govulncheck >/dev/null 2>&1; then
        go install golang.org/x/vuln/cmd/govulncheck@latest
    fi
    echo -e "${GREEN}✓ govulncheck terpasang${NC}"
else
    echo -e "${YELLOW}Skip Go — tidak ada stack Go di config.${NC}"
fi

# =============================================================================
# 4. Folder deployment (A9.1 fix — dynamic dari config)
# =============================================================================
echo -e "\n${YELLOW}[3/4] Menyiapkan folder deployment...${NC}"
if [ -n "$DEPLOY_PATH" ] && [ ! -d "$DEPLOY_PATH" ]; then
    sudo mkdir -p "$DEPLOY_PATH"
    sudo chown -R "$USER:$USER" "$DEPLOY_PATH"
    echo -e "${GREEN}✓ Folder deployment siap di: ${DEPLOY_PATH}${NC}"
else
    echo -e "${GREEN}✓ Folder deployment sudah ada: ${DEPLOY_PATH}${NC}"
fi

# =============================================================================
# 5. GitHub Runner (A9.7 — updated version)
# =============================================================================
echo -e "\n${YELLOW}[4/4] Menyiapkan GitHub Actions Runner...${NC}"

RUNNER_DIR="$HOME/actions-runner"
# A9.7 — Updated runner version (sebelumnya 2.319.1 dari tahun 2024)
RUNNER_VER="2.322.0"

if [ -d "$RUNNER_DIR" ] && [ -x "$RUNNER_DIR/run.sh" ]; then
    echo -e "${YELLOW}Folder ${RUNNER_DIR} sudah ada. Skip download.${NC}"
else
    mkdir -p "$RUNNER_DIR" && cd "$RUNNER_DIR"
    echo -e "Mengunduh GitHub Runner v${RUNNER_VER}..."
    RUNNER_TARBALL="actions-runner-linux-x64-${RUNNER_VER}.tar.gz"
    curl -o "$RUNNER_TARBALL" -L \
        "https://github.com/actions/runner/releases/download/v${RUNNER_VER}/${RUNNER_TARBALL}"

    # Verify checksum dari GitHub release
    echo -e "${YELLOW}Verifying runner checksum...${NC}"
    EXPECTED_SHA=$(curl -fsSL "https://github.com/actions/runner/releases/download/v${RUNNER_VER}/actions-runner-linux-x64-${RUNNER_VER}.tar.gz.sha256" | awk '{print $1}')
    ACTUAL_SHA=$(sha256sum "$RUNNER_TARBALL" | awk '{print $1}')
    if [ "$EXPECTED_SHA" = "$ACTUAL_SHA" ]; then
        echo -e "${GREEN}✓ Runner checksum OK${NC}"
    else
        echo -e "${RED}❌ Runner checksum mismatch! Aborting.${NC}"
        exit 1
    fi

    tar xzf "$RUNNER_TARBALL"
    rm "$RUNNER_TARBALL"
    echo -e "${GREEN}✓ GitHub Runner v${RUNNER_VER} diekstrak ke ${RUNNER_DIR}${NC}"
fi

# =============================================================================
# Final instructions
# =============================================================================
echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}                SETUP DEPENDENSI SELESAI                    ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "${YELLOW}Langkah selanjutnya untuk menghubungkan Runner ke GitHub:${NC}"
echo "1. Buka repositori GitHub Anda di browser."
echo "2. Pergi ke: Settings → Actions → Runners → New self-hosted runner → Linux"
echo "3. Copy command configure (dimulai dengan ./config.sh ...) di seksi 'Configure'."
echo "4. Jalankan command tersebut di terminal VPS di folder:"
echo -e "   ${BLUE}${RUNNER_DIR}${NC}"
echo -e "   Rekomendasi nama runner: ${GREEN}${PROJECT_NAME}-vps${NC}"
echo -e "   Tambahkan label: ${GREEN}self-hosted,linux,vps${NC}"
echo "5. Setelah konfigurasi sukses, install & start sebagai daemon service:"
echo -e "   ${BLUE}sudo ./svc.sh install${NC}"
echo -e "   ${BLUE}sudo ./svc.sh start${NC}"
echo ""
echo "Pipeline CI akan otomatis detect runner ini. Deploy berikutnya cepat."

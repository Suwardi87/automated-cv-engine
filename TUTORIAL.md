# 📖 Tutorial Lengkap: Workflow Vibe Code v2.2

> Panduan step-by-step dari nol sampai deploy. Ikuti urutan ini dan Anda tidak akan tersesat.

---

## 🎯 Apa Itu Workflow Vibe Code?

Framework yang membungkus proses development jadi **siklus aman**:

```
Anda tulis kode  →  ./workflow-vibe-code.sh  →  otomatis:
                                          1. Commit (Conventional Commits + SemVer)
                                          2. Test suite jalan
                                          3. Security scan
                                          4. Push ke GitHub (dengan konfirmasi)
                                          5. CI/CD auto-deploy ke VPS
```

**Prinsip:** Lokal dulu, VPS terakhir. Kalau tes gagal lokal, commit di-revert otomatis.

---

## 📦 Stack yang Didukung (7)

| Stack | Untuk | Contoh Project |
|---|---|---|
| **nextjs** | Web app SSR/SSG | Landing page, dashboard |
| **vue-nuxt** | Web app Vue | Admin panel, e-commerce |
| **node-api** | Backend REST/GraphQL | API server, microservice |
| **go** | Backend Go (Clean Arch) | High-perf API, microservice |
| **python** | Backend FastAPI/Django | API, ML serving |
| **mobile-expo** | Mobile cross-platform | App iOS + Android |
| **flutter** | Mobile cross-platform | App iOS + Android (Dart) |

---

## 🚀 Quick Start (5 Menit dari Nol)

### Asumsi
- Komputer Anda: Linux/Mac/WSL dengan `bash`, `git`, `python3`
- Untuk Flutter: Flutter SDK terinstal
- Untuk Node: Node.js 20+ terinstal

### Step 1: Dapatkan Framework

```bash
# Clone repo framework
git clone <repo-anda>/workflow-vibe-code.git
cd workflow-vibe-code
```

### Step 2: Bikin Project Baru

```bash
# Pilih stack (ganti 'nextjs' dengan stack pilihan Anda)
./scripts/init-project.sh nextjs my-app

# Masuk ke folder project
cd my-app
```

Output yang Anda lihat:
```
🚀 Scaffolding nextjs project: my-app
📦 Copying workflow assets...
  → from _common/ (shared boilerplate):
    copied TODO.md
    copied .githooks
  → from nextjs/ (stack-specific):
    copied AGENTS.md
    copied CHANGELOG.md
    copied docker-compose.dev.yml
    ...
🔧 Copying workflow wizard + config...
✅ Done! Project created at: my-app/

Next steps:
  cd my-app
  # Edit config.env sesuai branding project Anda
  # Mulai koding, lalu jalankan:
  ./workflow-vibe-code.sh
```

### Step 3: Konfigurasi Project (WAJIB)

```bash
# Edit config.env di root project Anda
nano config.env
```

Field yang perlu Anda sesuaikan:

```bash
PROJECT_NAME="My Awesome App"           # nama project Anda
BANNER_NAME="My Awesome App"             # banner wizard
DEPLOY_PATH="/opt/myapp"                 # path deploy di VPS
PROTECTED_BRANCHES="main master production"
HEALTH_ENDPOINT="http://localhost:3000/api/health"
```

> **Tip:** Kalau mau override lokal tanpa ubah file ter-track:
> ```bash
> cp config.env config.local.env
> # Edit config.local.env (di-ignore git)
> ```

### Step 4: Mulai Koding

Sekarang Anda bisa koding biasa. Tulis fitur, perbaiki bug, dll.

### Step 5: Jalankan Wizard Setiap Selesai Fitur

```bash
./workflow-vibe-code.sh
```

Wizard akan interaktif menanyakan:
1. **Tipe commit** (1-11, lihat daftar di bawah)
2. **Scope modul** (opsional, misal: `auth`, `pos`, `cart`)
3. **Deskripsi singkat**
4. **Konfirmasi push** ke GitHub

Contoh sesi:
```
Pilih tipe perubahan kode Anda:
  Paling umum:
  1) feat      : Fitur baru (Minor bump)
  2) fix       : Perbaikan bug (Patch bump)
  ...
Masukkan pilihan (1-11, default 6): 1
Masukkan scope modul: auth
Masukkan deskripsi singkat: tambah login Google OAuth

Format Commit Anda: feat(auth): tambah login Google OAuth
Versi aplikasi diperbarui: 1.0.0 ──► 1.1.0
✓ Changelog berhasil diperbarui di CHANGELOG.md
✓ Perubahan berhasil di-commit lokal.

[2/5] Memeriksa status service lokal...
[3/5] Menjalankan Integrasi Test & Coverage...
✓ Stack terdeteksi: Next.js + TypeScript + Tailwind
Menjalankan npm run lint...
Menjalankan npm run typecheck...
Menjalankan npm test...

[4/5] Menjalankan Security Scan & Verifikasi Build...
✓ npm audit selesai.

[5/5] Melakukan Push ke GitHub...
🎉 PRE-FLIGHT CHECK SUKSES! VERSI 1.1.0 SIAP DIRILIS.

Kirim pembaruan (Push) ke origin 'main'? (y/n): y
✓ Push berhasil dikirim! VPS Anda akan diperbarui secara otomatis.
```

**Selesai!** Fitur Anda sudah di-deploy ke VPS dalam ~30 detik.

---

## 🎨 11 Tipe Commit yang Tersedia

| # | Tipe | Bump | Kapan Dipakai |
|:---:|---|---|---|
| 1 | `feat` | Minor (1.0.0→1.1.0) | Fitur baru |
| 2 | `fix` | Patch (1.1.0→1.1.1) | Bug fix |
| 3 | `docs` | — | Dokumentasi |
| 4 | `refactor` | — | Restructure tanpa ubah fungsi |
| 5 | `test` | — | Tambah/improve test |
| 6 | `chore` | — | Update library, config |
| 7 | `perf` | Patch | Optimasi performa |
| 8 | `style` | — | Formatting, whitespace |
| 9 | `build` | — | Sistem build / dependency |
| 10 | `ci` | — | Konfigurasi CI/CD |
| 11 | `revert` | — | Batalkan commit |

---

## 🔄 Skenario Umum

### Skenario A: Tambah Fitur Baru

```bash
# 1. Tulis kode fitur di editor
# 2. Jalankan wizard
./workflow-vibe-code.sh
# Pilih 1 (feat), isi scope dan deskripsi
# Wizard: commit + test + push otomatis
```

### Skenario B: Fix Bug

```bash
# 1. Reproduce bug, tulis fix
# 2. Jalankan wizard
./workflow-vibe-code.sh
# Pilih 2 (fix), isi scope dan deskripsi
# Patch version naik otomatis (1.1.0 → 1.1.1)
```

### Skenario C: Tes Gagal — Revert

Kalau tes gagal saat wizard jalan, Anda akan lihat:

```
❌ PENGUJIAN INTEGRASI GAGAL!

Pilihan Pemulihan:
  1) Batalkan/Revert commit terakhir lokal (recommended)
  2) Biarkan commit tetap ada untuk diperbaiki nanti
Pilihan Anda (1/2):
```

- **Pilih 1** kalau mau rollback bersih (file perubahan tetap di editor, commit saja yang dibatalkan)
- **Pilih 2** kalau mau fix di commit berikutnya

### Skenario D: Push ke Branch Terlindungi (main/master/production)

```
⚠️ PERINGATAN SOFTWARE HOUSE / CORPORATE GUARDRAILS:
Anda akan push ke branch terlindungi (main).
Protected branches: main master production
Apakah Anda yakin? (y/n):
```

- Ketik `y` untuk konfirmasi (wizard akan set `ALLOW_PROTECTED_PUSH=1` otomatis supaya tidak bentrok dengan hook)
- Ketik `n` untuk batal

### Skenario E: Cek Laporan Tes Lokal

Setelah wizard selesai, buka di browser:

```bash
# Linux
xdg-open reports/test/index.html

# macOS
open reports/test/index.html

# WSL
explorer.exe reports/test/index.html
```

Anda akan lihat dashboard gelap dengan:
- Total test, lulus, gagal, success rate
- Breakdown per modul
- Durasi tiap test case

### Skenario F: Cek Laporan Deploy dari VPS

Setelah CI/CD jalan di VPS, laporan deploy ada di GitHub Actions artifacts.

```bash
# Lihat daftar run terbaru
./scripts/pull-deploy-report.sh --list

# Download run terbaru
./scripts/pull-deploy-report.sh

# Download run spesifik
./scripts/pull-deploy-report.sh 12345678
```

> **Butuh:** `gh` CLI terinstal dan sudah login (`gh auth login`).

---

## ⚙️ Konfigurasi Lanjutan

### File `config.env`

Lengkapnya, ini semua field yang bisa Anda edit:

```bash
PROJECT_NAME="My App"                    # nama project
BANNER_NAME="My App"                     # banner wizard
DEPLOY_PATH="/opt/myapp"                 # path deploy VPS
DEPLOY_SUBREPOS=""                       # sub-repo yang di-pull saat deploy
PROTECTED_BRANCHES="main master production"
CI_TRIGGER_BRANCHES="staging main"
HEALTH_ENDPOINT="http://localhost:3000/api/health"
HEALTH_GREP_STRING=""                    # string yang dicari di health response
SUPPORTED_STACKS=""                      # kosongkan = auto-detect
```

### File `templates/<stack>/stack.env` (Manifest per Stack)

Ingin ubah command test untuk stack tertentu? Edit manifest:

```bash
# Contoh: ganti pytest ke unittest untuk stack Python
nano templates/python/stack.env
```

Edit field yang relevan:

```bash
LINT_CMD="ruff check ."
TEST_CMD="python -m pytest"  # ganti ke: TEST_CMD="python -m unittest discover"
```

Wizard otomatis pakai command baru tanpa edit script pusat.

### Tambah Stack Baru (Mis. Rust)

```bash
# 1. Buat folder template
mkdir -p templates/rust

# 2. Buat AGENTS.md dengan dokumentasi stack
cat > templates/rust/AGENTS.md << 'EOF'
# Rust Template
Stack-specific notes untuk Rust + Cargo.
## Commands
- cargo build
- cargo test
- cargo clippy
EOF

# 3. Buat stack.env manifest
cat > templates/rust/stack.env << 'EOF'
DISPLAY_NAME="Rust + Cargo"
DESCRIPTION="System programming dengan Rust"
DETECT_FILES="Cargo.toml"
DETECT_EXCLUDE=""
DETECT_PRIORITY=25
LINT_CMD="cargo clippy --all-targets --all-features"
TYPECHECK_CMD="cargo check"
TEST_CMD="cargo test"
SECURITY_AUDIT_CMD="cargo audit"
VERSION_SOURCE="file"
VERSION_FILE="VERSION"
RUNTIME_DEPS="rust"
EOF

# 4. Verify
bash scripts/list-stacks.sh  # rust akan muncul otomatis
```

**Tidak perlu edit bash pusat sama sekali.** Wizard, init-project, dan setup_runner otomatis baca manifest baru.

---

## 🛠️ Setup VPS untuk CI/CD (Sekali per VPS)

### Step 1: Buat User Deploy di VPS

```bash
# SSH ke VPS sebagai root
adduser deploy
usermod -aG docker deploy     # HANYA docker, JANGAN sudo
su - deploy
```

### Step 2: Jalankan Setup Script

```bash
# Copy script setup_runner.sh ke VPS
scp scripts/setup_runner.sh deploy@vps-anda:~/

# SSH ke VPS dan jalankan
ssh deploy@vps-anda
bash setup_runner.sh
```

Script akan otomatis install:
- Docker (kalau belum ada)
- Node.js 20 LTS (kalau stack Anda butuh)
- Python 3 (kalau stack Anda butuh)
- GitHub Actions Runner (latest stable)

### Step 3: Daftarkan Runner ke GitHub

Ikuti instruksi yang muncul di akhir setup:

```
1. Buka repositori GitHub Anda di browser.
2. Settings → Actions → Runners → New self-hosted runner → Linux
3. Copy command configure (dimulai dengan ./config.sh ...)
4. Jalankan di VPS di folder ~/actions-runner
   Rekomendasi nama runner: myapp-vps
   Tambahkan label: self-hosted,linux,vps
5. Install & start sebagai daemon:
   sudo ./svc.sh install
   sudo ./svc.sh start
```

### Step 4: Setup Deploy Path di VPS

```bash
# Buat folder deploy sesuai DEPLOY_PATH di config.env
sudo mkdir -p /opt/myapp
sudo chown deploy:deploy /opt/myapp

# Clone project ke folder itu
cd /opt/myapp
git clone <repo-anda> .
```

---

## 🚨 Troubleshooting

### Masalah: "Tidak ada stack yang terdeteksi"

**Penyebab:** File deteksi stack tidak ada di root project.

**Solusi:**
```bash
# Cek apa yang dideteksi
bash scripts/detect-stack.sh

# Verifikasi file ada
ls package.json next.config.js  # untuk nextjs
ls pubspec.yaml                 # untuk flutter
ls requirements.txt             # untuk python
```

### Masalah: "Hook tidak jalan saat commit"

**Penyebab:** `core.hooksPath` belum di-set.

**Solusi:**
```bash
git config core.hooksPath .githooks
chmod +x .githooks/*
```

### Masalah: "Pre-flight check gagal: node tidak terinstal"

**Solusi:**
```bash
# Cek versi
node --version

# Install (Linux)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Masalah: "Push DITOLAK oleh pre-push hook"

**Penyebab:** Anda push ke branch terlindungi tanpa konfirmasi.

**Solusi:**
```bash
# Opsi 1: Set env var manual
ALLOW_PROTECTED_PUSH=1 git push origin main

# Opsi 2: Lewat wizard (otomatis set env var saat Anda confirm)
./workflow-vibe-code.sh

# Opsi 3: Bypass total (HANYA darurat)
git push --no-verify origin main
```

### Masalah: "CI Gagal di GitHub Actions"

Cek log:
```bash
gh run list                          # lihat run terbaru
gh run view <run-id> --log-failed    # lihat log yang gagal
```

Common causes:
- `DEPLOY_PATH` di config.env tidak match dengan folder VPS
- `.env.production` tidak ada di VPS
- `docker-compose.prod.yml` tidak ada di repo
- Health endpoint salah (cek `HEALTH_ENDPOINT` di config.env)

### Masalah: "Test Report HTML kosong"

**Penyebab:** Test runner Anda belum output ke format yang parser kenali.

**Solusi untuk Next.js/Jest** — tambah ke `jest.config.js`:
```js
module.exports = {
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports/test', outputName: 'junit.xml' }]
  ]
};
```

Install: `npm install --save-dev jest-junit`

**Solusi untuk Python/pytest** — jalankan dengan log:
```bash
pytest --junitxml=reports/test/junit.xml 2>&1 | tee reports/test/pytest.log
```

---

## 📁 Struktur File Framework

```
workflow-vibe-code/
├── config.env                    # konfigurasi utama
├── workflow-vibe-code.sh         # wizard utama (5 tahap)
├── scripts/
│   ├── init-project.sh           # scaffold project baru
│   ├── setup_runner.sh           # setup VPS self-hosted runner
│   ├── detect-stack.sh           # auto-detect stack dari file
│   ├── read-stack.sh             # baca field manifest
│   ├── read-config.sh            # baca field config.env
│   ├── list-stacks.sh            # daftar stack tersedia
│   ├── preflight-check.sh        # cek disk/network/tools
│   ├── collect-test-result.sh    # adapter test report per stack
│   ├── generate_test_report.py   # HTML report dari result.json
│   ├── generate_deploy_report.py # HTML report dari deploy
│   ├── pull-deploy-report.sh     # download artifact dari GitHub
│   └── backup.sh                 # backup config sebelum deploy
├── templates/
│   ├── _common/                  # boilerplate shared (TODO.md, pre-push)
│   ├── nextjs/                   # template + stack.env manifest
│   ├── vue-nuxt/
│   ├── node-api/
│   ├── python/
│   ├── mobile-expo/
│   └── flutter/
└── .github/workflows/ci.yml      # CI/CD pipeline template
```

---

## ❓ FAQ

**Q: Bisakah saya pakai editor apapun?**
A: Ya. VSCode, Vim, JetBrains, bahkan `nano`. Framework tidak peduli editor.

**Q: Apakah framework ini bekerja di Windows?**
A: Native Windows tidak support. Pakai WSL2 (Windows Subsystem for Linux) — sudah didukung.

**Q: Bisakah skip wizard dan commit manual?**
A: Bisa, tapi tidak direkomendasikan:
```bash
git add .
git commit -m "feat(auth): login Google"
# TAPI: tidak ada SemVer bump, tidak ada changelog, tidak ada test run
```

**Q: Bagaimana kalau saya mau pakai pnpm/bukan npm?**
A: Otomatis dideteksi dari lockfile:
- `pnpm-lock.yaml` → `pnpm install --frozen-lockfile`
- `yarn.lock` → `yarn install --frozen-lockfile`
- `bun.lock` → `bun install --frozen-lockfile`
- `package-lock.json` → `npm ci`

**Q: Bisakah saya deploy tanpa GitHub Actions?**
A: Bisa. Setelah tes lokal lolos, copy manual ke VPS:
```bash
# Di VPS
cd /opt/myapp
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

**Q: Bagaimana kalau saya butuh custom command yang tidak ada di manifest?**
A: Edit `templates/<stack>/stack.env`, tambah field, lalu panggil via `read-stack.sh`:
```bash
CUSTOM_CMD=$(bash scripts/read-stack.sh nextjs CUSTOM_CMD)
eval "$CUSTOM_CMD"
```

**Q: Berapa lama setup pertama?**
A: 5-10 menit untuk scaffold + config. 30-60 menit untuk setup VPS pertama kali.

---

## 📚 Dokumentasi Tambahan

- [AGENTS.md](AGENTS.md) — Aturan main kolaborasi AI
- [WORKFLOW.md](WORKFLOW.md) — Filosofi Commit-First + alur lengkap
- [ROADMAP.md](ROADMAP.md) — 6 langkah operasional harian
- [STYLE_GUIDE.md](STYLE_GUIDE.md) — Standar kode per stack (6 stack)

---

## 🆘 Butuh Bantuan?

1. Cek **Troubleshooting** di atas
2. Buka issue di repo GitHub dengan:
   - Pesan error lengkap
   - Output `bash scripts/preflight-check.sh`
   - Output `bash scripts/detect-stack.sh`
   - Versi framework (`cat VERSION`)

---

**Selamat koding! 🎉**

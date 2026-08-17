# Deploy & CI/CD Lokal (Tanpa GitHub Actions)

Setiap `git push origin main` otomatis menjalankan pipeline: **CI di laptop → deploy ke server cokoding**.

## Alur

```
git push origin main
  │
  ▼ .githooks/pre-push (lokal)
  ├── 1. Proteksi branch (ALLOW_PROTECTED_PUSH=1 utk main)
  ├── 2. [CI] typecheck frontend-public (nuxi typecheck)
  ├── 3. [CI] build backend (nest build)  ← gagal = push dibatalkan
  ├── 4. push ke GitHub
  └── 5. [CD] background: tunggu SHA terverifikasi di origin
         → ssh ubuntu@129.226.203.7
         → scripts/deploy.sh di server
              ├── git pull --ff-only origin main (deploy key read-only)
              ├── docker compose --profile omnisync build
              ├── docker compose up -d
              └── health check https://suwardi.web.id/api/portfolio/suwardi87
                    → PASS = DEPLOY_SUCCESS / GAGAL = exit 1
```

## Komponen

| File | Lokasi | Fungsi |
|------|--------|--------|
| `scripts/pre-push.sh` | lokal | CI (typecheck + build) + trigger CD background |
| `scripts/deploy.sh` | server | CD: pull → build → up → health check |
| `scripts/install-hooks.sh` | lokal | Pasang ulang hook ke `.githooks/pre-push` |
| `.githooks/pre-push` | lokal | Gabungan proteksi branch + pipeline (dibuat install-hooks) |

## Setup (sekali saja, sudah dilakukan)

1. Deploy key GitHub di server: `~/.ssh/deploy_key` + `~/.ssh/config` → repo `Suwardi87/automated-cv-engine` (read-only)
2. Server: `~/apps/automated-cv-engine` = git repo branch main
3. `.env` + `backend/.env` di server (untracked, tidak ter-timpa pull)
4. `core.hooksPath = .githooks` (di-set wizard workflow)

## Cara Pakai

- **Push biasa:** `./workflow-vibe-code.sh` (wizard) → push → pipeline jalan otomatis
- **Push langsung:** `git push origin main` → pipeline tetap jalan (perlu `ALLOW_PROTECTED_PUSH=1` hanya jika lewat hook; wizard set otomatis)
- **Deploy manual:** `ssh ubuntu@129.226.203.7 '~/apps/automated-cv-engine/scripts/deploy.sh'`
- **Cek hasil pipeline:** `tail -20 /tmp/omnisync-hook.log` (lokal) dan `/tmp/omnisync-deploy.log` (server)

## Catatan

- Build di server 2GB RAM ±3-5 menit (npm ci + Nuxt). Deploy otomatis berjalan di background, tidak memblokir terminal.
- Kalau `git pull` bentrok file untracked (mis. scp manual), deploy.sh auto-clean + retry.
- Rollback: `git revert <sha>` → push → pipeline deploy otomatis kembali.
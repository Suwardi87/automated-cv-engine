# 🚀 Vibe Coding Workflow & Safe Pipeline Guide

Panduan ini mendefinisikan aturan kerja, alur integrasi lokal, serta kebijakan otomatisasi (CI/CD) untuk seluruh proyek yang dikembangkan menggunakan ekosistem **Workflow Vibe Code**.

---

## 📌 Filosofi Utama
1. **Lokal Dulu, VPS Terakhir:** Semua pengetesan berat (DB, test suite, security scan, build compile) dilakukan di komputer lokal dev. VPS hanya menerima hasil yang sudah 100% stabil.
2. **Commit-First:** Perubahan wajib di-commit terlebih dahulu sebelum dites. Jika tes gagal, commit dapat di-revert secara otomatis tanpa merusak kode di editor.
3. **AI sebagai Asisten, Manusia sebagai Reviewer:** AI menulis kode, memverifikasi jalannya tes, dan melaporkan hasilnya. Manusia meninjau laporan, melakukan tes manual ringan, dan menyetujui perilisan.

---

## 🔄 Alur Kerja Siklus Pengembangan (The Loop)

```
[ Tulis Kode ] ──► [ Jalankan ./workflow-vibe-code.sh ]
                          │
                          ▼
                  [ 1. Commit-First ] ──► Masukkan Pesan Commit
                          │
                          ▼
                  [ 2. Auto-Detect Stack ] ──► Go, Node, Python, React
                          │
                          ▼
                  [ 3. Jalankan Test & Build Lokal ]
                          │
        ┌─────────────────┴─────────────────┐
        ▼ (Gagal)                           ▼ (Sukses)
 [ Auto-Revert Commit ]            [ 4. Security Scan & Compile ]
 (Perubahan file tetap aman)                │
        │                                   ▼
        ▼                           [ 5. Konfirmasi Push ]
 Perbaiki Bug & Ulangi                      │
                                            ▼
                                   [ 6. Deploy VPS Instan ]
                                   (Git pull + docker restart)
```

---

## 🔴 Aturan Kerja Wajib untuk AI (AI Session Rules)

AI yang berpasangan dengan Anda dalam coding sesi wajib mematuhi aturan berikut:

1. **Jalankan Verifikasi Sebelum Selesai:**
   Setiap kali AI selesai mengubah atau menambahkan fitur baru, AI **tidak boleh** menyatakan pekerjaan selesai sebelum menjalankan tes terkait dan membuat laporan.

2. **Gunakan Script Workflow:**
   AI WAJIB menjalankan sendiri `./workflow-vibe-code.sh` di terminal setelah selesai implementasi. Jangan hanya menyuruh user — AI yang eksekusi.

3. **Format Pelaporan Verifikasi:**
   AI harus menyajikan laporan hasil tes dalam bentuk tabel markdown seperti berikut:

   | Komponen Pengujian | Status | Catatan / Error |
   | :--- | :---: | :--- |
   | **Lint & Typecheck** | ✅ PASS | Bebas dari error syntax |
   | **Unit / Integration Tests** | ✅ PASS | 43/43 skenario lolos |
   | **Security Check** | ⚠️ WARN | Ditemukan 1 dependency rentan (sudah di-update) |
   | **Build Check** | ✅ PASS | Sukses kompilasi biner |

4. **Penanganan Error:**
   Jika ada tes yang gagal, AI harus menginvestigasi error dari file log hasil tes (`reports/test/result.json` atau output konsol) dan memperbaikinya secara tuntas.

5. **🔒 STRICT SECURITY GUARDRAILS (ATURAN MUTLAK KEAMANAN KODE):**
   - **Jangan Ubah File Inti Tanpa Izin:** AI dilarang keras mengubah file konfigurasi deployment (`.env*`, `docker-compose*.yml`, `nginx/*.conf`), file dependensi/package library (`package.json`, `requirements.txt`), serta berkas pipeline (`ci.yml`, `workflow-vibe-code.sh`) kecuali jika diinstruksikan secara eksplisit.
   - **Jangan Mengurangi Proteksi Keamanan:** Dilarang menghapus/menyederhanakan middleware keamanan (Rate Limiting, JWT Auth, CORS origin whitelist, guard), filter sanitasi input, serta error handling yang sudah ada.
   - **Pertahankan Komentar & Dokumentasi:** Jangan pernah menghapus komentar penjelas, docstring, atau dokumentasi fungsi bawaan yang tidak berhubungan langsung dengan perbaikan bug Anda.

*Aturan di atas bersifat mengikat bagi AI agar tidak perlu diketik ulang oleh Human.*

---

## 🛠️ Cara Menggunakan Script `workflow-vibe-code.sh`

Di folder proyek Anda, cukup jalankan perintah berikut di terminal:

```bash
./workflow-vibe-code.sh
```

### Penjelasan Opsi Pemulihan Jika Pengujian Gagal:
Jika script mendeteksi adanya kegagalan pada unit test setelah commit dibuat, Anda akan diberikan dua pilihan:
* **Pilihan 1 (Revert):** Melakukan `git reset HEAD~1`. Commit lokal terakhir dibatalkan, status file kembali menjadi *unstaged changes* (modifikasi Anda tidak hilang). Ini adalah opsi paling bersih sebelum Anda memperbaiki bug.
* **Pilihan 2 (Keep):** Membiarkan commit tetap tersimpan di lokal agar Anda bisa memperbaiki bug di commit berikutnya secara bertahap.

---

## 📁 Struktur Laporan yang Dihasilkan secara Lokal

Setelah script selesai berjalan, laporan pengujian disimpan secara lokal (diabaikan oleh `.gitignore` agar tidak mengotori repositori):

* **`reports/test/index.html`:** Laporan visual hasil uji coba test suite (dilengkapi grafik kelulusan dan durasi). Di-generate oleh `scripts/generate_test_report.py` dari data `reports/test/result.json` yang ditulis oleh `scripts/collect-test-result.sh`.
* **`reports/security/backend-security.html`:** Hasil pemindaian kode menggunakan `gosec` (Go) atau `bandit` (Python).
* **`reports/security/frontend-security.html`:** Hasil audit kerentanan pustaka pihak ketiga menggunakan `npm-audit-html` (Node.js/Next.js/Vue/Expo).

> **Catatan P0 (v2.0.0):** Untuk stack yang belum punya adapter per-stack (jest-junit, pytest-json, dll), `result.json` berisi placeholder counts. Real adapter per stack akan ditambahkan di Phase B3.

---

## ⚙️ Konfigurasi via `config.env`

Sejak v2.0.0, branding & deployment path dibaca dari `config.env` di root project. Anda bisa override tanpa edit file ter-track:

```bash
cp config.env config.local.env
# Edit config.local.env sesuai project Anda
```

Field yang tersedia:

| Field | Default | Fungsi |
|---|---|---|
| `PROJECT_NAME` | `Vibe Code Workflow` | Nama project (untuk dokumentasi) |
| `BANNER_NAME` | sama dengan PROJECT_NAME | Banner wizard `workflow-vibe-code.sh` |
| `DEPLOY_PATH` | `/opt/frozen-pos` | Path deploy di VPS (diakses CI deploy job) |
| `DEPLOY_SUBREPOS` | (kosong) | Daftar sub-repo yang di-pull saat deploy |
| `PROTECTED_BRANCHES` | `main master production` | Branch yang butuh `ALLOW_PROTECTED_PUSH=1` |
| `CI_TRIGGER_BRANCHES` | `staging main` | Branch yang memicu GitHub Actions |
| `HEALTH_ENDPOINT` | `http://localhost:8080/api/v1/health` | URL health check post-deploy (kosongkan untuk skip) |
| `HEALTH_GREP_STRING` | (kosong) | String yang dicari di response health |
| `SUPPORTED_STACKS` | (auto-detect) | Stack yang didukung framework |

`config.local.env` di-ignore git, sehingga aman untuk override lokal tanpa mengubah default yang ter-track.

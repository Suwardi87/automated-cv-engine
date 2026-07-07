# 🗺️ Developer Roadmap: Langkah Operasional Pengembangan

Dokumen ini mendefinisikan langkah-langkah kerja operasional harian yang **wajib dijalankan seterusnya** oleh setiap pengembang dan AI dalam menulis, menguji, dan merilis fitur ke lingkungan produksi.

---

## 📋 6 Langkah Alur Kerja Berurutan (Step-by-Step Flow)

```
[ START ] ──► [ 1. Baca Style ] ──► [ 2. Rencana Tugas ] ──► [ 3. Tulis Kode ]
                                                                     │
                                                                     ▼
[ END ] ◄── [ 6. Monitor Rilis ] ◄── [ 5. Auto-Deploy ] ◄── [ 4. Wizard Uji ]
```

### 1️⃣ Langkah 1: Membaca Panduan Gaya Kode (`STYLE_GUIDE.md`)
Sebelum menulis satu baris kode pun, AI dan pengembang wajib memahami batasan dan standardisasi kode:
* **Go Backend:** Pola Clean Architecture, error handling eksplisit, wajib mencatat log stok ke `pergerakan_stok`, transaksi `READ COMMITTED`.
* **Vue Frontend:** Komposisi API (`<script setup>`), Tailwind CSS v4 (tanpa config tailwind.config.js), error handling Axios otomatis.

### 2️⃣ Langkah 2: Perencanaan Fitur Spesifik (Fokus Tunggal)
Jelaskan ke AI apa yang ingin dicapai secara spesifik.
* **Aturan:** Batasi hanya **satu tugas kecil per sesi** (misal: menambahkan form supplier baru, memperbaiki bug filter pencarian). Jangan mencampuradukkan beberapa fitur dalam satu sesi koding.

### 3️⃣ Langkah 3: Menulis Kode (Development)
Menulis kode dengan patuh pada standar gaya penulisan kode di `STYLE_GUIDE.md`. Pertahankan komentar penjelas bawaan dan jangan kurangi proteksi keamanan yang sudah ada.

### 4️⃣ Langkah 4: Jalankan Wizard Verifikasi Lokal (`./workflow-vibe-code.sh`)
Setelah kode selesai ditulis, AI WAJIB menjalankan perintah ini (bukan menyuruh user):
```bash
./workflow-vibe-code.sh
```
Ikuti petunjuk interaktif di layar:
1. **Commit-First:** Masukkan tipe commit (feat, fix, docs, refactor, test, chore) dan deskripsinya. Skrip otomatis menaikkan versi (SemVer) dan memperbarui `CHANGELOG.md`.
2. **Pengujian Otomatis:** Skrip menjalankan DB lokal, test suite, security scan, dan build compile.
3. **Penanganan jika Gagal (Revert):** Jika terdeteksi error, AI WAJIB pilih **`1`** (Revert). Commit lokal dan kenaikan versi akan dibatalkan, status repositori kembali bersih tanpa menghapus perubahan kode di editor. AI WAJIB perbaiki bug lalu jalankan ulang Langkah 4.

### 5️⃣ Langkah 5: Kirim dan Deploy Otomatis (Push & Auto-Deploy)
Jika pengujian sukses, AI WAJIB konfirmasi push dengan mengetik **`y`** di wizard.
* Skrip otomatis melakukan push ke branch aktif.
* GitHub Actions melakukan validasi instan (~15 detik).
* Runner VPS melakukan *auto-pull* dan me-restart container produksi secara aman tanpa downtime (~20 detik).

### 6️⃣ Langkah 6: Verifikasi Hasil Rilis & Laporan (Monitor)
Periksa laporan pengujian yang dihasilkan secara lokal:
* Dasbor Pengujian: `reports/test/index.html` (di-generate otomatis dari `result.json`)
* Laporan Audit Keamanan: `reports/security/`
Buka dasbor aplikasi di browser produksi untuk memastikan fitur baru berjalan dengan sempurna.

> **Catatan sejak v2.0.0:** Laporan deployment (`reports/deploy/`) di-generate di GitHub Actions runner VPS, **bukan** otomatis ter-pull ke lokal. Untuk mengunduh artifact deployment:
>
> ```bash
> gh run download <run-id> -n deploy-report-<commit-sha> -D reports/deploy/
> ```
>
> Lihat daftar run dengan `gh run list --workflow=CI/CD\ Pipeline`.

---

## 🔒 Kebijakan Keamanan Mutlak (Strict Rules)
* **Dilarang keras melakukan push secara manual** (`git push` mentah) tanpa melewati verifikasi Langkah 4.
* **Dilarang keras mengubah konfigurasi inti** (`.env`, `docker-compose.yml`, `backend/package.json`, `frontend/package.json`, `workflow-vibe-code.sh`) tanpa instruksi eksplisit dari pemilik proyek.
* **Pertahankan Proteksi:** Filter keamanan, validasi input, middleware JWT auth, rate limiter, sanitasi input XSS/SQL Injection wajib dipertahankan keselarasannya.

# 🎨 Coding Style Guide & Development Standard

Panduan ini mendefinisikan aturan penulisan kode, arsitektur, dan standardisasi gaya pengkodean (*coding style*) untuk seluruh proyek di bawah ekosistem **Workflow Vibe Code**. Semua pengembang dan AI wajib mematuhi panduan ini demi konsistensi basis kode.

---

## 🏛️ 1. Standar Arsitektur Backend (Go)

Proyek Go menggunakan pola **Clean Architecture** dengan arah ketergantungan:  
`delivery (HTTP/Handler) ──► usecase (Business Logic) ──► repository (Data Access) ──► platform (DB/Redis)`

### Aturan Kode Backend:
* **Penanganan Error:** Wajib ditangani secara eksplisit pada setiap tingkatan. Jangan pernah mengabaikan error (`_`).
  ```go
  res, err := repository.FindByID(id)
  if err != nil {
      return nil, fmt.Errorf("gagal mengambil data: %w", err)
  }
  ```
* **Pencatatan Stok (Mandatory Stock Movement):** Setiap perubahan jumlah stok barang wajib mencatat riwayat pergerakannya ke dalam modul/tabel `pergerakan_stok` untuk kebutuhan audit log.
* **Transaksi Database:** Gunakan tingkat isolasi transaksi `READ COMMITTED`. Hindari tingkat `SERIALIZABLE` karena potensi kegagalan transaksi yang tinggi pada driver PostgreSQL Go (`pq`).
* **Pemisahan File Besar:** Modul repository yang memiliki query kompleks harus dipecah menjadi 3 file:
  1. `*_repository.go` (Definisi struct dan fungsi utama)
  2. `*_query.go` (Konstanta SQL Query)
  3. `*_helper.go` (Fungsi pemetaan struct database ke domain)
* **Test Coverage:** Pakai `go test -cover ./...` SEKALI saja — dapat status + coverage dari output yang sama. Jangan double-run untuk coverage.

---

## 🎨 2. Standar Frontend (Vue 3 + Vite + TypeScript)

### Aturan Kode Frontend:
* **Tailwind CSS v4:** Proyek ini menggunakan **Tailwind CSS v4** yang berbasis variabel CSS langsung di berkas CSS utama. **Dilarang keras membuat atau memodifikasi file `tailwind.config.js`**.
* **Gaya Penulisan Komponen:** Gunakan `<script setup lang="ts">` (Composition API) untuk semua komponen Vue baru.
* **Penanganan Error API:** Jangan melakukan penanganan error toast manual berulang-ulang pada setiap komponen. Interseptor Axios global di `src/shared/utils/api-client.ts` secara otomatis menampilkan notifikasi toast (`vue-sonner`) untuk setiap HTTP error dari backend.
* **Struktur File:**
  * `src/layouts/` : Kerangka tampilan halaman (misal: Sidebar Layout, Auth Layout).
  * `src/pages/` : Komponen halaman yang terikat ke router.
  * `src/features/` : Komponen spesifik fitur, store Pinia, dan logika bisnis terkait fitur tersebut.

---

## 🔒 3. Keamanan & Sanitasi Kode (Security First)

* **Validasi Input:** Gunakan validasi input yang ketat baik di frontend maupun backend sebelum memproses data.
* **CORS & Rate Limiting:** Jangan pernah menonaktifkan atau melonggarkan konfigurasi CORS origin whitelist dan rate limiting global di lingkungan produksi.
* **Sanitasi SQL & XSS:** Gunakan parameter binding (prepared statements) untuk query SQL untuk menghindari SQL Injection, dan sanitasi input string untuk mencegah serangan Cross-Site Scripting (XSS).

---

## 📝 4. Standardisasi Pesan Commit & Rilis

Semua commit wajib mengikuti format **Conventional Commits** secara konsisten melalui interaksi `./workflow-vibe-code.sh`:

| Tipe Commit | Tujuan Penggunaan | Contoh Format | Kenaikan Versi |
| :--- | :--- | :--- | :--- |
| `feat` | Penambahan fitur baru | `feat(auth): tambah login MFA` | Minor (`1.0.0` -> `1.1.0`) |
| `fix` | Perbaikan bug/error | `fix(pos): atasi struk terpotong` | Patch (`1.1.0` -> `1.1.1`) |
| `perf` | Optimasi performa tanpa ubah fungsi | `perf(db): index query user` | Patch |
| `refactor` | Restrukturisasi kode tanpa merubah fungsi | `refactor(db): optimasi query index` | Tidak ada |
| `revert` | Membatalkan commit sebelumnya | `revert: hapus fitur X` | Tidak ada |
| `docs` | Perubahan dokumentasi | `docs: perbarui panduan setup` | Tidak ada |
| `test` | Menambah/memperbaiki unit test | `test(api): tambah uji login` | Tidak ada |
| `style` | Formatting, whitespace, semicolon | `style: format dengan prettier` | Tidak ada |
| `build` | Sistem build / dependency eksternal | `build: upgrade webpack ke v5` | Tidak ada |
| `ci` | Konfigurasi CI/CD pipeline | `ci: tambah job lint` | Tidak ada |
| `chore` | Update build, package dependency, dll | `chore: update lodash version` | Tidak ada |

> **Catatan v2.1.0:** Semua 11 tipe sudah didukung di menu wizard (lihat B9). Catatan lama di atas obsolete.

---

## 📱 6. Standar Mobile (Flutter + Dart)

### Aturan Kode Flutter:
* **Pola Arsitektur:** Feature-First. Setiap fitur di-isolasi di `lib/features/<name>/` dengan subdirektori `pages/`, `models/`, `services/`, `widgets/` (opsional sesuai kebutuhan).
* **Entry Chain:** `lib/main.dart` → `lib/app.dart` (`MyApp`) → `lib/routes/app_router.dart` → feature pages.
* **Shared Code:** Taruh di `lib/core/` (`constants/`, `theme/`, `widgets/`). Jangan duplikasi di dalam feature.
* **Routing:** Setiap screen wajib didaftarkan di `app_router.dart` (`onGenerateRoute` + named string constant). Screen constructor tidak menerima positional args.
* **State Management:** Default pakai `StatelessWidget`/`StatefulWidget`. Kalau butuh yang lebih advanced, pilih SATU (Provider/Riverpod/Bloc) dan apply konsisten — jangan campur.
* **Networking:** Taruh di balik service class di `lib/features/<name>/services/`. Jangan panggil HTTP langsung dari widget.
* **Analysis:** `flutter analyze` wajib bersih sebelum commit (sudah di-hook pre-commit).
* **Lints:** Pakai `flutter_lints` via `analysis_options.yaml`.

---

## 🚀 7. Standar Next.js (App Router)

### Aturan Kode Next.js:
* **App Router** (`app/` directory) — bukan Pages Router lama.
* **Server Components** by default. Tambah `"use client"` hanya kalau butuh hooks/browser APIs.
* **Tailwind CSS** untuk styling. Hindari CSS modules kecuali ada alasan spesifik.
* **API routes** di `app/api/` — pakai Route Handlers (`export async function GET/POST`).
* **Shared types** di `types/` atau `lib/types.ts`.
* **Utilities** di `lib/`. **Components** di `components/` (group by feature).
* **Gotcha:** `next build` sudah include typecheck. Fix type error dulu sebelum build. Server Components tidak bisa pakai hooks atau browser APIs.

---

## ⚡ 8. Standar Node.js API (Express/Fastify)

### Aturan Kode Backend Node:
* **Routes** di `src/routes/`, **controllers** di `src/controllers/`.
* **Middleware** di `src/middleware/` (auth, error handling, rate limiting).
* **Services** (business logic) di `src/services/`.
* **Models/repositories** di `src/models/` atau `src/repositories/`.
* **Shared types** di `src/types/`.
* **Config:** selalu lewat env var yang divalidasi dengan `zod` atau `envalid`. Jangan akses `process.env` langsung di luar config module.
* **Error handling:** middleware di akhir chain. Semua async route wajib `try/catch` atau pakai wrapper `asyncHandler`.
* **Input validation:** wajib `zod`/`joi` di route — JANGAN pernah percaya `req.body`.

---

## 🐍 9. Standar Python (FastAPI/Django)

### Aturan Kode Python:
* **FastAPI:** routes di `app/routers/`, schemas di `app/schemas/`, models di `app/models/`, services di `app/services/`.
* **Django:** apps di project, views di `views.py`, models di `models.py`.
* **Pydantic** wajib untuk validasi input/output API.
* **Dependencies:** `requirements.txt` ATAU `pyproject.toml` — pilih satu per project.
* **Tests:** direktori `tests/` mirror struktur `app/`.
* **Linting:** `ruff check .` + `ruff format .`. Ruff menggantikan flake8 + isort + black.
* **Type checking:** `mypy .` opsional tapi direkomendasikan untuk kode critical.
* **Gotcha:** selalu `source venv/bin/activate` sebelum run command. FastAPI auto-docs — jaga deskripsi route jelas.

---

## 📲 10. Standar React Native + Expo

### Aturan Kode Expo:
* **Routing:** tergantung template — `blank-typescript` pakai AppRegistry + React Navigation; `tabs`/expo-router pakai file-based routing di `app/`.
* **Components** di `components/`, group by feature. **Hooks** di `hooks/`.
* **Local storage:** `AsyncStorage` (non-sensitive) atau `expo-secure-store` (secrets/tokens).
* **API calls** di `services/` atau `api/`. Jangan fetch langsung dari component.
* **Shared types** di `types/`.
* **Platform-specific code:** pakai `Platform.OS` atau extension `.ios.tsx` / `.android.tsx`.
* **Gotcha:** Expo Go untuk quick test, development builds untuk native modules. Jangan pakai library web-only (DOM, localStorage).

---

## 🚨 11. Kebijakan Integritas Kode & Dokumentasi

1. **Integritas Komentar:** Saat mengubah kode, dilarang menghapus komentar, catatan arsitektur, dan docstring yang sudah ada di file tersebut demi kemudahan pembacaan developer lain.
2. **Kepatuhan Pipeline:** Seluruh kode yang didorong ke repositori utama **wajib** lulus pengetesan lokal melalui skrip `./workflow-vibe-code.sh`. Dilarang keras melakukan `git push` manual secara mentah.
3. **Manifest Compliance:** Setiap stack wajib punya `templates/<stack>/stack.env` yang menyatakan `LINT_CMD`, `TEST_CMD`, dan `VERSION_SOURCE`. Wizard membaca manifest ini — jangan hardcode command di script pusat.

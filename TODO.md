# TODO — Automated CV Engine by OmniSync

> **File ini selalu diupdate** tiap selesai pengerjaan.
> Lihat `WORKFLOW.md` untuk alur eksekusi.

---

## ✅ Selesai

### Backend
- Auth module: OAuth GitHub/GitLab redirect + callback + JWT (`auth.controller.ts`, `auth.service.ts`, `jwt.strategy.ts`)
- User module: entity + endpoint `GET /user` (`user.controller.ts`, `user.entity.ts`)
- GitHub module: entity + 3 endpoints (list, sync, toggle-feature) + real API call (`github.service.ts`)
- GitLab module: entity + 3 endpoints (list, sync, toggle-feature) + real API call (`gitlab.service.ts`)
- Portfolio module: `GET /portfolio/:username` — public endpoint, data real dari DB (`portfolio.service.ts`)
- App module: TypeORM (Postgres), Bull (Redis), ConfigModule, global prefix `/api`, CORS
- DB schema: 5 tabel (users, social_accounts, github_projects, gitlab_projects, media_portfolios) via TypeORM `synchronize: true`
- JWT auth guard + @CurrentUser decorator

### Frontend
- Landing page: HeroSection, FeaturesSection, HowItWorksSection, CtaSection + SharedNavbar + SharedFooter
- Layouts: `default.vue` (navbar + footer), `dashboard.vue` (sidebar + topbar)
- Pages: index, login, dashboard/index, dashboard/portfolio, dashboard/cv, dashboard/settings — semua UI selesai
- Mock data layer: `utils/mock-data.ts` dengan interfaces + 8 mock repos + user + media

### Infra
- Docker Compose: 5 services (postgres, redis, nestjs-api, nginx, nuxt-frontend)
- Git hooks: pre-commit (typecheck + build), pre-push (branch protection)
- Workflow: `workflow-vibe-code.sh` (491-line interactive commit wizard)
- GitHub remote: `github.com/Suwardi87/automated-cv-engine` (3 commits)

---

## 🔜 Sprint 1 — MVP End-to-End (Frontend ⇄ Backend)

**Goal:** Frontend terhubung ke backend real. User bisa login OAuth → lihat dashboard data real → sync repositori.

### Step 1: Setup API Client
- [ ] Buat `frontend/app/utils/api.ts` — wrapper `$fetch` dengan:
  - Base URL dari `runtimeConfig.public.apiBase`
  - Auto-attach JWT dari cookie
  - Error handling (401 → redirect login)

### Step 2: Setup Auth Store (Pinia)
- [ ] Install Pinia: `npm install @pinia/nuxt`
- [ ] Buat `frontend/app/stores/auth.ts`:
  - State: user, token, isAuthenticated, loading
  - Actions: login (redirect OAuth), handleCallback (code → JWT), logout, fetchUser
  - Persist token ke cookie

### Step 3: Koneksikan Login Page ke OAuth Real
- [ ] `login.vue`: tombol "Login with GitHub" redirect ke `/api/auth/github/redirect`
- [ ] `login.vue`: tombol "Login with GitLab" redirect ke `/api/auth/gitlab/redirect`
- [ ] **Fix `auth.controller.ts`**: callback endpoint harus redirect ke frontend URL (`/auth/callback?token=xxx`), bukan return JSON. Saat ini return `{ success, data: { user, token } }` — JSON ini muncul di browser setelah OAuth, gak bisa dibaca frontend.
- [ ] Buat halaman `frontend/app/pages/auth/callback.vue` — baca token dari URL, simpan ke cookie/Pinia, redirect ke `/dashboard`
- [ ] Hapus mock login form (email/password — disable/hidden)

### Step 4: Auth Middleware
- [ ] Buat `frontend/app/middleware/auth.ts` — proteksi rute `/dashboard/**`
- [ ] Auto-redirect ke `/login` jika tidak ada token valid
- [ ] Auto-redirect ke `/dashboard` jika sudah login (di `/login`)

### Step 5: Dashboard — Data Real
- [ ] `dashboard/index.vue`: statistik dari `GET /api/user` + `GET /api/github/repos`
- [ ] Daftar repositori dari API (bukan mock)
- [ ] Tombol "Sync" panggil `POST /api/github/sync` + loading state
- [ ] Activity log dari data real

### Step 6: Portfolio Page — Data Real
- [ ] `dashboard/portfolio.vue`: featured projects dari `GET /api/github/repos`
- [ ] Tech stack dari data real (parsed dari JSON field)
- [ ] Toggle featured via `POST /api/github/:id/toggle-feature`

### Step 7: Settings Page — Data Real
- [ ] `dashboard/settings.vue`: profile info dari `GET /api/user`
- [ ] GitLab connect card — OAuth flow sama seperti login
- [ ] Tampilkan connected accounts dari DB

### Step 8: CV Page — Sementara dari Data Real
- [ ] `dashboard/cv.vue`: data user + repos dari API (mock download button tetap)

### Step 9: Docker & Build Fixes
- [ ] Fix `Dockerfile.nuxt`: ganti `npx nuxi dev` → `npm run build` + `node .output/server/index.mjs`
- [ ] Fix `nginx/default.conf`: serve frontend static files + proxy API (saat ini hanya proxy ke API)
- [ ] Isi `GITHUB_CLIENT_ID` dan `GITHUB_CLIENT_SECRET` di `.env`
- [ ] Tambah `GITLAB_CLIENT_ID` dan `GITLAB_CLIENT_SECRET` di `.env` (ada di `.env.example` tapi tidak tercopy)

### Step 10: Integration Tests
- [ ] Setup Jest/Vitest di backend (atau gunakan NestJS testing)
- [ ] Test OAuth callback flow
- [ ] Test GitHub sync endpoint
- [ ] Test portfolio public endpoint
- [ ] Target: 80%+ coverage pada module auth, github, portfolio

---

## Sprint 2 — AI + Portfolio Publik

- [ ] Integrasi Gemini API (`ai.service.ts` — summarizie README)
- [ ] Pipeline: setelah sync repositori → panggil Gemini → simpan `ai_summary`
- [ ] Tampilkan AI summary di dashboard portfolio page
- [ ] Portfolio publik: halaman `/portfolio/:username` (Nuxt page, panggil API)
- [ ] Social media sync: implementasi Bull job queue

---

## Sprint 3 — CV + Polish

- [ ] CV PDF generation via Puppeteer
- [ ] Download CV button real (bukan stub)
- [ ] Analytics dashboard (repo views, profile visits)
- [ ] Clean up unused deps: `bcryptjs`, `bull`, `class-validator`, `class-transformer`

---

## 🐛 Ditemukan Saat Audit

- `SocialService.sync()`: stub — return "Sync started", tidak ngapa-ngapain
- `CvService.download()`: stub — return "Not implemented"
- `AiService.summarizeReadme()`: stub — return data kosong
- **OAuth callback returns JSON, not redirect** — `auth.controller.ts:106` return `{ success, data: { user, token } }`. Browser OAuth flow butuh redirect ke frontend URL dengan token di query string, bukan JSON.
- Frontend: `runtimeConfig.public.apiBase` tidak pernah dipakai di komponen manapun
- Frontend: tidak ada `$fetch`/axios call ke backend sama sekali
- Backend `package.json`: tidak ada script `test`, `lint`, `typecheck`
- Nginx: hanya proxy API, tidak serve Nuxt frontend
- `.env` tidak punya `GITLAB_CLIENT_ID` / `GITLAB_CLIENT_SECRET` (ada di `.env.example` tapi tidak di-copy)
- `PortfolioService.findByUsername()` lookup by `user.name` (display name), bukan unique slug — bisa broken kalau 2 user punya nama sama

---

## 📝 Catatan

- `GITHUB_CLIENT_ID` dan `GITHUB_CLIENT_SECRET` kosong — wajib diisi sebelum testing OAuth
- `GITLAB_CLIENT_ID` dan `GITLAB_CLIENT_SECRET` juga kosong
- `GEMINI_API_KEY` belum ada — butuh untuk Sprint 2
- Test coverage 0% — target 80%+ setelah Sprint 1 Step 10
- Email/password login di `login.vue` disabled — tidak akan diimplementasi (hanya OAuth)

# Blueprint: Sprint 1 — MVP Auth + Dashboard + GitHub Sync

> Tujuan: User bisa login via GitHub → lihat dashboard → sync repos → data mengalir end-to-end.

## Dependency Graph

```
Step 1: Fix OAuth (backend) ──────────────┐
         │                                 │
         ├── parallel ──┐                  │
         │              │                  │
Step 2: Frontend     Step 5: Backend     │
       Auth Infra      Sync (real)         │
         │                                 │
Step 3: Login Page ───┤                   │
         │            │                   │
Step 4: Dashboard ────┘                   │
         │                                 │
Step 6: Tests ────────────────────────────┘
         │
Step 7: Workflow commit + push
```

## Parallel Opportunities
- **Step 1 + Step 2** beda file (backend vs frontend), bisa paralel
- **Step 4 + Step 5** beda file (frontend UI vs backend logic), bisa paralel

---

## Step 1: Fix GitHub OAuth Backend

**Context Brief:**
OAuth callback saat ini tidak persist `access_token` ke `social_accounts` tabel. Padahal token ini dibutuhkan untuk sync repos nanti. Juga `GITHUB_CLIENT_ID`/`SECRET` kosong di `.env`.

**Tasks:**
1. Setup GitHub OAuth App di https://github.com/settings/developers
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:8082/api/auth/github/callback`
   - Dapat Client ID + Client Secret
2. Isi `backend/.env`: `GITHUB_CLIENT_ID` dan `GITHUB_CLIENT_SECRET`
3. Edit `backend/src/modules/auth/auth.service.ts`:
   - Setelah `findOrCreateUser()`, simpan `access_token` ke tabel `social_accounts`
   - Cek kalau record sudah ada (same platform + provider_id) → update token
   - Kalau belum ada → insert baru
4. Inject `SocialAccount` entity ke `AuthModule` imports

**Files touched:** `backend/.env`, `backend/src/modules/auth/auth.service.ts`, `backend/src/modules/auth/auth.module.ts`

**Verify:**
```bash
# Setelah Docker restart, test OAuth redirect
curl -s -o /dev/null -w "%{http_code}\n%{redirect_url}" http://localhost:8082/api/auth/github/redirect
# Expect: 302 + redirect ke github.com/login/oauth/authorize?client_id=...
```

**Exit criteria:**
- `curl /api/auth/github/redirect` mengarah ke GitHub (302)
- Setelah authorize, `social_accounts` tabel berisi `access_token`

**Workflow:**
```bash
./workflow-vibe-code.sh
# Pilih: feat(auth), deskripsi: "persist GitHub OAuth token to social_accounts"
```

---

## Step 2: Frontend Auth Infrastructure

**Context Brief:**
Frontend sama sekali belum terhubung ke backend. `runtimeConfig.public.apiBase` sudah defined tapi tidak dibaca siapa-siapa. Tidak ada auth store, tidak ada API client, tidak ada middleware.

**Tasks:**
1. Install dependencies:
   ```bash
   cd frontend && npm install @pinia/nuxt @pinia/plugin-persistedstate
   ```
2. Update `nuxt.config.ts` — tambah `@pinia/nuxt` ke modules
3. Buat `frontend/app/plugins/api.ts`:
   ```typescript
   export default defineNuxtPlugin(() => {
     const config = useRuntimeConfig()
     const api = $fetch.create({
       baseURL: config.public.apiBase,
       onRequest({ options }) {
         const auth = useAuthStore()
         if (auth.token) {
           options.headers = { ...options.headers, Authorization: `Bearer ${auth.token}` }
         }
       },
       onResponseError({ response }) {
         if (response.status === 401) {
           const auth = useAuthStore()
           auth.logout()
           navigateTo('/login')
         }
       }
     })
     return { provide: { api } }
   })
   ```
4. Buat `frontend/app/stores/auth.ts` (Pinia store):
   - State: `token`, `user`
   - Actions: `login(token, user)`, `logout()`, `fetchUser()`
   - Persist token ke cookie (useCookie)
5. Buat `frontend/app/middleware/auth.ts` (route guard):
   ```typescript
   export default defineNuxtRouteMiddleware((to) => {
     const auth = useAuthStore()
     if (!auth.token && to.path.startsWith('/dashboard')) {
       return navigateTo('/login')
     }
   })
   ```

**Files touched:** `frontend/package.json`, `frontend/nuxt.config.ts`, `frontend/app/plugins/api.ts`, `frontend/app/stores/auth.ts`, `frontend/app/middleware/auth.ts`

**Verify:**
```bash
# Typecheck
cd frontend && npx nuxi typecheck
# Frontend container restart
docker compose up -d --force-recreate nuxt-frontend
# Check page loads
curl -s http://localhost:3000 | head -5
```

**Exit criteria:**
- `nuxi typecheck` pass
- `$api` available di semua component via `useNuxtApp()`
- Auth store accessible via `useAuthStore()`
- Middleware redirect `/dashboard` → `/login` kalau tidak ada token

**Workflow:**
```bash
./workflow-vibe-code.sh
# Pilih: feat(frontend), deskripsi: "add Pinia auth store, API client plugin, route middleware"
```

---

## Step 3: Login Page + OAuth Flow

**Context Brief:**
Tidak ada halaman login. User perlu klik "Sign in with GitHub" → redirect ke backend OAuth → balik dengan JWT → simpan token → redirect ke dashboard.

**Tasks:**
1. Buat `frontend/app/pages/login.vue`:
   - Tombol besar "Masuk dengan GitHub"
   - On click → `window.location.href = '${apiBase}/auth/github/redirect'`
2. Buat `frontend/app/pages/auth/callback.vue`:
   - Parse JWT dari URL query param (atau cookie yang di-set backend)
   - Simpan ke auth store
   - Redirect ke `/dashboard`
   - **Catatan:** Backend callback saat ini return JSON `{ user, token }`. Frontend perlu handle ini — backend redirect ke frontend dengan token, atau frontend fetch.
   - **Approach:** Ubah backend callback untuk redirect ke `http://localhost:3000/auth/callback?token=xxx` alih-alih return JSON
3. Update `frontend/app/components/shared/Navbar.vue`:
   - Tambah tombol "Masuk" / "Dashboard" berdasarkan auth state
   - Kalau login: tampilkan nama user + dropdown logout

**Files touched:** `frontend/app/pages/login.vue`, `frontend/app/pages/auth/callback.vue`, `frontend/app/components/shared/Navbar.vue`, `backend/src/modules/auth/auth.controller.ts`

**Verify:**
```bash
# Full OAuth flow
# 1. Buka browser → http://localhost:3000/login
# 2. Klik "Masuk dengan GitHub"
# 3. Authorize di GitHub
# 4. Redirect balik ke /auth/callback → /dashboard
# 5. Navbar tampilkan nama user
```

**Exit criteria:**
- User bisa klik login → GitHub authorize → balik ke dashboard
- JWT tersimpan di cookie
- Navbar menampilkan status login

**Workflow:**
```bash
./workflow-vibe-code.sh
# Pilih: feat(auth), deskripsi: "add login page, OAuth callback handler, navbar auth state"
```

---

## Step 4: Dashboard Page + Repos Display

**Context Brief:**
Dashboard belum ada. User perlu lihat repos yang sudah di-sync + tombol sync. Pakai data dari `/api/github/repos`.

**Tasks:**
1. Buat `frontend/app/pages/dashboard/index.vue`:
   - Tambah `definePageMeta({ middleware: 'auth' })`
   - Layout: sidebar/profile + main content area
   - Stats cards: total repos, featured count, tech stack
   - Grid repo cards
2. Buat `frontend/app/components/dashboard/RepoCard.vue`:
   - Props: repo data (title, description, tech_stack, is_featured)
   - Star toggle button → `POST /api/github/:id/toggle-feature`
3. Buat `frontend/app/components/dashboard/SyncButton.vue`:
   - On click → `$api('/github/sync', { method: 'POST' })`
   - Loading state → refresh repo list
4. Buat `frontend/app/components/dashboard/StatsCard.vue`:
   - Reusable stat card component

**Files touched:** `frontend/app/pages/dashboard/index.vue`, `frontend/app/components/dashboard/RepoCard.vue`, `frontend/app/components/dashboard/SyncButton.vue`, `frontend/app/components/dashboard/StatsCard.vue`

**Verify:**
```bash
# Typecheck
cd frontend && npx nuxi typecheck
# Restart frontend
docker compose up -d --force-recreate nuxt-frontend
# Cek dashboard (butuh auth token — manual test di browser)
```

**Exit criteria:**
- `/dashboard` redirect ke `/login` kalau belum auth
- Repo cards render (kosong dulu, data belum ada sampai Step 5)
- Sync button clickable

**Workflow:**
```bash
./workflow-vibe-code.sh
# Pilih: feat(dashboard), deskripsi: "add dashboard page with repo cards, sync button, stats"
```

---

## Step 5: Backend GitHub Sync (Real Implementation)

**Context Brief:**
`github.service.sync()` saat ini cuma `return { message: 'Sync started' }` — no-op. Harus fetch repos dari GitHub API pakai `access_token` yang tersimpan di `social_accounts`.

**Tasks:**
1. Edit `backend/src/modules/github/github.service.ts`:
   - Inject `SocialAccount` repository
   - `sync()` method:
     - Ambil `access_token` dari `social_accounts` (platform: 'github')
     - Fetch `GET https://api.github.com/user/repos?sort=pushed&per_page=100`
     - Header: `Authorization: token ${access_token}`
     - Map response → `github_projects` entity
     - Upsert: cek `repo_id`, kalau ada → update, kalau belum → insert
     - Return `{ synced: count, projects: [...] }`
2. Tambah error handling:
   - Token expired (401 dari GitHub) → return error message
   - Rate limit (403) → return retry info

**Files touched:** `backend/src/modules/github/github.service.ts`, `backend/src/modules/github/github.module.ts`

**Verify:**
```bash
# Setelah login (punya JWT), test sync
curl -X POST http://localhost:8082/api/github/sync \
  -H "Authorization: Bearer <jwt-token>"
# Expect: { success: true, data: { synced: N, projects: [...] } }

# Cek data di DB
docker compose exec -T postgres psql -U omnisync -d omnisync \
  -c "SELECT id, title, is_featured FROM github_projects LIMIT 5;"
```

**Exit criteria:**
- `POST /api/github/sync` mengembalikan jumlah repos yang di-import
- `github_projects` tabel berisi data real
- `GET /api/github/repos` mengembalikan repos yang sudah di-sync

**Workflow:**
```bash
./workflow-vibe-code.sh
# Pilih: feat(github), deskripsi: "implement real GitHub sync from API"
```

---

## Step 6: Integration Tests

**Context Brief:**
0% test coverage. Tambah test dasar untuk critical path: OAuth, sync, portfolio.

**Tasks:**
1. Backend tests:
   - Install: `cd backend && npm install -D @nestjs/testing jest ts-jest supertest @types/supertest`
   - Buat `backend/test/auth.e2e-spec.ts` — test OAuth redirect
   - Buat `backend/test/github.e2e-spec.ts` — test sync dengan mock GitHub API
   - Buat `backend/test/portfolio.e2e-spec.ts` — test public portfolio
2. Frontend tests:
   - Install: `cd frontend && npm install -D @nuxt/test-utils vitest @vue/test-utils happy-dom`
   - Buat `frontend/test/auth.spec.ts` — test auth store
   - Buat `frontend/test/dashboard.spec.ts` — test dashboard render
3. Update `templates/vue-nuxt/stack.env` dan `templates/node-api/stack.env` TEST_CMD

**Files touched:** `backend/test/*.e2e-spec.ts`, `backend/package.json`, `frontend/test/*.spec.ts`, `frontend/package.json`

**Verify:**
```bash
cd backend && npm test
cd frontend && npm test
```

**Exit criteria:**
- Backend: minimal 3 e2e test pass
- Frontend: minimal 2 component test pass
- Coverage report generated

**Workflow:**
```bash
./workflow-vibe-code.sh
# Pilih: test, deskripsi: "add integration tests for auth, github sync, dashboard"
```

---

## Step 7: Final Commit + Push

**Context Brief:**
Semua Step 1-6 selesai. Jalankan workflow wizard untuk final commit + push ke GitHub.

**Tasks:**
1. Update `TODO.md` — pindahkan Sprint 1 ke "Selesai"
2. Update `CHANGELOG.md` — tambah entry untuk Sprint 1
3. Jalankan:
   ```bash
   ./workflow-vibe-code.sh
   # Pilih: feat, deskripsi: "Sprint 1 complete: auth, dashboard, github sync"
   # Verify all tests pass
   # Push to origin main
   ```

**Exit criteria:**
- All tests green
- Docker containers healthy
- Push sukses ke GitHub

---

## Estimasi Waktu

| Step | Estimasi | Bisa Paralel? |
|------|----------|---------------|
| 1 — OAuth fix | 30 menit | ✅ dengan Step 2 |
| 2 — Frontend auth infra | 45 menit | ✅ dengan Step 1 |
| 3 — Login page | 45 menit | ❌ (butuh Step 1+2) |
| 4 — Dashboard | 60 menit | ✅ dengan Step 5 |
| 5 — Backend sync | 45 menit | ✅ dengan Step 4 |
| 6 — Tests | 60 menit | ❌ (butuh semua) |
| 7 — Final | 15 menit | ❌ |
| **Total** | **~5 jam** | |

## Pre-requisites (User Action)

- [ ] Buat GitHub OAuth App di https://github.com/settings/developers
- [ ] Dapat Client ID + Secret
- [ ] (Opsional) Gemini API Key untuk Sprint 2

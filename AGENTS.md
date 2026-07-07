# Automated CV Engine — Nuxt 4 + NestJS Monorepo

Stack-specific notes untuk Nuxt 4 / Vue 3 frontend + NestJS 11 backend.

## Dev Commands

### Frontend (Nuxt 4)
```bash
cd frontend && npm run dev          # dev server di :3000
cd frontend && npx nuxi typecheck   # VERIFY — typecheck
cd frontend && npm run test         # VERIFY — test suite
```

### Backend (NestJS 11)
```bash
cd backend && npm run start:dev     # dev server di :9000
cd backend && npm run build         # VERIFY — compile check
cd backend && npm run test          # VERIFY — test suite
cd backend && npm run lint          # lint check
```

### Docker
```bash
docker compose up -d                # start all services
docker compose up -d --build nestjs-api   # rebuild backend
docker compose up -d --force-recreate nuxt-frontend  # restart frontend
docker compose logs -f nestjs-api   # follow backend logs
```

### Workflow (WAJIB dijalankan AI, bukan disuruh ke user)
```bash
./workflow-vibe-code.sh             # wizard commit + test + push
```

## Verification Order (AI WAJIB jalankan sendiri)
1. `cd frontend && npx nuxi typecheck`
2. `cd backend && npm run build`
3. `curl -s http://localhost:3000 | head -5`
4. `curl -s http://localhost:8082/api/`

## Output Wajib: Verification Table
Setiap selesai implementasi, AI WAJIB output tabel:
| Komponen | Status | Catatan |
|----------|--------|---------|
| **Lint & Typecheck** | ✅/❌ | ... |
| **Test** | ✅/❌ | ... |
| **Build** | ✅/❌ | ... |
| **Security** | ✅/❌ | ... |

## Architecture (Feature-First)

### Frontend
```
frontend/app/
├── components/
│   ├── shared/         # Navbar, Footer — cross-app
│   ├── landing/        # HeroSection, FeaturesSection, HowItWorksSection, CtaSection
│   ├── dashboard/      # (future)
│   └── auth/           # (future)
├── layouts/default.vue # <SharedNavbar /> + <main>slot</main> + <SharedFooter />
├── pages/index.vue     # Landing* sections
└── modules/            # per-feature types/composables (future)
```
- Components auto-import via Nuxt folder-as-prefix: `landing/HeroSection.vue` → `<LandingHeroSection />`
- All UI text in Bahasa Indonesia

### Backend
```
backend/src/
├── modules/
│   ├── auth/           # JWT (passport-jwt) + OAuth GitHub
│   ├── user/           # User CRUD (JWT-guarded)
│   ├── github/         # GitHub repos + sync
│   ├── gitlab/         # GitLab projects + sync
│   ├── social/         # Social accounts sync
│   ├── portfolio/      # Public portfolio (no auth)
│   └── cv/             # CV download placeholder
├── services/
│   └── ai.service.ts   # Gemini placeholder
└── app.module.ts       # Root module
```

## Conventions
- Frontend: `<script setup lang="ts">`, Composition API, TailwindCSS
- Backend: Controller → Service pattern, JWT guards, TypeORM entities
- No inline comments in code
- Bahasa Indonesia for all UI text
- Conventional commits via `./workflow-vibe-code.sh`
- **Commit-First:** Commit dulu via wizard, baru test. Bukan sebaliknya.

## Route Table
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | API info (global prefix excluded) |
| GET | `/api/portfolio/:username` | No | Public portfolio |
| GET | `/api/download-cv` | No | Download CV placeholder |
| GET | `/api/auth/:provider/redirect` | No | OAuth redirect (github \| gitlab) |
| GET | `/api/auth/:provider/callback` | No | OAuth callback (github \| gitlab) |
| GET | `/api/user` | JWT | Current user |
| GET | `/api/github/repos` | JWT | List repos |
| POST | `/api/github/sync` | JWT | Sync repos |
| POST | `/api/github/:project/toggle-feature` | JWT | Toggle featured |
| GET | `/api/gitlab/repos` | JWT | List GitLab projects |
| POST | `/api/gitlab/sync` | JWT | Sync GitLab projects |
| POST | `/api/gitlab/:project/toggle-feature` | JWT | Toggle GitLab featured |
| POST | `/api/social/sync` | JWT | Sync social media |

## Gotchas
- `backend/.env` loaded via docker-compose `env_file:` — needs container recreate, not restart
- `synchronize: true` for TypeORM in dev — tables auto-create
- Root `GET /` excluded from `/api` global prefix
- Nuxt 4 folder-as-prefix: `app/components/landing/HeroSection.vue` → `<LandingHeroSection />`
- `Dockerfile.nestjs` needs `package-lock.json` for `npm ci`
- `docker compose build nuxt-frontend` is cached — source changes picked up via bind mount in dev

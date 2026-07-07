# PRODUCT.md — Automated CV Engine Capability Contract

## Capability Summary

Platform portofolio developer terpadu: user login via GitHub OAuth → sinkronisasi repositori otomatis → AI meringkas proyek → generate CV profesional. Semua data tampil di dashboard dan portfolio publik.

## Actors

| Actor | Deskripsi | Auth |
|-------|-----------|------|
| **Guest** | Pengunjung landing page / portfolio publik | Tidak ada |
| **User** | Developer yang login via GitHub | JWT (7 hari) |
| **Public Viewer** | Recruiter/company yang lihat portfolio publik | Tidak ada |

## States & Transitions

```
Guest ──(click "Login with GitHub")──► GitHub OAuth Page
GitHub OAuth ──(authorize)──► Callback (/api/auth/github/callback?code=xxx)
Callback ──(JWT issued)──► Dashboard (authenticated)
Dashboard ──(click "Sync")──► GitHub repos imported → DB
Dashboard ──(click "Generate CV")──► CV PDF download
```

## Interfaces

### Auth
- `GET /api/auth/github/redirect` → 302 ke GitHub
- `GET /api/auth/github/callback?code=xxx` → `{ user, token }`
- Frontend: store JWT di cookie, redirect ke `/dashboard`

### Dashboard (JWT required)
- `GET /api/user` → profile
- `GET /api/github/repos` → list synced repos
- `POST /api/github/sync` → import repos dari GitHub API
- `POST /api/github/:id/toggle-feature` → toggle starred project

### Public
- `GET /api/portfolio/:username` → portfolio data
- `GET /api/download-cv` → PDF (future)

## Data Model (sudah ada di DB)

```
users (1) ──┬── (N) social_accounts     [platform, access_token]
            ├── (N) github_projects      [repo data + ai_summary + tech_stack]
            └── (N) media_portfolios     [media links]
```

## Sprint Plan

### Sprint 1 (MVP — Auth + Dashboard + Sync)
- GitHub OAuth end-to-end works
- Frontend login → dashboard
- Backend sync imports real repos
- Data flows: GitHub → DB → Dashboard

### Sprint 2 (AI + Portfolio)
- Gemini integration (summarize readme)
- AI summary di github_projects
- Portfolio publik menampilkan data

### Sprint 3 (CV + Polish)
- PDF generation (Puppeteer)
- Social media sync
- Analytics dashboard

## Non-Goals (Sprint 1)
- AI/Gemini integration
- CV PDF generation
- Social media sync (Instagram/TikTok)
- Analytics
- Production deployment

## Open Questions
1. GitHub OAuth App sudah dibuat di GitHub Developer Settings? (butuh Client ID + Secret)
2. Domain untuk OAuth callback URL? (localhost:8082 untuk dev)
3. Gemini API Key sudah punya?

## Constraints
- Bahasa Indonesia untuk semua UI text
- `<script setup lang="ts">` untuk semua Vue components
- Feature-based folder structure
- Commit-first via `./workflow-vibe-code.sh`

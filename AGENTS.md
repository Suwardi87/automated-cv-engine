# OmniSync Portfolio

Backend (Laravel API) + Frontend (Nuxt 4) + Postgres + Redis.

## Stack
- **Backend**: Laravel 13 (REST API), PostgreSQL, Redis queue
- **Frontend**: Nuxt 4 (SSR), Vue 3, TailwindCSS
- **Infra**: Docker Compose (PHP-FPM, Nginx, Postgres 16, Redis 7, Node 20)

## Dev commands
```bash
docker compose up -d                        # Start all services
docker compose logs -f laravel-api          # Follow backend logs
docker compose exec laravel-api php artisan migrate  # Run migrations
docker compose exec laravel-api php artisan queue:work  # Process queue
docker compose exec nuxt-frontend npm run dev           # Nuxt dev server
```

## Generated code (gitignored)
- `backend/vendor/`, `backend/.env`, `backend/storage/`
- `frontend/.nuxt/`, `frontend/node_modules/`
- `storage-laravel/` (Docker volume)

## Verification order
1. `docker compose build --no-cache`
2. `docker compose up -d`
3. `docker compose exec laravel-api php artisan migrate`
4. `docker compose exec laravel-api php artisan test`

## Workflow (Describe → Implement → Verify → Refine)
1. **Describe** — one feature per prompt, specific behavior & constraints
2. **Implement** — write code following conventions below
3. **Verify** — agent runs verify steps, reports as markdown table
4. **Refine** — human reviews, describes fixes, agent repeats

## Conventions
- Laravel: controllers in `app/Http/Controllers/Api/`, services in `app/Services/`, jobs in `app/Jobs/`
- Nuxt: Composition API with `<script setup lang="ts">`, pages in `pages/`, components in `components/`
- Auto-imports enabled on both frameworks
- OAuth tokens stored encrypted via `Crypt::encryptString()`
- Async processing via Laravel Queue (Redis) for social sync & AI jobs
- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`

## Commands
| Command | Use |
|---------|-----|
| `/scaffold <stack>` | Start a new project from template |
| `/review` | Review recent changes |
| `/fix <issue>` | Investigate and fix a bug |
| `/refactor <target>` | Refactor specific file/module |
| `/test <target>` | Generate or improve tests |

## Safe pipeline
Run `./workflow-vibe-code.sh` before pushing for commit-first → test → security scan flow.

## Database
Migrations: `backend/database/migrations/`. Schema defined in master plan:
- `users` (bio, avatar_url added via migration)
- `social_accounts` (OAuth tokens per platform)
- `github_projects` (repo data + AI summary)
- `media_portfolios` (Instagram/TikTok media)

## API routes
All under `/api/` prefix with Sanctum auth. See `backend/routes/api.php`.

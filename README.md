# OmniSync Portfolio

Portfolio website with automatic GitHub, LinkedIn, Instagram, and TikTok sync, AI-powered summarization, and CV PDF generation.

## Stack
- **Backend**: Laravel 13 REST API
- **Frontend**: Nuxt 4 SSR + TailwindCSS
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7
- **Infra**: Docker Compose

## Quick start
```bash
docker compose up -d
docker compose exec laravel-api php artisan migrate
docker compose exec nuxt-frontend npm run dev
```

## Architecture
Services: `docker-compose.yml` defines 6 containers (postgres, redis, laravel-api, laravel-queue, nginx, nuxt-frontend).

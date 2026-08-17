# Changelog Proyek

Semua perubahan penting akan dicatat di sini.

## [0.6.3] - 2026-08-17
- fix(build): feat(deploy): tambah docker-compose.prod.yml + env.prod.example untuk deployment produksi VPS

## [0.6.2] - 2026-08-17
- fix(build): feat(deploy): tambah docker-compose.prod.yml + .env.prod.example untuk deployment produksi VPS

## [0.6.1] - 2026-08-17
- fix(cv): skills CV dari evidence nyata (Laravel/MySQL/Tailwind/Docker dll) + filter artifact language saat sync + bersihkan primary_language misleading

## [0.6.0] - 2026-08-17
- feat(cv): generate CV PDF server-side ATS-friendly via Puppeteer + AI summary manual endpoint + highlights jsonb + hero portfolio (headline, kontak, tombol Unduh CV)

## [0.5.7] - 2026-08-16
- fix(github): fix race condition: screenshot service update kolom saja (repo.update) agar tidak menimpa is_featured/is_hidden

## [0.5.6] - 2026-08-16
- fix(github): live_url pariwisata hanya untuk web-pariwisata, hapus mapping wisataXkoto

## [0.5.5] - 2026-08-15
- fix(github): project mobile app pakai custom card, bukan screenshot web (app tidak bisa di-capture via browser)

## [0.5.4] - 2026-08-15
- fix(github): screenshot project mobile (Dart/Flutter/mobile-) pakai viewport HP 390x844 + emulasi touch

## [0.5.3] - 2026-08-15
- fix(github): tambah flag is_hidden + endpoint toggle-visibility untuk sembunyikan project dari portfolio dan CV

## [0.5.2] - 2026-08-15
- fix(github): filter repo milik sendiri saja (affiliation=owner) saat sync + perbaiki label section jadi Repositori Lainnya

## [0.5.1] - 2026-08-15
- fix(security): upgrade nuxt 4.5.2 + fast-uri 3.1.5 untuk menutup vulnerability high (RCE server island, SSR data leak)

## [0.5.0] - 2026-08-15
- feat(portfolio): tambah animasi scroll-reveal + refresh UI landing dan halaman portfolio + urutkan project featured duluan

## [0.4.0] - 2026-07-21
- feat(github): tambah sistem screenshot otomatis dengan custom card generator, README URL extraction, dan auto-detect URL untuk e-gov projects

## [0.3.0] - 2026-07-17
- feat(github): tambah screenshot otomatis project via puppeteer + thumbnail preview di portfolio

## [0.2.0] - 2026-07-05
- feat: tambah modul CRUD Education

## [0.1.0] - 2026-06-22
- feat: initial scaffold monorepo NestJS + Nuxt 4
- feat: landing page components (Hero, Features, HowItWorks, CTA)
- feat: feature-based frontend structure (shared/, landing/, dashboard/, auth/)

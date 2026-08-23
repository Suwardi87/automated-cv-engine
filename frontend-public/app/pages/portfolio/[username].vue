<script setup lang="ts">
definePageMeta({ layout: 'portfolio' })

interface Project {
  id: number
  title: string
  slug: string
  repo_url: string
  live_url: string | null
  screenshot_url: string | null
  primary_language: string
  tech_stack: string[]
  ai_summary: string | null
  stars_count: number
  forks_count: number
  is_featured: boolean
  last_pushed_at: string
}

interface PortfolioData {
  user: {
    name: string
    bio: string | null
    avatar_url: string | null
    job_title: string | null
    location: string | null
    website: string | null
    linkedin: string | null
    username: string | null
  }
  github_projects: Project[]
  gitlab_projects: Project[]
  media_portfolios: any[]
  educations: {
    id: number
    institution: string
    degree: string
    field_of_study: string | null
    start_date: string | null
    end_date: string | null
    description: string | null
  }[]
  work_experiences: {
    id: number
    company: string
    position: string
    location: string | null
    start_date: string | null
    end_date: string | null
    is_current: boolean
    description: string | null
    highlights: string[]
  }[]
  certificates: {
    id: number
    name: string
    issuer: string
    description: string | null
    credential_url: string | null
    issue_date: string | null
  }[]
}

const route = useRoute()
const username = computed(() => route.params.username as string)
const api = useApi()
const heroRef = ref<HTMLElement | null>(null)
let heroCleanup: (() => void) | null = null

const { data: portfolio, pending, error } = await useAsyncData(`portfolio-${username.value}`, async () => {
  const res = await api.get<{ success: boolean; data: PortfolioData }>(`/portfolio/${username.value}`)
  return res.data
})

const displayName = computed(() => {
  const raw = portfolio.value?.user?.name ?? 'Suwardi'
  return String(raw).split(',')[0]!.trim()
})

const typedName = ref<string>(displayName.value)
let typeTimer: ReturnType<typeof setTimeout> | undefined

function startTyping() {
  const full = displayName.value
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedName.value = full
    return
  }
  let i = 0
  typedName.value = ''
  const step = () => {
    i++
    typedName.value = full.slice(0, i)
    if (i < full.length) typeTimer = setTimeout(step, 110)
  }
  typeTimer = setTimeout(step, 400)
}

function beginTypingAfterPreloader() {
  const pre = document.querySelector('.preloader')
  if (!pre) {
    startTyping()
    return
  }
  let started = false
  const go = () => {
    if (started) return
    started = true
    observer.disconnect()
    clearTimeout(fallback)
    startTyping()
  }
  const observer = new MutationObserver(() => {
    if (pre.classList.contains('is-done')) go()
  })
  observer.observe(pre, { attributes: true, attributeFilter: ['class'] })
  const fallback = setTimeout(go, 3500)
}

useSeoMeta({
  title: () => portfolio.value ? `${portfolio.value.user.name} - Portofolio Profesional` : 'Portofolio Developer',
  description: () => portfolio.value?.user.bio || 'Portofolio developer bertenaga AI dengan sinkronisasi repositori otomatis.',
  ogTitle: () => portfolio.value ? `${portfolio.value.user.name} - Portofolio Profesional` : 'Portofolio Developer',
  ogDescription: () => portfolio.value?.user.bio || 'Lihat portofolio dan proyek pilihan terbaik saya.',
  ogImage: () => portfolio.value?.user.avatar_url || '',
  twitterCard: 'summary_large_image'
})

function fmtDate(d: string | null): string {
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'hari ini'
  if (days === 1) return 'kemarin'
  if (days < 7) return `${days} hari lalu`
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
  return `${Math.floor(days / 30)} bulan lalu`
}

onBeforeUnmount(() => {
  heroCleanup?.()
  if (typeTimer) clearTimeout(typeTimer)
})

function bindHeroParallax() {
  const el = heroRef.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-depth]'))
  let raf = 0
  let mx = 0
  let my = 0

  const apply = () => {
    raf = 0
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const scrollable = Math.max(rect.height - vh * 0.55, 1)
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable))

    for (const layer of layers) {
      const depth = parseFloat(layer.dataset.depth || '0.2')
      const range = rect.height * 0.5
      const ty = -progress * range * depth + my * 16 * depth
      const tx = mx * 22 * depth
      const sc = 1 + progress * 0.05 * depth
      layer.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${sc.toFixed(3)})`
      if (layer.dataset.fade === 'true') {
        layer.style.opacity = String(Math.max(0, 1 - progress * 1.7).toFixed(2))
      }
    }
  }
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(apply)
  }
  const onScroll = () => schedule()
  const onMouse = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    my = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    schedule()
  }
  const onLeave = () => {
    mx = 0
    my = 0
    schedule()
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', schedule)
  el.addEventListener('mousemove', onMouse)
  el.addEventListener('mouseleave', onLeave)
  apply()

  heroCleanup = () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', schedule)
    el.removeEventListener('mousemove', onMouse)
    el.removeEventListener('mouseleave', onLeave)
    if (raf) cancelAnimationFrame(raf)
  }
}

onMounted(() => {
  bindHeroParallax()
  beginTypingAfterPreloader()
})

const featuredProjects = computed(() => portfolio.value?.github_projects.filter(p => p.is_featured) ?? [])

const stats = computed(() => {
  const projects = portfolio.value?.github_projects ?? []
  const allTech = new Set<string>()
  for (const p of projects) {
    for (const t of p.tech_stack ?? []) allTech.add(t)
  }
  const liveCount = projects.filter(p => p.live_url).length
  const totalStars = projects.reduce((sum, p) => sum + (p.stars_count ?? 0), 0)
  return {
    totalProjects: projects.length,
    featured: featuredProjects.value.length,
    liveDemos: liveCount,
    techCount: allTech.size,
    totalStars,
  }
})

const topSkills = computed(() => {
  const projects = portfolio.value?.github_projects ?? []
  const count = new Map<string, number>()
  for (const p of projects) {
    for (const t of p.tech_stack ?? []) {
      count.set(t, (count.get(t) ?? 0) + 1)
    }
  }
  return [...count.entries()]
    .map(([name, n]) => ({ name, count: n }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
})

const ALIAS: Record<string, string> = { vue: 'Vue.js', nuxt: 'Nuxt.js', dart: 'Flutter & Dart' }

const skillGroups = computed(() => {
  const expert = [
    { name: 'Laravel', hint: '5 sistem e-government live' },
    { name: 'Vue.js', hint: 'frontend semua sistem produksi' },
    { name: 'PHP', hint: '35 repositori' },
    { name: 'MySQL', hint: 'DB sistem pemerintah' },
  ]
  const advanced = [
    { name: 'TypeScript', hint: '19 repositori' },
    { name: 'Flutter & Dart', hint: 'mobile_damkar — GPS real-time' },
    { name: 'Nuxt.js', hint: 'portofolio ini (SSR)' },
    { name: 'Tailwind CSS', hint: 'UI modern semua proyek' },
    { name: 'PostgreSQL', hint: 'backend portofolio' },
    { name: 'Docker', hint: 'orkestrasi layanan' },
    { name: 'REST API', hint: 'mobile ↔ web integration' },
    { name: 'Inertia.js', hint: 'web-ldpi live' },
  ]
  const familiar = [
    { name: 'NestJS' }, { name: 'Python' }, { name: 'Go' }, { name: 'Postman' }, { name: 'Bootstrap' },
  ]
  return { expert, advanced, familiar }
})
</script>

<template>
  <div class="min-h-screen bg-[#040506] text-[#f4f4f6] selection:bg-[#55b3ff]/30 selection:text-white">
    <!-- Signature diagonal stripe pattern (Raycast-inspired) -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.06]" style="background-image: repeating-linear-gradient(-45deg, #55b3ff 0 2px, transparent 2px 16px);"></div>
    <!-- Subtle blue glow -->
    <div class="pointer-events-none absolute left-1/4 top-0 h-[420px] w-[520px] rounded-full bg-[#55b3ff]/[0.07] blur-[140px]"></div>

    <div class="relative px-0 py-0 sm:px-0">
      <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

      <!-- Loading State -->
      <div v-if="pending" class="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <svg class="h-8 w-8 animate-spin text-[#55b3ff]" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p class="text-sm font-medium text-[#8e8e90]">Memuat profil pengembang...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error || !portfolio" class="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#e04848]/10 text-[#e04848]">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white">Profil Tidak Ditemukan</h2>
        <p class="mt-2 max-w-md text-sm text-[#8e8e90]">Pengembang dengan nama "{{ username }}" belum terdaftar atau portofolionya belum disinkronkan.</p>
        <NuxtLink to="/" class="mt-6 rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#151617]">
          Kembali ke Beranda
        </NuxtLink>
      </div>

      <!-- Main Profile Content -->
      <div v-else>
        <!-- Parallax Hero: scene 100vh full-bleed ala Firewatch -->
        <header ref="heroRef" class="full-bleed relative mb-14 h-[calc(100vh-4rem)] min-h-[560px] overflow-hidden">
          <!-- Layer 0: video background (duotone cyan, serasi tema) -->
          <video data-depth="0.08" autoplay muted loop playsinline class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 will-change-transform [filter:grayscale(1)_brightness(0.62)_sepia(1)_hue-rotate(175deg)_saturate(2.4)]">
            <source src="/assets/hero.mp4" type="video/mp4" />
          </video>
          <!-- Layer 0b: vignette gelap kuat — konten selalu terbaca -->
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(4,5,6,0.72),#040506_100%)]"></div>
          <div class="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-[#040506]/60 to-[#040506]"></div>

          <!-- Layer 1: ambient glow -->
          <div data-depth="0.15" class="pointer-events-none absolute inset-0 will-change-transform">
            <div class="absolute left-1/2 top-[42%] h-[440px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#55b3ff]/[0.08] blur-[130px]"></div>
          </div>
          <!-- Layer 2: HUD ring sintetis (midground, subtle) -->
          <div data-depth="0.3" class="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform">
            <img src="/assets/hud-ring.png" alt="" class="h-[88%] w-auto max-w-none opacity-30" />
          </div>
          <!-- Layer 2b: lembutkan HUD agar tak memotong teks -->
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_40%_at_50%_50%,rgba(4,5,6,0.55),transparent_70%)]"></div>
          <!-- Layer 3: circuit skyline (PNG transparan, garis ice-blue) -->
          <div data-depth="0.55" class="pointer-events-none absolute inset-x-[-4%] bottom-0 will-change-transform">
            <img src="/assets/circuit-glow.png" alt="" class="w-full opacity-70" />
          </div>
          <!-- Layer 4: floating chips (off-screen rapi, hanya dekorasi tepi) -->
          <div data-depth="0.8" data-fade="true" class="pointer-events-none absolute inset-0 hidden opacity-60 will-change-transform lg:block">
            <span class="absolute left-[6%] top-[22%] rounded-full border border-[#1e1f21] bg-[#0c0d0e]/70 px-3 py-1 font-mono text-[11px] text-[#55b3ff]/80 backdrop-blur-sm">Laravel</span>
            <span class="absolute right-[7%] top-[30%] rounded-full border border-[#1e1f21] bg-[#0c0d0e]/70 px-3 py-1 font-mono text-[11px] text-[#5fc992]/80 backdrop-blur-sm">Flutter</span>
            <span class="absolute bottom-[22%] left-[10%] rounded-full border border-[#1e1f21] bg-[#0c0d0e]/70 px-3 py-1 font-mono text-[11px] text-[#c8c8ca]/80 backdrop-blur-sm">Vue / Nuxt</span>
            <span class="absolute bottom-[26%] right-[9%] rounded-full border border-[#1e1f21] bg-[#0c0d0e]/70 px-3 py-1 font-mono text-[11px] text-[#ffbc33]/80 backdrop-blur-sm">PostgreSQL</span>
          </div>

          <!-- Layer 5: konten profil (fade saat scroll) -->
          <div data-depth="0.1" data-fade="true" class="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform">
            <div class="relative mx-4 flex max-w-2xl flex-col items-center gap-7 text-center">
              <div class="pointer-events-none absolute inset-x-[-15%] inset-y-[-18%] -z-10 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(4,5,6,0.88),transparent_75%)]"></div>
              <div class="fade-in relative flex flex-col items-center gap-7">
              <div class="relative shrink-0">
                <img
                  v-if="portfolio.user.avatar_url"
                  :src="portfolio.user.avatar_url"
                  :alt="portfolio.user.name"
                  width="100"
                  height="100"
                  class="h-24 w-24 rounded-full object-cover shadow-[rgba(0,0,0,0.5)_0px_0px_0px_2px,rgba(255,255,255,0.14)_0px_0px_14px_0px]"
                />
                <div v-else class="flex h-24 w-24 items-center justify-center rounded-full bg-[#0c0d0e] text-3xl font-bold text-[#8e8e90] shadow-[rgba(0,0,0,0.5)_0px_0px_0px_2px]">
                  {{ portfolio.user.name.charAt(0).toUpperCase() }}
                </div>
                <span class="absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#040506] bg-[#0c0d0e]">
                  <span class="h-2.5 w-2.5 rounded-full bg-[#5fc992]"></span>
                </span>
              </div>

              <div class="space-y-4">
                <div class="space-y-3">
                  <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#55b3ff]">
                    // {{ portfolio.user.job_title || 'Software Developer' }}
                  </p>
                  <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    <span>{{ typedName }}</span><span class="type-cursor" aria-hidden="true"></span>
                  </h1>
                  <p class="mx-auto max-w-xl text-sm leading-7 text-[#c8c8ca]">
                    {{ portfolio.user.bio || 'Halo! Saya adalah pengembang perangkat lunak profesional dengan fokus pada pembuatan sistem berkualitas tinggi.' }}
                  </p>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <a
                v-if="portfolio.user.linkedin"
                :href="portfolio.user.linkedin"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 rounded-full bg-[#55b3ff] px-5 py-2.5 text-xs font-semibold text-[#07080a] transition-colors hover:bg-[#6cbfff]"
              >
                <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                Hubungi Saya
              </a>
              <a
                :href="`https://github.com/${portfolio.user.username}`"
                target="_blank"
                rel="noopener"
                v-if="portfolio.user.username"
                class="inline-flex items-center gap-2 rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-5 py-2 text-xs font-medium text-[#c8c8ca] transition-colors hover:border-[#262728] hover:bg-[#151617] hover:text-white"
              >
                <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
              <a
                v-if="portfolio.user.location"
                class="inline-flex items-center gap-2 rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-5 py-2 text-xs font-medium text-[#8e8e90]"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ portfolio.user.location }}
              </a>
                </div>
              </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Scroll hint -->
        <div class="relative -mt-24 mb-4 flex justify-center">
          <div class="flex flex-col items-center gap-2 text-[#5e5f61]">
            <span class="font-mono text-[10px] uppercase tracking-[0.3em]">Gulir</span>
            <span class="block h-8 w-px animate-pulse bg-gradient-to-b from-[#55b3ff] to-transparent"></span>
          </div>
        </div>

        <!-- Stats Bar: full-bleed band -->
        <section class="full-bleed mb-12 border-y border-[#1e1f21] bg-[#0a0b0c]">
          <div class="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          <div v-reveal="{ delay: 0 }" class="rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-5 text-center transition-colors hover:border-[#262728]">
            <p class="text-3xl font-bold tracking-tight text-[#55b3ff]">{{ stats.totalProjects }}</p>
            <p class="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8e8e90]">Total Proyek</p>
          </div>
          <div v-reveal="{ delay: 80 }" class="rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-5 text-center transition-colors hover:border-[#262728]">
            <p class="text-3xl font-bold tracking-tight text-[#55b3ff]">{{ stats.featured }}</p>
            <p class="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8e8e90]">Unggulan</p>
          </div>
          <div v-reveal="{ delay: 160 }" class="rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-5 text-center transition-colors hover:border-[#262728]">
            <p class="text-3xl font-bold tracking-tight text-[#5fc992]">{{ stats.liveDemos }}</p>
            <p class="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8e8e90]">Live Demo</p>
          </div>
          <div v-reveal="{ delay: 240 }" class="rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-5 text-center transition-colors hover:border-[#262728]">
            <p class="text-3xl font-bold tracking-tight text-[#55b3ff]">{{ stats.techCount }}</p>
            <p class="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8e8e90]">Teknologi</p>
          </div>
          </div>
        </section>

        <!-- Featured Projects Showcase -->
        <section v-if="featuredProjects.length" id="proyek" class="mb-12 scroll-mt-24">
          <div class="mb-8">
            <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#55b3ff]">01 / Karya Pilihan</p>
            <div class="mt-3 flex items-center justify-between gap-4 border-b border-[#1e1f21] pb-5">
              <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Proyek Unggulan</h2>
              <span class="rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-3 py-1 font-mono text-[10px] font-semibold text-[#55b3ff]">{{ featuredProjects.length }} proyek</span>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="(project, i) in featuredProjects"
              :key="project.id"
              v-reveal="{ delay: Math.min(i * 60, 600) }"
              class="card-lift group flex flex-col overflow-hidden rounded-xl border border-[#1e1f21] bg-[#0c0d0e] shadow-[rgb(22,23,25)_0px_0px_0px_1px,rgb(4,5,6)_0px_0px_0px_1px_inset] transition-colors hover:border-[#262728]"
            >
              <!-- Thumbnail -->
              <div class="zoom-on-hover relative aspect-video overflow-hidden border-b border-[#1e1f21] bg-[#040506]">
                <a
                  :href="project.live_url || project.repo_url"
                  target="_blank"
                  rel="noopener"
                  class="block h-full w-full"
                >
                  <img
                    v-if="project.screenshot_url"
                    :src="project.screenshot_url"
                    :alt="`Preview ${project.title}`"
                    class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center bg-[#0c0d0e]">
                    <svg class="h-10 w-10 text-[#5e5f61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                </a>
                <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#ffbc33]/90 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#07080a]">
                  <svg class="h-2 w-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.799-2.034a1 1 0 00-1.176 0l-2.799 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  Unggulan
                </span>
                <span
                  v-if="project.live_url"
                  class="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#5fc992]/90 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#07080a]"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-[#07080a]"></span>
                  Live
                </span>
              </div>

              <!-- Content -->
              <div class="flex flex-1 flex-col p-5">
                <a :href="project.repo_url" target="_blank" class="mb-2 flex items-center gap-2 text-base font-semibold text-white transition-colors hover:text-[#6cbfff]">
                  {{ project.title }}
                  <svg class="h-3 w-3 text-[#5e5f61] transition-colors group-hover:text-[#6cbfff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                <p v-if="project.ai_summary" class="mb-4 text-sm leading-relaxed text-[#9a9b9d] line-clamp-2">{{ project.ai_summary }}</p>
                <div class="mt-auto flex flex-wrap gap-1.5">
                  <span
                    v-for="tech in (project.tech_stack ?? []).slice(0, 5)"
                    :key="tech"
                    class="rounded-md border border-[#1e1f21] bg-[#040506] px-2 py-0.5 font-mono text-[10px] font-medium text-[#c8c8ca]"
                  >{{ tech }}</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- Skills Showcase: full-bleed band -->
        <section v-if="topSkills.length" class="full-bleed mb-12 border-y border-[#1e1f21] bg-[#0a0b0c]">
          <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div class="mb-8">
              <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#55b3ff]">02 / Perangkat</p>
              <div class="mt-3 flex items-center justify-between gap-4 border-b border-[#1e1f21] pb-5">
                <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Tech Stack</h2>
              </div>
            </div>
          <div class="grid gap-10 lg:grid-cols-3">
            <div v-reveal>
              <div class="mb-5 flex items-center gap-2.5">
                <span class="h-2 w-2 rounded-full bg-[#5fc992]"></span>
                <h3 class="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#5fc992]">Mahir</h3>
              </div>
              <ul class="space-y-3.5">
                <li v-for="s in skillGroups.expert" :key="s.name" class="group">
                  <div class="flex items-baseline justify-between gap-3">
                    <span class="text-sm font-semibold text-white">{{ s.name }}</span>
                  </div>
                  <p class="mt-0.5 text-xs text-[#8e8e90]">{{ s.hint }}</p>
                  <div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#151617]">
                    <div class="h-full w-full rounded-full bg-[#5fc992]/80"></div>
                  </div>
                </li>
              </ul>
            </div>

            <div v-reveal="{ delay: 120 }">
              <div class="mb-5 flex items-center gap-2.5">
                <span class="h-2 w-2 rounded-full bg-[#55b3ff]"></span>
                <h3 class="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#55b3ff]">Kuat</h3>
              </div>
              <ul class="space-y-3.5">
                <li v-for="s in skillGroups.advanced" :key="s.name" class="group">
                  <div class="flex items-baseline justify-between gap-3">
                    <span class="text-sm font-semibold text-white">{{ s.name }}</span>
                  </div>
                  <p class="mt-0.5 text-xs text-[#8e8e90]">{{ s.hint }}</p>
                  <div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#151617]">
                    <div class="h-full w-[72%] rounded-full bg-[#55b3ff]/80"></div>
                  </div>
                </li>
              </ul>
              <div class="mt-6 flex flex-wrap gap-2">
                <span v-for="s in skillGroups.familiar" :key="s.name" class="rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-3 py-1 font-mono text-[11px] text-[#8e8e90]">{{ s.name }}</span>
              </div>
              <p class="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5e5f61]">+ eksplorasi: NestJS · Python · Go · Postman · Bootstrap</p>
            </div>

            <div v-reveal="{ delay: 240 }" class="flex flex-col justify-between gap-6">
              <div>
                <div class="mb-5 flex items-center gap-2.5">
                  <span class="h-2 w-2 rounded-full bg-[#ffbc33]"></span>
                  <h3 class="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#ffbc33]">Fondasi</h3>
                </div>
                <ul class="space-y-2.5 text-sm text-[#c8c8ca]">
                  <li class="flex gap-2.5"><span class="text-[#55b3ff]">→</span> Arsitektur monorepo & full-stack delivery end-to-end</li>
                  <li class="flex gap-2.5"><span class="text-[#55b3ff]">→</span> Integrasi mobile ↔ web via REST API</li>
                  <li class="flex gap-2.5"><span class="text-[#55b3ff]">→</span> Deployment Docker & CI/CD git hooks</li>
                  <li class="flex gap-2.5"><span class="text-[#55b3ff]">→</span> Testing (PHPUnit, Jest, Postman)</li>
                </ul>
              </div>
              <div class="rounded-xl border border-[#1e1f21] bg-[#0c0d0e]/60 p-5">
                <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5e5f61]">Basis data</p>
                <p class="mt-2 text-sm font-semibold text-white">MySQL · PostgreSQL · Redis</p>
                <p class="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5e5f61]">DevOps</p>
                <p class="mt-2 text-sm font-semibold text-white">Docker · Nginx · Linux</p>
              </div>
            </div>
          </div>
          </div>
        </section>

        <!-- Work Experience Section -->
        <section v-if="portfolio.work_experiences?.length" id="pengalaman" class="mb-12 scroll-mt-24">
          <div class="mb-8">
            <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#55b3ff]">03 / Jejak Karier</p>
            <div class="mt-3 flex items-center justify-between gap-4 border-b border-[#1e1f21] pb-5">
              <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Pengalaman Kerja</h2>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(exp, i) in portfolio.work_experiences" :key="exp.id" v-reveal="{ delay: i * 80 }" class="card-lift rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-6 shadow-[rgb(22,23,25)_0px_0px_0px_1px,rgb(4,5,6)_0px_0px_0px_1px_inset] transition-colors hover:border-[#262728]">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-base font-semibold text-white">{{ exp.position }}</p>
                  <p class="mt-0.5 text-sm text-[#c8c8ca]">{{ exp.company }}{{ exp.location ? `, ${exp.location}` : '' }}</p>
                </div>
                <div class="flex shrink-0 flex-col items-end gap-1.5">
                  <span v-if="exp.is_current" class="rounded-full bg-[#5fc992]/15 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#5fc992]">Saat ini</span>
                  <span class="font-mono text-[11px] text-[#8e8e90]">{{ fmtDate(exp.start_date) }}{{ exp.is_current ? ' — Sekarang' : exp.end_date ? ' — ' + fmtDate(exp.end_date) : '' }}</span>
                </div>
              </div>
              <p v-if="exp.description" class="mt-3 text-sm leading-relaxed text-[#9a9b9d]">{{ exp.description }}</p>
              <ul v-if="exp.highlights?.length" class="mt-3 space-y-1.5">
                <li v-for="(h, i) in exp.highlights" :key="i" class="flex items-start gap-2 text-sm text-[#c8c8ca]">
                  <span class="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#55b3ff]"></span>
                  {{ h }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Education Section -->
        <section v-if="portfolio.educations?.length" id="pendidikan" class="mb-12 scroll-mt-24">
          <div class="mb-8">
            <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#55b3ff]">04 / Akademik</p>
            <div class="mt-3 flex items-center justify-between gap-4 border-b border-[#1e1f21] pb-5">
              <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Pendidikan</h2>
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="(edu, i) in portfolio.educations" :key="edu.id" v-reveal="{ delay: i * 80 }" class="card-lift rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-6 transition-colors hover:border-[#262728]">
              <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#55b3ff]">{{ edu.degree }}{{ edu.field_of_study ? ` — ${edu.field_of_study}` : '' }}</p>
              <p class="mt-1.5 text-base font-semibold text-white">{{ edu.institution }}</p>
              <p class="mt-1 font-mono text-[11px] text-[#8e8e90]">{{ fmtDate(edu.start_date) }}{{ edu.end_date ? ' — ' + fmtDate(edu.end_date) : ' — Sekarang' }}</p>
              <p v-if="edu.description" class="mt-3 text-sm leading-relaxed text-[#9a9b9d]">{{ edu.description }}</p>
            </div>
          </div>
        </section>

        <!-- Certificates Section -->
        <section v-if="portfolio.certificates?.length" id="sertifikat" class="mb-12 scroll-mt-24">
          <div class="mb-8">
            <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#55b3ff]">05 / Kredensial</p>
            <div class="mt-3 flex items-center justify-between gap-4 border-b border-[#1e1f21] pb-5">
              <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Sertifikat</h2>
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="(cert, i) in portfolio.certificates" :key="cert.id" v-reveal="{ delay: i * 80 }" class="card-lift rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-6 transition-colors hover:border-[#262728]">
              <div class="flex items-start justify-between gap-3">
                <p class="text-sm font-semibold text-white">{{ cert.name }}</p>
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-[#55b3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              </div>
              <p class="mt-0.5 text-sm text-[#c8c8ca]">{{ cert.issuer }}</p>
              <p v-if="cert.issue_date" class="mt-1 font-mono text-[11px] text-[#8e8e90]">{{ cert.issue_date }}</p>
              <p v-if="cert.description" class="mt-2 text-xs text-[#8e8e90]">{{ cert.description }}</p>
              <a v-if="cert.credential_url" :href="cert.credential_url" target="_blank" class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#6cbfff] transition-colors hover:text-[#83cbff]">
                Lihat kredensial
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        </section>

        <!-- GitLab Projects Grid: full-bleed band -->
        <section v-if="portfolio.gitlab_projects.length" class="full-bleed mb-12 border-y border-[#1e1f21] bg-[#0a0b0c]">
          <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div class="mb-8">
            <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#55b3ff]">06 / Repositori Lain</p>
            <div class="mt-3 flex items-center justify-between gap-4 border-b border-[#1e1f21] pb-5">
              <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Repositori GitLab</h2>
              <span class="rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-3 py-1 font-mono text-[10px] font-semibold text-[#8e8e90]">{{ portfolio.gitlab_projects.length }} repo</span>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="(project, gi) in portfolio.gitlab_projects"
              :key="project.id"
              v-reveal="{ delay: Math.min(gi * 60, 400) }"
              class="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-5 transition-all hover:-translate-y-1 hover:border-[#262728] hover:bg-[#151617]"
            >
              <div class="relative">
                <div class="mb-3 flex items-start justify-between gap-2">
                  <a :href="project.repo_url" target="_blank" class="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#6cbfff]">
                    {{ project.title }}
                    <svg class="h-3 w-3 text-[#5e5f61] transition-colors group-hover:text-[#6cbfff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <p v-if="project.ai_summary" class="mb-4 text-sm leading-relaxed text-[#9a9b9d]">
                  {{ project.ai_summary }}
                </p>

                <div class="mb-5 flex flex-wrap gap-1.5">
                  <span
                    v-for="tech in project.tech_stack"
                    :key="tech"
                    class="rounded-md border border-[#1e1f21] bg-[#040506] px-2 py-0.5 font-mono text-[10px] font-medium text-[#c8c8ca]"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <div class="relative flex items-center justify-between border-t border-[#1e1f21] pt-4">
                <span class="font-mono text-[11px] text-[#8e8e90]">Updated {{ formatTime(project.last_pushed_at) }}</span>
              </div>
            </article>
          </div>
          </div>
        </section>

        <!-- Footer: parallax finale full-bleed -->
        <footer class="full-bleed relative overflow-hidden border-t border-[#1e1f21]">
          <div data-plx="0.18" class="pointer-events-none absolute inset-x-0 bottom-0 will-change-transform">
            <img src="/assets/circuit-glow.png" alt="" class="w-full opacity-50" />
          </div>
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#040506] via-[#040506]/60 to-[#040506]/90"></div>
          <div class="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
            <div data-plx="0.08" class="will-change-transform">
              <div class="flex h-12 w-12 items-center justify-center rounded-full border border-[#55b3ff]/40 bg-[#55b3ff]/10">
                <span class="text-lg font-bold text-[#55b3ff]">S</span>
              </div>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white">Tertarik bekerja sama?</h2>
            <p class="max-w-md text-sm leading-relaxed text-[#8e8e90]">Saya terbuka untuk kolaborasi proyek web, mobile, dan sistem informasi. Hubungi saya lewat LinkedIn atau unduh CV saya.</p>
            <div class="flex flex-wrap items-center justify-center gap-3">
              <a :href="portfolio.user.linkedin || '#'" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full bg-[#55b3ff] px-5 py-2 text-xs font-semibold text-[#07080a] transition-colors hover:bg-[#6cbfff]">Hubungi Saya</a>
              <a :href="`/api/download-cv?username=${portfolio.user.username || username}`" target="_blank" class="inline-flex items-center gap-2 rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-5 py-2 text-xs font-medium text-[#c8c8ca] transition-colors hover:border-[#262728] hover:bg-[#151617] hover:text-white">Unduh CV</a>
            </div>
            <p class="mt-6 font-mono text-[11px] text-[#5e5f61]">
              © {{ new Date().getFullYear() }} {{ portfolio.user.name }} — Padang, Indonesia
            </p>
          </div>
        </footer>
      </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.public-project-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 250px;
}

.type-cursor {
  display: inline-block;
  width: 3px;
  height: 0.9em;
  margin-left: 6px;
  vertical-align: -0.08em;
  background: #55b3ff;
  animation: cursorBlink 0.85s steps(1) infinite;
}

@keyframes cursorBlink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .type-cursor { animation: none; opacity: 1; }
}
</style>
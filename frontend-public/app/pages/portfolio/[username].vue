<script setup lang="ts">
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

const { data: portfolio, pending, error } = await useAsyncData(`portfolio-${username.value}`, async () => {
  const res = await api.get<{ success: boolean; data: PortfolioData }>(`/portfolio/${username.value}`)
  return res.data
})

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
</script>

<template>
  <div class="min-h-screen bg-[#040506] text-[#f4f4f6] selection:bg-[#55b3ff]/30 selection:text-white">
    <!-- Signature diagonal stripe pattern (Raycast-inspired) -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.06]" style="background-image: repeating-linear-gradient(-45deg, #55b3ff 0 2px, transparent 2px 16px);"></div>
    <!-- Subtle blue glow -->
    <div class="pointer-events-none absolute left-1/4 top-0 h-[420px] w-[520px] rounded-full bg-[#55b3ff]/[0.07] blur-[140px]"></div>

    <div class="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

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
        <!-- Header Profile -->
        <header class="fade-in mb-14 flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:text-left">
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

          <div class="flex-1 space-y-4">
            <div class="space-y-2">
              <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#55b3ff]">
                // {{ portfolio.user.job_title || 'Software Developer' }}
              </p>
              <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">{{ portfolio.user.name }}</h1>
              <p class="mx-auto max-w-2xl text-sm leading-relaxed text-[#c8c8ca] sm:mx-0">
                {{ portfolio.user.bio || 'Halo! Saya adalah pengembang perangkat lunak profesional dengan fokus pada pembuatan sistem berkualitas tinggi.' }}
              </p>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <a
                :href="`/api/download-cv?username=${portfolio.user.username || username}`"
                target="_blank"
                class="inline-flex items-center gap-2 rounded-full bg-[#55b3ff] px-5 py-2 text-xs font-semibold text-[#07080a] transition-colors hover:bg-[#6cbfff]"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                Unduh CV
              </a>
              <a
                v-if="portfolio.user.linkedin"
                :href="portfolio.user.linkedin"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-5 py-2 text-xs font-medium text-[#c8c8ca] transition-colors hover:border-[#262728] hover:bg-[#151617] hover:text-white"
              >
                <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                LinkedIn
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
        </header>

        <!-- Stats Bar -->
        <section class="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        </section>

        <!-- Featured Projects Showcase -->
        <section v-if="featuredProjects.length" class="mb-14">
          <div class="mb-6 flex items-center gap-3">
            <h2 class="text-lg font-bold tracking-tight text-white">Proyek Unggulan</h2>
            <span class="rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#55b3ff]">{{ featuredProjects.length }}</span>
            <div class="h-px flex-1 bg-[#1e1f21]"></div>
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
                <p v-if="project.ai_summary" class="mb-4 text-xs leading-relaxed text-[#8e8e90] line-clamp-2">{{ project.ai_summary }}</p>
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

        <!-- Skills Showcase -->
        <section v-if="topSkills.length" class="mb-14">
          <div class="mb-6 flex items-center gap-3">
            <h2 class="text-lg font-bold tracking-tight text-white">Tech Stack</h2>
            <div class="h-px flex-1 bg-[#1e1f21]"></div>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(skill, i) in topSkills"
              :key="skill.name"
              v-reveal="{ delay: Math.min(i * 40, 400) }"
              class="rounded-lg border border-[#1e1f21] bg-[#0c0d0e] px-3 py-1.5 font-mono text-xs font-medium text-[#c8c8ca] transition-colors hover:border-[#55b3ff]/50 hover:bg-[#55b3ff]/10 hover:text-[#6cbfff]"
            >
              {{ skill.name }}
              <span class="ml-1.5 text-[10px] text-[#5e5f61]">{{ skill.count }}</span>
            </span>
          </div>
        </section>

        <!-- Work Experience Section -->
        <section v-if="portfolio.work_experiences?.length" class="mb-14">
          <div class="mb-6 flex items-center gap-3">
            <h2 class="text-lg font-bold tracking-tight text-white">Pengalaman Kerja</h2>
            <div class="h-px flex-1 bg-[#1e1f21]"></div>
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
              <p v-if="exp.description" class="mt-3 text-xs leading-relaxed text-[#8e8e90]">{{ exp.description }}</p>
              <ul v-if="exp.highlights?.length" class="mt-3 space-y-1.5">
                <li v-for="(h, i) in exp.highlights" :key="i" class="flex items-start gap-2 text-xs text-[#c8c8ca]">
                  <span class="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#55b3ff]"></span>
                  {{ h }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Education Section -->
        <section v-if="portfolio.educations?.length" class="mb-14">
          <div class="mb-6 flex items-center gap-3">
            <h2 class="text-lg font-bold tracking-tight text-white">Pendidikan</h2>
            <div class="h-px flex-1 bg-[#1e1f21]"></div>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="(edu, i) in portfolio.educations" :key="edu.id" v-reveal="{ delay: i * 80 }" class="card-lift rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-6 transition-colors hover:border-[#262728]">
              <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#55b3ff]">{{ edu.degree }}{{ edu.field_of_study ? ` — ${edu.field_of_study}` : '' }}</p>
              <p class="mt-1.5 text-base font-semibold text-white">{{ edu.institution }}</p>
              <p class="mt-1 font-mono text-[11px] text-[#8e8e90]">{{ fmtDate(edu.start_date) }}{{ edu.end_date ? ' — ' + fmtDate(edu.end_date) : ' — Sekarang' }}</p>
              <p v-if="edu.description" class="mt-3 text-xs leading-relaxed text-[#8e8e90]">{{ edu.description }}</p>
            </div>
          </div>
        </section>

        <!-- Certificates Section -->
        <section v-if="portfolio.certificates?.length" class="mb-14">
          <div class="mb-6 flex items-center gap-3">
            <h2 class="text-lg font-bold tracking-tight text-white">Sertifikat</h2>
            <div class="h-px flex-1 bg-[#1e1f21]"></div>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="(cert, i) in portfolio.certificates" :key="cert.id" v-reveal="{ delay: i * 80 }" class="card-lift rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-6 transition-colors hover:border-[#262728]">
              <div class="flex items-start justify-between gap-3">
                <p class="text-sm font-semibold text-white">{{ cert.name }}</p>
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-[#55b3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              </div>
              <p class="mt-0.5 text-xs text-[#c8c8ca]">{{ cert.issuer }}</p>
              <p v-if="cert.issue_date" class="mt-1 font-mono text-[11px] text-[#8e8e90]">{{ cert.issue_date }}</p>
              <p v-if="cert.description" class="mt-2 text-xs text-[#8e8e90]">{{ cert.description }}</p>
              <a v-if="cert.credential_url" :href="cert.credential_url" target="_blank" class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#6cbfff] transition-colors hover:text-[#83cbff]">
                Lihat kredensial
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        </section>

        <!-- GitLab Projects Grid -->
        <section v-if="portfolio.gitlab_projects.length" class="mb-10">
          <div class="mb-6 flex items-center gap-3">
            <h2 class="text-lg font-bold tracking-tight text-white">Repositori GitLab</h2>
            <span class="rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#8e8e90]">{{ portfolio.gitlab_projects.length }}</span>
            <div class="h-px flex-1 bg-[#1e1f21]"></div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="project in portfolio.gitlab_projects"
              :key="project.id"
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

                <p v-if="project.ai_summary" class="mb-4 text-xs leading-relaxed text-[#8e8e90]">
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
        </section>

        <!-- Footer -->
        <footer class="mt-8 border-t border-[#1e1f21] pt-6 text-center">
          <p class="font-mono text-[11px] text-[#5e5f61]">
            © {{ new Date().getFullYear() }} {{ portfolio.user.name }} — Dibangun dengan OmniSync
          </p>
        </footer>
      </div>

    </div>
  </div>
</template>

<style scoped>
.public-project-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 250px;
}
</style>
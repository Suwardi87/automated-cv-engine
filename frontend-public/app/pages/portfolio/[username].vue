<script setup lang="ts">
interface Project {
  id: number
  title: string
  slug: string
  repo_url: string
  live_url: string | null
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
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-500/30 selection:text-violet-200">
    <!-- Grid overlay background -->
    <div class="absolute inset-0 opacity-[0.02] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M0 0h60v60H0z&quot; fill=&quot;none&quot; stroke=&quot;white&quot; stroke-width=&quot;1&quot;/%3E%3C/svg%3E');"></div>
    
    <!-- Glowing background elements -->
    <div class="absolute left-1/3 top-10 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none"></div>
    <div class="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-fuchsia-600/5 blur-[120px] pointer-events-none"></div>

    <div class="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="pending" class="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <svg class="h-8 w-8 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p class="text-sm font-medium text-zinc-400">Memuat profil pengembang...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error || !portfolio" class="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white">Profil Tidak Ditemukan</h2>
        <p class="mt-2 text-sm text-zinc-500 max-w-md">Pengembang dengan nama "{{ username }}" belum terdaftar atau portofolionya belum disinkronkan.</p>
        <NuxtLink to="/" class="mt-6 rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">
          Kembali ke Beranda
        </NuxtLink>
      </div>

      <!-- Main Profile Content -->
      <div v-else>
        <!-- Header Profile Card -->
        <header class="mb-16 flex flex-col items-center gap-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/20 p-8 text-center backdrop-blur-md sm:flex-row sm:text-left sm:p-10">
          <div class="relative shrink-0">
            <img 
              v-if="portfolio.user.avatar_url" 
              :src="portfolio.user.avatar_url" 
              :alt="portfolio.user.name"
              width="100"
              height="100"
              class="h-24 w-24 rounded-2xl object-cover ring-2 ring-violet-500/40 shadow-xl"
            />
            <div v-else class="flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-800 text-3xl font-bold text-zinc-500 ring-2 ring-zinc-700">
              {{ portfolio.user.name.charAt(0).toUpperCase() }}
            </div>
            <span class="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </span>
          </div>
          <div class="flex-1 space-y-3">
            <div class="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
              <h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl">{{ portfolio.user.name }}</h1>
            </div>
            <p class="text-sm leading-relaxed text-zinc-400 max-w-2xl">
              {{ portfolio.user.bio || 'Halo! Saya adalah pengembang perangkat lunak profesional dengan fokus pada pembuatan sistem berkualitas tinggi.' }}
            </p>
          </div>
        </header>

        <!-- GitHub Projects Grid -->
        <section class="mb-16">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <h2 class="text-lg font-bold tracking-tight text-white">Repositori GitHub</h2>
            <span class="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500">{{ portfolio.github_projects.length }}</span>
          </div>

          <div v-if="portfolio.github_projects.length === 0" class="rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-8 text-center text-zinc-600">
            Belum ada repositori GitHub yang disinkronkan.
          </div>

          <div v-else class="grid gap-6 md:grid-cols-2">
            <article 
              v-for="project in portfolio.github_projects" 
              :key="project.id" 
              class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 transition-all hover:-translate-y-1 hover:border-zinc-800 hover:bg-zinc-900/60"
            >
              <!-- Card Background Glow on Hover -->
              <div class="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              <div class="relative">
                <!-- Title & Badge -->
                <div class="mb-3 flex items-start justify-between gap-2">
                  <a :href="project.repo_url" target="_blank" class="flex items-center gap-2 text-base font-semibold text-zinc-100 hover:text-violet-400 transition-colors">
                    {{ project.title }}
                    <svg class="h-3.5 w-3.5 text-zinc-600 group-hover:text-violet-400/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <span v-if="project.is_featured" class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-bold text-amber-300">
                    UNGGULAN
                  </span>
                </div>

                <!-- Description / AI Summary -->
                <div class="mb-4">
                  <!-- Display AI Summary if exists, otherwise fallback to standard description -->
                  <div v-if="project.ai_summary" class="rounded-xl border border-violet-500/10 bg-violet-950/10 p-3.5 text-xs leading-relaxed text-zinc-400">
                    <div class="mb-1 flex items-center gap-1 text-[10px] font-bold tracking-wider text-violet-400 uppercase">
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Ringkasan AI
                    </div>
                    {{ project.ai_summary }}
                  </div>
                </div>

                <!-- Tech Stack Badges -->
                <div class="mb-6 flex flex-wrap gap-1.5">
                  <span 
                    v-for="tech in project.tech_stack" 
                    :key="tech"
                    class="rounded-lg bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- Footer Statistics -->
              <div class="relative flex items-center justify-between border-t border-zinc-900 pt-4 text-xs text-zinc-500">
                <div class="flex items-center gap-4">
                  <span v-if="project.primary_language" class="flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full bg-violet-400"></span>
                    {{ project.primary_language }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {{ project.stars_count }}
                  </span>
                </div>
                <span>Update {{ formatTime(project.last_pushed_at) }}</span>
              </div>
            </article>
          </div>
        </section>

        <!-- Education Section -->
        <section v-if="portfolio.educations?.length" class="mb-16">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <h2 class="text-lg font-bold tracking-tight text-white">Pendidikan</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="edu in portfolio.educations" :key="edu.id" class="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6">
              <p class="text-xs font-semibold text-violet-400 uppercase tracking-wider">{{ edu.degree }}{{ edu.field_of_study ? ` - ${edu.field_of_study}` : '' }}</p>
              <p class="mt-1 text-base font-bold text-white">{{ edu.institution }}</p>
              <p class="mt-1 text-xs text-zinc-500">{{ [edu.start_date, edu.end_date].filter(Boolean).join(' — ') || '-' }}</p>
              <p v-if="edu.description" class="mt-3 text-xs leading-relaxed text-zinc-400">{{ edu.description }}</p>
            </div>
          </div>
        </section>

        <!-- Work Experience Section -->
        <section v-if="portfolio.work_experiences?.length" class="mb-16">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h2 class="text-lg font-bold tracking-tight text-white">Pengalaman Kerja</h2>
          </div>
          <div class="space-y-4">
            <div v-for="exp in portfolio.work_experiences" :key="exp.id" class="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-base font-bold text-white">{{ exp.position }}</p>
                  <p class="text-sm text-zinc-400">{{ exp.company }}{{ exp.location ? `, ${exp.location}` : '' }}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span v-if="exp.is_current" class="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold text-emerald-300">SAAT INI</span>
                  <span class="text-xs text-zinc-500">{{ [exp.start_date, exp.is_current ? 'Sekarang' : exp.end_date].filter(Boolean).join(' — ') }}</span>
                </div>
              </div>
              <p v-if="exp.description" class="mt-3 text-xs leading-relaxed text-zinc-400">{{ exp.description }}</p>
              <ul v-if="exp.highlights?.length" class="mt-3 space-y-1">
                <li v-for="(h, i) in exp.highlights" :key="i" class="flex items-start gap-2 text-xs text-zinc-400">
                  <span class="mt-1 h-1 w-1 shrink-0 rounded-full bg-violet-400"></span>
                  {{ h }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Certificates Section -->
        <section v-if="portfolio.certificates?.length" class="mb-16">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
            <h2 class="text-lg font-bold tracking-tight text-white">Sertifikat</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="cert in portfolio.certificates" :key="cert.id" class="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6">
              <p class="text-sm font-bold text-white">{{ cert.name }}</p>
              <p class="text-xs text-zinc-400 mt-0.5">{{ cert.issuer }}</p>
              <p v-if="cert.issue_date" class="text-xs text-zinc-500 mt-1">{{ cert.issue_date }}</p>
              <p v-if="cert.description" class="text-xs text-zinc-400 mt-2">{{ cert.description }}</p>
              <a v-if="cert.credential_url" :href="cert.credential_url" target="_blank" class="mt-3 inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Lihat kredensial
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        </section>

        <!-- GitLab Projects Grid -->
        <section v-if="portfolio.gitlab_projects.length" class="mb-16">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M 3.828 13.326 L 12 23 L 20.172 13.326 C 20.576 12.659 20.33 11.807 19.598 11.386 L 12 7 L 4.402 11.386 C 3.67 11.807 3.424 12.659 3.828 13.326 Z M 12 7 L 8.399 2.803 C 8.178 2.542 7.789 2.533 7.556 2.783 C 7.368 2.985 7.333 3.289 7.473 3.528 L 12 7 Z M 12 7 L 15.601 2.803 C 15.822 2.542 16.211 2.533 16.444 2.783 C 16.632 2.985 16.667 3.289 16.527 3.528 L 12 7 Z"/>
              </svg>
            </div>
            <h2 class="text-lg font-bold tracking-tight text-white">Repositori GitLab</h2>
            <span class="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500">{{ portfolio.gitlab_projects.length }}</span>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <article 
              v-for="project in portfolio.gitlab_projects" 
              :key="project.id" 
              class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 transition-all hover:-translate-y-1 hover:border-zinc-800 hover:bg-zinc-900/60"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              <div class="relative">
                <div class="mb-3 flex items-start justify-between gap-2">
                  <a :href="project.repo_url" target="_blank" class="flex items-center gap-2 text-base font-semibold text-zinc-100 hover:text-fuchsia-400 transition-colors">
                    {{ project.title }}
                    <svg class="h-3.5 w-3.5 text-zinc-600 group-hover:text-fuchsia-400/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <p v-if="project.ai_summary" class="mb-4 text-xs leading-relaxed text-zinc-400">
                  {{ project.ai_summary }}
                </p>

                <div class="mb-6 flex flex-wrap gap-1.5">
                  <span 
                    v-for="tech in project.tech_stack" 
                    :key="tech"
                    class="rounded-lg bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <div class="relative flex items-center justify-between border-t border-zinc-900 pt-4 text-xs text-zinc-500">
                <span>Update {{ formatTime(project.last_pushed_at) }}</span>
              </div>
            </article>
          </div>
        </section>
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

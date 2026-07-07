<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6">
      <!-- Bento Grid: Stats -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Repos -->
        <div @click="navigateTo('/dashboard/portfolio')" class="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-5 transition-all hover:border-violet-500/30">
          <div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl transition-opacity group-hover:opacity-150"></div>
          <div class="relative">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <svg class="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            </div>
            <p class="text-3xl font-bold tracking-tight text-white">{{ repos.length }}</p>
            <p class="mt-1 text-xs text-zinc-500">Total Repositori</p>
          </div>
        </div>

        <!-- Featured -->
        <div @click="activeFilter = 'featured'; navigateTo('/dashboard')" class="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-5 transition-all hover:border-amber-500/30">
          <div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-amber-500/10 blur-2xl"></div>
          <div class="relative">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <svg class="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            </div>
            <p class="text-3xl font-bold tracking-tight text-white">{{ featuredRepos.length }}</p>
            <p class="mt-1 text-xs text-zinc-500">Proyek Unggulan</p>
          </div>
        </div>

        <!-- Tech Stack -->
        <div @click="navigateTo('/dashboard/portfolio')" class="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-5 transition-all hover:border-emerald-500/30">
          <div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl"></div>
          <div class="relative">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            </div>
            <p class="text-3xl font-bold tracking-tight text-white">{{ allTechStack.length }}</p>
            <p class="mt-1 text-xs text-zinc-500">Teknologi</p>
          </div>
        </div>

        <!-- Profile Views -->
        <div @click="navigateTo('/dashboard/settings')" class="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-5 transition-all hover:border-fuchsia-500/30">
          <div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-fuchsia-500/10 blur-2xl"></div>
          <div class="relative">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10">
              <svg class="h-5 w-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </div>
            <div class="flex items-baseline gap-1">
              <p class="text-3xl font-bold tracking-tight text-white">1.2</p>
              <span class="text-sm text-zinc-500">k</span>
            </div>
            <p class="mt-1 text-xs text-zinc-500">Tampilan Profil</p>
          </div>
        </div>
      </div>

      <!-- Two column: Repos + Activity -->
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Repos grid -->
        <div class="lg:col-span-2">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-zinc-200">Repositori Terbaru</h2>
            <div class="flex items-center gap-2">
              <button @click="activeFilter = 'all'" :class="activeFilter === 'all' ? 'border-zinc-700 bg-zinc-900 text-white' : 'text-zinc-500'" class="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium transition-colors hover:text-white">
                Semua
              </button>
              <button @click="activeFilter = 'featured'" :class="activeFilter === 'featured' ? 'border-zinc-700 bg-zinc-900 text-white' : 'text-zinc-500'" class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:text-zinc-300">
                Unggulan
              </button>
              <button @click="activeFilter = 'active'" :class="activeFilter === 'active' ? 'border-zinc-700 bg-zinc-900 text-white' : 'text-zinc-500'" class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:text-zinc-300">
                Aktif
              </button>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="repo in filteredRepos"
              :key="repo.id"
              @click="navigateTo('/dashboard/portfolio')"
              class="group relative cursor-pointer rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
              :class="repo.is_featured ? 'ring-1 ring-amber-500/20' : ''"
            >
              <!-- Featured badge -->
              <div v-if="repo.is_featured" class="absolute -top-2 right-4">
                <span class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  <svg class="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.799-2.034a1 1 0 00-1.176 0l-2.799 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  UNGGULAN
                </span>
              </div>

              <!-- Title + meta -->
              <div class="mb-2 flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <svg class="h-4 w-4 shrink-0 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                  <h3 class="truncate text-sm font-semibold text-zinc-200 group-hover:text-white">{{ repo.title }}</h3>
                </div>
              </div>

              <!-- Tech stack -->
              <div class="mb-3 flex flex-wrap gap-1">
                <span
                  v-for="tech in repo.tech_stack.slice(0, 3)"
                  :key="tech"
                  class="rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400"
                >
                  {{ tech }}
                </span>
                <span v-if="repo.tech_stack.length > 3" class="rounded-md bg-zinc-800/40 px-2 py-0.5 text-[10px] text-zinc-600">
                  +{{ repo.tech_stack.length - 3 }}
                </span>
              </div>

              <!-- Footer: time -->
              <div class="flex items-center gap-4 border-t border-zinc-800/40 pt-3 text-xs text-zinc-600">
                <span>{{ formatTime(repo.last_pushed_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity sidebar -->
        <div class="space-y-4">
          <!-- Sync status -->
          <div class="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-violet-950/30 to-zinc-900/40 p-5">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-sm font-semibold text-zinc-200">Status Sinkronisasi</h3>
              <span class="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-xs">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <svg class="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <p class="font-medium text-zinc-300">GitHub terhubung</p>
                  <p class="text-zinc-600">Terakhir sync: 2 jam lalu</p>
                </div>
              </div>
              <button @click="handleSync" :disabled="syncing" class="w-full rounded-xl bg-violet-600/90 py-2.5 text-xs font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-50">
                {{ syncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang' }}
              </button>
            </div>
          </div>

          <!-- Activity log -->
          <div class="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
            <h3 class="mb-4 text-sm font-semibold text-zinc-200">Aktivitas Terbaru</h3>
            <div class="space-y-3">
              <div
                v-for="(activity, i) in activities"
                :key="i"
                class="flex gap-3"
              >
                <div class="relative flex flex-col items-center">
                  <div class="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 ring-1 ring-zinc-700">
                    <span v-html="activityIcon(activity.type)" class="scale-75"></span>
                  </div>
                  <div v-if="i < activities.length - 1" class="mt-1 h-full w-px flex-1 bg-zinc-800"></div>
                </div>
                <div class="pb-3">
                  <p class="text-xs leading-relaxed text-zinc-400">{{ activity.text }}</p>
                  <p class="mt-0.5 text-[10px] text-zinc-600">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Insight -->
          <div class="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 to-fuchsia-950/20 p-5">
            <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl"></div>
            <div class="relative">
              <div class="mb-2 flex items-center gap-2">
                <svg class="h-4 w-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                <h3 class="text-sm font-semibold text-violet-200">AI Insight</h3>
              </div>
              <p class="text-xs leading-relaxed text-zinc-400">
                Proyek <span class="font-semibold text-violet-300">automated-cv-engine</span> mendapat 47 stars minggu ini. Pertimbangkan untuk menambah dokumentasi deployment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface Repo {
  id: number
  title: string
  slug: string
  tech_stack: string[]
  ai_summary: string | null
  repo_url: string
  live_url: string | null
  is_featured: boolean
  last_pushed_at: string
}

const repos = ref<Repo[]>([])
const activities = ref([
  { type: 'sync' as const, text: 'Sinkronisasi repositori dari GitHub', time: '2 jam lalu' },
  { type: 'feature' as const, text: 'Proyek ditandai sebagai unggulan', time: '5 jam lalu' },
  { type: 'ai' as const, text: 'AI meringkas README repositori', time: '1 hari lalu' },
  { type: 'cv' as const, text: 'CV versi terbaru di-generate', time: '3 hari lalu' },
])
const syncing = ref(false)
const activeFilter = ref<'all' | 'featured' | 'active'>('all')

const featuredRepos = computed(() => repos.value.filter(r => r.is_featured))
const allTechStack = computed(() => [...new Set(repos.value.flatMap(r => r.tech_stack))])
const filteredRepos = computed(() => {
  if (activeFilter.value === 'featured') return repos.value.filter(r => r.is_featured)
  if (activeFilter.value === 'active') return repos.value.slice(0, 6)
  return repos.value.slice(0, 12)
})

onMounted(async () => {
  try {
    const { data: github } = await useApi().get<{ data: Repo[] }>('/github/repos')
    repos.value = github || []
  } catch {
    repos.value = []
  }
})

async function handleSync() {
  syncing.value = true
  try {
    await useApi().post('/github/sync')
    const { data: github } = await useApi().get<{ data: Repo[] }>('/github/repos')
    repos.value = github || []
  } catch {
    /* ignore */
  } finally {
    syncing.value = false
  }
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

function activityIcon(type: string): string {
  const icons: Record<string, string> = {
    sync: '<svg class="h-3.5 w-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>',
    feature: '<svg class="h-3.5 w-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>',
    ai: '<svg class="h-3.5 w-3.5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
    cv: '<svg class="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>'
  }
  return (icons[type] ?? icons.sync) as string
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100">
    <div class="relative overflow-hidden border-b border-zinc-800/60">
      <div class="absolute inset-0 bg-gradient-to-br from-zinc-950 via-violet-950/20 to-zinc-950"></div>
      <div class="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]"></div>
      <div class="absolute inset-0 opacity-[0.02]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;40&quot; height=&quot;40&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M0 0h40v40H0z&quot; fill=&quot;none&quot; stroke=&quot;white&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E');"></div>

      <div class="relative mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div class="mb-8 flex items-center gap-2 text-xs text-zinc-600">
          <NuxtLink to="/" class="hover:text-zinc-400">Beranda</NuxtLink>
          <span>/</span>
          <span class="text-violet-400">Portfolio</span>
        </div>

        <div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div class="relative">
            <img :src="user.avatar_url || ''" :alt="user.name" class="h-24 w-24 rounded-2xl object-cover ring-2 ring-zinc-800" />
            <div class="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-zinc-950 bg-emerald-500">
              <svg class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
          </div>
          <div class="flex-1">
            <h1 class="text-4xl font-bold tracking-tight text-white">{{ user.name }}</h1>
            <p class="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">{{ user.bio }}</p>

            <div class="mt-4 flex flex-wrap items-center gap-3">
              <a href="https://github.com/suwardi87" target="_blank" rel="noopener" class="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white">
                <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
            </div>
          </div>

          <div class="flex gap-2">
            <NuxtLink to="/dashboard/cv" class="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30">
              Download CV
            </NuxtLink>
            <NuxtLink to="/dashboard/settings" class="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">
              Kontak
            </NuxtLink>
          </div>
        </div>

        <div class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div class="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
            <p class="text-2xl font-bold text-white">{{ repos.length }}</p>
            <p class="mt-0.5 text-xs text-zinc-500">Total Repositori</p>
          </div>
          <div class="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
            <p class="text-2xl font-bold text-white">{{ featuredProjects.length }}</p>
            <p class="mt-0.5 text-xs text-zinc-500">Proyek Unggulan</p>
          </div>
          <div class="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
            <p class="text-2xl font-bold text-white">{{ allTechStack.length }}</p>
            <p class="mt-0.5 text-xs text-zinc-500">Teknologi</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Projects -->
    <div class="mx-auto max-w-5xl px-6 py-16">
      <div class="mb-8 flex items-end justify-between">
        <div>
          <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">Karya Pilihan</p>
          <h2 class="text-2xl font-bold tracking-tight text-white">Proyek Unggulan</h2>
        </div>
        <button @click="scrollToAll" class="text-sm text-zinc-500 hover:text-zinc-300">Lihat semua →</button>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Big featured -->
        <div class="group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 lg:col-span-2 lg:row-span-2">
          <div class="relative h-48 overflow-hidden bg-gradient-to-br from-violet-900/40 to-fuchsia-900/30 lg:h-72">
            <div class="absolute inset-0 opacity-20" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;40&quot; height=&quot;40&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M0 0h40v40H0z&quot; fill=&quot;none&quot; stroke=&quot;white&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E');"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-6">
              <span class="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-sm">
                <svg class="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.799-2.034a1 1 0 00-1.176 0l-2.799 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                PROYEK UNGGULAN
              </span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="mb-2 text-xl font-bold text-white">{{ featuredProjects[0]?.title }}</h3>
            <p class="mb-4 text-sm leading-relaxed text-zinc-400">{{ featuredProjects[0]?.ai_summary }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in featuredProjects[0]?.tech_stack" :key="tech" class="rounded-lg bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                {{ tech }}
              </span>
            </div>
            <div class="mt-4 flex items-center gap-4 border-t border-zinc-800/40 pt-4 text-xs text-zinc-600">
              <a :href="featuredProjects[0]?.repo_url" target="_blank" rel="noopener" class="ml-auto flex items-center gap-1 text-violet-400 hover:text-violet-300">Lihat proyek <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></a>
            </div>
          </div>
        </div>

        <!-- Small featured -->
        <a v-for="project in featuredProjects.slice(1)" :key="project.id" :href="project.repo_url" target="_blank" rel="noopener" class="group relative block overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 transition-all hover:border-zinc-700">
          <div class="p-5">
            <h3 class="mb-1.5 text-base font-bold text-white">{{ project.title }}</h3>
            <div class="flex flex-wrap gap-1">
              <span v-for="tech in project.tech_stack.slice(0, 2)" :key="tech" class="rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] text-zinc-400">
                {{ tech }}
              </span>
            </div>
          </div>
        </a>
      </div>

      <div id="all-projects" class="mt-16">
        <h2 class="mb-6 text-2xl font-bold tracking-tight text-white">Semua Proyek</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            v-for="repo in repos"
            :key="repo.id"
            :href="repo.repo_url"
            target="_blank"
            rel="noopener"
            class="group rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/60"
          >
            <div class="mb-2 flex items-center gap-2">
              <svg class="h-4 w-4 shrink-0 text-zinc-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <h3 class="truncate text-sm font-semibold text-zinc-200 group-hover:text-white">{{ repo.title }}</h3>
            </div>
            <div class="flex flex-wrap gap-1">
              <span v-for="tech in repo.tech_stack.slice(0, 3)" :key="tech" class="rounded bg-zinc-800/60 px-1.5 py-0.5 text-[10px] text-zinc-400">{{ tech }}</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Tech stack cloud -->
      <div class="mt-16 rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-8">
        <h2 class="mb-6 text-center text-lg font-bold text-white">Teknologi yang Dikuasai</h2>
        <div class="flex flex-wrap justify-center gap-3">
          <span
            v-for="tech in allTechStack"
            :key="tech"
            class="cursor-default rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>

    <div class="border-t border-zinc-800/60 bg-zinc-950 py-12">
      <div class="mx-auto max-w-5xl px-6 text-center">
        <p class="text-lg font-semibold text-white">Tertarik untuk berkolaborasi?</p>
        <p class="mt-2 text-sm text-zinc-500">Saya selalu terbuka untuk proyek menarik dan tantangan baru.</p>
        <NuxtLink to="/dashboard/settings" class="mt-6 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20">
          Hubungi Saya
        </NuxtLink>
      </div>
    </div>
  </div>
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

const auth = useAuthStore()
const user = computed(() => auth.user ?? { name: '', bio: '', avatar_url: '' })
const repos = ref<Repo[]>([])
const featuredProjects = computed(() => repos.value.filter(r => r.is_featured))
const allTechStack = computed(() => [...new Set(repos.value.flatMap(r => r.tech_stack))])

onMounted(async () => {
  try {
    const { data: github } = await useApi().get<{ data: Repo[] }>('/github/repos')
    repos.value = github || []
  } catch {
    repos.value = []
  }
})

function scrollToAll() {
  const el = document.querySelector('[id="all-projects"]')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

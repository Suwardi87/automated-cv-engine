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
        <div class="flex items-center gap-3">
          <button
            @click="captureAllScreenshots"
            :disabled="screenshotLoading"
            class="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300 transition-all hover:border-violet-500/50 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg v-if="screenshotLoading" class="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <svg v-else class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ screenshotLoading ? 'Memproses...' : 'Screenshot Semua' }}
          </button>
          <button @click="scrollToAll" class="text-sm text-zinc-500 hover:text-zinc-300">Lihat semua →</button>
        </div>
      </div>

      <div v-if="screenshotMessage" class="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        {{ screenshotMessage }}
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Big featured -->
        <div class="group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 lg:col-span-2 lg:row-span-2">
          <div class="relative h-48 overflow-hidden bg-gradient-to-br from-violet-900/40 to-fuchsia-900/30 lg:h-72">
            <img
              v-if="featuredProjects[0]?.screenshot_url"
              :src="featuredProjects[0]?.screenshot_url"
              :alt="`Preview ${featuredProjects[0]?.title}`"
              class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div v-else class="absolute inset-0 opacity-20" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;40&quot; height=&quot;40&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M0 0h40v40H0z&quot; fill=&quot;none&quot; stroke=&quot;white&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E');"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-6 flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-sm">
                <svg class="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.799-2.034a1 1 0 00-1.176 0l-2.799 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                PROYEK UNGGULAN
              </span>
              <a
                v-if="featuredProjects[0]?.live_url"
                :href="featuredProjects[0]?.live_url"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-300 backdrop-blur-sm hover:bg-emerald-500/20"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE
              </a>
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
            <div class="mt-4 flex items-center gap-3 border-t border-zinc-800/40 pt-4 text-xs">
              <button
                @click="captureScreenshot(featuredProjects[0]?.id)"
                :disabled="screenshotLoadingId === featuredProjects[0]?.id"
                class="flex items-center gap-1 text-zinc-500 hover:text-violet-400 disabled:opacity-50"
                title="Update screenshot"
              >
                <svg v-if="screenshotLoadingId === featuredProjects[0]?.id" class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <svg v-else class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {{ screenshotLoadingId === featuredProjects[0]?.id ? 'Memproses...' : 'Screenshot' }}
              </button>
              <a :href="featuredProjects[0]?.repo_url" target="_blank" rel="noopener" class="ml-auto flex items-center gap-1 text-violet-400 hover:text-violet-300">Lihat proyek <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></a>
            </div>
          </div>
        </div>

        <!-- Small featured -->
        <a
          v-for="project in featuredProjects.slice(1)"
          :key="project.id"
          :href="project.repo_url"
          target="_blank"
          rel="noopener"
          class="group relative block overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 transition-all hover:border-zinc-700"
        >
          <div v-if="project.screenshot_url" class="aspect-video overflow-hidden">
            <img
              :src="project.screenshot_url"
              :alt="`Preview ${project.title}`"
              class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="p-5">
            <div class="mb-1.5 flex items-center justify-between gap-2">
              <h3 class="text-base font-bold text-white">{{ project.title }}</h3>
              <span v-if="project.live_url" class="flex items-center gap-1 text-[9px] font-bold text-emerald-300">
                <span class="h-1 w-1 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE
              </span>
            </div>
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
          <div
            v-for="repo in repos"
            :key="repo.id"
            class="group relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/40 transition-all hover:border-zinc-700 hover:bg-zinc-900/60"
          >
            <div class="relative aspect-video overflow-hidden border-b border-zinc-800/60 bg-zinc-950">
              <a :href="repo.live_url || repo.repo_url" target="_blank" rel="noopener" class="block h-full w-full">
                <img
                  v-if="repo.screenshot_url"
                  :src="repo.screenshot_url"
                  :alt="`Preview ${repo.title}`"
                  class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div v-else class="flex h-full w-full items-center justify-center">
                  <svg class="h-8 w-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                </div>
              </a>
              <span
                v-if="repo.live_url"
                class="absolute right-12 top-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 backdrop-blur-sm"
              >
                <span class="h-1 w-1 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE
              </span>
              <span
                v-else-if="repo.screenshot_url"
                class="absolute right-12 top-2 inline-flex items-center gap-1 rounded-full border border-zinc-700/60 bg-zinc-900/80 px-2 py-0.5 text-[9px] font-bold text-zinc-300 backdrop-blur-sm"
              >
                REPO
              </span>
              <button
                @click.prevent="toggleFeatured(repo)"
                :disabled="togglingFeaturedId === repo.id"
                :class="[
                  'absolute left-2 top-2 rounded-lg border p-1.5 backdrop-blur-sm transition-colors disabled:opacity-50',
                  repo.is_featured
                    ? 'border-amber-500/40 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                    : 'border-zinc-700 bg-zinc-900/80 text-zinc-400 hover:text-amber-300',
                ]"
                :title="repo.is_featured ? 'Hapus dari unggulan' : 'Jadikan unggulan'"
              >
                <svg v-if="togglingFeaturedId === repo.id" class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <svg v-else class="h-3 w-3" :fill="repo.is_featured ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              <button
                @click.prevent="openLiveUrlModal(repo)"
                :class="[
                  'absolute right-12 top-2 rounded-lg border p-1.5 backdrop-blur-sm transition-colors',
                  repo.live_url
                    ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    : 'border-zinc-700 bg-zinc-900/80 text-zinc-400 hover:text-emerald-300',
                ]"
                :title="repo.live_url ? 'Edit live URL' : 'Set live URL'"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
              <button
                v-if="repo.live_url"
                @click.prevent="captureScreenshot(repo.id)"
                :disabled="screenshotLoadingId === repo.id"
                class="absolute right-2 top-2 rounded-lg border border-zinc-700 bg-zinc-900/80 p-1.5 text-zinc-400 backdrop-blur-sm transition-colors hover:text-violet-400 disabled:opacity-50"
                title="Update screenshot"
              >
                <svg v-if="screenshotLoadingId === repo.id" class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <svg v-else class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
            <a :href="repo.repo_url" target="_blank" rel="noopener" class="block p-5">
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

    <!-- Modal Edit Live URL -->
    <Teleport to="body">
      <div
        v-if="liveUrlModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm"
        @click.self="closeLiveUrlModal"
      >
        <div class="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white">Live URL Project</h3>
              <p class="mt-0.5 text-xs text-zinc-500">{{ liveUrlModal.title }}</p>
            </div>
            <button
              @click="closeLiveUrlModal"
              class="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            URL Website Live
          </label>
          <input
            v-model="liveUrlModal.value"
            type="url"
            placeholder="https://example.com"
            class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            @keydown.enter="saveLiveUrl"
            @keydown.escape="closeLiveUrlModal"
          />
          <p class="mt-2 text-xs text-zinc-500">
            Setelah simpan, screenshot akan otomatis di-capture di background (~5-10 detik).
          </p>

          <div class="mt-5 flex justify-end gap-2">
            <button
              @click="closeLiveUrlModal"
              class="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              Batal
            </button>
            <button
              @click="saveLiveUrl"
              :disabled="liveUrlModal.saving"
              class="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {{ liveUrlModal.saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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
  screenshot_url: string | null
  is_featured: boolean
  last_pushed_at: string
}

const auth = useAuthStore()
const user = computed(() => auth.user ?? { name: '', bio: '', avatar_url: '' })
const repos = ref<Repo[]>([])
const featuredProjects = computed(() => repos.value.filter(r => r.is_featured))
const allTechStack = computed(() => [...new Set(repos.value.flatMap(r => r.tech_stack))])

const screenshotLoading = ref(false)
const screenshotLoadingId = ref<number | null>(null)
const screenshotMessage = ref('')
const togglingFeaturedId = ref<number | null>(null)
const liveUrlModal = reactive({
  open: false,
  id: 0,
  title: '',
  value: '',
  saving: false,
})

async function loadRepos() {
  try {
    const { data: github } = await useApi().get<{ data: Repo[] }>('/github/repos')
    repos.value = github || []
  } catch {
    repos.value = []
  }
}

onMounted(loadRepos)

function openLiveUrlModal(repo: Repo) {
  liveUrlModal.id = repo.id
  liveUrlModal.title = repo.title
  liveUrlModal.value = repo.live_url ?? ''
  liveUrlModal.saving = false
  liveUrlModal.open = true
}

function closeLiveUrlModal() {
  liveUrlModal.open = false
}

async function saveLiveUrl() {
  if (!liveUrlModal.id) return
  liveUrlModal.saving = true
  try {
    const res = await useApi().put<{ success: boolean; data: Repo }>(`/github/${liveUrlModal.id}/live-url`, {
      live_url: liveUrlModal.value,
    })
    if (res.success && res.data) {
      const idx = repos.value.findIndex(r => r.id === liveUrlModal.id)
      if (idx >= 0) {
        const target = repos.value[idx]
        if (target) {
          target.live_url = res.data.live_url
          target.screenshot_url = res.data.screenshot_url
        }
      }
      screenshotMessage.value = 'Live URL disimpan. Screenshot sedang di-capture di background.'
      setTimeout(() => { screenshotMessage.value = '' }, 6000)
    }
    liveUrlModal.open = false
  } catch {
    // ignore — global toast handles it
  } finally {
    liveUrlModal.saving = false
  }
}

async function toggleFeatured(repo: Repo) {
  togglingFeaturedId.value = repo.id
  try {
    const res = await useApi().post<{ success: boolean; data: Repo }>(`/github/${repo.id}/toggle-feature`)
    if (res.success && res.data) {
      const idx = repos.value.findIndex(r => r.id === repo.id)
      if (idx >= 0) {
        const target = repos.value[idx]
        if (target) {
          target.is_featured = res.data.is_featured
        }
      }
    }
  } catch {
    // ignore — toast handled globally
  } finally {
    togglingFeaturedId.value = null
  }
}

async function captureScreenshot(id: number | undefined) {
  if (!id) return
  screenshotLoadingId.value = id
  screenshotMessage.value = ''
  try {
    const res = await useApi().post<{ success: boolean; screenshot_url: string | null }>(`/github/screenshot/${id}`)
    const repoIndex = repos.value.findIndex(r => r.id === id)
    if (res.success && res.screenshot_url) {
      if (repoIndex >= 0) {
        const target = repos.value[repoIndex]
        if (target) target.screenshot_url = res.screenshot_url + '?t=' + Date.now()
      }
      screenshotMessage.value = `Screenshot ${repos.value[repoIndex]?.title || ''} berhasil diperbarui.`
    } else {
      screenshotMessage.value = 'Gagal mengambil screenshot. Pastikan live_url project bisa diakses.'
    }
  } catch (err) {
    screenshotMessage.value = 'Terjadi kesalahan saat mengambil screenshot.'
  } finally {
    screenshotLoadingId.value = null
    setTimeout(() => { screenshotMessage.value = '' }, 5000)
  }
}

async function captureAllScreenshots() {
  screenshotLoading.value = true
  screenshotMessage.value = ''
  try {
    const res = await useApi().post<{ success: boolean; data: { total: number; succeeded: number; failed: number; results: Array<{ id: number; title: string; success: boolean; screenshot_url?: string | null }> } }>('/github/screenshot-all')
    if (res.success) {
      const ts = Date.now()
      const successMap = new Map<number, string>()
      for (const r of res.data.results) {
        if (r.success && r.screenshot_url) successMap.set(r.id, r.screenshot_url + '?t=' + ts)
      }
      repos.value = repos.value.map(r => {
        const updated = successMap.get(r.id)
        return updated ? { ...r, screenshot_url: updated } : r
      })
      screenshotMessage.value = `Berhasil screenshot ${res.data.succeeded} dari ${res.data.total} project.${res.data.failed > 0 ? ` ${res.data.failed} gagal.` : ''}`
    } else {
      screenshotMessage.value = 'Gagal mengambil screenshot.'
    }
  } catch {
    screenshotMessage.value = 'Terjadi kesalahan saat batch screenshot.'
  } finally {
    screenshotLoading.value = false
    setTimeout(() => { screenshotMessage.value = '' }, 8000)
  }
}

function scrollToAll() {
  const el = document.querySelector('[id="all-projects"]')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="flex min-h-screen bg-zinc-950 text-zinc-100">
    <!-- Mobile sidebar overlay -->
    <Transition name="fade">
      <div v-if="mobileMenuOpen" @click="mobileMenuOpen = false" class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"></div>
    </Transition>
    <aside :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'" class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl transition-transform lg:translate-x-0">
      <!-- Logo -->
      <div class="flex h-16 items-center gap-2.5 border-b border-zinc-800/60 px-6">
        <div class="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
          <span class="text-sm font-black text-white">O</span>
          <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
        </div>
        <span class="text-base font-bold tracking-tight">OmniSync</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 space-y-0.5 px-3 py-6">
        <p class="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Menu Utama</p>
        <NuxtLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all"
          :class="isActive(item.to)
            ? 'bg-zinc-800/80 text-white shadow-sm'
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'"
        >
          <span class="transition-transform group-hover:scale-110" v-html="item.icon"></span>
          {{ item.label }}
          <span v-if="item.badge" class="ml-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">
            {{ item.badge }}
          </span>
        </NuxtLink>
      </nav>

      <!-- User card -->
      <div class="border-t border-zinc-800/60 p-3">
        <div class="flex items-center gap-3 rounded-xl bg-zinc-900/60 p-3">
          <img :src="user.avatar_url || ''" :alt="user.name" class="h-9 w-9 rounded-lg object-cover ring-1 ring-zinc-700" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ user.name }}</p>
            <p class="truncate text-xs text-zinc-500">{{ user.email }}</p>
          </div>
          <button @click="auth.logout(); navigateTo('/cms/login', { external: true })" class="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300" title="Keluar">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m-7 0a4 4 0 014-4h4" /></svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex flex-1 flex-col lg:pl-64">
      <!-- Topbar -->
      <header class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-800/60 bg-zinc-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <!-- Mobile menu button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white lg:hidden">
          <svg v-if="!mobileMenuOpen" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <!-- Page title -->
        <div class="flex-1">
          <h1 class="text-sm font-semibold text-zinc-200">{{ pageTitle }}</h1>
        </div>

        <!-- Search -->
        <div class="hidden md:block">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input v-model="searchQuery" type="text" placeholder="Cari proyek..." class="w-64 rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-3 text-sm text-zinc-300 placeholder-zinc-600 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" @keyup.enter="handleSearch" />
            <kbd class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-zinc-800 bg-zinc-800/50 px-1.5 py-0.5 text-[10px] text-zinc-500">⌘K</kbd>
          </div>
        </div>

        <!-- Sync button -->
        <NuxtLink external to="/cms/dashboard" class="group flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-violet-500/30 hover:bg-zinc-800 hover:text-white">
          <svg class="h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span class="hidden sm:inline">Sync</span>
        </NuxtLink>

        <!-- Avatar → link ke settings -->
        <NuxtLink to="/dashboard/settings" class="relative">
          <img :src="user.avatar_url || ''" :alt="user.name" class="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-700" />
          <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-950 bg-emerald-400"></span>
        </NuxtLink>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const user = computed(() => auth.user ?? { name: 'User', email: '', avatar_url: '' })
const mobileMenuOpen = ref(false)
const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    navigateTo('/cms/dashboard', { external: true })
  }
}

const route = useRoute()
const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/cms/dashboard': 'Dashboard',
    '/dashboard/portfolio': 'Portfolio Publik',
    '/dashboard/cv': 'Pratinjau CV',
    '/dashboard/settings': 'Pengaturan'
  }
  return map[route.path] || 'Dashboard'
})

const navItems = [
  {
    label: 'Dashboard',
    to: '/cms/dashboard',
    icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 14a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" /></svg>'
  },
  {
    label: 'Portfolio',
    to: '/dashboard/portfolio',
    icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
  },
  {
    label: 'CV',
    to: '/dashboard/cv',
    badge: 'PDF',
    icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>'
  },
  {
    label: 'Pengaturan',
    to: '/dashboard/settings',
    icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
  }
]

function isActive(path: string): boolean {
  if (path === '/cms/dashboard') return route.path === '/cms/dashboard'
  return route.path.startsWith(path)
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

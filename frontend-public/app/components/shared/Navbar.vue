<template>
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-900/95 backdrop-blur-md">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-purple-600">
            <span class="text-sm font-bold text-white">O</span>
          </div>
          <span class="text-lg font-bold tracking-tight text-white">OmniSync</span>
        </NuxtLink>
        <div class="hidden items-center gap-8 md:flex">
          <a href="/#features" class="text-sm font-medium text-gray-300 transition-colors hover:text-white">Fitur</a>
          <a href="/#how-it-works" class="text-sm font-medium text-gray-300 transition-colors hover:text-white">Cara Kerja</a>
          <NuxtLink to="/portfolio/suwardi87" class="group flex items-center gap-1.5 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200">
            Portofolio
            <svg class="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink external to="/cms/login" class="hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white sm:block">
            Masuk
          </NuxtLink>
          <NuxtLink to="/portfolio/suwardi87" class="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:shadow-indigo-600/40">
            Lihat Portofolio
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

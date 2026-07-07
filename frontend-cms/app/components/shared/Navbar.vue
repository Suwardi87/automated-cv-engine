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
          <a href="#features" class="text-sm font-medium text-gray-300 transition-colors hover:text-white">Fitur</a>
          <a href="#how-it-works" class="text-sm font-medium text-gray-300 transition-colors hover:text-white">Cara Kerja</a>
          <a href="#cta" class="text-sm font-medium text-gray-300 transition-colors hover:text-white">Mulai</a>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/login" class="hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white sm:block">
            Masuk
          </NuxtLink>
          <NuxtLink to="/login" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-500">
            Mulai Gratis
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

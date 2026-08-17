<template>
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1f21] bg-[#040506]/90 backdrop-blur-md">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-full border border-[#55b3ff]/40 bg-[#55b3ff]/10 shadow-[rgb(22,23,25)_0px_0px_0px_1px,rgb(4,5,6)_0px_0px_0px_1px_inset]">
            <span class="text-sm font-bold text-[#55b3ff]">O</span>
          </div>
          <span class="text-lg font-bold tracking-tight text-white">OmniSync</span>
        </NuxtLink>
        <div class="hidden items-center gap-8 md:flex">
          <a href="/landing#features" class="text-sm font-medium text-[#c8c8ca] transition-colors hover:text-white">Fitur</a>
          <a href="/landing#how-it-works" class="text-sm font-medium text-[#c8c8ca] transition-colors hover:text-white">Cara Kerja</a>
          <NuxtLink to="/portfolio/suwardi87" class="group flex items-center gap-1.5 text-sm font-medium text-[#6cbfff] transition-colors hover:text-[#83cbff]">
            Portofolio
            <svg class="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink external to="/cms/login" class="hidden rounded-full px-4 py-2 text-sm font-medium text-[#c8c8ca] transition-colors hover:text-white sm:block">
            Masuk
          </NuxtLink>
          <NuxtLink to="/portfolio/suwardi87" class="rounded-full bg-[#55b3ff] px-4 py-2 text-sm font-semibold text-[#07080a] transition-colors hover:bg-[#6cbfff]">
            Lihat Portofolio
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>
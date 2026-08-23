<template>
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1f21] bg-[#040506]/90 backdrop-blur-md">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <NuxtLink to="/portfolio/suwardi87" class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-full border border-[#55b3ff]/40 bg-[#55b3ff]/10 shadow-[rgb(22,23,25)_0px_0px_0px_1px,rgb(4,5,6)_0px_0px_0px_1px_inset]">
            <span class="text-sm font-bold text-[#55b3ff]">S</span>
          </div>
          <span class="text-lg font-bold tracking-tight text-white">Suwardi</span>
        </NuxtLink>

        <div class="hidden items-center gap-8 md:flex">
          <a href="#proyek" class="text-sm font-medium text-[#c8c8ca] transition-colors hover:text-white">Proyek</a>
          <a href="#pengalaman" class="text-sm font-medium text-[#c8c8ca] transition-colors hover:text-white">Pengalaman</a>
          <a href="#pendidikan" class="text-sm font-medium text-[#c8c8ca] transition-colors hover:text-white">Pendidikan</a>
          <a href="#sertifikat" class="text-sm font-medium text-[#c8c8ca] transition-colors hover:text-white">Sertifikat</a>
        </div>

        <a
          :href="`/api/download-cv?username=${username}`"
          target="_blank"
          class="inline-flex items-center gap-2 rounded-full bg-[#55b3ff] px-4 py-2 text-sm font-semibold text-[#07080a] transition-colors hover:bg-[#6cbfff]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Unduh CV
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const username = computed(() => (route.params.username as string) || 'suwardi87')
</script>

<template>
  <section id="cta" class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 py-24">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.12),transparent_50%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_50%)]"></div>
    <!-- Animated glow -->
    <div class="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/15 blur-[120px] animate-pulse" style="animation-duration: 5s"></div>

    <div class="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <div v-reveal class="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300 backdrop-blur-sm">
        <span class="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
        Gratis Selamanya
      </div>

      <h2 v-reveal="{ delay: 80 }" class="bg-gradient-to-br from-white via-indigo-100 to-purple-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
        Siap Membangun Portofolio yang Benar-benar Menjual?
      </h2>

      <p v-reveal="{ delay: 160 }" class="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
        Gabungkan GitHub, sinkron proyek otomatis, screenshot real preview,
        dan CV AI-generated — semua dalam <span class="font-semibold text-indigo-300">satu platform</span>.
      </p>

      <div v-reveal="{ delay: 240 }" class="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <NuxtLink
          external
          to="/cms/login"
          class="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:shadow-2xl hover:shadow-indigo-600/40"
        >
          Mulai Gratis Sekarang
          <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
        <NuxtLink
          to="/portfolio/suwardi87"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-200 transition-all hover:border-gray-400 hover:text-white"
        >
          Lihat Contoh Portofolio
        </NuxtLink>
      </div>

      <!-- Trust signals -->
      <div v-reveal="{ delay: 320 }" class="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
        <div class="text-center">
          <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p class="text-xs text-gray-400">Setup &lt; 5 menit</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <p class="text-xs text-gray-400">Data aman</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </div>
          <p class="text-xs text-gray-400">Auto-sync GitHub</p>
        </div>
      </div>

      <p v-reveal="{ delay: 400 }" class="mt-8 text-xs text-gray-500">
        Tidak perlu kartu kredit. Gratis selamanya untuk developer individual.
      </p>
    </div>
  </section>
</template>

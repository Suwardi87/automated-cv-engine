<template>
  <section id="cta" class="relative overflow-hidden bg-[#040506] py-24">
    <!-- Stripe pattern -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.04]" style="background-image: repeating-linear-gradient(-45deg, #55b3ff 0 2px, transparent 2px 18px);"></div>
    <div class="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#55b3ff]/[0.07] blur-[140px]"></div>

    <div class="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <div v-reveal class="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#8e8e90]">
        <span class="flex h-1.5 w-1.5 rounded-full bg-[#55b3ff]"></span>
        Gratis Selamanya
      </div>

      <h2 v-reveal="{ delay: 80 }" class="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
        Siap Membangun Portofolio yang Benar-benar Menjual?
      </h2>

      <p v-reveal="{ delay: 160 }" class="mx-auto mt-6 max-w-2xl text-lg text-[#c8c8ca] sm:text-xl">
        Gabungkan GitHub, sinkron proyek otomatis, screenshot real preview,
        dan CV AI-generated — semua dalam <span class="font-semibold text-[#6cbfff]">satu platform</span>.
      </p>

      <div v-reveal="{ delay: 240 }" class="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <NuxtLink
          external
          to="/cms/login"
          class="group inline-flex items-center gap-2 rounded-full bg-[#55b3ff] px-8 py-4 text-base font-bold text-[#07080a] transition-colors hover:bg-[#6cbfff]"
        >
          Mulai Gratis Sekarang
          <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
        <NuxtLink
          to="/portfolio/suwardi87"
          class="inline-flex items-center gap-2 rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-8 py-4 text-base font-semibold text-[#c8c8ca] transition-colors hover:border-[#262728] hover:bg-[#151617] hover:text-white"
        >
          Lihat Contoh Portofolio
        </NuxtLink>
      </div>

      <!-- Trust signals -->
      <div v-reveal="{ delay: 320 }" class="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-[#1e1f21] pt-8">
        <div class="text-center">
          <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-[#55b3ff]/30 bg-[#55b3ff]/10 text-[#55b3ff]">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p class="text-xs text-[#8e8e90]">Setup &lt; 5 menit</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-[#5fc992]/30 bg-[#5fc992]/10 text-[#5fc992]">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <p class="text-xs text-[#8e8e90]">Data aman</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-[#ffbc33]/30 bg-[#ffbc33]/10 text-[#ffbc33]">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </div>
          <p class="text-xs text-[#8e8e90]">Auto-sync GitHub</p>
        </div>
      </div>

      <p v-reveal="{ delay: 400 }" class="mt-8 text-xs text-[#5e5f61]">
        Tidak perlu kartu kredit. Gratis selamanya untuk developer individual.
      </p>
    </div>
  </section>
</template>
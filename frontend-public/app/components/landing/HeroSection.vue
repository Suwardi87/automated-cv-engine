<template>
  <section class="relative overflow-hidden bg-[#040506] pt-28">
    <!-- Signature diagonal stripe pattern -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-[0.05]" style="background-image: repeating-linear-gradient(-45deg, #55b3ff 0 2px, transparent 2px 18px);"></div>
    <!-- Glow -->
    <div class="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#55b3ff]/[0.08] blur-[140px]"></div>

    <div class="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <div v-reveal class="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-4 py-1.5 font-mono text-xs font-medium text-[#8e8e90]">
          <span class="flex h-2 w-2 rounded-full bg-[#55b3ff]"></span>
          // Mesin Portofolio Bertenaga AI
        </div>

        <h1 v-reveal="{ delay: 100 }" class="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Bangun Portofolio<br class="hidden sm:inline"> Bertenaga AI-mu
        </h1>

        <p v-reveal="{ delay: 200 }" class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#c8c8ca] sm:text-xl">
          Hubungkan GitHub, sinkronkan proyekmu, dan buat CV profesional —
          <span class="font-semibold text-[#6cbfff]">semua didukung AI, semua otomatis.</span>
        </p>

        <div v-reveal="{ delay: 300 }" class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NuxtLink
            to="/portfolio/suwardi87"
            class="group inline-flex items-center gap-2 rounded-full bg-[#55b3ff] px-8 py-3.5 text-base font-semibold text-[#07080a] transition-colors hover:bg-[#6cbfff]"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Lihat Portofolio Saya
            <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
          <NuxtLink
            external
            to="/cms/login"
            class="inline-flex items-center gap-2 rounded-full border border-[#1e1f21] bg-[#0c0d0e] px-8 py-3.5 text-base font-semibold text-[#c8c8ca] transition-colors hover:border-[#262728] hover:bg-[#151617] hover:text-white"
          >
            Mulai Gratis
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Stats -->
        <div v-reveal="{ delay: 400 }" class="mt-16 grid grid-cols-3 gap-4 sm:gap-8">
          <div class="text-center">
            <p class="text-3xl font-bold tracking-tight text-[#55b3ff] sm:text-4xl">76+</p>
            <p class="mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8e8e90]">Proyek Tersinkron</p>
          </div>
          <div class="border-x border-[#1e1f21] text-center">
            <p class="text-3xl font-bold tracking-tight text-[#55b3ff] sm:text-4xl">14</p>
            <p class="mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8e8e90]">Live Deployment</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold tracking-tight text-[#55b3ff] sm:text-4xl">25+</p>
            <p class="mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8e8e90]">Tech Stack</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
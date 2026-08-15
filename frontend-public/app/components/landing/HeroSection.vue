<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 pt-24">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
    <!-- Animated glow -->
    <div class="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px] animate-pulse" style="animation-duration: 4s"></div>
    <div class="absolute right-1/4 top-1/2 h-72 w-72 rounded-full bg-purple-500/15 blur-[120px] animate-pulse" style="animation-duration: 6s; animation-delay: 1s"></div>

    <div class="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <div v-reveal class="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm">
          <span class="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Mesin Portofolio Bertenaga AI
        </div>

        <h1 v-reveal="{ delay: 100 }" class="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-6xl lg:text-7xl">
          Bangun Portofolio<br class="hidden sm:inline"> Bertenaga AI-mu
        </h1>

        <p v-reveal="{ delay: 200 }" class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
          Hubungkan GitHub, sinkronkan proyekmu, dan buat CV profesional —
          <span class="font-semibold text-indigo-300">semua didukung AI, semua otomatis.</span>
        </p>

        <div v-reveal="{ delay: 300 }" class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NuxtLink
            to="/portfolio/suwardi87"
            class="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:shadow-xl hover:shadow-indigo-600/40"
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
            class="inline-flex items-center gap-2 rounded-xl border border-gray-600 px-8 py-3.5 text-base font-semibold text-gray-200 transition-all hover:border-gray-400 hover:text-white"
          >
            Mulai Gratis
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Trust signals / stats -->
        <div v-reveal="{ delay: 400 }" class="mt-16 grid grid-cols-3 gap-4 sm:gap-8">
          <div class="text-center">
            <p class="bg-gradient-to-br from-indigo-300 to-purple-300 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">76+</p>
            <p class="mt-1 text-xs font-medium text-gray-400 sm:text-sm">Proyek Tersinkron</p>
          </div>
          <div class="text-center border-x border-white/10">
            <p class="bg-gradient-to-br from-indigo-300 to-purple-300 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">14</p>
            <p class="mt-1 text-xs font-medium text-gray-400 sm:text-sm">Live Deployment</p>
          </div>
          <div class="text-center">
            <p class="bg-gradient-to-br from-indigo-300 to-purple-300 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">25+</p>
            <p class="mt-1 text-xs font-medium text-gray-400 sm:text-sm">Tech Stack</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom fade to next section -->
    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
  </section>
</template>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 pt-24">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
    <div class="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
          <span class="flex h-2 w-2 rounded-full bg-indigo-400"></span>
          Mesin Portofolio Bertenaga AI
        </div>
        <h1 class="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-6xl lg:text-7xl">
          Bangun Portofolio Bertenaga AI-mu
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
          Hubungkan GitHub, sinkronkan proyekmu, dan buat CV profesional — semua didukung AI.
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NuxtLink external to="/cms/login" class="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/30">
            Mulai
            <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </NuxtLink>
          <NuxtLink external to="/cms/dashboard" class="inline-flex items-center gap-2 rounded-xl border border-gray-600 px-8 py-3.5 text-base font-semibold text-gray-200 transition-all hover:border-gray-400 hover:text-white">
            Lihat Demo
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

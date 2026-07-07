<script setup lang="ts">
const auth = useAuthStore()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string
</script>

<template>
  <div class="flex min-h-screen bg-zinc-950">
    <!-- Kiri: Form -->
    <div class="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
      <div class="mx-auto w-full max-w-sm">
        <!-- Logo -->
        <NuxtLink to="/" class="mb-12 inline-flex items-center gap-2.5">
          <div class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <span class="text-base font-black text-white">O</span>
          </div>
          <span class="text-lg font-bold tracking-tight text-white">OmniSync</span>
        </NuxtLink>

        <!-- Headline -->
        <div class="mb-10">
          <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Selamat datang
            <span class="block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">kembali.</span>
          </h1>
          <p class="mt-3 text-sm leading-relaxed text-zinc-500">
            Masuk untuk mengelola portofolio, sinkronkan repositori, dan generate CV profesional.
          </p>
        </div>

        <!-- GitHub OAuth Button -->
        <button
          @click="auth.redirectOAuth('github', apiBase)"
          class="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-zinc-100 px-6 py-3.5 text-sm font-semibold text-zinc-900 transition-all hover:bg-white hover:shadow-lg hover:shadow-white/10"
        >
          <svg class="relative h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Masuk dengan GitHub
          <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-zinc-900/5 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
        </button>

        <!-- GitLab OAuth Button -->
        <button
          @click="auth.redirectOAuth('gitlab', apiBase)"
          class="group relative mt-3 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-zinc-800 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
        >
          <svg class="relative h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M 3.828 13.326 L 12 23 L 20.172 13.326 C 20.576 12.659 20.33 11.807 19.598 11.386 L 12 7 L 4.402 11.386 C 3.67 11.807 3.424 12.659 3.828 13.326 Z M 12 7 L 8.399 2.803 C 8.178 2.542 7.789 2.533 7.556 2.783 C 7.368 2.985 7.333 3.289 7.473 3.528 L 12 7 Z M 12 7 L 15.601 2.803 C 15.822 2.542 16.211 2.533 16.444 2.783 C 16.632 2.985 16.667 3.289 16.527 3.528 L 12 7 Z"/>
          </svg>
          Masuk dengan GitLab
          <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-zinc-900/5 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
        </button>

        <!-- Footer -->
        <p class="mt-8 text-center text-xs text-zinc-600">
          Dengan masuk, kamu menyetujui
          <button class="font-medium text-violet-400 hover:text-violet-300">Syarat & Ketentuan</button>
        </p>
      </div>
    </div>

    <!-- Kanan: Visual -->
    <div class="relative hidden lg:block lg:w-1/2">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-violet-950 via-zinc-950 to-fuchsia-950"></div>

      <!-- Glow effects -->
      <div class="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]"></div>
      <div class="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[120px]"></div>

      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M0 0h60v60H0z&quot; fill=&quot;none&quot; stroke=&quot;white&quot; stroke-width=&quot;1&quot;/%3E%3C/svg%3E');"></div>

      <!-- Content -->
      <div class="relative flex h-full flex-col justify-center px-12 xl:px-20">
        <div class="max-w-md">
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-violet-300 backdrop-blur-sm">
            <span class="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse"></span>
            AI-Powered Portfolio Engine
          </div>

          <h2 class="text-4xl font-bold leading-tight text-white xl:text-5xl">
            Satu platform untuk
            <span class="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">seluruh karyamu.</span>
          </h2>

          <p class="mt-6 text-base leading-relaxed text-zinc-400">
            Hubungkan GitHub, sinkronkan proyek, dan biarkan AI menyusun portofolio terbaikmu. Generate CV profesional dalam hitungan detik.
          </p>

          <!-- Stats -->
          <div class="mt-12 grid grid-cols-3 gap-6">
            <div>
              <p class="text-3xl font-bold text-white">42</p>
              <p class="mt-1 text-xs text-zinc-500">Repositori</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">6</p>
              <p class="mt-1 text-xs text-zinc-500">Proyek Unggulan</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">248</p>
              <p class="mt-1 text-xs text-zinc-500">Followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

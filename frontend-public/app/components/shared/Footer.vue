<template>
  <footer class="border-t border-[#1e1f21] bg-[#040506]">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-3">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="flex h-7 w-7 items-center justify-center rounded-full border border-[#55b3ff]/40 bg-[#55b3ff]/10">
              <span class="text-xs font-bold text-[#55b3ff]">O</span>
            </div>
            <span class="font-bold text-white">OmniSync</span>
          </NuxtLink>
          <p class="text-sm text-[#8e8e90]">Platform portofolio terpadu dengan pembuatan CV berbasis AI.</p>
        </div>
        <div>
          <h3 class="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-white">Produk</h3>
          <ul class="space-y-2">
            <li><a href="/landing#features" class="text-sm text-[#8e8e90] transition-colors hover:text-white">Fitur</a></li>
            <li><a href="/landing#how-it-works" class="text-sm text-[#8e8e90] transition-colors hover:text-white">Cara Kerja</a></li>
            <li><NuxtLink to="/portfolio/suwardi87" class="text-sm text-[#6cbfff] transition-colors hover:text-[#83cbff]">Lihat Portofolio</NuxtLink></li>
            <li><a href="/landing#cta" class="text-sm text-[#8e8e90] transition-colors hover:text-white">Mulai</a></li>
          </ul>
        </div>
        <div>
          <h3 class="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-white">Hukum</h3>
          <ul class="space-y-2">
            <li><NuxtLink external to="/cms/login" class="text-sm text-[#8e8e90] transition-colors hover:text-white">Privasi</NuxtLink></li>
            <li><NuxtLink external to="/cms/login" class="text-sm text-[#8e8e90] transition-colors hover:text-white">Ketentuan</NuxtLink></li>
            <li><NuxtLink external to="/cms/login" class="text-sm text-[#8e8e90] transition-colors hover:text-white">Kontak</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-white">Teknologi</h3>
          <ul class="space-y-2">
            <li class="text-sm text-[#8e8e90]">Dibangun dengan Nuxt &amp; NestJS</li>
            <li class="text-sm text-[#8e8e90]">Didukung AI</li>
          </ul>
        </div>
      </div>
      <div class="mt-10 border-t border-[#1e1f21] pt-6 text-center">
        <p class="font-mono text-xs text-[#5e5f61]">&copy; {{ year }} OmniSync. Semua hak dilindungi.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
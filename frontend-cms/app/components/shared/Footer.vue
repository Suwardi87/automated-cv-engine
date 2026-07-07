<template>
  <footer class="border-t border-gray-800 bg-gray-900">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-3">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-purple-600">
              <span class="text-xs font-bold text-white">O</span>
            </div>
            <span class="font-bold text-white">OmniSync</span>
          </NuxtLink>
          <p class="text-sm text-gray-400">Platform portofolio terpadu dengan pembuatan CV berbasis AI.</p>
        </div>
        <div>
          <h3 class="mb-3 text-sm font-semibold text-white">Produk</h3>
          <ul class="space-y-2">
            <li><a href="#features" class="text-sm text-gray-400 transition-colors hover:text-white">Fitur</a></li>
            <li><a href="#how-it-works" class="text-sm text-gray-400 transition-colors hover:text-white">Cara Kerja</a></li>
            <li><a href="#cta" class="text-sm text-gray-400 transition-colors hover:text-white">Mulai</a></li>
          </ul>
        </div>
        <div>
          <h3 class="mb-3 text-sm font-semibold text-white">Hukum</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/login" class="text-sm text-gray-400 transition-colors hover:text-white">Privasi</NuxtLink></li>
            <li><NuxtLink to="/login" class="text-sm text-gray-400 transition-colors hover:text-white">Ketentuan</NuxtLink></li>
            <li><NuxtLink to="/login" class="text-sm text-gray-400 transition-colors hover:text-white">Kontak</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="mb-3 text-sm font-semibold text-white">Teknologi</h3>
          <ul class="space-y-2">
            <li class="text-sm text-gray-400">Dibangun dengan Nuxt &amp; NestJS</li>
            <li class="text-sm text-gray-400">Didukung AI</li>
          </ul>
        </div>
      </div>
      <div class="mt-10 border-t border-gray-800 pt-6 text-center">
        <p class="text-sm text-gray-500">&copy; {{ year }} OmniSync. Semua hak dilindungi.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
